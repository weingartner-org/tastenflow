/**
 * ★ G3c-VERTEILER (25.10.2026): DIE ABZEICHEN IN BULGARISCH.
 * ★ O-INHALT-BG (29.10.2026): gefüllt - Gegenstück zu `badgesCs.ts`, dieselben Schlüssel, NEU AUF BULGARISCH GESCHRIEBEN, nicht
 * übersetzt (Glossar `recherche-bulgarisch-2026-10-25/GLOSSAR-bg.md` §2.4): übertragen ist die IDEE des Namens. Wo das Bulgarische
 * eine eigene Wendung hat, steht sie da („Книжен червей", „Ранно пиле", „Като от кутийка", „Моят дом е моята крепост", „С пълна пара
 * напред", „Червената нишка"); sonst ein Stabreim oder ein Bild wie im Deutschen („Пъргава лисица", „Бърз бобър", „Бавен ленивец").
 *
 * ★★★ Geschlecht nie raten (Glossar Regel 2): KEINE Personenwörter für das Kind („Шампион", „Победител", „Майстор", „Покорител" wären
 * männlich), Adjektive nur an einem Tier oder Ding („Усърдна мравка", „Диамантени пръсти"), nie am Kind. Die Beschreibungen sind Sätze
 * über die Sache - Hauptwort mit Partizip („5 завършени урока"), Passiv am Ding („Отключени са точката и запетаята") oder Zahl +
 * Hauptwort („100 кръга упражнения") - nie das l-Partizip der 2. Person („Ти написа …" geht, „Ти си написал …" nicht).
 *
 * ★ Zählform (Glossar §2.11): männliche Sachwörter nach einer Zahl auf -а („5 кръга", „1000 верни знака", „5 завършени урока"),
 * „ден" ⇒ „дни"; weibliche und sächliche wie die Mehrzahl („седмици", „звездички", „части", „приключения"). Zahlen ab fünf Stellen
 * mit geschütztem Leerzeichen („10 000"), vierstellig ohne („1000"); Prozent ohne Leerzeichen („95%", Regel 5).
 * ★ Keine Zahl mit Punkt am Satzende: Uhrzeiten in Worten („след девет часа вечерта"), Summen in Klammern („(общо 30)").
 * Grossschreibung nur das erste Wort und Eigennamen („Пещерата на ехото", „Полярната станция", „Полярна експедиция").
 * Begriffe: значка, кръг, знак, точност, грешка, изходна позиция, основен ред, ред с цифрите, част (Etappe einer Geschichte), кръг с
 * точки, ниво на трудност, начална точка, история, Ледени късове, Полярна експедиция.
 * ⚠️ [G]: von einer Person mit Bulgarisch als Erstsprache gegenzulesen (Glossar §5 Nr. 3).
 *
 * Verteiler: `badges.ts` (`ABZEICHEN_JE_SPRACHE`, `GRUPPEN_JE_SPRACHE`). Wächter: `tests/tastenflow-abzeichen-bg.test.ts`.
 */
import { lernwegDef } from "./lernweg";
import { lektionenFuer } from "./curriculum";
import type { AbzeichenTextEn, AbzeichenZahlen } from "./badgesEn";

/** Dieselbe Form wie der englische Eintrag. */
export type AbzeichenTextBg = AbzeichenTextEn;

/** Zahl mit Zählform: `bg(5, "кръг", "кръга")` ⇒ „5 кръга" (one nur für 1, `Intl.PluralRules("bg")`, Glossar §2.11). */
function bg(n: number, one: string, other: string): string {
  return `${n.toLocaleString("bg-BG")} ${new Intl.PluralRules("bg-BG").select(n) === "one" ? one : other}`;
}

/** Die Zeichen von „alltags-ass", die es auf dem Weg des Kindes wirklich gibt (wie `badgesCs.ts`). */
function alltagsZeichen(z: AbzeichenZahlen): string {
  const reihe = new Set(lernwegDef(z.lernweg).introOrder);
  const da = ["@", "€", "$", "§"].filter((c) => reihe.has(c));
  if (da.length <= 1) return da.join("");
  return `${da.slice(0, -1).join(", ")} и ${da[da.length - 1]}`;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name (Glossar §2.4). */
export const ABZEICHEN_GRUPPEN_BG: Readonly<Record<string, string>> = {
  Fehlerfrei: "Без грешки",
  "Saubere Serie": "Чисти кръгове",
  Fleiß: "Усърдие",
  Anschläge: "Знаци",
  Dranbleiben: "Постоянство",
  Übungswochen: "Седмици с упражнения",
  Sterne: "Звездички",
  Lektionen: "Уроци",
  Stufen: "Нива",
  Tastenwelt: "Светът на клавиатурата",
  "Sitzt!": "Мога!",
  Tempo: "Скорост",
  "Am Stück": "На един дъх",
  Meisterprüfung: "Майсторство",
  Abenteuer: "Приключения",
  "Abenteuer-Kunststücke": "Приключенски умения",
  Expedition: "Експедиция",
  Geschichten: "Истории",
  Lesestunde: "Време за четене",
  "Lese-Kunststücke": "Читателски умения",
  Geheim: "Тайни",
};

/** Der ganze Katalog bulgarisch, je Abzeichen-ID. */
export const ABZEICHEN_BG: Readonly<Record<string, AbzeichenTextBg>> = {
  // ── Без грешки ───────────────────────────────────────────────────────────
  volltreffer: { name: "Точно в целта", description: "Цял кръг без нито една грешка.", bildbeschreibung: "мишена със стрела точно в средата" },
  "null-fehler-ninja": { name: "Нинджа без грешки", description: "5 кръга без нито една грешка.", bildbeschreibung: "нинджа" },
  "makellos-meister": { name: "Безупречни звезди", description: "15 кръга без нито една грешка.", bildbeschreibung: "три блестящи звезди" },
  "diamant-finger": { name: "Диамантени пръсти", description: "40 кръга без нито една грешка.", bildbeschreibung: "син скъпоценен камък" },
  "weisse-weste": { name: "Чисто като сняг", description: "80 кръга без нито една грешка.", bildbeschreibung: "бял гълъб" },
  "einhorn-finger": { name: "Пръсти на еднорог", nameNeutral: "150 кръга без грешки", description: "150 кръга без нито една грешка.", bildbeschreibung: "еднорог" },
  // ── Чисти кръгове ────────────────────────────────────────────────────────
  "praezisions-pinguin": { name: "Точен пингвин", nameNeutral: "Три пъти чисто", description: "3 чисти кръга един след друг (точност поне 95%).", bildbeschreibung: "пингвин" },
  adlerauge: { name: "Орлово око", description: "7 чисти кръга един след друг (точност поне 95%).", bildbeschreibung: "орел" },
  "laser-lama": { name: "Лазерна лама", nameNeutral: "Лазерен режим", description: "15 чисти кръга един след друг (точност поне 95%).", bildbeschreibung: "лама" },
  "eiskalte-serie": { name: "Ледено спокойствие", description: "25 чисти кръга един след друг (точност поне 95%).", bildbeschreibung: "кубче лед" },
  // ── Усърдие ──────────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Клавишно пиленце", nameNeutral: "Първи кръг", description: "Първият завършен кръг.", bildbeschreibung: "пиленце, което се излюпва от яйце" },
  "ausdauer-ameise": { name: "Усърдна мравка", nameNeutral: "След загрявката", description: "25 кръга упражнения.", bildbeschreibung: "мравка" },
  "marathon-maus": { name: "Маратонска мишка", nameNeutral: "Сто кръга", description: "100 кръга упражнения.", bildbeschreibung: "глава на мишка" },
  "munteres-murmeltier": { name: "Бърз бобър", nameNeutral: "Маратон", description: "250 кръга упражнения.", bildbeschreibung: "бобър" },
  dauerlaeufer: { name: "Дълга дистанция", description: "500 кръга упражнения.", bildbeschreibung: "човек, който тича" },
  // Wie „Хиляда и една нощ".
  tausendsassa: { name: "Хиляда и един кръг", nameNeutral: "Хиляда кръга", description: "1000 кръга упражнения.", bildbeschreibung: "кит, който пръска вода" },
  // ── Знаци ────────────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Тигър на хиляда клавиша", nameNeutral: "Хиляда верни знака", description: "1000 верни знака.", bildbeschreibung: "глава на тигър" },
  "tasten-t-rex": { name: "Клавишен тиранозавър", nameNeutral: "Десет хиляди верни знака", description: "10 000 верни знака.", bildbeschreibung: "тиранозавър" },
  "galaktische-fingerspitzen": { name: "Галактически пръсти", description: "50 000 верни знака.", bildbeschreibung: "ракета при излитане" },
  "hunderttausend-held": { name: "Сто хиляди светкавици", nameNeutral: "Сто хиляди верни знака", description: "100 000 верни знака.", bildbeschreibung: "жълта светкавица" },
  viertelmillion: { name: "Четвърт милион", description: "250 000 верни знака - толкова букви има цяла книга.", bildbeschreibung: "спътник" },
  // ── Постоянство ──────────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Упорит язовец", nameNeutral: "Постоянство", description: "3 различни дни с упражнения.", bildbeschreibung: "язовец" },
  gewohnheitstier: { name: "Вярна костенурка", description: "7 различни дни с упражнения.", bildbeschreibung: "костенурка" },
  "wie-ein-uhrwerk": { name: "Като часовник", description: "20 различни дни с упражнения.", bildbeschreibung: "червен будилник" },
  unaufhaltsam: { name: "Неудържимо", description: "50 различни дни с упражнения.", bildbeschreibung: "планина със заснежен връх" },
  "tief-verwurzelt": { name: "Дълбоки корени", description: "100 различни дни с упражнения.", bildbeschreibung: "голямо зелено широколистно дърво" },
  // Nicht „Твърд като скала": das Adjektiv hinge am Kind (Regel 2).
  "fels-in-der-brandung": { name: "Като скала", description: "200 различни дни с упражнения - почти всеки ден от учебната година.", bildbeschreibung: "каменна статуя от Великденския остров" },
  // ── Седмици с упражнения ─────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Вече четвърт година", description: "12 различни седмици с упражнения.", bildbeschreibung: "кафяв есенен лист" },
  "halbes-jahr-dabei": { name: "Вече половин година", description: "26 различни седмици с упражнения.", bildbeschreibung: "облак, от който вали сняг" },
  "ganzes-jahr-dabei": { name: "Цяла година", description: "52 различни седмици с упражнения.", bildbeschreibung: "торта за рожден ден със свещичка" },
  // ── Звездички ────────────────────────────────────────────────────────────
  sternschnuppe: { name: "Падаща звезда", description: "Първи кръг с 3 звездички.", bildbeschreibung: "падаща звезда в нощното небе" },
  "sternen-sammler": { name: "Шепа звезди", description: "10 кръга с 3 звездички.", bildbeschreibung: "светеща жълта звезда" },
  sternenhimmel: { name: "Звездно небе", description: "30 кръга с 3 звездички.", bildbeschreibung: "Млечният път в нощното небе" },
  sternenmeer: { name: "Море от звезди", description: "75 кръга с 3 звездички.", bildbeschreibung: "оранжева осемлъчева звезда" },
  // ── Уроци ────────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "Лъв на уроците", nameNeutral: "Пет урока", description: "5 завършени урока.", bildbeschreibung: "лъв" },
  "kapitel-kaeptn": { name: "С пълна пара напред", description: "15 завършени урока.", bildbeschreibung: "котва" },
  // Die Lektionszahl DES WEGES in Klammern - keine Zahl mit Punkt am Satzende.
  "lehrgangs-legende": { name: "Легенда на курса", description: (z) => `Завършени са всички уроци на курса (общо ${lektionenFuer(z.lernweg).length}).`, bildbeschreibung: "златна купа" },
  // ── Нива (кръг с точки) ──────────────────────────────────────────────────
  "kletter-koala": { name: "Катерачка коала", nameNeutral: "Ниво 5", description: "Достигнато е ниво 5 в кръга с точки.", bildbeschreibung: "коала" },
  "punkte-rakete": { name: "Ракета с точки", description: "Достигнато е ниво 10 в кръга с точки.", bildbeschreibung: "червен балон" },
  "gipfel-gaemse": { name: "Дива коза на върха", nameNeutral: "Ниво 20", description: "Достигнато е ниво 20 в кръга с точки.", bildbeschreibung: "дива коза" },
  hoehenflug: { name: "Висок полет", nameNeutral: "Ниво 50", description: "Достигнато е ниво 50 в кръга с точки.", bildbeschreibung: "хеликоптер" },
  "ueber-den-wolken": { name: "Над облаците", nameNeutral: "Ниво 100", description: "Достигнато е ниво 100 в кръга с точки.", bildbeschreibung: "летяща чиния" },
  sternenreise: { name: "Пътуване към звездите", nameNeutral: "Ниво 200", description: "Достигнато е ниво 200 в кръга с точки.", bildbeschreibung: "комета с дълга опашка" },
  // ── Светът на клавиатурата ───────────────────────────────────────────────
  // Die Grundreihe DES WEGES - auf Weg „bg" (BDS) о т а н в м я; ohne feste Zahl (sie ist je Weg verschieden).
  "grundstellungs-gorilla": {
    name: "Горила на основния ред",
    nameNeutral: "Целият основен ред",
    description: (z) =>
      `Отключени са всички клавиши от изходната позиция: ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "горила",
  },
  "gross-baumeister": { name: "Строеж от главни букви", nameNeutral: "Главни букви", description: "Клавишът Shift е усвоен - истински главни букви със собствените пръсти.", bildbeschreibung: "четири главни букви на сини клавиши" },
  // ⚠️ „puenktchen-panda" und „schlangen-s" gibt es auf Weg „bg" nicht zu verdienen - der Eintrag steht trotzdem da, weil das
  // Regal jedes beschreibt.
  "puenktchen-panda": { name: "Панда на точки", nameNeutral: "Немски умлаути", description: "Отключени са буквите ä, ö и ü - немските букви с точки.", bildbeschreibung: "панда" },
  "schlangen-s": { name: "Змийско S", nameNeutral: "Немско остро s", description: "Отключено е ß, немското остро s - последната буква на немската клавиатура.", bildbeschreibung: "змия" },
  "alphabet-as": { name: "Цялата азбука", description: "Отключени са всички букви на азбуката.", bildbeschreibung: "малки букви на сини клавиши" },
  // Nicht „Точка и запетая": so heisst das Zeichen „;".
  "punkt-und-komma": { name: "Запетая и точка", description: "Отключени са точката и запетаята - първите истински препинателни знаци.", bildbeschreibung: "черна писалка" },
  "satzzeichen-sammler": { name: "Колекция от знаци", nameNeutral: "Всички препинателни знаци", description: "Отключени са препинателните знаци: . , - ? ! : ;", bildbeschreibung: "голям червен удивителен знак" },
  "zahlen-zebra": { name: "Зебра с цифри", nameNeutral: "Половината цифри", description: "Отключени са пет цифри от реда с цифрите.", bildbeschreibung: "зебра" },
  "zahlen-zauberer": { name: "Магия с цифри", nameNeutral: "Целият ред с цифрите", description: "Отключени са всички цифри от 1 до 0 - целият ред с цифрите.", bildbeschreibung: "син клавиш с числото десет" },
  "klammer-krokodil": { name: "Крокодил в скоби", nameNeutral: "Лява и дясна скоба", description: "Отключени са скобите ( ) - първите символи.", bildbeschreibung: "крокодил" },
  "alltags-ass": { name: "Знаци за всеки ден", nameNeutral: "Ежедневни знаци", description: (z) => `Отключени: ${alltagsZeichen(z)} - знаци от имейлите и от света на парите.`, bildbeschreibung: "плик" },
  "tastatur-krone": { name: "Корона на клавиатурата", nameNeutral: "Цялата клавиатура", description: "Отключени са ВСИЧКИ клавиши на клавиатурата - до последния символ.", bildbeschreibung: "златна корона" },
  // ── Мога! ────────────────────────────────────────────────────────────────
  "feste-burg": { name: "Моят дом е моята крепост", nameNeutral: "Основният ред е сигурен", description: "Всички клавиши от изходната позиция са сигурни.", bildbeschreibung: "къща" },
  "buchstaben-baendiger": { name: "Укротени букви", nameNeutral: "Всички букви са сигурни", description: "Всяка буква е сигурна - нито една не е несигурна.", bildbeschreibung: "червен квадрат с голямо А" },
  "zahlen-fels": { name: "Цифри като скала", nameNeutral: "Всички цифри са сигурни", description: "Целият ред с цифрите е сигурен.", bildbeschreibung: "сметало с цветни топчета" },
  "nichts-wackelt": { name: "Нищо не се клати", description: "Всеки клавиш на клавиатурата е сигурен - цялата клавиатура, не само отключените клавиши.", bildbeschreibung: "син ромб с точка в средата" },
  // ── Скорост ──────────────────────────────────────────────────────────────
  "flinker-fuchs": { name: "Пъргава лисица", nameNeutral: "Бързо и точно", description: "Нужната скорост И точност поне 95% - скоростта се брои само когато писането е точно.", bildbeschreibung: "лисица" },
  "tempo-60": { name: "Подскачащ заек", nameNeutral: "60 в минута, точно", description: "Кръг със скорост 60 знака в минута и точност поне 95%.", bildbeschreibung: "заек" },
  "tempo-90": { name: "Пъргава сърна", nameNeutral: "90 в минута, точно", description: "Кръг със скорост 90 знака в минута и точност поне 95%.", bildbeschreibung: "сърна" },
  "tempo-120": { name: "Кон в галоп", nameNeutral: "120 в минута, точно", description: "Кръг със скорост 120 знака в минута и точност поне 98%.", bildbeschreibung: "препускащ кон" },
  "tempo-160": { name: "Парен локомотив", nameNeutral: "160 в минута, точно", description: "Кръг със скорост 160 знака в минута и точност поне 98%.", bildbeschreibung: "парен локомотив" },
  "tempo-200": { name: "Бърз влак", nameNeutral: "200 в минута, точно", description: "Кръг със скорост 200 знака в минута и точност поне 98%.", bildbeschreibung: "бърз влак" },
  "tempo-300": { name: "Реактивен самолет", nameNeutral: "300 в минута, точно", description: "Кръг със скорост 300 знака в минута и точност поне 99% - професионално ниво.", bildbeschreibung: "малък самолет" },
  // ── На един дъх ──────────────────────────────────────────────────────────
  "kette-100": { name: "Верижна реакция", nameNeutral: "100 поред", description: "100 верни знака поред, без нито една грешка.", bildbeschreibung: "две брънки от верига" },
  "kette-250": { name: "Без препъване", description: "250 верни знака поред.", bildbeschreibung: "верига от няколко брънки" },
  // „Червената нишка" - wie der rote Faden im Deutschen.
  "kette-500": { name: "Червената нишка", nameNeutral: "500 поред", description: "500 верни знака поред - повече от цял кръг.", bildbeschreibung: "макара с конец" },
  "kette-1000": { name: "Хиляда без грешка", description: "1000 верни знака поред.", bildbeschreibung: "планината Фуджи със заснежен връх" },
  "kette-2000": { name: "Желязна верига", nameNeutral: "2000 поред", description: "2000 верни знака поред - четири-пет кръга без най-малкото колебание.", bildbeschreibung: "вулкан, от който тече лава" },
  // ── Приключения (игра „Ледени късове", Glossar §2.3) ─────────────────────
  "erste-expedition": { name: "Първа експедиция", description: "Първото приключение на ледените късове в свободната игра - чак до иглуто.", bildbeschreibung: "компас" },
  // Nicht „Полярен изследовател" (Personenwort, männlich).
  polarforscher: { name: "Полярни открития", description: "10 завършени приключения на ледените късове в свободната игра.", bildbeschreibung: "снежинка" },
  "eismeer-legende": { name: "Легенда на ледовития океан", description: "30 завършени приключения на ледените късове в свободната игра.", bildbeschreibung: "висока синя вълна" },
  "packeis-profi": { name: "Ледените полета са покорени", nameNeutral: "60 приключения", description: "60 завършени приключения на ледените късове в свободната игра.", bildbeschreibung: "куфар" },
  // ── Приключенски умения ──────────────────────────────────────────────────
  // „Сух фрак": der Frack ist der Pinguin selbst.
  "trockener-frack": { name: "Сух фрак", description: "Цяло приключение без нито едно падане във водата или в снега.", bildbeschreibung: "черен цилиндър" },
  "immer-trocken": { name: "Винаги на сухо", description: (z) => `${bg(z.trockeneAbenteuer, "приключение", "приключения")} без нито едно падане във водата.`, bildbeschreibung: "сгънат чадър" },
  fischfaenger: { name: "Добър улов", description: (z) => `${bg(z.fische, "уловена бонус рибка", "уловени бонус рибки")} на ледените късове.`, bildbeschreibung: "синя риба" },
  // ── Експедиция (Zonennamen wie im Spiel, Glossar §2.3) ───────────────────
  "hoehlen-lauscher": { name: "Слух на прилеп", description: "Цялата Пещера на ехото до изхода - в тъмното, само по слух.", bildbeschreibung: "прилеп" },
  "sturm-trotzer": { name: "Снежната буря е преодоляна", description: "Снежната буря е премината - поредици от знаци, написани наизуст.", bildbeschreibung: "лице, което духа вятър" },
  "funker-freund": { name: "Приятели по радиостанцията", description: "Цяло радиосъобщение е разгадано и изпратено до Полярната станция.", bildbeschreibung: "радио" },
  "polarlicht-entdecker": { name: "Под полярното сияние", description: "Цялата Полярна експедиция без нито една грешка - полярното сияние танцува.", bildbeschreibung: "звезда с опашка от искри" },
  // ── Истории ──────────────────────────────────────────────────────────────
  "lese-luchs": { name: "Читателски рис", nameNeutral: "Първа история", description: "Първата история е прочетена и написана до края.", bildbeschreibung: "леопард" },
  buecherwurm: { name: "Книжен червей", description: "3 истории, прочетени до края.", bildbeschreibung: "зелена гъсеница" },
  "buecherei-baer": { name: "Библиотечна мечка", nameNeutral: "Осем истории", description: "8 истории, прочетени до края.", bildbeschreibung: "мечка" },
  vielleser: { name: "Планина от книги", description: "15 истории, прочетени до края.", bildbeschreibung: "купчина цветни книги" },
  // ── Време за четене (част = Etappe einer Geschichte) ─────────────────────
  "seiten-spatz": { name: "Врабче от първата страница", nameNeutral: "Първа страница", description: "Първата част от история е написана.", bildbeschreibung: "малка синя птица" },
  "kapitel-krake": { name: "Начетен октопод", nameNeutral: "Десет части", description: "10 части, прочетени и написани.", bildbeschreibung: "октопод" },
  "geschichten-gigant": { name: "Слонска порция истории", description: "30 части, прочетени и написани.", bildbeschreibung: "слон" },
  leseratte: { name: "Четене без край", nameNeutral: "75 части", description: "75 части, прочетени и написани.", bildbeschreibung: "свитък пергамент" },
  // ── Читателски умения ────────────────────────────────────────────────────
  federleicht: { name: "Леко като перо", description: "Цяла част, написана без нито една грешка.", bildbeschreibung: "бяло перо" },
  // Nicht „На един дъх" - so heisst schon die Familie „Am Stück".
  "in-einem-rutsch": { name: "Наведнъж", description: "Цяла история, прочетена до края за един ден.", bildbeschreibung: "синя спирала" },
  "lesezeichen-held": { name: "Отметката на мястото си", description: "Четене в друг ден точно оттам, докъдето беше стигнато.", bildbeschreibung: "отметка за книга" },
  // ── Майсторство (Glossar: „Майсторство", nie „изпит") ────────────────────
  "zehn-minuten-abschrift": { name: "Десетминутен препис", description: "Десет минути преписване на текст без почивка и най-много 0,5% грешки - като на истинско състезание.", bildbeschreibung: "хронометър" },
  "lehrgangs-meister": { name: "Курсът е овладян", description: (z) => `Завършени са всички уроци на курса, всеки с три звездички (общо ${lektionenFuer(z.lernweg).length}).`, bildbeschreibung: "черна шапка на абсолвент" },
  "goldene-tastatur": { name: "Златна клавиатура", description: "Всички клавиши са отключени и сигурни - и още веднъж 160 знака в минута с точност 98%. Последната значка.", bildbeschreibung: "спортен медал на лента" },
  // ── Тайни ────────────────────────────────────────────────────────────────
  "gemuetliches-faultier": { name: "Бавен ленивец", description: "Бавно и спокойно, но без нито една грешка - точността е повече от скоростта!", bildbeschreibung: "ленивец" },
  "comeback-kaenguru": { name: "Скок на кенгуру", description: "Кръг с 3 звездички веднага след кръг с 1 звездичка.", bildbeschreibung: "кенгуру" },
  // Uhrzeiten in Worten - keine Zahl mit Punkt am Satzende.
  nachteule: { name: "Нощна сова", description: "Кръг, завършен след девет часа вечерта.", bildbeschreibung: "сова" },
  // „Ранно пиле рано пее."
  "frueher-vogel": { name: "Ранно пиле", description: "Кръг, завършен преди седем часа сутринта.", bildbeschreibung: "петел" },
  nimmersatt: { name: "Глад за четене", description: "3 части от история, прочетени за един ден.", bildbeschreibung: "зелена ябълка" },
  "ferien-held": { name: "Ваканция с клавиатурата", description: "Упражнения през лятната ваканция - през юли или август.", bildbeschreibung: "плаж с чадър" },
  "wochenend-schreiber": { name: "Писане през уикенда", description: "Упражнения и в събота, и в неделя.", bildbeschreibung: "лист от календар" },
  "zurueck-im-sattel": { name: "Отново на седлото", description: (z) => `Връщане към упражненията след почивка, по-дълга от ${bg(z.pauseTage, "ден", "дни")} - и връщането се брои.`, bildbeschreibung: "две стрелки в кръг" },
  "doppelt-genaeht": { name: "Два пъти чисто", description: "Два кръга без грешка един след друг.", bildbeschreibung: "игла с конец" },
  winterkind: { name: "Зимни клавиши", description: "Упражнения посред зима - през декември или януари.", bildbeschreibung: "снежен човек" },
  jahreswechsel: { name: "Нова година", description: "Упражнения в последния ден на годината или в първия ден на новата.", bildbeschreibung: "фойерверки в нощното небе" },
  "tages-marathon": { name: "Маратон за един ден", description: "Десет кръга за един ден.", bildbeschreibung: "човек на състезателен кон" },
  sternentag: { name: "Звезден ден", description: "Три кръга с три звездички за един ден.", bildbeschreibung: "слънце с лице" },
  // „Като от кутийка" = blitzsauber.
  blitzsauber: { name: "Като от кутийка", description: "Три кръга без грешка за един ден.", bildbeschreibung: "сапун с пяна" },
  "volle-woche": { name: "Пълна седмица", description: "Пет различни дни с упражнения в ЕДНА седмица.", bildbeschreibung: "зелена книга" },
  // „Blindflug" ⇒ „Без поглед": zur Маймунка, die sich die Augen zuhält. Glossar Regel 4: nie „сляпо".
  blindflug: { name: "Без поглед", description: "Цял кръг без грешка - със скрита клавиатура на екрана. Точно за това е писането с десет пръста.", bildbeschreibung: "маймунка, която си закрива очите" },
  sprachwechsler: { name: "Път между езиците", description: "Упражнения на два езика - например на български и на английски.", bildbeschreibung: "земно кълбо с Европа и Африка" },
  lesenacht: { name: "Четене нощем", description: "Част от история, прочетена след осем часа вечерта.", bildbeschreibung: "луна с лице" },
  "zaehe-taste": { name: "Упорит клавиш", description: "Клавиш, който дълго се инатеше, сега е сигурен.", bildbeschreibung: "охлюв" },
  aufsteiger: { name: "Нагоре по хълма", description: "С пет нива на трудност над началната точка.", bildbeschreibung: "графика с линия, която расте" },
  // ── Nur auf Weg „fr" (`badgesNurFr.ts`) - für eine bulgarische Bedienung auf diesem Weg.
  "akzente-ziffernreihe": { name: "Акробатика с ударения", nameNeutral: "é, è, ç и à", description: "Отключени са буквите é, è, ç и à - буквите, които живеят на реда с цифрите.", bildbeschreibung: "цифрите 1 2 3 4 на син клавиш" },
  "accent-circonflexe": { name: "Шапчица", nameNeutral: "Френската шапчица", description: "Мъртвият клавиш ^ е сигурен: ê, â, î, ô и û.", bildbeschreibung: "сламена шапка с панделка" },
  trema: { name: "Калинка с две точки", nameNeutral: "Две точки", description: "Мъртвият клавиш ¨ е сигурен: ë, ï и ü.", bildbeschreibung: "калинка" },
};
