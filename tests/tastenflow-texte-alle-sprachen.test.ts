/**
 * ★★★ G2a (02.10.2026, G1c §3 Nr. 1): `texte()` liefert für JEDE Sprache einen
 * Wert - nie `undefined`.
 *
 * Vorher baute `texte()` die Rückgabe mit vier festen Schlüsseln und einem
 * `as`-Cast. Sobald `BedienSprache` um eine fünfte Sprache wuchs, wäre jede
 * der rund 118 Bedienungs-Tabellen beim ersten Feldzugriff abgestürzt
 * (`texte(...)["it"]` ist `undefined`), ohne dass `tsc` etwas sagte. Jetzt wird
 * die Rückgabe aus der Liste ALLER Sprachen (Sprachregister) gebaut; eine
 * Sprache ohne eigene Tabelle fällt auf Englisch zurück.
 *
 * Zwei Teile:
 *  1. Eine Beispiel-Tabelle mit und ohne die optionalen Einträge.
 *  2. DIE ECHTEN TABELLEN: jede Datei, die `texte({ … })` aufruft, wird
 *     importiert, jeder Aufruf mitgeschnitten und je Sprache geprüft.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

const aufgenommen = vi.hoisted(() => ({ tabellen: [] as Array<Record<string, unknown>> }));

vi.mock("../src/lib/bedienSprache/texte", async (original) => {
  const echt = await original<typeof import("../src/lib/bedienSprache/texte")>();
  return {
    ...echt,
    texte: ((t: Parameters<typeof echt.texte>[0]) => {
      const r = echt.texte(t);
      aufgenommen.tabellen.push(r as Record<string, unknown>);
      return r;
    }) as typeof echt.texte,
  };
});

import { texte } from "../src/lib/bedienSprache/texte";
import { ALLE_SPRACHEN } from "../src/lib/typing/sprachRegister";

// ★ G2-NEUN (25.10.2026): dazu die neun Sprachen des Gerüsts.
const NEUE = ["it", "pl", "tr", "cs", "bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"] as const;

describe("texte(): Beispiel-Tabelle", () => {
  it("jede Sprache der Liste hat einen Wert", () => {
    const t = texte({ de: { a: "Hallo", n: (x: number) => `${x} Stück` }, en: { a: "Hello", n: (x: number) => `${x} items` } });
    for (const s of ALLE_SPRACHEN) {
      expect(t[s], s).toBeDefined();
      expect(typeof t[s].a, s).toBe("string");
      expect(typeof t[s].n(2), s).toBe("string");
    }
  });

  it("de ist die deutsche Tabelle, en die englische (Objekt für Objekt)", () => {
    const de = { a: "Hallo" };
    const en = { a: "Hello" };
    const t = texte({ de, en });
    expect(t.de).toBe(de);
    expect(t.en.a).toBe("Hello");
  });

  it("fr, es, it, pl, tr, cs OHNE eigene Tabelle: ENGLISCH - nie undefined, nie Deutsch", () => {
    const de = { a: "Hallo" };
    const en = { a: "Hello" };
    const t = texte({ de, en });
    for (const s of ["fr", "es", ...NEUE] as const) {
      expect(t[s], s).toBe(en);
      expect(t[s].a, s).toBe("Hello");
    }
  });

  it("eine eigene Tabelle gilt für ihre Sprache und für keine andere", () => {
    const t = texte({
      de: { a: "Hallo" },
      en: { a: "Hello" },
      it: { a: "Ciao" },
      pl: { a: "Cześć" },
      tr: { a: "Merhaba" },
      cs: { a: "Ahoj" },
      // ★ G2-NEUN (25.10.2026): eine Sprache des Gerüsts mit eigener Tabelle - die anderen acht bleiben Englisch.
      uk: { a: "Привіт" },
    });
    expect(t.uk.a).toBe("Привіт");
    expect(t.bg.a).toBe("Hello");
    expect(t.br.a).toBe("Hello");
    expect(t.it.a).toBe("Ciao");
    expect(t.pl.a).toBe("Cześć");
    expect(t.tr.a).toBe("Merhaba");
    expect(t.cs.a).toBe("Ahoj");
    expect(t.fr.a).toBe("Hello");
    expect(t.es.a).toBe("Hello");
    expect(t.de.a).toBe("Hallo");
  });

  it("die Rückgabe hat GENAU die Schlüssel der Sprachliste (kein vergessener, kein fremder)", () => {
    const t = texte({ de: { a: "x" }, en: { a: "y" } });
    expect(Object.keys(t).sort()).toEqual([...ALLE_SPRACHEN].sort());
  });
});

// ── 2 · die echten Tabellen ─────────────────────────────────────────────────

const WURZEL = resolve(__dirname, "..", "src");

function sammle(pfad: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(pfad)) {
    if (e === "node_modules") continue;
    const voll = join(pfad, e);
    if (statSync(voll).isDirectory()) out.push(...sammle(voll));
    else if (voll.endsWith(".ts") || voll.endsWith(".tsx")) out.push(voll);
  }
  return out;
}

/** Dateien, die `texte` importieren UND mindestens einmal `texte({` aufrufen. */
function dateienMitTabellen(): string[] {
  const re = /import\s*\{[^}]*\btexte\b[^}]*\}\s*from\s*["'][^"']*bedienSprache[^"']*["']/;
  return sammle(WURZEL).filter((f) => {
    const inhalt = readFileSync(f, "utf8");
    return re.test(inhalt) && /\btexte\s*\(\s*\{/.test(inhalt);
  });
}

describe("texte(): ALLE echten Bedienungs-Tabellen", () => {
  it("jede Tabelle liefert für jede Sprache einen Wert mit denselben Schlüsseln wie Deutsch", async () => {
    const dateien = dateienMitTabellen();
    expect(dateien.length, "es gibt viele Dateien mit Tabellen").toBeGreaterThan(50);
    const nichtGeladen: string[] = [];
    for (const f of dateien) {
      try {
        await import(/* @vite-ignore */ f);
      } catch (e) {
        nichtGeladen.push(`${f}: ${(e as Error).message}`);
      }
    }
    // Aufrufe, die nur in einer Funktion (beim Rendern) stehen, kommen hier nicht
    // vor - die Zahl der mitgeschnittenen Tabellen ist die Untergrenze des Beweises.
    const tabellen = aufgenommen.tabellen;
    expect(tabellen.length, `mitgeschnittene Tabellen (nicht ladbare Dateien: ${nichtGeladen.length})`).toBeGreaterThan(60);
    for (const t of tabellen) {
      const deKeys = Object.keys(t["de"] as object);
      for (const s of ALLE_SPRACHEN) {
        const eintrag = t[s] as Record<string, unknown> | undefined;
        expect(eintrag, `Sprache ${s} fehlt in einer Tabelle mit den Schlüsseln ${deKeys.slice(0, 3).join(", ")} …`).toBeDefined();
        for (const k of deKeys) {
          expect(eintrag, `Sprache ${s}, Schlüssel ${k}`).toHaveProperty(k);
          expect((eintrag as Record<string, unknown>)[k], `Sprache ${s}, Schlüssel ${k}`).not.toBeUndefined();
        }
      }
    }
  }, 240_000);
});
