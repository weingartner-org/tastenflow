/**
 * ★★★ WÄCHTER: die Ordnung von „Meine Statistik" (19.09.2026).
 *
 * Johannes, wörtlich: *„Und noch die Schülerstatistik: mach die
 * Tippchallenges auch als Ausklappzeile und zu Beginn eingeklappt; gib die
 * Steigerung im Verlauf unter die Tippchallenges; entferne den Bereich
 * Lektionen, den versteht jetzt niemand mehr, und gib den Bereich ‚Tasten,
 * die sich lohnen' und ‚Als Nächstes schaltest du frei …' zu dem Bereich
 * Tastenstand - auch der Tastenstand eine Zeile zum Ausklappen."*
 *
 * Geprüft an der ganzen Ansicht (`PupilSelfStats`) mit echten Daten im
 * lokalen Speicher - Wochenziel, Runden, Abzeichen, zwei Tippchallenges,
 * wacklige Tasten, eine gelesene Geschichte -, damit JEDER Block wirklich
 * erscheint und nicht nur deshalb in der richtigen Reihenfolge steht, weil er
 * fehlt.
 *
 *  1. Die `h3` stehen in Johannes' Reihenfolge: Wochenziele · Werte ·
 *     Abzeichen · Tippchallenges · Steigerung im Verlauf · Tasten-Stand ·
 *     Geschichten & Wissen - und es gibt keine weitere (kein „Lektionen",
 *     kein zweites „Tasten-Stand").
 *  2. Tippchallenges und Tasten-Stand sind Ausklappzeilen, zu Beginn ZU: die
 *     `h3` steht in der `<summary>` (Sprungmarke für „h"), der Stand daneben.
 *  3. „Als Nächstes", die Tastenkarte, die Tasten, die sich zu üben lohnen,
 *     und „Du übst gerade" stehen IN der Klappe „Tasten-Stand".
 *  4. Vom Block „Lektionen" ist nichts übrig.
 *
 * GEGENPROBE: Am Stand vor dem Umbau (`HEAD` vom 19.09.2026 mittags) ist
 * dieser Wächter rot - dort standen Steigerung vor den Abzeichen, die
 * Tippchallenges und der Tasten-Stand offen, „Als Nächstes" und die
 * lohnenden Tasten ausserhalb, und der Lektionen-Block war da.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, waitFor } from "@testing-library/react";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn() };
});

import { PupilSelfStats } from "@/components/typing/PupilSelfStats";
import {
  PRUEFUNG_WORT_MEHRZAHL,
  SHIFT_UNIT,
  emptyProgress,
  typingBackend,
  werteAus,
  type Probenergebnis,
  type TypingAccount,
  type TypingProgress,
} from "@/lib/typing";
import {
  addPupil,
  createClass,
  listPupils,
  recordEvent,
  registerTeacher,
  saveAccountProgress,
} from "@/lib/typing/account";
import { isoWeekKey } from "@/lib/typing/goals";
import { WOCHENZIEL_GRENZE } from "@/lib/typing/wochenziel";
import { wochenStart } from "@/lib/typing/wochenrhythmus";

// ── Die Daten eines Kindes, echt genug für jeden Block ──────────────────────

const TAG = 86_400_000;
const MIN = 60_000;

function montag(versatz = 0): number {
  return wochenStart(Date.now(), WOCHENZIEL_GRENZE) + versatz * 7 * TAG;
}

/** Ein Zeichen mit Fenster: `gut` Treffer (220 ms), `schlecht` Fehler. */
function zeichen(gut: number, schlecht: number) {
  const recent = [
    ...Array.from({ length: gut }, () => 220),
    ...Array.from({ length: schlecht }, () => -1),
  ];
  return { hits: gut * 4, misses: schlecht * 4, sumMs: gut * 4 * 220, timed: gut * 4, recent };
}

const EINGEFUEHRT = [
  "f", "j", "d", "k", "s", "l", "a", "ö", "e", "n", "i", "r", "t", "h", "u", "g",
  SHIFT_UNIT, "ä", "ü", "ß", "o", "c", ",",
];

function fortschritt(): TypingProgress {
  const letters: TypingProgress["letters"] = {};
  EINGEFUEHRT.forEach((ch, i) => {
    if (ch === "ß") return; // neu: noch nicht geübt
    // ★ D-4 (28.09.2026): „wacklig" erst ab 20 Anschlägen - die schwachen Zeichen
    // haben darum 22 bzw. 21 (vorher 16 und 19).
    letters[ch] = i % 7 === 3 ? zeichen(14, 8) : i % 5 === 2 ? zeichen(18, 3) : zeichen(40, 0);
  });
  const jetzt = Date.now();
  return {
    ...emptyProgress(),
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
    // Abgeschlossene Lektionen - der frühere Block „Lektionen" hätte sie
    // gezeigt. Sie stehen hier, damit der Wächter einen Rückfall SEHEN kann.
    lessons: {
      "home-fj": { completed: true, bestStars: 3, bestCpm: 120, attempts: 2 },
      "home-dk": { completed: true, bestStars: 2, bestCpm: 110, attempts: 1 },
    },
    badges: { volltreffer: jetzt - 5 * TAG, "tasten-kueken": jetzt - 6 * TAG },
    storyProgress: { "de-g2-khalai-spricht-mit-pflanzen": { etappe: 1, line: 3 } },
    lastPlace: { mode: "buecherei", serieSlug: "de-g2-khalai-spricht-mit-pflanzen" },
  };
}

function probe(tag: number, zahl: number, fehler: number): Probenergebnis {
  const beginn = Date.now() - tag * TAG;
  return werteAus({
    probeId: `sp-${tag}`,
    niveau: "buchstaben",
    textNr: 2,
    textTitel: "Der Igel und der Hase",
    startZeile: 0,
    beginnMs: beginn,
    endeMs: beginn + 5 * MIN,
    zeitMs: 5 * MIN,
    zuschlagProzent: 0,
    wartezeitMs: 0,
    zeichen: zahl,
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

async function kindMitDaten({ challenges }: { challenges: boolean }): Promise<TypingAccount> {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  const p = addPupil(c.value.code, "Mia", "pw1234");
  if (!p.ok) throw new Error(p.error);
  const mia = listPupils(c.value.code).find((k) => k.name === "Mia")!;
  const konto: TypingAccount = {
    ...mia,
    wochenzielVerlauf: [{ ab: isoWeekKey(montag(-2)), minuten: 60 }],
  };
  for (const [versatz, minuten] of [
    [-2, 70],
    [-1, 20],
    [0, 25],
  ] as const) {
    const ms = minuten * MIN;
    recordEvent(konto.id, {
      ts: montag(versatz) + TAG + 3600_000,
      lesson: "adaptiv",
      chars: minuten * 120,
      errors: minuten * 3,
      ms,
      activeMs: ms,
    });
  }
  saveAccountProgress(konto.id, fortschritt());
  if (challenges) {
    const b = typingBackend();
    await b.speichereProbenergebnis(konto, probe(9, 1072, 26));
    await b.speichereProbenergebnis(konto, probe(3, 1150, 12));
  }
  return konto;
}

/** „Meine Statistik" zeigen und warten, bis alles geladen ist. */
async function zeigeStatistik({ challenges }: { challenges: boolean }) {
  const konto = await kindMitDaten({ challenges });
  render(<PupilSelfStats account={konto} />);
  await waitFor(() => expect(ueberschrift(/^Tasten-Stand$/)).toBeTruthy());
  if (challenges)
    await waitFor(() =>
      expect(document.querySelector("[data-schreibproben-tabelle]")).not.toBeNull(),
    );
}

// ── Lesen, was dasteht ───────────────────────────────────────────────────────

function karte(): HTMLElement {
  const k = document.getElementById("tippen-statistik-titel")?.closest<HTMLElement>("div.card");
  if (!k) throw new Error("Die Statistik-Karte steht nicht auf der Seite.");
  return k;
}

function text(el: Element): string {
  return (el.textContent ?? "").replace(/\s+/g, " ").trim();
}

function h3(): HTMLElement[] {
  return [...karte().querySelectorAll<HTMLElement>("h3")];
}

function ueberschrift(muster: RegExp): HTMLElement | undefined {
  const karteDa = document.getElementById("tippen-statistik-titel");
  if (!karteDa) return undefined;
  return h3().find((h) => muster.test(text(h)));
}

/** Die Ausklappzeile, deren `<summary>` diese Überschrift trägt. */
function klappeVon(h: HTMLElement): HTMLDetailsElement {
  const summary = h.closest("summary");
  expect(summary, `„${text(h)}" steht nicht in einer <summary>`).not.toBeNull();
  const details = summary!.parentElement;
  expect(details?.tagName, `„${text(h)}": die <summary> gehört zu keinem <details>`).toBe(
    "DETAILS",
  );
  // Die ERSTE summary (so will es HTML). ⚠️ Nicht `:scope > summary`: jsdom
  // (nwsapi) baut `:scope` aus den Klassen nach und scheitert an `group/tasten`.
  expect([...details!.children].find((k) => k.tagName === "SUMMARY")).toBe(summary);
  return details as HTMLDetailsElement;
}

/** Die Blöcke in Johannes' Reihenfolge (19.09.2026). */
const ORDNUNG: Array<[string, RegExp]> = [
  ["Wochenziele", /^Wochenziele$/],
  ["Werte im Überblick", /^Deine Werte im Überblick$/],
  ["Abzeichen", /^Meine Abzeichen/],
  ["Tippchallenges", new RegExp(`^${PRUEFUNG_WORT_MEHRZAHL}$`)],
  ["Steigerung im Verlauf", /^Steigerung im Verlauf$/],
  ["Tasten-Stand", /^Tasten-Stand$/],
  ["Geschichten & Wissen", /^Geschichten & Wissen$/],
];

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("★★★ „Meine Statistik\" - die Ordnung vom 19.09.2026", () => {
  it("die h3 stehen in Johannes' Reihenfolge - und keine weitere", async () => {
    await zeigeStatistik({ challenges: true });
    const texte = h3().map(text);
    const stellen = ORDNUNG.map(([name, muster]) => {
      const i = texte.findIndex((t) => muster.test(t));
      expect(i, `„${name}" fehlt unter ${JSON.stringify(texte)}`).toBeGreaterThanOrEqual(0);
      return i;
    });
    // Streng aufsteigend: jeder Block nach dem vorigen.
    for (let i = 1; i < stellen.length; i++)
      expect(
        stellen[i],
        `„${ORDNUNG[i][0]}" muss nach „${ORDNUNG[i - 1][0]}" stehen: ${JSON.stringify(texte)}`,
      ).toBeGreaterThan(stellen[i - 1]);
    // Genau diese sieben - kein „Lektionen", kein zweites „Tasten-Stand",
    // keine alte h3 „Diese Tasten lohnt sich zu üben" (jetzt h4 im Tasten-Stand).
    expect(texte).toHaveLength(ORDNUNG.length);
    // Die Gliederung für „h" bleibt lückenlos: h2 → h3 → h4.
    const ebenen = [...karte().querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) =>
      Number(h.tagName[1]),
    );
    expect(ebenen[0]).toBe(2);
    for (let i = 1; i < ebenen.length; i++)
      expect(ebenen[i]).toBeLessThanOrEqual(ebenen[i - 1] + 1);
  });

  it("ohne Tippchallenge fehlt nur dieser eine Block - die Ordnung bleibt", async () => {
    await zeigeStatistik({ challenges: false });
    const texte = h3().map(text);
    const ohne = ORDNUNG.filter(([name]) => name !== "Tippchallenges");
    expect(texte.map((t) => ohne.findIndex(([, m]) => m.test(t)))).toEqual(ohne.map((_, i) => i));
  });

  it("Tippchallenges und Tasten-Stand sind Ausklappzeilen, zu Beginn ZU, mit dem Stand in der summary", async () => {
    await zeigeStatistik({ challenges: true });
    const challenges = klappeVon(ueberschrift(new RegExp(`^${PRUEFUNG_WORT_MEHRZAHL}$`))!);
    const tasten = klappeVon(ueberschrift(/^Tasten-Stand$/)!);
    for (const [name, d] of [
      ["Tippchallenges", challenges],
      ["Tasten-Stand", tasten],
    ] as const) {
      expect(d.open, `${name} ist offen`).toBe(false);
      expect(d.hasAttribute("open"), `${name} trägt open`).toBe(false);
    }
    // Der Stand steht ohne Aufklappen da.
    expect(text(challenges.querySelector("summary")!)).toMatch(
      /2 geschrieben, Leistungswert im Schnitt \d+/,
    );
    expect(text(tasten.querySelector("summary")!)).toMatch(
      new RegExp(`\\d+ von ${EINGEFUEHRT.length} sitzen`),
    );
    // Die Liste der Challenges steckt IN der Klappe - samt den einzelnen
    // Challenges, die ihre eigenen Klappen behalten.
    expect(challenges.querySelector("[data-schreibproben-tabelle]")).not.toBeNull();
    expect(challenges.querySelectorAll("li details")).toHaveLength(2);
    // Die schon vorher zugeklappten Blöcke bleiben es.
    expect(klappeVon(ueberschrift(/^Wochenziele$/)!).open).toBe(false);
    expect(klappeVon(ueberschrift(/^Steigerung im Verlauf$/)!).open).toBe(false);
  });

  it("„Als Nächstes“, die Tastenkarte, die lohnenden Tasten und „Du übst gerade“ stehen IM Tasten-Stand", async () => {
    await zeigeStatistik({ challenges: true });
    const kopf = ueberschrift(/^Tasten-Stand$/)!;
    const tasten = klappeVon(kopf);
    const innen = text(tasten);
    for (const satz of [
      "Als Nächstes schaltest du frei:",
      "Diese Tasten lohnt sich zu üben:",
      "Du übst gerade:",
    ]) {
      expect(innen, `„${satz}" fehlt im Tasten-Stand`).toContain(satz);
      // Gegenprobe: und nur dort, nicht noch einmal daneben.
      expect(text(karte()).split(satz).length - 1, `„${satz}" steht doppelt`).toBe(1);
    }
    // Die lohnenden Tasten sind eine Ebene unter „Tasten-Stand".
    const lohnend = [...tasten.querySelectorAll("h4")].find((h) =>
      text(h).startsWith("Diese Tasten lohnt sich zu üben"),
    );
    expect(lohnend).toBeTruthy();
    // Die Tastenkarte hängt an der Überschrift der Klappe - ohne eigenen Kopf
    // und ohne eigene Klappe darin.
    expect(kopf.id).not.toBe("");
    const karteDerTasten = tasten.querySelector(`[role="list"][aria-labelledby="${kopf.id}"]`);
    expect(karteDerTasten).not.toBeNull();
    expect(karteDerTasten!.querySelectorAll('[role="listitem"]')).toHaveLength(EINGEFUEHRT.length);
    expect(tasten.querySelectorAll("h3")).toHaveLength(1);
    expect(tasten.querySelector("[aria-expanded]")).toBeNull();
  });

  it("vom Block „Lektionen“ ist nichts übrig", async () => {
    await zeigeStatistik({ challenges: true });
    const k = karte();
    expect([...k.querySelectorAll("h1,h2,h3,h4,h5,h6")].some((h) => /Lektion/.test(text(h)))).toBe(
      false,
    );
    expect(k.querySelector('[aria-label="Lektionen-Stand"]')).toBeNull();
    expect(text(k)).not.toMatch(/Lektionen \(\d+ von \d+ freigeschaltet/);
    expect(text(k)).not.toContain("Lektionen schalten sich von selbst frei");
    expect(text(k)).not.toMatch(/Lektion \d+, /);
  });
});
