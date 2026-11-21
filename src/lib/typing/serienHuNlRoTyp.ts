/**
 * Der Entwurfs-Typ der Serien der Wege „hu", „nl", „ro" (W3, 30.10.2026; Vorbild `serienCsTyp.ts`): strukturell eine `Serie`, plus `land`/`ort`/`eigennamen`.
 * `minTier` ist je Serie gegen den Weg ausgerechnet (`scripts/pruefe-serien-neu.mts <xx> --mintier`).
 * ⚠️ DATENBLATT: nur Typen und Listen.
 */
import type { Tier } from "./tiers";

/** Die Gegenden je Weg - `land` einer Serie ist immer eine davon. */
export const GEGENDEN = {
  hu: [
    "Közép-Magyarország", "Közép-Dunántúl", "Nyugat-Dunántúl", "Dél-Dunántúl", "Észak-Magyarország", "Észak-Alföld", "Dél-Alföld",
    "Erdély", "Felvidék", "Vajdaság", "Kárpátalja",
  ],
  nl: [
    "Noord-Nederland", "Oost-Nederland", "West-Nederland", "Zuid-Nederland", "Vlaanderen", "Brussel", "Caribisch gebied", "Suriname",
  ],
  ro: [
    "Moldova", "Dobrogea", "Muntenia", "Oltenia", "Banat", "Crișana", "Maramureș", "Transilvania", "București", "Republica Moldova",
  ],
} as const;

export interface SerieEntwurfNeu<W extends keyof typeof GEGENDEN> {
  slug: string;
  titel: string;
  kind: "geschichte";
  stufen: ("kids" | "teens" | "erwachsen")[];
  lang: W;
  nurWeg: W;
  minTier?: Tier;
  /** Gegend, in der die Serie spielt. */
  land: (typeof GEGENDEN)[W][number];
  /** Ort oder Gegend darin. */
  ort: string;
  topic: string;
  /** Figuren- und Ortsnamen, wie sie in den Zeilen stehen (auch gebeugt). */
  eigennamen: string[];
  herkunft: { quelle: string; lizenz: string };
  etappen: { lines: string[] }[];
}
