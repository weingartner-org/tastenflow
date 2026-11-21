/**
 * ★ WÄCHTER D1 (28.09.2026, Entscheidung Johannes Nr. 16): der Klassencode-
 * Vorschlag bei Buchstaben anderer Sprachen.
 *
 * Bis hierher fiel jeder Buchstabe ausser A-Z, Ziffern und den deutschen
 * Umlauten GANZ weg: „Año 5" → „AO5", „CM2 École" → „CM2COLE", „Niño" → „NIO".
 * Jetzt: Ñ → NI (nicht „N" - „AÑO" würde „ANO"), Akzente und Cedille weg,
 * der Grundbuchstabe bleibt. Die Gegenprobe: Namen ohne solche Buchstaben -
 * und die deutschen Umlaute - ergeben denselben Code wie vorher (die alte
 * Regel steht hier als `alteRegel` wörtlich, damit der Vergleich nicht vom
 * neuen Code abhängt).
 */
import { describe, expect, it } from "vitest";
import { klassencodeFehler, klassencodeVorschlag } from "@/lib/lernwerkstatt/klassencode";

/** Die Regel bis 27.09.2026, wörtlich (Gegenprobe). */
function alteRegel(name: string): string {
  const code = name
    .toUpperCase()
    .replace(/Ä/g, "AE")
    .replace(/Ö/g, "OE")
    .replace(/Ü/g, "UE")
    .replace(/ẞ/g, "SS")
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 12);
  return code.length >= 2 ? code : "";
}

describe("D1 · Klassencode-Vorschlag mit Ñ und Akzenten", () => {
  it("Johannes' Beispiel: „Año 5“ → „ANIO5“ (nicht „ANO5“)", () => {
    expect(klassencodeVorschlag("Año 5")).toBe("ANIO5");
    expect(klassencodeVorschlag("año 5")).toBe("ANIO5");
  });

  it("Akzente weg, der Grundbuchstabe bleibt; Ç → C", () => {
    expect(klassencodeVorschlag("Árbol 3")).toBe("ARBOL3");
    expect(klassencodeVorschlag("CM2 École")).toBe("CM2ECOLE");
    expect(klassencodeVorschlag("Garçon")).toBe("GARCON");
    expect(klassencodeVorschlag("Niño")).toBe("NINIO");
    // „Ü" bleibt die deutsche Regel (UE) - auch im spanischen „pingüino";
    // die Umlaut-Regel ist bewusst unverändert (Gegenprobe unten).
    expect(klassencodeVorschlag("Pingüino")).toBe("PINGUEINO");
    expect(klassencodeVorschlag("Tercero de Primaria Ñuñoa")).toBe("TERCERODEPRI");
  });

  it("jeder neue Vorschlag besteht die Prüfung beim Anlegen", () => {
    for (const n of ["Año 5", "Árbol 3", "CM2 École", "Garçon", "Niño", "Ñandú"])
      expect(klassencodeFehler(klassencodeVorschlag(n)), n).toBeNull();
  });

  it("Gegenprobe: de/en/fr-Namen ohne solche Buchstaben und mit Umlauten wie bisher", () => {
    for (const n of [
      "MS-Wein",
      "3b",
      "Größte Klasse 2026/27",
      "ä",
      "Ü1",
      "Übungsgruppe Öko",
      "Straße 4",
      "Year 5 Robins",
      "CM1 B",
      "Vorbereitungskurs Herbst",
      "a",
    ]) {
      expect(klassencodeVorschlag(n), n).toBe(alteRegel(n));
    }
  });
});

/**
 * ★ 10.10.2026: der Vorschlag im Formular „Neue Klasse" bekam die Sprache nie mit -
 * „Łódź 3b" wurde „ODZ3B", „Üsküdar 5A" „UESKUEDAR5A". Jetzt reicht `KlasseUndKinder`
 * die Bedienungssprache durch. Für de/en/fr/es ergibt das denselben Code wie ohne
 * Sprache (Gegenprobe unten), für it/pl/tr/cs den Grundbuchstaben.
 */
describe("Klassencode-Vorschlag mit der Bedienungssprache", () => {
  it("pl/tr/cs: Sonderbuchstaben werden zum Grundbuchstaben, nichts fällt weg", () => {
    expect(klassencodeVorschlag("Łódź 3b", "pl")).toBe("LODZ3B");
    expect(klassencodeVorschlag("Üsküdar 5A", "tr")).toBe("USKUDAR5A");
    expect(klassencodeVorschlag("Řečice 4", "cs")).toBe("RECICE4");
  });

  it("Gegenprobe: de/en/fr/es geben mit Sprache denselben Code wie ohne", () => {
    for (const n of ["Bär 3a", "Größe 7", "Año 5", "CM2 École", "Müller", "Straße 1"])
      for (const l of ["de", "en", "fr", "es"] as const) expect(klassencodeVorschlag(n, l), `${n} ${l}`).toBe(klassencodeVorschlag(n));
  });

  it("das Formular reicht die Sprache durch (Quelltext-Wächter)", async () => {
    const { readFileSync } = await import("node:fs");
    const src = readFileSync("src/components/lernwerkstatt/klasse/KlasseUndKinder.tsx", "utf8");
    const aufrufe = src.match(/klassencodeVorschlag\([^)]*\)/g) ?? [];
    expect(aufrufe.length).toBeGreaterThan(0);
    for (const a of aufrufe) expect(a).toMatch(/,\s*sprache\)/);
  });
});
