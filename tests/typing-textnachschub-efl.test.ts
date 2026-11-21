/**
 * TN-E8 (Text-Nachschub §7): englische Erstleser-Ebene auf EFL-Grundwortschatz.
 * Prüfbericht 27.07.: die frühe englische Ebene war „de facto Lyrik, kein
 * Anfängertext" (nettles, flint, tide, dear=teuer).
 */
import { describe, expect, it } from "vitest";
import {
  EN_ERSTLESER2_CORPUS,
  EN_T1,
  EN_T2,
} from "../src/lib/typing/corpusEnErstleser2";
import { CORPUS_EN } from "../src/lib/typing/corpus";
import { validateHerkunft } from "../src/lib/typing/serien";
import { bausteinKey } from "../src/lib/typing/ledger";
import { minTierFor } from "../src/lib/typing/tiers";
import { corpusEntriesFor } from "../src/lib/typing/corpusManifest";
import { TIER_CHARS } from "../src/lib/typing/tiers";

const allowedUpTo = (tier: number): Set<string> => {
  const s = new Set<string>();
  for (let t = 0; t <= tier; t++) for (const c of TIER_CHARS[t] ?? []) s.add(c);
  return s;
};

describe("TN-E8 EFL-Erstleser (Englisch)", () => {
  it("jeder Block hält sein Ziel-Tier exakt ein", () => {
    expect(EN_T1.length).toBeGreaterThanOrEqual(25);
    expect(EN_T2.length).toBeGreaterThanOrEqual(40);
    for (const e of EN_T1) expect(minTierFor(e.text, "de"), `T1: ${e.text}`).toBeLessThanOrEqual(1);
    for (const e of EN_T2) expect(minTierFor(e.text, "de"), `T2: ${e.text}`).toBeLessThanOrEqual(2);
  });

  it("Kern-Grundwortschatz statt seltener Wörter", () => {
    const text = EN_ERSTLESER2_CORPUS.map((e) => e.text.toLowerCase()).join(" ");
    // Die Wörter, die ein Kind im ersten/zweiten Englischjahr wirklich kennt:
    for (const w of ["i like", "it is", "the cat", "she has", "we look", "school", "book", "good"])
      expect(text, w).toContain(w);
    // Und die Lyrik-Vokabeln kommen hier NICHT vor:
    for (const w of ["nettle", "flint", "fern", "kettle"]) expect(text).not.toContain(w);
  });

  it("Sprachregeln: keine Apostrophe, keine Anführungszeichen, keine Ziffern", () => {
    for (const e of EN_ERSTLESER2_CORPUS) {
      expect(e.text, e.text).not.toMatch(/['’„“”"«»…–—0-9]/);
      expect(e.text.length, e.text).toBeLessThanOrEqual(85);
      expect(validateHerkunft(e.herkunft!), e.text).toEqual([]);
    }
  });

  it("keine Dublette gegen den englischen Bestand", () => {
    const meine = new Set(EN_ERSTLESER2_CORPUS.map((e) => bausteinKey("", e.text)));
    const zaehler = new Map<string, number>();
    for (const e of CORPUS_EN) {
      const k = bausteinKey("", e.text);
      if (meine.has(k)) zaehler.set(k, (zaehler.get(k) ?? 0) + 1);
    }
    expect([...zaehler.entries()].filter(([, n]) => n > 1).map(([k]) => k)).toEqual([]);
  });

  it("die seltenen Lyrik-Zeilen sind für Anfänger nicht mehr im Angebot", () => {
    // ACHTUNG beim Vergleichen: Unterhalb T4 serviert `fitText` die Zeilen OHNE
    // Punkt („Nettles are near") — deshalb gegen die FITTED-Form prüfen.
    const fitted = (stufe: "kids" | "teens") =>
      corpusEntriesFor({ lernweg: "de", stufe, allowed: allowedUpTo(2), lang: "en" }).map((e) => e.text);
    const fruehA = fitted("kids");
    for (const t of ["Nettles are near", "Salt is fine and dear", "Neil finds a flint"])
      expect(fruehA, t).not.toContain(t);
    // … für die höheren Stufen bleiben sie erhalten (nichts gelöscht):
    const bestand = CORPUS_EN.map((e) => e.text);
    for (const t of ["Nettles are near.", "Salt is fine and dear."]) expect(bestand).toContain(t);
    expect(fitted("teens")).toContain("Nettles are near");
  });

  it("die frühe englische Ebene bleibt dabei gut gefüllt", () => {
    const a1 = corpusEntriesFor({ lernweg: "de", stufe: "kids", allowed: allowedUpTo(1), lang: "en" }).length;
    const a2 = corpusEntriesFor({ lernweg: "de", stufe: "kids", allowed: allowedUpTo(2), lang: "en" }).length;
    expect(a1).toBeGreaterThanOrEqual(60);
    expect(a2).toBeGreaterThanOrEqual(440);
  });
});
