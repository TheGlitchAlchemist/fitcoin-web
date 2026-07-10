"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { logout } from "@/app/(auth)/actions";
import type { UserProfile } from "@/lib/auth/current-user";

type DashboardNavbarProps = {
  profile: UserProfile;
};

const mobileLinks = [
  {
    label: "Inicio",
    href: "/dashboard",
  },
  {
    label: "Ofertas",
    href: "/dashboard/offers",
  },
  {
    label: "Canjes",
    href: "/dashboard/redemptions",
  },
  {
    label: "Validar canje",
    href: "/dashboard/validate",
  },
  {
    label: "Estadísticas",
    href: "/dashboard/stats",
  },
];

export function DashboardNavbar({ profile }: DashboardNavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-[#0B1A26] shadow-sm md:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#17A649]">
                Panel de negocio
              </p>
              <h1 className="truncate text-lg font-bold text-[#0B1A26] sm:text-xl">
                Dashboard Fitcoin
              </h1>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="truncate text-sm font-bold text-[#0B1A26]">
                {profile.full_name || "Usuario de negocio"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {profile.email}
              </p>
            </div>

            <form action={logout}>
              <button
                type="submit"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-[#0B1A26] shadow-sm transition hover:border-[#17A649]/40 hover:text-[#17A649]"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-[#0B1A26]/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <aside className="relative z-[101] flex h-dvh min-h-screen w-80 max-w-[86vw] flex-col overflow-y-auto bg-[#0B1A26] p-5 text-white shadow-2xl">
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
                  <h2 className="text-lg font-bold leading-tight">Fitcoin</h2>
                  <p className="text-xs font-medium text-white/50">
                    Business Panel
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-2">
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto rounded-[1.5rem] border border-[#BF964B]/30 bg-[#BF964B]/10 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#BF964B]">
                Sesión activa
              </p>
              <p className="mt-2 break-words text-sm text-white/70">
                {profile.email || "Usuario de negocio"}
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}