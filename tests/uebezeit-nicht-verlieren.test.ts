import { describe, it, expect } from "vitest";
import { bilanzErgaenzen, tagesbilanz, ereignisAnhaengen } from "@/lib/typing/eventPack";
import type { TaskEvent } from "@/lib/typing/account";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * DIE ÜBEZEIT DARF NICHT VERSCHWINDEN (08.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes sah es auf der neuen Statistikseite sofort: *„es kann nicht sein
 * dass die übezeit in allen klassen 0 min ist?"* - 47 Kinder, 14 Klassen,
 * überall „0 Min" und „nie geübt".
 *
 * Die Ursache stand nicht in der Auswertung, sondern in der ERFASSUNG:
 *
 *     zeile.min = Math.round((zeile.min * 60_000 + ms) / 60_000);
 *
 * `zeile.min` war bereits gerundet, der Rest also schon weg - jedes Ereignis
 * fing wieder bei einem vollen Vielfachen an. Eine Tipp-Zeile dauert 10 bis 30
 * Sekunden und erreichte die Schwelle von 30 Sekunden fast nie. An echten Daten
 * gemessen: 1.478 Zeichen, 122 Zeilen … und 0 Minuten.
 *
 * ⚠️ Der alte Kommentar an der Stelle behauptete ausdrücklich, so gingen die
 * halben Minuten NICHT verloren. Ein Kommentar ist kein Beweis - dieser Test
 * ist einer.
 */

function ereignis(tsMinuten: number, sekunden: number): TaskEvent {
  return {
    ts: Date.UTC(2026, 8, 8) + tsMinuten * 60_000,
    ms: sekunden * 1000,
    activeMs: sekunden * 1000,
    chars: 40,
    errors: 1,
    lesson: "l1",
  } as TaskEvent;
}

describe("Übezeit in der Tagesbilanz", () => {
  it("★★★ 30 Zeilen à 20 Sekunden sind 10 Minuten, nicht null", () => {
    // Genau der Fall aus der Wirklichkeit: viele kurze Zeilen.
    let bilanz = bilanzErgaenzen([], ereignis(0, 20));
    for (let i = 1; i < 30; i++) bilanz = bilanzErgaenzen(bilanz, ereignis(i, 20));
    expect(bilanz).toHaveLength(1);
    expect(bilanz[0].min).toBe(10); // 30 × 20 s = 600 s = 10 min
  });

  it("verliert auch bei sehr kurzen Zeilen nichts", () => {
    let bilanz = bilanzErgaenzen([], ereignis(0, 8));
    for (let i = 1; i < 60; i++) bilanz = bilanzErgaenzen(bilanz, ereignis(i, 8));
    expect(bilanz[0].min).toBe(8); // 60 × 8 s = 480 s = 8 min
  });

  it("zählt lange Zeilen weiterhin richtig", () => {
    let bilanz = bilanzErgaenzen([], ereignis(0, 90));
    bilanz = bilanzErgaenzen(bilanz, ereignis(2, 90));
    expect(bilanz[0].min).toBe(3); // 180 s
  });

  it("★★ der Sekundenrest überlebt das Speichern und Laden", () => {
    // Ohne das wäre der Fehler beim nächsten Schreiben zurück: Der Rest ginge
    // verloren, sobald die Bilanz einmal durch den Speicher gelaufen ist.
    // ⚠️ `ereignisAnhaengen` nimmt EIN Ereignis, keine Liste - und es ist genau
    // der Weg, den beide Speicher (Gerät und Server) gehen. Deshalb wird hier
    // durch ihn gemessen und nicht an ihm vorbei.
    let daten: unknown = {};
    for (let i = 0; i < 30; i++) {
      daten = ereignisAnhaengen(daten, ereignis(i, 20));
    }
    const gelesen = tagesbilanz(daten);
    expect(gelesen).toHaveLength(1);
    expect(gelesen[0].min).toBe(10);
  });

  it("alte Zeilen ohne Sekundenrest bleiben gültig", () => {
    // Fünf Felder statt sechs - so sehen alle Zeilen von vor dem 08.09.2026 aus.
    const alt = tagesbilanz({ tage: "fwx,5,172,11,3e" });
    expect(alt).toHaveLength(1);
    expect(alt[0].min).toBe(5);
    expect(alt[0].restMs ?? 0).toBe(0);
  });

  it("★ eine Bilanz mit 122 Zeilen kann nicht 0 Minuten haben", () => {
    /*
      Der Wächter gegen die Wiederkehr: Genau diese Kombination stand in den
      echten Daten (fwx,0,172,11,3e). Sie ist arithmetisch unmöglich - 122
      Zeilen brauchen mehr als eine halbe Minute.
    */
    let bilanz = bilanzErgaenzen([], ereignis(0, 12));
    for (let i = 1; i < 122; i++) bilanz = bilanzErgaenzen(bilanz, ereignis(i, 12));
    expect(bilanz[0].zeilen).toBe(122);
    expect(bilanz[0].min).toBeGreaterThan(0);
    expect(bilanz[0].min).toBe(24); // 122 × 12 s = 1464 s = 24,4 min
  });
});
