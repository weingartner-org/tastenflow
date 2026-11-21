/**
 * ★ D-LERNDATEN (25.10.2026): DIE BUCHSTABENVERBINDUNGEN FÜR DAS GELÄUFIGKEITSSCHREIBEN des Weges „nl" (Niederländisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/nl/tf-fest-nl.json`, Schlüssel `buchstabenFolgen` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja (für den Bau) - Vorbehalt: Lese-Abnahme durch Muttersprachler und OpenTaal-Abgleich vor der öffentlichen Freigabe.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `gelaeufigkeitCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Niederländisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * Verteiler: `gelaeufigkeit.ts` (prüft jedes Wort mit dem Weg über `fitText`) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?niederlaendisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-nl.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Verbindung } from "./gelaeufigkeit";

export const VERBINDUNGEN_NL: Verbindung[] = [
  { folge: "ij", stelle: "anfang", woerter: ["ijs", "ijsje", "ijzer", "ijver", "ijskast", "ijsbeer", "ijzig", "ijsbaan", "ijshockey", "ijsvogel"] },
  { folge: "ij", stelle: "mitte", woerter: ["tijd", "lijm", "rijst", "lijn", "pijl", "dijk", "wijk", "prijs", "fijn", "kijken", "schrijven", "vijver", "tijger"] },
  { folge: "ij", stelle: "ende", woerter: ["bij", "mij", "wij", "zij", "hij", "jij", "rij", "blij", "vrij", "partij", "schilderij", "voorbij"] },
  { folge: "ei", stelle: "anfang", woerter: ["ei", "eiland", "eind", "einde", "eigen", "eik", "eis", "eitje", "eiwit", "eieren"] },
  { folge: "ei", stelle: "mitte", woerter: ["klein", "trein", "plein", "geit", "reis", "wei", "weide", "heide", "meisje", "veilig", "weinig", "zeilen"] },
  { folge: "ui", stelle: "anfang", woerter: ["uit", "uil", "uilen", "uitgang", "uitleg", "uitnodiging", "uiterst", "uitzicht", "uitslag", "uitvinding"] },
  { folge: "ui", stelle: "mitte", woerter: ["huis", "muis", "tuin", "duif", "fruit", "buik", "duin", "kruid", "sluiten", "ruiken", "buiten", "suiker"] },
  { folge: "eu", stelle: "mitte", woerter: ["deur", "neus", "keuken", "leuk", "kleur", "geur", "reus", "sleutel", "beurt", "jeugd", "heuvel", "keuze"] },
  { folge: "ou", stelle: "mitte", woerter: ["koud", "goud", "hout", "zout", "fout", "bouwen", "houden", "gouden", "vouwen", "schouder"] },
  { folge: "ouw", stelle: "ende", woerter: ["trouw", "vrouw", "touw", "mouw", "bouw", "rouw", "gebouw", "schouw"] },
  { folge: "au", stelle: "mitte", woerter: ["klauw", "blauw", "pauw", "saus", "gauw", "flauw", "kauwen", "rauw", "nauw", "paus", "dauw", "pauze"] },
  { folge: "oe", stelle: "anfang", woerter: ["oefenen", "oefening", "oever", "oerwoud", "oester", "oesters", "oeps", "oerknal", "oehoe", "oefenwedstrijd"] },
  { folge: "oe", stelle: "mitte", woerter: ["boek", "voet", "goed", "doen", "hoed", "groen", "bloem", "koek", "moeder", "broer", "zoeken", "roepen"] },
  { folge: "ie", stelle: "mitte", woerter: ["fiets", "lied", "vier", "dier", "ziek", "riet", "wiel", "mier", "spiegel", "tien", "liever", "vriend"] },
  { folge: "ie", stelle: "ende", woerter: ["knie", "drie", "wie", "die", "zie", "melodie", "familie", "olie", "energie", "politie"] },
  { folge: "aa", stelle: "mitte", woerter: ["maan", "kaas", "jaar", "naam", "paard", "haar", "taart", "waar", "straat", "laat", "baan", "graag"] },
  { folge: "ee", stelle: "mitte", woerter: ["meer", "been", "veel", "weet", "heel", "steen", "beer", "leeg", "zeep", "week", "keel", "neef"] },
  { folge: "ee", stelle: "ende", woerter: ["zee", "mee", "twee", "nee", "thee", "idee", "slee", "snee", "fee"] },
  { folge: "oo", stelle: "mitte", woerter: ["boom", "rood", "brood", "boot", "hoog", "zoon", "groot", "hoop", "kool", "school", "rook", "noord"] },
  { folge: "uu", stelle: "mitte", woerter: ["vuur", "muur", "buurt", "duur", "buur", "zuur", "stuur", "huur", "schuur", "zuurkool"] },
  { folge: "ieuw", stelle: "mitte", woerter: ["nieuw", "nieuws", "nieuwe", "opnieuw", "kieuw", "kieuwen", "nieuwsgierig", "vernieuwen"] },
  { folge: "eeuw", stelle: "mitte", woerter: ["geeuwen", "sneeuw", "leeuw", "meeuw", "spreeuw", "leeuwen", "meeuwen", "schreeuwen", "sneeuwman"] },
  { folge: "aai", stelle: "ende", woerter: ["saai", "haai", "taai", "fraai", "kraai", "lawaai", "baai", "draai", "zwaai"] },
  { folge: "ooi", stelle: "ende", woerter: ["mooi", "prooi", "kooi", "hooi", "fooi", "plooi", "dooi", "gooi", "strooi"] },
  { folge: "oei", stelle: "mitte", woerter: ["groei", "groeien", "bloeien", "roeien", "koeien", "moeilijk", "knoeien", "snoeien", "boeien"] },
  { folge: "sch", stelle: "anfang", woerter: ["school", "schip", "schaap", "schoen", "schaats", "schaar", "schelp", "schep", "schuur", "schouder", "schrift", "schrijven"] },
  { folge: "isch", stelle: "ende", woerter: ["logisch", "typisch", "fantastisch", "praktisch", "elektrisch", "tropisch", "technisch", "toeristisch", "historisch", "kritisch"] },
  { folge: "ch", stelle: "mitte", woerter: ["lachen", "kachel", "lichaam", "goochelen", "pechvogel", "echte", "richting", "achter", "wachten"] },
  { folge: "cht", stelle: "ende", woerter: ["nacht", "licht", "echt", "lucht", "acht", "recht", "vlucht", "zacht", "kracht", "plicht", "gracht", "bericht"] },
  { folge: "ng", stelle: "ende", woerter: ["lang", "ring", "ding", "jong", "tong", "slang", "koning", "bang", "eng", "leerling", "woning"] },
  { folge: "ng", stelle: "mitte", woerter: ["zingen", "jongen", "vangen", "springen", "dingen", "vinger", "engel", "hangen", "slingers"] },
  { folge: "nk", stelle: "ende", woerter: ["dank", "bank", "drank", "klank", "pink", "link", "vonk", "dronk", "schenk"] },
  { folge: "dt", stelle: "ende", woerter: ["wordt", "vindt", "houdt", "rijdt", "antwoordt", "landt", "zendt", "verbindt", "bindt", "leidt"] },
  { folge: "ig", stelle: "ende", woerter: ["aardig", "gezellig", "lastig", "nodig", "prettig", "rustig", "bezig", "handig", "zuinig", "twintig", "vijftig"] },
  { folge: "lijk", stelle: "ende", woerter: ["eerlijk", "moeilijk", "vrolijk", "heerlijk", "duidelijk", "makkelijk", "lelijk", "natuurlijk", "gevaarlijk", "vriendelijk"] },
  { folge: "heid", stelle: "ende", woerter: ["waarheid", "vrijheid", "gezondheid", "snelheid", "schoonheid", "veiligheid", "zekerheid", "mogelijkheid", "eenheid"] },
  { folge: "tje", stelle: "ende", woerter: ["stoeltje", "tafeltje", "feestje", "kastje", "eitje", "wieltje", "karretje", "balletje", "autootje", "bootje"] },
  { folge: "pje", stelle: "ende", woerter: ["boompje", "raampje", "armpje", "bloempje", "duimpje", "lampje", "pompje", "dropje", "snoepje", "soepje"] },
  { folge: "ge", stelle: "anfang", woerter: ["gedaan", "gezien", "geweest", "gemaakt", "geleerd", "geholpen", "gebeld", "gespeeld", "gevonden", "geschreven"] },
  { folge: "be", stelle: "anfang", woerter: ["beter", "begin", "bedankt", "beneden", "beloven", "bezoek", "betalen", "bewegen", "bekijken", "bestellen"] },
  { folge: "ver", stelle: "anfang", woerter: ["verjaardag", "verhaal", "verder", "vergeten", "verkeer", "verhuizen", "vertellen", "verliezen", "verrassing", "verstoppen"] },
  { folge: "ont", stelle: "anfang", woerter: ["ontbijt", "ontdekken", "ontmoeten", "ontvangen", "ontwikkelen", "ontspannen", "ontslag", "ontwerp", "ontwaken"] },
  { folge: "kw", stelle: "anfang", woerter: ["kwart", "kwartier", "kwaad", "kwijt", "kwam", "kwaliteit", "kwestie", "kwal", "kwark", "kwetsen"] },
  { folge: "str", stelle: "anfang", woerter: ["straat", "strand", "stroom", "strijd", "streep", "stro", "straks", "streek", "strik", "stroop"] },
  { folge: "spr", stelle: "anfang", woerter: ["spreken", "springen", "sprookje", "spreeuw", "sprong", "sprinkhaan", "spreekbeurt", "sprint"] },
  { folge: "schr", stelle: "anfang", woerter: ["schrijven", "schrift", "schreeuwen", "schrikken", "schroef", "schrijver", "schrik", "schraal"] },
  { folge: "th", stelle: "anfang", woerter: ["thuis", "thee", "theater", "thema", "therapie", "thermometer", "theepot", "theezakje"] },
  { folge: "ll", stelle: "mitte", woerter: ["ballen", "bellen", "alles", "stellen", "vallen", "willen", "rollen", "zullen", "brillen", "bollen"] },
  { folge: "kk", stelle: "mitte", woerter: ["lekker", "wakker", "slakken", "takken", "dekken", "bakker", "sokken", "rokken", "stukken", "klokken"] },
  { folge: "tt", stelle: "mitte", woerter: ["katten", "letter", "zitten", "zetten", "potten", "wetten", "pitten", "ratten", "matten"] },
  { folge: "pp", stelle: "mitte", woerter: ["happen", "kappen", "stoppen", "kapper", "lappen", "kippen", "klappen", "poppen"] },
  { folge: "nn", stelle: "mitte", woerter: ["mannen", "kennen", "rennen", "pennen", "winnen", "zonnen", "dennen", "spinnen"] },
  { folge: "ss", stelle: "mitte", woerter: ["lessen", "kussen", "wassen", "tassen", "vissen", "missen", "jassen", "flessen"] },
  { folge: "ff", stelle: "mitte", woerter: ["koffie", "koffer", "giraffen", "treffen", "effen", "offer", "stoffen", "straffen"] },
  { folge: "sj", stelle: "anfang", woerter: ["sjaal", "sjouwen", "sjoelen", "sjabloon", "sjerp", "sjofel", "sjokken", "sjoemelen"] },
  { folge: "ë", stelle: "mitte", woerter: ["ideeën", "knieën", "zeeën", "skiën", "poëzie", "patiënt", "financiële", "reëel", "beëindigen", "efficiënt"] },
  { folge: "ï", stelle: "mitte", woerter: ["ruïne", "naïef", "egoïst", "geïnteresseerd", "mozaïek", "cafeïne", "geïnformeerd", "geïnspireerd"] },
  { folge: "é", stelle: "ende", woerter: ["café", "privé", "comité", "cliché", "resumé", "paté", "coupé", "logé"] },
];
