/**
 * ★★★ WÄCHTER: GEZIELT ÜBEN - der Dialog „Tasten wählen" (Etappe B, 13.11.2026, Bauplan §4).
 *
 *   (a) Das Feld „Taste drücken" schaltet um: drücken wählt, noch einmal drücken nimmt weg; Leertaste und Tab zählen nicht.
 *   (b) Die Auswahl-Tastatur hat Reiter Normal / Mit Umschalt / Mit AltGr, die aus `layout.rows` + `layout.access` kommen.
 *   (c) Höchstens 8: das 9. wird nicht aufgenommen, der Dialog sagt warum (nie `disabled`).
 *   (d) „Fertig" gibt den Wert zurück (Selbstlernende: `null` ohne Zeichen = aus), „Alle entfernen" leert.
 *   (e) Escape schliesst - NUR den Dialog, auch wenn er über einem zweiten Modal (dem Zahnrad) steht - und der Fokus
 *       geht an den Öffner zurück.
 *   (f) Selbstlernende: der Haken speichert über das Konto-Backend; Gäste über das Gerät.
 *   (g) Gegenprobe: ein Zeichen, das es auf der Tastatur nicht gibt, wird nicht angeboten und nicht aufgenommen.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { useState } from "react";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn(), speak: vi.fn() };
});

import { GezieltDialog } from "../src/components/typing/GezieltDialog";
import { Modal } from "../src/components/Modal";
import { setLayout } from "../src/lib/typing/layouts";
import { speakUi } from "../src/lib/typing";
import type { Gezielt } from "../src/lib/typing/gezielt";

beforeEach(() => {
  localStorage.clear();
  setLayout("de");
  vi.mocked(speakUi).mockClear();
});
afterEach(() => cleanup());

function feld() {
  return screen.getByLabelText("Taste drücken") as HTMLInputElement;
}
function druecke(key: string, extra: Partial<KeyboardEventInit> = {}) {
  fireEvent.keyDown(feld(), { key, ...extra });
}
function dialog(start: Gezielt | null = null, vorschlag: string[] = []) {
  const onSpeichern = vi.fn();
  const onSchliessen = vi.fn();
  render(<GezieltDialog start={start} vorschlag={vorschlag} onSpeichern={onSpeichern} onSchliessen={onSchliessen} />);
  return { onSpeichern, onSchliessen };
}
/** Die Chips der gewählten Zeichen: die Knöpfe „… entfernen". */
function chips() {
  return screen.queryAllByRole("button", { name: /entfernen$/ }).filter((b) => b.textContent !== "Alle entfernen");
}

describe("(a) das Feld „Taste drücken\"", () => {
  it("drücken wählt, noch einmal drücken nimmt weg", () => {
    dialog();
    druecke("ö");
    expect(chips()).toHaveLength(1);
    expect(chips()[0].textContent).toBe("ö");
    expect(screen.getByText("Gewählt: 1 von 8")).toBeTruthy();
    druecke("ö");
    expect(chips()).toHaveLength(0);
    expect(screen.getByText("Noch nichts gewählt.")).toBeTruthy();
  });

  it("Grossbuchstabe und Kleinbuchstabe sind dieselbe Wahl (die Runde rechnet klein)", () => {
    dialog();
    druecke("Ö", { shiftKey: true });
    expect(chips()[0].textContent).toBe("ö");
    druecke("ö");
    expect(chips()).toHaveLength(0);
  });

  it("Leertaste, Tab, Enter und Umschalt allein wählen nichts", () => {
    dialog();
    druecke(" ");
    druecke("Tab");
    druecke("Enter");
    druecke("Shift", { shiftKey: true });
    expect(chips()).toHaveLength(0);
  });

  it("Strg- und Alt-Kombinationen gehören den Kürzeln der Seite und wählen nichts", () => {
    dialog();
    druecke("a", { ctrlKey: true });
    druecke("2", { altKey: true });
    expect(chips()).toHaveLength(0);
  });

  it("AltGr (Strg + Alt, `AltGraph`) liefert das fertige Zeichen: € wird gewählt", () => {
    dialog();
    druecke("€", { ctrlKey: true, altKey: true });
    expect(chips().map((c) => c.textContent)).toEqual(["€"]);
  });

  it("eine Totaste wartet auf das nächste Zeichen: ^ + Leertaste ergibt „^\"", () => {
    dialog();
    druecke("Dead", { code: "Backquote" });
    expect(chips()).toHaveLength(0);
    druecke("^", { code: "Space" });
    expect(chips().map((c) => c.textContent)).toEqual(["^"]);
  });

  it("jede Wahl wird angesagt (speakUi), nie über einen Live-Bereich der Übungszeile", () => {
    dialog();
    druecke("ö");
    expect(vi.mocked(speakUi)).toHaveBeenCalled();
    const gesagt = vi.mocked(speakUi).mock.calls.map((c) => String(c[0])).join(" | ");
    expect(gesagt).toMatch(/gewählt/);
  });
});

describe("(b) die Auswahl-Tastatur mit drei Ebenen", () => {
  it("Reiter Normal / Mit Umschalt / Mit AltGr in einer tablist", () => {
    dialog();
    const liste = screen.getByRole("tablist");
    const reiter = within(liste).getAllByRole("tab").map((r) => r.textContent);
    expect(reiter).toEqual(["Normal", "Mit Umschalt", "Mit AltGr"]);
    expect(screen.getByRole("tab", { name: "Normal" }).getAttribute("aria-selected")).toBe("true");
  });

  it("Normal zeigt die Tasten (ö, ß ...) als Knöpfe mit aria-pressed", () => {
    dialog();
    const tafel = screen.getByRole("tabpanel");
    const oe = tafel.querySelector('button[data-zeichen="ö"]') as HTMLButtonElement;
    expect(oe).toBeTruthy();
    expect(oe.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(oe);
    expect(oe.getAttribute("aria-pressed")).toBe("true");
    expect(chips().map((c) => c.textContent)).toEqual(["ö"]);
    fireEvent.click(oe);
    expect(oe.getAttribute("aria-pressed")).toBe("false");
  });

  it("Mit Umschalt zeigt die Symbole (! ? § ...), Mit AltGr @ € { ...", () => {
    dialog();
    fireEvent.click(screen.getByRole("tab", { name: "Mit Umschalt" }));
    let tafel = screen.getByRole("tabpanel");
    for (const z of ["!", "?", "§", "%"]) expect(tafel.querySelector(`button[data-zeichen="${z}"]`), z).toBeTruthy();
    // Gegenprobe: Buchstaben mit Umschalt sind dasselbe Zeichen wie ohne - nicht doppelt angeboten.
    expect(tafel.querySelector('button[data-zeichen="Ö"]')).toBeNull();
    fireEvent.click(screen.getByRole("tab", { name: "Mit AltGr" }));
    tafel = screen.getByRole("tabpanel");
    for (const z of ["@", "€", "{", "|"]) expect(tafel.querySelector(`button[data-zeichen="${z}"]`), z).toBeTruthy();
  });

  it("leere Stellen einer Ebene sind keine Knöpfe", () => {
    dialog();
    fireEvent.click(screen.getByRole("tab", { name: "Mit AltGr" }));
    const tafel = screen.getByRole("tabpanel");
    // Auf der deutschen Tastatur liegen auf AltGr nur wenige Zeichen - weit weniger als Tasten.
    expect(tafel.querySelectorAll("button").length).toBeLessThan(15);
    expect(tafel.querySelectorAll("button").length).toBeGreaterThan(5);
  });

  it("(g) die eingestellte Tastatur bestimmt das Angebot: US-Tastatur hat kein ö, aber auch ein Tipp darauf wird verworfen", () => {
    setLayout("us");
    dialog();
    const tafel = screen.getByRole("tabpanel");
    expect(tafel.querySelector('button[data-zeichen="ö"]')).toBeNull();
    expect(tafel.querySelector('button[data-zeichen="a"]')).toBeTruthy();
    druecke("ö");
    expect(chips()).toHaveLength(0);
    expect(screen.getByText("Dieses Zeichen gibt es auf deiner Tastatur nicht.")).toBeTruthy();
  });
});

describe("(c) höchstens 8", () => {
  it("das 9. wird nicht aufgenommen - der Dialog sagt warum, nichts ist disabled", () => {
    dialog();
    for (const z of "asdfghjk") druecke(z);
    expect(chips()).toHaveLength(8);
    druecke("l");
    expect(chips()).toHaveLength(8);
    expect(screen.getByText("Höchstens 8 Tasten - nimm zuerst eine weg.")).toBeTruthy();
    const gesagt = vi.mocked(speakUi).mock.calls.map((c) => String(c[0]));
    expect(gesagt).toContain("Höchstens 8 Tasten - nimm zuerst eine weg.");
    // Nichts wird je `disabled` (R-Regel): kein Knopf des Dialogs trägt das Attribut.
    expect(document.querySelectorAll("[disabled]")).toHaveLength(0);
    // Eines weg, dann geht ein neues.
    fireEvent.click(chips()[0]);
    druecke("l");
    expect(chips()).toHaveLength(8);
  });
});

describe("(d) Fertig, Alle entfernen, Wie oft / Wie lange", () => {
  it("Fertig gibt Zeichen, Anteil und Dauer zurück und schliesst", () => {
    const { onSpeichern, onSchliessen } = dialog();
    druecke("ö");
    druecke("ä");
    fireEvent.click(screen.getByRole("button", { name: "Nur diese" }));
    fireEvent.click(screen.getByRole("button", { name: "Fertig" }));
    expect(onSpeichern).toHaveBeenCalledWith({ zeichen: ["ö", "ä"], anteil: "nur", bis: null });
    expect(onSchliessen).toHaveBeenCalled();
  });

  it("„Nur heute\" setzt bis auf das heutige Datum", () => {
    const { onSpeichern } = dialog();
    druecke("ö");
    fireEvent.click(screen.getByRole("button", { name: "Nur heute" }));
    fireEvent.click(screen.getByRole("button", { name: "Fertig" }));
    const g = onSpeichern.mock.calls[0][0] as Gezielt;
    expect(g.bis).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const d = new Date();
    expect(g.bis).toBe(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  });

  it("ohne Zeichen speichert Fertig `null` (= aus)", () => {
    const { onSpeichern } = dialog({ zeichen: ["ö"], anteil: "viel", bis: null });
    fireEvent.click(screen.getByRole("button", { name: "Alle entfernen" }));
    expect(chips()).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: "Fertig" }));
    expect(onSpeichern).toHaveBeenCalledWith(null);
  });

  it("der gespeicherte Stand kommt zurück in den Dialog (Zeichen, Anteil)", () => {
    dialog({ zeichen: ["ö", "ß"], anteil: "wenig", bis: null });
    expect(chips().map((c) => c.textContent)).toEqual(["ö", "ß"]);
    expect(screen.getByRole("button", { name: "Ein wenig" })).toHaveAttribute("aria-pressed", "true");
  });

  it("der Vorschlag aus den wackligen Tasten: „Diese dazunehmen\"; ohne Vorschlag gibt es die Zeile nicht", () => {
    cleanup();
    dialog(null, ["ü", "ß"]);
    expect(screen.getByText("Hier greifst du oft daneben:")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Diese dazunehmen" }));
    expect(chips().map((c) => c.textContent)).toEqual(["ü", "ß"]);
    // Alles genommen - die Zeile verschwindet.
    expect(screen.queryByText("Hier greifst du oft daneben:")).toBeNull();
    cleanup();
    dialog(null, []);
    expect(screen.queryByText("Hier greifst du oft daneben:")).toBeNull();
  });
});

describe("(e) Escape und Fokus", () => {
  it("Escape schliesst den Dialog und der Fokus geht an den Öffner zurück", async () => {
    function Seite() {
      const [offen, setOffen] = useState(false);
      return (
        <div>
          <button onClick={() => setOffen(true)}>Tasten wählen …</button>
          {offen && <GezieltDialog start={null} onSpeichern={() => {}} onSchliessen={() => setOffen(false)} />}
        </div>
      );
    }
    render(<Seite />);
    const opener = screen.getByRole("button", { name: "Tasten wählen …" });
    opener.focus();
    fireEvent.click(opener);
    expect(screen.getByRole("dialog")).toBeTruthy();
    // Beim Öffnen steht der Fokus im Feld „Taste drücken".
    await waitFor(() => expect(document.activeElement).toBe(feld()));
    fireEvent.keyDown(feld(), { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(opener);
  });

  it("★ über einem zweiten Modal (dem Zahnrad) schliesst Escape NUR den Dialog", async () => {
    const aussenZu = vi.fn();
    function Seite() {
      const [offen, setOffen] = useState(false);
      return (
        <Modal title="Einstellungen" onClose={aussenZu}>
          <button onClick={() => setOffen(true)}>Tasten wählen …</button>
          {offen && <GezieltDialog start={null} onSpeichern={() => {}} onSchliessen={() => setOffen(false)} />}
        </Modal>
      );
    }
    render(<Seite />);
    const opener = screen.getByRole("button", { name: "Tasten wählen …" });
    opener.focus();
    fireEvent.click(opener);
    await waitFor(() => expect(document.activeElement).toBe(feld()));
    fireEvent.keyDown(feld(), { key: "Escape" });
    await waitFor(() => expect(screen.queryByLabelText("Taste drücken")).toBeNull());
    expect(aussenZu).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(opener);
  });

  it("★ Tab bleibt im Dialog (auch über dem Zahnrad): vom letzten Knopf zurück zum ersten", async () => {
    function Seite() {
      const [offen, setOffen] = useState(false);
      return (
        <Modal title="Einstellungen" onClose={() => {}}>
          <button onClick={() => setOffen(true)}>Tasten wählen …</button>
          {offen && <GezieltDialog start={null} onSpeichern={() => {}} onSchliessen={() => {}} />}
        </Modal>
      );
    }
    render(<Seite />);
    fireEvent.click(screen.getByRole("button", { name: "Tasten wählen …" }));
    await waitFor(() => expect(document.activeElement).toBe(feld()));
    const dialoge = screen.getAllByRole("dialog");
    const innen = dialoge[dialoge.length - 1];
    const knoepfe = [...innen.querySelectorAll<HTMLElement>("button, input")];
    const letzter = knoepfe[knoepfe.length - 1];
    letzter.focus();
    const ereignis = fireEvent.keyDown(letzter, { key: "Tab" });
    // Der Dialog fängt Tab selbst (preventDefault) und springt ans Ende des Kreises zurück.
    expect(ereignis).toBe(false);
    expect(document.activeElement).toBe(knoepfe[0]);
  });
});

describe("(f) Speichern: Selbstlernende über das Konto, Gäste über das Gerät", () => {
  it("Gast: das Gerät merkt sich die Wahl (localStorage tippen-gezielt)", async () => {
    const { useDeviceGezielt } = await import("../src/lib/typing/gezieltGeraet");
    act(() => useDeviceGezielt.getState().setGezielt({ zeichen: ["ö", "ä"], anteil: "viel", bis: null }));
    expect(JSON.parse(localStorage.getItem("tippen-gezielt") ?? "null")).toEqual({ zeichen: ["ö", "ä"], anteil: "viel", bis: null });
    act(() => useDeviceGezielt.getState().setGezielt(null));
    expect(localStorage.getItem("tippen-gezielt")).toBeNull();
  });

  it("Selbstlernende: `setGezielt` am Backend schreibt es ans Konto (lokaler Speicher)", async () => {
    const acc = await import("../src/lib/typing/account");
    const { typingBackend, _resetTypingBackend } = await import("../src/lib/typing");
    _resetTypingBackend();
    localStorage.clear();
    const t = acc.registerTeacher("Frau Test", `t${Math.random()}@example.org`, "geheim123");
    if (!t.ok) throw new Error(t.error);
    const k = acc.createClass(t.value.id, "3a", "3A");
    if (!k.ok) throw new Error(k.error);
    const p = acc.addPupil("3A", "Mia", "pw1234");
    if (!p.ok) throw new Error(p.error);
    const kind = p.value;
    const neu = await typingBackend().setGezielt(kind.id, { zeichen: ["ö", "ö", "ß"], anteil: "nur", bis: null });
    expect(neu?.gezielt).toEqual({ zeichen: ["ö", "ß"], anteil: "nur", bis: null });
    const aus = await typingBackend().setGezielt(kind.id, null);
    expect(aus?.gezielt).toBeNull();
  });
});
