/**
 * ★★★★ WÄCHTER: EIN PUNKT HINTER EINER ZAHL MACHT SIE ZUR ORDNUNGSZAHL.
 *
 * Johannes am 20.09.2026, nach Testerin Durchgang, wörtlich: *„Beim Fingerdiktat
 * sagt es immer noch 2 von 12-te."* Die Ansage lautete „Zeile 2 von 12. Noch
 * 10 Zeilen." - und jede deutsche Sprachausgabe liest „12." als „zwölfte",
 * weil genau so eine Ordnungszahl geschrieben wird. Ein Kind mit Blindheit
 * hört den Stand dann falsch, und es ist nicht sein Fehler.
 *
 * Der Wächter hält zwei Dinge fest:
 *  1. Keine Stand-Ansage endet eine Zahl mit einem Punkt ab.
 *  2. Ein Rätsel-Bildschirm sagt „Aufgabe", weil dort Aufgaben stehen - und
 *     weil sichtbar daneben genau dasselbe Wort steht.
 */
import { describe, expect, it } from "vitest";
import { ansageAufgabenstand, ansageZeilenstand } from "@/lib/typing/vorlesen";

/** Eine Zahl, direkt gefolgt von einem Punkt - die Ordnungszahl-Falle. */
const ZAHL_MIT_PUNKT = /\d\./;

describe("Stand-Ansagen: keine Zahl mit Punkt dahinter", () => {
  it("Zeilenstand deutsch: „Zeile 2 von 12, noch 10 Zeilen.“", () => {
    const satz = ansageZeilenstand(2, 12, "de");
    expect(satz).toBe("Zeile 2 von 12, noch 10 Zeilen.");
    expect(ZAHL_MIT_PUNKT.test(satz)).toBe(false);
  });

  it("Aufgabenstand deutsch: „Aufgabe 2 von 12, noch 10 Aufgaben.“", () => {
    const satz = ansageAufgabenstand(2, 12, "de");
    expect(satz).toBe("Aufgabe 2 von 12, noch 10 Aufgaben.");
    expect(ZAHL_MIT_PUNKT.test(satz)).toBe(false);
  });

  it("die letzte Zeile bleibt ein eigener Satz - auch ohne Zahl mit Punkt", () => {
    const satz = ansageZeilenstand(12, 12, "de");
    expect(satz).toBe("Zeile 12 von 12, Letzte Zeile.");
    expect(ZAHL_MIT_PUNKT.test(satz)).toBe(false);
  });

  it("Einzahl bleibt Einzahl: „noch 1 Zeile.“", () => {
    expect(ansageZeilenstand(11, 12, "de")).toBe("Zeile 11 von 12, noch 1 Zeile.");
    expect(ansageAufgabenstand(11, 12, "de")).toBe("Aufgabe 11 von 12, noch 1 Aufgabe.");
  });

  it("englisch ebenso - keine Zahl mit Punkt", () => {
    for (const satz of [
      ansageZeilenstand(2, 12, "en"),
      ansageAufgabenstand(2, 12, "en"),
      ansageZeilenstand(12, 12, "en"),
    ]) {
      expect(ZAHL_MIT_PUNKT.test(satz)).toBe(false);
    }
    expect(ansageZeilenstand(2, 12, "en")).toBe("Line 2 of 12, 10 lines to go.");
    expect(ansageAufgabenstand(2, 12, "en")).toBe("Question 2 of 12, 10 questions to go.");
  });

  /**
   * ★ E12 (26.09.2026, Bauplan §11.1 Punkt 4): dieselbe Falle auf Französisch -
   * eine französische Stimme könnte „2." ebenso als „deuxième" lesen. Das
   * Komma umgeht sie wie im Deutschen und Englischen (§11.2: eine echte
   * Stimme misst erst E14 auf einem Windows-Rechner nach).
   */
  it("französisch ebenso - keine Zahl mit Punkt", () => {
    for (const satz of [
      ansageZeilenstand(2, 12, "fr"),
      ansageAufgabenstand(2, 12, "fr"),
      ansageZeilenstand(12, 12, "fr"),
    ]) {
      expect(ZAHL_MIT_PUNKT.test(satz)).toBe(false);
    }
    expect(ansageZeilenstand(2, 12, "fr")).toBe("Ligne 2 sur 12, encore 10 lignes.");
    expect(ansageAufgabenstand(2, 12, "fr")).toBe("Exercice 2 sur 12, encore 10 exercices.");
    expect(ansageZeilenstand(11, 12, "fr")).toBe("Ligne 11 sur 12, encore 1 ligne.");
    expect(ansageZeilenstand(12, 12, "fr")).toBe("Ligne 12 sur 12, Dernière ligne.");
  });

  it("über den ganzen Zahlenraum: nie eine Zahl mit Punkt dahinter", () => {
    for (let gesamt = 1; gesamt <= 40; gesamt++) {
      for (let aktuell = 1; aktuell <= gesamt; aktuell++) {
        for (const lang of ["de", "en", "fr"] as const) {
          expect(ZAHL_MIT_PUNKT.test(ansageZeilenstand(aktuell, gesamt, lang))).toBe(false);
          expect(ZAHL_MIT_PUNKT.test(ansageAufgabenstand(aktuell, gesamt, lang))).toBe(false);
        }
      }
    }
  });
});
