/**
 * ERSATZ-ZEILEN der Charge S3 (15.08.2026) — deutsch, nur für `teens`.
 *
 * Warum es diese Datei gibt: Beim redaktionellen Retag auf die drei Stufen sind
 * 27 deutsche Zeilen von „7-9 + 10-12" auf `kids` zurückgestuft worden — die
 * Bettgeh- und Spielplatz-Szenen, in denen ein kleines Kind der Gegenstand ist
 * („Schlaf gut, kleiner Ben, sagt die Mutter.", „Andere buddeln tief in dem
 * nassen Sand."). Ein Fünfzehnjähriger soll so etwas nicht mehr abtippen
 * müssen. Damit dabei aber NIEMAND ärmer wird (Johannes' Weiche 4 vom 29.07.:
 * „erst schreiben, dann aussortieren"), stehen hier 32 selbst verfasste Zeilen,
 * die den Fehlbetrag decken, BEVOR er entsteht.
 *
 * Bauart:
 *  • Ton: derselbe wie in `corpusMittel.ts` — auf Augenhöhe, sachlich, ohne
 *    Jubel und ohne Verniedlichung; Gegenstand sind Arbeit, Üben, Messen,
 *    Nachfragen, Quellen prüfen.
 *  • **Alle 32 Zeilen sind Tier 2** (`scripts/_twcheck.mts` gegen `minTierFor`,
 *    0 Probleme, MAX-TIER=2). Das ist der Punkt: Der Fehlbetrag lag bei T2
 *    (25 Zeilen) und T3 (27); eine T2-Zeile zählt in jeder höheren Stufe mit,
 *    eine T3-Zeile bei T2 nicht. Deshalb ist der Tastensatz das eigentliche
 *    Textkorsett — kein p q v x y z ä ü ß.
 *  • Append-only ans Ende von CORPUS (Regel 1 der Übergabe 27.07.: die
 *    Manifest-Indizes der bestehenden Bausteine bleiben stabil).
 *
 * Personen sind dieselben wie in `corpusMittel.ts` (Ilka, Nadia, Tarek, Karin,
 * Nils, Elif) — damit die Stufe eine wiedererkennbare Welt hat und nicht bei
 * jedem Nachschub neue Namen bekommt.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

/** Nur die mittlere Stufe (11-15). Kids hat für diese Zeilen eigenen Bestand. */
const NUR_TEENS: Stufe[] = ["teens"];

export const DREI_STUFEN_CORPUS: CorpusItem[] = [
  // Arbeiten und Üben
  { text: "Wer eine Sache lernt, muss sie oft in die Hand nehmen.", kind: "satz", stufen: NUR_TEENS },
  { text: "Nadia liest die Anleitung und fasst danach nach.", kind: "satz", stufen: NUR_TEENS },
  { text: "Die Arbeit lernt man in der Hand, nicht im Heft.", kind: "satz", stufen: NUR_TEENS },
  { text: "Karin macht den Test noch einmal und misst genauer.", kind: "satz", stufen: NUR_TEENS },
  { text: "Tarek trennt den Fehler in drei kleine Fragen.", kind: "satz", stufen: NUR_TEENS },
  { text: "Wer schnell tastet und dabei raten muss, ist noch nicht sicher.", kind: "satz", stufen: NUR_TEENS },
  { text: "Die dritte Runde ist meist die ehrliche.", kind: "satz", stufen: NUR_TEENS },
  { text: "Nils holt Luft und beginnt noch einmal weiter oben.", kind: "satz", stufen: NUR_TEENS },
  { text: "Ilka ordnet ihre Sachen so, dass sie sie blind findet.", kind: "satz", stufen: NUR_TEENS },
  { text: "Ein Handgriff, den man einmal kann, kostet keine Kraft mehr.", kind: "satz", stufen: NUR_TEENS },
  { text: "Elif liest die Stelle laut und hört, wo es hakt.", kind: "satz", stufen: NUR_TEENS },

  // Messen, prüfen, notieren
  { text: "Nadia notiert, was nicht funktioniert hat.", kind: "satz", stufen: NUR_TEENS },
  { text: "Manche Aufgabe wird leichter, wenn man sie einfach aufschreibt.", kind: "satz", stufen: NUR_TEENS },
  { text: "Nils schneidet erst, wenn er dreimal gemessen hat.", kind: "satz", stufen: NUR_TEENS },
  { text: "Am Anfang ist die Sache nur ein Haufen loser Teile.", kind: "satz", stufen: NUR_TEENS },
  { text: "Wer weitergibt, was er kann, lernt es dabei ein weiteres Mal.", kind: "satz", stufen: NUR_TEENS },
  { text: "Elif schreibt sich die eine Regel hinten ins Heft.", kind: "satz", stufen: NUR_TEENS },
  { text: "Tarek hört die Musik anders, seit er selber Noten liest.", kind: "satz", stufen: NUR_TEENS },
  { text: "Der erste Schritt ist der schwerste, danach rollt es.", kind: "satz", stufen: NUR_TEENS },
  { text: "Karin dreht das Brett um und sieht den Fehler sofort.", kind: "satz", stufen: NUR_TEENS },
  { text: "Ein Weg, den man einmal allein geht, bleibt einem.", kind: "satz", stufen: NUR_TEENS },

  // Miteinander, Ursachen, Quellen
  { text: "Nadia fragt nach der Ursache, nicht nach dem Schuldigen.", kind: "satz", stufen: NUR_TEENS },
  { text: "Wer die Antwort schon kennt, hat nicht wirklich gemessen.", kind: "satz", stufen: NUR_TEENS },
  { text: "Ilka macht die schwere Stelle als Erstes, solange sie wach ist.", kind: "satz", stufen: NUR_TEENS },
  { text: "Der Unterschied kommt aus den harten Minuten, nicht aus den ersten.", kind: "satz", stufen: NUR_TEENS },
  { text: "Tarek nennt lieber einen Grund als drei Ausreden.", kind: "satz", stufen: NUR_TEENS },
  { text: "Wer eine Nachricht teilt, sollte wissen, wer sie geschrieben hat.", kind: "satz", stufen: NUR_TEENS },
  { text: "Nils rechnet nach, ehe er die Sache weitergibt.", kind: "satz", stufen: NUR_TEENS },
  { text: "Eine Frage aus der Klasse hilft meist mehreren Leuten.", kind: "satz", stufen: NUR_TEENS },
  { text: "Karin hört den anderen fertig und antwortet dann.", kind: "satz", stufen: NUR_TEENS },
  { text: "Ein Handwerk lernt niemand an einem Tag.", kind: "satz", stufen: NUR_TEENS },
  { text: "Wer den Anfang wiederholt, kommt schneller ans Ende.", kind: "satz", stufen: NUR_TEENS },
];
