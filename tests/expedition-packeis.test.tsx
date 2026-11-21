/**
 * Polar-Expedition — Packeis spielbar (E2). Prüft das Weltlayout (packeisLayout)
 * und den Spielverlauf über die Bühne (useExpedition): Springen bei richtiger
 * Taste, kein Fortschritt bei falscher, Tor-Freischaltung, Zeitdruck an/aus und
 * die Barrierefreiheits-Kontrakte (Alt-Kürzel durch, Escape schließt).
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { courseSpots, type FloeCourse } from "../src/lib/typing";
import {
  PACKEIS_GAP,
  PACKEIS_SHORE_X,
  packeisLayout,
} from "../src/components/typing/expedition/scenes/PackeisScene";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const WATER = (units: string[]): FloeCourse => ({ stages: [{ kind: "water", units }] });

describe("packeisLayout — Schollen in der Welt", () => {
  it("setzt das Ufer links und jede Scholle im festen Abstand", () => {
    const { pts, worldW } = packeisLayout(courseSpots(WATER(["f", "j"])));
    // spots: Ufer, f, j, Ziel
    expect(pts[0].x).toBe(PACKEIS_SHORE_X);
    expect(pts[1].x).toBe(PACKEIS_SHORE_X + PACKEIS_GAP);
    expect(pts[2].x).toBe(PACKEIS_SHORE_X + 2 * PACKEIS_GAP);
    expect(worldW).toBeGreaterThan(pts[pts.length - 1].x);
  });
});

function renderGame(over: Partial<React.ComponentProps<typeof ExpeditionStage>> = {}) {
  const onWin = vi.fn();
  const onFinished = vi.fn();
  const onClose = vi.fn();
  render(
    <ExpeditionStage
      open
      onClose={onClose}
      course={WATER(["f", "j", "d"])}
      isAdult={false}
      noTimePressure
      letters={{}}
      onWin={onWin}
      onFinished={onFinished}
      {...over}
    />,
  );
  return { onWin, onFinished, onClose, field: screen.getByRole("application") };
}

describe("Packeis — Spielverlauf", () => {
  it("springt bei der richtigen Taste zur nächsten Scholle, bei falscher nicht", () => {
    const { field } = renderGame();
    expect(screen.getByText(/Am Ufer/)).toBeTruthy();
    fireEvent.keyDown(field, { key: "x" }); // falsch → bleibt am Ufer
    expect(screen.getByText(/Am Ufer/)).toBeTruthy();
    fireEvent.keyDown(field, { key: "f" }); // richtig → Scholle 1
    expect(screen.getByText(/Scholle 1 von 3/)).toBeTruthy();
    fireEvent.keyDown(field, { key: "j" });
    expect(screen.getByText(/Scholle 2 von 3/)).toBeTruthy();
  });

  it("ignoriert Alt-Kürzel der Seite (kein Sprung, kein Fehler)", () => {
    const { field, onClose } = renderGame();
    fireEvent.keyDown(field, { key: "f", altKey: true }); // Alt-Kombi → durchgelassen
    expect(screen.getByText(/Am Ufer/)).toBeTruthy(); // kein Sprung
    expect(onClose).not.toHaveBeenCalled();
  });

  it("schließt mit Escape (Dialog-Root fängt es, gibt an den Öffner zurück)", () => {
    const { field, onClose } = renderGame();
    fireEvent.keyDown(field, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("schaltet nach der ganzen Überquerung die neue Taste frei (onWin)", () => {
    vi.useFakeTimers();
    const { onWin, field } = renderGame();
    fireEvent.keyDown(field, { key: "f" });
    fireEvent.keyDown(field, { key: "j" });
    fireEvent.keyDown(field, { key: "d" }); // letzte Scholle
    act(() => vi.advanceTimersByTime(1100)); // letzter Sprung ans Iglu + Schlussgleiten
    expect(onWin).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1600)); // Jubel-Pause → Freischaltung
    expect(onWin).toHaveBeenCalledTimes(1);
  });
});

describe("Packeis — Zeitdruck (adaptiv vs. aus)", () => {
  it("zeigt OHNE Zeitdruck keinen Countdown-Balken", () => {
    const { field } = renderGame({ noTimePressure: true });
    fireEvent.keyDown(field, { key: "f" }); // auf Scholle 1
    expect(document.querySelector(".px-timer")).toBeNull();
  });

  it("zeigt MIT Zeitdruck einen Countdown-Balken auf einer Scholle", () => {
    const { field } = renderGame({
      noTimePressure: false,
      letters: { j: { hits: 3, misses: 0, sumMs: 1200, timed: 3, recent: [400, 400, 400] } },
    });
    fireEvent.keyDown(field, { key: "f" }); // auf Scholle 1, Ziel j → Timer läuft
    expect(document.querySelector(".px-timer")).not.toBeNull();
  });

  it("lässt die Scholle nach Ablauf des Zeitfensters versinken", () => {
    vi.useFakeTimers();
    const { field } = renderGame({
      course: WATER(["f", "j"]),
      noTimePressure: false,
      letters: { j: { hits: 2, misses: 0, sumMs: 800, timed: 2, recent: [400, 400] } },
    });
    fireEvent.keyDown(field, { key: "f" }); // Scholle 1, Ziel j
    expect(screen.getByText(/Scholle 1 von 2/)).toBeTruthy();
    act(() => vi.advanceTimersByTime(3000)); // Fenster (≥2500 ms) läuft ab → platsch
    expect(screen.getAllByText(/Platsch|Versunken/i).length).toBeGreaterThan(0);
  });
});
