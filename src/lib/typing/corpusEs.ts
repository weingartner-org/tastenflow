import type { CorpusItem } from "./corpus";
import { CORPUS_ES_WEG_FRUEH_KIDS } from "./corpusEsWegFruehKids";
import { CORPUS_ES_WEG_FRUEH_TEENS } from "./corpusEsWegFruehTeens";
import { CORPUS_ES_WEG_FRUEH_ERWACHSEN } from "./corpusEsWegFruehErwachsen";
import { CORPUS_ES_MITTE_KIDS } from "./corpusEsMitteKids";
import { CORPUS_ES_MITTE_TEENS } from "./corpusEsMitteTeens";
import { CORPUS_ES_MITTE_ERWACHSEN } from "./corpusEsMitteErwachsen";
import { CORPUS_ES_ENDE_ERWACHSEN } from "./corpusEsEndeErwachsen";
import { CORPUS_ES_ENDE_KIDS } from "./corpusEsEndeKids";
import { CORPUS_ES_ENDE_TEENS } from "./corpusEsEndeTeens";
import { CORPUS_ES_APOSTROF } from "./corpusEsApostrof";

/**
 * Spanischer Text-Korpus des 10-Finger-Trainers „Tastenflow" - das
 * Gegenstück zu `CORPUS_FR` (`corpus.ts`, gebaut aus `corpusFrWegFrueh.ts` /
 * `corpusFrMitte.ts` / `corpusFrEnde.ts`) für Weg „es".
 *
 * ★ ES-F5 (27.09.2026, Bauplan spanischer Lehrgang §2/§9 ES-F5): die
 * MECHANIK (Quelle in `corpusItemsFor`, `corpusEntriesFor`, Manifest,
 * Anker-Skript) - Texte kommen aus den Chargen ES-T1…T9 (Bauplan §9), in
 * eigenen Dateien wie beim Französischen, hier nur ANGEHÄNGT (Korpus-Anker:
 * streng anhängend, `scripts/erzeuge-korpus-anker.mts`).
 *
 * ★ ES-T1 (27.09.2026): die ersten Zeilen - Kinder, frühe Sprossen 7-18
 * (`corpusEsWegFruehKids.ts`). Jede Zeile trägt `nurWeg: "es"`; über
 * `corpusItemsFor`/`corpusEntriesFor` bekommt Weg „es" NUR diese Zeilen, nie
 * den deutschen/englischen/französischen Inhalt (Leitfaden Falle 19/32).
 *
 * ★ ES-T2 (27.09.2026): Jugendliche, frühe Sprossen 7-18
 * (`corpusEsWegFruehTeens.ts`), HINTEN angehängt (Anker nur anhängend).
 *
 * ★ ES-T3 (27.09.2026): Erwachsene, frühe Sprossen 7-18
 * (`corpusEsWegFruehErwachsen.ts`), HINTER der Jugend-Charge angehängt.
 *
 * ★ ES-T4 (27.09.2026): Kinder, mittlere Sprossen 19-30 (Mayús bis w,
 * `corpusEsMitteKids.ts`), HINTER der Erwachsenen-Charge angehängt.
 *
 * ★ ES-T5 (27.09.2026): Jugendliche, mittlere Sprossen 19-30
 * (`corpusEsMitteTeens.ts`), HINTER der Kinder-Mitte-Charge angehängt.
 *
 * ★ ES-T6 (27.09.2026): Erwachsene, mittlere Sprossen 19-30
 * (`corpusEsMitteErwachsen.ts`), HINTER der Jugend-Mitte-Charge angehängt.
 *
 * ★ ES-T9 (27.09.2026): Erwachsene, Ende des Lernwegs - Satzzeichen, Ziffern,
 * Sonderzeichen (`corpusEsEndeErwachsen.ts`), HINTER der Erwachsenen-Mitte-
 * Charge angehängt.
 *
 * ★ ES-T7-KIDS-ENDE (27.09.2026): Kinder, Ende des Lernwegs - Satzzeichen,
 * Ziffern, Sonderzeichen (`corpusEsEndeKids.ts`), parallel zu T9 geschrieben,
 * beim Zusammenführen HINTER T9 angehängt (T9 kam zuerst herein).
 *
 * ★ ES-T8 (27.09.2026): Jugendliche, Ende des Lernwegs - Sprossen 31-70,
 * Satzzeichen, Ziffern, Sonderzeichen (`corpusEsEndeTeens.ts`), parallel zu
 * T7/T9 geschrieben, beim Zusammenführen HINTER T7 angehängt.
 *
 * ★ ES-T10 (28.09.2026): die letzte Zeichen-Sprosse `'` (seit D1 Nr. 13) -
 * alle drei Altersstufen in einer kleinen Charge (`corpusEsApostrof.ts`),
 * GANZ HINTEN angehängt (Anker nur anhängend).
 *
 * ⚠️ `mergeCorpus` (corpus.ts) wird hier bewusst NICHT benutzt: sein
 * Dedup-Schlüssel kennt ñ/á/é/í/ó/ú nicht (`[^a-zäöüß0-9]` wird zu Leerzeichen)
 * und würde zwei Zeilen, die sich nur darin unterscheiden, still verschmelzen.
 * Der Wächter prüft stattdessen selbst, dass keine Zeile doppelt ist.
 */
export const CORPUS_ES: CorpusItem[] = [
  ...CORPUS_ES_WEG_FRUEH_KIDS,
  ...CORPUS_ES_WEG_FRUEH_TEENS,
  ...CORPUS_ES_WEG_FRUEH_ERWACHSEN,
  ...CORPUS_ES_MITTE_KIDS,
  ...CORPUS_ES_MITTE_TEENS,
  ...CORPUS_ES_MITTE_ERWACHSEN,
  ...CORPUS_ES_ENDE_ERWACHSEN,
  ...CORPUS_ES_ENDE_KIDS,
  ...CORPUS_ES_ENDE_TEENS,
  ...CORPUS_ES_APOSTROF,
];
