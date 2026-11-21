/**
 * ★★★ ES-F2 (27.09.2026): DAS GERÜST DES SPANISCHEN LEHRGANGS.
 *
 * Bauplan: `BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md` §2/§9 ES-F2. Vorbild:
 * `tests/tastenflow-lernweg-fr-geruest.test.ts` (E2a des französischen
 * Lehrgangs) - anders als „fr" damals bekommt „es" hier noch KEINE eigene
 * Reihenfolge (die kommt erst mit ES-F4). Was hier geprüft wird - die
 * Golden-Tests für „de"/„en"/„fr" bleiben unverändert und stehen NICHT hier:
 *
 *  1. `LERNWEGE.es` existiert, ist ein bewusster ALIAS von „en" (kein
 *     stiller Rückfall auf „de").
 *  2. `bestimmeLernweg`: „es" wird NUR mit dem neuen Schalter gewählt; ohne
 *     ihn verhält sich eine spanische Bedienung wie heute (Regel „alles
 *     ausser en").
 *  3. Der Schalter `?spanisch-lehrgang=1`/`=0` und sein Gerät-Merker.
 *  4. Ohne Schalter bleibt jeder bisherige Weg (de/en/fr) Byte für Byte
 *     gleich - das Gerüst rührt nichts an, was es heute schon gibt.
 *  5. Mit dem Schalter liefert Weg „es" NIE deutschen, englischen oder
 *     französischen ÜBUNGSINHALT (Korpus, Serien, Wortspiele, Défi) - leer
 *     ist erlaubt, ein falscher Inhalt nicht (Auftrag Punkt 1, Falle 19).
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  LEHRGANG_PROBE_MERKER_ES,
  LERNWEGE,
  LERNWEGE_LISTE,
  bestimmeLernweg,
  spanischLehrgangProbeAn,
  istLernweg,
} from "../src/lib/typing/lernweg";
import { istTastenflowMerker } from "../src/lib/bedienSprache/sprache";
import { lektionenFuer } from "../src/lib/typing/curriculum";
import { WORDS_ES_EXPEDITION, stationGuessWords } from "../src/lib/typing/expedition/words";
import { corpusItemsFor, fitText } from "../src/lib/typing/corpus";
import { corpusEntriesFor } from "../src/lib/typing/corpusManifest";
import { wortquelle, korpusQuelle } from "../src/lib/typing/uebungsformen/hilfen";

beforeEach(() => localStorage.clear());

// ── 1 · LERNWEGE.es existiert und ist ein Alias von en ──────────────────────

describe("1 · LERNWEGE.es - das Gerüst (bewusster Alias von en, keine eigene Reihenfolge)", () => {
  it("ist Teil der Liste und gilt als Lernweg", () => {
    expect(LERNWEGE_LISTE).toContain("es");
    expect(istLernweg("es")).toBe(true);
    expect(istLernweg("xx")).toBe(false); // ★ G2a: „it" ist seitdem ein Lernweg
  });

  // ★ ES-F4 (27.09.2026): ÜBERHOLT durch die echte Reihenfolge - der Alias
  // war ES-F2/F3s bewusster ZWISCHENSTAND ("kein stiller Rückfall auf de"),
  // nicht das Ziel. Siehe `tests/tastenflow-lernweg-es-tastaturen.test.ts`
  // für die Prüfung der ECHTEN Fassung-A-Reihenfolge (F J zuerst, ñ als achte
  // Grundtaste, Akzent-Totaste, harte ¿?/¡!-Paare, Tastatur-Griffe).
  it("die Reihenfolge ist eine EIGENE (nicht mehr der Alias von en) - kein stiller Rückfall auf de/en", () => {
    expect(LERNWEGE.es.letterOrder).not.toEqual(LERNWEGE.en.letterOrder);
    expect(LERNWEGE.es.letterOrder).not.toEqual(LERNWEGE.de.letterOrder);
    // ñ als achte Grundtaste (Bauplan §4.3) - das eine sichere Unterscheidungsmerkmal.
    expect(LERNWEGE.es.letterOrder[7]).toBe("ñ");
  });

  it("F und J zuerst (W4 - gilt auch für den Alias-Weg)", () => {
    const erste = LERNWEGE.es.letterOrder.slice(0, LERNWEGE.es.initialLetters);
    expect(erste).toEqual(["f", "j"]);
  });
});

// ── 2 · bestimmeLernweg: es NUR mit Schalter ────────────────────────────────

describe("2 · bestimmeLernweg - es nur mit dem neuen Schalter", () => {
  it("ohne spanischen Schalter: eine spanische Bedienung verhält sich wie heute (⇒ Regel für 'alles ausser en')", () => {
    expect(
      bestimmeLernweg({ gespeichert: null, bedienSprache: "es", lehrgangProbeAn: false }),
    ).toBe("de");
    expect(
      bestimmeLernweg({ gespeichert: null, bedienSprache: "es", lehrgangProbeAn: true }),
    ).toBe("de");
    expect(
      bestimmeLernweg({
        gespeichert: null,
        bedienSprache: "es",
        lehrgangProbeAn: true,
        spanischLehrgangProbeAn: false,
      }),
    ).toBe("de");
  });

  it("mit dem spanischen Schalter an UND spanischer Bedienung: es", () => {
    expect(
      bestimmeLernweg({
        gespeichert: null,
        bedienSprache: "es",
        lehrgangProbeAn: false,
        spanischLehrgangProbeAn: true,
      }),
    ).toBe("es");
  });

  it("der spanische Schalter allein macht aus de/en/fr-Bedienung kein es", () => {
    expect(
      bestimmeLernweg({
        gespeichert: null,
        bedienSprache: "de",
        lehrgangProbeAn: true,
        spanischLehrgangProbeAn: true,
      }),
    ).toBe("de");
    expect(
      bestimmeLernweg({
        gespeichert: null,
        bedienSprache: "en",
        lehrgangProbeAn: true,
        spanischLehrgangProbeAn: true,
      }),
    ).toBe("en");
    expect(
      bestimmeLernweg({
        gespeichert: null,
        bedienSprache: "fr",
        lehrgangProbeAn: true,
        spanischLehrgangProbeAn: true,
        franzoesischLehrgangProbeAn: true,
      }),
    ).toBe("fr");
  });

  it("ein gespeicherter Weg es gewinnt immer (D2)", () => {
    expect(
      bestimmeLernweg({ gespeichert: "es", bedienSprache: "de", lehrgangProbeAn: false }),
    ).toBe("es");
  });
});

// ── 3 · Der Schalter ?spanisch-lehrgang=1/=0 ────────────────────────────────

// ★ 28.09.2026 (Freigabe fr/es): Bis zur Freigabe stand hier „default AUS".
// Seither ist der Schalter gepolt wie der englische seit E10: default AN,
// `?spanisch-lehrgang=0` ist der Not-Aus und wird auf dem Gerät gemerkt.
describe("3 · der Schalter ?spanisch-lehrgang - ★ seit 28.09.2026 default AN, =0 ist der Not-Aus", () => {
  it("★ ohne Adresse und ohne Merker: AN (Freigabe 28.09.2026)", () => {
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_ES)).toBeNull();
    expect(spanischLehrgangProbeAn("")).toBe(true);
    // Nur ein gemerktes "0" schaltet aus - jeder andere Wert heisst an.
    localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "irgendwas");
    expect(spanischLehrgangProbeAn("")).toBe(true);
    localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "0");
    expect(spanischLehrgangProbeAn("")).toBe(false);
  });

  it("=1 schaltet an und merkt es; =0 schaltet wieder aus", () => {
    expect(spanischLehrgangProbeAn("?spanisch-lehrgang=1")).toBe(true);
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_ES)).toBe("1");
    expect(spanischLehrgangProbeAn("")).toBe(true);
    expect(spanischLehrgangProbeAn("?spanisch-lehrgang=0")).toBe(false);
    expect(localStorage.getItem(LEHRGANG_PROBE_MERKER_ES)).toBe("0");
    expect(spanischLehrgangProbeAn("")).toBe(false);
  });

  // ★ 27.09.2026: die spanische Einstiegsadresse /es ist scharf - siehe
  // `tests/tastenflow-es-adresse-schaltet-lehrgang.test.ts` (Muster: /fr).
  it("★ gesperrter Speicher: kein Absturz - die Grundeinstellung (seit 28.09.2026: an) gilt einfach ungespeichert weiter", () => {
    const echt = window.localStorage;
    const kaputt = {
      getItem: () => {
        throw new Error("gesperrt");
      },
      setItem: () => {
        throw new Error("gesperrt");
      },
      removeItem: () => {
        throw new Error("gesperrt");
      },
    };
    Object.defineProperty(window, "localStorage", { value: kaputt, configurable: true });
    try {
      expect(spanischLehrgangProbeAn("")).toBe(true);
      // Der Not-Aus in der Adresse wirkt auch ohne Speicher.
      expect(spanischLehrgangProbeAn("?spanisch-lehrgang=0")).toBe(false);
    } finally {
      Object.defineProperty(window, "localStorage", { value: echt, configurable: true });
    }
  });

  it("der Merker zählt NICHT als „Gerät kennt Tastenflow“ (derselbe Grund wie bei den anderen Probe-Schaltern)", () => {
    expect(istTastenflowMerker(LEHRGANG_PROBE_MERKER_ES)).toBe(false);
  });
});

// ── 4 · Ohne Schalter bleibt jeder bisherige Weg unverändert ────────────────

describe("4 · ohne Schalter bleibt jeder bisherige Weg (de/en/fr) Byte für Byte gleich", () => {
  it("LERNWEGE.de/en/fr sind unverändert gegenüber dem Stand vor ES-F2 (Stichprobe der Kennzahlen)", () => {
    expect(LERNWEGE.de.letterOrder.slice(0, 2)).toEqual(["f", "j"]);
    expect(LERNWEGE.en.letterOrder.slice(0, 2)).toEqual(["f", "j"]);
    expect(LERNWEGE.fr.letterOrder.slice(0, 2)).toEqual(["f", "j"]);
    expect(LERNWEGE.de.letterOrder).not.toEqual(LERNWEGE.en.letterOrder);
    expect(LERNWEGE.en.letterOrder).not.toEqual(LERNWEGE.fr.letterOrder);
  });

  it("bestimmeLernweg ohne jeden Schalter verhält sich für de/en/fr wie vor ES-F2", () => {
    expect(bestimmeLernweg({ gespeichert: null, bedienSprache: "de", lehrgangProbeAn: false })).toBe(
      "de",
    );
    expect(bestimmeLernweg({ gespeichert: null, bedienSprache: "en", lehrgangProbeAn: true })).toBe(
      "en",
    );
    expect(bestimmeLernweg({ gespeichert: null, bedienSprache: "fr", lehrgangProbeAn: true })).toBe(
      "de",
    );
  });
});

// ── 5 · es liefert NIE fremden Übungsinhalt - leer ist erlaubt ──────────────

describe("5 · Weg/Übungssprache es liefert nie deutschen, englischen oder französischen Übungsinhalt (Auftrag Punkt 1, Falle 19)", () => {
  const ALLOWED = new Set("abcdefghijklmnopqrstuvwxyzñ0123456789 .,".split(""));

  // ★ ES-T1 (27.09.2026): CORPUS_ES trägt jetzt eigene Zeilen - die Regel
  // „nie fremder Inhalt" wird darum gegen CORPUS_ES geprüft statt gegen „leer".
  // ★ ES-T7-KIDS-ENDE (27.09.2026): seit es-Zeilen Satzzeichen tragen, serviert
  // `fitText` sie vor deren Sprosse OHNE die noch nicht gelernten Zeichen -
  // „eigen" heisst darum: Rohtext ODER seine servierte Fassung bei diesem Stand.
  const EIGENE = (): Set<string> =>
    new Set(korpusQuelle("es").flatMap((i) => [i.text, fitText(i.text, ALLOWED, "es") ?? i.text]));

  it("corpusItemsFor(lang: 'es') liefert nur eigene Zeilen, nicht den deutschen/englischen/französischen Korpus", () => {
    const es = corpusItemsFor({ stufe: "kids", allowed: ALLOWED, lang: "es", lernweg: "es" });
    const de = corpusItemsFor({ stufe: "kids", allowed: ALLOWED, lang: "de", lernweg: "de" });
    const en = corpusItemsFor({ stufe: "kids", allowed: ALLOWED, lang: "en", lernweg: "en" });
    expect(es.filter((t) => !EIGENE().has(t))).toEqual([]);
    expect(de.length).toBeGreaterThan(0);
    expect(en.length).toBeGreaterThan(0);
  });

  it("corpusEntriesFor(lang: 'es') liefert nur eigene Zeilen (Falle 32 - DIES ist der Weg, über den der Generator wirklich serviert)", () => {
    const es = corpusEntriesFor({ stufe: "kids", allowed: ALLOWED, lang: "es", lernweg: "es" });
    expect(es.filter((e) => !EIGENE().has(e.text))).toEqual([]);
  });

  it("korpusQuelle('es') trägt nur Zeilen mit nurWeg „es“ (CORPUS_ES seit ES-T1)", () => {
    expect(korpusQuelle("es").length).toBeGreaterThan(0);
    expect(korpusQuelle("es").filter((i) => i.nurWeg !== "es")).toEqual([]);
  });

  // ★ ES-F6 (27.09.2026): wortquelle("es") ist NICHT mehr leer - WORDS_ES
  // (wordsEs.ts) füllt sie mit echtem spanischem Wortschatz. Diese Prüfung
  // ersetzt die ES-F2-Fassung („leer ist erlaubt") - der eigentliche Zweck
  // ("nie fremden Inhalt zeigen") bleibt: die spanische Liste ist eine ANDERE
  // Menge als die deutsche/englische/französische, nicht dieselbe unter neuem
  // Namen (Falle 19).
  it("wortquelle('es') ist ECHTER spanischer Wortschatz, keine fremde Liste", () => {
    const es = wortquelle("es");
    expect(es.length).toBeGreaterThan(400);
    expect(new Set(es)).not.toEqual(new Set(wortquelle("de")));
    expect(new Set(es)).not.toEqual(new Set(wortquelle("en")));
    expect(new Set(es)).not.toEqual(new Set(wortquelle("fr")));
    for (const w of es) expect(/^[a-zñáéíóúü]+$/.test(w), w).toBe(true);
  });

  // ★ ES-S (27.09.2026): Weg „es" hat jetzt eigene Lektionen (curriculumEs.ts,
  // Wächter tests/tastenflow-lektionen-es.test.ts). Der Zweck dieser Prüfung
  // bleibt: nie die Lektionen eines anderen Weges unter spanischem Namen.
  it("lektionenFuer('es') sind eigene Lektionen, nicht die deutschen/englischen/französischen", () => {
    const es = lektionenFuer("es");
    expect(es.length).toBeGreaterThan(20);
    for (const l of es) expect(l.id.startsWith("es-"), l.id).toBe(true);
    const andere = new Set([...lektionenFuer("de"), ...lektionenFuer("en"), ...lektionenFuer("fr")].map((l) => l.id));
    expect(es.filter((l) => andere.has(l.id))).toEqual([]);
    expect(lektionenFuer("de").length).toBeGreaterThan(0);
  });

  // ★ ES-S (27.09.2026): die Expedition hat jetzt einen eigenen spanischen
  // Vorrat (WORDS_ES_EXPEDITION) - der Zweck dieser Prüfung bleibt: nie der
  // deutsche/englische Vorrat unter spanischem Namen (Falle 19).
  it("stationGuessWords (Expedition) für Weg es zieht aus dem spanischen Vorrat, nicht dem deutschen/englischen", () => {
    const alleBuchstaben = "abcdefghijklmnopqrstuvwxyzñäöüß".split("");
    const es = stationGuessWords(alleBuchstaben, { lernweg: "es", seed: 1 });
    const de = stationGuessWords(alleBuchstaben, { lernweg: "de", seed: 1 });
    expect(es.length).toBe(3);
    for (const w of es) expect(WORDS_ES_EXPEDITION).toContain(w);
    expect(es).not.toEqual(de.map((w) => w.toLowerCase()));
    expect(de.length).toBeGreaterThan(0);
  });
});
