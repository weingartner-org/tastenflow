/**
 * ★ G3c-VERTEILER (25.10.2026): DIE ABZEICHEN IN UKRAINISCH.
 * ★ O-INHALT-UK (29.10.2026): gefüllt - Gegenstück zu `badgesCs.ts`, dieselben Schlüssel, NEU AUF UKRAINISCH GESCHRIEBEN, nicht
 * übersetzt (Glossar `recherche-ukrainisch-2026-10-25/GLOSSAR-uk.md` §2.4): übertragen ist die IDEE. Ukrainische Wendungen, wo es sie
 * gibt („Книжковий черв'як", „Як з голочки", „Червона нитка", „Мій дім - моя фортеця", „За один присід", „Міцність скелі"), sonst ein
 * Bild oder Stabreim („Пильний пінгвін", „Спритна лисиця").
 *
 * ★★★ Geschlecht nie raten (Regel 2): KEINE Personenwörter für das Kind (Майстер, Чемпіон, Переможець, Дослідник), keine Vergangenheit
 * und kein Adjektiv am Kind; Adjektive nur am Tier oder Ding. Die Beschreibungen sind Sätze über die Sache - unpersönlich auf -но/-то
 * („Відкрито …", „прочитано"), Zahl + Hauptwort („5 раундів без жодної помилки") oder Hauptwort-Satz.
 * ★★★ KEINE Kriegs- oder Waffenwörter, auch nicht als Bild (Glossar §2.4, Bauplan §3): kein „ракета" (die Medaille mit der Rakete heisst
 * „космічний корабель"), kein „снайпер", „бій", „штурм".
 * ★ Mehrzahl mit vier Formen (Glossar §2.11, `Intl.PluralRules("uk")`): one · few · many · other - „3 чисті раунди", „7 чистих раундів",
 * „52 різні тижні". Zahlen nach `Intl` „uk-UA": geschütztes Leerzeichen auch vierstellig („1 000"), „95%" ohne Leerzeichen.
 * Begriffe: медаль, раунд, натискання, точність, помилка, основне положення, основний ряд, ряд цифр, частина (einer Geschichte), коло
 * балів, рівень складності, точка старту, Крижини, Полярна експедиція.
 * ⚠️ [G]: von einer Person mit Ukrainisch als Erstsprache gegenzulesen.
 *
 * Verteiler: `badges.ts`. Wächter: `tests/tastenflow-abzeichen-uk.test.ts`.
 */
import { lernwegDef } from "./lernweg";
import { lektionenFuer } from "./curriculum";
import type { AbzeichenTextEn, AbzeichenZahlen } from "./badgesEn";

/** Dieselbe Form wie der englische Eintrag. */
export type AbzeichenTextUk = AbzeichenTextEn;

/** Zahl mit der Form nach `Intl.PluralRules("uk")`: `uk(5, "день", "дні", "днів", "дня")` (one · few · many · other). */
function uk(n: number, one: string, few: string, many: string, other: string): string {
  const k = new Intl.PluralRules("uk-UA").select(n);
  const form = k === "one" ? one : k === "few" ? few : k === "many" ? many : other;
  return `${n.toLocaleString("uk-UA")} ${form}`;
}

/** Die Zeichen von „alltags-ass", die es auf dem Weg des Kindes wirklich gibt (wie `badgesCs.ts`). */
function alltagsZeichen(z: AbzeichenZahlen): string {
  const reihe = new Set(lernwegDef(z.lernweg).introOrder);
  const da = ["@", "€", "$", "§"].filter((c) => reihe.has(c));
  if (da.length <= 1) return da.join("");
  return `${da.slice(0, -1).join(", ")} і ${da[da.length - 1]}`;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name (Glossar §2.4). */
export const ABZEICHEN_GRUPPEN_UK: Readonly<Record<string, string>> = {
  Fehlerfrei: "Без помилок",
  "Saubere Serie": "Чисті раунди",
  Fleiß: "Старанність",
  Anschläge: "Натискання",
  Dranbleiben: "Наполегливість",
  Übungswochen: "Тижні тренувань",
  Sterne: "Зірки",
  Lektionen: "Уроки",
  Stufen: "Рівні",
  Tastenwelt: "Світ клавіатури",
  "Sitzt!": "Вийшло!",
  Tempo: "Швидкість",
  "Am Stück": "На одному диханні",
  Meisterprüfung: "Майстерність",
  Abenteuer: "Пригоди",
  "Abenteuer-Kunststücke": "Пригодницькі трюки",
  Expedition: "Експедиція",
  Geschichten: "Історії",
  Lesestunde: "Час читання",
  "Lese-Kunststücke": "Читацькі трюки",
  Geheim: "Таємні",
};

/** Der ganze Katalog ukrainisch, je Abzeichen-ID. */
export const ABZEICHEN_UK: Readonly<Record<string, AbzeichenTextUk>> = {
  // ── Без помилок ──────────────────────────────────────────────────────────
  volltreffer: { name: "Точно в яблучко", description: "Цілий раунд без жодної помилки.", bildbeschreibung: "мішень зі стрілою точно в центрі" },
  "null-fehler-ninja": { name: "Ніндзя без помилок", description: "5 раундів без жодної помилки.", bildbeschreibung: "ніндзя" },
  "makellos-meister": { name: "Бездоганні зірки", description: "15 раундів без жодної помилки.", bildbeschreibung: "три блискучі зірки" },
  "diamant-finger": { name: "Діамантові пальці", description: "40 раундів без жодної помилки.", bildbeschreibung: "синій коштовний камінь" },
  "weisse-weste": { name: "Чисто, як сніг", description: "80 раундів без жодної помилки.", bildbeschreibung: "білий голуб" },
  "einhorn-finger": { name: "Пальці єдинорога", nameNeutral: "150 раундів без помилок", description: "150 раундів без жодної помилки.", bildbeschreibung: "єдиноріг" },
  // ── Чисті раунди ─────────────────────────────────────────────────────────
  "praezisions-pinguin": { name: "Пильний пінгвін", nameNeutral: "Тричі чисто", description: "3 чисті раунди поспіль (точність щонайменше 95%).", bildbeschreibung: "пінгвін" },
  adlerauge: { name: "Орлине око", description: "7 чистих раундів поспіль (точність щонайменше 95%).", bildbeschreibung: "орел" },
  "laser-lama": { name: "Лазерна лама", nameNeutral: "Лазерний режим", description: "15 чистих раундів поспіль (точність щонайменше 95%).", bildbeschreibung: "лама" },
  "eiskalte-serie": { name: "Крижаний спокій", description: "25 чистих раундів поспіль (точність щонайменше 95%).", bildbeschreibung: "кубик льоду" },
  // ── Старанність ──────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Клавішне курчатко", nameNeutral: "Перший раунд", description: "Перший завершений раунд.", bildbeschreibung: "курчатко, що вилуплюється з яйця" },
  "ausdauer-ameise": { name: "Працьовита мурашка", nameNeutral: "Після розминки", description: "25 раундів тренування.", bildbeschreibung: "мурашка" },
  "marathon-maus": { name: "Марафонська мишка", nameNeutral: "Сто раундів", description: "100 раундів тренування.", bildbeschreibung: "голова мишки" },
  "munteres-murmeltier": { name: "Жвавий бобер", nameNeutral: "Марафон", description: "250 раундів тренування.", bildbeschreibung: "бобер" },
  dauerlaeufer: { name: "Довга дистанція", description: "500 раундів тренування.", bildbeschreibung: "людина, що біжить" },
  // Як „Тисяча й одна ніч".
  tausendsassa: { name: "Тисяча й один раунд", nameNeutral: "Тисяча раундів", description: "1 000 раундів тренування.", bildbeschreibung: "кит, що пускає фонтан" },
  // ── Натискання ───────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Тигр тисячі клавіш", nameNeutral: "Тисяча правильних натискань", description: "1 000 правильних натискань.", bildbeschreibung: "голова тигра" },
  "tasten-t-rex": { name: "Клавішний тиранозавр", nameNeutral: "Десять тисяч правильних натискань", description: "10 000 правильних натискань.", bildbeschreibung: "тиранозавр" },
  // Nicht „ракета" (Kriegswort, Glossar §2.4).
  "galaktische-fingerspitzen": { name: "Галактичні пальці", description: "50 000 правильних натискань.", bildbeschreibung: "космічний корабель, що злітає" },
  "hunderttausend-held": { name: "Сто тисяч блискавок", nameNeutral: "Сто тисяч правильних натискань", description: "100 000 правильних натискань.", bildbeschreibung: "жовта блискавка" },
  viertelmillion: { name: "Чверть мільйона", description: "250 000 правильних натискань - стільки літер у цілій книжці.", bildbeschreibung: "супутник" },
  // ── Наполегливість ───────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Наполегливий борсук", nameNeutral: "Наполегливість", description: "3 різні дні тренувань.", bildbeschreibung: "борсук" },
  gewohnheitstier: { name: "Вірна черепаха", description: "7 різних днів тренувань.", bildbeschreibung: "черепаха" },
  "wie-ein-uhrwerk": { name: "Як годинник", description: "20 різних днів тренувань.", bildbeschreibung: "червоний будильник" },
  unaufhaltsam: { name: "Нестримно", description: "50 різних днів тренувань.", bildbeschreibung: "гора зі сніговою вершиною" },
  "tief-verwurzelt": { name: "Глибоке коріння", description: "100 різних днів тренувань.", bildbeschreibung: "велике зелене листяне дерево" },
  // Glossar §2.4: „Міцність скелі", nicht „Твердий як скеля" (Adjektiv am Kind, gegendert).
  "fels-in-der-brandung": { name: "Міцність скелі", description: "200 різних днів тренувань - майже кожен день навчального року.", bildbeschreibung: "кам'яна статуя з острова Пасхи" },
  // ── Тижні тренувань ──────────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Уже чверть року", description: "12 різних тижнів тренувань.", bildbeschreibung: "брунатний осінній листок" },
  "halbes-jahr-dabei": { name: "Уже пів року", description: "26 різних тижнів тренувань.", bildbeschreibung: "хмара, з якої падає сніг" },
  // 52 ist „few" ⇒ „52 різні тижні".
  "ganzes-jahr-dabei": { name: "Цілий рік", description: "52 різні тижні тренувань.", bildbeschreibung: "святковий торт зі свічкою" },
  // ── Зірки ────────────────────────────────────────────────────────────────
  sternschnuppe: { name: "Падаюча зірка", description: "Перший раунд на 3 зірки.", bildbeschreibung: "падаюча зірка в нічному небі" },
  "sternen-sammler": { name: "Жменька зірок", description: "10 раундів на 3 зірки.", bildbeschreibung: "сяйлива жовта зірка" },
  sternenhimmel: { name: "Зоряне небо", description: "30 раундів на 3 зірки.", bildbeschreibung: "Чумацький Шлях у нічному небі" },
  sternenmeer: { name: "Море зірок", description: "75 раундів на 3 зірки.", bildbeschreibung: "помаранчева восьмикутна зірка" },
  // ── Уроки ────────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "Лев уроків", nameNeutral: "П'ять уроків", description: "5 завершених уроків.", bildbeschreibung: "лев" },
  "kapitel-kaeptn": { name: "Повний вперед", description: "15 завершених уроків.", bildbeschreibung: "якір" },
  "lehrgangs-legende": { name: "Легенда курсу", description: (z) => `Завершено всі уроки курсу (разом ${lektionenFuer(z.lernweg).length}).`, bildbeschreibung: "золотий кубок" },
  // ── Рівні (коло балів) ───────────────────────────────────────────────────
  "kletter-koala": { name: "Коала на дереві", nameNeutral: "Рівень 5", description: "Досягнуто рівня 5 у колі балів.", bildbeschreibung: "коала" },
  "punkte-rakete": { name: "Повітряна кулька балів", description: "Досягнуто рівня 10 у колі балів.", bildbeschreibung: "червона повітряна кулька" },
  "gipfel-gaemse": { name: "Сарна на вершині", nameNeutral: "Рівень 20", description: "Досягнуто рівня 20 у колі балів.", bildbeschreibung: "гірська сарна" },
  hoehenflug: { name: "Високий політ", nameNeutral: "Рівень 50", description: "Досягнуто рівня 50 у колі балів.", bildbeschreibung: "гелікоптер" },
  "ueber-den-wolken": { name: "Над хмарами", nameNeutral: "Рівень 100", description: "Досягнуто рівня 100 у колі балів.", bildbeschreibung: "літаюча тарілка" },
  sternenreise: { name: "Подорож до зірок", nameNeutral: "Рівень 200", description: "Досягнуто рівня 200 у колі балів.", bildbeschreibung: "комета з довгим хвостом" },
  // ── Світ клавіатури ──────────────────────────────────────────────────────
  // Die Grundreihe DES WEGES - auf Weg „uk" а о в л і д п р; ohne feste Zahl (sie ist je Weg verschieden).
  "grundstellungs-gorilla": {
    name: "Горила основного ряду",
    nameNeutral: "Увесь основний ряд",
    description: (z) =>
      `Відкрито всі клавіші основного положення: ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "горила",
  },
  "gross-baumeister": { name: "Будівля з великих літер", nameNeutral: "Великі літери", description: "Клавішу Shift опановано - справжні великі літери власними пальцями.", bildbeschreibung: "чотири великі літери на синіх клавішах" },
  // ⚠️ „puenktchen-panda" und „schlangen-s" gibt es auf Weg „uk" nicht zu verdienen - das Regal beschreibt trotzdem jedes.
  "puenktchen-panda": { name: "Панда в цяточку", nameNeutral: "Німецькі умлаути", description: "Відкрито літери ä, ö і ü - німецькі літери з крапками.", bildbeschreibung: "панда" },
  "schlangen-s": { name: "Зміїне S", nameNeutral: "Німецьке гостре s", description: "Відкрито ß, німецьке гостре s - останню літеру німецької клавіатури.", bildbeschreibung: "змія" },
  "alphabet-as": { name: "Уся абетка", description: "Відкрито всі літери абетки.", bildbeschreibung: "малі літери на синіх клавішах" },
  "punkt-und-komma": { name: "Крапка і кома", description: "Відкрито крапку і кому - перші справжні розділові знаки.", bildbeschreibung: "чорна ручка" },
  "satzzeichen-sammler": { name: "Збірка знаків", nameNeutral: "Усі розділові знаки", description: "Відкрито розділові знаки: . , - ? ! : ;", bildbeschreibung: "великий червоний знак оклику" },
  "zahlen-zebra": { name: "Зебра цифр", nameNeutral: "Половина цифр", description: "Відкрито п'ять цифр із ряду цифр.", bildbeschreibung: "зебра" },
  "zahlen-zauberer": { name: "Чарівні цифри", nameNeutral: "Увесь ряд цифр", description: "Відкрито всі цифри від 1 до 0 - увесь ряд цифр.", bildbeschreibung: "синя клавіша з числом десять" },
  "klammer-krokodil": { name: "Крокодил у дужках", nameNeutral: "Ліва і права дужка", description: "Відкрито дужки ( ) - перші символи.", bildbeschreibung: "крокодил" },
  "alltags-ass": { name: "Знаки на кожен день", nameNeutral: "Щоденні знаки", description: (z) => `Відкрито: ${alltagsZeichen(z)} - знаки з електронної пошти та зі світу грошей.`, bildbeschreibung: "конверт" },
  "tastatur-krone": { name: "Корона клавіатури", nameNeutral: "Уся клавіатура", description: "Відкрито ВСІ клавіші клавіатури - аж до останнього символу.", bildbeschreibung: "золота корона" },
  // ── Вийшло! ──────────────────────────────────────────────────────────────
  "feste-burg": { name: "Мій дім - моя фортеця", nameNeutral: "Основний ряд упевнений", description: "Усі клавіші основного положення впевнені.", bildbeschreibung: "будинок" },
  "buchstaben-baendiger": { name: "Приборкані літери", nameNeutral: "Усі літери впевнені", description: "Кожна літера впевнена - жодна вже не непевна.", bildbeschreibung: "червоний квадрат із великою А" },
  "zahlen-fels": { name: "Цифри як скеля", nameNeutral: "Усі цифри впевнені", description: "Увесь ряд цифр упевнений.", bildbeschreibung: "рахівниця з кольоровими кульками" },
  "nichts-wackelt": { name: "Ніщо не хитається", description: "Кожна клавіша клавіатури впевнена - уся клавіатура, а не лише відкриті клавіші.", bildbeschreibung: "синій ромб із крапкою посередині" },
  // ── Швидкість (знаків за хвилину, Regel 6) ───────────────────────────────
  "flinker-fuchs": { name: "Спритна лисиця", nameNeutral: "Швидко і точно", description: "Потрібна швидкість І точність щонайменше 95% - швидкість рахується, лише коли друк точний.", bildbeschreibung: "лисиця" },
  "tempo-60": { name: "Стрибучий заєць", nameNeutral: "60 за хвилину, точно", description: "Раунд зі швидкістю 60 знаків за хвилину і точністю щонайменше 95%.", bildbeschreibung: "заєць" },
  "tempo-90": { name: "Прудка козуля", nameNeutral: "90 за хвилину, точно", description: "Раунд зі швидкістю 90 знаків за хвилину і точністю щонайменше 95%.", bildbeschreibung: "козуля" },
  "tempo-120": { name: "Кінь учвал", nameNeutral: "120 за хвилину, точно", description: "Раунд зі швидкістю 120 знаків за хвилину і точністю щонайменше 98%.", bildbeschreibung: "кінь, що мчить учвал" },
  "tempo-160": { name: "Паротяг", nameNeutral: "160 за хвилину, точно", description: "Раунд зі швидкістю 160 знаків за хвилину і точністю щонайменше 98%.", bildbeschreibung: "паротяг" },
  "tempo-200": { name: "Швидкий потяг", nameNeutral: "200 за хвилину, точно", description: "Раунд зі швидкістю 200 знаків за хвилину і точністю щонайменше 98%.", bildbeschreibung: "швидкий потяг" },
  "tempo-300": { name: "Швидкий літак", nameNeutral: "300 за хвилину, точно", description: "Раунд зі швидкістю 300 знаків за хвилину і точністю щонайменше 99% - професійний рівень.", bildbeschreibung: "маленький літак" },
  // ── На одному диханні ────────────────────────────────────────────────────
  "kette-100": { name: "Ланцюгова реакція", nameNeutral: "100 поспіль", description: "100 правильних натискань поспіль, без жодної помилки.", bildbeschreibung: "дві ланки ланцюга" },
  "kette-250": { name: "Без запинки", description: "250 правильних натискань поспіль.", bildbeschreibung: "ланцюг із кількох ланок" },
  "kette-500": { name: "Червона нитка", nameNeutral: "500 поспіль", description: "500 правильних натискань поспіль - більше, ніж цілий раунд.", bildbeschreibung: "котушка з ниткою" },
  "kette-1000": { name: "Тисяча без помилки", description: "1 000 правильних натискань поспіль.", bildbeschreibung: "гора Фудзі зі сніговою вершиною" },
  "kette-2000": { name: "Залізний ланцюг", nameNeutral: "2 000 поспіль", description: "2 000 правильних натискань поспіль - чотири-п'ять раундів без найменшої зупинки.", bildbeschreibung: "вулкан, з якого тече лава" },
  // ── Пригоди (гра „Крижини", Glossar §2.3) ────────────────────────────────
  "erste-expedition": { name: "Перша експедиція", description: "Перша пригода на Крижинах у вільній грі - аж до іглу.", bildbeschreibung: "компас" },
  // Nicht „Полярник" (Personenwort, männlich).
  polarforscher: { name: "Полярні відкриття", description: "10 завершених пригод на Крижинах у вільній грі.", bildbeschreibung: "сніжинка" },
  "eismeer-legende": { name: "Легенда крижаного моря", description: "30 завершених пригод на Крижинах у вільній грі.", bildbeschreibung: "висока синя хвиля" },
  "packeis-profi": { name: "Паковий лід підкорено", nameNeutral: "60 пригод", description: "60 завершених пригод на Крижинах у вільній грі.", bildbeschreibung: "валіза" },
  // ── Пригодницькі трюки ───────────────────────────────────────────────────
  // „Фрак" - das ist der Pinguin selbst.
  "trockener-frack": { name: "Сухий фрак", description: "Ціла пригода без жодного падіння у воду чи в сніг.", bildbeschreibung: "чорний циліндр" },
  "immer-trocken": { name: "Завжди сухо", description: (z) => `${uk(z.trockeneAbenteuer, "пригода", "пригоди", "пригод", "пригоди")} без жодного падіння у воду.`, bildbeschreibung: "складена парасолька" },
  fischfaenger: { name: "Добрий улов", description: (z) => `${uk(z.fische, "бонусна рибка", "бонусні рибки", "бонусних рибок", "бонусної рибки")} на Крижинах.`, bildbeschreibung: "синя риба" },
  // ── Експедиція (Zonennamen wie im Spiel, Glossar §2.3) ───────────────────
  "hoehlen-lauscher": { name: "Слух кажана", description: "Уся Печера відлуння до виходу - у темряві, лише на слух.", bildbeschreibung: "кажан" },
  "sturm-trotzer": { name: "Хуртовину подолано", description: "Хуртовину подолано - послідовності знаків, надруковані напам'ять.", bildbeschreibung: "обличчя, що дме вітер" },
  // Glossar §2.3: nicht „по рації" (Lehnfügung).
  "funker-freund": { name: "Голоси з рації", description: "Ціле радіоповідомлення розшифровано й надіслано на Полярну станцію.", bildbeschreibung: "радіоприймач" },
  "polarlicht-entdecker": { name: "Під полярним сяйвом", description: "Уся Полярна експедиція без жодної помилки - полярне сяйво танцює.", bildbeschreibung: "зірка з хвостом іскор" },
  // ── Історії ──────────────────────────────────────────────────────────────
  "lese-luchs": { name: "Читацька рись", nameNeutral: "Перша історія", description: "Першу історію прочитано й надруковано до кінця.", bildbeschreibung: "леопард" },
  buecherwurm: { name: "Книжковий черв'як", description: "3 історії, прочитані до кінця.", bildbeschreibung: "зелена гусениця" },
  "buecherei-baer": { name: "Бібліотечний ведмідь", nameNeutral: "Вісім історій", description: "8 історій, прочитаних до кінця.", bildbeschreibung: "ведмідь" },
  vielleser: { name: "Гора книжок", description: "15 історій, прочитаних до кінця.", bildbeschreibung: "стос кольорових книжок" },
  // ── Час читання (частина = Teil einer Geschichte) ────────────────────────
  "seiten-spatz": { name: "Горобчик першої сторінки", nameNeutral: "Перша сторінка", description: "Першу частину історії надруковано.", bildbeschreibung: "маленька синя пташка" },
  "kapitel-krake": { name: "Начитаний восьминіг", nameNeutral: "Десять частин", description: "10 частин, прочитаних і надрукованих.", bildbeschreibung: "восьминіг" },
  "geschichten-gigant": { name: "Слонова порція історій", description: "30 частин, прочитаних і надрукованих.", bildbeschreibung: "слон" },
  leseratte: { name: "Читання без кінця", nameNeutral: "75 частин", description: "75 частин, прочитаних і надрукованих.", bildbeschreibung: "сувій пергаменту" },
  // ── Читацькі трюки ───────────────────────────────────────────────────────
  federleicht: { name: "Легко, як пір'їнка", description: "Цілу частину надруковано без жодної помилки.", bildbeschreibung: "біла пір'їнка" },
  // Nicht „На одному диханні" - so heisst schon die Familie „Am Stück".
  "in-einem-rutsch": { name: "За один присід", description: "Цілу історію прочитано до кінця за один день.", bildbeschreibung: "синя спіраль" },
  "lesezeichen-held": { name: "Закладка на своєму місці", description: "Читання в інший день саме з того місця, де зупинилося.", bildbeschreibung: "закладка для книжки" },
  // ── Майстерність (nie „іспит") ───────────────────────────────────────────
  "zehn-minuten-abschrift": { name: "Десятихвилинне списування", description: "Десять хвилин списування тексту без перерви і щонайбільше 0,5% помилок - як на справжньому змаганні.", bildbeschreibung: "секундомір" },
  "lehrgangs-meister": { name: "Курс опановано", description: (z) => `Завершено всі уроки курсу, кожен на три зірки (разом ${lektionenFuer(z.lernweg).length}).`, bildbeschreibung: "чорна випускна шапочка" },
  "goldene-tastatur": { name: "Золота клавіатура", description: "Усі клавіші відкриті й упевнені - і ще один раз 160 знаків за хвилину з точністю 98%. Остання медаль.", bildbeschreibung: "спортивна медаль на стрічці" },
  // ── Таємні ───────────────────────────────────────────────────────────────
  "gemuetliches-faultier": { name: "Неквапливий лінивець", description: "Повільно, зате без жодної помилки - точність важливіша за швидкість!", bildbeschreibung: "лінивець" },
  "comeback-kaenguru": { name: "Стрибок кенгуру", description: "Раунд на 3 зірки одразу після раунду на 1 зірку.", bildbeschreibung: "кенгуру" },
  // Uhrzeiten in Worten.
  nachteule: { name: "Нічна сова", description: "Раунд, завершений після дев'ятої вечора.", bildbeschreibung: "сова" },
  "frueher-vogel": { name: "Рання пташка", description: "Раунд, завершений до сьомої ранку.", bildbeschreibung: "півень" },
  nimmersatt: { name: "Голод до читання", description: "3 частини історії за один день.", bildbeschreibung: "зелене яблуко" },
  "ferien-held": { name: "Канікули з клавіатурою", description: "Тренування під час літніх канікул - у липні чи серпні.", bildbeschreibung: "пляж із парасолькою" },
  "wochenend-schreiber": { name: "Друк у вихідні", description: "Тренування і в суботу, і в неділю.", bildbeschreibung: "аркуш календаря" },
  "zurueck-im-sattel": { name: "Знову в сідлі", description: (z) => `Повернення до тренувань після перерви, довшої за ${uk(z.pauseTage, "день", "дні", "днів", "дня")} - і повернення рахується.`, bildbeschreibung: "дві стрілки по колу" },
  "doppelt-genaeht": { name: "Двічі чисто", description: "Два раунди без помилки один за одним.", bildbeschreibung: "голка з ниткою" },
  winterkind: { name: "Зимові клавіші", description: "Тренування посеред зими - у грудні чи січні.", bildbeschreibung: "сніговик" },
  jahreswechsel: { name: "Новий рік", description: "Тренування в останній день року або в перший день нового.", bildbeschreibung: "феєрверк у нічному небі" },
  "tages-marathon": { name: "Марафон одного дня", description: "Десять раундів за один день.", bildbeschreibung: "людина на скаковому коні" },
  sternentag: { name: "Зоряний день", description: "Три раунди на три зірки за один день.", bildbeschreibung: "сонце з обличчям" },
  // „Як з голочки" = blitzsauber.
  blitzsauber: { name: "Як з голочки", description: "Три раунди без помилки за один день.", bildbeschreibung: "мило з піною" },
  "volle-woche": { name: "Повний тиждень", description: "П'ять різних днів тренувань за ОДИН тиждень.", bildbeschreibung: "зелена книжка" },
  // „Blindflug" ⇒ „Не дивлячись" (Regel 4: nie „сліпий").
  blindflug: { name: "Не дивлячись", description: "Цілий раунд без помилки - із прихованою екранною клавіатурою. Саме про це десятипальцевий метод.", bildbeschreibung: "мавпочка, що закриває очі" },
  sprachwechsler: { name: "Подорож між мовами", description: "Тренування двома мовами - наприклад українською та англійською.", bildbeschreibung: "глобус з Європою та Африкою" },
  lesenacht: { name: "Читання вночі", description: "Частину історії прочитано після восьмої вечора.", bildbeschreibung: "місяць з обличчям" },
  "zaehe-taste": { name: "Вперта клавіша", description: "Клавіша, яка довго не слухалася, тепер упевнена.", bildbeschreibung: "равлик" },
  aufsteiger: { name: "Угору", description: "На п'ять рівнів складності вище за точку старту.", bildbeschreibung: "графік із лінією, що росте" },
  // ── Nur auf Weg „fr" (`badgesNurFr.ts`) - für eine ukrainische Bedienung auf diesem Weg.
  "akzente-ziffernreihe": { name: "Акробатика акцентів", nameNeutral: "é, è, ç і à", description: "Відкрито літери é, è, ç і à - літери, що живуть на ряду цифр.", bildbeschreibung: "цифри 1 2 3 4 на синій клавіші" },
  "accent-circonflexe": { name: "Дашок", nameNeutral: "Французький дашок", description: "Мертва клавіша ^ упевнена: ê, â, î, ô і û.", bildbeschreibung: "солом'яний капелюх зі стрічкою" },
  trema: { name: "Сонечко з двома крапками", nameNeutral: "Дві крапки", description: "Мертва клавіша ¨ упевнена: ë, ï і ü.", bildbeschreibung: "сонечко" },
};
