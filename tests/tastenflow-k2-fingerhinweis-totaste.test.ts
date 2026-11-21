/**
 * ★ K2 (28.09.2026, Schlussprüfung Nachtlauf): der gesprochene Fingerhinweis
 * (`fingerGuide`, Weg de - die Expedition) für Zeichen über eine Totaste.
 *
 * Seit W1 entsteht „Ä Ö Ü" auf der Schweizer Tastatur unter Windows über die
 * ¨-Totaste, dann Umschalt + A. `fingerGuide` sagte aber „dazu die rechte
 * Umschalttaste" - Umschalt + ä ergibt dort „à". Die Übungsseite nannte schon
 * die Totaste (`totastenHinweisFuer`), nur dieser Weg nicht.
 *
 * Der Wächter deckt die Fehlerklasse: JEDES Zeichen, das `kombizeichenZu` auf
 * der deutschen und der Schweizer Tastatur (Windows) über eine Totaste
 * erzeugt, klein und gross - der Hinweis nennt die Totaste. Gegenprobe: auf
 * dem Mac bleibt „Ä" auf der Schweizer Tastatur die Feststelltaste.
 */
import { afterEach, describe, expect, it } from "vitest";
import { charLabel, fingerGuide } from "../src/lib/typing/fingers";
import { activeLayout, setLayout, setzeLayoutPlattform } from "../src/lib/typing/layouts";
import { kombizeichenFuerLayout, kombizeichenZu } from "../src/lib/typing/totasten";
import { totasteName } from "../src/lib/typing/totastenTexte";

afterEach(() => {
  setzeLayoutPlattform(null);
  setLayout("de");
});

describe("K2: fingerGuide nennt die Totaste", () => {
  for (const lay of ["ch", "de"]) {
    it(`${lay} (Windows): jedes Totasten-Zeichen, klein und gross`, () => {
      setzeLayoutPlattform("windows");
      setLayout(lay);
      const zeichen = new Set<string>(["Ä", "Ö", "Ü"]);
      for (const k of kombizeichenFuerLayout(activeLayout())) {
        zeichen.add(k.zeichen);
        zeichen.add(k.zeichen.toUpperCase());
      }
      const ohne: string[] = [];
      let geprueft = 0;
      for (const c of zeichen) {
        const k = kombizeichenZu(c, activeLayout());
        if (!k) continue;
        geprueft++;
        const g = fingerGuide(c, false, "de");
        // Der Name der Totaste (´ hat auf Deutsch keinen eigenen Totasten-Namen
        // und heisst wie auf der Übungsseite „Akzent").
        const tot = totasteName(k.tot, "de") ?? charLabel(k.tot);
        if (!g.includes(`: ${tot} (`)) ohne.push(`${c}: „${g}"`);
      }
      expect(geprueft).toBeGreaterThan(lay === "ch" ? 20 : 5);
      expect(ohne.join("\n")).toBe("");
    });
  }

  it(`Schweiz, Windows: „Ä" = Trema, dann A mit der Umschalttaste gegen die linke Hand`, () => {
    setzeLayoutPlattform("windows");
    setLayout("ch");
    expect(fingerGuide("Ä", false, "de")).toBe(
      "großes Ä: Trema (rechter kleiner Finger), dann großes A, linker kleiner Finger, dazu die rechte Umschalttaste.",
    );
    // „Einhand schreiben": keine Seite
    expect(fingerGuide("Ö", true, "de")).toContain("dazu die Umschalttaste.");
    // das kleine ä liegt auf seiner eigenen Taste
    expect(fingerGuide("ä", false, "de")).not.toContain("Trema");
  });

  it(`Gegenprobe Mac: auf der Schweizer Tastatur kommt „Ä" über die Feststelltaste`, () => {
    setzeLayoutPlattform("mac");
    setLayout("ch");
    expect(kombizeichenZu("Ä", activeLayout())).toBeUndefined();
    expect(fingerGuide("Ä", false, "de")).toContain("Feststelltaste");
  });
});
