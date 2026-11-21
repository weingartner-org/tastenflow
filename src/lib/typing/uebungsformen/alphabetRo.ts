/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ALPHABET DES WEGES „ro" (Rumänisch) für die Alphabetreihen - Einhängepunkt, seit O-INHALT gefüllt.
 *
 * Was hinein gehört (Vorbild `ALPHABET_ORDER_CS` in `alphabetreihen.ts`): die Buchstaben in der Reihenfolge, in der die Sprache
 * SORTIERT (mit `Intl.Collator("ro-RO")` messen), klein; Mehrzeichen-Buchstaben als ein Eintrag, wo die Schule sie als einen
 * Buchstaben lehrt (cs: `ch`). Buchstaben, die wie ihr Grundbuchstabe sortieren, gehören nicht in die Reihe.
 * Quelle: Recherche der Sprache (iCloud `recherche-ro/`), nicht in `tf-fest`.
 * Verteiler: `uebungsformen/alphabetreihen.ts` (`ALPHABET_ORDER_BY_LERNWEG`). Wächter: `tests/tastenflow-wortspiele-ro.test.ts`.
 *
 * Bis dahin LEER: der Verteiler liest diese Datei schon und nimmt, solange sie leer ist, den ENGLISCHEN Wert
 * (Gerüst G2-NEUN: der Weg „ro" ist bis zu seiner eigenen Reihenfolge ein Alias von „en"; nie Deutsch, Falle 19). Sobald hier
 * etwas steht, gilt es ohne weitere Zeile im Verteiler (`geruestRueckfall.ts`).
 *
 * ⚠️ DATENBLATT: kein Import.
 */

/**
 * ★ O-INHALT-RO (29.10.2026): das rumänische alfabet hat 31 Buchstaben - `ă â î ș ț` sind EIGENE Buchstaben und stehen hinter
 * ihrem Grundbuchstaben (a ă â b …, gemessen: `Intl.Collator("ro")` ordnet genau so). `ș ț` mit KOMMA darunter (U+0219/U+021B),
 * nie mit Cedille. `q w y` stehen an ihrem lateinischen Platz (sie gehören seit 1982 zum Alphabet).
 */
export const ALPHABET_ORDER_RO: string[] = ["a", "ă", "â", "b", "c", "d", "e", "f", "g", "h", "i", "î", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "ș", "t", "ț", "u", "v", "w", "x", "y", "z"];
