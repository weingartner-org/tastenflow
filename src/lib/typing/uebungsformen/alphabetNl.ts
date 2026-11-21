/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ALPHABET DES WEGES „nl" (Niederländisch) für die Alphabetreihen - Einhängepunkt, seit O-INHALT gefüllt.
 *
 * Was hinein gehört (Vorbild `ALPHABET_ORDER_CS` in `alphabetreihen.ts`): die Buchstaben in der Reihenfolge, in der die Sprache
 * SORTIERT (mit `Intl.Collator("nl-NL")` messen), klein; Mehrzeichen-Buchstaben als ein Eintrag, wo die Schule sie als einen
 * Buchstaben lehrt (cs: `ch`). Buchstaben, die wie ihr Grundbuchstabe sortieren, gehören nicht in die Reihe.
 * Quelle: Recherche der Sprache (iCloud `recherche-nl/`), nicht in `tf-fest`.
 * Verteiler: `uebungsformen/alphabetreihen.ts` (`ALPHABET_ORDER_BY_LERNWEG`). Wächter: `tests/tastenflow-wortspiele-nl.test.ts`.
 *
 * Bis dahin LEER: der Verteiler liest diese Datei schon und nimmt, solange sie leer ist, den ENGLISCHEN Wert
 * (Gerüst G2-NEUN: der Weg „nl" ist bis zu seiner eigenen Reihenfolge ein Alias von „en"; nie Deutsch, Falle 19). Sobald hier
 * etwas steht, gilt es ohne weitere Zeile im Verteiler (`geruestRueckfall.ts`).
 *
 * ⚠️ DATENBLATT: kein Import.
 */

/**
 * ★ O-INHALT-NL (29.10.2026): das niederländische alfabet hat 26 Buchstaben (Taalunie). `ij` ist KEIN eigener Buchstabe der
 * Reihe: gemessen sortiert `Intl.Collator("nl")` es als `i` + `j` (zwischen `i` und `j`), und im Aufsagen des Alphabets kommt es
 * nicht vor. Akzente und Trema (`é ë ï`) sind Zeichen auf einem Vokal, keine Buchstaben. Dieselbe Reihe wie im Englischen und
 * Italienischen - ausdrücklich, nicht als Rückfall.
 */
export const ALPHABET_ORDER_NL: string[] = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
