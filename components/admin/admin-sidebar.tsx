import Link from "next/link";

const adminLinks = [
  {
    label: "Inicio",
    href: "/admin",
  },
  {
    label: "Negocios",
    href: "/admin/businesses",
  },
  {
    label: "Usuarios",
    href: "/admin/users",
  },
  {
    label: "Transacciones",
    href: "/admin/transactions",
  },
  {
    label: "Canjes",
    href: "/admin/redemptions",
  },
  {
    label: "Actividad sospechosa",
    href: "/admin/suspicious-activity",
  },
];

export function AdminSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r bg-white p-6 md:block">
      <h2 className="mb-8 text-xl font-bold">Fitcoin Admin</h2>

      <nav className="space-y-2">
        {adminLinks.map((link) => (
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