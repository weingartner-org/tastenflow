/**
 * ★★ WÄCHTER: die Alphabet-Reihen auf Weg „hu" (Ungarisch, O-INHALT-HU, 29.10.2026) - `uebungsformen/alphabetHu.ts`.
 * Vorbild: Abschnitt 6 von `tests/tastenflow-wortspiele-cs.test.ts`.
 *
 *  · die Reihe ist die, nach der die Sprache SORTIERT (gemessen mit `Intl.Collator("hu")`), und kein Buchstabe, der wie sein
 *    Grundbuchstabe sortiert, steht darin;
 *  · der Verteiler (`alphabetreihen.ts`) nimmt die eigene Reihe, nicht mehr die englische;
 *  · jede Gruppe jeder Zeile ist ein zusammenhängendes Stück der Reihe (nur freigeschaltete Buchstaben), auf jeder Pflicht-Tastatur
 *    an jeder Sprosse tippbar; gross wird nur das erste Zeichen eines Mehrzeichen-Buchstabens.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout } from "@/lib/typing/layouts";
import { introOrder } from "@/lib/typing/letters";
import { fitText } from "@/lib/typing/corpus";
import { UEBUNGSFORMEN } from "@/lib/typing/uebungsformen";
import type { FormKontext } from "@/lib/typing/uebungsformen/typen";
import { ALPHABET_ORDER_HU } from "@/lib/typing/uebungsformen/alphabetHu";

afterEach(() => setLayout("de"));

const REIHE = ["a","b","c","cs","d","dz","dzs","e","f","g","gy","h","i","j","k","l","ly","m","n","ny","o","ö","p","q","r","s","sz","t","ty","u","ü","v","w","x","y","z","zs"];
const TASTATUREN = ["hu","hu-101"] as const;

function zufall(start: number): () => number {
  let s = start;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

const form = UEBUNGSFORMEN.find((f) => f.id === "alphabetreihen")!;
const ctx = (bis: number, shift = false): FormKontext => ({
  lernweg: "hu", introduced: introOrder("hu").slice(0, bis), shift, oneHand: false, stufe: "kids", lang: "hu",
  count: 40, zufall: zufall(3),
});

/** Ist `gruppe` (klein, ohne Punkt) ein zusammenhängendes Stück von `vorrat`? */
function istStueck(gruppe: string, vorrat: readonly string[]): boolean {
  for (let i = 0; i < vorrat.length; i++) {
    let rest = gruppe;
    for (let k = i; k < vorrat.length && rest.length > 0 && rest.startsWith(vorrat[k]); k++) rest = rest.slice(vorrat[k].length);
    if (rest === "") return true;
  }
  return false;
}

describe("★ die Reihe des Weges „hu“", () => {
  it("die Datei trägt genau die Reihe, und Intl.Collator(„hu“) sortiert sie so", () => {
    expect(ALPHABET_ORDER_HU).toEqual(REIHE);
    expect([...REIHE].reverse().sort(new Intl.Collator("hu").compare)).toEqual(REIHE);
  });

  it("was wie sein Grundbuchstabe sortiert, steht nicht in der Reihe - was eigen sortiert, steht darin", () => {
    const basis = new Intl.Collator("hu", { sensitivity: "base" });
    for (const [zeichen, grund] of [["á","a"],["ő","ö"],["ű","ü"]]) {
      expect(basis.compare(zeichen, grund), zeichen).toBe(0);
      expect(REIHE, zeichen).not.toContain(zeichen);
    }
    for (const [zeichen, grund] of [["ö","o"],["ü","u"]]) {
      expect(basis.compare(zeichen, grund), zeichen).not.toBe(0);
      expect(REIHE.indexOf(zeichen), zeichen).toBeGreaterThan(REIHE.indexOf(grund));
    }
  });

  it("nur Kleinbuchstaben, jeder nur einmal, kein Cedille-ş/ţ", () => {
    expect(REIHE.filter((b, i) => REIHE.indexOf(b) !== i)).toEqual([]);
    for (const b of REIHE) expect(b, b).toBe(b.toLocaleLowerCase("hu"));
    expect(REIHE.join("")).not.toMatch(/[\u015F\u0163]/);
  });
});

describe("★★ die Form auf Weg „hu“ baut aus der eigenen Reihe", () => {
  for (const tastatur of TASTATUREN) {
    it(`${tastatur}: an jeder Sprosse ist jede Gruppe ein Stück der Reihe aus freigeschalteten Buchstaben und tippbar`, () => {
      setLayout(tastatur);
      const o = introOrder("hu");
      const fehler: string[] = [];
      for (let n = 1; n <= o.length; n++) {
        for (const shift of [false, true]) {
          const c = ctx(n, shift);
          if (!form.taugt(c)) continue;
          const runde = form.baue?.(c);
          if (!runde) continue;
          const da = new Set(c.introduced);
          const vorrat = REIHE.filter((b) => [...b].every((z) => da.has(z)));
          for (const z of runde.zeilen) {
            if (fitText(z.text, da, "hu", "hu") !== z.text) fehler.push(`${n}: nicht tippbar „${z.text}"`);
            for (const g of z.text.split(" ")) {
              const klein = g.replace(/\.$/, "").toLocaleLowerCase("hu");
              if (!istStueck(klein, vorrat)) fehler.push(`${n}: „${g}" ist kein Stück der Reihe`);
            }
          }
        }
      }
      expect(fehler).toEqual([]);
    });

    it(`${tastatur}: mit allen Buchstaben kommt die ganze eigene Reihe vor - gross nur das erste Zeichen`, () => {
      setLayout(tastatur);
      const voll = introOrder("hu").length;
      const roh = Array.from({ length: 6 }, (_, i) =>
        form.baue!({ ...ctx(voll, true), zufall: zufall(i + 1) })!.zeilen.map((z) => z.text).join(" "),
      ).join(" ");
      const klein = roh.toLocaleLowerCase("hu");
      for (const b of REIHE.filter((b) => b.length > 1 || /[^a-z]/.test(b))) expect(klein, b).toContain(b);
      expect(roh).not.toMatch(/\p{Lu}\p{Lu}/u);
    });
  }

});
