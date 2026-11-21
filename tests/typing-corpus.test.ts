import { describe, it, expect } from "vitest";
import {
  CORPUS,
  INHALTS_STUFEN,
  LESSONS,
  STUFEN,
  contentStufenFor,
  copyFor,
  corpusItemsFor,
  fitText,
  fitsKeys,
  generateItems,
  lessonById,
  markovWord,
  skinForStufe,
  unlockedKeysAt,
  type CorpusItem,
  type Stufe,
} from "../src/lib/typing";
import { allowedForTier } from "../src/lib/typing/tiers";

/**
 * Genau die Zeichen, die auf der Bildschirmtastatur tippbar sind — AUS der
 * Tastenordnung abgeleitet statt abgetippt (`letters.ts` ist die einzige
 * Quelle, siehe `tiers.ts`: „es gibt keine zweite, konkurrierende Liste").
 *
 * WARUM DAS BIS ZUM 21.08.2026 EINE HANDLISTE WAR — und warum sie weg musste:
 * Hier stand `/^[a-zäöüßA-ZÄÖÜ0-9 ,.\-?!:;]+$/`, also der Zeichensatz bis T4
 * plus Ziffern. Die HALBE Tastenstufe T5 fehlte: die Sonderzeichen
 * `( ) " ' + * / = % & @ € # $ § < > [ ] { } | ^ ~ °` sind in `SYMBOL_ORDER`
 * verzeichnet, werden in „Mein Training" eingeführt, auf der Bildschirm-
 * tastatur gezeichnet und vom Generator geübt — nur im deutschen Korpus waren
 * sie verboten. Der englische Korpus kannte diese Schranke nie (in
 * `corpusEn.ts` steht seit jeher `2 + 2 = 4`); geprüft wurde er von
 * `typing-english.test.ts` gegen genau die INTRO_ORDER, die jetzt auch hier
 * gilt. Die Charge I3 (Ziffern- und Sonderzeichen-Portfolio) braucht im
 * Deutschen Euro-Zeichen, Prozent, Rechenzeichen und Web-/Mail-Adressen — und
 * das ist kein Aufweichen: Was `minTierFor` als T5 einstuft, IST tippbar.
 *
 * Der Wächter selbst bleibt scharf: Gedankenstrich (–/—), typografische
 * Anführungszeichen und jedes andere Zeichen ohne Taste fallen weiter durch.
 */
const TYPEABLE_CHARS = new Set<string>([
  " ",
  ...[...allowedForTier(5, "de")],
  ...[...allowedForTier(5, "de")].map((c) => c.toUpperCase()),
]);
const TYPEABLE = {
  test: (s: string) => s.length > 0 && [...s].every((c) => TYPEABLE_CHARS.has(c)),
};
const KINDS = [
  "witz",
  "zungenbrecher",
  "wortspiel",
  "spruch",
  "sprichwort",
  "fakt",
  "satz",
  "wissen",
  "rechnung",
];

/** Deterministischer Pseudozufall für reproduzierbare Markov-Tests. */
function seq(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

describe("Text-Korpus", () => {
  it("ist nicht leer und enthält alle Sorten", () => {
    expect(CORPUS.length).toBeGreaterThan(100);
    for (const k of KINDS)
      expect(CORPUS.some((it) => it.kind === k)).toBe(true);
  });

  it("jeder Eintrag nutzt NUR tippbare Zeichen und hat mindestens eine Stufe", () => {
    for (const it of CORPUS as CorpusItem[]) {
      expect(TYPEABLE.test(it.text), `untippbar: ${it.text}`).toBe(true);
      expect(it.text.length).toBeGreaterThan(0);
      expect(it.text.length).toBeLessThanOrEqual(140);
      expect(it.stufen.length).toBeGreaterThan(0);
      // S1: Die Zeilen tragen die INHALTS-Etiketten (a/b/c/erwachsen) — der
      // redaktionelle Retag auf kids/teens ist Charge S3.
      for (const s of it.stufen) expect(INHALTS_STUFEN).toContain(s);
      expect(KINDS).toContain(it.kind);
    }
  });

  it("enthält für jede wählbare Altersstufe Einträge", () => {
    // S3: Gemessen wird an der KONTO-Stufe, nicht am Etikett. Während der
    // Redaktion liegen alte und neue Etiketten nebeneinander; welches eine
    // Zeile trägt, ist gleichgültig - entscheidend ist, dass jede Stufe
    // beliefert wird (`contentStufenFor`).
    for (const st of STUFEN) {
      const etiketten = contentStufenFor(st);
      expect(
        CORPUS.some((it) => etiketten.some((e) => it.stufen.includes(e))),
        `keine Einträge für ${st}`,
      ).toBe(true);
    }
  });

  it("hat keine exakten Doppel je Sorte", () => {
    const seen = new Set<string>();
    for (const it of CORPUS) {
      const key =
        it.kind +
        "|" +
        it.text
          .toLowerCase()
          .replace(/[^a-zäöüß0-9]+/g, " ")
          .trim();
      expect(seen.has(key), `Doppel: ${it.text}`).toBe(false);
      seen.add(key);
    }
  });
});

describe("fitText / fitsKeys", () => {
  it("verlangt freigeschaltete Buchstaben, lässt aber noch gesperrte Satzzeichen weg", () => {
    const allowed = new Set(["h", "a", "l", "o", "e", "w", "t", " "]);
    // Punkt nicht freigeschaltet → wird weggelassen, Text passt trotzdem.
    expect(fitText("hallo welt.", allowed)).toBe("hallo welt");
    expect(fitsKeys("hallo welt.", allowed)).toBe(true);
    // z fehlt als Buchstabe → passt NICHT (Buchstaben sind nicht weglassbar).
    expect(fitText("hallo zelt", allowed)).toBe(null);
    expect(fitsKeys("hallo zelt", allowed)).toBe(false);
  });

  it("erlaubt Großbuchstaben, sobald ihre Grundtaste frei ist (Auto-Großschreibung)", () => {
    const allowed = new Set(["h", "a", "l", "o", " "]);
    // Kein „shift" mehr nötig: Großbuchstabe bleibt erhalten, Grundtaste reicht.
    expect(fitText("Hallo", allowed)).toBe("Hallo");
    expect(fitsKeys("Hallo", allowed)).toBe(true);
  });

  it("behält freigeschaltete Satzzeichen und dampft Lücken ein", () => {
    const allowed = new Set(["j", "a", " ", "."]);
    expect(fitText("ja.", allowed)).toBe("ja.");
    // Komma fehlt → weg; doppelte Leerzeichen werden zusammengezogen.
    expect(fitText("ja, ja.", allowed)).toBe("ja ja.");
  });

  it("ersetzt Bindestrich durch Leerzeichen", () => {
    const allowedHyphen = new Set(["a", "b", " "]);
    expect(fitText("a-b", allowedHyphen)).toBe("a b");
  });

  it("Apostroph ist hart: ohne '-Taste passt der Text nicht (nie „dont“)", () => {
    // Prüfbericht 27.07., Teil 2 Punkt 1: Apostroph darf NICHT gestrippt werden,
    // sonst würden englische Kontraktionen verstümmelt („I don't" → „I dont").
    const allowedApos = new Set(["g", "e", "h", "t", "s", " "]);
    expect(fitText("geht's", allowedApos)).toBe(null);
    expect(fitsKeys("geht's", allowedApos)).toBe(false);
    // Mit gelernter '-Taste bleibt der Text unverändert; ein typografischer
    // Apostroph wird auf das tippbare gerade ' normalisiert.
    const withApos = new Set([...allowedApos, "'"]);
    expect(fitText("geht's", withApos)).toBe("geht's");
    expect(fitText("geht’s", withApos)).toBe("geht's");
    expect(fitText("geht’s", allowedApos)).toBe(null);
  });

  it("verlangt freigeschaltete Ziffern (nicht weglassbar)", () => {
    const allowed = new Set(["b", "u", "s", "e", " "]);
    expect(fitText("3 Busse", new Set([...allowed, "3"]))).toBe("3 Busse");
    expect(fitText("3 Busse", allowed)).toBe(null); // 3 nicht frei → passt nicht
  });
});

describe("corpusItemsFor", () => {
  // Alle tippbaren Zeichen freigeschaltet → es wird nichts weggelassen.
  const allKeys = new Set<string>([
    ..."abcdefghijklmnopqrstuvwxyzäöüß0123456789",
    " ",
    ".",
    ",",
    "-",
    "?",
    "!",
    ":",
    ";",
  ]);

  it("liefert nur Einträge der gewählten Altersstufe", () => {
    for (const st of STUFEN) {
      const etiketten = contentStufenFor(st);
      const lines = corpusItemsFor({ lernweg: "de", stufe: st, allowed: allKeys });
      for (const line of lines) {
        const ok = CORPUS.some(
          (it) =>
            etiketten.some((e) => it.stufen.includes(e)) &&
            fitText(it.text, allKeys) === line,
        );
        expect(ok, `nicht aus Stufe ${st}: ${line}`).toBe(true);
      }
    }
  });

  it("respektiert den Sorten-Filter", () => {
    const witze = corpusItemsFor({ lernweg: "de",
      stufe: "kids",
      allowed: allKeys,
      kinds: ["witz"],
    });
    expect(witze.length).toBeGreaterThan(0);
    for (const line of witze) {
      const ok = CORPUS.some(
        (it) => it.kind === "witz" && fitText(it.text, allKeys) === line,
      );
      expect(ok, `kein Witz: ${line}`).toBe(true);
    }
  });

  it("gibt für verschiedene Stufen unterschiedliche Inhalte", () => {
    const a = new Set(corpusItemsFor({ lernweg: "de", stufe: "kids", allowed: allKeys }));
    const c = new Set(corpusItemsFor({ lernweg: "de", stufe: "teens", allowed: allKeys }));
    expect(a.size).toBeGreaterThan(0);
    expect(c.size).toBeGreaterThan(0);
    // Es gibt mindestens einen Eintrag, der nur in einer der Stufen vorkommt.
    const nurA = [...a].some((x) => !c.has(x));
    const nurC = [...c].some((x) => !a.has(x));
    expect(nurA || nurC).toBe(true);
  });

  it("liefert nur Zeilen, die vollständig zu den frühen Tasten passen", () => {
    // Frühe Lektion: nur Grundreihe + e/i, kein ä/ü/ß, keine Satzzeichen.
    const earlyAllowed = new Set(unlockedKeysAt("ober-ei"));
    const lines = corpusItemsFor({ lernweg: "de", stufe: "kids", allowed: earlyAllowed });
    for (const line of lines) {
      // Die zurückgegebene (bereits angepasste) Zeile enthält nur erlaubte Tasten.
      expect(fitsKeys(line, earlyAllowed)).toBe(true);
    }
  });
});

describe("Markov-Pseudowörter", () => {
  it("nutzt ausschließlich erlaubte Zeichen und hält die Länge ein", () => {
    const allowed = new Set(["a", "e", "i", "n", "r", "s", "t", "d", "l", "h"]);
    for (let n = 0; n < 80; n++) {
      const w = markovWord(allowed, { min: 3, max: 6 });
      if (w === "") continue;
      expect(w.length).toBeGreaterThanOrEqual(3);
      expect(w.length).toBeLessThanOrEqual(6);
      for (const c of w)
        expect(allowed.has(c), `${c} nicht erlaubt in ${w}`).toBe(true);
    }
  });

  it("ist mit vorgegebenem Zufall reproduzierbar", () => {
    const allowed = new Set(["a", "e", "i", "n", "r", "s", "t", "d", "l", "h"]);
    const r1 = markovWord(
      allowed,
      { min: 3, max: 6 },
      seq([0.1, 0.4, 0.7, 0.2, 0.9, 0.3]),
    );
    const r2 = markovWord(
      allowed,
      { min: 3, max: 6 },
      seq([0.1, 0.4, 0.7, 0.2, 0.9, 0.3]),
    );
    expect(r1).toBe(r2);
  });

  it("scheitert sauber (leerer String) bei zu kleinem Buchstabensatz", () => {
    const w = markovWord(new Set(["f"]));
    expect(w).toBe("");
  });

  it("baut eine Fokus-Taste ein, wenn möglich", () => {
    const allowed = new Set(["a", "e", "i", "n", "r", "s", "t", "x"]);
    let sawX = false;
    for (let n = 0; n < 60; n++) {
      const w = markovWord(allowed, { min: 3, max: 6, focus: ["x"] });
      if (w.includes("x")) sawX = true;
    }
    expect(sawX).toBe(true);
  });
});

describe("Generator mit Altersstufe", () => {
  it("Text-Lektionen erzeugen nur erlaubte Tasten — in JEDER Stufe", () => {
    const textLessons = LESSONS.filter((l) => l.kind === "text");
    expect(textLessons.length).toBeGreaterThan(0);
    for (const lesson of textLessons) {
      const allowed = new Set(unlockedKeysAt(lesson.id));
      for (const st of STUFEN as Stufe[]) {
        const items = generateItems(lesson.id, { lernweg: "de", count: 12, stufe: st });
        expect(items.length).toBe(12);
        for (const line of items) {
          expect(line.length).toBeGreaterThan(0);
          for (const ch of line) {
            if (ch === " ") continue;
            const lower = ch.toLowerCase();
            // Auto-Großschreibung: Großbuchstaben sind erlaubt, sobald ihre
            // GRUNDtaste frei ist — daher nur die Grundtaste prüfen.
            expect(
              allowed.has(lower),
              `${lower} gesperrt in ${lesson.id}`,
            ).toBe(true);
          }
        }
      }
    }
  });

  it("Witz-Textlektion zieht echte Korpus-Zeilen der gewählten Stufe", () => {
    const lesson = lessonById("text-witze")!;
    const witzeC = new Set(
      corpusItemsFor({ lernweg: "de",
        stufe: "teens",
        allowed: new Set(unlockedKeysAt(lesson.id)),
        kinds: lesson.corpusKinds,
      }),
    );
    const items = generateItems("text-witze", { lernweg: "de", count: 12, stufe: "teens" });
    // Mindestens eine erzeugte Zeile stammt nachweislich aus dem c-Witzpool.
    expect(items.some((line) => witzeC.has(line))).toBe(true);
  });

  it("respektiert die Tasten-Invariante in jeder Lektion auch mit Stufe", () => {
    for (const lesson of LESSONS) {
      const allowed = new Set(unlockedKeysAt(lesson.id));
      for (const st of ["a", "erwachsen"] as Stufe[]) {
        for (const line of generateItems(lesson.id, { lernweg: "de", count: 20, stufe: st })) {
          for (const ch of line) {
            if (ch === " ") continue;
            const lower = ch.toLowerCase();
            // Nur die Grundtaste muss frei sein (Auto-Großschreibung).
            expect(allowed.has(lower)).toBe(true);
          }
        }
      }
    }
  });

  it("Lektion Satz- und Sonderzeichen uebt echte Sonderzeichen (kind symbols)", () => {
    const lesson = lessonById("satz-sonderzeichen")!;
    expect(lesson.kind).toBe("symbols");
    const allowed = new Set(unlockedKeysAt(lesson.id));
    const SYMS = "()\"'+*/=%&@€#$§<>[]{}|^~°";
    let sawSymbol = false;
    for (const st of STUFEN as Stufe[]) {
      const items = generateItems(lesson.id, { lernweg: "de", count: 24, stufe: st });
      expect(items.length).toBe(24);
      for (const line of items) {
        expect(line.length).toBeGreaterThan(0);
        for (const ch of line) {
          if (ch === " ") continue;
          expect(allowed.has(ch.toLowerCase()), `${ch} gesperrt`).toBe(true);
          if (SYMS.includes(ch)) sawSymbol = true;
        }
      }
    }
    // Über alle Stufen kommt mindestens ein echtes Sonderzeichen vor.
    expect(sawSymbol).toBe(true);
  });
});

describe("Profile (Skin)", () => {
  it("leitet das Profil aus der Stufe ab — seit 15.08. drei Tonlagen (je eine Stufe)", () => {
    expect(skinForStufe("kids")).toBe("kind");
    expect(skinForStufe("teens")).toBe("jugend");
    expect(skinForStufe("erwachsen")).toBe("erwachsen");
    // Alte Etiketten folgen der Konto-Migration (a → kids, b/c → teens).
    expect(skinForStufe("a")).toBe("kind");
    expect(skinForStufe("b")).toBe("jugend");
    expect(skinForStufe("c")).toBe("jugend");
  });

  it("liefert eine sachliche Oberfläche für Erwachsene (per Du, Sie nur für Lehrkräfte) und Kinder-Texte sonst", () => {
    const kind = copyFor("kids");
    const erw = copyFor("erwachsen");
    expect(kind.progressLabel).toBe("Spielstufe");
    expect(erw.progressLabel).toBe("Übungsstufe");
    expect(kind.summaryTitle(3)).toBe("Drei Sterne geschafft!"); // ★ 29.10.2026: Titel wechseln, Fassung 1
    expect(erw.summaryTitle(3)).not.toBe(kind.summaryTitle(3));
    // Seit 19.09.2026 duzt der Erwachsenen-Untertitel (Johannes: „Schüler und
    // Selbstlernende mit du") - die Sie-Fassung liest nur die Lehrkraft.
    expect(erw.subtitle).toContain("In deinem Tempo");
    expect(copyFor("erwachsen", "Sie").subtitle).toContain("In Ihrem Tempo");
    // Der Ton ist in beiden Fassungen derselbe.
    expect(copyFor("erwachsen", "Sie").summaryTitle(3)).toBe(erw.summaryTitle(3));
    // Kinder-Profil hat keinen Abschluss-Kommentar, Erwachsene schon.
    expect(kind.summaryRemark(3)).toBe("");
    expect(erw.summaryRemark(3).length).toBeGreaterThan(0);
  });

  it("jede Lektion hat eine Erwachsenen-Fassung (Sie) der Einführung", () => {
    for (const lesson of LESSONS) {
      expect(lesson.introErwachsen, `fehlt: ${lesson.id}`).toBeTruthy();
      expect(lesson.introErwachsen!.length).toBeGreaterThan(20);
      // grobe Plausibilität: keine reine du-Anrede mehr
      expect(/\bdu\b/i.test(lesson.introErwachsen!)).toBe(false);
    }
  });
});
