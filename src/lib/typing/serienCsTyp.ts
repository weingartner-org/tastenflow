/**
 * Der Entwurfs-Typ der TSCHECHISCHEN Serien (wie `SerieEntwurfIt` in `serienItTyp.ts` und `SerieEntwurfPl`): strukturell eine
 * `Serie`, plus die Zusatzfelder `land`/`zeme`/`ort`/`eigennamen` (Figuren- und Ortsnamen zählen nicht zur 8-Zeilen-Grenze).
 * `minTier` ist je Serie GEGEN Weg „cs" ausgerechnet (`computeSerieMinTier`); fehlt es, hängt `serienCs.ts` die Serie nicht
 * ein (und wirft, wenn sie nicht in `ERWARTET_ZURUECKGEHALTEN` steht).
 */
import type { Tier } from "./tiers";

/** Die 14 Kraje (Kurzform wie im Wächter CS-T8) - `land` einer tschechischen Serie ist immer einer davon. */
export const KRAJE_CS = [
  "Praha",
  "Středočeský",
  "Jihočeský",
  "Plzeňský",
  "Karlovarský",
  "Ústecký",
  "Liberecký",
  "Královéhradecký",
  "Pardubický",
  "Vysočina",
  "Jihomoravský",
  "Olomoucký",
  "Zlínský",
  "Moravskoslezský",
] as const;
export type KrajCs = (typeof KRAJE_CS)[number];

/** Die drei historischen Länder: Böhmen, Mähren, Schlesien (ein Kraj kann über eine Grenze reichen - darum eigens). */
export const ZEME_CS = ["Čechy", "Morava", "Slezsko"] as const;
export type ZemeCs = (typeof ZEME_CS)[number];

export interface SerieEntwurfCs {
  slug: string;
  titel: string;
  kind: "geschichte";
  stufen: ("kids" | "teens" | "erwachsen")[];
  lang: "cs";
  nurWeg: "cs";
  minTier?: Tier;
  /** Kraj, in dem die Serie spielt. */
  land: KrajCs;
  /** Das historische Land des Ortes (Böhmen, Mähren, Schlesien). */
  zeme: ZemeCs;
  /** Ort oder Gegend darin (z. B. "Třinec", "Valašsko, Rožnov pod Radhoštěm"). */
  ort: string;
  topic: string;
  /** Figuren- und Ortsnamen (wie sie in den Zeilen stehen, auch gebeugt) - sie zählen nicht zur 8-Zeilen-Grenze. */
  eigennamen: string[];
  herkunft: { quelle: string; lizenz: string };
  etappen: { lines: string[] }[];
}
