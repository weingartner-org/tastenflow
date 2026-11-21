/**
 * ENGLISCHE Serien der Bücherei „Geschichten & Wissen" (Textwelt „Ebene 2",
 * englische Seite). Bisher gab es 23 deutsche Serien und KEINE englische — der
 * Bücherei-Modus war auf Englisch schlicht leer.
 *
 * Drei Pilot-Serien, im Format von serie.ts, mit `lang: "en"` gekennzeichnet:
 *  • „Nell and the Harbour Cat"  — Geschichte, Tier 2, Stufen a/b
 *  • „The Copper Key"            — Geschichte, Tier 3, Stufen b/c
 *  • „Water and Weather"         — Wissens-Serie, Tier 3, Stufen teens/erwachsen
 *
 * Quellen-/Rechte-Regel (Bauplan §10): Alle drei sind SELBST verfasst — echte
 * (auch gemeinfreie) englische Texte respektieren die Buchstaben-Freischaltung
 * nicht. Es sind keine Übersetzungen der deutschen Serien, sondern eigene
 * englische Stoffe.
 *
 * Zeichensatz: „Nell and the Harbour Cat" kommt mit dem T2-Satz aus (a b c d e f
 * g h i j k l m n o r s t u w — KEIN p q v x y z), die beiden anderen nutzen das
 * volle Alphabet (T3). Satzzeichen sind erlaubt (bis T4 weggelassen, heben den
 * Tier nicht). Apostrophe werden vermieden, weil fitText sie unterhalb von T5
 * ersatzlos streicht. Die Wissens-Serie ist faktisch geprüft.
 */
import type { Serie } from "./serie";

/** T2-Erstleser-Geschichte: eine Hafenkatze, die keine Katze bleiben will. */
const NELL_AND_THE_HARBOUR_CAT: Serie = {
  slug: "nell-and-the-harbour-cat",
  titel: "Nell and the Harbour Cat",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids", "teens"],
  minTier: 2,
  topic: "tiere",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst, englisches Original)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Nell is at home at the harbour.",
        "The boats come in near the old wall.",
        "One old cat sits on a crate.",
        "He looks at the fish and not at Nell.",
        "Nell calls him Smudge.",
        "Smudge does not come when he is called.",
        // „fish boat" ist kein Englisch (Prüfbericht 27.07., Teil 2.1).
        "He comes when the fishing boat comes in.",
        "Nell brings a bit of bread.",
        // R2: Die Geschichte erzählt im Präsens; „said" bricht die Zeitform.
        // „says" braucht das y (hier gesperrt), „tells/calls" nicht.
        "Cats do not want bread, the fisherman tells her.",
        "So Nell brings a small fish.",
        "Smudge takes it and does not look back.",
        "Tomorrow, thinks Nell. Tomorrow he will look.",
      ],
    },
    {
      lines: [
        "The morning after, the harbour is loud.",
        "The white boats knock at the wall.",
        "Smudge is not on his crate.",
        "Nell looks behind the nets.",
        "She looks under the fish stand.",
        "The old fisherman shakes his head.",
        "That cat comes and goes, he tells her.",
        "Nell walks to the end of the dock.",
        "There is a cold wind on the water.",
        "Then she hears a small sound.",
        "It comes from the last boat.",
        "Nell holds the rail and looks down.",
      ],
    },
    {
      lines: [
        "Smudge sits in the small boat.",
        "The boat is not at the wall.",
        "It hangs on one thin line.",
        "The wind turns it round and round.",
        "Nell calls, but Smudge does not turn.",
        "The line is old and it is not strong.",
        "Nell runs back and calls the fisherman.",
        "He comes with a long hook.",
        "Hold on there, he tells the cat.",
        "The hook finds the boat and holds.",
        "The old man draws it in, slow and calm.",
        "Nell cannot look and cannot look, and looks.",
      ],
    },
    {
      lines: [
        "The boat comes near the cold stone wall.",
        "Smudge stands and does not like it at all.",
        "One more turn, calls the fisherman.",
        "The boat knocks once and holds still.",
        "Nell holds out both hands.",
        "The cat looks at her, then at the water.",
        "Then he lands in her arms.",
        "He is wet and much smaller than before.",
        "Nell holds him and does not let go.",
        "The old man ties the boat again.",
        "That line was on its last hour, he tells Nell.",
        "Smudge does not care. He is out.",
      ],
    },
    {
      lines: [
        "At home the kitchen is warm.",
        "Smudge sits near the warm cooker.",
        "He does not want bread. He wants fish.",
        "Nell finds one in the cold room.",
        "The cat eats and then he washes.",
        "Then he comes and sits at her feet.",
        "That is the first time, thinks Nell.",
        // Deutsche Fügung „Die Mutter kommt herein" — im Englischen „Her mother"
        // (Prüfbericht 27.07., Teil 2.1).
        "Her mother comes in and looks at them.",
        "Is that the harbour cat, she asks.",
        "He was, Nell tells her. He is not now.",
        "The harbour is loud and the house is not.",
        "Smudge does not stir, and the house is still.",
      ],
    },
  ],
};

/** T3-Geschichte: ein alter Schlüssel, ein verschlossenes Zimmer, ein Rätsel. */
const THE_COPPER_KEY: Serie = {
  slug: "the-copper-key",
  titel: "The Copper Key",
  kind: "geschichte",
  lang: "en",
  stufen: ["kids", "teens"],
  minTier: 3,
  topic: "abenteuer",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst, englisches Original)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "The house had belonged to my aunt.",
        "Nobody had opened it for seven years.",
        "The hall smelled of dust and old paper.",
        "Every window was shut and painted over.",
        "On the kitchen table lay a copper key.",
        "It was heavy and slightly green with age.",
        "There was no label and no note.",
        "I tried it on the front door. Wrong door.",
        "I tried the cellar. Wrong again.",
        "Upstairs there were four rooms.",
        "Three of them stood open.",
        "The fourth had no handle at all.",
      ],
    },
    {
      lines: [
        "A door without a handle is just a wall.",
        "But this wall had a keyhole.",
        "I knelt down and looked through it.",
        "I saw nothing except a strip of light.",
        "The copper key went in halfway and stopped.",
        "So the lock was not empty.",
        "Something was already blocking it.",
        "I went down and found a thin wire.",
        "My aunt kept wire in every single drawer.",
        "Back at the door I worked slowly.",
        "The wire caught, then pushed, then gave.",
        "A small object fell inside with a click.",
      ],
    },
    {
      lines: [
        "This time the key turned without a sound.",
        "The room was smaller than I expected.",
        "One window, painted shut like the others.",
        "A desk, a chair, and a wooden box.",
        "The walls were covered with maps.",
        "Not printed maps. Drawn ones.",
        "Every map showed the same valley.",
        "Each one was dated a different summer.",
        "The oldest was almost fifty years old.",
        "The newest had been finished quite recently.",
        "My aunt had been coming back here.",
        "Long after everybody thought she had stopped.",
      ],
    },
    {
      lines: [
        "The wooden box was not locked.",
        "Inside lay letters, tied with garden string.",
        "All of them were addressed to her.",
        "None of them had ever been opened.",
        "The handwriting was the same on each one.",
        "The postmarks jumped from year to year.",
        "I sat on the floor and read the first.",
        "It was an apology, and a short one.",
        "The second asked whether she was well.",
        "The tenth simply said: I am still here.",
        "The last was dated the spring she died.",
        "It contained a hand-drawn map of the valley.",
      ],
    },
    {
      lines: [
        "The map marked a bridge and a bend.",
        "I drove out there the following morning.",
        "The bridge had been rebuilt twice since.",
        "The bend in the river had moved as well.",
        "But the old oak was exactly where she drew it.",
        "Somebody had cut two names into the bark.",
        "The letters were grown over and soft.",
        "I could still read them if I did not hurry.",
        "I stood there far longer than I meant to.",
        "Then I put the copper key in the hollow.",
        "It belonged to the tree more than to me.",
        "The wind moved, and I walked back to the car.",
      ],
    },
  ],
};

/** T3-Wissens-Serie: der Weg des Wassers durch das Wetter (faktisch geprüft). */
const WATER_AND_WEATHER: Serie = {
  slug: "water-and-weather",
  titel: "Water and Weather",
  kind: "wissen-serie",
  lang: "en",
  // 21.08. (Charge I2b): `kids` abgegeben. Die Serie war mit b/c/erwachsen
  // "fuer alle ab zehn" geschrieben; auf drei Stufen uebersetzt hiess das
  // Siebenjaehrige UND Erwachsene an derselben Zeile. Ersatz fuer das
  // kids-Regal steht in serienEnKidsErsatz.ts.
  stufen: ["teens", "erwachsen"],
  minTier: 3,
  topic: "natur",
  herkunft: {
    quelle: "Sensorik",
    lizenz: "Eigenes Werk (selbst verfasst, englisches Original)",
    autor: "Sensorik-Lernplattform",
  },
  etappen: [
    {
      lines: [
        "Almost all the water on the planet is salty.",
        "Only a small share of it is fresh water.",
        "Most of that fresh water is frozen solid.",
        "So the water we can drink is a thin slice.",
        "The same water has been here for ages.",
        "It is used, cleaned by nature, and used again.",
        "The sun drives the whole system.",
        "It lifts water from seas, lakes and soil.",
        "That is called evaporation.",
        "Plants add water through their leaves.",
        "Warm air can carry more water than cold air.",
        "This is why a hot day feels heavy before rain.",
      ],
    },
    {
      lines: [
        "Rising air cools down as it climbs.",
        "Cooler air holds less water than warm air.",
        "At some height the water turns back to droplets.",
        "Millions of droplets together make a cloud.",
        "Every droplet needs a tiny speck to form on.",
        "Dust, salt and pollen all work as such specks.",
        "A cloud is not resting in the sky.",
        "It is being built and taken apart constantly.",
        "Flat clouds mean calm, layered air.",
        "Tall clouds mean strong upward movement.",
        "The tallest of them bring thunderstorms.",
        "Their tops can be flattened by high winds.",
      ],
    },
    {
      lines: [
        "Droplets in a cloud are extremely light.",
        "They must join together before they can fall.",
        "Once heavy enough, they drop as rain.",
        "If the air below is freezing, we get snow.",
        "A snowflake grows around a speck of dust.",
        "No two of them grow in quite the same way.",
        "Hail forms when droplets are carried up again.",
        "Each trip upwards adds another layer of ice.",
        "A hailstone cut in half shows those layers.",
        "Freezing rain falls as water and freezes on contact.",
        "That is why it is far more dangerous than snow.",
        "The temperature of the air decides all of this.",
      ],
    },
    {
      lines: [
        "Wind is simply air moving from high to low pressure.",
        "The sun heats the ground unevenly.",
        "Dark soil warms faster than a bright field.",
        "Land warms and cools faster than water.",
        "That difference creates coastal breezes.",
        "By day the breeze usually blows in from the sea.",
        "At night it often turns and blows back out.",
        "The turning of the planet bends large wind systems.",
        "That is why storms rotate instead of moving straight.",
        "A falling barometer warns of unsettled weather.",
        "A steady, rising one usually promises calm.",
        "Sailors trusted that instrument long before radio.",
      ],
    },
    {
      lines: [
        "Lightning is a giant spark between charges.",
        "It heats the air along its path in an instant.",
        "That air expands violently and we hear thunder.",
        "Light travels much faster than sound.",
        "So we always see the flash before we hear it.",
        "Counting the seconds gives a rough distance.",
        "Three seconds mean roughly one kilometre.",
        "Rainbows need sunlight behind you and rain ahead.",
        "Each raindrop bends and reflects the light.",
        "The colours always appear in the same order.",
        "A second, fainter bow shows them reversed.",
        "All of it is the same water, on its way round again.",
      ],
    },
  ],
};

/** Alle englischen Serien (append-only an SERIEN gehängt). */
export const SERIEN_EN: readonly Serie[] = [
  NELL_AND_THE_HARBOUR_CAT,
  THE_COPPER_KEY,
  WATER_AND_WEATHER,
];
