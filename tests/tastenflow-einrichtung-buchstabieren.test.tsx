/**
 * Tastenflow - die Einrichtung fragt nach der Sprachausgabe des Screenreaders
 * (Meldung wwzafyorujqubft, 13.11.2026).
 *
 * Eine Lehrerin aus der Schweiz arbeitet nur mit JAWS, die Stimme des
 * Programms ist aus. Hörbar wird das Tippen dann nur mit „Buchstabieren" an -
 * und das ist unter Windows von Haus aus AUS (wegen der Braillezeile). Wer nur
 * mit der Sprache des Screenreaders arbeitet, hört beim Tippen fast nichts.
 *
 * Entscheidung Johannes: Die Einrichtung fragt danach. „Ja" schaltet
 * „Buchstabieren" an, „Nein" lässt es aus.
 *
 * Zusicherungen:
 *  1. Im Schritt „Ton und Vorlesen" steht die Frage als Gruppe mit zwei
 *     Schaltern „Ja" / „Nein" (aria-pressed, nichts disabled).
 *  2. „Ja" setzt dieselbe Einstellung wie der Schalter im Zahnrad
 *     (`tastenAnsage = "naechste"`), „Nein" setzt sie auf „aus".
 *  3. Der Fokus bleibt auf dem gedrückten Schalter (kein Fokusverlust).
 *  4. Die Frage gibt es in jeder Sprache der Einrichtung, übersetzt.
 */
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { einrichtungZuruecksetzen } from "../src/lib/typing/einrichtung";
import { Einrichtung, T } from "../src/components/typing/Einrichtung";
import { setLayout, setSoundMuted } from "../src/lib/typing";
import { useTypingA11y } from "../src/lib/typing/a11y";

afterEach(cleanup);

function zumTonSchritt() {
  render(
    <Einrichtung
      stufe="teens"
      lang="de"
      onLangChange={vi.fn()}
      langLocked
      lernweg="de"
      onExit={vi.fn()}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Los geht's" })); // alter
  fireEvent.click(screen.getByRole("button", { name: "Weiter" })); // tastatur
  fireEvent.click(screen.getByRole("button", { name: "Weiter" })); // ton
  expect(screen.getByRole("heading", { name: "Ton und Vorlesen" })).toBeTruthy();
}

describe("Einrichtung - Frage nach der Sprachausgabe des Screenreaders", () => {
  beforeEach(() => {
    einrichtungZuruecksetzen();
    setSoundMuted(false);
    setLayout("de");
    // Vorgabe unter Windows: Buchstabieren aus.
    useTypingA11y.getState().setTastenAnsage("aus");
  });

  it("die Frage steht im Ton-Schritt, mit Ja und Nein", () => {
    zumTonSchritt();
    const gruppe = screen.getByRole("group", {
      name: /Hörst du beim Tippen die Sprachausgabe deines Screenreaders/,
    });
    const ja = within(gruppe).getByRole("button", { name: /^Ja/ });
    const nein = within(gruppe).getByRole("button", { name: /^Nein/ });
    expect(ja.getAttribute("aria-pressed")).toBe("false");
    expect(nein.getAttribute("aria-pressed")).toBe("true");
    expect(ja.hasAttribute("disabled")).toBe(false);
    expect(nein.hasAttribute("disabled")).toBe(false);
  });

  it("„Ja\" schaltet Buchstabieren an, „Nein\" wieder aus - der Fokus bleibt", () => {
    zumTonSchritt();
    const gruppe = screen.getByRole("group", {
      name: /Hörst du beim Tippen die Sprachausgabe deines Screenreaders/,
    });
    const ja = within(gruppe).getByRole("button", { name: /^Ja/ });
    ja.focus();
    fireEvent.click(ja);
    expect(useTypingA11y.getState().tastenAnsage).toBe("naechste");
    expect(ja.getAttribute("aria-pressed")).toBe("true");
    expect(document.activeElement).toBe(ja);

    const nein = within(gruppe).getByRole("button", { name: /^Nein/ });
    nein.focus();
    fireEvent.click(nein);
    expect(useTypingA11y.getState().tastenAnsage).toBe("aus");
    expect(nein.getAttribute("aria-pressed")).toBe("true");
    expect(document.activeElement).toBe(nein);
  });

  it("die Frage gibt es in jeder Sprache der Einrichtung, übersetzt", () => {
    const sprachen = Object.keys(T) as (keyof typeof T)[];
    expect(sprachen.length).toBeGreaterThanOrEqual(17);
    const de = T.de.screenreaderFrage;
    for (const s of sprachen) {
      const f = T[s].screenreaderFrage;
      expect(f, s).toBeTruthy();
      if (s !== "de") expect(f, s).not.toBe(de);
      expect(T[s].ja, s).toBeTruthy();
      expect(T[s].nein, s).toBeTruthy();
      // Schreibregel: nur Bindestrich, nie Gedankenstrich.
      expect(`${f} ${T[s].screenreaderErklaerung}`, s).not.toMatch(/[–—]/);
    }
  });
});
