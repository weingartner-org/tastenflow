/**
 * WÄCHTER ÜBER DIE TESTHILFE `tests/_typing-probelauf.ts` (11.09.2026).
 *
 * ── Der Befund ──────────────────────────────────────────────────────────────
 * `naechsteZeile` suchte das Übungsfeld als `<input>`. Seit dem 10.09.2026 ist
 * es ein `<textarea>`; die Hilfe fand es nicht und meldete sofort „Runde
 * vorbei". Gemessen am Stand 2c3eacdf: `tippfeld()` gab `null`,
 * `naechsteZeile` gab `false` nach 0 ms, und 1,2 s später stand Zeile 2.
 *
 * Eine Hilfe, die nichts findet, darf nicht wie ein Ergebnis aussehen. Dieser
 * Wächter prüft darum beide Richtungen: Sie findet das ECHTE Feld der echten
 * Seite und meldet echte Zeilenwechsel und das echte Rundenende - und sie
 * scheitert LAUT, wo sie nichts findet.
 *
 * WOHIN ER SICH BEWEGT, WENN ES SCHLECHTER WIRD: Wer die Suche wieder an einen
 * Elementnamen hängt, die Marke `data-typing-field` am Feld umbenennt oder
 * „kein Feld" wieder als „vorbei" liest, wird hier rot.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import {
  abschlussKarte,
  naechsteZeile,
  ohneBildschirmTastatur,
  tippfeld,
  tippfeldPflicht,
  zeilenMarke,
} from "./_typing-probelauf";

/** Alle Buchstaben, aber OHNE Umschalt-Einheit (sonst wird keine Zeile fertig). */
const ALLE_TASTEN = [
  "f", "j", "d", "k", "s", "l", "a", "ö", "e", "n", "i", "r", "t",
  "h", "u", "c", "g", "m", "o", "b", "w", "z", "v", "p", "ä", "ü",
  "x", "y", "q", "ß",
];

function standMit(speedEma?: number) {
  localStorage.setItem(
    "tippen-trainer:v1",
    JSON.stringify({
      xp: 0,
      lessons: {},
      introduced: ALLE_TASTEN,
      ...(speedEma === undefined ? {} : { speedEma }),
    }),
  );
}

async function zeigeTrainer(): Promise<HTMLElement> {
  render(
    <MemoryRouter>
      <TippenTrainerPage />
    </MemoryRouter>,
  );
  return screen.findByRole("textbox", undefined, { timeout: 10_000 });
}

beforeEach(() => {
  localStorage.clear();
  einrichtungFertigMerken();
  ohneBildschirmTastatur();
});
afterEach(() => {
  cleanup();
});

describe("Die Hilfe findet, was wirklich da ist", () => {
  it("★★★ tippfeld() ist das Übungsfeld der echten Seite", async () => {
    standMit(undefined);
    const box = await zeigeTrainer();
    expect(tippfeld()).toBe(box);
    expect(tippfeldPflicht()).toBe(box);
    // Gegenprobe zur alten Suche: Ein `<input>` gibt es an dieser Stelle nicht.
    expect(document.querySelector('input[type="text"], input:not([type])')).toBeNull();
  }, 30_000);

  it("★★★ naechsteZeile meldet einen echten Zeilenwechsel mit true", async () => {
    standMit(undefined);
    await zeigeTrainer();
    const marke = zeilenMarke();
    expect(marke).toMatch(/^zeile-\d+$/);
    const feld = tippfeldPflicht();
    for (const ch of feld.value) fireEvent.keyDown(feld, { key: ch });
    expect(await naechsteZeile(marke)).toBe(true);
    expect(zeilenMarke()).not.toBe(marke);
  }, 30_000);

  it("★★★ naechsteZeile meldet false erst, wenn die Abschlusskarte steht", async () => {
    // Tempo 30: eine kurze Runde (rund 5 Zeilen, `typing-runde-probelauf`).
    standMit(30);
    await zeigeTrainer();
    let zeilen = 0;
    let weiter = true;
    while (weiter) {
      expect(zeilen, "die Runde endete nicht").toBeLessThan(20);
      const marke = zeilenMarke();
      const feld = tippfeldPflicht();
      for (const ch of feld.value) fireEvent.keyDown(feld, { key: ch });
      zeilen++;
      weiter = await naechsteZeile(marke);
    }
    expect(abschlussKarte()).not.toBeNull();
    expect(zeilen).toBeGreaterThan(1);
  }, 60_000);
});

describe("Die Hilfe scheitert LAUT, wo sie nichts findet", () => {
  it("★★★ ohne Übungsfeld und ohne Abschlusskarte: Fehler statt „vorbei“", async () => {
    render(<textarea aria-label="irgendein anderes Feld" />);
    expect(tippfeld()).toBeNull();
    expect(() => tippfeldPflicht()).toThrow(/kein Übungsfeld/);
    await expect(naechsteZeile("zeile-1", 100)).rejects.toThrow(
      /weder Übungsfeld .* noch Abschlusskarte/,
    );
  });

  it("★★ bleibt die Zeile stehen: Fehler am Zeitablauf, nicht false", async () => {
    standMit(undefined);
    await zeigeTrainer();
    // Nichts getippt - die Zeile kann nicht wechseln.
    await expect(naechsteZeile(zeilenMarke(), 300)).rejects.toThrow(
      /nach 300 ms weder eine neue Zeile/,
    );
  }, 30_000);
});
