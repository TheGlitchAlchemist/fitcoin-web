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
  cancelLabel?: string;
  onCancel?: () => void;
};

export function OfferForm({
  action,
  offer,
  submitLabel,
  cancelLabel = "Cancelar",
  onCancel,
}: OfferFormProps) {
  const [state, formAction, isPending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#0B1A26]">Título</label>
          <input
            name="title"
            defaultValue={offer?.title ?? ""}
            required
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0B1A26] outline-none transition focus:border-[#17A649] focus:ring-4 focus:ring-[#17A649]/10"
            placeholder="Ej. 2x1 en bebida deportiva"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#0B1A26]">
            Imagen URL
          </label>
          <input
            name="image_url"
            defaultValue={offer?.image_url ?? ""}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0B1A26] outline-none transition focus:border-[#17A649] focus:ring-4 focus:ring-[#17A649]/10"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-[#0B1A26]">
          Descripción
        </label>
        <textarea
          name="description"
          defaultValue={offer?.description ?? ""}
          rows={4}
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0B1A26] outline-none transition focus:border-[#17A649] focus:ring-4 focus:ring-[#17A649]/10"
          placeholder="Describe la promoción, restricciones o condiciones."
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#0B1A26]">
            Precio en Fitcoins
          </label>
          <input
            type="number"
            name="fitcoin_price"
            min={0}
            defaultValue={offer?.fitcoin_price ?? 0}
            required
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0B1A26] outline-none transition focus:border-[#17A649] focus:ring-4 focus:ring-[#17A649]/10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#0B1A26]">
            Stock total
          </label>
          <input
            type="number"
            name="stock_total"
            min={0}
            defaultValue={offer?.stock_total ?? 0}
            required
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0B1A26] outline-none transition focus:border-[#17A649] focus:ring-4 focus:ring-[#17A649]/10"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#0B1A26]">Inicia</label>
          <input
            type="datetime-local"
            name="starts_at"
            defaultValue={toDateTimeLocal(offer?.starts_at)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0B1A26] outline-none transition focus:border-[#17A649] focus:ring-4 focus:ring-[#17A649]/10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#0B1A26]">Termina</label>
          <input
            type="datetime-local"
            name="ends_at"
            defaultValue={toDateTimeLocal(offer?.ends_at)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#0B1A26] outline-none transition focus:border-[#17A649] focus:ring-4 focus:ring-[#17A649]/10"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm font-bold text-[#0B1A26]">
        <input
          type="checkbox"
          name="active"
          defaultChecked={offer?.active ?? true}
          className="h-4 w-4 accent-[#17A649]"
        />
        Oferta activa
      </label>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#0B1A26] transition hover:bg-slate-50 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-2xl bg-[#17A649] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2CBF42] disabled:opacity-60"
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