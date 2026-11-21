/**
 * Der Wochenziel-Ring im Trainer-Kopf — der SICHTBARE Gegenpart zur
 * Wochen-Rechnung in `wochenziel.ts` (Johannes 27.07.: „Die Zeitangabe und
 * der Spielzeitring für den Wochenplan stimmen nicht überein. Das ist
 * verwirrend!").
 *
 * ★★★ W4 (19.09.2026, Bauplan §„W4 Kind"): Aus der REIHE Ringe (ein Ring je
 * Übungseinheit) ist EIN Ring geworden - Minuten je Kalenderwoche, ohne
 * Einheiten. Die genauen Zahlen (25/60, geschafft, Nachholen, gesperrte
 * Stunde, beide Anrede-Register) stehen jetzt in
 * `tests/typing-wochenziel-kind.test.tsx`; hier bleibt nur, was diese Datei
 * seit 27.07. eigentlich beweist: Der Ring folgt der ÜBEZEIT-UHR, nicht nur
 * gespeicherten Ereignissen.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import {
  addPupil,
  createClass,
  notePracticeActivity,
  recordEvent,
  registerTeacher,
  resetPracticeClock,
  wochenzielAnsage,
  type TaskEvent,
  type TypingAccount,
} from "../src/lib/typing";
import { WeeklyGoalRings } from "../src/components/typing/WeeklyGoalRings";

afterEach(cleanup);

/** Feste Test-Uhr: Montag, 27.07.2026, 10:00 - für deterministische Übezeit. */
const TEST_MONTAG = new Date(2026, 6, 27, 10, 0, 0);
const IMMER_AB = "2000-W01";
const MIN = 60_000;

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(TEST_MONTAG);
  localStorage.clear();
  resetPracticeClock();
});

afterEach(() => vi.useRealTimers());

/** Ein Kind mit einem flachen Wochenziel von `minuten` Minuten pro Woche. */
function pupilWithGoal(minuten: number): TypingAccount {
  const t = registerTeacher("L", `l${Math.random()}@s.at`, "geheim1");
  if (!t.ok) throw new Error("Lehrkraft");
  const cls = createClass(t.value.id, "3b");
  if (!cls.ok) throw new Error("Klasse");
  const p = addPupil(cls.value.code, "Kind", "1234", "b");
  if (!p.ok) throw new Error("Kind");
  return { ...p.value, wochenzielVerlauf: [{ ab: IMMER_AB, minuten }] };
}

/** `minuten` Minuten reine Tippzeit HEUTE aufzeichnen, in Ein-Minuten-Zeilen. */
function practiceToday(id: string, minuten: number, startHour = 8): void {
  const day = new Date();
  day.setHours(startHour, 0, 0, 0);
  for (let i = 1; i <= minuten; i++) {
    const e: TaskEvent = {
      ts: day.getTime() + i * MIN,
      lesson: "adaptiv",
      chars: 40,
      errors: 0,
      ms: MIN,
      activeMs: MIN,
    };
    recordEvent(id, e);
  }
}

describe("Der Wochenziel-Ring folgt der Übezeit-Uhr", () => {
  it("ohne Übung: der Ring ist leer, kein Nachholen-Hinweis", async () => {
    const acc = pupilWithGoal(30);
    render(<WeeklyGoalRings account={acc} kompakt />);
    await screen.findByText("Wochenziel");
    expect(screen.getByText("0")).toBeTruthy();
    expect(screen.queryByText(/nachholen/)).toBeNull();
  });

  it("nur EIN Ring, egal wie gross das Wochenziel ist", async () => {
    const acc = pupilWithGoal(150);
    practiceToday(acc.id, 6);
    render(<WeeklyGoalRings account={acc} kompakt />);
    await screen.findByText("Wochenziel");
    await waitFor(() => expect(document.querySelectorAll("svg").length).toBe(1));
  });

  it("die LAUFENDE, noch nicht gespeicherte Zeile füllt den Ring schon mit (pendingPracticeMs)", async () => {
    const acc = pupilWithGoal(60);
    practiceToday(acc.id, 10); // 10 gespeicherte Minuten
    render(<WeeklyGoalRings account={acc} kompakt />);
    await screen.findByText("Wochenziel");
    expect(screen.getByText("10")).toBeTruthy();

    // Ein simulierter Anschlag JETZT hält die Übezeit-Uhr für eine
    // Pausentoleranz lang am Laufen, ohne dass eine Zeile gespeichert wird -
    // genau das, was `pendingPracticeMs()` dem Ring zusätzlich zuschlägt.
    notePracticeActivity(Date.now());
    vi.advanceTimersByTime(2000);
    await waitFor(() =>
      expect(wochenzielAnsage()).toMatch(/^Wochenziel: 10 von 60 Minuten\./),
    );
    // Die Sekunden-Anzeige selbst bleibt bei „10" (die zwei Sekunden runden
    // nicht auf eine ganze Minute) - der Beweis liegt in der ANSAGE, die bei
    // jedem Tick neu gerechnet wird und nicht erst beim Speichern.
    expect(screen.getByText("10")).toBeTruthy();
  });

  it("Wochenziel mit gespeicherten Ereignissen erreicht: voller Ring, Haken", async () => {
    const acc = pupilWithGoal(10);
    practiceToday(acc.id, 12);
    render(<WeeklyGoalRings account={acc} kompakt />);
    await screen.findByText("Wochenziel");
    expect(await screen.findByText("✓")).toBeTruthy();
    expect(screen.getByRole("img").getAttribute("aria-label")).toMatch(/geschafft/);
  });
});
