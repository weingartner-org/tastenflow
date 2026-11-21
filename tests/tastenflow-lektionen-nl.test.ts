/**
 * ★★★★ WÄCHTER: die Lektionen des Weges „nl" (F4-NL, 29.10.2026). Modell: `tests/tastenflow-lektionen-hu.test.ts`.
 * Geprüft auf ALLEN DREI Tastaturen des Weges (`nl-intl` US-International, `be` Belgisch AZERTY, `nl-dutch`), die Reihenfolge-Regel
 * zusätzlich auf fremden Tastaturen:
 *
 *  1. Die Tasten aller Lektionen hintereinander SIND `introOrder("nl")`; die erste Lektion bringt die Heimzeichen (Falle 41).
 *     Am WERT (Bauplan N2): die achte Heimtaste ist `;` (nl-intl), `m` (be), `+` (nl-dutch).
 *  2. Eigene Lektionen für Shift, `. , ?`, den Apostroph (Totasten-Lektion N3/N4), `ë ï`, `é`, die Ziffern, die Symbole.
 *  3. Jede Lektion hat an ihrer Stelle tippbare Übungszeilen.
 *  4. Hausregeln: kein Maus-Wort, kein „u"/„gij", nie „blind typen", „toets" nie als Prüfung, kein Gedankenstrich.
 *  5. Jedes Beispielwort (zwischen „…”) ist an der Stelle seiner Lektion tippbar - auf allen drei Tastaturen; nie `'` vor einem Klinker
 *     (W-NL1).
 *  6. Die Griffe sind aus den Daten der Tastatur gerechnet (Totaste auf nl-intl, eigene Taste auf be, Ziffern mit Shift auf be).
 *
 * ⚠️ Die Übungszeilen kommen bis zum Wortschatz (Etappe D) aus dem englischen Rückfall (`WORDS_NL` leer) - der Wächter „keine
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
import { NL_LEKTIONS_IDS, nlLektionsVorspannFuer } from "../src/lib/typing/curriculumNl";
import { fitText } from "../src/lib/typing/corpus";
import { generateRound } from "../src/lib/typing/generator";
import { heimZeichenDesWeges } from "../src/lib/typing/heimtasten";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { halbePaareIn, halbesPaar, lektionsZeilen, verletztWNl1 } from "./helfer/paareNeueWege";
import { lernwegDef } from "../src/lib/typing/lernweg";

const NL_TASTATUREN: readonly LayoutId[] = ["nl-intl", "be", "nl-dutch"];

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
    const c = ch.toLocaleLowerCase("nl");
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

describe("★★★★ Die Lektionen folgen der Reihenfolge des Weges „nl“ - auf jeder Tastatur", () => {
  for (const t of [...NL_TASTATUREN, "de", "us"] as const) {
    it(`${t}: die Tasten aller Lektionen hintereinander sind introOrder("nl")`, () => {
      setLayout(t);
      expect(folgtDerReihenfolge(lektionenFuer("nl"), introOrder("nl"))).toEqual([]);
    });
  }

  it("Gegenprobe: eine Lektion, die eine spätere Taste vorwegnimmt, wird gefunden", () => {
    setLayout("nl-intl");
    const falsch = lektionenFuer("nl").map((l) => (l.id === "nl-vaak-1" ? { ...l, newKeys: ["e", "i"] } : l));
    expect(folgtDerReihenfolge(falsch, introOrder("nl")).length).toBeGreaterThan(0);
  });

  it("23 Lektionen auf jeder Tastatur, IDs mit „nl-“, eindeutig, gecacht; keine ID wie eine Tastatur (`nl-intl`, `nl-dutch`)", () => {
    expect(NL_LEKTIONS_IDS).toHaveLength(23);
    expect(new Set(NL_LEKTIONS_IDS).size).toBe(23);
    for (const id of NL_LEKTIONS_IDS) expect(id.startsWith("nl-"), id).toBe(true);
    expect(NL_LEKTIONS_IDS).not.toContain("nl-intl");
    expect(NL_LEKTIONS_IDS).not.toContain("nl-dutch");
    for (const t of NL_TASTATUREN) {
      setLayout(t);
      expect(lektionenFuer("nl").map((l) => l.id), t).toEqual([...NL_LEKTIONS_IDS]);
      expect(lektionenFuer("nl")).toBe(lektionenFuer("nl"));
    }
  });

  it("★ Falle 41: die erste Lektion bringt die Heimzeichen der Haupttastatur; es sind keine englischen Lektionen mehr", () => {
    setLayout("nl-intl");
    expect(lektionenFuer("nl")[0].newKeys).toEqual([...heimZeichenDesWeges("nl")]);
    expect(lektionenFuer("nl")[0].id).toBe("nl-basis-1");
    expect(lektionenFuer("nl").some((l) => l.id.startsWith("en-"))).toBe(false);
  });

  it("★ Bauplan N2: die achte Heimtaste am Wert - `;` (nl-intl), `m` (be, dann fehlt sie in „m w“), `+` (nl-dutch)", () => {
    setLayout("nl-intl");
    expect(lessonById("nl-basis-4")?.newKeys).toEqual(["a", ";"]);
    expect(lessonById("nl-letters-1")?.newKeys).toEqual(["m", "w"]);
    setLayout("be");
    expect(lessonById("nl-basis-4")?.newKeys).toEqual(["a", "m"]);
    expect(lessonById("nl-letters-1")?.newKeys).toEqual(["w"]);
    expect(lessonById("nl-leestekens-2")?.newKeys).toContain(";");
    setLayout("nl-dutch");
    expect(lessonById("nl-basis-4")?.newKeys).toEqual(["a", "+"]);
    expect(lessonById("nl-symbolen-1")?.newKeys).not.toContain("+");
  });

  it("eigene Lektionen: Shift, . , ?, Apostroph, ë ï, é, Ziffern, Symbole", () => {
    setLayout("nl-intl");
    expect(lessonById("nl-hoofdletters")?.enablesShift).toBe(true);
    expect(lessonById("nl-leestekens-1")?.newKeys).toEqual([".", ",", "?"]);
    expect(lessonById("nl-apostrof")?.newKeys).toEqual(["'"]);
    expect(lessonById("nl-trema")?.newKeys).toEqual(["ë", "ï"]);
    expect(lessonById("nl-accent")?.newKeys).toEqual(["é"]);
    expect(lessonById("nl-cijfers")?.newKeys.join("")).toBe("1234567890");
    expect(lessonById("nl-symbolen-2")?.newKeys).toEqual(["@", "#", "[", "]", "{", "}", "|", "\\", "€"]);
    expect(shiftUnlockedAt("nl-vaak-4")).toBe(false);
    expect(shiftUnlockedAt("nl-hoofdletters")).toBe(true);
    for (const t of NL_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("nl")) expect(new Set(unlockedKeysWith(l.id, undefined, "nl"))).toEqual(new Set(unlockedKeysAt(l.id)));
    }
  });
});

describe("★★★ Jede Lektion hat an ihrer Stelle tippbare Übungszeilen", () => {
  for (const t of NL_TASTATUREN) {
    it(`${t}: eine Runde je Lektion und Altersstufe, jede Zeile passt zum Tastenstand`, () => {
      setLayout(t);
      const fehler: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer("nl")) {
        stand = introducedThroughLesson(stand, l.id, "nl");
        const erlaubt = new Set(unlockedKeysWith(l.id, stand, "nl").filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens", "erwachsen"] as const) {
          const runde = generateRound(l.id, { lernweg: "nl", lang: "nl", introduced: stand, stufe, count: 10 });
          if (runde.length === 0) fehler.push(`${l.id}/${stufe}: keine Zeile`);
          for (const z of runde) {
            if (!z.text.trim() || fitText(z.text, erlaubt, "nl") === null) fehler.push(`${l.id}/${stufe}: „${z.text}"`);
          }
        }
      }
      expect(fehler).toEqual([]);
    }, 120_000);
  }
});

// ★★★ GEN-HAUPTSPRACHE (29.10.2026): scharf geschaltet - die paarfesten Vorlagen (`generator.ts#MIT_ZEICHENVORLAGEN`) kennen „nl“.
// Die Paare sind die des Weges (`paareGemeinsam`, lernweg.ts) und `"` (eine Taste für beide Seiten). Helfer: `tests/helfer/paareNeueWege.ts`.
describe("★★★ Klammern und Anführungszeichen immer als Paar - auf dem Weg durch die Lektionen", () => {
  for (const t of NL_TASTATUREN) {
    it(`${t}: keine Übungszeile irgendeiner Lektion trägt ein halbes Paar`, () => {
      expect(halbePaareIn("nl", t)).toEqual([]);
    }, 120_000);
  }
  // ★★★ W-NL1 (Bauplan N3): auf nl-intl sind `'` und `"` Totasten - nie direkt vor einem Selbstlaut (`'` auch nie vor c).
  it("nl-intl: W-NL1 - in keiner Übungszeile steht `'` oder `\"` direkt vor einem Selbstlaut", () => {
    const funde = lektionsZeilen("nl", "nl-intl").filter((z) => verletztWNl1(z.text)).map((z) => `${z.id}: „${z.text}”`);
    expect(funde).toEqual([]);
  }, 120_000);
  it("Gegenprobe W-NL1: „\"auto\"“, „'en“ und „'cel“ fallen auf, „auto's“ und „'s avonds“ nicht", () => {
    expect(['"auto"', "'en", "'cel", "auto's", "'s avonds"].filter(verletztWNl1)).toEqual(['"auto"', "'en", "'cel"]);
  });
  it("Gegenprobe: halbe Paare fallen auf, ein ganzes nicht", () => {
    const paare = lernwegDef("nl").paareGemeinsam ?? {};
    expect(["Deur( wakker","(huis","en \"dan","(huis) en \"dan\""].filter((z) => halbesPaar(z, paare))).toEqual(["Deur( wakker","(huis","en \"dan"]);
  });
});

describe("★★★ Hausregeln in Titeln und Einführungen", () => {
  const NIE = new Set(["und", "der", "the", "and", "key", "press", "touche", "tecla", "tasto", "klávesa", "billentyű", "tasta"]);
  const MUSTER: readonly (readonly [RegExp, string])[] = [
    [/[–—]/, "Gedankenstrich"],
    [/(?<!\p{L})(klik\p{L}*|dubbelklik\p{L}*|tik|tikken|sleep|slepen|muis)(?!\p{L})/iu, "Maus"],
    [/(?<!\p{L})(u|uw|gij|ge)(?!\p{L})/u, "„u“/„gij“ statt „je“"],
    [/blind typen|(?<!\p{L})(een blinde|de blinden)(?!\p{L})/iu, "„blind“ für das Zehnfingersystem oder die Person"],
    // „toets" ist hier immer die Taste - die Prüfung hiesse „toets"/„proefwerk"/„examen" (Falle 1); die zwei letzten fallen auf.
    [/(?<!\p{L})(proefwerk|examen)(?!\p{L})/iu, "Prüfungswort"],
    [/(?<!\p{L})(bijv|enz|d\.w\.z)\./iu, "Abkürzung"],
  ];

  it("alle drei Tastaturen: kein Maus-Wort, kein „u“, nie „blind typen“, kein Gedankenstrich, keine fremden Wörter", () => {
    const funde: string[] = [];
    for (const t of NL_TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer("nl"))
        for (const [feld, text] of [["title", l.title], ["intro", l.intro]] as const) {
          for (const [m, was] of MUSTER) if (m.test(text)) funde.push(`${t} ${l.id} ${feld}: ${was}`);
          for (const w of text.split(/[^\p{L}]+/u).filter(Boolean)) if (NIE.has(w.toLowerCase())) funde.push(`${t} ${l.id} ${feld}: ${w}`);
        }
    }
    expect(funde).toEqual([]);
  });

  it("Gegenprobe: die Muster schlagen an", () => {
    const treffer = (s: string) => MUSTER.filter(([m]) => m.test(s)).map(([, was]) => was);
    expect(treffer("Klik op de knop")).toContain("Maus");
    expect(treffer("Druk op Enter als u klaar bent")).toContain("„u“/„gij“ statt „je“");
    expect(treffer("Leer blind typen")).toContain("„blind“ für das Zehnfingersystem oder die Person");
    expect(treffer("a – b")).toContain("Gedankenstrich");
    expect(treffer("bijv. een kat")).toContain("Abkürzung");
    expect(treffer("De U en de V: „uur”")).toEqual([]);
  });
});

describe("★★★ Jedes Beispielwort einer Einführung ist an seiner Stelle tippbar", () => {
  it("es gibt Beispielwörter (sonst prüft der Wächter nichts)", () => {
    setLayout("nl-intl");
    expect(lektionenFuer("nl").flatMap((l) => beispielWoerter(nlLektionsVorspannFuer(l.id, l.newKeys))).length).toBeGreaterThan(70);
  });

  for (const t of NL_TASTATUREN) {
    it(`${t}: jedes Wort zwischen „…” passt zum Tastenstand der Lektion`, () => {
      setLayout(t);
      const fehler: string[] = [];
      for (const l of lektionenFuer("nl"))
        for (const w of beispielWoerter(nlLektionsVorspannFuer(l.id, l.newKeys))) if (!wortTippbar(w, bis(l.id))) fehler.push(`${l.id}: „${w}”`);
      expect(fehler).toEqual([]);
    });
  }

  it("W-NL1: in keinem Beispielwort steht `'` vor einem Klinker oder c (auf nl-intl würde daraus ein Akzentbuchstabe)", () => {
    setLayout("nl-intl");
    const funde = lektionenFuer("nl")
      .flatMap((l) => beispielWoerter(nlLektionsVorspannFuer(l.id, l.newKeys)))
      .filter((w) => /'[aeiouycAEIOUYC]/.test(w));
    expect(funde).toEqual([]);
    expect(/'[aeiouycAEIOUYC]/.test("'een'")).toBe(true);
  });

  it("Gegenprobe: ein Wort mit einer späteren Taste, das m auf be früher, und ein Grossbuchstabe vor Shift fallen auf", () => {
    setLayout("nl-intl");
    expect(wortTippbar("dam", bis("nl-basis-4"))).toBe(false);
    expect(wortTippbar("ideeën", bis("nl-apostrof"))).toBe(false);
    expect(wortTippbar("ideeën", bis("nl-trema"))).toBe(true);
    expect(wortTippbar("Anna", bis("nl-vaak-4"))).toBe(false);
    expect(wortTippbar("Anna", bis("nl-hoofdletters"))).toBe(true);
    setLayout("be");
    expect(wortTippbar("dam", bis("nl-basis-4"))).toBe(true);
  });
});

describe("★★ Griffe je Tastatur (gerechnet, nicht geschrieben)", () => {
  it("Apostroph: auf nl-intl eine dode toets, auf be eine eigene Taste in der Ziffernreihe - die Texte unterscheiden sich", () => {
    setLayout("nl-intl");
    const intl = lessonById("nl-apostrof")!;
    setLayout("be");
    const be = lessonById("nl-apostrof")!;
    expect(intl.intro).toMatch(/apostrof \('\): rechterpink, rechts van de toets ;\. Dat is een dode toets/);
    expect(be.intro).toMatch(/apostrof \('\): linkerwijsvinger, cijferrij/);
    expect(be.intro).not.toMatch(/dode toets:/);
    expect(lessonIntroText(intl, "be")).toBe(be.intro);
  });

  it("ë: auf nl-intl `\"` (Shift) dann E, auf be und nl-dutch die Trema-Totaste dann E", () => {
    setLayout("nl-intl");
    expect(lessonById("nl-trema")!.intro).toMatch(/Ë \(e met trema\): druk eerst op de dode toets aanhalingsteken \(met Shift/);
    setLayout("be");
    expect(lessonById("nl-trema")!.intro).toMatch(/Ë \(e met trema\): druk eerst op de dode toets trema \(met Shift/);
    setLayout("nl-dutch");
    expect(lessonById("nl-trema")!.intro).toMatch(/Ë \(e met trema\): druk eerst op de dode toets trema \(rechterpink/);
  });

  it("é: nl-intl Alt Gr + E, be eigene Taste, nl-dutch accent aigu dann E", () => {
    setLayout("nl-intl");
    expect(lessonById("nl-accent")!.intro).toMatch(/É \(e met accent aigu\): houd Alt Gr ingedrukt en druk op de toets E/);
    setLayout("be");
    expect(lessonById("nl-accent")!.intro).toMatch(/É \(e met accent aigu\): linkerringvinger, cijferrij/);
    setLayout("nl-dutch");
    expect(lessonById("nl-accent")!.intro).toMatch(/É \(e met accent aigu\): druk eerst op de dode toets accent aigu/);
  });

  it("★ Ziffern: auf be nur mit Shift (Falle 6), auf nl-intl ohne", () => {
    setLayout("be");
    expect(lessonById("nl-cijfers")!.intro).toMatch(/Op een Belgisch toetsenbord typ je cijfers met Shift/);
    expect(lessonById("nl-cijfers")!.intro).toMatch(/2: houd met de andere hand Shift ingedrukt en druk op de toets É/);
    setLayout("nl-intl");
    expect(lessonById("nl-cijfers")!.intro).not.toMatch(/Belgisch/);
  });
});
