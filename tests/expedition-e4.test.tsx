/**
 * Polar-Expedition — Echo-Höhle (E4). Prüft den Cave-Kurs (Einzelzeichen), das
 * flache caveLayout und den KERN von E4: BLINDSCHREIBEN — das Zeichen darf NIE als
 * sichtbarer Glyph in der Szene stehen (Bauplan §4.3/§7), die sichtbare Statuszeile
 * nennt es nicht, und der Kontrastschalter „helle Höhle" ist da. Getippt wird nur
 * nach dem (hier still gestellten) Höhlen-Echo — die Tastenlogik selbst greift.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { courseSpots, masteryFor, type FloeCourse, type LetterStat } from "../src/lib/typing";
import { buildCaveCourse } from "../src/lib/typing/expedition/course";
import { CAVE_GROUND_Y, caveLayout } from "../src/components/typing/expedition/scenes/CaveScene";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const mastery = masteryFor("normal");
const noStats: Record<string, LetterStat> = {};
const CAVE = (units: string[]): FloeCourse => ({ stages: [{ kind: "cave", units }] });

describe("Echo-Höhle-Kurs (course.ts)", () => {
  it("buildCaveCourse: eine cave-Etappe aus EINZELZEICHEN (kein Folgen-String)", () => {
    const intro = ["f", "j", "d", "k", "s", "l", "a", "e", "n", "r"];
    const c = buildCaveCourse(intro, noStats, mastery);
    expect(c.stages).toHaveLength(1);
    expect(c.stages[0].kind).toBe("cave");
    expect(c.stages[0].units.length).toBeGreaterThanOrEqual(4); // 4–6 Echos
    for (const u of c.stages[0].units) expect(u.length).toBe(1); // Einzelzeichen
  });

  it("leerer Zeichen-Pool → leerer Kurs", () => {
    expect(buildCaveCourse([], noStats, mastery).stages).toHaveLength(0);
  });
});

describe("caveLayout", () => {
  it("liegt flach: alle Echo-Stellen auf dem Höhlenboden, x wächst", () => {
    const { pts } = caveLayout(courseSpots(CAVE(["d", "e", "f"])));
    expect(pts[0].y).toBe(CAVE_GROUND_Y);
    for (const p of pts) expect(p.y).toBe(CAVE_GROUND_Y); // ebenerdig
    expect(pts[1].x).toBeGreaterThan(pts[0].x);
    expect(pts[2].x).toBeGreaterThan(pts[1].x);
  });
});

describe("Echo-Höhle — Blindschreiben (A11y-Kern, §4.3/§7)", () => {
  function renderCave(units: string[]) {
    const { container } = render(
      <ExpeditionStage
        open
        onClose={vi.fn()}
        course={CAVE(units)}
        free
        isAdult={false}
        noTimePressure
        letters={noStats}
        onWin={vi.fn()}
      />,
    );
    return { field: screen.getByRole("application"), container };
  }

  it("zeigt KEIN Zeichen: kein alphanumerischer Glyph in der Höhlen-Szene", () => {
    const { container } = renderCave(["d", "e"]);
    // Die Höhle darf keine Buchstaben/Ziffern zeigen (Blindschreiben). Deko-Glyphen
    // wie ✦ (Jubel-Sterne des Rigs) sind ok — nur das Zeichen selbst nie.
    const glyphs = [...container.querySelectorAll(".px-scene text")].map((t) => t.textContent ?? "");
    expect(glyphs.every((g) => !/[a-z0-9]/i.test(g))).toBe(true);
  });

  it("die sichtbare Statuszeile verraet die Taste nicht", () => {
    renderCave(["d", "e"]);
    expect(screen.getByText(/Am Höhleneingang/)).toBeTruthy();
    // Kein „Als Nächstes: D“ o. ä. sichtbar.
    expect(screen.queryByText(/Als Nächstes/)).toBeNull();
  });

  it("die Taste greift trotzdem — richtiges Zeichen führt zum nächsten Echo", () => {
    const { field } = renderCave(["d", "e"]);
    expect(screen.getByText(/Am Höhleneingang/)).toBeTruthy();
    fireEvent.keyDown(field, { key: "x" }); // falsch → kein Fortschritt
    expect(screen.getByText(/Am Höhleneingang/)).toBeTruthy();
    fireEvent.keyDown(field, { key: "d" }); // richtig → Echo 1
    expect(screen.getByText(/Echo 1 von 2/)).toBeTruthy();
    fireEvent.keyDown(field, { key: "e" }); // letztes Echo → aus der Höhle
    expect(screen.queryByText(/Am Höhleneingang/)).toBeNull();
  });

  it("Kontrastschalter helle Höhle ist vorhanden und umschaltbar", () => {
    renderCave(["d", "e"]);
    const toggle = screen.getByRole("button", { name: /Helle Höhle/ });
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: /Helle Höhle/ }).getAttribute("aria-pressed")).toBe("true");
  });

  it("zeigt die Echo-Höhlen-Kulisse (HUD/aria nennen die Zone)", () => {
    renderCave(["d"]);
    expect(screen.getAllByText(/Echo-Höhle/).length).toBeGreaterThan(0);
  });
});
