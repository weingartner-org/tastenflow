import { describe, it, expect } from "vitest";
import {
  DIGIT_ORDER,
  INTRO_ORDER,
  LETTERS_BEFORE_SHIFT,
  LETTER_ORDER,
  PUNCT_ORDER,
  SHIFT_UNIT,
  SYMBOL_ORDER,
  type LetterStat,
  addPupil,
  adaptiveItems,
  advanceIntroduced,
  baseKeyForChar,
  createClass,
  deleteClass,
  deletePupil,
  fingerForChar,
  fingerGuide,
  getAccount,
  getProgress,
  introducedUpTo,
  letterLevel,
  listClasses,
  listPupils,
  masteryFor,
  mergeLetters,
  needsAltGr,
  nextLetter,
  registerTeacher,
  startPoints,
  unitGlyph,
  unitKind,
  unitLabel,
} from "../src/lib/typing";

const slowButAccurate: LetterStat = { hits: 10, misses: 0, sumMs: 20000, timed: 10 }; // 2000 ms

// Deterministischer PRNG (mulberry32): macht die zufällig erzeugten Übungszeilen
// reproduzierbar, damit Tests, die ein bestimmtes Zeichen erwarten, nicht mehr
// vom Math.random-Glück abhängen (sonst gelegentliches Flackern im vollen Lauf).
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Führt `fn` mit deterministischem Math.random aus und stellt es danach wieder her. */
function withSeededRandom<T>(seed: number, fn: () => T): T {
  const real = Math.random;
  Math.random = mulberry32(seed);
  try {
    return fn();
  } finally {
    Math.random = real;
  }
}

describe("Erweiterte Lernreihenfolge (Buchstaben → ⇧ → Satzzeichen → Zahlen → Sonderzeichen)", () => {
  it("setzt die Reihenfolge korrekt zusammen (Umschalt FRÜH, dann Rest + Zeichen)", () => {
    // Die Umschalttaste kommt früh — nach den ersten häufigen Buchstaben, nicht
    // erst nach dem ganzen Alphabet (Wunsch Johannes: bald echte Großschreibung).
    expect(INTRO_ORDER.indexOf(SHIFT_UNIT)).toBe(LETTERS_BEFORE_SHIFT);
    // ★ D-1 (28.09.2026): Punkt und Komma direkt nach ⇧, die übrigen
    // Satzzeichen weiter nach allen Buchstaben.
    expect(INTRO_ORDER).toEqual([
      ...LETTER_ORDER.slice(0, LETTERS_BEFORE_SHIFT),
      SHIFT_UNIT,
      ".",
      ",",
      ...LETTER_ORDER.slice(LETTERS_BEFORE_SHIFT),
      ...PUNCT_ORDER.filter((c) => c !== "." && c !== ","),
      ...DIGIT_ORDER,
      ...SYMBOL_ORDER,
    ]);
    // Alle Buchstaben sind enthalten (nur mit ⇧ dazwischen).
    expect(INTRO_ORDER.filter((u) => LETTER_ORDER.includes(u))).toEqual(LETTER_ORDER);
  });

  it("schaltet nach den ersten Buchstaben die Großschreibung frei", () => {
    // Sind die ersten Buchstaben (bis zur Umschalt-Stelle) freigeschaltet, ist die
    // Umschalttaste als Nächstes dran.
    const firstLetters = LETTER_ORDER.slice(0, LETTERS_BEFORE_SHIFT);
    expect(nextLetter(firstLetters, "de")).toBe(SHIFT_UNIT);
  });

  it("introducedUpTo liefert zusammenhängende Präfixe (mind. Anfänger F+J)", () => {
    expect(introducedUpTo(1, "de")).toHaveLength(2); // klemmt auf 2 (F + J)
    expect(introducedUpTo(3, "de")).toEqual(INTRO_ORDER.slice(0, 3));
    expect(introducedUpTo(12, "de")).toEqual(INTRO_ORDER.slice(0, 12));
    expect(introducedUpTo(9999, "de")).toEqual(INTRO_ORDER);
  });

  it("die Startpunkte sind aufsteigend und enden bei allem", () => {
    const pts = startPoints("de", "de");
    const units = pts.map((p) => p.units);
    expect(units[0]).toBe(2); // „Anfänger: nur F und J"
    expect(units[units.length - 1]).toBe(INTRO_ORDER.length);
    for (let i = 1; i < units.length; i++)
      expect(units[i]).toBeGreaterThan(units[i - 1]);
  });
});

describe("Anforderungs-Stufen (langsame Kinder bleiben nicht hängen)", () => {
  it("normal: langsam + treffsicher gilt als „hakt“", () => {
    expect(letterLevel(slowButAccurate, masteryFor("normal"), "de")).toBe("hakt");
  });

  it("nur Genauigkeit: Tempo zählt nicht → „sitzt“", () => {
    const m = masteryFor("nurgenau");
    expect(m.ignoreSpeed).toBe(true);
    expect(letterLevel(slowButAccurate, m, "de")).toBe("sitzt");
  });

  it("gemächlich: großzügigeres Tempo-Ziel", () => {
    expect(masteryFor("gemaechlich").targetMs).toBeGreaterThan(
      masteryFor("normal").targetMs,
    );
  });

  it("ein langsames Kind steigt nur mit „nur Genauigkeit“ auf", () => {
    const intro = INTRO_ORDER.slice(0, 8);
    const letters: Record<string, LetterStat> = {};
    for (const c of intro) letters[c] = slowButAccurate;
    expect(advanceIntroduced(intro, letters, "de", masteryFor("normal"))).toHaveLength(8);
    expect(
      advanceIntroduced(intro, letters, "de", masteryFor("nurgenau")),
    ).toHaveLength(9);
  });
});

describe("Adaptive Übungszeilen mit Satzzeichen, Zahlen und Sonderzeichen", () => {
  it("verlangt NUR freigeschaltete Zeichen (Buchstaben, Großbuchstaben, Satzzeichen, Ziffern)", () => {
    const zahlen = startPoints("de", "de").find((p) => p.key === "zahlen")!.units;
    const introduced = introducedUpTo(zahlen, "de");
    const allowed = new Set<string>([
      ...LETTER_ORDER,
      ...LETTER_ORDER.map((c) => c.toUpperCase()),
      " ",
      ...PUNCT_ORDER,
      ...DIGIT_ORDER,
    ]);
    const lines = adaptiveItems({ lernweg: "de", introduced, count: 60 });
    expect(lines).toHaveLength(60);
    for (const line of lines)
      for (const ch of line)
        expect(allowed.has(ch), `${ch} nicht erlaubt in „${line}“`).toBe(true);
    const joined = lines.join(" ");
    expect(/[0-9]/.test(joined)).toBe(true); // Ziffern kommen vor
    expect(/[.,?!:;-]/.test(joined)).toBe(true); // Satzzeichen kommen vor
  });

  it("baut ein fokussiertes Sonderzeichen ein, sobald es freigeschaltet ist", () => {
    const introduced = introducedUpTo(INTRO_ORDER.length, "de"); // alles frei
    // Fester Seed → reproduzierbar; große Stichprobe → das Fokuszeichen kommt
    // sicher vor (statt nur „meistens", was den Test sonst flackern lässt).
    const lines = withSeededRandom(42, () =>
      adaptiveItems({ lernweg: "de", introduced, focus: ["@"], count: 200 }),
    );
    expect(lines.join(" ")).toContain("@");
  });
});

describe("Mathe-/Chemie-Sonderzeichen { } [ ] | ^ ~ ° fest verankert", () => {
  const MATH = ["[", "]", "{", "}", "|", "^", "~", "°"];

  it("sind Teil der Sonderzeichen-Reihenfolge", () => {
    for (const c of MATH) {
      expect(SYMBOL_ORDER).toContain(c);
      expect(unitKind(c)).toBe("sonderzeichen");
    }
  });

  it("haben lesbare Namen für die Sprachausgabe", () => {
    expect(unitLabel("{")).toBe("geschweifte Klammer auf");
    expect(unitLabel("[")).toBe("eckige Klammer auf");
    expect(unitLabel("|")).toBe("senkrechter Strich");
    expect(unitLabel("°")).toBe("Grad");
  });

  it("liegen auf der richtigen Grund-Taste (für Tastatur + Finger)", () => {
    expect(baseKeyForChar("{")).toBe("7"); // AltGr+7
    expect(baseKeyForChar("[")).toBe("8");
    expect(baseKeyForChar("]")).toBe("9");
    expect(baseKeyForChar("}")).toBe("0");
    expect(baseKeyForChar("~")).toBe("+");
    expect(baseKeyForChar("|")).toBe("<");
    // jedes Zeichen hat einen zuständigen Finger
    for (const c of MATH) expect(fingerForChar(c)).not.toBeNull();
  });

  it("die Klammern brauchen AltGr, die Finger-Ansage erklärt es", () => {
    expect(needsAltGr("{")).toBe(true);
    expect(needsAltGr("[")).toBe(true);
    expect(needsAltGr("|")).toBe(true);
    expect(needsAltGr("°")).toBe(false); // ° ist Umschalt + ^
    const g = fingerGuide("{", false, "de");
    expect(g).toContain("geschweifte Klammer auf");
    expect(g).toContain("AltGr");
    expect(fingerGuide("^", false, "de")).toContain("Akzenttaste"); // Totaste
  });

  it("kommen als fokussiertes Zeichen in den Übungszeilen vor", () => {
    const introduced = introducedUpTo(INTRO_ORDER.length, "de"); // alles frei
    for (const c of ["{", "[", "^", "°"]) {
      // Fester Seed → reproduzierbar; große Stichprobe → das Fokuszeichen kommt
      // sicher vor (statt nur „meistens", was den Test sonst flackern lässt).
      const lines = withSeededRandom(42, () =>
        adaptiveItems({ lernweg: "de", introduced, focus: [c], count: 200 }),
      );
      expect(lines.join(" ")).toContain(c);
    }
  });
});

describe("Telemetrie der Großschreibung", () => {
  it("zählt die ⇧-Einheit getrennt mit", () => {
    const m = mergeLetters({}, [
      { char: SHIFT_UNIT, correct: true, ms: 300 },
      { char: SHIFT_UNIT, correct: false },
    ]);
    expect(m[SHIFT_UNIT]).toEqual({
      hits: 1,
      misses: 1,
      sumMs: 300,
      timed: 1,
      recent: [300, -1],
    });
  });
});

describe("Einheiten-Benennung", () => {
  it("erkennt die Art jeder Einheit", () => {
    expect(unitKind("a")).toBe("buchstabe");
    expect(unitKind(SHIFT_UNIT)).toBe("shift");
    expect(unitKind(".")).toBe("satzzeichen");
    expect(unitKind("1")).toBe("ziffer");
    expect(unitKind("@")).toBe("sonderzeichen");
  });

  it("benennt Einheiten lesbar", () => {
    expect(unitLabel(SHIFT_UNIT)).toBe("Großschreibung");
    expect(unitLabel(",")).toBe("Komma");
    expect(unitLabel("@")).toBe("At-Zeichen");
    expect(unitLabel("a")).toBe("A");
    // ★ E4 (18.09.2026): dieselbe „SS"-Falle wie bei `spokenKeyName`
    // (`unitHowToType`, siehe F2 in `typing-tiefentest-fixes.test.tsx`) - jetzt
    // auch hier behoben, weil die Tabelle „Wacklige Tasten" der Lehrkraft genau
    // dieses Zeichen im Auftrags-Beispiel nennt.
    expect(unitLabel("ß")).toBe("Eszett");
    expect(unitGlyph(SHIFT_UNIT)).toBe("⇧");
    expect(unitGlyph("a")).toBe("A");
    expect(unitGlyph(".")).toBe(".");
  });
});

describe("Finger-Ansage (für blinde Lernende)", () => {
  it("nennt Finger, Grundstellung und Gegenhand-Umschalt", () => {
    expect(fingerGuide("f", false, "de")).toContain("Zeigefinger");
    expect(fingerGuide("f", false, "de")).toContain("Grundstellung");
    expect(fingerGuide(" ", false, "de")).toContain("Daumen");
    const a = fingerGuide("A", false, "de"); // großes A → linke Hand → rechte Umschalttaste
    expect(a).toContain("kleiner Finger");
    expect(a).toContain("rechte Umschalttaste");
  });
});

describe("Konten: Anforderung + Startlevel beim Anlegen", () => {
  it("speichert Tempo-Stufe und Startpunkt", () => {
    const t = registerTeacher("Frau Test", "tippen-test@example.org", "geheim1");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "Testklasse");
    if (!c.ok) throw new Error(c.error);
    const startUnits = startPoints("de", "de").find((p) => p.key === "satz")!.units;
    const p = addPupil(c.value.code, "Kim", "pw12", "b", "nurgenau", startUnits);
    if (!p.ok) throw new Error(p.error);

    expect(getAccount(p.value.id)?.tempo).toBe("nurgenau");
    expect(getProgress(p.value.id).introduced).toEqual(introducedUpTo(startUnits, "de"));
  });
});

describe("Konten: Löschen + Namens-/Klassen-Kollisionen", () => {
  it("löscht eine/n Schüler:in samt Konto", () => {
    const t = registerTeacher("Frau Del", "del-pupil@example.org", "geheim1");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "DelKlasse");
    if (!c.ok) throw new Error(c.error);
    const p = addPupil(c.value.code, "Robin", "pw12");
    if (!p.ok) throw new Error(p.error);
    expect(getAccount(p.value.id)).not.toBeNull();

    const d = deletePupil(p.value.id);
    expect(d.ok).toBe(true);
    expect(getAccount(p.value.id)).toBeNull();
    expect(listPupils(c.value.code)).toHaveLength(0);
  });

  it("löscht eine Klasse mit allen Schüler:innen", () => {
    const t = registerTeacher("Frau DelC", "del-class@example.org", "geheim1");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "WegKlasse");
    if (!c.ok) throw new Error(c.error);
    const p1 = addPupil(c.value.code, "Alex", "pw12");
    const p2 = addPupil(c.value.code, "Sam", "pw12");
    if (!p1.ok || !p2.ok) throw new Error("Anlegen fehlgeschlagen");

    expect(deleteClass(c.value.code, t.value.id).ok).toBe(true);
    expect(listClasses(t.value.id)).toHaveLength(0);
    expect(getAccount(p1.value.id)).toBeNull();
    expect(getAccount(p2.value.id)).toBeNull();
  });

  it("schützt fremde Klassen vor dem Löschen", () => {
    const t1 = registerTeacher("L Eins", "owner@example.org", "geheim1");
    const t2 = registerTeacher("L Zwei", "stranger@example.org", "geheim1");
    if (!t1.ok || !t2.ok) throw new Error("Lehrer anlegen fehlgeschlagen");
    const c = createClass(t1.value.id, "Geschützt");
    if (!c.ok) throw new Error(c.error);
    const r = deleteClass(c.value.code, t2.value.id);
    expect(r.ok).toBe(false);
    expect(listClasses(t1.value.id)).toHaveLength(1);
  });

  /*
    ★ 20.09.2026 (Auftrag Testerin Punkt 1, Johannes' Testklasse „Test" war
    schon vergeben, allerdings nicht von ihm): der Klassenname ist seither
    NUR JE KONTO eindeutig - zwei Klassen DERSELBEN Lehrkraft mit demselben
    Namen bekommen jetzt eine klare Meldung, statt beide klaglos anzulegen
    (vorher: dieser Test bewies genau das Gegenteil). Global bleibt „3a"
    weiter erlaubt - bei ZWEI VERSCHIEDENEN Lehrkräften, siehe
    `tests/tastenflow-klassenname-je-konto.test.ts`, wo auch der
    Server-Hook (`tt_klasse_lib.pb.js`) und `pbBackend.createClass` geprüft
    sind.
  */
  it("derselbe Name bei DERSELBEN Lehrkraft wird abgelehnt (eigener Code hilft nicht)", () => {
    const t = registerTeacher("Frau Name", "samename@example.org", "geheim1");
    if (!t.ok) throw new Error(t.error);
    const a = createClass(t.value.id, "3a");
    expect(a.ok).toBe(true);
    const b = createClass(t.value.id, "3a"); // anderer Code, gleicher Name
    expect(b).toEqual({
      ok: false,
      error: "Diesen Klassennamen haben Sie schon vergeben. Bitte wählen Sie einen anderen Namen.",
    });
  });

  it("derselbe gewünschte Code wird nur einmal vergeben", () => {
    const t = registerTeacher("Frau Code", "samecode@example.org", "geheim1");
    if (!t.ok) throw new Error(t.error);
    expect(createClass(t.value.id, "Erste", "3.MS").ok).toBe(true);
    expect(createClass(t.value.id, "Zweite", "3.MS").ok).toBe(false);
  });

  it("gleicher Name in DERSELBEN Klasse wird abgelehnt (auch andere Groß-/Kleinschreibung)", () => {
    const t = registerTeacher("Frau Dup", "dup@example.org", "geheim1");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "DupKlasse");
    if (!c.ok) throw new Error(c.error);
    expect(addPupil(c.value.code, "Anna", "pw12").ok).toBe(true);
    expect(addPupil(c.value.code, "anna", "pw12").ok).toBe(false); // Kollision
  });

  it("gleicher Name in VERSCHIEDENEN Klassen ist erlaubt", () => {
    const t = registerTeacher("Frau Two", "two@example.org", "geheim1");
    if (!t.ok) throw new Error(t.error);
    const c1 = createClass(t.value.id, "K1");
    const c2 = createClass(t.value.id, "K2");
    if (!c1.ok || !c2.ok) throw new Error("Klassen anlegen fehlgeschlagen");
    expect(addPupil(c1.value.code, "Max", "pw12").ok).toBe(true);
    expect(addPupil(c2.value.code, "Max", "pw12").ok).toBe(true);
  });
});
