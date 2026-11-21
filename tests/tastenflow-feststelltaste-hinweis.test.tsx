/**
 * ★★★★★ E4 (25.09.2026, Bauplan französischer Lehrgang §3.2, §14 E4 Punkt 5):
 * FESTSTELLTASTE-HINWEIS IN `TypingSession`.
 *
 * Gemessen (BEFUND-2026-09-25-E1-TOTASTEN-WINDOWS.md §2): auf AZERTY (fr/be)
 * geben `é è ç à` mit Feststelltaste an Ziffern statt Grossbuchstaben - ein
 * KLEINER Buchstabe an dieser Stelle bleibt sonst ein STUMMER Fehler. Regel
 * (Bauplan §3.2, §14 E4 Punkt 5): sichtbar in der Hilfszeile, Ton wie ein
 * Fehlgriff, in die Live-Region NUR bei „Buchstabieren an" (Regel 09.09.: die
 * Braillezeile springt nie).
 *
 * ⚠️ `fireEvent.keyDown` mit einem eigenen `getModifierState` im Init-Objekt
 * wirkt NICHT (jsdom übernimmt aus dem Init-Objekt nur bekannte
 * `KeyboardEventInit`-Felder) - `getModifierState` ist eine METHODE des
 * Ereignisses, keine Eigenschaft. Der Umweg: ein echtes `KeyboardEvent` bauen
 * und `getModifierState` per `Object.defineProperty` VOR dem Feuern
 * überschreiben, dann mit `fireEvent(feld, ev)` (Zwei-Argument-Form)
 * abschicken - dieselbe Form, die die Bibliothek für ein fertiges Ereignis
 * vorsieht.
 */
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import { fireEvent, screen } from "@testing-library/dom";

vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(), playUnlockFanfare: vi.fn(), playKeySound: vi.fn(), playKeyTick: vi.fn(),
  playErrorSound: vi.fn(), playLineSound: vi.fn(), playSuccessSound: vi.fn(), playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

import { TypingSession } from "@/components/typing/TypingSession";
import { useTypingA11y, TASTEN_ANSAGE_KEY, type TastenAnsage } from "@/lib/typing/a11y";
import { setLayout } from "@/lib/typing/layouts";
import { playErrorSound } from "@/lib/typing/sound";

function aufbauen(stufe: TastenAnsage, layout: "fr" | "de" = "fr") {
  setLayout(layout);
  act(() => useTypingA11y.getState().setTastenAnsage(stufe));
  const ergebnis = render(
    <TypingSession
      items={["é"]}
      contextId="test-feststelltaste"
      unlocked={new Set(["é"])}
      shiftLearned={false}
      stufe={1 as never}
      voiceEnabled={false}
      onRetry={() => {}}
    />,
  );
  const feld = ergebnis.container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]');
  const live = ergebnis.container.querySelector('[role="status"][aria-live="assertive"]');
  if (!feld || !live) throw new Error("Übungsfeld oder Live-Bereich nicht gefunden");
  return { ...ergebnis, feld, live };
}

/** Ein Anschlag MIT gesetztem Feststelltaste-Zustand, echtes Ereignis (siehe Dateikopf). */
async function feststelltastenAnschlag(feld: HTMLTextAreaElement, key: string, capsLock: boolean) {
  const ev = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
  Object.defineProperty(ev, "getModifierState", {
    value: (mod: string) => mod === "CapsLock" && capsLock,
    configurable: true,
  });
  await act(async () => {
    fireEvent(feld, ev);
    // ★ `pushLive` leert den Live-Bereich erst und füllt ihn 50 ms später
    // (siehe tastenflow-tasten-ansage.test.tsx) - abwarten, sonst liest der
    // Test die Löschung, nicht die Meldung.
    await new Promise((f) => setTimeout(f, 120));
  });
}

beforeEach(() => {
  try {
    localStorage.removeItem(TASTEN_ANSAGE_KEY);
  } catch {
    /* egal */
  }
  vi.mocked(playErrorSound).mockClear();
});
afterEach(() => {
  cleanup();
  setLayout("de");
});

const fenster = () => document.body.textContent ?? "";

describe("Feststelltaste-Popup (Johannes 12.10.2026: Popup, mit „Weiter\" bestätigt)", () => {
  it("Feststelltaste an, Ziel é, getippt 2 (Ziffer, französisch): Popup + Ton wie ein Fehlgriff", async () => {
    const { feld } = aufbauen("aus");
    await feststelltastenAnschlag(feld, "2", true);
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(fenster()).toMatch(/Feststelltaste ist an/);
    expect(playErrorSound).toHaveBeenCalled();
  });

  it("Der Schalter heisst „Weiter\" und schliesst das Popup", async () => {
    const { feld } = aufbauen("aus", "de");
    await feststelltastenAnschlag(feld, "x", true);
    fireEvent.click(screen.getByRole("button", { name: "Weiter" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("Feststelltaste AUS: kein Popup, gewöhnlicher Fehlgriff", async () => {
    const { feld } = aufbauen("aus");
    await feststelltastenAnschlag(feld, "x", false);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(playErrorSound).toHaveBeenCalled();
  });

  it("deutsche Tastatur: Popup bei jedem Buchstaben", async () => {
    const { feld } = aufbauen("aus", "de");
    await feststelltastenAnschlag(feld, "x", true);
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Weiter" }));
    await feststelltastenAnschlag(feld, "y", true);
    expect(screen.getByRole("dialog")).toBeTruthy();
  });
});
