/**
 * TW-E8 (Textwelt): Fakten-Charge — kinderleichte, unstrittig wahre Elementar-
 * Fakten. Erzwingt Tier-Grenzen (T2-Fakten ≤ Tier 2, alle ≤ Tier 3), nur tippbare
 * Zeichen, keine Zahlen (Fakten sollen ohne T5 auskommen), keine Dubletten,
 * Manifest-Präsenz. (Die WAHRHEIT der Aussagen ist beim Verfassen geprüft — der
 * Test sichert die Form, nicht den Faktengehalt.)
 * Bauplan: Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md §5 (TW-E8)
 */
import { describe, it, expect } from "vitest";
import {
  bausteinId,
  corpusManifest,
  minTierFor,
} from "../src/lib/typing";
import { FAKTEN_CORPUS, FAKTEN_T2_ONLY } from "../src/lib/typing/corpusFakten";

const TYPEABLE = /^[a-zäöüßA-ZÄÖÜ ,.\-?!:;]*$/; // bewusst OHNE 0-9

describe("TW-E8 — Fakten-Charge", () => {
  it("alle Fakten sind ≤ Tier 3 tippbar (voller Alphabet-Stand)", () => {
    for (const it of FAKTEN_CORPUS) {
      const t = minTierFor(it.text, "de");
      expect(t, `"${it.text}" → Tier ${t}`).not.toBeNull();
      expect(t! <= 3, `"${it.text}" braucht Tier ${t} (>3)`).toBe(true);
    }
  });

  it("die T2-Fakten sind schon auf Tier 2 tippbar", () => {
    for (const it of FAKTEN_T2_ONLY) {
      const t = minTierFor(it.text, "de");
      expect(t! <= 2, `"${it.text}" braucht Tier ${t} (>2)`).toBe(true);
    }
  });

  it("keine Ziffern (Fakten ohne Zahlen) und nur tippbare Zeichen", () => {
    for (const it of FAKTEN_CORPUS) {
      expect(it.text, it.text).toMatch(TYPEABLE);
      expect(/[0-9]/.test(it.text), `Ziffer in "${it.text}"`).toBe(false);
    }
  });

  it("keine Dubletten + alle im Manifest (nicht per Dedup verschluckt)", () => {
    const texts = FAKTEN_CORPUS.map((i) => i.text);
    expect(new Set(texts).size).toBe(texts.length);
    const m = corpusManifest();
    const missing = FAKTEN_CORPUS.filter(
      (it) => !m.indexOf.has(bausteinId(it.kind, it.text)),
    );
    expect(missing.map((i) => i.text)).toEqual([]);
  });
});
