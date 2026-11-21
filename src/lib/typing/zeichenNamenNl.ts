/**
 * ★★★ G3b (25.10.2026): EINHÄNGEPUNKT für die Zeichennamen der Sprachausgabe auf Niederländisch (Weg „nl").
 *
 * ★★★ F58 (29.10.2026): GEFÜLLT nach dem Glossar `recherche-niederländisch-2026-10-25/GLOSSAR-nl.md` §2.8 („Zeichennamen der Sprachausgabe"). Jedes Zeichen der Tastaturen
 * des Weges und des Korpus hat einen Namen in der Sprache (Wächter `tests/tastenflow-f58-vorlesen-neun.test.ts`), dazu JEDER
 * Grossbuchstabe des Alphabets („hoofdletter" vor dem Namen: „hoofdletter e met trema") - vorher sagte die Stimme „capital …", „space", „full stop" (gemessen 29.10.2026).
 * Ein fehlender Eintrag fällt weiter auf den englischen Namen zurück, nie auf den deutschen (Falle 30).
 * ⚠️ Am Gerät NICHT gehört (keine Stimme der Sprache auf dem Mess-PC, Befund F58); die Namen mit [G] im Glossar warten auf die
 * Lese-Abnahme durch eine Person mit Niederländisch als Erstsprache.
 * `ij` wird als „i, j" gesprochen, nie als ein Laut (Glossar §2.8) - darum KEIN Eintrag für die Ligatur.
 */
import { zeichenTabelle, LATEIN_KLEIN } from "./zeichenNamenHilfe";

/** Satz- und Sonderzeichen, Totasten (Glossar §2.8). */
const ZEICHEN: Readonly<Record<string, string>> = {
  " ": "spatie",
  "\n": "Enter",
  "\t": "Tab",
  ".": "punt",
  ",": "komma",
  "-": "koppelteken",
  ":": "dubbele punt",
  ";": "puntkomma",
  "?": "vraagteken",
  "!": "uitroepteken",
  "'": "apostrof",
  "’": "apostrof",
  "\"": "aanhalingsteken",
  "“": "aanhalingsteken openen",
  "”": "aanhalingsteken sluiten",
  "‘": "enkel aanhalingsteken openen",
  "(": "haakje openen",
  ")": "haakje sluiten",
  "[": "vierkante haak openen",
  "]": "vierkante haak sluiten",
  "{": "accolade openen",
  "}": "accolade sluiten",
  "/": "schuine streep",
  "\\": "backslash",
  "|": "verticale streep",
  "@": "apenstaartje",
  "#": "hekje",
  "&": "ampersand",
  "%": "procent",
  "_": "liggend streepje",
  "<": "kleiner dan",
  ">": "groter dan",
  "=": "is gelijk aan",
  "+": "plus",
  "*": "sterretje",
  "€": "euro",
  "$": "dollar",
  "£": "pond",
  "§": "paragraaf",
  "\u00B0": "graden",
  "^": "dakje",
  "~": "tilde",
  "`": "accent grave",
  "´": "accent aigu",
  "¨": "trema",
  "\u00B5": "mu",
  "±": "plus-min",
  "²": "kwadraat",
  "³": "tot de derde macht",
};

/** Kleine Buchstaben mit eigenem Namen (die übrigen heissen wie sie selbst). */
const BUCHSTABEN: Readonly<Record<string, string>> = {
  "ë": "e met trema",
  "ï": "i met trema",
  "é": "e met accent aigu",
  "è": "e met accent grave",
  "à": "a met accent grave",
  "ù": "u met accent grave",
  "ç": "c met cedille",
  "ä": "a met trema",
  "ö": "o met trema",
  "ü": "u met trema",
  "á": "a met accent aigu",
  "í": "i met accent aigu",
  "ó": "o met accent aigu",
  "ú": "u met accent aigu",
  "â": "a met accent circonflexe",
  "ê": "e met accent circonflexe",
  "î": "i met accent circonflexe",
  "ô": "o met accent circonflexe",
  "û": "u met accent circonflexe",
};

export const ZEICHENNAMEN_NL: Readonly<Record<string, string>> = zeichenTabelle(ZEICHEN, BUCHSTABEN, LATEIN_KLEIN + "ëïéèàùçäöüáíóúâêîôû", (n) => `hoofdletter ${n}`);
