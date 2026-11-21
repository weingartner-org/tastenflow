/**
 * ★★★ WÄCHTER O-INHALT-UK (29.10.2026): „TASTEN ERKUNDEN", TASTENNAMEN UND SUCHRUNDE AUF UKRAINISCH (`tastenErklaerungUk.ts`).
 *
 * Vorbild: `typing-tasten-erklaerung.test.ts` (jede Wörterbuch-Taste hat einen Satz) und die cs-Abschnitte in
 * `tastenflow-tschechisch-alles.test.tsx`. Geprüft über die FEHLERKLASSE:
 *  · jede Wörterbuch-Taste beider Plattformen hat eine ukrainische Erklärung und eine Suchrunden-Nennung,
 *  · jeder Satz ganz kyrillisch bis auf Tastennamen wie auf der Kappe (Glossar Regel 11, §3), kein Englisch, kein Deutsch (der
 *    Satz „На німецькій клавіатурі на ній написано Strg." nennt die deutsche Kappe mit Absicht und wird vorher abgezogen),
 *  · keine Knopfnamen, die Tastennamen sind („Домашня сторінка" - Regel 10), kein Russismus und kein russischer Buchstabe (Regel 14), keine Maus-Wörter, kein Geschlecht am Kind,
 *  · `erkundeTaste` mit Bedienung „uk" sagt Ukrainisch, `unitLabelUk` nennt jede Einheit des Weges ukrainisch.
 * GEGENPROBE: die englischen Sätze (der alte Rückfall) fallen durch.
 */
import { describe, expect, it } from "vitest";
import type { KeyEventLike } from "../src/lib/computer/chord";
import type { Plattform } from "../src/lib/computer/model";
import { tastenFuer } from "../src/lib/computer/tastenNamen";
import { erkundeTaste } from "../src/lib/typing/tastenErklaerung";
import { sondertasteEn } from "../src/lib/typing/tastenErklaerungEn";
import {
  TASTEN_SATZ_UK,
  ansageSuchauftragUk,
  sondertasteUk,
  suchSatzUk,
  unitLabelUk,
  zeichenNameUk,
} from "../src/lib/typing/tastenErklaerungUk";
import { introOrder } from "../src/lib/typing/letters";
import { satzFehler } from "./helfer/oInhaltNeueWege";

/** Lateinische Wörter, die in ukrainischen Sätzen stehen dürfen: Tastennamen wie auf der Kappe, Programme, Marken (Glossar §3). */
const LATEIN = new Set([
  "Tab", "Enter", "Return", "Backspace", "Delete", "Del", "Esc", "Escape", "Shift", "Caps", "Lock", "Ctrl", "Control", "ctrl",
  "Alt", "AltGr", "Windows", "Win", "Home", "End", "Page", "Up", "Down", "PgUp", "PgDn", "Insert", "Ins", "Command", "cmd",
  "Option", "Fn", "fn", "Num", "Print", "Screen", "Scroll", "Pause", "NVDA", "JAWS", "VoiceOver", "Tastenflow", "Word",
  "Excel", "Teams", "PowerPoint", "Outlook", "Finder", "Mac", "MacBook",
]);
const VERBOTEN = /Домашня сторінка|клацн|мишею|перетягн|[ыэъ]|(?<!\p{L})(відкрив|відкрила|знайшов|знайшла|готовий|готова)(?!\p{L})/u;
const PLATTFORMEN: readonly Plattform[] = ["windows", "macos"];

/** Die Sätze ohne den Hinweis auf die deutsche Kappe (er nennt „Strg", „Entf" … mit Absicht). */
const ohneDeutscheKappe = (saetze: readonly string[]) => saetze.filter((s) => !s.startsWith("На німецькій клавіатурі"));

function fehler(quelle: string, text: string): string[] {
  const out = satzFehler(quelle, text, "Cyrillic", LATEIN);
  if (VERBOTEN.test(text)) out.push(`${quelle}: verbotenes Wort - „${text}"`);
  return out;
}

const ereignis = (key: string, code: string, mod: Partial<KeyEventLike> = {}): KeyEventLike => ({
  key, code, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, ...mod,
});

describe("jede Wörterbuch-Taste hat einen ukrainischen Satz", () => {
  for (const plattform of PLATTFORMEN)
    it(`${plattform}: Erklärung und Suchauftrag, ganz ukrainisch`, () => {
      const alle: string[] = [];
      for (const t of tastenFuer(plattform)) {
        for (const layout of ["de", "ua", "us"] as const) {
          const e = sondertasteUk(t.id, plattform, layout);
          if (!e) {
            alle.push(`${t.id}: keine Erklärung`);
            continue;
          }
          alle.push(...fehler(`${t.id} Name`, e.name));
          for (const s of ohneDeutscheKappe(e.was)) alle.push(...fehler(`${t.id}`, s));
        }
        alle.push(...fehler(`${t.id} Suche`, ansageSuchauftragUk(t, plattform)));
      }
      expect(alle).toEqual([]);
    });

  it("der Hinweis auf die deutsche Kappe steht nur bei deutscher Tastatur", () => {
    expect(sondertasteUk("strg", "windows", "de")!.was).toContain("На німецькій клавіатурі на ній написано Strg.");
    expect(sondertasteUk("strg", "windows", "ua")!.was.join(" ")).not.toMatch(/Strg/);
  });

  it("GEGENPROBE: die englischen Erklärungen (der alte Rückfall) fallen durch", () => {
    const alt = tastenFuer("windows").flatMap((t) => (sondertasteEn(t.id, "windows", "ua")?.was ?? []).flatMap((s) => fehler(t.id, s)));
    expect(alt.length).toBeGreaterThan(20);
  });
});

describe("Zeichen, Akzente, Wirkungen, Wörter: ukrainisch", () => {
  it("jedes Zeichen hat einen ukrainischen Namen und Satz", () => {
    const alle: string[] = [];
    for (const [ch, z] of Object.entries(TASTEN_SATZ_UK.zeichen).filter(([c]) => c !== "ё")) {
      const name = TASTEN_SATZ_UK.zeichenName(ch);
      if (name === ch) alle.push(`${ch}: kein Name`);
      alle.push(...fehler(`Zeichen ${ch}`, `${name} ${z.was.join(" ")}`));
    }
    for (const [id, a] of Object.entries(TASTEN_SATZ_UK.akzente)) alle.push(...fehler(`Akzent ${id}`, `${a.name} ${a.was.join(" ")}`.replace(/[êéèë]/g, "")));
    for (const [id, o] of Object.entries(TASTEN_SATZ_UK.ort)) alle.push(...fehler(`Ort ${id}`, o));
    for (const p of PLATTFORMEN) for (const k of TASTEN_SATZ_UK.eigeneKombinationen[p]) alle.push(...fehler(`Kombi ${k.keys}`, k.was));
    const w = TASTEN_SATZ_UK.erkundenWoerter;
    alle.push(...fehler("Wörter", `${w.kombination} ${w.kombiUnbekannt} ${w.mit} ${w.akzentTaste} ${w.unbekannt} ${w.taste("X")}`));
    expect(alle).toEqual([]);
  });

  it("jede Wirkung des Kürzel-Katalogs, die Englisch kennt, hat einen ukrainischen Namen", () => {
    const ids = ["kopieren", "einfuegen", "speichern", "fett", "suchen", "autosumme", "neu-laden", "sr-stopp", "papierkorb"];
    for (const id of ids) {
      const s = TASTEN_SATZ_UK.wirkung(id, "windows");
      expect(s, id).not.toBeNull();
      expect(fehler(id, s!)).toEqual([]);
    }
    expect(TASTEN_SATZ_UK.wirkung("gibt-es-nicht", "windows")).toBeNull();
  });

  it("ґ, й, ь heissen mit ihrem Schulnamen, Grossbuchstaben „велика …\"", () => {
    expect(zeichenNameUk("ь")).toBe("м'який знак");
    expect(zeichenNameUk("ґ")).toBe("ґе");
    expect(zeichenNameUk("й")).toBe("йот");
    expect(zeichenNameUk("Ї")).toBe("велика Ї");
    expect(zeichenNameUk("Ґ")).toBe("велика ґе");
    expect(zeichenNameUk("'")).toBe("апостроф");
    expect(zeichenNameUk("ї")).toBe("ї");
    expect(TASTEN_SATZ_UK.aufzaehlung(["а", "б", "в"])).toBe("а, б і в");
  });

  it("unitLabelUk nennt jede Einheit des Weges ukrainisch - nie ein englisches Wort, nie nur das Satzzeichen", () => {
    const alle: string[] = [];
    for (const u of introOrder("uk")) {
      const name = unitLabelUk(u, "uk");
      alle.push(...fehler(`Einheit ${u}`, name));
      if (u.toUpperCase() === u.toLowerCase() && !/^\d$/.test(u) && name === u) alle.push(`${u}: nur das Zeichen`);
    }
    expect(alle).toEqual([]);
    expect(unitLabelUk("⇧", "uk")).toBe("великі літери");
    expect(unitLabelUk("5", "uk")).toBe("цифра 5");
    expect(unitLabelUk("'", "uk")).toBe("апостроф");
    expect(unitLabelUk("ї", "uk")).toBe("Ї");
  });
});

describe("erkundeTaste und Suchrunde mit Bedienung „uk“", () => {
  const optionen = { sprache: "uk" as const, layout: "ua" as const };

  it("Sondertasten, Zeichen, F-Tasten, Kombinationen: ukrainisch", () => {
    const proben = [
      ereignis("Tab", "Tab"),
      ereignis("Enter", "Enter"),
      ereignis(" ", "Space"),
      ereignis("Backspace", "Backspace"),
      ereignis("Shift", "ShiftLeft", { shiftKey: true }),
      ereignis("F5", "F5"),
      ereignis(",", "Slash", { shiftKey: true }),
      ereignis("ї", "BracketRight"),
      ereignis("c", "KeyC", { ctrlKey: true }),
    ];
    const alle: string[] = [];
    for (const e of proben) {
      const a = erkundeTaste(e, "windows", optionen);
      alle.push(...fehler(`Zeile ${e.key}`, a.zeile), ...fehler(`Ansage ${e.key}`, a.ansage));
    }
    expect(alle).toEqual([]);
    expect(erkundeTaste(ereignis("Tab", "Tab"), "windows", optionen).ansage).toMatch(/^клавіша Tab: Переходить/);
  });

  it("die Sätze der Suchrunde: daneben, gefunden, weiter, fertig - ukrainisch, ohne Geschlecht", () => {
    const tasten = tastenFuer("windows").slice(0, 3);
    const saetze = [
      suchSatzUk("daneben", tasten[1], tasten, 0, "windows"),
      suchSatzUk("daneben", null, tasten, 0, "windows"),
      suchSatzUk("gefunden", null, tasten, 0, "windows"),
      suchSatzUk("weiter", null, tasten, 0, "windows"),
      suchSatzUk("fertig", null, tasten, 2, "windows"),
    ];
    expect(saetze.flatMap((s) => fehler("Suche", s))).toEqual([]);
    expect(saetze[0]).toMatch(/^Це /);
    expect(saetze[4]).toMatch(/Знайдено всі клавіші: 3\/3\./);
  });
});
