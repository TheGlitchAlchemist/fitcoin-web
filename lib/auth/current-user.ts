import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseServiceRole } from "@/lib/supabase/service-role";

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: "admin" | "business";
  business_id: string | null;
  status: string;
};

export async function getCurrentUserProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabaseServiceRole
    .from("profiles")
    .select("id, full_name, email, role, business_id, status")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return {
    user,
    profile: profile as UserProfile,
  };
}

export async function requireAdmin() {
  const session = await getCurrentUserProfile();

  if (!session) {
    redirect("/login");
  }

  if (session.profile.status !== "active") {
    redirect("/login?error=Usuario inactivo");
  }

  if (session.profile.role !== "admin") {
    redirect("/dashboard");
  }

  return session;
}

export async function requireBusiness() {
  const session = await getCurrentUserProfile();

  if (!session) {
    redirect("/login");
  }

  if (session.profile.status !== "active") {
    redirect("/login?error=Usuario inactivo");
  }

  if (session.profile.role !== "business") {
    redirect("/admin");
  }

  if (!session.profile.business_id) {
    redirect("/login?error=Usuario de negocio sin negocio asignado");
  }

  return session;
}