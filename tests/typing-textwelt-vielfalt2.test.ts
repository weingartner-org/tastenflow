/**
 * Vielfalt-Nachlage 2 (Textwelt, wiederholbare Charge §9) — erzwingt die T3-Grenze
 * (jeder Text spätestens auf Tier 3 tippbar), nur tippbare Zeichen, keine Dubletten,
 * Manifest-Präsenz. Bauplan §9 (wiederholbare Inhalts-Chargen).
 */
import { describe, it, expect } from "vitest";
import {
  bausteinId,
  corpusManifest,
  minTierFor,
} from "../src/lib/typing";
import { VIELFALT2_CORPUS } from "../src/lib/typing/corpusVielfalt2";

const TYPEABLE = /^[a-zäöüßA-ZÄÖÜ0-9 ,.\-?!:;]*$/;

describe("Vielfalt-Nachlage 2 (T3-Grenze)", () => {
  it("jeder Baustein ist spätestens auf Tier 3 tippbar", () => {
    for (const it of VIELFALT2_CORPUS) {
      const t = minTierFor(it.text, "de");
      expect(t, `"${it.text}" → Tier ${t}`).not.toBeNull();
      expect(t! <= 3, `"${it.text}" braucht Tier ${t} (>3)`).toBe(true);
      expect(it.text, it.text).toMatch(TYPEABLE);
    }
  });

  it("keine Dubletten + alle im Manifest", () => {
    const texts = VIELFALT2_CORPUS.map((i) => i.text);
    expect(new Set(texts).size).toBe(texts.length);
    const m = corpusManifest();
    const missing = VIELFALT2_CORPUS.filter(
      (it) => !m.indexOf.has(bausteinId(it.kind, it.text)),
    );
    expect(missing.map((i) => i.text)).toEqual([]);
  });

  it("bringt echte Masse (mind. 40 net-neue Zeilen)", () => {
    expect(VIELFALT2_CORPUS.length).toBeGreaterThanOrEqual(40);
  });
});
