import { PageHero } from "@/components/dashboard/page-hero";
import { OfferForm } from "@/components/dashboard/offer-form";
import { createOffer } from "../actions";

export default function NewOfferPage() {
  return (
    <>
      <PageHero
        title="Nueva oferta"
        description="Registra una oferta nueva para tu negocio dentro del ecosistema Fitcoin."
      />

      <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <OfferForm action={createOffer} submitLabel="Guardar oferta" />
      </div>
    </>
  );
}