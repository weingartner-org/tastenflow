/**
 * Korpus nur für Lernweg "fr" - frühe Sprossen (E8, Bauplan
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6, Nachtlauf
 * `NACHTLAUF-2026-09-25-FRANZÖSISCH.md` §2 Punkt 2).
 *
 * Sammelstelle je Altersstufe, wie beim englischen Weg (`corpusEnWegFrueh.ts`):
 * E8a (Kids, Sprossen 9-24), E8b-2 (Teens, Sprossen 9-24) und E8c
 * (Erwachsene, Sprossen 9-24) sind gefüllt.
 *
 * Jede Zeile trägt `nurWeg: "fr"` (siehe Kopf von `corpusFrWegFruehKids.ts`).
 * Append-only: wird in `corpus.ts` an `CORPUS_FR` gehängt.
 */
import type { CorpusItem } from "./corpus";

import { CORPUS_FR_WEG_FRUEH_KIDS } from "./corpusFrWegFruehKids";
import { CORPUS_FR_WEG_FRUEH_TEENS } from "./corpusFrWegFruehTeens";
import { CORPUS_FR_WEG_FRUEH_ERWACHSEN } from "./corpusFrWegFruehErwachsen";

// E8b-2 (26.09.2026): Teens angehängt. E8c (26.09.2026): Erwachsene angehängt.
// Nur hinten anhängen (Reihenfolge = Korpus-Anker).
export const CORPUS_FR_WEG_FRUEH: CorpusItem[] = [
  ...CORPUS_FR_WEG_FRUEH_KIDS,
  ...CORPUS_FR_WEG_FRUEH_TEENS,
  ...CORPUS_FR_WEG_FRUEH_ERWACHSEN,
];
