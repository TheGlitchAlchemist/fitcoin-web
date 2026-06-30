"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Coins,
  LayoutDashboard,
  ShieldAlert,
  TicketCheck,
  Users,
} from "lucide-react";

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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-white/10 bg-[#0B1A26] px-5 py-6 text-white lg:block">
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
          <h1 className="text-xl font-bold tracking-tight">FitCoin</h1>
          <p className="text-xs text-white/50">Admin Platform</p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-[#17A649]/25 bg-[#17A649]/10 p-4">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#2CBF42]">
          Sistema activo
        </p>
        <p className="mt-1 text-sm text-white/70">
          Monitoreo general de negocios, usuarios y canjes.
        </p>
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
              className={[
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-[#17A649] text-white shadow-lg shadow-[#17A649]/20"
                  : "text-white/65 hover:bg-white/10 hover:text-white",
              ].join(" ")}
            >
              <Icon
                className={[
                  "h-5 w-5 transition",
                  isActive ? "text-white" : "text-[#2CBF42]",
                ].join(" ")}
              />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-2xl border border-[#BF964B]/25 bg-[#BF964B]/10 p-4">
        <p className="text-sm font-semibold text-[#BF964B]">Fitcoin Control</p>
        <p className="mt-1 text-xs leading-relaxed text-white/60">
          Los datos mostrados por ahora serán visuales. Después se conectarán a
          Supabase.
        </p>
      </div>
    </aside>
  );
}