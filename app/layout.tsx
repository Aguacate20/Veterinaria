import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Huella Sana · ¿Mi perro o gato necesita ir al veterinario?",
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Responde una encuesta breve, sube una foto y recibe una orientación preliminar con IA sobre si tu perro o gato necesita ir al veterinario: emergencia, consulta pronto u observar en casa. Gratis.",
  keywords: [
    "mi perro está enfermo",
    "mi gato está enfermo",
    "llevar al veterinario",
    "síntomas perro",
    "síntomas gato",
    "veterinario urgencias",
    "orientación veterinaria IA",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "¿Mi perro o gato necesita ir al veterinario?",
    description: "Encuesta breve + foto. Orientación preliminar con IA en 1 minuto. Gratis.",
  },
  twitter: {
    card: "summary_large_image",
    title: "¿Mi perro o gato necesita ir al veterinario?",
    description: "Encuesta breve + foto. Orientación preliminar con IA en 1 minuto. Gratis.",
  },
  robots: { index: true, follow: true },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,400..700,0..100&family=Inter:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: SITE_NAME,
              url: SITE_URL,
              applicationCategory: "HealthApplication",
              operatingSystem: "Web",
              inLanguage: "es",
              offers: { "@type": "Offer", price: "0", priceCurrency: "COP" },
              description:
                "Orientación preliminar con IA para saber si un perro o gato necesita ir al veterinario, a partir de una encuesta breve y una foto.",
            }),
          }}
        />
        {children}
        <Analytics />
        {ADSENSE_CLIENT && (
          <Script
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
