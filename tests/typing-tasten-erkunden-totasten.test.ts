/**
 * „Tasten erkunden": die Totasten mit ihrer Zusatzbezeichnung.
 *
 * Johannes, 13.09.2026: „die taste rechts neben dem ß heißt genau gleich wie
 * die taste links neben dem 1 bitte gib die zusatzbezeichnung auch an."
 *
 * Bis dahin gab `erkundeTaste` für JEDE Totaste (`key === "Dead"`) denselben
 * Satz aus: „Akzent-Taste - setzt ein Zeichen …". Welche Taste es war, sagt
 * erst `event.code` zusammen mit der eingestellten Tastatur (`layout`).
 *
 * Die Regel dahinter: nie etwas Falsches behaupten. Wo die Kombination aus
 * Tastatur, Taste und Umschalt nicht sicher bekannt ist, bleibt die Zeile
 * allgemein - lieber „Akzent-Taste" als der falsche Akzent.
 */
import { describe, expect, it } from "vitest";
import type { KeyEventLike } from "../src/lib/computer/chord";
import { erkundeTaste } from "../src/lib/typing/tastenErklaerung";

const ev = (code: string, extra: Partial<KeyEventLike> = {}): KeyEventLike => ({
  key: "Dead", code, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, ...extra,
});

describe("★ Johannes' Befund: die zwei Tasten heissen nicht mehr gleich", () => {
  it("links neben der 1 und rechts neben dem ß ergeben verschiedene Zeilen", () => {
    const links1 = erkundeTaste(ev("Backquote"), "windows", { layout: "de" });
    const rechtsSz = erkundeTaste(ev("Equal"), "windows", { layout: "de" });
    expect(links1.zeile).not.toBe(rechtsSz.zeile);
    expect(links1.ansage).not.toBe(rechtsSz.ansage);
    expect(links1.gross).not.toBe(rechtsSz.gross);
  });
});

describe("deutsche Tastatur (Deutschland/Österreich)", () => {
  it("links neben der 1: ^ - Zirkumflex - Akzent-Taste", () => {
    const aus = erkundeTaste(ev("Backquote"), "windows", { layout: "de" });
    expect(aus.gross).toBe("^");
    expect(aus.zeile).toMatch(/^\^ - Zirkumflex - Akzent-Taste - /);
    // Die Stimme ohne das Zeichen vorne (wie bei allen Zeichen) - sonst hiesse es „Zirkumflex, Zirkumflex".
    expect(aus.ansage).toMatch(/^Zirkumflex, Akzent-Taste: /);
    expect(aus.schlucken).toBe(false);
  });

  it("⚠️ Mac mit ISO-Tastatur: Chrome meldet dieselbe Taste als IntlBackslash", () => {
    const aus = erkundeTaste(ev("IntlBackslash"), "macos", { layout: "de" });
    expect(aus.gross).toBe("^");
    expect(aus.zeile).toMatch(/^\^ - Zirkumflex - Akzent-Taste - /);
  });

  it("rechts neben dem ß: ´ - Akut - Akzent-Taste", () => {
    const aus = erkundeTaste(ev("Equal"), "windows", { layout: "de" });
    expect(aus.gross).toBe("´");
    expect(aus.zeile).toMatch(/^´ - Akut - Akzent-Taste - /);
    expect(aus.ansage).toMatch(/^Akut, Akzent-Taste: /);
  });

  it("dieselbe Taste mit Shift: ` - Gravis - Akzent-Taste (auch eine Totaste, keine Kombination)", () => {
    const aus = erkundeTaste(ev("Equal", { shiftKey: true }), "windows", { layout: "de" });
    expect(aus.gross).toBe("`");
    expect(aus.zeile).toMatch(/^` - Gravis - Akzent-Taste - /);
    expect(aus.zeile).not.toMatch(/Tastenkombination/);
  });

  it("am Mac gilt dasselbe für ´ und `", () => {
    expect(erkundeTaste(ev("Equal"), "macos", { layout: "de" }).gross).toBe("´");
    expect(erkundeTaste(ev("Equal", { shiftKey: true }), "macos", { layout: "de" }).gross).toBe("`");
  });
});

describe("Schweizer Tastatur", () => {
  it("^ liegt auf Equal, mit Shift der Gravis", () => {
    expect(erkundeTaste(ev("Equal"), "windows", { layout: "ch" }).zeile).toMatch(
      /^\^ - Zirkumflex - Akzent-Taste - /,
    );
    expect(erkundeTaste(ev("Equal", { shiftKey: true }), "windows", { layout: "ch" }).zeile).toMatch(
      /^` - Gravis - Akzent-Taste - /,
    );
  });

  it("¨ liegt auf BracketRight", () => {
    const aus = erkundeTaste(ev("BracketRight"), "windows", { layout: "ch" });
    expect(aus.gross).toBe("¨");
    expect(aus.zeile).toMatch(/^¨ - Trema - Akzent-Taste - /);
  });
});

describe("★ nie etwas Falsches behaupten: Unbekanntes bleibt allgemein", () => {
  const ALLGEMEIN = /^Akzent-Taste - setzt ein Zeichen auf den nächsten Buchstaben/;

  it("englische Tastaturen: keine Zusatzbezeichnung", () => {
    for (const layout of ["us", "uk"] as const) {
      const aus = erkundeTaste(ev("Equal"), "windows", { layout });
      expect(aus.zeile, layout).toMatch(ALLGEMEIN);
      expect(aus.gross, layout).toBe("Akzent-Taste");
    }
  });

  it("eine Taste, die auf dieser Tastatur keine bekannte Totaste ist", () => {
    // Auf der Schweizer Tastatur ist Backquote das §, keine Totaste.
    expect(erkundeTaste(ev("Backquote"), "windows", { layout: "ch" }).zeile).toMatch(ALLGEMEIN);
    // Deutsche Tastatur, Shift + ^ ist das ° und keine Totaste - kommt es trotzdem als Dead, bleibt es allgemein.
    expect(erkundeTaste(ev("Backquote", { shiftKey: true }), "windows", { layout: "de" }).zeile).toMatch(ALLGEMEIN);
  });

  it("Gegenprobe: dieselben Codes OHNE Totaste bleiben, was sie waren", () => {
    // `<` auf IntlBackslash, `´`-Zeichen als fertiges Zeichen.
    expect(erkundeTaste({ ...ev("IntlBackslash"), key: "<" }, "windows", { layout: "de" }).zeile).toMatch(
      /^< - kleiner als - /,
    );
    expect(erkundeTaste({ ...ev("Equal"), key: "´" }, "windows", { layout: "de" }).zeile).toMatch(/^´ - /);
  });
});

describe("der dritte Layer bleibt, wie er war", () => {
  it("★ Mac: Option + U (¨) sagt weiter den Weg „Mit Option + U.“", () => {
    const aus = erkundeTaste(ev("KeyU", { altKey: true }), "macos", { layout: "de" });
    expect(aus.zeile).toMatch(/ Mit Option \+ U\.$/);
    expect(aus.ansage).toMatch(/ Mit Option \+ U\.$/);
    expect(aus.schlucken).toBe(false);
  });

  it("Windows: eine Totaste über AltGr bleibt allgemein, mit dem Weg", () => {
    const aus = erkundeTaste(ev("Equal", { altKey: true, ctrlKey: true }), "windows", {
      layout: "ch",
      altGr: true,
    });
    expect(aus.zeile).toMatch(/^Akzent-Taste - .* Mit AltGr \+ /);
  });
});

describe("die Form jeder neuen Zeile", () => {
  const FAELLE: [string, Partial<KeyEventLike>, "de" | "ch", "windows" | "macos"][] = [
    ["Backquote", {}, "de", "windows"],
    ["IntlBackslash", {}, "de", "macos"],
    ["Equal", {}, "de", "windows"],
    ["Equal", { shiftKey: true }, "de", "windows"],
    ["Equal", {}, "ch", "windows"],
    ["Equal", { shiftKey: true }, "ch", "windows"],
    ["BracketRight", {}, "ch", "windows"],
  ];

  it("nur Bindestriche, jeder Satz endet mit Punkt, das Zeichen steht vorne", () => {
    for (const [code, extra, layout, plattform] of FAELLE) {
      const aus = erkundeTaste(ev(code, extra), plattform, { layout });
      const name = `${layout} ${code} ${JSON.stringify(extra)}`;
      expect(aus.zeile, name).not.toMatch(/[–—]/);
      expect(aus.ansage, name).not.toMatch(/[–—]/);
      expect(aus.zeile, name).toMatch(/\.$/);
      expect(aus.zeile.startsWith(`${aus.gross} - `), name).toBe(true);
      expect(aus.zeile, name).toMatch(/Das Zeichen erscheint erst mit dem nächsten Buchstaben\.$/);
    }
  });
});
