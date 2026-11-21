/**
 * Abzeichen-Regal + Medaillen: verdiente Abzeichen hängen als Medaillen in der
 * Vitrine, die Aufklapp-Liste zeigt ALLE Familien (Geheime bis zum Verdienen
 * nur als „???"), und jede Medaille bleibt rein dekorativ (aria-hidden) —
 * die Semantik trägt der Text.
 */
import { describe, it, expect, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BADGES, emptyProgress } from "../src/lib/typing";
import { BadgeShelf } from "../src/components/typing/BadgeShelf";

afterEach(cleanup);

function progressWithBadges(ids: string[]) {
  const p = emptyProgress();
  return { ...p, badges: Object.fromEntries(ids.map((id) => [id, 1751900000000])) };
}

describe("BadgeShelf — Medaillen-Vitrine", () => {
  it("zeigt verdiente Abzeichen als Medaillen (SVG) mit Namensschild", () => {
    render(
      <BadgeShelf progress={progressWithBadges(["tasten-kueken", "volltreffer"])} selfView />,
    );
    expect(screen.getByText("Tasten-Küken")).toBeTruthy();
    expect(screen.getByText("Volltreffer")).toBeTruthy();
    const list = screen.getByRole("list", { name: "Deine verdienten Abzeichen" });
    expect(list.querySelectorAll("svg[viewBox='0 0 64 84']").length).toBe(2);
    // Medaillen sind Deko — jede trägt aria-hidden.
    for (const svg of list.querySelectorAll("svg")) {
      expect(svg.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("listet aufgeklappt ALLE Familien — Geheime ohne Namen, nur drei Fragezeichen", () => {
    render(<BadgeShelf progress={progressWithBadges(["tasten-kueken"])} selfView />);
    fireEvent.click(screen.getByRole("button", { name: /Alle Abzeichen anzeigen/ }));
    // Alle Abzeichen erscheinen (33 Medaillen in der Liste + 1 in der Vitrine
    // + 2 bei den nächsten Zielen — mindestens BADGES.length insgesamt).
    expect(
      document.querySelectorAll("svg[viewBox='0 0 64 84']").length,
    ).toBeGreaterThanOrEqual(BADGES.length);
    // Geheim-Abzeichen bleiben verborgen: Name nirgends, dafür „???".
    expect(screen.queryByText("Nachteule")).toBeNull();
    expect(screen.getAllByText("???").length).toBeGreaterThanOrEqual(4);
    // Verdientes ist als solches markiert.
    expect(screen.getAllByText(/\(verdient\)/).length).toBe(1);
  });

  it("nennt die drei nächsten Ziele mit Zählerstand", () => {
    // Drei seit dem Ausbau auf 105 Abzeichen (09.08.2026) — mit fünf neuen
    // Familien wären zwei Ziele oft dreimal dieselbe Sorte.
    render(<BadgeShelf progress={emptyProgress()} selfView />);
    const goals = screen.getByRole("list", { name: "Nächste Ziele" });
    expect(goals.querySelectorAll("[role='listitem']").length).toBe(3);
    expect(goals.textContent).toMatch(/von \d/);
  });

  it("öffnet per Klick auf eine Medaille die Groß-Ansicht — Escape schließt und Fokus kehrt zurück", () => {
    render(<BadgeShelf progress={progressWithBadges(["volltreffer"])} selfView />);
    const medal = screen.getByRole("button", { name: /Volltreffer.*Groß anzeigen/ });
    medal.focus(); // im Browser fokussiert der Klick den Knopf selbst
    fireEvent.click(medal);
    const dialog = screen.getByRole("dialog", { name: /Abzeichen groß: Volltreffer/ });
    // Große Medaille (280 hoch) + Verdien-Datum + Schließen-Knopf im Fokus.
    expect(dialog.querySelector("svg[height='280']")).toBeTruthy();
    expect(dialog.textContent).toMatch(/Verdient am/);
    const close = screen.getByRole("button", { name: "Schließen" });
    expect(document.activeElement).toBe(close);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(medal);
  });

  it('zeigt Geheim-Abzeichen auch in der Groß-Ansicht nur als „???"', () => {
    render(<BadgeShelf progress={emptyProgress()} selfView />);
    fireEvent.click(screen.getByRole("button", { name: /Alle Abzeichen anzeigen/ }));
    const secretRow = screen
      .getAllByText("???")
      .map((el) => el.closest("button"))
      .find(Boolean);
    fireEvent.click(secretRow!);
    const dialog = screen.getByRole("dialog", { name: /Abzeichen groß: \?\?\?/ });
    expect(dialog.textContent).toMatch(/Geheim-Abzeichen/);
    expect(dialog.textContent).toMatch(/Noch nicht verdient/);
  });
});

/**
 * ── Die Medaille wird angesagt (22.08.2026) ────────────────────────────────
 *
 * Das SVG ist aria-hidden, und das bleibt richtig. Aber ein sehendes Kind
 * sieht dort einen Ninja auf einer silbernen Scheibe und redet darueber -
 * darum steht die Medaille seither als Satz im sr-only-Text. Dieser Waechter
 * prueft die VERDRAHTUNG: dass der Satz wirklich auf dem Bildschirm landet,
 * in der Vitrine wie in der aufgeklappten Liste, und dass er ein
 * Geheim-Abzeichen nicht verraet.
 */
describe("BadgeShelf - die Medaille als Satz", () => {
  it("in der Vitrine steht die Bildbeschreibung hinter Name und Bedingung", () => {
    render(<BadgeShelf progress={progressWithBadges(["null-fehler-ninja"])} selfView />);
    const text = screen.getByRole("list", { name: "Deine verdienten Abzeichen" }).textContent!;
    expect(text).toContain("Silberne Medaille mit rotem Band, darauf ein Ninja.");
    // Reihenfolge: erst die Bedingung, dann das Bild.
    expect(text.indexOf("5 Runden ganz ohne Fehler")).toBeLessThan(
      text.indexOf("Silberne Medaille"),
    );
  });

  it("aufgeklappt bekommt jedes Abzeichen seinen Satz - Geheime nur ein Fragezeichen", () => {
    render(<BadgeShelf progress={progressWithBadges(["tasten-kueken"])} selfView />);
    fireEvent.click(screen.getByRole("button", { name: /Alle Abzeichen anzeigen/ }));
    const alles = document.body.textContent!;
    expect(alles).toContain("darauf ein Ninja.");
    expect(alles).toContain("Graue Medaille mit grauem Band und einem Fragezeichen.");
    // Die Eule ist ein Geheim-Abzeichen und darf nicht verraten werden.
    expect(alles).not.toContain("darauf eine Eule.");
  });
});
