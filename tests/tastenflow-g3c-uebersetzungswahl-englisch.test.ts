/**
 * ★ G3c (25.10.2026): Hilfen und Rechtstexte wählen ihre Fassung über
 * `waehleUebersetzung`. Fehlt einer neuen Sprache die eigene Fassung, gilt die
 * englische - nie still die deutsche Grundfassung (Falle 30).
 */
import { describe, expect, it } from "vitest";
import { waehleUebersetzung } from "../src/lib/bedienSprache/uebersetzungsWahl";
import type { BedienSprache } from "../src/lib/bedienSprache/sprache";

const NEUN: BedienSprache[] = ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"];

describe("waehleUebersetzung - Rückfall auf Englisch", () => {
  it("Deutsch bleibt die Grundfassung des Aufrufers", () => {
    expect(waehleUebersetzung("de", { en: "E", cs: "C" })).toBeUndefined();
  });

  it("eine vorhandene Fassung gewinnt", () => {
    expect(waehleUebersetzung("cs", { en: "E", cs: "C" })).toBe("C");
  });

  it.each(NEUN)("%s ohne eigene Fassung bekommt Englisch, nicht Deutsch", (sprache) => {
    expect(waehleUebersetzung(sprache, { en: "E", cs: "C" })).toBe("E");
  });
});
