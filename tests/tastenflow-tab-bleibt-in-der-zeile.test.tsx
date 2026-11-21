/**
 * ★★★ Tab bleibt in der Übungszeile (25.09.2026).
 *
 * Johannes: „die Kinder landen immer wieder im Impressum, wie ist das
 * möglich". Im Browser nachgestellt: aus der Übungszeile führt Tab zu
 * „Tastatur ausblenden", dann „Datenschutz", dann „Impressum" - das nächste
 * Enter öffnet es. Entscheidung: Tab bleibt in der Zeile, wird nur gesagt,
 * zählt nicht als Fehler. Umschalt + Tab bleibt der Weg hinaus.
 *
 * Gegenprobe (ohne die Behebung nachgestellt): Tab ist dann nicht
 * `defaultPrevented`, der Browser zieht den Fokus weiter.
 */
import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const stimme = vi.hoisted(() => ({ ui: vi.fn() }));
vi.mock("@/lib/typing/voice", async (original) => ({
  ...(await original<typeof import("@/lib/typing/voice")>()),
  speakUi: stimme.ui,
}));
vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(), playUnlockFanfare: vi.fn(), playKeySound: vi.fn(), playKeyTick: vi.fn(),
  playErrorSound: vi.fn(), playLineSound: vi.fn(), playSuccessSound: vi.fn(), playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

import { TypingSession } from "@/components/typing/TypingSession";
import { FreieSchreibzeile } from "@/components/typing/FreieSchreibzeile";

function uebungszeile(onItemDone = vi.fn()) {
  const { container } = render(
    <TypingSession
      items={["ab", "ab"]}
      contextId="tab"
      unlocked={new Set(["a", "b"])}
      shiftLearned={false}
      stufe="teens"
      voiceEnabled
      onItemDone={onItemDone}
      onSessionDone={() => {}}
      onRetry={() => {}}
      lang="de"
    />,
  );
  return container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]')!;
}

describe("Übungszeile (TypingSession)", () => {
  it("Tab wird abgefangen und gesagt - kein Fehler, die Zeile wird fertig", async () => {
    const onItemDone = vi.fn();
    const feld = uebungszeile(onItemDone);
    let durch = true;
    await act(async () => {
      durch = fireEvent.keyDown(feld, { key: "Tab", code: "Tab" });
    });
    expect(durch).toBe(false); // preventDefault - der Fokus bleibt
    expect(stimme.ui.mock.calls.some((c) => c[0] === "Das ist Tab.")).toBe(true);
    for (const key of ["a", "b"]) {
      await act(async () => {
        fireEvent.keyDown(feld, { key });
      });
    }
    await act(async () => {
      await new Promise((r) => setTimeout(r, 900));
    });
    expect(onItemDone).toHaveBeenCalledTimes(1);
    expect(onItemDone.mock.calls[0][0]).toMatchObject({ errors: 0 });
  });

  it("Umschalt + Tab bleibt der Weg hinaus", async () => {
    const feld = uebungszeile();
    let durch = false;
    await act(async () => {
      durch = fireEvent.keyDown(feld, { key: "Tab", code: "Tab", shiftKey: true });
    });
    expect(durch).toBe(true);
  });
});

describe("freie Zeile der Tippchallenge (FreieSchreibzeile)", () => {
  it("Tab wird abgefangen und landet nicht im Getippten", async () => {
    const onZeileFertig = vi.fn();
    const { container } = render(
      <FreieSchreibzeile
        {...({
          items: ["ab", "zwei"],
          contextId: "tab-frei",
          stufe: "teens",
          voiceEnabled: false,
          zeilenEnde: true,
          onZeileFertig,
          onSessionDone: () => {},
          lang: "de",
        } as unknown as Parameters<typeof FreieSchreibzeile>[0])}
      />,
    );
    const feld = container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]')!;
    let durch = true;
    await act(async () => {
      durch = fireEvent.keyDown(feld, { key: "Tab", code: "Tab" });
    });
    expect(durch).toBe(false);
    for (const key of ["a", "b", "Enter"]) {
      await act(async () => {
        fireEvent.keyDown(feld, { key });
      });
    }
    expect(onZeileFertig.mock.calls[0][0].ist).toBe("ab");
  });
});
