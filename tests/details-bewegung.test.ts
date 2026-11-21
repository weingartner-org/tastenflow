/**
 * Wächter für `detailsBewegung` (Johannes 19.09.2026: „der Rest rutscht nach
 * unten und der andere kommt nach … das würde überall helfen").
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { detailsBewegungEinschalten } from "../src/lib/detailsBewegung";

type Lauf = { keyframes: Keyframe[]; onfinish: (() => void) | null; cancel: ReturnType<typeof vi.fn> };
let laeufe: Lauf[] = [];
let aus: () => void = () => {};

function baue(html: string) {
  document.body.innerHTML = html;
  return document.querySelector("details") as HTMLDetailsElement;
}

function klick(el: Element) {
  const e = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
  el.dispatchEvent(e);
  return e;
}

beforeEach(() => {
  aus = detailsBewegungEinschalten();
});

afterEach(() => {
  aus();
  delete (HTMLElement.prototype as unknown as { animate?: unknown }).animate;
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("ohne Web-Animation (jsdom)", () => {
  it("lässt den Klick dem Browser", () => {
    const d = baue("<details><summary>Kopf</summary><p>Inhalt</p></details>");
    const e = klick(d.querySelector("summary")!);
    expect(e.defaultPrevented).toBe(false);
  });
});

describe("mit Web-Animation", () => {
  beforeEach(() => {
    laeufe = [];
    (HTMLElement.prototype as unknown as { animate: unknown }).animate = function (keyframes: Keyframe[]) {
      const lauf: Lauf = { keyframes, onfinish: null, cancel: vi.fn() };
      laeufe.push(lauf);
      return lauf;
    };
    let hoehe = 40;
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      if (this instanceof HTMLDetailsElement) hoehe = this.open ? 200 : 40;
      return { height: hoehe, width: 300, x: 0, y: 0, top: 0, left: 0, right: 300, bottom: hoehe, toJSON: () => ({}) } as DOMRect;
    });
  });

  it("öffnet sofort (open steht gleich) und lässt die Höhe wachsen", () => {
    const d = baue("<details><summary>Kopf</summary><p>Inhalt</p></details>");
    const e = klick(d.querySelector("summary")!);
    expect(e.defaultPrevented).toBe(true);
    expect(d.open).toBe(true);
    expect(laeufe).toHaveLength(1);
    expect(laeufe[0].keyframes[0].height).toBe("40px");
    expect(laeufe[0].keyframes[1].height).toBe("200px");
    expect(d.style.overflow).toBe("clip");
    laeufe[0].onfinish?.();
    expect(d.style.overflow).toBe("");
  });

  it("schließt erst am Ende der Bewegung - auf die gemessene Zu-Höhe", () => {
    const d = baue("<details><summary>Kopf</summary><p>Inhalt</p></details>");
    const summary = d.querySelector("summary")!;
    klick(summary);
    laeufe[0].onfinish?.();
    klick(summary);
    expect(d.open).toBe(true);
    expect(laeufe[1].keyframes[1].height).toBe("40px");
    laeufe[1].onfinish?.();
    expect(d.open).toBe(false);
    expect(laeufe[1].cancel).toHaveBeenCalled();
  });

  it("ein zweiter Klick mitten in der Bewegung kehrt sie um", () => {
    const d = baue("<details><summary>Kopf</summary><p>Inhalt</p></details>");
    const summary = d.querySelector("summary")!;
    klick(summary);
    klick(summary);
    expect(laeufe[0].cancel).toHaveBeenCalled();
    expect(laeufe[1].keyframes[1].height).toBe("40px");
    // Das Ende der abgebrochenen Öffnung stört nicht.
    laeufe[0].onfinish?.();
    expect(d.style.overflow).toBe("clip");
  });

  it("Klassen mit Schrägstrich (group/tasten) stören die Suche nach der summary nicht", () => {
    const d = baue('<details class="group/tasten"><summary class="group-open/tasten:mb-2">Kopf</summary><p>Inhalt</p></details>');
    const e = klick(d.querySelector("summary")!);
    expect(e.defaultPrevented).toBe(true);
    expect(d.open).toBe(true);
  });

  it("Schalter in der summary, fremdes preventDefault und data-ohne-bewegung bleiben unberührt", () => {
    const d = baue('<details><summary>Kopf <button type="button">X</button></summary><p>Inhalt</p></details>');
    expect(klick(d.querySelector("button")!).defaultPrevented).toBe(false);

    const d2 = baue("<details data-ohne-bewegung><summary>Kopf</summary></details>");
    expect(klick(d2.querySelector("summary")!).defaultPrevented).toBe(false);

    const d3 = baue("<details><summary>Kopf</summary></details>");
    d3.querySelector("summary")!.addEventListener("click", (ev) => ev.preventDefault());
    klick(d3.querySelector("summary")!);
    expect(laeufe).toHaveLength(0);
  });
});

describe("schwebender Inhalt (Menü in einer details)", () => {
  it("wächst die Zeile nicht, gibt es keine Bewegung und nichts wird zurückgehalten", () => {
    laeufe = [];
    (HTMLElement.prototype as unknown as { animate: unknown }).animate = function (keyframes: Keyframe[]) {
      const lauf: Lauf = { keyframes, onfinish: null, cancel: vi.fn() };
      laeufe.push(lauf);
      return lauf;
    };
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      height: 40, width: 300, x: 0, y: 0, top: 0, left: 0, right: 300, bottom: 40, toJSON: () => ({}),
    } as DOMRect);
    const d = baue('<details><summary>Menü</summary><div style="position:absolute">Eintrag</div></details>');
    const summary = d.querySelector("summary")!;
    klick(summary);
    expect(d.open).toBe(true);
    expect(d.style.overflow).toBe("");
    klick(summary);
    expect(d.open).toBe(false);
    expect(laeufe).toHaveLength(0);
  });
});
