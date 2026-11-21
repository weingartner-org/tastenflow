/**
 * ★ O4 (30.10.2026): Die Texte der Lehrkraft-Tabelle und der Zeitraum-Anzeige für bg el hu nl pt br ro sv uk -
 * bis dahin bekamen diese neun hier Englisch (`geruestAufEn`, RÜCKFALL-EN). Eine Datei je Sprache
 * (`ketten<Xx>.ts`), hier nur die Form und die Zuordnung; die Rechnungen bleiben in `veraenderung.ts`,
 * `zeitraum.ts`, `goals.ts`, `score.ts`, `excelMarke.ts`, `eigeneUebungReihe.ts` und `wochenzielZeitraum.ts`.
 */
import type { GeruestSprache } from "./sprachRegister";
import { KETTEN_BG } from "./kettenBg";
import { KETTEN_BR } from "./kettenBr";
import { KETTEN_EL } from "./kettenEl";
import { KETTEN_HU } from "./kettenHu";
import { KETTEN_NL } from "./kettenNl";
import { KETTEN_PT } from "./kettenPt";
import { KETTEN_RO } from "./kettenRo";
import { KETTEN_SV } from "./kettenSv";
import { KETTEN_UK } from "./kettenUk";

export type KettenGroesse = "treffer" | "score" | "tempo";

export interface KettenTexte {
  // ── veraenderung.ts ──────────────────────────────────────────────
  /** Das Hauptwort am Satzanfang („Accuracy", „The score", „Speed"). */
  was: Readonly<Record<KettenGroesse, string>>;
  /** Die Einheit zu einer Zahl (ohne die Zahl): „percentage points" / „point" / „keystrokes per minute". */
  einheit: (g: KettenGroesse, n: number) => string;
  /** `zahl` ist Zahl + Einheit; `name` ist {@link vergleich} (oder ein anderer Vergleichsname). */
  satzGleich: (was: string, zahl: string, name: string) => string;
  satzHoch: (was: string, zahl: string, name: string) => string;
  satzNiedrig: (was: string, zahl: string, name: string) => string;
  /** „All time" hat keinen Zeitraum davor. */
  ohneVergleichGesamt: string;
  ohneVergleich: (name: string) => string;
  grundKeineWoche: (mindestzeilen: number) => string;
  grundEineWoche: (mindestzeilen: number) => string;
  grundKurzKeine: string;
  grundKurzEine: string;
  /** Spaltenkopf: `score` hängt hinter die Score-Erklärung. */
  spalteScore: (mindZeichen: number) => string;
  spalteTreffer: string;
  spalteTempo: string;
  hilfeLangScore: string;
  hilfeLangTreffer: string;
  hilfeLangTempo: string;
  hilfeKurzScore: string;
  hilfeKurzTreffer: string;
  hilfeKurzTempo: string;
  // ── zeitraum.ts ──────────────────────────────────────────────────
  /** Die Sprachform des Datums: „14 Sept" aus Tag und kurzem Monatsnamen. */
  zeitraum: {
    gesamt: string;
    schuljahr: (label: string) => string;
    monat: { dieser: string; voriger: string; naechster: string; sonst: string };
    woche: { diese: string; vorige: string; naechste: string; sonst: string };
    /** „This month, 14 Sept to 11 Oct" */
    mitSpanne: (wort: string, von: string, bis: string) => string;
    /** Ein Tag kurz („14 Sept") aus Tag und kurzem Monat. */
    tag: (tag: number, monatKurz: string) => string;
    /** „14-20 Sept" */
    kompaktGleich: (von: number, bis: number, monatKurz: string) => string;
    /** „31 Aug-6 Sept" */
    kompaktUeber: (von: number, monatVon: string, bis: number, monatBis: string) => string;
  };
  /** Die Vergleichsnamen - so, dass sie in die Sätze oben passen. */
  vergleich: { schuljahr: string; monat: string; woche: string };
  // ── goals.ts ─────────────────────────────────────────────────────
  /** „Week 38 (14 Sept)" - `tag` ist {@link zeitraum}.tag. Kein „w/c". */
  wocheLabel: (nr: number, tag: string) => string;
  // ── score.ts ─────────────────────────────────────────────────────
  scoreKind: string;
  scoreLehrkraft: string;
  // ── excelMarke.ts ────────────────────────────────────────────────
  /** Das Wort „Klasse" klein, für den Vergleich, ob der Name es schon trägt. */
  klasseWort: string;
  /** „Class 3b"; `name` leer ⇒ nur das Wort, gross. */
  klasseBezeichnung: (name: string) => string;
  // ── eigeneUebungReihe.ts ─────────────────────────────────────────
  eigeneNichtZugewiesen: string;
  eigeneEine: (dateiname: string) => string;
  eigeneMehrere: (anzahl: number) => string;
  // ── wochenzielZeitraum.ts ────────────────────────────────────────
  wochenziel: {
    spalteErscheint: string;
    haekchen: string;
    nichtGezaehlt: string;
    /** Der ganze Satz über alle abgeschlossenen Ziel-Wochen; `wo` ist einer der drei Bereiche unten. */
    imZeitraum: (wo: string) => string;
    woGesamt: string;
    woSchuljahr: string;
    woMonat: string;
    laufend: string;
    andere: string;
  };
}

export const KETTEN_NEUN: Readonly<Record<GeruestSprache, KettenTexte>> = {
  bg: KETTEN_BG,
  el: KETTEN_EL,
  hu: KETTEN_HU,
  nl: KETTEN_NL,
  pt: KETTEN_PT,
  br: KETTEN_BR,
  ro: KETTEN_RO,
  sv: KETTEN_SV,
  uk: KETTEN_UK,
};
