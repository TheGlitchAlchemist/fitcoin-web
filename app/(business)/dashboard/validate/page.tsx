import { PageHero } from "@/components/dashboard/page-hero";
import { ValidateForm } from "@/components/dashboard/validate-form";

export default function ValidatePage() {
  return (
    <>
      <PageHero
        title="Validar canje"
        description="Ingresa el código que te muestra el usuario para confirmar y marcar su canje como usado."
      />

      <div className="mx-auto mt-6 max-w-lg rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <ValidateForm />
      </div>
    </>
  );
}