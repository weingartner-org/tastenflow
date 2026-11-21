/**
 * ★★★★★ WÄCHTER: Was Weg „es" an INHALT serviert, bleibt unverändert - VOR dem
 * Umbau auf das Sprachregister aufgenommen (Etappe G1a,
 * BAUPLAN-2026-10-02-VIER-SPRACHEN-IT-PL-TR-CS.md §4).
 *
 * Vorbild: `tests/tastenflow-lernweg-inhalt-fr-unveraendert.test.ts`
 * (BEFUND-2026-09-27-ES-F1-GOLDEN-FR.md) - hier für Weg „es", über die ZWEI
 * spanischen Tastaturen (`es` Spanien, `latam` Lateinamerika) samt ihrer
 * Landesvariante (`esVariante.ts`: es-ES / es-419). Mit der Falle 32 des
 * Leitfadens im Blick: **`corpusItemsFor` UND `corpusEntriesFor` sind zwei
 * Funktionen mit derselben Aufgabe** - der Generator benutzt NUR
 * `corpusEntriesFor`. Dieser Test nimmt darum BEIDE auf und vergleicht sie
 * zusätzlich gegeneinander.
 *
 * ── DIE TEXTE KOMMEN ALS SPRACHPAKETE (Falle 54) ────────────────────────────
 * Seit dem 28.09.2026 sind `CORPUS`, `SERIEN`, das Lexikon leer, bis ihr Paket
 * geladen ist. Im Test sind sie vorgeladen: `vite.config.ts` hängt über
 * `test.alias` `tests/sprachpakete-vorgeladen.ts` ein (alle vier Pakete) - wie
 * beim fr-Wächter. Ein Test, der nichts lädt, würde LEERE Listen
 * aufnehmen und alles „bestehen"; darum prüft der Test unten ausdrücklich,
 * dass die Aufnahme nicht leer ist (`items.anzahl > 0`) und dass die späten
 * Zeilen wirklich Satzzeichen, Ziffern und Apostroph tragen.
 *
 * ── DIE SPROSSEN REICHEN BIS ZUM ENDE DES WEGES (Falle 4) ───────────────────
 * Nicht nur „Buchstaben fertig": die Stichproben-N laufen quer durch den
 * ganzen Weg (Buchstaben, ⇧, Satzzeichen mit den Paaren ¿? ¡!, Ziffern,
 * Sonderzeichen) bis zum vollen Tastenstand mit dem Apostroph als LETZTER
 * Einheit - dort, wo spät geschriebene Zeilen (ES-T10: Apostroph) sitzen.
 * Je Sprosse und Stufe: Anzahl + Hash aller Zeilen (items UND entries mit
 * Index/Art) - und, am vollen Stand, die letzten Zeilen als Klartext, damit
 * ein Unterschied im Diff lesbar ist.
 *
 * ── DIE SERIEN ──────────────────────────────────────────────────────────────
 * Wie beim fr-Wächter in einem eigenen Baseline-Block (`serienBaseline`):
 * Slug + Inhalts-Hash (Zeilen) jeder HEUTE bestehenden Serie. Ein eigener Test
 * prüft sie als TEILMENGE (anhängen darf, ändern/entfernen nie), dazu die
 * Namen je Stufe und die Zahl.
 *
 * ── WAS SICH BEIM UMBAU ÄNDERN DARF ─────────────────────────────────────────
 * Nur der Block „AUFRUFE" - Code reparieren, NIE die Fixture neu schreiben
 * (ausser einer besprochenen Änderung an Weg „es" selbst).
 *
 * Neu aufnehmen: `LERNWEG_INHALT_ES_GOLDEN_AUFNEHMEN=1 npx vitest run
 * --maxWorkers=2 --minWorkers=1
 * tests/tastenflow-lernweg-inhalt-es-unveraendert.test.ts`.
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
import { erkenneEsVarianteAusLayout, type EsVariante } from "../src/lib/typing/esVariante";

const DATEI = resolve(__dirname, "fixtures/tastenflow-lernweg-inhalt-es-golden.json");

// ── AUFRUFE ──────────────────────────────────────────────────────────────────
// Der einzige Teil, der sich mit dem Umbau ändern darf.
const W: Lernweg = "es";
const LANG: Lang = "es";
const A = {
  corpusItemsFor: (
    stufe: Stufe,
    allowed: Set<string>,
    esVariante: EsVariante,
    lang: Lang = LANG,
    umschalt?: boolean,
  ) => corpusItemsFor({ stufe, allowed, lang, lernweg: W, esVariante, umschalt }),
  corpusEntriesFor: (
    stufe: Stufe,
    allowed: Set<string>,
    esVariante: EsVariante,
    lang: Lang = LANG,
    umschalt?: boolean,
  ) => corpusEntriesFor({ stufe, allowed, lang, lernweg: W, esVariante, umschalt }),
  unlockedSerien: (allowed: Set<string>, stufe: Stufe) => unlockedSerien(allowed, stufe, LANG, W),
  serienForStufe: (stufe: Stufe) => serienForStufe(stufe, LANG, W),
  arcsFor: (stufe: Stufe) => arcsFor(stufe, LANG, W),
};
// ── ENDE AUFRUFE ─────────────────────────────────────────────────────────────

/** Die zwei spanischen Pflicht-Tastaturen des Weges „es" (wie im Reihenfolge-Wächter). */
const LAYOUTS: LayoutId[] = ["es", "latam"];

/** Die Landesvariante einer Tastatur - Spanien „es-ES", Lateinamerika „es-419". */
function variantFuer(layout: LayoutId): EsVariante {
  return erkenneEsVarianteAusLayout(layout) ?? "es-ES";
}

// Stichproben-Sprossen: quer durch den GANZEN Weg (Falle 4). Fest: Grundreihe,
// Buchstaben, ⇧, Satzzeichen, Ziffern, Sonderzeichen; dazu dynamisch die
// Nahtstellen dieser Tastatur (nach den Paaren ¿? ¡!, nach den Ziffern, vor
// dem Apostroph) und der volle Stand.
const N_PUNKTE_BASIS = [3, 8, 12, 17, 18, 19, 22, 25, 30, 34, 38, 42, 46, 52, 56, 60, 64];

/** Die N-Stichproben für die AKTIVE Tastatur (der Aufrufer hat `setLayout`
 *  schon gerufen). */
function nPunkteFuer(lernweg: Lernweg): number[] {
  const voll = introOrder(lernweg);
  const digitSet = new Set(lernwegDef(lernweg).digitOrder);
  const nachSatzzeichen = voll.findIndex((u) => digitSet.has(u));
  const nachFrage = voll.indexOf("?") + 1;
  const nachRuf = voll.indexOf("!") + 1;
  let nachZiffern = 0;
  voll.forEach((u, i) => {
    if (digitSet.has(u)) nachZiffern = i + 1;
  });
  const menge = new Set([
    ...N_PUNKTE_BASIS.filter((n) => n < voll.length),
    nachFrage - 1, // MITTEN im Paar: ¿ ohne ?
    nachFrage,
    nachRuf,
    nachSatzzeichen,
    nachZiffern,
    voll.length - 1, // alles bis auf den Apostroph
    voll.length,
  ]);
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

/** Ein FormKontext auf Weg „es" mit dem gegebenen Tastenstand. */
function ctxEsMit(introduced: readonly string[], seed: number, count = 12): FormKontext {
  return {
    lernweg: "es",
    introduced: [...introduced],
    shift: introduced.includes(SHIFT_UNIT),
    oneHand: false,
    stufe: "kids",
    lang: "es",
    esVariante: "es-ES",
    sprache: "es",
    count,
    zufall: seededZufall(seed),
  };
}

/** Alles, was ein Kind bei dieser Form wirklich TIPPT (wie im fr-Wächter). */
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
    const nPunkte = nPunkteFuer(W);
    const nVoll = Math.max(...nPunkte);
    for (const n of nPunkte) {
      const allowed = allowedFromIntroduced(introducedUpTo(n, W), W);
      const korpusJeStufe: Record<string, unknown> = {};
      for (const stufe of STUFEN as Stufe[]) {
        const items = A.corpusItemsFor(stufe, allowed, variante);
        const entries = A.corpusEntriesFor(stufe, allowed, variante);
        korpusJeStufe[stufe] = {
          items: digest(items),
          entries: digest(entries.map((e) => `${e.index}|${e.kind}|${e.text}`)),
          // Am vollen Stand zusätzlich die letzten Zeilen im Klartext (lesbarer Diff).
          ...(n === nVoll ? { letzteZeilen: items.slice(-4) } : {}),
        };
      }
      // Englische Texte kommen auf jedem Weg mit (Johannes 28.09.): Übungssprache
      // „en" auf dem spanischen Weg - nur an drei Sprossen, derselbe Mechanismus.
      const jeStufeEn: Record<string, unknown> = {};
      if ([8, 30].includes(n) || n === nVoll) {
        for (const stufe of STUFEN as Stufe[]) {
          jeStufeEn[stufe] = {
            items: digest(A.corpusItemsFor(stufe, allowed, variante, "en")),
            entries: digest(
              A.corpusEntriesFor(stufe, allowed, variante, "en").map(
                (e) => `${e.index}|${e.kind}|${e.text}`,
              ),
            ),
          };
        }
      }
      jeN[`n${n}`] = { variante, korpus: korpusJeStufe, ...(Object.keys(jeStufeEn).length ? { korpusEn: jeStufeEn } : {}) };
    }
    // ★ D-2: ohne gelernte Umschalttaste fallen Grossbuchstaben-Zeilen weg (Erwachsene).
    const ohneUmschalt: Record<string, unknown> = {};
    for (const n of [8, 17, 18]) {
      const allowed = allowedFromIntroduced(introducedUpTo(n, W), W);
      ohneUmschalt[`n${n}`] = {
        items: digest(A.corpusItemsFor("erwachsen", allowed, variante, LANG, false)),
        entries: digest(
          A.corpusEntriesFor("erwachsen", allowed, variante, LANG, false).map(
            (e) => `${e.index}|${e.kind}|${e.text}`,
          ),
        ),
      };
    }
    jeLayout[layout] = { ...jeN, ohneUmschalt };
  }
  setLayout("es");

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

  // ── Wortherkunft (Gegenstück zu „Word roots": vorlagen.ts „palabras-*") ────
  setLayout("es");
  const palabrasIds = vorlagenFuer({ fuer: "uebung", lang: "es" })
    .map((v) => v.id)
    .sort();
  const palabrasChallengeIds = vorlagenFuer({ fuer: "challenge", lang: "es" })
    .map((v) => v.id)
    .sort();
  const wortherkunft: Record<string, unknown> = { ids: palabrasIds, challengeIds: palabrasChallengeIds };
  for (const stufe of STUFEN as Stufe[]) {
    const jeVorlage: Record<string, unknown> = {};
    for (const id of [...palabrasIds, ...palabrasChallengeIds]) {
      const vorschau = vorlageVorschau(id, { stufe, lang: "es", verbietenSs: false, lernweg: "es" });
      jeVorlage[id] = vorschau ? digest(vorschau.zeilen) : null;
    }
    wortherkunft[stufe] = jeVorlage;
  }

  // ── Wortspiel-Vorräte (Übungsformen, zwei Tastenstände x zwei Saaten) ─────
  const staende: { name: string; introduced: () => string[] }[] = [
    { name: "frueh19", introduced: () => introducedUpTo(19, W) },    { name: "mitte42", introduced: () => introducedUpTo(42, W) },
    { name: "voll", introduced: () => [...introOrder(W)] },
  ];
  const wortspiele: Record<string, unknown> = {};
  for (const stand of staende) {
    const jeForm: Record<string, unknown> = {};
    // Iglu-Raten (23.10.2026) kam nach der Aufnahme dazu, hat keine Zeilenrunde; sein Wächter ist tests/tastenflow-iglu.test.tsx.
    for (const form of UEBUNGSFORMEN.filter((f) => f.id !== "iglu")) {
      const runden: string[][] = [];
      for (const seed of [1, 7]) {
        const ctx = ctxEsMit(stand.introduced(), seed, 12);
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
 * Die Tastenstände, bei denen `unlockedSerien` aufgenommen wird (Tastatur
 * Spanien aktiv). Gemessen: bis n30 ist keine Serie frei, ab n34 die ersten
 * (kids 5), n52 mit Ziffern (alle 20 kids), n60 und voll - so stehen die
 * Serien mit Satzzeichen, Ziffern und Sonderzeichen auf dem Prüfstand.
 */
function serienStaende(): [string, Set<string>][] {
  return [
    ["n34", allowedFromIntroduced(introducedUpTo(34, W), W)],
    ["n52", allowedFromIntroduced(introducedUpTo(52, W), W)],
    ["n60", allowedFromIntroduced(introducedUpTo(60, W), W)],
    ["voll", allowedFromIntroduced([...introOrder(W)], W)],
  ];
}

/**
 * Serien-BASELINE: Slug + Inhalts-Fingerabdruck (Zeilen) jeder HEUTE
 * bestehenden Serie, plus die unlockedSerien-Slugs bei zwei Tastenständen und
 * die Namenslisten je Stufe. Wird NICHT per `toEqual` gegen den Live-Stand
 * geprüft (ein Anhängen wäre dann rot), sondern per TEILMENGEN-Test unten.
 */
function serienBaseline(): unknown {
  setLayout("es");
  const eintraege: Record<string, Record<string, { anzahl: number; hash: string; titel: string }>> = {};
  for (const stufe of STUFEN as Stufe[]) {
    const je: Record<string, { anzahl: number; hash: string; titel: string }> = {};
    for (const s of A.serienForStufe(stufe)) je[s.slug] = { ...digest(serieLines(s)), titel: s.titel };
    eintraege[stufe] = je;
  }
  const staende = serienStaende();
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
  setLayout("es");
  const serien = A.serienForStufe(stufe);
  const staende = serienStaende();
  const unlockedNamed: Record<string, Set<string>> = {};
  for (const [name, allowed] of staende) {
    unlockedNamed[name] = new Set(A.unlockedSerien(allowed, stufe).map((s) => s.slug));
  }
  setLayout("de");
  return { serien, unlockedNamed };
}

describe("★★★★★ Weg „es\" liefert vor dem Sprachregister-Umbau denselben Inhalt wie heute (G1a)", () => {
  afterAll(() => setLayout("de"));

  it("die Aufnahme ist deterministisch (zweimal gerechnet, gleich)", () => {
    expect(aufnahmeKern()).toEqual(aufnahmeKern());
  });

  it("Korpus, Arcs, Lektionen, Wortherkunft und Wortspiel-Vorräte auf Weg „es\" sind unverändert", () => {
    const jetzt = aufnahmeKern();
    if (process.env.LERNWEG_INHALT_ES_GOLDEN_AUFNEHMEN === "1") {
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

  it("Falle 32: corpusItemsFor und corpusEntriesFor liefern dieselben Zeilen (quer durch den Weg)", () => {
    for (const layout of LAYOUTS) {
      setLayout(layout);
      for (const n of [8, 19, 34, 44, 56, introOrder(W).length]) {
        const allowed = allowedFromIntroduced(introducedUpTo(n, W), W);
        for (const stufe of STUFEN as Stufe[]) {
          const items = A.corpusItemsFor(stufe, allowed, variantFuer(layout));
          const entries = A.corpusEntriesFor(stufe, allowed, variantFuer(layout));
          expect(sortiert(entries.map((e) => e.text)), `${layout} n=${n} stufe=${stufe}`).toEqual(
            sortiert(items),
          );
        }
      }
    }
    setLayout("de");
  });

  it("die Aufnahme ist nicht leer UND die späten Zeilen tragen Satzzeichen, Ziffern, Apostroph (Gegenprobe, Falle 4)", () => {
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    for (const layout of LAYOUTS) {
      // Die volle Länge je Tastatur (es 71, latam 70 - kein „€").
      const nMax = Math.max(
        ...Object.keys(vorher.kern.jeLayout[layout])
          .filter((k) => /^n\d+$/.test(k))
          .map((k) => Number(k.slice(1))),
      );
      const voll = vorher.kern.jeLayout[layout][`n${nMax}`];
      for (const stufe of STUFEN) {
        expect(voll.korpus[stufe].items.anzahl, `${layout} ${stufe}`).toBeGreaterThan(0);
        expect(voll.korpus[stufe].letzteZeilen.length).toBe(4);
      }
      // Ein früher Stand hat (noch) nichts aus Sätzen: die Aufnahme unterscheidet die Sprossen.
      expect(vorher.kern.jeLayout[layout].n3.korpus.teens.items.anzahl).toBe(0);
      expect(vorher.kern.jeLayout[layout][`n${nMax}`].korpus.teens.items.hash).not.toBe(
        vorher.kern.jeLayout[layout].n30.korpus.teens.items.hash,
      );
    }
    // Live: am vollen Stand gibt es wirklich Zeilen mit Ziffer, ¿/¡ und Apostroph -
    // sonst prüfte der Hash nur Buchstabenzeilen.
    setLayout("es");
    const allowed = allowedFromIntroduced([...introOrder(W)], W);
    const alle = (STUFEN as Stufe[]).flatMap((s) => A.corpusItemsFor(s, allowed, "es-ES"));
    expect(alle.some((z) => /\d/.test(z)), "Zeile mit Ziffer").toBe(true);
    expect(alle.some((z) => z.includes("'")), "Zeile mit Apostroph").toBe(true);
    expect(alle.some((z) => z.includes("¿") && z.includes("?")), "Zeile mit ¿…?").toBe(true);
    expect(alle.some((z) => z.includes("¡") && z.includes("!")), "Zeile mit ¡…!").toBe(true);
    expect(alle.some((z) => /[(\[{]/.test(z)), "Zeile mit Klammer").toBe(true);
    setLayout("de");
    expect(vorher.kern.lektionen.es.ids.length).toBeGreaterThan(0);
    expect(vorher.kern.wortherkunft.ids.length).toBeGreaterThan(0);
    expect(Array.isArray(vorher.kern.arcs.teens)).toBe(true);
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
        vorher.serienBaseline.eintraege[stufe] as Record<
          string,
          { anzahl: number; hash: string; titel: string }
        >,
      )) {
        const live = bySlug.get(slug);
        expect(live, `Serie „${slug}" (Stufe ${stufe}) fehlt jetzt`).toBeTruthy();
        expect(live!.titel, `Serie „${slug}" hat einen anderen Titel`).toBe(golden.titel);
        expect(
          digest(serieLines(live!)),
          `Serie „${slug}" hat sich inhaltlich geändert`,
        ).toEqual({ anzahl: golden.anzahl, hash: golden.hash });
        geprueft++;
      }
    }
    expect(geprueft).toBeGreaterThan(30); // Gegenprobe: es wird wirklich viel geprüft
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
          expect(
            liveSlugs.has(slug),
            `„${slug}" war frei (Stufe ${stufe}, ${stand}), jetzt nicht mehr`,
          ).toBe(true);
        }
      }
    }
  });
});

function sortiert(s: Iterable<string>): string[] {
  return [...s].sort();
}
