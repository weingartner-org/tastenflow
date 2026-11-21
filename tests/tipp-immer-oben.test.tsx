/**
 * ★★★★★ WÄCHTER K1: DER HINWEIS LIEGT IMMER OBEN (19.09.2026)
 * ============================================================================
 *
 * Johannes, mit Bildschirmfoto: *„dieses Problem gibt es ganz oft: die
 * Einblendung von Mouseover ist halb verdeckt, also nicht im Vordergrund"* -
 * der Hinweis von „Als Excel herunterladen" lag unter der blauen
 * Gruppenzeile „Üben"/„Prüfung" der Tabelle. Gemessen: Kasten `z-30` gegen
 * klebende Kopfzellen `z-30`, bei Gleichstand gewinnt der spätere im DOM.
 * Und „Melden" stand bei 375 px 61 px links aus dem Bild. Befund und Antwort:
 * Kopf von `src/components/typing/Zeigerhinweis.tsx`.
 *
 * ⚠️ WAS DIESER TEST BEWEIST - UND WAS NICHT ([[feedback_gruener_waechter_beweist_was]]):
 * jsdom rechnet kein Layout und kennt keine Tailwind-Klassen. Ob ein Kasten
 * im echten Browser OBEN liegt, zeigt nur `elementFromPoint` in Chrome (mit
 * `pointer-events: auto` am Kasten - sonst findet es ihn nie). Hier steht die
 * URSACHE unter Wache:
 *   1. Der Kasten hängt per Portal in der Ebene unter `<body>`, nicht mehr in
 *      der Hülle - kein Vorfahre kann ihn überdecken oder abschneiden.
 *   2. Er behält Id, `role="tooltip"` und `aria-describedby` zeigt auf ihn,
 *      auch zugeklappt (er steht immer im Baum).
 *   3. Er erbt, was er am alten Ort geerbt hätte: `aria-hidden` und `lang`.
 *   4. Seine Ebene: über der Seite, unter einem offenen Fenster - im Fenster
 *      eine Stufe über dem Fenster (`ebeneUeber`, mit Inline-Stilen, weil
 *      jsdom Klassen nicht auflöst).
 *   5. Die Rechnung, wo er steht (`platziereHinweis`, rein, ohne DOM): nie
 *      aus dem Fenster, 8 px Rand, Umklappen, Klemmen - mit den gemessenen
 *      Zahlen aus dem Browser.
 *   6. Solange er offen ist, folgt er dem Anker beim Rollen; zu → kein Horcher.
 */
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tipp } from "@/components/Tipp";
import { Modal } from "@/components/Modal";
import {
  HINWEIS_EBENE,
  HINWEIS_EBENE_ID,
  HINWEIS_RAND,
  Hinweisflaeche,
  ebeneUeber,
  hoechstBreite,
  platziereHinweis,
} from "@/components/typing/Zeigerhinweis";

function knopfMitTipp(text = "Hilfe (Alt + H)", ausrichtung?: "links" | "rechts") {
  return (
    <Tipp text={text} ausrichtung={ausrichtung}>
      {(id) => (
        <button type="button" aria-describedby={id}>
          Hilfe
        </button>
      )}
    </Tipp>
  );
}

function kastenVon(knopf: HTMLElement): HTMLElement {
  const id = knopf.getAttribute("aria-describedby");
  expect(id, "Knopf ohne aria-describedby").toBeTruthy();
  const kasten = document.getElementById(id!);
  expect(kasten, "aria-describedby zeigt ins Leere").toBeTruthy();
  return kasten!;
}

describe("K1: der Kasten hängt unter <body>, nicht in der Hülle", () => {
  it("Tipp: Portal in die Ebene, Id bleibt, aria-describedby löst auf - auch zugeklappt", () => {
    const { container } = render(knopfMitTipp());
    const knopf = screen.getByRole("button", { name: "Hilfe" });
    const kasten = kastenVon(knopf);
    expect(kasten.getAttribute("role")).toBe("tooltip");
    expect(kasten.textContent).toBe("Hilfe (Alt + H)");
    // Nicht in der Hülle, sondern in der Ebene direkt unter <body>.
    expect(container.contains(kasten)).toBe(false);
    const ebene = document.getElementById(HINWEIS_EBENE_ID)!;
    expect(ebene.parentElement).toBe(document.body);
    expect(kasten.parentElement).toBe(ebene);
    // In der Hülle steht die Marke mit derselben Id.
    const marke = container.querySelector("[data-hinweis-anker]") as HTMLElement;
    expect(marke.getAttribute("data-hinweis-anker")).toBe(kasten.id);
    expect(marke.hidden).toBe(true);
    // Zugeklappt: im Baum, aber unsichtbar - und `fixed`, ohne Mausfang.
    expect(kasten.className).toContain("invisible");
    expect(kasten.className).toContain("fixed");
    expect(kasten.className).toContain("pointer-events-none");
    expect(kasten.className).toContain(`z-[${HINWEIS_EBENE}]`);
    // Die Ebene selbst macht keinen Stapelkontext (keine Lage, kein z-index).
    expect(ebene.getAttribute("style")).toBeNull();
    expect(ebene.className).toBe("");
  });

  it("Fokus öffnet, Escape schickt weg, Blur schliesst - der Kasten bleibt im Baum", () => {
    render(knopfMitTipp());
    const knopf = screen.getByRole("button", { name: "Hilfe" });
    const kasten = kastenVon(knopf);
    act(() => knopf.focus());
    expect(kasten.className).toContain("visible");
    expect(kasten.className).not.toContain("invisible");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(kasten.className).toContain("invisible");
    act(() => knopf.blur());
    expect(document.getElementById(kasten.id)).toBe(kasten);
  });

  it("Abbauen nimmt den Kasten aus der Ebene - es bleibt kein Waisenkind", () => {
    const { unmount } = render(knopfMitTipp("Einmalig"));
    const id = screen.getByRole("button", { name: "Hilfe" }).getAttribute("aria-describedby")!;
    expect(document.getElementById(id)).toBeTruthy();
    unmount();
    expect(document.getElementById(id)).toBeNull();
  });

  it("Tipp IM Fenster (Modal, selbst ein Portal): Kasten in der Ebene, nicht im Dialog, Verweis löst auf", () => {
    render(
      <Modal title="Einstellungen" onClose={() => {}}>
        {knopfMitTipp("Im Fenster")}
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    const knopf = screen.getByRole("button", { name: "Hilfe" });
    const kasten = kastenVon(knopf);
    expect(dialog.contains(knopf)).toBe(true);
    expect(dialog.contains(kasten)).toBe(false);
    expect(kasten.parentElement?.id).toBe(HINWEIS_EBENE_ID);
  });

  it("Hinweisflaeche: der Kasten erbt das aria-hidden seiner Hülle", () => {
    render(
      <ul>
        <Hinweisflaeche hilfe="27. Texte: noch gesperrt" role="listitem">
          27
        </Hinweisflaeche>
      </ul>,
    );
    const marke = document.querySelector("[data-hinweis-anker]")!;
    const kasten = document.getElementById(marke.getAttribute("data-hinweis-anker")!)!;
    expect(kasten.getAttribute("aria-hidden")).toBe("true");
  });

  it("Tipp ohne aria-hidden-Vorfahren trägt kein aria-hidden", () => {
    render(knopfMitTipp());
    const kasten = kastenVon(screen.getByRole("button", { name: "Hilfe" }));
    expect(kasten.hasAttribute("aria-hidden")).toBe(false);
  });

  it("die Sprache kommt mit: ein Tipp in einem lang=\"en\"-Bereich bekommt lang=\"en\"", () => {
    document.documentElement.setAttribute("lang", "de");
    render(
      <div lang="en">
        {knopfMitTipp("Help (Alt + H)")}
      </div>,
    );
    const kasten = kastenVon(screen.getByRole("button", { name: "Hilfe" }));
    expect(kasten.getAttribute("lang")).toBe("en");
  });

  it("ein ausdrücklich deutscher Bereich (Sprachschalter „Deutsch“) bleibt ausdrücklich deutsch", () => {
    document.documentElement.setAttribute("lang", "de");
    render(
      <div lang="en">
        <span lang="de">{knopfMitTipp("Deutsch")}</span>
      </div>,
    );
    const kasten = kastenVon(screen.getByRole("button", { name: "Hilfe" }));
    expect(kasten.getAttribute("lang")).toBe("de");
  });

  it("... und ohne eigenen Bereich (nur <html lang>) trägt er keine eigene", () => {
    document.documentElement.setAttribute("lang", "de");
    render(knopfMitTipp());
    const kasten = kastenVon(screen.getByRole("button", { name: "Hilfe" }));
    expect(kasten.hasAttribute("lang")).toBe(false);
  });
});

describe("K1: die Ebene - über der Seite, unter einem offenen Fenster, im Fenster darüber", () => {
  afterEach(() => {
    document.querySelectorAll("[data-test-ebene]").forEach((e) => e.remove());
  });

  function baue(stile: Array<Partial<CSSStyleDeclaration>>): HTMLElement {
    let eltern: HTMLElement = document.body;
    for (const s of stile) {
      const el = document.createElement("div");
      Object.assign(el.style, s);
      if (eltern === document.body) el.setAttribute("data-test-ebene", "");
      eltern.appendChild(el);
      eltern = el;
    }
    const anker = document.createElement("span");
    eltern.appendChild(anker);
    return anker;
  }

  it("ohne Ebene ringsum: HINWEIS_EBENE (45) - über Tabellenköpfen (30/35) und Seitenkopf (40)", () => {
    expect(HINWEIS_EBENE).toBeGreaterThan(40);
    expect(HINWEIS_EBENE).toBeLessThan(50);
    expect(ebeneUeber(baue([{ position: "relative" }]))).toBe(HINWEIS_EBENE);
  });

  it("in der klebenden Seiten-Kopfzeile (sticky, z 40): bleibt bei 45", () => {
    expect(ebeneUeber(baue([{ position: "sticky", zIndex: "40" }]))).toBe(HINWEIS_EBENE);
  });

  it("in einer klebenden Tabellen-Kopfzelle (z 30) in einem Rollkasten: 45", () => {
    expect(
      ebeneUeber(baue([{ position: "relative", overflow: "auto" }, { position: "sticky", zIndex: "30" }])),
    ).toBe(HINWEIS_EBENE);
  });

  it("im Fenster (Modal: fixed, z 50): 51 - über dem Fenster", () => {
    expect(ebeneUeber(baue([{ position: "fixed", zIndex: "50" }]))).toBe(51);
  });

  it("es zählt der ÄUSSERSTE Vorfahre: z 10 im Fenster ergibt 51, nicht 11", () => {
    expect(
      ebeneUeber(baue([{ position: "fixed", zIndex: "50" }, { position: "relative", zIndex: "10" }])),
    ).toBe(51);
  });

  it("in der Feier (fixed, z 60): 61", () => {
    expect(ebeneUeber(baue([{ position: "fixed", zIndex: "60" }]))).toBe(61);
  });

  it("ein z-index ohne Lage zählt nicht (er wirkt dort auch nicht)", () => {
    expect(ebeneUeber(baue([{ zIndex: "80" }]))).toBe(HINWEIS_EBENE);
  });

  it("ein offener Tipp in einem Fenster bekommt beim Öffnen die Stufe darüber", () => {
    render(
      <div style={{ position: "fixed", zIndex: 50 }}>
        {knopfMitTipp("Im Fenster")}
      </div>,
    );
    const knopf = screen.getByRole("button", { name: "Hilfe" });
    const kasten = kastenVon(knopf);
    act(() => knopf.focus());
    expect(kasten.style.zIndex).toBe("51");
  });
});

describe("K1: platziereHinweis - nie aus dem Fenster (reine Rechnung)", () => {
  const FENSTER_375 = { breite: 375, hoehe: 812 };

  it("★ der gemessene Fall „Melden\" bei 375 px: stand bei -61 px, jetzt bei 8 px", () => {
    // Im Browser gemessen (19.09.2026): Knopf 130-227 px, Kasten 288 × 38 px,
    // rechtsbündig → linke Kante -61 px.
    const p = platziereHinweis({
      anker: { left: 130, right: 227, top: 72, bottom: 108 },
      kasten: { breite: 288, hoehe: 38 },
      fenster: FENSTER_375,
      ausrichtung: "rechts",
      nachOben: false,
    });
    expect(227 - 288).toBe(-61);
    expect(p.links).toBe(HINWEIS_RAND);
    expect(p.links + 288).toBeLessThanOrEqual(375 - HINWEIS_RAND);
    expect(p.oben).toBe(108 + 4);
    expect(p.nachOben).toBe(false);
  });

  it("passt die Vorgabe, bleibt sie - rechtsbündig am Knopf", () => {
    const p = platziereHinweis({
      anker: { left: 983, right: 1186, top: 282, bottom: 318 },
      kasten: { breite: 320, hoehe: 138 },
      fenster: { breite: 1280, hoehe: 800 },
      ausrichtung: "rechts",
      nachOben: false,
    });
    // Genau die Zahlen des Excel-Knopfs im Browser: 866-1186, ab 322 px.
    expect(p).toEqual({ links: 866, oben: 322, seite: "rechts", nachOben: false });
  });

  it("am rechten Rand mit Vorgabe „links\": dockt rechts an, statt hinauszuragen", () => {
    const p = platziereHinweis({
      anker: { left: 1240, right: 1270, top: 10, bottom: 40 },
      kasten: { breite: 320, hoehe: 40 },
      fenster: { breite: 1280, hoehe: 800 },
      ausrichtung: "links",
      nachOben: false,
    });
    expect(p.seite).toBe("rechts");
    expect(p.links).toBe(1270 - 320);
  });

  it("passt an keiner Kante: rückt so weit herein wie nötig, an der rechten Seite mit 8 px Rand", () => {
    const p = platziereHinweis({
      // links bündig: 200 + 300 > 367; rechts bündig: 220 - 300 < 8
      anker: { left: 200, right: 220, top: 10, bottom: 30 },
      kasten: { breite: 300, hoehe: 40 },
      fenster: FENSTER_375,
      ausrichtung: "links",
      nachOben: false,
    });
    expect(p.seite).toBe("links");
    expect(p.links).toBe(375 - HINWEIS_RAND - 300);
  });

  it("breiter als das Fenster (kommt wegen der Kappung nicht vor): an den linken Rand", () => {
    const p = platziereHinweis({
      anker: { left: 100, right: 120, top: 10, bottom: 30 },
      kasten: { breite: 500, hoehe: 40 },
      fenster: FENSTER_375,
      ausrichtung: "rechts",
      nachOben: false,
    });
    expect(p.links).toBe(HINWEIS_RAND);
  });

  it("unten kein Platz: klappt nach oben", () => {
    const p = platziereHinweis({
      anker: { left: 10, right: 60, top: 700, bottom: 740 },
      kasten: { breite: 200, hoehe: 138 },
      fenster: { breite: 1280, hoehe: 800 },
      ausrichtung: "links",
      nachOben: false,
    });
    expect(p.nachOben).toBe(true);
    expect(p.oben).toBe(700 - 4 - 138);
  });

  it("Vorgabe oben, aber oben kein Platz (Kopfzeile): doch nach unten", () => {
    const p = platziereHinweis({
      anker: { left: 10, right: 60, top: 24, bottom: 60 },
      kasten: { breite: 200, hoehe: 40 },
      fenster: { breite: 1280, hoehe: 800 },
      ausrichtung: "links",
      nachOben: true,
    });
    expect(p.nachOben).toBe(false);
    expect(p.oben).toBe(64);
  });

  it("passt weder oben noch unten: die Seite mit mehr Platz, ins Fenster geklemmt", () => {
    const p = platziereHinweis({
      anker: { left: 10, right: 60, top: 495, bottom: 515 },
      kasten: { breite: 204, hoehe: 558 },
      fenster: FENSTER_375,
      ausrichtung: "links",
      nachOben: true,
    });
    expect(p.nachOben).toBe(true);
    expect(p.oben).toBe(HINWEIS_RAND);
  });

  it("Anker unter das Fenster gerollt: der Kasten hängt weiter an ihm, statt ins Bild zu springen", () => {
    const p = platziereHinweis({
      anker: { left: 10, right: 60, top: 941, bottom: 977 },
      kasten: { breite: 204, hoehe: 100 },
      fenster: FENSTER_375,
      ausrichtung: "links",
      nachOben: false,
    });
    expect(p.oben).toBe(941 - 4 - 100);
    expect(p.oben).toBeGreaterThan(812);
  });

  it("hoechstBreite: 20 rem, gekappt aufs Fenster minus Rand, und die Kappung des Aufrufers gilt", () => {
    expect(hoechstBreite({ fensterBreite: 1280, remPx: 16, maxBreite: null })).toBe(320);
    expect(hoechstBreite({ fensterBreite: 320, remPx: 16, maxBreite: null })).toBe(320 - 2 * HINWEIS_RAND);
    expect(hoechstBreite({ fensterBreite: 1280, remPx: 16, maxBreite: 204 })).toBe(204);
    // Vergrösserte Schrift: 20 rem werden breiter - aber nie breiter als das Fenster.
    expect(hoechstBreite({ fensterBreite: 1280, remPx: 24, maxBreite: null })).toBe(480);
    expect(hoechstBreite({ fensterBreite: 375, remPx: 24, maxBreite: null })).toBe(359);
  });
});

describe("K1: offen folgt er dem Anker, zu horcht er nicht", () => {
  it("Rollen verschiebt den Kasten mit dem Anker; nach dem Schliessen hängt kein Horcher mehr", () => {
    const hinzu = vi.spyOn(window, "addEventListener");
    const weg = vi.spyOn(window, "removeEventListener");
    try {
      render(knopfMitTipp());
      const knopf = screen.getByRole("button", { name: "Hilfe" });
      const huelle = knopf.parentElement as HTMLElement;
      let oben = 100;
      huelle.getBoundingClientRect = () =>
        ({ left: 200, right: 240, top: oben, bottom: oben + 36, width: 40, height: 36, x: 200, y: oben, toJSON() {} }) as DOMRect;
      const kasten = kastenVon(knopf);
      fireEvent.mouseEnter(huelle);
      expect(kasten.style.top).toBe("140px");
      const rollHorcher = hinzu.mock.calls.filter(([typ]) => (typ as string) === "scroll").length;
      expect(rollHorcher, "offen: ein Roll-Horcher").toBe(1);

      oben = 40;
      fireEvent.scroll(window);
      expect(kasten.style.top).toBe("80px");

      fireEvent.mouseLeave(huelle);
      expect(weg.mock.calls.filter(([typ]) => (typ as string) === "scroll").length, "zu: Horcher abgehängt").toBe(1);
      oben = 400;
      fireEvent.scroll(window);
      expect(kasten.style.top, "zu: rührt sich nicht mehr").toBe("80px");
    } finally {
      hinzu.mockRestore();
      weg.mockRestore();
    }
  });
});
