import {
  Building2,
  CheckCircle2,
  Clock,
  Gift,
  Search,
  Store,
  TicketCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { supabaseServiceRole } from "@/lib/supabase/service-role";

type Redemption = {
  id: string;
  user_id: string | null;
  business_id: string | null;
  offer_id: string | null;
  status: string;
  created_at: string | null;
  used_at?: string | null;
  redeemed_at?: string | null;
  code?: string | null;
  qr_code?: string | null;
  validation_code?: string | null;
  amount?: number | null;
  cost?: number | null;
};

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type Business = {
  id: string;
  name: string;
};

type Offer = Record<string, unknown> & {
  id: string;
};

function getOfferName(offer?: Offer) {
  if (!offer) return "Oferta no encontrada";

  return (
    String(
      offer.title ??
        offer.name ??
        offer.offer_name ??
        offer.product_name ??
        "Oferta sin nombre"
    )
  );
}

function getOfferCost(offer?: Offer, redemption?: Redemption) {
  const value =
    redemption?.amount ??
    redemption?.cost ??
    offer?.price ??
    offer?.cost ??
    offer?.coin_cost ??
    offer?.fitcoin_price ??
    offer?.cost_fitcoins ??
    null;

  if (typeof value === "number") return value;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getRedemptionCode(redemption: Redemption) {
  return (
    redemption.code ??
    redemption.validation_code ??
    redemption.qr_code ??
    redemption.id
  );
}

function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    issued: "Pendiente",
    pending: "Pendiente",
    used: "Usado",
    redeemed: "Usado",
    completed: "Completado",
    cancelled: "Cancelado",
    expired: "Expirado",
  };

  return labels[status] ?? status;
}

function getStatusClasses(status: string) {
  if (["used", "redeemed", "completed"].includes(status)) {
    return "bg-green-50 text-green-700";
  }

  if (["issued", "pending"].includes(status)) {
    return "bg-yellow-50 text-yellow-700";
  }

  if (["cancelled", "expired"].includes(status)) {
    return "bg-red-50 text-red-700";
  }

  return "bg-slate-100 text-slate-600";
}

export default async function AdminRedemptionsPage() {
  const [
    { data: redemptions, error: redemptionsError },
    { data: profiles },
    { data: businesses },
    { data: offers },
  ] = await Promise.all([
    supabaseServiceRole
      .from("redemptions")
      .select("*")
      .order("created_at", { ascending: false }),

    supabaseServiceRole.from("profiles").select("id, full_name, email"),

    supabaseServiceRole.from("businesses").select("id, name"),

    supabaseServiceRole.from("offers").select("*"),
  ]);

  if (redemptionsError) {
    return (
      <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-bold text-red-700">
          Error al cargar canjes
        </h1>
        <p className="mt-2 text-sm text-red-600">
          {redemptionsError.message}
        </p>
      </div>
    );
  }

  const profileMap = new Map<string, Profile>(
    ((profiles ?? []) as Profile[]).map((profile) => [profile.id, profile])
  );

  const businessMap = new Map<string, string>(
    ((businesses ?? []) as Business[]).map((business) => [
      business.id,
      business.name,
    ])
  );

  const offerMap = new Map<string, Offer>(
    ((offers ?? []) as Offer[]).map((offer) => [offer.id, offer])
  );

  const allRedemptions = (redemptions ?? []) as Redemption[];

  const totalRedemptions = allRedemptions.length;

  const pendingRedemptions = allRedemptions.filter((redemption) =>
    ["issued", "pending"].includes(redemption.status)
  ).length;

  const usedRedemptions = allRedemptions.filter((redemption) =>
    ["used", "redeemed", "completed"].includes(redemption.status)
  ).length;

  const cancelledRedemptions = allRedemptions.filter((redemption) =>
    ["cancelled", "expired"].includes(redemption.status)
  ).length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 rounded-[1.5rem] bg-[#0B1A26] p-5 text-white shadow-xl shadow-slate-900/10 sm:rounded-[2rem] sm:p-8 lg:flex-row lg:items-center">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-[#2CBF42]/30 bg-[#2CBF42]/10 px-4 py-2 text-sm font-medium text-[#2CBF42]">
            Historial de canjes
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Canjes realizados
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65">
            Consulta todos los canjes generados por los usuarios dentro del
            ecosistema Fitcoin, incluyendo negocio, oferta, usuario y estado del
            canje.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
          <p className="text-sm text-white/60">Canjes totales</p>
          <p className="mt-1 text-4xl font-bold">{totalRedemptions}</p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-[#17A649]/10 p-3 text-[#17A649]">
              <TicketCheck className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[#F2F2F2] px-3 py-1 text-xs font-semibold text-slate-500">
              Total
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Canjes registrados
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {totalRedemptions}
          </h2>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-yellow-50 p-3 text-yellow-600">
              <Clock className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
              Pendientes
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Canjes pendientes
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {pendingRedemptions}
          </h2>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-green-50 p-3 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              Usados
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Canjes usados
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {usedRedemptions}
          </h2>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-red-50 p-3 text-red-600">
              <XCircle className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
              Cancelados
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Cancelados o expirados
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {cancelledRedemptions}
          </h2>
        </article>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-[#0B1A26]">
              Lista de canjes
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Canjes registrados en todas las cuentas del sistema.
            </p>
          </div>

          <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-2.5 lg:w-80">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar canje..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F2F2F2]/60 text-sm text-slate-500">
                <th className="px-6 py-4 font-semibold">Usuario</th>
                <th className="px-6 py-4 font-semibold">Negocio</th>
                <th className="px-6 py-4 font-semibold">Oferta</th>
                <th className="px-6 py-4 font-semibold">Costo</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold">Código</th>
                <th className="px-6 py-4 font-semibold">Fecha de canje</th>
              </tr>
            </thead>

            <tbody>
              {allRedemptions.map((redemption) => {
                const profile = redemption.user_id
                  ? profileMap.get(redemption.user_id)
                  : null;

                const businessName = redemption.business_id
                  ? businessMap.get(redemption.business_id) ??
                    "Negocio no encontrado"
                  : "Sin negocio";

                const offer = redemption.offer_id
                  ? offerMap.get(redemption.offer_id)
                  : undefined;

                const offerName = getOfferName(offer);
                const offerCost = getOfferCost(offer, redemption);
                const redemptionCode = getRedemptionCode(redemption);

                return (
                  <tr
                    key={redemption.id}
                    className="border-b border-slate-100 transition hover:bg-[#17A649]/5"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-[#17A649]/10 p-3 text-[#17A649]">
                          <UserRound className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-bold text-[#0B1A26]">
                            {profile?.full_name ?? "Usuario no encontrado"}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {profile?.email ?? "Sin correo"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Building2 className="h-4 w-4 text-[#BF964B]" />
                        {businessName}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Store className="h-4 w-4 text-[#17A649]" />
                        <div>
                          <p className="font-bold text-[#0B1A26]">
                            {offerName}
                          </p>
                          <p className="font-mono text-xs text-slate-400">
                            {redemption.offer_id
                              ? `${redemption.offer_id.slice(0, 8)}...`
                              : "Sin oferta"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#17A649]/10 px-3 py-1 text-sm font-bold text-[#17A649]">
                        <Gift className="h-4 w-4" />
                        {offerCost !== null ? `${offerCost} Fitcoins` : "N/A"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={[
                          "rounded-full px-3 py-1 text-xs font-bold",
                          getStatusClasses(redemption.status),
                        ].join(" ")}
                      >
                        {getStatusLabel(redemption.status)}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <p className="max-w-[180px] truncate rounded-full bg-[#F2F2F2] px-3 py-1 font-mono text-xs font-bold text-slate-600">
                        {redemptionCode}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {redemption.created_at
                        ? new Date(redemption.created_at).toLocaleDateString(
                            "es-MX",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "Sin fecha"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {allRedemptions.length === 0 && (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2F2F2] text-slate-400">
              <TicketCheck className="h-7 w-7" />
            </div>

            <h3 className="font-bold text-[#0B1A26]">
              No hay canjes registrados
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Cuando los usuarios canjeen ofertas, los registros aparecerán
              aquí.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}