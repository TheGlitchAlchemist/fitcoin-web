"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServiceRole } from "@/lib/supabase/service-role";

function buildUrl(path: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  return `${path}?${searchParams.toString()}`;
}

export async function createBusiness(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const status = String(formData.get("status") ?? "active");

  if (!name) {
    redirect(
      buildUrl("/admin/businesses", {
        error: "El nombre del negocio es obligatorio.",
      })
    );
  }

  const { error } = await supabaseServiceRole.from("businesses").insert({
    name,
    description: description || null,
    address: address || null,
    status,
  });

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
      success: "Negocio creado correctamente.",
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