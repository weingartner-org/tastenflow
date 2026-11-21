/**
 * TN-E7 (Text-Nachschub §7): zweite englische Serien-Welle + englische
 * Themenstränge. Prüfbericht 27.07.: 21 deutsche gegen 3 englische Serien —
 * die englische Bücherei war nach drei Serien ausgelesen.
 */
import { describe, expect, it } from "vitest";
import { SERIEN, validateHerkunft } from "../src/lib/typing/serien";
import { SERIEN_EN2 } from "../src/lib/typing/serienEn2";
import { computeSerieMinTier, serieLineCount, validateSerie } from "../src/lib/typing/serie";
import { CORPUS_EN } from "../src/lib/typing/corpus";
import { EN_WIEDERKEHR_CORPUS } from "../src/lib/typing/corpusEnWiederkehr";
import { ARCS } from "../src/lib/typing/arcs";
import { bausteinKey } from "../src/lib/typing/ledger";

const enSerien = SERIEN.filter((s) => s.lang === "en");

describe("TN-E7 englische Serien", () => {
  it("vier neue Serien, strukturell gültig und tier-ehrlich", () => {
    expect(SERIEN_EN2).toHaveLength(4);
    for (const s of SERIEN_EN2) {
      expect(s.lang, s.slug).toBe("en");
      expect(validateSerie(s, "de").problems, s.slug).toEqual([]);
      expect(computeSerieMinTier(s, "de"), s.slug).toBe(s.minTier);
      for (const e of s.etappen) expect(e.lines, s.slug).toHaveLength(12);
    }
    expect(SERIEN_EN2.reduce((a, s) => a + serieLineCount(s), 0)).toBe(216);
  });

  it("die englische Bücherei ist nicht mehr nach drei Serien ausgelesen", () => {
    expect(enSerien.length).toBeGreaterThanOrEqual(7);
    // Und sie hat jetzt mehrere Wissens-Serien (vorher genau eine):
    expect(enSerien.filter((s) => s.kind === "wissen-serie").length).toBeGreaterThanOrEqual(4);
  });

  it("Rechte je Serie: Lizenz gesetzt, ND ausgeschlossen, CC-BY mit Autor", () => {
    for (const s of SERIEN_EN2) {
      expect(s.herkunft, s.slug).toBeDefined();
      expect(validateHerkunft(s.herkunft!), s.slug).toEqual([]);
      expect(s.herkunft!.fundstelle, s.slug).toBeTruthy();
    }
  });

  it("Sprachregeln: keine Apostrophe, keine Anführungszeichen, keine Ziffern", () => {
    for (const s of SERIEN_EN2)
      for (const e of s.etappen)
        for (const l of e.lines) {
          expect(l, `${s.slug}: ${l}`).not.toMatch(/['’„“”"«»…–—0-9]/);
          expect(l.length, `${s.slug}: ${l}`).toBeLessThanOrEqual(85);
        }
  });

  it("britische Leitvarietät (§10): keine AmE-Marker in den neuen Serien", () => {
    const AME = /\b(favorite|color|colour?ize|meter|liter|realize|traveled|neighbor)\b/i;
    for (const s of SERIEN_EN2)
      for (const e of s.etappen)
        for (const l of e.lines) expect(l, `${s.slug}: ${l}`).not.toMatch(AME);
  });
});

describe("TN-E7 englische Wiederkehr-Bausteine + Stränge", () => {
  it("zwölf Bausteine, alle mit Herkunft und ohne Apostroph", () => {
    expect(EN_WIEDERKEHR_CORPUS).toHaveLength(12);
    for (const e of EN_WIEDERKEHR_CORPUS) {
      expect(validateHerkunft(e.herkunft!), e.text).toEqual([]);
      expect(e.text, e.text).not.toMatch(/['’„“”"]/);
      expect(e.text.length, e.text).toBeLessThanOrEqual(85);
    }
  });

  it("keine Dublette gegen den englischen Bestand", () => {
    const meine = new Set(EN_WIEDERKEHR_CORPUS.map((e) => bausteinKey("", e.text)));
    const zaehler = new Map<string, number>();
    for (const e of CORPUS_EN) {
      const k = bausteinKey("", e.text);
      if (meine.has(k)) zaehler.set(k, (zaehler.get(k) ?? 0) + 1);
    }
    expect([...zaehler.entries()].filter(([, n]) => n > 1).map(([k]) => k)).toEqual([]);
  });

  it("beide englischen Stränge hängen an einer existierenden Serien-Etappe", () => {
    const slugs = new Set(SERIEN.map((s) => s.slug));
    for (const id of ["arc-en-space", "arc-en-sleep"]) {
      const arc = ARCS.find((a) => a.id === id);
      expect(arc, id).toBeDefined();
      expect(arc!.lang).toBe("en");
      const ref = arc!.steps[0].serieRef;
      expect(ref, id).toBeDefined();
      expect(slugs.has(ref!.slug), `${id}: ${ref!.slug}`).toBe(true);
      // Die Voraussetzungs-Etappe muss es in der Serie wirklich geben:
      const serie = SERIEN.find((s) => s.slug === ref!.slug)!;
      expect(ref!.etappe).toBeLessThan(serie.etappen.length);
      // Und der Strang endet mit einer Belohnung:
      expect(arc!.steps[arc!.steps.length - 1].rolle).toBe("belohnen");
    }
  });

  it("englische Stränge servieren nur englische Bausteine", () => {
    const enTexte = new Set(CORPUS_EN.map((e) => bausteinKey(e.kind, e.text)));
    for (const arc of ARCS.filter((a) => a.lang === "en"))
      for (const step of arc.steps)
        for (const b of step.bausteine ?? [])
          expect(enTexte.has(bausteinKey(b.kind, b.text)), `${arc.id}: ${b.text}`).toBe(true);
  });
});
