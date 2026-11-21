/**
 * ★ D-LERNDATEN (25.10.2026): DIE KORREKTURLESE-FÄLLE des Weges „nl" (Niederländisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/nl/tf-fest-nl.json`, Schlüssel `unsinnSaetze` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja (für den Bau) - Vorbehalt: Lese-Abnahme durch Muttersprachler und OpenTaal-Abgleich vor der öffentlichen Freigabe.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `korrekturlesenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Niederländisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * In jedem Satz steht ein falsches, echtes Wort (`falsch`), das im Satz offensichtlich nicht stimmt; `richtig` ist das gemeinte.
 * Ob der Unterschied für eine Sprachausgabe HÖRBAR ist (Johannes 02.09.2026), prüft erst ein Lautschlüssel je Sprache (F8, offen).
 *
 * Verteiler: `korrekturlesen.ts` - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?niederlaendisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-nl.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Korrekturfall } from "./korrekturlesen";

export const KORREKTUR_NL: readonly Korrekturfall[] = [
  { satz: "Wij wonen in een muis aan de gracht.", falsch: "muis", richtig: "huis" },
  { satz: "De kat jaagt op een buis.", falsch: "buis", richtig: "muis" },
  { satz: "Oma breit een warme sjaal van mol.", falsch: "mol", richtig: "wol" },
  { satz: "De bakker maakt brood van veel.", falsch: "veel", richtig: "meel" },
  { satz: "De hond drinkt water uit zijn dak.", falsch: "dak", richtig: "bak" },
  { satz: "In de nacht schijnt de baan.", falsch: "baan", richtig: "maan" },
  { satz: "De visser vangt vissen met een met.", falsch: "met", richtig: "net" },
  { satz: "Ik schrijf mijn naam met een pet.", falsch: "pet", richtig: "pen" },
  { satz: "De trein vertrekt van spoor drie van het stadion.", falsch: "stadion", richtig: "station" },
  { satz: "Mijn bakker gaat elke ochtend om zeven uur af.", falsch: "bakker", richtig: "wekker" },
  { satz: "Ik was mijn handen met water en zeef.", falsch: "zeef", richtig: "zeep" },
  { satz: "In de zomer zwemmen we in de thee.", falsch: "thee", richtig: "zee" },
  { satz: "Op het strand bouw ik een kasteel van tand.", falsch: "tand", richtig: "zand" },
  { satz: "De koe eet glas in de wei.", falsch: "glas", richtig: "gras" },
  { satz: "Sinterklaas rijdt op een wit zwaard.", falsch: "zwaard", richtig: "paard" },
  { satz: "Ik eet een boterham met vaas.", falsch: "vaas", richtig: "kaas" },
  { satz: "De molen draait in de kind.", falsch: "kind", richtig: "wind" },
  { satz: "De boer melkt elke ochtend de kou.", falsch: "kou", richtig: "koe" },
  { satz: "Op de dijk loopt een schaar.", falsch: "schaar", richtig: "schaap" },
  { satz: "Mijn opa leest elke ochtend de kant.", falsch: "kant", richtig: "krant" },
  { satz: "De leerkracht schrijft de som op het boord.", falsch: "boord", richtig: "bord" },
  { satz: "Bij de kapper laat ik mijn haas knippen.", falsch: "haas", richtig: "haar" },
  { satz: "De tandarts kijkt naar mijn tenen.", falsch: "tenen", richtig: "tanden" },
  { satz: "We varen met een boom over de rivier.", falsch: "boom", richtig: "boot" },
  { satz: "De brandweer blust het vuil.", falsch: "vuil", richtig: "vuur" },
  { satz: "Als het regent, trek ik mijn kaarsen aan.", falsch: "kaarsen", richtig: "laarzen" },
  { satz: "De ooievaar staat met zijn lange boten in de sloot.", falsch: "boten", richtig: "poten" },
  { satz: "Op mijn verjaardag eet ik een stuk kaart.", falsch: "kaart", richtig: "taart" },
  { satz: "Mijn zus slaapt in een warm bad.", falsch: "bad", richtig: "bed" },
  { satz: "De dokter luistert naar mijn hert.", falsch: "hert", richtig: "hart" },
  { satz: "In de bibliotheek leen ik een beek.", falsch: "beek", richtig: "boek" },
  { satz: "Op de markt koop ik verse vos.", falsch: "vos", richtig: "vis" },
  { satz: "De kikker kwaakt in de vloot.", falsch: "vloot", richtig: "sloot" },
  { satz: "In de winter draag ik een warme mus.", falsch: "mus", richtig: "muts" },
  { satz: "De bal rolt zo het doek in.", falsch: "doek", richtig: "doel" },
  { satz: "Ik drink bij het ontbijt een glas aap.", falsch: "aap", richtig: "sap" },
  { satz: "In de herfst vallen de bladeren van de bonen.", falsch: "bonen", richtig: "bomen" },
];
