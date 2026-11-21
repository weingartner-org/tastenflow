/**
 * ★ D-LERNDATEN (25.10.2026): DIE WORTKETTEN (Themen-Wortfelder) des Weges „bg" (Bulgarisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/bg/tf-fest-bg.json`, Schlüssel `themenWortfelder` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja - 0 Verstöße bei Reihenfolge, Zeichen und Tippbarkeit, Sperrliste sauber, Mengen gehalten.“
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `wortkettenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Bulgarisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ Wie viele Wörter je Hand einhändig sind, hängt an der Tastatur des Weges (G3b, `fingerForChar`) - gemessen wird es erst, wenn
 * die Tastaturen der Sprache stehen.
 *
 * Verteiler: `handschwerpunkte.ts` (filtert die Wörter, die sich mit EINER Hand tippen lassen - auf der Tastatur des Kindes) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?bulgarisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-bg.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Wortkette } from "./wortkettenThemen";

const ALLE: Wortkette["stufen"] = ["kids", "teens", "erwachsen"];

export const WORTKETTEN_BG: Wortkette[] = [
  {
    thema: "Животните",
    woerter: ["котка", "куче", "кон", "крава", "коза", "овца", "агне", "заек", "лисица", "вълк", "мечка", "таралеж", "катерица", "сърна", "елен", "щъркел", "гълъб", "орел", "жаба", "риба", "делфин", "пчела", "пеперуда"],
    stufen: ALLE,
  },
  {
    thema: "Вкъщи",
    woerter: ["къща", "стая", "кухня", "баня", "спалня", "маса", "стол", "легло", "креват", "прозорец", "врата", "стълба", "покрив", "балкон", "двор", "хладилник", "печка", "лампа", "килим", "шкаф", "диван"],
    stufen: ALLE,
  },
  {
    thema: "В училище",
    woerter: ["училище", "клас", "учител", "учителка", "ученик", "учебник", "тетрадка", "бележник", "молив", "химикалка", "гума", "линийка", "чанта", "дъска", "звънец", "междучасие", "урок", "оценка", "шестица", "чин"],
    stufen: ALLE,
  },
  {
    thema: "На масата",
    woerter: ["хляб", "баница", "сирене", "кашкавал", "мляко", "таратор", "салата", "домат", "краставица", "чушка", "боб", "леща", "супа", "кюфте", "питка", "мекица", "козунак", "ябълка", "круша", "грозде"],
    stufen: ALLE,
  },
  {
    thema: "На морето",
    woerter: ["море", "плаж", "пясък", "вълна", "мида", "чайка", "делфин", "лодка", "кораб", "пристанище", "фар", "бряг", "залив", "слънце", "чадър", "кърпа", "плуване", "остров", "рибар", "медуза"],
    stufen: ALLE,
  },
  {
    thema: "В планината",
    woerter: ["планина", "връх", "хижа", "пътека", "гора", "бор", "смърч", "скала", "пещера", "извор", "езеро", "река", "водопад", "поляна", "мъгла", "сняг", "ски", "лифт", "раница"],
    stufen: ALLE,
  },
  {
    thema: "Селото и градът",
    woerter: ["село", "град", "улица", "площад", "пазар", "магазин", "аптека", "поща", "банка", "библиотека", "парк", "читалище", "църква", "кмет", "автобус", "спирка", "гара", "трамвай", "мост", "квартал"],
    stufen: ALLE,
  },
  {
    thema: "Времето и сезоните",
    woerter: ["пролет", "лято", "есен", "зима", "слънце", "дъжд", "сняг", "вятър", "облак", "мъгла", "гръм", "светкавица", "дъга", "студено", "топло", "горещо", "мраз", "лед", "буря", "роса"],
    stufen: ALLE,
  },
  {
    thema: "Семейството",
    woerter: ["майка", "баща", "брат", "сестра", "баба", "дядо", "леля", "чичо", "вуйчо", "братовчед", "братовчедка", "син", "дъщеря", "внук", "внучка", "бебе", "семейство", "родители", "деца", "съсед"],
    stufen: ALLE,
  },
  {
    thema: "Тялото",
    woerter: ["глава", "коса", "лице", "око", "очи", "ухо", "нос", "уста", "зъб", "език", "врат", "рамо", "ръка", "пръст", "корем", "гръб", "крак", "коляно", "стъпало", "сърце"],
    stufen: ALLE,
  },
  {
    thema: "Спортът",
    woerter: ["футбол", "волейбол", "баскетбол", "тенис", "плуване", "борба", "гимнастика", "ски", "колоездене", "бягане", "топка", "мрежа", "отбор", "треньор", "стадион", "мач", "гол", "медал", "състезание", "победа"],
    stufen: ALLE,
  },
  {
    thema: "Празниците",
    woerter: ["празник", "мартеница", "лазаруване", "кукери", "кукер", "нестинари", "яйце", "козунак", "елха", "подарък", "сурвачка", "рожденик", "торта", "свещ", "хоро", "песен", "азбука", "агнешко"],
    stufen: ALLE,
  },
  {
    thema: "Професиите",
    woerter: ["учител", "лекар", "аптекар", "готвач", "хлебар", "шофьор", "пилот", "пожарникар", "полицай", "фермер", "градинар", "рибар", "строител", "инженер", "програмист", "художник", "музикант", "продавач", "пощальон", "фризьор"],
    stufen: ALLE,
  },
  {
    thema: "Природата",
    woerter: ["дърво", "цвете", "трева", "лист", "клон", "корен", "гора", "поле", "ливада", "река", "езеро", "извор", "планина", "камък", "пясък", "роза", "лале", "теменуга", "кокиче", "бук", "дъб"],
    stufen: ALLE,
  },
  {
    thema: "Облеклото",
    woerter: ["риза", "фланелка", "панталон", "пола", "рокля", "яке", "палто", "пуловер", "шапка", "шал", "ръкавици", "чорапи", "обувки", "ботуши", "маратонки", "чехли", "пижама", "колан", "джоб", "копче"],
    stufen: ALLE,
  },
];
