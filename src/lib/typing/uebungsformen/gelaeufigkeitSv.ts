/**
 * ★ D-LERNDATEN (25.10.2026): DIE BUCHSTABENVERBINDUNGEN FÜR DAS GELÄUFIGKEITSSCHREIBEN des Weges „sv" (Schwedisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/sv/tf-fest-sv.json`, Schlüssel `buchstabenFolgen` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja, unter zwei Bedingungen: Die Punkte 1 und 5 aus §5 müssen technisch geklärt werden, und ein Mensch mit Schwedisch als Erstsprache sollte das Ganze gegenlesen.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `gelaeufigkeitCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Schwedisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * Verteiler: `gelaeufigkeit.ts` (prüft jedes Wort mit dem Weg über `fitText`) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?schwedisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-sv.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Verbindung } from "./gelaeufigkeit";

export const VERBINDUNGEN_SV: Verbindung[] = [
  { folge: "sj", stelle: "anfang", woerter: ["sjö", "sju", "sjuk", "sjunga", "själv", "sjal", "sjätte", "sjuttio", "sjunde", "sjöng", "sjukhus", "sjöar"] },
  { folge: "skj", stelle: "anfang", woerter: ["skjorta", "skjuta", "skjuts", "skjul", "skjortan", "skjortor", "skjuter", "skjutsa"] },
  { folge: "stj", stelle: "anfang", woerter: ["stjärna", "stjärnor", "stjälk", "stjärnhimmel", "stjärnorna", "stjärnklar", "stjäla", "stjärnan"] },
  { folge: "sch", stelle: "anfang", woerter: ["schampo", "schema", "schack", "schlager", "schäfer", "schemat", "schackbräde", "schampot"] },
  { folge: "sk", stelle: "anfang", woerter: ["skola", "skog", "skor", "skal", "skicka", "skriva", "skratta", "skidor", "skåp", "skärm", "skön", "sked"] },
  { folge: "tj", stelle: "anfang", woerter: ["tjej", "tjugo", "tjock", "tjäna", "tjänst", "tjejer", "tjära", "tjuv", "tjugoett", "tjocka"] },
  { folge: "kj", stelle: "anfang", woerter: ["kjol", "kjolen", "kjolar", "kjortel", "kjolarna", "kjolens", "kjolfåll", "kjortlar"] },
  { folge: "dj", stelle: "anfang", woerter: ["djur", "djup", "djungel", "djupt", "djuret", "djuren", "djärv", "djupa", "djurpark"] },
  { folge: "gj", stelle: "anfang", woerter: ["gjorde", "gjort", "gjuta", "gjuten", "gjutjärn", "gjordes", "gjuter", "gjutning"] },
  { folge: "hj", stelle: "anfang", woerter: ["hjälp", "hjälpa", "hjärta", "hjälte", "hjul", "hjärna", "hjortron", "hjort", "hjälm", "hjälper"] },
  { folge: "lj", stelle: "anfang", woerter: ["ljus", "ljud", "ljuga", "ljung", "ljuv", "ljust", "ljudet", "ljuset", "ljusare", "ljuskrona"] },
  { folge: "st", stelle: "anfang", woerter: ["stor", "stad", "sten", "stol", "stig", "storm", "stuga", "strand", "stark", "stjärna", "stå", "stanna"] },
  { folge: "sp", stelle: "anfang", woerter: ["spel", "spela", "spis", "spår", "springa", "spegel", "sport", "spara", "spik", "spindel", "spänd"] },
  { folge: "str", stelle: "anfang", woerter: ["strand", "ström", "strömming", "strax", "strumpa", "streck", "stress", "stråle", "struts"] },
  { folge: "spr", stelle: "anfang", woerter: ["språk", "springa", "sprang", "spricka", "sprida", "spruta", "springer", "spröd", "språket", "sprattla"] },
  { folge: "skr", stelle: "anfang", woerter: ["skriva", "skrev", "skratta", "skrika", "skrivare", "skrivbord", "skruv", "skräp", "skrapa", "skridskor"] },
  { folge: "kv", stelle: "anfang", woerter: ["kväll", "kvar", "kvinna", "kvart", "kvitto", "kvist", "kvarter", "kvalitet", "kvick", "kvittra"] },
  { folge: "sv", stelle: "anfang", woerter: ["svar", "svara", "svart", "svensk", "svenska", "svamp", "svan", "svår", "svett", "svans"] },
  { folge: "tv", stelle: "anfang", woerter: ["två", "tvätta", "tvål", "tvärs", "tvilling", "tvinga", "tvekar", "tvätt", "tvåa", "tvärt"] },
  { folge: "fj", stelle: "anfang", woerter: ["fjäll", "fjäril", "fjärde", "fjorton", "fjäder", "fjord", "fjärran", "fjol", "fjällen", "fjärilar"] },
  { folge: "å", stelle: "anfang", woerter: ["år", "åka", "åtta", "åker", "åska", "ål", "ån", "åter", "åskväder", "årstid"] },
  { folge: "ä", stelle: "anfang", woerter: ["äta", "äpple", "älg", "älska", "ärlig", "äng", "ägg", "ämne", "ändå", "äventyr"] },
  { folge: "ö", stelle: "anfang", woerter: ["öga", "öra", "öde", "öppna", "öster", "över", "öken", "ödla", "öka", "önska"] },
  { folge: "ng", stelle: "mitte", woerter: ["ingen", "länge", "många", "finger", "tunga", "lingon", "längre", "sängen", "kringla", "ängel"] },
  { folge: "ng", stelle: "ende", woerter: ["lång", "sång", "gång", "ring", "säng", "ting", "äng", "ung", "kung", "tvång", "spring", "sväng"] },
  { folge: "nk", stelle: "mitte", woerter: ["tänka", "tanke", "tänker", "sänka", "blänka", "sjunka", "enkel", "enkelt", "bänken", "tankar"] },
  { folge: "gn", stelle: "ende", woerter: ["regn", "vagn", "ugn", "lugn", "dygn", "barnvagn", "spårvagn", "sovvagn", "bakugn", "snöregn"] },
  { folge: "ck", stelle: "mitte", woerter: ["mycket", "socker", "flicka", "vacker", "docka", "klocka", "ficka", "backe", "fickan"] },
  { folge: "ck", stelle: "ende", woerter: ["tack", "säck", "däck", "rock", "block", "lock", "bock", "klack", "check", "ryck"] },
  { folge: "ll", stelle: "mitte", woerter: ["alla", "illa", "kalla", "fyller", "tillsammans", "hallon", "kulle", "villa", "mellan", "fjällen", "ballong"] },
  { folge: "ss", stelle: "mitte", woerter: ["kassa", "massa", "vessla", "gissa", "passa", "mössa", "lussekatt", "prinsessa", "kassett"] },
  { folge: "tt", stelle: "mitte", woerter: ["katten", "sätta", "titta", "mitten", "natten", "lätta", "glittra", "åtta", "vatten"] },
  { folge: "nn", stelle: "mitte", woerter: ["kanna", "vinna", "finns", "annan", "innan", "minnas", "tunna", "känna", "spinna", "pannkaka"] },
  { folge: "mm", stelle: "mitte", woerter: ["sommar", "himmel", "simma", "hemma", "komma", "mamma", "rummet", "timmar", "kommun"] },
  { folge: "pp", stelle: "mitte", woerter: ["pappa", "äpple", "uppe", "toppen", "hoppa", "trappa", "soppa", "klippa"] },
  { folge: "gg", stelle: "mitte", woerter: ["ägget", "uggla", "skugga", "mygga", "bygga", "lägga", "ligga", "brygga"] },
  { folge: "rr", stelle: "mitte", woerter: ["herrar", "ekorre", "förra", "karriär", "terrass", "torra", "borra", "sparris", "kärra"] },
  { folge: "ff", stelle: "mitte", woerter: ["kaffe", "giraffen", "skaffa", "träffa", "saffran", "offer", "staffli", "tuffa"] },
  { folge: "dd", stelle: "mitte", woerter: ["kudde", "rädda", "bädda", "klädda", "ladda", "padda", "kladdig", "sladden", "kudden"] },
  { folge: "rs", stelle: "mitte", woerter: ["varsågod", "färsk", "kursen", "torsdag", "marsch", "versen", "orsak", "torsk", "persika", "marsvin", "korsord"] },
  { folge: "rt", stelle: "mitte", woerter: ["karta", "tårta", "förtjust", "vartannat", "fortsätta", "bortom", "artist", "portar"] },
  { folge: "rn", stelle: "mitte", woerter: ["barnen", "järnväg", "hörnet", "kvarnen", "kärnan", "stjärnor", "hjärnan", "kornen"] },
  { folge: "rd", stelle: "mitte", woerter: ["jorden", "bordet", "gården", "orden", "fjärde", "värdig", "sjukvården", "hårda", "värde", "hörde"] },
  { folge: "tion", stelle: "ende", woerter: ["station", "lektion", "motion", "nation", "information", "portion", "position", "tradition", "generation", "situation"] },
  { folge: "het", stelle: "ende", woerter: ["frihet", "säkerhet", "enhet", "nyhet", "hemlighet", "skönhet", "möjlighet", "ensamhet", "trygghet", "nyfikenhet"] },
  { folge: "ning", stelle: "ende", woerter: ["tidning", "sanning", "lösning", "träning", "ordning", "simning", "ledning", "teckning", "räkning"] },
  { folge: "lig", stelle: "ende", woerter: ["lycklig", "farlig", "vanlig", "trevlig", "ärlig", "härlig", "verklig", "möjlig", "känslig"] },
  { folge: "ig", stelle: "ende", woerter: ["färdig", "duktig", "hungrig", "orolig", "törstig", "tidig", "ledig", "rolig", "klibbig"] },
  { folge: "are", stelle: "ende", woerter: ["lärare", "läkare", "skrivare", "spelare", "tränare", "målare", "bagare", "snickare", "åkare", "läsare"] },
  { folge: "isk", stelle: "ende", woerter: ["klassisk", "samisk", "praktisk", "logisk", "musikalisk", "kritisk", "elektrisk", "teknisk", "politisk"] },
  { folge: "else", stelle: "ende", woerter: ["födelse", "händelse", "rörelse", "kallelse", "upplevelse", "rättelse", "förståelse", "betydelse"] },
  { folge: "ar", stelle: "ende", woerter: ["dagar", "bilar", "fåglar", "hundar", "stolar", "vintrar", "pojkar", "sjöar", "skogar", "bollar"] },
  { folge: "or", stelle: "ende", woerter: ["flickor", "skolor", "gator", "klockor", "kvinnor", "dockor", "pennor", "lampor", "stjärnor", "gurkor"] },
  { folge: "ä", stelle: "mitte", woerter: ["här", "där", "säng", "väg", "häst", "träd", "väl", "själv", "mätt"] },
  { folge: "å", stelle: "mitte", woerter: ["gård", "båt", "tåg", "spår", "mål", "låda", "nål", "fågel"] },
  { folge: "ö", stelle: "mitte", woerter: ["höst", "röd", "grön", "söt", "mössa", "skön", "stöd", "dörr", "möte"] },
  { folge: "é", stelle: "ende", woerter: ["idé", "armé", "kafé", "allé", "turné", "trofé", "gelé", "entré", "kliché", "ateljé", "succé", "kommitté"] },
];
