/**
 * Korpus des Weges „bg" (Bulgarisch), Charge 1 - Erwachsene (K-BG, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
 *
 * Quelle: iCloud `sprachen-2026-10-25/texte-charge-1/bg.jsonl` (je Altersgruppe 30 Sätze und 10 Absätze, neu in der
 * Sprache verfasst, `quelle: "eigen"`), geprüft von einem zweiten Prüfer (`PRUEFBERICHT-bg.md`: freigabefähig).
 * Der Text ist unverändert übernommen. Zuordnung: `alter` ⇒ `stufen`, `thema` ⇒ `topic`, `weg` ⇒ `nurWeg`; die Kennung
 * der Quelle steht als Kommentar hinter jeder Zeile.
 *  · Absätze (`art: "absatz"`) sind an den Satzgrenzen in ihre Sätze geteilt (`<id>.1`, `<id>.2` …): Korpus-Zeilen sind einzelne
 *    Übungszeilen (die längste der acht Wege davor hat 130 Zeichen), mehrsätzige Geschichten sind Serien. Kein Wort geändert.
 *  · Selbst verfasst ⇒ ohne `herkunft` (wie die Chargen von it/pl/tr/cs; `herkunft` ist für ÜBERNOMMENE Texte).
 *  · `minTier` = `minTierFor(text, "bg")` nach der eigenen Lern-Folge des Weges (`lernweg.ts`, F4), Bezugstastatur `bg`.
 * Wächter: `tests/tastenflow-texte-bg-charge1.test.ts`. Nur HINTEN anhängen (Anker, `corpusBg.ts`).
 *
 * ⚠️ DATENBLATT: nur `import type` (`scripts/buendel-aufteilung.ts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_BG_WEG_CHARGE1_ERWACHSENE: CorpusItem[] = [
  { text: "Получихте ли вече новата си лична карта, или още я чакате?", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Behörden" }, // bg-c1-081
  { text: "Колегите от офиса в София обсъждат дали да работят от вкъщи в петък.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-082
  { text: "Записах си час при личния лекар за сряда в 9:30 сутринта.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "bg", topic: "Gesundheit" }, // bg-c1-083
  { text: "Наемът на апартамента в Пловдив включва паркомясто и мазе.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Wohnen" }, // bg-c1-084
  { text: "Сметката за ток този месец е 48,60 €, малко повече от миналия.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "bg", topic: "Euro" }, // bg-c1-085
  { text: "Тази вечер гледаме постановка с аудиоописание, което слушаме през слушалки.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Kultur" }, // bg-c1-086
  { text: "По време на жътвата в Добруджа комбайните работят до късно през нощта.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-087
  { text: "Отворихме къща за гости в Широка лъка и вече приемаме първите туристи.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-088
  { text: "След десет години в Германия Петя се върна в Габрово и отвори пекарна.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "bg", topic: "Rückkehr" }, // bg-c1-089
  { text: "През сезона работя на рецепцията на хотел в Несебър от осем до пет.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-090
  { text: "Попълнете формуляра и го изпратете по електронен път до петък.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Behörden" }, // bg-c1-091
  { text: "Аптеката до нас в Силистра е отворена и в неделя до обяд.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "bg", topic: "Gesundheit" }, // bg-c1-092
  { text: "С метрото стигам до работа в София за двадесет минути.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Alltag" }, // bg-c1-093
  { text: "В Мелник семейството ни продава мед и билков чай на туристите.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-094
  { text: "Колегата ми Стефан е незрящ и работи като юрист в нашата фирма.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-095
  { text: "Пътят от Пловдив до Смолян е с много завои, затова тръгваме рано.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "bg", topic: "Alltag" }, // bg-c1-096
  { text: "В Царево записахме децата в библиотеката и сега четат всяка вечер.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Kultur" }, // bg-c1-097
  { text: "В Шумен ремонтират улиците в центъра до края на месеца.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Wohnen" }, // bg-c1-098
  { text: "Купихме билети за операта в Стара Загора за събота вечер.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Kultur" }, // bg-c1-099
  { text: "Фирма в Троян търси шофьор и оператор на машини с опит.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-100
  { text: "Съседите от блока във Варна решиха да боядисат входа заедно.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Wohnen" }, // bg-c1-101
  { text: "Лекарката ми препоръча да ходя по половин час пеша всеки ден.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Gesundheit" }, // bg-c1-102
  { text: "На пазара продавачът ми върна 1,40 € ресто и ми пожела хубав ден.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "bg", topic: "Euro" }, // bg-c1-103
  { text: "Новата спирка има гласово съобщение и тактилна пътека за незрящите хора.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Barrierefreiheit" }, // bg-c1-104
  { text: "В Русе с колегите участвахме в благотворителен крос по брега на Дунав.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Alltag" }, // bg-c1-105
  { text: "Тази година подадох данъчната декларация онлайн за десет минути.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Behörden" }, // bg-c1-106
  { text: "В Балчик рибарите излизат в морето още преди изгрев.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-107
  { text: "Майка ми носи слухов апарат и вече следи новините без субтитри.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Gesundheit" }, // bg-c1-108
  { text: "В неделя разгледахме Рилския манастир и чухме камбаните отблизо.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Kultur" }, // bg-c1-109
  { text: "Новата ни колежка започва в понеделник и ще работи по проекта за училищата.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-110
  { text: "След дванадесет години в Испания Христина се върна в родното си село край Добрич.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Rückkehr" }, // bg-c1-111.1
  { text: "Купи стара къща и я ремонтира с помощта на съседите.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Rückkehr" }, // bg-c1-111.2
  { text: "Сега отглежда зеленчуци и продава сладко на пазара в града.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Rückkehr" }, // bg-c1-111.3
  { text: "Казва, че тук има време за всичко, защото няма задръствания.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Rückkehr" }, // bg-c1-111.4
  { text: "Сутринта отидох в районната администрация в София, за да сменя адреса си.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Behörden" }, // bg-c1-112.1
  { text: "Пред гишето имаше опашка, затова си взех номер от машината.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Behörden" }, // bg-c1-112.2
  { text: "Служителката провери документите ми за пет минути и всичко приключи бързо.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Behörden" }, // bg-c1-112.3
  { text: "Следващия път ще опитам онлайн.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Behörden" }, // bg-c1-112.4
  { text: "От 1 януари 2026 г. в България цените са в евро.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "bg", topic: "Euro" }, // bg-c1-113.1
  { text: "В първите седмици много хора още пресмятаха наум колко е това в левове.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Euro" }, // bg-c1-113.2
  { text: "Днес почти никой не го прави и хлябът в нашата пекарна просто струва 1,30 €.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "bg", topic: "Euro" }, // bg-c1-113.3
  { text: "Ивайло работи като преводач в Пловдив.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-114.1
  { text: "Той е незрящ и използва компютър с програма, която чете текста на глас, и брайлов дисплей.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-114.2
  { text: "Колегите му изпращат документите в текстов формат, за да ги отваря без проблем.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-114.3
  { text: "Така екипът работи бързо и спокойно.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-114.4
  { text: "Миналата седмица в Плевен се записах в група за ходене за хора над петдесет години.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Gesundheit" }, // bg-c1-115.1
  { text: "Срещаме се три пъти седмично в парка.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Gesundheit" }, // bg-c1-115.2
  { text: "Водачката ни е бивша спортистка и знае как да ни мотивира.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Gesundheit" }, // bg-c1-115.3
  { text: "След първия месец вече се качвам по стълбите, без да спирам.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Gesundheit" }, // bg-c1-115.4
  { text: "В събота заведох децата на Мадара.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Kultur" }, // bg-c1-116.1
  { text: "Изкачихме се по стълбите до скалата с конника, а после седнахме на сянка и обядвахме.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Kultur" }, // bg-c1-116.2
  { text: "Мадарският конник е в списъка на ЮНЕСКО от 1979 г.", kind: "satz", stufen: ["erwachsen"], minTier: 5, nurWeg: "bg", topic: "Kultur" }, // bg-c1-116.3
  { text: "Голямата ми дъщеря записа всичко в дневника си за училище.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Kultur" }, // bg-c1-116.4
  { text: "Търсим двустаен апартамент в Бургас близо до Морската градина.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Wohnen" }, // bg-c1-117.1
  { text: "Важно ни е да има асансьор, защото баща ми трудно се качва по стълби.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Wohnen" }, // bg-c1-117.2
  { text: "Видяхме три жилища тази седмица.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Wohnen" }, // bg-c1-117.3
  { text: "Последното беше светло и тихо и много ни хареса.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Wohnen" }, // bg-c1-117.4
  { text: "През зимата работя като инструктор по ски в Банско, а през лятото водя туристи по пътеките на Пирин.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-118.1
  { text: "Хората често ме питат кой сезон харесвам повече.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-118.2
  { text: "Отговарям, че планината е хубава по всяко време, ако носиш подходящи обувки.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-118.3
  { text: "В неделя бяхме в Етъра край Габрово.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Kultur" }, // bg-c1-119.1
  { text: "Там майсторите работят по стария начин: грънчарят оформя глина, а медникарят кове съдове.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Kultur" }, // bg-c1-119.2
  { text: "Купихме си дървена лъжица и малка медна тава.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Kultur" }, // bg-c1-119.3
  { text: "Децата гледаха как резбарят дълбае дърво и искаха да опитат сами.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Kultur" }, // bg-c1-119.4
  { text: "Всяка есен събираме гъби в горите над Девин.", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "bg", topic: "Alltag" }, // bg-c1-120.1
  { text: "Ходим с група приятели и един от тях е горски служител, затова знаем кои гъби стават за ядене.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Alltag" }, // bg-c1-120.2
  { text: "Вечерта ги приготвяме на огъня в двора и разказваме истории до късно.", kind: "satz", stufen: ["erwachsen"], minTier: 3, nurWeg: "bg", topic: "Alltag" }, // bg-c1-120.3
];
