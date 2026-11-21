import { describe, it, expect, beforeEach } from "vitest";
import {
  IDLE_CAP_MS,
  formatPracticeSpoken,
  formatPracticeTime,
  getPracticeMs,
  notePracticeActivity,
  primePracticeClock,
  resetPracticeClock,
  takePracticeDelta,
  todayActiveMs,
} from "../src/lib/typing";
import { GOAL_CHANGE_LESSON, type TaskEvent } from "../src/lib/typing/account";

describe("formatPracticeTime", () => {
  it("formatiert M:SS und ab einer Stunde H:MM:SS", () => {
    expect(formatPracticeTime(0)).toBe("0:00");
    expect(formatPracticeTime(9_000)).toBe("0:09");
    expect(formatPracticeTime(65_000)).toBe("1:05");
    expect(formatPracticeTime(3_661_000)).toBe("1:01:01");
  });
});

describe("formatPracticeSpoken — ausgeschrieben für Braille/Ansage", () => {
  it("nennt Sekunden/Minuten/Stunden in passendem Singular/Plural", () => {
    expect(formatPracticeSpoken(0)).toBe("0 Sekunden");
    expect(formatPracticeSpoken(1_000)).toBe("1 Sekunde");
    expect(formatPracticeSpoken(9_000)).toBe("9 Sekunden");
    expect(formatPracticeSpoken(60_000)).toBe("1 Minute");
    expect(formatPracticeSpoken(200_000)).toBe("3 Minuten 20 Sekunden");
    // ab einer Stunde keine Sekunden mehr (zu kleinteilig)
    expect(formatPracticeSpoken(3_900_000)).toBe("1 Stunde 5 Minuten");
  });
});

/**
 * ⚠️ GEDREHT am 01.09.2026: Die Pausentoleranz ist von 5 s auf 30 s gestiegen
 * (`IDLE_CAP_MS`, Begründung dort). Die Fälle unten hielten die 5 s fest -
 * sie halten jetzt die 30 s fest, damit die Zahl nicht beim nächsten Umbau
 * unbemerkt zurückwandert. Was sie MESSEN, ist unverändert: dass die Uhr nach
 * dem letzten Anschlag noch die Toleranz lang läuft und dann einfriert.
 */
describe("Übezeit-Uhr — zählt beim Tippen, hält nach der Pausentoleranz an", () => {
  beforeEach(() => resetPracticeClock());

  it("zählt durchgehendes Tippen sekundengenau", () => {
    notePracticeActivity(0);
    for (let t = 1000; t <= 3000; t += 1000) notePracticeActivity(t);
    expect(getPracticeMs(3000)).toBe(3000); // 3 s getippt → 3 s
  });

  /*
    ★ Diese Fälle rechnen mit {@link IDLE_CAP_MS} statt mit einer hingeschriebenen
    Zahl. Vorher stand hier viermal „30_000"; als die Toleranz am 01.09.2026 auf
    20 s ging, wurden vier Fälle rot, ohne dass am Verhalten etwas falsch war -
    sie prüften die KONSTANTE statt der Uhr. Ein Test, der beim Ändern eines
    Wertes rot wird, den er selbst nicht prüft, kostet nur Zeit.
  */
  it("läuft nach dem letzten Anschlag noch die Toleranz lang und friert dann ein", () => {
    const T = IDLE_CAP_MS;
    notePracticeActivity(0);
    notePracticeActivity(2000); // 2 s lang aktiv
    expect(getPracticeMs(2000)).toBe(2000);
    // Pause: die Uhr zählt noch bis 2000 + T, dann steht sie.
    expect(getPracticeMs(5000)).toBe(5000);
    expect(getPracticeMs(2000 + T)).toBe(2000 + T);
    expect(getPracticeMs(2000 + T + 1)).toBe(2000 + T);
    expect(getPracticeMs(2000 + T + 90_000)).toBe(2000 + T); // eingefroren
  });

  it("springt nach einer langen Pause sauber wieder an (kein Sprung)", () => {
    const T = IDLE_CAP_MS;
    notePracticeActivity(0); // Abschnitt [0, T]
    // Lange nichts → vorheriger Abschnitt zählt genau die Toleranz
    expect(getPracticeMs(90_000)).toBe(T);
    notePracticeActivity(90_000); // neuer Abschnitt
    expect(getPracticeMs(91_000)).toBe(T + 1000);
  });

  it("★★★ eine Lesepause von 9 s zählt jetzt MIT - der eigentliche Punkt", () => {
    /*
      ⚠️ Genau hier lag der Fehler, den Johannes wiederholt gemeldet hat: Ein
      Kind, das sich die Zeile vorlesen lässt, hat zwischen zwei Zeilen sieben
      bis zehn Sekunden Ansage. Mit 5 s Toleranz fiel alles darüber heraus -
      bei 66 Zeilen am Tag über drei Minuten, die das Kind gesessen und die App
      nicht gezählt hat. Ist dieser Fall rot, ist die Toleranz wieder zu klein.
    */
    notePracticeActivity(0);
    notePracticeActivity(9000); // 9 s Lesepause, dann der nächste Anschlag
    expect(getPracticeMs(9000)).toBe(9000); // nahtlos, nichts verworfen
  });

  it("eine kurze Pause unter 5 s zählt durchgehend mit", () => {
    notePracticeActivity(0);
    notePracticeActivity(4000); // 4 s Pause (< 5 s) → nahtlos
    expect(getPracticeMs(4000)).toBe(4000);
  });

  it("stellt sich um 0:00 Uhr (Mitternacht) auf null", () => {
    const lateNight = new Date(2026, 0, 1, 23, 59, 50).getTime();
    notePracticeActivity(lateNight);
    expect(getPracticeMs(lateNight + 4000)).toBe(4000); // noch am 1. Jänner
    // Nach Mitternacht: Uhr auf null — der Vortag zählt nicht mehr mit.
    const nextDay = new Date(2026, 0, 2, 0, 0, 5).getTime();
    expect(getPracticeMs(nextDay)).toBe(0);
    notePracticeActivity(nextDay);
    expect(getPracticeMs(nextDay + 1000)).toBe(1000);
  });
});

describe("takePracticeDelta — EINE Zeitrechnung für Uhr und Wochenziel", () => {
  beforeEach(() => resetPracticeClock());

  it("meldet jede Uhr-Millisekunde genau einmal (Summe der Deltas = Uhr)", () => {
    notePracticeActivity(0);
    notePracticeActivity(2000);
    const d1 = takePracticeDelta(2000); // Zeile 1 endet beim Anschlag
    notePracticeActivity(4500); // 2,5 s Zwischen-Zeilen-Pause (< 5 s → zählt)
    notePracticeActivity(6000);
    const d2 = takePracticeDelta(6000);
    expect(d1).toBe(2000);
    expect(d2).toBe(4000); // 2,5 s Lücke + 1,5 s Tippen
    expect(d1 + d2).toBe(getPracticeMs(6000));
  });

  it("gibt nach einer langen Pause auch den Nachlauf der Vorzeile weiter", () => {
    notePracticeActivity(0);
    notePracticeActivity(1000);
    expect(takePracticeDelta(1000)).toBe(1000);
    // 120 s Pause → Uhr zählt noch bis 1000 + Toleranz, dann Stopp.
    const T = IDLE_CAP_MS;
    notePracticeActivity(121_000);
    notePracticeActivity(122_000);
    // Nachlauf (Toleranz) + neue Zeile (1 s) — Summe bleibt exakt der Uhrstand.
    expect(takePracticeDelta(122_000)).toBe(T + 1000);
    expect(getPracticeMs(122_000)).toBe(T + 2000);
  });

  it("meldet nach dem Mitternachts-Reset nur die neue Zeit", () => {
    const lateNight = new Date(2026, 0, 1, 23, 59, 50).getTime();
    notePracticeActivity(lateNight);
    expect(takePracticeDelta(lateNight + 2000)).toBe(2000);
    const nextDay = new Date(2026, 0, 2, 7, 0, 0).getTime();
    notePracticeActivity(nextDay);
    expect(takePracticeDelta(nextDay + 1000)).toBe(1000); // kein negativer/aufgestauter Wert
  });
});

describe("primePracticeClock — Uhr aus den heutigen Ereignissen aufsetzen", () => {
  beforeEach(() => resetPracticeClock());

  it("setzt die Uhr nach einem Neuladen auf die gespeicherte Übezeit", () => {
    primePracticeClock("kind-1", 600_000, 1000); // 10 min von heute gespeichert
    expect(getPracticeMs(1000)).toBe(600_000);
    // Die geprimte Zeit gilt als gemeldet — sie wandert NICHT nochmal in die Telemetrie.
    notePracticeActivity(1000);
    notePracticeActivity(3000);
    expect(takePracticeDelta(3000)).toBe(2000);
    expect(getPracticeMs(3000)).toBe(602_000);
  });

  it("senkt die laufende Uhr nie ab und zählt nichts doppelt", () => {
    const T = IDLE_CAP_MS;
    notePracticeActivity(0);
    notePracticeActivity(50_000); // Pause > Toleranz: T verbucht, neuer Abschnitt
    expect(takePracticeDelta(50_000)).toBe(T);
    primePracticeClock("kind-1", 3000, 50_000); // Speicherstand ist ÄLTER als die Uhr
    expect(getPracticeMs(50_000)).toBe(T); // unverändert
    notePracticeActivity(51_000);
    expect(takePracticeDelta(51_000)).toBe(1000); // nur der echte Zuwachs
  });

  it("setzt die Uhr bei Kontowechsel am selben Gerät zurück", () => {
    primePracticeClock("kind-1", 300_000, 1000);
    notePracticeActivity(1000);
    expect(getPracticeMs(1000)).toBe(300_000);
    primePracticeClock("kind-2", 60_000, 2000); // Geschwisterkind meldet sich an
    expect(getPracticeMs(2000)).toBe(60_000); // nur die eigene Übezeit
  });
});

describe("todayActiveMs — heute gespeicherte Übezeit aus den Ereignissen", () => {
  const day = (h: number, min = 0) => new Date(2026, 6, 8, h, min).getTime();
  const ev = (ts: number, activeMs: number, lesson = "adaptiv"): TaskEvent =>
    ({ ts, lesson, chars: 10, errors: 0, ms: activeMs, activeMs }) as TaskEvent;

  it("summiert nur heutige Übungs-Ereignisse (ohne Ziel-Änderungs-Marker)", () => {
    const yesterday = new Date(2026, 6, 7, 18).getTime();
    const events: TaskEvent[] = [
      ev(yesterday, 120_000),
      ev(day(8), 60_000),
      ev(day(9, 30), 30_000),
      { ...ev(day(10), 99_000), lesson: GOAL_CHANGE_LESSON },
    ];
    expect(todayActiveMs(events, day(11))).toBe(90_000);
  });

  it("nutzt ms als Rückfall für Alt-Ereignisse ohne activeMs", () => {
    const e = { ts: day(8), lesson: "adaptiv", chars: 5, errors: 0, ms: 45_000 } as TaskEvent;
    expect(todayActiveMs([e], day(9))).toBe(45_000);
  });
});
