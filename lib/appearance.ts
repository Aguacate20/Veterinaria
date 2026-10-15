export const APPEARANCE_GROUPS = [
  {
    key: "orejas",
    label: "Orejas",
    options: [
      { id: "arriba", label: "Atentas / arriba" },
      { id: "normal", label: "Normales" },
      { id: "gachas", label: "Gachas / hacia atrás" },
    ],
  },
  {
    key: "postura",
    label: "Postura",
    options: [
      { id: "normal", label: "Normal" },
      { id: "encorvado", label: "Encorvado / lomo arqueado" },
      { id: "echado", label: "Echado, no se levanta" },
    ],
  },
  {
    key: "cola",
    label: "Cola",
    options: [
      { id: "arriba", label: "Arriba / la mueve" },
      { id: "normal", label: "Normal" },
      { id: "entre_patas", label: "Entre las patas" },
    ],
  },
  {
    key: "ojos",
    label: "Ojos",
    options: [
      { id: "brillantes", label: "Brillantes" },
      { id: "apagados", label: "Apagados / entrecerrados" },
      { id: "secrecion", label: "Con lagañas o secreción" },
    ],
  },
  {
    key: "encias",
    label: "Encías (levanta el labio con cuidado)",
    options: [
      { id: "rosadas", label: "Rosadas" },
      { id: "palidas", label: "Pálidas / blancas" },
      { id: "azuladas", label: "Azuladas o moradas" },
    ],
  },
] as const;

export type AppearanceKey = (typeof APPEARANCE_GROUPS)[number]["key"];
export type Appearance = Partial<Record<AppearanceKey, string>>;

export function describeAppearance(a: Appearance | undefined): string {
  if (!a) return "(no indicado)";
  const parts: string[] = [];
  for (const g of APPEARANCE_GROUPS) {
    const v = a[g.key];
    if (!v) continue;
    const opt = g.options.find((o) => o.id === v);
    if (opt) parts.push(`${g.label.split(" (")[0].toLowerCase()}: ${opt.label.toLowerCase()}`);
  }
  return parts.length ? parts.join("; ") : "(no indicado)";
}
