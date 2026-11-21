/**
 * WÄCHTER: Der Satz vom Zeilenanfang wird AUSGEREDET (Tippchallenge, 10.09.2026).
 *
 * Johannes: *„Sprachausgabe soll weitersprechen wenn schon getippt wird"* und
 * *„hat manchmal nicht den ganzen Satz gelesen, sondern nur das erste Wort"*.
 *
 * ── Der Befund ──────────────────────────────────────────────────────────────
 * Am Zeilenanfang liest die Stimme den ganzen Satz. Jede Ansage zum Anschlag
 * geht aber mit `"sofort"` - und `"sofort"` bricht ab, was gerade spricht.
 * Spätestens die Leertaste nach dem ersten Wort („Leertaste" wird immer
 * angesagt) würgte den Satz ab. Heraus kam: das erste Wort, dann Stille.
 *
 * ── Was gemessen wird ───────────────────────────────────────────────────────
 * Der AUFRUF der Stimme, nicht der Klang: jsdom hat keine Sprachausgabe. Ersetzt
 * sind nur die Sprech-Funktionen und die Frage „spricht sie noch?"; der Rest von
 * `voice.ts` (Lese-Plan, Einstellungen) ist echt.
 *
 * ⚠️ Jede Prüfung hat ihre Gegenprobe OHNE `satzAusreden` - sonst bliebe
 * unbewiesen, dass der Test das Abwürgen überhaupt sehen kann.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";

const stimme = vi.hoisted(() => ({ beschaeftigt: true }));

vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(),
  playUnlockFanfare: vi.fn(),
  playKeySound: vi.fn(),
  playKeyTick: vi.fn(),
  playErrorSound: vi.fn(),
  playLineSound: vi.fn(),
  playSuccessSound: vi.fn(),
  playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

vi.mock("@/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing/voice")>();
  return {
    ...echt,
    speakSequence: vi.fn(),
    speakChar: vi.fn(),
    speakUi: vi.fn(),
    sprachausgabeBeschaeftigt: () => stimme.beschaeftigt,
  };
});

import { TypingSession } from "@/components/typing/TypingSession";
import { speakChar, speakSequence } from "@/lib/typing/voice";

/** Klein und mit Punkt: So ist sie sicher ein Satz, ohne Umschalttaste. */
const ZEILE = "die katze schläft.";

function aufbauen(satzAusreden: boolean): HTMLElement {
  const r = render(
    <TypingSession
      items={[ZEILE]}
      contextId="test-satz-ausreden"
      unlocked={new Set([...ZEILE])}
      shiftLearned={false}
      stufe={1 as never}
      voiceEnabled
      satzAusreden={satzAusreden}
      onRetry={() => {}}
    />,
  );
  const feld = r.container.querySelector<HTMLElement>('[data-feld="tippen"]');
  if (!feld) throw new Error("Übungsfeld nicht gefunden");
  return feld;
}

async function tippe(feld: HTMLElement, tasten: string): Promise<void> {
  for (const taste of tasten) {
    await act(async () => {
      fireEvent.keyDown(feld, { key: taste });
      await new Promise((f) => setTimeout(f, 20));
    });
  }
}

/** Die Ansagen zum Anschlag - genau die, die abbrechen. */
const sofortAufrufe = () =>
  vi.mocked(speakSequence).mock.calls.filter(([, art]) => art === "sofort");

beforeEach(() => {
  vi.mocked(speakSequence).mockClear();
  vi.mocked(speakChar).mockClear();
  stimme.beschaeftigt = true;
});
afterEach(cleanup);

describe("★ Der Satz wird ausgeredet", () => {
  it("der Zeilenanfang liest den GANZEN Satz", () => {
    aufbauen(true);
    expect(vi.mocked(speakSequence).mock.calls[0]?.[0]).toContain(ZEILE);
  });

  it("Gegenprobe: OHNE satzAusreden würgt die Leertaste den Satz ab", async () => {
    const feld = aufbauen(false);
    await tippe(feld, "die");
    expect(sofortAufrufe().length).toBeGreaterThan(0);
  });

  it("MIT satzAusreden schweigt der Anschlag, solange der Satz spricht", async () => {
    const feld = aufbauen(true);
    await tippe(feld, "die");
    expect(sofortAufrufe()).toEqual([]);
  });

  it("ist der Satz fertig, wird wie gewohnt angesagt", async () => {
    const feld = aufbauen(true);
    stimme.beschaeftigt = false;
    await tippe(feld, "die");
    expect(sofortAufrufe().length).toBeGreaterThan(0);
  });
});

describe("★ Ein Fehlgriff würgt den Satz auch nicht ab - der Ton genügt", () => {
  it("Gegenprobe: ohne satzAusreden wird die richtige Taste gesprochen", async () => {
    const feld = aufbauen(false);
    await tippe(feld, "x");
    expect(speakChar).toHaveBeenCalled();
  });

  it("mit satzAusreden schweigt die Korrektur, solange der Satz spricht", async () => {
    const feld = aufbauen(true);
    await tippe(feld, "x");
    expect(speakChar).not.toHaveBeenCalled();
  });
});
