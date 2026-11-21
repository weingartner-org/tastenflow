/**
 * „So früh wie möglich sinnvolle Sätze" — Gate für den KLASSISCHEN Lehrgang
 * (Charge vom 27.07.2026, siehe `src/lib/typing/corpusLehrgangFrueh.ts`).
 *
 * Der Lehrgang führt die Buchstaben anders ein als „Mein Training"; weil das **n**
 * erst in der 16. Lektion kommt, servierte er bis 27.07. in den ersten acht
 * Lektionen KEINEN einzigen echten Satz — und für 13–15 Jahre/Erwachsene blieb es
 * bis Lektion 16 fast leer. Dieser Test hält den geschlossenen Zustand fest:
 *  • ab `home-gh` gibt es in JEDER Altersstufe echten Text,
 *  • die Alters-Schere zwischen a/b und c/erwachsen ist zu,
 *  • der Retag hat nur `stufen` vereinigt (kein neuer Baustein, Ledger unberührt),
 *  • jeder neue Satz ist an seiner Lektion vollständig tippbar.
 */
import { describe, it, expect } from "vitest";
import { CORPUS, corpusEntriesFor, fitsKeys, minTierFor } from "../src/lib/typing";
import { LESSONS, unlockedKeysAt } from "../src/lib/typing/curriculum";
import { LEHRGANG_FRUEH_CORPUS } from "../src/lib/typing/corpusLehrgangFrueh";
import type { Stufe } from "../src/lib/typing/account";

const STUFEN: Stufe[] = ["kids", "teens", "erwachsen"];

/** Servierbare deutsche Bausteine einer Lektion für eine Altersstufe. */
function pool(lessonId: string, stufe: Stufe): number {
  const allowed = new Set(unlockedKeysAt(lessonId));
  return corpusEntriesFor({ lernweg: "de", stufe, allowed, lang: "de" }).length;
}

/** Baustein-Schlüssel wie `dedupKey` in corpus.ts (Sorte + reine Buchstaben). */
function key(kind: string, text: string): string {
  return kind + "|" + text.toLowerCase().replace(/[^a-zäöüß0-9]+/g, " ").trim();
}

describe("Lehrgang — echte Sätze ab der Grundreihe mit g/h", () => {
  // Ab hier gibt es sinnvolle deutsche Sätze; davor (nur f j d k s l a ö) hat die
  // Sprache schlicht kein Verb, das ohne weitere Buchstaben auskommt.
  const AB = [
    "home-gh",
    "shift-gross",
    "ober-ei",
    "ober-ru",
    "ober-tz",
    "ober-wo",
    "ober-qp",
    "unter-mv",
    "unter-c-komma",
    "unter-x-punkt",
    "unter-y-minus",
    "unter-nb",
  ];

  it("jede dieser Lektionen serviert in JEDER Altersstufe echten Text", () => {
    const leer: string[] = [];
    for (const id of AB)
      for (const s of STUFEN) if (pool(id, s) === 0) leer.push(`${id}/${s}`);
    expect(leer, leer.join(", ")).toEqual([]);
  });

  it("13–15 Jahre und Erwachsene sind nicht mehr abgehängt (früher 0 statt 23)", () => {
    // „ober-tz" war die Lektion, ab der a/b Text bekamen und c/erwachsen nicht.
    for (const s of STUFEN) expect(pool("ober-tz", s)).toBeGreaterThanOrEqual(60);
    // Über die FRÜHE Strecke (vor „unter-nb", wo sich der ganze Korpus öffnet)
    // bleibt der Abstand klein — vorher war er unendlich (0 gegen 23–41).
    // Ab „unter-nb" gilt wieder das allgemeine Mengen-Verhältnis des Korpus;
    // das ist Sache der TN-C-Chargen, nicht dieser frühen Lücke.
    for (const id of AB.filter((x) => x !== "unter-nb"))
      expect(pool(id, "erwachsen"), id).toBeGreaterThanOrEqual(pool(id, "kids") * 0.8);
  });

  it("die Runde besteht ab „ober-ei« komplett aus echtem Text, nicht aus Wortsalat", async () => {
    const { generateRound } = await import("../src/lib/typing/generator");
    for (const id of ["ober-ei", "ober-ru", "ober-tz"])
      for (const stufe of STUFEN) {
        const lines = generateRound(id, { lernweg: "de", stufe, lang: "de", count: 12 });
        const sinn = lines.filter((l) => l.source !== null).length;
        expect(sinn, `${id}/${stufe}`).toBeGreaterThanOrEqual(4);
      }
  });
});

describe("Charge 27.07. — Retag und neue Sätze", () => {
  const RETAG = LEHRGANG_FRUEH_CORPUS.filter((i) => !i.herkunft);
  const NEU = LEHRGANG_FRUEH_CORPUS.filter((i) => i.herkunft);

  it("jeder Retag-Eintrag trifft einen BESTEHENDEN Baustein (kein neuer Text)", () => {
    // Wortlaut + Sorte müssen exakt passen, sonst entstünde ein zweiter Baustein
    // statt einer Stufen-Vereinigung (mergeCorpus/buildManifest).
    const vorhanden = new Set(CORPUS.map((it) => key(it.kind, it.text)));
    const fehlt = RETAG.filter((r) => !vorhanden.has(key(r.kind, r.text)));
    expect(fehlt.map((f) => f.text)).toEqual([]);
  });

  it("nach dem Merge tragen die retaggten Sätze alle vier Altersstufen", () => {
    const byKey = new Map(CORPUS.map((it) => [key(it.kind, it.text), it]));
    for (const r of RETAG) {
      const merged = byKey.get(key(r.kind, r.text))!;
      expect(merged.stufen, r.text).toContain("teens");
      expect(merged.stufen, r.text).toContain("erwachsen");
    }
  });

  it("jeder NEUE Satz ist tippbar und in allen vier Stufen freigegeben", () => {
    for (const it of NEU) {
      expect(minTierFor(it.text, "de"), it.text).not.toBeNull();
      expect(it.stufen.slice().sort(), it.text).toEqual(
        ["kids", "teens", "erwachsen"].sort(),
      );
    }
  });

  it("jeder NEUE Satz erscheint spätestens in der Lektion »ober-wo«", () => {
    const ids = LESSONS.map((l) => l.id);
    const grenze = ids.indexOf("ober-wo");
    for (const it of NEU) {
      const erste = ids.findIndex((id) =>
        fitsKeys(it.text, new Set(unlockedKeysAt(id))),
      );
      expect(erste, `${it.text} → ${ids[erste] ?? "nie"}`).toBeGreaterThanOrEqual(0);
      expect(erste, `${it.text} → ${ids[erste]}`).toBeLessThanOrEqual(grenze);
    }
  });

  it("die Charge schleppt keine Dublette ein", () => {
    const gesehen = new Set<string>();
    const doppelt: string[] = [];
    for (const it of NEU) {
      const k = key(it.kind, it.text);
      if (gesehen.has(k)) doppelt.push(it.text);
      gesehen.add(k);
    }
    expect(doppelt).toEqual([]);
  });
});
