/**
 * ★★ Der Excel-Export der Leistungstabelle (12.09.2026, neu gestaltet 13.09.2026).
 *
 * Johannes, 12.09.2026: *„Ich brauche eine Exportmöglichkeit für die
 * Leistungstabelle, in Klassenname_datum.xlsx."* Entschieden: drei Zeiträume -
 * das laufende Schuljahr, Gesamt, diese Woche -, unabhängig davon, was oben im
 * Zeitraum-Kopf gerade gewählt ist.
 *
 * ★★★ 13.09.2026, Johannes: *„Soll auch wesentlich ansprechender designt
 * werden. Mit einem Startblatt, mit Links zu den drei Zeiträumen und unterhalb
 * einer Legende, in der die Spaltenüberschriften genau beschrieben sind: was
 * ist eine Leistungsstufe, wie wird ein Score berechnet … Das nächste Blatt ist
 * dann Schuljahr, dann Gesamt und dann erst Woche (Woche ist bei der Bewertung
 * die unwichtigste). Mach die Tabellen schön! Man soll sofort erkennen, dass
 * sie zu Tastenflow gehören. Tastenflow und das Logo gehören auch in die erste
 * Zeile."*
 *
 * Darum: Blätter „Übersicht", „Schuljahr", „Gesamt", „Woche" - seit K4
 * (19.09.2026) mit „Monat" vor „Woche", siehe {@link LEISTUNG_BLAETTER}.
 * Geschrieben mit exceljs (Farben, Links, Bild) über den gemeinsamen Baustein
 * `excelMarke.ts`.
 *
 * ── ⚠️ HIER WIRD NICHTS GERECHNET ──────────────────────────────────────────
 * Die Zahlen einer Zeile kommen aus `zeilenWerte` in `TastenflowReiter.tsx` -
 * derselben Rechnung, aus der die Tabelle auf dem Schirm ihre Texte baut
 * (`leistungsBlaetter` dort). Diese Datei ordnet sie nur zu Blättern: Titel,
 * Spaltenköpfe, Reihenfolge, Breiten, Aussehen. Zwei Stellen, die dasselbe
 * verschieden rechnen, laufen auseinander
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ── ⚠️ DIE LEGENDE SAGT, WAS DER SCHIRM SAGT ──────────────────────────────
 * Jede Erklärung kommt aus DERSELBEN Konstante wie der Hinweis am Spaltenkopf
 * in „Meine Klassen" (`leistungSpaltenTexte.ts`, `spaltenGrund`,
 * `wochenzielHilfe`, `HINWEIS_CHALLENGE`). Nur wo die Datei anders zählt als
 * der Schirm, steht EIN Zusatzsatz dahinter ({@link LEGENDE_ZUSATZ}).
 *
 * ── ⚠️ Zahlen als Zahlen, Striche als Striche ─────────────────────────────
 * Wo die Tabelle eine Zahl zeigt, steht in der Datei eine ZAHL - damit man in
 * Excel damit rechnen kann. „95 %" ist die Zahl 95 mit dem Format `0" %"`.
 * Wo sie einen Strich zeigt, steht ein Strich: Eine 0 sähe aus wie ein
 * gemessener Wert, und eine leere Zelle übersieht man
 * ([[feedback_nie_gegen_das_kind]]).
 *
 * ── ★★ EN6a (19.09.2026): EINE ENGLISCHE MAPPE, WENN DIE BEDIENUNG ENGLISCH IST
 * Dieselben Blätter, dieselben Zahlen, dieselbe Gestalt - nur Blattnamen,
 * Köpfe, Legende und Score-Erklärung englisch (Glossar §3.2/§3.8: *Overview*,
 * *School year*, *All time*, *Month*, *Week*; *Difficulty level*, *Keys
 * mastered*, *Practice time*, *Accuracy*, *Keystrokes per minute*,
 * *precision*, *speed factor*, *challenge score*). Die deutschen Konstanten
 * bleiben Zeichen für Zeichen; die englischen stehen daneben (`…_EN`), wie in
 * `score.ts` und `schreibprobe.ts`. Der Dateiname bleibt `3b_2026-09-19.xlsx`.
 * Welche Sprache gilt, trägt jedes Blatt selbst (`LeistungsBlatt.sprache`).
 */
import {
  FARBE,
  argb,
  dateiHerunterladen,
  datumDeutsch,
  datumIso,
  dateisystemName,
  flaeche,
  internerLink,
  klassenBezeichnung,
  linienRundum,
  mappeAlsBytes,
  neueMappe,
  schrift,
  setzeMarkenKopf,
  umbruchZeilen,
  zeilenHoehe,
  type Blatt,
  type Mappe,
} from "./excelMarke";
import {
  LEISTUNGSSTUFE_HILFE,
  TASTEN_HILFE,
  UEBEZEIT_HILFE,
  leistungSpaltenHilfen,
} from "./leistungSpaltenTexte";
import {
  PRUEFUNG_WORT,
  PRUEFUNG_WORT_EN,
  PRUEFUNG_WORT_FR,
  PRUEFUNG_WORT_ES,
  PRUEFUNG_WORT_MEHRZAHL,
  PRUEFUNG_WORT_MEHRZAHL_EN,
  PRUEFUNG_WORT_MEHRZAHL_FR,
  PRUEFUNG_WORT_MEHRZAHL_ES,
  PRUEFUNG_WORT_IT,
  PRUEFUNG_WORT_MEHRZAHL_IT,
  PRUEFUNG_WORT_PL,
  PRUEFUNG_WORT_MEHRZAHL_PL,
  PRUEFUNG_WORT_TR,
  PRUEFUNG_WORT_MEHRZAHL_TR,
  PRUEFUNG_WORT_CS,
  PRUEFUNG_WORT_MEHRZAHL_CS,
} from "./schreibprobe";
import {
  HINWEIS_CHALLENGE,
  HINWEIS_CHALLENGE_EN,
  HINWEIS_CHALLENGE_FR,
  HINWEIS_CHALLENGE_ES,
  HINWEIS_CHALLENGE_IT,
  HINWEIS_CHALLENGE_PL,
  HINWEIS_CHALLENGE_TR,
  HINWEIS_CHALLENGE_CS,
} from "./schreibprobeHinweise";
import { itPrepTag } from "./datum";
import { BEZUGSTEMPO, MIND_ZEICHEN_WERTUNG, fehlerGewicht, werte } from "./schreibprobeWertung";
import { spaltenGrund } from "./veraenderung";
import { wochenzielHilfe } from "./wochenzielZeitraum";
import { ZEITRAUM_START, type Zeitraum, type ZeitraumArt } from "./zeitraum";
import type { BedienSprache } from "@/lib/bedienSprache";
import { mehrzahl } from "@/lib/bedienSprache/texte";
import { mitRueckfallEn } from "./sprachRegister";

/** Was in einer Zelle ohne Wert steht - derselbe Strich wie auf dem Schirm. */
export const OHNE_WERT = "-";

export type Zelle = string | number;

/** Die Angaben EINER Zeile, fertig gerechnet. `null` = kein Wert. */
export interface LeistungsZeile {
  name: string;
  /** Die Leistungsstufe 1 bis 50. */
  stufe: number;
  tastenSitzen: number;
  tastenFrei: number;
  /** Übezeit in Minuten, eine Nachkommastelle (20 Sekunden sind 0,3, nicht 0). */
  uebezeitMinuten: number | null;
  /**
   * ★ W3a (18.09.2026): Minuten statt Einheiten. Nur im Blatt „Woche" -
   * `null` bei einer Woche ohne (gewähltes/erlassenes) Ziel, dann steht ein
   * Strich wie auf dem Schirm.
   */
  wochenzielMinuten: number | null;
  /** ★ W3a: davon geübte bzw. (bei einer vergangenen Woche, nach Nachholen) erfüllte Minuten. */
  wochenzielErledigtMinuten: number | null;
  /**
   * ★ W3a: Nur in „Schuljahr"/„Gesamt" - Anteil der Wochenaufgaben in Prozent
   * (0 bis 100), über alle ABGESCHLOSSENEN Ziel-Wochen des Blatts. `null`
   * ohne eine einzige.
   */
  wochenaufgabenProzent: number | null;
  /** Treffsicherheit in ganzen Prozent. */
  treffsicherheit: number | null;
  anschlaegeProMinute: number | null;
  score: number | null;
  /** Wie viele Tippchallenges - ohne eine einzige `null` (Schirm: „-"). */
  challenges: number | null;
  /** Leistungswert der Tippchallenges im Schnitt. */
  challengeSchnitt: number | null;
}

export type SpaltenSchluessel =
  | "name"
  | "stufe"
  | "tastenSitzen"
  | "tastenFrei"
  | "uebezeit"
  | "wochenzielMinuten"
  | "wochenzielErledigtMinuten"
  | "wochenaufgabenProzent"
  | "treffsicherheit"
  | "anschlaege"
  | "score"
  | "challenges"
  | "challengeSchnitt";

/**
 * Die Gruppen der ersten Kopfzeile - dieselben wie in der App (`TastenflowReiter`,
 * „B2, 11.09.2026"): Dort stehen „Person" und „Stand und Übezeit" nur für die
 * Sprachausgabe da, „Üben" und „Prüfung" sichtbar.
 */
export type SpaltenGruppe = "person" | "stand" | "ueben" | "pruefung";
export const GRUPPEN_NAME: Record<SpaltenGruppe, string> = {
  person: "Person",
  stand: "Stand und Übezeit",
  ueben: "Üben",
  pruefung: "Prüfung",
};

/** ★ EN6a: dieselben Gruppen englisch - wie die Gruppenzeile der Tabelle in der App. */
export const GRUPPEN_NAME_EN: Record<SpaltenGruppe, string> = {
  person: "Pupil",
  stand: "Progress and practice time",
  ueben: "Practice",
  pruefung: "Challenge",
};

/** ★ E11a-3: dieselben Gruppen französisch. */
export const GRUPPEN_NAME_FR: Record<SpaltenGruppe, string> = {
  person: "Élève",
  stand: "Progrès et temps d'exercice",
  ueben: "Exercice",
  pruefung: PRUEFUNG_WORT_FR,
};

/** ★ ES-O (27.09.2026): dieselben Gruppen spanisch. */
export const GRUPPEN_NAME_ES: Record<SpaltenGruppe, string> = {
  person: "Estudiante",
  stand: "Progreso y tiempo de práctica",
  ueben: "Práctica",
  pruefung: PRUEFUNG_WORT_ES,
};

/** ★ O-IT (02.10.2026): dieselben Gruppen italienisch (Glossar §2.6). */
export const GRUPPEN_NAME_IT: Record<SpaltenGruppe, string> = {
  person: "Persona",
  stand: "Progressi e tempo di esercizio",
  ueben: "Esercizio",
  pruefung: PRUEFUNG_WORT_IT,
};

/** ★ O-PL (02.10.2026): dieselben Gruppen polnisch (Glossar §2.6). */
export const GRUPPEN_NAME_PL: Record<SpaltenGruppe, string> = {
  person: "Osoba",
  stand: "Postępy i czas ćwiczeń",
  ueben: "Ćwiczenia",
  pruefung: PRUEFUNG_WORT_PL,
};

/** ★ O-TR (02.10.2026): dieselben Gruppen türkisch (Glossar §2.6). */
export const GRUPPEN_NAME_TR: Record<SpaltenGruppe, string> = {
  person: "Öğrenci",
  stand: "Durum ve çalışma süresi",
  ueben: "Alıştırma",
  pruefung: PRUEFUNG_WORT_TR,
};

/** ★ O-CS (03.10.2026): dieselben Gruppen tschechisch (Glossar §2.6). */
export const GRUPPEN_NAME_CS: Record<SpaltenGruppe, string> = {
  person: "Osoba",
  stand: "Pokrok a čas procvičování",
  ueben: "Cvičení",
  pruefung: PRUEFUNG_WORT_CS,
};

/** Die Sprache einer Mappe - dieselbe wie die der Bedienung. */
export type ExportSprache = BedienSprache;

/** Wie eine Zahl in der Zelle aussieht: `ganzzahl` 12, `minuten` 4,5, `prozent` 95 %. */
export type SpaltenFormat = "text" | "ganzzahl" | "minuten" | "prozent";
export const ZAHLENFORMAT: Record<SpaltenFormat, string | undefined> = {
  text: undefined,
  ganzzahl: "0",
  // Excel zeigt den Punkt je nach Sprache als Komma - „4,5" in Österreich.
  minuten: "0.0",
  // ⚠️ Der WERT bleibt 95 - nicht 0,95 mit Prozentformat. So rechnet, sortiert
  // und filtert man mit derselben Zahl, die auf dem Schirm steht.
  prozent: '0" %"',
};

/**
 * ★ EN6a: englisch ohne Leerzeichen vor dem Prozentzeichen („95%", Glossar
 * §1.2) - der WERT bleibt 95, nur die Anzeige folgt der Sprache.
 */
export const ZAHLENFORMAT_EN: Record<SpaltenFormat, string | undefined> = {
  ...ZAHLENFORMAT,
  prozent: '0"%"',
};

/**
 * ★ E11a-3: Französisch schreibt „95 %" mit Leerzeichen davor, wie Deutsch
 * (Glossar §9.1) - genau {@link ZAHLENFORMAT}, unter eigenem Namen für die
 * Sprach-Tabelle unten.
 */
export const ZAHLENFORMAT_FR: Record<SpaltenFormat, string | undefined> = ZAHLENFORMAT;

/** ★ ES-O (27.09.2026): Spanisch schreibt „95 %" mit Leerzeichen (RAE) - wie Deutsch. */
export const ZAHLENFORMAT_ES: Record<SpaltenFormat, string | undefined> = ZAHLENFORMAT;

/** ★ O-IT (02.10.2026): Italienisch „95%" ohne Leerzeichen (Glossar Regel 5). */
export const ZAHLENFORMAT_IT: Record<SpaltenFormat, string | undefined> = {
  ...ZAHLENFORMAT,
  prozent: '0"%"',
};

/** ★ O-PL (02.10.2026): Polnisch „95%" ohne Leerzeichen (Glossar Regel 5). */
export const ZAHLENFORMAT_PL: Record<SpaltenFormat, string | undefined> = {
  ...ZAHLENFORMAT,
  prozent: '0"%"',
};

/** ★ O-TR (02.10.2026): Türkisch "%95" - das Zeichen VOR der Zahl, ohne Leerzeichen (Glossar Regel 5). */
export const ZAHLENFORMAT_TR: Record<SpaltenFormat, string | undefined> = {
  ...ZAHLENFORMAT,
  prozent: '"%"0',
};

/**
 * ★ O-CS (03.10.2026): Tschechisch „95 %" mit GESCHÜTZTEM Leerzeichen U+00A0
 * (Glossar Regel 5) - in der Zelle steht so nie „95" am Zeilenende und „%"
 * auf der nächsten Zeile.
 */
export const ZAHLENFORMAT_CS: Record<SpaltenFormat, string | undefined> = {
  ...ZAHLENFORMAT,
  prozent: '0"\u00A0%"',
};

export interface LeistungsSpalte {
  schluessel: SpaltenSchluessel;
  kopf: string;
  gruppe: SpaltenGruppe;
  format: SpaltenFormat;
  /** Breite in Zeichen (Excel-Spaltenbreite). */
  breite: number;
}

export interface LeistungsBlatt {
  /** Name des Tabellenblatts: „Schuljahr", „Gesamt", „Monat", „Woche". */
  name: string;
  art: ZeitraumArt;
  /** Wie der Zeitraum heisst: „Schuljahr 2026/27", „Diese Woche, 07.09. bis 13.09.". */
  zeitraumTitel: string;
  /** „Klasse 3b - Schuljahr 2026/27". */
  titel: string;
  /** „Erstellt am 13.09.2026". */
  erstellt: string;
  spalten: LeistungsSpalte[];
  /** Ein Kind je Zeile, alphabetisch - in der Reihenfolge von {@link spalten}. */
  daten: Zelle[][];
  /** Breite je Spalte in Zeichen (= `spalten[i].breite`). */
  spaltenbreiten: number[];
  /**
   * ★ EN6a (19.09.2026): in welcher Sprache das Blatt geschrieben ist -
   * `undefined` heisst Deutsch (so bleiben ältere Aufrufer gültig).
   */
  sprache?: ExportSprache;
}

/** Das erste Blatt der Datei. */
export const UEBERSICHT_BLATT = "Übersicht";
/** ★ EN6a: das erste Blatt der englischen Mappe. */
export const UEBERSICHT_BLATT_EN = "Overview";
/** ★ E11a-3: das erste Blatt der französischen Mappe. */
export const UEBERSICHT_BLATT_FR = "Aperçu";
/** ★ ES-O: das erste Blatt der spanischen Mappe. */
export const UEBERSICHT_BLATT_ES = "Resumen";
/** ★ O-IT: das erste Blatt der italienischen Mappe. */
export const UEBERSICHT_BLATT_IT = "Panoramica";
/** ★ O-PL: das erste Blatt der polnischen Mappe. */
export const UEBERSICHT_BLATT_PL = "Przegląd";
/** ★ O-TR: das erste Blatt der türkischen Mappe. */
export const UEBERSICHT_BLATT_TR = "Genel bakış";
/** ★ O-CS: das erste Blatt der tschechischen Mappe. */
export const UEBERSICHT_BLATT_CS = "Přehled";

/**
 * ★ Die vier Datenblätter - in DIESER Reihenfolge (Johannes 13.09.2026: „dann
 * Schuljahr, dann Gesamt und dann erst Woche"; „Monat" kam am 19.09.2026 dazu
 * - Johannes: „das Monat ist ein wichtiger Wert" - direkt VOR „Woche", die
 * seit K4 die unwichtigste Vergleichszahl ist). `ZEITRAUM_START` ist die
 * laufende Woche; Schuljahr, Gesamt und Monat entstehen daraus mit Versatz 0 -
 * also immer das LAUFENDE Schuljahr bzw. die letzten 4 Wochen, nie ein
 * weggeblättertes.
 */
export const LEISTUNG_BLAETTER: readonly {
  name: string;
  /** ★ EN6a: der Name des Blattes in der englischen Mappe (Glossar §3.2). */
  nameEn: string;
  /**
   * ★ E11a-5 (26.09.2026): der Name des Blattes in der französischen Mappe -
   * bis dahin trugen die vier Datenblätter dort die DEUTSCHEN Namen
   * (`TastenflowReiter.leistungsBlaetter` prüfte nur „en", Falle 30).
   */
  nameFr: string;
  /** ★ ES-O (27.09.2026): der Name des Blattes in der spanischen Mappe. */
  nameEs: string;
  /** ★ O-IT (02.10.2026): der Name des Blattes in der italienischen Mappe. */
  nameIt: string;
  /** ★ O-PL (02.10.2026): der Name des Blattes in der polnischen Mappe. */
  namePl: string;
  /** ★ O-TR (02.10.2026): der Name des Blattes in der türkischen Mappe. */
  nameTr: string;
  /** ★ O-CS (03.10.2026): der Name des Blattes in der tschechischen Mappe. */
  nameCs: string;
  zeitraum: Zeitraum;
}[] = [
  {
    name: "Schuljahr",
    nameEn: "School year",
    nameFr: "Année scolaire",
    nameEs: "Curso escolar",
    nameIt: "Anno scolastico",
    namePl: "Rok szkolny",
    nameTr: "Öğretim yılı",
    nameCs: "Školní rok",
    zeitraum: { ...ZEITRAUM_START, art: "schuljahr" },
  },
  {
    name: "Gesamt",
    nameEn: "All time",
    nameFr: "Tout",
    nameEs: "Total",
    nameIt: "Dall'inizio",
    namePl: "Od początku",
    nameTr: "Başından beri",
    nameCs: "Od začátku",
    zeitraum: { ...ZEITRAUM_START, art: "gesamt" },
  },
  {
    name: "Monat",
    nameEn: "Month",
    nameFr: "Mois",
    nameEs: "Mes",
    nameIt: "Mese",
    namePl: "Miesiąc",
    nameTr: "Ay",
    nameCs: "Měsíc",
    zeitraum: { ...ZEITRAUM_START, art: "monat", monatVersatz: 0 },
  },
  {
    name: "Woche",
    nameEn: "Week",
    nameFr: "Semaine",
    nameEs: "Semana",
    nameIt: "Settimana",
    namePl: "Tydzień",
    nameTr: "Hafta",
    nameCs: "Týden",
    zeitraum: ZEITRAUM_START,
  },
];

/** Was ein Datenblatt umfasst - der Satz neben seinem Link auf der Übersicht. */
export const ZEITRAUM_SATZ: Record<ZeitraumArt, string> = {
  schuljahr: "Alles, was im laufenden Schuljahr geübt wurde.",
  gesamt: "Alles, was je geübt wurde - seit es das Konto des Kindes gibt.",
  // ★ K4 (19.09.2026): „Monat" = die letzten 4 Wochen, nicht der Kalendermonat.
  monat: "Alles, was in den letzten 4 Wochen geübt wurde.",
  woche: "Nur die laufende Woche - der Stand von gerade eben.",
};

/** ★ EN6a: dieselben Sätze englisch. */
export const ZEITRAUM_SATZ_EN: Record<ZeitraumArt, string> = {
  schuljahr: "Everything practised in the current school year.",
  gesamt: "Everything ever practised - since the pupil's account was created.",
  monat: "Everything practised in the last 4 weeks.",
  woche: "Only the current week - how things stand right now.",
};

/** ★ E11a-3: dieselben Sätze französisch. */
export const ZEITRAUM_SATZ_FR: Record<ZeitraumArt, string> = {
  schuljahr: "Tout ce qui a été exercé pendant l'année scolaire en cours.",
  gesamt: "Tout ce qui a jamais été exercé - depuis la création du compte de l'élève.",
  monat: "Tout ce qui a été exercé au cours des 4 dernières semaines.",
  woche: "Seulement la semaine en cours - l'état actuel.",
};

/** ★ ES-O (27.09.2026): dieselben Sätze spanisch. */
export const ZEITRAUM_SATZ_ES: Record<ZeitraumArt, string> = {
  schuljahr: "Todo lo que se ha practicado en el curso escolar actual.",
  gesamt: "Todo lo que se ha practicado alguna vez - desde que existe la cuenta de la persona.",
  monat: "Todo lo que se ha practicado en las últimas 4 semanas.",
  woche: "Solo la semana en curso - cómo están las cosas ahora mismo.",
};

/** ★ O-IT (02.10.2026): dieselben Sätze italienisch. */
export const ZEITRAUM_SATZ_IT: Record<ZeitraumArt, string> = {
  schuljahr: "Tutti gli esercizi dell'anno scolastico in corso.",
  gesamt: "Tutti gli esercizi di sempre - da quando esiste l'account della persona.",
  monat: "Tutti gli esercizi delle ultime 4 settimane.",
  woche: "Solo la settimana in corso - la situazione di adesso.",
};

/** ★ O-PL (02.10.2026): dieselben Sätze polnisch, unpersönlich (-no-Form). */
export const ZEITRAUM_SATZ_PL: Record<ZeitraumArt, string> = {
  schuljahr: "Wszystko, co ćwiczono w bieżącym roku szkolnym.",
  gesamt: "Wszystko, co kiedykolwiek ćwiczono - od założenia konta.",
  monat: "Wszystko, co ćwiczono w ostatnich 4 tygodniach.",
  woche: "Tylko bieżący tydzień - stan na teraz.",
};

/** ★ O-TR (02.10.2026): dieselben Sätze türkisch, unpersönlich. */
export const ZEITRAUM_SATZ_TR: Record<ZeitraumArt, string> = {
  schuljahr: "Bu öğretim yılında yapılan tüm alıştırmalar.",
  gesamt: "Bugüne kadar yapılan tüm alıştırmalar - öğrencinin hesabı açıldığından beri.",
  monat: "Son 4 haftada yapılan tüm alıştırmalar.",
  woche: "Yalnızca bu hafta - şu anki durum.",
};

/** ★ O-CS (03.10.2026): dieselben Sätze tschechisch, unpersönlich („se"-Sätze). */
export const ZEITRAUM_SATZ_CS: Record<ZeitraumArt, string> = {
  schuljahr: "Vše, co se cvičilo v aktuálním školním roce.",
  gesamt: "Vše, co se kdy cvičilo - od založení účtu.",
  monat: "Vše, co se cvičilo v posledních 4 týdnech.",
  woche: "Jen aktuální týden - stav právě teď.",
};

/**
 * `3a_2026-09-12.xlsx`. Datum ISO-geschrieben und in Ortszeit, Klassenname
 * dateisystemtauglich (Begründungen in `excelMarke.ts`).
 */
export function leistungDateiname(
  klassenname: string | null | undefined,
  jetztMs: number,
): string {
  return `${dateisystemName(klassenname)}_${datumIso(jetztMs)}.xlsx`;
}

/**
 * „Klasse 3a - Diese Woche, 08.09. bis 14.09." - die Überschrift eines Blattes.
 * ⚠️ Heisst die Klasse schon „Klasse 3a", steht das Wort nicht zweimal da.
 */
export function leistungTitel(
  klassenname: string | null | undefined,
  zeitraumTitel: string,
  /** ★ EN6a: „Class 3b - …" in der englischen Mappe; ohne Angabe Deutsch. */
  sprache: ExportSprache = "de",
): string {
  return `${klassenBezeichnung(klassenname, sprache)} - ${zeitraumTitel}`;
}

/** ★ W3a: die Köpfe der Wochenziel-Spalten - Minuten je Woche, Prozent bei Schuljahr/Gesamt. */
export const WOCHENZIEL_KOPF_MINUTEN = "Wochenziel (Min.)";
export const WOCHENZIEL_KOPF_ERLEDIGT = "davon erledigt (Min.)";
export const WOCHENAUFGABEN_KOPF_PROZENT = "Wochenaufgaben erledigt (%)";

/** Der Kopf der Spalte „Leistungswert im Schnitt" der Tippchallenges. */
export const KOPF_CHALLENGE_SCHNITT = `${PRUEFUNG_WORT} Leistungswert (Schnitt)`;

/**
 * ★★ EN6a (19.09.2026): ALLE SPALTENKÖPFE der englischen Mappe (Glossar
 * §3.2: Leistungsstufe ⇒ *difficulty level*, Tasten sitzen ⇒ *mastered*,
 * Leistungswert ⇒ *challenge score*, Wochenaufgaben ⇒ *weekly goals*).
 */
export const WOCHENZIEL_KOPF_MINUTEN_EN = "Weekly goal (min)";
export const WOCHENZIEL_KOPF_ERLEDIGT_EN = "Done (min)";
export const WOCHENAUFGABEN_KOPF_PROZENT_EN = "Weekly goals done (%)";
export const KOPF_CHALLENGE_SCHNITT_EN = "Average challenge score";

/**
 * ★ E11a-3 (26.09.2026): dieselben Spaltenköpfe französisch (Glossar §9.2:
 * Leistungsstufe ⇒ niveau de difficulté, Tasten sitzen ⇒ acquises, Défi
 * statt Prüfung).
 */
export const WOCHENZIEL_KOPF_MINUTEN_FR = "Objectif de la semaine (min)";
export const WOCHENZIEL_KOPF_ERLEDIGT_FR = "Fait (min)";
export const WOCHENAUFGABEN_KOPF_PROZENT_FR = "Objectifs de la semaine atteints (%)";
export const KOPF_CHALLENGE_SCHNITT_FR = `Score moyen du ${PRUEFUNG_WORT_FR}`;

/** ★ ES-O (27.09.2026): dieselben Spaltenköpfe spanisch. */
export const WOCHENZIEL_KOPF_MINUTEN_ES = "Objetivo semanal (min)";
export const WOCHENZIEL_KOPF_ERLEDIGT_ES = "Hecho (min)";
export const WOCHENAUFGABEN_KOPF_PROZENT_ES = "Objetivos semanales alcanzados (%)";
export const KOPF_CHALLENGE_SCHNITT_ES = `Puntuación media del ${PRUEFUNG_WORT_ES}`;

/** ★ O-IT (02.10.2026): dieselben Spaltenköpfe italienisch (Glossar §2.6). */
export const WOCHENZIEL_KOPF_MINUTEN_IT = "Obiettivo settimanale (min)";
export const WOCHENZIEL_KOPF_ERLEDIGT_IT = "Fatto (min)";
export const WOCHENAUFGABEN_KOPF_PROZENT_IT = "Obiettivi settimanali raggiunti (%)";
export const KOPF_CHALLENGE_SCHNITT_IT = `Punteggio medio della ${PRUEFUNG_WORT_IT}`;

/** ★ O-PL (02.10.2026): dieselben Spaltenköpfe polnisch (Glossar §2.2/§2.6). */
export const WOCHENZIEL_KOPF_MINUTEN_PL = "Cel tygodniowy (min)";
export const WOCHENZIEL_KOPF_ERLEDIGT_PL = "Wykonano (min)";
export const WOCHENAUFGABEN_KOPF_PROZENT_PL = "Osiągnięte cele tygodniowe (%)";
export const KOPF_CHALLENGE_SCHNITT_PL = `${PRUEFUNG_WORT_MEHRZAHL_PL} - średni wynik`;

/** ★ O-TR (02.10.2026): dieselben Spaltenköpfe türkisch (Glossar §2.2/§2.6/§2.10: "dk."). */
export const WOCHENZIEL_KOPF_MINUTEN_TR = "Haftalık hedef (dk.)";
export const WOCHENZIEL_KOPF_ERLEDIGT_TR = "Tamamlanan (dk.)";
export const WOCHENAUFGABEN_KOPF_PROZENT_TR = "Ulaşılan haftalık hedefler (%)";
export const KOPF_CHALLENGE_SCHNITT_TR = "Ortalama yarışma puanı";

/** ★ O-CS (03.10.2026): dieselben Spaltenköpfe tschechisch (Glossar §2.2/§2.6, „min"). */
export const WOCHENZIEL_KOPF_MINUTEN_CS = "Týdenní cíl (min)";
export const WOCHENZIEL_KOPF_ERLEDIGT_CS = "Splněno (min)";
export const WOCHENAUFGABEN_KOPF_PROZENT_CS = "Splněné týdenní cíle (%)";
export const KOPF_CHALLENGE_SCHNITT_CS = `${PRUEFUNG_WORT_MEHRZAHL_CS} - průměrné skóre`;

/** Die Köpfe je Sprache - Deutsch genau die Wörter von vorher. */
const KOEPFE_EN: Record<SpaltenSchluessel, string> = {
  name: "Name",
  stufe: "Difficulty level (1-50)",
  tastenSitzen: "Keys mastered",
  tastenFrei: "Keys unlocked",
  uebezeit: "Practice time (minutes)",
  wochenzielMinuten: WOCHENZIEL_KOPF_MINUTEN_EN,
  wochenzielErledigtMinuten: WOCHENZIEL_KOPF_ERLEDIGT_EN,
  wochenaufgabenProzent: WOCHENAUFGABEN_KOPF_PROZENT_EN,
  treffsicherheit: "Accuracy (%)",
  anschlaege: "Keystrokes per minute",
  score: "Score",
  challenges: PRUEFUNG_WORT_MEHRZAHL_EN,
  challengeSchnitt: KOPF_CHALLENGE_SCHNITT_EN,
};

const KOEPFE: Record<ExportSprache, Record<SpaltenSchluessel, string>> = {
  // ★ ES-O (27.09.2026): spanisch (bis dahin die englischen Köpfe).
  es: {
    name: "Nombre",
    stufe: "Nivel (1-50)",
    tastenSitzen: "Teclas aprendidas",
    tastenFrei: "Teclas desbloqueadas",
    uebezeit: "Tiempo de práctica (minutos)",
    wochenzielMinuten: WOCHENZIEL_KOPF_MINUTEN_ES,
    wochenzielErledigtMinuten: WOCHENZIEL_KOPF_ERLEDIGT_ES,
    wochenaufgabenProzent: WOCHENAUFGABEN_KOPF_PROZENT_ES,
    treffsicherheit: "Precisión (%)",
    anschlaege: "Pulsaciones por minuto",
    score: "Puntuación",
    challenges: PRUEFUNG_WORT_MEHRZAHL_ES,
    challengeSchnitt: KOPF_CHALLENGE_SCHNITT_ES,
  },
  de: {
    name: "Name",
    stufe: "Leistungsstufe (1-50)",
    tastenSitzen: "Tasten sitzen",
    tastenFrei: "Tasten freigeschaltet",
    uebezeit: "Übezeit (Minuten)",
    wochenzielMinuten: WOCHENZIEL_KOPF_MINUTEN,
    wochenzielErledigtMinuten: WOCHENZIEL_KOPF_ERLEDIGT,
    wochenaufgabenProzent: WOCHENAUFGABEN_KOPF_PROZENT,
    treffsicherheit: "Treffsicherheit (%)",
    anschlaege: "Anschläge pro Minute",
    score: "Score",
    challenges: PRUEFUNG_WORT_MEHRZAHL,
    challengeSchnitt: KOPF_CHALLENGE_SCHNITT,
  },
  en: KOEPFE_EN,
  fr: {
    name: "Nom",
    // ★ E11a-5 (Feinschliff-Liste): die Leistungsstufe ist das erreichte
    // Niveau, keine Schwierigkeit - wie die Spalte in "Mes classes".
    stufe: "Niveau (1-50)",
    tastenSitzen: "Touches acquises",
    tastenFrei: "Touches débloquées",
    uebezeit: "Temps d'exercice (minutes)",
    wochenzielMinuten: WOCHENZIEL_KOPF_MINUTEN_FR,
    wochenzielErledigtMinuten: WOCHENZIEL_KOPF_ERLEDIGT_FR,
    wochenaufgabenProzent: WOCHENAUFGABEN_KOPF_PROZENT_FR,
    treffsicherheit: "Précision (%)",
    anschlaege: "Frappes par minute",
    score: "Score",
    challenges: PRUEFUNG_WORT_MEHRZAHL_FR,
    challengeSchnitt: KOPF_CHALLENGE_SCHNITT_FR,
  },
  // ★ O-IT (02.10.2026): italienisch - „livello di difficoltà", „tasti sicuri",
  // „battute al minuto" (Glossar §2.2, Regel 6).
  it: {
    name: "Nome",
    stufe: "Livello di difficoltà (1-50)",
    tastenSitzen: "Tasti sicuri",
    tastenFrei: "Tasti sbloccati",
    uebezeit: "Tempo di esercizio (minuti)",
    wochenzielMinuten: WOCHENZIEL_KOPF_MINUTEN_IT,
    wochenzielErledigtMinuten: WOCHENZIEL_KOPF_ERLEDIGT_IT,
    wochenaufgabenProzent: WOCHENAUFGABEN_KOPF_PROZENT_IT,
    treffsicherheit: "Precisione (%)",
    anschlaege: "Battute al minuto",
    score: "Punteggio",
    challenges: PRUEFUNG_WORT_MEHRZAHL_IT,
    challengeSchnitt: KOPF_CHALLENGE_SCHNITT_IT,
  },
  // ★ O-PL (02.10.2026): polnisch - „poziom trudności", „opanowane klawisze",
  // „uderzenia na minutę" (Glossar §2.2, Regel 7).
  pl: {
    name: "Imię",
    stufe: "Poziom trudności (1-50)",
    tastenSitzen: "Opanowane klawisze",
    tastenFrei: "Odblokowane klawisze",
    uebezeit: "Czas ćwiczeń (minuty)",
    wochenzielMinuten: WOCHENZIEL_KOPF_MINUTEN_PL,
    wochenzielErledigtMinuten: WOCHENZIEL_KOPF_ERLEDIGT_PL,
    wochenaufgabenProzent: WOCHENAUFGABEN_KOPF_PROZENT_PL,
    treffsicherheit: "Dokładność (%)",
    anschlaege: "Uderzenia na minutę",
    score: "Wynik",
    challenges: PRUEFUNG_WORT_MEHRZAHL_PL,
    challengeSchnitt: KOPF_CHALLENGE_SCHNITT_PL,
  },
  // ★ O-TR (02.10.2026): türkisch - "zorluk seviyesi", "oturmuş tuşlar",
  // "dakikada vuruş" (Glossar §2.2).
  tr: {
    name: "Ad",
    stufe: "Zorluk seviyesi (1-50)",
    tastenSitzen: "Oturmuş tuşlar",
    tastenFrei: "Kilidi açılmış tuşlar",
    uebezeit: "Çalışma süresi (dakika)",
    wochenzielMinuten: WOCHENZIEL_KOPF_MINUTEN_TR,
    wochenzielErledigtMinuten: WOCHENZIEL_KOPF_ERLEDIGT_TR,
    wochenaufgabenProzent: WOCHENAUFGABEN_KOPF_PROZENT_TR,
    treffsicherheit: "Doğruluk (%)",
    anschlaege: "Dakikada vuruş",
    score: "Puan",
    challenges: PRUEFUNG_WORT_MEHRZAHL_TR,
    challengeSchnitt: KOPF_CHALLENGE_SCHNITT_TR,
  },
  // ★ O-CS (03.10.2026): tschechisch - „úroveň obtížnosti", „jisté klávesy",
  // „úhozy za minutu" (Glossar §2.2).
  cs: {
    name: "Jméno",
    stufe: "Úroveň obtížnosti (1-50)",
    tastenSitzen: "Jisté klávesy",
    tastenFrei: "Odemčené klávesy",
    uebezeit: "Čas procvičování (minuty)",
    wochenzielMinuten: WOCHENZIEL_KOPF_MINUTEN_CS,
    wochenzielErledigtMinuten: WOCHENZIEL_KOPF_ERLEDIGT_CS,
    wochenaufgabenProzent: WOCHENAUFGABEN_KOPF_PROZENT_CS,
    treffsicherheit: "Přesnost (%)",
    anschlaege: "Úhozy za minutu",
    score: "Skóre",
    challenges: PRUEFUNG_WORT_MEHRZAHL_CS,
    challengeSchnitt: KOPF_CHALLENGE_SCHNITT_CS,
  },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    name: "Име",
    stufe: "Ниво на трудност (1-50)",
    tastenSitzen: "Сигурни клавиши",
    tastenFrei: "Отключени клавиши",
    uebezeit: "Време за упражнения (минути)",
    wochenzielMinuten: "Седмична цел (мин.)",
    wochenzielErledigtMinuten: "Изпълнено (мин.)",
    wochenaufgabenProzent: "Изпълнени седмични цели (%)",
    treffsicherheit: "Точност (%)",
    anschlaege: "Знака в минута",
    score: "Резултат",
    challenges: "Предизвикателства",
    challengeSchnitt: "Предизвикателства - среден резултат",
  },
  el: {
    name: "Όνομα",
    stufe: "Επίπεδο δυσκολίας (1-50)",
    tastenSitzen: "Σίγουρα πλήκτρα",
    tastenFrei: "Ξεκλείδωτα πλήκτρα",
    uebezeit: "Χρόνος εξάσκησης (λεπτά)",
    wochenzielMinuten: "Εβδομαδιαίος στόχος (λεπτά)",
    wochenzielErledigtMinuten: "Ολοκληρώθηκαν (λεπτά)",
    wochenaufgabenProzent: "Εβδομαδιαίοι στόχοι που επιτεύχθηκαν (%)",
    treffsicherheit: "Ακρίβεια (%)",
    anschlaege: "Πατήματα ανά λεπτό",
    score: "Σκορ",
    challenges: "Προκλήσεις",
    challengeSchnitt: "Προκλήσεις - μέσο σκορ",
  },
  hu: {
    name: "Név",
    stufe: "Nehézségi szint (1-50)",
    tastenSitzen: "Biztos billentyűk",
    tastenFrei: "Feloldott billentyűk",
    uebezeit: "Gyakorlási idő (perc)",
    wochenzielMinuten: "Heti cél (perc)",
    wochenzielErledigtMinuten: "Teljesítve (perc)",
    wochenaufgabenProzent: "Teljesített heti célok (%)",
    treffsicherheit: "Pontosság (%)",
    anschlaege: "Leütés/perc",
    score: "Pontszám",
    challenges: "Kihívások",
    challengeSchnitt: "Kihívások - átlagos pontszám",
  },
  nl: {
    name: "Naam",
    stufe: "Moeilijkheidsniveau (1-50)",
    tastenSitzen: "Zekere toetsen",
    tastenFrei: "Vrijgespeelde toetsen",
    uebezeit: "Oefentijd (minuten)",
    wochenzielMinuten: "Weekdoel (min)",
    wochenzielErledigtMinuten: "Gedaan (min)",
    wochenaufgabenProzent: "Behaalde weekdoelen (%)",
    treffsicherheit: "Nauwkeurigheid (%)",
    anschlaege: "Aanslagen per minuut",
    score: "Score",
    challenges: "Uitdagingen",
    challengeSchnitt: "Uitdagingen - gemiddelde score",
  },
  pt: {
    name: "Nome",
    stufe: "Nível de dificuldade (1-50)",
    tastenSitzen: "Teclas dominadas",
    tastenFrei: "Teclas desbloqueadas",
    uebezeit: "Tempo de prática (minutos)",
    wochenzielMinuten: "Objetivo semanal (min)",
    wochenzielErledigtMinuten: "Cumprido (min)",
    wochenaufgabenProzent: "Objetivos semanais cumpridos (%)",
    treffsicherheit: "Precisão (%)",
    anschlaege: "Toques por minuto",
    score: "Pontuação",
    challenges: "Desafios",
    challengeSchnitt: "Desafios - pontuação média",
  },
  br: {
    name: "Nome",
    stufe: "Nível de dificuldade (1-50)",
    tastenSitzen: "Teclas seguras",
    tastenFrei: "Teclas desbloqueadas",
    uebezeit: "Tempo de prática (minutos)",
    wochenzielMinuten: "Meta semanal (min)",
    wochenzielErledigtMinuten: "Cumprido (min)",
    wochenaufgabenProzent: "Metas semanais cumpridas (%)",
    treffsicherheit: "Precisão (%)",
    anschlaege: "Toques por minuto",
    score: "Pontuação",
    challenges: "Desafios",
    challengeSchnitt: "Desafios - pontuação média",
  },
  ro: {
    name: "Nume",
    stufe: "Nivel de dificultate (1-50)",
    tastenSitzen: "Taste sigure",
    tastenFrei: "Taste deblocate",
    uebezeit: "Timp de exersare (minute)",
    wochenzielMinuten: "Obiectiv săptămânal (min)",
    wochenzielErledigtMinuten: "Realizat (min)",
    wochenaufgabenProzent: "Obiective săptămânale realizate (%)",
    treffsicherheit: "Precizie (%)",
    anschlaege: "Caractere pe minut",
    score: "Scor",
    challenges: "Provocări",
    challengeSchnitt: "Provocări - scor mediu",
  },
  sv: {
    name: "Namn",
    stufe: "Svårighetsnivå (1-50)",
    tastenSitzen: "Säkra tangenter",
    tastenFrei: "Upplåsta tangenter",
    uebezeit: "Övningstid (minuter)",
    wochenzielMinuten: "Veckomål (min)",
    wochenzielErledigtMinuten: "Klart (min)",
    wochenaufgabenProzent: "Uppnådda veckomål (%)",
    treffsicherheit: "Träffsäkerhet (%)",
    anschlaege: "Anslag per minut",
    score: "Poäng",
    challenges: "Utmaningar",
    challengeSchnitt: "Utmaningar - genomsnittlig poäng",
  },
  uk: {
    name: "Ім'я",
    stufe: "Рівень складності (1-50)",
    tastenSitzen: "Впевнені клавіші",
    tastenFrei: "Відкриті клавіші",
    uebezeit: "Час тренування (хвилини)",
    wochenzielMinuten: "Тижнева мета (хв)",
    wochenzielErledigtMinuten: "Виконано (хв)",
    wochenaufgabenProzent: "Виконані тижневі цілі (%)",
    treffsicherheit: "Точність (%)",
    anschlaege: "Знаків за хвилину",
    score: "Бали",
    challenges: "Виклики",
    challengeSchnitt: "Виклики - середні бали",
  },
};

/** „Erstellt am 13.09.2026" / „Created on 13 September 2026" / „Créé le 13 septembre 2026". */
function erstelltAm(jetztMs: number, sprache: ExportSprache): string {
  // ★ O-CS (03.10.2026): „Vytvořeno: 13. září 2026" (Monat im Genitiv per Intl, Datum nach Doppelpunkt).
  if (sprache === "cs")
    return `Vytvořeno: ${new Date(jetztMs).toLocaleDateString("cs-CZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  // ★ O-TR (02.10.2026): "Oluşturulma tarihi: 13 Eylül 2026" (Datum nach Doppelpunkt, ohne Endung).
  if (sprache === "tr")
    return `Oluşturulma tarihi: ${new Date(jetztMs).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  // ★ O-PL (02.10.2026): „Utworzono 13 września 2026 r." (-no-Form, „r." nach dem Jahr).
  if (sprache === "pl")
    return `Utworzono ${new Date(jetztMs).toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })} r.`;
  // ★ O-IT (02.10.2026): „Creato il 13 settembre 2026" (Elision: „Creato l'8 …").
  if (sprache === "it")
    return `Creato ${itPrepTag("il", new Date(jetztMs).getDate())}${new Date(jetztMs).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  // ★ ES-O (27.09.2026): „Creado el 13 de septiembre de 2026" - vorher still Deutsch.
  if (sprache === "es")
    return `Creado el ${new Date(jetztMs).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  if (sprache === "fr")
    return `Créé le ${new Date(jetztMs).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  return sprache === "en"
    ? `Created on ${new Date(jetztMs).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`
    : `Erstellt am ${datumDeutsch(jetztMs)}`;
}

/**
 * ★ Die Spaltenköpfe brechen in der Datei um. Eine Spalte ist darum höchstens
 * so breit wie ihr ganzer Kopf, mindestens aber das LÄNGSTE WORT plus Platz für
 * den Knopf des Filters, der rechts unten in der Kopfzelle sitzt.
 *
 * ⚠️ Gemessen am Muster (13.09.2026): Mit „längstes Wort + 4" brach
 * „Leistungsstufe (1-50)" in LibreOffice am Bindestrich - „(1-" oben, „50)"
 * unten. Mit Luft für den ganzen Kopf passiert das nicht.
 */
function breiteFuer(kopf: string, mindestens = 11): number {
  const laengstesWort = Math.max(...kopf.split(/\s+/).map((w) => w.length));
  return Math.max(mindestens, Math.min(kopf.length + 3, laengstesWort + 8));
}

interface SpalteMitWert extends LeistungsSpalte {
  wert: (z: LeistungsZeile) => Zelle;
}

const zahlOderStrich = (x: number | null): Zelle => (x === null ? OHNE_WERT : x);

function spalte(
  schluessel: SpaltenSchluessel,
  kopf: string,
  gruppe: SpaltenGruppe,
  format: SpaltenFormat,
  wert: (z: LeistungsZeile) => Zelle,
): SpalteMitWert {
  return { schluessel, kopf, gruppe, format, breite: breiteFuer(kopf), wert };
}

/**
 * EIN Datenblatt: Titel, Datum, Spalten und ein Kind je Zeile, alphabetisch.
 *
 * Die Spalten stehen in der Reihenfolge des Schirms. „Tasten" („12/31") wird zu
 * ZWEI Spalten, weil „12/31" in Excel keine Zahl ist, mit der man rechnen kann.
 * Die Wochenziel-Spalten stehen nur da, wenn in der Klasse ein Ziel gesetzt ist
 * - wie auf dem Schirm (`zeigeWochenziel`).
 */
export function leistungsBlatt(o: {
  name: string;
  art: ZeitraumArt;
  titel: string;
  zeitraumTitel: string;
  jetztMs: number;
  zeigeWochenziel: boolean;
  zeilen: readonly LeistungsZeile[];
  /** ★ EN6a: die Sprache des Blattes - ohne Angabe Deutsch. */
  sprache?: ExportSprache;
}): LeistungsBlatt {
  const sprache = o.sprache ?? "de";
  const K = KOEPFE[sprache];
  // Namen bleiben Namen - alphabetisch wie in der App (`de-AT`), in jeder Sprache.
  const sortiert = [...o.zeilen].sort((a, b) => a.name.localeCompare(b.name, "de-AT"));
  const spalten: SpalteMitWert[] = [
    spalte("name", K.name, "person", "text", (z) => z.name),
    spalte("stufe", K.stufe, "stand", "ganzzahl", (z) => z.stufe),
    spalte("tastenSitzen", K.tastenSitzen, "stand", "ganzzahl", (z) => z.tastenSitzen),
    spalte("tastenFrei", K.tastenFrei, "stand", "ganzzahl", (z) => z.tastenFrei),
    spalte("uebezeit", K.uebezeit, "stand", "minuten", (z) =>
      zahlOderStrich(z.uebezeitMinuten),
    ),
    /*
     * ★ W3a (18.09.2026): Minuten im Blatt „Woche" (zwei Zahlen: Ziel und
     * davon erledigt), Prozent in „Schuljahr"/„Gesamt" (eine Zahl, über alle
     * ABGESCHLOSSENEN Ziel-Wochen) - dieselbe Unterscheidung wie
     * `WochenzielStand.art` auf dem Schirm.
     */
    ...(o.zeigeWochenziel
      ? o.art === "woche"
        ? [
            spalte("wochenzielMinuten", K.wochenzielMinuten, "stand", "ganzzahl", (z) =>
              zahlOderStrich(z.wochenzielMinuten),
            ),
            spalte(
              "wochenzielErledigtMinuten",
              K.wochenzielErledigtMinuten,
              "stand",
              "ganzzahl",
              (z) => zahlOderStrich(z.wochenzielErledigtMinuten),
            ),
          ]
        : [
            spalte(
              "wochenaufgabenProzent",
              K.wochenaufgabenProzent,
              "stand",
              "prozent",
              (z) => zahlOderStrich(z.wochenaufgabenProzent),
            ),
          ]
      : []),
    spalte("treffsicherheit", K.treffsicherheit, "ueben", "prozent", (z) =>
      zahlOderStrich(z.treffsicherheit),
    ),
    spalte("anschlaege", K.anschlaege, "ueben", "ganzzahl", (z) =>
      zahlOderStrich(z.anschlaegeProMinute),
    ),
    spalte("score", K.score, "ueben", "ganzzahl", (z) => zahlOderStrich(z.score)),
    spalte("challenges", K.challenges, "pruefung", "ganzzahl", (z) =>
      zahlOderStrich(z.challenges),
    ),
    spalte("challengeSchnitt", K.challengeSchnitt, "pruefung", "ganzzahl", (z) =>
      zahlOderStrich(z.challengeSchnitt),
    ),
  ];
  // Die Namensspalte auch für den längsten Namen.
  spalten[0].breite = Math.max(18, ...sortiert.map((z) => z.name.length + 4));
  return {
    name: o.name,
    art: o.art,
    zeitraumTitel: o.zeitraumTitel,
    titel: o.titel,
    erstellt: erstelltAm(o.jetztMs, sprache),
    spalten: spalten.map(({ wert: _wert, ...s }) => s),
    daten: sortiert.map((z) => spalten.map((s) => s.wert(z))),
    spaltenbreiten: spalten.map((s) => s.breite),
    // ⚠️ Nur bei Nicht-Deutsch gesetzt: Die deutsche Fassung trägt das Feld
    // nicht, damit ein Vergleich mit einem älteren Blatt (`toEqual`) gleich
    // bleibt (E11a-3: auch für „fr" jetzt gesetzt, nicht nur „en").
    ...(sprache !== "de" ? { sprache } : {}),
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// DIE LEGENDE
// ══════════════════════════════════════════════════════════════════════════════

/**
 * ★★ Die Zusatzsätze - nur dort, wo die Datei ANDERS zählt als der Schirm.
 * Je Spalte höchstens einer; der Satz davor ist immer der aus der App.
 */
export const LEGENDE_ZUSATZ = {
  tasten:
    "In der Datei stehen die beiden Zahlen in zwei Spalten: „Tasten sitzen“ und „Tasten freigeschaltet“.",
  uebezeit:
    "In der Datei steht sie in Minuten mit einer Nachkommastelle - 20 Sekunden sind 0,3.",
  wochenzielWoche:
    `In der Datei stehen die beiden Zahlen in zwei Spalten: „${WOCHENZIEL_KOPF_MINUTEN}“ und „${WOCHENZIEL_KOPF_ERLEDIGT}“.`,
  wochenaufgaben:
    "In der Datei steht die Zahl in Prozent, ohne „%“ - so kann man damit rechnen; im Blatt „Gesamt“ zählen alle Wochen, seit es das Konto gibt.",
  ohneVeraenderung:
    "In der Datei steht nur der Wert des Zeitraums - ohne Pfeil und ohne Veränderung.",
  challenges: `In der Datei stehen die beiden Zahlen in zwei Spalten: „${PRUEFUNG_WORT_MEHRZAHL}“ und „${KOPF_CHALLENGE_SCHNITT}“.`,
} as const;

/** ★ EN6a: dieselben Zusatzsätze englisch - je Spalte höchstens einer. */
export const LEGENDE_ZUSATZ_EN: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten:
    "In the file, the two numbers are in two columns: “Keys mastered” and “Keys unlocked”.",
  uebezeit: "In the file, it is given in minutes with one decimal place - 20 seconds are 0.3.",
  wochenzielWoche: `In the file, the two numbers are in two columns: “${WOCHENZIEL_KOPF_MINUTEN_EN}” and “${WOCHENZIEL_KOPF_ERLEDIGT_EN}”.`,
  wochenaufgaben:
    "In the file, the number is a percentage without “%”, so you can calculate with it; on the sheet “All time”, every week since the account was created counts.",
  ohneVeraenderung:
    "The file only shows the value for the period - without the arrow and without the change.",
  challenges: `In the file, the two numbers are in two columns: “${PRUEFUNG_WORT_MEHRZAHL_EN}” and “${KOPF_CHALLENGE_SCHNITT_EN}”.`,
};

/**
 * ★ E11a-3 (26.09.2026): dieselben Zusatzsätze französisch. ★ E11a-5: auch
 * `challenges` - bis dahin bewusst englisch, weil `HINWEIS_CHALLENGE`
 * (`schreibprobeHinweise.ts`) „fr" noch nicht kannte; jetzt verweist der Satz
 * auf die französischen Spaltenköpfe der Datei.
 */
export const LEGENDE_ZUSATZ_FR: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten:
    "Dans le fichier, les deux nombres sont dans deux colonnes : \"Touches acquises\" et \"Touches débloquées\".",
  uebezeit:
    "Dans le fichier, il est indiqué en minutes avec une décimale - 20 secondes font 0,3.",
  wochenzielWoche: `Dans le fichier, les deux nombres sont dans deux colonnes : "${WOCHENZIEL_KOPF_MINUTEN_FR}" et "${WOCHENZIEL_KOPF_ERLEDIGT_FR}".`,
  wochenaufgaben:
    "Dans le fichier, le nombre est un pourcentage sans \"%\", pour pouvoir calculer avec ; dans la feuille \"Total\", toutes les semaines depuis la création du compte comptent.",
  ohneVeraenderung:
    "Le fichier montre seulement la valeur de la période - sans flèche et sans évolution.",
  challenges: `Dans le fichier, les deux nombres sont dans deux colonnes : "${PRUEFUNG_WORT_MEHRZAHL_FR}" et "${KOPF_CHALLENGE_SCHNITT_FR}".`,
};

/** ★ ES-O (27.09.2026): dieselben Zusätze spanisch. */
export const LEGENDE_ZUSATZ_ES: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten:
    "En el archivo, los dos números están en dos columnas: \"Teclas aprendidas\" y \"Teclas desbloqueadas\".",
  uebezeit:
    "En el archivo figura en minutos con un decimal - 20 segundos son 0.3 (según la configuración de Excel, 0,3).",
  wochenzielWoche: `En el archivo, los dos números están en dos columnas: "${WOCHENZIEL_KOPF_MINUTEN_ES}" y "${WOCHENZIEL_KOPF_ERLEDIGT_ES}".`,
  wochenaufgaben:
    "En el archivo, el número es un porcentaje sin \"%\", para poder calcular con él; en la hoja \"Total\" cuentan todas las semanas desde que se creó la cuenta.",
  ohneVeraenderung:
    "El archivo muestra solo el valor del periodo - sin flecha y sin evolución.",
  challenges: `En el archivo, los dos números están en dos columnas: "${PRUEFUNG_WORT_MEHRZAHL_ES}" y "${KOPF_CHALLENGE_SCHNITT_ES}".`,
};

/** ★ O-IT (02.10.2026): dieselben Zusätze italienisch. */
export const LEGENDE_ZUSATZ_IT: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten: `Nel file i due numeri sono in due colonne: "Tasti sicuri" e "Tasti sbloccati".`,
  uebezeit: "Nel file è indicato in minuti con un decimale - 20 secondi sono 0,3.",
  wochenzielWoche: `Nel file i due numeri sono in due colonne: "${WOCHENZIEL_KOPF_MINUTEN_IT}" e "${WOCHENZIEL_KOPF_ERLEDIGT_IT}".`,
  wochenaufgaben:
    `Nel file il numero è una percentuale senza "%", così si può calcolare; nel foglio "Dall'inizio" contano tutte le settimane da quando esiste l'account.`,
  ohneVeraenderung: "Il file mostra solo il valore del periodo - senza freccia e senza evoluzione.",
  challenges: `Nel file i due numeri sono in due colonne: "${PRUEFUNG_WORT_MEHRZAHL_IT}" e "${KOPF_CHALLENGE_SCHNITT_IT}".`,
};

/** ★ O-PL (02.10.2026): dieselben Zusätze polnisch. */
export const LEGENDE_ZUSATZ_PL: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten: "W pliku obie liczby są w dwóch kolumnach: „Opanowane klawisze” i „Odblokowane klawisze”.",
  uebezeit: "W pliku jest podany w minutach z jednym miejscem po przecinku - 20 sekund to 0,3.",
  wochenzielWoche: `W pliku obie liczby są w dwóch kolumnach: „${WOCHENZIEL_KOPF_MINUTEN_PL}” i „${WOCHENZIEL_KOPF_ERLEDIGT_PL}”.`,
  wochenaufgaben:
    "W pliku liczba jest procentem bez „%”, żeby można było nią liczyć; w arkuszu „Od początku” liczą się wszystkie tygodnie od założenia konta.",
  ohneVeraenderung: "Plik pokazuje tylko wartość z okresu - bez strzałki i bez zmiany.",
  challenges: `W pliku obie liczby są w dwóch kolumnach: „${PRUEFUNG_WORT_MEHRZAHL_PL}” i „${KOPF_CHALLENGE_SCHNITT_PL}”.`,
};

/** ★ O-TR (02.10.2026): dieselben Zusätze türkisch. */
export const LEGENDE_ZUSATZ_TR: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten: `Dosyada iki sayı iki ayrı sütundadır: "Oturmuş tuşlar" ve "Kilidi açılmış tuşlar".`,
  uebezeit: "Dosyada süre, bir ondalık basamaklı dakika olarak yazılır - 20 saniye 0,3 olur.",
  wochenzielWoche: `Dosyada iki sayı iki ayrı sütundadır: "${WOCHENZIEL_KOPF_MINUTEN_TR}" ve "${WOCHENZIEL_KOPF_ERLEDIGT_TR}".`,
  wochenaufgaben:
    `Dosyada sayı, hesap yapılabilsin diye "%" işareti olmadan yüzde olarak yazılır; "Başından beri" sayfasında hesabın açıldığı günden bu yana tüm haftalar sayılır.`,
  ohneVeraenderung: "Dosya yalnızca dönemin değerini gösterir - ok ve değişim olmadan.",
  challenges: `Dosyada iki sayı iki ayrı sütundadır: "${PRUEFUNG_WORT_MEHRZAHL_TR}" ve "${KOPF_CHALLENGE_SCHNITT_TR}".`,
};

/** ★ O-CS (03.10.2026): dieselben Zusätze tschechisch; kein Satz endet auf einer Zahl (Glossar §4 Falle 4). */
export const LEGENDE_ZUSATZ_CS: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten: "V souboru jsou obě čísla ve dvou sloupcích: „Jisté klávesy“ a „Odemčené klávesy“.",
  uebezeit: "V souboru je uveden v minutách s jedním desetinným místem - 20 sekund je tedy 0,3 minuty.",
  wochenzielWoche: `V souboru jsou obě čísla ve dvou sloupcích: „${WOCHENZIEL_KOPF_MINUTEN_CS}“ a „${WOCHENZIEL_KOPF_ERLEDIGT_CS}“.`,
  wochenaufgaben:
    "V souboru je číslo procento bez znaku %, aby se s ním dalo počítat; na listu Od začátku se počítají všechny týdny od založení účtu.",
  ohneVeraenderung: "Soubor ukazuje jen hodnotu za období - bez šipky a bez změny.",
  challenges: `V souboru jsou obě čísla ve dvou sloupcích: „${PRUEFUNG_WORT_MEHRZAHL_CS}“ a „${KOPF_CHALLENGE_SCHNITT_CS}“.`,
};

/** Was ein Strich in einer Zelle heisst - der letzte Eintrag der Legende. */
export const STRICH_SATZ = `Kein Wert - nicht geübt oder zu wenig Text für eine Wertung. Ein Strich ist keine Null.`;
/** ★ EN6a: derselbe Satz englisch. */
export const STRICH_SATZ_EN = `No value - not practised, or too little text to be scored. A dash is not a zero.`;
/** ★ E11a-3: derselbe Satz französisch. */
export const STRICH_SATZ_FR = `Pas de valeur - pas encore d'exercice, ou trop peu de texte pour une évaluation. Un tiret n'est pas un zéro.`;
/** ★ ES-O: derselbe Satz spanisch. */
export const STRICH_SATZ_ES = `Sin valor - todavía sin práctica, o demasiado poco texto para valorarlo. Un guion no es un cero.`;
/** ★ O-IT: derselbe Satz italienisch. */
export const STRICH_SATZ_IT = `Nessun valore - nessun esercizio, o troppo poco testo per una valutazione. Un trattino non è uno zero.`;
/** ★ O-PL: derselbe Satz polnisch. */
export const STRICH_SATZ_PL = `Brak wartości - brak ćwiczeń albo za mało tekstu, żeby policzyć wynik. Kreska to nie zero.`;
/** ★ O-TR: derselbe Satz türkisch. */
export const STRICH_SATZ_TR = `Değer yok - alıştırma yapılmadı ya da puan için metin çok az. Çizgi, sıfır demek değildir.`;
/** ★ O-CS: derselbe Satz tschechisch. */
export const STRICH_SATZ_CS = `Bez hodnoty - necvičilo se, nebo bylo textu na hodnocení příliš málo. Znak „-“ není nula.`;

export interface LegendenEintrag {
  /** `gruppe` = eine Überschrift der ersten Kopfzeile („Üben", „Prüfung"). */
  art: "gruppe" | "spalte";
  name: string;
  text: string;
}

/** ★ O2-LIB (30.10.2026): dieselbe Legende bulgarisch - dieselben Sätze wie die Hinweise der bulgarischen Bedienung. */
function legendenTextBg(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("bg");
  const Z = LEGENDE_ZUSATZ_BG;
  switch (s.schluessel) {
    case "name":
      return "Името на ученика. Учениците са подредени по азбучен ред.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return "Второто число към „Сигурни клавиши“ - вж. там.";
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "bg")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return "Второто число към „Седмична цел (мин)“ - вж. там.";
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "bg")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "bg")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "bg")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "bg")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `${CHALLENGES_SPALTE_LEGENDE_BG} ${Z.challenges}`;
    case "challengeSchnitt":
      return "Второто число към „Предизвикателства“ - вж. там.";
  }
}

/** ★ O2-LIB (30.10.2026): derselbe Satz wie der Spaltenhinweis der Предизвикателства, bulgarisch. */
const CHALLENGES_SPALTE_LEGENDE_BG =
  `Първото число: колко Предизвикателства са написани. Второто число: средният резултат от 0 до 100 - ` +
  `брои се само това, което е било достатъчно дълго за оценка. Разгъването на реда показва всяко Предизвикателство поотделно.`;

/** ★ O2-LIB (30.10.2026): dieselben Zusätze bulgarisch; kein Satz endet auf einer Zahl (Glossar §4 Falle 4). */
export const LEGENDE_ZUSATZ_BG: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten: "Във файла двете числа са в две колони: „Сигурни клавиши“ и „Отключени клавиши“.",
  uebezeit: "Във файла е в минути с един знак след десетичната запетая - 20 секунди са 0,3 минути.",
  wochenzielWoche: "Във файла двете числа са в две колони: „Седмична цел (мин)“ и „Изпълнено (мин)“.",
  wochenaufgaben:
    "Във файла числото е процент без знака %, за да може да се работи с него; на листа „От началото“ се броят всички седмици от създаването на акаунта.",
  ohneVeraenderung: "Файлът показва само стойността за периода - без стрелка и без промяна.",
  challenges: "Във файла двете числа са в две колони: „Предизвикателства“ и „Предизвикателства - среден резултат“.",
};

/** ★ O-EL-LIB (30.10.2026): dieselbe Legende griechisch - dieselben Sätze wie die Hinweise der griechischen Bedienung. */
function legendenTextEl(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("el");
  const Z = LEGENDE_ZUSATZ_EL;
  switch (s.schluessel) {
    case "name":
      return "Το όνομα του παιδιού. Τα παιδιά είναι σε αλφαβητική σειρά.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return "Ο δεύτερος αριθμός της στήλης «Σίγουρα πλήκτρα» - δείτε εκεί.";
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "el")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return "Ο δεύτερος αριθμός της στήλης «Εβδομαδιαίος στόχος (λεπτά)» - δείτε εκεί.";
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "el")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "el")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "el")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "el")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `${CHALLENGE_SPALTE_HINWEIS_EL} ${Z.challenges}`;
    case "challengeSchnitt":
      return "Ο δεύτερος αριθμός της στήλης «Προκλήσεις» - δείτε εκεί.";
  }
}

/** ★ O-EL-LIB (30.10.2026): der Satz am Spaltenkopf «Προκλήσεις» (Zahl der Herausforderungen und Durchschnitts-Score). */
const CHALLENGE_SPALTE_HINWEIS_EL =
  "Ο πρώτος αριθμός: πόσες Προκλήσεις γράφτηκαν. Ο δεύτερος αριθμός: το μέσο σκορ, από 0 έως 100 - " +
  "μετράνε μόνο όσες ήταν αρκετά μεγάλες για να υπολογιστεί σκορ. Ανοίξτε τη γραμμή για να δείτε " +
  "κάθε Πρόκληση χωριστά.";

/** ★ O-EL-LIB (30.10.2026): dieselben Zusätze griechisch; kein Satz endet auf einer nackten Zahl. */
export const LEGENDE_ZUSATZ_EL: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten: "Στο αρχείο οι δύο αριθμοί βρίσκονται σε δύο στήλες: «Σίγουρα πλήκτρα» και «Ξεκλειδωμένα πλήκτρα».",
  uebezeit: "Στο αρχείο δίνεται σε λεπτά με ένα δεκαδικό ψηφίο - τα 20 δευτερόλεπτα είναι 0,3 λεπτά.",
  wochenzielWoche: "Στο αρχείο οι δύο αριθμοί βρίσκονται σε δύο στήλες: «Εβδομαδιαίος στόχος (λεπτά)» και «Ολοκληρώθηκε (λεπτά)».",
  wochenaufgaben:
    "Στο αρχείο ο αριθμός είναι ποσοστό χωρίς το «%», ώστε να γίνονται πράξεις με αυτόν. Στο φύλλο «Από την αρχή» μετράνε όλες οι εβδομάδες από τότε που υπάρχει ο λογαριασμός.",
  ohneVeraenderung: "Το αρχείο δείχνει μόνο την τιμή της περιόδου - χωρίς βέλος και χωρίς μεταβολή.",
  challenges: "Στο αρχείο οι δύο αριθμοί βρίσκονται σε δύο στήλες: «Προκλήσεις» και «Προκλήσεις - μέσο σκορ».",
};

/** ★ O2-LIB (30.10.2026): der Hinweis an der Challenge-Spalte, Ungarisch - dieselbe Aussage wie die deutsche Fassung. */
const HINWEIS_CHALLENGE_SPALTE_HU =
  "Első szám: hány Kihívás készült. Második szám: az átlagos pontszám 0 és 100 között - " +
  "csak az számít, ami elég hosszú volt az értékeléshez. A sor kibontása után minden Kihívás külön látható.";

/**
 * ★ O2-LIB (30.10.2026): dieselben Zusätze ungarisch; „A fájlban ..." ohne Artikel vor einem
 * Namen (Glossar Regel 12), kein Satz endet auf einer Zahl mit Punkt (§4 Falle 4).
 */
export const LEGENDE_ZUSATZ_HU: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten: "A fájlban a két szám két oszlopban áll: „Biztos billentyűk” és „Feloldott billentyűk”.",
  uebezeit: "A fájlban percben szerepel, egy tizedesjeggyel - 20 másodperc tehát 0,3 perc.",
  wochenzielWoche: `A fájlban a két szám két oszlopban áll: „Heti cél (perc)” és „Teljesítve (perc)”.`,
  wochenaufgaben:
    "A fájlban a szám százalék a %-jel nélkül, hogy lehessen vele számolni; a „Kezdettől” munkalapon a fiók létrehozása óta minden hét számít.",
  ohneVeraenderung: "A fájl csak az időszak értékét mutatja - nyíl és változás nélkül.",
  challenges: `A fájlban a két szám két oszlopban áll: „Kihívások” és „Kihívások - átlagos pontszám”.`,
};

/** ★ O2-LIB (30.10.2026): dieselbe Legende ungarisch - dieselben Sätze wie die Hinweise der ungarischen Bedienung. */
function legendenTextHu(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("hu");
  const Z = LEGENDE_ZUSATZ_HU;
  switch (s.schluessel) {
    case "name":
      return "A tanuló neve. A tanulók ábécérendben állnak.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return "A második szám ehhez az oszlophoz: „Biztos billentyűk” - lásd ott.";
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "hu")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return `A második szám ehhez az oszlophoz: „Heti cél (perc)” - lásd ott.`;
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "hu")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "hu")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "hu")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "hu")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `${HINWEIS_CHALLENGE_SPALTE_HU} ${Z.challenges}`;
    case "challengeSchnitt":
      return `A második szám ehhez az oszlophoz: „Kihívások” - lásd ott.`;
  }
}

/** ★ O2-LIB (29.10.2026): dieselbe Legende niederländisch - dieselben Sätze wie die Hinweise der niederländischen Bedienung. */
function legendenTextNl(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("nl");
  const Z = LEGENDE_ZUSATZ_NL;
  switch (s.schluessel) {
    case "name":
      return "De naam van de leerling. De leerlingen staan op alfabet.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return `Het tweede getal bij "Zekere toetsen" - zie daar.`;
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "nl")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return `Het tweede getal bij "Weekdoel (min)" - zie daar.`;
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "nl")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "nl")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "nl")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "nl")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `Eerste getal: hoeveel Uitdagingen er zijn gedaan. Tweede getal: de gemiddelde score, van 0 tot 100 - alleen wat lang genoeg was om te scoren telt mee. Open de rij om elke Uitdaging apart te zien. ${Z.challenges}`;
    case "challengeSchnitt":
      return `Het tweede getal bij "Uitdagingen" - zie daar.`;
  }
}

/** ★ O2-LIB (29.10.2026): dieselben Zusätze niederländisch; je Spalte höchstens einer. */
export const LEGENDE_ZUSATZ_NL: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten: `In het bestand staan beide getallen in twee kolommen: "Zekere toetsen" en "Vrijgespeelde toetsen".`,
  uebezeit: "In het bestand staat het in minuten met één decimaal - 20 seconden is dus 0,3 minuut.",
  wochenzielWoche: `In het bestand staan beide getallen in twee kolommen: "Weekdoel (min)" en "Gehaald (min)".`,
  wochenaufgaben:
    "In het bestand is het getal een percentage zonder %, zodat je ermee kunt rekenen; op het blad Vanaf het begin tellen alle weken sinds het account is aangemaakt.",
  ohneVeraenderung: "Het bestand toont alleen de waarde voor de periode - zonder pijl en zonder verandering.",
  challenges: `In het bestand staan beide getallen in twee kolommen: "Uitdagingen" en "Uitdagingen - gemiddelde score".`,
};

/** ★ O-LIB (30.10.2026): a mesma legenda em português - as mesmas frases das dicas da interface em português. */
function legendenTextPt(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("pt");
  const Z = LEGENDE_ZUSATZ_PT;
  switch (s.schluessel) {
    case "name":
      return "O nome da pessoa. Os estudantes estão por ordem alfabética.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return `O segundo número da coluna "Teclas dominadas" - ver aí.`;
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "pt")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return `O segundo número da coluna "Objetivo semanal (min)" - ver aí.`;
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "pt")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "pt")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "pt")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "pt")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `${DESAFIOS_SPALTE_HINWEIS_PT} ${Z.challenges}`;
    case "challengeSchnitt":
      return `O segundo número da coluna "Desafios" - ver aí.`;
  }
}

/** ★ O-LIB (30.10.2026): a dica da coluna dos Desafios para quem ensina, em português. */
const DESAFIOS_SPALTE_HINWEIS_PT =
  "Primeiro número: quantos Desafios foram feitos. Segundo número: a pontuação média, de 0 a 100 - " +
  "só conta o que foi suficientemente longo para ser avaliado. Abra a linha para ver cada Desafio em separado.";

/** ★ O-LIB (30.10.2026): os mesmos acrescentos em português; nenhuma frase termina num número com ponto. */
export const LEGENDE_ZUSATZ_PT: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten: `No ficheiro, os dois números estão em duas colunas: "Teclas dominadas" e "Teclas desbloqueadas".`,
  uebezeit: "No ficheiro, o valor vem em minutos com uma casa decimal - 20 segundos são 0,3 minutos.",
  wochenzielWoche: `No ficheiro, os dois números estão em duas colunas: "Objetivo semanal (min)" e "Cumprido (min)".`,
  wochenaufgaben:
    "No ficheiro, o número é uma percentagem sem o sinal %, para se poder calcular com ele; na folha Desde o início contam todas as semanas desde a criação da conta.",
  ohneVeraenderung: "O ficheiro mostra apenas o valor do período - sem seta e sem variação.",
  challenges: `No ficheiro, os dois números estão em duas colunas: "Desafios" e "Desafios - pontuação média".`,
};

/** ★ O2-LIB (29.10.2026): die Spaltenköpfe, auf die sich die Legende bezieht - wie in der Kopfzeilen-Tabelle "br". */
const WOCHENZIEL_KOPF_MINUTEN_BR = "Meta semanal (min)";

const WOCHENZIEL_KOPF_ERLEDIGT_BR = "Cumprido (min)";

const KOPF_CHALLENGE_BR = "Desafios";

const KOPF_CHALLENGE_SCHNITT_BR = "Desafios - pontuação média";

/** ★ O2-LIB (29.10.2026): der Hinweis an der Challenge-Spalte, Portugiesisch (Brasilien) - dieselbe Aussage wie die deutsche Fassung. */
const HINWEIS_CHALLENGE_SPALTE_BR =
  "Primeiro número: quantos Desafios foram feitos. Segundo número: a pontuação média, de 0 a 100 - " +
  "só conta o que foi longo o bastante para valer. Ao expandir a linha, cada Desafio aparece separado.";

/**
 * ★ O2-LIB (29.10.2026): dieselben Zusätze, Portugiesisch (Brasilien); gerade Anführungszeichen
 * (Glossar Regel 7), "%" ausgeschrieben (Sprachausgabe), kein Satz endet auf einer Zahl.
 */
export const LEGENDE_ZUSATZ_BR: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten: 'No arquivo, os dois números ficam em duas colunas: "Teclas seguras" e "Teclas desbloqueadas".',
  uebezeit: "No arquivo, o tempo aparece em minutos com uma casa decimal - 20 segundos são 0,3 minuto.",
  wochenzielWoche: `No arquivo, os dois números ficam em duas colunas: "${WOCHENZIEL_KOPF_MINUTEN_BR}" e "${WOCHENZIEL_KOPF_ERLEDIGT_BR}".`,
  wochenaufgaben:
    "No arquivo, o número é a porcentagem sem o símbolo de porcentagem, para que dê para calcular com ele; na planilha Desde o início, contam todas as semanas desde a criação da conta.",
  ohneVeraenderung: "O arquivo mostra só o valor do período - sem seta e sem variação.",
  challenges: `No arquivo, os dois números ficam em duas colunas: "${KOPF_CHALLENGE_BR}" e "${KOPF_CHALLENGE_SCHNITT_BR}".`,
};

/** ★ O2-LIB (29.10.2026): die Legende, Portugiesisch (Brasilien) - dieselben Sätze wie die Hinweise der Bedienung, dahinter höchstens ein Zusatzsatz. */
function legendenTextBr(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("br");
  const Z = LEGENDE_ZUSATZ_BR;
  switch (s.schluessel) {
    case "name":
      return "O nome da pessoa. As pessoas estão em ordem alfabética.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return 'O segundo número da coluna "Teclas seguras" - veja lá.';
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "br")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return `O segundo número da coluna "${WOCHENZIEL_KOPF_MINUTEN_BR}" - veja lá.`;
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "br")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "br")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "br")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "br")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `${HINWEIS_CHALLENGE_SPALTE_BR} ${Z.challenges}`;
    case "challengeSchnitt":
      return `O segundo número da coluna "${KOPF_CHALLENGE_BR}" - veja lá.`;
  }
}

/** ★ O2-LIB (29.10.2026): dieselbe Legende rumänisch - dieselben Sätze wie die Hinweise der rumänischen Bedienung. */
function legendenTextRo(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("ro");
  const Z = LEGENDE_ZUSATZ_RO;
  switch (s.schluessel) {
    case "name":
      return "Numele persoanei. Elevii sunt ordonați alfabetic.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return "Al doilea număr pentru coloana „Taste sigure” - vezi acolo.";
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "ro")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return "Al doilea număr pentru coloana „Obiectiv săptămânal (min)” - vezi acolo.";
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "ro")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "ro")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "ro")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "ro")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `Primul număr: câte Provocări au fost scrise. Al doilea număr: scorul mediu de la 0 la 100 - se numără doar ce a fost destul de lung pentru evaluare. După extinderea rândului se vede fiecare Provocare separat. ${Z.challenges}`;
    case "challengeSchnitt":
      return "Al doilea număr pentru coloana „Provocări” - vezi acolo.";
  }
}

/** ★ O2-LIB (29.10.2026): dieselben Zusätze rumänisch; kein Satz endet auf einer Zahl (Glossar §4 Falle 4). */
export const LEGENDE_ZUSATZ_RO: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten: "În fișier, cele două numere sunt în două coloane: „Taste sigure” și „Taste deblocate”.",
  uebezeit: "În fișier este indicat în minute cu o zecimală - 20 de secunde înseamnă deci 0,3 minute.",
  wochenzielWoche: "În fișier, cele două numere sunt în două coloane: „Obiectiv săptămânal (min)” și „Realizat (min)”.",
  wochenaufgaben:
    "În fișier, numărul este un procent fără semnul %, ca să se poată calcula cu el; în foaia De la început se numără toate săptămânile de la crearea contului.",
  ohneVeraenderung: "Fișierul arată doar valoarea pentru perioadă - fără săgeată și fără variație.",
  challenges: "În fișier, cele două numere sunt în două coloane: „Provocări” și „Provocări - scor mediu”.",
};

/** ★ O2-LIB (30.10.2026): dieselbe Legende schwedisch - dieselben Sätze wie die Hinweise der schwedischen Bedienung. */
function legendenTextSv(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("sv");
  const Z = LEGENDE_ZUSATZ_SV;
  switch (s.schluessel) {
    case "name":
      return "Elevens namn. Eleverna står i alfabetisk ordning.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return `Det andra talet till "Säkra tangenter" - se där.`;
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "sv")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return `Det andra talet till "Veckomål (min)" - se där.`;
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "sv")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "sv")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "sv")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "sv")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `Första talet: hur många Utmaningar som har gjorts. Andra talet: den genomsnittliga poängen, från 0 till 100 - bara det som var långt nog för att få poäng räknas. Öppna raden för att se varje Utmaning för sig. ${Z.challenges}`;
    case "challengeSchnitt":
      return `Det andra talet till "Utmaningar" - se där.`;
  }
}

/** ★ O2-LIB (30.10.2026): dieselben Zusätze schwedisch; je Spalte höchstens einer. */
export const LEGENDE_ZUSATZ_SV: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten: `I filen står de båda talen i två kolumner: "Säkra tangenter" och "Upplåsta tangenter".`,
  uebezeit: "I filen anges den i minuter med en decimal - 20 sekunder är alltså 0,3 minuter.",
  wochenzielWoche: `I filen står de båda talen i två kolumner: "Veckomål (min)" och "Klart (min)".`,
  wochenaufgaben:
    "I filen är talet en procentsats utan tecknet %, så att du kan räkna med det; på bladet Från början räknas alla veckor sedan kontot skapades.",
  ohneVeraenderung: "Filen visar bara värdet för perioden - utan pil och utan förändring.",
  challenges: `I filen står de båda talen i två kolumner: "Utmaningar" och "Utmaningar - genomsnittlig poäng".`,
};

/** ★ O2-LIB (30.10.2026): dieselbe Legende ukrainisch - dieselben Sätze wie die Hinweise der ukrainischen Bedienung. */
function legendenTextUk(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("uk");
  const Z = LEGENDE_ZUSATZ_UK;
  switch (s.schluessel) {
    case "name":
      return "Ім'я дитини. Діти розташовані за абеткою.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return "Друге число до стовпця «Впевнені клавіші» - див. там.";
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "uk")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return "Друге число до стовпця «Тижнева мета (хв)» - див. там.";
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "uk")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "uk")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "uk")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "uk")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `Перше число: скільки Викликів було написано. Друге число: середні бали від 0 до 100 - враховується лише те, що було достатньо довгим для оцінювання. Після розгортання рядка кожен Виклик видно окремо. ${Z.challenges}`;
    case "challengeSchnitt":
      return "Друге число до стовпця «Виклики» - див. там.";
  }
}

/** ★ O2-LIB (30.10.2026): dieselben Zusätze ukrainisch; kein Satz endet auf einer Zahl (Glossar §4 Falle 4). */
export const LEGENDE_ZUSATZ_UK: Record<keyof typeof LEGENDE_ZUSATZ, string> = {
  tasten: "У файлі обидва числа стоять у двох стовпцях: «Впевнені клавіші» і «Відкриті клавіші».",
  uebezeit: "У файлі вказано в хвилинах з одним десятковим знаком - 20 секунд це 0,3 хвилини.",
  wochenzielWoche: "У файлі обидва числа стоять у двох стовпцях: «Тижнева мета (хв)» і «Виконано (хв)».",
  wochenaufgaben:
    "У файлі число - це відсоток без знака %, щоб із ним можна було рахувати; на аркуші «Від початку» враховуються всі тижні від створення облікового запису.",
  ohneVeraenderung: "Файл показує лише значення за період - без стрілки й без зміни.",
  challenges: "У файлі обидва числа стоять у двох стовпцях: «Виклики» і «Виклики - середні бали».",
};

function legendenText(s: LeistungsSpalte, art: ZeitraumArt, sprache: ExportSprache): string {
  // ★ O2-LIB (30.10.2026): die neun Sprachen des Gerüsts mit eigenem Zweig - nie Englisch, nie Deutsch.
  if (sprache === "bg") return legendenTextBg(s, art);
  if (sprache === "el") return legendenTextEl(s, art);
  if (sprache === "hu") return legendenTextHu(s, art);
  if (sprache === "nl") return legendenTextNl(s, art);
  if (sprache === "pt") return legendenTextPt(s, art);
  if (sprache === "br") return legendenTextBr(s, art);
  if (sprache === "ro") return legendenTextRo(s, art);
  if (sprache === "sv") return legendenTextSv(s, art);
  if (sprache === "uk") return legendenTextUk(s, art);
  if (sprache === "cs") return legendenTextCs(s, art);
  if (sprache === "tr") return legendenTextTr(s, art);
  if (sprache === "pl") return legendenTextPl(s, art);
  if (sprache === "it") return legendenTextIt(s, art);
  if (sprache === "fr") return legendenTextFr(s, art);
  if (sprache === "es") return legendenTextEs(s, art);
  if (sprache === "en") return legendenTextEn(s, art);
  switch (s.schluessel) {
    case "name":
      return "Der Name des Kindes. Die Kinder stehen alphabetisch.";
    case "stufe":
      return LEISTUNGSSTUFE_HILFE;
    case "tastenSitzen":
      return `${TASTEN_HILFE} ${LEGENDE_ZUSATZ.tasten}`;
    case "tastenFrei":
      return "Die zweite Zahl zu „Tasten sitzen“ - siehe dort.";
    case "uebezeit":
      return `${UEBEZEIT_HILFE} ${LEGENDE_ZUSATZ.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START)} ${LEGENDE_ZUSATZ.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return `Die zweite Zahl zu „${WOCHENZIEL_KOPF_MINUTEN}“ - siehe dort.`;
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art })} ${LEGENDE_ZUSATZ.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer")} ${LEGENDE_ZUSATZ.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo")} ${LEGENDE_ZUSATZ.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score")} ${LEGENDE_ZUSATZ.ohneVeraenderung}`;
    case "challenges":
      return `${HINWEIS_CHALLENGE.spalte} ${LEGENDE_ZUSATZ.challenges}`;
    case "challengeSchnitt":
      return `Die zweite Zahl zu „${PRUEFUNG_WORT_MEHRZAHL}“ - siehe dort.`;
  }
}

/**
 * ★ EN6a: die Legende englisch - dieselben Sätze wie die Hinweise an den
 * Spaltenköpfen der englischen Bedienung (`leistungSpaltenHilfen("en")`,
 * `spaltenGrund(…, "en")`, `wochenzielHilfe(…, "en")`, `HINWEIS_CHALLENGE_EN`),
 * dahinter höchstens EIN Zusatzsatz - dieselbe Regel wie im Deutschen.
 */
function legendenTextEn(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("en");
  const Z = LEGENDE_ZUSATZ_EN;
  switch (s.schluessel) {
    case "name":
      return "The pupil's name. The pupils are listed in alphabetical order.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return "The second number for “Keys mastered” - see there.";
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "en")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return `The second number for “${WOCHENZIEL_KOPF_MINUTEN_EN}” - see there.`;
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "en")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "en")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "en")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "en")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `${HINWEIS_CHALLENGE_EN.spalte} ${Z.challenges}`;
    case "challengeSchnitt":
      return `The second number for “${PRUEFUNG_WORT_MEHRZAHL_EN}” - see there.`;
  }
}

/**
 * ★ E11a-3 (26.09.2026): dieselbe Legende französisch - dieselben Sätze wie
 * die Hinweise an den Spaltenköpfen der französischen Bedienung
 * (`leistungSpaltenHilfen("fr")`, `spaltenGrund(…, "fr")`,
 * `wochenzielHilfe(…, "fr")`). „challenges"/„challengeSchnitt" bleiben
 * englisch (siehe {@link LEGENDE_ZUSATZ_FR}).
 */
function legendenTextFr(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("fr");
  const Z = LEGENDE_ZUSATZ_FR;
  switch (s.schluessel) {
    case "name":
      return "Le prénom de l'élève. Les élèves sont classés par ordre alphabétique.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return "Le deuxième nombre pour \"Touches acquises\" - voir là.";
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "fr")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return `Le deuxième nombre pour "${WOCHENZIEL_KOPF_MINUTEN_FR}" - voir là.`;
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "fr")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "fr")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "fr")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "fr")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `${HINWEIS_CHALLENGE_FR.spalte} ${Z.challenges}`;
    case "challengeSchnitt":
      return `Le deuxième nombre pour "${PRUEFUNG_WORT_MEHRZAHL_FR}" - voir là.`;
  }
}

/** ★ O-IT (02.10.2026): dieselbe Legende italienisch - dieselben Sätze wie die Hinweise der italienischen Bedienung. */
function legendenTextIt(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("it");
  const Z = LEGENDE_ZUSATZ_IT;
  switch (s.schluessel) {
    case "name":
      return "Il nome della persona. Gli alunni sono in ordine alfabetico.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return `Il secondo numero di "Tasti sicuri" - vedi lì.`;
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "it")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return `Il secondo numero di "${WOCHENZIEL_KOPF_MINUTEN_IT}" - vedi lì.`;
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "it")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "it")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "it")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "it")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `${HINWEIS_CHALLENGE_IT.spalte} ${Z.challenges}`;
    case "challengeSchnitt":
      return `Il secondo numero di "${PRUEFUNG_WORT_MEHRZAHL_IT}" - vedi lì.`;
  }
}

/** ★ O-PL (02.10.2026): dieselbe Legende polnisch - dieselben Sätze wie die Hinweise der polnischen Bedienung. */
function legendenTextPl(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("pl");
  const Z = LEGENDE_ZUSATZ_PL;
  switch (s.schluessel) {
    case "name":
      return "Imię osoby. Uczniowie są w kolejności alfabetycznej.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return "Druga liczba do kolumny „Opanowane klawisze” - zobacz tam.";
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "pl")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return `Druga liczba do kolumny „${WOCHENZIEL_KOPF_MINUTEN_PL}” - zobacz tam.`;
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "pl")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "pl")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "pl")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "pl")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `${HINWEIS_CHALLENGE_PL.spalte} ${Z.challenges}`;
    case "challengeSchnitt":
      return `Druga liczba do kolumny „${PRUEFUNG_WORT_MEHRZAHL_PL}” - zobacz tam.`;
  }
}

/** ★ O-TR (02.10.2026): dieselbe Legende türkisch - dieselben Sätze wie die Hinweise der türkischen Bedienung. */
function legendenTextTr(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("tr");
  const Z = LEGENDE_ZUSATZ_TR;
  switch (s.schluessel) {
    case "name":
      return "Öğrencinin adı. Öğrenciler alfabetik sıradadır.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return `"Oturmuş tuşlar" sütununun ikinci sayısı - oraya bakın.`;
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "tr")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return `"${WOCHENZIEL_KOPF_MINUTEN_TR}" sütununun ikinci sayısı - oraya bakın.`;
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "tr")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "tr")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "tr")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "tr")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `${HINWEIS_CHALLENGE_TR.spalte} ${Z.challenges}`;
    case "challengeSchnitt":
      return `"${PRUEFUNG_WORT_MEHRZAHL_TR}" sütununun ikinci sayısı - oraya bakın.`;
  }
}

/** ★ O-CS (03.10.2026): dieselbe Legende tschechisch - dieselben Sätze wie die Hinweise der tschechischen Bedienung. */
function legendenTextCs(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("cs");
  const Z = LEGENDE_ZUSATZ_CS;
  switch (s.schluessel) {
    case "name":
      return "Jméno osoby. Žáci jsou seřazeni podle abecedy.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return "Druhé číslo ke sloupci „Jisté klávesy“ - viz tam.";
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "cs")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return `Druhé číslo ke sloupci „${WOCHENZIEL_KOPF_MINUTEN_CS}“ - viz tam.`;
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "cs")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "cs")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "cs")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "cs")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `${HINWEIS_CHALLENGE_CS.spalte} ${Z.challenges}`;
    case "challengeSchnitt":
      return `Druhé číslo ke sloupci „${PRUEFUNG_WORT_MEHRZAHL_CS}“ - viz tam.`;
  }
}

/** ★ ES-O (27.09.2026): dieselbe Legende spanisch - dieselben Sätze wie die Hinweise der spanischen Bedienung. */
function legendenTextEs(s: LeistungsSpalte, art: ZeitraumArt): string {
  const H = leistungSpaltenHilfen("es");
  const Z = LEGENDE_ZUSATZ_ES;
  switch (s.schluessel) {
    case "name":
      return "El nombre de la persona. El alumnado aparece por orden alfabético.";
    case "stufe":
      return H.leistungsstufe;
    case "tastenSitzen":
      return `${H.tasten} ${Z.tasten}`;
    case "tastenFrei":
      return "El segundo número de \"Teclas aprendidas\" - véase allí.";
    case "uebezeit":
      return `${H.uebezeit} ${Z.uebezeit}`;
    case "wochenzielMinuten":
      return `${wochenzielHilfe(ZEITRAUM_START, "es")} ${Z.wochenzielWoche}`;
    case "wochenzielErledigtMinuten":
      return `El segundo número de "${WOCHENZIEL_KOPF_MINUTEN_ES}" - véase allí.`;
    case "wochenaufgabenProzent":
      return `${wochenzielHilfe({ ...ZEITRAUM_START, art }, "es")} ${Z.wochenaufgaben}`;
    case "treffsicherheit":
      return `${spaltenGrund("treffer", "es")} ${Z.ohneVeraenderung}`;
    case "anschlaege":
      return `${spaltenGrund("tempo", "es")} ${Z.ohneVeraenderung}`;
    case "score":
      return `${spaltenGrund("score", "es")} ${Z.ohneVeraenderung}`;
    case "challenges":
      return `${HINWEIS_CHALLENGE_ES.spalte} ${Z.challenges}`;
    case "challengeSchnitt":
      return `El segundo número de "${PRUEFUNG_WORT_MEHRZAHL_ES}" - véase allí.`;
  }
}

/**
 * ★★★ Die Legende: JEDE Spalte der Datenblätter, in ihrer Reihenfolge, dazu die
 * Gruppen „Üben" und „Prüfung" vor ihren Spalten.
 *
 * Die Blätter haben nicht alle dieselben Spalten („Wochenziel" gibt es nur in
 * „Woche", „Einheiten gesamt" nur in „Schuljahr" und „Gesamt"). Jede Spalte
 * steht darum einmal da - an der Stelle, an der sie in ihrem Blatt steht:
 * vor der nächsten Spalte, die schon eingereiht ist.
 */
export function leistungLegende(blaetter: readonly LeistungsBlatt[]): LegendenEintrag[] {
  const reihe: { spalte: LeistungsSpalte; art: ZeitraumArt }[] = [];
  const stelle = (kopf: string) => reihe.findIndex((r) => r.spalte.kopf === kopf);
  for (const b of blaetter) {
    b.spalten.forEach((s, i) => {
      if (stelle(s.kopf) >= 0) return;
      const naechste = b.spalten
        .slice(i + 1)
        .map((n) => stelle(n.kopf))
        .find((x) => x >= 0);
      const eintrag = { spalte: s, art: b.art };
      if (naechste === undefined) reihe.push(eintrag);
      else reihe.splice(naechste, 0, eintrag);
    });
  }
  // ★ EN6a: Die Sprache steht an den Blättern selbst (`LeistungsBlatt.sprache`).
  const sprache: ExportSprache = blaetter[0]?.sprache ?? "de";
  const hilfen = leistungSpaltenHilfen(sprache);
  const legende: LegendenEintrag[] = [];
  let gruppe: SpaltenGruppe | null = null;
  for (const r of reihe) {
    if (r.spalte.gruppe !== gruppe) {
      gruppe = r.spalte.gruppe;
      if (gruppe === "ueben" || gruppe === "pruefung")
        legende.push({
          art: "gruppe",
          name:
            sprache === "cs"
              ? `Skupina „${GRUPPEN_NAME_CS[gruppe]}“`
              : sprache === "tr"
              ? `"${GRUPPEN_NAME_TR[gruppe]}" grubu`
              : sprache === "pl"
              ? `Grupa „${GRUPPEN_NAME_PL[gruppe]}”`
              : sprache === "it"
              ? `Gruppo "${GRUPPEN_NAME_IT[gruppe]}"`
              : sprache === "fr"
              ? `Groupe "${GRUPPEN_NAME_FR[gruppe]}"`
              : sprache === "es"
                ? `Grupo "${GRUPPEN_NAME_ES[gruppe]}"`
                : sprache === "en"
                ? `Group “${GRUPPEN_NAME_EN[gruppe]}”`
                : `Gruppe „${GRUPPEN_NAME[gruppe]}“`,
          text: gruppe === "ueben" ? hilfen.uebenGruppe : hilfen.pruefungGruppe,
        });
    }
    legende.push({
      art: "spalte",
      name: r.spalte.kopf,
      text: legendenText(r.spalte, r.art, sprache),
    });
  }
  return legende;
}

/**
 * ★ O2-LIB (30.10.2026): „Как се изчислява резултатът" bulgarisch - Güte ⇒ качество
 * („точност" ist schon die Treffsicherheit, Glossar §2.2), Tempo-Anteil ⇒ дял на скоростта,
 * Fehlgriff ⇒ погрешен клавиш; Dezimalkomma. Zahl + Hauptwort in der Zählform (§2.11);
 * kein Satz endet auf einer ganzen Zahl mit Punkt (§4 Falle 4).
 */
function scoreBerechnungBg(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    x.toLocaleString("bg-BG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(guete);
  const v = zwei(tempo);
  const znaci = (n: number) =>
    mehrzahl(n, "bg", {
      one: (z) => `${z} знак`,
      other: (z) => `${z} знака`,
    });
  const greshki = (n: number) =>
    mehrzahl(n, "bg", {
      one: (z) => `${z} погрешен клавиш`,
      other: (z) => `${z} погрешни клавиша`,
    });
  const skorost = (n: number) =>
    mehrzahl(n, "bg", {
      one: (z) => `${z} знак в минута`,
      other: (z) => `${z} знака в минута`,
    });
  const tochki = (n: number) =>
    mehrzahl(n, "bg", {
      one: (z) => `${z} точка`,
      other: (z) => `${z} точки`,
    });
  return [
    {
      name: "1. Качество",
      text:
        `Броят написани знаци, разделен на (знаци + ${gewicht} × погрешни клавиши). ` +
        `Един погрешен клавиш тежи колкото ${znaci(gewicht)}. Без погрешни клавиши качеството е равно на 1.`,
    },
    {
      name: "2. Дял на скоростта",
      text:
        `Знаците в минута, разделени на ${BEZUGSTEMPO} (над ${BEZUGSTEMPO} не се брои допълнително), ` +
        `от това квадратен корен. Който пише два пъти по-бързо, не получава двойно, ` +
        `а около 1,4 пъти повече.`,
    },
    {
      name: "3. Резултат",
      text:
        "100 × качество × дял на скоростта, закръглено до цяло число. Резултатът е винаги " +
        "между 0 и 100 и никога не е отрицателен.",
    },
    {
      name: "Пример",
      text:
        `Написани са ${znaci(bsp.zeichen)} с ${greshki(bsp.fehler)}. Качество = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. Скорост: ${skorost(bsp.anschlaege)}. ` +
        `Дял на скоростта = квадратен корен от (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Резултат = 100 × ${g} × ${v} = ${tochki(Math.round(wert))}.`,
    },
    {
      name: "Твърде малко текст",
      text: `Когато в периода са написани по-малко от ${znaci(MIND_ZEICHEN_WERTUNG)}, резултат не се изчислява - вместо него стои знакът „-“.`,
    },
    {
      name: "Предизвикателство",
      text: "Резултатът от Предизвикателство се изчислява по същия начин.",
    },
  ];
}

/**
 * ★ O-EL-LIB (30.10.2026): «Πώς υπολογίζεται το σκορ» griechisch - Güte ⇒ ποιότητα («ακρίβεια» ist
 * schon die Treffsicherheit, Glossar §2.2), Tempo-Anteil ⇒ μερίδιο ταχύτητας, Fehlgriff ⇒ λάθος πλήκτρο;
 * Dezimalkomma. Dieselben Zahlen aus derselben Rechnung wie die deutsche Fassung.
 */
function scoreBerechnungEl(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    x.toLocaleString("el-GR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(guete);
  const v = zwei(tempo);
  return [
    {
      name: "1. Ποιότητα",
      text:
        `Οι χαρακτήρες που γράφτηκαν διαιρούνται με (χαρακτήρες + ${gewicht} × λάθη πλήκτρων). ` +
        `Ένα λάθος πλήκτρο μετράει δηλαδή όσο ${gewicht} χαρακτήρες. Χωρίς λάθος πλήκτρο η ποιότητα είναι 1.`,
    },
    {
      name: "2. Μερίδιο ταχύτητας",
      text:
        `Τα πατήματα ανά λεπτό διαιρούνται με ${BEZUGSTEMPO} (ό,τι περνά το ${BEZUGSTEMPO} δεν μετράει επιπλέον) ` +
        `και από το αποτέλεσμα βγαίνει η τετραγωνική ρίζα. Η διπλάσια ταχύτητα δεν δίνει λοιπόν το διπλάσιο, ` +
        `αλλά περίπου 1,4 φορές περισσότερο.`,
    },
    {
      name: "3. Σκορ",
      text:
        "100 × ποιότητα × μερίδιο ταχύτητας, στρογγυλεμένο σε ακέραιο αριθμό. Είναι πάντα μεταξύ 0 και 100 " +
        "και ποτέ αρνητικό.",
    },
    {
      name: "Παράδειγμα",
      text:
        `${bsp.zeichen} χαρακτήρες με ${bsp.fehler} λάθη πλήκτρων: ποιότητα = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. ${bsp.anschlaege} πατήματα ανά λεπτό: ` +
        `μερίδιο ταχύτητας = τετραγωνική ρίζα του (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Σκορ = 100 × ${g} × ${v} = ${Math.round(wert)}.`,
    },
    {
      name: "Πολύ λίγο κείμενο",
      text: `Με λιγότερους από ${MIND_ZEICHEN_WERTUNG} χαρακτήρες στην περίοδο δεν υπολογίζεται σκορ - εμφανίζεται παύλα.`,
    },
    {
      name: "Πρόκληση",
      text: "Το σκορ της Πρόκλησης υπολογίζεται με τον ίδιο τρόπο.",
    },
  ];
}

/**
 * ★ O2-LIB (30.10.2026): „A pontszám számítása" ungarisch - Güte ⇒ minőség, Tempo-Anteil ⇒
 * sebességarány, Fehlgriff ⇒ elütés (Glossar §2.2/§2.12); Dezimalkomma. Zahl + Hauptwort in
 * der Einzahl (Regel 13); kein Satz endet auf einer Zahl mit Punkt (§4 Falle 4), keine
 * Endung an einer Zahl (Regel 12).
 */
function scoreBerechnungHu(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    x.toLocaleString("hu-HU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(guete);
  const v = zwei(tempo);
  const karakter = (n: number) =>
    mehrzahl(n, "hu", {
      one: (z) => `${z} karakter`,
      other: (z) => `${z} karakter`,
    });
  const elutes = (n: number) =>
    mehrzahl(n, "hu", {
      one: (z) => `${z} elütés`,
      other: (z) => `${z} elütés`,
    });
  const leutes = (n: number) =>
    mehrzahl(n, "hu", {
      one: (z) => `${z} leütés percenként`,
      other: (z) => `${z} leütés percenként`,
    });
  const pont = (n: number) =>
    mehrzahl(n, "hu", {
      one: (z) => `${z} pont`,
      other: (z) => `${z} pont`,
    });
  return [
    {
      name: "1. Minőség",
      text:
        `A megírt karakterek száma osztva (karakterek + ${gewicht} × elütések) értékével. ` +
        `Egy elütés tehát annyit számít, mint ${karakter(gewicht)}. Elütés nélkül a minőség egy.`,
    },
    {
      name: "2. Sebességarány",
      text:
        `A percenkénti leütések száma osztva ezzel: ${BEZUGSTEMPO} (efölött már semmi nem számít többletnek), ` +
        `ennek a négyzetgyöke. Aki kétszer olyan gyorsan gépel, nem a kétszeresét kapja, ` +
        `hanem csak nagyjából 1,4-szer annyit.`,
    },
    {
      name: "3. Pontszám",
      text:
        "100 × minőség × sebességarány, egész számra kerekítve. Mindig 0 és 100 között van, " +
        "és soha nem negatív.",
    },
    {
      name: "Példa",
      text:
        `Megírva: ${karakter(bsp.zeichen)} és ${elutes(bsp.fehler)}. Minőség = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. Sebesség: ${leutes(bsp.anschlaege)}. ` +
        `Sebességarány = négyzetgyök (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Pontszám = 100 × ${g} × ${v} = ${pont(Math.round(wert))}.`,
    },
    {
      name: "Túl kevés szöveg",
      text: `Ha az időszakban a megírt karakterek száma ${MIND_ZEICHEN_WERTUNG} alatt marad, nem számolódik pontszám - helyette a „-” jel áll.`,
    },
    {
      name: "Kihívás",
      text: "A Kihívás pontszáma ugyanígy jön ki.",
    },
  ];
}

/**
 * ★ O2-LIB (29.10.2026): "Zo wordt de score berekend" niederländisch - Güte ⇒ kwaliteit ("nauwkeurigheid" ist schon die
 * Treffsicherheit), Tempo-Anteil ⇒ snelheidsaandeel, Fehlgriff ⇒ verkeerde toets; Dezimalkomma (Glossar nl Regel 5).
 */
function scoreBerechnungNl(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    x.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(guete);
  const v = zwei(tempo);
  const tekens = (n: number) =>
    mehrzahl(n, "nl", { one: (z) => `${z} teken`, other: (z) => `${z} tekens` });
  const toetsen = (n: number) =>
    mehrzahl(n, "nl", { one: (z) => `${z} verkeerde toets`, other: (z) => `${z} verkeerde toetsen` });
  const aanslagen = (n: number) =>
    mehrzahl(n, "nl", { one: (z) => `${z} aanslag per minuut`, other: (z) => `${z} aanslagen per minuut` });
  return [
    {
      name: "1. Kwaliteit",
      text:
        `Aantal getypte tekens gedeeld door (tekens + ${gewicht} × verkeerde toetsen). ` +
        `Een verkeerde toets telt dus als ${tekens(gewicht)}. Zonder verkeerde toetsen is de kwaliteit 1.`,
    },
    {
      name: "2. Snelheidsaandeel",
      text:
        `Aanslagen per minuut gedeeld door ${BEZUGSTEMPO} (wat boven ${BEZUGSTEMPO} komt, telt niet extra mee), ` +
        `daarvan de wortel. Wie twee keer zo snel typt, krijgt dus niet het dubbele, ` +
        `maar ongeveer 1,4 keer zoveel.`,
    },
    {
      name: "3. Score",
      text:
        "100 × kwaliteit × snelheidsaandeel, afgerond op een geheel getal. De score ligt altijd tussen 0 en 100 " +
        "en wordt nooit negatief.",
    },
    {
      name: "Voorbeeld",
      text:
        `Getypt: ${tekens(bsp.zeichen)} met ${toetsen(bsp.fehler)}. Kwaliteit = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. Snelheid: ${aanslagen(bsp.anschlaege)}. ` +
        `Snelheidsaandeel = wortel uit (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Score = 100 × ${g} × ${v} = ${Math.round(wert)}.`,
    },
    {
      name: "Te weinig tekst",
      text: `Bij minder dan ${tekens(MIND_ZEICHEN_WERTUNG)} getypt in de periode wordt geen score berekend - in plaats daarvan staat er een streepje.`,
    },
    {
      name: "Uitdaging",
      text: "De score van de Uitdaging wordt op dezelfde manier berekend.",
    },
  ];
}

/**
 * ★ O-LIB (30.10.2026): "Como se calcula a pontuação" em português (Portugal) - Güte ⇒ qualidade ("precisão"
 * é já a Treffsicherheit, Glossar §2.2), Tempo-Anteil ⇒ fator de velocidade (§2.13), Fehlgriff ⇒ tecla errada;
 * vírgula decimal (Regel 5). Número + substantivo com todas as formas (§2.11); nenhuma frase termina
 * num número inteiro com ponto.
 */
function scoreBerechnungPt(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    x.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(guete);
  const v = zwei(tempo);
  const carateres = (n: number) =>
    mehrzahl(n, "pt", {
      one: (z) => `${z} caráter`,
      other: (z) => `${z} carateres`,
      many: (z) => `${z} de carateres`,
    });
  const teclasErradas = (n: number) =>
    mehrzahl(n, "pt", {
      one: (z) => `${z} tecla errada`,
      other: (z) => `${z} teclas erradas`,
      many: (z) => `${z} de teclas erradas`,
    });
  const toques = (n: number) =>
    mehrzahl(n, "pt", {
      one: (z) => `${z} toque por minuto`,
      other: (z) => `${z} toques por minuto`,
      many: (z) => `${z} de toques por minuto`,
    });
  const pontos = (n: number) =>
    mehrzahl(n, "pt", {
      one: (z) => `${z} ponto`,
      other: (z) => `${z} pontos`,
      many: (z) => `${z} de pontos`,
    });
  return [
    {
      name: "1. Qualidade",
      text:
        `Número de carateres escritos dividido por (carateres + ${gewicht} × teclas erradas). ` +
        `Uma tecla errada conta, portanto, como ${carateres(gewicht)}. Sem teclas erradas, a qualidade é igual a um.`,
    },
    {
      name: "2. Fator de velocidade",
      text:
        `Toques por minuto divididos por ${BEZUGSTEMPO} (acima de ${BEZUGSTEMPO} não conta mais), ` +
        `e disso a raiz quadrada. Quem escreve ao dobro da velocidade não obtém, por isso, o dobro, ` +
        `mas cerca de 1,4 vezes.`,
    },
    {
      name: "3. Pontuação",
      text:
        "100 × qualidade × fator de velocidade, arredondado para um número inteiro. A pontuação fica sempre " +
        "entre 0 e 100 e nunca é negativa.",
    },
    {
      name: "Exemplo",
      text:
        `Escritos: ${carateres(bsp.zeichen)} com ${teclasErradas(bsp.fehler)}. Qualidade = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. Velocidade: ${toques(bsp.anschlaege)}. ` +
        `Fator de velocidade = raiz quadrada de (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Pontuação = 100 × ${g} × ${v} = ${pontos(Math.round(wert))}.`,
    },
    {
      name: "Texto a menos",
      text: `Quando se escrevem menos de ${carateres(MIND_ZEICHEN_WERTUNG)} no período, não se calcula pontuação - em vez dela aparece um hífen.`,
    },
    {
      name: "Desafio",
      text: "A pontuação do Desafio calcula-se da mesma forma.",
    },
  ];
}

/**
 * ★ O2-LIB (29.10.2026): "Como a pontuação é calculada", Portugiesisch (Brasilien) - Güte ⇒ qualidade
 * ("precisão" ist schon die Treffsicherheit), Tempo-Anteil ⇒ fator de velocidade, Fehlgriff ⇒ erro;
 * Dezimalkomma. Zahl + Hauptwort über mehrzahl() (one/other; die Null kommt hier nie vor); kein Satz
 * endet auf einer ganzen Zahl mit Punkt.
 */
function scoreBerechnungBr(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    x.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(guete);
  const v = zwei(tempo);
  const caracteres = (n: number) =>
    mehrzahl(n, "br", { one: (z) => `${z} caractere`, other: (z) => `${z} caracteres` });
  const erros = (n: number) =>
    mehrzahl(n, "br", { one: (z) => `${z} erro`, other: (z) => `${z} erros` });
  const toques = (n: number) =>
    mehrzahl(n, "br", {
      one: (z) => `${z} toque por minuto`,
      other: (z) => `${z} toques por minuto`,
    });
  const pontos = (n: number) =>
    mehrzahl(n, "br", { one: (z) => `${z} ponto`, other: (z) => `${z} pontos` });
  return [
    {
      name: "1. Qualidade",
      text:
        `Caracteres digitados divididos por (caracteres + ${gewicht} × erros). ` +
        `Assim, um erro conta como ${caracteres(gewicht)}. Sem erros, a qualidade é igual a 1.`,
    },
    {
      name: "2. Fator de velocidade",
      text:
        `Toques por minuto divididos por ${BEZUGSTEMPO} (o que passa de ${BEZUGSTEMPO} não conta a mais), ` +
        `e disso a raiz quadrada. Quem digita com o dobro da velocidade não recebe o dobro, ` +
        `mas cerca de 1,4 vez.`,
    },
    {
      name: "3. Pontuação",
      text:
        "100 × qualidade × fator de velocidade, arredondado para um número inteiro. Fica sempre " +
        "entre 0 e 100 e nunca é negativa.",
    },
    {
      name: "Exemplo",
      text:
        `Digitados: ${caracteres(bsp.zeichen)} e ${erros(bsp.fehler)}. Qualidade = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. Velocidade: ${toques(bsp.anschlaege)}. ` +
        `Fator de velocidade = raiz quadrada de (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Pontuação = 100 × ${g} × ${v} = ${pontos(Math.round(wert))}.`,
    },
    {
      name: "Pouco texto",
      text: `Com menos de ${caracteres(MIND_ZEICHEN_WERTUNG)} digitados no período, a pontuação não é calculada - no lugar dela aparece um traço.`,
    },
    {
      name: "Desafio",
      text: "A pontuação do Desafio é calculada do mesmo jeito.",
    },
  ];
}

/**
 * ★ O2-LIB (29.10.2026): „Cum se calculează scorul“ rumänisch - Güte ⇒ calitate,
 * Tempo-Anteil ⇒ ponderea vitezei, Fehlgriff ⇒ greșeală; Dezimalkomma (Regel 5). Zahl +
 * Hauptwort mit den drei Formen (§2.11, „de“ ab 20); kein Satz endet auf einer ganzen Zahl mit Punkt.
 */
function scoreBerechnungRo(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    x.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(guete);
  const v = zwei(tempo);
  const caractere = (n: number) =>
    mehrzahl(n, "ro", {
      one: (z) => `${z} caracter`,
      few: (z) => `${z} caractere`,
      other: (z) => `${z} de caractere`,
    });
  const greseli = (n: number) =>
    mehrzahl(n, "ro", {
      one: (z) => `${z} greșeală`,
      few: (z) => `${z} greșeli`,
      other: (z) => `${z} de greșeli`,
    });
  const viteza = (n: number) =>
    mehrzahl(n, "ro", {
      one: (z) => `${z} caracter pe minut`,
      few: (z) => `${z} caractere pe minut`,
      other: (z) => `${z} de caractere pe minut`,
    });
  const puncte = (n: number) =>
    mehrzahl(n, "ro", {
      one: (z) => `${z} punct`,
      few: (z) => `${z} puncte`,
      other: (z) => `${z} de puncte`,
    });
  return [
    {
      name: "1. Calitate",
      text:
        `Numărul de caractere scrise împărțit la (caractere + ${gewicht} × greșeli). ` +
        `O greșeală se numără deci ca ${caractere(gewicht)}. Fără greșeli, calitatea este egală cu unu.`,
    },
    {
      name: "2. Ponderea vitezei",
      text:
        `Caractere pe minut împărțite la ${BEZUGSTEMPO} (peste ${BEZUGSTEMPO} nu se mai numără nimic în plus), ` +
        `din rezultat rădăcina pătrată. Cine scrie de două ori mai repede nu primește deci dublul, ` +
        `ci aproximativ de 1,4 ori mai mult.`,
    },
    {
      name: "3. Scor",
      text:
        "100 × calitate × ponderea vitezei, rotunjit la un număr întreg. Scorul este mereu " +
        "între 0 și 100 și nu este niciodată negativ.",
    },
    {
      name: "Exemplu",
      text:
        `Scrise: ${caractere(bsp.zeichen)} și ${greseli(bsp.fehler)}. Calitate = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. Viteză: ${viteza(bsp.anschlaege)}. ` +
        `Ponderea vitezei = rădăcina pătrată din (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Scor = 100 × ${g} × ${v} = ${puncte(Math.round(wert))}.`,
    },
    {
      name: "Prea puțin text",
      text: `Dacă în perioadă se scriu mai puțin de ${caractere(MIND_ZEICHEN_WERTUNG)}, scorul nu se calculează - în loc de el apare semnul „-”.`,
    },
    {
      name: "Provocare",
      text: "Scorul unei Provocări se calculează la fel.",
    },
  ];
}

/**
 * ★ O2-LIB (30.10.2026): "Så räknas poängen ut" schwedisch - Güte ⇒ kvalitet ("träffsäkerhet" ist schon die
 * Treffsicherheit), Tempo-Anteil ⇒ hastighetsandel, Fehlgriff ⇒ felslag; Dezimalkomma (Glossar sv Regel 6).
 */
function scoreBerechnungSv(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    x.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(guete);
  const v = zwei(tempo);
  const tecken = (n: number) =>
    mehrzahl(n, "sv", { one: (z) => `${z} tecken`, other: (z) => `${z} tecken` });
  const felslag = (n: number) =>
    mehrzahl(n, "sv", { one: (z) => `${z} felslag`, other: (z) => `${z} felslag` });
  const anslag = (n: number) =>
    mehrzahl(n, "sv", { one: (z) => `${z} anslag per minut`, other: (z) => `${z} anslag per minut` });
  return [
    {
      name: "1. Kvalitet",
      text:
        `Antal skrivna tecken delat med (tecken + ${gewicht} × felslag). ` +
        `Ett felslag räknas alltså som ${tecken(gewicht)}. Utan felslag är kvaliteten 1.`,
    },
    {
      name: "2. Hastighetsandel",
      text:
        `Anslag per minut delat med ${BEZUGSTEMPO} (allt över ${BEZUGSTEMPO} räknas inte extra), ` +
        `och av det kvadratroten. Den som skriver dubbelt så fort får alltså inte dubbelt så mycket, ` +
        `utan ungefär 1,4 gånger så mycket.`,
    },
    {
      name: "3. Poäng",
      text:
        "100 × kvalitet × hastighetsandel, avrundat till ett heltal. Poängen ligger alltid mellan 0 och 100 " +
        "och blir aldrig negativ.",
    },
    {
      name: "Exempel",
      text:
        `Skrivet: ${tecken(bsp.zeichen)} med ${felslag(bsp.fehler)}. Kvalitet = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. Hastighet: ${anslag(bsp.anschlaege)}. ` +
        `Hastighetsandel = kvadratroten ur (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Poäng = 100 × ${g} × ${v} = ${Math.round(wert)}.`,
    },
    {
      name: "För lite text",
      text: `Om färre än ${tecken(MIND_ZEICHEN_WERTUNG)} skrivs under perioden räknas ingen poäng ut - i stället står det ett streck.`,
    },
    {
      name: "Utmaning",
      text: "Utmaningens poäng räknas ut på samma sätt.",
    },
  ];
}

/**
 * ★ O2-LIB (30.10.2026): „Як рахуються бали" ukrainisch - Güte ⇒ якість („точність" ist schon die Treffsicherheit,
 * Glossar §2.2), Tempo-Anteil ⇒ частка швидкості, Fehlgriff ⇒ хибне натискання; Dezimalkomma (Regel 5). Zahl + Hauptwort
 * mit allen vier Formen (§2.11); kein Satz endet auf einer ganzen Zahl mit Punkt (§4 Falle 4).
 */
function scoreBerechnungUk(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    x.toLocaleString("uk-UA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(guete);
  const v = zwei(tempo);
  const znaky = (n: number) =>
    mehrzahl(n, "uk", {
      one: (z) => `${z} знак`,
      few: (z) => `${z} знаки`,
      many: (z) => `${z} знаків`,
      other: (z) => `${z} знака`,
    });
  const hybni = (n: number) =>
    mehrzahl(n, "uk", {
      one: (z) => `${z} хибне натискання`,
      few: (z) => `${z} хибні натискання`,
      many: (z) => `${z} хибних натискань`,
      other: (z) => `${z} хибного натискання`,
    });
  const znakivZaHvylynu = (n: number) =>
    mehrzahl(n, "uk", {
      one: (z) => `${z} знак за хвилину`,
      few: (z) => `${z} знаки за хвилину`,
      many: (z) => `${z} знаків за хвилину`,
      other: (z) => `${z} знака за хвилину`,
    });
  const baly = (n: number) =>
    mehrzahl(n, "uk", {
      one: (z) => `${z} бал`,
      few: (z) => `${z} бали`,
      many: (z) => `${z} балів`,
      other: (z) => `${z} бала`,
    });
  return [
    {
      name: "1. Якість",
      text:
        `Кількість надрукованих знаків, поділена на (знаки + ${gewicht} × хибні натискання). ` +
        `Тобто одне хибне натискання враховується як ${znaky(gewicht)}. Без хибних натискань якість дорівнює одиниці.`,
    },
    {
      name: "2. Частка швидкості",
      text:
        `Знаків за хвилину, поділених на ${BEZUGSTEMPO} (усе, що понад ${BEZUGSTEMPO}, додатково не враховується), ` +
        `і з результату береться квадратний корінь. Хто друкує вдвічі швидше, отримує не вдвічі більше, ` +
        `а приблизно в 1,4 раза більше.`,
    },
    {
      name: "3. Бали",
      text:
        "100 × якість × частка швидкості, округлено до цілого числа. Бали завжди лежать " +
        "між 0 і 100 і ніколи не бувають від'ємними.",
    },
    {
      name: "Приклад",
      text:
        `Надруковано: ${znaky(bsp.zeichen)} і ${hybni(bsp.fehler)}. Якість = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. Швидкість: ${znakivZaHvylynu(bsp.anschlaege)}. ` +
        `Частка швидкості = квадратний корінь із (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Бали = 100 × ${g} × ${v} = ${baly(Math.round(wert))}.`,
    },
    {
      name: "Замало тексту",
      text: `Якщо за період надруковано менше ніж ${znaky(MIND_ZEICHEN_WERTUNG)}, бали не рахуються - замість них стоїть знак «-».`,
    },
    {
      name: "Виклик",
      text: "Бали Виклику рахуються так само.",
    },
  ];
}

/**
 * ★★★ „WIE WIRD EIN SCORE BERECHNET" (Johannes 13.09.2026) - in einfacher
 * Sprache, nach dem Code: `werte()` in `schreibprobeWertung.ts`, angewandt
 * auf die Übungsdaten in `score.ts` (`scoreAusStats`: Zeichen, Fehlgriffe und
 * das ⌀ Tempo des Zeitraums).
 *
 *     Güte          = Zeichen / (Zeichen + 5 × Fehlgriffe)
 *     Tempo-Anteil  = Wurzel( min(1, Anschläge je Minute / 240) )
 *     Score         = 100 × Güte × Tempo-Anteil
 *
 * ⚠️ Alle Zahlen kommen aus den Konstanten der Rechnung, und das Beispiel
 * rechnet `werte()` selbst - ändert sich die Formel, ändert sich der Text.
 */
export function scoreBerechnung(
  /** ★ EN6a: ohne Angabe Deutsch, genau die Sätze von vorher. */
  sprache: ExportSprache = "de",
): { name: string; text: string }[] {
  const bsp = { zeichen: 1000, fehler: 10, anschlaege: 135 };
  const w = werte(bsp);
  // ★ 23.09.2026 („Freies Schreiben"): über den Modus geholt statt über die
  // Konstante direkt - Übungsdaten kennen keinen Modus, hier gilt darum immer
  // STRENG (die Vorgabe von `fehlerGewicht()` ohne Argument).
  const gewicht = fehlerGewicht();
  // ★ O2-LIB (30.10.2026): die neun Sprachen des Gerüsts mit eigenem Zweig - nie Englisch, nie Deutsch.
  if (sprache === "bg") return scoreBerechnungBg(bsp, w.guete, w.tempo, w.wert, gewicht);
  if (sprache === "el") return scoreBerechnungEl(bsp, w.guete, w.tempo, w.wert, gewicht);
  if (sprache === "hu") return scoreBerechnungHu(bsp, w.guete, w.tempo, w.wert, gewicht);
  if (sprache === "nl") return scoreBerechnungNl(bsp, w.guete, w.tempo, w.wert, gewicht);
  if (sprache === "pt") return scoreBerechnungPt(bsp, w.guete, w.tempo, w.wert, gewicht);
  if (sprache === "br") return scoreBerechnungBr(bsp, w.guete, w.tempo, w.wert, gewicht);
  if (sprache === "ro") return scoreBerechnungRo(bsp, w.guete, w.tempo, w.wert, gewicht);
  if (sprache === "sv") return scoreBerechnungSv(bsp, w.guete, w.tempo, w.wert, gewicht);
  if (sprache === "uk") return scoreBerechnungUk(bsp, w.guete, w.tempo, w.wert, gewicht);
  if (sprache === "cs") return scoreBerechnungCs(bsp, w.guete, w.tempo, w.wert, gewicht);
  if (sprache === "tr") return scoreBerechnungTr(bsp, w.guete, w.tempo, w.wert, gewicht);
  if (sprache === "pl") return scoreBerechnungPl(bsp, w.guete, w.tempo, w.wert, gewicht);
  if (sprache === "it") return scoreBerechnungIt(bsp, w.guete, w.tempo, w.wert, gewicht);
  if (sprache === "fr") return scoreBerechnungFr(bsp, w.guete, w.tempo, w.wert, gewicht);
  if (sprache === "es") return scoreBerechnungEs(bsp, w.guete, w.tempo, w.wert, gewicht);
  if (sprache === "en") return scoreBerechnungEn(bsp, w.guete, w.tempo, w.wert, gewicht);
  const zwei = (x: number) =>
    x.toLocaleString("de-AT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(w.guete);
  const v = zwei(w.tempo);
  return [
    {
      name: "1. Güte",
      text:
        `Geschriebene Zeichen geteilt durch (Zeichen + ${gewicht} × Fehlgriffe). ` +
        `Ein Fehlgriff zählt also so viel wie ${gewicht} Zeichen. Ohne Fehlgriff ist die Güte 1.`,
    },
    {
      name: "2. Tempo-Anteil",
      text:
        `Anschläge pro Minute geteilt durch ${BEZUGSTEMPO} (mehr als ${BEZUGSTEMPO} zählen nicht extra), ` +
        `davon die Wurzel. Wer doppelt so schnell schreibt, bekommt darum nicht das Doppelte, ` +
        `sondern rund das 1,4-Fache.`,
    },
    {
      name: "3. Score",
      text:
        "100 × Güte × Tempo-Anteil, auf eine ganze Zahl gerundet. Er liegt immer zwischen 0 und 100 " +
        "und wird nie negativ.",
    },
    {
      name: "Beispiel",
      text:
        `${bsp.zeichen} Zeichen mit ${bsp.fehler} Fehlgriffen: Güte = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. ${bsp.anschlaege} Anschläge pro Minute: ` +
        `Tempo-Anteil = Wurzel aus (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Score = 100 × ${g} × ${v} = ${Math.round(w.wert)}.`,
    },
    {
      name: "Zu wenig Text",
      text: `Unter ${MIND_ZEICHEN_WERTUNG} geschriebenen Zeichen im Zeitraum wird kein Score gerechnet - dort steht ein Strich.`,
    },
    {
      name: PRUEFUNG_WORT,
      text: `Der Leistungswert der ${PRUEFUNG_WORT} entsteht mit derselben Rechnung.`,
    },
  ];
}

/**
 * ★ EN6a: „So wird der Score berechnet" englisch - Glossar §3.2: Güte ⇒
 * *precision*, Tempo-Anteil ⇒ *speed factor*, Fehlgriff ⇒ *wrong key*,
 * Leistungswert ⇒ *challenge score*; Dezimalpunkt (§1.2: „0.95"). Dieselben
 * Zahlen aus derselben Rechnung wie die deutsche Fassung.
 */
function scoreBerechnungEn(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    x.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(guete);
  const v = zwei(tempo);
  return [
    {
      name: "1. Precision",
      text:
        `Characters typed divided by (characters + ${gewicht} × wrong keys). ` +
        `So a wrong key counts as much as ${gewicht} characters. With no wrong keys, precision is 1.`,
    },
    {
      name: "2. Speed factor",
      text:
        `Keystrokes per minute divided by ${BEZUGSTEMPO} (anything above ${BEZUGSTEMPO} doesn't count extra), ` +
        `then the square root of that. So typing twice as fast doesn't give twice as much, ` +
        `only about 1.4 times as much.`,
    },
    {
      name: "3. Score",
      text:
        "100 × precision × speed factor, rounded to a whole number. It is always between 0 and 100 " +
        "and never negative.",
    },
    {
      name: "Example",
      text:
        `${bsp.zeichen} characters with ${bsp.fehler} wrong keys: precision = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. ${bsp.anschlaege} keystrokes per minute: ` +
        `speed factor = square root of (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Score = 100 × ${g} × ${v} = ${Math.round(wert)}.`,
    },
    {
      name: "Too little text",
      text: `With fewer than ${MIND_ZEICHEN_WERTUNG} characters typed in the period, no score is worked out - a dash appears instead.`,
    },
    {
      name: PRUEFUNG_WORT_EN,
      text: `The challenge score of the ${PRUEFUNG_WORT_EN} is worked out in the same way.`,
    },
  ];
}

/**
 * ★ E11a-3 (26.09.2026): „Comment le score est calculé" französisch - Glossar
 * §9.2: Güte ⇒ précision, Tempo-Anteil ⇒ facteur de vitesse, Fehlgriff ⇒
 * erreur de frappe, Leistungswert ⇒ score du Défi. Dezimalkomma wie im
 * Deutschen (Glossar §9.1).
 */
function scoreBerechnungFr(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    x.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(guete);
  const v = zwei(tempo);
  return [
    {
      // ★ E11a-5 (Feinschliff-Liste): Güte heisst „Qualité" - „Précision" ist
      // schon die Treffsicherheit, zwei Spalten hiessen sonst gleich.
      name: "1. Qualité",
      text:
        `Caractères tapés divisés par (caractères + ${gewicht} × erreurs de frappe). ` +
        `Une erreur de frappe compte donc autant que ${gewicht} caractères. Sans erreur, la qualité vaut 1.`,
    },
    {
      name: "2. Facteur de vitesse",
      text:
        `Frappes par minute divisées par ${BEZUGSTEMPO} (au-delà de ${BEZUGSTEMPO}, cela ne compte pas plus), ` +
        `puis la racine carrée de ce résultat. Taper deux fois plus vite ne donne donc pas le ` +
        `double, mais environ 1,4 fois plus.`,
    },
    {
      name: "3. Score",
      text:
        "100 × qualité × facteur de vitesse, arrondi à un nombre entier. Il est toujours entre " +
        "0 et 100 et n'est jamais négatif.",
    },
    {
      name: "Exemple",
      text:
        `${bsp.zeichen} caractères avec ${bsp.fehler} erreurs de frappe : qualité = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. ${bsp.anschlaege} frappes par minute : ` +
        `facteur de vitesse = racine carrée de (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Score = 100 × ${g} × ${v} = ${Math.round(wert)}.`,
    },
    {
      name: "Trop peu de texte",
      text: `En dessous de ${MIND_ZEICHEN_WERTUNG} caractères tapés pendant la période, aucun score n'est calculé - un tiret s'affiche à la place.`,
    },
    {
      name: PRUEFUNG_WORT_FR,
      text: `Le score du ${PRUEFUNG_WORT_FR} est calculé de la même manière.`,
    },
  ];
}

/**
 * ★ O-IT (02.10.2026): „Come si calcola il punteggio" italienisch - Güte ⇒
 * qualità (Glossar §2.2: „precisione" ist schon die Treffsicherheit),
 * Tempo-Anteil ⇒ fattore di velocità, Fehlgriff ⇒ tasto sbagliato;
 * Dezimalkomma (Regel 5).
 */
function scoreBerechnungIt(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    x.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(guete);
  const v = zwei(tempo);
  return [
    {
      name: "1. Qualità",
      text:
        `Caratteri scritti divisi per (caratteri + ${gewicht} × tasti sbagliati). ` +
        `Quindi un tasto sbagliato conta come ${gewicht} caratteri. Senza tasti sbagliati la qualità è 1.`,
    },
    {
      name: "2. Fattore di velocità",
      text:
        `Battute al minuto divise per ${BEZUGSTEMPO} (oltre ${BEZUGSTEMPO} non conta di più), ` +
        `poi la radice quadrata. Per questo chi scrive due volte più veloce non riceve il ` +
        `doppio, ma circa 1,4 volte tanto.`,
    },
    {
      name: "3. Punteggio",
      text:
        "100 × qualità × fattore di velocità, arrotondato a un numero intero. È sempre tra " +
        "0 e 100 e non è mai negativo.",
    },
    {
      name: "Esempio",
      text:
        `${bsp.zeichen} caratteri con ${bsp.fehler} tasti sbagliati: qualità = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. ${bsp.anschlaege} battute al minuto: ` +
        `fattore di velocità = radice quadrata di (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Punteggio = 100 × ${g} × ${v} = ${Math.round(wert)}.`,
    },
    {
      name: "Troppo poco testo",
      text: `Con meno di ${MIND_ZEICHEN_WERTUNG} caratteri scritti nel periodo non si calcola nessun punteggio - al suo posto compare un trattino.`,
    },
    {
      name: PRUEFUNG_WORT_IT,
      text: `Il punteggio della ${PRUEFUNG_WORT_IT} si calcola nello stesso modo.`,
    },
  ];
}

/**
 * ★ O-PL (02.10.2026): „Jak liczony jest wynik" polnisch - Güte ⇒ jakość
 * (Glossar §2.2: „dokładność" ist schon die Treffsicherheit), Tempo-Anteil ⇒
 * współczynnik tempa, Fehlgriff ⇒ pomyłka; Dezimalkomma (Regel 5). Zahl +
 * Hauptwort mit allen vier Formen, wo die Zahl aus der Rechnung kommt.
 */
function scoreBerechnungPl(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    x.toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(guete);
  const v = zwei(tempo);
  const znaki = (n: number) =>
    mehrzahl(n, "pl", {
      one: (z) => `${z} znak`,
      few: (z) => `${z} znaki`,
      many: (z) => `${z} znaków`,
      other: (z) => `${z} znaku`,
    });
  return [
    {
      name: "1. Jakość",
      text:
        `Liczba napisanych znaków podzielona przez (znaki + ${gewicht} × pomyłki). ` +
        `Jedna pomyłka liczy się więc tak jak ${znaki(gewicht)}. Bez pomyłek jakość wynosi 1.`,
    },
    {
      name: "2. Współczynnik tempa",
      text:
        `Uderzenia na minutę podzielone przez ${BEZUGSTEMPO} (powyżej ${BEZUGSTEMPO} nic się dodatkowo nie liczy), ` +
        `a z tego pierwiastek kwadratowy. Kto pisze dwa razy szybciej, nie dostaje więc dwa razy więcej, ` +
        `tylko około 1,4 raza tyle.`,
    },
    {
      name: "3. Wynik",
      text:
        "100 × jakość × współczynnik tempa, zaokrąglone do liczby całkowitej. Zawsze mieści się " +
        "między 0 a 100 i nigdy nie jest ujemny.",
    },
    {
      name: "Przykład",
      text:
        `Napisane znaki: ${bsp.zeichen}, pomyłki: ${bsp.fehler}. Jakość = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. Uderzenia na minutę: ${bsp.anschlaege}. ` +
        `Współczynnik tempa = pierwiastek kwadratowy z (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Wynik = 100 × ${g} × ${v} = ${Math.round(wert)}.`,
    },
    {
      name: "Za mało tekstu",
      text: `Gdy w okresie napisano mniej niż ${znaki(MIND_ZEICHEN_WERTUNG)}, wynik nie jest liczony - zamiast niego jest kreska.`,
    },
    {
      name: PRUEFUNG_WORT_PL,
      text: `Wynik Wyzwania liczy się w ten sam sposób.`,
    },
  ];
}

/**
 * ★ O-TR (02.10.2026): "Puan nasıl hesaplanır" türkisch - Güte ⇒ kalite
 * ("doğruluk" ist schon die Treffsicherheit, Glossar §2.2), Tempo-Anteil ⇒ hız
 * payı, Fehlgriff ⇒ yanlış tuş; Dezimalkomma (Regel 5); Zahlen nur nach
 * Doppelpunkt oder vor einem eigenen Wort, ohne Endung (Regel 6).
 */
function scoreBerechnungTr(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    x.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(guete);
  const v = zwei(tempo);
  return [
    {
      name: "1. Kalite",
      text:
        `Yazılan karakter sayısı bölü (karakter + ${gewicht} × yanlış tuş). ` +
        `Yani bir yanlış tuş ${gewicht} karakter kadar sayılır. Yanlış tuş yoksa kalite 1 olur.`,
    },
    {
      name: "2. Hız payı",
      text:
        `Dakikada vuruş bölü ${BEZUGSTEMPO} (${BEZUGSTEMPO} değerinin üstü ayrıca sayılmaz), ` +
        `bunun da karekökü. İki kat hızlı yazan bu yüzden iki kat değil, ` +
        `yaklaşık 1,4 kat alır.`,
    },
    {
      name: "3. Puan",
      text:
        "100 × kalite × hız payı, tam sayıya yuvarlanır. Puan her zaman 0 ile 100 " +
        "arasındadır ve hiçbir zaman eksiye düşmez.",
    },
    {
      name: "Örnek",
      text:
        `Yazılan karakter: ${bsp.zeichen}, yanlış tuş: ${bsp.fehler}. Kalite = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. Dakikada vuruş: ${bsp.anschlaege}. ` +
        `Hız payı = karekök (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Puan = 100 × ${g} × ${v} = ${Math.round(wert)}.`,
    },
    {
      name: "Metin çok az",
      text: `Dönem içinde yazılan karakter sayısı en az ${MIND_ZEICHEN_WERTUNG} değilse puan hesaplanmaz - orada bir çizgi görünür.`,
    },
    {
      name: PRUEFUNG_WORT_TR,
      text: "Yarışma puanı da aynı hesapla bulunur.",
    },
  ];
}

/**
 * ★ O-CS (03.10.2026): „Jak se počítá skóre" tschechisch - Güte ⇒ kvalita
 * („přesnost" ist schon die Treffsicherheit, Glossar §2.2), Tempo-Anteil ⇒
 * podíl rychlosti, Fehlgriff ⇒ překlep; Dezimalkomma (Regel 5). Zahl +
 * Hauptwort mit allen vier Formen (§2.11); kein Satz endet auf einer ganzen
 * Zahl mit Punkt (§4 Falle 4).
 */
function scoreBerechnungCs(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    x.toLocaleString("cs-CZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const g = zwei(guete);
  const v = zwei(tempo);
  const znaky = (n: number) =>
    mehrzahl(n, "cs", {
      one: (z) => `${z} znak`,
      few: (z) => `${z} znaky`,
      many: (z) => `${z} znaku`,
      other: (z) => `${z} znaků`,
    });
  const preklepy = (n: number) =>
    mehrzahl(n, "cs", {
      one: (z) => `${z} překlep`,
      few: (z) => `${z} překlepy`,
      many: (z) => `${z} překlepu`,
      other: (z) => `${z} překlepů`,
    });
  const uhozy = (n: number) =>
    mehrzahl(n, "cs", {
      one: (z) => `${z} úhoz za minutu`,
      few: (z) => `${z} úhozy za minutu`,
      many: (z) => `${z} úhozu za minutu`,
      other: (z) => `${z} úhozů za minutu`,
    });
  const body = (n: number) =>
    mehrzahl(n, "cs", {
      one: (z) => `${z} bod`,
      few: (z) => `${z} body`,
      many: (z) => `${z} bodu`,
      other: (z) => `${z} bodů`,
    });
  return [
    {
      name: "1. Kvalita",
      text:
        `Počet napsaných znaků děleno (znaky + ${gewicht} × překlepy). ` +
        `Jeden překlep se tedy počítá jako ${znaky(gewicht)}. Bez překlepů je kvalita rovna jedné.`,
    },
    {
      name: "2. Podíl rychlosti",
      text:
        `Úhozy za minutu děleno ${BEZUGSTEMPO} (nad ${BEZUGSTEMPO} se už nic navíc nepočítá), ` +
        `z toho druhá odmocnina. Kdo píše dvakrát rychleji, nedostane tedy dvojnásobek, ` +
        `ale zhruba 1,4násobek.`,
    },
    {
      name: "3. Skóre",
      text:
        "100 × kvalita × podíl rychlosti, zaokrouhleno na celé číslo. Skóre je vždy " +
        "mezi 0 a 100 a nikdy není záporné.",
    },
    {
      name: "Příklad",
      text:
        `Napsáno: ${znaky(bsp.zeichen)} a ${preklepy(bsp.fehler)}. Kvalita = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. Rychlost: ${uhozy(bsp.anschlaege)}. ` +
        `Podíl rychlosti = druhá odmocnina z (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Skóre = 100 × ${g} × ${v} = ${body(Math.round(wert))}.`,
    },
    {
      name: "Příliš málo textu",
      text: `Když se v období napíše méně než ${znaky(MIND_ZEICHEN_WERTUNG)}, skóre se nepočítá - místo něj je tu znak „-“.`,
    },
    {
      name: PRUEFUNG_WORT_CS,
      text: "Skóre Výzvy se počítá stejně.",
    },
  ];
}

/**
 * ★ ES-O (27.09.2026): „Cómo se calcula la puntuación" spanisch - Güte ⇒
 * calidad (nicht „precisión", die heisst schon die Treffsicherheit),
 * Tempo-Anteil ⇒ factor de velocidad, Fehlgriff ⇒ error. Dezimalpunkt
 * (RAE 2010 empfiehlt ihn; variantenneutral).
 */
function scoreBerechnungEs(
  bsp: { zeichen: number; fehler: number; anschlaege: number },
  guete: number,
  tempo: number,
  wert: number,
  gewicht: number,
): { name: string; text: string }[] {
  const zwei = (x: number) =>
    // Dezimalpunkt (RAE 2010) - so lesen es Spanien und Amerika gleich.
    x.toFixed(2);
  const g = zwei(guete);
  const v = zwei(tempo);
  return [
    {
      name: "1. Calidad",
      text:
        `Caracteres escritos divididos entre (caracteres + ${gewicht} × errores). ` +
        `Así, un error cuenta tanto como ${gewicht} caracteres. Sin errores, la calidad es 1.`,
    },
    {
      name: "2. Factor de velocidad",
      text:
        `Pulsaciones por minuto divididas entre ${BEZUGSTEMPO} (lo que pase de ${BEZUGSTEMPO} no cuenta más), ` +
        `y de ahí la raíz cuadrada. Por eso, quien escribe el doble de rápido no recibe el ` +
        `doble, sino unas 1.4 veces.`,
    },
    {
      name: "3. Puntuación",
      text:
        "100 × calidad × factor de velocidad, redondeado a un número entero. Siempre está entre " +
        "0 y 100 y nunca es negativa.",
    },
    {
      name: "Ejemplo",
      text:
        `${bsp.zeichen} caracteres con ${bsp.fehler} errores: calidad = ${bsp.zeichen} ÷ (${bsp.zeichen} + ` +
        `${gewicht} × ${bsp.fehler}) = ${g}. ${bsp.anschlaege} pulsaciones por minuto: ` +
        `factor de velocidad = raíz cuadrada de (${bsp.anschlaege} ÷ ${BEZUGSTEMPO}) = ${v}. ` +
        `Puntuación = 100 × ${g} × ${v} = ${Math.round(wert)}.`,
    },
    {
      name: "Demasiado poco texto",
      text: `Con menos de ${MIND_ZEICHEN_WERTUNG} caracteres escritos en el periodo no se calcula ninguna puntuación - en su lugar aparece un guion.`,
    },
    {
      name: PRUEFUNG_WORT_ES,
      text: `La puntuación del ${PRUEFUNG_WORT_ES} se calcula de la misma manera.`,
    },
  ];
}

/** Der Satz unter den vier Links. */
export const UEBERSICHT_HINWEIS =
  "Jedes Blatt zeigt die Spalten der Tabelle in „Meine Klassen“, gerechnet für seinen Zeitraum - egal, welcher Zeitraum in der App gewählt war.";
/** ★ EN6a: derselbe Satz englisch. */
export const UEBERSICHT_HINWEIS_EN =
  "Each sheet shows the columns of the table in “My classes”, worked out for its own period - whichever period was chosen in the app.";
/** ★ E11a-3: derselbe Satz französisch (Glossar §9.2 „Mes classes"). */
/** ★ ES-O: derselbe Satz spanisch. */
export const UEBERSICHT_HINWEIS_ES =
  "Cada hoja muestra las columnas de la tabla de \"Mis clases\", calculadas para su propio periodo - sea cual sea el periodo elegido en la aplicación.";
/** ★ O-IT: derselbe Satz italienisch. */
export const UEBERSICHT_HINWEIS_IT =
  `Ogni foglio mostra le colonne della tabella di "Le mie classi", calcolate per il proprio periodo - qualunque periodo fosse scelto nell'app.`;
/** ★ O-PL: derselbe Satz polnisch. */
export const UEBERSICHT_HINWEIS_PL =
  "Każdy arkusz pokazuje kolumny tabeli z sekcji „Moje klasy”, policzone dla własnego okresu - niezależnie od okresu wybranego w aplikacji.";
/** ★ O-CS: derselbe Satz tschechisch („Moje třídy", Glossar §2.5). */
export const UEBERSICHT_HINWEIS_CS =
  "Každý list ukazuje sloupce tabulky z části Moje třídy, spočítané za jeho vlastní období - bez ohledu na období vybrané v aplikaci.";
/** ★ O-TR: derselbe Satz türkisch ("Sınıflarım", Glossar §2.5). */
export const UEBERSICHT_HINWEIS_TR =
  `Her sayfa, "Sınıflarım" bölümündeki tablonun sütunlarını kendi dönemi için hesaplanmış olarak gösterir - uygulamada hangi dönem seçilmiş olursa olsun.`;
export const UEBERSICHT_HINWEIS_FR =
  "Chaque feuille montre les colonnes du tableau de \"Mes classes\", calculées pour sa propre période - quelle que soit la période choisie dans l'application.";

/**
 * ★ EN6a: die übrigen Wörter der Mappe - Überschriften der Übersicht, der
 * Link zurück, der Titel. Deutsch genau die Wörter von vorher.
 */
const MAPPE_TEXTE: Record<
  ExportSprache,
  {
    uebersicht: string;
    titel: (klasse: string) => string;
    blattSatz: (name: string, satz: string) => string;
    zeitraeume: string;
    legende: string;
    spalte: string;
    bedeutung: string;
    scoreAbschnitt: string;
    beispiel: string;
    zurUebersicht: string;
  }
> = mitRueckfallEn({
  de: {
    uebersicht: UEBERSICHT_BLATT,
    titel: (klasse) => `Leistungstabelle - ${klasse}`,
    blattSatz: (name, satz) => `Blatt „${name}“: ${satz}`,
    zeitraeume: "Die vier Zeiträume",
    legende: "Legende - was die Spalten bedeuten",
    spalte: "Spalte",
    bedeutung: "Bedeutung",
    scoreAbschnitt: "So wird der Score berechnet",
    beispiel: "Beispiel",
    zurUebersicht: "← zur Übersicht",
  },
  en: {
    uebersicht: UEBERSICHT_BLATT_EN,
    titel: (klasse) => `Progress table - ${klasse}`,
    blattSatz: (name, satz) => `Sheet “${name}”: ${satz}`,
    zeitraeume: "The four periods",
    legende: "Legend - what the columns mean",
    spalte: "Column",
    bedeutung: "Meaning",
    scoreAbschnitt: "How the score is worked out",
    beispiel: "Example",
    zurUebersicht: "← back to the overview",
  },
  // ★ ES-O (27.09.2026): dieselben Wörter spanisch.
  es: {
    uebersicht: UEBERSICHT_BLATT_ES,
    titel: (klasse) => `Tabla de resultados - ${klasse}`,
    blattSatz: (name, satz) => `Hoja "${name}": ${satz}`,
    zeitraeume: "Los cuatro periodos",
    legende: "Leyenda - qué significan las columnas",
    spalte: "Columna",
    bedeutung: "Significado",
    scoreAbschnitt: "Cómo se calcula la puntuación",
    beispiel: "Ejemplo",
    zurUebersicht: "← volver al resumen",
  },
  // ★ E11a-3 (26.09.2026): dieselben Wörter französisch.
  fr: {
    uebersicht: UEBERSICHT_BLATT_FR,
    titel: (klasse) => `Tableau des résultats - ${klasse}`,
    blattSatz: (name, satz) => `Feuille "${name}" : ${satz}`,
    zeitraeume: "Les quatre périodes",
    legende: "Légende - ce que veulent dire les colonnes",
    spalte: "Colonne",
    bedeutung: "Signification",
    scoreAbschnitt: "Comment le score est calculé",
    beispiel: "Exemple",
    zurUebersicht: "← retour à l'aperçu",
  },
  // ★ O-IT (02.10.2026): dieselben Wörter italienisch.
  it: {
    uebersicht: UEBERSICHT_BLATT_IT,
    titel: (klasse) => `Tabella dei risultati - ${klasse}`,
    blattSatz: (name, satz) => `Foglio "${name}": ${satz}`,
    zeitraeume: "I quattro periodi",
    legende: "Legenda - che cosa significano le colonne",
    spalte: "Colonna",
    bedeutung: "Significato",
    scoreAbschnitt: "Come si calcola il punteggio",
    beispiel: "Esempio",
    zurUebersicht: "← torna alla panoramica",
  },
  // ★ O-PL (02.10.2026): dieselben Wörter polnisch.
  pl: {
    uebersicht: UEBERSICHT_BLATT_PL,
    titel: (klasse) => `Tabela wyników - ${klasse}`,
    blattSatz: (name, satz) => `Arkusz „${name}”: ${satz}`,
    zeitraeume: "Cztery okresy",
    legende: "Legenda - co oznaczają kolumny",
    spalte: "Kolumna",
    bedeutung: "Znaczenie",
    scoreAbschnitt: "Jak liczony jest wynik",
    beispiel: "Przykład",
    zurUebersicht: "← wróć do przeglądu",
  },
  // ★ O-TR (02.10.2026): dieselben Wörter türkisch; Namen nur in Anführung, ohne Endung.
  tr: {
    uebersicht: UEBERSICHT_BLATT_TR,
    titel: (klasse) => `İlerleme tablosu - ${klasse}`,
    blattSatz: (name, satz) => `"${name}" sayfası: ${satz}`,
    zeitraeume: "Dört dönem",
    legende: "Açıklama - sütunların anlamı",
    spalte: "Sütun",
    bedeutung: "Anlamı",
    scoreAbschnitt: "Puan nasıl hesaplanır",
    beispiel: "Örnek",
    zurUebersicht: "← genel bakışa dön",
  },
  // ★ O-CS (03.10.2026): dieselben Wörter tschechisch; der Blattname hinter dem
  // Kopfwort „List", ungebeugt (Glossar Regel 12).
  cs: {
    uebersicht: UEBERSICHT_BLATT_CS,
    titel: (klasse) => `Tabulka pokroku - ${klasse}`,
    blattSatz: (name, satz) => `List ${name}: ${satz}`,
    zeitraeume: "Čtyři období",
    legende: "Legenda - co znamenají sloupce",
    spalte: "Sloupec",
    bedeutung: "Význam",
    scoreAbschnitt: "Jak se počítá skóre",
    beispiel: "Příklad",
    zurUebersicht: "← zpět na přehled",
  },
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    uebersicht: "Обзор",
    titel: (klasse) => `Таблица на напредъка - ${klasse}`,
    blattSatz: (name, satz) => `Лист „${name}“: ${satz}`,
    zeitraeume: "Четирите периода",
    legende: "Легенда - какво означават колоните",
    spalte: "Колона",
    bedeutung: "Значение",
    scoreAbschnitt: "Как се изчислява резултатът",
    beispiel: "Пример",
    zurUebersicht: "← обратно към обзора",
  },
  el: {
    uebersicht: "Επισκόπηση",
    titel: (klasse) => `Πίνακας προόδου - ${klasse}`,
    blattSatz: (name, satz) => `Φύλλο «${name}»: ${satz}`,
    zeitraeume: "Οι τέσσερις περίοδοι",
    legende: "Υπόμνημα - τι σημαίνουν οι στήλες",
    spalte: "Στήλη",
    bedeutung: "Σημασία",
    scoreAbschnitt: "Πώς υπολογίζεται το σκορ",
    beispiel: "Παράδειγμα",
    zurUebersicht: "← πίσω στην επισκόπηση",
  },
  hu: {
    uebersicht: "Áttekintés",
    titel: (klasse) => `Haladási táblázat - ${klasse}`,
    blattSatz: (name, satz) => `„${name}” munkalap: ${satz}`,
    zeitraeume: "A négy időszak",
    legende: "Jelmagyarázat - mit jelentenek az oszlopok",
    spalte: "Oszlop",
    bedeutung: "Jelentés",
    scoreAbschnitt: "Hogyan számoljuk a pontszámot",
    beispiel: "Példa",
    zurUebersicht: "← vissza az áttekintéshez",
  },
  nl: {
    uebersicht: "Overzicht",
    titel: (klasse) => `Voortgangstabel - ${klasse}`,
    blattSatz: (name, satz) => `Blad ‘${name}’: ${satz}`,
    zeitraeume: "De vier periodes",
    legende: "Legenda - wat de kolommen betekenen",
    spalte: "Kolom",
    bedeutung: "Betekenis",
    scoreAbschnitt: "Hoe de score wordt berekend",
    beispiel: "Voorbeeld",
    zurUebersicht: "← terug naar het overzicht",
  },
  pt: {
    uebersicht: "Resumo",
    titel: (klasse) => `Tabela de progresso - ${klasse}`,
    blattSatz: (name, satz) => `Folha «${name}»: ${satz}`,
    zeitraeume: "Os quatro períodos",
    legende: "Legenda - o que significam as colunas",
    spalte: "Coluna",
    bedeutung: "Significado",
    scoreAbschnitt: "Como se calcula a pontuação",
    beispiel: "Exemplo",
    zurUebersicht: "← voltar ao resumo",
  },
  br: {
    uebersicht: "Resumo",
    titel: (klasse) => `Tabela de progresso - ${klasse}`,
    blattSatz: (name, satz) => `Planilha “${name}”: ${satz}`,
    zeitraeume: "Os quatro períodos",
    legende: "Legenda - o que as colunas significam",
    spalte: "Coluna",
    bedeutung: "Significado",
    scoreAbschnitt: "Como a pontuação é calculada",
    beispiel: "Exemplo",
    zurUebersicht: "← voltar ao resumo",
  },
  ro: {
    uebersicht: "Prezentare generală",
    titel: (klasse) => `Tabelul progresului - ${klasse}`,
    blattSatz: (name, satz) => `Foaia „${name}”: ${satz}`,
    zeitraeume: "Cele patru perioade",
    legende: "Legendă - ce înseamnă coloanele",
    spalte: "Coloană",
    bedeutung: "Semnificație",
    scoreAbschnitt: "Cum se calculează scorul",
    beispiel: "Exemplu",
    zurUebersicht: "← înapoi la prezentarea generală",
  },
  sv: {
    uebersicht: "Översikt",
    titel: (klasse) => `Framstegstabell - ${klasse}`,
    blattSatz: (name, satz) => `Blad ”${name}”: ${satz}`,
    zeitraeume: "De fyra perioderna",
    legende: "Teckenförklaring - vad kolumnerna betyder",
    spalte: "Kolumn",
    bedeutung: "Betydelse",
    scoreAbschnitt: "Så räknas poängen ut",
    beispiel: "Exempel",
    zurUebersicht: "← tillbaka till översikten",
  },
  uk: {
    uebersicht: "Огляд",
    titel: (klasse) => `Таблиця поступу - ${klasse}`,
    blattSatz: (name, satz) => `Аркуш «${name}»: ${satz}`,
    zeitraeume: "Чотири періоди",
    legende: "Легенда - що означають стовпці",
    spalte: "Стовпець",
    bedeutung: "Значення",
    scoreAbschnitt: "Як рахуються бали",
    beispiel: "Приклад",
    zurUebersicht: "← назад до огляду",
  },
});

/**
 * ★ ES-O (27.09.2026): EINE Tabelle je Sprache statt der Weichen
 * `sprache === "fr" ? … : sprache === "en" ? … : Deutsch` - die lieferten für
 * „es" still Deutsch (Falle 30).
 */
const ZEITRAUM_SATZ_JE_SPRACHE: Record<ExportSprache, Record<ZeitraumArt, string>> = {
  de: ZEITRAUM_SATZ,
  en: ZEITRAUM_SATZ_EN,
  fr: ZEITRAUM_SATZ_FR,
  es: ZEITRAUM_SATZ_ES,
  it: ZEITRAUM_SATZ_IT,
  pl: ZEITRAUM_SATZ_PL,
  tr: ZEITRAUM_SATZ_TR,
  cs: ZEITRAUM_SATZ_CS,
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    schuljahr: "Всичко упражнено през текущата учебна година.",
    gesamt: "Всичко упражнено досега - откакто е създаден профилът на ученика.",
    monat: "Всичко упражнено през последните 4 седмици.",
    woche: "Само текущата седмица - докъде е стигнал ученикът в момента.",
  },
  el: {
    schuljahr: "Όλα όσα εξασκήθηκαν στην τρέχουσα σχολική χρονιά.",
    gesamt: "Όλα όσα εξασκήθηκαν ποτέ - από τη δημιουργία του λογαριασμού.",
    monat: "Όλα όσα εξασκήθηκαν τις τελευταίες 4 εβδομάδες.",
    woche: "Μόνο η τρέχουσα εβδομάδα - η κατάσταση αυτή τη στιγμή.",
  },
  hu: {
    schuljahr: "Minden, amit az aktuális tanévben gyakorolt.",
    gesamt: "Minden, amit valaha gyakorolt - a fiók létrehozása óta.",
    monat: "Minden, amit az elmúlt 4 hétben gyakorolt.",
    woche: "Csak az aktuális hét - a jelenlegi állás.",
  },
  nl: {
    schuljahr: "Alles wat in het huidige schooljaar is geoefend.",
    gesamt: "Alles wat ooit is geoefend - sinds het account van de leerling bestaat.",
    monat: "Alles wat in de laatste 4 weken is geoefend.",
    woche: "Alleen de huidige week - hoe het er nu voor staat.",
  },
  pt: {
    schuljahr: "Tudo o que foi praticado no ano letivo atual.",
    gesamt: "Tudo o que foi praticado até hoje - desde a criação da conta.",
    monat: "Tudo o que foi praticado nas últimas 4 semanas.",
    woche: "Só a semana atual - como estão as coisas neste momento.",
  },
  br: {
    schuljahr: "Tudo o que foi praticado no ano letivo atual.",
    gesamt: "Tudo o que já foi praticado - desde a criação da conta.",
    monat: "Tudo o que foi praticado nas últimas 4 semanas.",
    woche: "Só a semana atual - como as coisas estão agora.",
  },
  ro: {
    schuljahr: "Tot ce s-a exersat în anul școlar curent.",
    gesamt: "Tot ce s-a exersat vreodată - de când a fost creat contul.",
    monat: "Tot ce s-a exersat în ultimele 4 săptămâni.",
    woche: "Doar săptămâna curentă - cum stau lucrurile acum.",
  },
  sv: {
    schuljahr: "Allt som har övats under det pågående läsåret.",
    gesamt: "Allt som någonsin har övats - sedan kontot skapades.",
    monat: "Allt som har övats under de senaste 4 veckorna.",
    woche: "Bara den aktuella veckan - hur det ser ut just nu.",
  },
  uk: {
    schuljahr: "Усе, що натреновано в поточному навчальному році.",
    gesamt: "Усе, що будь-коли натреновано - відколи створено обліковий запис.",
    monat: "Усе, що натреновано за останні 4 тижні.",
    woche: "Лише поточний тиждень - як справи просто зараз.",
  },
};
const UEBERSICHT_HINWEIS_JE_SPRACHE: Record<ExportSprache, string> = {
  de: UEBERSICHT_HINWEIS,
  en: UEBERSICHT_HINWEIS_EN,
  fr: UEBERSICHT_HINWEIS_FR,
  es: UEBERSICHT_HINWEIS_ES,
  it: UEBERSICHT_HINWEIS_IT,
  pl: UEBERSICHT_HINWEIS_PL,
  tr: UEBERSICHT_HINWEIS_TR,
  cs: UEBERSICHT_HINWEIS_CS,
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: "Всеки лист показва колоните на таблицата в „Моите класове“, изчислени за собствения му период - независимо кой период е избран в приложението.",
  el: "Κάθε φύλλο δείχνει τις στήλες του πίνακα στο «Τα τμήματά μου», υπολογισμένες για τη δική του περίοδο - όποια περίοδο κι αν επιλέχθηκε στην εφαρμογή.",
  hu: "Minden munkalap az „Osztályaim” táblázat oszlopait mutatja, a saját időszakára számolva - függetlenül attól, melyik időszak volt kiválasztva az alkalmazásban.",
  nl: "Elk blad toont de kolommen van de tabel in ‘Mijn klassen’, berekend voor de eigen periode - welke periode er in de app ook gekozen was.",
  pt: "Cada folha mostra as colunas da tabela em «As minhas turmas», calculadas para o seu próprio período - seja qual for o período escolhido na aplicação.",
  br: "Cada planilha mostra as colunas da tabela em “Minhas turmas”, calculadas para o seu próprio período - qualquer que tenha sido o período escolhido no aplicativo.",
  ro: "Fiecare foaie arată coloanele tabelului din „Clasele mele”, calculate pentru perioada ei - oricare ar fi perioada aleasă în aplicație.",
  sv: "Varje blad visar kolumnerna i tabellen under ”Mina klasser”, uträknade för sin egen period - oavsett vilken period som valdes i appen.",
  uk: "Кожен аркуш показує стовпці таблиці з «Мої класи», обчислені для свого періоду - незалежно від того, який період вибрано в застосунку.",
};
const STRICH_SATZ_JE_SPRACHE: Record<ExportSprache, string> = {
  de: STRICH_SATZ,
  en: STRICH_SATZ_EN,
  fr: STRICH_SATZ_FR,
  es: STRICH_SATZ_ES,
  it: STRICH_SATZ_IT,
  pl: STRICH_SATZ_PL,
  tr: STRICH_SATZ_TR,
  cs: STRICH_SATZ_CS,
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: "Няма стойност - не е упражнявано или текстът е твърде кратък за оценка. Тирето не е нула.",
  el: "Καμία τιμή - δεν έγινε εξάσκηση ή το κείμενο ήταν πολύ λίγο για αξιολόγηση. Η παύλα δεν είναι μηδέν.",
  hu: "Nincs érték - nem gyakorolt, vagy túl kevés volt a szöveg az értékeléshez. A kötőjel nem nulla.",
  nl: "Geen waarde - niet geoefend of te weinig tekst om te beoordelen. Een streepje is geen nul.",
  pt: "Sem valor - não praticou, ou o texto foi demasiado curto para avaliar. Um traço não é um zero.",
  br: "Sem valor - não praticou, ou o texto foi curto demais para avaliar. Um traço não é um zero.",
  ro: "Nicio valoare - nu s-a exersat sau textul a fost prea scurt pentru evaluare. O liniuță nu înseamnă zero.",
  sv: "Inget värde - inte övat, eller för lite text för att bedömas. Ett streck är ingen nolla.",
  uk: "Немає значення - не тренувалися або тексту замало для оцінювання. Риска - це не нуль.",
};
const GRUPPEN_NAME_JE_SPRACHE: Record<ExportSprache, Record<SpaltenGruppe, string>> = {
  de: GRUPPEN_NAME,
  en: GRUPPEN_NAME_EN,
  fr: GRUPPEN_NAME_FR,
  es: GRUPPEN_NAME_ES,
  it: GRUPPEN_NAME_IT,
  pl: GRUPPEN_NAME_PL,
  tr: GRUPPEN_NAME_TR,
  cs: GRUPPEN_NAME_CS,
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: {
    person: "Ученик",
    stand: "Напредък и време за упражнения",
    ueben: "Упражнения",
    pruefung: "Предизвикателство",
  },
  el: {
    person: "Μαθητής ή μαθήτρια",
    stand: "Πρόοδος και χρόνος εξάσκησης",
    ueben: "Εξάσκηση",
    pruefung: "Πρόκληση",
  },
  hu: {
    person: "Tanuló",
    stand: "Haladás és gyakorlási idő",
    ueben: "Gyakorlás",
    pruefung: "Kihívás",
  },
  nl: {
    person: "Leerling",
    stand: "Voortgang en oefentijd",
    ueben: "Oefenen",
    pruefung: "Uitdaging",
  },
  pt: {
    person: "Aluno ou aluna",
    stand: "Progresso e tempo de prática",
    ueben: "Prática",
    pruefung: "Desafio",
  },
  br: {
    person: "Aluno ou aluna",
    stand: "Progresso e tempo de prática",
    ueben: "Prática",
    pruefung: "Desafio",
  },
  ro: {
    person: "Elev",
    stand: "Progres și timp de exersare",
    ueben: "Exersare",
    pruefung: "Provocare",
  },
  sv: {
    person: "Elev",
    stand: "Framsteg och övningstid",
    ueben: "Övning",
    pruefung: "Utmaningen",
  },
  uk: {
    person: "Учень або учениця",
    stand: "Поступ і час тренування",
    ueben: "Тренування",
    pruefung: "Виклик",
  },
};
const ZAHLENFORMAT_JE_SPRACHE: Record<ExportSprache, Record<SpaltenFormat, string | undefined>> = {
  de: ZAHLENFORMAT,
  en: ZAHLENFORMAT_EN,
  fr: ZAHLENFORMAT_FR,
  es: ZAHLENFORMAT_ES,
  it: ZAHLENFORMAT_IT,
  pl: ZAHLENFORMAT_PL,
  tr: ZAHLENFORMAT_TR,
  cs: ZAHLENFORMAT_CS,
  // ★ O2-LIB (29.10.2026): bg, el, hu, nl, pt, br, ro, sv, uk eigen.
  bg: ZAHLENFORMAT_EN,
  el: ZAHLENFORMAT_EN,
  hu: ZAHLENFORMAT_EN,
  nl: ZAHLENFORMAT_EN,
  pt: ZAHLENFORMAT_EN,
  br: ZAHLENFORMAT_EN,
  ro: ZAHLENFORMAT_CS,
  sv: ZAHLENFORMAT_CS,
  uk: ZAHLENFORMAT_EN,
};

// ══════════════════════════════════════════════════════════════════════════════
// DIE DATEI SCHREIBEN
// ══════════════════════════════════════════════════════════════════════════════

/** Blattnamen: höchstens 31 Zeichen, ohne `:\/?*[]` (Grenzen des Dateiformats). */
const blattName = (name: string) => name.replace(/[:\\/?*[\]]/g, "_").slice(0, 31) || "Blatt";

/** Eine Zwischenüberschrift der Übersicht, über zwei Spalten, mit Linie darunter. */
function abschnitt(ws: Blatt, zeile: number, text: string, spalten: number): void {
  const c = ws.getCell(zeile, 1);
  c.value = text;
  c.font = schrift({ size: 13, bold: true, color: { argb: argb(FARBE.akzent) } });
  c.alignment = { vertical: "bottom" };
  for (let k = 1; k <= spalten; k++)
    ws.getCell(zeile, k).border = {
      bottom: { style: "medium", color: { argb: argb(FARBE.akzent) } },
    };
  ws.getRow(zeile).height = 24;
}

/** Eine Kopfzeile: Akzentgrund, weiss, fett. */
function tabellenKopf(ws: Blatt, zeile: number, koepfe: readonly string[], hoehe = 22): void {
  koepfe.forEach((kopf, i) => {
    const c = ws.getCell(zeile, i + 1);
    c.value = kopf;
    c.font = schrift({ bold: true, color: { argb: argb(FARBE.weiss) } });
    c.fill = flaeche(FARBE.akzent);
    c.alignment = { vertical: "middle", horizontal: i === 0 ? "left" : "left", indent: 1, wrapText: true };
    c.border = linienRundum(FARBE.weiss);
  });
  ws.getRow(zeile).height = hoehe;
}

/** Eine Zeile „Name · Erklärung" der Legende. */
function legendenZeile(
  ws: Blatt,
  zeile: number,
  eintrag: { name: string; text: string },
  o: { grund: string; nameFarbe: string; breiteB: number },
): void {
  const a = ws.getCell(zeile, 1);
  const b = ws.getCell(zeile, 2);
  a.value = eintrag.name;
  b.value = eintrag.text;
  a.font = schrift({ bold: true, color: { argb: argb(o.nameFarbe) } });
  b.font = schrift();
  a.alignment = { vertical: "top", wrapText: true, indent: 1 };
  b.alignment = { vertical: "top", wrapText: true, indent: 1 };
  for (const c of [a, b]) {
    c.fill = flaeche(o.grund);
    c.border = linienRundum();
  }
  ws.getRow(zeile).height = Math.max(
    zeilenHoehe(eintrag.text, o.breiteB - 3),
    zeilenHoehe(eintrag.name, 26),
  );
}

const BREITE_A = 38;
const BREITE_B = 96;

async function schreibeUebersicht(
  wb: Mappe,
  ws: Blatt,
  blaetter: readonly LeistungsBlatt[],
  o: { klassenname?: string | null; jetztMs: number; sprache?: ExportSprache },
): Promise<void> {
  const sprache = o.sprache ?? "de";
  const T = MAPPE_TEXTE[sprache];
  ws.columns = [{ width: BREITE_A }, { width: BREITE_B }];
  let z = await setzeMarkenKopf(wb, ws, {
    titel: T.titel(klassenBezeichnung(o.klassenname, sprache)),
    unterzeile: erstelltAm(o.jetztMs, sprache),
    sprache,
  });
  ws.getRow(z++).height = 10;

  // ── Die vier Zeiträume ────────────────────────────────────────────────
  abschnitt(ws, z++, T.zeitraeume, 2);
  ws.getRow(z++).height = 6;
  /*
   * ★ Die Link-Zellen: heller Akzentgrund, dicker Akzentbalken links, Text in
   * Akzentfarbe, fett. ⚠️ NICHT weiss auf Blau (gemessen am Muster 13.09.2026):
   * LibreOffice malt Links in seiner eigenen dunkelblauen Linkfarbe - weisse
   * Schrift wäre dort dunkelblau auf blau und kaum zu lesen. So ist der Link
   * in Excel UND in LibreOffice gut lesbar.
   */
  const balken = { style: "thick" as const, color: { argb: argb(FARBE.akzent) } };
  const fein = { style: "thin" as const, color: { argb: argb(FARBE.linie) } };
  for (const b of blaetter) {
    const link = ws.getCell(z, 1);
    // ⚠️ `internerLink` ohne `#` - siehe `interneLinksOhneBeziehung`.
    link.value = { text: `→ ${b.zeitraumTitel}`, hyperlink: internerLink(blattName(b.name)) };
    link.font = schrift({ size: 11, bold: true, color: { argb: argb(FARBE.akzent) } });
    link.fill = flaeche(FARBE.akzentHell);
    link.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    link.border = { left: balken, top: fein, bottom: fein };
    const satz = ws.getCell(z, 2);
    satz.value = T.blattSatz(
      b.name,
      ZEITRAUM_SATZ_JE_SPRACHE[sprache][b.art],
    );
    satz.font = schrift();
    satz.fill = flaeche(FARBE.weiss);
    satz.alignment = { vertical: "middle", horizontal: "left", indent: 1, wrapText: true };
    satz.border = { top: fein, bottom: fein, right: fein };
    ws.getRow(z++).height = 28;
  }
  ws.mergeCells(z, 1, z, 2);
  const hinweis = ws.getCell(z, 1);
  hinweis.value =
    UEBERSICHT_HINWEIS_JE_SPRACHE[sprache];
  hinweis.font = schrift({ size: 9, color: { argb: argb(FARBE.gedaempft) } });
  hinweis.alignment = { vertical: "middle", wrapText: true };
  ws.getRow(z++).height = 20;
  ws.getRow(z++).height = 12;

  // ── Legende ───────────────────────────────────────────────────────────
  abschnitt(ws, z++, T.legende, 2);
  ws.getRow(z++).height = 6;
  tabellenKopf(ws, z++, [T.spalte, T.bedeutung]);
  let hell = true;
  for (const e of leistungLegende(blaetter)) {
    const gruppe = e.art === "gruppe";
    legendenZeile(ws, z++, e, {
      grund: gruppe ? FARBE.akzentHell : hell ? FARBE.weiss : FARBE.grundHell,
      nameFarbe: gruppe ? FARBE.akzent : FARBE.schrift,
      breiteB: BREITE_B,
    });
    if (!gruppe) hell = !hell;
  }
  // Der Strich - mit einem Strich in der Namenszelle, so wie er in den Blättern steht.
  legendenZeile(
    ws,
    z,
    {
      name: OHNE_WERT,
      text: STRICH_SATZ_JE_SPRACHE[sprache],
    },
    {
    grund: FARBE.grund,
    nameFarbe: FARBE.gedaempft,
    breiteB: BREITE_B,
  });
  ws.getCell(z, 1).alignment = { vertical: "top", horizontal: "center" };
  ws.getCell(z, 1).font = schrift({ size: 12, bold: true, color: { argb: argb(FARBE.gedaempft) } });
  z++;
  ws.getRow(z++).height = 12;

  // ── Wie der Score entsteht ────────────────────────────────────────────
  abschnitt(ws, z++, T.scoreAbschnitt, 2);
  ws.getRow(z++).height = 6;
  scoreBerechnung(sprache).forEach((e, i) =>
    legendenZeile(ws, z++, e, {
      grund: e.name === T.beispiel ? FARBE.akzentHell : i % 2 === 0 ? FARBE.weiss : FARBE.grundHell,
      nameFarbe: FARBE.schrift,
      breiteB: BREITE_B,
    }),
  );

  ws.views = [{ state: "normal", showGridLines: false, activeCell: "A1" }];
  ws.pageSetup = {
    paperSize: 9,
    orientation: "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalCentered: true,
    margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.7, header: 0.3, footer: 0.3 },
  };
}

/** Zeilen eines Datenblatts. */
export const DATENBLATT = { gruppenZeile: 5, kopfZeile: 6, ersteDatenZeile: 7 } as const;

async function schreibeDatenblatt(wb: Mappe, ws: Blatt, b: LeistungsBlatt): Promise<void> {
  const { gruppenZeile: GZ, kopfZeile: KZ, ersteDatenZeile: DZ } = DATENBLATT;
  const n = b.spalten.length;
  const sprache: ExportSprache = b.sprache ?? "de";
  const T = MAPPE_TEXTE[sprache];
  const gruppenName =
    GRUPPEN_NAME_JE_SPRACHE[sprache];
  const zahlenformat =
    ZAHLENFORMAT_JE_SPRACHE[sprache];
  ws.columns = b.spalten.map((s) => ({ width: s.breite }));
  await setzeMarkenKopf(wb, ws, { titel: b.titel, unterzeile: b.erstellt, sprache });

  // ★ „← zur Übersicht" rechts in der Datumszeile (der Pfeil ist erlaubt,
  // Gedankenstriche nicht).
  if (n >= 3) ws.mergeCells(3, n - 1, 3, n);
  const zurueck = ws.getCell(3, Math.max(1, n - 1));
  zurueck.value = { text: T.zurUebersicht, hyperlink: internerLink(T.uebersicht) };
  zurueck.font = schrift({ bold: true, underline: true, color: { argb: argb(FARBE.akzent) } });
  zurueck.alignment = { vertical: "middle", horizontal: "right" };
  ws.getRow(4).height = 8;

  const uebenErste = b.spalten.findIndex((s) => s.gruppe === "ueben");
  const uebenLetzte = b.spalten.map((s) => s.gruppe).lastIndexOf("ueben");
  const akzentLinie = { style: "thin" as const, color: { argb: argb(FARBE.akzent) } };

  // ── Gruppenzeile ──────────────────────────────────────────────────────
  for (let i = 0; i < n; ) {
    const gruppe = b.spalten[i].gruppe;
    let j = i;
    while (j + 1 < n && b.spalten[j + 1].gruppe === gruppe) j++;
    if (j > i) ws.mergeCells(GZ, i + 1, GZ, j + 1);
    const c = ws.getCell(GZ, i + 1);
    c.value = gruppenName[gruppe];
    const hervor = gruppe === "ueben" || gruppe === "pruefung";
    c.font = hervor
      ? schrift({ bold: true, color: { argb: argb(gruppe === "ueben" ? FARBE.akzent : FARBE.schrift) } })
      : schrift({ size: 9, color: { argb: argb(FARBE.gedaempft) } });
    c.alignment = { vertical: "middle", horizontal: "center" };
    for (let k = i; k <= j; k++) {
      const zelle = ws.getCell(GZ, k + 1);
      zelle.fill = flaeche(gruppe === "ueben" ? FARBE.akzentHell : FARBE.grund);
      zelle.border = linienRundum();
    }
    i = j + 1;
  }
  ws.getRow(GZ).height = 20;

  // ── Spaltenköpfe ──────────────────────────────────────────────────────
  b.spalten.forEach((s, i) => {
    const c = ws.getCell(KZ, i + 1);
    c.value = s.kopf;
    c.font = schrift({ bold: true, color: { argb: argb(FARBE.weiss) } });
    c.fill = flaeche(FARBE.akzent);
    c.alignment = {
      vertical: "middle",
      horizontal: s.schluessel === "name" ? "left" : "center",
      wrapText: true,
      indent: s.schluessel === "name" ? 1 : 0,
    };
    c.border = linienRundum(FARBE.weiss);
  });
  // Fett ist breiter, der Filterknopf braucht Platz - darum schmaler gerechnet.
  const kopfZeilen = Math.max(...b.spalten.map((s) => umbruchZeilen(s.kopf, s.breite - 4)));
  ws.getRow(KZ).height = Math.ceil(kopfZeilen * 13 + 10);

  // ── Ein Kind je Zeile ─────────────────────────────────────────────────
  // ★ W3a: die Spalte „davon erledigt (Min.)" wird grün wie das Häkchen in
  // der App, sobald sie ihr Ziel derselben Zeile erreicht - dieselbe Zeile,
  // zwei Spalten, darum der Index VOR der Schleife.
  const wochenzielMinutenIdx = b.spalten.findIndex((s) => s.schluessel === "wochenzielMinuten");
  b.daten.forEach((werteZeile, r) => {
    const zeile = ws.getRow(DZ + r);
    zeile.height = 19;
    const hell = r % 2 === 0;
    werteZeile.forEach((wert, i) => {
      const s = b.spalten[i];
      const c = zeile.getCell(i + 1);
      c.value = wert;
      let grund: string =
        s.gruppe === "ueben"
          ? hell
            ? FARBE.akzentHauch
            : FARBE.akzentHell
          : hell
            ? FARBE.weiss
            : FARBE.grund;
      let font = schrift();
      const format = zahlenformat[s.format];
      if (typeof wert === "number" && format) c.numFmt = format;
      if (wert === OHNE_WERT) font = schrift({ color: { argb: argb(FARBE.gedaempft) } });
      const zielWert = wochenzielMinutenIdx >= 0 ? werteZeile[wochenzielMinutenIdx] : undefined;
      if (
        s.schluessel === "wochenzielErledigtMinuten" &&
        typeof wert === "number" &&
        typeof zielWert === "number" &&
        zielWert > 0 &&
        wert >= zielWert
      ) {
        font = schrift({ bold: true, color: { argb: argb(FARBE.erfolg) } });
        grund = FARBE.erfolgHell;
      }
      c.font = font;
      c.fill = flaeche(grund);
      c.alignment =
        s.schluessel === "name"
          ? { vertical: "middle", horizontal: "left", indent: 1 }
          : { vertical: "middle", horizontal: "center" };
      c.border = linienRundum();
    });
  });

  // ★ Die Gruppe „Üben" trägt links und rechts eine Linie in Akzentfarbe - wie
  // in der App (`UEBEN_LINKS`, `UEBEN_RECHTS`).
  if (uebenErste >= 0)
    for (let zeile = GZ; zeile < DZ + b.daten.length; zeile++) {
      const links = ws.getCell(zeile, uebenErste + 1);
      links.border = { ...links.border, left: akzentLinie };
      const rechts = ws.getCell(zeile, uebenLetzte + 1);
      rechts.border = { ...rechts.border, right: akzentLinie };
    }

  ws.views = [
    {
      state: "frozen",
      xSplit: 1,
      ySplit: KZ,
      topLeftCell: `B${DZ}`,
      activeCell: `B${DZ}`,
      showGridLines: false,
    },
  ];
  ws.autoFilter = {
    from: { row: KZ, column: 1 },
    to: { row: KZ + Math.max(1, b.daten.length), column: n },
  };
  ws.pageSetup = {
    paperSize: 9,
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalCentered: true,
    printTitlesRow: `${GZ}:${KZ}`,
    margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.6, header: 0.3, footer: 0.3 },
  };
}

/**
 * ★★★ Die ganze Datei als Bytes: „Übersicht", dann die Datenblätter in der
 * Reihenfolge von `blaetter` (aus `leistungsBlaetter`: Schuljahr, Gesamt, Woche).
 */
export async function leistungDateiBytes(
  blaetter: readonly LeistungsBlatt[],
  /**
   * ★ EN6a: `sprache` - ohne Angabe die der Blätter (`LeistungsBlatt.sprache`),
   * sonst Deutsch. So kann die Übersicht nie eine andere Sprache sprechen als
   * die Blätter dahinter.
   */
  o: { klassenname?: string | null; jetztMs: number; sprache?: ExportSprache },
): Promise<Uint8Array> {
  const sprache: ExportSprache = o.sprache ?? blaetter[0]?.sprache ?? "de";
  const wb = await neueMappe();
  const uebersicht = wb.addWorksheet(MAPPE_TEXTE[sprache].uebersicht, {
    properties: { tabColor: { argb: argb(FARBE.logoBlau) } },
  });
  const datenblaetter = blaetter.map((b) =>
    wb.addWorksheet(blattName(b.name), { properties: { tabColor: { argb: argb(FARBE.akzent) } } }),
  );
  await schreibeUebersicht(wb, uebersicht, blaetter, { ...o, sprache });
  for (let i = 0; i < blaetter.length; i++) await schreibeDatenblatt(wb, datenblaetter[i], blaetter[i]);
  return mappeAlsBytes(wb);
}

/** Lädt die Leistungstabelle herunter und gibt den Dateinamen zurück. */
export async function leistungHerunterladen(
  blaetter: readonly LeistungsBlatt[],
  o: { klassenname?: string | null; jetztMs: number; sprache?: ExportSprache },
): Promise<string> {
  const dateiname = leistungDateiname(o.klassenname, o.jetztMs);
  dateiHerunterladen(await leistungDateiBytes(blaetter, o), dateiname);
  return dateiname;
}
