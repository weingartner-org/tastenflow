/**
 * Der WÄCHTER über das Iglu-Raten (Testerin Galgenmännchen, 23.10.2026).
 *
 * Geprüft wird, was für ein Kind zählt:
 *  - jedes Wort ist mit dem Tastenstand tippbar (sonst Aufgabe gegen das Kind),
 *  - ein Tastendruck bekommt IMMER eine Antwort, ein „schon getippt" und ein
 *    Nicht-Buchstabe kosten keinen Block,
 *  - der Iglu steht nach acht falschen Buchstaben, ohne ein Wort wie
 *    „verloren" / „falsch" / „Galgen" - in KEINER Sprache,
 *  - das Wort mit Lücken steht im Feld-Label (Braillezeile), nicht nur im Bild,
 *  - jeder Buchstabe wird als Übung gemeldet (sonst geht Übezeit verloren).
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
  IGLU_BLOECKE,
  igluFeldbeschriftung,
  igluGeloest,
  igluMaske,
  igluVorrat,
  iglu,
  rateBuchstabe,
  waehleIgluwort,
} from "@/lib/typing/uebungsformen/iglu";
import { IgluLauf, IGLU_TEXTE } from "@/components/typing/IgluLauf";
import { sprechStuecke, zusammenfassen } from "@/components/typing/wortspielSprache";
import { FORM_HINWEISE, FORM_NAMEN } from "@/lib/typing/uebungsformen";
import type { FormKontext } from "@/lib/typing/uebungsformen";
import { fitText } from "@/lib/typing/corpus";

afterEach(cleanup);

function festerZufall(saat: number): () => number {
  let z = saat >>> 0;
  return () => {
    z = (z * 1664525 + 1013904223) >>> 0;
    return z / 4294967296;
  };
}
const VOLL = [..."abcdefghijklmnopqrstuvwxyzäöüß".split(""), "⇧", ".", ",", "-"];
function ctxMit(introduced: string[], extra: Partial<FormKontext> = {}): FormKontext {
  return {
    lernweg: "de",
    introduced,
    shift: introduced.includes("⇧"),
    oneHand: false,
    stufe: "teens",
    lang: "de",
    count: 12,
    zufall: festerZufall(3),
    ...extra,
  };
}

describe("Iglu-Raten: Wortwahl", () => {
  it("jedes Wort ist mit dem Tastenstand tippbar", () => {
    for (const eingefuehrt of [VOLL, [..."asdfjklöe".split("")], [..."asdfjklöeiurnt".split("")]]) {
      const ctx = ctxMit(eingefuehrt);
      const erlaubt = new Set(eingefuehrt);
      for (const w of igluVorrat(ctx)) {
        expect(fitText(w, erlaubt), w).toBe(w);
        expect(w.length).toBeGreaterThanOrEqual(4);
      }
    }
  });

  it("Kinder bekommen kürzere Wörter und den ersten Buchstaben geschenkt", () => {
    const kids = igluVorrat(ctxMit(VOLL, { stufe: "kids" }));
    expect(kids.length).toBeGreaterThan(0);
    expect(Math.max(...kids.map((w) => w.length))).toBeLessThanOrEqual(6);
  });

  it("wird bei zu wenigen Tasten nicht angeboten, mit allen Tasten schon", () => {
    expect(iglu.taugt(ctxMit(["a", "s"]))).toBe(false);
    expect(iglu.taugt(ctxMit(VOLL))).toBe(true);
  });

  it("wiederholt kein Wort, solange frische da sind", () => {
    const ctx = ctxMit(VOLL);
    const gehabt: string[] = [];
    for (let i = 0; i < 5; i++) {
      const w = waehleIgluwort(ctx, gehabt)!;
      expect(gehabt).not.toContain(w);
      gehabt.push(w);
    }
  });
});

describe("Iglu-Raten: Prüfung", () => {
  it("Treffer, Daneben, Schon, Nicht-Buchstabe", () => {
    expect(rateBuchstabe("hallo", [], "L", "de")).toEqual({ art: "treffer", buchstabe: "l", anzahl: 2 });
    expect(rateBuchstabe("hallo", [], "x", "de")).toEqual({ art: "daneben", buchstabe: "x" });
    expect(rateBuchstabe("hallo", ["a"], "a", "de")).toEqual({ art: "schon", buchstabe: "a" });
    expect(rateBuchstabe("hallo", [], "5", "de").art).toBe("kein-buchstabe");
    expect(rateBuchstabe("hallo", [], " ", "de").art).toBe("kein-buchstabe");
  });

  it("Türkisch: I und İ sind verschiedene Buchstaben", () => {
    expect(rateBuchstabe("kış", [], "I", "tr")).toEqual({ art: "treffer", buchstabe: "ı", anzahl: 1 });
    expect(rateBuchstabe("kış", [], "İ", "tr").art).toBe("daneben");
  });

  it("Maske und Label: Lücken als Unterstrich, vier geschützte Leerzeichen für die Braillezeile", () => {
    expect(igluMaske("hallo", ["l"], "de")).toEqual([null, null, "l", "l", null]);
    expect(igluGeloest("hallo", ["h", "a", "l", "o"], "de")).toBe(true);
    expect(igluFeldbeschriftung("hallo", ["l"], "de")).toBe("_ _ l l _" + " ".repeat(4));
  });
});

function Spiel({
  wort = "hallo",
  meldungen = [],
  fertig = () => {},
}: {
  wort?: string;
  meldungen?: Array<Record<string, unknown>>;
  fertig?: () => void;
}) {
  // Wort festnageln: ein Vorrat mit genau diesem Wort.
  const ctx = ctxMit(VOLL, { zufall: () => 0 });
  const w = waehleIgluwort(ctx) ?? wort;
  return (
    <IgluLauf
      ctx={ctx}
      ankuendigung="Jetzt kommt das Iglu-Raten."
      contextId="form:iglu"
      onAufgabeFertig={(e) => meldungen.push(e as unknown as Record<string, unknown>)}
      onFertig={fertig}
      onAbbruch={() => {}}
      key={w}
    />
  );
}
function tippe(b: string) {
  fireEvent.change(screen.getByRole("textbox"), { target: { value: b } });
}

describe("Iglu-Raten: Bildschirm", () => {
  it("zeigt das Wort mit Lücken im Feld-Label und meldet jeden Buchstaben als Übung", () => {
    const meldungen: Array<Record<string, unknown>> = [];
    render(<Spiel meldungen={meldungen} />);
    const ctx = ctxMit(VOLL, { zufall: () => 0 });
    const wort = waehleIgluwort(ctx)!;
    const label = screen.getByLabelText((_, el) => el?.tagName === "INPUT") as HTMLInputElement;
    const labelText = document.querySelector(`label[for="${label.id}"]`)!.textContent!;
    expect(labelText).toContain("_");
    const buchstabe = [...wort][1];
    tippe(buchstabe);
    expect(meldungen).toHaveLength(1);
    expect(meldungen[0].lesson).toBe("form:iglu");
    expect(typeof meldungen[0].activeMs).toBe("number");
    expect(document.querySelector(`label[for="${label.id}"]`)!.textContent).toContain(buchstabe);
  });

  it("antwortet auf einen Nicht-Buchstaben und baut dafür keinen Block", () => {
    render(<Spiel />);
    tippe("7");
    expect(screen.getByText(/kein Buchstabe/)).toBeInTheDocument();
    expect(screen.getAllByText(/Block 0 von 8/).length).toBeGreaterThan(0);
  });

  it("zählt jeden Buchstaben eines eingefügten Blocks und rechnet dicht aufeinanderfolgende Anschläge nacheinander", () => {
    render(<Spiel />);
    const wort = waehleIgluwort(ctxMit(VOLL, { zufall: () => 0 }))!;
    const falsche = [..."qxyjvkwzpbfg"].filter((b) => !wort.includes(b)).slice(0, 3);
    tippe(falsche.join(""));
    expect(screen.getAllByText(/Block 3 von 8/).length).toBeGreaterThan(0);
  });

  it("nach acht falschen Buchstaben steht der Iglu, das Wort wird genannt - ohne ein Wort der Niederlage", () => {
    render(<Spiel />);
    const wort = waehleIgluwort(ctxMit(VOLL, { zufall: () => 0 }))!;
    const falsche = [..."qxyjvkwzpbfg"].filter((b) => !wort.includes(b)).slice(0, IGLU_BLOECKE);
    expect(falsche).toHaveLength(IGLU_BLOECKE);
    for (const b of falsche) tippe(b);
    expect(screen.getByText(/Der Iglu steht/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nächstes Wort" })).toBeInTheDocument();
    // Das verratene Wort steht auch im Feld-Label (Braillezeile), nicht nur im Satz.
    const feld = screen.getByRole("textbox") as HTMLInputElement;
    expect(document.querySelector(`label[for="${feld.id}"]`)!.textContent).not.toContain("_");
    const text = document.body.textContent ?? "";
    expect(text).not.toMatch(/verloren|falsch|gescheitert|Galgen|tot/i);
  });

  it("alle Spieltexte: in jeder Sprache ohne Wörter der Niederlage und ohne lange Striche", () => {
    const verboten = /verloren|falsch|gescheitert|Galgen|hangman|perdu|perdido|perso|przegra|kaybet|prohr|[–—]/i;
    for (const [sprache, t] of Object.entries(IGLU_TEXTE)) {
      const alle = Object.values(t).map((v) =>
        typeof v === "function" ? (v as (...a: never[]) => string)(...([1, 8, "x"] as never[])) : v,
      );
      for (const satz of alle) expect(String(satz), sprache).not.toMatch(verboten);
    }
    for (const sprache of Object.keys(FORM_NAMEN) as Array<keyof typeof FORM_NAMEN>) {
      expect(FORM_NAMEN[sprache].iglu.length, sprache).toBeGreaterThan(3);
      expect(FORM_HINWEISE[sprache].iglu, sprache).not.toMatch(verboten);
    }
  });
});

describe("Iglu-Raten: Pause vor „Offene Lücken\" (Testerin, 25.10.2026)", () => {
  it("der letzte Buchstabe und „Offene Lücken\" sind zwei Äußerungen, nicht eine", () => {
    // Vorher EIN Satz: „H, Lücke, U, S. Offene Lücken: 1." - nach dem einzelnen „S." las die
    // Stimme das als Abkürzung und lief ohne Pause weiter.
    const teile = [
      { text: "H", inhalt: true as const },
      { text: ", Lücke, " },
      { text: "S", inhalt: true as const },
      { text: "." },
      { text: " " },
      { text: IGLU_TEXTE.de.offen(1), pause: true as const },
    ];
    const stuecke = zusammenfassen(sprechStuecke(teile, "de", "de"));
    expect(stuecke.map((s) => s.text)).toEqual(["H, Lücke, S.", "Offene Lücken: 1."]);
  });

  it("ohne Pause-Marke bleibt alles eine Äußerung wie bisher", () => {
    const stuecke = zusammenfassen(sprechStuecke([{ text: "Ja, " }, { text: "S", inhalt: true }, { text: " ist dabei." }], "de", "de"));
    expect(stuecke).toHaveLength(1);
  });
});
