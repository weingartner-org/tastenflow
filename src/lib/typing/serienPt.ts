/**
 * Sammelstelle der Serien auf Weg „pt" (Portugal, tu), wie `serienCs.ts`: hängt die Chargen aneinander, append-only (W3, 30.10.2026). Je Stufe 12 Serien mit zwei
 * Etappen, `minTier` gegen den Weg gerechnet. Verteiler: `sprachpaketPt.ts` und `SERIEN_FOLGE` in `serien.ts` (beide stehen schon).
 * Wächter: `tests/tastenflow-serien-pt.test.ts`, Regeln: `tests/helfer/w3SerienRegeln.ts`. Serien tragen keine Korpus-Anker-ID.
 *
 * ⚠️ DATENBLATT: nur Daten und Typen.
 */
import type { Serie } from "./serie";
import { SERIEN_PT_KIDS_1 } from "./serienPtKids1";
import { SERIEN_PT_TEENS_1 } from "./serienPtTeens1";
import { SERIEN_PT_ERWACHSEN_1 } from "./serienPtErwachsen1";

export const SERIEN_PT: Serie[] = [...SERIEN_PT_KIDS_1, ...SERIEN_PT_TEENS_1, ...SERIEN_PT_ERWACHSEN_1] as unknown as Serie[];
