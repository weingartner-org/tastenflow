/**
 * T3-Masse-Nachlage 2 (Textwelt, wiederholbare Charge §9) — erzwingt die T3-Grenze
 * (keine Ziffern/Sonderzeichen), nur tippbare Zeichen, keine Dubletten, Manifest-
 * Präsenz. Bauplan §9.
 */
import { describe, it, expect } from "vitest";
import {
  bausteinId,
  corpusManifest,
  minTierFor,
} from "../src/lib/typing";
import { T3MASSE2_CORPUS } from "../src/lib/typing/corpusT3Masse2";

const TYPEABLE = /^[a-zäöüßA-ZÄÖÜ0-9 ,.\-?!:;]*$/;

describe("T3-Masse-Nachlage 2 (T3-Grenze)", () => {
  it("jeder Baustein ist spätestens auf Tier 3 tippbar", () => {
    for (const it of T3MASSE2_CORPUS) {
      const t = minTierFor(it.text, "de");
      expect(t, `"${it.text}" → Tier ${t}`).not.toBeNull();
      expect(t! <= 3, `"${it.text}" braucht Tier ${t} (>3)`).toBe(true);
      expect(it.text, it.text).toMatch(TYPEABLE);
    }
  });

  it("keine Dubletten + alle im Manifest", () => {
    const texts = T3MASSE2_CORPUS.map((i) => i.text);
    expect(new Set(texts).size).toBe(texts.length);
    const m = corpusManifest();
    const missing = T3MASSE2_CORPUS.filter(
      (it) => !m.indexOf.has(bausteinId(it.kind, it.text)),
    );
    expect(missing.map((i) => i.text)).toEqual([]);
  });

  it("bringt echte Masse (mind. 44 net-neue Zeilen)", () => {
    expect(T3MASSE2_CORPUS.length).toBeGreaterThanOrEqual(44);
  });
});
