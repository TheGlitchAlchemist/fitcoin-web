import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, Save } from "lucide-react";
import { supabaseAdminServer } from "@/lib/supabase/admin-server";
import { updateBusiness } from "../../actions";
import { StatusMessage } from "@/components/ui/status-message";

type EditBusinessPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

type Business = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  status: string;
  created_at: string;
};

export default async function EditBusinessPage({
  params,
  searchParams,
}: EditBusinessPageProps) {
  const { id } = await params;
  const query = await searchParams;

  const { data: business, error } = await supabaseAdminServer
    .from("businesses")
    .select("id, name, description, address, status, created_at")
    .eq("id", id)
    .single<Business>();

  if (error || !business) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 rounded-[1.5rem] bg-[#0B1A26] p-5 text-white shadow-xl shadow-slate-900/10 sm:rounded-[2rem] sm:p-8 lg:flex-row lg:items-center">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-[#2CBF42]/30 bg-[#2CBF42]/10 px-4 py-2 text-sm font-medium text-[#2CBF42]">
            Editar negocio
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {business.name}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65">
            Actualiza la información general del negocio afiliado dentro del
            ecosistema Fitcoin.
          </p>
        </div>

        <Link
          href="/admin/businesses"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver
        </Link>
      </section>

      <StatusMessage success={query.success} error={query.error} />

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-[#17A649]/10 p-3 text-[#17A649]">
            <Building2 className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#0B1A26]">
              Información del negocio
            </h2>
            <p className="text-sm text-slate-500">
              Modifica los campos necesarios y guarda los cambios.
            </p>
          </div>
        </div>

        <form action={updateBusiness} className="grid gap-5 lg:grid-cols-2">
          <input type="hidden" name="id" value={business.id} />

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
              Nombre del negocio
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={business.name}
              className="w-full rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
              Estado
            </label>
            <select
              name="status"
              defaultValue={business.status}
              className="w-full rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="archived">Archivado</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
              Descripción
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={business.description ?? ""}
              placeholder="Describe brevemente el negocio..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
              Dirección
            </label>
            <input
              name="address"
              type="text"
              defaultValue={business.address ?? ""}
              placeholder="Ej. Colima, Colima"
              className="w-full rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#17A649] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#2CBF42]"
            >
              <Save className="h-5 w-5" />
              Guardar cambios
            </button>

            <Link
              href="/admin/businesses"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-[#F2F2F2]"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}