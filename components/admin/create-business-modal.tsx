"use client";

import { useState } from "react";
import { Plus, X, Building2, Save } from "lucide-react";
import { createBusiness } from "@/app/(admin)/admin/businesses/actions";

export function CreateBusinessModal() {
  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="hidden items-center justify-center gap-2 rounded-2xl bg-[#17A649] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2CBF42] lg:inline-flex"
      >
        <Plus className="h-5 w-5" />
        Nuevo negocio
      </button>

      <button
        type="button"
        onClick={openModal}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#17A649] text-white shadow-2xl shadow-[#17A649]/30 transition hover:bg-[#2CBF42] lg:hidden"
        aria-label="Nuevo negocio"
      >
        <Plus className="h-7 w-7" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <button
            type="button"
            onClick={closeModal}
            className="absolute inset-0"
            aria-label="Cerrar modal"
          />

            <section className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-slate-200 bg-white p-5 text-[#0B1A26] shadow-2xl sm:max-w-5xl sm:rounded-[2rem] sm:p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-[#17A649]/10 p-3 text-[#17A649]">
                  <Building2 className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#0B1A26]">
                    Agregar negocio
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    Registra un nuevo negocio afiliado y crea su cuenta de
                    acceso al panel de negocio.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-[#F2F2F2] hover:text-[#0B1A26]"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={createBusiness} className="grid gap-4 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
                  Nombre del negocio
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Ej. Fit Market Colima"
                  className="w-full rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
                />
              </div>

              <div className="lg:col-span-1">
                <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
                  Descripción
                </label>
                <input
                  name="description"
                  type="text"
                  placeholder="Ej. Tienda saludable"
                  className="w-full rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
                />
              </div>

              <div className="lg:col-span-1">
                <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
                  Dirección
                </label>
                <input
                  name="address"
                  type="text"
                  placeholder="Ej. Colima, Colima"
                  className="w-full rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
                />
              </div>

              <div className="lg:col-span-1">
                <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
                  Estado
                </label>
                <select
                  name="status"
                  defaultValue="active"
                  className="w-full rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
                  Nombre del encargado
                </label>
                <input
                  name="accountFullName"
                  type="text"
                  placeholder="Ej. Encargado Fit Market"
                  className="w-full rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#0B1A26]">
                  Correo de acceso del negocio
                </label>
                <input
                  name="accountEmail"
                  type="email"
                  placeholder="Ej. negocio@correo.com"
                  className="w-full rounded-2xl border border-slate-200 bg-[#F2F2F2] px-4 py-3 text-sm outline-none transition focus:border-[#17A649] focus:bg-white"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Si lo dejas vacío, Fitcoin generará un correo automático para
                  iniciar sesión.
                </p>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row lg:col-span-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#17A649] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#2CBF42]"
                >
                  <Save className="h-5 w-5" />
                  Guardar negocio y crear usuario
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 transition hover:bg-[#F2F2F2]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}