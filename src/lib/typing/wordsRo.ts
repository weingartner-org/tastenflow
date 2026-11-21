/**
 * ★ D-LERNDATEN (25.10.2026): DER ÜBUNGSWORTSCHATZ des Weges „ro" (Rumänisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/ro/tf-fest-ro.json`, Schlüssel `stufenWoerter` und `wortschatz` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja, unter einer Bedingung: Eine muttersprachliche Person liest die Stellen aus Abschnitt 5 noch einmal.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `wordsCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Rumänisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ REIHENFOLGE: Die Wörter stehen in der Reihenfolge der Quelle - sortiert nach der Lern-Folge des Bauplans
 * (`BAUPLAN-2026-10-25-RO.md`), Stufe für Stufe. Die endgültige `RO_LETTER_ORDER` kommt erst mit F4 (`lernweg.ts`); bis dahin ist
 * der Weg ein Alias von „en", und `filterWords` lässt nur durch, was mit den englischen Einheiten tippbar ist. Nach F4: neu nach
 * Sprosse sortieren und die Kontingente je Sprosse prüfen (der Wächter „jedes Wort einer Stufe ist tippbar" liest die Folge aus
 * `lernweg.ts` und läuft, sobald sie dort steht). Das Vorlese-Lexikon liest diese Liste noch nicht (eigenes Fach: F8).
 *
 * Verteiler: `geruestWoerter.ts` ⇒ `generator.ts` (`WORD_BASE`, `STUFE_VOCAB_TABLE`), `uebungsformen/hilfen.ts` (`wortquelle`), `uebungsformen/pyramide.ts` - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?rumaenisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-ro.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { InhaltsStufe } from "./account";

/** Die Übungswörter des Weges „ro", klein, in der Lern-Folge der Quelle (1149 Wörter). */
export const WORDS_RO: string[] = [
  "la", "da", "sa", "al", "las", "afla", "sala", "fals", "lada", "așa", "aș", "șa", "de", "se", "le", "fel", "deja", "ale", "ele",
  "ales", "dea", "șase", "sale", "des", "șef", "lase", "afle", "false", "adesea", "deal", "alee", "șasea", "alese", "jale", "și",
  "ai", "fi", "ei", "fie", "fii", "ia", "dai", "idee", "iei", "ieși", "ideea", "ies", "iese", "afli", "idei", "seif", "ideile",
  "fiii", "ideal", "lei", "felie", "fidel", "ieșea", "aleși", "leii", "șefi", "felii", "fildeș", "felia", "asta", "este", "te",
  "ești", "ta", "știi", "stai", "dat", "astea", "știe", "tale", "data", "alte", "astfel", "alt", "sta", "aflat", "altfel", "stat",
  "ieșit", "ști", "fete", "alta", "fetele", "stea", "știa", "lista", "știai", "tai", "date", "est", "test", "taie", "altele",
  "sat", "detalii", "stele", "etaj", "sfat", "stil", "teste", "detaliile", "fetei", "set", "sete", "state", "lift", "stelele",
  "satelit", "testat", "eu", "tu", "lui", "știu", "au", "sau", "uite", "luat", "fiu", "destul", "dau", "iau", "sus", "ajuta",
  "dus", "lua", "fiul", "adus", "uitat", "stau", "ajut", "uita", "știut", "aud", "ușa", "uit", "felul", "ajute", "șeful", "altul",
  "ajutat", "aflu", "sufletul", "sud", "sute", "suflet", "fiului", "destule", "duș", "aude", "testul", "stilul", "etajul",
  "satul", "statul", "sfatul", "studiat", "ușile", "statului", "ulei", "destui", "fusese", "adult", "știau", "studiu", "iulie",
  "util", "detaliu", "șefului", "titlul", "nu", "un", "sunt", "din", "ne", "tine", "unde", "ani", "unul", "niște", "una", "ajuns",
  "unui", "unei", "luni", "sunat", "an", "unele", "unii", "unu", "anul", "fiind", "suna", "atent", "sens", "luna", "liniște",
  "final", "linia", "dejun", "dans", "nunta", "șansa", "linie", "atins", "anii", "liniștit", "nasul", "sine", "sune", "insula",
  "nas", "inelul", "fine", "anului", "unitatea", "destinul", "șanse", "sunet", "inel", "asistenta", "sunetul", "unitate",
  "talent", "lunii", "inutil", "ieftin", "dinainte", "adunat", "indian", "identitate", "student", "anulat", "asistent",
  "identitatea", "unt", "unuia", "iunie", "dar", "ar", "era", "are", "iar", "dintre", "trei", "seara", "erau", "tare", "fratele",
  "frate", "erai", "intrat", "restul", "jur", "reușit", "afara", "ieri", "jurul", "aer", "intra", "stare", "interesant", "tras",
  "diferit", "indiferent", "distrus", "aur", "real", "diferite", "rea", "adresa", "strada", "rușine", "dura", "intri", "durere",
  "teren", "așadar", "arate", "trist", "durerea", "rele", "interesat", "treia", "dur", "restaurant", "starea", "naștere",
  "aranjat", "realitate", "ars", "tren", "trenul", "reuși", "tineri", "suferit", "arde", "serie", "tinere", "știri", "referi",
  "sertar", "internet", "ieșire", "refer", "fratelui", "treilea", "intrare", "sari", "deranja", "natura", "aerul", "fereastra",
  "ce", "cu", "ca", "care", "aici", "face", "cred", "faci", "cine", "nici", "fac", "atunci", "acest", "deci", "cel", "lucru",
  "ceea", "fiecare", "cea", "cei", "aceasta", "duc", "acesta", "lucruri", "casa", "cele", "trecut", "lucrurile", "aceste",
  "aceea", "duci", "ciudat", "cer", "crede", "cale", "duce", "acel", "cinci", "acea", "niciun", "același", "fiica", "fericit",
  "aduc", "acestea", "cerut", "aduce", "acela", "scris", "clar", "trece", "ci", "suficient", "direct", "traducerea", "sincer",
  "scrie", "afaceri", "cafea", "aceeași", "treci", "caut", "lucrat", "cui", "acele", "accident", "acești", "citit", "secret",
  "cere", "carte", "asculta", "cartea", "cina", "aduci", "fost", "doar", "tot", "foarte", "acolo", "noi", "toate", "totul", "loc",
  "nou", "jos", "orice", "doi", "lor", "serios", "nostru", "locul", "ori", "noastre", "ajutor", "corect", "ore", "nicio", "ușor",
  "cunosc", "joc", "acord", "telefon", "nori", "oraș", "ora", "doua", "noroc", "deloc", "sora", "cunoscut", "totuși", "foc",
  "uneori", "dori", "tuturor", "folosit", "doctor", "oricine", "telefonul", "ajutorul", "deoarece", "cunoști", "celor", "doresc",
  "dor", "noștri", "ordine", "noua", "folosi", "orașul", "rost", "continua", "control", "noul", "totdeauna", "scoate", "conduce",
  "doare", "scos", "folosesc", "dorit", "jocul", "locuri", "doilea", "nord", "oferit", "cadou", "joci", "scot", "am", "mai",
  "cum", "acum", "mine", "mea", "meu", "mult", "nimic", "suntem", "mare", "mama", "domnule", "nimeni", "oameni", "facem", "multe",
  "lumea", "oamenii", "numele", "om", "mele", "numai", "eram", "cam", "simt", "tocmai", "mereu", "imediat", "terminat", "frumos",
  "mei", "drumul", "minute", "mie", "femeie", "ultima", "moment", "seama", "camera", "minunat", "familia", "credeam", "asemenea",
  "lume", "mașina", "știm", "omul", "mod", "drum", "mic", "trimis", "știam", "inima", "nume", "familie", "mers", "mersi", "minte",
  "mari", "amintesc", "urma", "doamna", "momentul", "fim", "ultimul", "femei", "normal", "milioane", "munca", "să", "că", "mă",
  "dacă", "făcut", "rău", "tău", "fără", "niciodată", "toată", "acasă", "două", "această", "dată", "tatăl", "afară", "noastră",
  "facă", "adică", "măcar", "mamă", "tată", "urmă", "altă", "ascultă", "casă", "fată", "lăsat", "mașină", "doamnă", "odată",
  "arată", "nouă", "frumoasă", "către", "lăsa", "tăi", "său", "oră", "muncă", "rămas", "mică", "fiindcă", "sună", "jumătate",
  "numărul", "luăm", "dă", "șansă", "școală", "cameră", "frică", "intră", "lasă", "multă", "trecută", "arăt", "seară", "dăm",
  "continuă", "stă", "caută", "masă", "află", "teamă", "termină", "tatălui", "alături", "oară", "uită", "fericită", "lună",
  "cealaltă", "celălalt", "mătură", "pe", "pentru", "poate", "pot", "spus", "despre", "pare", "putea", "timp", "spun", "spune",
  "după", "prea", "spui", "putem", "place", "prin", "apoi", "timpul", "peste", "parte", "aproape", "repede", "fapt", "putut",
  "prima", "dreptate", "noapte", "partea", "plecat", "spre", "departe", "pierdut", "copii", "plec", "tipul", "așteaptă", "copil",
  "tip", "primul", "pus", "pic", "noaptea", "pune", "cap", "primit", "patru", "prins", "simplu", "prieten", "important", "pasă",
  "pun", "pleci", "prieteni", "pleacă", "capul", "apă", "copilul", "spate", "prietenul", "pleca", "spatele", "copiii", "pace",
  "perfect", "plecăm", "persoană", "parcă", "plac", "faptul", "asupra", "drept", "pur", "prietenii", "va", "ceva", "voi", "vă",
  "vreau", "vrei", "nevoie", "avem", "vom", "cineva", "vei", "vor", "vrea", "avea", "venit", "avut", "văd", "vrut", "vedem",
  "adevărat", "vine", "vedea", "vreo", "vreodată", "vii", "altceva", "veni", "vina", "adevărul", "aveam", "vreme", "motiv",
  "devreme", "revedere", "vină", "undeva", "cumva", "vadă", "vreun", "vrem", "altcineva", "devenit", "voiam", "vitamine",
  "voastră", "povestea", "dumneavoastră", "viitoare", "poveste", "vedere", "voie", "evident", "salvat", "privire", "privește",
  "potrivit", "vostru", "vede", "vremea", "avocat", "bine", "trebuie", "bună", "trebui", "bun", "bani", "vorbesc", "probabil",
  "trebuia", "iubesc", "sub", "banii", "treaba", "vorba", "trebuit", "bune", "vorbești", "problema", "vorbim", "ba", "probleme",
  "problemă", "vorbit", "bucur", "vorbi", "treabă", "posibil", "bărbat", "buni", "vorbește", "abia", "aibă", "liber", "băiat",
  "biroul", "obicei", "birou", "absolut", "bea", "baie", "iubit", "slujba", "vorbească", "imposibil", "incredibil", "slujbă",
  "bate", "observat", "bolnav", "alb", "iubești", "iubire", "ambele", "iubește", "vorbă", "în", "îmi", "îl", "îi", "încă",
  "înainte", "înapoi", "înseamnă", "împreună", "început", "între", "își", "întotdeauna", "încercat", "încredere", "întors",
  "începe", "împotriva", "încearcă", "întoarce", "încerc", "întorc", "întreb", "înăuntru", "încerca", "însă", "întrebare",
  "întrebat", "întrebări", "încerci", "începem", "încep", "întorci", "încet", "întoarcem", "întrebi", "încercăm", "încoace",
  "întrebarea", "începi", "întuneric", "înaintea", "întrebam", "întoarcă", "întreba", "îți", "poți", "mulțumesc", "puțin", "toți",
  "ați", "viața", "sunteți", "viață", "aveți", "înțeles", "simți", "față", "fața", "puteți", "băieți", "mulți", "faceți", "soția",
  "veți", "știți", "ține", "dimineața", "vreți", "dimineață", "soțul", "ție", "bineînțeles", "ceilalți", "părinții", "învățat",
  "uiți", "obține", "simțit", "țin", "poliție", "ții", "cauți", "mulțime", "veniți", "credeți", "luați", "vedeți", "spuneți",
  "fiți", "situația", "informații", "ajuți", "atenție", "vieții", "polițist", "băieții", "plecați", "minți", "rog", "sigur",
  "regulă", "mergem", "merge", "găsit", "gata", "grijă", "singur", "greu", "merg", "griji", "ajunge", "singură", "mergi", "dragă",
  "găsi", "singura", "singurul", "legătură", "sigură", "găsesc", "greșit", "genul", "găsim", "regula", "trage", "draga", "gura",
  "dragoste", "fugi", "ajung", "agent", "pregătit", "meargă", "greșeală", "dragostea", "gură", "fugit", "găsești", "regele",
  "negru", "ajungem", "legătura", "general", "ajungi", "atinge", "lungă", "glumești", "grămadă", "legat", "grea", "singuri",
  "grup", "alege", "întreaga", "îngrijorat", "îndrăgostit", "înțeleg", "siguranță", "înțelegi", "drăguț", "drăguță", "înțelege",
  "crezi", "văzut", "vezi", "zi", "auzit", "ziua", "scuze", "zis", "zile", "crezut", "azi", "cazul", "cauza", "caz", "grozav",
  "zici", "contează", "auzi", "astăzi", "zic", "zăpadă", "amuzant", "zice", "zece", "lucrez", "lucrează", "zona", "căzut",
  "lucrezi", "muzica", "funcționează", "baza", "trezit", "deranjează", "magazin", "zilele", "interesează", "sezonul", "pierzi",
  "surpriză", "urmează", "scuzați", "dovezi", "zonă", "ziarul", "zbor", "pauză", "groaznic", "rezolva", "muzică", "când", "până",
  "cât", "atât", "decât", "întâmplat", "câteva", "întâmplă", "târziu", "mâine", "gândit", "lângă", "câte", "mâna", "curând",
  "gând", "rămâne", "întâmpla", "amândoi", "mâinile", "gândesc", "sâmbătă", "întâi", "sfârșit", "pământ", "săptămâni", "încât",
  "întâlnit", "întâlnire", "mâncare", "atâta", "rămâi", "gândeam", "mână", "gândești", "săptămână", "rând", "câștigat", "cuvânt",
  "săptămâna", "câțiva", "rămân", "sfârșitul", "cuvântul", "mâncat", "câine", "întâmple", "sâmbăta", "tânăr", "stânga", "chiar",
  "ochii", "chestia", "echipa", "deschide", "schimbat", "ochi", "cheamă", "vechi", "schimb", "schimba", "echipă", "deschis",
  "hotel", "unchiul", "hainele", "chemat", "cheia", "chestie", "veche", "haine", "schimbă", "cheile", "pahar", "schimbare",
  "chem", "pereche", "chef", "deschisă", "rochia", "schimbe", "deschid", "ghici", "cheie", "schimbi", "rochie", "chema",
  "genunchi", "chestiune", "echipei", "haina", "vechiul", "ochiul", "pachet", "hotelul", "hol", "vechea", "ureche", "harta",
  "urechile", "închis", "închide", "hobby", "spray", "curry", "rugby", "yoga", "există", "exact", "exista", "exemplu", "excelent",
  "explic", "extrem", "existat", "excepția", "explica", "taxi", "aproximativ", "experiență", "extraordinar", "existe", "fix",
  "excursie", "explică", "explici", "expert", "explicat", "explicație", "weekend", "weekendul", "web", "watt", "squash",
];

/** Der Themenwortschatz je Inhaltsstufe (Kinder 127, Jugend 70, Erwachsene 63). */
export const STUFE_VOCAB_RO: Record<InhaltsStufe, string[]> = {
  kids: [
    "școală", "clasă", "elev", "elevă", "învățătoare", "caiet", "creion", "penar", "ghiozdan", "carte", "pauză", "recreație",
    "bancă", "tablă", "colegă", "coleg", "prieten", "prietenă", "joacă", "joc", "minge", "păpușă", "bicicletă", "trotinetă",
    "leagăn", "tobogan", "parc", "nisip", "mamă", "tată", "bunică", "bunic", "frate", "soră", "mătușă", "unchi", "casă", "cameră",
    "pat", "jucărie", "pisică", "cățel", "iepuraș", "veveriță", "arici", "ursuleț", "fluture", "buburuză", "albină", "melc",
    "broască", "pește", "măr", "pară", "prună", "cireașă", "căpșună", "pepene", "lapte", "pâine", "covrig", "plăcintă", "clătite",
    "înghețată", "ciocolată", "soare", "lună", "stea", "nor", "ploaie", "zăpadă", "curcubeu", "vânt", "iarnă", "vară", "toamnă",
    "primăvară", "mărțișor", "colindă", "cozonac", "cadou", "tort", "aniversare", "petrecere", "cântec", "desen", "culoare", "roșu",
    "galben", "albastru", "verde", "alb", "negru", "pădure", "munte", "râu", "mare", "plajă", "scoică", "barcă", "deltă", "zâmbet",
    "râs", "poveste", "basm", "zână", "dragon", "prințesă", "vrăjitor", "dimineață", "seară", "noapte", "azi", "mâine", "ieri",
    "sanie", "zmeu", "patine", "castel", "căciulă", "mănuși", "acuarele", "plastilină", "bulgăre", "lanternă", "ghicitoare",
    "cățeluș",
  ],
  teens: [
    "prietenie", "încredere", "respect", "secret", "glumă", "echipă", "temă", "test", "teză", "notă", "medie", "olimpiadă",
    "proiect", "laborator", "experiment", "bibliotecă", "matematică", "fizică", "chimie", "biologie", "istorie", "geografie",
    "informatică", "telefon", "aplicație", "mesaj", "internet", "calculator", "tabletă", "parolă", "cont", "postare", "videoclip",
    "concert", "trupă", "muzică", "chitară", "festival", "film", "serial", "antrenament", "campionat", "meci", "medalie", "stadion",
    "mediu", "reciclare", "natură", "voluntariat", "excursie", "tabără", "vacanță", "călătorie", "viitor", "meserie", "facultate",
    "liceu", "admitere", "bacalaureat", "emoție", "curaj", "vis", "competiție", "podcast", "orar", "diriginte", "prezentare",
    "dezbatere", "atelier", "robotică",
  ],
  erwachsen: [
    "birou", "ședință", "firmă", "client", "salariu", "factură", "impozit", "credit", "contract", "chirie", "apartament", "bloc",
    "vecin", "primărie", "dosar", "formular", "cerere", "adeverință", "certificat", "buletin", "pașaport", "programare", "ghișeu",
    "asigurare", "medic", "farmacie", "rețetă", "spital", "cumpărături", "magazin", "piață", "reducere", "livrare", "comandă",
    "abonament", "transport", "autobuz", "tramvai", "metrou", "tren", "gară", "bilet", "autostradă", "comunitate", "cartier",
    "asociație", "voluntar", "consiliu", "muzeu", "teatru", "expoziție", "pensie", "concediu", "angajare", "interviu", "experiență",
    "colaborare", "termen", "economii", "buget", "negociere", "angajator", "ipotecă",
  ],
};
