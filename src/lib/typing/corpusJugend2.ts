/**
 * Korpus-Charge „13–15 auf Augenhöhe" (AG-E5, 29.07.2026).
 *
 * ANLASS (gemessen mit `scripts/_kindlich.mts c` und der Rest-Sonde): Von 847
 * aktiven Einträgen für Stufe c waren 197 zugleich für 7–9 freigegeben — und
 * bei den ersten 13 Tasten (T1) waren es **alle 42**. Wer mit 15 anfängt,
 * bekam dort also ausschließlich Stoff, der für Siebenjährige geschrieben ist.
 * Weiche 4 (Johannes 29.07.): **erst schreiben, dann aussortieren** — sonst
 * schrumpft ausgerechnet die Stufe, um die es geht.
 *
 * WAS DIESE DATEI IST: eigener Stoff für 13–15 (und meist auch Erwachsene),
 * mit Schwerpunkt auf den FRÜHEN Tiers, wo die Lücke am größten ist. Kein
 * Retag von Bestands-Zeilen — ein Retag auf `c` würde die Doppel-Freigaben
 * erhöhen, die der Wächter-Test (`tests/typing-altersgrenze.test.ts`) gerade
 * deckelt. Append-only ans Ende von `CORPUS`.
 *
 * TON (Weiche 1): ernst genommen, nicht nüchtern. Kein Jubel, keine
 * Verkleinerungsformen, keine sprechenden Tiere — aber auch keine
 * Erwachsenen-Attitüde. Gegenstände: Lernen, Training, Technik, Arbeit,
 * Urteilen. Es geht NICHT um Themen-Verbote: „Der Regenwurm" ist als Thema in
 * Ordnung, die BEHANDLUNG entscheidet.
 *
 * RECHTE: alle Zeilen selbst verfasst. Bewusst als `kind: "satz"` gehalten und
 * ohne Tatsachenbehauptung, die eine Quelle bräuchte — Wissens-Inhalte
 * verlangen die Doppelbeleg-Disziplin (Bauplan §4) und laufen über eigene
 * TN-C-Chargen.
 *
 * WORTSCHATZ-GRENZEN wie in `serienFrueh.ts` (Regel 13): T1 kennt nur
 * `a d e f i j k l n r s t ö` — kein *und*, kein *nicht*, kein *ich*, kein
 * *nur*, kein Zeitwort. Jede Zeile ist mit `minTierFor` am Objekt geprüft,
 * nicht geschätzt; ae/ue/oe-Ersatzschreibungen sind auf einer deutschen
 * Tastatur schlicht falsch und kommen darum nicht vor.
 */
import type { CorpusItem, Herkunft } from "./corpus";
import type { Stufe } from "./account";

/** 13–15 und Erwachsene — bewusst NIE zusammen mit „a" (Ratsche AG-E4). */
const TEENS_ERW: Stufe[] = ["teens", "erwachsen"];
/** Nur 13–15: was für Erwachsene zu schülernah klingt. */
const NUR_TEENS: Stufe[] = ["teens"];
/** 10–12 und 13–15: trägt in beiden Stufen, aber nicht bei den Jüngsten. */
const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const SELBST: Herkunft = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
  fundstelle: "Selbst verfasst am 2026-07-29, keine Fremdquelle",
};

const satz = (text: string, stufen: Stufe[], topic: string): CorpusItem => ({
  text,
  kind: "satz",
  stufen,
  topic,
  herkunft: SELBST,
});

/**
 * Block A — TIER 1 (die 13 ersten Tasten). Hier war die Lücke am härtesten:
 * ohne diese Zeilen hätte Stufe c beim Aussortieren dort NULL eigenen Stoff.
 * Mit diesem Tastensatz gibt das Deutsche keine Nebensätze her; die Wirkung
 * kommt aus knappen Gegenüberstellungen statt aus Satzbau.
 */
const T1_BLOCK: CorpusItem[] = [
  satz("Kein Trainer trainiert allein.", TEENS_ERW, "lernen"),
  satz("Die Frist endet, das Interesse nie.", TEENS_ERW, "lernen"),
  satz("Die Idee ist stark, die Kritik ist fair.", TEENS_ERW, "urteilen"),
  satz("Stress kennt keine Rast.", TEENS_ERW, "alltag"),
  satz("Ein Titel ist ein Detail, keine Tat.", TEENS_ERW, "urteilen"),
  satz("Talent trainiert. Ein Star trainiert stets.", NUR_TEENS, "training"),
  satz("Die Kritik trifft, die Idee trifft tiefer.", TEENS_ERW, "urteilen"),
  satz("Nadia testet die Antenne. Sie sendet.", KIDS_TEENS, "technik"),
  satz("Ein Fakt ist kein Trend.", TEENS_ERW, "urteilen"),
  satz("Der Kanal endet an einer alten Insel.", KIDS_TEENS, "natur"),
  satz("Der Reifen ist alt, die Kante ist tief.", TEENS_ERW, "technik"),
  satz("Ein Kandidat lernt die Liste, keiner kennt den Test.", TEENS_ERW, "lernen"),
  satz("Tarik faltet die Karte, Nadia liest den Rand.", KIDS_TEENS, "alltag"),
  satz("Talent ist ein Start, kein Ende.", NUR_TEENS, "training"),
  satz("Der Test ist fair, das Ende ist es selten.", TEENS_ERW, "urteilen"),
  satz("Erst die Daten, dann das Detail.", TEENS_ERW, "arbeit"),
  satz("Ein Detail fehlt, die Kette hält trotzdem.", TEENS_ERW, "technik"),
  satz("Selten ist eine Kritik so stark wie eine Tat.", TEENS_ERW, "urteilen"),
];

/**
 * Block B — TIER 2 (+ h o u c g m b w). Ab hier trägt der Wortschatz ganze
 * Gedanken; die Zeilen sind kurz gehalten, damit sie eine Übungsrunde nicht
 * dominieren.
 */
const T2_BLOCK: CorpusItem[] = [
  satz("Ein Detail entscheidet den Test.", TEENS_ERW, "arbeit"),
  satz("Elif liest die Liste. Dann liest sie sie erneut.", KIDS_TEENS, "lernen"),
  satz("Ideen sind still, Taten sind laut.", TEENS_ERW, "urteilen"),
  satz("Ein Fakt trennt: Er stimmt, dann steht er.", TEENS_ERW, "urteilen"),
  satz("Die Serie endet nie an derselben Stelle.", KIDS_TEENS, "alltag"),
  satz("Ein Sensor filtert die Daten, ein Mensch bewertet sie.", TEENS_ERW, "technik"),
  satz("Die Leiter steht steil an der Kante.", KIDS_TEENS, "alltag"),
  satz("Ein Instrument stimmt oder es stimmt nicht.", TEENS_ERW, "musik"),
  satz("Ein Blick auf die Uhr macht keine Sekunde schneller.", TEENS_ERW, "training"),
  satz("Ein Argument ohne Beleg ist eine Meinung mit Anlauf.", TEENS_ERW, "urteilen"),
  satz("Die feinste Stelle entscheidet, keine andere.", TEENS_ERW, "technik"),
  satz("Wer nur schnell sein will, wird meistens ungenau.", TEENS_ERW, "training"),
  satz("Ein Werkzeug bleibt so gut wie die Hand, die es hält.", TEENS_ERW, "arbeit"),
  satz("Wer eine Sache erklären kann, hat sie halb gelernt.", TEENS_ERW, "lernen"),
];

/**
 * Block C — TIER 3 (ganzes Alphabet). Der Stoff, der die Stufe trägt, sobald
 * alle Buchstaben sitzen — dort ist die Versorgung ohnehin am besten, darum
 * eine kleinere Charge.
 */
const T3_BLOCK: CorpusItem[] = [
  satz("Wer schnell tippt, macht Fehler. Wer genau tippt, macht Tempo.", TEENS_ERW, "training"),
  satz("Ohne Rhythmus wird auch schnelles Tippen langsam.", TEENS_ERW, "training"),
  satz("Die Frage ist nicht, ob es klappt, sondern wann.", TEENS_ERW, "urteilen"),
  satz("Manche Fehler kommen erst zurück, wenn man sie vergisst.", TEENS_ERW, "lernen"),
  satz("Konzentration ist eine Fertigkeit, kein Charakter.", TEENS_ERW, "lernen"),
  satz("Ein System ist so schnell wie sein langsamster Teil.", TEENS_ERW, "technik"),
  satz("Routine macht sicher und blind zugleich.", TEENS_ERW, "arbeit"),
  satz("Alte Daten sind selten falsch, aber oft veraltet.", TEENS_ERW, "technik"),
  satz("Wer schnell tippen will, muss langsam genau werden.", TEENS_ERW, "training"),
  satz("Ein guter Trainer erklärt weniger und fragt mehr.", TEENS_ERW, "training"),
  satz("Wer laut denkt, hört sich selbst beim Irren zu.", TEENS_ERW, "urteilen"),
  satz("Zwei Quellen sind kein Beweis, aber ein Anfang.", TEENS_ERW, "urteilen"),
];

/** Die Charge in Manifest-Reihenfolge (append-only ans Ende von CORPUS). */
export const JUGEND2_CORPUS: CorpusItem[] = [
  ...T1_BLOCK,
  ...T2_BLOCK,
  ...T3_BLOCK,
];
