/**
 * ★★★★★ WÄCHTER: Der Lernweg „fr" bleibt Byte für Byte, wie er heute ist -
 * VOR dem Gerüst des vierten Weges „es" aufgenommen (ES-F1).
 *
 * BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md §2 („Wächter vorher (F1): Golden-
 * Tests für de, en UND fr") und BAUPLAN-2026-09-26-NEUE-SPRACHE-EFFIZIENT.md
 * §4 W1: Französisch ist seit dem 26.09.2026 ein FERTIGER Weg (live) - der
 * Umbau auf „es" (208 Weichen laut Bauplan §2) darf daran nichts ändern.
 * Vorbild für Aufbau und Verfahren: `tests/tastenflow-lernweg-en-
 * unveraendert.test.ts` (dort ausführlich erklärt) - hier für Weg „fr" statt
 * „en", und für FÜNF statt vier Tastaturen (die Pflicht-Tastaturen des
 * Bauplans: `fr`, `be`, `ch-fr`, `ca-csa`, `ca-fr`).
 *
 * ── WAS SICH BEIM „es"-UMBAU ÄNDERN DARF ────────────────────────────────────
 * Nur der Block „AUFRUFE" unten: Dort werden die Funktionen mit
 * `lernweg = "fr"` aufgerufen. Die Aufnahme (`aufnahme`) und die Fixture-
 * Datei bleiben unberührt. Wird dieser Test rot, ist das ein HALT-SIGNAL -
 * den Code reparieren, NIE die Fixture-Datei neu schreiben.
 *
 * Neu aufnehmen (nur nach einer mit Johannes/dem Chat besprochenen, bewussten
 * Änderung an Weg „fr"): `npx tsx scripts/erzeuge-golden-fr.mts` (siehe dort),
 * oder einzeln: `LERNWEG_FR_GOLDEN_AUFNEHMEN=1 npx vitest run --maxWorkers=2
 * --minWorkers=1 tests/tastenflow-lernweg-fr-unveraendert.test.ts`.
 *
 * ── DIE FÜNF TASTATUREN, NICHT VIER (Leitfaden Falle 4) ─────────────────────
 * Stichproben decken die Reihenfolge auf ALLEN fünf Pflicht-Tastaturen ab -
 * `ca-csa`/`ca-fr` unterscheiden sich von `fr`/`be` in der Grundreihe
 * (`achteGrundtasteFuerLayout`, letters.ts), `ch-fr` ebenso. Ein Fehler, der
 * nur eine Nicht-AZERTY-Tastatur trifft, wäre mit nur „fr"/„be" unsichtbar.
 */
import { afterAll, describe, expect, it } from "vitest";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  SHIFT_UNIT,
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
  startpunktFolge,
} from "../src/lib/typing/letters";
import {
  TIERS,
  allowedForTier,
  minTierFor,
  tierChars,
  tierOfChar,
  type Tier,
} from "../src/lib/typing/tiers";
import { niveauDefs, zeichenVorrat, type ProbenNiveau } from "../src/lib/typing/schreibprobe";
import { lernwegDef, LERNWEGE, type Lernweg } from "../src/lib/typing/lernweg";
import {
  lektionenFuer,
  introducedThroughLesson,
  lessonDoneByStoff,
  lessonsDoneCount,
  unlockedKeysWith,
} from "../src/lib/typing/curriculum";
import { nextGoals } from "../src/lib/typing/badges";
import { emptyProgress, type TypingProgress } from "../src/lib/typing/progress";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";

const DATEI = resolve(__dirname, "fixtures/tastenflow-lernweg-fr-golden.json");

// ── AUFRUFE ──────────────────────────────────────────────────────────────────
// Der EINZIGE Teil, der sich mit dem „es"-Umbau ändern darf - aufgenommen
// wurde die Datei VOR dem Umbau, mit dem Lernweg „fr".
const W: Lernweg = "fr";
const A = {
  introOrder: () => introOrder(W),
  defaultIntroduced: () => defaultIntroduced(W),
  ensureIntroduced: (x: string[] | undefined) => ensureIntroduced(x, W),
  nextLetter: (x: string[]) => nextLetter(x, W),
  introducedUpTo: (n: number) => introducedUpTo(n, W),
  startPointsDe: () => startPoints("de", W),
  startPointsEn: () => startPoints("en", W),
  startPointsFr: () => startPoints("fr", W),
  startpunktAngleichen: (x: string[] | undefined, u: number | undefined) =>
    startpunktAngleichen(x, u, W),
  startpunktAnwenden: (
    x: string[] | undefined,
    u: number | undefined,
    am: number | undefined,
    v: { units?: number; am?: number } | undefined,
  ) => startpunktAnwenden(x, u, am, v, W),
  advanceIntroduced: (x: string[]) => advanceIntroduced(x, {}, W),
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

/** Die fünf Pflicht-Tastaturen des Weges „fr" (Bauplan §3, curriculumFr.ts FR_LAYOUTS). */
const LAYOUTS: LayoutId[] = ["fr", "be", "ch-fr", "ca-csa", "ca-fr"];

/** Die volle Einführungsreihenfolge von Weg „fr" - unabhängig vom Test-Layout
 *  (wie `EN_INTRO_ORDER_US` im „en"-Wächter), nur zum Bauen der Stichproben. */
const FR_INTRO_ORDER: string[] = (() => {
  setLayout("fr");
  const order = introOrder("fr");
  setLayout("de");
  return order;
})();
// ★ D-1 (28.09.2026): Die Stichproben (Stände, Zeichenlisten) kommen aus der
// Folge VOR D-1 (`startpunktFolge`) - so füttert der Wächter dieselben Stände
// wie bei der Aufnahme, und jede Änderung in der Datei ist eine Änderung der
// Funktionen, nicht der Stichproben.
const FR_INTRO_ORDER_VOR_D1: string[] = (() => {
  setLayout("fr");
  const order = startpunktFolge("fr");
  setLayout("de");
  return order;
})();

// Nahtstellen dynamisch finden (Leitfaden Falle 4: Stichproben nur bis zu den
// Buchstaben hätten eine geänderte Satzzeichen-/Ziffern-/Sonderzeichen-Zeile
// nie geprüft - genau der Fund, der beim „en"-Wächter nachgebessert wurde).
const FR_DIGIT_SET = new Set(lernwegDef("fr").digitOrder);
const FR_SYMBOL_SET = new Set(lernwegDef("fr").symbolOrder);
const NACH_SATZZEICHEN = FR_INTRO_ORDER_VOR_D1.findIndex((u) => FR_DIGIT_SET.has(u));
const NACH_ZIFFERN = FR_INTRO_ORDER_VOR_D1.findIndex((u) => FR_SYMBOL_SET.has(u));

/** Stichproben für die Funktionen, die einen Stand bekommen - von leer bis
 *  ganz voll, mit den beiden Nahtstellen dazwischen (Falle 4). */
const STAENDE: (string[] | undefined)[] = [
  undefined,
  [],
  ["f"],
  ["j", "f"],
  ["f", "j", "d"],
  ["f", "j", "s", "q"],
  ["'", "f", "j", "e", "t"],
  ["zz", "f", "j"],
  FR_INTRO_ORDER_VOR_D1.slice(0, 8), // Grundreihe fertig
  FR_INTRO_ORDER_VOR_D1.slice(0, 16), // T1-Grenze
  FR_INTRO_ORDER_VOR_D1.slice(0, 21), // vor der Umschalttaste
  FR_INTRO_ORDER_VOR_D1.slice(0, 24), // T2-Grenze (nach Umschalttaste verschoben)
  FR_INTRO_ORDER_VOR_D1.slice(0, 34), // alle Buchstaben, vor den Satzzeichen
  FR_INTRO_ORDER_VOR_D1.slice(0, NACH_SATZZEICHEN), // Satzzeichen fertig, Ziffern noch nicht
  FR_INTRO_ORDER_VOR_D1.slice(0, NACH_ZIFFERN), // Ziffern fertig, Sonderzeichen noch nicht
  [...FR_INTRO_ORDER_VOR_D1], // ganz voll
];

/** Französische Beispielzeilen - decken Akzente, Satz-/Sonderzeichen ab. */
const TEXTE = [
  "fjdk",
  "salade",
  "Laisse ça",
  "les enfants lisent",
  "Bonjour, comment ça va ?",
  "Rue 12",
  "le renard brun",
  "Taille : 3 € (env.)",
  "x = [1, 2]",
  "àéèçù ÀÉÈÇÙ ¨",
  "Avec du fromage !",
  "",
];

const sortiert = (s: Iterable<string>) => [...s].sort();

function aufnahme(): unknown {
  const def = lernwegDef(W);
  const fester: Record<string, unknown> = {
    letterOrder: def.letterOrder,
    introOrder: def.introOrder,
    punctOrder: def.punctOrder,
    digitOrder: def.digitOrder,
    symbolOrder: def.symbolOrder,
    shiftUnit: SHIFT_UNIT,
    lettersBeforeShift: def.lettersBeforeShift,
    homeRowLetters: def.homeRowLetters,
    initialLetters: def.initialLetters,
    tierCuts: def.tierCuts,
    HOME_KEYS: sortiert(A.homeKeys()),
    TIER_CHARS: A.tierChars().map((t) => [...t]),
    allowedForTier: TIERS.map((t) => sortiert(A.allowedForTier(t))),
    minTierFor: TEXTE.map((t) => [t, A.minTierFor(t)]),
    tierOfChar: [...FR_INTRO_ORDER_VOR_D1, "A", "É", " ", "_", "\\"].map((c) => [c, A.tierOfChar(c)]),
    NIVEAU_DEFS: A.niveauDefs().map((n) => ({
      key: n.key,
      label: n.label,
      kurz: n.kurz,
      einheiten: [...n.einheiten],
      shift: n.shift,
      erklaerung: n.erklaerung,
      en: n.en,
      fr: n.fr,
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
    const weit: TypingProgress = { ...emptyProgress(), introduced: A.introducedUpTo(24) };
    jeTastatur[layout] = {
      introOrder: A.introOrder(),
      defaultIntroduced: A.defaultIntroduced(),
      ensureIntroduced: STAENDE.map((s) => A.ensureIntroduced(s)),
      nextLetter: STAENDE.filter((s): s is string[] => !!s).map((s) => A.nextLetter(s)),
      advanceIntroduced: STAENDE.filter((s): s is string[] => !!s).map((s) =>
        A.advanceIntroduced(s),
      ),
      introducedUpTo: Array.from({ length: A.introOrder().length + 5 }, (_, n) =>
        A.introducedUpTo(n),
      ),
      startPointsDe: A.startPointsDe(),
      startPointsEn: A.startPointsEn(),
      startPointsFr: A.startPointsFr(),
      startpunktAngleichen: [undefined, 0, 2, 8, 16, 21, 24, 999].flatMap((u) =>
        STAENDE.map((s) => A.startpunktAngleichen(s, u)),
      ),
      startpunktAnwenden: [
        [undefined, undefined, undefined],
        [8, 0, undefined],
        [8, 1000, undefined],
        [8, 1000, { units: 8, am: 1000 }],
        [21, 2000, { units: 8, am: 1000 }],
        [3, 3000, { units: 21, am: 2000 }],
        [24, 0, { units: 21, am: 0 }],
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
      keyDifficulty: FR_INTRO_ORDER_VOR_D1.map((u) => [u, A.keyDifficulty(u)]),
      lektionen: lektionenFuer(W).map((l) => ({
        id: l.id,
        unlockedKeysWith: [undefined, ["f", "j"], A.introducedUpTo(24)].map((s) =>
          sortiert(A.unlockedKeysWith(l.id, s)),
        ),
        introducedThroughLesson: A.introducedThroughLesson(undefined, l.id),
        introducedThroughLessonWeit: A.introducedThroughLesson(A.introducedUpTo(24), l.id),
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

describe("★★★★★ Lernweg „fr\" - Byte für Byte wie vor dem „es\"-Umbau (ES-F1)", () => {
  afterAll(() => setLayout("de"));

  it("die Aufnahme ist deterministisch (zweimal gerechnet, gleich)", () => {
    expect(aufnahme()).toEqual(aufnahme());
  });

  it("alle Reihenfolge-Funktionen liefern für alle fünf Tastaturen dasselbe wie vorher", () => {
    const jetzt = aufnahme();
    if (process.env.LERNWEG_FR_GOLDEN_AUFNEHMEN === "1") {
      mkdirSync(dirname(DATEI), { recursive: true });
      writeFileSync(DATEI, alsText(jetzt) + "\n", "utf8");
    }
    expect(existsSync(DATEI), `Aufnahme fehlt: ${DATEI}`).toBe(true);
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    expect(jetzt).toEqual(vorher);
  });

  it("Weg „fr\" ist wirklich eine eigene Tabelle - nicht dieselbe wie „de\"/„en\"", () => {
    expect(LERNWEGE.fr.letterOrder).not.toEqual(LERNWEGE.de.letterOrder);
    expect(LERNWEGE.fr.letterOrder).not.toEqual(LERNWEGE.en.letterOrder);
    expect(LERNWEGE.fr.punctOrder).not.toEqual(LERNWEGE.de.punctOrder);
    expect(LERNWEGE.fr.tierCuts).not.toEqual(LERNWEGE.de.tierCuts);
    expect(lernwegDef("fr").homeKeys).not.toBe(lernwegDef("de").homeKeys);
  });

  it("die fünf Tastaturen unterscheiden sich wirklich in der Grundreihe (Gegenprobe: es wird wirklich je Tastatur gemessen)", () => {
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    const grundreihe = (l: string) => vorher.jeTastatur[l].introOrder.slice(0, 8);
    expect(grundreihe("fr")).toEqual(grundreihe("be"));
    expect(grundreihe("fr")).not.toEqual(grundreihe("ch-fr"));
    expect(grundreihe("fr")).not.toEqual(grundreihe("ca-csa"));
  });

  it("die Aufnahme ist nicht leer (Gegenprobe: sie misst wirklich etwas)", () => {
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    expect(vorher.jeTastatur.fr.introOrder).toEqual(FR_INTRO_ORDER);
    expect(vorher.jeTastatur.fr.introOrder).toContain("é");
    expect(vorher.jeTastatur.fr.introOrder).toContain("€");
    expect(vorher.jeTastatur.fr.introducedUpTo.length).toBe(
      vorher.jeTastatur.fr.introOrder.length + 5,
    );
    expect(vorher.jeTastatur.fr.startPointsDe).toHaveLength(7);
    expect(vorher.jeTastatur.fr.startPointsFr).toHaveLength(7);
    expect(vorher.fester.NIVEAU_DEFS.length).toBeGreaterThanOrEqual(6);
    expect(vorher.jeTastatur.fr.lektionen.length).toBeGreaterThan(0);
  });

  it("deckt die Nahtstellen Satzzeichen/Ziffern/Sonderzeichen ab (wie beim „en\"-Wächter, Falle 4)", () => {
    expect(NACH_SATZZEICHEN).toBeGreaterThan(21);
    expect(NACH_ZIFFERN).toBeGreaterThan(NACH_SATZZEICHEN);
    expect(NACH_ZIFFERN).toBeLessThan(FR_INTRO_ORDER.length);
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    const ensureLaengen = vorher.jeTastatur.fr.ensureIntroduced.map((s: string[]) => s.length);
    expect(ensureLaengen).toContain(NACH_SATZZEICHEN);
    expect(ensureLaengen).toContain(NACH_ZIFFERN);
  });
});
