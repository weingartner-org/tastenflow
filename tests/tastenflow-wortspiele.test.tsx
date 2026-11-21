/**
 * ★★★ WÄCHTER: Der Bereich „Wortspiele" (02.09.2026).
 *
 * Johannes am 01.09.2026: *„warum nicht ein eigener bereich. Die Frage ist, ob
 * in Lektionen oder ein bereich mit Wortspiele so wie Geschichten (mir
 * vielleicht lieber)."* - und danach das Ja.
 *
 * ── Was hier gemessen wird und warum ──────────────────────────────────────
 *
 *  1. **Der Bereich steht in `TRAINER_MODES`** - an EINER Stelle. Daran hängen
 *     die Knöpfe im Zahnrad UND das Reihum-Kürzel Alt + B. Stünde er nur an
 *     einer der beiden, käme man mit der Tastatur nie hin.
 *  2. **Er hat eine Ansage in BEIDEN Sprachen.** Eine fehlende englische
 *     Fassung fällt niemandem auf, der deutsch übt - und dem englischen Kind
 *     bliebe der Bereich stumm.
 *  3. **Das Regal zeigt NAMEN, nicht Ankündigungen.** „Jetzt kommen
 *     Alphabet-Reihen" ist in einem Regal falsch: Es kommt nichts, bevor man
 *     sich etwas nimmt. Und bei Formen, die ihren Schwerpunkt auswürfeln, wäre
 *     es ein Versprechen, das die Runde danach nicht halten muss.
 *  4. **Was der Tastenstand nicht hergibt, steht nicht im Regal** - statt als
 *     toter Knopf dazustehen. Nichts wird je `disabled` (R5).
 *  5. **Der Anfangsfokus geht auf die Überschrift**, nicht auf den ersten
 *     Knopf: zuerst hören, wo man ist (dieselbe Regel wie bei der
 *     Abschluss-Karte, F1 vom 31.08.).
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import {
  TRAINER_MODES,
  TRAINER_MODE_LABELS,
  naechsteTrainerMode,
  trainerModeAnsage,
} from "@/lib/typing/trainerMode";
import { UEBUNGSFORMEN } from "@/lib/typing/uebungsformen";
import { Wortspiele } from "@/components/typing/Wortspiele";
import type { TypingProgress } from "@/lib/typing";

afterEach(cleanup);

const VOLL = [
  ..."abcdefghijklmnopqrstuvwxyzäöüß".split(""),
  "⇧",
  ".",
  ",",
];

function stand(introduced: string[]): () => Promise<TypingProgress> {
  return async () => ({ xp: 0, lessons: {}, letters: {}, introduced });
}

describe(`Wortspiele als vierter Bereich`, () => {
  it(`steht in der EINEN Liste, aus der Knöpfe und Kürzel kommen`, () => {
    expect(TRAINER_MODES).toContain("wortspiele");
    expect(TRAINER_MODE_LABELS.wortspiele).toBe("Wortspiele");
  });

  it(`ist über das Reihum-Kürzel wirklich erreichbar`, () => {
    // Alt + B geht reihum. Von jedem Bereich aus muss man in endlich vielen
    // Schritten bei den Wortspielen landen - sonst gibt es einen Bereich, den
    // man mit der Tastatur nie erreicht.
    let m = TRAINER_MODES[0];
    const gesehen = new Set([m]);
    for (let i = 0; i < TRAINER_MODES.length; i++) {
      m = naechsteTrainerMode(m);
      gesehen.add(m);
    }
    expect(gesehen.has("wortspiele")).toBe(true);
    expect(gesehen.size).toBe(TRAINER_MODES.length);
  });

  it(`hat eine Ansage in BEIDEN Sprachen`, () => {
    const de = trainerModeAnsage("wortspiele", "de");
    const en = trainerModeAnsage("wortspiele", "en");
    expect(de.length).toBeGreaterThan(3);
    expect(en.length).toBeGreaterThan(3);
    // Eine fehlende Übersetzung fällt sonst durch: `ansage` gibt dann die
    // deutsche Fassung zurück, und niemand merkt es.
    expect(en).not.toBe(de);
  });
});

describe(`Das Regal`, () => {
  it(`zeigt die NAMEN der Formen, nicht ihre Ankündigungen`, async () => {
    render(<Wortspiele loadFn={stand(VOLL)} stufe="kids" onWaehlen={() => {}} />);
    await screen.findByRole("button", { name: `Alphabet-Reihen` });
    // Der Ankündigungssatz gehört auf die Abschluss-Karte, nicht ins Regal.
    expect(screen.queryByText(/Jetzt kommen Alphabet-Reihen/)).toBeNull();
  });

  it(`zeigt nur Formen, die der Tastenstand hergibt - keine toten Knöpfe`, async () => {
    render(
      <Wortspiele loadFn={stand("asdfjklö".split(""))} stufe="kids" onWaehlen={() => {}} />,
    );
    await waitFor(() => expect(screen.queryByText(/Lädt/)).toBeNull());
    const knoepfe = screen.queryAllByRole("button").map((b) => b.textContent);
    // Ohne Umschalttaste kann der wandernde Großbuchstabe nichts üben.
    expect(knoepfe).not.toContain(`Wandernder Großbuchstabe`);
    // Und keiner der Knöpfe ist gesperrt (R5).
    for (const b of screen.queryAllByRole("button"))
      expect((b as HTMLButtonElement).disabled).toBe(false);
  });

  it(`sagt es, wenn der Tastenstand noch für gar nichts reicht`, async () => {
    render(<Wortspiele loadFn={stand(["f", "j"])} stufe="kids" onWaehlen={() => {}} />);
    await screen.findByText(/Die Wortspiele fangen an, sobald/);
  });

  it(`setzt den Anfangsfokus auf die Überschrift`, async () => {
    render(<Wortspiele loadFn={stand(VOLL)} stufe="kids" onWaehlen={() => {}} />);
    const kopf = await screen.findByRole("heading", { name: `Wortspiele` });
    await waitFor(() => expect(document.activeElement).toBe(kopf));
  });

  it(`jede Form im Regal hat einen Namen, der für sich steht`, () => {
    for (const f of UEBUNGSFORMEN) {
      expect(f.name.length, f.id).toBeGreaterThan(4);
      // Ein Name, der wie eine Ankündigung klingt, wäre im Regal falsch.
      expect(f.name.startsWith(`Jetzt`), f.id).toBe(false);
    }
  });
});
