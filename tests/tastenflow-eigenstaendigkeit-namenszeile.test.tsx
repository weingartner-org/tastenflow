/**
 * ★★ E10 (19.09.2026): die Marke „prüfen" in der Namenszeile der
 * Klassentabelle - orange ab 4 („auffällig"), rot ab 7 („stark auffällig"),
 * nichts bis 3. Johannes 18.09.: *„mittel orange und rot für stark, aber
 * beides kennzeichnen"*.
 *
 * Gemessen wird:
 *  - dieselben Grenzen wie am `SuspicionChip` (eine Stelle, zwei Anzeigen);
 *  - Form UND Wort, nicht nur Farbe (das „!" nur bei stark);
 *  - die Sprachausgabe hört Stufe und Bitte, nicht die Kurzform;
 *  - kein `title`, der Hinweis hängt am `Tipp`-Weg (Hinweisflaeche);
 *  - Englisch in der englischen Bedienung, mit Gegenprobe auf Deutsch.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BedienSpracheProvider, type BedienSprache } from "@/lib/bedienSprache";
import {
  EigenstaendigkeitsMarke,
  eigenstaendigkeitsStufe,
} from "@/components/lernwerkstatt/klasse/EigenstaendigkeitsMarke";
import { SuspicionChip } from "@/components/typing/PupilStatsPanel";
import { findeDeutsch } from "./helfer/deutschFaenger";

function stelleBedienung(sprache: BedienSprache | null) {
  if (sprache) {
    localStorage.setItem("tastenflow-bedienung", sprache);
  } else {
    localStorage.removeItem("tastenflow-bedienung");
  }
}

function zeige(score: number, reasons: string[] = ["Viele Fensterwechsel während der Übung."]) {
  return render(
    <BedienSpracheProvider>
      <MemoryRouter initialEntries={["/lernwerkstatt/tastenflow/klasse"]}>
        <table>
          <tbody>
            <tr>
              <th scope="row" data-testid="name">
                <span>Mia</span>
                <EigenstaendigkeitsMarke score={score} reasons={reasons} />
              </th>
            </tr>
          </tbody>
        </table>
      </MemoryRouter>
    </BedienSpracheProvider>,
  );
}

afterEach(() => {
  cleanup();
  stelleBedienung(null);
});

describe("★★ E10 - Marke „prüfen“ in der Namenszeile", () => {
  it("bis 3 keine Marke, 4-6 auffällig, ab 7 stark - dieselben Grenzen wie der Chip", () => {
    expect([0, 1, 3].map(eigenstaendigkeitsStufe)).toEqual(["keine", "keine", "keine"]);
    expect([4, 6].map(eigenstaendigkeitsStufe)).toEqual(["auffaellig", "auffaellig"]);
    expect([7, 10].map(eigenstaendigkeitsStufe)).toEqual(["stark", "stark"]);
    // Gegenprobe am Chip: dieselben Grenzen tragen dort dieselben Wörter.
    for (const [score, wort] of [
      [3, "unauffällig"],
      [4, "auffällig"],
      [6, "auffällig"],
      [7, "stark auffällig"],
    ] as const) {
      const { container, unmount } = render(
        <BedienSpracheProvider>
          <SuspicionChip score={score} reasons={[]} />
        </BedienSpracheProvider>,
      );
      expect(container.textContent).toContain(`${score}/10 · ${wort}`);
      unmount();
    }
  });

  it("bis 3: nichts in der Zeile", () => {
    const { getByTestId } = zeige(3);
    expect(getByTestId("name").textContent).toBe("Mia");
    expect(document.querySelector("[data-eigenstaendigkeit]")).toBeNull();
  });

  it("4-6: orange, Wort „prüfen“, ohne „!“ - die Sprachausgabe hört die Stufe", () => {
    zeige(5);
    const m = document.querySelector("[data-eigenstaendigkeit]") as HTMLElement;
    expect(m.dataset.eigenstaendigkeit).toBe("auffaellig");
    expect(m.className).toContain("bg-warning-soft");
    expect(m.className).toContain("border-warning");
    const kurz = m.querySelector('[aria-hidden="true"]')!;
    expect(kurz.textContent).toBe("prüfen");
    expect(m.querySelector(".sr-only")!.textContent).toBe(", Eigenständigkeit prüfen: auffällig");
  });

  it("ab 7: rot, „! prüfen“, doppelter Rahmen - Form und Zeichen, nicht nur Farbe", () => {
    zeige(8);
    const m = document.querySelector("[data-eigenstaendigkeit]") as HTMLElement;
    expect(m.dataset.eigenstaendigkeit).toBe("stark");
    expect(m.className).toContain("border-danger");
    expect(m.className).toContain("border-2");
    expect(m.querySelector('[aria-hidden="true"]')!.textContent).toBe("! prüfen");
    expect(m.querySelector(".sr-only")!.textContent).toBe(", Eigenständigkeit prüfen: stark auffällig");
  });

  it("der Hinweis nennt Wert, Gründe und die Bitte - ohne „KI“, ohne `title`", () => {
    zeige(5, ["Viele Fensterwechsel während der Übung."]);
    const m = document.querySelector("[data-eigenstaendigkeit]") as HTMLElement;
    // Seit K1 steht der Kasten in der Hinweis-Ebene und erst beim Zeigen.
    fireEvent.mouseEnter(m);
    const text = document.body.textContent ?? "";
    expect(text).toContain("Eigenständigkeit 5 von 10, auffällig.");
    expect(text).toContain("Viele Fensterwechsel während der Übung.");
    expect(text).toContain("kein Urteil über das Kind");
    expect(text).not.toMatch(/\bKI\b/);
    expect(document.querySelectorAll("[title]")).toHaveLength(0);
  });

  it("englisch in der englischen Bedienung - und die Gegenprobe findet das Deutsch", () => {
    stelleBedienung("en");
    const en = zeige(8, []);
    const m = document.querySelector("[data-eigenstaendigkeit]") as HTMLElement;
    expect(m.querySelector('[aria-hidden="true"]')!.textContent).toBe("! check");
    expect(m.querySelector(".sr-only")!.textContent).toBe(", please check independent work: very unusual");
    expect(findeDeutsch(m)).toEqual([]);
    en.unmount();

    stelleBedienung(null);
    zeige(8, []);
    const de = document.querySelector("[data-eigenstaendigkeit]") as HTMLElement;
    expect(findeDeutsch(de).length).toBeGreaterThan(0);
  });
});
