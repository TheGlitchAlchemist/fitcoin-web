"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { createOffer } from "@/app/(business)/dashboard/offers/actions";
import { OfferForm } from "@/components/dashboard/offer-form";

export function NewOfferModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-[#17A649] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#17A649]/20 transition hover:bg-[#2CBF42] sm:w-auto"
      >
        Nueva oferta
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0B1A26]/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-white/10 bg-white shadow-2xl sm:max-w-3xl sm:rounded-[2rem]">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#17A649]">
                  Nueva oferta
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#0B1A26]">
                  Agregar promoción
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Completa los datos de la oferta que verá el usuario en el marketplace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-white text-[#0B1A26] transition hover:bg-slate-50"
                aria-label="Cerrar modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <OfferForm
                action={createOffer}
                submitLabel="Guardar oferta"
                cancelLabel="Volver a ofertas"
                onCancel={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}