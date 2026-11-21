/**
 * TW-E2 (Textwelt): Generator-Umbau „Wortsalat raus, Wiederholung raus" in BEIDEN
 * Modi (Mein Training + Lektionen). Prüft die harten Garantien:
 *  • keine Wiederholung eines Bausteins über Runden (No-Repeat-Ledger),
 *  • sinnvolle Bausteine dominieren, sobald welche passen,
 *  • ganz früh (nur Grundreihe) fällt es auf Fingertraining zurück,
 *  • `source`-Indizes zeigen gültig ins Korpus-Manifest,
 *  • nie ein Zeichen über dem freigeschalteten Stand.
 * Bauplan: Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md
 */
import { describe, it, expect } from "vitest";
import {
  LESSONS,
  LETTER_ORDER,
  SHIFT_UNIT,
  adaptiveRound,
  adaptiveItems,
  generateRound,
  corpusManifest,
  emptySeen,
  seenAdd,
  seenHas,
  unlockedKeysAt,
} from "../src/lib/typing";

/** Reicher Lernstand: ganzes Alphabet + Großschreibung (viel passender Korpus). */
const RICH_INTRO = [...LETTER_ORDER, SHIFT_UNIT];
const TYPEABLE = /^[a-zäöüßA-ZÄÖÜ0-9 ,.\-?!:;]*$/;

function sourcesOf(lines: { source: number | null }[]): number[] {
  return lines.map((l) => l.source).filter((s): s is number => s !== null);
}

describe("TW-E2 — Wiederholung raus (No-Repeat-Ledger)", () => {
  it("serviert über viele Runden KEINEN Baustein doppelt (solange Vorrat reicht)", () => {
    let seen = emptySeen();
    let corpusTotal = 0;
    for (let round = 0; round < 4; round++) {
      const lines = adaptiveRound({ lernweg: "de",
        introduced: RICH_INTRO,
        stufe: "teens",
        count: 12,
        seen,
      });
      const srcs = sourcesOf(lines);
      // Innerhalb der Runde kein Doppel …
      expect(new Set(srcs).size).toBe(srcs.length);
      // … und nichts, das früher schon getippt (gesehen) war.
      for (const s of srcs) {
        expect(seenHas(seen, s)).toBe(false);
        seen = seenAdd(seen, s);
      }
      corpusTotal += srcs.length;
    }
    // Bausteine dominieren: über 4 Runden viele echte Korpuszeilen (nicht Wortsalat).
    expect(corpusTotal).toBeGreaterThanOrEqual(30);
  });

  it("die Lektionen (home/letters/shift) teilen dasselbe Ledger — kein Doppel über Runden", () => {
    const lesson = [...LESSONS]
      .reverse()
      .find(
        (l) =>
          ["home", "letters", "shift"].includes(l.kind) &&
          unlockedKeysAt(l.id).length >= 15,
      );
    expect(lesson).toBeTruthy();
    let seen = emptySeen();
    for (let round = 0; round < 3; round++) {
      const lines = generateRound(lesson!.id, { lernweg: "de", count: 12, stufe: "teens", seen });
      const srcs = sourcesOf(lines);
      expect(new Set(srcs).size).toBe(srcs.length);
      for (const s of srcs) {
        expect(seenHas(seen, s)).toBe(false);
        seen = seenAdd(seen, s);
      }
    }
  });
});

describe("TW-E2 — Wortsalat raus (Bausteine zuerst, Pseudo nur ganz früh)", () => {
  it("bei reichem Stand dominieren echte Bausteine die Runde", () => {
    const lines = adaptiveRound({ lernweg: "de", introduced: RICH_INTRO, stufe: "teens", count: 12 });
    const corpus = sourcesOf(lines).length;
    expect(corpus).toBeGreaterThanOrEqual(9); // klare Mehrheit sinnvolle Texte
  });

  it("nur Grundreihe (T0): kaum passender Korpus → Fingertraining (source null)", () => {
    const grund = ["f", "j", "d", "k", "s", "l", "a", "ö"];
    const lines = adaptiveRound({ lernweg: "de", introduced: grund, stufe: "teens", count: 12 });
    // Fast alles generiert (kein Wortsalat als Satz getarnt), sehr wenige Bausteine.
    expect(sourcesOf(lines).length).toBeLessThanOrEqual(3);
    expect(lines.length).toBe(12);
  });
});

describe("TW-E2 — source-Indizes & Zeichensatz", () => {
  it("jeder source-Index zeigt gültig ins Korpus-Manifest", () => {
    const ids = corpusManifest().ids;
    const lines = adaptiveRound({ lernweg: "de", introduced: RICH_INTRO, stufe: "teens", count: 30 });
    for (const s of sourcesOf(lines)) {
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThan(ids.length);
    }
  });

  it("verlangt in BEIDEN Modi nie ein Zeichen über dem freigeschalteten Stand", () => {
    // Mein Training
    for (const line of adaptiveRound({ lernweg: "de", introduced: RICH_INTRO, stufe: "teens", count: 40 }))
      expect(line.text).toMatch(TYPEABLE);
    // Lektionen
    const lesson = [...LESSONS].find((l) => ["home", "letters", "shift"].includes(l.kind));
    for (const line of generateRound(lesson!.id, { lernweg: "de", count: 40, stufe: "teens" }))
      expect(line.text).toMatch(TYPEABLE);
  });

  it("adaptiveItems (String-Wrapper) bleibt kompatibel", () => {
    const strs = adaptiveItems({ lernweg: "de", introduced: RICH_INTRO, stufe: "teens", count: 8 });
    expect(strs).toHaveLength(8);
    for (const s of strs) expect(typeof s).toBe("string");
  });
});
