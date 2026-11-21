/**
 * Thema 2 (21.07.): Lehreransicht um Serien-Fortschritt und Übungs-Schwerpunkt
 * ergänzen — unter der harten Regel [[feedback_data_transparency]]:
 * **Die Lehrkraft sieht nie mehr über ein Kind als das Kind über sich selbst.**
 *
 * Darum steht der neue Block in der GETEILTEN Komponente `PupilStatsPanel`
 * (Lehrer-Dashboard und „Meine Statistik" rendern dieselbe). Die Tests sichern
 * genau das ab: gleiche Fakten in beiden Sichten, nur andere Anrede.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  FOCUS_COUNT,
  computePupilStats,
  focusUnits,
  serieBySlug,
  serienOverview,
  type LetterStat,
  type TaskEvent,
  type TypingAccount,
  type TypingProgress,
} from "../src/lib/typing";
import { PupilStatsPanel, type PupilData } from "../src/components/typing/PupilStatsPanel";

const FILO = "filo-und-mira";
const INTRODUCED_T2 = [
  "f", "j", "d", "k", "s", "l", "a", "ö",
  "e", "n", "i", "r", "t",
  "h", "u", "c", "g", "m", "o", "b", "w",
];

const pupil: TypingAccount = {
  id: "p1",
  role: "schueler",
  name: "Testkind",
  classCode: "ABC",
  stufe: "b",
  createdAt: 1_700_000_000_000,
};

const event: TaskEvent = {
  ts: 1_700_000_000_000,
  lesson: "adaptiv",
  ms: 30_000,
  chars: 100,
  errors: 2,
};

function data(progress: Partial<TypingProgress>): PupilData {
  const events = [event];
  return {
    pupil,
    progress: { xp: 0, lessons: {}, introduced: INTRODUCED_T2, ...progress },
    events,
    stats: computePupilStats(events),
  };
}

describe("serienOverview — Bücherei-Stand eines Kindes", () => {
  it("nennt die laufende Serie mit Etappe und Zeile", () => {
    const ov = serienOverview({
      xp: 0,
      lessons: {},
      lastPlace: { mode: "buecherei", serieSlug: FILO },
      storyProgress: { [FILO]: { etappe: 2, line: 4 } },
    });
    expect(ov.aktuell?.serie.slug).toBe(FILO);
    expect(ov.aktuell?.etappe).toBe(3); // 1-basiert zum Anzeigen
    expect(ov.aktuell?.line).toBe(4);
    expect(ov.fertig).toHaveLength(0);
    expect(ov.begonnen).toBe(1);
  });

  it("trennt fertige von laufenden Serien", () => {
    const zweite = "lisas-laterne";
    expect(serieBySlug(zweite)).toBeDefined(); // Vorbedingung des Tests
    const ov = serienOverview({
      xp: 0,
      lessons: {},
      storyProgress: {
        [FILO]: { etappe: 6, done: true },
        [zweite]: { etappe: 1 },
      },
    });
    expect(ov.fertig.map((s) => s.slug)).toEqual([FILO]);
    expect(ov.aktuell?.serie.slug).toBe(zweite);
    expect(ov.begonnen).toBe(2);
  });

  it("meldet nichts, solange keine Serie angefasst wurde", () => {
    const ov = serienOverview({ xp: 0, lessons: {} });
    expect(ov.aktuell).toBeUndefined();
    expect(ov.fertig).toHaveLength(0);
    expect(ov.begonnen).toBe(0);
  });
});

describe("PupilStatsPanel — neue Angaben in BEIDEN Sichten", () => {
  const progress = {
    introduced: INTRODUCED_T2,
    lastPlace: { mode: "buecherei" as const, serieSlug: FILO },
    storyProgress: { [FILO]: { etappe: 2, line: 4 } },
  };

  it("Lehrkraft sieht Serien-Fortschritt und Schwerpunkt", () => {
    render(<PupilStatsPanel data={data(progress)} />);
    expect(screen.getByText(/Geschichten & Wissen/i)).toBeInTheDocument();
    expect(screen.getByText(/Liest gerade:/i)).toBeInTheDocument();
    expect(screen.getByText(/Filo und Mira/i)).toBeInTheDocument();
    expect(screen.getByText(/Etappe 3 von 6 · Zeile 5 von/i)).toBeInTheDocument();
    expect(screen.getByText(/Übt gerade:/i)).toBeInTheDocument();
  });

  it("Kind sieht in der Selbstsicht DIESELBEN Angaben (nur mit „Du“)", () => {
    render(<PupilStatsPanel data={data(progress)} selfView showSuspicion={false} />);
    expect(screen.getByText(/Du liest gerade:/i)).toBeInTheDocument();
    expect(screen.getByText(/Filo und Mira/i)).toBeInTheDocument();
    expect(screen.getByText(/Etappe 3 von 6 · Zeile 5 von/i)).toBeInTheDocument();
    expect(screen.getByText(/Du übst gerade:/i)).toBeInTheDocument();
  });

  it("zeigt den Bücherei-Block gar nicht, solange nichts gelesen wurde", () => {
    render(<PupilStatsPanel data={data({ introduced: INTRODUCED_T2 })} />);
    expect(screen.queryByText(/Geschichten & Wissen/i)).toBeNull();
  });

  it("nennt als Schwerpunkt genau das, was das Training betont", () => {
    // Ein schwaches Komma muss in der Anzeige auftauchen — sonst behauptete die
    // Statistik etwas anderes, als „Mein Training" tatsächlich übt (Thema 1/B).
    const letters: Record<string, LetterStat> = {};
    const intro = [...INTRODUCED_T2, "⇧", ".", ","];
    for (const u of intro)
      letters[u] = { hits: 20, misses: 0, sumMs: 20 * 450, timed: 20 };
    letters[","] = { hits: 6, misses: 6, sumMs: 6 * 900, timed: 6 };

    const erwartet = focusUnits(intro, letters, "de", FOCUS_COUNT);
    expect(erwartet).toContain(",");

    render(<PupilStatsPanel data={data({ introduced: intro, letters })} />);
    const zeile = screen.getByText(/Übt gerade:/i);
    expect(zeile.textContent).toContain("Komma");
  });
});
