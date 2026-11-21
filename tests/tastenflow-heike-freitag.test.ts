/**
 * HEIKES FREITAGS-BERICHT (04.09.2026) - die zwei Befunde, die im Vorrat und in
 * der Fingerzuordnung stecken. Der dritte (Bauchrutsche) sitzt in
 * `tests/expedition-lives.test.tsx`, weil er einen Bildschirm braucht.
 *
 * Beide Befunde sind vor der Reparatur nachgemessen worden, nicht geraten -
 * die Zahlen in den Kommentaren stammen aus diesen Läufen.
 *
 * ★★★ Jeder Fall hier hat eine GEGENPROBE (`gegenprobe:`-Fälle unten): einen
 * Lauf, der mit der ALTEN Regel gerechnet wird und anschlagen MUSS. Ein
 * Wächter, der beim ersten Lauf grün ist, beweist sonst nichts.
 */
import { describe, it, expect } from "vitest";
import { zahlendiktat, ziffernFrei } from "../src/lib/typing/uebungsformen/zahlendiktat";
import { fingerdiktat } from "../src/lib/typing/uebungsformen/fingerdiktat";
import { zeichenDerAnsage } from "../src/lib/typing/uebungsformen/fingerdiktatAufgaben";
import type { FormKontext } from "../src/lib/typing/uebungsformen/typen";
import { INTRO_ORDER, SHIFT_UNIT } from "../src/lib/typing/letters";
import { FINGERS, fingerForChar, fingerName, rowForChar, rowName } from "../src/lib/typing/fingers";
import { zahlwort } from "../src/lib/typing/zahlwort";
import { fitText } from "../src/lib/typing/corpus";
import type { Lang, Stufe } from "../src/lib/typing/account";

/** Seed-fähiger Zufall (mulberry32) - derselbe Baustein wie in den Nachbartests. */
function seedZufall(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Der Tastenstand nach `n` Einheiten des Lehrgangs - genau wie ein Konto ihn trägt. */
function standNach(n: number, overrides: Partial<FormKontext> = {}): FormKontext {
  const introduced = INTRO_ORDER.slice(0, n);
  return {
    lernweg: "de",
    introduced: [...introduced],
    shift: introduced.includes(SHIFT_UNIT),
    oneHand: false,
    stufe: "teens" as Stufe,
    lang: "de" as Lang,
    count: 12,
    zufall: seedZufall(7),
    ...overrides,
  };
}

/** „Grundreihe + e" - Testerin Fall, auf die Einheit genau. */
const GRUNDREIHE_PLUS_E = 9;

describe("Zahlendiktat: die Ziffern sind die Schranke (Testerin 04.09.)", () => {
  it("Testerin Fall: nach Grundreihe + e wird es NICHT mehr angeboten", () => {
    const ctx = standNach(GRUNDREIHE_PLUS_E);
    expect(ctx.introduced).toEqual(["f", "j", "d", "k", "s", "l", "a", "ö", "e"]);
    expect(zahlendiktat.taugt(ctx)).toBe(false);
  });

  it("gegenprobe: mit der ALTEN Regel wäre genau eine Zahl schreibbar - „elf“", () => {
    // Die alte Regel liess die Form zu, sobald EIN Zahlwort tippbar war.
    const ctx = standNach(GRUNDREIHE_PLUS_E);
    const stand = new Set(ctx.introduced);
    const schreibbar: number[] = [];
    for (let n = 10; n <= 99; n += 1) {
      const wort = zahlwort(n, ctx.lang);
      if (fitText(wort, stand) === wort) schreibbar.push(n);
    }
    // Genau diese eine Zahl hat die Form damals aufgesperrt.
    expect(schreibbar).toEqual([11]);
    expect(zahlwort(11, "de")).toBe("elf");
  });

  it("überall, wo die Form angeboten wird, trägt eine Runde genug verschiedene Aufgaben", () => {
    // ★★★ Der eigentliche Befund war nicht „zu früh", sondern „eine Aufgabe,
    // zwölfmal". Diese Schleife geht den GANZEN Lehrgang ab - sie fängt damit
    // auch jede künftige Regel ab, die die Form wieder zu früh aufsperrt.
    const MINDEST_AUFGABEN = 6;
    let angeboten = 0;
    for (let n = 1; n <= INTRO_ORDER.length; n += 1) {
      const ctx = standNach(n);
      if (!zahlendiktat.taugt(ctx)) continue;
      angeboten += 1;
      const aufgaben = zahlendiktat.fragen!(ctx);
      const verschieden = new Set(aufgaben.map((a) => a.frage)).size;
      expect(
        verschieden,
        `Bei ${n} Einheiten bietet das Zahlendiktat nur ${verschieden} verschiedene Aufgaben an.`,
      ).toBeGreaterThanOrEqual(MINDEST_AUFGABEN);
    }
    // Die Form muss irgendwann WIRKLICH drankommen - sonst wäre der Wächter
    // dadurch grün, dass er nie etwas zu prüfen bekommt.
    expect(angeboten).toBeGreaterThan(0);
  });

  it("die Schranke ist die Ziffernreihe, nicht eine Buchstabenzahl", () => {
    // Alle Buchstaben, aber keine Ziffern: noch nicht.
    const ohneZiffern = standNach(38); // + Satzzeichen, vor den Ziffern
    expect(ziffernFrei(ohneZiffern)).toBe(false);
    expect(zahlendiktat.taugt(ohneZiffern)).toBe(false);
    // Mit den Ziffern: ja.
    const mitZiffern = standNach(48);
    expect(ziffernFrei(mitZiffern)).toBe(true);
    expect(zahlendiktat.taugt(mitZiffern)).toBe(true);
  });

  it("mit den Ziffern kommen beide Richtungen vor", () => {
    const aufgaben = zahlendiktat.fragen!(standNach(48));
    expect(aufgaben.some((a) => a.frage.startsWith("Schreib die Zahl"))).toBe(true);
    expect(aufgaben.some((a) => a.frage.startsWith("Schreib das Zahlwort"))).toBe(true);
  });
});

describe("Fingerdiktat: eine Ansage, die zwei Tasten meint (Testerin 04.09.)", () => {
  /** Voller Tastenstand - g und h sind dabei, also beide Doppeldeutigkeiten. */
  const VOLL = standNach(INTRO_ORDER.length);

  it("„rechter Zeigefinger“ nimmt h UND j an, „linker Zeigefinger“ f UND g", () => {
    expect(new Set(zeichenDerAnsage("j", VOLL))).toEqual(new Set(["h", "j"]));
    expect(new Set(zeichenDerAnsage("h", VOLL))).toEqual(new Set(["h", "j"]));
    expect(new Set(zeichenDerAnsage("f", VOLL))).toEqual(new Set(["f", "g"]));
    expect(new Set(zeichenDerAnsage("g", VOLL))).toEqual(new Set(["f", "g"]));
  });

  it("die Heimattaste steht vorn - sie wird nach einem Fehlgriff genannt", () => {
    // Der Rätsel-Bildschirm sagt `antworten[0]` („Die Antwort ist: j.").
    // Genannt werden soll die Taste, auf der der Finger wohnt.
    expect(zeichenDerAnsage("h", VOLL)[0]).toBe("j");
    expect(zeichenDerAnsage("g", VOLL)[0]).toBe("f");
    expect(zeichenDerAnsage("j", VOLL)[0]).toBe("j");
    expect(zeichenDerAnsage("f", VOLL)[0]).toBe("f");
  });

  it("vier der acht Heimattasten-Ansagen bleiben eindeutig", () => {
    // a, s, d, k, l sind unter der Vollfreischaltung eindeutig - ihr Finger
    // bedient in der Grundreihe keine zweite Taste.
    for (const z of ["a", "s", "d", "k", "l"]) {
      expect(zeichenDerAnsage(z, VOLL)).toEqual([z]);
    }
  });

  it("★ Punkt 13 (20.09.2026): „ö“ bekommt mit „ä“ einen NEUEN Grundreihen-Zwilling", () => {
    // „ä" liegt PHYSISCH in der Grundreihe direkt neben „ö" (deutsche Tastatur),
    // hat aber keinen eigenen Finger - genau wie g/h. Vor der Erweiterung des
    // Fingerdiktats auf mehr als die zehn handverlesenen Grundreihen-Zeichen
    // (`GRUNDREIHE_ZEICHEN`) kam „ä" dort nie vor; jetzt zählt sie mit, wenn
    // freigeschaltet - dieselbe Regel wie bei f/g und h/j.
    expect(fingerForChar("ä")!.id).toBe("kleiner-rechts");
    expect(fingerForChar("ö")!.id).toBe("kleiner-rechts");
    expect(rowForChar("ä")).toBe(rowForChar("ö"));
    expect(new Set(zeichenDerAnsage("ö", VOLL))).toEqual(new Set(["ö", "ä"]));
    expect(new Set(zeichenDerAnsage("ä", VOLL))).toEqual(new Set(["ö", "ä"]));
    // Die Heimattaste „ö" steht weiterhin vorn.
    expect(zeichenDerAnsage("ä", VOLL)[0]).toBe("ö");
  });

  it("★ Punkt 13: ohne „ä“ bleibt „ö“ wie bisher eindeutig", () => {
    const ohneAe = standNach(GRUNDREIHE_PLUS_E); // Grundreihe + e, kein ä
    expect(ohneAe.introduced).not.toContain("ä");
    expect(zeichenDerAnsage("ö", ohneAe)).toEqual(["ö"]);
  });

  it("nur FREIGESCHALTETE Geschwister zählen", () => {
    // h kommt erst spät; solange es fehlt, meint „rechter Zeigefinger" nur j.
    const ohneH = standNach(14); // f j d k s l a ö e n i r t ⇧ - kein h, kein g
    expect(ohneH.introduced).not.toContain("h");
    expect(zeichenDerAnsage("j", ohneH)).toEqual(["j"]);
  });

  it("jede erzeugte Aufgabe nimmt jedes Zeichen ihres Fingers an", () => {
    // ★ Punkt 13: die Ansage kann jetzt auch die Reihe tragen (ausserhalb der
    // Grundreihe) - die Prüfung baut sie darum genauso zusammen wie die Form.
    const aufgaben = fingerdiktat.fragen!(VOLL);
    expect(aufgaben.length).toBeGreaterThan(0);
    for (const a of aufgaben) {
      for (const zeichen of a.antworten) {
        const finger = fingerForChar(zeichen)!;
        const reihe = rowForChar(zeichen);
        const erwarteteAnsage =
          reihe === 2
            ? fingerName(finger, "de")
            : `${fingerName(finger, "de")}, ${rowName(zeichen, "de")}`;
        // Die Ansage der Aufgabe muss zu JEDER angenommenen Antwort passen -
        // sonst wäre eine davon zu Unrecht dabei.
        expect(erwarteteAnsage).toBe(a.frage);
      }
      // Ist die Heimattaste des Fingers unter den Antworten, steht sie vorn.
      const heim = FINGERS[fingerForChar(a.antworten[0])!.id].homeKey;
      if (a.antworten.includes(heim)) expect(a.antworten[0]).toBe(heim);
    }
  });

  it("gegenprobe: mit nur EINER Antwort wäre ein richtiges Kind falsch gewesen", () => {
    // Das ist Testerin Fall, in einer Zeile: Das Kind hört „rechter
    // Zeigefinger" und tippt h. Vor der Reparatur stand in `antworten` nur
    // das eine gewürfelte Zeichen; war das j, galt h als falsch.
    // ★ Punkt 13: der Vorrat ist jetzt viel grösser (alle Buchstaben statt nur
    // der zehn Grundreihen-Zeichen) - ein hoher `count` sichert statistisch,
    // dass der rechte Zeigefinger unter den gezogenen Aufgaben vorkommt.
    const aufgaben = fingerdiktat.fragen!({ ...VOLL, count: 300 });
    const rechterZeige = aufgaben.find((a) => a.frage === fingerName(FINGERS["zeige-rechts"], "de"));
    expect(rechterZeige, "keine Aufgabe für den rechten Zeigefinger gezogen").toBeTruthy();
    const alt = [rechterZeige!.antworten[0]]; // so sah es vorher aus
    expect(alt).not.toContain("h");
    expect(rechterZeige!.antworten).toContain("h");
  });
});
