/**
 * ★★★ WÄCHTER: `unitHowToTypeFr` (E10a, 25.09.2026, Bauplan §8.3 Punkt 1).
 *
 * Geprüft wird die FRANZÖSISCHE FASSUNG selbst - Finger auf Französisch
 * (`fingerName(f, "fr")`, siehe `fingers.ts`), Reihe auf Französisch
 * (`rowName(ch, "fr")`, `ROW_NAMES_FR`) und die Zusatztaste (Umschalt/Totaste)
 * in eigenen, französischen Wörtern. Bewusst OHNE `setLayout("fr")`/AZERTY-
 * Einzelheiten (die gehören E1/E3 - `layouts.ts`, hier gemieden): die
 * Funktion selbst arbeitet layoutunabhängig (sie fragt nur `activeLayout()`
 * ab), darum genügt die Standard-Tastatur, um IHRE eigene Logik zu prüfen.
 */
import { describe, expect, it } from "vitest";
import { unitHowToType, unitHowToTypeEn, unitHowToTypeFr, SHIFT_UNIT } from "@/lib/typing/letters";
import { FINGERS } from "@/lib/typing/fingers";

describe("★ unitHowToTypeFr", () => {
  it("die Umschalttaste: eigener, ausgeschriebener französischer Satz", () => {
    expect(unitHowToTypeFr(SHIFT_UNIT)).toBe(
      "C'est ainsi qu'on écrit les majuscules : tenir la touche Maj de l'autre main.",
    );
  });

  it("ein Buchstabe: Taste, Finger auf Französisch, Reihe auf Französisch", () => {
    const satz = unitHowToTypeFr("a");
    expect(satz).toMatch(/^C'est sur la touche A,/);
    expect(satz).toContain("rangée de base"); // "a" ist Heimattaste des linken kleinen Fingers
    // Irgendein französischer Fingername (nicht "linker"/"rechter" - das wäre Deutsch).
    expect(satz).toMatch(/gauche|droit|pouce/);
    expect(satz).not.toContain("linker");
    expect(satz).not.toContain("rechter");
  });

  it("eine Ziffer: das Wort auf Französisch (Bauplan §8.3), nicht auf Deutsch oder Englisch", () => {
    const satz = unitHowToTypeFr("5");
    expect(satz).toContain("cinq");
    expect(satz).not.toContain("fünf");
    expect(satz).not.toContain("five");
  });

  it("dieselbe Einheit liefert auf de/en/fr drei verschiedene, aber je in sich stimmige Sätze", () => {
    const de = unitHowToType("5");
    const en = unitHowToTypeEn("5");
    const fr = unitHowToTypeFr("5");
    expect(de).toContain("Fünf");
    expect(en).toContain("five");
    expect(fr).toContain("cinq");
    expect(new Set([de, en, fr]).size).toBe(3);
  });

  it("jeder französische Fingername kommt in FINGERS in irgendeiner Form vor (kein leeres Wort)", () => {
    for (const f of Object.values(FINGERS)) {
      // Der Daumen liegt nur auf der Leertaste - unitHowToTypeFr(" ") deckt ihn separat ab.
      if (f.id === "daumen") continue;
      const zeichen = f.homeKey === " " ? null : f.homeKey;
      if (!zeichen) continue;
      const satz = unitHowToTypeFr(zeichen);
      expect(satz.length, `${f.id}: "${satz}"`).toBeGreaterThan(10);
    }
  });

  it("die Leertaste: der Daumen auf Französisch, keine deutsche/englische Beimischung", () => {
    const satz = unitHowToTypeFr(" ");
    expect(satz).toContain("pouce");
    expect(satz).not.toContain("Daumen");
    expect(satz).not.toContain("thumb");
  });
});
