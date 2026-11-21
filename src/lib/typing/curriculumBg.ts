/**
 * ★★★ DIE LEKTIONEN DES WEGES „bg" (Bulgarisch) - F4-BG (29.10.2026), vorher leerer Einhängepunkt (G3c-VERTEILER).
 *
 * Bauart wie `curriculumRo.ts`; die Rechnung (Tasten je Lektion, Griffe aus den Daten der Tastatur, `introByLayout`) steht im
 * `lektionenBaukasten.ts`. Neu auf Bulgarisch geschrieben, nichts übersetzt. Begriffe nach dem Glossar
 * (`recherche-bulgarisch-2026-10-25/GLOSSAR-bg.md` §1, §2.1, §2.8): *основен ред* (ред = auch die Übungszeile - darum immer mit
 * „основен/горен/долен"), *изходна позиция*, *издатини*, *кутре · безименен пръст · среден пръст · показалец · палец*, *клавиш*,
 * *интервал*; Tastennamen lateinisch und nie gebeugt (Regel 11: „задръж Shift"); Kinder mit **ти** (Regel 1), ohne Geschlecht
 * (Regel 2: kein l-Partizip, kein Adjektiv am Kind); nur Kyrillisch (Regel 15, ausser ganzen Latein-Namen); nur der Bindestrich `-`
 * (der Halbgeviertstrich ist hier nur EINHEIT und steht im Text als Name „тире", nie als Zeichen); Beispielwörter in „…“
 * (U+201E/U+201C, Regel 7).
 *
 * ── DIE REGEL (wie ro/hu/cs) ─────────────────────────────────────────────────────────────────────────────────────────
 * Die Tasten aller Lektionen hintereinander SIND `introOrder("bg")` - auf allen vier Tastaturen (`bg` BDS = Bezug,
 * `bg-schreibm`, `bg-phon`, `bg-phon-trad`). EINE Folge für alle (F4-KYR-GR): auf den phonetischen Tastaturen liegen die Tasten
 * anderswo - die Griffe werden darum gerechnet, nie geschrieben, und der Vorspann nennt keine Finger. Auf `bg-schreibm` fehlen
 * `ѝ „ “ € ` und der Halbgeviertstrich: sie fallen dort weg, der Text richtet sich nach den Tasten, die ankommen.
 * Wächter: `tests/tastenflow-lektionen-bg.test.ts`.
 */
import type { Lesson } from "./curriculum";
import type { FingerId, KeyAccess } from "./fingers";
import { heimZeichenDesWeges } from "./heimtasten";
import type { KeyboardLayout, LayoutId } from "./layouts";
import { fingerTeile, griffSatz, lektionenJeTastatur, type GriffSaetze, type Lage, type LektionsBauplan } from "./lektionenBaukasten";
import { kappeFuer } from "./sprachRegister";

/** Der Halbgeviertstrich als Zeichencode (der Strich-Wächter erlaubt im Quelltext nur den Bindestrich). */
const HALBGEVIERT = String.fromCharCode(0x2013);

// ── Namen ────────────────────────────────────────────────────────────────────

/** Was auf der Kappe steht: Buchstaben gross, sonst das Zeichen. */
const kappe = (k: string): string => kappeFuer(k, "bg");

/** Die Schulnamen der Buchstaben, die Kinder verwechseln (Glossar §2.1, §2.8). */
const BUKVI: Readonly<Record<string, string>> = {
  ъ: "ер голям", ь: "ер малък", й: "и кратко", ѝ: "и с ударение",
};

/** „О и Т", „А, Б и В". */
function aufzaehlen(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return `${teile.slice(0, -1).join(", ")} и ${teile[teile.length - 1]}`;
}
const kappen = (t: readonly string[]): string => aufzaehlen(t.map(kappe));

/** Die Finger ausser dem kleinen (der ist sächlich: „кутре"). */
const PRASTI: Record<"ring" | "mittel" | "zeige", string> = { ring: "безименен пръст", mittel: "среден пръст", zeige: "показалец" };

/** Finger mit Seite und Artikel (Subjektform): „левият показалец", „дясното кутре". */
function fingerName(f: FingerId): string {
  const { hand, art } = fingerTeile(f);
  if (hand === null || art === "daumen") return "палецът";
  const links = hand === "links";
  if (art === "kleiner") return links ? "лявото кутре" : "дясното кутре";
  return `${links ? "левият" : "десният"} ${PRASTI[art]}`;
}

const REDOVE = ["на реда с цифрите", "на горния ред", "на основния ред", "на долния ред"];
const BROJ: Readonly<Record<number, string>> = { 2: "два", 3: "три", 4: "четири", 5: "пет", 6: "шест" };

/** „вдясно от клавиша О", „на два клавиша вляво от клавиша Т". */
function lateral(l: Lage): string {
  const strana = l.richtung === "links" ? "вляво" : "вдясно";
  const weit = l.abstand >= 2 ? `на ${BROJ[l.abstand] ?? String(l.abstand)} клавиша ` : "";
  return `${weit}${strana} от клавиша ${kappe(l.heim ?? "")}`;
}

/** Finger und Lage, z. B. „левият показалец, вдясно от клавиша О". */
function lageText(l: Lage): string {
  const finger = fingerName(l.finger);
  if (l.istHeim) return `${finger}, в изходна позиция`;
  if (!l.heim) return `${finger}, ${REDOVE[l.reihe]}`;
  if (l.reihe === 2) return `${finger}, ${lateral(l)}`;
  if (l.abstand === 0) {
    return `${finger}, ${REDOVE[l.reihe]}, ${l.reihe === 3 ? "точно под клавиша" : "точно над клавиша"} ${kappe(l.heim)}`;
  }
  return `${finger}, ${REDOVE[l.reihe]}, ${lateral(l)}`;
}

function zusatz(z: KeyAccess): string {
  if (z.mod === "shift") return "задръж Shift с другата ръка и натисни ";
  if (z.mod === "altgr") return "задръж Alt Gr и натисни ";
  return "натисни ";
}

const MARTAV = "Това е мъртъв клавиш: сам не пише нищо, а слага знака си върху буквата, която натискаш веднага след него.";

/** Zeichennamen der Sprachausgabe (Glossar §2.8, `SPOKEN_BG`): der Name steht vor dem Zeichen. Der Halbgeviertstrich nur als Name. */
const ZNACI: Readonly<Record<string, string>> = {
  ".": "точка", ",": "запетая", "?": "въпросителен знак", "!": "удивителен знак", ":": "двоеточие", ";": "точка и запетая",
  "\"": "кавички", "„": "долни кавички", "“": "горни кавички", "-": "малко тире", "(": "лява скоба", ")": "дясна скоба",
  "%": "процент", "/": "наклонена черта", "+": "плюс", "=": "равно", "№": "номер", "§": "параграф", "€": "евро",
};

/** Der Name, mit dem ein Griff-Satz beginnt: „Ъ (ер голям)", „5", „запетая (,)", „тире". */
function satzName(u: string): string {
  if (u === HALBGEVIERT) return "Тире";
  if (BUKVI[u]) return `${kappe(u)} (${BUKVI[u]})`;
  if (/^\p{L}$/u.test(u) || /^\d$/.test(u)) return kappe(u);
  return ZNACI[u] ? `${gross(ZNACI[u])} (${u})` : u;
}

/** Der Satz beginnt gross: „Точка (.)". */
const gross = (s: string): string => s.charAt(0).toLocaleUpperCase("bg") + s.slice(1);

const SAETZE: GriffSaetze = {
  griff(u, lage, zugang) {
    const name = satzName(u);
    if (zugang?.dead) {
      if (zugang.base === u && !zugang.mod) return `${name}: ${lage ? lageText(lage) : "своя клавиш"}. ${MARTAV}`;
      return `${name}: ${zusatz(zugang)}клавиша ${kappe(zugang.base)}${lage ? ` (${lageText(lage)})` : ""}. ${MARTAV}`;
    }
    if (zugang && (zugang.mod || zugang.base !== u)) {
      return `${name}: ${zusatz(zugang)}клавиша ${kappe(zugang.base)}${lage ? ` (${lageText(lage)})` : ""}.`;
    }
    if (lage) return `${name}: ${lageText(lage)}.`;
    return `${name}: мястото на този знак още не е описано за твоята клавиатура.`;
  },
};

const griffeVon = (t: readonly string[], layout: KeyboardLayout): string => t.map((u) => griffSatz("bg", layout, u, SAETZE)).join(" ");

// ── Die Sonderteile ──────────────────────────────────────────────────────────

/** Wo die Fühlmarken sind - aus den Daten der Tastatur (KeyF/KeyJ = Grundreihe, vierte und siebte Taste). */
function izdatini(layout: KeyboardLayout): string {
  const f = layout.rows[2]?.keys[3] ?? "";
  const j = layout.rows[2]?.keys[6] ?? "";
  if (f === "о" && j === "т") {
    return "На клавишите О и Т има малки издатини: по тях намираш изходната позиция, без да гледаш клавиатурата.";
  }
  return `На твоята клавиатура издатините са на клавишите ${kappe(f)} и ${kappe(j)}, а О и Т имат друго място.`;
}

function shiftTeil(t: readonly string[], layout: KeyboardLayout): string {
  const grund =
    "Главните букви пишеш, като задържиш Shift с другата ръка: за буква от лявата половина на клавиатурата - десния Shift, " +
    "за буква от дясната половина - левия Shift. И двата Shift натиска кутрето.";
  return `${grund} ${griffeVon(t, layout)}`;
}

// ── Die Folge ────────────────────────────────────────────────────────────────

const fix = (text: string) => () => text;
const RED = (t: readonly string[]) => `Основен ред: ${kappen(t)}`;
const NOVI = (t: readonly string[]) => `Нови букви: ${kappen(t)}`;

const BAUPLAENE: readonly LektionsBauplan[] = [
  {
    id: "bg-osnoven-1", kind: "home",
    // Falle 41: die Zeichen auf KeyF/KeyJ der Haupttastatur (auf `bg` о und т) - erst beim Bauen gelesen, nie beim Laden.
    get einheiten() {
      return [...heimZeichenDesWeges("bg")];
    },
    titel: RED,
    vorspann: fix(
      "Сложи пръстите на основния ред - това е изходната позиция. Започваш с двата показалеца. Всеки пръст тръгва оттук " +
        "и се връща тук. Първата дума: „то“.",
    ),
    griffe: (t, layout) => `${izdatini(layout)} ${griffeVon(t, layout)}`,
  },
  {
    id: "bg-osnoven-2", kind: "home", einheiten: ["а", "н"], titel: RED,
    vorspann: fix("Следват А и Н. Показалците остават на местата си. Вече пишеш: „на“, „но“, „та“, „тон“ и „нота“."),
  },
  {
    id: "bg-osnoven-3", kind: "home", einheiten: ["в", "м", "я"], titel: RED,
    vorspann: fix(
      "Следват В, М и Я. Палците почиват на клавиша за интервал. Думи: „там“, „мама“, „моя“, " +
        "„твоя“, „нова“ и „мята“.",
    ),
  },
  {
    id: "bg-glasni", kind: "letters", einheiten: ["е", "и"],
    titel: (t) => `Чести букви: ${kappen(t)}`,
    vorspann: fix("Е и И са сред най-честите букви в българския език. С тях пишеш: „ние“, „вие“, „име“, „тема“, „вино“ и „нея“."),
  },
  {
    // Bauplan Stufe 4: Umschalt, Punkt und Komma zusammen (auf BDS Komma auf Q, Punkt rechts der 0 - ohne Shift).
    id: "bg-glavni", kind: "shift", einheiten: [".", ","], enablesShift: true,
    titel: () => "Главни букви, точка и запетая",
    vorspann: fix(
      "Досега Tastenflow пишеше главните букви вместо теб. Отсега ги пише твоята ръка: „Мая“, „Ема“, „Нина“, „Антон“ и " +
        "„Тони“. Изречението започва с главна буква и завършва с точка. Запетаята разделя изречението на части.",
    ),
    griffe: shiftTeil,
  },
  {
    id: "bg-bukvi-1", kind: "letters", einheiten: ["с", "д", "р"], titel: NOVI,
    vorspann: fix("Със С, Д и Р пишеш: „сестра“, „море“, „дете“, „радио“, „вода“ и „сирене“."),
  },
  {
    id: "bg-bukvi-2", kind: "letters", einheiten: ["к", "л"], titel: NOVI,
    vorspann: fix("С К и Л: „кола“, „село“, „мляко“, „ракета“ и „лале“."),
  },
  {
    id: "bg-bukvi-3", kind: "letters", einheiten: ["п", "з"], titel: NOVI,
    vorspann: fix("С П и З: „зима“, „пет“, „език“, „пазар“ и „лопата“."),
  },
  {
    id: "bg-bukvi-4", kind: "letters", einheiten: ["г", "б", "ъ"], titel: NOVI,
    vorspann: fix(
      "Ъ - ер голям - е буква, която малко езици имат. Без нея не можеш да напишеш „път“, „сън“ и „български“. Още думи: " +
        "„гора“, „баба“, „гъба“ и „ябълка“.",
    ),
  },
  {
    id: "bg-bukvi-5", kind: "letters", einheiten: ["у", "ч"], titel: NOVI,
    vorspann: fix("С У и Ч: „уча“, „урок“, „очи“, „чета“, „мечка“ и „ученик“."),
  },
  {
    id: "bg-bukvi-6", kind: "letters", einheiten: ["ж", "ш", "щ"], titel: NOVI,
    vorspann: fix("Ж, Ш и Щ: „жаба“, „шапка“, „нощ“, „щастие“ и „училище“."),
  },
  {
    id: "bg-bukvi-7", kind: "letters", einheiten: ["й", "х"], titel: NOVI,
    vorspann: fix("Й - и кратко - и Х: „чай“, „май“, „край“, „хляб“ и „хубаво“."),
  },
  {
    id: "bg-bukvi-8", kind: "letters", einheiten: ["ц", "ф", "ю"], titel: NOVI,
    vorspann: fix("Ц, Ф и Ю: „цвете“, „улица“, „фар“, „юли“ и „любов“."),
  },
  {
    // Bauplan B4: ѝ ist ein anderes Wort als и - eigene späte Lektion. Auf `bg-schreibm` fehlt es; dort bringt die Lektion nur ь.
    id: "bg-redki", kind: "letters", einheiten: ["ь", "ѝ"],
    titel: (t) => `Редки букви: ${kappen(t)}`,
    vorspann: (t) =>
      "Ь - ер малък - стои само пред О: „синьо“, „шофьор“ и „актьор“. Главно Ь няма." +
      (t.includes("ѝ")
        ? " Ѝ - и с ударение - е друга дума от и: „и“ свързва думи, а „ѝ“ значи „на нея“. Напиши: „дай ѝ“."
        : " На твоята клавиатура няма клавиш за ѝ - и с ударение."),
  },
  {
    id: "bg-pripinatelni-1", kind: "punctuation", einheiten: ["?", "!", ":", ";"],
    titel: () => "Въпросителен знак, удивителен знак, двоеточие, точка и запетая: ? ! : ;",
    vorspann: fix(
      "Въпросителният знак завършва въпрос, удивителният - възклицание. Двоеточието обявява изброяване или обяснение. Пред " +
        "тези знаци няма интервал, след тях има. Опитай: „Как си?“ и „Браво!“",
    ),
  },
  {
    // Auf `bg-schreibm` und `bg-phon-trad` fehlen „ “ und das тире (Bauplan B6) - die Griffe nennen nur, was ankommt.
    id: "bg-pripinatelni-2", kind: "punctuation", einheiten: ["\"", "„", "“", "-", HALBGEVIERT, "(", ")"],
    titel: () => "Кавички, тирета и скоби",
    vorspann: fix(
      "Българските кавички се отварят долу и се затварят горе. Малкото тире свързва части от една дума: „по-добре“ и " +
        "„най-хубаво“. Тирето стои с интервал от двете страни и разделя изречението. Скобите затварят бележка.",
    ),
  },
  {
    id: "bg-cifri", kind: "numbers", einheiten: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    titel: () => "Редът с цифрите",
    vorspann: fix(
      "Дати, часове, цени и резултати: идват цифрите. На българската клавиатура цифрите се пишат без Shift. Всеки пръст " +
        "се качва в своята колона.",
    ),
  },
  {
    id: "bg-simvoli", kind: "symbols", einheiten: ["%", "/", "+", "=", "№", "§", "€"],
    titel: (t) => `Символи: ${t.join(" ")}`,
    vorspann: fix("Тези знаци са за сметки, проценти, цени и номера. Тук точността е по-важна от скоростта."),
  },
  {
    id: "bg-tekstove", kind: "text", einheiten: [], corpusKinds: ["satz"],
    titel: () => "Текстове",
    vorspann: fix(
      "Сега цялата клавиатура е твоя и пишеш цели текстове: за Рила и Родопите, за Черно море и Дунав, за училище, спорт, " +
        "животни и един обикновен ден.",
    ),
  },
];

// ── Bauen je Tastatur ────────────────────────────────────────────────────────

/** Die Folge der Bauplan-IDs, zum Nachprüfen im Wächter. */
export const BG_LEKTIONS_IDS: readonly string[] = BAUPLAENE.map((b) => b.id);

/** Der GESCHRIEBENE erste Absatz einer Lektion (für den Beispielwort-Wächter). */
export function bgLektionsVorspannFuer(id: string, tasten: readonly string[]): string {
  return BAUPLAENE.find((b) => b.id === id)?.vorspann(tasten) ?? "";
}

/** Die bulgarischen Pflicht-Tastaturen (G3b): BDS (Bezug), Schreibmaschine, Phonetik neu und traditionell. */
const BG_LAYOUTS: readonly LayoutId[] = ["bg", "bg-schreibm", "bg-phon", "bg-phon-trad"];

const bauen = lektionenJeTastatur("bg", BG_LAYOUTS, BAUPLAENE, SAETZE);

/** Die Lektionen des Weges „bg" auf dieser Tastatur (gecacht; `introByLayout` trägt die anderen Pflicht-Tastaturen). */
export function bgLektionenFuerLayout(layoutId: LayoutId): readonly Lesson[] {
  return bauen(layoutId);
}
