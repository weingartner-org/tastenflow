/*
 * Melodien-Sammlung für den Melodie-Modus von Tastenflow.
 *
 * Wozu: Bei jedem richtigen Tastendruck erklingt der NÄCHSTE Ton einer Melodie.
 * Wer gleichmässig tippt, „spielt" so ein Lied. Jeder Anschlag ist genau ein Ton;
 * den Rhythmus gibt es nur angenähert über die Notenlänge (= Ausklingzeit).
 * Darum muss jede Melodie schon an der reinen Tonfolge erkennbar sein.
 *
 * Notenschrift im String `noten`:
 *  - Tokens durch Leerzeichen getrennt. `|` (Taktstrich) ist erlaubt und wird
 *    ignoriert; er steht nur der Lesbarkeit wegen da.
 *  - Ein Ton: Buchstabe A-G, optional `#` oder `b`, dann die Oktavziffer
 *    (C4 = mittleres C), optional `:` + Länge in Vierteln (Dezimal erlaubt:
 *    `:0.5` Achtel, `:2` Halbe, `:3` punktierte Halbe, `:1.5`). Ohne Länge = 1 Viertel.
 *  - PAUSEN (19.10.2026): `R` (ein Viertel) oder `R:2` ist eine Pause. Sie ist
 *    EIN Anschlag, gleich wie lang: die Taste klingt nicht (Schalter „Pausen im
 *    Lied" im Lautsprecher-Menü; ohne ihn verlängert die Pause den Ton davor).
 *    Nicht an den Anfang oder ans Ende setzen - der Wächter-Test lehnt das ab.
 *  - Tonumfang G3 bis C6, Hauptlage um C4-C5. Die App transponiert je Klangfarbe selbst.
 *
 * Nur Gemeinfreies hinein: Die Melodien werden in einer Lern-App für Kinder
 * ausgeliefert und vervielfältigt. Darum nur traditionelle Volks- und Kinderlieder
 * sowie Werke von Komponisten, die vor 1955 gestorben sind (Schutzfrist abgelaufen),
 * und eigene, neu komponierte Stücke (Art „lustig"). Keine Filmmusik, kein Pop,
 * nichts Neueres - auch nicht „nur ein Stück davon".
 */
import type { Lang } from "./account";

/** Eine Melodie für den Melodie-Modus (siehe melodie.ts). */
export interface Melodie {
  /** kebab-case, eindeutig, ASCII */
  id: string;
  /** Anzeigename je Sprache; de und en Pflicht, die anderen wo es einen geläufigen Namen gibt (sonst weglassen - es fällt auf en zurück). */
  name: { de: string; en: string } & Partial<Record<Lang, string>>;
  art: "kinderlied" | "klassik" | "fest" | "lustig";
  /** Noten, siehe oben */
  noten: string;
}

export const MELODIEN: readonly Melodie[] = [
  // ───────────────────────── Kinderlieder ─────────────────────────
  {
    id: "bruder-jakob",
    name: {
      de: "Bruder Jakob",
      en: "Brother John",
      fr: "Frère Jacques",
      es: "Martinillo",
      it: "Fra Martino",
      pl: "Panie Janie",
      cs: "Bratře Kubo",
    },
    art: "kinderlied",
    noten:
      "G4 A4 B4 G4 | G4 A4 B4 G4 | B4 C5 D5:2 | B4 C5 D5:2 | D5:0.5 E5:0.5 D5:0.5 C5:0.5 B4 G4 | D5:0.5 E5:0.5 D5:0.5 C5:0.5 B4 G4 | G4 D4 G4:2 | G4 D4 G4:2",
  },
  {
    id: "twinkle-weihnachtsmann",
    name: {
      de: "Morgen kommt der Weihnachtsmann",
      en: "Twinkle, Twinkle, Little Star",
      fr: "Ah ! vous dirai-je, maman",
      es: "Estrellita, ¿dónde estás?",
    },
    art: "kinderlied",
    noten:
      "C4 C4 G4 G4 | A4 A4 G4:2 | F4 F4 E4 E4 | D4 D4 C4:2 | G4 G4 F4 F4 | E4 E4 D4:2 | G4 G4 F4 F4 | E4 E4 D4:2 | C4 C4 G4 G4 | A4 A4 G4:2 | F4 F4 E4 E4 | D4 D4 C4:2",
  },
  {
    id: "old-macdonald",
    name: {
      de: "Old MacDonald",
      en: "Old MacDonald Had a Farm",
      fr: "Dans la ferme de Mathurin",
    },
    art: "kinderlied",
    noten:
      "G4 G4 G4 D4 | E4 E4 D4:2 | B4 B4 A4 A4 | G4:3 | D4 | G4 G4 G4 D4 | E4 E4 D4:2 | B4 B4 A4 A4 | G4:4",
  },
  {
    id: "mary-had-a-little-lamb",
    name: { de: "Mary hatte ein kleines Lamm", en: "Mary Had a Little Lamb" },
    art: "kinderlied",
    noten:
      "E4 D4 C4 D4 | E4 E4 E4:2 | D4 D4 D4:2 | E4 G4 G4:2 | E4 D4 C4 D4 | E4 E4 E4 E4 | D4 D4 E4 D4 | C4:4",
  },
  {
    id: "row-row-row-your-boat",
    name: { de: "Row, row, row your boat", en: "Row, Row, Row Your Boat" },
    art: "kinderlied",
    noten:
      "C4:1.5 C4:1.5 C4 D4:0.5 E4:1.5 | E4 D4:0.5 E4 F4:0.5 G4:3 | C5:0.5 C5:0.5 C5:0.5 G4:0.5 G4:0.5 G4:0.5 E4:0.5 E4:0.5 E4:0.5 C4:0.5 C4:0.5 C4:0.5 | G4 F4:0.5 E4 D4:0.5 C4:3",
  },
  {
    id: "london-bridge",
    name: { de: "London Bridge", en: "London Bridge Is Falling Down" },
    art: "kinderlied",
    noten:
      "G4:1.5 A4:0.5 G4 F4 | E4 F4 G4:2 | D4 E4 F4:2 | E4 F4 G4:2 | G4:1.5 A4:0.5 G4 F4 | E4 F4 G4 | D4 G4 E4 C4:2",
  },
  {
    id: "au-clair-de-la-lune",
    name: { de: "Au clair de la lune", en: "Au clair de la lune", fr: "Au clair de la lune" },
    art: "kinderlied",
    noten:
      "C4 C4 C4 D4 | E4:2 D4:2 | C4 E4 D4 D4 | C4:4 | C4 C4 C4 D4 | E4:2 D4:2 | C4 E4 D4 D4 | C4:4 | D4 D4 D4 D4 | A3:2 A3:2 | D4 C4 B3 A3 | G3:4 | C4 C4 C4 D4 | E4:2 D4:2 | C4 E4 D4 D4 | C4:4",
  },
  {
    id: "la-cucaracha",
    name: { de: "La Cucaracha", en: "La Cucaracha", es: "La cucaracha" },
    art: "kinderlied",
    noten:
      "C4 C4 C4 F4 A4:2 | C4 C4 C4 F4 A4:2 | F4 F4 E4 E4 D4 D4 C4:2 | C4 C4 C4 E4 G4:2 | C4 C4 C4 E4 G4:2 | C5 D5 C5 Bb4 A4 G4 F4:2",
  },
  {
    id: "hot-cross-buns",
    name: { de: "Hot Cross Buns", en: "Hot Cross Buns" },
    art: "kinderlied",
    noten:
      "E4 D4 C4:2 | E4 D4 C4:2 | C4:0.5 C4:0.5 C4:0.5 C4:0.5 D4:0.5 D4:0.5 D4:0.5 D4:0.5 | E4 D4 C4:2 | E4 D4 C4:2 | E4 D4 C4:2 | C4:0.5 C4:0.5 C4:0.5 C4:0.5 D4:0.5 D4:0.5 D4:0.5 D4:0.5 | E4 D4 C4:3",
  },

  // ───────────────────────── Klassik ─────────────────────────
  {
    id: "bergkoenig",
    name: {
      de: "In der Halle des Bergkönigs",
      en: "In the Hall of the Mountain King",
      fr: "Dans l'antre du roi de la montagne",
      es: "En la gruta del rey de la montaña",
      it: "Nella sala del re della montagna",
      pl: "W grocie króla gór",
      cs: "V síni horského krále",
    },
    art: "klassik",
    noten:
      "A4:0.5 B4:0.5 C5:0.5 D5:0.5 | E5:0.5 C5:0.5 E5 | D#5:0.5 B4:0.5 D#5 | D5:0.5 Bb4:0.5 D5 | A4:0.5 B4:0.5 C5:0.5 D5:0.5 | E5:0.5 C5:0.5 E5:0.5 A5:0.5 | G5:0.5 E5:0.5 C5:0.5 E5:0.5 | G5:2 | A4:0.5 B4:0.5 C5:0.5 D5:0.5 | E5:0.5 C5:0.5 E5 | D#5:0.5 B4:0.5 D#5 | D5:0.5 Bb4:0.5 D5 | A4:0.5 B4:0.5 C5:0.5 D5:0.5 | E5:0.5 C5:0.5 E5:0.5 A5:0.5 | G5:0.5 E5:0.5 C5:0.5 E5:0.5 | A4:2",
  },
  {
    id: "tuerkischer-marsch",
    name: {
      de: "Türkischer Marsch",
      en: "Turkish March",
      fr: "Marche turque",
      es: "Marcha turca",
      it: "Marcia turca",
      pl: "Marsz turecki",
      cs: "Turecký pochod",
      tr: "Türk Marşı",
    },
    art: "klassik",
    noten:
      "B4:0.5 A4:0.5 G#4:0.5 A4:0.5 C5:2 | D5:0.5 C5:0.5 B4:0.5 C5:0.5 E5:2 | F5:0.5 E5:0.5 D#5:0.5 E5:0.5 B4:0.5 A4:0.5 G#4:0.5 A4:0.5 | B4:0.5 A4:0.5 G#4:0.5 A4:0.5 C5:2 | A4:3",
  },
  {
    id: "the-entertainer",
    name: { de: "The Entertainer", en: "The Entertainer" },
    art: "klassik",
    noten:
      "D4:0.5 D#4:0.5 E4:0.5 C5:1 E4:0.5 C5:1 E4:0.5 C5:2 | C5:0.5 D5:0.5 D#5:0.5 E5:0.5 C5:0.5 D5:0.5 E5:1 B4:0.5 D5:1 C5:2 | D4:0.5 D#4:0.5 E4:0.5 C5:1 E4:0.5 C5:1 E4:0.5 C5:2 | C5:4",
  },
  {
    id: "kanon-in-d",
    name: {
      de: "Kanon in D",
      en: "Canon in D",
      fr: "Canon en ré",
      it: "Canone in re",
    },
    art: "klassik",
    noten:
      "F#5 E5 D5 C#5 | B4 A4 B4 C#5 | D5 C#5 B4 A4 | G4 F#4 G4 E4 | F#5 E5 D5 C#5 | B4 A4 B4 C#5 | D5:4",
  },
  {
    id: "menuett-in-g",
    name: {
      de: "Menuett in G-Dur",
      en: "Minuet in G",
      fr: "Menuet en sol majeur",
      es: "Minueto en sol mayor",
      it: "Minuetto in sol maggiore",
      pl: "Menuet G-dur",
      cs: "Menuet G dur",
    },
    art: "klassik",
    noten:
      "D5 G4:0.5 A4:0.5 B4:0.5 C5:0.5 | D5 G4 G4 | E5 C5:0.5 D5:0.5 E5:0.5 F#5:0.5 | G5 G4 G4 | C5 D5:0.5 C5:0.5 B4:0.5 A4:0.5 | B4 C5:0.5 B4:0.5 A4:0.5 G4:0.5 | F#4 G4:0.5 A4:0.5 B4:0.5 G4:0.5 | G4:3",
  },
  {
    id: "praeludium-c-dur",
    name: {
      de: "Präludium in C-Dur (Bach)",
      en: "Prelude in C Major (Bach)",
      fr: "Prélude en do majeur (Bach)",
      es: "Preludio en do mayor (Bach)",
      it: "Preludio in do maggiore (Bach)",
    },
    art: "klassik",
    noten:
      "C4:0.5 E4:0.5 G4:0.5 C5:0.5 E5:0.5 G4:0.5 C5:0.5 E5:0.5 | C4:0.5 D4:0.5 A4:0.5 D5:0.5 F5:0.5 A4:0.5 D5:0.5 F5:0.5 | B3:0.5 D4:0.5 G4:0.5 D5:0.5 F5:0.5 G4:0.5 D5:0.5 F5:0.5 | C4:0.5 E4:0.5 G4:0.5 C5:0.5 E5:0.5 G4:0.5 C5:0.5 E5:0.5 | C5:4",
  },

  // ───────────────────────── Feste ─────────────────────────
  {
    id: "stille-nacht",
    name: {
      de: "Stille Nacht",
      en: "Silent Night",
      fr: "Douce nuit",
      es: "Noche de paz",
      it: "Astro del ciel",
      pl: "Cicha noc",
      cs: "Tichá noc",
      tr: "Sessiz Gece",
    },
    art: "fest",
    noten:
      "G4:1.5 A4:0.5 G4 | E4:3 | G4:1.5 A4:0.5 G4 | E4:3 | D5:2 D5 | B4:3 | C5:2 C5 | G4:3 | A4:2 A4 | C5:1.5 B4:0.5 A4 | G4:1.5 A4:0.5 G4 | E4:3 | A4:2 A4 | C5:1.5 B4:0.5 A4 | G4:1.5 A4:0.5 G4 | E4:3 | D5:2 D5 | F5:1.5 D5:0.5 B4 | C5:3 | E5:3 | C5 G4 E4 | G4:1.5 F4:0.5 D4 | C4:3",
  },
  {
    id: "jingle-bells",
    name: {
      de: "Jingle Bells",
      en: "Jingle Bells",
      fr: "Vive le vent",
      pl: "Dzwonki sań",
    },
    art: "fest",
    noten:
      "E4 E4 E4:2 | E4 E4 E4:2 | E4 G4 C4 D4 E4:4 | F4 F4 F4 F4 F4 E4 E4 E4 E4 D4 D4 E4 D4:2 G4:2 | E4 E4 E4:2 | E4 E4 E4:2 | E4 G4 C4 D4 E4:4 | F4 F4 F4 F4 F4 E4 E4 E4 E4 G4 G4 F4 D4 C4:4",
  },
  {
    id: "happy-birthday",
    name: {
      de: "Happy Birthday",
      en: "Happy Birthday to You",
      fr: "Joyeux anniversaire",
      es: "Cumpleaños feliz",
      it: "Tanti auguri a te",
    },
    art: "fest",
    noten:
      "G4:0.75 G4:0.25 A4 G4 C5 B4:2 | G4:0.75 G4:0.25 A4 G4 D5 C5:2 | G4:0.75 G4:0.25 G5 E5 C5 B4 A4 | F5:0.75 F5:0.25 E5 C5 D5 C5:2",
  },
  {
    id: "we-wish-you-a-merry-christmas",
    name: {
      de: "We Wish You a Merry Christmas",
      en: "We Wish You a Merry Christmas",
    },
    art: "fest",
    noten:
      "D4 | G4 G4:0.5 A4:0.5 G4:0.5 F#4:0.5 | E4 E4 E4 | A4 A4:0.5 B4:0.5 A4:0.5 G4:0.5 | F#4 D4 D4 | B4 B4:0.5 C5:0.5 B4:0.5 A4:0.5 | G4 E4 D4:0.5 D4:0.5 | E4 A4 F#4 | G4:2",
  },
  {
    id: "deck-the-halls",
    name: { de: "Deck the Halls", en: "Deck the Halls" },
    art: "fest",
    noten:
      "D5:1.5 C5:0.5 B4 A4 | G4 A4 B4 G4 | A4:0.5 B4:0.5 C5:0.5 A4:0.5 B4:1.5 A4:0.5 | G4 F#4 G4:2 | D5:1.5 C5:0.5 B4 A4 | G4 A4 B4 G4 | A4:0.5 B4:0.5 C5:0.5 A4:0.5 B4:1.5 A4:0.5 | G4 F#4 G4:2",
  },

  // ───────────── Lustig: eigene, neu komponierte Stücke ─────────────
  {
    id: "monster-marsch",
    name: { de: "Monster-Marsch", en: "Monster March" },
    art: "lustig",
    noten:
      "A3 A3 C4 A3 | E4:2 E4:2 | D4 D4 F4 D4 | A4:2 A4:2 | A3 A3 C4 A3 | E4:2 G4:2 | F4 E4 D4 C4 | B3:2 A3:2",
  },
  {
    id: "gespenster-walzer",
    name: { de: "Gespenster-Walzer", en: "Ghost Waltz" },
    art: "lustig",
    noten:
      "D4 F4 A4 | D5:3 | C#5 D5 C#5 | A4:3 | Bb4 A4 G4 | F4 E4 D4 | E4 F4 G4 | A4:3 | D4 F4 A4 | D5:3 | C#5 D5 C#5 | E5:3 | F5 E5 D5 | C#5 A4 E4 | D4:3",
  },
  {
    id: "roboter-boogie",
    name: { de: "Roboter-Boogie", en: "Robot Boogie" },
    art: "lustig",
    noten:
      "C4:0.5 E4:0.5 G4:0.5 A4:0.5 Bb4:0.5 A4:0.5 G4:0.5 E4:0.5 | C4:0.5 E4:0.5 G4:0.5 A4:0.5 Bb4:0.5 A4:0.5 G4:0.5 E4:0.5 | F4:0.5 A4:0.5 C5:0.5 D5:0.5 Eb5:0.5 D5:0.5 C5:0.5 A4:0.5 | C4:0.5 E4:0.5 G4:0.5 A4:0.5 Bb4:0.5 A4:0.5 G4:0.5 E4:0.5 | G4:0.5 B4:0.5 D5:0.5 E5:0.5 F5:0.5 E5:0.5 D5:0.5 B4:0.5 | F4:0.5 A4:0.5 C5:0.5 D5:0.5 Eb5:0.5 D5:0.5 C5:0.5 A4:0.5 | C4:0.5 E4:0.5 G4:0.5 A4:0.5 Bb4:0.5 A4:0.5 G4:0.5 E4:0.5 | C5:2",
  },
  {
    id: "pinguin-polka",
    name: { de: "Pinguin-Polka", en: "Penguin Polka" },
    art: "lustig",
    noten:
      "F4 A4 C5 A4 | F4 A4 C5:2 | D5 C5 Bb4 A4 | G4 A4 Bb4:2 | C5 C5 A4 A4 | Bb4 Bb4 G4:2 | A4 A4 F4 F4 | G4 G4 C5:2 | F4 A4 C5 A4 | F4 A4 C5:2 | D5 C5 Bb4 G4 | F4:4",
  },
  {
    id: "drachen-blues",
    name: { de: "Drachen-Blues", en: "Dragon Blues" },
    art: "lustig",
    noten:
      "C4:2 Eb4 F4 | F#4:2 G4:2 | Bb4 G4 F4 Eb4 | C4:4 | C4:2 Eb4 F4 | F#4:2 G4:2 | Bb4 C5 Bb4 G4 | F4:2 F#4:2 | G4 F4 Eb4 C4 | C4:4",
  },
  {
    id: "schnecken-schleicher",
    name: { de: "Schnecken-Schleicher", en: "Snail Crawl" },
    art: "lustig",
    noten:
      "C4:3 D4 | E4:3 F4 | G4:4 | A4:3 G4 | F4:3 E4 | D4:4 | C4:3 E4 | G4:3 E4 | C4:3 D4 | E4:3 C4 | D4:3 B3 | C4:4",
  },
  {
    id: "huepfender-frosch",
    name: { de: "Hüpfender Frosch", en: "Hopping Frog" },
    art: "lustig",
    noten:
      "C4:0.5 C5:0.5 C4:0.5 C5:0.5 G4:2 | D4:0.5 D5:0.5 D4:0.5 D5:0.5 A4:2 | E4:0.5 E5:0.5 E4:0.5 E5:0.5 B4:2 | C5 G4 E4 G4 | G4:0.5 G4:0.5 G4:0.5 G4:0.5 C4:2",
  },
  {
    id: "piraten-shanty",
    name: { de: "Piraten-Shanty", en: "Pirate Shanty" },
    art: "lustig",
    noten:
      "D4:1.5 D4:0.5 F4 | A4:1.5 A4:0.5 G4 | F4:1.5 E4:0.5 D4 | E4:3 | D4:1.5 D4:0.5 F4 | A4:1.5 C5:0.5 Bb4 | A4:1.5 G4:0.5 F4 | D4:3 | A4:1.5 A4:0.5 A4 | C5:1.5 D5:0.5 C5 | Bb4:1.5 A4:0.5 G4 | A4:3 | D4:1.5 F4:0.5 A4 | D5:1.5 C5:0.5 Bb4 | A4:1.5 F4:0.5 E4 | D4:3",
  },
  {
    id: "zombie-schlurfen",
    name: { de: "Zombie-Schlurfen", en: "Zombie Shuffle" },
    art: "lustig",
    noten:
      "E4:1.5 F4:0.5 E4:1.5 F4:0.5 | E4 Eb4 D4 Db4 | C4:2 B3:2 | E4:1.5 F4:0.5 E4:1.5 F4:0.5 | E4 Eb4 D4 Db4 | C4:2 B3:2 | A3 A3 A3:2",
  },
  {
    id: "ufo-landung",
    name: { de: "UFO-Landung", en: "UFO Landing" },
    art: "lustig",
    noten:
      "C4:0.5 D4:0.5 E4:0.5 F#4:0.5 G#4:0.5 Bb4:0.5 C5:2 | E5:0.5 F#5:0.5 E5:0.5 F#5:0.5 E5:0.5 F#5:0.5 E5:2 | C5:0.5 Bb4:0.5 G#4:0.5 F#4:0.5 E4:0.5 D4:0.5 C4:2 | E4:0.5 F#4:0.5 E4:0.5 F#4:0.5 C4:4",
  },
  {
    id: "hexentanz",
    name: { de: "Hexentanz", en: "Witches' Dance" },
    art: "lustig",
    noten:
      "E4 G4 B4 G4 | E4:2 E4:2 | F4 Ab4 C5 Ab4 | F4:2 F4:2 | E4 G4 B4 G4 | E4:2 E4:2 | F4 Ab4 C5 Ab4 | F4:2 F4:2 | G4 Bb4 D5 Bb4 | G4:2 G4:2 | F#4 A4 C5 A4 | F#4:2 B4:2 | E5 B4 G4 E4 | E4:4",
  },
  {
    id: "kuckucksuhr",
    name: { de: "Kuckucksuhr", en: "Cuckoo Clock" },
    art: "lustig",
    noten:
      "C4 G4 C4 G4 | C4 G4 C4 G4 | E4 C5 E4 C5 | E4 C5 E4 C5 | G5:2 E5:2 R | G5:2 E5:2 R | G5:2 E5:2 R | C5:4",
  },
  {
    id: "elefanten-tanz",
    name: { de: "Elefanten-Tanz", en: "Elephant Dance" },
    art: "lustig",
    noten:
      "A3:2 A3:2 E4:2 E4:2 | A3:2 A3:2 C4:2 E4:2 | E5:0.5 A5:0.5 A5:0.5 A5:0.5 E5:2 | A3:2 A3:2 E4:2 E4:2 | A3:2 A3:2 C4:2 E4:2 | E5:0.5 A5:0.5 A5:0.5 A5:0.5 E5:2 | E4:2 C4:2 A3:4",
  },
  {
    id: "raketenstart",
    name: { de: "Raketenstart", en: "Rocket Launch" },
    art: "lustig",
    noten:
      "G4 G4 G4 G4 G4 R | C5 C5 C5 R | C4:0.5 E4:0.5 G4:0.5 C5:0.5 E5:0.5 G5:0.5 C6:2 | G5:0.5 E5:0.5 C5:0.5 G4:0.5 E4:0.5 C4:2",
  },
  {
    id: "ameisen-marsch",
    name: { de: "Ameisen-Marsch", en: "Ant March" },
    art: "lustig",
    noten:
      "C5:0.25 D5:0.25 E5:0.25 F5:0.25 G5 | G5:0.25 F5:0.25 E5:0.25 D5:0.25 C5 | E5:0.25 F5:0.25 G5:0.25 A5:0.25 G5 | G5:0.25 F5:0.25 E5:0.25 D5:0.25 C5 | C5:0.25 C5:0.25 C5:0.25 C5:0.25 D5:0.25 D5:0.25 D5:0.25 D5:0.25 | E5:0.25 E5:0.25 E5:0.25 E5:0.25 C5:2",
  },
  {
    id: "baeren-tango",
    name: { de: "Bären-Tango", en: "Bear Tango" },
    art: "lustig",
    noten:
      "A4:1.5 G#4:0.5 A4 C5 | B4:1.5 A4:0.5 G#4 E4 | A4:1.5 G#4:0.5 A4 C5 | E5:2 D5 C5 | B4 C5 B4 A4 | G#4 A4 B4 G#4 | A4:4",
  },
  {
    id: "kaenguru-sprung",
    name: { de: "Känguru-Sprung", en: "Kangaroo Jump" },
    art: "lustig",
    noten:
      "D4:1.5 D5:0.5 A4 | D4:1.5 D5:0.5 A4 | G4:1.5 B4:0.5 D5 | G4:2 A4 | D4:1.5 D5:0.5 A4 | D4:1.5 D5:0.5 A4 | G4:1.5 A4:0.5 B4 | A4 F#4 D4 | E4:1.5 E5:0.5 B4 | E4:1.5 E5:0.5 B4 | A4:1.5 F#4:0.5 E4 | D4:3",
  },
  {
    id: "fledermaus-flattern",
    name: { de: "Fledermaus-Flattern", en: "Bat Flutter" },
    art: "lustig",
    noten:
      "E5:0.25 F5:0.25 E5:0.25 F5:0.25 E5:0.25 F5:0.25 E5:0.25 F5:0.25 | E5 A4 | E5:0.25 F5:0.25 E5:0.25 F5:0.25 E5:0.25 F5:0.25 E5:0.25 F5:0.25 | E5 C5 | A5:0.5 G5:0.5 F5:0.5 E5:0.5 D5:0.5 C5:0.5 B4:0.5 A4:2",
  },
  {
    id: "papagei-plapper",
    name: { de: "Papagei-Plapper", en: "Parrot Chatter" },
    art: "lustig",
    noten:
      "C5:0.5 E5:0.5 G5 G5:0.5 E5:0.5 C5 | D5:0.5 F5:0.5 A5 A5:0.5 F5:0.5 D5 | E5:0.5 G5:0.5 C6 C6:0.5 G5:0.5 E5 | C5:0.5 E5:0.5 G5 G5:0.5 E5:0.5 C5:2",
  },
  {
    id: "zauberer-abrakadabra",
    name: { de: "Zauberer Abrakadabra", en: "Wizard Abracadabra" },
    art: "lustig",
    noten:
      "C4:0.5 E4:0.5 G4:0.5 C5:0.5 E5:0.5 G5:0.5 C6:2 | B5:0.5 Bb5:0.5 A5:0.5 Ab5:0.5 G5:0.5 Gb5:0.5 F5:0.5 E5:0.5 Eb5:0.5 D5:0.5 Db5:0.5 C5:2 | E5:0.5 G5:0.5 E5:0.5 G5:0.5 C6:2",
  },
];
