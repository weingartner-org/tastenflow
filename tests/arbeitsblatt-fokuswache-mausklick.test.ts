// @vitest-environment jsdom
/**
 * ★★★★★ EIN MAUSKLICK IST KEIN VERLORENER FOKUS (Johannes, 07.11.2026).
 * ============================================================================
 * > „viele haben sprungmarken dass man gar nicht klicken kann, man springt irgendwo hin"
 *
 * Jano klickt mit der Maus. Klickt er auf eine freie Stelle (Kartenrand, Lücke neben dem Feld),
 * geht der Fokus aus dem Feld auf `<body>`. Der Wächter hielt das für einen verlorenen Fokus und
 * setzte ihn ins alte Feld zurück - der Browser rollte dorthin, beim letzten Feld ans Seitenende.
 * Gemessen an der Musterseite mit Janos Blatt 4: Rollstand 500 ⇒ 7620. Nach der Behebung: 500 ⇒ 500.
 *
 * ⚠️ Die Gegenprobe gehört dazu: Ohne Mausklick holt der Wächter den Fokus weiter zurück.
 */
import { afterEach, describe, expect, it } from "vitest";
import { fokuswacheStarten, type Fokusvorfall } from "../src/lib/arbeitsblatt/fokuswache";

const takt = () => new Promise((r) => setTimeout(r, 20));

function aufbau() {
  document.body.innerHTML = `<main id="blatt"><section data-aufgabe="a1"><p>Angabe</p><textarea data-feld="a"></textarea></section></main>`;
  const wurzel = document.getElementById("blatt")!;
  const feld = wurzel.querySelector("textarea")!;
  const vorfaelle: Fokusvorfall[] = [];
  const stop = fokuswacheStarten(wurzel, (v) => vorfaelle.push(v));
  return { feld, vorfaelle, stop };
}

let stopp: (() => void) | null = null;
afterEach(() => {
  stopp?.();
  stopp = null;
});

describe("Fokus-Wächter und Mausklick", () => {
  it("Klick auf eine freie Stelle: der Fokus bleibt weg, nichts springt", async () => {
    const { feld, vorfaelle, stop } = aufbau();
    stopp = stop;
    feld.focus();
    document.querySelector("p")!.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    feld.blur();
    await takt();
    expect(document.activeElement).toBe(document.body);
    expect(vorfaelle).toEqual([]);
  });

  it("Gegenprobe ohne Mausklick: der Wächter holt den Fokus zurück", async () => {
    const { feld, vorfaelle, stop } = aufbau();
    stopp = stop;
    feld.focus();
    feld.blur();
    await takt();
    expect(document.activeElement).toBe(feld);
    expect(vorfaelle.length).toBe(1);
  });
});
