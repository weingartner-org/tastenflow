/**
 * ★★★ O-PL (02.10.2026): DAS HILFE-FENSTER FÜR LEHRKRÄFTE, POLNISCH.
 * ===========================================================================
 * Aus der Funktion geschrieben, in derselben Reihenfolge wie die deutsche,
 * englische, französische, spanische und italienische Fassung (1 bis 12,
 * samt 4a, 4b, 8a, 8b) - wer eine Stelle prüft, findet sie in allen sechs.
 * Sichtbar nur mit `spracheGewaehlt === "pl"` (`LehrerHilfe.tsx`).
 *
 * ── ANREDE (Glossar `recherche-polnisch-2026-10-02/GLOSSAR-pl.md`, Regel 1/2) ──
 * ty-Befehlsform in Schritten („Wybierz", „Naciśnij"), sonst Substantiv- und
 * unpersönlicher Stil („Można zmienić", „ustawia się"); nie die höfliche
 * dritte Person (Glossar Regel 1). Lehrkräfte in der Mehrzahl („nauczyciele"), Kinder „uczniowie",
 * das einzelne Kind „osoba" (Partizipien und Vergangenheit stimmen dann mit
 * „osoba" überein, nicht mit einem geratenen Geschlecht). Keine
 * Ausrufezeichen.
 *
 * ── WAS POLNISCH ANDERS IST ─────────────────────────────────────────────────
 *  · Score-Erklärung und Kurven-Hinweis stehen hier ausgeschrieben - es gibt
 *    (noch) keine polnischen Konstanten wie `SCORE_ERKLAERUNG_IT_INSEGNANTE`.
 *  · Einen polnischen Weg mit eigener Reihenfolge gibt es noch nicht (`pl`
 *    ist bis F4 ein Alias von „en", `lernweg.ts`) - Abschnitt 4 sagt das.
 *  · Tastatur: „Polski (programisty)" mit US-Beschriftung, polnische
 *    Buchstaben mit prawy Alt (AltGr), ź = prawy Alt + X, NVDA-Falle bei ń
 *    (`layouts.ts`, `PL`, nur gelesen).
 *  · Schuljahr: im Programm ab 1. August, in Polen beginnt es am 1. September
 *    (`schuljahrBeginn.ts`, Monat in „Ustawienia klasy" wählbar).
 *  · Abschnitt 12: ★ PL-H (09.10.2026) das Handbuch gibt es auf Polnisch
 *    (`tastenflow-handbuch-pl.pdf`, `HandbuchKnopf` lädt es für „pl"); das
 *    Plakat noch nicht (Bild der Oberfläche fehlt) - der Knopf lädt das
 *    englische, und der Text sagt das.
 *
 * Zahlen mit Nomen über `mehrzahl(…, "pl", …)` mit allen vier Formen.
 * Fliesstext mit „…” (U+201E/U+201D), Knopfnamen mit „przycisk" davor.
 * Nur Bindestrich, keine Maus-Wörter.
 */
import { BrailleTabellenPunkte } from "./ScreenreaderHinweis";
import { AltText, Kbd } from "./TippenHilfeTeile";
import { useRef } from "react";
import { EINSTIEGSFENSTER_MIN, MIND_ZEICHEN, PROBEN_JE_NIVEAU } from "@/lib/typing/schreibprobe";
import { FEHLER_GEWICHT, FEHLER_GEWICHT_FREI } from "@/lib/typing/schreibprobeWertung";
import { mehrzahl } from "@/lib/bedienSprache";
import { useFocusTrap } from "./useFocusTrap";
import { DidaktikInhalt, didaktikAbschnittTitel } from "./DidaktikHinweise";
import { DreiWerteHilfe, LeistungsstufeHilfe } from "./TastenflowZahlenHilfe";
import { RundgangLehrkraftKnoepfe } from "./Rundgang";
import { HandbuchKnopf } from "@/components/lernwerkstatt/HandbuchKnopf";
import { handbuecherFuer, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

// ★ O-PL (02.10.2026): das Wort der Tippchallenge (Glossar §2.3);
// `schreibprobe.ts` führt es seit O-PL ebenso (`PRUEFUNG_WORT_PL`); hier eigene Konstante mit Mehrzahl.
const W = "Wyzwanie";
const WM = "Wyzwania";

/** Das Handbuch - derselbe Knopf wie in den anderen Fassungen. */
function HandbuchLaden() {
  const h = handbuecherFuer("tippen")[0];
  if (!h) throw new Error("Kein Tastenflow-Handbuch in HANDBUECHER");
  return (
    <p className="m-0">
      <HandbuchKnopf alsLink handbuch={h} />
    </p>
  );
}

/** Das Plakat - `div` statt `p` (der Knopf kann einen Fehler-Absatz zeigen). */
function PlakatLaden() {
  return (
    <div className="m-0">
      <HandbuchKnopf alsLink handbuch={tastenflowPlakat()} />
    </div>
  );
}

// ★ 18.10.2026 (Johannes: „passe mac an Wahl-taste an"): `Kbd` und `AltText` aus
//   der Kinder-Hilfe - am Mac heißt die Taste „Wahl" (Option, Opción …), im
//   Kästchen wie im Satz. Vorher stand hier ein eigenes `Kbd`, das immer „Alt" zeigte.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-hairline bg-surface-sunken p-4">
      <h3 className="m-0 mb-1 text-lg font-semibold text-ink">{title}</h3>
      <div className="space-y-2 text-ink-soft">{children}</div>
    </section>
  );
}

export function LehrerHilfePolnisch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  // Alle Zahlen mit Nomen mit vier Formen (Glossar §2.10a), Nominativ.
  const einstieg = mehrzahl(EINSTIEGSFENSTER_MIN, "pl", {
    one: (z) => `${z} minuta`,
    few: (z) => `${z} minuty`,
    many: (z) => `${z} minut`,
    other: (z) => `${z} minuty`,
  });
  const gewichtFrei = mehrzahl(FEHLER_GEWICHT_FREI, "pl", {
    one: (z) => `${z} znak`,
    few: (z) => `${z} znaki`,
    many: (z) => `${z} znaków`,
    other: (z) => `${z} znaku`,
  });
  const probenSatz = mehrzahl(PROBEN_JE_NIVEAU, "pl", {
    one: (z) => `jest ${z} tekst Wyzwania`,
    few: (z) => `są ${z} teksty Wyzwania`,
    many: (z) => `jest ${z} tekstów Wyzwania`,
    other: (z) => `jest ${z} tekstu Wyzwania`,
  });
  const mindZeichen = mehrzahl(MIND_ZEICHEN, "pl", {
    one: (z) => `${z} znak`,
    few: (z) => `${z} znaki`,
    many: (z) => `${z} znaków`,
    other: (z) => `${z} znaku`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Pomoc dla nauczycieli do programu Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-3xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">
            Pomoc dla nauczycieli: wszystkie funkcje programu Tastenflow
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="btn-secondary btn-toggle"
            onClick={onClose}
            aria-label="Zamknij pomoc"
          >
            ✕ Zamknij
          </button>
        </div>
        <RundgangLehrkraftKnoepfe onStart={onClose} />

        <p className="m-0 text-ink-soft">
          Program Tastenflow ma <strong>własny system kont</strong>, całkowicie
          oddzielony od logowania do platformy edukacyjnej. Logowanie tutaj nie
          wpływa na sesję platformy - i odwrotnie.
        </p>

        <Section title="1 · Tworzenie klas i kont">
          <p className="m-0">
            Po otwarciu programu Tastenflow konto dla nauczycieli zawsze zaczyna w
            części <strong>„Moje klasy”</strong>; do własnych ćwiczeń prowadzi
            przycisk Poćwicz (<Kbd>Alt</Kbd> + <Kbd>U</Kbd>). Klasę tworzy się w
            części <strong>„Uczniowie i dostęp”</strong> u góry po prawej - w
            rozwijanej sekcji <strong>Utwórz nową klasę</strong>.{" "}
            <strong>Kod klasy</strong> jest obowiązkowy: podczas wpisywania nazwy
            program proponuje pasujący kod (z „SP 12 Gdynia” powstaje
            „SP12GDYNIA”); można go zmienić, na przykład na <code>3B-SP12</code>.
            Kod obowiązuje całą klasę. W tej samej sekcji wybierz{" "}
            <strong>klasę, do której chodzą uczniowie</strong>, i{" "}
            <strong>punkt startowy</strong> oraz sprawdź język (z kłódką) i Wyścig
            klasowy - to te same pola co w „Ustawieniach klasy”. Przycisk{" "}
            <strong>Utwórz klasę</strong> działa dopiero wtedy, gdy wszystko jest
            wypełnione; w przeciwnym razie jedno zdanie mówi, czego brakuje, a
            fokus stoi w pierwszym brakującym polu.
          </p>
          <p className="m-0">
            Następnie przyciskiem <strong>Dodaj osobę</strong> dodaj uczniów z{" "}
            <strong>imieniem i hasłem</strong>. Potem mogą się logować z{" "}
            <strong>każdego urządzenia</strong> za pomocą{" "}
            <em>kodu klasy, imienia i hasła</em>. Urządzenie zapamiętuje kod klasy,
            więc uczniowie wpisują już tylko imię i hasło.
          </p>
          <p className="m-0">
            Nazwę i kod klasy można później zmienić przyciskiem{" "}
            <strong>✏️ Edytuj</strong> - nowy kod obowiązuje wtedy wszystkich
            uczniów klasy (od tej chwili logują się nowym kodem).
          </p>
          <p className="m-0">
            <strong>Inna możliwość:</strong> osoby, które nie należą do żadnej
            klasy, mogą też <strong>samodzielnie założyć konto</strong> - w oknie
            logowania, przez zaznaczenie pola „Ćwiczę na własną rękę, bez klasy” i
            podanie adresu e-mail. Dla nauczycieli nic się nie zmienia: takie konta
            nie należą do żadnej klasy, nie pojawiają się na żadnej liście i
            dostają podsumowanie tygodnia bezpośrednio. W klasie wszystko zostaje
            po staremu - konta uczniów zakłada się w części „Uczniowie i dostęp”.
          </p>
        </Section>

        <Section title="2 · Ustawienia klasy i każdej osoby">
          <p className="m-0">
            <strong>Dla całej klasy</strong> (przycisk „Ustawienia klasy” w wierszu
            zadań nad tabelą, obok przycisków {W}, Własne ćwiczenie, Cel tygodniowy
            i Wstrzymaj na godzinę - już zwinięty pokazuje klasę, język i Wyścig
            klasowy):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Klasa:</strong> z niej program wylicza poziom tekstów -
              słownictwo, rodzaj żartów i ton tekstów do ćwiczeń. Klasa 7 (szkoła
              podstawowa) to mniej więcej 13 lat, czyli teksty dla 11-15 lat.{" "}
              <strong>Rośnie razem z klasą:</strong> program zapamiętuje rok
              szkolny wpisu i co roku przesuwa klasę o jeden w górę, bez żadnych
              zmian w ustawieniach. W programie{" "}
              <strong>rok szkolny zaczyna się 1 sierpnia</strong> i kończy 31 lipca,
              chyba że w „Ustawieniach klasy” wybrano inny miesiąc początku (w
              Polsce rok szkolny zaczyna się 1 września): z początkiem roku klasa
              przechodzi do następnej, a statystyki roku szkolnego trzymają się tego
              samego kalendarza. Dla grup osób dorosłych jest poziom{" "}
              <strong>„Osoby dorosłe”</strong> - on się nie zmienia. Roku urodzenia
              uczniów klasy się nie zbiera.
            </li>
            <li>
              <strong>Język i blokada:</strong> niemiecki lub angielski - a w klasie
              tych dróg także hiszpański lub francuski - dla słów i tekstów ćwiczeń
              całej klasy; z kłódką obok uczniowie nie mogą go już zmienić. Okrągły
              przycisk języka (z globusem) u góry ma każda osoba: zmienia przyciski i
              menu, a od razu też teksty ćwiczeń - przy blokadzie tylko przyciski i
              menu.
            </li>
            <li>
              <strong>Punkt startowy klasy:</strong> „od czego zacząć” jako
              ustawienie dla całej klasy - obowiązuje też każdą osobę, która dołączy
              później, i tylko dodaje klawisze: osoba, która jest już dalej, nic nie
              traci. Przy wyborze program od razu wpisuje ten punkt także obecnym
              uczniom; jeśli ktoś jest już dalej, najpierw pyta i proponuje trzy
              drogi: ustawić wszystkich, tylko osoby, które nie są jeszcze tak
              daleko, albo anulować. Zmiana działa, gdy dana osoba następnym razem
              otworzy program Tastenflow; statystyki i odznaki zostają w każdym
              przypadku.
            </li>
            <li>
              <strong>Wyścig klasowy dozwolony:</strong> uczniowie mogą się
              nawzajem zapraszać do 5-minutowego wyścigu. W „Czasach ćwiczeń” w
              rozwiniętym wierszu widać, ile razy w tygodniu dana osoba brała
              udział - bez miejsc i bez czasów.
            </li>
            <li>
              <strong>Koniec wiersza klawiszem Enter:</strong> gdy pole jest
              zaznaczone, każda osoba w klasie kończy każdy wiersz ćwiczenia
              klawiszem Enter - jak przy pisaniu w biurze. Dotyczy „Mojego
              treningu”, opowiadań, własnego ćwiczenia, gier słownych z wierszami,
              Wyzwania i Wyścigu klasowego; nie dotyczy zagadek, gier Pomieszane
              litery i Dyktando palców, gry Wyprawa polarna ani okna Odkrywaj
              klawisze. Domyślnie: wyłączone.
            </li>
          </ul>
          <p className="m-0">
            <strong>Dla każdej osoby</strong> (za strzałką w jej wierszu):
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Klawiatura:</strong> do wyboru w Ustawieniach, w części
              „Klawiatura” - w Polsce zwykle klawiatura polska (programisty): w
              Windows „Polski (programisty)”, na Macu „Polski Pro”. Ustawienie
              obowiązuje na tym urządzeniu (nie na koncie) i steruje klawiaturą
              ekranową, podpowiedziami dla palców i tym, jakie znaki są ćwiczone. Na
              klawiaturze polskiej: (1) <strong>polskie litery</strong> pisze się
              prawym Altem: <Kbd>prawy Alt (AltGr)</Kbd> + litera (ą = prawy Alt +
              A, ź = prawy Alt + X), wielkie dodatkowo z klawiszem Shift; na Macu
              zamiast prawego Alta - Option; (2) na klawiszach jest tylko napis
              amerykański, polskie litery nie są nadrukowane; (3) litera bez ogonka
              czy kreski nie zastępuje polskiej - a w miejscu ą to pomyłka; (4) z
              NVDA w Windows prawy Alt + N (ń) uruchamia NVDA od nowa (skrót Ctrl +
              Alt + N) - ten skrót trzeba wyłączyć w NVDA albo naciskać Shift + Caps
              Lock + prawy Alt + N.
            </li>
            <li>
              <strong>Od czego zacząć?</strong> ta sama lista punktów startowych co
              dla całej klasy (patrz wyżej) - tutaj dla jednej osoby, która
              potrzebuje wyjątku. Osoby bardziej zaawansowane pomijają w ten sposób
              podstawy i zaczynają dalej (np. dopiero od cyfr); przed cofnięciem
              program pyta o potwierdzenie.
            </li>
            <li>
              <strong>Pisanie jedną ręką:</strong> znosi dla tej osoby regułę
              „Shift drugą ręką” - wielkie litery i symbole liczą się wtedy z każdym
              klawiszem Shift.
            </li>
            <li>
              <strong>Bez pośpiechu:</strong> tempo tej osoby nie jest nigdzie
              oceniane - brak limitu czasu w grze, brak celu tempa przy gwiazdkach,
              brak awansu i spadku poziomu trudności z powodu tempa. Dla osób, które
              piszą starannie, ale bardzo wolno.
            </li>
            <li>
              <strong>Duże odstępy (CVI):</strong> większy odstęp między znakami
              przy przepisywaniu, w trzech stopniach (podwójne, potrójne, poczwórne)
              - dla osób z mózgowymi zaburzeniami widzenia (CVI), u których znaki
              stojące blisko siebie zlewają się. Odstęp można też zmienić w
              ustawieniach ucznia (koło zębate, <AltText>Alt + O</AltText>) - a tutaj w każdej chwili z
              powrotem. Obowiązuje to, co wybrano ostatnio.
            </li>
          </ul>
          <p className="m-0">
            Wszystko można w każdej chwili zmienić - ustawienia klasy w panelu
            „Ustawienia klasy” nad tabelą, ustawienia każdej osoby w jej
            rozwiniętym wierszu.
          </p>
        </Section>

        <Section title="3 · Poziom trudności (1-50): serce programu">
          <LeistungsstufeHilfe />
          <p className="m-0">
            <strong>Aktualny poziom</strong> jest w tabeli (kolumna{" "}
            <strong>„Poziom trudności”</strong>) i u góry ekranu ćwiczeń. Nie
            trzeba niczego ustawiać - w razie potrzeby wystarczy włączyć „Bez
            pośpiechu”.
          </p>
        </Section>

        <Section title="4 · „Mój trening”: adaptacyjnie, według częstości liter">
          <p className="m-0">
            Program Tastenflow ma <strong>jedną</strong> drogę ćwiczeń, którą każda
            osoba przechodzi we własnym tempie - i ta droga{" "}
            <strong>dopasowuje się</strong>: program mierzy każdy klawisz osobno,
            automatycznie ćwiczy najsłabsze i odblokowuje nowy dopiero wtedy, gdy
            poprzednie są pewne.
          </p>
          <div className="rounded-xl border border-accent bg-accent-soft p-3">
            <p className="m-0 font-semibold text-ink">Kolejność według częstości liter</p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5">
              <li>
                Po pozycji podstawowej najpierw przychodzą litery{" "}
                <strong>najczęstsze</strong> - już po kilku klawiszach powstają{" "}
                <strong>prawdziwe słowa</strong>.
              </li>
              <li>
                <strong>Każda droga jest inna</strong> - następny klawisz zależy od
                osoby, a nie od stałej listy.
              </li>
              <li>
                <strong>Bez stałego końca</strong> - idealne do codziennych,
                samodzielnych ćwiczeń.
              </li>
            </ul>
          </div>
          <p className="m-0 rounded-xl border border-warning/40 bg-warning/10 p-3">
            <strong>Do planowania:</strong> <strong>droga polska</strong> ma{" "}
            <strong>własną kolejność klawiszy</strong>, zmierzoną na polskich
            tekstach, dla klawiatury polskiej. Zaczyna się od rzędu podstawowego
            f j d k s l a ;, potem idą w o n t e i m z, pierwsza litera z prawym
            Altem (ę) i c y r p u; dopiero wtedy Shift z kropką i przecinkiem, a
            dalej ł b g ż ą ś ć h ó ń. Na końcu stoją x ź v q. Polskie litery
            wchodzą pojedynczo, według pożytku, i nigdy przed swoją literą
            podstawową - dzięki temu prawdziwe słowa i zdania powstają szybko.
          </p>
          <p className="m-0 rounded-xl border border-hairline bg-surface-raised p-3">
            <strong>Kolejność zależy od języka pierwszej sesji:</strong> to, którą
            drogą idzie klasa, zależy od języka menu przy pierwszym ćwiczeniu -
            niemieckiego, angielskiego, francuskiego albo hiszpańskiego. Klasa,
            która zaczęła po niemiecku albo po angielsku, zachowuje tę kolejność
            także po zmianie menu: kolejność ustala się raz i potem już się nie
            zmienia.
          </p>
          <p className="m-0">
            <strong>Ten sam tekst dla całej klasy:</strong> teksty kursu (rząd
            podstawowy, rzędy liter, znaki interpunkcyjne, cyfry, symbole, całe
            teksty) są dostępne jako <strong>szablony</strong> w części{" "}
            <strong>„Własne ćwiczenie”</strong> w „Moich klasach” - wybierz jeden, a
            cała klasa ćwiczy ten sam tekst, niezależnie od tego, na jakim etapie
            jest każda osoba (tak jak przy przesłanym pliku liczy się to do czasu
            ćwiczeń, a nowe klawisze nie są przy tym odblokowywane).
          </p>
        </Section>

        <Section title="4a · „Własne ćwiczenie”: jeden tekst dla całej klasy">
          <p className="m-0">
            Przyciskiem <strong>Własne ćwiczenie</strong> w wierszu zadań statystyk
            klasy ustala się tekst, który ćwiczy cała klasa - niezależnie od tego,
            na jakim etapie jest każda osoba. Do tekstu prowadzą trzy drogi:{" "}
            <strong>prześlij plik</strong> (.txt lub .docx), wybierz tekst zapisany
            wcześniej w <strong>„Moich tekstach”</strong> albo weź jeden z{" "}
            <strong>szablonów</strong> kursu (patrz punkt 4).
          </p>
          <p className="m-0">
            <strong>„Moje teksty”</strong> to własny, trwały zbiór - należy do
            konta, a nie do klasy, i widać go tylko na tym koncie. Przy przesyłaniu
            pole <strong>Zapisz w Moich tekstach</strong> (domyślnie zaznaczone)
            automatycznie zapisuje tam kopię, żeby można było później użyć tego
            samego tekstu bez ponownego przesyłania pliku.
          </p>
          <p className="m-0">
            Jeśli plik zawiera znaki, których nie da się napisać, panel pokazuje je
            przed startem jako listę - można wtedy poprawić plik albo mimo to zacząć
            (te znaki wypadają wtedy z wierszy i nigdy nie są obowiązkowym
            uderzeniem).
          </p>
          <p className="m-0">
            <strong>Zacznij własne ćwiczenie:</strong> każda osoba od razu dostaje
            okno z zapowiedzią ćwiczenia dla klasy - może tylko nacisnąć przycisk{" "}
            <strong>Dalej</strong>, nie może odmówić. Dla każdej osoby ćwiczenie
            kończy się automatycznie, gdy tylko raz napisze cały tekst; potem
            ćwiczy dalej normalnie. Przycisk <strong>Zakończ ćwiczenie</strong>{" "}
            kończy je wcześniej dla całej klasy.
          </p>
          <p className="m-0">
            Ćwiczenie liczy się do czasu ćwiczeń i jest mierzone jak każda inna
            runda, także niepewne klawisze - ale{" "}
            <strong>nie odblokowuje nowego klawisza</strong>: to, które klawisze się
            pojawiają, zależy wyłącznie od pliku.
          </p>
        </Section>

        <Section title={didaktikAbschnittTitel("pl")}>
          <DidaktikInhalt lang="pl" />
        </Section>

        <Section title="5 · Sensowne teksty od samego początku">
          <p className="m-0">
            Program pokazuje <strong>jak najwcześniej</strong> prawdziwe teksty
            dopasowane do wieku - dowcipy, przysłowia, powiedzenia, teksty z
            ciekawostkami, łamańce językowe, gry słowne i całe zdania. Tekst pojawia
            się, gdy tylko jego <strong>litery</strong> są opanowane; zwykła
            „sałatka z liter” to wyjątek (tylko po to, żeby celowo poćwiczyć
            zupełnie nowy klawisz).
          </p>
          <p className="m-0">
            <strong>Wielkie litery:</strong>{" "}
            <strong>pisownia jest zawsze poprawna</strong> (wielka litera na
            początku zdania i w nazwach własnych) - uczniowie nigdy nie widzą źle
            napisanego słowa. Na początku wystarczy <strong>mała</strong> litera;
            wielka pojawia się automatycznie (dla{" "}
            <strong>wszystkich grup wiekowych</strong>, bo poprawna pisownia liczy
            się w każdym wieku).
          </p>
          <p className="m-0">
            W <strong>„Moim treningu” prawdziwy klawisz Shift przychodzi jednak
            wcześnie</strong> - już po pierwszych częstych literach, gdy tylko jest
            dość prawdziwych słów do ćwiczenia (a nie dopiero po całym alfabecie).
            Od tej chwili wielkie litery pisze się „naprawdę” z klawiszem Shift.
            Dzięki temu uczniowie wcześnie uczą się pisać wielkie litery{" "}
            <strong>samodzielnie</strong>, zamiast długo polegać na automatycznej
            pomocy.
          </p>
          <p className="m-0">
            <strong>Znaki interpunkcyjne</strong> (kropka, przecinek, znak zapytania
            …) pojawiają się dopiero wtedy, gdy są opanowane - wcześniej zdanie stoi
            „bez kropki i przecinka”. Klawisz <em>litery</em> lub <em>cyfry</em>,
            który nie jest jeszcze opanowany, nie jest natomiast{" "}
            <strong>nigdy</strong> wymagany.
          </p>
        </Section>

        <Section title="6 · Gwiazdki, odznaki i dźwięki (ważne dla uczniów z niepełnosprawnością wzroku)">
          <p className="m-0">
            Każda runda daje <strong>1-3 gwiazdki</strong> za dokładność i tempo -{" "}
            <strong>dokładność liczy się potrójnie</strong>: 3 gwiazdki wymagają
            zawsze około 96% trafień (szybkie, niechlujne pisanie nie jest
            nagradzane); runda bez błędów ma natomiast 2 gwiazdki na pewno, nawet w
            najwolniejszym tempie. Każda liczba gwiazdek ma{" "}
            <strong>własny dźwięk</strong>; przy{" "}
            <strong>awansie na wyższy poziom</strong> słychać specjalny radosny
            dźwięk. Te dźwięki są główną informacją zwrotną dla uczniów z
            niepełnosprawnością wzroku. Przyciskiem <strong>🔇</strong> można
            wyłączyć dźwięk w cichej klasie.
          </p>
          <p className="m-0">
            Do tego dochodzą <strong>odznaki</strong> o nazwach przyjaznych dzieciom
            - w rodzinach ze stopniami i z „następnym krokiem”, który zawsze można
            odczytać. Nazwy ze zwierzętami widzą tylko osoby w wieku 7-10 lat; od
            tekstów dla 11-15 lat wszędzie stoi neutralna nazwa. Odznaki są przy tym
            te same - zdobyta odznaka zostaje, także po zmianie poziomu tekstów.
            Prawie wszystkie nagradzają <strong>dokładność i wytrwałość</strong>;
            jedyna odznaka za tempo wymaga 95% dokładności. Nowa odznaka przynosi
            własny dźwięk „ta-da” z komunikatem i stoi potem w statystykach na
            górze (u ucznia i u nauczycieli - ten sam widok). Każdą odznakę można{" "}
            <strong>wybrać</strong> - pojawia się wtedy w dużym rozmiarze z
            efektem.
          </p>
          <p className="m-0">
            <strong>Skoki po krach 🐧</strong> to nagroda po nowym klawiszu w
            „Moim treningu”: pingwin pokonuje trasę z{" "}
            <strong>najbardziej niepewnych znaków</strong> danej osoby (raz kry na
            wodzie, raz dodatkowo góra liter ze zjazdem na brzuchu).{" "}
            <strong>Klawisz jest odblokowany już wcześniej</strong> - postęp w
            nauce nie zależy od żadnej gry. Dowolnie wiele prób, bez końca gry; przy
            wymaganiu „tylko dokładność” (i na poziomie trudności 1) nie ma{" "}
            <strong>presji czasu</strong> (limit czasu, który można wyłączyć,
            zgodnie z WCAG). Dodatkowo osoby z grup tekstów{" "}
            <strong>7-10 i 11-15 lat</strong> mogą w każdej chwili dobrowolnie
            uruchomić grę przyciskiem <strong>Graj</strong> - jako „przygodę dnia” z{" "}
            <strong>dodatkowymi rybkami</strong> (głos ryby i odczytanie znaku;
            przegapiona rybka to nie błąd) i <strong>Jaskinią echa</strong>, w
            której każdy klawisz jest tylko zapowiadany (tam program mówi nawet przy
            wyłączonym czytaniu na głos - uczniowie z niepełnosprawnością wzroku i
            bez niej grają dokładnie tak samo; jaskinia celowo NIGDY nie pojawia się
            w rundzie w nagrodę). Bezbłędny przebieg kończy się zorzą polarną;
            ukończone przygody, rybki i bezbłędne przebiegi dają rodzinę odznak{" "}
            <strong>„Przygody”</strong>. Ważne dla oceny: gra{" "}
            <strong>nie liczy się do czasu ćwiczeń</strong> ani do celu
            tygodniowego - to czysta motywacja.
          </p>
          <p className="m-0">
            <strong>Dwie różne drogi do gry - łatwo je pomylić:</strong> przycisk{" "}
            <strong>Graj</strong> to swobodne wejście, które uczniowie wybierają
            samodzielnie; jest dla grup <strong>7-10 i 11-15 lat</strong>, od 16
            lat nie. Runda <strong>po nowym klawiszu</strong> przychodzi natomiast
            automatycznie: w grupie 7-10 lat zawsze, od 16 lat nigdy, a w grupie
            11-15 lat tylko wtedy, gdy w Ustawieniach w części{" "}
            <strong>„Gra w nagrodę”</strong> zamiast <strong>Bez gry</strong>{" "}
            (ustawienie domyślne) wybrano Skoki po krach. To ustawienie należy do{" "}
            <strong>urządzenia</strong>, a nie do konta - jak układ klawiatury. Na
            komputerze klasowym obowiązuje więc wszystkie osoby, które na nim
            ćwiczą.
          </p>
        </Section>

        <Section title="7 · Cel tygodniowy">
          <p className="m-0">
            Dla każdej osoby ustawia się <strong>minuty na tydzień</strong> - bez
            jednostek lekcyjnych. Przycisk <strong>Zastosuj dla całej klasy</strong>{" "}
            zapisuje tę samą wartość wszystkim uczniom klasy naraz i obowiązuje
            także osoby, które dołączą później.
          </p>
          <p className="m-0">
            Zmiana obowiązuje zawsze{" "}
            <strong>od następnego poniedziałku, 8:00</strong> - bieżący tydzień
            zachowuje dotychczasowy cel. Przed zapisaniem okienko podaje dokładną
            datę.
          </p>
          <p className="m-0">
            <strong>Nadrabianie:</strong> gdy zaznaczone jest pole „Nadrób brakujące
            minuty z poprzednich tygodni”, zaległe minuty z wcześniejszych tygodni
            można nadrobić wszystkie naraz.
          </p>
          <p className="m-0">
            <strong>Zwolnienie z celu na tydzień</strong> (np. przy chorobie) i{" "}
            <strong>Wyzeruj zaległe minuty</strong> działają jak dotąd - dla każdej
            osoby osobno, bez zmiany przećwiczonego czasu.
          </p>
          <p className="m-0">
            <strong>Wstrzymaj cel na godzinę:</strong> osobny przycisk dla całej
            klasy, na 60 minut. Ćwiczyć można dalej - czas ćwiczeń i statystyki
            liczą się dalej, tylko nie cel tygodniowy w tej godzinie. Drugie
            naciśnięcie tego samego przycisku wznawia cel wcześniej.
          </p>
        </Section>

        <Section title="8 · Statystyki i postępy (do rozwinięcia dla każdej osoby)">
          <p className="m-0">
            Okrągłym przyciskiem ze strzałką<span aria-hidden="true"> ▸</span>{" "}
            przed imieniem otwiera się sześć wierszy, każdy zwijany osobno, od
            góry: <strong>Ustawienia</strong> (wartości z punktu 2 dla tej jednej
            osoby), <strong>{WM}</strong> (tylko gdy co najmniej jedno zostało
            napisane), <strong>Czasy ćwiczeń</strong> (tydzień po tygodniu, ze
            stanem celu tygodniowego i - jeśli były gry - z liczbą Wyścigów
            klasowych, do tego mapa całego roku szkolnego),{" "}
            <strong>Niepewne klawisze</strong>, <strong>Odznaki</strong> i - tylko
            przy wartości, która zwraca uwagę - <strong>Samodzielność</strong>{" "}
            (patrz punkt 9).
          </p>
          <p className="m-0">
            Na górze „Czasów ćwiczeń” widać, w ilu Wyścigach klasowych dana osoba
            brała udział (liczone w tej klasie; jak daleko wstecz sięga liczenie,
            mówi podpowiedź przy liczniku); Enter na tygodniu otwiera pojedyncze
            sesje - dzień, godzinę od-do, czysty czas pisania i to, co było
            ćwiczone.
          </p>
          <p className="m-0">
            To, czego tu już osobno nie ma - wyniki w skrócie, postępy w czasie,
            stan klawiszy, opowiadania i ciekawostki - nie ginie: wszystko jest w
            części <strong>„Moje postępy”</strong> danej osoby, a nauczyciele widzą
            tam dokładnie ten sam widok co ta osoba.
          </p>
          <p className="m-0">
            <strong>Wynik:</strong> łączy dokładność i tempo danej osoby w jednej
            liczbie od 0 do 100; jedna pomyłka liczy się jak 5 znaków, a dwa razy
            szybsze tempo tylko 1,4 raza - dokładność wygrywa z tempem.
          </p>
          <p className="m-0">
            <strong>W tabeli klasy</strong> trzy kolumny stoją razem pod nagłówkiem{" "}
            <strong>„Ćwiczenia”</strong>: Dokładność, Uderzenia/min i Wynik.
            Wszystkie trzy pochodzą z ćwiczeń w wybranym okresie, a wynik łączy dwie
            pozostałe. Dlatego są lekko zabarwione i otoczone cienką linią; czytnik
            ekranu zapowiada „Ćwiczenia” przed nagłówkiem kolumny. Kolumna{" "}
            <strong>„{W}”</strong> po prawej stronie stoi celowo poza tą grupą - pod
            własnym nagłówkiem: to jedno wyzwanie w konkretnym dniu, a nie
            codzienne ćwiczenie.
          </p>
          <p className="m-0">
            W kolumnie <strong>„Wynik”</strong>: osoba, która w wybranym okresie
            napisała mniej niż 200 znaków, nie dostaje wyniku, tylko kreskę -
            poniżej tej granicy jedna pomyłka decydowałaby o kilku punktach.
          </p>
          <p className="m-0">
            Przycisk <strong>Pobierz jako plik Excel</strong> jest nad tabelą, na
            prawo od „Od początku”. Pobiera tabelę jako plik{" "}
            <strong>nazwaklasy_data.xlsx</strong> (na przykład
            „3a_2026-09-12.xlsx”) - niezależnie od tego, jaki okres jest teraz
            wybrany. Na początku jest przegląd z linkami do czterech okresów i
            legenda, która objaśnia każdą kolumnę i pokazuje, jak liczony jest
            wynik. Potem są cztery arkusze: bieżący rok szkolny, od początku,
            miesiąc (ostatnie 4 tygodnie) i ten tydzień. Wartości są zapisane jako
            liczby, żeby można było dalej liczyć w programie Excel; gdzie tabela
            pokazuje kreskę, plik też ma kreskę.
          </p>
          <p className="m-0">
            <strong>Przegląd klasy</strong> nad tabelą pokazuje klasę jako całość.
            Domyślnie wybrany jest „Miesiąc” (ostatnie 4 tygodnie), obok jest „Rok
            szkolny”. Jeden wiersz podaje uderzenia na minutę, dokładność i cele
            tygodniowe, każde z małym trendem - przy miesiącu w porównaniu z 4
            tygodniami wcześniej, przy roku szkolnym pierwsze tygodnie ćwiczeń w
            porównaniu z ostatnimi. Pełne zdanie jest w podpowiedzi; czytnik ekranu
            odczytuje je razem z liczbą, łącznie z osobami, które w tym okresie nie
            ćwiczyły.
          </p>
          <p className="m-0">
            <strong>Pasek punktów „Wyniki w klasie”</strong> pokazuje jeden punkt na
            osobę. Klawiszem Tab przechodzi się na pasek, strzałkami od osoby do
            osoby - każdy przystanek jest odczytywany („Ania, 78 punktów”). Ile osób
            ma poniżej 50, od 50 do 70, od 70 do 85 i powyżej 85 punktów oraz które
            osoby napisały za mało, podaje podpowiedź przy jego nagłówku.
          </p>
          <p className="m-0">
            <strong>Wykres liniowy „Wynik klasy w roku szkolnym”</strong> pokazuje
            dla każdego tygodnia średnią osób, które napisały co najmniej 5 wierszy;
            przerwa oznacza, że w tym tygodniu było za mało ćwiczeń. Klawiszem Tab
            przechodzi się na wykres, strzałkami od tygodnia do tygodnia; dla
            czytnika ekranu wszystkie tygodnie są dodatkowo w tabeli. Gdy dochodzą
            klawisz Shift, cyfry albo symbole, linia na krótko spada - to normalne i
            nie ma powodu do niepokoju.
          </p>
          <p className="m-0">
            <strong>Krzywa:</strong> to normalne, że krzywa nie tylko rośnie. Gdy
            dochodzą nowe klawisze, zwykle najpierw spada - szczególnie przy
            klawiszu Shift i przy cyfrach.
          </p>
          <p className="m-0">
            <strong>Przejrzystość danych:</strong> każda osoba widzi w części „Moje
            postępy” dokładnie te same wartości o sobie - nauczyciele nigdy nie
            widzą więcej niż ta osoba.
          </p>
        </Section>

        <Section title="8a · Wartości, na których można oprzeć ocenę">
          <DreiWerteHilfe />
        </Section>

        <Section title={`8b · ${W}: zadanie dla całej klasy`}>
          <p className="m-0">
            W części dla nauczycieli <strong>„Moje klasy”</strong>, na samej górze{" "}
            <strong>statystyk klasy</strong> programu Tastenflow, w wierszu zadań,
            jest przycisk <strong>{W}</strong>. Otwiera formularz, którym uruchamia
            się {W} dla całej klasy -{" "}
            <strong>wszyscy uczniowie dostają ten sam tekst</strong>, niezależnie od
            tego, jak daleko są w kursie.
          </p>
          <p className="m-0">
            <strong>Ustawia się trzy rzeczy:</strong>{" "}
            <strong>używane klawisze</strong> (od „Rząd podstawowy” do „Wszystkie
            klawisze”), tuż obok <strong>rodzaj</strong> i{" "}
            <strong>czas wyzwania</strong> w minutach. Przycisk{" "}
            <strong>Zacznij teraz</strong> uruchamia je od razu.
          </p>
          <p className="m-0">
            <strong>Ścisłe</strong> (domyślnie) działa jak dotąd: zły klawisz nie
            przesuwa dalej, każda pomyłka się liczy - także natychmiast poprawiona.{" "}
            <strong>Swobodne pisanie</strong> pasuje do przepisywania, jakie
            młodzież zna z testów pisania na czas: błędy zostają i nie są
            zaznaczane, klawisz Backspace poprawia tylko w bieżącym wierszu. Liczy
            się dopiero na końcu to, co jest jeszcze źle - najwyżej jeden błąd na
            słowo, rozpoczęte ostatnie słowo się nie liczy, a poprawione miejsca nie
            liczą się wcale. Ponieważ pozostawiony błąd nie kosztował przy tym
            czasu, waży więcej: {gewichtFrei} zamiast {FEHLER_GEWICHT} (8a). Wybierz
            „Swobodne pisanie”, gdy klasa ma ćwiczyć przepisywanie, a pomyłka nie
            powinna zatrzymywać pisania; „Ścisłe” - do sprawdzenia samych dróg
            klawiszy.
          </p>
          <p className="m-0">
            <strong>Trzy zegary, które trzeba rozróżniać:</strong>
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Moment startu</strong> - chwila naciśnięcia przycisku Zacznij
              teraz. Od niej klasa może zaczynać.
            </li>
            <li>
              <strong>Okno wejścia</strong>: {einstieg} od momentu startu. Tak
              długo osoba może jeszcze dołączyć; później jest za późno.
            </li>
            <li>
              <strong>Czas wyzwania</strong> biegnie{" "}
              <strong>dla każdej osoby osobno</strong>, i to dopiero od jej{" "}
              <strong>pierwszego naciśnięcia klawisza</strong>. Dwie osoby z tej
              samej klasy kończą więc o różnych porach - to celowe: kto najpierw
              szuka swojego miejsca, nie traci czasu wyzwania.
            </li>
          </ul>
          <p className="m-0">
            <strong>Teksty:</strong> dla każdego zestawu klawiszy{" "}
            <strong>{probenSatz}</strong>, a każdy ma co najmniej {mindZeichen} -
            tak dużo, że tekst nie skończy się nawet przy wysokim tempie.{" "}
            <strong>Nie występują w kursie</strong>, więc nikt nie mógł ich
            wcześniej przećwiczyć. Następne {W} z tym zestawem zaczyna się tam, gdzie
            w poprzednim zatrzymała się osoba, która doszła najdalej: w następnym
            wierszu, a w tekstach ze zdaniami na początku następnego zdania. Jeśli
            tekst skończy się w trakcie Wyzwania, uczniowie bez przerwy piszą dalej
            w następnym. Na drodze polskiej teksty Wyzwania są po polsku - każdy
            poziom ma własną, polską pulę. Własny tekst wybierasz jako „Własny
            plik” (ostatni poziom na liście użytych klawiszy).
          </p>
          <p className="m-0">
            <strong>Uczniowie z niepełnosprawnością wzroku</strong> piszą {W} z{" "}
            <strong>czytaniem na głos</strong> programu (<Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>) - tak samo jak przy ćwiczeniu, bez osobnego pola do
            zaznaczenia. Czas, w którym osoba czeka na głos, zegar wyzwania odejmuje
            automatycznie; osobie, która widzi tekst, a mimo to włącza czytanie na
            głos, odejmuje się ten sam czas. W ten sposób czas czytania na głos jest
            już wyrównany; o innych formach dostosowania wymagań decydują
            nauczyciele według zasad swojej szkoły.
          </p>
          <p className="m-0">
            <strong>Wyniki</strong> są w rozwiniętym panelu pod „Poprzednie {WM}” -
            otwiera go przycisk {W} na początku wiersza: dla każdej osoby miejsce,{" "}
            <strong>wynik wyzwania</strong>, czy było czytanie na głos, tempo,
            dokładność i niepewne klawisze. Jak powstaje wynik wyzwania, opisuje
            punkt 8a. Gdy {W} skończy się dla <strong>całej klasy</strong>,
            przychodzi do tego <strong>zbiorczy e-mail</strong> z tymi samymi
            wartościami. Dopiero wtedy - e-mail w czasie, gdy ktoś jeszcze pisze,
            byłby niepełny, a drugiego „tym razem naprawdę wszyscy” nikt nie chce.
          </p>
          <p className="m-0">
            Osoba może wybrać <strong>Tym razem nie piszę</strong>. Ćwiczy wtedy
            normalnie dalej, a w podsumowaniu figuruje jako{" "}
            <strong>bez udziału</strong>. Każda osoba widzi później swoje {WM} w
            części <strong>„Moje postępy”</strong> - te same wartości, które widzą
            nauczyciele.
          </p>
        </Section>

        <Section title="9 · Samodzielność i sprawdzenie AI (tylko dla nauczycieli)">
          <p className="m-0">
            Kolumna <strong>„Samodzielność”</strong> pokazuje wskaźnik od{" "}
            <strong>1 do 10</strong>. Rośnie przy oznakach tekstu, który nie został
            napisany samodzielnie: <em>wklejanie</em>, częsta zmiana okna lub
            fokusu, nieprawdopodobnie wysokie tempo albo bezbłędna dokładność bez
            przebiegu nauki. Tę wartość widzą <strong>tylko nauczyciele</strong>,
            nie uczniowie. To zachęta, żeby spokojnie się przyjrzeć - nigdy ocena
            osoby.
          </p>
        </Section>

        <Section title="10 · Dostępność">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Kontrast i wielkość pisma:</strong> w pasku u góry (jasny,
              ciemny, mocny kontrast); <Kbd>Alt</Kbd> + <Kbd>+</Kbd> /{" "}
              <Kbd>-</Kbd> powiększa lub zmniejsza pole pisania.
            </li>
            <li>
              <strong>Czytanie na głos</strong> (własny głos programu) przez{" "}
              <Kbd>Alt</Kbd> + <Kbd>V</Kbd> - dla uczniów bez skonfigurowanego
              czytnika ekranu (przy NVDA, JAWS lub VoiceOver lepiej je wyłączyć).
              Można wybrać, czy czytane są <em>klawisze, słowa czy zdania</em>,
              tempo i <strong>głos</strong>. Przy języku polskim program
              automatycznie szuka polskiego głosu; jeśli go brak, pojawia się
              instrukcja instalacji. <strong>Czas czytania jest odliczany od
              tempa</strong> - osoby uczące się brajla, które potrzebują czytania na
              głos, nie tracą więc nic w liczbie uderzeń i w statystykach.
            </li>
            <BrailleTabellenPunkte weg="pl" />
            <li>
              <strong>Podpowiedź palca:</strong> dwukrotne krótkie naciśnięcie
              klawisza <Kbd>Shift</Kbd> odczytuje odpowiedni palec.
            </li>
            <li>
              <strong>Prowadzenie fokusu:</strong> każdy przycisk ma określony cel -
              po jego naciśnięciu wiadomo, gdzie stoi kursor. Dla uczniów pracujących
              z monitorem brajlowskim to różnica między dalszą pracą a szukaniem.
              Trzy zasady, które widać w czasie zajęć: <Kbd>Esc</Kbd> zamyka każde
              okno i prowadzi <strong>zawsze do pola pisania</strong>; zmiana widoku
              (statystyki, biblioteka, logowanie) trafia na{" "}
              <strong>nagłówek nowego widoku</strong> i go odczytuje; i{" "}
              <strong>nic nie znika automatycznie</strong> - nawet świętowanie
              odblokowania czeka, aż osoba naciśnie przycisk Dalej.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>E</Kbd> przechodzi do pola pisania,{" "}
              <Kbd>Alt</Kbd> + <Kbd>H</Kbd> otwiera pomoc.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>U</Kbd> przechodzi do ćwiczeń, <Kbd>Alt</Kbd> +{" "}
              <Kbd>S</Kbd> do części <strong>„Moje klasy”</strong> (przy ćwiczeniu:
              do własnych statystyk); <Kbd>Alt</Kbd> + <Kbd>Z</Kbd> odczytuje, który
              wiersz jest teraz.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>D</Kbd> podaje czas ćwiczeń - na monitorze
              brajlowskim i (przy czytaniu na głos) jako komunikat.
            </li>
            <li>
              <Kbd>Alt</Kbd> + <Kbd>T</Kbd> otwiera lub zamyka{" "}
              <strong>listę skrótów klawiaturowych</strong>.
            </li>
          </ul>
        </Section>

        <Section title="11 · Usuwanie">
          <p className="m-0">
            Pojedyncze osoby albo całą klasę można usunąć na stałe (razem z kontem,
            postępami i wynikami). Tego nie da się cofnąć - przedtem program pyta o
            potwierdzenie.
          </p>
        </Section>

        <Section title="12 · Do pobrania: podręcznik i plakat (PDF)">
          <p className="m-0">
            Wszystko z tej pomocy, i dużo więcej, jest w{" "}
            <strong>podręczniku dla nauczycieli</strong> („Tastenflow - podręcznik
            dla nauczycieli”): droga nauki ze wszystkimi etapami, klawiatury, panel
            klasy, {W} krok po kroku, wynik i wartości do oceny.
          </p>
          <HandbuchLaden />
          <p className="m-0">
            Na ścianę w klasie lub w pokoju nauczycielskim jest też{" "}
            <strong>plakat Tastenflow</strong> w formacie A3, z kodem QR do
            tastenflow.org. W przeciwieństwie do
            podręcznika jest dostępny dla wszystkich, także bez logowania.
          </p>
          <PlakatLaden />
          <p className="m-0 text-sm text-ink-muted">
            Oba pliki są też w części „Moje klasy”, w „Do pobrania”.
          </p>
        </Section>
      </div>
    </div>
  );
}
