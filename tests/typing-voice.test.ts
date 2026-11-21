/**
 * Vorlese-Granularität (Tastenflow): Mehrfachauswahl Buchstaben / Wörter /
 * Sätze. Geprüft wird die reine Entscheidungslogik `readPlanAt` (was an einer
 * Position gesprochen wird) samt der Wort-Helfer. Die eigentliche Sprachausgabe
 * (Web-Speech) ist headless nicht prüfbar.
 */
import { describe, it, expect } from "vitest";
import {
  charLabel,
  isRealWord,
  isWordStart,
  readPlanAt,
  spokenLabel,
  typingGapMs,
  wordAt,
} from "../src/lib/typing";

const L = "fall fad";

describe("spokenLabel — eindeutige Namen fürs Vorlesen", () => {
  it("schreibt Umlaute aus, damit ä nicht wie e klingt", () => {
    expect(spokenLabel("ä")).toBe("a Umlaut");
    expect(spokenLabel("ö")).toBe("o Umlaut");
    expect(spokenLabel("ü")).toBe("u Umlaut");
    expect(spokenLabel("Ä")).toBe("großes a Umlaut");
  });
  it("hält e und ä hörbar auseinander", () => {
    expect(spokenLabel("e")).toBe("e");
    expect(spokenLabel("e")).not.toBe(spokenLabel("ä"));
  });
  it("alle übrigen Zeichen wie charLabel (sichtbarer Name)", () => {
    expect(spokenLabel("f")).toBe(charLabel("f"));
    expect(spokenLabel(",")).toBe(charLabel(","));
    expect(spokenLabel("A")).toBe(charLabel("A"));
    expect(spokenLabel("ß")).toBe(charLabel("ß"));
  });
});

describe("Wort-Helfer", () => {
  it("isWordStart erkennt Zeilen-/Wortanfang", () => {
    expect(isWordStart(L, 0)).toBe(true);
    expect(isWordStart(L, 1)).toBe(false);
    expect(isWordStart(L, 4)).toBe(false); // das Leerzeichen selbst
    expect(isWordStart(L, 5)).toBe(true); // 'f' von 'fad'
  });
  it("wordAt liefert das Wort ab der Position", () => {
    expect(wordAt(L, 0)).toBe("fall");
    expect(wordAt(L, 5)).toBe("fad");
    expect(wordAt(L, 2)).toBe("ll");
  });
});

describe("readPlanAt — Granularität (Mehrfachauswahl)", () => {
  it("nur Buchstaben: jeder Buchstabe", () => {
    const m = { letters: true, words: false, sentences: false };
    expect(readPlanAt(L, 0, m)).toEqual([charLabel("f")]);
    expect(readPlanAt(L, 2, m)).toEqual([charLabel("l")]);
  });

  it("nur Wörter: am Wortanfang das Wort, mitten im Wort nichts", () => {
    const m = { letters: false, words: true, sentences: false };
    expect(readPlanAt(L, 0, m)).toEqual(["fall"]);
    expect(readPlanAt(L, 2, m)).toEqual([]);
    expect(readPlanAt(L, 5, m)).toEqual(["fad"]);
  });

  it("nur Sätze: am Zeilenanfang die ganze Zeile, sonst nichts", () => {
    const m = { letters: false, words: false, sentences: true };
    expect(readPlanAt(L, 0, m)).toEqual([L]);
    expect(readPlanAt(L, 2, m)).toEqual([]);
    expect(readPlanAt(L, 5, m)).toEqual([]);
  });

  it("Sätze + Wörter: erst der Satz, dann das erste Wort; danach Wort für Wort", () => {
    const m = { letters: false, words: true, sentences: true };
    expect(readPlanAt(L, 0, m)).toEqual([L, "fall"]);
    expect(readPlanAt(L, 5, m)).toEqual(["fad"]);
    expect(readPlanAt(L, 2, m)).toEqual([]);
  });

  it("alle drei: Satz + Wort am Anfang, Buchstaben auch am Wortanfang", () => {
    const m = { letters: true, words: true, sentences: true };
    // ⚠️ Hier stand bis 28.08.2026 `[L, "fall"]` mit dem Kommentar „das Wort
    // deckt den 1. Buchstaben". Das tat es NICHT: Wer Wörter UND Buchstaben
    // eingeschaltet hatte, hörte „fall, a, l, l" - der Anfangsbuchstabe wurde
    // nie genannt. Gefunden von Testerin (Marburg) an ihren Schülern, am Code
    // belegt. Der Test hatte den Fehler als Absicht festgeschrieben.
    expect(readPlanAt(L, 0, m)).toEqual([L, "fall", charLabel("f")]);
    expect(readPlanAt(L, 2, m)).toEqual([charLabel("l")]);
    // Gilt für JEDEN Wortanfang, nicht nur den ersten.
    expect(readPlanAt(L, 5, m)).toEqual(["fad", charLabel("f")]);
  });

  it("nichts ausgewählt → nichts vorlesen", () => {
    expect(
      readPlanAt(L, 0, { letters: false, words: false, sentences: false }),
    ).toEqual([]);
  });

  it("liest Buchstaben mit dem eindeutigen Namen (a Umlaut statt nacktem ä)", () => {
    const m = { letters: true, words: false, sentences: false };
    expect(readPlanAt("fä", 1, m)).toEqual(["a Umlaut"]);
    expect(readPlanAt("fä", 0, m)).toEqual(["f"]);
  });
});

describe("readPlanAt — Nicht-Wörter buchstabieren (Wunsch)", () => {
  // kleines Test-Lexikon: nur diese gelten als echte Wörter.
  const isWord = (t: string) =>
    ["fall", "fad", "haus", "klein"].includes(
      t.toLowerCase().replace(/[^a-zäöüß]/g, ""),
    );
  // Standard ab jetzt: Wörter + Sätze; Buchstaben-Schalter AUS.
  const m = { letters: false, words: true, sentences: true };

  it("echtes Wort am Wortanfang → ganzes Wort", () => {
    expect(readPlanAt("fall flass", 0, m, isWord)).toEqual(["fall"]);
  });

  it("Pseudowort wird Buchstabe für Buchstabe gelesen — obwohl der Buchstaben-Schalter AUS ist", () => {
    expect(readPlanAt("flass", 0, m, isWord)).toEqual(["f"]);
    expect(readPlanAt("flass", 1, m, isWord)).toEqual(["l"]);
    expect(readPlanAt("flass", 2, m, isWord)).toEqual(["a"]);
  });

  it("Drill-Zeile wird NICHT als ganzer Satz gelesen — schon ein Pseudowort genügt", () => {
    // überwiegend Pseudo → erstes Token buchstabieren
    expect(readPlanAt("flass salö fad", 0, m, isWord)).toEqual(["f"]);
    // 2 von 3 echt, aber EIN Pseudowort dabei → trotzdem kein Satz, nur das Wort
    expect(readPlanAt("fall xqz fad", 0, m, isWord)).toEqual(["fall"]);
  });

  it("echter Satz (mit Satzzeichen) wird als ganze Zeile vorgelesen", () => {
    const line = "Das Haus ist klein.";
    expect(readPlanAt(line, 0, m, isWord)[0]).toBe(line);
  });

  it("Umlaut in einem Pseudowort wird eindeutig buchstabiert", () => {
    expect(readPlanAt("fä", 1, m, isWord)).toEqual(["a Umlaut"]);
  });
});

describe("isRealWord — Lexikon (echtes Wort vs. Pseudowort)", () => {
  it("erkennt echte Wörter aus dem Wortschatz", () => {
    expect(isRealWord("das")).toBe(true);
    expect(isRealWord("fad")).toBe(true);
  });
  it("verwirft Einzelzeichen und Pseudowörter", () => {
    expect(isRealWord("f")).toBe(false);
    expect(isRealWord("xqzjkw")).toBe(false);
  });
  it("ignoriert umgebende Satzzeichen/Großschreibung", () => {
    expect(isRealWord("Das,")).toBe(true);
  });
});

describe("typingGapMs — Lese-/Vorlesezeit aus dem Tipptempo herausrechnen", () => {
  it("zieht die vorgelesene Zeit vom Anschlag-Abstand ab", () => {
    // 2 s Abstand, davon 1,5 s Vorlesen → 0,5 s reine Tippzeit.
    expect(typingGapMs(2000, 1500)).toBe(500);
  });
  it("ohne Vorlesen bleibt der Abstand unverändert (Sehende: kein Unterschied)", () => {
    expect(typingGapMs(800, 0)).toBe(800);
  });
  it("wird nie negativ (Vorlesen länger als der Abstand)", () => {
    expect(typingGapMs(1200, 5000)).toBe(0);
  });
  it("behandelt negative Sprechzeit defensiv wie 0", () => {
    expect(typingGapMs(800, -50)).toBe(800);
  });
  it("tippt jemand WÄHREND des Sprechens (sieht den Text), zählt die volle Tippzeit", () => {
    // 1 s Abstand, 0,9 s davon vorgelesen — aber beim Anschlag spricht die Stimme
    // noch (speakingNow=true) → parallel getippt → kein Abzug, volle Tippzeit.
    expect(typingGapMs(1000, 900, true)).toBe(1000);
  });
  it("hat die Stimme aufgehört (echtes Warten), wird die Wartezeit abgezogen", () => {
    // gleiche Werte, aber speakingNow=false (Person hat gewartet) → Abzug.
    expect(typingGapMs(1000, 900, false)).toBe(100);
  });
});
