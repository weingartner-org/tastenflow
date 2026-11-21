/**
 * Serien nur für Lernweg "fr" - Sprossen 25-34 (E9, Bauplan
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6).
 *
 * Sammelstelle je Altersstufe, wie `serienFrWegFrueh.ts` für Sprosse 17-24:
 * E9-kids (Kinder), E9-teens (Jugendliche) und E9-erwachsen (Erwachsene)
 * sind gefüllt - neue Serien nur hinten anhängen.
 *
 * Append-only: wird in `serien.ts` an `SERIEN` gehängt.
 */
import type { Serie } from "./serie";

import { SERIEN_FR_MITTE_KIDS } from "./serienFrMitteKids";
import { SERIEN_FR_MITTE_TEENS } from "./serienFrMitteTeens";
import { SERIEN_FR_MITTE_ERWACHSEN } from "./serienFrMitteErwachsen";

export const SERIEN_FR_MITTE: Serie[] = [
  ...SERIEN_FR_MITTE_KIDS,
  ...SERIEN_FR_MITTE_TEENS,
  ...SERIEN_FR_MITTE_ERWACHSEN,
];
