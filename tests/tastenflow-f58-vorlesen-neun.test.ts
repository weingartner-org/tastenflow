/**
 * ★★★★★ WÄCHTER F58 (29.10.2026): die Sprachausgabe der neun Wege bg, el, hu, nl, pt, br, ro, sv, uk.
 *
 * GEMESSEN VOR DEM BAU (29.10.2026, Befund `BEFUND-2026-10-29-F58-SPRACHAUSGABE.md`): `isRealWord` hatte für die neun kein Fach und fiel in
 * den de+en-Topf - von den Korpus-Wörtern (Charge 1) waren bg 0 %, el 0 %, uk 0 %, hu 4 %, sv 10 %, nl 31 % „echt" (nl nur über deutsche und
 * englische Zufallstreffer); JEDE Korpuszeile hatte mindestens ein buchstabiertes Wort, an „Днес" sagte die Stimme „capital Д".
 * `lexikonWoerter("bg")` lieferte das FRANZÖSISCHE Fach. Die Zeichennamen waren englisch („space", „full stop", „capital …"), und
 * `firstVoiceURIForLang("br")` fand keine brasilianische Stimme (sie heissen „pt-BR").
 *
 * Vorbilder: `tastenflow-cs-lexikon.test.ts`, `tastenflow-sprachausgabe-cs.test.ts`. Ein gemeinsamer Wächter mit `describe.each`, weil die
 * neun über EINEN Verteiler laufen (`geruestWoerter.ts`, `ZEICHENNAMEN_DER_NEUEN_SPRACHEN`) - neun Kopien wären neun Stellen.
 */
import { describe, expect, it } from "vitest";
import { isRealWord, lexikonWoerter, normalizeWord } from "../src/lib/typing/lexicon";
import { readPlanAt, wordStartIndex } from "../src/lib/typing/voice";
import { spokenLabel } from "../src/lib/typing/fingers";
import { korpusFuer } from "../src/lib/typing/corpus";
import { sprachDaten } from "../src/lib/typing/sprachpakete";
import { LAYOUTS, TASTATUREN_DER_SPRACHE } from "../src/lib/typing/layouts";
import { GERUEST_KERN_GESPERRT, GERUEST_WORDS } from "../src/lib/typing/geruestWoerter";
import { GERUEST_SPRACHEN, type GeruestSprache } from "../src/lib/typing/sprachRegister";
import { SPRACH_TAG } from "../src/lib/typing/vorlesen";
import { stimmKuerzel } from "../src/lib/typing/stimmKuerzel";
import { stimmeBeimEinschalten } from "../src/lib/typing/stimmHinweis";
import { stimmenZurAuswahl } from "../src/lib/typing/stimmenAuswahl";
import { ZEICHENNAMEN_BG } from "../src/lib/typing/zeichenNamenBg";
import { ZEICHENNAMEN_EL } from "../src/lib/typing/zeichenNamenEl";
import { ZEICHENNAMEN_HU } from "../src/lib/typing/zeichenNamenHu";
import { ZEICHENNAMEN_NL } from "../src/lib/typing/zeichenNamenNl";
import { ZEICHENNAMEN_PT } from "../src/lib/typing/zeichenNamenPt";
import { ZEICHENNAMEN_BR } from "../src/lib/typing/zeichenNamenBr";
import { ZEICHENNAMEN_RO } from "../src/lib/typing/zeichenNamenRo";
import { ZEICHENNAMEN_SV } from "../src/lib/typing/zeichenNamenSv";
import { ZEICHENNAMEN_UK } from "../src/lib/typing/zeichenNamenUk";
import { NACHTRAG_BG } from "../src/lib/typing/lexikonNachtragBg";
import { NACHTRAG_EL } from "../src/lib/typing/lexikonNachtragEl";
import { NACHTRAG_HU } from "../src/lib/typing/lexikonNachtragHu";
import { NACHTRAG_NL } from "../src/lib/typing/lexikonNachtragNl";
import { NACHTRAG_PT } from "../src/lib/typing/lexikonNachtragPt";
import { NACHTRAG_BR } from "../src/lib/typing/lexikonNachtragBr";
import { NACHTRAG_RO } from "../src/lib/typing/lexikonNachtragRo";
import { NACHTRAG_SV } from "../src/lib/typing/lexikonNachtragSv";
import { NACHTRAG_UK } from "../src/lib/typing/lexikonNachtragUk";
import type { Lang } from "../src/lib/typing/account";

const NAMEN: Record<GeruestSprache, Readonly<Record<string, string>>> = {
  bg: ZEICHENNAMEN_BG, el: ZEICHENNAMEN_EL, hu: ZEICHENNAMEN_HU, nl: ZEICHENNAMEN_NL, pt: ZEICHENNAMEN_PT,
  br: ZEICHENNAMEN_BR, ro: ZEICHENNAMEN_RO, sv: ZEICHENNAMEN_SV, uk: ZEICHENNAMEN_UK,
};
const NACHTRAG: Record<GeruestSprache, readonly string[]> = {
  bg: NACHTRAG_BG, el: NACHTRAG_EL, hu: NACHTRAG_HU, nl: NACHTRAG_NL, pt: NACHTRAG_PT,
  br: NACHTRAG_BR, ro: NACHTRAG_RO, sv: NACHTRAG_SV, uk: NACHTRAG_UK,
};

/** Je Weg: ein Wort mit den Buchstaben der Sprache (normalisiert wie es im Fach steht) und ein Satz aus seinem Korpus-Wortschatz. */
const PROBE: Record<GeruestSprache, { wort: string; gross: string; grossName: string; sonder: [string, string] }> = {
  bg: { wort: "училище", gross: "Д", grossName: "главно дъ", sonder: ["й", "и кратко"] },
  el: { wort: "σχολείο", gross: "Ά", grossName: "κεφαλαίο άλφα με τόνο", sonder: [";", "ερωτηματικό"] },
  hu: { wort: "iskolába", gross: "Ő", grossName: "nagy hosszú ő", sonder: ["ő", "hosszú ő"] },
  nl: { wort: "ochtend", gross: "Ë", grossName: "hoofdletter e met trema", sonder: ["-", "koppelteken"] },
  pt: { wort: "bicicleta", gross: "Ç", grossName: "maiúscula c com cedilha", sonder: ["ã", "a com til"] },
  br: { wort: "devagar", gross: "É", grossName: "e maiúsculo com acento agudo", sonder: ["#", "cerquilha"] },
  ro: { wort: "învățat", gross: "Ș", grossName: "s cu virgulă, mare", sonder: ["ă", "a cu căciulă"] },
  sv: { wort: "skolan", gross: "Å", grossName: "stort å", sonder: ["@", "snabel-a"] },
  uk: { wort: "квіти", gross: "Ї", grossName: "велика ї", sonder: ["ь", "м'який знак"] },
};

const eigeneZeilen = (l: GeruestSprache) => korpusFuer(l as Lang).filter((z) => z.nurWeg === l);

/** Die Wörter einer Zeile, wie `readPlanAt` sie an jedem Wortanfang sieht (ohne Satzzeichen, mindestens zwei Buchstaben). */
function wortanfaenge(zeile: string): number[] {
  const aus: number[] = [];
  for (let i = 0; i < zeile.length; i++) if (zeile[i] !== " " && wordStartIndex(zeile, i) === i) aus.push(i);
  return aus;
}

describe.each(GERUEST_SPRACHEN)("Weg %s", (l) => {
  const echt = (w: string) => isRealWord(w, l);

  describe("1 · das Vorlese-Lexikon: eigenes Fach", () => {
    it("ein Wort der Sprache ist echt, Tastenbrei und Wörter anderer Sprachen nicht - kein Rückfall auf den de+en-Topf", () => {
      expect(echt(PROBE[l].wort), PROBE[l].wort).toBe(true);
      for (const w of ["qwxz", "dfdf", "kdkd", "danke", "beaucoup", "brauchen"]) expect(echt(w), w).toBe(false);
      // Gegenprobe: dasselbe Wort steht in keinem fremden Fach (das eigene ist wirklich ein eigenes)
      expect(isRealWord(PROBE[l].wort, "de")).toBe(false);
      expect(isRealWord(PROBE[l].wort, "en")).toBe(false);
    });

    it("lexikonWoerter liefert das EIGENE Fach (vorher: das französische)", () => {
      const fach = lexikonWoerter(l);
      expect(fach).toContain(normalizeWord(PROBE[l].wort, l));
      expect(fach).not.toContain("beaucoup");
      expect(fach.length).toBeGreaterThan(2000);
      expect(new Set(fach).size).toBe(fach.length);
    });

    it("jedes Wort des Übungswortschatzes ist echt", () => {
      expect(GERUEST_WORDS[l].filter((w) => normalizeWord(w, l).length >= 2 && !echt(w))).toEqual([]);
    });

    it("★ jedes Wort JEDER Korpuszeile (Charge 1) ist echt - die Stimme buchstabiert keines (vorher: jede Zeile mindestens eines)", () => {
      const zeilen = eigeneZeilen(l);
      expect(zeilen.length, "Charge 1 ist da (sonst prüft dieser Wächter nichts)").toBeGreaterThan(150);
      const fehlend = new Set<string>();
      for (const z of zeilen) for (const t of z.text.split(/\s+/)) if (normalizeWord(t, l).length >= 2 && !echt(t)) fehlend.add(t);
      expect([...fehlend]).toEqual([]);
    });

    it("der Nachtrag kommt aus dem Sprachpaket, und jede seiner Formen ist echt", () => {
      expect(sprachDaten(l)?.lexikon[0]).toBe(NACHTRAG[l]);
      expect(NACHTRAG[l].length).toBeGreaterThan(1000);
      expect(NACHTRAG[l].filter((w) => !echt(w))).toEqual([]);
    });

    it("die KERN-Sperrliste steht nicht im Fach (die Stimme buchstabiert ein Schimpfwort)", () => {
      expect(lexikonWoerter(l).filter((w) => GERUEST_KERN_GESPERRT[l](w))).toEqual([]);
    });
  });

  describe("2 · readPlanAt: ein Korpus-Satz wird als Wörter gelesen, nicht Buchstabe für Buchstabe", () => {
    it("★ an jedem Wortanfang jeder Korpuszeile: das ganze Wort (bei Wörtern mit mindestens zwei Buchstaben)", () => {
      const isWord = (t: string) => echt(t);
      let geprueft = 0;
      const buchstabiert: string[] = [];
      for (const z of eigeneZeilen(l)) {
        for (const i of wortanfaenge(z.text)) {
          if (!/\p{L}/u.test(z.text[i])) continue;
          const plan = readPlanAt(z.text, i, { letters: false, words: true, sentences: false, lang: l }, isWord);
          const token = z.text.slice(i).split(" ")[0];
          if (normalizeWord(token, l).length < 2) continue;
          geprueft++;
          // ganzes Wort = ein Teil, der mehr als ein Zeichen hat und mit dem Zeichen an der Stelle beginnt
          if (!(plan.length === 1 && plan[0].length > 1 && plan[0].startsWith(z.text[i]))) buchstabiert.push(`${token} ⇒ ${JSON.stringify(plan)}`);
        }
      }
      expect(geprueft, "kein Wort geprüft - der Wächter wäre taub").toBeGreaterThan(1000);
      expect(buchstabiert.slice(0, 10)).toEqual([]);
    });

    it("am Zeilenanfang mit „Sätze an\": die ganze Zeile; Gegenprobe: Tastenbrei wird buchstabiert", () => {
      const z = eigeneZeilen(l)[0].text;
      expect(readPlanAt(z, 0, { letters: false, words: true, sentences: true, lang: l }, echt)[0]).toBe(z);
      const brei = readPlanAt("qwxz", 0, { letters: false, words: true, sentences: false, lang: l }, echt);
      expect(brei).toHaveLength(1);
      expect(brei[0]).not.toBe("qwxz");
    });
  });

  describe("3 · Zeichennamen in der Sprache (nicht englisch, nie deutsch)", () => {
    const tastaturZeichen = (): Set<string> => {
      const z = new Set<string>();
      for (const lay of LAYOUTS) {
        if (!TASTATUREN_DER_SPRACHE[l].has(lay.id)) continue;
        for (const r of lay.rows) for (const k of r.keys) z.add(k);
        for (const k of Object.keys(lay.access)) z.add(k);
      }
      return z;
    };
    const korpusZeichen = (): Set<string> => new Set(eigeneZeilen(l).flatMap((z) => [...z.text]));

    it("die Tastaturen des Weges sind bekannt (sonst prüft Abschnitt 3 nichts)", () => {
      expect(TASTATUREN_DER_SPRACHE[l].size).toBeGreaterThan(0);
      expect(tastaturZeichen().size).toBeGreaterThan(40);
    });

    it("★ jedes Satz- und Sonderzeichen der Tastaturen und des Korpus hat einen EIGENEN Namen", () => {
      const ohne = [...new Set([...tastaturZeichen(), ...korpusZeichen()])].filter(
        (c) => [...c].length === 1 && !/[\p{L}\p{N}]/u.test(c) && NAMEN[l][c] === undefined,
      );
      expect(ohne).toEqual([]);
    });

    it("★ jeder Grossbuchstabe der Tastaturen und des Korpus hat einen eigenen Namen (vorher „capital …\")", () => {
      const ohne = [...new Set([...tastaturZeichen(), ...korpusZeichen()].map((c) => c.toUpperCase()))].filter(
        // `µ` (Mikro-Zeichen, ein Kleinbuchstabe für Unicode) hat als Grossform das griechische `Μ` - kein Zeichen dieser Wege.
        (c) => [...c].length === 1 && /\p{Lu}/u.test(c) && c !== String.fromCharCode(0x39c) && NAMEN[l][c] === undefined,
      );
      expect(ohne).toEqual([]);
    });

    it("spokenLabel nimmt die eigene Tabelle; Proben aus dem Glossar §2.8", () => {
      expect(spokenLabel(PROBE[l].gross, l)).toBe(PROBE[l].grossName);
      expect(spokenLabel(PROBE[l].sonder[0], l)).toBe(PROBE[l].sonder[1]);
      for (const c of [" ", ".", ",", "?"]) expect(spokenLabel(c, l), c).toBe(NAMEN[l][c]);
    });

    it("kein Name ist englisch oder deutsch geblieben", () => {
      const rest = Object.entries(NAMEN[l]).filter(([, n]) =>
        /\b(capital|space|full stop|comma|question mark|hyphen|Leertaste|großes|grosses|Punkt|Komma|Bindestrich)\b/.test(n),
      );
      // „komma" ist niederländisch UND schwedisch das eigene Wort (klein geschrieben) - der Test sucht die englische/deutsche Schreibung.
      expect(rest.filter(([, n]) => !/^komma$/.test(n))).toEqual([]);
    });
  });
});

describe("4 · die Stimme: Kürzel, Region, nie Deutsch", () => {
  it("★ stimmKuerzel ist für JEDE Sprache der Anfang ihres SPRACH_TAG („br\" ⇒ „pt\") - eine neue Ausnahme fällt hier auf", () => {
    for (const [lang, tag] of Object.entries(SPRACH_TAG)) expect(stimmKuerzel(lang), lang).toBe(tag.slice(0, 2).toLowerCase());
    // Gegenprobe: die alte Rechnung hätte für „br" das falsche Kürzel geliefert
    expect("br".slice(0, 2)).not.toBe(stimmKuerzel("br"));
  });

  it("stimmeBeimEinschalten: eine gewählte brasilianische Stimme passt zum Weg „br\" (vorher: wurde ersetzt)", () => {
    const basis = { warAn: false, istAn: true, gewaehlt: "Luciana", stimmeFuerSprache: "Andere", stimmenDa: true };
    expect(stimmeBeimEinschalten({ ...basis, lang: "br", gewaehltSprache: "pt-BR" })).toBeNull();
    // Gegenprobe: eine deutsche Stimme passt nicht - es kommt die brasilianische
    expect(stimmeBeimEinschalten({ ...basis, lang: "br", gewaehltSprache: "de-DE" })).toEqual({ art: "stimme", uri: "Andere" });
  });

  it("stimmenZurAuswahl bietet auf Weg „br\" die brasilianischen Stimmen an", () => {
    const v = (name: string, lang: string) => ({ name, lang, voiceURI: name, default: false, localService: true }) as SpeechSynthesisVoice;
    const liste = stimmenZurAuswahl([v("Anna", "de-DE"), v("Luciana", "pt-BR"), v("Milena", "ru-RU")], "", "br", "br").map((x) => x.name);
    expect(liste).toContain("Luciana");
    expect(liste).not.toContain("Milena");
    expect(liste[0]).toBe("Luciana");
  });

  describe("Auswahl mit nachgebildeten Stimmen des Geräts", () => {
    class FakeUtterance {
      text: string;
      rate = 1;
      pitch = 1;
      volume = 1;
      lang = "";
      voice: SpeechSynthesisVoice | null = null;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
      addEventListener(): void {}
      removeEventListener(): void {}
    }
    const stimme = (name: string, lang: string, isDefault = false) =>
      ({ name, lang, voiceURI: name, default: isDefault, localService: true }) as SpeechSynthesisVoice;
    let VOICES: SpeechSynthesisVoice[] = [];
    const abgesetzt: FakeUtterance[] = [];
    const fakeSynth = {
      speaking: false,
      pending: false,
      paused: false,
      getVoices: () => VOICES,
      speak(u: FakeUtterance) {
        abgesetzt.push(u);
      },
      cancel() {},
      resume() {},
      pause() {},
      addEventListener() {},
      removeEventListener() {},
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.speechSynthesis = fakeSynth;
    w.SpeechSynthesisUtterance = FakeUtterance;

    async function sprich(lang: GeruestSprache, voices: SpeechSynthesisVoice[], gewaehlt = ""): Promise<FakeUtterance> {
      const { speakSequence, useVoice } = await import("../src/lib/typing/voice");
      const { setVorleseSprache } = await import("../src/lib/typing/vorlesen");
      VOICES = voices;
      useVoice.setState({ enabled: true, voiceURI: gewaehlt });
      setVorleseSprache(lang);
      abgesetzt.length = 0;
      speakSequence(["Probe."], "sofort");
      expect(abgesetzt).toHaveLength(1);
      return abgesetzt[0];
    }

    const WINDOWS_HEUTE = () => [stimme("Microsoft Hedda", "de-DE", true), stimme("Microsoft Zira", "en-US"), stimme("Microsoft Hortense", "fr-FR")];

    it.each(GERUEST_SPRACHEN)("★ %s ohne eigene Stimme (der gemessene Windows-PC): KEINE Stimme gewählt, nie die deutsche - lang ist die der Sprache", async (l) => {
      const u = await sprich(l, WINDOWS_HEUTE());
      expect(u.voice).toBeNull();
      expect(u.lang).toBe(SPRACH_TAG[l]);
    });

    it.each(GERUEST_SPRACHEN)("%s mit eigener Stimme: genau die - vor der deutschen Standardstimme", async (l) => {
      const eigene = stimme(`Probe ${l}`, SPRACH_TAG[l]);
      const u = await sprich(l, [...WINDOWS_HEUTE(), eigene]);
      expect(u.voice?.name).toBe(`Probe ${l}`);
    });

    it("eine im Zahnrad gewählte DEUTSCHE Stimme gilt nicht für bulgarischen Text", async () => {
      const u = await sprich("bg", [...WINDOWS_HEUTE(), stimme("Ivan", "bg-BG")], "Microsoft Hedda");
      expect(u.voice?.name).toBe("Ivan");
    });

    it("★ Portugal und Brasilien: jede zuerst ihre Region, gleich in welcher Reihenfolge das Gerät sie meldet", async () => {
      const beide = [stimme("Luciana", "pt-BR", true), stimme("Joana", "pt-PT")];
      expect((await sprich("pt", beide)).voice?.name).toBe("Joana");
      expect((await sprich("br", beide)).voice?.name).toBe("Luciana");
      expect((await sprich("br", [...beide].reverse())).voice?.name).toBe("Luciana");
      expect((await sprich("pt", [...beide].reverse())).voice?.name).toBe("Joana");
      // ohne Stimme der eigenen Region: die andere portugiesische (besser als keine), nie eine deutsche
      expect((await sprich("pt", [stimme("Anna", "de-DE", true), stimme("Luciana", "pt-BR")])).voice?.name).toBe("Luciana");
    });

    it("★ firstVoiceURIForLang (Sprachwechsel, Hinweis „Stimme installieren\"): „br\" findet die brasilianische, „bg\" ohne Stimme nichts", async () => {
      const { firstVoiceURIForLang } = await import("../src/lib/typing/voice");
      VOICES = [...WINDOWS_HEUTE(), stimme("Joana", "pt-PT"), stimme("Luciana", "pt-BR")];
      expect(firstVoiceURIForLang("br")).toBe("Luciana");
      expect(firstVoiceURIForLang("pt")).toBe("Joana");
      expect(firstVoiceURIForLang("bg")).toBeNull();
      expect(firstVoiceURIForLang("uk")).toBeNull();
      VOICES = [...WINDOWS_HEUTE(), stimme("Lesya", "uk-UA"), stimme("Melina", "el-GR")];
      expect(firstVoiceURIForLang("uk")).toBe("Lesya");
      expect(firstVoiceURIForLang("el")).toBe("Melina");
      // unverändert für die alten Sprachen
      expect(firstVoiceURIForLang("fr")).toBe("Microsoft Hortense");
    });
  });
});

describe("5 · Rumänisch: ş ţ mit Cedille sind dasselbe Wort wie ș ț mit Komma", () => {
  it("normalizeWord(…, \"ro\") macht aus der Cedille das Komma; andere Sprachen bleiben unberührt", () => {
    expect(normalizeWord("Şcoală", "ro")).toBe("școală");
    expect(normalizeWord("ţară", "ro")).toBe("țară");
    expect(isRealWord("şcoală", "ro")).toBe(isRealWord("școală", "ro"));
    expect(normalizeWord("şcoală", "tr")).toBe("şcoală");
  });
});

describe("6 · die alten Wege bleiben, wie sie waren", () => {
  it("Fächer de/en/fr/es/it/pl/tr/cs kennen die neuen Wörter nicht", () => {
    for (const l of ["de", "en", "fr", "es", "it", "pl", "tr", "cs"] as const) {
      expect(isRealWord("училище", l), l).toBe(false);
      expect(isRealWord("σχολείο", l), l).toBe(false);
    }
  });
  it("ohne Sprache und für de: normalizeWord byte-gleich (Falle 7)", () => {
    expect(normalizeWord("Şcoală")).toBe("coal");
    expect(normalizeWord("Haus,", "de")).toBe("haus");
  });
});

describe("7 · die Ansagen (vorlesen.ts) sprechen die Sprache des Weges", async () => {
  const v = await import("../src/lib/typing/vorlesen");
  const ZAHL_PUNKT = /\d\.(\s|$)/;
  const VERBOTEN = /[–—…“”„«»]/;
  const proben = (l: Lang): string[] => [
    v.ansageSchritt(2, 7, "Titel", l),
    v.ansageTastatur("BDS", l),
    v.ansageStart("Grundreihe", l),
    v.ansageAngemeldet("Mira", l),
    v.ansageBelohnungsspiel("Pinguin", l),
    ...[1, 2, 5, 11, 12, 21, 22, 25].flatMap((g) => [v.ansageZeilenstand(1, g, l), v.ansageAufgabenstand(1, g, l), v.ansageZeilenstand(g, g, l)]),
    v.ansageUebezeit("12 min", null, l),
    v.ansageAufstieg(true, l),
    v.ansageAufstieg(false, l),
    v.ansageNeueAbzeichen(["A"], 1, false, l),
    v.ansageNeueAbzeichen(["A", "B"], 5, true, l),
    ...[1, 2, 5, 120, 121].map((t) => v.ansageWerte("95 %", t, l)),
    v.ansageUmschaltSeite("X", true, l),
    v.ansageUmschaltSeite("X", false, l),
  ];

  it.each(GERUEST_SPRACHEN)("★ %s: kein fester Satz ist der englische oder deutsche (vorher RÜCKFALL-EN), keiner leer", (l) => {
    const eigen = v.ANSAGEN[l];
    for (const [k, satz] of Object.entries(eigen)) {
      expect(satz.trim().length, k).toBeGreaterThan(0);
      expect(satz, k).not.toBe(v.ANSAGEN.en[k as keyof typeof eigen]);
      expect(satz, k).not.toBe(v.ANSAGEN.de[k as keyof typeof eigen]);
    }
  });

  it.each(GERUEST_SPRACHEN)("★ %s: die Sätze mit Werten sind nicht englisch, nicht deutsch (Umschalt-Hinweis war DEUTSCH)", (l) => {
    const en = proben("en");
    const de = proben("de");
    proben(l).forEach((satz, i) => {
      expect(satz, `#${i}`).not.toBe(en[i]);
      expect(satz, `#${i}`).not.toBe(de[i]);
    });
    expect(v.ansageUmschaltSeite("X", true, l)).not.toMatch(/Umschalttaste|Feststelltaste|shift key/);
  });

  it.each(GERUEST_SPRACHEN)("%s: Hausregeln - kein Gedankenstrich, keine typografischen Anführungszeichen, kein Punkt hinter einer Zahl", (l) => {
    for (const satz of [...Object.values(v.ANSAGEN[l]), ...proben(l)]) {
      expect(VERBOTEN.test(satz), satz).toBe(false);
      expect(ZAHL_PUNKT.test(satz), `Ordnungszahl-Gefahr: ${satz}`).toBe(false);
    }
  });

  it("ro schreibt ș ț mit Komma, uk ohne russische Buchstaben", () => {
    for (const satz of [...Object.values(v.ANSAGEN.ro), ...proben("ro")]) expect(/[şţŞŢ]/.test(satz), satz).toBe(false);
    for (const satz of [...Object.values(v.ANSAGEN.uk), ...proben("uk")]) expect(/[ыэъёЫЭЪЁ]/.test(satz), satz).toBe(false);
  });
});
