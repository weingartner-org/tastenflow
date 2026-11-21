/**
 * Erstleser-Nachlage 3 (Textwelt, wiederholbare Charge §9) — erzwingt die reine
 * TIER-1-Grenze (jeder verbotene Buchstabe hebt den Tier → Bruch), nur tippbare
 * Zeichen, keine Dubletten, Manifest-Präsenz. Bauplan §9 (wiederholbare Chargen).
 */
import { describe, it, expect } from "vitest";
import {
  bausteinId,
  corpusManifest,
  minTierFor,
} from "../src/lib/typing";
import { ERSTLESER3_CORPUS } from "../src/lib/typing/corpusErstleser3";

const TYPEABLE = /^[a-zäöüßA-ZÄÖÜ0-9 ,.\-?!:;]*$/;

describe("Erstleser-Nachlage 3 (reine T1-Grenze)", () => {
  it("jeder Baustein ist auf Tier 1 tippbar", () => {
    for (const it of ERSTLESER3_CORPUS) {
      const t = minTierFor(it.text, "de");
      expect(t, `"${it.text}" → Tier ${t}`).not.toBeNull();
      expect(t! <= 1, `"${it.text}" braucht Tier ${t} (>1)`).toBe(true);
      expect(it.text, it.text).toMatch(TYPEABLE);
    }
  });

  it("keine Dubletten + alle im Manifest", () => {
    const texts = ERSTLESER3_CORPUS.map((i) => i.text);
    expect(new Set(texts).size).toBe(texts.length);
    const m = corpusManifest();
    const missing = ERSTLESER3_CORPUS.filter(
      (it) => !m.indexOf.has(bausteinId(it.kind, it.text)),
    );
    expect(missing.map((i) => i.text)).toEqual([]);
  });

  it("liefert echte T1-Masse (die Audit-Lücke ≤T1=1 ist geschlossen)", () => {
    expect(ERSTLESER3_CORPUS.length).toBeGreaterThanOrEqual(40);
  });
});
