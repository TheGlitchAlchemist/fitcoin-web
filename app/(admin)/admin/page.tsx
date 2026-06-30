import { AdminBackendStatus } from "@/components/admin/admin-backend-status";

import {
  Activity,
  ArrowUpRight,
  Building2,
  Coins,
  ShieldAlert,
  TicketCheck,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Negocios activos",
    value: "24",
    description: "Afiliados disponibles",
    icon: Building2,
    accent: "bg-[#17A649]",
  },
  {
    title: "Usuarios registrados",
    value: "1,284",
    description: "Usuarios dentro de la app",
    icon: Users,
    accent: "bg-[#2CBF42]",
  },
  {
    title: "Fitcoins movidos",
    value: "86,420",
    description: "Transacciones acumuladas",
    icon: Coins,
    accent: "bg-[#BF964B]",
  },
  {
    title: "Canjes pendientes",
    value: "17",
    description: "Esperando validación",
    icon: TicketCheck,
    accent: "bg-[#0B1A26]",
  },
];

const modules = [
  {
    title: "Gestión de negocios",
    description: "Crear, activar, desactivar y revisar negocios afiliados.",
    href: "/admin/businesses",
    icon: Building2,
  },
  {
    title: "Usuarios",
    description: "Consultar usuarios, roles y relación con negocios.",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Transacciones",
    description: "Revisar movimientos de Fitcoins dentro del ecosistema.",
    href: "/admin/transactions",
    icon: Coins,
  },
  {
    title: "Actividad sospechosa",
    description: "Detectar movimientos inusuales o posibles fraudes.",
    href: "/admin/suspicious-activity",
    icon: ShieldAlert,
  },
];

const recentActivity = [
  {
    title: "Nuevo negocio registrado",
    detail: "Fit Market Colima fue agregado al sistema.",
    time: "Hace 12 min",
  },
  {
    title: "Canje validado",
    detail: "Un usuario canjeó una promoción de bebida energética.",
    time: "Hace 25 min",
  },
  {
    title: "Movimiento inusual detectado",
    detail: "Usuario con acumulación alta de Fitcoins en poco tiempo.",
    time: "Hace 1 h",
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] bg-[#0B1A26] p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex rounded-full border border-[#2CBF42]/30 bg-[#2CBF42]/10 px-4 py-2 text-sm font-medium text-[#2CBF42]">
              Ecosistema Fitcoin
            </div>

            <h1 className="text-4xl font-bold tracking-tight">
              Panel administrativo
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/65">
              Supervisa negocios, usuarios, transacciones, canjes y actividad
              sospechosa desde una sola plataforma centralizada.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#17A649] p-3">
                <Activity className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm text-white/55">Estado general</p>
                <p className="text-xl font-bold">Operando correctamente</p>
              </div>
            </div>
          </div>
        </div>
      </section>
          <AdminBackendStatus />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-2xl p-3 text-white ${item.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <span className="rounded-full bg-[#F2F2F2] px-3 py-1 text-xs font-semibold text-slate-500">
                  Demo
                </span>
              </div>

              <h3 className="mt-5 text-sm font-medium text-slate-500">
                {item.title}
              </h3>

              <p className="mt-1 text-3xl font-bold text-[#0B1A26]">
                {item.value}
              </p>

              <p className="mt-2 text-sm text-slate-500">{item.description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0B1A26]">
                Módulos principales
              </h2>
              <p className="text-sm text-slate-500">
                Accesos rápidos para la administración del sistema.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <a
                  key={module.title}
                  href={module.href}
                  className="group rounded-3xl border border-slate-200 p-5 transition hover:border-[#17A649]/40 hover:bg-[#17A649]/5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-2xl bg-[#F2F2F2] p-3 text-[#17A649]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <ArrowUpRight className="h-5 w-5 text-slate-300 transition group-hover:text-[#17A649]" />
                  </div>

                  <h3 className="font-bold text-[#0B1A26]">{module.title}</h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {module.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[#0B1A26]">
              Actividad reciente
            </h2>
            <p className="text-sm text-slate-500">
              Últimos eventos importantes del sistema.
            </p>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.title}
                className="rounded-2xl border border-slate-100 bg-[#F2F2F2]/60 p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <h3 className="text-sm font-bold text-[#0B1A26]">
                    {activity.title}
                  </h3>

                  <span className="text-xs font-medium text-[#17A649]">
                    {activity.time}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-slate-500">
                  {activity.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}