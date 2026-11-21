/**
 * WÄCHTER: Die Beschreibung des Niveaus „Programmcode" (27.09.2026).
 *
 * Die Erklärung von „code" sagte auf Weg „fr" *„dix langages de
 * programmation"* und auf Weg „es" *„diez lenguajes de programación"* -
 * dieselbe Beschreibung wie auf „de"/„en" (echter Quelltext aus zehn
 * Programmiersprachen von echten Open-Source-Projekten, Johannes' Wunsch vom
 * 10.09.2026). Das stimmt nur für „de"/„en": Die Bänke „fr"
 * (`BEFUND-2026-09-26-E13B5-DEFI-CODE.md`) und „es"
 * (`BEFUND-2026-09-27-ES-RETO-CODE.md`) sind SELBST GESCHRIEBEN, nicht von
 * echten Projekten, und in nur DREI Sprachen: Python, JavaScript, SQLite.
 *
 * Dieser Wächter hält: die Zahl (drei, nicht zehn/dix/diez), die drei echten
 * Sprachen, KEIN „échte Quelltext"/„código … real" MEHR aus fremden
 * Projekten - und dass „de"/„en" unangetastet bleiben (dort stimmt die alte
 * Beschreibung weiter).
 */
import { describe, expect, it } from "vitest";
import { niveauDefs, niveauTexte } from "@/lib/typing/schreibprobe";

function codeErklaerung(lernweg: "de" | "en" | "fr" | "es"): string {
  const defs = niveauDefs(lernweg);
  const code = defs.find((d) => d.key === "code");
  if (!code) throw new Error('Niveau „code" nicht gefunden');
  return niveauTexte(code, lernweg).erklaerung;
}

describe('Niveau "code": fr/es beschreiben SELBST GESCHRIEBENE Programme in DREI Sprachen', () => {
  it('fr: "trois langages" und Python, JavaScript, SQLite - nicht mehr "dix"/"projets libres"', () => {
    const e = codeErklaerung("fr");
    expect(e).toContain("trois langages de programmation");
    expect(e).toContain("Python, JavaScript, SQLite");
    expect(e).not.toMatch(/dix langages/);
    expect(e).not.toMatch(/projets libres/);
  });

  it('es: "tres lenguajes" und Python, JavaScript, SQL - nicht mehr "diez"/"proyectos libres"', () => {
    // ★ ES-TF2 R: „SQL" statt „SQLite" (SQLite ist eine Datenbank, keine Sprache).
    const e = codeErklaerung("es");
    expect(e).toContain("tres lenguajes de programación");
    expect(e).toContain("Python, JavaScript, SQL)");
    expect(e).not.toMatch(/diez lenguajes/);
    expect(e).not.toMatch(/proyectos libres/);
  });

  it("de/en bleiben unverändert - dort ist der Code wirklich aus zehn Sprachen echter Projekte", () => {
    expect(codeErklaerung("de")).toBe(
      "Echter Quelltext aus offenen Projekten, in zehn Programmiersprachen - " +
        "dieselben Zeichen wie beim Niveau Alles, aber viel dichter.",
    );
    expect(codeErklaerung("en")).toBe(
      "Real source code from open-source projects, in ten programming languages - " +
        "the same characters as “All keys”, but far more tightly packed.",
    );
  });

  it("Rest des Satzes (Zeichenvergleich) bleibt in fr/es wörtlich wie vorher", () => {
    expect(codeErklaerung("fr")).toContain(
      'les mêmes caractères que "Toutes les touches", mais bien plus serrés.',
    );
    expect(codeErklaerung("es")).toContain(
      'los mismos caracteres que "Todas las teclas", pero mucho más apretados.',
    );
  });
});
