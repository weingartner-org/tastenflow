/**
 * ★ WÄCHTER: Der Hinweis geht aus der Mausspitze auf (Johannes, 30.09.2026:
 * „wie bei Google Mail, dass das Fenster von der Mausspitze aufgeht").
 *
 * Rot wird er, wenn
 *  (a) der Kasten wieder aus einer festen Ecke aufgeht statt aus der Maus,
 *  (b) er bei Tastatur-Fokus aus einer Mausspitze aufgeht, die gar nicht auf
 *      dem Knopf steht,
 *  (c) das Aufgehen an „weniger Bewegung" vorbei läuft.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { aufgehPunkt } from "@/components/typing/Zeigerhinweis";
import { Tipp } from "@/components/Tipp";

afterEach(cleanup);

const anker = { left: 100, right: 140, top: 20, bottom: 60, width: 40, height: 40 };

describe("aufgehPunkt", () => {
  it("★★★ Maus auf dem Knopf: aus der Mausspitze, in Pixeln des Kastens", () => {
    const p = aufgehPunkt({ zeiger: { x: 130, y: 45 }, anker, platz: { links: 90, oben: 64, nachOben: false }, kastenHoehe: 30 });
    expect(p).toEqual({ x: 40, y: -19 });
  });

  it("★★ Maus woanders (Tastatur): aus der Mitte des Knopfs, an der zugewandten Kante", () => {
    const unten = aufgehPunkt({ zeiger: { x: 500, y: 500 }, anker, platz: { links: 90, oben: 64, nachOben: false }, kastenHoehe: 30 });
    expect(unten).toEqual({ x: 30, y: 0 });
    const oben = aufgehPunkt({ zeiger: null, anker, platz: { links: 90, oben: -14, nachOben: true }, kastenHoehe: 30 });
    expect(oben).toEqual({ x: 30, y: 30 });
  });
});

describe("Der Kasten", () => {
  it("★★★ geht auf (scale), zu ist er klein und unsichtbar - und bei weniger Bewegung ohne Übergang", () => {
    render(<Tipp text="Hilfe (Alt + H)">{(id) => <button aria-describedby={id}>?</button>}</Tipp>);
    const kasten = document.querySelector("[data-hinweis-kasten]") as HTMLElement;
    expect(kasten.className).toMatch(/\binvisible\b/);
    expect(kasten.className).toMatch(/\bscale-75\b/);
    expect(kasten.className).toMatch(/motion-reduce:transition-none/);

    fireEvent.mouseOver(screen.getByRole("button"), { clientX: 5, clientY: 5 });
    fireEvent.mouseEnter(screen.getByRole("button").parentElement as HTMLElement);
    expect(kasten.className).toMatch(/\bscale-100\b/);
    expect(kasten.style.transformOrigin).toMatch(/px .*px/);
  });
});

/* ══ Jeder `title` der Plattform (Johannes: „natürlich auf der ganzen Plattform!") ══ */

import { useState } from "react";
import { act } from "@testing-library/react";
import { TitelHinweis } from "@/components/TitelHinweis";

function zeiger(art: "over" | "out", el: Element, dazu: Record<string, unknown> = {}) {
  const e = new Event(art === "over" ? "pointerover" : "pointerout", { bubbles: true });
  Object.assign(e, { pointerType: "mouse", relatedTarget: null, ...dazu });
  act(() => { el.dispatchEvent(e); });
}
const titelKasten = () => document.querySelector("[data-titel-hinweis]") as HTMLElement;

describe("TitelHinweis", () => {
  it("★★★ Maus auf einem title: großer Hinweis statt des Browser-Hinweises - danach alles wie vorher", () => {
    render(<><TitelHinweis /><button title="Hilfe zur Lernwerkstatt">?</button></>);
    const knopf = screen.getByRole("button");
    zeiger("over", knopf);
    expect(titelKasten().textContent).toBe("Hilfe zur Lernwerkstatt");
    expect(titelKasten().className).toMatch(/\bscale-100\b/);
    expect(knopf.hasAttribute("title")).toBe(false); // der Browser zeigt seinen nicht
    zeiger("out", knopf);
    expect(titelKasten().className).toMatch(/\binvisible\b/);
    expect(knopf.getAttribute("title")).toBe("Hilfe zur Lernwerkstatt");
    expect(knopf.hasAttribute("data-titel")).toBe(false);
  });

  it("★★★ der Name geht nie verloren: ein Knopf, dessen Name nur der title war, heißt weiter so", () => {
    render(<><TitelHinweis /><button title="Melden"><svg aria-hidden="true" /></button></>);
    const knopf = screen.getByRole("button", { name: "Melden" });
    zeiger("over", knopf);
    expect(screen.getByRole("button", { name: "Melden" })).toBe(knopf);
    zeiger("out", knopf);
    expect(knopf.hasAttribute("aria-label")).toBe(false);
  });

  it("★★ ändert das Programm den title, während die Maus darauf steht, zieht der Hinweis nach", async () => {
    function Schalter() {
      const [an, setAn] = useState(true);
      return <button title={an ? "Sounds sind an" : "Sounds sind aus"} onClick={() => setAn((v) => !v)}>Ton</button>;
    }
    render(<><TitelHinweis /><Schalter /></>);
    const knopf = screen.getByRole("button");
    zeiger("over", knopf);
    expect(titelKasten().textContent).toBe("Sounds sind an");
    act(() => { knopf.click(); });
    await new Promise((r) => setTimeout(r, 0));
    expect(titelKasten().textContent).toBe("Sounds sind aus");
    expect(knopf.hasAttribute("title")).toBe(false);
    zeiger("out", knopf);
    expect(knopf.getAttribute("title")).toBe("Sounds sind aus");
  });

  it("★★ ein Finger bekommt nichts Neues", () => {
    render(<><TitelHinweis /><button title="Hilfe">?</button></>);
    const knopf = screen.getByRole("button");
    zeiger("over", knopf, { pointerType: "touch" });
    expect(knopf.getAttribute("title")).toBe("Hilfe");
    expect(titelKasten().className).toMatch(/\binvisible\b/);
  });
});

describe("TitelHinweis beim Klick", () => {
  it("★★ ein Klick verbirgt den Hinweis, der title bleibt aber weg, bis die Maus geht", () => {
    render(<><TitelHinweis /><button title="Hilfe">?</button></>);
    const knopf = screen.getByRole("button");
    zeiger("over", knopf);
    act(() => { knopf.dispatchEvent(new Event("pointerdown", { bubbles: true })); });
    expect(titelKasten().className).toMatch(/\binvisible\b/);
    expect(knopf.hasAttribute("title")).toBe(false);
    zeiger("out", knopf);
    expect(knopf.getAttribute("title")).toBe("Hilfe");
  });
});
