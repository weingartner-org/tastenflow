/**
 * Korpus nur für Lernweg "cs", frühe Sprossen 7-17 - Altersstufe Kids (CS-T1,
 * 03.10.2026, Bauplan `BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md` §4
 * Etappe T; Befund `BEFUND-2026-10-02-CS-T1-KIDS-FRUEH.md`). Der PILOT der
 * neun tschechischen Text-Chargen: das Vorgehen steht im Befund §6.
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den
 * regionen, altersgemäß und zeitgemäß" und „die texte sollen einen bezug zum
 * land und sprache haben". ALLES NEU AUF TSCHECHISCH VERFASST - keine Text-Datei
 * einer anderen Sprache als Inhalt geöffnet (die italienische Charge IT-T1 nur
 * als Form), nichts übersetzt, kein Tatoeba-Satz (darum auch kein `herkunft`).
 * Tatoeba (Tom und Mary gestrichen) diente als WORTLISTE: welche Wortformen an
 * welcher Sprosse schreibbar und in Gebrauch sind.
 *
 * ZEICHENSATZ (`lernweg.ts` `CS_LETTER_ORDER`; „Sprosse" = Anzahl gelernter
 * Einheiten von `introOrder("cs")` - vor ⇧ dasselbe wie die Zahl der Buchstaben).
 * EINE Folge für `cs` (QWERTZ) UND `cs-qwerty`: die zwei Tastaturen tauschen nur
 * `y` und `z`, beide kommen erst nach ⇧ - jede Zeile hat auf beiden dieselbe
 * Sprosse (der Wächter rechnet beide).
 *   Sprosse  7 + a  - erste Wörter (sad, klas, kajak, skalka, sklad)
 *            8 + ů  - achte Heimtaste: sůl, důl, kůl
 *            9 + e    10 + m    11 + i    12 + n    13 + o    14 + t    15 + v
 *           16 + ě  - der erste Buchstabe der ZAHLENREIHE (Ring links, zwei Reihen hoch)
 *           17 + u  (danach ⇧)
 * `minTier` (0 bis Sprosse 8, 1 für 9-17) rechnet `minTierFor(text, "cs")`,
 * nicht die Hand.
 *
 * VOR ⇧ GIBT ES KEINE GROSSBUCHSTABEN UND KEINE SATZZEICHEN: jede Zeile ist klein,
 * ohne Punkt und Komma, darum keine Namen (Orte, Personen, Feste kommen nach ⇧)
 * und keine Frage. Es fehlen noch `í p c h á r z b y ž š ř č é ý` und die
 * Totasten (`ď ť ň ó`): kein „má", „mít", „je tady", „pes", „hrad", „škola",
 * „babička", kein „ch". Die tschechische Besonderheit (F4-Befund): neun Buchstaben
 * der Zahlenreihe tragen 13 % aller Buchstaben, 94 % aller Sätze brauchen einen -
 * vor ⇧ ist davon nur `ě` (Sprosse 16) da. Darum sind die Zeilen KURZ: eine kleine
 * Wortreihe (`sad a klas`) oder ein kleiner richtiger Satz (`jelen jde lesem`),
 * nie Wortsalat (Leitfaden Falle 26). An Sprosse 7 und 8 stehen einzelne Wörter -
 * mit `f j d k s l a (ů)` gibt es keinen Satz.
 *
 * Geschlecht (Glossar §1 Regel 2): keine Vergangenheit und kein hartes Adjektiv in
 * der 2. Person Einzahl; Befehle (`jdi sem`, `sedni si`, `dej mi med`) und die
 * Mehrzahl (`jedli jsme med`) sind neutral. Die 3. Person wechselt (`dal`, `jedl`,
 * `sedla`, `lekla se`, `datel odletěl`).
 *
 * BEZUG ZU LAND UND SPRACHE, soweit die Buchstaben es erlauben (Namen erst nach ⇧).
 * Keine Zeile behauptet eine Sachangabe; die Zuordnung zu Regionen hier ist
 * eigenes Wissen [G], ausser wo ein Beleg genannt ist
 * (`recherche-tschechisch-2026-10-02/texte-quellen.md`):
 *  · Böhmen: kulajda (Südböhmen), vdolek, stodola a seno, jedeme na vodu (die
 *    Flussfahrt der „vodáci"), v tůni je skokan (Polabí), sklo (Glasmacher,
 *    UNESCO-Liste dort §2), los a jelen, jedle (Šumava), jedeme lanovkou
 *    (Krkonoše, Jeseníky).
 *  · Mähren und Schlesien: dědina (mährisch für „Dorf", ÚJČ-Beleg dort §3.1),
 *    důl (Ostrava, Kladno), medvěd (Beskydy).
 *  · Bräuche und Kultur: jdeme na koledu (Ostern, Weihnachten), loutka v divadle
 *    (Puppenspiel, UNESCO 2016 - dort §2), sokol.
 *  · Die Sprache selbst: der Wechsel `o`/`ů` (dům a domek · stůl a stolek · most a
 *    můstek), ein Stamm in drei Formen (dům doma domů; dazu `od domu`/`u domu`
 *    gegen `jdeme domů`), slovo a věta, dvě slova, kleine Rechnungen (sedm a jedna
 *    je osm · devět a jedna je deset · jedna a jedna jsou dvě).
 * Sperrliste `sperrlisteCs.ts`: kein Wort aus Kern ODER Wortbasis.
 *
 * Wächter: `tests/tastenflow-texte-cs-kids-frueh.test.ts` (Sprosse je Zeile
 * AUSGERECHNET auf `cs` UND `cs-qwerty`, Kleinschreibung, Wortgrenze 8, Sperrliste,
 * Wortschatz mit Belegliste, Diakritik-Falle, keine Kopien/Paare, jede Einheit hat
 * an ihrer Sprosse eine Zeile). Nur anhängen - Korpus-Anker im selben Commit
 * (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_CS_WEG_FRUEH_KIDS: CorpusItem[] = [
  // ── Sprosse 7 (+a) - nur f j d k s l a: einzelne Wörter, eine Wortreihe ──
  { text: "sad a klas", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "cs" },
  { text: "kajak", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "cs" },
  { text: "skalka", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "cs" },
  { text: "sklad", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "cs" },
  // ── Sprosse 8 (+ů) - die achte Heimtaste, mit dem einzigen Vokal „a" ──
  { text: "sůl", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "cs" },
  { text: "důl", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "cs" },
  { text: "kůl", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "cs" },
  { text: "dal sůl", kind: "satz", stufen: ["kids"], minTier: 0, nurWeg: "cs" },
  // ── Sprosse 9 (+e) - je, se, les, led: die ersten kleinen Sätze ──
  { text: "je led", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jedle a les", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "dej sůl", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "sedla a jedla", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jede se", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "lekla se", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "led a sůl", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 10 (+m) ──
  { text: "můj dům", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jedeme lesem", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "sedm kajaků", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jedl med", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "sejdeme se", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "dům a sad", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "mamka jede", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "smůla", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 11 (+i) ──
  { text: "je klid", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jdi sem", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "fialka a lilie", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jedli jsme med", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "sedli si", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jeli jsme kajakem", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "dej mi med", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 12 (+n) ──
  { text: "maminka nese med", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jelen jde lesem", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "je leden", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "ani jeden", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "sedni si", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "nikam nejedeme", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jeden den", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "najdeme jelena", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "dnes jdeme na film", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 13 (+o) ──
  { text: "jedeme na kole", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jsem doma", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jdeme domů", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "sedm a jedna je osm", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "sokol nad domem", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "mlok a skokan", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "dej mi kakao", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "doma je miminko", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "nedaleko je kino", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "sklo je jako led", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "moje kolo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "nos a oko", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "dům a domek", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "los a jelen", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "dej mi jedno", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "dům doma domů", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 14 (+t) ──
  { text: "to je moje", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "stodola a seno", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "kostel a most", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jdeme na tenis", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "stůl a stolek", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "je mi sedm let", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "na stole je atlas", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "dnes je test", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "sem a tam", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "tak jo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "letadlo je daleko", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "matematika a atletika", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "dejte si kakao", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "teta jde do kina", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "stan a kajak", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "datel a sokol", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "to se stane", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "most a můstek", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 15 (+v) ──
  { text: "v lese je klid", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jedeme vlakem", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jdeme do divadla", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jedno slovo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "vdolek a kakao", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "v lese kvete konvalinka", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "sad kvete", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "vosa sedla na med", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "led je voda", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "dnes je oslava", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "kavka na stodole", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "v tůni je skokan", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "aktovka a atlas", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 16 (+ě) - der erste Buchstabe der Zahlenreihe ──
  { text: "v neděli jedeme k dědovi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "medvěd a med", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "dvě slova", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "slovo a věta", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "devět a jedna je deset", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "moje město", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "v okně je světlo", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "děda se směje", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "kotě a tele", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "volavka je ve vodě", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jde to skvěle", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "vůně lesa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "kos na větvi", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "v kině je tma", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "datel odletěl", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "dnes je neděle", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "děda nese seno", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "děda jde do lesa", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "dědina a kostel", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 17 (+u) - die letzte vor ⇧: hier üben Kinder am längsten ──
  { text: "jsou tu dva jeleni", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "děti jdou ven", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "venku je studeno", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jedeme na vodu", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jedna a jedna jsou dvě", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jdeme na koledu", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "loutka v divadle", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "doma jsme jedli kulajdu", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jdeme na louku", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "děkujeme", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "udělali jsme domek", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "louka kvete", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "koukej na sovu", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "malujeme medvěda", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jen deset minut", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "vlak jede tunelem", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jedeme lanovkou", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "dnes jsme uklidili", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "les je kousek od domu", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "jsme venku", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "auto a vlak", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "studna u domu", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
  { text: "kousek vdolku", kind: "satz", stufen: ["kids"], minTier: 1, nurWeg: "cs" },
];
