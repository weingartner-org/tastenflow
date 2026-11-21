/**
 * ★★★ G3c-VERTEILER (25.10.2026): DIE WÖRTER DER NEUN GERÜST-WEGE AN EINER STELLE.
 *
 * Sammelt `words<Xx>.ts` (Übungswörter, Themenwortschatz) und `sperrliste<Xx>.ts` der neun Wege bg, el, hu, nl, pt, br, ro, sv, uk,
 * damit die Verteiler (`generator.ts`, `uebungsformen/hilfen.ts`, `uebungsformen/pyramide.ts`) je EINE Zeile importieren statt
 * neun - und ein Sprach-Agent nur seine eigene Datei füllt. Die Rückfall-Regel (leer ⇒ Englisch) steht in den Verteilern
 * (`geruestRueckfall.ts`), nicht hier: hier steht nur, was die Sprache selbst hat.
 *
 * Eine neue Gerüst-Sprache kommt mit `GeruestSprache` dazu - `tsc` verlangt dann ihre Zeile in jeder Tabelle unten.
 */
import type { InhaltsStufe } from "./account";
import type { GeruestSprache } from "./sprachRegister";
import { WORDS_BG, STUFE_VOCAB_BG } from "./wordsBg";
import { gesperrtBg, istKernGesperrtBg } from "./sperrlisteBg";
import { WORDS_EL, STUFE_VOCAB_EL } from "./wordsEl";
import { gesperrtEl, istKernGesperrtEl } from "./sperrlisteEl";
import { WORDS_HU, STUFE_VOCAB_HU } from "./wordsHu";
import { gesperrtHu, istKernGesperrtHu } from "./sperrlisteHu";
import { WORDS_NL, STUFE_VOCAB_NL } from "./wordsNl";
import { gesperrtNl, istKernGesperrtNl } from "./sperrlisteNl";
import { WORDS_PT, STUFE_VOCAB_PT } from "./wordsPt";
import { gesperrtPt, istKernGesperrtPt } from "./sperrlistePt";
import { WORDS_BR, STUFE_VOCAB_BR } from "./wordsBr";
import { gesperrtBr, istKernGesperrtBr } from "./sperrlisteBr";
import { WORDS_RO, STUFE_VOCAB_RO } from "./wordsRo";
import { gesperrtRo, istKernGesperrtRo } from "./sperrlisteRo";
import { WORDS_SV, STUFE_VOCAB_SV } from "./wordsSv";
import { gesperrtSv, istKernGesperrtSv } from "./sperrlisteSv";
import { WORDS_UK, STUFE_VOCAB_UK } from "./wordsUk";
import { gesperrtUk, istKernGesperrtUk } from "./sperrlisteUk";

/** Die eigenen Übungswörter je Gerüst-Weg (leer, bis die Sprache sie bringt). */
export const GERUEST_WORDS: Readonly<Record<GeruestSprache, string[]>> = {
  bg: WORDS_BG,
  el: WORDS_EL,
  hu: WORDS_HU,
  nl: WORDS_NL,
  pt: WORDS_PT,
  br: WORDS_BR,
  ro: WORDS_RO,
  sv: WORDS_SV,
  uk: WORDS_UK,
};

/** Der eigene Themenwortschatz je Gerüst-Weg und Inhaltsstufe (leer, bis die Sprache ihn bringt). */
export const GERUEST_STUFE_VOCAB: Readonly<Record<GeruestSprache, Record<InhaltsStufe, string[]>>> = {
  bg: STUFE_VOCAB_BG,
  el: STUFE_VOCAB_EL,
  hu: STUFE_VOCAB_HU,
  nl: STUFE_VOCAB_NL,
  pt: STUFE_VOCAB_PT,
  br: STUFE_VOCAB_BR,
  ro: STUFE_VOCAB_RO,
  sv: STUFE_VOCAB_SV,
  uk: STUFE_VOCAB_UK,
};

/** Sperrliste Kern + Wortbasis je Gerüst-Weg (heute für jedes Wort `false`). */
export const GERUEST_GESPERRT: Readonly<Record<GeruestSprache, (wort: string) => boolean>> = {
  bg: gesperrtBg,
  el: gesperrtEl,
  hu: gesperrtHu,
  nl: gesperrtNl,
  pt: gesperrtPt,
  br: gesperrtBr,
  ro: gesperrtRo,
  sv: gesperrtSv,
  uk: gesperrtUk,
};

/** Nur die KERN-Sperrliste je Gerüst-Weg (für Texte und das Vorlese-Lexikon). */
export const GERUEST_KERN_GESPERRT: Readonly<Record<GeruestSprache, (wort: string) => boolean>> = {
  bg: istKernGesperrtBg,
  el: istKernGesperrtEl,
  hu: istKernGesperrtHu,
  nl: istKernGesperrtNl,
  pt: istKernGesperrtPt,
  br: istKernGesperrtBr,
  ro: istKernGesperrtRo,
  sv: istKernGesperrtSv,
  uk: istKernGesperrtUk,
};
