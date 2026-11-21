/**
 * Gegenhand-Regel der Umschalttaste: Ist die Umschalttaste gelernt, zählt ein
 * Groß-/Sonderzeichen NUR, wenn die richtige (Gegenhand-)Umschalttaste gehalten
 * wurde. Die falsche Umschalttaste oder die Feststelltaste erzeugen dasselbe
 * Zeichen, gelten hier aber als Fehler. Getestet an der Kern-Tipp-Logik
 * (useTypingItem) über den `correctShiftHeld`-Callback. Siehe
 * [[project_zehnfinger_trainer]].
 */
import { describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTypingItem } from "../src/components/typing/useTypingItem";
import { fingerGuide } from "../src/lib/typing";

/** Minimales Tastatur-Event, wie handleKey es liest (.key + preventDefault). */
function keyEvent(key: string) {
  return { key, preventDefault: () => {} } as unknown as KeyboardEvent;
}

describe("Umschalt-Gegenhand-Regel in useTypingItem", () => {
  it("richtige Umschalttaste → Großbuchstabe zählt als Treffer", () => {
    const onCorrect = vi.fn();
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({
        expected: "A",
        active: true,
        onComplete: () => {},
        onCorrect,
        onWrong,
        acceptLowerForUpper: false,
        correctShiftHeld: () => true, // richtige Seite gehalten
      }),
    );

    act(() => result.current.handleKey(keyEvent("A")));

    expect(onCorrect).toHaveBeenCalledTimes(1);
    expect(onWrong).not.toHaveBeenCalled();
    expect(result.current.index).toBe(1);
    expect(result.current.done).toBe(true);
  });

  it("falsche Umschalttaste/Feststelltaste → Großbuchstabe zählt als Fehler", () => {
    const onCorrect = vi.fn();
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({
        expected: "A",
        active: true,
        onComplete: () => {},
        onCorrect,
        onWrong,
        acceptLowerForUpper: false,
        correctShiftHeld: () => false, // falsche Seite / Caps Lock
      }),
    );

    act(() => result.current.handleKey(keyEvent("A")));

    // Das erzeugte Zeichen stimmt, wird aber NICHT angenommen.
    expect(onCorrect).not.toHaveBeenCalled();
    expect(result.current.index).toBe(0);
    expect(result.current.errors).toBe(1);
    // onWrong bekommt das gewünschte Zeichen UND das getippte (hier gleich) —
    // daran erkennt die Session den „falsche-Umschalttaste"-Fall.
    expect(onWrong).toHaveBeenCalledWith("A", "A", 0, false);
  });

  it("Kleinbuchstaben brauchen keine Umschalt-Prüfung", () => {
    const onCorrect = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({
        expected: "a",
        active: true,
        onComplete: () => {},
        onCorrect,
        acceptLowerForUpper: false,
        // Vertrag wie in der Session: Zeichen OHNE Umschalt liefern immer true.
        correctShiftHeld: (w) => !/[A-ZÄÖÜ]/.test(w),
      }),
    );

    act(() => result.current.handleKey(keyEvent("a")));

    expect(onCorrect).toHaveBeenCalledTimes(1);
    expect(result.current.index).toBe(1);
  });

  it("Einhand-Modus (keine Seiten-Prüfung übergeben) nimmt den Großbuchstaben an", () => {
    // enforceShiftHand=false → die Session übergibt correctShiftHeld gar nicht.
    // Dann zählt „A" als Treffer, egal welche Umschalttaste/Feststelltaste.
    const onCorrect = vi.fn();
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({
        expected: "A",
        active: true,
        onComplete: () => {},
        onCorrect,
        onWrong,
        acceptLowerForUpper: false,
        // kein correctShiftHeld → keine Gegenhand-Prüfung
      }),
    );

    act(() => result.current.handleKey(keyEvent("A")));

    expect(onCorrect).toHaveBeenCalledTimes(1);
    expect(onWrong).not.toHaveBeenCalled();
    expect(result.current.index).toBe(1);
  });

  it("fingerGuide: Einhand-Modus sagt neutral die Umschalttaste (ohne Seite)", () => {
    const normal = fingerGuide("A", false, "de"); // großes A → linke Hand → rechte Umschalttaste
    expect(normal).toContain("rechte Umschalttaste");
    const einhand = fingerGuide("A", true, "de");
    expect(einhand).toContain("Umschalttaste");
    expect(einhand).not.toContain("rechte Umschalttaste");
    expect(einhand).not.toContain("linke Umschalttaste");
  });

  it("vor dem Erlernen der Umschalttaste genügt der kleine Buchstabe (Auto-Großschreibung)", () => {
    const onCorrect = vi.fn();
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({
        expected: "A",
        active: true,
        onComplete: () => {},
        onCorrect,
        onWrong,
        acceptLowerForUpper: true, // Umschalt noch nicht gelernt
        // kein correctShiftHeld → keine Seiten-Prüfung
      }),
    );

    act(() => result.current.handleKey(keyEvent("a")));

    expect(onCorrect).toHaveBeenCalledTimes(1);
    expect(onWrong).not.toHaveBeenCalled();
    expect(result.current.index).toBe(1);
  });
});
