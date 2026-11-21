/**
 * ★★★ E8b Block 1b (27.09.2026): Bindestrich im Weg „fr" (`corpus.ts`,
 * `fitText`) - Vorbedingung für die Teens-Texte (Sprosse 9-24, Weg „fr").
 * Auftrag `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §6,
 * `BEFUND-2026-09-26-E8A-TEXTE-KINDER.md` §1a Punkt K10.
 *
 * `fitText` machte aus `-` bisher IMMER (auf jedem Weg) still ein Leerzeichen
 * (`STRIP_TO_SPACE`) - aus „Qu'est-ce que" wurde so das falsche „Qu'est ce
 * que", unabhängig vom Tastenstand. Für Weg „fr" ist der Bindestrich jetzt
 * „hart" wie der Apostroph: die Zeile passt erst, wenn `-` freigeschaltet ist
 * (`FR_PUNCT_ORDER`, `lernweg.ts`). Deutsch und Englisch bleiben unverändert
 * (siehe zusätzlich die fünf Golden-Tests `tastenflow-lernweg-*-unveraendert`).
 */
import { describe, it, expect } from "vitest";
import { fitText, fitsKeys } from "../src/lib/typing/corpus";
import { minTierFor } from "../src/lib/typing/tiers";

describe('E8b Block 1b: Bindestrich ist im Weg „fr" hart wie der Apostroph', () => {
  const OHNE_BINDESTRICH = new Set(["q", "u", "'", "e", "s", "t", "c"]);
  const MIT_BINDESTRICH = new Set([...OHNE_BINDESTRICH, "-"]);

  it('OHNE die Behebung ROT: Weg „fr" ohne freigeschalteten Bindestrich - die Zeile passt NICHT', () => {
    expect(fitText("Qu'est-ce que", OHNE_BINDESTRICH, "fr")).toBeNull();
  });

  it('Weg „fr" MIT freigeschaltetem Bindestrich: unverändert, der Bindestrich bleibt stehen', () => {
    expect(fitText("Qu'est-ce que", MIT_BINDESTRICH, "fr")).toBe("Qu'est-ce que");
  });

  it("de/en/kein Weg: unverändert weich - der Bindestrich wird weiterhin zu einem Leerzeichen", () => {
    for (const weg of [undefined, "de", "en"] as const) {
      expect(fitText("Qu'est-ce que", OHNE_BINDESTRICH, weg)).toBe("Qu'est ce que");
    }
  });

  it("fitsKeys spiegelt dieselbe Regel (fr hart, de/en weich)", () => {
    expect(fitsKeys("Qu'est-ce que", OHNE_BINDESTRICH, "fr")).toBe(false);
    expect(fitsKeys("Qu'est-ce que", OHNE_BINDESTRICH, "de")).toBe(true);
  });

  it('minTierFor: ein Bindestrich verlangt im Weg „fr" Tier 4 (Satzzeichen) - im Weg „de" nur die Buchstaben-Tiers', () => {
    // „as-tu" - a/s/t/u liegen im Weg „fr" alle bis Sprosse 16 (Tier 1),
    // im Weg „de" braucht „u" Tier 2 (DE_T2_LETTER_END). Der Bindestrich
    // selbst zählt nur im Weg „fr" mit (Block 1b) - dort erst ab Tier 4
    // (FR_PUNCT_ORDER liegt hinter dem ganzen Alphabet).
    expect(minTierFor("as-tu", "fr")).toBe(4);
    expect(minTierFor("as-tu", "de")).toBe(2);
  });
});
