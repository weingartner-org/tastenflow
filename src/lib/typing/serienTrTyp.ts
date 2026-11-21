/**
 * Der Entwurfs-Typ der TÜRKISCHEN Serien (wie `SerieEntwurfIt` in `serienItTyp.ts`): strukturell eine `Serie`, plus die
 * Zusatzfelder `land`/`ort`/`eigennamen` (Figuren- und Ortsnamen zählen nicht zur 8-Zeilen-Grenze).
 * `minTier` ist je Serie GEGEN Weg „tr" ausgerechnet (`computeSerieMinTier`); fehlt es, hängt `serienTr.ts` die Serie nicht
 * ein (und wirft, wenn sie nicht in `ERWARTET_ZURUECKGEHALTEN` steht).
 */
import type { Tier } from "./tiers";

/**
 * Die sieben amtlichen Regionen der Türkei (coğrafi bölgeler) und „Yurt dışı" (türkischsprachige Familien im Ausland,
 * z. B. in Deutschland, Österreich, der Schweiz) - `land` einer türkischen Serie ist immer eine davon.
 */
export const BOELGELER_TR = [
  "Marmara",
  "Ege",
  "Akdeniz",
  "İç Anadolu",
  "Karadeniz",
  "Doğu Anadolu",
  "Güneydoğu Anadolu",
  "Yurt dışı",
] as const;
export type BoelgeTr = (typeof BOELGELER_TR)[number];

export interface SerieEntwurfTr {
  slug: string;
  titel: string;
  kind: "geschichte";
  stufen: ("kids" | "teens" | "erwachsen")[];
  lang: "tr";
  nurWeg: "tr";
  minTier?: Tier;
  /** Region, in der die Serie spielt. */
  land: BoelgeTr;
  /** Ort oder Gegend darin (z. B. "Rize, Ayder Yaylası", "Gaziantep"). */
  ort: string;
  topic: string;
  /** Figuren- und Ortsnamen - sie zählen nicht zur 8-Zeilen-Grenze und dürfen mitten im Satz gross stehen. */
  eigennamen: string[];
  herkunft: { quelle: string; lizenz: string };
  etappen: { lines: string[] }[];
}
