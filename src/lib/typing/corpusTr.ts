/**
 * ★★★ DER TÜRKISCHE KORPUS - die Sammelstelle der Text-Chargen (F5-tr, 03.10.2026).
 *
 * Bis zu den Chargen der Etappe T war er LEER (der Weg „tr" übte mit dem Wort-Drill des Generators, `wordsTr.ts`, nie mit
 * deutschen oder englischen Sätzen); seit TR-T1 (03.10.2026) trägt er Text - siehe {@link CORPUS_TR}. Dieses Modul ist ein DATENBLATT (nur Typ-Importe, `scripts/buendel-aufteilung.ts`): es liegt
 * im Datenpaket `tf-daten-tr` und wird erst geladen, wenn ein Weg es braucht.
 *
 * ── Was eine Text-Charge hier tut ───────────────────────────────────────────────────────────────────────────────
 *  1. Datei `corpusTr<Charge>.ts` anlegen (z. B. `corpusTrWegFruehKids.ts`): `export const …: CorpusItem[] = [...]`,
 *     JEDE Zeile mit `nurWeg: "tr"`, `stufen` (kids/teens/erwachsen), `minTier`/`id`/`topic` wie bei den anderen Sprachen.
 *  2. Hier importieren und in {@link CORPUS_TR} anhängen (HINTEN anhängen: die Reihenfolge entscheidet beim
 *     Zusammenführen, `corpus.ts: mergeCorpus`).
 *  3. Den Korpus-Anker neu erzeugen und in DENSELBEN Commit: `npx tsx scripts/erzeuge-korpus-anker.mts` (nur-anhängend; für
 *     „tr" beginnt der Anker leer, kein bestehendes Ledger ändert sich). Ohne das meldet `tests/typing-ledger-anker.test.ts`
 *     den Fehler, und der Build lässt den Stand nicht durch. `CORPUS_TR` steht seit TR-T1 in der Pflichtprüfung „Korpus
 *     nicht leer" am Anfang von `scripts/erzeuge-korpus-anker.mts`.
 *  4. Serien: eigene Liste in `sprachpaketTr.ts` UND in `SERIEN_FOLGE` (serien.ts) eintragen.
 *  5. Lexikon: jedes Wort der Charge muss `isRealWord(w, "tr")` bestehen - fehlende Wörter in `lexikonNachtragTr.ts`
 *     nachtragen (`scripts/erzeuge-lexikon-nachtrag-tr.mts`, `--unbekannt` zeigt die häufigsten fehlenden Formen) und den
 *     Wächter `tests/tastenflow-tr-lexikon.test.ts` laufen lassen (Falle 58: Lexikon VOR den Texten, Anteil buchstabierter Zeilen
 *     je Charge messen). Namen mit Endung (`Ankara'da`) erkennt `isRealWord` über die Regel `istApostrofFormTr` (lexicon.ts).
 *
 * ── Regeln für jede Zeile (Bauplan Türkisch Q; Glossar `recherche-tuerkisch-2026-10-02/GLOSSAR-tr.md` §1 Regel 6/7/9, §4;
 *    Wächter `tests/tastenflow-tr-texte-regeln.test.ts` prüft jede Zeile ohne Änderung) ──
 *  · **Apostroph ASCII `'` nur an Eigennamen** (`Ankara'da`, `Ali'nin`, `Türkiye'ye`); nie an Monats- oder Tagesnamen, nie an
 *    Zahlen (`1985'te` ist richtig, aber `3'ü` hängt von der Aussprache ab - Zahlen mit Endung vermeiden), nie an Gattungswörter.
 *    Der Apostroph ist Einheit Nr. 30 der Reihenfolge: `fitText` sperrt jede Zeile mit Apostroph davor (er ist „hart", nie
 *    `Ankara da`) - Texte schreiben Namen darum bis dahin ohne Endung (Befund F4 §6.4).
 *  · Anführungszeichen gerade `"…"`, nur Bindestrich `-`, `...` statt `…`, kein Dialogstrich, kein Leerzeichen vor `? ! : ;`.
 *  · **i und ı sind zwei Buchstaben.** Gross-/Kleinschreibung nie mit `toUpperCase()`/`toLowerCase()` ohne Sprache: der Satzanfang
 *    `İ…` steht fertig im Text (`İki`, `İyi`), `I…` ist `ı` gross (`Irmak`, `Işık`). Ein Wort steht in genau der richtigen
 *    Schreibung - nie `ı` für `i` und umgekehrt (`ılık`/`ilik`), nie ASCII-Ersatz (`cocuk`, `guzel`).
 *  · `â î û` (Zirkumflex) nur in Wörtern, die der TDK so schreibt (`hâlâ`, `kâğıt`, `rüzgâr`, `zekâ`); sie sind erst frei, wenn die
 *    Totaste `^` UND der Vokal gelernt sind (Sprosse 31).
 *  · Zahlen mit Tausenderpunkt ab vier Stellen (`1.234`), Dezimalkomma (`1.234,5`), Prozent VOR der Zahl (`%95`), Währung vor der
 *    Zahl (`₺150`, `€5`); Uhrzeit `08:00`; Ordnungszahl mit Punkt (`3.`). Nach einer Zahl steht die Einzahl (`5 hata`, nie `5 hatalar`).
 *  · **Keine Endung an Platzhaltern** und keine Endung an Zahlen, Abkürzungen, Produktnamen (Glossar Regel 6) - sie gehört an ein
 *    festes Wort daneben.
 *  · Keine Sperrwörter (`sperrlisteTr.ts`, `istKernGesperrtTr`); **Atatürk, Staatssymbole, Religion, Militär** nie in Übungstexten,
 *    die Zeichen vertauschen, umdrehen oder Fehler einbauen (Gesetz 5816; ob Nationalfeiertage in Übungstexte kommen, entscheidet
 *    Johannes). Kein `º ª °`, keine Wörter mit `ä ß` (auf `tr-q` nicht tippbar).
 *  · Person zuerst: „görme yetersizliği olan çocuk", nie „kör çocuk"; Lehrkraft ohne Geschlecht (`öğretmen`), nie Bey/Hanım/abla.
 */
import type { CorpusItem } from "./corpus";
import { CORPUS_TR_WEG_FRUEH_KIDS } from "./corpusTrWegFruehKids";
import { CORPUS_TR_WEG_FRUEH_TEENS } from "./corpusTrWegFruehTeens";
import { CORPUS_TR_WEG_FRUEH_ERWACHSENE } from "./corpusTrWegFruehErwachsene";
import { CORPUS_TR_WEG_MITTE_KIDS } from "./corpusTrWegMitteKids";
import { CORPUS_TR_WEG_MITTE_TEENS } from "./corpusTrWegMitteTeens";
import { CORPUS_TR_WEG_MITTE_ERWACHSENE } from "./corpusTrWegMitteErwachsene";
import { CORPUS_TR_WEG_ENDE_KIDS } from "./corpusTrWegEndeKids";
import { CORPUS_TR_WEG_ENDE_TEENS } from "./corpusTrWegEndeTeens";
import { CORPUS_TR_WEG_ENDE_ERWACHSENE } from "./corpusTrWegEndeErwachsene";

/**
 * Der türkische Korpus. Neue Chargen HINTEN anhängen (Anker nur anhängend).
 *
 * ★ TR-T1 (03.10.2026): die ersten Zeilen - Kinder, frühe Sprossen 7-19 (`corpusTrWegFruehKids.ts`, Befund
 * `BEFUND-2026-10-02-TR-T1-KIDS-FRUEH.md`). Jede Zeile trägt `nurWeg: "tr"`; über `korpusFuer("tr")` bekommt Weg „tr"
 * NUR diese Zeilen, nie deutschen, englischen oder anderen Inhalt.
 * ★ TR-T2 (03.10.2026): Jugendliche, frühe Sprossen 7-19 (`corpusTrWegFruehTeens.ts`, Befund
 * `BEFUND-2026-10-02-TR-T2-TEENS-FRUEH.md`), HINTER der Kinder-Charge.
 *
 * ★ TR-T3 (03.10.2026): Erwachsene, frühe Sprossen 7-19 (`corpusTrWegFruehErwachsene.ts`, Befund
 * `BEFUND-2026-10-02-TR-T3-ERWACHSENE-FRUEH.md`), beim Merge HINTER TR-T2 gesetzt (TR-T2 war zuerst im Anker).
 *
 * ★ TR-T4 (09.10.2026): Kinder, mittlere Sprossen 20-37 = ⇧ bis q (`corpusTrWegMitteKids.ts`, Befund
 * `BEFUND-2026-10-09-TR-T4-KIDS-MITTE.md`), HINTER TR-T3.
 *
 * ★ TR-T5 (09.10.2026): Jugendliche, mittlere Sprossen 20-37 = ⇧ bis q (`corpusTrWegMitteTeens.ts`, Befund
 * `BEFUND-2026-10-09-TR-T5-TEENS-MITTE.md`), beim Merge HINTER TR-T4 gesetzt.
 *
 * ★ TR-T6 (09.10.2026): Erwachsene, mittlere Sprossen 20-37 = ⇧ bis q (`corpusTrWegMitteErwachsene.ts`, Befund
 * `BEFUND-2026-10-09-TR-T6-ERWACHSENE-MITTE.md`), HINTER TR-T5.
 * ★ TR-T7 (09.10.2026): Kinder, Ende des Lernwegs, Sprossen 38-76 = `?` bis `½` (`corpusTrWegEndeKids.ts`, Befund
 * `BEFUND-2026-10-09-TR-T7-KIDS-ENDE.md`), HINTER TR-T6 (beim Merge 09.10.).
 *
 * ★ TR-T8 (09.10.2026): Jugendliche, Ende-Sprossen 38-76 = `?` bis `½` (`corpusTrWegEndeTeens.ts`, Befund
 * `BEFUND-2026-10-09-TR-T8-TEENS-ENDE.md`), HINTER TR-T7 (beim Merge 09.10.).
 * ★ TR-T9 (09.10.2026): Erwachsene, Ende des Lernwegs, Sprossen 38-76 = `?` bis `½` (`corpusTrWegEndeErwachsene.ts`, Befund
 * `BEFUND-2026-10-09-TR-T9-ERWACHSENE-ENDE.md`), HINTER TR-T8 (beim Merge 09.10.).
 */
export const CORPUS_TR: CorpusItem[] = [
  ...CORPUS_TR_WEG_FRUEH_KIDS, // TR-T1 (03.10.2026): Kinder, frühe Sprossen 7-19
  ...CORPUS_TR_WEG_FRUEH_TEENS, // TR-T2 (03.10.2026): Jugendliche, frühe Sprossen 7-19
  ...CORPUS_TR_WEG_FRUEH_ERWACHSENE, // TR-T3 (03.10.2026): Erwachsene, frühe Sprossen 7-19
  ...CORPUS_TR_WEG_MITTE_KIDS, // TR-T4 (09.10.2026): Kinder, mittlere Sprossen 20-37 (⇧ bis q)
  ...CORPUS_TR_WEG_MITTE_TEENS, // TR-T5 (09.10.2026): Jugendliche, mittlere Sprossen 20-37 (⇧ bis q)
  ...CORPUS_TR_WEG_MITTE_ERWACHSENE, // TR-T6 (09.10.2026): Erwachsene, mittlere Sprossen 20-37 (⇧ bis q)
  ...CORPUS_TR_WEG_ENDE_KIDS, // TR-T7 (09.10.2026): Kinder, Ende des Lernwegs, Sprossen 38-76 (? bis ½)
  ...CORPUS_TR_WEG_ENDE_TEENS, // TR-T8 (09.10.2026): Jugendliche, Ende-Sprossen 38-76 (? bis ½)
  ...CORPUS_TR_WEG_ENDE_ERWACHSENE, // TR-T9 (09.10.2026): Erwachsene, Ende des Lernwegs, Sprossen 38-76 (? bis ½)
];
