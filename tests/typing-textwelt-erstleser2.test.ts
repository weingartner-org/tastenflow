/**
 * Erstleser-Nachlage 2 (Textwelt, wiederholbare Charge) — erzwingt die T2-Grenze
 * (jeder verbotene Buchstabe hebt den Tier), nur tippbare Zeichen, keine Dubletten,
 * Manifest-Präsenz. Bauplan §9 (wiederholbare Inhalts-Chargen).
 */
import { describe, it, expect } from "vitest";
import {
  bausteinId,
  corpusManifest,
  minTierFor,
} from "../src/lib/typing";
import { ERSTLESER2_CORPUS } from "../src/lib/typing/corpusErstleser2";

const TYPEABLE = /^[a-zäöüßA-ZÄÖÜ0-9 ,.\-?!:;]*$/;

describe("Erstleser-Nachlage 2 (T2-Grenze)", () => {
  it("jeder Baustein ist auf Tier 2 tippbar", () => {
    for (const it of ERSTLESER2_CORPUS) {
      const t = minTierFor(it.text, "de");
      expect(t, `"${it.text}" → Tier ${t}`).not.toBeNull();
      expect(t! <= 2, `"${it.text}" braucht Tier ${t} (>2)`).toBe(true);
      expect(it.text, it.text).toMatch(TYPEABLE);
    }
  });

  it("keine Dubletten + alle im Manifest", () => {
    const texts = ERSTLESER2_CORPUS.map((i) => i.text);
    expect(new Set(texts).size).toBe(texts.length);
    const m = corpusManifest();
    const missing = ERSTLESER2_CORPUS.filter(
      (it) => !m.indexOf.has(bausteinId(it.kind, it.text)),
    );
    expect(missing.map((i) => i.text)).toEqual([]);
  });
});
