/**
 * Korpus des Weges „uk" (Ukrainisch), Charge 1 - Jugendliche (K-UK, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_UK_WEG_CHARGE1_TEENS: CorpusItem[] = [
  { text: "Михайло Сербін виграв золото на дистанції 100 метрів на спині на Паралімпіаді в Парижі.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "uk", topic: "Sport/Paralympics" }, // uk-c1-041
  { text: "На Паралімпійських іграх у Парижі збірна України здобула 82 медалі.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "uk", topic: "Sport/Paralympics" }, // uk-c1-042
  { text: "Ярослава Магучіх стала олімпійською чемпіонкою зі стрибків у висоту в Парижі.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Sport" }, // uk-c1-043
  { text: "Ми з друзями записуємо подкаст про книжки, які читаємо в школі.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Bücher/Technik" }, // uk-c1-044
  { text: "Мій брат навчився програмувати й зробив гру, у якій кіт збирає зірки.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Technik" }, // uk-c1-045
  { text: "Наш клас висадив біля школи двадцять молодих лип.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Umwelt" }, // uk-c1-046
  { text: "Соломія мріє стати інженеркою і проєктувати мости через річки.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Berufswahl" }, // uk-c1-047
  { text: "Данило має порушення зору й друкує найшвидше в нашому класі.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Schule" }, // uk-c1-048
  { text: "Після уроків ми граємо в гандбол, а потім разом робимо домашнє завдання.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Sport/Freundschaft" }, // uk-c1-049
  { text: "Христина грає на бандурі, а її подруга співає сучасні пісні.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Musik" }, // uk-c1-050
  { text: "У Луцьку ми з однокласниками поставили в парку полицю для обміну книжками.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Bücher" }, // uk-c1-051
  { text: "Улітку ми їздили на велосипедах навколо озера на Волині й купалися.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Reisen/Sport" }, // uk-c1-052
  { text: "У львівській кав'ярні Назар уперше спробував гарячий шоколад із перцем.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Freizeit" }, // uk-c1-053
  { text: "Після походу в Карпатах ми сушили мокрі кросівки біля печі.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Reisen" }, // uk-c1-054
  { text: "У гуцульському Косові майстриня показала нам, як розписують глиняні миски.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Kunst" }, // uk-c1-055
  { text: "У Києві ми з класом ходили на виставку сучасного мистецтва.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Kultur" }, // uk-c1-056
  { text: "На березі Дніпра в Черкасах ми з екоклубом прибирали пляж.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Umwelt" }, // uk-c1-057
  { text: "Моя сестра вступила до коледжу в Полтаві й вивчає графічний дизайн.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Berufswahl" }, // uk-c1-058
  { text: "В Одесі ми з другом зняли відео про старі двори й виклали його в мережу.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "uk", topic: "Technik" }, // uk-c1-059
  { text: "Під Миколаєвом ми з батьками збирали абрикоси для варення.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Essen/Familie" }, // uk-c1-060
  { text: "Історичний центр Одеси внесено до списку світової спадщини ЮНЕСКО.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Kultur" }, // uk-c1-061
  { text: "Біля Чорного моря я вчуся віндсерфінгу й поки що часто падаю у воду.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Sport" }, // uk-c1-062
  { text: "Ми з друзями рахуємо, скільки видів птахів прилітає до нашого лиману.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Umwelt/Tiere" }, // uk-c1-063
  { text: "Цього літа я працюю в кафе на узбережжі біля Одеси й продаю лимонад.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Arbeit" }, // uk-c1-064
  { text: "У Харкові Ілля навчається в художній школі й малює комікси.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Kunst" }, // uk-c1-065
  { text: "Петриківський розпис внесено до списку нематеріальної культурної спадщини ЮНЕСКО.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Kultur" }, // uk-c1-066
  { text: "У Дніпрі наша команда з робототехніки зібрала робота, який сортує сміття.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Technik/Umwelt" }, // uk-c1-067
  { text: "У Чернігові ми з друзями їздимо на велосипедах уздовж Десни.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Sport" }, // uk-c1-068
  { text: "На Поліссі ми з класом рахували лелечі гнізда для шкільного проєкту.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Umwelt/Tiere" }, // uk-c1-069
  { text: "На Сумщині ми з тіткою сплавлялися на байдарках тихою річкою.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Sport/Reisen" }, // uk-c1-070
  { text: "Марина Піддубна плаває вільним стилем.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Sport/Paralympics" }, // uk-c1-071.1
  { text: "На Паралімпійських іграх у Парижі вона здобула бронзу на дистанції 50 метрів.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "uk", topic: "Sport/Paralympics" }, // uk-c1-071.2
  { text: "А разом із командою вона виграла змішану естафету.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Sport/Paralympics" }, // uk-c1-071.3
  { text: "Наша секція плавання дивилася ці запливи разом, і після них тренерка сказала: \"Ось що таке справжня наполегливість.\"", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Sport/Paralympics" }, // uk-c1-071.4
  { text: "Ми з друзями створили гурт.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "uk", topic: "Musik/Freundschaft" }, // uk-c1-072.1
  { text: "Олесь грає на гітарі, Мирослава на клавішних, а я записую все на ноутбук.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Musik/Freundschaft" }, // uk-c1-072.2
  { text: "Пісні пишемо самі, переважно про літо й дорогу до школи.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Musik/Freundschaft" }, // uk-c1-072.3
  { text: "Минулого тижня ми вперше виступили на шкільному концерті, і весь зал підспівував приспів.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Musik/Freundschaft" }, // uk-c1-072.4
  { text: "У нашій школі тепер є полиця для речей, які ще можуть комусь знадобитися.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Umwelt" }, // uk-c1-073.1
  { text: "Хтось приносить книжки, хтось шарфи чи настільні ігри.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Umwelt" }, // uk-c1-073.2
  { text: "Ідею запропонувала восьмикласниця Вероніка.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Umwelt" }, // uk-c1-073.3
  { text: "За місяць учні обмінялися сотнею речей, і жодна з них не потрапила на смітник.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Umwelt" }, // uk-c1-073.4
  { text: "У мого найкращого друга Романа порушення слуху, тож ми часто говоримо жестовою мовою.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Freundschaft" }, // uk-c1-074.1
  { text: "Я вивчив основи за одне літо, бо Роман терпляче показував мені жести.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "uk", topic: "Freundschaft" }, // uk-c1-074.2
  { text: "Тепер ми можемо жартувати навіть через увесь шкільний коридор.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Freundschaft" }, // uk-c1-074.3
  { text: "Інші однокласники теж почали вчити кілька жестів.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Freundschaft" }, // uk-c1-074.4
  { text: "Наш клас поїхав на екскурсію до Львова.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Reisen" }, // uk-c1-075.1
  { text: "Ми ходили вузькими вуличками, шукали левів на фасадах і рахували їх.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Reisen" }, // uk-c1-075.2
  { text: "Я нарахувала двадцять три, а Богдан навіть більше.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Reisen" }, // uk-c1-075.3
  { text: "Увечері ми слухали вуличних музикантів біля площі Ринок і їли гарячі пиріжки.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Reisen" }, // uk-c1-075.4
  { text: "Ми з батьками приїхали до Чернівців, щоб побачити резиденцію буковинських митрополитів.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Reisen/Kultur" }, // uk-c1-076.1
  { text: "Її внесено до списку світової спадщини ЮНЕСКО.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Reisen/Kultur" }, // uk-c1-076.2
  { text: "Я довго розглядала візерунки на дахах і фотографувала кожну вежу.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Reisen/Kultur" }, // uk-c1-076.3
  { text: "А потім ми сіли на лавку в парку, і я намалювала ці дахи в блокноті.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Reisen/Kultur" }, // uk-c1-076.4
  { text: "На березі Дніпра в Києві ми з друзями влаштували суботній пікнік.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Umwelt/Freundschaft" }, // uk-c1-077.1
  { text: "Дмитро приніс бутерброди, Яна взяла фрукти, а я прихопив термос із чаєм.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Umwelt/Freundschaft" }, // uk-c1-077.2
  { text: "Потім ми зібрали все сміття в мішки, навіть те, що лишили інші.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Umwelt/Freundschaft" }, // uk-c1-077.3
  { text: "Сусідні компанії побачили це й теж почали прибирати.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Umwelt/Freundschaft" }, // uk-c1-077.4
  { text: "В Одесі моя двоюрідна сестра навчається в музичній школі.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Musik/Familie" }, // uk-c1-078.1
  { text: "Вона грає на скрипці й готується до конкурсу.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Musik/Familie" }, // uk-c1-078.2
  { text: "Я приїхав до неї на канікули і щоранку слухав, як вона повторює ту саму мелодію.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Musik/Familie" }, // uk-c1-078.3
  { text: "На десятий день я вже наспівував її, навіть коли чистив зуби.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Musik/Familie" }, // uk-c1-078.4
  { text: "Улітку я займаюся вітрильним спортом на узбережжі біля Одеси.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Sport" }, // uk-c1-079.1
  { text: "Тренерка вчить нас читати вітер за хвилями й за прапорцями на щоглах.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Sport" }, // uk-c1-079.2
  { text: "Спочатку я хвилювалася, що човен перекинеться, але тепер сама виводжу його в море.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Sport" }, // uk-c1-079.3
  { text: "Найбільше люблю мить, коли вітрило ловить вітер.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Sport" }, // uk-c1-079.4
  { text: "На Поліссі багато лісів і боліт.", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "uk", topic: "Natur/Technik" }, // uk-c1-080.1
  { text: "Ми з класом ходили туди з біологинею і вчилися розпізнавати птахів за голосами.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Natur/Technik" }, // uk-c1-080.2
  { text: "Я записувала спів на телефон, а вдома порівнювала його із записами в застосунку.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Natur/Technik" }, // uk-c1-080.3
  { text: "Тепер я впізнаю дятла, зозулю й іволгу.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "uk", topic: "Natur/Technik" }, // uk-c1-080.4
];
