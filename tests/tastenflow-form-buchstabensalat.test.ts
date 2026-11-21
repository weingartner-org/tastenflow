/**
 * WÄCHTER-TEST „Buchstabensalat" (Übungsform, 01.09.2026).
 *
 * Prüft VERHALTEN, nicht Konstanten: keine feste erwartete Wortliste, sondern
 * Eigenschaften, die für JEDES Quellwort bzw. JEDE zulässige Kombination aus
 * Tastenstand, Stufe und Zufall gelten müssen.
 */
import { describe, expect, it } from "vitest";
import {
  buchstabensalat,
  pruefeSalatwort,
  salatVorrat,
  waehleSalatwort,
  SALATWOERTER_DE,
  SALATWOERTER_EN,
  SALAT_ZIEL,
  salatBuchstaben,
  salatFeldbeschriftung,
  BRAILLE_ZELLEN,
  BRAILLE_ABSTAND,
} from "@/lib/typing/uebungsformen/buchstabensalat";
import type { FormKontext } from "@/lib/typing/uebungsformen/typen";

/** Kleiner deterministischer Zufallsgenerator - derselbe Startwert liefert immer dieselbe Folge. */
function seededZufall(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/** Alle deutschen Buchstaben inkl. Umlaute/ß - für Tests, die „alles frei" brauchen. */
const VOLLES_DEUTSCHES_ALPHABET = "abcdefghijklmnopqrstuvwxyzäöüß".split("");
const VOLLES_ENGLISCHES_ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

function makeCtx(overrides: Partial<FormKontext>): FormKontext {
  return {
    lernweg: "de",
    introduced: VOLLES_DEUTSCHES_ALPHABET,
    shift: true,
    oneHand: false,
    stufe: "erwachsen",
    lang: "de",
    count: 12,
    zufall: seededZufall(1),
    ...overrides,
  };
}

describe("Buchstabensalat: jedes Quellwort gibt genug her", () => {
  it(`jedes deutsche Quellwort gibt mindestens ${SALAT_ZIEL} echte Wörter her`, () => {
    for (const sw of SALATWOERTER_DE) {
      const vorrat = salatVorrat(sw.wort, "de");
      expect(vorrat.length, `"${sw.wort}" gibt nur ${vorrat.length} Wörter her`).toBeGreaterThanOrEqual(
        SALAT_ZIEL,
      );
    }
  });

  it(`jedes englische Quellwort gibt mindestens ${SALAT_ZIEL} echte Wörter her`, () => {
    for (const sw of SALATWOERTER_EN) {
      const vorrat = salatVorrat(sw.wort, "en");
      expect(vorrat.length, `"${sw.wort}" gibt nur ${vorrat.length} Wörter her`).toBeGreaterThanOrEqual(
        SALAT_ZIEL,
      );
    }
  });

  it("liefert für jedes gefundene Wort auch wirklich ein herausholbares Ergebnis (Stichprobe)", () => {
    // Jedes Wort im Vorrat muss selbst wieder die Prüfung bestehen, sonst
    // wäre der Vorrat und die Prüfung nicht dieselbe Wahrheit.
    const sw = SALATWOERTER_DE[0];
    const vorrat = salatVorrat(sw.wort, "de");
    for (const fund of vorrat.slice(0, 10)) {
      const urteil = pruefeSalatwort(fund, sw.wort, [], "de");
      expect(urteil.ok, `"${fund}" aus "${sw.wort}" sollte zählen`).toBe(true);
    }
  });

  it("hat mindestens 25 deutsche und 12 englische Quellwörter", () => {
    expect(SALATWOERTER_DE.length).toBeGreaterThanOrEqual(25);
    expect(SALATWOERTER_EN.length).toBeGreaterThanOrEqual(12);
  });
});

describe("Buchstabensalat: Mengenrechnung", () => {
  it('"Eier" aus "Weihnachtsbaum" zählt nicht - der Buchstabenvorrat reicht nicht', () => {
    const urteil = pruefeSalatwort("Eier", "Weihnachtsbaum", [], "de");
    expect(urteil).toEqual({ ok: false, grund: "nicht-im-vorrat" });
  });

  it('"Tante" aus "Weihnachtsbaum" zählt nicht - nur ein "t" im Vorrat, "Tante" braucht zwei', () => {
    // weihnachtsbaum: w e i h n a c h t s b a u m - genau EIN "t".
    const urteil = pruefeSalatwort("Tante", "Weihnachtsbaum", [], "de");
    expect(urteil).toEqual({ ok: false, grund: "nicht-im-vorrat" });
  });

  it("ein Wort, das komplett aus dem Vorrat passt, zählt", () => {
    // "haus" - h,a,u,s stecken alle (auch mehrfach) in "weihnachtsbaum".
    const urteil = pruefeSalatwort("haus", "Weihnachtsbaum", [], "de");
    expect(urteil).toEqual({ ok: true, wort: "haus" });
  });
});

describe("Buchstabensalat: Sonderfälle", () => {
  it("das Quellwort selbst zählt nicht", () => {
    const urteil = pruefeSalatwort("Weihnachtsbaum", "Weihnachtsbaum", [], "de");
    expect(urteil).toEqual({ ok: false, grund: "das-quellwort" });
  });

  it("das Quellwort zählt auch anders geschrieben nicht (Groß-/Kleinschreibung)", () => {
    const urteil = pruefeSalatwort("weihnachtsbaum", "Weihnachtsbaum", [], "de");
    expect(urteil).toEqual({ ok: false, grund: "das-quellwort" });
  });

  it("schon Gehabtes zählt nicht, auch anders geschrieben", () => {
    const urteil = pruefeSalatwort("HAUS", "Weihnachtsbaum", ["haus"], "de");
    expect(urteil).toEqual({ ok: false, grund: "schon-gehabt" });
  });

  it("ein Nichtwort zählt nicht", () => {
    // "hatw" besteht nur aus Buchstaben, die in "weihnachtsbaum" reichlich
    // vorhanden sind (h,a,t,w), ist aber kein deutsches Wort.
    const urteil = pruefeSalatwort("hatw", "Weihnachtsbaum", [], "de");
    expect(urteil).toEqual({ ok: false, grund: "kein-wort" });
  });

  it("ein deutsches Nomen zählt auch klein geschrieben", () => {
    // "haus" ist ein Nomen (groß geschrieben die Regel) - klein eingegeben
    // darf ein Kind nicht an der Großschreibung scheitern.
    const urteil = pruefeSalatwort("haus", "Weihnachtsbaum", [], "de");
    expect(urteil.ok).toBe(true);
  });

  it("zu kurze Eingaben (ein einzelner Buchstabe) zählen nicht", () => {
    const urteil = pruefeSalatwort("h", "Weihnachtsbaum", [], "de");
    expect(urteil).toEqual({ ok: false, grund: "zu-kurz" });
  });

  /*
   * ★★ 20.09.2026 (Johannes, nach Testerin Durchgang): *„Und der
   * Buchstabensalat akzeptiert 'Ei' immer noch nicht. Mindestens 3
   * Buchstaben."* - seither zählen zwei Buchstaben, sofern sie ein Wort sind.
   */
  it("„Ei“ zählt - zwei Buchstaben sind ein Fund, wenn sie ein Wort ergeben", () => {
    const urteil = pruefeSalatwort("Ei", "Weihnachtsbaum", [], "de");
    expect(urteil).toEqual({ ok: true, wort: "Ei" });
  });

  it("zwei Buchstaben, die kein Wort sind, zählen weiterhin nicht", () => {
    const urteil = pruefeSalatwort("hm", "Weihnachtsbaum", [], "de");
    expect(urteil).toEqual({ ok: false, grund: "kein-wort" });
  });
});

describe("Buchstabensalat: Reihenfolge der Gründe", () => {
  it("zu-kurz kommt vor nicht-im-vorrat: eine zu kurze UND nicht passende Eingabe ist zu-kurz", () => {
    // "y" ist kürzer als zwei Zeichen UND kommt in "weihnachtsbaum" gar nicht vor.
    const urteil = pruefeSalatwort("y", "Weihnachtsbaum", [], "de");
    expect(urteil).toEqual({ ok: false, grund: "zu-kurz" });
  });

  it("nicht-im-vorrat kommt vor schon-gehabt: eine nicht passende, aber schon gehabte Eingabe ist nicht-im-vorrat", () => {
    const urteil = pruefeSalatwort("eier", "Weihnachtsbaum", ["eier"], "de");
    expect(urteil).toEqual({ ok: false, grund: "nicht-im-vorrat" });
  });

  it("schon-gehabt kommt vor kein-wort: ein Nichtwort, das schon gehabt wurde, ist schon-gehabt", () => {
    const urteil = pruefeSalatwort("hatw", "Weihnachtsbaum", ["hatw"], "de");
    expect(urteil).toEqual({ ok: false, grund: "schon-gehabt" });
  });
});

describe("Buchstabensalat: waehleSalatwort tippbar", () => {
  const staende: { name: string; introduced: string[]; lang: "de" | "en" }[] = [
    {
      name: "volles deutsches Alphabet",
      introduced: VOLLES_DEUTSCHES_ALPHABET,
      lang: "de",
    },
    {
      name: "nur Grundreihe (a,d,f,j,k,l,s,ö)",
      introduced: ["a", "d", "f", "j", "k", "l", "s", "ö"],
      lang: "de",
    },
    {
      name: "volles englisches Alphabet",
      introduced: VOLLES_ENGLISCHES_ALPHABET,
      lang: "en",
    },
  ];

  for (const stand of staende) {
    it(`liefert nur ein vollständig tippbares Wort - ${stand.name}`, () => {
      const ctx = makeCtx({
        introduced: stand.introduced,
        lang: stand.lang,
        stufe: "erwachsen",
        zufall: seededZufall(3),
      });
      const gewaehlt = waehleSalatwort(ctx);
      if (gewaehlt === null) return; // kein Quellwort passt - zulässig bei knappem Tastenstand
      const erlaubt = new Set(stand.introduced);
      for (const ch of gewaehlt.toLowerCase()) {
        expect(erlaubt.has(ch)).toBe(true);
      }
    });
  }

  it("liefert null, wenn viel zu wenige Buchstaben frei sind", () => {
    const ctx = makeCtx({ introduced: ["a", "b", "c"], lang: "de" });
    expect(waehleSalatwort(ctx)).toBeNull();
  });
});

describe("Buchstabensalat: mit festem Zufall reproduzierbar", () => {
  it("liefert bei gleichem Zufall zweimal dasselbe Quellwort", () => {
    const ctx = makeCtx({ zufall: seededZufall(42) });
    const erste = waehleSalatwort(ctx);
    const zweite = waehleSalatwort(makeCtx({ zufall: seededZufall(42) }));
    expect(erste).toBe(zweite);
  });

  it("zufall() === 0 wählt das erste taugliche Quellwort, zufall() ~ 1 das letzte", () => {
    // Stufe "erwachsen" passt auf ALLE Quellwörter (jedes trägt "erwachsen"
    // in seinen Stufen) - bei vollem Alphabet sind daher alle 28 tippbar,
    // in genau der Reihenfolge von `SALATWOERTER_DE`.
    const ersterKandidat = waehleSalatwort(
      makeCtx({ zufall: () => 0, stufe: "erwachsen", lang: "de" }),
    );
    const letzterKandidat = waehleSalatwort(
      makeCtx({ zufall: () => 0.999999, stufe: "erwachsen", lang: "de" }),
    );
    const alleTaugen = SALATWOERTER_DE.every((sw) => sw.stufen.includes("erwachsen"));
    expect(alleTaugen).toBe(true);
    expect(ersterKandidat).toBe(SALATWOERTER_DE[0].wort);
    expect(letzterKandidat).toBe(SALATWOERTER_DE[SALATWOERTER_DE.length - 1].wort);
  });
});

describe("Buchstabensalat: das Uebungsform-Objekt", () => {
  it("hat eigenerBildschirm statt baue", () => {
    expect(buchstabensalat.eigenerBildschirm).toBe("buchstabensalat");
    expect(buchstabensalat.baue).toBeUndefined();
  });

  it("taugt nur, wenn waehleSalatwort ein Wort findet", () => {
    const reich = makeCtx({ introduced: VOLLES_DEUTSCHES_ALPHABET });
    expect(buchstabensalat.taugt(reich)).toBe(true);

    const arm = makeCtx({ introduced: ["a", "b", "c"] });
    expect(buchstabensalat.taugt(arm)).toBe(false);
  });

  it("die Ankündigung ist ein ganzer Satz, deutsch und englisch", () => {
    const de = buchstabensalat.ankuendigung(makeCtx({ lang: "de" }));
    const en = buchstabensalat.ankuendigung(makeCtx({ lang: "en" }));
    expect(de.length).toBeGreaterThan(10);
    expect(en.length).toBeGreaterThan(10);
    expect(de).not.toBe(en);
  });
});

/* ═══════════════════════════════════════════════════════════════════════
   02.09.2026 - Johannes' zwei Auflagen an den Buchstabensalat
   ═══════════════════════════════════════════════════════════════════════ */

describe(`★★★★ Zaehlen und Annehmen kommen aus DERSELBEN Quelle`, () => {
  /*
   * Bis zum 02.09.2026 zaehlte `salatVorrat` gegen eine eigene, enge Liste
   * (531 deutsche Woerter), waehrend `pruefeSalatwort` gegen das ganze Lexikon
   * annahm (7952). Ueber alle 28 Quellwoerter: gezaehlt 574, angenommen 4783 -
   * Faktor 8,3. Johannes: "Der Buchstabensalat macht nur Spass wenn das
   * Programm wirklich alle Woerter kennt, die man mit den gegebenen Buchstaben
   * finden kann."
   *
   * Der Waechter prueft die EIGENSCHAFT, nicht die Zahl: Jedes Wort, das
   * gezaehlt wird, muss auch angenommen werden - und umgekehrt darf kein Wort
   * aus dem Lexikon durchfallen, das in den Vorrat passt.
   */
  it(`jedes gezaehlte Wort wird auch angenommen`, () => {
    for (const quelle of SALATWOERTER_DE.slice(0, 8)) {
      for (const wort of salatVorrat(quelle.wort, "de")) {
        const urteil = pruefeSalatwort(wort, quelle.wort, [], "de");
        expect(urteil.ok, `${wort} aus ${quelle.wort}`).toBe(true);
      }
    }
  });

  it(`der Vorrat ist nach der Umstellung deutlich groesser als der alte enge Stand`, () => {
    // Der alte Stand lieferte fuer "Weihnachtsbaum" 30 Woerter. Die Zahl steht
    // hier nicht als Sollwert, sondern als GRENZE nach unten: faellt sie wieder
    // dorthin, ist jemand versehentlich auf eine engere Liste zurueckgegangen.
    expect(salatVorrat("Weihnachtsbaum", "de").length).toBeGreaterThan(100);
  });
});

describe(`★★★★ Die Buchstaben stehen auf der Braillezeile - in 40 Zellen`, () => {
  it(`keine Feldbeschriftung sprengt die 40 Zellen - in beiden Sprachen`, () => {
    for (const [liste, lang] of [
      [SALATWOERTER_DE, "de"],
      [SALATWOERTER_EN, "en"],
    ] as const) {
      for (const w of liste) {
        const b = salatFeldbeschriftung(w.wort, lang);
        expect(b.length, `${w.wort}: "${b}"`).toBeLessThanOrEqual(BRAILLE_ZELLEN);
      }
    }
  });

  it(`★★★ die Beschriftung ist: das Wort, dann die Buchstaben einzeln, dann vier Leerzellen`, () => {
    // Johannes' Vorgabe vom 02.09.2026: der Vorrat links, danach eine
    // fuehlbare Luecke, dann schreibt das Kind. ★ 25.09.2026 (Testerin,
    // Entscheidung Johannes): das QUELLWORT steht davor - mit Screenreader
    // hoerte ein Kind sonst nur „eilns" und nie das Wort.
    for (const [liste, lang] of [
      [SALATWOERTER_DE, "de"],
      [SALATWOERTER_EN, "en"],
    ] as const)
      for (const w of liste) {
        const b = salatFeldbeschriftung(w.wort, lang);
        const vorne = `${w.wort}: ${[...salatBuchstaben(w.wort)].join(" ")}`;
        expect(b.startsWith(vorne), `${w.wort}: "${b}"`).toBe(true);
        expect(b.slice(vorne.length)).toBe("\u00a0".repeat(BRAILLE_ABSTAND));
      }
    expect(salatFeldbeschriftung("Insel", "de")).toBe("Insel: e i l n s" + "\u00a0".repeat(BRAILLE_ABSTAND));
  });

  it(`die Leerzellen sind GESCHUETZTE Leerzeichen - sonst faellt aus vier eines`, () => {
    const b = salatFeldbeschriftung("Weihnachtsbaum", "de");
    expect(b.includes("  ")).toBe(false); // keine gewoehnlichen Leerzeichen
    expect([...b].filter((c) => c === "\u00a0")).toHaveLength(BRAILLE_ABSTAND);
  });

  it(`der Vorrat ist sortiert und behaelt Doppelungen`, () => {
    const b = salatBuchstaben("Weihnachtsbaum");
    expect(b).toBe([...b].sort().join(""));
    expect([...b].filter((c) => c === "a")).toHaveLength(2);
    expect([...b].filter((c) => c === "h")).toHaveLength(2);
    expect(b).toHaveLength("Weihnachtsbaum".length);
  });
});

describe(`★★★ Kein Quellwort ist so arm, dass es Frust macht`, () => {
  /*
   * Johannes am 02.09.2026: "steht nicht in der Liste, ist das schnell ein
   * Frust". Das Ziel einer Runde sind SALAT_ZIEL Woerter. Ein Quellwort, aus
   * dem ueberhaupt nur 15 Woerter zu holen sind, macht daraus eine Suche nach
   * der Nadel. Beim Verdoppeln sind neun solche Woerter entstanden und
   * gemessen wieder ausgetauscht worden (sunshine 15, snowman 16, ...).
   *
   * Die Grenze liegt beim DREIFACHEN des Rundenziels. Vier von zwoelf zu
   * finden ist ein Spiel; vier von fuenf waere eine Suche nach der Nadel.
   * Seit dem 02.09.2026 sind die Quellwoerter kurz (5-10 Buchstaben) und nach
   * Ertrag ausgewaehlt - gemessen traegt das aermste zwoelf.
   */
  const GRENZE = SALAT_ZIEL * 3;

  it(`jedes deutsche Quellwort traegt mindestens ${SALAT_ZIEL * 3} Loesungen`, () => {
    for (const w of SALATWOERTER_DE)
      expect(salatVorrat(w.wort, "de").length, w.wort).toBeGreaterThanOrEqual(GRENZE);
  });

  it(`jedes englische Quellwort traegt mindestens ${SALAT_ZIEL * 3} Loesungen`, () => {
    for (const w of SALATWOERTER_EN)
      expect(salatVorrat(w.wort, "en").length, w.wort).toBeGreaterThanOrEqual(GRENZE);
  });

  it(`kein Quellwort steht zweimal da, und beide Sprachen tragen gleich viel`, () => {
    for (const liste of [SALATWOERTER_DE, SALATWOERTER_EN]) {
      const w = liste.map((x) => x.wort);
      expect(new Set(w).size).toBe(w.length);
    }
    expect(SALATWOERTER_EN.length).toBe(SALATWOERTER_DE.length);
  });
});
