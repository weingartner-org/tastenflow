/**
 * ★ G3c-VERTEILER (25.10.2026): DIE SERIEN DES WEGES „uk" (Ukrainisch) - Sammelstelle.
 *
 * Vorbild `serienCs.ts` (Chargen `serienUk{Kids,Teens,Erwachsen}1.ts`, je 20 Serien; Typ/Regionen wie `serienCsTyp.ts`;
 * Entwürfe ohne `minTier` nur über eine Liste `ERWARTET_ZURUECKGEHALTEN`, die laut wirft). Jede Serie trägt `lang: "uk"`.
 * Serien-Inhalt liegt NICHT in den iCloud-Daten (Rezept K).
 * Verteiler: `sprachpaketUk.ts` (`serien: { SERIEN_UK }`) UND `SERIEN_FOLGE` in `serien.ts` (`["uk", "SERIEN_UK"]`) - beides steht
 * schon. Wächter: `tests/sprachpakete-inhalt.test.ts`, je Charge `tests/tastenflow-serien-uk-*.test.ts` (ruft `validateSerie`).
 * ⚠️ `lexicon.ts` (Serien-Wörter ins Fach) kennt „uk" noch nicht (`lang === …`-Kette, Befund G2-NEUN §3) - F8 der Sprache.
 *
 * ⚠️ DATENBLATT: nur `import type`.
 */
import type { Serie } from "./serie";

import { SERIEN_UK_KIDS_1 } from "./serienUkKids1";
import { SERIEN_UK_TEENS_1 } from "./serienUkTeens1";
import { SERIEN_UK_ERWACHSEN_1 } from "./serienUkErwachsen1";

// Reihenfolge = Zusammenführen (nur anhängen): Kinder, Jugend, Erwachsene (W3, 30.10.2026).
export const SERIEN_UK: Serie[] = [...SERIEN_UK_KIDS_1, ...SERIEN_UK_TEENS_1, ...SERIEN_UK_ERWACHSEN_1];
