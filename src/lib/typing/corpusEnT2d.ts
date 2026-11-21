/**
 * ENGLISCHE T2-Charge IV (Textwelt-Nachlage §9, englische Seite) — 60 weitere
 * selbst verfasste T2-Zeilen: Stadt und Laden, Feste und Jahreslauf, Freunde und
 * Schulausflug, Wetterabenteuer, Kochen und Essen. Wieder ANDERE Szenen als die
 * Chargen I–III, damit die frühe Ebene nicht thematisch monoton wird.
 *
 * Rechte (§10): eigenes Werk. T2-Zeichensatz ohne p q v x y z.
 * Append-only an CORPUS_EN → Ledger-Indizes stabil.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
const TEENS_ERW: Stufe[] = ["teens", "erwachsen"];
export const EN_T2D_CORPUS: CorpusItem[] = [
  // ---- Stadt und Laden ----
  { text: "The tram turns the corner much too fast.", kind: "satz", stufen: ALLE_DREI },
  { text: "There is a long line at the bread counter.", kind: "satz", stufen: ALLE_DREI },
  { text: "The old bookstore has one narrow door.", kind: "satz", stufen: ALLE_DREI },
  { text: "The traffic light turns green for no one.", kind: "satz", stufen: ALLE_DREI },
  { text: "A street musician wins the whole corner.", kind: "satz", stufen: ALLE_DREI },
  { text: "The church clock strikes an hour too late.", kind: "satz", stufen: ALLE_DREI },
  { text: "The market closes and the birds come in.", kind: "satz", stufen: ALLE_DREI },
  { text: "We wait at the bus stand in the cold.", kind: "satz", stufen: ALLE_DREI },
  { text: "The last store on the road sells bread.", kind: "satz", stufen: ALLE_DREI },
  { text: "The bench is wet, so we stand.", kind: "satz", stufen: ALLE_DREI },
  { text: "Our coins are not enough for two.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The stairs at the station are much too long.", kind: "satz", stufen: ALLE_DREI },

  // ---- Jahreslauf und Feste ----
  { text: "The first warm month brings all the birds back.", kind: "satz", stufen: ALLE_DREI },
  { text: "In summer the town smells of hot stone.", kind: "satz", stufen: ALLE_DREI },
  { text: "The autumn rain washes the whole road clean.", kind: "satz", stufen: ALLE_DREI },
  { text: "The winter comes with a cold, clear morning.", kind: "satz", stufen: ALLE_DREI },
  { text: "The house is full of noise and warm bread.", kind: "satz", stufen: KIDS_TEENS },
  { text: "We hang a small torch in the front window.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The cake is done and the candle is lit.", kind: "satz", stufen: KIDS_TEENS },
  { text: "One card comes late and means the most.", kind: "satz", stufen: ALLE_DREI },
  { text: "The last hour before the feast is the longest.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The old lantern comes down from the loft.", kind: "satz", stufen: ALLE_DREI },

  // ---- Freunde und Schulausflug ----
  { text: "The bus is loud and the teacher is calm.", kind: "satz", stufen: KIDS_TEENS },
  { text: "We come back with one shoe full of sand.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The museum is cold and the guard is kind.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ben forgot his lunch and no one made a fuss.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The old castle has a hundred short stairs.", kind: "satz", stufen: KIDS_TEENS },
  { text: "We took a wrong turn and found the best road.", kind: "satz", stufen: ALLE_DREI },
  { text: "The class hut is cold, so we all sing.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A new friend comes with an old joke.", kind: "satz", stufen: ALLE_DREI },
  { text: "The teacher counts us three times at the gate.", kind: "satz", stufen: KIDS_TEENS },
  { text: "It is not a race, but we run.", kind: "satz", stufen: KIDS_TEENS },

  // ---- Wetterabenteuer ----
  { text: "The storm hit the roof and left the ladder.", kind: "satz", stufen: ALLE_DREI },
  { text: "We got home just before the storm came in.", kind: "satz", stufen: ALLE_DREI },
  { text: "The thunder comes late and shakes the door.", kind: "satz", stufen: ALLE_DREI },
  { text: "The hail hit the market roof like small stones.", kind: "satz", stufen: ALLE_DREI },
  { text: "Our coats were wet through in one minute.", kind: "satz", stufen: ALLE_DREI },
  { text: "The fog comes off the water and stands still.", kind: "satz", stufen: ALLE_DREI },
  { text: "Ice on the road turns the hill into a lesson.", kind: "satz", stufen: ALLE_DREI },
  { text: "The snow forms one clean sheet at nine.", kind: "satz", stufen: ALLE_DREI },
  { text: "The sun comes back and no one is calm.", kind: "satz", stufen: ALLE_DREI },
  { text: "A cold wind cuts across the harbour.", kind: "satz", stufen: ALLE_DREI },

  // ---- Kochen und Essen ----
  { text: "The onion wins the argument with the cook.", kind: "satz", stufen: ALLE_DREI },
  { text: "The rice is done but the fish is not.", kind: "satz", stufen: ALLE_DREI },
  { text: "We ate all the bread out of the tin.", kind: "satz", stufen: ALLE_DREI },
  { text: "The stew was hot and the room went still.", kind: "satz", stufen: ALLE_DREI },
  { text: "There is one biscuit left and there are three of us.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The tea was too strong and the cake too small.", kind: "satz", stufen: ALLE_DREI },
  { text: "The butter is hard and the bread is soft.", kind: "satz", stufen: ALLE_DREI },
  { text: "The whole kitchen smells of hot chocolate.", kind: "satz", stufen: ALLE_DREI },
  { text: "The oat cake broke and it was clean.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The cold water tastes best after the hill.", kind: "satz", stufen: ALLE_DREI },
  { text: "We each cook one thing and none of it matches.", kind: "satz", stufen: TEENS_ERW },
  { text: "The lunch on a train is a small feast.", kind: "satz", stufen: TEENS_ERW },
  { text: "The last of the cheese goes to the cat.", kind: "satz", stufen: ALLE_DREI },
  { text: "The dishes wait, then wait a bit more.", kind: "satz", stufen: TEENS_ERW },
  { text: "The old machine wakes the whole house.", kind: "satz", stufen: ALLE_DREI },
  { text: "The bread rose too much and touched the lid.", kind: "satz", stufen: ALLE_DREI },
];
