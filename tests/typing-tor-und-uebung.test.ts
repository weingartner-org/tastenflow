/**
 * Wächter für den Umbau vom 28.08.2026 (Befund an Janos Konto):
 *  • Die Umschalttaste erbt keine fremden Fehler mehr.
 *  • Das Tor lässt nach, je länger ein Kind ohne neue Taste übt.
 *  • Wackelige Tasten bekommen gezielte Pseudowort-Zeilen - und die
 *    Umschalttaste wird dabei nicht benachteiligt.
 *  • Die Rückmeldung nennt eine HANDLUNG, nie einen Tastennamen als Vorwurf.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  canAdvance, geduldsFaktor, nachgelassen, GEDULD_SPANNE, MAX_WOBBLY,
  MINDEST_RUNDEN_JE_TASTE, MINDEST_RUNDEN_START, MINDEST_RUNDEN_BIS,
  mindestRundenFuer,
  masteryFor, letterAccuracy, leerzeichenGutschrift, LEERZEICHEN_ANTEIL,
  fokusBreiteFuer, FOCUS_COUNT, MAX_FOCUS, offeneBaustellen,
} from "../src/lib/typing/letters";
import { adaptiveRound, uebungsZeilenFuer, MAX_UEBUNGSZEILEN } from "../src/lib/typing/generator";
import { rueckmeldungFuer, pseudoErklaerung } from "../src/lib/typing/rueckmeldung";
import type { LetterStat } from "../src/lib/typing/progress";
import { emptySeen } from "../src/lib/typing/ledger";

const m = masteryFor("normal");
/** Ein Fenster mit `fehler` Fehlern aus 20 Anschlägen, Tempo stets in Ordnung. */
const fenster = (fehler: number, ms = 250): LetterStat => {
  const recent = Array.from({ length: 20 }, (_, i) => (i < fehler ? -1 : ms));
  return { hits: 20 - fehler, misses: fehler, sumMs: (20 - fehler) * ms, timed: 20 - fehler, recent };
};
const INTRO = ["f", "j", "d", "k", "s", "l", "a", "ö"];
const alle = (fehler: number) =>
  Object.fromEntries(INTRO.map((c) => [c, fenster(fehler)])) as Record<string, LetterStat>;

describe("Leerzeichen zählen im Tor mit", () => {
  it("gibt anteilige Gutschrift auf das Fenster", () => {
    expect(leerzeichenGutschrift(20)).toBeCloseTo(20 * LEERZEICHEN_ANTEIL / (1 - LEERZEICHEN_ANTEIL), 4);
    expect(leerzeichenGutschrift(0)).toBe(0);
  });
  it("hebt die Quote einer Taste auf den Maßstab der Runden-Anzeige", () => {
    // 18 von 20 = 90 % je Taste -> mit den anteiligen Leerzeichen 91,6 %.
    expect(letterAccuracy(fenster(2))).toBeGreaterThan(0.9);
    expect(letterAccuracy(fenster(2))).toBeCloseTo(0.916, 2);
  });
});

describe("Geduld-Regel: niemand bleibt ewig ohne neue Taste", () => {
  it("gleitet über GEDULD_SPANNE von 0 auf 1", () => {
    expect(geduldsFaktor(0)).toBe(0);
    expect(geduldsFaktor(undefined)).toBe(0);
    expect(geduldsFaktor(GEDULD_SPANNE / 2)).toBeCloseTo(0.5, 5);
    expect(geduldsFaktor(GEDULD_SPANNE)).toBe(1);
    expect(geduldsFaktor(GEDULD_SPANNE * 3)).toBe(1); // nie über 1
  });
  it("lässt Deckel UND Sperr-Quote gleichzeitig nach", () => {
    const ohne = nachgelassen(m, 24, 0);
    expect(ohne.maxWobbly).toBe(MAX_WOBBLY);
    expect(ohne.struggleAcc).toBe(m.struggleAcc);
    const voll = nachgelassen(m, 24, GEDULD_SPANNE);
    expect(voll.maxWobbly).toBe(24); // alle Einheiten dürfen offen sein
    expect(voll.struggleAcc).toBe(0); // nichts hakt mehr
  });
  it("ein festgefahrenes Kind kommt nach GEDULD_SPANNE Runden weiter", () => {
    const schlecht = alle(7); // 65 % - jede Taste hakt
    expect(canAdvance(INTRO, schlecht, "de", m, 0)).toBe(false);
    expect(canAdvance(INTRO, schlecht, "de", m, GEDULD_SPANNE)).toBe(true);
  });
  it("ein festgefahrenes Kind kommt auch mit hakenden Tasten weiter", () => {
    const schlecht = alle(7);
    expect(canAdvance(INTRO, schlecht, "de", m, MINDEST_RUNDEN_JE_TASTE)).toBe(false);
    expect(canAdvance(INTRO, schlecht, "de", m, GEDULD_SPANNE)).toBe(true);
  });
});

describe("Mindest-Übung: es gibt auch ein zu früh", () => {
  // Vorher gab es GAR KEINE Untergrenze: Ein Kind mit 95 % Treffsicherheit bekam
  // eine neue Taste pro Runde - 18 Tasten in einer Stunde (`scripts/_tempo.mts`).
  it("auch ein fehlerfreies Kind wartet die Mindest-Runden ab", () => {
    const perfekt = alle(0);
    const noetig = mindestRundenFuer(INTRO.length);
    expect(canAdvance(INTRO, perfekt, "de", m, 0)).toBe(false);
    expect(canAdvance(INTRO, perfekt, "de", m, noetig - 1)).toBe(false);
    expect(canAdvance(INTRO, perfekt, "de", m, noetig)).toBe(true);
  });

  it("am Anfang ist die Grenze KLEINER - sonst sitzt ein Kind ewig auf f und j", () => {
    // Gemessen (`scripts/_untergrenze.mts`): Eine Runde mit zwei Tasten hat nur
    // 109 Zeichen, und ein Anfänger tippt langsam - fest 10 Runden wären
    // 24 Minuten lang zwei Tasten.
    //
    // ★ 29.08.2026 flacher gestellt (START 4 → 1, Plateau erst ab 12 statt ab 8
    // Einheiten). Grund: Die Grundreihe kostete gemessen 182 Minuten bei einem
    // Kind mit 30 Anschlägen/min - Entscheidung Johannes: „viel zu lange, ca.
    // 100 min wären gut". Nachgemessen (`scripts/_langsam.mts`): 108 min.
    expect(mindestRundenFuer(2)).toBe(MINDEST_RUNDEN_START);
    expect(mindestRundenFuer(4)).toBeGreaterThan(MINDEST_RUNDEN_START);
    expect(mindestRundenFuer(4)).toBeLessThan(MINDEST_RUNDEN_JE_TASTE);
    // Die Rampe läuft jetzt ÜBER die Grundreihe hinaus: Bei 8 Tasten ist noch
    // nicht das Plateau erreicht - erst ab MINDEST_RUNDEN_BIS.
    expect(mindestRundenFuer(8)).toBeLessThan(MINDEST_RUNDEN_JE_TASTE);
    expect(mindestRundenFuer(MINDEST_RUNDEN_BIS)).toBe(MINDEST_RUNDEN_JE_TASTE);
    expect(mindestRundenFuer(24)).toBe(MINDEST_RUNDEN_JE_TASTE);
  });

  it("RATSCHE: die Grundreihe kostet nicht wieder mehr Runden", () => {
    // Was die Grundreihe kostet, steckt in der Summe der Rampe von 2 bis 7
    // Tasten. Sie war 34 und ist seit 29.08.2026 bewusst rund halbiert - wer
    // sie wieder anhebt, verlängert die Grundreihe für JEDES Kind.
    let summe = 0;
    for (let n = 2; n < 8; n++) summe += mindestRundenFuer(n);
    expect(summe).toBeLessThanOrEqual(18);
  });

  it("die Rampe steigt und fällt nie", () => {
    for (let n = 2; n < 30; n++)
      expect(mindestRundenFuer(n + 1)).toBeGreaterThanOrEqual(mindestRundenFuer(n));
  });

  it("greift auch bei einem Kind mit nur zwei Tasten", () => {
    const zwei = ["f", "j"];
    const gut = { f: fenster(0), j: fenster(0) } as Record<string, LetterStat>;
    // Gegen die Rampe gerechnet, nicht gegen eine feste Zahl: Sonst misst der
    // Test die Konstante von gestern statt die Regel.
    const noetig = mindestRundenFuer(zwei.length);
    expect(canAdvance(zwei, gut, "de", m, noetig - 1)).toBe(false);
    expect(canAdvance(zwei, gut, "de", m, noetig)).toBe(true);
  });

  it("die jüngste Taste muss sitzen - Können, nicht nur Uhr", () => {
    // Alles sitzt, nur die zuletzt dazugekommene Taste wackelt.
    const fast = { ...alle(0), ["ö"]: fenster(4) };
    expect(canAdvance(INTRO, fast, "de", m, MINDEST_RUNDEN_JE_TASTE)).toBe(false);
    // ... bis die Geduld-Regel auch diese Hürde aufhebt.
    expect(canAdvance(INTRO, fast, "de", m, GEDULD_SPANNE)).toBe(true);
  });

  it("ein brandneues Konto hängt nicht in der Grundstellung fest", () => {
    // Ohne Zähler (Altstand / erster Start) greift die Untergrenze nicht.
    expect(canAdvance(INTRO, alle(0), "de", m, undefined)).toBe(true);
  });
});

describe("Fokus und Übungszeilen wachsen mit den Baustellen", () => {
  it("wer rund läuft, bekommt keine Übungszeilen", () => {
    expect(uebungsZeilenFuer(0)).toBe(0);
    expect(uebungsZeilenFuer(2)).toBe(0);
  });
  it("wer feststeckt, bekommt welche - aber nie die halbe Runde", () => {
    expect(uebungsZeilenFuer(3)).toBe(1);
    expect(uebungsZeilenFuer(14)).toBe(MAX_UEBUNGSZEILEN);
    expect(uebungsZeilenFuer(99)).toBe(MAX_UEBUNGSZEILEN);
    expect(MAX_UEBUNGSZEILEN).toBeLessThan(12 / 2);
  });
  it("der Fokus wird breiter, bleibt aber gedeckelt", () => {
    expect(fokusBreiteFuer(0)).toBe(FOCUS_COUNT);
    expect(fokusBreiteFuer(14)).toBe(MAX_FOCUS);
  });
  it("offeneBaustellen zählt, was nicht sitzt", () => {
    expect(offeneBaustellen(INTRO, alle(0), "de", m)).toBe(0);
    expect(offeneBaustellen(INTRO, alle(7), "de", m)).toBe(INTRO.length);
  });
});

describe("Übungszeilen im erzeugten Text", () => {
  const intro = ["f", "j", "d", "k", "s", "l", "a", "ö", "e", "n", "i", "r", "t", "⇧", "h", "o", "u", "c", "g", "m", "w"];
  it("markiert jede Übungszeile mit der Taste, die sie übt", () => {
    const lines = adaptiveRound({ lernweg: "de",
      introduced: intro, focus: ["m", "w"], stufe: "teens", lang: "de",
      count: 12, seen: emptySeen(), uebungsZeilen: 3,
    });
    const ueb = lines.filter((l) => l.uebung?.length);
    expect(ueb).toHaveLength(3);
    for (const l of ueb) expect(l.uebung).toHaveLength(1); // eine Zeile, eine Taste
    expect(lines.filter((l) => !l.uebung).length).toBe(9); // echte Texte bleiben Mehrheit
  });
  it("die geübte Taste kommt in ihrer Zeile wirklich dicht vor", () => {
    let mitW = 0;
    for (let i = 0; i < 40; i++) {
      const lines = adaptiveRound({ lernweg: "de",
        introduced: intro, focus: ["w"], stufe: "teens", lang: "de",
        count: 12, seen: emptySeen(), uebungsZeilen: 1,
      });
      const z = lines.find((l) => l.uebung?.includes("w"));
      if (z && z.text.toLowerCase().includes("w")) mitW++;
    }
    expect(mitW).toBeGreaterThan(35); // fast immer - nicht dem Zufall überlassen
  });
  it("die Pseudowörter sind für ein Kind sprechbar", () => {
    // Vorher entstanden „zmg" und „affml": Das Erzwingen der Fokus-Taste ersetzte
    // eine ZUFÄLLIGE Stelle und schlug dabei den Vokal heraus.
    const woerter: string[] = [];
    for (let i = 0; i < 60; i++) {
      const lines = adaptiveRound({ lernweg: "de",
        introduced: intro, focus: ["m", "w", "g"], stufe: "teens", lang: "de",
        count: 12, seen: emptySeen(), uebungsZeilen: 2,
      });
      for (const l of lines)
        if (l.uebung && !l.uebung.includes("⇧")) woerter.push(...l.text.split(/\s+/));
    }
    expect(woerter.length).toBeGreaterThan(50);
    const stumm = woerter.filter((w) => !/[aeiouäöü]/i.test(w));
    const klumpen = woerter.filter((w) => /[^aeiouäöü\s]{3,}/i.test(w));
    // Einzelne Ausreisser sind erlaubt (nach 8 Versuchen wird genommen, was da
    // ist) - aber es dürfen nicht viele sein.
    expect(stumm.length / woerter.length).toBeLessThan(0.05);
    expect(klumpen.length / woerter.length).toBeLessThan(0.05);
  });

  it("ohne Übungszeilen bleibt die Runde wie bisher", () => {
    const lines = adaptiveRound({ lernweg: "de",
      introduced: intro, focus: ["m"], stufe: "teens", lang: "de",
      count: 12, seen: emptySeen(),
    });
    expect(lines.every((l) => !l.uebung)).toBe(true);
  });
});

describe("Rückmeldung", () => {
  const intro = [...INTRO];
  it("nennt eine Handlung, keinen Tastennamen", () => {
    const r = rueckmeldungFuer({ introduced: intro, letters: alle(4), lernweg: "de", m, rundenOhneTaste: 5 });
    expect(r.satz).toBeTruthy();
    // Kein einzelner Tastenname als Vorwurf - das Kind kann „q" nicht üben,
    // indem es sich mehr Mühe gibt; der Buchstabe kommt schlicht nicht vor.
    // (Geprüft wird auf den Buchstaben ALS WORT, damit „die nächste Taste
    // schneller" nicht fälschlich als „Taste s" durchgeht.)
    for (const c of intro) expect(r.satz).not.toMatch(new RegExp(`Taste ${c}\\b`));
    expect(r.satz).toMatch(/ruhiger|Zeit|nah dran/);
  });
  it("rät einem schnellen, ungenauen Kind zur Ruhe (Janos Fall)", () => {
    const r = rueckmeldungFuer({ introduced: intro, letters: alle(4), lernweg: "de", m, rundenOhneTaste: 5 });
    expect(r.satz).toContain("ruhiger");
  });
  it("lässt ein langsames, genaues Kind ganz in Ruhe", () => {
    // WICHTIG und leicht zu übersehen: Die Geduld-Regel (patienceSamples) macht
    // eine treffsichere Taste zu „sitzt", auch wenn sie langsam ist. Ein
    // langsames, genaues Kind hat deshalb GAR KEINE offene Baustelle - und
    // bekommt folglich weder einen Tempo-Rat noch sonst eine Ermahnung.
    const langsam = Object.fromEntries(
      intro.map((c) => [c, fenster(1, 2000)]),
    ) as Record<string, LetterStat>;
    const r = rueckmeldungFuer({ introduced: intro, letters: langsam, lernweg: "de", m, rundenOhneTaste: 5 });
    expect(r.offen).toBe(0);
    expect(r.satz).toBeNull();
  });

  it("rät zur Ruhe nur, wenn das Tempo wirklich reicht", () => {
    // Gegenprobe: dasselbe Kind, aber langsam UND ungenau - dann darf „ruhiger"
    // nicht kommen, das triebe es noch weiter in die Langsamkeit.
    const zaeh = Object.fromEntries(
      intro.map((c) => [c, fenster(4, 3000)]),
    ) as Record<string, LetterStat>;
    const r = rueckmeldungFuer({ introduced: intro, letters: zaeh, lernweg: "de", m, rundenOhneTaste: 5 });
    expect(r.satz).not.toContain("ruhiger");
  });
  it("schweigt, wenn gerade eine Taste dazukam", () => {
    const r = rueckmeldungFuer({
      introduced: intro, letters: alle(4), lernweg: "de", m, rundenOhneTaste: 0, freigeschaltet: true,
    });
    expect(r.satz).toBeNull();
  });
  it("erklärt die Pseudowörter, bevor sie kommen", () => {
    expect(pseudoErklaerung(0)).toBeNull();
    expect(pseudoErklaerung(1)).toContain("eine Zeile");
    expect(pseudoErklaerung(3)).toContain("die es gar nicht gibt");
  });
  it("nur Bindestriche, keine Gedankenstriche (Braillezeile)", () => {
    const texte = [
      rueckmeldungFuer({ introduced: intro, letters: alle(4), lernweg: "de", m, rundenOhneTaste: 5 }).satz,
      rueckmeldungFuer({ introduced: intro, letters: alle(1), lernweg: "de", m, rundenOhneTaste: 5 }).satz,
      pseudoErklaerung(2),
    ];
    for (const t of texte) if (t) expect(t).not.toMatch(/[–—]/);
  });
});

describe("Umschalttaste erbt keine fremden Fehler", () => {
  it("zählt einen ⇧-Fehler nur, wenn klein statt gross getippt wurde", () => {
    const s = readFileSync("src/components/typing/TypingSession.tsx", "utf8");
    expect(s).toContain("const umschaltVergessen =");
    // G2b-1 (02.10.2026): klein in der Sprache der Übung (türkisch „I“ ⇒ „ı“), für de/en/fr/es = `toLowerCase()`.
    expect(s).toContain("typed === kleinFuer(want, vorleseLang)");
    // Der alte, pauschale Griff darf nicht zurückkommen.
    expect(s).not.toMatch(
      /lineEvents\.current\.push\(\{ char: want\.toLowerCase\(\), correct: false \}\);\s*\n\s*if \(shiftLearned && needsShift\(want\)\)/,
    );
  });
});
