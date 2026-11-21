/**
 * ★ D-LERNDATEN (25.10.2026): DIE KORREKTURLESE-FÄLLE des Weges „hu" (Ungarisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/hu/tf-fest-hu.json`, Schlüssel `unsinnSaetze` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja - unter Vorbehalt der muttersprachlichen Abnahme und der Entscheidung zu Punkt 6.1“ (Alkohol bei der Jugend).
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `korrekturlesenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Ungarisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * In jedem Satz steht ein falsches, echtes Wort (`falsch`), das im Satz offensichtlich nicht stimmt; `richtig` ist das gemeinte.
 * Ob der Unterschied für eine Sprachausgabe HÖRBAR ist (Johannes 02.09.2026), prüft erst ein Lautschlüssel je Sprache (F8, offen).
 *
 * Verteiler: `korrekturlesen.ts` - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?ungarisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-hu.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Korrekturfall } from "./korrekturlesen";

export const KORREKTUR_HU: readonly Korrekturfall[] = [
  { satz: "A ló a pajtában szenet eszik.", falsch: "szenet", richtig: "szénát" },
  { satz: "A méhek finom mezt készítenek.", falsch: "mezt", richtig: "mézet" },
  { satz: "Délben egy tányér forró levelet eszünk.", falsch: "levelet", richtig: "levest" },
  { satz: "A tanító a tálra írja fel a feladatot.", falsch: "tálra", richtig: "táblára" },
  { satz: "A haj gyorsan úszik a patakban.", falsch: "haj", richtig: "hal" },
  { satz: "A kovács új patkányt tett a ló lábára.", falsch: "patkányt", richtig: "patkót" },
  { satz: "A gólya a köményen rakott fészket.", falsch: "köményen", richtig: "kéményen" },
  { satz: "Ebédre egy nagy fazék gulyát főztem.", falsch: "gulyát", richtig: "gulyást" },
  { satz: "Lefekvés előtt mindig fogast mosok.", falsch: "fogast", richtig: "fogat" },
  { satz: "A vonat a színen robog Debrecen felé.", falsch: "színen", richtig: "sínen" },
  { satz: "A pók friss kenyeret süt a sarki boltban.", falsch: "pók", richtig: "pék" },
  { satz: "A ló a réten lebeg.", falsch: "lebeg", richtig: "legel" },
  { satz: "Nagymama meleg sárat kötött nekem télire.", falsch: "sárat", richtig: "sálat" },
  { satz: "Leültünk a kertben a puha fűrészre.", falsch: "fűrészre", richtig: "fűre" },
  { satz: "Az orvos alaposan megvizsgálta a betűt.", falsch: "betűt", richtig: "beteget" },
  { satz: "A boltban kenyeret és tetőt vettem reggelire.", falsch: "tetőt", richtig: "tejet" },
  { satz: "Este kimegyünk, és a csillárokat nézzük az égen.", falsch: "csillárokat", richtig: "csillagokat" },
  { satz: "A buszt a megállóban varrom.", falsch: "varrom", richtig: "várom" },
  { satz: "A diákok szép sárban állnak a menza előtt.", falsch: "sárban", richtig: "sorban" },
  { satz: "Kerek egy pohár vizet!", falsch: "Kerek", richtig: "Kérek" },
  { satz: "A gyerekek korban táncolnak az udvaron.", falsch: "korban", richtig: "körben" },
  { satz: "A szőlőből finom bőr lesz.", falsch: "bőr", richtig: "bor" },
  { satz: "A tóban esténként bárkák brekegnek.", falsch: "bárkák", richtig: "békák" },
  { satz: "A szakáll gulyáslevest főz az étteremben.", falsch: "szakáll", richtig: "szakács" },
  { satz: "A fodrász rövidre vágta a hajómat.", falsch: "hajómat", richtig: "hajamat" },
  { satz: "A macska dobol az ölemben.", falsch: "dobol", richtig: "dorombol" },
  { satz: "Szép idő van, kimegyünk a parókába.", falsch: "parókába", richtig: "parkba" },
  { satz: "Születésnapomra csokis torkot kaptam.", falsch: "torkot", richtig: "tortát" },
  { satz: "A kirándulás után sajtos lett a cipőm.", falsch: "sajtos", richtig: "sáros" },
  { satz: "Hétvégén a hegedűbe kirándulunk.", falsch: "hegedűbe", richtig: "hegyekbe" },
  { satz: "Nyáron a Balatonban fűzünk.", falsch: "fűzünk", richtig: "fürdünk" },
  { satz: "A mókus ügyesen ugrál ágról ágyra.", falsch: "ágyra", richtig: "ágra" },
  { satz: "A kertben répát, borsót és bábot ültettünk.", falsch: "bábot", richtig: "babot" },
  { satz: "Télen a gyerekek szánkóznak a gombon.", falsch: "gombon", richtig: "dombon" },
  { satz: "Ma reggel nagy pelyhekben esik a ló.", falsch: "ló", richtig: "hó" },
  { satz: "Reggelire a kenyérre vasat kenek.", falsch: "vasat", richtig: "vajat" },
  { satz: "A tehén egész nap a mezen legel.", falsch: "mezen", richtig: "mezőn" },
  { satz: "Nyáron a strandon fagyot eszünk.", falsch: "fagyot", richtig: "fagyit" },
  { satz: "A Mikulás a kitisztított csizmákba ajándékot és szalonnát tesz.", falsch: "szalonnát", richtig: "szaloncukrot" },
];
