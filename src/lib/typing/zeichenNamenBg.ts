/**
 * ★★★ G3b (25.10.2026): EINHÄNGEPUNKT für die Zeichennamen der Sprachausgabe auf Bulgarisch (Weg „bg").
 *
 * ★★★ F58 (29.10.2026): GEFÜLLT nach dem Glossar `recherche-bulgarisch-2026-10-25/GLOSSAR-bg.md` §2.8 („Zeichennamen der Sprachausgabe"). Jedes Zeichen der Tastaturen
 * des Weges und des Korpus hat einen Namen in der Sprache (Wächter `tests/tastenflow-f58-vorlesen-neun.test.ts`), dazu JEDER
 * Grossbuchstabe des Alphabets („главно" vor dem Namen: „главно а", „главно и кратко") - vorher sagte die Stimme „capital …", „space", „full stop" (gemessen 29.10.2026).
 * Ein fehlender Eintrag fällt weiter auf den englischen Namen zurück, nie auf den deutschen (Falle 30).
 * ⚠️ Am Gerät NICHT gehört (keine Stimme der Sprache auf dem Mess-PC, Befund F58); die Namen mit [G] im Glossar warten auf die
 * Lese-Abnahme durch eine Person mit Bulgarisch als Erstsprache.
 * Lateinische Buchstaben heissen „латинско a" (Glossar §2.8 „Doppelgänger", §4 Falle 1) - sie sehen aus wie kyrillische.
 */
import { zeichenTabelle, lateinMitVorwort, LATEIN_KLEIN } from "./zeichenNamenHilfe";

/** Satz- und Sonderzeichen, Totasten (Glossar §2.8). */
const ZEICHEN: Readonly<Record<string, string>> = {
  " ": "интервал",
  "\n": "Enter",
  "\t": "Tab",
  ".": "точка",
  ",": "запетая",
  "-": "малко тире",
  // Der Halbgeviertstrich als Zeichencode - der Strich-Wächter erlaubt im Quelltext nur den Bindestrich (wie `lernweg.ts`).
  [String.fromCharCode(0x2013)]: "тире",
  ":": "двоеточие",
  ";": "точка и запетая",
  "?": "въпросителен знак",
  "!": "удивителен знак",
  "'": "апостроф",
  "\"": "кавички",
  "„": "долни кавички",
  "“": "горни кавички",
  "”": "горни кавички",
  "«": "ъглови кавички",
  "»": "ъглови кавички",
  "(": "лява скоба",
  ")": "дясна скоба",
  "[": "лява квадратна скоба",
  "]": "дясна квадратна скоба",
  "{": "лява фигурна скоба",
  "}": "дясна фигурна скоба",
  "/": "наклонена черта",
  "\\": "обратна наклонена черта",
  "|": "вертикална черта",
  "@": "кльомба",
  "#": "диез",
  "&": "амперсанд",
  "%": "процент",
  "_": "долна черта",
  "<": "по-малко",
  ">": "по-голямо",
  "=": "равно",
  "+": "плюс",
  "*": "звездичка",
  "€": "евро",
  "$": "долар",
  "£": "паунд",
  "§": "параграф",
  "\u00B0": "градус",
  "^": "колибка",
  "~": "вълничка",
  "`": "обратен апостроф",
  "№": "номер",
  "\u2026": "многоточие",
};

/** Kleine Buchstaben mit eigenem Namen (die übrigen heissen wie sie selbst). */
const BUCHSTABEN: Readonly<Record<string, string>> = {
  ...lateinMitVorwort("латинско"),
  "б": "бъ",
  "в": "въ",
  "г": "гъ",
  "д": "дъ",
  "ж": "жъ",
  "з": "зъ",
  "й": "и кратко",
  "к": "къ",
  "л": "лъ",
  "м": "мъ",
  "н": "нъ",
  "п": "пъ",
  "р": "ръ",
  "с": "съ",
  "т": "тъ",
  "ф": "фъ",
  "х": "хъ",
  "ц": "цъ",
  "ч": "чъ",
  "ш": "шъ",
  "щ": "щъ",
  "ъ": "ер голям",
  "ь": "ер малък",
  "ѝ": "и с ударение",
};

export const ZEICHENNAMEN_BG: Readonly<Record<string, string>> = zeichenTabelle(ZEICHEN, BUCHSTABEN, "абвгдежзийклмнопрстуфхцчшщъьюяѝыэі" + LATEIN_KLEIN, (n) => `главно ${n}`);
