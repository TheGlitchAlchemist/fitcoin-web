import type { UserProfile } from "@/lib/auth/current-user";
import { logout } from "@/app/(auth)/actions";

type DashboardNavbarProps = {
  profile: UserProfile;
};

export function DashboardNavbar({ profile }: DashboardNavbarProps) {
  return (
    <header className="flex h-auto flex-col gap-3 border-b bg-white px-4 py-4 sm:px-6 lg:h-16 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-lg font-semibold text-[#0B1A26]">
          Dashboard del negocio
        </h1>
        <p className="text-sm text-gray-500">
          Gestión de ofertas y canjes
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#0B1A26]">
            {profile.full_name}
          </p>
          <p className="text-xs text-slate-500">{profile.email}</p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="rounded-2xl bg-[#0B1A26] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12304a]"
          >
            Salir
          </button>
        </form>
      </div>
    </header>
  );
}