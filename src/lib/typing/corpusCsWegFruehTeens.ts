/**
 * Korpus nur für Lernweg "cs", frühe Sprossen 7-17 - Altersstufe Jugendliche (teens, CS-T2, 03.10.2026; Bauplan
 * `BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md` §4 Etappe T; Befund `BEFUND-2026-10-02-CS-T2-TEENS-FRUEH.md`).
 * Vorgehen wie der Pilot CS-T1 (`corpusCsWegFruehKids.ts`, Befund CS-T1 §6).
 *
 * Johannes' Regeln, wörtlich: „keine texte werden übersetzt, Texte aus den regionen, altersgemäß und zeitgemäß" und
 * „die texte sollen einen bezug zum land und sprache haben". ALLES NEU AUF TSCHECHISCH VERFASST - keine Text-Datei einer
 * anderen Sprache als Inhalt geöffnet, nichts übersetzt, kein Tatoeba-Satz (darum kein `herkunft`). Tatoeba (Tom und Mary
 * gestrichen) diente nur als WORTLISTE je Sprosse.
 *
 * ZEICHENSATZ wie CS-T1: `f j d k s l a ů | e m i n o t v ě u | ⇧` - EINE Folge für `cs` UND `cs-qwerty` (die beiden
 * tauschen nur `y`/`z`, beide nach ⇧); jede Zeile hat auf beiden dieselbe Sprosse (der Wächter rechnet beide).
 * `minTier` rechnet `minTierFor(text, "cs")` (0 bis Sprosse 8, 1 für 9-17), nicht die Hand.
 *
 * VOR ⇧: klein, ohne Satzzeichen, ohne Namen, ohne Frage. Es fehlen noch `í p c h á r z b y ž š ř č é ý` und die
 * Totasten-Buchstaben - für Jugendliche besonders hart: kein „hra/hraje" (Spiel, spielen), kein „sport", „kapela",
 * „koncert", „škola", „třída", „hokej", „florbal", „kamarád", „mám/chci/můžu". Darum kurze Zeilen: Wortgruppe
 * (`malinovka s ledem`) oder kleiner richtiger Satz (`vlak dneska nejede`); an 7-11 ehrlich wenig (Befund §2).
 *
 * Geschlecht (Glossar §1 Regel 2): kein „du" in der Vergangenheit, kein hartes Adjektiv für „du"; neutral sind die
 * 1. Person Präsens (`miluju metal`, `studuju latinu`), die Mehrzahl (`usnuli jsme u filmu`, `foukali jsme sklo`),
 * Befehle (`dej vědět`, `měj se fajn`) und das unveränderliche `fajn` (`jsi fajn`).
 *
 * JUGENDTHEMEN (11-16, natürlich, nicht belehrend): Sport (Kanu-Slalom, Tennis, Leichtathletik, Spielstand), Musik
 * (Festival, Metal, Melodie), Technik (online, Link, Video, Modellbau, Komet, Satellit), Freundschaft (dej vědět,
 * nikomu ani slovo, neviděli jsme se od května), Schule (Aufsatz, Latein, Test), Zug (sedadlo u okna, vlak ujel,
 * s kolem do vlaku), Zelten und Pfadfinder.
 *
 * BEZUG ZU LAND UND SPRACHE (Namen erst nach ⇧; die Zuordnung ist eigenes Wissen [G], vor dem Einschalten belegen):
 *  · Böhmen: foukali jsme sklo (Glasmacher, UNESCO-Liste in `recherche-tschechisch-2026-10-02/texte-quellen.md` §2),
 *    slalom na vodě · kanoe a slalom · kanoistka vede o sekundu (Kanu-Slalom, Wildwasserkanal in Prag-Troja [G]),
 *    stavět stan ve tmě · na festivalu stanujeme (Zelten der „vodáci" und der Sommerfestivals [G]), malinovka
 *    (Himbeerlimonade [G]).
 *  · Mähren und Schlesien: vlka jsme neviděli (die Wölfe sind in die Beskiden zurückgekehrt [G]).
 *  · Ganz Tschechien: v sokolovně je disko (die Sokol-Turnhalle steht in jeder Stadt [G]), skauti uklidili les
 *    (Junák, die tschechischen Pfadfinder [G]).
 *  · Die Sprache selbst: Redewendungen `tak jako tak`, `nikomu ani slovo`, `sem s kafem`, `jako ve filmu`,
 *    `měli jsme kliku`, und die hovorové Formen der Jugend (`dneska`, `miluju`, `studuju`, `děkuju`, `fajn`, `jsem mimo`).
 * Sperrliste `sperrlisteCs.ts`: kein Wort aus Kern ODER Wortbasis.
 *
 * Wächter: `tests/tastenflow-texte-cs-teens-frueh.test.ts` (Sprosse je Zeile AUSGERECHNET auf `cs` UND `cs-qwerty`,
 * Kleinschreibung, Wortgrenze 8, Sperrliste, Wortschatz mit Belegliste, Diakritik-Falle, keine Kopien/Paare/„fast gleich"
 * gegen die ROHE Sammelliste `corpusCs.ts`, alle Korpora, Serien und Prüfungsbanken). Nur anhängen - Korpus-Anker im
 * selben Commit (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 */
import type { CorpusItem } from "./corpus";

export const CORPUS_CS_WEG_FRUEH_TEENS: CorpusItem[] = [
  // ── Sprosse 7 (+a) - nur f j d k s l a: ein einzelnes Wort ──
  { text: "salsa", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "cs" },
  // ── Sprosse 8 (+ů) - mit dem einzigen Vokal „a" ──
  { text: "sklad kajaků", kind: "satz", stufen: ["teens"], minTier: 0, nurWeg: "cs" },
  // ── Sprosse 9 (+e) ──
  { text: "esej a kafe", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "ale jak", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 10 (+m) ──
  { text: "sem s kafem", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "můj kajak", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 11 (+i) ──
  { text: "dejme si kafe", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "dali jsme si film", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "esej mailem", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 12 (+n) ──
  { text: "dneska ne", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "nejsme sami", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "jinak fajn", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "dneska je mejdan", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "jsi fajn", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "nejde mi link", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 13 (+o) ──
  { text: "asi jo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "snad jo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "jsem online", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "jsem mimo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "model lodi", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "kanoe a slalom", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "do sedmi doma", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "koleno je ok", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 14 (+t) ──
  { text: "fakt jo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "je to jako sen", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "test je online", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "model letadla", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "jen moment", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "tak jako tak", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "můj talisman", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "medaile nad stolem", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 15 (+v) ──
  { text: "link na video", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "volala mamka", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "slova a melodie", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "vlakem na festival", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "malinovka s ledem", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "dneska volno", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "tvoje video je fajn", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "vlak dneska nejede", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 16 (+ě) - der erste Buchstabe der Zahlenreihe ──
  { text: "měj se fajn", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "dej vědět", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "no jasně", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "kometa je vidět", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "satelit nad městem", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "stavět stan ve tmě", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "vlka jsme neviděli", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "neviděli jsme se od května", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "slalom na vodě", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "v sokolovně je disko", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  // ── Sprosse 17 (+u) - die letzte vor ⇧: hier üben Jugendliche am längsten ──
  { text: "kanoistka vede o sekundu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "vedeme dva nula", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "miluju metal", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "studuju latinu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "usnuli jsme u filmu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "jako ve filmu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "sedadlo u okna", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "vlak ujel", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "s kolem do vlaku", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "detektivka na dovolenou", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "na festivalu stanujeme", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "foukali jsme sklo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "skauti uklidili les", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "vlakem kvůli klimatu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "v klidu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "mluvme o tom", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "nikomu ani slovo", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "jednou letět do kosmu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "v sedm u mostu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "nanuk a meloun", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "venku lije", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "atletika na stadionu", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "děkuju ti", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "sledujeme tenis online", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "můj sen je studovat", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
  { text: "měli jsme kliku", kind: "satz", stufen: ["teens"], minTier: 1, nurWeg: "cs" },
];
