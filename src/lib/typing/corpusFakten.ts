/**
 * Fakten-Charge (Textwelt TW-E8) — kurze, kinderleichte WISSENS-Zeilen. Bewusst
 * auf UNSTRITTIG WAHRE, allgemein bekannte Elementar-Aussagen beschränkt (Natur,
 * Tiere, Weltall — Grundschul-Niveau), ohne Zahlen/Daten (die bräuchten T5).
 *
 * Faktencheck (§4 / [[feedback_aussagen_dreifach_pruefen]]): Jede Aussage ist
 * elementar und eindeutig wahr; im Zweifel raus. Reichere Fakten mit konkreten
 * Zahlen/Namen (Klexikon-Niveau) bleiben einer ÜBERWACHTEN, dreifach fakten-
 * geprüften Charge vorbehalten (autonom hier nicht — Publikations-Sorgfalt).
 *
 * Selbst formuliert (§10, eigenes Werk). Append-only an CORPUS (Indizes stabil).
 * `typing-textwelt-fakten` erzwingt Tier-Grenzen + tippbare Zeichen.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

// Prüfbericht 27.07.: Diese Elementar-Fakten („Eine Kuh hat ein Kalb.") sind
// Vorschulniveau und liefen bis dahin bis in die Sekundarstufe. Stufe c bekommt
// stattdessen die eigene Charge corpusJugend.ts (TN-E4).
const KIDS_TEENS: Stufe[] = ["kids", "teens"];
/** Elementar-Fakten im T2-Zeichensatz (früh servierbar). */
const FAKTEN_T2: CorpusItem[] = [
  { text: "Eine Kuh hat ein Kalb.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Hund hat ein feines Gehör.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Fisch hat keine Beine.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Huhn hat einen Schnabel.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Bienen wohnen in einem Stock.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Hund hat ein weiches Fell.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Der Mond scheint oft in der Nacht.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Die Sonne ist sehr warm.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Igel rollt sich bei Angst klein.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Frosch schwimmt gut im Wasser.", kind: "fakt", stufen: KIDS_TEENS },
];

/** Elementar-Fakten im vollen Alphabet (T3) — richer, ab ganzem ABC servierbar. */
const FAKTEN_T3: CorpusItem[] = [
  { text: "Ein Pinguin kann nicht fliegen.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Der Wal ist kein Fisch, sondern ein Säugetier.", kind: "wissen", stufen: ["kids", "teens", "erwachsen"] },
  { text: "Eine Spinne hat acht Beine.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Regenwurm hat keine Beine.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Wasser gefriert zu Eis, wenn es kalt wird.", kind: "wissen", stufen: KIDS_TEENS },
  { text: "Die Erde dreht sich um die Sonne.", kind: "wissen", stufen: ["kids", "teens", "erwachsen"] },
  { text: "Der Mond dreht sich um die Erde.", kind: "wissen", stufen: ["kids", "teens", "erwachsen"] },
  { text: "Die Sonne ist ein Stern.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Schmetterling war einmal eine Raupe.", kind: "wissen", stufen: KIDS_TEENS },
  { text: "Eichhörnchen sammeln im Herbst Nüsse.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Der Specht klopft mit dem Schnabel an Bäume.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Bäume geben uns frische Luft.", kind: "wissen", stufen: KIDS_TEENS },
  { text: "Ein Kamel kann lange ohne Wasser leben.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Frosch legt seine Eier ins Wasser.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Regenbogen entsteht aus Licht und Regen.", kind: "wissen", stufen: KIDS_TEENS },
  { text: "Pflanzen brauchen Sonne zum Wachsen.", kind: "wissen", stufen: KIDS_TEENS },
  { text: "Viele Vögel fressen im Winter Körner.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Viele Schnecken tragen ihr Haus mit sich.", kind: "fakt", stufen: KIDS_TEENS },
];

/** Gesamte Fakten-Charge (TW-E8). */
export const FAKTEN_CORPUS: CorpusItem[] = [...FAKTEN_T2, ...FAKTEN_T3];
export const FAKTEN_T2_ONLY = FAKTEN_T2;
