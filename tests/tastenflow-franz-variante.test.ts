/**
 * ★★★ E2b (25.09.2026, Bauplan §10.1, Auftrag Punkt 4): DIE FRANZÖSISCHE
 * LANDESVARIANTE - Typ, Erkennung, Speicher. Verallgemeinert das Muster von
 * `tests/tastenflow-schreibweise*.test.ts` (britisch/amerikanisch) auf vier
 * Werte. Noch OHNE Wirkung auf Texte (E9/E10) oder Lehrkraft-Oberfläche (E12) -
 * dieser Wächter prüft nur, dass Typ, Erkennung und Speicher schon stehen.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  bestimmeFranzVariante,
  erkenneFranzVarianteAusLayout,
  erkenneFranzVarianteAusSprachen,
  franzVariante,
  franzVarianteMerken,
  gespeicherteFranzVariante,
  istFranzVariante,
  FRANZ_VARIANTE_SCHLUESSEL,
  type FranzVariante,
} from "../src/lib/typing/franzVariante";
import { setLayout } from "../src/lib/typing/layouts";

function browserMit(sprachen: string[]) {
  vi.spyOn(navigator, "languages", "get").mockReturnValue(sprachen);
}

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  window.history.replaceState(null, "", "/");
  setLayout("de");
});

describe("istFranzVariante", () => {
  it.each(["fr-FR", "fr-BE", "fr-CH", "fr-CA"] as const)("%s ist gültig", (v) => {
    expect(istFranzVariante(v)).toBe(true);
  });
  it.each(["fr", "fr-LU", "de", "", null, undefined, 5])("%s ist ungültig", (v) => {
    expect(istFranzVariante(v)).toBe(false);
  });
});

describe("erkenneFranzVarianteAusSprachen (§10.1: gespeicherte Wahl > Klasse > Browser)", () => {
  it.each([
    [["fr-BE"], "fr-BE"],
    [["fr-CH"], "fr-CH"],
    // ★ W1 (27.09.2026, Entscheidung 5): Luxemburg zählt wie Frankreich - vorher „fr-CH".
    [["fr-LU"], "fr-FR"],
    [["fr-CA"], "fr-CA"],
    [["fr-FR"], "fr-FR"],
    [["fr"], "fr-FR"],
    [["de"], "fr-FR"],
    [[], "fr-FR"],
    [["tr", "fr-BE"], "fr-BE"],
  ] as const)("%j ergibt %s", (liste, erwartet) => {
    expect(erkenneFranzVarianteAusSprachen(liste)).toBe(erwartet);
  });

  it("die erste FRANZÖSISCHE Sprache der Liste entscheidet, nicht die erste überhaupt", () => {
    expect(erkenneFranzVarianteAusSprachen(["de", "fr-CA"])).toBe("fr-CA");
  });
});

describe("bestimmeFranzVariante: gespeichert > Klasse > Tastatur (E10d) > Browser", () => {
  it("gespeichert gewinnt über Klasse und Browser", () => {
    expect(
      bestimmeFranzVariante({ gespeichert: "fr-CA", klassenVorgabe: "fr-BE", sprachen: ["fr-CH"] }),
    ).toBe("fr-CA");
  });

  it("Klasse gewinnt über den Browser", () => {
    expect(
      bestimmeFranzVariante({ gespeichert: null, klassenVorgabe: "fr-BE", sprachen: ["fr-CH"] }),
    ).toBe("fr-BE");
  });

  it("ohne beides: der Browser", () => {
    expect(bestimmeFranzVariante({ gespeichert: null, sprachen: ["fr-CA"] })).toBe("fr-CA");
  });

  it("die Tastatur gewinnt über den Browser, wenn weder gespeichert noch Klasse feststehen", () => {
    expect(
      bestimmeFranzVariante({ gespeichert: null, layout: "ca-csa", sprachen: ["fr-BE"] }),
    ).toBe("fr-CA");
  });

  it("Klasse gewinnt über die Tastatur", () => {
    expect(
      bestimmeFranzVariante({
        gespeichert: null,
        klassenVorgabe: "fr-BE",
        layout: "ca-fr",
        sprachen: ["fr-CH"],
      }),
    ).toBe("fr-BE");
  });

  it("gespeichert gewinnt über die Tastatur", () => {
    expect(
      bestimmeFranzVariante({ gespeichert: "fr-FR", layout: "ch-fr", sprachen: ["fr-CA"] }),
    ).toBe("fr-FR");
  });

  it("eine nicht-französische oder AZERTY-FR-Tastatur ist kein Hinweis - der Browser entscheidet weiter", () => {
    expect(bestimmeFranzVariante({ gespeichert: null, layout: "de", sprachen: ["fr-CH"] })).toBe(
      "fr-CH",
    );
    expect(bestimmeFranzVariante({ gespeichert: null, layout: "fr", sprachen: ["fr-BE"] })).toBe(
      "fr-BE",
    );
  });
});

describe("erkenneFranzVarianteAusLayout (E10d, Bauplan §3/§10.1)", () => {
  it.each([
    ["ca-csa", "fr-CA"],
    ["ca-fr", "fr-CA"],
    ["ch-fr", "fr-CH"],
    ["be", "fr-BE"],
  ] as const)("Tastatur %s ⇒ %s", (layout, erwartet) => {
    expect(erkenneFranzVarianteAusLayout(layout)).toBe(erwartet);
  });

  it.each(["fr", "de", "ch", "us", "uk", null, undefined] as const)(
    "%s ist KEIN Hinweis (null)",
    (layout) => {
      expect(erkenneFranzVarianteAusLayout(layout)).toBeNull();
    },
  );
});

describe("Speicher: wie schreibweise.ts es für gb/us tut", () => {
  it("ohne gemerkte Wahl: null", () => {
    expect(gespeicherteFranzVariante()).toBeNull();
  });

  it.each(["fr-FR", "fr-BE", "fr-CH", "fr-CA"] as const)("merkt und liest %s", (v) => {
    franzVarianteMerken(v);
    expect(gespeicherteFranzVariante()).toBe(v);
    expect(localStorage.getItem(FRANZ_VARIANTE_SCHLUESSEL)).toBe(v);
  });

  it("ein ungültiger Wert im Speicher zählt nicht", () => {
    localStorage.setItem(FRANZ_VARIANTE_SCHLUESSEL, "fr-LU");
    expect(gespeicherteFranzVariante()).toBeNull();
  });

  it("gesperrter Speicher: kein Absturz", () => {
    const speicher = window.localStorage;
    const echt = { g: speicher.getItem, s: speicher.setItem };
    const wirft = () => {
      throw new DOMException("gesperrt", "SecurityError");
    };
    speicher.getItem = wirft;
    speicher.setItem = wirft;
    try {
      expect(() => franzVarianteMerken("fr-BE" as FranzVariante)).not.toThrow();
      expect(gespeicherteFranzVariante()).toBeNull();
    } finally {
      speicher.getItem = echt.g;
      speicher.setItem = echt.s;
    }
  });
});

describe("franzVariante(): dasselbe Tor wie englischVariante() - ohne den Probe-Schalter immer fr-FR", () => {
  it("ohne den Schalter (Vorgabe): fr-FR, egal was gespeichert oder im Browser steht", () => {
    franzVarianteMerken("fr-CA");
    browserMit(["fr-BE"]);
    window.history.replaceState(null, "", "/?franzoesisch-lehrgang=0");
    expect(franzVariante()).toBe("fr-FR");
  });

  it("mit dem Schalter: liest gespeicherte Wahl, Klasse, Browser wie bestimmtFranzVariante", () => {
    window.history.replaceState(null, "", "/?franzoesisch-lehrgang=1");
    browserMit(["fr-CH"]);
    expect(franzVariante()).toBe("fr-CH");
    franzVarianteMerken("fr-CA");
    expect(franzVariante()).toBe("fr-CA");
  });

  it("mit dem Schalter: die gewählte Tastatur des Geräts wirkt wie in bestimmeFranzVariante (E10d)", () => {
    window.history.replaceState(null, "", "/?franzoesisch-lehrgang=1");
    browserMit(["fr-BE"]);
    setLayout("ch-fr");
    expect(franzVariante()).toBe("fr-CH");
  });
});
