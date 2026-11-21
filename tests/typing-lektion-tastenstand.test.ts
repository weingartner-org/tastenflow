/**
 * Lektionen rechnen mit dem ECHTEN Tastenstand des Kindes (Befund Jano
 * 07.08.2026): Eine Lehrgangs-Lektion baute ihre Zeilen bisher nur aus den
 * Tasten ihrer Lektions-Position — wer mit 16 Tasten aus »Mein Training« eine
 * frühe Lektion (wieder) übte, bekam für Stufe c genau 4 Sätze plus
 * Silben-Drill, jede Runde dieselben. Jetzt gilt: Lektions-Tasten PLUS
 * anderswo Gelerntes (`unlockedKeysWith`), verlangt wird weiterhin nur
 * Gelerntes.
 *
 * ★ E7 (19.09.2026): Der zweite Teil dieser Datei prüfte den Wiedereinstieg
 * (`landingLesson`) - wo der Übungsbildschirm der Übungsart „Lektionen"
 * beim Öffnen landet. Mit dem Wegfall dieser Übungsart (`TypingTrainer.tsx`,
 * siehe `trainerMode.ts`) hat `landingLesson` keinen Aufrufer mehr und ist aus
 * `curriculum.ts` entfernt; die reine Freischaltungs-Frage `lessonOpen` bleibt
 * und bleibt darum unten stehen. (Sie speiste bis 19.09.2026 den Block
 * „Lektionen-Stand" in „Meine Statistik"; der ist seither weg - Johannes: *„den
 * versteht jetzt niemand mehr"*. In `src/` hat `lessonOpen` damit keinen
 * Aufrufer mehr, geprüft wird sie hier und von `scripts/_durchgaengigkeit.mts`.)
 */
import { describe, it, expect } from "vitest";
import {
  LESSONS,
  TypingProgress,
  SHIFT_UNIT,
  emptyProgress,
  generateRound,
  startpunktEinheiten,
  lessonOpen,
  lessonSkipped,
  shiftUnlockedAt,
  shiftUnlockedWith,
  unlockedKeysAt,
  unlockedKeysWith,
} from "../src/lib/typing";

/** Janos echter Stand vom Live-Server (07.08.2026): 16 Buchstaben + ⇧. */
const JANO = "fjdkslaöenirt⇧hug".split("");

/**
 * Die Lektionen, die auf dieser Tastatur überhaupt vorkommen - bis E7
 * (19.09.2026) `lessonsForLayout` in `curriculum.ts`, seither ohne
 * Aufrufer aus `src/` entfernt (siehe Dateikopf). Die eine Zeile lebt hier
 * lokal weiter, weil dieser Test wirklich über ALLE Lektionen der Tastatur
 * iterieren muss.
 */
function lessonsForLayout() {
  return LESSONS.filter((l) => !lessonSkipped(l));
}

describe("unlockedKeysWith — Lektions-Tasten plus anderswo Gelerntes", () => {
  it("ohne introduced identisch mit unlockedKeysAt (Lehrgangs-Geher unverändert)", () => {
    for (const l of lessonsForLayout()) {
      expect(new Set(unlockedKeysWith(l.id, undefined, "de"))).toEqual(
        new Set(unlockedKeysAt(l.id)),
      );
      expect(new Set(unlockedKeysWith(l.id, unlockedKeysAt(l.id), "de"))).toEqual(
        new Set(unlockedKeysAt(l.id)),
      );
    }
  });

  it("zählt anderswo gelernte Buchstaben dazu, nie die ⇧-Einheit selbst", () => {
    const keys = unlockedKeysWith("shift-gross", JANO, "de");
    for (const k of unlockedKeysAt("shift-gross")) expect(keys).toContain(k);
    for (const k of ["e", "n", "i", "r", "t", "u"]) expect(keys).toContain(k);
    expect(keys).not.toContain(SHIFT_UNIT);
    expect(keys).not.toContain("z"); // nie gelernt ⇒ bleibt draußen
  });

  it("shiftUnlockedWith: anderswo gelernte Großschreibung zählt mit", () => {
    expect(shiftUnlockedAt("home-fj")).toBe(false);
    expect(shiftUnlockedWith("home-fj", JANO)).toBe(true);
    expect(shiftUnlockedWith("home-fj", ["f", "j"])).toBe(false);
    expect(shiftUnlockedWith("shift-gross", undefined)).toBe(true);
  });
});

describe("generateRound mit introduced — echte Sätze statt Silben-Drill", () => {
  it("Jano-Stand in »Großschreibung«: volle Runde aus Korpuszeilen, kein Drill", () => {
    const round = generateRound("shift-gross", { lernweg: "de",
      stufe: "teens",
      lang: "de",
      count: 14,
      introduced: JANO,
    });
    expect(round).toHaveLength(14);
    // Vorher: 4 Korpuszeilen + 10 Drills. Jetzt trägt der volle eigene
    // Vorrat (106 Zeilen bei Stufe c) die ganze Runde.
    expect(round.filter((l) => l.source === null)).toHaveLength(0);
  });

  it("verlangt auch mit introduced nie eine ungelernte Taste", () => {
    const allowed = new Set(unlockedKeysWith("shift-gross", JANO, "de"));
    const ok = new RegExp(
      `^[ ${[...allowed].join("")}${[...allowed].join("").toUpperCase()}]*$`,
      "u",
    );
    for (let n = 0; n < 5; n++) {
      const round = generateRound("shift-gross", { lernweg: "de",
        stufe: "teens",
        lang: "de",
        count: 14,
        introduced: JANO,
      });
      for (const line of round) expect(line.text).toMatch(ok);
    }
  });

  it("echte Anfänger (ohne introduced) bekommen exakt das Alt-Verhalten", () => {
    const round = generateRound("shift-gross", { lernweg: "de", stufe: "teens", lang: "de", count: 14 });
    const lessonKeys = new Set(unlockedKeysAt("shift-gross"));
    const ok = new RegExp(
      `^[ ${[...lessonKeys].join("")}${[...lessonKeys].join("").toUpperCase()}]*$`,
      "u",
    );
    for (const line of round) expect(line.text).toMatch(ok);
    // Der Stufe-c-Vorrat auf den 10 Lehrgangs-Buchstaben ist winzig ⇒ Drill
    // füllt weiterhin auf (ehrliches Fingertraining, unverändert).
    expect(round.some((l) => l.source === null)).toBe(true);
  });
});

// ★ E7 (19.09.2026): Der Block „landingLesson — Wiedereinstieg überspringt
// Bestandenes" ist ersatzlos gestrichen, nicht angepasst - `landingLesson`
// berechnete den Einstiegspunkt für den Übungsbildschirm der Übungsart
// „Lektionen" (`TypingTrainer.tsx`, „Lektion wählen"); mit dem Wegfall dieser
// Übungsart hatte die Funktion keinen Aufrufer mehr und ist aus
// `curriculum.ts` entfernt (siehe `trainerMode.ts`).

describe("Startpunkt-Kind — introduced ohne Anschlag-Statistik (Befund 07.08.2026)", () => {
  // Ein Kind, das die Lehrkraft mit „Alle Buchstaben (mit Großschreibung)"
  // anlegt (31 Einheiten), hat introduced, aber letters = {}. Vorher: NUR
  // Lektion 1 offen, Einstieg „Grundstellung: F und J" — das Kind, das schon
  // alles tippen kann, wurde zur Grundreihe zurückgeschickt.
  const alleBuchstaben: TypingProgress = {
    ...emptyProgress(),
    introduced: startpunktEinheiten(31, "de"), // ★ D-1: Startpunkt „Alle Buchstaben"
  };

  it("Lektionen bis zum echten Wissensstand sind offen, dahinter zu", () => {
    expect(lessonOpen(alleBuchstaben, "home-gh")).toBe(true);
    expect(lessonOpen(alleBuchstaben, "shift-gross")).toBe(true);
    expect(lessonOpen(alleBuchstaben, "unter-mv")).toBe(true);
    // „Alle Buchstaben" (31 Einheiten) enthält KEIN . , - (das sind Satz-
    // zeichen, Startpunkt „+ Satzzeichen"). Der Lehrgang lehrt das Komma in
    // „unter-c-komma" — dort ist also die Front dieses Kindes:
    expect(lessonOpen(alleBuchstaben, "unter-c-komma")).toBe(true);
    expect(lessonOpen(alleBuchstaben, "unter-x-punkt")).toBe(false); // „," fehlt
    expect(lessonOpen(alleBuchstaben, "zahlen")).toBe(false);
  });
});
