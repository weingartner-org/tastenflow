/**
 * ★★ S1 (28.09.2026, Schlussprüfung Nachtlauf): die Startpunkt-ZAHL gilt nur
 * im Weg, in dem sie gesetzt wurde.
 *
 * `startUnits` am Konto ist eine Anzahl in der Zählung SEINES Weges (Bauplan
 * englischer Lehrgang §2.4, die Anzahlen-Falle). Stellte die Lehrkraft den Weg
 * eines Kindes um, blieb sie stehen und wurde im neuen Weg mit anderer
 * Bedeutung angewandt (`BEFUND-2026-09-28-SCHLUSSPRUEFUNG-NACHTLAUF.md` S1):
 *  1. frischer Weg: de „Erste Buchstaben + Großschreibung" (14) gab auf fr 14
 *     Buchstaben OHNE ⇧; de „Alle Buchstaben" (31) gab auf es `.`, auf en
 *     `. , '` dazu,
 *  2. zurückgeholter Weg: ein fr-Stand mit 9 Einheiten kam mit 14 zurück,
 *  3. Kind mit Startpunkt, nie getippt: nichts wurde geparkt, die de-Tasten
 *     blieben im fr-Stand (mit Lücken `. , ç ù`).
 *
 * Der Wächter spielt den Ladeweg des Kindes nach, genau wie
 * `TippenTrainerPage` (`fortschrittImWeg` mit dem Konto → `startpunktImWeg`
 * → Klassen-Vorgabe → `startpunktAnwenden`); dass die Seite so verdrahtet ist,
 * prüft `tastenflow-w2b-weg-je-kind` (3c).
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  defaultIntroduced,
  ensureIntroduced,
  introOrder,
  introducedUpTo,
  startPoints,
  startpunktAnwenden,
  startpunktEinheiten,
} from "@/lib/typing/letters";
import { setLayout } from "@/lib/typing/layouts";
import { emptyProgress, type TypingProgress } from "@/lib/typing/progress";
import { startpunktMitKlasse } from "@/lib/typing/klassenEinstellungen";
import { fortschrittImWeg, startpunktImWeg } from "@/lib/typing/wegWechsel";
import type { Lernweg } from "@/lib/typing/lernweg";
import { mitRueckfallEn } from "../src/lib/typing/sprachRegister";

const TASTATUR: Record<Lernweg, string> = /* RÜCKFALL-EN (G2-NEUN) */ mitRueckfallEn({ de: "de", en: "us", fr: "fr", es: "es", it: "us", pl: "us", tr: "us", cs: "us" /* RÜCKFALL-EN (G2a) */ });
const AM = 1_790_000_000_000;

interface Konto {
  lernweg: Lernweg;
  startUnits?: number;
  startUnitsAt?: number;
}

/** Der Ladeweg des Kindes (TippenTrainerPage.loadFn), ohne Netz. */
function laden(p: TypingProgress, konto: Konto, klasse?: Konto): TypingProgress {
  setLayout(TASTATUR[konto.lernweg]);
  const weg = konto.lernweg;
  const pMitWeg = fortschrittImWeg(p, weg, konto);
  const k = klasse ? startpunktMitKlasse(startpunktImWeg(konto, pMitWeg), klasse) : startpunktImWeg(konto, pMitWeg);
  const erg = startpunktAnwenden(
    pMitWeg.introduced,
    k.startUnits,
    k.startUnitsAt,
    { units: pMitWeg.startAngewandt, am: pMitWeg.startAngewandtAm },
    weg,
  );
  if (!erg) return pMitWeg;
  return {
    ...pMitWeg,
    ...(erg.introduced ? { introduced: erg.introduced } : {}),
    startAngewandt: erg.vermerk.units,
    startAngewandtAm: erg.vermerk.am,
  };
}

const stand = (p: TypingProgress, weg: Lernweg) => {
  setLayout(TASTATUR[weg]);
  return ensureIntroduced(p.introduced, weg);
};

/** Ein Kind, das auf de geübt hat - mit übernommenem Startpunkt `units`. */
function deKind(units: number): TypingProgress {
  setLayout("de");
  return laden(
    { ...emptyProgress(), xp: 300, letters: { f: { hits: 40, misses: 1 } as never }, introduced: introducedUpTo(20, "de") },
    { lernweg: "de", startUnits: units, startUnitsAt: AM },
  );
}

afterEach(() => setLayout("de"));

describe("S1 · 1 - frischer Weg: die Zahl des alten Weges gilt dort nicht", () => {
  setLayout("de");
  const landmarken = startPoints("de", "de").filter((sp) => sp.units > 2);
  for (const ziel of ["fr", "es", "en"] as const) {
    it(`jede de-Landmarke → ${ziel}: das Kind beginnt am Anfang des neuen Weges`, () => {
      for (const sp of landmarken) {
        const auf = laden(deKind(sp.units), { lernweg: ziel, startUnits: sp.units, startUnitsAt: AM });
        expect(stand(auf, ziel), `de „${sp.label}" (${sp.units})`).toEqual(defaultIntroduced(ziel));
        // Beim nächsten Laden bleibt es dabei (kein zweiter Anlauf der fremden Zahl).
        expect(stand(laden(auf, { lernweg: ziel, startUnits: sp.units, startUnitsAt: AM }), ziel)).toEqual(
          defaultIntroduced(ziel),
        );
      }
    });
  }

  it("ein NEUER Startpunkt der Lehrkraft auf dem neuen Weg gilt normal (in seiner Zählung)", () => {
    const auf = laden(deKind(31), { lernweg: "fr", startUnits: 31, startUnitsAt: AM });
    setLayout("fr");
    const buchstaben = startPoints("de", "fr").find((sp) => sp.key === "buchstaben")!;
    const neu = laden(auf, { lernweg: "fr", startUnits: buchstaben.units, startUnitsAt: AM + 5000 });
    expect(stand(neu, "fr")).toEqual(startpunktEinheiten(buchstaben.units, "fr"));
  });

  it("die Vorgabe einer Klasse AUF DEM NEUEN WEG gilt (sie zählt in diesem Weg)", () => {
    const auf = laden(deKind(31), { lernweg: "fr", startUnits: 31, startUnitsAt: AM }, {
      lernweg: "fr",
      startUnits: 14,
      startUnitsAt: AM - 1000,
    });
    setLayout("fr");
    expect(stand(auf, "fr")).toEqual(startpunktEinheiten(14, "fr"));
  });
});

describe("S1 · 2 - zurückgeholter Weg: er kommt unverändert wieder", () => {
  it("de(14) → fr, dort 9 Einheiten geübt → de → fr: der fr-Stand hat 9, nicht 14", () => {
    const de = deKind(14);
    const deStand = stand(de, "de");
    const aufFr = laden(de, { lernweg: "fr", startUnits: 14, startUnitsAt: AM });
    setLayout("fr");
    const neun = introOrder("fr").slice(0, 9);
    const frGeuebt: TypingProgress = { ...aufFr, xp: aufFr.xp + 50, introduced: neun };
    const zurueckDe = laden(frGeuebt, { lernweg: "de", startUnits: 14, startUnitsAt: AM });
    expect(stand(zurueckDe, "de")).toEqual(deStand);
    const wiederFr = laden(zurueckDe, { lernweg: "fr", startUnits: 14, startUnitsAt: AM });
    expect(stand(wiederFr, "fr")).toEqual(ensureIntroduced(neun, "fr"));
    // … und bleibt es beim nächsten Öffnen.
    expect(stand(laden(wiederFr, { lernweg: "fr", startUnits: 14, startUnitsAt: AM }), "fr")).toEqual(
      ensureIntroduced(neun, "fr"),
    );
  });

  it("Gegenprobe: ein Startpunkt, den die Lehrkraft auf DIESEM Weg gesetzt hat, gilt dort weiter", () => {
    setLayout("fr");
    // Kind war auf fr mit Startpunkt 20 (fr-Zählung), dann de, dann wieder fr.
    const fr = laden({ ...emptyProgress(), xp: 10, letters: { f: { hits: 1, misses: 0 } as never }, lernweg: "fr" }, {
      lernweg: "fr",
      startUnits: 20,
      startUnitsAt: AM,
    });
    const frStand = stand(fr, "fr");
    const aufDe = laden(fr, { lernweg: "de", startUnits: 20, startUnitsAt: AM });
    expect(stand(aufDe, "de")).toEqual(defaultIntroduced("de"));
    const wiederFr = laden({ ...aufDe, xp: aufDe.xp + 1 }, { lernweg: "fr", startUnits: 20, startUnitsAt: AM });
    expect(stand(wiederFr, "fr")).toEqual(frStand);
  });
});

describe("S1 · 3 - Startpunkt bekommen, nie getippt: trotzdem sauber geparkt", () => {
  it("de „Alle Buchstaben“ (nie getippt) → fr: fr beginnt am Anfang, de liegt geparkt und kommt zurück", () => {
    setLayout("de");
    const alle = startPoints("de", "de").find((sp) => sp.key === "buchstaben")!;
    const nurStart = laden(emptyProgress(), { lernweg: "de", startUnits: alle.units, startUnitsAt: AM });
    const deStand = stand(nurStart, "de");
    expect(deStand.length).toBeGreaterThan(20);
    const fr = laden(nurStart, { lernweg: "fr", startUnits: alle.units, startUnitsAt: AM });
    expect(stand(fr, "fr")).toEqual(defaultIntroduced("fr"));
    expect(fr.wegStaende?.de?.introduced).toEqual(nurStart.introduced);
    const zurueck = laden(fr, { lernweg: "de", startUnits: alle.units, startUnitsAt: AM });
    expect(stand(zurueck, "de")).toEqual(deStand);
  });

  it("Gegenprobe: ein Kind ohne Startpunkt und ohne Übung wird nicht geparkt (nichts da)", () => {
    const leer = laden(emptyProgress(), { lernweg: "de" });
    const fr = laden(leer, { lernweg: "fr" });
    expect(fr.wegStaende).toBeUndefined();
  });
});

describe("S1 · startpunktImWeg - was die Lehrkraft-Seite liest", () => {
  it("der fremde Beschluss zählt dort als die eigene Zahl des Standes, ein neuer normal", () => {
    const auf = fortschrittImWeg(deKind(31), "fr", { startUnits: 31, startUnitsAt: AM });
    expect(auf.startpunktFremd).toEqual({ units: 31, am: AM });
    expect(startpunktImWeg({ startUnits: 31, startUnitsAt: AM }, auf)).toEqual({ startUnits: 0, startUnitsAt: 0 });
    expect(startpunktImWeg({ startUnits: 20, startUnitsAt: AM + 1 }, auf)).toEqual({
      startUnits: 20,
      startUnitsAt: AM + 1,
    });
    expect(startpunktImWeg({ startUnits: 31, startUnitsAt: AM }, emptyProgress())).toEqual({
      startUnits: 31,
      startUnitsAt: AM,
    });
  });
});
