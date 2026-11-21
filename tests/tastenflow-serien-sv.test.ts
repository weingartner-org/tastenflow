/**
 * ★ W3 (30.10.2026): die Serien auf Weg „sv" (Schwedisch, du). Alle Prüfungen samt Gegenproben stehen in `helfer/w3SerienWaechter.ts`.
 */
import { SERIEN_SV } from "../src/lib/typing/serienSv";
import { SERIEN_SV_KIDS_1 } from "../src/lib/typing/serienSvKids1";
import { SERIEN_SV_TEENS_1 } from "../src/lib/typing/serienSvTeens1";
import { SERIEN_SV_ERWACHSEN_1 } from "../src/lib/typing/serienSvErwachsen1";
import { w3SerienWaechter } from "./helfer/ptBrSvSerienWaechter";

w3SerienWaechter("sv", SERIEN_SV, { kids: SERIEN_SV_KIDS_1, teens: SERIEN_SV_TEENS_1, erwachsen: SERIEN_SV_ERWACHSEN_1 });
