import Link from "next/link";
import type { ReactNode } from "react";

/** Render de un markdown reducido: ##, ###, listas "-", citas ">" (avisos), **negrita**, [texto](url), párrafos. */
export default function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r/g, "").split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;

  const flushPara = (buf: string[]) => {
    if (buf.length) out.push(<p key={key++}>{inline(buf.join(" "))}</p>);
    buf.length = 0;
  };

  const para: string[] = [];
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      flushPara(para);
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      flushPara(para);
      const text = line.slice(3).trim();
      out.push(
        <h2 key={key++} id={slugify(text)} className="font-display scroll-mt-24 pt-4 text-2xl font-semibold tracking-tight text-brand-900">
          {inline(text)}
        </h2>,
      );
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      flushPara(para);
      out.push(
        <h3 key={key++} className="pt-2 text-lg font-semibold text-brand-900">
          {inline(line.slice(4).trim())}
        </h3>,
      );
      i++;
      continue;
    }
    if (line.startsWith("> ")) {
      flushPara(para);
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) buf.push(lines[i++].slice(2));
      const text = buf.join(" ");
      const urgent = /^⚠️|^🚨/.test(text);
      out.push(
        <div
          key={key++}
          className={`rounded-xl border px-5 py-4 text-[15px] leading-relaxed ${
            urgent ? "border-red-200 bg-red-50 text-red-900" : "border-brand-200 bg-brand-50 text-brand-900"
          }`}
        >
          {inline(text)}
        </div>,
      );
      continue;
    }
    if (line.startsWith("- ")) {
      flushPara(para);
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) items.push(lines[i++].slice(2));
      out.push(
        <ul key={key++} className="list-disc space-y-1.5 pl-6">
          {items.map((it, n) => (
            <li key={n}>{inline(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    para.push(line.trim());
    i++;
  }
  flushPara(para);
  return <div className="space-y-5 text-[16px] leading-[1.75] text-ink/80">{out}</div>;
}

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1]) nodes.push(<strong key={k++} className="font-semibold text-ink">{m[1]}</strong>);
    else if (m[2]) {
      const href = m[3];
      nodes.push(
        href.startsWith("/") ? (
          <Link key={k++} href={href} className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-900">
            {m[2]}
          </Link>
        ) : (
          <a key={k++} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-700 underline">
            {m[2]}
          </a>
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
