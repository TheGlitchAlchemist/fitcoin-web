import { notFound } from "next/navigation";
import { requireBusiness } from "@/lib/auth/current-user";
import { supabaseServiceRole } from "@/lib/supabase/service-role";
import { PageHero } from "@/components/dashboard/page-hero";
import { OfferForm } from "@/components/dashboard/offer-form";
import { updateOffer } from "../../actions";
import type { Offer } from "@/lib/dashboard-types";

export default async function EditOfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { business } = await requireBusiness();

  const { data: offer } = await supabaseServiceRole
    .from("offers")
    .select("*")
    .eq("id", id)
    .single();

  if (!offer || offer.business_id !== business.id) {
    notFound();
  }

  const boundUpdate = updateOffer.bind(null, offer.id);

  return (
    <>
      <PageHero
        title="Editar oferta"
        description={`Actualiza los detalles de "${offer.title}".`}
      />

      <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <OfferForm
          action={boundUpdate}
          offer={offer as Offer}
          submitLabel="Guardar cambios"
        />
      </div>
    </>
  );
}