import { Database, ServerCrash } from "lucide-react";
import { supabaseAdminServer } from "@/lib/supabase/admin-server";

export async function AdminBackendStatus() {
  try {
    const { data, error } = await supabaseAdminServer
      .from("businesses")
      .select("id, name, status")
      .limit(3);

    if (error) {
      console.error("Supabase query error:", error);

      return (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-red-100 p-3 text-red-600">
              <ServerCrash className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-bold text-red-700">
                Error conectando con Supabase
              </h3>

              <p className="mt-2 text-sm font-medium text-red-600">
                {error.message || "Supabase devolvió un error sin mensaje."}
              </p>

              <pre className="mt-3 overflow-auto rounded-xl bg-white p-3 text-xs text-red-500">
                {JSON.stringify(
                  {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-[1.5rem] border border-[#17A649]/20 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#17A649]/10 p-3 text-[#17A649]">
            <Database className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-bold text-[#0B1A26]">
              Backend conectado correctamente
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Supabase respondió correctamente. Negocios leídos:{" "}
              <span className="font-bold text-[#17A649]">
                {data?.length ?? 0}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Supabase general error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    return (
      <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-red-100 p-3 text-red-600">
            <ServerCrash className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-bold text-red-700">
              Error general conectando con Supabase
            </h3>

            <p className="mt-2 text-sm font-medium text-red-600">
              {errorMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }
}