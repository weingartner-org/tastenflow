/**
 * ★★★★ W2a (28.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG F2): DAS
 * ERKLÄR-FENSTER TRÄGT SEINEN TEXT ALS BESCHREIBUNG - UND SPRICHT NICHT
 * SELBST, WENN „VORLESEN" AUS IST.
 *
 * Gemessen mit NVDA 2026.2 (Windows 11, Edge 154): Das Fenster „Presque !"
 * wurde als „Presque ! Dialogfeld - Compris Schalter" gelesen, der Text nicht;
 * die App sprach ihn dafür mit eigener Stimme, obwohl „Lecture à voix haute"
 * aus war - zwei Stimmen. Jetzt:
 *  · `aria-describedby` am Dialog zeigt auf die Absätze,
 *  · die eigene Stimme geht über `speakUi` (achtet „Vorlesen"), nie über
 *    `speakUiAlways`,
 *  · nach dem Schliessen steht der Fokus wieder im Übungsfeld.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(), playUnlockFanfare: vi.fn(), playKeySound: vi.fn(), playKeyTick: vi.fn(),
  playErrorSound: vi.fn(), playLineSound: vi.fn(), playSuccessSound: vi.fn(), playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));
vi.mock("@/lib/typing/voice", async () => {
  const echt = await vi.importActual<typeof import("@/lib/typing/voice")>("@/lib/typing/voice");
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn() };
});

import { Merkfenster } from "@/components/typing/Merkfenster";
import { TypingSession } from "@/components/typing/TypingSession";
import { SHIFT_UNIT } from "@/lib/typing";
import { speakUi, speakUiAlways } from "@/lib/typing/voice";
import { grossschreibungFenster, umschaltFenster } from "@/lib/typing/merkfensterTexte";

beforeEach(() => {
  try {
    localStorage.clear();
  } catch {
    /* kein localStorage */
  }
  vi.mocked(speakUi).mockClear();
  vi.mocked(speakUiAlways).mockClear();
});
afterEach(() => cleanup());

describe("F2 - der Text hängt am Dialog", () => {
  it.each([
    ["Umschalt-Fenster", umschaltFenster("großes A", "rechts", "kind")],
    ["Grossschreibung", grossschreibungFenster("kind")],
  ])("%s: aria-describedby zeigt auf ALLE Absätze", (_name, fenster) => {
    render(<Merkfenster {...fenster} mitHaken onSchliessen={() => {}} />);
    const dialog = screen.getByRole("dialog");
    const id = dialog.getAttribute("aria-describedby");
    expect(id, "ohne Beschreibung liest NVDA nur Titel und Schalter").toBeTruthy();
    const beschreibung = document.getElementById(id!);
    expect(beschreibung?.textContent).toBe(fenster.absaetze.join(""));
    // Der Titel bleibt der Name (Modal: aria-labelledby).
    expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
  });

  it("die eigene Stimme geht über speakUi (achtet „Vorlesen\"), nie über speakUiAlways", () => {
    const fenster = umschaltFenster("großes A", "rechts", "kind");
    render(<Merkfenster {...fenster} mitHaken onSchliessen={() => {}} />);
    expect(vi.mocked(speakUiAlways)).not.toHaveBeenCalled();
    expect(vi.mocked(speakUi)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(speakUi).mock.calls[0][0]).toBe(`${fenster.titel} ${fenster.absaetze.join(" ")}`);
  });
});

describe("F2 - nach dem Schliessen steht der Fokus im Übungsfeld", () => {
  it.each(["Verstanden", "Escape"])("über %s", async (weg) => {
    const r = render(
      <TypingSession
        items={["Ab", "fertig"]}
        contextId="test-w2a-f2"
        unlocked={new Set([..."abcdefghijklmnopqrstuvwxyz ", SHIFT_UNIT])}
        shiftLearned
        stufe={1 as never}
        voiceEnabled={false}
        onRetry={() => {}}
      />,
    );
    const feld = r.container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]')!;
    feld.focus();
    await act(async () => {
      fireEvent.keyDown(feld, { key: "Shift", code: "ShiftLeft", location: 1, shiftKey: true });
      fireEvent.keyDown(feld, { key: "A", code: "KeyA", shiftKey: true });
    });
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
    await act(async () => {
      if (weg === "Escape") fireEvent.keyDown(document, { key: "Escape" });
      else fireEvent.click(screen.getByRole("button", { name: "Verstanden" }));
      await new Promise((f) => setTimeout(f, 30));
    });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(feld);
  });
});
