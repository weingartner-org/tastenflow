/**
 * ★ G3c-VERTEILER (25.10.2026): DER KORPUS DES WEGES „hu" (Ungarisch) - die Sammelstelle der Text-Chargen.
 *
 * Vorbild `corpusCs.ts` (Rezept Teil K). Was eine Charge hier tut:
 *  1. Datei `corpusHuWeg<Frueh|Mitte|Ende><Kids|Teens|Erwachsene>.ts` anlegen (nur `import type { CorpusItem }`), JEDE Zeile mit
 *     `nurWeg: "hu"`, `stufen`, `minTier` (`minTierFor(text, "hu")` nach der endgültigen Reihenfolge), `kind: "satz"`.
 *     Quelle: iCloud `sprachen-2026-10-25/texte-charge-1/hu.jsonl` (`weg` ⇒ `nurWeg`, `alter` ⇒ `stufen`, `thema` ⇒ `topic`).
 *  2. Hier importieren und in {@link CORPUS_HU} HINTEN anhängen (nie ändern/löschen: `mergeCorpus`, der erste gewinnt).
 *  3. Anker im SELBEN Commit: `npx tsx scripts/erzeuge-korpus-anker.mts` - und `CORPUS_HU` dort in die Leer-Prüfung aufnehmen,
 *     sobald er Text trägt (Falle 48/51). Korpus-Chargen verschiedener Sprachen NIE parallel mergen (der Anker ist nur-anhängend).
 *  4. Wächter je Charge `tests/tastenflow-texte-hu-<stufe>-<teil>.test.ts` (Vorbild cs) und die allgemeinen (Rezept K Nr. 6).
 *
 * Verteiler: `sprachpaketHu.ts` (`korpus`) ⇒ `corpus.ts` (`CORPUS_HU`, `korpusFuer`; leer ⇒ englischer Korpus wie im Gerüst),
 * `scripts/erzeuge-korpus-anker.mts`. ⚠️ `lexicon.ts` liest ihn noch nicht (eigenes Fach: F8 der Sprache).
 *
 * ⚠️ DATENBLATT: nur `import type` (`scripts/buendel-aufteilung.ts`).
 */
import type { CorpusItem } from "./corpus";
import { CORPUS_HU_WEG_CHARGE1_KIDS } from "./corpusHuWegCharge1Kids";
import { CORPUS_HU_WEG_CHARGE1_TEENS } from "./corpusHuWegCharge1Teens";
import { CORPUS_HU_WEG_CHARGE1_ERWACHSENE } from "./corpusHuWegCharge1Erwachsene";

/**
 * Der Korpus des Weges „hu". Neue Chargen HINTEN anhängen (Anker nur anhängend).
 *
 * ★ K-HU (29.10.2026): Charge 1 aus `texte-charge-1` - Kinder, Jugendliche, Erwachsene (Befund
 * `BEFUND-2026-10-29-K-KORPUS-NEUN.md`, Wächter `tests/tastenflow-texte-hu-charge1.test.ts`). Damit gibt `korpusFuer("hu")`
 * den EIGENEN Korpus statt des englischen (`eigenOderEn`), und `CORPUS_HU` steht in der Leer-Prüfung des Anker-Skripts.
 */
export const CORPUS_HU: CorpusItem[] = [
  ...CORPUS_HU_WEG_CHARGE1_KIDS, // K-HU (29.10.2026): Charge 1, Kinder
  ...CORPUS_HU_WEG_CHARGE1_TEENS, // K-HU (29.10.2026): Charge 1, Jugendliche
  ...CORPUS_HU_WEG_CHARGE1_ERWACHSENE, // K-HU (29.10.2026): Charge 1, Erwachsene
];
