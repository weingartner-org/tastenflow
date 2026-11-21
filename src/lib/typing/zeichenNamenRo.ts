/**
 * ★★★ G3b (25.10.2026): EINHÄNGEPUNKT für die Zeichennamen der Sprachausgabe auf Rumänisch (Weg „ro").
 *
 * ★★★ F58 (29.10.2026): GEFÜLLT nach dem Glossar `recherche-rumänisch-2026-10-25/GLOSSAR-ro.md` §2.8 („Zeichennamen der Sprachausgabe"). Jedes Zeichen der Tastaturen
 * des Weges und des Korpus hat einen Namen in der Sprache (Wächter `tests/tastenflow-f58-vorlesen-neun.test.ts`), dazu JEDER
 * Grossbuchstabe des Alphabets (Buchstabe zuerst: „A mare", mit Zeichen „a cu căciulă, mare") - vorher sagte die Stimme „capital …", „space", „full stop" (gemessen 29.10.2026).
 * Ein fehlender Eintrag fällt weiter auf den englischen Namen zurück, nie auf den deutschen (Falle 30).
 * ⚠️ Am Gerät NICHT gehört (keine Stimme der Sprache auf dem Mess-PC, Befund F58); die Namen mit [G] im Glossar warten auf die
 * Lese-Abnahme durch eine Person mit Rumänisch als Erstsprache.
 * `ș ț` mit KOMMA und `ş ţ` mit Cedille haben verschiedene Namen - ein Kind muss hören, welches es getippt hat.
 */
import { zeichenTabelle, LATEIN_KLEIN } from "./zeichenNamenHilfe";

/** Satz- und Sonderzeichen, Totasten (Glossar §2.8). */
const ZEICHEN: Readonly<Record<string, string>> = {
  " ": "spațiu",
  "\n": "enter",
  "\t": "tabulator",
  ".": "punct",
  ",": "virgulă",
  "-": "cratimă",
  ":": "două puncte",
  ";": "punct și virgulă",
  "?": "semnul întrebării",
  "!": "semnul exclamării",
  "'": "apostrof",
  "\"": "ghilimele",
  "„": "ghilimele deschise",
  "”": "ghilimele închise",
  "«": "ghilimele unghiulare deschise",
  "»": "ghilimele unghiulare închise",
  "‚": "ghilimele simple deschise",
  "‘": "ghilimele simple deschise",
  "’": "ghilimele simple închise",
  "(": "paranteză rotundă deschisă",
  ")": "paranteză rotundă închisă",
  "[": "paranteză pătrată deschisă",
  "]": "paranteză pătrată închisă",
  "{": "acoladă deschisă",
  "}": "acoladă închisă",
  "/": "bară oblică",
  "\\": "bară oblică inversă",
  "|": "bară verticală",
  "@": "a rond",
  "#": "diez",
  "&": "ampersand",
  "%": "procent",
  "_": "liniuță joasă",
  "<": "mai mic",
  ">": "mai mare",
  "=": "egal",
  "+": "plus",
  "*": "asterisc",
  "€": "euro",
  "$": "dolar",
  "£": "liră sterlină",
  "§": "secțiune",
  "\u00B0": "grade",
  "^": "circumflex",
  "~": "tildă",
  "`": "accent grav",
  "²": "la pătrat",
  "³": "la cub",
  "½": "o jumătate",
  "\u00B5": "micro",
};

/** Kleine Buchstaben mit eigenem Namen (die übrigen heissen wie sie selbst). */
const BUCHSTABEN: Readonly<Record<string, string>> = {
  "ă": "a cu căciulă",
  "â": "â din a",
  "î": "î din i",
  "ș": "s cu virgulă",
  "ț": "t cu virgulă",
  "ş": "s cu sedilă",
  "ţ": "t cu sedilă",
  "ä": "a cu două puncte",
  "ö": "o cu două puncte",
  "ü": "u cu două puncte",
  "ë": "e cu două puncte",
  "ï": "i cu două puncte",
  "ÿ": "y cu două puncte",
  "ß": "s dublu german",
  "ñ": "n cu tildă",
  "ç": "c cu sedilă",
  "é": "e cu accent ascuțit",
  "è": "e cu accent grav",
  "ê": "e cu accent circumflex",
};

export const ZEICHENNAMEN_RO: Readonly<Record<string, string>> = zeichenTabelle(ZEICHEN, BUCHSTABEN, LATEIN_KLEIN + "ăâîșțşţäöüëïÿñçéèê", (n, k) => (n === k ? `${k.toUpperCase()} mare` : `${n}, mare`));
