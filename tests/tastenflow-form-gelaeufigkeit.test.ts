/**
 * WÄCHTER-TEST „Geläufigkeitsschreiben" (Generator-Baustein, 02.09.2026).
 *
 * Prüft VERHALTEN, nicht Konstanten. Der wichtigste Block prüft die
 * Wortlisten selbst nach: Jedes Wort muss die versprochene Verbindung
 * WIRKLICH enthalten, und an der angegebenen Stelle - dafür wird die Prüfung
 * hier UNABHÄNGIG von der Produktionslogik neu geschrieben (die Produktion
 * verlässt sich auf kuratierte Listen und prüft `stelle` zur Laufzeit gar
 * nicht nach) - genau ein solcher Test hat in diesem Projekt schon echte
 * Fehler gefunden.
 */
import { describe, expect, it } from "vitest";
import {
  VERBINDUNGEN_DE,
  VERBINDUNGEN_EN,
  gelaeufigkeitMoeglich,
  gelaeufigkeitsZeile,
  type Verbindung,
} from "@/lib/typing/uebungsformen/gelaeufigkeit";
import { LETTER_ORDER } from "@/lib/typing/letters";
import type { Lang, Stufe } from "@/lib/typing/account";

/** Kleiner deterministischer Zufallsgenerator - derselbe Startwert liefert immer dieselbe Folge. */
function seededZufall(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/**
 * Unabhängige Nachprüfung: enthält `wort` die `folge` WIRKLICH an der Stelle
 * `stelle`? Bewusst NICHT aus der Produktionsdatei importiert.
 */
function enthaeltAnStelle(
  wort: string,
  folge: string,
  stelle: "anfang" | "mitte" | "ende",
): boolean {
  const w = wort.toLowerCase();
  const f = folge.toLowerCase();
  if (stelle === "anfang") return w.startsWith(f);
  if (stelle === "ende") return w.endsWith(f);
  // mitte: mindestens ein Treffer, der weder ganz am Anfang noch ganz am Ende sitzt.
  for (let i = 1; i + f.length < w.length; i++) {
    if (w.slice(i, i + f.length) === f) return true;
  }
  return false;
}

const GRUNDREIHE_DE = new Set(LETTER_ORDER.slice(0, 8)); // f j d k s l a ö
const MEDIUM_DE = new Set(LETTER_ORDER.slice(0, 16)); // + e n i r t h o u
const VOLL_DE = new Set(LETTER_ORDER); // ganzes Alphabet + Umlaute + ß
const VOLL_EN = new Set(["'", ..."abcdefghijklmnopqrstuvwxyz".split("")]);

function alleListen(): { lang: Lang; liste: Verbindung[] }[] {
  return [
    { lang: "de", liste: VERBINDUNGEN_DE },
    { lang: "en", liste: VERBINDUNGEN_EN },
  ];
}

describe("Geläufigkeitsschreiben: Wortlisten stimmen", () => {
  for (const { lang, liste } of alleListen()) {
    describe(`Sprache ${lang}`, () => {
      for (const v of liste) {
        it(`Verbindung "${v.folge}" (${v.stelle}): jedes Wort enthält sie wirklich dort`, () => {
          for (const wort of v.woerter) {
            expect(
              enthaeltAnStelle(wort, v.folge, v.stelle),
              `"${wort}" enthält "${v.folge}" nicht an Stelle "${v.stelle}"`,
            ).toBe(true);
          }
        });
      }
    });
  }
});

describe("Geläufigkeitsschreiben: genug Wörter je Verbindung", () => {
  for (const { lang, liste } of alleListen()) {
    it(`${lang}: mindestens 18 (de) bzw. 10 (en) Verbindungen, je mindestens 6 Wörter`, () => {
      expect(liste.length).toBeGreaterThanOrEqual(lang === "de" ? 18 : 10);
      for (const v of liste) {
        expect(v.woerter.length, `Verbindung "${v.folge}" hat zu wenige Wörter`).toBeGreaterThanOrEqual(6);
      }
    });
  }
});

describe("Geläufigkeitsschreiben: eine erzeugte Zeile", () => {
  it("besteht aus 3-5 Wörtern derselben Verbindung, die sie alle wirklich enthalten (de)", () => {
    for (let seed = 1; seed <= 50; seed++) {
      const z = gelaeufigkeitsZeile(VOLL_DE, {
        stufe: "erwachsen",
        lang: "de",
        zufall: seededZufall(seed),
      });
      expect(z).not.toBeNull();
      if (!z) continue;
      const verbindung = VERBINDUNGEN_DE.find((v) => v.folge === z.folge);
      expect(verbindung, `unbekannte Verbindung "${z.folge}"`).toBeDefined();
      const tokens = z.text.split(" ");
      expect(tokens.length).toBeGreaterThanOrEqual(3);
      expect(tokens.length).toBeLessThanOrEqual(5);
      for (const t of tokens) {
        expect(
          enthaeltAnStelle(t, z.folge, verbindung!.stelle),
          `Wort "${t}" der Zeile "${z.text}" enthält "${z.folge}" nicht an Stelle "${verbindung!.stelle}"`,
        ).toBe(true);
      }
      // keine Wiederholung innerhalb derselben Zeile
      expect(new Set(tokens).size).toBe(tokens.length);
    }
  });

  it("besteht aus 3-5 Wörtern derselben Verbindung, die sie alle wirklich enthalten (en)", () => {
    for (let seed = 1; seed <= 50; seed++) {
      const z = gelaeufigkeitsZeile(VOLL_EN, {
        stufe: "erwachsen",
        lang: "en",
        zufall: seededZufall(seed),
      });
      expect(z).not.toBeNull();
      if (!z) continue;
      const verbindung = VERBINDUNGEN_EN.find((v) => v.folge === z.folge);
      expect(verbindung).toBeDefined();
      const tokens = z.text.split(" ");
      expect(tokens.length).toBeGreaterThanOrEqual(3);
      expect(tokens.length).toBeLessThanOrEqual(5);
      for (const t of tokens) {
        expect(enthaeltAnStelle(t, z.folge, verbindung!.stelle)).toBe(true);
      }
    }
  });
});

describe("Geläufigkeitsschreiben: nie eine nicht freigeschaltete Taste", () => {
  function nurErlaubteZeichen(text: string, allowed: Set<string>): boolean {
    return [...text].every((ch) => ch === " " || allowed.has(ch.toLowerCase()));
  }

  const staende: { name: string; allowed: Set<string>; lang: Lang }[] = [
    { name: "Grundreihe (8 Tasten)", allowed: GRUNDREIHE_DE, lang: "de" },
    { name: "16 Tasten", allowed: MEDIUM_DE, lang: "de" },
    { name: "volles Alphabet", allowed: VOLL_DE, lang: "de" },
    { name: "Englisch, volles Alphabet + '", allowed: VOLL_EN, lang: "en" },
  ];

  for (const stand of staende) {
    it(stand.name, () => {
      let mindestensEineZeile = false;
      for (let seed = 1; seed <= 40; seed++) {
        for (const stufe of ["kids", "teens", "erwachsen"] as Stufe[]) {
          const z = gelaeufigkeitsZeile(stand.allowed, {
            stufe,
            lang: stand.lang,
            zufall: seededZufall(seed * 7 + 1),
          });
          if (z === null) continue;
          mindestensEineZeile = true;
          expect(
            nurErlaubteZeichen(z.text, stand.allowed),
            `Zeile "${z.text}" enthält eine nicht freigeschaltete Taste (${stand.name})`,
          ).toBe(true);
        }
      }
      // Die 16-Tasten- und Volltastatur-Stände sollen tatsächlich etwas liefern -
      // sonst würde dieser Test nur ins Leere prüfen.
      if (stand.name !== "Grundreihe (8 Tasten)") {
        expect(mindestensEineZeile).toBe(true);
      }
    });
  }
});

describe("Geläufigkeitsschreiben: Tastenstand ohne passende Verbindung", () => {
  it("liefert null statt einer kaputten Zeile (Grundreihe, Deutsch)", () => {
    expect(gelaeufigkeitMoeglich(GRUNDREIHE_DE, "de")).toBe(false);
    for (let seed = 1; seed <= 20; seed++) {
      for (const stufe of ["kids", "teens", "erwachsen"] as Stufe[]) {
        expect(
          gelaeufigkeitsZeile(GRUNDREIHE_DE, {
            stufe,
            lang: "de",
            zufall: seededZufall(seed),
          }),
        ).toBeNull();
      }
    }
  });

  it("liefert null statt einer kaputten Zeile (leerer Tastenstand, Englisch)", () => {
    const leer = new Set<string>();
    expect(gelaeufigkeitMoeglich(leer, "en")).toBe(false);
    expect(
      gelaeufigkeitsZeile(leer, { stufe: "erwachsen", lang: "en", zufall: seededZufall(1) }),
    ).toBeNull();
  });
});

describe("Geläufigkeitsschreiben: gelaeufigkeitMoeglich stimmt mit gelaeufigkeitsZeile überein", () => {
  const staende: { name: string; allowed: Set<string>; lang: Lang }[] = [
    { name: "leer", allowed: new Set<string>(), lang: "de" },
    { name: "Grundreihe", allowed: GRUNDREIHE_DE, lang: "de" },
    { name: "16 Tasten", allowed: MEDIUM_DE, lang: "de" },
    { name: "volles Alphabet", allowed: VOLL_DE, lang: "de" },
    { name: "leer (en)", allowed: new Set<string>(), lang: "en" },
    { name: "volles Alphabet + ' (en)", allowed: VOLL_EN, lang: "en" },
  ];

  for (const stand of staende) {
    it(`${stand.name} (${stand.lang})`, () => {
      const moeglich = gelaeufigkeitMoeglich(stand.allowed, stand.lang);
      // Stufe "erwachsen" hat keine Längen-Grenze - sie ist genau der Fall, den
      // `gelaeufigkeitMoeglich` prüft. Über mehrere Zufallsfolgen darf das nie
      // auseinanderlaufen.
      let jeGefunden = false;
      for (let seed = 1; seed <= 30; seed++) {
        const z = gelaeufigkeitsZeile(stand.allowed, {
          stufe: "erwachsen",
          lang: stand.lang,
          zufall: seededZufall(seed),
        });
        if (z !== null) jeGefunden = true;
      }
      expect(jeGefunden).toBe(moeglich);

      // Ist gar nichts möglich, darf auch KEINE Stufe je etwas liefern.
      if (!moeglich) {
        for (const stufe of ["kids", "teens"] as Stufe[]) {
          expect(
            gelaeufigkeitsZeile(stand.allowed, { stufe, lang: stand.lang, zufall: seededZufall(1) }),
          ).toBeNull();
        }
      }
    });
  }
});

describe("Geläufigkeitsschreiben: reproduzierbar mit festem Zufall", () => {
  it("derselbe Startwert liefert zweimal dasselbe Ergebnis", () => {
    const a = gelaeufigkeitsZeile(VOLL_DE, { stufe: "teens", lang: "de", zufall: seededZufall(42) });
    const b = gelaeufigkeitsZeile(VOLL_DE, { stufe: "teens", lang: "de", zufall: seededZufall(42) });
    expect(a).toEqual(b);
  });

  it("unterschiedliche Startwerte liefern (fast immer) unterschiedliche Zeilen", () => {
    const ergebnisse = new Set<string>();
    for (let seed = 1; seed <= 15; seed++) {
      const z = gelaeufigkeitsZeile(VOLL_DE, { stufe: "erwachsen", lang: "de", zufall: seededZufall(seed) });
      if (z) ergebnisse.add(z.text);
    }
    expect(ergebnisse.size).toBeGreaterThan(1);
  });
});

describe("Geläufigkeitsschreiben: Stufe steuert den Wortschatz", () => {
  it("Stufe `kids` lässt nie ein Wort über 6 Zeichen durch", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const z = gelaeufigkeitsZeile(VOLL_DE, { stufe: "kids", lang: "de", zufall: seededZufall(seed) });
      if (!z) continue;
      for (const t of z.text.split(" ")) {
        expect(t.length, `Wort "${t}" ist für Stufe kids zu lang`).toBeLessThanOrEqual(6);
      }
    }
  });

  it("Stufe `teens` lässt nie ein Wort über 10 Zeichen durch", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const z = gelaeufigkeitsZeile(VOLL_DE, { stufe: "teens", lang: "de", zufall: seededZufall(seed) });
      if (!z) continue;
      for (const t of z.text.split(" ")) {
        expect(t.length, `Wort "${t}" ist für Stufe teens zu lang`).toBeLessThanOrEqual(10);
      }
    }
  });

  it("Stufe `erwachsen` liefert (über genug Versuche) auch längere Wörter als 6 Zeichen", () => {
    let langesWortGesehen = false;
    for (let seed = 1; seed <= 200; seed++) {
      const z = gelaeufigkeitsZeile(VOLL_DE, { stufe: "erwachsen", lang: "de", zufall: seededZufall(seed) });
      if (!z) continue;
      if (z.text.split(" ").some((t) => t.length > 6)) langesWortGesehen = true;
    }
    expect(langesWortGesehen).toBe(true);
  });
});

describe("Geläufigkeitsschreiben: opts.woerter ist steuerbar, aber auf 3-5 geklemmt", () => {
  it("woerter: 2 wird zu 3 Wörtern", () => {
    const z = gelaeufigkeitsZeile(VOLL_DE, {
      stufe: "erwachsen",
      lang: "de",
      zufall: seededZufall(3),
      woerter: 2,
    });
    expect(z).not.toBeNull();
    expect(z!.text.split(" ")).toHaveLength(3);
  });

  it("woerter: 9 wird zu 5 Wörtern", () => {
    const z = gelaeufigkeitsZeile(VOLL_DE, {
      stufe: "erwachsen",
      lang: "de",
      zufall: seededZufall(3),
      woerter: 9,
    });
    expect(z).not.toBeNull();
    expect(z!.text.split(" ")).toHaveLength(5);
  });

  it("ohne Angabe sind es 4 Wörter (Vorgabe)", () => {
    // Bei einer Verbindung mit genau 6 passenden Wörtern reicht die Vorgabe von 4
    // sicher aus (min. 3 verlangt) - hier über mehrere Zufallsfolgen bestätigt.
    let vorgabeGesehen = false;
    for (let seed = 1; seed <= 20; seed++) {
      const z = gelaeufigkeitsZeile(VOLL_DE, { stufe: "erwachsen", lang: "de", zufall: seededZufall(seed) });
      if (z && z.text.split(" ").length === 4) vorgabeGesehen = true;
    }
    expect(vorgabeGesehen).toBe(true);
  });
});
