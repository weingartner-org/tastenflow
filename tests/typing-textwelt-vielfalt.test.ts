/**
 * TW-E7 (Textwelt): Vielfalt-Charge (mehr frühe T2-Bausteine: Alltags-Sätze +
 * gemeinfreie Sprichwörter). Erzwingt die T2-Grenze (jeder verbotene Buchstabe
 * hebt den Tier → Bruch), nur tippbare Zeichen, keine Dubletten, Manifest-Präsenz.
 * Bauplan: Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md §5 (TW-E7)
 */
import { describe, it, expect } from "vitest";
import {
  bausteinId,
  corpusManifest,
  minTierFor,
} from "../src/lib/typing";
import { VIELFALT_CORPUS } from "../src/lib/typing/corpusVielfalt";

const TYPEABLE = /^[a-zäöüßA-ZÄÖÜ0-9 ,.\-?!:;]*$/;

describe("TW-E7 — Vielfalt-Charge (T2-Grenze)", () => {
  it("jeder Baustein ist auf Tier 2 tippbar (nie höher)", () => {
    for (const it of VIELFALT_CORPUS) {
      const t = minTierFor(it.text, "de");
      expect(t, `"${it.text}" → Tier ${t}`).not.toBeNull();
      expect(t! <= 2, `"${it.text}" braucht Tier ${t} (>2)`).toBe(true);
    }
  });

  it("nur tippbare Zeichen", () => {
    for (const it of VIELFALT_CORPUS) expect(it.text, it.text).toMatch(TYPEABLE);
  });

  it("keine Dubletten in der Charge", () => {
    const texts = VIELFALT_CORPUS.map((i) => i.text);
    expect(new Set(texts).size).toBe(texts.length);
  });

  it("die Charge steckt im Manifest (nicht per Dedup verschluckt)", () => {
    const m = corpusManifest();
    const missing = VIELFALT_CORPUS.filter(
      (it) => !m.indexOf.has(bausteinId(it.kind, it.text)),
    );
    expect(missing.map((i) => i.text)).toEqual([]);
  });
});
