/**
 * Reine Arithmetik der Zeilenzeit - ausgelagert aus `TypingSession.tsx`, damit
 * sie ohne React/DOM testbar ist. Wird dort je Anschlag aufgerufen, um die
 * Zeilenzeit (`ms`) aus der Summe der einzelnen Anschlags-Lücken zu bilden,
 * statt sie am Ende als Differenz „Wanduhr minus Wartezeit" zu raten.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ ZWEI MESSFEHLER, EINE URSACHE (Bauplan F1/F1b, Messung 18.09.2026,
 * MESSUNG-2026-09-18-EIGENSTAENDIGKEITS-CHECK.md §11/§12)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * `ms` einer Zeile war `rawMs - waitMs`, beides OHNE Grenzen:
 *
 * - **F1 (§11):** Bei Kindern mit Hilfsmittel (Zoom+VoiceOver, NVDA) schrumpfte
 *   die abgezogene Vorlese-Wartezeit einzelne Zeilen fast auf null - gemessen
 *   35 Zeichen in 132 ms = 15.909 Anschläge/Min. Physisch unmöglich.
 * - **F1b (§12):** In die andere Richtung gab es KEINE Obergrenze - eine über
 *   Nacht offen gelassene Zeile zählte bis zu 29 Std. (3 Zeilen, 2 Kinder).
 *
 * Johannes: „Messfehler sind Gift!" Die Behebung sitzt an der Wurzel, nicht an
 * den Symptomen: Jede einzelne Anschlags-Lücke bekommt zwei Leitplanken, BEVOR
 * sie aufsummiert wird.
 *
 *  (a) **Obergrenze** = dieselbe Pausentoleranz, die die Übezeit-Uhr für DIESES
 *      Kind verwendet (`practiceIdleCap()`, `practiceClock.ts` - fest
 *      `IDLE_CAP_MS`/`IDLE_CAP_SLOW_MS` oder das persönliche, aus den eigenen
 *      Pausen gerechnete Mass). Keine neue Regel, dieselbe Zahl wie die Uhr.
 *  (b) **Untergrenze** = {@link MIN_KEYSTROKE_MS}: Das Abziehen der
 *      Vorlese-Wartezeit darf eine Lücke nie darunter drücken.
 */

/**
 * Schneller als das ist physisch kein Anschlag mehr (≤ 1.500 Anschläge/Min).
 * Das Abziehen der Vorlese-Wartezeit darf eine Anschlags-Lücke nie darunter
 * drücken (Bauplan F1) - sonst kann die abgezogene Wartezeit allein durch
 * Messungenauigkeit eine Zeile auf ein unmögliches Tempo hochrechnen.
 */
export const MIN_KEYSTROKE_MS = 40;

/**
 * Was aus EINER Anschlags-Lücke wird: der Teil, der als Schreibzeit zählt, und
 * der Teil, in dem das Kind der App zugehört hat.
 */
export interface ZeilenLuecke {
  /** Zählt als Schreibzeit der Zeile (Tippen UND Überlegen, gekappt). */
  zeileMs: number;
  /**
   * Zuhören: die Zeit, in der die Stimme sprach und NICHT getippt wurde -
   * UNGEKAPPT. Genau diese Zahl zieht die Uhr von Klassenmatch und
   * Tippchallenge ab (`onZeilenWartezeit`, Bauplan F1c).
   */
  zuhoerMs: number;
}

/**
 * ★★★★★ EINE LÜCKE, ZWEI TEILE (Bauplan F1c, 18.09.2026 - Johannes:
 * *„zähle nur richtige Zeichen, und ‚Überlegen' wird bestraft, Zuhören
 * natürlich nicht, mach es überall gleich"*).
 *
 * - **Zuhören** = die Sprechzeit in der Lücke, höchstens die Lücke selbst.
 *   Wird ausser bei parallelem Tippen (`speakingNow`: Text gesehen, während der
 *   Ansage getippt - siehe `typingGapMs`) ganz abgezogen, OHNE Deckel: Eine
 *   lange Zeilenansage ist kein Wegbleiben.
 * - **Überlegen** = der Rest. Er zählt als Schreibzeit, gekappt auf
 *   `idleCapMs` (dieselbe Pausentoleranz, die die Übezeit-Uhr für dieses Kind
 *   verwendet - wer länger weg ist, war nicht am Überlegen).
 *
 * ⚠️ Reihenfolge seit F1c: ERST das Zuhören abziehen, DANN das Überlegen
 * kappen. Vorher (F1) wurde zuerst die ganze Lücke gekappt und davon die
 * Sprechzeit abgezogen - bei einer Zeilenansage, die länger dauert als die
 * Pausentoleranz, blieb vom Überlegen danach 40 ms übrig, und für die Uhr von
 * Match und Challenge fehlte ein Teil des Zuhörens.
 *
 * Boden: Hat das Abziehen etwas weggenommen, bleibt von der Lücke mindestens
 * {@link MIN_KEYSTROKE_MS} (Bauplan F1 - sonst rechnet Messungenauigkeit eine
 * Zeile auf ein unmögliches Tempo hoch). Der Boden greift nie über das hinaus,
 * was an roher Zeit überhaupt da war, und nie ohne Abzug - eine wirklich
 * kurze, ungebremste Lücke wird nicht künstlich verlängert.
 *
 * Es gilt immer `zeileMs + zuhoerMs <= rawDeltaMs`: Was übrig bleibt, ist
 * Wegbleiben über der Toleranz - das zählt in der Übung nicht, auf der Uhr von
 * Match und Challenge aber voll (dort ist die Zeit fest).
 *
 * Reine Funktion, ohne Timer/DOM testbar.
 */
export function zeilenLuecke(
  rawDeltaMs: number,
  spokenInGapMs: number,
  speakingNow: boolean,
  idleCapMs: number,
): ZeilenLuecke {
  const roh = Math.max(0, rawDeltaMs);
  const deckel = Math.max(0, idleCapMs);
  if (speakingNow) return { zeileMs: Math.min(roh, deckel), zuhoerMs: 0 }; // parallel getippt
  const zuhoeren = Math.min(roh, Math.max(0, spokenInGapMs));
  const ueberlegen = roh - zuhoeren;
  const boden = zuhoeren > 0 ? Math.min(MIN_KEYSTROKE_MS, roh) : 0;
  const zeileMs = Math.min(Math.max(ueberlegen, boden), deckel);
  // Der Boden gibt der Zeile ein paar ms, die sonst Zuhören wären - dann eben
  // dort weniger, damit beide zusammen nie mehr sind als die Lücke.
  return { zeileMs, zuhoerMs: Math.max(0, roh - Math.max(ueberlegen, boden)) };
}

/**
 * Die faire Länge EINER Anschlags-Lücke für die Zeilenzeit - der
 * Schreibzeit-Teil von {@link zeilenLuecke}.
 */
export function zeilenGapMs(
  rawDeltaMs: number,
  spokenInGapMs: number,
  speakingNow: boolean,
  idleCapMs: number,
): number {
  return zeilenLuecke(rawDeltaMs, spokenInGapMs, speakingNow, idleCapMs).zeileMs;
}

/**
 * ★★★★★ Ist das Tempo dieser Zeile plausibel? (Bauplan F1/F1b, 18.09.2026)
 *
 * Zu schnell: unter {@link MIN_KEYSTROKE_MS} je Zeichen (> 1.500
 * Anschläge/Min, gemessen bis 15.909). Zu langsam: über
 * {@link TEMPO_MAX_MS_JE_ZEICHEN} je Zeichen - eine liegen gelassene Zeile,
 * keine Tippzeit (gemessen bis 29 Std. für 10 Zeichen). Beides zählt nicht
 * fürs TEMPO, wohl aber für die Übe-Zeit. Ausführlich: `account.ts`.
 */
export const TEMPO_MAX_MS_JE_ZEICHEN = 30_000;

export function zeilenTempoPlausibel(e: { chars: number; ms: number }): boolean {
  if (e.chars <= 0 || e.ms <= 0) return false;
  return e.ms >= e.chars * MIN_KEYSTROKE_MS && e.ms <= e.chars * TEMPO_MAX_MS_JE_ZEICHEN;
}
