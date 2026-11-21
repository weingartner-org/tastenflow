/**
 * ★★★★★ WÄCHTER M3 (ES-P7a-Behebung, 27.09.2026, Prüfbericht Fundament es):
 * Harte Paare ¿?/¡! brachen im Generator.
 *
 * Ein spanischer Fragesatz braucht ZWEI Tasten: „¿Qué hora es?". Der
 * Generator schaltete ¿ und ? (bzw. ¡ und !) bisher EINZELN frei (9 Runden
 * auseinander) und hatte für „¿"/„¡" gar keine eigene Vorlage - beide fielen
 * in den `default`-Zweig (`${w()} ${unit} ${w()}`), der das Zeichen ALLEIN
 * einfügt. Gemessen (Prüfbericht M3, e9): 60,7 % der erzeugten Zeilen mit
 * Fokus ¿ ? ¡ ! hatten ein halbes oder verdrehtes Paar („Claro ¿ le").
 *
 * Behoben:
 *  1. `paareGemeinsam` (lernweg.ts, nur „es") - `advanceIntroduced` schaltet
 *     ¿ mit ? und ¡ mit ! GEMEINSAM frei, nie einzeln.
 *  2. `charDrillLine` (generator.ts) hat für „es" eigene Vorlagen, die BEIDE
 *     Zeichen jeder Vorlage enthalten - unabhängig davon, ob gerade ¿ oder ?
 *     die neu geübte Einheit ist.
 *
 * Geprüft wird die FEHLERKLASSE über den WEG, den ein Kind nimmt: die
 * Freischaltungs-Reihenfolge selbst UND viele echte `adaptiveRound`-Zeilen an
 * und nach dieser Stufe enthalten NIE ein halbes Paar. de/en/fr unverändert
 * (dort ist „?"/„!" ein gewöhnliches, einzeln weglassbares Satzzeichen).
 */
import { describe, expect, it } from "vitest";
import { introOrder, advanceIntroduced, defaultIntroduced } from "../src/lib/typing/letters";
import { adaptiveRound } from "../src/lib/typing/generator";
import { lernwegDef } from "../src/lib/typing/lernweg";

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mitZufall<T>(seed: number, fn: () => T): T {
  const echt = Math.random;
  Math.random = mulberry32(seed);
  try {
    return fn();
  } finally {
    Math.random = echt;
  }
}

/** Ein Paar ist entweder GAR NICHT oder GLEICH OFT (öffnend/schliessend) in der Zeile. */
function paarOk(zeile: string): boolean {
  const q1 = (zeile.match(/¿/g) ?? []).length;
  const q2 = (zeile.match(/\?/g) ?? []).length;
  const a1 = (zeile.match(/¡/g) ?? []).length;
  const a2 = (zeile.match(/!/g) ?? []).length;
  return q1 === q2 && a1 === a2;
}

describe('★★★★★ M3: ¿/? und ¡/! werden GEMEINSAM freigeschaltet (Weg „es")', () => {
  it("¿ bringt ? gleich mit, ¡ bringt ! gleich mit - nie einzeln", () => {
    let intro = defaultIntroduced("es");
    const letters = {};
    for (let i = 0; i < 80; i++) {
      const vor = intro;
      intro = advanceIntroduced(intro, letters, "es", undefined, 99); // 99 Runden ohne neue Taste: immer bereit
      if (intro === vor) break; // alles gelernt
      const neu = intro.filter((c) => !vor.includes(c));
      if (neu.includes("¿") || neu.includes("?")) {
        expect(neu.sort(), `Schritt ${i}`).toEqual(["?", "¿"].sort());
      }
      if (neu.includes("¡") || neu.includes("!")) {
        expect(neu.sort(), `Schritt ${i}`).toEqual(["!", "¡"].sort());
      }
    }
    expect(intro).toEqual(introOrder("es"));
  });
});

describe('★★★★★ M3: kein erzeugtes ¿/¡ ohne sein Gegenstück (Weg „es")', () => {
  for (const l of ["es", "latam"] as const) {
    it(`${l}: viele echte Runden ab „¿“/„?“ gelernt - 0 halbe Paare (vorher 60,7 %)`, () => {
      const o = introOrder("es");
      const abFrage = o.slice(0, o.indexOf("?") + 1); // ¿ UND ? längst gelernt
      let halbe = 0;
      let gesamt = 0;
      for (let s = 0; s < 60; s++) {
        const zeilen = mitZufall(5000 + s, () =>
          adaptiveRound({
            introduced: abFrage,
            focus: ["¿", "?"],
            stufe: "kids",
            lang: "es",
            lernweg: "es",
            count: 12,
          }),
        );
        for (const z of zeilen) {
          gesamt++;
          if (!paarOk(z.text)) halbe++;
        }
      }
      expect(gesamt).toBeGreaterThan(0);
      expect(halbe, `${halbe} von ${gesamt} Zeilen mit halbem Paar`).toBe(0);
    });
  }
});

describe('M3: de/en/fr unverändert - „?"/„!" bleiben gewöhnliche Satzzeichen', () => {
  // ★ D1 Nr. 19 (28.09.2026, Entscheidung Johannes „Klammern als festes
  // Paar"): ausserhalb „es" stehen seither die Klammern in `paareGemeinsam` -
  // aber nie „?"/„!" (dort gewöhnliche, einzeln weglassbare Satzzeichen).
  it('ausserhalb "es" nur die Klammern als Paar, nie ¿?/¡!', () => {
    for (const w of ["de", "en", "fr"] as const) {
      expect(lernwegDef(w).paareGemeinsam, w).toEqual({ "(": ")", "[": "]", "{": "}" });
    }
    expect(lernwegDef("es").paareGemeinsam).toEqual({ "¿": "?", "¡": "!", "(": ")", "[": "]", "{": "}" });
  });
});
