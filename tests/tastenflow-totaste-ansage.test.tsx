/**
 * ★★★★★ E4 (25.09.2026, Bauplan französischer Lehrgang §4.3 Punkt 4, §14 E4):
 * DIE ZWEI-SCHRITTE-ANSAGE FÜR EIN ZUSAMMENGESETZTES ZEICHEN.
 *
 * Zweimal Umschalt (dieselbe Abfrage wie überall sonst, siehe
 * `tastenflow-tasten-ansage.test.tsx`) sagt normalerweise Finger und
 * Heimattaste an. Für ein zusammengesetztes Zeichen (z. B. „ê") gibt es
 * WEDER einen Finger NOCH eine Heimattaste - `fingerGuide`/`fingerGuideEn`
 * fänden nichts (kein Layout kennt „ê" als eigene Taste). Die Ansage nennt
 * stattdessen die Totaste UND den Grundbuchstaben: „accent circonflexe,
 * puis e" (fr) / „Zirkumflex, dann e" (de) / „circumflex, then e" (en).
 */
import { describe, expect, it, afterEach, vi } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";

vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(), playUnlockFanfare: vi.fn(), playKeySound: vi.fn(), playKeyTick: vi.fn(),
  playErrorSound: vi.fn(), playLineSound: vi.fn(), playSuccessSound: vi.fn(), playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

import { TypingSession } from "@/components/typing/TypingSession";
import { setLayout } from "@/lib/typing/layouts";

function aufbauen(zeile: string, layout: "fr" | "de" = "fr") {
  setLayout(layout);
  const ergebnis = render(
    <TypingSession
      items={[zeile]}
      contextId="test-totaste-ansage"
      unlocked={new Set([...zeile])}
      shiftLearned={false}
      stufe={1 as never}
      voiceEnabled={false}
      onRetry={() => {}}
    />,
  );
  const feld = ergebnis.container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]');
  const live = ergebnis.container.querySelector('[role="status"][aria-live="assertive"]');
  if (!feld || !live) throw new Error("Übungsfeld oder Live-Bereich nicht gefunden");
  return { feld, live };
}

/** Zweimal Umschalt kurz hintereinander - dieselbe Abfrage wie in TypingSession.tsx. */
async function doppelUmschalt(feld: HTMLTextAreaElement) {
  await act(async () => {
    fireEvent.keyDown(feld, { key: "Shift", shiftKey: true });
    fireEvent.keyDown(feld, { key: "Shift", shiftKey: true });
    await new Promise((f) => setTimeout(f, 50));
  });
}

afterEach(() => {
  cleanup();
  setLayout("de");
});

describe("Zwei-Schritte-Ansage für zusammengesetzte Zeichen", () => {
  it("ê als nächstes Ziel: die Ansage nennt Totaste UND Grundbuchstaben, nicht Finger/Heimattaste", async () => {
    const { feld, live } = aufbauen("ê");
    await doppelUmschalt(feld);
    expect(live.textContent).toMatch(/Zirkumflex, dann e/);
  });

  it("normales Zeichen (a): unverändert die gewöhnliche Finger-Ansage", async () => {
    const { feld, live } = aufbauen("a");
    await doppelUmschalt(feld);
    expect(live.textContent).not.toMatch(/Zirkumflex/);
    expect(live.textContent).toMatch(/Finger/);
  });

  it("deutsche Tastatur: kein Sonderfall, selbst mit ê in der Zeile", async () => {
    const { feld, live } = aufbauen("ê", "de");
    await doppelUmschalt(feld);
    expect(live.textContent).not.toMatch(/Zirkumflex, dann e/);
  });
});
