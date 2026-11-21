/**
 * Polar-Expedition — Steilwand & Heim-Bauchrutsche (E3). Prüft die Folgen-Kurse
 * (2–4 Zeichen je Tritt), die climb/slide-Layouts (aufsteigend bzw. absteigend) und
 * den KERN von E3: den Folgen-Teilfortschritt (eine Station schaltet erst weiter,
 * wenn die ganze Folge getippt ist) — plus dass Wasser dabei unverändert bleibt.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { courseSpots, masteryFor, SHIFT_UNIT, type FloeCourse, type LetterStat } from "../src/lib/typing";
import {
  buildSlideCourse,
  buildSteilwandCourse,
  seqLenFor,
} from "../src/lib/typing/expedition/course";
import { STEIL_GROUND_Y, steilwandLayout } from "../src/components/typing/expedition/scenes/SteilwandScene";
import { SLIDE_TOP_Y, slideLayout } from "../src/components/typing/expedition/scenes/SlideScene";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const mastery = masteryFor("normal");
const noStats: Record<string, LetterStat> = {};
const CLIMB = (units: string[]): FloeCourse => ({ stages: [{ kind: "climb", units }] });

describe("Folgen-Kurse (course.ts)", () => {
  it("seqLenFor wächst mit der Zahl gelernter Zeichen (2 → 4)", () => {
    expect(seqLenFor([])).toBe(2);
    expect(seqLenFor(new Array(10).fill("a"))).toBe(3);
    expect(seqLenFor(new Array(30).fill("a"))).toBe(4);
  });

  it("buildSteilwandCourse: eine climb-Etappe aus Zeichen-FOLGEN (nicht Einzelzeichen)", () => {
    const intro = ["f", "j", "d", "k", "s", "l", "a", "e", "n", "r"]; // 10 → seqLen 3
    const c = buildSteilwandCourse(intro, noStats, mastery);
    expect(c.stages).toHaveLength(1);
    expect(c.stages[0].kind).toBe("climb");
    expect(c.stages[0].units).toHaveLength(4); // Tor = 4 Tritte
    for (const seq of c.stages[0].units) expect(seq.length).toBe(3); // je 3 Zeichen
  });

  it("buildSlideCourse: eine slide-Etappe aus EINZELZEICHEN (Rhythmus-Spiel, 14.07.)", () => {
    const c = buildSlideCourse(["f", "j", "d", "k"], noStats, mastery);
    expect(c.stages[0].kind).toBe("slide");
    expect(c.stages[0].units).toHaveLength(8); // Tor: 8 heranfliegende Buchstaben
    // Jeder Halt trägt GENAU EINEN Buchstaben — es ist immer nur einer unterwegs.
    for (const u of c.stages[0].units) expect(u).toHaveLength(1);
  });

  it("Folgen enthalten nie die Umschalt-Einheit", () => {
    const c = buildSteilwandCourse(["f", "j", SHIFT_UNIT, "d"], noStats, mastery);
    expect(c.stages[0].units.join("")).not.toContain(SHIFT_UNIT);
  });

  it("leerer Zeichen-Pool → leerer Kurs", () => {
    expect(buildSteilwandCourse([], noStats, mastery).stages).toHaveLength(0);
  });
});

describe("Layouts", () => {
  it("steilwandLayout steigt an: jeder Tritt höher (kleineres y), x wächst", () => {
    const { pts } = steilwandLayout(courseSpots(CLIMB(["de", "fj"])));
    expect(pts[0].y).toBe(STEIL_GROUND_Y); // Bergfuß
    expect(pts[1].y).toBeLessThan(pts[0].y); // Tritt 1 höher
    expect(pts[2].y).toBeLessThan(pts[1].y); // Tritt 2 noch höher
    expect(pts[1].x).toBeGreaterThan(pts[0].x);
  });

  it("slideLayout fällt ab: jeder Hügel tiefer (größeres y)", () => {
    const { pts } = slideLayout(courseSpots({ stages: [{ kind: "slide", units: ["de", "fj"] }] }));
    expect(pts[0].y).toBe(SLIDE_TOP_Y); // oben starten
    expect(pts[1].y).toBeGreaterThan(pts[0].y); // Hügel 1 tiefer
    expect(pts[2].y).toBeGreaterThan(pts[1].y);
  });
});

describe("Steilwand — Folgen-Teilfortschritt", () => {
  function renderClimb(units: string[]) {
    render(
      <ExpeditionStage
        open
        onClose={vi.fn()}
        course={CLIMB(units)}
        isAdult={false}
        noTimePressure
        letters={noStats}
        onWin={vi.fn()}
      />,
    );
    return screen.getByRole("application");
  }

  it("eine Folge muss KOMPLETT getippt werden, bevor es zum nächsten Tritt geht", () => {
    const field = renderClimb(["de", "fj"]);
    expect(screen.getByText(/Am Bergfuß/)).toBeTruthy();
    fireEvent.keyDown(field, { key: "d" }); // 1/2 der Folge „de"
    expect(screen.getByText(/Am Bergfuß/)).toBeTruthy(); // noch kein Sprung
    // Ein Fehlgriff kostet seit 14.07. ein Herz UND setzt die angefangene Folge zurück:
    // „d" muss danach erneut getippt werden (früher blieb der Teilfortschritt einfach stehen).
    fireEvent.keyDown(field, { key: "x" });
    expect(screen.getByText(/Am Bergfuß/)).toBeTruthy();
    fireEvent.keyDown(field, { key: "d" }); // Folge von vorn
    fireEvent.keyDown(field, { key: "e" }); // 2/2 → Folge komplett → weiter
    expect(screen.getByText(/Tritt 1 von 2/)).toBeTruthy();
    fireEvent.keyDown(field, { key: "f" }); // 1/2 der Folge „fj"
    expect(screen.getByText(/Tritt 1 von 2/)).toBeTruthy(); // noch am 1. Tritt
    fireEvent.keyDown(field, { key: "j" }); // 2/2 → weiter (ins Ziel gleiten)
    expect(screen.queryByText(/Am Bergfuß/)).toBeNull();
  });

  it("zeigt die Steilwand-Kulisse, nicht das Packeis", () => {
    renderClimb(["de"]);
    // HUD + aria-Label nennen die Zone der Steilwand
    expect(screen.getAllByText(/Steilwand/).length).toBeGreaterThan(0);
  });
});
