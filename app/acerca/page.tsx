import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { CONTACT_EMAIL, CONTACT_PHONE, SITE_NAME, WHATSAPP_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Acerca de",
  description: "Por qué existe Huella Sana, cómo funciona la orientación con IA y quién está detrás.",
};

export default function Acerca() {
  return (
    <LegalLayout title={`Acerca de ${SITE_NAME}`} updated="15 de octubre de 2026">
      <p>
        Cuando una mascota no está bien, la pregunta que más angustia es «¿esperar o salir ya?». {SITE_NAME} nace para ayudar a
        responderla con calma: una encuesta de dos minutos, una foto opcional y una orientación clara sobre la urgencia.
      </p>

      <h2 className="font-display text-2xl font-semibold text-brand-900">Cómo funciona por dentro</h2>
      <p>
        Tus respuestas y la foto se analizan con un modelo de inteligencia artificial con visión. Además, un conjunto de
        <strong> reglas de seguridad independientes de la IA</strong> revisa señales de alarma conocidas (dificultad respiratoria,
        convulsiones, posible intoxicación, obstrucción urinaria en gatos, entre otras) y, si aparece alguna, el resultado se
        marca como emergencia sin importar lo que diga el modelo. Preferimos una visita de más que una de menos.
      </p>

      <h2 className="font-display text-2xl font-semibold text-brand-900">Quién está detrás</h2>
      <p>
        {SITE_NAME} es un proyecto independiente desarrollado en Colombia por un investigador en psicología de la confianza en
        la inteligencia artificial. Nos interesa que las personas usen la IA de forma informada: sabiendo qué puede hacer bien y
        dónde debe entrar un profesional.
      </p>

      <h2 className="font-display text-2xl font-semibold text-brand-900">Gratis, y cómo se sostiene</h2>
      <p>
        La herramienta es y seguirá siendo gratuita. Para cubrir los costos de servidores y de la IA mostramos publicidad
        discreta y claramente identificada, nunca dentro del resultado ni bloqueando el contenido.
      </p>

      <h2 id="contacto" className="font-display scroll-mt-8 text-2xl font-semibold text-brand-900">Contacto</h2>
      <p>
        ¿Eres veterinario y quieres colaborar, o encontraste un error? Escríbenos a{" "}
                <a className="text-brand-700 underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> o al{" "}
        <a className="text-brand-700 underline" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">{CONTACT_PHONE} (WhatsApp)</a>.
      </p>
    </LegalLayout>
  );
}
