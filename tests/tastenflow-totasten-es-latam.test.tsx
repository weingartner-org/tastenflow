/**
 * ★★★★★ WÄCHTER M1 (ES-P7a-Behebung, 27.09.2026, Prüfbericht Fundament es):
 * Die Totasten-Mechanik („Totaste + Grundbuchstabe = EIN Anschlag, ein
 * Fehlgriff bleibt ein Fehlgriff") galt bis dahin NUR auf den fünf
 * französischen Tastaturen - an sechs Stellen stand `FRANZOESISCHE_LAYOUT_IDS
 * .has(activeLayoutId())` einzeln. Auf „es"/„latam" wurden ´ und ¨ darum NIE
 * als Anschlag verbucht (0 in 605 Runden bei 6.340 getippten Akzent-
 * buchstaben, Prüfbericht e2), ein Fehlgriff auf der Totaste verschwand aus
 * jeder Zählung (e10), und beide Einheiten blieben für immer „neu".
 *
 * Behoben: EINE Funktion `hatLehrgangsTotasten` (`layouts.ts`, FRANZOESISCHE_
 * LAYOUT_IDS ∪ SPANISCHE_LAYOUT_IDS) ersetzt alle sechs Kopien.
 *
 * Geprüft wird die FEHLERKLASSE: die Totasten-Mechanik wirkt auf JEDER
 * Tastatur mit Lehrgangs-Totasten (fr-Familie UND es/latam) gleich, bleibt
 * auf de/us/uk aus, und keine Stelle im Quelltext vergleicht mehr allein
 * gegen `FRANZOESISCHE_LAYOUT_IDS` für eine Entscheidung, die eigentlich
 * „hat diese Tastatur Totasten?" meint.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { useTypingItem } from "@/components/typing/useTypingItem";
import {
  FRANZOESISCHE_LAYOUT_IDS,
  SPANISCHE_LAYOUT_IDS,
  hatLehrgangsTotasten,
  setLayout,
  type LayoutId,
} from "@/lib/typing/layouts";

afterEach(() => setLayout("de"));

function taste(key: string): KeyboardEvent {
  return { key, preventDefault: () => {} } as unknown as KeyboardEvent;
}

describe("★★★★★ M1: hatLehrgangsTotasten fasst fr- und es-Familie zusammen", () => {
  it("jede französische und jede spanische Tastatur ist dabei", () => {
    for (const l of [...FRANZOESISCHE_LAYOUT_IDS, ...SPANISCHE_LAYOUT_IDS]) {
      expect(hatLehrgangsTotasten(l as LayoutId), l).toBe(true);
    }
  });

  it("de/ch/us/uk bleiben aussen vor - die deutsche Zirkumflex-Totaste ^ zählt hier nicht", () => {
    for (const l of ["de", "ch", "us", "uk"] as LayoutId[]) {
      expect(hatLehrgangsTotasten(l), l).toBe(false);
    }
  });
});

describe("★★★★★ M1: es/latam verbuchen ´/¨ wie die französische Familie", () => {
  for (const l of ["es", "latam"] as LayoutId[]) {
    it(`${l}: „á" - Dead ist ein Zwischenzustand, kein Fehler`, () => {
      setLayout(l);
      const onComplete = vi.fn();
      const { result } = renderHook(() => useTypingItem({ expected: "á", active: true, onComplete }));
      act(() => result.current.handleKey(taste("Dead")));
      expect(result.current.errors).toBe(0);
      act(() => result.current.handleKey(taste("á")));
      expect(result.current.index).toBe(1);
      expect(result.current.errors).toBe(0);
    });

    it(`${l}: „ü" über die Trema-Totaste`, () => {
      setLayout(l);
      const onComplete = vi.fn();
      const { result } = renderHook(() => useTypingItem({ expected: "ü", active: true, onComplete }));
      act(() => result.current.handleKey(taste("Dead")));
      act(() => result.current.handleKey(taste("ü")));
      expect(result.current.index).toBe(1);
      expect(result.current.errors).toBe(0);
    });

    it(`${l}: ein Fehlgriff auf der Totaste vor „p" ist EIN Fehler, kein stiller Treffer (vorher: 0, e10-Messung)`, () => {
      // ★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.8): die Totaste
      // selbst ist KEIN Fehler mehr (Johannes: „bewertet wird erst das fertige
      // Zeichen") - der Fehler kommt mit dem „p", weil dabei „´p" entsteht.
      // Das Ergebnis bleibt: EIN Fehler, kein stiller Treffer.
      setLayout(l);
      const onComplete = vi.fn();
      const { result } = renderHook(() => useTypingItem({ expected: "p", active: true, onComplete }));
      act(() => result.current.handleKey(taste("Dead")));
      expect(result.current.errors).toBe(0); // W1: Wartezustand
      expect(result.current.index).toBe(0);
      // Chrome/Edge: nur „p" - entstanden ist „´p", kein Treffer.
      act(() => result.current.handleKey(taste("p")));
      expect(result.current.index).toBe(0);
      expect(result.current.errors).toBe(1);
      expect(result.current.done).toBe(false);
      // erst der wirkliche, dritte Anschlag trifft die Stelle.
      act(() => result.current.handleKey(taste("p")));
      expect(result.current.index).toBe(1);
      expect(result.current.errors).toBe(1);
    });
  }
});

describe("M1: keine Stelle vergleicht mehr allein gegen FRANZOESISCHE_LAYOUT_IDS für die Totasten-Mechanik", () => {
  it("src/components/typing: kein `FRANZOESISCHE_LAYOUT_IDS.has(activeLayoutId())` mehr", () => {
    const wurzel = resolve(__dirname, "../src/components/typing");
    const dateien: string[] = [];
    const lauf = (d: string) => {
      for (const n of readdirSync(d)) {
        const p = join(d, n);
        if (statSync(p).isDirectory()) lauf(p);
        else if (/\.(tsx?|ts)$/.test(n)) dateien.push(p);
      }
    };
    lauf(wurzel);
    const treffer = dateien.filter((p) =>
      /FRANZOESISCHE_LAYOUT_IDS\.has\(activeLayoutId\(\)\)/.test(readFileSync(p, "utf8")),
    );
    expect(treffer).toEqual([]);
  });
});
