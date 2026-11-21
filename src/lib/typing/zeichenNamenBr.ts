/**
 * ★★★ G3b (25.10.2026): EINHÄNGEPUNKT für die Zeichennamen der Sprachausgabe auf Portugiesisch (Brasilien) (Weg „br").
 *
 * ★★★ F58 (29.10.2026): GEFÜLLT nach dem Glossar `recherche-portugiesisch-brasilien-2026-10-25/GLOSSAR-pt-BR.md` §2.8 („Zeichennamen der Sprachausgabe"). Jedes Zeichen der Tastaturen
 * des Weges und des Korpus hat einen Namen in der Sprache (Wächter `tests/tastenflow-f58-vorlesen-neun.test.ts`), dazu JEDER
 * Grossbuchstabe des Alphabets (Buchstabe zuerst: „A maiúsculo", „e maiúsculo com acento agudo") - vorher sagte die Stimme „capital …", „space", „full stop" (gemessen 29.10.2026).
 * Ein fehlender Eintrag fällt weiter auf den englischen Namen zurück, nie auf den deutschen (Falle 30).
 * ⚠️ Am Gerät NICHT gehört (keine Stimme der Sprache auf dem Mess-PC, Befund F58); die Namen mit [G] im Glossar warten auf die
 * Lese-Abnahme durch eine Person mit Portugiesisch (Brasilien) als Erstsprache.
 */
import { zeichenTabelle, LATEIN_KLEIN } from "./zeichenNamenHilfe";

/** Satz- und Sonderzeichen, Totasten (Glossar §2.8). */
const ZEICHEN: Readonly<Record<string, string>> = {
  " ": "espaço",
  "\n": "enter",
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
  "“": "abre aspas",
  "”": "fecha aspas",
  "«": "abre aspas angulares",
  "»": "fecha aspas angulares",
  "(": "abre parênteses",
  ")": "fecha parênteses",
  "[": "abre colchetes",
  "]": "fecha colchetes",
  "{": "abre chaves",
  "}": "fecha chaves",
  "/": "barra",
  "\\": "barra invertida",
  "|": "barra vertical",
  "@": "arroba",
  "#": "cerquilha",
  "&": "e comercial",
  "%": "por cento",
  "_": "sublinhado",
  "<": "menor que",
  ">": "maior que",
  "=": "igual",
  "+": "mais",
  "*": "asterisco",
  "$": "cifrão",
  "€": "euro",
  "£": "libra",
  "§": "parágrafo",
  "\u00B0": "grau",
  "\u00BA": "ordinal masculino",
  "\u00AA": "ordinal feminino",
  "~": "til",
  "^": "circunflexo",
  "`": "acento grave",
  "´": "acento agudo",
  "¨": "trema",
};

/** Kleine Buchstaben mit eigenem Namen (die übrigen heissen wie sie selbst). */
const BUCHSTABEN: Readonly<Record<string, string>> = {
  "á": "a com acento agudo",
  "à": "a com acento grave",
  "ã": "a com til",
  "â": "a com circunflexo",
  "é": "e com acento agudo",
  "ê": "e com circunflexo",
  "í": "i com acento agudo",
  "ó": "o com acento agudo",
  "õ": "o com til",
  "ô": "o com circunflexo",
  "ú": "u com acento agudo",
  "ç": "cê-cedilha",
  "ñ": "n com til",
  "ü": "u com trema",
  "ä": "a com trema",
  "ö": "o com trema",
  "ß": "s alemão",
};

export const ZEICHENNAMEN_BR: Readonly<Record<string, string>> = zeichenTabelle(ZEICHEN, BUCHSTABEN, LATEIN_KLEIN + "áàãâéêíóõôúçñüäö", (n, k) => (n === k ? `${k.toUpperCase()} maiúsculo` : n.replace(/^(\S+)/, "$1 maiúsculo")));
