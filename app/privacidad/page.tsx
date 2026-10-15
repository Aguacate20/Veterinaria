import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = { title: "Política de privacidad", robots: { index: true } };

export default function Privacidad() {
  return (
    <LegalLayout title="Política de privacidad" updated="15 de octubre de 2026">
      <p>
        En {SITE_NAME} nos tomamos en serio tu privacidad. Esta política explica qué información se procesa cuando usas la
        herramienta, con qué fin y con quién se comparte. Está redactada conforme a la Ley 1581 de 2012 (Colombia) y los
        principios generales de protección de datos.
      </p>

      <h2 className="font-display text-2xl font-semibold text-brand-900">1. Qué información procesamos</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li><strong>Respuestas de la encuesta</strong>: especie, edad y sexo de tu mascota, síntomas, duración y descripción libre.</li>
        <li><strong>Foto</strong> (opcional): la imagen que subas de tu mascota, reducida de tamaño en tu propio dispositivo antes de enviarse.</li>
        <li><strong>Datos técnicos</strong>: dirección IP (para limitar abusos), tipo de navegador y páginas visitadas (analítica agregada).</li>
      </ul>
      <p>No pedimos tu nombre, correo ni datos de contacto para usar la herramienta. Te recomendamos no incluir datos personales en el campo de texto libre.</p>

      <h2 className="font-display text-2xl font-semibold text-brand-900">2. Para qué la usamos</h2>
      <p>
        Únicamente para generar la orientación que ves en pantalla. Las respuestas y la foto se envían a un proveedor de
        inteligencia artificial, que las analiza y devuelve el resultado. <strong>No guardamos</strong> tus respuestas, tu foto ni el
        resultado en nuestros servidores.
      </p>

      <h2 className="font-display text-2xl font-semibold text-brand-900">3. Con quién se comparte</h2>
      <ul className="list-disc space-y-1 pl-6">
        <li>
          <strong>Proveedor de IA (NVIDIA)</strong>: procesa la encuesta y la foto para generar el resultado. Usamos su servicio
          gratuito para desarrolladores, cuyos términos permiten a NVIDIA utilizar las peticiones para mejorar sus servicios. Por
          eso te pedimos no subir fotos donde aparezcan personas ni información personal.
        </li>
        <li><strong>Vercel</strong>: aloja la página y nos provee analítica agregada y anónima (sin cookies de rastreo).</li>
        <li>
          <strong>Google AdSense</strong> (cuando haya publicidad activa): muestra anuncios y puede usar cookies para personalizarlos.
          Puedes gestionar la personalización en <a className="text-brand-700 underline" href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>.
        </li>
      </ul>
      <p>No vendemos ni cedemos tu información a terceros con otros fines.</p>

      <h2 className="font-display text-2xl font-semibold text-brand-900">4. Cookies</h2>
      <p>
        La herramienta funciona sin cookies propias. Los anuncios de terceros pueden instalar cookies según sus propias políticas;
        puedes bloquearlas desde tu navegador sin que la herramienta deje de funcionar.
      </p>

      <h2 className="font-display text-2xl font-semibold text-brand-900">5. Menores de edad</h2>
      <p>El servicio está dirigido a mayores de 18 años. Si eres menor, pide a un adulto que te acompañe.</p>

      <h2 className="font-display text-2xl font-semibold text-brand-900">6. Tus derechos</h2>
      <p>
        Como no almacenamos datos personales, no conservamos información que puedas consultar o eliminar. Si tienes dudas o
        quieres ejercer cualquier derecho, escríbenos a <a className="text-brand-700 underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <h2 className="font-display text-2xl font-semibold text-brand-900">7. Cambios</h2>
      <p>Si esta política cambia, actualizaremos la fecha al inicio de la página.</p>
    </LegalLayout>
  );
}
