/**
 * ★★★ M1 (28.09.2026, Schlussprüfung Nachtlauf): die Frühfassung wird JE NAHT
 * entschieden.
 *
 * Bis dahin kam der ganze Rohtext, sobald EIN Satzschlusszeichen der Zeile
 * gelernt war. Seit D-1 der Punkt direkt nach ⇧ kommt, „?"/„!" aber hinten
 * bleiben, las ein Kind über den ganzen Rest des Alphabets „Was macht die Kuh
 * auf dem Eis Sie gibt kalte Milch." (de kids 48 Zeilen, en kids 38, fr kids
 * 65, ca-fr kids 55 - `BEFUND-2026-09-28-SCHLUSSPRUEFUNG-NACHTLAUF.md` M1).
 *
 * Der Wächter deckt die FEHLERKLASSE, nicht die gemeldeten Zeilen: an JEDER
 * Sprosse jedes Weges auf JEDER seiner Tastaturen wird JEDE Zeile mit
 * Frühfassung serviert und Wort für Wort gegen die Frühfassung gelesen:
 *  · kein Nahtwort gross, wo die Frühfassung klein schreibt, ohne dass davor
 *    ein Satzschlusszeichen stehen bleibt (Eigennamen schreibt die Frühfassung
 *    selbst gross - sie zählen darum nie),
 *  · und umgekehrt kein Nahtwort klein, wo davor ein Satzschlusszeichen steht.
 * Die Prüfung liest nur die servierte Zeile, sie kennt `servierFassung` nicht.
 */
import { describe, expect, it } from "vitest";
import { fitText } from "../src/lib/typing/corpus";
import { FRUEH_FASSUNGEN } from "../src/lib/typing/fruehFassungen";
import { introOrder } from "../src/lib/typing/letters";
import { allowedFromIntroduced } from "../src/lib/typing/serien";
import { setLayout } from "../src/lib/typing/layouts";
import { allowedForTier } from "../src/lib/typing/tiers";
import type { Lernweg } from "../src/lib/typing/lernweg";

const WEGE: [Lernweg, string[]][] = [
  ["de", ["de", "ch", "us", "uk"]],
  ["en", ["us", "uk", "de", "ch"]],
  ["fr", ["fr", "be", "ch-fr", "ca-fr", "ca-csa"]],
  ["es", ["es", "latam"]],
];

const TRENN = /[\s\-–—()[\]{}/]+/;
/** Französische Leerzeichen vor ? ! : ; » und nach « an das Wort ziehen. */
const eng = (s: string) => s.replace(/\s+([?!:;»,.])/g, "$1").replace(/«\s+/g, "«");
const woerter = (s: string) => eng(s).split(TRENN).filter(Boolean);
const ohneVorspann = (w: string) => w.replace(/^[^\p{L}]+/u, "");
const SATZENDE_AM_WORT = /[.!?…]$/;
const istGross = (c: string) => c !== c.toLowerCase();

/** Fehler der servierten Zeile gegen ihre Frühfassung (leer = in Ordnung). */
function nahtFehler(serviert: string, roh: string): string[] {
  const frueh = FRUEH_FASSUNGEN.get(roh)!;
  const a = woerter(serviert);
  const b = woerter(frueh);
  const r = woerter(roh);
  if (a.length !== b.length || r.length !== b.length) return [`Wortzahl weicht ab: „${serviert}"`];
  const out: string[] = [];
  for (let i = 1; i < a.length; i++) {
    const wa = ohneVorspann(a[i]);
    const wb = ohneVorspann(b[i]);
    const wr = ohneVorspann(r[i]);
    if (!wa || !wb || !wr) continue;
    const ende = SATZENDE_AM_WORT.test(a[i - 1].replace(/[»"”“)\]']+$/, ""));
    if (istGross(wa[0]) && !istGross(wb[0]) && !ende) out.push(`gross ohne Satzende: „${serviert}"`);
    if (!istGross(wa[0]) && istGross(wr[0]) && !istGross(wb[0]) && ende) out.push(`klein nach Satzende: „${serviert}"`);
  }
  return out;
}

describe("M1: Frühfassung je Naht - an jeder Sprosse, jedem Weg, jeder Tastatur", () => {
  for (const [weg, tastaturen] of WEGE) {
    for (const lay of tastaturen) {
      it(`${weg}/${lay}: kein Grossbuchstabe mitten in der Zeile ohne Satzende davor`, () => {
        setLayout(lay);
        const order = introOrder(weg);
        const fehler = new Set<string>();
        let gelesen = 0;
        let mitSatzende = 0;
        for (let n = 1; n <= order.length; n++) {
          const allowed = allowedFromIntroduced(order.slice(0, n), weg);
          const satzendeGelernt = [".", "!", "?"].some((z) => allowed.has(z));
          for (const roh of FRUEH_FASSUNGEN.keys()) {
            const serviert = fitText(roh, allowed, weg);
            if (serviert === null) continue;
            gelesen++;
            if (satzendeGelernt) mitSatzende++;
            for (const f of nahtFehler(serviert, roh)) fehler.add(`S${n}(+${order[n - 1]}) ${f}`);
          }
        }
        setLayout("de");
        // Der Wächter hat wirklich gelesen - auch NACH dem ersten Satzschlusszeichen,
        // genau dort, wo M1 lag.
        expect(gelesen).toBeGreaterThan(100);
        expect(mitSatzende).toBeGreaterThan(50);
        expect([...fehler].slice(0, 12), `${fehler.size} Funde`).toEqual([]);
      });
    }
  }
});

describe("M1: jede Teilmenge der Satzschlusszeichen (Weg de, alle Buchstaben)", () => {
  const BUCHSTABEN = allowedForTier(3, "de");
  const TEILMENGEN = [[], ["."], ["?"], ["!"], [".", "?"], [".", "!"], ["?", "!"], [".", "?", "!"]];

  it("keine Zeile mit Frühfassung verfehlt eine Naht, egal welche Satzschlusszeichen gelernt sind", () => {
    const fehler: string[] = [];
    let gelesen = 0;
    for (const teil of TEILMENGEN) {
      const allowed = new Set([...BUCHSTABEN, ...teil]);
      for (const roh of FRUEH_FASSUNGEN.keys()) {
        const serviert = fitText(roh, allowed);
        if (serviert === null) continue;
        gelesen++;
        fehler.push(...nahtFehler(serviert, roh).map((f) => `{${teil.join(" ")}} ${f}`));
      }
    }
    expect(gelesen).toBeGreaterThan(1000);
    expect(fehler.slice(0, 12), `${fehler.length} Funde`).toEqual([]);
  });

  it("die gemeldeten Zeilen: nur der Punkt gelernt", () => {
    const punkt = new Set([...BUCHSTABEN, "."]);
    expect(fitText("Was macht die Kuh auf dem Eis? Sie gibt kalte Milch.", punkt)).toBe(
      "Was macht die Kuh auf dem Eis sie gibt kalte Milch.",
    );
    expect(fitText("Ein Rentier ist ein Tier. Steckt das Wort Tier in Rentier? Ja!", punkt)).toBe(
      "Ein Rentier ist ein Tier. Steckt das Wort Tier in Rentier ja",
    );
    expect(fitText("Why did the chicken cross the road? To get to the other side.", punkt)).toBe(
      "Why did the chicken cross the road to get to the other side.",
    );
  });

  it("Gegenprobe: mit Fragezeichen und Ausrufezeichen kommt der Rohtext ganz", () => {
    const alle = new Set([...BUCHSTABEN, ".", "?", "!"]);
    const roh = "Ein Rentier ist ein Tier. Steckt das Wort Tier in Rentier? Ja!";
    expect(fitText(roh, alle)).toBe(roh);
  });

  it("Gegenprobe: der Wächter sieht den alten Fehler (ganzer Rohtext ab dem Punkt)", () => {
    const roh = "Was macht die Kuh auf dem Eis? Sie gibt kalte Milch.";
    expect(nahtFehler("Was macht die Kuh auf dem Eis Sie gibt kalte Milch.", roh)).toHaveLength(1);
    expect(nahtFehler("Was macht die Kuh auf dem Eis? sie gibt kalte Milch.", roh)).toHaveLength(1);
  });
});
