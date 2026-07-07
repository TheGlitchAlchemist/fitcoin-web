import { requireBusiness } from "@/lib/auth/current-user";
import { supabaseServiceRole } from "@/lib/supabase/service-role";
import { PageHero } from "@/components/dashboard/page-hero";
import { Badge } from "@/components/dashboard/badge";
import { formatDateTime, formatFitcoins } from "@/lib/format";

export default async function RedemptionsPage() {
  const { business } = await requireBusiness();

  const { data: redemptions } = await supabaseServiceRole
    .from("redemptions")
    .select("*")
    .eq("business_id", business.id)
    .order("created_at", { ascending: false });

  const offerIds = [...new Set((redemptions ?? []).map((r) => r.offer_id))];
  const userIds = [...new Set((redemptions ?? []).map((r) => r.user_id))];

  const [{ data: offers }, { data: users }] = await Promise.all([
    offerIds.length
      ? supabaseServiceRole.from("offers").select("id, title").in("id", offerIds)
      : Promise.resolve({ data: [] as { id: string; title: string }[] }),

    userIds.length
      ? supabaseServiceRole
          .from("profiles")
          .select("id, full_name, email")
          .in("id", userIds)
      : Promise.resolve({
          data: [] as {
            id: string;
            full_name: string | null;
            email: string | null;
          }[],
        }),
  ]);

  const offerById = new Map((offers ?? []).map((offer) => [offer.id, offer]));
  const userById = new Map((users ?? []).map((user) => [user.id, user]));

  return (
    <>
      <PageHero
        title="Canjes"
        description="Todos los canjes realizados por usuarios en tu negocio, con su estado y detalle de Fitcoins."
      />

      <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h2 className="font-semibold text-slate-900">Lista de canjes</h2>
          <p className="text-sm text-slate-500">
            Registros obtenidos directamente desde Supabase.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <th className="px-6 py-3 font-medium">Oferta</th>
                <th className="px-6 py-3 font-medium">Usuario</th>
                <th className="px-6 py-3 font-medium">Código</th>
                <th className="px-6 py-3 font-medium">Precio</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium">Fecha</th>
                <th className="px-6 py-3 font-medium">Usado el</th>
              </tr>
            </thead>

            <tbody>
              {(redemptions ?? []).map((redemption) => {
                const offer = offerById.get(redemption.offer_id);
                const user = userById.get(redemption.user_id);

                return (
                  <tr
                    key={redemption.id}
                    className="border-b border-slate-200 last:border-0"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {offer?.title ?? "—"}
                    </td>

                    <td className="px-6 py-4">
                      {user?.full_name ?? user?.email ?? "—"}
                    </td>

                    <td className="px-6 py-4 font-mono text-xs">
                      {redemption.redemption_code}
                    </td>

                    <td className="px-6 py-4">
                      {formatFitcoins(redemption.fitcoin_price_at_purchase)}
                    </td>

                    <td className="px-6 py-4">
                      <Badge status={redemption.status} />
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {formatDateTime(redemption.created_at)}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {formatDateTime(redemption.used_at)}
                    </td>
                  </tr>
                );
              })}

              {(!redemptions || redemptions.length === 0) && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    Todavía no hay canjes registrados para tu negocio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}