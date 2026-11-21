/**
 * TN-E9 (Text-Nachschub §5/§7): Humor-Offensive gegen die Frage-Antwort-
 * Schablone. Prüfbericht 27.07.: 88 % der deutschen Witze folgten dem Schema,
 * für Kinder gab es KEINEN Witz außerhalb der Rätselform.
 */
import { describe, expect, it } from "vitest";
import { CORPUS, CORPUS_EN, type CorpusItem } from "../src/lib/typing/corpus";
import { isDeactivated } from "../src/lib/typing/corpusDeactivated";
import { HUMOR_CORPUS } from "../src/lib/typing/corpusHumor";
import { EN_HUMOR_CORPUS } from "../src/lib/typing/corpusEnHumor";
import { validateHerkunft } from "../src/lib/typing/serien";
import { bausteinKey } from "../src/lib/typing/ledger";
import { minTierFor } from "../src/lib/typing/tiers";

/** Zielwert Bauplan §5: höchstens 60 % Rätsel-Schablone je Sprache. */
const SCHABLONE_MAX = 0.6;
// Die RÄTSEL-Schablone eng gefasst: nicht jede Frage ist ein Rätsel — ein Dialog
// („Wie war die Prüfung? Kurz.") ist genau die gewünschte Alternative und darf
// nicht mitgezählt werden. Erster Testlauf mit „jedes Fragewort" hat das
// aufgedeckt (eigener Dialog fiel durch die eigene Regel).
const RAETSEL_DE =
  /^(Was (ist|sind|macht|sagt|tut|hat|haben|liegt|passiert|kann|steht|fährt|trägt)|Warum|Wieso|Weshalb|Wie nennt man|Wie heißt|Welche[rsn]?\s|Wo (treffen|ist|sitzt|wohnt|fährt)|Wer (ist|hat|kann))/i;
const RAETSEL_EN =
  /^(What (is|are|do you call|did|does|has|have)|Why (did|do|does|can|cannot|are|is|was)|How (do|does|did) (you|the|a)|Which |Who (is|has)|Where (do|does|is))/i;

const aktiveWitze = (c: readonly CorpusItem[]): CorpusItem[] =>
  c.filter((e) => e.kind === "witz" && !isDeactivated(e.kind, e.text));

describe("TN-E9 Schablonen-Quote", () => {
  it("Deutsch: Frage-Antwort-Schema unter dem Zielwert", () => {
    const witze = aktiveWitze(CORPUS);
    const quote = witze.filter((e) => RAETSEL_DE.test(e.text)).length / witze.length;
    expect(quote, `${Math.round(quote * 100)} %`).toBeLessThanOrEqual(SCHABLONE_MAX);
  });

  it("Englisch: Frage-Antwort-Schema unter dem Zielwert", () => {
    const witze = aktiveWitze(CORPUS_EN);
    const quote = witze.filter((e) => RAETSEL_EN.test(e.text)).length / witze.length;
    expect(quote, `${Math.round(quote * 100)} %`).toBeLessThanOrEqual(SCHABLONE_MAX);
  });

  it("auch KINDER (Stufe a) haben jetzt Witze außerhalb der Rätselform", () => {
    for (const [name, corpus, re] of [
      ["de", CORPUS, RAETSEL_DE],
      ["en", CORPUS_EN, RAETSEL_EN],
    ] as const) {
      // S3: DE traegt die neuen Etiketten, EN (Phase 2) noch die alten.
      const jung = "kids";
      const kinder = aktiveWitze(corpus).filter((e) => e.stufen.includes(jung));
      const frei = kinder.filter((e) => !re.test(e.text));
      expect(frei.length, `${name}: keine schemafreien Kinder-Witze`).toBeGreaterThanOrEqual(8);
    }
  });
});

describe("TN-E9 neue Humor-Chargen", () => {
  it("Umfang und Formen-Vielfalt", () => {
    expect(HUMOR_CORPUS.length).toBeGreaterThanOrEqual(35);
    expect(EN_HUMOR_CORPUS.length).toBeGreaterThanOrEqual(25);
    // KEINE der neuen Zeilen ist ein Rätsel (Dialoge dürfen Fragen enthalten):
    for (const e of HUMOR_CORPUS) expect(e.text, e.text).not.toMatch(RAETSEL_DE);
    for (const e of EN_HUMOR_CORPUS) expect(e.text, e.text).not.toMatch(RAETSEL_EN);
  });

  it("alle mit Herkunft, sauberem Zeichensatz und höchstens 85 Zeichen", () => {
    for (const e of [...HUMOR_CORPUS, ...EN_HUMOR_CORPUS]) {
      expect(validateHerkunft(e.herkunft!), e.text).toEqual([]);
      expect(e.text.length, e.text).toBeLessThanOrEqual(85);
      expect(e.text, e.text).not.toMatch(/[„“”"«»…–—]/);
      expect(minTierFor(e.text, "de"), e.text).not.toBeNull();
    }
  });

  it("englische Zeilen ohne Apostroph (fitText würde sie verstümmeln)", () => {
    for (const e of EN_HUMOR_CORPUS) expect(e.text, e.text).not.toMatch(/['’]/);
  });

  it("Kinder-Humor bleibt bei a/b (TN-E4-Regel)", () => {
    for (const e of [...HUMOR_CORPUS, ...EN_HUMOR_CORPUS])
      if (e.stufen.includes("kids"))
        expect(e.stufen, e.text).not.toContain("erwachsen");
  });

  it("keine Dubletten gegen den jeweiligen Bestand", () => {
    for (const [neu, bestand] of [
      [HUMOR_CORPUS, CORPUS],
      [EN_HUMOR_CORPUS, CORPUS_EN],
    ] as const) {
      const meine = new Set(neu.map((e) => bausteinKey("", e.text)));
      const zaehler = new Map<string, number>();
      for (const e of bestand) {
        const k = bausteinKey("", e.text);
        if (meine.has(k)) zaehler.set(k, (zaehler.get(k) ?? 0) + 1);
      }
      expect([...zaehler.entries()].filter(([, n]) => n > 1).map(([k]) => k)).toEqual([]);
    }
  });
});

describe("TN-E9 stillgelegte pointenlose Witze", () => {
  it("die im Prüfbericht benannten schwächsten sind nicht mehr im Angebot", () => {
    for (const t of [
      "Was ist klein, rund und lacht? Ein Kuller, der kichert!",
      "Was macht der Fisch in der Schule? Er schwimmt von Buch zu Buch.",
      "Wie zählt die Spinne? Mit acht Beinen geht das ganz fix.",
    ])
      expect(isDeactivated("witz", t), t).toBe(true);
    for (const t of [
      "What is fast, loud and crunchy? A rocket chip.",
      "Why can't your nose be twelve inches long? Because then it would be a foot.",
    ])
      expect(isDeactivated("witz", t), t).toBe(true);
  });

  it("nichts wurde gelöscht — die Einträge stehen weiter im Korpus (Ledger stabil)", () => {
    expect(CORPUS.map((e) => e.text)).toContain(
      "Was ist klein, rund und lacht? Ein Kuller, der kichert!",
    );
  });
});
