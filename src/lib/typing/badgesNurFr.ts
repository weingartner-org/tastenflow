/**
 * ★★ DREI ABZEICHEN, DIE ES NUR AUF WEG „fr" GIBT (E10b-2, 26.09.2026).
 *
 * Bauplan französischer Lehrgang §8.1: Pünktchen-Panda (ä ö ü) und
 * Schlangen-S (ß) gibt es auf Weg „fr" nicht - dafür zwei Abzeichen für die
 * Totasten (accent circonflexe, tréma) und eines für die Akzente der
 * Ziffernreihe (é è ç à). Familie „Tastenwelt", vergeben am Tastenstand wie
 * die übrigen (`badges.ts`, `earnedFromState`).
 *
 * ⚠️ BEWUSST NICHT IN `BADGES`: Sonst stünden sie auf dem Regal jedes Kindes
 * auf Weg „de" und „en" - für immer unerreichbar, und der deutsche und der
 * englische Katalog änderten sich (116 Abzeichen, Wächter
 * `abzeichen-motivpool.test.ts`). Das Regal eines Kindes zeigt
 * `badgesFuerWeg(lernweg)`; wo es heute noch `BADGES` liest
 * (`BadgeShelf.tsx`), ist das im Befund E10b-2 als offene Stelle genannt.
 *
 * Motive aus dem gemeinsamen Pool (Fluent Emoji, MIT), jedes frei (Wächter
 * `tests/tastenflow-abzeichen-fr.test.ts`): 🔢 die Ziffern auf der Taste,
 * 👒 der „petit chapeau" - so heisst der Zirkumflex in französischen
 * Schulen -, 🐞 die Coccinelle mit ihren zwei Punkten.
 *
 * Die Namen: `name`/`description` Deutsch wie der ganze Katalog (die Grundform
 * von `BadgeDef`), Englisch und Französisch in {@link ABZEICHEN_NUR_FR_TEXTE}
 * - neu gedacht, nicht übersetzt. ⚠️ Sobald die französischen Abzeichen-Texte
 * (`badgesFr.ts`, Zweig E11a-5) zusammengeführt sind, gehören die „fr"-Texte
 * dort hinein (`...ABZEICHEN_NUR_FR_TEXTE.fr`), ebenso die „en"-Texte in die
 * Tabelle je Sprache - sonst zeigt die Bedienung für diese drei den
 * deutschen Namen.
 */
import type { BadgeDef } from "./badges";
import type { AbzeichenTextEn } from "./badgesEn";

export const ABZEICHEN_NUR_FR: readonly BadgeDef[] = [
  {
    id: "akzente-ziffernreihe",
    emoji: "🔢",
    bildbeschreibung: "die Ziffern 1 2 3 4 auf einer blauen Taste",
    name: "Akzent-Akrobat",
    nameNeutral: "é, è, ç und à",
    group: "Tastenwelt",
    description: "é, è, ç und à freigeschaltet - die Buchstaben, die auf der Ziffernreihe wohnen.",
  },
  {
    id: "accent-circonflexe",
    emoji: "👒",
    bildbeschreibung: "ein Strohhut mit Band",
    name: "Hütchen-Taste",
    nameNeutral: "Der Zirkumflex",
    group: "Tastenwelt",
    description: "Die Totaste ^ gelernt: ê, â, î, ô und û.",
  },
  {
    id: "trema",
    emoji: "🐞",
    bildbeschreibung: "ein Marienkäfer",
    name: "Trema-Marienkäfer",
    nameNeutral: "Das Trema",
    group: "Tastenwelt",
    description: "Das Trema ¨ gelernt: ë, ï und ü.",
  },
];

/** Welche Einheiten des Weges „fr" ein Abzeichen verlangt. */
export const ABZEICHEN_NUR_FR_EINHEITEN: Readonly<Record<string, readonly string[]>> = {
  "akzente-ziffernreihe": ["é", "è", "ç", "à"],
  "accent-circonflexe": ["^"],
  trema: ["¨"],
};

/** Englisch und Französisch - dieselbe Form wie `ABZEICHEN_EN`. */
export const ABZEICHEN_NUR_FR_TEXTE: Readonly<Record<"en" | "fr", Readonly<Record<string, AbzeichenTextEn>>>> = {
  en: {
    "akzente-ziffernreihe": {
      name: "Accent Acrobat",
      nameNeutral: "é, è, ç and à",
      description: "é, è, ç and à unlocked - the letters that live on the number row.",
      bildbeschreibung: "the digits 1 2 3 4 on a blue key",
    },
    "accent-circonflexe": {
      name: "The Little Hat",
      nameNeutral: "The circumflex",
      description: "The dead key ^ learnt: ê, â, î, ô and û.",
      bildbeschreibung: "a straw hat with a ribbon",
    },
    trema: {
      name: "Two-Dot Ladybird",
      nameNeutral: "The diaeresis",
      description: "The diaeresis ¨ learnt: ë, ï and ü.",
      bildbeschreibung: "a ladybird",
    },
  },
  fr: {
    "akzente-ziffernreihe": {
      name: "Acrobate des accents",
      nameNeutral: "é, è, ç et à",
      description: "é, è, ç et à débloqués - les lettres qui habitent la rangée des chiffres.",
      bildbeschreibung: "les chiffres 1 2 3 4 sur une touche bleue",
    },
    "accent-circonflexe": {
      name: "Le petit chapeau",
      nameNeutral: "L'accent circonflexe",
      description: "La touche morte ^ apprise : ê, â, î, ô et û.",
      bildbeschreibung: "un chapeau de paille avec un ruban",
    },
    trema: {
      name: "Coccinelle à deux points",
      nameNeutral: "Le tréma",
      description: "Le tréma ¨ appris : ë, ï et ü.",
      bildbeschreibung: "une coccinelle",
    },
  },
};
