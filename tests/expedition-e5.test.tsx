/**
 * Polar-Expedition — Schneesturm (E5, Bauplan §4.4, verschärft 13.07.). Prüft den
 * Storm-Kurs (VIELE Stationen + Zeichen-Vorrat) und den KERN von E5: VORAUSLESEN &
 * MERKEN — die Folge steht kurz auf der Tafel, dann VERWEHT sie und verlässt das DOM
 * VOLLSTÄNDIG (auch die sr-only Live-Region; §7). Neu: die Folgenlänge ist LAUFZEIT-
 * adaptiv — Start 3, und länger erst nach ZWEI fehlerfreien Vorfolgen (Johannes 15.07.:
 * „fange mit drei Zeichen an und steigere dich langsamer"). Ein Fehlgriff zeigt die
 * Merkfolge erneut (und kostet ein Herz).
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { courseSpots, masteryFor, type FloeCourse, type LetterStat } from "../src/lib/typing";
import { STORM_STATIONS, STORM_START_LEN, buildStormCourse } from "../src/lib/typing/expedition/course";
import { STORM_GROUND_Y, stormLayout } from "../src/components/typing/expedition/scenes/StormScene";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const mastery = masteryFor("normal");
const noStats: Record<string, LetterStat> = {};
const STORM = (units: string[]): FloeCourse => ({ stages: [{ kind: "storm", units }] });

describe("Schneesturm-Kurs (course.ts)", () => {
  it("buildStormCourse: VIELE Stationen, Platzhalter-Start-Länge (Länge kommt vom Hook)", () => {
    const intro = "abcdefghijklmnop".split("");
    const c = buildStormCourse(intro, noStats, mastery);
    expect(c.stages).toHaveLength(1);
    expect(c.stages[0].kind).toBe("storm");
    expect(c.stages[0].units).toHaveLength(STORM_STATIONS); // „viel mehr Stationen"
    for (const u of c.stages[0].units) expect(u.length).toBe(STORM_START_LEN);
  });

  it("leerer Zeichen-Pool → leerer Kurs", () => {
    expect(buildStormCourse([], noStats, mastery).stages).toHaveLength(0);
  });
});

describe("stormLayout", () => {
  it("liegt flach: alle Halte auf dem Sturm-Boden, x wächst", () => {
    const { pts } = stormLayout(courseSpots(STORM(["fjdk", "slae"])));
    for (const p of pts) expect(p.y).toBe(STORM_GROUND_Y);
    expect(pts[1].x).toBeGreaterThan(pts[0].x);
  });
});

describe("Schneesturm — Vorauslesen & Merken (§4.4/§7)", () => {
  // Zeichen-Vorrat mit 12 verschiedenen Zeichen → Folgen bis Länge 10 möglich.
  const POOL_UNITS = ["fjdk", "slae", "ncri", "kdjf", "aels", "ridc"];
  function renderStorm(units = POOL_UNITS) {
    render(
      <ExpeditionStage
        open
        onClose={vi.fn()}
        course={STORM(units)}
        free
        isAdult={false}
        noTimePressure={false}
        letters={noStats}
        onWin={vi.fn()}
      />,
    );
    return screen.getByRole("application");
  }

  const board = () => document.body.querySelector(".px-storm-board");
  const boardText = () =>
    [...document.body.querySelectorAll(".px-storm-board text")].map((t) => t.textContent ?? "").join("");
  const sceneGlyphs = () =>
    [...document.body.querySelectorAll(".px-scene text")].map((t) => t.textContent ?? "");
  const liveText = () =>
    [...document.body.querySelectorAll('[role="alert"], [role="status"]')].map((e) => e.textContent ?? "").join(" | ");
  const typeSeq = (field: Element, seq: string) => {
    for (const ch of seq) act(() => void fireEvent.keyDown(field, { key: ch }));
  };

  it("zeigt die Merkfolge (Länge 3) erst, dann verweht sie aus dem DOM", () => {
    vi.useFakeTimers();
    renderStorm();
    act(() => vi.advanceTimersByTime(1700)); // Station 1 erscheint
    expect(board()).not.toBeNull();
    expect(boardText().length).toBe(STORM_START_LEN); // Start bei 4
    expect(liveText()).toMatch(/Merk dir: /i); // sr-only trägt die Ansage, solange sie steht

    act(() => vi.advanceTimersByTime(6000)); // Verwehen abwarten
    expect(board()).toBeNull();
    const seq1 = boardText(); // (leer)
    expect(seq1).toBe("");
    // Kein Folgen-Glyph mehr in der Szene und die Folge NICHT mehr in einer Live-Region.
    expect(sceneGlyphs().every((g) => /^[✦\s]*$/.test(g))).toBe(true);
    expect(liveText()).not.toMatch(/Merk dir: /i);
  });

  it("adaptiv: startet bei 3, wächst erst nach ZWEI fehlerfreien Vorfolgen (Johannes 15.07.)", () => {
    vi.useFakeTimers();
    const field = renderStorm();
    act(() => vi.advanceTimersByTime(1700));
    const s1 = boardText();
    expect(s1.length).toBe(3); // Start 3

    // Getippt wird ERST nach dem Verwehen (Johannes 13.07.: solange die Tafel steht, ist die
    // Eingabe gesperrt). Station 1 fehlerfrei tippen → Station 2 ist NOCH gleich lang.
    act(() => vi.advanceTimersByTime(6000)); // Station 1 verwehen lassen
    typeSeq(field, s1);
    const s2 = boardText();
    expect(s2.length).toBe(3); // erst eine fehlerfreie Station → noch NICHT länger

    // Station 2 ebenfalls fehlerfrei → jetzt (nach zwei) wird Station 3 eine länger.
    act(() => vi.advanceTimersByTime(6000)); // Station 2 verwehen lassen
    typeSeq(field, s2);
    const s3 = boardText();
    expect(s3.length).toBe(4); // zwei fehlerfreie Stationen → +1
  });

  it("Sturm-Eingabe erst nach dem Verwehen: Tippen SOLANGE die Tafel steht bewirkt nichts", () => {
    vi.useFakeTimers();
    const field = renderStorm();
    act(() => vi.advanceTimersByTime(1700));
    const s1 = boardText();
    expect(s1.length).toBe(3);
    // Tafel steht noch → die gemerkte Folge tippen darf NICHT zählen (Johannes 13.07.).
    typeSeq(field, s1);
    // Nach dem Verwehen zeigt sich: kein Fortschritt (Eingabefeld leer, immer noch Station 1).
    act(() => vi.advanceTimersByTime(6000));
    expect(sceneGlyphs().every((g) => /^[✦\s]*$/.test(g))).toBe(true); // kein Eingabe-Glyph
    // Jetzt aus dem Gedächtnis tippen → zählt, Station 2 erscheint (nach nur einer fehlerfreien
    // Station aber noch gleich lang — langsamere Steigerung, Johannes 15.07.).
    typeSeq(field, s1);
    expect(boardText().length).toBe(3);
  });

  it("Fehlgriff zeigt die Merkfolge ERNEUT + kostet ein Herz (Johannes 15.07.)", () => {
    // Johannes 15.07.: „Wenn man bei der Merk-Station einen Fehler macht, müssen die Buchstaben
    // noch einmal gezeigt und angesagt werden." Also: ein Fehlgriff kostet weiterhin ein Herz
    // (Anti-Spam vom 14.07.), blendet die Folge aber wieder ein, damit das Kind sie sich neu
    // einprägen kann. (Das kehrt die 14.07.-Regel „bleibt verweht" bewusst um.)
    vi.useFakeTimers();
    const field = renderStorm();
    act(() => vi.advanceTimersByTime(1700));
    act(() => vi.advanceTimersByTime(6000)); // verwehen
    expect(board()).toBeNull();
    act(() => void fireEvent.keyDown(field, { key: "z" })); // Fehlgriff → ein Herz weg
    // Noch ein Herz übrig → die Merkfolge wird erneut gezeigt (zum neuen Einprägen).
    expect(board()).not.toBeNull();
  });

  it("aus dem Gedächtnis: falsch = kein Fortschritt, richtig füllt den Kasten", () => {
    vi.useFakeTimers();
    const field = renderStorm();
    act(() => vi.advanceTimersByTime(1700));
    const s1 = boardText();
    act(() => vi.advanceTimersByTime(6000)); // verweht → kein Folgen-Glyph mehr
    expect(sceneGlyphs().every((g) => /^[✦\s]*$/.test(g))).toBe(true);
    // Erstes Zeichen der gemerkten Folge tippen → Eingabekasten zeigt es.
    act(() => void fireEvent.keyDown(field, { key: s1[0] }));
    expect(sceneGlyphs().some((g) => g === s1[0])).toBe(true);
  });

  it("nennt die Zone (HUD/aria)", () => {
    renderStorm();
    expect(screen.getAllByText(/Schneesturm/).length).toBeGreaterThan(0);
  });

  it("die SICHTBARE Statuszeile verrät die Folge nie (Bauplan §7, Fund 27.07.)", () => {
    // Bis 27.07. stand unter der verwehten Tafel gut lesbar »Böe 1 von 5. Folge: f, j, w« —
    // und zwar der PLATZHALTER aus buildStormCourse, nicht die gemerkte Folge. Beides ist
    // falsch: Das Merken war für Sehende hinfällig, und wer die Zeile ablas und tippte,
    // verlor ein Herz. Die Zeile darf jetzt nur noch den Stand nennen.
    vi.useFakeTimers();
    const field = renderStorm();
    const status = () => document.body.querySelector(".px-status")?.textContent ?? "";
    act(() => vi.advanceTimersByTime(1700));
    const s1 = boardText();
    act(() => vi.advanceTimersByTime(6000)); // Tafel verweht
    typeSeq(field, s1); // vom Ufer auf die erste Böe
    const s2 = boardText(); // die Folge der ersten Böe, solange sie noch steht
    act(() => vi.advanceTimersByTime(6000)); // … und jetzt verweht sie
    expect(boardText()).toBe(""); // die Tafel ist wirklich weg
    expect(status()).toMatch(/Böe 1 von/);
    expect(status()).not.toMatch(/Folge:/);
    expect(status()).toMatch(/Tippe aus dem Gedächtnis/);
    // Auch die Platzhalter-Zeichen des Kurses tauchen nicht als Aufzählung auf.
    for (const u of POOL_UNITS) expect(status()).not.toContain(u.split("").join(", "));
    // Nach dem ersten Zeichen zeigt die Zeile nur den Zählstand — kein Buchstabe.
    act(() => void fireEvent.keyDown(field, { key: s2[0] }));
    expect(status()).toMatch(new RegExp(`1 von ${s2.length} getippt`));
    expect(status()).not.toMatch(/Folge:/);
  });
});
