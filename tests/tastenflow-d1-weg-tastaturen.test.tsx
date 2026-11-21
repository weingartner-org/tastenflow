/**
 * ★★★ WÄCHTER D1 Nr. 7 (28.09.2026, Entscheidung Johannes „Weg fr nur mit
 * französischen Tastaturen - ja"; Grundsatz: gelehrt wird die Tastatur des
 * Landes). Dasselbe für Weg „es" (Spanien, Lateinamerika).
 *
 *  1. Die Regel (`wegTastaturen.ts`): Weg fr → die fünf französischen, Weg es
 *     → die zwei spanischen, Weg de/en → keine Einschränkung (wie bisher).
 *  2. Einrichtung und Zahnrad bieten auf Weg fr/es keine fremde Tastatur an;
 *     ist eine fremde eingestellt, sagt es ein Hinweis (im Zahnrad bleibt sie
 *     sichtbar in der Liste, sonst zeigte das Feld still eine andere).
 *  3. Gegenprobe: Weg de bietet dieselben Tastaturen wie `sichtbareLayouts`.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import type { ReactNode } from "react";
import { BedienSpracheProvider } from "@/lib/bedienSprache";
import { TypingSettings } from "@/components/typing/TypingSettings";
import { FRANZOESISCHE_LAYOUT_IDS, SPANISCHE_LAYOUT_IDS, setLayout, sichtbareLayouts } from "@/lib/typing/layouts";
import { LEHRGANG_PROBE_MERKER_ES, LEHRGANG_PROBE_MERKER_FR, type Lernweg } from "@/lib/typing/lernweg";
import { tastaturenFuerWeg, tastaturPasstZumWeg } from "@/lib/typing/wegTastaturen";

function zeige(knoten: ReactNode) {
  return render(<BedienSpracheProvider>{knoten}</BedienSpracheProvider>);
}
afterEach(() => {
  cleanup();
  localStorage.clear();
  setLayout("de");
});
function probe(bedienung: string) {
  localStorage.setItem("tastenflow-bedienung", bedienung);
  localStorage.setItem(LEHRGANG_PROBE_MERKER_FR, "1");
  localStorage.setItem(LEHRGANG_PROBE_MERKER_ES, "1");
}

describe("D1 Nr. 7 · 1. die Regel", () => {
  it("fr: nur französische, es: nur spanische, de/en: alle sichtbaren", () => {
    expect(tastaturenFuerWeg("fr", true, true).map((l) => l.id).sort()).toEqual([...FRANZOESISCHE_LAYOUT_IDS].sort());
    expect(tastaturenFuerWeg("es", true, true).map((l) => l.id).sort()).toEqual([...SPANISCHE_LAYOUT_IDS].sort());
    for (const w of ["de", "en"] as Lernweg[]) {
      expect(tastaturenFuerWeg(w, true, true)).toEqual(sichtbareLayouts(true, true));
      expect(tastaturenFuerWeg(w, false, false)).toEqual(sichtbareLayouts(false, false));
    }
    // Ein Kind auf Weg fr/es bekommt dessen Tastaturen auch ohne Probe-Schalter.
    expect(tastaturenFuerWeg("fr", false, false).length).toBe(FRANZOESISCHE_LAYOUT_IDS.size);
    expect(tastaturenFuerWeg("es", false, false).length).toBe(SPANISCHE_LAYOUT_IDS.size);
  });
  it("GEGENPROBE: de/us/uk/ch passen nicht zu fr/es, aber zu de/en", () => {
    for (const l of ["de", "ch", "us", "uk"] as const) {
      expect(tastaturPasstZumWeg(l, "fr"), l).toBe(false);
      expect(tastaturPasstZumWeg(l, "es"), l).toBe(false);
      expect(tastaturPasstZumWeg(l, "de"), l).toBe(true);
      expect(tastaturPasstZumWeg(l, "en"), l).toBe(true);
    }
    expect(tastaturPasstZumWeg("es", "fr")).toBe(false);
    expect(tastaturPasstZumWeg("fr", "es")).toBe(false);
  });
});

describe("D1 Nr. 7 · 2. Zahnrad", () => {
  it("Weg fr mit deutscher Tastatur: Hinweis, nur französische + die eingestellte in der Liste", () => {
    probe("fr");
    setLayout("de");
    const { container } = zeige(<TypingSettings stufe="kids" lang="fr" onLangChange={() => {}} lernweg="fr" />);
    const feld = container.querySelector("select[aria-label='Disposition du clavier']") as HTMLSelectElement;
    expect(feld).toBeTruthy();
    const werte = [...feld.options].map((o) => o.value);
    expect(werte.filter((v) => v !== "de").sort()).toEqual([...FRANZOESISCHE_LAYOUT_IDS].sort());
    expect(werte).toContain("de"); // die eingestellte, sichtbar
    expect(werte).not.toContain("us");
    expect(container.textContent).toContain("seuls les claviers français sont proposés");
  });
  it("Weg fr mit französischer Tastatur: kein Hinweis, keine fremde Tastatur", () => {
    probe("fr");
    setLayout("fr");
    const { container } = zeige(<TypingSettings stufe="kids" lang="fr" onLangChange={() => {}} lernweg="fr" />);
    const feld = container.querySelector("select[aria-label='Disposition du clavier']") as HTMLSelectElement;
    expect([...feld.options].map((o) => o.value).sort()).toEqual([...FRANZOESISCHE_LAYOUT_IDS].sort());
    expect(container.textContent).not.toContain("seuls les claviers");
  });
  it("Weg es: nur Spanien und Lateinamerika", () => {
    probe("es");
    setLayout("es");
    const { container } = zeige(<TypingSettings stufe="kids" lang="es" onLangChange={() => {}} lernweg="es" />);
    const feld = container.querySelector("select[aria-label='Distribución del teclado']") as HTMLSelectElement;
    expect([...feld.options].map((o) => o.value).sort()).toEqual(["es", "latam"]);
  });
  it("GEGENPROBE Weg de: alle sichtbaren Tastaturen wie bisher", () => {
    probe("de");
    setLayout("de");
    const { container } = zeige(<TypingSettings stufe="kids" lang="de" onLangChange={() => {}} lernweg="de" />);
    const feld = container.querySelector("select[aria-label='Tastatur-Layout']") as HTMLSelectElement;
    // ★ 10.10.2026 (Freigabe it/pl/tr/cs): die vier Schalter sind default AN - ihre Tastaturen stehen mit.
    expect([...feld.options].map((o) => o.value)).toEqual(
      // ★ 06.11.2026 (Freigabe der neun): auch deren Tastaturen stehen mit.
      sichtbareLayouts(true, true, {
        it: true, pl: true, tr: true, cs: true,
        bg: true, el: true, hu: true, nl: true, pt: true, br: true, ro: true, sv: true, uk: true,
      }).map((l) => l.id),
    );
  });
  it("GEGENPROBE Weg de, die vier neuen im Not-Aus: nur die Tastaturen von de/fr/es wie vor der Freigabe", () => {
    probe("de");
    for (const m of [
      "tastenflow-italienisch-lehrgang",
      "tastenflow-polnisch-lehrgang",
      "tastenflow-tuerkisch-lehrgang",
      "tastenflow-tschechisch-lehrgang",
      // ★ 06.11.2026: die neun des Gerüts ebenfalls im Not-Aus
      "tastenflow-bulgarisch-lehrgang",
      "tastenflow-griechisch-lehrgang",
      "tastenflow-ungarisch-lehrgang",
      "tastenflow-niederlaendisch-lehrgang",
      "tastenflow-portugiesisch-lehrgang",
      "tastenflow-brasilianisch-lehrgang",
      "tastenflow-rumaenisch-lehrgang",
      "tastenflow-schwedisch-lehrgang",
      "tastenflow-ukrainisch-lehrgang",
    ])
      localStorage.setItem(m, "0");
    setLayout("de");
    const { container } = zeige(<TypingSettings stufe="kids" lang="de" onLangChange={() => {}} lernweg="de" />);
    const feld = container.querySelector("select[aria-label='Tastatur-Layout']") as HTMLSelectElement;
    const ids = [...feld.options].map((o) => o.value);
    expect(ids).toEqual(sichtbareLayouts(true, true).map((l) => l.id));
    for (const neu of ["it", "it-qzerty", "pl", "tr-q", "tr-f", "cs", "cs-qwerty"]) expect(ids).not.toContain(neu);
  });
});

describe("D1 Nr. 7 · 3. Einrichtung (Quelltext)", () => {
  it("der Tastatur-Schritt liest tastaturenFuerWeg und zeigt den Hinweis", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const q = readFileSync(resolve(__dirname, "../src/components/typing/Einrichtung.tsx"), "utf-8");
    expect(q).toContain("tastaturenFuerWeg(lernweg,");
    expect(q).toContain("t.tastaturNichtImWeg(");
    expect(q).not.toMatch(/sichtbareLayouts\(franzoesischLehrgangProbeAn\(\), spanischLehrgangProbeAn\(\)\)\.map/);
  });
});
