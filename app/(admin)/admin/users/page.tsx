import {
  Building2,
  Mail,
  Search,
  ShieldCheck,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import { supabaseServiceRole } from "@/lib/supabase/service-role";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  business_id: string | null;
  status: string;
  created_at: string;
};

type Business = {
  id: string;
  name: string;
};

export default async function AdminUsersPage() {
  const [{ data: profiles, error: profilesError }, { data: businesses }] =
    await Promise.all([
      supabaseServiceRole
        .from("profiles")
        .select("id, full_name, email, role, business_id, status, created_at")
        .order("created_at", { ascending: false }),

      supabaseServiceRole.from("businesses").select("id, name"),
    ]);

  if (profilesError) {
    return (
      <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-bold text-red-700">
          Error al cargar usuarios
        </h1>
        <p className="mt-2 text-sm text-red-600">{profilesError.message}</p>
      </div>
    );
  }

  const businessMap = new Map<string, string>(
    ((businesses ?? []) as Business[]).map((business) => [
      business.id,
      business.name,
    ])
  );

  const totalUsers = profiles?.length ?? 0;

  const adminUsers =
    profiles?.filter((profile) => profile.role === "admin").length ?? 0;

  const businessUsers =
    profiles?.filter((profile) => profile.role === "business").length ?? 0;

  const activeUsers =
    profiles?.filter((profile) => profile.status === "active").length ?? 0;

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 rounded-[1.5rem] bg-[#0B1A26] p-5 text-white shadow-xl shadow-slate-900/10 sm:rounded-[2rem] sm:p-8 lg:flex-row lg:items-center">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-[#2CBF42]/30 bg-[#2CBF42]/10 px-4 py-2 text-sm font-medium text-[#2CBF42]">
            Gestión de usuarios
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Usuarios del sistema
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65">
            Consulta los usuarios registrados en Fitcoin, sus roles, estado de
            cuenta y negocio asignado dentro del ecosistema.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
          <p className="text-sm text-white/60">Total de usuarios</p>
          <p className="mt-1 text-4xl font-bold">{totalUsers}</p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-[#17A649]/10 p-3 text-[#17A649]">
              <Users className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[#F2F2F2] px-3 py-1 text-xs font-semibold text-slate-500">
              Total
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Usuarios registrados
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {totalUsers}
          </h2>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-[#BF964B]/10 p-3 text-[#BF964B]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
              Admin
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Administradores
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {adminUsers}
          </h2>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-[#2CBF42]/10 p-3 text-[#2CBF42]">
              <Store className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              Negocio
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Usuarios negocio
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {businessUsers}
          </h2>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-[#17A649]/10 p-3 text-[#17A649]">
              <UserRound className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              Activos
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Usuarios activos
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {activeUsers}
          </h2>
        </article>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-[#0B1A26]">
              Lista de usuarios
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Registros obtenidos desde la tabla de perfiles.
            </p>
          </div>

          <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-2.5 lg:w-80">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F2F2F2]/60 text-sm text-slate-500">
                <th className="px-6 py-4 font-semibold">Usuario</th>
                <th className="px-6 py-4 font-semibold">Correo</th>
                <th className="px-6 py-4 font-semibold">Rol</th>
                <th className="px-6 py-4 font-semibold">Negocio asignado</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Fecha de registro</th>
              </tr>
            </thead>

            <tbody>
              {profiles?.map((profile: Profile) => {
                const businessName = profile.business_id
                  ? businessMap.get(profile.business_id) ?? "Negocio no encontrado"
                  : "Sin negocio asignado";

                return (
                  <tr
                    key={profile.id}
                    className="border-b border-slate-100 transition hover:bg-[#17A649]/5"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-[#17A649]/10 p-3 text-[#17A649]">
                          <UserRound className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-bold text-[#0B1A26]">
                            {profile.full_name ?? "Sin nombre"}
                          </p>
                          <p className="mt-1 font-mono text-xs text-slate-400">
                            {profile.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Mail className="h-4 w-4 text-[#BF964B]" />
                        {profile.email ?? "Sin correo"}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-bold",
                          profile.role === "admin"
                            ? "bg-[#BF964B]/10 text-[#BF964B]"
                            : "bg-[#17A649]/10 text-[#17A649]",
                        ].join(" ")}
                      >
                        {profile.role === "admin"
                          ? "Administrador"
                          : "Negocio"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Building2 className="h-4 w-4 text-[#17A649]" />
                        {businessName}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-bold",
                          profile.status === "active"
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700",
                        ].join(" ")}
                      >
                        {profile.status === "active" ? "Activo" : "Inactivo"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(profile.created_at).toLocaleDateString(
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

        {profiles?.length === 0 && (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2F2F2] text-slate-400">
              <Users className="h-7 w-7" />
            </div>

            <h3 className="font-bold text-[#0B1A26]">
              No hay usuarios registrados
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Cuando existan perfiles en Supabase, aparecerán aquí.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}