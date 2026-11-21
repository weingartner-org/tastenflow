/**
 * ★★★★★ WÄCHTER: Was Weg „en" an INHALT serviert, bleibt unverändert - VOR
 * dem Umbau auf den dritten Weg „fr" aufgenommen (E1d).
 *
 * BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md §2.3 Punkt 2 und §14 Zeile E1:
 * das Gegenstück zu `tests/tastenflow-lernweg-inhalt-de-unveraendert.test.ts`
 * (Vorbild für Aufbau und Verfahren, dort ausführlich erklärt) - hier für Weg
 * „en" statt „de". Erfasst genau das, was der Auftrag verlangt: Korpus,
 * Serien, Wortspiel-Vorräte, Lektionen und Word roots.
 *
 * ── WARUM EIN HASH STATT DER VOLLEN TEXTE ───────────────────────────────────
 * Wie beim de-Wächter: der volle Textvorrat über alle Stichproben wäre zu
 * gross für eine Fixture-Datei in einem Repository ohne Remote (Sensorik/
 * apps/CLAUDE.md: schlanke Dateien). Jede Zeilen-Liste wird darum über
 * SHA-256 auf einen kurzen Fingerabdruck reduziert (`fingerabdruck`) - jede
 * einzelne Zeichenänderung ändert den Hash, die Prüfung bleibt also exakt so
 * scharf wie ein Volltext-Vergleich.
 *
 * ── WAS SICH NACH DEM FRANZÖSISCH-UMBAU ÄNDERN DARF ─────────────────────────
 * Nichts am Verfahren - nur der Block „AUFRUFE" (unten). Wird dieser Test
 * rot, ist das ein HALT-SIGNAL: den Code reparieren, NIE die Fixture-Datei
 * neu schreiben - AUSSER eine mit dem Chat (Opus) besprochene Änderung an
 * Weg „en" verlangt es ausdrücklich.
 *
 * Neu aufnehmen (nur nach einer besprochenen Änderung): `LERNWEG_INHALT_EN_
 * GOLDEN_AUFNEHMEN=1 npx vitest run
 * tests/tastenflow-lernweg-inhalt-en-unveraendert.test.ts`.
 *
 * ── NACHBESSERUNG 25.09.2026 (Gegenprobe des Chats war GRÜN, sollte ROT sein) ─
 * Die erste Fassung stichprobte nur bis n=27 (Buchstaben + Umschalttaste) -
 * Satzzeichen, Ziffern und Sonderzeichen waren in KEINEM Stand frei, obwohl
 * sie den grössten Teil von Korpus und Serien ausmachen. Eine geänderte Zeile
 * mit Punkt/Komma/Ziffer blieb darum unbemerkt: Sie kam schlicht in keiner
 * Stichprobe vor. `nPunkteFuer` (unten) hängt seither je Tastatur den VOLLEN
 * Stand und den Stand „direkt nach den Satzzeichen, vor den Ziffern" an -
 * beide dynamisch aus `introOrder`/`digitOrder` gerechnet (nicht hart
 * verdrahtet, weil UK ein Zeichen mehr hat als de/us). Die Fixture wurde auf
 * demselben Code-Stand wie zuvor (Commit `bcfe33aa`, seither keine
 * `src/`-Änderung an Weg „en") neu aufgenommen - erlaubt, weil der Chat es
 * für genau diese Nachbesserung freigegeben hat.
 *
 * ⚠️ ZWEITER FUND bei der Gegenprobe „Serien-Zeile mit Ziffer ändern": Der
 * „Serien"-Block hashte bis dahin nur die SLUGS der freigeschalteten Serien
 * (`unlockedSerien(...).map(s => s.slug)`) - eine geänderte ZEILE innerhalb
 * einer Serie (ohne dass sich dadurch ihr Frei-Status ändert) blieb also
 * unsichtbar, ganz unabhängig von `nPunkteFuer`. Behoben: `serienRegale`
 * (alle Serien der Stufe, unabhängig vom Tastenstand - `serienForStufe`)
 * bekommt jetzt zusätzlich einen Inhalts-Fingerabdruck über ALLE Zeilen
 * (`serieLines`), nicht nur die Slug-Liste - das fängt jede Textänderung,
 * unabhängig davon, ob die Serie bei irgendeinem `n` aus `nPunkteFuer`
 * überhaupt frei ist.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, expect, it, afterAll } from "vitest";
import { STUFEN, type Stufe, type Lang } from "../src/lib/typing/account";
import { SHIFT_UNIT, introOrder, introducedUpTo } from "../src/lib/typing/letters";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { corpusItemsFor } from "../src/lib/typing/corpus";
import { allowedFromIntroduced, serienForStufe, unlockedSerien } from "../src/lib/typing/serien";
import { serieLines } from "../src/lib/typing/serie";
import { arcsFor } from "../src/lib/typing/arcs";
import { lernwegDef, type Lernweg } from "../src/lib/typing/lernweg";
import { lektionenFuer } from "../src/lib/typing/curriculum";
import { vorlagenFuer, vorlageVorschau } from "../src/lib/typing/vorlagen";
import { UEBUNGSFORMEN, type FormKontext, type Uebungsform } from "../src/lib/typing/uebungsformen";
import { waehleSalatwort } from "../src/lib/typing/uebungsformen/buchstabensalat";

const DATEI = resolve(__dirname, "fixtures/tastenflow-lernweg-inhalt-en-golden.json");

// ── AUFRUFE ──────────────────────────────────────────────────────────────────
// Der einzige Teil, der sich mit dem Umbau ändern darf - hier ausdrücklich
// mit dem Lernweg „en".
const W: Lernweg = "en";
const A = {
  corpusItemsFor: (stufe: Stufe, allowed: Set<string>, lang: Lang) =>
    corpusItemsFor({ stufe, allowed, lang, lernweg: W }),
  unlockedSerien: (allowed: Set<string>, stufe: Stufe, lang: Lang) =>
    unlockedSerien(allowed, stufe, lang, W),
  serienForStufe: (stufe: Stufe, lang: Lang) => serienForStufe(stufe, lang, W),
  arcsFor: (stufe: Stufe, lang: Lang) => arcsFor(stufe, lang, W),
};
// ── ENDE AUFRUFE ─────────────────────────────────────────────────────────────

const LAYOUTS: LayoutId[] = ["de", "us"];
const LANGS: Lang[] = ["de", "en"];
// ★ Nachbesserung (Chat-Gegenprobe 25.09.2026): Bis 27 sind nur Buchstaben
// (+ Umschalttaste) frei - Satzzeichen, Ziffern und Sonderzeichen kommen bei
// KEINEM dieser Stände vor, obwohl sie den grössten Teil von Korpus und
// Serien ausmachen. Eine geänderte Zeile mit Punkt/Ziffer blieb darum
// unbemerkt (siehe Kopf-Kommentar unten). Die zwei fehlenden Stände werden
// PRO TASTATUR dynamisch angehängt (nicht hart verdrahtet, weil die
// Gesamtlänge je Tastatur leicht schwankt - UK hat „£" zusätzlich):
//  · der VOLLE Stand (`introOrder(W).length`) - alles frei, auch Sonderzeichen.
//  · der Stand DIREKT NACH den Satzzeichen, VOR den Ziffern - deckt die
//    Satzzeichen-Zeilen ab, ohne dass Ziffern/Sonderzeichen schon mitspielen.
const N_PUNKTE_BASIS = [2, 5, 8, 10, 13, 16, 20, 23, 27];

/** Die N-Stichproben für EINE Tastatur - Basis + volle Länge + „nach den
 *  Satzzeichen, vor den Ziffern" (siehe Kommentar oben). Setzt das Layout
 *  NICHT selbst - der Aufrufer hat es schon aktiv. */
function nPunkteFuer(lernweg: Lernweg): number[] {
  const voll = introOrder(lernweg);
  const digitSet = new Set(lernwegDef(lernweg).digitOrder);
  const nachSatzzeichen = voll.findIndex((u) => digitSet.has(u));
  const menge = new Set([...N_PUNKTE_BASIS, nachSatzzeichen, voll.length]);
  return [...menge].sort((a, b) => a - b);
}

/** Kurzer, stabiler Fingerabdruck einer Zeilen-Liste (siehe Kopf-Kommentar). */
function fingerabdruck(zeilen: readonly string[]): string {
  const hash = createHash("sha256");
  for (const z of zeilen) hash.update(z).update("\u0000");
  return hash.digest("hex").slice(0, 24);
}

/** Zählung + Fingerabdruck statt Volltext (Fixture-Grösse). */
function digest(zeilen: readonly string[]): { anzahl: number; hash: string } {
  return { anzahl: zeilen.length, hash: fingerabdruck(zeilen) };
}

/** Kleiner deterministischer Zufallsgenerator (wie in tastenflow-lernweg-
 *  wortspiele.test.ts) - dieselbe Saat, dieselbe Folge. */
function seededZufall(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/** Ein FormKontext auf Weg „en" mit dem gegebenen Tastenstand (wie im Wächter
 *  für die 13 Wortspiele). */
function ctxEnMit(introduced: readonly string[], seed: number, count = 12): FormKontext {
  return {
    lernweg: "en",
    introduced: [...introduced],
    shift: introduced.includes(SHIFT_UNIT),
    oneHand: false,
    stufe: "kids",
    lang: "en",
    sprache: "en",
    count,
    zufall: seededZufall(seed),
  };
}

/** Alles, was ein Kind bei dieser Form wirklich TIPPT (wie im Wortspiele-
 *  Wächter - dort ausführlich begründet: nur `antworten`/`zeilen`, nicht die
 *  reine Ansage). */
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

function aufnahme(): unknown {
  const jeLayout: Record<string, unknown> = {};
  for (const layout of LAYOUTS) {
    setLayout(layout);
    const jeN: Record<string, unknown> = {};
    for (const n of nPunkteFuer(W)) {
      const allowed = allowedFromIntroduced(introducedUpTo(n, W), W);
      const korpus: Record<string, unknown> = {};
      const serien: Record<string, unknown> = {};
      for (const lang of LANGS) {
        const korpusJeStufe: Record<string, unknown> = {};
        const serienJeStufe: Record<string, unknown> = {};
        for (const stufe of STUFEN as Stufe[]) {
          korpusJeStufe[stufe] = digest(A.corpusItemsFor(stufe, allowed, lang));
          serienJeStufe[stufe] = A.unlockedSerien(allowed, stufe, lang)
            .map((s) => s.slug)
            .sort();
        }
        korpus[lang] = korpusJeStufe;
        serien[lang] = serienJeStufe;
      }
      jeN[`n${n}`] = { korpus, serien };
    }
    jeLayout[layout] = jeN;
  }
  setLayout("de");

  const arcs: Record<string, unknown> = {};
  for (const stufe of STUFEN as Stufe[]) {
    const jeSprache: Record<string, unknown> = {};
    for (const lang of LANGS) {
      jeSprache[lang] = A.arcsFor(stufe, lang)
        .map((a) => a.id)
        .sort();
    }
    arcs[stufe] = jeSprache;
  }

  // Die vollen Serien-Regale (unabhängig vom Tastenstand) - Slugs UND ein
  // Inhalts-Fingerabdruck über ALLE Zeilen jeder Serie (siehe Nachbesserung
  // im Kopf-Kommentar: eine geänderte Zeile ändert nicht immer den Frei-
  // Status, muss aber trotzdem auffallen).
  const serienRegale: Record<string, unknown> = {};
  for (const lang of LANGS) {
    const jeStufe: Record<string, unknown> = {};
    for (const stufe of STUFEN as Stufe[]) {
      const serien = A.serienForStufe(stufe, lang);
      jeStufe[stufe] = {
        slugs: serien.map((s) => s.slug).sort(),
        // Slug + Zeilen zusammen gehasht (nicht je Serie einzeln), damit eine
        // Serie, die ihre Zeilen mit einer ANDEREN Serie tauscht, ebenfalls
        // auffällt - nicht nur eine Zeilenänderung innerhalb derselben Serie.
        inhalt: digest(
          [...serien]
            .sort((a, b) => a.slug.localeCompare(b.slug))
            .flatMap((s) => [s.slug, ...serieLines(s)]),
        ),
      };
    }
    serienRegale[lang] = jeStufe;
  }

  // ── Lektionen (§6.2 des Bauplans: eigene Lektionsfolge EN_LESSONS) ────────
  const lektionen = {
    ids: lektionenFuer(W).map((l) => l.id),
    kinds: lektionenFuer(W).map((l) => l.kind),
    newKeys: lektionenFuer(W).map((l) => [...l.newKeys]),
    titles: digest(lektionenFuer(W).map((l) => l.title)),
  };

  // ── Word roots (§9.4: das englische Gegenstück zur Fremdwörterkunde) ─────
  setLayout("us");
  const wordRootIds = vorlagenFuer({ fuer: "uebung", lang: "en" })
    .map((v) => v.id)
    .filter((id) => id.startsWith("wurzeln-"))
    .sort();
  const wordRootChallengeIds = vorlagenFuer({ fuer: "challenge", lang: "en" })
    .map((v) => v.id)
    .filter((id) => id.startsWith("wurzelnc-"))
    .sort();
  const wordRoots: Record<string, unknown> = {};
  for (const stufe of STUFEN as Stufe[]) {
    const jeVorlage: Record<string, unknown> = {};
    for (const id of [...wordRootIds, ...wordRootChallengeIds]) {
      const vorschau = vorlageVorschau(id, { stufe, lang: "en", verbietenSs: false, lernweg: "en" });
      jeVorlage[id] = vorschau ? digest(vorschau.zeilen) : null;
    }
    wordRoots[stufe] = jeVorlage;
  }

  // ── Wortspiel-Vorräte (13 Übungsformen, Bauplan §6.3/§9.4) ────────────────
  // Zwei Tastenstände (früh/voll, wie im Wächter für die 13 Wortspiele) je
  // zwei Stichproben-Saaten - was jede Form auf Weg „en" wirklich austeilt.
  const staende: { name: string; introduced: () => string[] }[] = [
    { name: "frueh16", introduced: () => introducedUpTo(16, W) },
    { name: "voll", introduced: () => [...introOrder(W)] },
  ];
  const wortspiele: Record<string, unknown> = {};
  for (const stand of staende) {
    const jeForm: Record<string, unknown> = {};
    // Iglu-Raten (23.10.2026) kam nach der Aufnahme dazu, hat keine Zeilenrunde; sein Wächter ist tests/tastenflow-iglu.test.tsx.
    for (const form of UEBUNGSFORMEN.filter((f) => f.id !== "iglu")) {
      const runden: string[][] = [];
      for (const seed of [1, 7]) {
        const ctx = ctxEnMit(stand.introduced(), seed, 12);
        if (!form.taugt(ctx)) continue;
        runden.push(getippteTexte(form, ctx));
      }
      jeForm[form.id] = runden.map((r) => digest(r));
    }
    wortspiele[stand.name] = jeForm;
  }
  setLayout("de");

  return JSON.parse(JSON.stringify({ jeLayout, arcs, serienRegale, lektionen, wordRoots, wortspiele }));
}

describe("★★★★★ Weg „en\" liefert vor dem Französisch-Umbau denselben Inhalt wie heute", () => {
  afterAll(() => setLayout("de"));

  it("die Aufnahme ist deterministisch (zweimal gerechnet, gleich)", () => {
    expect(aufnahme()).toEqual(aufnahme());
  });

  it("Korpus, Serien, Wortspiel-Vorräte, Lektionen und Word roots auf Weg „en\" sind unverändert", () => {
    const jetzt = aufnahme();
    if (process.env.LERNWEG_INHALT_EN_GOLDEN_AUFNEHMEN === "1") {
      mkdirSync(dirname(DATEI), { recursive: true });
      writeFileSync(DATEI, JSON.stringify(jetzt, null, 1) + "\n", "utf8");
    }
    expect(existsSync(DATEI), `Aufnahme fehlt: ${DATEI}`).toBe(true);
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    expect(jetzt).toEqual(vorher);
  });

  it("die Aufnahme ist nicht leer (Gegenprobe: sie misst wirklich etwas)", () => {
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    expect(vorher.jeLayout.us.n27.korpus.en.teens.anzahl).toBeGreaterThan(0);
    expect(vorher.jeLayout.us.n2.korpus.en.teens.anzahl).toBe(0);
    expect(vorher.serienRegale.en.teens.slugs.length).toBeGreaterThan(0);
    expect(vorher.serienRegale.en.teens.inhalt.anzahl).toBeGreaterThan(0);
    expect(vorher.arcs.teens.en.length).toBeGreaterThan(0);
    expect(vorher.lektionen.ids.length).toBeGreaterThan(0);
    expect(Object.keys(vorher.wordRoots.teens).length).toBeGreaterThan(0);
    expect(Object.keys(vorher.wortspiele.voll).length).toBeGreaterThan(0);
  });

  it("deckt jetzt auch den vollen Stand ab - Satzzeichen/Ziffern/Sonderzeichen sind erfasst (Nachbesserung 25.09.2026)", () => {
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    setLayout("us");
    const punkte = nPunkteFuer("en");
    setLayout("de");
    const voll = Math.max(...punkte);
    expect(voll).toBeGreaterThan(27); // die Lücke, die die Gegenprobe fand
    const schluessel = `n${voll}`;
    expect(vorher.jeLayout.us[schluessel], `Stand ${schluessel} fehlt in der Fixture`).toBeTruthy();
    // Beim vollen Stand kommen strikt MEHR Korpus-Zeilen vor als bei n27 (dort
    // durften Satzzeichen/Ziffern/Sonderzeichen noch nicht auftreten) - genau
    // die Zeilen, an denen die Chat-Gegenprobe ("All safe!" statt ".") vorbei-
    // gerutscht wäre, wenn sie hier weiter fehlten.
    expect(vorher.jeLayout.us[schluessel].korpus.en.teens.anzahl).toBeGreaterThan(
      vorher.jeLayout.us.n27.korpus.en.teens.anzahl,
    );
  });
});
