/**
 * ★ G2b-2 (02.10.2026): „Eigene Übung" kennt den Weg des Kindes.
 * Der Fehler stand im LIVE-Stand: eine französische oder spanische Lehrkraft
 * verlor é, ñ, ¿ beim Start aus ihrem Text („año" ⇒ „ao"), weil der Vorrat
 * fest `["de","en"]` war (G1c §3 Nr. 7).
 */
import { describe, expect, it } from "vitest";
import {
  entferneUntippbareZeichen,
  untippbareZeichen,
  verarbeiteEigenenText,
  verarbeiteFesteZeilen,
} from "@/lib/typing/eigenerText";

const OPT = { verbietenSs: false } as const;

describe("untippbareZeichen je Weg", () => {
  it("fr: é, à, è, ç bleiben tippbar", () => {
    expect(untippbareZeichen("Un café très français à Paris", { ...OPT, weg: "fr" })).toEqual([]);
  });

  it("es: ñ, ¿, ¡, ´ bleiben tippbar", () => {
    expect(untippbareZeichen("¿Qué año es? ¡Mañana!", { ...OPT, weg: "es" })).toEqual([]);
  });

  it("de: Verhalten unverändert - é und ñ liegen auf keiner Taste", () => {
    expect(untippbareZeichen("Café año", { ...OPT, weg: "de" })).toEqual(["é", "ñ"]);
    expect(untippbareZeichen("Café año", OPT)).toEqual(["é", "ñ"]);
  });

  it("en: wie de (é untippbar, ä wie bisher bekannt)", () => {
    expect(untippbareZeichen("Café", { ...OPT, weg: "en" })).toEqual(["é"]);
    expect(untippbareZeichen("Käse", { ...OPT, weg: "en" })).toEqual([]);
  });

  it("Totasten: á é í ó ú auf Weg es, ê ï ü auf Weg fr; auf de und en bleibt ê untippbar", () => {
    expect(untippbareZeichen("áéíóú ü", { ...OPT, weg: "es" })).toEqual([]);
    expect(untippbareZeichen("êîô ëï", { ...OPT, weg: "fr" })).toEqual([]);
    expect(untippbareZeichen("ê", { ...OPT, weg: "es" })).toEqual(["ê"]);
    expect(untippbareZeichen("ê", { ...OPT, weg: "de" })).toEqual(["ê"]);
    expect(untippbareZeichen("ê", { ...OPT, weg: "en" })).toEqual(["ê"]);
  });

  it("ein Zeichen des FREMDEN Weges bleibt untippbar (ñ auf Weg fr, ¿ auf Weg fr)", () => {
    expect(untippbareZeichen("año", { ...OPT, weg: "fr" })).toEqual(["ñ"]);
    expect(untippbareZeichen("¿", { ...OPT, weg: "fr" })).toEqual(["¿"]);
  });

  it("ohne Weg: wie vor G2b-2", () => {
    expect(untippbareZeichen("é é é ñ é", OPT)).toEqual(["é", "ñ"]);
    expect(untippbareZeichen("Straße", { verbietenSs: true })).toEqual(["ß"]);
  });

  it("neue Wege (it, pl, tr, cs) werfen nicht und halten den Vorrat von Weg en", () => {
    // ★ G2-NEUN (25.10.2026): ebenso die neun Wege des Gerüsts.
    for (const weg of ["it", "pl", "tr", "cs", "bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"] as const) {
      expect(untippbareZeichen("Hello world", { ...OPT, weg })).toEqual([]);
    }
  });

  it("tr: ein grosses İ wird wie ein i gelesen (nicht als zwei Zeichen)", () => {
    expect(untippbareZeichen("İ", { ...OPT, weg: "tr" })).toEqual([]);
  });
});

describe("der Weg läuft durch die ganze Kette", () => {
  it("verarbeiteEigenenText: fr behält é, de meldet es", () => {
    const fr = verarbeiteEigenenText("Un café", { ...OPT, weg: "fr" });
    expect(fr.unbekannt).toEqual([]);
    const de = verarbeiteEigenenText("Un café", { ...OPT, weg: "de" });
    expect(de.unbekannt).toEqual(["é"]);
  });

  it("verarbeiteFesteZeilen: es behält ñ", () => {
    expect(verarbeiteFesteZeilen(["año nuevo"], { ...OPT, weg: "es" }).unbekannt).toEqual([]);
  });

  it("der Start entfernt auf Weg es nichts mehr (año bleibt año), auf Weg de wie bisher", () => {
    const es = verarbeiteEigenenText("año nuevo ¿sí?", { ...OPT, weg: "es" });
    expect(entferneUntippbareZeichen(es.zeilen, new Set(es.unbekannt))).toEqual(es.zeilen);
    const de = verarbeiteEigenenText("año", { ...OPT, weg: "de" });
    expect(entferneUntippbareZeichen(de.zeilen, new Set(de.unbekannt))).toEqual(["ao"]);
  });
});
