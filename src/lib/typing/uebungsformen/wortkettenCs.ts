/**
 * ★ CS-W (09.10.2026): Wortketten nach Thema für Weg „cs" - der Baustoff der Form „Hand-Schwerpunkte"
 * (`handschwerpunkte.ts` filtert daraus die Wörter, die sich mit EINER Hand tippen lassen - auf der Tastatur des Kindes, über
 * `fingerForChar`). Neu auf Tschechisch zusammengestellt, nicht übersetzt.
 *
 * Tschechische Nomen werden nicht grossgeschrieben - wie im Polnischen und Italienischen gibt es darum nur die Schwerpunkte
 * „links" und „rechts", nie „umschalt-*". Auf `cs` (QWERTZ) und `cs-qwerty` hat die linke Hand `a e` und die Zahlenreihe
 * `ě š č ř`, die rechte `i o u` und `ů ú ý á í é ž` - die Themen tragen darum bewusst Wörter, die einhändig sind:
 *  · links: *sestra, teta, děda, bratr, svetr, vesta, srdce, brada, ret, červ, vrabec, tetřev, cesta, vrba, test, start, střed*;
 *  · rechts: *pokoj, kolo, oko, kino, mlýn, molo, mlok, puk, mák, kmín, loupák, pomník, koník, úl, kluk, mléko*.
 * `y` und `z` liegen auf den zwei Tastaturen auf verschiedenen Händen; die Zahlen je Tastatur misst der Wächter
 * `tests/tastenflow-wortspiele-cs.test.ts`, sie stehen im Befund `BEFUND-2026-10-09-CS-WORTSPIELE.md`.
 *
 * ⚠️ Kein Wort mit `ď ť ň ó`: Sie entstehen über eine Totaste (`ˇ`, `´`) - zwei Anschläge, nicht immer mit derselben Hand;
 * „einhändig" liesse sich für sie nicht ehrlich sagen (`fingerForChar` kennt sie nicht, der Wächter verbietet sie). `ě š č ř ž ý
 * á í é ú ů` sind eigene Tasten und dürfen vorkommen.
 * Nichts aus der Sperrliste (`sperrlisteCs.ts`, Kern UND Wortbasis) - und auch keine Tiernamen, die im Tschechischen als
 * Schimpfwort gegen Menschen dienen (*kráva, prase, osel, opice, husa, slepice, krysa, koza, kozel, tele, beran, hroch,
 * velryba*): In einer Wortreihe ohne Zusammenhang stünden sie da wie ein Witz auf Kosten des Kindes. Im Lückentext, mit
 * Zusammenhang, steht *krávy* (sie geben Milch).
 */
import type { Wortkette } from "./wortkettenThemen";

const ALLE_STUFEN: Wortkette["stufen"] = ["kids", "teens", "erwachsen"];

export const WORTKETTEN_CS: Wortkette[] = [
  {
    thema: "Zvířata",
    woerter: ["pes", "kočka", "myš", "sova", "liška", "jelen", "srna", "krtek", "zajíc", "ježek", "čáp", "vrabec", "tetřev", "mlok", "koník", "veverka", "rys", "bobr", "kachna", "žába", "sýkora", "červ"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Doma",
    woerter: ["dům", "okno", "dveře", "lampa", "koberec", "gauč", "zrcadlo", "vana", "kuchyně", "pokoj", "schody", "střecha", "komín", "balkon", "půda", "sklep", "stůl", "židle", "police"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Ve škole",
    woerter: ["třída", "tabule", "sešit", "aktovka", "křída", "guma", "pravítko", "pastelky", "přestávka", "hodina", "test", "zvonek", "hřiště", "mapa", "globus", "atlas", "papír", "kružítko", "notýsek"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Jídlo",
    woerter: ["chleba", "sýr", "polévka", "knedlík", "guláš", "řízek", "rohlík", "houska", "koláč", "buchta", "perník", "tvaroh", "med", "mák", "kmín", "loupák", "palačinka", "zelí", "kompot", "mléko"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "U rybníka",
    woerter: ["rybník", "kapr", "štika", "rákos", "hráz", "člun", "kachna", "voda", "břeh", "molo", "rybář", "prut", "vlna", "mlok", "vážka", "leknín", "mlýn", "úl"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Na horách",
    woerter: ["hora", "vrchol", "kopec", "chata", "chalupa", "sjezdovka", "lyže", "běžky", "sáně", "lanovka", "turista", "cesta", "les", "potok", "skála", "mapa", "batoh", "sníh"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Počasí a roční období",
    woerter: ["sníh", "mráz", "vítr", "bouřka", "mlha", "duha", "jaro", "léto", "podzim", "zima", "slunce", "mrak", "kroupy", "vánice", "horko", "teploměr", "deštník", "náledí"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Rodina",
    woerter: ["máma", "táta", "bratr", "sestra", "babička", "děda", "dědeček", "teta", "strýc", "bratranec", "sestřenice", "vnuk", "vnučka", "rodiče", "děti", "miminko", "sourozenci", "kluk"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Tělo",
    woerter: ["oko", "ucho", "nos", "pusa", "ruka", "noha", "prst", "koleno", "břicho", "záda", "srdce", "krk", "brada", "palec", "rameno", "loket", "čelo", "ret"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Sport",
    woerter: ["hokej", "fotbal", "florbal", "házená", "tenis", "plavání", "běh", "start", "cíl", "trenér", "míč", "puk", "hokejka", "branka", "medaile", "pohár", "lyže", "kolo", "judo"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Hraní",
    woerter: ["kostky", "panenka", "míček", "švihadlo", "káča", "puzzle", "pexeso", "domino", "karty", "loutka", "divadlo", "kino", "balon", "drak", "houpačka", "skluzavka", "pískoviště", "kolo"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Povolání",
    woerter: ["lékař", "kuchař", "pekař", "zedník", "hasič", "řidič", "pilot", "listonoš", "kadeřník", "malíř", "krejčí", "rybář", "herec", "muzikant", "prodavač", "kominík", "programátor", "veterinář", "zahradník"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Příroda",
    woerter: ["strom", "les", "květina", "tráva", "řeka", "potok", "rybník", "javor", "lípa", "bříza", "smrk", "borovice", "dub", "houba", "mech", "keř", "kůra", "jezero", "louka", "pramen", "vrba"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Oblečení",
    woerter: ["čepice", "šála", "bunda", "svetr", "vesta", "boty", "ponožky", "kalhoty", "sukně", "košile", "mikina", "tričko", "kabát", "klobouk", "zástěra", "pyžamo", "rukavice"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Ve městě",
    woerter: ["ulice", "náměstí", "tramvaj", "šalina", "autobus", "nádraží", "obchod", "park", "most", "divadlo", "kino", "kašna", "radnice", "přechod", "pošta", "zastávka", "věž", "pomník", "střed"],
    stufen: ALLE_STUFEN,
  },
];
