/**
 * ★ D-LERNDATEN (25.10.2026): DIE WORTKETTEN (Themen-Wortfelder) des Weges „uk" (Ukrainisch) - gefüllt aus den vorbereiteten Lerndaten.
 *
 * Quelle: iCloud `sprachen-2026-10-25/tf-fest-neu/uk/tf-fest-uk.json`, Schlüssel `themenWortfelder` (Zuordnung: Rezept
 * Teil D). Geprüft vom unabhängigen Prüfer der PC-Sitzung: `PRUEFBERICHT.md` im selben Ordner (25.10.2026) - Urteil:
 * „Freigabefähig: ja - für den internen Einbau (hinter `?ukrainisch-lehrgang=1`). Für die öffentliche Freigabe von `/uk`: nein, noch nicht“ (Abnahme durch eine Muttersprachlerin und eine Fachperson für traumasensible Arbeit).
 * Übernommen vom Erzeuger-Skript der Etappe D-LERNDATEN im Format von `wortkettenCs.ts`, Eintrag für Eintrag in der Reihenfolge der
 * Quelle. Geändert wurde nur Typografie, die keine Tastatur hat (gezählt im Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * ⚠️ Eine Lese-Abnahme durch eine Person mit Ukrainisch als Erstsprache steht aus (Prüfbericht; Falle 59).
 *
 * ⚠️ Wie viele Wörter je Hand einhändig sind, hängt an der Tastatur des Weges (G3b, `fingerForChar`) - gemessen wird es erst, wenn
 * die Tastaturen der Sprache stehen.
 *
 * Verteiler: `handschwerpunkte.ts` (filtert die Wörter, die sich mit EINER Hand tippen lassen - auf der Tastatur des Kindes) - liest diese Datei seit G3c; leer hiess Englisch, gefüllt gilt diese Liste (`geruestRueckfall.ts`).
 * Unsichtbar, bis der Schalter `?ukrainisch-lehrgang=1` an ist (Vorgabe AUS). Wächter: `tests/tastenflow-lerndaten-uk.test.ts`
 * (Regeln je Sprache in `tests/helfer/lerndatenNeueWege.ts`).
 *
 * ⚠️ DATENBLATT (`scripts/buendel-aufteilung.ts`): nur `import type`, kein Code.
 */
import type { Wortkette } from "./wortkettenThemen";

const ALLE: Wortkette["stufen"] = ["kids", "teens", "erwachsen"];

export const WORTKETTEN_UK: Wortkette[] = [
  {
    thema: "Тварини",
    woerter: ["кіт", "собака", "корова", "кінь", "коза", "вівця", "курка", "качка", "гуска", "кролик", "їжак", "білка", "лисиця", "заєць", "ведмідь", "олень", "лелека", "сова", "жаба", "черепаха", "бобер"],
    stufen: ALLE,
  },
  {
    thema: "Удома",
    woerter: ["дім", "кімната", "кухня", "вітальня", "спальня", "ванна", "вікно", "двері", "стіл", "стілець", "ліжко", "шафа", "диван", "килим", "ковдра", "дзеркало", "балкон", "ґанок", "посуд", "чайник"],
    stufen: ALLE,
  },
  {
    thema: "У школі",
    woerter: ["школа", "клас", "урок", "учитель", "учителька", "учень", "учениця", "зошит", "олівець", "ручка", "гумка", "пенал", "рюкзак", "підручник", "дошка", "перерва", "абетка", "книжка", "бібліотека", "парта"],
    stufen: ALLE,
  },
  {
    thema: "Їжа",
    woerter: ["борщ", "вареники", "голубці", "деруни", "сирники", "пампушки", "банош", "капусняк", "гречка", "каша", "хліб", "сало", "сир", "сметана", "яйце", "суп", "пиріжок", "мед", "молоко", "компот", "узвар"],
    stufen: ALLE,
  },
  {
    thema: "Сім'я",
    woerter: ["мама", "тато", "бабуся", "дідусь", "сестра", "брат", "донька", "син", "тітка", "дядько", "онук", "онука", "родина", "батьки", "діти", "дружина", "чоловік", "племінник"],
    stufen: ALLE,
  },
  {
    thema: "Погода і пори року",
    woerter: ["весна", "літо", "осінь", "зима", "сонце", "хмара", "дощ", "сніг", "вітер", "туман", "веселка", "мороз", "тепло", "холодно", "хмарно", "сонячно", "іній", "калюжа"],
    stufen: ALLE,
  },
  {
    thema: "Спорт",
    woerter: ["футбол", "волейбол", "баскетбол", "теніс", "плавання", "біг", "гімнастика", "хокей", "лижі", "ковзани", "велосипед", "м'яч", "стадіон", "тренер", "команда", "чемпіон", "шахи", "бадмінтон", "дзюдо"],
    stufen: ALLE,
  },
  {
    thema: "Ігри та дозвілля",
    woerter: ["гра", "іграшка", "лялька", "м'яч", "пазл", "конструктор", "лото", "доміно", "скакалка", "гойдалка", "пісочниця", "малювання", "читання", "кіно", "театр", "концерт", "прогулянка", "пікнік", "шашки", "класики", "дзиґа"],
    stufen: ALLE,
  },
  {
    thema: "Професії",
    woerter: ["лікар", "лікарка", "учитель", "учителька", "кухар", "кухарка", "пекар", "пекарка", "водій", "програміст", "програмістка", "художник", "художниця", "фермер", "фермерка", "продавець", "продавчиня", "перукар", "перукарка", "листоноша", "будівельник", "інженер", "інженерка"],
    stufen: ALLE,
  },
  {
    thema: "Природа",
    woerter: ["ліс", "поле", "річка", "озеро", "гора", "сад", "гай", "квітка", "дерево", "трава", "дуб", "береза", "калина", "верба", "тополя", "соняшник", "гриб", "ягода", "джерело", "степ", "луг"],
    stufen: ALLE,
  },
  {
    thema: "Одяг",
    woerter: ["сорочка", "вишиванка", "сукня", "спідниця", "штани", "светр", "куртка", "пальто", "шапка", "шарф", "рукавиці", "шкарпетки", "черевики", "чобіти", "туфлі", "кросівки", "футболка", "шорти", "хустка"],
    stufen: ALLE,
  },
  {
    thema: "У місті",
    woerter: ["вулиця", "площа", "парк", "музей", "театр", "бібліотека", "магазин", "аптека", "пошта", "лікарня", "школа", "кав'ярня", "ресторан", "зупинка", "автобус", "трамвай", "тролейбус", "метро", "ринок", "фонтан", "міст"],
    stufen: ALLE,
  },
  {
    thema: "Свята і традиції",
    woerter: ["свято", "колядка", "щедрівка", "кутя", "паска", "писанка", "крашанка", "вишиванка", "вінок", "коровай", "рушник", "ялинка", "подарунок", "дідух", "ярмарок", "весілля", "іменини", "торт", "узвар"],
    stufen: ALLE,
  },
  {
    thema: "У Карпатах",
    woerter: ["гори", "полонина", "смерека", "ліс", "річка", "водоспад", "трембіта", "вівчар", "вівця", "бринза", "банош", "ґазда", "хата", "стежка", "джерело", "гриби", "чорниці", "туристи", "сопілка", "колиба", "вершина"],
    stufen: ALLE,
  },
  {
    thema: "Біля моря",
    woerter: ["море", "пляж", "пісок", "хвиля", "чайка", "човен", "мушля", "сонце", "парасолька", "засмага", "купальник", "риба", "маяк", "порт", "берег", "кавун", "морозиво", "краб", "медуза"],
    stufen: ALLE,
  },
];
