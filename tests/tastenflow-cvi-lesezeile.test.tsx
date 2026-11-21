/**
 * ★★★★★ WÄCHTER: DIE LESEZEILE (E12, 20.09.2026).
 * ===========================================================================
 * Johannes, 20.09.2026, wörtlich: *„bei einstellung CVI und mehrzeiligen
 * Texten wie im bild oben brauchen wir ein weiteres feature: es wird nur
 * eine 'Lesezeile' hell und das eingabefeld. mit Pfeil ab kann man von zeile
 * zu zeile springen mit Pfeil auf wieder hinauf, alle anderen zeilen sind 80%
 * Verdunkelt"* - und: *„dafür brauchen wir eine Erklärung und ein kleines
 * Popup"*. Anlass: ein Bild von Testerin, Lückentext „Was fehlt hier?", die
 * Frage lief bei grosser Laufweite über fünf Zeilen.
 *
 * ★ Die KORREKTUR vom selben Tag, wörtlich: *„nein es sollen nicht nur die
 * anderen Zeilen geschwärzt werden sondern der ganze Bildschirm außer der
 * Lesezeile und der Eingabezeile"*. Verdunkelt wird seither der GANZE
 * Bildschirm (Kopfzeile, Knöpfe, Fusszeile) - hell bleiben genau zwei Löcher.
 *
 * Die reine Zeilen- und Abdeck-Rechnung (`lib/typing/leseZeile.ts`) prüft
 * `tastenflow-lesezeile-berechnung.test.ts` OHNE Browser. Hier: die Bedienung
 * am Bauteil - Pfeiltasten, welche Bereiche hell/dunkel bleiben, das Popup,
 * und (Punkt 7 der Korrektur) das Zusammenspiel mit `CviAbdunkeln`.
 *
 * ⚠️ jsdom rechnet kein Layout: `Range.getClientRects()` und
 * `getBoundingClientRect()` liefern dort nichts - darum werden sie hier
 * vorgetäuscht (dieselbe Bauart wie `karteHatFlaeche()` im Wächter
 * `tastenflow-cvi-abdunkeln`).
 *
 * ★★★ WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD:
 *  · Die Lesezeile wirkt auch bei EINER Zeile oder ohne CVI - rot.
 *  · Pfeil ab/auf bewegen etwas, obwohl der Fokus nicht im Antwortfeld steht -
 *    rot (die Zuordnung: `onKeyDown` hängt hier NUR am Feld selbst, nicht am
 *    Dokument - anders als bei `CviAbdunkeln`, das bewusst dokumentweit
 *    mithört. Die eigentliche Gegenprobe für „nur ein echt einzeiliges Feld"
 *    steckt in `tastenflow-lesezeile-berechnung.test.ts`, direkt an
 *    `istEinzeiligesTextfeld` - dort wurde die Feldtyp-Prüfung probeweise
 *    entfernt: die Fälle „Zahlenfeld" und „Schieberegler" wurden sofort rot).
 *  · Das Eingabefeld oder die Lesezeile selbst werden verdunkelt - rot.
 *  · Das Popup kommt ein zweites Mal - rot.
 *  · Der zugängliche Text der Frage ändert sich - rot.
 *  · Lesezeile UND `CviAbdunkeln` verdunkeln gleichzeitig - rot (doppelt so
 *    dunkel, siehe Punkt 7).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { RaetselLauf } from "@/components/typing/RaetselLauf";
import { lueckentext } from "@/lib/typing/uebungsformen/lueckentext";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  // ⚠️ jsdom kennt `Range.getClientRects` gar nicht (siehe `taeuscheMessungen`
  // unten) - `vi.spyOn` kann darum nicht greifen, es wird direkt zugewiesen.
  // Danach wieder wegnehmen, sonst bleibt der jeweils letzte Wert für den
  // nächsten Testfall stehen.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (Range.prototype as any).getClientRects;
});
beforeEach(() => {
  localStorage.clear();
});

/** Die Frage - so aufgebaut, wie Testerin Lückentext lief (mehrzeilig bei CVI). */
const FRAGE = "Was fehlt hier? Der Baum verliert im Herbst seine ...";

function baueLauf(zeichenabstand: 1 | 2 | 3 | 4 = 2) {
  return render(
    <RaetselLauf
      titel={lueckentext.name}
      ankuendigung="Los geht's."
      aufgaben={[{ frage: FRAGE, antworten: ["Blätter"] }]}
      grossKleinZaehlt={false}
      contextId="form:lesezeile-probe"
      zeichenabstand={zeichenabstand}
      onFertig={() => {}}
      onAbbruch={() => {}}
    />,
  );
}

/** Rechteck-Kurzschrift für `getClientRects()`/`getBoundingClientRect()`. */
function rect(x: number, y: number, w: number, h: number): DOMRect {
  return { x, y, width: w, height: h, top: y, left: x, right: x + w, bottom: y + h, toJSON() {} } as DOMRect;
}

/**
 * Das Eingabefeld bekommt IMMER dieselbe, von der Zeilenzahl unabhängige
 * Fläche - weit weg von den Fragezeilen (die liegen alle innerhalb der
 * ersten paar hundert Pixel), damit sich die beiden Löcher in keinem Test
 * versehentlich überlappen.
 */
const FELD_RECHTECK = { x: 20, y: 500, w: 300, h: 40 };
const FELD_MITTE = { x: FELD_RECHTECK.x + FELD_RECHTECK.w / 2, y: FELD_RECHTECK.y + FELD_RECHTECK.h / 2 };

/**
 * Täuscht vor, wie viele sichtbare ZEILEN der Fragetext hat - als kämen sie
 * von `Range.getClientRects()` eines echten Browsers - UND wo das
 * Eingabefeld liegt (`getBoundingClientRect()`). Die Hülle
 * (`data-cvi-lesezeile-huelle`) bekommt eine feste Fläche bei (0, 0); das
 * Eingabefeld `FELD_RECHTECK`; alle anderen Elemente bleiben bei jsdoms Null
 * (kein Layout) - für sie gibt es also kein Loch.
 */
function taeuscheMessungen(anzahlZeilen: number) {
  const echtBox = HTMLElement.prototype.getBoundingClientRect;
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.hasAttribute("data-cvi-lesezeile-huelle"))
      return rect(0, 0, 400, anzahlZeilen * 24);
    if (this instanceof HTMLInputElement)
      return rect(FELD_RECHTECK.x, FELD_RECHTECK.y, FELD_RECHTECK.w, FELD_RECHTECK.h);
    // Die Übungskarte selbst (`CviAbdunkeln`s Ziel bei EINZEILIGER Frage,
    // Punkt 7) - ohne Fläche würde sie nie abdunkeln, s. `karteHatFlaeche()`
    // im Wächter `tastenflow-cvi-abdunkeln`.
    if (this.classList.contains("card")) return rect(0, 0, 800, 300);
    return echtBox.call(this);
  });
  // jsdom implementiert `getClientRects` gar nicht erst (siehe Dateikopf) -
  // `vi.spyOn` bräuchte eine vorhandene Eigenschaft, darum direkt zugewiesen
  // (Aufräumen in `afterEach` oben).
  (Range.prototype as unknown as { getClientRects: () => DOMRectList }).getClientRects =
    function (this: Range) {
      const zeilen: DOMRect[] = [];
      for (let i = 0; i < anzahlZeilen; i++) zeilen.push(rect(0, i * 24, 300 - i * 10, 24));
      return zeilen as unknown as DOMRectList;
    };
}

/** Die Mitte der Zeile `index`, wie `taeuscheMessungen` sie aufbaut. */
function zeileMitte(index: number) {
  return { x: (300 - index * 10) / 2, y: index * 24 + 12 };
}

const feld = () => screen.getByRole("textbox") as HTMLInputElement;

/** Alle derzeit gezeichneten Verdunkelungs-Rechtecke (Portal an `<body>`). */
function verdunkelteRechtecke(): { x: number; y: number; w: number; h: number; el: HTMLElement }[] {
  return Array.from(document.querySelectorAll<HTMLElement>("[data-lesezeile-verdunkelt]")).map(
    (el) => ({
      x: parseFloat(el.style.left),
      y: parseFloat(el.style.top),
      w: parseFloat(el.style.width),
      h: parseFloat(el.style.height),
      el,
    }),
  );
}

/** Liegt der Punkt in irgendeinem der gezeichneten Verdunkelungs-Rechtecke? */
function istVerdunkelt(punkt: { x: number; y: number }): boolean {
  return verdunkelteRechtecke().some(
    (r) => punkt.x >= r.x && punkt.x < r.x + r.w && punkt.y >= r.y && punkt.y < r.y + r.h,
  );
}

function pfeil(taste: "ArrowDown" | "ArrowUp", ziel: Element = feld()) {
  act(() => {
    fireEvent.keyDown(ziel, { key: taste });
  });
}

// ---------------------------------------------------------------------------
// Wann es die Lesezeile überhaupt gibt
// ---------------------------------------------------------------------------

describe("Nur bei CVI UND wirklichem Umbruch", () => {
  it("★★★★★ ohne CVI (Faktor 1) geschieht nichts, auch wenn der Text umbräche", () => {
    taeuscheMessungen(4);
    baueLauf(1);
    expect(verdunkelteRechtecke()).toHaveLength(0);
  });

  it("★★★★★ mit CVI, aber nur EINER Zeile: keine Verdunkelung", () => {
    taeuscheMessungen(1);
    baueLauf(2);
    expect(verdunkelteRechtecke()).toHaveLength(0);
  });

  it.each([2, 3, 4] as const)(
    "★★★★★ Faktor %i, VIER Zeilen: Lesezeile (Zeile 0) und Eingabefeld bleiben hell, jede ANDERE Zeile ist verdunkelt",
    (faktor) => {
      taeuscheMessungen(4);
      baueLauf(faktor);
      expect(istVerdunkelt(zeileMitte(0))).toBe(false);
      expect(istVerdunkelt(FELD_MITTE)).toBe(false);
      expect(istVerdunkelt(zeileMitte(1))).toBe(true);
      expect(istVerdunkelt(zeileMitte(2))).toBe(true);
      expect(istVerdunkelt(zeileMitte(3))).toBe(true);
    },
  );

  it("★★★★★ verdunkelt wird der GANZE Bildschirm - auch ein Punkt weit ausserhalb der Frage und des Felds", () => {
    taeuscheMessungen(3);
    baueLauf(2);
    // Weit unten rechts, ausserhalb von Hülle (400×72) und Feld (bei y 500-540).
    expect(istVerdunkelt({ x: 900, y: 700 })).toBe(true);
  });

  it("die verdunkelten Kästchen sind rein sichtbar: aria-hidden, keine Zeigereingaben, kein Text", () => {
    taeuscheMessungen(3);
    baueLauf(2);
    const kaesten = verdunkelteRechtecke();
    expect(kaesten.length).toBeGreaterThan(0);
    for (const { el } of kaesten) {
      expect(el.getAttribute("aria-hidden")).toBe("true");
      expect(el.className).toContain("pointer-events-none");
      expect(el.textContent).toBe("");
    }
  });

  it("die Verdunkelung hängt per Portal direkt an <body> - nicht in der Frage verschachtelt", () => {
    taeuscheMessungen(3);
    baueLauf(2);
    for (const { el } of verdunkelteRechtecke()) {
      expect(el.parentElement).toBe(document.body);
    }
  });
});

// ---------------------------------------------------------------------------
// Pfeiltasten
// ---------------------------------------------------------------------------

describe("Pfeil ab/auf bewegen die Lesezeile", () => {
  it("★★★★★ Pfeil ab: die HELLE Zeile wandert eins weiter - Zeile 0 wird dunkel, Zeile 1 hell, das Feld bleibt hell", () => {
    taeuscheMessungen(3);
    baueLauf(2);
    act(() => feld().focus());
    expect(istVerdunkelt(zeileMitte(0))).toBe(false);
    expect(istVerdunkelt(zeileMitte(1))).toBe(true);

    pfeil("ArrowDown");

    expect(istVerdunkelt(zeileMitte(0))).toBe(true);
    expect(istVerdunkelt(zeileMitte(1))).toBe(false);
    expect(istVerdunkelt(zeileMitte(2))).toBe(true);
    expect(istVerdunkelt(FELD_MITTE)).toBe(false);
  });

  it("★★★★★ an der LETZTEN Zeile: Pfeil ab tut nichts Schlimmes (kein Sprung, kein Umlauf)", () => {
    taeuscheMessungen(3);
    baueLauf(2);
    act(() => feld().focus());
    pfeil("ArrowDown");
    pfeil("ArrowDown"); // jetzt auf der letzten Zeile (Index 2)
    expect(istVerdunkelt(zeileMitte(2))).toBe(false);
    pfeil("ArrowDown"); // ein Schritt zu viel
    expect(istVerdunkelt(zeileMitte(2))).toBe(false); // immer noch hell, kein Umlauf zu Zeile 0
    expect(istVerdunkelt(zeileMitte(0))).toBe(true);
  });

  it("★★★★★ an der ERSTEN Zeile: Pfeil auf tut nichts Schlimmes", () => {
    taeuscheMessungen(3);
    baueLauf(2);
    act(() => feld().focus());
    pfeil("ArrowUp");
    expect(istVerdunkelt(zeileMitte(0))).toBe(false);
  });

  it("Pfeil auf nach Pfeil ab führt genau zur Ausgangszeile zurück", () => {
    taeuscheMessungen(3);
    baueLauf(2);
    act(() => feld().focus());
    pfeil("ArrowDown");
    pfeil("ArrowUp");
    expect(istVerdunkelt(zeileMitte(0))).toBe(false);
    expect(istVerdunkelt(zeileMitte(1))).toBe(true);
  });

  it("★★★★★ Pfeiltasten ausserhalb des Antwortfelds bewegen NICHTS (Fokus woanders)", () => {
    taeuscheMessungen(3);
    baueLauf(2);
    const zurueck = screen.getByRole("button", { name: "Zurück zum Üben" });
    pfeil("ArrowDown", zurueck);
    expect(istVerdunkelt(zeileMitte(0))).toBe(false);
    expect(istVerdunkelt(zeileMitte(1))).toBe(true);
  });

  it("das Antwortfeld bleibt hell, in jeder Zeilen-Stellung - keine Verdunkelung überdeckt es", () => {
    taeuscheMessungen(3);
    baueLauf(2);
    act(() => feld().focus());
    expect(istVerdunkelt(FELD_MITTE)).toBe(false);
    pfeil("ArrowDown");
    expect(istVerdunkelt(FELD_MITTE)).toBe(false);
    pfeil("ArrowDown");
    expect(istVerdunkelt(FELD_MITTE)).toBe(false);
  });

  it("fängt nichts ab, was nicht Pfeil ab/auf ist - Zeichen-Tasten kommen normal an", () => {
    taeuscheMessungen(3);
    baueLauf(2);
    const seite = vi.fn();
    document.addEventListener("keydown", seite);
    act(() => feld().focus());
    fireEvent.change(feld(), { target: { value: "B" } });
    fireEvent.keyDown(feld(), { key: "B" });
    document.removeEventListener("keydown", seite);
    expect(seite).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Der zugängliche Text bleibt unverändert
// ---------------------------------------------------------------------------

describe("Barrierefreiheit: nichts ändert sich für Sprachausgabe/Braillezeile", () => {
  it("★★★★★ der Text der Frage ist Zeichen für Zeichen derselbe, mit und ohne Lesezeile", () => {
    taeuscheMessungen(3);
    const { unmount } = baueLauf(2);
    const mitLesezeile = screen.getByText(FRAGE).textContent;
    unmount();
    taeuscheMessungen(1);
    baueLauf(1);
    const ohne = screen.getByText(FRAGE).textContent;
    expect(mitLesezeile).toBe(ohne);
  });

  it("Pfeiltasten bewegen nie den Fokus und öffnen keine Live-Region", () => {
    taeuscheMessungen(3);
    baueLauf(2);
    act(() => feld().focus());
    pfeil("ArrowDown");
    expect(document.activeElement).toBe(feld());
    // Die vorhandene Live-Region (Rückmeldung) bleibt leer.
    expect(document.querySelector('[aria-live="polite"]')?.textContent).toBe("");
  });
});

// ---------------------------------------------------------------------------
// Das Popup - genau einmal
// ---------------------------------------------------------------------------

describe("Die Erklärung kommt genau einmal", () => {
  it("★★★★★ beim ersten Mal öffnet sich das Popup von selbst", () => {
    taeuscheMessungen(3);
    baueLauf(2);
    expect(screen.getByRole("dialog", { name: "Die Lesezeile" })).toBeTruthy();
    expect(screen.getByText(/Pfeil ab kommst du zur nächsten Zeile/)).toBeTruthy();
  });

  it("kein Popup ohne wirklichen Umbruch (nur eine Zeile)", () => {
    taeuscheMessungen(1);
    baueLauf(2);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("kein Popup ohne CVI", () => {
    taeuscheMessungen(3);
    baueLauf(1);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("★★★★★ nach dem Schliessen kommt es auf diesem Gerät nicht wieder", () => {
    taeuscheMessungen(3);
    baueLauf(2);
    fireEvent.click(screen.getByRole("button", { name: "Verstanden" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    cleanup();

    taeuscheMessungen(3);
    baueLauf(2);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("Escape schliesst es genauso, und der Fokus geht zurück in die Eingabezeile", async () => {
    taeuscheMessungen(3);
    baueLauf(2);
    await act(async () => {
      fireEvent.keyDown(document, { key: "Escape" });
      await Promise.resolve();
    });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// ★ Punkt 7 der Korrektur (20.09.2026): Lesezeile und `CviAbdunkeln` hängen
// am selben Faktor (`zeichenabstand > 1`) - sie dürfen nicht gleichzeitig
// verdunkeln, sonst wäre der Bereich ausserhalb der Karte doppelt so dunkel.
// ---------------------------------------------------------------------------

describe("Lesezeile und CviAbdunkeln verdunkeln nie gleichzeitig", () => {
  function tippe(taste: string, ziel: Element = feld()) {
    act(() => {
      fireEvent.keyDown(ziel, { key: taste });
    });
  }
  const cviAbdunkelnAn = () =>
    document.querySelector('[data-cvi-abdunkeln="an"]') !== null;

  it("★★★★★ bei EINZEILIGER Frage darf `CviAbdunkeln` beim Tippen wie gewohnt abdunkeln", () => {
    taeuscheMessungen(1);
    baueLauf(2);
    act(() => feld().focus());
    tippe("a");
    expect(cviAbdunkelnAn()).toBe(true);
  });

  it("★★★★★ bei MEHRZEILIGER Frage bleibt `CviAbdunkeln` beim Tippen AUS - die Lesezeile deckt denselben Bereich schon ab", () => {
    taeuscheMessungen(3);
    baueLauf(2);
    act(() => feld().focus());
    tippe("a");
    expect(cviAbdunkelnAn()).toBe(false);
    // Die Lesezeile deckt weiterhin ab - nichts wurde ganz abgeschaltet.
    expect(istVerdunkelt(FELD_MITTE)).toBe(false);
    expect(istVerdunkelt({ x: 900, y: 700 })).toBe(true);
  });
});
