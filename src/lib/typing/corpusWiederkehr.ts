/**
 * Wiederkehr-Bausteine (TN-E3, Text-Nachschub §3/§7) — die Zeilen, mit denen
 * Themenstränge (`arcs.ts`) an gelernte Inhalte anknüpfen: Erinnerungs-Fragen
 * IN ANDEREN WORTEN samt Antwort, Vertiefungen und thematische Belohnungs-Witze.
 *
 * Wichtig: Das sind ganz NORMALE Korpus-Bausteine (Sorten `fakt`/`wissen`/
 * `witz`) — sie können auch ohne Strang serviert werden und laufen über
 * dasselbe No-Repeat-Ledger. Der Strang bestimmt nur die REIHENFOLGE und den
 * Abstand (siehe `ARCS`).
 *
 * Append-only wie der übrige Korpus: neue Chargen HINTEN anhängen, damit die
 * Manifest-Indizes stabil bleiben.
 *
 * Alle Zeilen selbst verfasst (§10). Fachlich decken sie sich mit den
 * geprüften Aussagen der jeweiligen Wissens-Serie in `serien.ts`.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
/** Pilot-Strang „Die Spinne" (knüpft an die Wissens-Serie `die-spinne` an). */
export const WIEDERKEHR_CORPUS: CorpusItem[] = [
  // — Wiederholung 1: Beine (Frage + Antwort, bewusst andere Worte als die Serie)
  {
    text: "Weißt du es noch? Wie viele Beine trägt eine Spinne?",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "natur",
  },
  {
    text: "Acht Beine hat sie. Ein Insekt kommt mit sechs aus.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "natur",
  },
  // — Wiederholung 2: kein Insekt (Frage + Antwort)
  {
    text: "Kurze Frage: Zählt die Spinne zu den Insekten?",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "natur",
  },
  {
    text: "Nein, sie ist ein Spinnentier. Ihr Körper hat zwei Teile.",
    kind: "fakt",
    stufen: KIDS_TEENS,
    topic: "natur",
  },
  // — Vertiefung: Seide (baut auf Etappe 2 der Serie auf)
  {
    text: "Spinnenseide ist erstaunlich reißfest und dabei federleicht.",
    kind: "wissen",
    stufen: KIDS_TEENS,
    topic: "natur",
  },
  // — Belohnung: thematischer Witz
  {
    text: "Warum sitzt die Spinne am Rechner? Sie prüft ihr Netz.",
    kind: "witz",
    stufen: KIDS_TEENS,
    topic: "natur",
  },
];
