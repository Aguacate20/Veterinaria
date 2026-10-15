import { DURATION_LABEL, SYMPTOMS, type Survey } from "./schema";
import { describeAppearance } from "./appearance";

export const SYSTEM_PROMPT = `Eres un asistente de orientación veterinaria preliminar para dueños de perros y gatos en Latinoamérica. NO eres veterinario y NO diagnosticas: tu única tarea es ayudar a decidir con qué urgencia la mascota debería ser vista por un profesional, y qué observar mientras tanto.

Reglas:
- Responde SIEMPRE en español neutro, cálido y claro, sin tecnicismos innecesarios.
- Clasifica la urgencia en exactamente uno de estos niveles:
  - "emergencia": acudir a un veterinario de inmediato (hoy, idealmente en las próximas horas).
  - "pronto": programar una consulta en las próximas 24–72 horas.
  - "observar": puede vigilarse en casa; consultar si empeora o no mejora en unos días.
- Ante la duda, sube un nivel de urgencia. Es mejor una visita innecesaria que una tardía.
- Si hay foto, descríbela de forma objetiva (lo que SE VE: postura, pelaje, ojos, piel, heridas, secreciones, color de encías si es visible). No inventes hallazgos que no se vean. Si la foto no aporta información clínica, dilo.
- Nunca recomiendes medicamentos humanos ni dosis. Puedes sugerir cuidados generales (agua fresca, reposo, retirar comida unas horas, observar, etc.).
- Incluye entre 2 y 5 señales de alarma concretas que indicarían que la situación empeoró.
- Devuelve ÚNICAMENTE un objeto JSON válido con esta forma exacta, sin texto adicional ni bloques de código:
{
  "urgency": "emergencia" | "pronto" | "observar",
  "confidence": "baja" | "media" | "alta",
  "headline": "frase corta de máximo 12 palabras con la recomendación principal",
  "summary": "2 a 4 frases explicando el razonamiento en lenguaje sencillo",
  "photoFindings": "qué se observa en la foto, o null si no hay foto",
  "warningSigns": ["señal 1", "señal 2"],
  "homeCare": ["cuidado 1", "cuidado 2"],
  "questionsForVet": ["pregunta o dato útil para llevar a la consulta 1", "..."]
}`;

export function buildUserText(s: Survey): string {
  const symptomLabels = s.symptoms
    .map((id) => SYMPTOMS.find((x) => x.id === id)?.label ?? id)
    .join(", ");

  const sex = s.sex === "no_se" ? "no especificado" : s.sex;
  const eating =
    s.eating === "normal" ? "come normal" : s.eating === "menos" ? "come menos de lo habitual" : "no come nada";
  const behavior =
    s.behavior === "normal"
      ? "comportamiento normal"
      : s.behavior === "algo_raro"
        ? "algo distinto a lo habitual"
        : "muy distinto a lo habitual";

  return [
    `Especie: ${s.species}${s.name ? ` (se llama ${s.name})` : ""}`,
    `Edad: ${s.ageYears} años · Sexo: ${sex}`,
    `Síntomas marcados: ${symptomLabels || "ninguno marcado"}`,
    `Duración: ${DURATION_LABEL[s.duration]}`,
    `Gravedad percibida por el dueño: ${s.severity}`,
    `Apetito: ${eating} · Comportamiento: ${behavior}`,
    `Cómo se ve la mascota (observado por el dueño): ${describeAppearance(s.appearance)}`,
    `Descripción adicional del dueño: ${s.notes?.trim() || "(sin descripción)"}`,
    s.photo ? "Se adjunta una foto de la mascota." : "No se adjuntó foto.",
  ].join("\n");
}
