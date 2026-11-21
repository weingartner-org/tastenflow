/**
 * Englische Wiederkehr-Bausteine der Themenstränge (TN-E7, Text-Nachschub §3).
 *
 * Gegenstücke zu `corpusWiederkehr.ts` auf der englischen Seite: Erinnerungs-
 * Fragen IN ANDEREN WORTEN samt Antwort, Vertiefungen und Belohnungs-Witze zu
 * den beiden neuen Wissens-Serien („A Trip Through Space", „How Animals Sleep").
 *
 * Es sind ganz NORMALE Korpus-Bausteine — die Verkettung lebt allein in `ARCS`.
 * Alle Zeilen selbst verfasst; Sachaussagen doppelt belegt (Belege im
 * Kandidaten-Ordner `Sensorik/TN-Kandidaten/TN-E7-en/belege.md`).
 *
 * Sprachregeln: britisches Englisch, KEINE Apostrophe (fitText streicht sie
 * unterhalb T5 → falsch geschriebenes Englisch), keine Anführungszeichen,
 * Ziffern ausgeschrieben.
 */
import type { CorpusItem, Herkunft } from "./corpus";
import type { Stufe } from "./account";

const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
const EIGEN: Herkunft = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
  en: {
    quelle: "Sensorik",
    lizenz: "Own work (self-written)",
    autor: "Sensorik learning platform",
  },
};

export const EN_WIEDERKEHR_CORPUS: CorpusItem[] = [
  // ── Strang „A Trip Through Space" ──────────────────────────────────────────
  {
    text: "Do you remember? How old is the sunlight that reaches your window?",
    kind: "wissen",
    stufen: ALLE_DREI,
    topic: "weltall",
    herkunft: EIGEN,
  },
  {
    text: "About eight minutes, because that is how long its journey takes.",
    kind: "wissen",
    stufen: ALLE_DREI,
    topic: "weltall",
    herkunft: EIGEN,
  },
  {
    text: "The next star after the Sun is so far away that its light travels for years.",
    kind: "fakt",
    stufen: ALLE_DREI,
    topic: "weltall",
    herkunft: EIGEN,
  },
  {
    text: "Why do we never get to see the back of the Moon from our garden?",
    kind: "wissen",
    stufen: ALLE_DREI,
    topic: "weltall",
    herkunft: EIGEN,
  },
  {
    text: "It turns once while it circles us, so one side always looks away.",
    kind: "wissen",
    stufen: ALLE_DREI,
    topic: "weltall",
    herkunft: EIGEN,
  },
  {
    text: "Why did the Sun never go to school? Because it was already a bright star.",
    kind: "witz",
    stufen: ALLE_DREI,
    topic: "weltall",
    herkunft: EIGEN,
  },
  // ── Strang „How Animals Sleep" ─────────────────────────────────────────────
  {
    text: "Do you remember? Why can a dolphin never fall asleep completely?",
    kind: "wissen",
    stufen: ALLE_DREI,
    topic: "tiere",
    herkunft: EIGEN,
  },
  {
    text: "It has to decide to breathe, so one half of its brain stays awake.",
    kind: "wissen",
    stufen: ALLE_DREI,
    topic: "tiere",
    herkunft: EIGEN,
  },
  {
    text: "Seals can rest half their brain at sea and both halves once they are on land.",
    kind: "fakt",
    stufen: ALLE_DREI,
    topic: "tiere",
    herkunft: EIGEN,
  },
  {
    text: "How can a sleeping bat hold on for hours without getting tired?",
    kind: "wissen",
    stufen: ALLE_DREI,
    topic: "tiere",
    herkunft: EIGEN,
  },
  {
    text: "Its own weight closes the claws, so hanging needs no muscle work.",
    kind: "wissen",
    stufen: ALLE_DREI,
    topic: "tiere",
    herkunft: EIGEN,
  },
  {
    text: "A bat told me the whole world looks better upside down. I let it hang.",
    kind: "witz",
    stufen: ALLE_DREI,
    topic: "tiere",
    herkunft: EIGEN,
  },
];
