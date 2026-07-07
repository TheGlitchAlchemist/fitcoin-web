const STYLES: Record<string, string> = {
  active: "bg-green-50 text-green-700",
  inactive: "bg-amber-50 text-amber-700",
  pending: "bg-amber-50 text-amber-700",
  used: "bg-slate-100 text-slate-600",
  expired: "bg-red-50 text-red-600",
  cancelled: "bg-red-50 text-red-600",
};

const LABELS: Record<string, string> = {
  active: "Activo",
  inactive: "Inactivo",
  pending: "Pendiente",
  used: "Usado",
  expired: "Expirado",
  cancelled: "Cancelado",
};

export function Badge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        STYLES[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}