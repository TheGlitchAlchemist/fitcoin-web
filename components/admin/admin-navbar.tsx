"use client";

import type { UserProfile } from "@/lib/auth/current-user";
import { logout } from "@/app/(auth)/actions";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Building2,
  Coins,
  LayoutDashboard,
  Menu,
  Search,
  ShieldAlert,
  TicketCheck,
  Users,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

type AdminNavbarProps = {
  profile: UserProfile;
};

type SearchScope = "businesses" | "users" | "transactions" | "redemptions";

const adminLinks = [
  {
    label: "Resumen",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Negocios",
    href: "/admin/businesses",
    icon: Building2,
  },
  {
    label: "Usuarios",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Transacciones",
    href: "/admin/transactions",
    icon: Coins,
  },
  {
    label: "Canjes",
    href: "/admin/redemptions",
    icon: TicketCheck,
  },
  {
    label: "Actividad sospechosa",
    href: "/admin/suspicious-activity",
    icon: ShieldAlert,
  },
];

const searchScopes: {
  label: string;
  value: SearchScope;
  href: string;
}[] = [
  {
    label: "Negocios",
    value: "businesses",
    href: "/admin/businesses",
  },
  {
    label: "Usuarios",
    value: "users",
    href: "/admin/users",
  },
  {
    label: "Transacciones",
    value: "transactions",
    href: "/admin/transactions",
  },
  {
    label: "Canjes",
    value: "redemptions",
    href: "/admin/redemptions",
  },
];

function getScopeFromPathname(pathname: string): SearchScope {
  if (pathname.startsWith("/admin/users")) {
    return "users";
  }

  if (pathname.startsWith("/admin/transactions")) {
    return "transactions";
  }

  if (pathname.startsWith("/admin/redemptions")) {
    return "redemptions";
  }

  return "businesses";
}

function getHrefFromScope(scope: SearchScope) {
  return searchScopes.find((item) => item.value === scope)?.href ?? "/admin";
}

export function AdminNavbar({ profile }: AdminNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState<SearchScope>(() =>
    getScopeFromPathname(pathname)
  );

  useEffect(() => {
    setSearchScope(getScopeFromPathname(pathname));
  }, [pathname]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    const href = getHrefFromScope(searchScope);
    const params = new URLSearchParams({
      q: query,
    });

    router.push(`${href}?${params.toString()}`);
    setIsOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-2xl border border-slate-200 bg-white p-2.5 text-[#0B1A26] lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#17A649] sm:text-sm">
                Panel administrativo
              </p>
              <h2 className="truncate text-lg font-bold tracking-tight text-[#0B1A26] sm:text-2xl">
                Control general de Fitcoin
              </h2>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="hidden flex-1 justify-center px-8 md:flex"
          >
            <div className="flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar en el panel..."
                className="w-full bg-transparent text-sm text-[#0B1A26] outline-none placeholder:text-slate-400"
              />

              <select
                value={searchScope}
                onChange={(event) =>
                  setSearchScope(event.target.value as SearchScope)
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 outline-none transition focus:border-[#17A649]"
              >
                {searchScopes.map((scope) => (
                  <option key={scope.value} value={scope.value}>
                    {scope.label}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="rounded-xl bg-[#0B1A26] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#12304a]"
              >
                Buscar
              </button>
            </div>
          </form>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-[#F2F2F2]">
              <Bell className="h-5 w-5" />
            </button>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
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
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-3 flex flex-col gap-2 md:hidden"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Buscar..."
              className="w-full bg-transparent text-sm text-[#0B1A26] outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-2">
            <select
              value={searchScope}
              onChange={(event) =>
                setSearchScope(event.target.value as SearchScope)
              }
              className="rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-2.5 text-sm font-bold text-slate-600 outline-none transition focus:border-[#17A649] focus:bg-white"
            >
              {searchScopes.map((scope) => (
                <option key={scope.value} value={scope.value}>
                  {scope.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="rounded-2xl bg-[#0B1A26] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#12304a]"
            >
              Buscar
            </button>
          </div>
        </form>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
          />

          <aside className="relative z-10 flex h-full w-80 max-w-[85vw] flex-col bg-[#0B1A26] px-5 py-6 text-white shadow-2xl">
            <div className="mb-8 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-white">
                  <Image
                    src="/images/fitcoin-logo.jpeg"
                    alt="Fitcoin Logo"
                    fill
                    sizes="48px"
                    className="object-cover"
                    priority
                  />
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight">FitCoin</h1>
                  <p className="text-xs text-white/50">Admin Platform</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-2xl bg-white/10 p-2 text-white"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-1">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/admin" && pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={[
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-[#17A649] text-white shadow-lg shadow-[#17A649]/20"
                        : "text-white/65 hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    <Icon
                      className={[
                        "h-5 w-5",
                        isActive ? "text-white" : "text-[#2CBF42]",
                      ].join(" ")}
                    />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-3xl border border-white/10 bg-white/10 p-4">
              <p className="text-sm font-bold text-white">
                {profile.full_name}
              </p>
              <p className="mt-1 text-xs text-white/50">{profile.email}</p>

              <form action={logout} className="mt-4">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#17A649] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2CBF42]"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}