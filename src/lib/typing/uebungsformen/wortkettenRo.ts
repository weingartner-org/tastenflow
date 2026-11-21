/**
 * ★ D-LERNDATEN (25.10.2026): DIE WORTKETTEN (Themen-Wortfelder) des Weges „ro" (Rumänisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/ro/tf-fest-ro.json`, Schlüssel `themenWortfelder` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja, unter einer Bedingung: Eine muttersprachliche Person liest die Stellen aus Abschnitt 5 noch einmal.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `wortkettenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Rumänisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ Wie viele Wörter je Hand einhändig sind, hängt an der Tastatur des Weges (G3b, `fingerForChar`) - gemessen wird es erst, wenn
 * die Tastaturen der Sprache stehen.
 *
 * Verteiler: `handschwerpunkte.ts` (filtert die Wörter, die sich mit EINER Hand tippen lassen - auf der Tastatur des Kindes) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?rumaenisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-ro.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Wortkette } from "./wortkettenThemen";

const ALLE: Wortkette["stufen"] = ["kids", "teens", "erwachsen"];

export const WORTKETTEN_RO: Wortkette[] = [
  {
    thema: "Animalele",
    woerter: ["pisică", "câine", "cal", "oaie", "miel", "iepure", "urs", "lup", "vulpe", "cerb", "râs", "veveriță", "arici", "bursuc", "barză", "pelican", "delfin", "vultur", "rață", "albină", "fluture"],
    stufen: ALLE,
  },
  {
    thema: "Casa",
    woerter: ["casă", "cameră", "bucătărie", "baie", "dormitor", "fereastră", "ușă", "masă", "scaun", "pat", "dulap", "perdea", "covor", "lampă", "acoperiș", "balcon", "scară", "grădină", "curte", "poartă"],
    stufen: ALLE,
  },
  {
    thema: "Școala",
    woerter: ["școală", "clasă", "elev", "elevă", "profesor", "profesoară", "bancă", "tablă", "caiet", "creion", "pix", "carte", "ghiozdan", "penar", "riglă", "lecție", "pauză", "temă", "notă", "catalog"],
    stufen: ALLE,
  },
  {
    thema: "La masă",
    woerter: ["mămăligă", "sarmale", "ciorbă", "cozonac", "plăcintă", "covrigi", "brânză", "zacuscă", "papanași", "pâine", "supă", "salată", "mere", "struguri", "lapte", "iaurt", "ouă", "smântână"],
    stufen: ALLE,
  },
  {
    thema: "Marea și Delta",
    woerter: ["mare", "plajă", "nisip", "val", "scoică", "pescăruș", "delfin", "far", "port", "barcă", "vapor", "deltă", "stuf", "canal", "pelican", "pește", "lac", "insulă", "țărm", "soare"],
    stufen: ALLE,
  },
  {
    thema: "Munții",
    woerter: ["munte", "vârf", "pădure", "brad", "potecă", "cabană", "stâncă", "izvor", "peșteră", "lac", "zăpadă", "schi", "telegondolă", "cascadă", "vale", "poiană", "stână", "cioban", "urs"],
    stufen: ALLE,
  },
  {
    thema: "Satul și orașul",
    woerter: ["sat", "oraș", "stradă", "piață", "parc", "bloc", "școală", "magazin", "primărie", "gară", "autobuz", "tramvai", "pod", "fântână", "grădină", "câmp", "drum", "fermă", "livadă"],
    stufen: ALLE,
  },
  {
    thema: "Vremea și anotimpurile",
    woerter: ["primăvară", "vară", "toamnă", "iarnă", "soare", "ploaie", "zăpadă", "vânt", "nor", "ceață", "ger", "brumă", "furtună", "fulger", "tunet", "curcubeu", "căldură", "frig", "grindină"],
    stufen: ALLE,
  },
  {
    thema: "Familia",
    woerter: ["mamă", "tată", "frate", "soră", "bunică", "bunic", "mătușă", "unchi", "văr", "verișoară", "copil", "părinți", "nepot", "nepoată", "familie", "fiică", "fiu", "bebeluș"],
    stufen: ALLE,
  },
  {
    thema: "Corpul",
    woerter: ["cap", "păr", "ochi", "nas", "gură", "ureche", "dinte", "gât", "umăr", "braț", "mână", "deget", "picior", "genunchi", "spate", "burtă", "inimă", "piele", "unghie"],
    stufen: ALLE,
  },
  {
    thema: "Sportul",
    woerter: ["fotbal", "handbal", "tenis", "gimnastică", "înot", "alergare", "ciclism", "schi", "șah", "baschet", "volei", "echipă", "minge", "meci", "gol", "antrenor", "medalie", "stadion"],
    stufen: ALLE,
  },
  {
    thema: "Sărbătorile",
    woerter: ["mărțișor", "colindă", "colindători", "plugușor", "sorcova", "cozonac", "brad", "cadou", "ouă", "tort", "aniversare", "zăpadă", "artificii", "lumânare", "clopoțel", "sărbătoare"],
    stufen: ALLE,
  },
  {
    thema: "Meseriile",
    woerter: ["medic", "profesoară", "brutar", "bucătar", "șofer", "pompier", "polițist", "fermier", "pădurar", "cioban", "croitor", "tâmplar", "zidar", "programator", "asistentă", "poștaș", "pilot"],
    stufen: ALLE,
  },
  {
    thema: "Natura",
    woerter: ["pădure", "copac", "frunză", "floare", "iarbă", "râu", "izvor", "munte", "deal", "câmpie", "lac", "cer", "stea", "lună", "soare", "pământ", "piatră", "nisip", "ghiocel"],
    stufen: ALLE,
  },
  {
    thema: "Hainele",
    woerter: ["cămașă", "ie", "bluză", "tricou", "pulover", "fustă", "rochie", "pantaloni", "geacă", "palton", "fular", "căciulă", "mănuși", "ciorapi", "pantofi", "ghete", "cizme", "sandale"],
    stufen: ALLE,
  },
];
