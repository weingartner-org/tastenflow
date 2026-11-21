/**
 * Korpus des Weges „bg" (Bulgarisch), Charge 1 - Kinder (K-BG, 29.10.2026, Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`).
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

export const CORPUS_BG_WEG_CHARGE1_KIDS: CorpusItem[] = [
  { text: "Днес в часа по рисуване нарисувах голям жълт слънчоглед.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Schule" }, // bg-c1-001
  { text: "Кучето на съседите ни в София обича да гони гълъбите в парка.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Tiere" }, // bg-c1-002
  { text: "От брега на Дунав при Русе гледаме как минава дълъг кораб.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Natur" }, // bg-c1-003
  { text: "В неделя помагам на баба в Смолян да разточи корите за баница.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Essen" }, // bg-c1-004
  { text: "В Бургас вятърът духа силно и хвърчилото ми лети високо.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Spiel" }, // bg-c1-005
  { text: "Съученичката ми Ива е незряща и чете приказки на брайлов шрифт.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Schule" }, // bg-c1-006
  { text: "Около Добрич нивите са огромни, а пшеницата вече е златна.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Natur" }, // bg-c1-007
  { text: "С татко броим колко езера виждаме от пътеката в Рила.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Natur" }, // bg-c1-008
  { text: "В Габрово с братовчед ми строим къщичка за птици в двора.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Familie" }, // bg-c1-009
  { text: "В Пловдив се качихме на тепето и видяхме целия град.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Freizeit" }, // bg-c1-010
  { text: "Учителката ни показа снимка на Мадарския конник и всички я разгледахме.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Schule" }, // bg-c1-011
  { text: "През голямото междучасие играем на гоненица в двора на училището.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Spiel" }, // bg-c1-012
  { text: "На Витоша има още сняг и ние се пързаляме с шейна.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Spiel" }, // bg-c1-013
  { text: "Във Варна намерих на плажа мидичка с розови ивици.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Natur" }, // bg-c1-014
  { text: "Татко прави таратор, а аз режа краставицата на малки кубчета.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Essen" }, // bg-c1-015
  { text: "В гората край Девин видяхме катеричка с пухкава опашка.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Tiere" }, // bg-c1-016
  { text: "В нашето село край Плевен щъркелите пак свиха гнездо на стълба.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Tiere" }, // bg-c1-017
  { text: "Мартин носи слухов апарат и пази вратата на нашия отбор.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Sport" }, // bg-c1-018
  { text: "В Сребърна наблюдавахме птиците с бинокъл, който взехме от вкъщи.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Tiere" }, // bg-c1-019
  { text: "Днес написах първото си писмо на компютъра с всичките десет пръста.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Schule" }, // bg-c1-020
  { text: "Сутринта вързах на ръката на баба мартеница от червен и бял конец.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Feste" }, // bg-c1-021
  { text: "Край Малко Търново гората е толкова гъста, че слънцето почти не се вижда.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Natur" }, // bg-c1-022
  { text: "В Банско се научих да карам ски и вече не падам на всеки завой.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Sport" }, // bg-c1-023
  { text: "В Троян с баба и братовчедка ми направихме мекици за закуска.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Essen" }, // bg-c1-024
  { text: "В двора на дядо край Стара Загора вече узряха първите домати.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Familie" }, // bg-c1-025
  { text: "Приятелят ми Петьо се движи с инвалидна количка и често играем в парка.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Freunde" }, // bg-c1-026
  { text: "Нашето училище в София има малка градина, която поливаме всеки ден.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Schule" }, // bg-c1-027
  { text: "В Созопол чайките крадат хляба от масата, ако не внимаваш.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Tiere" }, // bg-c1-028
  { text: "Събрахме се петима приятели и построихме замък от картонени кутии.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Spiel" }, // bg-c1-029
  { text: "В Шумен ходим с класа до крепостта и си правим пикник на поляната.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Schule" }, // bg-c1-030
  { text: "В нашето село в Родопите училището е малко.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Schule" }, // bg-c1-031.1
  { text: "В класа сме само девет деца.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Schule" }, // bg-c1-031.2
  { text: "Сутрин вървим заедно по пътеката край реката.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Schule" }, // bg-c1-031.3
  { text: "Учителката ни казва, че така всички се познаваме и си помагаме.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Schule" }, // bg-c1-031.4
  { text: "След часовете играем футбол на поляната зад училището.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Schule" }, // bg-c1-031.5
  { text: "Яна е незряща и ходи с бял бастун.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Freunde" }, // bg-c1-032.1
  { text: "В трамвая тя слуша гласа, който казва коя е следващата спирка.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Freunde" }, // bg-c1-032.2
  { text: "Днес Яна ме заведе до библиотеката в центъра на София.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Freunde" }, // bg-c1-032.3
  { text: "Там има книги на брайлов шрифт и тя ми показа как се чете с пръсти.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Freunde" }, // bg-c1-032.4
  { text: "Лятото прекарахме при леля във Варна.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Ferien" }, // bg-c1-033.1
  { text: "Всяка сутрин отивахме на плажа рано, когато пясъкът е още хладен.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Ferien" }, // bg-c1-033.2
  { text: "С брат ми построихме кула от пясък.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Ferien" }, // bg-c1-033.3
  { text: "Вълните я събориха, но ние веднага започнахме нова кула.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Ferien" }, // bg-c1-033.4
  { text: "Дядо живее във Видин, близо до Дунав.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Familie" }, // bg-c1-034.1
  { text: "Когато ходим при него, караме колела по крайбрежната алея.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Familie" }, // bg-c1-034.2
  { text: "Броим лодките и махаме на хората по корабите.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Familie" }, // bg-c1-034.3
  { text: "Вечер с дядо чистим рибата, която сме хванали сутринта.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Familie" }, // bg-c1-034.4
  { text: "Преди Великден у нас в Пловдив боядисваме яйца.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Feste" }, // bg-c1-035.1
  { text: "Аз избирам синя и зелена боя, а сестра ми рисува цветя с восък.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Feste" }, // bg-c1-035.2
  { text: "После месим козунак заедно с мама и татко.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Feste" }, // bg-c1-035.3
  { text: "Цялата кухня мирише на ванилия.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Feste" }, // bg-c1-035.4
  { text: "Нашата котка Мила спи по цял ден на перваза.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Tiere" }, // bg-c1-036.1
  { text: "Когато чуе, че отварям хладилника, веднага идва в кухнята.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Tiere" }, // bg-c1-036.2
  { text: "Аз сама сипвам храна в нейната купичка и сменям водата.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Tiere" }, // bg-c1-036.3
  { text: "Вечер Мила се свива на леглото ми и мърка.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Tiere" }, // bg-c1-036.4
  { text: "Миналото лято се качихме на връх Мусала в Рила.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Natur" }, // bg-c1-037.1
  { text: "Той е висок 2925 метра.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "bg", topic: "Natur" }, // bg-c1-037.2
  { text: "Тръгнахме рано сутринта от хижата и вървяхме дълго.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Natur" }, // bg-c1-037.3
  { text: "Горе беше студено и духаше вятър, но гледката към планините беше прекрасна.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Natur" }, // bg-c1-037.4
  { text: "Братовчед ми Калоян от Добрич не чува и говори на жестов език.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Freunde" }, // bg-c1-038.1
  { text: "Той ме научи как се казва „здравей“, „благодаря“ и „приятел“.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Freunde" }, // bg-c1-038.2
  { text: "Сега, когато се видим, го поздравявам с ръце и той много се радва.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Freunde" }, // bg-c1-038.3
  { text: "На 24 май в училище празнуваме празника на буквите.", kind: "satz", stufen: ["kids"], minTier: 5, nurWeg: "bg", topic: "Feste" }, // bg-c1-039.1
  { text: "Всяко дете избира една буква и я рисува на голям лист.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Feste" }, // bg-c1-039.2
  { text: "Моята е „Ж“, защото прилича на бръмбар.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Feste" }, // bg-c1-039.3
  { text: "После окачваме всички листове в коридора и се получава цялата азбука.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Feste" }, // bg-c1-039.4
  { text: "В събота с класа ходихме до Мадара.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Ausflug" }, // bg-c1-040.1
  { text: "Видяхме каменния конник високо в скалата.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Ausflug" }, // bg-c1-040.2
  { text: "Учителят ни разказа, че е много стар.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Ausflug" }, // bg-c1-040.3
  { text: "После се изкачихме по стълбите до върха и обядвахме на открито.", kind: "satz", stufen: ["kids"], minTier: 3, nurWeg: "bg", topic: "Ausflug" }, // bg-c1-040.4
];
