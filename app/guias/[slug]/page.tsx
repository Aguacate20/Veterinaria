import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import GuideCard from "@/components/GuideCard";
import Markdown from "@/components/Markdown";
import SiteFooter from "@/components/SiteFooter";
import SurveyCta from "@/components/SurveyCta";
import { GUIDES, getGuide } from "@/lib/guias";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    keywords: g.keywords,
    alternates: { canonical: `/guias/${g.slug}` },
    openGraph: {
      type: "article",
      title: g.title,
      description: g.description,
      url: `${SITE_URL}/guias/${g.slug}`,
      publishedTime: g.published,
      modifiedTime: g.updated,
    },
  };
}

function fmt(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  const related = GUIDES.filter((x) => x.slug !== g.slug && (x.species === g.species || x.species === "ambos" || g.species === "ambos")).slice(0, 3);
  const speciesLabel = g.species === "ambos" ? "Perros y gatos" : g.species === "perro" ? "Perros" : "Gatos";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: g.title,
        description: g.description,
        inLanguage: "es",
        datePublished: g.published,
        dateModified: g.updated,
        author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        mainEntityOfPage: `${SITE_URL}/guias/${g.slug}`,
        about: { "@type": "Thing", name: speciesLabel },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Guías", item: `${SITE_URL}/guias` },
          { "@type": "ListItem", position: 3, name: g.shortTitle, item: `${SITE_URL}/guias/${g.slug}` },
        ],
      },
    ],
  };

  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-8 sm:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="flex flex-wrap items-center gap-2 text-sm text-ink/55" aria-label="Ruta">
        <Link href="/" className="font-semibold text-brand-700 hover:underline">Huella Sana</Link>
        <span>›</span>
        <Link href="/guias" className="font-semibold text-brand-700 hover:underline">Guías</Link>
        <span>›</span>
        <span>{g.shortTitle}</span>
      </nav>

      <header className="mt-8">
        <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">
          {speciesLabel}
        </span>
        <h1 className="font-display mt-4 text-3xl font-semibold leading-tight tracking-tight text-brand-900 sm:text-5xl">{g.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink/70">{g.description}</p>
        <p className="mt-3 text-sm text-ink/50">Actualizado el {fmt(g.updated)} · Lectura de {Math.max(3, Math.round(g.body.split(/\s+/).length / 200))} min</p>
      </header>

      <div className="mt-6 rounded-xl border border-sand-200 bg-sand-100/60 px-5 py-3 text-sm text-ink/65">
        Esta guía es orientativa y no reemplaza la valoración de un médico veterinario. Si tu mascota tiene dificultad para
        respirar, convulsiones, sangrado abundante o colapsa, acude a urgencias de inmediato.
      </div>

      <article className="mt-10">
        <Markdown source={g.body} />
      </article>

      <SurveyCta species={g.species} />
      <AdSlot slot="3333333333" />

      {related.length > 0 && (
        <section className="mt-6">
          <h2 className="font-display text-2xl font-semibold text-brand-900">También te puede servir</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <GuideCard key={r.slug} g={r} compact />
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
