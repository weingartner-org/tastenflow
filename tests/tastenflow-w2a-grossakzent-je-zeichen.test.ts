/**
 * ★★★ W2a (28.09.2026, Auftrag Punkt 7): GROSSBUCHSTABEN MIT AKZENT JE ZEICHEN
 * FREISCHALTEN - aus dem Tastaturmodell (`access`), nicht aus einer Liste.
 *
 * W1 hatte sie auf Weg „fr" alle an die LETZTE Einheit gebunden
 * (`grossAkzentAb`): rund 29 Serien und 140 Korpuszeilen kamen erst am Ende -
 * auch dort, wo die Totaste längst sass (Kanada, Schweiz: À È über ^-Taste).
 * Jetzt ist ein Grossbuchstabe über eine Totaste frei, sobald die Einheit(en)
 * gelernt sind, über die er auf DIESER Tastatur entsteht.
 *
 * Die Messung vorher/nachher je Sprosse: `scripts/w2a-messung-grossakzent.mts`
 * (Befund W2a §7).
 */
import { afterEach, describe, expect, it } from "vitest";
import { STUFEN, type Stufe } from "../src/lib/typing/account";
import { introOrder, introducedUpTo, SHIFT_UNIT } from "../src/lib/typing/letters";
import { layoutById, setLayout, type KeyboardLayout, type LayoutId } from "../src/lib/typing/layouts";
import { corpusItemsFor, fitText, grossAkzentEinheiten } from "../src/lib/typing/corpus";
import { allowedFromIntroduced } from "../src/lib/typing/serien";
import { grossbuchstabeWeg } from "../src/lib/typing/totasten";
import { lernwegDef } from "../src/lib/typing/lernweg";

afterEach(() => setLayout("de"));

const LAYOUTS: LayoutId[] = ["fr", "be", "ch-fr", "ca-csa", "ca-fr"];
const GROSS = ["À", "É", "È", "Ù", "Ê", "Î", "Ô", "Û", "Ë", "Ï", "Ç"];

function tabelle(l: LayoutId): Record<string, string> {
  setLayout(l);
  const lay = layoutById(l);
  const out: Record<string, string> = {};
  for (const z of GROSS) {
    const weg = grossbuchstabeWeg(z, lay);
    out[z] = weg === "totaste" ? grossAkzentEinheiten(z, lay, "fr").join(" ") : String(weg);
  }
  return out;
}

describe("die Einheiten je Zeichen und Tastatur - so, wie die Windows-Belegung sie erzeugt", () => {
  it("Frankreich AZERTY: Ê Î Ô Û über ^, Ë Ï über ¨, À È Ù über AltGr + 7 (erste AltGr-Einheit @), É Ç fehlen", () => {
    expect(tabelle("fr")).toEqual({
      À: "^ @", É: "fehlt", È: "^ @", Ù: "^ @", Ê: "^", Î: "^", Ô: "^", Û: "^", Ë: "¨", Ï: "¨", Ç: "fehlt",
    });
  });

  it("Belgien: zusätzlich É über AltGr + ù (Akut)", () => {
    expect(tabelle("be")).toMatchObject({ É: "^ @", À: "^ @", Ê: "^", Ë: "¨", Ç: "fehlt" });
  });

  it("Schweiz-Französisch: À È Ù über Umschalt + ^ (Gravis) - ohne AltGr; É über AltGr + '", () => {
    expect(tabelle("ch-fr")).toMatchObject({ À: "^", È: "^", Ù: "^", É: "^ @", Ê: "^" });
  });

  it("Kanada CSA: À É È Ù Ç direkt, nur Ê … und Ë Ï über die Totaste", () => {
    expect(tabelle("ca-csa")).toMatchObject({ À: "direkt", É: "direkt", Ç: "direkt", Ê: "^", Ë: "¨" });
  });

  it("die Umschalttaste steht auf jeder Tastatur VOR jeder Totasten-Einheit (darum nicht in der Liste)", () => {
    for (const l of LAYOUTS) {
      setLayout(l);
      const order = introOrder("fr");
      const lay = layoutById(l);
      const shift = order.indexOf(SHIFT_UNIT);
      const totasten = order.filter((u) => lay.access[u]?.dead === true);
      expect(totasten.length, l).toBeGreaterThan(0);
      for (const t of totasten) expect(order.indexOf(t), `${l}: ${t}`).toBeGreaterThan(shift);
    }
  });
});

describe("Gegenprobe: abgeleitet aus dem Modell, keine Liste", () => {
  it("dieselbe Gravis-Totaste: mit AltGr (Frankreich) braucht sie @, mit Umschalt (Schweiz) nicht", () => {
    setLayout("fr");
    const fr = layoutById("fr");
    expect(grossAkzentEinheiten("À", fr, "fr")).toEqual(["^", "@"]);
    const umgebaut: KeyboardLayout = {
      ...fr,
      access: { ...fr.access, "`": { ...fr.access["`"], mod: "shift" } },
    };
    expect(grossAkzentEinheiten("À", umgebaut, "fr")).toEqual(["^"]);
  });

  it("ohne jede AltGr-Einheit fällt es auf die letzte Einheit zurück (Stand vor W2a)", () => {
    setLayout("fr");
    const fr = layoutById("fr");
    const access = Object.fromEntries(
      Object.entries(fr.access).map(([k, v]) => [k, v.mod === "altgr" && v.dead !== true ? { ...v, mod: undefined } : v]),
    ) as KeyboardLayout["access"];
    expect(grossAkzentEinheiten("À", { ...fr, access }, "fr")).toEqual([lernwegDef("fr").grossAkzentAb]);
  });
});

describe("die Textauswahl hält sich daran - an der Sprosse der Einheit, nicht davor", () => {
  const zeilenBei = (n: number) => {
    const allowed = allowedFromIntroduced(introducedUpTo(n, "fr"), "fr");
    return (STUFEN as Stufe[]).flatMap((stufe) => corpusItemsFor({ stufe, allowed, lang: "fr", lernweg: "fr" }));
  };

  it("Schweiz-Französisch: Zeilen mit À/È kommen mit ^ (vorher erst am Ende) - vor ^ keine", () => {
    setLayout("ch-fr");
    const hoch = introOrder("fr").indexOf("^") + 1;
    expect(zeilenBei(hoch - 1).filter((z) => /[ÀÈ]/.test(z))).toEqual([]);
    expect(zeilenBei(hoch).filter((z) => /[ÀÈ]/.test(z)).length).toBeGreaterThan(0);
    expect(hoch).toBeLessThan(introOrder("fr").length - 30);
  }, 120_000);

  it("fitText: „Être là\" mit ^, „À demain\" auf AZERTY erst mit @ - auf der Schweiz schon mit ^", () => {
    setLayout("fr");
    const bis = (u: string) =>
      allowedFromIntroduced(introducedUpTo(introOrder("fr").indexOf(u) + 1, "fr"), "fr");
    expect(fitText("Être là", bis("^"), "fr")).toBe("Être là");
    expect(fitText("À demain", bis("^"), "fr")).toBeNull();
    expect(fitText("À demain", bis("@"), "fr")).toBe("À demain");
    setLayout("ch-fr");
    expect(fitText("À demain", bis("^"), "fr")).toBe("À demain");
  });
});
