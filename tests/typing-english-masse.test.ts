/**
 * Englische Textwelt-Nachlagen (§9, englische Seite) — das harte Gate für die
 * neuen Chargen. Es erzwingt:
 *  • Tier-Grenzen je Charge (ein verbotener Buchstabe hebt den Tier → Bruch),
 *  • nur tippbare Zeichen und englische Großschreibung am Zeilenanfang,
 *  • KEINE Apostrophe (fitText behandelt ' als hartes Zeichen — solche Zeilen
 *    wären erst ab T5 servierbar und fehlten in den frühen Chargen),
 *  • keine Dubletten (weder in der Charge noch gegen den Gesamtbestand),
 *  • Manifest-Präsenz (No-Repeat-Ledger),
 *  • die eigentliche Wirkung: genug servierbare Zeilen früh, damit sich nichts
 *    wiederholt,
 *  • die englischen Deaktivierungen (Witz-Rätsel unter falscher Sorte).
 * Bauplan: Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md §9/§10
 */
import { describe, it, expect } from "vitest";
import {
  CORPUS_EN,
  DEACTIVATED_EN,
  allowedForTier,
  bausteinId,
  corpusItemsFor,
  corpusManifest,
  isDeactivated,
  minTierFor,
  type CorpusItem,
  type Stufe,
} from "../src/lib/typing";
import { EN_ERSTLESER_CORPUS } from "../src/lib/typing/corpusEnErstleser";
import { EN_KULTUR_CORPUS } from "../src/lib/typing/corpusEnKultur";
import { EN_T2B_CORPUS } from "../src/lib/typing/corpusEnT2b";
import { EN_T2C_CORPUS } from "../src/lib/typing/corpusEnT2c";
import { EN_T2D_CORPUS } from "../src/lib/typing/corpusEnT2d";
import { EN_T2E_CORPUS } from "../src/lib/typing/corpusEnT2e";
import { EN_T2_CORPUS } from "../src/lib/typing/corpusEnT2";
import { EN_T3B_CORPUS } from "../src/lib/typing/corpusEnT3b";
import { EN_T3_CORPUS } from "../src/lib/typing/corpusEnT3";
import { EN_WITZ_CORPUS } from "../src/lib/typing/corpusEnWitz";

const TYPEABLE = /^[a-zA-Z0-9 ,.\-?!:;]*$/;
const ALL_KEYS = allowedForTier(5, "de");

const CHARGEN: [string, CorpusItem[], number, number][] = [
  // Name, Charge, maximaler Tier, Mindestzahl Zeilen
  ["Erstleser T1", EN_ERSTLESER_CORPUS, 1, 55],
  ["T2 I", EN_T2_CORPUS, 2, 55],
  ["T2 II", EN_T2B_CORPUS, 2, 55],
  ["T2 III", EN_T2C_CORPUS, 2, 55],
  ["T2 IV", EN_T2D_CORPUS, 2, 55],
  ["T2 V", EN_T2E_CORPUS, 2, 55],
  ["T3 I", EN_T3_CORPUS, 3, 55],
  ["T3 II", EN_T3B_CORPUS, 3, 55],
  ["Kulturgut", EN_KULTUR_CORPUS, 3, 70],
  ["Witz-Vielfalt", EN_WITZ_CORPUS, 5, 60],
];

describe("Englische Nachlagen — Tier-Grenzen und Form", () => {
  for (const [name, charge, maxTier, minCount] of CHARGEN) {
    it(`${name}: jede Zeile ist auf Tier ${maxTier} tippbar`, () => {
      for (const it of charge) {
        const t = minTierFor(it.text, "de");
        expect(t, `"${it.text}" → Tier ${t}`).not.toBeNull();
        expect(t! <= maxTier, `"${it.text}" braucht Tier ${t} (>${maxTier})`).toBe(true);
        expect(it.text, it.text).toMatch(TYPEABLE);
        // Englische Großschreibung: erstes Zeichen groß (oder Ziffer).
        expect(it.text[0]).toBe(it.text[0].toUpperCase());
        // Apostrophe/Anführungszeichen sind „hart" → Zeile wäre erst ab T5 servierbar.
        expect(/['’"]/.test(it.text), `Apostroph in "${it.text}"`).toBe(false);
        expect(it.stufen.length).toBeGreaterThan(0);
      }
    });

    it(`${name}: bringt echte Masse (mind. ${minCount} Zeilen)`, () => {
      expect(charge.length).toBeGreaterThanOrEqual(minCount);
    });
  }
});

describe("Englische Nachlagen — Dubletten und Manifest", () => {
  const alle = CHARGEN.flatMap(([, c]) => c);

  it("keine Dublette innerhalb der neuen Chargen", () => {
    const ids = alle.map((i) => bausteinId(i.kind, i.text));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keine Dublette gegen den bestehenden Bestand", () => {
    const neu = new Set(alle.map((i) => bausteinId(i.kind, i.text)));
    const zaehler = new Map<string, number>();
    for (const it of CORPUS_EN) {
      const id = bausteinId(it.kind, it.text);
      zaehler.set(id, (zaehler.get(id) ?? 0) + 1);
    }
    const doppelt = [...neu].filter((id) => (zaehler.get(id) ?? 0) > 1);
    expect(doppelt).toEqual([]);
  });

  it("alle neuen Bausteine stehen im Manifest (Ledger-fähig)", () => {
    const m = corpusManifest();
    const fehlt = alle.filter((it) => !m.indexOf.has(bausteinId(it.kind, it.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });
});

describe("Englische Nachlagen — Wirkung: früh genug Auswahl", () => {
  /** Servierbare (fertig angepasste, entdoppelte) Zeilen für Stufe + Tier. */
  const servierbar = (stufe: Stufe, tier: number) =>
    corpusItemsFor({ lernweg: "de", stufe, allowed: allowedForTier(tier as 0 | 1 | 2 | 3 | 4 | 5, "de"), lang: "en" }).length;

  it("Tier 1 ist auf Englisch nicht mehr leer (war 0 für Stufe a)", () => {
    expect(servierbar("kids", 1)).toBeGreaterThanOrEqual(50);
    expect(servierbar("teens", 1)).toBeGreaterThanOrEqual(50);
  });

  it("Tier 2 trägt eine ganze Übungsphase (war 89 für Stufe a)", () => {
    expect(servierbar("kids", 2)).toBeGreaterThanOrEqual(350);
    expect(servierbar("teens", 2)).toBeGreaterThanOrEqual(350);
    expect(servierbar("erwachsen", 2)).toBeGreaterThanOrEqual(250);
  });

  it("Tier 3 hat in jeder Stufe reichlich Auswahl", () => {
    for (const s of ["kids", "teens", "erwachsen"] as Stufe[]) {
      expect(servierbar(s, 3), `Stufe ${s}`).toBeGreaterThanOrEqual(650);
    }
  });
});

describe("Englische Nachlagen — Witz-Vielfalt statt Schablone", () => {
  const witze = corpusItemsFor({ lernweg: "de", stufe: "teens", allowed: ALL_KEYS, kinds: ["witz"], lang: "en" });

  it("die Frage-Antwort-Schablone stellt weniger als die Hälfte der Witze", () => {
    const schablone = witze.filter((l) => /^(what do you call|why did the)/i.test(l)).length;
    expect(schablone / witze.length).toBeLessThan(0.5);
  });

  it("Knock-knock-Witze gibt es jetzt überhaupt", () => {
    expect(witze.some((l) => /^knock knock/i.test(l))).toBe(true);
  });
});

describe("Englische Deaktivierungen — Witz-Rätsel in der falschen Sorte", () => {
  it("alle Einträge sind wirksam deaktiviert", () => {
    expect(DEACTIVATED_EN.length).toBeGreaterThanOrEqual(15);
    for (const d of DEACTIVATED_EN) {
      expect(isDeactivated(d.kind, d.text), d.text).toBe(true);
      expect(d.reason.length).toBeGreaterThan(10);
      // Ursprüngliche Regel (25.07.): stillgelegt wurde nur die FEHL-SORTE, der
      // Witz selbst blieb aktiv. Seit TN-E9 (27.07.) werden zusätzlich WITZE
      // selbst stillgelegt, wenn die Pointe nicht funktioniert oder kulturell
      // unzugänglich ist — solche Einträge weisen sich in der Begründung aus.
      // Seit TN-E9 werden auch Witze selbst stillgelegt (pointenlos, kulturell
      // unzugänglich, Apostroph-Problem) — solche Einträge weisen sich über ihre
      // Etappen-Marke in der Begründung aus.
      // 14.08.: Die Rechtschreib-Chargen R1 und R2 legen ebenfalls Witze still
      // (britische Schreibung, gebrochene Wortspiele, Sinnfehler) und tragen
      // ihre eigene Chargen-Marke. Die Regel bleibt dieselbe — die Begründung
      // MUSS die Charge nennen.
      if (d.kind === "witz")
        expect(d.reason, d.text).toMatch(/TN-E\d+|Rechtschreib-Charge R1|^R2 /);
    }
  });

  it("kein Witz-Rätsel läuft mehr als fakt, spruch oder satz mit", () => {
    const RAETSEL = /^(what|why|how|which|when|who|where)\b[^?]*\?\s*\S/i;
    for (const kind of ["fakt", "spruch", "sprichwort", "satz", "wissen"] as const) {
      const lines = (["kids", "teens", "erwachsen"] as Stufe[]).flatMap((stufe) =>
        corpusItemsFor({ lernweg: "de", stufe, allowed: ALL_KEYS, kinds: [kind], lang: "en" }),
      );
      const treffer = lines.filter((l) => RAETSEL.test(l) || /^knock knock/i.test(l));
      expect(treffer, `${kind}: ${treffer.slice(0, 3).join(" | ")}`).toEqual([]);
    }
  });

  it("deaktivierte Bausteine bleiben im Manifest (Ledger-Indizes stabil)", () => {
    const m = corpusManifest();
    for (const d of DEACTIVATED_EN) {
      expect(m.indexOf.has(bausteinId(d.kind, d.text)), d.text).toBe(true);
    }
  });

  it("die Witze selbst bleiben erhalten (nur die Fehl-Sorte fällt weg)", () => {
    const witze = (["kids", "teens", "erwachsen"] as Stufe[]).flatMap((stufe) =>
      corpusItemsFor({ lernweg: "de", stufe, allowed: ALL_KEYS, kinds: ["witz"], lang: "en" }),
    );
    // „spelling bee" ist seit TN-E9 bewusst ganz stillgelegt (Konzept gibt es im
    // deutschen Sprachraum nicht) und darum hier nicht mehr aufgeführt.
    for (const teil of ["dino", "carrot", "log in", "crummy", "A river"]) {
      expect(witze.some((l) => l.toLowerCase().includes(teil.toLowerCase())), teil).toBe(true);
    }
  });
});
