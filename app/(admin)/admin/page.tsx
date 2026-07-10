import Link from "next/link";
import { AdminBackendStatus } from "@/components/admin/admin-backend-status";
import { supabaseServiceRole } from "@/lib/supabase/service-role";

import {
  Activity,
  ArrowUpRight,
  Building2,
  Coins,
  ShieldAlert,
  TicketCheck,
  Users,
} from "lucide-react";

type Business = {
  id: string;
  name: string;
  status: string;
  created_at: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  status: string;
  created_at: string;
};

type CoinTransaction = {
  id: string;
  user_id: string | null;
  amount: number;
  type: string;
  created_at: string;
};

type Redemption = {
  id: string;
  status: string;
  created_at: string;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-MX").format(value);
}

function formatRelativeTime(dateValue: string) {
  const date = new Date(dateValue);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Hace unos segundos";
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays === 1) return "Hace 1 día";

  return `Hace ${diffDays} días`;
}

function getTransactionLabel(type: string) {
  const labels: Record<string, string> = {
    earn_activity: "Fitcoins ganadas por actividad física",
    spend_redemption: "Fitcoins gastadas en canje",
    penalty_suspicious_activity: "Penalización por actividad sospechosa",
    admin_adjustment: "Ajuste administrativo de Fitcoins",
    refund: "Reembolso de Fitcoins",
  };

  return labels[type] ?? type;
}

export default async function AdminPage() {
  const [
    { data: businesses, error: businessesError },
    { data: profiles, error: profilesError },
    { data: coinTransactions, error: coinTransactionsError },
    { data: redemptions, error: redemptionsError },
  ] = await Promise.all([
    supabaseServiceRole
      .from("businesses")
      .select("id, name, status, created_at")
      .order("created_at", { ascending: false }),

    supabaseServiceRole
      .from("profiles")
      .select("id, full_name, email, role, status, created_at")
      .order("created_at", { ascending: false }),

    supabaseServiceRole
      .from("coin_transactions")
      .select("id, user_id, amount, type, created_at")
      .order("created_at", { ascending: false }),

    supabaseServiceRole
      .from("redemptions")
      .select("id, status, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const allBusinesses = (businesses ?? []) as Business[];
  const allProfiles = (profiles ?? []) as Profile[];
  const allCoinTransactions = (coinTransactions ?? []) as CoinTransaction[];
  const allRedemptions = (redemptions ?? []) as Redemption[];

  const activeBusinesses = allBusinesses.filter(
    (business) => business.status === "active"
  ).length;

  const registeredUsers = allProfiles.length;

  const movedFitcoins = allCoinTransactions.reduce(
    (sum, transaction) => sum + Math.abs(transaction.amount ?? 0),
    0
  );

  const pendingRedemptions = allRedemptions.filter((redemption) =>
    ["issued", "pending"].includes(redemption.status)
  ).length;

  const suspiciousTransactions = allCoinTransactions.filter(
    (transaction) => transaction.type === "penalty_suspicious_activity"
  ).length;

  const systemErrors = [
    businessesError && `Negocios: ${businessesError.message}`,
    profilesError && `Usuarios: ${profilesError.message}`,
    coinTransactionsError && `Transacciones: ${coinTransactionsError.message}`,
    redemptionsError && `Canjes: ${redemptionsError.message}`,
  ].filter(Boolean);

  const stats = [
    {
      title: "Negocios activos",
      value: formatNumber(activeBusinesses),
      description: "Afiliados disponibles",
      icon: Building2,
      accent: "bg-[#17A649]",
    },
    {
      title: "Usuarios registrados",
      value: formatNumber(registeredUsers),
      description: "Usuarios dentro de la app",
      icon: Users,
      accent: "bg-[#2CBF42]",
    },
    {
      title: "Fitcoins movidos",
      value: formatNumber(movedFitcoins),
      description: "Transacciones acumuladas",
      icon: Coins,
      accent: "bg-[#BF964B]",
    },
    {
      title: "Canjes pendientes",
      value: formatNumber(pendingRedemptions),
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
      title: "Canjes",
      description: "Consultar canjes generados por usuarios y negocios.",
      href: "/admin/redemptions",
      icon: TicketCheck,
    },
    {
      title: "Actividad sospechosa",
      description: "Detectar movimientos inusuales o posibles fraudes.",
      href: "/admin/suspicious-activity",
      icon: ShieldAlert,
    },
  ];

  const recentBusinesses = allBusinesses.slice(0, 3).map((business) => ({
    title: "Nuevo negocio registrado",
    detail: `${business.name} fue agregado al sistema.`,
    time: formatRelativeTime(business.created_at),
    created_at: business.created_at,
  }));

  const recentRedemptions = allRedemptions.slice(0, 3).map((redemption) => ({
    title: "Canje registrado",
    detail: `Se registró un canje con estado "${redemption.status}".`,
    time: formatRelativeTime(redemption.created_at),
    created_at: redemption.created_at,
  }));

  const recentTransactions = allCoinTransactions
    .slice(0, 3)
    .map((transaction) => ({
      title:
        transaction.type === "penalty_suspicious_activity"
          ? "Movimiento inusual detectado"
          : "Movimiento de Fitcoins",
      detail: `${getTransactionLabel(transaction.type)}: ${
        transaction.amount > 0 ? "+" : ""
      }${transaction.amount} Fitcoins.`,
      time: formatRelativeTime(transaction.created_at),
      created_at: transaction.created_at,
    }));

  const recentActivity = [
    ...recentBusinesses,
    ...recentRedemptions,
    ...recentTransactions,
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 rounded-[1.5rem] bg-[#0B1A26] p-5 text-white shadow-xl shadow-slate-900/10 sm:rounded-[2rem] sm:p-8 lg:flex-row lg:items-center">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex rounded-full border border-[#2CBF42]/30 bg-[#2CBF42]/10 px-4 py-2 text-sm font-medium text-[#2CBF42]">
              Ecosistema Fitcoin
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
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
                <p className="text-xl font-bold">
                  {systemErrors.length === 0
                    ? "Operando correctamente"
                    : "Requiere revisión"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdminBackendStatus />

      {systemErrors.length > 0 && (
        <section className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-red-700">
            Hay problemas al cargar algunos datos
          </h2>

          <div className="mt-3 space-y-2">
            {systemErrors.map((error) => (
              <p key={String(error)} className="text-sm text-red-600">
                {error}
              </p>
            ))}
          </div>
        </section>
      )}

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
                  Real
                </span>
              </div>

              <h3 className="mt-5 text-sm font-medium text-slate-500">
                {item.title}
              </h3>

              <p className="mt-1 text-3xl font-bold text-[#0B1A26]">
                {item.value}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {item.description}
              </p>
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
                <Link
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
                </Link>
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
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div
                  key={`${activity.title}-${activity.created_at}-${index}`}
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
              ))
            ) : (
              <div className="rounded-2xl border border-slate-100 bg-[#F2F2F2]/60 p-4">
                <h3 className="text-sm font-bold text-[#0B1A26]">
                  Sin actividad reciente
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Cuando se registren negocios, canjes o transacciones,
                  aparecerán aquí.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Negocios registrados
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {formatNumber(allBusinesses.length)}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Incluye activos, inactivos y archivados.
          </p>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Penalizaciones detectadas
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {formatNumber(suspiciousTransactions)}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Movimientos marcados como actividad sospechosa.
          </p>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Canjes registrados
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {formatNumber(allRedemptions.length)}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Historial general de canjes del sistema.
          </p>
        </article>
      </section>
    </div>
  );
}