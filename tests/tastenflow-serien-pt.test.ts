/**
 * ★ W3 (30.10.2026): die Serien auf Weg „pt" (Portugal, tu). Alle Prüfungen samt Gegenproben stehen in `helfer/w3SerienWaechter.ts`.
 */
import { SERIEN_PT } from "../src/lib/typing/serienPt";
import { SERIEN_PT_KIDS_1 } from "../src/lib/typing/serienPtKids1";
import { SERIEN_PT_TEENS_1 } from "../src/lib/typing/serienPtTeens1";
import { SERIEN_PT_ERWACHSEN_1 } from "../src/lib/typing/serienPtErwachsen1";
import { w3SerienWaechter } from "./helfer/ptBrSvSerienWaechter";

w3SerienWaechter("pt", SERIEN_PT, { kids: SERIEN_PT_KIDS_1, teens: SERIEN_PT_TEENS_1, erwachsen: SERIEN_PT_ERWACHSEN_1 });
