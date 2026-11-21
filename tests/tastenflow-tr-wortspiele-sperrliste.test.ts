/**
 * ★★★★★ WÄCHTER F6 Türkisch (03.10.2026): DIE SPERRLISTE PRÜFT JEDE ERZEUGTE ZEICHENFOLGE - auch die der Wortspiele (Glossar §4 Nr. 5/6).
 *
 * Seit `wortquelle("tr")` die türkische Liste liefert (`WORDS_TR`), ziehen Pyramide (Wortanfänge: g, gö, göt, götü …), Spiegelwörter
 * (rückwärts), Wandernder Grossbuchstabe und Zwillingsgriffe ihren Vorrat daraus. Eine Wortliste ohne Sperrwort garantiert nicht, dass
 * ein UMGEDREHTES oder ZERSCHNITTENES Wort keines ist: `götürmek` ⇒ Pyramide ⇒ `göt`; `kes` ⇒ Spiegel ⇒ `sek`. Dieser Wächter lässt JEDE Form
 * mit der Übungssprache „tr" über viele Zufälle und Tastenstände laufen und prüft jedes Wort jeder Zeile gegen {@link gesperrtGefaltetTr}
 * (richtige UND gefaltete Schreibung). Vorbild: `tests/tastenflow-g2b2-neue-sprache-nie-deutsch.test.ts` (dieselbe Methode, dieselbe Fehlerklasse -
 * Falle 19: ein Wächter über die FEHLERKLASSE, nicht über die reparierten Stellen).
 */
import { describe, expect, it } from "vitest";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { setLayout } from "../src/lib/typing/layouts";
import { gesperrtGefaltetTr, istKernGesperrtTr } from "../src/lib/typing/sperrlisteTr";
import { UEBUNGSFORMEN } from "../src/lib/typing/uebungsformen";
import { erzeugtGesperrt } from "../src/lib/typing/uebungsformen/hilfen";
import type { FormKontext, Uebungsform } from "../src/lib/typing/uebungsformen/typen";
import { WORDS_TR } from "../src/lib/typing/wordsTr";

function zufall(samen: number): () => number {
  let s = samen;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

function ctx(introduced: string[], samen: number, stufe: "kids" | "teens" | "erwachsen"): FormKontext {
  return { lernweg: "tr", introduced, shift: introduced.includes(SHIFT_UNIT), oneHand: false, stufe, lang: "tr", count: 10, zufall: zufall(samen) };
}

/** Alle Texte einer Runde: Frage, Frageteile, Antworten, Zeilen - nichts bleibt ungeprüft. */
function texteDerRunde(form: Uebungsform, c: FormKontext): string[] {
  const texte: string[] = [];
  if (!form.taugt(c)) return texte;
  if (form.fragen) {
    for (const aufgabe of form.fragen(c)) {
      texte.push(aufgabe.frage, ...(aufgabe.frageTeile?.map((t) => t.text) ?? []), ...aufgabe.antworten);
    }
  } else if (form.baue) {
    for (const zeile of form.baue(c)?.zeilen ?? []) texte.push(zeile.text);
  }
  return texte;
}

const woerterVon = (texte: readonly string[]): string[] => texte.flatMap((t) => t.split(/[\s.,;:!?"()…-]+/)).filter((w) => w.length >= 2);

/**
 * Formen, die ihren Vorrat heute aus `WORDS_TR` ziehen: ihre erzeugten Wörter sind türkisch und werden GEFALTET geprüft. Die übrigen Formen zeigen auf `tr`
 * noch den englischen Rückfall (`RÜCKFALL-EN`, Wortspiel-Listen sind nicht Teil von F5-F8): dort wäre die gefaltete Prüfung falsch - das englische `got`
 * faltet nicht, ist aber gefaltet `göt`; sie prüfen darum nur den Kern in richtiger Schreibung. Sobald eine Form türkischen Inhalt bekommt,
 * gehört sie in diese Menge (Etappe T).
 */
// ★ TR-W (09.10.2026): Lückentext, Korrekturlesen, Hand-Schwerpunkte, Alphabet-Reihen und Buchstabensalat haben jetzt türkischen Inhalt
// (`…Tr.ts`) - sie gehören damit in diese Menge und werden GEFALTET geprüft (der Salat liefert hier keine Zeilen; seine Funde prüft
// `tests/tastenflow-wortspiele-tr.test.ts`).
const AUS_WORDS_TR = new Set([
  "pyramide", "spiegelwoerter", "wandernder-gross", "zwillingsgriffe", "fingerdiktat", "zahlendiktat", "wasfehlt", "langersatz",
  "lueckentext", "korrekturlesen", "handschwerpunkte", "alphabetreihen", "buchstabensalat",
]);

describe("★ jede Übungsform auf „tr“: kein erzeugtes Wort ist ein Sperrwort - weder richtig noch gefaltet geschrieben", () => {
  setLayout("tr-q");
  const o = introOrder("tr");
  // Tastenstände: ganz früh bis alles (die Stufen-Enden und einige Stellen dazwischen)
  const staende = [...new Set([12, 19, 26, 30, 36, 55, o.length])].filter((n) => n <= o.length).map((n) => o.slice(0, n));

  for (const form of UEBUNGSFORMEN) {
    it(`${form.id}`, () => {
      setLayout("tr-q");
      const funde: string[] = [];
      let gesehen = 0;
      for (const intro of staende) {
        for (const stufe of ["kids", "teens", "erwachsen"] as const) {
          for (let samen = 1; samen <= 6; samen++) {
            for (const w of woerterVon(texteDerRunde(form, ctx(intro, samen * 31 + intro.length, stufe)))) {
              gesehen++;
              if (AUS_WORDS_TR.has(form.id) ? gesperrtGefaltetTr(w) : istKernGesperrtTr(w)) funde.push(`${w} (${intro.length} Einheiten)`);
            }
          }
        }
      }
      expect([...new Set(funde)].slice(0, 10)).toEqual([]);
      // Der Wächter ist nicht leer für die Formen, die ihren Vorrat aus WORDS_TR ziehen - sonst bewiese er nichts.
      if (["pyramide", "spiegelwoerter", "wandernder-gross", "zwillingsgriffe"].includes(form.id)) expect(gesehen, form.id).toBeGreaterThan(200);
    });
  }

  it("Gegenprobe: die Prüfung findet ein umgedrehtes Wort, das ein Sperrwort ist (`kıs` rückwärts ist `sık`, gefaltet `sik`), und einen Wortanfang (`göt` aus `götürmek`)", () => {
    expect(erzeugtGesperrt("tr", "göt")).toBe(true); // die Pyramide von „götürmek“ ginge über diesen Anfang
    expect(WORDS_TR.includes("götürmek")).toBe(false);
    expect(erzeugtGesperrt("tr", "kıs")).toBe(false);
    expect(erzeugtGesperrt("tr", "kıs".split("").reverse().join(""))).toBe(true); // sık
    // alle anderen Sprachen: keine Prüfung - ihre Formen bleiben, wie sie waren
    for (const l of ["de", "en", "fr", "es", "it", "pl", "cs"] as const) expect(erzeugtGesperrt(l, "göt"), l).toBe(false);
  });

  it("★ drei Wörter der Liste haben einen gesperrten Wortanfang (`seksen` ⇒ `seks`, `çukur` ⇒ `çuk`, `ocak` ⇒ `oc`) - die Pyramide überspringt sie, die Wortliste behält sie; und kein Wort ergibt umgedreht ein Sperrwort", () => {
    const umgedreht = WORDS_TR.filter((w) => !w.includes("'")).filter((w) => erzeugtGesperrt("tr", [...w].reverse().join("")));
    expect(umgedreht).toEqual([]);
    const mitSperrAnfang = WORDS_TR.filter((w) => {
      if (w.includes("'")) return false;
      for (let n = 2; n < w.length; n++) if (erzeugtGesperrt("tr", w.slice(0, n))) return true;
      return false;
    });
    // Dokumentiert: kommt ein Wort dazu, entscheidet ein Mensch, ob es bleibt (die Pyramide und `wortpool` überspringen es ohnehin).
    expect(mitSperrAnfang.sort()).toEqual(["ocak", "seksen", "çukur"]);
  });

  it("★ die Pyramide zeigt nie einen dieser Anfänge, auch nicht auf dem vollen Tastenstand und über viele Zufälle", () => {
    setLayout("tr-q");
    const o = introOrder("tr");
    const pyramide = UEBUNGSFORMEN.find((f) => f.id === "pyramide")!;
    const gezeigt = new Set<string>();
    for (let samen = 1; samen <= 80; samen++) for (const t of texteDerRunde(pyramide, ctx(o, samen, "teens"))) gezeigt.add(t);
    expect(gezeigt.size).toBeGreaterThan(100);
    for (const verboten of ["seks", "çuk", "oc", "sik", "göt", "bok"]) expect(gezeigt.has(verboten), verboten).toBe(false);
  });
});
