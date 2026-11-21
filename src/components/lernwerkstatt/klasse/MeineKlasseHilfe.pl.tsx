/**
 * ★★★ O-PL (02.10.2026): DIE HILFE ZU „MEINE KLASSEN" AUF POLNISCH.
 * ===========================================================================
 * Massgeblich ist die deutsche Fassung (`MeineKlasseHilfe.tsx`): dieselben
 * Abschnitte, dieselben Tatsachen; der Aufbau folgt `MeineKlasseHilfe.it.tsx`.
 * Sichtbar nur mit `spracheGewaehlt === "pl"`; jedes Programm ohne
 * Sprach-Anbieter zeigt weiter die deutsche Fassung.
 *
 * Anrede (Glossar `recherche-polnisch-2026-10-02/GLOSSAR-pl.md`, Regel 1 und 2):
 * Schritte in der ty-Befehlsform („Wybierz", „Wpisz"), Beschreibungen
 * unpersönlich („tworzy się", „widać"), nie die Höflichkeitsform der 3. Person; was die
 * Lehrkraft der Klasse sagt, in der wy-Form. Keine Vergangenheit der 2. Person,
 * keine Adjektive über eine Person. Knopfnamen ohne Anführung mit „przycisk"
 * davor, Bereichsnamen in „…” (Regel 8). Tastenwege, nie Maus-Wörter.
 * Die Startpunkte werden - wie in der italienischen Fassung - über ihre
 * Tasten beschrieben, nicht über ihre Namen (die stehen in `letters.ts`).
 */
import { Modal } from "@/components/Modal";
import { RundgangMeineKlassenKnopf } from "@/components/typing/Rundgang";
import {
  DreiWerteHilfe,
  LeistungsstufeHilfe,
  SpaltenHilfe,
} from "@/components/typing/TastenflowZahlenHilfe";
import { EINSTIEGSFENSTER_MIN } from "@/lib/typing/schreibprobe";
import { mehrzahl } from "@/lib/bedienSprache";

/**
 * ★ O-PL (02.10.2026): „Wyzwanie" (Glossar §2.3), gross wie ein Name. Steht
 * hier, solange `schreibprobe.ts` noch keinen polnischen Zwilling trägt.
 */
const W = "Wyzwanie";
const W_MEHRZAHL = "Wyzwania";
const W_MEHRZAHL_GEN = "Wyzwań";

function Abschnitt({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <section className="space-y-1.5">
      <h3 className="m-0 text-base font-semibold text-ink">{titel}</h3>
      <div className="space-y-1.5 text-sm leading-relaxed text-ink">{children}</div>
    </section>
  );
}

function Taste({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-hairline bg-surface-sunken px-1.5 py-0.5 text-sm text-ink">
      {children}
    </kbd>
  );
}

export function MeineKlasseHilfePolnisch({
  onClose,
  programmName,
}: {
  onClose: () => void;
  /** Das offene Programm - davon hängt ab, welche Abschnitte dastehen. */
  programmName?: string;
}) {
  const tastenflow = programmName === "Tastenflow";
  // Akkusativ („mają 10 minut"): die Einzahl heisst „minutę".
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "pl", {
    one: (z) => `${z} minutę`,
    few: (z) => `${z} minuty`,
    many: (z) => `${z} minut`,
    other: (z) => `${z} minuty`,
  });
  return (
    <Modal title="Pomoc: Moje klasy" onClose={onClose} size="lg">
      <div className="space-y-5">
        <RundgangMeineKlassenKnopf onStart={onClose} programmName={programmName} />
        <p className="m-0 text-sm leading-relaxed text-ink">
          Tutaj odbywa się praca z klasą. Klasy i konta tworzy się{" "}
          <strong>jeden raz</strong> - obowiązują w każdym programie, z tym samym
          kodem klasy i tym samym hasłem.
          {tastenflow && (
            <>
              {" "}
              Nauczyciele po otwarciu programu Tastenflow zawsze trafiają tutaj. Do
              własnych ćwiczeń prowadzi przycisk Poćwicz (<Taste>Alt</Taste> +{" "}
              <Taste>U</Taste>).
            </>
          )}
        </p>

        <Abschnitt titel="Jak zbudowana jest strona">
          <p className="m-0">
            <strong>W nagłówku klasy</strong> jest jej nazwa - przy kilku klasach
            na liście wyboru „Klasa”, na której zmienia się klasę -, liczba
            uczniów i kod klasy. Po prawej stronie tego wiersza, przed „Do
            pobrania”, jest przełącznik{" "}
            <strong>„Postępy | Uczniowie i dostęp”</strong> - w tym samym miejscu
            na obu ekranach, do których prowadzi.
          </p>
          <p className="m-0">
            W części <strong>„Uczniowie i dostęp”</strong> tworzy się nową klasę,
            dodaje i przenosi uczniów, widać hasła i dane logowania, kod klasy i
            programy, które ma klasa. Wiele osób naraz dodaje się tam w części
            „Uczniowie” przyciskiem <strong>Importuj uczniów z pliku Excel</strong>:
            najpierw przycisk Pobierz szablon (Excel), potem jeden wiersz na osobę
            z imieniem, hasłem i - dla programu Tastenflow - punktem startowym.
            Puste hasło program tworzy sam; podgląd pokazuje, co zostanie
            przejęte, a potem wszystkie zaimportowane osoby są pod przyciskiem
            Drukuj dane logowania. Przyciskiem{" "}
            <strong>Pobierz listę klasy</strong> obok można w każdej chwili pobrać
            plik Word z imieniem, hasłem i kodem klasy WSZYSTKICH uczniów tej
            klasy - do wydrukowania.
            {!tastenflow && (
              <>
                {" "}
                Wiadomość do wszystkich uczniów pisze się tam przyciskiem
                Wiadomość do klasy.
              </>
            )}
          </p>
          <p className="m-0">
            W części <strong>„Postępy”</strong> - tu trafia się po otwarciu
            strony - są programy tej klasy, „Do pobrania”, a pod nimi statystyki
            klasy: na jakim etapie jest każda osoba.
            {tastenflow && (
              <>
                {" "}
                Na samej górze jest wiersz przycisków: <strong>{W}</strong>,{" "}
                <strong>Własne ćwiczenie</strong>,{" "}
                <strong>Cel tygodniowy</strong>,{" "}
                <strong>Ustawienia klasy</strong> i{" "}
                <strong>Wstrzymaj na godzinę</strong>. Każdy przycisk otwiera pod
                spodem własną część - zawsze tylko jedną naraz, a{" "}
                <Taste>Esc</Taste> ją zamyka. Przycisk {W} otwiera formularz z
                polami „Używane klawisze” i „Min” oraz przyciskiem Zacznij teraz,
                a także wcześniejsze {W_MEHRZAHL}; przycisk
                Własne ćwiczenie ustala tekst dla całej klasy (przesłany plik,
                tekst z „Moje teksty” albo szablon z kursu - uczniowie dostają
                wtedy okno tylko z przyciskiem Dalej); przycisk Cel tygodniowy
                ustawia minuty na tydzień; przycisk Wstrzymaj na godzinę ustawia
                60 minut, w których klasa dalej ćwiczy, ale nic nie liczy się do
                celu tygodniowego. Pod spodem jest „Przegląd klasy” (miesiąc lub
                rok szkolny, z paskiem wyniku i wykresem liniowym); po prawej
                stronie jego nagłówka jest przycisk Wiadomość do klasy - jedna
                wiadomość do wszystkich uczniów, każda osoba dostaje ją we
                własnej rozmowie.
              </>
            )}
          </p>
          {tastenflow && (
            <p className="m-0">
              Przycisk <strong>Ustawienia klasy</strong> w tym wierszu otwiera:
              klasę, do której chodzą uczniowie (na tej podstawie program dobiera
              rodzaje tekstów i z każdym rokiem szkolnym liczy dalej; „Osoby
              dorosłe” się nie zmieniają), język razem z blokadą, punkt startowy
              klasy (obowiązuje także osoby, które dołączą później) i Wyścig
              klasowy. Te cztery ustawienia dotyczą całej klasy i program pyta o
              nie już przy tworzeniu klasy; dla każdej osoby w jej rozwiniętym
              wierszu zostają „Od czego zacząć?”, „Pisanie jedną ręką” i „Bez
              pośpiechu”.
            </p>
          )}
          {tastenflow && (
            <p className="m-0">
              Stopnie w <strong>„Od czego zacząć?”</strong> idą według klawiszy:
              pierwszy to tylko F i J, drugi - cały rząd podstawowy. Trzeci dodaje
              kolejne najczęstsze litery i klawisz Shift. Następne - wszystkie
              litery, znaki interpunkcyjne, cyfry i wszystkie klawisze -
              odblokowują po kolei resztę.
            </p>
          )}
          <p className="m-0">
            Każdy przycisk sam się objaśnia: podpowiedź pojawia się, gdy fokus
            dojdzie do niego klawiszem Tab. <Taste>Esc</Taste> ją zamyka.
          </p>
        </Abschnitt>

        {tastenflow && (
          <Abschnitt titel={`${W} krok po kroku`}>
            <ol className="m-0 list-decimal space-y-1 pl-5">
              <li>
                Na samej górze statystyk klasy, w wierszu zadań, przycisk {W}{" "}
                otwiera formularz.
              </li>
              <li>
                Wybierz <strong>używane klawisze</strong> - wszyscy uczniowie
                dostają ten sam tekst na tym poziomie.
              </li>
              <li>
                Wpisz <strong>czas wyzwania</strong> w minutach - pole jest tuż
                obok poziomu.
              </li>
              <li>
                Powiedz klasie: <em>Czas zaczyna się liczyć, gdy naciśniecie
                pierwszy klawisz.</em> Od startu uczniowie mają {einstiegsMinuten},
                żeby zacząć; czas wyzwania biegnie dla każdej osoby osobno.
              </li>
              <li>
                Naciśnij przycisk <strong>Zacznij teraz</strong> - {W} zaczyna się
                od razu dla całej klasy.
              </li>
              <li>
                Zaraz potem widać tam na przykład{" "}
                <strong>„Gotowość: 12 z 14 - jeszcze nie: Said, Jano”</strong>: na
                12 urządzeniach {W} już jest. Pojawia się tam po około sekundzie.
                Jeśli przy kimś długo widać „jeszcze nie”, zwykle wystarczy raz
                odświeżyć stronę.
              </li>
              <li>Dopóki trwa, widać „Oddane: 3 z 18” z imionami.</li>
              <li>
                Potem wyniki pojawiają się pod formularzem: dla każdej osoby
                miejsce, <strong>wynik wyzwania</strong>, czy było czytanie na
                głos, uderzenia na minutę, dokładność, znaki, błędy i niepewne
                klawisze. Do tego przychodzi zbiorczy e-mail.
              </li>
            </ol>
          </Abschnitt>
        )}

        {tastenflow && (
          <>
            <Abschnitt titel="Co znaczą kolumny tabeli">
              <SpaltenHilfe />
            </Abschnitt>

            <Abschnitt titel="Co znaczy poziom trudności">
              <LeistungsstufeHilfe />
            </Abschnitt>

            <Abschnitt titel="Wartości, na podstawie których można wystawić ocenę">
              <DreiWerteHilfe />
            </Abschnitt>
          </>
        )}

        <Abschnitt titel="Kod klasy">
          <p className="m-0">
            Widać go na górze obok nazwy klasy i obowiązuje we wszystkich
            programach. Przy logowaniu wpisuje się kod klasy, imię i hasło;
            urządzenie zapamiętuje kod, potem wystarczą imię i hasło.
          </p>
          <p className="m-0">
            Przy tworzeniu klasy jest <strong>obowiązkowy</strong>. Podczas
            wpisywania nazwy program proponuje pasujący kod - z „4B Nowak” robi
            się „4BNOWAK”. Można go zmienić, ale nie można zostawić go pustego.
            Później zmienia się go w części „Uczniowie i dostęp” przyciskiem
            Edytuj.
          </p>
          <p className="m-0">
            ⚠️ Po zmianie kodu wszyscy uczniowie tej klasy logują się od tej
            chwili nowym kodem.
          </p>
        </Abschnitt>

        <Abschnitt titel="Przenoszenie osoby do innej klasy">
          <p className="m-0">
            W części „Uczniowie i dostęp” przy każdej osobie jest przycisk{" "}
            <strong>Przenieś do innej klasy</strong>. Otwiera pole „Kod nowej
            klasy”. Działa to z każdą klasą, której kod jest znany - także z
            klasą prowadzoną przez inną osobę. Przed przeniesieniem program
            jeszcze raz pyta o potwierdzenie.
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>Potem ta osoba loguje się nowym kodem klasy.</li>
            <li>Nauczyciele nowej klasy widzą tę osobę i jej postępy.</li>
            <li>
              {tastenflow
                ? `Wyniki ${W_MEHRZAHL_GEN} i wiadomości zostają w dotychczasowej klasie.`
                : "Wiadomości zostają w dotychczasowej klasie."}
            </li>
          </ul>
        </Abschnitt>

        <Abschnitt titel="Skróty klawiaturowe w tej części">
          <p className="m-0">
            <Taste>Alt</Taste> + <Taste>H</Taste> otwiera i zamyka tę pomoc.{" "}
            <Taste>Alt</Taste> + <Taste>T</Taste> pokazuje listę wszystkich
            skrótów klawiaturowych. <Taste>Alt</Taste> + <Taste>U</Taste>{" "}
            prowadzi do własnych ćwiczeń. <Taste>Alt</Taste> + <Taste>N</Taste>{" "}
            otwiera wiadomości, <Taste>Alt</Taste> + <Taste>K</Taste> wybór
            kolorów i kontrastu, a <Taste>Alt</Taste> + <Taste>J</Taste> menu
            konta.
          </p>
          <p className="m-0">
            Klawiszem Tab przechodzi się między kartami; Enter przełącza kartę. Po
            zmianie fokus jest w nowej części - czytnik ekranu czyta dalej od tego
            miejsca.
          </p>
        </Abschnitt>

        <Abschnitt titel="Więcej szczegółów">
          <p className="m-0">
            Podręcznik dla nauczycieli otwiera się na górze przez „Do pobrania” -
            tam jest też plakat Tastenflow do wydrukowania i powieszenia (A3),
            dostępny dla wszystkich, także bez logowania.
            {tastenflow && (
              <>
                {" "}
                Pomoc w samym programie otwiera się tam skrótem{" "}
                <Taste>Alt</Taste> + <Taste>H</Taste>.
              </>
            )}
          </p>
        </Abschnitt>
      </div>
    </Modal>
  );
}
