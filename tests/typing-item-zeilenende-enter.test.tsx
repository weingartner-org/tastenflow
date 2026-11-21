/**
 * ★★★★★ WÄCHTER: „ZEILENENDE MIT ENTER" IM HOOK SELBST (E3, 23.09.2026).
 *
 * Reine Hook-Tests für `useTypingItem` - ohne Oberfläche, ohne Ton. Die
 * Klassen-Einstellung `zeilenEndeEnter` (siehe `account.ts`) verlangt: jedes
 * Kind der Klasse schliesst jede Übungszeile mit der Eingabetaste ab. Geprüft
 * wird hier NUR die Tipp-Logik einer einzelnen Zeile:
 *
 *  1. Enter am Zeilenende schliesst ab (Ziel wird `expected + "\n"`).
 *  2. Eine falsche Taste statt Enter am Zeilenende ist EIN Fehler an dieser
 *     Position - „erst richtig, dann weiter" gilt auch hier.
 *  3. Enter MITTEN in der Zeile ist ein gewöhnlicher Fehlanschlag: Fehler,
 *     aber kein Vorrücken.
 *  4. Ist der Schalter AUS (Vorgabe), bleibt Enter wirkungslos - wie vor
 *     diesem Umbau.
 *
 * Der Feldwert (ohne `\n`) und die Tastatur-Markierung sind Sache von
 * `TypingSession`/`Keyboard` (E4) - eigener Wächter dort
 * (`tastenflow-zeilenende-enter.test.tsx`).
 */
import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useTypingItem } from "@/components/typing/useTypingItem";

/** Ein Tastendruck, wie `handleKey` ihn erwartet - ohne echtes DOM-Ereignis. */
function taste(key: string): KeyboardEvent {
  return { key, preventDefault: () => {} } as unknown as KeyboardEvent;
}

describe("★★★★★ useTypingItem - Zeilenende mit Enter (Schalter AN)", () => {
  it("Enter am Zeilenende schliesst die Zeile ab, ohne Fehler", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "ab", active: true, onComplete, zeilenEnde: true, zeile: 1 }),
    );
    act(() => result.current.handleKey(taste("a")));
    act(() => result.current.handleKey(taste("b")));
    expect(result.current.done).toBe(false);
    act(() => result.current.handleKey(taste("Enter")));
    expect(result.current.done).toBe(true);
    expect(result.current.errors).toBe(0);
    expect(onComplete).toHaveBeenCalledWith(0);
  });

  it("eine falsche Taste statt Enter am Zeilenende zählt als EIN Fehler an dieser Position", () => {
    const onComplete = vi.fn();
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({
        expected: "ab",
        active: true,
        onComplete,
        onWrong,
        zeilenEnde: true,
        zeile: 1,
      }),
    );
    act(() => result.current.handleKey(taste("a")));
    act(() => result.current.handleKey(taste("b")));
    act(() => result.current.handleKey(taste("x"))); // falsch statt Enter
    expect(result.current.errors).toBe(1);
    expect(result.current.done).toBe(false);
    expect(onWrong).toHaveBeenCalledWith("\n", "x", 2, false);
    // dieselbe Position noch einmal falsch ⇒ KEIN zweiter Fehler (einmal je Position)
    act(() => result.current.handleKey(taste("y")));
    expect(result.current.errors).toBe(1);
    // jetzt richtig ⇒ schliesst ab, der eine Fehler bleibt stehen
    act(() => result.current.handleKey(taste("Enter")));
    expect(result.current.done).toBe(true);
    expect(onComplete).toHaveBeenCalledWith(1);
  });

  it("Enter MITTEN in der Zeile ist ein gewöhnlicher Fehlanschlag - kein Vorrücken", () => {
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({
        expected: "ab",
        active: true,
        onComplete: vi.fn(),
        onWrong,
        zeilenEnde: true,
        zeile: 1,
      }),
    );
    act(() => result.current.handleKey(taste("Enter")));
    expect(result.current.index).toBe(0);
    expect(result.current.errors).toBe(1);
    expect(onWrong).toHaveBeenCalledWith("a", "\n", 0, false);
    // die richtige Taste rückt jetzt trotzdem vor
    act(() => result.current.handleKey(taste("a")));
    expect(result.current.index).toBe(1);
  });
});

describe("★★★★★ useTypingItem - Zeilenende mit Enter (Schalter AUS, die Vorgabe)", () => {
  it("Enter bleibt wirkungslos - die Zeile schliesst schon nach dem letzten Zeichen", () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "ab", active: true, onComplete, zeile: 1 }),
    );
    act(() => result.current.handleKey(taste("Enter"))); // vorher: nichts geschieht
    expect(result.current.index).toBe(0);
    expect(result.current.errors).toBe(0);
    act(() => result.current.handleKey(taste("a")));
    act(() => result.current.handleKey(taste("b")));
    expect(result.current.done).toBe(true);
    expect(onComplete).toHaveBeenCalledWith(0);
    act(() => result.current.handleKey(taste("Enter"))); // danach: ebenfalls nichts
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it(`ohne zeilenEnde-Angabe (undefined) verhält es sich genauso wie „aus"`, () => {
    const { result } = renderHook(() =>
      useTypingItem({ expected: "a", active: true, onComplete: vi.fn(), zeile: 1 }),
    );
    act(() => result.current.handleKey(taste("Enter")));
    expect(result.current.index).toBe(0);
    expect(result.current.errors).toBe(0);
  });
});

describe("★★★★★ useTypingItem - der Schalter wird je Zeile festgehalten", () => {
  it("ändert sich zeilenEnde mitten in der Zeile, gilt weiter der Stand vom Rücksetzen", () => {
    const onComplete = vi.fn();
    const { result, rerender } = renderHook(
      ({ zeilenEnde }) =>
        useTypingItem({ expected: "a", active: true, onComplete, zeilenEnde, zeile: 1 }),
      { initialProps: { zeilenEnde: true } },
    );
    // Schalter springt auf „aus", OHNE dass die Zeile wechselt (kein neues `zeile`).
    rerender({ zeilenEnde: false });
    act(() => result.current.handleKey(taste("a")));
    // Die Zeile verlangt weiter Enter - sie ist NICHT fertig nach nur "a".
    expect(result.current.done).toBe(false);
    act(() => result.current.handleKey(taste("Enter")));
    expect(result.current.done).toBe(true);
    expect(onComplete).toHaveBeenCalledWith(0);
  });
});
