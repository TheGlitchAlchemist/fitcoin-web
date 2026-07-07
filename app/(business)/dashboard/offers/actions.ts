"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireBusiness } from "@/lib/auth/current-user";
import { supabaseServiceRole } from "@/lib/supabase/service-role";

export interface OfferFormState {
  error?: string;
}

function parseOfferForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim();
  const fitcoin_price = Number(formData.get("fitcoin_price"));
  const stock_total = Number(formData.get("stock_total"));
  const starts_at = String(formData.get("starts_at") ?? "").trim();
  const ends_at = String(formData.get("ends_at") ?? "").trim();

  if (!title) return { error: "El título es obligatorio." };

  if (!Number.isFinite(fitcoin_price) || fitcoin_price < 0) {
    return { error: "El precio en fitcoins debe ser un número válido." };
  }

  if (!Number.isInteger(stock_total) || stock_total < 0) {
    return { error: "El stock total debe ser un entero mayor o igual a 0." };
  }

  return {
    values: {
      title,
      description: description || null,
      image_url: image_url || null,
      fitcoin_price,
      stock_total,
      starts_at: starts_at || null,
      ends_at: ends_at || null,
    },
  };
}

export async function createOffer(
  _prevState: OfferFormState,
  formData: FormData
): Promise<OfferFormState> {
  const { business } = await requireBusiness();

  const parsed = parseOfferForm(formData);

  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const { error } = await supabaseServiceRole.from("offers").insert({
    business_id: business.id,
    ...parsed.values,
    stock_available: parsed.values.stock_total,
    active: formData.get("active") === "on",
  });

  if (error) {
  console.error("[createOffer] error =", error);

  return {
    error: `No se pudo crear la oferta: ${error.message}`,
  };
}

  revalidatePath("/dashboard/offers");
  revalidatePath("/dashboard");

  redirect("/dashboard/offers");
}

export async function updateOffer(
  offerId: string,
  _prevState: OfferFormState,
  formData: FormData
): Promise<OfferFormState> {
  const { business } = await requireBusiness();

  const parsed = parseOfferForm(formData);

  if ("error" in parsed) {
    return { error: parsed.error };
  }

  const { data: existing, error: fetchError } = await supabaseServiceRole
    .from("offers")
    .select("id, business_id, stock_total, stock_available")
    .eq("id", offerId)
    .single();

  if (fetchError || !existing || existing.business_id !== business.id) {
    return { error: "No tienes permiso para editar esta oferta." };
  }

  const delta = parsed.values.stock_total - existing.stock_total;
  const nextAvailable = Math.max(0, existing.stock_available + delta);

  const { error } = await supabaseServiceRole
    .from("offers")
    .update({
      ...parsed.values,
      stock_available: nextAvailable,
      active: formData.get("active") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", offerId)
    .eq("business_id", business.id);

  if (error) {
    return { error: "No se pudo actualizar la oferta. Intenta de nuevo." };
  }

  revalidatePath("/dashboard/offers");
  revalidatePath("/dashboard");

  redirect("/dashboard/offers");
}

export async function toggleOfferActive(offerId: string, nextActive: boolean) {
  const { business } = await requireBusiness();

  const { data: existing } = await supabaseServiceRole
    .from("offers")
    .select("id, business_id")
    .eq("id", offerId)
    .single();

  if (!existing || existing.business_id !== business.id) {
    throw new Error("No tienes permiso para modificar esta oferta.");
  }

  await supabaseServiceRole
    .from("offers")
    .update({
      active: nextActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", offerId)
    .eq("business_id", business.id);

  revalidatePath("/dashboard/offers");
  revalidatePath("/dashboard");
}