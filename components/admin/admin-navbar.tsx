import { Bell, Search, UserRound } from "lucide-react";

export function AdminNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#17A649]">
            Panel administrativo
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-[#0B1A26]">
            Control general de Fitcoin
          </h2>
        </div>

        <div className="hidden flex-1 justify-center px-8 md:flex">
          <div className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-2.5">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar negocio, usuario o canje..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-[#F2F2F2]">
            <Bell className="h-5 w-5" />
          </button>

          <button className="flex items-center gap-2 rounded-2xl bg-[#0B1A26] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#12304a]">
            <UserRound className="h-4 w-4" />
            Admin
          </button>
        </div>
      </div>
    </header>
  );
}