/**
 * ★★★★★ WÄCHTER (G1-GOLDEN, 25.10.2026): Der GENERATOR liefert für Weg „it" (Italienisch) byte-gleich, was er vor dem Umbau
 * für die neun neuen Lernwege lieferte (Stand 933887a28). Gegenstück zu `tests/tastenflow-generator-es-unveraendert.test.ts`:
 * fester Zufall (mulberry32), `wordDrillZeilen`, `adaptiveRound` an den Sprossen früh / mittel / eigene Zeichen /
 * Satzzeichen / Klammern / spät (voller Tastenstand, Falle 4) und auf jeder weiteren Tastatur, Hauptsprache-Vorrang
 * (Übungssprache „en"), `generateRound` für JEDE Lektion des Weges. Bau und Aufrufe: `tests/_golden-weg-helfer.ts`.
 *
 * Wird dieser Test rot, ist das ein HALT-SIGNAL - den Code reparieren, NIE die Fixture neu schreiben. Neu aufnehmen
 * nur nach einer besprochenen Änderung an Weg „it", aus einem Stand VOR der Änderung:
 * `GENERATOR_IT_GOLDEN_AUFNEHMEN=1 npx vitest run --maxWorkers=2 --minWorkers=1 tests/tastenflow-generator-it-unveraendert.test.ts`
 */
import { resolve } from "node:path";
import { generatorGolden } from "./_golden-weg-helfer";
import { WEG_IT } from "./_golden-wege";

generatorGolden(WEG_IT, resolve(__dirname, "fixtures/tastenflow-generator-it-golden.json"), "GENERATOR_IT_GOLDEN_AUFNEHMEN");
