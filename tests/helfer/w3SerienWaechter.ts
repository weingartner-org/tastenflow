/**
 * ★★★ Wächter der Serien auf „bg", „el", „uk" (W3, 30.10.2026), EINE Fassung für drei Wege. Vorbild: `helfer/csSerienWaechter.ts`.
 * Form über `validateSerie`, dazu Griffe auf allen Tastaturen, Schrift, 36 Serien (je 12), keine Zeile doppelt, jede Serie ein anderer Ort.
 */
import { describe, expect, it } from "vitest";
import { validateSerie, type Serie } from "../../src/lib/typing/serie";
import { SERIEN } from "../../src/lib/typing/serien";
import { lexikonWoerter } from "../../src/lib/typing/lexicon";
import { w3TastaturBefunde, w3ZeilenFehler, type W3Weg } from "./w3TextRegeln";

export function w3SerienWaechter(weg: W3Weg, serien: readonly Serie[]): void {
  describe(`Serien ${weg}`, () => {
    const zeilen = serien.flatMap((s) => s.etappen.flatMap((e) => e.lines));

    it("36 Serien, je 12 Kinder, Jugendliche, Erwachsene; alle tragen lang und nurWeg dieses Weges", () => {
      expect(serien).toHaveLength(36);
      for (const st of ["kids", "teens", "erwachsen"] as const) expect(serien.filter((s) => s.stufen.includes(st)), st).toHaveLength(12);
      expect(serien.filter((s) => s.lang !== weg || s.nurWeg !== weg)).toEqual([]);
      expect(new Set(serien.map((s) => s.slug)).size).toBe(36);
      expect(new Set(serien.map((s) => s.titel)).size).toBe(36);
    });

    it("validateSerie (Etappen, Zeilenzahl, minTier gegen den Weg) ohne Problem; Gegenprobe", () => {
      for (const s of serien) expect(validateSerie(s, weg).problems, s.slug).toEqual([]);
      expect(validateSerie({ ...serien[0], minTier: 0 }, weg).ok).toBe(serien[0].minTier === 0);
      expect(validateSerie({ ...serien[0], etappen: [{ lines: ["x"] }] }, weg).ok).toBe(false);
    });

    it("Griff auf allen Tastaturen, Schrift und Sperrliste: jede Zeile; Gegenprobe", () => {
      expect(zeilen.flatMap((z) => [...w3TastaturBefunde(z, weg), ...w3ZeilenFehler(z, weg)].map((w) => `${w}: ${z}`))).toEqual([]);
      expect(w3ZeilenFehler("abc", weg).length).toBeGreaterThan(0);
    });

    it("keine Zeile doppelt, kein typografisches Zeichen", () => {
      expect(new Set(zeilen).size).toBe(zeilen.length);
      expect(zeilen.filter((z) => /[–—„“”]/.test(z))).toEqual([]);
    });

    it("hängt in SERIEN und im Fach des Lexikons", () => {
      expect(SERIEN.filter((s) => s.lang === weg)).toHaveLength(36);
      expect(lexikonWoerter(weg).length).toBeGreaterThan(0);
    });
  });
}
