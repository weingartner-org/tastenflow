/**
 * Korpus nur für Lernweg "fr" - ab der Punkt-Sprosse bis zum Ende des
 * Lernwegs: Satzzeichen `. , ; : ! ? " - ( )`, Ziffern, Sonderzeichen
 * (E9-ende, Bauplan `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6).
 *
 * Sammelstelle je Altersstufe, wie `corpusFrMitte.ts` für die Sprossen der
 * restlichen Buchstaben: E9-ende-kids (Kinder), E9-ende-teens (Jugendliche)
 * und E9-ende-erwachsen (Erwachsene), in dieser Reihenfolge.
 *
 * Jede Zeile trägt `nurWeg: "fr"`. Append-only: wird in `corpus.ts` an
 * `CORPUS_FR` gehängt (nach `CORPUS_FR_MITTE`).
 */
import type { CorpusItem } from "./corpus";

import { CORPUS_FR_ENDE_KIDS } from "./corpusFrEndeKids";
import { CORPUS_FR_ENDE_TEENS } from "./corpusFrEndeTeens";
import { CORPUS_FR_ENDE_ERWACHSEN } from "./corpusFrEndeErwachsen";

// Nur hinten anhängen (Reihenfolge = Korpus-Anker).
export const CORPUS_FR_ENDE: CorpusItem[] = [
  ...CORPUS_FR_ENDE_KIDS,
  ...CORPUS_FR_ENDE_TEENS,
  ...CORPUS_FR_ENDE_ERWACHSEN,
];
