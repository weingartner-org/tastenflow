/**
 * ★★★★ WÄCHTER S3 (Mechanik-Prüfung des französischen Lehrgangs, 26.09.2026):
 * GROSSE Totasten-Buchstaben („Î", „Ô", „Ê", „Ë" …) blockieren keine Zeile.
 *
 * Der Fund: `erwartetTotaste` verglich `k.zeichen === ziel` - nur klein. Stand
 * „Île" oder „Ôter" in einer Zeile (Eigene Übung, eigene Datei, Freies
 * Schreiben), galt die Totaste als FEHLGRIFF, der nächste Anschlag wurde
 * verschluckt, und die Stelle erwartete weiter „Î" - das Kind kam nicht
 * heraus. Dazu die Auto-Großschreibung: „É" galt nicht als Großbuchstabe
 * (`[a-zäöü]`), auf Kanada blieb ein Kind vor der Umschalttaste an „École"
 * stehen.
 *
 * Geprüft wird die FEHLERKLASSE: jedes zusammengesetzte Zeichen JEDER
 * französischen Tastatur, klein UND gross, über die eine Funktion, die alle
 * Tastendruck-Stellen fragen (Übung, Schneerutsche, Klassenmatch über
 * `useTypingItem`) - und eine Quelltext-Prüfung, dass keine Stelle mehr
 * selbst `k.zeichen === …` vergleicht.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { useTypingItem } from "@/components/typing/useTypingItem";
import { activeLayout, setLayout, type LayoutId } from "@/lib/typing/layouts";
import { erwartetTotaste, kombizeichenFuerLayout, kombizeichenZu } from "@/lib/typing/totasten";

afterEach(() => setLayout("de"));

const TASTATUREN: LayoutId[] = ["fr", "be", "ch-fr", "ca-csa", "ca-fr"];

function taste(key: string): KeyboardEvent {
  return { key, preventDefault: () => {} } as unknown as KeyboardEvent;
}

describe("★★★★ S3: grosse Kombizeichen erwarten die Totaste", () => {
  for (const l of TASTATUREN) {
    it(`${l}: jedes Kombizeichen klein UND gross`, () => {
      setLayout(l);
      const lay = activeLayout();
      const kombis = kombizeichenFuerLayout(lay);
      expect(kombis.length).toBeGreaterThan(0);
      for (const k of kombis) {
        const gross = k.zeichen.toUpperCase();
        expect(erwartetTotaste(k.zeichen, lay), k.zeichen).toBe(true);
        expect(erwartetTotaste(gross, lay), gross).toBe(true);
        const z = kombizeichenZu(gross, lay);
        expect(z?.tot).toBe(k.tot);
        expect(z?.dann).toBe(k.dann.toUpperCase());
      }
      expect(kombizeichenZu("p", lay)).toBeUndefined();
    });
  }

  it("fr: „Î\" - Dead ist ein Zwischenzustand, das fertige Zeichen trifft", () => {
    setLayout("fr");
    const onComplete = vi.fn();
    const { result } = renderHook(() => useTypingItem({ expected: "Île", active: true, onComplete }));
    act(() => result.current.handleKey(taste("Dead")));
    expect(result.current.errors).toBe(0);
    act(() => result.current.handleKey(taste("Î")));
    expect(result.current.index).toBe(1);
    expect(result.current.errors).toBe(0);
  });

  it("ca-csa vor der Umschalttaste: „é\" genügt für „É\" (Auto-Großschreibung)", () => {
    setLayout("ca-csa");
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "École", active: true, onComplete, acceptLowerForUpper: true }),
    );
    act(() => result.current.handleKey(taste("é")));
    expect(result.current.index).toBe(1);
    expect(result.current.errors).toBe(0);
  });

  it("vor der Umschalttaste: „ê\" genügt für „Ê\" - auch nach der Totaste", () => {
    setLayout("fr");
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected: "Être", active: true, onComplete, acceptLowerForUpper: true }),
    );
    act(() => result.current.handleKey(taste("Dead")));
    act(() => result.current.handleKey(taste("ê")));
    expect(result.current.index).toBe(1);
    expect(result.current.errors).toBe(0);
  });
});

describe("S3: keine Stelle vergleicht Kombizeichen mehr selbst", () => {
  it("src/components: kein `kombizeichenFuerLayout(…).find/some(… === …)`", () => {
    const wurzel = resolve(__dirname, "../src/components");
    const dateien: string[] = [];
    const lauf = (d: string) => {
      for (const n of readdirSync(d)) {
        const p = join(d, n);
        if (statSync(p).isDirectory()) lauf(p);
        else if (/\.(tsx?|ts)$/.test(n)) dateien.push(p);
      }
    };
    lauf(wurzel);
    const treffer = dateien.filter((p) => /kombizeichenFuerLayout\([^)]*\)\s*\.(find|some)\(/.test(readFileSync(p, "utf8")));
    expect(treffer).toEqual([]);
  });
});
