/**
 * ★★★★★ WÄCHTER F8 Türkisch (03.10.2026): `zahlwortTr` - die Zahlwörter 0 bis 1.000.000 - und die Zahlenschreibung `zahl(n, "tr")`.
 *
 * Vorbild: `tests/tastenflow-zahlwort-it.test.ts`. Regeln (siehe `zahlwort.ts`): getrennt geschrieben (TDK „Sayıların yazılışı"); `bin` und
 * `yüz` OHNE `bir` (1.000 ist `bin`, nie `bir bin`; 100 ist `yüz`); ab 2 steht die Zahl davor (`iki bin`, `iki yüz`); nur `milyon` braucht
 * das `bir`; keine Verbindungswörter (`yirmi bir`, nicht *yirmi ve bir*).
 */
import { describe, expect, it } from "vitest";
import { MAX_ZAHL_TR, zahlwort, zahlwortTr } from "../src/lib/typing/zahlwort";
import { zahl } from "../src/lib/bedienSprache/texte";
import { zahlendiktat } from "../src/lib/typing/uebungsformen/zahlendiktat";
import type { FormKontext } from "../src/lib/typing/uebungsformen/typen";

describe("zahlwortTr: die Tabelle", () => {
  const TABELLE: readonly (readonly [number, string])[] = [
    [0, "sıfır"], [1, "bir"], [2, "iki"], [3, "üç"], [4, "dört"], [5, "beş"], [6, "altı"], [7, "yedi"], [8, "sekiz"], [9, "dokuz"],
    [10, "on"], [11, "on bir"], [12, "on iki"], [13, "on üç"], [14, "on dört"], [15, "on beş"], [16, "on altı"], [17, "on yedi"], [18, "on sekiz"],
    [19, "on dokuz"],
    [20, "yirmi"], [21, "yirmi bir"], [22, "yirmi iki"], [28, "yirmi sekiz"], [29, "yirmi dokuz"],
    [30, "otuz"], [31, "otuz bir"], [40, "kırk"], [41, "kırk bir"], [50, "elli"], [60, "altmış"], [70, "yetmiş"], [80, "seksen"], [90, "doksan"],
    [99, "doksan dokuz"],
    [100, "yüz"], [101, "yüz bir"], [102, "yüz iki"], [110, "yüz on"], [111, "yüz on bir"], [120, "yüz yirmi"], [199, "yüz doksan dokuz"],
    [200, "iki yüz"], [300, "üç yüz"], [345, "üç yüz kırk beş"], [400, "dört yüz"], [500, "beş yüz"], [600, "altı yüz"], [700, "yedi yüz"],
    [800, "sekiz yüz"], [900, "dokuz yüz"], [999, "dokuz yüz doksan dokuz"],
    [1000, "bin"], [1001, "bin bir"], [1010, "bin on"], [1100, "bin yüz"], [1234, "bin iki yüz otuz dört"], [1999, "bin dokuz yüz doksan dokuz"],
    [2000, "iki bin"], [2026, "iki bin yirmi altı"], [3000, "üç bin"], [10000, "on bin"], [11000, "on bir bin"], [21000, "yirmi bir bin"],
    [100000, "yüz bin"], [101000, "yüz bir bin"], [110000, "yüz on bin"], [200000, "iki yüz bin"], [345678, "üç yüz kırk beş bin altı yüz yetmiş sekiz"],
    [999999, "dokuz yüz doksan dokuz bin dokuz yüz doksan dokuz"], [1000000, "bir milyon"],
  ];

  it.each(TABELLE)("%i ⇒ %s", (n, wort) => {
    expect(zahlwortTr(n)).toBe(wort);
  });

  it("★ die Regeln einzeln: `bin` und `yüz` OHNE `bir` - `bir bin` und `bir yüz` sind falsch, `bir milyon` richtig", () => {
    expect(zahlwortTr(1000)).toBe("bin");
    expect(zahlwortTr(1000)).not.toBe("bir bin");
    expect(zahlwortTr(100)).toBe("yüz");
    expect(zahlwortTr(100)).not.toBe("bir yüz");
    expect(zahlwortTr(1100)).toBe("bin yüz");
    expect(zahlwortTr(100000)).toBe("yüz bin");
    expect(zahlwortTr(2000)).toBe("iki bin");
    expect(zahlwortTr(1000000)).toBe("bir milyon");
    // in KEINEM Zahlwort von 1 bis 999.999 steht „bir bin“ oder „bir yüz“ (nur bei x1.000 als „yirmi bir bin“ - da ist das bir der Einer)
    for (let n = 1; n <= 999999; n += 37) {
      const w = zahlwortTr(n);
      expect(/(^| )bir bin( |$)/.test(w) && !/(on|yirmi|otuz|kırk|elli|altmış|yetmiş|seksen|doksan|yüz) bir bin/.test(w), `${n}: ${w}`).toBe(false);
      expect(/(^| )bir yüz( |$)/.test(w), `${n}: ${w}`).toBe(false);
    }
  });

  it("keine Verbindungswörter und keine Bindestriche: jede Zahl von 0 bis 1.000: nur Kleinbuchstaben des Türkischen und Leerzeichen", () => {
    for (let n = 0; n <= 1000; n++) {
      const w = zahlwortTr(n);
      expect(/^[a-zçğıöşü ]+$/.test(w), `${n}: ${w}`).toBe(true);
      expect(w.includes("-"), `${n}: ${w}`).toBe(false);
      expect(/\bve\b/.test(w), `${n}: ${w}`).toBe(false);
      expect(w, `${n}: ${w}`).toBe(w.trim());
      expect(/ {2}/.test(w), `${n}: ${w}`).toBe(false);
    }
  });

  it("jede Zahl hat ein ANDERES Wort (keine Verwechslung, die ein Kind nicht auflösen kann)", () => {
    const gesehen = new Map<string, number>();
    for (let n = 0; n <= 20000; n++) {
      const w = zahlwortTr(n);
      expect(gesehen.has(w), `${n} und ${gesehen.get(w)}: ${w}`).toBe(false);
      gesehen.set(w, n);
    }
  });

  it("die Wortzahl wächst mit der Zahl in Schritten: Einer ein Wort, Zehner ein Wort, zusammengesetzt zwei; `yüz yirmi üç` hat drei", () => {
    expect(zahlwortTr(7).split(" ")).toHaveLength(1);
    expect(zahlwortTr(70).split(" ")).toHaveLength(1);
    expect(zahlwortTr(77).split(" ")).toHaveLength(2);
    expect(zahlwortTr(123).split(" ")).toEqual(["yüz", "yirmi", "üç"]);
    expect(zahlwortTr(1123).split(" ")).toEqual(["bin", "yüz", "yirmi", "üç"]);
  });

  it("die Grenzen: 1.000.000 ist die grösste Zahl, darüber, unter 0 und Bruchzahlen werfen", () => {
    expect(MAX_ZAHL_TR).toBe(1_000_000);
    expect(() => zahlwortTr(1_000_001)).toThrow(RangeError);
    expect(() => zahlwortTr(-1)).toThrow(RangeError);
    expect(() => zahlwortTr(1.5)).toThrow(RangeError);
  });

  it("der allgemeine `zahlwort(n, \"tr\")` wirft ausdrücklich und nennt die richtige Funktion (kein stilles Deutsch)", () => {
    expect(() => zahlwort(41, "tr")).toThrow(/zahlwortTr/);
    expect(zahlwort(43, "de")).toBe("dreiundvierzig");
    expect(zahlwort(43, "en")).toBe("forty-three");
  });
});

describe("Zahlendiktat auf Weg tr: seit F8 angeboten, mit türkischen Zahlwörtern", () => {
  const alleTasten = [..."abcçdefgğhıijklmnoöprsştuüvyzwxq'0123456789.,"];
  const ctx = (ueber: Partial<FormKontext> = {}): FormKontext => ({
    lernweg: "tr",
    introduced: alleTasten,
    shift: true,
    oneHand: false,
    stufe: "teens",
    lang: "tr",
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

  it("die Form wird angeboten und fragt türkisch - die Zahlwörter sind türkisch, die Rahmen auch", () => {
    expect(zahlendiktat.taugt(ctx())).toBe(true);
    const aufgaben = zahlendiktat.fragen!(ctx());
    expect(aufgaben.length).toBeGreaterThan(3);
    const zahlen = new Set(Array.from({ length: 90 }, (_, i) => zahlwortTr(i + 10)));
    for (const a of aufgaben) {
      const text = `${a.frage} ${a.antworten.join(" ")}`;
      expect(text, text).not.toMatch(/[äß]/);
      const woerter = [...a.antworten, a.frage.replace(/^.*: /, "").replace(/\.$/, "")];
      expect(woerter.some((w) => zahlen.has(w) || /^\d+$/.test(w)), a.frage).toBe(true);
    }
  });

  it("★ ohne die Taste `ğ`, `ı` oder `ş` wird kein Zahlwort mit diesem Buchstaben als ANTWORT verlangt - eine unlösbare Aufgabe gibt es nicht", () => {
    for (const fehlend of ["ş", "ı", "ö", "ü"]) {
      const ohne = alleTasten.filter((c) => c !== fehlend);
      const aufgaben = zahlendiktat.fragen!(ctx({ introduced: ohne }));
      expect(aufgaben.length, fehlend).toBeGreaterThan(3);
      for (const a of aufgaben) for (const antwort of a.antworten) expect(antwort.includes(fehlend), `${fehlend}: ${antwort}`).toBe(false);
    }
  });

  it("cs: hat seine Zahlwörter inzwischen ebenfalls (zahlwort-cs) - mit cs gilt das für alle neuen Sprachen", () => {
    for (const s of ["cs"] as const) {
      expect(zahlendiktat.taugt(ctx({ lang: s, lernweg: s })), s).toBe(true);
    }
  });
});

describe("zahl(n, \"tr\"): vierstellige Zahlen MIT Tausenderpunkt (gemessen, Intl tr-TR), alle anderen Sprachen wie vorher", () => {
  it("1.234, 12.345,5 - Punkt für Tausender, Komma für Dezimalen; unter 1.000 unverändert", () => {
    expect(zahl(1234, "tr")).toBe("1.234");
    expect(zahl(12345.5, "tr")).toBe("12.345,5");
    expect(zahl(999, "tr")).toBe("999");
    expect(zahl(1000000, "tr")).toBe("1.000.000");
    expect(zahl(0, "tr")).toBe("0");
  });

  it("★ GEMESSEN (Node, ECMA-402): tr-TR gruppiert schon vierstellig ohne Zusatz - anders als es-ES und it-IT; darum braucht Türkisch keine Sonderregel (`GRUPPIERUNG_IMMER`)", () => {
    expect(new Intl.NumberFormat("tr-TR").format(1234)).toBe("1.234");
    expect(new Intl.NumberFormat("it-IT").format(1234)).toBe("1234");
    expect(new Intl.NumberFormat("es-ES").format(1234)).toBe("1234");
  });

  it("Spanisch bleibt bei „1234“, Italienisch bei „1.234“ (Sonderregel), Deutsch und Englisch wie vorher", () => {
    expect(zahl(1234, "es")).toBe("1234");
    expect(zahl(1234, "it")).toBe("1.234");
    expect(zahl(1234, "de")).toBe(new Intl.NumberFormat("de-AT").format(1234));
    expect(zahl(1234, "en")).toBe("1,234");
  });
});
