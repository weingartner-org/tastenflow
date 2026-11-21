/**
 * WÄCHTER über den VERGLEICH für „Freies Schreiben" (23.09.2026).
 *
 * ★★★ Was dieser Wächter beweist - und was er NICHT beweist.
 *
 * Er prüft nicht, ob k = 50 die richtige Gewichtung ist (das ist eine
 * Entscheidung, `BAUPLAN-2026-09-23-FREIES-SCHREIBEN.md` §7) - sondern die
 * REGELN aus dem Bauplan §3 und der `RECHERCHE-2026-09-10-TASTSCHREIB-WERTUNG.md`,
 * eine nach der anderen:
 *
 *  1. Ausrichtung über den WORTSTROM, nicht Zeile für Zeile - ein Fehler an
 *     einer Zeilengrenze darf die nächste Zeile nicht anstecken.
 *  2. Die vier Fehlerarten inklusive der beiden Leerzeichen-Übergänge
 *     (zusammengeschrieben / auseinandergerissen).
 *  3. Die Intersteno-Regel: das letzte getippte Wort UND alles, was danach im
 *     Soll noch käme, zählt nie als Fehler.
 *  4. `zeichen` zählt nur gewertete Ist-Wörter - überzählige zählen nie mit,
 *     unabhängig davon, ob sie einen Fehler auslösen.
 *  5. Nie werfen - auch nicht bei leeren oder ungleich langen Eingaben.
 *  6. Das Band bleibt schnell genug für 3000 Wörter.
 */
import { describe, it, expect } from "vitest";
import { performance } from "node:perf_hooks";
import { vergleicheFrei } from "@/lib/typing/freiVergleich";

describe("Grundfälle", () => {
  it("fehlerfreier Text ergibt null Fehler", () => {
    const r = vergleicheFrei(
      ["der hund bellt", "die katze schläft"],
      ["der hund bellt", "die katze schläft"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(0);
    expect(r.stellen).toEqual([]);
    // der(4) hund(5) bellt(6) die(4) katze(6) schläft(8)
    expect(r.zeichen).toBe(33);
  });

  it("ein Tippfehler in einem Wort ergibt einen Fehler", () => {
    const r = vergleicheFrei(
      ["der hund bellt laut"],
      ["der hond bellt laut"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(1);
    expect(r.stellen).toEqual([{ zeile: 0, soll: "hund", ist: "hond", art: "falsch" }]);
    expect(r.zeichen).toBe(20); // der(4) hond(5) bellt(6) laut(5)
  });

  it("zwei Tippfehler im selben Wort zählen als EIN Fehler", () => {
    // "hund" -> "hnud": zwei Buchstaben vertauscht, aber es ist immer noch nur
    // EIN Soll-Wort, das nicht passt - der Vergleich zählt wortweise, nicht
    // buchstabenweise.
    const r = vergleicheFrei(
      ["der hund bellt laut"],
      ["der hnud bellt laut"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(1);
    expect(r.fehlerArten.falsch).toBe(1);
  });

  it("ein fehlendes Wort ergibt einen Fehler der Art 'fehlend'", () => {
    const r = vergleicheFrei(
      ["der hund bellt laut"],
      ["der bellt laut"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(1);
    expect(r.stellen).toEqual([{ zeile: 0, soll: "hund", ist: "", art: "fehlend" }]);
    expect(r.zeichen).toBe(15); // der(4) bellt(6) laut(5)
  });

  it("ein überzähliges Wort ist ein Fehler, zählt aber NICHT als Zeichen", () => {
    const r = vergleicheFrei(
      ["der hund bellt"],
      ["der kleine hund bellt"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(1);
    expect(r.stellen).toEqual([{ zeile: 0, soll: "", ist: "kleine", art: "ueberzaehlig" }]);
    // "kleine" fehlt in der Summe - nur der(4) hund(5) bellt(6) zählen.
    expect(r.zeichen).toBe(15);
  });

  it("vertauschte Wörter zählen als ZWEI Fehler", () => {
    // Der Tausch steht bewusst NICHT am Textende (sonst griffe die
    // Intersteno-Regel für das letzte Wort und schluckte einen der beiden
    // Fehler) - "bellt laut" dahinter bleibt fehlerfrei.
    const r = vergleicheFrei(
      ["hund katze bellt laut"],
      ["katze hund bellt laut"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(2);
    expect(r.stellen).toEqual([
      { zeile: 0, soll: "hund", ist: "katze", art: "falsch" },
      { zeile: 0, soll: "katze", ist: "hund", art: "falsch" },
    ]);
  });
});

describe("Leerzeichen-Fehler", () => {
  it("zwei Soll-Wörter zusammengeschrieben ('dasist') ergeben EINEN Fehler", () => {
    const r = vergleicheFrei(["das ist gut"], ["dasist gut"], { grossKleinEgal: false });
    expect(r.fehler).toBe(1);
    expect(r.stellen).toEqual([{ zeile: 0, soll: "das ist", ist: "dasist", art: "leerzeichen" }]);
    expect(r.zeichen).toBe(11); // dasist(7) gut(4)
  });

  it("ein Soll-Wort auseinandergerissen ('da s') ergibt EINEN Fehler", () => {
    const r = vergleicheFrei(["das ist gut"], ["da s ist gut"], { grossKleinEgal: false });
    expect(r.fehler).toBe(1);
    expect(r.stellen).toEqual([{ zeile: 0, soll: "das", ist: "da s", art: "leerzeichen" }]);
    expect(r.zeichen).toBe(13); // da(3) s(2) ist(4) gut(4)
  });
});

describe("Gross/klein", () => {
  it("Gross/klein ist ohne die Option ein Fehler", () => {
    const r = vergleicheFrei(
      ["Der Hund bellt schnell heute"],
      ["der Hund bellt schnell heute"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(1);
    expect(r.stellen).toEqual([{ zeile: 0, soll: "Der", ist: "der", art: "falsch" }]);
  });

  it("mit grossKleinEgal verschwindet derselbe Fehler", () => {
    const r = vergleicheFrei(
      ["Der Hund bellt schnell heute"],
      ["der Hund bellt schnell heute"],
      { grossKleinEgal: true },
    );
    expect(r.fehler).toBe(0);
  });

  it("grossKleinEgal funktioniert auch mit Umlauten", () => {
    const streng = vergleicheFrei(
      ["Mädchen läuft schnell heute"],
      ["mädchen läuft schnell heute"],
      { grossKleinEgal: false },
    );
    expect(streng.fehler).toBe(1);
    const milde = vergleicheFrei(
      ["Mädchen läuft schnell heute"],
      ["mädchen läuft schnell heute"],
      { grossKleinEgal: true },
    );
    expect(milde.fehler).toBe(0);
  });
});

describe("Zeilen und das Textende", () => {
  it("ein Fehler an einer Zeilengrenze wirkt NICHT in die nächste Zeile weiter", () => {
    // Zeile 0 fehlt das letzte Wort ("bellt") - Zeile 1 ist komplett richtig
    // und muss es auch bleiben.
    const r = vergleicheFrei(
      ["der hund bellt", "die katze schläft leise"],
      ["der hund", "die katze schläft leise"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(1);
    expect(r.stellen).toEqual([{ zeile: 0, soll: "bellt", ist: "", art: "fehlend" }]);
    expect(r.stellen.some((s) => s.zeile === 1)).toBe(false);
  });

  it("eine übersprungene Zeile ergibt 'fehlend' für jedes ihrer Wörter", () => {
    const r = vergleicheFrei(
      ["der hund bellt", "die katze schläft", "der vogel singt"],
      ["der hund bellt", "", "der vogel singt"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(3);
    expect(r.stellen.every((s) => s.art === "fehlend" && s.zeile === 1)).toBe(true);
    expect(r.stellen.map((s) => s.soll)).toEqual(["die", "katze", "schläft"]);
  });

  it("ein angefangenes letztes Wort zählt NIE als Fehler", () => {
    const r = vergleicheFrei(["der hund bellt"], ["der hund bel"], { grossKleinEgal: false });
    expect(r.fehler).toBe(0);
    expect(r.stellen).toEqual([]);
    expect(r.zeichen).toBe(13); // der(4) hund(5) bel(4) - getippt wurde es ja
  });

  it("Soll-Wörter HINTER dem letzten getippten Wort zählen nicht als 'fehlend'", () => {
    // Das Kind ist nach "hund" mit der Zeit fertig - "bellt laut heute" waren
    // nie erreichbar und dürfen nicht wie drei liegen gebliebene Fehler aussehen.
    const r = vergleicheFrei(
      ["der hund bellt laut heute"],
      ["der hund"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(0);
    expect(r.stellen).toEqual([]);
    expect(r.zeichen).toBe(9); // der(4) hund(5)
  });

  it("wurde GAR NICHTS getippt, zählt ebenfalls nichts als 'fehlend'", () => {
    // Dieselbe Regel, nur am Anfang statt am Ende: ohne ein einziges
    // getipptes Wort gibt es keinen Ankerpunkt, an dem "das Kind war schon
    // da" gelten könnte.
    const r = vergleicheFrei(["der hund bellt laut heute"], [""], { grossKleinEgal: false });
    expect(r.fehler).toBe(0);
    expect(r.stellen).toEqual([]);
    expect(r.zeichen).toBe(0);
  });

  it("ein angefangenes letztes Wort passt NICHT nur in der letzten Zeile", () => {
    // Abnahme-Befund 23.09.2026: "Nehmen Sie" gegen das abgeschnittene "Nehm"
    // ist ein Gleichstand in der reinen Kosten-Rechnung (falsch+Rest löschen
    // kostet genau so viel wie löschen+falsch), und die Ausrichtung darf sich
    // dabei NICHT für die falsche Deutung entscheiden ("Nehmen" fehlend,
    // "Sie" falsch gegen "Nehm") - richtig ist: "Nehm" ist der Anfang von
    // "Nehmen", das zählt wie ein Treffer, und "Sie" danach ist unerreichbar.
    const r = vergleicheFrei(
      [
        "Überlegen Sie grundsätzlich, welche",
        "Arbeit den Vorrang hat. Stellen Sie,",
        "wenn nötig, eine Rang- und",
        "Dringlichkeitsliste auf. Nehmen Sie",
      ],
      [
        "Überlegen Sie grundsätzlich welche",
        "Arbeit den Vorrang hat. Stellen",
        "wenn nötig,eine Rang- und und",
        "Dringlichkeitsliste auf. Nehm",
      ],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(4);
    expect(r.fehlerArten).toEqual({ falsch: 1, fehlend: 1, ueberzaehlig: 1, leerzeichen: 1 });
    expect(r.stellen).toEqual([
      { zeile: 0, soll: "grundsätzlich,", ist: "grundsätzlich", art: "falsch" },
      { zeile: 1, soll: "Sie,", ist: "", art: "fehlend" },
      { zeile: 2, soll: "nötig, eine", ist: "nötig,eine", art: "leerzeichen" },
      { zeile: 2, soll: "", ist: "und", art: "ueberzaehlig" },
    ]);
    // Zeile 3 ("Nehmen Sie" gegen "Nehm") bleibt vollständig fehlerfrei.
    expect(r.stellen.some((s) => s.zeile === 3)).toBe(false);
  });

  it("ein Wortanfang als letztes Ist-Wort zählt wie ein Treffer - keine Stelle danach", () => {
    // Derselbe Fall isoliert: "Nehme" ist der Anfang von "Nehmen", darum ist
    // die ganze Zeile fehlerfrei - auch "Sie", das danach nie mehr kam.
    const r = vergleicheFrei(
      ["Dringlichkeitsliste auf. Nehmen Sie"],
      ["Dringlichkeitsliste auf. Nehme"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(0);
    expect(r.stellen).toEqual([]);
  });

  it("bei Gleichstand gewinnt die GLEICHE Zeile - Abnahme-Befund 23.09.2026, Zeile 20", () => {
    // Nachgestellter Fall: "und" steht am Ende von Zeile 20 UND am Anfang von
    // Zeile 21. Das Kind hat es in Zeile 20 zu viel getippt - Zeile 21 selbst
    // ist danach wieder wortgleich mit dem Soll. Rein kostenmässig ist das ein
    // Gleichstand: "das überzählige 'und' steht in Zeile 20" kostet genau so
    // viel wie "es steht in Zeile 21" (dafür reisst dann ein TREFFER über die
    // Zeilengrenze). Ohne die zweite, nachrangige Kostenstufe (Regel: gleiche
    // Zeile bevorzugen) landete die Stelle in der Lehrkraft-Ansicht in der
    // falschen Zeile.
    const soll: string[] = [];
    const ist: string[] = [];
    for (let z = 0; z < 20; z += 1) {
      soll.push(`fuellzeile${z} eins zwei drei vier`);
      ist.push(`fuellzeile${z} eins zwei drei vier`);
    }
    soll.push("genau und selbstkritisch das ist"); // Zeile 20
    soll.push("und selbstkritisch das ist die"); // Zeile 21
    ist.push("genau und selbstkritisch das ist und"); // Zeile 20, "und" zu viel
    ist.push("und selbstkritisch das ist die"); // Zeile 21, unverändert

    const r = vergleicheFrei(soll, ist, { grossKleinEgal: false });
    expect(r.fehler).toBe(1);
    expect(r.stellen).toEqual([{ zeile: 20, soll: "", ist: "und", art: "ueberzaehlig" }]);
  });
});

describe("Tokenisierung", () => {
  it("Satzzeichen gehören zum Wort", () => {
    const r = vergleicheFrei(
      ["Schön, sagte sie leise heute"],
      ["Schon sagte sie leise heute"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(1);
    expect(r.stellen).toEqual([{ zeile: 0, soll: "Schön,", ist: "Schon", art: "falsch" }]);
  });

  it("mehrfache Leerzeichen zählen als EIN Trenner", () => {
    const r = vergleicheFrei(
      ["der   hund     bellt"],
      ["der hund bellt"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(0);
    expect(r.zeichen).toBe(15);
  });

  it("Umlaute und ß werden NICHT automatisch gleichgesetzt", () => {
    // Anders als beim Kürzel-Prüfer (antwortPruefer.ts) gibt es hier keine
    // Umschrift-Milde - "Straße" und "Strasse" sind zwei verschiedene Wörter.
    const r = vergleicheFrei(
      ["Die Straße ist lang und schön heute"],
      ["Die Strasse ist lang und schön heute"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(1);
    expect(r.stellen).toEqual([{ zeile: 0, soll: "Straße", ist: "Strasse", art: "falsch" }]);
  });
});

describe("Randfälle bei den Eingaben - nie werfen", () => {
  it("zwei leere Arrays ergeben ein leeres Ergebnis", () => {
    const r = vergleicheFrei([], [], { grossKleinEgal: false });
    expect(r).toEqual({
      zeichen: 0,
      fehler: 0,
      fehlerArten: { falsch: 0, fehlend: 0, ueberzaehlig: 0, leerzeichen: 0 },
      stellen: [],
    });
  });

  it("je eine leere Zeile ergibt ebenfalls ein leeres Ergebnis", () => {
    const r = vergleicheFrei([""], [""], { grossKleinEgal: false });
    expect(r.fehler).toBe(0);
    expect(r.zeichen).toBe(0);
  });

  it("Ist KÜRZER als Soll: die fehlenden Zeilen zählen wie das Textende", () => {
    const r = vergleicheFrei(
      ["erste zeile hier", "zweite zeile hier", "dritte zeile hier"],
      ["erste zeile hier"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(0);
    expect(r.zeichen).toBe(17); // erste(6) zeile(6) hier(5)
  });

  it("Ist LÄNGER als Soll: die überschüssigen Zeilen werden ignoriert", () => {
    const r = vergleicheFrei(
      ["erste zeile hier"],
      ["erste zeile hier", "zusatz zeile die ignoriert wird"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(0);
    // Die zweite Zeile taucht nirgends auf - auch nicht als "ueberzaehlig".
    expect(r.zeichen).toBe(17);
  });
});

describe("Zeichen-Zählung", () => {
  it("ein Handbeispiel nachgerechnet", () => {
    // Der Hund bellt laut heute  ⇒  Der Hund bellt sehr heute
    // Ein Fehler ("laut" -> "sehr"), sonst alles gleich.
    const r = vergleicheFrei(
      ["Der Hund bellt laut heute"],
      ["Der Hund bellt sehr heute"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(1);
    // Der(4) Hund(5) bellt(6) sehr(5) heute(6) = 26
    expect(r.zeichen).toBe(26);
  });

  it("die Anzahl der Fehler-Stellen stimmt IMMER mit `fehler` überein", () => {
    const r = vergleicheFrei(
      ["Der Hund bellt laut heute", "Die Katze schläft ganz ruhig immer"],
      ["Der Hond bellt heute", "Die kleine Katze schläft ganzruhig immer"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(r.stellen.length);
  });
});

describe("Alle vier Fehlerarten in einem Lauf", () => {
  // Zeile 0: "Hund"->"Hond" (falsch), "laut" fehlt (fehlend).
  // Zeile 1: "kleine" ist zu viel (ueberzaehlig), "ganz ruhig"->"ganzruhig"
  //          (leerzeichen). "immer" am Schluss bleibt bewusst unangetastet,
  //          damit keiner der vier Fehler an der Intersteno-Schwelle hängt.
  const r = vergleicheFrei(
    ["Der Hund bellt laut heute", "Die Katze schläft ganz ruhig immer"],
    ["Der Hond bellt heute", "Die kleine Katze schläft ganzruhig immer"],
    { grossKleinEgal: false },
  );

  it("zählt vier Fehler, einen je Art", () => {
    expect(r.fehler).toBe(4);
    expect(r.fehlerArten).toEqual({ falsch: 1, fehlend: 1, ueberzaehlig: 1, leerzeichen: 1 });
  });

  it("steht in TEXTREIHENFOLGE, nicht in Fund-Reihenfolge der Arten", () => {
    expect(r.stellen.map((s) => s.art)).toEqual(["falsch", "fehlend", "ueberzaehlig", "leerzeichen"]);
  });

  it("jede Stelle trägt die richtige Zeile - 'ueberzaehlig' die IST-Zeile", () => {
    expect(r.stellen.map((s) => s.zeile)).toEqual([0, 0, 1, 1]);
  });

  it("die Wortpaare selbst stimmen", () => {
    expect(r.stellen[0]).toEqual({ zeile: 0, soll: "Hund", ist: "Hond", art: "falsch" });
    expect(r.stellen[1]).toEqual({ zeile: 0, soll: "laut", ist: "", art: "fehlend" });
    expect(r.stellen[2]).toEqual({ zeile: 1, soll: "", ist: "kleine", art: "ueberzaehlig" });
    expect(r.stellen[3]).toEqual({
      zeile: 1,
      soll: "ganz ruhig",
      ist: "ganzruhig",
      art: "leerzeichen",
    });
  });

  it("zeichen zählt nur die gewerteten Ist-Wörter (ohne 'kleine')", () => {
    expect(r.zeichen).toBe(55);
  });
});

describe("Reihenfolge der Stellen über mehrere Zeilen", () => {
  it("drei Fehler in drei Zeilen erscheinen in Textreihenfolge", () => {
    const r = vergleicheFrei(
      ["Der Hund bellt laut", "Die Katze schläft ruhig", "Der Vogel singt schön heute"],
      ["Der Hond bellt laut", "Die Katze schlaeft ruhig", "Der Vogel singt schoen heute"],
      { grossKleinEgal: false },
    );
    expect(r.fehler).toBe(3);
    expect(r.stellen.map((s) => s.zeile)).toEqual([0, 1, 2]);
    expect(r.stellen.map((s) => [s.soll, s.ist])).toEqual([
      ["Hund", "Hond"],
      ["schläft", "schlaeft"],
      ["schön", "schoen"],
    ]);
  });
});

describe("Leistung", () => {
  it("3000 Wörter mit 30 Fehlern bleiben unter 200 ms", () => {
    const GESAMT = 3000;
    const ZEILENLAENGE = 15;
    const FEHLERANZAHL = 30;

    const sollFlat: string[] = [];
    for (let w = 0; w < GESAMT; w += 1) sollFlat.push(`wort${w}`);
    const istFlat = [...sollFlat];
    // Gleichmässig verteilt, nie am allerletzten Wort (sonst schluckte die
    // Intersteno-Regel einen der 30 Fehler und die Zählung stimmte nicht mehr).
    for (let f = 0; f < FEHLERANZAHL; f += 1) {
      const idx = Math.floor(((f + 1) * GESAMT) / (FEHLERANZAHL + 1));
      istFlat[idx] = `${istFlat[idx]}X`;
    }
    const zuZeilen = (flat: string[]): string[] => {
      const zeilen: string[] = [];
      for (let i = 0; i < flat.length; i += ZEILENLAENGE) {
        zeilen.push(flat.slice(i, i + ZEILENLAENGE).join(" "));
      }
      return zeilen;
    };
    const soll = zuZeilen(sollFlat);
    const ist = zuZeilen(istFlat);

    const start = performance.now();
    const r = vergleicheFrei(soll, ist, { grossKleinEgal: false });
    const dauerMs = performance.now() - start;

    expect(r.fehler).toBe(FEHLERANZAHL);
    expect(dauerMs).toBeLessThan(200);
  });
});
