/**
 * „Tasten finden": die Funktion der Taste und die kleine Prüfung (23.10.2026).
 *
 * Testerin: „Momentan wird da nur die Lage beschrieben, aber die Funktion
 * gehört für mich dazu … am Ende kann man eine kleine Prüfung einbauen: Tasten
 * richtig drücken, Funktionen kennen und kleine Aufgabe - du willst die
 * Abkürzung AGB schreiben, welche Taste musst du zusätzlich drücken."
 *
 * Festgehalten:
 *  · nach dem ersten Treffer sagt die Runde, was die Sondertaste tut - der
 *    erste Satz aus den Tabellen von „Tasten erkunden", in jeder Sprache;
 *  · die Prüfung hat vier Fragen, die letzte ist AGB, Esc ist nie die Antwort;
 *  · ein falscher Versuch ist nie ein Scheitern: sanfte Antwort, die Frage
 *    bleibt, nach dem zweiten Mal kommt die Lösung dazu;
 *  · jeder Tastendruck bekommt eine Antwort (auch Umschalt bei einer anderen Frage);
 *  · im Fenster: P am Ende der Runde startet die Prüfung - nur in Tastenflow.
 */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const stimme = vi.hoisted(() => ({ ui: vi.fn(), immer: vi.fn() }));
vi.mock("@/lib/typing", async (original) => ({
  ...(await original<typeof import("@/lib/typing")>()),
  speakUi: stimme.ui,
  speakUiAlways: stimme.immer,
}));
vi.mock("@/lib/typing/sound", async (original) => ({
  ...(await original<typeof import("@/lib/typing/sound")>()),
  playSuccessSound: vi.fn(),
  playUnlockFanfare: vi.fn(),
}));
// Die Runde im Fenster: nur die Eingabetaste - so ist sie in drei Tastendrücken zu Ende.
vi.mock("../src/lib/typing/findenRunde", async (original) => {
  const { suchbareTasten } = await import("../src/lib/computer/tastenNamen");
  const echt = await original<typeof import("../src/lib/typing/findenRunde")>();
  return {
    ...echt,
    findenZiele: () => {
      const taste = suchbareTasten("windows").find((t) => t.id === "eingabe");
      return taste ? [{ art: "sonder" as const, taste }] : [];
    },
  };
});

import { TastenErkunden } from "../src/components/typing/TastenErkunden";
import type { KeyEventLike } from "../src/lib/computer/chord";
import { suchbareTasten } from "../src/lib/computer/tastenNamen";
import { findenSchritt, funktionsSatz } from "../src/lib/typing/findenRunde";
import {
  baueFragen,
  neuerStand,
  pruefSchritt,
  pruefungGibtEs,
  type PruefFrage,
} from "../src/lib/typing/findenPruefung";
import { layoutById } from "../src/lib/typing/layouts";

const DE = layoutById("de");
type Druck = { key: string; code?: string; ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean; metaKey?: boolean };
const E = (o: Druck): KeyEventLike => ({ ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, ...o });
const ENTER = E({ key: "Enter", code: "Enter" });
const SHIFT = E({ key: "Shift", code: "ShiftLeft", shiftKey: true });
const BACKSPACE = E({ key: "Backspace", code: "Backspace" });
const KEIN_ZUFALL = () => 0.3;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("die Funktion nach dem Treffer", () => {
  const eingabe = suchbareTasten("windows").find((t) => t.id === "eingabe")!;
  const ziel = { art: "sonder", taste: eingabe } as const;

  it("der erste Satz aus „Tasten erkunden“, mit Abkürzung vorne", () => {
    expect(funktionsSatz(ziel, "windows", "de", "de")).toBe("Enter: Bestätigt und schickt ab.");
    expect(funktionsSatz(ziel, "windows", "de", "en")).toMatch(/^Enter key: [A-Z]/);
  });

  it("bei Zeichen leer", () => {
    expect(funktionsSatz({ art: "zeichen", zeichen: "a" }, "windows", "de", "de")).toBe("");
  });

  it("der erste Treffer sagt sie, der zweite wiederholt sie nicht", () => {
    const erst = findenSchritt({ e: ENTER, ziele: [ziel, ziel], index: 0, bestaetigt: false, plattform: "windows", layout: DE });
    expect(erst?.art).toBe("gefunden");
    expect(erst?.ansage).toContain("Enter: Bestätigt und schickt ab.");
    const nochmal = findenSchritt({
      e: ENTER, ziele: [ziel, ziel], index: 0, bestaetigt: true, dazwischen: false, plattform: "windows", layout: DE,
    });
    expect(nochmal?.ansage).not.toContain("Bestätigt");
  });

  it("jede gefragte Taste hat in jeder Sprache einen Funktionssatz", () => {
    for (const plattform of ["windows", "macos"] as const) {
      for (const sprache of ["de", "en", "fr", "es", "it", "pl", "tr", "cs"] as const) {
        for (const taste of suchbareTasten(plattform)) {
          expect(funktionsSatz({ art: "sonder", taste }, plattform, "de", sprache), `${plattform} ${sprache} ${taste.id}`).not.toBe("");
        }
      }
    }
  });
});

describe("die Fragen", () => {
  it("vier Fragen, die letzte ist AGB mit Umschalt oder Feststelltaste", () => {
    for (const plattform of ["windows", "macos"] as const) {
      for (let lauf = 0; lauf < 100; lauf++) {
        const fragen = baueFragen({ plattform, layoutId: "de", sprache: "de" })!;
        expect(fragen).toHaveLength(4);
        const letzte = fragen[3]!;
        expect(letzte.frage).toContain("AGB");
        expect(letzte.art === "taste" && letzte.ids).toEqual(["umschalt", "feststell"]);
      }
    }
  });

  it("nie Esc als Antwort, jede Antwort-Taste gibt es auf der Tastatur, am Mac Zeilenschalter statt Enter", () => {
    for (const plattform of ["windows", "macos"] as const) {
      for (const art of ["computer", "laptop"] as const) {
        const da = new Set(suchbareTasten(plattform, art).map((t) => t.id));
        for (let lauf = 0; lauf < 150; lauf++) {
          const fragen = baueFragen({ plattform, layoutId: "de", sprache: "de", tastaturArt: art })!;
          for (const f of fragen) {
            if (f.art !== "taste") continue;
            expect(f.ids).not.toContain("esc");
            expect(f.ids.some((id) => da.has(id)), `${plattform} ${art} ${f.frage}`).toBe(true);
          }
        }
      }
    }
  });

  it("die Wahlfrage hat drei verschiedene Antworten, eine ist richtig", () => {
    for (let lauf = 0; lauf < 100; lauf++) {
      const wahl = baueFragen({ plattform: "windows", layoutId: "de", sprache: "de" })!.find((f) => f.art === "wahl");
      expect(wahl?.art).toBe("wahl");
      if (wahl?.art !== "wahl") continue;
      expect(new Set(wahl.optionen).size).toBe(3);
      expect(wahl.richtig).toBeGreaterThanOrEqual(0);
      expect(wahl.richtig).toBeLessThan(3);
    }
  });

  it("nur Deutsch und Englisch haben die Prüfung", () => {
    expect(pruefungGibtEs("de")).toBe(true);
    expect(pruefungGibtEs("en")).toBe(true);
    expect(pruefungGibtEs("fr")).toBe(false);
    expect(baueFragen({ plattform: "windows", layoutId: "de", sprache: "fr" })).toBeNull();
  });
});

describe("die Antworten - nie ein Scheitern", () => {
  const frageTaste = (ids: string[], frage = "Frage?"): PruefFrage => ({ art: "taste", frage, ids });
  const zwei = neuerStand([frageTaste(["loeschtaste"]), frageTaste(["umschalt", "feststell"], "AGB?")]);
  const schritt = (e: KeyEventLike, stand = zwei) => pruefSchritt({ e, stand, plattform: "windows", sprache: "de" })!;

  it("richtig: weiter zur nächsten Frage", () => {
    const p = schritt(BACKSPACE);
    expect(p.art).toBe("weiter");
    expect(p.ansage.startsWith("Richtig! Frage 2 von 2.")).toBe(true);
    expect(p.stand.beimErstenMal).toBe(1);
  });

  it("falsch: die Taste wird genannt, die Frage bleibt, ohne Tadel", () => {
    const p = schritt(ENTER);
    expect(p.art).toBe("falsch");
    expect(p.ansage).toBe("Das ist Enter. Probier es noch einmal.");
    expect(p.stand.index).toBe(0);
  });

  it("nach dem zweiten falschen Versuch kommt die Lösung dazu - und es geht weiter", () => {
    const eins = schritt(ENTER);
    const zweiter = schritt(ENTER, eins.stand);
    expect(zweiter.ansage).toContain("Es ist Backspace. Drück sie.");
    const dann = schritt(BACKSPACE, zweiter.stand);
    expect(dann.art).toBe("weiter");
    expect(dann.stand.beimErstenMal).toBe(0);
  });

  it("die Lösung nach zwei Fehlversuchen nennt auf JEDER Plattform eine Taste (Mac: Zeilenschalter)", () => {
    for (const plattform of ["windows", "macos"] as const) {
      for (let lauf = 0; lauf < 60; lauf++) {
        for (const f of baueFragen({ plattform, layoutId: "de", sprache: "de" })!) {
          if (f.art !== "taste") continue;
          const stand = neuerStand([f]);
          const x = E({ key: "x", code: "KeyX" });
          const eins = pruefSchritt({ e: x, stand, plattform, sprache: "de" })!;
          const zweiter = pruefSchritt({ e: x, stand: eins.stand, plattform, sprache: "de" })!;
          expect(zweiter.ansage, `${plattform} ${f.frage}`).toMatch(/Es ist \S.*\. Drück sie\.$/);
        }
      }
    }
  });

  it("AGB: Umschalt und Feststelltaste sind beide richtig", () => {
    const bei = { ...zwei, index: 1 };
    expect(schritt(SHIFT, bei).art).toBe("fertig");
    expect(schritt(E({ key: "CapsLock", code: "CapsLock" }), bei).art).toBe("fertig");
  });

  it("Umschalt bei einer anderen Frage: eine Antwort, aber kein Fehlversuch", () => {
    const p = schritt(SHIFT);
    expect(p.art).toBe("falsch");
    expect(p.ansage).not.toBe("");
    expect(p.stand.fehlversuche).toBe(0);
  });

  it("die Wahlfrage: 1, 2, 3 - alles andere bekommt den Hinweis", () => {
    const wahl = neuerStand([{ art: "wahl", frage: "Was macht Esc?", optionen: ["A.", "B.", "C."], richtig: 1 }]);
    expect(schritt(E({ key: "9" }), wahl).ansage).toBe("Probier es noch einmal. Drück 1, 2 oder 3.");
    expect(schritt(E({ key: "1" }), wahl).art).toBe("falsch");
    expect(schritt(E({ key: "2" }), wahl).art).toBe("fertig");
  });

  it("die Schlussrückmeldung zählt nur, was gleich saß", () => {
    const p = schritt(SHIFT, { ...zwei, index: 1, beimErstenMal: 1 });
    expect(p.ansage).toBe("Richtig! Geschafft! Alle 2 Fragen gelöst, 2 davon gleich beim ersten Mal.");
  });

  it("ein ganzer Durchgang mit zufälligen Fragen endet - egal wie oft falsch gedrückt wird", () => {
    for (let lauf = 0; lauf < 50; lauf++) {
      let stand = neuerStand(baueFragen({ plattform: "windows", layoutId: "de", sprache: "de" })!);
      for (let i = 0; i < 40 && stand.index < stand.fragen.length; i++) {
        const f = stand.fragen[stand.index]!;
        const falsch = pruefSchritt({ e: E({ key: "x", code: "KeyX" }), stand, plattform: "windows", sprache: "de" })!;
        stand = falsch.stand;
        const richtigeTaste =
          f.art === "wahl"
            ? E({ key: String(f.richtig + 1) })
            : f.ids[0] === "loeschtaste"
              ? BACKSPACE
              : f.ids[0] === "entf"
                ? E({ key: "Delete", code: "Delete" })
                : f.ids[0] === "eingabe"
                  ? ENTER
                  : f.ids[0] === "tabulator"
                    ? E({ key: "Tab", code: "Tab" })
                    : f.ids[0] === "leertaste"
                      ? E({ key: " ", code: "Space" })
                      : SHIFT;
        stand = pruefSchritt({ e: richtigeTaste, stand, plattform: "windows", sprache: "de" })!.stand;
      }
      expect(stand.index).toBe(stand.fragen.length);
    }
    void KEIN_ZUFALL;
  });
});

describe("im Fenster", () => {
  const zeile = () => (document.querySelector("[data-erkunden-zeile]") as HTMLTextAreaElement).value;
  const druck = (o: Druck) => act(() => void fireEvent.keyDown(document, o));

  const rundeBisEnde = async () => {
    render(
      <TastenErkunden open onClose={vi.fn()} plattform="windows" startModus="finden" ladeGelernte={() => Promise.resolve([])} />,
    );
    await act(async () => {});
    druck({ key: "Enter", code: "Enter" });
    druck({ key: "a", code: "KeyA" });
    druck({ key: "Enter", code: "Enter" });
  };

  it("nach dem Treffer steht die Funktion in der Zeile", async () => {
    render(
      <TastenErkunden open onClose={vi.fn()} plattform="windows" startModus="finden" ladeGelernte={() => Promise.resolve([])} />,
    );
    await act(async () => {});
    druck({ key: "Enter", code: "Enter" });
    expect(zeile()).toContain("Enter: Bestätigt und schickt ab.");
  });

  it("am Ende der Runde nennt die Zeile die Prüfung, P startet sie, der Schalter ist da", async () => {
    await rundeBisEnde();
    expect(zeile()).toContain("Kleine Prüfung mit P.");
    expect(screen.getByRole("button", { name: "Kleine Prüfung" })).toBeTruthy();
    druck({ key: "p", code: "KeyP" });
    expect(zeile().startsWith("Kleine Prüfung. Frage 1 von 4.")).toBe(true);
    expect(screen.getByText("Frage 1 von 4.")).toBeTruthy();
  });

  it("der Schalter startet sie auch - und Enter am Ende sucht noch einmal", async () => {
    await rundeBisEnde();
    act(() => void fireEvent.click(screen.getByRole("button", { name: "Kleine Prüfung" })));
    expect(zeile().startsWith("Kleine Prüfung. Frage 1 von 4.")).toBe(true);
  });

  // ★ Testerin 04.11.2026 (Meldung uk6ceu327wzkbaa): „Hier komme ich mit Tab nicht zur Prüfung."
  it("am Ende führt Tab zu den Schaltern und zurück ins Feld; Enter drückt den Schalter, Esc führt zurück", async () => {
    await rundeBisEnde();
    const feld = document.querySelector("[data-erkunden-zeile]") as HTMLTextAreaElement;
    const noch = screen.getByRole("button", { name: "Noch einmal suchen" });
    const pruef = screen.getByRole("button", { name: "Kleine Prüfung" });
    act(() => feld.focus());
    const tab = (shiftKey = false) =>
      act(() => void fireEvent.keyDown(document.activeElement ?? document, { key: "Tab", code: "Tab", shiftKey }));
    tab();
    expect(document.activeElement).toBe(noch);
    tab();
    expect(document.activeElement).toBe(pruef);
    tab();
    expect(document.activeElement).toBe(feld);
    tab(true);
    expect(document.activeElement).toBe(pruef);
    // Esc auf dem Schalter: zurück in die Zeile, ohne das Fenster zu schliessen.
    act(() => void fireEvent.keyDown(pruef, { key: "Escape", code: "Escape" }));
    expect(document.activeElement).toBe(feld);
    tab(true);
    // Enter auf dem Schalter gehört dem Schalter - die Runde fängt NICHT von vorn an.
    const vorher = zeile();
    act(() => void fireEvent.keyDown(pruef, { key: "Enter", code: "Enter" }));
    expect(zeile()).toBe(vorher);
    act(() => void fireEvent.click(pruef));
    expect(zeile().startsWith("Kleine Prüfung. Frage 1 von 4.")).toBe(true);
  });

  it("in der laufenden Prüfung bleibt Tab eine Antwort", async () => {
    await rundeBisEnde();
    druck({ key: "p", code: "KeyP" });
    const vorher = zeile();
    druck({ key: "Tab", code: "Tab" });
    expect(zeile()).not.toBe(vorher);
  });

  it("in der Prüfung antwortet jeder Tastendruck - nie Stille", async () => {
    await rundeBisEnde();
    druck({ key: "p", code: "KeyP" });
    const vorher = zeile();
    druck({ key: "x", code: "KeyX" });
    expect(zeile()).not.toBe(vorher);
    expect(zeile()).toMatch(/^Das ist /);
  });

  it("ohne `ladeGelernte` (»Im Griff«) gibt es keine Prüfung", async () => {
    render(<TastenErkunden open onClose={vi.fn()} plattform="windows" startModus="finden" />);
    expect(screen.queryByRole("button", { name: "Kleine Prüfung" })).toBeNull();
  });
});
