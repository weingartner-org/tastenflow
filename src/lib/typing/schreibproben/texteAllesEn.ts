/**
 * Prüfungstexte der Tippchallenge, Niveau „All keys (symbols too)", LERNWEG
 * „en" - E7b (24.09.2026): gefüllt, 15 Texte in zwei Teildateien, damit zwei
 * Läufe sie parallel schreiben konnten, ohne einander zu überschreiben.
 * Diese Datei fügt nur zusammen; der Wächter (`npm run
 * pruefstand:schreibproben alles`) prüft das Ergebnis gegen beide Wege.
 *
 * ── Die Schreibregeln für E7b ────────────────────────────────────────────────
 *
 *  1. 15 Texte, mindestens 6000 Zeichen je Text, Zeilenlänge 30 bis 40
 *     Zeichen (`NIVEAU_DEFS`, Schlüssel „alles").
 *  2. Zeichenvorrat: der GANZE Weg „en" (`zeichenVorrat("alles", "en")") -
 *     Buchstaben, Satzzeichen, Ziffern UND die Sonderzeichen
 *     `EN_SYMBOL_ORDER` (`lernweg.ts`): `( ) + * / \ = % & @ # $ £ < > [ ] { }
 *     | ^ ~` - ★★★ NUR SOLCHE, DIE US UND UK MIT DEMSELBEM GRIFF HABEN
 *     (Bauplan §5.1 letzte Spalte). Das ist eine ECHTE Untermenge: `"` und
 *     `#` zum Beispiel liegen auf US und UK an verschiedenen Tasten
 *     (Bauplan §5.1: „Programmcode … prüfen, ob „/`#` vorkommen (Griff je
 *     Tastatur verschieden!)") - wer sie trotzdem braucht, markiert die
 *     Stelle wie `{colour|color}` in Bauplan §8.2 vorgemacht, mit einer
 *     GB- und einer US-Griff-Fassung, oder lässt sie ganz weg.
 *  3. Varianten-neutral (D4) - siehe `texteBuchstabenEn.ts`.
 *  4. **Keine `£ $ # "`** und keine Datumsangaben (siehe `texteZahlenEn.ts`
 *     für die Begründung bei Ziffern) - `£`/`$`/`#`/`"` sind zwar Teil des
 *     technischen Zeichenvorrats dieses Niveaus (Regel 2), aber ihr Tasten-
 *     GRIFF unterscheidet sich zwischen US- und UK-Tastatur oder die Taste
 *     fehlt ganz (`£` nur auf UK) - ohne eine Entscheidung dazu (Bauplan §9,
 *     E9/E10) bleiben sie hier aussen vor.
 *  5. Nur der einfache Bindestrich `-`, keine typografischen
 *     Anführungszeichen.
 *  6. Vergleichbarkeit: jede Kennzahl innerhalb `STREUUNG = 0,18` des Medians
 *     der eigenen 15 Texte.
 *  7. Keine Zeile darf im Lehrgang stehen (beide Wege, alle
 *     `corpus*.ts`/`serien*.ts`).
 *  8. Britische Grundform (Bauplan §8.2).
 *
 * ⚠️ `EN_NIVEAUS_GEFUELLT` in `schreibprobe.ts` nennt „alles" auf Weg „en"
 * noch nicht - das steht ausserhalb dieses Auftrags (nur die drei
 * `texteAllesEn*.ts`-Dateien) und wartet auf eine eigene Freigabe.
 */
import type { Probentext } from "./index";
import { TEXTE_A } from "./texteAllesEnA";
import { TEXTE_B } from "./texteAllesEnB";

export const TEXTE: Probentext[] = [...TEXTE_A, ...TEXTE_B];
