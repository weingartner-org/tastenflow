/**
 * ★★★ WÄCHTER: WORD ROOTS - die englische Übungsvorlage (Auftrag Johannes,
 * 24.09.2026, Modell: `tests/typing-vorlagen-neu.test.ts` für die deutsche
 * Fremdwörterkunde).
 *
 * Was hier gemessen wird (nicht behauptet):
 *  1. Vier Themen, in allen drei Stufen mit derselben Kennung und demselben
 *     Titel; je Thema genau 20 Paare, macht 80 je Stufe und 240 insgesamt.
 *  2. Jede Zeile (`clue - word`) höchstens 40 Zeichen (Braillezeile), nur
 *     a-z A-Z 0-9 Leerzeichen und der echte Bindestrich, kein Apostroph,
 *     kein doppeltes/randständiges Leerzeichen, genau EIN Trenner.
 *  3. `word` ist ein Einzelwort ohne Bindestrich/Leerzeichen; `clue` enthält
 *     das Wort nicht.
 *  4. Kein Wort kommt zweimal vor - weder in einer Stufe noch stufenübergreifend.
 *  5. Keine US/UK-Schreibvariante taucht auf (weder als `word` noch als Teil
 *     eines `clue`-Worts) - die Vorlage muss auf beiden Seiten des Atlantiks
 *     unverändert lesbar sein.
 *  6. `WORD_ROOTS_ALPHABETISCH` trägt je Stufe GENAU dieselben 80 Zeilen wie
 *     `WORD_ROOTS`, nur alphabetisch nach `clue` geordnet.
 */
import { describe, expect, it } from "vitest";
import {
  WORD_ROOT_THEMEN,
  WORD_ROOTS,
  WORD_ROOTS_ALPHABETISCH,
  wordRootZeile,
  type WordRootStufe,
} from "@/lib/typing/vorlagenDaten/wordRoots";

const STUFEN: WordRootStufe[] = ["kids", "teens", "erwachsen"];
const ERLAUBT = /^[A-Za-z0-9 -]+$/;

// Exakte Wörter (keine Teilzeichenketten - sonst schlagen echte Wörter wie
// "bisect" oder "citizen" fälschlich an) einer bekannten US/UK- oder
// sonstigen Variantenschreibung. Beide Seiten des Paares stehen hier, damit
// keine der beiden je vorkommen darf.
const VARIANTEN = new Set([
  "color", "colour", "center", "centre", "program", "programme",
  "theater", "theatre", "meter", "metre", "liter", "litre",
  "aluminum", "aluminium", "gray", "grey", "defense", "defence",
  "catalog", "catalogue", "practice", "practise",
  "labor", "labour", "honor", "honour", "neighbor", "neighbour",
  "favor", "favour", "favorite", "favourite",
  "traveled", "travelled", "traveling", "travelling",
  "canceled", "cancelled", "canceling", "cancelling",
  "modeling", "modelling", "jewelry", "jewellery",
  "mold", "mould", "yogurt", "yoghurt", "cheque", "check",
  "kerb", "curb", "tyre", "tire", "aeroplane", "airplane",
  "mom", "mum", "math", "maths",
  "organize", "organise", "organized", "organised",
  "realize", "realise", "realized", "realised",
  "recognize", "recognise", "recognized", "recognised",
  "apologize", "apologise", "apologized", "apologised",
  "analyze", "analyse", "analyzed", "analysed",
  "specialize", "specialise", "specialized", "specialised",
]);

describe("★ Word roots: die Wörter", () => {
  it("vier Themen, in allen Stufen mit derselben Kennung und demselben Titel", () => {
    expect(WORD_ROOT_THEMEN).toHaveLength(4);
    for (const s of STUFEN) {
      expect(WORD_ROOTS[s].map((t) => [t.id, t.titel]), s).toEqual(
        WORD_ROOT_THEMEN.map((t) => [t.id, t.titel]),
      );
    }
  });

  it.each(STUFEN)("%s: je Thema genau 20 Paare, zusammen 80", (s) => {
    for (const t of WORD_ROOTS[s]) expect(t.paare, `${s}/${t.id}`).toHaveLength(20);
    expect(WORD_ROOTS[s].flatMap((t) => t.paare)).toHaveLength(80);
  });

  it("zusammen genau 240 Paare", () => {
    expect(STUFEN.flatMap((s) => WORD_ROOTS[s].flatMap((t) => t.paare))).toHaveLength(240);
  });

  it.each(STUFEN)("%s: jede Zeile höchstens 40 Zeichen, nur tippbare Zeichen, sauberer Trenner", (s) => {
    for (const p of WORD_ROOTS[s].flatMap((t) => t.paare)) {
      const zeile = wordRootZeile(p);
      expect(zeile.length, zeile).toBeLessThanOrEqual(40);
      expect(zeile, zeile).toMatch(ERLAUBT);
      expect(zeile, zeile).not.toMatch(/ {2}|^ | $/);
      // Genau EIN Trenner - sonst ist nicht zu sehen, wo das Wort beginnt.
      expect(zeile.split(" - "), zeile).toHaveLength(2);
      expect(p.word, zeile).not.toMatch(/[ -]/);
      expect(p.clue.toLowerCase(), zeile).not.toContain(p.word.toLowerCase());
    }
  });

  it("kein Wort doppelt - weder in einer Stufe noch über die Stufen hinweg", () => {
    const gesehen = new Map<string, string>();
    for (const s of STUFEN) {
      for (const p of WORD_ROOTS[s].flatMap((t) => t.paare)) {
        const schluessel = p.word.toLowerCase();
        expect(gesehen.has(schluessel), `${p.word} steht in ${gesehen.get(schluessel)} und in ${s}`).toBe(false);
        gesehen.set(schluessel, s);
      }
    }
  });

  it.each(STUFEN)("%s: keine US/UK-Variantenschreibung, weder als Wort noch im Hinweis", (s) => {
    for (const p of WORD_ROOTS[s].flatMap((t) => t.paare)) {
      const zeile = wordRootZeile(p);
      const worte = [p.word.toLowerCase(), ...p.clue.toLowerCase().split(/[ -]+/)];
      for (const w of worte) {
        expect(VARIANTEN.has(w), `"${w}" in "${zeile}" ist eine US/UK-Variantenschreibung`).toBe(false);
      }
    }
  });

  it.each(STUFEN)("%s: jedes Paar trägt eine Herkunft", (s) => {
    for (const p of WORD_ROOTS[s].flatMap((t) => t.paare)) {
      expect(p.herkunft, wordRootZeile(p)).toBeTruthy();
    }
  });
});

describe("★★ Word roots: die alphabetische Liste trägt dieselben Wörter", () => {
  it.each(STUFEN)("%s: WORD_ROOTS_ALPHABETISCH ist eine Umordnung von WORD_ROOTS, keine andere Menge", (s) => {
    const themen = WORD_ROOTS[s].flatMap((t) => t.paare).map(wordRootZeile).sort();
    const alphabetisch = [...WORD_ROOTS_ALPHABETISCH[s]].sort();
    expect(alphabetisch).toEqual(themen);
  });

  it.each(STUFEN)("%s: WORD_ROOTS_ALPHABETISCH ist wirklich alphabetisch (nach clue) geordnet", (s) => {
    const zeilen = WORD_ROOTS_ALPHABETISCH[s];
    const clues = zeilen.map((z) => z.split(" - ")[0]);
    expect(clues).toEqual([...clues].sort((a, b) => a.localeCompare(b, "en")));
  });

  it.each(STUFEN)("%s: die alphabetische Liste ist eine andere Reihenfolge als die Themen-Liste", (s) => {
    const themenReihenfolge = WORD_ROOTS[s].flatMap((t) => t.paare).map(wordRootZeile);
    expect(WORD_ROOTS_ALPHABETISCH[s]).not.toEqual(themenReihenfolge);
  });
});
