/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ALPHABET DES WEGES „br" (Portugiesisch (Brasilien)) für die Alphabetreihen - Einhängepunkt, noch LEER.
 *
 * Was hinein gehört (Vorbild `ALPHABET_ORDER_CS` in `alphabetreihen.ts`): die Buchstaben in der Reihenfolge, in der die Sprache
 * SORTIERT (mit `Intl.Collator("pt-BR")` messen), klein; Mehrzeichen-Buchstaben als ein Eintrag, wo die Schule sie als einen
 * Buchstaben lehrt (cs: `ch`). Buchstaben, die wie ihr Grundbuchstabe sortieren, gehören nicht in die Reihe.
 * Quelle: Recherche der Sprache (iCloud `recherche-pt/`), nicht in `tf-fest`.
 * Verteiler: `uebungsformen/alphabetreihen.ts` (`ALPHABET_ORDER_BY_LERNWEG`). Wächter: `tests/tastenflow-wortspiele-br.test.ts`.
 *
 * Bis dahin LEER: der Verteiler liest diese Datei schon und nimmt, solange sie leer ist, den ENGLISCHEN Wert
 * (Gerüst G2-NEUN: der Weg „br" ist bis zu seiner eigenen Reihenfolge ein Alias von „en"; nie Deutsch, Falle 19). Sobald hier
 * etwas steht, gilt es ohne weitere Zeile im Verteiler (`geruestRueckfall.ts`).
 *
 * ⚠️ DATENBLATT: kein Import.
 */

/**
 * ★ O-INHALT-BR (29.10.2026): o alfabeto (AO90: 26 Buchstaben, k w y gehören seit dem Abkommen dazu). Die Buchstaben mit Zeichen
 * (á à â ã é ê í ó ô õ ú ç) sind KEINE eigenen Buchstaben - sie sortieren mit ihrem Grundbuchstaben (gemessen: `Intl.Collator("pt-BR",
 * { sensitivity: "base" })` gibt für ç/c und ã/a 0) und gehören darum nicht in die Reihe.
 * Wächter: `tests/tastenflow-alphabet-pt-br-sv.test.ts`.
 */
export const ALPHABET_ORDER_BR: string[] = "abcdefghijklmnopqrstuvwxyz".split("");
