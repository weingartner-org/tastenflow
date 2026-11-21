/**
 * ★★★ Ledger- und Dedup-Schlüssel kennen nur a-z äöüß (`bausteinKey` in
 * `ledger.ts`, `dedupKey` in `corpus.ts`): „mamá" und „mamó", „sí" und „sé"
 * ergäben denselben Schlüssel - die zweite Zeile würde als Doppel verworfen
 * und im No-Repeat-Ledger mit der ersten verwechselt (Fund ES-T1, 27.09.2026).
 *
 * Die Schlüssel selbst zu ändern hiesse, die IDs von 2.026 französischen Zeilen
 * zu verschieben, die live im Ledger der Kinder stehen - darum NICHT geändert.
 * Stattdessen dieser Wächter: in KEINER Sprache dürfen zwei verschiedene Texte
 * denselben Schlüssel haben. Gemessen am 27.09.: 0 Kollisionen in de/en/fr/es.
 */
import { describe, expect, it } from "vitest";
import { CORPUS, CORPUS_CS, CORPUS_EN, CORPUS_FR, CORPUS_IT, CORPUS_PL, CORPUS_TR } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { bausteinId, bausteinKey, buildManifest } from "../src/lib/typing/ledger";
import { ALLE_SPRACHEN, GERUEST_SPRACHEN, sprachBeschreibung } from "../src/lib/typing/sprachRegister";
import type { Lang } from "../src/lib/typing/account";
import { sprachDaten } from "../src/lib/typing/sprachpakete";

function kollisionen(zeilen: readonly { kind: string; text: string }[]): string[][] {
  const m = new Map<string, Set<string>>();
  for (const z of zeilen) {
    const k = bausteinKey(z.kind, z.text);
    if (!m.has(k)) m.set(k, new Set());
    m.get(k)!.add(z.text);
  }
  return [...m.values()].filter((s) => s.size > 1).map((s) => [...s]);
}

describe("Korpus: kein Schlüssel für zwei verschiedene Texte (Ledger/Dedup)", () => {
  for (const [name, c] of [["de", CORPUS], ["en", CORPUS_EN], ["fr", CORPUS_FR], ["es", CORPUS_ES]] as const) {
    it(`${name}: keine Kollision`, () => {
      expect(c.length).toBeGreaterThan(0);
      expect(kollisionen(c)).toEqual([]);
    });
  }
  it("Gegenprobe: mamá / mamó und sí / sé werden als Kollision gefunden", () => {
    const k = kollisionen([
      { kind: "satz", text: "mamá canta" },
      { kind: "satz", text: "mamó canta" },
      { kind: "wort", text: "sí" },
      { kind: "wort", text: "sé" },
    ]);
    expect(k.length).toBe(2);
  });
});

/*
 * ★★★ G3a-SCHRIFT (25.10.2026): die neun Sprachen des Gerüsts (Register-Eigenschaft `schluesselAlleBuchstaben`).
 * Mit der alten Klasse `[^a-zäöüß0-9]` wird ein bulgarischer, ukrainischer oder griechischer Satz LEER - jede Zeile
 * bekäme dieselbe ID, `mergeCorpus` verschmölze sie alle zu einer. Die acht Sprachen vor dem 25.10.2026 behalten
 * jede ID (Anker, Ledger jedes Kindes): für sie rechnet der Schlüssel mit Sprache Zeichen für Zeichen wie ohne.
 */
const NEUE_SAETZE: readonly [Lang, string, string][] = [
  ["bg", "То е нашият дом.", "Там е нашата къща."],
  ["bg", "Щом дойде, ще ядем.", "Щом дойдеш, ще ядем."],
  ["uk", "Це наша хата.", "Це їхня хата."],
  ["uk", "Мій день.", "Мої дні."],
  ["el", "Πού είσαι;", "Που είσαι;"],
  ["el", "Πώς είσαι;", "Πως είσαι;"],
  ["hu", "szőr", "szűr"],
  ["ro", "Ță ța", "Șa șa"],
  ["pt", "lã", "lá"],
  ["sv", "åt", "ät"],
];

describe("★ G3a-SCHRIFT: Schlüssel der neun Sprachen", () => {
  it("die Eigenschaft steht genau für die neun Sprachen des Gerüsts", () => {
    for (const s of ALLE_SPRACHEN) {
      expect(sprachBeschreibung(s).schluesselAlleBuchstaben, s).toBe((GERUEST_SPRACHEN as readonly Lang[]).includes(s));
    }
  });

  it.each(NEUE_SAETZE)("%s: „%s“ und „%s“ haben nicht leere, verschiedene Schlüssel", (lang, a, b) => {
    const ka = bausteinKey("satz", a, lang);
    const kb = bausteinKey("satz", b, lang);
    expect(ka.length).toBeGreaterThan("satz|".length);
    expect(ka).not.toBe(kb);
    expect(bausteinId("satz", a, lang)).not.toBe(bausteinId("satz", b, lang));
  });

  it("Gegenprobe: mit der alten Klasse (ohne Sprache) werden kyrillische und griechische Sätze leer und fallen zusammen", () => {
    expect(bausteinKey("satz", "То е нашият дом.")).toBe("satz|");
    expect(bausteinKey("satz", "Πού είσαι;")).toBe(bausteinKey("satz", "Τι κάνεις;"));
    expect(bausteinKey("wort", "szőr")).toBe(bausteinKey("wort", "szűr"));
  });

  it("kosmetisch gleich bleibt gleich: Gross/Klein, Satzzeichen, NFD, Apostroph-Form, Schluss-Sigma", () => {
    expect(bausteinKey("satz", "Це наша хата.", "uk")).toBe(bausteinKey("satz", "це наша хата", "uk"));
    expect(bausteinKey("wort", "й", "uk")).toBe(bausteinKey("wort", "й", "uk"));
    expect(bausteinKey("wort", "сімʼя", "uk")).toBe(bausteinKey("wort", "сім'я", "uk"));
    expect(bausteinKey("wort", "сім’я", "uk")).toBe(bausteinKey("wort", "сім'я", "uk"));
    expect(bausteinKey("wort", "ΟΔΟΣ", "el")).toBe(bausteinKey("wort", "οδος", "el"));
    expect(bausteinKey("wort", "οδοσ", "el")).toBe(bausteinKey("wort", "οδος", "el"));
    expect(bausteinKey("wort", "auto's", "nl")).toBe(bausteinKey("wort", "auto’s", "nl"));
  });

  it("die Zeile trägt die Sprache über `nurWeg` - Manifest und Entdopplung trennen die Sätze", () => {
    const zeilen = NEUE_SAETZE.flatMap(([lang, a, b]) => [
      { kind: "satz", text: a, nurWeg: lang },
      { kind: "satz", text: b, nurWeg: lang },
    ]);
    expect(buildManifest(zeilen).ids.length).toBe(zeilen.length);
    // Gegenprobe: ohne `nurWeg` (alte Klasse) bleiben von 20 Zeilen nur wenige übrig.
    expect(buildManifest(zeilen.map(({ kind, text }) => ({ kind, text }))).ids.length).toBeLessThan(zeilen.length);
  });

  it("die acht Sprachen vor dem 25.10.2026: der Schlüssel mit Sprache ist Zeichen für Zeichen der alte", () => {
    const korpora: readonly [Lang, readonly { kind: string; text: string; nurWeg?: Lang }[]][] = [
      ["de", CORPUS], ["en", CORPUS_EN], ["fr", CORPUS_FR], ["es", CORPUS_ES],
      ["it", CORPUS_IT], ["pl", CORPUS_PL], ["tr", CORPUS_TR], ["cs", CORPUS_CS],
    ];
    let geprueft = 0;
    for (const [lang, c] of korpora) {
      expect(c.length, lang).toBeGreaterThan(0);
      for (const z of c) {
        expect(bausteinKey(z.kind, z.text, lang)).toBe(bausteinKey(z.kind, z.text));
        expect(bausteinKey(z.kind, z.text, z.nurWeg)).toBe(bausteinKey(z.kind, z.text));
        geprueft++;
      }
    }
    expect(geprueft).toBeGreaterThan(10_000);
  });

  it("jede Zeile im Sprachpaket einer der neun Sprachen trägt `nurWeg` = ihre Sprache (sonst rechnete ihr Schlüssel alt)", () => {
    for (const s of GERUEST_SPRACHEN) {
      for (const z of sprachDaten(s)?.korpus ?? []) expect(z.nurWeg, `${s}: ${z.text}`).toBe(s);
    }
  });
});

