/**
 * Sammelstelle der Serien auf Weg „sv" (Schwedisch, du), wie `serienCs.ts`: hängt die Chargen aneinander, append-only (W3, 30.10.2026). Je Stufe 12 Serien mit zwei
 * Etappen, `minTier` gegen den Weg gerechnet. Verteiler: `sprachpaketSv.ts` und `SERIEN_FOLGE` in `serien.ts` (beide stehen schon).
 * Wächter: `tests/tastenflow-serien-sv.test.ts`, Regeln: `tests/helfer/w3SerienRegeln.ts`. Serien tragen keine Korpus-Anker-ID.
 *
 * ⚠️ DATENBLATT: nur Daten und Typen.
 */
import type { Serie } from "./serie";
import { SERIEN_SV_KIDS_1 } from "./serienSvKids1";
import { SERIEN_SV_TEENS_1 } from "./serienSvTeens1";
import { SERIEN_SV_ERWACHSEN_1 } from "./serienSvErwachsen1";

export const SERIEN_SV: Serie[] = [...SERIEN_SV_KIDS_1, ...SERIEN_SV_TEENS_1, ...SERIEN_SV_ERWACHSEN_1] as unknown as Serie[];
