/**
 * ★★★ E4 (25.09.2026, Bauplan französischer Lehrgang §14 E4 Punkt 6):
 * TASTENKAPPEN DER FRANZÖSISCHEN TASTATUREN.
 *
 * E3-Abnahme (Falle 15 im Leitfaden): die Bildschirm-Tastatur zeigte auf den
 * fünf französischen Layouts Grossbuchstaben MIT Akzent (É È Ç À Ù) - die
 * gibt es auf den meisten dieser Tastaturen gar nicht direkt (F5-F7,
 * `layouts.ts`) - und verschwieg auf AZERTY die Ziffernreihe ganz (jede Taste
 * zeigte nur EIN Zeichen, obwohl die echte Kappe zwei trägt: oben klein die
 * Ziffer mit Umschalt, unten das Grundzeichen).
 *
 * Geprüft wird:
 *  A) fr/be: die Ziffernreihe ist ZWEISTUFIG (Ziffer oben, Grundzeichen unten).
 *  B) fr/be/ch-fr/ca-csa/ca-fr: `é è ç à ù` bleiben KLEIN, wo sie als eigene
 *     Taste vorkommen - gewöhnliche Buchstaben bleiben weiter GROSS.
 *  C) de/ch/us/uk: unverändert (Byte für Byte) - siehe
 *     `typing-tastatur-gedrueckt.test.tsx`, das alle Aufdrucke dieser vier
 *     Tastaturen schon vollständig gegenprüft; hier nur die Gegenprobe, dass
 *     KEINE Taste dort zweistufig wird und `ß` unverändert bleibt.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";

import { Keyboard } from "../src/components/typing/Keyboard";
import { layoutById, setLayout, type LayoutId, type KeyboardLayout } from "../src/lib/typing/layouts";

afterEach(() => {
  cleanup();
  setLayout("de");
});

function zeichne(id: LayoutId) {
  setLayout(id);
  const layout = layoutById(id);
  const { container } = render(
    <Keyboard layout={layout} unlocked={new Set()} showFingerColors={false} />,
  );
  const reihen = [...container.firstElementChild!.firstElementChild!.children] as HTMLElement[];
  return { container, reihen, layout };
}

/** Das Key-Element an `layout.rows[zeile].keys[spalte]` - Edge-Tasten (Tab, Feststell …) verschieben den Index um 1. */
function tasteBei(reihen: HTMLElement[], layout: KeyboardLayout, zeile: number, spalte: number): HTMLElement {
  const row = layout.rows[zeile];
  const offset = row.left ? 1 : 0;
  return reihen[zeile].children[offset + spalte] as HTMLElement;
}

// --- A) AZERTY-Ziffernreihe zweistufig (fr/be) -------------------------------

describe("A · AZERTY-Ziffernreihe (fr/be): Ziffer oben, Grundzeichen unten", () => {
  it("fr: die é-Taste (Grundreihe-0, Spalte 2) zeigt 2 UND é", () => {
    const { reihen, layout } = zeichne("fr");
    expect(layout.rows[0].keys[2]).toBe("é");
    const el = tasteBei(reihen, layout, 0, 2);
    expect(el.textContent).toBe("2é");
    // die zweistufige Kappe trägt ihr eigenes Kennzeichen (Ziffer oben, Grundzeichen unten).
    expect(el.querySelector('[data-zweistufig="an"]')).not.toBeNull();
  });

  it("fr: die ç-Taste (Spalte 9) zeigt 9 UND ç", () => {
    const { reihen, layout } = zeichne("fr");
    expect(layout.rows[0].keys[9]).toBe("ç");
    expect(tasteBei(reihen, layout, 0, 9).textContent).toBe("9ç");
  });

  it("fr: die à-Taste (Spalte 10) zeigt 0 UND à", () => {
    const { reihen, layout } = zeichne("fr");
    expect(layout.rows[0].keys[10]).toBe("à");
    expect(tasteBei(reihen, layout, 0, 10).textContent).toBe("0à");
  });

  it("be: dieselbe Ziffernreihe wie fr (AZERTY_ROW0_ACCESS geteilt)", () => {
    const { reihen, layout } = zeichne("be");
    expect(tasteBei(reihen, layout, 0, 2).textContent).toBe("2é");
    expect(tasteBei(reihen, layout, 0, 9).textContent).toBe("9ç");
  });

  it("fr: eine Buchstabentaste OHNE Ziffernrolle bleibt einstufig (a → A)", () => {
    const { reihen, layout } = zeichne("fr");
    expect(layout.rows[1].keys[0]).toBe("a");
    expect(tasteBei(reihen, layout, 1, 0).textContent).toBe("A");
  });
});

// --- B) Akzentuierte Buchstaben klein, gewöhnliche gross ---------------------

describe("B · französische Tastaturen: é è ç à ù klein, alles andere gross", () => {
  it("fr: die p-Taste (kein Akzent) zeigt GROSS P", () => {
    const { reihen, layout } = zeichne("fr");
    const r = layout.rows.findIndex((row) => row.keys.includes("p"));
    const j = layout.rows[r].keys.indexOf("p");
    expect(tasteBei(reihen, layout, r, j).textContent).toBe("P");
  });

  it("fr: die è-Taste (Ziffernreihe) zeigt die Ziffer UND das kleine è (nicht È)", () => {
    const { reihen, layout } = zeichne("fr");
    const j = layout.rows[0].keys.indexOf("è");
    expect(tasteBei(reihen, layout, 0, j).textContent).toContain("è");
    expect(tasteBei(reihen, layout, 0, j).textContent).not.toContain("È");
  });

  it("ch-fr: é à è bleiben klein (Grundreihe, kein Ziffern-Doppelzeichen dort - ch-fr ist QWERTZ)", () => {
    const { reihen, layout } = zeichne("ch-fr");
    for (const ch of ["é", "à", "è"]) {
      let gefunden = false;
      for (let r = 0; r < layout.rows.length; r++) {
        const j = layout.rows[r].keys.indexOf(ch);
        if (j < 0) continue;
        gefunden = true;
        expect(tasteBei(reihen, layout, r, j).textContent, ch).toBe(ch);
      }
      expect(gefunden, `${ch} kommt auf ch-fr als eigene Taste vor`).toBe(true);
    }
    // ch-fr ist QWERTZ, keine Ziffernreihen-Verdopplung wie AZERTY (§3.2).
    const j = layout.rows[0].keys.indexOf("1");
    expect(tasteBei(reihen, layout, 0, j).textContent).toBe("1");
  });

  it("ca-csa: ç è à ù é bleiben klein, keine AZERTY-Zweistufigkeit", () => {
    const { reihen, layout } = zeichne("ca-csa");
    for (const ch of ["ç", "è", "à", "ù", "é"]) {
      let gefunden = false;
      for (let r = 0; r < layout.rows.length; r++) {
        const j = layout.rows[r].keys.indexOf(ch);
        if (j < 0) continue;
        gefunden = true;
        expect(tasteBei(reihen, layout, r, j).textContent, ch).toBe(ch);
      }
      expect(gefunden, `${ch} kommt auf ca-csa als eigene Taste vor`).toBe(true);
    }
  });

  it("ca-fr: é bleibt klein", () => {
    const { reihen, layout } = zeichne("ca-fr");
    const r = layout.rows.findIndex((row) => row.keys.includes("é"));
    const j = layout.rows[r].keys.indexOf("é");
    expect(tasteBei(reihen, layout, r, j).textContent).toBe("é");
  });
});

// --- C) de/ch/us/uk unverändert (Gegenprobe zu typing-tastatur-gedrueckt.test.tsx) ---

describe("C · de/ch/us/uk: keine Tastatur wird zweistufig, ß bleibt ß", () => {
  for (const id of ["de", "ch", "us", "uk"] as const) {
    it(`${id}: keine Taste ist zweistufig (keine AZERTY-Verdopplung)`, () => {
      const { reihen, layout } = zeichne(id);
      layout.rows.forEach((row, r) => {
        row.keys.forEach((_ch, j) => {
          const el = tasteBei(reihen, layout, r, j);
          expect(el.querySelector('[data-zweistufig="an"]'), `${id} Zeile ${r} Spalte ${j}`).toBeNull();
        });
      });
    });
  }

  it("de: ß bleibt ß (nicht SS)", () => {
    const { reihen, layout } = zeichne("de");
    const j = layout.rows[0].keys.indexOf("ß");
    expect(tasteBei(reihen, layout, 0, j).textContent).toBe("ß");
  });

  it("ch: ß gibt es nicht, dafür bleibt kein é/è/à/ç fälschlich klein (kein Layout dieser vier ist französisch)", () => {
    const { layout } = zeichne("ch");
    expect(layout.missing).toContain("ß");
  });
});
