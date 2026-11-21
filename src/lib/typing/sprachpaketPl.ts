/**
 * ★★★ DAS SPRACHPAKET „pl" (Polnisch) - alle Tastenflow-Texte dieser Sprache, die erst geladen werden, wenn ein Kind
 * sie braucht (G2a 02.10.2026 leer, F5-F8 03.10.2026: Lexikon-Nachtrag gefüllt).
 *
 * Geladen wird es ausschliesslich über `sprachpakete.ts` (per `import()`); es ist ein DATENBLATT und importiert nur
 * Datendateien und Typen - sonst bekäme es bei jeder Code-Änderung einen neuen Namen (`scripts/buendel-aufteilung.ts`).
 * Welche Pakete ein Weg braucht: `sprachPaketeFuer` in `sprachpaketBedarf.ts`.
 *
 * Inhalt heute:
 *  · `korpus`: LEER (Text-Chargen T1 ff. folgen, siehe `corpusPl.ts`) - der Weg übt bis dahin mit dem Wort-Drill des
 *    Generators (`wordsPl.ts`, im festen Paket `tf-fest-pl`), nie mit deutschen oder englischen Sätzen.
 *  · `serien`: `SERIEN_PL` (PL-S, 09.10.2026: Sammelstelle `serienPl.ts`; Kinder, Jugend, Erwachsene je eine erste Charge).
 *  · `lexikon`: das Wortfach der Sprachausgabe (`lexikonNachtragPl.ts`), damit echte polnische Wörter beim Vorlesen GANZ
 *    gesprochen werden statt buchstabiert (Falle 58: Lexikon VOR den Texten). ⚠️ Ohne Wörterbuch-Beleg (das macOS-Wörterbuch
 *    nimmt für Polnisch jedes Wort an): eine Menge aus Tatoeba-Wortformen, siehe den Kopf dieser Datei.
 *
 * ⚠️ Die Reihenfolge von `korpus` ist die Reihenfolge des Zusammenführens in `corpus.ts` (`mergeCorpus`, der erste Eintrag
 *    gewinnt) - Neues HINTEN anhängen und den Korpus-Anker neu erzeugen (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 * ⚠️ Eine Serien-Liste gehört ZUSÄTZLICH in `SERIEN_FOLGE` (serien.ts) - der Wächter `tests/sprachpakete-inhalt.test.ts`
 *    meldet, wenn sie fehlt.
 */
import type { SprachDaten } from "./sprachpakete";
import { CORPUS_PL } from "./corpusPl";
import { NACHTRAG_PL } from "./lexikonNachtragPl";
import { SERIEN_PL } from "./serienPl";

export const SPRACHPAKET_PL: SprachDaten = {
  korpus: CORPUS_PL,
  serien: {
    SERIEN_PL,
  },
  lexikon: [NACHTRAG_PL],
};
