/**
 * ★★ Meldung w0tt7egy6eqnr4x (05.11.2026, /fr, AZERTY Windows): „A avec accent grave ne fonctionne pas".
 *
 * Die Zeile war „À Kinshasa", die Anleitung richtig („accent grave (index droit + AltGr), puis majuscule a"), aber die
 * Bildschirm-Tastatur liess die Taste 0/à leuchten. Umschalt + à gibt dort „0", nicht „À" - wer der Tastatur folgte,
 * tippte falsch. Seit diesem Tag gilt die Zwei-Schritt-Zeichnung überall, wo auch die Ansage zwei Schritte nennt:
 *  · erster Schritt: die Totaste (Gravis = AltGr + 7/è-Taste, Zirkumflex = ^-Taste, Trema = Umschalt + ^);
 *  · nach der Totaste (`totasteOffen`): der Buchstabe mit der Umschalttaste der Gegenhand.
 * Geprüft wird die Klasse: jeder Grossbuchstabe mit Akzent, den AZERTY nur über die Totaste kennt.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { Keyboard } from "../src/components/typing/Keyboard";
import { layoutById, setLayout, setzeLayoutPlattform } from "../src/lib/typing/layouts";
import { kombizeichenZu } from "../src/lib/typing/totasten";

afterEach(() => {
  cleanup();
  setzeLayoutPlattform(null);
  setLayout("de");
});

function zeichne(nextChar: string, totasteOffen = false) {
  setzeLayoutPlattform("windows");
  setLayout("fr");
  const { container } = render(
    <Keyboard layout={layoutById("fr")} unlocked={new Set()} showFingerColors={false} nextChar={nextChar} totasteOffen={totasteOffen} />,
  );
  return [...container.querySelectorAll(".tt-taste-ziel")].map((e) => (e.textContent ?? "").replace(/\s+/g, ""));
}

describe("AZERTY Frankreich: Grossbuchstaben mit Akzent", () => {
  it("„À\": zuerst AltGr + die Taste 7/è - nie die Taste 0/à", () => {
    const ziel = zeichne("À");
    expect(ziel.some((k) => k.includes("è"))).toBe(true);
    expect(ziel.some((k) => k.includes("à"))).toBe(false);
    expect(ziel.some((k) => /Alt ?Gr/.test(k))).toBe(true);
  });

  it("„À\" nach der Totaste: die Taste A mit der rechten Umschalttaste, ohne AltGr", () => {
    const ziel = zeichne("À", true);
    expect(ziel).toContain("A");
    expect(ziel.some((k) => k.includes("à"))).toBe(false);
    expect(ziel.some((k) => /Alt ?Gr/.test(k))).toBe(false);
    expect(ziel.some((k) => k.includes("⇧"))).toBe(true);
  });

  it("jeder Grossbuchstabe über die Totaste leuchtet zuerst auf der Totaste, danach auf seinem Buchstaben", () => {
    const lay = layoutById("fr");
    setLayout("fr");
    for (const z of [..."ÀÈÙÊÎÔÛËÏ"]) {
      const k = kombizeichenZu(z, lay);
      expect(k, z).toBeDefined();
      const vorher = zeichne(z);
      cleanup();
      const nachher = zeichne(z, true);
      cleanup();
      expect(nachher, z).toContain(k!.dann);
      expect(vorher, z).not.toContain(k!.dann);
    }
  });
});
