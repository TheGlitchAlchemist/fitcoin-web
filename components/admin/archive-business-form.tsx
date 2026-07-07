"use client";

import { Archive } from "lucide-react";
import { archiveBusiness } from "@/app/(admin)/admin/businesses/actions";

type ArchiveBusinessFormProps = {
  businessId: string;
  businessName: string;
};

export function ArchiveBusinessForm({
  businessId,
  businessName,
}: ArchiveBusinessFormProps) {
  return (
    <form
      action={archiveBusiness}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `¿Seguro que quieres archivar el negocio "${businessName}"? Esta acción ocultará el negocio del uso normal, pero conservará su historial.`
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={businessId} />

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:border-red-400 hover:text-red-500"
      >
        <Archive className="h-4 w-4" />
        Archivar
      </button>
    </form>
  );
}