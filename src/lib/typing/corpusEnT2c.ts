/**
 * ENGLISCHE T2-Charge III (Textwelt-Nachlage §9, englische Seite) — 60 weitere
 * selbst verfasste T2-Zeilen, Schwerpunkt Kinder-/Jugendstufen: Garten und Hof,
 * Sport und Spiele, Musik und Basteln, Hafen und Boot, Abend und Schlafengehen.
 *
 * Warum eine dritte T2-Charge: Für Stufe a waren ≤T2 im Alt-Bestand nur 89
 * Zeilen servierbar (Deutsch: 507). Genau hier entsteht der Eindruck „es
 * wiederholt sich" — die frühen Tasten brauchen Masse.
 *
 * Rechte (§10): eigenes Werk. T2-Zeichensatz: a b c d e f g h i j k l m n o r s t u w
 * — KEIN p q v x y z (also auch kein „play", „help", „family", „every", „day").
 * Apostrophe vermieden. Append-only an CORPUS_EN → Ledger-Indizes stabil.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
export const EN_T2C_CORPUS: CorpusItem[] = [
  // ---- Garten und Hof ----
  { text: "The first green shoots break the dark soil.", kind: "satz", stufen: ALLE_DREI },
  { text: "Anna waters the beans and counts them.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The old hedge is full of small birds.", kind: "satz", stufen: ALLE_DREI },
  { text: "Weeds grow faster than the carrots.", kind: "satz", stufen: ALLE_DREI },
  { text: "The garden gate creaks and then shuts.", kind: "satz", stufen: ALLE_DREI },
  { text: "A worm works harder than the gardener.", kind: "satz", stufen: ALLE_DREI },
  { text: "The tomatoes are still hard and green.", kind: "satz", stufen: ALLE_DREI },
  { text: "Sam brushes the mud from his boots.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The cow looks at us and chews on.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The barn door is loose in the wind.", kind: "satz", stufen: ALLE_DREI },
  { text: "The hens march to the shed at dusk.", kind: "satz", stufen: ALLE_DREI },
  { text: "A goose is bolder than a dog.", kind: "satz", stufen: ALLE_DREI },

  // ---- Sport und Spiele ----
  { text: "The ball hits the crossbar and comes back.", kind: "satz", stufen: KIDS_TEENS },
  { text: "We won the match in the last minute.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The teams change ends after an hour.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nina runs the last round with a red face.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The football rolls into the neighbour garden.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Our team is loud and not fast.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The board game ends in one big argument.", kind: "satz", stufen: KIDS_TEENS },
  { text: "It is hard to lose four times in a row.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The dice roll under the couch again.", kind: "satz", stufen: KIDS_TEENS },
  { text: "We are ten and we need one more.", kind: "satz", stufen: KIDS_TEENS },

  // ---- Musik und Basteln ----
  { text: "The drum is louder than the whole band.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Tom learns three chords and hums along.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The old guitar has one broken string.", kind: "satz", stufen: ALLE_DREI },
  { text: "We sang the same song ten times.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The glue is on the table and on the cat.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Anna cuts a star out of thin card.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The blue chalk broke into three bits.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The finished lantern shines like a small moon.", kind: "satz", stufen: KIDS_TEENS },

  // ---- Hafen, Boot, Wasser ----
  { text: "The boat is small and the sea is not.", kind: "satz", stufen: ALLE_DREI },
  { text: "The old net hangs stiff in the wind.", kind: "satz", stufen: ALLE_DREI },
  { text: "The anchor line runs out and holds.", kind: "satz", stufen: ALLE_DREI },
  { text: "We count the boats coming into the harbour.", kind: "satz", stufen: ALLE_DREI },
  { text: "The water in the bucket is cold and clear.", kind: "satz", stufen: ALLE_DREI },
  { text: "A fish comes near the boat and is gone.", kind: "satz", stufen: ALLE_DREI },
  { text: "The dock smells of salt and old wood.", kind: "satz", stufen: ALLE_DREI },
  { text: "The stone skims three times on the water.", kind: "satz", stufen: KIDS_TEENS },

  // ---- Ausflug und Wanderung ----
  { text: "The road bends and the hill comes into sight.", kind: "satz", stufen: ALLE_DREI },
  { text: "We walk on and the town looks small behind us.", kind: "satz", stufen: ALLE_DREI },
  { text: "The last hill was the hardest one.", kind: "satz", stufen: ALLE_DREI },
  { text: "Our socks are wet and no one minds.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The bread in the bag is a bit late.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A cold stream runs across the small track.", kind: "satz", stufen: ALLE_DREI },
  { text: "The wind turns and we turn with it.", kind: "satz", stufen: ALLE_DREI },
  { text: "The forest smells of rain and old wood.", kind: "satz", stufen: ALLE_DREI },

  // ---- Abend, Nacht, Schlafengehen ----
  { text: "The light in the hall shines warm and low.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The house cools down and ticks once more.", kind: "satz", stufen: ALLE_DREI },
  { text: "Mother reads three lines and then it is dark.", kind: "satz", stufen: ["kids"] },
  { text: "The cat lands on the bed and stretches out.", kind: "satz", stufen: KIDS_TEENS },
  { text: "It is not the moon, it is the street light.", kind: "satz", stufen: ALLE_DREI },
  { text: "The door is shut but the hall is not dark.", kind: "satz", stufen: KIDS_TEENS },
  { text: "One last cold drink and it is late.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The clock in the kitchen is the loudest thing at night.", kind: "satz", stufen: ALLE_DREI },
  { text: "The last car went out and left it still.", kind: "satz", stufen: ALLE_DREI },
  { text: "The warm blanket forgets it was cold.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The rain drums on and no one gets out of bed.", kind: "satz", stufen: ALLE_DREI },
  { text: "Tomorrow will not be like this one.", kind: "satz", stufen: ALLE_DREI },
  { text: "The night bird calls once and is done.", kind: "satz", stufen: ALLE_DREI },
];
