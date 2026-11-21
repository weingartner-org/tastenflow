/**
 * Feststelltaste-Warnung für Rätsel und Freies Schreiben (Johannes 12.10.2026):
 * bei JEDEM Buchstaben, solange die Feststelltaste an ist.
 */
import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useFeststelltasteWarnung } from "@/components/typing/FeststelltasteWarnung";

const taste = (key: string, caps: boolean) => ({ key, getModifierState: (m: "CapsLock") => m === "CapsLock" && caps });

describe("useFeststelltasteWarnung", () => {
  it("zeigt die Warnung bei einem Buchstaben mit Feststelltaste", () => {
    const { result } = renderHook(() => useFeststelltasteWarnung("de"));
    expect(result.current.hinweis).toBeNull();
    act(() => result.current.pruefe(taste("a", true)));
    expect(result.current.hinweis).not.toBeNull();
  });
  it("schweigt ohne Feststelltaste und bei Nicht-Buchstaben", () => {
    const { result } = renderHook(() => useFeststelltasteWarnung("de"));
    act(() => result.current.pruefe(taste("a", false)));
    act(() => result.current.pruefe(taste("Enter", true)));
    act(() => result.current.pruefe(taste("1", true)));
    expect(result.current.hinweis).toBeNull();
  });
});
