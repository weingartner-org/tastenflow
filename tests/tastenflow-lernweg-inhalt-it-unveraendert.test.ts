/**
 * ★★★★★ WÄCHTER (G1-GOLDEN, 25.10.2026): Was Weg „it" (Italienisch) an INHALT serviert, bleibt unverändert - VOR dem Umbau
 * für die neun neuen Lernwege aufgenommen (Stand 933887a28). Gegenstück zu
 * `tests/tastenflow-lernweg-inhalt-es-unveraendert.test.ts` und (für das Paket „it") zu `tests/sprachpakete-golden.test.ts`:
 * Korpus über `corpusItemsFor` UND `corpusEntriesFor` (Falle 32) an Sprossen quer durch den Weg bis zum VOLLEN
 * Tastenstand (Falle 4) auf jeder Tastatur, Englisch auf dem Weg, ohne Umschalt (D-2), Arcs, Lektionen, Vorlagen,
 * Wortspiel-Vorräte, Serien (Teilmenge), der Inhalt des Sprachpakets (Korpus, Serien, Lexikon) und dass ohne das Paket
 * wirklich nichts käme (Falle 54). Bau und Aufrufe: `tests/_golden-weg-helfer.ts`, Einstellung: `tests/_golden-wege.ts`.
 *
 * Wird dieser Test rot, ist das ein HALT-SIGNAL - den Code reparieren, NIE die Fixture neu schreiben. Neu aufnehmen
 * nur nach einer besprochenen Änderung an Weg „it":
 * `LERNWEG_INHALT_IT_GOLDEN_AUFNEHMEN=1 npx vitest run --maxWorkers=2 --minWorkers=1 tests/tastenflow-lernweg-inhalt-it-unveraendert.test.ts`
 */
import { resolve } from "node:path";
import { inhaltGolden } from "./_golden-weg-helfer";
import { WEG_IT } from "./_golden-wege";

inhaltGolden(WEG_IT, resolve(__dirname, "fixtures/tastenflow-lernweg-inhalt-it-golden.json"), "LERNWEG_INHALT_IT_GOLDEN_AUFNEHMEN");
