/**
 * ★★★ DIE LEKTIONEN DES WEGES „uk" (Ukrainisch) - F4-UK (29.10.2026), vorher leerer Einhängepunkt (G3c-VERTEILER).
 *
 * Bauart wie `curriculumRo.ts`; die Rechnung (Tasten je Lektion, Griffe aus den Daten der Tastatur, `introByLayout`) steht im
 * `lektionenBaukasten.ts`. Neu auf Ukrainisch geschrieben, nichts übersetzt. Begriffe nach dem Glossar
 * (`recherche-ukrainisch-2026-10-25/GLOSSAR-uk.md` §1, §2.1, §2.8): *основний ряд* (nie „рядок" - das ist die Übungszeile),
 * *основне положення*, *виступи на клавішах А і О*, *мізинець · безіменний палець · середній палець · вказівний палець ·
 * великий палець*, *клавіша*, *пробіл*; Tastennamen lateinisch, nie gebeugt, mit Kopfwort „клавіша" (Regel 11); Kinder mit
 * **ти** (Regel 1), ohne Geschlecht (Regel 2: keine Vergangenheit, kein Adjektiv am Kind); keine Russismen (Regel 14); der
 * Apostroph ist U+0027 (Regel 7); nur der Bindestrich `-`; Beispielwörter in «…» (Regel 7).
 *
 * ── DIE REGEL (wie ro/hu/cs) ─────────────────────────────────────────────────────────────────────────────────────────
 * Die Tasten aller Lektionen hintereinander SIND `introOrder("uk")` - auf `ua` (Українська розширена = Bezug) und `ua-std`.
 * Auf `ua-std` fehlen der Apostroph und `₴` (Bauplan U2): sie fallen dort weg, der Text der Apostroph-Lektion richtet sich nach
 * den Tasten, die ankommen. Die Griffe werden gerechnet, nie geschrieben. Wächter: `tests/tastenflow-lektionen-uk.test.ts`.
 */
import type { Lesson } from "./curriculum";
import type { FingerId, KeyAccess } from "./fingers";
import { heimZeichenDesWeges } from "./heimtasten";
import type { KeyboardLayout, LayoutId } from "./layouts";
import { fingerTeile, griffSatz, lektionenJeTastatur, type GriffSaetze, type Lage, type LektionsBauplan } from "./lektionenBaukasten";
import { kappeFuer } from "./sprachRegister";

// ── Namen ────────────────────────────────────────────────────────────────────

/** Was auf der Kappe steht: Buchstaben gross, sonst das Zeichen. */
const kappe = (k: string): string => kappeFuer(k, "uk");

/** „А і О", „А, Б і В". */
function aufzaehlen(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")} і ${teile[teile.length - 1]}`;
}
const kappen = (t: readonly string[]): string => aufzaehlen(t.map(kappe));

/** Die Finger (Glossar §2.1, Ratatype-Formen). */
const PALTSI: Record<"kleiner" | "ring" | "mittel" | "zeige", string> = {
  kleiner: "мізинець", ring: "безіменний палець", mittel: "середній палець", zeige: "вказівний палець",
};

/** „лівий вказівний палець", „правий мізинець", „великий палець". */
function fingerName(f: FingerId): string {
  const { hand, art } = fingerTeile(f);
  if (hand === null || art === "daumen") return "великий палець";
  return `${hand === "links" ? "лівий" : "правий"} ${PALTSI[art]}`;
}

const RIADY = ["у ряду цифр", "у верхньому ряду", "в основному ряду", "у нижньому ряду"];
const SKILKY: Readonly<Record<number, string>> = { 2: "дві", 3: "три", 4: "чотири", 5: "п'ять", 6: "шість" };

/** „праворуч від клавіші А", „за дві клавіші ліворуч від клавіші О". */
function lateral(l: Lage): string {
  const bik = l.richtung === "links" ? "ліворуч" : "праворуч";
  const weit = l.abstand >= 2 ? `за ${SKILKY[l.abstand] ?? String(l.abstand)} клавіші ` : "";
  return `${weit}${bik} від клавіші ${kappe(l.heim ?? "")}`;
}

/** Finger und Lage, z. B. „лівий вказівний палець, праворуч від клавіші А". */
function lageText(l: Lage): string {
  const finger = fingerName(l.finger);
  if (l.istHeim) return `${finger}, основне положення`;
  if (!l.heim) return `${finger}, ${RIADY[l.reihe]}`;
  if (l.reihe === 2) return `${finger}, ${lateral(l)}`;
  if (l.abstand === 0) {
    return `${finger}, ${RIADY[l.reihe]}, ${l.reihe === 3 ? "просто під клавішею" : "просто над клавішею"} ${kappe(l.heim)}`;
  }
  return `${finger}, ${RIADY[l.reihe]}, ${lateral(l)}`;
}

function zusatz(z: KeyAccess): string {
  if (z.mod === "shift") return "тримай клавішу Shift другою рукою і натисни ";
  if (z.mod === "altgr") return "тримай клавішу Alt Gr і натисни ";
  return "натисни ";
}

const MERTVA = "Це мертва клавіша: сама нічого не друкує, а ставить свій знак на літеру, яку натискаєш одразу після неї.";

/** Zeichennamen der Sprachausgabe (Glossar §2.8, `SPOKEN_UK`): der Name steht vor dem Zeichen. */
const ZNAKY: Readonly<Record<string, string>> = {
  ".": "крапка", ",": "кома", "?": "знак питання", "!": "знак оклику", "\"": "лапки", ":": "двокрапка", ";": "крапка з комою",
  "-": "дефіс", "(": "ліва дужка", ")": "права дужка", "'": "апостроф", "%": "відсоток", "/": "скісна риска", "+": "плюс",
  "=": "дорівнює", "*": "зірочка", "_": "підкреслення", "№": "номер", "₴": "знак гривні",
};

/** Der Satz beginnt gross: „Крапка (.)". */
const gross = (s: string): string => s.charAt(0).toLocaleUpperCase("uk") + s.slice(1);

/** Der Name, mit dem ein Griff-Satz beginnt: „Ь (м'який знак)", „5", „Кома (,)". */
function satzName(u: string): string {
  if (u === "ь") return `${kappe(u)} (м'який знак)`;
  if (/^\p{L}$/u.test(u) || /^\d$/.test(u)) return kappe(u);
  return ZNAKY[u] ? `${gross(ZNAKY[u])} (${u})` : u;
}

const SAETZE: GriffSaetze = {
  griff(u, lage, zugang) {
    const name = satzName(u);
    if (zugang?.dead) {
      if (zugang.base === u && !zugang.mod) return `${name}: ${lage ? lageText(lage) : "своя клавіша"}. ${MERTVA}`;
      return `${name}: ${zusatz(zugang)}клавішу ${kappe(zugang.base)}${lage ? ` (${lageText(lage)})` : ""}. ${MERTVA}`;
    }
    if (zugang && (zugang.mod || zugang.base !== u)) {
      return `${name}: ${zusatz(zugang)}клавішу ${kappe(zugang.base)}${lage ? ` (${lageText(lage)})` : ""}.`;
    }
    if (lage) return `${name}: ${lageText(lage)}.`;
    return `${name}: місце цього знака на твоїй клавіатурі ще не описане.`;
  },
};

const griffeVon = (t: readonly string[], layout: KeyboardLayout): string => t.map((u) => griffSatz("uk", layout, u, SAETZE)).join(" ");

// ── Die Sonderteile ──────────────────────────────────────────────────────────

function shiftTeil(t: readonly string[], layout: KeyboardLayout): string {
  const grund =
    "Великі літери друкуєш, тримаючи клавішу Shift другою рукою: для літери з лівої половини клавіатури - правий Shift, " +
    "для літери з правої половини - лівий Shift. Обидві клавіші Shift натискає мізинець.";
  return `${grund} ${griffeVon(t, layout)}`;
}

// ── Die Folge ────────────────────────────────────────────────────────────────

const fix = (text: string) => () => text;
const RIAD = (t: readonly string[]) => `Основний ряд: ${kappen(t)}`;
const NOVI = (t: readonly string[]) => `Нові літери: ${kappen(t)}`;

const BAUPLAENE: readonly LektionsBauplan[] = [
  {
    id: "uk-osnova-1", kind: "home",
    // Falle 41: die Zeichen auf KeyF/KeyJ der Haupttastatur (auf `ua` а und о) - erst beim Bauen gelesen, nie beim Laden.
    get einheiten() {
      return [...heimZeichenDesWeges("uk")];
    },
    titel: RIAD,
    vorspann: fix(
      "Поклади пальці на основний ряд - це основне положення. На клавішах А і О є маленькі виступи: за ними ти знаходиш " +
        "основне положення, не дивлячись на клавіатуру. Починаєш із цих двох клавіш, двома вказівними пальцями. Кожен палець " +
        "вирушає звідси й сюди повертається.",
    ),
  },
  {
    id: "uk-osnova-2", kind: "home", einheiten: ["в", "л"], titel: RIAD,
    vorspann: fix("Поруч із вказівними пальцями - середні: В ліворуч, Л праворуч. Вказівні пальці лишаються на виступах. Перше слово: «вол»."),
  },
  {
    id: "uk-osnova-3", kind: "home", einheiten: ["і", "д"], titel: RIAD,
    vorspann: fix("Тепер безіменні пальці: І ліворуч, Д праворуч. Пальці легкі й розслаблені. Слова: «вода», «дід» і «лід»."),
  },
  {
    id: "uk-osnova-4", kind: "home", einheiten: ["п", "р"], titel: RIAD,
    vorspann: fix(
      "П і Р лежать в основному ряду посередині. До П тягнеться лівий вказівний палець, до Р - правий. Після кожного " +
        "натискання палець повертається на свою клавішу. Слова: «пора» і «правда».",
    ),
  },
  {
    id: "uk-chasti-1", kind: "letters", einheiten: ["е", "н"],
    titel: (t) => `Часті літери: ${kappen(t)}`,
    vorspann: fix("Е і Н - у верхньому ряду. З ними вже виходять: «вона», «він», «поле» і «перо»."),
  },
  {
    id: "uk-chasti-2", kind: "letters", einheiten: ["т", "и"],
    titel: (t) => `Часті літери: ${kappen(t)}`,
    vorspann: fix(
      "Т і И - у нижньому ряду. И та І - різні літери. Слова: «літо», «тато», «трава», «вітер» і «дитина».",
    ),
  },
  {
    id: "uk-velyki", kind: "shift", einheiten: [".", ","], enablesShift: true,
    titel: () => "Великі літери, крапка і кома",
    vorspann: fix(
      "Досі великі літери за тебе друкував Tastenflow. Відтепер їх друкує твоя рука: «Ірина», «Олена», «Петро» і " +
        "«Дніпро». Речення починається з великої літери й закінчується крапкою. Кома ділить речення на частини.",
    ),
    griffe: shiftTeil,
  },
  {
    id: "uk-litery-1", kind: "letters", einheiten: ["я", "м", "с"], titel: NOVI,
    vorspann: fix("З Я, М і С: «мама», «місто», «мрія», «сад» і «море»."),
  },
  {
    id: "uk-litery-2", kind: "letters", einheiten: ["к", "у", "б"], titel: NOVI,
    vorspann: fix("З К, У і Б: «кіт», «урок», «яблуко» і «друкувати»."),
  },
  {
    id: "uk-litery-3", kind: "letters", einheiten: ["з", "ч", "г"], titel: NOVI,
    vorspann: fix("З З, Ч і Г: «зима», «очі», «гора», «книга» і «читати»."),
  },
  {
    id: "uk-litery-4", kind: "letters", einheiten: ["й", "ж", "ь"], titel: NOVI,
    vorspann: fix("Й, Ж і Ь - м'який знак: «мій», «твій», «жовтий», «день» і «кінь»."),
  },
  {
    id: "uk-litery-5", kind: "letters", einheiten: ["ц", "ю", "щ"], titel: NOVI,
    vorspann: fix("Ц, Ю і Щ: «сонце», «вулиця», «люди», «ще» і «борщ»."),
  },
  {
    id: "uk-litery-6", kind: "letters", einheiten: ["ш", "х"], titel: NOVI,
    vorspann: fix("Ш і Х: «школа», «шапка», «машина», «хата» і «хліб»."),
  },
  {
    id: "uk-litery-7", kind: "letters", einheiten: ["є", "ї", "ф"], titel: NOVI,
    vorspann: fix(
      "Є і Ї - українські літери, кожна має свою клавішу. З ними і з Ф: «Україна», «їжак», «моє», «її» і «фото».",
    ),
  },
  {
    // Bauplan U2: auf `ua-std` fehlt der Apostroph - dort bringt die Lektion nur ґ.
    id: "uk-apostrof", kind: "letters", einheiten: ["'", "ґ"],
    titel: (t) => (t.includes("'") ? "Апостроф і Ґ" : `Нова літера: ${kappen(t)}`),
    vorspann: (t) =>
      (t.includes("'")
        ? "Апостроф стоїть усередині слова: «м'яч», «п'ять», «сім'я» і «ім'я». "
        : "На цій розкладці немає апострофа. Для апострофа вибери розширену українську розкладку. ") +
      "Ґ - рідкісна літера: «ґудзик» і «ґанок».",
  },
  {
    id: "uk-rozdilovi", kind: "punctuation", einheiten: ["?", "!", "\"", ":", ";", "-", "(", ")"],
    titel: (t) => `Розділові знаки: ${t.join(" ")}`,
    vorspann: fix(
      "Знак питання закінчує питання, знак оклику - оклик. Двокрапка відкриває перелік. Дефіс з'єднує частини слова: " +
        "«хто-небудь» і «будь-що». Перед цими знаками пробілу немає, після них є. Спробуй: «Як справи?» і «Молодець!»",
    ),
  },
  {
    id: "uk-tsyfry", kind: "numbers", einheiten: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    titel: () => "Ряд цифр",
    vorspann: fix("Дати, години, ціни й результати: тепер цифри. Кожен палець піднімається у свій стовпчик."),
  },
  {
    id: "uk-symvoly", kind: "symbols", einheiten: ["%", "/", "+", "=", "*", "_", "№", "₴"],
    titel: (t) => `Символи: ${t.join(" ")}`,
    vorspann: fix("Ці знаки потрібні для обчислень, відсотків, номерів і цін. Тут точність важливіша за швидкість."),
  },
  {
    id: "uk-teksty", kind: "text", einheiten: [], corpusKinds: ["satz"],
    titel: () => "Тексти",
    vorspann: fix(
      "Тепер уся клавіатура твоя, і ти друкуєш цілі тексти: про Карпати й Чорне море, про Дніпро й степ, про школу, " +
        "спорт, тварин і звичайний день.",
    ),
  },
];

// ── Bauen je Tastatur ────────────────────────────────────────────────────────

/** Die Folge der Bauplan-IDs, zum Nachprüfen im Wächter. */
export const UK_LEKTIONS_IDS: readonly string[] = BAUPLAENE.map((b) => b.id);

/** Der GESCHRIEBENE erste Absatz einer Lektion (für den Beispielwort-Wächter). */
export function ukLektionsVorspannFuer(id: string, tasten: readonly string[]): string {
  return BAUPLAENE.find((b) => b.id === id)?.vorspann(tasten) ?? "";
}

/** Die ukrainischen Pflicht-Tastaturen (G3b): Українська (розширена) = Bezug, Українська. */
const UK_LAYOUTS: readonly LayoutId[] = ["ua", "ua-std"];

const bauen = lektionenJeTastatur("uk", UK_LAYOUTS, BAUPLAENE, SAETZE);

/** Die Lektionen des Weges „uk" auf dieser Tastatur (gecacht; `introByLayout` trägt die andere Pflicht-Tastatur). */
export function ukLektionenFuerLayout(layoutId: LayoutId): readonly Lesson[] {
  return bauen(layoutId);
}
