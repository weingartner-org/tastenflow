/**
 * ★ G3c-VERTEILER (25.10.2026): DIE TASTEN IN UKRAINISCH - „Tasten erkunden", Tastennamen, Suchrunde.
 * ★ O-INHALT-UK (29.10.2026): gefüllt - Vorbild `tastenErklaerungEn.ts` (dieselben Fächer, Eintrag für Eintrag), neu auf Ukrainisch
 * geschrieben nach dem Glossar `recherche-ukrainisch-2026-10-25/GLOSSAR-uk.md`.
 *
 * Was hier steht, liest der Verteiler `tastenErklaerung.ts` über {@link TASTEN_SATZ_UK}, die Bauteile `LetterMap.tsx`,
 * `PupilStatsPanel.tsx`, `TastenflowReiter.tsx` über {@link unitLabelUk} und `TastenErkunden.tsx` über {@link suchSatzUk}. Noch NICHT
 * angeschlossen (Etappe O, gemeinsame Dateien): die Rahmensätze in `findenRunde.ts`, `StandZeile.tsx`, `TastenErkunden.tsx` und die
 * Wörter `ALTGR_WORT`/`SHIFT_WORT`/Tastmarke im Verteiler.
 *
 * ── Die Regeln der Sätze (Glossar §1) ──────────────────────────────────────
 *  · Ein Kind liest „ти" (Regel 1): „Натисни …". KEINE Vergangenheit und kein Adjektiv am Kind (Regel 2: „ти зробив/зробила");
 *    neutral sind Gegenwart, Befehlsform und unpersönliche Formen auf -но/-то („Знайдено!").
 *  · Tastennamen LATEINISCH wie auf der Kappe, nie gebeugt, darum mit Kopfwort „клавіша" (Regel 11): „натисни клавішу Shift";
 *    ukrainisch sind nur „пробіл" (wird gebeugt) und die Pfeile („стрілка вліво"). Alt Gr heisst „AltGr" (§2.9).
 *  · Kein Russismus (Regel 14). Nur Bindestrich, Apostroph U+0027 („з'являється"). Keine Maus-Wörter (Regel 8). Keine
 *    Anführungszeichen in Live-Zeilen (Regel 7). Navigation nie „Домашня сторінка" für Home (Regel 10).
 * ⚠️ [G]: von einer Person mit Ukrainisch als Erstsprache gegenzulesen (Glossar §6).
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import type { LayoutId } from "./layouts";
import type { TastenErklaerung } from "./tastenErklaerung";
import type { TastenErklaerungSatz } from "./tastenErklaerungSatz";
import type { AKZENTE_EN } from "./tastenErklaerungEn";
import { SHIFT_UNIT, unitKindImWeg } from "./letters";
import type { Lernweg } from "./lernweg";
import { grossFuer, istBuchstabe } from "./sprachRegister";

/** Halbgeviertstrich als Zeichencode - das Zeichen ist hier die SACHE (eine Taste), kein vorgelesener Text (Strich-Wächter). */
const HALBGEVIERT = String.fromCharCode(0x2013);

/* ══ Sondertasten ═══════════════════════════════════════════════════════════ */

/** „На німецькій клавіатурі на ній написано Strg." - nur bei eingestellter deutscher Tastatur (Glossar §2.9). */
function deutscheAufschrift(layout: LayoutId, wort: string): string[] {
  return layout === "de" ? [`На німецькій клавіатурі на ній написано ${wort}.`] : [];
}

/** Ukrainische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
export function sondertasteUk(id: string, plattform: Plattform, layout: LayoutId = "de"): TastenErklaerung | null {
  const mac = plattform === "macos";
  const pfeilWort = mac ? "Option" : "Ctrl";
  switch (id) {
    case "tabulator":
      return {
        kurz: null,
        name: "клавіша Tab",
        was: [
          "переходить від одного елемента до наступного, наприклад до посилання, поля або кнопки.",
          "Разом із Shift переходить назад.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return mac
        ? { kurz: null, name: "клавіша Return", was: ["підтверджує й надсилає.", "Відкриває посилання і починає новий рядок у тексті."] }
        : {
            kurz: null,
            name: "клавіша Enter",
            was: ["підтверджує й надсилає.", "Відкриває посилання, натискає кнопки і починає новий рядок у тексті."],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "пробіл",
        was: ["ставить проміжок між двома словами.", "Також натискає кнопки і ставить позначки у прапорцях."],
      };
    case "loeschtaste":
      return {
        kurz: null,
        name: "клавіша Backspace",
        was: ["стирає знак ліворуч від курсора.", "Так виправляєш помилку."],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "клавіша видалення праворуч",
            was: ["стирає знак праворуч від курсора.", "Якщо такої клавіші немає, натисни Fn і Delete."],
          }
        : {
            kurz: "Del",
            name: "клавіша Delete",
            was: ["стирає знак праворуч від курсора.", "Також видаляє вибрані файли.", ...deutscheAufschrift(layout, "Entf")],
          };
    case "esc":
      return {
        kurz: "Esc",
        name: "клавіша Escape",
        was: ["скасовує.", "Закриває меню, вікна й повідомлення.", "У Tastenflow повертає тебе до поля для друку."],
      };
    case "umschalt":
      return {
        kurz: null,
        name: "клавіша Shift",
        was: ["друкує великі літери, поки її тримаєш.", "Дає і верхній знак на клавіші, наприклад знак питання."],
      };
    case "feststell":
      return { kurz: null, name: "клавіша Caps Lock", was: ["друкує все великими літерами, доки не натиснеш її ще раз."] };
    case "pfeil-links":
      return {
        kurz: null,
        name: "стрілка вліво",
        was: ["переміщує курсор на один знак уліво.", `Разом із ${pfeilWort} перескакує ціле слово.`],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "стрілка вправо",
        was: ["переміщує курсор на один знак управо.", `Разом із ${pfeilWort} перескакує ціле слово.`],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "стрілка вгору",
        was: [
          "переміщує курсор на рядок угору.",
          "У списках і меню переходить до попереднього пункту.",
          `Разом із ${pfeilWort} перескакує цілий абзац угору.`,
        ],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "стрілка вниз",
        was: [
          "переміщує курсор на рядок униз.",
          "У списках і меню переходить до наступного пункту.",
          `Разом із ${pfeilWort} перескакує цілий абзац униз.`,
        ],
      };
    case "pos1":
      return {
        kurz: null,
        name: "клавіша Home",
        was: [
          "переходить на початок рядка.",
          "На вебсторінці переходить у самий верх.",
          "Разом із Ctrl переходить на початок усього тексту.",
          ...deutscheAufschrift(layout, "Pos 1"),
        ],
      };
    case "ende":
      return {
        kurz: null,
        name: "клавіша End",
        was: [
          "переходить у кінець рядка.",
          "На вебсторінці переходить у самий низ.",
          "Разом із Ctrl переходить у кінець усього тексту.",
          ...deutscheAufschrift(layout, "Ende"),
        ],
      };
    case "bild-auf":
      return { kurz: "PgUp", name: "клавіша Page Up", was: ["переходить на один екран угору.", ...deutscheAufschrift(layout, "Bild ↑")] };
    case "bild-ab":
      return { kurz: "PgDn", name: "клавіша Page Down", was: ["переходить на один екран униз.", ...deutscheAufschrift(layout, "Bild ↓")] };
    case "einfg":
      return {
        kurz: "Ins",
        name: "клавіша Insert",
        was: [
          "це клавіша читача екрана для NVDA і JAWS.",
          "Майже кожна команда читача екрана починається з неї.",
          ...deutscheAufschrift(layout, "Einfg"),
        ],
      };
    case "strg":
      return {
        kurz: "Ctrl",
        name: "клавіша Control",
        was: [
          "потрібна для сполучень клавіш.",
          "Ctrl + C копіює, Ctrl + V вставляє, Ctrl + Z скасовує.",
          "Сама по собі одразу зупиняє мовлення.",
          ...deutscheAufschrift(layout, "Strg"),
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "клавіша Alt",
        was: ["потрібна для сполучень клавіш.", "Alt + Tab перемикає вікна.", "У Tastenflow Alt + H відкриває довідку."],
      };
    case "altgr":
      return {
        kurz: null,
        name: "клавіша AltGr",
        was: [
          // На британській клавіатурі євро на AltGr + 4, на німецькій і швейцарській - на AltGr + E.
          `друкує третій знак на клавіші, наприклад знак євро з AltGr + ${layout === "uk" ? "4" : "E"}.`,
        ],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "клавіша Windows",
        was: [
          "відкриває меню Пуск.",
          "Натисни її ще раз, щоб закрити.",
          "Разом з іншими клавішами робить більше, наприклад Win + D показує робочий стіл.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "cmd",
        name: "клавіша Command",
        was: ["потрібна для сполучень клавіш.", "cmd + C копіює, cmd + V вставляє, cmd + Z скасовує."],
      };
    case "wahltaste":
      return {
        kurz: null,
        name: "клавіша Option",
        was: ["друкує символи, наприклад равлика.", "Разом зі стрілками перескакує ціле слово."],
      };
    case "ctrl":
      return {
        kurz: "ctrl",
        name: "клавіша Control",
        was: ["входить до сполучень клавіш на Mac.", "Сама по собі зупиняє мовлення VoiceOver."],
      };
    case "fn":
      return {
        kurz: "fn",
        name: "клавіша Fn",
        was: ["дає іншим клавішам другу роботу, наприклад робити звук гучнішим і тихішим."],
      };
    default:
      return null;
  }
}

/** Wie die Taste in einer KOMBINATION und gross in der Mitte heisst. */
export const TASTE_KURZ_UK: Readonly<Record<string, string>> = {
  tabulator: "Tab",
  eingabe: "Enter",
  zeilenschalter: "Return",
  leertaste: "пробіл",
  loeschtaste: "Backspace",
  entf: "Delete",
  esc: "Esc",
  umschalt: "Shift",
  feststell: "Caps Lock",
  "pfeil-links": "стрілка вліво",
  "pfeil-rechts": "стрілка вправо",
  "pfeil-auf": "стрілка вгору",
  "pfeil-ab": "стрілка вниз",
  pos1: "Home",
  ende: "End",
  "bild-auf": "Page Up",
  "bild-ab": "Page Down",
  einfg: "Insert",
  strg: "Ctrl",
  alt: "Alt",
  altgr: "AltGr",
  "windows-taste": "Win",
  befehlstaste: "cmd",
  wahltaste: "Option",
  ctrl: "ctrl",
  fn: "fn",
};

/* ══ Tasten ausserhalb des Wörterbuchs ═════════════════════════════════════ */

const F_TASTEN_WINDOWS_UK: Readonly<Record<string, readonly string[]>> = {
  F1: ["відкриває довідку в багатьох програмах."],
  F2: ["перейменовує вибраний файл."],
  F3: ["починає пошук."],
  F4: ["разом з Alt закриває вікно."],
  F5: ["оновлює вебсторінку.", "Тут нічого не стається, можеш досліджувати далі."],
  F6: ["переходить до адресного рядка в браузері."],
  F7: ["перевіряє правопис у Word."],
  F10: ["переходить до рядка меню в багатьох програмах."],
  F11: ["вмикає і вимикає повноекранний режим у браузері.", "На ноутбуці часто разом із клавішею Fn."],
  F12: ["відкриває вікно Зберегти як у Word."],
};

/** Ukrainisch zu `nachKey` - F-Tasten, Num, Menü-Taste, Lautstärke, Totaste. */
export function nachKeyUk(key: string, plattform: Plattform, layout: LayoutId = "de"): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? ["має власне завдання в деяких програмах.", "На Mac ці клавіші часто керують яскравістю і гучністю."]
        : (F_TASTEN_WINDOWS_UK[key] ?? ["має власне завдання в деяких програмах."]);
    return { kurz: key, name: "функціональна клавіша", was };
  }
  switch (key) {
    case "Home":
      return sondertasteUk("pos1", "windows", layout);
    case "End":
      return sondertasteUk("ende", "windows", layout);
    case "PageUp":
      return sondertasteUk("bild-auf", "windows", layout);
    case "PageDown":
      return sondertasteUk("bild-ab", "windows", layout);
    case "Insert":
      return sondertasteUk("einfg", "windows", layout);
    case "NumLock":
      return { kurz: null, name: "клавіша Num Lock", was: ["вмикає і вимикає цифри на цифровому блоці."] };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`).
    case "Clear":
      return {
        kurz: "5",
        name: "клавіша 5 на цифровому блоці",
        was: ["друкує 5, коли Num Lock увімкнено.", "Зараз Num Lock вимкнено, тому вона нічого не робить."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "клавіша меню",
        was: ["відкриває меню з командами для місця, де ти зараз.", "Shift + F10 робить те саме."],
      };
    case "PrintScreen":
      return {
        kurz: null,
        name: "клавіша Print Screen",
        was: ["робить знімок екрана.", "У Windows часто відкриває програму для знімків екрана.", "Esc закриває її знову."],
      };
    case "ScrollLock":
      return { kurz: null, name: "клавіша Scroll Lock", was: ["сьогодні майже не потрібна."] };
    case "Pause":
      return { kurz: null, name: "клавіша Pause", was: ["сьогодні майже не потрібна."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "клавіша гучніше", was: ["робить звук гучнішим."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "клавіша тихіше", was: ["робить звук тихішим."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "клавіша вимкнення звуку", was: ["вимикає звук і вмикає його знову."] };
    case "Fn":
      return sondertasteUk("fn", plattform, layout);
    case "Dead":
      return {
        kurz: null,
        name: "мертва клавіша",
        was: ["ставить знак над наступною літерою, наприклад наголос над е.", "Знак з'являється лише з наступною літерою."],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

const ERSCHEINT_SPAETER_UK = "Знак з'являється лише з наступною літерою.";

/** Die vier bekannten Akzente (der deutschen und französischen Tastatur) - nach derselben Kennung wie die deutsche Tabelle. */
export const AKZENTE_UK: typeof AKZENTE_EN = {
  zirkumflex: { name: "циркумфлекс", was: ["ставить маленький дашок над наступною літерою, наприклад ê.", ERSCHEINT_SPAETER_UK] },
  akut: { name: "акут", was: ["ставить рисочку вгору праворуч над наступною літерою, наприклад é.", ERSCHEINT_SPAETER_UK] },
  gravis: { name: "гравіс", was: ["ставить рисочку вгору ліворуч над наступною літерою, наприклад è.", ERSCHEINT_SPAETER_UK] },
  trema: { name: "трема", was: ["ставить дві крапки над наступною літерою, наприклад ë.", ERSCHEINT_SPAETER_UK] },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

const PROGRAMMIEREN_UK = ["використовується в програмуванні."] as const;

/**
 * Dieselben Zeichen wie `ZEICHEN` in `tastenErklaerung.ts`, dazu die Zeichen der ukrainischen Tastatur (₴ № « » „ “ und der
 * Halbgeviertstrich). Namen nach Glossar §2.8 (`SPOKEN_UK`): „дефіс" für `-`, „скісна риска", „равлик", „решітка".
 */
export const ZEICHEN_UK: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { name: "крапка", was: ["ставиться в кінці речення."] },
  ",": { name: "кома", was: ["розділяє частини речення."] },
  "?": { name: "знак питання", was: ["ставиться в кінці запитання."] },
  "!": { name: "знак оклику", was: ["ставиться в кінці окличного речення."] },
  ":": { name: "двокрапка", was: ["вводить щось, наприклад перелік."] },
  ";": { name: "крапка з комою", was: ["розділяє дві частини речення сильніше, ніж кома."] },
  "-": { name: "дефіс", was: ["з'єднує слова, наприклад у синьо-жовтий."] },
  [HALBGEVIERT]: { name: "тире", was: ["відокремлює частину речення.", "Воно довше за дефіс."] },
  "'": { name: "апостроф", was: ["пишеться в українських словах, наприклад у м'яч."] },
  "@": { name: "равлик", was: ["є в кожній адресі електронної пошти."] },
  "+": { name: "плюс", was: ["означає плюс у прикладах.", "У сполученнях клавіш означає: натисни разом."] },
  "*": { name: "зірочка", was: ["на комп'ютері означає помножити."] },
  "/": { name: "скісна риска", was: ["на комп'ютері означає поділити.", "Вона є і в адресах вебсторінок."] },
  "=": { name: "дорівнює", was: ["ставиться перед відповіддю в прикладі."] },
  '"': { name: "лапки", was: ["стоять перед і після чиїхось слів."] },
  "«": { name: "ліві лапки", was: ["відкривають чиїсь слова в українському тексті."] },
  "»": { name: "праві лапки", was: ["закривають чиїсь слова в українському тексті."] },
  "„": { name: "нижні лапки", was: ["відкривають слова всередині інших лапок."] },
  "“": { name: "верхні лапки", was: ["закривають слова всередині інших лапок."] },
  "(": { name: "ліва дужка", was: ["відкриває те, що ти додаєш."] },
  ")": { name: "права дужка", was: ["закриває те, що ти додаєш."] },
  "%": { name: "відсоток", was: ["означає соту частину, наприклад 50 відсотків."] },
  "&": { name: "амперсанд", was: ["означає і."] },
  "#": { name: "решітка", was: ["використовується і для позначок у соцмережах."] },
  "№": { name: "номер", was: ["ставиться перед числом, наприклад № 5."] },
  "₴": { name: "знак гривні", was: ["це знак гривні."] },
  "€": { name: "євро", was: ["це знак євро."] },
  $: { name: "долар", was: ["це знак долара."] },
  "£": { name: "фунт", was: ["це знак британського фунта."] },
  "§": { name: "параграф", was: ["ставиться перед законами і правилами."] },
  "°": { name: "градус", was: ["показує градуси, наприклад температуру."] },
  "<": { name: "менше", was: ["порівнює два числа: ліве менше."] },
  ">": { name: "більше", was: ["порівнює два числа: ліве більше."] },
  _: { name: "підкреслення", was: ["часто є в адресах електронної пошти та в назвах файлів."] },
  "^": { name: "циркумфлекс", was: ["у математиці означає степінь, наприклад 2 у степені 3."] },
  "²": { name: "у квадраті", was: ["використовується для площі, наприклад квадратні метри."] },
  "³": { name: "у кубі", was: ["використовується для об'єму, наприклад кубічні метри."] },
  "[": { name: "ліва квадратна дужка", was: PROGRAMMIEREN_UK },
  "]": { name: "права квадратна дужка", was: PROGRAMMIEREN_UK },
  "{": { name: "ліва фігурна дужка", was: PROGRAMMIEREN_UK },
  "}": { name: "права фігурна дужка", was: PROGRAMMIEREN_UK },
  "\\": { name: "зворотна скісна риска", was: PROGRAMMIEREN_UK },
  "|": { name: "вертикальна риска", was: PROGRAMMIEREN_UK },
  "~": { name: "тильда", was: PROGRAMMIEREN_UK },
  "´": { name: "акут", was: ["ставить наголос над літерою."] },
  "`": { name: "гравіс", was: ["ставить наголос над літерою."] },
  "¨": { name: "трема", was: ["ставить дві крапки над літерою."] },
  // Auf der Standard-Tastatur links neben der 1 (Glossar §2.8, U9) - Hinweis ohne Wertung.
  "ё": { name: "літера ё", was: ["Цієї літери немає в українській абетці."] },
};

/** Die Schulnamen der Buchstaben, die allein schwer zu unterscheiden sind (Glossar §2.8). */
const BUCHSTABEN_NAMEN_UK: Readonly<Record<string, string>> = {
  "ґ": "ґе",
  "й": "йот",
  "ь": "м'який знак",
};

/**
 * Der ukrainische Name eines Zeichens. Satz- und Sonderzeichen aus {@link ZEICHEN_UK}; ґ, й, ь mit ihrem Schulnamen; ein
 * Grossbuchstabe „велика" + Buchstabe (Glossar §2.8: „велика А"); sonst das Zeichen selbst - nie Englisch.
 */
export function zeichenNameUk(ch: string): string {
  const eintrag = ZEICHEN_UK[ch]?.name;
  if (eintrag) return eintrag;
  const klein = ch.toLocaleLowerCase("uk-UA");
  if (istBuchstabe(ch) && klein !== ch) {
    if (klein === "ь") return "великий м'який знак";
    const name = BUCHSTABEN_NAMEN_UK[klein];
    return name ? `велика ${name}` : `велика ${ch}`;
  }
  return BUCHSTABEN_NAMEN_UK[ch] ?? ch;
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/** Wo eine Wirkung gilt - ukrainisch. */
export const ORT_UK: Readonly<Record<string, string>> = {
  explorer: "у Провіднику",
  finder: "у Finder",
  word: "у Word",
  excel: "в Excel",
  browser: "у браузері",
  teams: "у Teams",
  powerpoint: "у PowerPoint",
  outlook: "в Outlook",
  bedienungshilfen: "у читачі екрана",
};

/** Die kleine eigene Liste der deutschen Datei, ukrainisch. */
export const EIGENE_KOMBINATIONEN_UK: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "повертає до попереднього елемента." },
    { keys: "Strg+P", was: "відкриває вікно друку." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "повертає до попереднього елемента." },
    { keys: "Cmd+P", was: "відкриває вікно друку." },
  ],
};

const WIRKUNG_UK: Readonly<Record<string, string>> = {
  kopieren: "Копіювання",
  einfuegen: "Вставлення",
  ausschneiden: "Вирізання",
  rueckgaengig: "Скасування дії",
  wiederherstellen: "Повторення - повертає скасоване",
  "alles-markieren": "Виділення всього",
  "markieren-zeichen": "Виділення по одному знаку",
  "markieren-wort": "Виділення по одному слову",
  "spalte-markieren": "Виділення всього стовпця",
  "zeile-markieren": "Виділення всього рядка",
  oeffnen: "Відкриття",
  umbenennen: "Перейменування",
  "neuer-ordner": "Створення нової папки",
  papierkorb: "Переміщення до кошика",
  duplizieren: "Друга копія того самого файлу",
  "ebene-hoeher": "На рівень вище",
  adressleiste: "Перехід до адресного рядка",
  eigenschaften: "Показ властивостей",
  uebersicht: "Швидкий перегляд без відкриття",
  bewegen: "Переміщення файлу на нове місце (зі старого він зникає)",
  "ansicht-details": "Подання Докладно",
  speichern: "Збереження",
  "speichern-unter": "Збереження як - з новою назвою або в новому місці",
  fett: "Жирний шрифт",
  kursiv: "Курсив",
  unterstreichen: "Підкреслення",
  ueberschrift1: "Стиль Заголовок 1",
  ueberschrift2: "Стиль Заголовок 2",
  "standard-format": "Стиль Звичайний",
  links: "Вирівнювання ліворуч",
  zentriert: "Вирівнювання по центру",
  zeilenumbruch: "Розрив рядка в тому самому абзаці",
  rechtschreibung: "Перевірка правопису",
  fensterbereiche: "Перемикання між частинами вікна",
  suchen: "Пошук",
  ersetzen: "Пошук і заміна",
  "gehe-zu-zelle": "Перехід до певної клітинки",
  "zelle-bearbeiten": "Продовження друку в клітинці",
  "zelle-formatieren": "Вікно Формат клітинок",
  "zum-rand": "Перехід до краю даних",
  autosumme: "Автосума",
  "ausfuellen-unten": "Заповнення вниз",
  "ausfuellen-rechts": "Заповнення праворуч",
  "absoluter-bezug": "Закріплення посилання (абсолютне посилання зі знаками долара)",
  datum: "Вставлення сьогоднішньої дати",
  uhrzeit: "Вставлення поточного часу",
  kommentar: "Вставлення примітки",
  autofilter: "Увімкнення і вимкнення автофільтра",
  blattwechsel: "Перехід до іншого аркуша",
  "neues-blatt": "Вставлення нового аркуша",
  "neu-laden": "Оновлення сторінки",
  lesezeichen: "Додавання закладки",
  verlauf: "Відкриття журналу",
  senden: "Надсилання повідомлення",
  "nachricht-loeschen": "Видалення повідомлення",
  "sr-stopp": "Зупинка мовлення",
};

/** Was ein Kürzel BEWIRKT - ukrainisch. Fehlt eine Kennung, fällt die Zeile weg (`null`) - nie ein deutsches Wort. */
export function wirkungUk(id: string, plattform: Plattform): string | null {
  void plattform;
  return WIRKUNG_UK[id] ?? null;
}

/** „а, б і в" - die ukrainische Aufzählung (gemessen `Intl.ListFormat("uk")`, kein Komma vor „і"). */
export function aufzaehlungUk(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} і ${teile[teile.length - 1]}`;
}

/** Die festen Wörter des Erkundens, ukrainisch (Form der englischen Vorlage, siehe `tastenErklaerungBg.ts`). */
export const ERKUNDEN_WOERTER_UK = {
  kombination: "сполучення клавіш",
  kombiUnbekannt: "що воно робить, залежить від програми.",
  mit: "З",
  akzentTaste: "мертва клавіша",
  unbekannt: "Цю клавішу не вдалося розпізнати.",
  taste: (key: string) => `Клавіша ${key}`,
} as const;

/* ══ „Tasten finden" ════════════════════════════════════════════════════════ */

interface TasteUk {
  /** Im Akkusativ, als Ergänzung: „Знайди клавішу Tab." */
  objekt: string;
  /** Im Nominativ, als Satzgegenstand: „Це клавіша Esc." */
  subjekt: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur die Feststelltaste). */
  achtung?: string;
}

/** Eine Taste mit dem Kopfwort „клавіша" - der Name selbst wird nie gebeugt (Regel 11). */
function klavisha(name: string, lage: string, achtung?: string): TasteUk {
  return { objekt: `клавішу ${name}`, subjekt: `клавіша ${name}`, lage, ...(achtung ? { achtung } : {}) };
}

/** Eine Pfeiltaste - „стрілка" wird gebeugt. */
function strilka(richtung: string, lage: string): TasteUk {
  return { objekt: `стрілку ${richtung}`, subjekt: `стрілка ${richtung}`, lage };
}

const SECHSERBLOCK = "У блоці з шести клавіш над стрілками";

/** Die Tasten der Suchrunde, ukrainisch - nach derselben Kennung wie das Wörterbuch. */
const TASTEN_UK: Readonly<Record<string, TasteUk | ((plattform: Plattform) => TasteUk)>> = {
  tabulator: klavisha("Tab", "Лівий мізинець: на ряд вище, з самого краю."),
  "pfeil-links": strilka("вліво", "Унизу праворуч біля стрілок - ліва."),
  "pfeil-rechts": strilka("вправо", "Унизу праворуч біля стрілок - права."),
  "pfeil-auf": strilka("вгору", "Унизу праворуч біля стрілок - верхня."),
  "pfeil-ab": strilka("вниз", "Унизу праворуч біля стрілок - під стрілкою вгору."),
  pos1: klavisha("Home", `${SECHSERBLOCK}, вгорі посередині. На ноутбуці часто з Fn.`),
  ende: klavisha("End", `${SECHSERBLOCK}, внизу посередині. На ноутбуці часто з Fn.`),
  "bild-auf": klavisha("Page Up", `${SECHSERBLOCK}, вгорі праворуч. На ноутбуці часто з Fn.`),
  "bild-ab": klavisha("Page Down", `${SECHSERBLOCK}, внизу праворуч. На ноутбуці часто з Fn.`),
  leertaste: { objekt: "пробіл", subjekt: "пробіл", lage: "Довга клавіша під великими пальцями." },
  eingabe: klavisha("Enter", "Права рука з самого краю: велика клавіша."),
  zeilenschalter: klavisha("Return", "Права рука з самого краю: велика клавіша."),
  loeschtaste: klavisha("Backspace", "Права рука з самого краю, на два ряди вище."),
  entf: (plattform) =>
    plattform === "macos"
      ? {
          objekt: "клавішу видалення праворуч",
          subjekt: "клавіша видалення праворуч",
          lage: "Лише на великих клавіатурах, біля Return. Інакше Fn і Delete.",
        }
      : klavisha("Delete", `${SECHSERBLOCK}, внизу ліворуч. На ноутбуці вгорі праворуч.`),
  esc: klavisha("Esc", "Верхній лівий кут."),
  umschalt: klavisha("Shift", "Їх дві: ліворуч і праворуч у нижньому ряду літер."),
  feststell: klavisha("Caps Lock", "Лівий мізинець: на крок ліворуч.", "Друкує великими літерами? Натисни її ще раз."),
  strg: klavisha("Ctrl", "Нижній лівий кут."),
  alt: klavisha("Alt", "Унизу, ліворуч від пробілу."),
  altgr: klavisha("AltGr", "Унизу, праворуч від пробілу."),
  "windows-taste": klavisha("Windows", "Унизу ліворуч, між Ctrl і Alt."),
  einfg: klavisha("Insert", `${SECHSERBLOCK}, вгорі ліворуч, над Delete. На ноутбуці її часто немає.`),
  befehlstaste: klavisha("Command", "Унизу ліворуч, одразу біля пробілу."),
  wahltaste: klavisha("Option", "Унизу ліворуч, третя клавіша від краю."),
  ctrl: klavisha("Control", "Унизу ліворуч, друга клавіша від краю."),
  fn: klavisha("Fn", "Унизу ліворуч, перша клавіша, у самому куті. На MacBook на ній написано fn."),
};

function tasteUk(t: TastenName, plattform: Plattform): TasteUk {
  const e = TASTEN_UK[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne ukrainischen Eintrag - der Kurzname wie auf der Kappe.
  return e ?? klavisha(t.kurz ?? t.name, "");
}

/** „клавішу Tab" - wie eine Taste als Ergänzung im Satz heisst. */
export function tastenNennungUk(t: TastenName, plattform: Plattform): string {
  return tasteUk(t, plattform).objekt;
}

/** Nur die Lage - oder "". */
export function tastenLageUk(t: TastenName, plattform: Plattform): string {
  return tasteUk(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Знайди клавішу Tab. Лівий мізинець: …" */
export function ansageSuchauftragUk(t: TastenName, plattform: Plattform): string {
  const e = tasteUk(t, plattform);
  return e.lage ? `Знайди ${e.objekt}. ${e.lage}` : `Знайди ${e.objekt}.`;
}

/** Erster Treffer - unpersönlich auf -но (kein „знайшов/знайшла", Regel 2). */
export function ansageGefundenUk(t: TastenName, plattform: Plattform): string {
  return `Знайдено! Натисни іншу клавішу, а потім знову ${tastenNennungUk(t, plattform)}.`;
}

/** Nach der Bestätigung - und, wo nötig, die Warnung (Feststelltaste). */
export function ansageBestaetigtUk(t: TastenName, plattform: Plattform): string {
  const e = tasteUk(t, plattform);
  return e.achtung ? `Чудово! ${e.achtung}` : "Чудово!";
}

/** Eine Taste, die hier nicht unterrichtet wird. */
export const ANSAGE_UNBEKANNT_UK = "Цю клавішу ми тут не вчимо.";

/** Der Satz zu einem Schritt der Suchrunde - ukrainisch. Zahlen mit Schrägstrich (Regel 13), höchstens ein Ausrufezeichen. */
export function suchSatzUk(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = tasteUk(gesucht, plattform);
      if (!taste) return `${ANSAGE_UNBEKANNT_UK} Знайди ${g.objekt}.`;
      return `Це ${tasteUk(taste, plattform).subjekt}. Знайди ${g.objekt}.${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenUk(gesucht, plattform);
    case "fertig":
      return `${ansageBestaetigtUk(gesucht, plattform)} Знайдено всі клавіші: ${suchbar.length}/${suchbar.length}.`;
    case "weiter":
      return `${ansageBestaetigtUk(gesucht, plattform)} ${ansageSuchauftragUk(suchbar[index + 1]!, plattform)}`;
  }
}

/* ══ Name einer Lerneinheit ════════════════════════════════════════════════ */

/**
 * Der Name einer Lerneinheit („великі літери", „цифра 5", „кома", „Ї") - Vorbild `unitLabelCs`. Satz- und Sonderzeichen mit ihrem
 * ukrainischen Namen; die Art der Einheit kommt aus dem WEG. Buchstaben gross in der Sprache des Weges.
 */
export function unitLabelUk(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "великі літери";
  switch (unitKindImWeg(unit, lernweg)) {
    case "shift":
      return "великі літери";
    case "ziffer":
      return `цифра ${unit}`;
    case "satzzeichen":
    case "sonderzeichen":
      return zeichenNameUk(unit);
    default:
      if (unit === "ß") return "ß";
      return istBuchstabe(unit) ? grossFuer(unit, lernweg ?? "uk") : zeichenNameUk(unit);
  }
}

/* ══ Das Objekt für den Verteiler ══════════════════════════════════════════ */

/** Alles, was „Tasten erkunden" auf Ukrainisch sagt. */
export const TASTEN_SATZ_UK: TastenErklaerungSatz = {
  sondertaste: sondertasteUk,
  nachKey: nachKeyUk,
  tasteKurz: TASTE_KURZ_UK,
  zeichen: ZEICHEN_UK,
  zeichenName: zeichenNameUk,
  akzente: AKZENTE_UK,
  erkundenWoerter: ERKUNDEN_WOERTER_UK,
  eigeneKombinationen: EIGENE_KOMBINATIONEN_UK,
  wirkung: wirkungUk,
  ort: ORT_UK,
  aufzaehlung: aufzaehlungUk,
  aufdruckGross: (key) => key.toLocaleUpperCase("uk-UA"),
};
