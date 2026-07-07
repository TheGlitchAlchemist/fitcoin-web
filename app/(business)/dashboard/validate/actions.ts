"use server";

import { revalidatePath } from "next/cache";
import { requireBusiness } from "@/lib/auth/current-user";
import { supabaseServiceRole } from "@/lib/supabase/service-role";

export interface ValidateState {
    status: "idle" | "success" | "error";
    message?: string;
    redemption?: {
        code: string;
        offerTitle: string;
        userLabel: string;
        fitcoinPrice: number;
    };
}

export async function validateRedemption(
    _prevState: ValidateState,
    formData: FormData
): Promise<ValidateState> {
    const { business, profile } = await requireBusiness();

    const code = String(formData.get("redemption_code") ?? "").trim();

    if (!code) {
        return {
            status: "error",
            message: "Ingresa un código de canje.",
        };
    }

    const { data: redemption, error: fetchError } = await supabaseServiceRole
        .from("redemptions")
        .select("*")
        .eq("redemption_code", code)
        .maybeSingle();

    if (fetchError || !redemption) {
        return {
            status: "error",
            message: "No se encontró ningún canje con ese código.",
        };
    }

    if (redemption.business_id !== business.id) {
        return {
            status: "error",
            message: "Este código no pertenece a tu negocio.",
        };
    }

    if (redemption.status !== "issued") {
        return {
            status: "error",
            message: `Este canje ya no está disponible para validar. Estado actual: ${redemption.status}.`,
        };
    }

    if (redemption.expires_at && new Date(redemption.expires_at) < new Date()) {
        await supabaseServiceRole
            .from("redemptions")
            .update({ status: "expired" })
            .eq("id", redemption.id)
            .eq("business_id", business.id);

        return {
            status: "error",
            message: "Este código ya expiró.",
        };
    }

    const now = new Date().toISOString();

    const { error: updateError } = await supabaseServiceRole
        .from("redemptions")
        .update({
            status: "used",
            used_at: now,
            used_by: profile.id,
        })
        .eq("id", redemption.id)
        .eq("business_id", business.id)
        .eq("status", "issued");

    if (updateError) {
        return {
            status: "error",
            message: "No se pudo validar el canje. Intenta de nuevo.",
        };
    }

    await supabaseServiceRole.from("audit_logs").insert({
        actor_id: profile.id,
        action: "redemption.validated",
        target_table: "redemptions",
        target_id: redemption.id,
        metadata: {
            business_id: business.id,
            redemption_code: redemption.redemption_code,
        },
    });

    const [{ data: offer }, { data: user }] = await Promise.all([
        supabaseServiceRole
            .from("offers")
            .select("title")
            .eq("id", redemption.offer_id)
            .single(),

        supabaseServiceRole
            .from("profiles")
            .select("full_name, email")
            .eq("id", redemption.user_id)
            .single(),
    ]);

    revalidatePath("/dashboard/redemptions");
    revalidatePath("/dashboard");

    return {
        status: "success",
        message: "Canje validado correctamente.",
        redemption: {
            code: redemption.redemption_code,
            offerTitle: offer?.title ?? "—",
            userLabel: user?.full_name ?? user?.email ?? "—",
            fitcoinPrice: redemption.fitcoin_price_at_purchase,
        },
    };
}