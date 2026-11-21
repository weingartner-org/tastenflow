import type { InhaltsStufe } from "./account";

/**
 * Tschechische Wortliste (Kleinschreibung) - das Gegenstück zu `WORDS` (`words.ts`), `WORDS_EN` (`corpusEn.ts`), `WORDS_FR`,
 * `WORDS_ES` und `WORDS_IT` für den Generator (Wort-Drill, Zeichen-Zeilen) und für die Übungsformen, die ihren Vorrat über
 * `wortquelle()`/`wortpool()` (`uebungsformen/hilfen.ts`) ziehen.
 *
 * ★ F5-F8 Tschechisch (03.10.2026, Bauplan vier Sprachen §4): bis hierher gab `wortquelle("cs")` und `WORD_BASE.cs` das ENGLISCHE
 * `WORDS_EN` (Marke `RÜCKFALL-EN (G2a)`) - eine tschechische Übungszeile bestand dann aus englischen Wörtern. Diese Liste ersetzt sie.
 *
 * ── Herkunft (GEMESSEN und von Hand zusammengestellt, nichts roh übernommen) ──────────────────────────────────────
 * 1. `scripts/messe-worthaeufigkeit-cs.mts` zählt die Wortformen der tschechischen Tatoeba-ORIGINALSÄTZE (`ces_sentences_base.tsv.bz2`:
 *    Spalte 2 = „0" ⇒ Original, 13.227 Sätze, 12.434 Wortformen; keine zusätzliche Wortliste geladen). Die Namen Tom und Mary
 *    (zusammen in 68 % der Originale) sind samt Endungen vorher aus dem Satz gestrichen (F4-Befund, Namen-Falle); andere Namen
 *    fängt die Gross-/Kleinquote mitten im Satz. Wo die Originale einer Sprosse nicht reichen, füllt die Messung mit Formen aus allen
 *    89.938 Sätzen auf (Mindesthäufigkeit 6). Tatoeba ist kein Kinderkorpus: viele Sätze sind Übersetzungen aus dem Englischen
 *    und von einzelnen Beitragenden - die Zählung ist BELEG, dass ein Wort in Gebrauch ist, nicht die Auswahl.
 * 2. ⚠️ KEIN WÖRTERBUCH-BELEG: Das macOS-Wörterbuch nimmt für Tschechisch JEDES Wort an (`qwxz`, gemessen), eine Formenliste
 *    (Majka/SYN) ist nicht geladen und nur mit Johannes' Ja ladbar. Statt des Wörterbuchs gilt: jede Form kommt in den Tatoeba-
 *    Sätzen vor, wurde von Hand durchgelesen, und die Handergänzungen (Grundreihe, Themenwortschatz) sind gegen dieselben
 *    Sätze auf ihre Schreibung geprüft (`tests/tastenflow-cs-woerter.test.ts`). Eine Lese-Abnahme durch eine Person mit Tschechisch
 *    als Erstsprache steht aus (Prüfbericht P7, Falle 59).
 * 3. Die Auswahl ist nach der Tastenfolge von `CS_LETTER_ORDER` (lernweg.ts) einsortiert: je Sprosse ein Kontingent, damit jeder Stand
 *    des Lehrgangs echte Wörter hat (ab {@link REAL_WORD_FLOOR} = 40 passenden Wörtern fallen die Unsinnwörter ganz weg). Ohne
 *    Kontingent füllen die häufigen Buchstaben `e m i n o t v` die ganze Liste. Höchstens drei Formen je Wortstamm.
 *    Die Liste ist je TASTENWERT geführt: auf `cs` (QWERTZ) und `cs-qwerty` stehen `y` und `z` auf verschiedenen Tasten, die Folge zählt
 *    aber den Wert - jedes Wort ist auf beiden Tastaturen mit denselben Einheiten schreibbar (Wächter prüft beide).
 * 4. Nichts steht auf der Sperrliste (`sperrlisteCs.ts`: Schimpf-, Doppelsinn-, Kind-Schutzwörter; Gewalt, Tod, Rausch- und
 *    Sexualthemen, Wörter gegen ein Kind und Personenwörter gegen Menschen mit Behinderung - Glossar Regel 2/3). Wörter wie
 *    `smrt`, `zbraň`, `ukradl`, `nenávidí` stehen bewusst NICHT hier, auch wenn sie in Tatoeba häufig sind: ein Wortsalat
 *    kombiniert zufällig.
 *
 * ── Eigenschaften, die der Generator braucht ─────────────────────────────────────────────────────────────────────
 *  · Die neun Buchstaben der Zahlenreihe `ě š č ř ž ý á í é` sind eigene Einheiten an ihren Sprossen (ě 16, í 18, á 22, ž 27, š ř č é ý 28-32 - ohne die Umschalttaste gezählt) - `filterWords`
 *    lässt ein Wort erst durch, wenn die Einheit freigeschaltet ist. Es gibt keinen Ersatz (`být` ≠ `byt`, `že` ≠ `ze`, Falle 36).
 *  · `ď ť ň` (Háček + d/t/n, Einheit `ˇ` Nr. 33) und `ó` (Čárka + o, Einheit `´` Nr. 37) sind Totasten-Buchstaben: sie stehen erst
 *    ab ihrer Totaste (`totastenBuchstabeFrei`, corpus.ts). `Ů` wird nie serviert, `ů` nie am Wortanfang.
 *  · Keine Eigennamen, keine Wörter mit `ö ä ü ë ï ÿ ß ł` (nicht auf der Folge des Weges), keine Ziffern.
 *  · Kleinschreibung durchgehend; die Grossschreibung am Zeilenanfang setzt der Generator (`SENTENCE_CAP`) - nie vor einem
 *    Buchstaben, der die Totaste braucht (`grossAkzentSpaet`, `capAmAnfang`).
 *
 * Geordnet nach der Sprosse, an der ein Wort vollständig tippbar wird (Zahl in Klammern = Wörter dieser Gruppe).
 */
export const WORDS_CS: string[] = [
  // Grundreihe f j d k s l a ů (14)
  "dal", "dala", "jak", "jas", "kal", "kasa", "klas", "lak", "sad", "sada", "slad", "kůl", "lůj", "sůl",
  // e m i n o t v ě u (T1) (321)
  "ale", "dej", "dle", "jde", "je", "jed", "jede", "jedl", "jedla", "jel", "jela", "kafe", "kde", "ke", "led", "les",
  "lesa", "lese", "se", "dejme", "dům", "důsledkem", "jdeme", "jedeme", "jsem", "jsme", "kam", "masa", "med", "můj",
  "sama", "sedm", "sejdeme", "sem", "asi", "dali", "film", "jakmile", "jdi", "jedli", "jeli", "ji", "jim", "jsi",
  "klid", "klima", "li", "lidem", "lidi", "lidmi", "mail", "mami", "mi", "sami", "sedli", "sedmi", "si", "sil",
  "ani", "dan", "den", "dne", "dnem", "dnes", "dneska", "dni", "dnů", "fajn", "jeden", "jen", "jinak", "jinam",
  "jinde", "kina", "leden", "mne", "na", "nad", "najal", "najde", "najdeme", "najdi", "nalil", "ne", "nedal",
  "nejde", "nejedl", "nejel", "nejen", "nejsem", "nesl", "ni", "nijak", "nikam", "nikde", "nim", "nimi", "sedni",
  "sen", "snad", "snil", "ano", "daleko", "dalo", "do", "dojem", "dokola", "dolů", "doma", "domem", "domů", "jako",
  "jedno", "jenom", "jo", "kdo", "kole", "kolem", "kolik", "kolo", "koni", "lodi", "loni", "maso", "mimo", "moje",
  "moji", "nedaleko", "nikdo", "od", "ode", "odejde", "odejdi", "odjel", "okna", "okno", "oko", "okolo", "on", "ona",
  "oni", "online", "osm", "skokem", "snadno", "dejte", "deset", "deseti", "dost", "dostal", "dostat", "jestli",
  "jet", "jist", "jste", "let", "letos", "list", "majetek", "matka", "most", "nedostal", "nestalo", "nosit", "sekat",
  "setkal", "setkat", "stal", "stalo", "stane", "stole", "stolem", "stůl", "ta", "tak", "takto", "talent", "tam",
  "tato", "ten", "tento", "ti", "tito", "tlak", "to", "tolik", "tom", "tomto", "toto", "divadlo", "domov", "domova",
  "dovolit", "dovolte", "důvod", "důvodů", "dva", "kvůli", "lidstva", "lidstvo", "najevo", "odvolal", "oslovit",
  "ovlivnit", "slavit", "sledoval", "sledovat", "slov", "slova", "slovo", "sotva", "stav", "svedl", "svoje", "svoji",
  "svůj", "tvoje", "tvůj", "ve", "vedle", "vedlo", "velmi", "ven", "vina", "vlak", "vlakem", "vlast", "vliv", "vlna",
  "voda", "volal", "vstal", "vůli", "děje", "dělal", "dělat", "denně", "dětem", "děti", "dětmi", "domě", "dvě", "mě",
  "měl", "měla", "měli", "města", "městě", "mně", "ně", "nedělal", "neděli", "něj", "někde", "někdo", "několik",
  "neměl", "neměli", "nesměl", "nevěděl", "neviděl", "seděl", "sedět", "snědl", "stejně", "svět", "světě", "světlo",
  "tě", "tělo", "věděl", "vědět", "věk", "vět", "viděl", "viděli", "vidět", "auta", "autem", "auto", "dokud", "domu",
  "dovolenou", "dvou", "filmu", "jakou", "jdu", "jednou", "jednu", "jinou", "jsou", "komu", "lituji", "mluvit",
  "mnou", "mu", "musel", "museli", "muset", "najednou", "nějakou", "nejsou", "nemusel", "neudělal", "nikomu",
  "novou", "odtamtud", "stolu", "svou", "tomu", "tu", "tuto", "udělal", "udělat", "usnul", "utekl", "uvědomil",
  "uviděl", "venku", "větu", "vlaku",
  // í p c h á r z b y ž (T2) (468)
  "dělají", "dětí", "dítě", "dívat", "dívka", "její", "jí", "jídla", "jídlo", "jiní", "jíst", "jít", "lidí", "mají",
  "místě", "místnosti", "místo", "mít", "mluví", "mluvím", "musí", "musím", "musíte", "najít", "nemají", "nemusí",
  "nemusíte", "není", "nesmí", "nevadí", "neví", "nevím", "nevlastní", "ní", "ním", "odejít", "odmítl", "sníst",
  "stojí", "svojí", "svolení", "tím", "umí", "uvidím", "ví", "vidí", "vím", "vlastní", "dopis", "koupil", "koupit",
  "nakupovat", "napsal", "nekoupil", "neodpověděl", "neptal", "neptej", "nepůjde", "nepůjdu", "odpoledne", "opět",
  "opustil", "opustit", "pak", "pamatovat", "pes", "pět", "pije", "pít", "platit", "po", "pod", "podívat", "podle",
  "pokoj", "pokoji", "pokud", "pokusil", "pomalu", "poslal", "poslední", "postavil", "potkal", "povinnost",
  "povinnosti", "psa", "ptal", "půjde", "půjdu", "spal", "spí", "spokojen", "spolu", "spoustu", "akci", "celou",
  "cenu", "cesta", "cestě", "cestu", "cítil", "co", "cokoliv", "dělníci", "docela", "dokonce", "dvacet", "konce",
  "konec", "měsíc", "moc", "moci", "nakonec", "něco", "nejvíc", "nejvíce", "nic", "noc", "noci", "otce", "otec",
  "ovce", "ovcí", "pacient", "pocit", "policii", "politici", "pomoc", "pomoci", "pomoct", "silnice", "situace",
  "situaci", "ulici", "věc", "věci", "věcí", "vejce", "velice", "vesnici", "víc", "více", "dlouho", "hledal", "hned",
  "ho", "hodin", "hodinu", "hodně", "chce", "chcete", "chci", "chodí", "chodit", "chovat", "chtějí", "chtěl",
  "chtěli", "chvíli", "ihned", "jeho", "jejich", "knihu", "koho", "mnohem", "mnoho", "mohl", "mohli", "mohlo",
  "mohu", "nehodu", "nechce", "nechci", "nechtěl", "někoho", "nemohl", "nemohu", "nepomohl", "nich", "nikoho",
  "pochopit", "poslouchat", "schopen", "sníh", "takhle", "těch", "tenhle", "tohle", "toho", "dá", "dál", "dám",
  "dát", "dává", "dělá", "domácí", "doufám", "chová", "chování", "já", "jaká", "kávu", "má", "málem", "mám", "máme",
  "máte", "náhodou", "nákup", "náladu", "nám", "námi", "nápad", "nás", "nedá", "nemá", "nemám", "neudělá", "odmítá",
  "padáka", "pohádal", "pomáhat", "psát", "sám", "setkání", "spát", "stál", "stále", "stát", "udělá", "válku", "vám",
  "vámi", "vás", "velká", "dcera", "firmě", "horko", "kromě", "která", "narodil", "navrhl", "několikrát", "opravdu",
  "opravit", "práce", "práci", "pracoval", "pracovat", "pracovní", "pravda", "pravdu", "právě", "pravidelně",
  "právo", "pro", "prosím", "prostě", "proti", "proto", "první", "rád", "raději", "rádi", "radost", "ráno", "rodinu",
  "rok", "sestra", "skoro", "strach", "stroj", "tenkrát", "tentokrát", "trochu", "varoval", "vrátí", "vrátil",
  "vrátit", "jezdí", "mezi", "názor", "nedokázal", "nezajímá", "peněz", "peníze", "pochází", "pocházím", "pouze",
  "pozdě", "později", "pozval", "rozdíl", "rozhodl", "schůzi", "televizi", "ukázal", "vzal", "vzít", "za", "zahradě",
  "zájem", "zajímalo", "zapomněl", "zase", "zatímco", "zdá", "zdálo", "zde", "zdraví", "ze", "země", "zemi",
  "zeptal", "zeptala", "zeptat", "zima", "zimu", "zítra", "zjistil", "změnit", "znám", "znovu", "ztratil", "zůstal",
  "zůstat", "autobus", "autobusem", "bál", "bát", "baví", "během", "bere", "bez", "blízko", "bojí", "bránit", "brát",
  "bratr", "bratra", "bude", "budeme", "budou", "budoucnost", "budu", "době", "dobou", "dobrou", "dobu", "chleba",
  "líbí", "líbit", "nabídl", "nebaví", "nebo", "nebude", "nebudu", "nelíbí", "nelíbil", "oběd", "obědu", "objednal",
  "osobně", "rozbil", "sebe", "sebou", "slíbil", "sobě", "tebe", "tebou", "tobě", "vůbec", "zbavit", "způsob", "aby",
  "abych", "abychom", "abys", "brzy", "by", "bych", "bychom", "byl", "byla", "byli", "bylo", "bys", "byste", "byt",
  "filmy", "hodiny", "chybí", "chybu", "jazyk", "jazyků", "jazyky", "kdy", "kdyby", "kdybych", "my", "myslí",
  "myslím", "naposledy", "nebyl", "nebylo", "někdy", "nikdy", "nyní", "obvykle", "párty", "rychle", "sestry", "syn",
  "tady", "ty", "tyto", "věty", "vy", "vyhodil", "vypadá", "vysvětlit", "zuby", "až", "bohužel", "což", "dokáže",
  "jestliže", "již", "když", "možná", "možnost", "muž", "muže", "může", "můžeme", "můžete", "můžu", "nádraží",
  "nedokáže", "nemůže", "nemůžete", "nepomůže", "než", "okamžitě", "požádal", "protože", "služební", "snaží",
  "snažil", "stěžoval", "takže", "těžko", "už", "vážně", "vždy", "vždycky", "záleží", "žádat", "žádnou", "že",
  "žena", "ženu", "ženy", "žije", "žít", "život", "života", "životě",
  // š ř č é ý (die übrige Zahlenreihe) (216)
  "budeš", "další", "chceš", "ještě", "lepší", "máš", "mladší", "myslíš", "náš", "naše", "našel", "naši", "naší",
  "našli", "navštívil", "navštívit", "nejhorší", "nejlepší", "nejspíš", "nemůžeš", "odešel", "pěšky", "slyšet",
  "starší", "šel", "škole", "školy", "šli", "španělsky", "špatně", "štěstí", "váš", "vaše", "větší", "však", "vše",
  "všech", "všechno", "všechny", "všem", "všichni", "zkoušku", "dobře", "dovnitř", "dříve", "dveře", "kteří",
  "nařídil", "někteří", "nepřišel", "neřekl", "patří", "podařilo", "pořád", "pořádku", "potřeboval", "potřebuje",
  "potřebuji", "přátel", "před", "překládat", "přes", "přesně", "přestal", "při", "přijde", "přijít", "příliš",
  "připraven", "připravil", "přišel", "příště", "příští", "přítel", "řekl", "řekla", "řekli", "řekni", "říct",
  "říká", "říkat", "tři", "věřím", "věřit", "zvířata", "zvíře", "čas", "často", "času", "čeho", "čeká", "čekal",
  "čekat", "čem", "čemu", "česky", "čím", "číslo", "člověk", "čtyři", "doporučil", "klíče", "konečně", "naučil",
  "naučit", "nečekal", "ničeho", "oči", "očí", "počasí", "počítač", "počkat", "proč", "pryč", "půjčil", "půjčit",
  "rodiče", "společnosti", "učí", "učit", "učitel", "určitě", "vánoční", "včas", "včera", "večer", "večeři", "začal",
  "začíná", "začít", "déle", "dobré", "důležité", "jaké", "jasné", "jiné", "jiného", "které", "léky", "lépe", "lidé",
  "malé", "mé", "mého", "méně", "možné", "nějaké", "některé", "nové", "polévku", "problém", "problémy", "přátelé",
  "samé", "snadné", "společného", "staré", "své", "svého", "svém", "svému", "šéf", "šéfem", "špatné", "také",
  "takové", "takového", "té", "téměř", "této", "těžké", "utéct", "velké", "žádné", "být", "býval", "celý", "dobrý",
  "hezký", "hrubý", "jaký", "jediný", "jiný", "každý", "který", "kým", "malý", "minulý", "mladý", "mých", "mým",
  "nějaký", "někým", "nemocný", "nikým", "nový", "prý", "rodný", "spokojený", "starý", "stejný", "svých", "svým",
  "svými", "špatný", "takový", "týden", "umýt", "unavený", "velký", "volný", "výsledky", "zdravý", "zodpovědný",
  "žádný", "ženatý",
  // ˇ g ú x ´ w q ¨ (T3: Háček gibt ď ť ň, Čárka gibt ó) (90)
  "alespoň", "ať", "buď", "buďte", "déšť", "chuť", "kůň", "maďarsky", "nazpaměť", "nezapomeň", "odpověď", "odveďte",
  "šťastného", "šťastnější", "šťastný", "teď", "trať", "vrať", "výpověď", "zeď", "žízeň", "anglicky", "angličtinu",
  "angličtiny", "energie", "fungovat", "funguje", "gauči", "golf", "gramatiku", "kolegy", "legraci", "nefunguje",
  "portugalsky", "program", "reagovat", "švagr", "vegetarián", "účelem", "účet", "údajně", "úklidem", "úkol",
  "úkolu", "úkoly", "úkor", "úmyslně", "úmyslu", "úmysly", "úplně", "úroveň", "úsilí", "úsměv", "úspěch", "úspěchu",
  "úspěšný", "ústa", "úterý", "úvahu", "úžasné", "zúčastnil", "zúčastnit", "existovat", "existuje", "existují",
  "kontextu", "neexistuje", "neexistují", "praxe", "taxi", "taxík", "taxíkem", "text", "texty", "gól", "nervózní",
  "sezóna", "špión", "web", "webová", "webu", "wifi",
  // von Hand ergänzt: Wörter mit `ó` (Čárka + o) - die Messung fand nur vier; ohne weitere hätte der Fokus auf `´` fast nichts zu üben
  "balón", "bonbón", "bóje", "kód", "móda", "salón", "tón", "zóna",
];

/**
 * Alters-gestufter Bonus-Wortschatz (Čeština) - das Gegenstück zu `STUFE_VOCAB_IT` für `stufeVocab()` (`generator.ts`).
 *
 * ★ F6-cs (03.10.2026, Bauplan §3 „Texte"): von Hand NEU auf Tschechisch zusammengestellt (nicht aus `STUFE_VOCAB`/`STUFE_VOCAB_EN`
 * übersetzt), nach den Themen des Bauplans - Kinder: Schule, Tiere (Bergland bis Teich), Natur, Essen (knedlík, koláč, palačinka),
 * Feste (vánoce, masopust, velikonoce), Orte (hrad, zámek, lanovka); Jugend: Freundschaft, Schule, Musik, Sport, Technik, Umwelt,
 * Berufswahl; Erwachsene: Arbeit, Behörden, Wohnen, Gesundheit, Migration, Kultur. Keine Eigennamen, keine Personenwörter für das
 * Kind (Glossar Regel 2), alle Wörter bestehen die Sperrliste (`sperrlisteCs.ts`). Die Schreibung ist gegen die Tatoeba-Sätze
 * geprüft, soweit das Wort dort vorkommt; die übrigen (guma, ježek, houpačka, trdelník …) sind Alltagswörter, die ein Muttersprachler
 * gegenlesen soll (Prüfbericht P7). Wächter: `tests/tastenflow-cs-woerter.test.ts`.
 */
export const STUFE_VOCAB_CS: Record<InhaltsStufe, string[]> = {
  kids: [
    "škola", "třída", "taška", "penál", "tužka", "guma", "pastelky", "sešit", "kniha", "lavice", "tabule", "kamarád",
    "kamarádka", "hřiště", "hrad", "princezna", "drak", "pohádka", "příběh", "koťátko", "štěně", "pes", "kočka",
    "králík", "želva", "motýl", "mravenec", "včela", "šnek", "ježek", "veverka", "vrabec", "čáp", "delfín",
    "velryba", "ryba", "vlaštovka", "sova", "vlk", "medvěd", "liška", "lev", "slon", "žirafa", "ovce", "kráva",
    "kůň", "slepice", "prase", "kachna", "husa", "kamzík", "svišť", "kozorožec", "mrak", "déšť", "duha", "hora",
    "řeka", "jezero", "moře", "pláž", "mušle", "písek", "vlna", "sopka", "les", "louka", "zahrada", "park",
    "houpačka", "skluzavka", "míč", "kolo", "panenka", "hračka", "vláček", "koláč", "buchta", "palačinka", "jahoda",
    "hruška", "jablko", "pomeranč", "citron", "třešeň", "švestka", "meruňka", "polévka", "chleba", "rohlík", "mléko",
    "máslo", "med", "vánoce", "anděl", "betlém", "stromeček", "dárek", "koleda", "masopust", "maska", "velikonoce",
    "kraslice", "pomlázka", "dort", "svíčky", "oslava", "narozeniny", "sníh", "sáňky", "lyže", "chata", "maják",
    "loď", "rybář", "plachta", "tramvaj", "lanovka", "zámek", "věž", "náměstí", "fontána", "trh", "knedlík", "kapr",
    "vánočka", "perník", "houba", "trdelník", "housle", "klavír", "zpěv", "bubínek", "flétna",
  ],
  teens: [
    "přátelství", "důvěra", "úcta", "tajemství", "žert", "úkol", "zkoušení", "test", "vysvědčení", "známka",
    "výzkum", "projekt", "knihovna", "laboratoř", "pokus", "věda", "zeměpis", "dějepis", "matematika", "fyzika",
    "chemie", "koncert", "píseň", "bicí", "festival", "telefon", "obrazovka", "zpráva", "aplikace", "videohra",
    "sluchátka", "tým", "trénink", "zápas", "mistrovství", "soutěž", "vítězství", "porážka", "rozhodčí", "fotbal",
    "volejbal", "plavání", "atletika", "gymnastika", "medaile", "podnebí", "prostředí", "recyklace", "plast",
    "znečištění", "sucho", "solární", "budoucnost", "sen", "volba", "povolání", "praxe", "nádraží", "nástupiště",
    "cestování", "hostel", "dobrodružství", "příroda", "krajina", "kapela", "kytara", "bubny", "zpěvačka", "hudba",
    "kino", "seriál", "film", "sociální", "sítě", "internet", "heslo", "kamera", "fotografie",
  ],
  erwachsen: [
    "kancelář", "schůze", "firma", "zákazník", "mzda", "faktura", "daň", "banka", "ekonomika", "vláda", "obec",
    "úřad", "potvrzení", "formulář", "žádost", "povolení", "smlouva", "nájem", "bydlení", "čtvrť", "účet",
    "zdravotnictví", "nemocnice", "lékař", "vyšetření", "recept", "léčba", "důchod", "odbory", "volby", "občan",
    "spravedlnost", "rovnost", "solidarita", "demokracie", "přistěhovalectví", "integrace", "jazyk", "kultura",
    "dědictví", "muzeum", "divadlo", "noviny", "rozhovor", "univerzita", "studium", "doprava", "provoz", "železnice",
    "dálnice", "zemědělství", "řemeslo", "obchod", "cestovní", "ruch", "zaměstnání", "pracovní", "pohovor",
    "životopis", "kolega", "pojištění", "hypotéka", "rozpočet", "úspory", "reklamace", "záruka", "vyúčtování",
    "odpady",
  ],
};
