/**
 * ★★★★★ WÄCHTER: Was Weg „de" an INHALT serviert, bleibt unverändert (E4a).
 *
 * Etappe E4a (BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md §6.2/§10, Zeile E4)
 * gibt Korpus-Zeilen, Serien und Themensträngen ein optionales `nurWeg`-Feld
 * (`corpus.ts`/`serie.ts`/`arcs.ts`) und fädelt dafür `lernweg` als
 * Pflicht-Parameter durch `corpusItemsFor`/`corpusEntriesFor`,
 * `serienForStufe`/`unlockedSerien`/`lockedSerien`/`firstOpenSerie`/
 * `nextSerieFor`/`resumeSerie` und `arcsFor`. Reine Verdrahtung - **kein**
 * heutiger Eintrag trägt `nurWeg`, also darf sich an dem, was ein Kind auf
 * Weg „de" sieht, NICHTS ändern (dieselbe Zusage wie E1, Bauplan §2.2
 * „Bestand"). Das ist bei diesem Umbau von vornherein garantiert (der Filter
 * ist ein No-op, solange kein `nurWeg` gesetzt ist), UND HIER FESTGESCHRIEBEN
 * - damit ein künftiger Fehler (z. B. ein Eintrag, dem versehentlich
 * `nurWeg: "de"` mitgegeben wird und der dadurch plötzlich VERSCHWINDET, weil
 * ein Aufrufer `lernweg: "en"` übergibt) sofort auffällt.
 *
 * ── WARUM EIN HASH STATT DER VOLLEN TEXTE ───────────────────────────────────
 * Der volle Korpus-Vorrat über alle Sprossen-Stichproben × Tastaturen ×
 * Stufen × Sprachen ergibt rund 4 MB Text (nachgemessen) - zu groß für eine
 * Fixture-Datei in einem Repository ohne Remote (Sensorik/apps/CLAUDE.md:
 * schlanke Dateien). Jede Zeilen-Liste wird darum über SHA-256 auf einen
 * kurzen Fingerabdruck reduziert (`fingerabdruck`) - jede einzelne
 * Zeichenänderung in irgendeiner Zeile ändert den Hash, die Prüfung bleibt
 * also exakt so scharf wie ein Volltext-Vergleich. Serien-Slugs und
 * Arc-IDs sind klein genug für die volle Liste.
 *
 * ── WAS SICH NACH DEM UMBAU ÄNDERN DARF ─────────────────────────────────────
 * Nichts am Verfahren - nur der Block „AUFRUFE" (unten), der die Funktionen
 * seit E4a mit dem neuen Pflicht-Parameter `lernweg = "de"` aufruft. Wird
 * dieser Test rot, ist das ein HALT-SIGNAL (`feedback_test_kennt_die_abwaegung`):
 * den Code reparieren, nie die Fixture-Datei neu schreiben - AUSSER eine mit
 * Johannes besprochene Änderung an Weg „de" verlangt es ausdrücklich.
 *
 * Neu aufnehmen (nur nach einer besprochenen Änderung): `LERNWEG_INHALT_GOLDEN_
 * AUFNEHMEN=1 npx vitest run tests/tastenflow-lernweg-inhalt-de-unveraendert.test.ts`.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, expect, it, afterAll } from "vitest";
import { STUFEN, type Stufe, type Lang } from "../src/lib/typing/account";
import { introducedUpTo } from "../src/lib/typing/letters";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import {
  corpusItemsFor,
  passtLernweg,
  type CorpusItem,
} from "../src/lib/typing/corpus";
import {
  allowedFromIntroduced,
  serienForStufe,
  unlockedSerien,
} from "../src/lib/typing/serien";
import { arcsFor } from "../src/lib/typing/arcs";
import type { Lernweg } from "../src/lib/typing/lernweg";
import { CORPUS as KORPUS_ALLE_DE, CORPUS_EN as KORPUS_ALLE_EN } from "../src/lib/typing/corpus";

/** Text auf Buchstaben/Ziffern reduziert - wie `dedupKey` in corpus.ts. */
function norm(text: string): string {
  return text.toLowerCase().replace(/[^a-zäöüß0-9]+/g, " ").trim();
}
/** Alle Zeilen, die ausdrücklich nur für Weg „en" geschrieben sind. */
const NUR_EN = new Set(
  [...KORPUS_ALLE_DE, ...KORPUS_ALLE_EN].filter((it) => it.nurWeg === "en").map((it) => norm(it.text)),
);

const DATEI = resolve(__dirname, "fixtures/tastenflow-lernweg-inhalt-de-golden.json");

// ── AUFRUFE ──────────────────────────────────────────────────────────────────
// Der einzige Teil, der sich mit E4a ändern durfte: seither mit dem neuen
// Pflicht-Parameter `lernweg`, hier ausdrücklich „de" - Weg „de" ist der
// Gegenstand dieses Wächters.
const W: Lernweg = "de";
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
const N_PUNKTE = [2, 5, 8, 10, 13, 16, 20, 24, 28, 31, 40, 50, 64];

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

function aufnahme(): unknown {
  const jeLayout: Record<string, unknown> = {};
  for (const layout of LAYOUTS) {
    setLayout(layout);
    const jeN: Record<string, unknown> = {};
    for (const n of N_PUNKTE) {
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

  // Die vollen Serien-Regale (unabhängig vom Tastenstand) - dieselbe Funktion,
  // die auch die Bücherei-Registrierung befragt.
  const serienRegale: Record<string, unknown> = {};
  for (const lang of LANGS) {
    const jeStufe: Record<string, unknown> = {};
    for (const stufe of STUFEN as Stufe[]) {
      jeStufe[stufe] = A.serienForStufe(stufe, lang)
        .map((s) => s.slug)
        .sort();
    }
    serienRegale[lang] = jeStufe;
  }

  return JSON.parse(JSON.stringify({ jeLayout, arcs, serienRegale }));
}

describe("★★★★★ Weg „de\" liefert nach E4a denselben Inhalt wie vorher", () => {
  afterAll(() => setLayout("de"));

  it("die Aufnahme ist deterministisch (zweimal gerechnet, gleich)", () => {
    expect(aufnahme()).toEqual(aufnahme());
  });

  it("Korpus, Serien und Stränge auf Weg „de\" sind unverändert", () => {
    const jetzt = aufnahme();
    if (process.env.LERNWEG_INHALT_GOLDEN_AUFNEHMEN === "1") {
      mkdirSync(dirname(DATEI), { recursive: true });
      writeFileSync(DATEI, JSON.stringify(jetzt, null, 1) + "\n", "utf8");
    }
    expect(existsSync(DATEI), `Aufnahme fehlt: ${DATEI}`).toBe(true);
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    expect(jetzt).toEqual(vorher);
  });

  it("die Aufnahme ist nicht leer (Gegenprobe: sie misst wirklich etwas)", () => {
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    expect(vorher.jeLayout.de.n64.korpus.de.teens.anzahl).toBeGreaterThan(0);
    expect(vorher.jeLayout.de.n2.korpus.de.teens.anzahl).toBe(0);
    expect(vorher.serienRegale.de.teens.length).toBeGreaterThan(0);
    expect(vorher.arcs.teens.de.length).toBeGreaterThan(0);
  });

  // ── Der synthetische Eintrag (Auftrag Punkt 4) ──────────────────────────────
  describe("ein Eintrag mit `nurWeg` erscheint nur auf seinem Weg (E4a-Mechanik)", () => {
    it("passtLernweg ist die EINE Stelle, die corpusItemsFor/corpusEntriesFor/serienForStufe/arcsFor gleichermassen fragen", () => {
      // Synthetischer Korpus-Eintrag, nur auf Weg "en" gedacht - genau das
      // neue Feld aus corpus.ts, hier ohne echten Korpus-Eintrag anzufassen.
      const synthetischerEintragEn: Pick<CorpusItem, "nurWeg"> = { nurWeg: "en" };
      expect(passtLernweg(synthetischerEintragEn.nurWeg, "en")).toBe(true);
      expect(passtLernweg(synthetischerEintragEn.nurWeg, "de")).toBe(false);

      const synthetischerEintragDe: Pick<CorpusItem, "nurWeg"> = { nurWeg: "de" };
      expect(passtLernweg(synthetischerEintragDe.nurWeg, "de")).toBe(true);
      expect(passtLernweg(synthetischerEintragDe.nurWeg, "en")).toBe(false);

      // Ohne `nurWeg` (JEDER heutige Eintrag) gilt er weiter auf BEIDEN Wegen.
      const gewoehnlicherEintrag: Pick<CorpusItem, "nurWeg"> = {};
      expect(passtLernweg(gewoehnlicherEintrag.nurWeg, "de")).toBe(true);
      expect(passtLernweg(gewoehnlicherEintrag.nurWeg, "en")).toBe(true);
    });

    it("Weg „en\" bekommt für denselben Tastenstand genau das, was Weg „de\" bekommt, PLUS die nurWeg-en-Zeilen", () => {
      // ★ Nachbesserung 24.09.2026 (E4b): Bis E4a war hier „beide Mengen
      // gleich" gefordert - das galt nur, solange noch keine Zeile `nurWeg`
      // trug. Die dauerhafte Regel ist schärfer: Weg „en" verliert nichts
      // Gemeinsames, und alles, was er mehr hat, ist ausdrücklich für ihn.
      setLayout("de");
      try {
        for (const n of [13, 28, 50]) {
          const allowedDe = allowedFromIntroduced(introducedUpTo(n, "de"), "de");
          for (const lang of LANGS) {
            for (const stufe of STUFEN as Stufe[]) {
              const aufDe = corpusItemsFor({ stufe, allowed: allowedDe, lang, lernweg: "de" });
              const aufEn = corpusItemsFor({ stufe, allowed: allowedDe, lang, lernweg: "en" });
              // Ausgeliefert werden die fertigen Zeilen (Satzzeichen je
              // Lernstand) - verglichen wird darum über den Text.
              const rest = new Map<string, number>();
              for (const t of aufEn) rest.set(t, (rest.get(t) ?? 0) + 1);
              for (const t of aufDe) {
                const k = rest.get(t) ?? 0;
                expect(k, `n=${n} lang=${lang} stufe=${stufe}: fehlt auf Weg „en": ${t}`).toBeGreaterThan(0);
                rest.set(t, k - 1);
              }
              for (const [text, k] of rest) {
                if (k > 0) {
                  expect(NUR_EN.has(norm(text)), `n=${n} lang=${lang} stufe=${stufe}: nur auf „en", aber keine nurWeg-Zeile: ${text}`).toBe(true);
                }
              }
            }
          }
        }
      } finally {
        setLayout("de");
      }
    });
  });
});
