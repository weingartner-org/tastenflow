import type { InhaltsStufe } from "./account";

/**
 * Polnische Wortliste (Kleinschreibung) - das Gegenstück zu `WORDS` (`words.ts`), `WORDS_EN` (`corpusEn.ts`), `WORDS_FR`
 * (`wordsFr.ts`), `WORDS_ES` (`wordsEs.ts`) und `WORDS_IT` (`wordsIt.ts`) für den Generator (Wort-Drill, Zeichen-Zeilen) und
 * für die Übungsformen, die ihren Vorrat über `wortquelle()`/`wortpool()` (`uebungsformen/hilfen.ts`) ziehen.
 *
 * ★ F5-F8 Polnisch (03.10.2026): bis hierher gab `wortquelle("pl")` und `WORD_BASE.pl` das ENGLISCHE `WORDS_EN` (Marke
 * `RÜCKFALL-EN (G2a)`) - eine polnische Übungszeile bestand dann aus englischen Wörtern. Diese Liste ersetzt sie.
 *
 * ── Herkunft (GEMESSEN und von Hand zusammengestellt, nichts roh übernommen) ──────────────────────────────────────
 * 1. `scripts/messe-worthaeufigkeit-pl.mts` zählt die Wortformen der polnischen Tatoeba-Sätze (`pol_sentences*.tsv.bz2`:
 *    137.175 Sätze, davon 5.443 ORIGINALE, 55.886 Wortformen; keine zusätzliche Wortliste geladen, Übersetzungen zählen für die
 *    Übungswörter NICHT - Johannes' Regel „nichts wird übersetzt"). Eine Form kommt nur in Frage, wenn sie in den Originalen
 *    mindestens zweimal VORKOMMT und in allen Sätzen mindestens sechsmal (die zweite Hürde fängt Tippfehler und Einzelfälle: die
 *    5.443 Originale allein tragen nur 1.885 Formen mit drei Belegen). Tatoeba ist kein Kinderkorpus, und jeder achte Satz handelt
 *    von „Tom" - Namen stehen nicht darin.
 * 2. Die Auswahl ist HANDARBEIT nach der Tastenfolge von `PL_LETTER_ORDER` (lernweg.ts): höchstens zwei Formen je Wortstamm, je
 *    Sprosse ein Kontingent, damit jeder Stand des Lehrgangs echte Wörter hat (ab {@link REAL_WORD_FLOOR} = 40 passenden Wörtern
 *    fallen die Unsinnwörter weg). Nach dem Durchlesen entfernt: Krieg, Tod, Alkohol, Schimpf- und Doppelsinnwörter, schwache
 *    Formen. Die frühen Sprossen (Grundreihe `f j d k s l a`, `w o n t e i m z`) tragen so wenige Wörter, dass die Originale sie
 *    nicht füllen - dort stehen von Hand ergänzte Alltagswörter (`lalka`, `kajak`, `ananas`, `kolano` …), jedes ein
 *    Standardwort (Wörterbuch-Beleg: ⚠️ keiner, siehe unten).
 * 3. Kein Wort steht auf der Sperrliste (`sperrlistePl.ts`: Schimpf-, Doppelsinn-, Blasphemie- und Kind-Schutzwörter, Stämme
 *    UND exakte Formen, mit und ohne Ogonki verglichen). Wächter: `tests/tastenflow-pl-woerter.test.ts`.
 *
 * ⚠️ SCHWÄCHE (ausdrücklich): Für Polnisch gibt es KEINEN Wörterbuch-Beleg - das macOS-Wörterbuch nimmt jedes Wort an (gemessen
 * mit dem Unsinnswort `qwxz`, Falle 61). Belegt ist nur die Häufigkeit in Sätzen von Menschen und mein Sprachwissen; eine
 * Formenliste (PoliMorf, SJP) ist nur mit Johannes' Ja ladbar. Die Liste gehört in den Prüfbericht P7 einer Muttersprachlerin.
 *
 * ── Eigenschaften, die der Generator braucht ──────────────────────────────────────────────────────────────────────
 *  · Die neun polnischen Buchstaben (`ą ć ę ł ń ó ś ź ż`) sind eigene Einheiten (ein AltGr-Griff, KEINE Totaste): `filterWords`
 *    lässt ein Wort erst durch, wenn jede seiner Einheiten freigeschaltet ist. Es gibt keinen Ersatz (`ą` ⇒ `a` ändert das Wort:
 *    sąd/sad, ją/ja, że/ze) - ein Wort mit `ę` kommt erst an der Sprosse von `ę` (Nr. 17), eines mit `ń` erst an Nr. 32.
 *  · `q`, `v`, `x` kommen in Fremdwörtern vor (`quiz`, `video`, `taxi`) und stehen ganz hinten; `ź` kommt erst nach `x` (Nr. 34).
 *  · Keine Eigennamen, keine Wörter mit einem Zeichen, das auf keiner polnischen Tastatur liegt (`ä ö ü é è ß`), kein Apostroph.
 *  · Kleinschreibung durchgehend; die Grossschreibung am Zeilenanfang setzt der Generator (`SENTENCE_CAP`); polnische Nomen
 *    werden NICHT grossgeschrieben (`CAPITALIZES_NOUNS.pl = false`).
 *
 * Grob geordnet nach der Sprosse, an der ein Wort vollständig tippbar wird (Zahl in Klammern = Wörter dieser Gruppe).
 */
export const WORDS_PL: string[] = [
  // Grundreihe f j d k s l a (das `;` an Stelle 8 ist kein Buchstabe) (21)
  "jak", "dla", "ja", "daj", "jaka", "da", "jajka", "las", "klasa", "jaj",
  "sala", "sad", "kasa", "kask", "jad", "ssak", "fala", "laska", "skala", "lalka",
  "kajak",
  // w o n t e i m z (284)
  "dwa", "was", "kawa", "wada", "lawa", "dawka", "kawka", "kwas", "do", "od",
  "jako", "woda", "oko", "sok", "jajko", "ok", "los", "oka", "dodaj", "oddaj",
  "osa", "oj", "wola", "koala", "sowa", "kosa", "foka", "sofa", "lokaj", "sos",
  "owad", "kokos", "solo", "na", "on", "ona", "nas", "nad", "nadal", "wolno",
  "okno", "no", "okna", "nowa", "dawna", "dawno", "nosa", "nos", "jasno", "ono",
  "wolna", "nowo", "ananas", "kolano", "wanna", "salon", "kanon", "dno", "to", "tak",
  "ta", "kto", "lat", "twoja", "lata", "kot", "kota", "oto", "taka", "tata",
  "lato", "sto", "stan", "lot", "fakt", "konto", "kontakt", "atak", "wstawaj", "kotka",
  "konta", "staw", "data", "adwokata", "ton", "tost", "stawka", "wata", "flota", "tona",
  "stos", "jest", "ten", "ale", "jej", "tej", "te", "swoje", "je", "nawet",
  "twoje", "jeden", "we", "dalej", "telefon", "twojej", "stole", "ode", "nowe", "jedno",
  "daleko", "jednak", "one", "jedna", "weekend", "statek", "jednej", "nowej", "daje", "ledwo",
  "sen", "wolne", "jasne", "lek", "staje", "dwoje", "wstaje", "kolej", "sens", "kolejne",
  "nie", "wiele", "ile", "oni", "nikt", "wie", "kilka", "jaki", "stanie", "list",
  "taki", "niej", "jakie", "dnia", "dni", "dwie", "takie", "tenisa", "ostatnio", "ostatni",
  "klasie", "inne", "stoi", "istnieje", "kina", "wielki", "wsi", "inni", "nosi", "widok",
  "woli", "konia", "lotnisko", "lesie", "wiek", "niewiele", "kwiat", "wiosna", "niedaleko", "witaj",
  "niedawno", "wolniej", "oddali", "tanie", "konie", "mi", "mnie", "ma", "jestem", "mam",
  "wiem", "tam", "moja", "moje", "nam", "moim", "nim", "dom", "mojej", "sami",
  "swoim", "im", "kim", "twoim", "matka", "film", "samo", "mama", "nami", "miasto",
  "mniej", "miasta", "temat", "mimo", "wam", "dam", "jem", "moi", "mleko", "samolot",
  "mleka", "nimi", "matki", "tamten", "domowe", "domem", "wielkim", "jakim", "mieli", "takim",
  "swoimi", "most", "moimi", "samej", "latem", "za", "ze", "zawsze", "masz", "dzisiaj",
  "wiesz", "znam", "mieszka", "zdanie", "szkole", "zna", "nasz", "jedzenie", "zanim", "jedzenia",
  "znasz", "nasze", "zimno", "ziemi", "nasza", "zdania", "idzie", "naszej", "mieszkam", "dzieje",
  "szkoda", "zastanawiam", "telewizji", "zadanie", "dziwne", "zamiast", "nazwisko", "dziennie", "idziesz", "zamknij",
  "siedzi", "dziadek", "jedzie", "zdaje", "zoo", "kieszeni", "zmienia", "widzenia", "zadania", "zajmie",
  "okazji", "jesz", "nawzajem", "dziwnie", "zimna", "szefem", "jedz", "zima", "niedziele", "szef",
  "wodzie", "zielone", "nazwiska", "dzwoni",
  // ę (der erste AltGr-Griff) (28)
  "się", "tę", "nadzieję", "imię", "widzę", "idę", "kawę", "dzięki", "wolę", "telewizję",
  "wodę", "niedzielę", "mięso", "wszędzie", "zajęta", "mięsa", "szklankę", "zamknięte", "ziemię", "zadzwonię",
  "jadę", "szansę", "matkę", "tęsknię", "znoszę", "większe", "wiosnę", "wezmę",
  // c y r p u (257)
  "co", "ci", "cię", "jeszcze", "nic", "więcej", "dzieci", "czas", "ojciec", "często",
  "więc", "dziecko", "miejsce", "codziennie", "ojca", "czasie", "noc", "wcale", "cieszę", "czasem",
  "zdjęcie", "deszcz", "czasami", "kolację", "macie", "koniec", "ciekawe", "lecz", "mecz", "mocno",
  "wakacje", "znacznie", "inaczej", "ciasto", "zdjęcia", "czekam", "oznacza", "ciemno", "ojcem", "cena",
  "owoce", "nieco", "zajęci", "stacji", "czy", "tym", "kiedy", "tylko", "wszystko", "wszyscy",
  "ty", "mamy", "nocy", "nowy", "wydaje", "czym", "wody", "oczy", "zajęty", "tyle",
  "język", "zwykle", "między", "wtedy", "zmęczony", "dziewczyna", "kawy", "języka", "jednym", "my",
  "zaczyna", "kwiaty", "naszym", "koty", "syna", "znaczy", "syn", "inny", "samym", "nazywa",
  "wiemy", "niestety", "czyta", "zadowolony", "dziewczyny", "wolny", "zaskoczony", "wy", "wysoki", "listy",
  "jedynym", "ceny", "zazwyczaj", "jazdy", "innym", "niczym", "silny", "matematyki", "teraz", "wczoraj",
  "trzy", "raz", "rzeczy", "drzwi", "rano", "razem", "wieczorem", "razy", "siostra", "ręce",
  "stary", "zaraz", "rodzice", "rower", "rację", "strony", "cztery", "serce", "wierzę", "rękę",
  "kraj", "lekarza", "rzecz", "drodze", "coraz", "radę", "raczej", "lekarz", "twarz", "rok",
  "rady", "rzadko", "strasznie", "stronie", "starszy", "razie", "zdrowie", "siostry", "adres", "wystarczy",
  "drzewo", "otwarte", "zamierzam", "twarzy", "drzewa", "czerwone", "wiatr", "zwierzęta", "warto", "serca",
  "dworzec", "zdrowia", "wierzy", "po", "przez", "proszę", "pan", "naprawdę", "przed", "prawda",
  "pracy", "pieniędzy", "pod", "lepiej", "pracę", "pani", "prawie", "przy", "pies", "pewien",
  "przepraszam", "pierwszy", "psa", "powinienem", "pytanie", "pomoc", "przyjdzie", "pana", "prawdę", "podczas",
  "pomocy", "poproszę", "potrafi", "praca", "ponad", "plan", "pamiętam", "prawo", "piękna", "wypadek",
  "piękne", "pewno", "pewnie", "dopiero", "pojęcia", "pije", "pada", "policja", "poza", "potrafię",
  "psy", "przeciwko", "ponownie", "pytania", "prezent", "pisze", "zapomnij", "domu", "tu", "mu",
  "muszę", "jutro", "tutaj", "musisz", "czasu", "roku", "pokoju", "ludzi", "musimy", "ludzie",
  "musi", "czemu", "powodu", "temu", "prostu", "wielu", "francusku", "rozumiem", "pracuje", "dziękuję",
  "znowu", "czuję", "minut", "umie", "wieku", "uczy", "nauczyciel", "trudno", "miejscu", "wypadku",
  "komputer", "kraju", "parku", "pracuję", "umiem", "ulicy", "urodziny", "telefonu", "numer", "muzyki",
  "uczę", "klucz", "trudne", "kosztuje", "muzykę", "znajduje", "nikomu",
  // ł b (108)
  "powiedział", "miał", "został", "szkoły", "widziałem", "cały", "miałem", "stało", "człowiek", "poszedł",
  "słowa", "przyszedł", "miała", "zupełnie", "wiedziałem", "spotkałem", "musiał", "mało", "pomysł", "dał",
  "słyszałem", "dokładnie", "kupił", "kupiłem", "zeszłym", "południu", "włosy", "zły", "udało", "całkiem",
  "łatwo", "człowiekiem", "wyszedł", "młody", "działa", "słowo", "około", "przyszłym", "całe", "mały",
  "słownik", "piłkę", "musiałem", "znalazłem", "poszedłem", "miło", "poniedziałek", "zapomniałem", "zjadł", "stał",
  "znalazł", "zaczęło", "poprosił", "napisał", "małe", "szkoła", "padało", "zapytał", "bardzo", "był",
  "było", "będzie", "sobie", "była", "dobrze", "by", "lubię", "ciebie", "byłem", "bez",
  "lubi", "zbyt", "będę", "szybko", "aby", "zrobił", "siebie", "bo", "robi", "dobry",
  "będziesz", "problem", "bardziej", "potrzebuję", "podoba", "byli", "były", "trzeba", "lubisz", "dobre",
  "obiad", "brat", "bym", "dobra", "albo", "potrzebuje", "tobie", "buty", "dobrym", "najbardziej",
  "autobus", "ryby", "lub", "boli", "robisz", "uwielbiam", "jakby", "oboje",
  // g ż ą ś ć h ó ń (311)
  "tego", "jego", "go", "mogę", "nigdy", "gdzie", "dlaczego", "gdy", "niego", "mojego",
  "czego", "swojego", "długo", "angielsku", "angielskiego", "gra", "tygodniu", "gdyby", "godziny", "mogłem",
  "niczego", "francuskiego", "nowego", "nikogo", "dlatego", "takiego", "gdybym", "kogo", "zegarek", "pogoda",
  "nagle", "godzinę", "innego", "głowy", "głodny", "egzamin", "bogaty", "droga", "drogi", "uwagę",
  "ogrodzie", "drogę", "mogła", "samego", "swego", "że", "już", "może", "żeby", "niż",
  "możesz", "dużo", "życie", "też", "można", "możemy", "każdy", "życia", "aż", "należy",
  "ponieważ", "uważam", "żebym", "ważne", "każdego", "mężczyzna", "ciężko", "duży", "życiu", "żyje",
  "żona", "możliwe", "leży", "duże", "dłużej", "każdym", "uważa", "zależy", "pobliżu", "pomoże",
  "niemożliwe", "żadnego", "jeżeli", "wrażenie", "księżyc", "są", "ją", "książkę", "tobą", "wygląda",
  "swoją", "pieniądze", "mają", "mną", "moją", "książka", "wciąż", "pociąg", "nią", "sobą",
  "tą", "zaczął", "mogą", "stąd", "jedną", "twoją", "ciągle", "będą", "błąd", "całą",
  "lubią", "sądzę", "skąd", "dobrą", "wyglądasz", "zewnątrz", "wystarczająco", "dokąd", "porządku", "jaką",
  "mąż", "miesiącu", "osobą", "nową", "gorąco", "muszą", "wziął", "jedzą", "początku", "pociągu",
  "jesteś", "coś", "jeśli", "dziś", "myślę", "właśnie", "ktoś", "powinieneś", "kiedyś", "wcześniej",
  "myślałem", "myślisz", "myśli", "świecie", "żebyś", "wcześnie", "mieście", "byłeś", "jakieś", "śniadanie",
  "czegoś", "świat", "śnieg", "szczęśliwy", "szczęście", "jakiś", "kogoś", "widziałeś", "byliśmy", "byś",
  "gdzieś", "światło", "mieliśmy", "śpi", "świetnie", "trzydzieści", "wiadomości", "środku", "oczywiście", "być",
  "zrobić", "iść", "powiedzieć", "robić", "zostać", "zobaczyć", "kupić", "wiedzieć", "spać", "mieć",
  "uczyć", "jeść", "grać", "porozmawiać", "pięć", "padać", "pracować", "dość", "rozmawiać", "czytać",
  "wiadomość", "dziesięć", "pływać", "żyć", "wyjść", "wziąć", "zjeść", "nauczyć", "czekać", "większość",
  "miłość", "spotkać", "znać", "pić", "dać", "zrozumieć", "pisać", "dostać", "chcę", "chcesz",
  "chciałbym", "chce", "trochę", "ich", "chyba", "chciał", "swoich", "kocham", "tych", "niech",
  "chodzi", "moich", "nich", "innych", "natychmiast", "kocha", "samochodu", "jechać", "chory", "chwilę",
  "trzech", "chwili", "chłopak", "chłopiec", "chcemy", "pojechać", "chcą", "żadnych", "herbatę", "chodzić",
  "historia", "chleb", "kuchni", "ochotę", "hotelu", "historię", "przychodzi", "słuchać", "mój", "mówi",
  "samochód", "twój", "który", "swój", "pomóc", "mówić", "mógł", "które", "pokój", "sposób",
  "która", "której", "przyjaciół", "osób", "mówię", "mógłbyś", "mówisz", "dolarów", "mógłbym", "mówią",
  "którą", "którym", "wkrótce", "dwóch", "którzy", "pójść", "mów", "ogóle", "wrócił", "pozwól",
  "również", "rodziców", "mówił", "próbował", "niektórzy", "góry", "pół", "pójdę", "dzień", "końcu",
  "przestań", "tydzień", "słońce", "państwo", "końca", "skończyć", "skończyłem", "japońsku", "słońca", "pytań",
  "zdań", "państwa", "koń", "ogień", "zadzwoń", "japońskiego", "kończy", "tańczyć", "pomarańcze", "hiszpańsku",
  "kamień",
  // x ź v q (31)
  "taxi", "fax", "mix", "box", "bądź", "znaleźć", "później", "idź", "źle",
  "odpowiedź", "późno", "weź", "chodźmy", "jeździ", "mężczyźni", "jeździć", "chodź", "ludźmi", "spóźnił",
  "październiku", "usiądź", "późna", "spóźni", "znaleźliśmy", "video", "avatar", "veto", "quiz", "quasi",
  "quad",
];

/**
 * Wortschatz nach ALTERSSTUFE (Themen), ergänzend zu {@link WORDS_PL}. Wird vom Generator je nach Stufe zugemischt
 * (`stufeVocab`, generator.ts). Kinder: Schule, Tiere, Natur, Essen, Feste, Familie, Musik, Orte, Polen (`żubr`,
 * `bursztyn`, `smok`, `pierniki`); Jugendliche: Freundschaft, Schule, Musik, Technik, Sport, Klima, Zukunft; Erwachsene:
 * Arbeit, Behörden, Wohnen, Gesundheit, Kultur. Alle Wörter klein, im Nominativ, bestehen die Sperrliste (`sperrlistePl.ts`);
 * Regionen kommen über die Dinge vor (`oscypek`, `góral`, `bursztyn`), nicht über Eigennamen. Wächter:
 * `tests/tastenflow-pl-woerter.test.ts`. Handarbeit, nicht von einer Muttersprachlerin gelesen (⚠️ P7).
 */
export const STUFE_VOCAB_PL: Record<InhaltsStufe, string[]> = {
  kids: [
    "szkoła", "zeszyt", "ołówek", "długopis", "plecak", "tablica", "nauczycielka", "ławka", "przerwa", "kredki",
    "temperówka", "gumka", "linijka", "piórnik", "bajka", "opowiadanie", "rysunek", "dzwonek", "lekcja", "boisko",
    "kolega", "koleżanka", "książka", "kartka", "królik", "żółw", "motyl", "mrówka", "pszczoła", "ślimak",
    "jeż", "wiewiórka", "wróbel", "bocian", "delfin", "wieloryb", "ryba", "jaskółka", "sowa", "wilk",
    "niedźwiedź", "lis", "lew", "słoń", "żyrafa", "owca", "krowa", "koń", "kura", "kaczka",
    "żaba", "chomik", "papuga", "rekin", "pingwin", "dzik", "sarna", "jeleń", "zając", "bóbr",
    "kret", "biedronka", "pająk", "mucha", "komar", "kogut", "gołąb", "źrebak", "szczeniak", "kotek",
    "piesek", "chmura", "tęcza", "góra", "rzeka", "jezioro", "morze", "plaża", "muszla", "piasek",
    "wulkan", "łąka", "ogród", "huśtawka", "zjeżdżalnia", "piłka", "rower", "latawiec", "zabawka", "pociąg",
    "klocki", "kolejka", "gwiazda", "księżyc", "słońce", "wiatr", "burza", "błyskawica", "mgła", "kałuża",
    "tulipan", "stokrotka", "róża", "grzyb", "szyszka", "liść", "drzewo", "dąb", "sosna", "brzoza",
    "wiśnia", "chleb", "bułka", "masło", "zupa", "pierogi", "naleśniki", "placek", "ciastko", "jabłko",
    "gruszka", "truskawka", "pomarańcza", "cytryna", "arbuz", "banan", "śliwka", "czereśnia", "marchewka", "ziemniak",
    "pomidor", "ogórek", "sernik", "makowiec", "lody", "miód", "kisiel", "kasza", "ryż", "makaron",
    "kluski", "żurek", "barszcz", "racuchy", "choinka", "pisanka", "urodziny", "tort", "świeczka", "balon",
    "zabawa", "impreza", "karnawał", "kolęda", "śnieg", "bałwan", "sanki", "łyżwy", "narty", "fajerwerki",
    "bombka", "życzenia", "babcia", "dziadek", "siostra", "brat", "kuzyn", "kuzynka", "wujek", "ciocia",
    "rodzina", "rodzice", "dziecko", "gitara", "skrzypce", "flet", "bęben", "pianino", "trąbka", "akordeon",
    "harmonijka", "zamek", "rynek", "most", "latarnia", "statek", "łódka", "port", "tramwaj", "autobus",
    "dworzec", "sklep", "piekarnia", "targ", "cukiernia", "kino", "basen", "smok", "syrenka", "żubr",
    "bursztyn", "kajak", "góral", "pierniki", "oscypek",
  ],
  teens: [
    "przyjaźń", "zaufanie", "szacunek", "sekret", "żart", "zadanie", "ocena", "projekt", "biblioteka", "laboratorium",
    "doświadczenie", "nauka", "geografia", "matematyka", "koncert", "piosenka", "perkusja", "festiwal", "telefon", "ekran",
    "aplikacja", "słuchawki", "drużyna", "trening", "turniej", "zwycięstwo", "porażka", "sędzia", "trener", "siatkówka",
    "pływanie", "lekkoatletyka", "gimnastyka", "medal", "klimat", "środowisko", "recykling", "plastik", "zanieczyszczenie", "susza",
    "energia", "przyszłość", "marzenie", "wybór", "zawód", "praktyki", "podróż", "schronisko", "przygoda", "wycieczka",
    "obóz", "internet", "serial", "robot", "kosmos", "planeta", "wynalazek", "odkrycie", "sztuka", "fotografia",
    "muzyka", "taniec", "hulajnoga", "deskorolka", "wolontariat",
  ],
  erwachsen: [
    "biuro", "spotkanie", "firma", "klient", "wypłata", "faktura", "podatek", "bank", "gospodarka", "rząd",
    "urząd", "gmina", "zaświadczenie", "formularz", "wniosek", "pozwolenie", "umowa", "czynsz", "wspólnota", "osiedle",
    "rachunek", "zdrowie", "szpital", "lekarz", "wizyta", "recepta", "terapia", "emerytura", "związek", "wybory",
    "obywatel", "sprawiedliwość", "równość", "solidarność", "demokracja", "migracja", "integracja", "kultura", "dziedzictwo", "muzeum",
    "gazeta", "wywiad", "uniwersytet", "dyplom", "transport", "korek", "autostrada", "rolnictwo", "rzemiosło", "handel",
    "turystyka", "konferencja", "budżet", "ubezpieczenie", "dokument", "podanie", "urlop", "zasiłek", "pielęgniarka", "apteka",
    "poradnia", "rehabilitacja", "mieszkanie", "sąsiad", "prawo", "ustawa", "parlament",
  ],
};
