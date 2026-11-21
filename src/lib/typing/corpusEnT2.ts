/**
 * ENGLISCHE T2-Charge I (Textwelt-Nachlage §9, englische Seite) — 60 selbst
 * verfasste Alltags-Sätze GENAU im T2-Zeichensatz: Küche, Familie, Schule,
 * Markt, Haustiere, Gefühle. Sie bringen Masse dorthin, wo im Englischen bisher
 * fast nichts servierbar war (≤T2 für Stufe a: 89 Zeilen im Alt-Bestand).
 *
 * KEINE Übersetzung der deutschen Chargen: eigene englische Szenen mit
 * englischem Satzbau und englischen Namen.
 *
 * Rechte (§10): eigenes Werk. Keine Zahlen/Fakten → kein Faktencheck nötig.
 *
 * T2-Zeichensatz (aus tiers.ts, kumulativ): a b c d e f g h i j k l m n o r s t u w
 * — KEIN p q v x y z. Für das Englische heißt das konkret: kein „you", „day",
 * „very", „have", „people", „up", „play", „every", „my", „they". Erlaubt sind
 * dagegen „the", „he", „she", „we", „to", „of", „our", „how", „not", „was".
 * Satzzeichen sind weglassbar und heben den Tier nicht. Apostrophe werden
 * vermieden (fitText streicht sie unter T5 ersatzlos).
 *
 * Append-only an CORPUS_EN gehängt → Ledger-Indizes stabil. Die Tier-Grenze
 * erzwingt `typing-english-masse`.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

/** Kinder-/Jugendstufen. */
const KIDS_TEENS: Stufe[] = ["kids", "teens"];
// TN-E8: Zeilen mit seltenem Vokabular („nettles", „flint", „dear"=teuer)
// verlassen die Anfänger-Stufe a — für Fremdsprachen-Lernende im ersten Jahr
// sind sie kein Anfängertext (Prüfbericht 27.07.). Für b/c bleiben sie: dort
// sind sie hübsch. Kein Eintrag wird gelöscht ⇒ Ledger-Indizes stabil.
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
/** Altersneutrale Szenen — für JEDE Stufe passend. */
export const EN_T2_CORPUS: CorpusItem[] = [
  // ---- Küche, Haus, Morgen ----
  { text: "The bread is still warm.", kind: "satz", stufen: ALLE_DREI },
  { text: "A cat sits like a soft loaf.", kind: "satz", stufen: ALLE_DREI },
  { text: "The clock on the wall ticks too loud.", kind: "satz", stufen: ALLE_DREI },
  { text: "Mother stirs the broth and hums.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Grandmother knits a warm scarf.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Father cuts the bread and hands it around.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The kitchen smells of hot butter.", kind: "satz", stufen: ALLE_DREI },
  { text: "The little brother builds a tall tower.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A friend rings at the front door.", kind: "satz", stufen: ALLE_DREI },
  { text: "Our new house has a crooked front door.", kind: "satz", stufen: ALLE_DREI },
  { text: "The window is full of morning light.", kind: "satz", stufen: ALLE_DREI },
  { text: "We wind the clock before bed.", kind: "satz", stufen: ALLE_DREI },
  { text: "The last light goes out at nine.", kind: "satz", stufen: ALLE_DREI },
  { text: "An old blanket smells of the mountains.", kind: "satz", stufen: ALLE_DREI },
  { text: "The room feels darker without a light.", kind: "satz", stufen: ALLE_DREI },

  // ---- Schule ----
  { text: "The children run home from school.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The teacher writes with white chalk.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The class is loud and then it is still.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Todd counts to a hundred without a mistake.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The old school clock is often slow.", kind: "satz", stufen: KIDS_TEENS },
  { text: "We wash the dishes and no one groans.", kind: "satz", stufen: KIDS_TEENS },

  // ---- Markt, Essen ----
  { text: "The market on the corner is loud and bright.", kind: "satz", stufen: ALLE_DREI },
  { text: "An orange rolls under the market table.", kind: "satz", stufen: ALLE_DREI },
  { text: "The baker hands out warm rolls.", kind: "satz", stufen: ALLE_DREI },
  { text: "The cold milk tastes fine with the cake.", kind: "satz", stufen: KIDS_TEENS },
  { text: "We eat cold chicken and warm bread.", kind: "satz", stufen: ALLE_DREI },
  { text: "The cheese sits in the sun and sweats.", kind: "satz", stufen: ALLE_DREI },
  { text: "There is no cake left, not one crumb.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The broth is hot and the room is cold.", kind: "satz", stufen: ALLE_DREI },
  { text: "A red mug stands beside a blue one.", kind: "satz", stufen: ALLE_DREI },
  { text: "The kettle is loud in the small kitchen.", kind: "satz", stufen: ALLE_DREI },
  { text: "We toast the bread until it is brown.", kind: "satz", stufen: ALLE_DREI },

  // ---- Tiere ----
  { text: "There is a small hole in the red sock.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The dog hides the ball under the chair.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A brown mouse hides under the shed.", kind: "satz", stufen: ALLE_DREI },
  { text: "The cat and the dog share a warm blanket.", kind: "satz", stufen: ALLE_DREI },
  { text: "The chicken chased the school cat.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A duck marches across the road.", kind: "satz", stufen: ALLE_DREI },
  { text: "The horse eats an old carrot.", kind: "satz", stufen: ALLE_DREI },
  { text: "Two white lambs stand in the field.", kind: "satz", stufen: ALLE_DREI },
  { text: "The goat has stolen a hat.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A rabbit hides behind the bin.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The hen is louder than the alarm clock.", kind: "satz", stufen: ALLE_DREI },
  { text: "The cat watches the fish and thinks.", kind: "satz", stufen: ALLE_DREI },
  { text: "A big brown owl calls in the dark.", kind: "satz", stufen: ALLE_DREI },
  { text: "The dog nods off in the sun.", kind: "satz", stufen: ALLE_DREI },

  // ---- Draußen, unterwegs ----
  { text: "Buckets of rain hit the roof at night.", kind: "satz", stufen: ALLE_DREI },
  { text: "The children build a boat out of a crate.", kind: "satz", stufen: KIDS_TEENS },
  { text: "We found a coin between the stones.", kind: "satz", stufen: ALLE_DREI },
  { text: "The ball rolls into the tall grass.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A red car honks at the crossing.", kind: "satz", stufen: ALLE_DREI },
  { text: "The bus comes late and comes twice.", kind: "satz", stufen: ALLE_DREI },
  { text: "The train is on the far side of the hill.", kind: "satz", stufen: ALLE_DREI },
  { text: "The old bike still ticks like a clock.", kind: "satz", stufen: ALLE_DREI },

  // ---- Gefühle ----
  { text: "The child is not tired and not cold.", kind: "satz", stufen: KIDS_TEENS },
  { text: "It is hard to wait when the cake is hot.", kind: "satz", stufen: KIDS_TEENS },
  { text: "After the fight, the friends laugh again.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A cold hand looks for a warm one.", kind: "satz", stufen: ALLE_DREI },
  { text: "The lost dog is home at last.", kind: "satz", stufen: KIDS_TEENS },
  { text: "It is fine to feel a little afraid.", kind: "satz", stufen: KIDS_TEENS },
];
