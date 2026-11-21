/**
 * ★ G3c-VERTEILER (25.10.2026): DIE WURZEL-VORLAGE DES WEGES „bg" (Bulgarisch) - woher die Wörter kommen, zum Abschreiben. Einhängepunkt (G3c), gefüllt in D-LERNDATEN.
 *
 * Vorbild `radiciIt.ts` (mit `beleg`) und `korenyCs.ts`: drei Altersstufen, Themen mit Paaren `<Hinweis> - <Wort>`. Die Feldnamen sind
 * die von `radiciIt.ts` (`indizio`, `parola`, `origine`, `beleg`) - genau die Schlüssel der Quelle, iCloud
 * `sprachen-2026-10-25/tf-fest-neu/bg/tf-fest-bg.json`: `wurzeln` (`{ kids, teens, erwachsen }`) und `wurzelKategorien` (die Themen).
 * `raetsel` dort ist KEINE Wurzel-Zeile (Rezept D „Befund raetsel") und gehört nicht hierher.
 *
 * Zeilenregeln (Wächter: `tests/tastenflow-lerndaten-bg.test.ts`, Vorbild `tastenflow-vorlage-koreny-cs`): höchstens 40 Zeichen,
 * genau ein ` - `, `parola` ein Einzelwort, klein, nicht im Hinweis; kein Wort doppelt; keine Sperrwörter (`sperrlisteBg.ts`); nur Zeichen
 * aller Tastaturen des Weges. Mengen: der Wächter misst die eigene Grösse (cs/it verlangen 80 je Stufe, die neuen Daten haben weniger).
 *
 * ★ D-LERNDATEN (25.10.2026): gefüllt aus `tf-fest-bg.json` (`wurzeln`, `wurzelKategorien`), geprüft im `PRUEFBERICHT.md`
 * desselben Ordners. Paare je Stufe: Kinder 80, Jugend 80, Erwachsene 80 (Ziel wie cs/it: 80 - der
 * Wächter führt die gelieferte Menge als benannte Mindestzahl). Die Themen-Namen auf Deutsch und Englisch (`titelJe`) sind in
 * D-LERNDATEN übersetzt (die übrigen Bedienungen lesen das Englische). `raetsel` (240 Zeilen) ist NICHT eingehängt - es hat im
 * Code keinen Platz (Rezept D, Erkenntnis 3; Befund `BEFUND-2026-10-25-D-LERNDATEN.md`).
 * Wächter: `tests/tastenflow-lerndaten-bg.test.ts`.
 *
 * Verteiler: `vorlagen.ts` (`GERUEST_WURZELN`, Art `"wortherkunft"`; Gruppe in `EigenerTextQuelle.tsx`). Solange {@link WURZEL_THEMEN_BG}
 * leer ist, gibt es KEINE Vorlage (weder „Eigene Übung" noch Tippchallenge); mit dem ersten Thema erscheint sie für Weg UND Übungssprache „bg".
 *
 * ⚠️ DATENBLATT: nur `import type`, kein Code-Import.
 */

export type WurzelStufeBg = "kids" | "teens" | "erwachsen";

/** Woher ein Wort kommt - GESCHLOSSENE Liste (gemessen in `tf-fest-bg.json`, 25.10.2026); nur für die Lehrkraft, wird nicht abgetippt. */
export type WurzelOrigineBg = "английски" | "арабски" | "гренландски" | "гръцки" | "инуитски" | "италиански" | "кечуа" | "латински" | "малайски" | "науатл" | "немски" | "персийски" | "португалски" | "праславянски" | "таино" | "тупи" | "турски" | "френски" | "хинди" | "чешки" | "японски";

export interface WurzelPaarBg {
  /** Kurze, wahre Umschreibung der Bedeutung - nicht das Wort selbst. */
  indizio: string;
  /** Das Wort selbst - ein Einzelwort, klein. */
  parola: string;
  origine: WurzelOrigineBg;
  /** Wo die Herkunft nachgelesen wurde (Quelle aus `tf-fest`, z. B. eine Wiktionary-Seite). */
  beleg: string;
}

export interface WurzelThemaBg {
  id: string;
  titel: string;
  paare: WurzelPaarBg[];
}

/** Die Themen (aus `wurzelKategorien`): `titel` in Bulgarisch, `titelJe` der Name in den Bedienungssprachen (fehlt einer: englisch, sonst `titel`). */
export const WURZEL_THEMEN_BG: readonly { id: string; titel: string; titelJe?: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> }[] = [
  { id: "gratsko-latinski", titel: "Гръцки и латински корени", titelJe: { de: "Griechische und lateinische Wurzeln", en: "Greek and Latin roots" } },
  { id: "turski", titel: "Думи от турски", titelJe: { de: "Wörter aus dem Türkischen", en: "Words from Turkish" } },
  { id: "zapadni", titel: "Думи от френски, немски и италиански", titelJe: { de: "Wörter aus dem Französischen, Deutschen und Italienischen", en: "Words from French, German and Italian" } },
  { id: "svet", titel: "Думи от английски и далечни земи", titelJe: { de: "Wörter aus dem Englischen und aus fernen Ländern", en: "Words from English and faraway lands" } },
  { id: "slavyanski", titel: "Стари славянски думи", titelJe: { de: "Alte slawische Wörter", en: "Old Slavic words" } },
];

/** Die Paare je Stufe und Thema. */
export const WURZELN_BG: Record<WurzelStufeBg, WurzelThemaBg[]> = {
  kids: [
    {
      id: "gratsko-latinski",
      titel: "Гръцки и латински корени",
      paare: [
        { indizio: "говориш чрез него с някого далече", parola: "телефон", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/телефон#Bulgarian" },
        { indizio: "огромен гущер от древността", parola: "динозавър", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/динозавър#Bulgarian" },
        { indizio: "голямо животно, което живее в африканските реки", parola: "хипопотам", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/хипопотам#Bulgarian" },
        { indizio: "учи за планините, реките и държавите", parola: "география", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/география#Bulgarian" },
        { indizio: "много книги на едно място", parola: "библиотека", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/библиотека#Bulgarian" },
        { indizio: "обикаля около Слънцето", parola: "планета", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/планета#Bulgarian" },
        { indizio: "песни и мелодии", parola: "музика", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/музика#Bulgarian" },
        { indizio: "училищен предмет за числата", parola: "математика", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/математика#Bulgarian" },
        { indizio: "сцена, актьори и публика", parola: "театър", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/театър#Bulgarian" },
        { indizio: "всички букви по ред", parola: "алфавит", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/алфавит#Bulgarian" },
        { indizio: "стъклен съд с рибки", parola: "аквариум", origine: "латински", beleg: "https://en.wiktionary.org/wiki/аквариум#Bulgarian" },
        { indizio: "показва дните и месеците", parola: "календар", origine: "латински", beleg: "https://en.wiktionary.org/wiki/календар#Bulgarian" },
        { indizio: "лекува хората", parola: "доктор", origine: "латински", beleg: "https://en.wiktionary.org/wiki/доктор#Bulgarian" },
        { indizio: "голяма сграда, в която машини правят неща", parola: "фабрика", origine: "латински", beleg: "https://en.wiktionary.org/wiki/фабрика#Bulgarian" },
        { indizio: "науката за растенията и животните", parola: "биология", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/биология#Bulgarian" },
        { indizio: "морско животно с осем пипала", parola: "октопод", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/октопод#Bulgarian" },
        { indizio: "правилата за думите и изреченията", parola: "граматика", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/граматика#Bulgarian" },
        { indizio: "мери колко е топло", parola: "термометър", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/термометър#Bulgarian" },
        { indizio: "уред за гледане на звездите", parola: "телескоп", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/телескоп#Bulgarian" },
        { indizio: "училищен предмет за силите и светлината", parola: "физика", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/физика#Bulgarian" },
      ],
    },
    {
      id: "turski",
      titel: "Думи от турски",
      paare: [
        { indizio: "носим в нея книги и неща", parola: "чанта", origine: "турски", beleg: "https://en.wiktionary.org/wiki/чанта#Bulgarian" },
        { indizio: "слагаме неща в него на дрехата", parola: "джоб", origine: "турски", beleg: "https://en.wiktionary.org/wiki/джоб#Bulgarian" },
        { indizio: "пази ни от дъжда", parola: "чадър", origine: "турски", beleg: "https://en.wiktionary.org/wiki/чадър#Bulgarian" },
        { indizio: "в нея готвим супа", parola: "тенджера", origine: "турски", beleg: "https://en.wiktionary.org/wiki/тенджера#Bulgarian" },
        { indizio: "обуваме го на крака си", parola: "чорап", origine: "турски", beleg: "https://en.wiktionary.org/wiki/чорап#Bulgarian" },
        { indizio: "кръгло ястие от кайма", parola: "кюфте", origine: "турски", beleg: "https://en.wiktionary.org/wiki/кюфте#Bulgarian" },
        { indizio: "сладкиш с тънки кори и сироп", parola: "баклава", origine: "турски", beleg: "https://en.wiktionary.org/wiki/баклава#Bulgarian" },
        { indizio: "плитък съд за печене във фурната", parola: "тава", origine: "турски", beleg: "https://en.wiktionary.org/wiki/тава#Bulgarian" },
        { indizio: "кутия в бюрото, която се издърпва", parola: "чекмедже", origine: "турски", beleg: "https://en.wiktionary.org/wiki/чекмедже#Bulgarian" },
        { indizio: "топла завивка за леглото", parola: "юрган", origine: "турски", beleg: "https://en.wiktionary.org/wiki/юрган#Bulgarian" },
        { indizio: "сладко желе на кубчета с пудра захар", parola: "локум", origine: "турски", beleg: "https://en.wiktionary.org/wiki/локум#Bulgarian" },
        { indizio: "оранжев плод с костилка", parola: "кайсия", origine: "турски", beleg: "https://en.wiktionary.org/wiki/кайсия#Bulgarian" },
        { indizio: "ядка с продълговата форма", parola: "бадем", origine: "турски", beleg: "https://en.wiktionary.org/wiki/бадем#Bulgarian" },
        { indizio: "сладкиш от сусам или слънчоглед", parola: "халва", origine: "турски", beleg: "https://en.wiktionary.org/wiki/халва#Bulgarian" },
        { indizio: "с нея оцветяваме стените", parola: "боя", origine: "турски", beleg: "https://en.wiktionary.org/wiki/боя#Bulgarian" },
      ],
    },
    {
      id: "zapadni",
      titel: "Думи от френски, немски и италиански",
      paare: [
        { indizio: "качва ни до горните етажи", parola: "асансьор", origine: "френски", beleg: "https://en.wiktionary.org/wiki/асансьор#Bulgarian" },
        { indizio: "пясъчен бряг на морето", parola: "плаж", origine: "френски", beleg: "https://en.wiktionary.org/wiki/плаж#Bulgarian" },
        { indizio: "кара колата или автобуса", parola: "шофьор", origine: "френски", beleg: "https://en.wiktionary.org/wiki/шофьор#Bulgarian" },
        { indizio: "стая за колата", parola: "гараж", origine: "френски", beleg: "https://en.wiktionary.org/wiki/гараж#Bulgarian" },
        { indizio: "пътека за пешеходците край улицата", parola: "тротоар", origine: "френски", beleg: "https://en.wiktionary.org/wiki/тротоар#Bulgarian" },
        { indizio: "сладко, увито в цветна хартийка", parola: "бонбон", origine: "френски", beleg: "https://en.wiktionary.org/wiki/бонбон#Bulgarian" },
        { indizio: "месо за сандвичи", parola: "шунка", origine: "немски", beleg: "https://en.wiktionary.org/wiki/шунка#Bulgarian" },
        { indizio: "хрупкав сладкиш на квадратчета", parola: "вафла", origine: "немски", beleg: "https://en.wiktionary.org/wiki/вафла#Bulgarian" },
        { indizio: "мека закуска, извита като рогче", parola: "кифла", origine: "немски", beleg: "https://en.wiktionary.org/wiki/кифла#Bulgarian" },
        { indizio: "пробива дупки в стената", parola: "бормашина", origine: "немски", beleg: "https://en.wiktionary.org/wiki/бормашина#Bulgarian" },
        { indizio: "пъхаме го в контакта", parola: "щепсел", origine: "немски", beleg: "https://en.wiktionary.org/wiki/щепсел#Bulgarian" },
        { indizio: "кръгло тесто с доматен сос и сирене", parola: "пица", origine: "италиански", beleg: "https://en.wiktionary.org/wiki/пица#Bulgarian" },
        { indizio: "дълга и тънка паста", parola: "спагети", origine: "италиански", beleg: "https://en.wiktionary.org/wiki/спагети#Bulgarian" },
        { indizio: "куха тестена паста", parola: "макарони", origine: "италиански", beleg: "https://en.wiktionary.org/wiki/макарони#Bulgarian" },
        { indizio: "намачкани варени картофи", parola: "пюре", origine: "френски", beleg: "https://en.wiktionary.org/wiki/пюре#Bulgarian" },
      ],
    },
    {
      id: "svet",
      titel: "Думи от английски и далечни земи",
      paare: [
        { indizio: "сладко от какао", parola: "шоколад", origine: "науатл", beleg: "https://en.wiktionary.org/wiki/шоколад#Bulgarian" },
        { indizio: "тропически плод с корона от листа", parola: "ананас", origine: "тупи", beleg: "https://en.wiktionary.org/wiki/ананас#Bulgarian" },
        { indizio: "много силен вятър, който се върти", parola: "ураган", origine: "таино", beleg: "https://en.wiktionary.org/wiki/ураган#Bulgarian" },
        { indizio: "игра с топка, която ритаме", parola: "футбол", origine: "английски", beleg: "https://en.wiktionary.org/wiki/футбол#Bulgarian" },
        { indizio: "игра с топка и кош", parola: "баскетбол", origine: "английски", beleg: "https://en.wiktionary.org/wiki/баскетбол#Bulgarian" },
        { indizio: "машина, на която пишем и играем", parola: "компютър", origine: "английски", beleg: "https://en.wiktionary.org/wiki/компютър#Bulgarian" },
        { indizio: "две филийки с нещо между тях", parola: "сандвич", origine: "английски", beleg: "https://en.wiktionary.org/wiki/сандвич#Bulgarian" },
        { indizio: "игра на леда със стик и шайба", parola: "хокей", origine: "английски", beleg: "https://en.wiktionary.org/wiki/хокей#Bulgarian" },
        { indizio: "тичане, плуване, игри с топка", parola: "спорт", origine: "английски", beleg: "https://en.wiktionary.org/wiki/спорт#Bulgarian" },
        { indizio: "смешен човек с червен нос в цирка", parola: "клоун", origine: "английски", beleg: "https://en.wiktionary.org/wiki/клоун#Bulgarian" },
        { indizio: "кон на черни и бели ивици", parola: "зебра", origine: "португалски", beleg: "https://en.wiktionary.org/wiki/зебра#Bulgarian" },
        { indizio: "голям орех с мляко вътре", parola: "кокос", origine: "португалски", beleg: "https://en.wiktionary.org/wiki/кокос#Bulgarian" },
        { indizio: "машина, която работи вместо човека", parola: "робот", origine: "чешки", beleg: "https://en.wiktionary.org/wiki/робот#Bulgarian" },
        { indizio: "животно от Андите с мека вълна", parola: "лама", origine: "кечуа", beleg: "https://en.wiktionary.org/wiki/лама#Bulgarian" },
        { indizio: "къщичка от лед на Севера", parola: "иглу", origine: "инуитски", beleg: "https://en.wiktionary.org/wiki/иглу#Bulgarian" },
      ],
    },
    {
      id: "slavyanski",
      titel: "Стари славянски думи",
      paare: [
        { indizio: "пием я, когато сме жадни", parola: "вода", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/вода#Bulgarian" },
        { indizio: "грее на небето през деня", parola: "слънце", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/слънце#Bulgarian" },
        { indizio: "малка светлинка на нощното небе", parola: "звезда", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/звезда#Bulgarian" },
        { indizio: "голям горски звяр, който обича мед", parola: "мечка", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/мечка#Bulgarian" },
        { indizio: "сив горски звяр, който вие", parola: "вълк", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/вълк#Bulgarian" },
        { indizio: "хитра рижава животинка", parola: "лисица", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/лисица#Bulgarian" },
        { indizio: "червен или зелен плод от дърво", parola: "ябълка", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/ябълка#Bulgarian" },
        { indizio: "прави мед", parola: "пчела", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/пчела#Bulgarian" },
        { indizio: "пишем и рисуваме с нея", parola: "ръка", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/ръка#Bulgarian" },
        { indizio: "на нея носим шапка", parola: "глава", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/глава#Bulgarian" },
        { indizio: "син на моите родители, но не съм аз", parola: "брат", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/брат#Bulgarian" },
        { indizio: "дъщеря на моите родители, но не съм аз", parola: "сестра", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/сестра#Bulgarian" },
        { indizio: "бял и студен, пада през зимата", parola: "сняг", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/сняг#Bulgarian" },
        { indizio: "много дървета на едно място", parola: "гора", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/гора#Bulgarian" },
        { indizio: "плува и има люспи", parola: "риба", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/риба#Bulgarian" },
      ],
    },
  ],
  teens: [
    {
      id: "gratsko-latinski",
      titel: "Гръцки и латински корени",
      paare: [
        { indizio: "растенията правят храна от светлина", parola: "фотосинтеза", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/фотосинтеза#Bulgarian" },
        { indizio: "науката за природата и околната среда", parola: "екология", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/екология#Bulgarian" },
        { indizio: "проектира сгради", parola: "архитект", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/архитект#Bulgarian" },
        { indizio: "линията, където небето среща земята", parola: "хоризонт", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/хоризонт#Bulgarian" },
        { indizio: "обичайното време в една област", parola: "климат", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/климат#Bulgarian" },
        { indizio: "науката за звездите", parola: "астрономия", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/астрономия#Bulgarian" },
        { indizio: "много малък причинител на болести", parola: "вирус", origine: "латински", beleg: "https://en.wiktionary.org/wiki/вирус#Bulgarian" },
        { indizio: "разговор между двама", parola: "диалог", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/диалог#Bulgarian" },
        { indizio: "науката за старите неща под земята", parola: "археология", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/археология#Bulgarian" },
        { indizio: "песен без думи, която си тананикаш", parola: "мелодия", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/мелодия#Bulgarian" },
        { indizio: "съзвучие на тонове", parola: "хармония", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/хармония#Bulgarian" },
        { indizio: "записани събития по ред", parola: "хроника", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/хроника#Bulgarian" },
        { indizio: "подробно изследване на нещо", parola: "анализ", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/анализ#Bulgarian" },
        { indizio: "обяснение, което учените проверяват", parola: "теория", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/теория#Bulgarian" },
        { indizio: "висше училище", parola: "университет", origine: "латински", beleg: "https://en.wiktionary.org/wiki/университет#Bulgarian" },
        { indizio: "стара приказка за герои и чудеса", parola: "легенда", origine: "латински", beleg: "https://en.wiktionary.org/wiki/легенда#Bulgarian" },
        { indizio: "обичай, предаван от поколение на поколение", parola: "традиция", origine: "латински", beleg: "https://en.wiktionary.org/wiki/традиция#Bulgarian" },
        { indizio: "науката за душевния живот", parola: "психология", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/психология#Bulgarian" },
        { indizio: "човек, който се явява на избор или изпит", parola: "кандидат", origine: "латински", beleg: "https://en.wiktionary.org/wiki/кандидат#Bulgarian" },
        { indizio: "сила, която кара нещата да работят", parola: "енергия", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/енергия#Bulgarian" },
      ],
    },
    {
      id: "turski",
      titel: "Думи от турски",
      paare: [
        { indizio: "тъкана покривка за пода", parola: "килим", origine: "турски", beleg: "https://en.wiktionary.org/wiki/килим#Bulgarian" },
        { indizio: "място, където купуваме плодове и зеленчуци", parola: "пазар", origine: "турски", beleg: "https://en.wiktionary.org/wiki/пазар#Bulgarian" },
        { indizio: "квартал в град или село", parola: "махала", origine: "турски", beleg: "https://en.wiktionary.org/wiki/махала#Bulgarian" },
        { indizio: "гладим дрехите с нея", parola: "ютия", origine: "турски", beleg: "https://en.wiktionary.org/wiki/ютия#Bulgarian" },
        { indizio: "шкаф с врати", parola: "долап", origine: "турски", beleg: "https://en.wiktionary.org/wiki/долап#Bulgarian" },
        { indizio: "кърпа за бърсане след баня", parola: "пешкир", origine: "турски", beleg: "https://en.wiktionary.org/wiki/пешкир#Bulgarian" },
        { indizio: "лилав зеленчук", parola: "патладжан", origine: "турски", beleg: "https://en.wiktionary.org/wiki/патладжан#Bulgarian" },
        { indizio: "зелен зеленчук с остър връх, за яхния", parola: "бамя", origine: "турски", beleg: "https://en.wiktionary.org/wiki/бамя#Bulgarian" },
        { indizio: "пълнени зелеви или лозови листа", parola: "сарма", origine: "турски", beleg: "https://en.wiktionary.org/wiki/сарма#Bulgarian" },
        { indizio: "печено месо на шиш или на парчета", parola: "кебап", origine: "турски", beleg: "https://en.wiktionary.org/wiki/кебап#Bulgarian" },
        { indizio: "напитка от кисело мляко и вода", parola: "айрян", origine: "турски", beleg: "https://en.wiktionary.org/wiki/айрян#Bulgarian" },
        { indizio: "кутийка с клечки за огън", parola: "кибрит", origine: "турски", beleg: "https://en.wiktionary.org/wiki/кибрит#Bulgarian" },
        { indizio: "мебел за сядане и лежане", parola: "диван", origine: "турски", beleg: "https://en.wiktionary.org/wiki/диван#Bulgarian" },
        { indizio: "смляно месо", parola: "кайма", origine: "турски", beleg: "https://en.wiktionary.org/wiki/кайма#Bulgarian" },
        { indizio: "дребни семенца за поръсване на хляба", parola: "сусам", origine: "турски", beleg: "https://en.wiktionary.org/wiki/сусам#Bulgarian" },
      ],
    },
    {
      id: "zapadni",
      titel: "Думи от френски, немски и италиански",
      paare: [
        { indizio: "ниво в сграда", parola: "етаж", origine: "френски", beleg: "https://en.wiktionary.org/wiki/етаж#Bulgarian" },
        { indizio: "скъпоценно украшение", parola: "бижу", origine: "френски", beleg: "https://en.wiktionary.org/wiki/бижу#Bulgarian" },
        { indizio: "приятна миризма в шишенце", parola: "парфюм", origine: "френски", beleg: "https://en.wiktionary.org/wiki/парфюм#Bulgarian" },
        { indizio: "шкаф за дрехи", parola: "гардероб", origine: "френски", beleg: "https://en.wiktionary.org/wiki/гардероб#Bulgarian" },
        { indizio: "малка чантичка за пари", parola: "портмоне", origine: "френски", beleg: "https://en.wiktionary.org/wiki/портмоне#Bulgarian" },
        { indizio: "суши косата с топъл въздух", parola: "сешоар", origine: "френски", beleg: "https://en.wiktionary.org/wiki/сешоар#Bulgarian" },
        { indizio: "вид на буквите в текст", parola: "шрифт", origine: "немски", beleg: "https://en.wiktionary.org/wiki/шрифт#Bulgarian" },
        { indizio: "лост с тежести, вдигат я спортисти", parola: "щанга", origine: "немски", beleg: "https://en.wiktionary.org/wiki/щанга#Bulgarian" },
        { indizio: "плоско кръгче при винта или в хокея", parola: "шайба", origine: "немски", beleg: "https://en.wiktionary.org/wiki/шайба#Bulgarian" },
        { indizio: "изпълнение само от един музикант", parola: "соло", origine: "италиански", beleg: "https://en.wiktionary.org/wiki/соло#Bulgarian" },
        { indizio: "бял сос от яйца и олио", parola: "майонеза", origine: "френски", beleg: "https://en.wiktionary.org/wiki/майонеза#Bulgarian" },
        { indizio: "списък с ястията в ресторанта", parola: "меню", origine: "френски", beleg: "https://en.wiktionary.org/wiki/меню#Bulgarian" },
        { indizio: "куфарите при пътуване", parola: "багаж", origine: "френски", beleg: "https://en.wiktionary.org/wiki/багаж#Bulgarian" },
        { indizio: "тънко пържено месо в панировка", parola: "шницел", origine: "немски", beleg: "https://en.wiktionary.org/wiki/шницел#Bulgarian" },
        { indizio: "голям музикален инструмент с черни и бели клавиши", parola: "пиано", origine: "италиански", beleg: "https://en.wiktionary.org/wiki/пиано#Bulgarian" },
      ],
    },
    {
      id: "svet",
      titel: "Думи от английски и далечни земи",
      paare: [
        { indizio: "мрежата, която свързва компютрите по света", parola: "интернет", origine: "английски", beleg: "https://en.wiktionary.org/wiki/интернет#Bulgarian" },
        { indizio: "документ в компютъра", parola: "файл", origine: "английски", beleg: "https://en.wiktionary.org/wiki/файл#Bulgarian" },
        { indizio: "преносим компютър", parola: "лаптоп", origine: "английски", beleg: "https://en.wiktionary.org/wiki/лаптоп#Bulgarian" },
        { indizio: "музика с много импровизация", parola: "джаз", origine: "английски", beleg: "https://en.wiktionary.org/wiki/джаз#Bulgarian" },
        { indizio: "спорт с ръкавици на ринга", parola: "бокс", origine: "английски", beleg: "https://en.wiktionary.org/wiki/бокс#Bulgarian" },
        { indizio: "кръгла питка с кюфте", parola: "хамбургер", origine: "английски", beleg: "https://en.wiktionary.org/wiki/хамбургер#Bulgarian" },
        { indizio: "гъста тропическа гора", parola: "джунгла", origine: "английски", beleg: "https://en.wiktionary.org/wiki/джунгла#Bulgarian" },
        { indizio: "животно с кратък хобот от Южна Америка", parola: "тапир", origine: "тупи", beleg: "https://en.wiktionary.org/wiki/тапир#Bulgarian" },
        { indizio: "непромокаемо яке с качулка", parola: "анорак", origine: "гренландски", beleg: "https://en.wiktionary.org/wiki/анорак#Bulgarian" },
        { indizio: "японска дреха с широки ръкави", parola: "кимоно", origine: "японски", beleg: "https://en.wiktionary.org/wiki/кимоно#Bulgarian" },
        { indizio: "бойно изкуство с удари с ръце и крака", parola: "карате", origine: "японски", beleg: "https://en.wiktionary.org/wiki/карате#Bulgarian" },
        { indizio: "дрехи за спане", parola: "пижама", origine: "хинди", beleg: "https://en.wiktionary.org/wiki/пижама#Bulgarian" },
        { indizio: "жълт тропически плод", parola: "банан", origine: "португалски", beleg: "https://en.wiktionary.org/wiki/банан#Bulgarian" },
        { indizio: "водач на група или партия", parola: "лидер", origine: "английски", beleg: "https://en.wiktionary.org/wiki/лидер#Bulgarian" },
        { indizio: "игра с бухалка и топка", parola: "бейзбол", origine: "английски", beleg: "https://en.wiktionary.org/wiki/бейзбол#Bulgarian" },
      ],
    },
    {
      id: "slavyanski",
      titel: "Стари славянски думи",
      paare: [
        { indizio: "носи се по небето и носи дъжд", parola: "облак", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/облак#Bulgarian" },
        { indizio: "силен звук при буря", parola: "гръм", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/гръм#Bulgarian" },
        { indizio: "движение на въздуха", parola: "вятър", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/вятър#Bulgarian" },
        { indizio: "вода, заобиколена от суша", parola: "езеро", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/езеро#Bulgarian" },
        { indizio: "високи върхове и гори", parola: "планина", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/планина#Bulgarian" },
        { indizio: "суша, заобиколена от вода", parola: "остров", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/остров#Bulgarian" },
        { indizio: "нашата планета и почвата под краката", parola: "земя", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/земя#Bulgarian" },
        { indizio: "гори и топли", parola: "огън", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/огън#Bulgarian" },
        { indizio: "твърд и тежък, лежи край пътя", parola: "камък", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/камък#Bulgarian" },
        { indizio: "бие в гърдите ни", parola: "сърце", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/сърце#Bulgarian" },
        { indizio: "ядка с твърда черупка", parola: "орех", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/орех#Bulgarian" },
        { indizio: "малко семенце от житото", parola: "зърно", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/зърно#Bulgarian" },
        { indizio: "от него се прави брашно", parola: "жито", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/жито#Bulgarian" },
        { indizio: "момиче, дете на своите родители", parola: "дъщеря", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/дъщеря#Bulgarian" },
        { indizio: "синът на сина или на дъщерята", parola: "внук", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/внук#Bulgarian" },
      ],
    },
  ],
  erwachsen: [
    {
      id: "gratsko-latinski",
      titel: "Гръцки и латински корени",
      paare: [
        { indizio: "власт на народа", parola: "демокрация", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/демокрация#Bulgarian" },
        { indizio: "любов към мъдростта", parola: "философия", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/философия#Bulgarian" },
        { indizio: "власт на малцина", parola: "олигархия", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/олигархия#Bulgarian" },
        { indizio: "страх от чуждото и непознатото", parola: "ксенофобия", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/ксенофобия#Bulgarian" },
        { indizio: "пълна липса на власт и ред", parola: "анархия", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/анархия#Bulgarian" },
        { indizio: "подреждане на събитията във времето", parola: "хронология", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/хронология#Bulgarian" },
        { indizio: "науката за произхода на думите", parola: "етимология", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/етимология#Bulgarian" },
        { indizio: "право на самоуправление", parola: "автономия", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/автономия#Bulgarian" },
        { indizio: "човек, който говори много езици", parola: "полиглот", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/полиглот#Bulgarian" },
        { indizio: "казваш едно, а мислиш обратното", parola: "ирония", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/ирония#Bulgarian" },
        { indizio: "управлението на държавата и обществото", parola: "политика", origine: "гръцки", beleg: "https://en.wiktionary.org/wiki/политика#Bulgarian" },
        { indizio: "служители и учреждения, които управляват", parola: "администрация", origine: "латински", beleg: "https://en.wiktionary.org/wiki/администрация#Bulgarian" },
        { indizio: "основният закон на държавата", parola: "конституция", origine: "латински", beleg: "https://en.wiktionary.org/wiki/конституция#Bulgarian" },
        { indizio: "държава с избран президент", parola: "република", origine: "латински", beleg: "https://en.wiktionary.org/wiki/република#Bulgarian" },
        { indizio: "специалист по правото", parola: "юрист", origine: "латински", beleg: "https://en.wiktionary.org/wiki/юрист#Bulgarian" },
        { indizio: "ръководител на университет", parola: "ректор", origine: "латински", beleg: "https://en.wiktionary.org/wiki/ректор#Bulgarian" },
        { indizio: "заверява документи и сделки", parola: "нотариус", origine: "латински", beleg: "https://en.wiktionary.org/wiki/нотариус#Bulgarian" },
        { indizio: "защитава ни в съда", parola: "адвокат", origine: "латински", beleg: "https://en.wiktionary.org/wiki/адвокат#Bulgarian" },
        { indizio: "доказателство, че не си бил на мястото", parola: "алиби", origine: "латински", beleg: "https://en.wiktionary.org/wiki/алиби#Bulgarian" },
        { indizio: "изкуството на отношенията между държавите", parola: "дипломация", origine: "латински", beleg: "https://en.wiktionary.org/wiki/дипломация#Bulgarian" },
      ],
    },
    {
      id: "turski",
      titel: "Думи от турски",
      paare: [
        { indizio: "работа, която се учи от майстор", parola: "занаят", origine: "турски", beleg: "https://en.wiktionary.org/wiki/занаят#Bulgarian" },
        { indizio: "дребен недостатък", parola: "кусур", origine: "турски", beleg: "https://en.wiktionary.org/wiki/кусур#Bulgarian" },
        { indizio: "голямо земеделско стопанство в миналото", parola: "чифлик", origine: "турски", beleg: "https://en.wiktionary.org/wiki/чифлик#Bulgarian" },
        { indizio: "ученик при майстор занаятчия", parola: "чирак", origine: "турски", beleg: "https://en.wiktionary.org/wiki/чирак#Bulgarian" },
        { indizio: "тетрадка за сметки и бележки", parola: "тефтер", origine: "турски", beleg: "https://en.wiktionary.org/wiki/тефтер#Bulgarian" },
        { indizio: "голяма дървена кутия с капак", parola: "сандък", origine: "турски", beleg: "https://en.wiktionary.org/wiki/сандък#Bulgarian" },
        { indizio: "висока шапка от агнешка кожа", parola: "калпак", origine: "турски", beleg: "https://en.wiktionary.org/wiki/калпак#Bulgarian" },
        { indizio: "каменен извор край пътя", parola: "чешма", origine: "турски", beleg: "https://en.wiktionary.org/wiki/чешма#Bulgarian" },
        { indizio: "черна лепкава смола", parola: "катран", origine: "турски", beleg: "https://en.wiktionary.org/wiki/катран#Bulgarian" },
        { indizio: "открита тераса на старата къща", parola: "чардак", origine: "турски", beleg: "https://en.wiktionary.org/wiki/чардак#Bulgarian" },
        { indizio: "гъста напитка от жито", parola: "боза", origine: "турски", beleg: "https://en.wiktionary.org/wiki/боза#Bulgarian" },
        { indizio: "червеникав метал за котли", parola: "бакър", origine: "турски", beleg: "https://en.wiktionary.org/wiki/бакър#Bulgarian" },
        { indizio: "мек плат с мъх", parola: "кадифе", origine: "турски", beleg: "https://en.wiktionary.org/wiki/кадифе#Bulgarian" },
        { indizio: "листа, които се пушат", parola: "тютюн", origine: "турски", beleg: "https://en.wiktionary.org/wiki/тютюн#Bulgarian" },
        { indizio: "тъмна гореща напитка сутрин", parola: "кафе", origine: "турски", beleg: "https://en.wiktionary.org/wiki/кафе#Bulgarian" },
      ],
    },
    {
      id: "zapadni",
      titel: "Думи от френски, немски и италиански",
      paare: [
        { indizio: "прозорче, на което се обслужват клиенти", parola: "гише", origine: "френски", beleg: "https://en.wiktionary.org/wiki/гише#Bulgarian" },
        { indizio: "смелост", parola: "кураж", origine: "френски", beleg: "https://en.wiktionary.org/wiki/кураж#Bulgarian" },
        { indizio: "малък моден магазин", parola: "бутик", origine: "френски", beleg: "https://en.wiktionary.org/wiki/бутик#Bulgarian" },
        { indizio: "изглед на местността", parola: "ландшафт", origine: "немски", beleg: "https://en.wiktionary.org/wiki/ландшафт#Bulgarian" },
        { indizio: "първа изява пред публика", parola: "дебют", origine: "френски", beleg: "https://en.wiktionary.org/wiki/дебют#Bulgarian" },
        { indizio: "ръководи снимането на филм", parola: "режисьор", origine: "френски", beleg: "https://en.wiktionary.org/wiki/режисьор#Bulgarian" },
        { indizio: "покривало на лампата", parola: "абажур", origine: "френски", beleg: "https://en.wiktionary.org/wiki/абажур#Bulgarian" },
        { indizio: "отваря бутилки с тапа", parola: "тирбушон", origine: "френски", beleg: "https://en.wiktionary.org/wiki/тирбушон#Bulgarian" },
        { indizio: "малка чанта за документи и пари", parola: "портфейл", origine: "френски", beleg: "https://en.wiktionary.org/wiki/портфейл#Bulgarian" },
        { indizio: "действието в роман или филм", parola: "сюжет", origine: "френски", beleg: "https://en.wiktionary.org/wiki/сюжет#Bulgarian" },
        { indizio: "залата пред театралния салон", parola: "фоайе", origine: "френски", beleg: "https://en.wiktionary.org/wiki/фоайе#Bulgarian" },
        { indizio: "място за лечение и почивка", parola: "курорт", origine: "немски", beleg: "https://en.wiktionary.org/wiki/курорт#Bulgarian" },
        { indizio: "лицевата страна на сградата", parola: "фасада", origine: "френски", beleg: "https://en.wiktionary.org/wiki/фасада#Bulgarian" },
        { indizio: "висок мъжки певчески глас", parola: "тенор", origine: "италиански", beleg: "https://en.wiktionary.org/wiki/тенор#Bulgarian" },
        { indizio: "място, където се плаща в магазина", parola: "каса", origine: "италиански", beleg: "https://en.wiktionary.org/wiki/каса#Bulgarian" },
      ],
    },
    {
      id: "svet",
      titel: "Думи от английски и далечни земи",
      paare: [
        { indizio: "ръководител във фирма", parola: "мениджър", origine: "английски", beleg: "https://en.wiktionary.org/wiki/мениджър#Bulgarian" },
        { indizio: "търговия и предприемачество", parola: "бизнес", origine: "английски", beleg: "https://en.wiktionary.org/wiki/бизнес#Bulgarian" },
        { indizio: "стая или сграда за служители", parola: "офис", origine: "английски", beleg: "https://en.wiktionary.org/wiki/офис#Bulgarian" },
        { indizio: "продажба и реклама на стоки", parola: "маркетинг", origine: "английски", beleg: "https://en.wiktionary.org/wiki/маркетинг#Bulgarian" },
        { indizio: "възпитан и учтив мъж", parola: "джентълмен", origine: "английски", beleg: "https://en.wiktionary.org/wiki/джентълмен#Bulgarian" },
        { indizio: "събрание на много хора с искане", parola: "митинг", origine: "английски", beleg: "https://en.wiktionary.org/wiki/митинг#Bulgarian" },
        { indizio: "дял от математиката с букви вместо числа", parola: "алгебра", origine: "арабски", beleg: "https://en.wiktionary.org/wiki/алгебра#Bulgarian" },
        { indizio: "игра с цар, царица и пешки", parola: "шах", origine: "персийски", beleg: "https://en.wiktionary.org/wiki/шах#Bulgarian" },
        { indizio: "голяма вълна след земетресение", parola: "цунами", origine: "японски", beleg: "https://en.wiktionary.org/wiki/цунами#Bulgarian" },
        { indizio: "лично дневниче в интернет", parola: "блог", origine: "английски", beleg: "https://en.wiktionary.org/wiki/блог#Bulgarian" },
        { indizio: "разговор с писане в мрежата", parola: "чат", origine: "английски", beleg: "https://en.wiktionary.org/wiki/чат#Bulgarian" },
        { indizio: "градски влак по релси на улицата", parola: "трамвай", origine: "английски", beleg: "https://en.wiktionary.org/wiki/трамвай#Bulgarian" },
        { indizio: "сдружение на хора с общ интерес", parola: "клуб", origine: "английски", beleg: "https://en.wiktionary.org/wiki/клуб#Bulgarian" },
        { indizio: "открива самолети с радиовълни", parola: "радар", origine: "английски", beleg: "https://en.wiktionary.org/wiki/радар#Bulgarian" },
        { indizio: "висока тропическа трева с кухо стъбло", parola: "бамбук", origine: "малайски", beleg: "https://en.wiktionary.org/wiki/бамбук#Bulgarian" },
      ],
    },
    {
      id: "slavyanski",
      titel: "Стари славянски думи",
      paare: [
        { indizio: "първата светлина сутрин", parola: "зора", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/зора#Bulgarian" },
        { indizio: "отделя брашното от трицата", parola: "сито", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/сито#Bulgarian" },
        { indizio: "сечиво за жънене", parola: "сърп", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/сърп#Bulgarian" },
        { indizio: "пръчица за предене", parola: "вретено", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/вретено#Bulgarian" },
        { indizio: "старо дървено орало", parola: "рало", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/рало#Bulgarian" },
        { indizio: "справедливост", parola: "правда", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/правда#Bulgarian" },
        { indizio: "доверие и убеждение", parola: "вяра", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/вяра#Bulgarian" },
        { indizio: "да живееш без робство", parola: "свобода", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/свобода#Bulgarian" },
        { indizio: "изречена или писана дума", parola: "слово", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/слово#Bulgarian" },
        { indizio: "текст, изпратен на някого", parola: "писмо", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/писмо#Bulgarian" },
        { indizio: "всички хора от една страна", parola: "народ", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/народ#Bulgarian" },
        { indizio: "земята, в която си роден", parola: "родина", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/родина#Bulgarian" },
        { indizio: "свързва двата бряга на реката", parola: "мост", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/мост#Bulgarian" },
        { indizio: "дълбоко знание и опит", parola: "мъдрост", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/мъдрост#Bulgarian" },
        { indizio: "дърво с жълъди", parola: "дъб", origine: "праславянски", beleg: "https://en.wiktionary.org/wiki/дъб#Bulgarian" },
      ],
    },
  ],
};

/** Der Name der Tippchallenge-Dateien je Bedienungssprache, mit `{i}` und `{n}` („Bulgarian word origins, alphabetical: file {i} of {n}"). */
export const WURZEL_CHALLENGE_TITEL_BG: Partial<Record<"de" | "en" | "fr" | "es" | "it" | "pl" | "tr" | "cs", string>> = {
  de: "Herkunft bulgarischer Wörter, alphabetisch: Datei {i} von {n}",
  en: "Bulgarian word origins, alphabetical: file {i} of {n}",
};

/** Die Zeile eines Paares: zuerst der Hinweis, dann das Wort. */
export function wurzelZeileBg(x: { indizio: string; parola: string }): string {
  return `${x.indizio} - ${x.parola}`;
}

/** Dieselben Wörter, alphabetisch nach dem Hinweis (Sortierung „bg-BG") - für die Tippchallenge, wie `KORENY_ABECEDNE`. */
export const WURZELN_BG_ALPHABETISCH: Record<WurzelStufeBg, string[]> = Object.fromEntries(
  (Object.keys(WURZELN_BG) as WurzelStufeBg[]).map((stufe) => [
    stufe,
    WURZELN_BG[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.indizio.localeCompare(b.indizio, "bg-BG"))
      .map(wurzelZeileBg),
  ]),
) as Record<WurzelStufeBg, string[]>;
