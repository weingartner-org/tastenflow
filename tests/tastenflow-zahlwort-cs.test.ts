/**
 * ★★★★★ WÄCHTER F8 Tschechisch (03.10.2026): `zahlwortCs` - die Zahlwörter 0 bis 1.000.000 - und die Zahlenschreibung `zahl(n, "cs")`.
 *
 * Vorbild: `tests/tastenflow-zahlwort-it.test.ts`. Regeln (siehe `zahlwort.ts`): GETRENNT geschrieben („dvacet jedna"); Zählform („jedna", „dva"),
 * 200 immer „dvě stě"; Hunderter stě/sta/set; Tausender „tisíc" (1.000), „dva/tři/čtyři tisíce" (nur das einfache 2-4), sonst „tisíc"
 * („pět tisíc", „dvacet dva tisíc", „sto dva tisíc"); vor „tisíc" „jeden" („dvacet jeden tisíc"); „milion" allein.
 * ⚠️ Die Tabelle ist gegen das Sprachwissen des Baus gelesen, NICHT von einer Person mit Tschechisch als Erstsprache - sie ist als
 * Tabelle da, damit sie jemand Zeile für Zeile gegenlesen kann (Prüfbericht P7).
 */
import { describe, expect, it } from "vitest";
import { MAX_ZAHL_CS, zahlwort, zahlwortCs } from "../src/lib/typing/zahlwort";
import { zahl } from "../src/lib/bedienSprache/texte";
import { zahlendiktat } from "../src/lib/typing/uebungsformen/zahlendiktat";
import type { FormKontext } from "../src/lib/typing/uebungsformen/typen";

describe("zahlwortCs: die Tabelle", () => {
  const TABELLE: readonly (readonly [number, string])[] = [
    [0, "nula"], [1, "jedna"], [2, "dva"], [3, "tři"], [4, "čtyři"], [5, "pět"], [6, "šest"], [7, "sedm"], [8, "osm"], [9, "devět"],
    [10, "deset"], [11, "jedenáct"], [12, "dvanáct"], [13, "třináct"], [14, "čtrnáct"], [15, "patnáct"], [16, "šestnáct"],
    [17, "sedmnáct"], [18, "osmnáct"], [19, "devatenáct"],
    [20, "dvacet"], [21, "dvacet jedna"], [22, "dvacet dva"], [23, "dvacet tři"], [24, "dvacet čtyři"], [28, "dvacet osm"], [29, "dvacet devět"],
    [30, "třicet"], [31, "třicet jedna"], [33, "třicet tři"], [38, "třicet osm"],
    [40, "čtyřicet"], [41, "čtyřicet jedna"], [43, "čtyřicet tři"], [50, "padesát"], [55, "padesát pět"],
    [60, "šedesát"], [67, "šedesát sedm"], [70, "sedmdesát"], [78, "sedmdesát osm"], [80, "osmdesát"], [88, "osmdesát osm"],
    [90, "devadesát"], [93, "devadesát tři"], [99, "devadesát devět"],
    [100, "sto"], [101, "sto jedna"], [102, "sto dva"], [103, "sto tři"], [110, "sto deset"], [111, "sto jedenáct"], [120, "sto dvacet"],
    [123, "sto dvacet tři"], [199, "sto devadesát devět"],
    [200, "dvě stě"], [201, "dvě stě jedna"], [222, "dvě stě dvacet dva"], [300, "tři sta"], [303, "tři sta tři"], [400, "čtyři sta"],
    [500, "pět set"], [600, "šest set"], [700, "sedm set"], [800, "osm set"], [900, "devět set"], [999, "devět set devadesát devět"],
    [1000, "tisíc"], [1001, "tisíc jedna"], [1002, "tisíc dva"], [1100, "tisíc sto"], [1234, "tisíc dvě stě třicet čtyři"],
    [2000, "dva tisíce"], [2001, "dva tisíce jedna"], [3000, "tři tisíce"], [4000, "čtyři tisíce"], [4999, "čtyři tisíce devět set devadesát devět"],
    [5000, "pět tisíc"], [10000, "deset tisíc"], [12000, "dvanáct tisíc"], [20000, "dvacet tisíc"], [21000, "dvacet jeden tisíc"],
    [22000, "dvacet dva tisíc"], [23000, "dvacet tři tisíc"], [21001, "dvacet jeden tisíc jedna"],
    [100000, "sto tisíc"], [101000, "sto jeden tisíc"], [102000, "sto dva tisíc"], [200000, "dvě stě tisíc"], [201000, "dvě stě jeden tisíc"],
    [999999, "devět set devadesát devět tisíc devět set devadesát devět"], [1000000, "milion"],
  ];

  it.each(TABELLE)("%i ⇒ %s", (n, wort) => {
    expect(zahlwortCs(n)).toBe(wort);
  });

  it("die Regeln einzeln: Zählform jedna/dva, 200 = dvě stě (nie dva sta), vor tisíc jeden, tisíce nur bei 2-4", () => {
    expect(zahlwortCs(1)).toBe("jedna");
    expect(zahlwortCs(21)).toBe("dvacet jedna");
    expect(zahlwortCs(21000)).toBe("dvacet jeden tisíc"); // Maskulinum vor `tisíc`
    expect(zahlwortCs(200)).not.toMatch(/dva sta|dvě sta/);
    expect(zahlwortCs(200)).toBe("dvě stě");
    expect(zahlwortCs(3)).toBe("tři");
    expect(zahlwortCs(300)).toBe("tři sta");
    expect(zahlwortCs(500)).toBe("pět set");
    // `tisíce` nur das einfache 2, 3, 4 - jede zusammengesetzte Zahl hat `tisíc`
    expect(zahlwortCs(2000)).toBe("dva tisíce");
    expect(zahlwortCs(22000)).toBe("dvacet dva tisíc");
    expect(zahlwortCs(102000)).toBe("sto dva tisíc");
    expect(zahlwortCs(1000)).toBe("tisíc");
  });

  it("jede Zahl von 0 bis 1.000: nur Kleinbuchstaben a-z und Zeichen des Weges (á č ď é ě í ň ó ř š ť ú ů ý ž), getrennt mit EINEM Leerzeichen, kein Bindestrich", () => {
    for (let n = 0; n <= 1000; n++) {
      const w = zahlwortCs(n);
      expect(/^[a-záčďéěíňóřšťúůýž]+( [a-záčďéěíňóřšťúůýž]+)*$/.test(w), `${n}: ${w}`).toBe(true);
      expect(w.includes("-"), `${n}: ${w}`).toBe(false);
      expect(/ {2}/.test(w), `${n}: ${w}`).toBe(false);
    }
  });

  it("jede Zahl hat ein ANDERES Wort (keine Verwechslung, die ein Kind nicht auflösen kann)", () => {
    const gesehen = new Map<string, number>();
    for (let n = 0; n <= 20000; n++) {
      const w = zahlwortCs(n);
      expect(gesehen.has(w), `${n} und ${gesehen.get(w)}: ${w}`).toBe(false);
      gesehen.set(w, n);
    }
  });

  it("jede Zahl bis 1.000.000 (Stichprobe in Schritten) liefert ein Wort ohne Fehler und ohne ungeschriebene Zeichen", () => {
    for (let n = 0; n <= MAX_ZAHL_CS; n += 997) {
      const w = zahlwortCs(n);
      expect(/^[a-záčďéěíňóřšťúůýž ]+$/.test(w), `${n}: ${w}`).toBe(true);
    }
  });

  it("endet nur dann auf `jedna`, wenn die Zahl auf 1 endet (und nicht auf 11)", () => {
    for (let n = 2; n <= 5000; n++) {
      const w = zahlwortCs(n);
      const sollJedna = n % 10 === 1 && n % 100 !== 11 && n % 1000 !== 0;
      expect(/ jedna$/.test(w), `${n}: ${w}`).toBe(sollJedna);
    }
  });

  it("die Grenzen: 1.000.000 ist die grösste Zahl, darüber, unter 0 und Bruchzahlen werfen", () => {
    expect(MAX_ZAHL_CS).toBe(1_000_000);
    expect(() => zahlwortCs(1_000_001)).toThrow(RangeError);
    expect(() => zahlwortCs(-1)).toThrow(RangeError);
    expect(() => zahlwortCs(1.5)).toThrow(RangeError);
  });

  it("der allgemeine `zahlwort(n, \"cs\")` wirft ausdrücklich und nennt die richtige Funktion (kein stilles Deutsch)", () => {
    expect(() => zahlwort(41, "cs")).toThrow(/zahlwortCs/);
    // de und en wie vorher
    expect(zahlwort(43, "de")).toBe("dreiundvierzig");
    expect(zahlwort(43, "en")).toBe("forty-three");
  });
});

describe("Zahlendiktat auf Weg cs: seit F8 angeboten, mit tschechischen Zahlwörtern", () => {
  const alleTasten = [..."abcdefghijklmnopqrstuvwxyzáčďéěíňóřšťúůýž0123456789.,"];
  const ctx = (ueber: Partial<FormKontext> = {}): FormKontext => ({
    lernweg: "cs",
    introduced: alleTasten,
    shift: true,
    oneHand: false,
    stufe: "teens",
    lang: "cs",
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

  it("die Form wird angeboten, und die Zahlwörter sind tschechisch (nie „einundvierzig“)", () => {
    expect(zahlendiktat.taugt(ctx())).toBe(true);
    const aufgaben = zahlendiktat.fragen!(ctx());
    expect(aufgaben.length).toBeGreaterThan(3);
    const zahlen = new Set(Array.from({ length: 90 }, (_, i) => zahlwortCs(i + 10)));
    for (const a of aufgaben) {
      const text = `${a.frage} ${a.antworten.join(" ")}`;
      expect(text, text).not.toMatch(/[äöüß]/);
      const woerter = [...a.antworten, a.frage.replace(/^.*: /, "").replace(/\.$/, "")];
      expect(woerter.some((w) => zahlen.has(w) || /^\d+$/.test(w)), a.frage).toBe(true);
    }
  });

  it("ohne die Taste ř wird `tři` nie als ANTWORT verlangt - eine unlösbare Aufgabe gibt es nicht", () => {
    const ohneR = alleTasten.filter((c) => c !== "ř");
    const aufgaben = zahlendiktat.fragen!(ctx({ introduced: ohneR }));
    expect(aufgaben.length).toBeGreaterThan(3);
    for (const a of aufgaben) for (const antwort of a.antworten) expect(antwort, antwort).not.toMatch(/ř/);
    // die Gegenprobe: MIT ř kommt ein Zahlwort mit ř als Antwort vor
    const mit = Array.from({ length: 12 }, (_, i) =>
      zahlendiktat.fragen!(ctx({ zufall: (() => { let s = i + 1; return () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }; })() })),
    ).flat();
    expect(mit.some((a) => a.antworten.some((w) => /ř/.test(w)))).toBe(true);
  });

  it("pl, tr: haben ihre Zahlwörter inzwischen ebenfalls (zahlwort-pl, zahlwort-tr) - mit cs gilt das für alle neuen Sprachen", () => {
    for (const s of ["pl", "tr"] as const) {
      expect(zahlendiktat.taugt(ctx({ lang: s, lernweg: s })), s).toBe(true);
    }
  });
});

describe("zahl(n, \"cs\"): Intl cs-CZ - Tausender mit geschütztem Leerzeichen, auch vierstellig (nur ANZEIGE, nie ein Text, den ein Kind abtippt)", () => {
  it("1 234 und 12 345,5 mit U+00A0; unter 1.000 unverändert", () => {
    expect(zahl(1234, "cs")).toBe("1 234");
    expect(zahl(12345.5, "cs")).toBe("12 345,5");
    expect(zahl(999, "cs")).toBe("999");
    expect(zahl(1000000, "cs")).toBe("1 000 000");
    expect(zahl(0, "cs")).toBe("0");
  });

  it("vor einem Vergleich mit dem, was ein Kind tippt (U+0020), muss normalisiert werden (Falle 9) - die Anzeige enthält kein normales Leerzeichen", () => {
    expect(zahl(1234, "cs").includes(" ")).toBe(false);
    expect(zahl(1234, "cs").replace(/ /g, " ")).toBe("1 234");
  });

  it("alle anderen Sprachen wie vorher: Italienisch mit Punkt, Spanisch ohne vierstellige Gruppierung, Deutsch und Englisch", () => {
    expect(zahl(1234, "it")).toBe("1.234");
    expect(zahl(1234, "es")).toBe("1234");
    expect(zahl(1234, "en")).toBe("1,234");
    expect(zahl(1234, "de")).toBe(new Intl.NumberFormat("de-AT").format(1234));
  });
});
