"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseServiceRole } from "@/lib/supabase/service-role";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    redirect("/login?error=Completa correo y contraseña");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect("/login?error=Correo o contraseña incorrectos");
  }

  const { data: profile, error: profileError } = await supabaseServiceRole
    .from("profiles")
    .select("id, full_name, email, role, status")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    redirect("/login?error=El usuario no tiene perfil asignado");
  }

  if (profile.status !== "active") {
    await supabase.auth.signOut();
    redirect("/login?error=El usuario está inactivo");
  }

  if (profile.role === "admin") {
    redirect("/admin");
  }

  if (profile.role === "business") {
    redirect("/dashboard");
  }

  await supabase.auth.signOut();
  redirect("/login?error=Rol no autorizado");
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}