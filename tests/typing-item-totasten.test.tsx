/**
 * ★★★★★ E4 (25.09.2026, Bauplan französischer Lehrgang §4.3 Punkt 2/5, §14
 * E4): TOTASTEN IN `useTypingItem`.
 *
 * Reine Hook-Tests, wie `typing-item-zeilenende-enter.test.tsx` - ohne
 * Oberfläche, ohne Ton. Gemessen (BEFUND-2026-09-25-E1-TOTASTEN-MAC/-WINDOWS.
 * md): das fertige Zeichen (z. B. „ê") steht schon im ZWEITEN `keydown` - Weg
 * K1, kein Kompositions-Umbau der Übungs-Engine nötig. Geprüft wird:
 *
 *  1. `^` + `e` trifft „ê", wenn die Sprosse „ê" erwartet.
 *  2. `Dead` allein an einer Stelle, die eine Totaste erwartet: Zwischenzustand
 *     - kein Fehler, kein Vorrücken.
 *  3. `Dead` an einer Stelle, die KEINE Totaste erwartet: sofortiger Fehlgriff,
 *     EINER; der danach kommende Anschlag (Chrome/Edge: nur der zweite
 *     Buchstabe, „p"; Safari/Firefox: „^p") wird verschluckt, nicht noch
 *     einmal gezählt, und ist auch kein zufälliger Treffer, selbst wenn er
 *     zufällig zum Ziel passt.
 *  4. Dieselbe Mechanik gilt für die Feststelltaste NICHT - siehe eigene
 *     Wächter (`typing-item-feststelltaste.test.tsx`,
 *     `tastenflow-feststelltaste-hinweis.test.tsx`).
 *  5. Auf den Wegen „de"/„en" (Layout „de") bleibt ALLES unverändert - ein
 *     `Dead`-Ereignis dort verhält sich Byte für Byte wie vor E4 (die
 *     bestehenden Golden-Tests bestätigen das zusätzlich).
 *
 * ★ Gate „rot vor der Behebung": jeder Fall hier stand vor der Behebung tat-
 * sächlich rot (manuell geprüft durch Zurücksetzen von `useTypingItem.ts` auf
 * den Stand vor E4 während des Baus - siehe BEFUND-2026-09-25-E4-TOTASTEN.md).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useTypingItem } from "@/components/typing/useTypingItem";
import { setLayout } from "@/lib/typing/layouts";

afterEach(() => setLayout("de"));

/** Ein Tastendruck, wie `handleKey` ihn erwartet - ohne echtes DOM-Ereignis. */
function taste(key: string): KeyboardEvent {
  return { key, preventDefault: () => {} } as unknown as KeyboardEvent;
}

describe("★★★★★ useTypingItem - Totasten (seit W1 auf jeder Tastatur dieselbe Deutung)", () => {
  it("^ dann e trifft ê, wenn die Sprosse ê erwartet (der Browser liefert das fertige Zeichen im zweiten keydown)", () => {
    setLayout("fr");
    const onComplete = vi.fn();
    const onCorrect = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "ê", active: true, onComplete, onCorrect }),
    );
    act(() => result.current.handleKey(taste("Dead"))); // die Totaste selbst
    expect(result.current.errors).toBe(0);
    expect(result.current.done).toBe(false);
    act(() => result.current.handleKey(taste("ê"))); // das fertige Zeichen, zweiter keydown
    expect(result.current.done).toBe(true);
    expect(result.current.errors).toBe(0);
    expect(onCorrect).toHaveBeenCalledWith("ê", 0);
    expect(onComplete).toHaveBeenCalledWith(0);
  });

  it("★ W1: Dead an einer Stelle, die KEINE Totaste erwartet, ist KEIN Fehler mehr - ein Wartezustand", () => {
    // ★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.8, Johannes):
    // „eine Totaste ist KEIN Fehler, bewertet wird erst das fertige Zeichen".
    // Bis W1 stand hier: EIN sofortiger Fehlgriff. Genau diese Regel machte
    // „Ù" auf Windows-AZERTY unlösbar (Totaste ` über AltGr + 7, im Modell
    // unbekannt). Der Fehler kommt jetzt mit dem nächsten Anschlag, wenn er
    // kein richtiges Zeichen ergibt (Fälle unten).
    setLayout("fr");
    const onComplete = vi.fn();
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "p", active: true, onComplete, onWrong }),
    );
    act(() => result.current.handleKey(taste("Dead")));
    expect(result.current.errors).toBe(0);
    expect(result.current.wrongTick).toBe(0);
    expect(onWrong).not.toHaveBeenCalled();
  });

  it("Chrome/Edge-Form (nur der zweite Buchstabe, z. B. „p\") nach einem unerwarteten Dead: NICHT als Treffer gewertet, EIN Fehler (seit W1 beim „p\", nicht beim Dead)", () => {
    setLayout("fr");
    const onComplete = vi.fn();
    const onWrong = vi.fn();
    const onCorrect = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "p", active: true, onComplete, onWrong, onCorrect }),
    );
    act(() => result.current.handleKey(taste("Dead"))); // W1: Wartezustand
    act(() => result.current.handleKey(taste("p"))); // „^p" entstanden - kein Treffer, EIN Fehler
    expect(result.current.errors).toBe(1); // nicht 2
    expect(onWrong).toHaveBeenCalledTimes(1); // nicht 2
    expect(onCorrect).not.toHaveBeenCalled();
    expect(result.current.done).toBe(false); // nicht fertig - "p" zählte nicht
    expect(result.current.index).toBe(0);
    // die WIRKLICH richtige Taste danach trifft ganz normal.
    act(() => result.current.handleKey(taste("p")));
    expect(result.current.done).toBe(true);
    expect(result.current.errors).toBe(1); // der eine Fehler bleibt stehen
  });

  it("Safari/Firefox-Form (zwei Zeichen, „^p\") nach einem unerwarteten Dead: verschluckt, kein zweiter Fehler", () => {
    setLayout("fr");
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "p", active: true, onComplete: vi.fn(), onWrong }),
    );
    act(() => result.current.handleKey(taste("Dead")));
    act(() => result.current.handleKey(taste("^p")));
    expect(result.current.errors).toBe(1);
    expect(onWrong).toHaveBeenCalledTimes(1);
  });

  it("ein Zwei-Zeichen-Artefakt OHNE vorausgehendes Dead (zweite Absicherung) zählt trotzdem als EIN Fehlanschlag", () => {
    setLayout("fr");
    const onWrong = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "p", active: true, onComplete: vi.fn(), onWrong }),
    );
    act(() => result.current.handleKey(taste("^p")));
    expect(result.current.errors).toBe(1);
    expect(onWrong).toHaveBeenCalledTimes(1);
    expect(onWrong).toHaveBeenCalledWith("p", "^p", 0, false);
  });

  it("^ allein (Bauplan §5.3, eigene Lerneinheit) trifft wie jedes andere Zeichen - Dead ist hier der Zwischenzustand, danach die Leertaste", () => {
    setLayout("fr");
    const { result } = renderHook(() =>
      useTypingItem({ expected: "^", active: true, onComplete: vi.fn() }),
    );
    act(() => result.current.handleKey(taste("Dead")));
    expect(result.current.errors).toBe(0);
    act(() => result.current.handleKey(taste("^"))); // Totaste + Leertaste ⇒ „^" im zweiten keydown
    expect(result.current.done).toBe(true);
    expect(result.current.errors).toBe(0);
  });

  it('★ W1: Weg „de" (Layout „de"): Dead ist dieselbe Wartestellung wie überall - das fertige Zeichen zählt', () => {
    // ★ W1 (27.09.2026): Bis W1 übersprang Weg „de" ein Dead still, und der
    // nächste Anschlag wurde gewertet, als hätte es die Totaste nie gegeben
    // („^" + „p" traf ein „p", obwohl Windows „^p" schreibt). Jetzt gilt auf
    // JEDER Tastatur dieselbe Deutung (Johannes: „egal auf welchem Weg").
    setLayout("de"); // Vorgabe, aber ausdrücklich gesetzt für die Klarheit des Tests
    const onWrong = vi.fn();
    const onCorrect = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "â", active: true, onComplete: vi.fn(), onWrong, onCorrect }),
    );
    act(() => result.current.handleKey(taste("Dead")));
    expect(result.current.errors).toBe(0);
    expect(result.current.wrongTick).toBe(0);
    expect(onWrong).not.toHaveBeenCalled();
    expect(onCorrect).not.toHaveBeenCalled();
    expect(result.current.index).toBe(0);
    // das zusammengesetzte Zeichen trifft danach ganz normal.
    act(() => result.current.handleKey(taste("â")));
    expect(result.current.done).toBe(true);
    expect(result.current.errors).toBe(0);
  });
});
