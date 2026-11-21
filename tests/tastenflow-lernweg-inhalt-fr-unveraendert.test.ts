/**
 * ★★★★★ WÄCHTER: Was Weg „fr" an INHALT serviert, bleibt unverändert - VOR
 * dem Gerüst des vierten Weges „es" aufgenommen (ES-F1).
 *
 * BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md §2 und
 * BAUPLAN-2026-09-26-NEUE-SPRACHE-EFFIZIENT.md §4 W1. Vorbild:
 * `tests/tastenflow-lernweg-inhalt-en-unveraendert.test.ts` (dort ausführlich
 * erklärt) - hier für Weg „fr", über alle FÜNF Pflicht-Tastaturen samt ihrer
 * Landesvariante (`franzVariante.ts`), und mit der Falle 32 des Leitfadens im
 * Blick: **`corpusItemsFor` UND `corpusEntriesFor` sind zwei Funktionen mit
 * derselben Aufgabe** - der Generator benutzt NUR `corpusEntriesFor`. Ein
 * Wächter, der nur `corpusItemsFor` prüft, hätte die E8a-Lücke von damals
 * nicht gefangen. Dieser Test nimmt darum BEIDE auf und vergleicht sie
 * zusätzlich gegeneinander.
 *
 * ── WARUM EIN HASH STATT DER VOLLEN TEXTE ───────────────────────────────────
 * Wie beim „en"-Wächter: SHA-256-Fingerabdruck (`fingerabdruck`) statt
 * Volltext - schlank, aber genauso scharf wie ein Volltext-Vergleich.
 *
 * ── DIE SERIEN SIND EINE AUSNAHME (Auftrag ES-F1, Parallelarbeit) ───────────
 * Zwei andere Agenten schreiben gerade an `serienFrZusatzTeens.ts` und
 * `serienFrZusatzErwachsen.ts` - neue Serien, die nach diesem Golden-Test noch
 * dazukommen dürfen, OHNE ihn rot zu machen. Ein ANGEHÄNGTER Serien-Block darf
 * also durchgehen; eine Änderung an einer der HEUTE schon bestehenden Serien
 * (Slug bekannt) muss den Test trotzdem rot machen. Darum stehen Serien NICHT
 * im Teil, der auf Gleichheit geprüft wird (`aufnahmeKern`/`vorher.kern"),
 * sondern in einem eigenen Baseline-Block (`serienBaseline`), den ein eigener
 * Test als TEILMENGE gegen den LIVE-Stand prüft (siehe unten, „Serien:").
 *
 * ── WAS SICH BEIM „es"-UMBAU ÄNDERN DARF ────────────────────────────────────
 * Nur der Block „AUFRUFE" - Code reparieren, NIE die Fixture-Datei neu
 * schreiben (ausser einer besprochenen Änderung an Weg „fr" selbst).
 *
 * Neu aufnehmen: `LERNWEG_INHALT_FR_GOLDEN_AUFNEHMEN=1 npx vitest run
 * --maxWorkers=2 --minWorkers=1
 * tests/tastenflow-lernweg-inhalt-fr-unveraendert.test.ts` (oder
 * `scripts/erzeuge-golden-fr.mts`, das alle fr-Goldens zusammen erzeugt).
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, expect, it, afterAll } from "vitest";
import { STUFEN, type Stufe, type Lang } from "../src/lib/typing/account";
import { SHIFT_UNIT, introOrder, introducedUpTo } from "../src/lib/typing/letters";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { corpusItemsFor } from "../src/lib/typing/corpus";
import { corpusEntriesFor } from "../src/lib/typing/corpusManifest";
import { allowedFromIntroduced, serienForStufe, unlockedSerien } from "../src/lib/typing/serien";
import { serieLines, type Serie } from "../src/lib/typing/serie";
import { arcsFor } from "../src/lib/typing/arcs";
import { lernwegDef, type Lernweg } from "../src/lib/typing/lernweg";
import { lektionenFuer } from "../src/lib/typing/curriculum";
import { vorlagenFuer, vorlageVorschau } from "../src/lib/typing/vorlagen";
import { UEBUNGSFORMEN, type FormKontext, type Uebungsform } from "../src/lib/typing/uebungsformen";
import { waehleSalatwort } from "../src/lib/typing/uebungsformen/buchstabensalat";
import { erkenneFranzVarianteAusLayout, type FranzVariante } from "../src/lib/typing/franzVariante";

const DATEI = resolve(__dirname, "fixtures/tastenflow-lernweg-inhalt-fr-golden.json");

// ── AUFRUFE ──────────────────────────────────────────────────────────────────
// Der einzige Teil, der sich mit dem „es"-Umbau ändern darf.
const W: Lernweg = "fr";
const LANG: Lang = "fr";
const A = {
  corpusItemsFor: (
    stufe: Stufe,
    allowed: Set<string>,
    franzVariante: FranzVariante,
  ) => corpusItemsFor({ stufe, allowed, lang: LANG, lernweg: W, franzVariante }),
  corpusEntriesFor: (
    stufe: Stufe,
    allowed: Set<string>,
    franzVariante: FranzVariante,
  ) => corpusEntriesFor({ stufe, allowed, lang: LANG, lernweg: W, franzVariante }),
  unlockedSerien: (allowed: Set<string>, stufe: Stufe) => unlockedSerien(allowed, stufe, LANG, W),
  serienForStufe: (stufe: Stufe) => serienForStufe(stufe, LANG, W),
  arcsFor: (stufe: Stufe) => arcsFor(stufe, LANG, W),
};
// ── ENDE AUFRUFE ─────────────────────────────────────────────────────────────

/** Die fünf Pflicht-Tastaturen des Weges „fr" (wie im Reihenfolge-Wächter). */
const LAYOUTS: LayoutId[] = ["fr", "be", "ch-fr", "ca-csa", "ca-fr"];

/** Die Landesvariante einer Tastatur (E10d) - Grundform „fr-FR" für die reine
 *  AZERTY-Tastatur (gilt auch in Afrika, kein Hinweis - franzVariante.ts). */
function variantFuer(layout: LayoutId): FranzVariante {
  return erkenneFranzVarianteAusLayout(layout) ?? "fr-FR";
}

// Stichproben-Sprossen: früh (nur Buchstaben), mittel (Satzzeichen dazu), spät
// (Ziffern/Sonderzeichen dazu) - wie beim „en"-Wächter (Nachbesserung 25.09.,
// Leitfaden Falle 4). Dynamisch aus `introOrder`/`digitOrder`, weil die Länge
// je Tastatur leicht schwankt (`onlyExistingKeys`).
const N_PUNKTE_BASIS = [3, 8, 13, 16, 19, 21, 24, 30, 34];

/** Die N-Stichproben für die AKTIVE Tastatur (der Aufrufer hat `setLayout`
 *  schon gerufen) - Basis + „nach den Satzzeichen, vor den Ziffern" + voll. */
function nPunkteFuer(lernweg: Lernweg): number[] {
  const voll = introOrder(lernweg);
  const digitSet = new Set(lernwegDef(lernweg).digitOrder);
  const nachSatzzeichen = voll.findIndex((u) => digitSet.has(u));
  const menge = new Set([...N_PUNKTE_BASIS, nachSatzzeichen, voll.length]);
  return [...menge].sort((a, b) => a - b);
}

/** Kurzer, stabiler Fingerabdruck einer Zeilen-Liste. */
function fingerabdruck(zeilen: readonly string[]): string {
  const hash = createHash("sha256");
  for (const z of zeilen) hash.update(z).update("\u0000");
  return hash.digest("hex").slice(0, 24);
}

/** Zählung + Fingerabdruck statt Volltext (Fixture-Grösse). */
function digest(zeilen: readonly string[]): { anzahl: number; hash: string } {
  return { anzahl: zeilen.length, hash: fingerabdruck(zeilen) };
}

/** Kleiner deterministischer Zufallsgenerator (wie in den anderen Golden-Tests). */
function seededZufall(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/** Ein FormKontext auf Weg „fr" mit dem gegebenen Tastenstand. */
function ctxFrMit(introduced: readonly string[], seed: number, count = 12): FormKontext {
  return {
    lernweg: "fr",
    introduced: [...introduced],
    shift: introduced.includes(SHIFT_UNIT),
    oneHand: false,
    stufe: "kids",
    lang: "fr",
    sprache: "fr",
    count,
    zufall: seededZufall(seed),
  };
}

/** Alles, was ein Kind bei dieser Form wirklich TIPPT (wie im „en"-Wächter). */
function getippteTexte(form: Uebungsform, ctx: FormKontext): string[] {
  if (form.eigenerBildschirm === "raetsel") {
    return (form.fragen?.(ctx) ?? []).flatMap((a) => a.antworten);
  }
  if (form.eigenerBildschirm === "buchstabensalat") {
    const wort = waehleSalatwort(ctx);
    return wort ? [wort] : [];
  }
  const runde = form.baue?.(ctx) ?? null;
  return runde ? runde.zeilen.map((z) => z.text) : [];
}

/**
 * Der Teil, der auf VOLLE Gleichheit geprüft wird - Korpus (beide Funktionen,
 * Falle 32), Arcs, Lektionen, Wortspiel-Vorräte, Wortherkunft. KEINE Serien
 * (siehe Kopf-Kommentar) - die stehen in {@link serienBaseline}.
 */
function aufnahmeKern(): unknown {
  const jeLayout: Record<string, unknown> = {};
  for (const layout of LAYOUTS) {
    setLayout(layout);
    const variante = variantFuer(layout);
    const jeN: Record<string, unknown> = {};
    for (const n of nPunkteFuer(W)) {
      const allowed = allowedFromIntroduced(introducedUpTo(n, W), W);
      const korpusJeStufe: Record<string, unknown> = {};
      for (const stufe of STUFEN as Stufe[]) {
        const items = A.corpusItemsFor(stufe, allowed, variante);
        const entries = A.corpusEntriesFor(stufe, allowed, variante);
        korpusJeStufe[stufe] = {
          items: digest(items),
          entries: digest(entries.map((e) => `${e.index}|${e.kind}|${e.text}`)),
        };
      }
      jeN[`n${n}`] = { variante, korpus: korpusJeStufe };
    }
    jeLayout[layout] = jeN;
  }
  setLayout(W); // Vorgabe „fr" statt „de" - hier ist der Weg selbst französisch.

  const arcs: Record<string, unknown> = {};
  for (const stufe of STUFEN as Stufe[]) {
    arcs[stufe] = A.arcsFor(stufe)
      .map((a) => a.id)
      .sort();
  }

  const lektionen: Record<string, unknown> = {};
  for (const layout of LAYOUTS) {
    setLayout(layout);
    const l = lektionenFuer(W);
    lektionen[layout] = {
      ids: l.map((x) => x.id),
      kinds: l.map((x) => x.kind),
      newKeys: l.map((x) => [...x.newKeys]),
      titles: digest(l.map((x) => x.title)),
    };
  }

  // ── Wortherkunft (Bauplan-Gegenstück zu „Word roots", vorlagen.ts „mots-*") ─
  setLayout("fr");
  const motsIds = vorlagenFuer({ fuer: "uebung", lang: "fr" })
    .map((v) => v.id)
    .sort();
  const motsChallengeIds = vorlagenFuer({ fuer: "challenge", lang: "fr" })
    .map((v) => v.id)
    .sort();
  const wortherkunft: Record<string, unknown> = {};
  for (const stufe of STUFEN as Stufe[]) {
    const jeVorlage: Record<string, unknown> = {};
    for (const id of [...motsIds, ...motsChallengeIds]) {
      const vorschau = vorlageVorschau(id, { stufe, lang: "fr", verbietenSs: false, lernweg: "fr" });
      jeVorlage[id] = vorschau ? digest(vorschau.zeilen) : null;
    }
    wortherkunft[stufe] = jeVorlage;
  }

  // ── Wortspiel-Vorräte (13 Übungsformen, zwei Tastenstände x zwei Saaten) ──
  const staende: { name: string; introduced: () => string[] }[] = [
    { name: "frueh21", introduced: () => introducedUpTo(21, W) },
    { name: "voll", introduced: () => [...introOrder(W)] },
  ];
  const wortspiele: Record<string, unknown> = {};
  for (const stand of staende) {
    const jeForm: Record<string, unknown> = {};
    // Iglu-Raten (23.10.2026) kam nach der Aufnahme dazu, hat keine Zeilenrunde; sein Wächter ist tests/tastenflow-iglu.test.tsx.
    for (const form of UEBUNGSFORMEN.filter((f) => f.id !== "iglu")) {
      const runden: string[][] = [];
      for (const seed of [1, 7]) {
        const ctx = ctxFrMit(stand.introduced(), seed, 12);
        if (!form.taugt(ctx)) continue;
        runden.push(getippteTexte(form, ctx));
      }
      jeForm[form.id] = runden.map((r) => digest(r));
    }
    wortspiele[stand.name] = jeForm;
  }
  setLayout("de");

  return JSON.parse(
    JSON.stringify({ jeLayout, arcs, lektionen, wortherkunft, wortspiele }),
  );
}

/**
 * Serien-BASELINE (Ausnahme, siehe Kopf-Kommentar): Slug + Inhalts-
 * Fingerabdruck jeder HEUTE bestehenden Serie, plus die unlockedSerien-Slugs
 * bei zwei Tastenständen. Wird NICHT per `toEqual` gegen den Live-Stand
 * geprüft (ein Anhängen wäre dann rot), sondern per TEILMENGEN-Test unten.
 */
function serienBaseline(): unknown {
  setLayout("fr");
  const eintraege: Record<string, Record<string, { anzahl: number; hash: string }>> = {};
  for (const stufe of STUFEN as Stufe[]) {
    const je: Record<string, { anzahl: number; hash: string }> = {};
    for (const s of A.serienForStufe(stufe)) je[s.slug] = digest(serieLines(s));
    eintraege[stufe] = je;
  }
  const staende: [string, Set<string>][] = [
    ["frueh21", allowedFromIntroduced(introducedUpTo(21, W), W)],
    ["voll", allowedFromIntroduced([...introOrder(W)], W)],
  ];
  const unlocked: Record<string, Record<string, string[]>> = {};
  for (const stufe of STUFEN as Stufe[]) {
    const je: Record<string, string[]> = {};
    for (const [name, allowed] of staende) {
      je[name] = A.unlockedSerien(allowed, stufe)
        .map((s) => s.slug)
        .sort();
    }
    unlocked[stufe] = je;
  }
  setLayout("de");
  return JSON.parse(JSON.stringify({ eintraege, unlocked }));
}

/** Live nachgerechnet (für den Teilmengen-Test) - dieselben zwei Tastenstände
 *  wie {@link serienBaseline}, aber ohne die Fixture zu lesen. */
function liveSerien(stufe: Stufe): { serien: Serie[]; unlockedNamed: Record<string, Set<string>> } {
  setLayout("fr");
  const serien = A.serienForStufe(stufe);
  const staende: [string, Set<string>][] = [
    ["frueh21", allowedFromIntroduced(introducedUpTo(21, W), W)],
    ["voll", allowedFromIntroduced([...introOrder(W)], W)],
  ];
  const unlockedNamed: Record<string, Set<string>> = {};
  for (const [name, allowed] of staende) {
    unlockedNamed[name] = new Set(A.unlockedSerien(allowed, stufe).map((s) => s.slug));
  }
  setLayout("de");
  return { serien, unlockedNamed };
}

describe("★★★★★ Weg „fr\" liefert vor dem „es\"-Umbau denselben Inhalt wie heute", () => {
  afterAll(() => setLayout("de"));

  it("die Aufnahme ist deterministisch (zweimal gerechnet, gleich)", () => {
    expect(aufnahmeKern()).toEqual(aufnahmeKern());
  });

  it("Korpus, Arcs, Lektionen, Wortherkunft und Wortspiel-Vorräte auf Weg „fr\" sind unverändert", () => {
    const jetzt = aufnahmeKern();
    if (process.env.LERNWEG_INHALT_FR_GOLDEN_AUFNEHMEN === "1") {
      mkdirSync(dirname(DATEI), { recursive: true });
      writeFileSync(
        DATEI,
        JSON.stringify({ kern: jetzt, serienBaseline: serienBaseline() }, null, 1) + "\n",
        "utf8",
      );
    }
    expect(existsSync(DATEI), `Aufnahme fehlt: ${DATEI}`).toBe(true);
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    expect(jetzt).toEqual(vorher.kern);
  });

  it("Falle 32: corpusItemsFor und corpusEntriesFor liefern dieselben Zeilen", () => {
    setLayout("fr");
    for (const n of [8, 24, 44, introOrder(W).length]) {
      const allowed = allowedFromIntroduced(introducedUpTo(n, W), W);
      for (const stufe of STUFEN as Stufe[]) {
        const items = A.corpusItemsFor(stufe, allowed, "fr-FR");
        const entries = A.corpusEntriesFor(stufe, allowed, "fr-FR");
        expect(sortiert(entries.map((e) => e.text)), `n=${n} stufe=${stufe}`).toEqual(
          sortiert(items),
        );
      }
    }
    setLayout("de");
  });

  it("die Aufnahme ist nicht leer (Gegenprobe: sie misst wirklich etwas)", () => {
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    const nMax = Math.max(
      ...Object.keys(vorher.kern.jeLayout.fr).map((k) => Number(k.slice(1))),
    );
    expect(vorher.kern.jeLayout.fr[`n${nMax}`].korpus.teens.items.anzahl).toBeGreaterThan(0);
    expect(vorher.kern.jeLayout.fr.n3.korpus.teens.items.anzahl).toBe(0);
    // ★ Arcs gibt es für Weg „fr" heute noch nicht (ARCS in arcs.ts kennt nur
    // „en") - arcsFor liefert darum überall leer. Das ist der heutige Stand,
    // kein Messfehler: die Struktur wird trotzdem aufgenommen, damit ein
    // späterer Zuwachs (Arcs für „fr") diesen Wächter rot macht, nicht grün
    // vorbeirutscht.
    expect(Array.isArray(vorher.kern.arcs.teens)).toBe(true);
    expect(vorher.kern.lektionen.fr.ids.length).toBeGreaterThan(0);
    expect(Object.keys(vorher.kern.wortherkunft.teens).length).toBeGreaterThan(0);
    expect(Object.keys(vorher.kern.wortspiele.voll).length).toBeGreaterThan(0);
    expect(Object.keys(vorher.serienBaseline.eintraege.kids).length).toBeGreaterThan(0);
  });

  it("Serien: jede Baseline-Serie ist HEUTE noch da, mit demselben Inhalt (Teilmenge, kein Anhänge-Bruch)", () => {
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    let geprueft = 0;
    for (const stufe of STUFEN as Stufe[]) {
      const { serien } = liveSerien(stufe);
      const bySlug = new Map(serien.map((s) => [s.slug, s]));
      for (const [slug, golden] of Object.entries(
        vorher.serienBaseline.eintraege[stufe] as Record<string, { anzahl: number; hash: string }>,
      )) {
        const live = bySlug.get(slug);
        expect(live, `Serie „${slug}" (Stufe ${stufe}) fehlt jetzt`).toBeTruthy();
        expect(digest(serieLines(live!)), `Serie „${slug}" hat sich inhaltlich geändert`).toEqual(
          golden,
        );
        geprueft++;
      }
    }
    expect(geprueft).toBeGreaterThan(50); // Gegenprobe: es wird wirklich viel geprüft
  });

  it("Serien: unlockedSerien bei festem Tastenstand bleibt eine Teilmenge (neue Serien dürfen dazukommen)", () => {
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    for (const stufe of STUFEN as Stufe[]) {
      const { unlockedNamed } = liveSerien(stufe);
      for (const [stand, goldenSlugs] of Object.entries(
        vorher.serienBaseline.unlocked[stufe] as Record<string, string[]>,
      )) {
        const liveSlugs = unlockedNamed[stand];
        for (const slug of goldenSlugs) {
          expect(liveSlugs.has(slug), `„${slug}" war frei (Stufe ${stufe}, ${stand}), jetzt nicht mehr`).toBe(
            true,
          );
        }
      }
    }
  });
});

function sortiert(s: Iterable<string>): string[] {
  return [...s].sort();
}
