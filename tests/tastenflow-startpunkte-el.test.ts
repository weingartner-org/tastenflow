/**
 * ★★★ WÄCHTER O-INHALT-EL (29.10.2026): DIE STARTPUNKTE IN DER GRIECHISCHEN BEDIENUNG (`startpunkteEl.ts`).
 *
 * Vorbild: `tastenflow-tschechisch-alles.test.tsx` (b) „výchozí body". Dieselben sieben Landmarken mit denselben Einheiten wie
 * `startPoints`, nur griechisch beschriftet; ganz griechisch (Falle 2), kein Personenwort („Αρχάριος", Regel 2), kein „+", keine fremde Sprache.
 * Die ersten zwei Tasten kommen aus dem Weg (griechisch „Φ και Ξ"), nicht fest „F και J". Gegenprobe: ohne Datei (englische Namen) schlägt
 * der Wächter an.
 */
import { afterEach, describe, expect, it } from "vitest";
import { startPunkte } from "@/lib/typing/startpunkteIt";
import { startPoints } from "@/lib/typing/letters";
import { setLayout } from "@/lib/typing/layouts";
import { LERNWEGE_LISTE } from "@/lib/typing/lernweg";
import { satzFehler } from "./helfer/oInhaltNeueWege";

const LATEIN = new Set<string>();
afterEach(() => setLayout("de"));

describe("Startpunkte griechisch", () => {
  it("dieselben Einheiten wie startPoints, auf jedem Weg - nur die Namen sind griechisch", () => {
    for (const weg of LERNWEGE_LISTE) {
      const bg = startPunkte("el", weg);
      const ref = startPoints("en", weg);
      expect(bg.map((p) => [p.key, p.units]), weg).toEqual(ref.map((p) => [p.key, p.units]));
    }
  });

  it("jeder Name ist ganz griechisch, kein Strich, kein Englisch, kein „+“ (die Stimme läse „συν“)", () => {
    setLayout("el");
    const fehler: string[] = [];
    for (const p of startPunkte("el", "el")) {
      fehler.push(...satzFehler(p.key, p.label, "Greek", LATEIN));
      if (p.label.includes("+")) fehler.push(`${p.key}: Plus - ${p.label}`);
    }
    expect(fehler).toEqual([]);
  });

  it("kein Personenwort für das Kind („Αρχάριος\") - Glossar Regel 2", () => {
    for (const weg of LERNWEGE_LISTE)
      for (const p of startPunkte("el", weg)) expect(p.label, `${weg} ${p.key}`).not.toMatch(/αρχάρι/i);
  });

  it("griechische Tastatur: der erste Startpunkt nennt Φ und Ξ, die Grundstellung die ganze Grundreihe des Weges", () => {
    setLayout("el");
    const p = Object.fromEntries(startPunkte("el", "el").map((x) => [x.key, x.label]));
    expect(p.anfaenger).toBe("Από την αρχή: μόνο Φ και Ξ");
    expect(p.start).toBe("Βασική θέση (όλη η βασική σειρά: φ ξ δ κ σ λ α)");
    // Weg „de" mit griechischer Bedienung: die Tasten des Weges, nicht Φ Ξ
    setLayout("de");
    expect(startPunkte("el", "de").find((x) => x.key === "anfaenger")?.label).toBe("Από την αρχή: μόνο F και J");
  });

  it("GEGENPROBE: die englischen Namen (der alte Rückfall) fallen durch", () => {
    const fehler = startPoints("en", "el").flatMap((p) => satzFehler(p.key, p.label, "Greek", LATEIN));
    expect(fehler.length).toBeGreaterThan(3);
  });

  it("de/en/fr/es bleiben unverändert", () => {
    for (const s of ["de", "en", "fr", "es"] as const) expect(startPunkte(s, "de")).toEqual(startPoints(s, "de"));
  });
});
