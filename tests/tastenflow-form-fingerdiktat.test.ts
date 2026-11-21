/**
 * Übungsform „Fingerdiktat" (`src/lib/typing/uebungsformen/fingerdiktatAufgaben.ts`).
 *
 * Die Form ist rein akustisch: das Kind hört einen Fingernamen (ausserhalb der
 * Grundreihe zusätzlich die REIHE) und tippt den Buchstaben, der dort liegt -
 * ohne jede Vorlage. Die Tests prüfen deshalb vor allem, dass die Ansage
 * NIEMALS vom Zeichen abweicht (`fingers.ts` ist die einzige Quelle für Finger
 * UND Reihe), dass nur Buchstaben aus `ctx.introduced` vorkommen (seit
 * 20.09.2026 auch ausserhalb der Grundreihe, Punkt 13 aus Testerin Durchgang)
 * und dass kein Finger zweimal hintereinander dran ist.
 */
import { describe, it, expect } from "vitest";
import {
  fingerdiktatAufgaben,
  fingerdiktatAnkuendigung,
  fingerdiktatTaugt,
  zeichenDerAnsage,
  type FingerAufgabe,
} from "../src/lib/typing/uebungsformen/fingerdiktatAufgaben";
import type { FormKontext } from "../src/lib/typing/uebungsformen/typen";
import { fingerForChar, fingerName, rowForChar, rowName } from "../src/lib/typing/fingers";
import type { Lang, Stufe } from "../src/lib/typing/account";

/** Die Grundreihen-Zeichen unabhängig von der Implementierung noch einmal
 * benannt, damit der Test eine eigene Erwartung hat statt die Produktions-
 * Konstante zu spiegeln. */
const GRUNDREIHE = ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ö"];

/** Alle Grundreihen-Zeichen, plus ein paar Zeichen AUSSERHALB der Grundreihe
 * (weitere Buchstaben, Umschaltung, ein Satzzeichen) - damit ein Test echten
 * Anlass hat, das Herausfiltern zu prüfen. */
const VOLL_FREIGESCHALTET = [...GRUNDREIHE, "e", "n", "i", "r", "t", "o", "⇧", "."];

/** Seed-fähiger Zufallsgenerator (mulberry32) - reproduzierbar über den Seed. */
function seedZufall(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function baueKontext(overrides: Partial<FormKontext> = {}): FormKontext {
  return {
    lernweg: "de",
    introduced: VOLL_FREIGESCHALTET,
    shift: true,
    oneHand: false,
    stufe: "kids" as Stufe,
    lang: "de" as Lang,
    count: 10,
    zufall: seedZufall(42),
    ...overrides,
  };
}

/** Prüft, dass kein Finger zweimal direkt hintereinander vorkommt. */
function fingerFolgen(aufgaben: FingerAufgabe[]): string[] {
  return aufgaben.map((a) => fingerForChar(a.zeichen)!.id);
}

describe("fingerdiktatAufgaben", () => {
  it("die Ansage jeder Aufgabe stimmt exakt mit fingers.ts überein (Finger, ausserhalb der Grundreihe + Reihe)", () => {
    const ctx = baueKontext({ count: 30, zufall: seedZufall(1) });
    const aufgaben = fingerdiktatAufgaben(ctx);
    expect(aufgaben.length).toBeGreaterThan(0);
    for (const a of aufgaben) {
      const finger = fingerForChar(a.zeichen);
      expect(finger).not.toBeNull();
      const reihe = rowForChar(a.zeichen);
      const erwartet =
        reihe === 2 // Grundreihe: wortgleich wie bisher, nur der Finger
          ? fingerName(finger!, ctx.lang)
          : `${fingerName(finger!, ctx.lang)}, ${rowName(a.zeichen, ctx.lang)}`;
      expect(a.ansage).toBe(erwartet);
    }
  });

  it("kein Zeichen ausserhalb von ctx.introduced", () => {
    // g und h bewusst NICHT freigeschaltet - müssen dann auch nie vorkommen.
    const introduced = ["a", "s", "d", "f", "j", "k", "l", "ö"];
    const ctx = baueKontext({ introduced, count: 40, zufall: seedZufall(7) });
    expect(fingerdiktatTaugt(ctx)).toBe(true); // acht Finger, taugt weiterhin
    const aufgaben = fingerdiktatAufgaben(ctx);
    expect(aufgaben.length).toBeGreaterThan(0);
    for (const a of aufgaben) {
      expect(introduced).toContain(a.zeichen);
      expect(a.zeichen).not.toBe("g");
      expect(a.zeichen).not.toBe("h");
    }
  });

  it("★ Punkt 13 (20.09.2026): Buchstaben ausserhalb der Grundreihe kommen jetzt vor, wenn freigeschaltet", () => {
    // e, n, i, r, t, o stehen in VOLL_FREIGESCHALTET und sind KEINE Grundreihe -
    // vor dem 20.09. durften sie nie vorkommen, jetzt gehören sie dazu.
    const ctx = baueKontext({ count: 80, zufall: seedZufall(3) });
    const aufgaben = fingerdiktatAufgaben(ctx);
    const zeichenGesehen = new Set(aufgaben.map((a) => a.zeichen));
    const ausserhalb = ["e", "n", "i", "r", "t", "o"].filter((z) => zeichenGesehen.has(z));
    expect(ausserhalb.length).toBeGreaterThan(0);
    for (const a of aufgaben) {
      // Weiterhin: kein Zeichen, das keinen eigenen Finger hat/eine Zusatztaste
      // braucht - Umschaltung und Satzzeichen bleiben aussen vor, obwohl sie in
      // ctx.introduced stecken (das ist keine "Buchstaben"-Einheit).
      expect(a.zeichen).not.toBe("⇧");
      expect(a.zeichen).not.toBe(".");
    }
  });

  it("★ Punkt 13: die Ansage ausserhalb der Grundreihe nennt zusätzlich die Reihe", () => {
    // "e" liegt auf dem linken Mittelfinger, obere Reihe (DE-Layout).
    const ctx = baueKontext({
      introduced: [...GRUNDREIHE, "e"],
      count: 60,
      zufall: seedZufall(9),
    });
    const aufgaben = fingerdiktatAufgaben(ctx);
    const eAufgabe = aufgaben.find((a) => a.zeichen === "e");
    expect(eAufgabe).toBeDefined();
    const finger = fingerForChar("e")!;
    expect(finger.id).toBe("mittel-links");
    expect(rowForChar("e")).not.toBe(2); // nicht die Grundreihe
    expect(eAufgabe!.ansage).toBe(`${fingerName(finger, "de")}, ${rowName("e", "de")}`);
    expect(eAufgabe!.ansage).toContain("linker Mittelfinger");
    expect(eAufgabe!.ansage).toContain("obere Reihe");
  });

  it("★ Punkt 13: Grundreihen-Ansage bleibt wortgleich wie vor der Erweiterung", () => {
    const ctx = baueKontext({ count: 60, zufall: seedZufall(13) });
    const aufgaben = fingerdiktatAufgaben(ctx);
    for (const a of aufgaben) {
      if (!GRUNDREIHE.includes(a.zeichen)) continue;
      const finger = fingerForChar(a.zeichen)!;
      expect(a.ansage).toBe(fingerName(finger, "de")); // KEIN ", ... Reihe" angehängt
      expect(a.ansage).not.toContain("Reihe");
    }
  });

  it("★ Punkt 13: bleibt eine Ansage trotz Reihe mehrdeutig (Zeigefinger-Spalten), zählen alle gemeinten Zeichen", () => {
    // "r" UND "t" liegen beide auf dem linken Zeigefinger, obere Reihe (DE-Layout) -
    // dieselbe Zweideutigkeit wie f/g in der Grundreihe, nur eine Reihe weiter oben.
    const ctx = baueKontext({ introduced: [...GRUNDREIHE, "r", "t"], count: 10, zufall: seedZufall(1) });
    expect(fingerForChar("r")!.id).toBe("zeige-links");
    expect(fingerForChar("t")!.id).toBe("zeige-links");
    expect(rowForChar("r")).toBe(rowForChar("t"));
    expect(rowForChar("r")).not.toBe(2);
    const antwortenR = zeichenDerAnsage("r", ctx);
    const antwortenT = zeichenDerAnsage("t", ctx);
    expect(antwortenR).toEqual(expect.arrayContaining(["r", "t"]));
    expect(antwortenT).toEqual(expect.arrayContaining(["r", "t"]));
  });

  it("kein Daumen, keine Leertaste", () => {
    const ctx = baueKontext({ count: 50, zufall: seedZufall(11) });
    const aufgaben = fingerdiktatAufgaben(ctx);
    for (const a of aufgaben) {
      expect(a.zeichen).not.toBe(" ");
      expect(fingerForChar(a.zeichen)!.id).not.toBe("daumen");
    }
  });

  it("derselbe Finger nie zweimal direkt hintereinander (und damit nie dreimal)", () => {
    for (const seed of [1, 2, 3, 4, 5, 99, 123, 4242]) {
      const ctx = baueKontext({ count: 40, zufall: seedZufall(seed) });
      const folge = fingerFolgen(fingerdiktatAufgaben(ctx));
      for (let i = 1; i < folge.length; i++) {
        expect(folge[i]).not.toBe(folge[i - 1]);
      }
    }
  });

  it("liefert ungefähr ctx.count Aufgaben bei genug freigeschalteten Fingern", () => {
    const ctx = baueKontext({ count: 15, zufall: seedZufall(5) });
    const aufgaben = fingerdiktatAufgaben(ctx);
    expect(aufgaben.length).toBe(15);
  });

  it("fingerdiktatTaugt ist falsch bei drei freigeschalteten Fingern", () => {
    // a, s, d → kleiner-links, ring-links, mittel-links: drei verschiedene Finger.
    // `taugt` ist die Zulassungsfrage des Bildschirms - er ruft `fingerdiktatAufgaben`
    // nur auf, wenn sie wahr ist. Der Test prüft deshalb genau das: die Frage,
    // nicht ein stillschweigendes Selbst-Abschalten der Aufgaben-Erzeugung.
    const ctx = baueKontext({ introduced: ["a", "s", "d"] });
    expect(fingerdiktatTaugt(ctx)).toBe(false);
  });

  it("fingerdiktatTaugt ist wahr bei acht freigeschalteten Fingern", () => {
    const ctx = baueKontext({ introduced: ["a", "s", "d", "f", "j", "k", "l", "ö"] });
    expect(fingerdiktatTaugt(ctx)).toBe(true);
  });

  it("englische Ansagen sind wirklich englisch, nicht die deutschen Namen", () => {
    const ctxDe = baueKontext({ lang: "de", count: 20, zufall: seedZufall(21) });
    const ctxEn = baueKontext({ lang: "en", count: 20, zufall: seedZufall(21) });
    const aufgabenDe = fingerdiktatAufgaben(ctxDe);
    const aufgabenEn = fingerdiktatAufgaben(ctxEn);
    expect(aufgabenEn.length).toBeGreaterThan(0);
    for (let i = 0; i < aufgabenEn.length; i++) {
      const zeichen = aufgabenEn[i].zeichen;
      const finger = fingerForChar(zeichen)!;
      const reihe = rowForChar(zeichen);
      const erwartetEn =
        reihe === 2 ? fingerName(finger, "en") : `${fingerName(finger, "en")}, ${rowName(zeichen, "en")}`;
      expect(aufgabenEn[i].ansage).toBe(erwartetEn);
      // wirklich englisch: weicht vom deutschen Namen desselben Fingers ab
      // und enthält keinen deutschen Wortbestandteil („linker"/„rechter"/„Finger"/„Reihe").
      expect(aufgabenEn[i].ansage).not.toBe(
        reihe === 2 ? fingerName(finger, "de") : `${fingerName(finger, "de")}, ${rowName(zeichen, "de")}`,
      );
      expect(aufgabenEn[i].ansage).not.toMatch(/linker|rechter|Finger|Reihe/);
      expect(aufgabenEn[i].ansage).toMatch(/left|right|little|ring|middle|index|finger/);
    }
    // dieselbe Zufallsfolge, aber deutsche Ansagen bleiben deutsch
    for (const a of aufgabenDe) {
      expect(a.ansage).toMatch(/linker|rechter/);
    }
  });

  it("ist mit festem zufall reproduzierbar", () => {
    const ctx1 = baueKontext({ count: 25, zufall: seedZufall(777) });
    const ctx2 = baueKontext({ count: 25, zufall: seedZufall(777) });
    expect(fingerdiktatAufgaben(ctx1)).toEqual(fingerdiktatAufgaben(ctx2));
  });

  it("liefert eine ganze Ankündigung in Deutsch und Englisch", () => {
    const de = fingerdiktatAnkuendigung(baueKontext({ lang: "de" }));
    const en = fingerdiktatAnkuendigung(baueKontext({ lang: "en" }));
    expect(de).toContain("Fingerdiktat");
    expect(de.endsWith(".")).toBe(true);
    expect(en.toLowerCase()).toContain("finger dictation");
    expect(en.endsWith(".")).toBe(true);
  });
});
