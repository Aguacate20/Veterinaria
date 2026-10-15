/** URL pública del sitio. En Vercel define NEXT_PUBLIC_SITE_URL (p. ej. https://huellasana.vercel.app o tu dominio). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Huella Sana";

export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "cocovet68@gmail.com";
/** Teléfono de contacto tal como se muestra */
export const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "310 358 8067";
/** Mismo número en formato internacional para enlaces tel:/WhatsApp (Colombia +57) */
export const CONTACT_PHONE_INTL = "57" + CONTACT_PHONE.replace(/\D/g, "").replace(/^57/, "");
export const WHATSAPP_URL = `https://wa.me/${CONTACT_PHONE_INTL}`;
