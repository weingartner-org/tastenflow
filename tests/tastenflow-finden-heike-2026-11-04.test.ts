/**
 * „Tasten finden" und die kleine Prüfung - Testerin Meldungen vom 04.11.2026.
 *
 *  · bc0s8jpbsggd5ks / axenotumo3z7k39: Shift und Strg gibt es zweimal - fertig
 *    ist man erst, wenn BEIDE gedrückt sind („Links gefunden. Jetzt die rechte.").
 *  · p20iv0clc9c0tph: „Schreibt jetzt alles groß?" kann ein Kind nicht
 *    feststellen - die Feststelltaste sagt, ob sie an ist und wie man wieder
 *    klein schreibt.
 *  · bc38onv5ly43uwf: in der Wahlfrage ist genau EINE Antwort richtig
 *    (Tab macht auch einen Abstand zwischen zwei Wörtern).
 */
import { describe, expect, it } from "vitest";
import type { KeyEventLike } from "../src/lib/computer/chord";
import type { Plattform } from "../src/lib/computer/model";
import { suchbareTasten, tasteMitId } from "../src/lib/computer/tastenNamen";
import { findenSchritt, type FindenZiel } from "../src/lib/typing/findenRunde";
import { baueFragen } from "../src/lib/typing/findenPruefung";
import { layoutById } from "../src/lib/typing/layouts";
import { erklaerungFuerSprache } from "../src/lib/typing/tastenErklaerung";
import type { BedienSprache } from "../src/lib/bedienSprache";

const DE = layoutById("de");
const E = (o: Partial<KeyEventLike> & { key: string }): KeyEventLike => ({
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  metaKey: false,
  ...o,
});
const ziel = (id: string, p: Plattform = "windows"): FindenZiel => ({ art: "sonder", taste: tasteMitId(id, p)! });

describe("Tasten mit zwei Seiten", () => {
  const ziele = [ziel("umschalt"), ziel("tabulator")];

  it("Shift: die erste Seite ist noch nicht fertig, die zweite schon", () => {
    const eins = findenSchritt({ e: E({ key: "Shift", code: "ShiftLeft" }), ziele, index: 0, bestaetigt: false, plattform: "windows", layout: DE });
    expect(eins?.art).toBe("seite");
    expect(eins?.ansage.startsWith("Links gefunden. Jetzt die rechte.")).toBe(true);
    // Dieselbe Seite noch einmal: weiter nur die Bitte um die andere, ohne Funktionssatz.
    const nochmal = findenSchritt({ e: E({ key: "Shift", code: "ShiftLeft" }), ziele, index: 0, bestaetigt: false, seite: "links", plattform: "windows", layout: DE });
    expect(nochmal).toMatchObject({ art: "seite", neu: false, ansage: "Links gefunden. Jetzt die rechte." });
    const zwei = findenSchritt({ e: E({ key: "Shift", code: "ShiftRight" }), ziele, index: 0, bestaetigt: false, seite: "links", plattform: "windows", layout: DE });
    expect(zwei?.art).toBe("weiter");
  });

  it("rechts zuerst geht genauso", () => {
    const eins = findenSchritt({ e: E({ key: "Shift", code: "ShiftRight" }), ziele, index: 0, bestaetigt: false, plattform: "windows", layout: DE });
    expect(eins?.ansage.startsWith("Rechts gefunden. Jetzt die linke.")).toBe(true);
  });

  it("Strg an der Computer-Tastatur: beide Seiten; am Laptop eine (Copilot-Taste rechts)", () => {
    const z = [ziel("strg")];
    const pc = findenSchritt({ e: E({ key: "Control", code: "ControlLeft" }), ziele: z, index: 0, bestaetigt: false, plattform: "windows", layout: DE, tastaturArt: "computer" });
    expect(pc?.art).toBe("seite");
    const fertig = findenSchritt({ e: E({ key: "Control", code: "ControlRight" }), ziele: z, index: 0, bestaetigt: false, seite: "links", plattform: "windows", layout: DE });
    expect(fertig?.art).toBe("fertig");
    const laptop = findenSchritt({ e: E({ key: "Control", code: "ControlLeft" }), ziele: z, index: 0, bestaetigt: false, plattform: "windows", layout: DE, tastaturArt: "laptop" });
    expect(laptop?.art).toBe("gefunden");
  });

  it("Alt unter Windows bleibt bei einem Druck (rechts sitzt AltGr)", () => {
    const z = [ziel("alt")];
    const s = findenSchritt({ e: E({ key: "Alt", code: "AltLeft" }), ziele: z, index: 0, bestaetigt: false, plattform: "windows", layout: DE });
    expect(s?.art).toBe("gefunden");
  });

  it("am Mac: Umschalt-, Befehls- und Wahltaste je zweimal, ctrl nicht", () => {
    for (const [id, key, code] of [
      ["umschalt", "Shift", "ShiftLeft"],
      ["befehlstaste", "Meta", "MetaLeft"],
      ["wahltaste", "Alt", "AltLeft"],
    ] as const) {
      const s = findenSchritt({ e: E({ key, code }), ziele: [ziel(id, "macos")], index: 0, bestaetigt: false, plattform: "macos", layout: DE });
      expect(s?.art, id).toBe("seite");
    }
    const c = findenSchritt({ e: E({ key: "Control", code: "ControlLeft" }), ziele: [ziel("ctrl", "macos")], index: 0, bestaetigt: false, plattform: "macos", layout: DE });
    expect(c?.art).toBe("gefunden");
  });

  it("ohne `code` (alte Browser) bleibt der alte Weg", () => {
    const s = findenSchritt({ e: E({ key: "Shift" }), ziele, index: 0, bestaetigt: false, plattform: "windows", layout: DE });
    expect(s?.art).toBe("gefunden");
  });

  it("jede Sprache hat ihren eigenen Satz", () => {
    const saetze = new Set<string>();
    for (const sprache of ["de", "en", "fr", "es", "it", "pl", "tr", "cs", "bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"] as BedienSprache[]) {
      const s = findenSchritt({ e: E({ key: "Shift", code: "ShiftLeft" }), ziele, index: 0, bestaetigt: false, plattform: "windows", layout: DE, sprache });
      expect(s?.art).toBe("seite");
      expect(s?.ansage).not.toMatch(/[–—]/);
      saetze.add(s!.ansage.split(".")[0]!);
    }
    expect(saetze.size).toBeGreaterThan(14);
  });
});

describe("die Feststelltaste sagt, was ist", () => {
  const ziele = [ziel("feststell"), ziel("tabulator")];
  const caps = E({ key: "CapsLock", code: "CapsLock" });

  it("beim ersten Druck: an, alles groß, und wie man wieder klein schreibt", () => {
    const s = findenSchritt({ e: caps, ziele, index: 0, bestaetigt: false, plattform: "windows", layout: DE, feststellAn: true });
    expect(s?.ansage).toContain("Sie ist jetzt an: Alles wird groß geschrieben. Drück sie noch einmal, dann schreibst du wieder klein.");
    expect(s?.ansage).not.toContain("Schreibt jetzt alles groß?");
  });

  it("beim Bestätigen: aus, wieder klein - nie die Frage", () => {
    const s = findenSchritt({ e: caps, ziele, index: 0, bestaetigt: true, dazwischen: true, plattform: "windows", layout: DE, feststellAn: false });
    expect(s?.art).toBe("weiter");
    expect(s?.ansage.startsWith("Sitzt! Sie ist jetzt aus: Du schreibst wieder klein.")).toBe(true);
  });

  it("englisch ebenso", () => {
    const s = findenSchritt({ e: caps, ziele, index: 0, bestaetigt: true, dazwischen: true, plattform: "windows", layout: DE, sprache: "en", feststellAn: true });
    expect(s?.ansage).toContain("It is on now");
    expect(s?.ansage).toContain("small letters");
  });
});

describe("die Wahlfrage hat genau eine richtige Antwort", () => {
  it("Leertaste und Tabulatortaste stehen nie zusammen in einer Wahlfrage, die Leertaste schreibt ein Leerzeichen", () => {
    for (const sprache of ["de", "en"] as const) {
      for (let seed = 0; seed < 300; seed++) {
        let x = seed + 1;
        const zufall = () => {
          x = (x * 16807) % 2147483647;
          return (x - 1) / 2147483646;
        };
        const fragen = baueFragen({ plattform: "windows", layoutId: "de", sprache, zufall })!;
        const wahl = fragen.find((f) => f.art === "wahl");
        if (!wahl || wahl.art !== "wahl") continue;
        const text = [wahl.frage, ...wahl.optionen].join(" | ");
        const tabSatz = erklaerungFuerSprache("tabulator", "windows", "de", sprache)!.was[0]!.slice(1);
        const optTab = wahl.optionen.some((o) => o.includes(tabSatz));
        const optLeer = wahl.optionen.some((o) => /Leerzeichen|space character/.test(o));
        const fragtTab = /\bTab\b/.test(wahl.frage);
        const fragtLeer = /Leertaste|space/i.test(wahl.frage.replace(/Backspace/g, ""));
        // Gefragt ist die eine, und die andere steht als falsche Antwort da: das wäre zweimal richtig.
        expect((fragtTab && optLeer) || (fragtLeer && optTab), text).toBe(false);
        expect(text).not.toMatch(/Abstand zwischen zwei Wörtern|makes a space between/);
      }
    }
  });

  it("die gefragten Tasten gibt es auf jeder Tastatur", () => {
    expect(suchbareTasten("windows").some((t) => t.id === "leertaste")).toBe(true);
  });
});
