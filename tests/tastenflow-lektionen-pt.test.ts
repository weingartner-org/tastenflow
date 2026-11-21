/**
 * ★★★★ WÄCHTER: die Lektionen des Weges „pt" (Portugal, F4-PT, 29.10.2026). Modell: `tests/tastenflow-lektionen-cs.test.ts`.
 * Geprüft auf der Pflicht-Tastatur `pt`, die Reihenfolge-Regel zusätzlich auf fremden Tastaturen:
 *
 *  1. Die Tasten aller Lektionen hintereinander SIND `introOrder("pt")`; die erste Lektion bringt die Heimzeichen (Falle 41).
 *  2. Eigene Lektionen für Shift, `. ,`, die vier Totasten (`~ ´ ^ \``), die Ziffern, die Symbole.
 *  3. Jede Lektion hat an ihrer Stelle tippbare Übungszeilen.
 *  4. Hausregeln: kein Maus-Wort, kein „você"/Höflichkeitsform an das Kind, nie „às cegas", keine BR-Wörter, kein Gedankenstrich.
 *  5. Jedes Beispielwort (zwischen "…") ist an der Stelle seiner Lektion tippbar - gemessen mit `fitText`, also mit Totaste UND Vokal.
 *  6. Die Griffe sind aus den Daten der Tastatur gerechnet (Totaste, Shift, Alt Gr).
 *
 * ⚠️ Die Übungszeilen kommen bis zum Wortschatz (Etappe D) aus dem englischen Rückfall - der Wächter „keine fremden Wörter in den
 * Zeilen" (cs §4) gehört zur Etappe D.
 */
import { afterEach, describe, expect, it } from "vitest";
import {
  introducedThroughLesson,
  lektionenFuer,
  lessonById,
  shiftUnlockedAt,
  unlockedKeysAt,
  unlockedKeysWith,
  type Lesson,
} from "../src/lib/typing/curriculum";
import { PT_LEKTIONS_IDS, ptLektionsVorspannFuer } from "../src/lib/typing/curriculumPt";
import { fitText } from "../src/lib/typing/corpus";
import { generateRound } from "../src/lib/typing/generator";
import { heimZeichenDesWeges } from "../src/lib/typing/heimtasten";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { SHIFT_UNIT, introOrder } from "../src/lib/typing/letters";
import { halbePaareIn, halbesPaar } from "./helfer/paareNeueWege";
import { lernwegDef } from "../src/lib/typing/lernweg";
import { allowedFromIntroduced } from "../src/lib/typing/serien";

const WEG = "pt" as const;
const TASTATUREN: readonly LayoutId[] = ["pt"];

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

/** Der Tastenstand nach einer Lektion (mit ⇧, sobald freigeschaltet). */
const bis = (id: string): string[] => [...unlockedKeysAt(id), ...(shiftUnlockedAt(id) ? [SHIFT_UNIT] : [])];

/**
 * Ist das Wort an dieser Stelle tippbar? Wie das Programm selbst rechnet (`fitText`, Totaste + Vokal) - und ein Grossbuchstabe erst
 * mit ⇧ (vorher schreibt ihn Tastenflow für das Kind, `fitText` liesse ihn durch).
 */
const tippbar = (wort: string, stand: readonly string[]): boolean =>
  fitText(wort, allowedFromIntroduced([...stand], WEG), WEG, WEG) === wort && (wort === wort.toLocaleLowerCase(WEG) || stand.includes(SHIFT_UNIT));

/** Die Beispielwörter zwischen geraden Anführungszeichen - nur solche mit Buchstaben. */
function beispielWoerter(text: string): string[] {
  return [...text.matchAll(/"([^"]+)"/g)].map((m) => m[1]).filter((w) => /\p{L}/u.test(w));
}

describe("★★★★ Die Lektionen folgen der Reihenfolge des Weges „pt“ - auf jeder Tastatur", () => {
  for (const t of [...TASTATUREN, "de", "us", "br-abnt2"] as const) {
    it(`${t}: die Tasten aller Lektionen hintereinander sind introOrder("pt")`, () => {
      setLayout(t);
      expect(folgtDerReihenfolge(lektionenFuer(WEG), introOrder(WEG))).toEqual([]);
    });
  }

  it("Gegenprobe: eine Lektion, die eine spätere Taste vorwegnimmt, wird gefunden", () => {
    setLayout("pt");
    const falsch = lektionenFuer(WEG).map((l) => (l.id === "pt-frequentes-1" ? { ...l, newKeys: ["e", "r"] } : l));
    expect(folgtDerReihenfolge(falsch, introOrder(WEG)).length).toBeGreaterThan(0);
  });

  it("22 Lektionen, IDs mit „pt-“, eindeutig, gecacht; es sind keine englischen Lektionen mehr", () => {
    expect(PT_LEKTIONS_IDS).toHaveLength(22);
    expect(new Set(PT_LEKTIONS_IDS).size).toBe(22);
    for (const id of PT_LEKTIONS_IDS) expect(id.startsWith("pt-"), id).toBe(true);
    setLayout("pt");
    expect(lektionenFuer(WEG).map((l) => l.id)).toEqual([...PT_LEKTIONS_IDS]);
    expect(lektionenFuer(WEG)).toBe(lektionenFuer(WEG));
    expect(lektionenFuer(WEG).some((l) => l.id.startsWith("en-"))).toBe(false);
  });

  it("★ Falle 41: die erste Lektion bringt die Heimzeichen der Haupttastatur", () => {
    setLayout("pt");
    expect(lektionenFuer(WEG)[0].newKeys).toEqual([...heimZeichenDesWeges(WEG)]);
  });

  it("eigene Lektionen: ç in der Grundreihe, Shift, . ,, die vier Totasten, Ziffern, Symbole", () => {
    setLayout("pt");
    expect(lessonById("pt-base-4")?.newKeys).toEqual(["a", "ç"]);
    expect(lessonById("pt-maiusculas")?.enablesShift).toBe(true);
    expect(lessonById("pt-pontuacao-1")?.newKeys).toEqual([".", ","]);
    expect(lessonById("pt-til")?.newKeys).toEqual(["~"]);
    expect(lessonById("pt-agudo")?.newKeys).toEqual(["´"]);
    expect(lessonById("pt-circunflexo")?.newKeys).toEqual(["^", "x"]);
    expect(lessonById("pt-grave")?.newKeys).toEqual(["`", "y", "w"]);
    expect(lessonById("pt-pontuacao-2")?.newKeys).toContain("«");
    expect(lessonById("pt-numeros")?.newKeys.join("")).toBe("1234567890");
    expect(shiftUnlockedAt("pt-frequentes-4")).toBe(false);
    expect(shiftUnlockedAt("pt-maiusculas")).toBe(true);
    for (const l of lektionenFuer(WEG)) expect(new Set(unlockedKeysWith(l.id, undefined, WEG))).toEqual(new Set(unlockedKeysAt(l.id)));
  });
});

describe("★★★ Jede Lektion hat an ihrer Stelle tippbare Übungszeilen", () => {
  for (const t of TASTATUREN) {
    it(`${t}: eine Runde je Lektion und Altersstufe, jede Zeile passt zum Tastenstand`, () => {
      setLayout(t);
      const fehler: string[] = [];
      let stand: string[] | undefined;
      for (const l of lektionenFuer(WEG)) {
        stand = introducedThroughLesson(stand, l.id, WEG);
        const erlaubt = new Set(unlockedKeysWith(l.id, stand, WEG).filter((u) => u !== SHIFT_UNIT));
        for (const stufe of ["kids", "teens", "erwachsen"] as const) {
          const runde = generateRound(l.id, { lernweg: WEG, lang: WEG, introduced: stand, stufe, count: 10 });
          if (runde.length === 0) fehler.push(`${l.id}/${stufe}: keine Zeile`);
          for (const z of runde) if (!z.text.trim() || fitText(z.text, erlaubt, WEG) === null) fehler.push(`${l.id}/${stufe}: „${z.text}"`);
        }
      }
      expect(fehler).toEqual([]);
    }, 120_000);
  }
});

// ★★★ GEN-HAUPTSPRACHE (29.10.2026): scharf geschaltet - die paarfesten Vorlagen (`generator.ts#MIT_ZEICHENVORLAGEN`) kennen „pt“.
// Die Paare sind die des Weges (`paareGemeinsam`, lernweg.ts) und `"` (eine Taste für beide Seiten). Helfer: `tests/helfer/paareNeueWege.ts`.
describe("★★★ Klammern und Anführungszeichen immer als Paar - auf dem Weg durch die Lektionen", () => {
  for (const t of TASTATUREN) {
    it(`${t}: keine Übungszeile irgendeiner Lektion trägt ein halbes Paar`, () => {
      expect(halbePaareIn("pt", t)).toEqual([]);
    }, 120_000);
  }
  it("Gegenprobe: halbe Paare fallen auf, ein ganzes nicht", () => {
    const paare = lernwegDef("pt").paareGemeinsam ?? {};
    expect(["Desse« tentar","(casa","«casa","«casa» (sim)"].filter((z) => halbesPaar(z, paare))).toEqual(["Desse« tentar","(casa","«casa"]);
  });
});

describe("★★★ Hausregeln in Titeln und Einführungen", () => {
  const NIE = new Set(["und", "der", "die", "the", "and", "key", "press", "touche", "tasto", "klávesa", "tangent"]);
  const MUSTER: readonly (readonly [RegExp, string])[] = [
    [/[–—]/, "Gedankenstrich"],
    [/(?<!\p{L})(clica|clique|clicar|toca|arrasta|rato)(?!\p{L})/iu, "Maus"],
    [/(?<!\p{L})(você|prima|pressione|digite|selecione|experimente)(?!\p{L})/iu, "Höflichkeitsform/BR statt „tu“"],
    [/às cegas|(?<!\p{L})(os cegos|deficiente)(?!\p{L})/iu, "„cego“ für das Zehnfingersystem oder die Person"],
    [/(?<!\p{L})(tela|fileira|arquivo|usuário)(?!\p{L})/iu, "brasilianisches Wort"],
    [/(?<!\p{L})linha de base|carrega(?!r)/iu, "„linha“/„carrega“ für Tasten (Glossar Regel 8, §2.1)"],
  ];

  it("kein Maus-Wort, kein „você“, nie „às cegas“, keine BR-Wörter, kein Gedankenstrich, keine fremden Wörter", () => {
    const funde: string[] = [];
    for (const t of TASTATUREN) {
      setLayout(t);
      for (const l of lektionenFuer(WEG))
        for (const [feld, text] of [["title", l.title], ["intro", l.intro]] as const) {
          for (const [m, was] of MUSTER) if (m.test(text)) funde.push(`${t} ${l.id} ${feld}: ${was}`);
          for (const w of text.split(/[^\p{L}]+/u).filter(Boolean)) if (NIE.has(w.toLowerCase())) funde.push(`${t} ${l.id} ${feld}: ${w}`);
        }
    }
    expect(funde).toEqual([]);
  });

  it("Gegenprobe: die Muster schlagen an", () => {
    const treffer = (s: string) => MUSTER.filter(([m]) => m.test(s)).map(([, was]) => was);
    expect(treffer("Clica no botão")).toContain("Maus");
    expect(treffer("Pressione a tecla")).toContain("Höflichkeitsform/BR statt „tu“");
    expect(treffer("escrever às cegas")).toContain("„cego“ für das Zehnfingersystem oder die Person");
    expect(treffer("leitor de tela")).toContain("brasilianisches Wort");
    expect(treffer("a – b")).toContain("Gedankenstrich");
    expect(treffer("Prime a tecla Shift na fila de base.")).toEqual([]);
  });
});

describe("★★★ Jedes Beispielwort einer Einführung ist an seiner Stelle tippbar", () => {
  it("es gibt Beispielwörter (sonst prüft der Wächter nichts)", () => {
    setLayout("pt");
    expect(lektionenFuer(WEG).flatMap((l) => beispielWoerter(ptLektionsVorspannFuer(l.id, l.newKeys))).length).toBeGreaterThan(70);
  });

  for (const t of TASTATUREN) {
    it(`${t}: jedes Wort zwischen "…" passt zum Tastenstand der Lektion`, () => {
      setLayout(t);
      const fehler: string[] = [];
      for (const l of lektionenFuer(WEG))
        for (const w of beispielWoerter(ptLektionsVorspannFuer(l.id, l.newKeys))) if (!tippbar(w, bis(l.id))) fehler.push(`${l.id}: "${w}"`);
      expect(fehler).toEqual([]);
    });
  }

  it("Gegenprobe: ein Akzentwort vor seiner Totaste, ein Wort mit späterer Taste und ein Grossbuchstabe vor Shift fallen auf", () => {
    setLayout("pt");
    expect(tippbar("mãe", bis("pt-pontuacao-1"))).toBe(false);
    expect(tippbar("mãe", bis("pt-til"))).toBe(true);
    expect(tippbar("café", bis("pt-letras-1"))).toBe(false);
    expect(tippbar("café", bis("pt-agudo"))).toBe(true);
    expect(tippbar("Ana", bis("pt-frequentes-4"))).toBe(false);
    expect(tippbar("Ana", bis("pt-maiusculas"))).toBe(true);
  });
});

describe("★★ Griffe (gerechnet, nicht geschrieben)", () => {
  it("ç ist die achte Grundtaste, rechter kleiner Finger", () => {
    setLayout("pt");
    expect(lessonById("pt-base-4")!.intro).toMatch(/Ç \(c com cedilha\): mindinho direito, posição inicial/);
  });

  it("Totasten: der til liegt rechts vom ç, ^ ist Shift + ~; jede sagt „tecla de acento“ und ihre Ziele", () => {
    setLayout("pt");
    expect(lessonById("pt-til")!.intro).toMatch(/til \(~\): mindinho direito, duas teclas à direita da tecla Ç\. É uma tecla de acento/);
    expect(lessonById("pt-til")!.intro).toMatch(/\(ã õ\)/);
    expect(lessonById("pt-circunflexo")!.intro).toMatch(/acento circunflexo \(\^\): segura a tecla Shift com a outra mão e prime a tecla ~/);
  });

  it("Satz- und Sonderzeichen: der Name vor dem Zeichen; € mit Alt Gr", () => {
    setLayout("pt");
    expect(lessonById("pt-pontuacao-2")!.intro).toMatch(/ponto de interrogação \(\?\): segura a tecla Shift com a outra mão e prime a tecla '/);
    expect(lessonById("pt-simbolos-2")!.intro).toMatch(/euro \(€\): segura a tecla Alt Gr e prime a tecla E/);
  });
});
