/**
 * ★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.4, Johannes
 * Entscheidung 5): LUXEMBURG ZÄHLT WIE FRANKREICH.
 *
 * Browsersprache `fr-LU` wurde auf die Schweiz abgebildet (und die Tastatur
 * „Schweiz/Luxemburg" ohnehin) - Kinder in Luxemburg lasen „huitante". Dort
 * zählt man wie in Frankreich. Die Tastatur bleibt schweizerisch, nur
 * Zahlwörter und Wörter folgen Frankreich.
 */
import { afterEach, describe, expect, it } from "vitest";
import { bestimmeFranzVariante, erkenneFranzVarianteAusSprachen, istLuxemburg } from "../src/lib/typing/franzVariante";
import { zahlwortFr } from "../src/lib/typing/zahlwort";
import { setLayout } from "../src/lib/typing/layouts";

afterEach(() => setLayout("de"));

describe("★★ W1 Entscheidung 5: Luxemburg zählt wie Frankreich", () => {
  it("fr-LU ⇒ fr-FR (vorher fr-CH), fr-CH bleibt Schweiz", () => {
    expect(erkenneFranzVarianteAusSprachen(["fr-LU"])).toBe("fr-FR");
    expect(erkenneFranzVarianteAusSprachen(["fr-CH"])).toBe("fr-CH");
  });

  it("Tastatur Schweiz/Luxemburg + Browser in Luxemburg ⇒ fr-FR; dieselbe Tastatur in der Schweiz ⇒ fr-CH", () => {
    expect(bestimmeFranzVariante({ gespeichert: null, layout: "ch-fr", sprachen: ["fr-LU", "de-LU"] })).toBe("fr-FR");
    expect(bestimmeFranzVariante({ gespeichert: null, layout: "ch-fr", sprachen: ["lb-LU"] })).toBe("fr-FR");
    expect(bestimmeFranzVariante({ gespeichert: null, layout: "ch-fr", sprachen: ["fr-CH"] })).toBe("fr-CH");
    expect(bestimmeFranzVariante({ gespeichert: null, layout: "ch-fr", sprachen: ["fr-FR"] })).toBe("fr-CH");
    // Gemerkte Wahl und Klasse gehen weiter vor.
    expect(bestimmeFranzVariante({ gespeichert: "fr-CH", layout: "ch-fr", sprachen: ["fr-LU"] })).toBe("fr-CH");
    expect(bestimmeFranzVariante({ gespeichert: null, klassenVorgabe: "fr-CH", layout: "ch-fr", sprachen: ["fr-LU"] })).toBe("fr-CH");
  });

  it("die Wirkung: 80 heisst in Luxemburg „quatre-vingts“, in der Schweiz weiter „huitante“", () => {
    const lux = bestimmeFranzVariante({ gespeichert: null, layout: "ch-fr", sprachen: ["fr-LU"] });
    expect(zahlwortFr(80, lux)).toBe("quatre-vingts");
    expect(zahlwortFr(80, "fr-CH")).toBe("huitante");
  });

  it("istLuxemburg erkennt nur Luxemburg", () => {
    expect(istLuxemburg(["fr-LU"])).toBe(true);
    expect(istLuxemburg(["lb"])).toBe(true);
    expect(istLuxemburg(["de-CH", "fr-CH"])).toBe(false);
    expect(istLuxemburg(["fr-FR"])).toBe(false);
  });
});
