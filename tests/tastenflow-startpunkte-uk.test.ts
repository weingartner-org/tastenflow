/**
 * ★★★ WÄCHTER O-INHALT-UK (29.10.2026): DIE STARTPUNKTE IN DER UKRAINISCHEN BEDIENUNG (`startpunkteUk.ts`).
 *
 * Vorbild: `tastenflow-tschechisch-alles.test.tsx` (b) „výchozí body". Dieselben sieben Landmarken mit denselben Einheiten wie
 * `startPoints`, nur ukrainisch beschriftet; ganz kyrillisch, kein Personenwort („початківець", Regel 2), kein Russismus („Самий початок").
 * Die ersten zwei Tasten kommen aus dem Weg (ukrainisch „А і О"), nicht fest „F і J". Gegenprobe: ohne Datei (englische Namen) schlägt
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

describe("Startpunkte ukrainisch", () => {
  it("dieselben Einheiten wie startPoints, auf jedem Weg - nur die Namen sind ukrainisch", () => {
    for (const weg of LERNWEGE_LISTE) {
      const bg = startPunkte("uk", weg);
      const ref = startPoints("en", weg);
      expect(bg.map((p) => [p.key, p.units]), weg).toEqual(ref.map((p) => [p.key, p.units]));
    }
  });

  it("jeder Name ist ganz ukrainisch: kyrillisch (die Grundreihe des Weges darf lateinisch sein), kein Strich, kein Englisch", () => {
    setLayout("ua");
    const fehler: string[] = [];
    for (const p of startPunkte("uk", "uk")) fehler.push(...satzFehler(p.key, p.label, "Cyrillic", LATEIN));
    expect(fehler).toEqual([]);
  });

  it("kein Personenwort für das Kind („початківець\") und kein Russismus („Самий початок\") - Glossar Regel 2/14", () => {
    for (const weg of LERNWEGE_LISTE)
      for (const p of startPunkte("uk", weg)) expect(p.label, `${weg} ${p.key}`).not.toMatch(/початків|новач|Самий/i);
  });

  it("ukrainische Tastatur: der erste Startpunkt nennt А und О, die Grundstellung die ganze Grundreihe des Weges", () => {
    setLayout("ua");
    const p = Object.fromEntries(startPunkte("uk", "uk").map((x) => [x.key, x.label]));
    expect(p.anfaenger).toBe("Перші кроки: лише А і О");
    expect(p.start).toBe("Основне положення (увесь основний ряд: а о в л і д п р)");
    setLayout("de");
    expect(startPunkte("uk", "de").find((x) => x.key === "anfaenger")?.label).toBe("Перші кроки: лише F і J");
  });

  it("GEGENPROBE: die englischen Namen (der alte Rückfall) fallen durch", () => {
    const fehler = startPoints("en", "uk").flatMap((p) => satzFehler(p.key, p.label, "Cyrillic", LATEIN));
    expect(fehler.length).toBeGreaterThan(3);
  });

  it("de/en/fr/es bleiben unverändert", () => {
    for (const s of ["de", "en", "fr", "es"] as const) expect(startPunkte(s, "de")).toEqual(startPoints(s, "de"));
  });
});
