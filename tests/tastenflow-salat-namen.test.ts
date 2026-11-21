/**
 * ★ 25.09.2026 (Entscheidung Johannes): Namen zählen im Buchstabensalat nicht.
 *
 * Das Lexikon kennt die Namen aus den Geschichten (Nils, Selin, Ilse …), damit
 * sie beim Vorlesen als Wort gesprochen werden. Im Salat sind sie gesperrt -
 * `src/lib/typing/uebungsformen/salatNamen.ts`.
 */
import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  pruefeSalatwort,
  salatVorrat,
  SALATWOERTER_DE,
  SALATWOERTER_EN,
} from "../src/lib/typing/uebungsformen/buchstabensalat";
import { SALAT_KEINE_WOERTER, SALAT_NAMEN } from "../src/lib/typing/uebungsformen/salatNamen";
import { isRealWord, normalizeWord } from "../src/lib/typing/lexicon";

const QUELLEN = [
  [SALATWOERTER_DE, "de"],
  [SALATWOERTER_EN, "en"],
] as const;

function findbar(lang: "de" | "en"): Set<string> {
  const liste = lang === "de" ? SALATWOERTER_DE : SALATWOERTER_EN;
  const alle = new Set<string>();
  for (const s of liste) for (const w of salatVorrat(s.wort, lang)) alle.add(w);
  return alle;
}

describe("Namen zählen im Buchstabensalat nicht", () => {
  it("„Nils\" aus „Insel\": eigene Auskunft, nicht „kenne ich nicht\"", () => {
    expect(pruefeSalatwort("Nils", "Insel", [], "de")).toEqual({ ok: false, grund: "name" });
    expect(pruefeSalatwort("Lena", "Nadel", [], "en")).toEqual({ ok: false, grund: "name" });
  });
  it("Abkürzungen zählen als unbekannt", () => {
    expect(pruefeSalatwort("km", "Kamel", [], "en").ok).toBe(false);
  });
  it("gewöhnliche Wörter, die auch Namen sind, zählen weiter", () => {
    expect(pruefeSalatwort("ernst", "Sterne", [], "de").ok).toBe(true);
  });
  it("kein gesperrtes Wort steht im Vorrat eines Quellworts", () => {
    for (const [, lang] of QUELLEN) {
      const alle = findbar(lang);
      for (const w of [...SALAT_NAMEN[lang], ...SALAT_KEINE_WOERTER[lang]])
        expect(alle.has(w), `${lang}: ${w}`).toBe(false);
    }
  });
  it("beim Vorlesen bleiben Namen Wörter - gesperrt ist nur der Salat", () => {
    expect(isRealWord("Nils", "de")).toBe(true);
  });
});

/**
 * Neue Geschichten bringen neue Namen. Jedes findbare Wort, das in der
 * macOS-Namensliste steht, muss hier bewusst als gewöhnliches Wort erlaubt
 * sein - sonst ist es ein neuer Name, der in `salatNamen.ts` gehört.
 */
const ERLAUBT: Record<"de" | "en", string[]> = {
  de: ["allen", "art", "bart", "darin", "ellen", "ernst", "herb", "kamel", "lila", "list", "rand", "real", "tal", "tor"],
  en: [
    "art", "case", "dale", "dawn", "dean", "earl", "gale", "grant", "hunter", "kit", "leads", "list", "lord",
    "marsh", "martin", "mason", "mat", "mats", "miles", "nils", "no", "norm", "old", "part", "pilot", "plastic",
    "price", "ram", "real", "rob", "rod", "roman", "root", "sir", "son", "space", "sue", "the", "those", "tuna", "win",
  ],
};
const NAMENSLISTE = "/usr/share/dict/propernames";

describe.skipIf(!existsSync(NAMENSLISTE))("★ Wächter: kein neuer Name im Vorrat", () => {
  const namen = new Set(readFileSync(NAMENSLISTE, "utf8").split("\n").map((w) => normalizeWord(w)));
  for (const [, lang] of QUELLEN)
    it(`${lang}: jeder Treffer aus der Namensliste ist bewusst erlaubt`, () => {
      const neu = [...findbar(lang)].filter((w) => namen.has(w) && !ERLAUBT[lang].includes(w));
      expect(neu).toEqual([]);
    });
});
