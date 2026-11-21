/**
 * ★ D-LERNDATEN (25.10.2026): DIE WORTKETTEN (Themen-Wortfelder) des Weges „sv" (Schwedisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/sv/tf-fest-sv.json`, Schlüssel `themenWortfelder` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja, unter zwei Bedingungen: Die Punkte 1 und 5 aus §5 müssen technisch geklärt werden, und ein Mensch mit Schwedisch als Erstsprache sollte das Ganze gegenlesen.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `wortkettenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Schwedisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ Wie viele Wörter je Hand einhändig sind, hängt an der Tastatur des Weges (G3b, `fingerForChar`) - gemessen wird es erst, wenn
 * die Tastaturen der Sprache stehen.
 *
 * Verteiler: `handschwerpunkte.ts` (filtert die Wörter, die sich mit EINER Hand tippen lassen - auf der Tastatur des Kindes) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?schwedisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-sv.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Wortkette } from "./wortkettenThemen";

const ALLE: Wortkette["stufen"] = ["kids", "teens", "erwachsen"];

export const WORTKETTEN_SV: Wortkette[] = [
  {
    thema: "Djuren",
    woerter: ["älg", "ren", "varg", "björn", "lodjur", "räv", "hare", "ekorre", "igelkott", "säl", "uggla", "örn", "svan", "mås", "gädda", "abborre", "lax", "groda", "humla", "fjäril", "myra", "bäver", "järv"],
    stufen: ALLE,
  },
  {
    thema: "Skolan",
    woerter: ["skola", "klassrum", "lärare", "elev", "rast", "bänk", "penna", "sudd", "linjal", "sax", "bok", "läxa", "matte", "svenska", "slöjd", "idrott", "bibliotek", "matsal", "skolgård", "lov", "schema", "dator"],
    stufen: ALLE,
  },
  {
    thema: "Hemma",
    woerter: ["hus", "lägenhet", "kök", "sovrum", "badrum", "säng", "soffa", "bord", "stol", "lampa", "fönster", "dörr", "golv", "tak", "trappa", "kudde", "täcke", "matta", "spis", "kylskåp", "hall"],
    stufen: ALLE,
  },
  {
    thema: "Maten",
    woerter: ["frukost", "lunch", "middag", "mellanmål", "gröt", "mjölk", "bröd", "knäckebröd", "smör", "ost", "ägg", "potatis", "köttbullar", "fisk", "sill", "pannkaka", "sylt", "lingon", "äpple", "morot", "gurka", "soppa"],
    stufen: ALLE,
  },
  {
    thema: "Fika",
    woerter: ["fika", "kaffe", "te", "saft", "kanelbulle", "bulle", "kaka", "tårta", "semla", "kardemumma", "mjölk", "socker", "kakao", "choklad", "pepparkaka", "smörgås", "våffla", "kex", "glass", "sockerkaka", "kladdkaka", "kopp"],
    stufen: ALLE,
  },
  {
    thema: "Naturen och allemansrätten",
    woerter: ["skog", "sjö", "fjäll", "älv", "myr", "mosse", "äng", "berg", "sten", "stig", "bär", "blåbär", "lingon", "hjortron", "svamp", "kantarell", "tält", "eld", "vandra", "allemansrätten", "natur", "björk", "tall", "gran"],
    stufen: ALLE,
  },
  {
    thema: "Vädret och årstiderna",
    woerter: ["vår", "sommar", "höst", "vinter", "sol", "regn", "snö", "is", "vind", "storm", "moln", "dimma", "åska", "blixt", "hagel", "kallt", "varmt", "midnattssol", "norrsken", "mörker", "frost"],
    stufen: ALLE,
  },
  {
    thema: "Midsommar",
    woerter: ["midsommar", "midsommarafton", "midsommarstång", "majstång", "blomkrans", "blommor", "krans", "dans", "sill", "potatis", "dill", "jordgubbar", "grädde", "sommar", "lekar", "säcklöpning", "fiol", "äng"],
    stufen: ALLE,
  },
  {
    thema: "Lucia och jul",
    woerter: ["lucia", "luciatåg", "ljus", "ljuskrona", "lussekatt", "saffran", "pepparkaka", "tärna", "stjärngosse", "julgran", "tomte", "julklapp", "julafton", "julbord", "skinka", "risgrynsgröt", "snö", "december", "sång", "stjärna"],
    stufen: ALLE,
  },
  {
    thema: "Sport",
    woerter: ["fotboll", "ishockey", "bandy", "innebandy", "skidor", "längdskidor", "skridskor", "orientering", "simning", "friidrott", "handboll", "cykel", "segling", "paddling", "curling", "parasport", "medalj", "guld", "lag", "match", "mål", "tränare"],
    stufen: ALLE,
  },
  {
    thema: "Sápmi och fjällen",
    woerter: ["same", "samer", "samiska", "ren", "renar", "renskötsel", "renhjord", "fjäll", "lavvu", "jojk", "slöjd", "norrsken", "midnattssol", "snöskoter", "älv", "vinter", "flagga", "trumma", "lav", "vidder", "fjällsjö"],
    stufen: ALLE,
  },
  {
    thema: "Skärgården och havet",
    woerter: ["skärgård", "ö", "holme", "kobbe", "skär", "hav", "våg", "båt", "segelbåt", "färja", "hamn", "brygga", "fyr", "säl", "mås", "strand", "klippa", "sand", "bad", "strömming", "fiske", "kust", "sund", "ankare"],
    stufen: ALLE,
  },
  {
    thema: "Kroppen",
    woerter: ["huvud", "hår", "öga", "öra", "näsa", "mun", "tand", "hals", "axel", "arm", "hand", "finger", "mage", "rygg", "ben", "knä", "fot", "tå", "hjärta", "hud"],
    stufen: ALLE,
  },
  {
    thema: "Familjen",
    woerter: ["mamma", "pappa", "förälder", "syster", "bror", "syskon", "mormor", "morfar", "farmor", "farfar", "moster", "faster", "morbror", "farbror", "kusin", "barn", "barnbarn", "familj", "släkt", "bebis"],
    stufen: ALLE,
  },
  {
    thema: "Kläderna",
    woerter: ["tröja", "byxor", "jacka", "mössa", "vantar", "halsduk", "skor", "stövlar", "strumpor", "kjol", "klänning", "skjorta", "regnställ", "overall", "keps", "shorts", "pyjamas", "handskar", "kläder", "flytväst"],
    stufen: ALLE,
  },
];
