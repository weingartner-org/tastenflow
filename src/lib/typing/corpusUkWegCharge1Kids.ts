/**
 * Korpus des Weges „uk" (Ukrainisch), Charge 1 - Kinder (K-UK, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_UK_WEG_CHARGE1_KIDS: CorpusItem[] = [
  { text: "Марійка сама поливає квіти на підвіконні в нашому класі.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Pflanzen/Schule" }, // uk-c1-001
  { text: "На перерві ми граємо в класики біля шкільного ґанку.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Pause/Spiel" }, // uk-c1-002
  { text: "Мій кіт любить спати на теплому светрі біля вікна.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Tiere" }, // uk-c1-003
  { text: "Тато пече млинці, а я мию полуницю для начинки.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Essen" }, // uk-c1-004
  { text: "На Різдво ми всією родиною ліпимо вареники й співаємо колядки.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Feste" }, // uk-c1-005
  { text: "Злата читає казки шрифтом Брайля, ведучи пальцями по рядках.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Schule" }, // uk-c1-006
  { text: "Перед Великоднем я сама розписую писанку воском і фарбами.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Feste" }, // uk-c1-007
  { text: "У суботу ми з сестрою граємо в настільну гру аж до обіду.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Spiel/Familie" }, // uk-c1-008
  { text: "Наш пес Бровко приносить м'ячик і чекає, поки я його кину.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Tiere" }, // uk-c1-009
  { text: "Учителька дала нам завдання: знайти п'ять слів на літеру ї.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Schule" }, // uk-c1-010
  { text: "Тарас їде на кріслі колісному до дошки й розв'язує приклад.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Schule" }, // uk-c1-011
  { text: "У Львові ми з татом їдемо трамваєм до площі Ринок.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Stadt" }, // uk-c1-012
  { text: "Улітку ми з бабусею збираємо чорниці в лісі на Волині.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Natur" }, // uk-c1-013
  { text: "Ярина з Рівного малює їжачка й дарує малюнок другові.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Freundschaft" }, // uk-c1-014
  { text: "У Карпатах ми з братом дивилися, як вівці пасуться на полонині.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Tiere/Natur" }, // uk-c1-015
  { text: "Бабуся в Яремчі варить банош, а я помішую його дерев'яною ложкою.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Essen" }, // uk-c1-016
  { text: "Найвища гора України називається Говерла, і ми хочемо на неї піднятися.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Natur" }, // uk-c1-017
  { text: "У Києві ми гуляли берегом Дніпра й рахували качок на воді.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Natur/Tiere" }, // uk-c1-018
  { text: "У Житомирі моя подруга Соломія сама доглядає кролика.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Tiere" }, // uk-c1-019
  { text: "Улітку під Миколаєвом ми їли солодкі кавуни просто на баштані.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Essen" }, // uk-c1-020
  { text: "В Одесі ми з дідусем спускалися сходами аж до самого моря.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Stadt" }, // uk-c1-021
  { text: "У нашому одеському дворі росте виноград, і восени сусіди частують ним усіх дітей.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Garten" }, // uk-c1-022
  { text: "Біля Чорного моря я збирала мушлі й складала їх у коробку.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Meer" }, // uk-c1-023
  { text: "Чайки кружляють над хвилями, а ми ліпимо з мокрого піску кота.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Meer/Spiel" }, // uk-c1-024
  { text: "У Харкові ми з класом гуляли парком і збирали каштани.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Natur/Schule" }, // uk-c1-025
  { text: "Майстриня з Петриківки вчить мене малювати квіти пензликом.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Kunst" }, // uk-c1-026
  { text: "У Дніпрі ми з сестрою каталися на велосипедах набережною.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Sport/Familie" }, // uk-c1-027
  { text: "На Поліссі ми з дідусем шукали гриби й назбирали повний кошик.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Natur" }, // uk-c1-028
  { text: "Біля нашої хати на Чернігівщині лелеки звили велике гніздо.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Tiere" }, // uk-c1-029
  { text: "Дідусь на Сумщині тримає бджіл, а я допомагаю йому розливати мед.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Tiere/Essen" }, // uk-c1-030
  { text: "Сьогодні в класі ми вчилися друкувати десятьма пальцями.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Schule" }, // uk-c1-031.1
  { text: "Спочатку я поклав руки на середній ряд і знайшов маленькі горбики на клавішах.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Schule" }, // uk-c1-031.2
  { text: "Потім я надрукував своє ім'я, не дивлячись на клавіатуру.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Schule" }, // uk-c1-031.3
  { text: "Учитель сказав, що в мене гарно виходить.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Schule" }, // uk-c1-031.4
  { text: "У неділю вся родина готує сирники.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Familie/Essen" }, // uk-c1-032.1
  { text: "Мама розбиває яйця, тато просіює борошно, а я змішую сир із цукром.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Familie/Essen" }, // uk-c1-032.2
  { text: "Молодша сестричка викладає ягоди на тарілку.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Familie/Essen" }, // uk-c1-032.3
  { text: "Потім ми сідаємо за стіл і довго сміємося, бо в кожного вуса з цукрової пудри.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Familie/Essen" }, // uk-c1-032.4
  { text: "У моєї тітки Софії порушення зору.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Tiere/Familie" }, // uk-c1-033.1
  { text: "Її собака Лада спеціально навчена й допомагає їй переходити вулицю.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Tiere/Familie" }, // uk-c1-033.2
  { text: "Коли Лада працює, її не можна гладити.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Tiere/Familie" }, // uk-c1-033.3
  { text: "А ввечері ми граємося з нею в саду, і тоді Лада радо підставляє вухо.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Tiere/Familie" }, // uk-c1-033.4
  { text: "На перерві ми з друзями вигадали нову гру.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "uk", topic: "Spiel" }, // uk-c1-034.1
  { text: "Хтось називає тварину, а інші показують її без слів.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Spiel" }, // uk-c1-034.2
  { text: "Назар стрибав, як жабка, а Устина повільно повзла, як равлик.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "uk", topic: "Spiel" }, // uk-c1-034.3
  { text: "Ми так сміялися, що ледве почули дзвоник на урок.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Spiel" }, // uk-c1-034.4
  { text: "У Львові є стара площа Ринок.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Stadt" }, // uk-c1-035.1
  { text: "Ми з мамою прийшли туди в суботу зранку.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Stadt" }, // uk-c1-035.2
  { text: "Я рахувала кольорові будинки, а мама фотографувала вітрини.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Stadt" }, // uk-c1-035.3
  { text: "Потім ми зайшли в маленьку кав'ярню, і мені дали какао з корицею.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Stadt" }, // uk-c1-035.4
  { text: "Історичний центр Львова внесено до списку світової спадщини ЮНЕСКО.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Stadt" }, // uk-c1-035.5
  { text: "Улітку ми з татом пішли в карпатський ліс.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Natur" }, // uk-c1-036.1
  { text: "Там ростуть високі буки з гладенькою сірою корою.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Natur" }, // uk-c1-036.2
  { text: "Я обійняв одне дерево, але мої руки не зійшлися.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Natur" }, // uk-c1-036.3
  { text: "Тато розповів, що букові ліси Карпат внесено до списку світової спадщини ЮНЕСКО.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Natur" }, // uk-c1-036.4
  { text: "На день народження бабусі ми купили київський торт.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Familie/Essen" }, // uk-c1-037.1
  { text: "Він із горішками й кремом.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Familie/Essen" }, // uk-c1-037.2
  { text: "Я сама несла коробку від крамниці до самого дому і дуже обережно йшла сходами.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Familie/Essen" }, // uk-c1-037.3
  { text: "Бабуся сказала, що це найсмачніший торт у Києві.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Familie/Essen" }, // uk-c1-037.4
  { text: "В Одесі в моєї тітки є маленький балкон.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Garten" }, // uk-c1-038.1
  { text: "Там вона вирощує базилік і помідори.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Garten" }, // uk-c1-038.2
  { text: "Цього літа я сам поливав їх щоранку.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Garten" }, // uk-c1-038.3
  { text: "Коли помідори почервоніли, ми зробили салат і покликали сусідів.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "uk", topic: "Garten" }, // uk-c1-038.4
  { text: "Усі казали, що такого смачного салату ще не куштували.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Garten" }, // uk-c1-038.5
  { text: "Біля Чорного моря ми встаємо рано, поки пісок ще прохолодний.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Meer" }, // uk-c1-039.1
  { text: "Я біжу до води, а хвилі лоскочуть мені ноги.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Meer" }, // uk-c1-039.2
  { text: "Чайки ходять берегом і шукають сніданок.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Meer" }, // uk-c1-039.3
  { text: "Мама читає книжку під парасолькою, а я копаю в піску довгий канал для води.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Meer" }, // uk-c1-039.4
  { text: "У Харкові живе мій друг Марко.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Sport/Freundschaft" }, // uk-c1-040.1
  { text: "Він пересувається на кріслі колісному і чудово грає в баскетбол.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Sport/Freundschaft" }, // uk-c1-040.2
  { text: "Учора ми тренувалися разом у спортзалі.", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "uk", topic: "Sport/Freundschaft" }, // uk-c1-040.3
  { text: "Марко влучав м'ячем точно в кошик, а я бігав і подавав йому м'ячі.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Sport/Freundschaft" }, // uk-c1-040.4
  { text: "Наступного разу він обіцяв навчити мене свого кидка.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "uk", topic: "Sport/Freundschaft" }, // uk-c1-040.5
];
