/**
 * ★ Föhner (Zürich, 29.10.2026): „Auf der Schweizer Tastatur können die
 * Umlaute nur mit der Feststelltaste geschrieben werden, ist es möglich nur
 * beim Schreiben der Umlaute die Meldung … auszuschalten?"
 *
 * Feststelltaste + ö gibt auf der Schweizer Tastatur Ö (gemessen 02.10.,
 * BEFUND-2026-10-02-WINDOWS-MESSUNG §2) und wird angenommen - das Fenster
 * ging trotzdem auf. Auf der deutschen Tastatur bleibt es wie bisher.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useTypingItem } from "@/components/typing/useTypingItem";
import { useFeststelltasteWarnung } from "@/components/typing/FeststelltasteWarnung";
import { feststelltasteGewollt } from "@/lib/typing/feststelltasteGewollt";
import { setLayout } from "@/lib/typing/layouts";

afterEach(() => setLayout("de"));

function taste(key: string, capsLock: boolean): KeyboardEvent {
  return {
    key,
    preventDefault: () => {},
    getModifierState: (mod: string) => mod === "CapsLock" && capsLock,
  } as unknown as KeyboardEvent;
}

function zeile(expected: string) {
  const onFeststelltaste = vi.fn();
  const { result } = renderHook(() =>
    useTypingItem({ expected, active: true, onComplete: vi.fn(), onFeststelltaste }),
  );
  return { result, onFeststelltaste };
}

describe("Feststelltaste für Ä Ö Ü auf der Schweizer Tastatur", () => {
  it("Schweiz: Ö mit Feststelltaste - kein Fenster", () => {
    setLayout("ch");
    const { result, onFeststelltaste } = zeile("Öl");
    act(() => result.current.handleKey(taste("Ö", true)));
    expect(onFeststelltaste).not.toHaveBeenCalled();
  });

  it("Schweiz: Feststelltaste bleibt an, nächster Buchstabe falsch gross - Fenster kommt", () => {
    setLayout("ch");
    const { result, onFeststelltaste } = zeile("Öl");
    act(() => result.current.handleKey(taste("Ö", true)));
    act(() => result.current.handleKey(taste("L", true)));
    expect(onFeststelltaste).toHaveBeenCalledTimes(1);
  });

  it("Deutschland: Ö mit Feststelltaste - Fenster wie bisher", () => {
    setLayout("de");
    const { result, onFeststelltaste } = zeile("Öl");
    act(() => result.current.handleKey(taste("Ö", true)));
    expect(onFeststelltaste).toHaveBeenCalledTimes(1);
  });

  it("Schweiz: gewöhnlicher Grossbuchstabe mit Feststelltaste - Fenster wie bisher", () => {
    setLayout("ch");
    const { result, onFeststelltaste } = zeile("Hallo");
    act(() => result.current.handleKey(taste("H", true)));
    expect(onFeststelltaste).toHaveBeenCalledTimes(1);
  });

  it("Rätsel und Freies Schreiben (Hook): Schweiz Ä ohne Fenster, Deutschland mit", () => {
    setLayout("ch");
    const ch = renderHook(() => useFeststelltasteWarnung("de"));
    act(() => ch.result.current.pruefe(taste("Ä", true)));
    expect(ch.result.current.hinweis).toBeNull();

    setLayout("de");
    const de = renderHook(() => useFeststelltasteWarnung("de"));
    act(() => de.result.current.pruefe(taste("Ä", true)));
    expect(de.result.current.hinweis).not.toBeNull();
  });

  it("die Regel je Tastatur", () => {
    setLayout("ch");
    expect(["Ä", "Ö", "Ü"].map((z) => feststelltasteGewollt(z))).toEqual([true, true, true]);
    expect(feststelltasteGewollt("A")).toBe(false);
    expect(feststelltasteGewollt("ö")).toBe(false);
    setLayout("de");
    expect(["Ä", "Ö", "Ü"].map((z) => feststelltasteGewollt(z))).toEqual([false, false, false]);
  });
});
