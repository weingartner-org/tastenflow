/**
 * ★★★★★ G1-GOLDEN (25.10.2026): GEMEINSAMER BAU der Golden-Wächter für die fertigen Wege „it", „pl", „tr", „cs" -
 * aufgenommen VOR dem Umbau für die neun neuen Lernwege (bg, el, hu, nl, pt, br, ro, sv, uk).
 *
 * Vorbild: die Wächter von Weg „es" (`tests/tastenflow-lernweg-es-unveraendert.test.ts`,
 * `tests/tastenflow-lernweg-inhalt-es-unveraendert.test.ts`, `tests/tastenflow-generator-es-unveraendert.test.ts`,
 * `BEFUND-2026-10-02-G1A-GOLDEN-ES.md`) und `tests/sprachpakete-golden.test.ts`. Die vier Wege sind gleich gebaut
 * (ein Register-Eintrag, eigene Tastaturen, Paar-Einheiten ( ) [ ] { }, Totasten bei tr/cs) - darum EIN Bau mit einer
 * Einstellung je Weg statt zwölf fast gleicher Dateien. Die Test-Dateien `tests/tastenflow-*-{it,pl,tr,cs}-unveraendert`
 * rufen nur {@link lernwegGolden}, {@link inhaltGolden} und {@link generatorGolden} mit ihrer Einstellung auf.
 *
 * ── WAS SICH BEIM UMBAU ÄNDERN DARF ─────────────────────────────────────────
 * Nur die Blöcke „AUFRUFE" unten (wie in den es-Wächtern): dort werden die Funktionen mit dem Lernweg aufgerufen.
 * Die Aufnahme-Funktionen und die Fixtures bleiben unberührt. Wird ein Wächter rot, ist das ein HALT-SIGNAL - den
 * Code reparieren, NIE die Fixture neu schreiben (ausser nach einer mit Johannes/dem Chat besprochenen Änderung
 * genau an diesem Weg; Umgebungsvariable je Datei, siehe Kopf der Test-Datei).
 *
 * ── LEITFADEN-FALLEN ────────────────────────────────────────────────────────
 *  · Falle 4: Stände bis zum VOLLEN Tastenstand (Satzzeichen, Ziffern, Sonderzeichen); die Inhalts-Aufnahme legt am
 *    vollen Stand die letzten Zeilen im Klartext ab, und ein Test verlangt, dass die späten Zeilen Ziffern, Klammern
 *    und die eigenen Zeichen des Weges wirklich tragen.
 *  · Falle 54: die Texte kommen als Sprachpakete. Im Test sind sie vorgeladen (`vite.config.ts` → `tests/sprachpakete-
 *    vorgeladen.ts`); der Inhalts-Wächter prüft ausdrücklich, dass die Aufnahme NICHT leer ist und dass ohne das Paket
 *    wirklich nichts käme (sonst bewiese er nichts).
 *  · Falle 32: `corpusItemsFor` UND `corpusEntriesFor` werden beide aufgenommen und gegeneinander geprüft.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { STUFEN, type Lang, type Stufe } from "../src/lib/typing/account";
import { arcsFor } from "../src/lib/typing/arcs";
import { nextGoals } from "../src/lib/typing/badges";
import { korpusFuer, corpusItemsFor } from "../src/lib/typing/corpus";
import { corpusEntriesFor, corpusManifestCount, corpusManifestVersion } from "../src/lib/typing/corpusManifest";
import {
  introducedThroughLesson,
  lektionenFuer,
  lessonDoneByStoff,
  lessonsDoneCount,
  unlockedKeysWith,
} from "../src/lib/typing/curriculum";
import { adaptiveRound, generateRound, wordDrillZeilen } from "../src/lib/typing/generator";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { fnv1a } from "../src/lib/typing/ledger";
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
import { lexikonGroesse, lexikonWoerter } from "../src/lib/typing/lexicon";
import { LERNWEGE_LISTE, lernwegDef, type Lernweg } from "../src/lib/typing/lernweg";
import { emptyProgress, type TypingProgress } from "../src/lib/typing/progress";
import { niveauDefs, zeichenVorrat, type ProbenNiveau } from "../src/lib/typing/schreibprobe";
import { serieLines, type Serie } from "../src/lib/typing/serie";
import { SERIEN, allowedFromIntroduced, serienForStufe, unlockedSerien } from "../src/lib/typing/serien";
import {
  _sprachpaketeVergessen,
  _sprachpaketeWiederEinsetzen,
  fehlZugriffeLeeren,
  type SprachDaten,
} from "../src/lib/typing/sprachpakete";
import { TIERS, allowedForTier, minTierFor, tierChars, tierOfChar, type Tier } from "../src/lib/typing/tiers";
import { UEBUNGSFORMEN, type FormKontext, type Uebungsform } from "../src/lib/typing/uebungsformen";
import { waehleSalatwort } from "../src/lib/typing/uebungsformen/buchstabensalat";
import { korpusQuelle } from "../src/lib/typing/uebungsformen/hilfen";
import { vorlageVorschau, vorlagenFuer } from "../src/lib/typing/vorlagen";
import type { BedienSprache } from "../src/lib/bedienSprache/sprache";
import { istGeruestSprache, type GeruestSprache } from "../src/lib/typing/sprachRegister";

// ════════════════════════════════════════════════════════════════════════════
// Einstellung je Weg
// ════════════════════════════════════════════════════════════════════════════

export interface WegEinstellung {
  /** Der Lernweg (zugleich Übungssprache und Sprachpaket). */
  W: Lernweg & Lang;
  /** Die Tastaturen des Weges (die erste ist die Haupttastatur, aus ihrer Folge kommen die Stichproben). */
  layouts: readonly LayoutId[];
  /** Beispielzeilen für `minTierFor` (eigene Buchstaben, Satz-/Sonderzeichen, Grossschreibung). */
  texte: readonly string[];
  /** Zusätzliche Zeichen für `tierOfChar` (Grossbuchstaben, Sonderfälle wie İ/I). */
  zusatzZeichen: readonly string[];
  /** Die eigenen Zeichen des Weges (Buchstaben mit Diakritika, Totasten, Apostroph) - Fokus im Generator. */
  eigeneZeichen: readonly string[];
  /** Zeichen, die am VOLLEN Stand in mindestens einer Korpus-Zeile stehen müssen (Gegenprobe Falle 4). */
  spaeteMerkmale: readonly string[];
}

// ════════════════════════════════════════════════════════════════════════════
// Gemeinsame Werkzeuge
// ════════════════════════════════════════════════════════════════════════════

const sortiert = (s: Iterable<string>): string[] => [...s].sort();

/** JSON ohne Mengen-Verlust (eine `Set` würde sonst still zu `{}`). */
/** Entfernt in einem Objekt (rekursiv) jeden Schlüssel, der eine der neun Sprachen des Gerüsts ist. */
function ohneGeruestSchluessel(x: unknown): unknown {
  if (Array.isArray(x)) return x.map(ohneGeruestSchluessel);
  if (x === null || typeof x !== "object") return x;
  return Object.fromEntries(
    Object.entries(x as Record<string, unknown>).filter(([k]) => !istGeruestSprache(k)).map(([k, v]) => [k, ohneGeruestSchluessel(v)]),
  );
}

function rein(x: unknown): unknown {
  return JSON.parse(JSON.stringify(x, (_k, v) => (v instanceof Set ? [...v] : v)));
}

/** Objekte eingerückt, Listen je auf einer Zeile - lesbarer Unterschied, kleine Datei (wie im es-Wächter). */
function alsText(x: unknown, tiefe = 0): string {
  if (x === null || typeof x !== "object" || Array.isArray(x)) return JSON.stringify(x);
  const innen = " ".repeat(tiefe + 1);
  const zeilen = Object.entries(x as Record<string, unknown>).map(
    ([k, v]) => `${innen}${JSON.stringify(k)}: ${alsText(v, tiefe + 1)}`,
  );
  return `{\n${zeilen.join(",\n")}\n${" ".repeat(tiefe)}}`;
}

function fingerabdruck(zeilen: readonly string[]): string {
  const hash = createHash("sha256");
  for (const z of zeilen) hash.update(z).update("\u0000");
  return hash.digest("hex").slice(0, 24);
}

function digest(zeilen: readonly string[]): { anzahl: number; hash: string } {
  return { anzahl: zeilen.length, hash: fingerabdruck(zeilen) };
}

const h = (x: unknown) => fnv1a(JSON.stringify(x)).toString(36);

function liesFixture(datei: string): any {
  expect(existsSync(datei), `Aufnahme fehlt: ${datei}`).toBe(true);
  return JSON.parse(readFileSync(datei, "utf8"));
}

function schreibeFixture(datei: string, text: string): void {
  mkdirSync(dirname(datei), { recursive: true });
  writeFileSync(datei, text, "utf8");
}

/** Die Nahtstellen einer Folge: nach ⇧, nach dem letzten Buchstaben, nach den Satzzeichen, nach den Ziffern. */
function nahtstellen(W: Lernweg, folge: readonly string[]) {
  const def = lernwegDef(W);
  const buchstaben = new Set(def.letterOrder);
  const ziffern = new Set(def.digitOrder);
  const symbole = new Set(def.symbolOrder);
  let nachBuchstaben = 0;
  folge.forEach((u, i) => {
    if (buchstaben.has(u)) nachBuchstaben = i + 1;
  });
  let nachZiffern = 0;
  folge.forEach((u, i) => {
    if (ziffern.has(u)) nachZiffern = i + 1;
  });
  return {
    nachShift: folge.indexOf(SHIFT_UNIT) + 1,
    nachBuchstaben,
    nachSatzzeichen: folge.findIndex((u) => ziffern.has(u)),
    nachZiffern,
    vorSymbolen: folge.findIndex((u) => symbole.has(u)),
    /** MITTEN in jedem Paar ( ) [ ] { }: der Stand mit der öffnenden Hälfte allein. */
    paarMitten: Object.keys(def.paareGemeinsam ?? {})
      .map((auf) => folge.indexOf(auf))
      .filter((i) => i >= 0)
      .map((i) => i + 1),
  };
}

// ════════════════════════════════════════════════════════════════════════════
// 1 · Lernweg: Reihenfolge, Stufen, Startpunkte, Niveaus, Lektionen, Abzeichen
// ════════════════════════════════════════════════════════════════════════════

/** Aufnahme der Reihenfolge-/Freischalt-Funktionen (Gegenstück zu `aufnahme()` im es-Wächter). */
function lernwegAufnahme(e: WegEinstellung): unknown {
  const { W } = e;
  // ── AUFRUFE ────────────────────────────────────────────────────────────────
  // Der EINZIGE Teil, der sich mit dem Umbau ändern darf (aufgenommen am 25.10.2026, Stand 933887a28).
  const A = {
    introOrder: () => introOrder(W),
    startpunktFolge: () => startpunktFolge(W),
    defaultIntroduced: () => defaultIntroduced(W),
    ensureIntroduced: (x: string[] | undefined) => ensureIntroduced(x, W),
    nextLetter: (x: string[]) => nextLetter(x, W),
    introducedUpTo: (n: number) => introducedUpTo(n, W),
    startPoints: (s: BedienSprache) => startPoints(s, W),
    startpunktAngleichen: (x: string[] | undefined, u: number | undefined) => startpunktAngleichen(x, u, W),
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
    lektionen: () => lektionenFuer(W),
    unlockedKeysWith: (id: string, x: string[] | undefined) => unlockedKeysWith(id, x, W),
    introducedThroughLesson: (x: string[] | undefined, id: string) => introducedThroughLesson(x, id, W),
    lessonDoneByStoff: (p: TypingProgress, id: string) => lessonDoneByStoff(p, id, W),
    lessonsDoneCount: (p: TypingProgress) => lessonsDoneCount(p, W),
    nextGoals: (p: TypingProgress) => nextGoals(p, W),
  };
  // ── ENDE AUFRUFE ───────────────────────────────────────────────────────────

  setLayout(e.layouts[0]);
  const FOLGE = A.startpunktFolge();
  const n = nahtstellen(W, FOLGE);
  const def = lernwegDef(W);
  const STAENDE: (string[] | undefined)[] = [
    undefined,
    [],
    ["f"],
    ["j", "f"],
    ["f", "j", "d"],
    ["f", "j", "s", "a"],
    ["'", "f", "j", "e", "t"],
    ["zz", "f", "j"],
    FOLGE.slice(0, def.homeRowLetters),
    ...def.tierCuts.flatMap((c) => [FOLGE.slice(0, c), FOLGE.slice(0, c + 1)]),
    FOLGE.slice(0, n.nachShift - 1), // vor der Umschalttaste
    FOLGE.slice(0, n.nachShift), // mit ⇧
    FOLGE.slice(0, n.nachBuchstaben), // alle Buchstaben
    ...n.paarMitten.map((i) => FOLGE.slice(0, i)), // MITTEN im Paar
    FOLGE.slice(0, n.nachSatzzeichen), // Satzzeichen fertig, Ziffern noch nicht
    FOLGE.slice(0, n.nachZiffern), // Ziffern fertig
    FOLGE.slice(0, n.nachZiffern + 5), // Sonderzeichen halb
    FOLGE.slice(0, FOLGE.length - 1), // alles bis auf die letzte Einheit
    [...FOLGE], // ganz voll
  ];

  const fester = {
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
    minTierFor: e.texte.map((t) => [t, A.minTierFor(t)]),
    tierOfChar: [...FOLGE, ...e.zusatzZeichen, " ", "_", "\\"].map((c) => [c, A.tierOfChar(c)]),
    // ★ SPRACHEN-9 (29.10.2026, O2-LIB): die Niveaus tragen jetzt auch Texte je neuer Bedienungssprache - wie bei `startPoints`
    // gehören in die Aufnahme von vorher nur die Schlüssel der acht Sprachen, die beim Festhalten da waren.
    NIVEAU_DEFS: A.niveauDefs().map((nv) => ohneGeruestSchluessel({ ...nv, zeichenVorrat: sortiert(A.zeichenVorrat(nv.key)) })),
  };

  const jeTastatur: Record<string, unknown> = {};
  for (const layout of e.layouts) {
    setLayout(layout);
    const leer = emptyProgress();
    const weit: TypingProgress = { ...emptyProgress(), introduced: A.introducedUpTo(24) };
    const voll: TypingProgress = { ...emptyProgress(), introduced: [...A.introOrder()] };
    // Der ganze Aufstieg Schritt für Schritt (jede Runde bereit) - ein Paar kommt NIE halb.
    const aufstieg: string[][] = [];
    let stand = A.defaultIntroduced();
    for (let i = 0; i < 120; i++) {
      const naechster = A.advanceIntroduced(stand, 99);
      if (naechster === stand) break;
      aufstieg.push(neuFreigeschaltet(stand, naechster));
      stand = naechster;
    }
    const mitStand = STAENDE.filter((s): s is string[] => !!s);
    jeTastatur[layout] = {
      introOrder: A.introOrder(),
      startpunktFolge: A.startpunktFolge(),
      defaultIntroduced: A.defaultIntroduced(),
      ensureIntroduced: STAENDE.map((s) => A.ensureIntroduced(s)),
      nextLetter: mitStand.map((s) => A.nextLetter(s)),
      advanceIntroduced: mitStand.map((s) => A.advanceIntroduced(s)),
      advanceIntroducedBereit: mitStand.map((s) => A.advanceIntroduced(s, 99)),
      aufstieg,
      aufstiegEnde: stand,
      introducedUpTo: Array.from({ length: A.introOrder().length + 5 }, (_, k) => A.introducedUpTo(k)),
      // ★ G2-NEUN (25.10.2026): nur die acht Wege, die beim Festhalten da waren - die neun des Gerüsts sind
      // neu und gehören nicht in die Aufnahme von vorher (sonst wüchse sie mit jeder Sprache).
      startPoints: Object.fromEntries(LERNWEGE_LISTE.filter((s) => !istGeruestSprache(s)).map((s) => [s, A.startPoints(s)])),
      startpunktAngleichen: [undefined, 0, 2, 8, 18, 19, 30, 42, 52, 60, 70, 999].flatMap((u) =>
        STAENDE.map((s) => A.startpunktAngleichen(s, u)),
      ),
      startpunktAnwenden: (
        [
          [undefined, undefined, undefined],
          [8, 0, undefined],
          [8, 1000, undefined],
          [8, 1000, { units: 8, am: 1000 }],
          [19, 2000, { units: 8, am: 1000 }],
          [3, 3000, { units: 19, am: 2000 }],
          [24, 0, { units: 19, am: 0 }],
          [52, 5000, { units: 42, am: 4000 }],
          [70, 6000, { units: 52, am: 5000 }],
        ] as [number | undefined, number | undefined, { units?: number; am?: number } | undefined][]
      ).flatMap(([u, am, v]) => STAENDE.map((s) => A.startpunktAnwenden(s, u, am, v))),
      keyDifficulty: FOLGE.map((u) => [u, A.keyDifficulty(u)]),
      lektionen: A.lektionen().map((l) => ({
        id: l.id,
        kind: l.kind,
        title: l.title,
        newKeys: [...l.newKeys],
        unlockedKeysWith: [undefined, ["f", "j"], A.introducedUpTo(24), [...A.introOrder()]].map((s) =>
          sortiert(A.unlockedKeysWith(l.id, s)),
        ),
        introducedThroughLesson: A.introducedThroughLesson(undefined, l.id),
        introducedThroughLessonWeit: A.introducedThroughLesson(A.introducedUpTo(24), l.id),
        lessonDoneByStoff: [leer, weit, voll].map((p) => A.lessonDoneByStoff(p, l.id)),
      })),
      lessonsDoneCount: [leer, weit, voll].map((p) => A.lessonsDoneCount(p)),
      nextGoals: [leer, weit, voll].map((p) =>
        A.nextGoals(p).map((g) => ({ id: g.def.id, have: g.have, need: g.need, unit: g.unit })),
      ),
    };
  }
  setLayout("de");
  return rein({ fester, jeTastatur });
}

/** Die Reihenfolge-Wächter eines Weges (Gegenstück zu `tastenflow-lernweg-es-unveraendert.test.ts`). */
export function lernwegGolden(e: WegEinstellung, datei: string, aufnehmenVar: string): void {
  const { W } = e;
  describe(`★★★★★ Lernweg „${W}" - Byte für Byte wie vor dem Umbau für neun Sprachen (G1-GOLDEN)`, () => {
    afterAll(() => setLayout("de"));

    it("die Aufnahme ist deterministisch (zweimal gerechnet, gleich)", () => {
      expect(lernwegAufnahme(e)).toEqual(lernwegAufnahme(e));
    });

    it("alle Reihenfolge-Funktionen liefern auf jeder Tastatur des Weges dasselbe wie vorher", () => {
      const jetzt = lernwegAufnahme(e);
      if (process.env[aufnehmenVar] === "1") schreibeFixture(datei, alsText(jetzt) + "\n");
      expect(jetzt).toEqual(liesFixture(datei));
    });

    it("die Aufnahme ist nicht leer und deckt jede Tastatur und die Nahtstellen ab (Gegenprobe, Falle 4)", () => {
      const vorher = liesFixture(datei);
      expect(Object.keys(vorher.jeTastatur)).toEqual([...e.layouts]);
      expect(vorher.fester.hauptsprache).toBe(W);
      expect(vorher.fester.NIVEAU_DEFS.length).toBeGreaterThanOrEqual(6);
      for (const layout of e.layouts) {
        const t = vorher.jeTastatur[layout];
        const folge: string[] = t.introOrder;
        expect(folge.length, layout).toBeGreaterThan(60);
        expect(folge.slice(0, 2)).toEqual(["f", "j"]);
        expect(t.introducedUpTo.length).toBe(folge.length + 5);
        expect(t.lektionen.length, layout).toBeGreaterThan(10);
        expect(t.startPoints[W].length, layout).toBeGreaterThan(0);
        // Der Aufstieg endet beim vollen Stand dieser Tastatur, und kein Paar kommt halb.
        expect(t.aufstiegEnde).toEqual(folge);
        for (const [auf, zu] of Object.entries(vorher.fester.paareGemeinsam ?? {}) as [string, string][]) {
          if (!folge.includes(auf)) continue;
          expect(folge[folge.indexOf(auf) + 1], `${layout}: ${auf} vor ${zu}`).toBe(zu);
          for (const s of t.aufstieg as string[][]) expect(s.includes(auf), `${layout}: ${s.join()}`).toBe(s.includes(zu));
        }
      }
      // Die Stände reichen bis zum vollen Stand (Satzzeichen, Ziffern, Sonderzeichen).
      setLayout(e.layouts[0]);
      const folge = startpunktFolge(W);
      const n = nahtstellen(W, folge);
      setLayout("de");
      const laengen = vorher.jeTastatur[e.layouts[0]].ensureIntroduced.map((s: string[]) => s.length);
      expect(n.nachSatzzeichen).toBeGreaterThan(n.nachBuchstaben);
      expect(n.nachZiffern).toBeGreaterThan(n.nachSatzzeichen);
      expect(laengen).toContain(n.nachSatzzeichen);
      expect(laengen).toContain(n.nachZiffern);
      expect(laengen).toContain(folge.length);
      for (const z of e.eigeneZeichen) expect(vorher.jeTastatur[e.layouts[0]].introOrder, z).toContain(z);
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// 2 · Inhalt: Korpus (beide Funktionen), Arcs, Lektionen, Vorlagen, Wortspiele, Serien, Sprachpaket
// ════════════════════════════════════════════════════════════════════════════

const N_PUNKTE_BASIS = [3, 8, 12, 17, 19, 22, 25, 30, 34, 38, 42, 46, 52, 56, 60, 64, 68, 72, 76];

function inhaltAufrufe(W: Lernweg & Lang) {
  // ── AUFRUFE ────────────────────────────────────────────────────────────────
  // Der einzige Teil, der sich mit dem Umbau ändern darf.
  return {
    corpusItemsFor: (stufe: Stufe, allowed: Set<string>, lang: Lang = W, umschalt?: boolean) =>
      corpusItemsFor({ stufe, allowed, lang, lernweg: W, umschalt }),
    corpusEntriesFor: (stufe: Stufe, allowed: Set<string>, lang: Lang = W, umschalt?: boolean) =>
      corpusEntriesFor({ stufe, allowed, lang, lernweg: W, umschalt }),
    unlockedSerien: (allowed: Set<string>, stufe: Stufe) => unlockedSerien(allowed, stufe, W, W),
    serienForStufe: (stufe: Stufe) => serienForStufe(stufe, W, W),
    arcsFor: (stufe: Stufe) => arcsFor(stufe, W, W),
    lektionen: () => lektionenFuer(W),
    allowed: (n: number) => allowedFromIntroduced(introducedUpTo(n, W), W),
    allowedVoll: () => allowedFromIntroduced([...introOrder(W)], W),
    vorlagen: (fuer: "uebung" | "challenge") => vorlagenFuer({ fuer, lang: W }),
    vorlageVorschau: (id: string, stufe: Stufe) => vorlageVorschau(id, { stufe, lang: W, verbietenSs: false, lernweg: W }),
    korpus: () => korpusFuer(W),
    korpusQuelle: () => korpusQuelle(W),
    lexikon: () => lexikonWoerter(W),
    // ★ G2-NEUN (25.10.2026): `lexikonGroesse` kennt (noch) nur die acht Sprachen mit Lexikon - die Golden-Wege sind diese acht.
    lexikonGroesse: () => lexikonGroesse()[W as Exclude<Lernweg, GeruestSprache>],
  };
  // ── ENDE AUFRUFE ───────────────────────────────────────────────────────────
}

/** Die N-Stichproben für die AKTIVE Tastatur: quer durch den ganzen Weg samt Nahtstellen und vollem Stand. */
function nPunkteFuer(W: Lernweg): number[] {
  const voll = introOrder(W);
  const n = nahtstellen(W, voll);
  return [
    ...new Set([
      ...N_PUNKTE_BASIS.filter((k) => k < voll.length),
      n.nachShift - 1,
      n.nachShift,
      n.nachBuchstaben,
      ...n.paarMitten,
      n.nachSatzzeichen,
      n.nachZiffern,
      voll.length - 1,
      voll.length,
    ]),
  ].sort((a, b) => a - b);
}

function seededZufall(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function getippteTexte(form: Uebungsform, ctx: FormKontext): string[] {
  if (form.eigenerBildschirm === "raetsel") return (form.fragen?.(ctx) ?? []).flatMap((a) => a.antworten);
  if (form.eigenerBildschirm === "buchstabensalat") {
    const wort = waehleSalatwort(ctx);
    return wort ? [wort] : [];
  }
  const runde = form.baue?.(ctx) ?? null;
  return runde ? runde.zeilen.map((z) => z.text) : [];
}

const eintrag = (e: { index: number; kind: string; text: string }) => `${e.index}|${e.kind}|${e.text}`;

function inhaltKern(e: WegEinstellung): unknown {
  const { W } = e;
  const A = inhaltAufrufe(W);
  const jeLayout: Record<string, unknown> = {};
  for (const layout of e.layouts) {
    setLayout(layout);
    const nPunkte = nPunkteFuer(W);
    const nVoll = Math.max(...nPunkte);
    const nah = nahtstellen(W, introOrder(W));
    const jeN: Record<string, unknown> = {};
    for (const n of nPunkte) {
      const allowed = A.allowed(n);
      const korpus: Record<string, unknown> = {};
      for (const stufe of STUFEN as Stufe[]) {
        const items = A.corpusItemsFor(stufe, allowed);
        korpus[stufe] = {
          items: digest(items),
          entries: digest(A.corpusEntriesFor(stufe, allowed).map(eintrag)),
          ...(n === nVoll ? { letzteZeilen: items.slice(-4) } : {}),
        };
      }
      // Englische Texte kommen auf jedem Weg mit (Johannes 28.09.) - an drei Sprossen.
      const korpusEn: Record<string, unknown> = {};
      if (n === 8 || n === nah.nachBuchstaben || n === nVoll) {
        for (const stufe of STUFEN as Stufe[]) {
          korpusEn[stufe] = {
            items: digest(A.corpusItemsFor(stufe, allowed, "en")),
            entries: digest(A.corpusEntriesFor(stufe, allowed, "en").map(eintrag)),
          };
        }
      }
      jeN[`n${n}`] = { korpus, ...(Object.keys(korpusEn).length ? { korpusEn } : {}) };
    }
    // ★ D-2: ohne gelernte Umschalttaste fallen Grossbuchstaben-Zeilen weg (Erwachsene).
    const ohneUmschalt: Record<string, unknown> = {};
    for (const n of [8, nah.nachShift - 1, nah.nachShift]) {
      const allowed = A.allowed(n);
      ohneUmschalt[`n${n}`] = {
        items: digest(A.corpusItemsFor("erwachsen", allowed, W, false)),
        entries: digest(A.corpusEntriesFor("erwachsen", allowed, W, false).map(eintrag)),
      };
    }
    const l = A.lektionen();
    jeLayout[layout] = {
      ...jeN,
      ohneUmschalt,
      lektionen: { ids: l.map((x) => x.id), kinds: l.map((x) => x.kind), newKeys: l.map((x) => [...x.newKeys]), titles: digest(l.map((x) => x.title)) },
    };
  }

  setLayout(e.layouts[0]);
  const arcs: Record<string, unknown> = {};
  for (const stufe of STUFEN as Stufe[]) arcs[stufe] = A.arcsFor(stufe).map((a) => a.id).sort();

  // ── Vorlagen (Wortherkunft u. a.) ───────────────────────────────────────
  const ids = A.vorlagen("uebung").map((v) => v.id).sort();
  const challengeIds = A.vorlagen("challenge").map((v) => v.id).sort();
  const vorlagen: Record<string, unknown> = { ids, challengeIds };
  for (const stufe of STUFEN as Stufe[]) {
    const je: Record<string, unknown> = {};
    for (const id of [...ids, ...challengeIds]) {
      const v = A.vorlageVorschau(id, stufe);
      je[id] = v ? digest(v.zeilen) : null;
    }
    vorlagen[stufe] = je;
  }

  // ── Wortspiel-Vorräte (Übungsformen, drei Tastenstände x zwei Saaten x drei Stufen) ──
  const nah = nahtstellen(W, introOrder(W));
  const staende: [string, string[]][] = [
    ["frueh19", introducedUpTo(19, W)],
    ["buchstaben", introducedUpTo(nah.nachBuchstaben, W)],
    ["voll", [...introOrder(W)]],
  ];
  const wortspiele: Record<string, unknown> = {};
  for (const [name, introduced] of staende) {
    for (const stufe of STUFEN as Stufe[]) {
      const jeForm: Record<string, unknown> = {};
      // Iglu-Raten hat keine Zeilenrunde; sein Wächter ist tests/tastenflow-iglu.test.tsx (wie im es-Wächter).
      for (const form of UEBUNGSFORMEN.filter((f) => f.id !== "iglu")) {
        const runden: unknown[] = [];
        for (const seed of [1, 7]) {
          const ctx: FormKontext = {
            lernweg: W,
            introduced: [...introduced],
            shift: introduced.includes(SHIFT_UNIT),
            oneHand: false,
            stufe,
            lang: W,
            sprache: W,
            count: 12,
            zufall: seededZufall(seed),
          } as FormKontext;
          if (!form.taugt(ctx)) continue;
          runden.push(digest(getippteTexte(form, ctx)));
        }
        jeForm[form.id] = runden;
      }
      wortspiele[`${name}:${stufe}`] = jeForm;
    }
  }
  setLayout("de");
  return rein({ jeLayout, arcs, vorlagen, wortspiele });
}

/** Der Inhalt des Sprachpakets selbst (Gegenstück zu `sprachpakete-golden.test.ts` für die vier Sprachen von damals). */
function sprachpaketAufnahme(e: WegEinstellung): unknown {
  const A = inhaltAufrufe(e.W);
  const korpus = A.korpus();
  const serien = SERIEN.filter((s) => s.lang === e.W);
  return rein({
    korpus: [korpus.length, h(korpus)],
    korpusQuelle: h(A.korpusQuelle()),
    serien: [serien.length, h(serien), h(serien.map((s) => s.slug))],
    lexikon: [A.lexikon().length, h(A.lexikon())],
    lexikonGroesse: A.lexikonGroesse(),
  });
}

function serienStaende(W: Lernweg & Lang): [string, Set<string>][] {
  const A = inhaltAufrufe(W);
  const nah = nahtstellen(W, introOrder(W));
  return [
    ["buchstaben", A.allowed(nah.nachBuchstaben)],
    ["satzzeichen", A.allowed(nah.nachSatzzeichen)],
    ["ziffern", A.allowed(nah.nachZiffern)],
    ["voll", A.allowedVoll()],
  ];
}

function serienBaseline(e: WegEinstellung): unknown {
  const A = inhaltAufrufe(e.W);
  setLayout(e.layouts[0]);
  const eintraege: Record<string, Record<string, { anzahl: number; hash: string; titel: string }>> = {};
  const unlocked: Record<string, Record<string, string[]>> = {};
  for (const stufe of STUFEN as Stufe[]) {
    const je: Record<string, { anzahl: number; hash: string; titel: string }> = {};
    for (const s of A.serienForStufe(stufe)) je[s.slug] = { ...digest(serieLines(s)), titel: s.titel };
    eintraege[stufe] = je;
    unlocked[stufe] = Object.fromEntries(
      serienStaende(e.W).map(([name, allowed]) => [name, A.unlockedSerien(allowed, stufe).map((s) => s.slug).sort()]),
    );
  }
  setLayout("de");
  return rein({ eintraege, unlocked });
}

/** Die Inhalts-Wächter eines Weges (Gegenstück zu `tastenflow-lernweg-inhalt-es-unveraendert.test.ts`). */
export function inhaltGolden(e: WegEinstellung, datei: string, aufnehmenVar: string): void {
  const { W } = e;
  const A = inhaltAufrufe(W);
  let vergessen: Map<Lang, SprachDaten> | null = null;

  describe(`★★★★★ Weg „${W}" liefert vor dem Umbau für neun Sprachen denselben Inhalt wie heute (G1-GOLDEN)`, () => {
    afterEach(() => {
      if (vergessen) _sprachpaketeWiederEinsetzen(vergessen);
      vergessen = null;
      fehlZugriffeLeeren();
    });
    afterAll(() => setLayout("de"));

    // Die Aufnahme ist teuer (Korpus an ~25 Sprossen x 3 Stufen x jede Tastatur) - einmal rechnen, zweimal nutzen.
    let jetzt: unknown = null;
    beforeAll(() => {
      jetzt = inhaltKern(e);
      if (process.env[aufnehmenVar] === "1") {
        schreibeFixture(
          datei,
          JSON.stringify(
            { kern: jetzt, sprachpaket: sprachpaketAufnahme(e), serienBaseline: serienBaseline(e) },
            null,
            1,
          ) + "\n",
        );
      }
    }, 600_000);

    it("Korpus (beide Funktionen), Arcs, Lektionen, Vorlagen und Wortspiel-Vorräte sind unverändert", () => {
      expect(jetzt).toEqual(liesFixture(datei).kern);
    });

    it("die Aufnahme ist deterministisch (an der Haupttastatur nachgerechnet, gleich)", () => {
      setLayout(e.layouts[0]);
      const nVoll = introOrder(W).length;
      const allowed = A.allowed(nVoll);
      const kern = jetzt as any;
      for (const stufe of STUFEN as Stufe[]) {
        expect(digest(A.corpusItemsFor(stufe, allowed))).toEqual(kern.jeLayout[e.layouts[0]][`n${nVoll}`].korpus[stufe].items);
      }
      setLayout("de");
    });

    it("das Sprachpaket selbst: Korpus, Serien, Lexikon in derselben Reihenfolge (Falle 54)", () => {
      expect(sprachpaketAufnahme(e)).toEqual(liesFixture(datei).sprachpaket);
    });

    it("Falle 32: corpusItemsFor und corpusEntriesFor liefern dieselben Zeilen (quer durch den Weg)", () => {
      for (const layout of e.layouts) {
        setLayout(layout);
        const nah = nahtstellen(W, introOrder(W));
        for (const n of [8, 19, nah.nachBuchstaben, nah.nachSatzzeichen, nah.nachZiffern, introOrder(W).length]) {
          const allowed = A.allowed(n);
          for (const stufe of STUFEN as Stufe[]) {
            expect(sortiert(A.corpusEntriesFor(stufe, allowed).map((x) => x.text)), `${layout} n=${n} ${stufe}`).toEqual(
              sortiert(A.corpusItemsFor(stufe, allowed)),
            );
          }
        }
      }
      setLayout("de");
    });

    it("die Aufnahme ist nicht leer UND die späten Zeilen tragen Ziffern, Klammern und die eigenen Zeichen (Falle 4)", () => {
      const vorher = liesFixture(datei);
      for (const layout of e.layouts) {
        const nMax = Math.max(
          ...Object.keys(vorher.kern.jeLayout[layout]).filter((k) => /^n\d+$/.test(k)).map((k) => Number(k.slice(1))),
        );
        const voll = vorher.kern.jeLayout[layout][`n${nMax}`];
        for (const stufe of STUFEN) {
          expect(voll.korpus[stufe].items.anzahl, `${layout} ${stufe}`).toBeGreaterThan(100);
          expect(voll.korpus[stufe].letzteZeilen.length).toBe(4);
        }
        expect(vorher.kern.jeLayout[layout].n3.korpus.teens.items.anzahl).toBe(0);
        expect(voll.korpus.teens.items.hash).not.toBe(vorher.kern.jeLayout[layout].n30.korpus.teens.items.hash);
      }
      setLayout(e.layouts[0]);
      const alle = (STUFEN as Stufe[]).flatMap((s) => A.corpusItemsFor(s, A.allowedVoll()));
      setLayout("de");
      expect(alle.some((z) => /\d/.test(z)), "Zeile mit Ziffer").toBe(true);
      expect(alle.some((z) => /[(\[{]/.test(z)), "Zeile mit Klammer").toBe(true);
      expect(alle.some((z) => z.includes("?")), "Zeile mit ?").toBe(true);
      for (const m of e.spaeteMerkmale) expect(alle.some((z) => z.includes(m)), `Zeile mit „${m}"`).toBe(true);
      expect(vorher.sprachpaket.korpus[0]).toBeGreaterThan(1000);
      expect(vorher.sprachpaket.serien[0]).toBeGreaterThan(0);
      expect(vorher.sprachpaket.lexikon[0]).toBeGreaterThan(1000);
      expect(Object.keys(vorher.serienBaseline.eintraege.kids).length).toBeGreaterThan(0);
      expect(Object.keys(vorher.kern.wortspiele["voll:kids"]).length).toBeGreaterThan(0);
    });

    it("Falle 54: ohne das Paket kommt wirklich nichts - und das Ledger hängt an keinem Paket", () => {
      const version = corpusManifestVersion();
      const zahl = corpusManifestCount();
      setLayout(e.layouts[0]);
      const allowed = A.allowedVoll();
      vergessen = _sprachpaketeVergessen([W]);
      expect(A.korpus().length).toBe(0);
      expect(A.corpusItemsFor("teens", allowed).length).toBe(0);
      expect(SERIEN.some((s) => s.lang === W)).toBe(false);
      expect(corpusManifestVersion()).toBe(version);
      expect(corpusManifestCount()).toBe(zahl);
      setLayout("de");
    });

    it("Serien: jede Baseline-Serie ist HEUTE noch da, mit demselben Inhalt (Teilmenge, Anhängen darf)", () => {
      const vorher = liesFixture(datei);
      let geprueft = 0;
      setLayout(e.layouts[0]);
      for (const stufe of STUFEN as Stufe[]) {
        const bySlug = new Map<string, Serie>(A.serienForStufe(stufe).map((s) => [s.slug, s]));
        for (const [slug, g] of Object.entries(
          vorher.serienBaseline.eintraege[stufe] as Record<string, { anzahl: number; hash: string; titel: string }>,
        )) {
          const live = bySlug.get(slug);
          expect(live, `Serie „${slug}" (Stufe ${stufe}) fehlt jetzt`).toBeTruthy();
          expect(live!.titel).toBe(g.titel);
          expect(digest(serieLines(live!)), `Serie „${slug}" hat sich geändert`).toEqual({ anzahl: g.anzahl, hash: g.hash });
          geprueft++;
        }
        const freiJetzt = Object.fromEntries(
          serienStaende(W).map(([name, al]) => [name, new Set(A.unlockedSerien(al, stufe).map((s) => s.slug))]),
        );
        for (const [stand, slugs] of Object.entries(vorher.serienBaseline.unlocked[stufe] as Record<string, string[]>)) {
          for (const slug of slugs) expect(freiJetzt[stand].has(slug), `„${slug}" war frei (${stufe}, ${stand})`).toBe(true);
        }
      }
      setLayout("de");
      expect(geprueft).toBeGreaterThan(10);
    });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// 3 · Generator: fester Zufall, mehrere Sprossen bis zum vollen Tastenstand
// ════════════════════════════════════════════════════════════════════════════

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function withSeededRandom<T>(seed: number, fn: () => T): T {
  const real = Math.random;
  Math.random = mulberry32(seed);
  try {
    return fn();
  } finally {
    Math.random = real;
  }
}

/** Die Generator-Wächter eines Weges (Gegenstück zu `tastenflow-generator-es-unveraendert.test.ts`). */
export function generatorGolden(e: WegEinstellung, datei: string, aufnehmenVar: string): void {
  const { W } = e;
  // ── AUFRUFE ────────────────────────────────────────────────────────────────
  const A = {
    wordDrillZeilen: (allowed: string[], stufe: Stufe, focus: string[], shiftDrill: boolean, wortFokus: readonly string[] = []) =>
      wordDrillZeilen(allowed, true, stufe, focus, 12, shiftDrill, W, true, undefined, wortFokus),
    adaptiveRound: (introduced: string[], stufe: Stufe, focus: string[] | undefined, lang: Lang = W) =>
      adaptiveRound({ introduced, stufe, lang, lernweg: W, count: 16, ...(focus ? { focus } : {}) }),
    generateRound: (id: string, stufe: Stufe, lang: Lang = W) => generateRound(id, { lernweg: W, lang, stufe, count: 16 }),
  };
  // ── ENDE AUFRUFE ───────────────────────────────────────────────────────────

  const GOLDEN: Record<string, string[]> = existsSync(datei) ? JSON.parse(readFileSync(datei, "utf8")) : {};
  const AUFNEHMEN = process.env[aufnehmenVar] === "1";
  const ERGEBNIS: Record<string, string[]> = {};
  const pruefeOderNimmAuf = (key: string, zeilen: string[]) => {
    if (AUFNEHMEN) {
      ERGEBNIS[key] = zeilen;
      return;
    }
    expect(zeilen, `Fixture-Eintrag fehlt oder anders: ${key}`).toEqual(GOLDEN[key]);
  };

  const def = lernwegDef(W);
  const letterOrder = [...def.letterOrder];
  const digits = [...def.digitOrder];
  const symbols = [...def.symbolOrder];
  const STUFEN_G: readonly Stufe[] = ["kids", "teens", "erwachsen"];

  /** Die Sprossen aus der Folge der AKTIVEN Tastatur (Falle 4: früh, mittel, eigene Zeichen, Satzzeichen, spät). */
  const rungs = () => {
    const folge = introOrder(W);
    const n = nahtstellen(W, folge);
    const bis = (k: number) => folge.slice(0, k);
    const eigene = e.eigeneZeichen.filter((z) => folge.includes(z));
    const haelfte = Math.ceil(eigene.length / 2);
    return [
      { name: "frueh", introduced: bis(def.homeRowLetters), focus: [] as string[], seeds: [7] },
      { name: "mittel", introduced: bis(n.nachShift + 2), focus: [folge[n.nachShift], SHIFT_UNIT], seeds: [7] },
      { name: "buchstaben", introduced: bis(n.nachBuchstaben), focus: eigene.slice(0, haelfte), seeds: [7, 31] },
      { name: "buchstaben2", introduced: bis(n.nachBuchstaben), focus: eigene.slice(haelfte), seeds: [7, 31] },
      { name: "satzzeichen", introduced: bis(n.nachSatzzeichen), focus: def.punctOrder.filter((p) => folge.indexOf(p) >= n.nachBuchstaben).slice(0, 4), seeds: [7, 31] },
      { name: "klammern", introduced: bis(n.nachSatzzeichen), focus: ["(", ")"], seeds: [7] },
      { name: "spaet", introduced: [...folge], focus: [def.punctOrder[0], digits[0], symbols[0], ...eigene.slice(-2)], seeds: [7, 31] },
    ];
  };

  describe(`★★★★★ Generator: Weg „${W}" unverändert vor dem Umbau für neun Sprachen (G1-GOLDEN)`, () => {
    beforeAll(() => setLayout(e.layouts[0]));

    describe("wordDrillZeilen", () => {
      for (const n of [8, 17, 25, letterOrder.length]) {
        for (const stufe of STUFEN_G) {
          for (const shiftDrill of [false, true]) {
            it(`Tastenstand ${n} / Stufe ${stufe} / shiftDrill=${shiftDrill}`, () => {
              const allowed = letterOrder.slice(0, n);
              const zeilen = withSeededRandom(42, () => A.wordDrillZeilen(allowed, stufe, allowed.slice(0, 3), shiftDrill));
              pruefeOderNimmAuf(`wordDrillZeilen:${n}:${stufe}:${shiftDrill}`, zeilen.map((z) => z.text));
            });
          }
        }
      }
      it("voller Buchstabenstand mit Wort-Fokus auf den eigenen Zeichen (F8-it)", () => {
        const zeilen = withSeededRandom(42, () =>
          A.wordDrillZeilen(letterOrder, "teens", [], false, e.eigeneZeichen.filter((z) => letterOrder.includes(z)).slice(-3)),
        );
        pruefeOderNimmAuf("wordDrillZeilen:wortFokus", zeilen.map((z) => z.text));
      });
    });

    describe("adaptiveRound - früh/mittel/eigene Zeichen/Satzzeichen/spät (Falle 4)", () => {
      for (const name of ["frueh", "mittel", "buchstaben", "buchstaben2", "satzzeichen", "klammern", "spaet"]) {
        for (const stufe of STUFEN_G) {
          if ((name === "frueh" || name === "mittel" || name === "klammern") && stufe !== "teens") continue;
          for (const seed of name === "frueh" || name === "mittel" || name === "klammern" ? [7] : [7, 31]) {
            it(`Sprosse „${name}" / ${stufe} / Zufall ${seed}`, () => {
              setLayout(e.layouts[0]);
              const r = rungs().find((x) => x.name === name)!;
              const zeilen = withSeededRandom(seed, () =>
                A.adaptiveRound(r.introduced, stufe, r.focus.filter((c) => r.introduced.includes(c))),
              );
              pruefeOderNimmAuf(`adaptiveRound:${name}:${stufe}:${seed}`, zeilen.map((l) => l.text));
            });
          }
        }
      }

      it("ohne Fokus an der späten Sprosse (gewöhnliche Mischrunde)", () => {
        setLayout(e.layouts[0]);
        const r = rungs().find((x) => x.name === "spaet")!;
        const zeilen = withSeededRandom(5, () => A.adaptiveRound(r.introduced, "erwachsen", undefined));
        pruefeOderNimmAuf("adaptiveRound:spaet:ohneFokus", zeilen.map((l) => l.text));
      });

      for (const layout of e.layouts.slice(1)) {
        it(`Tastatur „${layout}": späte Sprosse mit den Einheiten dieser Tastatur`, () => {
          setLayout(layout);
          try {
            const r = rungs().find((x) => x.name === "spaet")!;
            const zeilen = withSeededRandom(7, () =>
              A.adaptiveRound(r.introduced, "teens", r.focus.filter((c) => r.introduced.includes(c))),
            );
            pruefeOderNimmAuf(`adaptiveRound:spaet:${layout}`, zeilen.map((l) => l.text));
          } finally {
            setLayout(e.layouts[0]);
          }
        });
      }

      it(`Hauptsprache-Vorrang (D1 Nr. 18): Übungssprache „en" auf Weg „${W}", Fokus auf eigene Zeichen`, () => {
        setLayout(e.layouts[0]);
        const r = rungs().find((x) => x.name === "buchstaben")!;
        const zeilen = withSeededRandom(7, () => A.adaptiveRound(r.introduced, "teens", r.focus, "en"));
        pruefeOderNimmAuf("adaptiveRound:buchstaben:lang-en", zeilen.map((l) => l.text));
      });
    });

    describe("generateRound - jede Lektion des Weges", () => {
      setLayout(e.layouts[0]);
      const ids = lektionenFuer(W).map((l) => l.id);
      setLayout("de");
      for (const id of ids) {
        it(`Lektion „${id}" (teens)`, () => {
          setLayout(e.layouts[0]);
          const zeilen = withSeededRandom(99, () => A.generateRound(id, "teens"));
          pruefeOderNimmAuf(`generateRound:${id}`, zeilen.map((l) => l.text));
        });
      }
      // Die späten Lektionen (Satzzeichen, Ziffern, Sonderzeichen, Texte) auch für kids und erwachsen.
      for (const id of ids.slice(-6)) {
        for (const stufe of ["kids", "erwachsen"] as const) {
          it(`Lektion „${id}" (${stufe})`, () => {
            setLayout(e.layouts[0]);
            const zeilen = withSeededRandom(99, () => A.generateRound(id, stufe));
            pruefeOderNimmAuf(`generateRound:${id}:${stufe}`, zeilen.map((l) => l.text));
          });
        }
      }
      for (const id of ids.slice(-6, -3)) {
        it(`Lektion „${id}" in der Übungssprache „en" (Hauptsprache-Vorrang)`, () => {
          setLayout(e.layouts[0]);
          const zeilen = withSeededRandom(99, () => A.generateRound(id, "teens", "en"));
          pruefeOderNimmAuf(`generateRound:${id}:lang-en`, zeilen.map((l) => l.text));
        });
      }
    });

    it("Gegenprobe: die Fixture ist nicht leer und die späten Zeilen tragen Ziffern und eigene Zeichen", () => {
      const quelle = AUFNEHMEN ? ERGEBNIS : GOLDEN;
      expect(Object.keys(quelle).length).toBeGreaterThan(60);
      expect(quelle["wordDrillZeilen:8:kids:false"]?.length).toBe(12);
      const spaet = Object.entries(quelle)
        .filter(([k]) => k.startsWith("adaptiveRound:spaet:") || k.startsWith("generateRound:"))
        .flatMap(([, z]) => z);
      expect(spaet.some((z) => /\d/.test(z)), "Zeile mit Ziffer").toBe(true);
      expect(spaet.some((z) => /[(\[{]/.test(z)), "Zeile mit Klammer").toBe(true);
      const alle = Object.values(quelle).flat();
      for (const m of e.spaeteMerkmale) expect(alle.some((z) => z.includes(m)), `Zeile mit „${m}"`).toBe(true);
    });

    // Erst NACH allen it()s geschrieben (wie im es-Wächter).
    afterAll(() => {
      setLayout("de");
      if (!AUFNEHMEN) return;
      schreibeFixture(datei, JSON.stringify(ERGEBNIS, null, 1) + "\n");
    });
  });
}
