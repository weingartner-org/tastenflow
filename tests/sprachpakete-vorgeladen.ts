/**
 * ★★★ DAS REGISTER DER SPRACHPAKETE - IM TEST MIT ALLEN PAKETEN (28.09.2026).
 *
 * `vite.config.ts` (`test.alias`) lenkt im Testlauf jeden Import von
 * `./sprachpakete`, `../sprachpakete` und `@/lib/typing/sprachpakete` hierher.
 * Dieses Modul reicht das echte Register weiter und lädt vorher ALLE Pakete -
 * mit `await` auf oberster Ebene: Jedes Modul, das das Register braucht
 * (`corpus.ts`, `serien.ts`, `lexicon.ts` …), wird erst danach ausgewertet.
 * So verhalten sich die bestehenden Tests wie vor dem Nachladen, und Dateien,
 * die keine Tastenflow-Texte berühren, zahlen nichts (siehe tests/setup.ts).
 *
 * Wer den ECHTEN Weg prüfen will (was lädt Weg „es"? was geschieht vor dem
 * Laden?), setzt den Stand im Test zurück: `_sprachpaketeVergessen()` und
 * danach `_sprachpaketeWiederEinsetzen(...)` (tests/sprachpakete-laden.test.tsx).
 *
 * ⚠️ Der Pfad unten darf NICHT auf das Alias-Muster passen - sonst zeigte
 *    dieses Modul auf sich selbst.
 */
export * from "../src/lib/typing/sprachpakete";
import { ALLE_SPRACHPAKETE, ladeSprachpakete } from "../src/lib/typing/sprachpakete";

await ladeSprachpakete(ALLE_SPRACHPAKETE);
