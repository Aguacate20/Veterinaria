import { z } from "zod";

export const SYMPTOMS = [
  { id: "vomito", label: "Vómito" },
  { id: "diarrea", label: "Diarrea" },
  { id: "no_come", label: "No quiere comer" },
  { id: "no_bebe", label: "No bebe agua" },
  { id: "letargo", label: "Decaimiento / mucho sueño" },
  { id: "respiracion", label: "Dificultad para respirar" },
  { id: "tos", label: "Tos o estornudos" },
  { id: "cojera", label: "Cojera o dolor al moverse" },
  { id: "picazon", label: "Picazón o se rasca mucho" },
  { id: "piel", label: "Heridas, bultos o cambios en la piel" },
  { id: "ojos", label: "Ojos rojos, lagañas o nublados" },
  { id: "orina", label: "Problemas para orinar" },
  { id: "sangre", label: "Sangre (vómito, heces u orina)" },
  { id: "convulsiones", label: "Convulsiones o temblores" },
  { id: "toxico", label: "Comió algo tóxico o extraño" },
  { id: "abdomen", label: "Abdomen hinchado o duro" },
] as const;

export type SymptomId = (typeof SYMPTOMS)[number]["id"];

export const surveySchema = z.object({
  species: z.enum(["perro", "gato"]),
  name: z.string().trim().max(40).optional().or(z.literal("")),
  ageYears: z.coerce.number().min(0).max(30),
  sex: z.enum(["macho", "hembra", "no_se"]),
  symptoms: z.array(z.string()).max(SYMPTOMS.length),
  duration: z.enum(["horas", "1_2_dias", "3_7_dias", "mas_1_semana"]),
  severity: z.enum(["leve", "moderado", "grave"]),
  eating: z.enum(["normal", "menos", "nada"]),
  behavior: z.enum(["normal", "algo_raro", "muy_distinto"]),
  notes: z.string().trim().max(800).optional().or(z.literal("")),
  /** Observaciones visuales (orejas, postura, cola, ojos, encías) */
  appearance: z
    .object({
      orejas: z.enum(["arriba", "normal", "gachas"]).optional(),
      postura: z.enum(["normal", "encorvado", "echado"]).optional(),
      cola: z.enum(["arriba", "normal", "entre_patas"]).optional(),
      ojos: z.enum(["brillantes", "apagados", "secrecion"]).optional(),
      encias: z.enum(["rosadas", "palidas", "azuladas"]).optional(),
    })
    .optional(),
  /** data URL (image/jpeg|png|webp), ya comprimida en el cliente */
  photo: z.string().max(5_000_000).optional().nullable(),
});

export type Survey = z.infer<typeof surveySchema>;

export const resultSchema = z.object({
  urgency: z.enum(["emergencia", "pronto", "observar"]),
  confidence: z.enum(["baja", "media", "alta"]),
  headline: z.string(),
  summary: z.string(),
  photoFindings: z.string().nullable(),
  warningSigns: z.array(z.string()),
  homeCare: z.array(z.string()),
  questionsForVet: z.array(z.string()),
});

export type TriageResult = z.infer<typeof resultSchema>;

export const DURATION_LABEL: Record<Survey["duration"], string> = {
  horas: "Menos de 24 horas",
  "1_2_dias": "1 a 2 días",
  "3_7_dias": "3 a 7 días",
  mas_1_semana: "Más de una semana",
};
