/**
 * ★★★ Die Textstufe einer Klasse wächst mit (B9, Umbau 11.09.2026).
 *
 * Die Rechnung steht in `src/lib/typing/klassenEinstellungen.ts`:
 *
 *     Alter ≈ Schulstufe + 6
 *     jetzige Schulstufe = eingetragene + (jetziges Schuljahr − Eintragsjahr)
 *
 * Geprüft wird genau das, was Johannes am 11.09.2026 verlangt hat: 7. Schulstufe
 * heisst „11-15 Jahre", und im nächsten Schuljahr rechnet dieselbe Klasse eine
 * Stufe höher - **ohne dass jemand etwas umstellt**.
 *
 * ⚠️ Das Schuljahr beginnt am 1. August (`jahreskarte.schuljahrVon`). Die
 * Zeitpunkte unten liegen darum bewusst im September, also sicher IM Schuljahr
 * des jeweiligen Startjahres - ein Datum im Juni gehörte noch zum Vorjahr.
 */
import { describe, expect, it } from "vitest";
import {
  ALTER_IN_ERSTER_SCHULSTUFE,
  SCHULSTUFE_MAX,
  aktuelleSchulstufe,
  klassenAlter,
  klassenStufe,
  schuljahrStartjahr,
} from "@/lib/typing/klassenEinstellungen";

/** 15. September des Jahres - sicher im Schuljahr, das in diesem Jahr beginnt. */
const september = (jahr: number) => new Date(jahr, 8, 15, 12, 0, 0).getTime();

describe("★ schuljahrStartjahr - das Schuljahr beginnt am 1. August", () => {
  it("der September gehört zum Schuljahr dieses Jahres", () => {
    expect(schuljahrStartjahr(september(2026))).toBe(2026);
  });

  it("der Juni gehört noch zum Schuljahr des Vorjahres", () => {
    expect(schuljahrStartjahr(new Date(2027, 5, 1).getTime())).toBe(2026);
  });
});

describe("★★★ klassenStufe / klassenAlter - Schulstufe wird Textstufe", () => {
  it("Schulstufe 7, eingetragen 2026: 13 Jahre, Textstufe teens (11-15)", () => {
    const cls = { schulstufe: 7, schulstufeSchuljahr: 2026 };
    expect(klassenAlter(cls, september(2026))).toBe(13);
    expect(klassenStufe(cls, september(2026))).toBe("teens");
  });

  it("dieselbe Klasse im Schuljahr 2027: 14 Jahre - sie wächst mit", () => {
    const cls = { schulstufe: 7, schulstufeSchuljahr: 2026 };
    expect(aktuelleSchulstufe(cls, september(2027))).toBe(8);
    expect(klassenAlter(cls, september(2027))).toBe(14);
    expect(klassenStufe(cls, september(2027))).toBe("teens");
  });

  it("Schulstufe 4: 10 Jahre, Textstufe kids", () => {
    const cls = { schulstufe: 4, schulstufeSchuljahr: 2026 };
    expect(klassenAlter(cls, september(2026))).toBe(10);
    expect(klassenStufe(cls, september(2026))).toBe("kids");
  });

  it("Schulstufe 10: 16 Jahre, Textstufe erwachsen", () => {
    const cls = { schulstufe: 10, schulstufeSchuljahr: 2026 };
    expect(klassenAlter(cls, september(2026))).toBe(16);
    expect(klassenStufe(cls, september(2026))).toBe("erwachsen");
  });

  it("ohne Schulstufe gilt die Vorgabe teens - und ein Ladefehler nimmt nichts weg", () => {
    expect(klassenAlter(null, september(2026))).toBeNull();
    expect(klassenStufe(null, september(2026))).toBe("teens");
    expect(klassenStufe({}, september(2026))).toBe("teens");
    expect(klassenStufe({ schulstufe: 0 }, september(2026))).toBe("teens");
  });

  it(`eine unsinnige Schulstufe zählt wie „nicht gesetzt"`, () => {
    expect(klassenStufe({ schulstufe: 27 }, september(2026))).toBe("teens");
    expect(klassenStufe({ schulstufe: -3 }, september(2026))).toBe("teens");
    expect(aktuelleSchulstufe({ schulstufe: 27 }, september(2026))).toBeNull();
  });

  it("ab der 13. Schulstufe wird nicht weitergezählt - und es bleibt erwachsen", () => {
    const cls = { schulstufe: 12, schulstufeSchuljahr: 2026 };
    // 2026 ⇒ 12, 2027 ⇒ 13, 2040 ⇒ immer noch 13 (Deckel).
    expect(aktuelleSchulstufe(cls, september(2027))).toBe(SCHULSTUFE_MAX);
    expect(aktuelleSchulstufe(cls, september(2040))).toBe(SCHULSTUFE_MAX);
    expect(klassenStufe(cls, september(2040))).toBe("erwachsen");
  });

  it("ohne Eintragsjahr gilt die Stufe so, wie sie dasteht - nie rückwärts", () => {
    expect(aktuelleSchulstufe({ schulstufe: 5 }, september(2030))).toBe(5);
    // Ein Eintragsjahr in der Zukunft darf nicht abziehen.
    expect(
      aktuelleSchulstufe({ schulstufe: 5, schulstufeSchuljahr: 2099 }, september(2026)),
    ).toBe(5);
  });

  it("die Grundannahme steht als Konstante da: 1. Schulstufe = 7 Jahre", () => {
    expect(ALTER_IN_ERSTER_SCHULSTUFE).toBe(7);
    expect(klassenAlter({ schulstufe: 1, schulstufeSchuljahr: 2026 }, september(2026))).toBe(7);
  });
});
