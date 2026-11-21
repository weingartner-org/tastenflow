/**
 * Zusätzliche Serien nur für Lernweg "fr" (Bauplan
 * `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6.1: Ziel 150 Serien, je
 * Stufe 50). Quer über den ganzen Lernweg - frühe, mittlere und späte
 * Sprossen; der Zeichensatz jeder Serie bestimmt, ab wann sie erscheint.
 *
 * Sammelstelle je Altersstufe, wie `serienFrMitte.ts`: Kinder (26.09.2026)
 * sind gefüllt, Jugendliche und Erwachsene werden hinten angehängt.
 *
 * Append-only: wird in `serien.ts` an `SERIEN` gehängt (nach `SERIEN_FR_ENDE`).
 */
import type { Serie } from "./serie";

import { SERIEN_FR_ZUSATZ_KIDS } from "./serienFrZusatzKids";
import { SERIEN_FR_ZUSATZ_ERWACHSEN } from "./serienFrZusatzErwachsen";
import { SERIEN_FR_ZUSATZ_TEENS } from "./serienFrZusatzTeens";

// Reihenfolge = Reihenfolge des Zusammenführens (append-only): Erwachsene kamen vor den Jugendlichen.
export const SERIEN_FR_ZUSATZ: Serie[] = [
  ...SERIEN_FR_ZUSATZ_KIDS,
  ...SERIEN_FR_ZUSATZ_ERWACHSEN,
  ...SERIEN_FR_ZUSATZ_TEENS,
];
