import { describe, expect, it } from "vitest";
import { readPlanAt, zeileGanzSprechtext } from "../src/lib/typing/voice";

const modi = { letters: false, words: true, sentences: true, zeileGanz: true };
const istWort = (t: string) => /^(der|hund|bellt)$/i.test(t.replace(/[^\p{L}]/gu, ""));

describe("Mein Training liest die ganze Zeile (Sara, 21.10.2026)", () => {
  it("Zahlenzeile wird am Anfang ganz gelesen", () => {
    expect(readPlanAt("12 34 56", 0, modi, istWort)[0]).toBe("12 34 56");
  });
  it("Sonderzeichen werden beim Namen genannt", () => {
    const t = zeileGanzSprechtext("a;(b)");
    expect(t).not.toMatch(/[;()]/);
    expect(readPlanAt("a;(b)", 0, modi, istWort)[0]).toBe(t);
  });
  it("Übungssilben bleiben beim Buchstabieren", () => {
    expect(readPlanAt("fj fj", 0, modi, istWort)).toEqual(["f"]);
  });
  it("ohne zeileGanz bleibt es wie vorher", () => {
    expect(readPlanAt("12 34", 0, { ...modi, zeileGanz: false }, istWort)[0]).not.toBe("12 34");
  });
});
