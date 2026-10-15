export type Species = "perro" | "gato" | "ambos";

export type Guide = {
  slug: string;
  title: string;
  /** Título corto para tarjetas y breadcrumbs */
  shortTitle: string;
  description: string;
  species: Species;
  /** ISO date */
  published: string;
  updated: string;
  keywords: string[];
  /** Contenido en markdown reducido: ##, ###, -, > (aviso), **negrita**, párrafos */
  body: string;
};
