/**
 * Korpus des Weges „bg" (Bulgarisch), Charge 1 - Jugendliche (K-BG, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_BG_WEG_CHARGE1_TEENS: CorpusItem[] = [
  { text: "Ружди Ружди спечели златен медал в тласкането на гюле на Параолимпийските игри в Париж през 2024 г.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "bg", topic: "Paralympics" }, // bg-c1-041
  { text: "На Параолимпийските игри в Париж Стела Енева носеше българското знаме.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Paralympics" }, // bg-c1-042
  { text: "В петък вечер свирим с групата в малък клуб в центъра на София.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Musik" }, // bg-c1-043
  { text: "Написах първата си програма, която казва кой ден от седмицата сме.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Technik" }, // bg-c1-044
  { text: "В Пирин спазваме едно правило: всеки боклук, който качим, го сваляме обратно.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Umwelt" }, // bg-c1-045
  { text: "Влакът от Русе до Варна е бавен, но гледката през прозореца си струва.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Reisen" }, // bg-c1-046
  { text: "Когато Ема е тъжна, пише ми само едно сърце и знам, че трябва да се обадя веднага.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Freundschaft" }, // bg-c1-047
  { text: "Откакто плащаме в евро, сравнявам цените онлайн, без да смятам наум.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Euro" }, // bg-c1-048
  { text: "В Чепеларе тренираме ски бягане всяка зима след училище.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Sport" }, // bg-c1-049
  { text: "Отборът ни по плажен волейбол тренира в Бургас всеки ден от юни до август.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Sport" }, // bg-c1-050
  { text: "Искам да проектирам мостове, затова догодина кандидатствам в техническа гимназия.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Berufswahl" }, // bg-c1-051
  { text: "Никола е слабовиждащ и използва програма, която чете екрана на глас.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Technik" }, // bg-c1-052
  { text: "В Пловдив гледахме концерт под открито небе в Стария град.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Musik" }, // bg-c1-053
  { text: "В Добруджа гледаме как вятърните перки се въртят бавно над полето.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Umwelt" }, // bg-c1-054
  { text: "С приятели вървяхме два дни по билото на Стара планина и спахме в хижа.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Reisen" }, // bg-c1-055
  { text: "В Странджа видяхме стари дъбове, високи колкото нашата къща.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Umwelt" }, // bg-c1-056
  { text: "В клуба по роботика в София сглобихме робот, който следва черна линия.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Technik" }, // bg-c1-057
  { text: "Ученици от Шумен и Разград направиха общ проект за старите крепости.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Schule" }, // bg-c1-058
  { text: "Слушам музика в автобуса и си представям, че съм в клип.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Musik" }, // bg-c1-059
  { text: "В събота почистихме плажа край Несебър и напълнихме двадесет торби.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Umwelt" }, // bg-c1-060
  { text: "В Рилския манастир влязохме тихо и разгледахме цветните стенописи.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Kultur" }, // bg-c1-061
  { text: "В нашия отбор по баскетбол на колички играят момичета и момчета заедно.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Sport" }, // bg-c1-062
  { text: "Вкъщи имаме правило: телефоните спят в кухнята след десет вечерта.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Technik" }, // bg-c1-063
  { text: "Във Велико Търново се снимахме с изглед към Царевец при залез.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Reisen" }, // bg-c1-064
  { text: "Приятелят ми Емре от Кърджали ме научи да свиря няколко акорда на китара.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Freundschaft" }, // bg-c1-065
  { text: "Взехме автобуса от Добрич до морето и по пътя минахме през безкрайни ниви.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Reisen" }, // bg-c1-066
  { text: "Християн Стоянов зае четвърто място в бягането на 1500 м в Париж.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "bg", topic: "Paralympics" }, // bg-c1-067
  { text: "Тренирам художествена гимнастика в Стара Загора и тази година ще имам първото си състезание.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Sport" }, // bg-c1-068
  { text: "В София карам колело до училище, защото с него стигам за десет минути.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Umwelt" }, // bg-c1-069
  { text: "Лятото работих в кафене във Варна и спестих пари за нов телефон.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Arbeit" }, // bg-c1-070
  { text: "Миналата седмица в час по физическо гледахме запис от Параолимпийските игри в Париж.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Paralympics" }, // bg-c1-071.1
  { text: "Ружди Ружди спечели злато в тласкането на гюле.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Paralympics" }, // bg-c1-071.2
  { text: "Учителят ни каза, че силата идва от краката, а не само от ръцете.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Paralympics" }, // bg-c1-071.3
  { text: "След часа всички пробвахме, но гюлето падна доста близо.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Paralympics" }, // bg-c1-071.4
  { text: "През юли бях на лагер в Странджа.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Umwelt" }, // bg-c1-072.1
  { text: "Спяхме в палатки и всяка сутрин ставахме с песента на птиците.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Umwelt" }, // bg-c1-072.2
  { text: "Една биоложка ни показа как се разпознават дърветата по листата.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Umwelt" }, // bg-c1-072.3
  { text: "Вечер нямаше обхват и за първи път не ни липсваше телефонът.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Umwelt" }, // bg-c1-072.4
  { text: "Сестра ми Деси е незряща и учи програмиране.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Technik" }, // bg-c1-073.1
  { text: "Тя пише код с програма, която чете текста на глас.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Technik" }, // bg-c1-073.2
  { text: "Програмата говори толкова бързо, че аз не разбирам нито дума, а Деси разбира всичко.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Technik" }, // bg-c1-073.3
  { text: "Миналия месец тя направи малка игра за телефон и аз я изпробвах пръв.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Technik" }, // bg-c1-073.4
  { text: "С двама приятели пътувахме с влак от Плевен до Видин.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Reisen" }, // bg-c1-074.1
  { text: "Пътят беше дълъг, затова взехме сандвичи и карти за игра.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Reisen" }, // bg-c1-074.2
  { text: "Във Видин разгледахме крепостта Баба Вида и седнахме на брега на Дунав.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Reisen" }, // bg-c1-074.3
  { text: "Вечерта се прибрахме уморени, но щастливи.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Reisen" }, // bg-c1-074.4
  { text: "От началото на 2026 г. в България плащаме с евро.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "bg", topic: "Euro" }, // bg-c1-075.1
  { text: "В първите дни баща ми още смяташе цените наум в левове.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Euro" }, // bg-c1-075.2
  { text: "Аз свикнах веднага, защото и без това плащам повечето неща с карта.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Euro" }, // bg-c1-075.3
  { text: "Сега сандвичът в нашата столова струва 2,50 €.", kind: "satz", stufen: ["teens"], minTier: 5, nurWeg: "bg", topic: "Euro" }, // bg-c1-075.4
  { text: "В Пловдив имаме група от петима ученици.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Musik" }, // bg-c1-076.1
  { text: "Аз свиря на барабани, а Мария пее и пише текстовете.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Musik" }, // bg-c1-076.2
  { text: "Репетираме в мазето на един приятел, затова съседите вече знаят всичките ни песни.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Musik" }, // bg-c1-076.3
  { text: "През юни ще свирим на празника на училището.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Musik" }, // bg-c1-076.4
  { text: "С класа помагахме на горските служители в Пирин да маркират туристическите пътеки.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Umwelt" }, // bg-c1-077.1
  { text: "Боядисвахме знаци по камъните и дърветата.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Umwelt" }, // bg-c1-077.2
  { text: "Научихме, че когато хората вървят само по пътеките, растенията наоколо се запазват.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Umwelt" }, // bg-c1-077.3
  { text: "Беше тежка, но много хубава работа.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Umwelt" }, // bg-c1-077.4
  { text: "Моята приятелка Айше живее в Златоград, а аз живея в Смолян.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Freundschaft" }, // bg-c1-078.1
  { text: "Виждаме се само през ваканциите, но всяка вечер си пишем.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Freundschaft" }, // bg-c1-078.2
  { text: "Тя ми праща снимки на планината от своя прозорец, а аз пращам моите.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Freundschaft" }, // bg-c1-078.3
  { text: "Така сме заедно, макар и далече.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Freundschaft" }, // bg-c1-078.4
  { text: "През май бяхме в Казанлък и видяхме как хората берат рози в полето.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Reisen" }, // bg-c1-079.1
  { text: "Едно момиче на нашата възраст ни показа как да откъсваме цвета, без да се убодем.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Reisen" }, // bg-c1-079.2
  { text: "Напълнихме една кошница и цял ден миришехме на рози.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Reisen" }, // bg-c1-079.3
  { text: "Всяка неделя във Варна ходя на плуване с Борис.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Sport" }, // bg-c1-080.1
  { text: "Той е роден без лява ръка и плува със своя собствена техника.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Sport" }, // bg-c1-080.2
  { text: "Треньорът ни дава едни и същи задачи и Борис често ме изпреварва.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Sport" }, // bg-c1-080.3
  { text: "След тренировка ядем банички на пристанището.", kind: "satz", stufen: ["teens"], minTier: 3, nurWeg: "bg", topic: "Sport" }, // bg-c1-080.4
];
