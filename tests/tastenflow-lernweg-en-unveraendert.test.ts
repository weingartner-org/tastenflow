/**
 * ★★★★★ WÄCHTER: Der Lernweg „en" bleibt Byte für Byte, wie er heute ist -
 * VOR dem Umbau auf den dritten Weg „fr" aufgenommen (E1c).
 *
 * BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md §2.3 Punkt 2 und §14 Zeile E1:
 * der englische Lehrgang ist seit 24.09. live (Freigabe
 * `BEFUND-2026-09-24-MECHANIK-DEUTSCH-ENGLISCH.md`), und der Umbau der 201
 * Weichen `x === "en" ? A : B` auf Tabellen (§2.2) darf daran NICHTS ändern -
 * still auf Deutsch zurückzufallen wäre der gefährlichste Fehler (§15 Falle 1).
 * Dieser Test ist das Gegenstück zu `tests/tastenflow-lernweg-de-
 * unveraendert.test.ts` (Vorbild für Aufbau und Verfahren, dort ausführlich
 * erklärt) - hier für Weg „en" statt „de".
 *
 * ── WAS SICH NACH DEM FRANZÖSISCH-UMBAU ÄNDERN DARF ─────────────────────────
 * Nur der Block „AUFRUFE" unten: Dort werden die Funktionen seit dem Umbau mit
 * `lernweg = "en"` aufgerufen. Die Aufnahme (`aufnahme`) und die Fixture-Datei
 * bleiben unberührt. Wird dieser Test rot, ist das ein HALT-SIGNAL - den Code
 * reparieren, NIE die Fixture-Datei neu schreiben.
 *
 * ⚠️ Die Fixture-Datei (`tests/fixtures/tastenflow-lernweg-en-golden.json`)
 * wird NIE von Hand neu geschrieben, ausser der Chat (Opus) erlaubt es
 * ausdrücklich - genau wie bei der de-Fixture. Neu aufnehmen (nur nach einer
 * mit Johannes/dem Chat besprochenen, bewussten Änderung an Weg „en"):
 * `LERNWEG_EN_GOLDEN_AUFNEHMEN=1 npx vitest run
 * tests/tastenflow-lernweg-en-unveraendert.test.ts`.
 *
 * ── NACHBESSERUNG 25.09.2026 ─────────────────────────────────────────────────
 * Derselbe blinde Fleck wie im Inhalts-Wächter (dort per Gegenprobe des Chats
 * gefunden): STAENDE sprang von n=27 (Buchstaben + Umschalttaste) direkt auf
 * den vollen Stand, und `introducedUpTo` wurde nur bis 60 gesampelt (kürzer
 * als die volle Reihenfolge, 67/68 Einheiten). Zwei neue STAENDE-Einträge
 * („nach den Satzzeichen, vor den Ziffern" / „nach den Ziffern, vor den
 * Sonderzeichen", dynamisch aus `digitOrder`/`symbolOrder` gefunden) und ein
 * dynamisches `introducedUpTo`-Ende schliessen die Lücke - siehe die Kommentare
 * an den jeweiligen Stellen unten.
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

const DATEI = resolve(__dirname, "fixtures/tastenflow-lernweg-en-golden.json");

// ── AUFRUFE ──────────────────────────────────────────────────────────────────
// Der EINZIGE Teil, der sich mit dem Umbau ändern darf - aufgenommen wurde die
// Datei VOR dem Umbau, mit dem Lernweg „en" (D1: „en" ist ein Weg wie „de",
// keine Sonderbehandlung).
const W: Lernweg = "en";
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

/** Die volle Einführungsreihenfolge von Weg „en" auf der US-Tastatur - nur zum
 *  Bauen der Stichproben unten (STAENDE), unabhängig von jedem Test-Layout. */
const EN_INTRO_ORDER_US: string[] = (() => {
  setLayout("us");
  const order = introOrder("en");
  setLayout("de");
  return order;
})();
// ★ D-1 (28.09.2026): Die Stichproben (Stände, Zeichenlisten) kommen aus der
// Folge VOR D-1 (`startpunktFolge`) - so füttert der Wächter dieselben Stände
// wie bei der Aufnahme, und jede Änderung in der Datei ist eine Änderung der
// Funktionen, nicht der Stichproben.
const EN_INTRO_ORDER_US_VOR_D1: string[] = (() => {
  setLayout("us");
  const order = startpunktFolge("en");
  setLayout("de");
  return order;
})();

// ★ Nachbesserung (Chat-Gegenprobe 25.09.2026, dieselbe Lücke wie im Inhalts-
// Wächter): STAENDE sprang bis dahin von n=27 (Buchstaben + Umschalttaste)
// direkt auf den VOLLEN Stand - kein Stand deckte „Satzzeichen fertig, Ziffern
// noch nicht" oder „Ziffern fertig, Sonderzeichen noch nicht" ab. Eine Funktion,
// die genau an einer dieser Nahtstellen falsch rechnet (z. B. `nextLetter`
// springt nach den Satzzeichen nicht zur ersten Ziffer), wäre in KEINEM Stand
// aufgefallen. Die zwei Grenzen werden dynamisch aus `digitOrder`/`symbolOrder`
// gefunden (nicht hart verdrahtet - die genaue Position hängt am Bauplan).
const EN_DIGIT_SET = new Set(lernwegDef("en").digitOrder);
const EN_SYMBOL_SET = new Set(lernwegDef("en").symbolOrder);
const NACH_SATZZEICHEN = EN_INTRO_ORDER_US_VOR_D1.findIndex((u) => EN_DIGIT_SET.has(u));
const NACH_ZIFFERN = EN_INTRO_ORDER_US_VOR_D1.findIndex((u) => EN_SYMBOL_SET.has(u));

/** Stichproben für die Funktionen, die einen Stand bekommen. */
const STAENDE: (string[] | undefined)[] = [
  undefined,
  [],
  ["f"],
  ["j", "f"],
  ["f", "j", "d"],
  ["f", "j", "s", "x"],
  [";", "f", "j", "a", "l"],
  ["zz", "f", "j"],
  EN_INTRO_ORDER_US_VOR_D1.slice(0, 8),
  EN_INTRO_ORDER_US_VOR_D1.slice(0, 16),
  EN_INTRO_ORDER_US_VOR_D1.slice(0, 23),
  EN_INTRO_ORDER_US_VOR_D1.slice(0, 27),
  EN_INTRO_ORDER_US_VOR_D1.slice(0, NACH_SATZZEICHEN), // Satzzeichen fertig, Ziffern noch nicht
  EN_INTRO_ORDER_US_VOR_D1.slice(0, NACH_ZIFFERN), // Ziffern fertig, Sonderzeichen noch nicht
  [...EN_INTRO_ORDER_US_VOR_D1],
];

const TEXTE = [
  "fjdk",
  "salad da",
  "let it go",
  "the kids read",
  "Hello, how are you?",
  "Street 12",
  "the quick brown fox",
  "Size: 3 £ (approx.)",
  "x = [1, 2]",
  "äöü ÄÖÜ ß",
  "With cheese!",
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
    tierOfChar: [...EN_INTRO_ORDER_US_VOR_D1, "A", "Ö", " ", "_", "\\"].map((c) => [c, A.tierOfChar(c)]),
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
    LESSONS_EN: lektionenFuer(W).map((l) => ({
      id: l.id,
      title: l.title,
      kind: l.kind,
      newKeys: [...l.newKeys],
      enablesShift: l.enablesShift ?? null,
      corpusKinds: l.corpusKinds ? [...l.corpusKinds] : null,
    })),
  };

  const jeTastatur: Record<string, unknown> = {};
  for (const layout of LAYOUTS) {
    setLayout(layout);
    const leer = emptyProgress();
    const weit: TypingProgress = { ...emptyProgress(), introduced: A.introducedUpTo(20) };
    jeTastatur[layout] = {
      introOrder: A.introOrder(),
      defaultIntroduced: A.defaultIntroduced(),
      ensureIntroduced: STAENDE.map((s) => A.ensureIntroduced(s)),
      nextLetter: STAENDE.filter((s): s is string[] => !!s).map((s) => A.nextLetter(s)),
      advanceIntroduced: STAENDE.filter((s): s is string[] => !!s).map((s) =>
        A.advanceIntroduced(s),
      ),
      // ★ Nachbesserung 25.09.2026: bis dahin fest 60 - kürzer als die volle
      // Reihenfolge (67 auf de/ch/us, 68 auf uk wegen „£") und liess damit die
      // letzten Sonderzeichen-Plätze aus der Stichprobe. Jetzt dynamisch bis
      // knapp über die volle Länge DIESER Tastatur (deckt auch das Anstossen
      // an die Grenze/das Klammern danach ab, wie beim de-Wächter).
      introducedUpTo: Array.from({ length: A.introOrder().length + 5 }, (_, n) =>
        A.introducedUpTo(n),
      ),
      startPointsDe: A.startPoints("de"),
      startPointsEn: A.startPoints("en"),
      startpunktAngleichen: [undefined, 0, 2, 8, 14, 22, 27, 999].flatMap((u) =>
        STAENDE.map((s) => A.startpunktAngleichen(s, u)),
      ),
      startpunktAnwenden: [
        [undefined, undefined, undefined],
        [8, 0, undefined],
        [8, 1000, undefined],
        [8, 1000, { units: 8, am: 1000 }],
        [22, 2000, { units: 8, am: 1000 }],
        [3, 3000, { units: 22, am: 2000 }],
        [27, 0, { units: 22, am: 0 }],
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
      keyDifficulty: EN_INTRO_ORDER_US_VOR_D1.map((u) => [u, A.keyDifficulty(u)]),
      lektionen: lektionenFuer(W).map((l) => ({
        id: l.id,
        unlockedKeysWith: [undefined, ["f", "j"], A.introducedUpTo(20)].map((s) =>
          sortiert(A.unlockedKeysWith(l.id, s)),
        ),
        introducedThroughLesson: A.introducedThroughLesson(undefined, l.id),
        introducedThroughLessonWeit: A.introducedThroughLesson(A.introducedUpTo(20), l.id),
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

describe("★★★★★ Lernweg „en\" - Byte für Byte wie vor dem Französisch-Umbau (E1c)", () => {
  afterAll(() => setLayout("de"));

  it("die Aufnahme ist deterministisch (zweimal gerechnet, gleich)", () => {
    expect(aufnahme()).toEqual(aufnahme());
  });

  it("alle Reihenfolge-Funktionen liefern für alle vier Tastaturen dasselbe wie vorher", () => {
    const jetzt = aufnahme();
    if (process.env.LERNWEG_EN_GOLDEN_AUFNEHMEN === "1") {
      mkdirSync(dirname(DATEI), { recursive: true });
      writeFileSync(DATEI, alsText(jetzt) + "\n", "utf8");
    }
    expect(existsSync(DATEI), `Aufnahme fehlt: ${DATEI}`).toBe(true);
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    expect(jetzt).toEqual(vorher);
  });

  it("Weg „en\" ist wirklich eine eigene Tabelle - nicht dieselbe wie „de\"", () => {
    expect(LERNWEGE.en.letterOrder).not.toEqual(LERNWEGE.de.letterOrder);
    expect(LERNWEGE.en.punctOrder).not.toEqual(LERNWEGE.de.punctOrder);
    expect(LERNWEGE.en.tierCuts).not.toEqual(LERNWEGE.de.tierCuts);
    expect(lernwegDef("en").homeKeys).not.toBe(lernwegDef("de").homeKeys);
  });

  it("die Aufnahme ist nicht leer (Gegenprobe: sie misst wirklich etwas)", () => {
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    expect(vorher.jeTastatur.us.introOrder).toEqual(EN_INTRO_ORDER_US);
    expect(vorher.jeTastatur.de.introOrder).not.toContain(";");
    expect(vorher.jeTastatur.us.introOrder).not.toContain("ö");
    expect(vorher.jeTastatur.de.introducedUpTo.length).toBe(vorher.jeTastatur.de.introOrder.length + 5);
    expect(vorher.jeTastatur.us.startPointsEn).toHaveLength(7);
    expect(vorher.fester.NIVEAU_DEFS.length).toBeGreaterThanOrEqual(6);
    expect(vorher.fester.LESSONS_EN.length).toBeGreaterThan(0);
  });

  it("deckt jetzt auch die Nahtstellen Satzzeichen/Ziffern/Sonderzeichen ab (Nachbesserung 25.09.2026)", () => {
    expect(NACH_SATZZEICHEN).toBeGreaterThan(27);
    expect(NACH_ZIFFERN).toBeGreaterThan(NACH_SATZZEICHEN);
    expect(NACH_ZIFFERN).toBeLessThan(EN_INTRO_ORDER_US.length);
    // Die beiden neuen Stände liegen wirklich in STAENDE (und damit in jedem
    // STAENDE-basierten Feld der Fixture) - nicht nur lokal berechnet.
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    const ensureLaengen = vorher.jeTastatur.us.ensureIntroduced.map((s: string[]) => s.length);
    expect(ensureLaengen).toContain(NACH_SATZZEICHEN);
    expect(ensureLaengen).toContain(NACH_ZIFFERN);
  });
});
