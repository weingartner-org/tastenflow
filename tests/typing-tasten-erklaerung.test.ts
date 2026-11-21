/**
 * Wächter über die Sätze von „Tasten erkunden" (`lib/typing/tastenErklaerung.ts`).
 *
 * Johannes, 12.09.2026: „Immer zuerst die abkürzung, dann der Nahme und dann
 * die möglichen funktionen, begonnen mit den wichtigsten zuerst … einfache
 * sprache, es ist für Kinder".
 *
 * Geprüft wird die FORM, die für jede Taste gelten muss - der Inhalt jedes
 * Satzes ist Abnahme von Hand (die Übersichtstabelle entsteht aus denselben
 * Funktionen). Die Gegenproben stehen jeweils daneben: Ein Wächter, der beim
 * ersten Lauf grün ist, beweist nichts.
 */
import { describe, expect, it } from "vitest";
import type { KeyEventLike } from "../src/lib/computer/chord";
import type { Plattform } from "../src/lib/computer/model";
import { tastenFuer } from "../src/lib/computer/tastenNamen";
import {
  alleSondertasten,
  alleZeichen,
  ansageFuer,
  erklaerungFuerId,
  erkundeTaste,
  type TastenErklaerung,
  zeileFuer,
} from "../src/lib/typing/tastenErklaerung";

const PLATTFORMEN: Plattform[] = ["windows", "macos"];

const ev = (key: string, code?: string, extra: Partial<KeyEventLike> = {}): KeyEventLike => ({
  key, code, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, ...extra,
});

describe("Johannes' Beispiel, wörtlich", () => {
  it("Tab - Tabulatortaste - springt von Element zu Element …", () => {
    const aus = erkundeTaste(ev("Tab", "Tab"), "windows");
    expect(aus.zeile).toBe(
      "Tab - Tabulatortaste - springt von Element zu Element, zum Beispiel zu " +
        "Link, Eingabefeld oder Schalter. Mit Shift dazu springt sie zurück.",
    );
    // Die Stimme: dieselben Wörter, Komma und Doppelpunkt statt Bindestrich.
    expect(aus.ansage).toBe(
      "Tab, Tabulatortaste: Springt von Element zu Element, zum Beispiel zu " +
        "Link, Eingabefeld oder Schalter. Mit Shift dazu springt sie zurück.",
    );
    expect(aus.schlucken).toBe(true);
  });
});

/** Alles, was an der FORM eines Eintrags nicht stimmt - leer heisst: in Ordnung. */
function formFehler(t: TastenErklaerung): string[] {
  const fehler: string[] = [];
  if (!t.name) fehler.push("kein Name");
  if (t.was.length === 0) fehler.push("keine Aufgabe");
  const zeile = zeileFuer(t);
  // Zuerst die Abkürzung, dann der Name.
  if (!zeile.startsWith(t.kurz ? `${t.kurz} - ${t.name} - ` : `${t.name} - `)) {
    fehler.push("Reihenfolge");
  }
  // Die Abkürzung wiederholt nicht bloss den Namen („Ende - Ende-Taste").
  if (t.kurz && t.name.toLowerCase().startsWith(`${t.kurz.toLowerCase()}-`)) {
    fehler.push("Abkürzung wiederholt den Namen");
  }
  for (const satz of t.was) {
    if (!/\.$/.test(satz.trim())) fehler.push(`ohne Punkt: ${satz}`);
    // Kurze Sätze - es ist für Kinder.
    if (satz.split(/\s+/).length > 18) fehler.push(`zu lang: ${satz}`);
  }
  for (const text of [zeile, ansageFuer(t)]) {
    // Nur Bindestrich (Braillezeile).
    if (/[–—]/.test(text)) fehler.push("Gedankenstrich");
    // Echte Umlaute.
    if (/(?<![a-zäöü])(fuer|ueber|loescht|groesser|schliesst)(?![a-zäöü])/i.test(text)) {
      fehler.push("Umlaut umschrieben");
    }
    // Keine Maus-Wörter.
    if (/klick|Maus/i.test(text)) fehler.push("Maus-Wort");
  }
  return fehler;
}

describe.each(PLATTFORMEN)("jede Sondertaste auf %s", (plattform) => {
  const liste = alleSondertasten(plattform);

  it("★ jede Taste des Tasten-Wörterbuchs hat einen Satz (nichts fällt stumm durch)", () => {
    const ohne = tastenFuer(plattform)
      .filter((t) => !erklaerungFuerId(t.id, plattform))
      .map((t) => t.id);
    expect(ohne).toEqual([]);
  });

  it.each(liste.map((x) => [x.taste, x.t] as const))("%s: Abkürzung - Name - was sie tut", (_taste, t) => {
    expect(formFehler(t)).toEqual([]);
  });
});

describe("Gegenprobe: die Form-Prüfung schlägt an", () => {
  it.each([
    ["Abkürzung wiederholt den Namen", { kurz: "Ende", name: "Ende-Taste", was: ["springt ans Ende."] }],
    ["ohne Punkt", { kurz: null, name: "Leertaste", was: ["macht einen Abstand"] }],
    ["Gedankenstrich", { kurz: "Tab", name: "Tabulatortaste", was: ["springt – weiter."] }],
    ["Umlaut umschrieben", { kurz: null, name: "Löschtaste", was: ["loescht nach links."] }],
    ["Maus-Wort", { kurz: null, name: "Menü-Taste", was: ["wirkt wie ein Klick mit der Maus."] }],
    ["keine Aufgabe", { kurz: "Tab", name: "Tabulatortaste", was: [] }],
  ] as const)("%s", (erwartet, t) => {
    expect(formFehler(t).join(" | ")).toContain(erwartet);
  });
});

describe("die Plattform zählt, wo die Taste anders heißt", () => {
  it("Enter unter Windows, Return am Mac", () => {
    expect(erkundeTaste(ev("Enter", "Enter"), "windows").zeile).toMatch(/^Enter - Eingabetaste - /);
    expect(erkundeTaste(ev("Enter", "Enter"), "macos").zeile).toMatch(/^Return - Zeilenschalter - /);
  });
  it("die Taste links neben der Leertaste: Windows-Taste gegen Befehlstaste", () => {
    expect(erkundeTaste(ev("Meta", "MetaLeft"), "windows").zeile).toMatch(/^Win - Windows-Taste - öffnet das Startmenü\./);
    expect(erkundeTaste(ev("Meta", "MetaLeft"), "macos").zeile).toMatch(/^cmd - Befehlstaste - /);
  });
  it("wortweise springen: Strg unter Windows, Option am Mac", () => {
    expect(erkundeTaste(ev("ArrowLeft", "ArrowLeft"), "windows").zeile).toMatch(/Mit Strg dazu/);
    expect(erkundeTaste(ev("ArrowLeft", "ArrowLeft"), "macos").zeile).toMatch(/Mit Option dazu/);
  });
  it("Pos1 kommt am Mac auch ohne Wörterbuch-Eintrag mit Satz an", () => {
    expect(erkundeTaste(ev("Home", "Home"), "macos").zeile).toMatch(/^Pos1 - Position-1-Taste - /);
  });
});

describe("Zeichen", () => {
  it.each(alleZeichen())("%s: das Zeichen steht vorne, dann Name, dann was es tut", (ch) => {
    const aus = erkundeTaste(ev(ch), "windows");
    expect(aus.gross).toBe(ch);
    expect(aus.zeile.startsWith(`${ch} - `)).toBe(true);
    // Zeichen - Name - Satz: mindestens drei Teile.
    expect(aus.zeile.split(" - ").length).toBeGreaterThanOrEqual(3);
    expect(aus.zeile).toMatch(/\.$/);
    expect(aus.zeile).not.toMatch(/[–—]/);
    // Die Stimme nennt das Zeichen beim Namen, nicht als nacktes Symbol vorne.
    expect(aus.ansage.startsWith(ch)).toBe(false);
  });

  it("Buchstaben und Ziffern bekommen keinen Satz", () => {
    expect(erkundeTaste(ev("a", "KeyA"), "windows")).toMatchObject({ zeile: "a", ansage: "a." });
    expect(erkundeTaste(ev("7", "Digit7"), "windows").zeile).toBe("7");
    expect(erkundeTaste(ev("A", "KeyA", { shiftKey: true }), "windows")).toMatchObject({
      zeile: "A - großes A",
      ansage: "großes A.",
    });
  });

  it("Beispiele, wie sie ein Kind hört", () => {
    expect(erkundeTaste(ev("@"), "windows").ansage).toBe("At-Zeichen: Steht in jeder E-Mail-Adresse.");
    expect(erkundeTaste(ev("."), "windows").zeile).toBe(". - Punkt - steht am Ende von einem Satz.");
  });
});

describe("was der Browser behält", () => {
  it("die Akzent-Taste wird nicht geschluckt (F5 seit 27.10.2026 schon, Testerin 24.10.)", () => {
    expect(erkundeTaste(ev("F5", "F5"), "windows").schlucken).toBe(true);
    // ★ 13.09.2026: Auf einer englischen Tastatur bleibt die Totaste allgemein …
    expect(erkundeTaste(ev("Dead", "Equal"), "windows", { layout: "us" })).toMatchObject({
      schlucken: false,
      gross: "Akzent-Taste",
    });
    // … auf der deutschen heisst sie seither nach ihrem Akzent (tests/typing-tasten-erkunden-totasten.test.ts).
    expect(erkundeTaste(ev("Dead", "Equal"), "windows", { layout: "de" })).toMatchObject({
      schlucken: false,
      gross: "´",
    });
  });
  it("★ ohne Auskunft vom Browser: kein „Taste Unidentified“, keine leere Zeile", () => {
    // Gefunden im Probelauf 12.09.: ein Ereignis mit leerem key UND code
    // zeigte „Taste " - auf der Braillezeile ein halbes Wort.
    for (const key of ["", "Unidentified"]) {
      expect(erkundeTaste(ev(key, ""), "windows")).toMatchObject({
        gross: "?",
        zeile: "Diese Taste kann ich nicht erkennen.",
        schlucken: false,
      });
    }
  });
  it("eine ganz unbekannte Taste wird ehrlich beim Namen genannt", () => {
    expect(erkundeTaste(ev("LaunchMail"), "windows")).toMatchObject({
      zeile: "Taste LaunchMail",
      schlucken: false,
    });
  });
});

describe("AltGr + Taste links neben Y (Meldung 28.10.2026)", () => {
  it("„|“ nennt den Weg mit dem Aufdruck „<“, nie mit „|“", () => {
    const aus = erkundeTaste(
      ev("|", "IntlBackslash", { ctrlKey: true, altKey: true }),
      "windows",
      { altGr: true },
    );
    expect(aus.zeile).toContain("AltGr + <");
    expect(aus.zeile).not.toContain("AltGr + |");
  });
});
