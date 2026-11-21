/**
 * WÄCHTER über den SCORE aus den Übungsdaten (§2.1, Umbau 11.09.2026).
 *
 * `scoreAusWerten` benutzt `werte()` aus `schreibprobeWertung.ts` (Import,
 * keine Kopie der Formel) - dieser Test rechnet die zwölf durchgerechneten
 * Beispiele aus `RECHERCHE-2026-09-10-TASTSCHREIB-WERTUNG.md` §4.4 gegen den
 * Leistungswert `L` nach (Bezugstempo 240, k = 5, sortiert nach Ergebnis).
 * Er beweist damit: Der Score der Übungsdaten trifft GENAU dieselbe Zahl wie
 * die Wertung der Tippchallenge - keine zweite, leicht abweichende Rechnung.
 */
import { describe, it, expect } from "vitest";
import { scoreAusWerten } from "@/lib/typing/score";

// Aus RECHERCHE-2026-09-10-TASTSCHREIB-WERTUNG.md §4.4, Spalten APM · Zeichen ·
// Fehlgriffe · L (der Leistungswert - nicht der Rang %, der vom besten Kind
// dieser Runde abhängt und hier keine Rolle spielt).
const BEISPIELE: { name: string; apm: number; zeichen: number; fehler: number; l: number }[] = [
  { name: "1 schnell, sehr genau", apm: 240, zeichen: 2400, fehler: 24, l: 95.2 },
  { name: "2 zügig, sehr genau", apm: 180, zeichen: 1800, fehler: 18, l: 82.4 },
  { name: "3 schnell, ungenau", apm: 240, zeichen: 2400, fehler: 209, l: 69.7 },
  { name: "4 mittel, fast fehlerfrei", apm: 120, zeichen: 1200, fehler: 6, l: 69.0 },
  { name: "5 zügig, mittel", apm: 180, zeichen: 1800, fehler: 95, l: 68.6 },
  { name: "6 sehr schnell, mässig genau", apm: 300, zeichen: 3000, fehler: 333, l: 64.3 },
  { name: "7 mittel, mittel", apm: 120, zeichen: 1200, fehler: 63, l: 56.0 },
  { name: "8 langsam, sehr genau", apm: 80, zeichen: 800, fehler: 8, l: 55.0 },
  { name: "9 schnell, sehr ungenau", apm: 240, zeichen: 2400, fehler: 424, l: 53.1 },
  { name: "10 sehr langsam, genau", apm: 60, zeichen: 600, fehler: 19, l: 43.3 },
  { name: "11 mittel, ungenau", apm: 120, zeichen: 1200, fehler: 164, l: 42.0 },
  { name: "12 langsam, ungenau", apm: 80, zeichen: 800, fehler: 89, l: 37.1 },
];

describe("★ scoreAusWerten - dieselbe Rechnung wie die Tippchallenge", () => {
  for (const b of BEISPIELE) {
    it(`Beispiel ${b.name}: Score ${b.l}`, () => {
      const s = scoreAusWerten({
        zeichen: b.zeichen,
        fehler: b.fehler,
        anschlaegeProMin: b.apm,
      });
      expect(s.gewertet).toBe(true);
      // ★ Toleranz 0,15 statt exakter Gleichheit: Die Tabelle der Recherche
      // zeigt G und V schon auf drei Nachkommastellen GERUNDET; wer von dort
      // aus L neu ausrechnet, rundet zweimal und trifft nicht immer exakt die
      // letzte Nachkommastelle von `scoreAusWerten` (voller Genauigkeit).
      expect(Math.abs((s.wert ?? 0) - b.l)).toBeLessThanOrEqual(0.15);
    });
  }

  it("unter 200 Zeichen: kein Score, sondern nicht gewertet", () => {
    const s = scoreAusWerten({ zeichen: 150, fehler: 0, anschlaegeProMin: 100 });
    expect(s.gewertet).toBe(false);
    expect(s.wert).toBeNull();
  });

  it("genau an der Grenze (200 Zeichen) ist gewertet", () => {
    const s = scoreAusWerten({ zeichen: 200, fehler: 0, anschlaegeProMin: 100 });
    expect(s.gewertet).toBe(true);
    expect(s.wert).not.toBeNull();
  });
});
