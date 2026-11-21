/**
 * ★ WÄCHTER: „SPIELEN" UND „KLASSENMATCH" TRAGEN GEZEICHNETE SINNBILDER,
 * KEINE EMOJI MEHR - UND WERDEN RUND, WENN DER PLATZ NICHT REICHT
 * (18.09.2026, Johannes: „Die Symbole auf der Übeseite für Spielen und
 * Klassenmatch passen nicht zum Rest. Die Schalter sollen klein und rund
 * werden, wenn der Platz nicht reicht.").
 *
 * ⚠️ jsdom rechnet KEIN Layout - ob die Breiten-Abfrage in `index.css`
 * (`@container standzeile (max-width: 48rem)`) an der richtigen Schwelle
 * greift, kann dieser Wächter nicht zeigen. Geprüft wird die STRUKTUR: das
 * Sinnbild statt Emoji, die Klassen, die die Abfrage braucht, und dass der
 * zugängliche Name (das Wort bzw. der Klassenmatch-Hinweis) in BEIDEN Formen
 * derselbe bleibt, weil er nie aus dem Baum verschwindet (sr-only-Technik,
 * kein `display:none`).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { StandZeile } from "../src/components/typing/StandZeile";
import { useKlassenmatchAngebot } from "@/lib/typing/klassenmatchAngebot";
import { MATCH_HINWEIS_LAEUFT } from "@/lib/typing/klassenmatch";

beforeEach(() => {
  localStorage.clear();
  useKlassenmatchAngebot.setState({ offen: false, hinweis: "" });
});
afterEach(() => {
  cleanup();
  useKlassenmatchAngebot.setState({ offen: false, hinweis: "" });
});

function zeige(opts: { spielen?: boolean; matchOffen?: boolean; matchHinweis?: string } = {}) {
  if (opts.matchOffen) {
    useKlassenmatchAngebot.setState({ offen: true, hinweis: opts.matchHinweis ?? "" });
  }
  render(
    <StandZeile
      stufeLabel="Übungsstufe"
      level={7}
      nextUnit="p"
      shiftLearned
      spielen={opts.spielen}
    />,
  );
}

describe("Spielen/Klassenmatch — Sinnbild statt Emoji", () => {
  it("★ „Spielen“ trägt ein aria-hidden svg und keinen Emoji-Text mehr", () => {
    zeige({ spielen: true });
    const knopf = screen.getByRole("button", { name: "Spielen" });
    const svg = knopf.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("focusable")).toBe("false");
    expect(knopf.textContent).not.toContain("🐧");
  });

  it("★ „Klassenmatch“ trägt ein aria-hidden svg und keinen Emoji-Text mehr", () => {
    zeige({ matchOffen: true });
    const knopf = screen.getByRole("button", { name: "Klassenmatch" });
    const svg = knopf.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("focusable")).toBe("false");
    expect(knopf.textContent).not.toContain("⚔");
  });

  it("★ der Klassenmatch-Hinweis („läuft gerade“) bekommt ebenfalls das Sinnbild statt Emoji", () => {
    zeige({ matchOffen: true, matchHinweis: MATCH_HINWEIS_LAEUFT });
    const knopf = screen.getByRole("button", { name: MATCH_HINWEIS_LAEUFT });
    expect(knopf.querySelector("svg")).not.toBeNull();
    expect(knopf.textContent).not.toContain("⚔");
  });
});

describe("Spielen/Klassenmatch — die Bauart für die runde, schmale Form", () => {
  it("★★ die Zeile trägt den Behälter-Namen für die Breiten-Abfrage", () => {
    zeige({ spielen: true, matchOffen: true });
    const zeile = [...document.querySelectorAll("div.card")].find((d) =>
      d.textContent?.startsWith("Übungsstufe"),
    );
    expect(zeile?.className).toContain("standzeile-leiste");
  });

  it("★★ beide Schalter tragen die Klassen, die index.css für Sinnbild und Wort abfragt", () => {
    zeige({ spielen: true, matchOffen: true });
    for (const name of ["Spielen", "Klassenmatch"]) {
      const knopf = screen.getByRole("button", { name });
      expect(knopf.className).toContain("standzeile-schalter");
      const sinnbild = knopf.querySelector("svg");
      expect(sinnbild?.getAttribute("class")).toContain("standzeile-schalter-sinnbild");
      const wort = knopf.querySelector("span.standzeile-schalter-wort");
      expect(wort).not.toBeNull();
      // ★ Das Wort bleibt im Baum (nie entfernt) - jsdom kann nur die
      //   ANWESENHEIT prüfen, nicht ob die Kontraktion `.sr-only`-artig
      //   greift (das ist CSS, siehe Datei-Kommentar oben).
      expect(wort?.textContent).toBe(name);
    }
  });

  it("★★★ der zugängliche Name bleibt in beiden Formen das Wort - er steckt NUR im Wort-Span, nie im Sinnbild", () => {
    zeige({ spielen: true, matchOffen: true });
    const spielenKnopf = screen.getByRole("button", { name: "Spielen" });
    const matchKnopf = screen.getByRole("button", { name: "Klassenmatch" });
    // Das Sinnbild ist dekorativ (aria-hidden) - der Name kommt ausschliesslich
    // aus dem Text des Wort-Spans, ob sichtbar oder per CSS ausgeblendet.
    expect(spielenKnopf.querySelector(".standzeile-schalter-sinnbild")?.getAttribute("aria-hidden")).toBe("true");
    expect(matchKnopf.querySelector(".standzeile-schalter-sinnbild")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("★★ der Klassenmatch-Hinweis bleibt weiterhin der zugängliche Name, auch mit dem neuen Sinnbild", () => {
    zeige({ matchOffen: true, matchHinweis: MATCH_HINWEIS_LAEUFT });
    expect(screen.getByRole("button", { name: MATCH_HINWEIS_LAEUFT })).toBeTruthy();
  });

  it("★ aria-describedby und aria-keyshortcuts bleiben am Klassenmatch-Schalter unverändert", () => {
    zeige({ matchOffen: true });
    const knopf = screen.getByRole("button", { name: "Klassenmatch" });
    expect(knopf.getAttribute("aria-keyshortcuts")).toBe("Alt+M");
    expect(knopf.getAttribute("aria-describedby")).toBeTruthy();
  });
});

describe("Spielen/Klassenmatch — die Tipps nennen den Schalter", () => {
  it("★ der Klassenmatch-Tipp beginnt mit dem Wort „Klassenmatch“ (vorher fehlte es)", () => {
    zeige({ matchOffen: true });
    const knopf = screen.getByRole("button", { name: "Klassenmatch" });
    const beschreibungId = knopf.getAttribute("aria-describedby");
    expect(beschreibungId).toBeTruthy();
    const beschreibung = document.getElementById(beschreibungId!);
    expect(beschreibung?.textContent).toMatch(/^Klassenmatch/);
  });

  it("★ der Spielen-Tipp nennt weiterhin „Spielen“ am Anfang", () => {
    zeige({ spielen: true });
    const knopf = screen.getByRole("button", { name: "Spielen" });
    const beschreibungId = knopf.getAttribute("aria-describedby");
    const beschreibung = document.getElementById(beschreibungId!);
    expect(beschreibung?.textContent).toMatch(/^Spielen/);
  });
});
