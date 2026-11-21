/**
 * ENGLISCHE T3-Charge II (Textwelt-Nachlage §9, englische Seite) — 60 weitere
 * selbst verfasste Zeilen mit vollem Alphabet, Schwerpunkt Kinder- und
 * Jugendstufen: Schulalltag, Sport, Tiere, Technik, Reisen, kleine Beobachtungen.
 * Ergänzt die erste T3-Charge (die stärker auf erwachsene Lernende zielt).
 *
 * Rechte (§10): eigenes Werk, keine Übersetzung der deutschen Bausteine.
 * Fakten sind unstrittig wahr und ohne Messwerte formuliert.
 * Apostrophe vermieden. Append-only an CORPUS_EN → Ledger-Indizes stabil.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
export const EN_T3B_CORPUS: CorpusItem[] = [
  // ---- Schulalltag ----
  { text: "The pencil case holds everything except a pencil.", kind: "satz", stufen: KIDS_TEENS },
  { text: "My homework was perfect until I opened the bag.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The physics lesson explains why the ball bounces.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Every group project has one very quiet member.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The playground empties in exactly seven seconds.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The projector works only when nobody watches.", kind: "satz", stufen: KIDS_TEENS },
  { text: "My favourite subject changes every single term.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The quiz was easy, apart from question twelve.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The library copy is full of notes from a stranger.", kind: "satz", stufen: ALLE_DREI },
  { text: "The school play needs seven trees and one prince.", kind: "satz", stufen: KIDS_TEENS },

  // ---- Sport und Bewegung ----
  { text: "The goalkeeper jumps the wrong way, twice.", kind: "satz", stufen: KIDS_TEENS },
  { text: "My legs remember the hill for two whole days.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The swimming pool smells like a chemistry lesson.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Every player claims the ball was already out.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The prize is a plastic cup and endless glory.", kind: "satz", stufen: KIDS_TEENS },
  { text: "My bicycle squeaks in exactly one gear.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The referee explains nothing and everybody nods.", kind: "satz", stufen: ALLE_DREI },
  { text: "We practise the same move until it looks lazy.", kind: "satz", stufen: KIDS_TEENS },

  // ---- Tiere ----
  { text: "The puppy carries my sock like a proud trophy.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A magpie collects anything that catches the light.", kind: "satz", stufen: ALLE_DREI },
  { text: "The kitten attacks a shadow and wins.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Every squirrel in the park expects payment.", kind: "satz", stufen: ALLE_DREI },
  { text: "The pony ignores me until I show the apple.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A wasp joins the picnic and clears the table.", kind: "satz", stufen: ALLE_DREI },
  { text: "The parrot repeats exactly the wrong sentence.", kind: "satz", stufen: ALLE_DREI },
  { text: "A lizard on the wall freezes and hopes.", kind: "satz", stufen: ALLE_DREI },

  // ---- Technik und Alltag ----
  { text: "The battery dies precisely at the exciting part.", kind: "satz", stufen: ALLE_DREI },
  { text: "My headphones tie themselves into a puzzle.", kind: "satz", stufen: ALLE_DREI },
  { text: "The password I invented yesterday is already gone.", kind: "satz", stufen: ALLE_DREI },
  { text: "Every zip on a jacket has its own opinion.", kind: "satz", stufen: ALLE_DREI },
  { text: "The keyboard is quiet, my typing is not.", kind: "satz", stufen: ALLE_DREI },
  { text: "A photo never shows how big the mountain was.", kind: "satz", stufen: ALLE_DREI },
  { text: "The map is perfect except for the last corner.", kind: "satz", stufen: ALLE_DREI },
  { text: "My alarm and I have very different plans.", kind: "satz", stufen: ALLE_DREI },

  // ---- Reisen ----
  { text: "The suitcase weighs exactly one book too much.", kind: "satz", stufen: ALLE_DREI },
  { text: "Every journey begins with a forgotten jacket.", kind: "satz", stufen: ALLE_DREI },
  { text: "The window seat pays for the whole trip.", kind: "satz", stufen: ALLE_DREI },
  { text: "A quiet village looks bigger on the map.", kind: "satz", stufen: ALLE_DREI },
  { text: "The ferry leaves exactly when we arrive.", kind: "satz", stufen: ALLE_DREI },
  { text: "My phone knows six languages and no manners.", kind: "satz", stufen: ALLE_DREI },

  // ---- Kleine Beobachtungen ----
  { text: "The zebra pattern on the road fades every winter.", kind: "satz", stufen: ALLE_DREI },
  { text: "A puddle is a very short-lived lake.", kind: "satz", stufen: ALLE_DREI },
  { text: "The pizza box is always slightly too big.", kind: "satz", stufen: ALLE_DREI },
  { text: "My jumper shrank, or possibly I did not.", kind: "satz", stufen: ALLE_DREI },
  { text: "Every queue moves except the one you picked.", kind: "satz", stufen: ALLE_DREI },
  { text: "The lazy afternoon light makes everything kinder.", kind: "satz", stufen: ALLE_DREI },
  { text: "A yawn crosses the room faster than any joke.", kind: "satz", stufen: ALLE_DREI },
  { text: "The pigeon on the bench owns the whole square.", kind: "satz", stufen: ALLE_DREI },

  // ---- Fakten (geprüft) ----
  { text: "Zebras can gallop within an hour of being born.", kind: "fakt", stufen: ALLE_DREI },
  { text: "A dragonfly can fly backwards as well as forwards.", kind: "fakt", stufen: ALLE_DREI },
  { text: "Polar bears have black skin under white fur.", kind: "fakt", stufen: ALLE_DREI },
  { text: "A group of crows is called a murder.", kind: "fakt", stufen: ALLE_DREI },
  { text: "Kangaroos cannot walk backwards at all.", kind: "fakt", stufen: ALLE_DREI },
  { text: "The platypus lays eggs although it is a mammal.", kind: "fakt", stufen: ALLE_DREI },
  { text: "A jellyfish has no brain, no bones and no heart.", kind: "fakt", stufen: ALLE_DREI },
  { text: "Cows can walk up stairs far better than down.", kind: "fakt", stufen: ALLE_DREI },
  { text: "A crocodile cannot stick out its tongue.", kind: "fakt", stufen: ALLE_DREI },
  { text: "Bamboo is a grass, not a tree.", kind: "fakt", stufen: ALLE_DREI },
  { text: "Honey found in ancient jars was still edible.", kind: "fakt", stufen: ALLE_DREI },
  { text: "A snowflake needs a speck of dust to begin.", kind: "wissen", stufen: ALLE_DREI },
];
