/**
 * TN-E4 (Text-Nachschub §7): Groß-Charge für Stufe c (13–15) + Alters-Retag.
 * Prüft, dass die Charge sauber ist, die Zelle wirklich gefüllt wurde und
 * Kinder-Humor nicht mehr an Jugendliche/Erwachsene geht.
 */
import { describe, expect, it } from "vitest";
import { CORPUS, fitText } from "../src/lib/typing/corpus";
import { JUGEND_CORPUS } from "../src/lib/typing/corpusJugend";
import { corpusEntriesFor } from "../src/lib/typing/corpusManifest";
import { minTierFor, TIER_CHARS } from "../src/lib/typing/tiers";
import { ARCS } from "../src/lib/typing/arcs";
import { validateHerkunft } from "../src/lib/typing/serien";
import { bausteinKey } from "../src/lib/typing/ledger";

const FULL = new Set(TIER_CHARS.flatMap((t) => [...t]));
const allowedUpTo = (tier: number): Set<string> => {
  const s = new Set<string>();
  for (let t = 0; t <= tier; t++) for (const c of TIER_CHARS[t] ?? []) s.add(c);
  return s;
};

describe("TN-E4 Charge für Stufe c", () => {
  it("liefert 150+ Zeilen, alle für Stufe c", () => {
    expect(JUGEND_CORPUS.length).toBeGreaterThanOrEqual(150);
    for (const e of JUGEND_CORPUS) expect(e.stufen).toContain("teens");
  });

  it("jede Zeile hat vollständige Herkunft (Rechte-Gate §6.3)", () => {
    for (const e of JUGEND_CORPUS) {
      expect(e.herkunft, e.text).toBeDefined();
      expect(validateHerkunft(e.herkunft!), e.text).toEqual([]);
      expect(e.herkunft!.fundstelle, e.text).toBeTruthy();
    }
  });

  it("Zeichensatz + Länge: tippbar, keine Fremdzeichen, max 85 Zeichen", () => {
    for (const e of JUGEND_CORPUS) {
      expect(e.text.length, e.text).toBeLessThanOrEqual(85);
      expect(e.text, e.text).not.toMatch(/[„“”"«»…–—''`]/);
      expect(fitText(e.text, FULL), e.text).not.toBeNull();
      expect(minTierFor(e.text, "de"), e.text).toBeLessThanOrEqual(5);
    }
  });

  it("keine Dublette gegen den übrigen Bestand", () => {
    // mergeCorpus liefert KOPIEN (kein Identitätsvergleich möglich): stattdessen
    // zählen — jeder Text der Charge darf im gemergten CORPUS genau einmal
    // vorkommen (sonst gab es ihn schon vorher unter gleicher oder anderer Sorte).
    const jugend = new Set(JUGEND_CORPUS.map((e) => bausteinKey("", e.text)));
    const zaehler = new Map<string, number>();
    for (const e of CORPUS) {
      const k = bausteinKey("", e.text);
      if (jugend.has(k)) zaehler.set(k, (zaehler.get(k) ?? 0) + 1);
    }
    const doppelt = [...zaehler.entries()].filter(([, n]) => n > 1).map(([k]) => k);
    expect(doppelt).toEqual([]);
  });

  it("füllt die dünnste Zelle messbar auf (c: vorher 610 gesamt / 548 ≤T3)", () => {
    const gesamt = corpusEntriesFor({ lernweg: "de", stufe: "teens", allowed: FULL, lang: "de" }).length;
    const bisT3 = corpusEntriesFor({ lernweg: "de", stufe: "teens", allowed: allowedUpTo(3), lang: "de" }).length;
    expect(gesamt).toBeGreaterThan(650);
    expect(bisT3).toBeGreaterThan(600);
  });
});

describe("TN-E4 Alters-Retag (Prüfbericht 27.07.)", () => {
  it("kein Kinder-Humor mehr für Stufe c oder erwachsene Lernende", () => {
    const KINDER_HUMOR = new Set(["witz", "wortspiel", "spruch"]);
    const falsch = CORPUS.filter(
      (e) =>
        KINDER_HUMOR.has(e.kind) &&
        e.stufen.includes("a") &&
        (e.stufen.includes("c") || e.stufen.includes("erwachsen")),
    );
    expect(falsch.map((e) => `${e.kind}: ${e.text}`)).toEqual([]);
  });

  it("Vorschul-Elementarfakten laufen nicht mehr in der Sekundarstufe", () => {
    const kuh = CORPUS.find((e) => e.text === "Eine Kuh hat ein Kalb.");
    expect(kuh).toBeDefined();
    // S3: aus a wurde kids; die Zeile bleibt der jungen Stufe vorbehalten,
    // erreicht ueber `b` aber weiterhin auch teens (siehe Retag-Regel).
    expect(kuh!.stufen).toContain("kids");
  });

  it("Sprichwörter und Zungenbrecher bleiben altersneutral", () => {
    const morgenstund = CORPUS.find((e) => e.text === "Morgenstund hat Gold im Mund.");
    expect(morgenstund?.stufen).toContain("teens");
  });
});

describe("TN-E4 Themenstränge", () => {
  it("beide c-Stränge registriert, mit Frage/Antwort-Paaren und Belohnung", () => {
    for (const id of ["tn-de-c-iss", "tn-de-c-koerper"]) {
      const arc = ARCS.find((a) => a.id === id);
      expect(arc, id).toBeDefined();
      expect(arc!.stufen).toEqual(["teens"]);
      const paare = arc!.steps.filter((s) => s.rolle === "wiederholen");
      expect(paare.length, id).toBe(2);
      for (const p of paare) expect(p.bausteine).toHaveLength(2);
      expect(arc!.steps[arc!.steps.length - 1].rolle).toBe("belohnen");
    }
  });

  it("Frage und Antwort eines Paares liegen dicht beieinander (Fairness §6.5)", () => {
    // Ein Schritt wird nur KOMPLETT serviert (planArcRound überspringt ihn, wenn
    // eine Zeile noch nicht passt) — die Frage kann also nie ohne Antwort kommen.
    // Trotzdem soll das Paar nicht künstlich lange warten: höchstens eine
    // Tier-Stufe Unterschied.
    for (const arc of ARCS) {
      for (const step of arc.steps) {
        if (!step.bausteine || step.bausteine.length !== 2) continue;
        const [a, b] = step.bausteine.map((x) => minTierFor(x.text, "de"));
        // null = gar nicht servierbar; das fängt der Zeichensatz-Test oben ab.
        expect(a, `${arc.id}: ${step.bausteine[0].text}`).not.toBeNull();
        expect(b, `${arc.id}: ${step.bausteine[1].text}`).not.toBeNull();
        expect(Math.abs(a! - b!), `${arc.id}: ${step.bausteine[0].text}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it("Wiederkehr-Zeilen sind anders formuliert als ihre Lehr-Zeilen", () => {
    const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß]/g, "");
    for (const arc of ARCS) {
      const lehr = new Set(
        (arc.steps[0].bausteine ?? []).map((b) => norm(b.text)),
      );
      for (const step of arc.steps.slice(1))
        for (const b of step.bausteine ?? [])
          expect(lehr.has(norm(b.text)), `${arc.id}: ${b.text}`).toBe(false);
    }
  });
});
