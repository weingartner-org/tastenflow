/**
 * ★★★★ WÄCHTER: Die Lektions-Abzeichen zählen die Lektionen DES WEGES
 * (Bauplan englischer Lehrgang §7, E8, 24.09.2026).
 *
 * Befund: `LESSON_TIERS` und die Meisterprüfung-Schwelle in `badges.ts`
 * verglichen bisher IMMER gegen `LESSONS.length` (die deutschen 27 Lektionen) -
 * auch für ein Kind auf Weg „en" (19 Lektionen, `EN_LESSONS`/`lektionenFuer`).
 * Damit wären „Lehrgangs-Legende" und „Lehrgangs-Meister" auf Weg „en" NIE
 * erreichbar gewesen: `lessonsDoneCount`/`lessonsWithThreeStars` zählen dort
 * nie höher als 19, aber die alte Schwelle verlangte 27.
 *
 * Dieselbe Zahl gehört auch in die ENGLISCHE Beschreibung der beiden Abzeichen
 * (`badgesEn.ts`, „All … lessons completed[…]") - sie folgt jetzt
 * `lektionenFuer(z.lernweg)`, nicht mehr der immer-deutschen Zahl.
 */
import { describe, expect, it } from "vitest";
import {
  EN_LESSONS,
  LESSONS,
  awardBadges,
  badgeBeschreibung,
  badgeById,
  emptyProgress,
  introOrder,
  lektionenFuer,
  lessonTiersFor,
  lessonsDoneCount,
  lessonsWithThreeStars,
  type LetterStat,
  type TypingProgress,
} from "@/lib/typing";

const MO = new Date(2026, 7, 10, 12, 0, 0).getTime();

function sitzt(): LetterStat {
  return { hits: 40, misses: 0, sumMs: 40 * 300, timed: 40, recent: Array(20).fill(300) };
}

function alleLektionenAbgeschlossen(
  lessons: readonly { id: string }[],
  lernweg: "de" | "en",
): TypingProgress {
  const lessonsMap: TypingProgress["lessons"] = {};
  for (const l of lessons) lessonsMap[l.id] = { completed: true, bestStars: 3, bestCpm: 120, attempts: 2 };
  const introduced = introOrder(lernweg);
  const letters: Record<string, LetterStat> = {};
  for (const u of introduced) letters[u] = sitzt();
  return {
    ...emptyProgress(),
    introduced,
    letters,
    lessons: lessonsMap,
    badgeTally: { rounds: 1, perfect: 0, cleanStreak: 0, bestCleanStreak: 0, stars3: 0, days: 1 },
  };
}

describe("★ lessonTiersFor: die dritte Sprosse folgt dem Weg", () => {
  it(`Weg „de": identisch mit LESSON_TIERS (${LESSONS.length} Lektionen)`, () => {
    expect(lessonTiersFor("de")).toEqual([5, 15, LESSONS.length]);
  });

  it(`Weg „en": ${EN_LESSONS.length} Lektionen, NICHT die deutschen ${LESSONS.length}`, () => {
    expect(lessonTiersFor("en")).toEqual([5, 15, EN_LESSONS.length]);
    expect(EN_LESSONS.length).not.toBe(LESSONS.length);
  });
});

describe(`★★★★★ Ein Kind auf Weg „en" erreicht Lehrgangs-Legende und -Meister`, () => {
  it(`alle ${EN_LESSONS.length} englischen Lektionen abgeschlossen ⇒ beide Abzeichen sitzen`, () => {
    const p = alleLektionenAbgeschlossen(EN_LESSONS, "en");
    expect(lessonsDoneCount(p, "en")).toBe(EN_LESSONS.length);
    expect(lessonsWithThreeStars(p, "en")).toBe(EN_LESSONS.length);
    // Die Regression, die der Befund beschreibt: 19 < 27 - mit der alten,
    // immer-deutschen Schwelle wäre KEINS der beiden Abzeichen dabei.
    expect(EN_LESSONS.length).toBeLessThan(LESSONS.length);

    const { progress } = awardBadges(p, { acc: 0.9, cpm: 50, stars: 3, level: 5 }, MO, "en");
    const ids = Object.keys(progress.badges ?? {});
    expect(ids).toContain("lehrgangs-legende");
    expect(ids).toContain("lehrgangs-meister");
  });
});

describe("★ Die englische Beschreibung nennt die Zahl DES WEGES", () => {
  it(`Weg „en": „All ${EN_LESSONS.length} lessons completed[…]"`, () => {
    const legende = badgeById("lehrgangs-legende")!;
    const meister = badgeById("lehrgangs-meister")!;
    expect(badgeBeschreibung(legende, "en", "en")).toBe(`All ${EN_LESSONS.length} lessons completed.`);
    expect(badgeBeschreibung(meister, "en", "en")).toBe(
      `All ${EN_LESSONS.length} lessons completed with three stars.`,
    );
  });

  it(`Weg „de" (Vorgabe, unverändert): „All ${LESSONS.length} lessons completed[…]"`, () => {
    const legende = badgeById("lehrgangs-legende")!;
    expect(badgeBeschreibung(legende, "en")).toBe(`All ${lektionenFuer("de").length} lessons completed.`);
    expect(lektionenFuer("de").length).toBe(LESSONS.length);
  });
});
