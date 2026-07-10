"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Home,
  ScanLine,
  Tags,
  TicketCheck,
} from "lucide-react";

const dashboardLinks = [
  {
    label: "Inicio",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Ofertas",
    href: "/dashboard/offers",
    icon: Tags,
  },
  {
    label: "Canjes",
    href: "/dashboard/redemptions",
    icon: TicketCheck,
  },
  {
    label: "Validar canje",
    href: "/dashboard/validate",
    icon: ScanLine,
  },
  {
    label: "Estadísticas",
    href: "/dashboard/stats",
    icon: BarChart3,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 bg-[#0B1A26] p-5 text-white md:block">
      <div className="flex h-full flex-col">
        <div className="mb-8 flex items-center gap-3">
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

        <nav className="space-y-2">
          {dashboardLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#17A649] text-white shadow-lg shadow-[#17A649]/20"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-xl transition ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "bg-white/5 text-white/55 group-hover:bg-white/10 group-hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>

                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-[1.5rem] border border-[#BF964B]/30 bg-[#BF964B]/10 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#BF964B]">
            Negocio
          </p>
          <p className="mt-2 text-sm text-white/65">
            Administra ofertas, canjes y validaciones desde un solo panel.
          </p>
        </div>
      </div>
    </aside>
  );
}