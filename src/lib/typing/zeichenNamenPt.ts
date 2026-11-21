/**
 * ★★★ G3b (25.10.2026): EINHÄNGEPUNKT für die Zeichennamen der Sprachausgabe auf Portugiesisch (Portugal) (Weg „pt").
 *
 * ★★★ F58 (29.10.2026): GEFÜLLT nach dem Glossar `recherche-portugiesisch-2026-10-25/GLOSSAR-pt.md` §2.8 („Zeichennamen der Sprachausgabe"). Jedes Zeichen der Tastaturen
 * des Weges und des Korpus hat einen Namen in der Sprache (Wächter `tests/tastenflow-f58-vorlesen-neun.test.ts`), dazu JEDER
 * Grossbuchstabe des Alphabets („maiúscula" vor dem Namen wie NVDA pt_PT: „maiúscula c com cedilha") - vorher sagte die Stimme „capital …", „space", „full stop" (gemessen 29.10.2026).
 * Ein fehlender Eintrag fällt weiter auf den englischen Namen zurück, nie auf den deutschen (Falle 30).
 * ⚠️ Am Gerät NICHT gehört (keine Stimme der Sprache auf dem Mess-PC, Befund F58); die Namen mit [G] im Glossar warten auf die
 * Lese-Abnahme durch eine Person mit Portugiesisch (Portugal) als Erstsprache.
 * Die Totasten heissen wie ihre Ansage beim Drücken („acento agudo", „til").
 */
import { zeichenTabelle, LATEIN_KLEIN } from "./zeichenNamenHilfe";

/** Satz- und Sonderzeichen, Totasten (Glossar §2.8). */
const ZEICHEN: Readonly<Record<string, string>> = {
  " ": "espaço",
  "\n": "Enter",
  "\t": "Tab",
  ".": "ponto",
  ",": "vírgula",
  "-": "hífen",
  ":": "dois pontos",
  ";": "ponto e vírgula",
  "?": "ponto de interrogação",
  "!": "ponto de exclamação",
  "'": "apóstrofo",
  "’": "apóstrofo",
  "\"": "aspas",
  "«": "abrir aspas duplas",
  "»": "fechar aspas duplas",
  "“": "abrir aspas",
  "”": "fechar aspas",
  "(": "abrir parêntesis",
  ")": "fechar parêntesis",
  "[": "abrir parênteses retos",
  "]": "fechar parênteses retos",
  "{": "abrir chavetas",
  "}": "fechar chavetas",
  "/": "barra",
  "\\": "barra invertida",
  "|": "barra vertical",
  "@": "arroba",
  "#": "cardinal",
  "&": "e comercial",
  "%": "por cento",
  "_": "sublinhado",
  "<": "menor que",
  ">": "maior que",
  "=": "igual",
  "+": "mais",
  "*": "asterisco",
  "€": "euro",
  "$": "cifrão",
  "£": "libra",
  "§": "parágrafo",
  "\u00B0": "graus",
  "\u00BA": "ordinal masculino",
  "\u00AA": "ordinal feminino",
  "^": "acento circunflexo",
  "~": "til",
  "`": "acento grave",
  "´": "acento agudo",
  "¨": "trema",
};

/** Kleine Buchstaben mit eigenem Namen (die übrigen heissen wie sie selbst). */
const BUCHSTABEN: Readonly<Record<string, string>> = {
  "à": "a com acento grave",
  "á": "a com acento agudo",
  "â": "a com acento circunflexo",
  "ã": "a com til",
  "é": "e com acento agudo",
  "ê": "e com acento circunflexo",
  "í": "i com acento agudo",
  "ó": "o com acento agudo",
  "ô": "o com acento circunflexo",
  "õ": "o com til",
  "ú": "u com acento agudo",
  "ç": "c com cedilha",
};

export const ZEICHENNAMEN_PT: Readonly<Record<string, string>> = zeichenTabelle(ZEICHEN, BUCHSTABEN, LATEIN_KLEIN + "àáâãéêíóôõúç", (n) => `maiúscula ${n}`);
