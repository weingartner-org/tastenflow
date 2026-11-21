/**
 * Korpus des Weges „uk" (Ukrainisch), Charge 1 - Erwachsene (K-UK, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
 *
 * Quelle: iCloud `sprachen-2026-10-25/texte-charge-1/uk.jsonl` (je Altersgruppe 30 Sätze und 10 Absätze, neu in der
 * Sprache verfasst, `quelle: "eigen"`), geprüft von einem zweiten Prüfer (`PRUEFBERICHT-uk.md`: freigabefähig).
 * Der Text ist unverändert übernommen. Zuordnung: `alter` ⇒ `stufen`, `thema` ⇒ `topic`, `weg` ⇒ `nurWeg`; die Kennung
 * der Quelle steht als Kommentar hinter jeder Zeile.
 *  · Absätze (`art: "absatz"`) sind an den Satzgrenzen in ihre Sätze geteilt (`<id>.1`, `<id>.2` …): Korpus-Zeilen sind einzelne
 *    Übungszeilen (die längste der acht Wege davor hat 130 Zeichen), mehrsätzige Geschichten sind Serien. Kein Wort geändert.
 *  · Selbst verfasst ⇒ ohne `herkunft` (wie die Chargen von it/pl/tr/cs; `herkunft` ist für ÜBERNOMMENE Texte).
 *  · `minTier` = `minTierFor(text, "uk")` nach der eigenen Lern-Folge des Weges (`lernweg.ts`, F4), Bezugstastatur `ua`.
 * Wächter: `tests/tastenflow-texte-uk-charge1.test.ts`. Nur HINTEN anhängen (Anker, `corpusUk.ts`).
 *
 * ⚠️ DATENBLATT: nur `import type` (`scripts/buendel-aufteilung.ts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_UK_WEG_CHARGE1_ERWACHSENE: CorpusItem[] = [
  { text: "Запишіться до сімейного лікаря заздалегідь, і вам запропонують зручний час.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Gesundheit" }, // uk-c1-081
  { text: "Після роботи Ірина ходить на курси німецької мови й щодня вчить нові слова.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Sprachen" }, // uk-c1-082
  { text: "Ольга незряча й перевіряє, чи зручні сайти для програм екранного доступу.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-083
  { text: "Завдяки сусідові Андрію, який пересувається на кріслі колісному, біля під'їзду з'явився пандус.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Wohnen" }, // uk-c1-084
  { text: "У п'ятницю ми з колегами обговорили план на місяць і розподілили завдання.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-085
  { text: "Щонеділі Микола пече хліб на заквасці, а вся родина чекає першої скибки.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Alltag/Essen" }, // uk-c1-086
  { text: "На пошті ви можете надіслати посилку й одразу оплатити її карткою.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Post" }, // uk-c1-087
  { text: "Лікарка порадила більше ходити пішки й пити воду протягом дня.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Gesundheit" }, // uk-c1-088
  { text: "Цього місяця за комунальні послуги ми заплатили 2 400 грн.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "uk", topic: "Wohnen" }, // uk-c1-089
  { text: "Тетяна відкрила невелику майстерню й ремонтує велосипеди.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-090
  { text: "Історичний центр Львова входить до списку світової спадщини ЮНЕСКО з 1998 року.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "uk", topic: "Kultur" }, // uk-c1-091
  { text: "У Тернополі Василь працює бухгалтером, а ввечері співає в хорі.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit/Kultur" }, // uk-c1-092
  { text: "Дерев'яні церкви Карпатського регіону внесено до списку світової спадщини ЮНЕСКО.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur" }, // uk-c1-093
  { text: "Галина працює в пекарні в Ужгороді й щоранку випікає хліб із висівками.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-094
  { text: "У Яремчі ми з чоловіком винайняли квартиру з видом на гори.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "uk", topic: "Wohnen" }, // uk-c1-095
  { text: "Софійський собор у Києві входить до списку світової спадщини ЮНЕСКО.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur" }, // uk-c1-096
  { text: "Оксана працює медсестрою в Черкасах і у вихідні бігає вздовж Дніпра.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit/Gesundheit" }, // uk-c1-097
  { text: "У житомирській бібліотеці ми щосереди граємо з сусідами в настільні ігри.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Alltag" }, // uk-c1-098
  { text: "В Одесі Ганна працює архітекторкою й реставрує фасади старих будинків.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-099
  { text: "На ринку в Миколаєві ми купили кавун, абрикоси й свіжу зелень.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Alltag/Essen" }, // uk-c1-100
  { text: "Рибалка Петро живе біля моря під Одесою і щоранку виходить у море на човні.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-101
  { text: "Ми винайняли невеликий будиночок біля моря й щовечора гуляємо берегом.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Alltag" }, // uk-c1-102
  { text: "Інструкторка з плавання на пляжі біля Одеси вчить дорослих упевнено триматися на воді.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Sport/Arbeit" }, // uk-c1-103
  { text: "Козацькі пісні Дніпропетровщини внесено до списку нематеріальної спадщини ЮНЕСКО.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur" }, // uk-c1-104
  { text: "У Харкові Дмитро викладає в університеті й керує студентським театром.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit/Kultur" }, // uk-c1-105
  { text: "У Дніпрі моя сестра працює програмісткою й навчає дітей створювати сайти.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-106
  { text: "На Чернігівщині Віра вирощує яблука й продає сік на ярмарку.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit/Garten" }, // uk-c1-107
  { text: "У Сумах ми записалися на курси кераміки, які відбуваються щочетверга.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur/Alltag" }, // uk-c1-108
  { text: "На Поліссі ми з чоловіком збирали журавлину на болоті.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "uk", topic: "Natur" }, // uk-c1-109
  { text: "Юрій незрячий і щотижня бере в бібліотеці в Чернігові нові аудіокниги.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur" }, // uk-c1-110
  { text: "Минулого тижня я почала працювати в новій компанії.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-111.1
  { text: "Перші дні були непрості: нові програми, нові імена, інший ритм.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-111.2
  { text: "Але колеги терпляче все пояснювали, а наставниця щодня питала, чи все зрозуміло.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-111.3
  { text: "Тепер я знаю, де стоїть кавоварка, і вже сама веду невеликий проєкт.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-111.4
  { text: "Сьогодні мені прийшов лист: час записатися до лікаря на щорічний огляд.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Gesundheit/Behörden" }, // uk-c1-112.1
  { text: "Я зателефонувала до поліклініки й обрала зручний час, у вівторок о пів на дев'яту.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Gesundheit/Behörden" }, // uk-c1-112.2
  { text: "Медсестра нагадала взяти з собою медичну картку.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Gesundheit/Behörden" }, // uk-c1-112.3
  { text: "Тепер запис стоїть у моєму календарі, і я можу більше про це не думати.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Gesundheit/Behörden" }, // uk-c1-112.4
  { text: "ЮНЕСКО визнало культуру приготування українського борщу нематеріальною культурною спадщиною.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur/Essen" }, // uk-c1-113.1
  { text: "У кожній родині свій рецепт: хтось додає квасолю, хтось чорнослив, а хтось гриби.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur/Essen" }, // uk-c1-113.2
  { text: "У нас борщ варить чоловік, і він ніколи не каже, скільки кладе часнику.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur/Essen" }, // uk-c1-113.3
  { text: "Мовляв, це сімейна таємниця.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur/Essen" }, // uk-c1-113.4
  { text: "Наш новий колега Святослав незрячий і працює програмістом.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-114.1
  { text: "Він користується програмою екранного доступу, яка читає вголос текст з екрана, і друкує, не дивлячись на клавіатуру.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-114.2
  { text: "На нарадах Святослав часто помічає те, що інші пропустили.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-114.3
  { text: "Тепер ми всі додаємо підписи до малюнків у файлах, і це зручно кожному.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-114.4
  { text: "На вихідних ми поїхали до Львова.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur/Reisen" }, // uk-c1-115.1
  { text: "Зранку гуляли бруківкою старого центру й зазирали в тихі дворики.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur/Reisen" }, // uk-c1-115.2
  { text: "Потім довго сиділи в кав'ярні й дивилися, як повз вікно проїжджає трамвай.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur/Reisen" }, // uk-c1-115.3
  { text: "Увечері пішли на концерт камерної музики в невеликому залі.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur/Reisen" }, // uk-c1-115.4
  { text: "У гуцульському Косові я записалася на заняття з розпису кераміки.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur" }, // uk-c1-116.1
  { text: "Майстриня показала, як наносити візерунок тонким пензлем на глиняний глечик.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "uk", topic: "Kultur" }, // uk-c1-116.2
  { text: "Мій перший глечик вийшов трохи кривим, але дуже веселим.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur" }, // uk-c1-116.3
  { text: "Косівську мальовану кераміку внесено до списку нематеріальної спадщини ЮНЕСКО.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur" }, // uk-c1-116.4
  { text: "Ми переїхали в нову квартиру у Вінниці.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Wohnen" }, // uk-c1-117.1
  { text: "Перший тиждень розбирали коробки й купували лампи.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Wohnen" }, // uk-c1-117.2
  { text: "Сусідка знизу принесла домашній пиріг, а сусід зверху допоміг повісити полиці.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Wohnen" }, // uk-c1-117.3
  { text: "Тепер щоп'ятниці ми разом п'ємо чай на подвір'ї, поки діти катаються на самокатах.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Wohnen" }, // uk-c1-117.4
  { text: "В Одесі є невеликий ринок, куди я ходжу щосуботи.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Alltag/Essen" }, // uk-c1-118.1
  { text: "Продавчиня Людмила вже знає, що я беру помідори, зелень і бринзу.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Alltag/Essen" }, // uk-c1-118.2
  { text: "Ми завжди трохи розмовляємо про погоду й рецепти.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Alltag/Essen" }, // uk-c1-118.3
  { text: "Минулого разу вона порадила мені, як засолити огірки, щоб вони були хрусткими.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Alltag/Essen" }, // uk-c1-118.4
  { text: "Ранок на узбережжі біля Одеси починається тихо.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Sport/Alltag" }, // uk-c1-119.1
  { text: "Рибалки перевіряють сітки, а над водою кружляють чайки.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Sport/Alltag" }, // uk-c1-119.2
  { text: "Я виходжу на пробіжку берегом і рахую кроки до старого пірсу.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Sport/Alltag" }, // uk-c1-119.3
  { text: "Потім сідаю на пісок, п'ю воду й дивлюся, як сонце піднімається над морем.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Sport/Alltag" }, // uk-c1-119.4
  { text: "У Петриківці я відвідала майстерню, де розписують дерев'яні скриньки.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur" }, // uk-c1-120.1
  { text: "Майстриня малювала квіти тонким пензликом, а деякі пелюстки просто пальцем.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur" }, // uk-c1-120.2
  { text: "Потім вона дала мені пензлик, і я намалювала свою першу калину.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur" }, // uk-c1-120.3
  { text: "Я купила маленьку тарілку й повісила її на кухні.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "uk", topic: "Kultur" }, // uk-c1-120.4
];
