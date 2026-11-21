/**
 * ★★★ DEUTSCH-FÄNGER FÜR STATISTIK, ABZEICHEN UND EXPEDITION (EN3, 19.09.2026).
 *
 * Bereich: „Meine Statistik" mit echten Daten (Wochenziel mit Nachholen,
 * erlassener Woche und anstehender Änderung, Werte im Überblick, Steigerung
 * im Verlauf, Abzeichen-Regal samt aufgeklappter Liste und Groß-Ansicht,
 * Tippchallenges, Tastenkarte, Lektionen, Geschichten), dieselbe Auswertung
 * in der Lehrkraft-Sicht, Jahreskarte, Punktleiste, Veränderungspfeil; die
 * Polar-Expedition (Tagebuch, alle sechs Zonen, Fehlgriff, gewonnen, Finale)
 * und die Freischalt-Feier.
 *
 * Gemessen wird am gerenderten DOM (`tests/helfer/deutschFaenger.ts`, der
 * ganze `<body>` - die Expedition hängt als Portal dort) und an allem, was die
 * ersetzte Stimme sprechen soll, ausser mit der deutschen Stimme (die spricht
 * deutschen INHALT - das gelöste Wort der Polarstation).
 *
 * ★★ Was BLEIBT, WIE ES IST, und darum ausgenommen ist:
 *  • einzelne Tastenzeichen der deutschen Tastatur (ä, ö, ü, ß) - sie werden
 *    geübt, sind kein deutsches Wort (`nurTastenzeichen`, wie in EN5);
 *  • Inhalt in `lang="de"` (Titel einer Tippchallenge, einer Geschichte) -
 *    der Fänger nimmt das selbst aus.
 *
 * ★★★ DIE GEGENPROBE: dieselben Zustände in der deutschen Bedienung müssen
 * VIELE Funde liefern - ein Fänger, der nichts findet, weil er nichts liest,
 * sähe sonst genauso grün aus.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return {
    ...echt,
    speakUi: vi.fn(),
    speakUiAlways: vi.fn(),
    speakUiDe: vi.fn(),
    speakQueued: vi.fn(),
    speakFishVoice: vi.fn(),
    speakMonsterVoice: vi.fn(),
    speakUiNachLaufender: vi.fn(),
    speak: vi.fn(),
    speakSequence: vi.fn(),
  };
});

vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(),
  playUnlockFanfare: vi.fn(),
  playKeySound: vi.fn(),
  playKeyTick: vi.fn(),
  playErrorSound: vi.fn(),
  playLineSound: vi.fn(),
  playSuccessSound: vi.fn(),
  playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

import { BedienSpracheProvider, type BedienSprache } from "../src/lib/bedienSprache";
import { PupilSelfStats } from "@/components/typing/PupilSelfStats";
import { StatistikSchliessen } from "@/components/AppKopfzeile";
import { PupilStatsPanel, SuspicionChip, type PupilData } from "@/components/typing/PupilStatsPanel";
import { SchreibprobenTabelle, SchreibprobenKennzahl } from "@/components/typing/SchreibprobenTabelle";
import { LetterMap } from "@/components/typing/LetterMap";
import { Jahreskarte, TopfZahlen } from "@/components/typing/Jahreskarte";
import { Punktleiste } from "@/components/typing/Punktleiste";
import { Veraenderungspfeil } from "@/components/typing/Veraenderungspfeil";
import { PlayerLevelRing } from "@/components/typing/PlayerLevelRing";
import { BadgeMedal, BAND_WORT_EN, medaillenBeschreibung } from "@/components/typing/BadgeMedal";
import { UnlockCelebration } from "@/components/typing/UnlockCelebration";
import { ExpeditionStage } from "@/components/typing/expedition/ExpeditionStage";
import { ExpeditionJourney, FinaleOverlay } from "@/components/typing/expedition/ExpeditionJourney";
import {
  BADGES,
  LESSONS,
  SHIFT_UNIT,
  badgeBeschreibung,
  badgeBild,
  badgeGruppe,
  badgeName,
  computePupilStats,
  emptyProgress,
  typingBackend,
  werteAus,
  type Probenergebnis,
  type TypingAccount,
  type TypingProgress,
} from "@/lib/typing";
import type { TaskEvent } from "@/lib/typing/account";
import {
  addPupil,
  createClass,
  listPupils,
  recordEvent,
  registerTeacher,
  saveAccountProgress,
} from "@/lib/typing/account";
import { ABZEICHEN_EN, ABZEICHEN_GRUPPEN_EN } from "@/lib/typing/badgesEn";
import { isoWeekKey } from "@/lib/typing/goals";
import { WOCHENZIEL_GRENZE } from "@/lib/typing/wochenziel";
import { wochenStart } from "@/lib/typing/wochenrhythmus";
import { masteryFor } from "@/lib/typing/letters";
import {
  EXPEDITION_ZONES,
  buildCaveCourse,
  buildPackeisCourse,
  buildSlideCourse,
  buildStationCourse,
  buildSteilwandCourse,
  buildStormCourse,
} from "@/lib/typing/expedition/course";
import { diaryText, zoneText, type PlayZone } from "@/lib/typing/expedition/texts";
import {
  entwicklungsGrund,
  ohneVergleichSatz,
  spaltenHilfe,
  veraenderung,
  veraenderungSatz,
} from "@/lib/typing/veraenderung";
import type { Jahreskarte as JahreskarteWerte } from "@/lib/typing/jahreskarte";
import {
  speakFishVoice,
  speakQueued,
  speakUi,
  speakUiAlways,
  speakUiDe,
  speakUiNachLaufender,
} from "@/lib/typing/voice";
import { findeDeutsch, pruefeText } from "./helfer/deutschFaenger";

// ---------------------------------------------------------------------------
// Aufbau
// ---------------------------------------------------------------------------

/** Bedienung gewählt - so, wie der Sprachschalter oder `?bedienung=…` es tut. */
function stelleBedienung(sprache: BedienSprache | null) {
  if (sprache) localStorage.setItem("tastenflow-bedienung", sprache);
  else {
    localStorage.removeItem("tastenflow-bedienung");
  }
}

function zeige(knoten: ReactNode) {
  return render(<BedienSpracheProvider>{knoten}</BedienSpracheProvider>);
}

/** Alles Gesprochene: `[text, sprache der Stimme]` - die deutsche Stimme spricht Inhalt. */
function gesprochen(): [string, string | undefined][] {
  return [
    ...vi.mocked(speakUi).mock.calls.map((c) => [String(c[0]), c[3] as string | undefined]),
    ...vi.mocked(speakUiAlways).mock.calls.map((c) => [String(c[0]), c[2] as string | undefined]),
    ...vi.mocked(speakUiDe).mock.calls.map((c) => [String(c[0]), "de-ui"]),
    ...vi.mocked(speakQueued).mock.calls.map((c) => [String(c[0]), (c[1] as string | undefined) ?? "de-ui"]),
    ...vi.mocked(speakFishVoice).mock.calls.map((c) => [String(c[0]), (c[1] as string | undefined) ?? "de-ui"]),
    ...vi.mocked(speakUiNachLaufender).mock.calls.map((c) => [String(c[0]), c[2] as string | undefined]),
  ] as [string, string | undefined][];
}

/**
 * ★ Einzelne Tastenzeichen der DEUTSCHEN Tastatur (ä, ö, ü, ß) sind kein
 * deutsches Wort - ausgenommen werden nur Fundstellen, deren sämtliche
 * „Wörter" einzelne Zeichen sind (wie in EN5).
 */
function nurTastenzeichen(fund: string): boolean {
  const woerter = fund.match(/\[([^\]]*)\]$/)?.[1]?.split(", ") ?? [];
  return woerter.length > 0 && woerter.every((w) => [...w].length === 1);
}

/**
 * Was der Fänger findet: der ganze `<body>`, dazu jede Ansage, die NICHT mit
 * der deutschen Stimme gesprochen wurde. „de-ui" markiert einen Aufruf OHNE
 * Sprache - in der englischen Bedienung ist genau das ein Fehler (dann
 * spräche die deutsche Stimme einen englischen Satz oder umgekehrt).
 */
function fange(): string[] {
  const funde = new Set(findeDeutsch(document.body));
  for (const [text, stimme] of gesprochen()) {
    if (stimme === "de") continue;
    const f = pruefeText(`gesprochen (${stimme ?? "ohne Sprache"})`, text);
    if (f) funde.add(f);
  }
  return [...funde].filter((f) => !nurTastenzeichen(f));
}

/** Ansagen der englischen Bedienung, die OHNE englische Stimme hinausgingen. */
function ohneEnglischeStimme(): string[] {
  return gesprochen()
    .filter(([, stimme]) => stimme !== "en" && stimme !== "de")
    .map(([text, stimme]) => `${stimme ?? "ohne"}: ${text}`);
}

// ── Die Daten eines Kindes, echt genug für jeden Block der Statistik ─────────

const TAG = 86_400_000;
const MIN = 60_000;

/** Montag 8:00 der laufenden Woche - die Wochen der Statistik zählen von hier. */
function montag(versatz = 0): number {
  return wochenStart(Date.now(), WOCHENZIEL_GRENZE) + versatz * 7 * TAG;
}

function ereignis(ts: number, minuten: number, lang: "de" | "en" = "de"): TaskEvent {
  const ms = minuten * MIN;
  return { ts, lesson: "adaptiv", chars: minuten * 120, errors: minuten * 3, ms, activeMs: ms, lang };
}

/** Ein Zeichen mit Fenster: `gut` Treffer (220 ms), `schlecht` Fehler. */
function zeichen(gut: number, schlecht: number) {
  const recent = [...Array.from({ length: gut }, () => 220), ...Array.from({ length: schlecht }, () => -1)];
  return { hits: gut * 4, misses: schlecht * 4, sumMs: gut * 4 * 220, timed: gut * 4, recent };
}

const EINGEFUEHRT = [
  "f", "j", "d", "k", "s", "l", "a", "ö", "e", "n", "i", "r", "t", "h", "u", "g",
  SHIFT_UNIT, "ä", "ü", "ß", "o", "c", ",",
];

function fortschritt(): TypingProgress {
  const letters: TypingProgress["letters"] = {};
  EINGEFUEHRT.forEach((ch, i) => {
    // Ein paar Tasten sitzen, eine wackelt, eine hakt noch, eine ist neu.
    if (ch === "ß") return; // neu: noch nicht geübt
    letters[ch] = i % 7 === 3 ? zeichen(10, 6) : i % 5 === 2 ? zeichen(16, 3) : zeichen(40, 0);
  });
  const jetzt = Date.now();
  const p = emptyProgress();
  return {
    ...p,
    xp: 640,
    introduced: EINGEFUEHRT,
    letters,
    rounds: Array.from({ length: 8 }, (_, i) => ({
      ts: jetzt - (8 - i) * TAG,
      acc: 0.9 + i * 0.01,
      cpm: 80 + i * 12,
      stars: (i % 3) + 1,
      level: 6 + i,
    })),
    lessons: {
      "home-fj": { completed: true, bestStars: 3, bestCpm: 120, attempts: 2 },
      "home-dk": { completed: true, bestStars: 2, bestCpm: 110, attempts: 1 },
    },
    badges: {
      volltreffer: jetzt - 5 * TAG,
      "tasten-kueken": jetzt - 6 * TAG,
      "puenktchen-panda": jetzt - 2 * TAG,
      "schlangen-s": jetzt - TAG,
      "immer-trocken": jetzt - TAG,
    },
    badgeTally: { rounds: 30, perfect: 2, cleanStreak: 2, bestCleanStreak: 3, stars3: 5, days: 4 },
    storyProgress: {
      "de-g2-khalai-spricht-mit-pflanzen": { etappe: 1, line: 3 },
      "de-g2-ziege-hund-und-kuh": { etappe: 99, done: true },
    },
    lastPlace: { mode: "buecherei", serieSlug: "de-g2-khalai-spricht-mit-pflanzen" },
  };
}

function probe(tag: number, zeichen: number, fehler: number, niveau = "buchstaben"): Probenergebnis {
  const beginn = Date.now() - tag * TAG;
  return werteAus({
    probeId: `sp-${tag}`,
    niveau,
    textNr: 2,
    textTitel: "Der Igel und der Hase",
    startZeile: 0,
    beginnMs: beginn,
    endeMs: beginn + 5 * MIN,
    zeitMs: 5 * MIN,
    zuschlagProzent: 0,
    wartezeitMs: 0,
    zeichen,
    fehler,
    zeilen: 20,
    schreibMs: 5 * MIN,
    anschlaege: [
      ...Array.from({ length: 5 }, () => ({ char: "ö", correct: true, ms: 200 })),
      ...Array.from({ length: 4 }, () => ({ char: "ö", correct: false })),
    ],
    layout: "de",
    textZuEnde: false,
    frueherAbgegeben: false,
  } as Parameters<typeof werteAus>[0]);
}

/** Mia mit Wochenziel (Nachholen, erlassene Woche, anstehende Änderung) und Daten. */
async function mitDaten(): Promise<TypingAccount> {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  const p = addPupil(c.value.code, "Mia", "pw1234");
  if (!p.ok) throw new Error(p.error);
  const mia = listPupils(c.value.code).find((k) => k.name === "Mia")!;
  const konto: TypingAccount = {
    ...mia,
    wochenzielVerlauf: [
      { ab: isoWeekKey(montag(-3)), minuten: 60 },
      { ab: isoWeekKey(montag(1)), minuten: 45 },
    ],
    goalCatchUp: true,
    goalExcusedWeeks: [isoWeekKey(montag(-2))],
  };
  for (const [versatz, minuten, lang] of [
    [-3, 70, "de"],
    [-2, 10, "de"], // in der erlassenen Woche - sonst stünde sie nicht in der Tabelle
    [-1, 20, "de"],
    [-1, 15, "en"],
    [0, 25, "de"],
  ] as const) {
    recordEvent(konto.id, ereignis(montag(versatz) + TAG + 3600_000, minuten, lang));
  }
  saveAccountProgress(konto.id, fortschritt());
  const b = typingBackend();
  await b.speichereProbenergebnis(konto, probe(9, 1072, 26));
  await b.speichereProbenergebnis(konto, probe(3, 1150, 12));
  return konto;
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  localStorage.clear();
});

// ---------------------------------------------------------------------------
// 1 · Der Katalog - jede ID englisch, gleiche Form wie im Deutschen
// ---------------------------------------------------------------------------

describe("★ EN3 · der Abzeichen-Katalog englisch", () => {
  it("jedes Abzeichen hat einen englischen Eintrag - Zweitname genau dort, wo das Deutsche einen hat", () => {
    const ohne = BADGES.filter((b) => !ABZEICHEN_EN[b.id]).map((b) => b.id);
    expect(ohne, "Abzeichen ohne englischen Eintrag").toEqual([]);
    const zuViel = Object.keys(ABZEICHEN_EN).filter((id) => !BADGES.some((b) => b.id === id));
    expect(zuViel, "englische Einträge ohne Abzeichen").toEqual([]);
    for (const b of BADGES) {
      const en = ABZEICHEN_EN[b.id];
      expect(!!en.nameNeutral, `${b.id}: Zweitname nur, wo das Deutsche einen hat`).toBe(!!b.nameNeutral);
    }
  });

  it("jede Familie hat einen englischen Namen und eine englische Bandfarbe", () => {
    const gruppen = [...new Set(BADGES.map((b) => b.group))];
    expect(gruppen.filter((g) => !ABZEICHEN_GRUPPEN_EN[g])).toEqual([]);
    expect(gruppen.filter((g) => !BAND_WORT_EN[g])).toEqual([]);
  });

  it("die englischen Namen sind eindeutig (je Tonlage) und nie deutsch", () => {
    for (const skin of ["kind", "erwachsen"] as const) {
      const namen = BADGES.map((b) => badgeName(b, skin, "en"));
      expect(new Set(namen).size, `doppelte Namen (${skin})`).toBe(namen.length);
    }
    const funde: string[] = [];
    for (const b of BADGES) {
      for (const [was, text] of [
        ["Name", badgeName(b, "kind", "en")],
        ["Zweitname", badgeName(b, "erwachsen", "en")],
        ["Beschreibung", badgeBeschreibung(b, "en")],
        ["Bild", badgeBild(b, "en")],
        ["Familie", badgeGruppe(b.group, "en")],
        ["Medaille", medaillenBeschreibung(b, false, "en")],
      ] as const) {
        const f = pruefeText(`${b.id} ${was}`, text);
        if (f && !nurTastenzeichen(f)) funde.push(f);
        expect(text, `${b.id} ${was}`).not.toMatch(/undefined|[\u2013\u2014]/);
      }
    }
    expect(funde).toEqual([]);
  });

  it("der englische Medaillen-Satz bleibt wie der deutsche unter 120 Zeichen (Braillezeile)", () => {
    for (const b of BADGES) {
      const satz = medaillenBeschreibung(b, false, "en");
      expect(satz.length, `${b.id}: ${satz}`).toBeLessThan(120);
      expect(satz).toMatch(/^[A-Z][a-z]+( [a-z]+)? medal on an? [a-z ]+ ribbon, showing .+\.$/);
    }
    expect(medaillenBeschreibung(BADGES[0], true, "en")).toBe("Grey medal on a grey ribbon, with a question mark.");
  });

  it("die Zahlen in den Beschreibungen kommen aus denselben Konstanten wie im Deutschen", () => {
    for (const id of ["lehrgangs-legende", "lehrgangs-meister"]) {
      const b = BADGES.find((x) => x.id === id)!;
      expect(badgeBeschreibung(b, "en")).toContain(String(LESSONS.length));
      expect(b.description).toContain(String(LESSONS.length));
    }
    for (const id of ["immer-trocken", "fischfaenger", "zurueck-im-sattel"]) {
      const b = BADGES.find((x) => x.id === id)!;
      const zahlDe = b.description.match(/\d+/)?.[0];
      expect(zahlDe).toBeTruthy();
      expect(badgeBeschreibung(b, "en")).toContain(zahlDe!);
    }
  });

  it("GEGENPROBE: ohne Sprache genau der deutsche Katalog", () => {
    for (const b of BADGES) {
      expect(badgeName(b, "kind")).toBe(b.name);
      expect(badgeBeschreibung(b)).toBe(b.description);
      expect(badgeGruppe(b.group)).toBe(b.group);
      expect(badgeBild(b)).toBe(b.bildbeschreibung);
    }
  });
});

// ---------------------------------------------------------------------------
// 2 · Meine Statistik (Kind) - englisch, mit echten Daten
// ---------------------------------------------------------------------------

/** Meine Statistik rendern und bis zu den Tippchallenges warten. */
async function statistik(sprache: BedienSprache | null) {
  const konto = await mitDaten();
  stelleBedienung(sprache);
  zeige(<PupilSelfStats account={konto} />);
  // Die Tippchallenges laden selbst - erst wenn ihre Tabelle steht, ist alles da.
  await waitFor(() => expect(document.querySelector("[data-schreibproben-tabelle]")).not.toBeNull());
  return konto;
}

describe("★ EN3 · Meine Statistik englisch (Kind)", () => {
  it("die ganze Statistik mit Daten: kein deutsches Wort (Regal, Liste, Groß-Ansicht, Challenges)", async () => {
    await statistik("en");
    expect(screen.getByRole("heading", { name: "My statistics" })).toBeTruthy();
    expect(screen.getByText("Weekly goals")).toBeTruthy();
    expect(screen.getByText(/To catch up: /)).toBeTruthy();
    expect(screen.getByText("Your figures at a glance")).toBeTruthy();
    expect(screen.getByText(/My badges/)).toBeTruthy();
    const funde: string[] = [...fange()];

    // Alle Abzeichen aufklappen - 116 Namen, Bedingungen, Medaillen-Sätze.
    fireEvent.click(screen.getByRole("button", { name: /Show all badges/ }));
    funde.push(...fange());
    expect(screen.getByText("Nailed it!", { exact: false })).toBeTruthy();

    // Die Groß-Ansicht eines verdienten Abzeichens.
    const medaille = document.querySelector<HTMLButtonElement>('[data-abzeichen-fokus="verdient"]')!;
    fireEvent.click(medaille);
    expect(screen.getByRole("dialog", { name: /^Badge, large view: / })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Close" })).toBeTruthy();
    funde.push(...fange());
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    // Die Groß-Ansicht eines Geheim-Abzeichens, das noch nicht verdient ist.
    const geheim = screen.getAllByRole("button").find((b) => b.textContent?.includes("???"))!;
    fireEvent.click(geheim);
    expect(screen.getByText("A secret badge. Find out for yourself how to earn it!", { selector: "p" })).toBeTruthy();
    funde.push(...fange());

    expect([...new Set(funde)]).toEqual([]);
    expect(ohneEnglischeStimme(), "Ansagen ohne englische Stimme").toEqual([]);
  });

  /*
   * ★ EN10 (19.09.2026, im Browser gefunden): Der Knopf über und unter der
   * Statistik hängt nicht in `PupilSelfStats`, sondern in der Übungsseite
   * (`StatistikSchliessen` aus der Kopfzeile) - der Test oben sah ihn nie,
   * und er stand deutsch in der englischen Bedienung.
   */
  it("EN10: der Knopf „Statistik schließen“ heisst englisch „Close statistics“", () => {
    stelleBedienung("en");
    zeige(<StatistikSchliessen onClose={() => {}} />);
    expect(screen.getByRole("button", { name: "Close statistics" })).toBeTruthy();
    expect(findeDeutsch(document.body)).toEqual([]);
    cleanup();
    stelleBedienung(null);
    zeige(<StatistikSchliessen onClose={() => {}} />);
    expect(screen.getByRole("button", { name: "Statistik schließen" })).toBeTruthy();
    expect(findeDeutsch(document.body).length).toBeGreaterThan(0);
  });

  it("die Wochen stehen mit Datum, nie als nackte Nummer; Prozent ohne Leerzeichen", async () => {
    await statistik("en");
    const zeilen = [...document.querySelectorAll("tbody th[scope=row]")].map((t) => t.textContent ?? "");
    const wochen = zeilen.filter((z) => z.startsWith("Week "));
    expect(wochen.length).toBeGreaterThan(0);
    for (const w of wochen) expect(w).toMatch(/^Week \d+ \(w\/c \d+ [A-Z][a-z]+\)/);
    expect(document.body.textContent).not.toMatch(/\d %/);
    expect(document.body.textContent).toContain("excused");
    expect(document.body.textContent).toMatch(/New goal from Monday \d+ [A-Z][a-z]+: 45 minutes/);
  });

  it("GEGENPROBE: dieselbe Statistik deutsch liefert viele Funde", async () => {
    await statistik(null);
    fireEvent.click(screen.getByRole("button", { name: /Alle Abzeichen anzeigen/ }));
    expect(fange().length).toBeGreaterThan(60);
  });
});

// ---------------------------------------------------------------------------
// 3 · Dieselbe Auswertung für die Lehrkraft - und die Bausteine der Klassenseite
// ---------------------------------------------------------------------------

function lehrkraftDaten(konto: TypingAccount): PupilData {
  const events = [ereignis(montag(-1) + TAG, 30), ereignis(montag(0) + TAG, 25)];
  return { pupil: konto, progress: fortschritt(), events, stats: computePupilStats(events) };
}

const KARTE: JahreskarteWerte = {
  schuljahr: { label: "2026/27", vonMs: new Date(2026, 8, 1).getTime(), bisMs: new Date(2027, 7, 31).getTime() },
  geschwindigkeit: { jetzt: 180, steigerung: 12, bezugswert: 168 },
  treffsicherheit: { jetzt: 0.96, steigerung: -2, bezugswert: 0.98 },
  aufgaben: {
    aktiv: true,
    anteil: 0.87,
    minutenErfuellt: 522,
    minutenZiel: 600,
    wochenGanz: 7,
    wochenGesamt: 10,
  },
} as unknown as JahreskarteWerte;

function lehrkraftSeite() {
  const konto = { id: "mia", role: "schueler", name: "Mia", classCode: "3B", createdAt: 1 } as TypingAccount;
  const daten = lehrkraftDaten(konto);
  const v = veraenderung(96, 93, "treffer");
  return (
    <div>
      <PupilStatsPanel data={daten} showSuspicion={false} flach />
      <SuspicionChip score={5} reasons={[]} />
      <SchreibprobenTabelle ergebnisse={[probe(9, 1072, 26), probe(3, 90, 40)]} beschriftung="Typing Challenges" anrede="Sie" />
      <SchreibprobenKennzahl ergebnisse={[probe(9, 1072, 26)]} />
      <Jahreskarte titel="Mia" werte={KARTE} bezug="vorwoche" onBezug={() => {}} />
      <TopfZahlen toepfe={[1, 4, 2, 0]} gesamt={7} />
      <Punktleiste
        titel="Scores across the class"
        personen={[
          { name: "Mia", wert: 72 },
          { name: "Noah", wert: 81 },
        ]}
        einheit=""
        einheitGesprochen="points"
      />
      <Veraenderungspfeil wert="96%" veraenderung={v} groesse="treffer" vergleichsName="the week before" />
      <Veraenderungspfeil wert="180" veraenderung={null} groesse="tempo" vergleichsName="the week before" />
      <PlayerLevelRing level={7} into={40} need={100} label="Game level" xpUnit="XP" />
      <LetterMap lernweg="de"
        letters={fortschritt().letters!}
        introduced={EINGEFUEHRT}
        showNext
        collapsible
        open={false}
        onToggleOpen={() => {}}
      />
      <LetterMap lernweg="de" letters={fortschritt().letters!} introduced={EINGEFUEHRT.slice(0, 12)} showNext />
    </div>
  );
}

describe("★ EN3 · die Statistik in der Lehrkraft-Sicht und die Bausteine der Klassenseite", () => {
  it("englisch: kein deutsches Wort (Panel flach, Challenge-Tabelle „Sie“, Jahreskarte, Punktleiste, Pfeile, Ring, Tastenkarte)", () => {
    stelleBedienung("en");
    zeige(lehrkraftSeite());
    // Den Erklärkasten zur nächsten Taste aufklappen.
    fireEvent.click(screen.getAllByRole("button", { name: /^Next key .*: show explanation$/ })[0]);
    expect(screen.getByText("automatically")).toBeTruthy();
    expect(fange()).toEqual([]);
  });

  it("die Sätze am Veränderungspfeil und an den Spalten englisch - samt Einheit und Richtung", () => {
    const v = veraenderung(186, 174, "tempo")!;
    expect(veraenderungSatz(v, "tempo", "the week before", "en")).toBe(
      "Speed is 12 keystrokes per minute higher than in the week before.",
    );
    expect(veraenderungSatz(veraenderung(95.4, 95, "treffer")!, "treffer", "school year 2025/26", "en")).toBe(
      "Accuracy has stayed about the same compared with school year 2025/26 (a difference of 0.4 percentage points).",
    );
    expect(ohneVergleichSatz("", "en")).toContain("“All time”");
    expect(entwicklungsGrund({ treffer: null, tempo: null, score: null, ausgangswoche: null, wochen: 1 }, "en")).toContain(
      "Only one practice week",
    );
    for (const g of ["treffer", "tempo", "score"] as const)
      for (const lang of [true, false]) {
        const f = pruefeText(`spaltenHilfe ${g}`, spaltenHilfe(g, lang, "en"));
        expect(f).toBeNull();
      }
  });

  it("GEGENPROBE: dieselbe Seite deutsch liefert viele Funde", () => {
    stelleBedienung(null);
    zeige(lehrkraftSeite());
    expect(fange().length).toBeGreaterThan(40);
  });
});

// ---------------------------------------------------------------------------
// 4 · Die Polar-Expedition - alle Zonen, Tagebuch, Fehlgriff, gewonnen, Finale
// ---------------------------------------------------------------------------

const M = masteryFor("normal");
const INTRO = ["f", "j", "d", "k", "s", "l", "a", "e", "n", "i", "r", "t", "h", "u", "g", "o"];

const KURSE: Record<PlayZone, () => ReturnType<typeof buildPackeisCourse>> = {
  water: () => buildPackeisCourse(INTRO, undefined, M, { free: true, seed: 2 }),
  climb: () => buildSteilwandCourse(INTRO, undefined, M, { free: true, seed: 2 }),
  cave: () => buildCaveCourse(INTRO, undefined, M, { seed: 2 }),
  storm: () => buildStormCourse(INTRO, undefined, M, { seed: 2 }),
  station: () => buildStationCourse(INTRO, undefined, M, { seed: 2 }),
  slide: () => buildSlideCourse(INTRO, undefined, M, { free: true, seed: 2 }),
};

describe("★ EN3 · die Polar-Expedition englisch", () => {
  it("die Texte der Zonen und des Tagebuchs: kein deutsches Wort, beide Tonlagen", () => {
    const funde: string[] = [];
    for (const z of Object.keys(KURSE) as PlayZone[]) {
      const T = zoneText(z, "en");
      const texte = [
        T.noun,
        T.startText(false, "f"),
        T.startText(true, "f"),
        T.introKid("f", true),
        T.introKid("f", false),
        T.introAdult("f", true),
        T.failKid("f"),
        T.failAdult("f"),
        T.winKid(true),
        T.winKid(false),
        T.winAdult(),
        diaryText(z, false, "en").task,
        diaryText(z, false, "en").example,
        diaryText(z, true, "en").task,
        diaryText(z, true, "en").example,
      ];
      for (const t of texte) {
        const f = pruefeText(z, t);
        if (f && !nurTastenzeichen(f)) funde.push(f);
      }
    }
    for (const zone of EXPEDITION_ZONES) {
      for (const t of [zone.nameEn, zone.trainsEn]) {
        const f = pruefeText(zone.kind, t);
        if (f) funde.push(f);
      }
    }
    expect(funde).toEqual([]);
    // §7 bleibt: das Stations-Beispiel ist kein Rätselwort (die deutsche Liste kennt „radio" nicht).
    expect(diaryText("station", false, "en").example).toContain("radio");
  });

  it("jede Zone einzeln gespielt (Stimme aus ⇒ Live-Regionen): Öffner, Einführung, Stand, Fehlgriff", () => {
    stelleBedienung("en");
    const funde: string[] = [];
    for (const z of Object.keys(KURSE) as PlayZone[]) {
      const { unmount } = zeige(
        <ExpeditionStage open onClose={() => {}} course={KURSE[z]()} free isAdult={false} noTimePressure letters={{}} />,
      );
      funde.push(...fange());
      // Ein Fehlgriff: ein Herz weg (in jeder Zone gleich).
      fireEvent.keyDown(screen.getByRole("application"), { key: "q" });
      funde.push(...fange());
      unmount();
    }
    expect([...new Set(funde)]).toEqual([]);
  });

  it("mit Stimme: das Tagebuch der Reise und das Spiel sprechen englisch MIT englischer Stimme", () => {
    stelleBedienung("en");
    const { baseElement } = zeige(
      <ExpeditionJourney open onClose={() => {}} introduced={INTRO} mastery={M} seed={2} voiceEnabled />,
    );
    const tagebuch = baseElement.querySelector(".px-diary");
    expect(tagebuch?.textContent).toContain("Expedition diary · Zone 1 of");
    expect(tagebuch?.textContent).toContain("The Pack Ice");
    const funde = [...fange()];
    // Die Leertaste startet die Zone.
    fireEvent.keyDown(screen.getByRole("dialog"), { key: " " });
    fireEvent.keyDown(screen.getByRole("application"), { key: "q" });
    funde.push(...fange());
    expect([...new Set(funde)]).toEqual([]);
    expect(gesprochen().some(([t, s]) => s === "en" && t.startsWith("Expedition diary."))).toBe(true);
    expect(ohneEnglischeStimme(), "Ansagen ohne englische Stimme").toEqual([]);
  });

  it("gewonnen im freien Spiel: „Play again!“ und „Done“; das Finale in allen drei Fassungen", () => {
    vi.useFakeTimers();
    stelleBedienung("en");
    const kurs = { stages: [{ kind: "water" as const, units: ["f", "j", "d"] }] };
    zeige(<ExpeditionStage open onClose={() => {}} course={kurs} free isAdult={false} noTimePressure letters={{}} />);
    const feld = screen.getByRole("application");
    for (const k of ["f", "j", "d"]) fireEvent.keyDown(feld, { key: k });
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByRole("button", { name: "Play again!" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Done" })).toBeTruthy();
    const funde = [...fange()];
    cleanup();
    for (const [sauber, fehlerfrei] of [
      [true, true],
      [true, false],
      [false, false],
    ] as const) {
      const { unmount } = zeige(
        <FinaleOverlay
          allClean={sauber}
          allFlawless={fehlerfrei}
          isAdult={false}
          voiceEnabled={false}
          onClose={() => {}}
          result={{ clean: fehlerfrei, fish: 0 }}
        />,
      );
      funde.push(...fange());
      unmount();
    }
    expect([...new Set(funde)]).toEqual([]);
  });

  it("GEGENPROBE: dieselbe Reise deutsch liefert viele Funde", () => {
    stelleBedienung(null);
    zeige(<ExpeditionJourney open onClose={() => {}} introduced={INTRO} mastery={M} seed={2} voiceEnabled />);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: " " });
    expect(fange().length).toBeGreaterThan(5);
  });
});

// ---------------------------------------------------------------------------
// 5 · Eine Feier - die Freischalt-Karte
// ---------------------------------------------------------------------------

describe("★ EN3 · die Freischalt-Feier englisch", () => {
  it("kein deutsches Wort auf der Karte (Kind und Jugend)", () => {
    stelleBedienung("en");
    for (const skin of ["kind", "jugend"] as const) {
      const { unmount } = zeige(<UnlockCelebration unit="e" skin={skin} onClose={() => {}} />);
      expect(fange()).toEqual([]);
      unmount();
    }
  });

  it("GEGENPROBE: deutsch liefert Funde", () => {
    stelleBedienung(null);
    zeige(<UnlockCelebration unit="e" skin="kind" onClose={() => {}} />);
    expect(fange().length).toBeGreaterThan(1);
  });
});

// ---------------------------------------------------------------------------
// 6 · Die Medaille selbst: ohne Text im Bild (Gegenprobe gegen einen falschen Grund)
// ---------------------------------------------------------------------------

describe("★ EN3 · die Medaille trägt keinen Text", () => {
  it("die Zeichnung ist in beiden Sprachen stumm (aria-hidden) - die Auskunft steht daneben", () => {
    stelleBedienung("en");
    const { container } = zeige(<BadgeMedal def={BADGES[0]} />);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(findeDeutsch(container)).toEqual([]);
  });
});
