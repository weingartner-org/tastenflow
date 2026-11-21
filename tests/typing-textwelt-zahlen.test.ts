/**
 * TW-E9 (Textwelt): Zahlen-/Sonderzeichen-Charge (T5-Kontexte). Erzwingt: jede
 * Zeile ist tippbar (minTier ≠ null) und braucht wirklich die letzte Tastenstufe
 * (Ziffern/Sonderzeichen → minTier = 5), keine Dubletten, Manifest-Präsenz.
 * Bauplan: Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md §5 (TW-E9)
 */
import { describe, it, expect } from "vitest";
import {
  bausteinId,
  corpusManifest,
  minTierFor,
} from "../src/lib/typing";
import { ZAHLEN_CORPUS } from "../src/lib/typing/corpusZahlen";

// Korpus-Vertrag: nur der Basis-Zeichensatz (KEIN + = * / @ % € — die liefert der
// Generator dynamisch). Ziffern und : sind hier erlaubt.
const BASIS = /^[a-zäöüßA-ZÄÖÜ0-9 ,.\-?!:;]+$/;

describe("TW-E9 — Zahlen-Charge (T5-Kontexte, Basis-Zeichensatz)", () => {
  it("jede Zeile ist tippbar, braucht T5 (Ziffer) und bleibt im Basis-Zeichensatz", () => {
    for (const it of ZAHLEN_CORPUS) {
      const t = minTierFor(it.text, "de");
      expect(t, `"${it.text}" → Tier ${t}`).not.toBeNull();
      expect(t, `"${it.text}" sollte T5 sein`).toBe(5);
      expect(/[0-9]/.test(it.text), `keine Ziffer in "${it.text}"`).toBe(true);
      // KEINE Rechen-/Sonderzeichen in den Daten (die kommen aus dem Generator).
      expect(BASIS.test(it.text), `Fremdzeichen in "${it.text}"`).toBe(true);
    }
  });

  it("keine Dubletten + alle im Manifest", () => {
    const texts = ZAHLEN_CORPUS.map((i) => i.text);
    expect(new Set(texts).size).toBe(texts.length);
    const m = corpusManifest();
    const missing = ZAHLEN_CORPUS.filter(
      (it) => !m.indexOf.has(bausteinId(it.kind, it.text)),
    );
    expect(missing.map((i) => i.text)).toEqual([]);
  });
});
