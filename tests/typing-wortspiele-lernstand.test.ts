/**
 * ★★★★★ DER WÄCHTER ÜBER DEN LERNSTAND - alle Wortspiele, alle Tastenstände.
 *
 * ── Anlass ────────────────────────────────────────────────────────────────
 *
 * Johannes am 11.09.2026: *„Bei zwei Sätzen, wo im zweiten ein Wort fehlt. Die
 * Antwort war ‚falsch', weil sie die Großschreibung nicht beachtet hätte, die
 * aber noch nicht dran war. Die Übung kann bleiben, muss aber an den Lernstand
 * angepasst sein."*
 *
 * Die eine gemeldete Stelle ist behoben (A1, `grossKleinZaehltJetzt` in
 * `RaetselLauf.tsx`). Dieser Wächter beantwortet die ANDERE Frage: Gibt es
 * dieselbe Sorte Fehler noch anderswo? Er geht dafür jede Form an jedem
 * echten Lehrgangs-Stand ab - die Stände sind PREFIXE von `INTRO_ORDER`, also
 * genau das, was ein Kind nacheinander freigeschaltet bekommt, nicht
 * ausgedachte Buchstabenmengen.
 *
 * ── Die vier Regeln, die hier festgehalten werden ─────────────────────────
 *
 *  1. **Keine Fremdzeichen.** Was getippt werden muss, muss mit den
 *     freigeschalteten Tasten zu tippen sein - Zeilen wie Antworten, und ALLE
 *     Antworten, nicht nur die erste.
 *  2. **Nie falsch für etwas, das noch nicht dran war.** Ist die Umschalt-
 *     taste im Tastenstand noch nicht eingeführt, muss die klein geschriebene
 *     Antwort als RICHTIG gelten. Geprüft wird am Urteil selbst (`trifft`),
 *     nicht an einer Nacherzählung davon.
 *  3. **Entweder genug Aufgaben oder `taugt = false`.** Testerin Befund vom
 *     04.09.: Das Zahlendiktat kam mit EINER Aufgabe, immer derselben. Eine
 *     Runde, die zwölf Aufgaben anfragt und eine bekommt, sieht für ein Kind
 *     wie ein Programmfehler aus.
 *  4. **Gesehenes und Erwartetes sind zeichengleich**, wo das Abgleichen die
 *     Aufgabe IST („Was fehlt hier?").
 *
 * ⚠️ Dieser Wächter hält KEINE Vorratsgröße fest (die wächst), sondern die
 * Regel dahinter - sonst wird er beim nächsten Zuwachs umgedreht statt
 * geprüft.
 */
import { igluVorrat } from "@/lib/typing/uebungsformen/iglu";
import { describe, expect, it } from "vitest";
import { INTRO_ORDER, SHIFT_UNIT } from "@/lib/typing/letters";
import { UEBUNGSFORMEN, type FormKontext, type Uebungsform } from "@/lib/typing/uebungsformen";
import {
  SALAT_ZIEL,
  salatVorrat,
  waehleSalatwort,
} from "@/lib/typing/uebungsformen/buchstabensalat";
import { trifft } from "@/components/typing/RaetselLauf";
import type { Lang, Stufe } from "@/lib/typing/account";

/* ── Die Stände: echte Prefixe aus INTRO_ORDER ─────────────────────────── */

/**
 * Sieben Haltestellen des Lehrgangs. Die Zahl ist die Länge des
 * `INTRO_ORDER`-Prefixes, der Name sagt, was dazugekommen ist - beides wird
 * unten nachgerechnet, damit ein Umbau der Reihenfolge diesen Wächter nicht
 * still an die falsche Stelle schiebt.
 */
const STAENDE: { name: string; bis: number }[] = [
  { name: `Grundreihe`, bis: 8 },
  { name: `plus e n i`, bis: 11 },
  { name: `plus r t und die Umschalttaste`, bis: 14 },
  { name: `plus Buchstaben bis p`, bis: 25 },
  { name: `plus Umlaute und ß`, bis: 31 },
  { name: `plus Satzzeichen`, bis: 38 },
  { name: `plus Ziffernreihe`, bis: 48 },
];

/** Ein fester Zufall - sonst prüft der Wächter jedes Mal etwas anderes. */
function festerZufall(saat: number): () => number {
  let z = saat >>> 0;
  return () => {
    z = (z * 1664525 + 1013904223) >>> 0;
    return z / 4294967296;
  };
}

function ctxFuer(bis: number, lang: Lang, stufe: Stufe, saat = 7): FormKontext {
  const introduced = INTRO_ORDER.slice(0, bis);
  return {
    lernweg: "de",
    introduced,
    shift: introduced.includes(SHIFT_UNIT),
    oneHand: false,
    stufe,
    lang,
    count: 12,
    zufall: festerZufall(saat),
  };
}

/** Die tippbaren Zeichen: alles Freigeschaltete ohne die Umschalt-Einheit. */
function tippbar(ctx: FormKontext): Set<string> {
  return new Set(ctx.introduced.filter((e) => e !== SHIFT_UNIT));
}

/**
 * Alles, was bei dieser Form GETIPPT wird.
 *
 * Beim Buchstabensalat ist das nicht vorgegeben - dort tippt ein Kind frei,
 * und der Vorrat entsteht aus den Buchstaben des Quellworts. Geprüft wird
 * deshalb das Quellwort selbst: Ist es tippbar, ist jedes daraus gebildete
 * Wort es auch.
 */
function getippteTexte(form: Uebungsform, ctx: FormKontext): string[] {
  if (form.eigenerBildschirm === "buchstabensalat") {
    const quellwort = waehleSalatwort(ctx);
    return quellwort ? [quellwort] : [];
  }
  // Iglu-Raten: jedes Wort des Vorrats wird Buchstabe für Buchstabe getippt.
  if (form.eigenerBildschirm === "iglu") return igluVorrat(ctx);
  if (form.eigenerBildschirm === "raetsel" && form.fragen)
    return form.fragen(ctx).flatMap((a) => a.antworten);
  return form.baue?.(ctx)?.zeilen.map((z) => z.text) ?? [];
}

/** Wie viele AUFGABEN (Zeilen bzw. Fragen) die Runde trägt. */
function anzahlAufgaben(form: Uebungsform, ctx: FormKontext): number {
  if (form.eigenerBildschirm === "buchstabensalat") {
    // Eine Aufgabe, aber viele Funde - gezählt wird, was zu holen ist.
    const quellwort = waehleSalatwort(ctx);
    return quellwort ? salatVorrat(quellwort, ctx.lang).length : 0;
  }
  if (form.eigenerBildschirm === "iglu") return igluVorrat(ctx).length;
  if (form.eigenerBildschirm === "raetsel" && form.fragen) return form.fragen(ctx).length;
  return form.baue?.(ctx)?.zeilen.length ?? 0;
}

/**
 * So viele Aufgaben muss eine Form liefern, wenn sie sich anbietet.
 *
 * Drei, nicht zwölf: Der Vorrat darf am Anfang des Lehrgangs knapp sein - eine
 * Runde aus drei Aufgaben ist eine kurze Runde, eine aus einer ist eine
 * Schleife (Testerin, 04.09.2026). Der Buchstabensalat zählt gegen sein eigenes
 * Ziel, weil dort EIN Quellwort viele Funde trägt.
 */
const MINDEST_AUFGABEN = 3;

/**
 * Johannes 11.09.2026: „auf 5" - für die RÄTSEL-Formen (Korrekturlesen, Was
 * fehlt hier, Lückentext …), deren `taugt` bisher bei 3 lag und nie bindend
 * war. Dieselbe Zahl wie `hilfen.MINDEST_AUFGABEN`, hier bewusst als eigene
 * Zahl: Der Wächter soll anschlagen, wenn jemand die Schwelle im Code senkt.
 * Zeilen-Formen (Pyramide, Alphabetreihe …) bleiben bei 3 - eine Pyramide aus
 * vier Zeilen ist eine vollständige Pyramide, keine knappe Runde.
 */
const MINDEST_RAETSEL = 5;

const SPRACHEN: Lang[] = ["de", "en"];
const STUFEN: Stufe[] = ["kids", "teens"];

/* ── 0. Die Stände stimmen noch ────────────────────────────────────────── */

describe(`Die geprueften Staende sind echte Haltestellen des Lehrgangs`, () => {
  it(`liegen in der Einfuehrungs-Reihenfolge, und die Umschalttaste kommt bei Stand 3`, () => {
    for (const { bis } of STAENDE) expect(bis).toBeLessThanOrEqual(INTRO_ORDER.length);
    // Die ersten beiden Staende kennen die Umschalttaste NICHT - genau darum
    // geht es in Regel 2. Ab dem dritten ist sie da.
    expect(INTRO_ORDER.slice(0, 11)).not.toContain(SHIFT_UNIT);
    expect(INTRO_ORDER.slice(0, 14)).toContain(SHIFT_UNIT);
    // Und der letzte Stand traegt wirklich die ganze Ziffernreihe.
    const mit48 = new Set(INTRO_ORDER.slice(0, 48));
    for (const z of "0123456789") expect(mit48.has(z), `Ziffer ${z}`).toBe(true);
  });
});

/* ── 1. Keine Fremdzeichen ─────────────────────────────────────────────── */

describe(`Keine Form verlangt ein Zeichen, das das Kind noch nicht hat`, () => {
  for (const { name, bis } of STAENDE)
    for (const lang of SPRACHEN)
      it(`${name} (${lang})`, () => {
        for (const stufe of STUFEN)
          for (const form of UEBUNGSFORMEN)
            for (let saat = 1; saat <= 3; saat += 1) {
              const ctx = ctxFuer(bis, lang, stufe, saat);
              if (!form.taugt(ctx)) continue;
              const ok = tippbar(ctx);
              // Ein FRISCHER Kontext zum Bauen: `zufall` ist zustandsbehaftet,
              // und `taugt` hat schon daraus gezogen. Sonst prüfte der Wächter
              // eine andere Runde, als die Form angeboten hat.
              for (const text of getippteTexte(form, ctxFuer(bis, lang, stufe, saat)))
                for (const ch of text) {
                  if (ch === " ") continue;
                  // Ein Großbuchstabe braucht seine GRUNDTASTE; ob die
                  // Umschalttaste dazugehört, ist Regel 2.
                  const grund = ch.toLowerCase();
                  expect(
                    ok.has(grund),
                    `${form.id} / ${name} / ${lang} / ${stufe}: « ${text} » braucht « ${ch} »`,
                  ).toBe(true);
                }
            }
      });
});

/* ── 2. Nie falsch fuer etwas, das noch nicht dran war ─────────────────── */

describe(`Vor der Umschalttaste zaehlt die klein geschriebene Antwort`, () => {
  /*
   * ★★★★★ Johannes' Befund vom 11.09.2026, über den ganzen Lehrgang geprüft.
   *
   * `trifft` ist die einzige Stelle, an der der Rätsel-Bildschirm vergleicht;
   * die Regel, WANN die Schreibung zählt, steht in `RaetselLauf` als
   * `grossKleinZaehltJetzt = grossKleinZaehlt && shiftLearned`. Hier wird
   * dieselbe Lage nachgestellt - und zwar an jedem Stand, an dem eine Form mit
   * `grossKleinZaehlt` überhaupt angeboten wird.
   */
  for (const { name, bis } of STAENDE)
    for (const lang of SPRACHEN)
      it(`${name} (${lang})`, () => {
        const ctxProbe = ctxFuer(bis, lang, "kids");
        const shiftGelernt = ctxProbe.introduced.includes(SHIFT_UNIT);
        for (const stufe of STUFEN)
          for (const form of UEBUNGSFORMEN) {
            if (form.eigenerBildschirm !== "raetsel" || !form.fragen) continue;
            const ctx = ctxFuer(bis, lang, stufe);
            if (!form.taugt(ctx)) continue;
            const zaehltJetzt = (form.grossKleinZaehlt ?? false) && shiftGelernt;
            for (const a of form.fragen(ctxFuer(bis, lang, stufe))) {
              // Die richtige Schreibung ist IMMER richtig.
              expect(
                trifft(a.antworten[0], a.antworten, zaehltJetzt),
                `${form.id} / ${name} / ${lang}: « ${a.antworten[0] } »`,
              ).toBe("richtig");
              if (shiftGelernt) continue;
              // Und ohne Umschalttaste im Tastenstand auch die kleine.
              expect(
                trifft(a.antworten[0].toLowerCase(), a.antworten, zaehltJetzt),
                `${form.id} / ${name} / ${lang}: « ${a.antworten[0].toLowerCase()} » ` +
                  `muss gelten - die Umschalttaste war noch nicht dran`,
              ).toBe("richtig");
            }
          }
      });
});

/* ── 3. Entweder genug Aufgaben oder taugt = false ─────────────────────── */

describe(`Wer sich anbietet, liefert auch eine Runde`, () => {
  for (const { name, bis } of STAENDE)
    for (const lang of SPRACHEN)
      it(`${name} (${lang})`, () => {
        for (const stufe of STUFEN)
          for (const form of UEBUNGSFORMEN) {
            const ctx = ctxFuer(bis, lang, stufe);
            if (!form.taugt(ctx)) continue;
            const ziel =
              form.eigenerBildschirm === "buchstabensalat"
                ? SALAT_ZIEL
                : form.eigenerBildschirm === "raetsel"
                  ? MINDEST_RAETSEL
                  : MINDEST_AUFGABEN;
            expect(
              anzahlAufgaben(form, ctxFuer(bis, lang, stufe)),
              `${form.id} / ${name} / ${lang} / ${stufe}: zu wenig - dann lieber ` +
                `taugt = false, bis der Vorrat reicht`,
            ).toBeGreaterThanOrEqual(ziel);
          }
      });
});

/* ── 4. Gesehenes und Erwartetes sind zeichengleich ────────────────────── */

describe(`Was fehlt hier? - das gesuchte Wort steht so da, wie es erwartet wird`, () => {
  /*
   * ★★★★ Prüfdurchgang 11.09.2026: Bis dahin schnitt `nurWort` das Satzzeichen
   * von der ANTWORT ab, nicht von der angezeigten Zeile - `Fische,` stand da,
   * `Fische` wurde erwartet. Wer genau abschrieb, hörte „Noch nicht". Gemessen
   * waren das je nach Stand 20 bis 137 der Kandidaten.
   */
  const wasfehlt = UEBUNGSFORMEN.find((f) => f.id === "wasfehlt")!;
  for (const { name, bis } of STAENDE)
    for (const lang of SPRACHEN)
      it(`${name} (${lang})`, () => {
        for (const stufe of STUFEN)
          for (let saat = 1; saat <= 3; saat += 1) {
            const ctx = ctxFuer(bis, lang, stufe, saat);
            if (!wasfehlt.taugt(ctx)) continue;
            for (const a of wasfehlt.fragen!(ctxFuer(bis, lang, stufe, saat))) {
              const zeileEins = a.frage.split(/Zeile zwei:|Line two:/)[0];
              expect(
                zeileEins.split(/\s+/).includes(a.antworten[0]),
                `${name} / ${lang} / ${stufe}: erwartet « ${a.antworten[0]} », ` +
                  `in der Zeile steht das nicht wörtlich: ${zeileEins}`,
              ).toBe(true);
            }
          }
      });
});

/* ── 5. „Was fehlt hier?": Ziffern erst ab der Ziffernreihe ──────────────── */
/*
 * Johannes 11.09.2026: „ja, erst ab Ziffernreihe". Getippt wird dort nie eine
 * Ziffer - VERGLICHEN aber schon („56 geteilt durch 7 ist 8." in beiden
 * Zeilen). Vor der Ziffernreihe darf kein Satz der Form eine Ziffer tragen.
 */
describe("Was fehlt hier - keine Ziffern vor der Ziffernreihe", () => {
  const wasfehlt = UEBUNGSFORMEN.find((f) => f.id === "wasfehlt")!;
  for (const { name, bis } of STAENDE)
    for (const lang of SPRACHEN)
      it(`${name} (${lang})`, () => {
        for (const stufe of STUFEN)
          for (let saat = 1; saat <= 3; saat += 1) {
            const ctx = ctxFuer(bis, lang, stufe, saat);
            if (!wasfehlt.taugt(ctx)) continue;
            const ziffernFrei = "0123456789".split("").every((z) => ctx.introduced.includes(z));
            if (ziffernFrei) continue;
            for (const a of wasfehlt.fragen!(ctxFuer(bis, lang, stufe, saat))) {
              expect(
                /\d/.test(a.frage),
                `${name} / ${lang} / ${stufe}: Ziffer vor der Ziffernreihe in: ${a.frage}`,
              ).toBe(false);
            }
          }
      });
});
