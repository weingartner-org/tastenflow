/**
 * ★★★ G3b (25.10.2026): EINHÄNGEPUNKT für die Zeichennamen der Sprachausgabe auf Ukrainisch (Weg „uk").
 *
 * ★★★ F58 (29.10.2026): GEFÜLLT nach dem Glossar `recherche-ukrainisch-2026-10-25/GLOSSAR-uk.md` §2.8 („Zeichennamen der Sprachausgabe"). Jedes Zeichen der Tastaturen
 * des Weges und des Korpus hat einen Namen in der Sprache (Wächter `tests/tastenflow-f58-vorlesen-neun.test.ts`), dazu JEDER
 * Grossbuchstabe des Alphabets („велика" vor dem Namen: „велика бе") - vorher sagte die Stimme „capital …", „space", „full stop" (gemessen 29.10.2026).
 * Ein fehlender Eintrag fällt weiter auf den englischen Namen zurück, nie auf den deutschen (Falle 30).
 * ⚠️ Am Gerät NICHT gehört (keine Stimme der Sprache auf dem Mess-PC, Befund F58); die Namen mit [G] im Glossar warten auf die
 * Lese-Abnahme durch eine Person mit Ukrainisch als Erstsprache.
 * Lateinische Buchstaben heissen „латинська a" (Glossar §2.8, U8); `ё` steht nur auf der Standard-Belegung und hat keinen
 * Namen (Glossar U9), seine Grossform heisst trotzdem nicht englisch.
 */
import { zeichenTabelle, lateinMitVorwort, LATEIN_KLEIN } from "./zeichenNamenHilfe";

/** Satz- und Sonderzeichen, Totasten (Glossar §2.8). */
const ZEICHEN: Readonly<Record<string, string>> = {
  " ": "пробіл",
  "\n": "Enter",
  "\t": "табуляція",
  ".": "крапка",
  ",": "кома",
  ":": "двокрапка",
  ";": "крапка з комою",
  "?": "знак питання",
  "!": "знак оклику",
  "'": "апостроф",
  "\u02BC": "апостроф",
  "’": "апостроф",
  "\"": "лапки",
  "-": "дефіс",
  "(": "ліва дужка",
  ")": "права дужка",
  "/": "скісна риска",
  "\\": "зворотна скісна риска",
  "№": "номер",
  "%": "відсоток",
  "*": "зірочка",
  "+": "плюс",
  "=": "дорівнює",
  "_": "підкреслення",
  "₴": "знак гривні",
  "@": "равлик",
  "#": "решітка",
  "&": "амперсанд",
  "<": "менше",
  ">": "більше",
  "|": "вертикальна риска",
  "[": "ліва квадратна дужка",
  "]": "права квадратна дужка",
  "{": "ліва фігурна дужка",
  "}": "права фігурна дужка",
  "~": "тильда",
  "^": "циркумфлекс",
  "`": "гравіс",
  "€": "євро",
  "$": "долар",
  "«": "відкривні лапки-ялинки",
  "»": "закривні лапки-ялинки",
  "„": "відкривні лапки-лапки",
  "“": "закривні лапки-лапки",
  "²": "у квадраті",
  "³": "у кубі",
  "½": "половина",
  "\u00B5": "мікро",
};

/** Kleine Buchstaben mit eigenem Namen (die übrigen heissen wie sie selbst). */
const BUCHSTABEN: Readonly<Record<string, string>> = {
  ...lateinMitVorwort("латинська"),
  "б": "бе",
  "в": "ве",
  "г": "ге",
  "ґ": "ґе",
  "д": "де",
  "ж": "же",
  "з": "зе",
  "й": "йот",
  "к": "ка",
  "л": "ел",
  "м": "ем",
  "н": "ен",
  "п": "пе",
  "р": "ер",
  "с": "ес",
  "т": "те",
  "ф": "еф",
  "х": "ха",
  "ц": "це",
  "ч": "че",
  "ш": "ша",
  "щ": "ща",
  "ь": "м'який знак",
  "ä": "а з двома крапками",
  "ö": "о з двома крапками",
  "ü": "у з двома крапками",
  "ß": "есцет",
  "ñ": "ен з тильдою",
  "ç": "це з седилем",
};

export const ZEICHENNAMEN_UK: Readonly<Record<string, string>> = zeichenTabelle(ZEICHEN, BUCHSTABEN, "абвгґдеєжзиіїйклмнопрстуфхцчшщьюяёäöüñç" + LATEIN_KLEIN, (n) => `велика ${n}`);
