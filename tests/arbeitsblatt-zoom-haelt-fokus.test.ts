/**
 * DER WÄCHTER ZU P4: Beim Vergrössern bleiben Fokus UND Bildausschnitt stehen.
 * ===========================================================================
 * Angelegt 11.09.2026, Umbauplan §1 P4.
 *
 * > **Johannes, 11.09.2026:** „Wenn Alt ++ oder Strg ++ gedrückt wird, muss der
 * > Fokus und Bildausschnitt an derselben Stelle bleiben!"
 *
 * ★★★ WAS AM 11.09. GEMESSEN WURDE (im echten Browser, Puppeteer,
 * `messwerkzeuge-2026-09-11/zoom-fokus-messen.mjs`, Protokoll in
 * `messwerkzeuge-2026-09-11/ZOOM-MESSUNG.md`):
 *
 *   Fokus im Feld, Blick auf demselben Feld     → hielt (beide Tasten, 100-800 %)
 *   Fokus auf einer Überschrift                 → hielt
 *   ohne Fokus                                  → hielt
 *   Fokus im Feld, ABER weitergerollt           → **lief davon**
 *
 * Der letzte Fall ist der Fehler, und er ist der alltägliche: Ein Kind steht
 * mit dem Schreibzeiger in Beispiel 2 und liest weiter unten nach - mit dem
 * Rad, mit dem Trackpad, oder weil die Sprachausgabe mit ihrem eigenen Zeiger
 * durch die Seite wandert und den Bildlauf mitnimmt. Der Fokus bleibt dabei
 * oben. Drückt es jetzt Alt + Plus, verankerte sich die Lesestelle am
 * UNSICHTBAREN Feld - und der Ausschnitt, den das Kind vor sich hatte, wanderte
 * um den ganzen Zuwachs davon: bei 125 % schon 180 Punkte, bei 800 % über
 * 20.000. Dasselbe bei Strg + Plus über den `resize`-Weg.
 *
 * ⚠️ ZURÜCKGEDREHT MUSS DIESER WÄCHTER ROT SEIN. Wer in `merkeStelle` die
 * Sichtbarkeitsprüfung um den Schreibzeiger wieder entfernt, sieht hier ein
 * abgewandertes Blatt (gemessen: 295 Punkte Versatz schon bei 125 %).
 *
 * ⚠️ JSDOM RECHNET KEIN LAYOUT. Darum wird hier ein kleines Blatt NACHGEBILDET:
 * Jedes Stück hat eine Lage im Dokument, die Vergrösserung multipliziert sie
 * (genau das tut CSS `zoom`), und `window.scrollBy` verschiebt den Ausschnitt.
 * Das ist keine Behauptung über den Browser - es ist die Rechnung, die im
 * Browser gemessen wurde, in Zahlen nachgestellt.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { haltStelle, merkeStelle } from "../src/lib/arbeitsblatt/lesestelle";
import { zoomKeyDirection } from "../src/lib/shortcuts";

const FENSTER = 900;

/** Ein Stück Blatt: wo es im Dokument steht und wie hoch es bei 100 % ist. */
interface Stueck {
  id: string;
  /** Abstand vom Dokumentanfang bei 100 %. */
  docOben: number;
  hoehe: number;
  /** `data-feld` (Antwortfeld) oder `data-angabe` (Text) - beides sind Anker. */
  art: "feld" | "angabe";
}

/**
 * Ein nachgebildetes Blatt. `zoom` skaliert die Lagen wie CSS `zoom`,
 * `scrollY` ist der Bildlauf; `getBoundingClientRect` rechnet daraus die Lage
 * im Fenster.
 */
function blattBauen(stuecke: Stueck[]) {
  const stand = { zoom: 1, scrollY: 0 };
  const wurzel = document.createElement("div");
  document.body.appendChild(wurzel);

  for (const s of stuecke) {
    const el = document.createElement(s.art === "feld" ? "textarea" : "p");
    el.id = s.id;
    el.setAttribute(s.art === "feld" ? "data-feld" : "data-angabe", "");
    el.tabIndex = 0;
    el.getBoundingClientRect = () => {
      const top = s.docOben * stand.zoom - stand.scrollY;
      const height = s.hoehe * stand.zoom;
      return {
        top, height, bottom: top + height,
        left: 0, right: 600, width: 600, x: 0, y: top, toJSON: () => ({}),
      } as DOMRect;
    };
    wurzel.appendChild(el);
  }

  return {
    wurzel,
    stand,
    /** Lage eines Stückes im Fenster - „was das Kind vor sich hat". */
    oben: (id: string) => (wurzel.querySelector(`#${id}`) as HTMLElement).getBoundingClientRect().top,
  };
}

/** `window.scrollBy` verschiebt den nachgebildeten Ausschnitt. */
function scrollAnhaengen(stand: { scrollY: number }) {
  (window as unknown as { scrollBy: unknown }).scrollBy = (o: { top: number }) => {
    stand.scrollY += o.top;
  };
}

let alteHoehe: number;
beforeEach(() => {
  alteHoehe = window.innerHeight;
  Object.defineProperty(window, "innerHeight", { value: FENSTER, configurable: true });
});
afterEach(() => {
  document.body.innerHTML = "";
  Object.defineProperty(window, "innerHeight", { value: alteHoehe, configurable: true });
});

/**
 * Das Blatt der Messung: Feld 5 steht weit oben, das Kind hat 1200 Punkte
 * weitergerollt und liest bei der Angabe, die gerade am oberen Rand steht.
 */
function blattWieGemessen() {
  const b = blattBauen([
    { id: "feld5", docOben: 400, hoehe: 40, art: "feld" },
    { id: "angabeOben", docOben: 1580, hoehe: 30, art: "angabe" },
    { id: "angabeDarunter", docOben: 1700, hoehe: 30, art: "angabe" },
    { id: "angabeWeiterUnten", docOben: 2100, hoehe: 30, art: "angabe" },
  ]);
  scrollAnhaengen(b.stand);
  b.stand.scrollY = 1600;
  (b.wurzel.querySelector("#feld5") as HTMLElement).focus();
  return b;
}

describe("★★★★★ P4 · Alt + Plus hält den Ausschnitt, auch wenn der Fokus weggerollt ist", () => {
  it("verankert NICHT am Schreibzeiger, wenn der ausserhalb des Fensters steht", () => {
    const b = blattWieGemessen();
    // Der Schreibzeiger steht 1200 Punkte über dem oberen Rand.
    expect(b.oben("feld5")).toBe(-1200);
    expect(document.activeElement?.id).toBe("feld5");

    const stelle = merkeStelle(b.wurzel);
    // Verankert wird an dem, was das Kind wirklich sieht.
    expect(stelle?.el.id).toBe("angabeOben");
  });

  it("★★★★ hält den Ausschnitt beim Vergrössern auf 125 Prozent (der gemessene Fall)", () => {
    const b = blattWieGemessen();
    const vorher = b.oben("angabeOben"); // -20: gerade angeschnitten am oberen Rand

    // Genau der Ablauf aus `blattAnsicht.ts`: merken → zoomen → halten.
    const stelle = merkeStelle(b.wurzel);
    b.stand.zoom = 1.25;
    haltStelle(stelle);

    // ⚠️ ZURÜCKGEDREHT ROT: mit dem unsichtbaren Feld als Anker stand die
    // Angabe danach bei +275 statt bei -20 - 295 Punkte davon, ein Drittel
    // des Fensters. So wurde es am 11.09. im Browser gemessen.
    expect(Math.abs(b.oben("angabeOben") - vorher)).toBeLessThanOrEqual(1);
  });

  it("★★★★ hält ihn auch über alle Stufen bis 800 Prozent", () => {
    const b = blattWieGemessen();
    const vorher = b.oben("angabeOben");
    for (const stufe of [1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8]) {
      const stelle = merkeStelle(b.wurzel);
      b.stand.zoom = stufe;
      haltStelle(stelle);
      expect(Math.abs(b.oben("angabeOben") - vorher)).toBeLessThanOrEqual(1);
    }
  });

  it("★★★ und ebenso bei der BROWSER-Vergrösserung (Strg/Cmd + Plus)", () => {
    // Für die Seite ist Strg + Plus ein `resize`: der Anzeigebereich wird in
    // CSS-Punkten kleiner, `devicePixelRatio` grösser. Die Lagen in CSS-Punkten
    // bleiben, darum `zoom` unverändert - gerechnet wird über die Punktgrösse.
    const b = blattWieGemessen();
    const anteilVorher = b.oben("angabeOben") / window.innerHeight;

    const stelle = merkeStelle(b.wurzel);
    expect(stelle?.el.id).toBe("angabeOben");
    const altesDpr = window.devicePixelRatio;
    Object.defineProperty(window, "devicePixelRatio", { value: 2, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: FENSTER / 2, configurable: true });
    haltStelle(stelle);

    const anteilNachher = b.oben("angabeOben") / window.innerHeight;
    expect(Math.abs(anteilNachher - anteilVorher)).toBeLessThanOrEqual(0.12);
    Object.defineProperty(window, "devicePixelRatio", { value: altesDpr, configurable: true });
  });

  it("⚠️ verankert WEITERHIN am Schreibzeiger, solange der im Fenster steht", () => {
    // Das ist die ältere Zusage (Johannes, 24.08.2026) und sie bleibt: Wer in
    // einem Feld arbeitet und dort hinsieht, behält SEIN Feld als Stelle -
    // auch wenn es nicht das oberste ist.
    const b = blattBauen([
      { id: "angabeOben", docOben: 1580, hoehe: 30, art: "angabe" },
      { id: "feld5", docOben: 1900, hoehe: 40, art: "feld" },
    ]);
    scrollAnhaengen(b.stand);
    b.stand.scrollY = 1600;
    (b.wurzel.querySelector("#feld5") as HTMLElement).focus();
    expect(b.oben("feld5")).toBe(300); // mitten im Fenster

    const stelle = merkeStelle(b.wurzel);
    expect(stelle?.el.id).toBe("feld5");

    b.stand.zoom = 2;
    haltStelle(stelle);
    expect(Math.abs(b.oben("feld5") - 300)).toBeLessThanOrEqual(1);
  });

  it("⚠️ rollt gar nicht, wenn NICHTS sichtbar ist - ein Bildlauf ins Nichts wäre schlimmer", () => {
    const b = blattBauen([{ id: "feld5", docOben: 400, hoehe: 40, art: "feld" }]);
    scrollAnhaengen(b.stand);
    b.stand.scrollY = 1600;
    (b.wurzel.querySelector("#feld5") as HTMLElement).focus();
    expect(merkeStelle(b.wurzel)).toBeNull();
    const vorher = b.stand.scrollY;
    haltStelle(null);
    expect(b.stand.scrollY).toBe(vorher);
  });
});

describe("★★★ Die Taste selbst - auf Johannes' Mac gemessen", () => {
  /**
   * ⚠️ Am Mac erzeugt die Wahltaste bei „+" ein anderes `e.key`; erkannt wird
   * darum über `e.code`. Beide Belegungen wurden am 11.09. im Browser
   * gefahren - deutsche Mac-Tastatur (`BracketRight`) und US (`Equal`) - und
   * beide vergrösserten dieselben neun Stufen.
   */
  const taste = (init: Partial<KeyboardEvent>) =>
    zoomKeyDirection(new KeyboardEvent("keydown", init as KeyboardEventInit));

  it("Alt + BracketRight (deutsche Mac-Tastatur) vergrössert", () => {
    expect(taste({ code: "BracketRight", key: "†", altKey: true })).toBe("in");
  });

  it("Alt + Equal (US-Belegung) vergrössert ebenfalls", () => {
    expect(taste({ code: "Equal", key: "±", altKey: true })).toBe("in");
  });

  it("Strg/Cmd + Plus gehört dem BROWSER - wir fangen es nicht ab", () => {
    // Sonst gäbe es zwei Vergrösserungen übereinander, und das Kind bekäme
    // beim Drücken eine, die es nicht gemeint hat.
    expect(taste({ code: "Equal", key: "+", ctrlKey: true })).toBeNull();
    expect(taste({ code: "Equal", key: "+", metaKey: true })).toBeNull();
  });
});
