"use client";

import { useActionState } from "react";
import type { Offer } from "@/lib/dashboard-types";
import type { OfferFormState } from "@/app/(business)/dashboard/offers/actions";

type OfferFormProps = {
  action: (
    prevState: OfferFormState,
    formData: FormData
  ) => Promise<OfferFormState>;
  offer?: Offer;
  submitLabel: string;
};

export function OfferForm({ action, offer, submitLabel }: OfferFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Título
          </label>
          <input
            name="title"
            defaultValue={offer?.title ?? ""}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#17A649]"
            placeholder="Ej. 2x1 en bebida deportiva"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Imagen URL
          </label>
          <input
            name="image_url"
            defaultValue={offer?.image_url ?? ""}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#17A649]"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Descripción
        </label>
        <textarea
          name="description"
          defaultValue={offer?.description ?? ""}
          rows={4}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#17A649]"
          placeholder="Describe la promoción, restricciones o condiciones."
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Precio en Fitcoins
          </label>
          <input
            type="number"
            name="fitcoin_price"
            min={0}
            defaultValue={offer?.fitcoin_price ?? 0}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#17A649]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Stock total
          </label>
          <input
            type="number"
            name="stock_total"
            min={0}
            defaultValue={offer?.stock_total ?? 0}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#17A649]"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Inicia
          </label>
          <input
            type="datetime-local"
            name="starts_at"
            defaultValue={toDateTimeLocal(offer?.starts_at)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#17A649]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            Termina
          </label>
          <input
            type="datetime-local"
            name="ends_at"
            defaultValue={toDateTimeLocal(offer?.ends_at)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#17A649]"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          name="active"
          defaultChecked={offer?.active ?? true}
          className="h-4 w-4 accent-[#17A649]"
        />
        Oferta activa
      </label>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-[#17A649] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#117A37] disabled:opacity-60"
        >
          {isPending ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 16);
}