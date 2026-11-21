/**
 * Wächter für `Aufklappen` (Johannes 19.09.2026: „der Rest rutscht nach
 * unten und der andere kommt nach").
 *
 * jsdom kann keine Web-Animation - dort klappt der Bereich SOFORT auf und
 * zu, genau wie vorher, und alle anderen Tests sehen denselben Baum. Hier
 * wird `animate` nachgebildet, um die Bewegung selbst zu prüfen.
 */
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Aufklappen, aufklappDauer } from "../src/components/Aufklappen";

type Lauf = {
  keyframes: Keyframe[];
  optionen: KeyframeAnimationOptions;
  onfinish: (() => void) | null;
  cancel: ReturnType<typeof vi.fn>;
};

let laeufe: Lauf[] = [];
const echteMatchMedia = window.matchMedia;

function bewegungNachbilden(hoehe = 120) {
  laeufe = [];
  (HTMLElement.prototype as unknown as { animate: unknown }).animate = function (
    keyframes: Keyframe[],
    optionen: KeyframeAnimationOptions,
  ) {
    const lauf: Lauf = { keyframes, optionen, onfinish: null, cancel: vi.fn() };
    laeufe.push(lauf);
    return lauf;
  };
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    height: hoehe,
    width: 300,
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 300,
    bottom: hoehe,
    toJSON: () => ({}),
  } as DOMRect);
}

function Probe({ offen }: { offen: boolean }) {
  return (
    <div>
      <Aufklappen offen={offen} id="bereich">
        <p>Neuer Bereich</p>
        <button type="button">Darin</button>
      </Aufklappen>
      <p>Alles darunter</p>
    </div>
  );
}

afterEach(() => {
  delete (HTMLElement.prototype as unknown as { animate?: unknown }).animate;
  window.matchMedia = echteMatchMedia;
  vi.restoreAllMocks();
});

describe("ohne Web-Animation (jsdom, alle anderen Tests)", () => {
  it("klappt sofort auf und zu - zugeklappt steht nichts im Baum", () => {
    const { rerender } = render(<Probe offen={false} />);
    expect(screen.queryByText("Neuer Bereich")).toBeNull();
    rerender(<Probe offen />);
    expect(screen.getByText("Neuer Bereich")).toBeInTheDocument();
    expect(document.getElementById("bereich")).not.toBeNull();
    rerender(<Probe offen={false} />);
    expect(screen.queryByText("Neuer Bereich")).toBeNull();
    expect(document.getElementById("bereich")).toBeNull();
  });
});

describe("mit Web-Animation", () => {
  beforeEach(() => bewegungNachbilden(120));

  it("wächst beim Öffnen von 0 auf seine Höhe - der Rest gleitet mit", () => {
    const { rerender } = render(<Probe offen={false} />);
    rerender(<Probe offen />);
    expect(laeufe).toHaveLength(1);
    const [von, bis] = laeufe[0].keyframes;
    expect(von.height).toBe("0px");
    expect(von.opacity).toBe(0);
    expect(bis.height).toBe("120px");
    expect(laeufe[0].optionen.duration).toBe(aufklappDauer(120));
    const kasten = document.getElementById("bereich")!;
    expect(kasten.style.overflow).toBe("clip");
    act(() => laeufe[0].onfinish?.());
    expect(kasten.style.overflow).toBe("");
  });

  it("wer schon offen auf die Seite kommt, klappt nicht auf", () => {
    render(<Probe offen />);
    expect(laeufe).toHaveLength(0);
  });

  it("beim Schließen ist der Bereich sofort unerreichbar und verschwindet erst am Ende", () => {
    const { rerender } = render(<Probe offen />);
    rerender(<Probe offen={false} />);
    expect(laeufe).toHaveLength(1);
    const kasten = document.getElementById("bereich")!;
    expect(kasten).toHaveAttribute("inert");
    expect(kasten).toHaveAttribute("aria-hidden", "true");
    expect(laeufe[0].keyframes[1].height).toBe("0px");
    // Für Tabtaste und Screenreader ist er schon weg, fürs Auge noch da.
    expect(screen.queryByRole("button", { name: "Darin" })).toBeNull();
    expect(screen.getByText("Neuer Bereich")).toBeInTheDocument();
    act(() => laeufe[0].onfinish?.());
    expect(screen.queryByText("Neuer Bereich")).toBeNull();
  });

  it("wieder öffnen mitten im Schließen: die alte Bewegung endet, die neue beginnt", () => {
    const { rerender } = render(<Probe offen />);
    rerender(<Probe offen={false} />);
    rerender(<Probe offen />);
    expect(laeufe).toHaveLength(2);
    expect(laeufe[0].cancel).toHaveBeenCalled();
    const kasten = document.getElementById("bereich")!;
    expect(kasten).not.toHaveAttribute("inert");
    // Das Ende der abgebrochenen Bewegung räumt den Bereich NICHT weg.
    act(() => laeufe[0].onfinish?.());
    expect(screen.getByText("Neuer Bereich")).toBeInTheDocument();
  });

  it("die Hülle kommt und geht mit dem Bereich (Tabellenzeile)", () => {
    function Tabelle({ offen }: { offen: boolean }) {
      return (
        <table>
          <tbody>
            <tr>
              <td>Kind</td>
            </tr>
            <Aufklappen
              offen={offen}
              huelle={(k) => (
                <tr data-testid="zeile">
                  <td>{k}</td>
                </tr>
              )}
            >
              <p>Einzelheiten</p>
            </Aufklappen>
          </tbody>
        </table>
      );
    }
    const { rerender } = render(<Tabelle offen={false} />);
    expect(screen.queryByTestId("zeile")).toBeNull();
    rerender(<Tabelle offen />);
    expect(screen.getByTestId("zeile")).toBeInTheDocument();
    rerender(<Tabelle offen={false} />);
    expect(screen.getByTestId("zeile")).toBeInTheDocument();
    act(() => laeufe[laeufe.length - 1].onfinish?.());
    expect(screen.queryByTestId("zeile")).toBeNull();
  });

  it("bleibt: zugeklappt steht der Bereich versteckt im Baum, hidden erst nach dem Schrumpfen", () => {
    function Formular({ offen }: { offen: boolean }) {
      return (
        <Aufklappen offen={offen} bleibt>
          {(verborgen) => (
            <section aria-label="Panel" hidden={verborgen}>
              <input aria-label="Eingabe" defaultValue="Stand" />
            </section>
          )}
        </Aufklappen>
      );
    }
    const { rerender, container } = render(<Formular offen={false} />);
    const panel = () => container.querySelector("section")!;
    expect(panel()).toHaveAttribute("hidden");
    expect(laeufe).toHaveLength(0);
    rerender(<Formular offen />);
    expect(panel()).not.toHaveAttribute("hidden");
    expect(laeufe).toHaveLength(1);
    rerender(<Formular offen={false} />);
    // Während des Schrumpfens noch sichtbar, aber schon unerreichbar.
    expect(panel()).not.toHaveAttribute("hidden");
    expect(panel().parentElement).toHaveAttribute("inert");
    act(() => laeufe[1].onfinish?.());
    expect(panel()).toHaveAttribute("hidden");
    expect(panel().parentElement).toHaveAttribute("hidden");
    expect(panel().parentElement).not.toHaveAttribute("inert");
    // Die festgehaltene Höhe 0 ist erst weg, wenn `hidden` greift.
    expect(laeufe[1].cancel).toHaveBeenCalled();
    rerender(<Formular offen />);
    expect(laeufe).toHaveLength(3);
    expect(laeufe[2].keyframes[0].height).toBe("0px");
  });

  it("bei „weniger Bewegung\" im System klappt alles sofort", () => {
    window.matchMedia = ((q: string) => ({
      matches: q.includes("reduce"),
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
    const { rerender } = render(<Probe offen={false} />);
    rerender(<Probe offen />);
    rerender(<Probe offen={false} />);
    expect(laeufe).toHaveLength(0);
    expect(screen.queryByText("Neuer Bereich")).toBeNull();
  });

  it("lange Bereiche bewegen sich ruhiger, aber nie länger als 450 ms", () => {
    expect(aufklappDauer(40)).toBeLessThan(aufklappDauer(400));
    expect(aufklappDauer(5000)).toBe(450);
  });
});
