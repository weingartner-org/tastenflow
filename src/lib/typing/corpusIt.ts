/**
 * ★★★ DER ITALIENISCHE KORPUS - die Sammelstelle der Text-Chargen (F5-it, 02.10.2026).
 *
 * Bis zu den Chargen T1-T9 (Bauplan italienischer Lehrgang §4) LEER: der Weg „it" übt dann mit dem Wort-Drill des
 * Generators (`wordsIt.ts`), nie mit deutschen oder englischen Sätzen. Dieses Modul ist ein DATENBLATT (nur Typ-Importe,
 * `scripts/buendel-aufteilung.ts`): es liegt im Datenpaket `tf-daten-it` und wird erst geladen, wenn ein Weg es braucht.
 *
 * ── Was eine Text-Charge hier tut ───────────────────────────────────────────────────────────────────────────────
 *  1. Datei `corpusIt<Charge>.ts` anlegen (z. B. `corpusItWegFruehKids.ts`): `export const …: CorpusItem[] = [...]`,
 *     JEDE Zeile mit `nurWeg: "it"`, `stufen` (kids/teens/erwachsen), `minTier`/`id`/`topic` wie bei den anderen Sprachen.
 *  2. Hier importieren und in {@link CORPUS_IT} anhängen (HINTEN anhängen: die Reihenfolge entscheidet beim
 *     Zusammenführen, `corpus.ts: mergeCorpus`).
 *  3. Den Korpus-Anker neu erzeugen und in DENSELBEN Commit: `npx tsx scripts/erzeuge-korpus-anker.mts` (nur-anhängend; für
 *     „it" beginnt der Anker leer, kein bestehendes Ledger ändert sich). Ohne das meldet `tests/typing-ledger-anker.test.ts`
 *     den Fehler, und der Build lässt den Stand nicht durch.
 *  4. Serien: eigene Liste in `sprachpaketIt.ts` UND in `SERIEN_FOLGE` (serien.ts) eintragen.
 *  5. Lexikon: jedes Wort der Charge muss `isRealWord(w, "it")` bestehen - fehlende Wörter in `lexikonNachtragIt.ts`
 *     nachtragen (nach Wörterbuch geprüft) und den Wächter `tests/tastenflow-it-lexikon.test.ts` laufen lassen
 *     (Falle 58: Lexikon VOR den Texten, Anteil buchstabierter Zeilen je Charge messen).
 *
 * ── Regeln für jede Zeile (Bauplan Italienisch §1, §5; Glossar `recherche-italienisch-2026-10-02/GLOSSAR-it.md` §1 Nr. 7) ──
 *  · Apostroph ASCII `'` (l'amico), Anführungszeichen gerade `"…"`, nur Bindestrich `-`, kein Dialogstrich, kein `…`-Zeichen.
 *  · Elision (l'amico, un'ora, dell'acqua) erst ab der Stelle des Apostrophs in der Reihenfolge (Nr. 26, nach `è à`);
 *    `fitText` sperrt vorher jede Zeile mit Apostroph (er ist „hart", nie `l amico`).
 *  · Neun Paare unterscheiden sich nur durch den Akzent (e/è, da/dà, la/là, li/lì, ne/né, se/sé, si/sì, te/tè, di/dì): ein
 *    fehlender Akzent ist ein ANDERES Wort - nie ein Ersatz.
 *  · `À È É Ì Ò Ù` (grosse Akzentbuchstaben): unter Windows nie tippbar (die Zeile wird dort nicht serviert), am Mac und
 *    in Tessin erst nach der späten Einheit `#` (`LernwegDef.grossAkzentSpaet`) - kein Satz darf davon abhängen, dass ein
 *    Kind sie früh schreibt. Satzanfang mit `È` (È tardi) vermeiden: lieber „Ormai è tardi.".
 *  · Kein `º ª °` (Ordnungszahlen ausgeschrieben), keine Sperrwörter (`sperrlisteIt.ts`, `istKernGesperrtIt`), keine Elision
 *    vor `h`-Wörtern, die Kinder nicht kennen; Zahlen ohne Dezimalkomma und ohne Währung, wo eine Zeile keinen Ort hat (I19).
 */
import type { CorpusItem } from "./corpus";
import { CORPUS_IT_WEG_FRUEH_KIDS } from "./corpusItWegFruehKids";
import { CORPUS_IT_WEG_FRUEH_ERWACHSENE } from "./corpusItWegFruehErwachsene";
import { CORPUS_IT_WEG_FRUEH_TEENS } from "./corpusItWegFruehTeens";
import { CORPUS_IT_WEG_MITTE_TEENS } from "./corpusItWegMitteTeens";
import { CORPUS_IT_WEG_MITTE_KIDS } from "./corpusItWegMitteKids";
import { CORPUS_IT_WEG_MITTE_ERWACHSENE } from "./corpusItWegMitteErwachsene";
import { CORPUS_IT_WEG_ENDE_ERWACHSENE } from "./corpusItWegEndeErwachsene";
import { CORPUS_IT_WEG_ENDE_TEENS } from "./corpusItWegEndeTeens";
import { CORPUS_IT_WEG_ENDE_KIDS } from "./corpusItWegEndeKids";

/**
 * Der italienische Korpus. Neue Chargen HINTEN anhängen (Anker nur anhängend).
 *
 * ★ IT-T1 (03.10.2026): die ersten Zeilen - Kinder, frühe Sprossen 7-19 (`corpusItWegFruehKids.ts`, Befund
 * `BEFUND-2026-10-02-IT-T1-KIDS-FRUEH.md`). Jede Zeile trägt `nurWeg: "it"`; über `korpusFuer("it")` bekommt Weg „it"
 * NUR diese Zeilen, nie deutschen, englischen, französischen oder spanischen Inhalt.
 */
export const CORPUS_IT: CorpusItem[] = [
  ...CORPUS_IT_WEG_FRUEH_KIDS,
  ...CORPUS_IT_WEG_FRUEH_ERWACHSENE, // IT-T3 (03.10.2026): Erwachsene, frühe Sprossen 7-19
  ...CORPUS_IT_WEG_FRUEH_TEENS, // IT-T2 (03.10.2026): Jugendliche, frühe Sprossen 7-19 (nach T3 gemergt)
  ...CORPUS_IT_WEG_MITTE_TEENS, // IT-T5 (03.10.2026): Jugendliche, mittlere Sprossen ⇧ bis x (nach T2 gemergt)
  ...CORPUS_IT_WEG_MITTE_KIDS, // ★ IT-T4 (03.10.2026): Kinder, mittlere Sprossen (Maiusc bis x)
  ...CORPUS_IT_WEG_MITTE_ERWACHSENE, // IT-T6 (03.10.2026): Erwachsene, mittlere Sprossen ⇧ bis x
  ...CORPUS_IT_WEG_ENDE_ERWACHSENE, // IT-T9 (03.10.2026): Erwachsene, späte Sprossen 37-70 (Satzzeichen, Ziffern, Sonderzeichen; nach T6 gemergt)
  ...CORPUS_IT_WEG_ENDE_TEENS, // IT-T8 (03.10.2026): Jugendliche, späte Sprossen 37-70 (Satzzeichen, Ziffern, Sonderzeichen)
  ...CORPUS_IT_WEG_ENDE_KIDS, // IT-T7 (03.10.2026): Kinder, Ende des Lernwegs (? ! " : ; - ( ), Ziffern, Sonderzeichen; nach T8 gemergt)
];
