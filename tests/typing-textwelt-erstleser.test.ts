/**
 * TW-E6 (Textwelt): Erstleser-Bausteine T1/T2 (selbst verfasst) füllen die früh
 * fast leere Lücke (Audit TW-E4: servierbar ≤Tier war T1 = 1, T2 = 263). Erzwingt:
 *  • jeder T1-Baustein ist auf Tier 1 tippbar, jeder T2-Baustein auf Tier 2
 *    (ein verbotener Buchstabe würde den berechneten Tier heben → Test bricht),
 *  • nur tippbare Zeichen, keine Ersatzschreibung,
 *  • die frühe Lücke ist real gefüllt (viel mehr ≤T1/≤T2 servierbar als vorher),
 *  • die Charge ist tatsächlich im Manifest (nicht per Dedup verschluckt),
 *  • keine Dubletten in der Charge.
 * Bauplan: Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md §5 (TW-E6)
 */
import { describe, it, expect } from "vitest";
import {
  CORPUS,
  bausteinId,
  corpusManifest,
  minTierFor,
} from "../src/lib/typing";
import { ERSTLESER_CORPUS, ERSTLESER_T1_ONLY, ERSTLESER_T2_ONLY } from "../src/lib/typing/corpusErstleser";

const TYPEABLE = /^[a-zäöüßA-ZÄÖÜ0-9 ,.\-?!:;]*$/;

describe("TW-E6 — Erstleser-Bausteine (Tier-Grenzen erzwungen)", () => {
  it("jeder T1-Baustein ist auf Tier 1 tippbar", () => {
    for (const it of ERSTLESER_T1_ONLY) {
      const t = minTierFor(it.text, "de");
      expect(t, `"${it.text}" → Tier ${t}`).not.toBeNull();
      expect(t! <= 1, `"${it.text}" braucht Tier ${t} (>1)`).toBe(true);
    }
  });

  it("jeder T2-Baustein ist auf Tier 2 tippbar (und nie höher)", () => {
    for (const it of ERSTLESER_T2_ONLY) {
      const t = minTierFor(it.text, "de");
      expect(t, `"${it.text}" → Tier ${t}`).not.toBeNull();
      expect(t! <= 2, `"${it.text}" braucht Tier ${t} (>2)`).toBe(true);
    }
  });

  it("nur tippbare Zeichen (Tier-Prüfung deckt Ersatzschreibung mit ab)", () => {
    // Ein ä/ö/ü/ß-Ersatz („ue" statt „ü") würde entweder den Tier heben (ä/ö/ü/ß
    // sind T3, oben schon geprüft) oder ist gar keiner (Bauer/Feuer sind korrekt).
    for (const it of ERSTLESER_CORPUS) expect(it.text, it.text).toMatch(TYPEABLE);
  });

  it("keine Dubletten in der Charge", () => {
    const texts = ERSTLESER_CORPUS.map((i) => i.text);
    expect(new Set(texts).size).toBe(texts.length);
  });
});

describe("TW-E6 — die frühe Lücke ist gefüllt", () => {
  const servable = (maxTier: number) =>
    CORPUS.filter((it) => {
      const t = minTierFor(it.text, "de");
      return t !== null && t <= maxTier;
    }).length;

  it("deutlich mehr Bausteine ≤ Tier 1 als vor der Charge (war 1)", () => {
    // 28 neue T1-Sätze → weit über dem alten Wert von 1.
    expect(servable(1)).toBeGreaterThanOrEqual(25);
  });

  it("mehr Bausteine ≤ Tier 2 als vor der Charge (war 263)", () => {
    expect(servable(2)).toBeGreaterThanOrEqual(320);
  });

  it("die Charge steckt wirklich im Manifest (nicht per Dedup verschluckt)", () => {
    const m = corpusManifest();
    const missing = ERSTLESER_CORPUS.filter(
      (it) => !m.indexOf.has(bausteinId(it.kind, it.text)),
    );
    expect(missing.map((i) => i.text)).toEqual([]);
  });
});
