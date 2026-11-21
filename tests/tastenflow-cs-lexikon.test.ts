/**
 * ★★★★★ WÄCHTER F8 Tschechisch (03.10.2026): das Vorlese-Lexikon - ein echtes tschechisches Wort wird GANZ gesprochen, nicht buchstabiert
 * (Leitfaden Falle 58: Lexikon VOR den Texten).
 *
 * Vorbild: `tests/tastenflow-it-lexikon.test.ts`. ⚠️ DER UNTERSCHIED: Es gibt KEIN Wörterbuch. Das macOS-Wörterbuch nimmt für Tschechisch jedes
 * Wort an (Falle 61), das Fach besteht aus Wortformen, die in tschechischen Tatoeba-Sätzen mindestens zweimal vorkommen
 * (`scripts/erzeuge-lexikon-nachtrag-cs.mts`). Der Wächter sagt darum auch, was das Fach NICHT kann: Beugungsformen, die dort nie vorkommen
 * (Abschnitt 5 misst die Abdeckung an eigenen Sätzen: 95 %, nicht 99 % wie bei Italienisch mit Wörterbuch).
 */
import { describe, expect, it } from "vitest";
import { isRealWord, lexikonGroesse, lexikonWoerter, normalizeWord } from "../src/lib/typing/lexicon";
import { readPlanAt } from "../src/lib/typing/voice";
import { NACHTRAG_CS } from "../src/lib/typing/lexikonNachtragCs";
import { sprachDaten } from "../src/lib/typing/sprachpakete";
import { gesperrtCs, istKernGesperrtCs } from "../src/lib/typing/sperrlisteCs";
import { STUFE_VOCAB_CS, WORDS_CS } from "../src/lib/typing/wordsCs";

const echt = (w: string) => isRealWord(w, "cs");

describe("1 · normalizeWord(\"cs\"): Akzente, Háček und Kroužek bleiben (Falle 7)", () => {
  it("klein, Satzzeichen und Ziffern fallen weg, alle Buchstaben mit Zeichen bleiben stehen", () => {
    expect(normalizeWord("Čeština,", "cs")).toBe("čeština");
    expect(normalizeWord("„Řeka“!", "cs")).toBe("řeka");
    expect(normalizeWord("Ďábel.", "cs")).toBe("ďábel");
    expect(normalizeWord("DŮM", "cs")).toBe("dům");
    expect(normalizeWord("2026", "cs")).toBe("");
    for (const k of ["á", "č", "ď", "é", "ě", "í", "ň", "ó", "ř", "š", "ť", "ú", "ů", "ý", "ž"]) expect(normalizeWord(`x${k}y`, "cs")).toBe(`x${k}y`);
  });

  it("ohne Sprache und für de/en/fr/es: dieselbe Antwort wie vorher (Čeština bleibt auf de/en „etina“ - Falle 7)", () => {
    expect(normalizeWord("Čeština")).toBe("etina");
    expect(normalizeWord("Čeština", "de")).toBe("etina");
    expect(normalizeWord("Čeština", "en")).toBe("etina");
    expect(normalizeWord("año", "es")).toBe("año");
    expect(normalizeWord("l'ami", "fr")).toBe("l'ami");
  });
});

describe("2 · das tschechische Fach: eigenes Fach, kein Rückfall auf de/en/fr", () => {
  it("das Fach ist gross (Übungswortschatz + Wortformen aus den Sätzen), lexikonWoerter(\"cs\") ist es selbst, nicht das französische", () => {
    expect(lexikonGroesse().cs).toBeGreaterThan(15000);
    expect(lexikonWoerter("cs").length).toBe(lexikonGroesse().cs);
    expect(lexikonWoerter("cs")).toContain("škola");
    expect(lexikonWoerter("cs")).not.toContain("maison");
    // aus dem Sprachpaket (nur über `import()` geladen, nicht im Hauptbündel)
    expect(sprachDaten("cs")?.lexikon[0]).toBe(NACHTRAG_CS);
  });

  it("gewöhnliche Wörter, Wörter mit Háček, Čárka und Kroužek sind echt", () => {
    for (const w of ["dům", "škola", "kolo", "žába", "děti", "hezký", "učitelka", "řeka", "ředitel", "zahrada", "čeština", "kouzlo", "voda", "pes", "kočka", "ahoj", "internet"]) {
      expect(echt(w), w).toBe(true);
    }
  });

  it("Unsinn, Tastenbrei und Wörter anderer Sprachen sind es nicht - kein Rückfall auf Deutsch oder Englisch", () => {
    for (const w of ["qwxz", "dfdf", "kdkd", "xylk", "house", "haus", "maison", "scuola", "casa", "hello", "danke"]) {
      expect(echt(w), w).toBe(false);
    }
  });

  it("jedes Wort der Übungswortlisten ist echt", () => {
    const alle = [...WORDS_CS, ...Object.values(STUFE_VOCAB_CS).flat()];
    expect(alle.filter((w) => w.length >= 2 && !echt(w))).toEqual([]);
  });

  it("★ nur die KERN-Sperrliste ist ausgenommen: Schimpfwörter stehen NICHT im Fach (die Stimme buchstabiert sie), `zemřel`, `zabil`, `sex` schon (sie sind Wortbasis, kein Kern)", () => {
    for (const w of ["kurva", "prdel", "hovno", "idiot", "debil", "kokot"]) expect(echt(w), w).toBe(false);
    expect(lexikonWoerter("cs").filter((w) => istKernGesperrtCs(w))).toEqual([]);
    // Wortbasis: für Wortlisten gesperrt, fürs Vorlesen eines Textes erlaubt
    for (const w of ["zemřel", "zabil", "sex", "hloupý", "alkohol"]) {
      expect(gesperrtCs(w), w).toBe(true);
      expect(echt(w), `${w} muss gesprochen werden, wenn ein Text es braucht`).toBe(true);
    }
  });

  it("de, en, fr, es, it kennen die tschechischen Wörter nicht als ihre (jedes Fach ist ein eigenes)", () => {
    expect(isRealWord("škola", "de")).toBe(false);
    expect(isRealWord("škola", "en")).toBe(false);
    expect(isRealWord("škola", "fr")).toBe(false);
    expect(isRealWord("škola", "es")).toBe(false);
    expect(isRealWord("škola", "it")).toBe(false);
    expect(isRealWord("škola", "cs")).toBe(true);
  });
});

describe("3 · Vorlesen: der Plan spricht das ganze Wort an seinem Anfang", () => {
  const m = { letters: false, words: true, sentences: false, lang: "cs" as const };
  const ganz = (zeile: string, index: number) => readPlanAt(zeile, index, m, (t) => isRealWord(t, "cs"));

  it("Wörter mit Zeichen am Wortanfang: ganz gesprochen (nicht „ř, e, k, a“)", () => {
    expect(ganz("řeka je dlouhá", 0)).toEqual(["řeka"]);
    expect(ganz("žába skáče do vody", 0)).toEqual(["žába"]);
    expect(ganz("dnes je čtvrtek", 8)).toEqual(["čtvrtek"]);
  });

  it("ein Pseudowort wird Buchstabe für Buchstabe gesprochen - auch mit ů am Ende", () => {
    expect(ganz("dalů kasu", 0)).toEqual(["d"]);
  });
});

describe("4 · Das Fach trägt auch, was die Wortliste nicht kennt: jedes Wort einer späteren Text-Charge steht von selbst darin", () => {
  it("(Korpus und Serien füllen das Fach in `buildLexicon` selbst - hier leer, darum der Mechanismus als Beleg: das Fach trägt jedes Wort von WORDS_CS und STUFE_VOCAB_CS)", () => {
    const fach = new Set(lexikonWoerter("cs"));
    for (const w of [...WORDS_CS, ...Object.values(STUFE_VOCAB_CS).flat()]) expect(fach.has(normalizeWord(w, "cs")), w).toBe(true);
  });
});

describe("5 · Abdeckung: typische Sätze sind bis auf Eigennamen weitgehend im Fach (ohne Wörterbuch ehrlich gemessen)", () => {
  const SAETZE = [
    "Dnes je pěkné počasí a děti si hrají na hřišti.",
    "Moje sestra chodí do školy v sousední vesnici.",
    "Babička upekla koláč s jablky a skořicí.",
    "Autobus odjíždí z nádraží každou půlhodinu.",
    "V létě jezdíme s rodiči k moři a plaveme celý den.",
    "Učitelka vysvětlila žákům, jak se píše dlouhé í.",
    "Kdybych měl víc času, přečetl bych tu knihu znovu.",
    "Po obědě jsme šli na procházku podél řeky.",
    "Zítra bude pršet, proto si vezmu deštník.",
    "Pes štěkal celou noc a nikdo nemohl spát.",
    "Na jaře se v lese objevují první sedmikrásky.",
    "Úřad otevírá v pondělí v osm hodin ráno.",
    "Minulý týden jsem navštívil muzeum v Brně.",
    "Máme doma dvě kočky a malého králíka.",
    "Čtení je nejlepší způsob, jak se naučit nová slova.",
    "Když sněží, děti stavějí sněhuláka před domem.",
    "Lékař mi doporučil více odpočívat a pít vodu.",
    "Naše třída pojede na výlet do hor.",
    "Maminka vaří polévku a tatínek čte noviny.",
    "Hodiny ukazují půl desáté a už je čas jít spát.",
  ];

  function messen(): { gesamt: number; gedeckt: number; fehlt: string[] } {
    let gesamt = 0;
    let gedeckt = 0;
    const fehlt: string[] = [];
    for (const satz of SAETZE) {
      satz.split(/\s+/).forEach((tok, i) => {
        if (normalizeWord(tok, "cs").length < 2) return;
        // ein Eigenname mitten im Satz (gross geschrieben): im Fach über die Text-Chargen
        if (i > 0 && /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/.test(tok)) return;
        gesamt++;
        if (echt(tok)) gedeckt++;
        else fehlt.push(tok);
      });
    }
    return { gesamt, gedeckt, fehlt };
  }

  it("Messwert: mindestens 92 % aller Wörter der Beispielsätze stehen im Fach (gemessen 95 % - Italienisch mit Wörterbuch: über 99 %)", () => {
    const { gesamt, gedeckt } = messen();
    expect(gesamt).toBeGreaterThan(120);
    expect(gedeckt / gesamt).toBeGreaterThan(0.92);
  });

  it("★ die Schwäche ist benannt: seltene Beugungsformen fehlen (jablky, skořicí, žákům, plaveme) - ein Text mit ihnen wird an ihnen buchstabiert, bis eine Formenliste da ist", () => {
    const { fehlt } = messen();
    expect(fehlt.length).toBeGreaterThan(0);
    expect(fehlt.length).toBeLessThan(12);
  });

  it("die Prüfung findet etwas: ein Satz mit einem Unwort wird gemeldet", () => {
    const woerter = "Pes qwxzk spí doma".split(" ");
    expect(woerter.filter((w) => !isRealWord(w, "cs"))).toEqual(["qwxzk"]);
  });
});
