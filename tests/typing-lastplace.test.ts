/**
 * Resume: TypingProgress.lastPlace (Modus + Lektion) rundet über
 * loadProgress()/saveProgress() sauber, Altstände ohne das Feld laden
 * unverändert weiter (additiv, siehe progress.ts).
 */
import { describe, expect, it } from "vitest";
import { loadProgress, saveProgress, emptyProgress } from "@/lib/typing/progress";
import type { TypingProgress } from "@/lib/typing/progress";

const STORAGE_KEY = "tippen-trainer:v1";

describe("TypingProgress.lastPlace — Resume", () => {
  it("Roundtrip: speichern und laden liefert denselben Modus + dieselbe Lektion", () => {
    const p: TypingProgress = {
      ...emptyProgress(),
      lastPlace: { mode: "lektionen", lessonId: "l07" },
    };
    saveProgress(p);
    const loaded = loadProgress();
    expect(loaded.lastPlace).toEqual({ mode: "lektionen", lessonId: "l07" });
  });

  it("Modus 'adaptiv' ohne Lektion rundet ebenfalls sauber", () => {
    const p: TypingProgress = { ...emptyProgress(), lastPlace: { mode: "adaptiv" } };
    saveProgress(p);
    expect(loadProgress().lastPlace).toEqual({ mode: "adaptiv" });
  });

  it("Altstand ohne lastPlace lädt fehlerfrei, Feld bleibt undefined", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ xp: 3, lessons: {} }));
    const loaded = loadProgress();
    expect(loaded.lastPlace).toBeUndefined();
    expect(loaded.xp).toBe(3);
  });
});
