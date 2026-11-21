/**
 * ★ G4-NAHT (25.10.2026): EINE Regel für die Tastenkappe - `kappeFuer` (sprachRegister.ts, Lektionstexte der neun Wege)
 * und die Ansage-Kappe `kappeCs` (fingers.ts) sagen für jede Taste der kyrillischen und griechischen Tastaturen dasselbe;
 * ς bleibt ς (G3b, kleine Kappen). Lateinische Tasten: unverändert (gross a-z, sonst der gesprochene Name).
 */
import { afterEach, describe, expect, it } from "vitest";
import { kappeCs } from "../src/lib/typing/fingers";
import { LAYOUTS, layoutSprache, setLayout } from "../src/lib/typing/layouts";
import { kappeFuer } from "../src/lib/typing/sprachRegister";

afterEach(() => setLayout("de"));

const NICHT_LATEIN = /^[\p{Script=Cyrillic}\p{Script=Greek}]$/u;

describe("G4-NAHT: kappeCs fragt kappeFuer", () => {
  it("jede kyrillische und griechische Taste: kappeCs = kappeFuer in der Sprache der Tastatur", () => {
    let n = 0;
    for (const l of LAYOUTS) {
      const tasten = l.rows.flatMap((r) => r.keys).filter((k) => NICHT_LATEIN.test(k));
      if (!tasten.length) continue;
      setLayout(l.id);
      for (const t of tasten) {
        expect(kappeCs(t), `${l.id} ${t}`).toBe(kappeFuer(t, layoutSprache(l), l.kleineKappen));
        n++;
      }
    }
    expect(n).toBeGreaterThan(200);
  });

  it("die kleinen Kappen (G3b `kleineKappen`): ς bleibt ς, ь bleibt ь auf bg (Ь ist nicht tippbar)", () => {
    setLayout("el");
    expect(kappeCs("ς")).toBe("ς");
    expect(kappeFuer("ς", "el")).toBe("ς");
    expect(kappeFuer("ь", "bg")).toBe("Ь");
    expect(kappeFuer("ь", "bg", ["ь"])).toBe("ь");
    expect(kappeCs("σ")).toBe("Σ");
    for (const l of LAYOUTS.filter((x) => x.kleineKappen?.length)) {
      setLayout(l.id);
      for (const k of l.kleineKappen ?? []) {
        if (!NICHT_LATEIN.test(k)) continue;
        expect(kappeCs(k), `${l.id} ${k}`).toBe(k);
      }
    }
  });

  it("lateinische Tasten wie vorher", () => {
    setLayout("hu");
    expect(kappeCs("f")).toBe("F");
    expect(kappeCs("ő")).not.toBe("Ő");
    setLayout("cs");
    expect(kappeCs("d")).toBe("D");
  });
});
