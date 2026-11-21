/**
 * ★★★★★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.2, Anhang A):
 * DIE TASTATURMODELLE GEGEN DIE WINDOWS-TABELLEN - Wächter über die
 * FEHLERKLASSE „das Modell nennt einen Weg, den Windows nicht kennt, oder
 * kennt einen Weg nicht, den Windows hat".
 *
 * Aus den Modellen werden die Anleitungen erzeugt („garde Maj enfoncée …",
 * „active Verr. Maj …") - wo das Modell falsch ist, ist die Anleitung falsch,
 * und bis W1 war dann auch die Zeile unlösbar (Ù auf Frankreich, À/É/È auf
 * Schweiz-Französisch). Geprüft wird:
 *  A  jede Grundbeschriftung (`rows`) und jeder Griff (`access`) gegen die
 *     Windows-Tabelle derselben Taste; die Feststell-Liste gegen die
 *     Feststell-Spalte;
 *  B  jedes Zeichen, das der Weg auf dieser Tastatur SERVIERT (Korpus,
 *     Serien, bei vollem Tastenstand) und jeder Grossbuchstabe einer
 *     Buchstaben-Einheit, ist unter Windows erreichbar - oder die Tastatur
 *     führt ihn als `grossFehlt`, und dann kommt er in keiner Zeile vor;
 *  C  die Gegenprobe: absichtlich falsche Einträge (die drei alten Fehler)
 *     werden gefunden - sonst bewiese ein grüner Lauf nichts.
 */
import { afterEach, describe, expect, it } from "vitest";
import { STUFEN, type Stufe } from "../src/lib/typing/account";
import { introOrder, introducedUpTo } from "../src/lib/typing/letters";
import {
  capsUpperFuer,
  layoutById,
  setLayout,
  setzeLayoutPlattform,
  type KeyboardLayout,
  type LayoutId,
} from "../src/lib/typing/layouts";
import { tasteFuerCode } from "../src/lib/typing/anschlagDeuten";
import { grossbuchstabeWeg, kombizeichenZu } from "../src/lib/typing/totasten";
import { corpusItemsFor, fitText } from "../src/lib/typing/corpus";
import { allowedFromIntroduced, unlockedSerien } from "../src/lib/typing/serien";
import { serieLines } from "../src/lib/typing/serie";
import { adaptiveItems } from "../src/lib/typing/generator";
import { lernwegDef, type Lernweg } from "../src/lib/typing/lernweg";
import {
  KBDBE,
  KBDCA,
  KBDCAN,
  KBDFR,
  KBDLA,
  KBDSF,
  KBDSG_ABGELEITET,
  KBDSP,
  leseBelegung,
  type WindowsTaste,
} from "./fixtures/windows-belegungen";

afterEach(() => {
  setLayout("de");
  setzeLayoutPlattform(null);
});

const TABELLEN: Record<string, string> = {
  fr: KBDFR,
  be: KBDBE,
  "ch-fr": KBDSF,
  ch: KBDSG_ABGELEITET,
  "ca-csa": KBDCAN,
  "ca-fr": KBDCA,
  es: KBDSP,
  latam: KBDLA,
};

const WEG: Record<string, Lernweg> = {
  fr: "fr", be: "fr", "ch-fr": "fr", "ca-csa": "fr", "ca-fr": "fr", es: "es", latam: "es", ch: "de",
};

const tot = (zelle: string): string | null => (zelle.startsWith("DEAD:") ? zelle.slice(5) : null);

/** A: Modell gegen Windows - jede Abweichung als Satz. */
function pruefeModell(layout: KeyboardLayout, tabelle: readonly WindowsTaste[]): string[] {
  const funde: string[] = [];
  const tasteMitBeschriftung = (b: string) => tabelle.find((t) => tasteFuerCode(layout, t.code) === b);
  // Grundbeschriftung
  for (const t of tabelle) {
    const b = tasteFuerCode(layout, t.code);
    if (b === null) continue;
    const win = tot(t.ohne) ?? t.ohne;
    if (win !== b) funde.push(`${t.code}: Modell „${b}", Windows „${t.ohne}"`);
  }
  // Griffe
  for (const [zeichen, zugang] of Object.entries(layout.access)) {
    const t = tasteMitBeschriftung(zugang.base);
    if (!t) {
      funde.push(`${zeichen}: Grundtaste „${zugang.base}" gibt es unter Windows nicht`);
      continue;
    }
    const spalte = zugang.mod === "altgr" ? t.altgr : zugang.mod === "shift" ? t.umschalt : t.ohne;
    const soll = zugang.dead ? `DEAD:${zeichen}` : zeichen;
    if (spalte !== soll) {
      funde.push(`${zeichen}: Modell ${zugang.mod ?? "ohne"}${zugang.dead ? " tot" : ""} + „${zugang.base}", Windows dort „${spalte}"`);
    }
  }
  // Feststelltaste (Windows-Liste)
  for (const klein of layout.capsUpper) {
    const t = tasteMitBeschriftung(klein);
    if (!t || t.feststell !== klein.toUpperCase()) {
      funde.push(`Feststell + ${klein}: Modell „${klein.toUpperCase()}", Windows „${t?.feststell ?? "?"}"`);
    }
  }
  return funde;
}

/** Welche Vokale eine Totaste unter Windows zusammensetzt (Standard-Totastentabellen). */
const ZUSAMMEN: Record<string, RegExp> = {
  "^": /^[aeiouAEIOU]$/,
  "¨": /^[aeiouyAEIOU]$/, // Ÿ nicht: auf KBDFR gemessen „nicht tippbar" (vergleich.json)
  "`": /^[aeiouAEIOU]$/,
  "´": /^[aeiouyAEIOUY]$/,
  "~": /^[aonAON]$/,
  "¸": /^[cC]$/,
};
const MARK: Record<string, string> = {
  "^": "̂", "¨": "̈", "`": "̀", "´": "́", "~": "̃", "¸": "̧",
};

/** Alle Zeichen, die diese Windows-Belegung erzeugt - direkt oder über eine Totaste. */
function windowsZeichen(tabelle: readonly WindowsTaste[]): Set<string> {
  const out = new Set<string>();
  const totasten = new Set<string>();
  const buchstaben = new Set<string>();
  for (const t of tabelle) {
    for (const z of [t.ohne, t.umschalt, t.altgr, t.umschaltAltgr, t.feststell, t.feststellUmschalt]) {
      if (z === "·") continue;
      const d = tot(z);
      if (d) {
        totasten.add(d);
        out.add(d); // Totaste + Leertaste
      } else {
        out.add(z);
        if (/^\p{L}$/u.test(z)) buchstaben.add(z);
      }
    }
  }
  for (const d of totasten)
    for (const b of buchstaben)
      if (ZUSAMMEN[d]?.test(b)) out.add((b + MARK[d]).normalize("NFC"));
  return out;
}

describe("A  Modell gegen Windows-Tabelle (Anhang A) - jede Taste, jeder Griff", () => {
  for (const [id, text] of Object.entries(TABELLEN)) {
    it(`${id}: keine Abweichung`, () => {
      setzeLayoutPlattform("windows");
      const funde = pruefeModell(layoutById(id), leseBelegung(text));
      expect(funde, funde.join("\n")).toEqual([]);
    });
  }

  it("Mac: die Feststell-Wege bleiben dort (Schweiz Ä Ö Ü, Schweiz-Französisch É À È) - nicht neu gemessen, nur nicht verloren", () => {
    setzeLayoutPlattform("mac");
    expect(capsUpperFuer(layoutById("ch"))).toEqual(["ä", "ö", "ü"]);
    expect(capsUpperFuer(layoutById("ch-fr"))).toEqual(["é", "à", "è"]);
    setzeLayoutPlattform("windows");
    expect(capsUpperFuer(layoutById("ch"))).toEqual([]);
    expect(capsUpperFuer(layoutById("ch-fr"))).toEqual([]);
  });
});

describe("C  Gegenprobe: die drei alten Fehler würden gefunden", () => {
  it("Belgien: „|“ auf AltGr + „-“ (von Frankreich kopiert) ⇒ Fund", () => {
    const be = layoutById("be");
    const falsch: KeyboardLayout = { ...be, access: { ...be.access, "|": { base: "-", mod: "altgr" } } };
    expect(pruefeModell(falsch, leseBelegung(KBDBE)).join("\n")).toMatch(/\|: Modell altgr \+ „-"/);
  });

  it("Frankreich: „Ù“ = Umschalt + ù ⇒ Fund (Windows gibt dort „%“)", () => {
    const fr = layoutById("fr");
    const falsch: KeyboardLayout = { ...fr, access: { ...fr.access, "Ù": { base: "ù", mod: "shift" } } };
    expect(pruefeModell(falsch, leseBelegung(KBDFR)).join("\n")).toMatch(/Ù: .*Windows dort „%"/);
  });

  it("Schweiz-Französisch: „É mit der Feststelltaste“ ⇒ Fund (Windows: Feststell + é = é)", () => {
    const chfr = layoutById("ch-fr");
    const falsch: KeyboardLayout = { ...chfr, capsUpper: ["é", "à", "è"] };
    expect(pruefeModell(falsch, leseBelegung(KBDSF)).join("\n")).toMatch(/Feststell \+ é/);
  });

  it("Frankreich ohne „grossFehlt“ (É/Ç wie bis W1 nur ersetzt) ⇒ das Modell hielte É für erreichbar, Windows nicht", () => {
    setzeLayoutPlattform("windows");
    const fr = layoutById("fr");
    const falsch: KeyboardLayout = { ...fr, grossFehlt: [] };
    const win = windowsZeichen(leseBelegung(KBDFR));
    expect(win.has("É")).toBe(false);
    expect(grossbuchstabeWeg("É", falsch)).not.toBe("fehlt");
    expect(grossbuchstabeWeg("É", fr)).toBe("fehlt");
  });

  it("die Erreichbarkeit rechnet ehrlich: Ù ist auf Frankreich erreichbar (Gravis), É und Ç nicht", () => {
    const w = windowsZeichen(leseBelegung(KBDFR));
    expect(w.has("Ù")).toBe(true);
    expect(w.has("À")).toBe(true);
    expect(w.has("Ê")).toBe(true);
    expect(w.has("É")).toBe(false);
    expect(w.has("Ç")).toBe(false);
    expect(w.has("œ")).toBe(false);
  });
});

/** Was der Weg auf dieser Tastatur bei vollem Tastenstand serviert (Korpus + Serien). */
function servierteZeilen(l: LayoutId): string[] {
  setLayout(l);
  const weg = WEG[l];
  const lang = weg === "de" ? "de" : weg;
  const allowed = allowedFromIntroduced(introducedUpTo(introOrder(weg).length, weg), weg);
  const zeilen: string[] = [];
  for (const stufe of STUFEN as Stufe[]) {
    zeilen.push(...corpusItemsFor({ stufe, allowed, lang, lernweg: weg }));
    for (const s of unlockedSerien(allowed, stufe, lang, weg))
      for (const z of serieLines(s)) {
        const f = fitText(z, allowed, s.nurWeg ?? weg);
        if (f) zeilen.push(f);
      }
  }
  return zeilen;
}

describe("B  jedes servierte Zeichen ist unter Windows erreichbar - und das Modell kennt den Weg", () => {
  for (const l of Object.keys(TABELLEN) as LayoutId[]) {
    it(`${l} (Weg „${WEG[l]}")`, () => {
      setzeLayoutPlattform("windows");
      const win = windowsZeichen(leseBelegung(TABELLEN[l]));
      const zeichen = new Set<string>();
      const zeilen = servierteZeilen(l);
      for (const z of zeilen) for (const c of z) if (c !== " ") zeichen.add(c);
      // Ein Wächter, der nichts sieht, beweist nichts: tausende Zeilen, dutzende Zeichen.
      expect(zeilen.length).toBeGreaterThan(1000);
      expect(zeichen.size).toBeGreaterThan(50);
      const lay = layoutById(l);
      const tasten = new Set(lay.rows.flatMap((r) => r.keys));
      const modellKennt = (c: string) =>
        tasten.has(c) ||
        lay.access[c] !== undefined ||
        kombizeichenZu(c, lay) !== undefined ||
        grossbuchstabeWeg(c, lay) === "direkt" ||
        grossbuchstabeWeg(c, lay) === "totaste";
      const nichtWindows = [...zeichen].filter((c) => !win.has(c));
      const nichtModell = [...zeichen].filter((c) => !modellKennt(c));
      expect(nichtWindows, `${l}: serviert, aber unter Windows nicht erzeugbar`).toEqual([]);
      expect(nichtModell, `${l}: serviert, aber ohne Weg im Modell`).toEqual([]);
    }, 120_000);

    it(`${l}: jeder Grossbuchstabe einer Buchstaben-Einheit ist erreichbar - oder als „grossFehlt" geführt`, () => {
      setzeLayoutPlattform("windows");
      setLayout(l);
      const win = windowsZeichen(leseBelegung(TABELLEN[l]));
      const lay = layoutById(l);
      const buchstaben = introOrder(WEG[l]).filter((u) => /^\p{Ll}$/u.test(u));
      const falsch = buchstaben
        .map((u) => u.toUpperCase())
        .filter((g) => g !== g.toLowerCase())
        .filter((g) => (win.has(g) ? grossbuchstabeWeg(g, lay) === "fehlt" : grossbuchstabeWeg(g, lay) !== "fehlt"));
      expect(falsch, `${l}: Modell und Windows uneins über diese Grossbuchstaben`).toEqual([]);
    });
  }
});

describe("B  Grossbuchstaben mit Akzent: späte Lektion auf Weg „fr\", nie erzeugt, wo sie fehlen", () => {
  const TOTASTE_GROSS = (lay: KeyboardLayout, z: string) =>
    [...z].some((c) => grossbuchstabeWeg(c, lay) === "totaste");

  it("fr: vor ihrer Einheit kommt KEINE Zeile mit À È Ù, mit ihr schon (die Schranke ist keine Sperre)", () => {
    /*
     * ★ W2a (28.09.2026, Punkt 7): je ZEICHEN statt „erst mit der letzten
     * Einheit". À È Ù entstehen auf Windows-AZERTY über die Gravis-Totaste mit
     * AltGr + 7 - frei mit der ersten AltGr-Einheit des Weges („@"). Der
     * Wächter je Zeichen und Tastatur: `tastenflow-w2a-grossakzent-je-zeichen`.
     */
    setzeLayoutPlattform("windows");
    setLayout("fr");
    const lay = layoutById("fr");
    const voll = introOrder("fr").length;
    expect(introOrder("fr")[voll - 1]).toBe(lernwegDef("fr").grossAkzentAb);
    const at = introOrder("fr").indexOf("@") + 1;
    expect(at).toBeLessThan(voll);
    const zeilenBei = (n: number) => {
      const allowed = allowedFromIntroduced(introducedUpTo(n, "fr"), "fr");
      return (STUFEN as Stufe[]).flatMap((stufe) =>
        corpusItemsFor({ stufe, allowed, lang: "fr", lernweg: "fr" }),
      );
    };
    const GRAVIS_GROSS = (z: string) => /[ÀÈÙ]/.test(z);
    expect(zeilenBei(at - 1).filter(GRAVIS_GROSS)).toEqual([]);
    expect(zeilenBei(at).filter((z) => TOTASTE_GROSS(lay, z)).length).toBeGreaterThan(50);
  }, 120_000);

  it("fr: erzeugte Zeilen beginnen nie mit Ù/À/È/É/Ç (gemessen: „Ùk kdu\" in der ersten Zeile, viermal)", () => {
    setzeLayoutPlattform("windows");
    setLayout("fr");
    const lay = layoutById("fr");
    // Tastenstand wie nach der Einrichtung „Toutes les lettres (avec majuscules)".
    const bisUmschalt = introOrder("fr").indexOf("⇧") + 1;
    const introduced = [...introducedUpTo(introOrder("fr").indexOf("¨") + 1, "fr")];
    expect(introduced.length).toBeGreaterThan(bisUmschalt);
    for (let i = 0; i < 20; i++) {
      const zeilen = adaptiveItems({ lernweg: "fr", lang: "fr", introduced, focus: ["ù", "à", "è", "é", "ç"], count: 12 });
      for (const z of zeilen) {
        const weg = grossbuchstabeWeg(z[0], lay);
        expect(weg === "fehlt" || weg === "totaste", `erzeugt: „${z}"`).toBe(false);
      }
    }
  });
});
