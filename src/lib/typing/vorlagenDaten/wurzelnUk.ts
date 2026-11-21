/**
 * ★ G3c-VERTEILER (25.10.2026): DIE WURZEL-VORLAGE DES WEGES „uk" (Ukrainisch) - woher die Wörter kommen, zum Abschreiben. Einhängepunkt (G3c), gefüllt in D-LERNDATEN.
 *
 * Vorbild `radiciIt.ts` (mit `beleg`) und `korenyCs.ts`: drei Altersstufen, Themen mit Paaren `<Hinweis> - <Wort>`. Die Feldnamen sind
 * die von `radiciIt.ts` (`indizio`, `parola`, `origine`, `beleg`) - genau die Schlüssel der Quelle, iCloud
 * `sprachen-2026-10-25/tf-fest-neu/uk/tf-fest-uk.json`: `wurzeln` (`{ kids, teens, erwachsen }`) und `wurzelKategorien` (die Themen).
 * `raetsel` dort ist KEINE Wurzel-Zeile (Rezept D „Befund raetsel") und gehört nicht hierher.
 *
 * Zeilenregeln (Wächter: `tests/tastenflow-lerndaten-uk.test.ts`, Vorbild `tastenflow-vorlage-koreny-cs`): höchstens 40 Zeichen,
 * genau ein ` - `, `parola` ein Einzelwort, klein, nicht im Hinweis; kein Wort doppelt; keine Sperrwörter (`sperrlisteUk.ts`); nur Zeichen
 * aller Tastaturen des Weges. Mengen: der Wächter misst die eigene Grösse (cs/it verlangen 80 je Stufe, die neuen Daten haben weniger).
 *
 * ★ D-LERNDATEN (25.10.2026): gefüllt aus `tf-fest-uk.json` (`wurzeln`, `wurzelKategorien`), geprüft im `PRUEFBERICHT.md`
 * desselben Ordners. Paare je Stufe: Kinder 63, Jugend 61, Erwachsene 61 (Ziel wie cs/it: 80 - der
 * Wächter führt die gelieferte Menge als benannte Mindestzahl). Die Themen-Namen auf Deutsch und Englisch (`titelJe`) sind in
 * D-LERNDATEN übersetzt (die übrigen Bedienungen lesen das Englische). `raetsel` (240 Zeilen) ist NICHT eingehängt - es hat im
 * Code keinen Platz (Rezept D, Erkenntnis 3; Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * Wächter: `tests/tastenflow-lerndaten-uk.test.ts`.
 *
 * Verteiler: `vorlagen.ts` (`GERUEST_WURZELN`, Art `"wortherkunft"`; Gruppe in `EigenerTextQuelle.tsx`). Solange {@link WURZEL_THEMEN_UK}
 * leer ist, gibt es KEINE Vorlage (weder „Eigene Übung" noch Tippchallenge); mit dem ersten Thema erscheint sie für Weg UND Übungssprache „uk".
 *
 * ⚠️ DATENBLATT: nur `import type`, kein Code-Import.
 */

export type WurzelStufeUk = "kids" | "teens" | "erwachsen";

/** Woher ein Wort kommt - GESCHLOSSENE Liste (gemessen in `tf-fest-uk.json`, 25.10.2026); nur für die Lehrkraft, wird nicht abgetippt. */
export type WurzelOrigineUk = "англійська" | "грецька" | "латинська" | "німецька" | "татарська" | "турецька" | "тюркська" | "французька" | "італійська";

export interface WurzelPaarUk {
  /** Kurze, wahre Umschreibung der Bedeutung - nicht das Wort selbst. */
  indizio: string;
  /** Das Wort selbst - ein Einzelwort, klein. */
  parola: string;
  origine: WurzelOrigineUk;
  /** Wo die Herkunft nachgelesen wurde (Quelle aus `tf-fest`, z. B. eine Wiktionary-Seite). */
  beleg: string;
}

export interface WurzelThemaUk {
  id: string;
  titel: string;
  paare: WurzelPaarUk[];
}

/** Die Themen (aus `wurzelKategorien`): `titel` in Ukrainisch, `titelJe` der Name in den Bedienungssprachen (fehlt einer: englisch, sonst `titel`). */
export const WURZEL_THEMEN_UK: readonly { id: string; titel: string; titelJe?: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> }[] = [
  { id: "greko-latynski", titel: "Грецькі та латинські корені", titelJe: { de: "Griechische und lateinische Wurzeln", en: "Greek and Latin roots" } },
  { id: "tiurkski", titel: "Слова з тюркських мов", titelJe: { de: "Wörter aus Turksprachen", en: "Words from Turkic languages" } },
  { id: "nimetski", titel: "Слова з німецької", titelJe: { de: "Wörter aus dem Deutschen", en: "Words from German" } },
  { id: "romanski", titel: "Слова з французької та італійської", titelJe: { de: "Wörter aus dem Französischen und Italienischen", en: "Words from French and Italian" } },
  { id: "anglijski", titel: "Слова з англійської", titelJe: { de: "Wörter aus dem Englischen", en: "Words from English" } },
];

/** Die Paare je Stufe und Thema. */
export const WURZELN_UK: Record<WurzelStufeUk, WurzelThemaUk[]> = {
  kids: [
    {
      id: "greko-latynski",
      titel: "Грецькі та латинські корені",
      paare: [
        { indizio: "говориш із тим, хто далеко", parola: "телефон", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/телефон" },
        { indizio: "величезний ящір давніх часів", parola: "динозавр", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/динозавр" },
        { indizio: "показує дуже дрібне", parola: "мікроскоп", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/мікроскоп" },
        { indizio: "знімок, зроблений світлом", parola: "фотографія", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/фотографія" },
        { indizio: "тут беремо книжки", parola: "бібліотека", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/бібліотека" },
        { indizio: "наука про гори, річки й країни", parola: "географія", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/географія" },
        { indizio: "кружляє навколо Сонця", parola: "планета", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/планета" },
        { indizio: "урок чисел і задач", parola: "математика", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/математика" },
        { indizio: "її слухають і співають", parola: "музика", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/музика" },
        { indizio: "тут грають вистави", parola: "театр", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/театр" },
        { indizio: "усі літери по порядку", parola: "алфавіт", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/алфавіт" },
        { indizio: "зелений хижак у річці з великою пащею", parola: "крокодил", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/крокодил" },
        { indizio: "скляний дім для рибок", parola: "акваріум", origine: "латинська", beleg: "https://goroh.pp.ua/Етимологія/акваріум" },
        { indizio: "показує дні й місяці року", parola: "календар", origine: "латинська", beleg: "https://goroh.pp.ua/Етимологія/календар" },
        { indizio: "клоуни, акробати й арена", parola: "цирк", origine: "латинська", beleg: "https://goroh.pp.ua/Етимологія/цирк" },
      ],
    },
    {
      id: "tiurkski",
      titel: "Слова з тюркських мов",
      paare: [
        { indizio: "велика ягода, зелена зверху", parola: "кавун", origine: "турецька", beleg: "https://goroh.pp.ua/Етимологія/кавун" },
        { indizio: "великий помаранчевий овоч", parola: "гарбуз", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/гарбуз" },
        { indizio: "поле з кавунами й динями", parola: "баштан", origine: "турецька", beleg: "https://goroh.pp.ua/Етимологія/баштан" },
        { indizio: "великий казанок для куліша", parola: "казан", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/казан" },
        { indizio: "тканий візерунчастий виріб на підлогу", parola: "килим", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/килим" },
        { indizio: "полотняна сумка", parola: "торба", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/торба" },
        { indizio: "тут купують і продають", parola: "базар", origine: "татарська", beleg: "https://goroh.pp.ua/Етимологія/базар" },
        { indizio: "будівля для дров і реманенту", parola: "сарай", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/сарай" },
        { indizio: "біла завіса над рікою вранці", parola: "туман", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/туман" },
        { indizio: "дика свиня", parola: "кабан", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/кабан" },
        { indizio: "пастух овець", parola: "чабан", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/чабан" },
        { indizio: "великий гурт овець", parola: "отара", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/отара" },
      ],
    },
    {
      id: "nimetski",
      titel: "Слова з німецької",
      paare: [
        { indizio: "вкриває будинок згори", parola: "дах", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/дах" },
        { indizio: "нею фарбують паркан", parola: "фарба", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/фарба" },
        { indizio: "висувна скринька в столі", parola: "шухляда", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/шухляда" },
        { indizio: "червоний будівельний брусок", parola: "цегла", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/цегла" },
        { indizio: "мішок на спину", parola: "рюкзак", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/рюкзак" },
        { indizio: "хліб із маслом чи сиром", parola: "бутерброд", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/бутерброд" },
        { indizio: "великий торг зі святом", parola: "ярмарок", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/ярмарок" },
        { indizio: "створювати картинку олівцем", parola: "малювати", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/малювати" },
        { indizio: "оздоба навколо картини", parola: "рама", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/рама" },
        { indizio: "вдягаєш, коли готуєш", parola: "фартух", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/фартух" },
        { indizio: "скло у вікні", parola: "шибка", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/шибка" },
        { indizio: "копчене свиняче м'ясо", parola: "шинка", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/шинка" },
      ],
    },
    {
      id: "romanski",
      titel: "Слова з французької та італійської",
      paare: [
        { indizio: "пісок біля моря для засмаги", parola: "пляж", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/пляж" },
        { indizio: "будиночок для авто", parola: "гараж", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/гараж" },
        { indizio: "перелік страв у кафе", parola: "меню", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/меню" },
        { indizio: "тепле вбрання на осінь", parola: "пальто", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/пальто" },
        { indizio: "рятує від дощу", parola: "парасолька", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/парасолька" },
        { indizio: "солодке після обіду", parola: "десерт", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/десерт" },
        { indizio: "картопля, потовчена з молоком", parola: "пюре", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/пюре" },
        { indizio: "довгі трубочки з тіста", parola: "макарони", origine: "італійська", beleg: "https://goroh.pp.ua/Етимологія/макарони" },
        { indizio: "смажені збиті яйця", parola: "омлет", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/омлет" },
        { indizio: "інструмент із клавішами вдома", parola: "піаніно", origine: "італійська", beleg: "https://goroh.pp.ua/Етимологія/піаніно" },
        { indizio: "святкове вбрання для виступу", parola: "костюм", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/костюм" },
        { indizio: "доріжка для пішоходів", parola: "тротуар", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/тротуар" },
      ],
    },
    {
      id: "anglijski",
      titel: "Слова з англійської",
      paare: [
        { indizio: "гра ногами з м'ячем", parola: "футбол", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/футбол" },
        { indizio: "м'яч кидають у кошик", parola: "баскетбол", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/баскетбол" },
        { indizio: "м'яч перекидають через сітку", parola: "волейбол", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/волейбол" },
        { indizio: "фізкультура, змагання, рух", parola: "спорт", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/спорт" },
        { indizio: "гра з ключками на льоду", parola: "хокей", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/хокей" },
        { indizio: "гра з м'ячиком через сітку на корті", parola: "теніс", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/теніс" },
        { indizio: "солодкий пиріг із родзинками", parola: "кекс", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/кекс" },
        { indizio: "ніжний десерт у формочці", parola: "пудинг", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/пудинг" },
        { indizio: "веселун у цирку", parola: "клоун", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/клоун" },
        { indizio: "одяг для сну", parola: "піжама", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/піжама" },
        { indizio: "кабіна, що возить на поверхи", parola: "ліфт", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/ліфт" },
        { indizio: "вагон на рейках у місті", parola: "трамвай", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/трамвай" },
      ],
    },
  ],
  teens: [
    {
      id: "greko-latynski",
      titel: "Грецькі та латинські корені",
      paare: [
        { indizio: "наука про живе", parola: "біологія", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/біологія" },
        { indizio: "повітряна оболонка Землі", parola: "атмосфера", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/атмосфера" },
        { indizio: "вправи на килимі й снарядах", parola: "гімнастика", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/гімнастика" },
        { indizio: "підпис зірки на пам'ять", parola: "автограф", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/автограф" },
        { indizio: "кімната для дослідів", parola: "лабораторія", origine: "латинська", beleg: "https://goroh.pp.ua/Етимологія/лабораторія" },
        { indizio: "погода за багато років", parola: "клімат", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/клімат" },
        { indizio: "твір для великого оркестру", parola: "симфонія", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/симфонія" },
        { indizio: "прилад, щоб дивитися на зорі", parola: "телескоп", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/телескоп" },
        { indizio: "дуже дрібна жива істота", parola: "мікроб", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/мікроб" },
        { indizio: "вищий навчальний заклад", parola: "університет", origine: "латинська", beleg: "https://goroh.pp.ua/Етимологія/університет" },
        { indizio: "план концерту чи застосунок", parola: "програма", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/програма" },
        { indizio: "правила письма", parola: "орфографія", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/орфографія" },
      ],
    },
    {
      id: "tiurkski",
      titel: "Слова з тюркських мов",
      paare: [
        { indizio: "струнний інструмент кобзарів", parola: "кобза", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/кобза" },
        { indizio: "велика міська площа", parola: "майдан", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/майдан" },
        { indizio: "каптур, що зав'язують на шиї", parola: "башлик", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/башлик" },
        { indizio: "кругле житло кочовиків", parola: "юрта", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/юрта" },
        { indizio: "напій із кобилячого молока", parola: "кумис", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/кумис" },
        { indizio: "ранковий напій із зерен", parola: "кава", origine: "турецька", beleg: "https://goroh.pp.ua/Етимологія/кава" },
        { indizio: "дрібні родзинки без кісточок", parola: "кишмиш", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/кишмиш" },
        { indizio: "великий гірський орел", parola: "беркут", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/беркут" },
        { indizio: "довгий мотуз, щоб ловити коней", parola: "аркан", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/аркан" },
        { indizio: "упертий віслюк", parola: "ішак", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/ішак" },
        { indizio: "рудий кухонний жук", parola: "тарган", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/тарган" },
        { indizio: "великий бик", parola: "бугай", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/бугай" },
      ],
    },
    {
      id: "nimetski",
      titel: "Слова з німецької",
      paare: [
        { indizio: "той, хто добре знає своє ремесло", parola: "майстер", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/майстер" },
        { indizio: "дорога", parola: "шлях", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/шлях" },
        { indizio: "жовта скам'яніла смола", parola: "бурштин", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/бурштин" },
        { indizio: "виготовлення книжок і газет на машині", parola: "друк", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/друк" },
        { indizio: "новий рядок у тексті", parola: "абзац", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/абзац" },
        { indizio: "підставка художника", parola: "мольберт", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/мольберт" },
        { indizio: "краєвид", parola: "ландшафт", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/ландшафт" },
        { indizio: "тонка мотузка", parola: "шнур", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/шнур" },
        { indizio: "металева нитка", parola: "дріт", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/дріт" },
        { indizio: "місто для лікування й відпочинку", parola: "курорт", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/курорт" },
        { indizio: "глибокий підземний хід", parola: "шахта", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/шахта" },
        { indizio: "його забивають молотком", parola: "цвях", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/цвях" },
      ],
    },
    {
      id: "romanski",
      titel: "Слова з французької та італійської",
      paare: [
        { indizio: "валізи в дорозі", parola: "багаж", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/багаж" },
        { indizio: "водій авто", parola: "шофер", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/шофер" },
        { indizio: "видання з фото й статтями", parola: "журнал", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/журнал" },
        { indizio: "танцювальна вистава", parola: "балет", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/балет" },
        { indizio: "показує кіно", parola: "екран", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/екран" },
        { indizio: "вистава, де співають", parola: "опера", origine: "італійська", beleg: "https://goroh.pp.ua/Етимологія/опера" },
        { indizio: "твір для фортепіано", parola: "соната", origine: "італійська", beleg: "https://goroh.pp.ua/Етимологія/соната" },
        { indizio: "фарби, що розводять водою", parola: "акварель", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/акварель" },
        { indizio: "великий смичковий інструмент", parola: "віолончель", origine: "італійська", beleg: "https://goroh.pp.ua/Етимологія/віолончель" },
        { indizio: "свято масок", parola: "карнавал", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/карнавал" },
        { indizio: "білий соус до салатів", parola: "майонез", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/майонез" },
        { indizio: "вигук захвату на концерті", parola: "браво", origine: "італійська", beleg: "https://goroh.pp.ua/Етимологія/браво" },
        { indizio: "переворот у повітрі", parola: "сальто", origine: "італійська", beleg: "https://goroh.pp.ua/Етимологія/сальто" },
      ],
    },
    {
      id: "anglijski",
      titel: "Слова з англійської",
      paare: [
        { indizio: "початок забігу", parola: "старт", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/старт" },
        { indizio: "кінець забігу", parola: "фініш", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/фініш" },
        { indizio: "гра двох команд", parola: "матч", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/матч" },
        { indizio: "половина футбольної гри", parola: "тайм", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/тайм" },
        { indizio: "удар з одинадцяти метрів", parola: "пенальті", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/пенальті" },
        { indizio: "переможець першості", parola: "чемпіон", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/чемпіон" },
        { indizio: "людина, що займається спортом", parola: "спортсмен", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/спортсмен" },
        { indizio: "автобус на дротах", parola: "тролейбус", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/тролейбус" },
        { indizio: "маленький парк серед міста", parola: "сквер", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/сквер" },
        { indizio: "музика з імпровізацією", parola: "джаз", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/джаз" },
        { indizio: "перевірка знань", parola: "тест", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/тест" },
        { indizio: "картинка в презентації", parola: "слайд", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/слайд" },
      ],
    },
  ],
  erwachsen: [
    {
      id: "greko-latynski",
      titel: "Грецькі та латинські корені",
      paare: [
        { indizio: "любов до мудрості", parola: "філософія", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/філософія" },
        { indizio: "наука про душу", parola: "психологія", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/психологія" },
        { indizio: "наука про походження слів", parola: "етимологія", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/етимологія" },
        { indizio: "події за часом", parola: "хронологія", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/хронологія" },
        { indizio: "припущення, яке треба перевірити", parola: "гіпотеза", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/гіпотеза" },
        { indizio: "лікар загальної практики", parola: "терапевт", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/терапевт" },
        { indizio: "лікар серця", parola: "кардіолог", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/кардіолог" },
        { indizio: "слово з тим самим значенням", parola: "синонім", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/синонім" },
        { indizio: "розбір на частини", parola: "аналіз", origine: "грецька", beleg: "https://goroh.pp.ua/Етимологія/аналіз" },
        { indizio: "розум", parola: "інтелект", origine: "латинська", beleg: "https://goroh.pp.ua/Етимологія/інтелект" },
        { indizio: "папір, що щось підтверджує", parola: "документ", origine: "латинська", beleg: "https://goroh.pp.ua/Етимологія/документ" },
        { indizio: "фахівець із права", parola: "юрист", origine: "латинська", beleg: "https://goroh.pp.ua/Етимологія/юрист" },
        { indizio: "велика фахова зустріч", parola: "конференція", origine: "латинська", beleg: "https://goroh.pp.ua/Етимологія/конференція" },
        { indizio: "перший крок із власної волі", parola: "ініціатива", origine: "латинська", beleg: "https://goroh.pp.ua/Етимологія/ініціатива" },
      ],
    },
    {
      id: "tiurkski",
      titel: "Слова з тюркських мов",
      paare: [
        { indizio: "те, що продають", parola: "товар", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/товар" },
        { indizio: "прибуток від торгівлі", parola: "бариш", origine: "татарська", beleg: "https://goroh.pp.ua/Етимологія/бариш" },
        { indizio: "рослина з великим листям, яке сушать", parola: "тютюн", origine: "турецька", beleg: "https://goroh.pp.ua/Етимологія/тютюн" },
        { indizio: "сплав для сковорідок", parola: "чавун", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/чавун" },
        { indizio: "цегла з глини й соломи", parola: "саман", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/саман" },
        { indizio: "вузька тканинна стрічка", parola: "тасьма", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/тасьма" },
        { indizio: "пастка на звіра", parola: "капкан", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/капкан" },
        { indizio: "облямівка тканини", parola: "кайма", origine: "турецька", beleg: "https://goroh.pp.ua/Етимологія/кайма" },
        { indizio: "легка будка з гілля в полі чи на баштані", parola: "курінь", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/курінь" },
        { indizio: "шнурок у шароварах", parola: "очкур", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/очкур" },
        { indizio: "гурт людей, артіль", parola: "ватага", origine: "тюркська", beleg: "https://goroh.pp.ua/Етимологія/ватага" },
      ],
    },
    {
      id: "nimetski",
      titel: "Слова з німецької",
      paare: [
        { indizio: "спеціальність", parola: "фах", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/фах" },
        { indizio: "витрати, гроші", parola: "кошт", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/кошт" },
        { indizio: "веде облік фірми", parola: "бухгалтер", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/бухгалтер" },
        { indizio: "офіціант у кав'ярні", parola: "кельнер", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/кельнер" },
        { indizio: "папір на стіни", parola: "шпалери", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/шпалери" },
        { indizio: "клей з борошна", parola: "клейстер", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/клейстер" },
        { indizio: "земля для городу", parola: "ґрунт", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/ґрунт" },
        { indizio: "лічити гроші", parola: "рахувати", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/рахувати" },
        { indizio: "міська площа, де торгують", parola: "ринок", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/ринок" },
        { indizio: "труба", parola: "рура", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/рура" },
        { indizio: "зовнішній вигляд, форма", parola: "кшталт", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/кшталт" },
        { indizio: "жолоб для дощової води", parola: "ринва", origine: "німецька", beleg: "https://goroh.pp.ua/Етимологія/ринва" },
      ],
    },
    {
      id: "romanski",
      titel: "Слова з французької та італійської",
      paare: [
        { indizio: "контора, установа", parola: "бюро", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/бюро" },
        { indizio: "салат із буряка", parola: "вінегрет", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/вінегрет" },
        { indizio: "набір посуду", parola: "сервіз", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/сервіз" },
        { indizio: "майстерня кравця чи художника", parola: "ательє", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/ательє" },
        { indizio: "відкриття виставки", parola: "вернісаж", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/вернісаж" },
        { indizio: "гурт виконавців", parola: "ансамбль", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/ансамбль" },
        { indizio: "перебіг подій у книжці", parola: "сюжет", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/сюжет" },
        { indizio: "вид мистецького твору", parola: "жанр", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/жанр" },
        { indizio: "оголошення про концерт", parola: "афіша", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/афіша" },
        { indizio: "найвищий твір майстра", parola: "шедевр", origine: "французька", beleg: "https://goroh.pp.ua/Етимологія/шедевр" },
        { indizio: "шанобливо про диригента", parola: "маестро", origine: "італійська", beleg: "https://goroh.pp.ua/Етимологія/маестро" },
        { indizio: "повна назва піаніно й роялю", parola: "фортепіано", origine: "італійська", beleg: "https://goroh.pp.ua/Етимологія/фортепіано" },
      ],
    },
    {
      id: "anglijski",
      titel: "Слова з англійської",
      paare: [
        { indizio: "той, хто веде за собою", parola: "лідер", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/лідер" },
        { indizio: "заміський будинок", parola: "котедж", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/котедж" },
        { indizio: "табір для автотуристів", parola: "кемпінг", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/кемпінг" },
        { indizio: "розмова з журналістом", parola: "інтерв'ю", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/інтерв'ю" },
        { indizio: "щит на виставці", parola: "стенд", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/стенд" },
        { indizio: "американські гроші", parola: "долар", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/долар" },
        { indizio: "запечена яловичина", parola: "ростбіф", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/ростбіф" },
        { indizio: "вихований чоловік", parola: "джентльмен", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/джентльмен" },
        { indizio: "підземний прохід", parola: "тунель", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/тунель" },
        { indizio: "швидкий потяг", parola: "експрес", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/експрес" },
        { indizio: "чорний святковий піджак", parola: "смокінг", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/смокінг" },
        { indizio: "м'яка ворсиста тканина", parola: "вельвет", origine: "англійська", beleg: "https://goroh.pp.ua/Етимологія/вельвет" },
      ],
    },
  ],
};

/** Der Name der Tippchallenge-Dateien je Bedienungssprache, mit `{i}` und `{n}` („Bulgarian word origins, alphabetical: file {i} of {n}"). */
export const WURZEL_CHALLENGE_TITEL_UK: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> = {
  de: "Herkunft ukrainischer Wörter, alphabetisch: Datei {i} von {n}",
  en: "Ukrainian word origins, alphabetical: file {i} of {n}",
};

/** Die Zeile eines Paares: zuerst der Hinweis, dann das Wort. */
export function wurzelZeileUk(x: { indizio: string; parola: string }): string {
  return `${x.indizio} - ${x.parola}`;
}

/** Dieselben Wörter, alphabetisch nach dem Hinweis (Sortierung „uk-UA") - für die Tippchallenge, wie `KORENY_ABECEDNE`. */
export const WURZELN_UK_ALPHABETISCH: Record<WurzelStufeUk, string[]> = Object.fromEntries(
  (Object.keys(WURZELN_UK) as WurzelStufeUk[]).map((stufe) => [
    stufe,
    WURZELN_UK[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.indizio.localeCompare(b.indizio, "uk-UA"))
      .map(wurzelZeileUk),
  ]),
) as Record<WurzelStufeUk, string[]>;
