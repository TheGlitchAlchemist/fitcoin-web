import Image from "next/image";
import { redirect } from "next/navigation";
import { login } from "../actions";
import { getCurrentUserProfile } from "@/lib/auth/current-user";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getCurrentUserProfile();
  const params = await searchParams;

  if (session?.profile.role === "admin") {
    redirect("/admin");
  }

  if (session?.profile.role === "business") {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B1A26] px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[1fr_1.1fr]">
        <div className="hidden bg-[#0B1A26] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="relative mb-6 h-20 w-20 overflow-hidden rounded-3xl bg-white">
              <Image
                src="/images/fitcoin-logo.jpeg"
                alt="Fitcoin Logo"
                fill
                sizes="80px"
                className="object-cover"
                priority
              />
            </div>

            <h1 className="text-4xl font-bold">Fitcoin</h1>
            <p className="mt-4 max-w-sm text-white/60">
              Plataforma administrativa para negocios, canjes, usuarios y
              transacciones fitness.
            </p>
          </div>

          <div className="rounded-3xl border border-[#17A649]/30 bg-[#17A649]/10 p-5">
            <p className="text-sm font-semibold text-[#2CBF42]">
              Acceso seguro
            </p>
            <p className="mt-2 text-sm text-white/60">
              El sistema redirige automáticamente según el rol del usuario.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white">
              <Image
                src="/images/fitcoin-logo.jpeg"
                alt="Fitcoin Logo"
                fill
                sizes="56px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#0B1A26]">Fitcoin</h1>
              <p className="text-sm text-slate-500">Panel web</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#17A649]">
              Iniciar sesión
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#0B1A26]">
              Bienvenido de vuelta
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Ingresa con tu cuenta asignada en Supabase.
            </p>
          </div>

          {params.error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {params.error}
            </div>
          )}

          <form action={login} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
                Correo electrónico
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="admin@fitcoin.com"
                className="w-full rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
                Contraseña
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#17A649] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#2CBF42]"
            >
              Entrar
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}