/**
 * ════════════════════════════════════════════════════════════════════════════
 * DIE PAUSENTOLERANZ WÄCHST MIT DEM KIND
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Johannes am 01.09.2026: *„c ist ein guter vorschlag, aber dann mach
 * untergrenze 5 sec, wenn sie eh dynamisch ist."*
 *
 * EINE Regel für alle, aber je Kind aus seinen eigenen Pausen gerechnet. Die
 * Begründung samt Messung steht im Kopf von `practiceClock.ts`; hier steht,
 * was gelten MUSS - und das ist mehr als „die Formel rechnet richtig".
 *
 * ── Die vier Sätze, die diese Datei bewacht ────────────────────────────────
 *
 * 1. Ein Kind, das lange liest, bekommt eine grössere Toleranz als eines, das
 *    die Zeile sieht. Das ist der ganze Zweck.
 * 2. Die Grenzen halten - 5 s unten (Johannes), 60 s oben.
 * 3. „Tempo zählt nicht" hat VORRANG. Wer den Schalter setzt, will nicht, dass
 *    eine Kennzahl ihn wieder einholt.
 * 4. Bei zu wenig Daten wird NICHT gerechnet, sondern die Vorgabe genommen.
 *    Ein Perzentil aus zwanzig Werten ist Zufall.
 */
import { describe, expect, it } from "vitest";
import {
  IDLE_CAP_MIN_MS,
  IDLE_CAP_MS,
  IDLE_CAP_SLOW_MS,
  TOLERANZ_MIN_LUECKEN,
  getPracticeMs,
  notePracticeActivity,
  primePracticeClock,
  resetPracticeClock,
  setPracticeIdleCap,
  toleranzFuer,
  zeilenLuecken,
} from "@/lib/typing/practiceClock";
import { GOAL_CHANGE_LESSON, type TaskEvent } from "@/lib/typing/account";

const TAG = new Date(2026, 7, 20, 9, 0, 0).getTime();

/**
 * Ein Übungstag: `n` Zeilen à `zeileMs`, dazwischen je `pauseMs`. Genau so
 * sieht die Wirklichkeit aus - die Pause zwischen den Zeilen ist das Lesen.
 */
function tag(n: number, zeileMs: number, pauseMs: number, start = TAG): TaskEvent[] {
  const out: TaskEvent[] = [];
  let t = start;
  for (let i = 0; i < n; i++) {
    t += zeileMs;
    out.push({ ts: t, lesson: "adaptiv", chars: 30, errors: 0, ms: zeileMs, activeMs: zeileMs });
    t += pauseMs;
  }
  return out;
}

const genug = TOLERANZ_MIN_LUECKEN + 20;

describe("Die Toleranz richtet sich nach dem Kind", () => {
  it("★★★★★ wer lange liest, bekommt mehr Zeit als wer die Zeile sieht", () => {
    /*
      Der Kern. Gemessen liegen Kinder mit Blindheit bei 78 % Pausen über 3 s,
      sehende bei 19 % - bei GLEICHEM Tipptempo. Eine Zahl für beide kann nur
      gegen eine der Gruppen ausfallen.
    */
    const liest = toleranzFuer(tag(genug, 9_000, 18_000), false);
    const sieht = toleranzFuer(tag(genug, 9_000, 1_500), false);
    expect(liest).toBeGreaterThan(sieht);
    expect(liest).toBeGreaterThan(10_000);
  });

  it("hält die Untergrenze von 5 s", () => {
    // Ein Kind ohne nennenswerte Pausen. Die Untergrenze nimmt ihm nichts -
    // es HAT keine langen Pausen, die gekappt werden könnten.
    const t = toleranzFuer(tag(genug, 8_000, 200), false);
    expect(t).toBe(IDLE_CAP_MIN_MS);
    expect(IDLE_CAP_MIN_MS).toBe(5_000);
  });

  it("hält die Obergrenze von 60 s", () => {
    const t = toleranzFuer(tag(genug, 8_000, 5 * 60_000), false);
    expect(t).toBe(IDLE_CAP_SLOW_MS);
    expect(IDLE_CAP_SLOW_MS).toBe(60_000);
  });

  it(`★★★ „Tempo zählt nicht" hat Vorrang vor jeder Rechnung`, () => {
    // Auch bei einem Kind, dessen Pausen rechnerisch 5 s ergäben.
    expect(toleranzFuer(tag(genug, 8_000, 200), true)).toBe(IDLE_CAP_SLOW_MS);
  });

  it("★★★ rechnet erst, wenn genug Zeilenwechsel da sind", () => {
    /*
      Sonst springt die Toleranz eines Kindes in seinen ersten Tagen hin und
      her - bei zwanzig Lücken bestimmen zwei Ausreisser das Perzentil.
    */
    const wenig = tag(TOLERANZ_MIN_LUECKEN - 10, 8_000, 25_000);
    expect(zeilenLuecken(wenig).length).toBeLessThan(TOLERANZ_MIN_LUECKEN);
    expect(toleranzFuer(wenig, false)).toBe(IDLE_CAP_MS);
    expect(toleranzFuer([], false)).toBe(IDLE_CAP_MS);
    expect(toleranzFuer(undefined, false)).toBe(IDLE_CAP_MS);
  });

  it("lässt sich von einzelnen Ausreissern nicht mitreissen", () => {
    // 95. Perzentil: Fünf lange Unterbrechungen unter hundert kurzen Zeilen
    // dürfen die Toleranz nicht auf die Obergrenze heben.
    const gemischt = [
      ...tag(genug, 8_000, 2_000),
      ...tag(5, 8_000, 20 * 60_000, TAG + 20 * 60_000 * 3),
    ];
    expect(toleranzFuer(gemischt, false)).toBeLessThan(30_000);
  });
});

describe("Welche Pausen überhaupt gezählt werden", () => {
  it("zählt keine Pause über Tagesgrenzen hinweg", () => {
    const zwei = [...tag(3, 8_000, 2_000), ...tag(3, 8_000, 2_000, TAG + 86_400_000)];
    // Je Tag zwei Lücken, die Nacht dazwischen zählt nicht.
    expect(zeilenLuecken(zwei).length).toBe(4);
  });

  it("zählt keine Pause länger als eine halbe Stunde", () => {
    const mitPause = [...tag(3, 8_000, 2_000), ...tag(3, 8_000, 2_000, TAG + 45 * 60_000)];
    expect(zeilenLuecken(mitPause).length).toBe(4);
  });

  it("der Ziel-Wechsel-Marker erzeugt keine Lücke", () => {
    /*
      Er ist keine Übung. Zählte er mit, machte jedes Verstellen des
      Wochenziels aus einer Pause zwei - und beide wären erfunden.
    */
    const ohne = tag(genug, 8_000, 2_000);
    const marker: TaskEvent = {
      ts: ohne[10].ts + 500,
      lesson: GOAL_CHANGE_LESSON,
      chars: 0,
      errors: 0,
      ms: 0,
    };
    expect(zeilenLuecken([...ohne, marker]).length).toBe(zeilenLuecken(ohne).length);
  });
});

describe("★★★★★ Die Toleranz gehört zum KIND, nicht zum Gerät", () => {
  /*
    ════════════════════════════════════════════════════════════════════════
    DER FALL, DEN EIN TEST MIT EINEM KONTO NIE SIEHT
    ════════════════════════════════════════════════════════════════════════
    Ein Klassenzimmer-Rechner: Jano übt, meldet sich ab, Tester meldet sich an.
    `idleCapMs` ist Modulzustand; `resetPracticeClock` räumte sechs Werte und
    die Toleranz NICHT. Tester lief damit mit Janos Toleranz weiter.

    ⚠️ Diese Fälle brauchen ZWEI Konten nacheinander im selben Modul-Leben.
    Wer eine Seite mit EINEM Konto rendert, misst wieder nur die eigene
    Annahme - dieselbe Lücke, durch die der Packfehler in eventPack.ts
    monatelang gekommen ist.

    Gemessen wird am VERHALTEN der Uhr, nicht an der Variablen: Nach dem
    Wechsel muss eine Pause von 25 s wieder gekappt werden.
  */
  const gekappt = (pauseMs: number) => {
    const t0 = 1_000_000;
    notePracticeActivity(t0);
    notePracticeActivity(t0 + pauseMs);
    return getPracticeMs(t0 + pauseMs);
  };

  it("beim Kontowechsel gilt wieder die Vorgabe, nicht der Wert des Kindes davor", () => {
    resetPracticeClock();
    primePracticeClock("kind-toprak", 0, 1_000_000);
    setPracticeIdleCap(IDLE_CAP_SLOW_MS); // langer Leser

    primePracticeClock("kind-jano", 0, 2_000_000); // anderes Kind am selben Gerät

    // 25 s Pause: mit der Vorgabe (20 s) wird gekappt, mit 60 s nicht.
    expect(gekappt(25_000)).toBe(IDLE_CAP_MS);
  });

  it("auch dann, wenn die Ereignisse des neuen Kindes nie eintreffen", () => {
    /*
      Die Seite setzt die Toleranz erst im `.then()`. Kommt es nie (Netz weg),
      darf NICHT der Wert des vorigen Kindes weitergelten.
    */
    resetPracticeClock();
    primePracticeClock("kind-a", 0, 1_000_000);
    setPracticeIdleCap(IDLE_CAP_SLOW_MS);
    primePracticeClock("kind-b", 0, 2_000_000);
    // Kein setPracticeIdleCap - genau der Fehlerfall.
    expect(gekappt(25_000)).toBe(IDLE_CAP_MS);
  });

  it("dasselbe Kind behält seine Toleranz über ein Neuladen", () => {
    // Gegenprobe: Der Schutz darf nicht zu viel zurücksetzen.
    resetPracticeClock();
    primePracticeClock("kind-a", 0, 1_000_000);
    setPracticeIdleCap(IDLE_CAP_SLOW_MS);
    primePracticeClock("kind-a", 0, 2_000_000); // dasselbe Konto
    expect(gekappt(25_000)).toBe(25_000);
  });
});
