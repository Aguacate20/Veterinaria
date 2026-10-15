import type { Guide } from "./types";
import { guide as perroVomita } from "./mi-perro-vomita";
import { guide as gatoVomita } from "./mi-gato-vomita";
import { guide as perroNoCome } from "./mi-perro-no-quiere-comer";
import { guide as gatoNoCome } from "./mi-gato-no-come";
import { guide as perroDiarrea } from "./mi-perro-tiene-diarrea";
import { guide as gatoNoOrina } from "./mi-gato-no-orina";
import { guide as perroDecaido } from "./mi-perro-esta-decaido";
import { guide as gatoEsconde } from "./mi-gato-se-esconde";
import { guide as encias } from "./como-revisar-encias-y-signos-vitales";
import { guide as emergencias } from "./senales-de-emergencia-veterinaria";

export type { Guide } from "./types";

export const GUIDES: Guide[] = [
  emergencias,
  encias,
  perroVomita,
  perroNoCome,
  perroDiarrea,
  perroDecaido,
  gatoVomita,
  gatoNoCome,
  gatoNoOrina,
  gatoEsconde,
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
