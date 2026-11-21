/**
 * ★ WÄCHTER: „Zurück zu Mein Training" oben in Geschichten und Wortspielen
 * (Johannes 17.10.2026).
 *
 * Sein Wortlaut: *„bei wortspiele und Geschichten öffnet sich ein riesiges
 * fenster, mach die auswahl schlanker (Liste) und erstelle oben einen
 * schalter (zurück zu Mein Training)"*.
 *
 *  1. Beide Bereiche haben OBEN einen Schalter, der den übergebenen Weg geht -
 *     und er steht vor der Überschrift im Baum, nicht erst unter der Liste.
 *  2. Ohne den Weg (andere Apps, ältere Aufrufer) erscheint kein toter Knopf.
 *  3. Die Auswahl ist eine schmale Spalte (`max-w-3xl`), kein Raster über die
 *     ganze Seite - und die Bücherei zeigt ihre Texte als EINE Liste.
 *  4. Das Wort steht in allen acht Bedienungssprachen in `SEITEN_TEXTE`.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Wortspiele } from "@/components/typing/Wortspiele";
import { SerienTrainer } from "@/components/typing/SerienTrainer";
import { SEITEN_TEXTE } from "@/features/public/TippenTrainerPage";
import type { TypingProgress } from "@/lib/typing";

afterEach(cleanup);

const VOLL = [..."abcdefghijklmnopqrstuvwxyzäöüß".split(""), "⇧", ".", ","];

const stand = async (): Promise<TypingProgress> => ({
  xp: 0,
  lessons: {},
  letters: {},
  introduced: VOLL,
});

describe(`Zurück zu Mein Training`, () => {
  it(`Wortspiele: Schalter steht oben und ruft den Weg`, async () => {
    const zurueck = vi.fn();
    render(
      <Wortspiele
        loadFn={stand}
        stufe="teens"
        onWaehlen={() => {}}
        onZuMeinTraining={zurueck}
        zuMeinTrainingName="Zurück zu Mein Training"
      />,
    );
    const knopf = await screen.findByRole("button", { name: /Zurück zu Mein Training/ });
    const titel = screen.getByRole("heading", { level: 2, name: "Wortspiele" });
    // Der Schalter kommt VOR der Überschrift im Dokument.
    expect(knopf.compareDocumentPosition(titel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fireEvent.click(knopf);
    expect(zurueck).toHaveBeenCalledTimes(1);
    // Schmale Spalte statt voller Seitenbreite.
    expect(knopf.closest(".max-w-3xl")).not.toBeNull();
  });

  it(`Wortspiele: ohne Weg kein Schalter`, async () => {
    render(<Wortspiele loadFn={stand} stufe="teens" onWaehlen={() => {}} />);
    await screen.findByRole("heading", { level: 2, name: "Wortspiele" });
    expect(screen.queryByRole("button", { name: /Zurück zu Mein Training/ })).toBeNull();
  });

  it(`Geschichten: Schalter oben, Auswahl als EINE Liste in schmaler Spalte`, async () => {
    const zurueck = vi.fn();
    render(
      <SerienTrainer
        loadFn={stand}
        saveFn={() => {}}
        stufe="teens"
        lang="de"
        onZuMeinTraining={zurueck}
        zuMeinTrainingName="Zurück zu Mein Training"
      />,
    );
    const knopf = await screen.findByRole("button", { name: /Zurück zu Mein Training/ });
    fireEvent.click(knopf);
    expect(zurueck).toHaveBeenCalledTimes(1);
    const liste = await waitFor(() => {
      const l = document.querySelector("ul.flex-col");
      expect(l).not.toBeNull();
      return l as HTMLElement;
    });
    // Eine Spalte: kein Raster mit zwei Spalten mehr.
    expect(liste.className).not.toMatch(/grid-cols/);
    expect(knopf.closest(".max-w-3xl")).not.toBeNull();
  });

  it(`das Wort steht in allen acht Bedienungssprachen und ist je Sprache anders`, () => {
    // ★ G2-NEUN (25.10.2026): die neun Sprachen des Gerüsts zeigen vorerst Englisch - verschieden sind die acht mit Text.
    const ohneText = ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"];
    const sprachen = (Object.keys(SEITEN_TEXTE) as (keyof typeof SEITEN_TEXTE)[]).filter((s) => !ohneText.includes(s));
    expect(sprachen.length).toBeGreaterThanOrEqual(8);
    const worte = sprachen.map((s) => SEITEN_TEXTE[s].zurueckZuMeinTraining);
    for (const w of worte) expect(w.length).toBeGreaterThan(3);
    expect(new Set(worte).size).toBe(worte.length);
  });
});
