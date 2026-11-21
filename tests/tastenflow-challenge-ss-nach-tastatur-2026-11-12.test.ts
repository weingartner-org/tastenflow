/**
 * Christina 11.11.2026 („dreiig"), Johannes 12.11.: Das ß bleibt im Challenge-Text.
 * Nur auf einer Tastatur ohne ß (Schweiz) wird es dort zu „ss" - auf der deutschen bleibt es.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, toLayoutText } from "../src/lib/typing/layouts";
import { verarbeiteEigenenText } from "../src/lib/typing/eigenerText";

afterEach(() => setLayout("de"));

describe("Challenge-Text mit ß", () => {
  it("der Text behält das ß (Challenge = verbietenSs aus)", () => {
    const v = verarbeiteEigenenText("Knapp dreißig Prozent.", { verbietenSs: false });
    expect(v.zeilen.join(" ")).toBe("Knapp dreißig Prozent.");
    expect(v.unbekannt).toEqual([]);
  });
  it("deutsche Tastatur: ß bleibt", () => {
    setLayout("de");
    expect(toLayoutText("dreißig Straße")).toBe("dreißig Straße");
  });
  it("Schweizer Tastatur: ß wird zu ss", () => {
    setLayout("ch");
    expect(toLayoutText("dreißig Straße")).toBe("dreissig Strasse");
  });
});
