/**
 * Korpus nur für Lernweg "pl", frühe Sprossen 7-22 - Altersstufe Kids (PL-T1,
 * 03.10.2026, Bauplan `BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md` Etappe T;
 * Befund `BEFUND-2026-10-02-PL-T1-KIDS-FRUEH.md`). Der PILOT der neun polnischen
 * Text-Chargen: das Vorgehen steht im Befund §6.
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß" und „die texte sollen einen bezug zum
 * land und sprache haben". ALLES NEU AUF POLNISCH VERFASST - keine Text-Datei
 * einer anderen Sprache als Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz
 * (darum auch kein `herkunft`). Tatoeba (nur Originalsätze) diente als WORTLISTE:
 * welche Wortformen an welcher Sprosse schreibbar und in Gebrauch sind.
 *
 * ZEICHENSATZ (`lernweg.ts` `PL_LETTER_ORDER`; „Sprosse" = Anzahl gelernter
 * Einheiten von `introOrder("pl")` auf der einzigen Tastatur des Weges, `pl`):
 *    7  + a  - der EINZIGE Vokal der Grundreihe (las, sad, klasa, lalka, kajak)
 *    8  + ;  - Fingeranker, kein Buchstabe: an dieser Sprosse gibt es keine neue Zeile
 *    9-16  + w o n t e i m z
 *   17  + ę  - der erste AltGr-Griff (AltGr + e, Mac Option + e): idę, się, wodę
 *   18-22  + c y r p u   (danach ⇧)
 * `minTier` (0 an Sprosse 7, 1 für 9-16, 2 für 17-22) rechnet
 * `minTierFor(text, "pl")`, nicht die Hand.
 *
 * VOR ⇧ GIBT ES KEINE GROSSBUCHSTABEN UND KEINE SATZZEICHEN: jede Zeile ist
 * klein, ohne Punkt und Komma, darum auch keine Namen (Orte, Feste, Personen
 * kommen in den Chargen nach ⇧) und keine Frage. Es fehlen noch `ł b g h`,
 * `ż ą ś ć ó ń ź`, `x v q`: kein „był", kein „że", kein „są", kein „już",
 * kein „mój", kein „dzień", keine Vergangenheit (sie ist im Polnischen
 * gegendert und braucht fast immer `ł`). Darum stehen alle Sätze im Präsens
 * oder als Wortgruppe, und keine Zeile legt das Geschlecht des Kindes fest.
 *
 * JEDE ZEILE ist ENTWEDER eine kleine Wortgruppe/Wortreihe aus echten Wörtern
 * ODER ein grammatisch richtiger, sinnvoller kleiner Satz (Leitfaden Falle 26)
 * - nie Wortsalat. Lieber wenige saubere Zeilen: an Sprosse 7 gibt es nur den
 * Vokal „a" (6 Zeilen), an Sprosse 9 mit `w` und „a" nur dwa, was, kawa, kawka
 * (4 Zeilen), Sprosse 8 (`;`) trägt keine.
 *
 * BEZUG ZU LAND UND SPRACHE, soweit die Buchstaben es erlauben - ohne Namen,
 * über die Dinge, aus vielen Regionen:
 *  · Pomorze/Kaszuby: foki, mewy, wydmy, latarnia morska, kutry w porcie,
 *    „jedziemy nad morze".
 *  · Warmia i Mazury: „kajak na jeziorze", „jeziora mazurskie".
 *  · Podlasie: sękacz, „w puszczy mieszka wilk"; Mazowsze/Kurpie:
 *    „wycinanki kurpiowskie".
 *  · Małopolska/Podhale: „smok w jamie" (Kraków), „oscypek to wędzony ser",
 *    „kopalnia soli", skoki narciarskie, krakowiak.
 *  · Śląsk: „w niedzielę rolada i kluski"; Dolny Śląsk: „szukamy krasnali"
 *    (Wrocław); Kujawy: kujawiak, „pieczemy pierniki" (Toruń).
 *  · Polen allgemein: „sto lat sto lat", ferie zimowe, kiermasz w szkole,
 *    „proszę pani", pierwszy dzwonek, wianki na wodzie, pisanki, makowiec,
 *    kisiel, placki ziemniaczane, zupa pomidorowa, „kwiaty dla mamy".
 *  · Die Sprache selbst: „sz cz i rz to dwuznaki", „nie z czasownikami piszemy
 *    oddzielnie", „na koniec zdania stawiamy kropkę", „dawno dawno temu",
 *    „proszę dziękuję przepraszam", „polonez krakowiak mazur i kujawiak".
 * Sperrliste `sperrlistePl.ts` (Kern UND Wortbasis, auch kein Doppelsinn: kein
 * „jaja", nur „jajka"/„jajko"); keine Regionalwörter ohne Raumnennung.
 *
 * Wächter: `tests/tastenflow-texte-pl-kids-frueh.test.ts` (Sprosse je Zeile
 * AUSGERECHNET auf `pl`, Kleinschreibung, Wortgrenze 8, Sperrliste, Wortbasis,
 * keine Kopien/Paare, jede Einheit hat an ihrer Sprosse eine Zeile). Nur
 * anhängen - Korpus-Anker im selben Commit
 * (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_PL_WEG_FRUEH_KIDS: CorpusItem[] = [
  // ── Sprosse 7 (+a) - nur f j d k s l a: Wortreihen und kleine Gruppen ──────
  { text: "las sad fala", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "pl" },
  { text: "daj kask", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "pl" },
  { text: "jak fala", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "pl" },
  { text: "klasa lalka kajak", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "pl" },
  { text: "sala dla klas", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "pl" },
  { text: "sad jak las", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "pl" },
  // ── Sprosse 9 (+w; Sprosse 8 ist `;`, kein Buchstabe) - dwa, was, kawka ────
  { text: "jak kawka", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "daj dwa jajka", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "sala dla was", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "kawa dla was", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 10 (+o) - Tiere und Getränke, erste Befehle ───────────────────
  { text: "sowa foka koala", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "daj sok", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "jak sowa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "sok kakao woda", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "oddaj kask", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "dodaj sos", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "oko w oko", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 11 (+n) - nowa klasa, der Körper ──────────────────────────────
  { text: "nowa klasa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "jasna sala", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "ananas dla nas", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "oko nos kolano", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "fajna lalka", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "woda do kolan", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 12 (+t) - „sto lat", Familie, Sommer ──────────────────────────
  { text: "sto lat sto lat", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "to kot", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "tato daj kakao", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "stado fok", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "lato las staw", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "oto tata", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 13 (+e) - „jest": die ersten ganzen Sätze ─────────────────────
  { text: "kot jest na stole", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "jest nas dwoje", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "twoja kolej", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "jest weekend", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "no jasne", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "daleko do lata", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "to jest lew", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "jedno jajko", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "jest jasno", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "ale fajne", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 14 (+i) - „i", „nie", „w lesie", „na wsi" ─────────────────────
  { text: "lis i wilk w lesie", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "na wsi jest fajnie", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "jest wiosna", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "dwie foki", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "staw jest niedaleko", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "tost i kakao", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "las jest wielki", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "to nie tak", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "stado koni", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "wiosna i lato", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 15 (+m) - „mam", das Alter, der Drache von Krakau ─────────────
  { text: "mama i tata", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "mam kotka", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "nie wiem", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "smok w jamie", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "miska dla kotka", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "jestem w kinie", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "domek nad stawem", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "namiot w lesie", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "mam siedem lat", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "samolot nad lasem", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "smak lata", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "mewa nad statkiem", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "moje miasto", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 16 (+z) - „z", „sz", „dz": Schule, Winter, Burg und Drache ─────
  { text: "zadanie domowe", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "zimno mi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "dzwoni telefon", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "znam ten las", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "zamknij okno", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "wianki na wodzie", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "dziadek mieszka na wsi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "zamek i smok", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "w zoo jest lew", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "nasza klasa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "tata jedzie do miasta", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "zielone listki", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  { text: "witaj zimo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 17 (+ę, der erste AltGr-Griff) - idę, się, wodę ──────────────
  { text: "idę do kina", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "jadę na sanki", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "widzę sowę", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "daj mi wodę", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "wezmę kask", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "dzięki mamo", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "las się zieleni", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "tęsknię za latem", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "jem kaszę", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "mam nadzieję", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  // ── Sprosse 18 (+c) - „cz", „ci": Schule, Kuchen aus Podlasie, Ferien ─────
  { text: "ciasto dla cioci", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "makowiec i sękacz", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "idę na mecz", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "koniec lekcji", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "cisza w klasie", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "czas na kolację", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "to ciekawe", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "cieszę się", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "czekam na wakacje", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "nic nie szkodzi", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "kaczki na stawie", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "ciemna noc", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "latawiec nad domem", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "kino dla dzieci", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  // ── Sprosse 19 (+y) - Mehrzahl auf -y: Dünen, Kastanien, Muttertag ────────
  { text: "jemy lody", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "wydmy i mewy", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "kozy i owce", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "kasztany w kieszeni", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "motyle nad kwiatami", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "mam nowy zeszyt", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "kwiaty dla mamy", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "dym z komina", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "wszystko jasne", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "ty i ja", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "szyszki w lesie", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  // ── Sprosse 20 (+r) - „rz", „trzy": Meer, Seen, Winterferien ──────────────
  { text: "jedziemy nad morze", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "kajak na jeziorze", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "latarnia morska", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "krowa daje mleko", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "jadę rowerem", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "raz dwa trzy", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "wstaję rano", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "na drzewie siedzi sroka", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "teraz ja", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "wszyscy razem", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "ferie zimowe", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "kiermasz w szkole", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "czytam wiersz", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "kolorowe kredki", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "dwa razy dwa to cztery", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "skoki narciarskie", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "sernik dla dziadka", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "kisiel na deser", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  // ── Sprosse 21 (+p) - „proszę pani", Podhale, Rechtschreibung ─────────────
  { text: "pada deszcz", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "proszę pani", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "pies szczeka", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "oscypek to wędzony ser", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "pieczemy pierniki", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "pierwszy dzwonek", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "na koniec zdania stawiamy kropkę", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "piszę list", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "na przerwie jemy kanapki", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "kopalnia soli", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "spacer z psem", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "to prawda", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "placki ziemniaczane", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "proszę o ciszę", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "nie z czasownikami piszemy oddzielnie", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  // ── Sprosse 22 (+u) - die letzte vor ⇧: Feste, Tänze, Regionen, Sprache ───
  { text: "jutro mam urodziny", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "dawno dawno temu", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "sz cz i rz to dwuznaki", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "proszę dziękuję przepraszam", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "malujemy pisanki", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "pakuję plecak", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "szukamy krasnali", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "jeziora mazurskie", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "wycinanki kurpiowskie", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "polonez krakowiak mazur i kujawiak", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "w puszczy mieszka wilk", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "pani nauczycielka czyta wiersz", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "nasz pan od muzyki", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "zupa pomidorowa", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "latem jemy truskawki", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "w niedzielę rolada i kluski", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "uczymy się liter", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "ciocia i wujek", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "kutry w porcie", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "do jutra", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
  { text: "kurtka i czapka", kind: "satz", stufen: ["kids"], minTier: 2, nurWeg: "pl" },
];
