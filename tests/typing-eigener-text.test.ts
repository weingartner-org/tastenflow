/**
 * WÄCHTER über `lib/typing/eigenerText.ts` (17.09.2026) - die reinen
 * Funktionen, die aus einer hochgeladenen Datei tippbare Zeilen machen.
 *
 * Was hier bewiesen werden muss: dass eine typische Word-Autokorrektur (–
 * „ " …) sauber geglättet wird, dass danach übrig bleibende untippbare
 * Zeichen zuverlässig GEFUNDEN werden (nichts fällt durch), dass Gross-/
 * Kleinschreibung dabei keine Rolle spielt, und dass der Wortumbruch nie ein
 * Wort zerschneidet.
 */
import { describe, it, expect } from "vitest";
import {
  ZEILE_ZIEL_STANDARD,
  entferneUntippbareZeichen,
  glaetteZeichen,
  untippbareZeichen,
  verarbeiteEigenenText,
  zeileUmbrechen,
} from "@/lib/typing/eigenerText";

describe("glaetteZeichen", () => {
  it("führt typografische Zeichen auf ihr tippbares Gegenstück zurück", () => {
    const { text, ersetzt } = glaetteZeichen(
      "Das ist – so „gemeint“ – und «so» auch, ‚mit' Auslassung …",
    );
    expect(text).toBe('Das ist - so "gemeint" - und "so" auch, \'mit\' Auslassung ...');
    expect(ersetzt).toContain("–"); // –
    expect(ersetzt).toContain("…"); // …
  });

  it("lässt einen Text ohne Sonderzeichen unverändert, ersetzt nichts", () => {
    const { text, ersetzt } = glaetteZeichen("Ein ganz normaler Satz, mit Komma.");
    expect(text).toBe("Ein ganz normaler Satz, mit Komma.");
    expect(ersetzt).toEqual([]);
  });

  it("vereinheitlicht Windows- und Mac-Zeilenenden auf \\n", () => {
    expect(glaetteZeichen("eins\r\nzwei\rdrei").text).toBe("eins\nzwei\ndrei");
  });

  it("macht aus geschütztem Leerzeichen und Tabulator ein normales Leerzeichen", () => {
    expect(glaetteZeichen("a b\tc").text).toBe("a b c");
  });

  it("★★★ entfernt unsichtbare Formzeichen (Variationsselektor) OHNE sie zu melden - gemessen an einem echten Emoji im Browser (17.09.2026)", () => {
    // 🌬️ ist zwei Codepunkte: das Emoji + U+FE0F (Emoji-Darstellung erzwingen).
    // Ohne Sonderbehandlung tauchte U+FE0F als eigener, leer wirkender Eintrag
    // in der Zeichen-Liste auf - für sich genommen ist es nie ein Anschlag.
    const { text, ersetzt } = glaetteZeichen("Wind️ und Zug‍vogel");
    expect(text).toBe("Wind und Zugvogel");
    expect(ersetzt).not.toContain("️");
    expect(ersetzt).not.toContain("‍");
  });
});

describe("untippbareZeichen", () => {
  it("meldet nichts für einen Text aus reinen Tastatur-Zeichen", () => {
    expect(
      untippbareZeichen("Alle Buchstaben, Ziffern 0123, und (Klammern)!", { verbietenSs: true }),
    ).toEqual([]);
  });

  it("Gross-/Kleinschreibung ist egal - ein gelernter Buchstabe ist es in jeder Form", () => {
    expect(untippbareZeichen("ABC Grosse Buchstaben", { verbietenSs: true })).toEqual([]);
  });

  it("findet ein Zeichen, das auf keiner Taste liegt", () => {
    expect(untippbareZeichen("Café", { verbietenSs: true })).toEqual(["é"]);
    expect(untippbareZeichen("Ein Smiley 🙂 mitten im Text", { verbietenSs: true })).toEqual([
      "🙂",
    ]);
  });

  it("meldet jedes untippbare Zeichen nur einmal, in der Reihenfolge des ersten Auftretens", () => {
    expect(untippbareZeichen("é é é ñ é", { verbietenSs: true })).toEqual(["é", "ñ"]);
  });

  it("ß: gemeldet nur, wenn verbietenSs gesetzt ist (Tippchallenge ja, Eigene Übung nein)", () => {
    expect(untippbareZeichen("Straße", { verbietenSs: true })).toEqual(["ß"]);
    expect(untippbareZeichen("Straße", { verbietenSs: false })).toEqual([]);
  });

  it("der Zeilentrenner \\n zählt nie als untippbares Zeichen", () => {
    expect(untippbareZeichen("erste Zeile\nzweite Zeile", { verbietenSs: true })).toEqual([]);
  });
});

describe("zeileUmbrechen", () => {
  it("lässt einen kurzen Text auf einer Zeile", () => {
    expect(zeileUmbrechen("Ein kurzer Satz.")).toEqual(["Ein kurzer Satz."]);
  });

  it("bricht auf Wortgrenzen um, keine Zeile deutlich über dem Ziel", () => {
    const lang = Array.from({ length: 20 }, (_, i) => `Wort${i}`).join(" ");
    const zeilen = zeileUmbrechen(lang, 20);
    expect(zeilen.length).toBeGreaterThan(1);
    for (const z of zeilen) expect(z.length).toBeLessThanOrEqual(20 + "Wort19".length);
    // Kein Wort geht verloren oder wird zerschnitten.
    expect(zeilen.join(" ").split(/\s+/)).toEqual(lang.split(" "));
  });

  it("ein einzelnes Wort länger als das Ziel bekommt trotzdem eine eigene Zeile, wird nicht zerschnitten", () => {
    const wort = "Donaudampfschifffahrtsgesellschaftskapitaen";
    expect(zeileUmbrechen(`kurz ${wort} kurz`, 10)).toEqual(["kurz", wort, "kurz"]);
  });

  it("eine Leerzeile trennt Absätze auch über die Zielbreite hinweg", () => {
    expect(zeileUmbrechen("Erster Absatz.\n\nZweiter Absatz.", 100)).toEqual([
      "Erster Absatz.",
      "Zweiter Absatz.",
    ]);
  });

  it("die Standardzielbreite liegt im Rahmen der bestehenden Prüfungsniveaus (20-40 Zeichen)", () => {
    expect(ZEILE_ZIEL_STANDARD).toBeGreaterThanOrEqual(20);
    expect(ZEILE_ZIEL_STANDARD).toBeLessThanOrEqual(40);
  });
});

describe("entferneUntippbareZeichen", () => {
  it("entfernt genau die verbotenen Zeichen und zieht doppelte Lücken zusammen", () => {
    expect(entferneUntippbareZeichen(["Café au 🙂 lait"], new Set(["é", "🙂"]))).toEqual([
      "Caf au lait",
    ]);
  });

  it("lässt Zeilen ohne verbotene Zeichen unverändert", () => {
    expect(entferneUntippbareZeichen(["ganz normal"], new Set(["é"]))).toEqual(["ganz normal"]);
  });

  it("ohne verbotene Zeichen wird gar nichts angefasst (auch keine Lücken zusammengezogen)", () => {
    expect(entferneUntippbareZeichen(["a  b"], new Set())).toEqual(["a  b"]);
  });
});

describe("verarbeiteEigenenText", () => {
  it("★ die ganze Kette: glätten, melden, umbrechen", () => {
    const ergebnis = verarbeiteEigenenText("Ein Café – mit „Stil“ …", { verbietenSs: true });
    expect(ergebnis.ersetzt.length).toBeGreaterThan(0); // – „ “ … wurden geglättet
    expect(ergebnis.unbekannt).toEqual(["é"]); // bleibt nach dem Glätten übrig
    expect(ergebnis.zeilen.join(" ")).toContain("Café");
    expect(ergebnis.zeichenGesamt).toBeGreaterThan(0);
  });

  it("eine leere Datei ergibt eine leere Zeilenliste, keinen Fehler", () => {
    const ergebnis = verarbeiteEigenenText("", { verbietenSs: true });
    expect(ergebnis.zeilen).toEqual([]);
    expect(ergebnis.zeichenGesamt).toBe(0);
  });
});
