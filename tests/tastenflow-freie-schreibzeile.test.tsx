/**
 * WÄCHTER über die Zeile des freien Schreibens (23.09.2026,
 * `BAUPLAN-2026-09-23-FREIES-SCHREIBEN.md` §7): Fehler bleiben stehen, die
 * Rücktaste bessert nur in der aktuellen Zeile aus, keine Markierung, keine
 * Live-Meldung beim Tippen. Was am Textstrom-Vergleich hängt (Fehler,
 * Fehlerarten), prüft `tests/tastenflow-frei-vergleich.test.ts` - hier geht es
 * nur um die BEDIENUNG der Zeile selbst.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import {
  FreieSchreibzeile,
  type FreieSchreibzeileProps,
  type FreieZeileFertig,
} from "@/components/typing/FreieSchreibzeile";
import type { ZeichenabstandFaktor } from "@/lib/typing";

afterEach(() => cleanup());

/**   (das sichtbare Leerzeichen der Zeile) zurück in ein normales - für lesbare Assertions. */
function text(el: Element | null): string {
  return (el?.textContent ?? "").replace(/ /g, " ");
}

function aufbauen(over: Partial<FreieSchreibzeileProps> = {}) {
  const onZeileFertig = vi.fn<(e: FreieZeileFertig) => void>();
  const ergebnis = render(
    <FreieSchreibzeile
      items={["hallo welt heute"]}
      stufe="kids"
      voiceEnabled={false}
      zeichenabstand={1 as ZeichenabstandFaktor}
      onZeileFertig={onZeileFertig}
      {...over}
    />,
  );
  const feld = () => ergebnis.container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]')!;
  const sollZeile = () => ergebnis.container.querySelector('[data-zeile="soll"]');
  const istZeile = () => ergebnis.container.querySelector('[data-zeile="ist"]');
  return { ...ergebnis, feld, sollZeile, istZeile, onZeileFertig };
}

describe("Tippen schreibt ins Ist", () => {
  it("jedes Zeichen landet in der sichtbaren Ist-Zeile", async () => {
    const { feld, istZeile } = aufbauen();
    await act(async () => {
      fireEvent.keyDown(feld(), { key: "h" });
      fireEvent.keyDown(feld(), { key: "a" });
    });
    expect(text(istZeile())).toBe("ha");
  });
});

describe("Rücktaste", () => {
  it("löscht nur in der aktuellen Zeile und zählt als Korrektur", async () => {
    const { feld, istZeile, onZeileFertig } = aufbauen({ zeilenEnde: true });
    await act(async () => {
      fireEvent.keyDown(feld(), { key: "h" });
      fireEvent.keyDown(feld(), { key: "a" });
      fireEvent.keyDown(feld(), { key: "Backspace" });
    });
    expect(text(istZeile())).toBe("h");
    // Zeile abschliessen (Enter, weil zeilenEnde=true) - die Korrektur ist mitgekommen.
    await act(async () => {
      fireEvent.keyDown(feld(), { key: "Enter" });
    });
    expect(onZeileFertig).toHaveBeenCalledTimes(1);
    expect(onZeileFertig.mock.calls[0][0]).toMatchObject({ ist: "h", korrekturen: 1 });
  });

  it("bei leerer Zeile tut sie nichts - keine Korrektur gezählt", async () => {
    const { feld, istZeile, onZeileFertig } = aufbauen({ zeilenEnde: true });
    await act(async () => {
      fireEvent.keyDown(feld(), { key: "Backspace" });
    });
    expect(text(istZeile())).toBe("");
    await act(async () => {
      fireEvent.keyDown(feld(), { key: "Enter" });
    });
    expect(onZeileFertig.mock.calls[0][0]).toMatchObject({ ist: "", korrekturen: 0 });
  });
});

describe("Bewegungstasten bewegen nichts", () => {
  it("Pfeiltasten, Entf, Pos1, Ende ändern weder Ist noch Schreibmarke", async () => {
    const { feld, istZeile } = aufbauen();
    await act(async () => {
      fireEvent.keyDown(feld(), { key: "h" });
      fireEvent.keyDown(feld(), { key: "a" });
    });
    const vorher = feld().selectionStart;
    for (const taste of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Delete", "Home", "End"]) {
      let durchgelassen = true;
      await act(async () => {
        durchgelassen = fireEvent.keyDown(feld(), { key: taste });
      });
      expect(durchgelassen, `${taste} muss verhindert werden`).toBe(false);
    }
    expect(text(istZeile())).toBe("ha");
    expect(feld().selectionStart).toBe(vorher);
  });
});

describe("Zeilenende per Leertaste (ohne Enter-Einstellung)", () => {
  it("beendet die Zeile, sobald die Ist-Zeile so viele Wörter wie die Soll-Zeile hat - das Leerzeichen wird nicht angehängt", async () => {
    const { feld, onZeileFertig, istZeile } = aufbauen({
      items: ["hallo welt", "naechste zeile"],
      zeilenEnde: false,
    });
    for (const taste of "hallo") {
      await act(async () => {
        fireEvent.keyDown(feld(), { key: taste });
      });
    }
    await act(async () => {
      fireEvent.keyDown(feld(), { key: " " }); // normales Leerzeichen - erst EIN Wort
    });
    for (const taste of "welt") {
      await act(async () => {
        fireEvent.keyDown(feld(), { key: taste });
      });
    }
    expect(text(istZeile())).toBe("hallo welt");
    await act(async () => {
      fireEvent.keyDown(feld(), { key: " " }); // zweites Wort fertig ⇒ Zeilenende
    });
    expect(onZeileFertig).toHaveBeenCalledTimes(1);
    expect(onZeileFertig.mock.calls[0][0]).toMatchObject({ ist: "hallo welt" });
    // Die neue Zeile steht da, leer - das Leerzeichen wurde NICHT angehängt.
    expect(text(istZeile())).toBe("");
  });

  it("Enter bleibt ohne die Einstellung wirkungslos", async () => {
    const { feld, onZeileFertig, istZeile } = aufbauen({
      items: ["hallo welt"],
      zeilenEnde: false,
    });
    await act(async () => {
      fireEvent.keyDown(feld(), { key: "h" });
      fireEvent.keyDown(feld(), { key: "Enter" });
    });
    expect(onZeileFertig).not.toHaveBeenCalled();
    expect(text(istZeile())).toBe("h");
  });
});

describe("Zeilenende per Enter (mit Klassen-Einstellung)", () => {
  it("Enter beendet die Zeile, die Leertaste bleibt ein normales Zeichen", async () => {
    const { feld, onZeileFertig, istZeile } = aufbauen({
      items: ["hallo welt", "naechste zeile"],
      zeilenEnde: true,
    });
    for (const taste of "hallo") {
      await act(async () => {
        fireEvent.keyDown(feld(), { key: taste });
      });
    }
    await act(async () => {
      fireEvent.keyDown(feld(), { key: " " });
    });
    // Die Leertaste hat NICHT beendet - "welt" ist noch offen.
    expect(onZeileFertig).not.toHaveBeenCalled();
    expect(text(istZeile())).toBe("hallo ");
    await act(async () => {
      fireEvent.keyDown(feld(), { key: "Enter" });
    });
    expect(onZeileFertig).toHaveBeenCalledTimes(1);
    expect(onZeileFertig.mock.calls[0][0]).toMatchObject({ ist: "hallo " });
  });
});

describe("Feldwert und Schreibmarke", () => {
  it("der Feldwert ist Präfix + Soll, ohne Zeilenumbruch", () => {
    const { feld } = aufbauen({ items: ["hallo welt"], zeilenPraefix: "07:04   " });
    expect(feld().value).toBe("07:04   hallo welt");
    expect(feld().value).not.toContain("\n");
  });

  it("die Schreibmarke steht auf praefix.length + min(ist.length, soll.length)", async () => {
    const { feld } = aufbauen({ items: ["hi"], zeilenPraefix: "07:04   " });
    expect(feld().selectionStart).toBe("07:04   ".length);
    await act(async () => {
      fireEvent.keyDown(feld(), { key: "h" });
    });
    expect(feld().selectionStart).toBe("07:04   ".length + 1);
    // Über die Soll-Länge hinaus (Fehler bleiben stehen) - der Zeiger bleibt
    // am ENDE der Soll-Zeile stehen (min-Funktion), damit die Braillezeile
    // nicht über die Vorlage hinausläuft.
    await act(async () => {
      fireEvent.keyDown(feld(), { key: "i" });
      fireEvent.keyDown(feld(), { key: "x" });
      fireEvent.keyDown(feld(), { key: "x" });
    });
    expect(feld().selectionStart).toBe("07:04   ".length + 2);
  });
});

describe("Keine Markierung, keine Live-Meldung beim Tippen", () => {
  it("kein role=alert/status meldet etwas, während getippt wird", async () => {
    const { feld, container } = aufbauen({ items: ["ab"] });
    await act(async () => {
      fireEvent.keyDown(feld(), { key: "x" }); // falsches Zeichen ("a" wäre richtig)
    });
    for (const bereich of container.querySelectorAll('[role="alert"], [role="status"], [aria-live]')) {
      expect((bereich.textContent ?? "").trim()).toBe("");
    }
  });

  it("kein role=alert und keine Fehlerklasse bei einem falschen Zeichen", async () => {
    const { feld, istZeile, container } = aufbauen({ items: ["ab"] });
    await act(async () => {
      fireEvent.keyDown(feld(), { key: "x" }); // "a" wäre richtig
    });
    expect(text(istZeile())).toBe("x");
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(container.innerHTML).not.toMatch(/text-danger|bg-danger|tt-prompt-fehler/);
  });
});
