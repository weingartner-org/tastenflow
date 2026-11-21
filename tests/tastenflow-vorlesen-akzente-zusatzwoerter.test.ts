/**
 * ★ 26.09.2026 (Befund E13a §11): Zusatzwörter fürs Vorlesen („ganzes Wort
 * statt buchstabieren") werden in `TypingSession` mit `normalizeWord(t, lang)`
 * nachgeschlagen. Die Menge aus einem eigenen Text muss mit DERSELBEN Regel
 * gebaut sein - sonst stünde „élève" als „lve" darin und würde nie gefunden.
 */
import { describe, it, expect } from "vitest";
import { woerterAusEigenemText } from "../src/lib/typing/eigeneWoerter";
import { normalizeWord } from "../src/lib/typing/lexicon";

describe("Zusatzwörter mit Akzenten", () => {
  it("fr: das Wort behält seine Akzente, das Nachschlagen findet es", () => {
    const menge = woerterAusEigenemText(["Une élève de Léa fait de l'équitation"], "fr");
    for (const w of ["élève", "Léa", "l'équitation"]) expect(menge.has(normalizeWord(w, "fr")), w).toBe(true);
  });

  it("Gegenprobe: ohne Sprache wird „élève\" zu „lve\" verstümmelt", () => {
    expect(woerterAusEigenemText(["élève"]).has("élève")).toBe(false);
  });

  it("de: unverändert - dieselbe Menge mit und ohne Sprachangabe", () => {
    const zeilen = ["Die Bären gähnen über den Fluss", "Straße und Café"];
    expect([...woerterAusEigenemText(zeilen, "de")]).toEqual([...woerterAusEigenemText(zeilen)]);
  });
});
