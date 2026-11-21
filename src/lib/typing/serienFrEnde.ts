/**
 * Serien nur für Lernweg "fr" - ab der Punkt-Sprosse bis zum Ende des
 * Lernwegs (E9-ende, Bauplan `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6).
 *
 * Sammelstelle je Altersstufe, wie `serienFrMitte.ts`: E9-ende-kids (Kinder),
 * E9-ende-teens (Jugendliche) und E9-ende-erwachsen (Erwachsene), in dieser
 * Reihenfolge.
 *
 * Append-only: wird in `serien.ts` an `SERIEN` gehängt (nach `SERIEN_FR_MITTE`).
 */
import type { Serie } from "./serie";

import { SERIEN_FR_ENDE_KIDS } from "./serienFrEndeKids";
import { SERIEN_FR_ENDE_TEENS } from "./serienFrEndeTeens";
import { SERIEN_FR_ENDE_ERWACHSEN } from "./serienFrEndeErwachsen";

export const SERIEN_FR_ENDE: Serie[] = [
  ...SERIEN_FR_ENDE_KIDS,
  ...SERIEN_FR_ENDE_TEENS,
  ...SERIEN_FR_ENDE_ERWACHSEN,
];
