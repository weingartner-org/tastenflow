/**
 * Korpus nur für Lernweg "fr" - Sprossen 25-34, die restlichen Buchstaben
 * `à ^ è x z y ç ù w ¨` (E9, Bauplan
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6).
 *
 * Sammelstelle je Altersstufe, wie `corpusFrWegFrueh.ts` für Sprosse 9-24:
 * E9-kids (Kinder), E9-teens (Jugendliche) und E9-erwachsen (Erwachsene)
 * sind gefüllt - neue Zeilen nur HINTEN anhängen.
 *
 * Jede Zeile trägt `nurWeg: "fr"`. Append-only: wird in `corpus.ts` an
 * `CORPUS_FR` gehängt (nach `CORPUS_FR_WEG_FRUEH`).
 */
import type { CorpusItem } from "./corpus";

import { CORPUS_FR_MITTE_KIDS } from "./corpusFrMitteKids";
import { CORPUS_FR_MITTE_TEENS } from "./corpusFrMitteTeens";
import { CORPUS_FR_MITTE_ERWACHSEN } from "./corpusFrMitteErwachsen";

// Nur hinten anhängen (Reihenfolge = Korpus-Anker).
export const CORPUS_FR_MITTE: CorpusItem[] = [
  ...CORPUS_FR_MITTE_KIDS,
  ...CORPUS_FR_MITTE_TEENS,
  ...CORPUS_FR_MITTE_ERWACHSEN,
];
