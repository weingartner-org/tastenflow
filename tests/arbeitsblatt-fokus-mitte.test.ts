/**
 * DIE ARBEITSSTELLE ROLLT IN DIE MITTE - der gemeinsame Baustein.
 * ============================================================================
 * > **Johannes, 09.09.2026:** „wenn tab gedückt wird soll der Fokus (aufgabe
 * > des aktuellen Beispiels) in die mitte des monitores scrollen, automatisch
 * > (geht das, das wäre eine rießige unterstützung für menschen mit
 * > sehbehinderung)"
 *
 * Gemessen wird an `src/lib/arbeitsblatt/fokusMitte.ts` - dem Baustein, den
 * alle Programme der Lernwerkstatt benutzen können
 * ([[feedback_arbeitsblatt_bauart_pflegen]]).
 *
 * ⚠️ JSDOM HAT KEIN LAYOUT. Jedes `getBoundingClientRect()` gäbe hier Nullen,
 * und `scrollIntoView` gibt es gar nicht. Beides wird darum gestellt - die
 * LAGE ist die Eingabe dieser Rechnung, und genau sie soll geprüft werden.
 * Was NICHT geprüft werden kann, ist, ob der Browser danach wirklich rollt;
 * das ist im laufenden Programm nachgemessen (Muster-Seite, 09.09.2026).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fokusMitteStarten } from "../src/lib/arbeitsblatt/fokusMitte";

const FENSTER_HOEHE = 800;

let wurzel: HTMLElement;
let feld: HTMLTextAreaElement;
let gerollt: { block?: string; behavior?: string }[];
let abmelden: () => void;

/** Die Lage, die `getBoundingClientRect` melden soll. */
function lage(oben: number, hoehe: number) {
  feld.getBoundingClientRect = () =>
    ({
      top: oben,
      bottom: oben + hoehe,
      height: hoehe,
      left: 0,
      right: 100,
      width: 100,
      x: 0,
      y: oben,
      toJSON: () => ({}),
    }) as DOMRect;
}

/**
 * Fokus setzen und den nächsten Bild-Takt durchlaufen lassen.
 *
 * ⚠️ NUR `focus()`, kein zweites `focusin` von Hand: jsdom schickt das
 * Ereignis selbst. Wer beides tut, misst jeden Bildlauf doppelt - und hielte
 * eine Doppelung für richtig, die es im Browser nie gibt.
 */
async function fokussieren() {
  feld.focus();
  // Der Baustein misst erst im nächsten Takt - sonst misst er die Lage von
  // vorher (siehe Vermerk in `fokusMitte.ts`).
  await new Promise((r) => window.setTimeout(() => r(null), 0));
}

beforeEach(() => {
  Object.defineProperty(window, "innerHeight", { value: FENSTER_HOEHE, configurable: true });
  document.body.innerHTML = "";
  wurzel = document.createElement("div");
  feld = document.createElement("textarea");
  wurzel.appendChild(feld);
  document.body.appendChild(wurzel);
  gerollt = [];
  feld.scrollIntoView = vi.fn((o?: boolean | ScrollIntoViewOptions) => {
    gerollt.push(typeof o === "object" && o ? o : {});
  }) as unknown as typeof feld.scrollIntoView;
  abmelden = fokusMitteStarten(wurzel);
});

afterEach(() => {
  abmelden?.();
  vi.useRealTimers();
});

describe("★★★★★ Tab rollt die Arbeitsstelle in die Mitte (Meldung 09.09.2026)", () => {
  /**
   * ★★★★★ `"instant"`, NIE `"auto"` - am 09.09.2026 in einem echten Browser
   * gemessen: Mit `"auto"` rollte bei 800 Prozent gar nichts (24.441 px
   * daneben), weil die Plattform `scroll-behavior: smooth` setzt und der
   * nächste Tab-Druck die Bewegung abbricht. Bei 100 Prozent sah es richtig
   * aus - der Fehler traf nur die Kinder, für die das Ganze gebaut ist.
   * ⇒ Diese Proben prüfen den WERT mit, nicht nur, dass gerollt wird.
   */
  it("ein Feld unten am Rand kommt in die Mitte", async () => {
    lage(760, 30); // ganz unten - genau die Lage nach einem Tab-Druck
    await fokussieren();
    expect(gerollt).toEqual([{ block: "center", behavior: "instant" }]);
  });

  it("ein Feld oben am Rand ebenso - beide Richtungen", async () => {
    lage(4, 30);
    await fokussieren();
    expect(gerollt).toEqual([{ block: "center", behavior: "instant" }]);
  });

  it("★★★ was schon fast in der Mitte steht, bleibt stehen", async () => {
    // ⚠️ OHNE DIESE TOLERANZ ZUCKT DIE SEITE BEI JEDEM FELDWECHSEL. Zwischen
    // a) und b) liegt eine Zeile; sie wäre jedes Mal ein Bildlauf.
    lage(FENSTER_HOEHE / 2 - 15, 30);
    await fokussieren();
    expect(gerollt).toEqual([]);
  });

  it("★★★★ ein Element, das höher ist als das Fenster, kommt nach OBEN", async () => {
    // Bei 800 Prozent ist eine Aufgabenkarte mehrere Bildschirme hoch. „Mitte"
    // hiesse dort: Der Anfang liegt ausserhalb.
    lage(-200, FENSTER_HOEHE * 2);
    await fokussieren();
    expect(gerollt).toEqual([{ block: "start", behavior: "instant" }]);
  });

  it("★★★★★ ein Klick rollt NICHT - wer zeigt, weiss schon, wo es liegt", async () => {
    lage(760, 30);
    document.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    await fokussieren();
    expect(gerollt).toEqual([]);
  });

  it("★★★ und danach zählt der nächste Tab-Druck wieder", async () => {
    // ⚠️ Die Uhr wird gestellt, nicht gewartet: 400 ms echte Wartezeit je Probe
    // sind in einer Suite mit über 1.200 Proben ein spürbarer Preis.
    const echt = Date.now();
    const uhr = vi.spyOn(Date, "now").mockReturnValue(echt);
    document.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    uhr.mockReturnValue(echt + 1000);
    lage(760, 30);
    await fokussieren();
    expect(gerollt).toEqual([{ block: "center", behavior: "instant" }]);
    uhr.mockRestore();
  });

  it("★★★★ ausgeschaltet rollt gar nichts - der Schalter im Zahnrad wirkt sofort", async () => {
    abmelden();
    let an = false;
    abmelden = fokusMitteStarten(wurzel, { an: () => an });
    lage(760, 30);
    await fokussieren();
    expect(gerollt).toEqual([]);
    // ⚠️ OHNE NEU AUFHÄNGEN: Der Baustein fragt bei jedem Fokuswechsel nach.
    an = true;
    feld.blur();
    lage(760, 30);
    await fokussieren();
    expect(gerollt).toEqual([{ block: "center", behavior: "instant" }]);
  });

  it("★★★ in einem offenen Fenster rollt die Seite dahinter nicht", async () => {
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    wurzel.appendChild(dialog);
    dialog.appendChild(feld);
    lage(760, 30);
    await fokussieren();
    expect(gerollt).toEqual([]);
  });

  it("★★ was ausserhalb des Blattes liegt, geht uns nichts an", async () => {
    const draussen = document.createElement("textarea");
    document.body.appendChild(draussen);
    const gerollt2: unknown[] = [];
    draussen.scrollIntoView = vi.fn(() =>
      gerollt2.push(1),
    ) as unknown as typeof draussen.scrollIntoView;
    draussen.getBoundingClientRect = () =>
      ({ top: 780, bottom: 800, height: 20, left: 0, right: 10, width: 10, x: 0, y: 780, toJSON: () => ({}) }) as DOMRect;
    draussen.focus();
    draussen.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await new Promise((r) => window.setTimeout(() => r(null), 0));
    expect(gerollt2).toEqual([]);
  });

  it("★★★ abgemeldet ist abgemeldet - kein Zuhörer bleibt zurück", async () => {
    abmelden();
    lage(760, 30);
    await fokussieren();
    expect(gerollt).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Wer den Fokus-Wächter hat, hat auch die Mitte
// ---------------------------------------------------------------------------

/**
 * ★★★★★ EIN GRÜNER WÄCHTER BEWEIST NUR DAS, WONACH ER SIEHT
 * ([[feedback_gruener_waechter_beweist_was]]).
 *
 * Die zehn Proben oben messen das BAUTEIL. Sie wären alle grün, während keine
 * einzige Seite es benutzt - genau die Lücke, die am 31.08.2026 zwischen der
 * Musterseite und der echten Mathecoach-Seite bestand, während 670 Tests grün
 * standen.
 *
 * ⇒ Diese Probe sieht auf die VERDRAHTUNG, und zwar in ganz `src/`: **Jede
 * Seite, die den Fokus-Wächter startet, hat ein Arbeitsblatt** - dieselbe
 * Blattfläche, dieselben Kennzeichen, dieselbe Not. Wer den einen hängt und
 * den anderen vergisst, wird hier rot.
 *
 * ⚠️ Das Kriterium ist absichtlich `fokuswacheStarten` und nicht eine Liste von
 * Dateinamen: Eine Liste altert, sobald eine App dazukommt - und dann ist die
 * neue die einzige ohne die Hilfe, und niemand merkt es.
 */
describe("★★★★★ Jede Seite mit Fokus-Wächter rollt auch in die Mitte", () => {
  // ⚠️ Derselbe Weg wie in `kuerzel-alt-t.test.tsx`: `import.meta.dirname`,
  // nicht `new URL(...).pathname` - das gab hier „/src".
  const wurzel = join(import.meta.dirname ?? ".", "..", "src");

  function dateienMit(text: string): string[] {
    const treffer: string[] = [];
    const gehe = (ordner: string) => {
      for (const e of readdirSync(ordner, { withFileTypes: true })) {
        const p = join(ordner, e.name);
        if (e.isDirectory()) gehe(p);
        else if (/\.tsx?$/.test(e.name) && readFileSync(p, "utf8").includes(text)) treffer.push(p);
      }
    };
    gehe(wurzel);
    return treffer;
  }

  it("keine Seite hängt den einen Wächter und vergisst den anderen", () => {
    // ⚠️ Das Bauteil selbst und seine Meldestelle nennen den Namen auch - sie
    // sind der Gegenstand, nicht ein Benutzer.
    const bausteine = /lib\/arbeitsblatt\/(fokuswache|fokusmeldung|fokusMitte)\.ts$/;
    const seiten = dateienMit("fokuswacheStarten(").filter((p) => !bausteine.test(p));
    expect(seiten.length).toBeGreaterThan(0);
    const ohneMitte = seiten
      .filter((p) => !readFileSync(p, "utf8").includes("fokusMitteStarten("))
      .map((p) => p.slice(wurzel.length + 1));
    expect(ohneMitte).toEqual([]);
  });
});
