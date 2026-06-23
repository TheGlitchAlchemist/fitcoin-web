import Link from "next/link";

const dashboardLinks = [
  {
    label: "Inicio",
    href: "/dashboard",
  },
  {
    label: "Ofertas",
    href: "/dashboard/offers",
  },
  {
    label: "Canjes",
    href: "/dashboard/redemptions",
  },
  {
    label: "Estadísticas",
    href: "/dashboard/stats",
  },
];

export function DashboardSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r bg-white p-6 md:block">
      <h2 className="mb-8 text-xl font-bold">Fitcoin Business</h2>

      <nav className="space-y-2">
        {dashboardLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}