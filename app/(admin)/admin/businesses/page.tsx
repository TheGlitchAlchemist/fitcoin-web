import { createBusiness, toggleBusinessStatus } from "./actions";
import {
  Building2,
  MapPin,
  Plus,
  Search,
  Store,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { supabaseAdminServer } from "@/lib/supabase/admin-server";

type Business = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  status: string;
  created_at: string;
};

export default async function BusinessesPage() {
  const { data: businesses, error } = await supabaseAdminServer
    .from("businesses")
    .select("id, name, description, address, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-bold text-red-700">
          Error al cargar negocios
        </h1>
        <p className="mt-2 text-sm text-red-600">{error.message}</p>
      </div>
    );
  }

  const activeBusinesses =
    businesses?.filter((business) => business.status === "active").length ?? 0;

  const inactiveBusinesses =
    businesses?.filter((business) => business.status !== "active").length ?? 0;

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 rounded-[2rem] bg-[#0B1A26] p-8 text-white shadow-xl shadow-slate-900/10 lg:flex-row lg:items-center">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-[#2CBF42]/30 bg-[#2CBF42]/10 px-4 py-2 text-sm font-medium text-[#2CBF42]">
            Gestión de negocios
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            Negocios afiliados
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65">
            Administra los negocios que forman parte del ecosistema Fitcoin.
            Desde aquí podrás revisar su estado, dirección y datos principales.
          </p>
        </div>

        <a
          href="#new-business"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#17A649] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2CBF42]"
        >
          <Plus className="h-5 w-5" />
          Nuevo negocio
        </a>
      </section>

      <section
        id="new-business"
        className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#0B1A26]">
            Agregar negocio
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Registra un nuevo negocio afiliado dentro del ecosistema Fitcoin.
          </p>
        </div>

        <form action={createBusiness} className="grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
              Nombre del negocio
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="Ej. Fit Market Colima"
              className="w-full rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
            />
          </div>

          <div className="lg:col-span-1">
            <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
              Descripción
            </label>
            <input
              name="description"
              type="text"
              placeholder="Ej. Tienda saludable"
              className="w-full rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
            />
          </div>

          <div className="lg:col-span-1">
            <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
              Dirección
            </label>
            <input
              name="address"
              type="text"
              placeholder="Ej. Colima, Colima"
              className="w-full rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
            />
          </div>

          <div className="lg:col-span-1">
            <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
              Estado
            </label>
            <select
              name="status"
              defaultValue="active"
              className="w-full rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>

          <div className="lg:col-span-4">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-[#0B1A26] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#12304a]"
            >
              Guardar negocio
            </button>
          </div>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-[#17A649]/10 p-3 text-[#17A649]">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[#F2F2F2] px-3 py-1 text-xs font-semibold text-slate-500">
              Total
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Negocios registrados
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {businesses?.length ?? 0}
          </h2>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-[#2CBF42]/10 p-3 text-[#2CBF42]">
              <ToggleRight className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              Activos
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Negocios activos
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {activeBusinesses}
          </h2>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-[#BF964B]/10 p-3 text-[#BF964B]">
              <ToggleLeft className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
              Inactivos
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Negocios inactivos
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {inactiveBusinesses}
          </h2>
        </article>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-[#0B1A26]">
              Lista de negocios
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Registros obtenidos directamente desde Supabase.
            </p>
          </div>

          <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-2.5 lg:w-80">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar negocio..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F2F2F2]/60 text-sm text-slate-500">
                <th className="px-6 py-4 font-semibold">Negocio</th>
                <th className="px-6 py-4 font-semibold">Dirección</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Fecha de registro</th>
              </tr>
            </thead>

            <tbody>
              {businesses?.map((business: Business) => {
                const isActive = business.status === "active";

                return (
                  <tr
                    key={business.id}
                    className="border-b border-slate-100 transition hover:bg-[#17A649]/5"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-[#17A649]/10 p-3 text-[#17A649]">
                          <Store className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-bold text-[#0B1A26]">
                            {business.name}
                          </p>
                          <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                            {business.description ?? "Sin descripción"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="h-4 w-4 text-[#BF964B]" />
                        {business.address ?? "Sin dirección"}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-xs font-bold",
                            isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700",
                          ].join(" ")}
                        >
                          {isActive ? "Activo" : "Inactivo"}
                        </span>

                        <form action={toggleBusinessStatus}>
                          <input type="hidden" name="id" value={business.id} />
                          <input
                            type="hidden"
                            name="currentStatus"
                            value={business.status}
                          />

                          <button
                            type="submit"
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500 transition hover:border-[#17A649] hover:text-[#17A649]"
                          >
                            {isActive ? "Desactivar" : "Activar"}
                          </button>
                        </form>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(business.created_at).toLocaleDateString(
                        "es-MX",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {businesses?.length === 0 && (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2F2F2] text-slate-400">
              <Building2 className="h-7 w-7" />
            </div>

            <h3 className="font-bold text-[#0B1A26]">
              No hay negocios registrados
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Cuando agregues negocios en Supabase, aparecerán aquí.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}