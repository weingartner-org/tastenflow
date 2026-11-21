/**
 * ★★★★ WÄCHTER: Grossschreibung zählt in den Wortspielen erst, wenn die
 * Umschalttaste im Tastenstand des Kindes eingeführt ist (A1, 11.09.2026).
 *
 * ── Befund ────────────────────────────────────────────────────────────────
 *
 * `wasfehlt.ts`, `lueckentext.ts` und `korrekturlesen.ts` setzen alle
 * `grossKleinZaehlt: true` - das Wort soll so geschrieben werden, wie es im
 * Text steht. `RaetselLauf` hat dafür schon `shiftLearned`, das aber beim
 * Aufruf in `pruefen()` bisher NICHT verrechnet wurde: `trifft()` bekam nur
 * `grossKleinZaehlt`, nie `shiftLearned`. Ein Kind, das die Umschalttaste
 * noch nie geübt hat, hörte bei „wasser" statt „Wasser" also „Fast - achte
 * auf die Großschreibung" - für eine Taste, die es im eigenen Tastenstand
 * noch gar nicht gibt.
 *
 * ★ Nie etwas gegen ein Kind: Vor der Umschalttaste wird gross/klein-
 * unabhängig verglichen. Die Ansage/Auflösung nennt das Wort trotzdem in der
 * richtigen Schreibung (`aufgabe.antworten[0]` - unverändert).
 *
 * Zwei Fälle, dieselbe Aufgabe, nur `shiftLearned` unterscheidet sie:
 *   - OHNE Umschalttaste im Tastenstand: „wasser" ist RICHTIG.
 *   - MIT Umschalttaste im Tastenstand: „wasser" ist NUR-SCHREIBUNG (das Wort
 *     stimmt, die Grossschreibung fehlt) - kein blosses „Noch nicht".
 *
 * Vorlage: `tests/tastenflow-grossschreibung-raetsel.test.tsx`.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { RaetselLauf } from "@/components/typing/RaetselLauf";
import { wasfehlt } from "@/lib/typing/uebungsformen/wasfehlt";
import { lueckentext } from "@/lib/typing/uebungsformen/lueckentext";
import { korrekturlesen } from "@/lib/typing/uebungsformen/korrekturlesen";

afterEach(cleanup);

function antworte(text: string) {
  const feld = screen.getByRole("textbox") as HTMLInputElement;
  fireEvent.change(feld, { target: { value: text } });
  fireEvent.keyDown(feld, { key: "Enter" });
}

/** Ein Rätsel-Lauf mit „Wasser" als Antwort - zählt die Treffer mit. */
function baueLauf(shiftLearned: boolean) {
  const treffer: Array<{ richtig: number; gesamt: number }> = [];
  render(
    <RaetselLauf
      titel={`Probe`}
      ankuendigung={`Probe.`}
      aufgaben={[{ frage: `Zum Trinken braucht man ...`, antworten: ["Wasser"] }]}
      grossKleinZaehlt={true}
      shiftLearned={shiftLearned}
      contextId={`form:probe`}
      onFertig={(richtig, gesamt) => treffer.push({ richtig, gesamt })}
      onAbbruch={() => {}}
    />,
  );
  return treffer;
}

describe(`★★★★ Alle drei Wortspiele verlangen die Umschalttaste als Lehrgegenstand`, () => {
  it(`Was fehlt hier?`, () => {
    expect(wasfehlt.grossKleinZaehlt).toBe(true);
  });
  it(`Lückentext`, () => {
    expect(lueckentext.grossKleinZaehlt).toBe(true);
  });
  it(`Korrekturlesen`, () => {
    expect(korrekturlesen.grossKleinZaehlt).toBe(true);
  });
});

describe(`★★★★ OHNE Umschalttaste im Tastenstand: gross/klein-unabhängig`, () => {
  it(`„wasser" zählt als richtig - die Umschalttaste ist noch nicht dran`, async () => {
    const treffer = baueLauf(false);
    antworte("wasser");
    expect(screen.getByText(/Richtig/)).toBeTruthy();
    await vi.waitFor(() => expect(treffer).toEqual([{ richtig: 1, gesamt: 1 }]), {
      timeout: 3000,
    });
  });

  it(`kein Hinweis auf die Großschreibung`, () => {
    baueLauf(false);
    antworte("wasser");
    expect(screen.queryByText(/Großschreibung/i)).toBeNull();
  });
});

describe(`★★★★ MIT Umschalttaste im Tastenstand: die Schreibung zählt`, () => {
  it(`„wasser" ist NUR-SCHREIBUNG, nicht "richtig"`, () => {
    baueLauf(true);
    antworte("wasser");
    expect(screen.queryByText(/Richtig/)).toBeNull();
  });

  it(`★★ das Kind hört, WORAN es liegt - nicht blosses "Noch nicht"`, () => {
    baueLauf(true);
    antworte("wasser");
    expect(screen.getByText(/achte auf die Großschreibung/i)).toBeTruthy();
    expect(screen.queryByText(/^Noch nicht/)).toBeNull();
  });

  it(`richtig geschrieben („Wasser") zählt weiter als richtig`, async () => {
    const treffer = baueLauf(true);
    antworte("Wasser");
    expect(screen.getByText(/Richtig/)).toBeTruthy();
    await vi.waitFor(() => expect(treffer).toEqual([{ richtig: 1, gesamt: 1 }]), {
      timeout: 3000,
    });
  });
});
