/**
 * ★★★ WÄCHTER D1 Nr. 15 (28.09.2026, Entscheidung Johannes): das
 * Dezimalzeichen im Spanischen kommt aus dem LAND der Browsersprache.
 *
 * Bis hierher: erzeugte Übungszeilen schrieben bei jeder lateinamerikanischen
 * Variante (`es-419`) den Punkt - auch in Argentinien, Kolumbien, Chile, wo
 * das Komma gilt -, und die Oberfläche schrieb fest nach Spanien
 * (`zahl`) bzw. fest mit Punkt (Tippchallenge-Wertung, Tastenkarte).
 *
 * Jetzt: die erste spanische Browsersprache mit Land entscheidet, die Quelle
 * ist CLDR (`Intl.NumberFormat`), ohne Land gilt das Komma. Oberfläche und
 * Übungszeilen gehen durch dieselbe Funktion (`esZahlGebietAus`).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { dezimal, dezimalzeichen, esZahlGebietAus, zahl } from "@/lib/bedienSprache";
import { wandleFormatoNumerico } from "@/lib/typing/esVariante";
import { eineStelle } from "@/components/typing/SchreibprobeErgebnis";

function mitSprachen(sprachen: string[]) {
  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(sprachen);
}

afterEach(() => vi.restoreAllMocks());

describe("D1 Nr. 15 · das Land aus der Browsersprache", () => {
  it("Punkt, wo CLDR den Punkt führt", () => {
    for (const land of ["MX", "GT", "HN", "SV", "NI", "PA", "DO", "PR", "US", "PE", "CU"]) {
      const g = esZahlGebietAus([`es-${land}`]);
      expect(g, land).toBe(`es-${land}`);
      expect(dezimalzeichen(g), land).toBe(".");
    }
    expect(dezimalzeichen(esZahlGebietAus(["es-419"]))).toBe(".");
  });

  it("Komma, wo CLDR das Komma führt", () => {
    for (const land of ["AR", "CO", "CL", "UY", "PY", "BO", "EC", "VE", "CR", "ES"]) {
      expect(dezimalzeichen(esZahlGebietAus([`es-${land}`])), land).toBe(",");
    }
  });

  it("ohne Land das Komma: blosses „es“, keine spanische Sprache, leere Liste", () => {
    expect(esZahlGebietAus(["es"])).toBe("es-ES");
    expect(esZahlGebietAus(["de-AT", "en-US"])).toBe("es-ES");
    expect(esZahlGebietAus([])).toBe("es-ES");
    expect(dezimalzeichen(esZahlGebietAus(["es"]))).toBe(",");
  });

  it("die ERSTE spanische Sprache entscheidet, auch hinter anderen", () => {
    expect(esZahlGebietAus(["de-AT", "es-MX", "es-AR"])).toBe("es-MX");
    expect(esZahlGebietAus(["en-US", "es_AR"])).toBe("es-AR");
  });
});

describe("D1 Nr. 15 · Übungszeilen (wandleFormatoNumerico)", () => {
  const zeile = "El vuelo cuesta 1.200,50 euros y un 12,5 % menos.";
  it("Mexiko: Punkt und Komma vertauscht", () => {
    expect(wandleFormatoNumerico(zeile, "es-MX")).toBe("El vuelo cuesta 1,200.50 euros y un 12.5 % menos.");
  });
  it("Argentinien und Spanien: Grundform bleibt (vorher bekam Argentinien den Punkt)", () => {
    expect(wandleFormatoNumerico(zeile, "es-AR")).toBe(zeile);
    expect(wandleFormatoNumerico(zeile, "es-ES")).toBe(zeile);
  });
  it("es-419 wie bisher: Punkt (CLDR)", () => {
    expect(wandleFormatoNumerico("Un 12,5 % de descuento.", "es-419")).toBe("Un 12.5 % de descuento.");
  });
});

describe("D1 Nr. 15 · die Oberfläche schreibt dieselbe Zahl", () => {
  it("es-MX: zahl, dezimal, Tippchallenge-Wertung mit Punkt", () => {
    mitSprachen(["es-MX"]);
    expect(dezimal("es")).toBe(".");
    expect(zahl(1234.5, "es")).toBe("1,234.5");
    expect(eineStelle(83.44, "es")).toBe("83.4");
  });
  it("es-AR: Komma", () => {
    mitSprachen(["es-AR"]);
    expect(dezimal("es")).toBe(",");
    expect(zahl(1234.5, "es")).toBe("1.234,5");
    expect(zahl(0.5, "es")).toBe("0,5");
    expect(eineStelle(83.44, "es")).toBe("83,4");
  });
  it("ohne spanische Browsersprache: Komma (Spanien)", () => {
    mitSprachen(["de-AT"]);
    expect(dezimal("es")).toBe(",");
    expect(eineStelle(83.44, "es")).toBe("83,4");
  });
  it("Gegenprobe: de/en/fr unverändert", () => {
    mitSprachen(["es-MX"]);
    expect(eineStelle(83.44, "de")).toBe("83,4");
    expect(eineStelle(83.44, "en")).toBe("83.4");
    expect(eineStelle(83.44, "fr")).toBe("83,4");
    expect(zahl(0.5, "de")).toBe("0,5");
    expect(zahl(0.5, "en")).toBe("0.5");
  });
});
