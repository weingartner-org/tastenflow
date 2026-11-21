/**
 * „Korzenie i zapożyczenia" - das polnische Gegenstück zu `radiciIt.ts` (Italienisch), `raices.ts` (Spanisch),
 * `racines.ts` (Französisch), `wordRoots.ts` (Englisch) und `fremdwoerter.ts` (Deutsch): eine ÜBUNGSVORLAGE zum
 * Abschreiben für den Lernweg „pl". Jede Zeile lautet `<wskazówka> - <słowo>`; wer abschreibt, lernt nebenbei, woher ein
 * Wort kommt oder wie es gebaut ist.
 *
 * ★ PL-W (09.10.2026): Aufbau wie `RADICI` (drei Altersstufen, 80 Paare je Stufe, 240 zusammen, fünf Themen mit
 * 20/15/15/15/15), Inhalt neu auf Polnisch zusammengestellt und geschrieben - nichts übersetzt (Johannes: *„keine texte
 * werden übersetzt"*, *„die texte sollen einen bezug zum land und sprache haben"*). Fünf Themen, weil das Polnische seine
 * Wörter aus anderen Quellen hat als das Italienische:
 *
 *  • „Rdzenie greckie i łacińskie" (20) - der Schulwortschatz (telefon, biblioteka, geografia, wulkan …).
 *  • „Słowa z niemieckiego" (15) - das Erbe der Städte und Zünfte (ratusz, rynek, gmina, sołtys, wójt, cech, szlachta),
 *    dazu Alltag (dach, cukier, talerz) und der Bernstein von der Ostsee (bursztyn).
 *  • „Słowa z francuskiego" (15) - Reise, Küche, Wohnung (bagaż, kotlet, fotel) und die Wörter auf -aż (garaż, pejzaż,
 *    masaż, reportaż …), die im Polnischen eine eigene Familie bilden.
 *  • „Słowa z angielskiego i dalekich języków" (15) - Sport und Technik, aber auch das Türkische (kawa, jogurt, kilim), das
 *    Ungarische (szabla, husarz, gulasz, papryka), das Tschechische (robot), das Japanische und Sprachen Amerikas,
 *    Australiens und der Arktis (kajak, kondor, kangur).
 *  • „Jak powstają polskie słowa" (15) - die Wortbildung: Verkleinerung (domek, kotek), Zusammensetzung (samochód,
 *    wodospad, stonoga), Ableitung (lodówka, odkurzacz). Hier ist das Polnische am eigensten.
 *
 * ── Belege ─────────────────────────────────────────────────────────────────
 * ⚠️ Anders als bei `radiciIt.ts` NICHT an der Rohseite gelesen: der Bau lief ohne Netz. Jede Herkunft stammt aus dem
 * Sprachwissen und nur Wörter mit gesicherter, einhelliger Etymologie wurden aufgenommen (Zweifel ⇒ weggelassen: *kiełbasa,
 * bigos, oscypek, bohater, dyktando, pingwin, banan* …). `beleg` ist die Seite von pl.wiktionary.org, an der die Herkunft
 * VOR der Freigabe gegengelesen wird (Prüfauftrag im Befund `BEFUND-2026-10-09-PL-WURZELN-EXPEDITION-LEKTIONEN.md`).
 * `origine` nennt die Sprache, aus der das Wort ins Polnische kam (*kawa*: türkisch, ursprünglich arabisch ⇒ „turecki";
 * *jacht*: niederländisch); nur für die Lehrkraft, beim Abtippen nicht gezeigt.
 *
 * ── Zeilenregeln (Wächter: `tests/tastenflow-vorlage-korzenie-pl.test.ts`) ────────────────────────
 * - höchstens 40 Zeichen (Braillezeile), genau ein Trenner ` - `;
 * - `slowo` ein Einzelwort, klein; `wskazowka` enthält es nicht;
 * - kein Wort doppelt, in keiner Stufe und über die Stufen hinweg;
 * - kein Wort der Sperrliste `gesperrtPl` (Kern UND Wortbasis), weder im Wort noch im Hinweis;
 * - nur Zeichen, die `pl` tippt (die neun polnischen Buchstaben über AltGr), gerade Anführung, ASCII-Apostroph;
 * - kein Geschlecht der tippenden Person, keine Anrede „Pan/Pani" (Hinweise sind Sachbeschreibungen).
 */

export type KorzenStufe = "kids" | "teens" | "erwachsen";

/** Nur ein Hinweis für die Lehrkraft - wird beim Abtippen nicht gezeigt. */
export type KorzenOrigine =
  | "greka" | "łacina"
  | "niemiecki" | "francuski" | "angielski" | "holenderski"
  | "turecki" | "węgierski" | "czeski"
  | "japoński" | "inuicki" | "keczua" | "nahuatl" | "tupi" | "aborygeński" | "hindi" | "polinezyjski" | "malajski"
  | "zdrobnienie" | "złożenie" | "pochodne";

export interface KorzenPaar {
  /** Kurze, wahre Umschreibung der Bedeutung - nicht das Wort selbst. */
  wskazowka: string;
  /** Das Wort selbst - ein Einzelwort. */
  slowo: string;
  origine: KorzenOrigine;
  /** Die pl.wiktionary-Seite, an der `origine` vor der Freigabe gegengelesen wird (CC BY-SA 4.0). */
  beleg: string;
}

export interface KorzenTemat {
  id: string;
  titel: string;
  paare: KorzenPaar[];
}

export const KORZENIE_TEMATY: readonly { id: string; titel: string }[] = [
  { id: "greka-lacina", titel: "Rdzenie greckie i łacińskie" },
  { id: "niemiecki", titel: "Słowa z niemieckiego" },
  { id: "francuski", titel: "Słowa z francuskiego" },
  { id: "dalekie", titel: "Słowa z angielskiego i dalekich języków" },
  { id: "slowotworstwo", titel: "Jak powstają polskie słowa" },
];

function w(slowo: string): string {
  return `https://pl.wiktionary.org/wiki/${slowo}`;
}

function p(wskazowka: string, slowo: string, origine: KorzenOrigine): KorzenPaar {
  return { wskazowka, slowo, origine, beleg: w(slowo) };
}

export const KORZENIE: Record<KorzenStufe, KorzenTemat[]> = {
  // ------------------------------------------------------------ kids (8-11)
  kids: [
    { id: "greka-lacina", titel: "Rdzenie greckie i łacińskie", paare: [
      p("urządzenie do dzwonienia", "telefon", "greka"),
      p("gad sprzed milionów lat", "dinozaur", "greka"),
      p("zwierzę z afrykańskich rzek", "hipopotam", "greka"),
      p("pokazuje to, co maleńkie", "mikroskop", "greka"),
      p("kapelusz w kształcie rury", "cylinder", "greka"),
      p("nauka o górach i rzekach", "geografia", "greka"),
      p("tu pożyczasz książki", "biblioteka", "greka"),
      p("krąży wokół Słońca", "planeta", "greka"),
      p("ma świecący ogon", "kometa", "greka"),
      p("obraz zrobiony światłem", "fotografia", "greka"),
      p("lata dzięki śmigłu", "helikopter", "greka"),
      p("w nim pływają rybki", "akwarium", "łacina"),
      p("tam się uczysz", "szkoła", "łacina"),
      p("wielu muzyków gra razem", "orkiestra", "greka"),
      p("wszystkie litery po kolei", "alfabet", "greka"),
      p("książka z mapami", "atlas", "greka"),
      p("pokazuje dni i miesiące", "kalendarz", "łacina"),
      p("piszesz po niej kredą", "tablica", "łacina"),
      p("klauni i akrobaci", "cyrk", "łacina"),
      p("góra, która wyrzuca lawę", "wulkan", "łacina"),
    ] },
    { id: "niemiecki", titel: "Słowa z niemieckiego", paare: [
      p("na górze domu", "dach", "niemiecki"),
      p("otwarta przestrzeń w mieście", "plac", "niemiecki"),
      p("słodkie białe kryształki", "cukier", "niemiecki"),
      p("jesz z niego obiad", "talerz", "niemiecki"),
      p("kąpiesz się w niej", "wanna", "niemiecki"),
      p("z niego płynie woda", "kran", "niemiecki"),
      p("wysuwana część biurka", "szuflada", "niemiecki"),
      p("różowa na kanapce", "szynka", "niemiecki"),
      p("chrupiący z kratką", "wafel", "niemiecki"),
      p("złoto znad Bałtyku", "bursztyn", "niemiecki"),
      p("drewniany schowek w ogrodzie", "szopa", "niemiecki"),
      p("pokój kapitana na statku", "kajuta", "niemiecki"),
      p("szkło w oknie", "szyba", "niemiecki"),
      p("zadaszone wejście do domu", "ganek", "niemiecki"),
      p("cienki, mocny, do wiązania", "sznur", "niemiecki"),
    ] },
    { id: "francuski", titel: "Słowa z francuskiego", paare: [
      p("walizki i torby w podróży", "bagaż", "francuski"),
      p("kwiaty związane razem", "bukiet", "francuski"),
      p("lata nad ziemią, kolorowy", "balon", "francuski"),
      p("kupujesz go do pociągu", "bilet", "francuski"),
      p("miękki, do siedzenia", "fotel", "francuski"),
      p("pakujesz w nią rzeczy", "walizka", "francuski"),
      p("słodkie na koniec obiadu", "deser", "francuski"),
      p("panierowane mięso", "kotlet", "francuski"),
      p("usmażone ubite jajka", "omlet", "francuski"),
      p("płynny dodatek do makaronu", "sos", "francuski"),
      p("tu stoi samochód", "garaż", "francuski"),
      p("piasek nad morzem", "plaża", "francuski"),
      p("owoce w wodzie z cukrem", "kompot", "francuski"),
      p("stół, krzesło i szafa", "mebel", "francuski"),
      p("marynarka i spodnie razem", "garnitur", "francuski"),
    ] },
    { id: "dalekie", titel: "Słowa z angielskiego i dalekich języków", paare: [
      p("ma ekran i klawiaturę", "komputer", "angielski"),
      p("dwie drużyny na boisku", "mecz", "angielski"),
      p("bieganie, pływanie, gra", "sport", "angielski"),
      p("uczy drużynę gry", "trener", "angielski"),
      p("droga pod górą", "tunel", "angielski"),
      p("owoce zagotowane z cukrem", "dżem", "angielski"),
      p("niebieskie spodnie", "dżinsy", "angielski"),
      p("mały motocykl miejski", "skuter", "angielski"),
      p("żaglówka do pływania", "jacht", "holenderski"),
      p("czarny napój z ziaren", "kawa", "turecki"),
      p("liście zalane gorącą wodą", "herbata", "łacina"),
      p("kwaśny mleczny napój", "jogurt", "turecki"),
      p("owoc z kolcami na liściach", "ananas", "tupi"),
      p("proszek do gorącego napoju", "kakao", "nahuatl"),
      p("słodka tabliczka z kakao", "czekolada", "nahuatl"),
    ] },
    { id: "slowotworstwo", titel: "Jak powstają polskie słowa", paare: [
      p("mały dom", "domek", "zdrobnienie"),
      p("mały kot", "kotek", "zdrobnienie"),
      p("mały pies", "piesek", "zdrobnienie"),
      p("mały kwiat", "kwiatek", "zdrobnienie"),
      p("mała ręka", "rączka", "zdrobnienie"),
      p("mały stół", "stolik", "zdrobnienie"),
      p("ma cztery koła i silnik", "samochód", "złożenie"),
      p("leci po niebie z pasażerami", "samolot", "złożenie"),
      p("spada z gór, np. w Tatrach", "wodospad", "złożenie"),
      p("ma sto nóg", "stonoga", "złożenie"),
      p("koń z jednym rogiem", "jednorożec", "złożenie"),
      p("dla dzieci przed szkołą", "przedszkole", "złożenie"),
      p("nosi listy do domów", "listonosz", "złożenie"),
      p("zimna szafka na jedzenie", "lodówka", "pochodne"),
      p("kręci go wiatr", "wiatrak", "pochodne"),
    ] },
  ],
  // ------------------------------------------------------------ teens (12-16)
  teens: [
    { id: "greka-lacina", titel: "Rdzenie greckie i łacińskie", paare: [
      p("przybliża gwiazdy", "teleskop", "greka"),
      p("mierzy temperaturę", "termometr", "greka"),
      p("tysiąc metrów", "kilometr", "greka"),
      p("nauka o dawnych czasach", "historia", "greka"),
      p("liczby, równania, wzory", "matematyka", "greka"),
      p("nauka o kątach i figurach", "geometria", "greka"),
      p("nauka o życiu", "biologia", "greka"),
      p("nauka o ochronie przyrody", "ekologia", "greka"),
      p("nauka o gwiazdach", "astronomia", "greka"),
      p("leci rakietą w kosmos", "astronauta", "greka"),
      p("powietrze wokół Ziemi", "atmosfera", "greka"),
      p("zimny, ciepły, wilgotny", "klimat", "greka"),
      p("Droga Mleczna to jedna", "galaktyka", "greka"),
      p("przestrzeń poza Ziemią", "kosmos", "greka"),
      p("scena, aktorzy i widownia", "teatr", "greka"),
      p("uczelnia po liceum", "uniwersytet", "łacina"),
      p("próba wiedzy na koniec nauki", "egzamin", "łacina"),
      p("rozmowa dwóch osób", "dialog", "greka"),
      p("wyraz o tym samym znaczeniu", "synonim", "greka"),
      p("wyraz o przeciwnym znaczeniu", "antonim", "greka"),
    ] },
    { id: "niemiecki", titel: "Słowa z niemieckiego", paare: [
      p("tu urzęduje władza miasta", "ratusz", "niemiecki"),
      p("główny plac w Krakowie", "rynek", "niemiecki"),
      p("tablica nad drzwiami sklepu", "szyld", "niemiecki"),
      p("podaje dania w restauracji", "kelner", "niemiecki"),
      p("dawny wysoki urzędnik króla", "kanclerz", "niemiecki"),
      p("ciepłe okrycie po kąpieli", "szlafrok", "niemiecki"),
      p("kwota do zapłaty", "rachunek", "niemiecki"),
      p("kupowanie i sprzedawanie", "handel", "niemiecki"),
      p("jarmark z zabawą", "kiermasz", "niemiecki"),
      p("grupa roślin lub zwierząt", "gatunek", "niemiecki"),
      p("chroni głowę rycerza", "hełm", "niemiecki"),
      p("mistrz rzemiosła", "majster", "niemiecki"),
      p("robi zamki i klucze", "ślusarz", "niemiecki"),
      p("tu leczą chorych", "szpital", "niemiecki"),
      p("wyznaczona ścieżka w górach", "szlak", "niemiecki"),
    ] },
    { id: "francuski", titel: "Słowa z francuskiego", paare: [
      p("tu pracuje się przy biurku", "biuro", "francuski"),
      p("tu widać film lub grę", "ekran", "francuski"),
      p("stoi przy nim pociąg", "peron", "francuski"),
      p("w niej jest list", "koperta", "francuski"),
      p("farby na twarzy", "makijaż", "francuski"),
      p("strzyże włosy", "fryzjer", "francuski"),
      p("dwie rurki do patrzenia w dal", "lornetka", "francuski"),
      p("szafa z szufladami", "komoda", "francuski"),
      p("listewki na oknie", "żaluzja", "francuski"),
      p("gumowe buty na deszcz", "kalosze", "francuski"),
      p("plakat na ścianie", "afisz", "francuski"),
      p("prowadzi samochód", "szofer", "francuski"),
      p("stół ze zimnymi przekąskami", "bufet", "francuski"),
      p("tajny kod", "szyfr", "francuski"),
      p("widok na pola i lasy", "pejzaż", "francuski"),
    ] },
    { id: "dalekie", titel: "Słowa z angielskiego i dalekich języków", paare: [
      p("skacze z workiem na brzuchu", "kangur", "aborygeński"),
      p("wraca do ręki po rzucie", "bumerang", "aborygeński"),
      p("śpi na eukaliptusie", "koala", "aborygeński"),
      p("wąska łódka na Krutyni", "kajak", "inuicki"),
      p("japoński strój z szerokim pasem", "kimono", "japoński"),
      p("sport, w którym są chwyty i rzuty", "judo", "japoński"),
      p("sztuka walki z Japonii", "karate", "japoński"),
      p("składanie papieru w figurki", "origami", "japoński"),
      p("ubranie do spania", "pidżama", "hindi"),
      p("płyn do mycia włosów", "szampon", "hindi"),
      p("rysunek na skórze", "tatuaż", "polinezyjski"),
      p("wielki ptak z Andów", "kondor", "keczua"),
      p("duży kot z Ameryki Południowej", "puma", "keczua"),
      p("żywy taniec z Węgier", "czardasz", "węgierski"),
      p("mięso w papryce z Węgier", "gulasz", "węgierski"),
    ] },
    { id: "slowotworstwo", titel: "Jak powstają polskie słowa", paare: [
      p("widok z okna na pola", "krajobraz", "złożenie"),
      p("lokomotywa napędzana parą", "parowóz", "złożenie"),
      p("maszyna ze śmigłem na górze", "śmigłowiec", "pochodne"),
      p("rury z wodą dla miasta", "wodociąg", "złożenie"),
      p("naprawia zegarki", "zegarmistrz", "złożenie"),
      p("słup wskazujący drogę", "drogowskaz", "złożenie"),
      p("pierwszy kwiat po zimie", "pierwiosnek", "złożenie"),
      p("myje talerze sama", "zmywarka", "pochodne"),
      p("zbiera kurz z podłogi", "odkurzacz", "pochodne"),
      p("tu piecze się chleb", "piekarnia", "pochodne"),
      p("uderza w gwoździe", "młotek", "pochodne"),
      p("prasuje ubrania", "żelazko", "pochodne"),
      p("tną papier i materiał", "nożyczki", "pochodne"),
      p("sklep z książkami", "księgarnia", "pochodne"),
      p("tu kupisz róże i tulipany", "kwiaciarnia", "pochodne"),
    ] },
  ],
  // ------------------------------------------------------------ erwachsen (ab 16)
  erwachsen: [
    { id: "greka-lacina", titel: "Rdzenie greckie i łacińskie", paare: [
      p("nauka o myśleniu i istnieniu", "filozofia", "greka"),
      p("cukier ze światła i wody", "fotosynteza", "greka"),
      p("przypuszczenie do sprawdzenia", "hipoteza", "greka"),
      p("rozłożenie całości na części", "analiza", "greka"),
      p("złożenie części w całość", "synteza", "greka"),
      p("przenośnia, np. złote serce", "metafora", "greka"),
      p("sprzeczność, a jednak prawda", "paradoks", "greka"),
      p("wielki zapał do czegoś", "entuzjazm", "greka"),
      p("rozumienie cudzych uczuć", "empatia", "greka"),
      p("siła do pracy i ruchu", "energia", "greka"),
      p("sztuka i nauka wytwarzania", "technologia", "greka"),
      p("opis czyjegoś życia", "biografia", "greka"),
      p("długi okres w dziejach", "epoka", "greka"),
      p("nagła wielka klęska", "katastrofa", "greka"),
      p("zgodne brzmienie dźwięków", "harmonia", "greka"),
      p("regularny takt w muzyce", "rytm", "greka"),
      p("znak, który coś oznacza", "symbol", "greka"),
      p("zbiór uogólnionych zasad", "teoria", "greka"),
      p("sposób postępowania", "metoda", "greka"),
      p("nauka o umyśle człowieka", "psychologia", "greka"),
    ] },
    { id: "niemiecki", titel: "Słowa z niemieckiego", paare: [
      p("najmniejsza jednostka samorządu", "gmina", "niemiecki"),
      p("kieruje urzędem gminy", "wójt", "niemiecki"),
      p("przewodzi wsi", "sołtys", "niemiecki"),
      p("kieruje urzędem miasta", "burmistrz", "niemiecki"),
      p("dawne zrzeszenie rzemieślników", "cech", "niemiecki"),
      p("dawny stan ziemian", "szlachta", "niemiecki"),
      p("flaga na tyczce", "sztandar", "niemiecki"),
      p("malarstwo, rzeźba, teatr", "sztuka", "niemiecki"),
      p("okazały, wielki budynek", "gmach", "niemiecki"),
      p("panierowany kotlet cielęcy", "sznycel", "niemiecki"),
      p("ziemia pod domem", "grunt", "niemiecki"),
      p("dziedzina wiedzy lub zawód", "fach", "niemiecki"),
      p("skromny lokal z jedzeniem", "knajpa", "niemiecki"),
      p("przyklejasz go na ranę", "plaster", "niemiecki"),
      p("chroni ubranie w kuchni", "fartuch", "niemiecki"),
    ] },
    { id: "francuski", titel: "Słowa z francuskiego", paare: [
      p("rozluźnienie mięśni rękami", "masaż", "francuski"),
      p("przejście z kramami", "pasaż", "francuski"),
      p("ostry zakręt toru", "wiraż", "francuski"),
      p("relacja z miejsca wydarzeń", "reportaż", "francuski"),
      p("celowe niszczenie dla szkody", "sabotaż", "francuski"),
      p("łączenie ujęć w filmie", "montaż", "francuski"),
      p("mowa jednej grupy zawodowej", "żargon", "francuski"),
      p("obniżka ceny", "rabat", "francuski"),
      p("sklep albo pomieszczenie", "lokal", "francuski"),
      p("pewność siebie, śmiałość", "tupet", "francuski"),
      p("ozdoba z wstążki", "kokarda", "francuski"),
      p("pierwsze publiczne wystąpienie", "debiut", "francuski"),
      p("droga zawodowego awansu", "kariera", "francuski"),
      p("obraz z naklejonych kawałków", "kolaż", "francuski"),
      p("śmiały nurt w sztuce", "awangarda", "francuski"),
    ] },
    { id: "dalekie", titel: "Słowa z angielskiego i dalekich języków", paare: [
      p("maszyna wykonująca polecenia", "robot", "czeski"),
      p("olbrzymia fala po trzęsieniu", "tsunami", "japoński"),
      p("miniaturowe drzewko w misce", "bonsai", "japoński"),
      p("rzecz, o której się nie mówi", "tabu", "polinezyjski"),
      p("rudy ssak z lasów Borneo", "orangutan", "malajski"),
      p("trawa tak twarda jak drewno", "bambus", "malajski"),
      p("gęsty las tropikalny", "dżungla", "hindi"),
      p("wiosenny kwiat z cebulką", "tulipan", "turecki"),
      p("sieć łącząca komputery", "internet", "angielski"),
      p("wzorzysty dywan bez włosia", "kilim", "turecki"),
      p("jeździec ze skrzydłami", "husarz", "węgierski"),
      p("prowadzenie firmy", "biznes", "angielski"),
      p("najlepszy wynik w historii", "rekord", "angielski"),
      p("linia mety w biegu", "finisz", "angielski"),
      p("nocleg w namiocie na łące", "kemping", "angielski"),
    ] },
    { id: "slowotworstwo", titel: "Jak powstają polskie słowa", paare: [
      p("wszystko, co istnieje", "wszechświat", "złożenie"),
      p("z naszych czasów", "współczesny", "złożenie"),
      p("mieszkańcy sami decydują", "samorząd", "złożenie"),
      p("książka do nauki w domu", "samouczek", "złożenie"),
      p("figura o wielu bokach", "wielokąt", "złożenie"),
      p("prosta obok prostej", "równoległy", "złożenie"),
      p("coś zupełnie odwrotnego", "przeciwieństwo", "pochodne"),
      p("pod powierzchnią wody", "podwodny", "pochodne"),
      p("położony przy morzu", "nadmorski", "pochodne"),
      p("roślina morska", "wodorost", "złożenie"),
      p("czasopismo co siedem dni", "tygodnik", "pochodne"),
      p("czasopismo co miesiąc", "miesięcznik", "pochodne"),
      p("zapiski z każdego dnia", "dziennik", "pochodne"),
      p("niebo bez chmur", "bezchmurny", "pochodne"),
      p("pora przed wiosną", "przedwiośnie", "pochodne"),
    ] },
  ],
};

/** Die Zeile eines Paares: zuerst die Umschreibung, dann das Wort. */
export function korzenZeile(x: KorzenPaar): string {
  return `${x.wskazowka} - ${x.slowo}`;
}

/**
 * Dieselben Wörter, alphabetisch nach `wskazowka` (polnische Sortierung) - für die Wyzwanie, wie
 * `RADICI_ALFABETICO` (radiciIt.ts).
 */
export const KORZENIE_ALFABETYCZNIE: Record<KorzenStufe, string[]> = Object.fromEntries(
  (Object.keys(KORZENIE) as KorzenStufe[]).map((stufe) => [
    stufe,
    KORZENIE[stufe]
      .flatMap((t) => t.paare)
      .slice()
      .sort((a, b) => a.wskazowka.localeCompare(b.wskazowka, "pl"))
      .map(korzenZeile),
  ]),
) as Record<KorzenStufe, string[]>;
