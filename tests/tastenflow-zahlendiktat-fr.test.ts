/**
 * ★★★ WÄCHTER: ZAHLENDIKTAT AUF WEG „fr" NUTZT `zahlwortFr` MIT DER
 * LANDESVARIANTE DES KINDES (E10a, 25.09.2026, Bauplan §8.1 Punkt 1: „hier
 * liegt der schönste Landesbezug des ganzen Lehrgangs").
 *
 * Der Zufall ist so eingestellt, dass die erste gezogene Zahl immer 70 ist
 * (`ZUFALL_70`) - eine Zahl, die sich zwischen den vier Landesvarianten
 * unterscheidet (soixante-dix / septante). So lässt sich ohne Kenntnis des
 * internen Ziehungsalgorithmus nachweisen, dass die richtige Variante
 * ankommt, nicht nur irgendeine.
 */
import { describe, expect, it } from "vitest";
import { zahlendiktat } from "@/lib/typing/uebungsformen/zahlendiktat";
import type { FormKontext } from "@/lib/typing/uebungsformen/typen";
import type { FranzVariante } from "@/lib/typing/franzVariante";

/** Zieht deterministisch n = 70 beim ersten Versuch (VON=10, BIS=99, 90 Werte). */
function zufall70(): () => number {
  let erster = true;
  return () => {
    if (erster) {
      erster = false;
      return 60.5 / 90; // floor(60.5) = 60 -> n = 10 + 60 = 70
    }
    return 0; // danach beliebig - der Wert 70 ist schon "gehabt"
  };
}

function ctxFr(overrides: Partial<FormKontext> = {}): FormKontext {
  return {
    lernweg: "fr",
    introduced: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    shift: false,
    oneHand: false,
    stufe: "teens",
    lang: "fr",
    count: 1,
    zufall: zufall70(),
    ...overrides,
  };
}

const WORT_70: Record<FranzVariante, string> = {
  "fr-FR": "soixante-dix",
  "fr-CA": "soixante-dix",
  "fr-BE": "septante",
  "fr-CH": "septante",
};

describe("★ zahlendiktat auf Weg fr: zahlwortFr mit der Variante des Kindes", () => {
  it.each(Object.entries(WORT_70) as [FranzVariante, string][])(
    "franzVariante %s: die Aufgabe nennt %s, nicht die Fassung einer anderen Variante",
    (variante, wort) => {
      const ctx = ctxFr({ franzVariante: variante });
      expect(zahlendiktat.taugt(ctx)).toBe(true);
      const aufgaben = zahlendiktat.fragen!(ctx);
      expect(aufgaben.length, JSON.stringify(aufgaben)).toBeGreaterThan(0);
      expect(aufgaben[0].frage).toContain(wort);
      // Keine der drei ANDEREN Fassungen darf mit auftauchen.
      for (const andere of new Set(Object.values(WORT_70))) {
        if (andere === wort) continue;
        expect(aufgaben[0].frage).not.toContain(andere);
      }
    },
  );

  it('ohne gesetzte franzVariante gilt "fr-FR" (dieselbe Vorgabe wie bei ctx.variante/Englisch)', () => {
    const ctx = ctxFr(); // kein franzVariante gesetzt
    const aufgaben = zahlendiktat.fragen!(ctx);
    expect(aufgaben[0].frage).toContain("soixante-dix");
  });

  it('Weg "fr" bleibt bei zahlwort(n, "de"/"en") unberührt - kein stiller Rückfall auf Deutsch', () => {
    // Golden-Stichprobe: 70 auf Deutsch und Englisch bleibt, wie es war.
    const ctxDe = ctxFr({ lernweg: "de", lang: "de", franzVariante: undefined });
    const ctxEn = ctxFr({ lernweg: "en", lang: "en", franzVariante: undefined });
    expect(zahlendiktat.fragen!(ctxDe)[0].frage).toContain("siebzig");
    expect(zahlendiktat.fragen!(ctxEn)[0].frage).toContain("seventy");
  });
});
