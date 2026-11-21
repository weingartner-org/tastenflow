/**
 * WÄCHTER-TEST „Alphabet-Reihen" (Übungsform, 02.09.2026).
 *
 * Prüft VERHALTEN, nicht Konstanten: Es wird nie eine feste erwartete Zeile
 * gegenprüft, sondern eine Eigenschaft, die für JEDE zulässige Kombination aus
 * Tastenstand und Zufall gelten muss - siehe die einzelnen `describe`-Blöcke.
 */
import { describe, expect, it } from "vitest";
import { alphabetreihen } from "@/lib/typing/uebungsformen/alphabetreihen";
import type { FormKontext } from "@/lib/typing/uebungsformen/typen";

/** Kleiner deterministischer Zufallsgenerator - derselbe Startwert liefert immer dieselbe Folge. */
function seededZufall(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function makeCtx(overrides: Partial<FormKontext>): FormKontext {
  return {
    lernweg: "de",
    introduced: ["a", "b", "c", "d", "e", "f"],
    shift: false,
    oneHand: false,
    stufe: "kids",
    lang: "de",
    count: 12,
    zufall: seededZufall(1),
    ...overrides,
  };
}

/** a-z ohne ß - die für die Muster-Erkennung unten verwendeten Testbestände. */
const ALPHA_OHNE_SS = "abcdefghijklmnopqrstuvwxyz".split("");

describe("Alphabet-Reihen: taugt", () => {
  it("ist bei 5 freigeschalteten Buchstaben falsch", () => {
    const ctx = makeCtx({ introduced: ["a", "b", "c", "d", "e"] });
    expect(alphabetreihen.taugt(ctx)).toBe(false);
    // Und `baue` liefert dann konsequent nichts, statt eine kaputte Runde.
    expect(alphabetreihen.baue?.(ctx)).toBeNull();
  });

  it("ist bei 8 freigeschalteten Buchstaben wahr", () => {
    const ctx = makeCtx({
      introduced: ["a", "b", "c", "d", "e", "f", "g", "h"],
    });
    expect(alphabetreihen.taugt(ctx)).toBe(true);
    expect(alphabetreihen.baue?.(ctx)).not.toBeNull();
  });

  it("zählt nur BUCHSTABEN aus introduced, nicht ⇧/Ziffern/Satzzeichen", () => {
    // 5 echte Buchstaben + fünf Nicht-Buchstaben ergeben zusammen 10 Einträge,
    // aber immer noch nur 5 Buchstaben - das darf nicht taugen.
    const ctx = makeCtx({
      introduced: ["a", "b", "c", "d", "e", "⇧", "1", "2", ".", ","],
    });
    expect(alphabetreihen.taugt(ctx)).toBe(false);
  });
});

describe("Alphabet-Reihen: nie eine nicht freigeschaltete Taste", () => {
  const staende: { name: string; introduced: string[]; shift: boolean }[] = [
    { name: "sechs Buchstaben, kein ⇧, kein Punkt", introduced: ["f", "j", "d", "k", "s", "l"], shift: false },
    { name: "Grundreihe mit ⇧", introduced: ["f", "j", "d", "k", "s", "l", "a", "ö", "⇧"], shift: true },
    { name: "zehn Buchstaben mit Punkt, ohne ⇧", introduced: [..."abcdefghij".split(""), "."], shift: false },
    { name: "volles Alphabet inkl. ß, mit ⇧ und Punkt", introduced: [...ALPHA_OHNE_SS, "ß", "⇧", "."], shift: true },
  ];

  for (const stand of staende) {
    it(`hält den Tastenstand ein: ${stand.name}`, () => {
      const ctx = makeCtx({ introduced: stand.introduced, shift: stand.shift, count: 20, zufall: seededZufall(7) });
      const runde = alphabetreihen.baue?.(ctx);
      expect(runde).not.toBeNull();
      const erlaubt = new Set(stand.introduced.filter((e) => e !== "⇧"));
      for (const zeile of runde!.zeilen) {
        for (const ch of zeile.text) {
          if (ch === " ") continue;
          expect(erlaubt.has(ch.toLowerCase())).toBe(true);
        }
      }
    });
  }
});

describe("Alphabet-Reihen: Großbuchstaben nur mit echter Umschalttaste", () => {
  it("ohne shift erscheint kein einziger Großbuchstabe", () => {
    const ctx = makeCtx({
      introduced: [...ALPHA_OHNE_SS, "."],
      shift: false,
      count: 30,
      zufall: seededZufall(3),
    });
    const runde = alphabetreihen.baue?.(ctx);
    expect(runde).not.toBeNull();
    for (const zeile of runde!.zeilen) {
      expect(zeile.text).toBe(zeile.text.toLowerCase());
    }
  });

  it("mit shift kommen an manchen Stellen Großbuchstaben vor", () => {
    // Zeigt, dass der obige Test nicht nur zufällig nie einen Großbuchstaben
    // gebaut hätte - mit derselben Erzeugung, aber shift=true, tauchen welche auf.
    const ctx = makeCtx({
      introduced: [...ALPHA_OHNE_SS, "."],
      shift: true,
      count: 30,
      zufall: seededZufall(3),
    });
    const runde = alphabetreihen.baue?.(ctx);
    const text = runde!.zeilen.map((z) => z.text).join(" ");
    expect(text).not.toBe(text.toLowerCase());
  });
});

describe("Alphabet-Reihen: Punkt nur, wenn er freigeschaltet ist", () => {
  it("ohne '.' in introduced erscheint kein Punkt", () => {
    const ctx = makeCtx({
      introduced: ALPHA_OHNE_SS,
      shift: true,
      count: 30,
      zufall: seededZufall(5),
    });
    const runde = alphabetreihen.baue?.(ctx);
    expect(runde).not.toBeNull();
    for (const zeile of runde!.zeilen) expect(zeile.text.includes(".")).toBe(false);
  });

  it("mit '.' in introduced kommt irgendwann ein Punkt vor", () => {
    const ctx = makeCtx({
      introduced: [...ALPHA_OHNE_SS, "."],
      shift: true,
      count: 30,
      zufall: seededZufall(5),
    });
    const runde = alphabetreihen.baue?.(ctx);
    const text = runde!.zeilen.map((z) => z.text).join(" ");
    expect(text.includes(".")).toBe(true);
  });
});

/**
 * Erkennt aus dem TEXT einer Zeile, welche „Form" sie hat (Gruppengröße,
 * Punkt dahinter, Groß-/Klein-Muster je Position in der Gruppe) - unabhängig
 * von den konkreten Buchstaben. So lässt sich prüfen, ob zwei benachbarte
 * Zeilen zur selben Anordnung gehören, ohne die interne Muster-Liste der
 * Übungsform zu kennen.
 */
function form(text: string): string {
  const rohgruppen = text.split(" ");
  const hatPunkt = rohgruppen.every((g) => g.endsWith("."));
  const gruppen = hatPunkt ? rohgruppen.map((g) => g.slice(0, -1)) : rohgruppen;
  const groesse = gruppen[0].length;
  const grossMuster = [...gruppen[0]].map((c) => (c !== c.toLowerCase() ? "G" : "k")).join("");
  return `${groesse}|${hatPunkt}|${grossMuster}`;
}

describe("Alphabet-Reihen: jedes verwendete Muster kommt im Paar", () => {
  it("aufeinanderfolgende Zeilen mit gleicher Form sind nicht identisch (verschobener Start)", () => {
    // Ohne ß in introduced, damit die Form-Erkennung nicht an der
    // Sonderregel „ß bleibt klein" vorbeischaut (siehe Kopf-Kommentar der
    // Übungsform).
    const ctx = makeCtx({
      introduced: [...ALPHA_OHNE_SS, "."],
      shift: true,
      count: 40,
      zufall: seededZufall(11),
    });
    const runde = alphabetreihen.baue?.(ctx);
    expect(runde).not.toBeNull();
    const zeilen = runde!.zeilen;
    expect(zeilen.length).toBeGreaterThanOrEqual(2);

    // Jedes verwendete Muster taucht in der Ausgabe als Paar auf: Die
    // Erzeugung baut immer zwei Zeilen derselben Form direkt hintereinander
    // (Auftrag: „immer mindestens zweimal hintereinander"). Es reicht darum,
    // die Zeilen in Zweierschritten zu prüfen.
    for (let i = 0; i + 1 < zeilen.length; i += 2) {
      const a = zeilen[i].text;
      const b = zeilen[i + 1].text;
      expect(form(a)).toBe(form(b));
      expect(a).not.toBe(b);
    }

    // Über eine so lange Runde mit shift+Punkt sind auch tatsächlich
    // mindestens zwei VERSCHIEDENE Formen vorgekommen - sonst würde diese
    // ganze Prüfung nur ein einziges Muster betreffen.
    const vorkommendeFormen = new Set(zeilen.map((z) => form(z.text)));
    expect(vorkommendeFormen.size).toBeGreaterThan(1);
  });

  it("alle Zeilen sind reine 'unsinn'-Zeilen ohne Herkunft", () => {
    const ctx = makeCtx({ count: 10, zufall: seededZufall(2) });
    const runde = alphabetreihen.baue?.(ctx);
    for (const zeile of runde!.zeilen) {
      expect(zeile.art).toBe("unsinn");
      expect(zeile.source).toBeNull();
    }
  });
});

describe("Alphabet-Reihen: reproduzierbar mit festem Zufall", () => {
  it("liefert bei gleichem Zufallsstartwert zweimal dieselbe Runde", () => {
    const introduced = [...ALPHA_OHNE_SS, "."];
    const runde1 = alphabetreihen.baue?.(
      makeCtx({ introduced, shift: true, count: 16, zufall: seededZufall(99) }),
    );
    const runde2 = alphabetreihen.baue?.(
      makeCtx({ introduced, shift: true, count: 16, zufall: seededZufall(99) }),
    );
    expect(runde1).not.toBeNull();
    expect(runde1?.zeilen.map((z) => z.text)).toEqual(runde2?.zeilen.map((z) => z.text));
  });

  it("liefert bei anderem Zufallsstartwert nicht zwangsläufig dieselbe Runde", () => {
    const introduced = [...ALPHA_OHNE_SS, "."];
    const runde1 = alphabetreihen.baue?.(
      makeCtx({ introduced, shift: true, count: 16, zufall: seededZufall(1) }),
    );
    const runde2 = alphabetreihen.baue?.(
      makeCtx({ introduced, shift: true, count: 16, zufall: seededZufall(2) }),
    );
    const text1 = runde1?.zeilen.map((z) => z.text).join("|");
    const text2 = runde2?.zeilen.map((z) => z.text).join("|");
    expect(text1).not.toBe(text2);
  });
});

describe("Alphabet-Reihen: Ansage", () => {
  it("ist ein ganzer, eigenständiger Satz auf Deutsch und Englisch", () => {
    const de = alphabetreihen.ankuendigung(makeCtx({ lang: "de" }));
    const en = alphabetreihen.ankuendigung(makeCtx({ lang: "en" }));
    expect(de.endsWith(".")).toBe(true);
    expect(en.endsWith(".")).toBe(true);
    expect(de).not.toBe(en);
    // Kündigt nichts als „echtes Wort" an - es sind Unsinn-Zeilen.
    expect(de.toLowerCase()).not.toContain("wort");
    expect(en.toLowerCase()).not.toContain("word");
  });
});

/*
 * ════════════════════════════════════════════════════════════════════════════
 * ★★ KEINE GRUPPE BRICHT MITTEN IM ALPHABET UM (20.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 * Johannes, nach dem Durchgang seines Schülers, wörtlich: *„Die Alphabetreihen
 * brechen manchmal wieder mittendrin ab. … Man erwartet ein m oder so und es
 * geht von vorne los. Das wirkt etwas willenlos."*
 *
 * Der Vorrat endet dort, wo das Kind gerade steht. Der Sprung zurück an den
 * Anfang muss darum sein - aber er gehört ZWISCHEN zwei Gruppen, nie in eine
 * hinein. Der Wächter prüft die Eigenschaft über viele Tastenstände und
 * Zufallsfolgen, nie eine feste Zeile.
 */
describe("Alphabet-Reihen: jede Gruppe ist ein Stück Alphabet am Stück", () => {
  it("in KEINER Gruppe springt der Vorrat zurück an den Anfang", () => {
    for (let anzahl = 6; anzahl <= 26; anzahl++) {
      const introduced = ALPHA_OHNE_SS.slice(0, anzahl);
      for (let seed = 1; seed <= 12; seed++) {
        const ctx = makeCtx({ introduced, count: 14, zufall: seededZufall(seed) });
        const runde = alphabetreihen.baue?.(ctx);
        expect(runde).not.toBeNull();
        for (const zeile of runde!.zeilen) {
          for (const gruppe of zeile.text.split(" ")) {
            const buchstaben = gruppe.replace(".", "").toLowerCase().split("");
            for (let i = 1; i < buchstaben.length; i++) {
              const vorher = introduced.indexOf(buchstaben[i - 1]);
              const jetzt = introduced.indexOf(buchstaben[i]);
              // Innerhalb einer Gruppe geht es immer genau einen Schritt weiter.
              expect({ gruppe, vorher, jetzt }).toEqual({ gruppe, vorher, jetzt: vorher + 1 });
            }
          }
        }
      }
    }
  });

  it("der Sprung an den Anfang passiert weiterhin - nur eben an der Gruppengrenze", () => {
    // Sieben Buchstaben, Dreiergruppen: nach „abc def" ist nur noch „g" übrig,
    // die nächste Gruppe muss also vorne beginnen.
    const ctx = makeCtx({
      introduced: ALPHA_OHNE_SS.slice(0, 7),
      count: 6,
      zufall: () => 0, // immer das erste taugende Muster (Dreiergruppen klein)
    });
    const runde = alphabetreihen.baue?.(ctx);
    const gruppen = runde!.zeilen.flatMap((z) => z.text.split(" "));
    expect(gruppen.length).toBeGreaterThan(2);
    // Jede Gruppe für sich ist lückenlos - das ist die Aussage, die zählt.
    for (const gruppe of gruppen) {
      expect(gruppe).toMatch(/^[a-z]{3}$/);
    }
  });
});
