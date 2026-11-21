/**
 * ★★ WÄCHTER: Der Zeitraum der Lernenden-Tabelle (01.09.2026).
 *
 * Johannes: *„dieser kopf soll bei der schülerstatistik-Tabelle sein, nicht
 * beim streifen"* · *„links [Pfeile], mittig ein schalter schuljahr, und rechts
 * ein schalter gesamt"*.
 *
 * Hier steht die Rechnung. Dass der Filter im ECHTEN Einbau wirkt, misst
 * `tests/tastenflow-zeitraum-ui.test.tsx` - das ist die Stelle, an der so
 * etwas erfahrungsgemäss schiefgeht.
 */
import { describe, expect, it } from "vitest";

import type { TaskEvent } from "@/lib/typing";
import {
  ereignisseIm,
  grenzen,
  schuljahrIstAlles,
  wochenBereichKompakt,
  zeitraumTitel,
  type Zeitraum,
} from "@/lib/typing/zeitraum";

const TAG = 86_400_000;

function ev(tsVersatzTage: number): TaskEvent {
  return {
    ts: Date.now() - tsVersatzTage * TAG,
    lesson: "l1",
    chars: 100,
    errors: 5,
    ms: 60_000,
  } as TaskEvent;
}

const WOCHE: Zeitraum = { art: "woche", wochenVersatz: 0 };
const SCHULJAHR: Zeitraum = { art: "schuljahr", wochenVersatz: 0 };
const GESAMT: Zeitraum = { art: "gesamt", wochenVersatz: 0 };

describe("★ Gesamt siebt nichts aus", () => {
  it("hat keine Grenzen und behält jedes Ereignis", () => {
    const jetzt = Date.now();
    expect(grenzen(GESAMT, jetzt, null)).toBeNull();
    // Auch etwas, das Jahre her ist.
    const alt = [ev(0), ev(900)];
    expect(ereignisseIm(alt, GESAMT, jetzt, null)).toHaveLength(2);
  });
});

describe("★★ Die Woche - und zwar die vom Unterrichtstag", () => {
  it("umfasst sieben Tage", () => {
    const jetzt = Date.now();
    const g = grenzen(WOCHE, jetzt, null);
    expect(g).not.toBeNull();
    expect(g!.bisMs - g!.vonMs).toBe(7 * TAG - 1);
  });

  it("lässt aus, was vor drei Wochen war", () => {
    const jetzt = Date.now();
    const alle = [ev(0), ev(21)];
    expect(ereignisseIm(alle, WOCHE, jetzt, null)).toHaveLength(1);
  });

  it("★★★ blättert um GENAU eine Woche - nicht um sieben Tage ab heute", () => {
    // Der Unterschied zählt: Die Grenze muss auf demselben Wochentag liegen
    // wie diese Woche, sonst wandert sie beim Blättern.
    // ★ 28.10.2026: ein FESTER Tag mitten im Sommerzeit-Jahr, nicht `Date.now()`. Eine Kalenderwoche über die Zeitumstellung
    //   (letzter Sonntag im März und Oktober) ist 7 Tage plus oder minus 1 Stunde lang - das ist richtig so, aber dieser
    //   Test rechnet exakte 168 Stunden und wurde darum in jeder Woche nach einer Umstellung rot (zuletzt 25.10.2026).
    const jetzt = Date.parse("2026-06-10T10:00:00Z");
    const jetztWoche = grenzen(WOCHE, jetzt, null)!;
    const vorige = grenzen({ art: "woche", wochenVersatz: -1 }, jetzt, null)!;
    expect(jetztWoche.vonMs - vorige.vonMs).toBe(7 * TAG);
  });

  it("⚠️ die Wochengrenze folgt dem Unterrichtstag (N6), sie wird nicht neu erfunden", () => {
    const jetzt = Date.now();
    const ohne = grenzen(WOCHE, jetzt, null)!;
    // Ein Donnerstag-Rhythmus verschiebt die Grenze gegenüber Montag-Sonntag.
    const mitDo = grenzen(WOCHE, jetzt, { unterrichtstag: 3, giltAbMs: 0 })!;
    // Sie MUSS sich unterscheiden, sonst ruft diese Datei die N6-Rechnung nicht.
    const gleich = ohne.vonMs === mitDo.vonMs;
    // An manchen Wochentagen fallen beide zufällig zusammen - dann prüfen wir
    // einen zweiten Rhythmus, damit der Test nicht vom Kalendertag abhängt.
    const mitSo = grenzen(WOCHE, jetzt, { unterrichtstag: 6, giltAbMs: 0 })!;
    expect(
      !gleich || ohne.vonMs !== mitSo.vonMs,
      "kein Rhythmus verschiebt die Grenze - wird wochenStartFuerTag wirklich gerufen?",
    ).toBe(true);
  });
});

describe("★ Das Schuljahr", () => {
  it("lässt aus, was vor dem 1. August liegt", () => {
    const jetzt = new Date(2026, 8, 1).getTime(); // 01.09.2026
    const imJahr = { ...ev(0), ts: new Date(2026, 8, 1).getTime() } as TaskEvent;
    const davor = { ...ev(0), ts: new Date(2026, 5, 15).getTime() } as TaskEvent;
    expect(ereignisseIm([imJahr, davor], SCHULJAHR, jetzt, null)).toHaveLength(1);
  });

  it("nennt sich mit Jahreszahl", () => {
    const jetzt = new Date(2026, 8, 1).getTime();
    expect(zeitraumTitel(SCHULJAHR, jetzt, null)).toBe("Schuljahr 2026/27");
  });
});

describe("★★ Der Titel sagt, wo man steht", () => {
  it("beim Blättern steht ein DATUM da, nicht nur ein Wort", () => {
    const jetzt = Date.now();
    const zwei = zeitraumTitel({ art: "woche", wochenVersatz: -2 }, jetzt, null);
    // Nach zwei Schritten wäre „vorige Woche" gelogen - das Datum stimmt immer.
    expect(zwei).toMatch(/\d{2}\.\d{2}\./);
    expect(zwei).not.toContain("Vorige Woche");
  });

  it("Gesamt heisst Gesamt", () => {
    expect(zeitraumTitel(GESAMT, Date.now(), null)).toBe("Gesamt");
  });
});

/**
 * ★ WÄCHTER (18.09.2026, Bauplan „Meine Klassen" E1): der kurze Datumsbereich
 * am „Woche"-Schalter im Tabellenkopf (`ZeitraumKopf.tsx`) - er ersetzt dort
 * die Überschrift, die bis dahin den vollen Satz trug.
 */
describe("★ wochenBereichKompakt - der kurze Datumsbereich am Schalter", () => {
  it("bleibt die Woche in einem Monat, steht der Monat nur am Ende", () => {
    // Mo 14.09.2026 - So 20.09.2026.
    const jetzt = new Date(2026, 8, 14).getTime();
    expect(wochenBereichKompakt(0, jetzt, null)).toBe("14.-20.09.");
  });

  it("liegt die Woche in zwei Monaten, steht der Monat an BEIDEN Enden", () => {
    // Mo 28.09.2026 - So 04.10.2026.
    const jetzt = new Date(2026, 8, 30).getTime();
    expect(wochenBereichKompakt(0, jetzt, null)).toBe("28.09.-04.10.");
  });

  it("blättert genau wie `grenzen` - dieselbe Quelle, keine zweite Rechnung", () => {
    const jetzt = new Date(2026, 8, 14).getTime();
    // Eine Woche zurück: Mo 07.09. - So 13.09.
    expect(wochenBereichKompakt(-1, jetzt, null)).toBe("07.-13.09.");
  });

  it("folgt dem Unterrichtstag der Klasse (N6), nicht Montag bis Sonntag", () => {
    // Wie bei `grenzen()` oben: an manchen Wochentagen fallen Rhythmus und
    // Montag-Sonntag zufällig zusammen - darum zwei Kandidaten.
    const jetzt = new Date(2026, 8, 30).getTime();
    const ohne = wochenBereichKompakt(0, jetzt, null);
    const mitDo = wochenBereichKompakt(0, jetzt, { unterrichtstag: 3, giltAbMs: 0 });
    const mitSo = wochenBereichKompakt(0, jetzt, { unterrichtstag: 6, giltAbMs: 0 });
    expect(
      ohne !== mitDo || ohne !== mitSo,
      "kein Rhythmus verschiebt den Bereich - wird grenzen() wirklich gerufen?",
    ).toBe(true);
  });
});

describe("★★ Wann zeigen Schuljahr und Gesamt dasselbe?", () => {
  it("ohne Ereignisse vor dem Schuljahr: ja", () => {
    const jetzt = new Date(2026, 8, 1).getTime();
    const drin = [{ ...ev(0), ts: new Date(2026, 8, 1).getTime() } as TaskEvent];
    expect(schuljahrIstAlles(drin, jetzt)).toBe(true);
  });

  it("mit einem Ereignis aus dem Juni: nein", () => {
    const jetzt = new Date(2026, 8, 1).getTime();
    const gemischt = [
      { ...ev(0), ts: new Date(2026, 8, 1).getTime() } as TaskEvent,
      { ...ev(0), ts: new Date(2026, 5, 15).getTime() } as TaskEvent,
    ];
    expect(schuljahrIstAlles(gemischt, jetzt)).toBe(false);
  });

  it("eine leere Klasse behauptet keinen Unterschied", () => {
    expect(schuljahrIstAlles([], Date.now())).toBe(true);
  });
});
