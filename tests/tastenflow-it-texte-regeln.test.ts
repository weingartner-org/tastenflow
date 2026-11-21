/**
 * ★★★★★ WÄCHTER F5-it (02.10.2026): DIE REGELN FÜR JEDE ITALIENISCHE TEXTZEILE - schon heute scharf, obwohl der Korpus noch leer ist.
 *
 * Die Text-Chargen T1-T9 (Opus) schreiben die eigentlichen Zeilen; dieser Wächter steht VORHER da (Falle 58/59: der Fehlerkatalog gehört
 * in den Auftrag UND als Wächter in den Bau). Er prüft jede Zeile von `CORPUS_IT` und jeder italienischen Serie gegen die Regeln aus
 * Bauplan §1 (D2, I5-I9), §5 (Fallen) und `GLOSSAR-it.md` §1 Nr. 7, und hat seine Gegenproben: ein Wächter, der nichts findet, beweist nichts.
 *
 * Solange es keine Zeilen gibt, prüft er nur die Funktion {@link zeilenFehler} an Beispielen - sobald die erste Charge gemergt ist, greift er
 * ohne Änderung. Eine Regel kommt HIER hinein, wenn eine Charge gegen sie verstösst, nicht erst im Prüfbericht.
 */
import { describe, expect, it } from "vitest";
import { korpusFuer } from "../src/lib/typing/corpus";
import { SERIEN } from "../src/lib/typing/serien";
import { serieLines } from "../src/lib/typing/serie";
import { zeilenFehler } from "./helfer/itTextRegeln";

describe("zeilenFehler: die Regeln, an Beispielen mit Gegenprobe", () => {
  it("richtige Zeilen bestehen (Elision, Akzente, Zahlen, Anführung)", () => {
    for (const z of [
      "L'amico di mia sorella abita in città.",
      "Perché non vieni con noi? Un'altra volta, forse.",
      "Il treno parte alle 8:15 e arriva dopo un'ora.",
      "\"Che bello!\", dice Giulia, e corre verso il mare.",
      "Ormai è tardi: andiamo a casa.",
      "Ho dato un po' di pane agli uccellini.",
      "Quest'anno la scuola comincia il 7 settembre.",
    ]) expect(zeilenFehler(z), z).toEqual([]);
  });

  it("jede Regel findet ihren Fehler (Gegenprobe - sonst bewiese der Wächter nichts)", () => {
    const FALSCH: readonly (readonly [string, RegExp])[] = [
      ["Dov’è la scuola?", /Zeichen/],
      ["Ha detto «ciao» a tutti.", /Zeichen/],
      ["Il caffè costa 1,50 €…", /Zeichen/],
      ["- Dove vai? disse lui.", /Dialogstrich/],
      ["Dove vai ?", /Leerzeichen vor/],
      ["È tardi, andiamo.", /grossen Akzentbuchstaben/],
      ["Non so perche' non viene.", /Apostroph statt Akzent/],
      ["Il caffe' è pronto.", /Apostroph statt Akzent/],
      ["E' tardi.", /E'/],
      ["Dimmi qual'è il tuo nome.", /qual'è/],
      ["Ho visto un'amico al parco.", /un'/],
      ["Che cazzo fai?", /Sperrwort/],
      ["Troppo  spazio qui.", /Leerzeichen/],
      ["Una frase mit ö.", /Zeichen/],
    ];
    for (const [zeile, regel] of FALSCH) {
      expect(zeilenFehler(zeile).join(" | "), zeile).toMatch(regel);
    }
  });

  it("Elision und `po'` sind KEIN Fehler, ein loser Apostroph schon", () => {
    expect(zeilenFehler("Un po' di pane e l'olio.")).toEqual([]);
    expect(zeilenFehler("Casa ' bella.")).not.toEqual([]);
  });

  it("Elision vor einer ZAHL ist richtig, wenn das Zahlwort mit Vokal beginnt (IT-RETO-VERDRAHTEN 03.10.2026)", () => {
    // Richtig: l'8 (otto), dell'1 (uno), l'11 (undici), all'80 (ottanta) - vor Buchstaben UND vor Ziffern.
    for (const z of ["Il prezzo sale dell'8% in un anno.", "Pesa l'1% in meno, cioè l'11 settembre.", "Si arriva all'80% e poi all'acqua."]) {
      expect(zeilenFehler(z), z).toEqual([]);
    }
    // Gegenprobe: Zahlwort mit Konsonant (cinque, venti, due) und loser Apostroph vor/nach der Zahl.
    expect(zeilenFehler("Il prezzo sale dell'5% in un anno.").join(" | ")).toMatch(/Elision vor 5/);
    expect(zeilenFehler("Sono arrivati l'20 maggio.").join(" | ")).toMatch(/Elision vor 20/);
    expect(zeilenFehler("Il prezzo sale dell' 8% in un anno.").join(" | ")).toMatch(/Apostroph ohne Buchstaben/);
    expect(zeilenFehler("Il numero '8 non va.").join(" | ")).toMatch(/Apostroph ohne Buchstaben/);
    expect(zeilenFehler("Sono 8' di ritardo.").join(" | ")).toMatch(/Apostroph ohne Buchstaben/);
  });
});

describe("jede Zeile des italienischen Korpus und der italienischen Serien besteht diese Regeln", () => {
  const korpus = korpusFuer("it").map((i) => i.text);
  const serien = SERIEN.filter((s) => s.lang === "it").flatMap((s) => serieLines(s));

  it("Korpus (heute leer - sobald T1 gemergt ist, greift der Wächter ohne Änderung)", () => {
    const verstoesse = korpus.flatMap((z) => zeilenFehler(z).map((f) => `„${z}“: ${f}`));
    expect(verstoesse.slice(0, 20)).toEqual([]);
  });

  it("Serien mit lang it", () => {
    const verstoesse = serien.flatMap((z) => zeilenFehler(z).map((f) => `„${z}“: ${f}`));
    expect(verstoesse.slice(0, 20)).toEqual([]);
  });
});
