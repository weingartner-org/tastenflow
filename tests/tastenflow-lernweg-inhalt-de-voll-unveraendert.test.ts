/**
 * ★★★★★ WÄCHTER (ZUSATZ): Weg „de" liefert am VOLLEN Stand denselben Inhalt
 * wie heute - schliesst eine Lücke im bestehenden `tastenflow-lernweg-
 * inhalt-de-unveraendert.test.ts` (25.09.2026).
 *
 * ── WARUM EIN EIGENER, ZUSÄTZLICHER TEST (nicht der bestehende geändert) ────
 * Der bestehende de-Wächter (`tastenflow-lernweg-inhalt-de-unveraendert.test.ts`)
 * stichprobt bis `N_PUNKTE` = … 64 - das liegt zwar (anders als der
 * ursprüngliche en-Wächter vor seiner Nachbesserung) bereits HINTER den
 * Satzzeichen- und Ziffern-Grenzen, aber VOR dem wirklich vollen Stand: auf
 * der de-Tastatur sind das volle 73 Einheiten (9 mehr als 64), auf der
 * us-Tastatur 66 (2 mehr). Die letzten paar Sonderzeichen-Plätze kommen also
 * in KEINER Stichprobe des bestehenden Wächters vor - dieselbe Fehlerklasse,
 * die die Gegenprobe des Chats am englischen Wächter fand (dort viel
 * gravierender: n=27 liess Satzzeichen/Ziffern/Sonderzeichen komplett aus).
 *
 * Die bestehende de-Fixture wird laut fester Regel NIE neu geschrieben, ausser
 * einer ausdrücklich besprochenen Änderung an Weg „de" (Kopf-Kommentar dort,
 * `feedback_test_kennt_die_abwaegung`) - darum HIER ein eigener, ZUSÄTZLICHER
 * Wächter mit eigener, heute frisch aufgenommener Fixture, NUR für den vollen
 * Stand. Er ersetzt den bestehenden Wächter nicht, sondern ergänzt ihn.
 *
 * ── ZWEITER FUND (beim Bau dieses Zusatz-Wächters, siehe `tastenflow-lernweg-
 *    inhalt-en-unveraendert.test.ts` für die ausführliche Begründung) ────────
 * „Serien" wird hier nicht nur über die SLUGS der freigeschalteten Serien
 * geprüft (das erkennt nur, ob eine Serie ihren Frei-Status wechselt), sondern
 * zusätzlich über einen Inhalts-Fingerabdruck ALLER Zeilen jeder Serie der
 * Stufe (`serieLines`, unabhängig vom Tastenstand) - eine geänderte ZEILE
 * innerhalb einer bereits freigeschalteten Serie wäre sonst unsichtbar.
 *
 * ── WARUM EIN HASH STATT DER VOLLEN TEXTE ───────────────────────────────────
 * Wie bei den anderen Inhalts-Wächtern: SHA-256-Fingerabdruck statt Volltext
 * (Fixture-Grösse, Sensorik/apps/CLAUDE.md: schlanke Dateien).
 *
 * ── WAS SICH NACH DEM FRANZÖSISCH-UMBAU ÄNDERN DARF ─────────────────────────
 * Nur der Block „AUFRUFE" unten. Wird dieser Test rot, ist das ein
 * HALT-SIGNAL: den Code reparieren, NIE die Fixture-Datei neu schreiben -
 * ausser einer mit dem Chat (Opus) besprochenen, bewussten Änderung an Weg
 * „de".
 *
 * Neu aufnehmen (nur nach einer besprochenen Änderung): `LERNWEG_INHALT_DE_
 * VOLL_GOLDEN_AUFNEHMEN=1 npx vitest run
 * tests/tastenflow-lernweg-inhalt-de-voll-unveraendert.test.ts`.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, expect, it, afterAll } from "vitest";
import { STUFEN, type Stufe, type Lang } from "../src/lib/typing/account";
import { introOrder, introducedUpTo } from "../src/lib/typing/letters";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { corpusItemsFor } from "../src/lib/typing/corpus";
import { allowedFromIntroduced, serienForStufe, unlockedSerien } from "../src/lib/typing/serien";
import { serieLines } from "../src/lib/typing/serie";
import type { Lernweg } from "../src/lib/typing/lernweg";

const DATEI = resolve(__dirname, "fixtures/tastenflow-lernweg-inhalt-de-voll-golden.json");

// ── AUFRUFE ──────────────────────────────────────────────────────────────────
const W: Lernweg = "de";
const A = {
  corpusItemsFor: (stufe: Stufe, allowed: Set<string>, lang: Lang) =>
    corpusItemsFor({ stufe, allowed, lang, lernweg: W }),
  unlockedSerien: (allowed: Set<string>, stufe: Stufe, lang: Lang) =>
    unlockedSerien(allowed, stufe, lang, W),
  serienForStufe: (stufe: Stufe, lang: Lang) => serienForStufe(stufe, lang, W),
};
// ── ENDE AUFRUFE ─────────────────────────────────────────────────────────────

const LAYOUTS: LayoutId[] = ["de", "us"];
const LANGS: Lang[] = ["de", "en"];

/** Kurzer, stabiler Fingerabdruck einer Zeilen-Liste (siehe Kopf-Kommentar). */
function fingerabdruck(zeilen: readonly string[]): string {
  const hash = createHash("sha256");
  for (const z of zeilen) hash.update(z).update("\u0000");
  return hash.digest("hex").slice(0, 24);
}

function digest(zeilen: readonly string[]): { anzahl: number; hash: string } {
  return { anzahl: zeilen.length, hash: fingerabdruck(zeilen) };
}

function aufnahme(): unknown {
  const jeLayout: Record<string, unknown> = {};
  for (const layout of LAYOUTS) {
    setLayout(layout);
    const voll = introOrder(W).length;
    const allowed = allowedFromIntroduced(introducedUpTo(voll, W), W);
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
    jeLayout[layout] = { voll, korpus, serien };
  }
  setLayout("de");

  // Die vollen Serien-Regale (unabhängig vom Tastenstand) mit Inhalts-
  // Fingerabdruck - schliesst den zweiten Fund (siehe Kopf-Kommentar).
  const serienRegale: Record<string, unknown> = {};
  for (const lang of LANGS) {
    const jeStufe: Record<string, unknown> = {};
    for (const stufe of STUFEN as Stufe[]) {
      const serien = A.serienForStufe(stufe, lang);
      jeStufe[stufe] = {
        slugs: serien.map((s) => s.slug).sort(),
        inhalt: digest(
          [...serien]
            .sort((a, b) => a.slug.localeCompare(b.slug))
            .flatMap((s) => [s.slug, ...serieLines(s)]),
        ),
      };
    }
    serienRegale[lang] = jeStufe;
  }

  return JSON.parse(JSON.stringify({ jeLayout, serienRegale }));
}

describe("★★★★★ Weg „de\" liefert am VOLLEN Stand denselben Inhalt wie heute (Zusatz)", () => {
  afterAll(() => setLayout("de"));

  it("die Aufnahme ist deterministisch (zweimal gerechnet, gleich)", () => {
    expect(aufnahme()).toEqual(aufnahme());
  });

  it("Korpus und Serien auf Weg „de\" sind am vollen Stand unverändert", () => {
    const jetzt = aufnahme();
    if (process.env.LERNWEG_INHALT_DE_VOLL_GOLDEN_AUFNEHMEN === "1") {
      mkdirSync(dirname(DATEI), { recursive: true });
      writeFileSync(DATEI, JSON.stringify(jetzt, null, 1) + "\n", "utf8");
    }
    expect(existsSync(DATEI), `Aufnahme fehlt: ${DATEI}`).toBe(true);
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    expect(jetzt).toEqual(vorher);
  });

  it("die Aufnahme ist nicht leer UND liegt wirklich über dem bestehenden N_PUNKTE-Höchstwert (64)", () => {
    const vorher = JSON.parse(readFileSync(DATEI, "utf8"));
    expect(vorher.jeLayout.de.voll).toBeGreaterThan(64);
    expect(vorher.jeLayout.us.voll).toBeGreaterThan(64);
    expect(vorher.jeLayout.de.korpus.de.teens.anzahl).toBeGreaterThan(0);
    expect(vorher.serienRegale.de.teens.slugs.length).toBeGreaterThan(0);
    expect(vorher.serienRegale.de.teens.inhalt.anzahl).toBeGreaterThan(0);
  });
});
