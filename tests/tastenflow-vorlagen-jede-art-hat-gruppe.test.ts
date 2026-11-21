/**
 * ★★★ Jede Vorlagen-Art, die `vorlagenFuer` für irgendeine Sprache liefert, hat im
 * Wähler (`EigenerTextQuelle.tsx`) eine Gruppe - sonst erscheint sie NIE
 * (27.09.2026: die französischen „racines" seit E10a und die spanischen „raices"
 * waren unsichtbar, weil der Wähler nur lektion/fremd/wurzeln/code kannte).
 * Fehlerklasse statt Stelle: der Wächter liest die Arten aus den Daten.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { vorlagenFuer } from "../src/lib/typing/vorlagen";
import type { Lang } from "../src/lib/typing/account";

const QUELLE = readFileSync("src/components/lernwerkstatt/klasse/EigenerTextQuelle.tsx", "utf8");
const GRUPPEN = new Set([...QUELLE.matchAll(/\{ art: "([a-z]+)", label:/g)].map((m) => m[1]));

describe("Vorlagen-Wähler: jede gelieferte Art hat eine Gruppe", () => {
  // ★ TR-S (09.10.2026): „tr" dazu - „Kökler ve alıntılar" (Art „kokler").
  // ★ IT-S (03.10.2026): „it" dazu - „Radici e prestiti" (Art „radici").
  for (const lang of ["de", "en", "fr", "es", "it", "pl", "tr", "cs"] as Lang[]) {
    for (const fuer of ["uebung", "challenge"] as const) {
      it(`${lang}/${fuer}`, () => {
        const arten = new Set(vorlagenFuer({ fuer, lang }).map((v) => v.art));
        expect([...arten].filter((a) => !GRUPPEN.has(a))).toEqual([]);
      });
    }
  }
  it("Gegenprobe: die Gruppen wurden gelesen, und eine erfundene Art fiele auf", () => {
    expect(GRUPPEN.has("racines")).toBe(true);
    expect(GRUPPEN.has("raices")).toBe(true);
    expect(GRUPPEN.has("radici")).toBe(true);
    expect(GRUPPEN.has("kokler")).toBe(true);
    expect(GRUPPEN.has("korzenie")).toBe(true);
    expect(GRUPPEN.has("koreny")).toBe(true);
    expect(["gibtsnicht"].filter((a) => !GRUPPEN.has(a))).toEqual(["gibtsnicht"]);
  });
  it("französisch und spanisch liefern ihre Wurzel-Vorlagen wirklich", () => {
    expect(vorlagenFuer({ fuer: "uebung", lang: "fr" }).some((v) => v.art === "racines")).toBe(true);
    expect(vorlagenFuer({ fuer: "uebung", lang: "es" }).some((v) => v.art === "raices")).toBe(true);
    expect(vorlagenFuer({ fuer: "uebung", lang: "it" }).some((v) => v.art === "radici")).toBe(true);
    expect(vorlagenFuer({ fuer: "uebung", lang: "tr" }).some((v) => v.art === "kokler")).toBe(true);
    expect(vorlagenFuer({ fuer: "uebung", lang: "pl" }).some((v) => v.art === "korzenie")).toBe(true);
    expect(vorlagenFuer({ fuer: "uebung", lang: "cs" }).some((v) => v.art === "koreny")).toBe(true);
  });
});
