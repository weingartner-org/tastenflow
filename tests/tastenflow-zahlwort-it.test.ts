/**
 * ★★★★★ WÄCHTER F8 Italienisch (02.10.2026): `zahlwortIt` - die Zahlwörter 0 bis 1.000.000 - und die Zahlenschreibung `zahl(n, "it")`.
 *
 * Vorbild: `tests/tastenflow-zahlwort-es.test.ts`, `tests/tastenflow-zahlwort-fr.test.ts`.
 * Regeln (siehe `zahlwort.ts`): zusammengeschrieben; Zehner verlieren den Endvokal vor „uno" und „otto" (ventuno, trentotto);
 * `cento` verliert sein `o` vor `otto`/`ottanta…` (centotto, centottanta); Akzent in `tré` am Ende einer Zusammensetzung
 * (ventitré, centotré, milletré); `mille` / `duemila`; „un milione" getrennt.
 */
import { describe, expect, it } from "vitest";
import { MAX_ZAHL_IT, zahlwort, zahlwortIt } from "../src/lib/typing/zahlwort";
import { zahl } from "../src/lib/bedienSprache/texte";
import { zahlendiktat } from "../src/lib/typing/uebungsformen/zahlendiktat";
import type { FormKontext } from "../src/lib/typing/uebungsformen/typen";

describe("zahlwortIt: die Tabelle", () => {
  const TABELLE: readonly (readonly [number, string])[] = [
    [0, "zero"], [1, "uno"], [2, "due"], [3, "tre"], [4, "quattro"], [5, "cinque"], [6, "sei"], [7, "sette"], [8, "otto"], [9, "nove"],
    [10, "dieci"], [11, "undici"], [12, "dodici"], [13, "tredici"], [14, "quattordici"], [15, "quindici"], [16, "sedici"],
    [17, "diciassette"], [18, "diciotto"], [19, "diciannove"],
    [20, "venti"], [21, "ventuno"], [22, "ventidue"], [23, "ventitré"], [24, "ventiquattro"], [28, "ventotto"], [29, "ventinove"],
    [30, "trenta"], [31, "trentuno"], [33, "trentatré"], [38, "trentotto"],
    [40, "quaranta"], [41, "quarantuno"], [43, "quarantatré"], [48, "quarantotto"], [50, "cinquanta"], [51, "cinquantuno"],
    [60, "sessanta"], [67, "sessantasette"], [70, "settanta"], [78, "settantotto"], [80, "ottanta"], [81, "ottantuno"],
    [88, "ottantotto"], [90, "novanta"], [93, "novantatré"], [98, "novantotto"], [99, "novantanove"],
    [100, "cento"], [101, "centouno"], [102, "centodue"], [103, "centotré"], [108, "centotto"], [110, "centodieci"], [111, "centoundici"],
    [120, "centoventi"], [121, "centoventuno"], [128, "centoventotto"], [180, "centottanta"], [181, "centottantuno"], [188, "centottantotto"],
    [200, "duecento"], [208, "duecentotto"], [300, "trecento"], [303, "trecentotré"], [380, "trecentottanta"], [400, "quattrocento"],
    [500, "cinquecento"], [600, "seicento"], [700, "settecento"], [800, "ottocento"], [900, "novecento"], [999, "novecentonovantanove"],
    [1000, "mille"], [1001, "milleuno"], [1003, "milletré"], [1008, "milleotto"], [1100, "millecento"], [1234, "milleduecentotrentaquattro"],
    [2000, "duemila"], [2003, "duemilatré"], [2008, "duemilaotto"], [3000, "tremila"], [10000, "diecimila"], [12000, "dodicimila"],
    [21000, "ventunomila"], [23000, "ventitremila"], [100000, "centomila"], [101000, "centounomila"], [200000, "duecentomila"],
    [999999, "novecentonovantanovemilanovecentonovantanove"], [1000000, "un milione"],
  ];

  it.each(TABELLE)("%i ⇒ %s", (n, wort) => {
    expect(zahlwortIt(n)).toBe(wort);
  });

  it("die Regeln einzeln: Elision vor uno/otto, `cento` vor otto/ottanta, Akzent nur am Ende einer Zusammensetzung", () => {
    // ventiuno / ventiotto wären falsch
    expect(zahlwortIt(21)).not.toBe("ventiuno");
    expect(zahlwortIt(28)).not.toBe("ventiotto");
    // der Akzent steht am Ende, nicht in der Mitte - und `tre` allein/in trecento/tremila bleibt ohne
    expect(zahlwortIt(3)).toBe("tre");
    expect(zahlwortIt(300)).toBe("trecento");
    expect(zahlwortIt(3000)).toBe("tremila");
    expect(zahlwortIt(23000)).toBe("ventitremila");
    expect(zahlwortIt(23)).toBe("ventitré");
    // Elision nur bei `cento`, nicht bei `mille`/`mila`
    expect(zahlwortIt(1080)).toBe("milleottanta");
    expect(zahlwortIt(2008)).toBe("duemilaotto");
  });

  it("jede Zahl von 0 bis 1.000: nur Kleinbuchstaben a-z und ein Akzent (é) ganz am Ende, kein Leerzeichen, kein Bindestrich, kein „e“", () => {
    for (let n = 0; n <= 1000; n++) {
      const w = zahlwortIt(n);
      expect(/^[a-zé ]+$/.test(w), `${n}: ${w}`).toBe(true);
      expect(w.slice(0, -1).includes("é"), `${n}: ${w} (Akzent nicht am Ende)`).toBe(false);
      if (n !== 1000000) expect(w.includes(" "), `${n}: ${w}`).toBe(false);
      expect(w.includes("-"), `${n}: ${w}`).toBe(false);
    }
  });

  it("jede Zahl hat ein ANDERES Wort (keine Verwechslung, die ein Kind nicht auflösen kann)", () => {
    const gesehen = new Map<string, number>();
    for (let n = 0; n <= 20000; n++) {
      const w = zahlwortIt(n);
      expect(gesehen.has(w), `${n} und ${gesehen.get(w)}: ${w}`).toBe(false);
      gesehen.set(w, n);
    }
  });

  it("endet nur dann auf `tré`, wenn die Zahl auf 3 endet (und nicht auf 13)", () => {
    for (let n = 4; n <= 5000; n++) {
      const w = zahlwortIt(n);
      expect(w.endsWith("tré"), `${n}: ${w}`).toBe(n % 10 === 3 && n % 100 !== 13);
    }
  });

  it("die Grenzen: 1.000.000 ist die grösste Zahl, darüber, unter 0 und Bruchzahlen werfen", () => {
    expect(MAX_ZAHL_IT).toBe(1_000_000);
    expect(() => zahlwortIt(1_000_001)).toThrow(RangeError);
    expect(() => zahlwortIt(-1)).toThrow(RangeError);
    expect(() => zahlwortIt(1.5)).toThrow(RangeError);
  });

  it("der allgemeine `zahlwort(n, \"it\")` wirft ausdrücklich und nennt die richtige Funktion (kein stilles Deutsch)", () => {
    expect(() => zahlwort(41, "it")).toThrow(/zahlwortIt/);
    // de und en wie vorher
    expect(zahlwort(43, "de")).toBe("dreiundvierzig");
    expect(zahlwort(43, "en")).toBe("forty-three");
  });
});

describe("Zahlendiktat auf Weg it: seit F8 angeboten, mit italienischen Zahlwörtern", () => {
  const alleTasten = [..."abcdefghijklmnopqrstuvwxyzàèéìòù'0123456789.,"];
  const ctx = (ueber: Partial<FormKontext> = {}): FormKontext => ({
    lernweg: "it",
    introduced: alleTasten,
    shift: true,
    oneHand: false,
    stufe: "teens",
    lang: "it",
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

  it("die Form wird angeboten und fragt italienisch - die Zahlwörter sind italienisch, die Rahmen auch", () => {
    expect(zahlendiktat.taugt(ctx())).toBe(true);
    const aufgaben = zahlendiktat.fragen!(ctx());
    expect(aufgaben.length).toBeGreaterThan(3);
    for (const a of aufgaben) {
      const text = `${a.frage} ${a.antworten.join(" ")}`;
      expect(text, text).not.toMatch(/[äöüß]/);
      // jede Frage mit Zahlwort trägt ein italienisches Zahlwort (aus der Tabelle der Funktion, nie „einundvierzig“)
      const zahlen = new Set(Array.from({ length: 90 }, (_, i) => zahlwortIt(i + 10)));
      const woerter = [...a.antworten, a.frage.replace(/^.*: /, "").replace(/\.$/, "")];
      expect(woerter.some((w) => zahlen.has(w) || /^\d+$/.test(w)), a.frage).toBe(true);
    }
  });

  it("ohne die Taste é wird `ventitré` nie als ANTWORT verlangt - eine unlösbare Aufgabe gibt es nicht (hören darf das Kind es)", () => {
    const ohneE = alleTasten.filter((c) => c !== "é");
    const aufgaben = zahlendiktat.fragen!(ctx({ introduced: ohneE }));
    expect(aufgaben.length).toBeGreaterThan(3);
    for (const a of aufgaben) for (const antwort of a.antworten) expect(antwort, antwort).not.toMatch(/tré/);
    // die Gegenprobe: MIT é kommt ein Zahlwort auf `tré` als Antwort vor
    const mit = Array.from({ length: 12 }, (_, i) =>
      zahlendiktat.fragen!(ctx({ zufall: (() => { let s = i + 1; return () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }; })() })),
    ).flat();
    expect(mit.some((a) => a.antworten.some((w) => /tré$/.test(w)))).toBe(true);
  });

  it("pl, tr, cs: das Zahlendiktat wird angeboten (pl seit F8-pl `zahlwortPl`, tr seit F8-tr `zahlwortTr`, cs seit F8-cs `zahlwortCs`: tests/tastenflow-zahlwort-{pl,tr,cs}.test.ts)", () => {
    for (const s of ["pl", "tr", "cs"] as const) {
      expect(zahlendiktat.taugt(ctx({ lang: s, lernweg: s })), s).toBe(true);
    }
  });
});

describe("zahl(n, \"it\"): vierstellige Zahlen MIT Tausenderpunkt (Glossar §4 Nr. 9), alle anderen Sprachen wie vorher", () => {
  it("1.234, 12.345,5 - Punkt für Tausender, Komma für Dezimalen; unter 1.000 unverändert", () => {
    expect(zahl(1234, "it")).toBe("1.234");
    expect(zahl(12345.5, "it")).toBe("12.345,5");
    expect(zahl(999, "it")).toBe("999");
    expect(zahl(1000000, "it")).toBe("1.000.000");
    expect(zahl(0, "it")).toBe("0");
  });

  it("Spanisch bleibt bei „1234“ (RAE), Deutsch und Englisch wie vorher", () => {
    expect(zahl(1234, "es")).toBe(new Intl.NumberFormat("es-ES").format(1234));
    expect(zahl(1234, "es")).toBe("1234");
    expect(zahl(1234, "de")).toBe(new Intl.NumberFormat("de-AT").format(1234));
    expect(zahl(1234, "en")).toBe("1,234");
    expect(zahl(1234, "fr")).toBe(new Intl.NumberFormat("fr-FR").format(1234));
  });
});
