/**
 * Schneerutsche (Pinguin-Spiel, „das Tor"): DIE ZWEITE UHR, DIE DEN RICHTIGEN TREFFER VERSCHLUCKT.
 *
 * Meldung einer Lehrerin (Zürich, Schweizer Tastatur, 29.10.2026): *„beim Pinguin-Spiel mit dem
 * Tor reagierte es immer an der gleichen Stelle nicht, obwohl der Buchstabe richtig und im
 * richtigen Moment getippt wurde, mehrmals probiert."*
 *
 * Nachgestellt (kein Raten): Auf der Rutsche laufen ZWEI Uhren gegeneinander.
 *   1. die Anflug-Uhr der Rutsche: der Buchstabe fliegt `Median × 2,4` (1,5 - 3,4 s) heran, das
 *      Tor geht 380 ms vor der Ziellinie auf;
 *   2. die STATIONS-Uhr der übrigen Zonen (`windowFor`): `Median × Polster`, und das Polster
 *      SINKT mit jeder geschafften Station von 2,2 auf 1,5. Die Rutsche hat dafür keine
 *      Spannung (`tension: null`), die Uhr lief aber trotzdem - unsichtbar - mit und kostete
 *      bei Ablauf ein Herz UND warf den Pinguin zum Anfang zurück.
 * Bei einer Taste mit Median ab ~0,9 s (also bei fast jedem Kind, das die Taste noch lernt)
 * läuft Uhr 2 ab, BEVOR das Tor aufgeht - ab einer bestimmten Stelle (wenn das Polster klein
 * genug geworden ist) ist die Taste nicht mehr rechtzeitig treffbar. Der Kurs ist deterministisch,
 * also scheitert es nach dem Rücksprung (Polster zurück auf 2,2) an GENAU derselben Stelle.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { masteryFor, type FloeCourse, type LetterStat } from "../src/lib/typing";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const mastery = masteryFor("normal");
const stat = (ms: number): LetterStat => ({ hits: 20, misses: 0, sumMs: 0, timed: 0, recent: [ms, ms, ms] });
/** „k" ist noch eine junge Taste: gemessen 1,1 s - Anflug 2640 ms, Tor ab ~2260 ms. */
const LETTERS: Record<string, LetterStat> = { k: stat(1100), f: stat(600) };

const SLIDE = (units: string[]): FloeCourse => ({ stages: [{ kind: "slide", units }] });
const hearts = () => [...document.body.querySelectorAll(".px-hud__heart")].filter((h) => h.textContent === "❤️").length;
const toroffen = () => !!document.body.querySelector(".px-slideGate--hot");
const timerBalken = () => !!document.body.querySelector(".px-timer");

/**
 * Ein Kind, das GENAU richtig spielt: es drückt jede Taste, sobald das Tor aufleuchtet, und
 * nicht früher. Liefert, bei welchem Buchstaben (0-basiert) zuerst ein Herz fehlte - oder null.
 */
function spieleRichtig(units: string[], maxMs = 120_000): { ersterVerlust: number | null; geschafft: number; ms: number } {
  const done = vi.fn();
  render(
    <ExpeditionStage
      open
      onClose={vi.fn()}
      course={SLIDE(units)}
      free
      isAdult={false}
      noTimePressure={false}
      letters={LETTERS}
      mastery={mastery}
      onWin={vi.fn()}
      onFinished={done}
    />,
  );
  const feld = screen.getByRole("application");
  let i = 0;
  let gedrueckt = -1;
  let ersterVerlust: number | null = null;
  let t = 0;
  for (; t < maxMs && !done.mock.calls.length; t += 50) {
    act(() => void vi.advanceTimersByTime(50));
    if (hearts() < 2 && ersterVerlust === null) ersterVerlust = i;
    if (toroffen() && gedrueckt !== i && i < units.length) {
      act(() => void fireEvent.keyDown(feld, { key: units[i] }));
      gedrueckt = i;
      // Hat der Druck gezählt? Dann steht der nächste Buchstabe an.
      // (Nach dem letzten Buchstaben steht kein „Schwung n von" mehr da, sondern das Ziel.)
      if (/Schwung (\d+) von/.test(document.body.querySelector(".px-status")?.textContent ?? "") || i === units.length - 1) i += 1;
    }
    if (ersterVerlust !== null) break;
  }
  return { ersterVerlust, geschafft: i, ms: t };
}

describe("Schneerutsche: eine richtige Taste im Tor darf nie an einer zweiten Uhr scheitern (Lehrerin Zürich, 29.10.2026)", () => {
  it("sechs Mal „k“, jedes Mal genau beim Aufleuchten des Tors gedrückt: kein Herz geht verloren", () => {
    vi.useFakeTimers();
    const r = spieleRichtig(["k", "k", "k", "k", "k", "k"]);
    // Vor der Behebung: das Herz fehlte beim 4. Buchstaben (Polster 1,9 × 1100 ms = 2090 ms < 2260 ms Tor-Beginn).
    expect(r.ersterVerlust, `erster Verlust bei Buchstabe ${r.ersterVerlust}, geschafft ${r.geschafft}`).toBeNull();
    expect(r.geschafft).toBe(6);
  });

  it("die Rutsche zeigt keinen Stations-Zeitbalken - ihre Uhr ist das Tor", () => {
    vi.useFakeTimers();
    render(
      <ExpeditionStage
        open
        onClose={vi.fn()}
        course={SLIDE(["k", "k", "k"])}
        free
        isAdult={false}
        noTimePressure={false}
        letters={LETTERS}
        mastery={mastery}
        onWin={vi.fn()}
      />,
    );
    const feld = screen.getByRole("application");
    act(() => void vi.advanceTimersByTime(2400));
    act(() => void fireEvent.keyDown(feld, { key: "k" })); // 1. Buchstabe: Station 1
    expect(screen.getByText(/Schwung 1 von 3/)).toBeTruthy();
    expect(timerBalken()).toBe(false);
  });
});

/**
 * Zweiter, kleinerer Weg (Code-Durchsicht, hier nachgestellt): Beginnt eine Ansage zu sprechen,
 * WÄHREND der Buchstabe schon im Tor ist (der Zielton ist längst erklungen), verwarf
 * `handleSlideKey` die richtige Taste mit „Noch nicht" - und zählte sie nirgends als Versuch,
 * sodass auch das Überspringen (Eingabetaste, nach zwei Neustarts) nie freigegeben wurde.
 */
describe("Schneerutsche: Stimme spricht, während der Buchstabe im Tor ist", () => {
  type Fake = { speaking: boolean; pending: boolean; paused: boolean; getVoices: () => never[]; cancel: () => void; speak: () => void; resume: () => void; pause: () => void; addEventListener: () => void; removeEventListener: () => void };
  const w = window as unknown as { speechSynthesis?: Fake };
  const vorher = w.speechSynthesis;
  function stimme(): Fake {
    const f: Fake = { speaking: false, pending: false, paused: false, getVoices: () => [], cancel() {}, speak() {}, resume() {}, pause() {}, addEventListener() {}, removeEventListener() {} };
    w.speechSynthesis = f;
    return f;
  }
  afterEach(() => {
    if (vorher === undefined) delete w.speechSynthesis;
    else w.speechSynthesis = vorher;
  });

  function zone(units: string[]) {
    render(
      <ExpeditionStage open onClose={vi.fn()} course={SLIDE(units)} free isAdult={false} noTimePressure={false} letters={LETTERS} mastery={mastery} onWin={vi.fn()} />,
    );
    return screen.getByRole("application");
  }

  it("die richtige Taste im Tor zählt, auch wenn gerade eine Ansage anfängt", () => {
    vi.useFakeTimers();
    const synth = stimme();
    const feld = zone(["f", "j"]);
    act(() => void vi.advanceTimersByTime(1300)); // f: Anflug 1500 ms, Tor offen (ab 1120 ms)
    expect(toroffen()).toBe(true);
    synth.speaking = true; // die Stimme setzt genau jetzt ein
    act(() => void fireEvent.keyDown(feld, { key: "f" }));
    expect(screen.getByText(/Schwung 1 von 2/)).toBeTruthy();
    expect(hearts()).toBe(2);
  });

  it("vor dem Tor bleibt es beim folgenlosen „Noch nicht“ - die richtige Taste zählt dabei als Versuch, damit Überspringen frei wird", () => {
    vi.useFakeTimers();
    const synth = stimme();
    const feld = zone(["f", "j"]);
    synth.speaking = true; // Ansage läuft, der Buchstabe ist noch nicht unterwegs
    act(() => void fireEvent.keyDown(feld, { key: "f" }));
    // Sichtbar in der Statuszeile (die Stimme spricht schon - sie wird nicht unterbrochen).
    expect(document.body.querySelector(".px-status")?.textContent ?? "").toMatch(/Noch nicht/);
    expect(hearts()).toBe(2);
    synth.speaking = false;
    // Enter: nach einem echten Versuch springt die Station weiter, statt „Probier es zuerst selbst".
    act(() => void fireEvent.keyDown(feld, { key: "Enter" }));
    act(() => void vi.advanceTimersByTime(2000)); // der Hinweis räumt sich ab, die Zeile zeigt wieder den Ort
    expect(document.body.querySelector(".px-status")?.textContent ?? "").toMatch(/Schwung 1 von 2/);
  });
});
