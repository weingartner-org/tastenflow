/**
 * ★ G3c-VERTEILER (25.10.2026): DIE SERIEN DES WEGES „el" (Griechisch) - Sammelstelle.
 *
 * Vorbild `serienCs.ts` (Chargen `serienEl{Kids,Teens,Erwachsen}1.ts`, je 20 Serien; Typ/Regionen wie `serienCsTyp.ts`;
 * Entwürfe ohne `minTier` nur über eine Liste `ERWARTET_ZURUECKGEHALTEN`, die laut wirft). Jede Serie trägt `lang: "el"`.
 * Serien-Inhalt liegt NICHT in den iCloud-Daten (Rezept K).
 * Verteiler: `sprachpaketEl.ts` (`serien: { SERIEN_EL }`) UND `SERIEN_FOLGE` in `serien.ts` (`["el", "SERIEN_EL"]`) - beides steht
 * schon. Wächter: `tests/sprachpakete-inhalt.test.ts`, je Charge `tests/tastenflow-serien-el-*.test.ts` (ruft `validateSerie`).
 * ⚠️ `lexicon.ts` (Serien-Wörter ins Fach) kennt „el" noch nicht (`lang === …`-Kette, Befund G2-NEUN §3) - F8 der Sprache.
 *
 * ⚠️ DATENBLATT: nur `import type`.
 */
import type { Serie } from "./serie";

import { SERIEN_EL_KIDS_1 } from "./serienElKids1";
import { SERIEN_EL_TEENS_1 } from "./serienElTeens1";
import { SERIEN_EL_ERWACHSEN_1 } from "./serienElErwachsen1";

// Reihenfolge = Zusammenführen (nur anhängen): Kinder, Jugend, Erwachsene (W3, 30.10.2026).
export const SERIEN_EL: Serie[] = [...SERIEN_EL_KIDS_1, ...SERIEN_EL_TEENS_1, ...SERIEN_EL_ERWACHSEN_1];
