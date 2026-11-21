import { describe, it, expect, beforeEach } from "vitest";
import {
  LESSONS,
  accuracy,
  addPupil,
  charLabel,
  cpm,
  createClass,
  fingerForChar,
  generateItems,
  getAccount,
  loginPupil,
  needsShift,
  pupilStats,
  recordEvent,
  registerTeacher,
  setStufe,
  shiftHandFor,
  shiftUnlockedAt,
  unlockedKeysAt,
  wpm,
  type TaskEvent,
} from "../src/lib/typing";

beforeEach(() => localStorage.clear());

describe("Finger-/Tastenmodell", () => {
  it("ordnet Tasten dem richtigen Finger zu (Groß wie Klein)", () => {
    expect(fingerForChar("f")?.id).toBe("zeige-links");
    expect(fingerForChar("j")?.id).toBe("zeige-rechts");
    expect(fingerForChar("a")?.id).toBe("kleiner-links");
    expect(fingerForChar("ö")?.id).toBe("kleiner-rechts");
    expect(fingerForChar("A")?.id).toBe("kleiner-links"); // Groß = wie Klein
    expect(fingerForChar(" ")?.id).toBe("daumen");
  });

  it("erkennt Großschreibung und das Gegenhand-Prinzip", () => {
    expect(needsShift("a")).toBe(false);
    expect(needsShift("A")).toBe(true);
    expect(needsShift("?")).toBe(true);
    // Großbuchstabe der linken Hand → rechte Umschalttaste und umgekehrt
    expect(shiftHandFor("A")).toBe("rechts");
    expect(shiftHandFor("K")).toBe("links");
    expect(shiftHandFor("a")).toBe(null);
  });

  it("benennt Zeichen lesbar (für Sprachausgabe/Hinweise)", () => {
    expect(charLabel(" ")).toBe("Leertaste");
    expect(charLabel(".")).toBe("Punkt");
    expect(charLabel("A")).toBe("großes A");
  });
});

describe("Lehrplan", () => {
  it("schaltet Tasten kumulativ frei", () => {
    expect(new Set(unlockedKeysAt("home-fj"))).toEqual(new Set(["f", "j"]));
    const home = new Set(unlockedKeysAt("home-aoe"));
    for (const k of ["f", "j", "d", "k", "s", "l", "a", "ö"]) expect(home.has(k)).toBe(true);
    expect(home.has("e")).toBe(false); // E kommt erst später
  });

  it("schaltet die Großschreibung ab der Umschalt-Lektion frei", () => {
    expect(shiftUnlockedAt("home-gh")).toBe(false);
    expect(shiftUnlockedAt("shift-gross")).toBe(true);
    expect(shiftUnlockedAt("ober-ei")).toBe(true);
  });
});

describe("Übungs-Generator", () => {
  it("erzeugt die gewünschte Anzahl nicht-leerer Zeilen", () => {
    const items = generateItems("home-fj", { lernweg: "de", count: 10 });
    expect(items).toHaveLength(10);
    for (const it of items) expect(it.length).toBeGreaterThan(0);
  });

  it("benutzt NIE eine noch nicht freigeschaltete Taste — in JEDER Lektion", () => {
    for (const lesson of LESSONS) {
      const allowed = new Set(unlockedKeysAt(lesson.id));
      const items = generateItems(lesson.id, { lernweg: "de", count: 30 });
      for (const line of items) {
        for (const ch of line) {
          if (ch === " ") continue;
          const lower = ch.toLowerCase();
          // Auto-Großschreibung: Großbuchstaben sind erlaubt, sobald die
          // GRUNDtaste frei ist — daher nur die Grundtaste prüfen.
          expect(allowed.has(lower)).toBe(true);
        }
      }
    }
  });

  it("Grundstellung F/J: nur Kleinbuchstaben (Shift noch gesperrt)", () => {
    const items = generateItems("home-fj", { lernweg: "de", count: 20 }).join(" ");
    expect(items).toBe(items.toLowerCase());
  });

  it("Zahlen-Lektion: nur Ziffern und Leerzeichen", () => {
    for (const line of generateItems("zahlen", { lernweg: "de", count: 20 })) {
      expect(/^[0-9 ]+$/.test(line)).toBe(true);
    }
  });
});

describe("Kennzahlen", () => {
  it("rechnet CPM, WPM und Genauigkeit", () => {
    expect(cpm(100, 60000)).toBe(100); // 100 Anschläge in 1 Minute
    expect(wpm(100, 60000)).toBe(20); // 100 / 5
    expect(accuracy(9, 1)).toBe(0.9);
    expect(accuracy(0, 0)).toBe(1);
  });
});

const ev = (over: Partial<TaskEvent> = {}): TaskEvent => ({
  ts: 1_700_000_000_000,
  lesson: "home-fj",
  chars: 20,
  errors: 0,
  ms: 8000,
  ...over,
});

describe("Konten + Textstufe + Statistik", () => {
  it("legt Klasse/Schüler:in mit Stufe an, Stufe ist änderbar und bleibt erhalten", () => {
    const t = registerTeacher("Frau Berger", "berger@schule.at", "geheim1");
    if (!t.ok) throw new Error(t.error);
    const cls = createClass(t.value.id, "3b");
    if (!cls.ok) throw new Error(cls.error);
    const p = addPupil(cls.value.code, "Mia", "1234", "a");
    if (!p.ok) throw new Error(p.error);
    expect(p.value.stufe).toBe("a");
    expect(loginPupil(cls.value.code, "Mia", "1234").ok).toBe(true);

    // S1: Ein ALTER Wert („c") lässt sich weiterhin schreiben — gelesen wird er
    // migriert („teens"). So verhalten sich Bestandskonten und PocketBase gleich.
    setStufe(p.value.id, "c");
    expect(getAccount(p.value.id)?.stufe).toBe("teens");
    setStufe(p.value.id, "kids");
    expect(getAccount(p.value.id)?.stufe).toBe("kids");
  });

  it("aggregiert Genauigkeit aus richtig/falsch und erkennt Auffälligkeiten", () => {
    const t = registerTeacher("L", "l@s.at", "geheim1");
    if (!t.ok) throw new Error(t.error);
    const cls = createClass(t.value.id, "3b");
    if (!cls.ok) throw new Error(cls.error);
    const p = addPupil(cls.value.code, "Mia", "1234");
    if (!p.ok) throw new Error(p.error);

    recordEvent(p.value.id, ev({ chars: 18, errors: 2 }));
    recordEvent(p.value.id, ev({ chars: 20, errors: 0 }));
    const st = pupilStats(p.value.id);
    expect(st.tasks).toBe(2);
    expect(st.chars).toBe(38);
    expect(st.errors).toBe(2);
    expect(st.accuracy).toBeCloseTo(38 / 40, 5);

    // sehr schnelle, fehlerfreie „Übungen" → Verdacht steigt
    const t2 = registerTeacher("L2", "l2@s.at", "geheim1");
    if (!t2.ok) throw new Error(t2.error);
    const c2 = createClass(t2.value.id, "x");
    if (!c2.ok) throw new Error(c2.error);
    const fast = addPupil(c2.value.code, "Bot", "1234");
    if (!fast.ok) throw new Error(fast.error);
    // ★ Bauplan F1 (Messung 18.09., §11): 2000 statt 500 ms - schnell genug,
    // um verdächtig zu sein (1.200/min, über der 700er-Schwelle), aber nicht
    // schneller als physisch möglich (Boden 1.500/min, `zeilenTempoPlausibel`
    // in account.ts). Mit 500 ms (4.800/min) wäre die Zeile seit der
    // Behebung von F1 selbst implausibel und flösse gar nicht mehr in den
    // Schnell-Anteil ein - echte Bots/Paste-Erkennung braucht ein plausibles,
    // nur eben unrealistisch schnelles Muster.
    for (let i = 0; i < 10; i++) recordEvent(fast.value.id, ev({ chars: 40, errors: 0, ms: 2000 }));
    expect(pupilStats(fast.value.id).suspicion.score).toBeGreaterThanOrEqual(4);
  });
});
