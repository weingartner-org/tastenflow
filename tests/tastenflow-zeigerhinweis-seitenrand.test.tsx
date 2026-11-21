/**
 * ★★★ WÄCHTER: Ein zugeklappter Mouseover-Hinweis darf die Seite nicht breiter machen
 * ============================================================================
 *
 * Gemessen am 11.09.2026 in echtem Chrome (Bau der Etappe E4, Schülerstatistik,
 * Fenster 1024 px): `document.documentElement.scrollWidth` = 1136 px, die Seite
 * rollte seitlich - verursacht von sechs UNSICHTBAREN Hinweisen der
 * Lektionen-Kacheln 22 bis 27. Der ganze Befund und die Antwort stehen im Kopf
 * von `src/components/typing/Zeigerhinweis.tsx`.
 *
 * ⚠️ WAS DIESER TEST BEWEIST - UND WAS NICHT ([[feedback_gruener_waechter_beweist_was]]):
 * jsdom rechnet kein Layout. Jedes Element ist 0 px gross, `scrollWidth` ist
 * immer 0 - die WIRKUNG (die Seite bleibt so breit wie das Fenster) misst nur
 * `npm run pruefstand:seitenbreite` in echtem Chrome. Hier steht die URSACHE
 * unter Wache:
 *   1. Seit K1 (19.09.2026, Kopf von `Zeigerhinweis.tsx`) hängt JEDER Kasten -
 *      der vier Tastenflow-Hüllen UND von `Tipp` (fünf Apps, von Johannes so
 *      beauftragt: *„dieses Problem gibt es ganz oft"*) - per Portal in der
 *      Ebene unter `<body>`, `position: fixed`. Ein `fixed`-Kasten trägt zu
 *      keiner Scrollbreite bei; die 0 × 0-Klipphülle von vorher ist damit weg.
 *      In der Hülle steht nur noch seine Marke.
 *   2. `seiteMitPlatz` wählt die Seite mit Platz (mit von Hand gesetzten
 *      Massen, weil jsdom keine liefert) - und misst am schneidenden
 *      Vorfahren, nicht am Fenster, wenn es einen gibt. Das bleibt die
 *      VORGABE; das letzte Wort hat das Fenster (`platziereHinweis`, eigener
 *      Wächter `tests/tipp-immer-oben.test.tsx`).
 */
import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  HINWEIS_EBENE_ID,
  Hinweisflaeche,
  lageMitPlatz,
  seiteMitPlatz,
} from "@/components/typing/Zeigerhinweis";
import { Erklaert } from "@/components/typing/Erklaert";
import { Spaltenkopf } from "@/components/typing/Spaltenkopf";
import { Veraenderungspfeil } from "@/components/typing/Veraenderungspfeil";
import { Tipp } from "@/components/Tipp";

/**
 * Die Marke in der Hülle, der Kasten dazu (über die Id der Marke) und die
 * Hülle mit den Maus-Horchern (der nächste Vorfahre der Marke, der sie trägt).
 */
function teile(container: HTMLElement) {
  const marke = container.querySelector<HTMLElement>("[data-hinweis-anker]");
  if (!marke) throw new Error("keine Hinweis-Marke gerendert");
  const kasten = document.getElementById(marke.getAttribute("data-hinweis-anker")!);
  if (!kasten) throw new Error("kein Kasten zur Marke");
  return { marke, kasten };
}

const HUELLEN: Array<{ name: string; baue: () => JSX.Element; huelleVon: (marke: HTMLElement) => HTMLElement }> = [
  {
    name: "Hinweisflaeche (Kacheln in Listen)",
    baue: () => (
      <Hinweisflaeche hilfe="27. Texte: Ganze Sätze - noch gesperrt" className="inline-block">
        27
      </Hinweisflaeche>
    ),
    // Marke → aria-hidden-Span → die Fläche selbst
    huelleVon: (marke) => marke.parentElement!.parentElement as HTMLElement,
  },
  {
    name: "Erklaert (Begriffe)",
    baue: () => <Erklaert hilfe="So viele Anschläge je Minute.">Tempo</Erklaert>,
    huelleVon: (marke) => marke.parentElement as HTMLElement,
  },
  {
    name: "Spaltenkopf (Tabellen)",
    baue: () => (
      <table>
        <thead>
          <tr>
            <Spaltenkopf hilfe="Treffsicherheit in Prozent.">Treffer</Spaltenkopf>
          </tr>
        </thead>
      </table>
    ),
    huelleVon: (marke) => marke.parentElement as HTMLElement,
  },
  {
    name: "Veraenderungspfeil (Tabellenwerte)",
    baue: () => (
      <Veraenderungspfeil
        wert="95 %"
        veraenderung={{ richtung: "hoch", differenz: 3 }}
        groesse="treffer"
        vergleichsName="der Woche davor"
      />
    ),
    huelleVon: (marke) => marke.parentElement as HTMLElement,
  },
  {
    name: "Tipp (fünf Apps - seit K1 ebenfalls)",
    baue: () => (
      <Tipp text="Zurück zur Übersicht.">
        {(id) => (
          <button type="button" aria-describedby={id}>
            Zurück
          </button>
        )}
      </Tipp>
    ),
    huelleVon: (marke) => marke.parentElement as HTMLElement,
  },
];

describe("Zugeklappt keine Breite: jeder Kasten hängt fixed in der Ebene unter <body> (K1)", () => {
  for (const h of HUELLEN) {
    it(`${h.name}: Kasten ausserhalb der Hülle, fixed, ohne Klipphülle - überfahren → sichtbar, verlassen → unsichtbar`, () => {
      const { container } = render(h.baue());
      const { marke, kasten } = teile(container);
      // In der Hülle steht nur die Marke - unsichtbar und ohne Platz.
      expect(marke.hidden, "Marke nicht `hidden`").toBe(true);
      expect(container.contains(kasten), "Kasten steht noch in der Hülle").toBe(false);
      expect(kasten.parentElement?.id).toBe(HINWEIS_EBENE_ID);
      expect(kasten.parentElement?.parentElement).toBe(document.body);
      // Die alte Klipphülle ist weg - `fixed` trägt ohnehin keine Breite bei.
      expect(document.querySelector("[data-hinweis-huelle]")).toBeNull();
      for (const k of ["fixed", "pointer-events-none", "invisible"]) {
        expect(kasten.classList.contains(k), `Kasten ohne ${k}`).toBe(true);
      }
      expect(kasten.classList.contains("absolute")).toBe(false);

      const huelle = h.huelleVon(marke);
      fireEvent.mouseEnter(huelle);
      expect(kasten.classList.contains("visible"), "beim Überfahren nicht geöffnet").toBe(true);
      expect(kasten.classList.contains("invisible")).toBe(false);

      fireEvent.mouseLeave(huelle);
      expect(kasten.classList.contains("invisible"), "nach dem Verlassen nicht wieder zu").toBe(true);
    });
  }
});

/** Eine Hülle mit Kasten und von Hand gesetzten Massen - jsdom liefert keine. */
function huelleMitMassen(o: {
  links: number;
  rechts: number;
  kastenBreite: number;
  in?: HTMLElement;
}): HTMLElement {
  const huelle = document.createElement("span");
  const kasten = document.createElement("span");
  kasten.setAttribute("role", "tooltip");
  huelle.appendChild(kasten);
  (o.in ?? document.body).appendChild(huelle);
  huelle.getBoundingClientRect = () =>
    ({ left: o.links, right: o.rechts, top: 0, bottom: 20, width: o.rechts - o.links, height: 20, x: o.links, y: 0, toJSON() {} }) as DOMRect;
  Object.defineProperty(kasten, "offsetWidth", { value: o.kastenBreite, configurable: true });
  return huelle;
}

describe("seiteMitPlatz: die Seite, an der der Hinweis im Bild bleibt", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    delete (document.documentElement as unknown as Record<string, unknown>).clientWidth;
  });

  function fenster(breite: number) {
    Object.defineProperty(document.documentElement, "clientWidth", { value: breite, configurable: true });
  }

  it("weit links im Fenster: die Vorgabe „links“ bleibt", () => {
    fenster(1024);
    const h = huelleMitMassen({ links: 100, rechts: 130, kastenBreite: 300 });
    expect(seiteMitPlatz(h, "links")).toBe("links");
  });

  it("am rechten Rand (der gemessene Fall, Lektion 27 bei 874 px): dockt rechts an", () => {
    fenster(1024);
    const h = huelleMitMassen({ links: 874, rechts: 906, kastenBreite: 263 });
    expect(seiteMitPlatz(h, "links")).toBe("rechts");
  });

  it("am linken Rand mit Vorgabe „rechts“: dockt links an", () => {
    fenster(1024);
    const h = huelleMitMassen({ links: 10, rechts: 40, kastenBreite: 300 });
    expect(seiteMitPlatz(h, "rechts")).toBe("links");
  });

  it("passt nirgends: die Seite mit mehr Platz - und dort gekappt auf den freien Platz", () => {
    fenster(400);
    const h = huelleMitMassen({ links: 250, rechts: 280, kastenBreite: 320 });
    // links: 400 - 250 = 150; rechts: 280 - 0 = 280 → rechts, 280 - 8 Luft
    expect(seiteMitPlatz(h, "links")).toBe("rechts");
    expect(lageMitPlatz(h, "links")).toEqual({ seite: "rechts", maxBreite: 272 });
  });

  it("der gemessene 320-px-Fall (Lektion 27 bei 95 px, Kasten 263 px): links, gekappt auf 217 px", () => {
    fenster(320);
    const h = huelleMitMassen({ links: 95, rechts: 127, kastenBreite: 263 });
    expect(lageMitPlatz(h, "links")).toEqual({ seite: "links", maxBreite: 217 });
  });

  it("passt: keine Kappung", () => {
    fenster(1024);
    const h = huelleMitMassen({ links: 100, rechts: 130, kastenBreite: 300 });
    expect(lageMitPlatz(h, "links")).toEqual({ seite: "links", maxBreite: null });
  });

  it("nie unter 120 px - lieber ein wenig über den Rand als Buchstabensalat", () => {
    fenster(200);
    const h = huelleMitMassen({ links: 90, rechts: 110, kastenBreite: 300 });
    // links 110, rechts 110 → Vorgabe links, gekappt auf max(120, 102) = 120
    expect(lageMitPlatz(h, "links")).toEqual({ seite: "links", maxBreite: 120 });
  });

  it("gemessen wird am schneidenden Vorfahren, nicht am Fenster (der Rollkasten der Tabellen)", () => {
    fenster(1024);
    const kasten = document.createElement("div");
    kasten.style.overflowX = "auto";
    kasten.getBoundingClientRect = () =>
      ({ left: 0, right: 500, top: 0, bottom: 300, width: 500, height: 300, x: 0, y: 0, toJSON() {} }) as DOMRect;
    document.body.appendChild(kasten);
    // Im Fenster (1024) wäre rechts von 400 reichlich Platz - im Rollkasten (500) nicht.
    const h = huelleMitMassen({ links: 400, rechts: 430, kastenBreite: 200, in: kasten });
    expect(getComputedStyle(kasten).overflowX, "jsdom liefert overflow-x nicht - Test anpassen").toBe("auto");
    expect(seiteMitPlatz(h, "links")).toBe("rechts");
  });

  it("in jsdom ohne Masse (alles null): es bleibt bei der Vorgabe - Tests, die `right-0` setzen, bleiben grün", () => {
    const h = document.createElement("span");
    const k = document.createElement("span");
    k.setAttribute("role", "tooltip");
    h.appendChild(k);
    document.body.appendChild(h);
    expect(seiteMitPlatz(h, "links")).toBe("links");
    expect(seiteMitPlatz(h, "rechts")).toBe("rechts");
    expect(lageMitPlatz(h, "links").maxBreite).toBeNull();
  });
});
