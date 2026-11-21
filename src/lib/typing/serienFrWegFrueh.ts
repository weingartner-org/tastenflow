/**
 * Serien nur für Lernweg "fr" - frühe Sprossen (E8, Bauplan
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6, Nachtlauf
 * `NACHTLAUF-2026-09-25-FRANZÖSISCH.md` §2 Punkt 2).
 *
 * Sammelstelle je Altersstufe, wie beim englischen Weg
 * (`serienEnWegFrueh.ts`): E8a (Kids) und E8b-2 (Teens), je Sprossen
 * 17-24, und E8c (Erwachsene, Sprossen 19-24) sind gefüllt.
 *
 * Append-only: wird in `serien.ts` an `SERIEN` gehängt.
 */
import type { Serie } from "./serie";

import { SERIEN_FR_WEG_FRUEH_KIDS } from "./serienFrWegFruehKids";
import { SERIEN_FR_WEG_FRUEH_TEENS } from "./serienFrWegFruehTeens";
import { SERIEN_FR_WEG_FRUEH_ERWACHSEN } from "./serienFrWegFruehErwachsen";

// E8b-2 (26.09.2026): Teens angehängt. E8c (26.09.2026): Erwachsene angehängt.
export const SERIEN_FR_WEG_FRUEH: Serie[] = [
  ...SERIEN_FR_WEG_FRUEH_KIDS,
  ...SERIEN_FR_WEG_FRUEH_TEENS,
  ...SERIEN_FR_WEG_FRUEH_ERWACHSEN,
];
