/**
 * ★★★ E4 „Übungszeiten": eine Zeile je WOCHE (Montag 08:00 - Montag 08:00,
 * `WOCHENZIEL_GRENZE`), nicht mehr je Kalendertag und nicht mehr je
 * Unterrichtsperiode der Klasse - die gibt es seit demselben Umbau (Bauplan
 * §„W · Wochenziel neu") nicht mehr; JEDE Klasse zählt seither dieselbe Woche.
 *
 * Die Gruppierung selbst prüft dieser Wächter allein - `wochenStartFuerTag`
 * und `buildDayPractice` haben ihre eigenen Wächter (`tastenflow-eine-uebezeit.test.ts`,
 * `typing-wochenziel-neu.test.ts` u. a.); hier geht es nur darum, dass
 * {@link uebungsperioden} deren Ergebnis richtig zu WOCHEN zusammenfasst -
 * jüngste zuerst, nur Wochen mit Übung.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { GOAL_CHANGE_LESSON, type TaskEvent } from "@/lib/typing/account";
import { ACTIVE_TIME_SINCE_MS, buildSessions } from "@/lib/typing/goals";
import { LESSON_IDS } from "@/lib/typing/curriculum";
import {
  UEBUNGSZEIT_PAUSE_MIN,
  fmtWochentagDatum,
  uebungsartVon,
  uebungsperioden,
} from "@/lib/typing/uebungsperioden";

/** Ein Zeitpunkt in Ortszeit - Monat 1-basiert, damit man das Datum liest. */
function zeit(j: number, mon: number, tag: number, std = 12, min = 0): number {
  return new Date(j, mon - 1, tag, std, min, 0, 0).getTime();
}

/** Eine Übungszeile mit `minuten` reiner Tippzeit. */
function uebung(ts: number, minuten: number): TaskEvent {
  const ms = minuten * 60_000;
  return { ts, lesson: "l1", chars: 500, errors: 5, ms, activeMs: ms };
}

// 07.09.2026 ist ein Montag (dieselbe Woche wie in den anderen E4-/W3a-Tests).
describe("uebungsperioden - leer", () => {
  it("keine Ereignisse ⇒ keine Wochen", () => {
    expect(uebungsperioden([])).toEqual([]);
  });
});

describe("uebungsperioden - Wochengrenze Montag 08:00 (WOCHENZIEL_GRENZE)", () => {
  it("zwei Tage derselben Woche werden zu EINER Zeile", () => {
    const events = [
      uebung(zeit(2026, 9, 7, 15, 0), 20), // Montag nachmittags
      uebung(zeit(2026, 9, 9, 18, 0), 25), // Mittwoch, dieselbe Woche
    ];
    const p = uebungsperioden(events);
    expect(p).toHaveLength(1);
    expect(p[0].startMs).toBe(zeit(2026, 9, 7, 8, 0));
    expect(p[0].bisMs).toBe(zeit(2026, 9, 13, 8, 0)); // Sonntag danach
    expect(p[0].tage).toBe(2);
    expect(p[0].ms).toBe(45 * 60_000);
  });

  it("★★★ derselbe Kalendertag (Montag), VOR 08:00, gehört noch zur ALTEN Woche", () => {
    const events = [
      uebung(zeit(2026, 9, 7, 7, 30), 10), // vor 08:00 - die ENDENDE Woche
      uebung(zeit(2026, 9, 7, 9, 0), 10), // ab 08:00 - die NEUE Woche
    ];
    const p = uebungsperioden(events);
    expect(p).toHaveLength(2);
    // Jüngste zuerst.
    expect(p[0].startMs).toBe(zeit(2026, 9, 7, 8, 0));
    expect(p[0].ms).toBe(10 * 60_000);
    expect(p[1].startMs).toBe(zeit(2026, 8, 31, 8, 0)); // Montag der Vorwoche
    expect(p[1].ms).toBe(10 * 60_000);
  });

  it("newest first über mehrere Wochen hinweg, Lücken bleiben aus", () => {
    const events = [
      uebung(zeit(2026, 9, 7, 15, 0), 5), // Woche ab 07.09.
      uebung(zeit(2026, 8, 24, 15, 0), 7), // zwei Wochen zuvor (31.08. übersprungen)
    ];
    const p = uebungsperioden(events);
    expect(p.map((x) => x.startMs)).toEqual([
      zeit(2026, 9, 7, 8, 0),
      zeit(2026, 8, 24, 8, 0),
    ]);
  });

  it("eine Woche über den Monatswechsel hinweg", () => {
    // Woche Mo 28.09. 08:00 - Mo 05.10. 08:00 reicht über den Monatswechsel;
    // Übung am letzten UND am ersten Tag dieser Woche bleibt EINE Zeile,
    // Übung nach der nächsten Grenze (05.10., ab 08:00) ist schon die neue Woche.
    const events = [
      uebung(zeit(2026, 9, 30, 20, 0), 12), // Mittwoch in der Woche ab 28.09.
      uebung(zeit(2026, 10, 4, 10, 0), 8), // Sonntag, noch dieselbe Woche
      uebung(zeit(2026, 10, 5, 15, 0), 6), // Montag NACH 08:00 - neue Woche
    ];
    const p = uebungsperioden(events);
    expect(p).toHaveLength(2);
    expect(p[0].startMs).toBe(zeit(2026, 10, 5, 8, 0));
    expect(p[0].ms).toBe(6 * 60_000);
    expect(p[1].startMs).toBe(zeit(2026, 9, 28, 8, 0));
    expect(p[1].tage).toBe(2);
    expect(p[1].ms).toBe(20 * 60_000);
  });
});

/**
 * ⚠️⚠️ DAS ENDE MUSS KALENDER-TAGE ZÄHLEN, NICHT MILLISEKUNDEN - dieselbe
 * Falle wie in `wochenziel.ts` ({@link import("../src/lib/typing/wochenziel").WOCHENZIEL_GRENZE}s
 * Kopf-Kommentar). `startMs + 6 * 86_400_000` träfe in der Umstellungswoche
 * NICHT mehr 08:00, sondern 09:00 (Frühjahr, eine Stunde fehlt) oder 07:00
 * (Herbst, eine Stunde ist zu viel) - beide Male derselbe Kalendertag, aber
 * ein anderer Zeitpunkt, den nur ein direkter `bisMs`-Vergleich aufdeckt
 * (dasselbe Datum, siehe {@link fmtWochentagDatum}, verschleiert den Fehler).
 * Die Daten sind dieselben wie in `typing-wochenziel-neu.test.ts`
 * (echte EU-Umstellungstermine).
 */
describe("uebungsperioden - Wochengrenze über die Sommer-/Winterzeit-Umstellung (DST)", () => {
  it("Frühjahr 2027 (Umstellung Nacht Sa/So 27./28.03.): bisMs bleibt Sonntag 08:00", () => {
    // Woche Mo 22.03.2027 08:00 - Mo 29.03.2027 08:00, Übung vor UND nach der
    // Umstellung in derselben Woche.
    const events = [
      uebung(zeit(2027, 3, 27, 20, 0), 10), // Samstag, vor der Umstellung
      uebung(zeit(2027, 3, 28, 10, 0), 10), // Sonntag, nach der Umstellung
    ];
    const p = uebungsperioden(events);
    expect(p).toHaveLength(1);
    expect(p[0].startMs).toBe(zeit(2027, 3, 22, 8, 0));
    expect(p[0].bisMs).toBe(zeit(2027, 3, 28, 8, 0));
    expect(p[0].tage).toBe(2);
    expect(p[0].ms).toBe(20 * 60_000);
  });

  it("Herbst 2026 (Umstellung Nacht Sa/So 24./25.10.): bisMs bleibt Sonntag 08:00", () => {
    // Woche Mo 19.10.2026 08:00 - Mo 26.10.2026 08:00.
    const events = [
      uebung(zeit(2026, 10, 24, 20, 0), 10), // Samstag, vor der Umstellung
      uebung(zeit(2026, 10, 25, 10, 0), 10), // Sonntag, nach der Umstellung
    ];
    const p = uebungsperioden(events);
    expect(p).toHaveLength(1);
    expect(p[0].startMs).toBe(zeit(2026, 10, 19, 8, 0));
    expect(p[0].bisMs).toBe(zeit(2026, 10, 25, 8, 0));
    expect(p[0].tage).toBe(2);
    expect(p[0].ms).toBe(20 * 60_000);
  });
});

describe("fmtWochentagDatum", () => {
  it('liefert „Do 03.09." - Wochentag kurz ohne Punkt, dann Tag.Monat.', () => {
    expect(fmtWochentagDatum(zeit(2026, 9, 3, 15, 0))).toBe("Do 03.09.");
  });
});

/**
 * ★★★ M3 (19.09.2026): JE WOCHE DIE EINZELNEN ÜBUNGSZEITEN - Johannes: *„eine
 * Unterliste mit allen Übungszeiten genau erfasst"*.
 *
 * Zwei Zusagen, beide hier gegen echte Rechnungen geprüft statt gegen
 * abgeschriebene Zahlen:
 *  1. Die Übungszeiten einer Woche ergeben ZUSAMMEN genau die Zeit der Woche -
 *     auch über die Wochengrenze Montag 08:00, über Mitternacht, vor dem
 *     Stichtag der Tippzeit und mit alten Ziel-Markern dazwischen.
 *  2. Es gibt KEINE zweite Sitzungs-Regel: Wo keine Wochengrenze schneidet,
 *     sind es genau die Sitzungen, die `buildSessions` („Einzelne Übezeiten"
 *     in „Meine Statistik") liefert.
 */
function zeile(ts: number, minuten: number, aktivMin: number, lesson = "adaptiv"): TaskEvent {
  return { ts, lesson, chars: 300, errors: 3, ms: minuten * 60_000, activeMs: aktivMin * 60_000 };
}

/** Ein bunter Verlauf über alles, was schiefgehen könnte. */
function allesZusammen(): TaskEvent[] {
  return [
    // Vor dem Stichtag (07.07.2026): alte Wanduhr-Spanne, zwei Zeilen.
    zeile(zeit(2026, 6, 30, 10, 0), 5, 2),
    zeile(zeit(2026, 6, 30, 10, 12), 6, 3),
    // Zwei Übungszeiten an einem Tag (Pause > 30 Min. dazwischen).
    zeile(zeit(2026, 9, 8, 10, 10), 8, 7),
    zeile(zeit(2026, 9, 8, 10, 20), 10, 9, "form:lueckentext"),
    zeile(zeit(2026, 9, 8, 14, 5), 5, 5, "serie:igel"),
    // Ein alter Ziel-Marker mitten drin - zählt nirgends.
    { ts: zeit(2026, 9, 8, 14, 6), lesson: GOAL_CHANGE_LESSON, chars: 0, errors: 0, ms: 0, minutesGoal: 30 },
    // Über Mitternacht (Sa/So) - bleibt EINE Übungszeit, dieselbe Woche.
    zeile(zeit(2026, 9, 12, 23, 55), 5, 4),
    zeile(zeit(2026, 9, 13, 0, 10), 10, 8, "klassenmatch"),
    // Über die Wochengrenze Mo 14.09. 08:00 - wird geteilt.
    zeile(zeit(2026, 9, 14, 7, 55), 5, 5),
    zeile(zeit(2026, 9, 14, 8, 10), 10, 9, "eigene-uebung"),
    // Eine Tippchallenge.
    zeile(zeit(2026, 9, 16, 9, 5), 5, 5, "schreibprobe"),
  ];
}

describe("M3 · die Übungszeiten einer Woche ergeben zusammen die Woche", () => {
  it("★★★ jede Woche: Summe der Übungszeiten === Zeit der Woche, auf die Millisekunde", () => {
    const p = uebungsperioden(allesZusammen());
    // Ende Juni (vor dem Stichtag), ab 07.09., ab 14.09.
    expect(p).toHaveLength(3);
    for (const w of p) {
      expect(w.sitzungen.length).toBeGreaterThan(0);
      expect(w.sitzungen.reduce((summe, s) => summe + s.ms, 0)).toBe(w.ms);
    }
  });

  it("über die Wochengrenze Montag 08:00: der Teil davor in der alten, der danach in der neuen Woche", () => {
    const p = uebungsperioden(allesZusammen());
    const neu = p.find((w) => w.startMs === zeit(2026, 9, 14, 8, 0))!;
    const alt = p.find((w) => w.startMs === zeit(2026, 9, 7, 8, 0))!;
    // Neue Woche, jüngste zuerst: Mi-Tippchallenge, dann der Teil ab 08:00.
    expect(neu.sitzungen.map((s) => [s.startMs, s.endMs, s.ms, s.arten])).toEqual([
      [zeit(2026, 9, 16, 9, 0), zeit(2026, 9, 16, 9, 5), 5 * 60_000, ["tippchallenge"]],
      [zeit(2026, 9, 14, 8, 0), zeit(2026, 9, 14, 8, 10), 9 * 60_000, ["eigene-uebung"]],
    ]);
    // Alte Woche: jüngste zuerst - der Teil bis 07:55, die über Mitternacht,
    // dann die zwei vom Dienstag.
    expect(alt.sitzungen.map((s) => [s.startMs, s.endMs, s.ms, s.arten])).toEqual([
      [zeit(2026, 9, 14, 7, 50), zeit(2026, 9, 14, 7, 55), 5 * 60_000, ["training"]],
      [zeit(2026, 9, 12, 23, 50), zeit(2026, 9, 13, 0, 10), 12 * 60_000, ["training", "klassenmatch"]],
      [zeit(2026, 9, 8, 14, 0), zeit(2026, 9, 8, 14, 5), 5 * 60_000, ["geschichte"]],
      [zeit(2026, 9, 8, 10, 2), zeit(2026, 9, 8, 10, 20), 16 * 60_000, ["training", "wortspiel"]],
    ]);
  });

  it("vor dem Stichtag: die alte Wanduhr-Spanne, ganz in der Woche ihres Beginns", () => {
    expect(zeit(2026, 6, 30, 9, 55)).toBeLessThan(ACTIVE_TIME_SINCE_MS);
    const p = uebungsperioden(allesZusammen());
    const juni = p.find((w) => w.startMs === zeit(2026, 6, 29, 8, 0))!;
    // 09:55 bis 10:12 = 17 Min. Uhr - nicht die 5 Min. Tippzeit.
    expect(juni.sitzungen.map((s) => [s.startMs, s.endMs, s.ms])).toEqual([
      [zeit(2026, 6, 30, 9, 55), zeit(2026, 6, 30, 10, 12), 17 * 60_000],
    ]);
    expect(juni.ms).toBe(17 * 60_000);
  });

  it("★★★ KEINE zweite Sitzungs-Regel: ohne Wochengrenze dazwischen genau die Sitzungen von `buildSessions`", () => {
    // Alles ausser dem Teil, der über Montag 08:00 läuft (den teilt NUR die
    // Wochenansicht, `buildSessions` kennt keine Woche).
    const events = allesZusammen().filter((e) => e.ts < zeit(2026, 9, 14, 7, 0));
    const jeWoche = uebungsperioden(events)
      .flatMap((w) => w.sitzungen)
      .map((s) => [s.startMs, s.endMs, s.ms])
      .sort((a, b) => a[0] - b[0]);
    const statistik = buildSessions(events).map((s) => [
      s.startMs,
      s.endMs,
      Math.round(s.minutes * 60_000),
    ]);
    expect(jeWoche).toEqual(statistik);
  });

  it("die Grenze steht an EINER Stelle: 30 Minuten ohne Abgabe", () => {
    expect(UEBUNGSZEIT_PAUSE_MIN).toBe(30);
    // 30 Min. Abstand: noch dieselbe Übungszeit; 31 Min.: eine neue.
    const gleich = uebungsperioden([zeile(zeit(2026, 9, 8, 10, 0), 1, 1), zeile(zeit(2026, 9, 8, 10, 30), 1, 1)]);
    expect(gleich[0].sitzungen).toHaveLength(1);
    const getrennt = uebungsperioden([zeile(zeit(2026, 9, 8, 10, 0), 1, 1), zeile(zeit(2026, 9, 8, 10, 31), 1, 1)]);
    expect(getrennt[0].sitzungen).toHaveLength(2);
  });
});

describe("M3 · was geübt wurde (uebungsartVon)", () => {
  it("jede bekannte Kennung bekommt ihre Art, eine unbekannte KEINE", () => {
    expect(uebungsartVon("adaptiv")).toBe("training");
    expect(uebungsartVon(LESSON_IDS[0])).toBe("lektion");
    expect(uebungsartVon("serie:igel")).toBe("geschichte");
    expect(uebungsartVon("form:lueckentext")).toBe("wortspiel");
    expect(uebungsartVon("schreibprobe")).toBe("tippchallenge");
    expect(uebungsartVon("klassenmatch")).toBe("klassenmatch");
    expect(uebungsartVon("eigene-uebung")).toBe("eigene-uebung");
    expect(uebungsartVon("l1")).toBeNull();
    expect(uebungsartVon("")).toBeNull();
  });

  /**
   * ★★ Der Wächter über die QUELLTEXTE: Jede Kennung, die ein Bildschirm als
   * `contextId` an `TypingSession` gibt (und die damit als `lesson` in den
   * Ereignissen landet), muss eine Übungsart finden. Kommt ein neuer
   * Bildschirm dazu, wird dieser Test rot, statt dass die Lehrkraft still
   * eine Übungszeit ohne Art sieht.
   */
  it("★★ jede Kennung, die ein Bildschirm setzt, findet eine Art (an den Quelltexten gelesen)", () => {
    const wurzel = resolve(__dirname, "../src");
    const dateien: string[] = [];
    const lauf = (ordner: string) => {
      for (const e of readdirSync(ordner, { withFileTypes: true })) {
        const pfad = join(ordner, e.name);
        if (e.isDirectory()) lauf(pfad);
        else if (/\.tsx?$/.test(e.name)) dateien.push(pfad);
      }
    };
    lauf(wurzel);
    /** Die Ausdrücke hinter `contextId={…}` - mit Klammerzählung, weil
     *  `form:${lauf.form.id}` selbst geschweifte Klammern trägt. */
    const ausdruecke = (text: string): string[] => {
      const out: string[] = [];
      for (let i = text.indexOf("contextId={"); i >= 0; i = text.indexOf("contextId={", i + 1)) {
        let tiefe = 0;
        let j = i + "contextId=".length;
        for (; j < text.length; j++) {
          if (text[j] === "{") tiefe++;
          else if (text[j] === "}" && --tiefe === 0) break;
        }
        out.push(text.slice(i + "contextId={".length, j));
      }
      for (const m of text.matchAll(/contextId="([^"]+)"/g)) out.push(`"${m[1]}"`);
      return out;
    };
    const kennungen = new Set<string>();
    for (const datei of dateien) {
      const text = readFileSync(datei, "utf8");
      const konstante = text.match(/const KONTEXT_ID = "([^"]+)"/)?.[1];
      for (const ausdruck of ausdruecke(text)) {
        if (/\bKONTEXT_ID\b/.test(ausdruck) && konstante) kennungen.add(konstante);
        for (const s of ausdruck.matchAll(/"([^"]+)"/g)) kennungen.add(s[1]);
        // `form:${…}` ⇒ „form:x" als Beispiel.
        for (const s of ausdruck.matchAll(/`([^`$]*)\$\{/g)) kennungen.add(`${s[1]}x`);
      }
    }
    // Nicht leer gelesen: die sechs heutigen Bildschirme sind alle da.
    for (const k of ["adaptiv", "form:x", "serie:x", "schreibprobe", "klassenmatch", "eigene-uebung"])
      expect(kennungen.has(k), k).toBe(true);
    for (const k of kennungen) expect(uebungsartVon(k), k).not.toBeNull();
  });
});
