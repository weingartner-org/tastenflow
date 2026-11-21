/**
 * ★★★★ WÄCHTER: WAS IN WELCHEM SPRACHPAKET STEHT (28.09.2026).
 *
 * Seit Tastenflow die Texte je Sprache nachlädt (`src/lib/typing/sprachpakete.ts`)
 * gibt es drei neue Arten, still etwas zu verlieren - jede hat hier ihre Prüfung:
 *
 *  1. Eine Serien-Liste steht in einem Paket, aber nicht in `SERIEN_FOLGE`
 *     (serien.ts) - dann stünde sie irgendwo hinten statt an ihrem Platz.
 *  2. Eine Serie trägt eine andere Sprache als ihr Paket - dann fehlte sie
 *     einem Kind, dessen Weg nur diese andere Sprache lädt.
 *  3. Ein Paket zieht über eine gemeinsame Datendatei ein ANDERES mit (bis
 *     28.09. trug `corpusData2.ts` Deutsch UND Englisch - das englische Paket
 *     hätte das deutsche zu jedem Kind gebracht). Geprüft am Quelltext, wie
 *     `tests/buendel-aufteilung.test.ts`.
 *
 * Dazu die EINE Stelle, die bestimmt, welcher Weg welche Pakete lädt.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { SPRACHPAKET_DE } from "@/lib/typing/sprachpaketDe";
import { SPRACHPAKET_EN } from "@/lib/typing/sprachpaketEn";
import { SPRACHPAKET_FR } from "@/lib/typing/sprachpaketFr";
import { SPRACHPAKET_ES } from "@/lib/typing/sprachpaketEs";
import { SPRACHPAKET_IT } from "@/lib/typing/sprachpaketIt";
import { SPRACHPAKET_PL } from "@/lib/typing/sprachpaketPl";
import { SPRACHPAKET_TR } from "@/lib/typing/sprachpaketTr";
import { SPRACHPAKET_CS } from "@/lib/typing/sprachpaketCs";
import { SPRACHPAKET_BG } from "@/lib/typing/sprachpaketBg";
import { SPRACHPAKET_EL } from "@/lib/typing/sprachpaketEl";
import { SPRACHPAKET_HU } from "@/lib/typing/sprachpaketHu";
import { SPRACHPAKET_NL } from "@/lib/typing/sprachpaketNl";
import { SPRACHPAKET_PT } from "@/lib/typing/sprachpaketPt";
import { SPRACHPAKET_BR } from "@/lib/typing/sprachpaketBr";
import { SPRACHPAKET_RO } from "@/lib/typing/sprachpaketRo";
import { SPRACHPAKET_SV } from "@/lib/typing/sprachpaketSv";
import { SPRACHPAKET_UK } from "@/lib/typing/sprachpaketUk";
import { ALLE_SPRACHPAKETE, type SprachDaten } from "@/lib/typing/sprachpakete";
import { SERIEN_FOLGE } from "@/lib/typing/serien";
import { sprachPaketeFuer } from "@/lib/typing/sprachpaketBedarf";
import { uebungsSpracheImWeg, uebungsSprachenImWeg, type Lang } from "@/lib/typing/account";
import { LERNWEGE_LISTE } from "@/lib/typing/lernweg";
import { SPRACHPAKET_MUSTER, TF_DATEN_MUSTER, spracheVon } from "../scripts/buendel-aufteilung";

const PAKETE: Record<Lang, SprachDaten> = {
  de: SPRACHPAKET_DE,
  en: SPRACHPAKET_EN,
  fr: SPRACHPAKET_FR,
  es: SPRACHPAKET_ES,
  // G2a: vier LEERE Pakete (Gerüst) - Typ-Pflicht von `Record<Lang, …>`, keine Assertion geändert.
  it: SPRACHPAKET_IT,
  pl: SPRACHPAKET_PL,
  tr: SPRACHPAKET_TR,
  cs: SPRACHPAKET_CS,
  // ★ G2-NEUN (25.10.2026): die neun leeren Pakete des Gerüsts (Typ-Pflicht, Prüfungen unverändert).
  bg: SPRACHPAKET_BG,
  el: SPRACHPAKET_EL,
  hu: SPRACHPAKET_HU,
  nl: SPRACHPAKET_NL,
  pt: SPRACHPAKET_PT,
  br: SPRACHPAKET_BR,
  ro: SPRACHPAKET_RO,
  sv: SPRACHPAKET_SV,
  uk: SPRACHPAKET_UK,
};

describe("1 · jede Serien-Liste hat ihren Platz in SERIEN_FOLGE", () => {
  it("es gibt für jede Sprache ein Paket", () => {
    expect([...ALLE_SPRACHPAKETE].sort()).toEqual(Object.keys(PAKETE).sort());
  });

  it("Paket ⇔ SERIEN_FOLGE: dieselben Namen, jede Sprache", () => {
    for (const lang of ALLE_SPRACHPAKETE) {
      const imPaket = Object.keys(PAKETE[lang].serien).sort();
      const inFolge = SERIEN_FOLGE.filter(([l]) => l === lang)
        .map(([, n]) => n)
        .sort();
      expect(imPaket, `Paket „${lang}"`).toEqual(inFolge);
    }
  });

  it("kein Name zweimal", () => {
    const namen = SERIEN_FOLGE.map(([l, n]) => `${l}|${n}`);
    expect(new Set(namen).size).toBe(namen.length);
  });
});

describe("2 · was im Paket einer Sprache steht, gehört zu dieser Sprache", () => {
  it.each(["de", "en", "fr", "es", "it", "pl", "tr"] as const)("Serien im Paket „%s\" tragen „%s\"", (lang) => {
    const fremd = Object.values(PAKETE[lang].serien)
      .flat()
      .filter((s) => (s.lang ?? "de") !== lang)
      .map((s) => `${s.slug} (${s.lang ?? "de"})`);
    expect(fremd).toEqual([]);
  });

  it.each(["en", "fr", "es", "it", "pl", "tr"] as const)(
    "Korpus im Paket „%s\": keine Zeile, die nur auf einen fremden Weg gehört",
    (lang) => {
      // `nurWeg` bindet eine Zeile an einen Weg; im englischen Paket stehen
      // Zeilen für Weg „en" UND gemeinsame (Weg de mit Englisch) - nie eine
      // für Weg fr/es, die dort ohne ihr Paket fehlen würde.
      const erlaubt = new Set<string | undefined>(
        lang === "en" ? [undefined, "en"] : [undefined, lang],
      );
      const fremd = PAKETE[lang].korpus.filter((it) => !erlaubt.has(it.nurWeg)).map((it) => it.text);
      expect(fremd).toEqual([]);
    },
  );
});

// ── 3 · kein Paket zieht ein anderes mit (am Quelltext) ───────────────────────

const TYPING = resolve(__dirname, "../src/lib/typing");
const SRC = resolve(__dirname, "../src");

function dateien(ordner: string): string[] {
  const raus: string[] = [];
  for (const e of readdirSync(ordner)) {
    const voll = join(ordner, e);
    if (statSync(voll).isDirectory()) raus.push(...dateien(voll));
    else if (/\.tsx?$/.test(e)) raus.push(voll);
  }
  return raus;
}

/** Wert-Importe (ohne `import type`, ohne Kommentare). */
function wertImporte(datei: string): string[] {
  const quelltext = readFileSync(datei, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const raus: string[] = [];
  const muster = /^(import|export)\s+(type\s+)?([\s\S]*?)\s*from\s+"([^"]+)";?/gm;
  let m: RegExpExecArray | null;
  while ((m = muster.exec(quelltext))) {
    if (m[2]) continue;
    const klammer = /\{([\s\S]*)\}/.exec(m[3]);
    if (klammer) {
      const teile = klammer[1].split(",").map((t) => t.trim()).filter(Boolean);
      const standard = m[3].slice(0, m[3].indexOf("{")).replace(/,\s*$/, "").trim();
      if (!standard && teile.length > 0 && teile.every((t) => t.startsWith("type "))) continue;
    }
    raus.push(m[4]);
  }
  return raus;
}

function aufloesen(von: string, ziel: string): string | null {
  let basis: string;
  if (ziel.startsWith("@/")) basis = join(SRC, ziel.slice(2));
  else if (ziel.startsWith(".")) basis = resolve(join(von, ".."), ziel);
  else return null;
  for (const k of [basis, `${basis}.ts`, `${basis}.tsx`, join(basis, "index.ts")]) {
    try {
      if (statSync(k).isFile()) return k;
    } catch {
      /* weiter */
    }
  }
  return null;
}

const typingName = (voll: string) =>
  voll.startsWith(TYPING) && voll.endsWith(".ts") ? relative(TYPING, voll).replace(/\\/g, "/").slice(0, -3) : null;
const istDaten = (voll: string) => {
  const n = typingName(voll);
  return n !== null && TF_DATEN_MUSTER.test(n);
};

describe("3 · kein Sprachpaket zieht ein anderes mit", () => {
  const alle = dateien(SRC);
  const graph = new Map(alle.map((d) => [d, wertImporte(d).map((z) => aufloesen(d, z)).filter((x): x is string => !!x)]));
  // Was CODE statisch erreicht, lädt ohnehin jeder (`tf-fest-…`) - das darf jedes Paket teilen.
  const fest = new Set<string>();
  const stapel = alle.filter((d) => !istDaten(d));
  while (stapel.length) {
    const d = stapel.pop()!;
    for (const z of graph.get(d) ?? []) {
      if (!fest.has(z) && istDaten(z)) {
        fest.add(z);
        stapel.push(z);
      } else if (!istDaten(z)) {
        /* Code - wird selbst durchlaufen */
      }
    }
  }

  /** Was vom Paket `k` aus erreichbar ist, nicht fest geladen wird und eine andere Sprache hat. */
  function fremdeIn(k: string, g: Map<string, string[]>): { gesehen: number; fremd: string[] } {
    const start = join(TYPING, `sprachpaket${k}.ts`);
    const sprache = spracheVon(`sprachpaket${k}`);
    const gesehen = new Set<string>();
    const offen = [start];
    const fremd: string[] = [];
    while (offen.length) {
      const d = offen.pop()!;
      if (gesehen.has(d)) continue;
      gesehen.add(d);
      const name = typingName(d)!;
      if (d !== start && !fest.has(d) && spracheVon(name) !== sprache) fremd.push(name);
      for (const z of g.get(d) ?? []) offen.push(z);
    }
    return { gesehen: gesehen.size, fremd };
  }

  it.each(["De", "En", "Fr", "Es", "It", "Pl", "Tr"])("sprachpaket%s: alles Nachgeladene ist von seiner Sprache", (k) => {
    expect(SPRACHPAKET_MUSTER.test(`sprachpaket${k}`)).toBe(true);
    const { gesehen, fremd } = fremdeIn(k, graph);
    // ★ F5-F8-it: das italienische Paket hat bis zu den Text-Chargen nur drei Dateien (Paket, `corpusIt`, `lexikonNachtragIt`);
    // ★ F5-F8-pl/-tr (03.10.2026): ebenso.
    expect(gesehen, "der Wächter läuft durch das Paket").toBeGreaterThan(k === "It" || k === "Pl" || k === "Tr" ? 2 : 3);
    expect(fremd, `sprachpaket${k} zöge das Paket einer anderen Sprache mit`).toEqual([]);
  });

  it("kein Code-Modul importiert ein Sprachpaket statisch (sonst lädt es jeder)", () => {
    const verstoesse: string[] = [];
    for (const [d, ziele] of graph) {
      if (istDaten(d)) continue;
      for (const z of ziele) {
        const n = typingName(z);
        if (n && SPRACHPAKET_MUSTER.test(n)) verstoesse.push(`${relative(SRC, d)} → ${n}`);
      }
    }
    expect(verstoesse).toEqual([]);
  });

  it("★★ GEGENPROBE: der Wächter sieht eine Datei, die zwei Sprachen verbindet", () => {
    // corpusData2.ts trug bis 28.09. auch die englische Hälfte - nachgestellt:
    // das englische Paket importiert die (deutsche) Datei wieder.
    const start = join(TYPING, "sprachpaketEn.ts");
    const kuenstlich = new Map(graph);
    kuenstlich.set(start, [...(graph.get(start) ?? []), join(TYPING, "corpusData2.ts")]);
    expect(fremdeIn("En", kuenstlich).fremd).toContain("corpusData2");
  });
});

describe("4 · die EINE Stelle: welcher Weg welche Pakete lädt", () => {
  it("Johannes 28.09.: die Sprache des Kindes, Englisch immer dazu", () => {
    expect(sprachPaketeFuer("de")).toEqual(["de", "en"]);
    expect(sprachPaketeFuer("en")).toEqual(["en"]);
    expect(sprachPaketeFuer("fr")).toEqual(["fr", "en"]);
    expect(sprachPaketeFuer("es")).toEqual(["es", "en"]);
    // ★ F5-F8-it (02.10.2026): Italienisch hat seit seiner Hauptsprache dieselbe Regel - sein Paket (Lexikon) und Englisch.
    expect(sprachPaketeFuer("it")).toEqual(["it", "en"]);
    // ★ F5-F8-pl (03.10.2026): Polnisch ebenso - sein Paket (Lexikon) und Englisch.
    expect(sprachPaketeFuer("pl")).toEqual(["pl", "en"]);
    // ★ F5-F8-tr (03.10.2026): Türkisch ebenso.
    expect(sprachPaketeFuer("tr")).toEqual(["tr", "en"]);
  });

  it("die Übungssprache, die das Kind wirklich hat, kommt dazu (Weg en mit Deutsch)", () => {
    expect(sprachPaketeFuer("en", "de")).toEqual(["en", "de"]);
    expect(sprachPaketeFuer("de", "en")).toEqual(["de", "en"]);
    // Deutsch ist auf Weg es nie Übungssprache - also auch kein deutsches Paket.
    expect(sprachPaketeFuer("es", "de")).toEqual(["es", "en"]);
    expect(sprachPaketeFuer("fr", "en")).toEqual(["fr", "en"]);
  });

  it("jeder Weg, jede gespeicherte Sprache: die wirksame Übungssprache ist geladen", () => {
    for (const weg of LERNWEGE_LISTE)
      for (const lang of [undefined, ...ALLE_SPRACHPAKETE]) {
        const pakete = sprachPaketeFuer(weg, lang);
        expect(pakete, `${weg}/${lang}`).toContain(uebungsSpracheImWeg(lang, weg));
        expect(pakete, `${weg}/${lang}`).toContain("en");
        // nie mehr als die Sprachen, die auf diesem Weg geübt werden können
        for (const p of pakete) expect(uebungsSprachenImWeg(weg), `${weg}/${lang}`).toContain(p);
      }
  });
});
