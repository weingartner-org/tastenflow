import { describe, it, expect } from "vitest";
import {
  ANSAGEN,
  ansage,
  ansageFuerZeilenart,
  setVorleseSprache,
  vorleseSprache,
} from "@/lib/typing/vorlesen";
import { spokenLabel } from "@/lib/typing/fingers";
import { readPlanAt } from "@/lib/typing/voice";
import { isRealWord, lexikonGroesse, normalizeWord } from "@/lib/typing/lexicon";
import { unlockSpeech } from "@/lib/typing/letters";
import { SERIEN } from "@/lib/typing/serien";
import { serieLines } from "@/lib/typing/serie";
import { starsSpokenFor, UI_COPY } from "@/lib/typing/skin";
import { adaptiveRound, istZahlenzeile } from "@/lib/typing/generator";
import { INTRO_ORDER } from "@/lib/typing/letters";

/**
 * DIE VORLESE-SCHICHT AUF ENGLISCH - der Wächter zu Jens' Rückmeldung
 * vom 29.08.2026.
 *
 * Drei Befunde standen darin, und jeder hat hier seinen Test:
 *  1. „Leertaste und Satzzeichen haben ihre deutschen Bezeichnungen" - jetzt
 *     folgen die Namen der Vorlese-Sprache.
 *  2. „manche Wörter werden als Ganzes gelesen, andere buchstabiert" - die
 *     Ursache war eine LÜCKE: das Lexikon kannte die Serien nicht. Der Test
 *     unten prüft nicht ein Beispielwort, sondern ALLE Serien-Zeilen; nur so
 *     merkt eine spätere Inhalts-Charge, wenn sie wieder herausfällt.
 *  3. Das Lexikon war EIN Topf aus beiden Sprachen. Im Englisch-Modus
 *     entschieden deutsche Wörter mit („öl" als ganzes Wort mitten im
 *     englischen Silben-Drill).
 *
 * ⚠️ Was hier BEWUSST nicht geprüft wird: die sichtbare Oberfläche. Sie bleibt
 * deutsch - nur die Stimme folgt dem Inhalt.
 */
describe("Vorlese-Schicht auf Englisch", () => {
  describe("die Ansage-Tabelle", () => {
    it("trägt in beiden Sprachen dieselben Schlüssel", () => {
      expect(Object.keys(ANSAGEN.en).sort()).toEqual(Object.keys(ANSAGEN.de).sort());
    });

    it("lässt keine Fassung leer", () => {
      for (const lang of ["de", "en"] as const)
        for (const [key, satz] of Object.entries(ANSAGEN[lang]))
          expect(satz.trim(), `${lang}.${key}`).not.toBe("");
    });

    it("übersetzt jeden Satz wirklich - kein deutscher Satz im englischen Fach", () => {
      for (const key of Object.keys(ANSAGEN.de) as (keyof typeof ANSAGEN.de)[])
        expect(ANSAGEN.en[key], `nicht übersetzt: ${key}`).not.toBe(ANSAGEN.de[key]);
    });

    it("lässt keine Umlaute und keine deutschen Füllwörter im englischen Fach", () => {
      // Ein vergessener deutscher Rest fällt beim Lesen kaum auf, im Ohr sofort.
      const deutsch = /[äöüß]|\b(und|nicht|Taste|Wörter|Sätze|jetzt|aus|an)\b/;
      for (const [key, satz] of Object.entries(ANSAGEN.en))
        expect(deutsch.test(satz), `${key}: „${satz}“`).toBe(false);
    });
  });

  describe("die Zeichennamen", () => {
    it("nennt Leertaste und Satzzeichen englisch", () => {
      expect(spokenLabel(" ", "en")).toBe("space");
      expect(spokenLabel(".", "en")).toBe("full stop");
      expect(spokenLabel(",", "en")).toBe("comma");
      expect(spokenLabel("?", "en")).toBe("question mark");
      expect(spokenLabel("!", "en")).toBe("exclamation mark");
      expect(spokenLabel(":", "en")).toBe("colon");
    });

    it("sagt „capital“ statt „großes“", () => {
      expect(spokenLabel("A", "en")).toBe("capital A");
      expect(spokenLabel("Ä", "en")).toBe("capital a umlaut");
    });

    it("schreibt Umlaute auch englisch aus (sie klingen sonst gleich)", () => {
      expect(spokenLabel("ä", "en")).toBe("a umlaut");
      expect(spokenLabel("ö", "en")).toBe("o umlaut");
      expect(spokenLabel("ü", "en")).toBe("u umlaut");
    });

    it("bleibt ohne Sprachangabe deutsch - alle Alt-Aufrufer unverändert", () => {
      expect(spokenLabel(" ")).toBe("Leertaste");
      expect(spokenLabel(".")).toBe("Punkt");
      expect(spokenLabel("ä")).toBe("a Umlaut");
    });
  });

  describe("eine englische Zeile vorlesen", () => {
    const zeile = "Nell is at home.";
    const modi = { letters: false, words: true, sentences: true };

    it("nennt Leerzeichen und Punkt englisch", () => {
      const gehoert: string[] = [];
      for (let i = 0; i < zeile.length; i++)
        for (const teil of readPlanAt(zeile, i, { ...modi, lang: "en" }, (t) =>
          isRealWord(t, "en"),
        ))
          gehoert.push(teil);
      expect(gehoert).toContain("space");
      expect(gehoert).toContain("full stop");
      expect(gehoert).not.toContain("Leertaste");
      expect(gehoert).not.toContain("Punkt");
    });

    it("liest den Namen „Nell“ als ganzes Wort, nicht buchstabiert", () => {
      // Vor dem 29.08.2026 kam hier „großes N, e, l, l" - der Name stand im
      // Korpus nicht, weil das Lexikon die Serien nicht kannte.
      const anfang = readPlanAt(zeile, 0, { ...modi, lang: "en" }, (t) =>
        isRealWord(t, "en"),
      );
      expect(anfang).toContain("Nell");
      expect(anfang).not.toContain("capital N");
    });
  });

  describe("das Lexikon kennt die Serien", () => {
    it("buchstabiert kein einziges Wort einer Serien-Zeile", () => {
      const opfer: string[] = [];
      for (const serie of SERIEN) {
        const lang = serie.lang ?? "de";
        for (const zeile of serieLines(serie))
          for (const token of zeile.split(/\s+/)) {
            if (normalizeWord(token).length < 2) continue;
            if (!isRealWord(token, lang)) opfer.push(`${serie.slug}: ${token}`);
          }
      }
      expect(opfer.slice(0, 12)).toEqual([]);
    });
  });

  describe("das Lexikon kennt Sprachen", () => {
    it("hält beide Fächer getrennt und beide gefüllt", () => {
      const g = lexikonGroesse();
      expect(g.de).toBeGreaterThan(1000);
      expect(g.en).toBeGreaterThan(1000);
      expect(g.beide).toBeGreaterThanOrEqual(Math.max(g.de, g.en));
    });

    it("lässt „öl“ im englischen Drill NICHT als Wort durchgehen", () => {
      // Gemessen: an der Grundreihe kam „öl" 53-mal in 60 englischen Runden vor
      // und wurde als ganzes deutsches Wort vorgelesen.
      expect(isRealWord("öl", "de")).toBe(true);
      expect(isRealWord("öl", "en")).toBe(false);
    });

    it("bleibt ohne Sprachangabe beim gemeinsamen Topf", () => {
      expect(isRealWord("öl")).toBe(true);
    });
  });

  describe("die Freischalt-Feier", () => {
    it("spricht englisch, wenn der Inhalt englisch ist", () => {
      const satz = unlockSpeech("r", false, "en");
      expect(satz).toContain("letter");
      expect(satz).not.toMatch(/[äöüß]/);
      expect(satz).not.toContain("Gratulation");
    });

    it("erklärt auch das Umschalt-Zeichen englisch", () => {
      const satz = unlockSpeech("⇧", true, "en");
      expect(satz).toContain("capital letters");
      // „Shift" gross wie auf der Taste - Glossar im Bauplan 12.09.2026 §4.
      expect(satz).toContain("Shift key");
    });

    it("bleibt ohne Sprachangabe deutsch", () => {
      expect(unlockSpeech("r", true)).toContain("Freigeschaltet");
    });
  });

  describe("die Sterne-Rückmeldung", () => {
    it("bleibt je Altersstufe im eigenen Ton - auch englisch", () => {
      expect(starsSpokenFor(UI_COPY.kind, 3, "en")).toContain("!");
      expect(starsSpokenFor(UI_COPY.erwachsen, 3, "en")).not.toContain("!");
      for (const skin of ["kind", "jugend", "erwachsen"] as const)
        expect(starsSpokenFor(UI_COPY[skin], 3, "en")).not.toMatch(/[äöüß]/);
    });
  });

  describe("die Vorlese-Sprache", () => {
    it("ist ohne Zutun deutsch und folgt dann dem, was gesetzt wird", () => {
      expect(vorleseSprache()).toBe("de");
      setVorleseSprache("en");
      expect(vorleseSprache()).toBe("en");
      expect(ansage("vorlesenAn")).toBe(ANSAGEN.en.vorlesenAn);
      setVorleseSprache("de");
      expect(ansage("vorlesenAn")).toBe(ANSAGEN.de.vorlesenAn);
    });
  });
});

/**
 * DIE ANSAGE FRAGT DEN GENERATOR - Jens' dritter Punkt.
 *
 * ⚠️ Was hier NICHT geprüft wird: dass „die Ansage zum Etikett passt". Das wäre
 * eine Tautologie - die Ansage IST das Etikett. Geprüft wird das, was wirklich
 * schiefgehen kann: ob das ETIKETT zur ZEILE passt. Ein Generator, der künftig
 * eine neue Zeilensorte baut und sie falsch etikettiert, fällt hier auf.
 */
describe("Die Ansage fragt den Generator", () => {
  describe("istZahlenzeile", () => {
    it("erkennt Zahlen- und Zeichenzeilen", () => {
      for (const z of ["23 °C", "18° 22°", "9:15", "5 + 3 = 8", "47 %", "[166, 7]", "~94"])
        expect(istZahlenzeile(z), z).toBe(true);
    });

    it("lässt Zeilen mit einem echten Wort in Ruhe", () => {
      for (const z of ["23 km/h", "the cat sat on the mat.", "Receipt 8209: 8 plates", "öl alal llöd"])
        expect(istZahlenzeile(z), z).toBe(false);
    });
  });

  describe("das Etikett passt zur Zeile", () => {
    const staende: [string, number][] = [
      ["Grundreihe", 8],
      ["alle Buchstaben", 27],
      ["+ Satzzeichen", 34],
      ["+ Zahlen", 44],
      ["alles", INTRO_ORDER.length],
    ];

    it("gibt JEDER Zeile ein Etikett - in jeder Sprache, auf jedem Stand", () => {
      const erlaubt = new Set(["text", "woerter", "unsinn", "zahlen"]);
      for (const lang of ["de", "en"] as const)
        for (const [, n] of staende)
          for (const z of adaptiveRound({ lernweg: "de",
            introduced: INTRO_ORDER.slice(0, n),
            focus: INTRO_ORDER.slice(Math.max(0, n - 3), n),
            stufe: "erwachsen",
            lang,
            count: 12,
            uebungsZeilen: 4,
          }))
            expect(erlaubt.has(z.art), `${z.art}: „${z.text}“`).toBe(true);
    });

    it("nennt „zahlen“ nur, wo wirklich keine Wörter stehen - und umgekehrt", () => {
      const falsch: string[] = [];
      for (const [name, n] of staende)
        for (let r = 0; r < 8; r++)
          for (const z of adaptiveRound({ lernweg: "de",
            introduced: INTRO_ORDER.slice(0, n),
            focus: INTRO_ORDER.slice(Math.max(0, n - 3), n),
            stufe: "erwachsen",
            lang: "en",
            count: 12,
            uebungsZeilen: 4,
          })) {
            if ((z.art === "zahlen") !== istZahlenzeile(z.text))
              falsch.push(`${name}: „${z.text}“ ist ${z.art}`);
          }
      expect(falsch.slice(0, 8)).toEqual([]);
    });

    it("nennt „text“ nur bei echten Korpus-Bausteinen", () => {
      for (const [, n] of staende)
        for (const z of adaptiveRound({ lernweg: "de",
          introduced: INTRO_ORDER.slice(0, n),
          stufe: "erwachsen",
          lang: "en",
          count: 12,
        }))
          if (z.art === "text") expect(z.source, z.text).not.toBeNull();
    });

    it("baut in eine „unsinn“-Zeile auch wirklich Unsinnwörter", () => {
      // Gegenprobe zum alten Fehler: Es reicht NICHT, dass ein Wort unbekannt
      // ist - die Zeile muss überwiegend aus Pseudowörtern bestehen.
      const falsch: string[] = [];
      for (let r = 0; r < 20; r++)
        for (const z of adaptiveRound({ lernweg: "de",
          introduced: INTRO_ORDER.slice(0, 8),
          focus: ["a", "s", "d"],
          stufe: "erwachsen",
          lang: "en",
          count: 12,
          uebungsZeilen: 4,
        })) {
          if (z.art !== "unsinn") continue;
          const tokens = z.text.split(/\s+/).filter((t) => normalizeWord(t).length >= 2);
          const echte = tokens.filter((t) => isRealWord(t, "en")).length;
          if (tokens.length && echte === tokens.length) falsch.push(z.text);
        }
      expect(falsch.slice(0, 5)).toEqual([]);
    });
  });

  describe("die drei Ansagen", () => {
    it("ordnet jede Art ihrer Ansage zu - in beiden Sprachen", () => {
      expect(ansageFuerZeilenart("unsinn", "de")).toBe(ANSAGEN.de.jetztUnsinnwoerter);
      expect(ansageFuerZeilenart("zahlen", "de")).toBe(ANSAGEN.de.jetztZahlen);
      expect(ansageFuerZeilenart("text", "de")).toBe(ANSAGEN.de.jetztEchteWoerter);
      expect(ansageFuerZeilenart("woerter", "de")).toBe(ANSAGEN.de.jetztEchteWoerter);
      expect(ansageFuerZeilenart("zahlen", "en")).toBe(ANSAGEN.en.jetztZahlen);
    });

    it("gibt Zahlenzeilen eine EIGENE Ansage - nicht mehr „echte Wörter“", () => {
      expect(ansageFuerZeilenart("zahlen", "de")).not.toBe(ANSAGEN.de.jetztEchteWoerter);
      expect(ansageFuerZeilenart("zahlen", "en")).not.toBe(ANSAGEN.en.jetztEchteWoerter);
    });
  });
});
