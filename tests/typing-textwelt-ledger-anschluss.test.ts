/**
 * Prüfbericht 27.07. (Teil 0, Punkte 1+2) — zwei Lücken im No-Repeat-Ledger:
 *
 *  A) TEXT-LEKTIONEN ans Ledger angeschlossen: die 6 klassischen Text-Lektionen
 *     (kind "text") liefern jetzt `source`-Indizes (Manifest), meiden Gesehenes
 *     (ungesehen zuerst, Eimer-Reset) und wiederholen nie innerhalb der Runde.
 *
 *  B) PRÄFIX-VALIDIERUNG statt Komplettreset: `manifestVersion` + neues
 *     `seenManifestCount` erlauben, nach einem reinen Anhänge-Deploy das
 *     `seenBausteine`-Bitset zu BEHALTEN (Indizes stabil) — nur ein echter
 *     Bruch (Inhalt geändert/umsortiert) setzt zurück.
 *
 * Bauplan: Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md §3.3.
 */
import { describe, expect, it } from "vitest";
import {
  LESSONS,
  buildManifest,
  corpusEntriesFor,
  corpusManifest,
  corpusManifestCount,
  corpusManifestVersion,
  emptySeen,
  generateItems,
  generateRound,
  manifestPrefixVersion,
  seenAdd,
  seenHas,
  seenLedgerValid,
  unlockedKeysAt,
  type Lesson,
  type ManifestEntry,
} from "../src/lib/typing";
import {
  emptyProgress,
  loadProgress,
  saveProgress,
  type TypingProgress,
} from "../src/lib/typing/progress";

const TEXT_LESSONS: Lesson[] = LESSONS.filter((l) => l.kind === "text");

function sourcesOf(lines: { source: number | null }[]): number[] {
  return lines.map((l) => l.source).filter((s): s is number => s !== null);
}

/** Der Korpus-Pool, aus dem eine Text-Lektion schöpft (gleiche Query wie der Generator). */
function poolFor(lesson: Lesson, stufe: "kids" | "teens" | "erwachsen" = "teens") {
  return corpusEntriesFor({ lernweg: "de",
    stufe,
    allowed: new Set(unlockedKeysAt(lesson.id)),
    kinds: lesson.corpusKinds,
  });
}

describe("A — Text-Lektionen am No-Repeat-Ledger", () => {
  it("alle 6 Text-Lektionen liefern gültige source-Indizes (kein source:null-Blindflug mehr)", () => {
    expect(TEXT_LESSONS.length).toBe(6);
    const ids = corpusManifest().ids;
    for (const lesson of TEXT_LESSONS) {
      const lines = generateRound(lesson.id, { lernweg: "de", count: 12, stufe: "teens" });
      expect(lines.length).toBe(12);
      const srcs = sourcesOf(lines);
      // Der Pool ist auf Stufe b überall groß genug — die Runde besteht aus
      // echten Bausteinen, nicht aus Notfall-Füllung.
      expect(srcs.length).toBe(12);
      for (const s of srcs) {
        expect(s).toBeGreaterThanOrEqual(0);
        expect(s).toBeLessThan(ids.length);
      }
    }
  });

  it("source-Indizes stammen aus dem Pool der Lektions-Sorten (z. B. nur Witze)", () => {
    const witze = LESSONS.find((l) => l.id === "text-witze")!;
    const poolIdx = new Set(poolFor(witze).map((e) => e.index));
    const lines = generateRound(witze.id, { lernweg: "de", count: 12, stufe: "teens" });
    for (const s of sourcesOf(lines)) expect(poolIdx.has(s)).toBe(true);
  });

  it("kein Baustein doppelt — weder innerhalb der Runde noch über Runden (solange Vorrat reicht)", () => {
    let seen = emptySeen();
    for (let round = 0; round < 4; round++) {
      const lines = generateRound("text-saetze", { lernweg: "de", count: 12, stufe: "teens", seen });
      const srcs = sourcesOf(lines);
      expect(new Set(srcs).size).toBe(srcs.length);
      for (const s of srcs) {
        expect(seenHas(seen, s)).toBe(false);
        seen = seenAdd(seen, s);
      }
    }
  });

  it("Eimer-Reset: ist ALLES gesehen, kommen Bausteine wieder (mit source) statt Füllzeilen", () => {
    const lesson = LESSONS.find((l) => l.id === "text-saetze")!;
    let seen = emptySeen();
    for (const e of poolFor(lesson)) seen = seenAdd(seen, e.index);
    const lines = generateRound(lesson.id, { lernweg: "de", count: 12, stufe: "teens", seen });
    const srcs = sourcesOf(lines);
    expect(srcs.length).toBe(12); // immer noch Sinn statt Wortsalat …
    expect(new Set(srcs).size).toBe(12); // … und trotzdem kein Doppel in der Runde
  });

  it("ungesehen vor gesehen: sind noch genau 12 Bausteine frisch, besteht die Runde aus genau denen", () => {
    const lesson = LESSONS.find((l) => l.id === "text-saetze")!;
    const pool = poolFor(lesson);
    expect(pool.length).toBeGreaterThan(24);
    const fresh = new Set(pool.slice(0, 12).map((e) => e.index));
    let seen = emptySeen();
    for (const e of pool) if (!fresh.has(e.index)) seen = seenAdd(seen, e.index);
    const srcs = sourcesOf(generateRound(lesson.id, { lernweg: "de", count: 12, stufe: "teens", seen }));
    expect(srcs.length).toBe(12);
    for (const s of srcs) expect(fresh.has(s)).toBe(true);
  });

  it("generateItems (String-Wrapper) bleibt für Text-Lektionen kompatibel", () => {
    for (const lesson of TEXT_LESSONS) {
      const items = generateItems(lesson.id, { lernweg: "de", count: 12, stufe: "kids" });
      expect(items.length).toBe(12);
      for (const s of items) expect(typeof s).toBe("string");
    }
  });
});

describe("B — Präfix-Validierung (buildManifest/manifestPrefixVersion)", () => {
  const A: ManifestEntry[] = [
    { kind: "satz", text: "Der Hund bellt laut." },
    { kind: "witz", text: "Warum lacht der Keks? Weil er krümelt!" },
    { kind: "fakt", text: "Eine Biene hat sechs Beine." },
  ];
  const B: ManifestEntry[] = [
    { kind: "satz", text: "Die Katze schläft gern." },
    { kind: "wissen", text: "Der Mond umkreist die Erde." },
  ];

  it("Invariante: Präfix über ALLE IDs == version (synthetisch UND echtes Korpus-Manifest)", () => {
    const m = buildManifest(A);
    expect(manifestPrefixVersion(m, m.ids.length)).toBe(m.version);
    const real = corpusManifest();
    expect(manifestPrefixVersion(real, real.ids.length)).toBe(real.version);
    expect(corpusManifestCount()).toBe(real.ids.length);
  });

  it("reines Anhängen: alte Version == Präfix-Hash des neuen Manifests, Indizes stabil", () => {
    const m1 = buildManifest(A);
    const m2 = buildManifest([...A, ...B]);
    expect(m2.version).not.toBe(m1.version);
    expect(manifestPrefixVersion(m2, m1.ids.length)).toBe(m1.version);
    // Append-only: jede alte ID behält ihren Index.
    m1.ids.forEach((id, i) => expect(m2.indexOf.get(id)).toBe(i));
  });

  it("echter Bruch (Inhalt vorn geändert): Präfix-Hash passt NICHT mehr", () => {
    const m1 = buildManifest(A);
    const changed = buildManifest([
      { kind: "satz", text: "Der Hund bellt leise." }, // geänderter erster Baustein
      ...A.slice(1),
      ...B,
    ]);
    expect(manifestPrefixVersion(changed, m1.ids.length)).not.toBe(m1.version);
  });

  it("unbrauchbare counts liefern undefined", () => {
    const m = buildManifest(A);
    expect(manifestPrefixVersion(m, -1)).toBeUndefined();
    expect(manifestPrefixVersion(m, m.ids.length + 1)).toBeUndefined();
    expect(manifestPrefixVersion(m, 1.5)).toBeUndefined();
  });
});

describe("B — seenLedgerValid (Behalten vs. Zurücksetzen)", () => {
  it("aktuelle Version gilt immer (mit und ohne count)", () => {
    const v = corpusManifestVersion();
    expect(seenLedgerValid(v, corpusManifestCount())).toBe(true);
    expect(seenLedgerValid(v, undefined)).toBe(true);
  });

  it("simulierter Append-Deploy: Stand von VOR dem Anhängen bleibt gültig", () => {
    // Ein Kind hat gespeichert, als das Manifest 5 IDs kürzer war — genau die
    // Situation nach einem reinen Nachlege-Deploy (21.07./25.07.).
    const m = corpusManifest();
    const oldCount = m.ids.length - 5;
    const oldVersion = manifestPrefixVersion(m, oldCount)!;
    expect(oldVersion).not.toBe(m.version);
    expect(seenLedgerValid(oldVersion, oldCount)).toBe(true);
  });

  it("Altstand ohne count: fremde Version ⇒ Reset wie bisher (rückwärtskompatibel)", () => {
    const m = corpusManifest();
    const oldVersion = manifestPrefixVersion(m, m.ids.length - 5)!;
    expect(seenLedgerValid(oldVersion, undefined)).toBe(false);
  });

  it("echter Bruch oder fehlende Version ⇒ Reset", () => {
    expect(seenLedgerValid(undefined, corpusManifestCount())).toBe(false);
    expect(seenLedgerValid(corpusManifestVersion() ^ 0xdead, 42)).toBe(false);
    // count passt nicht zur Version ⇒ ebenfalls Reset.
    expect(seenLedgerValid(corpusManifestVersion() ^ 1, corpusManifestCount())).toBe(false);
  });
});

describe("B — TypingProgress.seenManifestCount (additiv, Roundtrip)", () => {
  const STORAGE_KEY = "tippen-trainer:v1";

  it("Roundtrip: speichern und laden erhält das neue Feld", () => {
    const p: TypingProgress = {
      ...emptyProgress(),
      seenBausteine: "qrs",
      manifestVersion: 1234,
      seenManifestCount: 567,
    };
    saveProgress(p);
    const loaded = loadProgress();
    expect(loaded.seenBausteine).toBe("qrs");
    expect(loaded.manifestVersion).toBe(1234);
    expect(loaded.seenManifestCount).toBe(567);
  });

  it("Altstand ohne das Feld lädt fehlerfrei, Feld bleibt undefined", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ xp: 7, lessons: {}, seenBausteine: "ab", manifestVersion: 9 }),
    );
    const loaded = loadProgress();
    expect(loaded.seenManifestCount).toBeUndefined();
    expect(loaded.seenBausteine).toBe("ab");
    expect(loaded.manifestVersion).toBe(9);
  });
});
