/**
 * Englische Bücherei-Serien („Geschichten & Wissen“, englische Seite). Bisher gab
 * es 23 deutsche Serien und keine englische — der Modus war auf Englisch leer.
 * Dieser Test erzwingt:
 *  • Struktur (Etappenlänge, deklariertes minTier = berechnetes),
 *  • Zeichensatz + englische Großschreibung, keine Apostrophe,
 *  • Rechte-Angabe je Serie (§10),
 *  • SAUBERE SPRACHTRENNUNG: im deutschen Regal steht keine englische Serie und
 *    umgekehrt — inklusive Resume/Einweb-Pfad,
 *  • das Tier-Gate (die T2-Serie erscheint erst, wenn die Tasten reichen).
 */
import { describe, it, expect } from "vitest";
import {
  INTRO_ORDER,
  LETTER_ORDER,
  SERIEN,
  allowedForTier,
  collectHerkunft,
  computeSerieMinTier,
  firstOpenSerie,
  lockedSerien,
  serieLineCount,
  serienForStufe,
  unlockedSerien,
  validateHerkunft,
  validateSerie,
  type Stufe,
  type TypingProgress,
} from "../src/lib/typing";
import { SERIEN_EN } from "../src/lib/typing/serienEn";

const TIPPBAR = new Set(INTRO_ORDER.map((c) => c.toLowerCase()));
const ALL_KEYS = allowedForTier(5, "de");
const leer = (): TypingProgress => ({ xp: 0, lessons: {} });

describe("Englische Serien — Struktur und Form", () => {
  it("es gibt englische Pilot-Serien", () => {
    expect(SERIEN_EN.length).toBeGreaterThanOrEqual(3);
    expect(SERIEN_EN.every((s) => s.lang === "en")).toBe(true);
    expect(SERIEN_EN.some((s) => s.kind === "wissen-serie")).toBe(true);
  });

  it("jede Serie besteht die Strukturprüfung und trägt ihr echtes Tier", () => {
    for (const s of SERIEN_EN) {
      const v = validateSerie(s, "de");
      expect(v.problems, `${s.slug}: ${v.problems.join("; ")}`).toEqual([]);
      expect(computeSerieMinTier(s, "de")).toBe(s.minTier);
      expect(serieLineCount(s)).toBeGreaterThanOrEqual(48);
    }
  });

  it("nur tippbare Zeichen, Großbuchstabe am Zeilenanfang, keine Apostrophe", () => {
    for (const s of SERIEN_EN)
      for (const e of s.etappen)
        for (const l of e.lines) {
          for (const ch of l) {
            if (ch === " ") continue;
            expect(TIPPBAR.has(ch.toLowerCase()), `„${ch}“ in „${l}“`).toBe(true);
          }
          expect(l[0]).toBe(l[0].toUpperCase());
          expect(/['’"]/.test(l), `Apostroph in „${l}“`).toBe(false);
        }
  });

  it("jede Serie hat eine gültige Herkunft und taucht in „Quellen & Dank“ auf", () => {
    for (const s of SERIEN_EN) {
      expect(s.herkunft, s.slug).toBeTruthy();
      expect(validateHerkunft(s.herkunft!)).toEqual([]);
    }
    const hs = collectHerkunft();
    expect(hs.some((h) => /englisches original/i.test(h.lizenz))).toBe(true);
    // Das übernommene englische Gemeingut aus dem Korpus ist ebenfalls gelistet.
    expect(hs.some((h) => /aesop/i.test(h.quelle))).toBe(true);
    expect(hs.some((h) => /shakespeare/i.test(h.quelle))).toBe(true);
  });
});

describe("Englische Serien — Sprachtrennung der Bücherei", () => {
  it("das deutsche Regal enthält keine englische Serie", () => {
    for (const stufe of ["kids", "teens", "erwachsen"] as Stufe[]) {
      const de = serienForStufe(stufe, "de", "de"); // Vorgabe "de"
      expect(de.some((s) => s.lang === "en"), `Stufe ${stufe}`).toBe(false);
    }
  });

  it("das englische Regal enthält nur englische Serien", () => {
    for (const stufe of ["kids", "teens", "erwachsen"] as Stufe[]) {
      const en = serienForStufe(stufe, "en", "de");
      expect(en.every((s) => s.lang === "en"), `Stufe ${stufe}`).toBe(true);
    }
    expect(serienForStufe("kids", "en", "de").length).toBeGreaterThan(0);
    expect(serienForStufe("erwachsen", "en", "de").length).toBeGreaterThan(0);
  });

  it("alle deutschen Serien bleiben unverändert im deutschen Regal", () => {
    const deutsche = SERIEN.filter((s) => (s.lang ?? "de") === "de");
    // Robust gegen weitere englische Chargen (TN-E7 brachte SERIEN_EN2): nach
    // SPRACHE zählen statt gegen die Länge einer einzelnen Charge zu rechnen.
    const englische = SERIEN.filter((s) => s.lang === "en");
    // ★ E8a (26.09.2026): seit dem französischen Lehrgang gibt es eine dritte
    // Sprache im Regal - sie zählt mit, sonst misst der Test die Summe falsch.
    const franzoesische = SERIEN.filter((s) => s.lang === "fr");
    // ★ ES-S (27.09.2026): seit dem spanischen Lehrgang eine vierte Sprache -
    // dieselbe Falle (Falle 28 im LEITFADEN): eine feste Summe aus zwei/drei
    // Sprachen zählt sonst an jeder neuen Sprache falsch.
    const spanische = SERIEN.filter((s) => s.lang === "es");
    // ★ IT-S Kinder (03.10.2026): die fünfte Sprache im Regal (Falle 28, wie oben).
    const italienische = SERIEN.filter((s) => s.lang === "it");
    // ★ PL-S (09.10.2026): die sechste Sprache im Regal (Falle 28, wie oben).
    const polnische = SERIEN.filter((s) => s.lang === "pl");
    // ★ CS-S (09.10.2026): die tschechischen Serien im Regal (Falle 28, wie oben).
    const tschechische = SERIEN.filter((s) => s.lang === "cs");
    // ★ TR-S (09.10.2026): die türkischen im Regal (Falle 28, wie oben).
    const tuerkische = SERIEN.filter((s) => s.lang === "tr");
    // ★ W3 (30.10.2026): die neun Wege des Gerüsts bringen eigene Serien - nach Ausschluss zählen, nicht je Sprache eine Zeile.
    const neun = SERIEN.filter((s) => !["de", "en", "fr", "es", "it", "pl", "cs", "tr"].includes(s.lang ?? "de"));
    expect(
      neun.length +
        deutsche.length +
        englische.length +
        franzoesische.length +
        spanische.length +
        italienische.length +
        polnische.length +
        tschechische.length +
        tuerkische.length,
    ).toBe(SERIEN.length);
    expect(englische.length).toBeGreaterThanOrEqual(SERIEN_EN.length);
    expect(serienForStufe("teens", "de", "de").length).toBe(
      deutsche.filter((s) => s.stufen.includes("teens")).length,
    );
  });

  it("freigeschaltet/gesperrt trennt ebenfalls nach Sprache", () => {
    expect(unlockedSerien(ALL_KEYS, "teens", "en", "de").every((s) => s.lang === "en")).toBe(true);
    expect(lockedSerien(new Set(["a"]), "teens", "en", "de").every((s) => s.lang === "en")).toBe(true);
    expect(unlockedSerien(ALL_KEYS, "teens", "de", "de").every((s) => s.lang !== "en")).toBe(true);
  });

  it("das Einweb-Angebot bietet keine Serie der anderen Sprache an", () => {
    const gestartet: TypingProgress = {
      ...leer(),
      storyProgress: { "nell-and-the-harbour-cat": { etappe: 1, done: false } },
    };
    expect(firstOpenSerie(gestartet, ALL_KEYS, "teens", "en", "de")?.slug).toBe(
      "nell-and-the-harbour-cat",
    );
    // Auf Deutsch wird dieselbe angefangene Serie NICHT angeboten.
    expect(firstOpenSerie(gestartet, ALL_KEYS, "teens", "de", "de")).toBeUndefined();
  });
});

describe("Englische Serien — Tier-Gate", () => {
  /** Tastenstand: nur die ersten `n` Einheiten der Einführungsreihenfolge. */
  const keys = (n: number) =>
    new Set(LETTER_ORDER.slice(0, n).map((c) => c.toLowerCase()));

  it("die T2-Geschichte erscheint erst, wenn die T2-Buchstaben da sind", () => {
    const frueh = keys(13); // Grundreihe + e n i r t  → Tier 1
    expect(unlockedSerien(frueh, "teens", "en", "de").some((s) => s.minTier === 2)).toBe(false);
    const t2 = keys(21); // + h o u c g m b w → Tier 2
    expect(unlockedSerien(t2, "teens", "en", "de").some((s) => s.minTier === 2)).toBe(true);
    // Die T3-Serien bleiben dabei noch gesperrt.
    expect(lockedSerien(t2, "teens", "en", "de").some((s) => s.minTier === 3)).toBe(true);
  });

  it("mit allen Tasten ist jede englische Serie lesbar", () => {
    for (const stufe of ["kids", "teens", "erwachsen"] as Stufe[]) {
      const offen = unlockedSerien(ALL_KEYS, stufe, "en", "de");
      expect(offen.length).toBe(serienForStufe(stufe, "en", "de").length);
    }
  });
});
