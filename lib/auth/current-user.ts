import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseServiceRole } from "@/lib/supabase/service-role";

export type UserProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "admin" | "business";
  status: string;
};

export type BusinessMembership = {
  id: string;
  business_id: string;
  profile_id: string;
  role: string;
  status: string;
  created_at: string;
};

export type Business = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  address: string | null;
  logo_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
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
    .select("id, full_name, email, role, status")
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

  const { data: membership, error: membershipError } = await supabaseServiceRole
    .from("business_members")
    .select("id, business_id, profile_id, role, status, created_at")
    .eq("profile_id", session.profile.id)
    .eq("status", "active")
    .maybeSingle();

  if (membershipError || !membership) {
    redirect("/login?error=Usuario de negocio sin negocio asignado");
  }

  const { data: business, error: businessError } = await supabaseServiceRole
    .from("businesses")
    .select(
      "id, name, slug, description, address, logo_url, status, created_at, updated_at"
    )
    .eq("id", membership.business_id)
    .maybeSingle();

  if (businessError || !business) {
    redirect("/login?error=Negocio no encontrado");
  }

  if (business.status !== "active") {
    redirect("/login?error=Negocio inactivo");
  }

  return {
    ...session,
    membership: membership as BusinessMembership,
    business: business as Business,
  };
}