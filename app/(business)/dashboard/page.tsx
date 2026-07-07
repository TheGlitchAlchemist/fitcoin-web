import { Boxes, CheckCircle2, Clock, Tag } from "lucide-react";
import { requireBusiness } from "@/lib/auth/current-user";
import { supabaseServiceRole } from "@/lib/supabase/service-role";
import { PageHero } from "@/components/dashboard/page-hero";
import { StatCard } from "@/components/dashboard/stat-card";

export default async function DashboardHomePage() {
  const { business } = await requireBusiness();

  const [activeOffers, pendingRedemptions, usedRedemptions, offersForStock] =
    await Promise.all([
      supabaseServiceRole
        .from("offers")
        .select("id", { count: "exact", head: true })
        .eq("business_id", business.id)
        .eq("active", true),

      supabaseServiceRole
        .from("redemptions")
        .select("id", { count: "exact", head: true })
        .eq("business_id", business.id)
        .eq("status", "issued"),

      supabaseServiceRole
        .from("redemptions")
        .select("id", { count: "exact", head: true })
        .eq("business_id", business.id)
        .eq("status", "used"),

      supabaseServiceRole
        .from("offers")
        .select("stock_available")
        .eq("business_id", business.id),
    ]);

  const totalStock = (offersForStock.data ?? []).reduce(
    (sum, offer) => sum + (offer.stock_available ?? 0),
    0
  );

  return (
    <>
      <PageHero
        title={`Hola, ${business.name}`}
        description="Este es el resumen de tu negocio dentro del ecosistema Fitcoin: tus ofertas, tus canjes y el stock disponible en un solo lugar."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Tag}
          tag="Activas"
          label="Ofertas activas"
          value={activeOffers.count ?? 0}
        />

        <StatCard
          icon={Clock}
          iconClassName="bg-amber-50 text-amber-600"
          tagClassName="bg-amber-50 text-amber-700"
          tag="Pendientes"
          label="Canjes pendientes"
          value={pendingRedemptions.count ?? 0}
        />

        <StatCard
          icon={CheckCircle2}
          iconClassName="bg-slate-100 text-slate-600"
          tagClassName="bg-slate-100 text-slate-600"
          tag="Usados"
          label="Canjes usados"
          value={usedRedemptions.count ?? 0}
        />

        <StatCard
          icon={Boxes}
          tag="Disponible"
          label="Stock disponible total"
          value={totalStock}
        />
      </div>
    </>
  );
}