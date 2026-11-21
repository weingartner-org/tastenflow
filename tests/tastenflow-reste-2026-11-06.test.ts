/**
 * Reste aus der Übergabe PC → Mac (§5, 06.11.2026):
 *  - Lehrkräfte mit spanischer Bedienung sahen die Gründe des Eigenständigkeits-Checks deutsch;
 *  - die eigene Vorlage derselben Klasse galt bei fr, es, it, pl als fremde Klasse.
 */
import { describe, expect, it } from "vitest";
import { gruendeIn } from "../src/components/lernwerkstatt/klasse/TastenflowReiter";
import { fremdeKlasseHinweis, vorlageTitel } from "../src/lib/lernwerkstatt/kinderImport";

const DEUTSCHE_GRUENDE = [
  "Noch zu wenige Daten.",
  "Unauffällig.",
  "Makellose Genauigkeit bei hohem Tempo, kein Lernverlauf.",
  "1× Einfügen (Paste) erkannt.",
  "3× Einfügen (Paste) erkannt.",
  "Häufiger Fokus-/Fensterwechsel (40 %).",
  "Sehr viele unplausibel schnelle Übungen (25 %).",
];

describe("Eigenständigkeits-Check: spanische Gründe", () => {
  it("jeder bekannte Grund kommt spanisch, ohne deutsche Reste und ohne Vorwurf an das Kind", () => {
    const es = gruendeIn(DEUTSCHE_GRUENDE, "es");
    expect(es).toHaveLength(DEUTSCHE_GRUENDE.length);
    for (const g of es) {
      expect(g).not.toMatch(/Daten|Einfügen|Fokus|Fenster|Übungen|Unauffällig|Makellose/);
      expect(g).not.toMatch(/[–—]/);
    }
    expect(es[0]).toBe("Todavía hay pocos datos.");
    expect(es[3]).toBe("Se detectó un pegado de texto.");
    expect(es[4]).toBe("Se detectó un pegado de texto 3 veces.");
    expect(es[5]).toContain("40 %");
    expect(es[6]).toContain("25 %");
  });

  it("ein unbekannter Satz bleibt, wie er ist", () => {
    expect(gruendeIn(["Etwas ganz Neues."], "es")).toEqual(["Etwas ganz Neues."]);
  });
});

describe("fremdeKlasseHinweis: die eigene Vorlage ist keine fremde Klasse", () => {
  for (const sprache of ["fr", "es", "it", "pl"] as const) {
    it(`${sprache}: Vorlage derselben Klasse ⇒ kein Hinweis; andere Klasse ⇒ Hinweis`, () => {
      expect(fremdeKlasseHinweis(vorlageTitel("3b", sprache), "3b", sprache)).toBeNull();
      const anders = fremdeKlasseHinweis(vorlageTitel("3a", sprache), "3b", sprache);
      expect(anders).not.toBeNull();
      expect(anders).toContain("3a");
    });
  }

  it("de und en wie bisher", () => {
    expect(fremdeKlasseHinweis(vorlageTitel("3b"), "3b", "de")).toBeNull();
    expect(fremdeKlasseHinweis(vorlageTitel("3b", "en"), "3b", "de")).toBeNull();
    expect(fremdeKlasseHinweis(vorlageTitel("3a"), "3b", "de")).not.toBeNull();
  });
});
