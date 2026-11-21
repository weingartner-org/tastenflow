/**
 * ★★ WÄCHTER: „Grundstellung prüfen" (D-8, 28.09.2026).
 *
 * Das Kind drückt alle acht Grundtasten zugleich; das Programm sagt, ob die
 * Finger richtig liegen (Vorbild „A sus puestos", Mekanta/ONCE).
 *
 * Was hier gemessen wird:
 *  1. Die acht Tasten kommen aus der TASTATUR - und stimmen mit der Grundreihe
 *     jedes Lernwegs überein (`achteGrundtasteFuerLayout`).
 *  2. ★★★ ROLLOVER: Eine Tastatur, die nicht acht Tasten zugleich meldet,
 *     erzeugt nie einen „Fehler" - sondern die freundliche Bitte, die
 *     fehlende Taste noch einmal zu drücken; danach gilt es als richtig.
 *  3. Wer wirklich daneben liegt, erfährt, welcher Finger und wohin.
 *  4. Das Bauteil schreibt das Ergebnis in das Feld (Braillezeile) und hat
 *     KEINEN Live-Bereich; Esc führt zurück; im Regal steht der Platz immer.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { layoutById, setLayout, type LayoutId } from "@/lib/typing/layouts";
import { achteGrundtasteFuerLayout } from "@/lib/typing/letters";
import { lernwegDef, type Lernweg } from "@/lib/typing/lernweg";
import {
  GrundstellungsPruefung,
  NACHREICHEN_MS,
  befundSatz,
  grundstellungAnleitung,
  grundtastenFuer,
  werteAus,
  tastenOrtFuer,
  type Befund,
} from "@/lib/typing/grundstellung";
import { GrundstellungPruefen } from "@/components/typing/GrundstellungPruefen";
import { Wortspiele } from "@/components/typing/Wortspiele";
import type { Lang, TypingProgress } from "@/lib/typing";

afterEach(cleanup);

const DE = layoutById("de");
const US = layoutById("us");
const GRUND_CODES = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL", "Semicolon"];

/** Ein Ablauf aus Tastenereignissen; liefert alle Befunde, die kamen. */
function fahre(
  p: GrundstellungsPruefung,
  schritte: readonly (readonly ["down" | "up", string, number?])[],
): Befund[] {
  const out: Befund[] = [];
  for (const [art, code, zeit = 0] of schritte) {
    const b = p.taste({ art, code, key: "x", zeit });
    if (b) out.push(b);
  }
  return out;
}
const runter = (codes: readonly string[], zeit = 0) => codes.map((c) => ["down", c, zeit] as const);
const hoch = (codes: readonly string[], zeit = 0) => codes.map((c) => ["up", c, zeit] as const);

describe("die acht Grundtasten kommen aus der Tastatur", () => {
  it.each([
    ["de", "a s d f j k l ö"],
    ["ch", "a s d f j k l ö"],
    ["us", "a s d f j k l ;"],
    ["uk", "a s d f j k l ;"],
    ["fr", "q s d f j k l m"],
    ["be", "q s d f j k l m"],
    ["es", "a s d f j k l ñ"],
    ["latam", "a s d f j k l ñ"],
  ] as const)("%s: %s", (id, erwartet) => {
    expect(grundtastenFuer(layoutById(id)).map((g) => g.zeichen).join(" ")).toBe(erwartet);
  });

  // ★ Nicht abgeschrieben: dieselbe Grundreihe, die der Lernweg auf dieser
  // Tastatur lehrt (die ersten acht seiner Reihenfolge).
  it.each([
    ["de", "de"],
    ["de", "ch"],
    ["en", "us"],
    ["en", "uk"],
    ["fr", "fr"],
    ["fr", "be"],
    ["fr", "ch-fr"],
    ["fr", "ca-csa"],
    ["fr", "ca-fr"],
    ["es", "es"],
    ["es", "latam"],
  ] as const)("Lernweg %s auf %s: dieselben acht wie im Lehrgang", (weg, id) => {
    const def = lernwegDef(weg as Lernweg);
    const lehrgang = achteGrundtasteFuerLayout(def.letterOrder, weg as Lernweg, id as LayoutId).slice(
      0,
      def.homeRowLetters,
    );
    const tastatur = grundtastenFuer(layoutById(id)).map((g) => g.zeichen);
    expect([...tastatur].sort()).toEqual([...lehrgang].sort());
  });

  it("findet die Taste auch ohne `code` (manche Tablets) über das Zeichen", () => {
    expect(tastenOrtFuer({ key: "S" }, DE)).toMatchObject({ reihe: 2, spalte: 1, zeichen: "s" });
    expect(tastenOrtFuer({ code: "KeyW", key: "w" }, DE)).toMatchObject({ reihe: 1, spalte: 1 });
    // Daumen und Zusatztasten zählen nie mit.
    expect(tastenOrtFuer({ code: "Space", key: " " }, DE)).toBeNull();
    expect(tastenOrtFuer({ code: "ShiftLeft", key: "Shift" }, DE)).toBeNull();
  });
});

describe("gleichzeitig - ohne falschen Fehler durch die Tastatur", () => {
  it("alle acht gehalten: sofort richtig, noch vor dem Loslassen - und nur einmal", () => {
    const p = new GrundstellungsPruefung(DE);
    const beimDruecken = fahre(p, runter(GRUND_CODES));
    expect(beimDruecken).toHaveLength(1);
    expect(beimDruecken[0].art).toBe("richtig");
    expect(fahre(p, hoch(GRUND_CODES))).toHaveLength(0);
  });

  it("★★★ Tastatur meldet nur sechs: freundlich nachreichen, nie „falsch“ - danach richtig", () => {
    const p = new GrundstellungsPruefung(DE);
    const sechs = GRUND_CODES.slice(0, 6);
    const b = fahre(p, [...runter(sechs), ...hoch(sechs)]);
    expect(b).toHaveLength(1);
    expect(b[0].art).toBe("nachreichen");
    for (const lang of ["de", "en", "fr", "es"] as Lang[]) {
      const satz = befundSatz(b[0], DE, lang);
      expect(satz).not.toMatch(/falsch|wrong|faux|incorrect|mal colocad/i);
    }
    expect(befundSatz(b[0], DE, "de")).toMatch(/noch einmal/);
    expect(befundSatz(b[0], DE, "de")).toMatch(/l \(rechter Ringfinger\) und ö \(rechter kleiner Finger\)/);
    // Die zwei fehlenden nachreichen - zugleich oder nacheinander.
    const nach = fahre(p, [["down", "KeyL", 1000], ["up", "KeyL", 1000], ["down", "Semicolon", 2000], ["up", "Semicolon", 2000]]);
    expect(nach.map((x) => x.art)).toEqual(["nachreichen", "richtig"]);
    expect(nach[1].nachgereicht).toBe(true);
    expect(befundSatz(nach[1], DE, "de")).toBe("Jetzt sind alle acht da. Alle acht Finger liegen richtig.");
  });

  it("★★ Tastatur meldet blockierte Tasten erst beim Loslassen anderer: zählt mit", () => {
    const p = new GrundstellungsPruefung(DE);
    const sechs = GRUND_CODES.slice(0, 6);
    const b = fahre(p, [
      ...runter(sechs),
      ["up", "KeyA"],
      ["up", "KeyS"],
      // Jetzt meldet die Tastatur die zwei, die sie vorher verschluckt hat.
      ["down", "KeyL"],
      ["down", "Semicolon"],
      ...hoch(["KeyD", "KeyF", "KeyJ", "KeyK", "KeyL", "Semicolon"]),
    ]);
    expect(b.map((x) => x.art)).toEqual(["richtig"]);
  });

  it("nachreichen gilt nur kurz - danach ist es ein neuer Versuch", () => {
    const p = new GrundstellungsPruefung(DE);
    const sieben = GRUND_CODES.slice(0, 7);
    expect(fahre(p, [...runter(sieben), ...hoch(sieben)])[0].art).toBe("nachreichen");
    const spaet = NACHREICHEN_MS + 1;
    expect(fahre(p, [["down", "Semicolon", spaet], ["up", "Semicolon", spaet]])[0].art).toBe("zuWenig");
  });

  it("gehaltene Tasten (Wiederholung) und die Leertaste zählen nicht", () => {
    const p = new GrundstellungsPruefung(DE);
    p.taste({ art: "down", code: "Space", key: " ", zeit: 0 });
    for (const c of GRUND_CODES.slice(0, 4)) p.taste({ art: "down", code: c, key: "x", zeit: 0 });
    p.taste({ art: "down", code: "KeyA", key: "a", repeat: true, zeit: 0 });
    const b = fahre(p, runter(GRUND_CODES.slice(4)));
    expect(b.map((x) => x.art)).toEqual(["richtig"]);
  });

  it("zu wenige Tasten: kein Fehler, sondern die Anleitung", () => {
    const b = werteAus([tastenOrtFuer({ code: "KeyF", key: "f" }, DE)!], DE);
    expect(b.art).toBe("zuWenig");
    expect(befundSatz(b, DE, "de")).toBe(
      "Es ist nur eine von acht Tasten angekommen. Leg alle acht Finger auf die Grundreihe und drück sie zugleich.",
    );
  });
});

describe("wer daneben liegt, erfährt welcher Finger und wohin", () => {
  const orte = (codes: string[]) => codes.map((c) => tastenOrtFuer({ code: c, key: "x" }, DE)!);

  it("ein Finger eine Reihe zu weit vorne", () => {
    const b = werteAus(orte(["KeyA", "KeyW", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL", "Semicolon"]), DE);
    expect(b.art).toBe("korrektur");
    expect(befundSatz(b, DE, "de")).toBe(
      "Linker Ringfinger: statt s kam w - der Finger liegt eine Reihe zu weit vorne. " +
        "Ertaste mit den Zeigefingern die kleinen Erhebungen auf f und j und versuch es noch einmal.",
    );
    expect(befundSatz(b, DE, "en")).toMatch(/^Left ring finger: w instead of s - your finger is one row too far forward\./);
    expect(befundSatz(b, DE, "fr")).toMatch(/^Annulaire gauche : w au lieu de s - le doigt est une rangée trop haut\./);
    expect(befundSatz(b, DE, "es")).toMatch(/^Anular izquierdo: w en lugar de s - el dedo está una fila demasiado arriba\./);
  });

  it("die ganze Hand eine Taste zu weit rechts: EIN Befund, nicht vier", () => {
    const b = werteAus(orte(["KeyS", "KeyD", "KeyF", "KeyG", "KeyJ", "KeyK", "KeyL", "Semicolon"]), DE);
    expect(b.punkte).toEqual([{ art: "hand", hand: "links", reihen: 0, tasten: 1 }]);
    expect(befundSatz(b, DE, "de")).toMatch(/^Die linke Hand liegt eine Taste zu weit rechts\./);
  });

  it("die rechte Hand eine Reihe zu weit vorne (u i o p)", () => {
    const b = werteAus(orte(["KeyA", "KeyS", "KeyD", "KeyF", "KeyU", "KeyI", "KeyO", "KeyP"]), DE);
    expect(b.punkte).toEqual([{ art: "hand", hand: "rechts", reihen: 1, tasten: 0 }]);
  });

  it("alle acht und noch eine dazu: Die Finger liegen richtig", () => {
    const b = werteAus(orte([...GRUND_CODES, "KeyH"]), DE);
    expect(befundSatz(b, DE, "de")).toBe(
      "Alle acht Grundtasten sind angekommen, dazu noch h. Die Finger liegen richtig - drück nur die acht Tasten der Grundreihe.",
    );
  });

  it("AZERTY: die Taste unter dem linken kleinen Finger ist q", () => {
    const fr = layoutById("fr");
    const b = werteAus(
      ["KeyQ", "KeyS", "KeyD", "KeyF", "KeyJ", "KeyK", "KeyL", "Semicolon"].map((c) => tastenOrtFuer({ code: c, key: "x" }, fr)!),
      fr,
    );
    // Auf AZERTY liegt „a" auf dem Platz von KeyQ - eine Reihe zu weit vorne.
    expect(befundSatz(b, fr, "fr")).toMatch(/^Auriculaire gauche : a au lieu de q - le doigt est une rangée trop haut\./);
  });
});

describe("die Sätze - je Sprache, nur Bindestrich", () => {
  it.each(["de", "en", "fr", "es"] as Lang[])("%s: Anleitung nennt die Tasten dieser Tastatur", (lang) => {
    expect(grundstellungAnleitung(DE, lang)).toContain("a s d f");
    expect(grundstellungAnleitung(DE, lang)).toContain("j k l ö");
    expect(grundstellungAnleitung(layoutById("es"), lang)).toContain("j k l ñ");
    expect(grundstellungAnleitung(layoutById("fr"), lang)).toContain("q s d f");
  });

  it("jede Sprache hat ihre eigenen Sätze, und keiner trägt – oder —", () => {
    const beispiele: Befund[] = [
      { art: "richtig", punkte: [], angekommen: 8 },
      { art: "nachreichen", punkte: [{ art: "fehlt", finger: "ring-rechts", soll: "l" }], angekommen: 7 },
      { art: "zuWenig", punkte: [], angekommen: 3 },
      werteAus(["KeyS", "KeyD", "KeyF", "KeyG", "KeyJ", "KeyK", "KeyL", "KeyH"].map((c) => tastenOrtFuer({ code: c, key: "x" }, DE)!), DE),
    ];
    for (const b of beispiele) {
      const saetze = (["de", "en", "fr", "es"] as Lang[]).map((l) => befundSatz(b, US, l));
      expect(new Set(saetze).size).toBe(4);
      for (const s of saetze) expect(s).not.toMatch(/[–—]/);
    }
    expect(grundstellungAnleitung(US, "en")).toContain("j k l semicolon");
  });
});

describe("das Bauteil", () => {
  beforeEach(() => setLayout("de"));

  it("schreibt das Ergebnis ins Feld (Braillezeile), ohne Live-Bereich", () => {
    const { container } = render(<GrundstellungPruefen onZurueck={() => {}} />);
    const feld = container.querySelector("textarea[data-grundstellung-zeile]") as HTMLTextAreaElement;
    expect(document.activeElement).toBe(feld);
    expect(feld.value).toContain("a s d f");
    expect(container.querySelector("[aria-live]")).toBeNull();
    for (const code of GRUND_CODES) fireEvent.keyDown(feld, { code, key: "x" });
    expect(feld.value).toBe("Alle acht Finger liegen richtig.");
    for (const code of GRUND_CODES) fireEvent.keyUp(feld, { code, key: "x" });
    expect(feld.value).toBe("Alle acht Finger liegen richtig.");
  });

  it("Esc und „Zurück“ führen zurück - nichts ist disabled", () => {
    const zurueck = vi.fn();
    const { container } = render(<GrundstellungPruefen onZurueck={zurueck} />);
    const feld = container.querySelector("textarea") as HTMLTextAreaElement;
    fireEvent.keyDown(feld, { key: "Escape", code: "Escape" });
    expect(zurueck).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Zurück" }));
    expect(zurueck).toHaveBeenCalledTimes(2);
    expect(container.querySelector("[disabled]")).toBeNull();
  });

  it("steht im Regal „Wortspiele“ - auch ganz am Anfang - und führt dorthin zurück", async () => {
    const stand = async (): Promise<TypingProgress> => ({ xp: 0, lessons: {}, letters: {}, introduced: ["f", "j"] });
    render(<Wortspiele loadFn={stand} stufe="kids" onWaehlen={() => {}} />);
    const knopf = await screen.findByRole("button", { name: "Grundstellung prüfen" });
    fireEvent.click(knopf);
    const feld = await waitFor(() => {
      const f = document.querySelector("textarea[data-grundstellung-zeile]");
      expect(f).not.toBeNull();
      return f as HTMLTextAreaElement;
    });
    fireEvent.keyDown(feld, { key: "Escape", code: "Escape" });
    await act(async () => {
      await new Promise((r) => setTimeout(r, 5));
    });
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Grundstellung prüfen" }));
  });
});
