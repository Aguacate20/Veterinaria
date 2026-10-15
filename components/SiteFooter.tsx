import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-sand-200 pt-8 text-sm text-ink/55">
      <p>
        <strong className="text-ink/75">Aviso importante.</strong> {SITE_NAME} ofrece orientación preliminar generada con
        inteligencia artificial y no constituye un diagnóstico ni reemplaza la valoración de un médico veterinario. Si tu
        mascota tiene dificultad para respirar, convulsiones, sangrado abundante o colapsa, acude a urgencias de inmediato.
      </p>
      <p className="mt-3">Las fotos y respuestas se usan únicamente para generar tu resultado y no se almacenan en nuestros servidores.</p>
      <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-medium">
        <Link href="/acerca" className="hover:text-brand-700">Acerca de</Link>
        <Link href="/privacidad" className="hover:text-brand-700">Privacidad</Link>
        <Link href="/terminos" className="hover:text-brand-700">Términos de uso</Link>
        <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-brand-700">Contacto</a>
      </nav>
      <p className="mt-6 text-xs">© {new Date().getFullYear()} {SITE_NAME}. Hecho en Colombia 🇨🇴</p>
    </footer>
  );
}
