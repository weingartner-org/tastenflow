/**
 * ★ E8a-Nachtrag (26.09.2026, Bauplan §15 Falle 1): Der Generator serviert
 * Korpus-Zeilen über `corpusEntriesFor` (corpusManifest.ts), nicht über
 * `corpusItemsFor`. Dort stand noch die binäre Weiche
 * `q.lang === "en" ? CORPUS_EN : CORPUS` - für den Weg „fr" kam still der
 * DEUTSCHE Korpus (Zeilen ohne `nurWeg` passen auf jeden Weg), und keine
 * einzige französische Zeile hatte einen Ledger-Index.
 */
import { describe, it, expect } from "vitest";
import { CORPUS, CORPUS_EN, CORPUS_FR, allowedForTier } from "../src/lib/typing";
import { corpusEntriesFor, corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";

describe("Korpus im Generator-Weg für Lernweg „fr\"", () => {
  const allowed = allowedForTier(2, "fr");

  it("liefert NUR französische Zeilen (keine einzige deutsche)", () => {
    const fr = new Set(CORPUS_FR.map((c) => c.text));
    const out = corpusEntriesFor({ stufe: "kids", allowed, lang: "fr", lernweg: "fr" });
    expect(out.length).toBeGreaterThan(50);
    const fremd = out.filter((e) => !fr.has(e.text));
    expect(fremd.map((e) => e.text).slice(0, 5)).toEqual([]);
  });

  it("jede französische Zeile hat einen Ledger-Index", () => {
    const m = corpusManifest();
    const out = corpusEntriesFor({ stufe: "kids", allowed, lang: "fr", lernweg: "fr" });
    for (const e of out) expect(m.ids[e.index]).toBeDefined();
  });

  it("die Manifest-Version bleibt dieselbe wie ohne CORPUS_FR (alle FR-IDs stehen schon im Anker)", () => {
    expect(corpusManifest().version).toBe(manifestFor([...CORPUS, ...CORPUS_EN]).version);
  });

  it("Gegenprobe: Deutsch bekommt keine französische Zeile", () => {
    const fr = new Set(CORPUS_FR.map((c) => c.text));
    const out = corpusEntriesFor({ stufe: "kids", allowed: allowedForTier(5, "de"), lang: "de", lernweg: "de" });
    expect(out.length).toBeGreaterThan(100);
    expect(out.filter((e) => fr.has(e.text))).toEqual([]);
  });
});
