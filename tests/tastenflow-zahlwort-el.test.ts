/**
 * ★★★★ WÄCHTER O-INHALT-EL (29.10.2026): `zahlwortEl` - die griechischen Zahlwörter 0 bis 1.000.000 - und das Zahlendiktat auf
 * Weg „el". Vorbild: `tests/tastenflow-zahlwort-cs.test.ts`.
 *
 * Regeln (siehe `zahlwortEl.ts`, Glossar el §2.10): sächliche Zählform („ένα", „τρία", „τέσσερα"), Tausender weiblich („τρεις
 * χιλιάδες", „είκοσι μία χιλιάδες", „διακόσιες χιλιάδες"), „χίλια" allein, „εκατόν" vor einer weiteren Zahl, Tonos wie in der Schule.
 * ⚠️ Die Tabelle ist gegen das Sprachwissen des Baus gelesen [G], NICHT von einer Person mit Griechisch als Erstsprache.
 */
import { describe, expect, it } from "vitest";
import { MAX_ZAHL_EL, ZAHLWORT_EL, zahlwortEl } from "../src/lib/typing/zahlwortEl";
import { zahlwort } from "../src/lib/typing/zahlwort";
import { zahlendiktat } from "../src/lib/typing/uebungsformen/zahlendiktat";
import type { FormKontext } from "../src/lib/typing/uebungsformen/typen";
import { LERNWEGE } from "../src/lib/typing/lernweg";

describe("zahlwortEl: die Tabelle", () => {
  const TABELLE: readonly (readonly [number, string])[] = [
    [0, "μηδέν"], [1, "ένα"], [2, "δύο"], [3, "τρία"], [4, "τέσσερα"], [5, "πέντε"], [6, "έξι"], [7, "επτά"], [8, "οκτώ"], [9, "εννέα"],
    [10, "δέκα"], [11, "έντεκα"], [12, "δώδεκα"], [13, "δεκατρία"], [14, "δεκατέσσερα"], [15, "δεκαπέντε"], [16, "δεκαέξι"],
    [17, "δεκαεπτά"], [18, "δεκαοκτώ"], [19, "δεκαεννέα"],
    [20, "είκοσι"], [21, "είκοσι ένα"], [23, "είκοσι τρία"], [24, "είκοσι τέσσερα"], [30, "τριάντα"], [40, "σαράντα"],
    [50, "πενήντα"], [60, "εξήντα"], [70, "εβδομήντα"], [80, "ογδόντα"], [90, "ενενήντα"], [99, "ενενήντα εννέα"],
    [100, "εκατό"], [101, "εκατόν ένα"], [113, "εκατόν δεκατρία"], [120, "εκατόν είκοσι"], [200, "διακόσια"], [300, "τριακόσια"],
    [400, "τετρακόσια"], [500, "πεντακόσια"], [600, "εξακόσια"], [700, "επτακόσια"], [800, "οκτακόσια"], [900, "εννιακόσια"],
    [999, "εννιακόσια ενενήντα εννέα"],
    [1000, "χίλια"], [1001, "χίλια ένα"], [1234, "χίλια διακόσια τριάντα τέσσερα"], [2000, "δύο χιλιάδες"], [3000, "τρεις χιλιάδες"],
    [4000, "τέσσερις χιλιάδες"], [13000, "δεκατρείς χιλιάδες"], [14000, "δεκατέσσερις χιλιάδες"], [21000, "είκοσι μία χιλιάδες"],
    [100000, "εκατό χιλιάδες"], [101000, "εκατόν μία χιλιάδες"], [200000, "διακόσιες χιλιάδες"], [300003, "τριακόσιες χιλιάδες τρία"],
    [999999, "εννιακόσιες ενενήντα εννέα χιλιάδες εννιακόσια ενενήντα εννέα"], [1000000, "ένα εκατομμύριο"],
  ];

  it.each(TABELLE)("%i ⇒ %s", (n, wort) => {
    expect(zahlwortEl(n)).toBe(wort);
  });

  it("die Funktion ist am Verteiler eingehängt (nicht mehr `null`)", () => {
    expect(ZAHLWORT_EL).toBe(zahlwortEl);
  });

  it("jede Zahl von 0 bis 2.000: nur griechische Kleinbuchstaben (mit Tonos), EIN Leerzeichen, kein Bindestrich, kein lateinischer Doppelgänger", () => {
    for (let n = 0; n <= 2000; n++) {
      const w = zahlwortEl(n);
      expect(/^[α-ωάέήίόύώ]+( [α-ωάέήίόύώ]+)*$/.test(w), `${n}: ${w}`).toBe(true);
    }
  });

  it("jedes Wort mit mehr als einer Silbe trägt seinen Tonos (ausser den Formen ohne Betonungszeichen: δύο hat ihn, τρεις nicht)", () => {
    const ohne = new Set(["τρεις"]);
    for (let n = 0; n <= 1000; n++)
      for (const w of zahlwortEl(n).split(" ")) {
        const silben = (w.match(/[αεηιουωάέήίόύώ]+/g) ?? []).length;
        if (silben > 1 && !ohne.has(w)) expect(/[άέήίόύώ]/.test(w), `${n}: ${w}`).toBe(true);
      }
  });

  it("jede Zahl hat ein ANDERES Wort", () => {
    const gesehen = new Map<string, number>();
    for (let n = 0; n <= 20000; n++) {
      const w = zahlwortEl(n);
      expect(gesehen.has(w), `${n} und ${gesehen.get(w)}: ${w}`).toBe(false);
      gesehen.set(w, n);
    }
  });

  it("die Grenzen: 1.000.000 ist die grösste Zahl; darüber, unter 0 und Bruchzahlen werfen", () => {
    expect(MAX_ZAHL_EL).toBe(1_000_000);
    expect(() => zahlwortEl(1_000_001)).toThrow(RangeError);
    expect(() => zahlwortEl(-1)).toThrow(RangeError);
    expect(() => zahlwortEl(1.5)).toThrow(RangeError);
  });

  it("der allgemeine `zahlwort(n, \"el\")` gibt kein Deutsch (er wirft)", () => {
    expect(() => zahlwort(41, "el")).toThrow();
  });
});

describe("Zahlendiktat auf Weg el: mit griechischen Zahlwörtern", () => {
  const alleTasten = [...LERNWEGE.el.letterOrder, ..."0123456789.,"];
  const ctx = (ueber: Partial<FormKontext> = {}): FormKontext => ({
    lernweg: "el",
    introduced: alleTasten,
    shift: true,
    oneHand: false,
    stufe: "teens",
    lang: "el",
    count: 8,
    zufall: (() => {
      let s = 7;
      return () => {
        s = (s * 1103515245 + 12345) % 2147483648;
        return s / 2147483648;
      };
    })(),
    ...ueber,
  });

  it("die Form wird angeboten, und die Zahlwörter sind griechisch (nie deutsch, nie englisch)", () => {
    expect(zahlendiktat.taugt(ctx())).toBe(true);
    const aufgaben = zahlendiktat.fragen!(ctx());
    expect(aufgaben.length).toBeGreaterThan(3);
    const zahlen = new Set(Array.from({ length: 90 }, (_, i) => zahlwortEl(i + 10)));
    for (const a of aufgaben) {
      expect(a.antworten.join(" ")).not.toMatch(/[a-zäöüß]/i);
      expect(a.antworten.some((w) => zahlen.has(w) || /^\d+$/.test(w)), a.frage).toBe(true);
    }
  });

  it("ohne die Tonos-Taste wird kein Zahlwort mit Tonos verlangt - nur die Ziffern-Richtung", () => {
    const ohne = alleTasten.filter((c) => c !== "΄");
    const aufgaben = zahlendiktat.fragen!(ctx({ introduced: ohne }));
    expect(aufgaben.length).toBeGreaterThan(3);
    for (const a of aufgaben) for (const antwort of a.antworten) expect(antwort, antwort).not.toMatch(/[άέήίόύώ]/);
  });

  it("ohne Ziffern wird die Form nicht angeboten (die Schranke gilt auch hier)", () => {
    expect(zahlendiktat.taugt(ctx({ introduced: [...LERNWEGE.el.letterOrder] }))).toBe(false);
  });
});
