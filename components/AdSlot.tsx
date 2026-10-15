"use client";

import { useEffect, useRef } from "react";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT; // ej. ca-pub-1234567890123456

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Espacio publicitario no invasivo (Google AdSense, formato responsive "in-article").
 * - No se renderiza nada si NEXT_PUBLIC_ADSENSE_CLIENT no está definido.
 * - Siempre se etiqueta como "Publicidad" y nunca cubre contenido ni usa pop-ups.
 */
export default function AdSlot({ slot, className = "" }: { slot: string; className?: string }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* el bloqueador de anuncios puede impedirlo; no pasa nada */
    }
  }, []);

  if (!CLIENT) return null;

  return (
    <aside className={`my-10 ${className}`} aria-label="Publicidad">
      <p className="mb-1 text-center text-[11px] uppercase tracking-wider text-ink/40">Publicidad</p>
      <ins
        className="adsbygoogle block min-h-[100px] rounded-xl bg-sand-100/60"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format="fluid"
        data-ad-layout="in-article"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
