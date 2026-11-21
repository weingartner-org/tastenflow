/**
 * Die drei Erklär-Fenster (Auftrag Johannes 31.08.2026, „Wochenziel" seit
 * 19.09.2026 - W4, vorher kurz „Tagesziel", siehe `merkfenster.ts`).
 *
 * Geprüft wird hier die REGEL, nicht das Aussehen: wann ein Fenster kommt, wann
 * es wiederkommt und wann es schweigt. Das Aussehen und die Fokus-Führung
 * gehören in den Prüfstand - dort sieht ein echter Browser zu.
 *
 * ★ Warum die Merker eigene Tests bekommen: Ihre Lebensdauern sind
 * VERSCHIEDEN, und genau das verwechselt man beim Weiterbauen.
 *   umschalt        - immer wieder, bis der Haken gesetzt ist
 *   grossschreibung - genau einmal, für immer
 *   wochenziel      - einmal je ZIEL-WOCHE, ohne Haken
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  grossschreibungGesehen,
  merkeGrossschreibungGesehen,
  merkeWochenzielFenster,
  setzeMerkfensterZurueck,
  setzeUmschaltFensterAus,
  wochenzielFensterGezeigt,
  zeigeUmschaltFenster,
} from "@/lib/typing/merkfenster";
import {
  eigeneUebungAnkuendigung,
  grossschreibungFenster,
  umschaltFenster,
  wochenzielFenster,
} from "@/lib/typing/merkfensterTexte";

beforeEach(() => setzeMerkfensterZurueck());

describe("Merker: drei Fenster, drei Lebensdauern", () => {
  it("Umschalt: kommt immer wieder, bis der Haken gesetzt ist", () => {
    expect(zeigeUmschaltFenster()).toBe(true);
    expect(zeigeUmschaltFenster()).toBe(true); // auch beim zehnten Mal
    setzeUmschaltFensterAus(true);
    expect(zeigeUmschaltFenster()).toBe(false);
  });

  it("Grossschreibung: genau einmal", () => {
    expect(grossschreibungGesehen()).toBe(false);
    merkeGrossschreibungGesehen();
    expect(grossschreibungGesehen()).toBe(true);
  });

  it("Wochenziel: einmal je Ziel-Woche - nächste Woche wieder", () => {
    const dieseWoche = "2026-W36";
    const naechsteWoche = "2026-W37";
    expect(wochenzielFensterGezeigt(dieseWoche)).toBe(false);
    merkeWochenzielFenster(dieseWoche);
    expect(wochenzielFensterGezeigt(dieseWoche)).toBe(true);
    expect(wochenzielFensterGezeigt(naechsteWoche)).toBe(false);
  });

  it("überlebt einen kaputten Speicher, ohne etwas zu verschlucken", () => {
    // Im Zweifel gilt „noch nicht gesehen" - lieber eine Erklärung zu viel.
    const echt = globalThis.localStorage;
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get() {
        throw new Error("Website-Daten gesperrt");
      },
    });
    expect(zeigeUmschaltFenster()).toBe(true);
    expect(grossschreibungGesehen()).toBe(false);
    expect(() => merkeGrossschreibungGesehen()).not.toThrow();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: echt,
    });
  });
});

describe("Der Wortlaut", () => {
  it("nennt bei der Umschalttaste die Seite UND den Finger", () => {
    const t = umschaltFenster("großes A", "links", "kind");
    const text = t.absaetze.join(" ");
    expect(t.titel).toBe("Fast!");
    expect(text).toContain("LINKE Umschalttaste");
    expect(text).toContain("kleinen Finger der linken Hand");
    expect(text).toContain("Feststelltaste");
  });

  it("duzt alle Lernenden, auch ab 16 - siezt nur die Lehrkraft (19.09.2026)", () => {
    const erwachsen = grossschreibungFenster("erwachsen").absaetze.join(" ");
    expect(erwachsen).toContain("brauchst du noch nicht");
    expect(erwachsen).toContain("tippe einfach den kleinen Buchstaben");
    // Der Erwachsenen-TON bleibt: dieselbe sachliche dritte Zeile wie per Sie.
    expect(erwachsen).toContain("kommt später als eigene Taste dazu");
    expect(grossschreibungFenster("erwachsen", "de", "Sie").absaetze.join(" ")).toContain(
      "brauchen Sie noch nicht",
    );
    // Kinder- und Jugendtexte haben keine Sie-Fassung.
    expect(grossschreibungFenster("kind", "de", "Sie").absaetze.join(" ")).toContain(
      "brauchst du noch nicht",
    );
    expect(grossschreibungFenster("kind").absaetze.join(" ")).toContain(
      "brauchst du noch nicht",
    );
    expect(grossschreibungFenster("jugend").absaetze.join(" ")).toContain(
      "brauchst du noch nicht",
    );
  });

  it("Wochenziel: gratuliert und ermuntert zum Weiterüben (W4, 19.09.2026)", () => {
    const t = wochenzielFenster("kind");
    const text = t.absaetze.join(" ");
    expect(t.titel).toBe("Wochenziel geschafft!");
    expect(text).toContain("Gratulation");
    // ★ Der Ton: eine Feier, keine Grenze - weiterüben bleibt ausdrücklich erlaubt.
    expect(text).toContain("Du kannst gern weiterüben");
    expect(text).not.toContain("musst");
  });

  it("Wochenziel: ab 16 per Du und ohne Ausrufezeichen - per Sie nur für die Lehrkraft", () => {
    const text = wochenzielFenster("erwachsen").absaetze.join(" ");
    expect(text).toContain("Gratulation, du hast dein Wochenziel erreicht.");
    expect(text).toContain("Du kannst gern weiterüben");
    expect(text).not.toMatch(/erreicht!/);
    const sie = wochenzielFenster("erwachsen", "de", "Sie").absaetze.join(" ");
    expect(sie).toContain("Sie haben Ihr Wochenziel");
    expect(sie).toContain("Sie können gern weiterüben");
  });

  it("Eigene Übung (E6): EIN Satz, ohne Haken - per Du, auch ab 16", () => {
    const kind = eigeneUebungAnkuendigung("kind");
    expect(kind.titel).toBe("Weiter geht es mit einer Übung von deiner Lehrkraft.");
    expect(kind.absaetze).toEqual([]);
    expect(eigeneUebungAnkuendigung("jugend").titel).toBe(
      "Weiter geht es mit einer Übung von deiner Lehrkraft.",
    );
    expect(eigeneUebungAnkuendigung("erwachsen").titel).toBe(
      "Weiter geht es mit einer Übung von deiner Lehrkraft.",
    );
    expect(eigeneUebungAnkuendigung("erwachsen", "de", "Sie").titel).toBe(
      "Weiter geht es mit einer Übung von Ihrer Lehrkraft.",
    );
  });
});
