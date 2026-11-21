/**
 * ★★★★★ WÄCHTER F8 Italienisch (02.10.2026): das Vorlese-Lexikon - ein echtes italienisches Wort wird GANZ gesprochen,
 * nicht buchstabiert (Leitfaden Falle 58: Lexikon VOR den Texten).
 *
 * Vorbild: `tests/tastenflow-e12-sprachausgabe-franzoesisch.test.ts` und der Lexikon-Teil von
 * `tests/tastenflow-sprachausgabe-es.test.ts`. Dazu die Elision (`l'amico`), die es im Spanischen nicht gibt:
 * `normalizeWord` behält den Apostroph im Wort, `isRealWord` erkennt bekannter Anfang + Apostroph + echtes Wort.
 */
import { describe, expect, it } from "vitest";
import {
  isRealWord,
  istElisionIt,
  lexikonGroesse,
  lexikonWoerter,
  normalizeWord,
} from "../src/lib/typing/lexicon";
import { readPlanAt } from "../src/lib/typing/voice";
import { NACHTRAG_IT } from "../src/lib/typing/lexikonNachtragIt";
import { sprachDaten } from "../src/lib/typing/sprachpakete";
import { gesperrtIt } from "../src/lib/typing/sperrlisteIt";
import { STUFE_VOCAB_IT, WORDS_IT } from "../src/lib/typing/wordsIt";

const echt = (w: string) => isRealWord(w, "it");

describe("1 · normalizeWord(\"it\"): Akzente und Apostroph bleiben (Falle 7)", () => {
  it("klein, Satzzeichen und Ziffern fallen weg, Akzente und der Apostroph im Wort bleiben", () => {
    expect(normalizeWord("Perché,", "it")).toBe("perché");
    expect(normalizeWord("«Città»!", "it")).toBe("città");
    expect(normalizeWord("L'amico.", "it")).toBe("l'amico");
    expect(normalizeWord("un'ora", "it")).toBe("un'ora");
    expect(normalizeWord("PIÙ", "it")).toBe("più");
    expect(normalizeWord("2026", "it")).toBe("");
  });

  it("alle sechs Akzentbuchstaben bleiben stehen - è und é sind zwei Buchstaben", () => {
    for (const k of ["à", "è", "é", "ì", "ò", "ù"]) expect(normalizeWord(`x${k}y`, "it")).toBe(`x${k}y`);
  });

  it("ohne Sprache und für de/en/fr/es: dieselbe Antwort wie vorher (Café bleibt auf de/en „caf“, Apostroph fällt weg)", () => {
    expect(normalizeWord("Café")).toBe("caf");
    expect(normalizeWord("l'ami", "de")).toBe("lami");
    expect(normalizeWord("l'ami", "en")).toBe("lami");
    expect(normalizeWord("año", "es")).toBe("año");
  });
});

describe("2 · das italienische Fach: eigenes Fach, kein Rückfall auf de/en", () => {
  it("das Fach ist gross (Übungswortschatz + Nachtrag aus Tatoeba-Originalen), lexikonWoerter(\"it\") ist es selbst", () => {
    expect(lexikonGroesse().it).toBeGreaterThan(15000);
    expect(lexikonWoerter("it").length).toBe(lexikonGroesse().it);
    // aus dem Sprachpaket (nur über `import()` geladen, nicht im Hauptbündel)
    expect(sprachDaten("it")?.lexikon[0]).toBe(NACHTRAG_IT);
  });

  it("gewöhnliche Wörter, Akzentwörter und die neun Paare sind echt", () => {
    for (const w of ["casa", "pizza", "scuola", "ragazzo", "gelato", "perché", "città", "più", "così", "lunedì", "andò", "università", "tè", "caffè", "né", "sì", "lì", "là"]) {
      expect(echt(w), w).toBe(true);
    }
  });

  it("Unsinn, Tastenbrei und Wörter anderer Sprachen sind es nicht - kein Rückfall auf Deutsch oder Englisch", () => {
    for (const w of ["qwxz", "dfdf", "dòda", "kdkd", "lamico", "xylon", "house", "haus", "maison", "estacion", "hello", "danke"]) {
      expect(echt(w), w).toBe(false);
    }
  });

  it("jedes Wort der Übungswortlisten ist echt (Elisionen über die Regel, einbuchstabige ausgenommen)", () => {
    const alle = [...WORDS_IT, ...Object.values(STUFE_VOCAB_IT).flat()];
    expect(alle.filter((w) => w.length >= 2 && !echt(w))).toEqual([]);
  });

  it("gesperrte Wörter stehen NICHT im Fach - die Stimme buchstabiert sie, statt sie ganz zu sprechen", () => {
    for (const w of ["cazzo", "mona", "culo", "pisello", "stupido", "porco"]) expect(echt(w), w).toBe(false);
    expect(lexikonWoerter("it").filter((w) => gesperrtIt(w))).toEqual([]);
  });

  it("de, en, fr, es kennen die italienischen Wörter nicht als ihre (jedes Fach ist ein eigenes)", () => {
    expect(isRealWord("scuola", "de")).toBe(false);
    expect(isRealWord("scuola", "en")).toBe(false);
    expect(isRealWord("scuola", "fr")).toBe(false);
    expect(isRealWord("scuola", "es")).toBe(false);
    expect(isRealWord("scuola", "it")).toBe(true);
  });
});

describe("3 · Elision: l'amico, un'ora, dell'acqua, c'è, po' sind GANZE Wörter", () => {
  it("bekannter Anfang + Apostroph + echtes Wort", () => {
    for (const w of ["l'amico", "un'ora", "dell'acqua", "c'è", "all'inizio", "quest'anno", "anch'io", "dov'è", "com'è", "nient'altro", "d'estate", "un'amica", "sull'albero", "gliel'ho", "po'"]) {
      expect(echt(w), w).toBe(true);
    }
  });

  it("die Gegenprobe: ein unbekannter Anfang oder ein Unwort dahinter ist keine Elision", () => {
    for (const w of ["xl'amico", "qwxz'ora", "l'qwxz", "kl'ora", "l''amico", "'", "''"]) expect(echt(w), w).toBe(false);
  });

  it("ein als Anführungszeichen benutzter Apostroph stört nicht (‘ciao’ ⇒ ciao)", () => {
    expect(echt("'ciao'")).toBe(true);
    expect(echt("ciao'")).toBe(true);
    expect(echt("'xyzq'")).toBe(false);
  });

  it("istElisionIt ist rein: Menge hinein, Antwort heraus", () => {
    const fach = new Set(["amico", "ora"]);
    expect(istElisionIt("l'amico", fach)).toBe(true);
    expect(istElisionIt("un'ora", fach)).toBe(true);
    expect(istElisionIt("c'è", fach)).toBe(true); // einbuchstabig: è, e, a, o, i
    expect(istElisionIt("l'xyz", fach)).toBe(false);
    expect(istElisionIt("xyz'ora", fach)).toBe(false);
    expect(istElisionIt("amico", fach)).toBe(false); // keine Elision, kein Apostroph
  });
});

describe("4 · Vorlesen: der Plan spricht das ganze Wort an seinem Anfang", () => {
  const m = { letters: false, words: true, sentences: false, lang: "it" as const };
  const ganz = (zeile: string, index: number) => readPlanAt(zeile, index, m, (t) => isRealWord(t, "it"));

  it("Akzentwörter am Wortanfang: ganz gesprochen (nicht „p, e, r, c, h, e“)", () => {
    expect(ganz("perché no", 0)).toEqual(["perché"]);
    expect(ganz("la città è bella", 3)).toEqual(["città"]);
    expect(ganz("più o meno", 0)).toEqual(["più"]);
  });

  it("Elision: das ganze Wort „l'amico“ am Anfang, der Apostroph in der Mitte beim Namen", () => {
    expect(ganz("l'amico è qui", 0)).toEqual(["l'amico"]);
    expect(ganz("l'amico è qui", 1)).toEqual(["apostrofo"]);
    expect(ganz("dov'è la scuola", 0)).toEqual(["dov'è"]);
  });

  it("ein Pseudowort wird Buchstabe für Buchstabe gesprochen - auch mit Akzent am Ende", () => {
    expect(ganz("dalò kasu", 0)).toEqual(["d"]);
    expect(ganz("dalò kasu", 3)).toEqual(["o con accento grave"]);
  });
});

describe("5 · Abdeckung: typische Sätze sind bis auf Eigennamen vollständig im Fach (Falle 58 - Lexikon vor den Texten)", () => {
  const SAETZE = [
    "Ho una sorella piccola e un fratello più grande.",
    "Oggi il sole splende sulla spiaggia e i bambini giocano a pallone.",
    "Dopo la scuola andiamo al parco con i nostri amici.",
    "Mia nonna prepara la pasta con il pomodoro e il basilico.",
    "L'insegnante legge una storia sulla montagna e sul mare.",
    "Perché il cielo è azzurro? Perché la luce si spezza nell'aria.",
    "Il treno parte alle otto e arriva in città dopo un'ora.",
    "Per Carnevale i bambini indossano una maschera e cantano canzoni allegre.",
    "La Befana porta i regali la notte del cinque gennaio.",
    "Il lunedì e il venerdì vado in biblioteca a studiare.",
    "Nell'aula c'è un grande tavolo con quattro sedie rosse.",
    "Non c'è niente di meglio di un gelato in estate.",
    "Quest'anno la nostra squadra ha vinto il campionato.",
    "Il medico ha detto che devo bere molta acqua e dormire di più.",
    "Gli studenti scrivono una ricerca sul clima e sull'ambiente.",
    "L'azienda cerca una persona che sappia lavorare in gruppo.",
    "Il comune ha aperto un nuovo ufficio per i cittadini.",
    "Con il contratto d'affitto arriva anche la bolletta della luce.",
    "Dobbiamo costruire un futuro più giusto per tutte le persone.",
    "Il museo è aperto dal martedì alla domenica, anche di sera.",
  ];

  it("nach dem Entfernen der Eigennamen ist jedes Wort der Sätze echt (alle 20 Sätze)", () => {
    const fehlend: string[] = [];
    for (const satz of SAETZE) {
      const woerter = satz.split(/\s+/);
      woerter.forEach((tok, i) => {
        // ein Eigenname mitten im Satz: gross geschrieben (hier: Carnevale/Befana sind Festnamen, im Fach über Text-Chargen)
        if (i > 0 && /^[A-ZÀÈÉÌÒÙ]/.test(tok)) return;
        if (normalizeWord(tok, "it").length >= 2 && !isRealWord(tok, "it")) fehlend.push(`${tok} (${satz.slice(0, 24)}…)`);
      });
    }
    expect(fehlend).toEqual([]);
  });

  it("Messwert: über 99 % aller Wörter der Beispielsätze stehen im Fach (Tatoeba-Wortformen mit mindestens drei Belegen, vom Wörterbuch bestätigt)", () => {
    let gesamt = 0;
    let gedeckt = 0;
    for (const satz of SAETZE) {
      for (const tok of satz.split(/\s+/)) {
        if (normalizeWord(tok, "it").length < 2 || /^[A-ZÀÈÉÌÒÙ]/.test(tok.slice(0, 1)) && !satz.startsWith(tok)) continue;
        gesamt++;
        if (isRealWord(tok, "it")) gedeckt++;
      }
    }
    expect(gesamt).toBeGreaterThan(150);
    expect(gedeckt / gesamt).toBeGreaterThan(0.99);
  });

  it("die Prüfung findet etwas: ein Satz mit einem Unwort wird gemeldet", () => {
    const woerter = "Il cane qwxzk dorme nella casa".split(" ");
    expect(woerter.filter((w) => !isRealWord(w, "it"))).toEqual(["qwxzk"]);
  });
});
