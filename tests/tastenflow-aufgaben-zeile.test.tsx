/**
 * ★★★★★ WÄCHTER: Die Aufgaben-Zeile in „Meine Klassen" (E3, 18.09.2026).
 *
 * Bauplan `BAUPLAN-2026-09-18-MEINE-KLASSEN-UMBAU.md`, Etappe E3: Johannes
 * fand die Seite „unübersichtlich" - vor der Tabelle standen fünf gestapelte
 * Kästen. Jetzt: EINE Reihe von vier Schaltern (Tippchallenge · Eigene Übung ·
 * Wochenziel · Einstellungen der Klasse), ihr Panel öffnet direkt darunter -
 * immer höchstens eines; die Tabelle rückt weit nach oben. Der Klassenüberblick
 * (die frühere Jahreskarte, `ClassOverview`) stand seither zugeklappt UNTER
 * der Tabelle - seit K3 (19.09.2026) schlank und offen DARÜBER.
 *
 * Gepinnt wird hier genau das, was der Bauplan verlangt:
 *  1. Die vier Schalter stehen in dieser Reihenfolge, VOR der Tabelle.
 *  2. Immer höchstens EIN Panel ist offen - ein zweiter Schalter tauscht.
 *  3. Escape schliesst das offene Panel und gibt den Fokus an seinen
 *     Schalter zurück.
 *  4. Eine laufende Tippchallenge öffnet ihr Panel von selbst und ist am
 *     Schalter selbst zu lesen, ohne dass man ihn öffnet.
 *  5. Der Klassenüberblick steht offen ÜBER der Tabelle (seit K3).
 *  6. „Einstellungen der Klasse" steht NICHT mehr unbedingt am Seitenende -
 *     ihre Felder sind nur erreichbar, wenn ihr eigenes Panel offen ist.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";

import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { typingBackend } from "@/lib/typing";
import type { SchreibprobePlan } from "@/lib/typing/schreibprobe";
import type { TypingAccount, TypingClass } from "@/lib/typing";
import {
  addPupil,
  createClass,
  getClass,
  listPupils,
  registerTeacher,
} from "@/lib/typing/account";

function baueKlasse(): { cls: TypingClass; teacherId: string; kinder: TypingAccount[] } {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  for (const name of ["Anna", "Ben"]) {
    const p = addPupil(c.value.code, name, "pw1234");
    if (!p.ok) throw new Error(p.error);
  }
  return { cls: getClass(c.value.code)!, teacherId: t.value.id, kinder: listPupils(c.value.code) };
}

function plan(startInMs: number): SchreibprobePlan {
  const jetzt = Date.now();
  return {
    id: "p1",
    niveau: "start",
    startMs: jetzt + startInMs,
    dauerMin: 5,
    textNr: 0,
    startZeile: 0,
    zuschlagProzent: 0,
    angelegtMs: jetzt,
  };
}

async function zeige(cls: TypingClass, teacherId: string, kinder: TypingAccount[]) {
  render(
    <TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={teacherId} />,
  );
  return await screen.findByRole("table", { name: /Lernende der Klasse/ });
}

/** Die vier Schalter der Aufgaben-Zeile, in der Reihenfolge des Baums. */
function aufgabenSchalter(): HTMLElement[] {
  const reihe = screen.getByRole("group", { name: "Aufgaben für die Klasse" });
  return within(reihe).getAllByRole("button");
}

beforeEach(() => localStorage.clear());
afterEach(() => cleanup());

describe("★★★ 1 - die Schalter, in dieser Reihenfolge, vor der Tabelle", () => {
  // ★ W3b (18.09.2026): „Stunde sperren" ist der fünfte - Johannes: „der
  // Lehrer bekommt einen Schalter für eine Stunde sperren", jede Stunde
  // gebraucht, darum immer sichtbar in derselben Reihe.
  // ★ 19.09.2026, Johannes: „tausche die Schalter ‚Stunde sperren' mit
  // ‚Einstellungen der Klasse'".
  it("Tippchallenge · Eigene Übung · Wochenziel · Stunde sperren · Einstellungen der Klasse", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    const tisch = await zeige(cls, teacherId, kinder);
    const namen = aufgabenSchalter().map((b) => (b.textContent ?? "").split("·")[0].trim());
    expect(namen).toEqual([
      "Tippchallenge",
      "Eigene Übung",
      "Wochenziel",
      "Stunde sperren",
      "Einstellungen der Klasse",
    ]);
    // Die Reihe steht VOR der Tabelle, nicht danach.
    const reihe = screen.getByRole("group", { name: "Aufgaben für die Klasse" });
    expect(
      reihe.compareDocumentPosition(tisch) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("ohne Klasse bleibt nur „Wochenziel“ übrig - die anderen drei brauchen eine Klasse", async () => {
    const { kinder } = baueKlasse();
    render(<TastenflowReiter pupils={kinder} onChanged={() => {}} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    const namen = aufgabenSchalter().map((b) => (b.textContent ?? "").split("·")[0].trim());
    expect(namen).toEqual(["Wochenziel"]);
  });
});

describe("★★★ 2 - immer höchstens EIN Panel offen", () => {
  it("ein zweiter Schalter tauscht das Panel, statt es hinzuzufügen", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    await zeige(cls, teacherId, kinder);
    const [tippchallenge, eigeneUebung] = aufgabenSchalter();

    fireEvent.click(tippchallenge);
    expect(tippchallenge.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById("mk-tf-panel-tippchallenge")).not.toHaveAttribute("hidden");

    fireEvent.click(eigeneUebung);
    expect(tippchallenge.getAttribute("aria-expanded")).toBe("false");
    expect(eigeneUebung.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById("mk-tf-panel-tippchallenge")).toHaveAttribute("hidden");
    expect(document.getElementById("mk-tf-panel-eigene-uebung")).not.toHaveAttribute("hidden");
  });

  it("derselbe Schalter ein zweites Mal schliesst sein eigenes Panel wieder", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    await zeige(cls, teacherId, kinder);
    const [tippchallenge] = aufgabenSchalter();

    fireEvent.click(tippchallenge);
    expect(tippchallenge.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(tippchallenge);
    expect(tippchallenge.getAttribute("aria-expanded")).toBe("false");
    expect(document.getElementById("mk-tf-panel-tippchallenge")).toHaveAttribute("hidden");
  });
});

describe("★★★ 3 - Escape schliesst das offene Panel und gibt den Fokus zurück", () => {
  it("Escape auf der Panel-Überschrift schliesst und fokussiert den Schalter", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    await zeige(cls, teacherId, kinder);
    const [, , wochenziel] = aufgabenSchalter();

    fireEvent.click(wochenziel);
    expect(wochenziel.getAttribute("aria-expanded")).toBe("true");
    const ueberschrift = screen.getByRole("heading", { name: /Wochenziel - Aufgabe/ });
    fireEvent.keyDown(ueberschrift, { key: "Escape" });

    expect(wochenziel.getAttribute("aria-expanded")).toBe("false");
    expect(document.getElementById("mk-tf-panel-wochenziel")).toHaveAttribute("hidden");
    expect(document.activeElement).toBe(wochenziel);
  });

  it("Escape auf einem Feld IM Panel schliesst genauso (die Taste bubblet)", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    await zeige(cls, teacherId, kinder);
    const [, , , , einstellungen] = aufgabenSchalter();

    fireEvent.click(einstellungen);
    const feld = screen.getByLabelText(/Startniveau für alle Kinder der Klasse/);
    fireEvent.keyDown(feld, { key: "Escape" });

    expect(einstellungen.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(einstellungen);
  });
});

describe("★★★ 4 - eine laufende Tippchallenge ist ohne Aufklappen sichtbar", () => {
  it("öffnet ihr Panel von selbst und nennt „läuft“ am Schalter", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    const neu = await typingBackend().setzeSchreibprobe(cls.code, teacherId, plan(-1000), {});
    expect(neu).toBeTruthy();
    await zeige(getClass(cls.code)!, teacherId, kinder);

    // ⚠️ Nicht `/^Tippchallenge/` allein - das träfe auch den Knopf
    // „Tippchallenge absagen" im nun offenen Panel. Der Aussen-Schalter ist
    // der einzige mit „· läuft" im Namen.
    const schalter = await screen.findByRole("button", { name: /^Tippchallenge · läuft/ });
    expect(schalter.textContent).toMatch(/läuft/);
    expect(schalter.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById("mk-tf-panel-tippchallenge")).not.toHaveAttribute("hidden");
  });

  it("ohne laufende Runde bleibt der Schalter ohne Zusatz und zu", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    await zeige(cls, teacherId, kinder);
    // ★ K1 (19.09.2026): Der Sortier-Knopf des Spaltenkopfs heisst ebenfalls
    // „Tippchallenge" - jsdom rechnete bis dahin den (dort nicht versteckten)
    // Hinweis in seinen Namen, seit er unter <body> hängt nicht mehr. Der
    // Schalter ist der mit `aria-expanded`.
    const schalter = screen.getByRole("button", { name: "Tippchallenge", expanded: false });
    expect(schalter.getAttribute("aria-expanded")).toBe("false");
  });
});

/*
  ★ K3 (19.09.2026) hat Punkt 5 umgedreht. Johannes: *„der Klassenüberblick
  wird schlank und steht über der Tabelle"*. Er ist seither drei Zeilen hoch
  und steht OFFEN zwischen der Aufgaben-Zeile und dem Zeitraum-Kopf - der
  eigene Wächter dazu: `tests/tastenflow-klassenueberblick.test.tsx`.
*/
describe("★★★ 5 - der Klassenüberblick steht offen ÜBER der Tabelle (K3)", () => {
  it("„Klassenüberblick“ steht nach der Aufgaben-Zeile, vor der Tabelle, ohne Aufklapper", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    const tisch = await zeige(cls, teacherId, kinder);
    const ueberblick = screen.getByRole("region", { name: "Klassenüberblick" });
    expect(ueberblick.closest("details")).toBeNull();
    expect(
      ueberblick.compareDocumentPosition(tisch) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    const reihe = screen.getByRole("group", { name: "Aufgaben für die Klasse" });
    expect(
      reihe.compareDocumentPosition(ueberblick) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});

describe("★★★ 6 - „Einstellungen der Klasse“ steht nicht mehr unbedingt am Seitenende", () => {
  it("ihre Felder sind erst erreichbar, wenn ihr eigenes Panel offen ist", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    await zeige(cls, teacherId, kinder);
    // Zu: das Startniveau-Feld der Klasse ist (als Bedienelement) nicht da.
    expect(
      screen.queryByRole("combobox", { name: /Startniveau für alle Kinder der Klasse/ }),
    ).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /^Einstellungen der Klasse/ }));
    expect(
      screen.getByRole("combobox", { name: /Startniveau für alle Kinder der Klasse/ }),
    ).toBeTruthy();
  });

  it("ihr Panel steht VOR der Tabelle - nicht mehr als letztes Stück der Seite", async () => {
    const { cls, teacherId, kinder } = baueKlasse();
    const tisch = await zeige(cls, teacherId, kinder);
    fireEvent.click(screen.getByRole("button", { name: /^Einstellungen der Klasse/ }));
    const ueberschrift = screen.getByRole("heading", { name: "Einstellungen der Klasse" });
    expect(
      ueberschrift.compareDocumentPosition(tisch) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
