/**
 * ★★★★★ WÄCHTER M1 (Mechanik-Prüfung des französischen Lehrgangs, 26.09.2026):
 * „Mein Training" übt JEDE Einheit des Weges „fr" - auf JEDER französischen
 * Tastatur.
 *
 * Der Fund: `adaptiveRound` teilte den Tastenstand über ein Buchstaben-Muster
 * OHNE Akzente (`/[a-zäöüß]/`) und über die DEUTSCHEN Listen der Satz- und
 * Sonderzeichen ein. `é à è ç ù` galten damit weder als Buchstabe noch als
 * Zeichen, `¨ _` standen auf keiner Liste - sie fielen aus dem Tastenstand,
 * aus dem der Korpus gewählt wird. Gemessen (Prüfbericht §1.3): 0 von 240
 * Zeilen enthielten die neue Einheit, ein fehlerfreies Kind tippte é, à, è,
 * ç, ù und ¨ NIE - und bekam sie trotzdem freigeschaltet. Leitfaden Falle 7,
 * zum dritten Mal. Die Tests waren grün, weil sie `corpusEntriesFor` mit dem
 * richtigen Tastenstand prüften - die Schicht darunter (Falle 32/40).
 *
 * Darum prüft dieser Wächter die FEHLERKLASSE am WEG, den ein Kind nimmt:
 *  1. Der Tastenstand, den `adaptiveRound` einteilt (`rundenEinheiten`), ist
 *     an JEDER Sprosse genau der von `allowedFromIntroduced` - also bekommt
 *     der Generator dieselbe Korpus-Menge wie `corpusEntriesFor` mit dem
 *     richtigen Tastenstand.
 *  2. Eine echte `adaptiveRound` mit der neuen Einheit im Fokus enthält diese
 *     Einheit - für JEDE Einheit von `introOrder("fr")` auf JEDER Tastatur
 *     (eine Totaste zählt in ihren zusammengesetzten Zeichen: „^" in ê).
 * Das Klassenmatch ruft dieselbe Funktion (`KlassenmatchLauf.tsx`).
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, toLayoutText, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { adaptiveRound, rundenEinheiten } from "../src/lib/typing/generator";
import { allowedFromIntroduced } from "../src/lib/typing/serien";
import { corpusEntriesFor } from "../src/lib/typing/corpusManifest";
import { KOMBIZEICHEN } from "../src/lib/typing/totasten";

afterEach(() => setLayout("de"));

const TASTATUREN: LayoutId[] = ["fr", "be", "ch-fr", "ca-csa", "ca-fr"];

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mitZufall<T>(seed: number, fn: () => T): T {
  const echt = Math.random;
  Math.random = mulberry32(seed);
  try {
    return fn();
  } finally {
    Math.random = echt;
  }
}

/** Woran man die Einheit im Text erkennt (Totaste: an ihren Kombizeichen). */
function erkennungszeichen(u: string): string[] {
  const out = [u, toLayoutText(u.toUpperCase())];
  for (const k of KOMBIZEICHEN) if (k.tot === u) out.push(k.zeichen, k.zeichen.toUpperCase());
  return out;
}

describe("★★★★★ M1: der Tastenstand von „Mein Training“ auf Weg „fr“", () => {
  for (const l of TASTATUREN) {
    it(`${l}: an jeder Sprosse genau der Tastenstand von allowedFromIntroduced`, () => {
      setLayout(l);
      const o = introOrder("fr");
      for (let n = 2; n <= o.length; n++) {
        const intro = o.slice(0, n);
        const r = rundenEinheiten(intro, "fr");
        const eingeteilt = new Set([...r.letters, ...r.puncts, ...r.digits, ...r.symbols, ...r.nurErlaubt]);
        const richtig = allowedFromIntroduced(intro, "fr");
        expect([...eingeteilt].sort(), `${l}, Sprosse ${n} (${o[n - 1]})`).toEqual([...richtig].sort());
        // Keine Einheit doppelt eingeteilt
        const alle = [...r.letters, ...r.puncts, ...r.digits, ...r.symbols, ...r.nurErlaubt];
        expect(alle.length, `${l}, Sprosse ${n}`).toBe(eingeteilt.size);
      }
    });
  }

  it("fr: am Ende sieht der Generator den GANZEN Korpus (Prüfbericht: 432 statt 1036)", () => {
    setLayout("fr");
    const o = introOrder("fr");
    const r = rundenEinheiten(o, "fr");
    const eingeteilt = new Set([...r.letters, ...r.puncts, ...r.digits, ...r.symbols, ...r.nurErlaubt]);
    const richtig = allowedFromIntroduced(o, "fr");
    const a = corpusEntriesFor({ stufe: "kids", allowed: eingeteilt, lang: "fr", lernweg: "fr" }).length;
    const b = corpusEntriesFor({ stufe: "kids", allowed: richtig, lang: "fr", lernweg: "fr" }).length;
    expect(a).toBe(b);
    expect(a).toBeGreaterThan(900);
  });
});

describe("★★★★★ M1: jede neue Einheit kommt in einer echten Runde vor", () => {
  for (const l of TASTATUREN) {
    it(`${l}: jede Einheit von introOrder("fr") steht in ihrer Runde`, () => {
      setLayout(l);
      const o = introOrder("fr");
      const fehlt: string[] = [];
      for (let n = 3; n <= o.length; n++) {
        const neu = o[n - 1];
        if (neu === SHIFT_UNIT) continue;
        const intro = o.slice(0, n);
        const zeichen = erkennungszeichen(neu);
        const zeilen = mitZufall(n, () => [
          ...adaptiveRound({ introduced: intro, focus: [neu], stufe: "kids", lang: "fr", lernweg: "fr", count: 12, uebungsZeilen: 2 }),
          ...adaptiveRound({ introduced: intro, focus: [neu], stufe: "teens", lang: "fr", lernweg: "fr", count: 12, uebungsZeilen: 2 }),
        ]);
        const mit = zeilen.filter((z) => zeichen.some((c) => z.text.includes(c))).length;
        if (mit === 0) fehlt.push(`${n}:${neu}`);
      }
      expect(fehlt, `${l}: Einheiten ohne eine einzige Zeile in ihrer Runde`).toEqual([]);
    });
  }
});

describe("M1: Klassenmatch - dieselbe Funktion ohne Fokus", () => {
  it("fr, voller Tastenstand: Zeilen mit é à è ç ù kommen vor", () => {
    setLayout("fr");
    const o = introOrder("fr");
    const zeilen = mitZufall(7, () =>
      Array.from({ length: 6 }, () =>
        adaptiveRound({ introduced: o, stufe: "kids", lang: "fr", lernweg: "fr", count: 24 }),
      ).flat(),
    );
    for (const c of ["é", "à", "è", "ç", "ù"]) {
      expect(zeilen.some((z) => z.text.includes(c)), c).toBe(true);
    }
  });
});

describe("S4: erzeugte Zeilen sind französisch gesetzt", () => {
  it("fr-FR: Leerzeichen vor ! ? ; :, kein ^ allein; fr-CA: ohne Leerzeichen vor ! ? ;", () => {
    setLayout("fr");
    const o = introOrder("fr");
    for (const variante of ["fr-FR", "fr-CA"] as const) {
      const gen = mitZufall(11, () =>
        Array.from({ length: 30 }, () =>
          adaptiveRound({
            introduced: o,
            focus: ["!", "?", ";", ":", "'", "^"],
            stufe: "teens",
            lang: "fr",
            lernweg: "fr",
            count: 12,
            franzVariante: variante,
          }),
        ).flat(),
      ).filter((z) => z.source === null);
      expect(gen.length).toBeGreaterThan(20);
      for (const z of gen) {
        expect(z.text, z.text).not.toMatch(/(^| )\^( |$)/);
        expect(z.text, z.text).not.toMatch(/(^| )'\p{L}+'/u);
        if (variante === "fr-FR") expect(z.text, z.text).not.toMatch(/\p{L}[;:!?]/u);
        else expect(z.text, z.text).not.toMatch(/\p{L} [;!?]/u);
      }
    }
  });
});
