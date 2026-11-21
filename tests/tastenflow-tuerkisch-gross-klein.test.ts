/**
 * ★★★ G2b-1 (02.10.2026, Bauplan vier Sprachen §2.1/§2.2, Befund G1c §3 Nr. 5,
 * Didaktik Türkisch T7, Leitfaden Fallen 7/19/30/33/43/50): TÜRKISCH rechnet
 * Gross-/Kleinschreibung richtig - und de/en/fr/es bleiben, wie sie waren.
 *
 * Türkisch hat VIER i-Buchstaben: i - İ und ı - I. JavaScript ohne Gebietsschema
 * macht aus „i" ein „I" (richtig: „İ"), aus „I" ein „i" (richtig: „ı") und aus
 * „İ" ZWEI Zeichen (i + Kombinationspunkt). Die Probezeile des Auftrags:
 *
 *     IŞIK İSTANBUL ıspanak
 *
 * läuft hier durch jede Stelle, die ein Kind berührt:
 *   1. die Umwandlung selbst (verlustfrei hin und zurück),
 *   2. den Eingabe-Vergleich (`useTypingItem`, Auto-Großschreibung),
 *   3. `fitText` (Zeile servieren),
 *   4. Tastenkappe und `baseKeyForChar`/`needsShift`/`unitGlyph` (mit einer
 *      WEGWERF-Belegung - die Layouts `tr-q`/`tr-f` gibt es erst mit der
 *      Tastatur-Etappe der Sprache),
 *   5. die Statistik des Weges „tr" (`statistikSchluessel`),
 *   6. und dasselbe auf „de": das bisherige Ergebnis.
 */
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, renderHook } from "@testing-library/react";

import { Keyboard } from "../src/components/typing/Keyboard";
import { useTypingItem } from "../src/components/typing/useTypingItem";
import { fitText } from "../src/lib/typing/corpus";
import { baseKeyForChar, fingerForChar, needsShift, shiftHandFor } from "../src/lib/typing/fingers";
import { LAYOUTS, layoutById, setLayout, type KeyboardLayout, type LayoutId } from "../src/lib/typing/layouts";
import { statistikSchluessel, unitGlyph } from "../src/lib/typing/letters";
import { grossFuer, kleinFuer } from "../src/lib/typing/sprachRegister";

const ZEILE = "IŞIK İSTANBUL ıspanak";

/** Die Einheiten, aus denen die Zeile besteht (klein, in der Sprache „tr"). */
const TR_EINHEITEN = ["ı", "ş", "k", "i", "s", "t", "a", "n", "b", "u", "l", "p"];

/**
 * Die WEGWERF-Belegung: die US-Tastatur mit „ı" statt „i" in der oberen Reihe
 * und „i" an der Stelle des Semikolons - genug, um die zwei i-Tasten zu haben.
 * `sprache: "tr"` ist das neue Feld der Tastatur. `mitAccess`: mit den
 * ausdrücklichen Einträgen für „I"/„İ" (so wie die echte tr-Tastatur sie
 * führen wird, Recherche §5.3) oder OHNE (Rückfall über `kleinFuer`).
 */
function trTastatur(id: string, mitAccess: boolean): KeyboardLayout {
  const us = layoutById("us");
  const rows = us.rows.map((r, i) => ({
    ...r,
    keys: r.keys.map((k) => (i === 1 && k === "i" ? "ı" : i === 2 && k === ";" ? "i" : k)),
  }));
  return {
    ...us,
    id: id as LayoutId,
    label: "Türkisch (Wegwerf-Belegung im Test)",
    sprache: "tr",
    rows,
    access: mitAccess
      ? { ...us.access, I: { base: "ı", mod: "shift" }, İ: { base: "i", mod: "shift" } }
      : { ...us.access },
  };
}

const MIT = trTastatur("tr-test-mit", true);
const OHNE = trTastatur("tr-test-ohne", false);
(LAYOUTS as KeyboardLayout[]).push(MIT, OHNE);

afterEach(() => {
  cleanup();
  setLayout("de");
});

/** Ein Tastendruck, wie `handleKey` ihn erwartet. */
function taste(key: string): KeyboardEvent {
  return { key, preventDefault: () => {} } as unknown as KeyboardEvent;
}

describe("1 · die Umwandlung selbst", () => {
  it("die Falle: ohne Gebietsschema macht JavaScript aus İ zwei Zeichen, aus I ein i, aus i ein I", () => {
    expect("İ".toLowerCase()).toHaveLength(2); // i + U+0307
    expect("I".toLowerCase()).toBe("i");
    expect("i".toUpperCase()).toBe("I");
  });

  it("kleinFuer/grossFuer mit „tr“: İ ⇒ i (EIN Zeichen), I ⇒ ı, i ⇒ İ, ı ⇒ I", () => {
    expect(kleinFuer("İ", "tr")).toBe("i");
    expect(kleinFuer("İ", "tr")).toHaveLength(1);
    expect(kleinFuer("I", "tr")).toBe("ı");
    expect(grossFuer("i", "tr")).toBe("İ");
    expect(grossFuer("ı", "tr")).toBe("I");
  });

  it("die Probezeile ist hin und zurück VERLUSTFREI", () => {
    const klein = kleinFuer(ZEILE, "tr");
    expect(klein).toBe("ışık istanbul ıspanak");
    expect(grossFuer(klein, "tr")).toBe("IŞIK İSTANBUL ISPANAK");
    // zurück: dieselbe Kleinzeile (ı ⇒ I ⇒ ı, i ⇒ İ ⇒ i)
    expect(kleinFuer(grossFuer(klein, "tr"), "tr")).toBe(klein);
    // und nichts hat einen Kombinationspunkt bekommen
    expect(klein.normalize("NFD")).not.toContain("̇");
  });

  it("dasselbe auf „de“ liefert das bisherige Ergebnis (= toLowerCase/toUpperCase)", () => {
    for (const probe of [ZEILE, "Ich bin ÄÖÜ ß straße İ ı", "Istanbul ISPANAK i"]) {
      expect(kleinFuer(probe, "de")).toBe(probe.toLowerCase());
      expect(grossFuer(probe, "de")).toBe(probe.toUpperCase());
    }
    expect(kleinFuer("İ", "de")).toBe("İ".toLowerCase()); // zwei Zeichen - wie bisher
  });
});

describe("2 · Eingabe-Vergleich und Auto-Großschreibung (useTypingItem)", () => {
  /** Tippt `getippt` Zeichen für Zeichen in eine Zeile `expected` und gibt den Hook-Stand zurück. */
  function tippe(expected: string, getippt: string, sprache: "tr" | "de") {
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useTypingItem({ expected, active: true, onComplete, acceptLowerForUpper: true, sprache }),
    );
    for (const z of getippt) act(() => result.current.handleKey(taste(z)));
    return result.current;
  }

  it("tr: die Probezeile wird mit den KLEINEN Buchstaben ı ş ı k … getippt - Auto-Großschreibung, 0 Fehler", () => {
    const stand = tippe(ZEILE, "ışık istanbul ıspanak", "tr");
    expect(stand.errors).toBe(0);
    expect(stand.done).toBe(true);
  });

  it("tr: für „I“ gilt „ı“ (nicht „i“) - das falsche „i“ ist ein Fehler", () => {
    const falsch = tippe("I", "i", "tr");
    expect(falsch.errors).toBe(1);
    expect(falsch.done).toBe(false);
    expect(tippe("I", "ı", "tr").done).toBe(true);
  });

  it("tr: für „İ“ gilt „i“ - das „ı“ ist ein Fehler", () => {
    expect(tippe("İ", "ı", "tr").errors).toBe(1);
    expect(tippe("İ", "i", "tr").done).toBe(true);
  });

  it("de: für „I“ gilt „i“ - das bisherige Verhalten", () => {
    expect(tippe("Ich", "ich", "de").done).toBe(true);
    expect(tippe("Ich", "ich", "de").errors).toBe(0);
  });
});

describe("3 · fitText (eine Zeile servieren)", () => {
  const frei = new Set(TR_EINHEITEN);

  it("tr: die Probezeile passt und bleibt unverändert (Grossschreibung bleibt erhalten)", () => {
    expect(fitText(ZEILE, frei, "tr")).toBe(ZEILE);
    // auch mit der Sprache der Übung statt der des Weges
    expect(fitText(ZEILE, frei, undefined, "tr")).toBe(ZEILE);
  });

  it("tr: „I“ sucht die Einheit „ı“ - fehlt sie, passt die Zeile NICHT", () => {
    const ohneDotless = new Set(TR_EINHEITEN.filter((e) => e !== "ı"));
    expect(fitText("IŞIK", ohneDotless, "tr")).toBeNull();
    // „İ“ sucht „i“ - fehlt es, passt sie nicht
    const ohneI = new Set(TR_EINHEITEN.filter((e) => e !== "i"));
    expect(fitText("İSTANBUL", ohneI, "tr")).toBeNull();
    expect(fitText("İSTANBUL", frei, "tr")).toBe("İSTANBUL");
  });

  it("de: dieselbe Rechnung wie bisher („I“ sucht „i“)", () => {
    expect(fitText("Ich ist", new Set(["i", "c", "h", "s", "t"]), "de")).toBe("Ich ist");
    expect(fitText("Ich ist", new Set(["i", "c", "h", "s", "t"]))).toBe("Ich ist");
  });
});

describe("4 · Tastenkappe, baseKeyForChar, needsShift, Kachel (Wegwerf-Belegung)", () => {
  it("mit ausdrücklichen access-Einträgen: I ⇒ Taste ı, İ ⇒ Taste i, beide mit Umschalt", () => {
    setLayout("tr-test-mit");
    expect(baseKeyForChar("I")).toBe("ı");
    expect(baseKeyForChar("İ")).toBe("i");
    expect(baseKeyForChar("i")).toBe("i");
    expect(baseKeyForChar("ı")).toBe("ı");
    expect(needsShift("I")).toBe(true);
    expect(needsShift("İ")).toBe(true);
    expect(needsShift("i")).toBe(false);
    expect(needsShift("ı")).toBe(false);
  });

  it("OHNE access-Einträge rechnet der Rückfall in der Sprache der Tastatur: I ⇒ ı, İ ⇒ i (nicht „i“, nicht zwei Zeichen)", () => {
    setLayout("tr-test-ohne");
    expect(baseKeyForChar("I")).toBe("ı");
    expect(baseKeyForChar("İ")).toBe("i");
    expect(baseKeyForChar("İ")).toHaveLength(1);
    expect(needsShift("I")).toBe(true);
    expect(needsShift("İ")).toBe(true);
    expect(needsShift("ı")).toBe(false);
  });

  it("ausdrücklich mit der Sprache des Weges - auch auf einer Tastatur ohne Sprache (de)", () => {
    setLayout("de");
    expect(baseKeyForChar("I", "tr")).toBe("ı");
    expect(baseKeyForChar("İ", "tr")).toBe("i");
    expect(needsShift("İ", "tr")).toBe(true);
    // „İ“ ⇒ Taste „i“ gibt es auf der de-Tastatur: die Umschalt-Hand wird bestimmt (Gegenhand des Fingers)
    expect(shiftHandFor("İ", "tr")).not.toBeNull();
    // „İ“ hat denselben Finger wie „i“ (ohne die Sprache wären es zwei Zeichen: kein Finger)
    expect(fingerForChar("İ", "tr")?.id).toBe(fingerForChar("i")?.id);
  });

  it("der Finger: „İ“ und „i“ greifen auf derselben Taste, „I“ und „ı“ auf der anderen", () => {
    setLayout("tr-test-mit");
    expect(fingerForChar("İ")?.id).toBe(fingerForChar("i")?.id);
    expect(fingerForChar("I")?.id).toBe(fingerForChar("ı")?.id);
    expect(fingerForChar("i")?.id).not.toBe(fingerForChar("ı")?.id);
  });

  it("Kachel (unitGlyph): auf der tr-Tastatur trägt „i“ ein „İ“ und „ı“ ein „I“ - auf de wie bisher", () => {
    setLayout("tr-test-mit");
    expect(unitGlyph("i")).toBe("İ");
    expect(unitGlyph("ı")).toBe("I");
    expect(unitGlyph("i", false)).toBe("i");
    expect(unitGlyph("i", true, "tr")).toBe("İ"); // ausdrücklich mit dem Weg
    setLayout("de");
    expect(unitGlyph("i")).toBe("I");
    expect(unitGlyph("i", true, "tr")).toBe("İ");
    expect(unitGlyph("ä")).toBe("Ä");
    expect(unitGlyph("ß")).toBe("ß");
  });

  it("Tastenkappe der Bildschirm-Tastatur (keyLabel): Taste „i“ zeigt „İ“, Taste „ı“ zeigt „I“", () => {
    const { container } = render(
      createElement(Keyboard, { layout: MIT, unlocked: new Set<string>(), showFingerColors: false }),
    );
    const kappen = [...container.querySelectorAll("*")]
      .filter((el) => el.children.length === 0)
      .map((el) => el.textContent);
    expect(kappen).toContain("İ");
    expect(kappen).toContain("I");
    // und es gibt GENAU je eine Kappe „İ“ und „I“ (keine zwei „I“ wie mit toUpperCase)
    expect(kappen.filter((k) => k === "İ")).toHaveLength(1);
    expect(kappen.filter((k) => k === "I")).toHaveLength(1);
  });

  it("de: die Tastenkappe „i“ zeigt wie bisher „I“", () => {
    const { container } = render(
      createElement(Keyboard, { layout: layoutById("de"), unlocked: new Set<string>(), showFingerColors: false }),
    );
    const kappen = [...container.querySelectorAll("*")].filter((el) => el.children.length === 0).map((el) => el.textContent);
    expect(kappen).toContain("I");
    expect(kappen).not.toContain("İ");
  });
});

describe("5 · Statistik des Weges „tr“", () => {
  it("jeder Anschlag der Probezeile zählt unter EINER Einheit des Weges - nie unter einem zweistelligen Schlüssel", () => {
    const schluessel = [...ZEILE].filter((z) => z !== " ").map((z) => statistikSchluessel(z, "tr"));
    for (const s of schluessel) {
      expect([...s]).toHaveLength(1);
      expect(TR_EINHEITEN).toContain(s);
    }
    // İ zählt auf i, I auf ı (bisher: İ auf einen zweistelligen Schlüssel, I auf i)
    expect(statistikSchluessel("İ", "tr")).toBe("i");
    expect(statistikSchluessel("I", "tr")).toBe("ı");
    expect(statistikSchluessel("i", "tr")).toBe("i");
    expect(statistikSchluessel("ı", "tr")).toBe("ı");
  });

  it("de: der Schlüssel ist der bisherige (toLowerCase)", () => {
    for (const z of [..."ABCÄÖÜßIiı"]) expect(statistikSchluessel(z, "de")).toBe(z.toLowerCase());
  });
});

describe("6 · die Erkennung eines Grossbuchstabens ist von der Sprache unabhängig (deshalb dort NICHT umgestellt)", () => {
  // `ch !== ch.toLowerCase() && ch === ch.toUpperCase()` - an elf Stellen im Tippcode
  // (voice.ts, fingers.ts charLabel …) bewusst unverändert: das Ergebnis ist für JEDES
  // Zeichen dasselbe mit und ohne Gebietsschema, auch für die vier i-Buchstaben.
  const erkenne = (ch: string, l?: string) => {
    const klein = l ? ch.toLocaleLowerCase(l) : ch.toLowerCase();
    const gross = l ? ch.toLocaleUpperCase(l) : ch.toUpperCase();
    return ch !== klein && ch === gross;
  };
  it.each(["i", "I", "İ", "ı", "ş", "Ş", "ß", "a", "A", "1", " "])("„%s“", (ch) => {
    expect(erkenne(ch, "tr")).toBe(erkenne(ch));
  });
});
