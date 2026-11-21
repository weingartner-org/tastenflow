/**
 * ★ G4-NAHT (25.10.2026, Wunsch G3a §3 an G3c): `hatTotastenEinheit` fragt die Totasten MIT dem Weg - die Eigenschaft
 * der Sprache (Kombizeichen-Tabelle), nicht die gemeinsame Liste allein.
 */
import { describe, expect, it } from "vitest";
import { folgeHatTotaste, hatTotastenEinheit } from "../src/lib/typing/corpus";
import { LERNWEGE_LISTE, lernwegDef } from "../src/lib/typing/lernweg";
import { istTotasteDerListen } from "../src/lib/typing/totasten";
import { istGeruestSprache } from "../src/lib/typing/sprachRegister";

describe("G4-NAHT: Totasten-Einheit eines Weges", () => {
  it("die Tonos-, Tilde- und Apostroph-Totasten zählen nur in ihrer Sprache", () => {
    expect(folgeHatTotaste(["α", "΄"], "el")).toBe(true);
    expect(folgeHatTotaste(["α", "΅"], "el")).toBe(true);
    expect(folgeHatTotaste(["a", "~"], "pt")).toBe(true);
    expect(folgeHatTotaste(["a", "~"], "br")).toBe(true);
    expect(folgeHatTotaste(["e", "\""], "nl")).toBe(true);
    // Gegenprobe: dieselben Einheiten auf einem alten Weg sind keine Totasten der Listen
    expect(folgeHatTotaste(["α", "΄"], "en")).toBe(false);
    expect(folgeHatTotaste(["e", "\""], "de")).toBe(false);
    expect(folgeHatTotaste(["a", "s"], "el")).toBe(false);
  });

  it("die acht alten Wege: dieselbe Antwort wie die Rechnung ohne Weg (vor G4)", () => {
    for (const w of LERNWEGE_LISTE.filter((x) => !istGeruestSprache(x))) {
      const vorher = lernwegDef(w).letterOrder.some((u) => istTotasteDerListen(u));
      expect(hatTotastenEinheit(w), w).toBe(vorher);
    }
    expect(hatTotastenEinheit("fr")).toBe(true);
    expect(hatTotastenEinheit("de")).toBe(false);
    expect(hatTotastenEinheit(undefined)).toBe(false);
  });

  it("die neun Wege: die Antwort an ihrer eigenen Folge (heute der englische Rückfall ⇒ keine Totaste)", () => {
    for (const w of LERNWEGE_LISTE.filter((x) => istGeruestSprache(x))) {
      expect(hatTotastenEinheit(w), w).toBe(folgeHatTotaste(lernwegDef(w).letterOrder, w));
    }
  });
});
