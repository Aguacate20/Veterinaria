import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Huella Sana · ¿Mi perro o gato necesita ir al veterinario?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #fbf8f3 0%, #eef7f3 100%)",
          color: "#13392d",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 700 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "#1f6c50", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 30 }}>🐾</div>
          Huella Sana
        </div>
        <div style={{ marginTop: 40, fontSize: 72, fontWeight: 700, lineHeight: 1.05, maxWidth: 1000 }}>
          ¿Mi perro o gato necesita ir al veterinario?
        </div>
        <div style={{ marginTop: 32, fontSize: 32, color: "#1c2321", opacity: 0.7, fontFamily: "sans-serif" }}>
          Encuesta breve + foto · Orientación con IA en 1 minuto · Gratis
        </div>
      </div>
    ),
    { ...size },
  );
}
