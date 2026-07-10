import Link from "next/link";
import { ImageOff } from "lucide-react";
import { requireBusiness } from "@/lib/auth/current-user";
import { supabaseServiceRole } from "@/lib/supabase/service-role";
import { PageHero } from "@/components/dashboard/page-hero";
import { Badge } from "@/components/dashboard/badge";
import { ToggleActiveButton } from "@/components/dashboard/toggle-active-button";
import { formatFitcoins } from "@/lib/format";
import { toggleOfferActive } from "./actions";
import { NewOfferModal } from "@/components/dashboard/new-offer-modal";

export default async function OffersPage() {
  const { business } = await requireBusiness();

  const { data: offers } = await supabaseServiceRole
    .from("offers")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHero
        title="Ofertas"
        description="Administra las ofertas que tu negocio publica en Fitcoin: precio en Fitcoins, stock disponible y vigencia."
        action={<NewOfferModal />}
      />

      <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-900">Lista de ofertas</h2>
          <p className="text-sm text-slate-500">
            Registros obtenidos directamente desde Supabase.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="px-6 py-3 font-medium">Oferta</th>
                <th className="px-6 py-3 font-medium">Precio</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>

            <tbody>
              {(offers ?? []).map((offer) => (
                <tr
                  key={offer.id}
                  className="border-b border-slate-200 last:border-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-500">
                        <ImageOff size={16} />
                      </span>

                      <div>
                        <Link
                          href={`/dashboard/offers/${offer.id}/edit`}
                          className="font-semibold text-slate-900 hover:underline"
                        >
                          {offer.title}
                        </Link>

                        {offer.description && (
                          <p className="text-xs text-slate-500">
                            {offer.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {formatFitcoins(offer.fitcoin_price)}
                  </td>

                  <td className="px-6 py-4">
                    {offer.stock_available} / {offer.stock_total}
                  </td>

                  <td className="px-6 py-4">
                    <Badge status={offer.active ? "active" : "inactive"} />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/offers/${offer.id}/edit`}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Editar
                      </Link>

                      <ToggleActiveButton
                        active={offer.active}
                        onToggle={toggleOfferActive.bind(null, offer.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}

              {(!offers || offers.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    Aún no tienes ofertas. Crea la primera con “Nueva oferta”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}