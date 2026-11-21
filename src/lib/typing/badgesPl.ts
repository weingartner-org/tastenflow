/**
 * ★★★ DER ABZEICHEN-KATALOG POLNISCH (O-PL, 02.10.2026).
 *
 * Gegenstück zu `badgesIt.ts` - dieselbe Bauart, dieselben Schlüssel, NEU AUF
 * POLNISCH GESCHRIEBEN, nicht übersetzt (Glossar Polnisch §2.4): übertragen
 * ist die IDEE des Namens. Wo das Polnische eine eigene Wendung zum Motiv hat,
 * steht sie da („W dziesiątkę" zur Zielscheibe, „Jak w zegarku", „Jednym
 * tchem", „Ranny ptaszek", „Nocna sowa", „Mól książkowy", „Zimna krew",
 * „Nić przewodnia", „Z powrotem w siodle"); sonst ein Stabreim wie im
 * Deutschen („Precyzyjny pingwin", „Bystry bóbr", „Rozczytany ryś",
 * „Oczytana ośmiornica", „Tygrys tysiąca klawiszy").
 *
 * ★ Geschlecht nie raten (Glossar Regel 2): KEINE Personen-Substantive
 * („Mistrz", „As", „Czytelnik" wären männlich), Adjektive nur an einem Tier
 * oder Ding („Pracowita mrówka", „Diamentowe palce"), nie an „ty". Die
 * Beschreibungen sind Sätze über die Sache - Nomen mit Partizip („5 lekcji
 * ukończonych"), -no-Form („Odblokowano …") oder Zahl + Nomen im Nominativ
 * („100 rund ćwiczeń") - nie Vergangenheit 2. Person.
 *
 * ★ Mehrzahl (Glossar §2.10a): Die Zahlen stehen FEST im Text, jede mit der
 * Form, die zu IHR gehört (3 czyste rundy · 7 czystych rund · 52 różne
 * tygodnie). Wo eine Zahl von aussen kommt (`z.fische` usw.), wählt
 * {@link pl} die Form über `Intl.PluralRules("pl-PL")`. Zahlen ab fünf Ziffern
 * mit geschütztem Leerzeichen („10 000", Glossar Regel 5); „95%" ohne
 * Leerzeichen; Dezimalkomma („0,5%").
 *
 * Grossschreibung wie im Polnischen: nur das erste Wort und Eigennamen
 * („Stacja polarna", „Jaskinia echa", „Skoki po krach"). Die trockenen
 * Zweitnamen (`nameNeutral`, ab 11 Jahren) genau dort, wo das Deutsche einen
 * hat. Glossar: odznaka, runda, uderzenie, dokładność, błąd, pozycja
 * podstawowa, rząd podstawowy, etap, krąg punktów, poziom trudności, punkt
 * startowy, opowiadanie, Wyprawa polarna; „cel" bleibt dem Wochenziel.
 *
 * ⚠️ Wer ein Abzeichen anlegt, trägt es HIER mit ein - jede ID braucht einen
 * polnischen Eintrag und einen Zweitnamen genau dort, wo es ihn im Deutschen
 * gibt.
 */
import { lernwegDef } from "./lernweg";
import { lektionenFuer } from "./curriculum";
import type { AbzeichenTextEn, AbzeichenZahlen } from "./badgesEn";

/** Dieselbe Form wie der englische Eintrag. */
export type AbzeichenTextPl = AbzeichenTextEn;

/** Die Mehrzahl-Regel des Polnischen (CLDR): one · few · many (Glossar §2.10a). */
const PLURAL_PL = new Intl.PluralRules("pl-PL");

/** Zahl mit der passenden Form: `pl(5, "przygoda …", "przygody …", "przygód …")`. */
function pl(n: number, one: string, few: string, many: string): string {
  const k = PLURAL_PL.select(n);
  const form = k === "one" ? one : k === "few" ? few : many;
  return `${n} ${form}`;
}

/** Die Zeichen von „alltags-ass", die es auf dem Weg des Kindes wirklich gibt (wie `badgesIt.ts`). */
function alltagsZeichen(z: AbzeichenZahlen): string {
  const reihe = new Set(lernwegDef(z.lernweg).introOrder);
  const da = ["@", "€", "$", "§"].filter((c) => reihe.has(c));
  if (da.length <= 1) return da.join("");
  return `${da.slice(0, -1).join(", ")} i ${da[da.length - 1]}`;
}

/** Die Familien (Überschriften im Regal) - Schlüssel ist der deutsche `group`-Name (Glossar §2.4). */
export const ABZEICHEN_GRUPPEN_PL: Readonly<Record<string, string>> = {
  Fehlerfrei: "Bez błędów",
  "Saubere Serie": "Czyste rundy",
  Fleiß: "Pracowitość",
  Anschläge: "Uderzenia",
  Dranbleiben: "Wytrwałość",
  Übungswochen: "Tygodnie ćwiczeń",
  Sterne: "Gwiazdki",
  Lektionen: "Lekcje",
  Stufen: "Poziomy",
  Tastenwelt: "Świat klawiatury",
  "Sitzt!": "Opanowane!",
  Tempo: "Tempo",
  "Am Stück": "Jednym ciągiem",
  Meisterprüfung: "Mistrzostwo",
  Abenteuer: "Przygody",
  "Abenteuer-Kunststücke": "Wyczyny w przygodach",
  Expedition: "Wyprawa",
  Geschichten: "Opowiadania",
  Lesestunde: "Czas na czytanie",
  "Lese-Kunststücke": "Wyczyny czytelnicze",
  Geheim: "Sekrety",
};

/** Der ganze Katalog polnisch, je Abzeichen-ID. */
export const ABZEICHEN_PL: Readonly<Record<string, AbzeichenTextPl>> = {
  // ── Bez błędów ───────────────────────────────────────────────────────────
  volltreffer: { name: "W dziesiątkę", description: "Cała runda bez ani jednego błędu.", bildbeschreibung: "tarcza ze strzałą w samym środku" },
  "null-fehler-ninja": { name: "Ninja zero błędów", description: "5 rund bez żadnego błędu.", bildbeschreibung: "ninja" },
  "makellos-meister": { name: "Gwiazdy bez skazy", description: "15 rund bez żadnego błędu.", bildbeschreibung: "trzy błyszczące gwiazdy" },
  "diamant-finger": { name: "Diamentowe palce", description: "40 rund bez żadnego błędu.", bildbeschreibung: "niebieski kamień szlachetny" },
  "weisse-weste": { name: "Śnieżnobiały gołąb", description: "80 rund bez żadnego błędu.", bildbeschreibung: "biały gołąb" },
  "einhorn-finger": { name: "Palce jednorożca", nameNeutral: "150 rund bez błędów", description: "150 rund bez żadnego błędu.", bildbeschreibung: "jednorożec" },
  // ── Czyste rundy ─────────────────────────────────────────────────────────
  "praezisions-pinguin": { name: "Precyzyjny pingwin", nameNeutral: "Trzy razy czysto", description: "3 czyste rundy z rzędu (dokładność co najmniej 95%).", bildbeschreibung: "pingwin" },
  adlerauge: { name: "Orli wzrok", description: "7 czystych rund z rzędu (dokładność co najmniej 95%).", bildbeschreibung: "orzeł" },
  "laser-lama": { name: "Laserowa lama", nameNeutral: "Tryb laserowy", description: "15 czystych rund z rzędu (dokładność co najmniej 95%).", bildbeschreibung: "lama" },
  "eiskalte-serie": { name: "Zimna krew", description: "25 czystych rund z rzędu (dokładność co najmniej 95%).", bildbeschreibung: "kostka lodu" },
  // ── Pracowitość ──────────────────────────────────────────────────────────
  "tasten-kueken": { name: "Klawiszowe kurczątko", nameNeutral: "Pierwsza runda", description: "Pierwsza ukończona runda.", bildbeschreibung: "kurczątko wychodzące z jajka" },
  "ausdauer-ameise": { name: "Pracowita mrówka", nameNeutral: "Po rozgrzewce", description: "25 rund ćwiczeń.", bildbeschreibung: "mrówka" },
  "marathon-maus": { name: "Maratońska myszka", nameNeutral: "Sto rund", description: "100 rund ćwiczeń.", bildbeschreibung: "głowa myszy" },
  "munteres-murmeltier": { name: "Bystry bóbr", nameNeutral: "Maraton", description: "250 rund ćwiczeń.", bildbeschreibung: "bóbr" },
  dauerlaeufer: { name: "Długi dystans", description: "500 rund ćwiczeń.", bildbeschreibung: "biegnąca osoba" },
  tausendsassa: { name: "Tysiąc i jedna runda", nameNeutral: "Tysiąc rund", description: "1000 rund ćwiczeń.", bildbeschreibung: "wieloryb wypuszczający fontannę wody" },
  // ── Uderzenia ────────────────────────────────────────────────────────────
  "tausend-tasten-tiger": { name: "Tygrys tysiąca klawiszy", nameNeutral: "Tysiąc poprawnych uderzeń", description: "1000 poprawnych uderzeń.", bildbeschreibung: "głowa tygrysa" },
  "tasten-t-rex": { name: "T-rex klawiatury", nameNeutral: "Dziesięć tysięcy poprawnych uderzeń", description: "10 000 poprawnych uderzeń.", bildbeschreibung: "tyranozaur" },
  "galaktische-fingerspitzen": { name: "Galaktyczne palce", description: "50 000 poprawnych uderzeń.", bildbeschreibung: "startująca rakieta" },
  "hunderttausend-held": { name: "Sto tysięcy błyskawic", nameNeutral: "Sto tysięcy poprawnych uderzeń", description: "100 000 poprawnych uderzeń.", bildbeschreibung: "żółta błyskawica" },
  viertelmillion: { name: "Ćwierć miliona", description: "250 000 poprawnych uderzeń - tyle, ile liter w całej książce.", bildbeschreibung: "satelita" },
  // ── Wytrwałość ───────────────────────────────────────────────────────────
  "dranbleib-dachs": { name: "Wytrwały borsuk", nameNeutral: "Wytrwałość", description: "3 różne dni ćwiczeń.", bildbeschreibung: "borsuk" },
  gewohnheitstier: { name: "Wierny żółw", description: "7 różnych dni ćwiczeń.", bildbeschreibung: "żółw" },
  "wie-ein-uhrwerk": { name: "Jak w zegarku", description: "20 różnych dni ćwiczeń.", bildbeschreibung: "czerwony budzik" },
  unaufhaltsam: { name: "Nie do zatrzymania", description: "50 różnych dni ćwiczeń.", bildbeschreibung: "góra z ośnieżonym szczytem" },
  "tief-verwurzelt": { name: "Głębokie korzenie", description: "100 różnych dni ćwiczeń.", bildbeschreibung: "duże, zielone, gęste drzewo" },
  "fels-in-der-brandung": { name: "Skała wśród fal", description: "200 różnych dni ćwiczeń - więcej niż wszystkie dni nauki w jednym roku szkolnym.", bildbeschreibung: "kamienny posąg z Wyspy Wielkanocnej" },
  // ── Tygodnie ćwiczeń ─────────────────────────────────────────────────────
  "vierteljahr-dabei": { name: "Już trzy miesiące", description: "12 różnych tygodni ćwiczeń.", bildbeschreibung: "brązowy jesienny liść" },
  "halbes-jahr-dabei": { name: "Już pół roku", description: "26 różnych tygodni ćwiczeń.", bildbeschreibung: "chmura, z której pada śnieg" },
  // 52 kończy się na 2 (nie 12) ⇒ forma „few": „52 różne tygodnie".
  "ganzes-jahr-dabei": { name: "Cały rok", description: "52 różne tygodnie ćwiczeń.", bildbeschreibung: "tort urodzinowy ze świeczką" },
  // ── Gwiazdki ─────────────────────────────────────────────────────────────
  sternschnuppe: { name: "Spadająca gwiazda", description: "Pierwsza runda z 3 gwiazdkami.", bildbeschreibung: "spadająca gwiazda na nocnym niebie" },
  "sternen-sammler": { name: "Garść gwiazd", description: "10 rund z 3 gwiazdkami.", bildbeschreibung: "świecąca żółta gwiazda" },
  sternenhimmel: { name: "Gwiaździste niebo", description: "30 rund z 3 gwiazdkami.", bildbeschreibung: "Droga Mleczna na nocnym niebie" },
  sternenmeer: { name: "Morze gwiazd", description: "75 rund z 3 gwiazdkami.", bildbeschreibung: "pomarańczowa gwiazda o ośmiu ramionach" },
  // ── Lekcje ───────────────────────────────────────────────────────────────
  "lektions-loewe": { name: "Lew lekcji", nameNeutral: "Pięć lekcji", description: "5 ukończonych lekcji.", bildbeschreibung: "lew" },
  "kapitel-kaeptn": { name: "Cała naprzód!", description: "15 ukończonych lekcji.", bildbeschreibung: "kotwica" },
  // Wie in den anderen Sprachen: die Lektionszahl DES WEGES - nach Doppelpunkt,
  // damit „lekcje" sich nicht nach der Zahl richten muss (Glossar Regel 11).
  "lehrgangs-legende": { name: "Legenda kursu", description: (z) => `Wszystkie lekcje kursu ukończone - razem: ${lektionenFuer(z.lernweg).length}.`, bildbeschreibung: "złoty puchar" },
  // ── Poziomy (krąg punktów) ───────────────────────────────────────────────
  "kletter-koala": { name: "Koala na wspinaczce", nameNeutral: "Poziom 5", description: "Poziom 5 osiągnięty w kręgu punktów.", bildbeschreibung: "koala" },
  "punkte-rakete": { name: "Punktowa rakieta", description: "Poziom 10 osiągnięty w kręgu punktów.", bildbeschreibung: "czerwony balonik" },
  "gipfel-gaemse": { name: "Koza na szczycie", nameNeutral: "Poziom 20", description: "Poziom 20 osiągnięty w kręgu punktów.", bildbeschreibung: "koza" },
  hoehenflug: { name: "Wysoki lot", nameNeutral: "Poziom 50", description: "Poziom 50 osiągnięty w kręgu punktów.", bildbeschreibung: "helikopter" },
  "ueber-den-wolken": { name: "Ponad chmurami", nameNeutral: "Poziom 100", description: "Poziom 100 osiągnięty w kręgu punktów.", bildbeschreibung: "latający talerz" },
  sternenreise: { name: "Podróż do gwiazd", nameNeutral: "Poziom 200", description: "Poziom 200 osiągnięty w kręgu punktów.", bildbeschreibung: "kometa z długim ogonem" },
  // ── Świat klawiatury ─────────────────────────────────────────────────────
  // Die Grundreihe DES WEGES - auf Weg „pl" wie auf „en": a s d f j k l ;
  "grundstellungs-gorilla": {
    name: "Goryl z rzędu podstawowego",
    nameNeutral: "Rząd podstawowy na miejscu",
    description: (z) =>
      `Odblokowano osiem klawiszy pozycji podstawowej: ${lernwegDef(z.lernweg)
        .letterOrder.slice(0, lernwegDef(z.lernweg).homeRowLetters)
        .join(" ")}.`,
    bildbeschreibung: "goryl",
  },
  "gross-baumeister": { name: "Budowla z wielkich liter", nameNeutral: "Wielkie litery", description: "Klawisz Shift opanowany - prawdziwe wielkie litery pisane własną ręką.", bildbeschreibung: "cztery wielkie litery na niebieskich klawiszach" },
  // ⚠️ „puenktchen-panda" und „schlangen-s" gibt es auf Weg „pl" nicht zu
  // verdienen - der Eintrag steht trotzdem da, weil das Regal jedes beschreibt.
  "puenktchen-panda": { name: "Panda w kropki", nameNeutral: "Niemieckie umlauty", description: "Odblokowano ä, ö i ü - niemieckie litery z kropkami.", bildbeschreibung: "panda" },
  "schlangen-s": { name: "S jak wąż", nameNeutral: "Niemieckie ostre s", description: "Odblokowano ß, niemieckie ostre s - ostatnią literę niemieckiej klawiatury.", bildbeschreibung: "wąż" },
  "alphabet-as": { name: "Cały alfabet", description: "Odblokowano wszystkie litery od A do Z.", bildbeschreibung: "małe litery na niebieskich klawiszach" },
  "punkt-und-komma": { name: "Kropka i przecinek", description: "Odblokowano kropkę i przecinek - pierwsze prawdziwe znaki interpunkcyjne.", bildbeschreibung: "czarne pióro do pisania" },
  "satzzeichen-sammler": { name: "Zbiór znaków", nameNeutral: "Cała interpunkcja", description: "Odblokowano znaki interpunkcyjne: . , - ? ! : ;", bildbeschreibung: "duży czerwony wykrzyknik" },
  "zahlen-zebra": { name: "Cyfrowa zebra", nameNeutral: "Połowa cyfr", description: "Odblokowano pięć cyfr w rzędzie cyfr.", bildbeschreibung: "zebra" },
  "zahlen-zauberer": { name: "Magia cyfr", nameNeutral: "Cały rząd cyfr", description: "Odblokowano cały rząd cyfr, od 1 do 0.", bildbeschreibung: "niebieski klawisz z liczbą 10" },
  "klammer-krokodil": { name: "Krokodyl w nawiasach", nameNeutral: "Nawias otwarty, nawias zamknięty", description: "Odblokowano nawiasy ( ) - pierwsze symbole.", bildbeschreibung: "krokodyl" },
  "alltags-ass": { name: "Znaki na co dzień", nameNeutral: "Znaki codzienne", description: (z) => `Odblokowano ${alltagsZeichen(z)} - znaki z e-maili i ze świata pieniędzy.`, bildbeschreibung: "koperta" },
  "tastatur-krone": { name: "Korona klawiatury", nameNeutral: "Cała klawiatura", description: "Odblokowano WSZYSTKIE klawisze klawiatury - aż do ostatniego symbolu.", bildbeschreibung: "złota korona" },
  // ── Opanowane! ───────────────────────────────────────────────────────────
  "feste-burg": { name: "Solidny dom", nameNeutral: "Rząd podstawowy opanowany", description: "Wszystkie klawisze pozycji podstawowej są pewne.", bildbeschreibung: "dom" },
  "buchstaben-baendiger": { name: "Litery poskromione", nameNeutral: "Wszystkie litery opanowane", description: "Każda litera jest pewna - żadna już się nie chwieje.", bildbeschreibung: "czerwony kwadrat z dużą literą A" },
  "zahlen-fels": { name: "Cyfry jak skała", nameNeutral: "Wszystkie cyfry opanowane", description: "Cały rząd cyfr jest pewny.", bildbeschreibung: "liczydło z kolorowymi koralikami" },
  "nichts-wackelt": { name: "Nic się nie chwieje", description: "Każdy klawisz klawiatury jest pewny - cała klawiatura, nie tylko odblokowana.", bildbeschreibung: "niebieski romb z kropką w środku" },
  // ── Tempo ────────────────────────────────────────────────────────────────
  // 60, 90, 120, 160, 200, 300 - alle „many": „uderzeń".
  "flinker-fuchs": { name: "Zwinny lis", nameNeutral: "Szybko i dokładnie", description: "Wymagane tempo osiągnięte I do tego co najmniej 95% dokładności - tempo liczy się tylko wtedy, gdy pisanie jest dokładne.", bildbeschreibung: "lis" },
  "tempo-60": { name: "Skoczny zając", nameNeutral: "60 na minutę, dokładnie", description: "Runda w tempie 60 uderzeń na minutę z dokładnością co najmniej 95%.", bildbeschreibung: "królik" },
  "tempo-90": { name: "Rącza sarna", nameNeutral: "90 na minutę, dokładnie", description: "Runda w tempie 90 uderzeń na minutę z dokładnością co najmniej 95%.", bildbeschreibung: "jeleń" },
  "tempo-120": { name: "Koń w galopie", nameNeutral: "120 na minutę, dokładnie", description: "Runda w tempie 120 uderzeń na minutę z dokładnością co najmniej 98%.", bildbeschreibung: "galopujący koń" },
  "tempo-160": { name: "Parowóz", nameNeutral: "160 na minutę, dokładnie", description: "Runda w tempie 160 uderzeń na minutę z dokładnością co najmniej 98%.", bildbeschreibung: "lokomotywa parowa" },
  "tempo-200": { name: "Pociąg ekspresowy", nameNeutral: "200 na minutę, dokładnie", description: "Runda w tempie 200 uderzeń na minutę z dokładnością co najmniej 98%.", bildbeschreibung: "szybki pociąg" },
  "tempo-300": { name: "Odrzutowiec", nameNeutral: "300 na minutę, dokładnie", description: "Runda w tempie 300 uderzeń na minutę z dokładnością co najmniej 99% - poziom zawodowy.", bildbeschreibung: "mały samolot" },
  // ── Jednym ciągiem ───────────────────────────────────────────────────────
  "kette-100": { name: "Reakcja łańcuchowa", nameNeutral: "100 z rzędu", description: "100 poprawnych uderzeń z rzędu, bez ani jednego błędu.", bildbeschreibung: "dwa ogniwa łańcucha" },
  "kette-250": { name: "Bez potknięcia", description: "250 poprawnych uderzeń z rzędu.", bildbeschreibung: "łańcuch z kilku ogniw" },
  "kette-500": { name: "Nić przewodnia", nameNeutral: "500 z rzędu", description: "500 poprawnych uderzeń z rzędu - więcej niż cała runda.", bildbeschreibung: "szpulka nici" },
  "kette-1000": { name: "Tysiąc bez błędu", description: "1000 poprawnych uderzeń z rzędu.", bildbeschreibung: "góra Fudżi z ośnieżonym szczytem" },
  "kette-2000": { name: "Żelazny łańcuch", nameNeutral: "2000 z rzędu", description: "2000 poprawnych uderzeń z rzędu - cztery albo pięć rund bez najmniejszego potknięcia.", bildbeschreibung: "wulkan, z którego wypływa lawa" },
  // ── Przygody (gra „Skoki po krach", Glossar §2.3) ──────────────────────
  "erste-expedition": { name: "Pierwsza wyprawa", description: "Pierwsza przygoda na krach w swobodnej grze - aż do igloo.", bildbeschreibung: "kompas" },
  polarforscher: { name: "Odkrywanie bieguna", description: "10 przygód na krach ukończonych w swobodnej grze.", bildbeschreibung: "płatek śniegu" },
  "eismeer-legende": { name: "Legenda lodowego morza", description: "30 przygód na krach ukończonych w swobodnej grze.", bildbeschreibung: "wysoka niebieska fala" },
  "packeis-profi": { name: "Pak lodowy opanowany", nameNeutral: "60 przygód", description: "60 przygód na krach ukończonych w swobodnej grze.", bildbeschreibung: "walizka" },
  // ── Wyczyny w przygodach ─────────────────────────────────────────────────
  // „Trockener Frack": Der Frack ist der Pinguin selbst - polnisch „frak".
  "trockener-frack": { name: "Suchy frak", description: "Cała przygoda bez ani jednego upadku do wody lub w śnieg.", bildbeschreibung: "czarny cylinder" },
  "immer-trocken": { name: "Zawsze sucho", description: (z) => `${pl(z.trockeneAbenteuer, "przygoda", "przygody", "przygód")} bez ani jednej kąpieli.`, bildbeschreibung: "zamknięty parasol" },
  fischfaenger: { name: "Dobry połów", description: (z) => `${pl(z.fische, "dodatkowa rybka złowiona", "dodatkowe rybki złowione", "dodatkowych rybek złowionych")} w przygodzie na krach.`, bildbeschreibung: "niebieska ryba" },
  // ── Wyprawa ──────────────────────────────────────────────────────────────
  // Die Zonennamen wie im Spiel (Glossar §2.3): Jaskinia echa, Śnieżyca,
  // Stacja polarna.
  "hoehlen-lauscher": { name: "Słuch nietoperza", description: "Jaskinia echa przebyta aż do wyjścia - w ciemności, tylko na słuch.", bildbeschreibung: "nietoperz" },
  "sturm-trotzer": { name: "Śnieżyca pokonana", description: "Śnieżyca przebyta - ciągi znaków napisane z pamięci.", bildbeschreibung: "twarz, która dmucha wiatrem" },
  "funker-freund": { name: "Przyjaźń przez radio", description: "Cała wiadomość radiowa odczytana i wysłana do Stacji polarnej.", bildbeschreibung: "radio" },
  "polarlicht-entdecker": { name: "Pod zorzą polarną", description: "Cała Wyprawa polarna bez ani jednego błędu - zorza polarna tańczy.", bildbeschreibung: "gwiazda ze smugą iskier" },
  // ── Opowiadania ──────────────────────────────────────────────────────────
  "lese-luchs": { name: "Rozczytany ryś", nameNeutral: "Pierwsze opowiadanie", description: "Pierwsze opowiadanie przeczytane i napisane do końca.", bildbeschreibung: "lampart" },
  buecherwurm: { name: "Mól książkowy", description: "3 opowiadania przeczytane do końca.", bildbeschreibung: "zielona gąsienica" },
  "buecherei-baer": { name: "Miś z biblioteki", nameNeutral: "Osiem opowiadań", description: "8 opowiadań przeczytanych do końca.", bildbeschreibung: "niedźwiedź" },
  vielleser: { name: "Góra książek", description: "15 opowiadań przeczytanych do końca.", bildbeschreibung: "stos kolorowych książek" },
  // ── Czas na czytanie ─────────────────────────────────────────────────────
  "seiten-spatz": { name: "Wróbelek z pierwszej strony", nameNeutral: "Pierwsza strona", description: "Pierwszy etap opowiadania napisany.", bildbeschreibung: "niebieski ptaszek" },
  "kapitel-krake": { name: "Oczytana ośmiornica", nameNeutral: "Dziesięć etapów", description: "10 etapów przeczytanych i napisanych.", bildbeschreibung: "ośmiornica" },
  "geschichten-gigant": { name: "Opowieści na słoniową miarę", description: "30 etapów przeczytanych i napisanych.", bildbeschreibung: "słoń" },
  leseratte: { name: "Czytanie bez końca", nameNeutral: "75 etapów", description: "75 etapów przeczytanych i napisanych.", bildbeschreibung: "zwój pergaminu" },
  // ── Wyczyny czytelnicze ──────────────────────────────────────────────────
  federleicht: { name: "Lekko jak piórko", description: "Cały etap napisany bez ani jednego błędu.", bildbeschreibung: "białe piórko" },
  "in-einem-rutsch": { name: "Jednym tchem", description: "Całe opowiadanie przeczytane do końca w ciągu jednego dnia.", bildbeschreibung: "niebieska spirala" },
  "lesezeichen-held": { name: "Zakładka na swoim miejscu", description: "Czytanie podjęte innego dnia dokładnie w miejscu przerwy.", bildbeschreibung: "zakładka do książki" },
  // ── Mistrzostwo (Glossar §2.4: „Mistrzostwo", nie „egzamin") ─────────────
  "zehn-minuten-abschrift": { name: "Przepisywanie przez 10 minut", description: "Dziesięć minut przepisywania tekstu bez przerwy, z błędami najwyżej 0,5% - jak na prawdziwych zawodach w przepisywaniu.", bildbeschreibung: "stoper" },
  "lehrgangs-meister": { name: "Kurs opanowany", description: (z) => `Wszystkie lekcje kursu ukończone z trzema gwiazdkami - razem: ${lektionenFuer(z.lernweg).length}.`, bildbeschreibung: "czarny biret absolwenta" },
  "goldene-tastatur": { name: "Złota klawiatura", description: "Wszystkie klawisze odblokowane i pewne - a do tego raz 160 uderzeń na minutę z dokładnością 98%. Ostatnia odznaka.", bildbeschreibung: "medal sportowy na wstążce" },
  // ── Sekrety ──────────────────────────────────────────────────────────────
  "gemuetliches-faultier": { name: "Spokojny leniwiec", description: "Bardzo powoli, ale bez ani jednego błędu - dokładność jest ważniejsza niż tempo!", bildbeschreibung: "leniwiec" },
  "comeback-kaenguru": { name: "Skok kangura", description: "Runda z 3 gwiazdkami zaraz po rundzie z 1 gwiazdką.", bildbeschreibung: "kangur" },
  nachteule: { name: "Nocna sowa", description: "Runda ukończona po 21:00.", bildbeschreibung: "sowa" },
  "frueher-vogel": { name: "Ranny ptaszek", description: "Runda ukończona przed 7:00.", bildbeschreibung: "kogut" },
  nimmersatt: { name: "Apetyt na czytanie", description: "3 etapy pochłonięte w ciągu jednego dnia.", bildbeschreibung: "zielone jabłko" },
  "ferien-held": { name: "Wakacje przy klawiaturze", description: "Ćwiczenia w lipcu albo w sierpniu.", bildbeschreibung: "plaża z parasolem" },
  "wochenend-schreiber": { name: "Weekendowe pisanie", description: "Ćwiczenia w sobotę i w niedzielę.", bildbeschreibung: "kartka z kalendarza" },
  "zurueck-im-sattel": { name: "Z powrotem w siodle", description: (z) => `Powrót do ćwiczeń po przerwie dłuższej niż ${pl(z.pauseTage, "dzień", "dni", "dni")} - powrót też się liczy.`, bildbeschreibung: "dwie strzałki krążące w kółko" },
  "doppelt-genaeht": { name: "Dwa razy czysto", description: "Dwie rundy bez błędów, jedna zaraz po drugiej.", bildbeschreibung: "igła z nitką" },
  winterkind: { name: "Zimowe klawisze", description: "Ćwiczenia w grudniu albo w styczniu.", bildbeschreibung: "bałwan" },
  jahreswechsel: { name: "Sylwester i Nowy Rok", description: "Ćwiczenia w ostatni dzień roku albo w pierwszy dzień nowego roku.", bildbeschreibung: "fajerwerki na nocnym niebie" },
  "tages-marathon": { name: "Maraton jednego dnia", description: "Dziesięć rund w ciągu jednego dnia.", bildbeschreibung: "dżokej na koniu wyścigowym" },
  sternentag: { name: "Gwiaździsty dzień", description: "Trzy rundy z trzema gwiazdkami w ciągu jednego dnia.", bildbeschreibung: "słońce z twarzą" },
  blitzsauber: { name: "Lśniąco czysto", description: "Trzy rundy bez błędów w ciągu jednego dnia.", bildbeschreibung: "mydło z bańkami" },
  "volle-woche": { name: "Pełny tydzień", description: "Pięć różnych dni ćwiczeń w JEDNYM tygodniu.", bildbeschreibung: "zielona książka" },
  // „Blindflug" ⇒ „Bez patrzenia": zum Affen, der sich die Augen zuhält.
  // Glossar Regel 4: „bezwzrokowe" ist das Normalwort, aber nie „jak niewidomi".
  blindflug: { name: "Bez patrzenia", description: "Cała runda bez błędu - z ukrytą klawiaturą ekranową. Na tym polega cała sztuka pisania dziesięcioma palcami.", bildbeschreibung: "małpka zasłaniająca oczy rękami" },
  sprachwechsler: { name: "Podróż między językami", description: "Ćwiczenia w dwóch językach - na przykład po polsku i po angielsku.", bildbeschreibung: "kula ziemska z Europą i Afryką" },
  lesenacht: { name: "Czytanie nocą", description: "Etap opowiadania przeczytany po 20:00.", bildbeschreibung: "księżyc z twarzą" },
  "zaehe-taste": { name: "Uparty klawisz", description: "Klawisz, który długo sprawiał kłopot, jest teraz pewny.", bildbeschreibung: "ślimak" },
  aufsteiger: { name: "Pod górę", description: "Pięć poziomów trudności powyżej punktu startowego.", bildbeschreibung: "wykres z linią, która idzie w górę" },
  // ── Nur auf Weg „fr" (`badgesNurFr.ts`) - für eine polnische Bedienung auf
  // diesem Weg; dieselben Gedanken wie dort.
  "akzente-ziffernreihe": { name: "Akrobacje akcentów", nameNeutral: "é, è, ç i à", description: "Odblokowano é, è, ç i à - litery, które mieszkają w rzędzie cyfr.", bildbeschreibung: "cyfry 1 2 3 4 na niebieskim klawiszu" },
  "accent-circonflexe": { name: "Daszek", nameNeutral: "Akcent cyrkumfleks", description: "Klawisz martwy ^ opanowany: ê, â, î, ô i û.", bildbeschreibung: "słomkowy kapelusz ze wstążką" },
  trema: { name: "Biedronka z dwiema kropkami", nameNeutral: "Diereza", description: "Diereza ¨ opanowana: ë, ï i ü.", bildbeschreibung: "biedronka" },
};
