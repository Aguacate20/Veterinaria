import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Huella Sana · ¿Mi perro o gato necesita ir al veterinario?",
  description:
    "Responde una encuesta breve, sube una foto y recibe una orientación preliminar con IA sobre la urgencia de llevar a tu mascota al veterinario.",
  openGraph: {
    title: "Huella Sana",
    description: "Orientación preliminar con IA para saber si tu mascota necesita ir al veterinario.",
    type: "website",
  },
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
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
