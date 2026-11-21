/**
 * ★ D-LERNDATEN (25.10.2026): DIE WORTKETTEN (Themen-Wortfelder) des Weges „nl" (Niederländisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/nl/tf-fest-nl.json`, Schlüssel `themenWortfelder` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja (für den Bau) - Vorbehalt: Lese-Abnahme durch Muttersprachler und OpenTaal-Abgleich vor der öffentlichen Freigabe.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `wortkettenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Niederländisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ Wie viele Wörter je Hand einhändig sind, hängt an der Tastatur des Weges (G3b, `fingerForChar`) - gemessen wird es erst, wenn
 * die Tastaturen der Sprache stehen.
 *
 * Verteiler: `handschwerpunkte.ts` (filtert die Wörter, die sich mit EINER Hand tippen lassen - auf der Tastatur des Kindes) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?niederlaendisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-nl.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Wortkette } from "./wortkettenThemen";

const ALLE: Wortkette["stufen"] = ["kids", "teens", "erwachsen"];

export const WORTKETTEN_NL: Wortkette[] = [
  {
    thema: "Op school",
    woerter: ["school", "klas", "juf", "meester", "leerling", "schrift", "potlood", "pen", "liniaal", "rugzak", "etui", "schoolplein", "pauze", "rapport", "toets", "les", "huiswerk", "lezen", "rekenen"],
    stufen: ALLE,
  },
  {
    thema: "Dieren",
    woerter: ["hond", "kat", "konijn", "koe", "paard", "schaap", "geit", "kip", "eend", "zwaan", "egel", "eekhoorn", "vos", "uil", "reiger", "ooievaar", "zeehond", "haas", "mol", "muis"],
    stufen: ALLE,
  },
  {
    thema: "De fiets",
    woerter: ["fiets", "zadel", "stuur", "bel", "pedaal", "ketting", "band", "pomp", "lamp", "slot", "fietspad", "helm", "regenpak", "fietstas", "rem", "spaak", "bagagedrager"],
    stufen: ALLE,
  },
  {
    thema: "Eten",
    woerter: ["brood", "boterham", "kaas", "hagelslag", "pindakaas", "melk", "karnemelk", "ei", "soep", "stamppot", "boerenkool", "friet", "mosselen", "kroket", "bitterbal", "wafel", "vlaai"],
    stufen: ALLE,
  },
  {
    thema: "Lekkers",
    woerter: ["stroopwafel", "speculaas", "pepernoten", "oliebol", "poffertjes", "drop", "chocolade", "taart", "koekje", "ijsje", "snoep", "pannenkoek", "suiker", "kruidnoten", "rijstevlaai", "zandkoek"],
    stufen: ALLE,
  },
  {
    thema: "Feesten",
    woerter: ["sinterklaas", "schoen", "cadeau", "gedicht", "surprise", "kermis", "carnaval", "verjaardag", "kaarsje", "taart", "vlag", "oranje", "lampion", "kerst", "vuurwerk", "nieuwjaar"],
    stufen: ALLE,
  },
  {
    thema: "Water en polder",
    woerter: ["polder", "dijk", "molen", "windmolen", "gemaal", "sloot", "kanaal", "gracht", "sluis", "brug", "boot", "zeil", "schip", "rivier", "delta", "eb", "vloed"],
    stufen: ALLE,
  },
  {
    thema: "Aan zee",
    woerter: ["zee", "strand", "duin", "schelp", "golf", "zand", "wad", "zeehond", "meeuw", "vuurtoren", "pier", "haven", "garnaal", "krab", "vlieger", "badpak", "handdoek"],
    stufen: ALLE,
  },
  {
    thema: "Winter en ijs",
    woerter: ["winter", "ijs", "sneeuw", "vorst", "schaats", "schaatsen", "sneeuwpop", "slee", "muts", "sjaal", "handschoen", "kachel", "ijsbaan", "natuurijs", "glad"],
    stufen: ALLE,
  },
  {
    thema: "Thuis",
    woerter: ["huis", "kamer", "keuken", "badkamer", "slaapkamer", "zolder", "trap", "deur", "raam", "tafel", "stoel", "kussen", "bed", "kast", "lamp", "tuin", "balkon"],
    stufen: ALLE,
  },
  {
    thema: "Familie",
    woerter: ["familie", "moeder", "vader", "ouders", "zus", "broer", "tante", "oom", "neef", "nicht", "kind", "baby", "grootouders", "kleinkind", "gezin", "buren", "vriend", "vriendin"],
    stufen: ALLE,
  },
  {
    thema: "Het weer",
    woerter: ["weer", "regen", "zon", "wind", "wolk", "storm", "onweer", "hagel", "mist", "bui", "paraplu", "lente", "zomer", "herfst", "winter", "regenboog"],
    stufen: ALLE,
  },
  {
    thema: "Natuur en bos",
    woerter: ["bos", "heide", "boom", "blad", "tak", "eik", "paddenstoel", "bloem", "tulp", "narcis", "gras", "ven", "beek", "heuvel", "duin", "wandelpad", "vogel"],
    stufen: ALLE,
  },
  {
    thema: "Sport",
    woerter: ["voetbal", "hockey", "korfbal", "wielrennen", "schaatsen", "zwemmen", "turnen", "tennis", "goalball", "wedstrijd", "ploeg", "doelpunt", "scheidsrechter", "trainer", "medaille", "beker"],
    stufen: ALLE,
  },
  {
    thema: "Werk en beroepen",
    woerter: ["bakker", "slager", "kapper", "boer", "verpleegkundige", "dokter", "leerkracht", "loodgieter", "elektricien", "chauffeur", "programmeur", "kok", "tuinman", "visser", "postbode", "brandweer"],
    stufen: ALLE,
  },
];
