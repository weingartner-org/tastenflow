/**
 * ★★★ G3b (25.10.2026): EINHÄNGEPUNKT für die Zeichennamen der Sprachausgabe auf Schwedisch (Weg „sv").
 *
 * ★★★ F58 (29.10.2026): GEFÜLLT nach dem Glossar `recherche-schwedisch-2026-10-25/GLOSSAR-sv.md` §2.8 („Zeichennamen der Sprachausgabe"). Jedes Zeichen der Tastaturen
 * des Weges und des Korpus hat einen Namen in der Sprache (Wächter `tests/tastenflow-f58-vorlesen-neun.test.ts`), dazu JEDER
 * Grossbuchstabe des Alphabets („stort" vor dem Namen: „stort å", „stort e med accent") - vorher sagte die Stimme „capital …", „space", „full stop" (gemessen 29.10.2026).
 * Ein fehlender Eintrag fällt weiter auf den englischen Namen zurück, nie auf den deutschen (Falle 30).
 * ⚠️ Am Gerät NICHT gehört (keine Stimme der Sprache auf dem Mess-PC, Befund F58); die Namen mit [G] im Glossar warten auf die
 * Lese-Abnahme durch eine Person mit Schwedisch als Erstsprache.
 * å ä ö sind eigene Buchstaben und heissen wie ihr Laut (nie „a med ring").
 */
import { zeichenTabelle, LATEIN_KLEIN } from "./zeichenNamenHilfe";

/** Satz- und Sonderzeichen, Totasten (Glossar §2.8). */
const ZEICHEN: Readonly<Record<string, string>> = {
  " ": "mellanslag",
  "\n": "Retur",
  "\t": "tabb",
  ".": "punkt",
  ",": "komma",
  "-": "bindestreck",
  ":": "kolon",
  ";": "semikolon",
  "?": "frågetecken",
  "!": "utropstecken",
  "'": "apostrof",
  "’": "apostrof",
  "\"": "citattecken",
  "”": "citattecken",
  "(": "vänster parentes",
  ")": "höger parentes",
  "[": "vänster hakparentes",
  "]": "höger hakparentes",
  "{": "vänster klammerparentes",
  "}": "höger klammerparentes",
  "/": "snedstreck",
  "\\": "omvänt snedstreck",
  "|": "lodstreck",
  "@": "snabel-a",
  "#": "nummer",
  "&": "och-tecken",
  "%": "procent",
  "_": "understreck",
  "<": "mindre än",
  ">": "större än",
  "=": "likhetstecken",
  "+": "plus",
  "*": "stjärna",
  "€": "euro",
  "$": "dollar",
  "£": "pund",
  "§": "paragraf",
  "\u00B0": "grader",
  "¤": "valutatecken",
  "^": "cirkumflex",
  "~": "tilde",
  "`": "grav accent",
  "´": "akut accent",
  "¨": "trema",
  "½": "en halv",
  "\u00B5": "mikro",
};

/** Kleine Buchstaben mit eigenem Namen (die übrigen heissen wie sie selbst). */
const BUCHSTABEN: Readonly<Record<string, string>> = {
  "é": "e med accent",
};

export const ZEICHENNAMEN_SV: Readonly<Record<string, string>> = zeichenTabelle(ZEICHEN, BUCHSTABEN, LATEIN_KLEIN + "åäöé", (n) => `stort ${n}`);
