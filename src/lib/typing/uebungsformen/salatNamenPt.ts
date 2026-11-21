/**
 * ★ G3c-VERTEILER (25.10.2026): WAS DER BUCHSTABENSALAT AUF WEG „pt" (Portugiesisch (Portugal)) NICHT ALS WORT ZÄHLT - Einhängepunkt, noch LEER.
 *
 * Vorbild: die `cs`-Einträge in `salatNamen.ts`. Aus ALLEN Funden der Quellwörter (`buchstabensalatPt.ts`) von Hand
 * durchgesehen: {@link SALAT_NAMEN_PT} Vornamen, Nachnamen, Orte, Länder, Flüsse; {@link SALAT_KEINE_WOERTER_PT} Abkürzungen,
 * Ausrufe, fremde Wörter, Schreibungen ohne Diakritika, die als Wort falsch sind, und Funde, die ein Kind nicht als Wort finden soll.
 * Alles klein. Verteiler: `uebungsformen/salatNamen.ts`. Wächter: `tests/tastenflow-salat-namen.test.ts`.
 *
 * Bis dahin LEER: der Verteiler liest diese Datei schon und nimmt, solange sie leer ist, den ENGLISCHEN Wert
 * (Gerüst G2-NEUN: der Weg „pt" ist bis zu seiner eigenen Reihenfolge ein Alias von „en"; nie Deutsch, Falle 19). Sobald hier
 * etwas steht, gilt es ohne weitere Zeile im Verteiler (`geruestRueckfall.ts`).
 *
 * ⚠️ DATENBLATT: kein Import.
 */

export const SALAT_NAMEN_PT: readonly string[] = [];

export const SALAT_KEINE_WOERTER_PT: readonly string[] = [];
