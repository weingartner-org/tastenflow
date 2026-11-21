/**
 * Polar-Expedition - ÜBERSPRINGEN NUR NACH ECHTEM VERSUCH (02.10.2026).
 *
 * Befund einer Lehrkraft aus einer echten Klasse: „Das Pinguinspiel hat ein Schüler
 * geschafft, indem er nur die Leertaste gedrückt hat." Ursache: Jede falsche Taste (auch
 * die Leertaste) kostet ein Herz, nach zwei Zonen-Neustarts hüpft die Gnadenregel (Punkt 8)
 * von selbst weiter, und die Eingabetaste (Punkt 7) übersprang immer sofort. Reines
 * Leertaste-Drücken führte darum bis ins Ziel.
 *
 * Entscheidung Johannes: Überspringen „nur wenn es wirklich etwas versucht hat" -
 * mindestens 1 Treffer ODER mindestens 3 echte Fehlgriffe mit mindestens 2 verschiedenen
 * Tasten an DIESER Station. Leertaste, Enter, Zeitablauf zählen nicht.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { masteryFor, type FloeCourse, type LetterStat } from "../src/lib/typing";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";
import {
  wirklichVersucht,
  zaehltAlsEchterFehlgriff,
  type StationsVersuch,
} from "../src/components/typing/expedition/useExpedition";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const mastery = masteryFor("normal");
const LETTERS: Record<string, LetterStat> = {
  f: { hits: 20, misses: 0, sumMs: 0, timed: 0, recent: [600, 600, 600] },
  j: { hits: 20, misses: 0, sumMs: 0, timed: 0, recent: [600, 600, 600] },
  d: { hits: 20, misses: 0, sumMs: 0, timed: 0, recent: [600, 600, 600] },
};

const WATER = (units: string[]): FloeCourse => ({ stages: [{ kind: "water", units }] });
const SLIDE = (units: string[]): FloeCourse => ({ stages: [{ kind: "slide", units }] });

function renderZone(course: FloeCourse, onFinished?: (r: { clean: boolean; flawless: boolean; fish: number }) => void) {
  render(
    <ExpeditionStage
      open
      onClose={vi.fn()}
      course={course}
      free
      isAdult={false}
      noTimePressure={false}
      letters={LETTERS}
      mastery={mastery}
      onWin={vi.fn()}
      onFinished={onFinished}
    />,
  );
  return screen.getByRole("application");
}

const hearts = () => [...document.body.querySelectorAll(".px-hud__heart")].filter((h) => h.textContent === "❤️").length;
const statusText = () => document.body.querySelector(".px-status")?.textContent ?? "";
const ansageText = () => document.body.querySelector('[role="status"]')?.textContent ?? "";
const taste = (field: HTMLElement, key: string) => act(() => void fireEvent.keyDown(field, { key }));
const warte = (ms: number) => act(() => void vi.advanceTimersByTime(ms));

/** Der Hinweis „Probier es zuerst selbst" steht 1,6 s in der Statuszeile - dann zeigt sie wieder die Station. */
const ort = () => {
  warte(2000);
  return statusText();
};

/** Ein Anlauf, der beide Herzen kostet, dann die Rücksprung-Pause. */
function pleite(field: HTMLElement, tasten: [string, string]) {
  taste(field, tasten[0]);
  taste(field, tasten[1]);
  warte(2000);
}

describe("Reine Funktionen: was zählt als echter Versuch", () => {
  const v = (treffer: number, fehlgriffe: number, tasten: string[]): StationsVersuch => ({
    treffer,
    fehlgriffe,
    tasten: new Set(tasten),
  });

  it("Leertaste, Enter, Tab, Umschalt, Pfeile zählen nicht - Buchstaben schon", () => {
    expect(zaehltAlsEchterFehlgriff(" ", "f")).toBe(false);
    expect(zaehltAlsEchterFehlgriff("Enter", "f")).toBe(false);
    expect(zaehltAlsEchterFehlgriff("Tab", "f")).toBe(false);
    expect(zaehltAlsEchterFehlgriff("Shift", "f")).toBe(false);
    expect(zaehltAlsEchterFehlgriff("ArrowLeft", "f")).toBe(false);
    expect(zaehltAlsEchterFehlgriff("x", "f")).toBe(true);
  });

  it("die Leertaste zählt, wenn sie gerade gesucht ist", () => {
    expect(zaehltAlsEchterFehlgriff(" ", " ")).toBe(true);
    expect(zaehltAlsEchterFehlgriff(" ", "a b")).toBe(true);
  });

  it("wirklich versucht: ein Treffer ODER drei Fehlgriffe mit zwei verschiedenen Tasten", () => {
    expect(wirklichVersucht(undefined)).toBe(false);
    expect(wirklichVersucht(v(0, 0, []))).toBe(false);
    expect(wirklichVersucht(v(1, 0, []))).toBe(true);
    expect(wirklichVersucht(v(0, 2, ["x", "y"]))).toBe(false); // zu wenige
    expect(wirklichVersucht(v(0, 9, ["x"]))).toBe(false); // nur EINE Taste (Spammen)
    expect(wirklichVersucht(v(0, 3, ["x", "y"]))).toBe(true);
  });
});

describe("Der Fehler: nur die Leertaste führt nicht mehr ins Ziel", () => {
  it("Wasser: Leertaste-Spammen kommt über die erste Scholle nie hinaus (auch nicht nach vielen Neustarts)", () => {
    vi.useFakeTimers();
    const done = vi.fn();
    const field = renderZone(WATER(["f", "j"]), done);
    for (let i = 0; i < 12; i++) pleite(field, [" ", " "]);
    expect(statusText()).toMatch(/Am Ufer/); // nie bei Scholle 1 angekommen
    expect(done).not.toHaveBeenCalled(); // das Ziel ist nie erreicht
    expect(hearts()).toBe(2);
  });

  it("Wasser: Leertaste plus EINE falsche Taste (Spammen) genügt auch nicht", () => {
    vi.useFakeTimers();
    const done = vi.fn();
    const field = renderZone(WATER(["f", "j"]), done);
    for (let i = 0; i < 12; i++) pleite(field, [" ", "x"]);
    expect(statusText()).toMatch(/Am Ufer/);
    expect(done).not.toHaveBeenCalled();
  });

  it("Bauchrutsche: Leertaste-Drücken (und Verpassen) kommt nie ins Ziel", () => {
    vi.useFakeTimers();
    const done = vi.fn();
    const field = renderZone(SLIDE(["f", "j"]), done);
    for (let i = 0; i < 40; i++) {
      taste(field, " ");
      warte(1500);
    }
    expect(done).not.toHaveBeenCalled();
    expect(statusText()).not.toMatch(/von 2/); // nie auf einer späteren Station
  });

  it("Enter ohne Versuch überspringt nicht: freundlicher Hinweis, kein Herzabzug", () => {
    vi.useFakeTimers();
    const field = renderZone(WATER(["f", "j", "d"]));
    taste(field, "Enter");
    expect(statusText()).toMatch(/selbst/); // sichtbar für Kinder ohne Ton
    expect(ansageText()).toMatch(/selbst/); // und für Screenreader/Braille
    expect(ansageText().toLowerCase()).not.toMatch(/falsch|nicht geschafft|versagt/);
    expect(hearts()).toBe(2); // nie etwas gegen das Kind
    expect(ort()).toMatch(/Am Ufer/); // nicht übersprungen
  });

  it("Enter nach reinen Leertasten überspringt auch nicht", () => {
    vi.useFakeTimers();
    const field = renderZone(WATER(["f", "j", "d"]));
    taste(field, " ");
    taste(field, " "); // Neustart
    warte(2000);
    for (let i = 0; i < 5; i++) taste(field, "Enter");
    expect(ort()).toMatch(/Am Ufer/);
  });
});

describe("Ein Kind, das sich wirklich müht, kommt weiter wie bisher", () => {
  it("echte Fehlgriffe mit zwei Tasten: nach zwei Neustarts springt die Gnadenregel", () => {
    vi.useFakeTimers();
    const field = renderZone(WATER(["f", "j"]));
    pleite(field, ["x", "y"]);
    expect(statusText()).toMatch(/Am Ufer/);
    pleite(field, ["x", "y"]);
    expect(statusText()).toMatch(/Am Ufer/);
    taste(field, "x");
    taste(field, "y"); // 3. Pleite an derselben Station - der Zähler hat die Neustarts überlebt
    expect(hearts()).toBe(2);
    expect(statusText()).toMatch(/Scholle 1 von 2/);
    expect(statusText()).not.toMatch(/Am Ufer/);
  });

  it("nur EINE falsche Taste immer wieder (Spammen) löst die Gnadenregel nicht aus", () => {
    vi.useFakeTimers();
    const field = renderZone(WATER(["f", "j"]));
    for (let i = 0; i < 6; i++) pleite(field, ["x", "x"]);
    expect(statusText()).toMatch(/Am Ufer/);
  });

  it("ein Treffer an der Station genügt: Enter überspringt", () => {
    const field = renderZone(WATER(["fj", "d"]));
    taste(field, "f"); // richtige erste Taste der Folge „fj"
    taste(field, "Enter");
    expect(statusText()).toMatch(/Scholle 1 von 2/);
    expect(hearts()).toBe(2);
  });

  it("drei echte Fehlgriffe mit zwei Tasten (über einen Neustart hinweg): Enter überspringt", () => {
    vi.useFakeTimers();
    const field = renderZone(WATER(["f", "j"]));
    pleite(field, ["x", "y"]);
    taste(field, "Enter"); // erst 2 Fehlgriffe - noch nicht
    expect(ort()).toMatch(/Am Ufer/);
    taste(field, "x"); // der dritte
    taste(field, "Enter");
    expect(statusText()).toMatch(/Scholle 1 von 2/);
  });

  it("Enter nach drei Fehlgriffen mit nur einer Taste überspringt nicht", () => {
    vi.useFakeTimers();
    const field = renderZone(WATER(["f", "j"]));
    pleite(field, ["x", "x"]);
    taste(field, "x");
    taste(field, "Enter");
    expect(ort()).toMatch(/Am Ufer/);
  });
});

describe("Leertaste als gesuchte Taste ist ein ganz normaler Versuch", () => {
  it("steht die Leertaste auf der Scholle, ist sie ein Treffer und bringt weiter", () => {
    const field = renderZone(WATER([" ", "j"]));
    taste(field, " ");
    expect(statusText()).toMatch(/Scholle 1 von 2/);
  });

  it("Treffer mit der Leertaste in einer Folge zählt als Versuch für Enter", () => {
    const field = renderZone(WATER([" j", "d"]));
    taste(field, " "); // erste Taste der Folge „ j" - gesucht, also Treffer
    taste(field, "Enter");
    expect(statusText()).toMatch(/Scholle 1 von 2/);
  });
});
