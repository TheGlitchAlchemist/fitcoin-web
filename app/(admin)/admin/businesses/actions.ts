"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServiceRole } from "@/lib/supabase/service-role";
import { randomBytes, randomUUID } from "crypto";

function buildUrl(path: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  return `${path}?${searchParams.toString()}`;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 32) || "negocio";
}

function generateTemporaryPassword() {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

  const bytes = randomBytes(10);

  const randomPart = Array.from(bytes)
    .map((byte) => chars[byte % chars.length])
    .join("");

  return `Fit-${randomPart}`;
}

export async function createBusiness(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const status = String(formData.get("status") ?? "active");

  const accountFullName =
    String(formData.get("accountFullName") ?? "").trim() ||
    `Encargado ${name}`;

  const accountEmailInput = String(formData.get("accountEmail") ?? "")
    .trim()
    .toLowerCase();

  if (!name) {
    redirect(
      buildUrl("/admin/businesses", {
        error: "El nombre del negocio es obligatorio.",
      })
    );
  }

  const generatedEmail = `${slugify(name)}.${randomUUID().slice(
    0,
    8
  )}@fitcoin.test`;

  const accountEmail = accountEmailInput || generatedEmail;
  const temporaryPassword = generateTemporaryPassword();

  const { data: business, error: businessError } = await supabaseServiceRole
    .from("businesses")
    .insert({
      name,
      description: description || null,
      address: address || null,
      status,
    })
    .select("id, name")
    .single();

  if (businessError || !business) {
    redirect(
      buildUrl("/admin/businesses", {
        error: businessError?.message ?? "No se pudo crear el negocio.",
      })
    );
  }

  const { data: authData, error: authError } =
    await supabaseServiceRole.auth.admin.createUser({
      email: accountEmail,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        full_name: accountFullName,
        role: "business",
        business_id: business.id,
      },
    });

  if (authError || !authData.user) {
    await supabaseServiceRole.from("businesses").delete().eq("id", business.id);

    redirect(
      buildUrl("/admin/businesses", {
        error:
          authError?.message ??
          "El negocio se creó, pero no se pudo crear el usuario de acceso.",
      })
    );
  }

  const { error: profileError } = await supabaseServiceRole
    .from("profiles")
    .upsert(
      {
        id: authData.user.id,
        full_name: accountFullName,
        email: accountEmail,
        role: "business",
        business_id: business.id,
        status: "active",
      },
      {
        onConflict: "id",
      }
    );

  if (profileError) {
    await supabaseServiceRole.auth.admin.deleteUser(authData.user.id);
    await supabaseServiceRole.from("businesses").delete().eq("id", business.id);

    redirect(
      buildUrl("/admin/businesses", {
        error: profileError.message,
      })
    );
  }

  revalidatePath("/admin/businesses");
  revalidatePath("/admin");

  redirect(
    buildUrl("/admin/businesses", {
      success: "Negocio y usuario de acceso creados correctamente.",
      accountEmail,
      temporaryPassword,
    })
  );
}

export async function updateBusiness(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const status = String(formData.get("status") ?? "active");

  if (!id) {
    redirect(
      buildUrl("/admin/businesses", {
        error: "No se recibió el ID del negocio.",
      })
    );
  }

  if (!name) {
    redirect(
      buildUrl(`/admin/businesses/${id}/edit`, {
        error: "El nombre del negocio es obligatorio.",
      })
    );
  }

  const { error } = await supabaseServiceRole
    .from("businesses")
    .update({
      name,
      description: description || null,
      address: address || null,
      status,
    })
    .eq("id", id);

  if (error) {
    redirect(
      buildUrl(`/admin/businesses/${id}/edit`, {
        error: error.message,
      })
    );
  }

  revalidatePath("/admin/businesses");
  revalidatePath(`/admin/businesses/${id}/edit`);
  revalidatePath("/admin");

  redirect(
    buildUrl("/admin/businesses", {
      success: "Negocio actualizado correctamente.",
    })
  );
}

export async function toggleBusinessStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const currentStatus = String(formData.get("currentStatus") ?? "inactive");

  if (!id) {
    redirect(
      buildUrl("/admin/businesses", {
        error: "No se recibió el ID del negocio.",
      })
    );
  }

  const nextStatus = currentStatus === "active" ? "inactive" : "active";

  const { error } = await supabaseServiceRole
    .from("businesses")
    .update({
      status: nextStatus,
    })
    .eq("id", id);

  if (error) {
    redirect(
      buildUrl("/admin/businesses", {
        error: error.message,
      })
    );
  }

  revalidatePath("/admin/businesses");
  revalidatePath("/admin");

  redirect(
    buildUrl("/admin/businesses", {
      success:
        nextStatus === "active"
          ? "Negocio activado correctamente."
          : "Negocio desactivado correctamente.",
    })
  );
}

export async function archiveBusiness(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirect(
      buildUrl("/admin/businesses", {
        error: "No se recibió el ID del negocio.",
      })
    );
  }

  const { error } = await supabaseServiceRole
    .from("businesses")
    .update({
      status: "archived",
    })
    .eq("id", id);

  if (error) {
    redirect(
      buildUrl("/admin/businesses", {
        error: error.message,
      })
    );
  }

  revalidatePath("/admin/businesses");
  revalidatePath("/admin");

  redirect(
    buildUrl("/admin/businesses", {
      success: "Negocio archivado correctamente.",
    })
  );
}

export async function restoreBusiness(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();

  if (!id) {
    redirect(
      buildUrl("/admin/businesses", {
        error: "No se recibió el ID del negocio.",
      })
    );
  }

  const { error } = await supabaseServiceRole
    .from("businesses")
    .update({
      status: "active",
    })
    .eq("id", id);

  if (error) {
    redirect(
      buildUrl("/admin/businesses", {
        error: error.message,
      })
    );
  }

  revalidatePath("/admin/businesses");
  revalidatePath("/admin");

  redirect(
    buildUrl("/admin/businesses", {
      success: "Negocio restaurado correctamente.",
    })
  );
}