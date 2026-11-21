/**
 * TN-E5 + TN-E6 (Text-Nachschub §7): Serien für 13–15 und für Erwachsene.
 * Prüfbericht 27.07.: Für Erwachsene war die Bücherei LEER, die drei
 * c-Geschichten waren für 10–12 geschrieben.
 */
import { describe, expect, it } from "vitest";
import { SERIEN, validateHerkunft } from "../src/lib/typing/serien";
import { SERIEN_JUGEND_ERWACHSEN } from "../src/lib/typing/serienJugendErwachsen";
import { computeSerieMinTier, serieLineCount, validateSerie } from "../src/lib/typing/serie";
import { CORPUS } from "../src/lib/typing/corpus";
import { ERWACHSEN2_CORPUS } from "../src/lib/typing/corpusErwachsen2";
import { corpusEntriesFor } from "../src/lib/typing/corpusManifest";
import { bausteinKey } from "../src/lib/typing/ledger";
import { TIER_CHARS } from "../src/lib/typing/tiers";

const FULL = new Set(TIER_CHARS.flatMap((t) => [...t]));
const deSerien = SERIEN.filter((s) => (s.lang ?? "de") === "de");

describe("TN-E5/E6 neue Serien", () => {
  it("alle fünf sind strukturell gültig und tier-ehrlich deklariert", () => {
    expect(SERIEN_JUGEND_ERWACHSEN).toHaveLength(5);
    for (const s of SERIEN_JUGEND_ERWACHSEN) {
      expect(validateSerie(s, "de").problems, s.slug).toEqual([]);
      expect(computeSerieMinTier(s, "de"), s.slug).toBe(s.minTier);
    }
  });

  it("Etappen haben exakt 12 Zeilen, Zeilen höchstens 85 Zeichen", () => {
    for (const s of SERIEN_JUGEND_ERWACHSEN) {
      expect(s.etappen.length, s.slug).toBeGreaterThanOrEqual(4);
      for (const e of s.etappen) {
        expect(e.lines, s.slug).toHaveLength(12);
        for (const l of e.lines) expect(l.length, `${s.slug}: ${l}`).toBeLessThanOrEqual(85);
      }
    }
    expect(SERIEN_JUGEND_ERWACHSEN.reduce((a, s) => a + serieLineCount(s), 0)).toBe(264);
  });

  it("Herkunft vollständig und rechtlich sauber (§4/§10)", () => {
    for (const s of SERIEN_JUGEND_ERWACHSEN) {
      expect(s.herkunft, s.slug).toBeDefined();
      expect(validateHerkunft(s.herkunft!), s.slug).toEqual([]);
    }
  });

  it("kein Anführungszeichen, keine Ziffern (Zeichensatz des Bestands)", () => {
    for (const s of SERIEN_JUGEND_ERWACHSEN)
      for (const e of s.etappen)
        for (const l of e.lines) {
          expect(l, `${s.slug}: ${l}`).not.toMatch(/[„“”"«»…–—0-9]/);
        }
  });

  it("die Bücherei hat jetzt deutsche Serien für ERWACHSENE (vorher null)", () => {
    const erw = deSerien.filter((s) => s.stufen.includes("erwachsen"));
    expect(erw.length).toBeGreaterThanOrEqual(3);
    expect(erw.map((s) => s.slug)).toContain("die-bank-am-fluss");
    // Zwei davon sind Sachtext-Serien, eine ist eine Erzählung:
    expect(erw.filter((s) => s.kind === "wissen-serie").length).toBeGreaterThanOrEqual(2);
    expect(erw.filter((s) => s.kind === "geschichte").length).toBeGreaterThanOrEqual(1);
  });

  it("die c-Stufe hat jetzt Geschichten auf Augenhöhe", () => {
    const cGeschichten = deSerien.filter(
      (s) => s.kind === "geschichte" && s.stufen.includes("teens"),
    );
    expect(cGeschichten.map((s) => s.slug)).toContain("die-martinswand");
    expect(cGeschichten.map((s) => s.slug)).toContain("die-nachricht-auf-seite-zwoelf");
  });

  it("keine doppelten Slugs in der Registry", () => {
    const slugs = SERIEN.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("TN-E6 Einzelzeilen für Erwachsene", () => {
  it("120 Zeilen, ausschließlich für die Stufe erwachsen", () => {
    expect(ERWACHSEN2_CORPUS).toHaveLength(120);
    for (const e of ERWACHSEN2_CORPUS) expect(e.stufen).toEqual(["erwachsen"]);
  });

  it("Herkunft gesetzt, Zeichensatz sauber, höchstens 85 Zeichen", () => {
    for (const e of ERWACHSEN2_CORPUS) {
      expect(validateHerkunft(e.herkunft!), e.text).toEqual([]);
      expect(e.text.length, e.text).toBeLessThanOrEqual(85);
      expect(e.text, e.text).not.toMatch(/[„“”"«»…–—]/);
    }
  });

  it("keine Dublette gegen den übrigen Bestand", () => {
    const meine = new Set(ERWACHSEN2_CORPUS.map((e) => bausteinKey("", e.text)));
    const zaehler = new Map<string, number>();
    for (const e of CORPUS) {
      const k = bausteinKey("", e.text);
      if (meine.has(k)) zaehler.set(k, (zaehler.get(k) ?? 0) + 1);
    }
    expect([...zaehler.entries()].filter(([, n]) => n > 1).map(([k]) => k)).toEqual([]);
  });

  it("Erwachsenen-Zelle messbar gefüllt (vorher 539 servierbare Zeilen)", () => {
    const n = corpusEntriesFor({ lernweg: "de", stufe: "erwachsen", allowed: FULL, lang: "de" }).length;
    expect(n).toBeGreaterThan(720);
  });
});
