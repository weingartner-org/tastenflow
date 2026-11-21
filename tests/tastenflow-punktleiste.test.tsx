/**
 * ★★ WÄCHTER: Die Punktleiste (01.09.2026).
 *
 * Johannes: *„statt dem boxplot mach die punkte der schüler auf der leiste"* ·
 * *„mit tastatur machen wir eine tab pfeil navigation"* · *„die tastatur hat
 * immer priorität, es gibt blinde und sehende lehrer, diesen überblick müssen
 * beide gruppen gut bedienen können."*
 *
 * ── Was hier gemessen wird und warum ───────────────────────────────────────
 *
 *  1. **EIN Tab-Halt, nicht einer je Person.** Das ist die Bedingung, an der
 *     die Sache steht oder fällt: 24 Lernende mal drei Leisten wären 72
 *     Tab-Halte. Die Seite wäre dann gerade für die unbenutzbar, für die sie
 *     gedacht ist. Ein Test, der nur „ist bedienbar" prüft, sähe das nicht.
 *  2. **Die Pfeiltasten gehen wirklich weiter** und die Ansage folgt mit.
 *  3. **Die Überschrift ist da und gehört zur Gruppe** - sonst landet man mit
 *     der Überschriften-Navigation neben der Leiste statt auf ihr.
 *  4. **Die Punkte liegen an der richtigen Stelle.** ⚠️ Beim Bauen lag der
 *     Wert erst als `Math.round(accuracy)` vor - und `accuracy` ist 0..1, nicht
 *     0..100. Jeder Punkt wäre auf 1 gefallen, die Leiste wäre EIN Fleck
 *     gewesen, und keiner der anderen drei Tests hätte es gemerkt: Ein Fleck
 *     ist bedienbar, hat eine Überschrift und einen Tab-Halt.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { Punktleiste } from "@/components/typing/Punktleiste";

afterEach(cleanup);

const KLASSE = [
  { name: "Tom", wert: 85 },
  { name: "Mia", wert: 92 },
  { name: "Lea", wert: 97 },
];

function zeige(personen = KLASSE, extra: Record<string, unknown> = {}) {
  return render(
    <Punktleiste
      titel="Treffsicherheit in der Klasse"
      personen={personen}
      einheit=" %"
      einheitGesprochen="Prozent"
      {...extra}
    />,
  );
}

describe("★★★ Die Punktleiste kostet EINEN Tab-Halt, nicht einen je Person", () => {
  it("bei 24 Lernenden ist genau ein Element mit der Tabulatortaste erreichbar", () => {
    const viele = Array.from({ length: 24 }, (_, i) => ({
      name: `Kind ${i + 1}`,
      // Werte dicht beieinander - genau der Fall, in dem Punkte überlappen.
      wert: 85 + (i % 12),
    }));
    const { container } = zeige(viele);

    // Alles, was die Tabulatortaste anspringt: tabindex >= 0 und die von
    // Natur aus fokussierbaren Elemente ohne tabindex="-1".
    const halte = container.querySelectorAll(
      '[tabindex="0"], button:not([tabindex="-1"]), a[href]:not([tabindex="-1"])',
    );
    expect(
      halte.length,
      `24 Personen dürfen NICHT 24 Tab-Halte kosten, gefunden: ${halte.length}`,
    ).toBe(1);

    // Und die 24 Punkte sind trotzdem alle da - nur eben nicht als Tab-Halt.
    expect(container.querySelectorAll('button[tabindex="-1"]')).toHaveLength(24);
  });
});

describe("★★ Die Pfeiltasten gehen von Person zu Person", () => {
  it("Fokus setzt auf die erste, Pfeil rechts geht weiter, Ende springt ans Ende", () => {
    zeige();
    const gruppe = screen.getByRole("group", { name: /Treffsicherheit/ });

    fireEvent.focus(gruppe);
    // Sortiert nach Wert: Tom (85), Mia (92), Lea (97).
    expect(screen.getByText("Tom, 85 Prozent")).toBeTruthy();

    fireEvent.keyDown(gruppe, { key: "ArrowRight" });
    expect(screen.getByText("Mia, 92 Prozent")).toBeTruthy();

    fireEvent.keyDown(gruppe, { key: "End" });
    expect(screen.getByText("Lea, 97 Prozent")).toBeTruthy();

    // ⚠️ Am Ende bleibt sie stehen, statt umzulaufen: Wer die Pfeiltaste
    // gedrückt hält, soll nicht unbemerkt wieder vorne anfangen.
    fireEvent.keyDown(gruppe, { key: "ArrowRight" });
    expect(screen.getByText("Lea, 97 Prozent")).toBeTruthy();

    fireEvent.keyDown(gruppe, { key: "Home" });
    expect(screen.getByText("Tom, 85 Prozent")).toBeTruthy();
  });

  it("Enter meldet die Person, auf der man steht", () => {
    const gewaehlt = vi.fn();
    zeige(KLASSE, { onWaehlen: gewaehlt });
    const gruppe = screen.getByRole("group", { name: /Treffsicherheit/ });

    fireEvent.focus(gruppe);
    fireEvent.keyDown(gruppe, { key: "ArrowRight" });
    fireEvent.keyDown(gruppe, { key: "Enter" });
    expect(gewaehlt).toHaveBeenCalledWith("Mia");
  });
});

describe("★★ Die Überschrift gehört zur Leiste", () => {
  it("es gibt eine Überschrift, und die Gruppe verweist auf sie", () => {
    zeige();
    const ueberschrift = screen.getByRole("heading", {
      name: "Treffsicherheit in der Klasse",
    });
    const gruppe = screen.getByRole("group", { name: /Treffsicherheit/ });
    expect(gruppe.getAttribute("aria-labelledby")).toBe(ueberschrift.id);
  });

  it("die Gruppe sagt beim Betreten, wie viele darauf liegen und wie man geht", () => {
    zeige();
    const label =
      screen.getByRole("group", { name: /Treffsicherheit/ }).getAttribute("aria-label") ?? "";
    expect(label).toContain("3 Personen");
    expect(label).toContain("Pfeiltasten");
    // Die Spanne - der Überblick, ohne einen einzigen Tastendruck.
    expect(label).toContain("85");
    expect(label).toContain("97");
  });
});

describe("★★★ Die Punkte liegen an ihrer echten Stelle", () => {
  it("drei verschiedene Werte ergeben drei verschiedene Stellen", () => {
    const { container } = zeige();
    const stellen = [...container.querySelectorAll('button[tabindex="-1"]')].map(
      (el) => (el as HTMLElement).style.left,
    );
    expect(new Set(stellen).size, `alle Punkte auf derselben Stelle: ${stellen}`).toBe(3);
  });

  it("⚠️ der Fehler, der beim Bauen passiert ist: alle Werte gleich ⇒ EIN Fleck", () => {
    // So sah die Leiste aus, als der Wert versehentlich als 0..1 statt 0..100
    // durchgereicht wurde: Math.round(0.85) und Math.round(0.97) sind beide 1.
    const kaputt = KLASSE.map((p) => ({ ...p, wert: Math.round(p.wert / 100) }));
    const { container } = zeige(kaputt);
    const stellen = [...container.querySelectorAll('button[tabindex="-1"]')].map(
      (el) => (el as HTMLElement).style.left,
    );
    // Dieser Test hält den Schaden fest, statt ihn nur zu beschreiben: Wäre
    // die Umrechnung wieder falsch, fiele der Test oben um.
    expect(new Set(stellen).size).toBe(1);
  });

  it("die kleinste Person liegt links von der grössten", () => {
    const { container } = zeige();
    const punkte = [...container.querySelectorAll('button[tabindex="-1"]')] as HTMLElement[];
    const links = punkte.map((el) => parseFloat(el.style.left));
    expect(links[0]).toBeLessThan(links[2]);
  });
});

describe("★ Die Maus zeigt dasselbe wie die Tastatur", () => {
  it("Zeigen auf einen Punkt blendet Namen und Wert ein", () => {
    const { container } = zeige();
    const punkte = container.querySelectorAll('button[tabindex="-1"]');
    fireEvent.mouseEnter(punkte[1]);
    /*
      ⚠️ Es sind ZWEI Stellen, und das ist der Punkt: die sichtbare
      Einblendung für das Auge und die Ansage für die Sprachausgabe. Der erste
      Anlauf dieses Tests suchte mit getByText EINE Stelle und fiel um - der
      Test hatte unrecht, nicht der Code. Wären es je nur noch eine, hätte
      eine der beiden Gruppen etwas verloren; darum wird die Zahl geprüft.
    */
    expect(screen.getAllByText(/Mia/)).toHaveLength(2);
    expect(screen.getByText("Mia, 92 Prozent")).toBeTruthy();
  });
});

describe("★★ Der Überblick steht als Text da - ohne einen Tastendruck", () => {
  it("die Zusammenfassung ist nicht aria-hidden", () => {
    const { container } = zeige(KLASSE, {
      zusammenfassung: <p>unter 85 %: 1 Person</p>,
    });
    const kopie = container.cloneNode(true) as HTMLElement;
    kopie.querySelectorAll('[aria-hidden="true"]').forEach((el) => el.remove());
    expect((kopie.textContent || "")).toContain("unter 85 %: 1 Person");
  });
});
