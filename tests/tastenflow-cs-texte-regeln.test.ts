/**
 * ★★★★★ WÄCHTER F5-cs (03.10.2026): DIE REGELN FÜR JEDE TSCHECHISCHE TEXTZEILE - schon heute scharf, obwohl der Korpus noch leer ist.
 *
 * Die Text-Chargen (Etappe T) schreiben die eigentlichen Zeilen; dieser Wächter steht VORHER da (Falle 58/59: der Fehlerkatalog gehört in
 * den Auftrag UND als Wächter in den Bau). Er prüft jede Zeile von `CORPUS_CS` und jeder tschechischen Serie gegen die Regeln aus
 * `corpusCs.ts` (Kopf), und hat seine Gegenproben: ein Wächter, der nichts findet, beweist nichts.
 *
 * Solange es keine Zeilen gibt, prüft er nur die Funktion {@link zeilenFehler} an Beispielen - sobald die erste Charge gemergt ist,
 * greift er ohne Änderung. Eine Regel kommt HIER hinein, wenn eine Charge gegen sie verstösst, nicht erst im Prüfbericht.
 * ⚠️ Er prüft die Regeln ohne `fruehSprossen`; die Wächter der frühen Chargen (vor `ˇ`) rufen `zeilenFehler(z, { fruehSprossen: true })`.
 */
import { describe, expect, it } from "vitest";
import { korpusFuer } from "../src/lib/typing/corpus";
import { SERIEN } from "../src/lib/typing/serien";
import { serieLines } from "../src/lib/typing/serie";
import { zeilenFehler } from "./helfer/csTextRegeln";

describe("zeilenFehler: die Regeln, an Beispielen mit Gegenprobe", () => {
  it("richtige Zeilen bestehen (Diakritika, Zahlen, gerade Anführung, Klammern)", () => {
    for (const z of [
      "Dnes je pátek a venku svítí slunce.",
      "Kolik je hodin? Je půl desáté, už musíme jít do školy.",
      "Maminka řekla: \"Pojď domů, večeře je hotová!\"",
      "V roce 2026 žije v Praze přes 1 300 000 lidí.",
      "Žába skočila do rybníka (byl hluboký) a zmizela.",
      "Sníh, led, déšť, mráz - zima je zase tady.",
      "Čeština má háček: ď, ť, ň, č, š, ř, ž, ě.",
    ]) expect(zeilenFehler(z), z).toEqual([]);
  });

  it("jede Regel findet ihren Fehler (Gegenprobe - sonst bewiese der Wächter nichts)", () => {
    const FALSCH: readonly (readonly [string, RegExp])[] = [
      ["Řekl: „Ahoj“ a odešel.", /typografisches Zeichen/],
      ["Je to tam… a pak ticho.", /typografisches Zeichen/],
      ["Praha – hlavní město.", /typografisches Zeichen/],
      ["Stálo to 1 234 korun.", /typografisches Zeichen/],
      ["Řekla ‚ano‘ a šla.", /typografisches Zeichen/],
      ["Ve škole se učí ä a ö.", /nicht im Zeichensatz/],
      ["Ale to bylo ŮŽASNÉ.", /Ů/],
      ["Je tam ůl a med.", /ů/],
      ["- Kam jdeš? zeptal se.", /Dialogstrich/],
      ["Kam jdeš ?", /Leerzeichen vor/],
      ["Je to tak , že ano.", /Leerzeichen vor/],
      ["Příliš  mnoho mezer.", /Leerzeichen/],
      ["Ten kurva dům.", /Sperrwort/],
    ];
    for (const [zeile, regel] of FALSCH) expect(zeilenFehler(zeile).join(" | "), zeile).toMatch(regel);
  });

  it("die Sperrliste trifft keine harmlosen Wörter: `knihovny`, `sekunda`, `negramotný`, `duchovní` bestehen (ein Stamm träfe sie)", () => {
    for (const z of ["Dnes jdu do knihovny.", "Počkej jednu sekundu.", "Ten text je negramotný.", "Duchovní život je důležitý."]) {
      expect(zeilenFehler(z), z).toEqual([]);
    }
  });

  it("fruehSprossen: eine Zeile, die mit einem grossen Akzentbuchstaben beginnt, ist vor der Totaste nicht verfügbar", () => {
    for (const z of ["Česko je malá země.", "Šel domů.", "Řeka teče dolů.", "Žádný strom tu není.", "Úterý je den.", "Éra skončila."]) {
      expect(zeilenFehler(z), z).toEqual([]);
      expect(zeilenFehler(z, { fruehSprossen: true }).join(" | "), z).toMatch(/grossen Akzentbuchstaben/);
    }
    // ein gewöhnlicher grosser Anfangsbuchstabe ist frei
    expect(zeilenFehler("Dnes je hezky.", { fruehSprossen: true })).toEqual([]);
    expect(zeilenFehler("Kam jdeš?", { fruehSprossen: true })).toEqual([]);
  });
});

describe("jede Zeile des tschechischen Korpus und der tschechischen Serien besteht diese Regeln", () => {
  const korpus = korpusFuer("cs").map((i) => i.text);
  const serien = SERIEN.filter((s) => s.lang === "cs").flatMap((s) => serieLines(s));

  it("Korpus (heute leer - sobald die erste Charge gemergt ist, greift der Wächter ohne Änderung)", () => {
    const verstoesse = korpus.flatMap((z) => zeilenFehler(z).map((f) => `„${z}“: ${f}`));
    expect(verstoesse.slice(0, 20)).toEqual([]);
  });

  it("Serien mit lang cs", () => {
    const verstoesse = serien.flatMap((z) => zeilenFehler(z).map((f) => `„${z}“: ${f}`));
    expect(verstoesse.slice(0, 20)).toEqual([]);
  });

  it("der Korpus trägt nur eigene Zeilen: nurWeg ist „cs“ (Weg cs bekommt nie fremde Sätze)", () => {
    expect(korpusFuer("cs").filter((i) => i.nurWeg !== "cs")).toEqual([]);
  });
});
