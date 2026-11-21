/**
 * ENGLISCHE T2-Charge II (Textwelt-Nachlage §9, englische Seite) — 60 weitere
 * selbst verfasste Zeilen im T2-Zeichensatz, bewusst ANDERE Welten als Charge I:
 * Wetter, Wald, Küste, Tiere im Freien — und ein eigener Block sachlich-trockener
 * Alltagsbeobachtungen für erwachsene Lernende (dort war ≤T2 mit 65 Zeilen am
 * dünnsten).
 *
 * Rechte (§10): eigenes Werk. Keine Zahlen/Fakten → kein Faktencheck nötig.
 *
 * T2-Zeichensatz: a b c d e f g h i j k l m n o r s t u w — KEIN p q v x y z.
 * Apostrophe vermieden (fitText streicht sie unter T5 ersatzlos).
 * Append-only an CORPUS_EN → Ledger-Indizes stabil.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

/** Altersneutrale Natur-/Wetterbilder — für JEDE Stufe passend. */
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
// TN-E8: Zeilen mit seltenem Vokabular („nettles", „flint", „dear"=teuer)
// verlassen die Anfänger-Stufe a — für Fremdsprachen-Lernende im ersten Jahr
// sind sie kein Anfängertext (Prüfbericht 27.07.). Für b/c bleiben sie: dort
// sind sie hübsch. Kein Eintrag wird gelöscht ⇒ Ledger-Indizes stabil.
/** Ältere Lernende (Beruf, Alltag mit trockenem Ton). */
const TEENS_ERW: Stufe[] = ["teens", "erwachsen"];
/** Ab der Mittelstufe aufwärts. */
export const EN_T2B_CORPUS: CorpusItem[] = [
  // ---- Wetter und Jahreszeiten ----
  { text: "The wind combs the tall grass.", kind: "satz", stufen: ALLE_DREI },
  { text: "Cold rain drums on the old roof.", kind: "satz", stufen: ALLE_DREI },
  { text: "The first snow lands and holds.", kind: "satz", stufen: ALLE_DREI },
  { text: "The moon hangs low and full.", kind: "satz", stufen: ALLE_DREI },
  { text: "Fog sits in the field until noon.", kind: "satz", stufen: ALLE_DREI },
  { text: "The last leaf on the tree holds on.", kind: "satz", stufen: ALLE_DREI },
  { text: "In the north the winter comes back too soon.", kind: "satz", stufen: ALLE_DREI },
  { text: "A storm walks across the water.", kind: "satz", stufen: ALLE_DREI },
  { text: "At noon the sun stands at its highest.", kind: "satz", stufen: ALLE_DREI },
  { text: "Warm air comes in with the morning.", kind: "satz", stufen: ALLE_DREI },
  { text: "The autumn wind is cold and blunt.", kind: "satz", stufen: ALLE_DREI },
  { text: "A thin cloud crosses the far hill.", kind: "satz", stufen: ALLE_DREI },

  // ---- Wald, Bach, Wiese ----
  { text: "The stream runs faster after the rain.", kind: "satz", stufen: ALLE_DREI },
  { text: "The forest is louder than the road.", kind: "satz", stufen: ALLE_DREI },
  { text: "Under the old oak it is cool and dark.", kind: "satz", stufen: ALLE_DREI },
  { text: "The birds come back before the flowers.", kind: "satz", stufen: ALLE_DREI },
  { text: "An ant hauls a crumb far bigger than itself.", kind: "satz", stufen: ALLE_DREI },
  { text: "The little brook forms a mirror of the wood.", kind: "satz", stufen: ALLE_DREI },

  // ---- Küste und Meer ----
  { text: "A shell lies white on the wet sand.", kind: "satz", stufen: ALLE_DREI },
  { text: "The tide takes the sand and hands it back.", kind: "satz", stufen: ALLE_DREI },
  { text: "Salt hangs in the air near the harbour.", kind: "satz", stufen: ALLE_DREI },
  { text: "A fishing boat comes in without a sound.", kind: "satz", stufen: ALLE_DREI },
  { text: "The old lighthouse blinks all night.", kind: "satz", stufen: ALLE_DREI },

  // ---- Tiere im Freien ----
  { text: "The horse eats the last of the grain.", kind: "satz", stufen: ALLE_DREI },
  { text: "A cat crosses the road and looks at no one.", kind: "satz", stufen: ALLE_DREI },
  { text: "The deer feeds at the border of the field.", kind: "satz", stufen: ALLE_DREI },
  { text: "An owl lands without a sound at all.", kind: "satz", stufen: ALLE_DREI },
  { text: "The dog knows the hour before we do.", kind: "satz", stufen: ALLE_DREI },
  { text: "A hedgehog folds itself into a ball.", kind: "satz", stufen: ALLE_DREI },

  // ---- Alltag Erwachsene: Arbeit, Wege, Wartezeiten ----
  { text: "The old office is cold in the morning.", kind: "satz", stufen: TEENS_ERW },
  { text: "The coffee machine is broken again.", kind: "satz", stufen: TEENS_ERW },
  { text: "A short letter can hold a long thought.", kind: "satz", stufen: ALLE_DREI },
  { text: "The last hour of the week comes at a crawl.", kind: "satz", stufen: TEENS_ERW },
  { text: "An honest no is kinder than a false hint.", kind: "satz", stufen: ALLE_DREI },
  { text: "The best notes are the shortest ones.", kind: "satz", stufen: ALLE_DREI },
  { text: "One good idea beats ten loud ones.", kind: "satz", stufen: ALLE_DREI },
  { text: "A crowded train is a school in manners.", kind: "satz", stufen: TEENS_ERW },
  { text: "An old road knows more than a new sign.", kind: "satz", stufen: ALLE_DREI },
  { text: "We tend to talk when we should listen.", kind: "satz", stufen: ALLE_DREI },
  { text: "Time in a long line is time to think.", kind: "satz", stufen: TEENS_ERW },
  { text: "A cold room makes a warm coat honest.", kind: "satz", stufen: ALLE_DREI },
  { text: "The desk is clear and the mind is not.", kind: "satz", stufen: TEENS_ERW },
  { text: "The first thing to do is the hardest one.", kind: "satz", stufen: ALLE_DREI },
  { text: "A short walk before the meeting works wonders.", kind: "satz", stufen: TEENS_ERW },
  { text: "The letter is short and the answer is shorter.", kind: "satz", stufen: TEENS_ERW },
  { text: "An old friend calls and the hour is gone.", kind: "satz", stufen: ALLE_DREI },
  { text: "We meet at noon, at the door, in the rain.", kind: "satz", stufen: ALLE_DREI },
  { text: "The bill comes at the end of the month.", kind: "satz", stufen: TEENS_ERW },
  { text: "A late train ruins a good idea.", kind: "satz", stufen: TEENS_ERW },
  { text: "The last one out cuts the light.", kind: "satz", stufen: TEENS_ERW },
  { text: "The old clock in the hall runs ahead.", kind: "satz", stufen: ALLE_DREI },
  { text: "Nothing is louder than a machine that should be off.", kind: "satz", stufen: TEENS_ERW },
  { text: "The best chair in the room is the one no one wants.", kind: "satz", stufen: TEENS_ERW },
  { text: "Coffee is a mild form of morning courage.", kind: "satz", stufen: TEENS_ERW },
  { text: "The shortest meeting on record was called off.", kind: "satz", stufen: TEENS_ERW },
  { text: "A door that sticks in winter is honest about it.", kind: "satz", stufen: TEENS_ERW },
  { text: "The last mail of the month is the loudest one.", kind: "satz", stufen: TEENS_ERW },
  { text: "The room is booked and no one comes.", kind: "satz", stufen: TEENS_ERW },
  { text: "A slow morning can hold a whole month.", kind: "satz", stufen: TEENS_ERW },
];
