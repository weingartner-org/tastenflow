/**
 * ★ D-LERNDATEN (25.10.2026): DIE WORTKETTEN (Themen-Wortfelder) des Weges „hu" (Ungarisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/hu/tf-fest-hu.json`, Schlüssel `themenWortfelder` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja - unter Vorbehalt der muttersprachlichen Abnahme und der Entscheidung zu Punkt 6.1“ (Alkohol bei der Jugend).
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `wortkettenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Ungarisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ Wie viele Wörter je Hand einhändig sind, hängt an der Tastatur des Weges (G3b, `fingerForChar`) - gemessen wird es erst, wenn
 * die Tastaturen der Sprache stehen.
 *
 * Verteiler: `handschwerpunkte.ts` (filtert die Wörter, die sich mit EINER Hand tippen lassen - auf der Tastatur des Kindes) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?ungarisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-hu.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Wortkette } from "./wortkettenThemen";

const ALLE: Wortkette["stufen"] = ["kids", "teens", "erwachsen"];

export const WORTKETTEN_HU: Wortkette[] = [
  {
    thema: "Állatok",
    woerter: ["kutya", "macska", "ló", "tehén", "birka", "kecske", "nyúl", "gólya", "róka", "őz", "mókus", "sün", "béka", "bagoly", "sas", "harkály", "ponty", "harcsa", "racka", "puli", "kuvasz", "vizsla", "bárány"],
    stufen: ALLE,
  },
  {
    thema: "Otthon",
    woerter: ["ház", "szoba", "konyha", "fürdőszoba", "ablak", "ajtó", "asztal", "szék", "ágy", "szekrény", "polc", "lámpa", "tükör", "szőnyeg", "erkély", "kert", "lépcső", "kulcs", "kanapé", "fotel"],
    stufen: ALLE,
  },
  {
    thema: "Az iskola",
    woerter: ["iskola", "osztály", "tanító", "tanár", "diák", "füzet", "könyv", "ceruza", "toll", "radír", "tolltartó", "táska", "tábla", "kréta", "szünet", "csengő", "ellenőrző", "bizonyítvány", "órarend", "tornaterem", "uzsonna", "ötös"],
    stufen: ALLE,
  },
  {
    thema: "Az asztalnál",
    woerter: ["lángos", "palacsinta", "pogácsa", "gulyás", "halászlé", "lecsó", "pörkölt", "rétes", "kifli", "zsemle", "kenyér", "túró", "kalács", "kürtőskalács", "nokedli", "főzelék", "leves", "paprika", "szalonna", "tejföl"],
    stufen: ALLE,
  },
  {
    thema: "A Balatonnál",
    woerter: ["tó", "víz", "part", "strand", "hullám", "vitorlás", "hajó", "komp", "móló", "nád", "sirály", "fürdés", "napozás", "homok", "törölköző", "fagylalt", "kikötő", "stég", "naplemente"],
    stufen: ALLE,
  },
  {
    thema: "Hegyek és erdők",
    woerter: ["hegy", "erdő", "fa", "tölgy", "bükk", "fenyő", "gomba", "ösvény", "csúcs", "kilátó", "barlang", "forrás", "patak", "szikla", "turista", "túra", "moha", "makk", "mókus"],
    stufen: ALLE,
  },
  {
    thema: "Az Alföldön",
    woerter: ["puszta", "tanya", "gémeskút", "csikós", "juhász", "gulya", "ménes", "nyáj", "szél", "délibáb", "nádas", "akác", "búza", "kukorica", "pásztor", "kunyhó", "karám", "ostor", "napraforgó"],
    stufen: ALLE,
  },
  {
    thema: "A városban",
    woerter: ["utca", "tér", "villamos", "busz", "metró", "híd", "bolt", "piac", "posta", "könyvtár", "múzeum", "színház", "park", "járda", "lakótelep", "aluljáró", "megálló", "templom", "vásárcsarnok"],
    stufen: ALLE,
  },
  {
    thema: "Időjárás és évszakok",
    woerter: ["tavasz", "nyár", "ősz", "tél", "eső", "hó", "szél", "napsütés", "felhő", "köd", "vihar", "villám", "dörgés", "szivárvány", "jég", "fagy", "meleg", "hideg", "esernyő", "hóember"],
    stufen: ALLE,
  },
  {
    thema: "A család",
    woerter: ["anya", "apa", "szülők", "testvér", "nővér", "báty", "húg", "öcs", "nagymama", "nagyapa", "unoka", "nagynéni", "nagybácsi", "unokatestvér", "család", "gyerek", "baba", "feleség", "férj"],
    stufen: ALLE,
  },
  {
    thema: "A testünk",
    woerter: ["fej", "haj", "szem", "fül", "orr", "száj", "fog", "nyak", "váll", "kar", "kéz", "ujj", "has", "hát", "láb", "térd", "talp", "szív", "tüdő", "bőr"],
    stufen: ALLE,
  },
  {
    thema: "Sport",
    woerter: ["vízilabda", "úszás", "kajak", "kenu", "foci", "kosárlabda", "kézilabda", "vívás", "dzsúdó", "tenisz", "asztalitenisz", "futás", "torna", "sakk", "korcsolya", "labda", "kapu", "gól", "edző", "csapat", "érem", "verseny", "olimpia"],
    stufen: ALLE,
  },
  {
    thema: "Ünnepek",
    woerter: ["karácsony", "húsvét", "farsang", "szilveszter", "újév", "születésnap", "névnap", "ajándék", "fenyőfa", "szaloncukor", "bejgli", "locsolkodás", "maszk", "jelmez", "busójárás", "tűzijáték", "torta", "gyertya", "szüret", "mézeskalács"],
    stufen: ALLE,
  },
  {
    thema: "Foglalkozások",
    woerter: ["tanító", "orvos", "ápoló", "szakács", "pék", "cukrász", "sofőr", "mozdonyvezető", "postás", "rendőr", "tűzoltó", "asztalos", "fodrász", "kertész", "mérnök", "programozó", "eladó", "juhász", "halász", "újságíró", "könyvtáros", "gyógytornász"],
    stufen: ALLE,
  },
  {
    thema: "Ruhák",
    woerter: ["ing", "póló", "pulóver", "nadrág", "szoknya", "ruha", "kabát", "sapka", "sál", "kesztyű", "zokni", "cipő", "csizma", "papucs", "pizsama", "dzseki", "farmer", "öv", "mellény", "fürdőruha"],
    stufen: ALLE,
  },
];
