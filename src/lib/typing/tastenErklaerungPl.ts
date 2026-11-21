/**
 * Tastenflow - „Odkrywaj klawisze" / „Znajdź klawisze" in der POLNISCHEN
 * Bedienung (★ O-PL, 02.10.2026, Glossar `recherche-polnisch-2026-10-02/GLOSSAR-pl.md`
 * §2.1, §2.8, §2.9, §2.11; Tastenlage nach R1 `tastaturen-und-zeichen.md` §2.2/§3.1).
 *
 * Dieselbe Logik wie bei den anderen Sprachen: `erkundeTaste` in
 * `tastenErklaerung.ts` entscheidet weiter, WAS eine Taste ist (Sondertaste,
 * Zeichen, Kombination, dritter Layer, Totaste) und ob sie geschluckt wird.
 * Hier stehen nur die WÖRTER - dieselben Fächer wie in `tastenErklaerungIt.ts`,
 * Eintrag für Eintrag, NEU auf Polnisch geschrieben (nicht übersetzt).
 *
 * ── Glossar (§2.1, §2.9) ────────────────────────────────────────────────────
 *  Polnische Tastaturen tragen die US-Beschriftung; die Tasten heissen
 *  englisch wie auf der Kappe, im Satz immer mit „klawisz" davor (Regel 11):
 *  Windows (Polski programisty): Shift · Caps Lock · Enter · Backspace · Delete ·
 *  Tab · Ctrl · Alt · prawy Alt (AltGr) · Esc · spacja · Home · End · Page Up ·
 *  Page Down · Insert · klawisz z logo Windows · klawisz menu. Mac (Polski Pro):
 *  Return · Delete (Rücktaste) · Fn + Delete (Entf) · Control · Option · Command
 *  · Fn. Pfeile: strzałka w lewo / w prawo / w górę / w dół. Einzige gebeugte
 *  Kappe: spacja („naciśnij spację"). Finger in `fingers.ts` (`FINGER_PL`).
 *
 * ── Die Regeln der Sätze ────────────────────────────────────────────────────
 *  · Ein Kind ist gemeint: **ty**, Befehlsform („naciśnij"), keine Maus-Wörter.
 *  · Geschlecht nie raten: kein Präteritum der 2. Person, keine Adjektive über
 *    das Kind - Präsens, -no-Form („Naciśnięto: …"), Sätze über die Taste.
 *  · Fälle: Namen in gebeugten Stellen nur mit „klawisz" davor oder nach einem
 *    Doppelpunkt (Regel 11). Die Suchrunde hat darum für jede Taste ZWEI
 *    Formen: Nominativ („strzałka w lewo") und Akkusativ („strzałkę w lewo").
 *  · Nur Bindestrich `-`; „…” im Fliesstext; höchstens ein „!" je Meldung.
 *  · Der erste Satz von `was` beginnt klein - die Taste ist sein Subjekt
 *    („przechodzi do następnego elementu").
 *  · Die neun polnischen Buchstaben sind BUCHSTABEN, nie „znaki specjalne"
 *    (Falle 10). Ohne Ogonek entsteht oft ein ANDERES Wort (że/ze, ją/ja,
 *    R1 §6.2) - das sagt die Erklärung, ohne zu werten (Falle 1).
 */
import type { Plattform } from "../computer/model";
import type { TastenName } from "../computer/tastenNamen";
import { spokenLabel } from "./fingers";
import { unitKind } from "./letters";
import { layoutById, type LayoutId } from "./layouts";
import { grossFuer } from "./sprachRegister";
import type { TastenErklaerung } from "./tastenErklaerung";

/**
 * ★ O-PL (02.10.2026): der lesbare polnische Name einer Lern-Einheit - für
 * die Lehrkraft-Statistik, die Stand-Zeile und die Tastenkarte, wie
 * `unitLabelIt` (`letters.ts` bleibt in dieser Etappe unberührt). Zeichen über
 * dieselbe Tabelle wie die Sprachausgabe (`SPOKEN_PL`). Buchstaben gross, wie
 * auf der Kappe - auch die polnischen („Ł"); „ß" bleibt „ß".
 */
export function unitLabelPl(unit: string): string {
  switch (unitKind(unit)) {
    case "shift":
      return "wielkie litery";
    case "ziffer":
      return `cyfra ${unit}`;
    case "satzzeichen":
    case "sonderzeichen":
      return spokenLabel(unit, "pl");
    default:
      if (unit === "ß") return "ß";
      return unit.toUpperCase() !== unit.toLowerCase() ? grossFuer(unit, "pl") : spokenLabel(unit, "pl");
  }
}

/* ══ Die neun polnischen Buchstaben ═════════════════════════════════════════ */

/**
 * ★ O-PL (Glossar Falle 1, R0 P12): „a" für „ą" ist ein Fehler, kein Ersatz -
 * aber die Rückmeldung nennt den WEG, nie „Źle!". Der Weg auf der polnischen
 * Programmierer-Tastatur (Windows: prawy Alt + Buchstabe, Mac Polski Pro:
 * Option + Buchstabe; „ź" liegt auf X). `null` für jedes andere Zeichen.
 * Die Taste kommt aus `layouts.ts` (EINE Quelle, `PL_ALTGR_BUCHSTABEN`).
 */
export function wegPolskiejLiteryPl(ch: string, plattform: Plattform): string | null {
  const zugang = layoutById("pl").access[ch];
  if (!zugang?.buchstabe) return null;
  const alt = plattform === "macos" ? "Option" : "prawy Alt";
  const taste = zugang.base.toUpperCase();
  return zugang.mitUmschalt ? `${alt} + Shift + ${taste}` : `${alt} + ${taste}`;
}

/** „Litera ą: prawy Alt + A." - der freundliche Hinweis zu einem polnischen Buchstaben, sonst `null`. */
export function hinweisPolskaLiteraPl(ch: string, plattform: Plattform): string | null {
  const weg = wegPolskiejLiteryPl(ch, plattform);
  return weg ? `Litera ${ch}: ${weg}.` : null;
}

/* ══ Sondertasten ═══════════════════════════════════════════════════════════ */

/** Polnische Sondertaste nach der Kennung aus dem Tasten-Wörterbuch. */
// ★ O-TR (02.10.2026): nur polnisch (`layout === "pl"`) - tr hat eigene Sätze in `tastenErklaerungTr.ts`.
// ★ O-CS (03.10.2026): gilt auch für cs - nur polnisch, cs hat eigene Sätze in `tastenErklaerungCs.ts`.
export function sondertastePl(
  id: string,
  plattform: Plattform,
  layout: LayoutId = "pl",
): TastenErklaerung | null {
  const mac = plattform === "macos";
  const pfeilWort = mac ? "Option" : "Ctrl";
  // Auf der polnischen Tastatur schreiben AltGr/Option die polnischen
  // Buchstaben; auf jeder anderen Tastatur die dritten Zeichen der Tasten.
  const polska = layout === "pl";
  switch (id) {
    case "tabulator":
      return {
        kurz: "Tab",
        name: "klawisz Tab",
        was: [
          "przechodzi do następnego elementu, na przykład do linku, pola albo przycisku.",
          "Z klawiszem Shift wraca do poprzedniego.",
        ],
      };
    case "eingabe":
    case "zeilenschalter":
      return mac
        ? {
            kurz: "Return",
            name: "klawisz Return",
            was: ["zatwierdza i wysyła.", "Otwiera linki, a w tekście zaczyna nowy wiersz."],
          }
        : {
            kurz: "Enter",
            name: "klawisz Enter",
            was: [
              "zatwierdza i wysyła.",
              "Otwiera linki, uruchamia przyciski, a w tekście zaczyna nowy wiersz.",
            ],
          };
    case "leertaste":
      return {
        kurz: null,
        name: "spacja",
        was: ["wstawia odstęp między dwoma słowami.", "Uruchamia też przyciski i zaznacza pola wyboru."],
      };
    case "loeschtaste":
      return {
        kurz: null,
        name: mac ? "klawisz Delete" : "klawisz Backspace",
        was: ["usuwa znak po lewej stronie kursora.", "Tak poprawiasz pomyłkę."],
      };
    case "entf":
      return mac
        ? {
            kurz: null,
            name: "klawisz Delete",
            was: [
              "usuwa znak po prawej stronie kursora.",
              "Jeśli na twojej klawiaturze go nie ma, naciśnij razem Fn i Delete.",
            ],
          }
        : {
            kurz: "Delete",
            name: "klawisz Delete",
            was: ["usuwa znak po prawej stronie kursora.", "Usuwa też zaznaczone pliki."],
          };
    case "esc":
      return {
        kurz: "Esc",
        name: "klawisz Esc",
        was: [
          "anuluje.",
          "Zamyka menu, okna i komunikaty.",
          "W programie Tastenflow przenosi cię z powrotem do pola pisania.",
        ],
      };
    case "umschalt":
      return {
        kurz: "Shift",
        name: "klawisz Shift",
        was: [
          "pisze wielkie litery, dopóki go trzymasz.",
          "Daje też górny znak z klawisza, na przykład znak zapytania.",
        ],
      };
    case "feststell":
      return {
        kurz: "Caps Lock",
        name: "klawisz Caps Lock",
        was: ["pisze wszystko wielkimi literami, dopóki nie naciśniesz go jeszcze raz."],
      };
    case "pfeil-links":
      return {
        kurz: null,
        name: "strzałka w lewo",
        was: ["przesuwa kursor o jeden znak w lewo.", `Z klawiszem ${pfeilWort} przeskakuje o całe słowo.`],
      };
    case "pfeil-rechts":
      return {
        kurz: null,
        name: "strzałka w prawo",
        was: ["przesuwa kursor o jeden znak w prawo.", `Z klawiszem ${pfeilWort} przeskakuje o całe słowo.`],
      };
    case "pfeil-auf":
      return {
        kurz: null,
        name: "strzałka w górę",
        was: ["przesuwa kursor o jeden wiersz w górę.", "Na listach i w menu przechodzi o jedną pozycję wyżej.", `Z klawiszem ${pfeilWort} przeskakuje o cały akapit w górę.`],
      };
    case "pfeil-ab":
      return {
        kurz: null,
        name: "strzałka w dół",
        was: ["przesuwa kursor o jeden wiersz w dół.", "Na listach i w menu przechodzi o jedną pozycję niżej.", `Z klawiszem ${pfeilWort} przeskakuje o cały akapit w dół.`],
      };
    case "pos1":
      return {
        kurz: "Home",
        name: "klawisz Home",
        was: ["przechodzi na początek wiersza.", "Na stronie internetowej przechodzi na samą górę.", "Z klawiszem Ctrl przechodzi na początek całego tekstu."],
      };
    case "ende":
      return {
        kurz: "End",
        name: "klawisz End",
        was: ["przechodzi na koniec wiersza.", "Na stronie internetowej przechodzi na sam dół.", "Z klawiszem Ctrl przechodzi na koniec całego tekstu."],
      };
    case "bild-auf":
      return {
        kurz: "Page Up",
        name: "klawisz Page Up",
        was: ["przewija o jeden ekran w górę."],
      };
    case "bild-ab":
      return {
        kurz: "Page Down",
        name: "klawisz Page Down",
        was: ["przewija o jeden ekran w dół."],
      };
    case "einfg":
      return {
        kurz: "Insert",
        name: "klawisz Insert",
        was: [
          "to klawisz czytnika ekranu w programach NVDA i JAWS.",
          "Od niego zaczyna się wiele poleceń czytnika ekranu.",
        ],
      };
    case "strg":
      return {
        kurz: "Ctrl",
        name: "klawisz Ctrl",
        was: [
          "służy do skrótów klawiaturowych.",
          "Ctrl + C kopiuje, Ctrl + V wkleja, Ctrl + Z cofa.",
          "Naciśnięty osobno od razu ucisza głos.",
        ],
      };
    case "alt":
      return {
        kurz: null,
        name: "klawisz Alt",
        was: [
          "służy do skrótów klawiaturowych.",
          "Alt + Tab przełącza między oknami.",
          "W programie Tastenflow Alt + H otwiera pomoc.",
        ],
      };
    case "altgr":
      // Glossar §2.9: „prawy Alt (AltGr)" beim ersten Vorkommen - hier der Name selbst.
      // Ohne Kurzform: „prawy Alt, prawy Alt (AltGr)" sagte dasselbe zweimal.
      return {
        kurz: null,
        name: "prawy Alt (AltGr)",
        was: polska
          ? [
              "pisze polskie litery: prawy Alt + A daje ą, prawy Alt + L daje ł.",
              "Daje też znak euro: prawy Alt + U.",
            ]
          : ["pisze trzeci znak z klawisza, na przykład małpę albo znak euro."],
      };
    case "windows-taste":
      return {
        kurz: "Win",
        name: "klawisz z logo Windows",
        was: [
          "otwiera menu Start.",
          "Naciśnij go jeszcze raz, żeby je zamknąć.",
          "Z innymi klawiszami robi inne rzeczy, na przykład Win + D pokazuje pulpit.",
        ],
      };
    case "befehlstaste":
      return {
        kurz: "cmd",
        name: "klawisz Command",
        was: ["służy do skrótów klawiaturowych.", "cmd + C kopiuje, cmd + V wkleja, cmd + Z cofa."],
      };
    case "wahltaste":
      return {
        kurz: "Option",
        name: "klawisz Option",
        was: polska
          ? [
              "pisze polskie litery: Option + A daje ą, Option + L daje ł.",
              "Ze strzałkami przeskakuje o całe słowo.",
            ]
          : ["pisze dodatkowe znaki, na przykład znak euro.", "Ze strzałkami przeskakuje o całe słowo."],
      };
    case "ctrl":
      return {
        kurz: "ctrl",
        name: "klawisz Control",
        was: ["należy do skrótów klawiaturowych na Macu.", "Naciśnięty osobno ucisza VoiceOver."],
      };
    case "fn":
      return {
        kurz: "fn",
        name: "klawisz Fn",
        was: ["daje innym klawiszom drugie zadanie, na przykład zmianę głośności."],
      };
    default:
      return null;
  }
}

/**
 * Wie die Taste in einer KOMBINATION und gross in der Mitte heisst - kurz,
 * wie sie auf der Kappe steht („Ctrl + Home", „Shift + Tab").
 */
export const TASTE_KURZ_PL: Readonly<Record<string, string>> = {
  tabulator: "Tab",
  eingabe: "Enter",
  zeilenschalter: "Return",
  leertaste: "Spacja",
  loeschtaste: "Backspace",
  entf: "Delete",
  esc: "Esc",
  umschalt: "Shift",
  feststell: "Caps Lock",
  "pfeil-links": "Strzałka w lewo",
  "pfeil-rechts": "Strzałka w prawo",
  "pfeil-auf": "Strzałka w górę",
  "pfeil-ab": "Strzałka w dół",
  pos1: "Home",
  ende: "End",
  "bild-auf": "Page Up",
  "bild-ab": "Page Down",
  einfg: "Insert",
  strg: "Ctrl",
  alt: "Alt",
  altgr: "prawy Alt",
  "windows-taste": "Win",
  befehlstaste: "cmd",
  wahltaste: "Option",
  ctrl: "ctrl",
  fn: "fn",
};

/* ══ Tasten ausserhalb des Wörterbuchs ═════════════════════════════════════ */

const F_TASTEN_WINDOWS_PL: Readonly<Record<string, readonly string[]>> = {
  F1: ["otwiera pomoc w wielu programach."],
  F2: ["zmienia nazwę zaznaczonego pliku."],
  F3: ["uruchamia wyszukiwanie."],
  F4: ["zamyka okno, jeśli razem z nim naciśniesz Alt."],
  F5: ["odświeża stronę internetową.", "Tutaj nic się nie dzieje, możesz dalej odkrywać."],
  F6: ["przechodzi do paska adresu przeglądarki."],
  F7: ["sprawdza pisownię w programie Word."],
  F10: ["przechodzi do paska menu w wielu programach."],
  F11: ["włącza i wyłącza pełny ekran w przeglądarce.", "Na laptopie często razem z klawiszem Fn."],
  F12: ["otwiera okno Zapisz jako w programie Word."],
};

/** Polnisch zu `nachKey` - F-Tasten, Num Lock, Menü-Taste, Lautstärke, Totaste. */
// ★ O-TR (02.10.2026): nur polnisch (`layout === "pl"`) - tr hat eigene Sätze in `tastenErklaerungTr.ts`.
// ★ O-CS (03.10.2026): gilt auch für cs - nur polnisch, cs hat eigene Sätze in `tastenErklaerungCs.ts`.
export function nachKeyPl(
  key: string,
  plattform: Plattform,
  layout: LayoutId = "pl",
): TastenErklaerung | null {
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(key);
  if (f) {
    const was =
      plattform === "macos"
        ? [
            "ma własne zadanie w niektórych programach.",
            "Na Macu te klawisze często zmieniają jasność i głośność.",
          ]
        : (F_TASTEN_WINDOWS_PL[key] ?? ["ma własne zadanie w niektórych programach."]);
    return { kurz: key, name: "klawisz funkcyjny", was };
  }
  switch (key) {
    case "Home":
      return sondertastePl("pos1", "windows", layout);
    case "End":
      return sondertastePl("ende", "windows", layout);
    case "PageUp":
      return sondertastePl("bild-auf", "windows", layout);
    case "PageDown":
      return sondertastePl("bild-ab", "windows", layout);
    case "Insert":
      return sondertastePl("einfg", "windows", layout);
    case "NumLock":
      return {
        kurz: null,
        name: "klawisz Num Lock",
        was: ["włącza i wyłącza cyfry na klawiaturze numerycznej."],
      };
    // ★ Testerin 24.10.2026: Numpad 5 bei Num aus (`Clear`) - Vorgabe, ungeprüft von Muttersprachlern.
    case "Clear":
      return {
        kurz: "5",
        name: "klawisz 5 na klawiaturze numerycznej",
        was: ["pisze 5, gdy Num Lock jest włączony.", "Teraz Num Lock jest wyłączony, więc nic nie robi."],
      };
    case "ContextMenu":
      return {
        kurz: null,
        name: "klawisz menu",
        was: ["otwiera menu z poleceniami dla miejsca, w którym jesteś.", "Shift + F10 robi to samo."],
      };
    case "PrintScreen":
      return { kurz: null, name: "klawisz Print Screen", was: ["robi zdjęcie ekranu.", "W Windows często otwiera narzędzie do zrzutów ekranu.", "Esc je zamyka."] };
    case "ScrollLock":
      return { kurz: null, name: "klawisz Scroll Lock", was: ["dziś prawie się go nie używa."] };
    case "Pause":
      return { kurz: null, name: "klawisz Pause", was: ["dziś prawie się go nie używa."] };
    case "AudioVolumeUp":
      return { kurz: null, name: "klawisz zwiększania głośności", was: ["zwiększa głośność."] };
    case "AudioVolumeDown":
      return { kurz: null, name: "klawisz zmniejszania głośności", was: ["zmniejsza głośność."] };
    case "AudioVolumeMute":
      return { kurz: null, name: "klawisz wyciszenia", was: ["wyłącza dźwięk i włącza go z powrotem."] };
    case "Fn":
      return sondertastePl("fn", plattform, layout);
    case "Dead":
      // ★ R1 §2.2: auf „Polski (programisty)" ist `~` (Shift + `) eine Totaste - ein
      // zweiter, zweitastiger Weg zu den polnischen Buchstaben (~, dann a = ą).
      return {
        kurz: null,
        name: "klawisz martwy",
        was:
          layout === "pl" && plattform !== "macos"
            ? [
                "dodaje znak do następnej litery.",
                "Na polskiej klawiaturze programisty to tylda: najpierw ~, potem A daje ą.",
              ]
            : ["dodaje znak do następnej litery, na przykład akcent nad e.", "Znak pojawia się dopiero z następną literą."],
      };
    default:
      return null;
  }
}

/* ══ Totasten mit Zusatzbezeichnung ═════════════════════════════════════════ */

const POJAWIA_SIE_POZNIEJ_PL = "Znak pojawia się dopiero z następną literą.";

/**
 * Die vier bekannten Akzente - nach derselben Kennung wie die deutsche Tabelle.
 * Auf der polnischen Programmierer-Tastatur gibt es keine dieser Totasten; sie
 * kommen auf Tastaturen anderer Länder vor (Glossar §2.1 „klawisz martwy").
 */
export const AKZENTE_PL: Readonly<Record<"zirkumflex" | "akut" | "gravis" | "trema", { name: string; was: readonly string[] }>> = {
  zirkumflex: {
    name: "daszek",
    was: ["stawia mały daszek nad następną literą, na przykład â.", POJAWIA_SIE_POZNIEJ_PL],
  },
  akut: {
    name: "akcent ostry",
    was: ["stawia akcent ostry nad następną literą, na przykład é.", POJAWIA_SIE_POZNIEJ_PL],
  },
  gravis: {
    name: "akcent",
    was: ["stawia akcent ciężki nad następną literą, na przykład à.", POJAWIA_SIE_POZNIEJ_PL],
  },
  trema: {
    name: "umlaut",
    was: ["stawia dwie kropki nad następną literą, na przykład ü.", POJAWIA_SIE_POZNIEJ_PL],
  },
};

/* ══ Zeichen ════════════════════════════════════════════════════════════════ */

const PROGRAMOWANIE_PL = ["służy do programowania."] as const;

/**
 * Dieselben Zeichen wie `ZEICHEN` in `tastenErklaerung.ts`. Der Name kommt
 * aus `spokenLabel(ch, "pl")` (`SPOKEN_PL`, Glossar §2.8); `name` steht nur, wo
 * er anders heissen soll. Dazu die neun polnischen Buchstaben: wo man sie
 * braucht, und dass ohne Zeichen oft ein ANDERES Wort entsteht (R1 §6.2).
 */
export const ZEICHEN_PL: Readonly<Record<string, { name?: string; was: readonly string[] }>> = {
  ".": { was: ["kończy zdanie."] },
  ",": { was: ["oddziela części zdania."] },
  "?": { was: ["kończy pytanie."] },
  "!": { was: ["kończy okrzyk."] },
  ":": { was: ["zapowiada coś, na przykład wyliczenie."] },
  ";": { was: ["oddziela dwie części zdania mocniej niż przecinek."] },
  "-": {
    was: ["to także łącznik: łączy dwa słowa, na przykład biało-czerwony.", "W rachunkach oznacza odejmowanie."],
  },
  "@": { was: ["jest w każdym adresie e-mail."] },
  "+": { was: ["w rachunkach oznacza dodawanie.", "W skrócie klawiaturowym znaczy: naciśnij razem."] },
  "*": { was: ["w informatyce oznacza mnożenie."] },
  "/": { was: ["w informatyce oznacza dzielenie.", "Jest też w adresach internetowych."] },
  "=": { was: ["stoi przed wynikiem rachunku."] },
  "'": { was: ["pojawia się w obcych nazwach, na przykład w wyrażeniu pismo Braille'a."] },
  '"': { was: ["stoi przed tym, co ktoś mówi, i po tym."] },
  "«": { was: ["otwiera to, co ktoś mówi, w tekstach z innych krajów."] },
  "»": { was: ["zamyka to, co ktoś mówi, w tekstach z innych krajów."] },
  "(": { was: ["otwiera dopowiedzenie."] },
  ")": { was: ["zamyka dopowiedzenie."] },
  "%": { was: ["znaczy: na sto, na przykład 50%."] },
  "&": { was: ["znaczy: i."] },
  "#": { was: ["oznacza numer, na przykład #1, i służy do hasztagów."] },
  "€": { was: ["to znak waluty euro."] },
  $: { was: ["to znak dolara."] },
  "£": { was: ["to znak funta."] },
  "§": { was: ["z liczbą oznacza paragraf, na przykład § 3."] },
  "°": { was: ["oznacza stopnie, na przykład temperatury."] },
  "<": { was: ["porównuje dwie liczby: ta po lewej jest mniejsza."] },
  ">": { was: ["porównuje dwie liczby: ta po lewej jest większa."] },
  _: { was: ["często pojawia się w adresach e-mail i w nazwach plików."] },
  "^": { was: ["w rachunku oznacza potęgę, na przykład 2 do potęgi 3."] },
  "²": { was: ["służy do powierzchni, na przykład metry kwadratowe."] },
  "³": { was: ["służy do objętości, na przykład metry sześcienne."] },
  "[": { was: PROGRAMOWANIE_PL },
  "]": { was: PROGRAMOWANIE_PL },
  "{": { was: PROGRAMOWANIE_PL },
  "}": { was: PROGRAMOWANIE_PL },
  "\\": { was: PROGRAMOWANIE_PL },
  "|": { was: PROGRAMOWANIE_PL },
  "~": { was: PROGRAMOWANIE_PL },
  "´": { was: ["stawia akcent ostry nad samogłoską."] },
  "`": { was: ["stawia akcent nad literą."] },
  "¨": { was: ["stawia dwie kropki nad literą."] },
  // ★★★ die neun polnischen Buchstaben (Glossar §2.8, R1 §6.2): Beispiele aus dem
  // Alltag und - wo es eins gibt - das Wortpaar, das ohne Zeichen entsteht.
  ą: { was: ["to polska litera, na przykład w słowach są i idą.", "Bez ogonka powstaje inne słowo: ją i ja."] },
  ę: { was: ["to polska litera, na przykład w słowach ręka i idę.", "Bez ogonka powstaje inne słowo: chcę i chce."] },
  ć: { was: ["to polska litera, na przykład w słowach być i ćma.", "Bez kreski powstaje inne słowo: nić i nic."] },
  ł: { was: ["to polska litera, na przykład w słowach łódka i mały.", "Bez kreski powstaje inne słowo: łoś i los."] },
  ń: { was: ["to polska litera, na przykład w słowach koń i dzień."] },
  ó: {
    was: ["to polska litera, na przykład w słowach góra i mój.", "Brzmi jak u: trzeba pamiętać, gdzie pisze się ó."],
  },
  ś: { was: ["to polska litera, na przykład w słowach świat i ślimak."] },
  ź: {
    was: [
      "to polska litera, na przykład w słowach źle i źródło.",
      "Na klawiaturze programisty leży na klawiszu X, a nie na Z.",
    ],
  },
  ż: { was: ["to polska litera, na przykład w słowach żaba i może.", "Bez kropki powstaje inne słowo: że i ze."] },
};

/** Der polnische Name eines Zeichens - aus der Tabelle oder `spokenLabel`. */
export function zeichenNamePl(ch: string): string {
  return ZEICHEN_PL[ch]?.name ?? spokenLabel(ch, "pl");
}

/* ══ Kombinationen ═════════════════════════════════════════════════════════ */

/** Wo eine Wirkung gilt - polnisch, fremde Namen mit „w programie" davor (Regel 11). */
export const ORT_PL: Readonly<Record<string, string>> = {
  explorer: "w Eksploratorze plików",
  finder: "w programie Finder",
  word: "w programie Word",
  excel: "w programie Excel",
  browser: "w przeglądarce",
  teams: "w programie Teams",
  powerpoint: "w programie PowerPoint",
  outlook: "w programie Outlook",
  bedienungshilfen: "w czytniku ekranu",
};

/** Die kleine eigene Liste der deutschen Datei, polnisch. */
export const EIGENE_KOMBINATIONEN_PL: Readonly<Record<Plattform, readonly { keys: string; was: string }[]>> = {
  windows: [
    { keys: "Umschalt+Tab", was: "wraca do poprzedniego elementu." },
    { keys: "Strg+P", was: "otwiera okno drukowania." },
  ],
  macos: [
    { keys: "Umschalt+Tab", was: "wraca do poprzedniego elementu." },
    { keys: "Cmd+P", was: "otwiera okno drukowania." },
  ],
};

/**
 * Was ein Kürzel BEWIRKT - polnisch, nach der Kennung der Wirkung im
 * Kürzel-Katalog von »Im Griff« (`lib/computer/kuerzelWirkung.ts`, dort nur
 * gelesen). Befehlsform wie in den Menüs von Windows und Office
 * („Kopiuj", „Wklej", „Zapisz jako"). Fehlt eine Kennung, fällt die Wirkung weg.
 */
export function wirkungPl(id: string, _plattform: Plattform): string | null {
  return WIRKUNG_PL[id] ?? null;
}

const WIRKUNG_PL: Readonly<Record<string, string>> = {
  kopieren: "Kopiuj",
  einfuegen: "Wklej",
  ausschneiden: "Wytnij",
  rueckgaengig: "Cofnij",
  wiederherstellen: "Przywróć to, co zostało cofnięte",
  "alles-markieren": "Zaznacz wszystko",
  "markieren-zeichen": "Zaznaczaj znak po znaku",
  "markieren-wort": "Zaznaczaj słowo po słowie",
  "spalte-markieren": "Zaznacz całą kolumnę",
  "zeile-markieren": "Zaznacz cały wiersz",
  oeffnen: "Otwórz",
  umbenennen: "Zmień nazwę",
  "neuer-ordner": "Utwórz nowy folder",
  papierkorb: "Przenieś do Kosza",
  duplizieren: "Zrób drugą kopię tego samego pliku",
  "ebene-hoeher": "Przejdź poziom wyżej",
  adressleiste: "Przejdź do paska adresu",
  eigenschaften: "Pokaż właściwości",
  uebersicht: "Otwórz podgląd, czyli spojrzenie bez otwierania pliku",
  bewegen: "Przenieś plik tam, gdzie ma być (znika z poprzedniego miejsca)",
  "ansicht-details": "Przełącz na widok „Szczegóły”",
  speichern: "Zapisz",
  "speichern-unter": "Zapisz jako, pod inną nazwą albo w innym miejscu",
  fett: "Pogrub",
  kursiv: "Zastosuj kursywę",
  unterstreichen: "Podkreśl",
  ueberschrift1: "Zastosuj Nagłówek 1",
  ueberschrift2: "Zastosuj Nagłówek 2",
  "standard-format": "Zastosuj styl „Normalny”",
  links: "Wyrównaj do lewej",
  zentriert: "Wyśrodkuj",
  zeilenumbruch: "Przejdź do nowego wiersza w tym samym akapicie",
  rechtschreibung: "Sprawdź pisownię",
  fensterbereiche: "Przechodź między częściami okna",
  suchen: "Znajdź",
  ersetzen: "Znajdź i zamień",
  "gehe-zu-zelle": "Przejdź do wybranej komórki",
  "zelle-bearbeiten": "Pisz dalej w komórce",
  "zelle-formatieren": "Otwórz okno „Formatowanie komórek”",
  "zum-rand": "Przejdź do krawędzi danych",
  autosumme: "Wstaw autosumowanie",
  "ausfuellen-unten": "Wypełnij w dół",
  "ausfuellen-rechts": "Wypełnij w prawo",
  "absoluter-bezug": "Zablokuj odwołanie (odwołanie bezwzględne ze znakiem dolara)",
  datum: "Wstaw dzisiejszą datę",
  uhrzeit: "Wstaw aktualną godzinę",
  kommentar: "Wstaw komentarz",
  autofilter: "Włącz albo wyłącz autofiltr",
  blattwechsel: "Przejdź do innego arkusza",
  "neues-blatt": "Wstaw nowy arkusz",
  "neu-laden": "Odśwież stronę",
  lesezeichen: "Dodaj zakładkę",
  verlauf: "Otwórz historię",
  senden: "Wyślij wiadomość",
  "nachricht-loeschen": "Usuń wiadomość",
  "sr-stopp": "Zatrzymaj mowę",
};

/** „a, b i c" - die polnische Aufzählung (kein Komma vor „i", Glossar §2.10). */
export function aufzaehlungPl(teile: readonly string[]): string {
  if (teile.length <= 1) return teile[0] ?? "";
  return `${teile.slice(0, -1).join(", ")} i ${teile[teile.length - 1]}`;
}

/**
 * Die festen Wörter des Erkundens, polnisch. `mit` steht vor dem Weg über den
 * dritten Layer - mit Doppelpunkt, damit kein Tastenname gebeugt werden muss
 * („Naciśnięto: prawy Alt + A.", -no-Form, Glossar Regel 2/11).
 */
export const ERKUNDEN_WOERTER_PL = {
  kombination: "skrót klawiszowy",
  kombiUnbekannt: "to, co robi, zależy od programu.",
  mit: "Naciśnięto:",
  akzentTaste: "klawisz martwy",
  unbekannt: "Nie rozpoznaję tego klawisza.",
  taste: (key: string) => `Klawisz ${key}`,
} as const;

/* ══ „Znajdź klawisze" ══════════════════════════════════════════════════════
 *
 * Die Sätze der Suchrunde (`lib/computer/tastenSuche.ts`) polnisch - WAS
 * geschieht, entscheidet weiter `suchSchritt`; hier wird nur gesagt.
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Der Fall, in dem eine Taste im Satz steht. */
export type FallPl = "nominativ" | "akkusativ";

interface TastePl {
  /** Im Satz als Subjekt oder nach „Naciśnięto:" - „strzałka w lewo". */
  nom: string;
  /** Nach „Znajdź" / „Naciśnij" - „strzałkę w lewo", „spację", „klawisz Tab". */
  akk: string;
  /** Wo sie liegt - als Weg für eine Hand, nie als Bild. */
  lage: string;
  /** Zusatz nach der Bestätigung (heute nur Caps Lock). */
  achtung?: string;
}

/** Eine Taste, deren Name im Akkusativ gleich bleibt („klawisz Tab"). */
function klawisz(nennung: string, lage: string, achtung?: string): TastePl {
  return achtung ? { nom: nennung, akk: nennung, lage, achtung } : { nom: nennung, akk: nennung, lage };
}

const SZESC_KLAWISZY_PL = "W bloku sześciu klawiszy nad strzałkami";
const STRZALKI_PL = "Na dole po prawej, wśród strzałek";

/** Die Tasten der Suchrunde, polnisch - nach derselben Kennung wie das Wörterbuch. */
const TASTEN_PL: Readonly<Record<string, TastePl | ((plattform: Plattform) => TastePl)>> = {
  tabulator: klawisz("klawisz Tab", "Lewy mały palec: jeden rząd wyżej, przy krawędzi."),
  "pfeil-links": { nom: "strzałka w lewo", akk: "strzałkę w lewo", lage: `${STRZALKI_PL}: ta po lewej.` },
  "pfeil-rechts": { nom: "strzałka w prawo", akk: "strzałkę w prawo", lage: `${STRZALKI_PL}: ta po prawej.` },
  "pfeil-auf": { nom: "strzałka w górę", akk: "strzałkę w górę", lage: `${STRZALKI_PL}: ta na górze.` },
  "pfeil-ab": { nom: "strzałka w dół", akk: "strzałkę w dół", lage: `${STRZALKI_PL}: pod strzałką w górę.` },
  pos1: klawisz("klawisz Home", `${SZESC_KLAWISZY_PL}, na górze pośrodku. Na laptopie często z klawiszem Fn.`),
  ende: klawisz("klawisz End", `${SZESC_KLAWISZY_PL}, na dole pośrodku. Na laptopie często z klawiszem Fn.`),
  "bild-auf": klawisz("klawisz Page Up", `${SZESC_KLAWISZY_PL}, na górze po prawej. Na laptopie często z klawiszem Fn.`),
  "bild-ab": klawisz("klawisz Page Down", `${SZESC_KLAWISZY_PL}, na dole po prawej. Na laptopie często z klawiszem Fn.`),
  leertaste: { nom: "spacja", akk: "spację", lage: "Długi klawisz pod twoimi kciukami." },
  eingabe: klawisz("klawisz Enter", "Prawa ręka, przy krawędzi: duży klawisz."),
  zeilenschalter: klawisz("klawisz Return", "Prawa ręka, przy krawędzi: duży klawisz."),
  loeschtaste: (plattform) =>
    klawisz(plattform === "macos" ? "klawisz Delete" : "klawisz Backspace", "Prawa ręka, przy krawędzi, dwa rzędy wyżej."),
  entf: (plattform) =>
    plattform === "macos"
      ? klawisz("klawisz Delete", "Tylko na dużych klawiaturach, obok klawisza Return. Inaczej Fn i Delete.")
      : klawisz("klawisz Delete", `${SZESC_KLAWISZY_PL}, na dole po lewej. Na laptopie na górze po prawej.`),
  esc: klawisz("klawisz Esc", "W lewym górnym rogu."),
  umschalt: klawisz("klawisz Shift", "Są dwa: po lewej i po prawej, w ostatnim rzędzie liter."),
  feststell: klawisz(
    "klawisz Caps Lock",
    "Lewy mały palec: jeden krok w lewo.",
    "Teraz piszesz wielkimi literami? Naciśnij go jeszcze raz.",
  ),
  strg: klawisz("klawisz Ctrl", "W lewym dolnym rogu."),
  alt: klawisz("klawisz Alt", "Na dole, na lewo od spacji."),
  altgr: klawisz("prawy Alt", "Na dole, na prawo od spacji."),
  "windows-taste": klawisz("klawisz z logo Windows", "Na dole po lewej, między Ctrl a Alt."),
  einfg: klawisz(
    "klawisz Insert",
    `${SZESC_KLAWISZY_PL}, na górze po lewej, nad klawiszem Delete. Na laptopach często go nie ma.`,
  ),
  befehlstaste: klawisz("klawisz Command", "Na dole po lewej, tuż obok spacji."),
  wahltaste: klawisz("klawisz Option", "Na dole po lewej, trzeci klawisz od krawędzi."),
  ctrl: klawisz("klawisz Control", "Na dole po lewej, drugi klawisz od krawędzi."),
  fn: klawisz("klawisz Fn", "Na dole po lewej, pierwszy klawisz, w rogu. Na MacBooku jest na nim napis „fn”."),
};

function tastePl(t: TastenName, plattform: Plattform): TastePl {
  const e = TASTEN_PL[t.id];
  if (typeof e === "function") return e(plattform);
  // Sicherheitsnetz: eine neue Wörterbuch-Taste ohne polnischen Eintrag -
  // „klawisz" davor, damit der Name in keinem Fall gebeugt werden muss.
  return e ?? klawisz(`klawisz ${t.kurz ?? t.name}`, "");
}

/**
 * „klawisz Tab", „strzałkę w lewo" - wie eine Taste im Satz heisst. Vorgabe
 * Akkusativ (nach „Znajdź", „Naciśnij"); „nominativ" für „Naciśnięto: …".
 */
export function tastenNennungPl(t: TastenName, plattform: Plattform, fall: FallPl = "akkusativ"): string {
  const e = tastePl(t, plattform);
  return fall === "nominativ" ? e.nom : e.akk;
}

/** Nur die Lage - oder "" (wie bei den anderen Sprachen). */
export function tastenLagePl(t: TastenName, plattform: Plattform): string {
  return tastePl(t, plattform).lage;
}

/** Der Auftrag beim Suchen: „Znajdź klawisz Tab. Lewy mały palec: …" */
export function ansageSuchauftragPl(t: TastenName, plattform: Plattform): string {
  const e = tastePl(t, plattform);
  return e.lage ? `Znajdź ${e.akk}. ${e.lage}` : `Znajdź ${e.akk}.`;
}

/** Erster Treffer - erst die Wiederholung zählt (Glossar §2.11: „Jest! Naciśnij jeszcze raz …"). */
export function ansageGefundenPl(t: TastenName, plattform: Plattform): string {
  return `Jest! Naciśnij inny klawisz, potem jeszcze raz ${tastenNennungPl(t, plattform)}.`;
}

/** Nach der Bestätigung - und, wo nötig, die Warnung (Caps Lock). */
export function ansageBestaetigtPl(t: TastenName, plattform: Plattform): string {
  const e = tastePl(t, plattform);
  return e.achtung ? `Dobrze! ${e.achtung}` : "Dobrze!";
}

/** Eine Taste, die hier nicht unterrichtet wird. */
export const ANSAGE_UNBEKANNT_PL = "Tego klawisza tutaj się nie ćwiczy.";

/** „Znalezione klawisze: 20 z 20." - die Zahl nach dem Doppelpunkt (Glossar Regel 11). */
export function alleGefundenPl(anzahl: number): string {
  return `Znalezione klawisze: ${anzahl} z ${anzahl}. Świetna robota.`;
}

/**
 * Der Satz zu einem Schritt der Suchrunde - polnisch. `art` und `naechste`
 * kommen unverändert aus `suchSchritt`; nur die Wörter sind neu.
 */
export function suchSatzPl(
  art: "daneben" | "gefunden" | "weiter" | "fertig",
  taste: TastenName | null,
  suchbar: readonly TastenName[],
  index: number,
  plattform: Plattform,
): string {
  const gesucht = suchbar[index]!;
  switch (art) {
    case "daneben": {
      const g = tastePl(gesucht, plattform);
      if (!taste) return `${ANSAGE_UNBEKANNT_PL} Znajdź ${g.akk}.`;
      return `Naciśnięto: ${tastenNennungPl(taste, plattform, "nominativ")}. Znajdź ${g.akk}.${g.lage ? ` ${g.lage}` : ""}`;
    }
    case "gefunden":
      return ansageGefundenPl(gesucht, plattform);
    case "fertig":
      return `${ansageBestaetigtPl(gesucht, plattform)} ${alleGefundenPl(suchbar.length)}`;
    case "weiter":
      return `${ansageBestaetigtPl(gesucht, plattform)} ${ansageSuchauftragPl(suchbar[index + 1]!, plattform)}`;
  }
}
