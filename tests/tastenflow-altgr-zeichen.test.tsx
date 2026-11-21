/**
 * ★★★★★ AltGr IST EIN ZEICHEN, KEIN KÜRZEL (23.09.2026).
 *
 * Windows meldet AltGr als Strg + Alt. Jede Schreibzeile warf bis heute alles
 * mit Strg oder Alt als „Kürzel der Seite" hinaus - `@ € { } [ ] | ~` (in den
 * Zeichensätzen „alles" und „Programmcode") waren damit unter Windows nicht
 * tippbar. Nachgestellt: die Zeile „a@b" wurde mit Strg + Alt + `@` nie
 * fertig. Gegenprobe: ein Alt-Kürzel (Alt + W) ist weiterhin KEIN Anschlag.
 */
import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TypingSession } from "@/components/typing/TypingSession";
import { FreieSchreibzeile } from "@/components/typing/FreieSchreibzeile";
import { istAltGr, istKuerzel, istZeichenAnschlag } from "@/lib/typing/zeichenTaste";

vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(), playUnlockFanfare: vi.fn(), playKeySound: vi.fn(), playKeyTick: vi.fn(),
  playErrorSound: vi.fn(), playLineSound: vi.fn(), playSuccessSound: vi.fn(), playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

const ALTGR = { ctrlKey: true, altKey: true };

describe("★★★★★ zeichenTaste - die Regel", () => {
  const e = (key: string, m: Partial<Record<"altKey" | "ctrlKey" | "metaKey", boolean>> = {}) => ({
    key, altKey: false, ctrlKey: false, metaKey: false, ...m,
  });
  it("Windows-AltGr (Strg + Alt) mit Sonderzeichen ist ein Zeichen", () => {
    for (const z of ["@", "€", "{", "}", "[", "]", "|", "~", "\\", "²"]) {
      expect(istAltGr(e(z, ALTGR))).toBe(true);
      expect(istZeichenAnschlag(e(z, ALTGR))).toBe(true);
      expect(istKuerzel(e(z, ALTGR))).toBe(false);
    }
  });
  it("getModifierState('AltGraph') zählt, auch ohne Strg", () => {
    expect(istAltGr({ ...e("@", { altKey: true }), getModifierState: (t) => t === "AltGraph" })).toBe(true);
  });
  it("★ gemessen (Windows 11, Edge 154 und Chrome 154, 02.10.2026): AltGr + Buchstabe kommt OHNE Strg und OHNE Alt, nur mit AltGraph", () => {
    // Der Buchstaben-keydown trägt ctrlKey = false, altKey = false und getModifierState("AltGraph") = true,
    // key = das fertige Zeichen (BEFUND-2026-10-02-WINDOWS-MESSUNG §3.1). Nur der Control-keydown davor hat
    // ctrlKey = true (key "Control") und der AltGraph-keydown ctrlKey/altKey = false - beide sind keine Zeichen.
    const gemessen = (key: string) => ({ ...e(key), getModifierState: (t: "AltGraph") => t === "AltGraph" });
    for (const z of ["ą", "ć", "ę", "ł", "ó", "ś", "ź", "ż", "€", "@"]) {
      expect(istZeichenAnschlag(gemessen(z))).toBe(true);
      expect(istKuerzel(gemessen(z))).toBe(false);
    }
    expect(istZeichenAnschlag(e("Control", { ctrlKey: true }))).toBe(false);
    expect(istZeichenAnschlag(e("AltGraph"))).toBe(false);
  });
  it("Gegenprobe: Alt + W, Strg + C, Strg + Alt + Buchstabe, Befehl + L sind Kürzel", () => {
    expect(istKuerzel(e("w", { altKey: true }))).toBe(true);
    expect(istKuerzel(e("c", { ctrlKey: true }))).toBe(true);
    expect(istKuerzel(e("h", ALTGR))).toBe(true);
    expect(istKuerzel(e("l", { metaKey: true }))).toBe(true);
    expect(istZeichenAnschlag(e("w", { altKey: true }))).toBe(false);
  });
  it("ein gewöhnliches Zeichen ist ein Anschlag, Tab/Shift nicht", () => {
    expect(istZeichenAnschlag(e("a"))).toBe(true);
    expect(istZeichenAnschlag(e("Tab"))).toBe(false);
    expect(istZeichenAnschlag(e("Shift"))).toBe(false);
  });
});

describe("★★★★★ strenge Zeile (TypingSession): „a@b€“ mit AltGr", () => {
  it("wird fertig - und Alt + W dazwischen ist kein Fehler", async () => {
    const onItemDone = vi.fn();
    const { container } = render(
      <TypingSession
        items={["a@b€", "ab"]}
        contextId="altgr"
        unlocked={new Set(["a", "b", "@", "€"])}
        shiftLearned
        stufe="teens"
        voiceEnabled={false}
        onItemDone={onItemDone}
        onSessionDone={() => {}}
        onRetry={() => {}}
        lang="de"
      />,
    );
    const feld = container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]')!;
    const taste = async (key: string, m = {}) => {
      await act(async () => {
        fireEvent.keyDown(feld, { key, ...m });
      });
    };
    await taste("a");
    await taste("w", { altKey: true }); // Kürzel - darf nicht zählen
    await taste("@", ALTGR);
    await taste("b");
    await taste("€", ALTGR);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 900));
    });
    expect(onItemDone).toHaveBeenCalledTimes(1);
    expect(onItemDone.mock.calls[0][0]).toMatchObject({ chars: 4, errors: 0 });
  });
});

describe("★★★★★ freie Zeile (FreieSchreibzeile): AltGr-Zeichen landen im Getippten", () => {
  it("„@“ und „€“ mit Strg + Alt stehen in der Ist-Zeile, Alt + W nicht", async () => {
    const onZeileFertig = vi.fn();
    const { container } = render(
      <FreieSchreibzeile
        {...({
          items: ["a@b€ c", "zwei"],
          contextId: "altgr-frei",
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
    for (const [key, m] of [["a", {}], ["w", { altKey: true }], ["@", ALTGR], ["b", {}], ["€", ALTGR], [" ", {}], ["c", {}], ["Enter", {}]] as const) {
      await act(async () => {
        fireEvent.keyDown(feld, { key, ...m });
      });
    }
    expect(onZeileFertig).toHaveBeenCalledTimes(1);
    expect(onZeileFertig.mock.calls[0][0].ist).toBe("a@b€ c");
  });
});
