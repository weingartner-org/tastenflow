/**
 * WÄCHTER-TEST „Hand-Schwerpunkte" (Übungsform, 02.09.2026) - dazu die beiden
 * Inhaltslisten, aus denen sie ihren Wortvorrat zieht (`wortkettenThemen.ts`,
 * `englischGrundreihe.ts`).
 *
 * Prüft VERHALTEN, nicht Konstanten - und die Hand-Zuordnung wird in JEDEM
 * Test aus `fingerForChar` (der echten Quelle) nachgerechnet, nie aus einer
 * im Test mitgeführten Buchstabenliste. Genau das ist der Belegwert dieser
 * Datei: Eine zweite, getrennt gepflegte Liste hätte in diesem Projekt schon
 * mehrfach unbemerkt vom Original abweichen können (siehe `fingers.ts`-Kopf).
 */
import { describe, expect, it } from "vitest";
import { handschwerpunkte, type Handschwerpunkt } from "@/lib/typing/uebungsformen/handschwerpunkte";
import { WORTKETTEN_DE, WORTKETTEN_EN } from "@/lib/typing/uebungsformen/wortkettenThemen";
import {
  EN_GRUNDREIHE,
  EN_GRUNDREIHE_KLEIN,
  EN_GRUNDREIHE_MIT_G_H,
} from "@/lib/typing/uebungsformen/englischGrundreihe";
import { fingerForChar, needsShift, shiftHandFor, type Hand } from "@/lib/typing/fingers";
import { activeLayout } from "@/lib/typing/layouts";
import type { FormKontext } from "@/lib/typing/uebungsformen/typen";
import type { RoundLine } from "@/lib/typing/generator";

/** Kleiner deterministischer Zufallsgenerator - derselbe Startwert liefert immer dieselbe Folge. */
function seededZufall(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const ALLE_BUCHSTABEN_DE = "abcdefghijklmnopqrstuvwxyzäöüß".split("");
const ALLE_ZIFFERN = "0123456789".split("");
const SATZZEICHEN = [".", ",", "!", "?", "-"];
/** Ein Tastenstand, der so ziemlich alles freischaltet - der Normalfall in diesen Tests. */
const VOLLER_TASTENSTAND = [...ALLE_BUCHSTABEN_DE, "⇧", ...ALLE_ZIFFERN, ...SATZZEICHEN];

function makeCtx(overrides: Partial<FormKontext>): FormKontext {
  return {
    lernweg: "de",
    introduced: VOLLER_TASTENSTAND,
    shift: true,
    oneHand: false,
    stufe: "kids",
    lang: "de",
    count: 8,
    zufall: seededZufall(1),
    ...overrides,
  };
}

/**
 * Liest aus dem ANSAGE-Satz heraus, welchen Schwerpunkt er nennt - ohne
 * interne Konstanten zu kennen. Die deutsche Grammatik biegt das Adjektiv je
 * nach Fall („die linke Hand", aber „der linken Umschalttaste") - deshalb
 * hier über ein Wortstamm-Muster erkannt, nicht über den exakten Wortlaut.
 */
function schwerpunktAusAnkuendigung(text: string): Handschwerpunkt {
  const t = text.toLowerCase();
  if (/\blink\w*\s+hand\b/.test(t) || /\bleft hand\b/.test(t)) return "links";
  if (/\brecht\w*\s+hand\b/.test(t) || /\bright hand\b/.test(t)) return "rechts";
  if (/\blink\w*\s+umschalttaste\b/.test(t) || /\bleft shift\b/.test(t)) return "umschalt-links";
  if (/\brecht\w*\s+umschalttaste\b/.test(t) || /\bright shift\b/.test(t)) return "umschalt-rechts";
  throw new Error(`Ankündigung nennt keinen erkennbaren Schwerpunkt: "${text}"`);
}

/**
 * Prüft, dass JEDES Wort in `zeilen` wirklich zu `schwerpunkt` passt - für
 * „links"/„rechts" gerechnet über `fingerForChar`, für „umschalt-*" über
 * `needsShift`/`shiftHandFor`. Alles Quellen aus `fingers.ts`, keine eigene
 * Buchstabenliste.
 */
function erwarteSchwerpunkt(schwerpunkt: Handschwerpunkt, zeilen: RoundLine[]) {
  expect(zeilen.length).toBeGreaterThan(0);
  for (const zeile of zeilen) {
    const woerter = zeile.text.split(" ").filter(Boolean);
    expect(woerter.length).toBeGreaterThanOrEqual(3);
    expect(woerter.length).toBeLessThanOrEqual(5);
    for (const wort of woerter) {
      if (schwerpunkt === "links" || schwerpunkt === "rechts") {
        const hand: Hand = schwerpunkt === "links" ? "links" : "rechts";
        // Hand-Schwerpunkte sind IMMER kleingeschrieben (siehe Kopf-Kommentar
        // der Form) - sonst bräuchte selbst ein einhändiges Wort die Umschalt-
        // taste der Gegenhand.
        expect(wort).toBe(wort.toLowerCase());
        for (const ch of wort) {
          const finger = fingerForChar(ch);
          expect(finger, `"${ch}" in "${wort}" kennt keinen Finger`).not.toBeNull();
          expect(finger!.hand, `"${ch}" in "${wort}" sollte ${hand} sein`).toBe(hand);
        }
      } else {
        const seite: Hand = schwerpunkt === "umschalt-links" ? "links" : "rechts";
        let hatGross = false;
        for (const ch of wort) {
          if (!needsShift(ch)) continue;
          hatGross = true;
          expect(shiftHandFor(ch), `Umschalttaste von "${ch}" in "${wort}"`).toBe(seite);
        }
        expect(hatGross, `"${wort}" trägt gar keinen Großbuchstaben`).toBe(true);
      }
    }
  }
}

describe("Hand-Schwerpunkte: die Wortketten", () => {
  it("hat mindestens 20 deutsche und 10 englische Themen", () => {
    expect(WORTKETTEN_DE.length).toBeGreaterThanOrEqual(20);
    expect(WORTKETTEN_EN.length).toBeGreaterThanOrEqual(10);
  });

  for (const [label, ketten] of [
    ["Deutsch", WORTKETTEN_DE],
    ["Englisch", WORTKETTEN_EN],
  ] as const) {
    it(`${label}: jede Kette hat mindestens 12 Wörter, keine Dubletten`, () => {
      for (const kette of ketten) {
        expect(kette.woerter.length, `Thema "${kette.thema}"`).toBeGreaterThanOrEqual(12);
        expect(new Set(kette.woerter).size, `Thema "${kette.thema}" hat Dubletten`).toBe(kette.woerter.length);
        expect(kette.stufen.length, `Thema "${kette.thema}" ohne Stufe`).toBeGreaterThan(0);
      }
    });
  }
});

describe("Hand-Schwerpunkte: EN_GRUNDREIHE", () => {
  // Der Grundreihen-Tastensatz kommt aus dem echten Layout, nicht aus einer
  // im Test mitgeführten Liste - Reihe 2 ist die Grundreihe (siehe layouts.ts).
  const grundreihenTasten = new Set(
    activeLayout()
      .rows[2].keys.filter((k) => /^[a-z]$/.test(k)),
  );

  it("hat mindestens 40 Wörter", () => {
    expect(EN_GRUNDREIHE.length).toBeGreaterThanOrEqual(40);
  });

  it("hat keine Dubletten", () => {
    expect(new Set(EN_GRUNDREIHE).size).toBe(EN_GRUNDREIHE.length);
  });

  it("JEDES Wort besteht nur aus Grundreihen-Tasten", () => {
    for (const wort of EN_GRUNDREIHE) {
      for (const ch of wort.toLowerCase()) {
        expect(grundreihenTasten.has(ch), `"${wort}" enthält "${ch}" - keine Grundreihen-Taste`).toBe(true);
      }
    }
  });

  it("übernimmt Testerin Tippfehler 'glas' NICHT, führt stattdessen 'glass'", () => {
    expect(EN_GRUNDREIHE).not.toContain("glas");
    expect(EN_GRUNDREIHE).toContain("glass");
  });

  it("teilt die Wörter vollständig und überschneidungsfrei in 'klein' und 'braucht g/h'", () => {
    const klein = new Set(EN_GRUNDREIHE_KLEIN);
    const mitGh = new Set(EN_GRUNDREIHE_MIT_G_H);
    for (const wort of EN_GRUNDREIHE) {
      expect(klein.has(wort) !== mitGh.has(wort), `"${wort}" steht in beiden oder keiner Gruppe`).toBe(true);
    }
    expect(EN_GRUNDREIHE_KLEIN.length + EN_GRUNDREIHE_MIT_G_H.length).toBe(EN_GRUNDREIHE.length);
    // Die "klein"-Gruppe kommt wirklich ohne g/h aus.
    for (const wort of EN_GRUNDREIHE_KLEIN) expect(wort).not.toMatch(/[gh]/);
    // Die andere Gruppe braucht mindestens eines von beiden.
    for (const wort of EN_GRUNDREIHE_MIT_G_H) expect(wort).toMatch(/[gh]/);
  });
});

describe("Hand-Schwerpunkte: taugt", () => {
  it("ist bei sehr wenigen Tasten falsch, baue liefert dann nichts", () => {
    const ctx = makeCtx({ introduced: ["a", "b", "c", "⇧"] });
    expect(handschwerpunkte.taugt(ctx)).toBe(false);
    expect(handschwerpunkte.baue?.(ctx)).toBeNull();
  });

  it("ist mit vollem Tastenstand (mit Umschalt) wahr", () => {
    const ctx = makeCtx({});
    expect(handschwerpunkte.taugt(ctx)).toBe(true);
  });

  it("ist mit vollem Tastenstand auch OHNE Umschalt wahr (links/rechts brauchen sie nicht)", () => {
    const ctx = makeCtx({ shift: false, introduced: [...ALLE_BUCHSTABEN_DE, ...ALLE_ZIFFERN, ...SATZZEICHEN] });
    expect(handschwerpunkte.taugt(ctx)).toBe(true);
  });
});

describe("Hand-Schwerpunkte: jeder Schwerpunkt stimmt mit fingerForChar überein", () => {
  // Viele Startwerte durchprobieren, damit über die Läufe alle vier
  // Schwerpunkte (links, rechts, umschalt-links, umschalt-rechts) mindestens
  // einmal vorkommen - der volle Tastenstand mit Umschalt lässt alle vier zu.
  const gesehen = new Set<Handschwerpunkt>();

  for (let seed = 1; seed <= 40; seed++) {
    it(`Startwert ${seed}: Ankündigung und Runde nennen und erfüllen denselben Schwerpunkt`, () => {
      const ctx = makeCtx({ zufall: seededZufall(seed), count: 6 });
      const ank = handschwerpunkte.ankuendigung(ctx);
      const runde = handschwerpunkte.baue?.(ctx);
      expect(runde).not.toBeNull();
      const schwerpunkt = schwerpunktAusAnkuendigung(ank);
      gesehen.add(schwerpunkt);
      erwarteSchwerpunkt(schwerpunkt, runde!.zeilen);
    });
  }

  it("über die vielen Startwerte kamen alle vier Schwerpunkte tatsächlich vor", () => {
    expect(gesehen.size).toBe(4);
  });
});

describe("Hand-Schwerpunkte: Ankündigung und Runde laufen nie unabhängig auseinander", () => {
  it("Ankündigung zuerst, dann bauen - derselbe Schwerpunkt", () => {
    const ctx = makeCtx({ zufall: seededZufall(7), count: 5 });
    const ank = handschwerpunkte.ankuendigung(ctx);
    const runde = handschwerpunkte.baue?.(ctx);
    erwarteSchwerpunkt(schwerpunktAusAnkuendigung(ank), runde!.zeilen);
  });

  it("erst bauen, dann die Ankündigung abrufen - immer noch derselbe Schwerpunkt", () => {
    const ctx = makeCtx({ zufall: seededZufall(7), count: 5 });
    const runde = handschwerpunkte.baue?.(ctx);
    const ank = handschwerpunkte.ankuendigung(ctx);
    erwarteSchwerpunkt(schwerpunktAusAnkuendigung(ank), runde!.zeilen);
  });

  it("zweimaliges Abrufen der Ankündigung liefert denselben Satz (kein zweiter Wurf)", () => {
    const ctx = makeCtx({ zufall: seededZufall(13), count: 5 });
    const ank1 = handschwerpunkte.ankuendigung(ctx);
    const ank2 = handschwerpunkte.ankuendigung(ctx);
    expect(ank1).toBe(ank2);
  });
});

describe("Hand-Schwerpunkte: nie eine nicht freigeschaltete Taste", () => {
  const staende: { name: string; introduced: string[]; shift: boolean }[] = [
    { name: "voller Tastenstand mit Umschalt", introduced: VOLLER_TASTENSTAND, shift: true },
    {
      name: "voller Tastenstand ohne Umschalt",
      introduced: [...ALLE_BUCHSTABEN_DE, ...ALLE_ZIFFERN, ...SATZZEICHEN],
      shift: false,
    },
    {
      name: "Alphabet ohne ß, ohne Umschalt",
      introduced: ALLE_BUCHSTABEN_DE.filter((b) => b !== "ß"),
      shift: false,
    },
  ];

  for (const stand of staende) {
    it(`hält den Tastenstand ein: ${stand.name}`, () => {
      const ctx = makeCtx({ introduced: stand.introduced, shift: stand.shift, count: 20, zufall: seededZufall(21) });
      const runde = handschwerpunkte.baue?.(ctx);
      expect(runde).not.toBeNull();
      const erlaubt = new Set(stand.introduced.filter((e) => e !== "⇧"));
      for (const zeile of runde!.zeilen) {
        for (const ch of zeile.text) {
          if (ch === " ") continue;
          expect(erlaubt.has(ch.toLowerCase()), `"${ch}" in "${zeile.text}" nicht freigeschaltet`).toBe(true);
        }
      }
    });
  }
});

describe("Hand-Schwerpunkte: ohne Umschalt kommt kein Umschalt-Schwerpunkt", () => {
  it("über viele Startwerte bleibt jede Zeile durchgehend klein", () => {
    for (let seed = 1; seed <= 20; seed++) {
      const ctx = makeCtx({ shift: false, count: 6, zufall: seededZufall(seed) });
      const runde = handschwerpunkte.baue?.(ctx);
      expect(runde).not.toBeNull();
      for (const zeile of runde!.zeilen) {
        expect(zeile.text, `Startwert ${seed}: "${zeile.text}"`).toBe(zeile.text.toLowerCase());
      }
      // Und die Ankündigung behauptet folgerichtig auch keine Umschalttaste.
      const ank = handschwerpunkte.ankuendigung(ctx);
      expect(ank).not.toContain("Umschalttaste");
      expect(ank).not.toContain("shift");
    }
  });
});

describe("Hand-Schwerpunkte: Zeilen ohne Herkunft", () => {
  it("jede Zeile hat source: null und art: 'woerter'", () => {
    const ctx = makeCtx({ count: 6 });
    const runde = handschwerpunkte.baue?.(ctx);
    for (const zeile of runde!.zeilen) {
      expect(zeile.source).toBeNull();
      expect(zeile.art).toBe("woerter");
    }
  });
});

describe("Hand-Schwerpunkte: Englisch nutzt EN_GRUNDREIHE zusätzlich", () => {
  it("taugt auf Englisch (links/rechts reichen ohne Umschalt-Wörter)", () => {
    const ctx = makeCtx({
      lang: "en",
      shift: false,
      introduced: [...ALLE_BUCHSTABEN_DE, ...ALLE_ZIFFERN, ...SATZZEICHEN],
    });
    expect(handschwerpunkte.taugt(ctx)).toBe(true);
  });

  it("liefert bei Englisch nie einen Umschalt-Schwerpunkt (englische Wörter werden nie großgeschrieben)", () => {
    for (let seed = 1; seed <= 15; seed++) {
      const ctx = makeCtx({ lang: "en", count: 6, zufall: seededZufall(seed) });
      const ank = handschwerpunkte.ankuendigung(ctx);
      expect(schwerpunktAusAnkuendigung(ank)).not.toMatch(/^umschalt-/);
    }
  });
});

describe("Hand-Schwerpunkte: reproduzierbar mit festem Zufall", () => {
  it("liefert bei gleichem Startwert zweimal dieselbe Runde", () => {
    const runde1 = handschwerpunkte.baue?.(makeCtx({ zufall: seededZufall(99), count: 10 }));
    const runde2 = handschwerpunkte.baue?.(makeCtx({ zufall: seededZufall(99), count: 10 }));
    expect(runde1).not.toBeNull();
    expect(runde1?.zeilen.map((z) => z.text)).toEqual(runde2?.zeilen.map((z) => z.text));
  });

  it("liefert bei anderem Startwert nicht zwangsläufig dieselbe Runde", () => {
    const runde1 = handschwerpunkte.baue?.(makeCtx({ zufall: seededZufall(1), count: 10 }));
    const runde2 = handschwerpunkte.baue?.(makeCtx({ zufall: seededZufall(2), count: 10 }));
    const text1 = runde1?.zeilen.map((z) => z.text).join("|");
    const text2 = runde2?.zeilen.map((z) => z.text).join("|");
    expect(text1).not.toBe(text2);
  });
});

describe("Hand-Schwerpunkte: Ansage", () => {
  it("ist ein ganzer, eigenständiger Satz auf Deutsch und Englisch, nennt den Schwerpunkt", () => {
    const de = handschwerpunkte.ankuendigung(makeCtx({ lang: "de", zufall: seededZufall(3) }));
    const en = handschwerpunkte.ankuendigung(makeCtx({ lang: "en", zufall: seededZufall(3) }));
    expect(de.endsWith(".")).toBe(true);
    expect(en.endsWith(".")).toBe(true);
    expect(de).not.toBe(en);
  });
});
