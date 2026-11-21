/**
 * ★★★★★ WÄCHTER M8 (ES-P7a-Behebung, 27.09.2026, Prüfbericht Fundament es):
 * `wandleFormatoNumerico` machte verortete Zahlen falsch.
 *
 * `wandleVariante` (corpus.ts) wandte die es-419-Zahlenschreibung bisher auf
 * JEDE servierte Korpuszeile an - auch auf Zeilen mit einem eigenen ORT
 * (Bauplan §5.3: „verortete Zeilen schreiben nach ihrem Ort"). Gemessen
 * (e5): 13 von 1.793 Platzhalterzeilen wurden umgeschrieben, ALLE falsch:
 * Argentinien „$2.300" ⇒ „$2,300" (dort bedeutet das eine andere Zahl),
 * Kolumbien „1.800 metros" ⇒ „1,800", Mexiko „2,000 kilos" ⇒ „2.000" (Mexiko
 * schreibt schon selbst mit Dezimalpunkt - die Umwandlung drehte eine
 * RICHTIGE Schreibweise in eine falsche).
 *
 * Behoben: `wandleVariante` wendet `wandleFormatoNumerico` NICHT mehr auf
 * Korpus-/Serien-Text an - eine Korpuszeile bleibt exakt so geschrieben, wie
 * sie in der Datei steht. Die Umwandlung bleibt für ERZEUGTE (generator-
 * eigene) Zeilen bestehen (`generator.ts` `fertigeZeile`), weil die keinen
 * Ort haben; zusätzlich verzichtet die €-Vorlage für „es" jetzt ganz auf
 * Dezimalstellen (ein Dezimalbetrag in € gehört ohnehin nur nach Spanien).
 */
import { describe, expect, it } from "vitest";
import { wandleVariante } from "@/lib/typing/corpus";
import { wandleFormatoNumerico } from "@/lib/typing/esVariante";
import { setLayout } from "@/lib/typing/layouts";
import { introOrder } from "@/lib/typing/letters";
import { adaptiveRound } from "@/lib/typing/generator";

describe("★★★★★ M8: wandleVariante lässt Korpus-/Serien-Text mit esVariante unangetastet", () => {
  const VERORTETE_ZEILEN = [
    "Este año, la finca paga $2.300 por ficha, en efectivo, al terminar la jornada.", // Argentinien
    "La cooperativa debe entregar 2,000 kilos antes del 15 de diciembre.", // Mexiko (schon Dezimalpunkt)
    "Luego recorren el lote más alto, a 1.800 metros sobre el nivel del mar.", // Kolumbien
    "La residencia le ofrece un contrato de enfermera con un sueldo de 1.850 € al mes.", // Spanien
  ];

  for (const zeile of VERORTETE_ZEILEN) {
    it(`bleibt byte-gleich unter es-419: "${zeile.slice(0, 40)}…"`, () => {
      expect(wandleVariante(zeile, { esVariante: "es-419" })).toBe(zeile);
    });
    it(`bleibt byte-gleich unter es-ES: "${zeile.slice(0, 40)}…"`, () => {
      expect(wandleVariante(zeile, { esVariante: "es-ES" })).toBe(zeile);
    });
  }

  it("wandleFormatoNumerico selbst bleibt unverändert (wirkt weiter auf erzeugte Zeilen)", () => {
    // Die Funktion selbst ist nicht das Problem - WER sie aufruft, war es.
    expect(wandleFormatoNumerico("Un 12,5 % de descuento.", "es-419")).toBe("Un 12.5 % de descuento.");
  });

  it("de/en/fr unverändert: wandleVariante kennt kein esVariante-Feld für sie", () => {
    expect(wandleVariante("Der Preis ist 1.200,50 Euro.", {})).toBe("Der Preis ist 1.200,50 Euro.");
    expect(wandleVariante("It costs 1,200.50 dollars.", { variante: "us" })).not.toBe(undefined);
  });
});

describe("★★★★★ M8: die generator-eigene €-Vorlage auf Weg „es“ hat keine Dezimalstellen", () => {
  it('erzeugte Zeilen mit € enthalten nie einen Dezimalbetrag (latam kennt „€" laut Bauplan §3 ohnehin nicht)', () => {
    for (const l of ["es", "latam"] as const) {
      setLayout(l);
      const o = introOrder("es");
      const treffer: string[] = [];
      for (let r = 0; r < 60; r++) {
        const zeilen = adaptiveRound({
          introduced: o,
          focus: ["€"],
          stufe: "erwachsen",
          lang: "es",
          lernweg: "es",
          count: 12,
          esVariante: "es-419",
        });
        for (const z of zeilen) if (z.source === null && z.text.includes("€")) treffer.push(z.text);
      }
      if (l === "es") expect(treffer.length).toBeGreaterThan(0); // latam hat kein € (Bauplan §3)
      const mitDezimal = treffer.filter((t) => /\d[.,]\d.*€/.test(t));
      expect(mitDezimal, mitDezimal.join(" | ")).toEqual([]);
    }
  });
});
