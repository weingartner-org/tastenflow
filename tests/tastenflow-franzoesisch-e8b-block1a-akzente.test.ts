/**
 * ★★★ E8b Block 1a (27.09.2026): grosse Akzentbuchstaben in `fitText`
 * (`corpus.ts`, `LETTER_RE`) - Vorbedingung für die Teens-Texte (Sprosse
 * 9-24, Weg „fr"). Auftrag `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md`
 * §6, offener Befund `BEFUND-2026-09-26-E8A-TEXTE-KINDER.md` §6.
 *
 * `LETTER_RE` kannte bisher nur die deutschen Umlaute (ä ö ü ß). Ein GROSSER
 * französischer Akzentbuchstabe (É È À Ç Ù …) fiel deshalb NIE in den
 * Buchstaben-Zweig von `fitText` und scheiterte, selbst wenn sein
 * Kleinbuchstabe längst frei war - „École" am Satzanfang war an KEINER
 * Sprosse tippbar. Jeder Test hier wäre ohne die Erweiterung ROT.
 */
import { describe, it, expect, afterEach } from "vitest";
import { fitText } from "../src/lib/typing/corpus";
import { setLayout } from "../src/lib/typing/layouts";

afterEach(() => setLayout("de"));

describe("E8b Block 1a: grosse Akzentbuchstaben gelten als Grossform des kleinen", () => {
  it("Gegenprobe: der KLEINE Akzentbuchstabe war schon vorher tippbar - bleibt unverändert", () => {
    setLayout("de"); // ersatz={} - kein Layout-Einfluss auf dieses Zeichen
    expect(fitText("é", new Set(["é"]))).toBe("é");
    expect(fitText("é", new Set())).toBeNull();
  });

  it("OHNE die Erweiterung ROT: grosses É ist frei, sobald é frei ist - nicht vorher", () => {
    setLayout("de");
    expect(fitText("É", new Set(["é"]))).toBe("É");
    // „e" allein reicht NICHT - É ist die Grossform von é, nicht von e.
    expect(fitText("É", new Set(["e"]))).toBeNull();
    expect(fitText("É", new Set())).toBeNull();
  });

  it("gilt für jeden betroffenen Akzentbuchstaben (è à ç ù), nicht nur é", () => {
    setLayout("de");
    for (const klein of ["è", "à", "ç", "ù"] as const) {
      const gross = klein.toUpperCase();
      expect(fitText(gross, new Set([klein])), `${gross}/${klein}`).toBe(gross);
      expect(fitText(gross, new Set()), `${gross} ohne ${klein}`).toBeNull();
    }
  });

  it("★ W1: Windows-AZERTY Frankreich hat kein É - die Zeile kommt nicht vor (kein Ersatz „Ecole“ mehr); Belgien hat É über die Akut-Totaste", () => {
    // ★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.8, Johannes):
    // „Was die Tastatur nicht kann, weder ersetzen noch üben" - bis W1 wurde
    // „École" auf fr und be zu „Ecole" (falsches Französisch, Anhang C).
    setLayout("fr");
    expect(fitText("École", new Set(["é", "e", "c", "o", "l"]))).toBeNull();
    // Belgien: É = Akut-Totaste (AltGr + ù), dann Umschalt + E - ohne Weg
    // bleibt es beim Grossbuchstaben von „é".
    setLayout("be");
    expect(fitText("École", new Set(["é", "e", "c", "o", "l"]))).toBe("École");
    expect(fitText("École", new Set(["e"]))).toBeNull();
  });

  it("Schweiz-Französisch/Kanada CSA: É bleibt eine ECHTE Taste - jetzt frei, sobald é frei ist", () => {
    for (const id of ["ch-fr", "ca-csa"] as const) {
      setLayout(id);
      // Auf diesen beiden Tastaturen ersetzt `toLayoutText` É NICHT (kein
      // `ersatz`-Eintrag) - genau der Fall aus dem Befund §6.
      expect(fitText("Émilie", new Set(["e", "m", "i", "l"]))).toBeNull(); // é fehlt noch
      expect(fitText("Émilie", new Set(["e", "m", "i", "l", "é"]))).toBe("Émilie");
    }
  });
});
