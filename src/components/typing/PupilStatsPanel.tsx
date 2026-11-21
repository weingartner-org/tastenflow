/**
 * Die Statistik-Auswertung einer lernenden Person für den Tipptrainer
 * „Tastenflow" - die Ansicht „Meine Statistik" (`PupilSelfStats`): Jedes Kind
 * sieht die EIGENEN Werte, dieselbe Auswertung, nichts weniger.
 *
 * Grundsatz [[feedback_data_transparency]]: Lernende sehen alles über sich
 * selbst; die Lehrkraft sieht nicht mehr. Bis E4 (18.09.2026) zeigte dieselbe
 * Komponente auch der Lehrkraft die aufgeklappte Zeile eines Kindes; seither
 * baut `TastenflowReiter` diese Zeile aus einzelnen Bausteinen selbst und
 * holt hier nur noch `PupilData`, `SuspicionChip` und `fmtDauer`. Die
 * Lehrkraft-Fassung (`showSuspicion`, `flach`, Sie-Texte) lebt darum nur noch
 * in den Tests weiter.
 *
 * ── ÜBERSCHRIFTEN: die Sprungmarken für die Taste „h" (28.08.2026, §2.4 des
 *    Umbaus 11.09.2026, neu geordnet 19.09.2026) ────────────────────────────
 *
 * Johannes am 22.08.2026 abends (`Sensorik/FOKUSZIELE-TASTENFLOW.md` §0.5):
 *
 *   „Die Statistik braucht eine saubere Überschriften-Gliederung (h2/h3),
 *   damit das Kind mit der Screenreader-Taste h von Überschrift zu Überschrift
 *   springt."
 *
 * ★★★ Ausklappzeilen (`<details>`, zu Beginn zu): Wochenziele und Steigerung
 * im Verlauf seit 11.09.2026 (Umbauplan §2.4), Tippchallenges und Tasten-Stand
 * seit 19.09.2026. Ihr Stand steht schon in der `<summary>`, ohne Aufklappen
 * lesbar. ⚠️ Ihre `h3` steht IN der `<summary>` und bleibt damit eine
 * Sprungmarke für „h" (Prüfung E4: ohne sie liefe der Weg mit „h" an den
 * Blöcken vorbei).
 *
 * ★★★ DIE REIHENFOLGE (Johannes 19.09.2026: *„mach die Tippchallenges auch
 * als Ausklappzeile und zu Beginn eingeklappt; gib die Steigerung im Verlauf
 * unter die Tippchallenges; entferne den Bereich Lektionen, den versteht
 * jetzt niemand mehr, und gib den Bereich ‚Tasten, die sich lohnen' und ‚Als
 * Nächstes schaltest du frei …' zu dem Bereich Tastenstand - auch der
 * Tastenstand eine Zeile zum Ausklappen."*):
 *
 *   1. Wochenziele (zu) · 2. Werte im Überblick · 3. Abzeichen ·
 *   4. Tippchallenges (zu; nur, wenn es eine gibt) · 5. Steigerung im
 *   Verlauf (zu) · 6. Tasten-Stand (zu; darin „Als Nächstes", die
 *   Tastenkarte, die Tasten, die sich zu üben lohnen, und „Du übst gerade") ·
 *   7. Geschichten & Wissen · 8. (nur Lehrkraft) Eigenständigkeit.
 *
 * Den Block „Lektionen" (Lektionen-Stand mit einer Kachel je Lektion) gibt es
 * seit 19.09.2026 nicht mehr - die Übungsart „Lektionen" ist seit E7
 * entfallen, und die Kacheln erklärten etwas, das kein Kind mehr sieht.
 *
 *  • JEDER Block trägt eine echte `h3` (Wochenziele, Werte im Überblick,
 *    Abzeichen, Tippchallenges, Steigerung im Verlauf, Tasten-Stand,
 *    Geschichten & Wissen, Eigenständigkeit); darunter `h4` (Abzeichen-
 *    Familien, „Jede Tippchallenge einzeln", die Tasten, die sich lohnen).
 *  • Wo eine Gruppe/Liste ein `aria-label` trüge, hängt sie stattdessen per
 *    `aria-labelledby` an genau dieser Überschrift - ein `aria-label` NEBEN
 *    einer gleichlautenden Überschrift ist doppelte Auskunft, und auf einer
 *    Braillezeile kostet jedes Zeichen Platz.
 *  • Die Ebene ist `h3`, weil in „Meine Statistik" `h2 „Meine Statistik"`
 *    darüber steht (PupilSelfStats) - h2 → h3 → h4, ohne Lücke.
 */
import { feinesLangAttribut } from "@/lib/typing/schreibweise";
import { Fragment, useId, type ReactNode } from "react";
import {
  skinForStufe,
  stufeFuer,
  PupilStats,
  TaskEvent,
  TypingAccount,
  TypingProgress,
  FOCUS_COUNT,
  currentLevel,
  ensureIntroduced,
  fmtPercent,
  fmtTagMonat,
  focusUnits,
  masteredCount,
  masteryForLevel,
  nextLetter,
  scoreAusStats,
  scoreErklaerung,
  serienOverview,
  unitLabel,
  unitLabelEn,
  unitLabelFr,
  unitLabelEs,
  weakestKeys,
} from "@/lib/typing";
import type { GesperrteZeit } from "@/lib/typing/wochenziel";
import { mehrzahl, texte, useBedienSprache, type BedienSprache } from "@/lib/bedienSprache";
import { BadgeShelf } from "./BadgeShelf";
import { Kennzahl } from "./Kennzahl";
import { LetterMap, tastenStandSatz } from "./LetterMap";
import { LevelTrend } from "./LevelTrend";
import { WeeklyGoalStats } from "./WeeklyGoalStats";
import { Hinweisflaeche } from "./Zeigerhinweis";
// ★ E1 (24.09.2026): der Lernweg DES KINDES - auch wenn die Lehrkraft schaut.
import { lernwegAus } from "@/lib/typing/lernweg";
import { SprachpaketTor } from "./SprachpaketTor";
import { serienDesFortschrittsBekannt } from "@/lib/typing/serien";
import type { Lang } from "@/lib/typing/account";
import { unitLabelIt } from "@/lib/typing/tastenErklaerungIt";
import { unitLabelPl } from "@/lib/typing/tastenErklaerungPl";
import { unitLabelTr } from "@/lib/typing/tastenErklaerungTr";
import { unitLabelCs } from "@/lib/typing/tastenErklaerungCs";
// ★ G3c-VERTEILER (25.10.2026): die neun Gerüst-Sprachen aus ihrer eigenen Datei (heute die englischen Namen).
import { unitLabelBg } from "@/lib/typing/tastenErklaerungBg";
import { unitLabelEl } from "@/lib/typing/tastenErklaerungEl";
import { unitLabelHu } from "@/lib/typing/tastenErklaerungHu";
import { unitLabelNl } from "@/lib/typing/tastenErklaerungNl";
import { unitLabelPt } from "@/lib/typing/tastenErklaerungPt";
import { unitLabelBr } from "@/lib/typing/tastenErklaerungBr";
import { unitLabelRo } from "@/lib/typing/tastenErklaerungRo";
import { unitLabelSv } from "@/lib/typing/tastenErklaerungSv";
import { unitLabelUk } from "@/lib/typing/tastenErklaerungUk";

/** Geladene Daten einer lernenden Person (für Statistik + Auswertung). */
export interface PupilData {
  pupil: TypingAccount;
  progress: TypingProgress;
  events: TaskEvent[];
  stats: PupilStats;
  /**
   * Der Stand dieses Kontos konnte NICHT gelesen werden (31.08.2026).
   *
   * Ohne dieses Feld gab es keinen Unterschied zwischen „hat noch nicht geübt"
   * und „ich durfte nicht nachsehen" - beides sah nach Stufe 1, 0 Lektionen
   * und 0 Abzeichen aus. Wer die Zahlen anzeigt, muss den Unterschied kennen
   * und ihn hinschreiben; eine falsche Null ist schlimmer als eine
   * Fehlermeldung.
   */
  fehler?: boolean;
}

// (Bis 11.09.2026 stand hier eine eigene `fmtTagMonat()`, entfernt weil deckungsgleich
// mit `fmtTagMonat()` aus `src/lib/typing/datum.ts` - dorthin zusammengeführt.)

/** Geübte Zeit auf Deutsch (z. B. „1 Std. 5 Min."). */
export function fmtDuration(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} Sek.`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} Min.`;
  const h = Math.floor(m / 60);
  return `${h} Std. ${m % 60} Min.`;
}

/** Geübte Zeit auf Englisch (z. B. „1 hr 5 min"). */
export function fmtDurationEn(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} sec`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h} hr ${m % 60} min`;
}

/**
 * Geübte Zeit in der Bedienungssprache - ohne Angabe Deutsch (`fmtDuration`).
 *
 * ★ EN3 (19.09.2026): Englisch nach Glossar §1.2 - *3 h 36 min*, *45 seconds*.
 * ⚠️ Bewusst NICHT `fmtDurationEn` („1 hr 5 min", „45 sec"): Die ältere
 * Fassung hat keinen Aufrufer, ist aber in `tests/typing-stars.test.ts` so
 * festgeschrieben - offen für die Abnahme, ob sie auf das Glossar umzieht
 * oder wegfällt.
 */
/** ★ E11a-3 (26.09.2026): dieselbe Kurzform französisch - Glossar §9.1. */
function fmtDauerFr(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60)
    return mehrzahl(s, "fr", { one: (z) => `${z} seconde`, other: (z) => `${z} secondes` });
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

/** ★ ES-O (27.09.2026): dieselbe Kurzform spanisch - „3 h 36 min", „45 segundos". */
function fmtDauerEs(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60)
    return mehrzahl(s, "es", { one: (z) => `${z} segundo`, other: (z) => `${z} segundos` });
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

/** ★ O-IT (02.10.2026): „45 secondi", „12 min", „1 h 5 min". */
function fmtDauerIt(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60)
    return mehrzahl(s, "it", { one: (z) => `${z} secondo`, other: (z) => `${z} secondi` });
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

/**
 * ★ O-PL (02.10.2026): „45 s", „12 min", „3 godz. 36 min" (Glossar §2.10) -
 * Abkürzungen beugen sich nicht, darum keine Mehrzahl-Formen nötig.
 */
function fmtDauerPl(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} godz. ${m % 60} min`;
}

/**
 * ★ O-TR (02.10.2026): "45 saniye", "12 dk.", "3 sa. 36 dk." (Glossar §2.10) -
 * nach der Zahl immer die Einzahl, keine Mehrzahl-Formen nötig.
 */
function fmtDauerTr(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} saniye`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} dk.`;
  return `${Math.floor(m / 60)} sa. ${m % 60} dk.`;
}

/**
 * ★ O-CS (03.10.2026): „45 s", „12 min", „3 h 36 min" (Glossar §2.10, Microsoft
 * [L]) - Abkürzungen ohne Punkt beugen sich nicht, keine Mehrzahl-Formen nötig.
 */
function fmtDauerCs(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

// ★ O2-COMP (30.10.2026): bg eigene Fassung.
/**
 * ★ O-BG: „45 сек", „12 мин", „3 ч 36 мин" (Glossar §2.10) - Zahl + geschütztes
 * Leerzeichen + Einheit; Abkürzungen beugen sich nicht, keine Zählform nötig.
 */
function fmtDauerBg(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} сек`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} мин`;
  return `${Math.floor(m / 60)} ч ${m % 60} мин`;
}

// ★ O2-COMP (30.10.2026): el eigene Fassung.
/**
 * ★ O2-COMP el: „45 δευτερόλεπτα", „12 λεπτά", „3 ώρες 36 λεπτά" - ausgeschrieben, nicht
 * abgekürzt (Glossar §2.10: die Sprachausgabe liest „λεπ." schlecht); Mehrzahl über
 * mehrzahl(n, "el") (§2.11: 1 λεπτό / 5 λεπτά, 1 ώρα / 3 ώρες).
 */
function fmtDauerEl(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60)
    return mehrzahl(s, "el", { one: (z) => `${z} δευτερόλεπτο`, other: (z) => `${z} δευτερόλεπτα` });
  const minuten = (n: number) =>
    mehrzahl(n, "el", { one: (z) => `${z} λεπτό`, other: (z) => `${z} λεπτά` });
  const m = Math.round(s / 60);
  if (m < 60) return minuten(m);
  const stunden = mehrzahl(Math.floor(m / 60), "el", { one: (z) => `${z} ώρα`, other: (z) => `${z} ώρες` });
  return `${stunden} ${minuten(m % 60)}`;
}

// ★ O2-COMP (30.10.2026): hu eigene Fassung.
/**
 * ★ O-HU: „45 mp", „12 perc", „3 óra 36 perc" (Glossar hu §2.10) - nach der Zahl
 * steht immer die Einzahl (Regel 13), darum keine Mehrzahl-Formen nötig.
 */
function fmtDauerHu(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} mp`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} perc`;
  return `${Math.floor(m / 60)} óra ${m % 60} perc`;
}

// ★ O2-COMP (30.10.2026): nl eigene Fassung.
/**
 * ★ O-NL: „45 s", „12 min", „3 u 36 min" (Glossar §2.10 „Dauer": „u" für Stunde in
 * Tabellen) - Abkürzungen beugen sich nicht, keine Mehrzahl-Formen nötig.
 */
function fmtDauerNl(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} u ${m % 60} min`;
}

// ★ O2-COMP (30.10.2026): pt eigene Fassung.
/**
 * ★ O2-COMP pt (29.10.2026): „45 segundos", „12 min", „3 h 36 min" (Glossar pt §2.10/§2.11) -
 * Abkürzungen beugen sich nicht; nur die ausgeschriebenen Sekunden brauchen one/other
 * (0 ist in Portugal Mehrzahl).
 */
function fmtDauerPt(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60)
    return mehrzahl(s, "pt", { one: (z) => `${z} segundo`, other: (z) => `${z} segundos` });
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

// ★ O2-COMP (30.10.2026): br eigene Fassung.
/**
 * ★ O-BR: „45 s", „12 min", „3 h 36 min" (Glossar pt-BR, SI-Abkürzungen) -
 * Abkürzungen beugen sich nicht, keine Mehrzahl-Formen nötig (und kein „0 segundo").
 */
function fmtDauerBr(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

// ★ O2-COMP (30.10.2026): ro eigene Fassung.
/**
 * ★ O-RO (29.10.2026): „45 s”, „12 min”, „3 h 36 min” (Glosar §2.10, Microsoft [L]:
 * „min” fără punct) - abrevierile nu se acordă, deci nu e nevoie de forme de plural
 * și nici de „de” de la 20 în sus.
 */
function fmtDauerRo(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

// ★ O2-COMP (30.10.2026): sv eigene Fassung.
/**
 * ★ O2-COMP sv: „45 sekunder", „12 min", „3 h 36 min" (Glossar §2.10 Dauer -
 * Einheitszeichen ohne Punkt; Sekunden ausgeschrieben mit one/other, §2.11).
 */
function fmtDauerSv(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60)
    return mehrzahl(s, "sv", { one: (z) => `${z} sekund`, other: (z) => `${z} sekunder` });
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

// ★ O2-COMP (30.10.2026): uk eigene Fassung.
/**
 * ★ O-UK: „45 с", „12 хв", „3 год 36 хв" (Glossar uk §2.10, gemessen `Intl` style:"unit") -
 * Abkürzungen ohne Punkt beugen sich nicht, darum keine Mehrzahl-Formen nötig.
 */
function fmtDauerUk(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s} с`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} хв`;
  return `${Math.floor(m / 60)} год ${m % 60} хв`;
}

export function fmtDauer(ms: number, sprache: BedienSprache = "de"): string {
  if (sprache === "bg") return fmtDauerBg(ms);
  if (sprache === "el") return fmtDauerEl(ms);
  if (sprache === "hu") return fmtDauerHu(ms);
  if (sprache === "nl") return fmtDauerNl(ms);
  if (sprache === "pt") return fmtDauerPt(ms);
  if (sprache === "br") return fmtDauerBr(ms);
  if (sprache === "ro") return fmtDauerRo(ms);
  if (sprache === "sv") return fmtDauerSv(ms);
  if (sprache === "uk") return fmtDauerUk(ms);
  if (sprache === "cs") return fmtDauerCs(ms);
  if (sprache === "tr") return fmtDauerTr(ms);
  if (sprache === "pl") return fmtDauerPl(ms);
  if (sprache === "it") return fmtDauerIt(ms);
  if (sprache === "fr") return fmtDauerFr(ms);
  if (sprache === "es") return fmtDauerEs(ms);
  if (sprache !== "en") return fmtDuration(ms);
  const s = Math.round(ms / 1000);
  if (s < 60) return mehrzahl(s, "en", { one: (z) => `${z} second`, other: (z) => `${z} seconds` });
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

/** Der Name einer Taste in der Bedienungssprache (Beschriftung, kein Übungsinhalt). */
const TASTE_NAME_JE_SPRACHE: Record<BedienSprache, (unit: string) => string> = {
  de: unitLabel,
  en: unitLabelEn,
  fr: unitLabelFr,
  es: unitLabelEs,
  it: unitLabelIt,
  pl: unitLabelPl, // ★ O-PL (02.10.2026)
  tr: unitLabelTr, // ★ O-TR (02.10.2026)
  cs: unitLabelCs, // ★ O-CS (03.10.2026)
  // ★ O2-COMP (30.10.2026): die neun Sprachen mit eigener Fassung.
  bg: unitLabelBg,
  el: unitLabelEl,
  hu: unitLabelHu,
  nl: unitLabelNl,
  pt: unitLabelPt,
  br: unitLabelBr,
  ro: unitLabelRo,
  sv: unitLabelSv,
  uk: unitLabelUk,
};
function tasteName(unit: string, sprache: BedienSprache): string {
  return TASTE_NAME_JE_SPRACHE[sprache](unit);
}

/**
 * ★★ DIE TEXTE DER STATISTIK - Kind („selbst") UND Lehrkraft, beide Sprachen
 * (EN3, 19.09.2026). Deutsch wortgleich wie vorher; wo JSX mehrere
 * Textknoten hatte, stehen Teil-Listen (Bauplan §3, `Teil[]`), damit die
 * deutsche Seite Knoten für Knoten gleich bleibt.
 *
 * Englisch nach Glossar §3.2: *figures at a glance*, *time practised*,
 * *exercises*, *active days*, *keys mastered*, *average/best speed*,
 * *accuracy*, *wobbly keys* (nie *weak*), *non-fiction* (Wissen), *stage*
 * (Etappe). Die Lehrkraft liest über *the pupil* nur, wo ein Satz über das
 * Kind spricht; die meisten Beschriftungen sind für beide gleich.
 */
const PANEL_TEXTE = texte({
  de: {
    werteTitel: (selbst: boolean) => (selbst ? "Deine Werte im Überblick" : "Werte im Überblick"),
    score: "Score",
    zeitDe: "Geübte Zeit Deutsch",
    zeitEn: "Geübte Zeit Englisch",
    zeitFr: "Geübte Zeit Französisch",
    // ★ ES-O (27.09.2026): nur sichtbar, wo wirklich Spanisch geübt wurde.
    zeitEs: "Geübte Zeit Spanisch",
    uebungen: "Übungen",
    aktiveTage: "Aktive Tage",
    tastenSitzen: "Tasten sitzen",
    tempoSchnitt: "⌀ Tempo",
    tempoBest: "Bestes Tempo",
    treffsicherheit: "Treffsicherheit",
    geuebtSeit: "Geübt seit",
    zuletzt: "Zuletzt geübt",
    alsNaechstes: (selbst: boolean) =>
      selbst ? "Als Nächstes schaltest du frei: " : "Als Nächstes wird freigeschaltet: ",
    tastenStand: "Tasten-Stand",
    schwachTitel: (selbst: boolean) =>
      selbst ? "Diese Tasten lohnt sich zu üben:" : "Schwächste Tasten (üben lohnt sich):",
    schwachName: (taste: string, prozent: string, anschlaege: number) =>
      `${taste} schwach, ${prozent} Treffer, ${anschlaege} Anschläge`,
    uebtGerade: (selbst: boolean) => (selbst ? "Du übst gerade: " : "Übt gerade: "),
    geschichten: "Geschichten & Wissen",
    liestGerade: (selbst: boolean) => (selbst ? "Du liest gerade: " : "Liest gerade: "),
    etappe: (etappe: number, gesamt: number) => ` - Etappe ${etappe} von ${gesamt}`,
    zeile: (zeile: number, gesamt: number) => ` · Zeile ${zeile} von ${gesamt}`,
    fertig: (selbst: boolean) => (selbst ? "Fertig gelesen: " : "Fertig: "),
    eigenstaendigkeit: "Eigenständigkeit (KI-Check):",
  },
  en: {
    werteTitel: (selbst: boolean) => (selbst ? "Your figures at a glance" : "Figures at a glance"),
    score: "Score",
    zeitDe: "Time practised in German",
    zeitEn: "Time practised in English",
    zeitFr: "Time practised in French",
    zeitEs: "Time practised in Spanish",
    uebungen: "Exercises",
    aktiveTage: "Active days",
    tastenSitzen: "Keys mastered",
    tempoSchnitt: "Average speed",
    tempoBest: "Best speed",
    treffsicherheit: "Accuracy",
    geuebtSeit: "Practising since",
    zuletzt: "Last practised",
    alsNaechstes: (selbst: boolean) => (selbst ? "Next you'll unlock: " : "Next to be unlocked: "),
    tastenStand: "Key progress",
    // „Schwächste Tasten" ⇒ nie *weakest* (Glossar §1.4, §5 Nr. 10) - gesagt
    // wird, wofür die Liste da ist: wo sich Üben lohnt.
    schwachTitel: (selbst: boolean) =>
      selbst ? "These keys are worth practising:" : "Keys most worth practising:",
    schwachName: (taste: string, prozent: string, anschlaege: number) =>
      `${taste}, ${prozent} correct, ${anschlaege} keystrokes`,
    uebtGerade: (selbst: boolean) => (selbst ? "You're practising: " : "Currently practising: "),
    geschichten: "Stories & non-fiction",
    liestGerade: (selbst: boolean) => (selbst ? "You're reading: " : "Currently reading: "),
    etappe: (etappe: number, gesamt: number) => ` - stage ${etappe} of ${gesamt}`,
    zeile: (zeile: number, gesamt: number) => ` · line ${zeile} of ${gesamt}`,
    fertig: (selbst: boolean) => (selbst ? "Finished reading: " : "Finished: "),
    eigenstaendigkeit: "Independent work (AI check):",
  },
  // ★ E11a: „tu" wenn selbst===true (Kind sieht seine eigenen Werte), sonst
  // neutrale Beschriftung ohne Anrede (Lehrkraft-Ansicht, F9).
  fr: {
    werteTitel: (selbst: boolean) => (selbst ? "Tes chiffres en un coup d'œil" : "Chiffres en un coup d'œil"),
    score: "Score",
    zeitDe: "Temps exercé en allemand",
    zeitEn: "Temps exercé en anglais",
    zeitFr: "Temps exercé en français",
    zeitEs: "Temps exercé en espagnol",
    uebungen: "Exercices",
    aktiveTage: "Jours actifs",
    tastenSitzen: "Touches acquises",
    tempoSchnitt: "Vitesse moyenne",
    tempoBest: "Meilleure vitesse",
    treffsicherheit: "Précision",
    geuebtSeit: "S'exerce depuis",
    zuletzt: "Dernier exercice",
    alsNaechstes: (selbst: boolean) => (selbst ? "Tu débloques ensuite : " : "Prochain déblocage : "),
    tastenStand: "État des touches",
    schwachTitel: (selbst: boolean) =>
      selbst ? "Ces touches valent la peine d'être exercées :" : "Touches les plus utiles à exercer :",
    schwachName: (taste: string, prozent: string, anschlaege: number) =>
      `${taste}, ${prozent} réussi, ${anschlaege} frappes`,
    uebtGerade: (selbst: boolean) => (selbst ? "Tu t'exerces sur : " : "En cours d'exercice : "),
    geschichten: "Histoires et documentaires",
    liestGerade: (selbst: boolean) => (selbst ? "Tu lis : " : "En cours de lecture : "),
    etappe: (etappe: number, gesamt: number) => ` - étape ${etappe} sur ${gesamt}`,
    zeile: (zeile: number, gesamt: number) => ` - ligne ${zeile} sur ${gesamt}`,
    fertig: (selbst: boolean) => (selbst ? "Lecture terminée : " : "Terminé : "),
    eigenstaendigkeit: "Autonomie (vérification IA) :",
  },
  // ★ ES-O (27.09.2026): `selbst` = tú (das Kind), sonst ohne Anrede (Lehrkraft).
  es: {
    werteTitel: (selbst: boolean) => (selbst ? "Tus cifras de un vistazo" : "Cifras de un vistazo"),
    score: "Puntuación",
    zeitDe: "Tiempo practicado en alemán",
    zeitEn: "Tiempo practicado en inglés",
    zeitFr: "Tiempo practicado en francés",
    zeitEs: "Tiempo practicado en español",
    uebungen: "Ejercicios",
    aktiveTage: "Días activos",
    tastenSitzen: "Teclas aprendidas",
    tempoSchnitt: "Velocidad media",
    tempoBest: "Mejor velocidad",
    treffsicherheit: "Precisión",
    geuebtSeit: "Practica desde",
    zuletzt: "Última práctica",
    alsNaechstes: (selbst: boolean) => (selbst ? "Lo próximo que desbloqueas: " : "Próximo desbloqueo: "),
    tastenStand: "Estado de las teclas",
    schwachTitel: (selbst: boolean) =>
      selbst ? "Vale la pena practicar estas teclas:" : "Teclas que más conviene practicar:",
    schwachName: (taste: string, prozent: string, anschlaege: number) =>
      `${taste}, ${prozent} acertado, ${anschlaege} pulsaciones`,
    uebtGerade: (selbst: boolean) => (selbst ? "Estás practicando: " : "Practicando ahora: "),
    geschichten: "Cuentos y saberes",
    liestGerade: (selbst: boolean) => (selbst ? "Estás leyendo: " : "Leyendo ahora: "),
    etappe: (etappe: number, gesamt: number) => ` - etapa ${etappe} de ${gesamt}`,
    zeile: (zeile: number, gesamt: number) => ` - línea ${zeile} de ${gesamt}`,
    fertig: (selbst: boolean) => (selbst ? "Lectura terminada: " : "Terminado: "),
    eigenstaendigkeit: "Autonomía (revisión con IA):",
  },
  // ★ O-IT (02.10.2026): Kind („selbst") „tu", Lehrkraft neutral; „lavoro autonomo" (Glossar §2.6).
  it: {
    werteTitel: (selbst: boolean) => (selbst ? "I tuoi dati in breve" : "I dati in breve"),
    score: "Punteggio",
    zeitDe: "Tempo di esercizio in tedesco",
    zeitEn: "Tempo di esercizio in inglese",
    zeitFr: "Tempo di esercizio in francese",
    zeitEs: "Tempo di esercizio in spagnolo",
    uebungen: "Esercizi",
    aktiveTage: "Giorni attivi",
    tastenSitzen: "Tasti imparati",
    tempoSchnitt: "Velocità media",
    tempoBest: "Velocità migliore",
    treffsicherheit: "Precisione",
    geuebtSeit: "Si esercita da",
    zuletzt: "Ultimo esercizio",
    alsNaechstes: (selbst: boolean) => (selbst ? "La prossima cosa che sblocchi: " : "Prossimo sblocco: "),
    tastenStand: "Stato dei tasti",
    schwachTitel: (selbst: boolean) =>
      selbst ? "Vale la pena esercitare questi tasti:" : "Tasti che conviene esercitare di più:",
    schwachName: (taste: string, prozent: string, anschlaege: number) =>
      `${taste}, ${prozent} di battute giuste, ${anschlaege} battute`,
    uebtGerade: (selbst: boolean) => (selbst ? "Stai esercitando: " : "Sta esercitando: "),
    geschichten: "Storie e curiosità",
    liestGerade: (selbst: boolean) => (selbst ? "Stai leggendo: " : "Sta leggendo: "),
    etappe: (etappe: number, gesamt: number) => ` - tappa ${etappe} di ${gesamt}`,
    zeile: (zeile: number, gesamt: number) => ` - riga ${zeile} di ${gesamt}`,
    fertig: (selbst: boolean) => (selbst ? "Lettura finita: " : "Finito: "),
    eigenstaendigkeit: "Lavoro autonomo (controllo con IA):",
  },
  // ★ O-PL (02.10.2026): Kind („selbst") „ty", Lehrkraft dritte Person Präsens
  // („Teraz ćwiczy") - nie eine Vergangenheit, nie ein Adjektiv über die Person
  // (Glossar Regel 2). Zahl + Hauptwort nur nach Doppelpunkt (§2.10a).
  pl: {
    werteTitel: (selbst: boolean) => (selbst ? "Twoje dane w skrócie" : "Dane w skrócie"),
    score: "Wynik",
    zeitDe: "Czas ćwiczeń po niemiecku",
    zeitEn: "Czas ćwiczeń po angielsku",
    zeitFr: "Czas ćwiczeń po francusku",
    zeitEs: "Czas ćwiczeń po hiszpańsku",
    uebungen: "Ćwiczenia",
    aktiveTage: "Dni aktywności",
    tastenSitzen: "Pewne klawisze",
    tempoSchnitt: "Średnie tempo",
    tempoBest: "Najlepsze tempo",
    treffsicherheit: "Dokładność",
    geuebtSeit: "Pierwsze ćwiczenie",
    zuletzt: "Ostatnie ćwiczenie",
    alsNaechstes: (selbst: boolean) => (selbst ? "Jako następny odblokujesz: " : "Następny do odblokowania: "),
    tastenStand: "Stan klawiszy",
    schwachTitel: (selbst: boolean) =>
      selbst ? "Te klawisze warto poćwiczyć:" : "Klawisze, które najbardziej warto poćwiczyć:",
    schwachName: (taste: string, prozent: string, anschlaege: number) =>
      `${taste}, dokładność ${prozent}, liczba uderzeń: ${anschlaege}`,
    uebtGerade: (selbst: boolean) => (selbst ? "Teraz ćwiczysz: " : "Teraz ćwiczy: "),
    geschichten: "Opowiadania i ciekawostki",
    liestGerade: (selbst: boolean) => (selbst ? "Teraz czytasz: " : "Teraz czyta: "),
    etappe: (etappe: number, gesamt: number) => ` - etap ${etappe} z ${gesamt}`,
    zeile: (zeile: number, gesamt: number) => ` - wiersz ${zeile} z ${gesamt}`,
    fertig: (selbst: boolean) => (selbst ? "Przeczytane: " : "Ukończone: "),
    eigenstaendigkeit: "Samodzielność pracy (sprawdzenie przez AI):",
  },
  // ★ O-TR (02.10.2026): Kind ("selbst") sen, Lehrkraft Hauptwörter ohne Anrede
  // ("Şu anki alıştırma: ") - Glossar Regel 1; "Satır 3, toplam 12" statt "3 / 12",
  // keine Endung an Zahl oder Tastenname (Regel 6); oturmuş tuşlar, henüz
  // oturmamış tuşlar, Öyküler ve bilgiler (§2.2), ortalama hız (§2.6, nie das Zeichen).
  tr: {
    werteTitel: (selbst: boolean) => (selbst ? "Değerlerine genel bakış" : "Değerlere genel bakış"),
    score: "Puan",
    zeitDe: "Çalışma süresi: Almanca",
    zeitEn: "Çalışma süresi: İngilizce",
    zeitFr: "Çalışma süresi: Fransızca",
    zeitEs: "Çalışma süresi: İspanyolca",
    uebungen: "Alıştırmalar",
    aktiveTage: "Çalışılan günler",
    tastenSitzen: "Oturmuş tuşlar",
    tempoSchnitt: "Ortalama hız",
    tempoBest: "En iyi hız",
    treffsicherheit: "Doğruluk",
    geuebtSeit: "İlk alıştırma",
    zuletzt: "Son alıştırma",
    alsNaechstes: (selbst: boolean) => (selbst ? "Sırada kilidini açacağın: " : "Sırada kilidi açılacak: "),
    tastenStand: "Tuş durumu",
    schwachTitel: (selbst: boolean) =>
      selbst ? "Bu tuşları çalışmak faydalı olur:" : "Henüz oturmamış tuşlar (çalışmak faydalı):",
    schwachName: (taste: string, prozent: string, anschlaege: number) =>
      `${taste}, doğruluk ${prozent}, vuruş sayısı: ${anschlaege}`,
    uebtGerade: (selbst: boolean) => (selbst ? "Şu anki alıştırman: " : "Şu anki alıştırma: "),
    geschichten: "Öyküler ve bilgiler",
    liestGerade: (selbst: boolean) => (selbst ? "Şu an okuduğun: " : "Şu an okunan: "),
    etappe: (etappe: number, gesamt: number) => ` - bölüm ${etappe}, toplam ${gesamt}`,
    zeile: (zeile: number, gesamt: number) => ` - satır ${zeile}, toplam ${gesamt}`,
    fertig: (selbst: boolean) => (selbst ? "Bitirdiğin: " : "Bitirilen: "),
    eigenstaendigkeit: "Bağımsız çalışma (yapay zeka denetimi):",
  },
  // ★ O-CS (03.10.2026): Kind („selbst") ty, Lehrkraft dritte Person Präsens
  // („Právě cvičí: ") - nie eine Vergangenheit, nie ein Adjektiv über die Person
  // (Glossar Regel 2); „Díl 2/8", „řádek 3/12" mit Schrägstrich (Regel 13);
  // jistá klávesa, Příběhy a zajímavosti (§2.2), Zahl nur nach Doppelpunkt.
  cs: {
    werteTitel: (selbst: boolean) => (selbst ? "Tvoje hodnoty v kostce" : "Hodnoty v kostce"),
    score: "Skóre",
    zeitDe: "Čas cvičení: němčina",
    zeitEn: "Čas cvičení: angličtina",
    zeitFr: "Čas cvičení: francouzština",
    zeitEs: "Čas cvičení: španělština",
    uebungen: "Cvičení",
    aktiveTage: "Aktivní dny",
    tastenSitzen: "Jisté klávesy",
    tempoSchnitt: "Průměrná rychlost",
    tempoBest: "Nejlepší rychlost",
    treffsicherheit: "Přesnost",
    geuebtSeit: "První cvičení",
    zuletzt: "Poslední cvičení",
    alsNaechstes: (selbst: boolean) => (selbst ? "Jako další odemkneš: " : "Jako další se odemkne: "),
    tastenStand: "Stav kláves",
    schwachTitel: (selbst: boolean) =>
      selbst ? "Tyto klávesy se vyplatí procvičit:" : "Klávesy, které se nejvíc vyplatí procvičit:",
    schwachName: (taste: string, prozent: string, anschlaege: number) =>
      `${taste}, přesnost ${prozent}, počet úhozů: ${anschlaege}`,
    uebtGerade: (selbst: boolean) => (selbst ? "Teď cvičíš: " : "Právě cvičí: "),
    geschichten: "Příběhy a zajímavosti",
    liestGerade: (selbst: boolean) => (selbst ? "Teď čteš: " : "Právě čte: "),
    etappe: (etappe: number, gesamt: number) => ` - díl ${etappe}/${gesamt}`,
    zeile: (zeile: number, gesamt: number) => ` - řádek ${zeile}/${gesamt}`,
    fertig: (selbst: boolean) => (selbst ? "Přečteno: " : "Dokončeno: "),
    eigenstaendigkeit: "Samostatná práce (kontrola samostatnosti):",
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      werteTitel: (selbst: boolean) => (selbst ? "Твоите стойности накратко" : "Стойности накратко"),
      score: "Резултат",
      zeitDe: "Време за упражнения на немски",
      zeitEn: "Време за упражнения на английски",
      zeitFr: "Време за упражнения на френски",
      zeitEs: "Време за упражнения на испански",
      uebungen: "Упражнения",
      aktiveTage: "Активни дни",
      tastenSitzen: "Сигурни клавиши",
      tempoSchnitt: "Средна скорост",
      tempoBest: "Най-добра скорост",
      treffsicherheit: "Точност",
      geuebtSeit: "Начало на упражненията",
      zuletzt: "Последно упражнение",
      alsNaechstes: (selbst: boolean) => (selbst ? "Следващото, което отключваш: " : "Следва за отключване: "),
      tastenStand: "Състояние на клавишите",
      schwachTitel: (selbst: boolean) =>
        selbst ? "Тези клавиши си струва да упражняваш:" : "Клавиши, които си струва да се упражняват:",
      schwachName: (taste: string, prozent: string, anschlaege: number) =>
        `${taste}, точност ${prozent}, ${mehrzahl(anschlaege, "bg", { one: (z) => `${z} знак`, other: (z) => `${z} знака` })}`,
      uebtGerade: (selbst: boolean) => (selbst ? "Сега упражняваш: " : "Сега упражнява: "),
      geschichten: "Истории и любопитни факти",
      liestGerade: (selbst: boolean) => (selbst ? "Сега четеш: " : "Сега чете: "),
      etappe: (etappe: number, gesamt: number) => ` - част ${etappe}/${gesamt}`,
      zeile: (zeile: number, gesamt: number) => ` · ред ${zeile}/${gesamt}`,
      fertig: (selbst: boolean) => (selbst ? "Прочетено докрай: " : "Прочетено: "),
      eigenstaendigkeit: "Самостоятелна работа (проверка за самостоятелност):",
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      werteTitel: (selbst: boolean) => (selbst ? "Οι τιμές σου με μια ματιά" : "Τιμές με μια ματιά"),
      score: "Σκορ",
      zeitDe: "Χρόνος εξάσκησης στα Γερμανικά",
      zeitEn: "Χρόνος εξάσκησης στα Αγγλικά",
      zeitFr: "Χρόνος εξάσκησης στα Γαλλικά",
      zeitEs: "Χρόνος εξάσκησης στα Ισπανικά",
      uebungen: "Ασκήσεις",
      aktiveTage: "Ενεργές ημέρες",
      tastenSitzen: "Σίγουρα πλήκτρα",
      tempoSchnitt: "Μέση ταχύτητα",
      tempoBest: "Καλύτερη ταχύτητα",
      treffsicherheit: "Ακρίβεια",
      geuebtSeit: "Εξάσκηση από",
      zuletzt: "Τελευταία εξάσκηση",
      alsNaechstes: (selbst: boolean) =>
        selbst ? "Το επόμενο που ξεκλειδώνεις: " : "Το επόμενο που ξεκλειδώνεται: ",
      tastenStand: "Κατάσταση πλήκτρων",
      schwachTitel: (selbst: boolean) =>
        selbst ? "Αυτά τα πλήκτρα αξίζει να τα εξασκήσεις:" : "Πλήκτρα που αξίζει να εξασκηθούν:",
      schwachName: (taste: string, prozent: string, anschlaege: number) =>
        `${taste}, ${prozent} σωστά, ${mehrzahl(anschlaege, "el", { one: (z) => `${z} πάτημα`, other: (z) => `${z} πατήματα` })}`,
      uebtGerade: (selbst: boolean) => (selbst ? "Εξασκείς τώρα: " : "Εξάσκηση τώρα: "),
      geschichten: "Ιστορίες και γνώσεις",
      liestGerade: (selbst: boolean) => (selbst ? "Διαβάζεις τώρα: " : "Ανάγνωση τώρα: "),
      etappe: (etappe: number, gesamt: number) => ` - μέρος ${etappe} από ${gesamt}`,
      zeile: (zeile: number, gesamt: number) => `, γραμμή ${zeile} από ${gesamt}`,
      fertig: (selbst: boolean) => (selbst ? "Διάβασες ως το τέλος: " : "Ολοκληρώθηκε: "),
      eigenstaendigkeit: "Αυτόνομη εργασία (έλεγχος αυτονομίας):",
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      werteTitel: (selbst: boolean) => (selbst ? "Értékeid röviden" : "Értékek röviden"),
      score: "Pontszám",
      zeitDe: "Gyakorlási idő: német",
      zeitEn: "Gyakorlási idő: angol",
      zeitFr: "Gyakorlási idő: francia",
      zeitEs: "Gyakorlási idő: spanyol",
      uebungen: "Gyakorlatok",
      aktiveTage: "Aktív napok",
      tastenSitzen: "Biztos billentyűk",
      tempoSchnitt: "Átlagos sebesség",
      tempoBest: "Legjobb sebesség",
      treffsicherheit: "Pontosság",
      geuebtSeit: "Gyakorlás kezdete",
      zuletzt: "Utolsó gyakorlás",
      alsNaechstes: (selbst: boolean) => (selbst ? "Legközelebb ezt oldod fel: " : "Következő feloldás: "),
      tastenStand: "Billentyűk állapota",
      // Nie „gyenge" (Glossar hu §2.2) - gesagt wird, wo sich Üben lohnt.
      schwachTitel: (selbst: boolean) =>
        selbst ? "Ezeket a billentyűket érdemes gyakorolni:" : "A leginkább gyakorlásra érdemes billentyűk:",
      schwachName: (taste: string, prozent: string, anschlaege: number) =>
        `${taste}: pontosság ${prozent}, leütések: ${anschlaege}`,
      uebtGerade: (selbst: boolean) => (selbst ? "Most ezt gyakorolod: " : "Most gyakorolja: "),
      geschichten: "Történetek és érdekességek",
      liestGerade: (selbst: boolean) => (selbst ? "Most ezt olvasod: " : "Most olvassa: "),
      etappe: (etappe: number, gesamt: number) => ` - rész: ${etappe}/${gesamt}`,
      zeile: (zeile: number, gesamt: number) => ` · sor: ${zeile}/${gesamt}`,
      fertig: (selbst: boolean) => (selbst ? "Végigolvastad: " : "Befejezve: "),
      eigenstaendigkeit: "Önálló munka (MI-ellenőrzés):",
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      werteTitel: (selbst: boolean) => (selbst ? "Jouw waarden in één oogopslag" : "Waarden in één oogopslag"),
      score: "Score",
      zeitDe: "Geoefende tijd Duits",
      zeitEn: "Geoefende tijd Engels",
      zeitFr: "Geoefende tijd Frans",
      zeitEs: "Geoefende tijd Spaans",
      uebungen: "Oefeningen",
      aktiveTage: "Actieve dagen",
      tastenSitzen: "Zekere toetsen",
      tempoSchnitt: "Gemiddelde snelheid",
      tempoBest: "Beste snelheid",
      treffsicherheit: "Nauwkeurigheid",
      geuebtSeit: "Geoefend sinds",
      zuletzt: "Laatst geoefend",
      alsNaechstes: (selbst: boolean) => (selbst ? "Als volgende speel je vrij: " : "Als volgende wordt vrijgespeeld: "),
      tastenStand: "Stand van de toetsen",
      // Nie „zwak" (Glossar §2.2) - gesagt wird, wofür die Liste da ist.
      schwachTitel: (selbst: boolean) =>
        selbst ? "Deze toetsen zijn de moeite waard om te oefenen:" : "Toetsen die het meest de moeite waard zijn om te oefenen:",
      schwachName: (taste: string, prozent: string, anschlaege: number) =>
        `${taste}, ${prozent} goed, ${anschlaege} aanslagen`,
      uebtGerade: (selbst: boolean) => (selbst ? "Je oefent nu: " : "Oefent nu: "),
      geschichten: "Verhalen en weetjes",
      liestGerade: (selbst: boolean) => (selbst ? "Je leest nu: " : "Leest nu: "),
      etappe: (etappe: number, gesamt: number) => ` - deel ${etappe} van ${gesamt}`,
      zeile: (zeile: number, gesamt: number) => ` · regel ${zeile} van ${gesamt}`,
      fertig: (selbst: boolean) => (selbst ? "Uitgelezen: " : "Klaar: "),
      eigenstaendigkeit: "Zelfstandig werk (controle met AI):",
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      werteTitel: (selbst: boolean) => (selbst ? "Os teus valores em resumo" : "Os valores em resumo"),
      score: "Pontuação",
      zeitDe: "Tempo de prática em alemão",
      zeitEn: "Tempo de prática em inglês",
      zeitFr: "Tempo de prática em francês",
      zeitEs: "Tempo de prática em espanhol",
      uebungen: "Exercícios",
      aktiveTage: "Dias ativos",
      tastenSitzen: "Teclas dominadas",
      tempoSchnitt: "Velocidade média",
      tempoBest: "Melhor velocidade",
      treffsicherheit: "Precisão",
      geuebtSeit: "A praticar desde",
      zuletzt: "Última prática",
      alsNaechstes: (selbst: boolean) => (selbst ? "A seguir, desbloqueias: " : "A seguir é desbloqueada: "),
      tastenStand: "Estado das teclas",
      schwachTitel: (selbst: boolean) =>
        selbst ? "Vale a pena praticar estas teclas:" : "Teclas em que mais vale a pena praticar:",
      schwachName: (taste: string, prozent: string, anschlaege: number) =>
        `${taste}, ${prozent} certas, ${mehrzahl(anschlaege, "pt", { one: (z) => `${z} toque`, other: (z) => `${z} toques`, many: (z) => `${z} de toques` })}`,
      uebtGerade: (selbst: boolean) => (selbst ? "Estás a praticar: " : "A praticar: "),
      geschichten: "Histórias e curiosidades",
      liestGerade: (selbst: boolean) => (selbst ? "Estás a ler: " : "A ler: "),
      etappe: (etappe: number, gesamt: number) => ` - parte ${etappe} de ${gesamt}`,
      zeile: (zeile: number, gesamt: number) => ` · linha ${zeile} de ${gesamt}`,
      fertig: (selbst: boolean) => (selbst ? "Leitura concluída: " : "Concluído: "),
      eigenstaendigkeit: "Trabalho autónomo (verificação por IA):",
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      werteTitel: (selbst: boolean) => (selbst ? "Seus dados em resumo" : "Resumo dos dados"),
      score: "Pontuação",
      zeitDe: "Tempo de prática em alemão",
      zeitEn: "Tempo de prática em inglês",
      zeitFr: "Tempo de prática em francês",
      zeitEs: "Tempo de prática em espanhol",
      uebungen: "Exercícios",
      aktiveTage: "Dias ativos",
      tastenSitzen: "Teclas seguras",
      tempoSchnitt: "Velocidade média",
      tempoBest: "Melhor velocidade",
      treffsicherheit: "Precisão",
      geuebtSeit: "Praticando desde",
      zuletzt: "Última prática",
      alsNaechstes: (selbst: boolean) => (selbst ? "A seguir, você desbloqueia: " : "Próximo desbloqueio: "),
      tastenStand: "Progresso das teclas",
      schwachTitel: (selbst: boolean) =>
        selbst ? "Vale a pena praticar estas teclas:" : "Teclas que mais vale a pena praticar:",
      schwachName: (taste: string, prozent: string, anschlaege: number) =>
        `${taste}, ${prozent} de acertos, ${anschlaege} ${anschlaege === 1 ? "toque" : "toques"}`,
      uebtGerade: (selbst: boolean) => (selbst ? "Você está praticando: " : "Praticando agora: "),
      geschichten: "Histórias e curiosidades",
      liestGerade: (selbst: boolean) => (selbst ? "Você está lendo: " : "Lendo agora: "),
      etappe: (etappe: number, gesamt: number) => ` - parte ${etappe} de ${gesamt}`,
      zeile: (zeile: number, gesamt: number) => ` · linha ${zeile} de ${gesamt}`,
      fertig: (selbst: boolean) => (selbst ? "Você leu até o fim: " : "Leitura concluída: "),
      eigenstaendigkeit: "Trabalho autônomo (verificação por IA):",
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      werteTitel: (selbst: boolean) => (selbst ? "Valorile tale pe scurt" : "Valorile pe scurt"),
      score: "Scor",
      zeitDe: "Timp exersat în germană",
      zeitEn: "Timp exersat în engleză",
      zeitFr: "Timp exersat în franceză",
      zeitEs: "Timp exersat în spaniolă",
      uebungen: "Exerciții",
      aktiveTage: "Zile active",
      tastenSitzen: "Taste sigure",
      tempoSchnitt: "Viteza medie",
      tempoBest: "Cea mai bună viteză",
      treffsicherheit: "Precizie",
      geuebtSeit: "Prima zi de exersare",
      zuletzt: "Ultima exersare",
      alsNaechstes: (selbst: boolean) =>
        selbst ? "Urmează să deblochezi: " : "Urmează deblocarea: ",
      tastenStand: "Starea tastelor",
      // Nu „cele mai slabe taste” (Glosar §2.2) - lista spune unde merită exersat.
      schwachTitel: (selbst: boolean) =>
        selbst ? "Merită să exersezi aceste taste:" : "Tastele care merită exersate cel mai mult:",
      schwachName: (taste: string, prozent: string, anschlaege: number) =>
        `${taste}, ${prozent} corect, ${mehrzahl(anschlaege, "ro", {
          one: (z) => `${z} apăsare`,
          few: (z) => `${z} apăsări`,
          other: (z) => `${z} de apăsări`,
        })}`,
      uebtGerade: (selbst: boolean) => (selbst ? "Exersezi acum: " : "Exersează acum: "),
      geschichten: "Povești și curiozități",
      liestGerade: (selbst: boolean) => (selbst ? "Citești acum: " : "Citește acum: "),
      etappe: (etappe: number, gesamt: number) => ` - partea ${etappe} din ${gesamt}`,
      zeile: (zeile: number, gesamt: number) => ` · rândul ${zeile} din ${gesamt}`,
      fertig: (selbst: boolean) => (selbst ? "Citite până la capăt: " : "Terminate: "),
      eigenstaendigkeit: "Lucru independent (verificare cu IA):",
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      werteTitel: (selbst: boolean) => (selbst ? "Dina värden i korthet" : "Värden i korthet"),
      score: "Poäng",
      zeitDe: "Övningstid på tyska",
      zeitEn: "Övningstid på engelska",
      zeitFr: "Övningstid på franska",
      zeitEs: "Övningstid på spanska",
      uebungen: "Övningar",
      aktiveTage: "Aktiva dagar",
      tastenSitzen: "Säkra tangenter",
      tempoSchnitt: "Genomsnittlig hastighet",
      tempoBest: "Bästa hastighet",
      treffsicherheit: "Träffsäkerhet",
      geuebtSeit: "Övar sedan",
      zuletzt: "Senast övat",
      alsNaechstes: (selbst: boolean) => (selbst ? "Nästa som du låser upp: " : "Nästa som låses upp: "),
      tastenStand: "Läget för tangenterna",
      schwachTitel: (selbst: boolean) =>
        selbst ? "De här tangenterna lönar sig att öva:" : "Tangenter som det lönar sig mest att öva:",
      schwachName: (taste: string, prozent: string, anschlaege: number) =>
        `${taste}, ${prozent} rätt, ${anschlaege} anslag`,
      uebtGerade: (selbst: boolean) => (selbst ? "Du övar just nu: " : "Övar just nu: "),
      geschichten: "Berättelser och fakta",
      liestGerade: (selbst: boolean) => (selbst ? "Du läser just nu: " : "Läser just nu: "),
      etappe: (etappe: number, gesamt: number) => ` - del ${etappe} av ${gesamt}`,
      zeile: (zeile: number, gesamt: number) => ` · rad ${zeile} av ${gesamt}`,
      fertig: (selbst: boolean) => (selbst ? "Färdigläst: " : "Klar: "),
      eigenstaendigkeit: "Självständigt arbete (kontroll med AI):",
    },
  // ★ O2-COMP (29.10.2026): uk eigene Fassung.
  uk: {
      werteTitel: (selbst: boolean) => (selbst ? "Твої показники коротко" : "Показники коротко"),
      score: "Бали",
      zeitDe: "Час тренування: німецька",
      zeitEn: "Час тренування: англійська",
      zeitFr: "Час тренування: французька",
      zeitEs: "Час тренування: іспанська",
      uebungen: "Вправи",
      aktiveTage: "Активні дні",
      tastenSitzen: "Впевнені клавіші",
      tempoSchnitt: "Середня швидкість",
      tempoBest: "Найкраща швидкість",
      treffsicherheit: "Точність",
      geuebtSeit: "Тренування від",
      zuletzt: "Останнє тренування",
      alsNaechstes: (selbst: boolean) => (selbst ? "Далі ти відкриєш: " : "Далі відкриється: "),
      tastenStand: "Стан клавіш",
      schwachTitel: (selbst: boolean) =>
        selbst ? "Ці клавіші варто потренувати:" : "Клавіші, які найбільше варто потренувати:",
      schwachName: (taste: string, prozent: string, anschlaege: number) =>
        `${taste}, правильно: ${prozent}, натискання: ${anschlaege}`,
      uebtGerade: (selbst: boolean) => (selbst ? "Ти зараз тренуєш: " : "Зараз тренує: "),
      geschichten: "Історії і цікавинки",
      liestGerade: (selbst: boolean) => (selbst ? "Ти зараз читаєш: " : "Зараз читає: "),
      etappe: (etappe: number, gesamt: number) => ` - частина ${etappe}/${gesamt}`,
      zeile: (zeile: number, gesamt: number) => ` · рядок ${zeile}/${gesamt}`,
      fertig: (selbst: boolean) => (selbst ? "Дочитано: " : "Дочитано: "),
      eigenstaendigkeit: "Самостійна робота (перевірка ШІ):",
    },
});

/**
 * Die Anzeige des Eigenständigkeits-Chips (nur Lehrkraft). Glossar §3.8:
 * Eigenständigkeit ⇒ *independent work*. „unauffällig" sagt: nichts fällt auf.
 */
const CHIP_TEXTE = texte({
  de: {
    stufe: (score: number) =>
      score <= 3 ? "unauffällig" : score <= 6 ? "auffällig" : "stark auffällig",
    name: (score: number, stufe: string) => `Eigenständigkeit ${score} von 10, ${stufe}`,
  },
  en: {
    stufe: (score: number) =>
      score <= 3 ? "nothing unusual" : score <= 6 ? "unusual" : "very unusual",
    name: (score: number, stufe: string) => `Independent work ${score} of 10, ${stufe}`,
  },
  fr: {
    stufe: (score: number) =>
      score <= 3 ? "rien à signaler" : score <= 6 ? "atypique" : "très atypique",
    name: (score: number, stufe: string) => `Autonomie ${score} sur 10, ${stufe}`,
  },
  es: {
    stufe: (score: number) =>
      score <= 3 ? "nada llamativo" : score <= 6 ? "poco habitual" : "muy poco habitual",
    name: (score: number, stufe: string) => `Autonomía ${score} de 10, ${stufe}`,
  },
  it: {
    stufe: (score: number) =>
      score <= 3 ? "niente di insolito" : score <= 6 ? "insolito" : "molto insolito",
    name: (score: number, stufe: string) => `Lavoro autonomo ${score} su 10, ${stufe}`,
  },
  // ★ O-PL (02.10.2026): Aussage über die Arbeit, nicht über das Kind (Glossar §2.6).
  pl: {
    stufe: (score: number) =>
      score <= 3 ? "nic nietypowego" : score <= 6 ? "nietypowo" : "bardzo nietypowo",
    name: (score: number, stufe: string) => `Samodzielność pracy ${score} z 10, ${stufe}`,
  },
  // ★ O-TR (02.10.2026): Aussage über die Arbeit, nicht über das Kind; "(en çok 10)"
  // statt einer Endung an der Zahl (Glossar Regel 6, "2 yıldız (en çok 3)").
  tr: {
    stufe: (score: number) =>
      score <= 3 ? "olağan dışı bir şey yok" : score <= 6 ? "olağan dışı" : "çok olağan dışı",
    name: (score: number, stufe: string) => `Bağımsız çalışma: ${score} (en çok 10), ${stufe}`,
  },
  // ★ O-CS (03.10.2026): Aussage über die Arbeit, nicht über das Kind; „7/10"
  // mit Schrägstrich (Glossar Regel 13), wie `EigenstaendigkeitsMarke`.
  cs: {
    stufe: (score: number) =>
      score <= 3 ? "nic neobvyklého" : score <= 6 ? "neobvyklé" : "velmi neobvyklé",
    name: (score: number, stufe: string) => `Samostatná práce: ${score}/10, ${stufe}`,
  },
  // ★ O2-COMP (29.10.2026): bg eigene Fassung.
  bg: {
      stufe: (score: number) =>
        score <= 3 ? "нищо необичайно" : score <= 6 ? "необичайно" : "много необичайно",
      name: (score: number, stufe: string) => `Самостоятелна работа: ${score}/10, ${stufe}`,
    },
  // ★ O2-COMP (29.10.2026): el eigene Fassung.
  el: {
      stufe: (score: number) =>
        score <= 3 ? "τίποτα ασυνήθιστο" : score <= 6 ? "ασυνήθιστο" : "πολύ ασυνήθιστο",
      name: (score: number, stufe: string) => `Αυτόνομη εργασία: ${score} από 10, ${stufe}`,
    },
  // ★ O2-COMP (29.10.2026): hu eigene Fassung.
  hu: {
      stufe: (score: number) =>
        score <= 3 ? "semmi szokatlan" : score <= 6 ? "szokatlan" : "nagyon szokatlan",
      name: (score: number, stufe: string) => `Önálló munka: ${score}/10, ${stufe}`,
    },
  // ★ O2-COMP (29.10.2026): nl eigene Fassung.
  nl: {
      stufe: (score: number) =>
        score <= 3 ? "niets ongebruikelijks" : score <= 6 ? "ongebruikelijk" : "zeer ongebruikelijk",
      name: (score: number, stufe: string) => `Zelfstandig werk ${score} van 10, ${stufe}`,
    },
  // ★ O2-COMP (29.10.2026): pt eigene Fassung.
  pt: {
      stufe: (score: number) =>
        score <= 3 ? "nada de invulgar" : score <= 6 ? "invulgar" : "muito invulgar",
      name: (score: number, stufe: string) => `Trabalho autónomo ${score} de 10, ${stufe}`,
    },
  // ★ O2-COMP (29.10.2026): br eigene Fassung.
  br: {
      stufe: (score: number) =>
        score <= 3 ? "nada fora do comum" : score <= 6 ? "fora do comum" : "muito fora do comum",
      name: (score: number, stufe: string) => `Trabalho autônomo ${score} de 10, ${stufe}`,
    },
  // ★ O2-COMP (29.10.2026): ro eigene Fassung.
  ro: {
      stufe: (score: number) =>
        score <= 3 ? "nimic neobișnuit" : score <= 6 ? "neobișnuit" : "foarte neobișnuit",
      name: (score: number, stufe: string) => `Lucru independent: ${score} din 10, ${stufe}`,
    },
  // ★ O2-COMP (29.10.2026): sv eigene Fassung.
  sv: {
      stufe: (score: number) =>
        score <= 3 ? "inget ovanligt" : score <= 6 ? "ovanligt" : "mycket ovanligt",
      name: (score: number, stufe: string) => `Självständigt arbete ${score} av 10, ${stufe}`,
    },
  // ★ O2-COMP (29.10.2026): uk eigene Fassung.
  uk: {
      stufe: (score: number) =>
        score <= 3 ? "нічого незвичного" : score <= 6 ? "незвично" : "дуже незвично",
      name: (score: number, stufe: string) => `Самостійна робота: ${score} з 10, ${stufe}`,
    },
});

export function SuspicionChip({
  score,
  reasons,
}: {
  score: number;
  reasons: string[];
}) {
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const c = CHIP_TEXTE[sprache];
  const tone =
    score <= 3
      ? "bg-success-soft text-ink"
      : score <= 6
        ? "bg-warning-soft text-ink"
        : "bg-danger-soft text-ink";
  const label = c.stufe(score);
  // Bezug UND Gründe in den Accessible Name (auf der Braillezeile kommt der
  // `title` nicht zuverlässig an, und in der Klassentabelle fehlt die Gründe-Liste).
  const aria =
    c.name(score, label) +
    (reasons.length ? `: ${reasons.join("; ")}` : "");
  return (
    <Hinweisflaeche
      className={"inline-block rounded-lg px-2 py-1 text-sm font-medium " + tone}
      aria-label={aria}
      hilfe={reasons.length ? reasons.join(" ") : `${c.name(score, label)}.`}
    >
      <span aria-hidden="true">
        {score}/10 · {label}
      </span>
    </Hinweisflaeche>
  );
}

/**
 * ★ EINE ZEILE in „Werte im Überblick" (C2, 11.09.2026) - Beschriftung und
 * Wert nebeneinander, `<dt>`/`<dd>` in natürlicher Lesereihenfolge. Ersetzt
 * die grossen Kacheln von vorher (`text-lg`/`text-xs`): Für die Sprachausgabe
 * war die Auskunft immer schon „Beschriftung: Wert" in einer Zeile - das geht
 * mit `<dt>` vor `<dd>` genauso gut, ohne den Umweg über `aria-hidden` und
 * einen zweiten, versteckten Text ([[feedback_data_transparency]] verlangt
 * dieselbe Auskunft, nicht zwei Fassungen derselben Zeile).
 *
 * ★ E7 (11.09.2026): Die Komponente selbst steht seither in `Kennzahl.tsx` -
 * `SchreibprobeErgebnis` braucht dieselbe Bauart (als Kachel statt Zeile) und
 * hätte sie sonst ein zweites Mal geschrieben
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 */

/**
 * Volle Statistik-Auswertung. `showSuspicion` blendet den Eigenständigkeits-/
 * KI-Check ein (im Bereich der Lehrkraft immer; in der eigenen Sicht je nach Wunsch).
 * `selfView` formuliert die Texte aus der Ich-Perspektive für die Kinder.
 */
/**
 * ★★ 28.09.2026 (Sprachpakete): Die Statistik zeigt den Bücherei-Stand
 * (`serienOverview`) - über die Serien, die im Fortschritt stehen. Eine davon
 * kann aus einer Sprache sein, deren Paket gerade nicht geladen ist (ein Kind,
 * das früher in einer anderen Sprache gelesen hat). Dann wartet die Statistik,
 * bis alle Pakete da sind, statt eine gelesene Geschichte still wegzulassen.
 * Im Normalfall sind alle Serien bekannt, und es gibt kein Warten.
 */
export function PupilStatsPanel(props: Parameters<typeof PupilStatsPanelInhalt>[0]) {
  const { progress } = props.data;
  return (
    <SprachpaketTor sprachen={KEINE_SPRACHE} alleWenn={() => !serienDesFortschrittsBekannt(progress)}>
      <PupilStatsPanelInhalt {...props} />
    </SprachpaketTor>
  );
}
const KEINE_SPRACHE: readonly Lang[] = [];

function PupilStatsPanelInhalt({
  data,
  showSuspicion = true,
  selfView = false,
  tippchallenges,
  flach = false,
  gesperrt = [],
}: {
  data: PupilData;
  showSuspicion?: boolean;
  selfView?: boolean;
  /**
   * ★ W3a (18.09.2026): die gesperrten Zeiten der Klasse dieses Kindes -
   * siehe `wochenziel.ts` „Eine Stunde sperren". Geht unverändert an
   * `WeeklyGoalStats` weiter; ein Selbstlernendes-Konto ohne Klasse hat keine.
   */
  gesperrt?: readonly GesperrteZeit[];
  /**
   * ★ Der Slot für die Tippchallenges (C4, 11.09.2026). `PupilStatsPanel`
   * selbst lädt keine Schreibproben - das tut `SchreibprobenListe` mit ihrem
   * eigenen Ladeweg (eigene Sammlung, gibt `null` zurück ohne Challenge).
   * `PupilSelfStats` füllt diesen Slot mit `<SchreibprobenListe …/>`, die
   * Lehrkraft-Zeile füllte ihn bis E4 (18.09.2026). So bleibt die
   * REIHENFOLGE (4. Tippchallenges, zwischen Abzeichen und Steigerung im
   * Verlauf, seit 19.09.2026) eine Entscheidung dieser einen Datei, ohne dass
   * sie selbst einen Konto-Zugriff bräuchte.
   */
  tippchallenges?: ReactNode;
  /**
   * ★★ R6 (11.09.2026, `BAUPLAN-2026-09-11-KLASSENSEITE-EINHEITLICH.md`): in
   * der aufgeklappten Zeile eines Kindes bei der Lehrkraft OHNE Kästen.
   * Johannes: *„bitte gestalte diese wichtige seite richtig ansprechend
   * übersichtlich und schlank"*. Gemessen waren dort vier Ebenen Kasten in
   * Kasten (Karte → Zeile → Kasten → Kasten). Mit `flach` verlieren
   * Wochenziele, Steigerung und Abzeichen ihren Rahmen, und JEDER Unterbereich
   * beginnt mit einer Haarlinie - sonst läse sich „Werte im Überblick" als Teil
   * der Wochenziele darüber. Die eigene Statistik des Kindes bleibt, wie sie ist.
   */
  flach?: boolean;
}) {
  const { pupil, stats, progress } = data;
  const { spracheGewaehlt: sprache } = useBedienSprache();
  const t = PANEL_TEXTE[sprache];
  /** Nicht-deutsche Bedienung: die Sprache eines Inhalts (Titel einer
   *  Geschichte, aus dem deutschen/englischen Korpus - ein französischer
   *  Korpus ist E8a, nicht diese Etappe) für die Sprachausgabe. */
  const inhaltLang = (lang: Lang | undefined) => (sprache !== "de" ? feinesLangAttribut(lang ?? "de") : undefined);
  /** Die Haarlinie über einem Unterbereich - nur in der flachen Fassung. */
  const trenner = flach ? " border-t border-hairline pt-3" : "";
  // Eigene Kennungen je Einbau: Die Lehrkraft kann mehrere Kinder gleichzeitig
  // aufgeklappt haben - feste Kennungen wären dann doppelt vergeben, und
  // `aria-labelledby` zeigte auf die Überschrift des falschen Kindes.
  const werteTitelId = useId();
  const tastenTitelId = useId();
  const level = currentLevel(progress, pupil.tempo);
  // „Zeit lassen": Dann urteilt auch die Auswertung ohne Tempo — sonst zeigte
  // sie Tasten als „hakt", die im Programm längst als „sitzt" gelten.
  const m = masteryForLevel(level, !!pupil.noTimePressure);
  const lernweg = lernwegAus(pupil, progress);
  const introduced = ensureIntroduced(progress.introduced, lernweg);
  const sit = masteredCount(introduced, progress.letters, lernweg, m);
  const next = nextLetter(introduced, lernweg);
  // ★ D-5: die Schwelle je Weg und Stufe dieses Kindes (wacklig.ts).
  const weak = weakestKeys(progress.letters, introduced, { lernweg, stufe: stufeFuer(pupil) });
  // NEU (21.07.): Bücherei-Stand und aktueller Übungs-Schwerpunkt. Beides steht
  // BEWUSST in dieser geteilten Komponente — so sehen Lehrkraft und Kind exakt
  // dasselbe, ohne dass die zwei Ansichten auseinanderlaufen können
  // ([[feedback_data_transparency]]).
  const serien = serienOverview(progress);
  const schwerpunkt = focusUnits(introduced, progress.letters, lernweg, FOCUS_COUNT, m);
  // ★ Der Score (§2.1, B5): dieselbe Rechnung wie die Tippchallenge, auf die
  // Übungsdaten des ganzen Zeitraums angewandt. Unter 200 Zeichen „-".
  const score = scoreAusStats(stats);

  return (
    // ★ `flach`: Die Zeile um das Panel polstert schon selbst (R5) - ein
    // zweiter Innenrand rückte die Unterbereiche gegen die übrigen ein.
    <div className={flach ? "space-y-3" : "space-y-3 px-2 py-3"}>
      {/* 1 · Wochenziele. ★ Zugeklappt (C1, 11.09.2026) - Vorbild: der Wochenziel-Kasten der
         Klasse in `TastenflowReiter.tsx`. Der Stand steht in der
         `<summary>`, ohne Aufklappen lesbar. */}
      <WeeklyGoalStats
        events={data.events}
        pupil={pupil}
        gesperrt={gesperrt}
        flach={flach}
      />

      {/*
        ════════════════════════════════════════════════════════════════════
        2 · WERTE IM ÜBERBLICK (C2, 11.09.2026)
        ════════════════════════════════════════════════════════════════════
        Ersetzt die grossen Kacheln UND den eigenen Block „Geübte Zeit" - der
        ist weg, seine zwei Zahlen (Deutsch/Englisch) stehen jetzt hier als
        zwei Zeilen. Eine zweispaltige Liste aus einzeiligen „Beschriftung:
        Wert"-Zeilen statt elf grosser Felder.
      */}
      <div className={trenner.trim() || undefined}>
        <h3 id={werteTitelId} className="m-0 mb-1 text-sm font-semibold text-ink">
          {t.werteTitel(selfView)}
        </h3>
        <dl
          className="m-0 grid grid-cols-1 gap-x-6 sm:grid-cols-2"
          role="list"
          aria-labelledby={werteTitelId}
        >
          <Kennzahl
            label={t.score}
            value={score.gewertet ? String(Math.round(score.wert ?? 0)) : "-"}
            hilfe={scoreErklaerung(selfView ? "du" : "Sie", sprache)}
          />
          <Kennzahl label={t.zeitDe} value={fmtDauer(stats.totalMsDe, sprache)} />
          <Kennzahl label={t.zeitEn} value={fmtDauer(stats.totalMsEn, sprache)} />
          {/* ★ 26.09.2026: Französisch nur, wo es geübt wurde - Deutsch/Englisch
              bleiben für alle anderen Kinder genau wie bisher. */}
          {stats.totalMsFr > 0 && (
            <Kennzahl label={t.zeitFr} value={fmtDauer(stats.totalMsFr, sprache)} />
          )}
          {/* ★ ES-O (27.09.2026): Spanisch ebenso nur, wo es geübt wurde. */}
          {stats.totalMsEs > 0 && (
            <Kennzahl label={t.zeitEs} value={fmtDauer(stats.totalMsEs, sprache)} />
          )}
          <Kennzahl label={t.uebungen} value={String(stats.tasks)} />
          <Kennzahl label={t.aktiveTage} value={String(stats.days)} />
          <Kennzahl label={t.tastenSitzen} value={`${sit} / ${introduced.length}`} />
          <Kennzahl
            label={t.tempoSchnitt}
            value={stats.avgCpm ? `${Math.round(stats.avgCpm)} /min` : "-"}
          />
          <Kennzahl
            label={t.tempoBest}
            value={stats.bestCpm ? `${Math.round(stats.bestCpm)} /min` : "-"}
          />
          <Kennzahl
            label={t.treffsicherheit}
            value={stats.tasks ? fmtPercent(stats.accuracy, sprache) : "-"}
          />
          <Kennzahl label={t.geuebtSeit} value={fmtTagMonat(stats.firstActive, sprache)} />
          <Kennzahl label={t.zuletzt} value={fmtTagMonat(stats.lastActive, sprache)} />
        </dl>
      </div>

      {/*
        ════════════════════════════════════════════════════════════════════
        3 · DIE ABZEICHEN (11.09.2026, Umbauplan §2.4; Platz 3 seit 19.09.)
        ════════════════════════════════════════════════════════════════════
        Stehen VOR den Zahlen des Verlaufs, nicht ganz unten (das war die
        Entscheidung vom 01.09.2026, „Abzeichen ganz nach unten" - der Umbau
        vom 11.09. hat die ganze Statistik neu geordnet). Offen, nicht
        zugeklappt: Beim Öffnen der Statistik geht der Fokus auf das erste
        Abzeichen (§0.5, `focusStats.ts`) - hinter einer Falte gäbe es dort
        kein Ziel.
      */}
      <BadgeShelf
        progress={progress}
        selfView={selfView}
        skin={skinForStufe(stufeFuer(pupil))}
        flach={flach}
      />

      {/* 4 · Tippchallenges (C4) - der Slot. `PupilStatsPanel` lädt selbst
         nichts; die einbettende Seite füllt ihn (`SchreibprobenListe` in der
         eigenen Statistik). Seit 19.09.2026 EINE Ausklappzeile, zu Beginn zu -
         die baut `SchreibprobenListe` selbst, weil nur sie weiss, ob es
         überhaupt eine Challenge gibt. */}
      {tippchallenges}

      {/* 5 · Steigerung im Verlauf - zugeklappt (C3), mit dem Hinweis aus B7
         (die Kurve geht bei neuen Tasten normalerweise erst nach unten).
         Johannes 19.09.2026: „gib die Steigerung im Verlauf unter die
         Tippchallenges". */}
      <LevelTrend
        rounds={progress.rounds}
        level={level}
        selfView={selfView}
        showLevel={!selfView}
        name={pupil.name}
        flach={flach}
      />

      {/*
        ════════════════════════════════════════════════════════════════════
        6 · TASTEN-STAND - EINE Ausklappzeile (19.09.2026)
        ════════════════════════════════════════════════════════════════════
        Johannes 19.09.2026: *„gib den Bereich ‚Tasten, die sich lohnen' und
        ‚Als Nächstes schaltest du frei …' zu dem Bereich Tastenstand - auch
        der Tastenstand eine Zeile zum Ausklappen."* Darin, von oben: „Als
        Nächstes", die Tastenkarte, die Tasten, die sich zu üben lohnen, und
        „Du übst gerade" - alles Auskünfte über die Tasten.

        ⚠️ Ein `<details>` wie Wochenziele und Steigerung: Die `h3` steht IN
        der `<summary>` und bleibt Sprungmarke für „h"; der Stand („12 von 20
        sitzen") steht ohne Aufklappen daneben. Die Tastenkarte bringt darum
        KEINEN eigenen Kopf mit (`beschriftetVon`) - sonst stünde „Tasten-Stand"
        zweimal da, einmal als Überschrift der Klappe und einmal in ihr.

        ⚠️ Eigene Gruppe `group/tasten`: Ein blosses `group-open:` am Pfeil
        drehte sonst auch Pfeile weiter aussen mit.

        (Der Block „Lektionen" darunter ist am 19.09.2026 ersatzlos
        weggefallen - Johannes: *„den versteht jetzt niemand mehr"*; die
        Übungsart „Lektionen" gibt es seit E7 nicht mehr.)
      */}
      <details
        className={
          flach
            ? "group/tasten border-t border-hairline pt-1"
            : "group/tasten rounded-xl border border-hairline bg-surface-raised p-3"
        }
      >
        <summary
          className={
            "flex cursor-pointer list-none flex-wrap gap-2 text-sm font-semibold text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent " +
            (flach ? "min-h-9 content-center items-center" : "items-baseline")
          }
        >
          <span aria-hidden="true" className="text-ink-muted transition group-open/tasten:rotate-90">
            ▸
          </span>
          <h3 id={tastenTitelId} className="m-0 text-sm font-semibold text-ink">
            {t.tastenStand}
          </h3>
          <span className="font-normal text-ink-muted">
            {"· "}
            {tastenStandSatz(sit, introduced.length, !next, sprache)}
          </span>
        </summary>

        <div className="mt-2 space-y-3">
          {next && (
            <p className="m-0 text-sm text-ink-muted">
              {t.alsNaechstes(selfView)}
              <strong>{tasteName(next, sprache)}</strong>
            </p>
          )}

          <LetterMap
            letters={progress.letters ?? {}}
            introduced={introduced}
            lernweg={lernweg}
            mastery={m}
            showNext={false}
            beschriftetVon={tastenTitelId}
          />

          {weak.length > 0 && (
            <div className="text-sm">
              {/* h4: eine Ebene unter „Tasten-Stand" (bis 19.09.2026 ein
                  eigener Block mit h3). */}
              <h4 className="m-0 mb-1 text-sm font-semibold text-ink">
                {t.schwachTitel(selfView)}
              </h4>
              <div className="flex flex-wrap gap-1.5" role="list">
                {weak.map((w) => (
                  <span
                    key={w.unit}
                    role="listitem"
                    className="rounded-lg bg-danger-soft px-2 py-1 text-sm text-ink"
                    aria-label={t.schwachName(tasteName(w.unit, sprache), fmtPercent(w.acc, sprache), w.samples)}
                  >
                    <span aria-hidden="true">
                      {tasteName(w.unit, sprache)} · {fmtPercent(w.acc, sprache)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Übungs-Schwerpunkt: macht die Individualisierung sichtbar („Mein
             Training passt sich an" — woran denn gerade?). Genau die Einheiten, die
             der Trainer in dieser Runde betont (focusUnits/FOCUS_COUNT). Steht
             seit 19.09.2026 im Tasten-Stand - es ist eine Auskunft über Tasten. */}
          {schwerpunkt.length > 0 && (
            <p className="m-0 text-sm text-ink-muted">
              {t.uebtGerade(selfView)}
              <strong>{schwerpunkt.map((u) => tasteName(u, sprache)).join(" · ")}</strong>
            </p>
          )}
        </div>
      </details>

      {/* Bücherei-Stand („Geschichten & Wissen"). */}
      {(serien.aktuell || serien.fertig.length > 0) && (
        <div className={"text-sm" + trenner}>
          <h3 className="m-0 mb-1 text-sm font-semibold text-ink">
            {t.geschichten}
          </h3>
          {serien.aktuell && (
            <p className="m-0 text-ink-muted">
              {t.liestGerade(selfView)}
              {/* ★ EN3: Der Titel ist INHALT (Übungssprache der Geschichte) -
                  in der englischen Bedienung in seiner eigenen Sprache ausgezeichnet. */}
              <strong lang={inhaltLang(serien.aktuell.serie.lang)}>{serien.aktuell.serie.titel}</strong>
              {t.etappe(serien.aktuell.etappe, serien.aktuell.total)}
              {serien.aktuell.line > 0 &&
                t.zeile(serien.aktuell.line + 1, serien.aktuell.lines)}
            </p>
          )}
          {serien.fertig.length > 0 && (
            <p className="m-0 text-ink-muted">
              {t.fertig(selfView)}
              {sprache !== "de"
                ? serien.fertig.map((s, i) => (
                    <Fragment key={s.slug}>
                      {i > 0 ? " · " : ""}
                      <span lang={feinesLangAttribut(s.lang ?? "de")}>{s.titel}</span>
                    </Fragment>
                  ))
                : serien.fertig.map((s) => s.titel).join(" · ")}
              <span className="text-success" aria-hidden>
                {" ✓"}
              </span>
            </p>
          )}
        </div>
      )}

      {showSuspicion && (
        <div className={"text-sm" + trenner}>
          <h3 className="m-0 mb-1 text-sm font-semibold text-ink">
            {t.eigenstaendigkeit}
          </h3>
          <SuspicionChip
            score={stats.suspicion.score}
            reasons={stats.suspicion.reasons}
          />
          <ul className="m-0 mt-1 list-disc pl-5 text-sm text-ink-muted">
            {stats.suspicion.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
