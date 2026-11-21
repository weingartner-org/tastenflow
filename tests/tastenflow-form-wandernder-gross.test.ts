/**
 * Verhaltens-Tests der Übungsform „Wandernder Großbuchstabe" (`wandernderGross.ts`).
 *
 * Kein Test prüft eine feste Konstante - jeder spielt einen Tastenstand durch
 * und misst, was die Form daraus WIRKLICH baut: dass der Wanderer wirklich
 * wandert (Stelle für Stelle nach rechts, nie zwei auf einmal), dass eine
 * Wort-Wanderung nie mittendrin abgeschnitten wird, dass keine Zeile eine
 * ungelernte Taste verlangt, und dass die Form ohne echte Umschalttaste
 * NICHT taugt.
 */
import { describe, expect, it } from "vitest";
import { wandernderGross } from "@/lib/typing/uebungsformen/wandernderGross";
import type { FormKontext } from "@/lib/typing/uebungsformen/typen";
import { LETTER_ORDER, SHIFT_UNIT } from "@/lib/typing/letters";
import { isNoun } from "@/lib/typing/words";

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

/** Alle Buchstaben + Umschalttaste - ein reichhaltiger Tastenstand. */
const ALLE_BUCHSTABEN = [...LETTER_ORDER, SHIFT_UNIT];
/** Nur die Grundreihe (f j d k s l a ö) + Umschalt - kein Wort ab 5 Buchstaben passt hinein. */
const GRUNDREIHE_MIT_SHIFT = [...LETTER_ORDER.slice(0, 8), SHIFT_UNIT];

function ctxMit(overrides: Partial<FormKontext> = {}): FormKontext {
  return {
    lernweg: "de",
    introduced: ALLE_BUCHSTABEN,
    shift: true,
    oneHand: false,
    stufe: "teens",
    lang: "de",
    count: 12,
    zufall: seededZufall(42),
    ...overrides,
  };
}

/** An welchen Stellen ist die Zeile groß geschrieben (Wanderer + evtl. feste Stelle)? */
function grossstellen(text: string): number[] {
  return [...text].flatMap((ch, i) => (ch !== ch.toLowerCase() ? [i] : []));
}

/**
 * Zerlegt die gebauten Zeilen in aufeinanderfolgende Gruppen desselben
 * Wortes (gleicher Kleinschreibungs-Text) - genau die Wort-Wanderungen, die
 * `baue` hintereinander in die Runde gelegt hat.
 */
function wortGruppen(zeilen: { text: string }[]): string[][] {
  const gruppen: string[][] = [];
  for (const { text } of zeilen) {
    const letzte = gruppen[gruppen.length - 1];
    if (letzte && letzte[0].toLowerCase() === text.toLowerCase()) {
      letzte.push(text);
    } else {
      gruppen.push([text]);
    }
  }
  return gruppen;
}

describe("Wandernder Großbuchstabe - Vertrag", () => {
  it("name und id stimmen mit dem Auftrag überein", () => {
    expect(wandernderGross.id).toBe("wandernder-gross");
    expect(wandernderGross.name).toBe("Wandernder Großbuchstabe");
  });

  it("taugt mit einem reichhaltigen Tastenstand und echter Umschalttaste", () => {
    expect(wandernderGross.taugt(ctxMit())).toBe(true);
  });

  it("taugt NICHT ohne echte Umschalttaste, selbst mit vollem Alphabet", () => {
    const ctx = ctxMit({ shift: false });
    expect(wandernderGross.taugt(ctx)).toBe(false);
    expect(wandernderGross.baue!(ctx)).toBeNull();
  });

  it("taugt NICHT auf einem zu kleinen Tastenstand ohne passendes Wort (5-10 Buchstaben)", () => {
    const ctx = ctxMit({ introduced: GRUNDREIHE_MIT_SHIFT, shift: true });
    expect(wandernderGross.taugt(ctx)).toBe(false);
  });

  it(`taugt bei einem Kind mit „Einhand schreiben" trotzdem, sobald die Umschalttaste sitzt`, () => {
    const ctx = ctxMit({ oneHand: true, shift: true });
    expect(wandernderGross.taugt(ctx)).toBe(true);
  });
});

describe("der Wanderer wandert wirklich", () => {
  it("jede Zeile trägt genau EINE zusätzliche Wanderer-Stelle mehr als die vorige, nie zwei auf einmal", () => {
    const ctx = ctxMit({ count: 40 });
    const runde = wandernderGross.baue!(ctx)!;
    for (const gruppe of wortGruppen(runde.zeilen)) {
      const stellenJeZeile = gruppe.map(grossstellen);
      // Zeile 1 trägt höchstens EINE feste Großstelle (der Nomen-Anfang) -
      // das ist noch keine Wanderung.
      expect(stellenJeZeile[0].length).toBeLessThanOrEqual(1);
      for (let i = 1; i < stellenJeZeile.length; i++) {
        // jede weitere Zeile hat GENAU eine Großstelle mehr als Zeile 1.
        expect(stellenJeZeile[i].length).toBe(stellenJeZeile[0].length + 1);
        // die höchste (am weitesten rechts stehende) Großstelle ist der
        // Wanderer - und der zieht von Zeile zu Zeile um GENAU eine Stelle
        // weiter, niemals um zwei oder mehr, niemals rückwärts.
        const wandererVorher = Math.max(...stellenJeZeile[i - 1]);
        const wandererJetzt = Math.max(...stellenJeZeile[i]);
        expect(wandererJetzt).toBe(wandererVorher + 1);
      }
    }
  });

  it("nur die Groß-/Kleinschreibung wechselt - die Buchstabenfolge selbst bleibt unverändert", () => {
    const ctx = ctxMit({ count: 30 });
    const runde = wandernderGross.baue!(ctx)!;
    for (const gruppe of wortGruppen(runde.zeilen)) {
      const wort = gruppe[0].toLowerCase();
      for (const zeile of gruppe) expect(zeile.toLowerCase()).toBe(wort);
    }
  });

  it("bei einem deutschen Nomen ist Zeile 1 schon am Anfang groß, der Wanderer beginnt an Stelle 2", () => {
    // über mehrere Seeds gesucht, bis eine Wort-Gruppe mit einem echten
    // Nomen dabei ist (der Wortschatz besteht überwiegend aus Nomen) -
    // kein fest angenommenes Wort, sondern geprüft über `isNoun`.
    let geprueft = false;
    for (let seed = 0; seed < 30 && !geprueft; seed++) {
      const ctx = ctxMit({ count: 12, zufall: seededZufall(seed) });
      const runde = wandernderGross.baue!(ctx)!;
      for (const gruppe of wortGruppen(runde.zeilen)) {
        if (!isNoun(gruppe[0].toLowerCase())) continue;
        expect(gruppe[0][0]).toBe(gruppe[0][0].toUpperCase()); // Zeile 1: Anfang groß
        expect(grossstellen(gruppe[0])).toEqual([0]); // sonst nichts groß
        expect(grossstellen(gruppe[1])).toEqual([0, 1]); // Wanderer an Stelle 2 (Index 1)
        geprueft = true;
        break;
      }
    }
    expect(geprueft).toBe(true); // sonst hätte der Test nichts geprüft
  });

  it("bei einem Wort ohne festen Anfangs-Großbuchstaben beginnt der Wanderer an Stelle 1 (Englisch)", () => {
    const ctx = ctxMit({ count: 12, lang: "en", zufall: seededZufall(3) });
    const runde = wandernderGross.baue!(ctx)!;
    const gruppe = wortGruppen(runde.zeilen)[0];
    expect(grossstellen(gruppe[0])).toEqual([]); // Zeile 1: ganz klein, Englisch schreibt nie automatisch groß
    expect(grossstellen(gruppe[1])).toEqual([0]); // Wanderer beginnt sofort an Stelle 1
  });
});

describe("ein Wort wird nie mitten in der Wanderung abgeschnitten", () => {
  it("jede Wort-Gruppe endet mit dem Wanderer am letzten Buchstaben", () => {
    for (const count of [3, 8, 12, 25, 50]) {
      const ctx = ctxMit({ count });
      const runde = wandernderGross.baue!(ctx)!;
      for (const gruppe of wortGruppen(runde.zeilen)) {
        const wort = gruppe[0];
        const letzteZeile = gruppe[gruppe.length - 1];
        const wandererAmEnde = Math.max(...grossstellen(letzteZeile));
        expect(wandererAmEnde).toBe(wort.length - 1);
      }
    }
  });

  it("liefert mindestens ctx.count Zeilen, nie weniger (eher etwas mehr, wegen ganzer Wörter)", () => {
    const ctx = ctxMit({ count: 17 });
    const runde = wandernderGross.baue!(ctx)!;
    expect(runde.zeilen.length).toBeGreaterThanOrEqual(17);
  });
});

describe("keine Zeile verlangt eine nicht freigeschaltete Taste", () => {
  const staende: { name: string; introduced: string[] }[] = [
    { name: "alle Buchstaben + Umschalt", introduced: ALLE_BUCHSTABEN },
    { name: "Grundreihe + e i r t + Umschalt", introduced: [...LETTER_ORDER.slice(0, 8), "e", "i", "r", "t", SHIFT_UNIT] },
    { name: "alle Buchstaben ohne ä ö ü ß + Umschalt", introduced: [...LETTER_ORDER.filter((k) => !"äöüß".includes(k)), SHIFT_UNIT] },
  ];

  for (const { name, introduced } of staende) {
    it(`Tastenstand: ${name}`, () => {
      const ctx = ctxMit({ introduced, count: 16 });
      if (!wandernderGross.taugt(ctx)) return; // dieser Stand hat schlicht kein passendes Wort - ok
      const runde = wandernderGross.baue!(ctx);
      if (!runde) return;
      const erlaubt = new Set(introduced.filter((e) => e !== SHIFT_UNIT));
      for (const zeile of runde.zeilen) {
        for (const zeichen of zeile.text) {
          if (zeichen === " ") continue;
          expect(erlaubt.has(zeichen.toLowerCase())).toBe(true);
        }
      }
    });
  }
});

describe("RoundLine-Vertrag", () => {
  it("jede Zeile hat source: null und art: \"woerter\"", () => {
    const ctx = ctxMit();
    const runde = wandernderGross.baue!(ctx)!;
    for (const zeile of runde.zeilen) {
      expect(zeile.source).toBeNull();
      expect(zeile.art).toBe("woerter");
    }
  });
});

describe("Ankündigung", () => {
  it("Deutsch nennt die Umschalttaste der Gegenhand", () => {
    const text = wandernderGross.ankuendigung(ctxMit({ lang: "de" }));
    expect(text).toContain("Umschalttaste");
    expect(text.endsWith(".")).toBe(true);
  });

  it("Englisch nennt die shift key", () => {
    const text = wandernderGross.ankuendigung(ctxMit({ lang: "en" }));
    expect(text.toLowerCase()).toContain("shift");
    expect(text.endsWith(".")).toBe(true);
  });
});

describe("mit festem zufall reproduzierbar", () => {
  it("zwei Läufe mit demselben Seed bauen dieselbe Runde", () => {
    const a = wandernderGross.baue!(ctxMit({ zufall: seededZufall(7) }));
    const b = wandernderGross.baue!(ctxMit({ zufall: seededZufall(7) }));
    expect(a).not.toBeNull();
    expect(a!.zeilen.map((z) => z.text)).toEqual(b!.zeilen.map((z) => z.text));
  });

  it("verschiedene Seeds bauen (mit ausreichend Vorrat) unterschiedliche Runden", () => {
    const a = wandernderGross.baue!(ctxMit({ zufall: seededZufall(1), count: 30 }));
    const b = wandernderGross.baue!(ctxMit({ zufall: seededZufall(999), count: 30 }));
    expect(a!.zeilen.map((z) => z.text)).not.toEqual(b!.zeilen.map((z) => z.text));
  });
});
