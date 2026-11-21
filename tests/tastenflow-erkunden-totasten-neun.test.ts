/**
 * ★★★ WÄCHTER O2-TASTATUR (30.10.2026): „Tasten erkunden" auf den Tastaturen der neun Sprachen.
 *  · Jede Totaste (ohne AltGr), die `layouts.ts` kennt, ist in `TOTASTEN` benannt - derselbe Weg wie beim Üben (`totasteAusAnschlag`).
 *  · Tilde und Tonos haben in JEDER der 17 Bedienungen einen eigenen Namen.
 *  · Griechisch heisst der Akut „τόνος". Tastmarke und Feststell-Zustand in der Sprache, nie Englisch.
 */
import { describe, expect, it } from "vitest";
import { erkundeTaste, tastmarke } from "@/lib/typing/tastenErklaerung";
import { AKZENTE_NEU } from "@/lib/typing/tastenErklaerungAkzenteNeu";
import { AKZENTE_EL } from "@/lib/typing/tastenErklaerungEl";
import { totasteAusAnschlag } from "@/lib/typing/anschlagDeuten";
import { layoutById, type LayoutId } from "@/lib/typing/layouts";
import { ALLE_SPRACHEN, GERUEST_SPRACHEN } from "@/lib/typing/sprachRegister";
import type { BedienSprache } from "@/lib/bedienSprache/sprache";

const TASTATUREN: readonly LayoutId[] = [
  "bg", "bg-schreibm", "bg-phon", "bg-phon-trad", "el", "el-220", "el-319", "hu", "hu-101", "nl-intl", "nl-dutch", "pt", "br-abnt2", "ro", "ro-prog", "sv", "ua", "ua-std",
];
const CODES = [
  "Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal",
  "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight",
  "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Backslash",
  "IntlBackslash", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash",
];
const SPRACHEN = ALLE_SPRACHEN as readonly BedienSprache[];
const tot = (layout: LayoutId, code: string, shiftKey: boolean, sprache: BedienSprache = "de") =>
  erkundeTaste({ key: "Dead", code, shiftKey, altKey: false, ctrlKey: false, metaKey: false }, "windows", { layout, sprache });

describe("★★★ TOTASTEN: jede Totaste ohne AltGr ist benannt, und zwar mit dem Zeichen, das auch das Üben kennt", () => {
  it.each(TASTATUREN)("%s", (id) => {
    const layout = layoutById(id);
    const fehler: string[] = [];
    for (const code of CODES) {
      for (const umschalt of [false, true]) {
        const soll = totasteAusAnschlag(layout, code, umschalt, false);
        const a = tot(id, code, umschalt);
        const benannt = a.zeile.includes("Akzent-Taste") && a.gross !== "Akzent-Taste" && a.gross.length === 1;
        if (soll !== null && a.gross !== soll) fehler.push(`${code}${umschalt ? "+Shift" : ""}: soll ${soll}, ist ${a.gross}`);
        if (soll === null && benannt) fehler.push(`${code}${umschalt ? "+Shift" : ""}: ${a.gross} ist keine Totaste`);
      }
    }
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: die griechische Tastatur hat wirklich Totasten, Bulgarisch keine", () => {
    expect(tot("el", "Semicolon", false).gross).toBe("΄");
    expect(tot("bg", "Semicolon", false).gross).not.toBe("΄");
  });
});

describe("★ Tilde und Tonos: in jeder Bedienung ein eigener Satz", () => {
  it.each(SPRACHEN)("%s", (s) => {
    const til = tot("pt", "Backslash", false, s);
    const ton = tot("el", "Semicolon", false, s);
    expect(til.zeile).toContain(AKZENTE_NEU[s].tilde.name);
    expect(til.zeile).toContain(AKZENTE_NEU[s].tilde.was);
    expect(ton.zeile).toContain(AKZENTE_NEU[s].tonos.name);
    expect(ton.zeile).toContain(AKZENTE_NEU[s].tonos.was);
    for (const a of Object.values(AKZENTE_NEU[s])) {
      expect(a.was).toMatch(/[ãάΐαa]\.$|ά\.$|ã\.$|ΐ\.$/u);
      expect(a.was).not.toMatch(/[\u2013\u2014]/);
    }
    if (s !== "en") expect(AKZENTE_NEU[s].tilde.was).not.toBe(AKZENTE_NEU.en.tilde.was);
  });

  it("griechische Bedienung: der Akut heisst τόνος, nie οξεία", () => {
    expect(AKZENTE_EL.akut.name).toBe("τόνος");
    expect(tot("el", "Semicolon", false, "el").zeile).toContain("τόνος");
  });
});

describe("★ Tastmarke und Tastenwörter", () => {
  const taste = (code: string) => ({ key: "x", code, shiftKey: false, altKey: false, ctrlKey: false, metaKey: false });
  it.each(GERUEST_SPRACHEN)("%s: F, J und Num 5 in der Sprache, nie Englisch; alle anderen ohne", (s) => {
    const f = tastmarke(taste("KeyF"), s)!;
    const n = tastmarke(taste("Numpad5"), s)!;
    expect(f).not.toBe(tastmarke(taste("KeyF"), "en"));
    expect(n).not.toBe(tastmarke(taste("Numpad5"), "en"));
    expect(f).not.toBe(n);
    expect(tastmarke(taste("KeyA"), s)).toBeNull();
  });

  it("Schwedisch sagt in Kombinationen Skift, Griechisch Alt Gr", () => {
    const kombi = erkundeTaste({ key: "S", code: "KeyS", shiftKey: true, altKey: false, ctrlKey: true, metaKey: false }, "windows", { layout: "sv", sprache: "sv" });
    expect(kombi.zeile).toContain("Skift");
    expect(kombi.zeile).not.toContain("Shift");
  });
});
