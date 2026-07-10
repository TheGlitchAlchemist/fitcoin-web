import Link from "next/link";
import {
  AlertTriangle,
  Activity,
  Coins,
  FileWarning,
  Search,
  ShieldAlert,
  UserRound,
  WalletCards,
} from "lucide-react";
import { supabaseServiceRole } from "@/lib/supabase/service-role";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type ActivitySummary = {
  id: string;
  user_id: string | null;
  activity_date: string | null;
  steps: number | null;
  last_valid_steps: number | null;
  last_synced_steps: number | null;
  fitcoins_earned: number | null;
  suspicious_attempts: number | null;
  last_sync_at: string | null;
};

type AuditLog = {
  id: string;
  user_id: string | null;
  action: string;
  details: Record<string, unknown> | null;
  created_at: string;
};

type PenaltyTransaction = {
  id: string;
  user_id: string | null;
  amount: number;
  balance_after: number | null;
  type: string;
  description: string | null;
  created_at: string;
};

type SuspiciousEvent = {
  id: string;
  user_id: string | null;
  source: "summary" | "audit" | "penalty";
  title: string;
  detail: string;
  evidence: string;
  penalty: string;
  created_at: string | null;
};

type SuspiciousActivityPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat("es-MX").format(value ?? 0);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Sin fecha";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "Sin fecha";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return date.toLocaleString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getProfileName(profile?: Profile | null) {
  return profile?.full_name ?? "Usuario no encontrado";
}

function getProfileEmail(profile?: Profile | null) {
  return profile?.email ?? "Sin correo";
}

function getDetailNumber(
  details: Record<string, unknown> | null,
  key: string
) {
  const value = details?.[key];

  if (typeof value === "number") return value;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getDetailBoolean(
  details: Record<string, unknown> | null,
  key: string
) {
  const value = details?.[key];

  if (typeof value === "boolean") return value;

  return false;
}

function getSourceLabel(source: SuspiciousEvent["source"]) {
  const labels: Record<SuspiciousEvent["source"], string> = {
    summary: "Resumen diario",
    audit: "Auditoría",
    penalty: "Penalización",
  };

  return labels[source];
}

function getSourceClasses(source: SuspiciousEvent["source"]) {
  if (source === "summary") {
    return "bg-yellow-50 text-yellow-700";
  }

  if (source === "audit") {
    return "bg-red-50 text-red-700";
  }

  return "bg-[#BF964B]/10 text-[#BF964B]";
}

export default async function SuspiciousActivityPage({
  searchParams,
}: SuspiciousActivityPageProps) {
  const params = await searchParams;
  const searchTerm = params.q?.trim().toLowerCase() ?? "";

  const [
    { data: activitySummaries, error: activityError },
    { data: auditLogs, error: auditError },
    { data: penaltyTransactions, error: penaltyError },
    { data: profiles, error: profilesError },
  ] = await Promise.all([
    supabaseServiceRole
      .from("activity_daily_summaries")
      .select(
        "id, user_id, activity_date, steps, last_valid_steps, last_synced_steps, fitcoins_earned, suspicious_attempts, last_sync_at"
      )
      .gt("suspicious_attempts", 0)
      .order("last_sync_at", { ascending: false }),

    supabaseServiceRole
      .from("audit_logs")
      .select("id, user_id, action, details, created_at")
      .eq("action", "suspicious_activity")
      .order("created_at", { ascending: false }),

    supabaseServiceRole
      .from("coin_transactions")
      .select("id, user_id, amount, balance_after, type, description, created_at")
      .eq("type", "penalty_suspicious_activity")
      .order("created_at", { ascending: false }),

    supabaseServiceRole.from("profiles").select("id, full_name, email"),
  ]);

  const systemErrors = [
    activityError && `Actividad diaria: ${activityError.message}`,
    auditError && `Auditoría: ${auditError.message}`,
    penaltyError && `Penalizaciones: ${penaltyError.message}`,
    profilesError && `Usuarios: ${profilesError.message}`,
  ].filter(Boolean);

  const profileMap = new Map<string, Profile>(
    ((profiles ?? []) as Profile[]).map((profile) => [profile.id, profile])
  );

  const suspiciousSummaries = (activitySummaries ?? []) as ActivitySummary[];
  const suspiciousLogs = (auditLogs ?? []) as AuditLog[];
  const penalties = (penaltyTransactions ?? []) as PenaltyTransaction[];

  const summaryEvents: SuspiciousEvent[] = suspiciousSummaries.map(
    (summary) => ({
      id: summary.id,
      user_id: summary.user_id,
      source: "summary",
      title: "Intentos sospechosos acumulados",
      detail: `${formatNumber(
        summary.suspicious_attempts
      )} intento(s) sospechoso(s) registrados en el día.`,
      evidence: `Pasos válidos: ${formatNumber(
        summary.last_valid_steps
      )} · Últimos pasos sincronizados: ${formatNumber(
        summary.last_synced_steps
      )} · Fitcoins ganadas: ${formatNumber(summary.fitcoins_earned)}`,
      penalty: "Depende del balance del usuario",
      created_at: summary.last_sync_at ?? summary.activity_date,
    })
  );

  const auditEvents: SuspiciousEvent[] = suspiciousLogs.map((log) => {
    const deltaSteps = getDetailNumber(log.details, "delta_steps");
    const windowMinutes = getDetailNumber(log.details, "window_minutes");
    const stepsPerMinute = getDetailNumber(log.details, "steps_per_minute");
    const penaltyApplied = getDetailBoolean(log.details, "penalty_applied");

    return {
      id: log.id,
      user_id: log.user_id,
      source: "audit",
      title: "Actividad sospechosa detectada",
      detail: `El sistema detectó una velocidad de ${
        stepsPerMinute !== null ? `${stepsPerMinute} pasos/min` : "N/A"
      }.`,
      evidence: `Delta de pasos: ${
        deltaSteps !== null ? formatNumber(deltaSteps) : "N/A"
      } · Ventana: ${
        windowMinutes !== null ? `${windowMinutes} min` : "N/A"
      }`,
      penalty: penaltyApplied ? "Sí se aplicó penalización" : "Sin penalización",
      created_at: log.created_at,
    };
  });

  const penaltyEvents: SuspiciousEvent[] = penalties.map((transaction) => ({
    id: transaction.id,
    user_id: transaction.user_id,
    source: "penalty",
    title: "Penalización aplicada",
    detail:
      transaction.description ??
      "Se descontó Fitcoin por actividad sospechosa.",
    evidence: `Movimiento: ${transaction.amount} Fitcoin · Balance después: ${formatNumber(
      transaction.balance_after
    )}`,
    penalty: "Sí se aplicó penalización",
    created_at: transaction.created_at,
  }));

  const allEvents = [...summaryEvents, ...auditEvents, ...penaltyEvents].sort(
    (a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;

      return dateB - dateA;
    }
  );

  const filteredEvents = allEvents.filter((event) => {
    if (!searchTerm) return true;

    const profile = event.user_id ? profileMap.get(event.user_id) : null;
    const sourceLabel = getSourceLabel(event.source);
    const dateText = formatDateTime(event.created_at);

    return (
      getProfileName(profile).toLowerCase().includes(searchTerm) ||
      getProfileEmail(profile).toLowerCase().includes(searchTerm) ||
      sourceLabel.toLowerCase().includes(searchTerm) ||
      event.title.toLowerCase().includes(searchTerm) ||
      event.detail.toLowerCase().includes(searchTerm) ||
      event.evidence.toLowerCase().includes(searchTerm) ||
      event.penalty.toLowerCase().includes(searchTerm) ||
      event.id.toLowerCase().includes(searchTerm) ||
      dateText.toLowerCase().includes(searchTerm)
    );
  });

  const uniqueSuspiciousUsers = new Set(
    allEvents
      .map((event) => event.user_id)
      .filter((userId): userId is string => Boolean(userId))
  ).size;

  const totalSuspiciousAttempts = suspiciousSummaries.reduce(
    (sum, summary) => sum + (summary.suspicious_attempts ?? 0),
    0
  );

  const totalPenalties = penalties.length;
  const totalAuditEvents = suspiciousLogs.length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 rounded-[1.5rem] bg-[#0B1A26] p-5 text-white shadow-xl shadow-slate-900/10 sm:rounded-[2rem] sm:p-8 lg:flex-row lg:items-center">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-red-300/30 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-200">
            Seguridad y antifraude
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Actividad sospechosa
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65">
            Consulta usuarios con intentos sospechosos, registros de auditoría y
            penalizaciones aplicadas por movimientos anormales de actividad
            física.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
          <p className="text-sm text-white/60">Eventos detectados</p>
          <p className="mt-1 text-4xl font-bold">{formatNumber(allEvents.length)}</p>
        </div>
      </section>

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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-red-50 p-3 text-red-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
              Riesgo
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Usuarios con alertas
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {formatNumber(uniqueSuspiciousUsers)}
          </h2>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-yellow-50 p-3 text-yellow-600">
              <Activity className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
              Intentos
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Intentos sospechosos
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {formatNumber(totalSuspiciousAttempts)}
          </h2>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-[#BF964B]/10 p-3 text-[#BF964B]">
              <Coins className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[#BF964B]/10 px-3 py-1 text-xs font-semibold text-[#BF964B]">
              Penalización
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Penalizaciones aplicadas
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {formatNumber(totalPenalties)}
          </h2>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
              <FileWarning className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Auditoría
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Logs sospechosos
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {formatNumber(totalAuditEvents)}
          </h2>
        </article>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-[#0B1A26]">
              Lista de eventos sospechosos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {searchTerm
                ? `Resultados encontrados: ${filteredEvents.length}`
                : "Eventos obtenidos desde activity_daily_summaries, audit_logs y coin_transactions."}
            </p>
          </div>

          <form className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
            <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-2.5 lg:w-80">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                name="q"
                type="text"
                defaultValue={params.q ?? ""}
                placeholder="Buscar actividad sospechosa..."
                className="w-full bg-transparent text-sm text-[#0B1A26] outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="rounded-2xl bg-[#0B1A26] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#12304a]"
            >
              Buscar
            </button>

            {params.q && (
              <Link
                href="/admin/suspicious-activity"
                className="rounded-2xl border border-slate-200 px-5 py-2.5 text-center text-sm font-bold text-slate-600 transition hover:bg-[#F2F2F2]"
              >
                Limpiar
              </Link>
            )}
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F2F2F2]/60 text-sm text-slate-500">
                <th className="px-6 py-4 font-semibold">Usuario</th>
                <th className="px-6 py-4 font-semibold">Origen</th>
                <th className="px-6 py-4 font-semibold">Evento</th>
                <th className="px-6 py-4 font-semibold">Evidencia</th>
                <th className="px-6 py-4 font-semibold">Penalización</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
              </tr>
            </thead>

            <tbody>
              {filteredEvents.map((event) => {
                const profile = event.user_id
                  ? profileMap.get(event.user_id)
                  : null;

                return (
                  <tr
                    key={`${event.source}-${event.id}`}
                    className="border-b border-slate-100 transition hover:bg-red-50/40"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-red-50 p-3 text-red-600">
                          <UserRound className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-bold text-[#0B1A26]">
                            {getProfileName(profile)}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {getProfileEmail(profile)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-bold",
                          getSourceClasses(event.source),
                        ].join(" ")}
                      >
                        {getSourceLabel(event.source)}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div>
                        <p className="font-bold text-[#0B1A26]">
                          {event.title}
                        </p>
                        <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-500">
                          {event.detail}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <p className="max-w-sm text-sm leading-relaxed text-slate-500">
                        {event.evidence}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-bold",
                          event.penalty.includes("Sí")
                            ? "bg-red-50 text-red-700"
                            : "bg-slate-100 text-slate-600",
                        ].join(" ")}
                      >
                        {event.penalty}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {formatDateTime(event.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredEvents.length === 0 && (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2F2F2] text-slate-400">
              <ShieldAlert className="h-7 w-7" />
            </div>

            <h3 className="font-bold text-[#0B1A26]">
              No se encontraron eventos sospechosos
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Intenta buscar por usuario, correo, origen, penalización, pasos,
              evidencia o fecha.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}