import Link from "next/link";
import { StatusMessage } from "@/components/ui/status-message";
import { ArchiveBusinessForm } from "@/components/admin/archive-business-form";
import { CreateBusinessModal } from "@/components/admin/create-business-modal";

import {
  restoreBusiness,
  toggleBusinessStatus,
} from "./actions";
import {
  Archive,
  Building2,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
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

type BusinessesPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
    q?: string;
    status?: string;
    accountEmail?: string;
    temporaryPassword?: string;
  }>;
};

export default async function BusinessesPage({
  searchParams,
}: BusinessesPageProps) {
  const params = await searchParams;

  const searchTerm = params.q?.trim().toLowerCase() ?? "";
  const selectedStatus = params.status ?? "all";

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
    businesses?.filter((business) => business.status === "inactive").length ??
    0;

  const archivedBusinesses =
    businesses?.filter((business) => business.status === "archived").length ??
    0;

  const filteredBusinesses =
    businesses?.filter((business) => {
      const matchesSearch =
        !searchTerm ||
        business.name.toLowerCase().includes(searchTerm) ||
        business.description?.toLowerCase().includes(searchTerm) ||
        business.address?.toLowerCase().includes(searchTerm);

      const matchesStatus =
        selectedStatus === "all" || business.status === selectedStatus;

      return matchesSearch && matchesStatus;
    }) ?? [];

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 rounded-[1.5rem] bg-[#0B1A26] p-5 text-white shadow-xl shadow-slate-900/10 sm:rounded-[2rem] sm:p-8 lg:flex-row lg:items-center">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-[#2CBF42]/30 bg-[#2CBF42]/10 px-4 py-2 text-sm font-medium text-[#2CBF42]">
            Gestión de negocios
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Negocios afiliados
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65">
            Administra los negocios que forman parte del ecosistema Fitcoin.
            Desde aquí podrás revisar su estado, dirección y datos principales.
          </p>
        </div>

       <CreateBusinessModal />
      </section>

      <StatusMessage success={params.success} error={params.error} />

      {params.accountEmail && params.temporaryPassword && (
        <section className="rounded-[1.5rem] border border-[#17A649]/20 bg-[#17A649]/10 p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-[#0B1A26]">
              Cuenta de acceso creada
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Guarda estos datos. Esta contraseña temporal solo se muestra al
              crear el negocio.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#17A649]/20 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Correo
              </p>
              <p className="mt-2 break-all font-mono text-sm font-bold text-[#0B1A26]">
                {params.accountEmail}
              </p>
            </div>

            <div className="rounded-2xl border border-[#17A649]/20 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Contraseña temporal
              </p>
              <p className="mt-2 break-all font-mono text-sm font-bold text-[#0B1A26]">
                {params.temporaryPassword}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <Link
              href="/admin/businesses"
              className="inline-flex items-center justify-center rounded-2xl bg-[#0B1A26] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#12304a]"
            >
              Ocultar credenciales
            </Link>
          </div>
        </section>
      )}


      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
              <Archive className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Archivados
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Negocios archivados
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {archivedBusinesses}
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

          <form className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
            <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-2.5 lg:w-80">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                name="q"
                type="text"
                defaultValue={params.q ?? ""}
                placeholder="Buscar negocio..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <select
              name="status"
              defaultValue={selectedStatus}
              className="rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-2.5 text-sm font-medium text-slate-600 outline-none transition focus:border-[#17A649] focus:bg-white"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="archived">Archivados</option>
            </select>

            <button
              type="submit"
              className="rounded-2xl bg-[#0B1A26] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#12304a]"
            >
              Buscar
            </button>

            {(params.q || selectedStatus !== "all") && (
              <Link
                href="/admin/businesses"
                className="rounded-2xl border border-slate-200 px-5 py-2.5 text-center text-sm font-bold text-slate-600 transition hover:bg-[#F2F2F2]"
              >
                Limpiar
              </Link>
            )}
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F2F2F2]/60 text-sm text-slate-500">
                <th className="px-6 py-4 font-semibold">Negocio</th>
                <th className="px-6 py-4 font-semibold">Dirección</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Fecha de registro</th>
                <th className="px-6 py-4 font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredBusinesses.map((business: Business) => {
                const isActive = business.status === "active";
                const isArchived = business.status === "archived";

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
                            business.status === "active" &&
                              "bg-green-50 text-green-700",
                            business.status === "inactive" &&
                              "bg-yellow-50 text-yellow-700",
                            business.status === "archived" &&
                              "bg-slate-100 text-slate-600",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {business.status === "active" && "Activo"}
                          {business.status === "inactive" && "Inactivo"}
                          {business.status === "archived" && "Archivado"}
                        </span>

                        {!isArchived && (
                          <form action={toggleBusinessStatus}>
                            <input
                              type="hidden"
                              name="id"
                              value={business.id}
                            />
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
                        )}
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

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/businesses/${business.id}/edit`}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:border-[#17A649] hover:text-[#17A649]"
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </Link>

                        {!isArchived ? (
                          <ArchiveBusinessForm
                            businessId={business.id}
                            businessName={business.name}
                          />
                        ) : (
                          <form action={restoreBusiness}>
                            <input
                              type="hidden"
                              name="id"
                              value={business.id}
                            />

                            <button
                              type="submit"
                              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500 transition hover:border-[#17A649] hover:text-[#17A649]"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Restaurar
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2F2F2] text-slate-400">
              <Building2 className="h-7 w-7" />
            </div>

            <h3 className="font-bold text-[#0B1A26]">
              No se encontraron negocios
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Intenta cambiar el texto de búsqueda o el filtro de estado.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}