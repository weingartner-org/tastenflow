/**
 * T2-Masse-Nachlage 3 (Textwelt, wiederholbare Charge §9) — erzwingt die reine
 * T2-Grenze, nur tippbare Zeichen, keine Dubletten, Manifest-Präsenz. Bauplan §9.
 */
import { describe, it, expect } from "vitest";
import {
  bausteinId,
  corpusManifest,
  minTierFor,
} from "../src/lib/typing";
import { T2MASSE3_CORPUS } from "../src/lib/typing/corpusT2Masse3";

const TYPEABLE = /^[a-zäöüßA-ZÄÖÜ0-9 ,.\-?!:;]*$/;

describe("T2-Masse-Nachlage 3 (reine T2-Grenze)", () => {
  it("jeder Baustein ist auf Tier 2 tippbar", () => {
    for (const it of T2MASSE3_CORPUS) {
      const t = minTierFor(it.text, "de");
      expect(t, `"${it.text}" → Tier ${t}`).not.toBeNull();
      expect(t! <= 2, `"${it.text}" braucht Tier ${t} (>2)`).toBe(true);
      expect(it.text, it.text).toMatch(TYPEABLE);
    }
  });

  it("keine Dubletten + alle im Manifest", () => {
    const texts = T2MASSE3_CORPUS.map((i) => i.text);
    expect(new Set(texts).size).toBe(texts.length);
    const m = corpusManifest();
    const missing = T2MASSE3_CORPUS.filter(
      (it) => !m.indexOf.has(bausteinId(it.kind, it.text)),
    );
    expect(missing.map((i) => i.text)).toEqual([]);
  });

  it("bringt echte T2-Masse (mind. 44 net-neue Zeilen)", () => {
    expect(T2MASSE3_CORPUS.length).toBeGreaterThanOrEqual(44);
  });
});
