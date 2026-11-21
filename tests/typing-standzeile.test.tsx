/**
 * Die Stand-Zeile unter dem Übungsfeld (Johannes 25.08.2026).
 *
 * ★ 09.09.2026: Das Ausblenden beim Tippen ist GESTRICHEN (Johannes: „lass
 * die Leiste immer an, dann springt kein Fokus"). Die Tests dazu sind mit
 * der Funktion gegangen; geblieben sind Inhalt und Ordnung der Zeile - und
 * ein Wächter, der festhält, dass sie beim Tippen NICHT mehr blass wird.
 */
import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { notePracticeActivity, resetPracticeClock } from "../src/lib/typing";
import { StandZeile } from "../src/components/typing/StandZeile";

beforeEach(() => {
  localStorage.clear();
  resetPracticeClock();
});
afterEach(cleanup);

/** Die Zeile selbst (die Karte, in der „Übungsstufe" steht). */
function zeile(): HTMLElement {
  const treffer = [...document.querySelectorAll("div.card")].find((d) =>
    d.textContent?.startsWith("Übungsstufe"),
  );
  if (!treffer) throw new Error("Stand-Zeile nicht gefunden");
  return treffer as HTMLElement;
}

function zeige(spielen = false, mitZiel = false) {
  render(
    <StandZeile
      stufeLabel="Übungsstufe"
      level={7}
      nextUnit="p"
      shiftLearned
      spielen={spielen}
      goalSlot={
        mitZiel ? <span data-pruef="ziel">Wochenziel 7</span> : undefined
      }
    />,
  );
}

describe("Stand-Zeile — was drinsteht", () => {
  it("Stufe und nächste Taste stehen da", () => {
    zeige();
    expect(screen.getByText("Übungsstufe")).toBeTruthy();
    expect(screen.getByText("7")).toBeTruthy();
    // Auf der Braillezeile der ausgeschriebene Name, nicht das nackte Zeichen.
    expect(screen.getByText(/Nächste Taste: /)).toBeTruthy();
  });

  it('„20 von 24 sitzen" steht NICHT mehr da (das ist Sache der Statistik)', () => {
    zeige();
    expect(zeile().textContent).not.toMatch(/von \d+ sitzen/);
  });

  it("der Spiel-Einstieg erscheint nur, wenn er verlangt wird", () => {
    zeige(false);
    expect(screen.queryByRole("button", { name: /Spielen/ })).toBeNull();
    cleanup();
    zeige(true);
    expect(screen.getByRole("button", { name: /Spielen/ })).toBeTruthy();
  });
});

describe("Stand-Zeile — sie steht immer (09.09.2026)", () => {
  it("★★ wird beim Tippen NICHT blass und bleibt ohne aria-hidden", async () => {
    zeige();
    notePracticeActivity();
    // Länger als der frühere 300-ms-Takt des Ausblendens.
    await new Promise((r) => setTimeout(r, 500));
    expect(zeile().className).not.toContain("opacity-0");
    expect(zeile().className).not.toContain("transition-opacity");
    expect(zeile().getAttribute("aria-hidden")).toBeNull();
    expect(screen.getByText("Übungsstufe")).toBeTruthy();
  });
});

/* ══════════════════════════════════════════════════════════════════════════
   DIE ORDNUNG DER ZEILE - jede Angabe ihr eigener Platz
   ══════════════════════════════════════════════════════════════════════════
   Johannes 30.08.2026: „Übezeit und Wochenziel sind sehr nahe nebeneinander -
   wenn es Wochenziele gibt, einfach vierspaltig, wenn keines, dreispaltig."

   Das revidiert die Fassung vom 25.08. („immer drei Plätze, die Mitte
   wächst"): Übezeit und Wochenziel standen dort als EINE Gruppe mit
   Trennpunkt - gedacht als Zusammenhang, gelesen als Gedränge. Jetzt ist
   jede Angabe ihr eigener Platz: DREI ohne Ziel, VIER mit, und der
   Spiel-Einstieg (Kinderstufe) kommt jeweils dahinter.

   ⚠️ Geprüft wird die STRUKTUR, nicht die Optik: jsdom rechnet kein Layout,
   `justify-between` bewegt dort nichts. */
describe("Stand-Zeile — drei Plätze ohne Wochenziel, vier mit", () => {
  it("★★★ verteilt sich in beiden Fällen, statt bei Wochenziel links zu kleben", () => {
    zeige(false, true);
    // `justify-between` hängt NICHT mehr am Inhalt.
    expect(zeile().className).toContain("justify-between");
    cleanup();
    zeige(false, false);
    expect(zeile().className).toContain("justify-between");
  });

  it("★★★ mit Wochenziel VIER Plätze - das Ziel ist ein eigener Platz", () => {
    zeige(false, true);
    const plaetze = [...zeile().children];
    expect(plaetze).toHaveLength(4);
    expect(plaetze[0].textContent).toContain("Übungsstufe");
    expect(plaetze[3].textContent).toContain("Nächste Taste");
    // ★ Der Kern (Johannes 30.08.2026): Das Ziel klebt nicht mehr an der
    // Übezeit - es steht als eigener Platz zwischen Übezeit und nächster
    // Taste, und `justify-between` verteilt alle vier gleichmäßig.
    expect(plaetze[2].querySelector("[data-pruef='ziel']")).not.toBeNull();
    expect(plaetze[1].textContent).not.toContain("Wochenziel");
  });

  it("★★ ohne Wochenziel dieselben drei Plätze - die Stufe steht immer links", () => {
    zeige(false, false);
    const plaetze = [...zeile().children];
    expect(plaetze).toHaveLength(3);
    expect(plaetze[0].textContent).toContain("Übungsstufe");
    expect(plaetze[1].querySelector("[data-pruef='ziel']")).toBeNull();
    expect(plaetze[2].textContent).toContain("Nächste Taste");
  });

  it("★ der Spiel-Einstieg ist der letzte Platz, ganz rechts", () => {
    zeige(true, true);
    const plaetze = [...zeile().children];
    expect(plaetze).toHaveLength(5);
    expect(plaetze[4].textContent).toContain("Spielen");
    // ⚠️ Kein `ml-auto` mehr: Das schob den Knopf früher im gedrängten Satz an
    // den Rand. Mit `justify-between` täte es dasselbe zweimal - und drückte
    // die nächste Taste unnötig nach links.
    expect(plaetze[4].className).not.toContain("ml-auto");
  });

  it("★★ die Reihenfolge im Dokument bleibt, was sie war (Braillezeile)", () => {
    zeige(false, true);
    const text = zeile().textContent ?? "";
    expect(text.indexOf("Übungsstufe")).toBeLessThan(text.indexOf("Wochenziel"));
    expect(text.indexOf("Wochenziel")).toBeLessThan(text.indexOf("Nächste Taste"));
  });
});
