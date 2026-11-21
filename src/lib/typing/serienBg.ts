/**
 * ★ G3c-VERTEILER (25.10.2026): DIE SERIEN DES WEGES „bg" (Bulgarisch) - Sammelstelle.
 *
 * Vorbild `serienCs.ts` (Chargen `serienBg{Kids,Teens,Erwachsen}1.ts`, je 20 Serien; Typ/Regionen wie `serienCsTyp.ts`;
 * Entwürfe ohne `minTier` nur über eine Liste `ERWARTET_ZURUECKGEHALTEN`, die laut wirft). Jede Serie trägt `lang: "bg"`.
 * Serien-Inhalt liegt NICHT in den iCloud-Daten (Rezept K).
 * Verteiler: `sprachpaketBg.ts` (`serien: { SERIEN_BG }`) UND `SERIEN_FOLGE` in `serien.ts` (`["bg", "SERIEN_BG"]`) - beides steht
 * schon. Wächter: `tests/sprachpakete-inhalt.test.ts`, je Charge `tests/tastenflow-serien-bg-*.test.ts` (ruft `validateSerie`).
 * ⚠️ `lexicon.ts` (Serien-Wörter ins Fach) kennt „bg" noch nicht (`lang === …`-Kette, Befund G2-NEUN §3) - F8 der Sprache.
 *
 * ⚠️ DATENBLATT: nur `import type`.
 */
import type { Serie } from "./serie";

import { SERIEN_BG_KIDS_1 } from "./serienBgKids1";
import { SERIEN_BG_TEENS_1 } from "./serienBgTeens1";
import { SERIEN_BG_ERWACHSEN_1 } from "./serienBgErwachsen1";

// Reihenfolge = Zusammenführen (nur anhängen): Kinder, Jugend, Erwachsene (W3, 30.10.2026).
export const SERIEN_BG: Serie[] = [...SERIEN_BG_KIDS_1, ...SERIEN_BG_TEENS_1, ...SERIEN_BG_ERWACHSEN_1];
