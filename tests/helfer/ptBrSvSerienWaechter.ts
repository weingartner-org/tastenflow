/**
 * Der gemeinsame Wächter der Serien auf „pt", „br", „sv" (W3, 30.10.2026), Vorbild `csSerienWaechter.ts`. Regeln: `w3SerienRegeln.ts`.
 * Jede Regel hat eine Gegenprobe (eine verdorbene Kopie muss rot werden).
 */
import { describe, expect, it } from "vitest";
import { introOrder, SHIFT_UNIT } from "../../src/lib/typing/letters";
import { setLayout } from "../../src/lib/typing/layouts";
import { SERIEN, allowedFromIntroduced, serienForStufe, unlockedSerien } from "../../src/lib/typing/serien";
import { computeSerieMinTier, type Serie } from "../../src/lib/typing/serie";
import type { SerieEntwurfPtBrSv } from "../../src/lib/typing/serienPtBrSvTyp";
import { W3_TASTATUREN, type W3Weg } from "./ptBrSvTextRegeln";
import { chargenFehler, zeilenFehlerSerie, type Stufe } from "./w3SerienRegeln";

const STUFEN: readonly Stufe[] = ["kids", "teens", "erwachsen"];
const kopie = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

export function w3SerienWaechter<W extends W3Weg>(
  weg: W,
  alle: readonly Serie[],
  chargen: Record<Stufe, readonly SerieEntwurfPtBrSv<W>[]>,
): void {
  describe(`Serien ${weg}`, () => {
    it.each(STUFEN)("%s: die ganze Charge besteht alle Regeln", (st) => {
      expect(chargenFehler(chargen[st], weg, st)).toEqual([]);
    });
    it("36 Serien, Slugs und Titel eindeutig, in SERIEN angekommen (nur dieser Weg)", () => {
      expect(alle.length).toBe(36);
      expect(new Set(alle.map((s) => s.slug)).size).toBe(36);
      expect(new Set(alle.map((s) => s.titel.toLowerCase())).size).toBe(36);
      const inSerien = SERIEN.filter((s) => s.lang === weg);
      expect(inSerien.map((s) => s.slug)).toEqual(alle.map((s) => s.slug));
      for (const s of alle) expect(s.nurWeg, s.slug).toBe(weg);
    });
    it("jede Serie ist am Ende des Lehrgangs freigeschaltet, je Stufe zwölf, auf der Tastatur des Weges", () => {
      setLayout(W3_TASTATUREN[weg][0]);
      try {
        const voll = allowedFromIntroduced(introOrder(weg).filter((u) => u !== SHIFT_UNIT), weg);
        for (const st of STUFEN) {
          expect(serienForStufe(st, weg, weg).length, st).toBe(12);
          expect(unlockedSerien(voll, st, weg, weg).length, st).toBe(12);
        }
      } finally {
        setLayout("de");
      }
    });
    it("minTier stimmt und ist gegen den Weg gerechnet", () => {
      for (const s of alle) expect(computeSerieMinTier(s, weg), s.slug).toBe(s.minTier);
    });
    it("Gegenprobe: verdorbene Kopien werden rot", () => {
      const st: Stufe = "teens";
      const basis = chargen[st];
      const rot = (f: (x: SerieEntwurfPtBrSv<W>[]) => void, re: RegExp) => {
        const k = kopie(basis) as SerieEntwurfPtBrSv<W>[];
        f(k);
        expect(chargenFehler(k, weg, st).join("\n")).toMatch(re);
      };
      rot((k) => k.pop(), /11 Serien/);
      rot((k) => { k[0].etappen = k[0].etappen.slice(0, 1); }, /1 Etappen/);
      rot((k) => { k[0].etappen[0].lines = k[0].etappen[0].lines.slice(0, 5); }, /5 Zeilen/);
      rot((k) => { k[0].etappen[0].lines[k[0].etappen[0].lines.length - 1] = "Tudo acabou bem nesta linha calma."; }, /endet ohne/);
      rot((k) => { k[1].slug = "xx-falsch"; }, /Slug-Vorsilbe/);
      rot((k) => { k[1].minTier = 1 as never; k[1].etappen[0].lines[0] = "Uma linha com 12 e uma coisa."; }, /minTier/);
      rot((k) => { k[1].eigennamen = ["Nomeinexistente"]; }, /kommt nicht vor/);
      rot((k) => { k[2].etappen[1].lines[0] = k[2].etappen[0].lines[0]; }, /Zeile auch in/);
      expect(zeilenFehlerSerie("sem maiúscula aqui nesta frase.", weg, "teens")).toContain("kein Grossbuchstabe am Anfang");
      expect(zeilenFehlerSerie("Uma frase. Outra frase aqui.", weg, "teens")).toContain("mehr als ein Satz");
      expect(zeilenFehlerSerie("Uma frase com 3 coisas boas.", weg, "kids").join()).toMatch(/Ziffer/);
      expect(zeilenFehlerSerie("Uma frase com a € no meio.", weg, "teens").join()).toMatch(/Sonderzeichen/);
    });
  });
}
