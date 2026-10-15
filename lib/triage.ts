import type { Survey, TriageResult } from "./schema";

/**
 * Reglas de seguridad independientes de la IA.
 * Si se cumple alguna, el resultado se fuerza a "emergencia" sin importar
 * lo que diga el modelo. Es una red de seguridad, no un diagnóstico.
 */
export function detectRedFlags(s: Survey): string[] {
  const has = (id: string) => s.symptoms.includes(id);
  const flags: string[] = [];

  if (has("respiracion")) flags.push("Dificultad para respirar");
  if (has("convulsiones")) flags.push("Convulsiones o temblores");
  if (has("toxico")) flags.push("Posible ingestión de algo tóxico");
  if (has("abdomen")) flags.push("Abdomen hinchado o duro (riesgo de torsión u obstrucción)");
  if (has("sangre") && s.severity !== "leve") flags.push("Presencia de sangre");
  if (has("orina") && s.species === "gato" && s.sex !== "hembra")
    flags.push("Gato macho con problemas para orinar (posible obstrucción urinaria)");
  if (has("no_bebe") && (has("vomito") || has("diarrea")) && s.duration !== "horas")
    flags.push("Vómito/diarrea sin beber agua por más de un día (riesgo de deshidratación)");
  if (s.eating === "nada" && s.behavior === "muy_distinto" && s.severity === "grave")
    flags.push("No come y está muy distinto, con gravedad alta");
  if (s.appearance?.encias === "palidas") flags.push("Encías pálidas o blancas (posible anemia, hemorragia interna o shock)");
  if (s.appearance?.encias === "azuladas") flags.push("Encías azuladas o moradas (falta de oxígeno)");
  if (s.appearance?.postura === "echado" && s.behavior === "muy_distinto")
    flags.push("Echado sin poder levantarse y muy distinto a lo habitual");
  if (s.ageYears < 0.5 && (has("vomito") || has("diarrea") || has("letargo")))
    flags.push("Cachorro/gatito menor de 6 meses con síntomas digestivos o decaimiento");

  return flags;
}

export function applyRedFlags(result: TriageResult, flags: string[]): TriageResult {
  if (flags.length === 0) return result;
  return {
    ...result,
    urgency: "emergencia",
    confidence: "alta",
    headline: "Acude al veterinario lo antes posible",
    warningSigns: Array.from(new Set([...flags, ...result.warningSigns])),
  };
}
