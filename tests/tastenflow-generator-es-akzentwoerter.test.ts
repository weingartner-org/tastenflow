/**
 * ★★★★★ WÄCHTER M2 (ES-P7a-Behebung, 27.09.2026, Prüfbericht Fundament es):
 * Der GENERATOR (Wort-/Zeichen-Drill) konnte KEIN Wort mit á é í ó ú ü
 * benutzen - auch dann nicht, wenn die Akzent-Totaste (´/¨) UND ihr
 * Grundbuchstabe längst gelernt waren. `filterWords` (und das gleichnamige
 * Sicherheitsnetz in `charDrillLine`) prüfte jedes Zeichen eines Wortes nur
 * gegen die gelernten BUCHSTABEN - die Totaste selbst zählt nicht als
 * Buchstabe, darum waren 114 von 663 spanischen Wörtern (más, está, qué,
 * también, día …) für IMMER gesperrt (Prüfbericht e11/e2: 0 Akzentbuchstaben
 * in 7.260 Zeilen, 605 Runden, KORPUS LEER).
 *
 * Behoben: `filterWords` erkennt (wie `fitText`, `corpus.ts`) einen Totasten-
 * Buchstaben als erlaubt, sobald Totaste UND Grundbuchstabe gelernt sind
 * (`totastenBuchstabeFrei`, EINE Quelle für beide - Leitfaden Falle 32).
 * Zusätzlich musste `adaptiveRound` an drei Stellen `allowedAll` statt
 * `allowedLetters` an `wordDrillZeilen`/den Zeichen-Wortpool reichen - die
 * Totaste selbst steht nur in `allowedAll` (`nurErlaubt`), nie in den reinen
 * „Buchstaben" (`rundenEinheiten().letters`, die nur echte LETTER_RE-Zeichen
 * führt).
 *
 * Geprüft wird die FEHLERKLASSE über den WEG, den ein Kind nimmt
 * (`adaptiveRound`, KEIN Korpus-Text - CORPUS_ES ist leer, siehe Prüfbericht
 * §0): mit gelernter Totaste UND Grundvokal erscheinen á é í ó ú (bzw. ü) in
 * echten Runden, auf ES UND LatAm; ohne die Totaste erscheinen sie NIE
 * (de/en/fr bleiben unberührt - dort gibt es weder „´" noch „¨" im
 * spanischen Sinn).
 *
 * ★ ES-T1 (27.09.2026): CORPUS_ES ist nicht mehr leer - die Kinder-Charge
 * füllt die Runden mit echten Zeilen, und ab dann steht der Wort-Drill nur
 * noch in den Lücken. Damit dieser Wächter weiter DAS prüft, wofür er gebaut
 * ist (den Wort-Weg des Generators), läuft der M2-Teil mit einem LEEREN
 * Korpus (`corpusEntriesFor` gestubbt) - genau die Voraussetzung, unter der
 * er geschrieben wurde. Der Korpus-Weg für á é í ó ú steht im zweiten Block
 * unten (echter Korpus); für ü bringt ihn erst eine spätere Charge (Mitte).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import { adaptiveRound } from "../src/lib/typing/generator";
import * as corpusManifest from "../src/lib/typing/corpusManifest";

afterEach(() => {
  setLayout("de");
  vi.restoreAllMocks();
});

/** Der Korpus-Weg aus: der Generator muss die Runde allein aus Wörtern bauen. */
function ohneKorpus(): void {
  vi.spyOn(corpusManifest, "corpusEntriesFor").mockReturnValue([]);
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mitZufall<T>(seed: number, fn: () => T): T {
  const echt = Math.random;
  Math.random = mulberry32(seed);
  try {
    return fn();
  } finally {
    Math.random = echt;
  }
}

/** Viele Runden aneinandergehängt (ein Kind tippt nicht nur eine). */
function vieleRunden(
  introduced: string[],
  focus: string[],
  seedStart: number,
  n = 40,
  lernweg: "de" | "en" | "fr" | "es" = "es",
): string {
  const texte: string[] = [];
  for (let s = 0; s < n; s++) {
    const zeilen = mitZufall(seedStart + s, () =>
      adaptiveRound({ introduced, focus, stufe: "kids", lang: lernweg, lernweg, count: 12 }),
    );
    for (const z of zeilen) texte.push(z.text);
  }
  return texte.join(" ");
}

describe("★★★★★ M2: der Generator benutzt Wörter mit Akzent-Totaste, sobald sie gelernt ist", () => {
  for (const l of ["es", "latam"] as LayoutId[]) {
    it(`${l}: mit gelernter Totaste ´ UND allen Vokalen stehen á é í ó ú in echten Runden (Korpus leer)`, () => {
      setLayout(l);
      ohneKorpus();
      const o = introOrder("es");
      const mitAkut = o.slice(0, o.indexOf("´") + 1); // … m ´ - alle Vokale UND die Totaste gelernt
      const text = vieleRunden(mitAkut, ["´"], 1000);
      expect(/[áéíóú]/.test(text), text.slice(0, 400)).toBe(true);
    });

    it(`${l}: OHNE die Totaste ´ steht KEIN Akzentbuchstabe in echten Runden`, () => {
      setLayout(l);
      ohneKorpus();
      const o = introOrder("es");
      const ohneAkut = o.slice(0, o.indexOf("´")); // … m - alle Vokale gelernt, Totaste NICHT
      const text = vieleRunden(ohneAkut, ["m"], 2000);
      expect(/[áéíóúÁÉÍÓÚ]/.test(text), text.slice(0, 400)).toBe(false);
    });

    it(`${l}: mit gelernter Trema-Totaste ¨ UND „u" steht ü in echten Runden (Korpus leer)`, () => {
      setLayout(l);
      ohneKorpus();
      const o = introOrder("es");
      const mitTrema = o.slice(0, o.indexOf("¨") + 1); // … ¨ - u und ¨ längst gelernt
      const text = vieleRunden(mitTrema, ["¨"], 3000);
      expect(/ü/.test(text), text.slice(0, 400)).toBe(true);
    });
  }

  it("de/en/fr bleiben unberührt: kein spanischer Akzentbuchstabe (Weg hat kein ´)", () => {
    for (const lernweg of ["de", "en", "fr"] as const) {
      setLayout(lernweg === "fr" ? "fr" : lernweg === "en" ? "us" : "de");
      const o = introOrder(lernweg);
      const text = vieleRunden(o, [], 4000, 20, lernweg);
      expect(/[áíóúñ¿¡]/.test(text), `${lernweg}: ${text.slice(0, 400)}`).toBe(false);
    }
  });
});

describe("ES-T1: mit ECHTEM Korpus (Kinder) kommen á é í ó ú an der ´-Sprosse vor - und keine Sprosse früher", () => {
  for (const l of ["es", "latam"] as LayoutId[]) {
    it(`${l}: an der ´-Sprosse stehen Akzentbuchstaben in echten Runden`, () => {
      setLayout(l);
      const o = introOrder("es");
      const text = vieleRunden(o.slice(0, o.indexOf("´") + 1), ["´"], 5000, 20);
      expect(/[áéíóú]/.test(text), text.slice(0, 400)).toBe(true);
    });

    it(`${l}: eine Sprosse davor steht keiner`, () => {
      setLayout(l);
      const o = introOrder("es");
      const text = vieleRunden(o.slice(0, o.indexOf("´")), ["m"], 6000, 20);
      expect(/[áéíóúÁÉÍÓÚ]/.test(text), text.slice(0, 400)).toBe(false);
    });
  }
});
