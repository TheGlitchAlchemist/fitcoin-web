import { AlertCircle, CheckCircle2 } from "lucide-react";

type StatusMessageProps = {
  success?: string;
  error?: string;
};

export function StatusMessage({ success, error }: StatusMessageProps) {
  if (!success && !error) return null;

  const isSuccess = Boolean(success);
  const message = success || error;

  return (
    <div
      className={[
        "rounded-[1.5rem] border p-5 shadow-sm",
        isSuccess
          ? "border-[#17A649]/20 bg-[#17A649]/10 text-[#0B1A26]"
          : "border-red-200 bg-red-50 text-red-700",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "rounded-2xl p-2",
            isSuccess ? "bg-[#17A649]/15 text-[#17A649]" : "bg-red-100 text-red-600",
          ].join(" ")}
        >
          {isSuccess ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
        </div>

        <div>
          <p className="font-bold">
            {isSuccess ? "Operación exitosa" : "Ocurrió un error"}
          </p>
          <p className="mt-1 text-sm opacity-80">{message}</p>
        </div>
      </div>
    </div>
  );
}