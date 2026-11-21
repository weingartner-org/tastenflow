/**
 * ★★★★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.2, §3.8 Punkt 2):
 * ANGENOMMEN WIRD, WAS ENTSTANDEN IST - EINE TOTASTE IST KEIN FEHLER.
 *
 * Wächter über die FEHLERKLASSE „die Übungszeile nimmt ein Zeichen nur auf dem
 * Weg an, den das Modell kennt": Die Ereignisfolgen stehen hier WÖRTLICH so,
 * wie sie am 27.09. unter Windows 11 (Edge 154 = Chrome 153) gemessen wurden
 * (Befund Teil 2, SF-1, CSA-1, BE-2, FR-2). Sie werden absichtlich auch
 * gegen Tastaturen gespielt, deren Modell den Weg NICHT kennt - genau das war
 * der Blocker („Ù" auf Frankreich AZERTY, „À" auf Schweiz-Französisch).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, renderHook } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";

vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(), playUnlockFanfare: vi.fn(), playKeySound: vi.fn(), playKeyTick: vi.fn(),
  playErrorSound: vi.fn(), playLineSound: vi.fn(), playSuccessSound: vi.fn(), playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

import { useTypingItem } from "@/components/typing/useTypingItem";
import { TypingSession } from "@/components/typing/TypingSession";
import { layoutById, setLayout, type KeyboardLayout } from "@/lib/typing/layouts";
import { deuteAnschlag, type Anschlag, type OffeneTotaste } from "@/lib/typing/anschlagDeuten";
import { totasteWartetText } from "@/lib/typing/totastenTexte";
import { useTypingA11y } from "@/lib/typing";

afterEach(() => {
  cleanup();
  setLayout("de");
  act(() => useTypingA11y.getState().setTastenAnsage("aus"));
});

/** Eine Folge von Anschlägen deuten - wie `useTypingItem` es Anschlag für Anschlag tut. */
function folge(layout: KeyboardLayout, anschlaege: readonly Anschlag[]) {
  let offen: OffeneTotaste | null = null;
  return anschlaege.map((a) => {
    const r = deuteAnschlag(a, offen, layout);
    offen = r.offen;
    return r.deutung;
  });
}

const DEAD = (code: string, mods: { shiftKey?: boolean; altGr?: boolean } = {}): Anschlag => ({
  key: "Dead",
  code,
  ...mods,
});

describe("deuteAnschlag - die gemessenen Folgen (Windows 11, Edge 154 = Chrome 153)", () => {
  it("FR-2 / Folge 1: ^ dann e ⇒ keydown Dead · keydown „ê\" - die Totaste wartet, dann entsteht ê", () => {
    const d = folge(layoutById("fr"), [DEAD("BracketLeft"), { key: "ê", code: "KeyE" }]);
    expect(d[0]).toEqual({ art: "totaste", tot: "^" });
    expect(d[1]).toEqual({ art: "zeichen", zeichen: "ê" });
  });

  it("FR-2 / Folge 2: ^ dann p ⇒ EIN keydown „p\" - entstanden ist „^p\", ein Fehlgriff", () => {
    const d = folge(layoutById("fr"), [DEAD("BracketLeft"), { key: "p", code: "KeyP" }]);
    expect(d[1]).toEqual({ art: "fehlgriff", eingabe: "^p" });
  });

  it("CSA-1 / Folge 3: ^ dann Leertaste ⇒ keydown „^\" (code Space) - der Akzent allein", () => {
    const d = folge(layoutById("ca-csa"), [DEAD("BracketLeft"), { key: "^", code: "Space" }]);
    expect(d[1]).toEqual({ art: "zeichen", zeichen: "^" });
  });

  it("BE-2 / Folge 4: Belgien AltGr + 7 ⇒ keydown „è\" OHNE input - entstanden ist NICHTS", () => {
    const d = folge(layoutById("be"), [{ key: "è", code: "Digit7", altGr: true }]);
    expect(d[0]).toEqual({ art: "fehlgriff", eingabe: "" });
    // Dasselbe für AltGr + 8 („!" gemeldet, nichts entstanden).
    expect(folge(layoutById("be"), [{ key: "!", code: "Digit8", altGr: true }])[0]).toEqual({
      art: "fehlgriff",
      eingabe: "",
    });
  });

  it("Gegenprobe zu Folge 4: eine AltGr-Ebene, die ETWAS erzeugt, ist ein Zeichen (Belgien AltGr + 1 = |, Frankreich AltGr + 9 = ^)", () => {
    expect(folge(layoutById("be"), [{ key: "|", code: "Digit1", altGr: true }])[0]).toEqual({
      art: "zeichen",
      zeichen: "|",
    });
    expect(folge(layoutById("fr"), [{ key: "^", code: "Digit9", altGr: true }])[0]).toEqual({
      art: "zeichen",
      zeichen: "^",
    });
    // Ohne AltGr ist „è" auf Belgien die eigene Taste.
    expect(folge(layoutById("be"), [{ key: "è", code: "Digit7" }])[0]).toEqual({
      art: "zeichen",
      zeichen: "è",
    });
  });

  it("SF-1: Schweiz-Französisch Umschalt + ^-Taste (Equal), dann u ⇒ ù", () => {
    const d = folge(layoutById("ch-fr"), [
      DEAD("Equal", { shiftKey: true }),
      { key: "ù", code: "KeyU" },
    ]);
    expect(d[0]).toEqual({ art: "totaste", tot: "`" });
    expect(d[1]).toEqual({ art: "zeichen", zeichen: "ù" });
  });

  it("die Umschalttaste ZWISCHEN Totaste und Buchstabe lässt die Totaste offen (Ù = Totaste, dann Umschalt + U)", () => {
    const d = folge(layoutById("fr"), [
      DEAD("Digit7", { altGr: true }),
      { key: "Shift", code: "ShiftLeft", shiftKey: true },
      { key: "Ù", code: "KeyU", shiftKey: true },
    ]);
    expect(d[1]).toEqual({ art: "sondertaste" });
    expect(d[2]).toEqual({ art: "zeichen", zeichen: "Ù" });
  });

  it("★ der Blocker an der Wurzel: auch eine Totaste, die das MODELL NICHT KENNT, wartet - und das entstandene Zeichen zählt", () => {
    // Ein Modell ohne jede Totaste: die Deutung hängt nicht am Modell.
    const ohneTotasten: KeyboardLayout = { ...layoutById("fr"), access: {} };
    const d = folge(ohneTotasten, [DEAD("Digit7", { altGr: true }), { key: "Ù", code: "KeyU", shiftKey: true }]);
    expect(d[0]).toEqual({ art: "totaste", tot: null });
    expect(d[1]).toEqual({ art: "zeichen", zeichen: "Ù" });
  });

  it("Mac Safari/Firefox (BEFUND-2026-09-25-E1): ein Zwei-Zeichen-key „^p\" ist ein Fehlgriff, EINER", () => {
    const d = folge(layoutById("fr"), [DEAD("BracketLeft"), { key: "^p", code: "KeyP" }]);
    expect(d[1]).toEqual({ art: "fehlgriff", eingabe: "^p" });
    expect(folge(layoutById("de"), [{ key: "^p" }])[0]).toEqual({ art: "fehlgriff", eingabe: "^p" });
  });

  it("eine andere benannte Taste (Rücktaste, Esc) schliesst die offene Totaste - danach zählt der Buchstabe für sich", () => {
    const d = folge(layoutById("fr"), [DEAD("BracketLeft"), { key: "Backspace" }, { key: "p", code: "KeyP" }]);
    expect(d[1]).toEqual({ art: "sondertaste" });
    expect(d[2]).toEqual({ art: "zeichen", zeichen: "p" });
  });
});

/** Ein Tastendruck, wie `handleKey` ihn bekommt - ohne echtes DOM-Ereignis. */
function taste(key: string, code?: string, mods: { shiftKey?: boolean; altGr?: boolean } = {}): KeyboardEvent {
  return {
    key,
    code,
    shiftKey: mods.shiftKey === true,
    ctrlKey: false,
    altKey: false,
    getModifierState: (m: string) => (m === "AltGraph" ? mods.altGr === true : false),
    preventDefault: () => {},
  } as unknown as KeyboardEvent;
}

describe("useTypingItem nimmt an, was entstanden ist", () => {
  it("★★★★★ Frankreich AZERTY „Ùk\" (erste Zeile nach der Einrichtung, viermal gemessen): AltGr + 7, Umschalt + U ⇒ angenommen, kein Fehler", () => {
    setLayout("fr");
    const onWrong = vi.fn();
    const onTotaste = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "Ùk", active: true, onComplete: vi.fn(), onWrong, onTotaste }),
    );
    act(() => result.current.handleKey(taste("Dead", "Digit7", { altGr: true })));
    act(() => result.current.handleKey(taste("Shift", "ShiftLeft", { shiftKey: true })));
    act(() => result.current.handleKey(taste("Ù", "KeyU", { shiftKey: true })));
    expect(onWrong).not.toHaveBeenCalled();
    expect(result.current.errors).toBe(0);
    expect(result.current.index).toBe(1);
    expect(onTotaste).toHaveBeenCalledTimes(1);
  });

  it("★★★★★ Schweiz-Französisch „À Genève\": Umschalt + ^-Taste (Gravis), Umschalt + A ⇒ angenommen", () => {
    setLayout("ch-fr");
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "À G", active: true, onComplete: vi.fn(), onWrong }),
    );
    act(() => result.current.handleKey(taste("Dead", "Equal", { shiftKey: true })));
    act(() => result.current.handleKey(taste("À", "KeyA", { shiftKey: true })));
    expect(onWrong).not.toHaveBeenCalled();
    expect(result.current.index).toBe(1);
  });

  it("eine Totaste an einer Stelle, die keine erwartet, ist KEIN Fehler - erst das fertige Zeichen wird bewertet", () => {
    setLayout("fr");
    const onWrong = vi.fn();
    const onCorrect = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "e", active: true, onComplete: vi.fn(), onWrong, onCorrect }),
    );
    act(() => result.current.handleKey(taste("Dead", "BracketLeft")));
    expect(result.current.errors).toBe(0);
    expect(onWrong).not.toHaveBeenCalled();
    // Das fertige Zeichen „ê" ist nicht „e" - JETZT ein Fehler, EINER.
    act(() => result.current.handleKey(taste("ê", "KeyE")));
    expect(result.current.errors).toBe(1);
    expect(onWrong).toHaveBeenCalledWith("e", "ê", 0, false);
    // Danach trifft das richtige e ganz normal.
    act(() => result.current.handleKey(taste("e", "KeyE")));
    expect(onCorrect).toHaveBeenCalledWith("e", 0);
  });

  it("^ dann p (Windows schreibt „^p\"): KEIN Treffer, auch wenn „p\" das Ziel ist - EIN Fehler", () => {
    setLayout("fr");
    const onWrong = vi.fn();
    const onCorrect = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "p", active: true, onComplete: vi.fn(), onWrong, onCorrect }),
    );
    act(() => result.current.handleKey(taste("Dead", "BracketLeft")));
    act(() => result.current.handleKey(taste("p", "KeyP")));
    expect(onCorrect).not.toHaveBeenCalled();
    expect(result.current.errors).toBe(1);
    expect(onWrong).toHaveBeenCalledWith("p", "^p", 0, false);
    act(() => result.current.handleKey(taste("p", "KeyP")));
    expect(result.current.done).toBe(true);
    expect(result.current.errors).toBe(1);
  });

  it("Belgien AltGr + 7, wo „è\" erwartet wird: es ist NICHTS entstanden - kein erfundenes è, ein Fehlgriff", () => {
    setLayout("be");
    const onWrong = vi.fn();
    const onCorrect = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "è", active: true, onComplete: vi.fn(), onWrong, onCorrect }),
    );
    act(() => result.current.handleKey(taste("è", "Digit7", { altGr: true })));
    expect(onCorrect).not.toHaveBeenCalled();
    expect(onWrong).toHaveBeenCalledWith("è", "", 0, false);
    act(() => result.current.handleKey(taste("è", "Digit7")));
    expect(result.current.done).toBe(true);
  });

  it("gilt auf JEDER Tastatur: Schweiz (Weg „de\") ¨-Taste, dann Umschalt + A ⇒ Ä angenommen", () => {
    setLayout("ch");
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "Äpfel", active: true, onComplete: vi.fn(), onWrong }),
    );
    act(() => result.current.handleKey(taste("Dead", "BracketRight")));
    act(() => result.current.handleKey(taste("Ä", "KeyA", { shiftKey: true })));
    expect(onWrong).not.toHaveBeenCalled();
    expect(result.current.index).toBe(1);
  });
});

describe("die Totaste wird angesagt - in der Bedienungssprache, nur Sprache ohne „Buchstabieren\"", () => {
  it("die Sätze: „Zirkumflex wartet\", „accent circonflexe en attente\", unbekannt „Akzent wartet\"", () => {
    expect(totasteWartetText("^", "de")).toBe("Zirkumflex wartet");
    expect(totasteWartetText("^", "fr")).toBe("accent circonflexe en attente");
    expect(totasteWartetText("`", "en")).toBe("grave accent waiting");
    expect(totasteWartetText("´", "es")).toBe("tilde en espera");
    expect(totasteWartetText("´", "de")).toBe("Akut wartet");
    expect(totasteWartetText(null, "de")).toBe("Akzent wartet");
    expect(totasteWartetText("~", "fr")).toBe("tilde en attente");
  });

  function aufbauen(zeile: string) {
    setLayout("fr");
    const r = render(
      <TypingSession
        items={[zeile]}
        contextId="test-w1-totaste"
        unlocked={new Set([...zeile])}
        shiftLearned={false}
        stufe={1 as never}
        voiceEnabled={false}
        onRetry={() => {}}
      />,
    );
    const feld = r.container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]');
    const live = r.container.querySelector('[role="status"][aria-live="assertive"]');
    if (!feld || !live) throw new Error("Übungsfeld oder Live-Bereich nicht gefunden");
    return { feld, live };
  }

  it("„Buchstabieren\" an: der Live-Bereich sagt „Zirkumflex wartet\" (Bedienung Deutsch)", async () => {
    act(() => useTypingA11y.getState().setTastenAnsage("naechste"));
    const { feld, live } = aufbauen("ê");
    await act(async () => {
      fireEvent.keyDown(feld, { key: "Dead", code: "BracketLeft" });
      await new Promise((f) => setTimeout(f, 50));
    });
    expect(live.textContent).toMatch(/Zirkumflex wartet/);
  });

  it("„Buchstabieren\" aus (Vorgabe Windows): KEINE Blitzmeldung auf der Braillezeile", async () => {
    act(() => useTypingA11y.getState().setTastenAnsage("aus"));
    const { feld, live } = aufbauen("ê");
    await act(async () => {
      fireEvent.keyDown(feld, { key: "Dead", code: "BracketLeft" });
      await new Promise((f) => setTimeout(f, 50));
    });
    expect(live.textContent ?? "").not.toMatch(/wartet/);
  });
});
