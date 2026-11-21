/**
 * ★ G3c-VERTEILER (25.10.2026): DAS ALPHABET DES WEGES „sv" (Schwedisch) für die Alphabetreihen - Einhängepunkt, noch LEER.
 *
 * Was hinein gehört (Vorbild `ALPHABET_ORDER_CS` in `alphabetreihen.ts`): die Buchstaben in der Reihenfolge, in der die Sprache
 * SORTIERT (mit `Intl.Collator("sv-SE")` messen), klein; Mehrzeichen-Buchstaben als ein Eintrag, wo die Schule sie als einen
 * Buchstaben lehrt (cs: `ch`). Buchstaben, die wie ihr Grundbuchstabe sortieren, gehören nicht in die Reihe.
 * Quelle: Recherche der Sprache (iCloud `recherche-sv/`), nicht in `tf-fest`.
 * Verteiler: `uebungsformen/alphabetreihen.ts` (`ALPHABET_ORDER_BY_LERNWEG`). Wächter: `tests/tastenflow-wortspiele-sv.test.ts`.
 *
 * Bis dahin LEER: der Verteiler liest diese Datei schon und nimmt, solange sie leer ist, den ENGLISCHEN Wert
 * (Gerüst G2-NEUN: der Weg „sv" ist bis zu seiner eigenen Reihenfolge ein Alias von „en"; nie Deutsch, Falle 19). Sobald hier
 * etwas steht, gilt es ohne weitere Zeile im Verteiler (`geruestRueckfall.ts`).
 *
 * ⚠️ DATENBLATT: kein Import.
 */

/**
 * ★ O-INHALT-SV (29.10.2026): das schwedische Alfabet mit 29 Buchstaben - `å ä ö` sind EIGENE Buchstaben und stehen am ENDE, nach z
 * (gemessen: `Intl.Collator("sv")` sortiert z < å < ä < ö; Wächter `tests/tastenflow-alphabet-pt-br-sv.test.ts`). w ist seit 2006
 * (SAOL) ein eigener Buchstabe. é sortiert mit e und gehört nicht in die Reihe. Ein schwedisches Kind lernt „x y z å ä ö" als Schluss.
 */
export const ALPHABET_ORDER_SV: string[] = "abcdefghijklmnopqrstuvwxyzåäö".split("");
