import { NextResponse } from "next/server";
import { resultSchema, surveySchema, type TriageResult } from "@/lib/schema";
import { SYSTEM_PROMPT, buildUserText } from "@/lib/prompt";
import { applyRedFlags, detectRedFlags } from "@/lib/triage";
import { checkLimits, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Proveedor: NVIDIA NIM (API compatible con OpenAI).
 * Endpoint gratuito: https://build.nvidia.com  ·  40 RPM / 10.000 req por día por modelo.
 */
const API_URL = process.env.NVIDIA_API_URL || "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = process.env.NVIDIA_MODEL || "google/gemma-4-31b-it";

function isImageDataUrl(dataUrl: string): boolean {
  return /^data:image\/(?:jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(dataUrl);
}

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("La respuesta del modelo no contiene JSON");
  return JSON.parse(text.slice(start, end + 1));
}

type ChatContent =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

async function askModel(content: ChatContent[]): Promise<string> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1200,
      temperature: 0.2,
      stream: false,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content },
      ],
    }),
    signal: AbortSignal.timeout(50_000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`NVIDIA API ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Respuesta vacía del modelo");
  return text;
}

const FALLBACK_EMERGENCY: TriageResult = {
  urgency: "emergencia",
  confidence: "alta",
  headline: "Acude al veterinario lo antes posible",
  summary:
    "Los síntomas que marcaste incluyen señales que requieren atención veterinaria inmediata. No esperes a que mejore por sí solo.",
  photoFindings: null,
  warningSigns: [],
  homeCare: [
    "Mantén a tu mascota tranquila y abrigada mientras te desplazas.",
    "Lleva contigo cualquier cosa que haya podido ingerir.",
  ],
  questionsForVet: ["¿Desde cuándo empezaron los síntomas?", "¿Ha pasado algo parecido antes?"],
};

export async function POST(req: Request) {
  if (!process.env.NVIDIA_API_KEY) {
    return NextResponse.json({ error: "Falta configurar NVIDIA_API_KEY en el servidor." }, { status: 500 });
  }

  const limit = await checkLimits(clientIp(req));
  if (!limit.ok) {
    const msg =
      limit.reason === "global"
        ? "Hoy ya alcanzamos el máximo de consultas gratuitas. Vuelve a intentarlo mañana o, si es urgente, llama a tu veterinario."
        : "Has hecho varias consultas seguidas. Espera unos minutos antes de intentar de nuevo.";
    return NextResponse.json({ error: msg }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } });
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

  const content: ChatContent[] = [];
  if (survey.photo && isImageDataUrl(survey.photo)) {
    content.push({ type: "image_url", image_url: { url: survey.photo } });
  }
  content.push({ type: "text", text: buildUserText(survey) });

  try {
    const text = await askModel(content);
    const result = resultSchema.parse(extractJson(text));
    return NextResponse.json({ result: applyRedFlags(result, redFlags), redFlags, model: MODEL });
  } catch (err) {
    console.error("[analyze] error", err);
    // Si la IA falla pero hay banderas rojas, aun así devolvemos la alerta.
    if (redFlags.length > 0) {
      return NextResponse.json({
        result: applyRedFlags(FALLBACK_EMERGENCY, redFlags),
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
