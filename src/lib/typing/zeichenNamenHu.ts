/**
 * ★★★ G3b (25.10.2026): EINHÄNGEPUNKT für die Zeichennamen der Sprachausgabe auf Ungarisch (Weg „hu").
 *
 * ★★★ F58 (29.10.2026): GEFÜLLT nach dem Glossar `recherche-ungarisch-2026-10-25/GLOSSAR-hu.md` §2.8 („Zeichennamen der Sprachausgabe"). Jedes Zeichen der Tastaturen
 * des Weges und des Korpus hat einen Namen in der Sprache (Wächter `tests/tastenflow-f58-vorlesen-neun.test.ts`), dazu JEDER
 * Grossbuchstabe des Alphabets („nagy" vor dem Namen: „nagy a", „nagy hosszú ő") - vorher sagte die Stimme „capital …", „space", „full stop" (gemessen 29.10.2026).
 * Ein fehlender Eintrag fällt weiter auf den englischen Namen zurück, nie auf den deutschen (Falle 30).
 * ⚠️ Am Gerät NICHT gehört (keine Stimme der Sprache auf dem Mess-PC, Befund F58); die Namen mit [G] im Glossar warten auf die
 * Lese-Abnahme durch eine Person mit Ungarisch als Erstsprache.
 * ö und ü sind eigene Buchstaben und heissen wie sie selbst (nie „o mit zwei Punkten"); `õ û` heissen ausdrücklich anders
 * als `ő ű` (Glossar §4 Falle H5). `` ` `` heisst wie die Totaste der ungarischen Tastatur („tompa ékezet").
 */
import { zeichenTabelle, LATEIN_KLEIN } from "./zeichenNamenHilfe";

/** Satz- und Sonderzeichen, Totasten (Glossar §2.8). */
const ZEICHEN: Readonly<Record<string, string>> = {
  " ": "szóköz",
  "\n": "Enter",
  "\t": "tabulátor",
  ".": "pont",
  ",": "vessző",
  "-": "kötőjel",
  ":": "kettőspont",
  ";": "pontosvessző",
  "?": "kérdőjel",
  "!": "felkiáltójel",
  "'": "aposztróf",
  "\"": "idézőjel",
  "„": "alsó idézőjel",
  "”": "felső idézőjel",
  "(": "nyitó zárójel",
  ")": "záró zárójel",
  "[": "nyitó szögletes zárójel",
  "]": "záró szögletes zárójel",
  "{": "nyitó kapcsos zárójel",
  "}": "záró kapcsos zárójel",
  "/": "perjel",
  "\\": "fordított perjel",
  "|": "függőleges vonal",
  "@": "kukac",
  "#": "kettőskereszt",
  "&": "és-jel",
  "%": "százalékjel",
  "_": "aláhúzásjel",
  "<": "kisebb, mint",
  ">": "nagyobb, mint",
  "=": "egyenlőségjel",
  "+": "plusz",
  "*": "csillag",
  "€": "euró",
  "$": "dollár",
  "£": "font",
  "§": "paragrafus",
  "\u00B0": "fok",
  "^": "kalap",
  "~": "hullámvonal",
  "`": "tompa ékezet",
  "ˇ": "hacsek",
  "˘": "rövidségjel",
  "\u02DA": "karika",
  "˛": "ogonek",
  "˙": "pont ékezet",
  "´": "éles ékezet",
  "˝": "kettős ékezet",
  "¨": "két pont",
  "¸": "cedille",
};

/** Kleine Buchstaben mit eigenem Namen (die übrigen heissen wie sie selbst). */
const BUCHSTABEN: Readonly<Record<string, string>> = {
  "á": "hosszú á",
  "é": "hosszú é",
  "í": "hosszú í",
  "ó": "hosszú ó",
  "ő": "hosszú ő",
  "ú": "hosszú ú",
  "ű": "hosszú ű",
  "õ": "o hullámvonallal",
  "û": "u kalappal",
};

export const ZEICHENNAMEN_HU: Readonly<Record<string, string>> = zeichenTabelle(ZEICHEN, BUCHSTABEN, LATEIN_KLEIN + "áéíóöőúüűõû", (n) => `nagy ${n}`);
