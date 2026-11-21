/**
 * ★★★★★ WÄCHTER: Zeilenzeit mit Deckel und Boden (Bauplan F1/F1b, Messung
 * 18.09.2026, MESSUNG-2026-09-18-EIGENSTAENDIGKEITS-CHECK.md §11/§12).
 *
 * `TypingSession.tsx` rechnete die Zeilenzeit bis dahin als „Wanduhr minus
 * abgezogene Vorlese-Wartezeit", beides ohne Grenzen:
 *
 *  - F1 (§11): Bei Kindern mit Hilfsmittel schrumpfte die abgezogene
 *    Wartezeit einzelne Zeilen fast auf null - gemessen bis 15.909
 *    Anschläge/Min (35 Zeichen in 132 ms).
 *  - F1b (§12): eine über Nacht offen gelassene Zeile zählte bis zu 29 Std.
 *
 * `zeilenGapMs` ist die reine Arithmetik EINER Anschlags-Lücke, die beides
 * behebt: Deckel = dieselbe Pausentoleranz wie die Übezeit-Uhr
 * (`practiceIdleCap`), Boden = {@link MIN_KEYSTROKE_MS}.
 */
import { describe, expect, it } from "vitest";
import { MIN_KEYSTROKE_MS, zeilenGapMs } from "@/lib/typing/zeilenzeit";
import { IDLE_CAP_MS, IDLE_CAP_SLOW_MS } from "@/lib/typing/practiceClock";

describe("zeilenGapMs — eine Anschlags-Lücke, fair gedeckelt und geboden", () => {
  it("normale Lücke ohne Vorlesen: zählt unverändert", () => {
    // 2 s zwischen zwei Anschlägen, nichts wurde vorgelesen.
    expect(zeilenGapMs(2000, 0, false, IDLE_CAP_MS)).toBe(2000);
  });

  it("Lücke mit Vorlese-Wartezeit: die Wartezeit wird abgezogen", () => {
    // 8 s Lücke, davon 6 s vorgelesen → 2 s echte Tippzeit.
    expect(zeilenGapMs(8000, 6000, false, IDLE_CAP_MS)).toBe(2000);
  });

  it("parallel getippt (Text gesehen): NICHTS wird abgezogen, auch wenn Vorlesen lief", () => {
    // Fairness-Regel aus voice.ts/typingGapMs: `speakingNow` gewinnt.
    expect(zeilenGapMs(1000, 900, true, IDLE_CAP_MS)).toBe(1000);
  });

  it("★ F1: Wartezeit, die die ganze Lücke aufzehren würde ⇒ Boden bei MIN_KEYSTROKE_MS", () => {
    // 1 s Lücke, aber 1 s „vorgelesen" (Messungenauigkeit) → ohne Boden: 0 ms,
    // damit bei wenigen Zeichen ein unmögliches Tempo (siehe §11, 15.909/min).
    expect(zeilenGapMs(1000, 1000, false, IDLE_CAP_MS)).toBe(MIN_KEYSTROKE_MS);
  });

  it("überzogene Wartezeit (mehr als die Lücke selbst) landet ebenfalls beim Boden", () => {
    expect(zeilenGapMs(500, 5000, false, IDLE_CAP_MS)).toBe(MIN_KEYSTROKE_MS);
  });

  it("der Boden hebt eine wirklich kurze, ungebremste Lücke NICHT künstlich an", () => {
    // 10 ms Lücke, kein Vorlesen - echtes schnelles Tippen, kein Warten.
    // Der Boden darf hier NICHT auf 40 ms hochziehen: das wäre kein Abzug,
    // den er begrenzt, sondern eine erfundene Verlangsamung.
    expect(zeilenGapMs(10, 0, false, IDLE_CAP_MS)).toBe(10);
  });

  it("★ F1b: eine über Nacht offen gelassene Zeile wird auf die Pausentoleranz gekappt", () => {
    const ueberNacht = 29 * 60 * 60 * 1000; // 29 Std., wie in §12 gemessen
    expect(zeilenGapMs(ueberNacht, 0, false, IDLE_CAP_MS)).toBe(IDLE_CAP_MS);
  });

  it("die Kappung gilt auch, wenn parallel getippt worden wäre", () => {
    const ueberNacht = 5 * 60 * 60 * 1000;
    expect(zeilenGapMs(ueberNacht, 0, true, IDLE_CAP_MS)).toBe(IDLE_CAP_MS);
  });

  it("★ Zeit lassen - derselbe Vorgang, aber mit der grösseren Toleranz des Kindes", () => {
    const langePause = 45_000; // über IDLE_CAP_MS, aber unter IDLE_CAP_SLOW_MS
    expect(zeilenGapMs(langePause, 0, false, IDLE_CAP_MS)).toBe(IDLE_CAP_MS);
    expect(zeilenGapMs(langePause, 0, false, IDLE_CAP_SLOW_MS)).toBe(langePause);
  });

  it("★ F1c: erst das Zuhören abziehen, DANN das Überlegen kappen", () => {
    // Seit F1c misst die erste Lücke einer Zeile ab ihrem Erscheinen - mit der
    // ganzen Zeilenansage darin. 12 s Lücke, davon 10 s Ansage, 2 s überlegt,
    // Toleranz 8 s: F1 kappte zuerst auf 8 s und zog dann 10 s ab ⇒ Boden
    // (40 ms), das Überlegen war weg. Jetzt zählen die 2 s.
    expect(zeilenGapMs(12_000, 10_000, false, 8_000)).toBe(2_000);
    // Überlegen allein über der Toleranz bleibt gekappt (F1b).
    expect(zeilenGapMs(40_000, 3_000, false, IDLE_CAP_MS)).toBe(IDLE_CAP_MS);
  });

  it("nie negativ, auch bei negativer Wartezeit-Eingabe", () => {
    expect(zeilenGapMs(1000, -500, false, IDLE_CAP_MS)).toBeGreaterThanOrEqual(0);
  });
});
