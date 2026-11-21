/**
 * ★ G3c-VERTEILER (25.10.2026): DIE TASTEN IN BULGARISCH - „Tasten erkunden", Tastennamen, Suchrunde.
 * ★ O-INHALT-BG (29.10.2026): gefüllt - Vorbild `tastenErklaerungEn.ts` (dieselben Fächer, Eintrag für Eintrag), neu auf Bulgarisch
 * geschrieben nach dem Glossar `recherche-bulgarisch-2026-10-25/GLOSSAR-bg.md`.
 *
 * Was hier steht, liest der Verteiler `tastenErklaerung.ts` über {@link TASTEN_SATZ_BG} (Form: `tastenErklaerungSatz.ts`), die
 * Bauteile `LetterMap.tsx`, `PupilStatsPanel.tsx`, `TastenflowReiter.tsx` über {@link unitLabelBg} und `TastenErkunden.tsx` über
 * {@link suchSatzBg}. Noch NICHT angeschlossen (Etappe O, eigene Zeilen in gemeinsamen Dateien): die Rahmensätze in
 * `findenRunde.ts`, `StandZeile.tsx`, `TastenErkunden.tsx` und die Wörter `ALTGR_WORT`/`SHIFT_WORT`/Tastmarke im Verteiler.
 *
 * ── Die Regeln der Sätze (Glossar §1) ──────────────────────────────────────
 *  · Ein Kind liest „ти" (Regel 1): „Натисни …", „пишеш". Kein Geschlecht: kein l-Partizip („си написал"), kein Adjektiv am Kind;
 *    Verben im Präsens, Befehlsform, Hauptwort-Sätze (Regel 2). Ein Adjektiv steht nur am Ding („клавишът … натиснат").
 *  · Tastennamen LATEINISCH wie auf der Kappe und in Windows-bg (Regel 11, §2.9): Shift, Caps Lock, Enter, Backspace, Tab, Ctrl, Alt,
 *    Esc, Delete, Home, End, Page Up, Page Down, Insert; nur die Leertaste heisst bulgarisch: „интервал", im Satz „клавиш за
 *    интервал". Nie gebeugt; den Artikel trägt das Kopfwort („клавишът Enter", „натисни клавиша Shift").
 *  · Knopfnamen, die Tastennamen sind (Regel 10), kommen nicht vor; „Назад" (= Backspace in Windows-bg) und „Начало" (= Home) nie.
 *  · Ganz kyrillisch (Falle 2) bis auf die Latein-Namen aus §3. Nur Bindestrich. Keine Maus-Wörter. Jeder Satz endet mit Punkt.
 *  · Live-Zeilen und Ansagen ohne Anführungszeichen (Regel 7, Braillezeile) - nur mit Kopfwort („менюто Старт").
 *  · Geübt wird oft auf einer DEUTSCHEN Tastatur; wo dort ein anderes Wort steht („Strg", „Entf", „Pos 1"), sagt ein Satz das - nur
 *    bei eingestellter deutscher Tastatur (`de`), sonst stimmt er nicht (§2.9: „На немската клавиатура на него пише Strg.").
 * ⚠️ [G]: von einer Person mit Bulgarisch als Erstsprache gegenzulesen (Glossar §5).
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

/** „На немската клавиатура на него пише Strg." - nur bei eingestellter deutscher Tastatur. */
function deutscheAufschrift(layout: LayoutId, wort: string): string[] {
  return layout === "de" ? [`На немската клавиатура на него пише ${wort}.`] : [];
}

/** Bulgarische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
export function sondertasteBg(id: string, plattform: Plattform, layout: LayoutId = "de"): TastenErklaerung | null {
  const mac = plattform === "macos";
  const pfeilWort = mac ? "Option" : "Ctrl";
  switch (id) {
    case "tabulator":
      return {
        kurz: null,
        name: "клавиш Tab",
        was: [
          "минава от едно място към следващото, например към връзка, поле или бутон.",
          "Заедно с Shift минава назад.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return mac
        ? { kurz: null, name: "клавиш Return", was: ["потвърждава и изпраща.", "Отваря връзки и започва нов ред в текст."] }
        : {
            kurz: null,
            name: "клавиш Enter",
            was: ["потвърждава и изпраща.", "Отваря връзки, натиска бутони и започва нов ред в текст."],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "клавиш за интервал",
        was: ["прави интервал между две думи.", "Натиска също бутони и слага отметки в квадратчета."],
      };
    case "loeschtaste":
      return {
        kurz: null,
        name: "клавиш Backspace",
        was: ["изтрива знака вляво от курсора.", "Така поправяш грешка при писане."],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "клавиш за изтриване напред",
            was: [
              "изтрива знака вдясно от курсора.",
              "Ако клавиатурата няма такъв клавиш, натисни Fn и Delete.",
            ],
          }
        : {
            kurz: "Del",
            name: "клавиш Delete",
            was: [
              "изтрива знака вдясно от курсора.",
              "Изтрива и избрани файлове.",
              ...deutscheAufschrift(layout, "Entf"),
            ],
          };
    case "esc":
      return {
        kurz: "Esc",
        name: "клавиш Escape",
        was: ["отказва.", "Затваря менюта, прозорци и съобщения.", "В Tastenflow те връща в полето за писане."],
      };
    case "umschalt":
      return {
        kurz: null,
        name: "клавиш Shift",
        was: [
          "пише главни букви, докато е натиснат.",
          "Дава и горния знак на клавиша, например въпросителния знак.",
        ],
      };
    case "feststell":
      return {
        kurz: null,
        name: "клавиш Caps Lock",
        was: ["пише всичко с главни букви, докато не го натиснеш отново."],
      };
    case "pfeil-links":
      return {
        kurz: null,
        name: "стрелка наляво",
        was: ["мести курсора с един знак наляво.", `С ${pfeilWort} прескача цяла дума.`],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "стрелка надясно",
        was: ["мести курсора с един знак надясно.", `С ${pfeilWort} прескача цяла дума.`],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "стрелка нагоре",
        was: [
          "мести курсора един ред нагоре.",
          "В списъци и менюта отива на горния елемент.",
          `С ${pfeilWort} прескача цял абзац нагоре.`,
        ],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "стрелка надолу",
        was: [
          "мести курсора един ред надолу.",
          "В списъци и менюта отива на долния елемент.",
          `С ${pfeilWort} прескача цял абзац надолу.`,
        ],
      };
    case "pos1":
      return {
        kurz: null,
        name: "клавиш Home",
        was: [
          "отива в началото на реда.",
          "На уеб страница отива най-горе.",
          "С Ctrl отива в началото на целия текст.",
          ...deutscheAufschrift(layout, "Pos 1"),
        ],
      };
    case "ende":
      return {
        kurz: null,
        name: "клавиш End",
        was: [
          "отива в края на реда.",
          "На уеб страница отива най-долу.",
          "С Ctrl отива в края на целия текст.",
          ...deutscheAufschrift(layout, "Ende"),
        ],
      };
    case "bild-auf":
      return {
        kurz: "PgUp",
        name: "клавиш Page Up",
        was: ["отива един екран нагоре.", ...deutscheAufschrift(layout, "Bild ↑")],
      };
    case "bild-ab":
      return {
        kurz: "PgDn",
        name: "клавиш Page Down",
        was: ["отива един екран надолу.", ...deutscheAufschrift(layout, "Bild ↓")],
      };
    case "einfg":
      return {
        kurz: "Ins",
        name: "клавиш Insert",
        was: [
          "е клавишът на екранния четец при NVDA и JAWS.",
          "Почти всяка команда на екранния четец започва с него.",
          ...deutscheAufschrift(layout, "Einfg"),
        ],
      };
    case "strg":
      return {
        kurz: "Ctrl",
        name: "клавиш Control",
        was: [
          "е за клавишни комбинации.",
          "Ctrl + C копира, Ctrl + V поставя, Ctrl + Z отменя.",
          "Натиснеш ли само него, гласът веднага млъква.",
          ...deutscheAufschrift(layout, "Strg"),
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "клавиш Alt",
        was: ["е за клавишни комбинации.", "Alt + Tab превключва между прозорците.", "В Tastenflow Alt + H отваря помощта."],
      };
    case "altgr":
      return {
        kurz: null,
        name: "клавиш AltGr",
        was: [
          // На британската клавиатура еврото е на AltGr + 4, на немската и швейцарската - на AltGr + E.
          `пише третия знак на клавиша, например знака за евро с AltGr + ${layout === "uk" ? "4" : "E"}.`,
        ],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "клавиш Windows",
        was: [
          "отваря менюто Старт.",
          "Натисни го пак, за да го затвориш.",
          "Заедно с други клавиши прави още неща, например Win + D показва работния плот.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "cmd",
        name: "клавиш Command",
        was: ["е за клавишни комбинации.", "cmd + C копира, cmd + V поставя, cmd + Z отменя."],
      };
    case "wahltaste":
      return {
        kurz: null,
        name: "клавиш Option",
        was: ["пише символи, например кльомба.", "Със стрелките прескача цяла дума."],
      };
    case "ctrl":
      return {
        kurz: "ctrl",
        name: "клавиш Control",
        was: ["е част от клавишните комбинации на Mac.", "Натиснеш ли само него, VoiceOver млъква."],
      };
    case "fn":
      return {
        kurz: "fn",
        name: "клавиш Fn",
        was: ["дава на други клавиши втора задача, например да усилват и намаляват звука."],
      };
    default:
      return null;
  }
}

/** Wie die Taste in einer KOMBINATION und gross in der Mitte heisst - kurz, wie man sie schreibt („Ctrl + Home"). */
export const TASTE_KURZ_BG: Readonly<Record<string, string>> = {
  tabulator: "Tab",
  eingabe: "Enter",
  zeilenschalter: "Return",
  leertaste: "интервал",
  loeschtaste: "Backspace",
  entf: "Delete",
  esc: "Esc",
  umschalt: "Shift",
  feststell: "Caps Lock",
  "pfeil-links": "стрелка наляво",
  "pfeil-rechts": "стрелка надясно",
  "pfeil-auf": "стрелка нагоре",
  "pfeil-ab": "стрелка надолу",
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

const F_TASTEN_WINDOWS_BG: Readonly<Record<string, readonly string[]>> = {
  F1: ["отваря помощта в много програми."],
  F2: ["преименува избран файл."],
  F3: ["започва търсене."],
  F4: ["заедно с Alt затваря прозореца."],
  F5: ["презарежда уеб страницата.", "Тук не става нищо - можеш да продължиш да разглеждаш."],
  F6: ["отива в адресната лента на браузъра."],
  F7: ["проверява правописа в Word."],
  F10: ["отива в лентата с менюта в много програми."],
  F11: ["включва и изключва цял екран в браузъра.", "На лаптоп често заедно с клавиша Fn."],
  F12: ["отваря прозореца Записване като в Word."],
};

/** Bulgarisch zu `nachKey` - F-Tasten, Num, Menü-Taste, Lautstärke, Totaste. */
export function nachKeyBg(key: string, plattform: Plattform, layout: LayoutId = "de"): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? ["има своя задача в някои програми.", "На Mac тези клавиши често управляват яркостта и звука."]
        : (F_TASTEN_WINDOWS_BG[key] ?? ["има своя задача в някои програми."]);
    return { kurz: key, name: "функционален клавиш", was };
  }
  switch (key) {
    case "Home":
      return sondertasteBg("pos1", "windows", layout);
    case "End":
      return sondertasteBg("ende", "windows", layout);
    case "PageUp":
      return sondertasteBg("bild-auf", "windows", layout);
    case "PageDown":
      return sondertasteBg("bild-ab", "windows", layout);
    case "Insert":
      return sondertasteBg("einfg", "windows", layout);
    case "NumLock":
      return { kurz: null, name: "клавиш Num Lock", was: ["включва и изключва цифрите на цифровия блок."] };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`).
    case "Clear":
      return {
        kurz: "5",
        name: "клавиш 5 на цифровия блок",
        was: ["пише 5, когато Num Lock е включен.", "Сега Num Lock е изключен, затова клавишът не прави нищо."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "клавиш за контекстно меню",
        was: ["отваря меню с команди за мястото, където си.", "Shift + F10 прави същото."],
      };
    case "PrintScreen":
      return {
        kurz: null,
        name: "клавиш Print Screen",
        was: ["прави снимка на екрана.", "В Windows често отваря програма за снимки на екрана.", "Esc я затваря отново."],
      };
    case "ScrollLock":
      return { kurz: null, name: "клавиш Scroll Lock", was: ["днес почти не се използва."] };
    case "Pause":
      return { kurz: null, name: "клавиш Pause", was: ["днес почти не се използва."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "клавиш за по-силен звук", was: ["усилва звука."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "клавиш за по-тих звук", was: ["намалява звука."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "клавиш за изключване на звука", was: ["изключва звука и после пак го включва."] };
    case "Fn":
      return sondertasteBg("fn", plattform, layout);
    case "Dead":
      return {
        kurz: null,
        name: "мъртъв клавиш",
        was: [
          "слага знак над следващата буква, например ударение над е.",
          "Знакът се появява едва със следващата буква.",
        ],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

const ERSCHEINT_SPAETER_BG = "Знакът се появява едва със следващата буква.";

/** Die vier bekannten Akzente - nach derselben Kennung wie die deutsche Tabelle. */
export const AKZENTE_BG: typeof AKZENTE_EN = {
  zirkumflex: { name: "циркумфлекс", was: ["слага малка шапчица над следващата буква, например ê.", ERSCHEINT_SPAETER_BG] },
  akut: { name: "остро ударение", was: ["слага чертичка нагоре надясно над следващата буква, например é.", ERSCHEINT_SPAETER_BG] },
  gravis: { name: "тежко ударение", was: ["слага чертичка нагоре наляво над следващата буква, например è.", ERSCHEINT_SPAETER_BG] },
  trema: { name: "трема", was: ["слага две точки над следващата буква, например ë.", ERSCHEINT_SPAETER_BG] },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

const PROGRAMMIEREN_BG = ["използва се в програмирането."] as const;

/**
 * Dieselben Zeichen wie `ZEICHEN` in `tastenErklaerung.ts`, dazu die Zeichen der bulgarischen Tastatur („ “ № und der Halbgeviertstrich).
 * Namen nach Glossar §2.8 (`SPOKEN_BG`): „малко тире" für `-`, „тире" für den Halbgeviertstrich, „кльомба", „колибка", „вълничка".
 * Jeder Eintrag trägt seinen Namen selbst - die Sprachausgabe der Sprache (`zeichenNamenBg.ts`) ist noch leer.
 */
export const ZEICHEN_BG: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { name: "точка", was: ["стои в края на изречението."] },
  ",": { name: "запетая", was: ["разделя части на изречението."] },
  "?": { name: "въпросителен знак", was: ["стои в края на въпроса."] },
  "!": { name: "удивителен знак", was: ["стои в края на възклицанието."] },
  ":": { name: "двоеточие", was: ["въвежда нещо, например изброяване."] },
  ";": { name: "точка и запетая", was: ["разделя две части на изречението по-силно от запетаята."] },
  "-": { name: "малко тире", was: ["свързва думи, например в синьо-зелен."] },
  [HALBGEVIERT]: { name: "тире", was: ["отделя част от изречението.", "По-дълго е от малкото тире."] },
  "@": { name: "кльомба", was: ["има я във всеки имейл адрес."] },
  "+": { name: "плюс", was: ["означава плюс при смятане.", "В клавишните комбинации означава: натисни едновременно."] },
  "*": { name: "звездичка", was: ["означава умножено по на компютъра."] },
  "/": { name: "наклонена черта", was: ["означава делено на на компютъра.", "Има я и в адресите на уеб страниците."] },
  "=": { name: "равно", was: ["стои пред отговора на задачата."] },
  "'": { name: "апостроф", was: ["показва, че е изпусната буква."] },
  '"': { name: "кавички", was: ["стоят преди и след това, което някой казва."] },
  "„": { name: "долни кавички", was: ["отварят пряката реч в български текст."] },
  "“": { name: "горни кавички", was: ["затварят пряката реч в български текст."] },
  "(": { name: "лява скоба", was: ["започва нещо, което добавяш."] },
  ")": { name: "дясна скоба", was: ["затваря това, което добавяш."] },
  "%": { name: "процент", was: ["означава от сто, например 50 процента."] },
  "&": { name: "амперсанд", was: ["означава и."] },
  "#": { name: "диез", was: ["използва се и за хаштагове."] },
  "№": { name: "номер", was: ["стои пред число, например № 5."] },
  "€": { name: "евро", was: ["е знакът за евро."] },
  $: { name: "долар", was: ["е знакът за долар."] },
  "£": { name: "паунд", was: ["е знакът за британски паунд."] },
  "§": { name: "параграф", was: ["стои пред закони и правила."] },
  "°": { name: "градус", was: ["показва градуси, например за температурата."] },
  "<": { name: "по-малко", was: ["сравнява две числа: лявото е по-малко."] },
  ">": { name: "по-голямо", was: ["сравнява две числа: лявото е по-голямо."] },
  _: { name: "долна черта", was: ["често я има в имейл адреси и в имена на файлове."] },
  "^": { name: "колибка", was: ["означава на степен в математиката, например 2 на степен 3."] },
  "²": { name: "на квадрат", was: ["използва се за площи, например квадратни метри."] },
  "³": { name: "на куб", was: ["използва се за обеми, например кубични метри."] },
  "[": { name: "лява квадратна скоба", was: PROGRAMMIEREN_BG },
  "]": { name: "дясна квадратна скоба", was: PROGRAMMIEREN_BG },
  "{": { name: "лява фигурна скоба", was: PROGRAMMIEREN_BG },
  "}": { name: "дясна фигурна скоба", was: PROGRAMMIEREN_BG },
  "\\": { name: "обратна наклонена черта", was: PROGRAMMIEREN_BG },
  "|": { name: "вертикална черта", was: PROGRAMMIEREN_BG },
  "~": { name: "вълничка", was: PROGRAMMIEREN_BG },
  "´": { name: "остро ударение", was: ["слага ударение над буква."] },
  "`": { name: "обратен апостроф", was: ["слага ударение над буква."] },
  "¨": { name: "трема", was: ["слага две точки над буква."] },
};

/** Die Schulnamen der Buchstaben, die allein nicht deutlich zu hören sind (Glossar §2.8, Bauplan §2.1 Nr. 6). */
const BUCHSTABEN_NAMEN_BG: Readonly<Record<string, string>> = {
  "ъ": "ер голям",
  "ь": "ер малък",
  "й": "и кратко",
  "ѝ": "и с ударение",
};

/**
 * Der bulgarische Name eines Zeichens. Satz- und Sonderzeichen aus {@link ZEICHEN_BG}, ъ ь й ѝ mit ihrem Schulnamen, ein
 * Grossbuchstabe „главно" + Buchstabe (Glossar §2.8, NVDA „главно А"), alles andere bleibt das Zeichen selbst - nie Englisch.
 */
export function zeichenNameBg(ch: string): string {
  const eintrag = ZEICHEN_BG[ch]?.name;
  if (eintrag) return eintrag;
  const klein = ch.toLocaleLowerCase("bg-BG");
  if (istBuchstabe(ch) && klein !== ch) {
    const name = BUCHSTABEN_NAMEN_BG[klein];
    return name ? `главно ${name}` : `главно ${ch}`;
  }
  return BUCHSTABEN_NAMEN_BG[ch] ?? ch;
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/** Wo eine Wirkung gilt - bulgarisch („във" vor в/ф, Glossar Regel 14). */
export const ORT_BG: Readonly<Record<string, string>> = {
  explorer: "във Файлов мениджър",
  finder: "във Finder",
  word: "в Word",
  excel: "в Excel",
  browser: "в браузъра",
  teams: "в Teams",
  powerpoint: "в PowerPoint",
  outlook: "в Outlook",
  bedienungshilfen: "в екранния четец",
};

/** Die kleine eigene Liste der deutschen Datei, bulgarisch. */
export const EIGENE_KOMBINATIONEN_BG: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "връща към предишния елемент." },
    { keys: "Strg+P", was: "отваря прозореца за печат." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "връща към предишния елемент." },
    { keys: "Cmd+P", was: "отваря прозореца за печат." },
  ],
};

const WIRKUNG_BG: Readonly<Record<string, string>> = {
  kopieren: "Копиране",
  einfuegen: "Поставяне",
  ausschneiden: "Изрязване",
  rueckgaengig: "Отмяна",
  wiederherstellen: "Повтаряне - връща отмененото",
  "alles-markieren": "Избиране на всичко",
  "markieren-zeichen": "Избиране знак по знак",
  "markieren-wort": "Избиране дума по дума",
  "spalte-markieren": "Избиране на цялата колона",
  "zeile-markieren": "Избиране на целия ред",
  oeffnen: "Отваряне",
  umbenennen: "Преименуване",
  "neuer-ordner": "Създаване на нова папка",
  papierkorb: "Преместване в кошчето",
  duplizieren: "Второ копие на същия файл",
  "ebene-hoeher": "Едно ниво нагоре",
  adressleiste: "Към адресната лента",
  eigenschaften: "Показване на свойствата",
  uebersicht: "Бърз преглед, без файлът да се отваря",
  bewegen: "Преместване на файла на новото място (изчезва от старото)",
  "ansicht-details": "Изглед Подробни данни",
  speichern: "Записване",
  "speichern-unter": "Записване като - с ново име или на ново място",
  fett: "Получер шрифт",
  kursiv: "Курсив",
  unterstreichen: "Подчертаване",
  ueberschrift1: "Стил Заглавие 1",
  ueberschrift2: "Стил Заглавие 2",
  "standard-format": "Стил Нормален",
  links: "Подравняване вляво",
  zentriert: "Центриране",
  zeilenumbruch: "Нов ред в същия абзац",
  rechtschreibung: "Проверка на правописа",
  fensterbereiche: "Превключване между частите на прозореца",
  suchen: "Търсене",
  ersetzen: "Търсене и замяна",
  "gehe-zu-zelle": "Отиване на определена клетка",
  "zelle-bearbeiten": "Писане по-нататък в клетката",
  "zelle-formatieren": "Прозорецът Форматиране на клетки",
  "zum-rand": "Скок до края на данните",
  autosumme: "Автосума",
  "ausfuellen-unten": "Попълване надолу",
  "ausfuellen-rechts": "Попълване надясно",
  "absoluter-bezug": "Фиксиране на препратка (абсолютна препратка със знаци за долар)",
  datum: "Вмъкване на днешната дата",
  uhrzeit: "Вмъкване на часа",
  kommentar: "Вмъкване на коментар",
  autofilter: "Включване и изключване на автофилтъра",
  blattwechsel: "Превключване към друг работен лист",
  "neues-blatt": "Вмъкване на нов работен лист",
  "neu-laden": "Презареждане на страницата",
  lesezeichen: "Добавяне на отметка",
  verlauf: "Отваряне на историята",
  senden: "Изпращане на съобщението",
  "nachricht-loeschen": "Изтриване на съобщението",
  "sr-stopp": "Спиране на гласа",
};

/**
 * Was ein Kürzel BEWIRKT - bulgarisch, nach der Kennung der Wirkung im Kürzel-Katalog von »Im Griff«
 * (`lib/computer/kuerzelWirkung.ts`). Fehlt eine Kennung, fällt die Zeile weg (`null`) - nie ein deutsches Wort.
 */
export function wirkungBg(id: string, plattform: Plattform): string | null {
  void plattform;
  return WIRKUNG_BG[id] ?? null;
}

/** „а, б и в" - die bulgarische Aufzählung (gemessen `Intl.ListFormat("bg")`, kein Komma vor „и"). */
export function aufzaehlungBg(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} и ${teile[teile.length - 1]}`;
}

/**
 * Die festen Wörter des Erkundens, bulgarisch. Die englische Vorlage ist `as const` (Literal-Typen) - die Form ist dieselbe,
 * darum die Umwandlung auf ihren Typ.
 */
export const ERKUNDEN_WOERTER_BG = {
  kombination: "клавишна комбинация",
  kombiUnbekannt: "какво прави, зависи от програмата.",
  mit: "С",
  akzentTaste: "мъртъв клавиш",
  unbekannt: "Не познавам този клавиш.",
  taste: (key: string) => `Клавиш ${key}`,
} as const;

/* ══ „Tasten finden" ════════════════════════════════════════════════════════ */

interface TasteBg {
  /** Als Ergänzung im Satz, mit dem kurzen Artikel: „Намери клавиша Tab." */
  objekt: string;
  /** Als Satzgegenstand, mit dem vollen Artikel: „Това е клавишът Esc." */
  subjekt: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur die Feststelltaste). */
  achtung?: string;
}

/** Eine Taste mit dem Kopfwort „клавиш" - der Name selbst wird nie gebeugt (Regel 11). */
function klavisch(name: string, lage: string, achtung?: string): TasteBg {
  return { objekt: `клавиша ${name}`, subjekt: `клавишът ${name}`, lage, ...(achtung ? { achtung } : {}) };
}

/** Eine Pfeiltaste - „стрелката" ist weiblich, ein Artikel für beide Rollen. */
function pfeil(richtung: string, lage: string): TasteBg {
  return { objekt: `стрелката ${richtung}`, subjekt: `стрелката ${richtung}`, lage };
}

const SECHSERBLOCK = "В блока от шест клавиша над стрелките";

/** Die Tasten der Suchrunde, bulgarisch - nach derselben Kennung wie das Wörterbuch. */
const TASTEN_BG: Readonly<Record<string, TasteBg | ((plattform: Plattform) => TasteBg)>> = {
  tabulator: klavisch("Tab", "Лявото кутре: един ред нагоре, най-вляво."),
  "pfeil-links": pfeil("наляво", "Долу вдясно при стрелките - лявата."),
  "pfeil-rechts": pfeil("надясно", "Долу вдясно при стрелките - дясната."),
  "pfeil-auf": pfeil("нагоре", "Долу вдясно при стрелките - горната."),
  "pfeil-ab": pfeil("надолу", "Долу вдясно при стрелките - под стрелката нагоре."),
  pos1: klavisch("Home", `${SECHSERBLOCK}, горе в средата. На лаптоп често с Fn.`),
  ende: klavisch("End", `${SECHSERBLOCK}, долу в средата. На лаптоп често с Fn.`),
  "bild-auf": klavisch("Page Up", `${SECHSERBLOCK}, горе вдясно. На лаптоп често с Fn.`),
  "bild-ab": klavisch("Page Down", `${SECHSERBLOCK}, долу вдясно. На лаптоп често с Fn.`),
  leertaste: { objekt: "клавиша за интервал", subjekt: "клавишът за интервал", lage: "Дългият клавиш под палците." },
  eingabe: klavisch("Enter", "Дясната ръка най-вдясно: големият клавиш."),
  zeilenschalter: klavisch("Return", "Дясната ръка най-вдясно: големият клавиш."),
  loeschtaste: klavisch("Backspace", "Дясната ръка най-вдясно, два реда нагоре."),
  entf: (plattform) =>
    plattform === "macos"
      ? {
          objekt: "клавиша за изтриване напред",
          subjekt: "клавишът за изтриване напред",
          lage: "Има го само на големите клавиатури, до Return. Иначе Fn и Delete.",
        }
      : klavisch("Delete", `${SECHSERBLOCK}, долу вляво. На лаптоп горе вдясно.`),
  esc: klavisch("Esc", "Горният ляв ъгъл."),
  umschalt: klavisch("Shift", "Има го два пъти: вляво и вдясно в долния ред с букви."),
  feststell: klavisch("Caps Lock", "Лявото кутре: една стъпка наляво.", "Пише ли сега с главни букви? Натисни го пак."),
  strg: klavisch("Ctrl", "Долният ляв ъгъл."),
  alt: klavisch("Alt", "Долу, вляво от интервала."),
  altgr: klavisch("AltGr", "Долу, вдясно от интервала."),
  "windows-taste": klavisch("Windows", "Долу вляво, между Ctrl и Alt."),
  einfg: klavisch("Insert", `${SECHSERBLOCK}, горе вляво, над Delete. На лаптоп често липсва.`),
  befehlstaste: klavisch("Command", "Долу вляво, точно до интервала."),
  wahltaste: klavisch("Option", "Долу вляво, третият клавиш от края."),
  ctrl: klavisch("Control", "Долу вляво, вторият клавиш от края."),
  fn: klavisch("Fn", "Долу вляво, първият клавиш, точно в ъгъла. На MacBook на него пише fn."),
};

function tasteBg(t: TastenName, plattform: Plattform): TasteBg {
  const e = TASTEN_BG[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne bulgarischen Eintrag - der Kurzname wie auf der Kappe.
  return e ?? klavisch(t.kurz ?? t.name, "");
}

/** „клавиша Tab" - wie eine Taste als Ergänzung im Satz heisst. */
export function tastenNennungBg(t: TastenName, plattform: Plattform): string {
  return tasteBg(t, plattform).objekt;
}

/** Nur die Lage - oder "". */
export function tastenLageBg(t: TastenName, plattform: Plattform): string {
  return tasteBg(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Намери клавиша Tab. Лявото кутре: …" */
export function ansageSuchauftragBg(t: TastenName, plattform: Plattform): string {
  const e = tasteBg(t, plattform);
  return e.lage ? `Намери ${e.objekt}. ${e.lage}` : `Намери ${e.objekt}.`;
}

/** Erster Treffer - erst die Wiederholung zählt. */
export function ansageGefundenBg(t: TastenName, plattform: Plattform): string {
  return `Точно така! Натисни друг клавиш, после пак ${tastenNennungBg(t, plattform)}.`;
}

/** Nach der Bestätigung - und, wo nötig, die Warnung (Feststelltaste). Ohne Tastennamen (kurz, wie im Deutschen). */
export function ansageBestaetigtBg(t: TastenName, plattform: Plattform): string {
  const e = tasteBg(t, plattform);
  return e.achtung ? `Браво! ${e.achtung}` : "Браво!";
}

/** Eine Taste, die hier nicht unterrichtet wird. */
export const ANSAGE_UNBEKANNT_BG = "Този клавиш не го учим тук.";

/** Der Satz zu einem Schritt der Suchrunde - bulgarisch. `art` und `naechste` kommen unverändert aus `suchSchritt`. */
export function suchSatzBg(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = tasteBg(gesucht, plattform);
      if (!taste) return `${ANSAGE_UNBEKANNT_BG} Намери ${g.objekt}.`;
      return `Това е ${tasteBg(taste, plattform).subjekt}. Намери ${g.objekt}.${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenBg(gesucht, plattform);
    case "fertig":
      // Hauptwort-Satz mit Doppelpunkt - kein Geschlecht, keine Zählform am Verb (Regel 2, 13).
      return `${ansageBestaetigtBg(gesucht, plattform)} Намерени клавиши: ${suchbar.length} от ${suchbar.length}. Страхотно!`;
    case "weiter":
      return `${ansageBestaetigtBg(gesucht, plattform)} ${ansageSuchauftragBg(suchbar[index + 1]!, plattform)}`;
  }
}

/* ══ Name einer Lerneinheit ════════════════════════════════════════════════ */

/**
 * Der Name einer Lerneinheit („главни букви", „цифра 5", „запетая", „Ж") - Vorbild `unitLabelCs`. Satz- und Sonderzeichen mit ihrem
 * bulgarischen Namen aus {@link ZEICHEN_BG}; die Art der Einheit kommt aus dem WEG (`„` ist auf Weg „bg" ein Satzzeichen, kein
 * Buchstabe). Buchstaben gross in der Sprache des Weges.
 */
export function unitLabelBg(unit: string, lernweg?: Lernweg): string {
  if (unit === SHIFT_UNIT) return "главни букви";
  switch (unitKindImWeg(unit, lernweg)) {
    case "shift":
      return "главни букви";
    case "ziffer":
      return `цифра ${unit}`;
    case "satzzeichen":
    case "sonderzeichen":
      return ZEICHEN_BG[unit]?.name ?? zeichenNameBg(unit);
    default:
      // „ß".toUpperCase() wäre „SS" (dieselbe Falle wie in `unitLabel`).
      if (unit === "ß") return "ß";
      return istBuchstabe(unit) ? grossFuer(unit, lernweg ?? "bg") : zeichenNameBg(unit);
  }
}

/* ══ Das Objekt für den Verteiler ══════════════════════════════════════════ */

/** Alles, was „Tasten erkunden" auf Bulgarisch sagt. */
export const TASTEN_SATZ_BG: TastenErklaerungSatz = {
  sondertaste: sondertasteBg,
  nachKey: nachKeyBg,
  tasteKurz: TASTE_KURZ_BG,
  zeichen: ZEICHEN_BG,
  zeichenName: zeichenNameBg,
  akzente: AKZENTE_BG,
  erkundenWoerter: ERKUNDEN_WOERTER_BG,
  eigeneKombinationen: EIGENE_KOMBINATIONEN_BG,
  wirkung: wirkungBg,
  ort: ORT_BG,
  aufzaehlung: aufzaehlungBg,
  aufdruckGross: (key) => key.toLocaleUpperCase("bg-BG"),
};
