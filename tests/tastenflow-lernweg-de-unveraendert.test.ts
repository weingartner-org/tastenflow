/**
 * ★★★★★ WÄCHTER: Der Lernweg „de" bleibt Byte für Byte, wie er war.
 *
 * Etappe E1 des englischen Lehrgangs (BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md
 * §2, §10 Zeile E1) fädelt einen Pflicht-Parameter `lernweg` durch jede
 * Reihenfolge-Funktion. Die wichtigste Zusage des Umbaus (§2.2 „Bestand"):
 * **Niemand, der heute übt, merkt etwas.**
 *
 * Darum wurde VOR dem Umbau alles aufgenommen, was aus der Einführungs-
 * reihenfolge folgt - für alle vier Tastaturen (de, ch, us, uk) - und in
 * `tests/fixtures/tastenflow-lernweg-de-golden.json` festgeschrieben. Dieser
 * Test rechnet dasselbe heute nach und verlangt Gleichheit.
 *
 * ── WAS SICH NACH DEM UMBAU ÄNDERN DARF ─────────────────────────────────────
 * Nur der Block „AUFRUFE" unten: Dort werden die Funktionen seit dem Umbau mit
 * `lernweg = "de"` aufgerufen. Die Aufnahme (`aufnahme`) und die Datei bleiben
 * unberührt. Wird dieser Test rot, ist das ein HALT-SIGNAL - den Code
 * reparieren, nie die Datei neu schreiben.
 *
 * Neu aufnehmen (nur bei einer bewussten, mit Johannes besprochenen Änderung
 * der deutschen Reihenfolge): `LERNWEG_GOLDEN_AUFNEHMEN=1 npx vitest run
 * tests/tastenflow-lernweg-de-unveraendert.test.ts`.
 */
import { afterAll, describe, expect, it } from "vitest";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  DIGIT_ORDER,
  HOME_KEYS,
  HOME_ROW_LETTERS,
  INITIAL_LETTERS,
  INTRO_ORDER,
  LETTERS_BEFORE_SHIFT,
  STARTPUNKT_FOLGE,
  LETTER_ORDER,
  PUNCT_ORDER,
  SHIFT_UNIT,
  SYMBOL_ORDER,
  advanceIntroduced,
  defaultIntroduced,
  ensureIntroduced,
  introOrder,
  introducedUpTo,
  keyDifficulty,
  nextLetter,
  startPoints,
  startpunktAngleichen,
  startpunktAnwenden,
} from "../src/lib/typing/letters";
import {
  TIERS,
  TIER_CHARS,
  allowedForTier,
  minTierFor,
  tierChars,
  tierOfChar,
  type Tier,
} from "../src/lib/typing/tiers";
import {
  NIVEAU_DEFS,
  niveauDefs,
  zeichenVorrat,
  type ProbenNiveau,
} from "../src/lib/typing/schreibprobe";
import { lernwegDef } from "../src/lib/typing/lernweg";
import {
  LESSONS,
  introducedThroughLesson,
  lessonDoneByStoff,
  lessonsDoneCount,
  unlockedKeysWith,
} from "../src/lib/typing/curriculum";
import { nextGoals } from "../src/lib/typing/badges";
import { emptyProgress, type TypingProgress } from "../src/lib/typing/progress";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";

const DATEI = resolve(__dirname, "fixtures/tastenflow-lernweg-de-golden.json");

// ── AUFRUFE ──────────────────────────────────────────────────────────────────
// Der EINZIGE Teil, der sich mit dem Umbau ändern darf. Seit E1 (24.09.2026)
// mit dem Lernweg „de" - aufgenommen wurde die Datei VOR dem Umbau, ohne ihn.
const W = "de" as const;
const A = {
  introOrder: () => introOrder(W),
  defaultIntroduced: () => defaultIntroduced(W),
  ensureIntroduced: (x: string[] | undefined) => ensureIntroduced(x, W),
  nextLetter: (x: string[]) => nextLetter(x, W),
  introducedUpTo: (n: number) => introducedUpTo(n, W),
  startPoints: (sprache: "de" | "en") => startPoints(sprache, W),
  startpunktAngleichen: (x: string[] | undefined, u: number | undefined) =>
    startpunktAngleichen(x, u, W),
  startpunktAnwenden: (
    x: string[] | undefined,
    u: number | undefined,
    am: number | undefined,
    v: { units?: number; am?: number } | undefined,
  ) => startpunktAnwenden(x, u, am, v, W),
  advanceIntroduced: (x: string[]) => advanceIntroduced(x, {}, W),
  // ★ E2 (24.09.2026): `keyDifficulty` braucht seither den Lernweg (Bauplan §11
  // Falle 6 - die Grundreihe unterscheidet sich je Weg).
  keyDifficulty: (u: string) => keyDifficulty(u, W),
  allowedForTier: (t: Tier) => allowedForTier(t, W),
  minTierFor: (s: string) => minTierFor(s, W),
  tierOfChar: (c: string) => tierOfChar(c, W),
  tierChars: () => tierChars(W),
  niveauDefs: () => niveauDefs(W),
  zeichenVorrat: (n: ProbenNiveau) => zeichenVorrat(n, W),
  homeKeys: () => lernwegDef(W).homeKeys,
  unlockedKeysWith: (id: string, x: string[] | undefined) => unlockedKeysWith(id, x, W),
  introducedThroughLesson: (x: string[] | undefined, id: string) =>
    introducedThroughLesson(x, id, W),
  lessonDoneByStoff: (p: TypingProgress, id: string) => lessonDoneByStoff(p, id, W),
  lessonsDoneCount: (p: TypingProgress) => lessonsDoneCount(p, W),
  nextGoals: (p: TypingProgress) => nextGoals(p, W),
};
// ── ENDE AUFRUFE ─────────────────────────────────────────────────────────────

const LAYOUTS: LayoutId[] = ["de", "ch", "us", "uk"];

// ★ D-1 (28.09.2026): Die Stichproben (Stände, Zeichenlisten) kommen aus der
// Folge VOR D-1 (`startpunktFolge`) - so füttert der Wächter dieselben Stände
// wie bei der Aufnahme, und jede Änderung in der Datei ist eine Änderung der
// Funktionen, nicht der Stichproben.
/** Stichproben für die Funktionen, die einen Stand bekommen. */
const STAENDE: (string[] | undefined)[] = [
  undefined,
  [],
  ["f"],
  ["j", "f"],
  ["f", "j", "d"],
  ["f", "j", "ö", "x"],
  ["ß", "f", "j", "ä", "ü"],
  ["zz", "f", "j"],
  STARTPUNKT_FOLGE.slice(0, 13),
  STARTPUNKT_FOLGE.slice(0, 14),
  STARTPUNKT_FOLGE.slice(0, 31),
  STARTPUNKT_FOLGE.slice(0, 50),
  [...STARTPUNKT_FOLGE],
];

const TEXTE = [
  "fjdk",
  "salat da",
  "Lass das",
  "die Kinder lesen",
  "Hallo, wie geht es?",
  "Straße 12",
  "the quick brown fox",
  "Größe: 3 € (ca.)",
  "x = [1, 2]",
  "äöü ÄÖÜ ß",
  "Mit Käse!",
  "",
];

const sortiert = (s: Iterable<string>) => [...s].sort();

function aufnahme(): unknown {
  const fester: Record<string, unknown> = {
    LETTER_ORDER,
    INTRO_ORDER,
    PUNCT_ORDER,
    DIGIT_ORDER,
    SYMBOL_ORDER,
    SHIFT_UNIT,
    LETTERS_BEFORE_SHIFT,
    HOME_ROW_LETTERS,
    INITIAL_LETTERS,
    HOME_KEYS: sortiert(A.homeKeys()),
    TIER_CHARS: A.tierChars().map((t) => [...t]),
    allowedForTier: TIERS.map((t) => sortiert(A.allowedForTier(t))),
    minTierFor: TEXTE.map((t) => [t, A.minTierFor(t)]),
    tierOfChar: [...STARTPUNKT_FOLGE, "A", "Ö", " ", "_", "\\"].map((c) => [c, A.tierOfChar(c)]),
    NIVEAU_DEFS: A.niveauDefs().map((n) => ({
      key: n.key,
      label: n.label,
      kurz: n.kurz,
      einheiten: [...n.einheiten],
      shift: n.shift,
      erklaerung: n.erklaerung,
      en: n.en,
      zeileVon: n.zeileVon,
      zeileBis: n.zeileBis,
      extra: n.extra ? [...n.extra] : null,
      zeichenVorrat: sortiert(A.zeichenVorrat(n.key)),
    })),
  };

  const jeTastatur: Record<string, unknown> = {};
  for (const layout of LAYOUTS) {
    setLayout(layout);
    const leer = emptyProgress();
    const weit: TypingProgress = { ...emptyProgress(), introduced: A.introducedUpTo(40) };
    jeTastatur[layout] = {
      introOrder: A.introOrder(),
      defaultIntroduced: A.defaultIntroduced(),
      ensureIntroduced: STAENDE.map((s) => A.ensureIntroduced(s)),
      nextLetter: STAENDE.filter((s): s is string[] => !!s).map((s) => A.nextLetter(s)),
      advanceIntroduced: STAENDE.filter((s): s is string[] => !!s).map((s) =>
        A.advanceIntroduced(s),
      ),
      introducedUpTo: Array.from({ length: 76 }, (_, n) => A.introducedUpTo(n)),
      startPointsDe: A.startPoints("de"),
      startPointsEn: A.startPoints("en"),
      startpunktAngleichen: [undefined, 0, 2, 8, 14, 22, 40, 999].flatMap((u) =>
        STAENDE.map((s) => A.startpunktAngleichen(s, u)),
      ),
      startpunktAnwenden: [
        [undefined, undefined, undefined],
        [8, 0, undefined],
        [8, 1000, undefined],
        [8, 1000, { units: 8, am: 1000 }],
        [22, 2000, { units: 8, am: 1000 }],
        [3, 3000, { units: 22, am: 2000 }],
        [40, 0, { units: 22, am: 0 }],
      ].flatMap(([u, am, v]) =>
        STAENDE.map((s) =>
          A.startpunktAnwenden(
            s,
            u as number | undefined,
            am as number | undefined,
            v as { units?: number; am?: number } | undefined,
          ),
        ),
      ),
      keyDifficulty: STARTPUNKT_FOLGE.map((u) => [u, A.keyDifficulty(u)]),
      lektionen: LESSONS.map((l) => ({
        id: l.id,
        unlockedKeysWith: [undefined, ["f", "j"], A.introducedUpTo(30)].map((s) =>
          sortiert(A.unlockedKeysWith(l.id, s)),
        ),
        introducedThroughLesson: A.introducedThroughLesson(undefined, l.id),
        introducedThroughLessonWeit: A.introducedThroughLesson(A.introducedUpTo(40), l.id),
        lessonDoneByStoff: A.lessonDoneByStoff(leer, l.id),
      })),
      lessonsDoneCount: [A.lessonsDoneCount(leer), A.lessonsDoneCount(weit)],
      nextGoals: [leer, weit].map((p) =>
        A.nextGoals(p).map((g) => ({ id: g.def.id, have: g.have, need: g.need, unit: g.unit })),
      ),
    };
  }
  setLayout("de");
  return JSON.parse(JSON.stringify({ fester, jeTastatur }));
}

/** Objekte eingerückt, Listen je auf einer Zeile - lesbarer Unterschied, kleine Datei. */
function alsText(x: unknown, tiefe = 0): string {
  if (x === null || typeof x !== "object" || Array.isArray(x)) return JSON.stringify(x);
  const rein = " ".repeat(tiefe + 1);
  const zeilen = Object.entries(x as Record<string, unknown>).map(
    ([k, v]) => `${rein}${JSON.stringify(k)}: ${alsText(v, tiefe + 1)}`,
  );
  return `{\n${zeilen.join(",\n")}\n${" ".repeat(tiefe)}}`;
}

describe("★★★★★ Lernweg „de\" - Byte für Byte wie vor dem Umbau (E1)", () => {
  afterAll(() => setLayout("de"));

  it("die Aufnahme ist deterministisch (zweimal gerechnet, gleich)", () => {
    expect(aufnahme()).toEqual(aufnahme());
  });

  it("alle Reihenfolge-Funktionen liefern für alle vier Tastaturen dasselbe wie vorher", () => {
    const jetzt = aufnahme();
    if (process.env.LERNWEG_GOLDEN_AUFNEHMEN === "1") {
      mkdirSync(dirname(DATEI), { recursive: true });
      writeFileSync(DATEI, alsText(jetzt) + "\n", "utf8");
    }
    expect(existsSync(DATEI), `Aufnahme fehlt: ${DATEI}`).toBe(true);
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    expect(jetzt).toEqual(vorher);
  });

  it("die deutschen Konstanten SIND der Weg de (keine zweite Liste)", () => {
    expect(tierChars("de")).toEqual(TIER_CHARS);
    expect(niveauDefs("de")).toBe(NIVEAU_DEFS);
    expect(lernwegDef("de").homeKeys).toBe(HOME_KEYS);
    expect(lernwegDef("de").introOrder).toBe(INTRO_ORDER);
    expect(lernwegDef("de").letterOrder).toBe(LETTER_ORDER);
  });

  it("die Aufnahme ist nicht leer (Gegenprobe: sie misst wirklich etwas)", () => {
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    expect(vorher.jeTastatur.de.introOrder).toEqual(INTRO_ORDER);
    expect(vorher.jeTastatur.ch.introOrder).not.toContain("ß");
    expect(vorher.jeTastatur.us.introOrder).not.toContain("ö");
    expect(vorher.jeTastatur.de.introducedUpTo).toHaveLength(76);
    expect(vorher.jeTastatur.de.startPointsDe).toHaveLength(7);
    expect(vorher.fester.NIVEAU_DEFS.length).toBeGreaterThanOrEqual(8);
  });
});
