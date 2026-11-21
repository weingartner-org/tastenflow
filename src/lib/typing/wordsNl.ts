/**
 * ★ D-LERNDATEN (25.10.2026): DER ÜBUNGSWORTSCHATZ des Weges „nl" (Niederländisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/nl/tf-fest-nl.json`, Schlüssel `stufenWoerter` und `wortschatz` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja (für den Bau) - Vorbehalt: Lese-Abnahme durch Muttersprachler und OpenTaal-Abgleich vor der öffentlichen Freigabe.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `wordsCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Niederländisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ REIHENFOLGE: Die Wörter stehen in der Reihenfolge der Quelle - sortiert nach der Lern-Folge des Bauplans
 * (`BAUPLAN-2026-10-25-NL.md`), Stufe für Stufe. Die endgültige `NL_LETTER_ORDER` kommt erst mit F4 (`lernweg.ts`); bis dahin ist
 * der Weg ein Alias von „en", und `filterWords` lässt nur durch, was mit den englischen Einheiten tippbar ist. Nach F4: neu nach
 * Sprosse sortieren und die Kontingente je Sprosse prüfen (der Wächter „jedes Wort einer Stufe ist tippbar" liest die Folge aus
 * `lernweg.ts` und läuft, sobald sie dort steht). Das Vorlese-Lexikon liest diese Liste noch nicht (eigenes Fach: F8).
 *
 * Verteiler: `geruestWoerter.ts` ⇒ `generator.ts` (`WORD_BASE`, `STUFE_VOCAB_TABLE`), `uebungsformen/hilfen.ts` (`wortquelle`), `uebungsformen/pyramide.ts` - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?niederlaendisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-nl.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { InhaltsStufe } from "./account";

/** Die Übungswörter des Weges „nl", klein, in der Lern-Folge der Quelle (1094 Wörter). */
export const WORDS_NL: string[] = [
  "ja", "al", "als", "af", "la", "dak", "das", "jas", "kas", "las", "sla", "dal", "laf", "lak", "kaas", "klas", "kaal", "kaak",
  "kalf", "kalk", "slak", "sjaal", "kassa", "salsa", "laad", "daad", "je", "de", "alles", "alle", "elke", "elk", "deel", "deed",
  "leek", "keek", "les", "lees", "leef", "fles", "elf", "keel", "lef", "dek", "kleed", "leed", "eed", "fel", "klasse", "jasje",
  "lesje", "flesje", "lek", "salade", "lade", "slee", "kade", "deksel", "fakkel", "een", "en", "aan", "dan", "kan", "nee", "denk",
  "alleen", "eens", "dank", "na", "snel", "denken", "kans", "land", "kennen", "enkele", "slaan", "deden", "delen", "dansen",
  "nek", "neef", "landen", "dans", "fan", "leden", "kansen", "danken", "lessen", "laden", "kanaal", "keken", "dekken", "naald",
  "deken", "knal", "flessen", "lakens", "kleden", "eend", "snee", "leen", "nadeel", "jassen", "laken", "eenden", "slank",
  "ananas", "eland", "klassen", "kaneel", "sandalen", "laan", "neefje", "eendje", "nadenken", "ik", "is", "in", "die", "jij",
  "kijk", "niks", "idee", "kijken", "kind", "kleine", "sinds", "klein", "fijn", "liefde", "eindelijk", "einde", "lief", "eind",
  "lijn", "links", "ijs", "fijne", "eiland", "lid", "dik", "dikke", "kies", "saai", "flink", "liedje", "dief", "lijf", "lied",
  "lelijk", "snijden", "knie", "kindje", "liedjes", "kijkje", "lijnen", "saaie", "eilanden", "kin", "ijsje", "slikken", "klik",
  "klei", "knielen", "kleinkind", "ski", "dij", "eik", "knikken", "lelie", "dijk", "ei", "kei", "dat", "niet", "te", "dit",
  "iets", "laat", "laten", "niets", "tijd", "net", "altijd", "staat", "steeds", "laatste", "eten", "staan", "kant", "stad",
  "tien", "stil", "feest", "naast", "tafel", "teken", "feestje", "tante", "tas", "lift", "kat", "test", "tekenen", "klant",
  "tanden", "steen", "testen", "kast", "tent", "stilte", "taal", "stenen", "kist", "nat", "tekst", "fiets", "kasteel", "tank",
  "nest", "lente", "tand", "stadje", "tenen", "teen", "fietsen", "tak", "lint", "inkt", "takken", "tennis", "ketel", "tassen",
  "kleintje", "eitje", "katten", "fietstas", "ook", "doen", "of", "ons", "doe", "nooit", "toen", "tot", "kon", "toe", "foto",
  "los", "stond", "koffie", "doel", "stoel", "slot", "dol", "doos", "toilet", "koken", "station", "kilo", "stof", "klok", "olie",
  "oosten", "koekje", "koelkast", "koe", "oefenen", "konijn", "sloot", "stok", "sokken", "olifant", "toast", "koel", "noten",
  "doek", "kook", "kookt", "toetje", "solo", "ontdekken", "konijnen", "olifanten", "stoelen", "stadion", "dolfijnen", "kooi",
  "koekjes", "tolk", "fototoestel", "kok", "er", "naar", "daar", "door", "jaar", "keer", "andere", "anders", "iedereen", "elkaar",
  "klaar", "drie", "eerste", "onder", "kinderen", "dokter", "later", "lekker", "rond", "jaren", "eerlijk", "leren", "drinken",
  "daarna", "straks", "rijden", "aarde", "trek", "raar", "sterk", "straat", "kleren", "reis", "kaart", "kerk", "rij", "rode",
  "rennen", "dieren", "trein", "draaien", "radio", "krant", "rood", "arts", "ster", "strand", "oren", "sterren", "taart",
  "kelder", "kaarten", "rekenen", "kerst", "eieren", "leraar", "lerares", "koffer", "ronde", "donder", "rand", "toren", "rit",
  "draak", "raket", "oranje", "oor", "rok", "rijst", "rots", "het", "hij", "hier", "heeft", "haar", "hoe", "had", "heel", "hele",
  "hallo", "hand", "hadden", "hoor", "heen", "hen", "halen", "horen", "hoofd", "heet", "haal", "handen", "hoi", "hart", "hard",
  "hond", "half", "hotel", "heerlijk", "held", "thee", "hoek", "honden", "honderd", "hoed", "snelheid", "heks", "hek", "theater",
  "hitte", "hol", "helden", "haren", "haak", "hoofdstad", "handdoek", "hert", "herfst", "haai", "hok", "heide", "eekhoorn",
  "hondje", "geen", "nog", "goed", "ga", "gaan", "gaat", "nodig", "tegen", "gedaan", "dag", "geef", "erg", "geld", "genoeg",
  "lang", "graag", "dingen", "krijgen", "goede", "grote", "gek", "jongen", "jongens", "eigen", "dagen", "ding", "ligt", "ogen",
  "groot", "liggen", "langs", "aardig", "gisteren", "koning", "grond", "lange", "honger", "oog", "leggen", "negen", "hoog",
  "angst", "leeg", "hoogte", "ring", "glas", "laag", "garage", "groene", "kleding", "eindigen", "groeien", "tong", "engel",
  "groen", "regen", "groeten", "training", "dertig", "slang", "dinsdag", "donderdag", "golf", "gras", "hagelslag", "giraf",
  "egel", "tijger", "geit", "gans", "hagel", "droog", "maar", "met", "me", "om", "mijn", "hem", "moet", "mij", "kom", "meer",
  "moeten", "man", "mee", "komt", "komen", "mensen", "maken", "mag", "allemaal", "moeder", "maakt", "mooi", "naam", "nemen",
  "samen", "morgen", "meisje", "familie", "mannen", "soms", "kamer", "moeilijk", "mooie", "maanden", "mama", "mogen", "mond",
  "film", "meisjes", "geheim", "makkelijk", "oom", "maand", "hemel", "droom", "jammer", "goedemorgen", "arm", "meester", "raam",
  "mes", "maan", "melk", "storm", "maandag", "markt", "middag", "molen", "lam", "trommel", "klimmen", "dam", "tomaat", "wat",
  "we", "was", "weet", "wel", "wil", "waar", "waarom", "wie", "weg", "gewoon", "weten", "worden", "weer", "twee", "wordt", "wij",
  "wilde", "waren", "willen", "werk", "kwam", "want", "geweldig", "wereld", "werken", "werkt", "welke", "water", "week", "wakker",
  "weken", "tweede", "welkom", "woord", "antwoord", "kwijt", "winnen", "wonen", "wedstrijd", "winkel", "warm", "wonder", "wind",
  "twaalf", "twintig", "wit", "westen", "wolf", "winter", "wandelen", "wassen", "wolken", "wandeling", "woensdag", "kwart",
  "woonkamer", "weide", "windmolen", "wiel", "wadden", "nu", "uit", "jullie", "kunnen", "dus", "jou", "terug", "hun", "huis",
  "uur", "leuk", "houden", "auto", "luister", "nieuwe", "thuis", "rustig", "oude", "tussen", "deur", "nieuws", "gelukkig",
  "ouders", "nummer", "fout", "oud", "geluk", "nieuw", "rug", "luisteren", "leuke", "koud", "sleutel", "sluiten", "muur", "neus",
  "keuken", "huilen", "jurk", "goud", "geluid", "stukje", "ouder", "minuut", "huid", "kleur", "tuin", "kunst", "duur", "kust",
  "gouden", "natuur", "geur", "jeugd", "huiswerk", "touw", "sneeuw", "hout", "suiker", "museum", "uitdaging", "euro", "juni",
  "knuffel", "uil", "muis", "duif", "fruit", "juf", "duin", "van", "voor", "over", "veel", "even", "leven", "vader", "vrouw",
  "vinden", "vast", "vertellen", "geven", "vragen", "vriend", "vraag", "gevonden", "vandaag", "verder", "vroeg", "volgende",
  "vanavond", "vijf", "hoeveel", "vier", "voordat", "vrij", "mevrouw", "verhaal", "vrouwen", "vergeten", "avond", "veilig", "vol",
  "vriendin", "voelt", "ver", "vaak", "vallen", "overal", "voelen", "vroeger", "volgen", "viel", "vuur", "vliegtuig", "vliegen",
  "vriendje", "verrassing", "verjaardag", "vlees", "voet", "voeten", "vakantie", "video", "goedenavond", "vis", "rivier",
  "vissen", "vriendelijk", "vingers", "vrijdag", "vloer", "vogel", "vlag", "vos", "vlinder", "avondeten", "vijver", "vliegveld",
  "heuvel", "heb", "ben", "hebben", "bij", "bedankt", "beter", "binnen", "blijven", "beetje", "bang", "beste", "buiten", "bijna",
  "blij", "brengen", "broer", "blijft", "beginnen", "bellen", "boven", "bed", "voorbij", "begin", "buurt", "beneden", "baan",
  "betalen", "boek", "boos", "bank", "boot", "band", "gebouw", "geboren", "brief", "bal", "bekijken", "broek", "bus", "benen",
  "boeken", "bos", "boom", "blauwe", "bouwen", "ontbijt", "brug", "bloemen", "bad", "berg", "blauw", "buik", "bomen", "badkamer",
  "boerderij", "brood", "bril", "busje", "bijen", "beer", "boer", "bloem", "boter", "bord", "bibliotheek", "broodje", "boterham",
  "bloembol", "ze", "zijn", "zo", "zou", "zal", "deze", "zien", "onze", "zeggen", "zit", "zeker", "zie", "zoals", "zij", "gezien",
  "zitten", "zullen", "zonder", "zorgen", "zelfs", "zelf", "zoon", "zat", "zoek", "zoeken", "zorg", "zes", "zin", "zus",
  "ziekenhuis", "ziek", "zeven", "muziek", "lezen", "zak", "gezin", "zwaar", "zon", "zuster", "kiezen", "zee", "bezoek", "zingen",
  "zware", "zwart", "langzaam", "zomer", "duizend", "gezond", "reizen", "zwemmen", "zaterdag", "huizen", "zuiden", "zondag",
  "zwembad", "gezellig", "seizoen", "zand", "roze", "zusje", "zout", "ezel", "zebra", "zwaan", "zeehond", "zwaluw", "zeilen",
  "zeilboot", "zoet", "zalm", "zakgeld", "op", "praten", "helpen", "paar", "hoop", "open", "pas", "hulp", "pijn", "plan",
  "spreken", "help", "plek", "praat", "stoppen", "spelen", "lopen", "papa", "slapen", "plezier", "spel", "spullen", "helpt",
  "loop", "verkopen", "prijs", "groep", "grapje", "plannen", "paard", "park", "opa", "knap", "hopen", "openen", "kamp", "post",
  "springen", "paarden", "prins", "prinses", "kip", "pauze", "papier", "pizza", "punten", "slaapkamer", "piloot", "pop",
  "spiegel", "aap", "april", "soep", "tulp", "tulpen", "polder", "pannenkoek", "pepernoten", "potlood", "pen", "spin",
  "paddenstoel", "kapper", "lepel", "peer", "perzik", "dorp", "echt", "toch", "misschien", "zich", "achter", "wachten", "slecht",
  "school", "dochter", "echte", "nacht", "dicht", "recht", "licht", "beschermen", "voorzichtig", "prachtig", "schip", "acht",
  "lucht", "kracht", "camera", "schrijven", "bericht", "lachen", "club", "computer", "dichtbij", "vannacht", "ochtend", "schoon",
  "lach", "schattig", "coach", "cadeau", "zicht", "oceaan", "centrum", "chauffeur", "vriendschap", "zacht", "douche", "concert",
  "chocola", "chocolade", "speculaas", "schaatsen", "schaats", "schaap", "schaar", "schelp", "schep", "schuur", "schoen",
  "schoenen", "schouder", "schrift", "schrijver", "cactus", "circus", "citroen", "conducteur", "kachel", "lichaam", "carnaval",
  "cacao", "gracht", "foto's", "auto's", "oma's", "opa's", "menu's", "radio's", "zo'n", "ideeën", "knieën", "zeeën", "skiën",
  "beëindigen", "reëel", "poëzie", "patiënt", "patiënten", "efficiënt", "financiële", "officiële", "materiële", "ruïne", "naïef",
  "egoïst", "geïnteresseerd", "geïnformeerd", "mozaïek", "cafeïne", "geïnspireerd", "één", "café", "cafés", "privé", "comité",
  "cliché", "baby's", "baby", "type", "jury", "systeem", "typisch", "hobby", "pony", "yoga", "pyjama", "mysterie", "symbool",
  "fysiek", "hypotheek", "typen", "typt", "gym", "gymles", "hockey", "rugby", "yoghurt", "extra", "taxi", "examen", "excuus",
  "expert", "experiment", "luxe", "exact", "extreem", "mix", "box", "textiel", "saxofoon", "dyslexie", "xylofoon", "quiz",
  "squash", "aquarium", "aquarel", "frequent", "frequentie", "quarantaine",
];

/** Der Themenwortschatz je Inhaltsstufe (Kinder 107, Jugend 94, Erwachsene 78). */
export const STUFE_VOCAB_NL: Record<InhaltsStufe, string[]> = {
  kids: [
    "school", "klas", "juf", "meester", "schrift", "potlood", "liniaal", "rugzak", "pauze", "schoolplein", "fiets", "helm",
    "fietspad", "hond", "kat", "konijn", "cavia", "hamster", "egel", "eekhoorn", "uil", "vos", "haas", "zwaan", "eend", "reiger",
    "ooievaar", "zeehond", "koe", "paard", "schaap", "geit", "kip", "hagelslag", "pindakaas", "boterham", "stroopwafel",
    "speculaas", "pepernoten", "oliebol", "poffertjes", "pannenkoek", "wafel", "vlaai", "friet", "drop", "ijsje", "snoep",
    "chocolade", "taart", "koekje", "sinterklaas", "schoen", "gedicht", "surprise", "cadeau", "lampion", "kermis", "carnaval",
    "verjaardag", "kaarsje", "vlag", "oranje", "polder", "dijk", "molen", "windmolen", "sloot", "kanaal", "sluis", "boot", "strand",
    "duin", "schelp", "zand", "meeuw", "vuurtoren", "vlieger", "sneeuw", "schaats", "schaatsen", "sneeuwpop", "slee", "muts",
    "sjaal", "kachel", "ijsbaan", "tulp", "regenboog", "paraplu", "laarzen", "regenjas", "bos", "heide", "paddenstoel", "speeltuin",
    "glijbaan", "schommel", "knikkers", "verstoppertje", "tikkertje", "bal", "voetbal", "hockey", "zwembad", "grootouders",
    "kleinkind",
  ],
  teens: [
    "vriendschap", "vriendengroep", "huiswerk", "rooster", "toets", "rapport", "mentor", "schooljaar", "smartphone", "chatbericht",
    "filmpje", "spelletje", "game", "playlist", "koptelefoon", "oordopjes", "muziek", "concert", "festival", "podcast", "sporthal",
    "training", "wedstrijd", "wielrennen", "goalball", "korfbal", "turnen", "zeilen", "surfen", "skaten", "bijbaantje", "zakgeld",
    "spaarpot", "klimaat", "duurzaam", "zeespiegel", "deltawerken", "stormvloed", "zonnepanelen", "windpark", "recyclen",
    "uitwisseling", "schoolkamp", "schoolreis", "excursie", "robot", "programmeren", "uitvinding", "chip", "techniek",
    "ruimtevaart", "astronaut", "vrijwilliger", "stage", "beroepskeuze", "opleiding", "studierichting", "trein", "station",
    "perron", "overstappen", "fietsenstalling", "paralympisch", "medaille", "kampioen", "toernooi", "ploeg", "trainer", "lef",
    "twijfel", "durven", "samenwerken", "eerlijk", "respect", "gezellig", "vlog", "verhaal", "mening", "debat", "fietstocht",
    "klimmuur", "escaperoom", "bioscoop", "strip", "tekening", "fotografie", "dansles", "gitaar", "drumstel", "podium",
    "jeugdbeweging", "scouting", "camping", "kamperen",
  ],
  erwachsen: [
    "werkgever", "werknemer", "collega", "vergadering", "overleg", "deeltijd", "thuiswerken", "pensioen", "salaris", "loon",
    "werkrooster", "huurwoning", "koopwoning", "hypotheek", "energierekening", "verwarming", "isolatie", "warmtepomp", "verhuizing",
    "buren", "huisarts", "apotheek", "ziekenhuis", "afspraak", "verzekering", "zorgkosten", "gemeente", "gemeentehuis", "loket",
    "formulier", "aanvraag", "paspoort", "identiteitskaart", "rijbewijs", "belasting", "aangifte", "uitkering", "digitaal",
    "wachtwoord", "inloggen", "beveiliging", "privacy", "toegankelijk", "schermlezer", "brailleleesregel", "vereniging",
    "vrijwilligerswerk", "mantelzorg", "pendelen", "fietsroute", "spits", "vertraging", "nieuws", "krant", "verkiezingen",
    "gemeenteraad", "duurzaamheid", "overstroming", "kustverdediging", "hoogwater", "supermarkt", "boodschappen", "markt",
    "bakkerij", "kassa", "cursus", "bijscholing", "sollicitatie", "vacature", "kinderopvang", "ouderavond", "laadpaal", "deelauto",
    "huurcontract", "notaris", "tandarts", "fysiotherapeut", "griepprik",
  ],
};
