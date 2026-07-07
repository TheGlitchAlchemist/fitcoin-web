"use client";

import { useActionState } from "react";
import { CheckCircle2, Search, XCircle } from "lucide-react";
import { validateRedemption } from "@/app/(business)/dashboard/validate/actions";
import { formatFitcoins } from "@/lib/format";

const initialState = {
  status: "idle" as const,
};

export function ValidateForm() {
  const [state, formAction, isPending] = useActionState(
    validateRedemption,
    initialState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Código de canje
        </label>

        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />

          <input
            name="redemption_code"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#17A649]"
            placeholder="Ej. FC-8K29A"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-[#17A649] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#117A37] disabled:opacity-60"
      >
        {isPending ? "Validando..." : "Validar canje"}
      </button>

      {state.status === "error" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>{state.message}</p>
          </div>
        </div>
      )}

      {state.status === "success" && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-bold">{state.message}</p>

              {state.redemption && (
                <div className="mt-3 space-y-1 text-green-800">
                  <p>
                    <span className="font-semibold">Código:</span>{" "}
                    {state.redemption.code}
                  </p>
                  <p>
                    <span className="font-semibold">Oferta:</span>{" "}
                    {state.redemption.offerTitle}
                  </p>
                  <p>
                    <span className="font-semibold">Usuario:</span>{" "}
                    {state.redemption.userLabel}
                  </p>
                  <p>
                    <span className="font-semibold">Precio:</span>{" "}
                    {formatFitcoins(state.redemption.fitcoinPrice)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}