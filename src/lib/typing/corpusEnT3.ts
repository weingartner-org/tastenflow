/**
 * ENGLISCHE T3-Charge (Textwelt-Nachlage §9, englische Seite) — 60 selbst
 * verfasste Zeilen mit dem VOLLEN Alphabet: Alltagsszenen, trockener Humor für
 * ältere Lernende sowie geprüfte Tier- und Naturfakten. Diese Ebene lädt gezielt
 * die seltenen Tasten `p q v x y z`, die in den T1/T2-Chargen bauartbedingt
 * fehlen.
 *
 * Rechte (§10): eigenes Werk (selbst verfasst), keine Übersetzung der deutschen
 * Bausteine.
 *
 * Faktencheck: Alle `fakt`- und `wissen`-Zeilen sind unstrittig wahr und bewusst
 * ohne Jahreszahlen/Messwerte formuliert (die bräuchten T5 und veralten). Sie
 * wurden gegen den Bestand entdoppelt.
 *
 * Apostrophe werden vermieden (fitText streicht sie unter T5 ersatzlos, aus
 * „do not" würde sonst „dont"). Append-only an CORPUS_EN → Ledger-Indizes stabil.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
const TEENS_ERW: Stufe[] = ["teens", "erwachsen"];
export const EN_T3_CORPUS: CorpusItem[] = [
  // ---- Alltag, Kinder und Familie ----
  { text: "The puppy chews everything except its own toy.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Every autumn the same tree surprises the street.", kind: "satz", stufen: ALLE_DREI },
  { text: "My neighbour paints his fence every spring.", kind: "satz", stufen: ALLE_DREI },
  { text: "The playground is loudest just before dinner.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A puzzle piece always hides exactly where you looked twice.", kind: "satz", stufen: ALLE_DREI },
  { text: "Twenty pupils, one pencil sharpener, endless queue.", kind: "satz", stufen: ALLE_DREI },
  { text: "The vacuum cleaner wakes everybody except the cat.", kind: "satz", stufen: ALLE_DREI },
  { text: "Grandpa explains the recipe by waving his hands.", kind: "satz", stufen: KIDS_TEENS },
  { text: "The bakery opens before the birds wake up.", kind: "satz", stufen: ALLE_DREI },
  { text: "A yellow umbrella brightens a grey morning.", kind: "satz", stufen: ALLE_DREI },
  { text: "The village square fills up on a market day.", kind: "satz", stufen: ALLE_DREI },
  { text: "My keys are always in the last pocket.", kind: "satz", stufen: ALLE_DREI },
  { text: "The zebra crossing is empty at seven.", kind: "satz", stufen: ALLE_DREI },
  { text: "The yellow taxi stops exactly where the puddle is deepest.", kind: "satz", stufen: ALLE_DREI },
  { text: "The zip on my jacket has given up completely.", kind: "satz", stufen: ALLE_DREI },
  { text: "My phone knows the way home better than I do.", kind: "satz", stufen: ALLE_DREI },
  { text: "The lazy afternoon melts into a very slow evening.", kind: "satz", stufen: ALLE_DREI },

  // ---- Trockener Alltag, ältere Lernende ----
  { text: "The library keeps the quiet that the city lost.", kind: "satz", stufen: TEENS_ERW },
  { text: "Nobody enjoys the queue, yet everybody joins it.", kind: "satz", stufen: TEENS_ERW },
  { text: "The pizza arrives exactly when the phone rings.", kind: "satz", stufen: TEENS_ERW },
  { text: "A jazz band plays badly and everyone claps.", kind: "satz", stufen: TEENS_ERW },
  { text: "Everybody helps once the box is already carried.", kind: "satz", stufen: TEENS_ERW },
  { text: "The printer jams only when you are in a hurry.", kind: "satz", stufen: TEENS_ERW },
  { text: "A quiet colleague often knows the most.", kind: "satz", stufen: TEENS_ERW },
  { text: "The project looks simple on the first page.", kind: "satz", stufen: TEENS_ERW },
  { text: "Experience is what you get just after you needed it.", kind: "satz", stufen: TEENS_ERW },
  { text: "The inbox never gets emptier by looking at it.", kind: "satz", stufen: TEENS_ERW },
  { text: "A calendar is a list of things you already forgot.", kind: "satz", stufen: TEENS_ERW },
  { text: "The best meeting is the one that gets cancelled.", kind: "satz", stufen: TEENS_ERW },
  { text: "Coffee explains why the morning happens at all.", kind: "satz", stufen: TEENS_ERW },
  { text: "My plants forgive me more than my inbox does.", kind: "satz", stufen: TEENS_ERW },
  { text: "The last bus waits for nobody except my neighbour.", kind: "satz", stufen: TEENS_ERW },

  // ---- Tierfakten (geprüft) ----
  { text: "A honeybee visits many flowers for one drop of honey.", kind: "fakt", stufen: ALLE_DREI },
  { text: "Owls can turn their heads much further than we can.", kind: "fakt", stufen: ALLE_DREI },
  { text: "A snail carries its house wherever it goes.", kind: "fakt", stufen: ALLE_DREI },
  { text: "Squirrels forget where many of their nuts are buried.", kind: "fakt", stufen: ALLE_DREI },
  { text: "A hedgehog can have several thousand spines.", kind: "fakt", stufen: ALLE_DREI },
  { text: "Frogs breathe partly through their moist skin.", kind: "fakt", stufen: ALLE_DREI },
  { text: "A woodpecker hammers to mark its own territory.", kind: "fakt", stufen: ALLE_DREI },
  { text: "Foxes hunt alone, but wolves hunt in a pack.", kind: "fakt", stufen: ALLE_DREI },
  { text: "Penguins cannot fly, yet they swim extremely well.", kind: "fakt", stufen: ALLE_DREI },
  { text: "A camel stores fat in its hump, not water.", kind: "fakt", stufen: ALLE_DREI },
  { text: "Bats find their way in the dark by listening.", kind: "fakt", stufen: ALLE_DREI },
  { text: "A starfish can regrow a lost arm.", kind: "fakt", stufen: ALLE_DREI },
  { text: "Whales must come to the surface to breathe.", kind: "fakt", stufen: ALLE_DREI },
  { text: "Swifts can stay in the air for months at a time.", kind: "fakt", stufen: ALLE_DREI },

  // ---- Wissen (Natur, Physik, Alltagstechnik) ----
  { text: "Water expands when it freezes, which is why ice floats.", kind: "wissen", stufen: ALLE_DREI },
  { text: "Lightning heats the air so fast that it cracks.", kind: "wissen", stufen: ALLE_DREI },
  { text: "The moon always shows us the same face.", kind: "wissen", stufen: ALLE_DREI },
  { text: "Rainbows appear when sunlight is bent by raindrops.", kind: "wissen", stufen: ALLE_DREI },
  { text: "Roots pull water upwards through the whole plant.", kind: "wissen", stufen: ALLE_DREI },
  { text: "Rust is simply iron slowly joining with oxygen.", kind: "wissen", stufen: TEENS_ERW },
  { text: "A compass needle points towards the magnetic north.", kind: "wissen", stufen: ALLE_DREI },
  { text: "Deserts can be freezing cold once the sun goes down.", kind: "wissen", stufen: ALLE_DREI },
  { text: "Volcanic ash makes the surrounding soil very fertile.", kind: "wissen", stufen: TEENS_ERW },
  { text: "Glaciers move, just far too slowly for us to notice.", kind: "wissen", stufen: TEENS_ERW },
  { text: "Sound needs matter to travel, so space stays silent.", kind: "wissen", stufen: ALLE_DREI },
  { text: "Yeast makes dough rise by producing gas bubbles.", kind: "wissen", stufen: ALLE_DREI },
  { text: "Sea water freezes at a lower temperature than fresh water.", kind: "wissen", stufen: TEENS_ERW },
  { text: "Our bones keep rebuilding themselves throughout life.", kind: "wissen", stufen: TEENS_ERW },
];
