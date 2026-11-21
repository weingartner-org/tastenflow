/**
 * ★ E4a-Nachbesserung (24.09.2026, BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md §6.2):
 * Eine Zeile, die nur für Lernweg „en" geschrieben ist (`nurWeg: "en"`), darf
 * NICHT wortgleich mit einer gemeinsamen Zeile sein.
 *
 * Grund: `mergeCorpus` führt Doppelte zusammen. Bis zur Nachbesserung hätte
 * eine solche Zeile die gemeinsame zu einer „nur en"-Zeile gemacht - Weg „de"
 * hätte sie still verloren. Der Schlüssel trägt jetzt den Weg mit; dieser
 * Wächter sorgt zusätzlich dafür, dass ein Kind auf Weg „en" dieselbe Zeile
 * nicht zweimal bekommt. Gegenprobe unten: der Vergleich findet eine Doppelte.
 */
import { describe, expect, it } from "vitest";
import { CORPUS, CORPUS_EN, type CorpusItem } from "../src/lib/typing/corpus";
import { SERIEN } from "../src/lib/typing/serien";

function schluessel(text: string): string {
  return text.toLowerCase().replace(/[^a-zäöüß0-9]+/g, " ").trim();
}

function doppelte(alle: readonly { text: string; nurWeg?: string }[]): string[] {
  const gemeinsam = new Set(alle.filter((it) => it.nurWeg === undefined).map((it) => schluessel(it.text)));
  return alle.filter((it) => it.nurWeg !== undefined && gemeinsam.has(schluessel(it.text))).map((it) => it.text);
}

function serienZeilen(): { text: string; nurWeg?: string }[] {
  const zeilen: { text: string; nurWeg?: string }[] = [];
  for (const s of SERIEN) {
    for (const e of s.etappen) for (const z of e.lines) zeilen.push({ text: z, nurWeg: s.nurWeg });
  }
  return zeilen;
}

describe("★ Lernweg-Inhalte: keine Zeile doppelt über die Wege hinweg", () => {
  it("Korpus: keine nurWeg-Zeile ist wortgleich mit einer gemeinsamen", () => {
    expect(doppelte([...CORPUS, ...CORPUS_EN])).toEqual([]);
  });

  it("Serien: keine Zeile einer nurWeg-Serie steht auch in einer gemeinsamen Serie oder im Korpus", () => {
    const korpus = [...CORPUS, ...CORPUS_EN].filter((it) => it.nurWeg === undefined);
    expect(doppelte([...korpus, ...serienZeilen()])).toEqual([]);
  });

  it("GEGENPROBE: eine eingeschmuggelte Doppelte wird gefunden", () => {
    const erste = CORPUS_EN.find((it) => it.nurWeg === undefined) as CorpusItem;
    const schmuggel = { ...erste, text: erste.text.toUpperCase() + "!", nurWeg: "en" as const };
    expect(doppelte([...CORPUS_EN, schmuggel])).toEqual([schmuggel.text]);
  });
});
