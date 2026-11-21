/**
 * ★★★★★ WÄCHTER: Eine implausible `ms` zählt nicht als Tempo (Bauplan F1/F1b,
 * Messung 18.09.2026, MESSUNG-2026-09-18-EIGENSTAENDIGKEITS-CHECK.md §11/§12).
 *
 * Die Behebung in TypingSession.tsx (zeilenzeit.ts) gilt nur für NEUE Zeilen.
 * Für die gespeicherte Geschichte prüft `zeilenTempoPlausibel`, ob eine Zeile
 * für ein TEMPO überhaupt taugt:
 *
 *  - F1 (§11): zu schnell (< {@link MIN_KEYSTROKE_MS} je Zeichen, > 1.500
 *    Anschläge/Min) - gemessen bis 15.909 Anschläge/Min, fast ausschliesslich
 *    bei Kindern mit Hilfsmittel.
 *  - F1b (§12): zu langsam (> 30 s je Zeichen) - eine liegen gelassene Zeile,
 *    gemessen bis 29 Std. für 10 Zeichen.
 *
 * `avgCpm` wird ausserdem GEWICHTET (Zeichen gesamt ÷ Zeit gesamt, wie die
 * Tippchallenge) statt des ungewichteten Mittels der Zeilen-Tempi (§12: eine
 * einzige liegen gelassene Zeile kippte sonst das ganze Übungstempo).
 */
import { describe, expect, it } from "vitest";
import {
  bestesTempo,
  computePupilStats,
  suspicionScore,
  type TaskEvent,
} from "@/lib/typing/account";
import {
  MIN_KEYSTROKE_MS,
  TEMPO_MAX_MS_JE_ZEICHEN,
  zeilenTempoPlausibel,
} from "@/lib/typing/zeilenzeit";

/** Ein Ereignis: `chars` Zeichen in `ms` Millisekunden, ohne Fehler. */
function ereignis(chars: number, ms: number, over: Partial<TaskEvent> = {}): TaskEvent {
  return { ts: 1_000_000, lesson: "adaptiv", chars, errors: 0, ms, ...over };
}

describe("zeilenTempoPlausibel — Grenzen einer Zeile fürs TEMPO", () => {
  it("eine gewöhnliche Zeile ist plausibel", () => {
    expect(zeilenTempoPlausibel(ereignis(35, 8000))).toBe(true); // ≈ 262/min
  });

  it("★ F1: schneller als MIN_KEYSTROKE_MS je Zeichen ist NICHT plausibel", () => {
    // 35 Zeichen in 132 ms = 15.909 Anschläge/Min (Messung §11, wörtlich).
    expect(zeilenTempoPlausibel(ereignis(35, 132))).toBe(false);
    // Die Grenze selbst: genau MIN_KEYSTROKE_MS je Zeichen ist noch plausibel.
    expect(zeilenTempoPlausibel(ereignis(10, 10 * MIN_KEYSTROKE_MS))).toBe(true);
    expect(zeilenTempoPlausibel(ereignis(10, 10 * MIN_KEYSTROKE_MS - 1))).toBe(false);
  });

  it("★ F1b: langsamer als 30 s je Zeichen ist NICHT plausibel (liegen gelassen)", () => {
    // 10 Zeichen, 29 Std. (Messung §12, wörtlich).
    expect(zeilenTempoPlausibel(ereignis(10, 29 * 60 * 60 * 1000))).toBe(false);
    // Die Grenze selbst.
    expect(zeilenTempoPlausibel(ereignis(10, 10 * TEMPO_MAX_MS_JE_ZEICHEN))).toBe(true);
    expect(zeilenTempoPlausibel(ereignis(10, 10 * TEMPO_MAX_MS_JE_ZEICHEN + 1))).toBe(false);
  });

  it("ohne Zeichen oder ohne Zeit ist nichts plausibel", () => {
    expect(zeilenTempoPlausibel(ereignis(0, 1000))).toBe(false);
    expect(zeilenTempoPlausibel(ereignis(10, 0))).toBe(false);
  });
});

describe("computePupilStats — avgCpm jetzt GEWICHTET und ohne implausible Zeilen (§12)", () => {
  it("eine kurze, schnelle Zeile dominiert das Tempo nicht mehr", () => {
    // Eine lange Zeile bei normalem Tempo (300 Zeichen, 100 s = 180/min) und
    // eine kurze bei ungewöhnlich hohem, aber PLAUSIBLEM Tempo (10 Zeichen,
    // 400 ms = 1.500/min, gerade noch an der Grenze).
    const lang = ereignis(300, 100_000);
    const kurz = ereignis(10, 400);
    const s = computePupilStats([lang, kurz]);
    // Gewichtet: (300+10) Zeichen ÷ (100000+400) ms × 60000.
    const erwartet = ((300 + 10) / (100_000 + 400)) * 60_000;
    expect(s.avgCpm).toBeCloseTo(erwartet, 5);
    // Das ungewichtete Mittel läge deutlich höher (180 und 1500 gemittelt
    // wäre 840) - die Gewichtung zieht es zur langen Zeile hin.
    expect(s.avgCpm).toBeLessThan((180 + 1500) / 2);
  });

  it("★ F1b: eine 29-Std.-Zeile (liegen gelassen) zählt NICHT mehr fürs Tempo", () => {
    const normal = ereignis(300, 100_000); // 180/min
    const liegenGelassen = ereignis(10, 29 * 60 * 60 * 1000);
    const ohne = computePupilStats([normal]);
    const mit = computePupilStats([normal, liegenGelassen]);
    expect(mit.avgCpm).toBeCloseTo(ohne.avgCpm, 5);
  });

  it("★ F1: eine Zeile mit 15.909 Anschlägen/Min (§11) zählt NICHT mehr fürs Tempo", () => {
    const normal = ereignis(300, 100_000); // 180/min
    const kaputt = ereignis(35, 132); // 15.909/min, siehe §11
    const ohne = computePupilStats([normal]);
    const mit = computePupilStats([normal, kaputt]);
    expect(mit.avgCpm).toBeCloseTo(ohne.avgCpm, 5);
    // Aber die Zeichen/Fehler/Übe-Zeit zählen normal weiter (nur nicht das Tempo).
    expect(mit.chars).toBe(normal.chars + kaputt.chars);
  });

  it("nur implausible Zeilen ⇒ kein Tempo (keine erfundene Null aus Rechenrauschen)", () => {
    const s = computePupilStats([ereignis(10, 29 * 60 * 60 * 1000)]);
    expect(s.avgCpm).toBe(0);
  });
});

describe("bestesTempo — implausible Zeilen fliessen nicht ins schiebende Fenster ein", () => {
  it("eine einzelne kaputt gemessene Zeile verzerrt das Fenster nicht", () => {
    const normal: TaskEvent[] = Array.from({ length: 12 }, () => ereignis(30, 10_000)); // 180/min
    const erwartet = bestesTempo(normal);
    const mitKaputter = [...normal, ereignis(10, 29 * 60 * 60 * 1000)];
    // Die kaputte Zeile bildet ihr eigenes (implausibles) Fenster nicht mehr -
    // die zwölf guten Zeilen bleiben das beste Fenster.
    expect(bestesTempo(mitKaputter)).toBeCloseTo(erwartet, 5);
  });
});

describe("suspicionScore — der Schnell-Anteil zählt nur plausible Zeilen (§11)", () => {
  it("eine implausibel schnelle (kaputt gemessene) Zeile löst KEINEN Verdacht aus", () => {
    // 5 Zeilen, alle mit demselben kaputten Muster wie in §11 (35 Zeichen,
    // 132 ms) - fast ausschliesslich bei Hilfsmittel-Kindern gemessen. Ohne
    // die Plausibilitätsprüfung wäre das eine „sehr viele unplausibel
    // schnelle Übungen"-Meldung; mit ihr ist da kein Ereignis zu zählen.
    const events = Array.from({ length: 5 }, (_, i) =>
      ereignis(35, 132, { ts: 1_000_000 + i }),
    );
    const s = suspicionScore(events);
    expect(s.reasons.some((r) => r.includes("unplausibel schnelle"))).toBe(false);
  });

  it("echte, plausibel-schnelle Zeilen (700-1.500/min) lösen weiterhin Verdacht aus", () => {
    // 40 Zeichen in 2000 ms = 1.200/min: klar über 700, aber nicht schneller
    // als physisch möglich (Boden bei 1.500/min) - ein plausibler Fall, den
    // die Regel weiterhin fangen soll.
    const events = Array.from({ length: 5 }, (_, i) =>
      ereignis(40, 2000, { ts: 1_000_000 + i }),
    );
    const s = suspicionScore(events);
    expect(s.reasons.some((r) => r.includes("unplausibel schnelle"))).toBe(true);
  });
});

// ★ Abnahme 18.09.2026: dieselbe Regel auch in der Jahreskarte (`wochenwerte`) -
// dort drückte eine über Nacht offene Zeile die ganze Woche nach unten.
import { schuljahrVon, wochenwerte } from "@/lib/typing/jahreskarte";

describe("wochenwerte - Tempo nur aus plausiblen Zeilen, Treffsicherheit aus allen", () => {
  it("eine 29-Stunden-Zeile drückt das Wochentempo nicht, zählt aber für die Treffsicherheit", () => {
    const jetzt = Date.UTC(2026, 8, 16, 10, 0, 0);
    const sj = schuljahrVon(jetzt);
    const normal = { ts: jetzt, lesson: "adaptiv", chars: 40, errors: 0, ms: 12_000 }; // 200/min
    const liegenGelassen = { ts: jetzt + 1000, lesson: "adaptiv", chars: 10, errors: 10, ms: 29 * 3_600_000 };
    const [woche] = wochenwerte([normal, liegenGelassen] as TaskEvent[], sj);
    expect(Math.round(woche.cpm)).toBe(200);
    // Treffsicherheit aus ALLEN Zeilen: (50 - 10) / 50
    expect(woche.genauigkeit).toBeCloseTo(0.8, 5);
    expect(woche.zeilen).toBe(2);
  });
});
