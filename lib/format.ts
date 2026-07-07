export function formatDate(value: string | null): string {
  if (!value) return "—";

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string | null): string {
  if (!value) return "—";

  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatFitcoins(value: number): string {
  return `${value.toLocaleString("es-MX")} FIT`;
}