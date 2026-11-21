/**
 * ★★★★★ WÄCHTER (G1-GOLDEN, 25.10.2026): Der Lernweg „it" (Italienisch) bleibt Byte für Byte, wie er heute ist - VOR dem
 * Umbau für die neun neuen Lernwege aufgenommen (Stand 933887a28). Gegenstück zu
 * `tests/tastenflow-lernweg-es-unveraendert.test.ts`: Reihenfolge (`introOrder`, `startpunktFolge`), Aufstieg Schritt
 * für Schritt (Paare kommen nie halb), Stufen, Startpunkte, Niveaus, Lektionen, Abzeichenziele - auf JEDER Tastatur
 * des Weges. Bau und Aufrufe: `tests/_golden-weg-helfer.ts`, Einstellung: `tests/_golden-wege.ts`.
 *
 * Wird dieser Test rot, ist das ein HALT-SIGNAL - den Code reparieren, NIE die Fixture neu schreiben. Neu aufnehmen
 * nur nach einer mit Johannes/dem Chat besprochenen Änderung an Weg „it":
 * `LERNWEG_IT_GOLDEN_AUFNEHMEN=1 npx vitest run --maxWorkers=2 --minWorkers=1 tests/tastenflow-lernweg-it-unveraendert.test.ts`
 */
import { resolve } from "node:path";
import { lernwegGolden } from "./_golden-weg-helfer";
import { WEG_IT } from "./_golden-wege";

lernwegGolden(WEG_IT, resolve(__dirname, "fixtures/tastenflow-lernweg-it-golden.json"), "LERNWEG_IT_GOLDEN_AUFNEHMEN");
