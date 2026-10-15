import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { CONTACT_EMAIL, CONTACT_PHONE, SITE_NAME, WHATSAPP_URL } from "@/lib/site";

export const metadata: Metadata = { title: "Términos de uso", robots: { index: true } };

export default function Terminos() {
  return (
    <LegalLayout title="Términos de uso" updated="15 de octubre de 2026">
      <p>Al usar {SITE_NAME} aceptas estos términos. Si no estás de acuerdo con alguno, por favor no uses la herramienta.</p>

      <h2 className="font-display text-2xl font-semibold text-brand-900">1. Qué es y qué no es</h2>
      <p>
        {SITE_NAME} es una herramienta de <strong>orientación preliminar</strong> generada con inteligencia artificial. Te ayuda a
        decidir con qué urgencia conviene que un profesional revise a tu mascota. <strong>No es un diagnóstico, no es un
        tratamiento y no reemplaza la consulta con un médico veterinario.</strong> La IA puede equivocarse, tanto subestimando
        como sobreestimando la gravedad.
      </p>

      <h2 className="font-display text-2xl font-semibold text-brand-900">2. Emergencias</h2>
      <p>
        Si tu mascota tiene dificultad para respirar, convulsiones, sangrado abundante, colapso o ingirió algo tóxico, no uses
        esta herramienta: acude a un veterinario de urgencias de inmediato.
      </p>

      <h2 className="font-display text-2xl font-semibold text-brand-900">3. Uso responsable</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>Usa la herramienta solo para mascotas bajo tu cuidado.</li>
        <li>No subas fotos de personas ni información personal.</li>
        <li>No intentes sobrecargar el servicio ni usarlo de forma automatizada. Aplicamos límites de uso por persona y por día.</li>
      </ul>

      <h2 className="font-display text-2xl font-semibold text-brand-900">4. Gratuidad y publicidad</h2>
      <p>
        La herramienta es gratuita. Para mantenerla, la página puede mostrar anuncios claramente identificados como
        «Publicidad». Nunca mostramos anuncios que bloqueen el contenido, ventanas emergentes ni anuncios dentro del resultado.
      </p>

      <h2 className="font-display text-2xl font-semibold text-brand-900">5. Limitación de responsabilidad</h2>
      <p>
        El servicio se ofrece «tal cual», sin garantías de exactitud o disponibilidad. En la medida permitida por la ley, {SITE_NAME}
        y sus creadores no son responsables por decisiones tomadas con base en la orientación mostrada ni por daños derivados
        del uso o imposibilidad de uso de la herramienta.
      </p>

      <h2 className="font-display text-2xl font-semibold text-brand-900">6. Contacto</h2>
      <p>Dudas o sugerencias:         <a className="text-brand-700 underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> o al{" "}
        <a className="text-brand-700 underline" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">{CONTACT_PHONE} (WhatsApp)</a>.</p>
    </LegalLayout>
  );
}
