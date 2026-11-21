/**
 * ★★★★★ WÄCHTER: Fingerdiktat ohne „Prüfen"-Knopf, mit Klang (Punkte 14 + 15
 * aus Testerin Durchgang, `AUFTRAG-2026-09-20-HEIKES-17-PUNKTE.md`).
 *
 * Johannes, wörtlich (Punkt 15): *„Den 'Prüfen'-Button finde ich eigentlich
 * auch zu viel. Enter und gut oder ein Geräusch und direkt weiter oder wenn
 * falsch, dann wiederholen. Also gar nicht bestätigen."* Und (Punkt 14):
 * *„und auch, dass mit dem Drücken ein Sound kommt richtig/falsch."*
 *
 * Die Antwort ist beim Fingerdiktat EIN Zeichen (`Uebungsform.einzeichigeAntwort`,
 * `RaetselLauf.tsx`): Sobald es im Feld steht, wertet der Bildschirm SOFORT aus -
 * kein Knopf, kein Enter nötig. Enter bleibt zusätzlich möglich (manche Kinder
 * drücken es aus Gewohnheit) und darf dieselbe Antwort nicht doppelt zählen.
 *
 * ⚠️ NUR bei `einzeichigeAntwort` - Formen mit einem WORT als Antwort
 * (Lückentext & Co.) behalten den Prüfen-Knopf und bekommen keinen Klang bei
 * jedem Buchstaben (sonst würde nach dem ersten Buchstaben schon gewertet).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/lib/typing/sound", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing/sound")>();
  return {
    ...echt,
    playSuccessSound: vi.fn(),
    playErrorSound: vi.fn(),
  };
});

import { RaetselLauf } from "@/components/typing/RaetselLauf";
import { playErrorSound, playSuccessSound } from "@/lib/typing/sound";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const fingerdiktatAufgaben = [
  { frage: "rechter Mittelfinger", antworten: ["k"] },
  { frage: "linker Zeigefinger", antworten: ["f"] },
];

const lueckentextAufgaben = [
  { frage: "Giraffen haben einen langen ...", antworten: ["Hals"] },
];

function baueRaetsel(overrides: Partial<React.ComponentProps<typeof RaetselLauf>> = {}) {
  return render(
    <RaetselLauf
      titel="Fingerdiktat"
      ankuendigung="Jetzt kommt ein Fingerdiktat."
      aufgaben={fingerdiktatAufgaben}
      contextId="form:fingerdiktat"
      onFertig={() => {}}
      onAbbruch={() => {}}
      {...overrides}
    />,
  );
}

describe("Punkt 15 - kein Prüfen-Knopf bei einzeichiger Antwort", () => {
  it("zeigt KEINEN Prüfen-Knopf, wenn einzeichigeAntwort gesetzt ist", () => {
    baueRaetsel({ einzeichigeAntwort: true });
    expect(screen.queryByRole("button", { name: /Prüfen/i })).not.toBeInTheDocument();
    // Zurück zum Üben bleibt - ESC/der zweite Schalter verschwindet nicht mit.
    expect(screen.getByRole("button", { name: /Zurück zum Üben/i })).toBeInTheDocument();
  });

  it("zeigt den Prüfen-Knopf weiterhin, wenn einzeichigeAntwort NICHT gesetzt ist (Lückentext & Co.)", () => {
    baueRaetsel({ aufgaben: lueckentextAufgaben, grossKleinZaehlt: true });
    expect(screen.getByRole("button", { name: /Prüfen/i })).toBeInTheDocument();
  });

  it("richtige Eingabe wertet SOFORT, ganz ohne Enter und ohne Knopf", () => {
    const gemeldet: Array<Record<string, unknown>> = [];
    baueRaetsel({
      einzeichigeAntwort: true,
      onAufgabeFertig: (e) => gemeldet.push(e as unknown as Record<string, unknown>),
    });
    const feld = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(feld, { target: { value: "k" } }); // KEIN Enter, KEIN Klick
    expect(screen.getByText(/Richtig/)).toBeInTheDocument();
    expect(gemeldet).toHaveLength(1);
    expect(gemeldet[0].errors).toBe(0);
  });

  it("falsche Eingabe wertet SOFORT und bleibt bei derselben Aufgabe, bis sie sitzt", () => {
    const gemeldet: Array<Record<string, unknown>> = [];
    baueRaetsel({
      einzeichigeAntwort: true,
      onAufgabeFertig: (e) => gemeldet.push(e as unknown as Record<string, unknown>),
    });
    const feld = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(feld, { target: { value: "z" } }); // falsch, kein Enter
    expect(gemeldet).toHaveLength(0); // erster Fehlversuch: die Aufgabe läuft noch
    expect(feld.value).toBe(""); // Feld leert sich von selbst für den nächsten Versuch
    // dieselbe Aufgabe steht weiterhin an - "rechter Mittelfinger" ist noch die Frage.
    expect(screen.getByText(/rechter Mittelfinger/)).toBeInTheDocument();
    fireEvent.change(feld, { target: { value: "k" } }); // jetzt richtig, wieder kein Enter
    expect(gemeldet).toHaveLength(1);
    expect(gemeldet[0].errors).toBe(1);
  });

  it("Enter funktioniert weiterhin (Gewohnheit) und zählt dieselbe Antwort nicht doppelt", () => {
    const gemeldet: Array<Record<string, unknown>> = [];
    baueRaetsel({
      einzeichigeAntwort: true,
      onAufgabeFertig: (e) => gemeldet.push(e as unknown as Record<string, unknown>),
    });
    const feld = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(feld, { target: { value: "k" } }); // wertet schon hier aus
    fireEvent.keyDown(feld, { key: "Enter" }); // gewohnheitsmässig zusätzlich gedrückt
    expect(gemeldet).toHaveLength(1); // NICHT doppelt gezählt
  });
});

describe("Punkt 14 - Klang für richtig und falsch, nur bei einzeichiger Antwort", () => {
  it("spielt den Erfolgs-Klang bei richtiger Eingabe", () => {
    baueRaetsel({ einzeichigeAntwort: true });
    const feld = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(feld, { target: { value: "k" } });
    expect(playSuccessSound).toHaveBeenCalledTimes(1);
    expect(playErrorSound).not.toHaveBeenCalled();
  });

  it("spielt den Fehler-Klang bei falscher Eingabe", () => {
    baueRaetsel({ einzeichigeAntwort: true });
    const feld = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(feld, { target: { value: "z" } });
    expect(playErrorSound).toHaveBeenCalledTimes(1);
    expect(playSuccessSound).not.toHaveBeenCalled();
  });

  it("spielt KEINEN Klang bei Formen ohne einzeichige Antwort (Lückentext & Co.)", () => {
    baueRaetsel({ aufgaben: lueckentextAufgaben, grossKleinZaehlt: true });
    const feld = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(feld, { target: { value: "Hals" } });
    fireEvent.keyDown(feld, { key: "Enter" }); // hier weiterhin nötig - kein Auto-Check
    expect(playSuccessSound).not.toHaveBeenCalled();
    expect(playErrorSound).not.toHaveBeenCalled();
  });
});
