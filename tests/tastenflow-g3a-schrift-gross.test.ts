/**
 * ★★★ G3a-SCHRIFT (25.10.2026): Grossschreibung Griechisch. Der Wortanfang behält den Tonos („Άλογο"), ganze Wörter
 * in Grossbuchstaben tragen keinen („ΑΛΟΓΟ"), und ΐ/ΰ (mit `toUpperCase()` DREI Code-Punkte) bekommen eine Grossform
 * aus EINEM Zeichen. Alle anderen Sprachen: Zeichen für Zeichen wie vorher.
 */
import { describe, expect, it } from "vitest";
import { ALLE_SPRACHEN, ganzGrossFuer, grossFuer, kleinFuer, sprachBeschreibung } from "../src/lib/typing/sprachRegister";

const PROBE = "άλογο ΐ ΰ istanbul Straße ő ș й ї ά";

describe("Griechisch", () => {
  it("Wortanfang mit Tonos bleibt mit Tonos", () => {
    expect(grossFuer("ά", "el")).toBe("Ά");
    expect(grossFuer("ώ", "el")).toBe("Ώ");
    expect(grossFuer("ά", "el") + "λογο").toBe("Άλογο");
  });
  it("ΐ und ΰ: EIN Zeichen als Grossform (Ϊ, Ϋ) - nicht drei", () => {
    expect([..."ΐ".toUpperCase()].length).toBe(3); // die Falle selbst
    expect(grossFuer("ΐ", "el")).toBe("Ϊ");
    expect(grossFuer("ΰ", "el")).toBe("Ϋ");
    expect([...grossFuer("Ταΐζω", "el")].length).toBe([..."Ταΐζω"].length);
  });
  it("jeder griechische Kleinbuchstabe hat mit `grossFuer` eine Grossform aus einem Zeichen", () => {
    for (const c of "αβγδεζηθικλμνξοπρσςτυφχψωάέήίόύώϊϋΐΰ") {
      expect([...grossFuer(c, "el")].length, c).toBe(1);
      expect(grossFuer(c, "el"), c).not.toBe(c);
    }
  });
  it("ganze Wörter in Grossbuchstaben: ohne Tonos, Trema wo der Tonos einen Doppellaut trennte", () => {
    expect(ganzGrossFuer("άλογο", "el")).toBe("ΑΛΟΓΟ");
    expect(ganzGrossFuer("Ελλάδα", "el")).toBe("ΕΛΛΑΔΑ");
    expect(ganzGrossFuer("άυπνος", "el")).toBe("ΑΫΠΝΟΣ");
    expect(ganzGrossFuer("προϊόν", "el")).toBe("ΠΡΟΪΟΝ");
    expect(ganzGrossFuer("ΐ", "el")).toBe("Ϊ");
    // Gegenprobe: `grossFuer` (Wortanfang) behält den Tonos
    expect(grossFuer("άλογο", "el")).toBe("ΆΛΟΓΟ");
  });
  it("Kleinschreibung: Schluss-Sigma von selbst, Ά ⇒ ά", () => {
    expect(kleinFuer("ΟΔΟΣ", "el")).toBe("οδος");
    expect(kleinFuer("Ά", "el")).toBe("ά");
  });
});

describe("alle anderen Sprachen: wie vorher", () => {
  it("ohne Sonderformen und ohne eigenes Gebietsschema für ganze Wörter", () => {
    for (const s of ALLE_SPRACHEN.filter((x) => x !== "el")) {
      expect(sprachBeschreibung(s).grossSonderformen, s).toEqual({});
      expect(sprachBeschreibung(s).ganzGrossLocale, s).toBeNull();
    }
  });
  it("grossFuer und ganzGrossFuer = die Rechnung von vorher", () => {
    for (const s of ALLE_SPRACHEN.filter((x) => x !== "el")) {
      const l = sprachBeschreibung(s).grossKleinLocale;
      const vorher = l ? PROBE.toLocaleUpperCase(l) : PROBE.toUpperCase();
      expect(grossFuer(PROBE, s), s).toBe(vorher);
      expect(ganzGrossFuer(PROBE, s), s).toBe(vorher);
    }
  });
});
