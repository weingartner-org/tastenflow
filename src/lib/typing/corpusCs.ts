/**
 * ★★★ DER TSCHECHISCHE KORPUS - die Sammelstelle der Text-Chargen (F5-cs, 03.10.2026).
 *
 * Bis zu den Chargen (Bauplan vier Sprachen §4, Etappe T) LEER: der Weg „cs" übt dann mit dem Wort-Drill des Generators
 * (`wordsCs.ts`), nie mit englischen oder deutschen Sätzen. Dieses Modul ist ein DATENBLATT (nur Typ-Importe,
 * `scripts/buendel-aufteilung.ts`): es liegt im Datenpaket `tf-daten-cs` und wird erst geladen, wenn ein Weg es braucht.
 *
 * ── Was eine Text-Charge hier tut ───────────────────────────────────────────────────────────────────────────────
 *  1. Datei `corpusCs<Charge>.ts` anlegen (z. B. `corpusCsWegFruehKids.ts`): `export const …: CorpusItem[] = [...]`,
 *     JEDE Zeile mit `nurWeg: "cs"`, `stufen` (kids/teens/erwachsen), `minTier`/`id`/`topic` wie bei den anderen Sprachen.
 *  2. Hier importieren und in {@link CORPUS_CS} anhängen (HINTEN anhängen: die Reihenfolge entscheidet beim
 *     Zusammenführen, `corpus.ts: mergeCorpus`).
 *  3. Den Korpus-Anker neu erzeugen und in DENSELBEN Commit: `npx tsx scripts/erzeuge-korpus-anker.mts` (nur-anhängend; für
 *     „cs" beginnt der Anker leer, kein bestehendes Ledger ändert sich). Ohne das meldet `tests/typing-ledger-anker.test.ts`
 *     den Fehler, und der Build lässt den Stand nicht durch. Und: `CORPUS_CS` in die Leer-Prüfung von
 *     `scripts/erzeuge-korpus-anker.mts` aufnehmen (steht dort als Auftrag der Etappe T).
 *  4. Serien: eigene Liste in `sprachpaketCs.ts` UND in `SERIEN_FOLGE` (serien.ts) eintragen.
 *  5. Lexikon: jedes Wort der Charge steht ab dann von selbst im Fach (`lexicon.ts` liest den Korpus). Ein Wort, das die Tatoeba-
 *     Formen (`lexikonNachtragCs.ts`) nicht kennen, wird sonst beim Vorlesen BUCHSTABIERT - `tests/tastenflow-cs-lexikon.test.ts`
 *     misst den Anteil je Charge; fehlende Formen in `scripts/erzeuge-lexikon-nachtrag-cs.mts` (`ERGAENZT_VON_HAND`) nachtragen
 *     (Falle 58: Lexikon VOR den Texten; ohne Wörterbuch heisst das: von Hand gegenlesen).
 *
 * ── Regeln für jede Zeile (Wächter `tests/tastenflow-cs-texte-regeln.test.ts`, Glossar `recherche-tschechisch-2026-10-02/GLOSSAR-cs.md` §1) ──
 *  · Zeichen: nur `a-z`, `á č ď é ě í ň ó ř š ť ú ů ý ž` (klein und gross), Ziffern und die Satz-/Sonderzeichen des Weges
 *    (`. , ? ! : ; ' " ( ) - %  / + = _ * & < > $ | @ # € [ ]`). Kein `ö ä ü ß ł ñ ç` (nicht auf der Folge des Weges).
 *  · Gerade Zeichen: Anführung `"…"` (ASCII, das Kind tippt `"`; die typografischen „ “ ” » « macht erst die Anzeige), Apostroph `'`,
 *    nur Bindestrich `-`, nie – oder —, kein `…`, kein Dialogstrich am Zeilenanfang, nie U+00A0 (Falle 9: das Kind tippt U+0020).
 *  · Kein Leerzeichen vor `, . ? ! : ;` (im Tschechischen nirgends).
 *  · `Ů` kommt nie vor: die Tastatur erzeugt es auf keinem Weg (`grossFehlt`) - die Zeile würde nie serviert. Kleines `ů` steht nie am
 *    Wortanfang (kein tschechisches Wort).
 *  · Die grossen Akzentbuchstaben (`Č Š Ř Ž Ě Ď Ť Ň` über Háček, `Á É Í Ú Ý Ó` über Čárka) kommen erst, wenn `ˇ` bzw. `´` gelernt
 *    ist (`grossAkzentSpaet`): eine Zeile, die damit BEGINNT, ist vor Sprosse 33 nicht verfügbar. Frühe Chargen (T1-T3) fangen
 *    darum anders an („Dnes je …" statt „Čeština je …") - der Wächter meldet es mit `fruehSprossen`.
 *  · Eine Zeile ist ENTWEDER eine klein geschriebene Wortreihe ODER ein grammatisch richtiger Satz (Falle 26); keine Namen aus dem
 *    Tatoeba-Bestand (Tom, Mary: sie stecken in 68 % der Originale und prägen den Wortschatz), keine Sperrwörter (`sperrlisteCs.ts`,
 *    `istKernGesperrtCs`).
 *  · Zahlen: mit Ziffern, die Tausender mit EINEM normalen Leerzeichen („1 234"); das Prozentzeichen ohne Leerzeichen davor, wo ein
 *    Kind es abtippt (die Anzeige macht „95 %" mit U+00A0).
 */
import type { CorpusItem } from "./corpus";
import { CORPUS_CS_WEG_FRUEH_KIDS } from "./corpusCsWegFruehKids";
import { CORPUS_CS_WEG_FRUEH_TEENS } from "./corpusCsWegFruehTeens";
import { CORPUS_CS_WEG_MITTE_KIDS } from "./corpusCsWegMitteKids";
import { CORPUS_CS_WEG_FRUEH_ERWACHSENE } from "./corpusCsWegFruehErwachsene";
import { CORPUS_CS_WEG_MITTE_TEENS } from "./corpusCsWegMitteTeens";
import { CORPUS_CS_WEG_MITTE_ERWACHSENE } from "./corpusCsWegMitteErwachsene";
import { CORPUS_CS_WEG_ENDE_KIDS } from "./corpusCsWegEndeKids";
import { CORPUS_CS_WEG_ENDE_TEENS } from "./corpusCsWegEndeTeens";
import { CORPUS_CS_WEG_ENDE_ERWACHSENE } from "./corpusCsWegEndeErwachsene";

/**
 * Der tschechische Korpus. Neue Chargen HINTEN anhängen (Anker nur anhängend).
 *
 * ★ CS-T1 (03.10.2026): die ersten Zeilen - Kinder, frühe Sprossen 7-17 (`corpusCsWegFruehKids.ts`, Befund
 * `BEFUND-2026-10-02-CS-T1-KIDS-FRUEH.md`). Jede Zeile trägt `nurWeg: "cs"`; über `korpusFuer("cs")` bekommt Weg „cs"
 * NUR diese Zeilen, nie Inhalt einer anderen Sprache.
 * ★ CS-T2 (03.10.2026): Jugendliche, frühe Sprossen 7-17 (`corpusCsWegFruehTeens.ts`, Befund
 * `BEFUND-2026-10-02-CS-T2-TEENS-FRUEH.md`), HINTER der Kinder-Charge.
 * ★ CS-T4 (09.10.2026): Kinder, mittlere Sprossen 18-44 (`corpusCsWegMitteKids.ts`, Befund
 * `BEFUND-2026-10-09-CS-T4-KIDS-MITTE.md`), hinter der letzten Charge.
 * ★ CS-T3 (09.10.2026): Erwachsene, frühe Sprossen 7-17 (`corpusCsWegFruehErwachsene.ts`, Befund
 * `BEFUND-2026-10-09-CS-T3-ERWACHSENE-FRUEH.md`), HINTER CS-T4 (CS-T4 kam zuerst in den Anker).
 * ★ CS-T5 (09.10.2026): Jugendliche, mittlere Sprossen 18-44 (`corpusCsWegMitteTeens.ts`, Befund
 * `BEFUND-2026-10-09-CS-T5-TEENS-MITTE.md`), HINTER CS-T3.
 * ★ CS-T6 (09.10.2026): Erwachsene, mittlere Sprossen 18-44 (`corpusCsWegMitteErwachsene.ts`, Befund
 * `BEFUND-2026-10-09-CS-T6-ERWACHSENE-MITTE.md`), HINTER CS-T5 (CS-T5 kam zuerst in den Anker).
 * ★ CS-T7 (09.10.2026): Kinder, Ende des Lernwegs 45-78 `!` bis `]` (`corpusCsWegEndeKids.ts`, Befund
 * `BEFUND-2026-10-09-CS-T7-KIDS-ENDE.md`), HINTER CS-T6.
 * ★ CS-T8 (09.10.2026): Jugendliche, Ende-Sprossen 45-78 (`corpusCsWegEndeTeens.ts`, Befund
 * `BEFUND-2026-10-09-CS-T8-TEENS-ENDE.md`), HINTER CS-T7 (CS-T7 kam zuerst in den Anker).
 * ★ CS-T9 (09.10.2026): Erwachsene, Ende des Lernwegs 45-78 `!` bis `]` (`corpusCsWegEndeErwachsene.ts`, Befund
 * `BEFUND-2026-10-09-CS-T9-ERWACHSENE-ENDE.md`), HINTER CS-T8 (CS-T8 kam zuerst in den Anker).
 */
export const CORPUS_CS: CorpusItem[] = [
  ...CORPUS_CS_WEG_FRUEH_KIDS, // CS-T1 (03.10.2026): Kinder, frühe Sprossen 7-17
  ...CORPUS_CS_WEG_FRUEH_TEENS, // CS-T2 (03.10.2026): Jugendliche, frühe Sprossen 7-17
  ...CORPUS_CS_WEG_MITTE_KIDS, // CS-T4 (09.10.2026): Kinder, mittlere Sprossen 18-44
  ...CORPUS_CS_WEG_FRUEH_ERWACHSENE, // CS-T3 (09.10.2026): Erwachsene, frühe Sprossen 7-17
  ...CORPUS_CS_WEG_MITTE_TEENS, // CS-T5 (09.10.2026): Jugendliche, mittlere Sprossen 18-44
  ...CORPUS_CS_WEG_MITTE_ERWACHSENE, // CS-T6 (09.10.2026): Erwachsene, mittlere Sprossen 18-44
  ...CORPUS_CS_WEG_ENDE_KIDS, // CS-T7 (09.10.2026): Kinder, Ende 45-78 (Zeichen und Ziffern)
  ...CORPUS_CS_WEG_ENDE_TEENS, // CS-T8 (09.10.2026): Jugendliche, Ende-Sprossen 45-78
  ...CORPUS_CS_WEG_ENDE_ERWACHSENE, // CS-T9 (09.10.2026): Erwachsene, Ende 45-78 (Zeichen und Ziffern)
];
