/**
 * ★★★★ WÄCHTER: Die Umschalttaste zählt im Lückentext mit - und im
 * Fingerdiktat nicht (02.09.2026).
 *
 * ── Warum dieser Wächter ──────────────────────────────────────────────────
 *
 * Johannes am 02.09.2026: *„Bei Lückentext achte auf die richtige
 * Großschreibung!"* Bis dahin warf `trifft()` in `RaetselLauf` die Groß- und
 * Kleinschreibung weg - „nase" zählte wie „Nase". In einem Programm, das
 * Zehnfingerschreiben beibringt, ist die Umschalttaste aber kein Beiwerk,
 * sondern der Lehrgegenstand: Wer sie nicht drückt, hat die Aufgabe nicht
 * gelöst, sondern eine leichtere.
 *
 * ⚠️ Die Nachsicht war nicht überall falsch. Beim FINGERDIKTAT ist die
 * Antwort der Buchstabe, der auf einem Finger liegt - „K" statt „k" wäre dort
 * ein zweiter, gar nicht gefragter Tastendruck und kein Fehler im Sinne der
 * Aufgabe. Deshalb entscheidet die FORM (`grossKleinZaehlt`), nicht der
 * Bildschirm. Genau diese Unterscheidung sichert der Wächter - ein Test, der
 * nur „Großschreibung zählt" prüfte, würde das Fingerdiktat kaputtmachen und
 * es niemandem sagen.
 *
 * ★★ Und: Ein Kind, dem nur die Umschalttaste fehlt, darf kein blosses „Noch
 * nicht" hören. Es sucht den Fehler dann im Wort und findet keinen. Die dritte
 * Prüfung unten sichert den eigenen Satz dafür.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { RaetselLauf } from "@/components/typing/RaetselLauf";
import { lueckentext } from "@/lib/typing/uebungsformen/lueckentext";
import { fingerdiktat } from "@/lib/typing/uebungsformen/fingerdiktat";

afterEach(cleanup);

function antworte(text: string) {
  const feld = screen.getByRole("textbox") as HTMLInputElement;
  fireEvent.change(feld, { target: { value: text } });
  fireEvent.keyDown(feld, { key: "Enter" });
}

/** Ein Rätsel-Lauf mit einer einzigen Aufgabe - zählt die Treffer mit. */
function baueLauf(grossKleinZaehlt: boolean) {
  const treffer: Array<{ richtig: number; gesamt: number }> = [];
  render(
    <RaetselLauf
      titel={`Probe`}
      ankuendigung={`Probe.`}
      aufgaben={[{ frage: `Zum Riechen braucht man die ...`, antworten: ["Nase"] }]}
      grossKleinZaehlt={grossKleinZaehlt}
      contextId={`form:probe`}
      onFertig={(richtig, gesamt) => treffer.push({ richtig, gesamt })}
      onAbbruch={() => {}}
    />,
  );
  return treffer;
}

describe(`★★★★ Die FORM entscheidet, ob die Umschalttaste zaehlt`, () => {
  it(`der Lueckentext verlangt sie`, () => {
    expect(lueckentext.grossKleinZaehlt).toBe(true);
  });

  it(`das Fingerdiktat verlangt sie NICHT - dort ist der Buchstabe die Antwort`, () => {
    expect(fingerdiktat.grossKleinZaehlt).toBeFalsy();
  });
});

describe(`★★★★ Mit grossKleinZaehlt zaehlt die Schreibung`, () => {
  it(`die genaue Schreibung ist richtig`, async () => {
    // Geprueft wird, was das Kind SOFORT hoert - und danach, dass die Aufgabe
    // auch gezaehlt wurde. Der Bildschirm geht erst nach 900 ms weiter,
    // deshalb `waitFor` fuer den zweiten Teil.
    const treffer = baueLauf(true);
    antworte("Nase");
    expect(screen.getByText(/Richtig/)).toBeTruthy();
    await vi.waitFor(() => expect(treffer).toEqual([{ richtig: 1, gesamt: 1 }]), {
      timeout: 3000,
    });
  });

  it(`klein geschrieben zaehlt NICHT als richtig`, () => {
    baueLauf(true);
    antworte("nase");
    expect(screen.queryByText(/Richtig/)).toBeNull();
  });

  it(`★★ und das Kind hoert, WORAN es liegt - nicht blosses "Noch nicht"`, () => {
    baueLauf(true);
    antworte("nase");
    expect(screen.getByText(/achte auf die Großschreibung/i)).toBeTruthy();
    // Der Satz darf NICHT der gewoehnliche Fehlversuch-Satz sein.
    expect(screen.queryByText(/^Noch nicht/)).toBeNull();
  });

  it(`das Feld ist danach leer - sonst schreibt das Kind an den Fehler an`, () => {
    baueLauf(true);
    antworte("nase");
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("");
  });
});

describe(`★★★★ Ohne grossKleinZaehlt bleibt es nachsichtig`, () => {
  it(`klein geschrieben zaehlt als richtig`, async () => {
    const treffer = baueLauf(false);
    antworte("nase");
    expect(screen.getByText(/Richtig/)).toBeTruthy();
    await vi.waitFor(() => expect(treffer).toEqual([{ richtig: 1, gesamt: 1 }]), {
      timeout: 3000,
    });
  });
});
