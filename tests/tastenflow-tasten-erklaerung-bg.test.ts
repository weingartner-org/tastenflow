/**
 * ★★★ WÄCHTER O-INHALT-BG (29.10.2026): „TASTEN ERKUNDEN", TASTENNAMEN UND SUCHRUNDE AUF BULGARISCH (`tastenErklaerungBg.ts`).
 *
 * Vorbild: `typing-tasten-erklaerung.test.ts` (jede Wörterbuch-Taste hat einen Satz) und die cs-Abschnitte in
 * `tastenflow-tschechisch-alles.test.tsx`. Geprüft über die FEHLERKLASSE:
 *  · jede Wörterbuch-Taste beider Plattformen hat eine bulgarische Erklärung und eine Suchrunden-Nennung,
 *  · jeder Satz ganz kyrillisch bis auf Tastennamen wie auf der Kappe (Glossar Regel 11, §3), kein Englisch, kein Deutsch (der
 *    Satz „На немската клавиатура на него пише Strg." nennt die deutsche Kappe mit Absicht und wird vorher abgezogen),
 *  · keine Knopfnamen, die Tastennamen sind („Назад", „Начало" - Regel 10), keine Maus-Wörter, kein Geschlecht am Kind,
 *  · `erkundeTaste` mit Bedienung „bg" sagt Bulgarisch, `unitLabelBg` nennt jede Einheit des Weges bulgarisch.
 * GEGENPROBE: die englischen Sätze (der alte Rückfall) fallen durch.
 */
import { describe, expect, it } from "vitest";
import type { KeyEventLike } from "../src/lib/computer/chord";
import type { Plattform } from "../src/lib/computer/model";
import { tastenFuer } from "../src/lib/computer/tastenNamen";
import { erkundeTaste } from "../src/lib/typing/tastenErklaerung";
import { sondertasteEn } from "../src/lib/typing/tastenErklaerungEn";
import {
  TASTEN_SATZ_BG,
  ansageSuchauftragBg,
  sondertasteBg,
  suchSatzBg,
  unitLabelBg,
  zeichenNameBg,
} from "../src/lib/typing/tastenErklaerungBg";
import { introOrder } from "../src/lib/typing/letters";
import { satzFehler } from "./helfer/oInhaltNeueWege";

/** Lateinische Wörter, die in bulgarischen Sätzen stehen dürfen: Tastennamen wie auf der Kappe, Programme, Marken (Glossar §3). */
const LATEIN = new Set([
  "Tab", "Enter", "Return", "Backspace", "Delete", "Del", "Esc", "Escape", "Shift", "Caps", "Lock", "Ctrl", "Control", "ctrl",
  "Alt", "AltGr", "Windows", "Win", "Home", "End", "Page", "Up", "Down", "PgUp", "PgDn", "Insert", "Ins", "Command", "cmd",
  "Option", "Fn", "fn", "Num", "Print", "Screen", "Scroll", "Pause", "NVDA", "JAWS", "VoiceOver", "Tastenflow", "Word",
  "Excel", "Teams", "PowerPoint", "Outlook", "Finder", "Mac", "MacBook",
]);
const VERBOTEN = /(?<!\p{L})(Назад|Начало)(?!\p{L})|щракн|кликн|мишк|(?<!\p{L})си \p{L}+(л|ла|ли)(?!\p{L})|(?<!\p{L})(готов|сигурен)/u;
const PLATTFORMEN: readonly Plattform[] = ["windows", "macos"];

/** Die Sätze ohne den Hinweis auf die deutsche Kappe (er nennt „Strg", „Entf" … mit Absicht). */
const ohneDeutscheKappe = (saetze: readonly string[]) => saetze.filter((s) => !s.startsWith("На немската клавиатура"));

function fehler(quelle: string, text: string): string[] {
  const out = satzFehler(quelle, text, "Cyrillic", LATEIN);
  if (VERBOTEN.test(text)) out.push(`${quelle}: verbotenes Wort - „${text}"`);
  return out;
}

const ereignis = (key: string, code: string, mod: Partial<KeyEventLike> = {}): KeyEventLike => ({
  key, code, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, ...mod,
});

describe("jede Wörterbuch-Taste hat einen bulgarischen Satz", () => {
  for (const plattform of PLATTFORMEN)
    it(`${plattform}: Erklärung und Suchauftrag, ganz bulgarisch`, () => {
      const alle: string[] = [];
      for (const t of tastenFuer(plattform)) {
        for (const layout of ["de", "bg", "us"] as const) {
          const e = sondertasteBg(t.id, plattform, layout);
          if (!e) {
            alle.push(`${t.id}: keine Erklärung`);
            continue;
          }
          alle.push(...fehler(`${t.id} Name`, e.name));
          for (const s of ohneDeutscheKappe(e.was)) alle.push(...fehler(`${t.id}`, s));
        }
        alle.push(...fehler(`${t.id} Suche`, ansageSuchauftragBg(t, plattform)));
      }
      expect(alle).toEqual([]);
    });

  it("der Hinweis auf die deutsche Kappe steht nur bei deutscher Tastatur", () => {
    expect(sondertasteBg("strg", "windows", "de")!.was).toContain("На немската клавиатура на него пише Strg.");
    expect(sondertasteBg("strg", "windows", "bg")!.was.join(" ")).not.toMatch(/Strg/);
  });

  it("GEGENPROBE: die englischen Erklärungen (der alte Rückfall) fallen durch", () => {
    const alt = tastenFuer("windows").flatMap((t) => (sondertasteEn(t.id, "windows", "bg")?.was ?? []).flatMap((s) => fehler(t.id, s)));
    expect(alt.length).toBeGreaterThan(20);
  });
});

describe("Zeichen, Akzente, Wirkungen, Wörter: bulgarisch", () => {
  it("jedes Zeichen hat einen bulgarischen Namen und Satz", () => {
    const alle: string[] = [];
    for (const [ch, z] of Object.entries(TASTEN_SATZ_BG.zeichen)) {
      const name = TASTEN_SATZ_BG.zeichenName(ch);
      if (name === ch) alle.push(`${ch}: kein Name`);
      alle.push(...fehler(`Zeichen ${ch}`, `${name} ${z.was.join(" ")}`));
    }
    for (const [id, a] of Object.entries(TASTEN_SATZ_BG.akzente)) alle.push(...fehler(`Akzent ${id}`, `${a.name} ${a.was.join(" ")}`.replace(/[êéèë]/g, "")));
    for (const [id, o] of Object.entries(TASTEN_SATZ_BG.ort)) alle.push(...fehler(`Ort ${id}`, o));
    for (const p of PLATTFORMEN) for (const k of TASTEN_SATZ_BG.eigeneKombinationen[p]) alle.push(...fehler(`Kombi ${k.keys}`, k.was));
    const w = TASTEN_SATZ_BG.erkundenWoerter;
    alle.push(...fehler("Wörter", `${w.kombination} ${w.kombiUnbekannt} ${w.mit} ${w.akzentTaste} ${w.unbekannt} ${w.taste("X")}`));
    expect(alle).toEqual([]);
  });

  it("jede Wirkung des Kürzel-Katalogs, die Englisch kennt, hat einen bulgarischen Namen", () => {
    const ids = ["kopieren", "einfuegen", "speichern", "fett", "suchen", "autosumme", "neu-laden", "sr-stopp", "papierkorb"];
    for (const id of ids) {
      const s = TASTEN_SATZ_BG.wirkung(id, "windows");
      expect(s, id).not.toBeNull();
      expect(fehler(id, s!)).toEqual([]);
    }
    expect(TASTEN_SATZ_BG.wirkung("gibt-es-nicht", "windows")).toBeNull();
  });

  it("die Buchstaben ъ ь й ѝ heissen mit ihrem Schulnamen, Grossbuchstaben „главно …“", () => {
    expect(zeichenNameBg("ъ")).toBe("ер голям");
    expect(zeichenNameBg("ь")).toBe("ер малък");
    expect(zeichenNameBg("й")).toBe("и кратко");
    expect(zeichenNameBg("Ж")).toBe("главно Ж");
    expect(zeichenNameBg("Й")).toBe("главно и кратко");
    expect(zeichenNameBg("ж")).toBe("ж");
    expect(TASTEN_SATZ_BG.aufzaehlung(["а", "б", "в"])).toBe("а, б и в");
  });

  it("unitLabelBg nennt jede Einheit des Weges bulgarisch - nie ein englisches Wort, nie nur das Satzzeichen", () => {
    const alle: string[] = [];
    for (const u of introOrder("bg")) {
      const name = unitLabelBg(u, "bg");
      alle.push(...fehler(`Einheit ${u}`, name));
      if (u.toUpperCase() === u.toLowerCase() && !/^\d$/.test(u) && name === u) alle.push(`${u}: nur das Zeichen`);
    }
    expect(alle).toEqual([]);
    expect(unitLabelBg("⇧", "bg")).toBe("главни букви");
    expect(unitLabelBg("5", "bg")).toBe("цифра 5");
    expect(unitLabelBg("„", "bg")).toBe("долни кавички");
    expect(unitLabelBg("ж", "bg")).toBe("Ж");
  });
});

describe("erkundeTaste und Suchrunde mit Bedienung „bg“", () => {
  const optionen = { sprache: "bg" as const, layout: "bg" as const };

  it("Sondertasten, Zeichen, F-Tasten, Kombinationen: bulgarisch", () => {
    const proben = [
      ereignis("Tab", "Tab"),
      ereignis("Enter", "Enter"),
      ereignis(" ", "Space"),
      ereignis("Backspace", "Backspace"),
      ereignis("Shift", "ShiftLeft", { shiftKey: true }),
      ereignis("F5", "F5"),
      ereignis(",", "KeyQ"),
      ereignis("ж", "KeyT"),
      ereignis("c", "KeyC", { ctrlKey: true }),
    ];
    const alle: string[] = [];
    for (const e of proben) {
      const a = erkundeTaste(e, "windows", optionen);
      alle.push(...fehler(`Zeile ${e.key}`, a.zeile), ...fehler(`Ansage ${e.key}`, a.ansage));
    }
    expect(alle).toEqual([]);
    expect(erkundeTaste(ereignis("Tab", "Tab"), "windows", optionen).ansage).toMatch(/^клавиш Tab: Минава/);
  });

  it("die Sätze der Suchrunde: daneben, gefunden, weiter, fertig - bulgarisch, ohne Geschlecht", () => {
    const tasten = tastenFuer("windows").slice(0, 3);
    const saetze = [
      suchSatzBg("daneben", tasten[1], tasten, 0, "windows"),
      suchSatzBg("daneben", null, tasten, 0, "windows"),
      suchSatzBg("gefunden", null, tasten, 0, "windows"),
      suchSatzBg("weiter", null, tasten, 0, "windows"),
      suchSatzBg("fertig", null, tasten, 2, "windows"),
    ];
    expect(saetze.flatMap((s) => fehler("Suche", s))).toEqual([]);
    expect(saetze[0]).toMatch(/^Това е /);
    expect(saetze[4]).toMatch(/Намерени клавиши: 3 от 3\./);
  });
});
