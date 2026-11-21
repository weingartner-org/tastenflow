/**
 * ★★★★★ WÄCHTER F5-pl (03.10.2026): DIE REGELN FÜR JEDE POLNISCHE TEXTZEILE - schon heute scharf, obwohl der Korpus noch leer ist.
 *
 * Die Text-Chargen T1 ff. (Opus) schreiben die eigentlichen Zeilen; dieser Wächter steht VORHER da (Falle 58/59: der Fehlerkatalog
 * gehört in den Auftrag UND als Wächter in den Bau). Er prüft jede Zeile von `CORPUS_PL` und jeder polnischen Serie gegen die Regeln
 * aus `GLOSSAR-pl.md` §1 Nr. 8, §2.10 und §3 (Fallen 8, 10) und hat seine Gegenproben: ein Wächter, der nichts findet, beweist nichts.
 *
 * Solange es keine Zeilen gibt, prüft er nur die Funktion {@link zeilenFehler} an Beispielen - sobald die erste Charge gemergt ist,
 * greift er ohne Änderung. Eine Regel kommt HIER hinein, wenn eine Charge gegen sie verstösst, nicht erst im Prüfbericht.
 */
import { describe, expect, it } from "vitest";
import { korpusFuer } from "../src/lib/typing/corpus";
import { SERIEN } from "../src/lib/typing/serien";
import { serieLines } from "../src/lib/typing/serie";
import { zeilenFehler } from "./helfer/plTextRegeln";

describe("zeilenFehler: die Regeln, an Beispielen mit Gegenprobe", () => {
  it("richtige Zeilen bestehen (polnische Buchstaben, Zahlen, Anführung, Apostroph im Wort)", () => {
    for (const z of [
      "Mała żaba skacze do wody, a łabędź pływa po jeziorze.",
      "Czy wiesz, że w Polsce szkoła zaczyna się pierwszego września?",
      "Pociąg odjeżdża o 8:15 i przyjeżdża po godzinie.",
      "\"Dzień dobry!\", mówi Ania i biegnie nad rzekę.",
      "Kosztuje 12,50 zł, a 95% dzieci lubi lody.",
      "To jest pismo Braille'a, czytane palcami.",
      "W roku 2026 mieszka tam 12 345 osób.",
      "Zimą jemy pierogi, a latem lody - zawsze razem.",
    ]) expect(zeilenFehler(z), z).toEqual([]);
  });

  it("jede Regel findet ihren Fehler (Gegenprobe - sonst bewiese der Wächter nichts)", () => {
    const FALSCH: readonly (readonly [string, RegExp])[] = [
      ["Powiedział „tak” i wyszedł.", /Zeichen/],
      ["Ha detto «ciao» a tutti.", /Zeichen/],
      ["Wiele rzeczy… nie wiem.", /Zeichen/],
      ["Zeile mit Gedankenstrich – so nicht.", /Zeichen/],
      ["Kosztuje 12 345 zł.", /Zeichen/],
      ["Ein Satz mit ö.", /Zeichen/],
      ["Temperatura 20°C.", /Zeichen/],
      ["- Dokąd idziesz? zapytał.", /Dialogstrich/],
      ["Dokąd idziesz ?", /Leerzeichen vor/],
      ["Mówi : tak.", /Leerzeichen vor/],
      ["Zdało 95 % uczniów.", /Prozent mit Leerzeichen/],
      ["Kosztuje 1.500 zł.", /Tausenderpunkt/],
      ["Dom ' kot.", /Apostroph/],
      ["Szła na ślepo przez las.", /na ślepo/],
      ["Ą, ę i ł to znaki specjalne.", /znaki specjalne/],
      ["Co za kurwa dzień.", /Sperrwort/],
      ["Co za jebany dzień.", /Sperrwort/],
      ["Troppo  spazio qui.", /Leerzeichen/],
      [" Zeile mit Rand.", /Leerzeichen/],
    ];
    for (const [zeile, regel] of FALSCH) {
      expect(zeilenFehler(zeile).join(" | "), zeile).toMatch(regel);
    }
  });

  it("★ Sperrwörter werden auch OHNE Ogonki erkannt (bez ogonków), harmlose Wörter mit einer Wurzel mittendrin nicht (Scunthorpe)", () => {
    expect(zeilenFehler("Ale gowno.").join(" ")).toMatch(/Sperrwort/);
    expect(zeilenFehler("Ale jebac to.").join(" ")).toMatch(/Sperrwort/);
    expect(zeilenFehler("Ona zakochuje się w nim, a odporność rośnie.")).toEqual([]);
    expect(zeilenFehler("Gwałtowna burza przeszła nad miastem.")).toEqual([]); // gwałtowny ≠ gwałt
  });

  it("der Apostroph IM Wort (Braille'a) ist KEIN Fehler, ein loser schon; ein Bindestrich im Wort auch nicht (biało-czerwony)", () => {
    expect(zeilenFehler("Pismo Braille'a i flaga biało-czerwona.")).toEqual([]);
    expect(zeilenFehler("Dom' kot.")).not.toEqual([]);
  });

  it("grosse polnische Buchstaben am Satzanfang sind KEIN Textfehler (sie gehen erst ab `q` durch fitText - Etappe T beachtet das)", () => {
    expect(zeilenFehler("Łódź jest miastem nad rzeką Łódką.")).toEqual([]);
    expect(zeilenFehler("Świat jest duży.")).toEqual([]);
  });
});

describe("jede Zeile des polnischen Korpus und der polnischen Serien besteht diese Regeln", () => {
  const korpus = korpusFuer("pl").map((i) => i.text);
  const serien = SERIEN.filter((s) => s.lang === "pl").flatMap((s) => serieLines(s));

  it("Korpus (heute leer - sobald T1 gemergt ist, greift der Wächter ohne Änderung)", () => {
    const verstoesse = korpus.flatMap((z) => zeilenFehler(z).map((f) => `„${z}“: ${f}`));
    expect(verstoesse.slice(0, 20)).toEqual([]);
  });

  it("Serien mit lang pl", () => {
    const verstoesse = serien.flatMap((z) => zeilenFehler(z).map((f) => `„${z}“: ${f}`));
    expect(verstoesse.slice(0, 20)).toEqual([]);
  });
});
