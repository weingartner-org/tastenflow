/**
 * ★★ WÄCHTER: Die Jahreskarte rechnet Werte, keine Note (N4, 01.09.2026).
 *
 * Johannes am 31.08.2026, wörtlich: *„das sind Werte, auf die ein Lehrer dann
 * seine Note bauen kann, nicht die App!"*
 *
 * Gepinnt werden die Entscheidungen, die genau hier falsch werden könnten:
 *
 *  F18 · „um 4 gesteigert" sind 4 ANSCHLÄGE, keine Prozent (211 → 215).
 *  F19 · Ausgangspunkt ist die KLASSEN-Startwoche: die erste Woche des
 *        Schuljahres, in der mindestens die Hälfte der Klasse geübt hat -
 *        „damit die Ferienarbeiter nicht den Start auslösen".
 *  F19 · Wer später dazukommt, bekommt die SPÄTERE der beiden Wochen.
 *  F13 · Bezug wahlweise Vorwoche (Grundstellung) oder Startwoche.
 * 4.7a · Wochenaufgaben werden EINZELN (nach Minuten) gezählt, nicht wochenweise.
 *
 * ⚠️ Und die Zusicherung, die keine Zahl ist: OHNE Bezugspunkt bleibt die
 * Steigerung `null` - nicht 0. Eine Null stünde da wie „hat sich nicht
 * verbessert"; das wäre eine Behauptung über ein Kind, für die es keine
 * Messung gibt ([[feedback_nie_gegen_das_kind]]).
 */
import { describe, expect, it } from "vitest";
import {
  jahreskarte,
  klassenStartwoche,
  schuljahrVon,
  verteilung,
  wochenwerte,
} from "@/lib/typing/jahreskarte";
import type { TaskEvent } from "@/lib/typing";

/** Ein Übungsblock: `chars` Zeichen, `errors` Fehler, in `sekunden`. */
function block(ts: number, chars: number, errors: number, sekunden: number): TaskEvent {
  return { ts, lesson: "l1", chars, errors, ms: sekunden * 1000 };
}

/** Montag 00:00 der Woche, die `tage` Tage nach dem 1.8. beginnt. */
function tagImSchuljahr(jahr: number, monat: number, tag: number, stunde = 10): number {
  return new Date(jahr, monat, tag, stunde, 0, 0, 0).getTime();
}

describe("★ Das Schuljahr ist fest 1.8. - 31.7. (F14)", () => {
  it("der 1. September 2026 liegt im Schuljahr 2026/27", () => {
    const sj = schuljahrVon(tagImSchuljahr(2026, 8, 1));
    expect(sj.label).toBe("2026/27");
    expect(new Date(sj.vonMs).getMonth()).toBe(7);
    expect(new Date(sj.vonMs).getDate()).toBe(1);
    expect(new Date(sj.vonMs).getFullYear()).toBe(2026);
  });

  it("der 15. Juli 2027 gehört NOCH zu 2026/27", () => {
    expect(schuljahrVon(tagImSchuljahr(2027, 6, 15)).label).toBe("2026/27");
  });

  it("der 1. August 2027 ist schon 2027/28", () => {
    expect(schuljahrVon(tagImSchuljahr(2027, 7, 1)).label).toBe("2027/28");
  });
});

describe("★★ F19/F21 - die Startwoche ist die der KLASSE, nicht die der Person", () => {
  const sj = schuljahrVon(tagImSchuljahr(2026, 8, 20));
  // Vier Kinder. Eines übt schon in den Ferien (10.8.), alle vier ab dem 7.9.
  const ferienkind = [block(tagImSchuljahr(2026, 7, 10), 300, 6, 120)];
  const spaeter = (tag: number) => [block(tagImSchuljahr(2026, 8, tag), 300, 6, 120)];

  it("★ ein einzelnes Ferienkind löst den Start NICHT aus", () => {
    const sw = klassenStartwoche(
      [ferienkind, spaeter(7), spaeter(8), spaeter(9)],
      sj,
    );
    expect(sw).not.toBeNull();
    // Die Schwelle bei vier Kindern ist zwei - die Ferienwoche hat nur eines.
    expect(sw!.schwelle).toBe(2);
    expect(new Date(sw!.startMs).getMonth()).toBe(8);
    expect(sw!.aktive).toBeGreaterThanOrEqual(2);
  });

  it("erreicht KEINE Woche die Schwelle, gibt es keine Startwoche", () => {
    // Vier Kinder, jedes in einer ANDEREN Woche - nie zwei gleichzeitig.
    const sw = klassenStartwoche(
      [
        [block(tagImSchuljahr(2026, 8, 1), 100, 2, 60)],
        [block(tagImSchuljahr(2026, 8, 8), 100, 2, 60)],
        [block(tagImSchuljahr(2026, 8, 15), 100, 2, 60)],
        [block(tagImSchuljahr(2026, 8, 22), 100, 2, 60)],
      ],
      sj,
    );
    expect(sw).toBeNull();
  });

  it("⚠️ eine leere Klasse hat keine Startwoche (Schwelle 0 wäre eine Falle)", () => {
    expect(klassenStartwoche([], sj)).toBeNull();
  });

  it("die Schwelle ist die aufgerundete Hälfte: 24 ⇒ 12, 6 ⇒ 3, 5 ⇒ 3", () => {
    const eineWoche = (n: number) =>
      Array.from({ length: n }, () => [block(tagImSchuljahr(2026, 8, 7), 100, 2, 60)]);
    expect(klassenStartwoche(eineWoche(24), sj)!.schwelle).toBe(12);
    expect(klassenStartwoche(eineWoche(6), sj)!.schwelle).toBe(3);
    expect(klassenStartwoche(eineWoche(5), sj)!.schwelle).toBe(3);
  });
});

describe("★★ F18 - eine Steigerung zaehlt ANSCHLAEGE, keine Prozent", () => {
  // Woche A: 211 Anschläge/Min. Woche B (die aktuelle): 215.
  // 211 Zeichen in 60 s = 211 cpm; 215 Zeichen in 60 s = 215 cpm.
  const jetzt = tagImSchuljahr(2026, 8, 15);
  const events = [
    block(tagImSchuljahr(2026, 8, 8), 211, 0, 60),
    block(jetzt, 215, 0, 60),
  ];

  it("die Steigerung ist 4, nicht 1,9 Prozent", () => {
    const k = jahreskarte(events, jetzt, { bezug: "vorwoche" });
    expect(k.geschwindigkeit.jetzt).toBe(215);
    expect(k.geschwindigkeit.vorher).toBe(211);
    expect(k.geschwindigkeit.steigerung).toBe(4);
  });

  it("bei der Treffsicherheit sind es Prozentpunkte", () => {
    // Woche A: 100 Zeichen, 6 Fehler ⇒ 94 %. Woche B: 100 Zeichen, 4 ⇒ 96 %.
    const k = jahreskarte(
      [
        block(tagImSchuljahr(2026, 8, 8), 100, 6, 60),
        block(jetzt, 100, 4, 60),
      ],
      jetzt,
      { bezug: "vorwoche" },
    );
    expect(Math.round(k.treffsicherheit.jetzt * 100)).toBe(96);
    expect(k.treffsicherheit.steigerung).toBe(2);
  });
});

describe("★★★ ohne Bezugspunkt ist die Steigerung `null`, NICHT 0", () => {
  it("die erste Woche überhaupt hat nichts, womit sie sich vergleichen könnte", () => {
    const jetzt = tagImSchuljahr(2026, 8, 15);
    const k = jahreskarte([block(jetzt, 200, 4, 60)], jetzt, { bezug: "vorwoche" });
    expect(k.geschwindigkeit.jetzt).toBe(200);
    expect(k.geschwindigkeit.steigerung).toBeNull();
    expect(k.treffsicherheit.steigerung).toBeNull();
  });
});

describe("★ F13 - Bezug wahlweise Vorwoche oder Startwoche, Grundstellung Vorwoche", () => {
  const jetzt = tagImSchuljahr(2026, 8, 22);
  const events = [
    block(tagImSchuljahr(2026, 8, 1), 100, 0, 60), // Startwoche: 100
    block(tagImSchuljahr(2026, 8, 15), 180, 0, 60), // Vorwoche:   180
    block(jetzt, 200, 0, 60), // jetzt:      200
  ];
  const sw = klassenStartwoche([events], schuljahrVon(jetzt));

  it("ohne Angabe gilt die Vorwoche", () => {
    expect(jahreskarte(events, jetzt).bezug).toBe("vorwoche");
    expect(jahreskarte(events, jetzt).geschwindigkeit.steigerung).toBe(20);
  });

  it("umgeschaltet auf start zaehlt der Abstand zur Startwoche", () => {
    const k = jahreskarte(events, jetzt, { bezug: "start", startwoche: sw });
    expect(k.geschwindigkeit.steigerung).toBe(100);
  });
});

describe("★★ F19 - wer später dazukommt, bekommt die SPÄTERE der beiden Wochen", () => {
  it("der Ausgangspunkt ist die eigene erste Woche, nicht die der Klasse", () => {
    const jetzt = tagImSchuljahr(2026, 10, 20);
    // Die Klasse begann im September; dieses Kind kam im November dazu.
    const klasse = [
      block(tagImSchuljahr(2026, 8, 7), 100, 0, 60),
      block(tagImSchuljahr(2026, 8, 8), 100, 0, 60),
    ];
    const sw = klassenStartwoche([klasse, klasse], schuljahrVon(jetzt));
    expect(sw).not.toBeNull();

    const zuzug = [
      block(tagImSchuljahr(2026, 10, 9), 150, 0, 60),
      block(jetzt, 190, 0, 60),
    ];
    const k = jahreskarte(zuzug, jetzt, { bezug: "start", startwoche: sw });
    // Nicht die September-Woche der Klasse (die hat dieses Kind nie erlebt),
    // sondern seine eigene erste Woche mit Daten.
    expect(new Date(k.ausgangswoche!.startMs).getMonth()).toBe(10);
    expect(k.geschwindigkeit.steigerung).toBe(40);
  });
});

describe("★★★ 4.7a - die Wochenaufgaben werden EINZELN gezählt (W3a: jetzt in Minuten und Prozent)", () => {
  /**
   * Johannes: „wenn ein Schüler immer 2 von 3 Aufgaben in der Woche macht,
   * bekommt er den gleichen Wert wie einer der nichts macht."
   *
   * ★ W3a (18.09.2026): Das Ziel steht seither in MINUTEN pro Woche
   * (`wochenzielVerlauf`, `wochenziel.ts`), nicht mehr Einheiten × Minuten -
   * hier 30 Min./Woche (vorher: 3 Einheiten je 10 Minuten). Das Kind übt in
   * drei Wochen je zweimal 10 Minuten, an verschiedenen Tagen; die dritte
   * Woche ist noch die LAUFENDE und zählt darum nicht mit
   * ([[feedback_nie_gegen_das_kind]]: eine offene Woche ist nicht
   * „verpasst"). Wochenweise gezählt (statt in Minuten) wäre das 0 ganz
   * erfüllte Wochen - genau das demonstriert dieser Wächter.
   */
  it("60 von 90 Minuten (⅔) - statt 0 von 3 Wochen ganz erfüllt", () => {
    // Zwei Wochen NACH der dritten Übungswoche - alle drei sind darum
    // ABGESCHLOSSENE Ziel-Wochen, keine davon ist noch die laufende.
    const jetzt = tagImSchuljahr(2026, 9, 5);
    const events: TaskEvent[] = [];
    for (const montag of [7, 14, 21])
      for (const versatz of [0, 1])
        // 600 Zeichen in 600 s = 10 Minuten Übung, 60 Anschläge/Min.
        events.push(block(tagImSchuljahr(2026, 8, montag + versatz), 600, 0, 600));

    const k = jahreskarte(events, jetzt, {
      wochenzielVerlauf: [{ ab: "2026-W01", minuten: 30 }],
      // Nur die drei geübten Kalenderwochen sind Ziel-Wochen - sonst wäre
      // (mangels Auswahl) JEDE Woche seit „2026-W01" eine, und der Wächter
      // zählte hier ~40 statt 3 (Begründung {@link istZielwoche}).
      goalWeeks: ["2026-W37", "2026-W38", "2026-W39"],
    });
    expect(k.aufgaben.aktiv).toBe(true);
    expect(k.aufgaben.wochenGesamt).toBe(3);
    expect(k.aufgaben.wochenGanz).toBe(0);
    expect(k.aufgaben.minutenErfuellt).toBe(60);
    expect(k.aufgaben.minutenZiel).toBe(90);
    expect(k.aufgaben.anteil).toBeCloseTo(2 / 3);
  });

  it("ohne gesetztes Ziel gibt es keine Ziel-Minuten - nicht alles offen (F10)", () => {
    const jetzt = tagImSchuljahr(2026, 8, 25);
    const k = jahreskarte([block(jetzt, 600, 0, 600)], jetzt);
    expect(k.aufgaben.aktiv).toBe(false);
    expect(k.aufgaben.minutenZiel).toBe(0);
    expect(k.aufgaben.anteil).toBeNull();
  });
});

describe("★ Der Verteilungsbalken - vier Töpfe, und die Zahlen ersetzen ihn", () => {
  // ★ B1 (11.09.2026): Die Töpfe sind SCORE-Töpfe geworden (0..100), nicht mehr
  // Treffsicherheits-Töpfe (0..1). Die Leiste zeigt seither den Score.
  it("teilt nach den Score-Grenzen 50 / 70 / 85 auf", () => {
    expect(verteilung([12, 49, 50, 69, 70, 84, 85, 99])).toEqual([2, 2, 2, 2]);
  });

  it("die Summe der Töpfe ist die Zahl der Werte - niemand fällt heraus", () => {
    const werte = [0, 51, 72, 86, 100];
    expect(verteilung(werte).reduce((a, b) => a + b, 0)).toBe(werte.length);
  });
});

describe("★ Die Zeile Grundlage - sie macht die drei Zahlen beurteilbar", () => {
  it("zählt Übungsblöcke, verschiedene Tage und die geübte Zeit", () => {
    const jetzt = tagImSchuljahr(2026, 8, 20);
    const events = [
      block(tagImSchuljahr(2026, 8, 7, 9), 300, 0, 120),
      block(tagImSchuljahr(2026, 8, 7, 14), 300, 0, 120),
      block(tagImSchuljahr(2026, 8, 8, 9), 300, 0, 120),
    ];
    const k = jahreskarte(events, jetzt);
    expect(k.grundlage.bloecke).toBe(3);
    expect(k.grundlage.tage).toBe(2);
    expect(k.grundlage.ms).toBe(360_000);
  });

  it("Ereignisse aus einem ANDEREN Schuljahr zählen nicht mit", () => {
    const jetzt = tagImSchuljahr(2026, 8, 20);
    const events = [
      block(tagImSchuljahr(2026, 5, 10), 300, 0, 120), // Juni 2026 = 2025/26
      block(tagImSchuljahr(2026, 8, 7), 300, 0, 120),
    ];
    expect(jahreskarte(events, jetzt).grundlage.bloecke).toBe(1);
    expect(wochenwerte(events, schuljahrVon(jetzt))).toHaveLength(1);
  });
});
