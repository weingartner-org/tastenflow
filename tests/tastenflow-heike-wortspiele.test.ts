/**
 * ★★★★★ HEIKES RÜCKMELDUNG ZU DEN WORTSPIELEN - festgenagelt.
 *
 * Testerin hat am 03.09.2026 die neuen Übungsformen getestet. Ihr Urteil zuerst,
 * weil es der Maßstab ist: *„Cool! Das macht den Schreibtrainer um einiges
 * attraktiver."* Danach acht Punkte, davon vier hier gemessen und behoben.
 *
 * Jeder Test steht für einen Satz von ihr - und für den Grund, warum er zählt.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isRealWord } from "@/lib/typing/lexicon";
import { fuerSprachausgabe } from "@/lib/typing/voice";
import { alphabetreihen } from "@/lib/typing/uebungsformen/alphabetreihen";
import { fingerdiktat } from "@/lib/typing/uebungsformen/fingerdiktat";
import { lueckentext } from "@/lib/typing/uebungsformen/lueckentext";
import { korrekturlesen } from "@/lib/typing/uebungsformen/korrekturlesen";
import { SHIFT_UNIT } from "@/lib/typing/letters";

const lies = (d: string) => readFileSync(resolve(__dirname, "..", d), "utf-8");

/* ══════════════════════════════════════════════════════════════════════════
   3. „Bei der Kombi eefhilnr hieß es, das Wort ‚Niere' gäbe es nicht."
   ══════════════════════════════════════════════════════════════════════════ */
describe("Buchstabensalat: gefundene Wörter gelten", () => {
  it("★★★★★ „Niere“ und die anderen fünf gemessenen Lücken sind zu", () => {
    // Gemessen am 04.09.2026 an 28 gängigen Wörtern: sechs fehlten.
    for (const w of ["niere", "nieren", "nierchen", "kerne", "erle", "ehre"]) {
      expect(isRealWord(w, "de"), `„${w}“ muss das Lexikon kennen`).toBe(true);
    }
  });

  it("★★★★ die Gegenprobe: Nicht-Wörter bleiben Nicht-Wörter", () => {
    /*
     * Ohne diese Zeile wäre der Test oben auch grün, wenn `isRealWord` alles
     * annähme - und das wäre SCHLIMMER als die Lücke: Ein Kind bekäme
     * „richtig" für ein Wort, das es nicht gibt, und lernte es falsch.
     * Beim Durchsehen der Nachtrags-Liste sind darum zwei Einträge wieder
     * herausgeflogen („nerf", „hiefe").
     */
    /*
     * ⚠️ „ada" und „öl" stehen ABSICHTLICH nicht in dieser Liste: Sie SIND im
     * Lexikon (Korpus-Treffer) - beim Schreiben dieses Tests als Nicht-Wörter
     * erwartet und vom Lauf widerlegt. Es ist derselbe Zufallstreffer, der
     * schon einmal eine ganze Unsinn-Zeile gekippt hat (siehe TypingSession,
     * Kopf zu `RoundLine.art`). Eine Erwartung, die die Messung widerlegt,
     * wird berichtigt - nicht der Code.
     */
    for (const w of ["nerf", "hiefe", "xqz", "fjj"]) {
      expect(isRealWord(w, "de"), `„${w}“ darf NICHT als Wort gelten`).toBe(false);
    }
  });
});

/* ══════════════════════════════════════════════════════════════════════════
   5. „Beim Zahlendiktat Zahlwort 73. wird der Satzpunkt als Ordnungszahl
       gelesen, also 73-ter gesagt. Das ist auch bei den ganzen Meldungen
       Satz 1 von 10(-ter) so, weil danach auch ein Punkt kommt."
   ══════════════════════════════════════════════════════════════════════════ */
describe("Ansage: eine Zahl am Satzende wird keine Ordnungszahl", () => {
  it("★★★★★ der Punkt hinter der Zahl fällt weg", () => {
    expect(fuerSprachausgabe("Schreib das Zahlwort: 73.")).toBe("Schreib das Zahlwort: 73");
    expect(fuerSprachausgabe("Satz 1 von 10.")).toBe("Satz 1 von 10");
    expect(fuerSprachausgabe("Aufgabe 3 von 8. ")).toBe("Aufgabe 3 von 8 ");
    expect(fuerSprachausgabe("Stufe 5..")).toBe("Stufe 5");
  });

  it("★★★★★ die Gegenprobe: mitten im Satz bleibt der Punkt stehen", () => {
    /*
     * Hier IST die Ordnungszahl gemeint. Ein pauschaler Sweep hätte sie
     * zerstört - dieselbe Frage wie bei jedem Zeichen-Sweep: Ist das Zeichen
     * an dieser Stelle GEGENSTAND?
     */
    expect(fuerSprachausgabe("am 3. Oktober ist es kalt.")).toBe("am 3. Oktober ist es kalt.");
    expect(fuerSprachausgabe("1. Etappe geschafft!")).toBe("1. Etappe geschafft!");
    expect(fuerSprachausgabe("Das ist gut.")).toBe("Das ist gut.");
    expect(fuerSprachausgabe("")).toBe("");
  });
});

/* ══════════════════════════════════════════════════════════════════════════
   4. + 6. „Im Lückentext ist es egal, welchen Umschalter man nutzt … Es wäre
            konsequent, wenn das in allen Übungen wichtig ist."
            „Und beim Korrekturlesen war die Umschalttaste auch egal."
   ══════════════════════════════════════════════════════════════════════════ */
describe("Die Umschalt-Gegenhand gilt auch im Rätsel-Bildschirm", () => {
  const q = () => lies("src/components/typing/RaetselLauf.tsx");

  it("★★★★★ der Bildschirm wertet die gehaltene Umschalttaste aus", () => {
    expect(
      /e\.location === 1 \? "links" : e\.location === 2 \? "rechts"/.test(q()),
      "Ohne `KeyboardEvent.location` ist nicht zu erkennen, WELCHE " +
        "Umschalttaste gehalten wurde - genau das war Heikes Befund.",
    ).toBe(true);
  });

  it("★★★★ die Feststelltaste zählt wie die falsche Hand", () => {
    expect(
      /if \(!e\.shiftKey\) \{\s*\n\s*falscheHand\.current = true;/.test(q()),
      "Ein Großbuchstabe ohne Umschalttaste kam von der Feststelltaste - " +
        "im Trainer ist das ein Fehler, hier muss es derselbe sein.",
    ).toBe(true);
  });

  it("★★★★★ die Regel hängt an derselben Achse wie die Großschreibung", () => {
    /*
     * Am 02.09. wurde entschieden: Die Umschalttaste zählt im Lückentext, im
     * Fingerdiktat nicht. Diese Aufteilung heisst `grossKleinZaehlt`. Die
     * Gegenhand folgt ihr, statt eine zweite zu erfinden, die niemand kennt.
     */
    /*
     * ⚠️ Nachgezogen am 11.09.2026 (A1): Die Regel „Grossschreibung zählt nur,
     * wenn die Form es will UND die Umschalttaste eingeführt ist" steht seither
     * an EINER Stelle - `grossKleinZaehltJetzt`. Vorher war sie hier
     * ausgeschrieben (`!enforceShiftHand || !shiftLearned || !grossKleinZaehlt`)
     * und ein zweites Mal beim Vergleich der Antwort; genau daran ist der
     * Fehler entstanden, dass die Schreibung beim Vergleich auch ohne
     * eingeführte Umschalttaste zählte. Geprüft wird darum jetzt beides: die
     * eine Formel und ihre Benutzung in der Gegenhand-Regel.
     */
    expect(
      /const grossKleinZaehltJetzt = grossKleinZaehlt && shiftLearned;/.test(q()),
      "Die Regel muss an EINER Stelle stehen (`grossKleinZaehltJetzt`)",
    ).toBe(true);
    expect(
      /if \(!enforceShiftHand \|\| !grossKleinZaehltJetzt\) return;/.test(q()),
      "Die Gegenhand-Regel muss an derselben Formel hängen",
    ).toBe(true);
    expect(lueckentext.grossKleinZaehlt, "Lückentext: Umschalttaste zählt").toBe(true);
    expect(korrekturlesen.grossKleinZaehlt, "Korrekturlesen: Umschalttaste zählt").toBe(true);
  });

  it("★★★ die gemerkte Hand wird bei jeder neuen Aufgabe zurückgesetzt", () => {
    // Sonst bekäme ein Kind den Hinweis für etwas, das es gerade richtig
    // gemacht hat - und das wäre eine Wertung gegen das Kind.
    expect(/falscheHand\.current = false;/.test(q())).toBe(true);
  });
});

/* ══════════════════════════════════════════════════════════════════════════
   2. „Fingerdiktat: hier wäre es schön, wenn die Eingabe auch angesagt würde."
   ══════════════════════════════════════════════════════════════════════════ */
describe("Fingerdiktat: die Eingabe wird mitgesprochen", () => {
  it("★★★★ die Form verlangt das Echo, andere nicht", () => {
    expect(fingerdiktat.eingabeAnsagen, "Fingerdiktat: Echo an").toBe(true);
    // Die Gegenprobe: Im Lückentext wäre ein Buchstabe je Anschlag Geplapper.
    expect(lueckentext.eingabeAnsagen ?? false, "Lückentext: Echo aus").toBe(false);
    expect(korrekturlesen.eingabeAnsagen ?? false, "Korrekturlesen: Echo aus").toBe(false);
  });

  it("★★★ nur ein DAZUGEKOMMENES Zeichen wird gesagt - nicht Einfügen, nicht Löschen", () => {
    const q = lies("src/components/typing/RaetselLauf.tsx");
    expect(
      /neuerWert\.length === eingabe\.length \+ 1 &&\s*\n\s*neuerWert\.startsWith\(eingabe\)/.test(q),
      "Beim Einfügen aus der Zwischenablage soll es still bleiben",
    ).toBe(true);
  });
});

/* ══════════════════════════════════════════════════════════════════════════
   1. „Alphabetreihe bricht mittendrin ab."
   ══════════════════════════════════════════════════════════════════════════ */
describe("Alphabet-Reihen: die Runde ist vollständig", () => {
  const AB = "abcdefghijklmnopqrstuvwxyzäöüß".split("");
  function ctx(n: number, shift: boolean, punkt: boolean, b: number) {
    const intro = [...AB.slice(0, b)];
    if (shift) intro.push(SHIFT_UNIT);
    if (punkt) intro.push(".");
    let k = 7;
    return {
      lernweg: "de" as const,
      introduced: intro, shift, oneHand: false, stufe: "kids" as never,
      lang: "de" as const, count: n,
      zufall: () => ((k = (k * 9301 + 49297) % 233280) / 233280),
    };
  }

  it("★★★★ liefert IMMER mindestens die verlangte Zahl von Zeilen", () => {
    /*
     * ⚠️ WAS DIESER TEST BEWEIST UND WAS NICHT. Er nagelt fest, dass der
     * GENERATOR nicht zu kurz liefert - gemessen am 04.09.2026 in zwölf
     * Konfigurationen, jede vollständig. Testerin „bricht mittendrin ab" ist
     * damit NICHT erklärt: Der Abbruch, den sie erlebt hat, liegt nicht hier.
     *
     * Der wahrscheinlichste Ort ist die ANSAGE - eine „ereignis"-Ansage
     * schnitt bis zum 04.09. jede laufende mitten im Satz ab (dieselbe
     * Ursache wie ihr „beim Eisschollenspiel wird die letzte Ansage
     * abgewürgt"). Das ist behoben; ob es DIESER Abbruch war, muss ein
     * Probelauf zeigen. Dieser Test hält nur den Generator fest, damit er
     * nicht künftig zur Ursache wird.
     */
    for (const [shift, punkt, b] of [
      [false, false, 8], [true, false, 8], [true, true, 12], [true, true, 26],
    ] as const) {
      for (const n of [8, 12, 16]) {
        const runde = alphabetreihen.baue?.(ctx(n, shift, punkt, b)) ?? null;
        expect(runde, `shift=${shift} punkt=${punkt} b=${b} n=${n}: keine Runde`).toBeTruthy();
        expect(
          runde!.zeilen.length,
          `shift=${shift} punkt=${punkt} b=${b}: ${runde!.zeilen.length} statt ${n} Zeilen`,
        ).toBeGreaterThanOrEqual(n);
      }
    }
  });
});
