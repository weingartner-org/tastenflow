/**
 * ★★★★★ WÄCHTER: Der Lernweg „es" bleibt Byte für Byte, wie er heute ist -
 * VOR dem Umbau auf das Sprachregister aufgenommen (Etappe G1a,
 * BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md §4).
 *
 * Spanisch ist ein FERTIGER Weg (live). Der Umbau, der die Sprach-Weichen
 * (279 Stellen) in ein Register zieht, darf daran nichts ändern - für „es"
 * fehlte der Schutz, den „de", „en" und „fr" schon haben. Vorbild für Aufbau
 * und Verfahren: `tests/tastenflow-lernweg-fr-unveraendert.test.ts`
 * (BEFUND-2026-09-27-ES-F1-GOLDEN-FR.md) - hier für Weg „es" und seine ZWEI
 * Pflicht-Tastaturen (`es` Spanien, `latam` Lateinamerika).
 *
 * ── WAS SICH BEIM UMBAU ÄNDERN DARF ─────────────────────────────────────────
 * Nur der Block „AUFRUFE" unten: Dort werden die Funktionen mit
 * `lernweg = "es"` aufgerufen. Die Aufnahme (`aufnahme`) und die Fixture
 * bleiben unberührt. Wird dieser Test rot, ist das ein HALT-SIGNAL - den Code
 * reparieren, NIE die Fixture neu schreiben.
 *
 * Neu aufnehmen (nur nach einer mit Johannes/dem Chat besprochenen, bewussten
 * Änderung an Weg „es"): `LERNWEG_ES_GOLDEN_AUFNEHMEN=1 npx vitest run
 * --maxWorkers=2 --minWorkers=1 tests/tastenflow-lernweg-es-unveraendert.test.ts`
 *
 * ── WAS ER ZUSÄTZLICH ZUM FR-VORBILD PRÜFT ──────────────────────────────────
 *  · Die PAAR-EINHEITEN ¿/? und ¡/! (`paareGemeinsam`): Stände MITTEN im Paar
 *    (nur ¿, nur ¡) gehen durch jede Funktion, und der ganze Aufstieg
 *    (`advanceIntroduced` Schritt für Schritt bis zum Ende, mit
 *    `neuFreigeschaltet`) ist aufgenommen - ein Paar darf nie halbiert werden.
 *  · Die Folge nach D-1 (`introOrder`: `.` `,` direkt nach ⇧) UND die
 *    Startpunkt-Zählung vor D-1 (`startpunktFolge`) - je Tastatur.
 *  · Die Tastaturen unterscheiden sich wirklich: Lateinamerika hat kein „€"
 *    (70 statt 71 Einheiten) - ein Fehler, der nur eine Tastatur trifft, wäre
 *    mit nur „es" unsichtbar (Leitfaden Falle 4).
 *  · Die Stände reichen bis zu den SPÄTEN Zeilen (Satzzeichen, Ziffern,
 *    Sonderzeichen mit Apostroph) - nicht nur bis zu den Buchstaben.
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
  neuFreigeschaltet,
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

const DATEI = resolve(__dirname, "fixtures/tastenflow-lernweg-es-golden.json");

// ── AUFRUFE ──────────────────────────────────────────────────────────────────
// Der EINZIGE Teil, der sich mit dem Umbau ändern darf - aufgenommen wurde die
// Datei VOR dem Umbau (Stand b4696e11), mit dem Lernweg „es".
const W: Lernweg = "es";
const A = {
  introOrder: () => introOrder(W),
  startpunktFolge: () => startpunktFolge(W),
  defaultIntroduced: () => defaultIntroduced(W),
  ensureIntroduced: (x: string[] | undefined) => ensureIntroduced(x, W),
  nextLetter: (x: string[]) => nextLetter(x, W),
  introducedUpTo: (n: number) => introducedUpTo(n, W),
  startPointsDe: () => startPoints("de", W),
  startPointsEn: () => startPoints("en", W),
  startPointsFr: () => startPoints("fr", W),
  startPointsEs: () => startPoints("es", W),
  startpunktAngleichen: (x: string[] | undefined, u: number | undefined) =>
    startpunktAngleichen(x, u, W),
  startpunktAnwenden: (
    x: string[] | undefined,
    u: number | undefined,
    am: number | undefined,
    v: { units?: number; am?: number } | undefined,
  ) => startpunktAnwenden(x, u, am, v, W),
  advanceIntroduced: (x: string[], rundenOhneTaste?: number) =>
    advanceIntroduced(x, {}, W, undefined, rundenOhneTaste),
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

/** Die zwei spanischen Pflicht-Tastaturen (layouts.ts SPANISCHE_LAYOUT_IDS). */
const LAYOUTS: LayoutId[] = ["es", "latam"];

/** Die volle Einführungsreihenfolge von Weg „es" auf der Tastatur Spanien -
 *  nur zum Bauen der Stichproben (wie `FR_INTRO_ORDER` im fr-Wächter). */
const ES_INTRO_ORDER: string[] = (() => {
  setLayout("es");
  const order = introOrder("es");
  setLayout("de");
  return order;
})();
// ★ D-1 (28.09.2026): Die Stände kommen aus der Zählung VOR D-1
// (`startpunktFolge`) - so füttert der Wächter dieselben Stände wie bei der
// Aufnahme, und jede Änderung in der Datei ist eine Änderung der Funktionen,
// nicht der Stichproben.
const ES_FOLGE: string[] = (() => {
  setLayout("es");
  const order = startpunktFolge("es");
  setLayout("de");
  return order;
})();

// Nahtstellen dynamisch finden (Leitfaden Falle 4: Stichproben nur bis zu den
// Buchstaben hätten eine geänderte Satzzeichen-/Ziffern-/Sonderzeichen-Zeile
// nie geprüft).
const ES_DIGIT_SET = new Set(lernwegDef("es").digitOrder);
const ES_SYMBOL_SET = new Set(lernwegDef("es").symbolOrder);
const NACH_SATZZEICHEN = ES_FOLGE.findIndex((u) => ES_DIGIT_SET.has(u));
const NACH_ZIFFERN = ES_FOLGE.findIndex((u) => ES_SYMBOL_SET.has(u));
/** Die Paar-Einheiten (¿/? und ¡/!): Stände direkt VOR dem Paar, MITTEN im Paar, NACH dem Paar. */
const I_FRAGE = ES_FOLGE.indexOf("¿");
const I_RUF = ES_FOLGE.indexOf("¡");

/** Stichproben für die Funktionen, die einen Stand bekommen - von leer bis
 *  ganz voll, mit den Nahtstellen und MITTEN IM PAAR dazwischen (Falle 4). */
const STAENDE: (string[] | undefined)[] = [
  undefined,
  [],
  ["f"],
  ["j", "f"],
  ["f", "j", "d"],
  ["f", "j", "s", "a"],
  ["'", "f", "j", "e", "t"],
  ["zz", "f", "j"],
  ES_FOLGE.slice(0, 8), // Grundreihe fertig (f j d k s l a ñ)
  ES_FOLGE.slice(0, 17), // T1-Grenze
  ES_FOLGE.slice(0, 18), // vor der Umschalttaste
  ES_FOLGE.slice(0, 19), // T1 + ⇧
  ES_FOLGE.slice(0, 25), // T2-Grenze
  ES_FOLGE.slice(0, 30), // alle Buchstaben, vor den Satzzeichen
  ES_FOLGE.slice(0, I_FRAGE), // vor dem Paar ¿ ?
  ES_FOLGE.slice(0, I_FRAGE + 1), // MITTEN im Paar: ¿ ohne ?
  ES_FOLGE.slice(0, I_FRAGE + 2), // Paar komplett
  ES_FOLGE.slice(0, I_RUF), // vor dem Paar ¡ !
  ES_FOLGE.slice(0, I_RUF + 1), // MITTEN im Paar: ¡ ohne !
  ES_FOLGE.slice(0, NACH_SATZZEICHEN), // Satzzeichen fertig, Ziffern noch nicht
  ES_FOLGE.slice(0, NACH_ZIFFERN), // Ziffern fertig, Sonderzeichen noch nicht
  ES_FOLGE.slice(0, NACH_ZIFFERN + 5), // Sonderzeichen halb
  [...ES_FOLGE], // ganz voll (mit Apostroph als letzter Einheit)
];

/** Spanische Beispielzeilen - decken Akzente, ñ, ü, ¿ ¡, Satz-/Sonderzeichen ab. */
const TEXTE = [
  "fjdk",
  "salsa",
  "La niña come",
  "los niños leen",
  "¿Qué hora es?",
  "¡Hola, amigo!",
  "Calle 12",
  "el pingüino azul",
  "Precio: 3 € (aprox.)",
  "x = [1, 2]",
  "áéíóúü ÁÉÍÓÚÜ Ñ ñ",
  "¡Qué rico! ¿Quieres más?",
  "d'Artagnan",
  "",
];

const sortiert = (s: Iterable<string>) => [...s].sort();

function aufnahme(): unknown {
  const def = lernwegDef(W);
  const fester: Record<string, unknown> = {
    letterOrder: def.letterOrder,
    introOrder: def.introOrder,
    startpunktFolge: def.startpunktFolge,
    punctOrder: def.punctOrder,
    digitOrder: def.digitOrder,
    symbolOrder: def.symbolOrder,
    shiftUnit: SHIFT_UNIT,
    lettersBeforeShift: def.lettersBeforeShift,
    homeRowLetters: def.homeRowLetters,
    initialLetters: def.initialLetters,
    tierCuts: def.tierCuts,
    paareGemeinsam: def.paareGemeinsam ?? null,
    totastenZiele: def.totastenZiele ?? null,
    hauptsprache: def.hauptsprache ?? null,
    HOME_KEYS: sortiert(A.homeKeys()),
    TIER_CHARS: A.tierChars().map((t) => [...t]),
    allowedForTier: TIERS.map((t) => sortiert(A.allowedForTier(t))),
    minTierFor: TEXTE.map((t) => [t, A.minTierFor(t)]),
    tierOfChar: [...ES_FOLGE, "A", "Á", "Ñ", " ", "_", "\\"].map((c) => [c, A.tierOfChar(c)]),
    NIVEAU_DEFS: A.niveauDefs().map((n) => ({
      key: n.key,
      label: n.label,
      kurz: n.kurz,
      einheiten: [...n.einheiten],
      shift: n.shift,
      erklaerung: n.erklaerung,
      en: n.en,
      fr: n.fr,
      es: n.es,
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
    // Der ganze Aufstieg Schritt für Schritt (jede Runde bereit): welche
    // Einheit(en) kommen mit jedem Schritt - ein Paar kommt NIE halb.
    const aufstieg: string[][] = [];
    let stand = A.defaultIntroduced();
    for (let i = 0; i < 100; i++) {
      const naechster = A.advanceIntroduced(stand, 99);
      if (naechster === stand) break;
      aufstieg.push(neuFreigeschaltet(stand, naechster));
      stand = naechster;
    }
    jeTastatur[layout] = {
      introOrder: A.introOrder(),
      startpunktFolge: A.startpunktFolge(),
      defaultIntroduced: A.defaultIntroduced(),
      ensureIntroduced: STAENDE.map((s) => A.ensureIntroduced(s)),
      nextLetter: STAENDE.filter((s): s is string[] => !!s).map((s) => A.nextLetter(s)),
      advanceIntroduced: STAENDE.filter((s): s is string[] => !!s).map((s) =>
        A.advanceIntroduced(s),
      ),
      advanceIntroducedBereit: STAENDE.filter((s): s is string[] => !!s).map((s) =>
        A.advanceIntroduced(s, 99),
      ),
      aufstieg,
      aufstiegEnde: stand,
      introducedUpTo: Array.from({ length: A.introOrder().length + 5 }, (_, n) =>
        A.introducedUpTo(n),
      ),
      startPointsDe: A.startPointsDe(),
      startPointsEn: A.startPointsEn(),
      startPointsFr: A.startPointsFr(),
      startPointsEs: A.startPointsEs(),
      startpunktAngleichen: [undefined, 0, 2, 8, 18, 19, 30, 42, 52, 999].flatMap((u) =>
        STAENDE.map((s) => A.startpunktAngleichen(s, u)),
      ),
      startpunktAnwenden: [
        [undefined, undefined, undefined],
        [8, 0, undefined],
        [8, 1000, undefined],
        [8, 1000, { units: 8, am: 1000 }],
        [19, 2000, { units: 8, am: 1000 }],
        [3, 3000, { units: 19, am: 2000 }],
        [24, 0, { units: 19, am: 0 }],
        [52, 5000, { units: 42, am: 4000 }],
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
      keyDifficulty: ES_FOLGE.map((u) => [u, A.keyDifficulty(u)]),
      lektionen: lektionenFuer(W).map((l) => ({
        id: l.id,
        kind: l.kind,
        newKeys: [...l.newKeys],
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

describe("★★★★★ Lernweg „es\" - Byte für Byte wie vor dem Sprachregister-Umbau (G1a)", () => {
  afterAll(() => setLayout("de"));

  it("die Aufnahme ist deterministisch (zweimal gerechnet, gleich)", () => {
    expect(aufnahme()).toEqual(aufnahme());
  });

  it("alle Reihenfolge-Funktionen liefern für beide Tastaturen dasselbe wie vorher", () => {
    const jetzt = aufnahme();
    if (process.env.LERNWEG_ES_GOLDEN_AUFNEHMEN === "1") {
      mkdirSync(dirname(DATEI), { recursive: true });
      writeFileSync(DATEI, alsText(jetzt) + "\n", "utf8");
    }
    expect(existsSync(DATEI), `Aufnahme fehlt: ${DATEI}`).toBe(true);
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    expect(jetzt).toEqual(vorher);
  });

  it("Weg „es\" ist wirklich eine eigene Tabelle - nicht dieselbe wie „de\"/„en\"/„fr\"", () => {
    for (const anderer of ["de", "en", "fr"] as const) {
      expect(LERNWEGE.es.letterOrder).not.toEqual(LERNWEGE[anderer].letterOrder);
      expect(LERNWEGE.es.punctOrder).not.toEqual(LERNWEGE[anderer].punctOrder);
    }
    expect(LERNWEGE.es.tierCuts).not.toEqual(LERNWEGE.de.tierCuts);
    expect(lernwegDef("es").homeKeys).not.toBe(lernwegDef("de").homeKeys);
  });

  it("die zwei Tastaturen unterscheiden sich wirklich (Gegenprobe: es wird je Tastatur gemessen)", () => {
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    const es: string[] = vorher.jeTastatur.es.introOrder;
    const latam: string[] = vorher.jeTastatur.latam.introOrder;
    expect(es).toContain("€");
    expect(latam).not.toContain("€");
    expect(es.length).toBe(latam.length + 1);
    // Die Grundreihe ist dieselbe (f j d k s l a ñ) - der Unterschied sitzt in den Sonderzeichen.
    expect(es.slice(0, 8)).toEqual(latam.slice(0, 8));
    expect(es.slice(0, 8)).toEqual(["f", "j", "d", "k", "s", "l", "a", "ñ"]);
  });

  it("die Paare ¿/? und ¡/! stehen nebeneinander und kommen nie halb (Aufstieg Schritt für Schritt)", () => {
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    for (const layout of LAYOUTS) {
      const t = vorher.jeTastatur[layout];
      const folge: string[] = t.introOrder;
      expect(folge[folge.indexOf("¿") + 1], `${layout}: ¿ vor ?`).toBe("?");
      expect(folge[folge.indexOf("¡") + 1], `${layout}: ¡ vor !`).toBe("!");
      const schritte: string[][] = t.aufstieg;
      expect(schritte).toContainEqual(["¿", "?"]);
      expect(schritte).toContainEqual(["¡", "!"]);
      // Kein Schritt bringt nur eine Hälfte.
      for (const s of schritte) {
        expect(s.includes("¿"), `${layout}: ${s.join()}`).toBe(s.includes("?"));
        expect(s.includes("¡"), `${layout}: ${s.join()}`).toBe(s.includes("!"));
      }
      // Der Aufstieg endet genau bei der vollen Folge dieser Tastatur.
      expect(t.aufstiegEnde).toEqual(folge);
    }
  });

  it("die Aufnahme ist nicht leer (Gegenprobe: sie misst wirklich etwas)", () => {
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    expect(vorher.jeTastatur.es.introOrder).toEqual(ES_INTRO_ORDER);
    expect(vorher.jeTastatur.es.introOrder).toContain("ñ");
    expect(vorher.jeTastatur.es.introOrder).toContain("€");
    expect(vorher.jeTastatur.es.introOrder).toContain("'");
    expect(vorher.jeTastatur.es.introducedUpTo.length).toBe(
      vorher.jeTastatur.es.introOrder.length + 5,
    );
    expect(vorher.jeTastatur.es.startPointsDe).toHaveLength(7);
    expect(vorher.jeTastatur.es.startPointsEs).toHaveLength(7);
    expect(vorher.fester.NIVEAU_DEFS.length).toBeGreaterThanOrEqual(6);
    expect(vorher.jeTastatur.es.lektionen.length).toBeGreaterThan(0);
    expect(vorher.fester.paareGemeinsam).toMatchObject({ "¿": "?", "¡": "!" });
    expect(vorher.fester.hauptsprache).toBe("es");
  });

  it("deckt die Nahtstellen Satzzeichen/Ziffern/Sonderzeichen und das Paar ab (Falle 4)", () => {
    expect(NACH_SATZZEICHEN).toBeGreaterThan(30);
    expect(NACH_ZIFFERN).toBeGreaterThan(NACH_SATZZEICHEN);
    expect(NACH_ZIFFERN).toBeLessThan(ES_INTRO_ORDER.length);
    expect(I_FRAGE).toBeGreaterThan(0);
    expect(I_RUF).toBeGreaterThan(I_FRAGE);
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    const ensureLaengen = vorher.jeTastatur.es.ensureIntroduced.map((s: string[]) => s.length);
    expect(ensureLaengen).toContain(NACH_SATZZEICHEN);
    expect(ensureLaengen).toContain(NACH_ZIFFERN);
    expect(ensureLaengen).toContain(I_FRAGE + 1); // der Stand mit ¿ allein ist aufgenommen
  });
});
