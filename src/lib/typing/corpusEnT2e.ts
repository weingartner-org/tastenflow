/**
 * ENGLISCHE T2-Charge V (Textwelt-Nachlage §9, englische Seite) — 60 letzte
 * T2-Zeilen dieser Runde, gezielt für Stufe a/b: Märchen und Fantasie, Weltall
 * und Dinosaurier, Mithelfen zu Hause, kleine Missgeschicke. Damit erreicht die
 * englische Seite auf der frühen Ebene eine Masse, die dem deutschen Bestand
 * nahekommt.
 *
 * Rechte (§10): eigenes Werk. T2-Zeichensatz ohne p q v x y z (also kein
 * „dragon cave", kein „prince", kein „play") — die Szenen sind entsprechend
 * getextet, nicht übersetzt.
 * Append-only an CORPUS_EN → Ledger-Indizes stabil.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
// TN-E8: Zeilen mit seltenem Vokabular („nettles", „flint", „dear"=teuer)
// verlassen die Anfänger-Stufe a — für Fremdsprachen-Lernende im ersten Jahr
// sind sie kein Anfängertext (Prüfbericht 27.07.). Für b/c bleiben sie: dort
// sind sie hübsch. Kein Eintrag wird gelöscht ⇒ Ledger-Indizes stabil.
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
export const EN_T2E_CORPUS: CorpusItem[] = [
  // ---- Märchen und Fantasie ----
  { text: "The old castle door swings without a hand.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A small dragon eats one whole loaf.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The unicorn does not care about our names.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The witch has a crooked hat and a much older cat.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The knight is bold, but the horse is bolder.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A gold crown ends in the hands of a mouse.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The troll under the bridge just wants a chat.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The forest hides a hut with three chairs.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The lost treasure is under the loose stone.", kind: "satz", stufen: KIDS_TEENS },
  { text: "One old man in a wood knows all the roads.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The wolf is not the good one in this one.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The ghost in the hall turns out to be a coat.", kind: "satz", stufen: KIDS_TEENS },

  // ---- Weltall und Dinosaurier ----
  { text: "The rocket lifts and the ground shakes.", kind: "satz", stufen: ALLE_DREI },
  { text: "The moon is neither cheese nor a lamb.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A comet comes back after a long time.", kind: "satz", stufen: ALLE_DREI },
  { text: "The astronaut floats and cannot sit down.", kind: "satz", stufen: ALLE_DREI },
  { text: "The earth turns and the shadow turns with it.", kind: "satz", stufen: ALLE_DREI },
  { text: "Mars is red, cold and much smaller than home.", kind: "satz", stufen: ALLE_DREI },
  { text: "The biggest dinosaur ate grass, not lambs.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A stone from another world lands in a field.", kind: "satz", stufen: ALLE_DREI },
  { text: "The old bones tell us more than the books.", kind: "satz", stufen: ALLE_DREI },
  { text: "The star is not there, it was there.", kind: "satz", stufen: ALLE_DREI },

  // ---- Mithelfen zu Hause ----
  { text: "It is our turn to sort the socks.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The bin bag broke on the last three stairs.", kind: "satz", stufen: KIDS_TEENS },
  { text: "We fold the shirts and the cat unfolds them.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The broom is taller than the small brother.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Someone has to hold the ladder, and it is me.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The mud comes off the floor, then off us.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The letters go out and the milk comes in.", kind: "satz", stufen: KIDS_TEENS },
  { text: "We made the bed and the room looks new.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The old book crate was much too hard to hold.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The little one carries one thing, and it counts.", kind: "satz", stufen: ["kids"] },

  // ---- Kleine Missgeschicke ----
  { text: "The milk went in before the tea did.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The door shut and the milk stood on the table.", kind: "satz", stufen: ALLE_DREI },
  { text: "The chalk broke, the class laughed, the lesson went on.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The socks match, and neither one is ours.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The cake sank in the middle and tasted fine.", kind: "satz", stufen: ALLE_DREI },
  { text: "The dog got out and came back with a hat.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The bike chain came off at the worst corner.", kind: "satz", stufen: ALLE_DREI },
  { text: "The kettle boiled and no one made the tea.", kind: "satz", stufen: ALLE_DREI },
  { text: "The glue holds, but not where it should.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The chair leg wobbles and the table does not.", kind: "satz", stufen: ALLE_DREI },

  // ---- Mut und Freundschaft ----
  { text: "The first three words are the hardest ones.", kind: "satz", stufen: KIDS_TEENS },
  { text: "It looks a lot smaller once we started.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A friend is someone who comes back an hour later.", kind: "satz", stufen: KIDS_TEENS },
  { text: "We took turns and it was still not fair.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The new one at school sat with us at noon.", kind: "satz", stufen: KIDS_TEENS },
  { text: "It is fine to ask, and better to ask twice.", kind: "satz", stufen: ALLE_DREI },
  { text: "The hardest hill is the one in front of us.", kind: "satz", stufen: ALLE_DREI },
  { text: "One kind word from Sara turned the whole hour.", kind: "satz", stufen: KIDS_TEENS },
  { text: "We are much louder than we are bold.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The mistake is done and the world holds on.", kind: "satz", stufen: ALLE_DREI },

  // ---- Zeit und Geduld ----
  { text: "The tree in front of the door was our own.", kind: "satz", stufen: ALLE_DREI },
  { text: "The seed is small and the winter is long.", kind: "satz", stufen: ALLE_DREI },
  { text: "Nothing much comes out of the first three tries.", kind: "satz", stufen: ALLE_DREI },
  { text: "The clock is slow when we watch it.", kind: "satz", stufen: ALLE_DREI },
  { text: "A week feels short, an hour feels not.", kind: "satz", stufen: ALLE_DREI },
  { text: "The old dog knows how to wait.", kind: "satz", stufen: ALLE_DREI },
  { text: "We come back to the same corner, and it is not the same.", kind: "satz", stufen: ALLE_DREI },
  { text: "The last three lines are done, and it is dark.", kind: "satz", stufen: ALLE_DREI },
];
