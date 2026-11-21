/**
 * ★★★★★ E4 (25.09.2026, Bauplan französischer Lehrgang §3.2, §14 E4 Punkt 5):
 * FESTSTELLTASTE-ERKENNUNG IN `useTypingItem`.
 *
 * Gemessen (BEFUND-2026-09-25-E1-TOTASTEN-WINDOWS.md §2): mit Feststelltaste
 * an geben `é è ç à` auf AZERTY die Ziffern `2 7 9 0` statt Grossbuchstaben -
 * alle fünf Belegungen und drei Browser gleich. `useTypingItem` reicht den
 * Feststelltaste-Zustand als vierten `onWrong`-Wert durch - die eigentliche
 * Ansage/Anzeige übernimmt `TypingSession` (eigener Wächter dort ausserhalb
 * dieses reinen Hook-Tests).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useTypingItem } from "@/components/typing/useTypingItem";
import { setLayout } from "@/lib/typing/layouts";

afterEach(() => setLayout("de"));

/** Ein Tastendruck MIT Feststelltaste-Zustand. */
function taste(key: string, capsLock: boolean): KeyboardEvent {
  return {
    key,
    preventDefault: () => {},
    getModifierState: (mod: string) => mod === "CapsLock" && capsLock,
  } as unknown as KeyboardEvent;
}

describe("★★★★★ useTypingItem - Feststelltaste (nur auf französischen Tastaturen)", () => {
  it("reicht capsLockOn=true als vierten Wert an onWrong durch, wenn die Feststelltaste beim Fehlgriff an war", () => {
    setLayout("fr");
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "é", active: true, onComplete: vi.fn(), onWrong }),
    );
    // Feststelltaste an: die é-Taste liefert „2" statt „é" (gemessen).
    act(() => result.current.handleKey(taste("2", true)));
    expect(onWrong).toHaveBeenCalledWith("é", "2", 0, true);
  });

  it("capsLockOn=false, wenn die Feststelltaste beim Fehlgriff aus war", () => {
    setLayout("fr");
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "é", active: true, onComplete: vi.fn(), onWrong }),
    );
    act(() => result.current.handleKey(taste("x", false)));
    expect(onWrong).toHaveBeenCalledWith("é", "x", 0, false);
  });

  it("ohne getModifierState (ältere/synthetische Ereignisse): kein Absturz, capsLockOn falsy", () => {
    setLayout("fr");
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "é", active: true, onComplete: vi.fn(), onWrong }),
    );
    act(() =>
      result.current.handleKey({ key: "x", preventDefault: () => {} } as unknown as KeyboardEvent),
    );
    expect(onWrong).toHaveBeenCalledTimes(1);
    expect(onWrong.mock.calls[0][3]).toBeFalsy();
  });

  it("ein RICHTIGER Anschlag ruft onWrong nie auf - Feststelltaste hin oder her", () => {
    setLayout("fr");
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "a", active: true, onComplete: vi.fn(), onWrong }),
    );
    act(() => result.current.handleKey(taste("a", true)));
    expect(onWrong).not.toHaveBeenCalled();
  });
});

describe("Warnung bei JEDEM Buchstaben mit Feststelltaste (alle Tastaturen)", () => {
  it("ruft onFeststelltaste bei jedem Buchstaben, richtig oder falsch, auch auf de", () => {
    setLayout("de");
    const onFeststelltaste = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "ab", active: true, onComplete: vi.fn(), onFeststelltaste }),
    );
    act(() => result.current.handleKey(taste("a", true)));
    act(() => result.current.handleKey(taste("x", true)));
    expect(onFeststelltaste).toHaveBeenCalledTimes(2);
  });

  it("schweigt ohne Feststelltaste und bei Nicht-Buchstaben", () => {
    setLayout("de");
    const onFeststelltaste = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "ab", active: true, onComplete: vi.fn(), onFeststelltaste }),
    );
    act(() => result.current.handleKey(taste("a", false)));
    act(() => result.current.handleKey(taste("Shift", true)));
    expect(onFeststelltaste).not.toHaveBeenCalled();
  });
});
