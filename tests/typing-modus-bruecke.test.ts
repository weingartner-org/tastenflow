import { describe, it, expect } from "vitest";
import {
  LESSONS,
  LESSON_IDS,
  SHIFT_UNIT,
  emptyProgress,
  introducedThroughLesson,
  lessonOpen,
  unlockedKeysAt,
  type LetterStat,
  type TypingProgress,
} from "../src/lib/typing";

// „Mein Training" und „Lektionen" teilen sich einen Spielstand; der Lernstand
// soll zwischen beiden Modi mitwandern (Wunsch von Johannes).

/** Eine Taste, die sicher „sitzt" (genug saubere Anschläge im Fenster). */
function masteredStat(): LetterStat {
  return { hits: 20, misses: 0, sumMs: 6000, timed: 20, recent: new Array(20).fill(300) };
}

/** Spielstand, in dem alle bis zur Lektion `id` nötigen Tasten sitzen. */
function masteredThrough(id: string): TypingProgress {
  const letters: Record<string, LetterStat> = {};
  for (const k of unlockedKeysAt(id)) letters[k] = masteredStat();
  letters[SHIFT_UNIT] = masteredStat();
  return { ...emptyProgress(), letters };
}

describe("Niveau-Übernahme Mein Training ↔ Lektionen", () => {
  it("frischer Spielstand: nur die erste Lektion ist offen", () => {
    const p = emptyProgress();
    expect(lessonOpen(p, LESSON_IDS[0])).toBe(true);
    expect(lessonOpen(p, LESSON_IDS[1])).toBe(false);
    expect(lessonOpen(p, "zahlen")).toBe(false);
  });

  it("das Start-Geschenk (nur F und J, ohne Übung) sperrt noch keine Lektion auf", () => {
    // Ein frischer Stand trägt `INITIAL_LETTERS` Einheiten, ohne dass je eine
    // Taste gedrückt wurde. Sonst landete ein blutiger Anfänger sofort in
    // Lektion 2.
    const p: TypingProgress = {
      ...emptyProgress(),
      introduced: ["f", "j"],
    };
    expect(lessonOpen(p, "home-dk")).toBe(false);
    expect(lessonOpen(p, "home-gh")).toBe(false);
  });

  it("ein Stand ÜBER dem Geschenk öffnet die Lektionen bis dorthin (Startpunkt-Kind)", () => {
    // Befund 07.08.2026: Ein Kind, das die Lehrkraft (oder das Zahnrad) mit
    // einem Startpunkt anlegt, hat `introduced`, aber noch KEINE Anschlag-
    // Statistik — vorher war deshalb alles außer Lektion 1 zu, das Kind wurde
    // zur Grundreihe zurückgeschickt. `introduced` über dem Start-Geschenk ist
    // eine echte Aussage (verdient oder bewusst gesetzt) und zählt jetzt.
    const grundreihe: TypingProgress = {
      ...emptyProgress(),
      introduced: ["f", "j", "d", "k", "s", "l", "a", "ö"],
    };
    // Die Grundreihe sitzt laut Startpunkt → offen bis zur Lektion, die die
    // NÄCHSTEN Tasten (G und H) lehrt; dahinter bleibt zu.
    expect(lessonOpen(grundreihe, "home-dk")).toBe(true);
    expect(lessonOpen(grundreihe, "home-gh")).toBe(true);
    expect(lessonOpen(grundreihe, "shift-gross")).toBe(false);
  });

  it("wer adaptiv bis zu den Zahlen kam, hat die Zahlen-Lektion offen", () => {
    const prev = LESSON_IDS[LESSON_IDS.indexOf("zahlen") - 1];
    const p = masteredThrough(prev);
    expect(lessonOpen(p, "zahlen")).toBe(true);
    expect(lessonOpen(p, "ober-ei")).toBe(true); // frühere erst recht
  });

  it("treffsicher gelernt, aber zuletzt langsam/selten geübt → Lektion trotzdem offen", () => {
    // Genau Johannes' Fall: in „Mein Training" alle Buchstaben frei, das aktuelle
    // Tempo steht hoch, alte Tasten kamen zuletzt selten dran. Die Brücke darf
    // NICHT am Tempo oder am gleitenden Fenster scheitern (lebenszeit-basiert).
    const slowButSolid = (): LetterStat => ({
      hits: 40,
      misses: 3, // ~93 % über die Lebenszeit
      sumMs: 48000,
      timed: 40, // ~1200 ms/Anschlag = für eine hohe Leistungsstufe „zu langsam"
      recent: [1300, 1250, -1, 1400], // nur wenige, langsame Anschläge im Fenster
    });
    const letters: Record<string, LetterStat> = {};
    for (const k of unlockedKeysAt("unter-nb")) letters[k] = slowButSolid();
    letters[SHIFT_UNIT] = slowButSolid();
    const p: TypingProgress = { ...emptyProgress(), letters, level: 30 };
    // „unter-nb" liegt nach allen Grundbuchstaben — die Folge-Lektion muss offen sein.
    const after = LESSON_IDS[LESSON_IDS.indexOf("unter-nb") + 1];
    expect(lessonOpen(p, after)).toBe(true);
    expect(lessonOpen(p, "home-gh")).toBe(true);
  });

  it("introducedThroughLesson schiebt die adaptive Freischaltung nach", () => {
    const grown = introducedThroughLesson(undefined, "zahlen", "de");
    for (const k of unlockedKeysAt("zahlen")) expect(grown).toContain(k);
    expect(grown).toContain(SHIFT_UNIT);
    expect(grown).toContain("5"); // eine Ziffer ist dabei
  });

  it("Freischaltung ist ein Präfix (keine Lücken in der Reihenfolge)", () => {
    const p = masteredThrough("satzzeichen");
    const flags = LESSONS.map((l) => lessonOpen(p, l.id));
    const firstClosed = flags.indexOf(false);
    if (firstClosed >= 0)
      for (let i = firstClosed; i < flags.length; i++)
        expect(flags[i]).toBe(false);
  });
});
