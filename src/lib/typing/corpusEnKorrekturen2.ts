/**
 * TN-E13 (Rest-Charge, 27.07.2026) — die letzten beiden englischen Befunde des
 * Prüfberichts vom 27.07.: Apostroph-Zeilen und amerikanische Schreibungen.
 *
 * 1. APOSTROPHE (16 Zeilen): Seit TN-E0c ist der Apostroph ein „hartes"
 *    Zeichen — die Zeilen werden also nicht mehr als „dont" verstümmelt,
 *    erscheinen dafür aber erst ganz spät (Apostroph ist eine der letzten
 *    Tasten). Hier stehen sie ohne Apostroph: gleiche Pointe, viel früher
 *    verfügbar. Vollformen statt Kontraktionen, Genitiv umgestellt
 *    („the heart of a shrimp" statt „a shrimp's heart").
 * 2. AMERIKANISCHE SCHREIBUNGEN: §10 legt britisches Englisch als
 *    Leitvarietät fest (Schulstandard in Österreich). Betroffen waren
 *    favorite/color/vacation/realized und die metrischen Einheiten
 *    (meter/liter/centimeters/kilometer) sowie „elevator".
 *    NICHT geändert: „fall" (dort überall das Verb, kein Amerikanismus),
 *    „truck" (im Zungenbrecher lautlich tragend) und „cookies" (trägt die
 *    Pointe „What kind of keys are sweet?").
 *
 * Append-only: Altfassungen in `corpusDeactivatedEn.ts` stillgelegt.
 */
import type { CorpusItem, CorpusKind, Herkunft } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
const TEENS_ERW: Stufe[] = ["teens", "erwachsen"];
const NUR_ERW: Stufe[] = ["erwachsen"];
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

const it = (text: string, kind: CorpusKind, stufen: Stufe[]): CorpusItem => ({
  text,
  kind,
  stufen,
  herkunft: EIGEN,
});

/** Ohne Apostroph — gleiche Pointe, deutlich früher tippbar. */
const OHNE_APOSTROPH: CorpusItem[] = [
  it("What does a snowman have for breakfast? Snowflakes.", "witz", KIDS_TEENS),
  it("Skeletons never fight each other. They do not have the guts.", "witz", KIDS_TEENS),
  it("The gym had to close down. It just did not work out.", "witz", KIDS_TEENS),
  it("You cannot trust an atom. They make up everything.", "witz", TEENS_ERW),
  it("Scientists never trust stairs. They are always up to something.", "witz", TEENS_ERW),
  it("The best thing about Switzerland? Hard to say, but the flag is a big plus.", "witz", TEENS_ERW),
  it("I told my computer I needed a break. Now it sends me holiday ads.", "witz", TEENS_ERW),
  it("I would tell you a chemistry joke, but I would not get a reaction.", "witz", TEENS_ERW),
  it("My plants are very low maintenance. Plastic needs no water.", "witz", NUR_ERW),
  it("The human brain uses about a fifth of all the energy in the body.", "fakt", TEENS_ERW),
  it("Cows wear bells because their horns do not work.", "witz", KIDS_TEENS),
  it("The favourite game of a tornado is Twister.", "witz", KIDS_TEENS),
  it("Eggs never tell jokes. They would crack each other up.", "witz", KIDS_TEENS),
  it("The favourite fruit of a scarecrow is straw-berries.", "witz", KIDS_TEENS),
  it("My calendar said meeting at noon. I was still not ready by then.", "witz", NUR_ERW),
  it("The heart of a shrimp sits in its head.", "fakt", KIDS_TEENS),
];

/** Britische Schreibungen (§10-Leitvarietät). */
const BRITISCH: CorpusItem[] = [
  it("What is brown, hairy and wears sunglasses? A coconut on holiday.", "witz", KIDS_TEENS),
  it("I have a lot of growing up to do. I realised this at the office today.", "witz", NUR_ERW),
  it("A rainbow has many colours lined up next to each other.", "wissen", KIDS_TEENS),
  it("100 centimetres make one metre.", "rechnung", TEENS_ERW),
  it("1000 metres make one kilometre.", "rechnung", TEENS_ERW),
  it("1000 millilitres make one litre.", "rechnung", TEENS_ERW),
  it("Which colour does a cat like best? Purrple!", "witz", KIDS_TEENS),
  it("Lift jokes are the best. They work on many levels.", "witz", TEENS_ERW),
  it("The moon moves a few centimetres farther from Earth every year.", "fakt", KIDS_TEENS),
  it("The Eiffel Tower can be a few centimetres taller in summer heat.", "fakt", KIDS_TEENS),
];

export const EN_KORREKTUR2_CORPUS: CorpusItem[] = [...OHNE_APOSTROPH, ...BRITISCH];
