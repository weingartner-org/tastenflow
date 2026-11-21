/**
 * ★★★★ WÄCHTER: die Lektionen des Weges „hu" (F4-HU, 25.10.2026). Modell: `tests/tastenflow-lektionen-cs.test.ts`.
 * Geprüft auf BEIDEN Pflicht-Tastaturen (`hu` QWERTZ, `hu-101` QWERTY), die Reihenfolge-Regel zusätzlich auf fremden Tastaturen:
 *
 *  1. Die Tasten aller Lektionen hintereinander SIND `introOrder("hu")`; die erste Lektion bringt die Heimzeichen (Falle 41).
 *  2. Eigene Lektionen für Shift, `. , ?`, die Akzentbuchstaben, die Ziffern (`0` zuerst), die Symbole.
 *  3. Jede Lektion hat an ihrer Stelle tippbare Übungszeilen; Klammern und Anführungszeichen paarweise.
 *  4. Hausregeln: kein Maus-Wort, keine Ön-Form, kein Gedankenstrich, keine fremden Lehrgangs-Wörter.
 *  5. Jedes Beispielwort (zwischen „…”) ist an der Stelle seiner Lektion tippbar.
 *  6. Die Griffe sind aus den Daten der Tastatur gerechnet (QWERTZ gegen QWERTY, 0 = AltGr + í).
 *
 * ⚠️ Die Übungszeilen kommen bis zum Wortschatz (Etappe D) aus dem englischen Rückfall (`WORDS_HU` leer) - der Wächter „keine
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
import { HU_LEKTIONS_IDS, huLektionsVorspannFuer } from "../src/lib/typing/curriculumHu";
import { fitText } from "../src/lib/typing/corpus";
import { generateRound } from "../src/lib/typing/generator";
import { heimZeichenDesWeges } from "../src/lib/typing/heimtasten";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { halbePaareIn, halbesPaar } from "./helfer/paareNeueWege";
import { lernwegDef } from "../src/lib/typing/lernweg";

const HU_TASTATUREN: readonly LayoutId[] = ["hu", "hu-101"];

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

/** Ist das Wort mit diesem Tastenstand tippbar? Jeder Akzentbuchstabe ist eine eigene Einheit; ein Grossbuchstabe braucht Shift. */
function wortTippbar(wort: string, stand: ReadonlySet<string>): boolean {
  for (const ch of wort) {
    if (ch === " ") continue;
    const c = ch.toLocaleLowerCase("hu");
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

describe("★★★★ Die Lektionen folgen der Reihenfolge des Weges „hu“ - auf jeder Tastatur", () => {
  for (const t of [...HU_TASTATUREN, "de", "us"] as const) {
    it(`${t}: die Tasten aller Lektionen hintereinander sind introOrder("hu")`, () => {
      setLayout(t);
      expect(folgtDerReihenfolge(lektionenFuer("hu"), introOrder("hu"))).toEqual([]);
    });
  }

  it("Gegenprobe: eine Lektion, die eine spätere Taste vorwegnimmt, wird gefunden", () => {
    setLayout("hu");
    const falsch = lektionenFuer("hu").map((l) => (l.id === "hu-gyakori-1" ? { ...l, newKeys: ["e", "t"] } : l));
    expect(folgtDerReihenfolge(falsch, introOrder("hu")).length).toBeGreaterThan(0);
  });

  it("22 Lektionen auf jeder Tastatur, IDs mit „hu-“, eindeutig, gecacht; keine ID wie eine Tastatur (`hu-101`)", () => {
    expect(HU_LEKTIONS_IDS).toHaveLength(22);
    expect(new Set(HU_LEKTIONS_IDS).size).toBe(22);
    for (const id of HU_LEKTIONS_IDS) expect(id.startsWith("hu-"), id).toBe(true);
    expect(HU_LEKTIONS_IDS).not.toContain("hu-101");
    for (const t of HU_TASTATUREN) {
      setLayout(t);
      expect(lektionenFuer("hu").map((l) => l.id), t).toEqual([...HU_LEKTIONS_IDS]);
      expect(lektionenFuer("hu")).toBe(lektionenFuer("hu"));
    }
  });

  it("★ Falle 41: die erste Lektion bringt die Heimzeichen der Haupttastatur; es sind keine englischen Lektionen mehr", () => {
    setLayout("hu");
    expect(lektionenFuer("hu")[0].newKeys).toEqual([...heimZeichenDesWeges("hu")]);
    expect(lektionenFuer("hu")[0].id).toBe("hu-alap-1");
    expect(lektionenFuer("hu").some((l) => l.id.startsWith("en-"))).toBe(false);
  });

  it("eigene Lektionen: Shift, . , ?, Akzentbuchstaben, Ziffern (0 zuerst), Symbole", () => {
    setLayout("hu");
    expect(lessonById("hu-nagybetu")?.enablesShift).toBe(true);
    expect(lessonById("hu-irasjel-1")?.newKeys).toEqual([".", ",", "?"]);
    expect(lessonById("hu-alap-4")?.newKeys).toEqual(["a", "é"]);
    expect(lessonById("hu-ekezet-1")?.newKeys).toEqual(["ö", "ó", "ő"]);
    expect(lessonById("hu-ekezet-2")?.newKeys).toEqual(["ü", "í", "ú", "ű"]);
    expect(lessonById("hu-szamok")?.newKeys.join("")).toBe("0123456789");
    expect(lessonById("hu-szimbolum-2")?.newKeys).toEqual(["@", "#", "[", "]", "{", "}", "|", "\\", "€"]);
    expect(shiftUnlockedAt("hu-gyakori-6")).toBe(false);
    expect(shiftUnlockedAt("hu-nagybetu")).toBe(true);
    for (const t of HU_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("hu")) expect(new Set(unlockedKeysWith(l.id, undefined, "hu"))).toEqual(new Set(unlockedKeysAt(l.id)));
    }
  });
});

describe("★★★ Jede Lektion hat an ihrer Stelle tippbare Übungszeilen", () => {
  for (const t of HU_TASTATUREN) {
    it(`${t}: eine Runde je Lektion und Altersstufe, jede Zeile passt zum Tastenstand`, () => {
      setLayout(t);
      const fehler: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer("hu")) {
        stand = introducedThroughLesson(stand, l.id, "hu");
        const erlaubt = new Set(unlockedKeysWith(l.id, stand, "hu").filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens", "erwachsen"] as const) {
          const runde = generateRound(l.id, { lernweg: "hu", lang: "hu", introduced: stand, stufe, count: 10 });
          if (runde.length === 0) fehler.push(`${l.id}/${stufe}: keine Zeile`);
          for (const z of runde) {
            if (!z.text.trim() || fitText(z.text, erlaubt, "hu") === null) fehler.push(`${l.id}/${stufe}: „${z.text}"`);
          }
        }
      }
      expect(fehler).toEqual([]);
    }, 120_000);
  }
});

// ★★★ GEN-HAUPTSPRACHE (29.10.2026): scharf geschaltet - die paarfesten Vorlagen (`generator.ts#MIT_ZEICHENVORLAGEN`) kennen „hu“.
// Die Paare sind die des Weges (`paareGemeinsam`, lernweg.ts) und `"` (eine Taste für beide Seiten). Helfer: `tests/helfer/paareNeueWege.ts`.
describe("★★★ Klammern und Anführungszeichen immer als Paar - auf dem Weg durch die Lektionen", () => {
  for (const t of HU_TASTATUREN) {
    it(`${t}: keine Übungszeile irgendeiner Lektion trägt ein halbes Paar`, () => {
      expect(halbePaareIn("hu", t)).toEqual([]);
    }, 120_000);
  }
  it("Gegenprobe: halbe Paare fallen auf, ein ganzes nicht", () => {
    const paare = lernwegDef("hu").paareGemeinsam ?? {};
    expect(["Talk( rain","(ház","és \"nem","(ház) és \"nem\""].filter((z) => halbesPaar(z, paare))).toEqual(["Talk( rain","(ház","és \"nem"]);
  });
});

describe("★★★ Hausregeln in Titeln und Einführungen", () => {
  it("beide Tastaturen: kein Maus-Wort, keine Ön-Form, kein Gedankenstrich, keine Wörter anderer Lehrgänge", () => {
    const NIE = new Set(["und", "der", "die", "taste", "the", "and", "key", "press", "touche", "tecla", "tasto", "klávesa"]);
    const funde: string[] = [];
    for (const t of HU_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("hu"))
        for (const [feld, text] of [["title", l.title], ["intro", l.intro]] as const) {
          if (/[–—]/.test(text)) funde.push(`${t} ${l.id} ${feld}: Gedankenstrich`);
          if (/kattint|egér|húzd|koppint/i.test(text)) funde.push(`${t} ${l.id} ${feld}: Maus`);
          if (/(?<!\p{L})Ön(nek|t|nel)?(?!\p{L})|nyomja meg|próbálja/u.test(text)) funde.push(`${t} ${l.id} ${feld}: Ön-Form`);
          if (/vakon gépel|vakírás/i.test(text)) funde.push(`${t} ${l.id} ${feld}: „vak“ für das Zehnfingersystem`);
          for (const w of text.split(/[^\p{L}]+/u).filter(Boolean)) if (NIE.has(w.toLowerCase())) funde.push(`${t} ${l.id} ${feld}: ${w}`);
        }
    }
    expect(funde).toEqual([]);
  });

  it("Gegenprobe: die Muster schlagen an", () => {
    expect(/kattint|egér/i.test("Kattints az egérrel")).toBe(true);
    expect(/nyomja meg/i.test("Nyomja meg a gombot")).toBe(true);
    expect(/(?<!\p{L})Ön(nek|t|nel)?(?!\p{L})/u.test("Ön is írhat")).toBe(true);
    expect(/(?<!\p{L})Ön(nek|t|nel)?(?!\p{L})/u.test("most jönnek")).toBe(false);
    expect(/[–—]/.test("a – b")).toBe(true);
  });
});

describe("★★★ Jedes Beispielwort einer Einführung ist an seiner Stelle tippbar", () => {
  it("es gibt Beispielwörter (sonst prüft der Wächter nichts)", () => {
    setLayout("hu");
    expect(lektionenFuer("hu").flatMap((l) => beispielWoerter(huLektionsVorspannFuer(l.id, l.newKeys))).length).toBeGreaterThan(80);
  });

  for (const t of HU_TASTATUREN) {
    it(`${t}: jedes Wort zwischen „…” passt zum Tastenstand der Lektion`, () => {
      setLayout(t);
      const fehler: string[] = [];
      for (const l of lektionenFuer("hu"))
        for (const w of beispielWoerter(huLektionsVorspannFuer(l.id, l.newKeys))) if (!wortTippbar(w, bis(l.id))) fehler.push(`${l.id}: „${w}”`);
      expect(fehler).toEqual([]);
    });
  }

  it("Gegenprobe: ein Wort mit einer späteren Taste und ein Grossbuchstabe vor Shift fallen auf", () => {
    setLayout("hu");
    expect(wortTippbar("ház", bis("hu-gyakori-5"))).toBe(false);
    expect(wortTippbar("ház", bis("hu-gyakori-6"))).toBe(true);
    expect(wortTippbar("Anna", bis("hu-gyakori-6"))).toBe(false);
    expect(wortTippbar("Anna", bis("hu-nagybetu"))).toBe(true);
    expect(wortTippbar("tűz", bis("hu-ekezet-1"))).toBe(false);
  });
});

describe("★★ Griffe je Tastatur (gerechnet, nicht geschrieben)", () => {
  it("z: auf QWERTZ rechter Zeigefinger oben, auf QWERTY linker kleiner Finger unten - die Texte unterscheiden sich", () => {
    setLayout("hu");
    const qwertz = lessonById("hu-gyakori-3")!;
    setLayout("hu-101");
    const qwerty = lessonById("hu-gyakori-3")!;
    expect(qwertz.intro).toMatch(/Z: jobb mutatóujj, felső sor/);
    expect(qwerty.intro).toMatch(/Z: bal kisujj, alsó sor, közvetlenül az A billentyű alatt/);
    expect(lessonIntroText(qwertz, "hu-101")).toBe(qwerty.intro);
  });

  it("die achte Heimtaste é und das á daneben; ő über dem é-Bereich", () => {
    setLayout("hu");
    expect(lessonById("hu-alap-4")!.intro).toMatch(/É: jobb kisujj, alapállás/);
    expect(lessonById("hu-gyakori-5")!.intro).toMatch(/Á: jobb kisujj, az É billentyűtől jobbra/);
  });

  it("★ Ziffern: auf `hu` steht die 0 links von der 1; auf `hu-101` ist sie AltGr + Í", () => {
    setLayout("hu");
    expect(lessonById("hu-szamok")!.intro).toMatch(/A számsor bal szélén a 0 áll, az 1 előtt/);
    setLayout("hu-101");
    expect(lessonById("hu-szamok")!.intro).toMatch(/nyomd meg az Í billentyűt/);
  });

  it("Satz- und Sonderzeichen: der Name vor dem Zeichen, Shift bzw. AltGr aus den Daten", () => {
    setLayout("hu");
    expect(lessonById("hu-irasjel-1")!.intro).toMatch(/kérdőjel \(\?\): tartsd lenyomva a másik kezeddel a Shiftet, és nyomd meg a vessző billentyűt/);
    expect(lessonById("hu-szimbolum-2")!.intro).toMatch(/euró \(€\): tartsd lenyomva az AltGr billentyűt, és nyomd meg az U billentyűt/);
  });
});
