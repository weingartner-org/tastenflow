import { describe, it, expect } from "vitest";
import {
  INTRO_ORDER,
  LETTER_ORDER,
  PUNCT_ORDER,
  SHIFT_UNIT,
  STUFEN,
  type LetterStat,
  type Stufe,
  adaptiveItems,
  advanceIntroduced,
  allMastered,
  canAdvance,
  defaultIntroduced,
  ensureIntroduced,
  isExtraUnit,
  isMastered,
  keyDifficulty,
  letterAccuracy,
  leerzeichenGutschrift,
  letterLevel,
  letterMs,
  mergeLetters,
  nextLetter,
  personalBaseMs,
  REAL_WORD_FLOOR,
  unitHowToType,
  unlockInfo,
  unlockSpeech,
  weakestLetters,
  wordDrillLines,
  WORDS,
  isNoun,
} from "../src/lib/typing";
import { STUFE_VOCAB } from "../src/lib/typing/corpusExtras";

// Hilfen zum Bauen von Zeichen-Statistiken
const stat = (
  hits: number,
  misses: number,
  avgMs: number,
  timed = hits,
): LetterStat => ({
  hits,
  misses,
  sumMs: avgMs * timed,
  timed,
});
const mastered = stat(10, 0, 500); // treffsicher + zügig
const struggling = stat(5, 5, 700); // 50 % Treffer → hakt
const slow = stat(10, 0, 2000); // langsam → hakt
const wobbly = stat(9, 1, 1200); // 90 % aber träge → wackelig
const fresh = stat(2, 0, 400); // zu wenig Daten → neu

describe("Buchstaben-Statistik", () => {
  it("rechnet Treffsicherheit und Tempo", () => {
    // Seit 28.08.2026 zählt das Tor die Leerzeichen mit (Entscheidung Johannes):
    // Die Runden-Anzeige rechnet sie als Treffer mit, die Tasten-Statistik ließ
    // sie weg - beide Zahlen liefen um rund 4 Punkte auseinander, und gemessen
    // wurde am strengeren Maßstab. `letterAccuracy` gibt daher jetzt die Quote
    // auf DEMSELBEN Maßstab wie die Anzeige (siehe LEERZEICHEN_ANTEIL).
    // Eine fehlerfreie Taste bleibt 100 %; 5 von 10 werden zu rund 58 %.
    expect(letterAccuracy(mastered)).toBeCloseTo(1, 5);
    const roh = 5 / 10;
    const frei = leerzeichenGutschrift(10);
    expect(letterAccuracy(struggling)).toBeCloseTo((5 + frei) / (10 + frei), 5);
    expect(letterAccuracy(struggling)).toBeGreaterThan(roh);
    // Am URTEIL ändert das nichts - „hakt" bleibt „hakt" (siehe nächster Test).
    expect(letterLevel(struggling, undefined, "de")).toBe("hakt");
    expect(letterMs(mastered)).toBe(500);
    expect(letterMs({ hits: 1, misses: 0, sumMs: 0, timed: 0 })).toBeNull();
  });

  it("stuft Buchstaben in neu/hakt/wackelig/sitzt ein", () => {
    expect(letterLevel(undefined, undefined, "de")).toBe("neu");
    expect(letterLevel(fresh, undefined, "de")).toBe("neu");
    expect(letterLevel(struggling, undefined, "de")).toBe("hakt");
    expect(letterLevel(slow, undefined, "de")).toBe("hakt");
    expect(letterLevel(wobbly, undefined, "de")).toBe("wackelig");
    expect(letterLevel(mastered, undefined, "de")).toBe("sitzt");
    expect(isMastered(mastered, undefined, "de")).toBe(true);
    expect(isMastered(wobbly, undefined, "de")).toBe(false);
  });

  it("zählt Anschläge in die Statistik (richtig/falsch + Tempo)", () => {
    const merged = mergeLetters({}, [
      { char: "f", correct: true, ms: 400 },
      { char: "f", correct: false },
      { char: "j", correct: true }, // ohne Zeitmessung
      { char: " ", correct: true, ms: 300 }, // Leertaste wird ignoriert
    ]);
    expect(merged.f).toEqual({
      hits: 1,
      misses: 1,
      sumMs: 400,
      timed: 1,
      recent: [400, -1],
    });
    expect(merged.j).toEqual({
      hits: 1,
      misses: 0,
      sumMs: 0,
      timed: 0,
      recent: [0],
    });
    expect(merged[" "]).toBeUndefined();
  });

  it("ein wackeliger Buchstabe festigt sich durch frische saubere Anschläge", () => {
    // Schlechter Start: viele Fehler + langsam beim „d" (würde nach Lebenszeit
    // ewig „wackelig"/„hakt" bleiben und den Aufstieg blockieren).
    let letters = mergeLetters(
      {},
      Array.from({ length: 12 }, () => ({ char: "d", correct: false })),
    );
    expect(letterLevel(letters.d, undefined, "de")).toBe("hakt");

    // Danach lauter saubere, zügige Anschläge: das Fenster verdrängt die alten
    // Fehler, „d" sitzt wieder — obwohl die Lebenszeit-Quote mies bleibt.
    //
    // ⚠️ DER PREIS DES GRÖSSEREN FENSTERS (RECENT_WINDOW 20 → 60 am 28.08.2026):
    // Erholung dauert jetzt LÄNGER. Nach 12 Fehlern braucht dieselbe Taste
    //   39 saubere Anschläge, um „hakt" zu verlassen (sperrt dann nicht mehr),
    //   53 saubere Anschläge, um wieder zu „sitzt" zu kommen.
    // Vorher reichten 20. Das ist die bewusst in Kauf genommene Kehrseite davon,
    // dass ein 20er-Fenster Pech für Unvermögen hielt (bei 24 Tasten sahen immer
    // ein paar wackelig aus, ohne dass sich am Können etwas geändert hätte).
    // Dagegen arbeiten die gezielten Übungszeilen und die Geduld-Regel.
    const sauber = (n: number) =>
      Array.from({ length: n }, () => ({ char: "d", correct: true, ms: 500 }));

    letters = mergeLetters(letters, sauber(38));
    expect(letterLevel(letters.d, undefined, "de")).toBe("hakt"); // 38 reichen noch nicht

    letters = mergeLetters(letters, sauber(1)); // 39
    expect(letterLevel(letters.d, undefined, "de")).toBe("wackelig"); // sperrt nicht mehr

    letters = mergeLetters(letters, sauber(14)); // 53
    expect(letterLevel(letters.d, undefined, "de")).toBe("sitzt");

    expect(letters.d.misses).toBe(12); // Lebenszeit bleibt für die Lehrkraft erhalten
    // Bewertung nur aus dem Fenster: die alten Fehler sind heraus.
    letters = mergeLetters(letters, sauber(10));
    expect(letterAccuracy(letters.d)).toBeCloseTo(1, 5);
  });
});

describe("Toleranz für Satz-/Sonderzeichen", () => {
  it("isExtraUnit erkennt Satz-/Sonderzeichen, nicht Buchstaben/Ziffern", () => {
    expect(isExtraUnit("%")).toBe(true);
    expect(isExtraUnit("?")).toBe(true);
    expect(isExtraUnit("f")).toBe(false);
    expect(isExtraUnit("5")).toBe(false);
  });

  it("ein langsames, treffsicheres Sonderzeichen gilt frueher als gemeistert", () => {
    const slowAccurate = stat(10, 0, 1500); // 100 % Treffer, aber träge
    // als BUCHSTABE: noch „wackelig" (Tempo zählt, Geduld erst nach 16 Anschlägen)
    expect(letterLevel(slowAccurate, undefined, "de", "f")).toBe("wackelig");
    // als SONDERZEICHEN: schon „sitzt" (Geduld greift früher, Tempo egal)
    expect(letterLevel(slowAccurate, undefined, "de", "%")).toBe("sitzt");
  });

  it("reine Langsamkeit macht ein Sonderzeichen nicht hakend (nur echte Fehler)", () => {
    const verySlow = stat(7, 0, 6000); // extrem langsam, aber fehlerfrei
    expect(letterLevel(verySlow, undefined, "de", "z")).toBe("hakt"); // Buchstabe: blockiert
    expect(letterLevel(verySlow, undefined, "de", "@")).not.toBe("hakt"); // Sonderzeichen: nein
    // Echte Unsicherheit (viele Fehler) bleibt aber auch beim Sonderzeichen „hakt".
    expect(letterLevel(stat(5, 5, 700), undefined, "de", "@")).toBe("hakt");
  });
});

describe("Adaptive Freischaltung", () => {
  it("startet mit F und J (totaler Anfänger) und kennt die Reihenfolge", () => {
    const start = defaultIntroduced("de");
    expect(start).toHaveLength(2); // nur F + J — nicht die ganze Grundreihe
    expect(start).toEqual(LETTER_ORDER.slice(0, 2));
    expect(ensureIntroduced(undefined, "de")).toEqual(start);
    expect(ensureIntroduced([], "de")).toEqual(start);
    // zu kurze/unsinnige Altstände werden auf F+J bereinigt
    expect(ensureIntroduced(["f"], "de")).toEqual(start);
    // ein gültiger Stand mit F+J bleibt erhalten
    expect(ensureIntroduced(["f", "j"], "de")).toEqual(start);
  });

  it("schaltet den nächsten Buchstaben erst frei, wenn alle sitzen", () => {
    const intro = LETTER_ORDER.slice(0, 8); // Grundreihe als Beispiel
    const allSit: Record<string, LetterStat> = {};
    for (const c of intro) allSit[c] = mastered;
    expect(allMastered(intro, allSit, "de")).toBe(true);
    const grown = advanceIntroduced(intro, allSit, "de");
    expect(grown).toHaveLength(9);
    expect(grown[8]).toBe(nextLetter(intro, "de"));
    expect(grown[8]).toBe(LETTER_ORDER[8]);

    // Hakt noch einer, bleibt es bei den 8.
    const notYet = { ...allSit, [intro[0]]: struggling };
    expect(allMastered(intro, notYet, "de")).toBe(false);
    expect(advanceIntroduced(intro, notYet, "de")).toHaveLength(8);
  });

  it("lässt bis zu 3 wackelige Buchstaben durch, blockiert ab dem 4. (Wunsch)", () => {
    const intro = LETTER_ORDER.slice(0, 8); // 8 Einheiten (Grundreihe)
    const base: Record<string, LetterStat> = {};
    for (const c of intro) base[c] = mastered;

    // 3 wackelige (90 % aber träge) → neuer Buchstabe kommt trotzdem dazu.
    const threeWobbly = { ...base, [intro[0]]: wobbly, [intro[1]]: wobbly, [intro[2]]: wobbly };
    expect(canAdvance(intro, threeWobbly, "de")).toBe(true);
    expect(advanceIntroduced(intro, threeWobbly, "de")).toHaveLength(9);

    // 4 wackelige → noch zu viele offene Baustellen, bleibt bei den 8.
    const fourWobbly = { ...threeWobbly, [intro[3]]: wobbly };
    expect(canAdvance(intro, fourWobbly, "de")).toBe(false);
    expect(advanceIntroduced(intro, fourWobbly, "de")).toHaveLength(8);

    // Ein klar HAKENDER blockiert immer, auch wenn sonst alles sitzt.
    const oneStuck = { ...base, [intro[0]]: struggling };
    expect(canAdvance(intro, oneStuck, "de")).toBe(false);
    expect(advanceIntroduced(intro, oneStuck, "de")).toHaveLength(8);
  });

  it("ein hakendes Satz-/Sonderzeichen blockiert den Aufstieg NICHT (ein Buchstabe schon)", () => {
    const home = ["f", "j", "d", "k"]; // Grundreihe, alle sitzen
    const base: Record<string, LetterStat> = {};
    for (const c of home) base[c] = mastered;

    // Ein hakendes SONDERZEICHEN („%", viele Fehler) hält den Fortschritt nicht auf —
    // sonst friert ein einzelnes zähes Zeichen alles ein (Wunsch Johannes).
    const stuckSymbol = { ...base, "%": struggling };
    expect(canAdvance([...home, "%"], stuckSymbol, "de")).toBe(true);

    // Ein hakender BUCHSTABE blockiert dagegen weiterhin (die Grundlage muss sitzen).
    const stuckLetter = { ...base, z: struggling };
    expect(canAdvance([...home, "z"], stuckLetter, "de")).toBe(false);
  });

  it("benennt die schwächsten Buchstaben (inkl. des neuesten)", () => {
    const intro = ["f", "j", "d"];
    const letters: Record<string, LetterStat> = {
      f: mastered,
      j: struggling,
      d: fresh,
    };
    const weak = weakestLetters(intro, letters, "de", 3);
    expect(weak).toContain("d"); // neuester, noch nicht sicher
    expect(weak).toContain("j"); // hakt
    expect(weak).not.toContain("f"); // sitzt → kein Übungsbedarf
  });
});

describe("Freischalt-Feier — Ansage wie getippt wird", () => {
  it("Sonderzeichen über Umschalt: nennt Umschalt + Grundtaste als Wort", () => {
    expect(unitHowToType("%")).toBe("Es wird mit Umschalt und Fünf geschrieben.");
    expect(unitHowToType(";")).toBe("Es wird mit Umschalt und Komma geschrieben.");
  });
  it("AltGr-Zeichen nennen die Alt-Gr-Taste", () => {
    expect(unitHowToType("@")).toBe("Es wird mit Alt Gr und Q geschrieben.");
  });
  it("eigene Taste (Buchstabe/Ziffer): nennt Taste + Finger", () => {
    // ★ 25.09.2026 (Testerin): mit der Reihe - der Finger allein sagt nicht, wohin.
    expect(unitHowToType("f")).toBe("Es liegt auf der Taste F, linker Zeigefinger, Grundreihe.");
    expect(unitHowToType("i")).toBe("Es liegt auf der Taste I, rechter Mittelfinger, obere Reihe: vom K aus nach vorne, fast gerade.");
    expect(unitHowToType("5")).toContain("Fünf");
    expect(unitHowToType(",")).toBe("Es liegt auf der Taste Komma, rechter Mittelfinger, untere Reihe: vom K aus nach hinten und etwas nach rechts.");
  });
  it("Großschreibung erklärt die Umschalttaste der Gegenhand", () => {
    expect(unitHowToType(SHIFT_UNIT)).toContain("Großbuchstaben");
  });

  it("unlockInfo liefert Glyph, Gattung und Name", () => {
    const i = unlockInfo("%");
    expect(i.glyph).toBe("%");
    expect(i.noun).toBe("Sonderzeichen");
    expect(i.name).toBe("Prozent");
  });

  it("Kinder werden bejubelt, Erwachsene sachlich — beide mit Tipp-Hinweis", () => {
    expect(unlockSpeech("%", false)).toBe(
      "Gratulation! Das Sonderzeichen Prozent ist freigeschaltet. Es wird mit Umschalt und Fünf geschrieben.",
    );
    expect(unlockSpeech("%", true)).toBe(
      "Freigeschaltet: das Sonderzeichen Prozent. Es wird mit Umschalt und Fünf geschrieben.",
    );
    // Buchstabe: Umlaute werden ausgeschrieben vorgelesen.
    expect(unlockSpeech("ä", false)).toContain("Buchstabe a Umlaut");
  });
});

describe("Adaptive Übungszeilen", () => {
  it("nutzt nur freigeschaltete (Grund-)Tasten in gewünschter Anzahl", () => {
    const introduced = LETTER_ORDER.slice(0, 8); // Grundreihe (enthält s)
    const allowed = new Set(introduced);
    const lines = adaptiveItems({ lernweg: "de", introduced, focus: ["s"], count: 12 });
    expect(lines).toHaveLength(12);
    for (const line of lines) {
      expect(line.length).toBeGreaterThan(0);
      for (const ch of line) {
        if (ch === " ") continue;
        // Auto-Großschreibung: Großbuchstaben sind erlaubt, sobald ihre
        // GRUNDtaste frei ist — daher die Grundtaste (Kleinbuchstabe) prüfen.
        expect(allowed.has(ch.toLowerCase()), `${ch} nicht freigeschaltet`).toBe(
          true,
        );
      }
    }
  });

  it("betont die Fokus-Buchstaben", () => {
    const introduced = LETTER_ORDER.slice(0, 8); // Grundreihe (enthält s)
    const lines = adaptiveItems({ lernweg: "de", introduced, focus: ["s"], count: 40 }).join(
      " ",
    );
    expect(lines.includes("s")).toBe(true);
  });

  it("nutzt auch mit Korpus-Einblendung NIE eine ungelernte Taste", () => {
    const introduced = INTRO_ORDER; // alles freigeschaltet (inkl. Satzzeichen, Zahlen)
    const hasShift = introduced.includes(SHIFT_UNIT);
    const allowed = new Set(introduced.map((c) => c.toLowerCase()));
    const stufen: Stufe[] = ["kids", "teens", "erwachsen"];
    for (const stufe of stufen) {
      const lines = adaptiveItems({ lernweg: "de", introduced, focus: [], stufe, count: 60 });
      for (const line of lines) {
        for (const ch of line) {
          if (ch === " ") continue;
          const lower = ch.toLowerCase();
          if (ch !== lower) expect(hasShift).toBe(true); // Großbuchstabe nur mit Shift
          expect(allowed.has(lower), `${ch} in „${line}" nicht freigeschaltet`).toBe(
            true,
          );
        }
      }
    }
  });

  it("Sonderzeichen-Phase: verlangt NIE ein noch nicht freigeschaltetes Zeichen (jeder Präfix)", () => {
    // Ab dem ersten Satzzeichen JEDEN Einführungs-Präfix prüfen: das zuletzt
    // freigeschaltete Zeichen steht im Fokus (so dominieren seine Zeichen-Zeilen).
    // KEINE Zeile darf eine Taste außerhalb des Präfix verlangen — sonst würde ein
    // Kind nach einer noch ungelernten Taste gefragt.
    const firstExtra = INTRO_ORDER.indexOf(PUNCT_ORDER[0]);
    for (let n = firstExtra + 1; n <= INTRO_ORDER.length; n++) {
      const introduced = INTRO_ORDER.slice(0, n);
      const allowed = new Set(introduced.map((c) => c.toLowerCase()));
      const newest = introduced[introduced.length - 1]; // zuletzt frei → im Fokus
      for (const stufe of STUFEN) {
        for (const line of adaptiveItems({ lernweg: "de", introduced, focus: [newest], stufe, count: 30 })) {
          for (const ch of line) {
            if (ch === " ") continue;
            expect(
              allowed.has(ch.toLowerCase()),
              `„${ch}" in „${line}" nicht freigeschaltet (bis „${newest}")`,
            ).toBe(true);
          }
        }
      }
    }
  });

  it("ein Sonderzeichen im Fokus kommt häufig vor (echte Texte treten zurück)", () => {
    // Mit „@" im Fokus müssen die echten Korpus-Texte zurücktreten (dort kommt „@"
    // nie vor) — sonst könnte man das Zeichen kaum üben und käme nicht weiter.
    const lines = adaptiveItems({ lernweg: "de",
      introduced: INTRO_ORDER,
      focus: ["@"],
      stufe: "erwachsen",
      count: 60,
    });
    const withAt = lines.filter((l) => l.includes("@")).length;
    expect(withAt).toBeGreaterThanOrEqual(12);
  });

  it("schreibt mit Umschalttaste Nomen groß und den Rest klein", () => {
    const allowed = LETTER_ORDER; // alle Buchstaben frei
    const real = new Set([...WORDS, ...Object.values(STUFE_VOCAB).flat()]);
    let nouns = 0;
    let others = 0;
    for (let r = 0; r < 30; r++) {
      for (const line of wordDrillLines(allowed, true, "teens", [], 12)) {
        for (const tok of line.split(" ")) {
          const lw = tok.toLowerCase();
          if (!real.has(lw)) continue; // Pseudowörter überspringen
          const isCap =
            tok[0] === tok[0].toUpperCase() && tok[0] !== tok[0].toLowerCase();
          if (isNoun(lw)) {
            expect(isCap, `Nomen „${tok}" sollte groß sein`).toBe(true);
            nouns++;
          } else {
            expect(isCap, `„${tok}" ist kein Nomen, sollte klein sein`).toBe(false);
            others++;
          }
        }
      }
    }
    expect(nouns).toBeGreaterThan(0);
    expect(others).toBeGreaterThan(0);
  });

  it("schreibt Nomen auch ohne gelernte Umschalttaste groß (Auto-Großschreibung)", () => {
    // Neue Regel: Großbuchstaben sind immer tippbar (Auto-Großschreibung bis zur
    // Umschalttaste). Deutsche Nomen werden daher auch ohne „shift" korrekt groß
    // geschrieben — die Schreibung bleibt richtig.
    const allowed = LETTER_ORDER;
    const real = new Set([...WORDS, ...Object.values(STUFE_VOCAB).flat()]);
    let nouns = 0;
    for (let r = 0; r < 30; r++) {
      for (const line of wordDrillLines(allowed, false, "teens", [], 12)) {
        for (const tok of line.split(" ")) {
          const lw = tok.toLowerCase();
          if (!real.has(lw)) continue; // Pseudowörter überspringen
          const isCap =
            tok[0] === tok[0].toUpperCase() && tok[0] !== tok[0].toLowerCase();
          if (isNoun(lw)) {
            expect(isCap, `Nomen „${tok}" sollte auch ohne Umschalt groß sein`).toBe(
              true,
            );
            nouns++;
          }
        }
      }
    }
    expect(nouns).toBeGreaterThan(0);
  });

  it("bringt echte Korpus-Texte ins Mein Training (Abwechslung)", () => {
    const introduced = INTRO_ORDER; // weit fortgeschritten
    // über mehrere Runden: mindestens eine echte (lange) Korpus-Zeile taucht auf
    let sawCorpus = false;
    for (let r = 0; r < 5 && !sawCorpus; r++) {
      const lines = adaptiveItems({ lernweg: "de", introduced, focus: [], stufe: "teens", count: 40 });
      if (lines.some((l) => l.length > 35)) sawCorpus = true;
    }
    expect(sawCorpus).toBe(true);
  });
});

describe("Schwierigkeits-Faktor pro Zeichen (keyDifficulty)", () => {
  it("staffelt schwerere Zeichen höher als Grundreihen-Buchstaben", () => {
    expect(keyDifficulty("f", "de")).toBe(1); // Grundreihe = Referenz
    expect(keyDifficulty("p", "de")).toBeGreaterThan(keyDifficulty("f", "de")); // Reichweite
    expect(keyDifficulty(".", "de")).toBeGreaterThan(keyDifficulty("f", "de")); // Satzzeichen
    expect(keyDifficulty("5", "de")).toBeGreaterThan(keyDifficulty("f", "de")); // Ziffer
    expect(keyDifficulty("@", "de")).toBeGreaterThan(keyDifficulty(".", "de")); // AltGr > Satzzeichen
    expect(keyDifficulty("^", "de")).toBeGreaterThanOrEqual(keyDifficulty("@", "de")); // Totaste am höchsten
    expect(keyDifficulty(SHIFT_UNIT, "de")).toBeGreaterThan(1); // Umschalt-Einheit
  });
});

describe("Eigen-Tempo-Normierung (personalBaseMs)", () => {
  const intro = ["f", "j", "d", "k", "s"]; // alles Grundreihe (Faktor 1,0)

  it("liefert das nominelle Ziel, solange zu wenig Daten da sind", () => {
    expect(personalBaseMs(intro, {}, "de")).toBe(900); // Fallback = TARGET_MS
    // nur zwei sitzende Tasten (< 3) → weiter Fallback
    expect(
      personalBaseMs(intro, { f: stat(10, 0, 400), j: stat(10, 0, 500) }, "de"),
    ).toBe(900);
  });

  it("nimmt den Median der sitzenden Grundreihen-Tasten", () => {
    const letters = {
      f: stat(10, 0, 400),
      j: stat(10, 0, 600),
      d: stat(10, 0, 800),
    };
    expect(personalBaseMs(intro, letters, "de")).toBe(600); // Median von 400/600/800
  });

  it("klemmt sehr schnelle Tempi auf die Untergrenze", () => {
    const fast = {
      f: stat(10, 0, 200),
      j: stat(10, 0, 200),
      d: stat(10, 0, 200),
    };
    expect(personalBaseMs(intro, fast, "de")).toBe(450); // BASE_MS_FLOOR
  });
});

describe("Faire, zeichenabhängige Zeitwertung", () => {
  it("lässt ein zügiges Sonderzeichen sitzen, wo dasselbe Tempo beim Buchstaben noch nicht reicht", () => {
    const s = stat(10, 0, 1500); // 1,5 s/Anschlag, treffsicher
    // Grundreihen-Buchstabe: Ziel 900 ms → 1500 ms reicht noch nicht
    expect(letterLevel(s, undefined, "de", "f")).not.toBe("sitzt");
    // AltGr-Sonderzeichen @: Ziel 900 × 2,2 ≈ 1980 ms → 1500 ms reicht → sitzt
    expect(letterLevel(s, undefined, "de", "@")).toBe("sitzt");
  });

  it("bleibt ohne Zeichen-Angabe beim alten Verhalten (Faktor 1)", () => {
    expect(letterLevel(stat(10, 0, 500), undefined, "de")).toBe("sitzt");
    expect(letterLevel(stat(9, 1, 1200), undefined, "de")).toBe("wackelig");
  });
});

describe("Übungszeilen: Unsinn nicht mit echten Wörtern mischen", () => {
  // Die echten Wörter, die zu einem Tastensatz passen (wie im Generator).
  const realSet = (allowed: string[], stufe: Stufe = "teens"): Set<string> => {
    const set = new Set(allowed);
    const source = [...WORDS, ...(STUFE_VOCAB[stufe] ?? [])];
    return new Set(
      source.filter((w) => w.length >= 2 && [...w].every((c) => set.has(c))),
    );
  };

  it("hat 40 als Schwelle", () => {
    expect(REAL_WORD_FLOOR).toBe(40);
  });

  it("verwendet ab genügend echten Wörtern KEINE Unsinnwörter mehr", () => {
    const allowed = "abcdefghijklmnopqrstuvwxyzäöüß".split("");
    const real = realSet(allowed);
    expect(real.size).toBeGreaterThanOrEqual(REAL_WORD_FLOOR);
    const lines = wordDrillLines(allowed, false, "teens", [], 30);
    for (const line of lines) {
      for (const tok of line.split(" ")) {
        expect(
          real.has(tok.toLowerCase()),
          `„${tok}" sollte ein echtes Wort sein, kein Unsinn`,
        ).toBe(true);
      }
    }
  });

  it("erzeugt sehr früh (nur F+J) reine Unsinn-Zeilen aus erlaubten Tasten", () => {
    const allowed = ["f", "j"]; // keine echten Wörter möglich
    expect(realSet(allowed).size).toBe(0);
    const lines = wordDrillLines(allowed, false, "teens", [], 20);
    expect(lines.length).toBe(20);
    for (const line of lines) {
      for (const tok of line.split(" ")) {
        expect(tok.length).toBeGreaterThan(0);
        expect(/^[fj]+$/.test(tok), `„${tok}" nur aus erlaubten Tasten`).toBe(true);
      }
    }
  });
});
