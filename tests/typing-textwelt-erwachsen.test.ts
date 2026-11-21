/**
 * TW-E13 (Textwelt): Erwachsenen-Charge (sachlich-humorvolle Texte, kein
 * Kinderton). Erzwingt: nur Stufe „erwachsen", Basis-Zeichensatz ohne Ziffern
 * (→ minTier ≤ 3), keine Dubletten, Manifest-Präsenz. (Alles selbst formuliert,
 * §10 — keine fremden Zitate.)
 * Bauplan: Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md §5 (TW-E13)
 */
import { describe, it, expect } from "vitest";
import {
  bausteinId,
  corpusManifest,
  minTierFor,
} from "../src/lib/typing";
import { ERWACHSEN_CORPUS } from "../src/lib/typing/corpusErwachsen";

const TYPEABLE = /^[a-zäöüßA-ZÄÖÜ ,.\-?!:;]*$/; // ohne Ziffern/Sonderzeichen

describe("TW-E13 — Erwachsenen-Charge", () => {
  it("nur Stufe «erwachsen»", () => {
    for (const it of ERWACHSEN_CORPUS) {
      expect(it.stufen, it.text).toEqual(["erwachsen"]);
    }
  });

  it("Basis-Zeichensatz ohne Ziffern → tippbar mit ≤ Tier 3", () => {
    for (const it of ERWACHSEN_CORPUS) {
      expect(it.text, it.text).toMatch(TYPEABLE);
      const t = minTierFor(it.text, "de");
      expect(t, `"${it.text}" → Tier ${t}`).not.toBeNull();
      expect(t! <= 3, `"${it.text}" braucht Tier ${t}`).toBe(true);
    }
  });

  it("keine Dubletten + alle im Manifest", () => {
    const texts = ERWACHSEN_CORPUS.map((i) => i.text);
    expect(new Set(texts).size).toBe(texts.length);
    const m = corpusManifest();
    const missing = ERWACHSEN_CORPUS.filter(
      (it) => !m.indexOf.has(bausteinId(it.kind, it.text)),
    );
    expect(missing.map((i) => i.text)).toEqual([]);
  });
});
