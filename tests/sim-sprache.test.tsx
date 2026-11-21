/**
 * Wächter 1c (Bauplan 2026-11-06): Die Sprache der öffentlichen Seiten steht hinter
 * `?sprachen-sims=1`. Ohne Schalter: Deutsch, kein Sprachwähler, kein eigenes `lang`,
 * auch bei englischem Browser.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { anfangsSpracheAus } from "@/lib/appSprache";
import {
  SimSpracheProvider,
  SimSprachWaehler,
  anfangsSimSprache,
  ausBrowserSprache,
  simsSprachenAn,
  useSimSprache,
  SIMS_SPRACHEN,
} from "@/lib/simSprache";

function Zeige() {
  return <p data-testid="sprache">{useSimSprache()}</p>;
}

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, "", "/erleben");
});

describe("Sprache der Sims", () => {
  it("Not-Aus (=0): Deutsch, kein Wähler, kein lang - auch mit englischem Browser", () => {
    window.history.replaceState(null, "", "/erleben?sprachen-sims=0");
    const { container } = render(
      <SimSpracheProvider>
        <SimSprachWaehler />
        <Zeige />
      </SimSpracheProvider>,
    );
    expect(screen.getByTestId("sprache").textContent).toBe("de");
    expect(screen.queryByRole("combobox")).toBeNull();
    expect(container.querySelector("[lang]")).toBeNull();
  });

  it("?sprache=fr wirkt mit Not-Aus nicht", () => {
    window.history.replaceState(null, "", "/erleben?sprachen-sims=0&sprache=fr");
    render(<SimSpracheProvider><Zeige /></SimSpracheProvider>);
    expect(screen.getByTestId("sprache").textContent).toBe("de");
  });

  it("mit Schalter: ?sprache=br wählt pt-BR, mit Wähler und lang", () => {
    window.history.replaceState(null, "", "/erleben?sprachen-sims=1&sprache=br");
    const { container } = render(
      <SimSpracheProvider>
        <SimSprachWaehler />
        <Zeige />
      </SimSpracheProvider>,
    );
    expect(screen.getByTestId("sprache").textContent).toBe("br");
    // Nur ein Sinnbild (Weltkugel + Kürzel), Johannes 10.11.2026; die Liste klappt auf.
    const knopf = screen.getByRole("button", { name: /Idioma/ });
    expect(knopf).toHaveAttribute("aria-haspopup", "listbox");
    expect(container.querySelector('[lang="pt-BR"]')).not.toBeNull();
    fireEvent.click(knopf);
    expect(screen.getAllByRole("option")).toHaveLength(17);
    fireEvent.click(screen.getAllByRole("option").find((o) => /Français/.test(o.textContent ?? ""))!);
    expect(screen.getByTestId("sprache").textContent).toBe("fr");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("der Schalter merkt sich =1 und geht mit =0 wieder aus", () => {
    expect(simsSprachenAn("")).toBe(true); // Vorgabe seit 10.11.2026: AN
    expect(simsSprachenAn("?sprachen-sims=1")).toBe(true);
    expect(simsSprachenAn("")).toBe(true);
    expect(simsSprachenAn("?sprachen-sims=0")).toBe(false);
    expect(simsSprachenAn("")).toBe(false);
  });

  it("Reihenfolge: Adresse, gemerkt, Browser, Englisch", () => {
    expect(anfangsSimSprache({ suche: "?sprache=sv", gemerkt: "fr", browser: ["en"] })).toBe("sv");
    expect(anfangsSimSprache({ suche: "", gemerkt: "fr", browser: ["en"] })).toBe("fr");
    expect(anfangsSimSprache({ suche: "", gemerkt: null, browser: ["ja", "pt-BR"] })).toBe("br");
    expect(anfangsSimSprache({ suche: "", gemerkt: null, browser: ["ja"] })).toBe("en"); // im Zweifel Englisch (10.11.2026)
    expect(anfangsSimSprache({ suche: "", gemerkt: null, browser: [] })).toBe("en");
  });

  it("hat die App kein Englisch (Punktgenau), bleibt der Rückfall Deutsch", () => {
    expect(anfangsSpracheAus({ suche: "", gemerkt: null, browser: ["ja"] }, ["de", "fr"])).toBe("de");
    expect(anfangsSpracheAus({ suche: "", gemerkt: null, browser: ["en-US"] }, ["de", "fr"])).toBe("de");
  });

  it("Browser-Sprachen: pt-BR ist br, pt-PT ist pt, uk ist uk", () => {
    expect(ausBrowserSprache("pt-BR")).toBe("br");
    expect(ausBrowserSprache("pt-PT")).toBe("pt");
    expect(ausBrowserSprache("uk-UA")).toBe("uk");
    expect(ausBrowserSprache("en-US")).toBe("en");
    expect(ausBrowserSprache("ja")).toBeNull();
  });

  it("kennt alle 17 Sprachen von Tastenflow", () => {
    expect(SIMS_SPRACHEN).toHaveLength(17);
  });
});
