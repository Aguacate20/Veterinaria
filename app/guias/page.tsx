import type { Metadata } from "next";
import Link from "next/link";
import GuideCard from "@/components/GuideCard";
import SiteFooter from "@/components/SiteFooter";
import SurveyCta from "@/components/SurveyCta";
import { GUIDES } from "@/lib/guias";

export const metadata: Metadata = {
  title: "Guías: síntomas en perros y gatos y cuándo ir al veterinario",
  description:
    "Guías claras en español sobre vómito, diarrea, falta de apetito, decaimiento y otras señales en perros y gatos: qué observar en casa y cuándo acudir al veterinario.",
  alternates: { canonical: "/guias" },
};

export default function GuiasIndex() {
  const perros = GUIDES.filter((g) => g.species === "perro");
  const gatos = GUIDES.filter((g) => g.species === "gato");
  const ambos = GUIDES.filter((g) => g.species === "ambos");

  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-8 sm:px-8">
      <Link href="/" className="text-sm font-semibold text-brand-700 hover:underline">← Huella Sana</Link>
      <h1 className="font-display mt-8 text-4xl font-semibold tracking-tight text-brand-900 sm:text-5xl">Guías para dueños</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink/70">
        Qué significa cada síntoma, qué puedes observar en casa y cuándo es momento de ir al veterinario. Escritas en
        lenguaje sencillo, pensadas para leerse en el momento en que más preocupa.
      </p>

      <Section title="🐶 Perros" items={perros} />
      <Section title="🐱 Gatos" items={gatos} />
      <Section title="🐾 Para perros y gatos" items={ambos} />

      <SurveyCta />
      <SiteFooter />
    </main>
  );
}

function Section({ title, items }: { title: string; items: typeof GUIDES }) {
  if (!items.length) return null;
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-semibold text-brand-900">{title}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((g) => (
          <GuideCard key={g.slug} g={g} />
        ))}
      </div>
    </section>
  );
}
