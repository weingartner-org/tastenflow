/**
 * ★ G4-NAHT (25.10.2026): das griechische Fragezeichen U+037E (Taste Q auf „Greek (220)", gemessen) gilt als `;` - die
 * Texte stehen in NFC, darin ist U+037E schon `;`.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTypingItem } from "@/components/typing/useTypingItem";
import { alsSollZeichen, deuteAnschlag } from "@/lib/typing/anschlagDeuten";
import { GRIECHISCHES_FRAGEZEICHEN, layoutById, setLayout } from "@/lib/typing/layouts";

afterEach(() => setLayout("de"));

const taste = (key: string, code?: string) => ({ key, code, preventDefault: () => {} }) as unknown as KeyboardEvent;

describe("G4-NAHT: griechisches Fragezeichen", () => {
  it("U+037E ist nach NFC `;` - und wird als `;` gedeutet", () => {
    expect(GRIECHISCHES_FRAGEZEICHEN.normalize("NFC")).toBe(";");
    expect(alsSollZeichen(GRIECHISCHES_FRAGEZEICHEN)).toBe(";");
    expect(alsSollZeichen("\u0387")).toBe("\u00B7");
    const l = layoutById("el-220");
    expect(deuteAnschlag({ key: GRIECHISCHES_FRAGEZEICHEN, code: "KeyQ" }, null, l).deutung).toEqual({ art: "zeichen", zeichen: ";" });
  });

  it("el-220: „Τι;\" mit der Taste Q ohne Fehler", () => {
    setLayout("el-220");
    const onComplete = vi.fn();
    const { result } = renderHook(() => useTypingItem({ expected: "τι;", active: true, onComplete }));
    for (const [k, c] of [["τ", "KeyT"], ["ι", "KeyI"], [GRIECHISCHES_FRAGEZEICHEN, "KeyQ"]]) act(() => result.current.handleKey(taste(k, c)));
    expect(result.current.errors).toBe(0);
    expect(onComplete).toHaveBeenCalledWith(0);
  });

  it("Gegenprobe: jedes andere Zeichen bleibt, was es ist (ASCII, Umlaute, Kyrillisch)", () => {
    for (const z of [";", "?", "a", "ä", "ж", "·", "΄"]) expect(alsSollZeichen(z), z).toBe(z);
  });
});
