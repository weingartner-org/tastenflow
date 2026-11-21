/**
 * ★★ WÄCHTER: Die Hilfen erklären „Freies Schreiben" (E6, 23.09.2026) -
 * Aufgabe 5 im Auftrag zu `BAUPLAN-2026-09-23-FREIES-SCHREIBEN.md` §7.
 *
 *  1. `TippenHilfe`/`.en`: ein Absatz für Kinder in der Tippchallenge-Sektion
 *     - Rücktaste nur in der Zeile, nichts wird markiert, Zeilenende per
 *     Leertaste oder (Klassen-Einstellung) Enter.
 *  2. `LehrerHilfe`/`.en`: ein Absatz für Lehrkräfte in 8b - die Wahl, das
 *     Gewicht k = 50, wann welche Art passt.
 *  3. `TastenflowZahlenHilfe` (`DreiWerteHilfe`/`DreiWerteHilfeEn`): die
 *     Formel nennt BEIDE Gewichte, 5 und 50.
 *
 * Gemessen an den echten Konstanten (`FEHLER_GEWICHT`/`FEHLER_GEWICHT_FREI`),
 * nicht an abgeschriebenen Zahlen - ändert sich das Gewicht, soll dieser
 * Wächter es merken.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TippenHilfe } from "@/components/typing/TippenHilfe";
import { LehrerHilfe } from "@/components/typing/LehrerHilfe";
import { DreiWerteHilfe } from "@/components/typing/TastenflowZahlenHilfe";
import { FEHLER_GEWICHT, FEHLER_GEWICHT_FREI } from "@/lib/typing/schreibprobeWertung";
import { BedienSpracheProvider } from "@/lib/bedienSprache";

afterEach(() => {
  cleanup();
  localStorage.removeItem("tastenflow-bedienung");
});

function stelleEnglisch() {
  localStorage.setItem("tastenflow-bedienung", "en");
}

describe(`TippenHilfe - der Absatz zu „Freies Schreiben"`, () => {
  it("deutsch: Rücktaste in der Zeile, nichts wird markiert, Leertaste bzw. Enter je Klassen-Einstellung", () => {
    render(<TippenHilfe open onClose={() => {}} stufe="erwachsen" />);
    const t = screen.getByRole("dialog").textContent ?? "";
    expect(t).toContain("Freies Schreiben");
    expect(t).toContain("Rücktaste");
    expect(t).toContain("nichts wird");
    expect(t).toContain("markiert");
    expect(t).toContain("Leertaste nach dem letzten Wort");
    expect(t).toContain("Zeilenende mit Enter");
  });

  it("englisch: backspace, nothing is marked, space bar / Finish each line with Enter", () => {
    stelleEnglisch();
    render(
      <BedienSpracheProvider>
        <TippenHilfe open onClose={() => {}} stufe="erwachsen" />
      </BedienSpracheProvider>,
    );
    const t = screen.getByRole("dialog").textContent ?? "";
    expect(t).toContain("free writing");
    expect(t).toContain("Backspace");
    expect(t).toContain("nothing is");
    expect(t).toContain("marked");
    expect(t).toContain("space bar after the last word");
    expect(t).toContain("Finish each line with Enter");
  });
});

describe(`LehrerHilfe - der Absatz zur Wahl „Streng"/„Freies Schreiben"`, () => {
  it(`deutsch: die Wahl, k = ${FEHLER_GEWICHT_FREI}, ein Fehler je Wort, letztes Wort zählt nicht, ausgebesserte nicht`, async () => {
    render(<LehrerHilfe open onClose={() => {}} />);
    const t = (await screen.findByRole("dialog")).textContent ?? "";
    expect(t).toContain("Freies Schreiben");
    expect(t).toContain("Streng");
    expect(t).toContain(String(FEHLER_GEWICHT_FREI));
    expect(t).toContain(String(FEHLER_GEWICHT));
    expect(t).toContain("je Wort höchstens ein");
    expect(t).toContain("angefangene letzte Wort zählt nicht");
    expect(t).toContain("ausgebesserte");
  });

  it(`englisch: the choice, k = ${FEHLER_GEWICHT_FREI}, one mistake per word, last word does not count, corrected ones do not`, async () => {
    stelleEnglisch();
    render(
      <BedienSpracheProvider>
        <LehrerHilfe open onClose={() => {}} />
      </BedienSpracheProvider>,
    );
    const t = (await screen.findByRole("dialog")).textContent ?? "";
    expect(t).toContain("Free writing");
    expect(t).toContain("Strict");
    expect(t).toContain(String(FEHLER_GEWICHT_FREI));
    expect(t).toContain(String(FEHLER_GEWICHT));
    expect(t).toContain("one mistake per word");
    expect(t).toContain("does not count");
  });
});

describe("TastenflowZahlenHilfe - die Formel nennt beide Gewichte", () => {
  it(`deutsch: „Streng" mit ${FEHLER_GEWICHT} und „Freies Schreiben" mit ${FEHLER_GEWICHT_FREI}`, () => {
    const { container } = render(<DreiWerteHilfe />);
    const t = container.textContent ?? "";
    expect(t).toContain(`k = ${FEHLER_GEWICHT}`);
    expect(t).toContain(`k = ${FEHLER_GEWICHT_FREI}`);
    expect(t).toContain("Streng");
    expect(t).toContain("Freies Schreiben");
  });

  it(`englisch: die feste Formel mit ${FEHLER_GEWICHT} bleibt wörtlich, dazu ${FEHLER_GEWICHT_FREI} für „Free writing"`, () => {
    stelleEnglisch();
    const { container } = render(
      <BedienSpracheProvider>
        <DreiWerteHilfe />
      </BedienSpracheProvider>,
    );
    const t = container.textContent ?? "";
    expect(t).toMatch(
      new RegExp(`Precision = characters . \\(characters . ${FEHLER_GEWICHT} . wrong keys\\)`),
    );
    expect(t).toContain(String(FEHLER_GEWICHT_FREI));
    expect(t).toContain("Strict");
    expect(t).toContain("Free writing");
  });
});
