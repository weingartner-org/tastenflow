/**
 * Wächter für `aufklappBewegung` (Johannes 28.09.2026: „alles, was oben
 * ausgeklappt ist, bei dem der Rest nach unten rutscht, braucht einen Effekt").
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { aufklappBewegungEinschalten } from "../src/lib/aufklappBewegung";

type Lauf = { el: HTMLElement; keyframes: Keyframe[]; onfinish: (() => void) | null };
let laeufe: Lauf[] = [];
let aus: () => void = () => {};

const zug = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
  aus = aufklappBewegungEinschalten();
});

afterEach(() => {
  aus();
  delete (HTMLElement.prototype as unknown as { animate?: unknown }).animate;
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

function oeffne(schalter: HTMLElement, bereich?: HTMLElement, wohin?: HTMLElement) {
  schalter.setAttribute("aria-expanded", "true");
  if (bereich) (wohin ?? schalter.parentElement!).appendChild(bereich);
}

function bereich(text = "Inhalt") {
  const d = document.createElement("div");
  d.textContent = text;
  return d;
}

describe("ohne Web-Animation (jsdom)", () => {
  it("tut nichts", async () => {
    document.body.innerHTML = `<section><button aria-expanded="false">Mehr</button></section>`;
    const b = bereich();
    oeffne(document.querySelector("button")!, b);
    await zug();
    expect(b.style.overflow).toBe("");
  });
});

describe("mit Web-Animation", () => {
  beforeEach(() => {
    laeufe = [];
    (HTMLElement.prototype as unknown as { animate: unknown }).animate = function (
      this: HTMLElement,
      keyframes: Keyframe[],
    ) {
      const lauf: Lauf = { el: this, keyframes, onfinish: null };
      laeufe.push(lauf);
      return lauf;
    };
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      height: 120, width: 300, x: 0, y: 0, top: 0, left: 0, right: 300, bottom: 120, toJSON: () => ({}),
    } as DOMRect);
  });

  it("ohne aria-controls: der neue Bereich neben dem Schalter wächst von 0", async () => {
    document.body.innerHTML = `<section><div><button aria-expanded="false">Mehr</button></div></section>`;
    const b = bereich();
    oeffne(document.querySelector("button")!, b, document.querySelector("section")!);
    await zug();
    expect(laeufe).toHaveLength(1);
    expect(laeufe[0].el).toBe(b);
    expect(laeufe[0].keyframes[0].height).toBe("0px");
    expect(laeufe[0].keyframes[1].height).toBe("120px");
    expect(b.style.overflow).toBe("clip");
    laeufe[0].onfinish?.();
    expect(b.style.overflow).toBe("");
  });

  it("mit aria-controls: der Bereich, der sichtbar wird", async () => {
    document.body.innerHTML = `<button aria-expanded="false" aria-controls="z">Mehr</button><main><div id="z" hidden>Inhalt</div></main>`;
    const z = document.getElementById("z")!;
    document.querySelector("button")!.setAttribute("aria-expanded", "true");
    z.hidden = false;
    await zug();
    expect(laeufe.map((l) => l.el)).toEqual([z]);
  });

  it("nur die oberste Ebene wächst, nicht jedes Kind einzeln", async () => {
    document.body.innerHTML = `<section><button aria-expanded="false">Mehr</button></section>`;
    const aussen = bereich();
    aussen.appendChild(bereich("innen"));
    oeffne(document.querySelector("button")!, aussen);
    await zug();
    expect(laeufe.map((l) => l.el)).toEqual([aussen]);
  });

  it("Schwebendes (Menü) bleibt, wie es ist", async () => {
    document.body.innerHTML = `<section><button aria-expanded="false">Menü</button></section>`;
    const menue = bereich();
    menue.style.position = "absolute";
    oeffne(document.querySelector("button")!, menue);
    await zug();
    expect(laeufe).toHaveLength(0);
  });

  it("<Aufklappen> und data-ohne-bewegung werden nicht doppelt bewegt", async () => {
    document.body.innerHTML = `<section><button aria-expanded="false">A</button></section><section data-ohne-bewegung><button aria-expanded="false">B</button></section>`;
    const a = bereich();
    a.setAttribute("data-aufklappen", "offen");
    const [s1, s2] = Array.from(document.querySelectorAll("button"));
    oeffne(s1, a);
    oeffne(s2, bereich());
    await zug();
    expect(laeufe).toHaveLength(0);
  });

  it("Zuklappen bewegt nichts, und ein fremder neuer Knoten weit weg auch nicht", async () => {
    document.body.innerHTML = `<main><section><div><div><div><div><button aria-expanded="true">X</button></div></div></div></div></section><aside></aside></main>`;
    document.querySelector("button")!.setAttribute("aria-expanded", "false");
    document.querySelector("aside")!.appendChild(bereich());
    await zug();
    expect(laeufe).toHaveLength(0);
  });

  it("bei „weniger Bewegung\" nichts", async () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
    document.body.innerHTML = `<section><button aria-expanded="false">Mehr</button></section>`;
    oeffne(document.querySelector("button")!, bereich());
    await zug();
    expect(laeufe).toHaveLength(0);
  });
});
