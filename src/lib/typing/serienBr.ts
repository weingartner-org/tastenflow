/**
 * Sammelstelle der Serien auf Weg „br" (Brasilien, você), wie `serienCs.ts`: hängt die Chargen aneinander, append-only (W3, 30.10.2026). Je Stufe 12 Serien mit zwei
 * Etappen, `minTier` gegen den Weg gerechnet. Verteiler: `sprachpaketBr.ts` und `SERIEN_FOLGE` in `serien.ts` (beide stehen schon).
 * Wächter: `tests/tastenflow-serien-br.test.ts`, Regeln: `tests/helfer/w3SerienRegeln.ts`. Serien tragen keine Korpus-Anker-ID.
 *
 * ⚠️ DATENBLATT: nur Daten und Typen.
 */
import type { Serie } from "./serie";
import { SERIEN_BR_KIDS_1 } from "./serienBrKids1";
import { SERIEN_BR_TEENS_1 } from "./serienBrTeens1";
import { SERIEN_BR_ERWACHSEN_1 } from "./serienBrErwachsen1";

export const SERIEN_BR: Serie[] = [...SERIEN_BR_KIDS_1, ...SERIEN_BR_TEENS_1, ...SERIEN_BR_ERWACHSEN_1] as unknown as Serie[];
