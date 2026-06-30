"use server";

import { revalidatePath } from "next/cache";
import { supabaseServiceRole } from "@/lib/supabase/service-role";

export async function createBusiness(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const status = String(formData.get("status") ?? "active");

  if (!name) {
    throw new Error("El nombre del negocio es obligatorio.");
  }

  const { error } = await supabaseServiceRole.from("businesses").insert({
    name,
    description: description || null,
    address: address || null,
    status,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/businesses");
  revalidatePath("/admin");
}

export async function toggleBusinessStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const currentStatus = String(formData.get("currentStatus") ?? "inactive");

  if (!id) {
    throw new Error("No se recibió el ID del negocio.");
  }

  const nextStatus = currentStatus === "active" ? "inactive" : "active";

  const { error } = await supabaseServiceRole
    .from("businesses")
    .update({
      status: nextStatus,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/businesses");
  revalidatePath("/admin");
}