/**
 * ★★★★ WÄCHTER: die Lektionen des Weges „ro" (F4-RO, 29.10.2026). Modell: `tests/tastenflow-lektionen-hu.test.ts`.
 * Geprüft auf BEIDEN Pflicht-Tastaturen (`ro` Standard, `ro-prog` Programmers), die Reihenfolge-Regel zusätzlich auf fremden Tastaturen:
 *
 *  1. Die Tasten aller Lektionen hintereinander SIND `introOrder("ro")`; die erste Lektion bringt die Heimzeichen (Falle 41).
 *     Auf `ro-prog` (achte Heimtaste `;`) kommt `ș` mit `ă` in dieselbe Lektion (Bauplan R2).
 *  2. Eigene Lektionen für Shift, `. , - ?`, die Buchstaben mit Zeichen, die Ziffern, die Symbole.
 *  3. Jede Lektion hat an ihrer Stelle tippbare Übungszeilen.
 *  4. Hausregeln: kein Maus-Wort, keine Höflichkeitsform, keine Cedille (ş ţ), kein Gedankenstrich, nie „orb"/„tastare oarbă",
 *     „rând" nie für die Tastenreihe, keine fremden Lehrgangs-Wörter.
 *  5. Jedes Beispielwort (zwischen „…”) ist an der Stelle seiner Lektion tippbar - auf beiden Tastaturen.
 *  6. Die Griffe sind aus den Daten der Tastatur gerechnet (eigene Taste gegen Alt Gr).
 *
 * ⚠️ Die Übungszeilen kommen bis zum Wortschatz (Etappe D) aus dem englischen Rückfall (`WORDS_RO` leer) - der Wächter „keine
 * fremden Wörter in den Zeilen" (cs §4) gehört darum zur Etappe D, nicht hierher.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  introducedThroughLesson,
  lektionenFuer,
  lessonById,
  lessonIntroText,
  shiftUnlockedAt,
  unlockedKeysAt,
  unlockedKeysWith,
  type Lesson,
} from "../src/lib/typing/curriculum";
import { RO_LEKTIONS_IDS, roLektionsVorspannFuer } from "../src/lib/typing/curriculumRo";
import { fitText } from "../src/lib/typing/corpus";
import { generateRound } from "../src/lib/typing/generator";
import { heimZeichenDesWeges } from "../src/lib/typing/heimtasten";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { halbePaareIn, halbesPaar } from "./helfer/paareNeueWege";
import { lernwegDef } from "../src/lib/typing/lernweg";

const RO_TASTATUREN: readonly LayoutId[] = ["ro", "ro-prog"];

afterEach(() => setLayout("de"));

function einheiten(l: Lesson): string[] {
  return l.enablesShift ? [SHIFT_UNIT, ...l.newKeys] : [...l.newKeys];
}

function folgtDerReihenfolge(lektionen: readonly Lesson[], reihenfolge: readonly string[]): string[] {
  const fehler: string[] = [];
  let i = 0;
  for (const l of lektionen)
    for (const u of einheiten(l)) {
      if (reihenfolge[i] !== u) fehler.push(`${l.id}: „${u}" an Stelle ${i + 1}, dran wäre „${reihenfolge[i]}"`);
      i += 1;
    }
  if (i !== reihenfolge.length) fehler.push(`${i} Einheiten in den Lektionen, ${reihenfolge.length} in der Reihenfolge`);
  return fehler;
}

/** Ist das Wort mit diesem Tastenstand tippbar? Jeder Buchstabe mit Zeichen ist eine eigene Einheit; ein Grossbuchstabe braucht Shift. */
function wortTippbar(wort: string, stand: ReadonlySet<string>): boolean {
  for (const ch of wort) {
    if (ch === " ") continue;
    const c = ch.toLocaleLowerCase("ro");
    if (ch !== c && !stand.has(SHIFT_UNIT)) return false;
    if (!stand.has(c)) return false;
  }
  return true;
}

/** Die Beispielwörter zwischen „…” - nur solche mit Buchstaben. */
function beispielWoerter(text: string): string[] {
  return [...text.matchAll(/„([^”]+)”/g)].map((m) => m[1]).filter((w) => /\p{L}/u.test(w));
}

const bis = (id: string): Set<string> => {
  const s = new Set(unlockedKeysAt(id));
  if (shiftUnlockedAt(id)) s.add(SHIFT_UNIT);
  return s;
};

describe("★★★★ Die Lektionen folgen der Reihenfolge des Weges „ro“ - auf jeder Tastatur", () => {
  for (const t of [...RO_TASTATUREN, "de", "us"] as const) {
    it(`${t}: die Tasten aller Lektionen hintereinander sind introOrder("ro")`, () => {
      setLayout(t);
      expect(folgtDerReihenfolge(lektionenFuer("ro"), introOrder("ro"))).toEqual([]);
    });
  }

  it("Gegenprobe: eine Lektion, die eine spätere Taste vorwegnimmt, wird gefunden", () => {
    setLayout("ro");
    const falsch = lektionenFuer("ro").map((l) => (l.id === "ro-frecvente-1" ? { ...l, newKeys: ["e", "t"] } : l));
    expect(folgtDerReihenfolge(falsch, introOrder("ro")).length).toBeGreaterThan(0);
  });

  it("21 Lektionen auf jeder Tastatur, IDs mit „ro-“, eindeutig, gecacht; keine ID wie eine Tastatur (`ro-prog`)", () => {
    expect(RO_LEKTIONS_IDS).toHaveLength(21);
    expect(new Set(RO_LEKTIONS_IDS).size).toBe(21);
    for (const id of RO_LEKTIONS_IDS) expect(id.startsWith("ro-"), id).toBe(true);
    expect(RO_LEKTIONS_IDS).not.toContain("ro-prog");
    for (const t of RO_TASTATUREN) {
      setLayout(t);
      expect(lektionenFuer("ro").map((l) => l.id), t).toEqual([...RO_LEKTIONS_IDS]);
      expect(lektionenFuer("ro")).toBe(lektionenFuer("ro"));
    }
  });

  it("★ Falle 41: die erste Lektion bringt die Heimzeichen der Haupttastatur; es sind keine englischen Lektionen mehr", () => {
    setLayout("ro");
    expect(lektionenFuer("ro")[0].newKeys).toEqual([...heimZeichenDesWeges("ro")]);
    expect(lektionenFuer("ro")[0].id).toBe("ro-baza-1");
    expect(lektionenFuer("ro").some((l) => l.id.startsWith("en-"))).toBe(false);
  });

  it("★ Bauplan R2: auf `ro` ist ș die achte Heimtaste, auf `ro-prog` die `;` - und ș kommt dort mit ă (erste Alt-Gr-Lektion)", () => {
    setLayout("ro");
    expect(lessonById("ro-baza-4")?.newKeys).toEqual(["a", "ș"]);
    expect(lessonById("ro-frecvente-5")?.newKeys).toEqual(["m", "ă", "p"]);
    expect(lessonById("ro-punctuatie-2")?.newKeys).toContain(";");
    setLayout("ro-prog");
    expect(lessonById("ro-baza-4")?.newKeys).toEqual(["a", ";"]);
    expect(lessonById("ro-frecvente-5")?.newKeys).toEqual(["m", "ă", "ș", "p"]);
    expect(lessonById("ro-punctuatie-2")?.newKeys).not.toContain(";");
  });

  it("eigene Lektionen: Shift, . , - ?, Buchstaben mit Zeichen, Ziffern, Symbole", () => {
    setLayout("ro");
    expect(lessonById("ro-majuscule")?.enablesShift).toBe(true);
    expect(lessonById("ro-punctuatie-1")?.newKeys).toEqual([".", ",", "-", "?"]);
    expect(lessonById("ro-litere-2")?.newKeys).toEqual(["î", "ț"]);
    expect(lessonById("ro-litere-4")?.newKeys).toEqual(["â", "h"]);
    expect(lessonById("ro-cifre")?.newKeys.join("")).toBe("1234567890");
    expect(lessonById("ro-punctuatie-2")?.newKeys).toEqual(["!", ":", "„", "”", ";", "'", "(", ")"]);
    expect(shiftUnlockedAt("ro-frecvente-5")).toBe(false);
    expect(shiftUnlockedAt("ro-majuscule")).toBe(true);
    for (const t of RO_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("ro")) expect(new Set(unlockedKeysWith(l.id, undefined, "ro"))).toEqual(new Set(unlockedKeysAt(l.id)));
    }
  });
});

describe("★★★ Jede Lektion hat an ihrer Stelle tippbare Übungszeilen", () => {
  for (const t of RO_TASTATUREN) {
    it(`${t}: eine Runde je Lektion und Altersstufe, jede Zeile passt zum Tastenstand`, () => {
      setLayout(t);
      const fehler: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer("ro")) {
        stand = introducedThroughLesson(stand, l.id, "ro");
        const erlaubt = new Set(unlockedKeysWith(l.id, stand, "ro").filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens", "erwachsen"] as const) {
          const runde = generateRound(l.id, { lernweg: "ro", lang: "ro", introduced: stand, stufe, count: 10 });
          if (runde.length === 0) fehler.push(`${l.id}/${stufe}: keine Zeile`);
          for (const z of runde) {
            if (!z.text.trim() || fitText(z.text, erlaubt, "ro") === null) fehler.push(`${l.id}/${stufe}: „${z.text}"`);
          }
        }
      }
      expect(fehler).toEqual([]);
    }, 120_000);
  }
});

// ★★★ GEN-HAUPTSPRACHE (29.10.2026): scharf geschaltet - die paarfesten Vorlagen (`generator.ts#MIT_ZEICHENVORLAGEN`) kennen „ro“.
// Die Paare sind die des Weges (`paareGemeinsam`, lernweg.ts) und `"` (eine Taste für beide Seiten). Helfer: `tests/helfer/paareNeueWege.ts`.
describe("★★★ Klammern und Anführungszeichen immer als Paar - auf dem Weg durch die Lektionen", () => {
  for (const t of RO_TASTATUREN) {
    it(`${t}: keine Übungszeile irgendeiner Lektion trägt ein halbes Paar`, () => {
      expect(halbePaareIn("ro", t)).toEqual([]);
    }, 120_000);
  }
  it("Gegenprobe: halbe Paare fallen auf, ein ganzes nicht", () => {
    const paare = lernwegDef("ro").paareGemeinsam ?? {};
    expect(["Putea” dura","„casă","(casă","„casă” (și)"].filter((z) => halbesPaar(z, paare))).toEqual(["Putea” dura","„casă","(casă"]);
  });
});

describe("★★★ Hausregeln in Titeln und Einführungen", () => {
  const NIE = new Set(["und", "der", "die", "the", "and", "key", "press", "touche", "tecla", "tasto", "klávesa", "billentyű"]);
  const MUSTER: readonly (readonly [RegExp, string])[] = [
    [/[–—]/, "Gedankenstrich"],
    [/clic|click|mouse|atinge|trage/i, "Maus"],
    [/apăsați|dumneavoastră|dvs\.|selectați|încercați/i, "Höflichkeitsform statt „tu“"],
    [/[şţŞŢ]/, "Cedille statt Komma"],
    [/(?<!\p{L})(orb|oarbă|orbi|handicapat)(?!\p{L})|tastare oarbă/iu, "„orb“ für das Zehnfingersystem oder die Person"],
    [/(?<!\p{L})rând(ul)?(?!\p{L})/iu, "„rând“ für die Tastenreihe (Glossar Falle 3)"],
    [/(?<!\p{L})(ești|ai fost) \p{L}+(at|ată|it|ită)(?!\p{L})|campion|câștigător|începător/iu, "Geschlecht am Kind"],
  ];

  it("beide Tastaturen: kein Maus-Wort, keine Höflichkeitsform, keine Cedille, kein Gedankenstrich, keine fremden Wörter", () => {
    const funde: string[] = [];
    for (const t of RO_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("ro"))
        for (const [feld, text] of [["title", l.title], ["intro", l.intro]] as const) {
          for (const [m, was] of MUSTER) if (m.test(text)) funde.push(`${t} ${l.id} ${feld}: ${was}`);
          for (const w of text.split(/[^\p{L}]+/u).filter(Boolean)) if (NIE.has(w.toLowerCase())) funde.push(`${t} ${l.id} ${feld}: ${w}`);
        }
    }
    expect(funde).toEqual([]);
  });

  it("Gegenprobe: die Muster schlagen an", () => {
    const treffer = (s: string) => MUSTER.filter(([m]) => m.test(s)).map(([, was]) => was);
    expect(treffer("Faceți clic pe buton")).toContain("Maus");
    expect(treffer("Apăsați tasta Enter")).toContain("Höflichkeitsform statt „tu“");
    expect(treffer("şir")).toContain("Cedille statt Komma");
    expect(treffer("Rândul de bază")).toContain("„rând“ für die Tastenreihe (Glossar Falle 3)");
    expect(treffer("Ești pregătit?")).toContain("Geschlecht am Kind");
    expect(treffer("a – b")).toContain("Gedankenstrich");
    expect(treffer("șirul de bază, poziția de bază")).toEqual([]);
  });
});

describe("★★★ Jedes Beispielwort einer Einführung ist an seiner Stelle tippbar", () => {
  it("es gibt Beispielwörter (sonst prüft der Wächter nichts)", () => {
    setLayout("ro");
    expect(lektionenFuer("ro").flatMap((l) => beispielWoerter(roLektionsVorspannFuer(l.id, l.newKeys))).length).toBeGreaterThan(70);
  });

  for (const t of RO_TASTATUREN) {
    it(`${t}: jedes Wort zwischen „…” passt zum Tastenstand der Lektion`, () => {
      setLayout(t);
      const fehler: string[] = [];
      for (const l of lektionenFuer("ro"))
        for (const w of beispielWoerter(roLektionsVorspannFuer(l.id, l.newKeys))) if (!wortTippbar(w, bis(l.id))) fehler.push(`${l.id}: „${w}”`);
      expect(fehler).toEqual([]);
    });
  }

  it("Gegenprobe: ein Wort mit einer späteren Taste, ș vor seiner Lektion auf `ro-prog` und ein Grossbuchstabe vor Shift fallen auf", () => {
    setLayout("ro");
    expect(wortTippbar("țară", bis("ro-litere-1"))).toBe(false);
    expect(wortTippbar("țară", bis("ro-litere-2"))).toBe(true);
    expect(wortTippbar("șal", bis("ro-baza-4"))).toBe(true);
    expect(wortTippbar("Ana", bis("ro-frecvente-5"))).toBe(false);
    expect(wortTippbar("Ana", bis("ro-majuscule"))).toBe(true);
    setLayout("ro-prog");
    expect(wortTippbar("șal", bis("ro-baza-4"))).toBe(false);
    expect(wortTippbar("școală", bis("ro-frecvente-5"))).toBe(true);
  });
});

describe("★★ Griffe je Tastatur (gerechnet, nicht geschrieben)", () => {
  it("ă: auf `ro` eigene Taste neben dem P, auf `ro-prog` Alt Gr + A - die Texte unterscheiden sich", () => {
    setLayout("ro");
    const standard = lessonById("ro-frecvente-5")!;
    setLayout("ro-prog");
    const prog = lessonById("ro-frecvente-5")!;
    expect(standard.intro).toMatch(/Ă \(a cu căciulă\): degetul mic drept, șirul de sus/);
    expect(prog.intro).toMatch(/Ă \(a cu căciulă\): ține apăsată tasta Alt Gr și apasă tasta A/);
    expect(lessonIntroText(standard, "ro-prog")).toBe(prog.intro);
  });

  it("ș auf `ro`: die achte Heimtaste, rechter kleiner Finger", () => {
    setLayout("ro");
    expect(lessonById("ro-baza-4")!.intro).toMatch(/Ș \(s cu virgulă\): degetul mic drept, poziția de bază/);
  });

  it("Shift: auf `ro` die grossen Buchstaben mit Zeichen mit der linken Shift, auf `ro-prog` später (Alt Gr + Shift)", () => {
    setLayout("ro");
    expect(lessonById("ro-majuscule")!.intro).toMatch(/cu tasta Shift din stânga/);
    setLayout("ro-prog");
    expect(lessonById("ro-majuscule")!.intro).toMatch(/au nevoie de Alt Gr și de Shift deodată/);
  });

  it("Satz- und Sonderzeichen: der Name vor dem Zeichen, Shift bzw. Alt Gr aus den Daten", () => {
    setLayout("ro");
    expect(lessonById("ro-punctuatie-1")!.intro).toMatch(/semnul întrebării \(\?\): ține apăsată tasta Shift cu cealaltă mână și apasă tasta \//);
    expect(lessonById("ro-punctuatie-2")!.intro).toMatch(/apostrof \('\): ține apăsată tasta Alt Gr și apasă tasta Ț/);
    expect(lessonById("ro-simboluri-2")!.intro).toMatch(/euro \(€\): ține apăsată tasta Alt Gr și apasă tasta E/);
  });
});
