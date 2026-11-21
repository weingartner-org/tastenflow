/**
 * ★ D-LERNDATEN (25.10.2026): DER ÜBUNGSWORTSCHATZ des Weges „hu" (Ungarisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/hu/tf-fest-hu.json`, Schlüssel `stufenWoerter` und `wortschatz` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja - unter Vorbehalt der muttersprachlichen Abnahme und der Entscheidung zu Punkt 6.1“ (Alkohol bei der Jugend).
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `wordsCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Ungarisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ REIHENFOLGE: Die Wörter stehen in der Reihenfolge der Quelle - sortiert nach der Lern-Folge des Bauplans
 * (`BAUPLAN-2026-10-25-HU.md`), Stufe für Stufe. Die endgültige `HU_LETTER_ORDER` kommt erst mit F4 (`lernweg.ts`); bis dahin ist
 * der Weg ein Alias von „en", und `filterWords` lässt nur durch, was mit den englischen Einheiten tippbar ist. Nach F4: neu nach
 * Sprosse sortieren und die Kontingente je Sprosse prüfen (der Wächter „jedes Wort einer Stufe ist tippbar" liest die Folge aus
 * `lernweg.ts` und läuft, sobald sie dort steht). Das Vorlese-Lexikon liest diese Liste noch nicht (eigenes Fach: F8).
 *
 * Verteiler: `geruestWoerter.ts` ⇒ `generator.ts` (`WORD_BASE`, `STUFE_VOCAB_TABLE`), `uebungsformen/hilfen.ts` (`wortquelle`), `uebungsformen/pyramide.ts` - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?ungarisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-hu.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { InhaltsStufe } from "./account";

/** Die Übungswörter des Weges „hu", klein, in der Lern-Folge der Quelle (1200 Wörter). */
export const WORDS_HU: string[] = [
  "ad", "add", "adj", "adja", "adjak", "jaj", "dal", "dala", "fa", "fal", "falak", "faj", "alak", "alakja", "akad", "fakad",
  "sas", "sakk", "falka", "alja", "lak", "kajak", "lakk", "és", "él", "élj", "éld", "fél", "félj", "kék", "kés", "késés", "dél",
  "éjfél", "éj", "séf", "fék", "lé", "de", "kell", "el", "le", "fel", "se", "éjjel", "felé", "édes", "félek", "elé", "élek",
  "kelj", "jel", "fele", "feje", "fej", "lélek", "jele", "éles", "felfelé", "lelke", "jelek", "féle", "kel", "kedd", "lelkes",
  "eladja", "feladja", "felkel", "kések", "fedél", "fejek", "eleje", "esés", "felkelés", "jelel", "lefelé", "ess", "is", "ki",
  "aki", "kis", "ide", "akik", "ideje", "fia", "kifelé", "kissé", "siess", "esik", "lakik", "illik", "déli", "kié", "akikkel",
  "lelki", "lila", "késik", "éli", "éjjeli", "idei", "leesik", "idefelé", "sisak", "kiesik", "fedi", "élik", "kiadja", "kifli",
  "itt", "te", "két", "este", "tessék", "lett", "alatt", "ti", "akit", "tedd", "tette", "teljes", "tett", "élet", "fekete",
  "fiatal", "tele", "kit", "életet", "estét", "adta", "élete", "esett", "felett", "élt", "fajta", "esti", "eset", "telt", "test",
  "teli", "étel", "tej", "jelet", "kettes", "keleti", "feladat", "ital", "lista", "illat", "fest", "falat", "tejet", "sajt",
  "téli", "delta", "séta", "tél", "kelet", "adat", "lift", "festék", "talaj", "tea", "lakat", "félt", "kalitka", "tejes", "én",
  "ne", "neki", "neked", "lenne", "senki", "kellene", "lenni", "innen", "teljesen", "ennek", "nekik", "annak", "tenni", "jelent",
  "ellen", "jelenti", "ketten", "élni", "adni", "kinek", "nektek", "kint", "ennél", "lassan", "enni", "fent", "lent", "ellene",
  "inni", "jelen", "idén", "elleni", "fenn", "néni", "jelentés", "eladni", "kaland", "félénk", "eleinte", "tini", "latin",
  "télen", "élénk", "tinta", "ének", "énekel", "énekes", "idefent", "kedden", "estén", "delfin", "int", "intés", "jelenet",
  "feltesz", "az", "ez", "azt", "ezt", "lesz", "szia", "ezzel", "készen", "kész", "néz", "tiszta", "éjszaka", "nézni", "kezd",
  "szinte", "zene", "szél", "zenét", "tészta", "kéz", "kezek", "szék", "asztal", "zenész", "fizika", "tenisz", "kezdeni", "nem",
  "mi", "mit", "mint", "minden", "sem", "amit", "nekem", "majd", "semmi", "ami", "ma", "mindent", "semmit", "miatt", "mindenki",
  "menj", "minket", "mind", "menni", "ment", "majdnem", "mai", "film", "kellemes", "alma", "mese", "matek", "matematika", "kémia",
  "emelet", "mama", "mesél", "emlékszem", "messze", "kezem", "szemem", "méz", "mézes", "szem", "zsemle", "miért", "mert", "értem",
  "arra", "kérem", "erre", "kérlek", "akar", "mire", "remek", "remélem", "férfi", "érdekel", "marad", "kérdés", "érdekes",
  "keres", "rendes", "mester", "friss", "eredeti", "kert", "tanterem", "kréta", "terem", "tér", "rét", "rétes", "kar", "térd",
  "férj", "internet", "farmer", "azért", "ezért", "szerint", "szeretnék", "érzem", "szeretem", "érzés", "ezer", "szerelem",
  "rész", "rajz", "terasz", "szerda", "most", "akkor", "ott", "amikor", "sok", "mondta", "mondtam", "akarok", "akarom", "sosem",
  "oda", "sokat", "sokkal", "fontos", "mondott", "okos", "onnan", "sajnos", "titkos", "finom", "sokan", "alkalom", "iskola",
  "telefon", "oldal", "torta", "toll", "olaj", "torna", "tornaterem", "irodalom", "fotel", "orr", "forint", "majom", "krokodil",
  "nokedli", "rossz", "azok", "azonnal", "sokszor", "zokni", "rajzol", "mozi", "igen", "addig", "eddig", "ég", "alig", "esetleg",
  "eléggé", "elég", "ideges", "jelenleg", "idegen", "eleget", "félig", "elégedett", "jelenlegi", "tag", "jég", "légi", "engedni",
  "tégla", "liget", "ingatlan", "legenda", "feleség", "ing", "meg", "még", "mindig", "maga", "fog", "engem", "dolog", "magam",
  "mégis", "fogok", "gond", "reggel", "régi", "meleg", "régen", "rengeteg", "magas", "angol", "tenger", "érettségi", "egér",
  "tigris", "reggeli", "igaz", "egész", "igazi", "dolgozik", "egészen", "dolgozom", "gazdag", "zongora", "sziget", "kitalál",
  "talán", "át", "saját", "áll", "látni", "alá", "fáj", "annál", "talált", "találni", "játék", "nálad", "állat", "ajándék",
  "teát", "talál", "idáig", "lakás", "sétálni", "diák", "állás", "ajánlat", "táska", "fák", "fát", "elegáns", "elefánt", "saláta",
  "ág", "ágak", "fakanál", "tál", "tálak", "kilátás", "nádas", "láda", "átlag", "átad", "átadja", "gát", "látja", "lát", "sétál",
  "már", "rá", "más", "láttam", "másik", "látom", "második", "drága", "korán", "álom", "dráma", "madár", "tanár", "lángos",
  "málna", "mák", "mákos", "gitár", "ár", "nadrág", "rák", "aztán", "igazán", "igazság", "játszani", "szám", "száz", "ország",
  "gáz", "száj", "zsiráf", "oroszlán", "darázs", "tornász", "garázs", "egy", "nagyon", "olyan", "tényleg", "milyen", "ilyen",
  "nagy", "gyere", "egyszer", "annyira", "egyik", "megyek", "anya", "figyelj", "egyetlen", "megy", "komolyan", "lány", "gyorsan",
  "ennyi", "király", "négy", "gyerek", "melyik", "gyerekek", "komoly", "egyre", "szegény", "kislány", "gyors", "gyakran",
  "aranyos", "gyenge", "fény", "arany", "mély", "nyár", "meggy", "dinnye", "gyertya", "nyak", "nyit", "kenyér", "gyár", "tanya",
  "nyereg", "ágy", "fagyi", "magyar", "osztály", "tantárgy", "jegy", "légy", "szoknya", "regény", "ha", "lehet", "hát", "hadd",
  "tehát", "néha", "hét", "hat", "héten", "hallani", "hihetetlen", "lehetetlen", "hideg", "éhes", "hal", "hálás", "hall", "hang",
  "hétig", "halad", "tehetséges", "heti", "haja", "haj", "hetente", "hit", "láthatatlan", "tehén", "hajnal", "halak", "hinta",
  "hinták", "hajt", "hála", "hangja", "hol", "soha", "három", "ahol", "honnan", "otthon", "fehér", "hatalmas", "hirtelen",
  "itthon", "harmadik", "hold", "homok", "méh", "hogy", "ahogy", "hogyan", "néhány", "hozzá", "nehéz", "haza", "hely", "helyes",
  "ház", "helyett", "helyi", "hegy", "hegyek", "hagyma", "hangya", "halászlé", "van", "volt", "vagy", "vagyok", "volna", "valami",
  "valamit", "vele", "vissza", "vannak", "valaki", "velem", "veled", "várj", "vége", "mivel", "kedves", "végre", "éves", "hová",
  "világ", "valaha", "neve", "év", "viszont", "vigyázz", "vár", "nevem", "venni", "város", "valahogy", "végig", "távol", "orvos",
  "válasz", "véletlen", "tavaly", "levél", "vaj", "villamos", "vonat", "medve", "virág", "tavasz", "havazik", "evezés", "verseny",
  "vihar", "villám", "olvas", "olvasás", "testvér", "nyelv", "nyelvtan", "szilva", "vidám", "lentebb", "ablak", "ebéd", "rendben",
  "be", "biztos", "ember", "benne", "jobb", "emberek", "inkább", "jobban", "ebben", "legjobb", "tovább", "beszélni", "legalább",
  "bele", "abba", "boldog", "beszél", "szabad", "barát", "bár", "beteg", "bent", "baba", "szoba", "barátok", "bal", "darab",
  "bátor", "kisebb", "bab", "bolt", "kabát", "láb", "bárány", "galamb", "bagoly", "béka", "bokor", "szombat", "jobbra", "balra",
  "labda", "dobol", "barna", "kosárlabda", "bajnok", "bronz", "liba", "birka", "dobostorta", "bejgli", "ébred", "zebra", "bátyám",
  "tudom", "tudod", "tudja", "vagyunk", "ugye", "után", "tudok", "tud", "tudni", "munka", "utána", "buli", "ruha", "durva",
  "unalmas", "busz", "uborka", "burgonya", "gulyás", "kutya", "ujj", "utazás", "futball", "kenu", "futás", "uszoda", "gulya",
  "juhász", "galuska", "nyuszi", "tanul", "tanulás", "kenguru", "futni", "munkahely", "uzsonna", "ugrik", "kedvenc", "csak",
  "nincs", "kicsit", "micsoda", "vicces", "furcsa", "csodálatos", "család", "kicsi", "csodás", "kocsi", "szerencsés", "nyolc",
  "vacsora", "csoda", "bácsi", "cég", "herceg", "kilenc", "csend", "cél", "kulcs", "tanács", "karácsony", "csendes", "alacsony",
  "macska", "csirke", "tánc", "csillag", "csésze", "csomag", "kalács", "csiga", "ceruza", "kacsa", "citrom", "cseresznye",
  "barack", "meccs", "foci", "csokoládé", "bicikli", "malac", "kukorica", "lebbencs", "kecske", "katica", "cukor", "cukrászda",
  "csárda", "csizma", "csengetés", "persze", "pedig", "nap", "szép", "pár", "apa", "épp", "holnap", "pontosan", "pont", "tegnap",
  "perc", "éppen", "szépen", "pénz", "pillanat", "probléma", "például", "csapat", "alapján", "szuper", "kap", "nappal",
  "kapcsolat", "papa", "meglepetés", "kép", "plusz", "gép", "piros", "lépés", "park", "parti", "profi", "vasárnap", "pontos",
  "pohár", "csoport", "nagyapa", "dupla", "péntek", "templom", "pálya", "pogácsa", "palacsinta", "lepke", "pulyka", "cipzár",
  "sapka", "paprika", "paradicsom", "krumpli", "sárgarépa", "pingpong", "kapus", "sport", "kerékpár", "puszta", "kapu", "polc",
  "csap", "program", "zápor", "paprikás", "piac", "pulcsi", "pizsama", "papucs", "lámpa", "kapor", "kanapé", "köszönöm",
  "történt", "több", "ön", "jön", "jött", "össze", "többet", "összes", "között", "öt", "köszi", "öreg", "közel", "ötlet", "többi",
  "közben", "elnök", "föld", "sötét", "közös", "vörös", "történet", "könnyen", "hölgy", "többiek", "legtöbb", "rövid", "zöld",
  "könyv", "döntés", "öröm", "szöveg", "ötös", "bögre", "kötél", "köd", "ködös", "tölgy", "zöldség", "körte", "pörkölt",
  "szöcske", "tejföl", "történelem", "földrajz", "ölel", "igazgató", "mókus", "csikós", "jó", "jól", "szóval", "róla", "szó",
  "utolsó", "arról", "attól", "óta", "óra", "valójában", "való", "szól", "igazából", "ajtó", "csomó", "mód", "hajó", "valódi",
  "óvatosan", "régóta", "hasonló", "autó", "apró", "forró", "kiváló", "olcsó", "ló", "kórház", "hó", "gyógyszer", "dió",
  "mogyoró", "só", "óvoda", "gólya", "róka", "holló", "olló", "tolltartó", "kakaó", "pulóver", "folyó", "tó", "lecsó", "gombóc",
  "fóka", "pillangó", "póló", "rózsa", "játszótér", "rádió", "csónak", "birkózás", "őket", "őt", "első", "mielőtt", "előtt", "ők",
  "nő", "először", "erről", "idő", "később", "következő", "főnök", "előbb", "ebből", "előre", "erős", "kettő", "késő", "őszinte",
  "előző", "főleg", "belső", "levegő", "felnőtt", "hős", "idős", "erdő", "eső", "edző", "mindkettő", "ősz", "hétfő", "szőlő",
  "nővér", "óvónő", "őz", "mező", "főzés", "főz", "cipő", "felhő", "teknős", "lépcső", "esernyő", "képernyő", "tanárnő", "fenyő",
  "csengő", "hegedül", "együtt", "egyedül", "nélkül", "örülök", "sikerült", "különleges", "ügy", "keresztül", "belül", "szükség",
  "körül", "büszke", "üres", "ügyes", "üzlet", "épület", "ülni", "sült", "szünet", "repülő", "ezüst", "süti", "tükör",
  "csütörtök", "szürke", "sün", "sütő", "üveg", "sütemény", "füzet", "ülés", "ünnep", "születésnap", "fül", "tüdő", "gyümölcs",
  "kürtőskalács", "fürdő", "fürdőszoba", "ügyel", "fürge", "kerül", "gyík", "kígyó", "tanító", "így", "amíg", "számít",
  "segíteni", "míg", "szívesen", "segítség", "kívül", "tíz", "víz", "hír", "kíváncsi", "híres", "írta", "ír", "szív", "író",
  "cím", "színész", "vízilabda", "bíró", "radír", "híd", "vívás", "üdítő", "kíván", "írás", "vasút", "fiú", "úgy", "túl", "új",
  "újra", "hosszú", "múlt", "út", "szomorú", "súlyos", "húsz", "ifjú", "kisfiú", "hús", "tanú", "lassú", "kút", "húg", "nyúl",
  "tyúk", "csúszda", "úszás", "túró", "túrós", "túra", "gémeskút", "nagyszerű", "gyönyörű", "egyszerűen", "működik", "egyszerű",
  "könnyű", "hűtő", "tű", "fű", "szűk", "műsor", "tűzoltó", "gyűrű", "kesztyű", "hűvös", "fűszer", "fűzfa", "betű", "hegedű",
  "wifi", "web", "watt", "show", "taxi", "extra", "fax", "luxus", "galaxis", "oxigén", "maximum", "maximális", "extrém", "fix",
  "squash",
];

/** Der Themenwortschatz je Inhaltsstufe (Kinder 154, Jugend 81, Erwachsene 73). */
export const STUFE_VOCAB_HU: Record<InhaltsStufe, string[]> = {
  kids: [
    "iskola", "osztály", "tanító", "osztálytárs", "padtárs", "füzet", "könyv", "ceruza", "toll", "radír", "tolltartó",
    "iskolatáska", "tábla", "kréta", "szünet", "udvar", "csengő", "uzsonna", "tízórai", "ötös", "dolgozat", "olvasás", "írás",
    "számolás", "mese", "játék", "labda", "hinta", "csúszda", "homokozó", "játszótér", "barát", "barátnő", "anya", "apa", "testvér",
    "nagymama", "nagypapa", "kutya", "macska", "nyuszi", "mókus", "sün", "gólya", "katica", "csiga", "pillangó", "ló", "tehén",
    "malac", "kacsa", "liba", "bárány", "lángos", "palacsinta", "pogácsa", "kakaó", "kifli", "alma", "körte", "szilva", "dinnye",
    "meggy", "eper", "fagyi", "csoki", "torta", "tej", "víz", "szörp", "leves", "lecke", "karácsony", "farsang", "jelmez",
    "születésnap", "ajándék", "hóember", "szánkó", "korcsolya", "bicikli", "roller", "foci", "úszás", "uszoda", "strand", "tó",
    "erdő", "hegy", "folyó", "kert", "virág", "fa", "nap", "hold", "csillag", "felhő", "eső", "hó", "szivárvány", "nyár", "ősz",
    "tél", "tavasz", "piros", "kék", "sárga", "zöld", "fehér", "fekete", "lila", "barna", "rózsaszín", "színes", "vidám", "boldog",
    "kedves", "ügyes", "okos", "bátor", "gyors", "lassú", "meleg", "hideg", "ház", "szoba", "ágy", "asztal", "szék", "ablak",
    "ajtó", "lámpa", "kulcs", "busz", "vonat", "villamos", "autó", "hajó", "repülő", "rajz", "festék", "zene", "ének", "dal",
    "tánc", "mesekönyv", "bábszínház", "állatkert", "cirkusz", "kirándulás", "sátor", "tábor", "zseblámpa", "hátizsák",
  ],
  teens: [
    "telefon", "üzenet", "videó", "videójáték", "internet", "alkalmazás", "jelszó", "képernyő", "töltő", "fülhallgató", "koncert",
    "fesztivál", "popzene", "táncház", "népzene", "gitár", "dob", "zenekar", "edzés", "verseny", "csapat", "vízilabda", "kajak",
    "kenu", "vívás", "paralimpia", "érem", "bajnokság", "felvételi", "érettségi", "gimnázium", "technikum", "szakma",
    "osztályfőnök", "témazáró", "bizonyítvány", "órarend", "kollégium", "diákigazolvány", "osztálykirándulás", "menetrend",
    "bérlet", "állomás", "kerékpár", "barátság", "buli", "hétvége", "mozi", "sorozat", "film", "könyvtár", "regény", "környezet",
    "hulladék", "szelektív", "napenergia", "éghajlat", "újrahasznosítás", "önkéntes", "programozás", "robot", "weboldal", "adat",
    "közösség", "diákönkormányzat", "iskolaújság", "szabadidő", "zsebpénz", "divat", "tornacipő", "pizza", "kávézó", "vélemény",
    "vita", "projekt", "kísérlet", "tehetség", "álom", "jövő", "pályaválasztás", "nyelvvizsga",
  ],
  erwachsen: [
    "munkahely", "munka", "fizetés", "szabadság", "ügyintézés", "kormányablak", "adóbevallás", "nyomtatvány", "időpont", "ügyfél",
    "hivatal", "iroda", "értekezlet", "határidő", "szerződés", "albérlet", "lakás", "rezsi", "számla", "bankkártya", "bevásárlás",
    "piac", "háziorvos", "gyógyszertár", "recept", "rendelés", "kórház", "mentő", "egészség", "biztosítás", "nyugdíj", "bölcsőde",
    "óvoda", "fogadóóra", "közlekedés", "autópálya", "matrica", "benzinkút", "parkolás", "tömegközlekedés", "múzeum", "színház",
    "kiállítás", "hangverseny", "önkormányzat", "polgármester", "hírek", "újság", "rádió", "interjú", "kérdőív", "tanfolyam",
    "képzés", "nyelvtudás", "önéletrajz", "állásinterjú", "munkatárs", "kolléga", "vállalkozás", "távmunka", "megtakarítás",
    "nagyszülő", "unoka", "szomszéd", "társasház", "lépcsőház", "felújítás", "akadálymentes", "látássérült", "gyengénlátó",
    "segédeszköz", "képernyőolvasó", "vakvezető",
  ],
};
