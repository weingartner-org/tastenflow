/**
 * ★★★★ WÄCHTER: die Lektionen des Weges „el" (F4-EL, 29.10.2026). Modell: `tests/tastenflow-lektionen-ro.test.ts`.
 * Geprüft auf ALLEN drei Pflicht-Tastaturen (`el` Greek = Bezug, `el-220`, `el-319`), die Reihenfolge-Regel zusätzlich auf
 * fremden Tastaturen:
 *
 *  1. Die Tasten aller Lektionen hintereinander SIND `introOrder("el")`; die erste Lektion bringt die Heimzeichen (Falle 41: φ ξ).
 *  2. Eigene Lektionen für den Tonos (Totaste), Shift (mit `. ,`), das Fragezeichen `;`, die Dialytika `¨ ΅`, Satzzeichen,
 *     Ziffern, Symbole.
 *  3. Jede Lektion hat an ihrer Stelle tippbare Übungszeilen.
 *  4. Hausregeln (Glossar el): kein `?` (das Fragezeichen ist `;`), keine Ano Teleia, kein Maus-Wort, keine Höflichkeitsform,
 *     kein Adjektiv am Kind, kein „τυφλ", kein Gedankenstrich, kein Wort aus gemischter Schrift; Kinder mit εσύ.
 *  5. Jedes Beispielwort (zwischen «…») ist an der Stelle seiner Lektion tippbar - ein Buchstabe mit Tonos braucht `΄` UND seinen
 *     Grundbuchstaben, ϊ braucht `¨`, ΐ braucht `΅`.
 *  6. Die Griffe sind aus den Daten der Tastatur gerechnet (`¨` und `΅` je Tastatur anders).
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
import { EL_LEKTIONS_IDS, elLektionsVorspannFuer } from "../src/lib/typing/curriculumEl";
import { fitText } from "../src/lib/typing/corpus";
import { generateRound } from "../src/lib/typing/generator";
import { heimZeichenDesWeges } from "../src/lib/typing/heimtasten";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { halbePaareIn, halbesPaar } from "./helfer/paareNeueWege";
import { lernwegDef } from "../src/lib/typing/lernweg";

const EL_TASTATUREN: readonly LayoutId[] = ["el", "el-220", "el-319"];
const TONOS = "΄";
const DIALYTIKA = "¨";
const DIALYTIKA_TONOS = "΅";

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

/**
 * Ist das Wort mit diesem Tastenstand tippbar? Jedes Zeichen wird zerlegt (NFD): der Grundbuchstabe ist eine Einheit (gross
 * braucht Shift), Tonos (U+0301) braucht `΄`, Dialytika (U+0308) braucht `¨`, beide zusammen `΅`.
 */
function wortTippbar(wort: string, stand: ReadonlySet<string>): boolean {
  for (const ch of wort.normalize("NFC")) {
    if (ch === " ") continue;
    const zerlegt = ch.normalize("NFD");
    const basis = zerlegt[0];
    const zeichen = zerlegt.slice(1);
    const klein = basis.toLowerCase();
    if (basis !== klein && !stand.has(SHIFT_UNIT)) return false;
    if (!stand.has(klein)) return false;
    const tonos = zeichen.includes("́");
    const dialytika = zeichen.includes("̈");
    if (tonos && dialytika && !stand.has(DIALYTIKA_TONOS)) return false;
    if (tonos && !dialytika && !stand.has(TONOS)) return false;
    if (dialytika && !tonos && !stand.has(DIALYTIKA)) return false;
  }
  return true;
}

/** Die Beispielwörter zwischen «…» - nur solche mit Buchstaben. */
function beispielWoerter(text: string): string[] {
  return [...text.matchAll(/«([^»]+)»/g)].map((m) => m[1]).filter((w) => /\p{L}/u.test(w));
}

const bis = (id: string): Set<string> => {
  const s = new Set(unlockedKeysAt(id));
  if (shiftUnlockedAt(id)) s.add(SHIFT_UNIT);
  return s;
};

describe("★★★★ Die Lektionen folgen der Reihenfolge des Weges „el“ - auf jeder Tastatur", () => {
  for (const t of [...EL_TASTATUREN, "de", "us"] as const) {
    it(`${t}: die Tasten aller Lektionen hintereinander sind introOrder("el")`, () => {
      setLayout(t);
      expect(folgtDerReihenfolge(lektionenFuer("el"), introOrder("el"))).toEqual([]);
    });
  }

  it("Gegenprobe: eine Lektion, die eine spätere Taste vorwegnimmt, wird gefunden", () => {
    setLayout("el");
    const falsch = lektionenFuer("el").map((l) => (l.id === "el-fonienta" ? { ...l, newKeys: ["ε", "ν"] } : l));
    expect(folgtDerReihenfolge(falsch, introOrder("el")).length).toBeGreaterThan(0);
  });

  it("17 Lektionen auf jeder Tastatur, IDs mit „el-“, eindeutig, gecacht; keine ID wie eine Tastatur", () => {
    expect(EL_LEKTIONS_IDS).toHaveLength(17);
    expect(new Set(EL_LEKTIONS_IDS).size).toBe(17);
    for (const id of EL_LEKTIONS_IDS) {
      expect(id.startsWith("el-"), id).toBe(true);
      expect(EL_TASTATUREN, id).not.toContain(id);
    }
    for (const t of EL_TASTATUREN) {
      setLayout(t);
      expect(lektionenFuer("el").map((l) => l.id), t).toEqual([...EL_LEKTIONS_IDS]);
      expect(lektionenFuer("el")).toBe(lektionenFuer("el"));
    }
  });

  it("★ Falle 41: die erste Lektion bringt φ ξ (nicht f j); es sind keine englischen Lektionen mehr", () => {
    setLayout("el");
    expect(lektionenFuer("el")[0].newKeys).toEqual([...heimZeichenDesWeges("el")]);
    expect(lektionenFuer("el")[0].newKeys).toEqual(["φ", "ξ"]);
    expect(lektionenFuer("el")[0].id).toBe("el-vasiki-1");
    expect(lektionenFuer("el").some((l) => l.id.startsWith("en-"))).toBe(false);
  });

  it("eigene Lektionen: Tonos - Shift mit . , - ; : - Dialytika - Satzzeichen - Ziffern - Symbole", () => {
    setLayout("el");
    expect(lessonById("el-tonos")?.newKeys).toEqual([TONOS]);
    expect(lessonById("el-grammata-3")?.newKeys).toEqual(["ρ", "ς", "γ"]);
    expect(lessonById("el-kefalaia")?.enablesShift).toBe(true);
    expect(lessonById("el-kefalaia")?.newKeys).toEqual([".", ","]);
    expect(lessonById("el-erotimatiko")?.newKeys).toEqual([";", ":"]);
    expect(lessonById("el-dialytika")?.newKeys).toEqual([DIALYTIKA, DIALYTIKA_TONOS]);
    expect(lessonById("el-stixi")?.newKeys).toEqual(["!", "\"", "'", "-", "(", ")"]);
    expect(lessonById("el-arithmoi")?.newKeys.join("")).toBe("1234567890");
    expect(lessonById("el-symvola")?.newKeys).toEqual(["%", "/", "+", "=", "*", "_", "$", "€", "«", "»"]);
    expect(shiftUnlockedAt("el-grammata-5")).toBe(false);
    expect(shiftUnlockedAt("el-kefalaia")).toBe(true);
    expect(lektionenFuer("el").flatMap((l) => l.newKeys)).not.toContain("?");
    for (const t of EL_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("el")) expect(new Set(unlockedKeysWith(l.id, undefined, "el"))).toEqual(new Set(unlockedKeysAt(l.id)));
    }
  });
});

describe("★★★ Jede Lektion hat an ihrer Stelle tippbare Übungszeilen", () => {
  for (const t of EL_TASTATUREN) {
    it(`${t}: eine Runde je Lektion und Altersstufe, jede Zeile passt zum Tastenstand`, () => {
      setLayout(t);
      const fehler: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer("el")) {
        stand = introducedThroughLesson(stand, l.id, "el");
        const erlaubt = new Set(unlockedKeysWith(l.id, stand, "el").filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens", "erwachsen"] as const) {
          const runde = generateRound(l.id, { lernweg: "el", lang: "el", introduced: stand, stufe, count: 10 });
          if (runde.length === 0) fehler.push(`${l.id}/${stufe}: keine Zeile`);
          for (const z of runde) {
            if (!z.text.trim() || fitText(z.text, erlaubt, "el") === null) fehler.push(`${l.id}/${stufe}: „${z.text}"`);
          }
        }
      }
      expect(fehler).toEqual([]);
    }, 120_000);
  }
});

// ★★★ GEN-HAUPTSPRACHE (29.10.2026): scharf geschaltet - die paarfesten Vorlagen (`generator.ts#MIT_ZEICHENVORLAGEN`) kennen „el“.
// Die Paare sind die des Weges (`paareGemeinsam`, lernweg.ts) und `"` (eine Taste für beide Seiten). Helfer: `tests/helfer/paareNeueWege.ts`.
describe("★★★ Klammern und Anführungszeichen immer als Paar - auf dem Weg durch die Lektionen", () => {
  for (const t of EL_TASTATUREN) {
    it(`${t}: keine Übungszeile irgendeiner Lektion trägt ein halbes Paar`, () => {
      expect(halbePaareIn("el", t)).toEqual([]);
    }, 120_000);
  }
  it("Gegenprobe: halbe Paare fallen auf, ein ganzes nicht", () => {
    const paare = lernwegDef("el").paareGemeinsam ?? {};
    expect(["Σπίτι« και","(σπίτι","και \"να","«σπίτι» (και)"].filter((z) => halbesPaar(z, paare))).toEqual(["Σπίτι« και","(σπίτι","και \"να"]);
  });
});

describe("★★★ Hausregeln in Titeln und Einführungen", () => {
  const NIE = new Set(["und", "der", "die", "the", "and", "key", "press", "taste", "lesson"]);
  const MUSTER: readonly (readonly [RegExp, string])[] = [
    [/[–—]/, "Gedankenstrich"],
    [/\?/, "lateinisches Fragezeichen (das griechische ist ;)"],
    [/[··;]/u, "Ano Teleia oder U+037E"],
    [/κλικ|ποντίκι|(?<!\p{L})σύρε(?!\p{L})/iu, "Maus"],
    [/(?<!\p{L})(πατήστε|επιλέξτε|δοκιμάστε|κρατήστε|βάλτε|γράψτε|παρακαλώ)(?!\p{L})/iu, "Höflichkeitsform statt εσύ"],
    [/(?<!\p{L})(έτοιμος|έτοιμη|σίγουρος|σίγουρη|νικητής|νικήτρια|αρχάριος|αρχάρια|μαθητής|μαθήτρια)(?!\p{L})/iu, "Geschlecht am Kind"],
    [/τυφλ/iu, "„τυφλ…“ (Person zuerst, Regel 3/4)"],
    [/(?<!\p{L})\p{L}'(?=\s)/u, "Apostroph-Verkürzung (σ' αυτό)"],
  ];
  /** Jedes Wort ganz griechisch oder ganz lateinisch (Bauplan Falle 2: Doppelgänger o/ο, A/Α). */
  const gemischt = (text: string): string[] =>
    text.split(/[^\p{L}]+/u).filter((w) => w && !/^\p{Script=Greek}+$/u.test(w) && !/^\p{Script=Latin}+$/u.test(w));

  it("alle Tastaturen: kein ?, keine Ano Teleia, kein Maus-Wort, keine Höflichkeitsform, kein Geschlecht, kein Mischwort", () => {
    const funde: string[] = [];
    for (const t of EL_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("el"))
        for (const [feld, text] of [["title", l.title], ["intro", l.intro]] as const) {
          for (const [m, was] of MUSTER) if (m.test(text)) funde.push(`${t} ${l.id} ${feld}: ${was}`);
          for (const w of gemischt(text)) funde.push(`${t} ${l.id} ${feld}: Mischwort „${w}"`);
          for (const w of text.split(/[^\p{L}]+/u).filter(Boolean)) if (NIE.has(w.toLowerCase())) funde.push(`${t} ${l.id} ${feld}: ${w}`);
        }
    }
    expect(funde).toEqual([]);
  });

  it("★ Tonos auch am Satzanfang: ein gross geschriebener Zeichenname behält ihn („Άνω κάτω τελεία“, „Άνοιγμα παρένθεσης“)", () => {
    setLayout("el");
    expect(lessonById("el-erotimatiko")!.intro).toMatch(/Άνω κάτω τελεία \(:\)/);
    expect(lessonById("el-stixi")!.intro).toMatch(/Άνοιγμα παρένθεσης \(\(\)/);
    expect(lessonById("el-stixi")!.intro).not.toMatch(/(?<!\p{L})Ανοιγμα/u);
  });

  it("★ Kinder-Anrede εσύ: die Einführungen sprechen das Kind im Imperativ Einzahl oder in der 2. Person an", () => {
    setLayout("el");
    const esy = /(?<!\p{L})(βάλε|πάτησε|κράτα|δοκίμασε|γράφεις|ξεκινάς|βρίσκεις|πατάς|νιώθεις|σου|σένα)(?!\p{L})/iu;
    // Die Lektionen mit einer Anweisung; die übrigen nennen nur Buchstaben, Wörter und Griffe (ohne Verb).
    for (const id of ["el-vasiki-1", "el-tonos", "el-kefalaia", "el-erotimatiko", "el-keimena"]) expect(esy.test(lessonById(id)!.intro), id).toBe(true);
  });

  it("Gegenprobe: die Muster schlagen an", () => {
    const treffer = (s: string) => MUSTER.filter(([m]) => m.test(s)).map(([, was]) => was);
    expect(treffer("Κάνε κλικ στο κουμπί")).toContain("Maus");
    expect(treffer("Πατήστε Enter")).toContain("Höflichkeitsform statt εσύ");
    expect(treffer("Είσαι έτοιμος;")).toContain("Geschlecht am Kind");
    expect(treffer("Τι κάνεις?")).toContain("lateinisches Fragezeichen (das griechische ist ;)");
    expect(treffer("ναι· όχι")).toContain("Ano Teleia oder U+037E");
    expect(treffer("τυφλό σύστημα")).toContain("„τυφλ…“ (Person zuerst, Regel 3/4)");
    expect(treffer("σ' αυτό")).toContain("Apostroph-Verkürzung (σ' αυτό)");
    expect(treffer("a – b")).toContain("Gedankenstrich");
    expect(treffer("Βάλε τα δάχτυλα στη βασική σειρά; πάτησε το πλήκτρο '.")).toEqual([]);
    expect(gemischt("καλo")).toEqual(["καλo"]); // lateinisches o am Wortende
    expect(gemischt("κράτα πατημένο το Shift")).toEqual([]);
  });
});

describe("★★★ Jedes Beispielwort einer Einführung ist an seiner Stelle tippbar", () => {
  it("es gibt Beispielwörter (sonst prüft der Wächter nichts)", () => {
    setLayout("el");
    expect(lektionenFuer("el").flatMap((l) => beispielWoerter(elLektionsVorspannFuer(l.id, l.newKeys))).length).toBeGreaterThan(40);
  });

  for (const t of EL_TASTATUREN) {
    it(`${t}: jedes Wort zwischen «…» passt zum Tastenstand der Lektion`, () => {
      setLayout(t);
      const fehler: string[] = [];
      for (const l of lektionenFuer("el"))
        for (const w of beispielWoerter(elLektionsVorspannFuer(l.id, l.newKeys))) if (!wortTippbar(w, bis(l.id))) fehler.push(`${l.id}: «${w}»`);
      expect(fehler).toEqual([]);
    });
  }

  it("Gegenprobe: Tonos vor seiner Lektion, ς vor seiner Lektion, ΐ vor ΅ und ein Grossbuchstabe vor Shift fallen auf", () => {
    setLayout("el");
    expect(wortTippbar("καλά", bis("el-fonienta"))).toBe(false);
    expect(wortTippbar("καλά", bis("el-tonos"))).toBe(true);
    expect(wortTippbar("καλός", bis("el-grammata-2"))).toBe(false);
    expect(wortTippbar("καλός", bis("el-grammata-3"))).toBe(true);
    expect(wortTippbar("πρωτεΐνη", bis("el-kefalaia"))).toBe(false);
    expect(wortTippbar("προϊόν", bis("el-dialytika"))).toBe(true);
    expect(wortTippbar("Άννα", bis("el-grammata-5"))).toBe(false);
    expect(wortTippbar("Άννα", bis("el-kefalaia"))).toBe(true);
  });
});

describe("★★ Griffe je Tastatur (gerechnet, nicht geschrieben)", () => {
  it("der Tonos ist die achte Heimtaste (rechter kleiner Finger) und eine Totaste - auf allen drei Tastaturen", () => {
    for (const t of EL_TASTATUREN) {
      setLayout(t);
      expect(lessonById("el-tonos")!.intro, t).toMatch(/Τόνος \(΄\): δεξί μικρό δάχτυλο, βασική θέση\. Είναι νεκρό πλήκτρο/);
    }
  });

  it("das Fragezeichen ; : auf `el` die Taste Q, auf `el-220` Shift + Komma - die Texte unterscheiden sich (introByLayout)", () => {
    setLayout("el");
    const el = lessonById("el-erotimatiko")!;
    expect(el.intro).toMatch(/Ερωτηματικό \(;\): αριστερό μικρό δάχτυλο, στην πάνω σειρά/);
    setLayout("el-220");
    const el220 = lessonById("el-erotimatiko")!;
    expect(el220.intro).toMatch(/Ερωτηματικό \(;\): κράτα πατημένο το Shift με το άλλο χέρι και πάτησε το πλήκτρο ,/);
    expect(lessonIntroText(el, "el-220")).toBe(el220.intro);
  });

  it("¨ und ΅: auf `el` Shift + Tonos-Taste bzw. Shift + ς, auf `el-220` eine eigene Taste, auf `el-319` ΅ mit Alt Gr", () => {
    setLayout("el");
    const d = lessonById("el-dialytika")!.intro;
    expect(d).toMatch(/Διαλυτικά \(¨\): κράτα πατημένο το Shift με το άλλο χέρι και πάτησε το πλήκτρο τόνου/);
    expect(d).toMatch(/Διαλυτικά και τόνος \(΅\): κράτα πατημένο το Shift με το άλλο χέρι και πάτησε το πλήκτρο ς/);
    setLayout("el-220");
    expect(lessonById("el-dialytika")!.intro).toMatch(/Διαλυτικά \(¨\): δεξί μικρό δάχτυλο, δεξιά από το πλήκτρο τόνου/);
    setLayout("el-319");
    expect(lessonById("el-dialytika")!.intro).toMatch(/Διαλυτικά και τόνος \(΅\): κράτα πατημένο το Alt Gr και πάτησε το πλήκτρο τόνου/);
  });
});
