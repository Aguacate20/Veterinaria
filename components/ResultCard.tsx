import type { TriageResult } from "@/lib/schema";

const LEVELS = {
  emergencia: {
    label: "Emergencia",
    sub: "Acude al veterinario hoy, lo antes posible",
    ring: "border-red-200",
    bg: "bg-red-50",
    badge: "bg-red-600 text-white",
    accent: "text-red-700",
    bar: "bg-red-500",
  },
  pronto: {
    label: "Consulta pronto",
    sub: "Programa una cita en las próximas 24–72 horas",
    ring: "border-amber-200",
    bg: "bg-amber-50",
    badge: "bg-amber-500 text-white",
    accent: "text-amber-800",
    bar: "bg-amber-400",
  },
  observar: {
    label: "Observa en casa",
    sub: "Vigila su evolución y consulta si empeora",
    ring: "border-brand-200",
    bg: "bg-brand-50",
    badge: "bg-brand-600 text-white",
    accent: "text-brand-800",
    bar: "bg-brand-500",
  },
} as const;

type Props = {
  data: { result: TriageResult; redFlags: string[]; degraded?: boolean };
  species: "perro" | "gato";
  name?: string;
  onReset: () => void;
};

export default function ResultCard({ data, species, name, onReset }: Props) {
  const { result, redFlags, degraded } = data;
  const L = LEVELS[result.urgency];
  const who = name ? name : species === "perro" ? "tu perro" : "tu gato";

  return (
    <div className="rise space-y-5">
      <div className={`card overflow-hidden border ${L.ring}`}>
        <div className={`h-1.5 w-full ${L.bar}`} />
        <div className={`p-6 sm:p-10 ${L.bg}`}>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${L.badge}`}>{L.label}</span>
            <span className="text-xs font-medium text-ink/50">
              Confianza de la orientación: <strong className="text-ink/70">{result.confidence}</strong>
            </span>
          </div>
          <h3 className={`font-display mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl ${L.accent}`}>
            {result.headline}
          </h3>
          <p className="mt-1 text-sm font-medium text-ink/60">{L.sub}</p>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/80">{result.summary}</p>

          {redFlags.length > 0 && (
            <div className="mt-6 rounded-xl border border-red-200 bg-white/80 p-4">
              <p className="text-sm font-bold text-red-700">Señales que activaron la alerta</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
                {redFlags.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {degraded && (
            <p className="mt-4 text-xs text-ink/55">
              El análisis con IA no estuvo disponible, pero la alerta se generó por las señales de riesgo que marcaste.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {result.photoFindings && (
          <Section title="Qué se observa en la foto" icon="📷" className="md:col-span-2">
            <p className="text-sm leading-relaxed text-ink/80">{result.photoFindings}</p>
          </Section>
        )}

        <Section title="Señales de alarma: acude de inmediato si…" icon="🚨">
          <List items={result.warningSigns} />
        </Section>

        <Section title={`Cuidados en casa para ${who}`} icon="🏠">
          <List items={result.homeCare} />
        </Section>

        <Section title="Para contarle al veterinario" icon="📋" className="md:col-span-2">
          <List items={result.questionsForVet} />
        </Section>
      </div>

      <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/60">
          Esta orientación es preliminar y generada con IA. Solo un médico veterinario puede diagnosticar y tratar a {who}.
        </p>
        <div className="flex gap-3">
          <a
            href="https://www.google.com/maps/search/veterinaria+urgencias+cerca+de+mi"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !py-2.5 text-sm"
          >
            Buscar veterinaria cercana
          </a>
          <button type="button" onClick={onReset} className="btn-ghost">
            Nueva evaluación
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
  className = "",
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`card p-6 ${className}`}>
      <h4 className="flex items-center gap-2 text-sm font-bold text-brand-900">
        <span aria-hidden>{icon}</span> {title}
      </h4>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-sm text-ink/50">—</p>;
  return (
    <ul className="space-y-2 text-sm leading-relaxed text-ink/80">
      {items.map((it) => (
        <li key={it} className="flex gap-2.5">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
