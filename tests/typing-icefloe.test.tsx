/**
 * „Eisschollen"-Logik (iceFloe.ts) — das getestete Fundament, auf dem die
 * Polar-Expedition aufbaut (BLEIBT auch nach dem Löschen des alten
 * `IceFloeGame.tsx`): Kurse/Etappen aus den Problem-Zeichen (Tor kurz mit
 * Abwechslung, freies Spiel lang), Checkpoints je Etappe, faire Standzeit,
 * Tasten-Abgleich, Tages-Parcours und Fisch-Auswahl. Der Spielverlauf selbst
 * läuft jetzt über `ExpeditionStage`/`useExpedition` (siehe expedition-*.test).
 */
import { describe, it, expect } from "vitest";
import {
  FloeCourse,
  SHIFT_UNIT,
  buildFloeSequence,
  buildFreePlayCourse,
  buildGateCourse,
  courseSpots,
  courseUnits,
  dailySeed,
  floeKeyIgnored,
  floeKeyMatches,
  floeStandMs,
  masteryFor,
  pickFishUnit,
} from "../src/lib/typing";

describe("floeStandMs — faire Standzeit", () => {
  it("kennt keinen Zeitdruck bei »nur Genauigkeit« (WCAG: Zeitlimit abschaltbar)", () => {
    expect(floeStandMs(masteryFor("nurgenau"), false)).toBeNull();
  });
  it("gibt gemächlichen Kindern deutlich mehr Zeit", () => {
    expect(floeStandMs(masteryFor("gemaechlich"), true)).toBe(14_000);
    expect(floeStandMs(masteryFor("normal"), false)).toBe(9_000);
  });
});

describe("buildFloeSequence — Schollen aus den Problem-Zeichen", () => {
  it("füllt die Überquerung zyklisch mit den schwächsten Zeichen", () => {
    const seq = buildFloeSequence(["f", "j"], undefined, masteryFor("normal"));
    expect(seq).toHaveLength(6);
    for (const u of seq) expect(["f", "j"]).toContain(u);
    // beide Problem-Zeichen kommen mehrfach dran
    expect(new Set(seq).size).toBe(2);
  });
  it("bleibt bei leerem Zeichen-Satz leer und respektiert die Wunschlänge", () => {
    expect(buildFloeSequence([], undefined, masteryFor("normal"))).toEqual([]);
    expect(
      buildFloeSequence(["f", "j", "d"], undefined, masteryFor("normal"), 4),
    ).toHaveLength(4);
  });
});

describe("buildGateCourse / buildFreePlayCourse — Parcours-Bau", () => {
  const m = masteryFor("normal");
  it("Tor: gerade Zeichen-Anzahl = klassische Überquerung, ungerade = mit Buchstabenberg", () => {
    const even = buildGateCourse(["f", "j"], undefined, m);
    expect(even.stages.map((s) => s.kind)).toEqual(["water"]);
    expect(even.stages[0].units).toHaveLength(6);

    const odd = buildGateCourse(["f", "j", "d"], undefined, m);
    expect(odd.stages.map((s) => s.kind)).toEqual(["water", "climb", "slide"]);
    // Stationen bestehen ausschließlich aus den eingeführten Zeichen
    for (const u of courseUnits(odd)) expect(["f", "j", "d"]).toContain(u);
    // Tor nutzt NIE Höhle/Sturm (§4.9 — Merk-/Hörzwang im Pflichtteil wäre unfair).
    expect(odd.stages.map((s) => s.kind)).not.toContain("cave");
    expect(odd.stages.map((s) => s.kind)).not.toContain("storm");
  });
  it("freies Spiel: langes Abenteuer über vier Etappen inkl. Echo-Höhle und Fischen", () => {
    const c = buildFreePlayCourse(["f", "j", "d"], undefined, m, 0);
    expect(c.stages.map((s) => s.kind)).toEqual(["water", "climb", "slide", "cave"]);
    expect(courseUnits(c).length).toBeGreaterThanOrEqual(15);
    // Bonus-Fische liegen in der Wasser-Etappe, nie nach der letzten Scholle.
    const water = c.stages[0];
    expect(water.fish!.length).toBeGreaterThan(0);
    for (const s of water.fish!) expect(s).toBeLessThan(water.units.length);
  });
  it("Tages-Parcours: gleicher Tag = gleicher Kurs, anderer Tag = anderer Kurs", () => {
    const a1 = buildFreePlayCourse(["f", "j", "d"], undefined, m, 101);
    const a2 = buildFreePlayCourse(["f", "j", "d"], undefined, m, 101);
    const b = buildFreePlayCourse(["f", "j", "d"], undefined, m, 102);
    expect(a1).toEqual(a2);
    expect(JSON.stringify(b)).not.toBe(JSON.stringify(a1));
    // ungerader Seed (101) legt die Höhle VOR den Berg, gerader (102) dahinter
    expect(a1.stages.map((s) => s.kind).indexOf("cave")).toBeLessThan(
      a1.stages.map((s) => s.kind).indexOf("climb"),
    );
    expect(b.stages.map((s) => s.kind).indexOf("cave")).toBeGreaterThan(
      b.stages.map((s) => s.kind).indexOf("climb"),
    );
    // dailySeed: stabil am selben Tag, anders am Folgetag
    const day = new Date(2026, 6, 10, 9, 0).getTime();
    expect(dailySeed(day)).toBe(dailySeed(day + 3 * 3600_000));
    expect(dailySeed(day)).not.toBe(dailySeed(day + 24 * 3600_000));
  });
  it("pickFishUnit meidet das aktuelle Ziel", () => {
    expect(pickFishUnit(["f", "j", "f"], "f", 0)).toBe("j");
    expect(pickFishUnit(["f", "f"], "f", 0)).toBeNull();
    expect(pickFishUnit([], "f", 0)).toBeNull();
  });
  it("bleibt bei leerem Zeichen-Satz leer", () => {
    expect(buildGateCourse([], undefined, m).stages).toEqual([]);
    expect(buildFreePlayCourse([], undefined, m).stages).toEqual([]);
  });
});

describe("courseSpots — Halte und Checkpoints", () => {
  it("legt Ufer, Stationen, Rastplätze und Ziel an; Scheitern wirft zum letzten Rastplatz", () => {
    const course: FloeCourse = {
      stages: [
        { kind: "water", units: ["f"] },
        { kind: "climb", units: ["j", "f"] },
        { kind: "slide", units: ["j"] },
      ],
    };
    const spots = courseSpots(course);
    expect(spots.map((s) => s.kind)).toEqual([
      "shore",
      "station",
      "rest",
      "station",
      "station",
      "rest",
      "station",
      "finish",
    ]);
    // Wasser-Station → zurück zum Ufer (0); Berg-Stationen → Rast 2 (Strand);
    // Rutsch-Station → Rast 5 (Gipfel).
    expect(spots[1].checkpoint).toBe(0);
    expect(spots[3].checkpoint).toBe(2);
    expect(spots[4].checkpoint).toBe(2);
    expect(spots[6].checkpoint).toBe(5);
    // Stations-Zählung je Etappe (für Statuszeile/Ansage)
    expect(spots[3].step).toBe(1);
    expect(spots[3].of).toBe(2);
  });
});

describe("floeKeyMatches / floeKeyIgnored — Tasten-Abgleich", () => {
  it("vergleicht Buchstaben unabhängig von der Großschreibung", () => {
    expect(floeKeyMatches("f", "f")).toBe(true);
    expect(floeKeyMatches("F", "f")).toBe(true);
    expect(floeKeyMatches("j", "f")).toBe(false);
  });
  it("verlangt für die ⇧-Scholle die Umschalttaste selbst", () => {
    expect(floeKeyMatches("Shift", SHIFT_UNIT)).toBe(true);
    expect(floeKeyMatches("s", SHIFT_UNIT)).toBe(false);
  });
  it("überhört Kürzel und Steuertasten, aber nicht Zeichen", () => {
    const base = { altKey: false, ctrlKey: false, metaKey: false };
    expect(floeKeyIgnored({ ...base, key: "h", altKey: true })).toBe(true);
    expect(floeKeyIgnored({ ...base, key: "F1" })).toBe(true);
    expect(floeKeyIgnored({ ...base, key: "Enter" })).toBe(true);
    expect(floeKeyIgnored({ ...base, key: "f" })).toBe(false);
    expect(floeKeyIgnored({ ...base, key: "Shift" })).toBe(false);
  });
});
