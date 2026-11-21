/**
 * ★★★★★ WÄCHTER M3/M5 (Mechanik-Prüfung des französischen Lehrgangs,
 * 26.09.2026): JEDE Einheit des Weges „fr" hat auf JEDER französischen
 * Tastatur einen Griff - direkt, mit Umschalt, mit AltGr oder über eine
 * Totaste.
 *
 * Der Fund: auf ca-fr waren `à è` Einheiten ohne jeden Weg (die Gravis-
 * Totaste galt als Fehlgriff, 1713 bzw. 2139 Zeilen unschaffbar), auf beiden
 * Kanada-Belegungen `¨` und die Kerntasten `?` (und auf ca-fr `:`) ohne Taste;
 * auf Belgien fehlte `!` im Lehrgang ganz. Ein Kind blieb an einer Einheit
 * stecken, die es nicht tippen konnte. Die Griffe sind am Mac per
 * UCKeyTranslate gemessen (Befund Mechanik-Behebung §M3/§M5), Windows steht
 * auf der Liste E14.
 *
 * Geprüft wird auch, dass jeder Griff auf eine Taste ZEIGT, die es auf der
 * Tastatur gibt (`base` in `rows`) - ein Eintrag, dessen Grundtaste fehlt, ist
 * kein Griff.
 */
import { afterEach, describe, expect, it } from "vitest";
import { activeLayout, setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { kombizeichenFuerLayout } from "../src/lib/typing/totasten";
import { lernwegDef } from "../src/lib/typing/lernweg";

afterEach(() => setLayout("de"));

const TASTATUREN: LayoutId[] = ["fr", "be", "ch-fr", "ca-csa", "ca-fr"];

function griff(u: string): string | null {
  const lay = activeLayout();
  const tasten = new Set(lay.rows.flatMap((r) => r.keys));
  if (u === SHIFT_UNIT) return "Umschalt";
  if (tasten.has(u)) return "Taste";
  const a = lay.access[u];
  if (a) return tasten.has(a.base) ? `${a.mod ?? ""}${a.dead ? " tot" : ""} (${a.base})` : null;
  const k = kombizeichenFuerLayout(lay).find((z) => z.zeichen === u);
  if (k) {
    const t = lay.access[k.tot];
    return t && tasten.has(t.base) && (tasten.has(k.dann) || lay.access[k.dann]) ? `Totaste ${k.tot}` : null;
  }
  return null;
}

describe("★★★★★ M3/M5: jede Einheit des Weges „fr“ hat auf jeder Tastatur einen Griff", () => {
  for (const l of TASTATUREN) {
    it(`${l}: kein Stecken-Bleiben`, () => {
      setLayout(l);
      const ohne = introOrder("fr").filter((u) => griff(u) === null);
      expect(ohne, `${l}: Einheiten ohne Griff`).toEqual([]);
    });

    it(`${l}: jeder Eintrag in access zeigt auf eine vorhandene Taste`, () => {
      setLayout(l);
      const lay = activeLayout();
      const tasten = new Set(lay.rows.flatMap((r) => r.keys));
      // Nur die Zeichen, die der Lehrgang braucht (die übrigen AltGr-Einträge
      // sind Erbe von Frankreich/Schweiz und stehen auf der Liste E14).
      const lehrgang = new Set(introOrder("fr"));
      const kaputt = Object.entries(lay.access)
        .filter(([z]) => lehrgang.has(z))
        .filter(([, a]) => !tasten.has(a.base))
        .map(([z, a]) => `${z}←${a.base}`);
      expect(kaputt).toEqual([]);
    });
  }

  it("Kanada: à è ù ë ï haben einen Weg (ca-fr über Gravis/Trema, ca-csa direkt/Trema)", () => {
    for (const l of ["ca-fr", "ca-csa"] as const) {
      setLayout(l);
      for (const z of ["à", "è", "ù", "ë", "ï"]) expect(griff(z), `${l}: ${z}`).not.toBeNull();
    }
  });

  it("Belgien: „!“ ist eine Einheit des Lehrgangs (72 wie Frankreich)", () => {
    setLayout("be");
    expect(introOrder("fr")).toContain("!");
    setLayout("fr");
    const fr = introOrder("fr").length;
    setLayout("be");
    expect(introOrder("fr").length).toBe(fr);
  });

  it("die Satzzeichen des Weges sind auf keiner französischen Tastatur „fehlend“", () => {
    for (const l of TASTATUREN) {
      setLayout(l);
      const o = introOrder("fr");
      for (const p of lernwegDef("fr").punctOrder) expect(o, `${l}: ${p}`).toContain(p);
    }
  });
});
