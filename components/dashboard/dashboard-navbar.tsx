export function DashboardNavbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold">Dashboard del negocio</h1>
        <p className="text-sm text-gray-500">Gestión de ofertas y canjes</p>
      </div>

      <button className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100">
        Cerrar sesión
      </button>
    </header>
  );
}