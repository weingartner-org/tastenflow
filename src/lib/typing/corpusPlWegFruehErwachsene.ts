/**
 * Korpus nur für Lernweg "pl", frühe Sprossen 7-22 - Altersstufe ERWACHSENE (PL-T3,
 * 03.10.2026, Bauplan `BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md` Etappe T;
 * Befund `BEFUND-2026-10-02-PL-T3-ERWACHSENE-FRUEH.md`). Vorgehen nach dem Piloten
 * PL-T1 (`BEFUND-2026-10-02-PL-T1-KIDS-FRUEH.md` §6), Form nach dem italienischen
 * Zwilling IT-T3.
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß" und „die texte sollen einen bezug zum
 * land und sprache haben". ALLES NEU AUF POLNISCH VERFASST - keine Text-Datei
 * einer anderen Sprache als Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz
 * (darum kein `herkunft`). Tatoeba (Originalsätze) diente nur als WORTLISTE.
 *
 * ZEICHENSATZ wie PL-T1 (Tastatur `pl`, `introOrder("pl")`):
 *    7  + a  - der EINZIGE Vokal der Grundreihe
 *    8  + ;  - Fingeranker, kein Buchstabe: keine Zeile
 *    9-16  + w o n t e i m z
 *   17  + ę  - AltGr + e (Mac Option + e)
 *   18-22  + c y r p u   (danach ⇧)
 * `minTier` rechnet `minTierFor(text, "pl")`, nicht die Hand.
 *
 * VOR ⇧ NUR KLEINSCHRIFT (Regel D-2: Erwachsene bekommen vor der Umschalttaste
 * keine Grossbuchstaben, auch keine automatischen): keine Satzzeichen, keine
 * Namen, keine Frage. Es fehlen `ł b g h ż ą ś ć ó ń ź`: kein „był", kein „że",
 * kein „są", kein „urząd", kein „dowód", kein „zasiłek", kein „ch", keine
 * Vergangenheit (gegendert, fast immer mit `ł`) und kein Infinitiv auf `-ć`.
 * Darum Präsens, Imperativ oder Wortgruppen, und KEINE Zeile legt das
 * Geschlecht der Person fest, die tippt (kein „jestem zmęczony/zmęczona",
 * Adjektive nur an einem Nomen).
 *
 * ERWACHSENENWELT, sachlich, nie kindlich, nie belehrend: Arbeit (rozmowa
 * kwalifikacyjna, umowa o pracę, zwolnienie lekarskie, praca od zaraz),
 * Ämter und Formulare (imię i nazwisko, miejsce zamieszkania, adres do
 * korespondencji, znak sprawy, data i podpis), Wohnen und Geld (czynsz i
 * media, umowa najmu, stan konta, lokata, rata kredytu), Gesundheit nur als
 * Wortgruppe (lekarz rodzinny, skierowanie do specjalisty, trzy razy
 * dziennie), Migration (wniosek o wizę, pozwolenie na pracę, tęsknota za
 * domem), Briefe und Mails (szanowna pani, uprzejmie proszę o kontakt, z
 * wyrazami szacunku), wer neu tippen lernt (spacja między wyrazami, czytnik
 * ekranu, syntezator mowy, kurs komputerowy) - ohne Etikett.
 *
 * BEZUG ZU LAND UND SPRACHE, ohne Namen, über die Dinge: Podhale (jesienny
 * redyk), Podkarpacie und Podlasie (cerkwie i kapliczki), Śląsk (familoki i
 * kopalnie), Pomorze (strajk w stoczni), Mazury (rejs po jeziorze),
 * Wielkopolska (pyry), Kraków (zrywka, zapiekanka z pieczarkami), Łódź
 * (kamienica, dawna przędzalnia), das Dorf (wesele w remizie), Polen
 * allgemein (sklepy zamknięte w niedzielę, trzynasta emerytura, klient nasz
 * pan); die Sprache selbst (dialekt czy język, miejscownik i narzędnik,
 * ziemniaki kartofle i pyry, siatka czy zrywka, trudne dyktando).
 *
 * Sperrliste `sperrlistePl.ts` (Kern UND Wortbasis - darum auch kein
 * „kartacze"). Wächter: `tests/tastenflow-texte-pl-erwachsene-frueh.test.ts`.
 * Nur anhängen - Korpus-Anker im selben Commit
 * (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_PL_WEG_FRUEH_ERWACHSENE: CorpusItem[] = [
  // ── Sprosse 7 (nur f j d k s l a: eine Wortreihe) ────────────────────────────────────────────────
  { text: "kasa lada skala", kind: "satz", stufen: ["erwachsen"], minTier: 0, nurWeg: "pl" },
  // ── Sprosse 9 (+w (Sprosse 8 ist `;`, kein Buchstabe) - kawa, walka) ─────────────────────────────
  { text: "kawa jak kawa", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "walka klas", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 10 (+o) ──────────────────────────────────────────────────────────────────────────────
  { text: "dodaj awokado", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "woda sodowa", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 11 (+n) ──────────────────────────────────────────────────────────────────────────────
  { text: "wolna kasa", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "nowa wanna", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "okno na las", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "od dawna", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 12 (+t - Konto, Stawka, Lokata) ──────────────────────────────────────────────────────
  { text: "saldo konta", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "nowa data", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "taka stawka", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "notatka dla adwokata", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "atak na konto", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "lokata na dwa lata", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 13 (+e) ──────────────────────────────────────────────────────────────────────────────
  { text: "telefon do adwokata", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "lek na sen", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "dalej na lewo", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "toaleta na dole", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "dane kontaktowe", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "kwota netto", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "sala na wesele", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 14 (+i) ──────────────────────────────────────────────────────────────────────────────
  { text: "nowe stanowisko", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "kto to wie", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "olej do silnika", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "tani lot", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "na kilka dni", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "nowe osiedle", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "to inna kwestia", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 15 (+m) ──────────────────────────────────────────────────────────────────────────────
  { text: "minimalna stawka", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "mail do klienta", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "sam na sam", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "nie wiadomo", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "ma to sens", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 16 (+z (sz, dz)) ─────────────────────────────────────────────────────────────────────
  { text: "zmiana nazwiska", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "mam inne zdanie", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "moim zdaniem", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "dwa dni zdalnie", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "kawa z mlekiem", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "kieliszek wina", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "kontakt z nami", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  { text: "weekend za miastem", kind: "satz", stufen: ["erwachsen"], minTier: 1, nurWeg: "pl" },
  // ── Sprosse 17 (+ę (AltGr) - der erste polnische Buchstabe) ──────────────────────────────────────
  { text: "imię i nazwisko", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "wniosek o wizę", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "kaszlę od niedzieli", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "wezmę wolne", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "zostawię notatkę", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "tęsknota za domem", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "zastanawiam się", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "mam astmę", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  // ── Sprosse 18 (+c (cz, ci)) ─────────────────────────────────────────────────────────────────────
  { text: "kto da więcej", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "nocna zmiana", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "kolacja we dwoje", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "mocna kawa", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "miejsce zamieszkania", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "senne miasteczko", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "znam niemiecki", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "doceniam to", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "oszczędzam na mieszkanie", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "jestem na diecie", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  // ── Sprosse 19 (+y) ──────────────────────────────────────────────────────────────────────────────
  { text: "mieszkanie do wynajęcia", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "mieszkam w kamienicy", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "czynsz i media", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "dialekt czy język", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "winda jest nieczynna", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "kilka miesięcy", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "nowy szef", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "wysokie ceny", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "myję naczynia", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "wydaje mi się", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "taki zwyczaj", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "w tym sęk", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "wizyta domowa", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  // ── Sprosse 20 (+r (rz)) ─────────────────────────────────────────────────────────────────────────
  { text: "oddzwonię wieczorem", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "rozmowa kwalifikacyjna", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "kredyt na remont", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "lekarz rodzinny", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "rejestracja telefoniczna", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "wizyta kontrolna", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "wyniki w normie", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "wezwij karetkę", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "kaszel i katar", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "cena za metr", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "nowa kierowniczka", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "jesienny redyk", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "strajk w stoczni", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "wesele w remizie", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "wiek emerytalny", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "w drodze na lotnisko", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "siatka czy zrywka", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "lęk i stres", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "trzy razy dziennie", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "interes się kręci", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "na zdrowie", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "miejscownik i narzędnik", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "syntezator mowy", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "zwolnienie lekarskie", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "administracja osiedla", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "we wtorek mam wolne", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "rozmowa o awans", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  // ── Sprosse 21 (+p) ──────────────────────────────────────────────────────────────────────────────
  { text: "to jeszcze potrwa", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "cerkwie i kapliczki", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "rejs po jeziorze", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "zaraz po pracy", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "sklepy zamknięte w niedzielę", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "skierowanie do specjalisty", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "przerwa na kawę", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "spokojna dzielnica", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "decyzja pozytywna", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "apteka w okolicy", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "znajomi z pracy", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "klient nasz pan", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "ziemniaki kartofle i pyry", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "familoki i kopalnie", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "adres do korespondencji", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "zakaz palenia", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "opieka nad rodzicami", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "zapiekanka z pieczarkami", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "pozdrawiam serdecznie", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "szanowna pani", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "data i podpis", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "pozwolenie na pracę", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "recepta na leki", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "praca od zaraz", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "przypominam o terminie", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "przepraszam za zamieszanie", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "wypadek przy pracy", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "znak sprawy", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "spacja między wyrazami", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "dawna przędzalnia", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "darmowy wstęp", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  // ── Sprosse 22 (+u - die letzte Sprosse vor ⇧) ───────────────────────────────────────────────────
  { text: "dane do przelewu", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "pani w okienku", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "numer konta", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "dom do remontu", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "szef jest na urlopie", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "spotkajmy się jutro", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "uprzejmie proszę o kontakt", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "z wyrazami szacunku", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "pismo z urzędu", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "kopia dokumentu", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "zwrot podatku", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "zdjęcie do paszportu", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "trzynasta emerytura", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "umowa najmu", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "umowa na rok", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "umowa o pracę", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "wizyta u dentysty", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "trudne dyktando", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "piszę po polsku", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "drukarka nie drukuje", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "rata kredytu", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "kurs euro", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "czuję się lepiej", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "zupa dnia", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "zaczynamy punktualnie", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "studia zaoczne", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "szukam pracy", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "kolejka w urzędzie", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "czytnik ekranu", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "kurs komputerowy", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "faktura za wodę", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "stoję w korku", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "urlop wypoczynkowy", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "spotkanie przesunięte", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "dostawa do domu", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
  { text: "ulica zamknięta", kind: "satz", stufen: ["erwachsen"], minTier: 2, nurWeg: "pl" },
];
