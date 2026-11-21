/**
 * ★ D-LERNDATEN (25.10.2026): DIE QUELLWÖRTER DES BUCHSTABENSALATS des Weges „hu" (Ungarisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/hu/tf-fest-hu.json`, Schlüssel `schreibWoerter` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja - unter Vorbehalt der muttersprachlichen Abnahme und der Entscheidung zu Punkt 6.1“ (Alkohol bei der Jugend).
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `buchstabensalatCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Ungarisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ Der Ertrag je Quellwort (mindestens `SALAT_ZIEL` echte Wörter) ist NICHT gemessen: er wird gegen das Lexikon der Sprache
 * gezählt (`lexikonWoerter("hu")`), und ein Fach für „hu" baut erst F8 (`lexicon.ts`). Bis dahin findet der Salat auf diesem
 * Weg keine Funde und bietet sich nicht an - die Daten liegen bereit.
 *
 * Verteiler: `buchstabensalat.ts` (Namen ausschliessen: `salatNamen${Xx}.ts`, noch leer) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?ungarisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-hu.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Salatwort } from "./buchstabensalat";

const ALLE: Salatwort["stufen"] = ["kids", "teens", "erwachsen"];
const AB_TEENS: Salatwort["stufen"] = ["teens", "erwachsen"];

export const SALATWOERTER_HU: Salatwort[] = [
  { wort: "gólya", stufen: ALLE },
  { wort: "király", stufen: ALLE },
  { wort: "folyó", stufen: ALLE },
  { wort: "hely", stufen: ALLE },
  { wort: "golyó", stufen: ALLE },
  { wort: "bagoly", stufen: ALLE },
  { wort: "mély", stufen: ALLE },
  { wort: "lyuk", stufen: ALLE },
  { wort: "olló", stufen: ALLE },
  { wort: "hattyú", stufen: ALLE },
  { wort: "meggy", stufen: ALLE },
  { wort: "könnyű", stufen: ALLE },
  { wort: "hosszú", stufen: ALLE },
  { wort: "kettő", stufen: ALLE },
  { wort: "állat", stufen: ALLE },
  { wort: "toll", stufen: ALLE },
  { wort: "tyúk", stufen: ALLE },
  { wort: "kutya", stufen: ALLE },
  { wort: "hagyma", stufen: ALLE },
  { wort: "edző", stufen: ALLE },
  { wort: "bodza", stufen: ALLE },
  { wort: "dzsem", stufen: ALLE },
  { wort: "ősz", stufen: ALLE },
  { wort: "tűz", stufen: ALLE },
  { wort: "fű", stufen: ALLE },
  { wort: "kör", stufen: ALLE },
  { wort: "kő", stufen: ALLE },
  { wort: "út", stufen: ALLE },
  { wort: "víz", stufen: ALLE },
  { wort: "híd", stufen: ALLE },
  { wort: "nyúl", stufen: ALLE },
  { wort: "gyümölcs", stufen: ALLE },
  { wort: "szőlő", stufen: ALLE },
  { wort: "csillag", stufen: ALLE },
  { wort: "kesztyű", stufen: ALLE },
  { wort: "tükör", stufen: ALLE },
  { wort: "ünnep", stufen: ALLE },
  { wort: "ceruza", stufen: ALLE },
  { wort: "csütörtök", stufen: ALLE },
  { wort: "pulóver", stufen: ALLE },
  { wort: "lecsó", stufen: ALLE },
  { wort: "sütemény", stufen: ALLE },
  { wort: "gyík", stufen: ALLE },
  { wort: "szilva", stufen: ALLE },
  { wort: "cseresznye", stufen: ALLE },
  { wort: "ezüst", stufen: ALLE },
  { wort: "osztály", stufen: ALLE },
  { wort: "uzsonna", stufen: ALLE },
  { wort: "zsiráf", stufen: ALLE },
  { wort: "szoknya", stufen: ALLE },
  { wort: "dinnye", stufen: ALLE },
  { wort: "fenyő", stufen: ALLE },
  { wort: "hegedű", stufen: ALLE },
  { wort: "gyűrű", stufen: ALLE },
  { wort: "tűzoltó", stufen: ALLE },
  { wort: "papagáj", stufen: ALLE },
  { wort: "sirály", stufen: ALLE },
  { wort: "harkály", stufen: ALLE },
  { wort: "erkély", stufen: ALLE },
  { wort: "pehely", stufen: ALLE },
  { wort: "játszótér", stufen: ALLE },
  { wort: "fagyi", stufen: ALLE },
  { wort: "zsemle", stufen: ALLE },
  { wort: "mogyoró", stufen: ALLE },
  { wort: "kakaó", stufen: ALLE },
  { wort: "nyuszi", stufen: ALLE },
  { wort: "szekrény", stufen: ALLE },
  { wort: "látja", stufen: AB_TEENS },
  { wort: "tudja", stufen: AB_TEENS },
  { wort: "hagyja", stufen: AB_TEENS },
  { wort: "barátság", stufen: AB_TEENS },
  { wort: "egészség", stufen: AB_TEENS },
  { wort: "szabadság", stufen: AB_TEENS },
  { wort: "község", stufen: AB_TEENS },
  { wort: "népdal", stufen: AB_TEENS },
  { wort: "kétszer", stufen: AB_TEENS },
  { wort: "fáradtság", stufen: AB_TEENS },
  { wort: "mindnyájan", stufen: AB_TEENS },
  { wort: "karvaly", stufen: AB_TEENS },
  { wort: "tolvaj", stufen: AB_TEENS },
  { wort: "muszáj", stufen: AB_TEENS },
  { wort: "homály", stufen: AB_TEENS },
  { wort: "dzsungel", stufen: AB_TEENS },
  { wort: "különböző", stufen: AB_TEENS },
  { wort: "jegyzet", stufen: AB_TEENS },
  { wort: "egyesület", stufen: AB_TEENS },
  { wort: "hölgy", stufen: AB_TEENS },
  { wort: "lyukas", stufen: AB_TEENS },
  { wort: "gally", stufen: AB_TEENS },
  { wort: "hosszabb", stufen: AB_TEENS },
  { wort: "könnyebb", stufen: AB_TEENS },
  { wort: "vállalkozás", stufen: AB_TEENS },
  { wort: "kölcsön", stufen: AB_TEENS },
  { wort: "rizzsel", stufen: AB_TEENS },
  { wort: "meggyel", stufen: AB_TEENS },
  { wort: "öccse", stufen: AB_TEENS },
  { wort: "arccal", stufen: AB_TEENS },
  { wort: "ellenőriz", stufen: AB_TEENS },
  { wort: "kezdődik", stufen: AB_TEENS },
  { wort: "megjegyez", stufen: AB_TEENS },
  { wort: "sajnálja", stufen: AB_TEENS },
  { wort: "tanítja", stufen: AB_TEENS },
  { wort: "nézze", stufen: AB_TEENS },
  { wort: "adjuk", stufen: AB_TEENS },
  { wort: "látszik", stufen: AB_TEENS },
  { wort: "akadály", stufen: AB_TEENS },
  { wort: "szabály", stufen: AB_TEENS },
  { wort: "mennyország", stufen: AB_TEENS },
  { wort: "asszonnyal", stufen: AB_TEENS },
  { wort: "hosszúság", stufen: AB_TEENS },
  { wort: "kormányablak", stufen: AB_TEENS },
  { wort: "bizonyítvány", stufen: AB_TEENS },
];
