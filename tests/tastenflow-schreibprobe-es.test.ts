/**
 * ★★★★★ WÄCHTER M7 (ES-P7a-Behebung, 27.09.2026, Prüfbericht Fundament es):
 * Reto (Tippchallenge) auf Weg „es" - jede Klasse bekommt SPANISCHE Texte,
 * nie deutsche.
 *
 * Zwei Stellen kannten „es" bisher nicht:
 *  1. `niveauHatBank` (schreibprobe.ts) fiel für jeden Weg ausser „de"/„fr"
 *     auf {@link EN_NIVEAUS_GEFUELLT} zurück - die englische Liste führt
 *     inzwischen ALLE sieben Niveaus, darum meldete „es" fälschlich jedes
 *     Niveau als verfügbar (Prüfbericht e13: alle 7 Niveaus angeboten).
 *  2. `ladeTexte` (schreibproben/index.ts) hatte gar keine Weiche für „es"
 *     und fiel in den `default`-Zweig - die DEUTSCHE Bank (erste Zeile
 *     „skf döj akla jkslö", „Die kleinen Enkel ernten").
 *
 * Behoben: eigene Liste `ES_NIVEAUS_GEFUELLT` und eine eigene Weiche in
 * `ladeTexte` - NIE einen Rückfall auf Deutsch oder Englisch (Bauplan §2.3
 * Punkt 4).
 *
 * ★★★★★ ES-R0 (27.09.2026): „start" („Fila guía") und „gross" („Primeras
 * letras") sind jetzt EBENFALLS gefüllt (siehe
 * `tests/tastenflow-reto-es-start.test.ts`/`-gross.test.ts` für ihre eigenen
 * Wächter) - Weg „es" hat damit als erster Weg nach „de" alle sieben Niveaus
 * wirklich gefüllt. Die ehemalige Gruppe „OHNE_BANK" ist darum leer
 * (bewusst als Konstante stehen gelassen, damit ein KÜNFTIGES achtes Niveau
 * ohne Bank hier sofort auffiele, statt dass die Prüfung einfach verschwindet).
 */
import { describe, expect, it } from "vitest";
import { niveauHatBank, PROBEN_NIVEAUS, ES_NIVEAUS_GEFUELLT } from "@/lib/typing/schreibprobe";
import { ladeTexte } from "@/lib/typing/schreibproben";
import { TEXTE as TEXTE_START_ES } from "@/lib/typing/schreibproben/texteStartEs";
import { TEXTE as TEXTE_GROSS_ES } from "@/lib/typing/schreibproben/texteGrossEs";
import { TEXTE as TEXTE_BUCHSTABEN_ES } from "@/lib/typing/schreibproben/texteBuchstabenEs";
import { TEXTE as TEXTE_SATZ_ES } from "@/lib/typing/schreibproben/texteSatzEs";
import { TEXTE as TEXTE_ZAHLEN_ES } from "@/lib/typing/schreibproben/texteZahlenEs";
import { TEXTE as TEXTE_ALLES_ES } from "@/lib/typing/schreibproben/texteAllesEs";
import { TEXTE as TEXTE_CODE_ES } from "@/lib/typing/schreibproben/texteCodeEs";

const OHNE_BANK: readonly string[] = [];
const MIT_BANK = ["start", "gross", "buchstaben", "satz", "zahlen", "alles", "code"] as const;

describe('★★★★★ M7/ES-R0: niveauHatBank(niveau, "es") - alle sieben Niveaus gefüllt', () => {
  for (const n of MIT_BANK) {
    it(`"${n}" hat eine Bank`, () => {
      expect(niveauHatBank(n, "es")).toBe(true);
      expect(ES_NIVEAUS_GEFUELLT.has(n)).toBe(true);
    });
  }
  it('"eigen" ist immer verfügbar, unabhängig vom Weg', () => {
    expect(niveauHatBank("eigen", "es")).toBe(true);
  });
  it("jedes Niveau aus PROBEN_NIVEAUS ist entweder gefüllt oder bewusst leer - keins vergessen", () => {
    for (const n of PROBEN_NIVEAUS) {
      expect([...MIT_BANK, ...OHNE_BANK]).toContain(n);
    }
  });
});

describe('★★★★★ M7: ladeTexte(niveau, "es") liefert SPANISCHE Texte, nie Deutsch', () => {
  // ★ ES-R0 (27.09.2026): „start"/„gross" liefern jetzt ihre eigenen Bänke.
  it('"start" liefert genau TEXTE_START_ES', async () => {
    const t = await ladeTexte("start", "es");
    expect(t).toEqual(TEXTE_START_ES);
    expect(t.length).toBe(15);
  });
  it('"gross" liefert genau TEXTE_GROSS_ES', async () => {
    const t = await ladeTexte("gross", "es");
    expect(t).toEqual(TEXTE_GROSS_ES);
    expect(t.length).toBe(15);
  });
  it('"buchstaben" liefert genau TEXTE_BUCHSTABEN_ES', async () => {
    const t = await ladeTexte("buchstaben", "es");
    expect(t).toEqual(TEXTE_BUCHSTABEN_ES);
    expect(t.length).toBe(15);
  });
  it('"satz" liefert genau TEXTE_SATZ_ES', async () => {
    const t = await ladeTexte("satz", "es");
    expect(t).toEqual(TEXTE_SATZ_ES);
    expect(t.length).toBe(15);
  });
  it('"zahlen" liefert genau TEXTE_ZAHLEN_ES', async () => {
    const t = await ladeTexte("zahlen", "es");
    expect(t).toEqual(TEXTE_ZAHLEN_ES);
    expect(t.length).toBe(15);
  });
  it('"alles" liefert genau TEXTE_ALLES_ES', async () => {
    const t = await ladeTexte("alles", "es");
    expect(t).toEqual(TEXTE_ALLES_ES);
    expect(t.length).toBe(15);
  });
  // ★ ES-Reto-Code (27.09.2026): die spanische Code-Bank.
  it('"code" liefert genau TEXTE_CODE_ES', async () => {
    const t = await ladeTexte("code", "es");
    expect(t).toEqual(TEXTE_CODE_ES);
    expect(t.length).toBe(15);
  });

  it('keine der sieben gefüllten Banken enthält ein deutsches Erkennungswort ("skf döj akla jkslö", "Enkel")', async () => {
    for (const n of MIT_BANK) {
      const t = await ladeTexte(n, "es");
      const text = t.flatMap((p) => p.zeilen).join(" ");
      expect(text).not.toMatch(/skf döj akla jkslö|Enkel|Säugetier/);
    }
  });
});

describe("M7: de/en/fr unverändert", () => {
  it("de: jedes Niveau hat eine Bank (unverändert)", () => {
    for (const n of PROBEN_NIVEAUS) expect(niveauHatBank(n, "de")).toBe(true);
  });
  it("fr: dieselben zwei Etappen-Listen wie vorher (FR_NIVEAUS_GEFUELLT unberührt)", () => {
    for (const n of PROBEN_NIVEAUS) expect(niveauHatBank(n, "fr")).toBe(true); // fr hat inzwischen alle 7
  });
});
