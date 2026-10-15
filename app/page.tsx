import AdSlot from "@/components/AdSlot";
import SiteFooter from "@/components/SiteFooter";
import SurveyForm from "@/components/SurveyForm";

const STEPS = [
  {
    n: "01",
    title: "Cuéntanos qué pasa",
    text: "Marca los síntomas, desde cuándo ocurren y cómo ves a tu mascota. Toma menos de dos minutos.",
  },
  {
    n: "02",
    title: "Sube una foto (opcional)",
    text: "Una imagen de la zona afectada, los ojos o la postura ayuda a la IA a darte una orientación más precisa.",
  },
  {
    n: "03",
    title: "Recibe una orientación clara",
    text: "Te indicamos si es una emergencia, si conviene una cita pronto o si puedes observar en casa, y qué vigilar.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-8 sm:px-8">
      <header className="flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-sm">
            <PawIcon className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-brand-900">Huella Sana</span>
        </a>
        <a href="#encuesta" className="btn-ghost hidden sm:inline-flex">
          Empezar evaluación
        </a>
      </header>

      <section className="rise mt-16 grid items-center gap-10 sm:mt-24 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Orientación con IA · Gratis
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-brand-900 sm:text-6xl">
            ¿Mi perro o gato <em className="not-italic text-brand-600">necesita ir</em> al veterinario?
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
            Cuando tu mascota no está bien, la duda más difícil es si esperar o salir corriendo. Responde una encuesta breve,
            sube una foto y te ayudamos a decidir con calma.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#encuesta" className="btn-primary">
              Evaluar a mi mascota
              <ArrowIcon className="h-4 w-4" />
            </a>
            <a href="#como-funciona" className="btn-ghost">
              Cómo funciona
            </a>
          </div>
          <p className="mt-6 text-sm text-ink/55">
            No reemplaza a un veterinario. Ante una emergencia evidente, llama o acude de inmediato.
          </p>
        </div>

        <div className="card relative overflow-hidden p-6 sm:p-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-100/70 blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Ejemplo de resultado</p>
          <div className="mt-4 flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <ClockIcon className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-xl font-semibold text-brand-900">Consulta en las próximas 24–48 h</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/70">
                Vómito ocasional de dos días en un perro adulto que sigue bebiendo agua y activo. No parece una emergencia, pero
                conviene que lo revisen pronto.
              </p>
            </div>
          </div>
          <ul className="mt-5 space-y-2 text-sm text-ink/75">
            <li className="flex gap-2">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> Retira la comida 6–8 h y ofrece agua fresca.
            </li>
            <li className="flex gap-2">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> Acude hoy mismo si aparece sangre o decaimiento.
            </li>
          </ul>
        </div>
      </section>

      <section id="como-funciona" className="mt-24 scroll-mt-8">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-900">Cómo funciona</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card p-6">
              <p className="font-display text-3xl font-semibold text-brand-300">{s.n}</p>
              <h3 className="mt-3 text-lg font-semibold text-brand-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <AdSlot slot="1111111111" />

      <section id="encuesta" className="mt-24 scroll-mt-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-brand-900">Evaluación breve</h2>
          <p className="mt-2 text-ink/70">
            Responde con la mayor sinceridad posible. Si no estás seguro de algo, elige la opción que más se acerque.
          </p>
        </div>
        <SurveyForm />
      </section>

      <SiteFooter />
    </main>
  );
}

function PawIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <circle cx="6" cy="9.5" r="2.2" />
      <circle cx="10" cy="5.5" r="2.2" />
      <circle cx="14.5" cy="5.5" r="2.2" />
      <circle cx="18.5" cy="9.5" r="2.2" />
      <path d="M12.2 10.5c-3.2 0-6.5 3.3-6.5 6.2 0 1.7 1.2 2.8 2.9 2.8 1.3 0 2.1-.6 3.6-.6s2.3.6 3.6.6c1.7 0 2.9-1.1 2.9-2.8 0-2.9-3.3-6.2-6.5-6.2z" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className} aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
