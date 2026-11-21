/**
 * ★★★ WÄCHTER: die Rate-Wörter der Polarstation auf Weg „es" (ES-S,
 * 27.09.2026, Bauplan spanischer Lehrgang §5.1). Modell:
 * `tests/tastenflow-expedition-fr.test.ts`.
 *
 * Bis hierher war der Vorrat für Weg „es" leer (ES-F2) - die Zone entfiel.
 * Geprüft wird die Liste selbst (Form, Hausregeln, Sperrliste) und der Weg,
 * auf dem die Station sie zieht (`stationGuessWords`), an JEDER Sprosse der
 * spanischen Reihenfolge und auf BEIDEN Pflicht-Tastaturen (ES und LatAm).
 */
import { afterEach, describe, expect, it } from "vitest";
import { WORDS_EN, WORDS_ES_EXPEDITION, WORDS_FR_EXPEDITION, stationGuessWords } from "@/lib/typing/expedition/words";
import { WORDS } from "@/lib/typing/words";
import { lernwegDef } from "@/lib/typing/lernweg";
import { SHIFT_UNIT, introOrder } from "@/lib/typing/letters";
import { setLayout } from "@/lib/typing/layouts";

const LISTE = WORDS_ES_EXPEDITION;

/** Sperrliste wie `scripts/messe-worthaeufigkeit-es.py` - hier ergänzt um Wörter, die nur regional so heissen. */
const SPERR_STAEMME = [
  "coj", "cog", "concha", "poll", "papay", "pico", "paja", "chaquet", "bich", "cach", "pendej", "culo",
  "verga", "jod", "coñ", "cabron", "pinche", "ching", "huevon", "bolud", "mamad", "cipote",
];
const SPERR_WOERTER = new Set([
  "os", "sois", "coche", "patinete", "ordenador", "zumo", "gafas", "vale", "tío", "tía", "guay", "chulo",
  "mola", "currar", "tonto", "tonta", "feo", "fea", "gordo", "gorda", "idiota",
  // nur regional (variantenneutral, Bauplan §5.3)
  "papa", "patata", "jugo", "choclo", "carro", "auto", "celular", "movil", "cancha", "guagua", "palta", "frijol",
]);
function gesperrt(w: string): boolean {
  return SPERR_WOERTER.has(w) || SPERR_STAEMME.some((s) => w.includes(s)) || /(ais|eis)$/.test(w);
}

afterEach(() => setLayout("de"));

describe("★ WORDS_ES_EXPEDITION: Form und Hausregeln", () => {
  it("rund 250 Wörter, jedes nur einmal", () => {
    expect(LISTE.length).toBeGreaterThanOrEqual(240);
    expect(LISTE.filter((w, i) => LISTE.indexOf(w) !== i)).toEqual([]);
  });

  it("klein, 2 bis 6 Buchstaben, nur Buchstaben mit EINER Taste (a-z, ñ - kein á é í ó ú ü)", () => {
    expect(LISTE.filter((w) => !/^[a-zñ]{2,6}$/.test(w))).toEqual([]);
  });

  it("keine Sperrwörter, kein vosotros, nichts nur Regionales", () => {
    expect(LISTE.filter(gesperrt)).toEqual([]);
  });

  it("Gegenprobe: ein Sperrwort, ein Stamm, eine regionale Form und eine vosotros-Form fallen auf", () => {
    expect(["pollo", "coche", "jugo", "cantais", "casa"].filter(gesperrt)).toEqual(["pollo", "coche", "jugo", "cantais"]);
  });

  it("Bezug zur spanischsprachigen Welt: Tiere, Essen und Orte von dort sind dabei", () => {
    for (const w of ["llama", "vicuña", "iguana", "jaguar", "coyote", "tapir", "quena", "cacao", "tango", "hamaca", "yuca", "cayo"])
      expect(LISTE, w).toContain(w);
  });

  it("keine Übernahme aus den anderen Listen - ausser Wörtern, die im Spanischen genauso heissen", () => {
    // Geprüft am 27.09.2026: jedes dieser Wörter ist Spanisch in genau dieser Schreibung.
    const GLEICH = new Set(["koala", "total", "idea", "animal", "piano", "tango", "taxi", "extra", "kiwi", "wifi", "web",
      "puma", "tapir", "mango", "gorila", "jaguar", "iguana", "cactus", "cacao", "coral", "orca", "sirena", "llama", "hamaca", "dos", "cola", "moto", "miel", "tigre", "examen"]);
    const andere = new Set([...WORDS.map((w) => w.toLowerCase()), ...WORDS_EN, ...WORDS_FR_EXPEDITION]);
    expect(LISTE.filter((w) => andere.has(w) && !GLEICH.has(w))).toEqual([]);
  });
});

describe("★★★ stationGuessWords zieht auf Weg „es“ nur aus der spanischen Liste - an jeder Sprosse", () => {
  const es = new Set(LISTE);
  for (const tastatur of ["es", "latam"] as const) {
    it(`${tastatur}: ab „e“ drei Wörter je Besuch, alle aus der Liste, alle mit dem Stand tippbar`, () => {
      setLayout(tastatur);
      const reihenfolge = introOrder("es");
      const fehler: string[] = [];
      for (let n = reihenfolge.indexOf("e") + 1; n <= reihenfolge.length; n++) {
        const stand = reihenfolge.slice(0, n);
        const erlaubt = new Set(stand.filter((u) => u !== SHIFT_UNIT));
        for (const seed of [0, 5, 17]) {
          const woerter = stationGuessWords(stand, { lernweg: "es", seed });
          if (woerter.length !== 3) fehler.push(`${n} (${stand[n - 1]}), Samen ${seed}: ${woerter.length} Wörter`);
          for (const w of woerter) {
            if (!es.has(w)) fehler.push(`${n}: „${w}" nicht in der Liste`);
            if (![...w].every((c) => erlaubt.has(c))) fehler.push(`${n}: „${w}" nicht tippbar`);
          }
        }
      }
      expect(fehler).toEqual([]);
    });
  }

  it("jede Sprosse mit neuem Rate-Buchstaben bringt eigene Wörter (sonst ist die Liste falsch geschnitten)", () => {
    const buchstaben = lernwegDef("es").letterOrder.filter((u) => /^[a-zñ]$/.test(u));
    const ohne: string[] = [];
    for (let i = buchstaben.indexOf("e"); i < buchstaben.length; i++) {
      const vorher = new Set(buchstaben.slice(0, i));
      const neu = buchstaben[i];
      if (!LISTE.some((w) => w.includes(neu) && [...w].every((c) => c === neu || vorher.has(c)))) ohne.push(neu);
    }
    expect(ohne).toEqual([]);
  });

  it("Gegenprobe: Weg „de“ zieht weiter deutsch, Weg „fr“ weiter französisch", () => {
    const de = new Set(WORDS.map((w) => w.toLowerCase()));
    for (const w of stationGuessWords([...lernwegDef("de").letterOrder], { seed: 1 })) expect(de.has(w.toLowerCase())).toBe(true);
    for (const w of stationGuessWords([...lernwegDef("fr").letterOrder], { lernweg: "fr", seed: 1 })) expect(WORDS_FR_EXPEDITION).toContain(w);
  });

  it("nichts wird grossgeschrieben (Nomen gross ist Deutsch)", () => {
    for (const seed of [0, 1, 2, 3])
      for (const w of stationGuessWords([...lernwegDef("es").introOrder], { lernweg: "es", seed, shiftLearned: true })) expect(w).toBe(w.toLowerCase());
  });
});
