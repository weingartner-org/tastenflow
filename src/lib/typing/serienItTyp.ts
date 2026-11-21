/**
 * Der Entwurfs-Typ der ITALIENISCHEN Serien (wie `SerieEntwurf` in `serienEsKids1.ts`): strukturell eine `Serie`, plus die
 * Zusatzfelder `land`/`ort`/`eigennamen` (Figuren- und Ortsnamen zählen nicht zur 8-Zeilen-Grenze).
 * `minTier` ist je Serie GEGEN Weg „it" ausgerechnet (`computeSerieMinTier`); fehlt es, hängt `serienIt.ts` die Serie nicht
 * ein (und wirft, wenn sie nicht in `ERWARTET_ZURUECKGEHALTEN` steht).
 */
import type { Tier } from "./tiers";

export interface SerieEntwurfIt {
  slug: string;
  titel: string;
  kind: "geschichte";
  stufen: ("kids" | "teens" | "erwachsen")[];
  lang: "it";
  nurWeg: "it";
  minTier?: Tier;
  /** Region oder Land, in dem die Serie spielt (z. B. "Sizilien", "Tessin", "Südtirol"). */
  land: string;
  /** Ort oder Gegend darin. */
  ort: string;
  topic: string;
  /** Figuren- und Ortsnamen - sie zählen nicht zur 8-Zeilen-Grenze. */
  eigennamen: string[];
  herkunft: { quelle: string; lizenz: string };
  etappen: { lines: string[] }[];
}
