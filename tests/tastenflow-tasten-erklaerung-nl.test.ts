/**
 * Wächter über die niederländischen Sätze von „Toetsen verkennen" / „Toetsen zoeken" (`lib/typing/tastenErklaerungNl.ts`,
 * gefüllt 29.10.2026). Vorbild: die Form-Prüfung in `tests/typing-tasten-erklaerung.test.ts`.
 *
 * Geprüft wird über den VERTEILER (`tastenErklaerung.ts`, Sprache "nl"), nicht nur an der Datei: dass jede Wörterbuch-Taste
 * einen niederländischen Satz bekommt, der nicht der englische ist; dass im ganzen Objekt kein Gedankenstrich, kein deutsches,
 * kein englisches und kein Maus-Wort steht; dass Lerneinheiten und Suchrunde niederländisch sprechen. Gegenproben daneben.
 */
import { describe, expect, it } from "vitest";
import type { KeyEventLike } from "../src/lib/computer/chord";
import type { Plattform } from "../src/lib/computer/model";
import { WIRKUNGEN } from "../src/lib/computer/kuerzelWirkung";
import { suchbareTasten, tastenFuer } from "../src/lib/computer/tastenNamen";
import type { LayoutId } from "../src/lib/typing/layouts";
import {
  alleZeichen,
  ansageFuer,
  erklaerungFuerSprache,
  erkundeTaste,
  type TastenErklaerung,
  zeichenName,
  zeileFuer,
} from "../src/lib/typing/tastenErklaerung";
import { SHIFT_UNIT } from "../src/lib/typing/letters";
import { TASTEN_SATZ_NL, suchSatzNl, unitLabelNl } from "../src/lib/typing/tastenErklaerungNl";

const PLATTFORMEN: Plattform[] = ["windows", "macos"];
const LAYOUTS: LayoutId[] = ["nl-intl", "be", "nl-dutch", "de"];
const NACH_KEY = [
  ...Array.from({ length: 24 }, (_, i) => `F${i + 1}`),
  "Home", "End", "PageUp", "PageDown", "Insert", "NumLock", "Clear", "ContextMenu", "PrintScreen", "ScrollLock",
  "Pause", "AudioVolumeUp", "AudioVolumeDown", "AudioVolumeMute", "Fn", "Dead",
];
const LETTERS_MET_TEKEN = ["é", "è", "ë", "ï", "ê", "à", "ç", "ö", "ü", "É", "Ë", "ĳ", "Ĳ", "ß"];

const ev = (key: string, code?: string, extra: Partial<KeyEventLike> = {}): KeyEventLike => ({
  key, code, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, ...extra,
});

/** Was ein Mensch liest - nicht erlaubt. */
const GEDANKENSTRICH = /[–—]/;
const DEUTSCH = /\bTaste\b|drücken|drückst|Leertaste|Umschalt|\bzum Beispiel\b|\bmit Shift dazu\b/i;
const ENGLISCH = /\b(the|key|keys|press|with|and|it|for example|moves|opens|types)\b/i;
const MAUS = /\b(klik\w*|tik\w*|muis\w*|dubbelklik\w*)\b/i;

function hausregelFehler(text: string): string[] {
  const f: string[] = [];
  if (GEDANKENSTRICH.test(text)) f.push(`Gedankenstrich: ${text}`);
  if (DEUTSCH.test(text)) f.push(`Deutsch: ${text}`);
  if (ENGLISCH.test(text)) f.push(`Englisch: ${text}`);
  if (MAUS.test(text)) f.push(`Maus-Wort: ${text}`);
  return f;
}

/** Form wie im deutschen Wächter: Name, Aufgabe, Punkt, kurze Sätze, Abkürzung wiederholt den Namen nicht. */
function formFehler(t: TastenErklaerung): string[] {
  const f: string[] = [];
  if (!t.name) f.push("kein Name");
  if (t.was.length === 0) f.push("keine Aufgabe");
  if (t.kurz && t.name.toLowerCase().startsWith(`${t.kurz.toLowerCase()}-`)) f.push("Abkürzung wiederholt den Namen");
  for (const satz of t.was) {
    if (!/[.?]$/.test(satz.trim())) f.push(`ohne Punkt: ${satz}`);
    if (satz.split(/\s+/).length > 18) f.push(`zu lang: ${satz}`);
  }
  // Keine Zahl mit Punkt am Satzende in der Ansage.
  if (/\d\.$/.test(ansageFuer(t))) f.push(`Zahl am Satzende: ${ansageFuer(t)}`);
  return [...f, ...hausregelFehler(zeileFuer(t)), ...hausregelFehler(ansageFuer(t))];
}

/** Jeder Text, den das niederländische Objekt liefern kann - alle Felder, alle Tasten, alle Plattformen und Tastaturen. */
function alleTexte(): string[] {
  const s = TASTEN_SATZ_NL;
  const texte: string[] = [];
  const nimm = (t: TastenErklaerung | null) => {
    if (t) texte.push(...(t.kurz ? [t.kurz] : []), t.name, ...t.was);
  };
  for (const p of PLATTFORMEN) {
    for (const layout of LAYOUTS) {
      for (const t of tastenFuer(p)) nimm(s.sondertaste(t.id, p, layout));
      for (const key of NACH_KEY) nimm(s.nachKey(key, p, layout));
    }
    for (const k of s.eigeneKombinationen[p]) texte.push(k.was);
    for (const id of Object.keys(WIRKUNGEN)) {
      const w = s.wirkung(id, p);
      if (w) texte.push(w);
    }
  }
  texte.push(...Object.values(s.tasteKurz));
  for (const [ch, z] of Object.entries(s.zeichen)) texte.push(s.zeichenName(ch), ...(z.name ? [z.name] : []), ...z.was);
  for (const ch of [...alleZeichen(), ...LETTERS_MET_TEKEN]) texte.push(s.zeichenName(ch));
  for (const a of Object.values(s.akzente)) texte.push(a.name, ...a.was);
  const w = s.erkundenWoerter;
  texte.push(w.kombination, w.kombiUnbekannt, w.mit, w.akzentTaste, w.unbekannt, w.taste("Q"));
  texte.push(...Object.values(s.ort), s.aufzaehlung(["a", "b", "c"]));
  return texte;
}

describe.each(PLATTFORMEN)("nl über den Verteiler auf %s", (plattform) => {
  it("★ jede Wörterbuch-Taste hat einen niederländischen Satz, nicht den englischen", () => {
    const ohne: string[] = [];
    const englisch: string[] = [];
    for (const t of tastenFuer(plattform)) {
      for (const layout of LAYOUTS) {
        const nl = erklaerungFuerSprache(t.id, plattform, layout, "nl");
        const en = erklaerungFuerSprache(t.id, plattform, layout, "en");
        if (!nl) {
          ohne.push(`${t.id}@${layout}`);
          continue;
        }
        if (en && zeileFuer(nl) === zeileFuer(en)) englisch.push(`${t.id}@${layout}`);
      }
    }
    expect(ohne).toEqual([]);
    expect(englisch).toEqual([]);
  });

  it("jede Wörterbuch-Taste: Form und Hausregeln", () => {
    const fehler: string[] = [];
    for (const t of tastenFuer(plattform)) {
      for (const layout of LAYOUTS) {
        const nl = erklaerungFuerSprache(t.id, plattform, layout, "nl")!;
        fehler.push(...formFehler(nl).map((x) => `${t.id}@${layout}: ${x}`));
      }
    }
    expect(fehler).toEqual([]);
  });

  it("Tasten ausserhalb des Wörterbuchs (F-Tasten, Num, Menü, Totaste): Form und Hausregeln", () => {
    const fehler: string[] = [];
    for (const layout of LAYOUTS) {
      for (const key of NACH_KEY) {
        const t = TASTEN_SATZ_NL.nachKey(key, plattform, layout);
        if (!t) fehler.push(`${key}: kein Satz`);
        else fehler.push(...formFehler(t).map((x) => `${key}@${layout}: ${x}`));
      }
    }
    expect(fehler).toEqual([]);
  });
});

describe("das ganze Objekt", () => {
  it("★ kein Gedankenstrich, kein deutsches, englisches oder Maus-Wort in irgendeinem Feld", () => {
    const texte = alleTexte();
    expect(texte.length).toBeGreaterThan(300);
    expect(texte.flatMap(hausregelFehler)).toEqual([]);
  });

  it("die Zeichen: jedes hat einen niederländischen Namen und Satz, anders als englisch", () => {
    const fehler: string[] = [];
    for (const ch of alleZeichen()) {
      const z = TASTEN_SATZ_NL.zeichen[ch];
      if (!z) fehler.push(`${ch}: kein Satz`);
      if (zeichenName(ch, "nl") === zeichenName(ch, "en") && !["€", "$", "~", "\\", "&", "+"].includes(ch)) {
        fehler.push(`${ch}: englischer Name ${zeichenName(ch, "en")}`);
      }
    }
    expect(fehler).toEqual([]);
  });

  it("Buchstaben mit Zeichen und Grossbuchstaben heissen niederländisch (Glossar §2.8)", () => {
    expect(zeichenName("ë", "nl")).toBe("e met trema");
    expect(zeichenName("é", "nl")).toBe("e met accent aigu");
    expect(zeichenName("ç", "nl")).toBe("c met cedille");
    expect(zeichenName("A", "nl")).toBe("hoofdletter A");
    expect(zeichenName("É", "nl")).toBe("hoofdletter E met accent aigu");
    expect(zeichenName("ĳ", "nl")).toBe("i, j");
    expect(zeichenName("a", "nl")).toBe("a");
  });

  it("Grossdruck nach nl-NL: ij bleibt zwei Zeichen", () => {
    expect(TASTEN_SATZ_NL.aufdruckGross("ij")).toBe("IJ");
    expect(TASTEN_SATZ_NL.aufdruckGross("é")).toBe("É");
  });
});

describe("erkundeTaste mit Sprache nl", () => {
  const nl = { sprache: "nl" as const, layout: "nl-intl" as LayoutId };
  it("Tab, Zeichen, Kombination, unbekannte Taste sprechen niederländisch", () => {
    expect(erkundeTaste(ev("Tab", "Tab"), "windows", nl).zeile).toBe(
      "Tab-toets - gaat naar het volgende onderdeel, bijvoorbeeld naar een link, een tekstvak of een knop. Met Shift erbij ga je terug.",
    );
    expect(erkundeTaste(ev("@", "Digit2", { shiftKey: true }), "windows", nl).zeile).toMatch(/^@ - apenstaartje - staat in elk e-mailadres\.$/);
    const kombi = erkundeTaste(ev("c", "KeyC", { ctrlKey: true }), "windows", nl);
    expect(kombi.zeile).toMatch(/toetscombinatie/);
    expect(hausregelFehler(kombi.zeile)).toEqual([]);
    expect(erkundeTaste(ev("Unidentified"), "windows", nl).zeile).toBe("Deze toets herken ik niet.");
  });

  it("Ziffern: die Ansage endet nicht mit Zahl und Punkt", () => {
    for (const d of ["1", "2", "0"]) {
      const aus = erkundeTaste(ev(d, `Digit${d}`), "windows", nl);
      expect(aus.ansage, d).not.toMatch(/\d\.$/);
      expect(aus.zeile, d).toMatch(/cijfer/);
    }
  });

  it("Belgisch AZERTY: Shift nennt die Ziffern, Alt Gr nennt é für das apenstaartje", () => {
    const be = { sprache: "nl" as const, layout: "be" as LayoutId };
    expect(erkundeTaste(ev("Shift", "ShiftLeft"), "windows", be).zeile).toMatch(/cijfers met Shift/);
    expect(erkundeTaste(ev("AltGraph", "AltRight"), "windows", be).zeile).toMatch(/Alt Gr \+ é typt het apenstaartje/);
  });
});

describe("unitLabelNl", () => {
  it.each([
    ["a", "A"],
    ["r", "R"],
    ["é", "é"],
    ["1", "cijfer 1"],
    ["0", "cijfer 0"],
    [".", "punt"],
    [",", "komma"],
    ["-", "koppelteken"],
    ["?", "vraagteken"],
    ["@", "apenstaartje"],
    ["(", "haakje openen"],
    ["&", "ampersand"],
  ])("%s ⇒ %s", (unit, erwartet) => {
    expect(unitLabelNl(unit)).toBe(erwartet);
  });

  it("Shift heisst hoofdletters", () => {
    expect(unitLabelNl(SHIFT_UNIT)).toBe("hoofdletters");
  });
});

describe("suchSatzNl - alle vier Arten", () => {
  const liste = suchbareTasten("windows");
  const tab = liste.find((t) => t.id === "tabulator")!;
  const caps = liste.find((t) => t.id === "feststell")!;

  it("daneben, gefunden, weiter, fertig", () => {
    const i = liste.indexOf(tab);
    const anderer = liste.find((t) => t.id !== "tabulator")!;
    const saetze = [
      suchSatzNl("daneben", anderer, liste, i, "windows"),
      suchSatzNl("daneben", null, liste, i, "windows"),
      suchSatzNl("gefunden", tab, liste, i, "windows"),
      suchSatzNl("weiter", tab, liste, Math.min(i, liste.length - 2), "windows"),
      suchSatzNl("fertig", tab, liste, liste.length - 1, "windows"),
    ];
    expect(saetze[0]).toMatch(/^Dat is .+\. Zoek de Tab-toets\. Linkerpink/);
    expect(saetze[1]).toBe("Deze toets oefenen we hier niet. Zoek de Tab-toets.");
    expect(saetze[2]).toBe("Gevonden! Druk op een andere toets en daarna nog eens op de Tab-toets.");
    expect(saetze[3]).toMatch(/^Gelukt! Zoek /);
    expect(saetze[4]).toBe(`Gelukt! Alle ${liste.length} toetsen gevonden. Goed gedaan.`);
    for (const s of saetze) expect(hausregelFehler(s)).toEqual([]);
  });

  it("jede suchbare Taste auf beiden Plattformen: Auftrag niederländisch, Caps Lock mit Warnung", () => {
    for (const p of PLATTFORMEN) {
      const l = suchbareTasten(p);
      for (let i = 0; i < l.length; i++) {
        const satz = suchSatzNl("daneben", null, l, i, p);
        expect(hausregelFehler(satz), satz).toEqual([]);
        expect(satz, l[i]!.id).not.toMatch(/de toets (undefined|null)/);
        const gefunden = suchSatzNl("gefunden", l[i]!, l, i, p);
        expect(hausregelFehler(gefunden)).toEqual([]);
      }
    }
    const i = liste.indexOf(caps);
    if (i >= 0) expect(suchSatzNl("fertig", caps, liste, i, "windows")).toMatch(/Typ je nu alleen hoofdletters\?/);
  });
});

describe("Gegenprobe: die Prüfungen schlagen an", () => {
  it.each([
    ["Gedankenstrich", "gaat – verder."],
    ["Deutsch", "Drücken Sie die Taste."],
    ["Englisch", "moves the cursor."],
    ["Maus-Wort", "klik op de knop."],
  ])("%s", (erwartet, text) => {
    expect(hausregelFehler(text).join(" | ")).toContain(erwartet);
  });

  it("Form: Zahl am Satzende und Abkürzung wiederholt den Namen", () => {
    expect(formFehler({ kurz: null, name: "cijfer 2", was: [] }).join(" | ")).toContain("keine Aufgabe");
    expect(formFehler({ kurz: "Tab", name: "Tab-toets", was: ["gaat verder."] }).join(" | ")).toContain("Abkürzung");
  });
});
