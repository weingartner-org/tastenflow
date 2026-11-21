/**
 * ★★★ O-PL (02.10.2026): DAS HILFE-FENSTER FÜR DIE LERNENDEN, POLNISCH.
 * ===========================================================================
 * Aus der Funktion geschrieben, nach dem Aufbau von `TippenHilfe.it.tsx`
 * (dieselben Abschnitte, `detail`-Stufen, `isAdult`/`jugend`-Fälle), den
 * Inhalt nach der deutschen `TippenHilfeDeutsch` - nicht Satz für Satz
 * übertragen. Wie Englisch, Französisch, Spanisch und Italienisch ohne den
 * Einführungs-Podcast (die polnische Bedienung hat keinen).
 *
 * ── ANREDE UND GESCHLECHT (Glossar `recherche-polnisch-2026-10-02/GLOSSAR-pl.md`) ──
 * Immer **ty** - Kinder, Jugendliche UND Selbstlernende (Regel 1). Nie das
 * Geschlecht raten (Regel 2): keine Vergangenheit 2. Person, kein Konditional,
 * kein Adjektiv und kein Partizip über das Kind - Präsens, vollendetes Futur
 * („gdy poznasz"), -no/-to-Form, Satz über die Sache. Lehrkräfte in der
 * Mehrzahl („nauczyciele"); „nauczyciel lub nauczycielka" genau EINMAL (beim
 * Wyzwanie). Kinder höchstens ein Ausrufezeichen je Absatz.
 *
 * ── WAS POLNISCH ANDERS IST ─────────────────────────────────────────────────
 *  · Die Tastatur: „Polski (programisty)" mit US-Beschriftung (`layouts.ts`,
 *    `PL`, nur gelesen). Die neun polnischen Buchstaben kommen mit prawy Alt
 *    (AltGr) + Grundbuchstabe, ź mit prawy Alt + X; Mac: Option. Der NVDA-
 *    Hinweis zu ń (Ctrl + Alt + N startet NVDA neu) steht wie in `PL.hinweis`.
 *  · Tastennamen wie auf der Kappe (Glossar §2.9): Shift, Caps Lock, Enter,
 *    Backspace, Esc, Ctrl, prawy Alt, spacja; Mac: Option.
 *  · Die Reihenfolge des polnischen Lehrgangs ist noch nicht gebaut - der
 *    Abschnitt beschreibt sie allgemein und zeigt die Buchstaben des Weges,
 *    auf dem das Kind wirklich übt (`layoutLetterOrder`). Darum auch kein
 *    Absatz über die Lektionen (die deutsche Zählung gilt hier nicht).
 *  · Das Plakat gibt es auf Polnisch noch nicht - der Abschnitt bietet das
 *    englische an (`handbuchInSprache`, „po angielsku").
 *  · Die Zeile unter dem Übungsfeld heisst „pasek" (nicht „wiersz" - das ist
 *    die Textzeile), der Ring „kółko".
 *
 * Fliesstext mit „…” (U+201E/U+201D), Knopfnamen ohne Anführung mit
 * „przycisk" davor. Nur Bindestrich, keine Maus-Wörter.
 */
import { JawsRueckweg } from "./ScreenreaderHinweis";
import { useRef } from "react";
import { EINSTIEGSFENSTER_MIN, layoutLetterOrder, skinForStufe, unitGlyph } from "@/lib/typing";
import { mehrzahl } from "@/lib/bedienSprache";
import { useFocusTrap } from "./useFocusTrap";
import { Zeichenerklaerung } from "@/lib/arbeitsblatt/Zeichenerklaerung";
import { AltText, Kbd, Section, detailFor, type TippenHilfeProps } from "./TippenHilfeTeile";
import { AltOderWahl, WeitereTasten } from "./TippenHilfeTasten";
import { RundgangNochmalKnopf } from "./Rundgang";
import { hoehleHatWesen } from "@/lib/typing/expedition/texts";
import { downloadAdresse, groesse, handbuchInSprache, tastenflowPlakat } from "@/lib/lernwerkstatt/handbuecher";

// ★ O-PL (02.10.2026): das Wort der Tippchallenge (Glossar §2.3) - wie
// `PRUEFUNG_WORT_IT`. `schreibprobe.ts` führt es seit O-PL ebenso (`PRUEFUNG_WORT_PL`);
// hier bleibt die eigene Konstante mit Mehrzahl.
const WYZWANIE = "Wyzwanie";
const WYZWANIA = "Wyzwania";

export function TippenHilfePolnisch({ open, onClose, stufe, lernweg = "en" }: TippenHilfeProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, cardRef, { initialFocus: closeRef });
  if (!open) return null;

  const skin = skinForStufe(stufe);
  const isAdult = skin === "erwachsen";
  const kind = skin === "kind";
  const detail = detailFor(stufe);
  const letters = layoutLetterOrder(lernweg);
  // Das Höhlenwesen (deutsche Aufnahmen) gibt es nur auf Weg „de".
  const hoehleMitWesen = hoehleHatWesen(lernweg);
  // Dasselbe Wort wie der Ring (Glossar §2.2: „poziom gry" / „poziom"),
  // dazu der Lokativ für „na którym … jesteś".
  const ringWort = kind ? "poziom gry" : "poziom";
  const ringWortMiejscownik = kind ? "poziomie gry" : "poziomie";
  // Akkusativ („masz 10 minut"), alle vier Formen (Glossar §2.10a).
  const einstiegsMinuten = mehrzahl(EINSTIEGSFENSTER_MIN, "pl", {
    one: (z) => `${z} minutę`,
    few: (z) => `${z} minuty`,
    many: (z) => `${z} minut`,
    other: (z) => `${z} minuty`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Pomoc do programu Tastenflow"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        className="card my-8 w-full max-w-2xl space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="m-0 text-xl font-semibold text-ink">Pomoc - jak działa program Tastenflow</h2>
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

        <RundgangNochmalKnopf onStart={onClose} />

        <Section title="Po prostu zacznij pisać">
          <p className="m-0">
            Nie musisz najpierw wybierać pola. Po prostu zacznij pisać - pierwsza
            litera od razu trafia do pola. Jeśli kursor jest gdzie indziej,{" "}
            <Kbd>Alt</Kbd> + <Kbd>E</Kbd> od razu przenosi cię z powrotem do pola
            pisania.
          </p>
          <JawsRueckweg weg="pl" />
          {detail === 1 && (
            <p className="m-0">
              Pisz zawsze odpowiednim palcem - klawiatura na dole pokazuje ci, który
              klawisz jest teraz. Naciśnij dwa razy szybko klawisz <Kbd>Shift</Kbd>,
              a usłyszysz, którym palcem pisać.
            </p>
          )}
        </Section>

        <Section title="Te znaki są w tekście">
          <Zeichenerklaerung
            titel={null}
            zeichen={[
              { zeichen: "·", bedeutung: "oddziela dwie informacje, które do siebie należą - jak przecinek." },
              { zeichen: "→", bedeutung: "potem, albo: z tego powstaje to." },
              { zeichen: "⏱", bedeutung: "twój czas ćwiczeń." },
              {
                zeichen: "↵",
                bedeutung:
                  "stoi na końcu wiersza, jeśli twoja klasa ma to ustawione - wtedy kończysz wiersz klawiszem Enter.",
              },
            ]}
          />
        </Section>

        <Section title="Zbieraj gwiazdki 🌟">
          <p className="m-0">
            Po każdej rundzie dostajesz <strong>od 1 do 3 gwiazdek</strong> - a do
            tego osobny dźwięk.{" "}
            <strong>Mało błędów liczy się dużo bardziej niż tempo:</strong> spokojne
            i dokładne pisanie daje pewne gwiazdki - pośpiech i częste pomyłki nie.
            {kind ? " Gwiazdki może zdobyć każde dziecko!" : ""}
          </p>
          {detail >= 2 && (
            <p className="m-0">
              3 gwiazdki są za naprawdę dobrą rundę - dokładnie napisaną i w
              porządnym tempie, a <strong>dokładnie</strong> liczy się zawsze bardziej
              niż <strong>szybko</strong>. Jeśli przez jakiś czas idą ci dobre rundy,
              wchodzisz na wyższy <strong>poziom trudności</strong> - wtedy nagroda
              brzmi trochę inaczej.
            </p>
          )}
        </Section>

        <Section title="Zbieraj odznaki 🏅">
          <p className="m-0">
            Za szczególne sukcesy zdobywasz <strong>odznaki</strong> - na przykład
            za rundę zupełnie bez błędów albo za trzy czyste rundy pod rząd. Przy
            nowej odznace słychać osobne <strong>„ta-da”</strong>, a jej nazwa jest
            odczytywana.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Wszystkie odznaki są w części <strong>„Moje postępy”</strong>, zaraz po
              celach tygodniowych i twoich wynikach - tam zawsze widać też{" "}
              <strong>następny krok</strong> (na przykład: jeszcze 2 rundy bez
              błędów do kolejnej odznaki). Najwięcej odznak jest za{" "}
              <strong>dokładne pisanie</strong> i za <strong>wytrwałość</strong> -
              nie za pośpiech. A kilka jest <strong>tajnych</strong>: ich warunek nie
              jest nigdzie napisany, po prostu się pojawiają!
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Tam jest też twój <strong>wynik</strong>: łączy dokładność i tempo w
              jednej liczbie od 0 do 100. Jedna pomyłka liczy się jak 5 znaków, a
              dwa razy szybsze tempo tylko 1,4 raza - dokładność wygrywa z tempem.
            </p>
          )}
          {detail >= 2 && (
            <p className="m-0">
              Niżej „Postępy w czasie” (pozycja do rozwinięcia) pokazują małą
              krzywą. To normalne, że krzywa nie idzie tylko w górę. Gdy dochodzą
              nowe klawisze, zwykle najpierw spada - szczególnie przy klawiszu Shift
              i przy cyfrach.
            </p>
          )}
          <p className="m-0">
            Wskazówka: wybierz odznakę w statystykach i naciśnij Enter - pojawi się{" "}
            <strong>w dużym rozmiarze</strong>, z blaskiem i konfetti.
          </p>
        </Section>

        {skin === "jugend" && (
          <Section title="Po nowym klawiszu">
            <p className="m-0">
              <strong>Nowy klawisz</strong> jest twój, gdy tylko poprzednie są
              pewne - nie musisz niczego wygrywać. Jest krótkie świętowanie, a potem
              ćwiczysz dalej. Nic więcej się nie dzieje.
            </p>
            <p className="m-0">
              Jeśli chcesz, potem może przyjść krótka gra:{" "}
              <strong>Skoki po krach</strong>. Decydujesz o tym ty - w{" "}
              <strong>Ustawieniach</strong> (<AltText>Alt + O</AltText>), w części{" "}
              <strong>Gra w nagrodę</strong>. Na początku ustawione jest{" "}
              <strong>Bez gry</strong>. To ustawienie obowiązuje na tym urządzeniu.
            </p>
          </Section>
        )}

        {!isAdult && (
          <Section title="Skoki po krach 🐧">
            {skin === "jugend" ? (
              <>
                <p className="m-0">
                  Grę możesz <strong>uruchomić, kiedy chcesz</strong> - przyciskiem{" "}
                  <strong>🐧 Graj</strong> na pasku pod polem pisania. Pingwin
                  skacze po krach, wspina się na górę liter i zjeżdża na brzuchu -
                  zawsze z klawiszami, które teraz idą ci najtrudniej. Po drodze
                  wyskakują <strong>dodatkowe rybki</strong> (klawisz naciśnięty na
                  czas = rybka złapana, a nigdy błąd), a w{" "}
                  <strong>Jaskini echa</strong> każdy klawisz jest tylko
                  zapowiadany. Gra <strong>nie</strong> liczy się do czasu ćwiczeń i
                  nie jest warunkiem nowych znaków - ale ma własne odznaki.
                </p>
                <p className="m-0">
                  Po nowym klawiszu włącza się <strong>tylko wtedy</strong>, gdy w
                  Ustawieniach jest wybrana jako <strong>Gra w nagrodę</strong>. W
                  przeciwnym razie nic ci nie przerywa - to ty decydujesz, kiedy
                  grasz.
                </p>
              </>
            ) : (
              <>
                <p className="m-0">
                  Gdy opanujesz <strong>nowy klawisz</strong>, na świętowanie czeka
                  gra Skoki po krach: pomóż pingwinowi przejść przez wodę - naciskaj
                  zawsze klawisz, który jest na następnej krze! Czasem droga prowadzi
                  potem nawet na <strong>górę liter</strong> i na brzuchu z powrotem
                  w dół. Nowy klawisz jest twój już wcześniej - gra to nagroda, a nie
                  obowiązek.
                </p>
                <p className="m-0">
                  Grę możesz też <strong>uruchomić, kiedy chcesz</strong> -
                  przyciskiem <strong>🐧 Graj</strong> u góry twojej karty ćwiczeń,
                  tuż obok kółka. To wielka <strong>przygoda</strong>: każdego dnia
                  wygląda trochę inaczej, po drodze wyskakują{" "}
                  <strong>dodatkowe rybki</strong> (szybko naciśnij ich klawisz, a
                  są twoje), a w <strong>Jaskini echa</strong> nie widzisz liter -{" "}
                  {hoehleMitWesen ? (
                    <>
                      jaskinia <strong>mówi</strong> ci każdy klawisz.
                    </>
                  ) : (
                    <>
                      każdy klawisz brzmi jak dźwięk, a czytnik ekranu albo monitor
                      brajlowski <strong>mówi</strong> ci, który to.
                    </>
                  )}{" "}
                  Gra jest tylko dla zabawy i <strong>nie</strong> liczy się do
                  czasu ćwiczeń - ale daje własne odznaki!
                </p>
                {detail >= 2 && (
                  <p className="m-0">
                    Spokojnie: jeśli kra zatonie albo pośliźniesz się na górze,
                    pingwin po prostu wraca wpław - możesz od razu spróbować jeszcze
                    raz, ile razy chcesz. A kto przejdzie całą przygodę bez ani
                    jednego plusku, zobaczy nad igloo tańczącą{" "}
                    <strong>zorzę polarną</strong>!
                  </p>
                )}
              </>
            )}
          </Section>
        )}

        <Section title="Co oznacza kółko z liczbą?">
          <p className="m-0">
            Liczba w kółku to twój <strong>{ringWort}</strong>.{" "}
            <strong>{kind ? "XP to punkty za ćwiczenie:" : "Punkty są za ćwiczenie:"}</strong>{" "}
            za każdą rundę dostajesz kilka, a kółko się zapełnia. Gdy jest pełne
            (100 punktów), wchodzisz na następny {ringWort}. To tylko do zbierania i{" "}
            <strong>nie</strong> utrudnia ćwiczeń - jak punkty w grze.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              Nie myl tego z <strong>poziomem trudności (1-50)</strong>: on mówi, jak
              szybko masz pisać, i dopasowuje się do ciebie{" "}
              <strong>automatycznie</strong> - rośnie, gdy idzie dobrze, i spada, gdy
              jest za trudno.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              A ustawienie <strong>„Teksty dla:”</strong> decyduje tylko o tym, jak
              trudne są słowa i zdania - tak, żeby pasowały do wieku. W klasie
              ustawiają je nauczyciele dla wszystkich; bez klasy znajdziesz je u
              góry w Ustawieniach ⚙. Czyli trzy różne rzeczy: <em>{ringWort}</em> =
              punkty, <em>poziom trudności</em> = oczekiwane tempo,{" "}
              <em>Teksty dla</em> = wiek.
            </p>
          )}
        </Section>

        <Section title={detail === 1 ? "Jak często ćwiczyć?" : "Czas ćwiczeń i cel tygodniowy"}>
          {detail === 1 ? (
            <p className="m-0">
              Lepiej ćwiczyć <strong>często i krótko</strong> niż raz bardzo długo -
              na przykład kilka minut przez kilka dni. Na pasku pod polem pisania
              zegar liczy, jak długo już dziś ćwiczysz; ten sam czas zapełnia tam
              też <strong>kółko</strong> - twój cel tygodniowy.
            </p>
          ) : (
            <p className="m-0">
              Z kontem możesz mieć <strong>cel tygodniowy</strong>: określoną liczbę{" "}
              <strong>minut na tydzień</strong>. W klasie ustalają go nauczyciele;
              bez klasy ustawiasz go w Ustawieniach ⚙, w części „Mój cel
              tygodniowy” - nowy cel obowiązuje od następnego poniedziałku. Tydzień
              zaczyna się <strong>w poniedziałek o 8:00</strong> i kończy w następny
              poniedziałek o 8:00. Na pasku pod polem pisania twój stan widać jako{" "}
              <strong>kółko</strong>, na przykład „25 z 60 min” - gdy cel jest
              osiągnięty, kółko jest pełne i ma ptaszek. Czasem są też minuty z
              wcześniejszego tygodnia do <strong>nadrobienia</strong>; wtedy obok
              widać, ile. Gdy cel tygodniowy jest osiągnięty, pojawia się krótkie
              okno z gratulacjami - potem możesz ćwiczyć dalej, kiedy chcesz.
            </p>
          )}
        </Section>

        <Section title="Ustawienia: koło zębate ⚙ na górze">
          <p className="m-0">
            Wszystkie ustawienia są za przyciskiem <strong>⚙ Ustawienia</strong> na
            samej górze, tuż na lewo od okrągłego znaku z pierwszą literą twojego
            imienia: <strong>Co ćwiczysz?</strong>, <strong>Teksty</strong> (wiek i
            język), <strong>Klawiatura</strong>, <strong>Dźwięk</strong> i{" "}
            <strong>Czytanie na głos</strong>. Jedno naciśnięcie je otwiera, drugie
            zamyka - albo <Kbd>Alt</Kbd> + <Kbd>O</Kbd>, to działa też w trakcie
            pisania. Przy otwieraniu kursor od razu przeskakuje do ustawień, przy
            zamykaniu wraca do pola pisania.
          </p>
          <p className="m-0">
            Na samej górze w Ustawieniach jest <strong>„Co ćwiczysz?”</strong>: trzy
            drogi, <strong>Mój trening</strong>, <strong>Opowiadania</strong> i{" "}
            <strong>Gry słowne</strong>. <Kbd>Alt</Kbd> + <Kbd>B</Kbd> przechodzi po
            kolei do następnej, a nowa droga jest odczytywana.
          </p>
          <p className="m-0">
            Okrągły przycisk z globusem na górze zmienia język programu Tastenflow -
            przyciski, menu, a od razu też teksty ćwiczeń; potem język samych
            tekstów możesz zmienić osobno w części <strong>Teksty</strong>, chyba że
            ustalili go nauczyciele.
          </p>
          <p className="m-0">
            W części <strong>Klawiatura</strong> wybierasz klawiaturę, która naprawdę
            leży przed tobą. W Polsce to zwykle <strong>klawiatura polska
            (programisty)</strong> - w Windows „Polski (programisty)”, na Macu
            „Polski Pro”. Wtedy klawiatura ekranowa i podpowiedzi dla palców się
            zgadzają - i przychodzą tylko znaki, które są na tej klawiaturze.
            Najważniejsze rzeczy o polskiej klawiaturze:
          </p>
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>
              <strong>Polskie litery</strong> piszesz prawym Altem i literą:{" "}
              <Kbd>prawy Alt (AltGr)</Kbd> + <Kbd>A</Kbd> daje <strong>ą</strong>.
              Tak samo ć = C, ę = E, ł = L, ń = N, ó = O, ś = S, ż = Z - a{" "}
              <strong>ź</strong> to prawy Alt + <strong>X</strong>.
            </li>
            <li>
              Wielka polska litera: dochodzi klawisz <Kbd>Shift</Kbd> (Shift + prawy
              Alt + A = Ą). Na klawiszu jest napisana tylko zwykła litera.
            </li>
            <li>
              Na Macu zamiast prawego Alta naciskasz klawisz <Kbd>Option</Kbd>.
            </li>
            <li>
              <strong>ą</strong> i <strong>a</strong> to dwie różne litery - dlatego
              program czeka na ą, a nie na a.
            </li>
            <li>
              Z czytnikiem ekranu NVDA w Windows prawy Alt + N (ń) uruchamia NVDA od
              nowa, bo Ctrl + Alt + N to jego skrót. Wyłącz ten skrót w NVDA albo
              naciśnij Shift + Caps Lock + prawy Alt + N.
            </li>
          </ul>
          <p className="m-0">
            Tam jest też <strong>„Pisanie jedną ręką”</strong> - dla wszystkich,
            którzy piszą jedną ręką: wtedy wielkie litery i symbole liczą się z
            każdym klawiszem Shift. W klasie ustawiają to nauczyciele.
          </p>
          <p className="m-0">
            Przy <strong>„Duże odstępy (CVI)”</strong> w czasie pisania wszystko
            poza polem, w którym teraz piszesz (wiersz ćwiczenia albo pole gry),
            jest przyciemnione; po 5 sekundach bez pisania znów robi się jasno.
            Wiersz ćwiczenia przesuwa się płynnie w twoim tempie pisania, zamiast
            skakać. Odstępy możesz w każdej chwili ustawić w Ustawieniach ⚙ - w
            klasie mogą je ustawić także nauczyciele; obowiązuje to, co wybrano
            ostatnio.
          </p>
          <p className="m-0">
            W <strong>Ćwiczeniu celowanym</strong> możesz wybrać do 8 klawiszy lub znaków, które szczególnie często pojawiają się w rundach - w ustawieniach w grupie <strong>Co ćwiczysz?</strong> albo klawiszami <Kbd>Alt</Kbd> + <Kbd>2</Kbd>. W klasie ustawia to Twój nauczyciel.
          </p>
        </Section>

        <Section title="Czytanie na głos - program czyta">
          <p className="m-0">
            Przyciskiem <strong>🗣 Czytanie na głos</strong> (albo <Kbd>Alt</Kbd> +{" "}
            <Kbd>V</Kbd>) program czyta na głos - dla wszystkich, którzy (jeszcze)
            nie używają czytnika ekranu. U góry w Ustawieniach ⚙ wybierasz, czy
            czytać <strong>klawisze</strong> (Klawisz po klawiszu),{" "}
            <strong>słowa</strong>, <strong>zdania</strong> - jedno, kilka albo
            wszystko - i jak szybko.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              W części <strong>„Głos”</strong> możesz wybrać inny głos. Gdy językiem
              jest <strong>polski</strong>, program automatycznie szuka polskiego
              głosu; jeśli żaden nie jest zainstalowany, pojawia się krótka
              instrukcja, jak go dodać.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0">
              Spokojnie o tempo: <strong>czas czytania jest odliczany</strong> -
              czekanie na komunikat nie obniża twojego tempa.
            </p>
          )}
        </Section>

        <Section title="Melodia podczas pisania 🎵">
          <p className="m-0">
            <strong>Melodia podczas pisania</strong> służy do ćwiczenia <strong>równego rytmu pisania</strong> i przede wszystkim ma być <strong>zabawą</strong>. Każdy dobry klawisz gra kolejną nutę melodii; jeśli trzymasz rytm, dołącza nawet zespół.
          </p>
          <p className="m-0">
            Kto pisze równo, staje się płynniejszy także na słabszych klawiszach: rytm pomaga przejść przez miejsca, w których zwykle pojawia się wahanie.
          </p>
          <p className="m-0">
            Włączysz ją klawiszami <Kbd>Alt</Kbd> + <Kbd>6</Kbd>, w ustawieniach ⚙ albo w menu pod okrągłym przyciskiem głośnika u góry - tam suwakami ustawisz też głośność każdego dźwięku. Brzmienie zmienisz klawiszami <Kbd>Alt</Kbd> + <Kbd>7</Kbd> i <Kbd>Alt</Kbd> + <Kbd>8</Kbd>.
          </p>
        </Section>

        <Section title="Wielkie litery i znaki interpunkcyjne">
          <p className="m-0">
            Polski potrzebuje <strong>wielkich liter</strong> - na początku zdania
            oraz w imionach i nazwach (Ania, Kraków, Wisła). Program Tastenflow
            pisze je <strong>zawsze poprawnie</strong>, więc nigdy nie widzisz źle
            napisanego słowa.
          </p>
          <p className="m-0">
            <strong>Na początku bardzo łatwo:</strong> po prostu pisz{" "}
            <strong>małą</strong> literę - <strong>wielka</strong> pojawia się
            automatycznie. Klawisza <Kbd>Shift</Kbd> jeszcze do tego{" "}
            <strong>nie</strong> potrzebujesz.
          </p>
          <p className="m-0">
            <strong>Już wkrótce</strong>, po pierwszych literach, uczysz się
            klawisza <Kbd>Shift</Kbd> „naprawdę”: trzymasz go <strong>jedną</strong>{" "}
            ręką, a literę piszesz <strong>drugą</strong> - jak na każdej
            klawiaturze. Tak niedługo napiszesz wielkie litery{" "}
            <strong>samodzielnie</strong>, a nie tylko z automatyczną pomocą.
          </p>
          <div className="rounded-lg border border-hairline bg-surface-raised p-3">
            <p className="m-0">
              <strong>Ważne - zawsze Shift DRUGĄ ręką:</strong> są dwa klawisze
              Shift, z lewej i z prawej. Literę piszesz jedną ręką, a{" "}
              <Kbd>Shift</Kbd> trzymasz <strong>drugą</strong>. Tak żadna ręka nie
              musi naciskać dwóch klawiszy naraz.
            </p>
            <p className="m-0 mt-2">
              Przykład: wielkie <strong>A</strong> (lewa ręka) →{" "}
              <strong>prawy</strong> <Kbd>Shift</Kbd>. Wielkie <strong>K</strong>{" "}
              (prawa ręka) → <strong>lewy</strong> <Kbd>Shift</Kbd>.
            </p>
            <p className="m-0 mt-2">
              Jeśli użyjesz klawisza Shift <strong>tej samej</strong> ręki albo
              klawisza <Kbd>Caps Lock</Kbd>, litera i tak się liczy - przecież jest
              poprawna. Program Tastenflow daje wtedy od czasu do czasu{" "}
              <strong>wskazówkę</strong>, który Shift jest wygodniejszy. Nauczyciele
              widzą w statystykach, jak często tak się dzieje; to nie jest błąd.
            </p>
          </div>
          {detail >= 2 && (
            <p className="m-0 text-sm text-ink-muted">
              Wskazówka: naciśnij <Kbd>Shift</Kbd> <strong>dwa razy szybko</strong> -
              usłyszysz, którym palcem go trzymać.
            </p>
          )}
          <p className="m-0">
            <strong>Kropka, przecinek i znak zapytania</strong> pojawiają się
            dopiero wtedy, gdy je poznasz. Wcześniej czytasz zdanie po prostu{" "}
            <strong>bez nich</strong> - to celowe, a nie błąd.
          </p>
        </Section>

        <Section title="W jakiej kolejności przychodzą litery?">
          <p className="m-0">
            Nowe klawisze dochodzą zawsze w tej samej kolejności: najpierw{" "}
            <strong>pozycja podstawowa</strong>, potem pozostałe litery - najpierw
            te, które występują najczęściej. Który klawisz jest następny, widzisz
            zawsze z prawej strony paska pod polem pisania:{" "}
            <strong>„Następny klawisz”</strong>.
          </p>
          <div className="flex flex-wrap gap-1" aria-hidden="true">
            {letters.map((ch) => (
              <Kbd key={ch}>{unitGlyph(ch)}</Kbd>
            ))}
          </div>
          <p className="m-0 text-sm text-ink-muted">
            Już <strong>po pierwszych literach</strong> dochodzą{" "}
            <strong>wielkie litery</strong> (klawisz Shift), a zaraz potem{" "}
            <strong>kropka i przecinek</strong> - zdanie zaczyna się wielką literą i
            kończy kropką. Potem pozostałe litery. Na końcu przychodzą pozostałe{" "}
            <strong>znaki interpunkcyjne</strong> (- ? ! : ;),{" "}
            <strong>cyfry</strong> i <strong>symbole</strong>.
          </p>
        </Section>

        {detail >= 2 && (
          <Section title="Jak działa „Mój trening”">
            <p className="m-0">
              <strong>Dopasowuje się do ciebie.</strong> Program zapamiętuje, które
              klawisze są jeszcze niepewne, i ćwiczy dokładnie te. Nowy klawisz
              dochodzi dopiero wtedy, gdy pozostałe są pewne.{" "}
              <strong>Najczęstsze</strong> litery przychodzą najpierw - dzięki temu
              już po kilku klawiszach piszesz <strong>prawdziwe słowa i
              zdania</strong>, a pierwsze <strong>opowiadania</strong> otwierają się
              wcześnie.
            </p>
          </Section>
        )}

        <Section title="Pasek pod polem pisania">
          <p className="m-0">
            Pod polem pisania jest wąski pasek z czterema rzeczami: twój{" "}
            <strong>{ringWort}</strong>, dzisiejszy <strong>czas</strong> ćwiczeń,{" "}
            <strong>cel tygodniowy</strong> i <strong>następny klawisz</strong>. Przy
            celu tygodniowym kółko pokazuje, ile <strong>minut</strong> ćwiczeń jest
            już w tym tygodniu - na przykład „25 z 60 min”; <strong>ptaszek</strong>{" "}
            oznacza: cel na ten tydzień osiągnięty. Następny klawisz otwiera się{" "}
            <strong>automatycznie</strong>, gdy poprzednie są pewne - po prostu ćwicz
            dalej.
          </p>
          <p className="m-0">
            Pasek jest widoczny <strong>zawsze</strong> - także w czasie pisania.
            Dzięki temu nic nie skacze, a ty w każdej chwili widzisz, jak długo już
            ćwiczysz.
          </p>
          <p className="m-0">
            <Kbd>Alt</Kbd> + <Kbd>D</Kbd> odczytuje czas ćwiczeń i cel tygodniowy.
            Które klawisze są już pewne, które jeszcze nie i który przyjdzie
            następny, widać w części <strong>„Moje postępy”</strong>, pod nagłówkiem{" "}
            <strong>„Stan klawiszy”</strong> (<Kbd>Alt</Kbd> + <Kbd>S</Kbd>, z
            kontem).
          </p>
        </Section>

        <Section title="Biblioteka: „Opowiadania i ciekawostki” 📖">
          <p className="m-0">
            Oprócz drogi „Mój trening” jest jeszcze jedna:{" "}
            <strong>Opowiadania</strong> - w Ustawieniach ⚙, w części{" "}
            <strong>„Co ćwiczysz?”</strong>. Czekają tam całe opowiadania i serie
            ciekawostek - nie pojedyncze zdania, tylko{" "}
            <strong>jedno opowiadanie przez wiele rund</strong>. Każdy etap to
            dwanaście wierszy; następnym razem czytasz dalej dokładnie od miejsca,
            w którym była przerwa.
          </p>
          <p className="m-0">
            Pojawia się tylko to, co naprawdę da się napisać klawiszami, które już
            znasz - dlatego na początku widać jeszcze kłódki. Otwierają się
            automatycznie, gdy wystarczająco dużo klawiszy jest pewnych. Każdy wiersz
            przychodzi <strong>tylko raz</strong>: to, co jest już napisane, nie
            wraca jako powtórka.
          </p>
          {detail >= 2 && (
            <p className="m-0">
              <strong>Czerwona nić:</strong> to, co przeczytasz w serii ciekawostek,
              wraca później w treningu - jako <strong>pytanie innymi słowami</strong>,
              potem jako małe pogłębienie, a na końcu jako pasujący dowcip. Tak
              wiedza zostaje w głowie, a wcale nie przypomina odpytywania.
            </p>
          )}
          {detail >= 3 && (
            <p className="m-0 text-sm text-ink-muted">
              Pod listą jest część „Źródła i podziękowania”: tam widać, skąd
              pochodzą teksty. Część jest napisana specjalnie dla programu, inne
              pochodzą z wolnych źródeł - te są tam wymienione z nazwy, tak się
              należy.
            </p>
          )}
        </Section>

        <Section title="Skąd pochodzą teksty? 🤖">
          <p className="m-0">
            Własne teksty tego programu, czyli zdania do ćwiczeń, dowcipy i
            opowiadania, Johannes napisał{" "}
            <strong>z pomocą sztucznej inteligencji (AI)</strong>, a potem je
            przeczytał i sprawdził. Teksty z innych źródeł (na przykład z Wikipedii)
            są wymienione z nazwą źródła w części „Źródła i podziękowania”.
          </p>
          <p className="m-0">
            {hoehleMitWesen ? (
              <>
                Także śpiewająca ryba i mruczący stworek z jaskini w grze Wyprawa
                polarna to <strong>głosy komputerowe</strong>, a nie prawdziwi ludzie.
              </>
            ) : (
              <>
                Także śpiewająca ryba w grze Wyprawa polarna to{" "}
                <strong>głos komputerowy</strong>, a nie prawdziwy człowiek.
              </>
            )}{" "}
            Czytanie na głos (🗣) korzysta z głosu twojego urządzenia.
          </p>
        </Section>

        <Section title={WYZWANIE}>
          <p className="m-0">
            Czasem nauczyciel lub nauczycielka uruchamia{" "}
            <strong>{WYZWANIE}</strong> - dla całej klasy.{" "}
            <strong>Wszyscy dostają ten sam tekst</strong> i wszyscy mają tyle samo
            czasu.
          </p>
          <p className="m-0">
            <strong>Czas liczy się dopiero od twojego pierwszego naciśnięcia
            klawisza</strong> - nie od chwili uruchomienia. Od uruchomienia masz{" "}
            <strong>{einstiegsMinuten}</strong> na rozpoczęcie.
          </p>
          <p className="m-0">
            <strong>Jak je rozpoznać:</strong> nad polem pisania jest słowo{" "}
            <strong>{WYZWANIE}</strong>, obok czas, a wokół całego obszaru jest inna,{" "}
            <strong>przerywana ramka</strong>. Gdy czas się skończy, jedno i drugie
            znika.
          </p>
          <p className="m-0">
            <strong>Ile czasu zostało, bez patrzenia:</strong> <Kbd>Alt</Kbd> +{" "}
            <Kbd>X</Kbd> mówi ci to. Zegar odzywa się automatycznie tylko kilka razy,
            poza tym jest cicho.
          </p>
          <p className="m-0">
            <strong>Monitor brajlowski pozostaje spokojny.</strong> Czas{" "}
            <strong>nie</strong> tyka na monitorze: biegnie u góry, ale nigdy nie
            wchodzi w to, co teraz czytasz.
          </p>
          <p className="m-0">
            <strong>Czasem {WYZWANIE} to „Swobodne pisanie”.</strong> Wtedy błąd po
            prostu zostaje - nic nie jest zaznaczane, żaden dźwięk go nie zgłasza.
            Klawisz Backspace poprawia tylko w bieżącym wierszu; skończony wiersz
            zostaje taki, jaki jest. Na końcu wiersza naciskasz po ostatnim słowie
            spację - albo, jeśli klasa ma ustawione „Koniec wiersza klawiszem
            Enter”, klawisz Enter. To, co na końcu jest jeszcze źle, pokazuje dopiero
            podsumowanie, jako lista do przeczytania.
          </p>
          <p className="m-0">
            <strong>Wcześniej skończyć:</strong> <Kbd>Esc</Kbd> pyta, czy na pewno.
            Przycisk <strong>Pisz dalej</strong> (także <Kbd>Esc</Kbd>) wraca do
            wiersza, przycisk <strong>Oddaj</strong> oddaje pracę - liczy się to, co
            zostało napisane do tej chwili. To samo robi przycisk{" "}
            <strong>Gotowe - oddaj</strong> pod polem, bez pytania.
          </p>
          <p className="m-0">
            <strong>Gdy czas się skończy,</strong> od razu widać twoje podsumowanie:
            uderzenia na minutę, dokładność, znaki, błędy, wiersze i klawisze, które
            były niepewne. Każde {WYZWANIE} zostaje potem w części{" "}
            <strong>„Moje postępy”</strong>, pod nagłówkiem{" "}
            <strong>{WYZWANIA}</strong> - tam możesz je w każdej chwili przeczytać
            jeszcze raz.
          </p>
        </Section>

        <Section title="Wyścig klasowy ⚔️">
          <p className="m-0">
            W Wyścigu klasowym przez <strong>pięć minut piszesz na wyścigi</strong>{" "}
            z innymi dziećmi z twojej klasy. Wyścig jest tylko w klasie i tylko
            wtedy, gdy nauczyciele na niego pozwalają.
          </p>
          <p className="m-0">
            <strong>Ogłoszenie wyścigu:</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd> albo
            przycisk <strong>⚔️ Wyścig klasowy</strong> na pasku nad polem ćwiczeń -
            tuż obok przycisku <strong>🐧 Graj</strong>. U wszystkich innych
            otwiera się wtedy okno z przyciskami <strong>Biorę udział!</strong> i{" "}
            <strong>Nie teraz</strong>. <Kbd>Esc</Kbd> wraca do ćwiczeń, a to samo
            zaproszenie nie wraca automatycznie.
          </p>
          <p className="m-0">
            <strong>Jeśli ktoś już zaprasza,</strong> <Kbd>Alt</Kbd> + <Kbd>M</Kbd>{" "}
            przywołuje to zaproszenie z powrotem - drugi wyścig można zacząć dopiero
            wtedy, gdy pierwszy już trwa. Jeśli dwie osoby zapraszają prawie
            jednocześnie, liczy się zaproszenie, które przyszło pierwsze.
          </p>
          <p className="m-0">
            <strong>Gdy teraz się nie da:</strong> jeśli już bierzesz udział w
            wyścigu, przycisk nazywa się <strong>⚔️ Wyścig klasowy trwa</strong> -
            i <Kbd>Alt</Kbd> + <Kbd>M</Kbd> mówi ci to samo. Inne wyścigi w klasie
            nie przeszkadzają: może ich trwać dowolnie wiele naraz.
          </p>
          <p className="m-0">
            <strong>Każda osoba pisze na swoim poziomie.</strong> Kto zna już cyfry,
            dostaje cyfry; kto jest przy rzędzie podstawowym, dostaje rząd
            podstawowy. Pomyłki kosztują - jedna pomyłka waży tyle co pięć znaków.
          </p>
          <p className="m-0">
            <strong>Jak idzie, bez patrzenia:</strong> na samym początku wiersza
            pisania jest zawsze osiem komórek: <strong>P2</strong> to miejsce, obok
            czas, który został. <Kbd>Alt</Kbd> + <Kbd>X</Kbd> mówi ci miejsce, czas
            i pierwszą trójkę. Nic nie odzywa się automatycznie - monitor brajlowski
            pozostaje spokojny.
          </p>
          <p className="m-0">
            <strong>Wcześniej skończyć:</strong> <Kbd>Esc</Kbd> albo przycisk{" "}
            <strong>Wyjdź</strong> pyta, czy na pewno. Przycisk{" "}
            <strong>Pisz dalej</strong> (także <Kbd>Esc</Kbd>) wraca do wiersza.
            Przycisk <strong>Wyjdź</strong> kończy wyścig tylko dla ciebie -
            pozostałe osoby piszą dalej i widzą twój wynik do tej chwili.
          </p>
          <p className="m-0">
            <strong>Wyścig liczy się do twojego czasu ćwiczeń</strong> i może
            odblokować nowy klawisz - tak samo jak zwykła runda.{" "}
            <strong>Miejsce nie jest zapisywane.</strong> Na końcu widać listę:
            Puchar, Srebro i Brąz dla pierwszej trójki, a pozostałe osoby ze swoją
            liczbą. Potem przycisk <strong>Ćwicz dalej</strong> albo{" "}
            <Kbd>Esc</Kbd> prowadzi z powrotem.
          </p>
        </Section>

        <Section title="Ważne klawisze">
          <p className="m-0 text-sm text-ink-muted">
            <AltOderWahl>
              Na Macu klawisz <Kbd>Alt</Kbd> to klawisz <Kbd>⌥</Kbd> (Option).
            </AltOderWahl>
          </p>
          <ul className="m-0 list-none space-y-2 p-0">
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Esc</Kbd>
              </span>
              <span>
                <strong>Najważniejszy klawisz:</strong> zamyka każde okno, a kursor
                stoi potem <strong>zawsze w polu pisania</strong>. Nawet gdy nic nie
                jest otwarte, <Kbd>Esc</Kbd> przenosi go tam z powrotem. Jedyny
                wyjątek to „Odkrywaj klawisze”: tam <Kbd>Esc</Kbd> też jest
                klawiszem do odkrywania, a wyjście daje dopiero drugie naciśnięcie.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Shift</Kbd> <Kbd>Shift</Kbd>
              </span>
              <span>Dwa razy szybko: odczytywany jest odpowiedni palec.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>E</Kbd>
              </span>
              <span>Przejście do pola pisania.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>U</Kbd>
              </span>
              <span>Przejście do ćwiczeń.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>S</Kbd>
              </span>
              <span>
                Otwiera Moje postępy (nauczyciele: Moje klasy). Działa tylko po
                zalogowaniu. Drugie naciśnięcie wraca do pola pisania.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>Z</Kbd>
              </span>
              <span>Odczytuje, który wiersz jest teraz.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>D</Kbd>
              </span>
              <span>
                Podaje czas ćwiczeń - na monitorze brajlowskim i (przy czytaniu na
                głos) jako komunikat.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>L</Kbd>
              </span>
              <span>Odczytuje, na którym {ringWortMiejscownik} jesteś.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>3</Kbd>
              </span>
              <span>
                <strong>Odkrywaj klawisze:</strong> każdy klawisz, który naciśniesz,
                jest odczytywany i pokazywany w dużym rozmiarze - najpierw skrót,
                potem nazwa, potem to, do czego służy (na przykład „Tab - klawisz
                Tab - przechodzi do następnego elementu”). Dotyczy to też wszystkich
                klawiszy specjalnych i znaków interpunkcyjnych, znaków z prawym
                Altem (na Macu: Option) razem z drogą do nich i skrótów klawiszowych
                jak Ctrl + C - razem z tym, co robią. Skróty programu Tastenflow
                (<AltText>Alt + H, Alt + V …</AltText>) dalej działają. Klawiatura ekranowa pokazuje,
                który klawisz został naciśnięty. Gdy czytanie na głos jest
                wyłączone, głos milczy. Na monitorze brajlowskim objaśnienie zostaje
                do następnego klawisza i można je przeczytać w całości klawiszami
                przewijania; na ekranie jest w oknie. Nic nie jest wpisywane, nic
                nie ginie. <Kbd>Shift</Kbd> daje górny znak klawisza, a <Kbd>AltGr</Kbd> (na Macu: <Kbd>Option</Kbd>) trzeci - tak możesz po kolei wypróbować wszystkie znaki.{" "}<strong>Wyjście:</strong> jeszcze raz <Kbd>Alt</Kbd> +{" "}
                <Kbd>3</Kbd>, dwa razy <Kbd>Esc</Kbd> - albo po prostu odśwież
                stronę.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>4</Kbd>
              </span>
              <span>
                <strong>Znajdź klawisze:</strong> program podaje nazwę klawisza, a
                ty go szukasz. Przy pierwszym trafieniu słychać „Jest! Naciśnij
                inny klawisz, potem jeszcze raz …” - liczy się dopiero drugie
                naciśnięcie, i to po innym klawiszu pomiędzy. Potem przychodzi
                następny klawisz. Inny klawisz jest tylko nazywany. W
                oknie <Kbd>Alt</Kbd> + <Kbd>4</Kbd> przełącza między odkrywaniem a
                szukaniem. <strong>Wyjście:</strong> tak samo jak przy odkrywaniu.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>K</Kbd>
              </span>
              <span>
                <strong>Kolory i kontrast:</strong> siedem zestawów kolorów - jasny,
                ciemny, czarny na żółtym, żółty na niebieskim i inne. Każdy już na
                liście pokazuje się we własnych kolorach, więc z góry widzisz, jak
                wygląda.
              </span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>T</Kbd>
              </span>
              <span>Otwiera lub zamyka listę skrótów klawiaturowych.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
              </span>
              <span>Otwiera lub zamyka wiadomości od nauczycieli.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </span>
              <span>Powiększa albo zmniejsza pole pisania.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>V</Kbd>
              </span>
              <span>Włącza lub wyłącza czytanie na głos.</span>
            </li>
            <li className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="min-w-[8.5rem] shrink-0">
                <Kbd>Alt</Kbd> + <Kbd>H</Kbd>
              </span>
              <span>Otwiera lub zamyka tę pomoc.</span>
            </li>
            <WeitereTasten />
          </ul>
        </Section>

        {detail >= 3 && (
          <Section title="Jak program cię wspiera">
            <p className="m-0">
              Program mierzy każdą literę osobno - jak dokładnie i jak szybko ją
              piszesz. Automatycznie ćwiczy najsłabsze i odblokowuje nową literę
              dopiero wtedy, gdy poprzednie są pewne. Tak powstaje twoja własna
              droga nauki.
            </p>
            <p className="m-0">
              Poziom trudności (1-50) dba o to, żeby zawsze było{" "}
              <strong>wymagająco, ale do zrobienia</strong>: gdy idzie dobrze,
              rośnie; gdy jest za trudno, znowu spada. W części{" "}
              <strong>„Moje postępy”</strong> widzisz wszystko o swoich postępach -
              i to, jak się poprawiasz.
            </p>
          </Section>
        )}

        <Section title="Ćwiczenie bez klasy - konto prywatne 🙋">
          <p className="m-0">
            Jeśli nie należysz do żadnej klasy, zakładasz konto samodzielnie:
            naciśnij okrągły przycisk <strong>Konto</strong> i zaznacz{" "}
            <strong>„Ćwiczę na własną rękę, bez klasy”</strong>. Potrzebny jest do
            tego adres e-mail: tam w każdy poniedziałek przychodzi podsumowanie
            tygodnia - ale tylko w tygodniach, w których naprawdę były ćwiczenia.
            Jeśli przez cały rok nikt nie otworzy programu Tastenflow, przychodzi
            e-mail z ostrzeżeniem; jeśli przez kolejne trzy tygodnie nikt się nie
            zaloguje, konto zostaje usunięte razem ze wszystkimi postępami.
          </p>
        </Section>

        <PlakatAbschnitt />
      </div>
    </div>
  );
}

/** Plakat do powieszenia (`handbuchInSprache`). */
function PlakatAbschnitt() {
  const plakat = handbuchInSprache(tastenflowPlakat(), "pl");
  return (
    <Section title="Plakat do powieszenia">
      <p className="m-0">
        Chcesz pokazać program Tastenflow w swojej szkole lub placówce? Tu jest{" "}
        <strong>plakat do wydrukowania i powieszenia</strong>: A3 w pionie, na
        pierwszy rzut oka widać, co potrafi Tastenflow, a do tego kod QR do
        tastenflow.org.
      </p>
      <p className="m-0">
        <a
          href={downloadAdresse(plakat)}
          download={plakat.speicherName}
          type="application/pdf"
          className="text-accent underline underline-offset-2"
        >
          Pobierz plakat (PDF, A3, {groesse(plakat.bytes, "pl")})
        </a>
      </p>
    </Section>
  );
}
