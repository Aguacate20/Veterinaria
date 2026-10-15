import Link from "next/link";
import type { Guide } from "@/lib/guias/types";

export default function GuideCard({ g, compact = false }: { g: Guide; compact?: boolean }) {
  return (
    <Link
      href={`/guias/${g.slug}`}
      className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-brand-300"
    >
      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
        {g.species === "ambos" ? "🐶🐱 Perros y gatos" : g.species === "perro" ? "🐶 Perros" : "🐱 Gatos"}
      </span>
      <h3 className={`mt-2 font-semibold leading-snug text-brand-900 group-hover:text-brand-700 ${compact ? "text-base" : "text-lg"}`}>
        {g.title}
      </h3>
      {!compact && <p className="mt-2 text-sm leading-relaxed text-ink/65">{g.description}</p>}
      <span className="mt-auto pt-3 text-sm font-semibold text-brand-700">Leer guía →</span>
    </Link>
  );
}
