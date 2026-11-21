/**
 * Der Entwurfs-Typ der POLNISCHEN Serien (wie `SerieEntwurfIt` in `serienItTyp.ts`): strukturell eine `Serie`, plus die
 * Zusatzfelder `land`/`ort`/`eigennamen` (Figuren- und Ortsnamen zählen nicht zur 8-Zeilen-Grenze).
 * `minTier` ist je Serie GEGEN Weg „pl" ausgerechnet (`computeSerieMinTier`); fehlt es, hängt `serienPl.ts` die Serie nicht
 * ein (und wirft, wenn sie nicht in `ERWARTET_ZURUECKGEHALTEN` steht).
 */
import type { Tier } from "./tiers";

/** Die 16 Woiwodschaften (amtliche Adjektivform, klein) - `land` einer polnischen Serie ist immer eine davon. */
export const WOIWODSCHAFTEN_PL = [
  "dolnośląskie",
  "kujawsko-pomorskie",
  "lubelskie",
  "lubuskie",
  "łódzkie",
  "małopolskie",
  "mazowieckie",
  "opolskie",
  "podkarpackie",
  "podlaskie",
  "pomorskie",
  "śląskie",
  "świętokrzyskie",
  "warmińsko-mazurskie",
  "wielkopolskie",
  "zachodniopomorskie",
] as const;
export type WoiwodschaftPl = (typeof WOIWODSCHAFTEN_PL)[number];

export interface SerieEntwurfPl {
  slug: string;
  titel: string;
  kind: "geschichte";
  stufen: ("kids" | "teens" | "erwachsen")[];
  lang: "pl";
  nurWeg: "pl";
  minTier?: Tier;
  /** Woiwodschaft, in der die Serie spielt. */
  land: WoiwodschaftPl;
  /** Ort oder Gegend darin (z. B. "Zakopane", "Kaszuby, Kartuzy"). */
  ort: string;
  topic: string;
  /** Figuren- und Ortsnamen - sie zählen nicht zur 8-Zeilen-Grenze. */
  eigennamen: string[];
  herkunft: { quelle: string; lizenz: string };
  etappen: { lines: string[] }[];
}
