/**
 * ★★★ DER POLNISCHE KORPUS - die Sammelstelle der Text-Chargen (F5-pl, 03.10.2026).
 *
 * Bis zu den Chargen T1 ff. (Bauplan vier Sprachen, Etappe T) LEER: der Weg „pl" übt dann mit dem Wort-Drill des Generators
 * (`wordsPl.ts`), nie mit deutschen oder englischen Sätzen. Dieses Modul ist ein DATENBLATT (nur Typ-Importe,
 * `scripts/buendel-aufteilung.ts`): es liegt im Datenpaket `tf-daten-pl` und wird erst geladen, wenn ein Weg es braucht.
 *
 * ── Was eine Text-Charge hier tut ───────────────────────────────────────────────────────────────────────────────
 *  1. Datei `corpusPl<Charge>.ts` anlegen (z. B. `corpusPlWegFruehKids.ts`): `export const …: CorpusItem[] = [...]`,
 *     JEDE Zeile mit `nurWeg: "pl"`, `stufen` (kids/teens/erwachsen), `minTier`/`id`/`topic` wie bei den anderen Sprachen.
 *  2. Hier importieren und in {@link CORPUS_PL} anhängen (HINTEN anhängen: die Reihenfolge entscheidet beim
 *     Zusammenführen, `corpus.ts: mergeCorpus`).
 *  3. Den Korpus-Anker neu erzeugen und in DENSELBEN Commit: `npx tsx scripts/erzeuge-korpus-anker.mts` (nur-anhängend; für
 *     „pl" beginnt der Anker leer, kein bestehendes Ledger ändert sich). Ohne das meldet `tests/typing-ledger-anker.test.ts`
 *     den Fehler, und der Build lässt den Stand nicht durch. Mit der ersten Charge `CORPUS_PL` in die Leer-Prüfung von
 *     `scripts/erzeuge-korpus-anker.mts` aufnehmen (dort steht ein Kommentar).
 *  4. Serien: eigene Liste in `sprachpaketPl.ts` UND in `SERIEN_FOLGE` (serien.ts) eintragen.
 *  5. Lexikon: jedes Wort der Charge muss `isRealWord(w, "pl")` bestehen - fehlende Wörter in `lexikonNachtragPl.ts` nachtragen
 *     (`scripts/erzeuge-lexikon-nachtrag-pl.mts`, Liste `ERGAENZT_VON_HAND`) und den Wächter `tests/tastenflow-pl-lexikon.test.ts`
 *     laufen lassen (Falle 58: Lexikon VOR den Texten, Anteil buchstabierter Zeilen je Charge messen). ⚠️ Das macOS-Wörterbuch
 *     hilft für Polnisch NICHT (es nimmt jedes Wort an): der Nachtrag ist eine Menge aus Tatoeba-Wortformen - was eine Charge an
 *     gebeugten Formen braucht, die dort fehlen, kommt von Hand dazu.
 *
 * ── Regeln für jede Zeile (Bauplan vier Sprachen, `recherche-polnisch-2026-10-02/GLOSSAR-pl.md` §1 Nr. 8, §3; Wächter
 *    `tests/tastenflow-pl-texte-regeln.test.ts`, Funktion `zeilenFehler` in `tests/helfer/plTextRegeln.ts`) ─────────────
 *  · Gerade Anführungszeichen `"…"` (NICHT „…” - die Tastatur `pl` hat sie nicht), Apostroph ASCII `'`, nur Bindestrich `-`, kein
 *    Gedankenstrich als Dialogstrich, kein `…`-Zeichen (drei Punkte), KEIN geschütztes Leerzeichen (U+00A0): ein Kind tippt das
 *    gewöhnliche (Glossar §3 Nr. 8). Kein Leerzeichen vor `? ! : ;` (MEN).
 *  · Die neun polnischen Buchstaben `ą ć ę ł ń ó ś ź ż` sind BUCHSTABEN des Alphabets, nie Sonderzeichen. Ein Wort mit einem
 *    von ihnen wird erst an der Sprosse dieses Buchstabens serviert (`fitText`); es gibt keinen Ersatz: `ą` ⇒ `a` ergibt oft ein
 *    ANDERES Wort (sąd/sad, ją/ja, że/ze, stał/stal). Frühe Sprossen tragen darum Wortreihen und kurze Sätze ohne sie.
 *  · Grosse polnische Buchstaben (`Ą Ć Ę Ł Ń Ó Ś Ź Ż`, AltGr + Umschalt + Buchstabe, ein Dreiergriff): ein Satzanfang mit ihnen
 *    (`Łódź`, `Żaba`, `Świat`) wird erst ab der Einheit `q` serviert (`LernwegDef.grossAkzentSpaet`/`grossAkzentAb`). Für frühe
 *    Sprossen anders anfangen („W Łodzi …").
 *  · Zahlen: Dezimalkomma, Tausenderpunkt gibt es nicht (vierstellig ohne Trenner, ab fünf Stellen ein Leerzeichen), Prozent `95%`
 *    ohne Leerzeichen, `zł` erst nach `ł` (die Zeile wird sonst nicht serviert), Datum `21.09.2026`.
 *  · Keine Sperrwörter (`sperrlistePl.ts`, `istKernGesperrtPl`; mit und ohne Ogonki verglichen), nichts gegen ein Kind, Person
 *    zuerst („dzieci niewidome i słabowidzące", nie „niewidome dziecko"), kein „na ślepo".
 *  · Kein Geschlecht raten: Beispiele im Präsens oder mit Namen (Vergangenheit ist gegendert: „zrobił/zrobiła" - ein Text über
 *    eine bestimmte Person darf sie nennen, ein Text, der das Kind anspricht, nicht).
 */
import type { CorpusItem } from "./corpus";
import { CORPUS_PL_WEG_FRUEH_KIDS } from "./corpusPlWegFruehKids";
import { CORPUS_PL_WEG_FRUEH_TEENS } from "./corpusPlWegFruehTeens";
import { CORPUS_PL_WEG_FRUEH_ERWACHSENE } from "./corpusPlWegFruehErwachsene";
import { CORPUS_PL_WEG_MITTE_KIDS } from "./corpusPlWegMitteKids";
import { CORPUS_PL_WEG_MITTE_TEENS } from "./corpusPlWegMitteTeens";
import { CORPUS_PL_WEG_MITTE_ERWACHSENE } from "./corpusPlWegMitteErwachsene";
import { CORPUS_PL_WEG_ENDE_KIDS } from "./corpusPlWegEndeKids";
import { CORPUS_PL_WEG_ENDE_TEENS } from "./corpusPlWegEndeTeens";
import { CORPUS_PL_WEG_ENDE_ERWACHSENE } from "./corpusPlWegEndeErwachsene";

/**
 * Der polnische Korpus. Neue Chargen HINTEN anhängen (Anker nur anhängend).
 *
 * Jede Zeile trägt `nurWeg: "pl"`; über `korpusFuer("pl")` bekommt Weg „pl" NUR diese Zeilen, nie deutschen,
 * englischen, französischen, spanischen oder italienischen Inhalt.
 * ★ PL-T1 (03.10.2026): die erste Charge (Kinder, frühe Sprossen 7-22) - bis dahin war der Korpus leer.
 */
export const CORPUS_PL: CorpusItem[] = [
  ...CORPUS_PL_WEG_FRUEH_KIDS, // PL-T1 (03.10.2026): Kinder, frühe Sprossen 7-22 (a bis u, vor ⇧)
  ...CORPUS_PL_WEG_FRUEH_TEENS, // PL-T2 (03.10.2026): Jugendliche, frühe Sprossen 7-22
  ...CORPUS_PL_WEG_FRUEH_ERWACHSENE, // PL-T3 (03.10.2026, nach PL-T2 gemergt): Erwachsene, frühe Sprossen 7-22 (a bis u, vor ⇧)
  ...CORPUS_PL_WEG_MITTE_KIDS, // PL-T4 (03.10.2026, nach PL-T3 gemergt): Kinder, mittlere Sprossen 23-39 (⇧ bis q)
  ...CORPUS_PL_WEG_MITTE_TEENS, // PL-T5 (03.10.2026, nach PL-T4 gemergt): Jugendliche, mittlere Sprossen 23-39 (⇧ bis q)
  ...CORPUS_PL_WEG_MITTE_ERWACHSENE, // PL-T6 (03.10.2026, nach PL-T5): Erwachsene, mittlere Sprossen 23-39 (⇧ bis q)
  ...CORPUS_PL_WEG_ENDE_KIDS, // PL-T7 (09.10.2026, nach PL-T6): Kinder, Ende des Lernwegs 40-77 (? bis €)
  ...CORPUS_PL_WEG_ENDE_TEENS, // PL-T8 (09.10.2026, nach PL-T7): Jugendliche, Ende des Lernwegs 40-77 (? bis €)
  ...CORPUS_PL_WEG_ENDE_ERWACHSENE, // PL-T9 (09.10.2026, nach PL-T8 gemergt): Erwachsene, Ende des Lernwegs 40-77 (? bis €)
];
