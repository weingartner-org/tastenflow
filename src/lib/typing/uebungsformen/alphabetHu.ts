/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ALPHABET DES WEGES „hu" (Ungarisch) für die Alphabetreihen - Einhängepunkt, seit O-INHALT gefüllt.
 *
 * Was hinein gehört (Vorbild `ALPHABET_ORDER_CS` in `alphabetreihen.ts`): die Buchstaben in der Reihenfolge, in der die Sprache
 * SORTIERT (mit `Intl.Collator("hu-HU")` messen), klein; Mehrzeichen-Buchstaben als ein Eintrag, wo die Schule sie als einen
 * Buchstaben lehrt (cs: `ch`). Buchstaben, die wie ihr Grundbuchstabe sortieren, gehören nicht in die Reihe.
 * Quelle: Recherche der Sprache (iCloud `recherche-hu/`), nicht in `tf-fest`.
 * Verteiler: `uebungsformen/alphabetreihen.ts` (`ALPHABET_ORDER_BY_LERNWEG`). Wächter: `tests/tastenflow-wortspiele-hu.test.ts`.
 *
 * Bis dahin LEER: der Verteiler liest diese Datei schon und nimmt, solange sie leer ist, den ENGLISCHEN Wert
 * (Gerüst G2-NEUN: der Weg „hu" ist bis zu seiner eigenen Reihenfolge ein Alias von „en"; nie Deutsch, Falle 19). Sobald hier
 * etwas steht, gilt es ohne weitere Zeile im Verteiler (`geruestRueckfall.ts`).
 *
 * ⚠️ DATENBLATT: kein Import.
 */

/**
 * ★ O-INHALT-HU (29.10.2026): das ungarische ábécé, so wie es SORTIERT (gemessen: `Intl.Collator("hu")` ordnet `cs` hinter alle
 * `c…`, `sz` hinter alle `s…` - die Doppelbuchstaben sind eigene Buchstaben, Glossar §2.1 „kétjegyű betű", AkH). In der Reihe:
 * die acht Doppel- und der Dreifachbuchstabe (`cs dz dzs gy ly ny sz ty zs`) hinter ihrem Grundbuchstaben, gross nur das erste
 * Zeichen (`Cs`, `Dzs`, wie am Satzanfang), und `ö ü` als eigene Buchstaben. `á é í ó ú` und `ő ű` sortieren wie ihr
 * Grundbuchstabe (`a e i o u`, `ö ü`; nur Unterschied zweiter Stufe) und gehören darum NICHT in die Reihe - wie die Čárka im
 * Tschechischen. `q w x y` stehen an ihrem lateinischen Platz (sie gehören zum ábécé).
 */
export const ALPHABET_ORDER_HU: string[] = ["a", "b", "c", "cs", "d", "dz", "dzs", "e", "f", "g", "gy", "h", "i", "j", "k", "l", "ly", "m", "n", "ny", "o", "ö", "p", "q", "r", "s", "sz", "t", "ty", "u", "ü", "v", "w", "x", "y", "z", "zs"];
