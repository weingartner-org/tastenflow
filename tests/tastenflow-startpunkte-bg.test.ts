/**
 * ★★★ WÄCHTER O-INHALT-BG (29.10.2026): DIE STARTPUNKTE IN DER BULGARISCHEN BEDIENUNG (`startpunkteBg.ts`).
 *
 * Vorbild: `tastenflow-tschechisch-alles.test.tsx` (b) „výchozí body". Dieselben sieben Landmarken mit denselben Einheiten wie
 * `startPoints`, nur bulgarisch beschriftet; ganz kyrillisch (Falle 2), kein Personenwort („начинаещ", Regel 2), keine fremde Sprache.
 * Die ersten zwei Tasten kommen aus dem Weg (BDS: „О и Т"), nicht fest „F и J". Gegenprobe: ohne Datei (englische Namen) schlägt
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

describe("Startpunkte bulgarisch", () => {
  it("dieselben Einheiten wie startPoints, auf jedem Weg - nur die Namen sind bulgarisch", () => {
    for (const weg of LERNWEGE_LISTE) {
      const bg = startPunkte("bg", weg);
      const ref = startPoints("en", weg);
      expect(bg.map((p) => [p.key, p.units]), weg).toEqual(ref.map((p) => [p.key, p.units]));
    }
  });

  it("jeder Name ist ganz bulgarisch: kyrillisch (die Grundreihe des Weges darf lateinisch sein), kein Strich, kein Englisch", () => {
    setLayout("bg");
    const fehler: string[] = [];
    for (const p of startPunkte("bg", "bg")) fehler.push(...satzFehler(p.key, p.label, "Cyrillic", LATEIN));
    expect(fehler).toEqual([]);
  });

  it("kein Personenwort für das Kind („начинаещ\", „новак\") - Glossar Regel 2", () => {
    for (const weg of LERNWEGE_LISTE)
      for (const p of startPunkte("bg", weg)) expect(p.label, `${weg} ${p.key}`).not.toMatch(/начинаещ|новак|новачок/i);
  });

  it("BDS: der erste Startpunkt nennt о und т, die Grundstellung die ganze Grundreihe des Weges", () => {
    setLayout("bg");
    const p = Object.fromEntries(startPunkte("bg", "bg").map((x) => [x.key, x.label]));
    expect(p.anfaenger).toBe("Съвсем отначало: само О и Т");
    expect(p.start).toBe("Изходна позиция (целият основен ред: о т а н в м я)");
    // Weg „de" mit bulgarischer Bedienung: die Tasten des Weges, nicht о т
    setLayout("de");
    expect(startPunkte("bg", "de").find((x) => x.key === "anfaenger")?.label).toBe("Съвсем отначало: само F и J");
  });

  it("GEGENPROBE: die englischen Namen (der alte Rückfall) fallen durch", () => {
    const fehler = startPoints("en", "bg").flatMap((p) => satzFehler(p.key, p.label, "Cyrillic", LATEIN));
    expect(fehler.length).toBeGreaterThan(3);
  });

  it("de/en/fr/es bleiben unverändert", () => {
    for (const s of ["de", "en", "fr", "es"] as const) expect(startPunkte(s, "de")).toEqual(startPoints(s, "de"));
  });
});
