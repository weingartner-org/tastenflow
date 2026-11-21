/**
 * ★★★ K-KORPUS-NEUN (29.10.2026): die Regeln für den Korpus (Charge 1) der neun Gerüst-Wege - EINMAL für alle neun.
 *
 * Vorbild: die cs/pl-Wächter (`tastenflow-texte-cs-*`, `tastenflow-texte-pl-*`) und `tests/helfer/lerndatenNeueWege.ts`. Je Weg ruft
 * `tests/tastenflow-texte-<xx>-charge1.test.ts` {@link pruefeKorpusCharge1} mit seinen Dateien, der Bezugstastatur, den GEMESSENEN
 * Anzahlen und den benannten Zeichen ohne Taste je Tastatur. Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`.
 *
 * Was geprüft wird (jede Regel ist eine Funktion, die Fehler als Liste zurückgibt - die Gegenproben bauen einen Fehler und
 * verlangen, dass er gefunden wird):
 *  1. Form: `kind: "satz"`, `nurWeg` = Weg, genau die Stufe der Datei, ein `topic`, kein `herkunft` (selbst verfasst), kein `id`.
 *  2. Hausregeln: kein Gedankenstrich (U+2013, U+2014), keine Ellipse (U+2026), kein U+00A0, keine doppelten oder Rand-Leerzeichen.
 *  3. Tippbar mit der EIGENEN Folge des Weges (`introOrder(weg)`) auf der Bezugstastatur: es gibt eine Sprosse, an der `fitText`
 *     die Zeile UNGEKÜRZT liefert, und `minTier` = `minTierFor(text, weg)`.
 *  4. Die anderen Tastaturen der Sprache: was dort nicht ganz tippbar ist, enthält ein benanntes Zeichen ohne Taste - sonst nichts.
 *  5. Keine Doppelten, kein Schlüssel für zwei Texte (Weg-Schlüssel `bausteinKey(kind, text, weg)`), keine ID-Kollision mit einer
 *     Zeile einer anderen Sprache.
 *  6. Anker und Weiche: jede ID steht im Anker; `korpusFuer(weg)` gibt den eigenen Korpus (nicht mehr den englischen), und
 *     `corpusEntriesFor` serviert am Ende der Folge in jeder Stufe Zeilen - nur eigene.
 */
import { afterEach, describe, expect, it } from "vitest";
import type { Lang, Stufe } from "../../src/lib/typing/account";
import { fitText, korpusFuer, type CorpusItem } from "../../src/lib/typing/corpus";
import { corpusEntriesFor } from "../../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../../src/lib/typing/corpusAnker";
import { setLayout, TASTATUREN_DER_SPRACHE, type LayoutId } from "../../src/lib/typing/layouts";
import { introOrder } from "../../src/lib/typing/letters";
import { bausteinId, bausteinKey } from "../../src/lib/typing/ledger";
import type { Lernweg } from "../../src/lib/typing/lernweg";
import { allowedFromIntroduced } from "../../src/lib/typing/serien";
import { minTierFor } from "../../src/lib/typing/tiers";
import { ALLE_SPRACHEN } from "../../src/lib/typing/sprachRegister";

type StufeDerCharge = "kids" | "teens" | "erwachsen";

export interface KorpusCharge1 {
  weg: Lernweg & Lang;
  name: string;
  /** Die drei Dateien der Charge, je Stufe. */
  dateien: Readonly<Record<StufeDerCharge, readonly CorpusItem[]>>;
  /** `CORPUS_<XX>` aus `corpus<Xx>.ts` (die rohe Sammelliste). */
  roh: readonly CorpusItem[];
  /** Die Tastatur, auf der `minTier` gerechnet ist. */
  bezug: LayoutId;
  /** GEMESSEN beim Einhängen (29.10.2026): Zeilen je Stufe. */
  anzahl: Readonly<Record<StufeDerCharge, number>>;
  /** Je Tastatur der Sprache: die Zeichen, die dort keine Taste haben (Wächter der Reihenfolge, `FAELLT_WEG`). */
  ohneTaste: Readonly<Partial<Record<LayoutId, readonly string[]>>>;
  /** GEMESSEN: wie viele Zeilen je Tastatur deshalb nicht ganz tippbar sind. */
  nichtGanzTippbar: Readonly<Partial<Record<LayoutId, number>>>;
}

const norm = (t: string) => t.replace(/\s+/g, " ").trim();

function voll(weg: Lernweg, layout: LayoutId): Set<string> {
  setLayout(layout);
  return allowedFromIntroduced(introOrder(weg), weg);
}

/** Kleinste Sprosse, an der die Zeile ungekürzt erscheint (null = nie). */
export function volleSprosse(text: string, weg: Lernweg, layout: LayoutId): number | null {
  setLayout(layout);
  const o = introOrder(weg);
  for (let n = 1; n <= o.length; n++) {
    const erlaubt = allowedFromIntroduced(o.slice(0, n), weg);
    setLayout(layout);
    if (fitText(text, erlaubt, weg) === norm(text)) return n;
  }
  return null;
}

export function formFehler(zeilen: readonly CorpusItem[], weg: Lernweg, stufe: StufeDerCharge): string[] {
  const f: string[] = [];
  for (const z of zeilen) {
    if (z.kind !== "satz") f.push(`kind ${z.kind}: ${z.text}`);
    if (z.nurWeg !== weg) f.push(`nurWeg ${z.nurWeg}: ${z.text}`);
    if (z.stufen.length !== 1 || z.stufen[0] !== stufe) f.push(`stufen ${z.stufen.join(",")}: ${z.text}`);
    if (!z.topic) f.push(`ohne topic: ${z.text}`);
    if (z.herkunft) f.push(`herkunft bei selbst verfasstem Text: ${z.text}`);
    if (z.id) f.push(`id gesetzt: ${z.text}`);
    if (typeof z.minTier !== "number") f.push(`ohne minTier: ${z.text}`);
  }
  return f;
}

export function hausregelFehler(zeilen: readonly CorpusItem[]): string[] {
  const f: string[] = [];
  for (const z of zeilen) {
    if (/[\u2013\u2014]/.test(z.text)) f.push(`Gedankenstrich: ${z.text}`);
    if (/\u2026/.test(z.text)) f.push(`Ellipse: ${z.text}`);
    if (/\u00a0/.test(z.text)) f.push(`U+00A0: ${z.text}`);
    if (z.text !== norm(z.text)) f.push(`Leerzeichen: ${JSON.stringify(z.text)}`);
  }
  return f;
}

export function tippFehler(zeilen: readonly CorpusItem[], weg: Lernweg, bezug: LayoutId): string[] {
  const f: string[] = [];
  const alle = voll(weg, bezug);
  for (const z of zeilen) {
    setLayout(bezug);
    if (fitText(z.text, alle, weg) !== norm(z.text)) {
      f.push(`nicht tippbar auf ${bezug}: ${z.text}`);
      continue;
    }
    setLayout(bezug);
    const t = minTierFor(z.text, weg);
    if (t !== z.minTier) f.push(`minTier ${z.minTier}, gerechnet ${t}: ${z.text}`);
  }
  return f;
}

/** Zeilen, die auf `layout` am Ende der Folge nicht ganz tippbar sind. */
export function nichtGanz(zeilen: readonly CorpusItem[], weg: Lernweg, layout: LayoutId): CorpusItem[] {
  const alle = voll(weg, layout);
  return zeilen.filter((z) => {
    setLayout(layout);
    return fitText(z.text, alle, weg) !== norm(z.text);
  });
}

export function pruefeKorpusCharge1(k: KorpusCharge1): void {
  const { weg } = k;
  const stufen = ["kids", "teens", "erwachsen"] as const;
  const alle = stufen.flatMap((s) => k.dateien[s]);

  afterEach(() => setLayout("de"));

  describe(`K-${weg.toUpperCase()}: Korpus Charge 1 des Weges „${weg}" (${k.name})`, () => {
    it("die Sammelliste ist genau die Charge: Kinder, Jugendliche, Erwachsene - in dieser Reihenfolge", () => {
      expect(k.roh.length).toBe(alle.length);
      k.roh.forEach((z, i) => expect(z, `Platz ${i}`).toBe(alle[i]));
    });

    it.each(stufen)("Anzahl %s wie gemessen", (s) => {
      expect(k.dateien[s].length).toBe(k.anzahl[s]);
    });

    it.each(stufen)("Form %s: satz, nurWeg, Stufe, topic, minTier, ohne herkunft/id", (s) => {
      const f = formFehler(k.dateien[s], weg, s);
      expect(f, f.slice(0, 10).join("\n")).toEqual([]);
    });

    it("Hausregeln: kein Gedankenstrich, keine Ellipse, kein U+00A0, saubere Leerzeichen", () => {
      const f = hausregelFehler(alle);
      expect(f, f.slice(0, 10).join("\n")).toEqual([]);
    });

    it(`jede Zeile ist mit der eigenen Folge auf ${k.bezug} ganz tippbar, minTier = minTierFor(text, "${weg}")`, () => {
      const f = tippFehler(alle, weg, k.bezug);
      expect(f, f.slice(0, 10).join("\n")).toEqual([]);
    });

    it("jede Zeile hat eine Sprosse, ab der sie ungekürzt kommt (Stichprobe: jede zehnte Zeile)", () => {
      const ohne = alle.filter((_, i) => i % 10 === 0).filter((z) => volleSprosse(z.text, weg, k.bezug) === null);
      expect(ohne.map((z) => z.text)).toEqual([]);
    });

    it("die anderen Tastaturen: nicht ganz tippbar NUR wegen eines benannten Zeichens ohne Taste, Anzahl wie gemessen", () => {
      const tastaturen = [...TASTATUREN_DER_SPRACHE[weg]];
      expect(tastaturen).toContain(k.bezug);
      for (const l of tastaturen) {
        const fehlt = k.ohneTaste[l] ?? [];
        const nicht = nichtGanz(alle, weg, l);
        const unerklaert = nicht.filter((z) => !fehlt.some((c) => z.text.includes(c)));
        expect(unerklaert.map((z) => z.text), l).toEqual([]);
        expect(nicht.length, l).toBe(k.nichtGanzTippbar[l] ?? 0);
      }
    });

    it("keine Doppelten, kein Weg-Schlüssel für zwei Texte", () => {
      const texte = alle.map((z) => z.text);
      expect(new Set(texte).size).toBe(texte.length);
      const schluessel = new Map<string, string>();
      const doppelt: string[] = [];
      for (const z of alle) {
        const s = bausteinKey(z.kind, z.text, weg);
        if (schluessel.has(s) && schluessel.get(s) !== z.text) doppelt.push(`${schluessel.get(s)} | ${z.text}`);
        schluessel.set(s, z.text);
      }
      expect(doppelt).toEqual([]);
    });

    it("keine ID-Kollision mit einer Zeile einer anderen Sprache", () => {
      const eigene = new Map(alle.map((z) => [bausteinId(z.kind, z.text, weg), z.text]));
      const kollision: string[] = [];
      for (const s of ALLE_SPRACHEN) {
        if (s === weg) continue;
        for (const z of korpusFuer(s)) {
          const id = bausteinId(z.kind, z.text, z.nurWeg);
          if (eigene.has(id) && eigene.get(id) !== z.text) kollision.push(`${s}: ${z.text} | ${eigene.get(id)}`);
        }
      }
      expect(kollision).toEqual([]);
    });

    it("jede Zeile steht im Anker (sonst würde sie nie serviert)", () => {
      const anker = new Set(KORPUS_ANKER);
      const fehlt = alle.filter((z) => !anker.has(bausteinId(z.kind, z.text, weg))).map((z) => z.text);
      expect(fehlt).toEqual([]);
    });

    it(`korpusFuer("${weg}") gibt den eigenen Korpus (nicht den englischen), jede Zeile mit nurWeg`, () => {
      const k2 = korpusFuer(weg);
      expect(k2.length).toBe(alle.length);
      expect(k2.every((z) => z.nurWeg === weg)).toBe(true);
    });

    it.each(stufen)("am Ende der Folge serviert corpusEntriesFor in Stufe %s eigene Zeilen", (s) => {
      const erlaubt = voll(weg, k.bezug);
      setLayout(k.bezug);
      const e = corpusEntriesFor({ stufe: s as Stufe, allowed: erlaubt, lang: weg, lernweg: weg });
      expect(e.length).toBeGreaterThan(k.anzahl[s] / 2);
      const eigene = new Set(alle.map((z) => norm(z.text)));
      expect(e.filter((x) => !eigene.has(norm(x.text))).map((x) => x.text)).toEqual([]);
    });

    describe("Gegenproben: der Prüfer findet einen gebauten Fehler", () => {
      const muster = alle[0];
      it("Form: falscher Weg, falsche Stufe, herkunft", () => {
        expect(formFehler([{ ...muster, nurWeg: "en" }], weg, muster.stufen[0] as StufeDerCharge).length).toBe(1);
        expect(formFehler([muster], weg, muster.stufen[0] === "kids" ? "teens" : "kids").length).toBe(1);
        expect(formFehler([{ ...muster, herkunft: { quelle: "x", lizenz: "y" } }], weg, muster.stufen[0] as StufeDerCharge).length).toBe(1);
      });
      it("Hausregeln: Gedankenstrich und Ellipse", () => {
        expect(hausregelFehler([{ ...muster, text: `${muster.text} \u2013 ja` }]).length).toBe(1);
        expect(hausregelFehler([{ ...muster, text: `${muster.text}\u2026` }]).length).toBe(1);
      });
      it("Tippbarkeit: falscher minTier und ein Zeichen ohne Taste", () => {
        const falsch = ((muster.minTier ?? 0) + 1) % 6;
        expect(tippFehler([{ ...muster, minTier: falsch as CorpusItem["minTier"] }], weg, k.bezug).length).toBe(1);
        expect(tippFehler([{ ...muster, text: `${muster.text} ¤` }], weg, k.bezug).length).toBe(1);
      });
    });
  });
}
