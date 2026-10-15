import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { resultSchema, surveySchema } from "@/lib/schema";
import { SYSTEM_PROMPT, buildUserText } from "@/lib/prompt";
import { applyRedFlags, detectRedFlags } from "@/lib/triage";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";

type ImageMediaType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

function parseDataUrl(dataUrl: string): { mediaType: ImageMediaType; data: string } | null {
  const m = /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!m) return null;
  return { mediaType: m[1] as ImageMediaType, data: m[2] };
}

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("La respuesta del modelo no contiene JSON");
  return JSON.parse(text.slice(start, end + 1));
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Falta configurar ANTHROPIC_API_KEY en el servidor." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido." }, { status: 400 });
  }

  const parsed = surveySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos del formulario inválidos.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const survey = parsed.data;
  const redFlags = detectRedFlags(survey);

  const content: Anthropic.Messages.ContentBlockParam[] = [];
  if (survey.photo) {
    const img = parseDataUrl(survey.photo);
    if (img) {
      content.push({
        type: "image",
        source: { type: "base64", media_type: img.mediaType, data: img.data },
      });
    }
  }
  content.push({ type: "text", text: buildUserText(survey) });

  const client = new Anthropic();

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    });

    const text = message.content
      .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    const result = resultSchema.parse(extractJson(text));
    const final = applyRedFlags(result, redFlags);

    return NextResponse.json({ result: final, redFlags, model: MODEL });
  } catch (err) {
    console.error("[analyze] error", err);
    // Si la IA falla pero hay banderas rojas, aun así devolvemos la alerta.
    if (redFlags.length > 0) {
      return NextResponse.json({
        result: applyRedFlags(
          {
            urgency: "emergencia",
            confidence: "alta",
            headline: "Acude al veterinario lo antes posible",
            summary:
              "Los síntomas que marcaste incluyen señales que requieren atención veterinaria inmediata. No esperes a que mejore por sí solo.",
            photoFindings: null,
            warningSigns: [],
            homeCare: ["Mantén a tu mascota tranquila y abrigada mientras te desplazas.", "Lleva contigo cualquier cosa que haya podido ingerir."],
            questionsForVet: ["¿Desde cuándo empezaron los síntomas?", "¿Ha pasado algo parecido antes?"],
          },
          redFlags,
        ),
        redFlags,
        model: null,
        degraded: true,
      });
    }
    return NextResponse.json(
      { error: "No pudimos analizar la información en este momento. Intenta de nuevo en unos segundos." },
      { status: 502 },
    );
  }
}
