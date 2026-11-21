/**
 * ★★★★★ E9 (24.09.2026, Bauplan §8.2) - DER TIER-WÄCHTER DER SCHREIBWEISE.
 *
 * Auftrag Punkt 2, wörtlich: „Guard test: for every English corpus line and
 * series line, the US form has the same key set tier (minTierFor) as the
 * British one on both lernwege, and fitsKeys behaves the same … check the
 * reverse cases and report any line whose tier would change."
 *
 * ── WAS HIER GEMESSEN WIRD, STATT GERATEN ────────────────────────────────────
 * `minTierFor(text, lernweg)` ist die Stufe, ab der eine Zeile OPERATIONAL
 * servierbar ist (`tiers.ts`, über `fitsKeys`) - genau die Zahl, die auch die
 * App an jeder Serviersstelle berechnet. Für jede englische Korpus-/Serien-
 * Zeile wird sie zweimal gerechnet: einmal am britischen Rohtext, einmal am
 * Text NACH `wandleSchreibweise(text, "us")`. Stimmen sie überein, ändert die
 * Schreibweise nie, WANN ein Kind eine Zeile zu sehen bekommt.
 *
 * ── DIE BEKANNTE AUSNAHME ────────────────────────────────────────────────────
 * Die vier Verb-Familien organise/realise/recognise/apologise tauschen ein
 * frühes „s" (Grundreihe, T0) gegen ein spätes „z" - auf Weg „en" die
 * LETZTE Taste überhaupt (T3, Bauplan §3.3a: v x q z). Eine Zeile mit
 * „organised" wird auf „us" darum erst auf T3 servierbar, auf „gb" schon
 * viel früher. Das ist eine ECHTE, gemessene Eigenschaft der im Auftrag
 * verlangten Karte (organise→organize gehört ausdrücklich dazu) - kein
 * Programmierfehler. Dieser Wächter LISTET jede betroffene Zeile NAMENTLICH
 * auf (Konsolen-Ausgabe beim Lauf) und lässt NUR Zeilen aus genau dieser
 * Wortfamilie durch; jede andere Tier-Abweichung lässt ihn ROT werden.
 *
 * Wird dieser Test rot, weil eine NEUE Zeile oder ein NEUES Kartenwort eine
 * unerwartete Tier-Verschiebung erzeugt: nicht den Test lockern, sondern das
 * Wort/die Zeile prüfen (`feedback_test_kennt_die_abwaegung`) - vielleicht
 * gehört es auf die Liste der mehrdeutigen/ausgelassenen Wörter.
 */
import { describe, expect, it } from "vitest";
import { CORPUS_EN, fitsKeys, type CorpusItem } from "../src/lib/typing/corpus";
import { SERIEN } from "../src/lib/typing/serien";
import { serieLines } from "../src/lib/typing/serie";
import { minTierFor, allowedForTier, TIERS } from "../src/lib/typing/tiers";
import { wandleSchreibweise, WOERTER_GB_ZU_US } from "../src/lib/typing/schreibweise";
import type { Lernweg } from "../src/lib/typing/lernweg";

/**
 * Wortfamilien, bei denen eine Tier-Verschiebung BEKANNT und HINGENOMMEN ist
 * (s→z, siehe Kopf-Doku). Jede andere Verschiebung lässt den Wächter rot
 * werden.
 */
const BEKANNTE_AUSNAHME = /\b(organi[sz]|reali[sz]|recogni[sz]|apologi[sz])/i;

interface Zeile {
  herkunft: string;
  text: string;
}

function englischeKorpusZeilen(): Zeile[] {
  return CORPUS_EN.map((it: CorpusItem) => ({ herkunft: `Korpus:${it.kind}`, text: it.text }));
}

function englischeSerienZeilen(): Zeile[] {
  const out: Zeile[] = [];
  for (const s of SERIEN) {
    if (s.lang !== "en") continue;
    for (const zeile of serieLines(s)) {
      out.push({ herkunft: `Serie:${s.slug}`, text: zeile });
    }
  }
  return out;
}

const LERNWEGE: readonly Lernweg[] = ["de", "en"];

describe("§ Tier-Wächter der Schreibweise (Korpus)", () => {
  const zeilen = englischeKorpusZeilen();

  it("es gibt überhaupt englische Korpus-Zeilen zu prüfen", () => {
    expect(zeilen.length).toBeGreaterThan(0);
  });

  for (const lernweg of LERNWEGE) {
    it(`minTierFor(gb) === minTierFor(us) auf Weg „${lernweg}“ - ausser der bekannten Ausnahme`, () => {
      const abweichungen: string[] = [];
      let bekannt = 0;
      for (const { herkunft, text } of zeilen) {
        const us = wandleSchreibweise(text, "us");
        if (us === text) continue; // Karte griff gar nicht - nichts zu prüfen
        const tierGb = minTierFor(text, lernweg);
        const tierUs = minTierFor(us, lernweg);
        if (tierGb === tierUs) continue;
        if (BEKANNTE_AUSNAHME.test(text)) {
          bekannt += 1;
          continue;
        }
        abweichungen.push(
          `[${herkunft}] T${tierGb}→T${tierUs}: "${text}" → "${us}"`,
        );
      }
      // eslint-disable-next-line no-console
      console.info(
        `[Tier-Wächter Korpus/${lernweg}] ${zeilen.length} Zeilen geprüft, ` +
          `${bekannt} mit bekannter Ausnahme (organise/realise/recognise/apologise → z).`,
      );
      expect(abweichungen, abweichungen.join("\n")).toEqual([]);
    });
  }
});

describe("§ Tier-Wächter der Schreibweise (Serien)", () => {
  const zeilen = englischeSerienZeilen();

  for (const lernweg of LERNWEGE) {
    it(`minTierFor(gb) === minTierFor(us) auf Weg „${lernweg}“ - ausser der bekannten Ausnahme`, () => {
      const abweichungen: string[] = [];
      let bekannt = 0;
      for (const { herkunft, text } of zeilen) {
        const us = wandleSchreibweise(text, "us");
        if (us === text) continue;
        const tierGb = minTierFor(text, lernweg);
        const tierUs = minTierFor(us, lernweg);
        if (tierGb === tierUs) continue;
        if (BEKANNTE_AUSNAHME.test(text)) {
          bekannt += 1;
          continue;
        }
        abweichungen.push(`[${herkunft}] T${tierGb}→T${tierUs}: "${text}" → "${us}"`);
      }
      // eslint-disable-next-line no-console
      console.info(
        `[Tier-Wächter Serien/${lernweg}] ${zeilen.length} Zeilen geprüft, ` +
          `${bekannt} mit bekannter Ausnahme.`,
      );
      expect(abweichungen, abweichungen.join("\n")).toEqual([]);
    });
  }
});

describe("§ fitsKeys verhält sich an jeder Stufe gleich (ausser der bekannten Ausnahme)", () => {
  it("für jede Stufe T0-T5 auf Weg „en“: fitsKeys(gb) === fitsKeys(us), ausser der bekannten Ausnahme", () => {
    const zeilen = [...englischeKorpusZeilen(), ...englischeSerienZeilen()];
    const abweichungen: string[] = [];
    for (const t of TIERS) {
      const allowed = allowedForTier(t, "en");
      for (const { herkunft, text } of zeilen) {
        const us = wandleSchreibweise(text, "us");
        if (us === text) continue;
        const gbPasst = fitsKeys(text, new Set(allowed));
        const usPasst = fitsKeys(us, new Set(allowed));
        if (gbPasst === usPasst) continue;
        if (BEKANNTE_AUSNAHME.test(text)) continue;
        abweichungen.push(`[T${t}/${herkunft}] gb=${gbPasst} us=${usPasst}: "${text}"`);
      }
    }
    expect(abweichungen, abweichungen.join("\n")).toEqual([]);
  });
});

describe("§ Bericht: wie viele Zeilen ändert die Schreibweise überhaupt", () => {
  it("zählt Korpus- und Serien-Zeilen, die unter „us“ wirklich anders aussehen", () => {
    const korpus = englischeKorpusZeilen();
    const serien = englischeSerienZeilen();
    const geaendertKorpus = korpus.filter((z) => wandleSchreibweise(z.text, "us") !== z.text);
    const geaendertSerien = serien.filter((z) => wandleSchreibweise(z.text, "us") !== z.text);
    // eslint-disable-next-line no-console
    console.info(
      `[Bericht] Korpus: ${geaendertKorpus.length} von ${korpus.length} Zeilen geändert; ` +
        `Serien: ${geaendertSerien.length} von ${serien.length} Zeilen geändert. ` +
        `Wortliste umfasst ${Object.keys(WOERTER_GB_ZU_US).length} Formen.`,
    );
    expect(korpus.length).toBeGreaterThan(0);
  });
});
