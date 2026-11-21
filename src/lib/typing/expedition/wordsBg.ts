/**
 * ★ G3c-VERTEILER (25.10.2026): DER RATE-WORTSCHATZ DER EXPEDITION (Polarstation) AUF WEG „bg" (Bulgarisch).
 * ★ O-INHALT-BG (29.10.2026): gefüllt - neu gewählt, nicht übersetzt. Je Sprosse der bulgarischen Reihenfolge
 * (`lernweg.ts`, BDS: о т а н в м я е и …) die Wörter, die mit der neuen Taste erst tippbar werden. Grundlage ist der
 * Übungswortschatz des Weges (`WORDS_BG`, `STUFE_VOCAB_BG`, aus `tf-fest-bg.json` `stufenWoerter`), ergänzt um die Szene der
 * Expedition (лед, сняг, морж, тюлен, иглу, компас, сияние, мъгла, мраз, ски, шал) und Tiere des Landes (елен, орел, бухал,
 * сова, бобър, вълк, мечка, лисица, щъркел).
 *
 * Regeln (Wächter `tests/tastenflow-expedition-bg.test.ts`): klein, 2 bis 6 Buchstaben (die Station nimmt höchstens 6), NUR
 * Buchstaben mit EINER Taste ohne Umschalt auf `bg` UND `bg-schreibm` (а-я ohne ы э; kein ѝ - auf der Schreibmaschinen-
 * Tastatur fehlt es); keine zwei Wörter mit denselben Buchstaben (die Station könnte sonst zwei Lösungen haben); nichts aus der
 * Sperrliste (`gesperrtBg`); kein Tier, das als Schimpfwort gegen ein Kind dient (крава, магаре, прасе, коза, маймуна fehlen);
 * kein Wort über Tod, Waffen, Rausch, Glaube (вино, бира, църква fehlen).
 * ⚠️ KEIN WÖRTERBUCH-BELEG: Das Vorlese-Lexikon kennt „bg" noch nicht (F8). Jedes Wort steht im Übungswortschatz des Weges oder
 * im Wächter namentlich als Eigenwissen [G]; die Lese-Abnahme durch eine Person mit Bulgarisch als Erstsprache steht aus.
 *
 * Verteiler: `expedition/words.ts` (`RATE_VORRAT`, Wörter UND Stimme `"bg"`). Wächter: `tests/tastenflow-expedition-bg.test.ts`,
 * `tests/tastenflow-es-m2-expedition-wortstimme.test.ts`.
 */

export const WORDS_BG_EXPEDITION: readonly string[] = [
  // mit н
  "тон", "нота",
  // mit в
  "вана", "таван", "вата",
  // mit м
  "мама", "атом", "том",
  // mit я
  "яма", "отмяна",
  // mit е
  "тема", "монета", "овен", "мента", "вена",
  // mit и
  "име", "ниво", "имане", "мотив", "новина",
  // mit с
  "маса", "тест", "стая", "син", "сто", "осем", "мисия", "истина", "сова", "сияние", "мост",
  // mit д
  "вода", "дом", "ден", "дете", "дядо", "идея", "диня", "мида", "домат", "седем", "мед",
  // mit р
  "море", "двор", "торта", "адрес", "трева", "сирене", "роса", "номер", "мир", "врата", "сестра",
  // mit к
  "кино", "екран", "река", "котка", "кон", "карта", "китара", "морков", "мравка", "доктор", "кит", "ски", "ракета",
  // mit л
  "лодка", "мляко", "село", "масло", "стол", "лято", "сол", "молив", "лале", "слива", "медал", "влак", "лед", "елен", "орел",
  "лист", "слон",
  // mit п
  "писмо", "поле", "парк", "пиле", "песен", "план", "топка", "петел", "перон", "компас", "плод",
  // mit з
  "звезда", "земя", "зима", "роза", "заек", "езеро", "изток", "запад", "език", "извор", "мраз",
  // mit г
  "сняг", "ягода", "гора", "град", "книга", "игра", "глас", "гост", "легло", "лагер", "рог",
  // mit б
  "кораб", "обяд", "риба", "небе", "бряг", "облак", "билет", "победа", "банка", "зебра", "робот", "балон", "банан",
  // mit ъ
  "бобър", "път", "сън", "дъга", "вълк", "вятър", "пясък", "вълна", "дърво", "камък", "дъска", "пъзел", "петък", "мъгла",
  "огън", "пътека", "тигър", "лъв", "зъб", "гълъб",
  // mit у
  "урок", "луна", "буря", "супа", "музика", "утро", "лук", "кукла", "бутон", "азбука", "иглу",
  // mit ч
  "чанта", "мечка", "пчела", "кокиче", "мечта", "вечер", "час", "куче", "ученик", "чичо",
  // mit ж
  "нож", "дъжд", "плаж", "етаж", "въже", "живот", "книжка", "кожа", "морж",
  // mit ш
  "шапка", "чаша", "круша", "череша", "шега", "мишка", "шум", "вишна", "пъпеш", "шал",
  // mit щ
  "къща", "нощ", "щастие", "площад", "пещера", "щъркел", "помощ",
  // mit й
  "чай", "чайка", "шейна", "зайче", "музей", "герой", "край", "майка", "тайна", "чайник",
  // mit х
  "ехо", "връх", "хоро", "хотел", "хартия", "въздух", "елха", "храна", "смях", "хляб", "бухал",
  // mit ц
  "птица", "пица", "лисица", "овца", "цвете", "слънце", "раница", "баница", "звънец", "улица",
  // mit ф
  "кафе", "фенер", "жираф", "делфин", "футбол", "шкаф", "фурна", "ферма", "цифра",
  // mit ю
  "юг", "ключ", "тюлен", "люлка", "ютия", "охлюв", "бюро",
  // mit ь
  "шофьор", "актьор", "сьомга", "каньон", "миньор",
];
