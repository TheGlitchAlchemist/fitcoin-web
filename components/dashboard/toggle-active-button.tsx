"use client";

import { useTransition } from "react";

export function ToggleActiveButton({
  active,
  onToggle,
}: {
  active: boolean;
  onToggle: (nextActive: boolean) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => onToggle(!active))}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
        active
          ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
          : "bg-[#17A649] text-white hover:bg-[#117A37]"
      }`}
    >
      {isPending ? "Guardando..." : active ? "Desactivar" : "Activar"}
    </button>
  );
}