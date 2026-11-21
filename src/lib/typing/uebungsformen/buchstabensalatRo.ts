/**
 * ★ D-LERNDATEN (25.10.2026): DIE QUELLWÖRTER DES BUCHSTABENSALATS des Weges „ro" (Rumänisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/ro/tf-fest-ro.json`, Schlüssel `schreibWoerter` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja, unter einer Bedingung: Eine muttersprachliche Person liest die Stellen aus Abschnitt 5 noch einmal.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `buchstabensalatCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Rumänisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ Der Ertrag je Quellwort (mindestens `SALAT_ZIEL` echte Wörter) ist NICHT gemessen: er wird gegen das Lexikon der Sprache
 * gezählt (`lexikonWoerter("ro")`), und ein Fach für „ro" baut erst F8 (`lexicon.ts`). Bis dahin findet der Salat auf diesem
 * Weg keine Funde und bietet sich nicht an - die Daten liegen bereit.
 *
 * Verteiler: `buchstabensalat.ts` (Namen ausschliessen: `salatNamen${Xx}.ts`, noch leer) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?rumaenisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-ro.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Salatwort } from "./buchstabensalat";

const ALLE: Salatwort["stufen"] = ["kids", "teens", "erwachsen"];
const AB_TEENS: Salatwort["stufen"] = ["teens", "erwachsen"];

export const SALATWOERTER_RO: Salatwort[] = [
  { wort: "pădure", stufen: ALLE },
  { wort: "fereastră", stufen: ALLE },
  { wort: "școală", stufen: ALLE },
  { wort: "câine", stufen: ALLE },
  { wort: "pâine", stufen: ALLE },
  { wort: "țară", stufen: ALLE },
  { wort: "mâine", stufen: ALLE },
  { wort: "mâncare", stufen: ALLE },
  { wort: "prăjitură", stufen: ALLE },
  { wort: "cățel", stufen: ALLE },
  { wort: "pisică", stufen: ALLE },
  { wort: "broască", stufen: ALLE },
  { wort: "înghețată", stufen: ALLE },
  { wort: "ciocolată", stufen: ALLE },
  { wort: "ghiozdan", stufen: ALLE },
  { wort: "creion", stufen: ALLE },
  { wort: "copii", stufen: ALLE },
  { wort: "copiii", stufen: ALLE },
  { wort: "idee", stufen: ALLE },
  { wort: "ceas", stufen: ALLE },
  { wort: "cireașă", stufen: ALLE },
  { wort: "gheață", stufen: ALLE },
  { wort: "ghindă", stufen: ALLE },
  { wort: "chitară", stufen: ALLE },
  { wort: "unchi", stufen: ALLE },
  { wort: "ochi", stufen: ALLE },
  { wort: "ureche", stufen: ALLE },
  { wort: "veveriță", stufen: ALLE },
  { wort: "frunză", stufen: ALLE },
  { wort: "rândunică", stufen: ALLE },
  { wort: "stejar", stufen: ALLE },
  { wort: "castravete", stufen: ALLE },
  { wort: "ceapă", stufen: ALLE },
  { wort: "usturoi", stufen: ALLE },
  { wort: "căpșună", stufen: ALLE },
  { wort: "zmeură", stufen: ALLE },
  { wort: "păpușă", stufen: ALLE },
  { wort: "minge", stufen: ALLE },
  { wort: "bicicletă", stufen: ALLE },
  { wort: "lingură", stufen: ALLE },
  { wort: "furculiță", stufen: ALLE },
  { wort: "ceașcă", stufen: ALLE },
  { wort: "cântec", stufen: ALLE },
  { wort: "râu", stufen: ALLE },
  { wort: "munte", stufen: ALLE },
  { wort: "fluture", stufen: ALLE },
  { wort: "albină", stufen: ALLE },
  { wort: "furnică", stufen: ALLE },
  { wort: "arici", stufen: ALLE },
  { wort: "iepure", stufen: ALLE },
  { wort: "zăpadă", stufen: ALLE },
  { wort: "primăvară", stufen: ALLE },
  { wort: "toamnă", stufen: ALLE },
  { wort: "mărțișor", stufen: ALLE },
  { wort: "cozonac", stufen: ALLE },
  { wort: "mămăligă", stufen: ALLE },
  { wort: "plăcintă", stufen: ALLE },
  { wort: "ciorbă", stufen: ALLE },
  { wort: "brânză", stufen: ALLE },
  { wort: "ghiocel", stufen: ALLE },
  { wort: "vioară", stufen: ALLE },
  { wort: "țânțar", stufen: ALLE },
  { wort: "șoarece", stufen: ALLE },
  { wort: "șosea", stufen: ALLE },
  { wort: "iarbă", stufen: ALLE },
  { wort: "ieri", stufen: ALLE },
  { wort: "oaie", stufen: ALLE },
  { wort: "ouă", stufen: ALLE },
  { wort: "două", stufen: ALLE },
  { wort: "nouă", stufen: ALLE },
  { wort: "băiat", stufen: ALLE },
  { wort: "bunică", stufen: ALLE },
  { wort: "stea", stufen: ALLE },
  { wort: "cafea", stufen: ALLE },
  { wort: "aceeași", stufen: AB_TEENS },
  { wort: "aceea", stufen: AB_TEENS },
  { wort: "fiii", stufen: AB_TEENS },
  { wort: "neîncredere", stufen: AB_TEENS },
  { wort: "înnorat", stufen: AB_TEENS },
  { wort: "înnoi", stufen: AB_TEENS },
  { wort: "reînnoit", stufen: AB_TEENS },
  { wort: "câteodată", stufen: AB_TEENS },
  { wort: "diseară", stufen: AB_TEENS },
  { wort: "niciun", stufen: AB_TEENS },
  { wort: "nicio", stufen: AB_TEENS },
  { wort: "examen", stufen: AB_TEENS },
  { wort: "exercițiu", stufen: AB_TEENS },
  { wort: "excursie", stufen: AB_TEENS },
  { wort: "xilofon", stufen: AB_TEENS },
  { wort: "accident", stufen: AB_TEENS },
  { wort: "succes", stufen: AB_TEENS },
  { wort: "accent", stufen: AB_TEENS },
  { wort: "aceștia", stufen: AB_TEENS },
  { wort: "creează", stufen: AB_TEENS },
  { wort: "conștiință", stufen: AB_TEENS },
  { wort: "știință", stufen: AB_TEENS },
  { wort: "înțelepciune", stufen: AB_TEENS },
  { wort: "hotărâre", stufen: AB_TEENS },
  { wort: "coborî", stufen: AB_TEENS },
  { wort: "hotărî", stufen: AB_TEENS },
  { wort: "înăuntru", stufen: AB_TEENS },
  { wort: "întâmplare", stufen: AB_TEENS },
  { wort: "chiuvetă", stufen: AB_TEENS },
  { wort: "ghiveci", stufen: AB_TEENS },
  { wort: "ochelari", stufen: AB_TEENS },
  { wort: "geografie", stufen: AB_TEENS },
  { wort: "poezie", stufen: AB_TEENS },
  { wort: "bibliotecă", stufen: AB_TEENS },
  { wort: "aeroport", stufen: AB_TEENS },
  { wort: "familiei", stufen: AB_TEENS },
  { wort: "prietenii", stufen: AB_TEENS },
];
