/**
 * ★ G3c-VERTEILER (25.10.2026): DER KORPUS DES WEGES „br" (Portugiesisch (Brasilien)) - die Sammelstelle der Text-Chargen.
 *
 * Vorbild `corpusCs.ts` (Rezept Teil K). Was eine Charge hier tut:
 *  1. Datei `corpusBrWeg<Frueh|Mitte|Ende><Kids|Teens|Erwachsene>.ts` anlegen (nur `import type { CorpusItem }`), JEDE Zeile mit
 *     `nurWeg: "br"`, `stufen`, `minTier` (`minTierFor(text, "br")` nach der endgültigen Reihenfolge), `kind: "satz"`.
 *     Quelle: iCloud `sprachen-2026-10-25/texte-charge-1/pt-BR.jsonl` (`weg` ⇒ `nurWeg`, `alter` ⇒ `stufen`, `thema` ⇒ `topic`).
 *  2. Hier importieren und in {@link CORPUS_BR} HINTEN anhängen (nie ändern/löschen: `mergeCorpus`, der erste gewinnt).
 *  3. Anker im SELBEN Commit: `npx tsx scripts/erzeuge-korpus-anker.mts` - und `CORPUS_BR` dort in die Leer-Prüfung aufnehmen,
 *     sobald er Text trägt (Falle 48/51). Korpus-Chargen verschiedener Sprachen NIE parallel mergen (der Anker ist nur-anhängend).
 *  4. Wächter je Charge `tests/tastenflow-texte-br-<stufe>-<teil>.test.ts` (Vorbild cs) und die allgemeinen (Rezept K Nr. 6).
 *
 * Verteiler: `sprachpaketBr.ts` (`korpus`) ⇒ `corpus.ts` (`CORPUS_BR`, `korpusFuer`; leer ⇒ englischer Korpus wie im Gerüst),
 * `scripts/erzeuge-korpus-anker.mts`. ⚠️ `lexicon.ts` liest ihn noch nicht (eigenes Fach: F8 der Sprache).
 *
 * ⚠️ DATENBLATT: nur `import type` (`scripts/buendel-aufteilung.ts`).
 */
import type { CorpusItem } from "./corpus";
import { CORPUS_BR_WEG_CHARGE1_KIDS } from "./corpusBrWegCharge1Kids";
import { CORPUS_BR_WEG_CHARGE1_TEENS } from "./corpusBrWegCharge1Teens";
import { CORPUS_BR_WEG_CHARGE1_ERWACHSENE } from "./corpusBrWegCharge1Erwachsene";

/**
 * Der Korpus des Weges „br". Neue Chargen HINTEN anhängen (Anker nur anhängend).
 *
 * ★ K-BR (29.10.2026): Charge 1 aus `texte-charge-1` - Kinder, Jugendliche, Erwachsene (Befund
 * `BEFUND-2026-10-29-K-KORPUS-NEUN.md`, Wächter `tests/tastenflow-texte-br-charge1.test.ts`). Damit gibt `korpusFuer("br")`
 * den EIGENEN Korpus statt des englischen (`eigenOderEn`), und `CORPUS_BR` steht in der Leer-Prüfung des Anker-Skripts.
 */
export const CORPUS_BR: CorpusItem[] = [
  ...CORPUS_BR_WEG_CHARGE1_KIDS, // K-BR (29.10.2026): Charge 1, Kinder
  ...CORPUS_BR_WEG_CHARGE1_TEENS, // K-BR (29.10.2026): Charge 1, Jugendliche
  ...CORPUS_BR_WEG_CHARGE1_ERWACHSENE, // K-BR (29.10.2026): Charge 1, Erwachsene
];
