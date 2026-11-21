/**
 * TW-E1 (Textwelt-Umbau, Fundament): Tests für Tier-Berechnung, No-Repeat-Ledger
 * (Bitset + Manifest + Story-Fortschritt) und das Serie-Datenmodell.
 * Bauplan: Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md
 */
import { describe, it, expect } from "vitest";
import {
  // tiers
  TIER_CHARS,
  TIERS,
  MAX_TIER,
  allowedForTier,
  tierOfChar,
  minTierFor,
  tierUnlocked,
  // ledger — bitset
  emptySeen,
  seenHas,
  seenAdd,
  seenCount,
  encodeSeen,
  decodeSeen,
  // ledger — manifest
  bausteinKey,
  bausteinId,
  fnv1a,
  buildManifest,
  pickUnseen,
  // ledger — story
  storyStateFor,
  advanceStory,
  isStoryDone,
  resetStory,
  // serie
  serieEtappeCount,
  serieLineCount,
  serieLines,
  computeSerieMinTier,
  validateSerie,
  type Serie,
} from "../src/lib/typing";

/** Deterministische Zufallsquelle für reproduzierbare Auswahl-Tests. */
function seq(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

describe("Tiers — Zeichensätze", () => {
  it("bilden die kumulativen Größen des Bauplans ab (8 / 13 / 21 / 30)", () => {
    expect(TIER_CHARS[0].length).toBe(8); // Grundreihe
    expect(allowedForTier(0, "de").size).toBe(8);
    expect(allowedForTier(1, "de").size).toBe(13); // vor der Umschalttaste
    expect(allowedForTier(2, "de").size).toBe(21); // Erstleser
    expect(allowedForTier(3, "de").size).toBe(30); // ganzes Alphabet
  });

  it("enthalten genau die im Bauplan genannten neuen Zeichen je Stufe", () => {
    expect([...TIER_CHARS[0]]).toEqual(["f", "j", "d", "k", "s", "l", "a", "ö"]);
    expect([...TIER_CHARS[1]]).toEqual(["e", "n", "i", "r", "t"]);
    // Charge O1 (21.08.2026): das `o` steht jetzt vor dem `u` — dieselbe
    // MENGE wie vorher (`h u c g m o b w`), nur eine andere Reihenfolge.
    // Genau darum hat der Umbau kein einziges `minTier` bewegt.
    expect([...TIER_CHARS[2]]).toEqual(["h", "o", "u", "c", "g", "m", "b", "w"]);
    expect([...TIER_CHARS[3]]).toEqual(["z", "v", "p", "ä", "ü", "x", "y", "q", "ß"]);
    expect([...TIER_CHARS[4]]).toEqual([".", ",", "-", "?", "!", ":", ";"]);
    expect(TIER_CHARS[5]).toContain("1");
    expect(TIER_CHARS[5]).toContain("@");
  });

  it("die Umschalt-Einheit ist bewusst KEIN Tier-Zeichen (Auto-Großschreibung)", () => {
    for (const t of TIERS) expect([...TIER_CHARS[t]]).not.toContain("⇧");
  });
});

describe("Tiers — tierOfChar", () => {
  it("ordnet repräsentative Zeichen der richtigen Stufe zu", () => {
    expect(tierOfChar("f", "de")).toBe(0);
    expect(tierOfChar("ö", "de")).toBe(0);
    expect(tierOfChar("e", "de")).toBe(1);
    expect(tierOfChar("t", "de")).toBe(1);
    expect(tierOfChar("h", "de")).toBe(2);
    expect(tierOfChar("w", "de")).toBe(2);
    expect(tierOfChar("z", "de")).toBe(3);
    expect(tierOfChar("ä", "de")).toBe(3);
    expect(tierOfChar("ß", "de")).toBe(3);
    expect(tierOfChar(".", "de")).toBe(4);
    expect(tierOfChar("1", "de")).toBe(5);
    expect(tierOfChar("@", "de")).toBe(5);
  });

  it("schlägt Großbuchstaben kleingeschrieben nach, Leerzeichen ist frei", () => {
    expect(tierOfChar("H", "de")).toBe(2);
    expect(tierOfChar(" ", "de")).toBeNull();
  });
});

describe("Tiers — minTierFor (operational über fitsKeys)", () => {
  it("nur Grundreihe ⇒ T0", () => {
    expect(minTierFor("as fad", "de")).toBe(0);
  });

  it("erster echter Satz mit T1-Wortschatz ⇒ T1 (Punkt wird weggelassen)", () => {
    expect(minTierFor("Der Elefant ist stark.", "de")).toBe(1);
  });

  it("Erstleser-Wortschatz ⇒ T2", () => {
    expect(minTierFor("Der Hund ist braun.", "de")).toBe(2);
  });

  it("Umlaut/seltene Buchstaben ⇒ T3", () => {
    expect(minTierFor("Die Zähne", "de")).toBe(3);
  });

  it("Satzzeichen GATEN NICHT — sie werden weggelassen (früh sinnvoll)", () => {
    // 'Hallo, Welt!' hängt nur an seinen Buchstaben (o,w,h ⇒ T2); Komma+! fallen weg.
    expect(minTierFor("Hallo, Welt!", "de")).toBe(2);
  });

  it("Ziffern GATEN (nicht weglassbar) ⇒ T5", () => {
    expect(minTierFor("3 Kekse", "de")).toBe(5);
  });

  it("Sonderzeichen GATEN ⇒ T5", () => {
    expect(minTierFor("a @ b", "de")).toBe(5);
  });

  it("nie freischaltbares Zeichen ⇒ null", () => {
    expect(minTierFor("Frost ☃", "de")).toBeNull(); // Schneemann-Emoji ist nicht tippbar
  });

  it("ist monoton: ab dem minTier passt jeder höhere Stand", () => {
    const text = "Der Hund ist braun.";
    const mt = minTierFor(text, "de")!;
    for (const t of TIERS) {
      if (t < mt) continue;
      expect(tierUnlocked(mt, t)).toBe(true);
    }
    if (mt > 0) expect(tierUnlocked(mt, (mt - 1) as any)).toBe(false);
  });

  it("MAX_TIER ist 5", () => {
    expect(MAX_TIER).toBe(5);
  });
});

describe("Ledger — Bitset (gesehen-Menge)", () => {
  it("leeres Set hat nichts gesehen", () => {
    const s = emptySeen();
    expect(seenCount(s)).toBe(0);
    expect(seenHas(s, 0)).toBe(false);
    expect(seenHas(s, 9999)).toBe(false);
  });

  it("markiert Indizes und ist idempotent", () => {
    let s = emptySeen();
    s = seenAdd(s, 0);
    s = seenAdd(s, 7);
    s = seenAdd(s, 8);
    expect(seenHas(s, 0)).toBe(true);
    expect(seenHas(s, 7)).toBe(true);
    expect(seenHas(s, 8)).toBe(true);
    expect(seenHas(s, 1)).toBe(false);
    expect(seenCount(s)).toBe(3);
    const again = seenAdd(s, 7); // schon gesehen
    expect(seenCount(again)).toBe(3);
  });

  it("wächst nur so weit wie nötig — 10.000 Bausteine ⇒ ~1,25 KB", () => {
    let s = emptySeen();
    s = seenAdd(s, 9999);
    expect(seenHas(s, 9999)).toBe(true);
    expect(seenCount(s)).toBe(1);
    expect(s.length).toBe(1250); // ceil(10000/8)
  });

  it("negativer Index ist ein No-Op", () => {
    let s = emptySeen();
    s = seenAdd(s, -1);
    expect(s.length).toBe(0);
    expect(seenHas(s, -1)).toBe(false);
  });

  it("base64 round-trip erhält alle gesetzten Bits", () => {
    let s = emptySeen();
    for (const i of [0, 7, 8, 63, 100, 511, 9999]) s = seenAdd(s, i);
    const back = decodeSeen(encodeSeen(s));
    for (const i of [0, 7, 8, 63, 100, 511, 9999]) expect(seenHas(back, i)).toBe(true);
    expect(seenHas(back, 1)).toBe(false);
    expect(seenCount(back)).toBe(seenCount(s));
  });

  it("leeres Set kodiert zu \"\" und zurück", () => {
    expect(encodeSeen(emptySeen())).toBe("");
    expect(decodeSeen("").length).toBe(0);
    expect(decodeSeen(undefined).length).toBe(0);
  });

  it("kodiert deterministisch (Index 0 ⇒ 'AQ==')", () => {
    expect(encodeSeen(seenAdd(emptySeen(), 0))).toBe("AQ==");
  });
});

describe("Ledger — Content-Manifest (stabile Indizes)", () => {
  const items = [
    { kind: "witz", text: "Erster Witz." },
    { kind: "fakt", text: "Ein Fakt." },
    { kind: "satz", text: "Ein Satz." },
  ];

  it("bausteinKey/Id sind robust gegen Groß-/Kleinschreibung & Satzzeichen", () => {
    expect(bausteinKey("witz", "Hallo, Welt!")).toBe(bausteinKey("witz", "hallo   welt"));
    expect(bausteinId("witz", "Hallo, Welt!")).toBe(bausteinId("witz", "hallo welt"));
    expect(bausteinId("witz", "Hallo")).not.toBe(bausteinId("fakt", "Hallo")); // Sorte zählt
  });

  it("fnv1a ist deterministisch und unterscheidet Strings", () => {
    expect(fnv1a("abc")).toBe(fnv1a("abc"));
    expect(fnv1a("abc")).not.toBe(fnv1a("abd"));
  });

  it("vergibt Indizes 0..n-1 in Reihenfolge, indexOf ist Rückweg", () => {
    const m = buildManifest(items);
    expect(m.ids.length).toBe(3);
    m.ids.forEach((id, i) => expect(m.indexOf.get(id)).toBe(i));
  });

  it("entdoppelt (gleicher Schlüssel) — erster gewinnt seinen Index", () => {
    const m = buildManifest([...items, { kind: "witz", text: "ERSTER Witz!!!" }]);
    expect(m.ids.length).toBe(3); // Duplikat übersprungen
  });

  it("ist append-only: bestehende Indizes bleiben beim Anhängen unverändert", () => {
    const m1 = buildManifest(items);
    const m2 = buildManifest([...items, { kind: "wissen", text: "Neu hinten." }]);
    m1.ids.forEach((id, i) => expect(m2.indexOf.get(id)).toBe(i));
    expect(m2.ids.length).toBe(4);
  });

  it("version ist stabil bei gleicher Eingabe, ändert sich bei Änderung", () => {
    expect(buildManifest(items).version).toBe(buildManifest(items).version);
    expect(buildManifest(items).version).not.toBe(
      buildManifest([...items, { kind: "wissen", text: "Neu." }]).version,
    );
    // Reihenfolge zählt (Reihenfolge-Rotation ⇒ andere Version)
    expect(buildManifest(items).version).not.toBe(
      buildManifest([items[1], items[0], items[2]]).version,
    );
  });
});

describe("Ledger — pickUnseen (nur Ungesehenes, Eimer-Reset)", () => {
  it("wählt bis zu n ungesehene, exhausted=false solange Vorrat da ist", () => {
    const r = pickUnseen([1, 2, 3, 4, 5], emptySeen(), 3, seq([0, 0, 0, 0]));
    expect(r.picked.length).toBe(3);
    expect(r.exhausted).toBe(false);
    for (const p of r.picked) expect([1, 2, 3, 4, 5]).toContain(p);
  });

  it("überspringt bereits Gesehenes", () => {
    let seen = emptySeen();
    seen = seenAdd(seen, 2);
    seen = seenAdd(seen, 4);
    const r = pickUnseen([1, 2, 3, 4, 5], seen, 10, seq([0, 0, 0]));
    expect(r.picked.sort()).toEqual([1, 3, 5]);
    expect(r.exhausted).toBe(false);
  });

  it("meldet exhausted, wenn ALLE Kandidaten gesehen sind", () => {
    let seen = emptySeen();
    for (const i of [1, 2, 3]) seen = seenAdd(seen, i);
    const r = pickUnseen([1, 2, 3], seen, 2, seq([0]));
    expect(r.picked).toEqual([]);
    expect(r.exhausted).toBe(true);
  });

  it("leere Kandidatenliste ist nicht 'exhausted'", () => {
    const r = pickUnseen([], emptySeen(), 2, seq([0]));
    expect(r.picked).toEqual([]);
    expect(r.exhausted).toBe(false);
  });
});

describe("Ledger — Story-Fortschritt (strikt linear)", () => {
  it("Default: Etappe 0, nicht fertig, bei Zeile 0", () => {
    // `line` kam am 21.07. dazu (zeilengenaues Resume) — Default ebenfalls 0.
    expect(storyStateFor(undefined, "s")).toEqual({ etappe: 0, done: false, line: 0 });
  });

  it("advanceStory rückt vor, markiert am Ende 'done', mutiert nicht", () => {
    const p0 = {};
    const p1 = advanceStory(p0, "reise", 3);
    expect(p1.reise).toEqual({ etappe: 1, done: false });
    expect(p0).toEqual({}); // Eingabe unverändert (rein)
    const p2 = advanceStory(p1, "reise", 3);
    const p3 = advanceStory(p2, "reise", 3);
    expect(p3.reise).toEqual({ etappe: 3, done: true });
    expect(isStoryDone(p3, "reise")).toBe(true);
  });

  it("advanceStory über das Ende hinaus klemmt bei total", () => {
    let p = advanceStory({}, "x", 2);
    p = advanceStory(p, "x", 2);
    p = advanceStory(p, "x", 2); // schon fertig
    expect(p.x).toEqual({ etappe: 2, done: true });
  });

  it("resetStory setzt eine Serie auf Anfang", () => {
    let p = advanceStory({}, "x", 5);
    p = resetStory(p, "x");
    expect(p.x).toEqual({ etappe: 0, done: false });
  });
});

describe("Serie — Datenmodell & Helfer", () => {
  const serie: Serie = {
    slug: "mini",
    titel: "Mini-Geschichte",
    kind: "geschichte",
    stufen: ["a"],
    minTier: 2,
    topic: "tiere",
    etappen: [
      { lines: ["fad", "Der Hund"] }, // T0 + T2
      { lines: ["Die Kuh"] },
    ],
  };

  it("zählt Etappen und Zeilen", () => {
    expect(serieEtappeCount(serie)).toBe(2);
    expect(serieLineCount(serie)).toBe(3);
    expect(serieLines(serie)).toEqual(["fad", "Der Hund", "Die Kuh"]);
  });

  it("computeSerieMinTier ist das Maximum der Zeilen-Tiers", () => {
    expect(computeSerieMinTier(serie, "de")).toBe(2);
  });

  it("validateSerie akzeptiert eine formal korrekte Serie", () => {
    const lines = Array.from({ length: 12 }, () => "Der Hund"); // je T2
    const ok: Serie = {
      slug: "ok",
      titel: "OK",
      kind: "geschichte",
      stufen: ["a"],
      minTier: 2,
      topic: "tiere",
      etappen: [{ lines }],
    };
    const res = validateSerie(ok, "de");
    expect(res.ok).toBe(true);
    expect(res.problems).toEqual([]);
  });

  it("validateSerie meldet zu kurze Etappen und falsches minTier", () => {
    const res = validateSerie(serie, "de"); // Etappen mit 2 bzw. 1 Zeile
    expect(res.ok).toBe(false);
    expect(res.problems.some((p) => p.includes("Zeilen"))).toBe(true);
  });
});
