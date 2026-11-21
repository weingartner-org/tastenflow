/**
 * Verhaltens-Tests der Übungsform „Pyramidenwörter" (`pyramide.ts`).
 *
 * Kein Test prüft eine feste Konstante - jeder spielt einen Tastenstand durch
 * und misst, was die Form daraus WIRKLICH baut: die Übereinstimmung von
 * `schmuck.pyramiden` und `zeilen`, das echte Präfix-Wachstum je Stufe, dass
 * keine Zeile eine ungelernte Taste verlangt, und dass die Ankündigung genau
 * die Zahl nennt, die am Ende auch gebaut wird.
 */
import { describe, expect, it } from "vitest";
import { pyramide } from "@/lib/typing/uebungsformen/pyramide";
import type { FormKontext } from "@/lib/typing/uebungsformen/typen";
import { LETTER_ORDER, PUNCT_ORDER, SHIFT_UNIT } from "@/lib/typing/letters";

/** Deterministischer Zufallsgenerator (mulberry32) - reproduzierbar per Seed. */
function seededZufall(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** Alle Buchstaben + Umschalttaste + Punkt - ein reichhaltiger Tastenstand. */
const ALLE_BUCHSTABEN_UND_PUNKT = [...LETTER_ORDER, SHIFT_UNIT, ".", ",", "?", "!"];
/** Nur die Grundreihe (f j d k s l a ö) - der kleinste, noch taugliche Stand. */
const GRUNDREIHE = LETTER_ORDER.slice(0, 8);
/** Zwei Tasten - kein deutsches Wort ab vier Buchstaben kommt damit aus. */
const WINZIG = LETTER_ORDER.slice(0, 2);

function ctxMit(overrides: Partial<FormKontext> = {}): FormKontext {
  return {
    lernweg: "de",
    introduced: ALLE_BUCHSTABEN_UND_PUNKT,
    shift: true,
    oneHand: false,
    stufe: "teens",
    lang: "de",
    count: 12,
    zufall: seededZufall(42),
    ...overrides,
  };
}

/** Die deutschen und englischen Zahlwörter, die die Ankündigung benutzen kann. */
const ZAHLWORT_ZU_ZAHL: Record<string, number> = {
  ein: 1, eins: 1, one: 1,
  zwei: 2, two: 2,
  drei: 3, three: 3,
  vier: 4, four: 4,
  fünf: 5, five: 5,
  sechs: 6, six: 6,
  sieben: 7, seven: 7,
  acht: 8, eight: 8,
  neun: 9, nine: 9,
  zehn: 10, ten: 10,
};

/** Liest die Anzahl aus einem Ankündigungssatz („Jetzt kommen drei …" → 3). */
function zahlAusAnkuendigung(satz: string): number {
  const woerter = satz.replace(/[.,!?]/g, "").split(/\s+/);
  for (const w of woerter) {
    const lower = w.toLowerCase();
    if (lower in ZAHLWORT_ZU_ZAHL) return ZAHLWORT_ZU_ZAHL[lower];
    if (/^\d+$/.test(w)) return Number(w);
  }
  throw new Error(`Keine Zahl in „${satz}" gefunden`);
}

describe("Pyramidenwörter - Vertrag", () => {
  it("name und id stimmen mit dem Auftrag überein", () => {
    expect(pyramide.id).toBe("pyramide");
    expect(pyramide.name).toBe("Pyramidenwörter");
  });

  it("taugt mit einem reichhaltigen Tastenstand", () => {
    expect(pyramide.taugt(ctxMit())).toBe(true);
  });

  it(`taugt auch auf der reinen Grundreihe (echtes Wort: „Fall")`, () => {
    const ctx = ctxMit({ introduced: GRUNDREIHE, shift: true });
    expect(pyramide.taugt(ctx)).toBe(true);
    const runde = pyramide.baue!(ctx);
    expect(runde).not.toBeNull();
  });

  it("taugt NICHT auf einem winzigen Stand ohne passendes Wort", () => {
    const ctx = ctxMit({ introduced: WINZIG, shift: false, count: 12 });
    expect(pyramide.taugt(ctx)).toBe(false);
  });
});

describe("pyramiden.flat() ergibt exakt zeilen.map(z => z.text)", () => {
  it("bei einem reichhaltigen Tastenstand", () => {
    const ctx = ctxMit();
    const runde = pyramide.baue!(ctx);
    expect(runde).not.toBeNull();
    expect(runde!.schmuck?.art).toBe("pyramide");
    const pyramiden = runde!.schmuck!.pyramiden as string[][];
    expect(pyramiden.flat()).toEqual(runde!.zeilen.map((z) => z.text));
  });

  it("bei mehreren verschiedenen Tastenständen", () => {
    for (const stand of [GRUNDREIHE, ALLE_BUCHSTABEN_UND_PUNKT, [...LETTER_ORDER, SHIFT_UNIT]]) {
      const ctx = ctxMit({ introduced: stand, count: 14 });
      if (!pyramide.taugt(ctx)) continue;
      const runde = pyramide.baue!(ctx);
      if (!runde) continue;
      const pyramiden = runde.schmuck!.pyramiden as string[][];
      expect(pyramiden.flat()).toEqual(runde.zeilen.map((z) => z.text));
    }
  });
});

describe("jede Stufe wächst korrekt aus der vorigen", () => {
  it("Wortpyramiden: jede Stufe ist ein echtes Präfix der nächsten, eine Stufe je Buchstabe", () => {
    const ctx = ctxMit({ count: 20 });
    const runde = pyramide.baue!(ctx)!;
    let cursor = 0;
    for (const stufen of runde.schmuck!.pyramiden as string[][]) {
      const arten = runde.zeilen.slice(cursor, cursor + stufen.length).map((z) => z.art);
      cursor += stufen.length;
      if (arten[0] !== "woerter") continue; // Satzpyramide - andere Regel unten
      for (let i = 1; i < stufen.length; i++) {
        expect(stufen[i].startsWith(stufen[i - 1])).toBe(true);
        expect(stufen[i].length).toBe(stufen[i - 1].length + 1);
      }
      // letzte Stufe ist das ganze (echte) Wort - mindestens 4, höchstens 8 Stufen.
      expect(stufen.length).toBeGreaterThanOrEqual(4);
      expect(stufen.length).toBeLessThanOrEqual(8);
    }
  });

  it("Satzpyramiden: jede Stufe wächst um genau ein ganzes Wort", () => {
    const ctx = ctxMit({ count: 30 });
    const runde = pyramide.baue!(ctx)!;
    let cursor = 0;
    let sahSatzpyramide = false;
    for (const stufen of runde.schmuck!.pyramiden as string[][]) {
      const arten = runde.zeilen.slice(cursor, cursor + stufen.length).map((z) => z.art);
      cursor += stufen.length;
      if (arten[0] !== "text") continue;
      sahSatzpyramide = true;
      for (let i = 1; i < stufen.length; i++) {
        expect(stufen[i].startsWith(stufen[i - 1])).toBe(true);
        const woerterVorher = stufen[i - 1].split(/\s+/).length;
        const woerterJetzt = stufen[i].split(/\s+/).length;
        expect(woerterJetzt).toBe(woerterVorher + 1);
      }
    }
    // Bei 30 Zeilen und reichhaltigem Tastenstand sollte mindestens eine
    // Satzpyramide dabei sein (jede dritte, siehe Kopf-Kommentar der Form).
    expect(sahSatzpyramide).toBe(true);
  });
});

describe("keine Zeile verlangt eine nicht freigeschaltete Taste", () => {
  const staende: { name: string; introduced: string[] }[] = [
    { name: "reichhaltig (Buchstaben + Punkt + Umschalt)", introduced: ALLE_BUCHSTABEN_UND_PUNKT },
    { name: "nur Grundreihe", introduced: GRUNDREIHE },
    { name: "Grundreihe + e i", introduced: [...GRUNDREIHE, "e", "i"] },
    { name: "alle Buchstaben ohne Umschalt", introduced: [...LETTER_ORDER] },
    { name: "alle Buchstaben + Umschalt + volle Satzzeichen", introduced: [...LETTER_ORDER, SHIFT_UNIT, ...PUNCT_ORDER] },
  ];

  for (const { name, introduced } of staende) {
    it(`Tastenstand: ${name}`, () => {
      const ctx = ctxMit({ introduced, count: 16 });
      if (!pyramide.taugt(ctx)) return; // dieser Stand hat schlicht keine Pyramide - ok
      const runde = pyramide.baue!(ctx);
      if (!runde) return;
      const erlaubt = new Set(introduced);
      for (const zeile of runde.zeilen) {
        for (const zeichen of zeile.text) {
          if (zeichen === " ") continue;
          const klein = zeichen.toLowerCase();
          expect(erlaubt.has(klein) || erlaubt.has(zeichen)).toBe(true);
        }
      }
    });
  }
});

describe("Ankündigung und gebaute Pyramidenzahl stimmen überein", () => {
  it("Deutsch", () => {
    const ctx = ctxMit({ count: 12 });
    const ankuendigung = pyramide.ankuendigung(ctx);
    const runde = pyramide.baue!(ctx)!;
    expect(zahlAusAnkuendigung(ankuendigung)).toBe(runde.schmuck!.pyramiden.length);
    expect(ankuendigung.endsWith(".")).toBe(true);
  });

  it("Englisch", () => {
    const ctx = ctxMit({ count: 12, lang: "en" });
    const ankuendigung = pyramide.ankuendigung(ctx);
    const runde = pyramide.baue!(ctx)!;
    expect(zahlAusAnkuendigung(ankuendigung)).toBe(runde.schmuck!.pyramiden.length);
  });

  it("bei mehreren Rundenlängen", () => {
    for (const count of [6, 12, 18, 24]) {
      const ctx = ctxMit({ count });
      const ankuendigung = pyramide.ankuendigung(ctx);
      const runde = pyramide.baue!(ctx)!;
      expect(zahlAusAnkuendigung(ankuendigung)).toBe(runde.schmuck!.pyramiden.length);
    }
  });
});

describe("mit festem zufall reproduzierbar", () => {
  it("zwei Läufe mit demselben Seed bauen dieselbe Runde", () => {
    const a = pyramide.baue!(ctxMit({ zufall: seededZufall(7) }));
    const b = pyramide.baue!(ctxMit({ zufall: seededZufall(7) }));
    expect(a).not.toBeNull();
    expect(a!.zeilen.map((z) => z.text)).toEqual(b!.zeilen.map((z) => z.text));
    expect(a!.schmuck!.pyramiden).toEqual(b!.schmuck!.pyramiden);
  });

  it("verschiedene Seeds bauen (mit ausreichend Vorrat) unterschiedliche Runden", () => {
    const a = pyramide.baue!(ctxMit({ zufall: seededZufall(1), count: 20 }));
    const b = pyramide.baue!(ctxMit({ zufall: seededZufall(999), count: 20 }));
    expect(a!.zeilen.map((z) => z.text)).not.toEqual(b!.zeilen.map((z) => z.text));
  });
});

describe("Rundengröße", () => {
  it("liefert ungefähr ctx.count Zeilen und schneidet die letzte Pyramide nie ab", () => {
    const ctx = ctxMit({ count: 12 });
    const runde = pyramide.baue!(ctx)!;
    expect(runde.zeilen.length).toBeGreaterThanOrEqual(12);
    // jede einzelne Pyramide ist vollständig (min. 3 Stufen: kürzeste Satzpyramide)
    for (const stufen of runde.schmuck!.pyramiden as string[][]) {
      expect(stufen.length).toBeGreaterThanOrEqual(3);
    }
  });
});
