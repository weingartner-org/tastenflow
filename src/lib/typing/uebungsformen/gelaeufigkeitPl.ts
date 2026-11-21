/**
 * ★ F5-F8 Polnisch (03.10.2026): die häufigen Buchstabenverbindungen des Polnischen für das Geläufigkeitsschreiben
 * (`gelaeufigkeit.ts`) - neu gewählt, nicht übertragen. Bis hierher stand für `pl` das ENGLISCHE `VERBINDUNGEN_EN`
 * (RÜCKFALL-EN, G2a): jede adaptive Runde („Mein Training") hängt eine Geläufigkeits-Zeile an, ein Kind auf Weg „pl" hätte
 * darin „education station action nation" geschrieben.
 *
 * Gewählt nach dem, was das Polnische über seine Schreibung ausmacht und was Zehnfingerschreiben automatisiert:
 *  · die Digraphen und Trigraphen (*sz cz rz ch dz szcz prz trz*: szkoła, czapka, rzeka, chleb, dzień, szczęście, przed, trzy) -
 *    KEINE Sonderzeichen, aber das, was Kinder beim Schreiben am häufigsten verwechseln (rz/ż, ch/h, sz/ś);
 *  · die weiche Schreibung mit `i` (*ci si zi ni*: cicho, siostra, zielony, niebo) - statt `ć ś ź ń` vor einem Vokal;
 *  · die Wortanfänge mit zwei oder drei Mitlauten (*str sp sk sł gł kr pr dr kw zw wy*);
 *  · die häufigen Endungen (*-nie -ść -ał -ski -ego -ach -ami -ów -ek -ka -ować -ać -ić*);
 *  · die neun polnischen Buchstaben an ihrer typischen Stelle (*ą ę* am Ende, *ó* in der Mitte, *ł ż ś* am Anfang, *ń* am Ende,
 *    *ź* am Anfang) - sie erscheinen erst, wenn ihre Einheit gelernt ist: `gelaeufigkeit.ts` prüft mit dem Weg (`fitText`) und lässt
 *    ein Wort erst durch, wenn jeder Buchstabe frei ist (nie ohne Ogonek: `ą` ⇒ `a` wäre ein anderes Wort).
 *
 * Alle Wörter klein, echte Alltagswörter (jedes kommt in den Tatoeba-Sätzen vor, gemessen 03.10.2026, `tastenflow-pl-woerter`),
 * nicht auf der Sperrliste (`sperrlistePl.ts`; darum kein *głupi*, *brzydki*, *gruby*). ⚠️ Von keiner Muttersprachlerin gelesen (P7).
 * Wächter: `tests/tastenflow-pl-woerter.test.ts`.
 * ★ PL-W (09.10.2026): `krowa` ⇒ `krokodyl`, `świnia` ⇒ `świeży` - beide Tiernamen sind im Polnischen auch Schimpfwörter gegen
 * Menschen und stünden in einer Wortreihe ohne Zusammenhang da wie ein Witz auf Kosten des Kindes (Wächter
 * `tests/tastenflow-wortspiele-pl.test.ts`, dieselbe Regel wie in `wortkettenPl.ts`).
 */
import type { Verbindung } from "./gelaeufigkeit";

export const VERBINDUNGEN_PL: Verbindung[] = [
  { folge: "sz", stelle: "anfang", woerter: ["szkoła", "szafa", "szalik", "szeroki", "szybko", "szyja", "szyna", "szuflada", "szept", "sześć", "szklanka", "szpilka"] },
  { folge: "sz", stelle: "mitte", woerter: ["poduszka", "mieszkanie", "koszyk", "paszport", "uszy", "pieszo", "kaszka", "muszla", "zeszyt", "deszcz"] },
  { folge: "cz", stelle: "anfang", woerter: ["czas", "czapka", "czarny", "czerwony", "czekolada", "czytać", "czwartek", "czysty", "czoło", "człowiek", "czerwiec", "cztery"] },
  { folge: "cz", stelle: "mitte", woerter: ["kaczka", "oczy", "uczeń", "wieczór", "tęcza", "pieczywo", "kluczyk", "uczta"] },
  { folge: "rz", stelle: "anfang", woerter: ["rzeka", "rzadko", "rzecz", "rzeźba", "rząd", "rzeczy", "rzucać", "rzepa", "rzęsa"] },
  { folge: "rz", stelle: "mitte", woerter: ["morze", "dobrze", "burza", "korzeń", "drzewo", "marzec", "zwierzę", "jarzębina", "twarz"] },
  { folge: "ch", stelle: "anfang", woerter: ["chleb", "chmura", "chodzić", "chłopiec", "chcieć", "chory", "chwila", "chata", "chociaż", "chusta", "chomik", "choinka"] },
  { folge: "ch", stelle: "mitte", woerter: ["ucho", "mucha", "kuchnia", "słuchać", "pochmurno", "suchy", "uchwyt"] },
  { folge: "dz", stelle: "anfang", woerter: ["dzień", "dzieci", "dzwonek", "dziadek", "dziewczyna", "dzban", "dziura", "dzięki", "dzik", "dziecko", "dzisiaj", "dzbanek"] },
  { folge: "dz", stelle: "mitte", woerter: ["chodzić", "widzieć", "ludzie", "godzina", "jedzenie", "gdzie", "wszędzie", "siedzieć"] },
  { folge: "szcz", stelle: "anfang", woerter: ["szczęście", "szczotka", "szczypce", "szczeniak", "szczęka", "szczupły", "szczyt", "szczery"] },
  { folge: "szcz", stelle: "mitte", woerter: ["deszcz", "deszczowy", "deszczu", "deszczem", "pieszczota", "kleszcze", "gąszcz"] },
  { folge: "prz", stelle: "anfang", woerter: ["przed", "przez", "przy", "przyjaciel", "przerwa", "przepis", "przystanek", "przygoda", "przedszkole", "przyjęcie", "przesyłka"] },
  { folge: "trz", stelle: "anfang", woerter: ["trzy", "trzeci", "trzeba", "trzask", "trzcina", "trzydzieści", "trzynaście", "trzonek"] },
  { folge: "trz", stelle: "mitte", woerter: ["potrzeba", "utrzymać", "patrzeć", "strzała", "wietrzyk", "otrzymać", "strzelać", "patrzyć"] },
  { folge: "ci", stelle: "anfang", woerter: ["cicho", "cisza", "ciasto", "ciepło", "ciało", "ciocia", "ciekawy", "ciemny", "cienki"] },
  { folge: "si", stelle: "anfang", woerter: ["siostra", "siedem", "siano", "siła", "siatka", "siodło", "sito", "siedzieć", "siebie"] },
  { folge: "zi", stelle: "anfang", woerter: ["zielony", "ziemia", "zima", "zimno", "ziarno", "ziemniak", "zimowy", "ziewać", "zioło"] },
  { folge: "ni", stelle: "anfang", woerter: ["nigdy", "niebo", "niedziela", "nikt", "niebieski", "nisko", "nitka", "nieść", "niski"] },
  { folge: "nie", stelle: "ende", woerter: ["zdanie", "pytanie", "śniadanie", "jedzenie", "spotkanie", "mieszkanie", "pisanie", "czytanie", "zadanie", "ćwiczenie", "życzenie"] },
  { folge: "ść", stelle: "ende", woerter: ["wartość", "miłość", "radość", "ciekawość", "wolność", "prędkość", "możliwość", "ważność", "przyszłość"] },
  { folge: "ał", stelle: "ende", woerter: ["miał", "dał", "stał", "czytał", "pisał", "kochał", "grał", "pytał", "został"] },
  { folge: "ski", stelle: "ende", woerter: ["polski", "angielski", "francuski", "hiszpański", "rosyjski", "męski", "miejski", "wiejski"] },
  { folge: "ego", stelle: "ende", woerter: ["tego", "jego", "dobrego", "nowego", "małego", "wielkiego", "pierwszego", "drugiego", "ostatniego", "starego", "innego"] },
  { folge: "ach", stelle: "ende", woerter: ["domach", "oczach", "nogach", "górach", "szkołach", "lasach", "ulicach", "ludziach", "stołach"] },
  { folge: "ami", stelle: "ende", woerter: ["domami", "rękami", "oczami", "nogami", "kwiatami", "drzewami", "książkami", "ptakami", "lasami"] },
  { folge: "ów", stelle: "ende", woerter: ["domów", "lasów", "kwiatów", "uczniów", "ptaków", "kotów", "psów", "kolorów", "samochodów", "stołów"] },
  { folge: "ek", stelle: "ende", woerter: ["domek", "kotek", "piesek", "kwiatek", "ptaszek", "pasek", "ołówek", "worek"] },
  { folge: "ka", stelle: "ende", woerter: ["książka", "kartka", "lalka", "tabliczka", "gumka", "bułka", "skarpetka", "torebka", "lampka", "truskawka"] },
  { folge: "ować", stelle: "ende", woerter: ["pracować", "kupować", "gotować", "malować", "kosztować", "budować", "planować", "rysować", "spacerować", "świętować"] },
  { folge: "ać", stelle: "ende", woerter: ["czytać", "pisać", "grać", "spać", "stać", "dawać", "kochać", "pytać", "znać", "mieszkać"] },
  { folge: "ić", stelle: "ende", woerter: ["robić", "mówić", "pić", "kupić", "zrobić", "nosić", "prosić", "wozić", "chodzić"] },
  { folge: "str", stelle: "anfang", woerter: ["strona", "strach", "strumień", "strażak", "strój", "struś", "strych", "strop"] },
  { folge: "sp", stelle: "anfang", woerter: ["spacer", "sprawa", "spokój", "sport", "spodnie", "sposób", "spać", "spotkanie", "spódnica"] },
  { folge: "sk", stelle: "anfang", woerter: ["skok", "skała", "skrzynia", "skarpetka", "skóra", "skuter", "skrzydło", "skarb", "sklep", "skakać"] },
  { folge: "sł", stelle: "anfang", woerter: ["słowo", "słońce", "słoń", "słodki", "słuchać", "słownik", "słaby", "słoik", "słomka"] },
  { folge: "gł", stelle: "anfang", woerter: ["głowa", "głos", "głośno", "głęboki", "głód", "głaskać", "głośnik"] },
  { folge: "kr", stelle: "anfang", woerter: ["krokodyl", "kraj", "krew", "król", "krzesło", "krok", "krab", "kropla", "kreska", "kruk", "krasnal"] },
  { folge: "pr", stelle: "anfang", woerter: ["prawo", "praca", "prosto", "proszę", "prezent", "prąd", "pralka", "prosię", "prawy"] },
  { folge: "dr", stelle: "anfang", woerter: ["droga", "drzewo", "drzwi", "drabina", "drużyna", "drobny", "drugi", "drewno"] },
  { folge: "kw", stelle: "anfang", woerter: ["kwiat", "kwiecień", "kwadrat", "kwas", "kwaśny", "kwiaciarnia", "kwestia", "kwota"] },
  { folge: "zw", stelle: "anfang", woerter: ["zwierzę", "zwykle", "związek", "zwyczaj", "zwolnić", "zwycięstwo", "zwrot", "zwierzak"] },
  { folge: "wy", stelle: "anfang", woerter: ["wyspa", "wynik", "wygrać", "wysoki", "wyjście", "wypadek", "wybór", "wyprawa", "wyraz", "wyjazd"] },
  { folge: "ą", stelle: "ende", woerter: ["tobą", "sobą", "mną", "nią", "drogą", "wodą", "ręką", "nogą", "głową", "szkołą"] },
  { folge: "ę", stelle: "ende", woerter: ["się", "wodę", "kawę", "książkę", "szkołę", "mamę", "rękę", "nogę", "głowę", "ulicę"] },
  { folge: "ó", stelle: "mitte", woerter: ["góra", "ogród", "mówić", "pokój", "mózg", "żółty", "kółko", "wróbel"] },
  { folge: "ł", stelle: "anfang", woerter: ["łódź", "łąka", "łyżka", "łóżko", "łatwo", "łabędź", "łapa", "łokieć", "łazienka", "łańcuch"] },
  { folge: "ż", stelle: "anfang", woerter: ["żaba", "żółty", "żyrafa", "żelazo", "żyć", "żaden", "żołnierz", "żagiel", "żuk", "życie"] },
  { folge: "ż", stelle: "mitte", woerter: ["duży", "może", "mężczyzna", "książka", "każdy", "drużyna", "podróż", "kałuża"] },
  { folge: "ś", stelle: "anfang", woerter: ["śnieg", "świat", "środa", "świeca", "ślimak", "śpiewać", "śniadanie", "śmiech", "ślad", "świeży"] },
  { folge: "ń", stelle: "ende", woerter: ["dzień", "koń", "ogień", "jeleń", "kamień", "tydzień", "cień"] },
  { folge: "ź", stelle: "anfang", woerter: ["źródło", "źrebak", "źrebię", "źle", "źrenica", "źdźbło"] },
];
