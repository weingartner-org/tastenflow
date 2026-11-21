import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { ALL_PROGRAMS } from "../src/lib/allPrograms";

// Johannes 21.09.2026: „manchmal werden in der Lernwerkstatt nicht 5 sondern
// nur 3 Apps angezeigt". Punktgenau und Klangpunkte waren nur über die
// Server-Freigabe sichtbar; kam die Antwort nicht an, blieben drei übrig.

const holen = vi.fn();
vi.mock("../src/backend", () => ({
  getBackend: () => Promise.resolve({ getProgrammeOverrides: holen }),
}));

import { useProgrammeCatalog } from "../src/lib/useProgrammeReleases";

const LERN = ["tippen", "braille", "klangpunkte", "hoerbuch", "computer", "plus", "lexami"];
// Im Bau und deshalb im Code geparkt - sie gehören zur Liste, aber nicht zur
// Auslieferung. Plus stand hier vom 22. bis 23.09.2026 und ist seither frei.
const LERN_GEPARKT: string[] = [];

describe("Programm-Katalog der Lernwerkstatt", () => {
  beforeEach(() => {
    localStorage.clear();
    holen.mockReset();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it.skip("die Lernprogramme sind auch ohne Antwort des Servers freigegeben (Code-Default = Live-Stand)", async () => {
    holen.mockRejectedValue(new Error("Netz weg"));
    const { result } = renderHook(() => useProgrammeCatalog());
    for (const k of LERN) expect(result.current.released(k)).toBe(true);
    // Weiter geparkt bleiben die Entwürfe.
    expect(result.current.released("hoeren-tempo")).toBe(false);
    for (const k of LERN_GEPARKT) expect(result.current.released(k)).toBe(false);
    expect(ALL_PROGRAMS.filter((p) => p.type === "lern").map((p) => p.key).sort())
      .toEqual([...LERN, ...LERN_GEPARKT].sort());
  });

  it("nach einem Fehlversuch wird neu geladen und die Freigabe des Servers gilt", async () => {
    vi.useFakeTimers();
    holen.mockRejectedValueOnce(new Error("Aussetzer")).mockResolvedValue({ braille: { released: false } });
    const { result } = renderHook(() => useProgrammeCatalog());
    await act(async () => { await vi.advanceTimersByTimeAsync(10); });
    expect(holen).toHaveBeenCalledTimes(1);
    await act(async () => { await vi.advanceTimersByTimeAsync(2100); });
    expect(holen).toHaveBeenCalledTimes(2);
    expect(result.current.released("braille")).toBe(false);
  });

  it("der zuletzt geladene Stand wird gemerkt und beim nächsten Besuch sofort benutzt", async () => {
    holen.mockResolvedValueOnce({ computer: { released: false } });
    const erst = renderHook(() => useProgrammeCatalog());
    await waitFor(() => expect(erst.result.current.released("computer")).toBe(false));
    erst.unmount();

    // Zweiter Besuch, der Server antwortet nicht: der gemerkte Stand gilt trotzdem.
    holen.mockRejectedValue(new Error("Netz weg"));
    const zweit = renderHook(() => useProgrammeCatalog());
    expect(zweit.result.current.released("computer")).toBe(false);
  });

  it("ein kaputter Merkzettel wird ignoriert", () => {
    localStorage.setItem("sensorik:programme-overrides:v1", "{kaputt");
    holen.mockRejectedValue(new Error("Netz weg"));
    const { result } = renderHook(() => useProgrammeCatalog());
    expect(result.current.released("tippen")).toBe(true);
  });
});
