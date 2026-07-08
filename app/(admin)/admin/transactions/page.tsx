import {
  ArrowDownCircle,
  ArrowUpCircle,
  Coins,
  CreditCard,
  FileText,
  Search,
  UserRound,
  WalletCards,
} from "lucide-react";
import { supabaseServiceRole } from "@/lib/supabase/service-role";

type CoinTransaction = {
  id: string;
  user_id: string | null;
  amount: number;
  type: string;
  reference_table: string | null;
  reference_id: string | null;
  balance_after: number | null;
  created_at: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
};

function getTransactionTypeLabel(type: string) {
  const labels: Record<string, string> = {
    earn_activity: "Ganancia por actividad",
    spend_redemption: "Gasto por canje",
    penalty_suspicious_activity: "Penalización",
    admin_adjustment: "Ajuste administrativo",
    refund: "Reembolso",
  };

  return labels[type] ?? type;
}

export default async function AdminTransactionsPage() {
  const [{ data: transactions, error: transactionsError }, { data: profiles }] =
    await Promise.all([
      supabaseServiceRole
        .from("coin_transactions")
        .select(
          "id, user_id, amount, type, reference_table, reference_id, balance_after, created_at"
        )
        .order("created_at", { ascending: false }),

      supabaseServiceRole.from("profiles").select("id, full_name, email"),
    ]);

  if (transactionsError) {
    return (
      <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-bold text-red-700">
          Error al cargar transacciones
        </h1>
        <p className="mt-2 text-sm text-red-600">
          {transactionsError.message}
        </p>
      </div>
    );
  }

  const profileMap = new Map<string, Profile>(
    ((profiles ?? []) as Profile[]).map((profile) => [profile.id, profile])
  );

  const allTransactions = (transactions ?? []) as CoinTransaction[];

  const totalTransactions = allTransactions.length;

  const totalPositive = allTransactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalNegative = allTransactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  const penaltyTransactions = allTransactions.filter(
    (transaction) => transaction.type === "penalty_suspicious_activity"
  ).length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 rounded-[1.5rem] bg-[#0B1A26] p-5 text-white shadow-xl shadow-slate-900/10 sm:rounded-[2rem] sm:p-8 lg:flex-row lg:items-center">
        <div>
          <div className="mb-4 inline-flex rounded-full border border-[#2CBF42]/30 bg-[#2CBF42]/10 px-4 py-2 text-sm font-medium text-[#2CBF42]">
            Historial de Fitcoins
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Transacciones
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65">
            Consulta todos los movimientos de Fitcoins registrados en las
            cuentas de los usuarios: ganancias, gastos, penalizaciones y ajustes.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
          <p className="text-sm text-white/60">Movimientos totales</p>
          <p className="mt-1 text-4xl font-bold">{totalTransactions}</p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-[#17A649]/10 p-3 text-[#17A649]">
              <WalletCards className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-[#F2F2F2] px-3 py-1 text-xs font-semibold text-slate-500">
              Total
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Transacciones registradas
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {totalTransactions}
          </h2>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-green-50 p-3 text-green-600">
              <ArrowUpCircle className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              Entradas
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Fitcoins generadas
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {totalPositive}
          </h2>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-red-50 p-3 text-red-600">
              <ArrowDownCircle className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
              Salidas
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Fitcoins descontadas
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {totalNegative}
          </h2>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-[#BF964B]/10 p-3 text-[#BF964B]">
              <CreditCard className="h-5 w-5" />
            </div>
            <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
              Alertas
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-slate-500">
            Penalizaciones aplicadas
          </p>
          <h2 className="mt-1 text-3xl font-bold text-[#0B1A26]">
            {penaltyTransactions}
          </h2>
        </article>
      </section>

      <section className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-[#0B1A26]">
              Lista de transacciones
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Movimientos registrados en la tabla coin_transactions.
            </p>
          </div>

          <div className="flex w-full items-center gap-2 rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-2.5 lg:w-80">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar transacción..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F2F2F2]/60 text-sm text-slate-500">
                <th className="px-6 py-4 font-semibold">Usuario</th>
                <th className="px-6 py-4 font-semibold">Tipo</th>
                <th className="px-6 py-4 font-semibold">Cantidad</th>
                <th className="px-6 py-4 font-semibold">Balance después</th>
                <th className="px-6 py-4 font-semibold">Referencia</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
              </tr>
            </thead>

            <tbody>
              {allTransactions.map((transaction) => {
                const profile = transaction.user_id
                  ? profileMap.get(transaction.user_id)
                  : null;

                const isPositive = transaction.amount >= 0;

                return (
                  <tr
                    key={transaction.id}
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
                      <span className="rounded-full bg-[#F2F2F2] px-3 py-1 text-xs font-bold text-slate-600">
                        {getTransactionTypeLabel(transaction.type)}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold",
                          isPositive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700",
                        ].join(" ")}
                      >
                        <Coins className="h-4 w-4" />
                        {isPositive ? "+" : ""}
                        {transaction.amount}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-[#17A649]/10 px-3 py-1 text-sm font-bold text-[#17A649]">
                        {transaction.balance_after ?? 0} Fitcoins
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <FileText className="h-4 w-4 text-[#BF964B]" />
                        <div>
                          <p className="font-medium text-slate-600">
                            {transaction.reference_table ?? "Sin referencia"}
                          </p>
                          <p className="font-mono text-xs text-slate-400">
                            {transaction.reference_id
                              ? `${transaction.reference_id.slice(0, 8)}...`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {new Date(transaction.created_at).toLocaleDateString(
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

        {allTransactions.length === 0 && (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2F2F2] text-slate-400">
              <WalletCards className="h-7 w-7" />
            </div>

            <h3 className="font-bold text-[#0B1A26]">
              No hay transacciones registradas
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Cuando los usuarios generen o gasten Fitcoins, los movimientos
              aparecerán aquí.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}