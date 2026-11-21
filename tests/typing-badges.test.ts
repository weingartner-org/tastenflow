/**
 * Abzeichen-System „Tastenflow" (badges.ts): Familien mit Steigerungs-Stufen,
 * Treffsicherheit als Königsdisziplin (Tempo-Abzeichen nur MIT Genauigkeit),
 * Geheim-Abzeichen, Lebenszeit-Zähler (Tally) + Best-Effort-Saat für Altstände,
 * „Nächstes Ziel" je Familie.
 */
import { describe, it, expect } from "vitest";
import {
  BADGES,
  CLEAN_ROUND_ACC,
  LESSONS,
  TypingProgress,
  awardBadges,
  badgeById,
  earnedBadges,
  emptyProgress,
  levelTargetCpm,
  nextGoals,
  recordAdventure,
  recordRound,
  seedTally,
  totalHits,
} from "../src/lib/typing";

/** Mittag (keine Nachteule / kein Früher Vogel). */
const NOON = new Date(2026, 6, 7, 12, 0, 0).getTime();
const NIGHT = new Date(2026, 6, 7, 21, 30, 0).getTime();
const DAWN = new Date(2026, 6, 7, 6, 30, 0).getTime();

/** Eine Runde wie im Trainer verbuchen (recordRound → awardBadges). */
function playRound(
  p: TypingProgress,
  round: { acc: number; cpm: number; stars: number },
  now = NOON,
  level = 10,
) {
  const rec = recordRound(p, round, level, now);
  return awardBadges(rec.progress, { ...round, level }, now, "de");
}

describe("Abzeichen-Definitionen", () => {
  it("IDs sind eindeutig, jede Definition vollständig", () => {
    const ids = new Set(BADGES.map((b) => b.id));
    expect(ids.size).toBe(BADGES.length);
    for (const b of BADGES) {
      expect(b.name.length).toBeGreaterThan(2);
      expect(b.description.length).toBeGreaterThan(10);
      expect(b.emoji.length).toBeGreaterThan(0);
      expect(b.group.length).toBeGreaterThan(0);
    }
  });
  it("Beschreibungen kommen ohne direkte Anrede aus (Du/Sie-neutral)", () => {
    for (const b of BADGES) {
      // grobe Heuristik: keine Anrede-Wörter — Texte gelten für BEIDE Profile
      expect(b.description).not.toMatch(/\b(du|dein|dir|dich|Sie|Ihr[e]?)\b/);
    }
  });
});

describe("Erste Runde — der Einstiegs-Haken", () => {
  it("die allererste Runde bringt das Tasten-Küken", () => {
    const r = playRound(emptyProgress(), { acc: 0.9, cpm: 50, stars: 2 });
    expect(r.newly.map((b) => b.id)).toContain("tasten-kueken");
    expect(r.progress.badges?.["tasten-kueken"]).toBe(NOON);
  });
  it("ein Abzeichen wird nie doppelt verdient", () => {
    const r1 = playRound(emptyProgress(), { acc: 0.9, cpm: 50, stars: 2 });
    const r2 = playRound(r1.progress, { acc: 0.9, cpm: 50, stars: 2 });
    expect(r2.newly.map((b) => b.id)).not.toContain("tasten-kueken");
  });
});

describe("Königsdisziplin Treffsicherheit", () => {
  it("eine fehlerfreie Runde bringt den Volltreffer", () => {
    const r = playRound(emptyProgress(), { acc: 1, cpm: 80, stars: 3 });
    expect(r.newly.map((b) => b.id)).toContain("volltreffer");
  });
  it("5 fehlerfreie Runden bringen den Null-Fehler-Ninja", () => {
    let p = emptyProgress();
    let last: ReturnType<typeof playRound> | undefined;
    for (let i = 0; i < 5; i++) {
      last = playRound(p, { acc: 1, cpm: 80, stars: 3 });
      p = last.progress;
    }
    expect(last!.newly.map((b) => b.id)).toContain("null-fehler-ninja");
  });
  it("3 saubere Runden IN FOLGE bringen den Präzisions-Pinguin — eine unsaubere bricht die Serie", () => {
    let p = emptyProgress();
    p = playRound(p, { acc: 0.97, cpm: 80, stars: 3 }).progress;
    p = playRound(p, { acc: 0.96, cpm: 80, stars: 3 }).progress;
    // Serie reißt:
    p = playRound(p, { acc: 0.7, cpm: 80, stars: 1 }).progress;
    expect(p.badges?.["praezisions-pinguin"]).toBeUndefined();
    p = playRound(p, { acc: 0.97, cpm: 80, stars: 3 }).progress;
    p = playRound(p, { acc: 0.96, cpm: 80, stars: 3 }).progress;
    const r = playRound(p, { acc: CLEAN_ROUND_ACC, cpm: 80, stars: 3 });
    expect(r.newly.map((b) => b.id)).toContain("praezisions-pinguin");
  });
});

describe("Tempo zählt NUR sauber (Flinker Fuchs) — Genauigkeit vor Geschwindigkeit", () => {
  const level = 20;
  const target = levelTargetCpm(level);
  it("schnell UND sauber → Fuchs", () => {
    const r = playRound(emptyProgress(), { acc: 0.96, cpm: target + 10, stars: 3 }, NOON, level);
    expect(r.newly.map((b) => b.id)).toContain("flinker-fuchs");
  });
  it("schnell, aber schludrig → KEIN Fuchs", () => {
    const r = playRound(emptyProgress(), { acc: 0.9, cpm: target * 3, stars: 2 }, NOON, level);
    expect(r.newly.map((b) => b.id)).not.toContain("flinker-fuchs");
  });
  it("auf Stufe 1 (kein Tempo-Ziel) gibt es den Fuchs nicht", () => {
    const r = playRound(emptyProgress(), { acc: 1, cpm: 300, stars: 3 }, NOON, 1);
    expect(r.newly.map((b) => b.id)).not.toContain("flinker-fuchs");
  });
  it("ein explizites Runden-Ziel (target) hat Vorrang vor dem Stufen-Ziel", () => {
    // Runde lief gegen Ziel 30 (z. B. vor der Kalibrierung) — Stufe wäre strenger:
    const rec = recordRound(emptyProgress(), { acc: 1, cpm: 100, stars: 3 }, 40, NOON);
    const r = awardBadges(
      rec.progress,
      { acc: 1, cpm: 100, stars: 3, level: 40, target: 30 },
      NOON, "de",
    );
    expect(r.newly.map((b) => b.id)).toContain("flinker-fuchs");
  });
  it("Gemütliches Faultier: fehlerfrei, aber deutlich unter dem Ziel", () => {
    const r = playRound(emptyProgress(), { acc: 1, cpm: target * 0.3, stars: 2 }, NOON, level);
    expect(r.newly.map((b) => b.id)).toContain("gemuetliches-faultier");
  });
  it("Faultier NUR fehlerfrei — langsam UND fehlerhaft reicht nicht", () => {
    const r = playRound(emptyProgress(), { acc: 0.9, cpm: target * 0.3, stars: 1 }, NOON, level);
    expect(r.newly.map((b) => b.id)).not.toContain("gemuetliches-faultier");
  });
});

describe("Geheim-Abzeichen", () => {
  it("Comeback-Känguru: nach 1 Stern direkt 3 Sterne", () => {
    let p = playRound(emptyProgress(), { acc: 0.7, cpm: 40, stars: 1 }).progress;
    const r = playRound(p, { acc: 0.99, cpm: 90, stars: 3 });
    expect(r.newly.map((b) => b.id)).toContain("comeback-kaenguru");
  });
  it("Nachteule nach 21 Uhr, Früher Vogel vor 7 Uhr", () => {
    const night = playRound(emptyProgress(), { acc: 0.9, cpm: 50, stars: 2 }, NIGHT);
    expect(night.newly.map((b) => b.id)).toContain("nachteule");
    const dawn = playRound(emptyProgress(), { acc: 0.9, cpm: 50, stars: 2 }, DAWN);
    expect(dawn.newly.map((b) => b.id)).toContain("frueher-vogel");
    const noon = playRound(emptyProgress(), { acc: 0.9, cpm: 50, stars: 2 }, NOON);
    expect(noon.newly.map((b) => b.id)).not.toContain("nachteule");
    expect(noon.newly.map((b) => b.id)).not.toContain("frueher-vogel");
  });
});

describe("Anschläge-/Lektionen-/Spielstufen-Familien", () => {
  it("1.000 richtige Anschläge bringen den Tausend-Tasten-Tiger", () => {
    const p: TypingProgress = {
      ...emptyProgress(),
      letters: {
        a: { hits: 600, misses: 10, sumMs: 0, timed: 0 },
        b: { hits: 450, misses: 5, sumMs: 0, timed: 0 },
      },
    };
    expect(totalHits(p.letters)).toBe(1050);
    const r = playRound(p, { acc: 0.9, cpm: 50, stars: 2 });
    expect(r.newly.map((b) => b.id)).toContain("tausend-tasten-tiger");
  });
  it("5 abgeschlossene Lektionen bringen den Lektions-Löwen", () => {
    // ECHTE Lektions-IDs (seit 09.08.2026): `lessonsDoneCount` zählt über den
    // Lehrgang statt über beliebige Schlüssel im Spielstand — sonst zählten
    // Reste alter Lektionen mit, die es längst nicht mehr gibt.
    const lessons: TypingProgress["lessons"] = {};
    for (const l of LESSONS.slice(0, 5))
      lessons[l.id] = { completed: true, bestStars: 2, bestCpm: 50, attempts: 1 };
    const r = playRound({ ...emptyProgress(), lessons }, { acc: 0.9, cpm: 50, stars: 2 });
    expect(r.newly.map((b) => b.id)).toContain("lektions-loewe");
  });
  it("Spielstufe 5 (ab 400 XP) bringt den Kletter-Koala", () => {
    const r = playRound({ ...emptyProgress(), xp: 400 }, { acc: 0.9, cpm: 50, stars: 2 });
    expect(r.newly.map((b) => b.id)).toContain("kletter-koala");
  });
});

describe("Altstand-Saat (seedTally) — rückwirkende Abzeichen", () => {
  it("Kind mit Verlauf bekommt längst verdiente Abzeichen beim ersten Rundenende", () => {
    // Altstand: 30 Runden Verlauf, KEIN badgeTally (Stand vor dem Update).
    let p: TypingProgress = { ...emptyProgress(), rounds: [] };
    const dayMs = 24 * 3600 * 1000;
    for (let i = 0; i < 30; i++)
      p.rounds!.push({ ts: NOON - (30 - i) * dayMs, acc: 0.98, cpm: 80, stars: 3, level: 10 });
    const r = playRound(p, { acc: 0.99, cpm: 80, stars: 3 });
    const ids = r.newly.map((b) => b.id);
    expect(ids).toContain("tasten-kueken"); // Runden ≥ 1
    expect(ids).toContain("ausdauer-ameise"); // Runden ≥ 25
    expect(ids).toContain("sternen-sammler"); // 3-Sterne-Runden ≥ 10
    expect(ids).toContain("laser-lama"); // 15 saubere in Folge
    expect(ids).toContain("wie-ein-uhrwerk"); // ≥ 20 Übungstage
  });
  it("Saat zählt Tage/Serien korrekt", () => {
    const p: TypingProgress = { ...emptyProgress(), rounds: [] };
    const dayMs = 24 * 3600 * 1000;
    // 2 Runden am selben Tag, 1 am nächsten → 2 Tage
    p.rounds = [
      { ts: NOON, acc: 1, cpm: 50, stars: 3, level: 5 },
      { ts: NOON + 3600 * 1000, acc: 0.7, cpm: 50, stars: 1, level: 5 },
      { ts: NOON + dayMs, acc: 0.96, cpm: 50, stars: 2, level: 5 },
    ];
    const t = seedTally(p);
    expect(t.rounds).toBe(3);
    expect(t.days).toBe(2);
    expect(t.perfect).toBe(1);
    expect(t.cleanStreak).toBe(1); // die unsaubere Runde hat die Serie gebrochen
    expect(t.bestCleanStreak).toBe(1);
    expect(t.lastStars).toBe(2);
  });
});

describe("Übungstage zählen nur AUFWÄRTS (kein Streak-Verlust)", () => {
  it("mehrere Runden am selben Tag zählen als EIN Tag; Pausen schaden nicht", () => {
    const dayMs = 24 * 3600 * 1000;
    let p = playRound(emptyProgress(), { acc: 0.9, cpm: 50, stars: 2 }, NOON).progress;
    p = playRound(p, { acc: 0.9, cpm: 50, stars: 2 }, NOON + 1000).progress;
    expect(p.badgeTally?.days).toBe(1);
    // 10 Tage Pause — der Zähler wächst einfach weiter:
    p = playRound(p, { acc: 0.9, cpm: 50, stars: 2 }, NOON + 10 * dayMs).progress;
    p = playRound(p, { acc: 0.9, cpm: 50, stars: 2 }, NOON + 20 * dayMs).progress;
    const r = playRound(p, { acc: 0.9, cpm: 50, stars: 2 }, NOON + 40 * dayMs);
    expect(r.progress.badgeTally?.days).toBe(4);
  });
});

describe("nextGoals — immer ein klares nächstes Ziel", () => {
  it("nennt für einen frischen Stand das erste Ziel jeder Familie", () => {
    const goals = nextGoals(emptyProgress(), "de");
    const ids = goals.map((g) => g.def.id);
    expect(ids).toContain("tasten-kueken");
    expect(ids).toContain("volltreffer");
    // Geheim-Abzeichen tauchen NICHT als Ziel auf (Überraschung bleibt):
    expect(ids).not.toContain("nachteule");
    expect(ids).not.toContain("gemuetliches-faultier");
  });
  it("zeigt nach dem Volltreffer den Ninja als nächstes Fehlerfrei-Ziel", () => {
    const p = playRound(emptyProgress(), { acc: 1, cpm: 80, stars: 3 }).progress;
    const g = nextGoals(p, "de").find((g) => g.def.group === "Fehlerfrei");
    expect(g?.def.id).toBe("null-fehler-ninja");
    expect(g?.have).toBe(1);
    expect(g?.need).toBe(5);
  });
});

describe("earnedBadges + badgeById", () => {
  it("liefert verdiente Abzeichen mit Zeitstempel in Definitions-Reihenfolge", () => {
    const p = playRound(emptyProgress(), { acc: 1, cpm: 80, stars: 3 }).progress;
    const earned = earnedBadges(p);
    expect(earned.length).toBeGreaterThanOrEqual(2); // Küken + Volltreffer + …
    expect(earned.every((e) => e.ts === NOON)).toBe(true);
    expect(badgeById("volltreffer")?.name).toBe("Volltreffer");
  });
});

describe("recordAdventure — Abenteuer-Abzeichen des Eisschollen-Spiels", () => {
  it("zählt Abenteuer, saubere Läufe und Fische; vergibt die Familien-Stufen", () => {
    let p = emptyProgress();
    const r1 = recordAdventure(p, { clean: false, fish: 2 }, NOON, "de");
    p = r1.progress;
    expect(p.badgeTally?.adventures).toBe(1);
    expect(p.badgeTally?.cleanAdventures ?? 0).toBe(0);
    expect(p.badgeTally?.fishCaught).toBe(2);
    expect(r1.newly.map((b) => b.id)).toContain("erste-expedition");
    expect(r1.newly.map((b) => b.id)).not.toContain("trockener-frack");

    const r2 = recordAdventure(p, { clean: true, fish: 13 }, NOON, "de");
    p = r2.progress;
    expect(r2.newly.map((b) => b.id)).toContain("trockener-frack");
    // 2 + 13 = 15 Fische → Fischfänger
    expect(r2.newly.map((b) => b.id)).toContain("fischfaenger");
  });

  it("erreicht Polarforscher nach 10 Abenteuern — und meldet nichts doppelt", () => {
    let p = emptyProgress();
    let newlyAll: string[] = [];
    for (let i = 0; i < 10; i++) {
      const r = recordAdventure(p, { clean: false, fish: 0 }, NOON, "de");
      p = r.progress;
      newlyAll = newlyAll.concat(r.newly.map((b) => b.id));
    }
    expect(p.badgeTally?.adventures).toBe(10);
    expect(newlyAll.filter((id) => id === "erste-expedition")).toHaveLength(1);
    expect(newlyAll).toContain("polarforscher");
  });

  it("taucht bei den nächsten Zielen mit Zählerstand auf", () => {
    const p = recordAdventure(emptyProgress(), { clean: false, fish: 3 }, NOON, "de").progress;
    const goals = nextGoals(p, "de");
    const adv = goals.find((g) => g.unit === "Eisschollen-Abenteuer");
    expect(adv?.have).toBe(1);
    expect(adv?.need).toBe(10); // nächste Stufe: Polarforscher
    const fisch = goals.find((g) => g.unit === "gefangene Fische");
    expect(fisch?.have).toBe(3);
  });

  it("Tor-Runden (awardBadges) lassen die Abenteuer-Zähler unangetastet", () => {
    const p = recordAdventure(emptyProgress(), { clean: true, fish: 1 }, NOON, "de").progress;
    const after = playRound(p, { acc: 1, cpm: 80, stars: 3 }).progress;
    expect(after.badgeTally?.adventures).toBe(1);
    expect(after.badgeTally?.cleanAdventures).toBe(1);
    expect(after.badgeTally?.fishCaught).toBe(1);
  });

  // E8: die ganze Polar-Expedition (freies Spiel) meldet zusätzlich die
  // durchquerten Sonder-Zonen und ob sie fehlerfrei bis zum Polarlicht kam.
  it("vergibt die Expeditions-Meilensteine für durchquerte Zonen und das Polarlicht", () => {
    const r = recordAdventure(
      emptyProgress(),
      { clean: true, fish: 0, aurora: true, zonesCleared: ["water", "cave", "storm", "station", "slide"] },
      NOON, "de",
    );
    const ids = r.newly.map((b) => b.id);
    expect(ids).toContain("hoehlen-lauscher");
    expect(ids).toContain("sturm-trotzer");
    expect(ids).toContain("funker-freund");
    expect(ids).toContain("polarlicht-entdecker");
  });

  it("gibt Polarlicht-Entdecker NUR bei fehlerfreier Gesamtreise (aurora)", () => {
    // Reise mit Fehler (kein aurora): Zonen-Meilensteine ja, Polarlicht nein.
    const r = recordAdventure(
      emptyProgress(),
      { clean: false, fish: 0, aurora: false, zonesCleared: ["water", "cave"] },
      NOON, "de",
    );
    const ids = r.newly.map((b) => b.id);
    expect(ids).toContain("hoehlen-lauscher");
    expect(ids).not.toContain("polarlicht-entdecker");
    expect(ids).not.toContain("sturm-trotzer"); // Sturm war nicht dabei
  });

  it("bleibt ohne die neuen Felder rückwärtskompatibel (kein Expeditions-Abzeichen)", () => {
    const r = recordAdventure(emptyProgress(), { clean: true, fish: 0 }, NOON, "de");
    const ids = r.newly.map((b) => b.id);
    expect(ids).toContain("erste-expedition");
    expect(ids).not.toContain("polarlicht-entdecker");
    expect(ids).not.toContain("hoehlen-lauscher");
  });
});
