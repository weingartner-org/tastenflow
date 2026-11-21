/**
 * Der Entwurfs-Typ der Serien auf den Wegen „pt", „br", „sv" (W3, 30.10.2026), wie `SerieEntwurfCs`: strukturell eine `Serie`, plus die Zusatzfelder
 * `land`/`ort`/`eigennamen`. `minTier` ist je Serie GEGEN den Weg ausgerechnet (`computeSerieMinTier`). Regeln: `tests/helfer/w3SerienWaechter.ts`.
 */
import type { Tier } from "./tiers";

export const REGIONEN_PTBRSV = {
  pt: ["Norte", "Centro", "Lisboa", "Alentejo", "Algarve", "Madeira", "Açores"],
  br: ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"],
  sv: ["Norrland", "Svealand", "Götaland", "Finland"],
} as const;

export interface SerieEntwurfPtBrSv<W extends "pt" | "br" | "sv"> {
  slug: string;
  titel: string;
  kind: "geschichte";
  stufen: ("kids" | "teens" | "erwachsen")[];
  lang: W;
  nurWeg: W;
  minTier: Tier;
  /** Region aus {@link REGIONEN_PTBRSV}. */
  land: (typeof REGIONEN_PTBRSV)[W][number];
  /** Ort oder Gegend darin. */
  ort: string;
  topic: string;
  /** Figuren- und Ortsnamen, wie sie in den Zeilen stehen. */
  eigennamen: string[];
  herkunft: { quelle: string; lizenz: string };
  etappen: { lines: string[] }[];
}
