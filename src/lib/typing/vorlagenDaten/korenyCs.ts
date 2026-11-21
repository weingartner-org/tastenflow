/**
 * „Původ slov" - das tschechische Gegenstück zu `radiciIt.ts` (Italienisch), `raices.ts` (Spanisch), `racines.ts`
 * (Französisch), `wordRoots.ts` (Englisch) und `fremdwoerter.ts` (Deutsch): eine ÜBUNGSVORLAGE zum Abschreiben für den
 * Lernweg „cs". Jede Zeile lautet `<nápověda> - <slovo>`; wer abschreibt, lernt nebenbei, woher ein Wort kommt.
 *
 * ★ CS-W (09.10.2026): Aufbau wie `RADICI` (drei Altersstufen, 80 Paare je Stufe, 240 zusammen, fünf Themen mit 20/15/15/15/15),
 * Inhalt neu auf Tschechisch zusammengestellt und geschrieben - nichts übersetzt. Fünf Themen, weil das Tschechische seine Wörter
 * aus anderen Quellen hat als das Italienische: Latein und Griechisch (der Schulwortschatz), das Deutsche (Jahrhunderte
 * Nachbarschaft: Handwerk, Küche, Haus), Französisch und Italienisch (Kultur, Bühne, Musik, Küche), Englisch und ferne Sprachen
 * (Sport, Natur, Japan, Arabien, Amerika), dazu die Wortfamilien der eigenen Sprache (Vor- und Nachsilben: pekař, nádraží,
 * přístav, zkušenost).
 *
 * ── Beleg ─────────────────────────────────────────────────────────────────────────────────────────────────────
 * ⚠️ NICHT NACHGELESEN. Es gab in dieser Sitzung kein Netz: die Herkunft jedes Wortes steht aus eigenem Sprachwissen [G]
 * (Etymologisches Wörterbuch, Schulwissen), NICHT an cs.wiktionary.org oder dem Etymologický slovník gelesen. Aufgenommen ist
 * nur, was als sicher gilt; was nach Zweifel aussah (kabát, šál, šnek, ofina, krabice, hazard, tabák, alkohol, pistole,
 * haubice …) blieb draussen - lieber weniger. Die Lese-Abnahme durch eine Person mit Tschechisch als Erstsprache gehört in
 * den Prüfbericht P7 (Leitfaden Falle 59); `puvod` ist nur für die Lehrkraft und wird beim Abtippen nicht gezeigt.
 * Bewusst nicht aufgenommen: Waffen, Krieg, Tod, Rausch, Glaube, Politik.
 *
 * ── Zeilenregeln (Wächter: `tests/tastenflow-vorlage-koreny-cs.test.ts`) ──────────────────────────────────────
 * - höchstens 40 Zeichen (Braillezeile), genau ein Trenner ` - `;
 * - `slovo` ein Einzelwort, klein; `napoveda` enthält es nicht;
 * - kein Wort doppelt, in keiner Stufe und über die Stufen hinweg;
 * - kein Wort der Sperrliste `gesperrtCs` (Kern UND Wortbasis), weder im Wort noch im Hinweis;
 * - nur Zeichen, die `cs` UND `cs-qwerty` tippen, keine grossen Akzentbuchstaben;
 * - keine Vergangenheit der 2. Person, kein Geschlecht der tippenden Person (Glossar Regel 2).
 */

export type KorenStufe = "kids" | "teens" | "erwachsen";

/** Nur ein Hinweis für die Lehrkraft - wird beim Abtippen nicht gezeigt. */
export type KorenPuvod =
  | "řečtina" | "latina" | "němčina" | "francouzština" | "italština" | "angličtina"
  | "arabština" | "turečtina" | "japonština" | "čínština" | "hindština" | "inuitština"
  | "domorodé" | "nahuatl" | "malajština" | "swahilština" | "perština"
  | "čeština";

export interface KorenPaar {
  /** Kurze, wahre Umschreibung der Bedeutung - nicht das Wort selbst. */
  napoveda: string;
  /** Das Wort selbst - ein Einzelwort. */
  slovo: string;
  puvod: KorenPuvod;
}

export interface KorenTema {
  id: string;
  titel: string;
  paare: KorenPaar[];
}

export const KORENY_TEMATA: readonly { id: string; titel: string }[] = [
  { id: "recko-latina", titel: "Řecké a latinské kořeny" },
  { id: "nemcina", titel: "Slova z němčiny" },
  { id: "romanske", titel: "Slova z francouzštiny a italštiny" },
  { id: "svet", titel: "Slova z angličtiny a z dalekých zemí" },
  { id: "rodiny", titel: "Rodiny slov" },
];

function p(napoveda: string, slovo: string, puvod: KorenPuvod): KorenPaar {
  return { napoveda, slovo, puvod };
}

export const KORENY: Record<KorenStufe, KorenTema[]> = {
  // ------------------------------------------------------------ kids (8-11)
  kids: [
    { id: "recko-latina", titel: "Řecké a latinské kořeny", paare: [
      p("voláš s někým, kdo je daleko", "telefon", "řečtina"),
      p("ukáže, co je velmi malé", "mikroskop", "řečtina"),
      p("obří ještěr z dávných dob", "dinosaurus", "řečtina"),
      p("obrázek z fotoaparátu", "fotografie", "řečtina"),
      p("učí o zemích a řekách", "geografie", "řečtina"),
      p("obíhá kolem hvězdy", "planeta", "řečtina"),
      p("létá vesmírem s ohonem", "kometa", "řečtina"),
      p("hřiště s mnoha řadami sedadel", "stadion", "řečtina"),
      p("sbírky starých věcí", "muzeum", "řečtina"),
      p("skleněná nádrž s rybami", "akvárium", "latina"),
      p("létá a nahoře má vrtuli", "helikoptéra", "řečtina"),
      p("největší vodní plocha na zemi", "oceán", "řečtina"),
      p("knížka plná map", "atlas", "řečtina"),
      p("ukazuje dny a měsíce", "kalendář", "latina"),
      p("šedesát vteřin", "minuta", "latina"),
      p("učí o číslech a tvarech", "matematika", "řečtina"),
      p("učí o živých tvorech", "biologie", "řečtina"),
      p("zpěvná linka písně", "melodie", "řečtina"),
      p("sušené rostliny v knize", "herbář", "latina"),
      p("cvičení na kladině", "gymnastika", "řečtina"),
    ] },
    { id: "nemcina", titel: "Slova z němčiny", paare: [
      p("nosíš v ní sešity", "taška", "němčina"),
      p("z ní se staví zeď", "cihla", "němčina"),
      p("česká příloha k omáčce", "knedlík", "němčina"),
      p("plátek masa na chleba", "šunka", "němčina"),
      p("malé kulaté pečivo", "žemle", "němčina"),
      p("nosíš je na nose", "brýle", "němčina"),
      p("kovový, má závit a hlavičku", "šroub", "němčina"),
      p("nejtenčí konec tužky", "špička", "němčina"),
      p("zapíná kabát", "knoflík", "němčina"),
      p("pije se z něj čaj", "šálek", "němčina"),
      p("sladká bílá sypká věc", "cukr", "němčina"),
      p("trh s mnoha stánky", "jarmark", "němčina"),
      p("hlíza z pole", "brambor", "němčina"),
      p("nádoba s uchem na vodu", "kýbl", "němčina"),
      p("pohyb do rytmu hudby", "tanec", "němčina"),
    ] },
    { id: "romanske", titel: "Slova z francouzštiny a italštiny", paare: [
      p("pokrm z vajec na pánvi", "omeleta", "francouzština"),
      p("dlouhé francouzské pečivo", "bageta", "francouzština"),
      p("ovoce uvařené ve sklenici", "kompot", "francouzština"),
      p("kam se parkuje auto", "garáž", "francouzština"),
      p("malá sladkost na cucání", "bonbon", "francouzština"),
      p("malá terasa u okna", "balkon", "italština"),
      p("voní z flakonku", "parfém", "francouzština"),
      p("chrání před deštěm", "paraple", "francouzština"),
      p("stůl s jídlem a pitím", "bufet", "francouzština"),
      p("kulatý italský pokrm se sýrem", "pizza", "italština"),
      p("dlouhé tenké těstoviny", "špagety", "italština"),
      p("tam se ukládají peníze", "banka", "italština"),
      p("průvod v maskách", "karneval", "italština"),
      p("divadlo, kde se zpívá", "opera", "italština"),
      p("zelená zelenina jako okurka", "cuketa", "italština"),
    ] },
    { id: "svet", titel: "Slova z angličtiny a z dalekých zemí", paare: [
      p("hra s míčem a dvěma brankami", "fotbal", "angličtina"),
      p("hra s pukem na ledě", "hokej", "angličtina"),
      p("míč v brance", "gól", "angličtina"),
      p("družstvo hráčů", "tým", "angličtina"),
      p("sobota a neděle", "víkend", "angličtina"),
      p("příběh v obrázcích", "komiks", "angličtina"),
      p("ovocný nápoj", "džus", "angličtina"),
      p("horký nápoj z listů", "čaj", "čínština"),
      p("voní z pražených zrn", "káva", "arabština"),
      p("sladká tabulka z kakaa", "čokoláda", "nahuatl"),
      p("úzká lodička s pádlem", "kajak", "inuitština"),
      p("sněžný dům Inuitů", "iglú", "inuitština"),
      p("dřevo, které se vrací zpět", "bumerang", "domorodé"),
      p("skáče a má vak na bříšku", "kenguru", "domorodé"),
      p("dutá tvrdá tráva", "bambus", "malajština"),
    ] },
    { id: "rodiny", titel: "Rodiny slov", paare: [
      p("peče chleba v pekárně", "pekař", "čeština"),
      p("vaří v kuchyni", "kuchař", "čeština"),
      p("stará se o zahradu", "zahradník", "čeština"),
      p("místo na hraní", "hřiště", "čeština"),
      p("kam jezdí vlaky", "nádraží", "čeština"),
      p("prodávají se tam léky", "lékárna", "čeština"),
      p("půjčují se tam knihy", "knihovna", "čeština"),
      p("oblečení na plavání", "plavky", "čeština"),
      p("postava ze sněhových koulí", "sněhulák", "čeština"),
      p("pohádkový tvor žijící ve vodě", "vodník", "čeština"),
      p("leze po skalách a horách", "horolezec", "čeština"),
      p("řídí auto nebo autobus", "řidič", "čeština"),
      p("chytá ryby na udici", "rybář", "čeština"),
      p("titulek nad textem", "nadpis", "čeština"),
      p("jméno napsané pod textem", "podpis", "čeština"),
    ] },
  ],

  // ------------------------------------------------------------ teens (12-16)
  teens: [
    { id: "recko-latina", titel: "Řecké a latinské kořeny", paare: [
      p("plynný obal kolem planety", "atmosféra", "řečtina"),
      p("přístroj na pozorování hvězd", "teleskop", "řečtina"),
      p("přenáší hlas do reproduktoru", "mikrofon", "řečtina"),
      p("trubice na pohled z ponorky", "periskop", "řečtina"),
      p("slovo stejného významu", "synonymum", "řečtina"),
      p("pravidla stavby vět", "gramatika", "řečtina"),
      p("umění psaného slova", "literatura", "latina"),
      p("mnoho hudebníků pod taktovkou", "orchestr", "řečtina"),
      p("dlouhé dílo pro orchestr", "symfonie", "řečtina"),
      p("obrázek s čísly a čarami", "diagram", "řečtina"),
      p("nauka o zvuku", "akustika", "řečtina"),
      p("stavba v Egyptě, špičatá", "pyramida", "řečtina"),
      p("spleť chodeb, kde zabloudíš", "labyrint", "řečtina"),
      p("věda o dávných nálezech", "archeologie", "řečtina"),
      p("mikroskopický živý tvor", "bakterie", "řečtina"),
      p("látka v ovoci a zelenině", "vitamín", "latina"),
      p("hora, ze které vychází láva", "vulkán", "latina"),
      p("letí do vesmíru v raketě", "astronaut", "řečtina"),
      p("čára mezi nebem a zemí", "horizont", "řečtina"),
      p("tvor se šesti nohama", "insekt", "latina"),
    ] },
    { id: "nemcina", titel: "Slova z němčiny", paare: [
      p("střešní destička ze dřeva", "šindel", "němčina"),
      p("ten, kdo něco umí nejlépe", "mistr", "němčina"),
      p("tvoří obrazy barvami", "malíř", "němčina"),
      p("ohnutý kus kovu na zavěšení", "hák", "němčina"),
      p("tučné uzené maso", "špek", "němčina"),
      p("sladká pěna na dort", "šlehačka", "němčina"),
      p("tenký provaz na prádlo", "šňůra", "němčina"),
      p("pohádkový jezdec v brnění", "rytíř", "němčina"),
      p("tenká kovová deska", "plech", "němčina"),
      p("plochá nádoba na jídlo", "talíř", "němčina"),
      p("balíš do něj na cestu", "kufr", "němčina"),
      p("nosíš ho na zádech na túru", "ruksak", "němčina"),
      p("na nafukování kol", "pumpa", "němčina"),
      p("zavřou se před vlakem", "šraňky", "němčina"),
      p("spolek řemeslníků", "cech", "němčina"),
    ] },
    { id: "romanske", titel: "Slova z francouzštiny a italštiny", paare: [
      p("nástroj s klávesami", "klavír", "francouzština"),
      p("malovaná stěna na jevišti", "kulisa", "francouzština"),
      p("dělá riskantní scény ve filmu", "kaskadér", "francouzština"),
      p("svítí ze stropu", "lustr", "francouzština"),
      p("lehká budova v parku", "pavilon", "francouzština"),
      p("směs syrové zeleniny", "salát", "italština"),
      p("sladký šumivý nápoj", "limonáda", "francouzština"),
      p("dílna malíře", "ateliér", "francouzština"),
      p("řídí natáčení filmu", "režisér", "francouzština"),
      p("oblečení herce", "kostým", "francouzština"),
      p("strunný nástroj z Itálie", "mandolína", "italština"),
      p("lodička z Benátek", "gondola", "italština"),
      p("tanec na špičkách", "balet", "italština"),
      p("malíř na ní míchá barvy", "paleta", "francouzština"),
      p("hudební skladba o částech", "sonáta", "italština"),
    ] },
    { id: "svet", titel: "Slova z angličtiny a z dalekých zemí", paare: [
      p("hra s raketou a sítí", "tenis", "angličtina"),
      p("míč přes síť rukama", "volejbal", "angličtina"),
      p("míč do koše", "basketbal", "angličtina"),
      p("světová síť počítačů", "internet", "angličtina"),
      p("modré kalhoty z denimu", "džíny", "angličtina"),
      p("dva krajíce s nádivkou", "sendvič", "angličtina"),
      p("místo na stanování", "kemp", "angličtina"),
      p("kysaný mléčný pokrm", "jogurt", "turečtina"),
      p("kysaný nápoj z Kavkazu", "kefír", "turečtina"),
      p("obří vlna po zemětřesení", "tsunami", "japonština"),
      p("sport na žíněnkách", "judo", "japonština"),
      p("japonský sport s údery", "karate", "japonština"),
      p("rýže se syrovou rybou", "sushi", "japonština"),
      p("skládání papíru", "origami", "japonština"),
      p("černobílý medvěd z Asie", "panda", "hindština"),
    ] },
    { id: "rodiny", titel: "Rodiny slov", paare: [
      p("píše knihy", "spisovatel", "čeština"),
      p("rád cestuje po světě", "cestovatel", "čeština"),
      p("čte knihy", "čtenář", "čeština"),
      p("poslouchá přednášku", "posluchač", "čeština"),
      p("dívá se na představení", "divák", "čeština"),
      p("běží závod", "běžec", "čeština"),
      p("plave v bazénu", "plavec", "čeština"),
      p("tam kotví lodě", "přístav", "čeština"),
      p("zeď, která zadrží řeku", "přehrada", "čeština"),
      p("cesta u břehu řeky", "nábřeží", "čeština"),
      p("pás země u moře", "pobřeží", "čeština"),
      p("pohled z výšky do dálky", "výhled", "čeština"),
      p("říkáš ji na otázku", "odpověď", "čeština"),
      p("poznámky ze schůzky", "zápis", "čeština"),
      p("prodává zboží v obchodě", "prodavač", "čeština"),
    ] },
  ],

  // ------------------------------------------------------------ erwachsen
  erwachsen: [
    { id: "recko-latina", titel: "Řecké a latinské kořeny", paare: [
      p("domněnka k ověření", "hypotéza", "řečtina"),
      p("rozbor na jednotlivé části", "analýza", "řečtina"),
      p("spojení částí v celek", "syntéza", "řečtina"),
      p("ucelený soubor vysvětlení", "teorie", "řečtina"),
      p("věda o hospodaření", "ekonomie", "řečtina"),
      p("otázky o smyslu věcí", "filozofie", "řečtina"),
      p("věda o myšlení a cítění", "psychologie", "řečtina"),
      p("věda o výchově a učení", "pedagogika", "řečtina"),
      p("přenesené pojmenování", "metafora", "řečtina"),
      p("zdánlivý rozpor", "paradox", "řečtina"),
      p("podobnost mezi dvěma věcmi", "analogie", "řečtina"),
      p("plánovaný postup", "metoda", "řečtina"),
      p("okraj města", "periferie", "řečtina"),
      p("pohled do budoucna", "perspektiva", "latina"),
      p("přesné vymezení pojmu", "definice", "latina"),
      p("sdělení o nějaké věci", "informace", "latina"),
      p("dorozumívání mezi lidmi", "komunikace", "latina"),
      p("podnět k tvorbě", "inspirace", "latina"),
      p("schopnost konat práci", "energie", "řečtina"),
      p("nauka o tvarech a úhlech", "geometrie", "řečtina"),
    ] },
    { id: "nemcina", titel: "Slova z němčiny", paare: [
      p("skvrna na oblečení", "flek", "němčina"),
      p("pracovní směna", "šichta", "němčina"),
      p("závin s jablky", "štrúdl", "němčina"),
      p("obchodník s drobným zbožím", "kramář", "němčina"),
      p("starý kov na výkup", "šrot", "němčina"),
      p("teplá kožešina na zimu", "futro", "němčina"),
      p("zátka do lahve", "špunt", "němčina"),
      p("výsuvná část stolu", "šuplík", "němčina"),
      p("malý obchod", "krám", "němčina"),
      p("obdélník kolem obrazu", "rám", "němčina"),
      p("šlechtický titul", "hrabě", "němčina"),
      p("obchod, slangově", "kšeft", "němčina"),
      p("kam míříš", "cíl", "němčina"),
      p("nástroj truhláře na dřevo", "hoblík", "němčina"),
      p("vůz plný sena", "fůra", "němčina"),
    ] },
    { id: "romanske", titel: "Slova z francouzštiny a italštiny", paare: [
      p("zpráva z místa dění", "reportáž", "francouzština"),
      p("tmavý obrys postavy", "silueta", "francouzština"),
      p("profesní postup", "kariéra", "francouzština"),
      p("pochvala, milé slovo", "kompliment", "francouzština"),
      p("krytá ulička s obchody", "pasáž", "francouzština"),
      p("naprostý nezdar", "fiasko", "italština"),
      p("bez prozrazení jména", "inkognito", "italština"),
      p("kresba s přehnanými rysy", "karikatura", "italština"),
      p("text opery", "libreto", "italština"),
      p("největší smyčcový nástroj", "kontrabas", "italština"),
      p("tuhý papír", "karton", "italština"),
      p("období po středověku", "renesance", "francouzština"),
      p("zahájení výstavy", "vernisáž", "francouzština"),
      p("poslední kolo soutěže", "finále", "italština"),
      p("běžci si předávají kolík", "štafeta", "italština"),
    ] },
    { id: "svet", titel: "Slova z angličtiny a z dalekých zemí", paare: [
      p("hustý tropický les", "džungle", "hindština"),
      p("japonský tradiční oděv", "kimono", "japonština"),
      p("zakrslý stromek v misce", "bonsaj", "japonština"),
      p("výprava za divokou zvěří", "safari", "swahilština"),
      p("domek v přízemí", "bungalov", "hindština"),
      p("mycí prostředek na vlasy", "šampon", "hindština"),
      p("oblek na spaní", "pyžamo", "hindština"),
      p("trh s použitým zbožím", "bazar", "perština"),
      p("hra na čtvercové desce", "šachy", "perština"),
      p("zelená listová zelenina", "špenát", "perština"),
      p("má nejdelší krk", "žirafa", "arabština"),
      p("prášek na horký nápoj", "kakao", "nahuatl"),
      p("počítání s písmeny", "algebra", "arabština"),
      p("časopis s obrázky", "magazín", "arabština"),
      p("měkká podložka v posteli", "matrace", "arabština"),
    ] },
    { id: "rodiny", titel: "Rodiny slov", paare: [
      p("klimatické podmínky kraje", "podnebí", "čeština"),
      p("co se předem očekává", "předpoklad", "čeština"),
      p("shoda v názoru", "souhlas", "čeština"),
      p("to, co chybí", "nedostatek", "čeština"),
      p("vedení dětí k dospělosti", "výchova", "čeština"),
      p("získané znalosti", "vzdělání", "čeština"),
      p("práce na smlouvu", "zaměstnání", "čeština"),
      p("pochopení druhého", "porozumění", "čeština"),
      p("poznatky z dlouhé praxe", "zkušenost", "čeština"),
      p("naučená praktická šikovnost", "dovednost", "čeština"),
      p("to, co dokážeš dělat", "schopnost", "čeština"),
      p("znak, kterým se někdo liší", "vlastnost", "čeština"),
      p("tušit, co přijde", "předvídat", "čeština"),
      p("soustředění na jednu věc", "pozornost", "čeština"),
      p("místo, kde se peče chléb", "pekárna", "čeština"),
    ] },
  ],
};

/** Die Zeile eines Paares: zuerst die Umschreibung, dann das Wort. */
export function korenZeile(x: KorenPaar): string {
  return `${x.napoveda} - ${x.slovo}`;
}

/**
 * Dieselben Wörter, alphabetisch nach `napoveda` (tschechische Sortierung) - für die Tippchallenge, wie
 * `RADICI_ALFABETICO` (radiciIt.ts).
 */
export const KORENY_ABECEDNE: Record<KorenStufe, string[]> = Object.fromEntries(
  (Object.keys(KORENY) as KorenStufe[]).map((stufe) => [
    stufe,
    KORENY[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.napoveda.localeCompare(b.napoveda, "cs"))
      .map(korenZeile),
  ]),
) as Record<KorenStufe, string[]>;
