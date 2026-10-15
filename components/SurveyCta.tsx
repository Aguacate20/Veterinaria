import Link from "next/link";

export default function SurveyCta({ species }: { species?: "perro" | "gato" | "ambos" }) {
  const who = species === "perro" ? "tu perro" : species === "gato" ? "tu gato" : "tu mascota";
  return (
    <div className="card my-10 border-brand-200 bg-brand-50/60 p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Herramienta gratuita</p>
      <h3 className="font-display mt-2 text-2xl font-semibold text-brand-900">¿No sabes si {who} necesita ir al veterinario?</h3>
      <p className="mt-2 text-ink/70">
        Responde una encuesta de dos minutos, sube una foto y recibe una orientación sobre la urgencia: emergencia, consulta
        pronto u observar en casa.
      </p>
      <Link href="/#encuesta" className="btn-primary mt-5">
        Evaluar a {who} ahora
      </Link>
    </div>
  );
}
