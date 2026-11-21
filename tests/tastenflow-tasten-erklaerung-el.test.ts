/**
 * ★★★ WÄCHTER O-INHALT-EL (29.10.2026): „TASTEN ERKUNDEN", TASTENNAMEN UND SUCHRUNDE AUF GRIECHISCH (`tastenErklaerungEl.ts`).
 *
 * Vorbild: `typing-tasten-erklaerung.test.ts` (jede Wörterbuch-Taste hat einen Satz) und die cs-Abschnitte in
 * `tastenflow-tschechisch-alles.test.tsx`. Geprüft über die FEHLERKLASSE:
 *  · jede Wörterbuch-Taste beider Plattformen hat eine griechische Erklärung und eine Suchrunden-Nennung,
 *  · jeder Satz ganz griechisch bis auf Tastennamen wie auf der Kappe (Glossar Regel 11, §3), kein Englisch, kein Deutsch (der
 *    Satz „Στο γερμανικό πληκτρολόγιο γράφει Strg." nennt die deutsche Kappe mit Absicht und wird vorher abgezogen),
 *  · keine Knopfnamen, die Tastennamen sind („Αρχική" - Regel 10), kein „?" (Regel 7), keine Maus-Wörter, kein Geschlecht am Kind,
 *  · `erkundeTaste` mit Bedienung „el" sagt Griechisch, `unitLabelEl` nennt jede Einheit des Weges griechisch.
 * GEGENPROBE: die englischen Sätze (der alte Rückfall) fallen durch.
 */
import { describe, expect, it } from "vitest";
import type { KeyEventLike } from "../src/lib/computer/chord";
import type { Plattform } from "../src/lib/computer/model";
import { tastenFuer } from "../src/lib/computer/tastenNamen";
import { erkundeTaste } from "../src/lib/typing/tastenErklaerung";
import { sondertasteEn } from "../src/lib/typing/tastenErklaerungEn";
import {
  TASTEN_SATZ_EL,
  ansageSuchauftragEl,
  sondertasteEl,
  suchSatzEl,
  unitLabelEl,
  zeichenNameEl,
} from "../src/lib/typing/tastenErklaerungEl";
import { introOrder } from "../src/lib/typing/letters";
import { satzFehler } from "./helfer/oInhaltNeueWege";

/** Lateinische Wörter, die in griechischen Sätzen stehen dürfen: Tastennamen wie auf der Kappe, Programme, Marken (Glossar §3). */
const LATEIN = new Set([
  "Tab", "Enter", "Return", "Backspace", "Delete", "Del", "Esc", "Escape", "Shift", "Caps", "Lock", "Ctrl", "Control", "ctrl",
  "Alt", "AltGr", "Windows", "Win", "Home", "End", "Page", "Up", "Down", "PgUp", "PgDn", "Insert", "Ins", "Command", "cmd",
  "Option", "Fn", "fn", "Num", "Print", "Screen", "Scroll", "Pause", "NVDA", "JAWS", "VoiceOver", "Tastenflow", "Word",
  "Excel", "Teams", "PowerPoint", "Outlook", "Finder", "Mac", "MacBook", "Gr", "email",
]);
const VERBOTEN = /(?<!\p{L})Αρχική(?!\p{L})|κλικ|ποντίκι|σύρε|\?|(?<!\p{L})(έτοιμος|έτοιμη|σίγουρος|σίγουρη)(?!\p{L})/u;
const PLATTFORMEN: readonly Plattform[] = ["windows", "macos"];

/** Die Sätze ohne den Hinweis auf die deutsche Kappe (er nennt „Strg", „Entf" … mit Absicht). */
const ohneDeutscheKappe = (saetze: readonly string[]) => saetze.filter((s) => !s.startsWith("Στο γερμανικό πληκτρολόγιο"));

function fehler(quelle: string, text: string): string[] {
  const out = satzFehler(quelle, text, "Greek", LATEIN);
  if (VERBOTEN.test(text)) out.push(`${quelle}: verbotenes Wort - „${text}"`);
  return out;
}

const ereignis = (key: string, code: string, mod: Partial<KeyEventLike> = {}): KeyEventLike => ({
  key, code, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, ...mod,
});

describe("jede Wörterbuch-Taste hat einen griechischen Satz", () => {
  for (const plattform of PLATTFORMEN)
    it(`${plattform}: Erklärung und Suchauftrag, ganz griechisch`, () => {
      const alle: string[] = [];
      for (const t of tastenFuer(plattform)) {
        for (const layout of ["de", "el", "us"] as const) {
          const e = sondertasteEl(t.id, plattform, layout);
          if (!e) {
            alle.push(`${t.id}: keine Erklärung`);
            continue;
          }
          alle.push(...fehler(`${t.id} Name`, e.name));
          for (const s of ohneDeutscheKappe(e.was)) alle.push(...fehler(`${t.id}`, s));
        }
        alle.push(...fehler(`${t.id} Suche`, ansageSuchauftragEl(t, plattform)));
      }
      expect(alle).toEqual([]);
    });

  it("der Hinweis auf die deutsche Kappe steht nur bei deutscher Tastatur", () => {
    expect(sondertasteEl("strg", "windows", "de")!.was).toContain("Στο γερμανικό πληκτρολόγιο γράφει Strg.");
    expect(sondertasteEl("strg", "windows", "el")!.was.join(" ")).not.toMatch(/Strg/);
  });

  it("GEGENPROBE: die englischen Erklärungen (der alte Rückfall) fallen durch", () => {
    const alt = tastenFuer("windows").flatMap((t) => (sondertasteEn(t.id, "windows", "el")?.was ?? []).flatMap((s) => fehler(t.id, s)));
    expect(alt.length).toBeGreaterThan(20);
  });
});

describe("Zeichen, Akzente, Wirkungen, Wörter: griechisch", () => {
  it("jedes Zeichen hat einen griechischen Namen und Satz", () => {
    const alle: string[] = [];
    for (const [ch, z] of Object.entries(TASTEN_SATZ_EL.zeichen)) {
      const name = TASTEN_SATZ_EL.zeichenName(ch);
      if (name === ch) alle.push(`${ch}: kein Name`);
      alle.push(...fehler(`Zeichen ${ch}`, `${name} ${z.was.join(" ")}`));
    }
    for (const [id, a] of Object.entries(TASTEN_SATZ_EL.akzente)) alle.push(...fehler(`Akzent ${id}`, `${a.name} ${a.was.join(" ")}`.replace(/[êéèë]/g, "")));
    for (const [id, o] of Object.entries(TASTEN_SATZ_EL.ort)) alle.push(...fehler(`Ort ${id}`, o));
    for (const p of PLATTFORMEN) for (const k of TASTEN_SATZ_EL.eigeneKombinationen[p]) alle.push(...fehler(`Kombi ${k.keys}`, k.was));
    const w = TASTEN_SATZ_EL.erkundenWoerter;
    alle.push(...fehler("Wörter", `${w.kombination} ${w.kombiUnbekannt} ${w.mit} ${w.akzentTaste} ${w.unbekannt} ${w.taste("X")}`));
    expect(alle).toEqual([]);
  });

  it("jede Wirkung des Kürzel-Katalogs, die Englisch kennt, hat einen griechischen Namen", () => {
    const ids = ["kopieren", "einfuegen", "speichern", "fett", "suchen", "autosumme", "neu-laden", "sr-stopp", "papierkorb"];
    for (const id of ids) {
      const s = TASTEN_SATZ_EL.wirkung(id, "windows");
      expect(s, id).not.toBeNull();
      expect(fehler(id, s!)).toEqual([]);
    }
    expect(TASTEN_SATZ_EL.wirkung("gibt-es-nicht", "windows")).toBeNull();
  });

  it("ς heisst „τελικό σίγμα\", Tonos-Buchstaben „άλφα με τόνο\", Grossbuchstaben „κεφαλαίο …\"", () => {
    expect(zeichenNameEl("ς")).toBe("τελικό σίγμα");
    expect(zeichenNameEl("ά")).toBe("άλφα με τόνο");
    expect(zeichenNameEl("ΐ")).toBe("γιώτα με διαλυτικά και τόνο");
    expect(zeichenNameEl("Φ")).toBe("κεφαλαίο φι");
    expect(zeichenNameEl("Ά")).toBe("κεφαλαίο άλφα με τόνο");
    expect(zeichenNameEl(";")).toBe("ερωτηματικό");
    expect(zeichenNameEl("φ")).toBe("φ");
    expect(TASTEN_SATZ_EL.aufzaehlung(["α", "β", "γ"])).toBe("α, β και γ");
    // Tonos bleibt bei der Grossschreibung der Kappe (Glossar Regel 7).
    expect(TASTEN_SATZ_EL.aufdruckGross("ά")).toBe("Ά");
  });

  it("unitLabelEl nennt jede Einheit des Weges griechisch - nie ein englisches Wort, nie nur das Satzzeichen", () => {
    const alle: string[] = [];
    for (const u of introOrder("el")) {
      const name = unitLabelEl(u, "el");
      alle.push(...fehler(`Einheit ${u}`, name));
      if (u.toUpperCase() === u.toLowerCase() && !/^\d$/.test(u) && name === u) alle.push(`${u}: nur das Zeichen`);
    }
    expect(alle).toEqual([]);
    expect(unitLabelEl("⇧", "el")).toBe("κεφαλαία");
    expect(unitLabelEl("5", "el")).toBe("ψηφίο 5");
    expect(unitLabelEl(";", "el")).toBe("ερωτηματικό");
    expect(unitLabelEl("΄", "el")).toBe("τόνος");
    expect(unitLabelEl("φ", "el")).toBe("Φ");
    expect(unitLabelEl("ς", "el")).toBe("ς");
  });
});

describe("erkundeTaste und Suchrunde mit Bedienung „el“", () => {
  const optionen = { sprache: "el" as const, layout: "el" as const };

  it("Sondertasten, Zeichen, F-Tasten, Kombinationen: griechisch", () => {
    const proben = [
      ereignis("Tab", "Tab"),
      ereignis("Enter", "Enter"),
      ereignis(" ", "Space"),
      ereignis("Backspace", "Backspace"),
      ereignis("Shift", "ShiftLeft", { shiftKey: true }),
      ereignis("F5", "F5"),
      ereignis(",", "Comma"),
      ereignis("δ", "KeyD"),
      ereignis("c", "KeyC", { ctrlKey: true }),
    ];
    const alle: string[] = [];
    for (const e of proben) {
      const a = erkundeTaste(e, "windows", optionen);
      alle.push(...fehler(`Zeile ${e.key}`, a.zeile), ...fehler(`Ansage ${e.key}`, a.ansage));
    }
    expect(alle).toEqual([]);
    expect(erkundeTaste(ereignis("Tab", "Tab"), "windows", optionen).ansage).toMatch(/^πλήκτρο Tab: Πηγαίνει/);
  });

  it("die Sätze der Suchrunde: daneben, gefunden, weiter, fertig - griechisch, ohne Geschlecht", () => {
    const tasten = tastenFuer("windows").slice(0, 3);
    const saetze = [
      suchSatzEl("daneben", tasten[1], tasten, 0, "windows"),
      suchSatzEl("daneben", null, tasten, 0, "windows"),
      suchSatzEl("gefunden", null, tasten, 0, "windows"),
      suchSatzEl("weiter", null, tasten, 0, "windows"),
      suchSatzEl("fertig", null, tasten, 2, "windows"),
    ];
    expect(saetze.flatMap((s) => fehler("Suche", s))).toEqual([]);
    expect(saetze[0]).toMatch(/^Αυτό είναι /);
    expect(saetze[4]).toMatch(/Βρέθηκαν όλα τα πλήκτρα: 3 από 3\./);
  });
});
