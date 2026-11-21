/**
 * Korpus nur für Lernweg "pl", frühe Sprossen 7-22 - Altersstufe Jugendliche
 * (teens, ca. 11-16 Jahre; PL-T2, 03.10.2026, Bauplan
 * `BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md` Etappe T; Befund
 * `BEFUND-2026-10-02-PL-T2-TEENS-FRUEH.md`). Vorgehen nach dem Piloten PL-T1
 * (`BEFUND-2026-10-02-PL-T1-KIDS-FRUEH.md` §6), Jugend-Form nach IT-T2.
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß" und „die texte sollen einen bezug zum
 * land und sprache haben". ALLES NEU AUF POLNISCH VERFASST - keine Text-Datei
 * einer anderen Sprache als Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz
 * (darum kein `herkunft`). Tatoeba (nur Originalsätze) diente als WORTLISTE.
 *
 * ZEICHENSATZ wie PL-T1 (Tastatur `pl`, `introOrder("pl")`):
 *    7  + a  - einziger Vokal der Grundreihe (jaka klasa, jaka fala)
 *    8  + ;  - Fingeranker, kein Buchstabe: keine Zeile
 *    9-16  + w o n t e i m z
 *   17  + ę  - der erste AltGr-Griff (się, dzięki, idę)
 *   18-22  + c y r p u   (danach ⇧)
 * `minTier` rechnet `minTierFor(text, "pl")`, nicht die Hand.
 *
 * VOR ⇧: klein, ohne Satzzeichen, ohne Namen, ohne Frage; kein ł b g h,
 * kein ż ą ś ć ó ń ź, kein x v q - also keine Vergangenheit (gegendert, fast
 * immer mit `ł`). Präsens, Wortgruppen, Ausrufe; KEINE Zeile legt das Geschlecht
 * der lesenden Person fest (mam to, nie dam się, mieszkam nad morzem, wkręcam
 * się). Jede Zeile ist eine Wortgruppe oder ein kleiner richtiger Satz - nie
 * Wortsalat (Falle 26); an 7-12 ehrlich wenige Zeilen (Befund §2).
 *
 * JUGEND (11-16), natürlich, nicht kindlich, nicht belehrend: Sport (auch
 * Paralympics: „nasi paralimpijczycy"), Musik heute („polski rap", „disco polo
 * na weselu", „szanty nad jeziorem"), Technik („czat klasowy", „memy na czacie",
 * „wyciszam powiadomienia"), Umwelt („strajk klimatyczny", „fotowoltaika na
 * wsi"), Berufswahl („rekrutacja do liceum", „praktyki zawodowe", „kurs
 * ratownika"), Freundschaft („trzymam kciuki", „to nasz sekret"), Reisen mit dem
 * Zug („peron trzeci tor pierwszy", „jedna przesiadka", „czekamy na dworcu"),
 * Schule („kapcie w szatni", „czerwony pasek", „poczta walentynkowa").
 *
 * BEZUG ZU LAND UND SPRACHE, ohne Namen, über die Dinge:
 *  · Pomorze: „mieszkam nad morzem", „festiwal nad morzem", „wiatr i fale".
 *  · Warmia i Mazury: „szanty nad jeziorem", „sezon na kajaki".
 *  · Podlasie: „rowerem przez puszczę"; Podlasie/Podkarpacie: „drewniane
 *    cerkwie", „wycieczka do skansenu".
 *  · Małopolska/Podhale: „kolejka linowa", „czerwony szlak", „razem na szczyt".
 *  · Śląsk: „stare familoki", „no to fajrant". Mazowsze: „metrem na koncert".
 *  · Polen allgemein: andrzejki, prima aprilis, poczta walentynkowa, czerwony
 *    pasek, kapcie w szatni, rekrutacja do liceum, drzwi otwarte, lektury,
 *    dyktando, tenis ziemny, mecz siatki, peron trzeci tor pierwszy.
 *  · Die Sprache selbst: „przecinek przed ale", „polskie znaki na klawiaturze",
 *    „klawisz po klawiszu".
 * Sperrliste `sperrlistePl.ts` (Kern UND Wortbasis; „kartacze" steht dort und
 * ist darum NICHT drin).
 *
 * Wächter: `tests/tastenflow-texte-pl-teens-frueh.test.ts` (Sprosse je Zeile
 * AUSGERECHNET, Form, Wortgrenze 8, Sperrliste, Wortbasis/von Hand belegt,
 * Ogonek-Zwillinge gelesen, keine Kopie/kein Paar mit PL-T1 und den anderen
 * Sprachen). Nur anhängen - Korpus-Anker im selben Commit
 * (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_PL_WEG_FRUEH_TEENS: CorpusItem[] = [
  // ── Sprosse 7 (+a) ──
  { text: "jaka klasa", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "pl" },
  { text: "jaka fala", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "pl" },
  // ── Sprosse 9 (+w) ──
  { text: "jaka walka", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "dawaj dawaj", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 10 (+o) ──
  { text: "skok w dal", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "kask do kajaka", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 11 (+n) ──
  { text: "od nowa", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "nowa konsola", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 12 (+t) ──
  { text: "kod do konta", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "stan konta", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "to fakt", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 13 (+e) ──
  { text: "ale wokal", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "nowa deska", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "set dla nas", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "jest dwa jeden", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "no dalej", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "ale efekt", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 14 (+i) ──
  { text: "wielkie oklaski", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "link do wideo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "nikt nie wie", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "jaki talent", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "ale widok", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "solo na saksofonie", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "kolejka linowa", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "fotowoltaika na wsi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 15 (+m) ──
  { text: "mam to", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "jeden moment", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "tak samo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "film na weekend", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "ale mem", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "to kosmos", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "to temat na film", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 16 (+z) ──
  { text: "dzisiaj wolne", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "jaka szkoda", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "za moment", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "nawzajem", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "nie ma szans", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "sztafeta mieszana", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "jestem z wami", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "sezon na kajaki", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "szansa na medal", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  { text: "telefon w kieszeni", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 17 (+ę) ──
  { text: "klimat się zmienia", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "dzięki za link", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "tak się da", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "nie dam się", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "idę z wami", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  // ── Sprosse 18 (+c) ──
  { text: "mam cel", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "cisza nocna", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "zdjęcie klasowe", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "lekcje online", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "noc filmowa", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "mecz w telewizji", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "mecz siatki", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "zajęcia z kodowania", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "ciekawostka dnia", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  // ── Sprosse 19 (+y) ──
  { text: "nowy sezon", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "czat klasowy", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "widzimy się", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "zawody szkolne", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "memy na czacie", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "tylko nie to", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "wyjazd klasowy", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "nowe wyzwanie", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "matma i fizyka", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "tenis ziemny", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "skok o tyczce", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "nie mam weny", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "czas wolny", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "wyjazd na kolonie", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "nowy szkicownik", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  // ── Sprosse 20 (+r) ──
  { text: "koncert na stadionie", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "serial do rana", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "wolny internet", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "zaraz wracam", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "razem do mety", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "nowy rekord", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "wiatr i fale", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "mieszkam nad morzem", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "teatr szkolny", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "no serio", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "strajk klimatyczny", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "sadzimy drzewa", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "festiwal nad morzem", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "szanty nad jeziorem", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "czerwony szlak", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "razem na szczyt", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "stare familoki", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "no to fajrant", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "drewniane cerkwie", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "metrem na koncert", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "jazda na deskorolce", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "zdjęcia z drona", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "wkręcam się", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "masz rację", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "to nasz sekret", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "as serwisowy", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  // ── Sprosse 21 (+p) ──
  { text: "peron trzeci tor pierwszy", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "jedna przesiadka", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "nasi paralimpijczycy", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "przyjaciele na zawsze", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "jest spoko", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "dzięki za pomoc", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "projekt o klimacie", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "sprawdzian z matmy", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "ta piosenka to klasyk", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "polski rap", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "nowa playlista", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "podcast o kosmosie", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "kolejny poziom", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "wyciszam powiadomienia", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "czyste powietrze", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "praktyki zawodowe", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "praca w wakacje", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "przecinek przed ale", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "zaproszenie na osiemnastkę", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "poczta walentynkowa", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "to tylko prima aprilis", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "sklepik szkolny", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "kapcie w szatni", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "czerwony pasek", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "nie ma sprawy", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "kino plenerowe", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "salto na trampolinie", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "wakacje z plecakiem", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "powodzenia na sprawdzianie", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  // ── Sprosse 22 (+u) ──
  { text: "trzymam kciuki", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "na luzie", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "rekrutacja do liceum", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "liceum plastyczne", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "kurs ratownika", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "rzut karny", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "lektury na wakacje", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "wypracowanie na jutro", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "klawisz po klawiszu", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "rower zamiast auta", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "lekcje perkusji", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "czekamy na dworcu", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "rowerem przez puszczę", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "andrzejki i lanie wosku", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "wycieczka do skansenu", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "nasz trener nie odpuszcza", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "turniej międzyklasowy", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "drzwi otwarte w liceum", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "rysuję komiksy", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "muzyka filmowa", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "disco polo na weselu", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "polskie znaki na klawiaturze", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "praktyki u weterynarza", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "spotkanie w skateparku", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
  { text: "jutro dyktando", kind: "satz", stufen: ["teens"], minTier: 2, nurWeg: "pl" },
];
