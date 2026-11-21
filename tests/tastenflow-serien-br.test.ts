/**
 * ★ W3 (30.10.2026): die Serien auf Weg „br" (Brasilien, você). Alle Prüfungen samt Gegenproben stehen in `helfer/w3SerienWaechter.ts`.
 */
import { SERIEN_BR } from "../src/lib/typing/serienBr";
import { SERIEN_BR_KIDS_1 } from "../src/lib/typing/serienBrKids1";
import { SERIEN_BR_TEENS_1 } from "../src/lib/typing/serienBrTeens1";
import { SERIEN_BR_ERWACHSEN_1 } from "../src/lib/typing/serienBrErwachsen1";
import { w3SerienWaechter } from "./helfer/ptBrSvSerienWaechter";

w3SerienWaechter("br", SERIEN_BR, { kids: SERIEN_BR_KIDS_1, teens: SERIEN_BR_TEENS_1, erwachsen: SERIEN_BR_ERWACHSEN_1 });
