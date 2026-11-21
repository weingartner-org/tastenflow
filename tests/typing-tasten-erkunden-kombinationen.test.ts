/**
 * „Tasten erkunden": Tastenkombinationen und der dritte Layer.
 *
 * Johannes, 12.09.2026, nach seinem Test:
 *   „dritter layer funktioniert nicht, also die sonderzeichen wie geschweifte
 *    klammer oder eckigeklammer oder @"
 *   „tastenkombinationen funktionieren nicht, du kennst von im Griff die
 *    tasten die durchgereicht werden"
 *
 * Geprüft wird die reine Logik (`tastenErklaerung.ts`). Dazu ein Wächter, der
 * die Liste der durchgereichten Tastenflow-Kürzel gegen die Seite hält - die
 * Liste steht zweimal im Code, und zwei Stellen, die voneinander nichts
 * wissen, laufen auseinander.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { ladeKuerzelKatalog } from "../src/lib/typing/kuerzelKatalog";
import type { KeyEventLike } from "../src/lib/computer/chord";
import {
  erkundeTaste,
  gehoertDerSeite,
  TASTENFLOW_ALT_CODES,
  wirkungenDerKombination,
} from "../src/lib/typing/tastenErklaerung";

const ev = (key: string, code: string, mod: Partial<KeyEventLike> = {}): KeyEventLike => ({
  key, code, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, ...mod,
});

// ★ 28.09.2026: Der Kürzel-Katalog von »Im Griff« wird nachgeladen
// (`lib/typing/kuerzelKatalog.ts`); im Fenster ist er da, sobald die Begrüßung
// gesprochen ist. Diese Tests prüfen die Sätze MIT Katalog - den Weg davor
// prüft `tests/tasten-erkunden-katalog-nachladen.test.tsx`.
beforeAll(() => ladeKuerzelKatalog());

describe("Tastenkombinationen sind Lernstoff (Windows)", () => {
  it.skip("Strg + C: Abkürzung - Name - was sie tut", () => {
    const aus = erkundeTaste(ev("c", "KeyC", { ctrlKey: true }), "windows");
    expect(aus.zeile).toBe("Strg + C - Tastenkombination - kopieren.");
    expect(aus.ansage).toBe("Strg + C, Tastenkombination: Kopieren.");
    expect(aus.schlucken).toBe(true);
  });

  it.skip("★ QWERTZ: die Taste mit dem Aufdruck Z heisst Z, auch wenn der Code KeyY ist", () => {
    const aus = erkundeTaste(ev("z", "KeyY", { ctrlKey: true }), "windows", { layout: "de" });
    expect(aus.zeile).toBe("Strg + Z - Tastenkombination - rückgängig machen.");
    // Gegenprobe US-Tastatur: dort ist KeyZ das Z.
    expect(erkundeTaste(ev("z", "KeyZ", { ctrlKey: true }), "windows", { layout: "us" }).zeile)
      .toMatch(/^Strg \+ Z - /);
  });

  it.skip("eine Wirkung in mehreren Programmen steht EINMAL, mit den Orten", () => {
    const was = wirkungenDerKombination(ev("f", "KeyF", { ctrlKey: true }), "windows");
    expect(was).toEqual(["im Explorer, in Word und im Browser: Suchen."]);
  });

  it.skip("verschiedene Wirkungen je Programm stehen nacheinander", () => {
    const zeile = erkundeTaste(ev("h", "KeyH", { ctrlKey: true }), "windows").zeile;
    expect(zeile).toBe("Strg + H - Tastenkombination - in Word: Suchen und Ersetzen. Im Browser: Den Verlauf öffnen.");
  });

  it("Umschalt + Tab kennt der Katalog nicht - die eigene kleine Liste schon", () => {
    expect(erkundeTaste(ev("Tab", "Tab", { shiftKey: true }), "windows").zeile)
      .toBe("Shift + Tab - Tastenkombination - springt zurück zum vorigen Element.");
  });

  it("eine unbekannte Kombination wird ehrlich benannt", () => {
    expect(erkundeTaste(ev("q", "KeyQ", { ctrlKey: true }), "windows").zeile)
      .toBe("Strg + Q - Tastenkombination - was sie tut, hängt vom Programm ab.");
  });

  it("Gegenprobe: Umschalt + Buchstabe ist ein Grossbuchstabe, keine Kombination", () => {
    expect(erkundeTaste(ev("A", "KeyA", { shiftKey: true }), "windows").zeile).toBe("A - großes A");
  });

  it("Gegenprobe: Strg allein bleibt die Steuerungstaste", () => {
    expect(erkundeTaste(ev("Control", "ControlLeft", { ctrlKey: true }), "windows").zeile)
      .toMatch(/^Strg - Steuerungstaste - /);
  });
});

describe("Tastenkombinationen am Mac", () => {
  it.skip("cmd + C", () => {
    expect(erkundeTaste(ev("c", "KeyC", { metaKey: true }), "macos").zeile)
      .toBe("cmd + C - Tastenkombination - kopieren.");
  });
  it.skip("cmd + D tut in drei Programmen drei Dinge", () => {
    const zeile = erkundeTaste(ev("d", "KeyD", { metaKey: true }), "macos").zeile;
    expect(zeile).toMatch(/^cmd \+ D - Tastenkombination - im Finder: /);
    expect(zeile).toMatch(/In Excel: Nach unten ausfüllen\./);
    expect(zeile).toMatch(/Im Browser: Ein Lesezeichen setzen\./);
  });
});

describe("★ der dritte Layer", () => {
  it("Windows: AltGr + Q ist das @, mit dem Weg dahinter", () => {
    const aus = erkundeTaste(ev("@", "KeyQ", { ctrlKey: true, altKey: true }), "windows", { altGr: true });
    expect(aus.zeile).toBe("@ - At-Zeichen - steht in jeder E-Mail-Adresse. Mit AltGr + Q.");
    expect(aus.ansage).toBe("At-Zeichen: Steht in jeder E-Mail-Adresse. Mit AltGr + Q.");
    expect(aus.schlucken).toBe(true);
  });

  it("Windows: AltGr + 8 ist die eckige Klammer", () => {
    expect(erkundeTaste(ev("[", "Digit8", { ctrlKey: true, altKey: true }), "windows", { altGr: true }).zeile)
      .toBe("[ - eckige Klammer auf - wird beim Programmieren gebraucht. Mit AltGr + 8.");
  });

  it("★ Mac: Option + L ist das @ - vorher lief es als Alt-Kombination stumm durch", () => {
    const e = ev("@", "KeyL", { altKey: true });
    expect(gehoertDerSeite(e, "macos")).toBe(false);
    expect(erkundeTaste(e, "macos").zeile).toBe("@ - At-Zeichen - steht in jeder E-Mail-Adresse. Mit Option + L.");
  });

  it("Mac: Option + 8 ist die geschweifte Klammer, Option + 5 die eckige", () => {
    expect(erkundeTaste(ev("{", "Digit8", { altKey: true }), "macos").zeile)
      .toBe("{ - geschweifte Klammer auf - wird beim Programmieren gebraucht. Mit Option + 8.");
    expect(erkundeTaste(ev("[", "Digit5", { altKey: true }), "macos").zeile)
      .toBe("[ - eckige Klammer auf - wird beim Programmieren gebraucht. Mit Option + 5.");
  });

  it("Mac: Option + Shift + 7 ist der umgekehrte Schrägstrich", () => {
    expect(erkundeTaste(ev("\\", "Digit7", { altKey: true, shiftKey: true }), "macos").zeile)
      .toBe("\\ - umgekehrter Schrägstrich - wird beim Programmieren gebraucht. Mit Option + Shift + 7.");
  });

  it("Mac: macht die Wahltaste kein eigenes Zeichen daraus, ist es eine Kombination", () => {
    expect(erkundeTaste(ev("l", "KeyL", { altKey: true }), "macos").zeile)
      .toBe("Option + L - Tastenkombination - was sie tut, hängt vom Programm ab.");
  });

  it("Gegenprobe: ohne AltGr kein „Mit …“ hinter dem Zeichen", () => {
    expect(erkundeTaste(ev("@", "", {}), "windows").zeile).toBe("@ - At-Zeichen - steht in jeder E-Mail-Adresse.");
  });
});

describe("was der Seite gehört (durchgereicht wird, wie in »im Griff«)", () => {
  it("die Kürzel von Tastenflow: Alt + H, Alt + V, Alt + K, Zoom", () => {
    expect(gehoertDerSeite(ev("h", "KeyH", { altKey: true }), "windows")).toBe(true);
    expect(gehoertDerSeite(ev("v", "KeyV", { altKey: true }), "windows")).toBe(true);
    expect(gehoertDerSeite(ev("k", "KeyK", { altKey: true }), "windows")).toBe(true);
    expect(gehoertDerSeite(ev("+", "BracketRight", { altKey: true }), "windows")).toBe(true);
    // Am Mac liefert Option + H ein „ª" - entschieden wird über die Taste.
    expect(gehoertDerSeite(ev("ª", "KeyH", { altKey: true }), "macos")).toBe(true);
  });

  it("Gegenprobe: alles andere gehört dem Erkunden", () => {
    expect(gehoertDerSeite(ev("c", "KeyC", { ctrlKey: true }), "windows")).toBe(false);
    expect(gehoertDerSeite(ev("1", "Digit1", { altKey: true }), "windows")).toBe(false);
    expect(gehoertDerSeite(ev("h", "KeyH", { altKey: true, ctrlKey: true }), "windows")).toBe(false);
    // AltGr + E ist das €, kein Alt + E.
    expect(gehoertDerSeite(ev("€", "KeyE", { altKey: true, ctrlKey: true }), "windows", true)).toBe(false);
    // Alt + 3 ist der Ausgang - den behandelt der Modus selbst.
    expect(gehoertDerSeite(ev("3", "Digit3", { altKey: true }), "windows")).toBe(false);
    // ★ 13.09.2026: Alt + 4 wechselt zwischen Erkunden und Finden - auch das behandelt der Modus selbst.
    expect(gehoertDerSeite(ev("4", "Digit4", { altKey: true }), "windows")).toBe(false);
    expect(gehoertDerSeite(ev("4", "Numpad4", { altKey: true }), "windows")).toBe(false);
  });

  it("★★★ Wächter: die Liste ist genau die der Seite und der Kopfzeile", () => {
    const WURZEL = join(__dirname, "..");
    const seite = readFileSync(join(WURZEL, "src/features/public/TippenTrainerPage.tsx"), "utf8");
    const von = seite.indexOf("const onKey = (e: KeyboardEvent) => {");
    const bis = seite.indexOf('document.addEventListener("keydown", onKey);', von);
    expect(von).toBeGreaterThan(0);
    expect(bis).toBeGreaterThan(von);
    const block = seite.slice(von, bis);
    const codes = new Set<string>();
    for (const m of block.matchAll(/case "(\w+)":/g)) codes.add(m[1]);
    for (const m of block.matchAll(/e\.code === "(\w+)"/g)) codes.add(m[1]);
    // ★ 18.10.2026 (Kürzel einheitlich): zwei Kürzel stehen nicht als `case` da -
    // Alt + 0 über `istNormalgroesseTaste` (lib/shortcuts.ts), Alt + Z / Alt + W nach
    // dem AUFDRUCK der eingestellten Tastatur. Deren Lage wandert (QWERTZ: Z auf
    // KeyY, AZERTY: Z auf KeyW, W auf KeyZ) - darum gehören alle drei Lagen der Seite.
    if (block.includes("istNormalgroesseTaste(e)")) ["Digit0", "Numpad0"].forEach((c) => codes.add(c));
    if (block.includes('aufdruck("z")')) ["KeyW", "KeyY", "KeyZ"].forEach((c) => codes.add(c));
    codes.delete("Digit3");
    codes.delete("Numpad3");
    // ★ 13.09.2026: Alt + 4 öffnet „Tasten finden" - im Fenster wechselt es der Modus selbst.
    codes.delete("Digit4");
    codes.delete("Numpad4");
    const kopf = readFileSync(join(WURZEL, "src/components/AppKopfzeile.tsx"), "utf8");
    for (const m of kopf.matchAll(/unsereAltTaste\(e, "(\w+)"\)/g)) codes.add(m[1]);
    // Gegenprobe: die Suche hat überhaupt etwas gefunden.
    expect(codes.size).toBeGreaterThanOrEqual(20);
    expect([...TASTENFLOW_ALT_CODES].sort()).toEqual([...codes].sort());
  });
});
