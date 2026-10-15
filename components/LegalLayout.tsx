import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function LegalLayout({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-8 sm:px-8">
      <Link href="/" className="text-sm font-semibold text-brand-700 hover:underline">
        ← Volver a {SITE_NAME}
      </Link>
      <h1 className="font-display mt-8 text-4xl font-semibold tracking-tight text-brand-900">{title}</h1>
      <p className="mt-2 text-sm text-ink/50">Última actualización: {updated}</p>
      <article className="prose-hs mt-8 space-y-6 text-[15.5px] leading-relaxed text-ink/80">{children}</article>
    </main>
  );
}
