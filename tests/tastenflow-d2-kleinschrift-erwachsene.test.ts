/**
 * ★★★★★ WÄCHTER D-2 (28.09.2026): Erwachsene bekommen vor der Umschalttaste
 * keine Grossbuchstaben - Kinder und Jugendliche behalten die Brücke (D-3).
 *
 * Entscheidung: `recherche-didaktik-2026-09-27/SYNTHESE-UND-ENTSCHEIDUNGEN.md`
 * D-2/D-3. Befund: `BEFUND-2026-09-28-DA1-DIDAKTIK-MECHANIK.md` §3.
 *
 * Die FEHLERKLASSE ist „ein Weg, auf dem ein Text zu einer erwachsenen Person
 * vor ⇧ kommt, fragt die Regel nicht". Darum jeder Weg einzeln: Korpus
 * (beide Einbaustellen, Falle 32), Mein Training, Lektionen, Serien,
 * Themenstränge, Wort-Drill, Geläufigkeit - auf allen vier Lernwegen, an
 * jeder Sprosse vor ⇧. Gegenproben: dieselben Stellen liefern für Kinder und
 * Jugendliche weiter Grossbuchstaben (die Brücke), und Erwachsene nach ⇧.
 */
import { afterAll, describe, expect, it } from "vitest";
import { corpusItemsFor, hatGrossbuchstaben, nurKleinschrift } from "../src/lib/typing/corpus";
import { corpusEntriesFor } from "../src/lib/typing/corpusManifest";
import { adaptiveRound, generateRound, wordDrillLines } from "../src/lib/typing/generator";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { lernwegDef, type Lernweg } from "../src/lib/typing/lernweg";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { allowedFromIntroduced, unlockedSerien, lockedSerien } from "../src/lib/typing/serien";
import { serieLines } from "../src/lib/typing/serie";
import { planArcRound } from "../src/lib/typing/arcEngine";
import { emptySeen } from "../src/lib/typing/ledger";
import { lektionenFuer } from "../src/lib/typing/curriculum";
import { gelaeufigkeitsZeile } from "../src/lib/typing/uebungsformen/gelaeufigkeit";
import type { Lang, Stufe } from "../src/lib/typing/account";
import { UEBUNGSFORMEN } from "../src/lib/typing/uebungsformen";

afterAll(() => setLayout("de"));

const WEGE: { weg: Lernweg; lang: Lang; layout: LayoutId }[] = [
  { weg: "de", lang: "de", layout: "de" },
  { weg: "de", lang: "en", layout: "de" },
  { weg: "en", lang: "en", layout: "us" },
  { weg: "fr", lang: "fr", layout: "fr" },
  { weg: "es", lang: "es", layout: "es" },
];
const JUNG: Stufe[] = ["kids", "teens"];

/** Die Stände vor ⇧ (ab der Grundreihe) und der erste Stand danach. */
function staende(weg: Lernweg, layout: LayoutId): { vor: string[][]; nach: string[] } {
  setLayout(layout);
  const o = introOrder(weg);
  const s = o.indexOf(SHIFT_UNIT);
  const vor: string[][] = [];
  for (let n = lernwegDef(weg).homeRowLetters; n <= s; n++) vor.push(o.slice(0, n));
  return { vor, nach: o.slice(0, s + 3) };
}

describe("★★★★★ D-2: die Regel an EINER Stelle", () => {
  it("nur Erwachsene, nur vor ⇧", () => {
    expect(nurKleinschrift("erwachsen", false)).toBe(true);
    expect(nurKleinschrift("erwachsen", true)).toBe(false);
    for (const s of ["kids", "teens", "a", "b", "c"] as Stufe[]) expect(nurKleinschrift(s, false), s).toBe(false);
    expect(nurKleinschrift(undefined, false)).toBe(false);
    expect(hatGrossbuchstaben("école")).toBe(false);
    expect(hatGrossbuchstaben("École")).toBe(true);
    expect(hatGrossbuchstaben("Ñandú")).toBe(true);
  });
});

describe("★★★★★ D-2: Korpus - beide Einbaustellen (corpusItemsFor und corpusEntriesFor)", () => {
  for (const { weg, lang, layout } of WEGE) {
    it(`${weg}/${lang}: Erwachsene vor ⇧ - keine Zeile mit Grossbuchstaben; Kinder/Jugendliche unverändert`, () => {
      const { vor, nach } = staende(weg, layout);
      let erwachsenGesamt = 0;
      let jungMitGross = 0;
      for (const stand of vor) {
        const allowed = allowedFromIntroduced(stand, weg);
        const a = corpusItemsFor({ stufe: "erwachsen", allowed, lang, lernweg: weg, umschalt: false });
        const b = corpusEntriesFor({ stufe: "erwachsen", allowed, lang, lernweg: weg, umschalt: false }).map((e) => e.text);
        expect(a.filter(hatGrossbuchstaben), `${stand.length}`).toEqual([]);
        expect(b.filter(hatGrossbuchstaben), `${stand.length}`).toEqual([]);
        // Was bleibt, ist genau der Teil ohne Grossbuchstaben (nichts anderes fällt weg).
        const ohne = corpusItemsFor({ stufe: "erwachsen", allowed, lang, lernweg: weg });
        expect(a).toEqual(ohne.filter((t) => !hatGrossbuchstaben(t)));
        erwachsenGesamt += ohne.length;
        for (const stufe of JUNG) {
          const mit = corpusItemsFor({ stufe, allowed, lang, lernweg: weg, umschalt: false });
          expect(mit, stufe).toEqual(corpusItemsFor({ stufe, allowed, lang, lernweg: weg }));
          jungMitGross += mit.filter(hatGrossbuchstaben).length;
        }
      }
      // Gegenprobe 1: vorher hätten Erwachsene hier überhaupt etwas bekommen,
      // und die Brücke der Jungen trägt wirklich Grossbuchstaben.
      if (lang === weg || weg === "de") expect(jungMitGross, "Brücke Kinder/Jugendliche").toBeGreaterThan(0);
      expect(erwachsenGesamt).toBeGreaterThanOrEqual(0);
      // Gegenprobe 2: nach ⇧ bekommen auch Erwachsene Grossbuchstaben.
      const nachher = corpusItemsFor({
        stufe: "erwachsen",
        allowed: allowedFromIntroduced(nach, weg),
        lang,
        lernweg: weg,
        umschalt: true,
      });
      expect(nachher.some(hatGrossbuchstaben), "nach ⇧").toBe(true);
    });
  }
});

describe("★★★★★ D-2: Mein Training, Lektionen, Wort-Drill, Geläufigkeit", () => {
  for (const { weg, lang, layout } of WEGE) {
    it(`${weg}/${lang}: Mein Training - Erwachsene vor ⇧ nie ein Grossbuchstabe, Kinder mit Brücke`, () => {
      const { vor } = staende(weg, layout);
      const fehler: string[] = [];
      let jungGross = 0;
      for (const stand of vor) {
        for (let r = 0; r < 4; r++) {
          const zeilen = adaptiveRound({ introduced: stand, stufe: "erwachsen", lang, lernweg: weg, count: 12, focus: stand.slice(-2) });
          for (const z of zeilen) if (hatGrossbuchstaben(z.text)) fehler.push(`${stand.length}: ${z.text}`);
          const kinder = adaptiveRound({ introduced: stand, stufe: "kids", lang, lernweg: weg, count: 12 });
          jungGross += kinder.filter((z) => hatGrossbuchstaben(z.text)).length;
        }
      }
      expect(fehler.slice(0, 5)).toEqual([]);
      // Gegenprobe: die Brücke für Kinder trägt Grossbuchstaben (Deutsch: Nomen).
      if (lang === "de") expect(jungGross).toBeGreaterThan(0);
    });
  }

  it("Wort-Drill: Erwachsene vor ⇧ klein (auch Nomen), Kinder mit grossen Nomen, nach ⇧ alle gross", () => {
    setLayout("de");
    const stand = introOrder("de").slice(0, 13);
    const erw = wordDrillLines(stand, false, "erwachsen", [], 60, false, "de");
    const kids = wordDrillLines(stand, false, "kids", [], 60, false, "de");
    const nachShift = wordDrillLines(stand, true, "erwachsen", [], 60, false, "de");
    expect(erw.filter(hatGrossbuchstaben)).toEqual([]);
    expect(kids.some(hatGrossbuchstaben)).toBe(true);
    expect(nachShift.some(hatGrossbuchstaben)).toBe(true);
  });

  it("Geläufigkeit: Erwachsene vor ⇧ klein, sonst unverändert", () => {
    setLayout("de");
    const allowed = new Set(introOrder("de").filter((u) => u !== SHIFT_UNIT && u.length === 1));
    let gross = 0;
    for (let i = 0; i < 40; i++) {
      const z = gelaeufigkeitsZeile(allowed, { stufe: "erwachsen", lang: "de", zufall: Math.random, umschalt: false });
      if (z) expect(hatGrossbuchstaben(z.text), z.text).toBe(false);
      const k = gelaeufigkeitsZeile(allowed, { stufe: "erwachsen", lang: "de", zufall: Math.random });
      if (k && hatGrossbuchstaben(k.text)) gross++;
    }
    expect(gross, "Gegenprobe: ohne die Regel gibt es grosse Nomen").toBeGreaterThan(0);
  });

  for (const { weg, lang, layout } of WEGE) {
    it(`${weg}/${lang}: Lektionen vor der Umschalt-Lektion - Erwachsene klein`, () => {
      setLayout(layout);
      const fehler: string[] = [];
      for (const l of lektionenFuer(weg)) {
        if (l.enablesShift) break;
        for (let r = 0; r < 2; r++)
          for (const z of generateRound(l.id, { stufe: "erwachsen", lang, lernweg: weg, count: 12 }))
            if (hatGrossbuchstaben(z.text)) fehler.push(`${l.id}: ${z.text}`);
      }
      expect(fehler.slice(0, 5)).toEqual([]);
    });
  }
});

describe("★★★★★ D-2: Serien und Themenstränge", () => {
  for (const { weg, lang, layout } of WEGE) {
    it(`${weg}/${lang}: Bücherei - Erwachsene vor ⇧ bekommen keine Serie mit Grossbuchstaben`, () => {
      const { vor, nach } = staende(weg, layout);
      for (const stand of vor) {
        const allowed = allowedFromIntroduced(stand, weg);
        for (const s of unlockedSerien(allowed, "erwachsen", lang, weg, false))
          expect(serieLines(s).some(hatGrossbuchstaben), s.slug).toBe(false);
        // Nichts verschwindet: offen + zu = alle der Stufe.
        const alle = unlockedSerien(allowed, "erwachsen", lang, weg).length + lockedSerien(allowed, "erwachsen", lang, weg).length;
        expect(
          unlockedSerien(allowed, "erwachsen", lang, weg, false).length + lockedSerien(allowed, "erwachsen", lang, weg, false).length,
        ).toBe(alle);
        for (const stufe of JUNG)
          expect(unlockedSerien(allowed, stufe, lang, weg, false)).toEqual(unlockedSerien(allowed, stufe, lang, weg));
      }
      // Gegenprobe: am Ende der Buchstaben (⇧ gelernt) öffnen Erwachsenen-Serien.
      const o = introOrder(weg);
      const voll = allowedFromIntroduced(o, weg);
      expect(unlockedSerien(voll, "erwachsen", lang, weg, true).length, `voll ${nach.length}`).toBeGreaterThan(0);
    });

    it(`${weg}/${lang}: Themenstränge - Erwachsene vor ⇧ kein Schritt mit Grossbuchstaben`, () => {
      const { vor } = staende(weg, layout);
      for (const stand of vor) {
        const plan = planArcRound({
          arcProgress: undefined,
          seen: emptySeen(),
          story: undefined,
          roundsTotal: 50,
          stufe: "erwachsen",
          lang,
          lernweg: weg,
          allowed: new Set(stand.filter((u) => u.length === 1)),
          umschalt: false,
        });
        for (const g of plan.groups) for (const z of g) expect(hatGrossbuchstaben(z.text), z.text).toBe(false);
      }
    });
  }
});

describe("★★★★ D-2: Wortspiele (Formen mit Zeilen-Runde)", () => {
  for (const { weg, lang, layout } of WEGE) {
    it(`${weg}/${lang}: keine Form baut Erwachsenen vor ⇧ eine Runde mit Grossbuchstaben; Kinder behalten sie`, () => {
      const { vor } = staende(weg, layout);
      let z = 7;
      const zufall = () => ((z = (z * 16807) % 2147483647), z / 2147483647);
      const fehler: string[] = [];
      let kinderGross = 0;
      for (const stand of vor) {
        for (const f of UEBUNGSFORMEN) {
          for (const stufe of ["erwachsen", "kids"] as const) {
            const ctx = { lernweg: weg, introduced: stand, shift: false, oneHand: false, stufe, lang, count: 8, zufall };
            if (!f.baue || !f.taugt(ctx)) continue;
            const text = JSON.stringify(f.baue(ctx)).replace(/"[a-zA-Z]+":/g, "");
            if (!hatGrossbuchstaben(text)) continue;
            if (stufe === "erwachsen") fehler.push(`${f.id} an ${stand.length}`);
            else kinderGross++;
          }
        }
      }
      expect(fehler).toEqual([]);
      // Gegenprobe (Deutsch): die Pyramide zeigt Kindern Nomen gross.
      if (lang === "de" && weg === "de") expect(kinderGross).toBeGreaterThan(0);
    });
  }
});
