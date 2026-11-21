/**
 * Tastatur-Layouts (28.07.2026): deutsche/österreichische, Schweizer,
 * amerikanische und britische Tastatur.
 *
 * Geprüft wird gegen REGELN, nicht gegen Hand-Listen (Regel 12 aus dem
 * Text-Nachschub-Durchgang): jede Taste jedes Layouts muss einen Finger haben,
 * jedes über eine Zusatztaste erreichbare Zeichen eine Grundtaste, die es in
 * diesem Layout wirklich gibt, und fehlende Zeichen dürfen nirgends mehr
 * auftauchen — weder in der Freischaltung noch in servierten Texten.
 */
import { describe, it, expect, afterEach } from "vitest";
import type { Lesson } from "../src/lib/typing";
import {
  FINGERS,
  INTRO_ORDER,
  LAYOUTS,
  LESSONS,
  activeLayout,
  baseKeyForChar,
  charAccess,
  emptyProgress,
  ensureIntroduced,
  fingerForChar,
  fingerGuide,
  fitText,
  introOrder,
  introducedThroughLesson,
  startpunktEinheiten,
  keyExists,
  layoutById,
  lessonNewKeys,
  lessonOpen,
  lessonSkipped,
  lessonsDoneCount,
  needsShift,
  nextLetter,
  setLayout,
  setzeLayoutPlattform,
  shiftHandFor,
  startPoints,
  toLayoutText,
  unlockedKeysAt,
} from "../src/lib/typing";

/**
 * Die Lektionen, die auf dieser Tastatur überhaupt vorkommen.
 *
 * ★ E7 (19.09.2026): Bis dahin stand das als `lessonsForLayout` in
 * `curriculum.ts` - ohne die Übungsart „Lektionen" (`TypingTrainer.tsx`) hatte
 * die Funktion keinen Aufrufer in `src/` mehr, nur noch diesen Test. Die eine
 * Zeile lebt darum lokal weiter - die REGEL (Layout-Skip, siehe
 * `lessonSkipped`) bleibt geprüft, ohne dass die Produktion einen toten Export
 * mitschleppt.
 */
function lessonsForLayout(): Lesson[] {
  return LESSONS.filter((l) => !lessonSkipped(l));
}

/** Alle Buchstaben/Ziffern/Zeichen, die ein Layout überhaupt hergibt. */
function allChars(layoutId: string): Set<string> {
  const layout = layoutById(layoutId);
  const out = new Set<string>();
  for (const row of layout.rows) for (const k of row.keys) out.add(k);
  for (const ch of Object.keys(layout.access)) out.add(ch);
  return out;
}

// Das Layout ist ein geräte-weiter Zustand — nach jedem Test zurück auf Deutsch,
// sonst tropft eine Umstellung in die folgenden Tests.
afterEach(() => setLayout("de"));

describe("Layout-Modell", () => {
  it("kennt achtzehn Tastaturen (fünf französische, zwei spanische, zwei italienische, eine polnische, zwei türkische, zwei tschechische), deutsch ist der Standard", () => {
    // ★ E3/ES-F3 (25./27.09.2026): `LAYOUTS` ist die VOLLE Liste (für
    // `layoutById` und Tests) - was davon SICHTBAR ist, prüft
    // `sichtbareLayouts()` unten. ★ F3-it (02.10.2026): + `it`, `it-qzerty`. ★ F3-pl: + `pl`. ★ F3-tr: + `tr-q`, `tr-f`. ★ F3-cs: + `cs`, `cs-qwerty`.
    expect(LAYOUTS.map((l) => l.id)).toEqual([
      "de", "ch", "us", "uk", "fr", "be", "ch-fr", "ca-csa", "ca-fr", "es", "latam", "it", "it-qzerty", "pl",
      "tr-q", "tr-f", "cs", "cs-qwerty",
      // ★ G3b (25.10.2026): die Tastaturen der neun neuen Sprachen
      "bg", "bg-schreibm", "bg-phon", "bg-phon-trad",
      "el", "el-220", "el-319",
      "hu", "hu-101",
      "nl-intl", "nl-dutch",
      "pt", "br-abnt2",
      "ro", "ro-prog",
      "sv",
      "ua", "ua-std",
    ]);
    expect(activeLayout().id).toBe("de");
  });

  it("gibt JEDER Taste jedes Layouts genau einen Finger", () => {
    for (const layout of LAYOUTS) {
      setLayout(layout.id);
      for (const row of layout.rows) {
        for (const key of row.keys) {
          const f = fingerForChar(key);
          expect(f, `${layout.id}: Taste ${key} ohne Finger`).not.toBeNull();
          expect(Object.keys(FINGERS)).toContain(f!.id);
        }
      }
    }
  });

  it("legt die Grundstellung in allen Layouts auf dieselben acht Finger", () => {
    for (const layout of LAYOUTS) {
      setLayout(layout.id);
      // Die Tasthöcker liegen überall auf F und J — der Anker für blinde Lernende.
      // ★ F3-tr: ausser auf türkisch F - dort sind es die Tasten `a` und `k` (dieselbe STELLE, anderer Buchstabe);
      // die Tastatur nennt ihre Heimtasten selbst (`heimtasten`: kleiner, Ring, Mittel, Zeige links, Zeige, Mittel,
      // Ring, kleiner rechts). Alle anderen Tastaturen: unverändert F, J, A, L.
      if (layout.heimtasten) {
        const [kl, , , zl, zr, , rr] = layout.heimtasten;
        expect(fingerForChar(zl)!.id, layout.id).toBe("zeige-links");
        expect(fingerForChar(zr)!.id, layout.id).toBe("zeige-rechts");
        expect(fingerForChar(kl)!.id, layout.id).toBe("kleiner-links");
        expect(fingerForChar(rr)!.id, layout.id).toBe("ring-rechts");
        continue;
      }
      expect(fingerForChar("f")!.id).toBe("zeige-links");
      expect(fingerForChar("j")!.id).toBe("zeige-rechts");
      expect(fingerForChar("a")!.id).toBe("kleiner-links");
      expect(fingerForChar("l")!.id).toBe("ring-rechts");
    }
  });

  it("verweist mit jedem Zusatztasten-Zeichen auf eine Taste, die es dort gibt", () => {
    for (const layout of LAYOUTS) {
      setLayout(layout.id);
      const keys = new Set(layout.rows.flatMap((r) => [...r.keys]));
      for (const [ch, acc] of Object.entries(layout.access)) {
        expect(keys.has(acc.base), `${layout.id}: ${ch} zeigt auf fehlende Taste ${acc.base}`)
          .toBe(true);
        expect(baseKeyForChar(ch)).toBe(acc.base);
      }
    }
  });

  it("kennt in keinem Layout ein Zeichen, das zugleich fehlt und erreichbar ist", () => {
    for (const layout of LAYOUTS) {
      setLayout(layout.id);
      for (const ch of layout.missing) {
        expect(keyExists(ch), `${layout.id}: ${ch} gilt als fehlend`).toBe(false);
        expect(allChars(layout.id).has(ch), `${layout.id}: ${ch} liegt trotzdem auf einer Taste`)
          .toBe(false);
      }
    }
  });
});

describe("Deutsch (unverändert)", () => {
  it("belegt Sonderzeichen wie bisher", () => {
    expect(charAccess("!")).toEqual({ base: "1", mod: "shift" });
    expect(charAccess("@")).toEqual({ base: "q", mod: "altgr" });
    expect(charAccess("?")).toEqual({ base: "ß", mod: "shift" });
    expect(fingerForChar("ö")!.id).toBe("kleiner-rechts");
    expect(fingerForChar("z")!.id).toBe("zeige-rechts"); // QWERTZ
    expect(fingerForChar("y")!.id).toBe("kleiner-links");
  });

  it("lässt Einführungsreihenfolge und Texte unangetastet", () => {
    expect(introOrder("de")).toEqual(INTRO_ORDER);
    expect(toLayoutText("Die Straße für Bärbel.")).toBe("Die Straße für Bärbel.");
    expect(lessonsForLayout().length).toBe(LESSONS.length);
  });
});

describe("Schweizer Tastatur", () => {
  it("hat kein ß und schreibt es als ss", () => {
    setLayout("ch");
    expect(keyExists("ß")).toBe(false);
    expect(toLayoutText("Die Straße misst 30 Fuß.")).toBe("Die Strasse misst 30 Fuss.");
    expect(introOrder("de")).not.toContain("ß");
    expect(ensureIntroduced([...INTRO_ORDER], "de")).not.toContain("ß");
    expect(nextLetter(introOrder("de").slice(0, introOrder("de").length - 1), "de")).not.toBe("ß");
  });

  it("behält Umlaute — sie liegen dort auf denselben Tasten", () => {
    setLayout("ch");
    expect(keyExists("ä")).toBe(true);
    expect(fingerForChar("ä")!.id).toBe("kleiner-rechts");
    expect(fingerForChar("ö")!.id).toBe("kleiner-rechts");
  });

  it("★ W1: Ä Ö Ü kommen unter Windows über die Totaste ¨, dann Umschalt - nicht über die Feststelltaste", () => {
    // ★ W1 (27.09.2026, BEFUND-2026-09-27-WINDOWS-MESSUNG §3.2): Windows KBDSG
    // gibt mit Feststell + ä ein „ä" - der alte Weg „Feststelltaste" stimmte
    // dort nicht. Der Windows-Weg: ¨ (rechts neben ü), dann Umschalt + A - die
    // Umschalttaste gegen die Hand des BUCHSTABENS (A links ⇒ rechte Umschalt).
    setzeLayoutPlattform("windows");
    setLayout("ch");
    expect(needsShift("Ä")).toBe(true);
    expect(shiftHandFor("Ä")).toBe("rechts");
    expect(shiftHandFor("Ü")).toBe("links");
    expect(needsShift("A")).toBe(true);
    // Am Mac bleibt die Feststelltaste der beschriebene Weg (nicht neu gemessen).
    setzeLayoutPlattform("mac");
    expect(needsShift("Ä")).toBe(false);
    expect(fingerGuide("Ä", false, "de")).toContain("Feststelltaste");
    setzeLayoutPlattform(null);
  });

  it("legt @ und die Klammern anders als die deutsche Tastatur", () => {
    setLayout("ch");
    expect(charAccess("@")).toEqual({ base: "2", mod: "altgr" });
    expect(charAccess("#")).toEqual({ base: "3", mod: "altgr" });
    expect(charAccess("[")).toEqual({ base: "ü", mod: "altgr" });
    // Apostroph ist eine eigene Taste (wichtig für englische Kontraktionen).
    expect(charAccess("'")).toEqual({ base: "'" });
    expect(needsShift("'")).toBe(false);
  });

  it("überspringt die ß-Lektion, ohne den Lehrgang zu blockieren", () => {
    setLayout("ch");
    const sz = LESSONS.find((l) => l.id === "scharfes-s")!;
    expect(lessonSkipped(sz)).toBe(true);
    expect(lessonsForLayout().map((l) => l.id)).not.toContain("scharfes-s");
    expect(lessonsForLayout().length).toBe(LESSONS.length - 1);
    // Die Umlaut-Lektion bleibt — ä und ü gibt es auf der Schweizer Tastatur.
    expect(lessonNewKeys(LESSONS.find((l) => l.id === "umlaut-aeue")!)).toEqual(["ä", "ü"]);
    expect(unlockedKeysAt("satzzeichen")).not.toContain("ß");

    // Die übersprungene Lektion darf die FOLGENDE nicht sperren: Wer die
    // Umlaut-Lektion (davor) abgeschlossen hat, kommt zu den Satzzeichen.
    const p = {
      ...emptyProgress(),
      lessons: { "umlaut-aeue": { completed: true, bestStars: 3, bestCpm: 120, attempts: 1 } },
    };
    expect(lessonOpen(p, "satzzeichen")).toBe(true);
    // …und das Abzeichen „alle Lektionen" bleibt erreichbar, weil die
    // übersprungene Lektion als geschafft zählt.
    expect(lessonsDoneCount(p, "de")).toBe(2);
  });
});

describe("Englische Tastaturen", () => {
  it("kennt weder Umlaute noch ß und schreibt sie ersatzweise", () => {
    for (const id of ["us", "uk"]) {
      setLayout(id);
      for (const ch of ["ä", "ö", "ü", "ß"]) expect(keyExists(ch)).toBe(false);
      expect(toLayoutText("Bär, Öl, Übung, Straße")).toBe("Baer, Oel, Uebung, Strasse");
      expect(introOrder("de")).not.toContain("ä");
      expect(lessonsForLayout().map((l) => l.id)).not.toContain("umlaut-aeue");
      expect(lessonsForLayout().map((l) => l.id)).not.toContain("scharfes-s");
    }
  });

  it("liegt QWERTY statt QWERTZ", () => {
    setLayout("us");
    expect(fingerForChar("y")!.id).toBe("zeige-rechts");
    expect(fingerForChar("z")!.id).toBe("kleiner-links");
    expect(fingerForChar(";")!.id).toBe("kleiner-rechts"); // rechter Grundstellungs-Platz
  });

  it("unterscheidet amerikanische und britische Belegung", () => {
    setLayout("us");
    expect(charAccess("@")).toEqual({ base: "2", mod: "shift" });
    expect(charAccess('"')).toEqual({ base: "'", mod: "shift" });
    expect(keyExists("€")).toBe(false);
    setLayout("uk");
    expect(charAccess("@")).toEqual({ base: "'", mod: "shift" });
    expect(charAccess('"')).toEqual({ base: "2", mod: "shift" });
    expect(charAccess("€")).toEqual({ base: "4", mod: "altgr" });
  });

  it("serviert deutsche Texte in der Ersatzschreibweise, wenn die Tasten dafür da sind", () => {
    setLayout("us");
    const alles = new Set([..."abcdefghijklmnopqrstuvwxyz", ".", ",", "-"]);
    expect(fitText("Der Bär läuft über die Straße.", alles)).toBe(
      "Der Baer laeuft ueber die Strasse.",
    );
    // Ohne die nötigen Ersatz-Buchstaben passt der Text weiterhin nicht.
    expect(fitText("Bär", new Set(["b", "a", "r"]))).toBeNull();
  });
});

describe("Brücke Lehrgang → Mein Training", () => {
  it("schleust keine fehlende Taste in den Lernstand zurück", () => {
    setLayout("ch");
    // Der Lehrgang schaltet bis „Satzzeichen" alles frei — nur eben kein ß.
    const nach = introducedThroughLesson(undefined, "satzzeichen", "de");
    expect(nach).not.toContain("ß");
    expect(nach).toContain("ä");
    setLayout("us");
    const nachUs = introducedThroughLesson(undefined, "satzzeichen", "de");
    for (const ch of ["ä", "ö", "ü", "ß"]) expect(nachUs).not.toContain(ch);
  });
});

describe("Startpunkte", () => {
  it("zählt Startpunkte in den Einheiten der jeweiligen Tastatur", () => {
    setLayout("de");
    const de = startPoints("de", "de");
    setLayout("us");
    const us = startPoints("de", "de");
    for (const key of ["start", "buchstaben", "alles"]) {
      const a = de.find((s) => s.key === key)!;
      const b = us.find((s) => s.key === key)!;
      expect(b.units, `${key} muss auf US kleiner sein`).toBeLessThan(a.units);
    }
    // „Alle Buchstaben" darf auch auf der US-Tastatur kein Satzzeichen enthalten.
    const buchstaben = us.find((s) => s.key === "buchstaben")!;
    const set = startpunktEinheiten(buchstaben.units, "de"); // ★ D-1: Startpunkt-Zählung
    expect(set).not.toContain(".");
    expect(set).toContain("q");
    expect(set).not.toContain("ä");
  });

  it("nennt in der Grundstellung die Tasten, die es dort wirklich gibt", () => {
    setLayout("de");
    expect(startPoints("de", "de").find((s) => s.key === "start")!.label).toContain("ö");
    setLayout("us");
    expect(startPoints("de", "de").find((s) => s.key === "start")!.label).not.toContain("ö");
  });
});
