/**
 * ★★★ Wächter E8a (25./26.09.2026): die frühen fr-Texte für Kids (Sprosse
 * 9-24, `corpusFrWegFruehKids.ts` + `serienFrWegFruehKids.ts`).
 *
 * Prüft fünf Dinge, unabhängig von den Kommentaren in den Quelldateien -
 * die "Sprosse" einer Zeile wird hier selbst AUSGERECHNET (kleinstes n, ab
 * dem `fitText` die Zeile durchlässt), nicht aus einem Kommentar geglaubt:
 *
 *  1. Jede Zeile passt zu ihrer erklärten Stufe (`minTier`) UND ist an KEINER
 *     früheren Sprosse schon schreibbar, als ihr berechneter Wert zeigt -
 *     das deckt sowohl "zu früh benutzte Buchstaben" als auch eine falsche
 *     `minTier`-Angabe ab.
 *  2. Keine Zeile kommt doppelt vor - weder innerhalb dieser zwei Dateien
 *     noch in CORPUS (Weg „de") oder CORPUS_EN (Weg „en").
 *  3. Keine verbotenen Zeichen (Bauplan §6.5 Punkt 2): — – ’ … und `·`.
 *  4. Mindestmengen: je Sprosse 9-24 mindestens 25 Korpuszeilen; 12 Serien
 *     mit je 4-8 Zeilen.
 *  5. Manulex-Wächter (Bauplan §6.7): von den 150 häufigsten CP-Wortformen
 *     (Manulex.xls, Lété/Sprenger-Charolles/Colé 2004, CC BY-NC-SA 3.0, Blatt
 *     „FORMES ORTHO", Spalte „CP U" - gemessen am 25./26.09.2026, NICHT im
 *     Repository, siehe Sensorik/sprachdaten/fr/LIESMICH.md) kommt jede Form,
 *     die an Sprosse 24 überhaupt schreibbar ist, in mindestens einer Zeile
 *     vor (Korpus ODER Serien). Die Liste steht hier als kleine, feste
 *     Kopie - kein Zugriff auf die grosse Originaldatei nötig.
 */
import { describe, it, expect } from "vitest";
import { setLayout } from "../src/lib/typing/layouts";
import { lernwegDef } from "../src/lib/typing/lernweg";
import { fitText, CORPUS, CORPUS_EN } from "../src/lib/typing/corpus";
import { minTierFor } from "../src/lib/typing/tiers";
import { CORPUS_FR_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusFrWegFruehKids";
import { SERIEN_FR_WEG_FRUEH_KIDS } from "../src/lib/typing/serienFrWegFruehKids";
import { ETAPPE_MIN_LINES, ETAPPE_MAX_LINES, validateSerie } from "../src/lib/typing/serie";

setLayout("fr");
const FR_LETTER_ORDER = lernwegDef("fr").letterOrder;
const ERSTE_SPROSSE = 9;
const LETZTE_SPROSSE = 24;

/** Der erlaubte Zeichensatz bei genau `n` gelernten Buchstaben (roh, ohne Umschalt-Einheit). */
function allowedAtSprosse(n: number): Set<string> {
  return new Set(FR_LETTER_ORDER.slice(0, n).map((c) => c.toLowerCase()));
}

/**
 * Die kleinste Sprosse, ab der ein Text überhaupt tippbar ist - AUSGERECHNET,
 * nicht aus einem Kommentar übernommen. `null`, wenn er selbst am vollen
 * Alphabet (34 Buchstaben) nicht passt (verbotenes Zeichen).
 */
function berechneteSprosse(text: string): number | null {
  for (let n = 1; n <= FR_LETTER_ORDER.length; n++) {
    if (fitText(text, allowedAtSprosse(n)) !== null) return n;
  }
  return null;
}

const VERBOTENE_ZEICHEN = ["—", "–", "’", "‘", "`", "…", "·"];

describe("E8a: Korpus fr-Weg, frühe Sprossen 9-24 (Kids)", () => {
  it("jede Zeile passt zu ihrer erklärten Stufe und ist an keiner früheren Sprosse schon schreibbar", () => {
    const fehler: string[] = [];
    for (const item of CORPUS_FR_WEG_FRUEH_KIDS) {
      const sprosse = berechneteSprosse(item.text);
      if (sprosse === null) {
        fehler.push(`"${item.text}": passt zu keiner Sprosse (verbotenes Zeichen?)`);
        continue;
      }
      const tier = minTierFor(item.text, "fr");
      if (tier !== item.minTier) {
        fehler.push(
          `"${item.text}": minTier=${item.minTier}, tatsächlich ${tier} (berechnete Sprosse ${sprosse})`,
        );
      }
    }
    expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
  });

  it("keine verbotenen Zeichen (— – ’ … ·)", () => {
    const fehler: string[] = [];
    for (const item of [...CORPUS_FR_WEG_FRUEH_KIDS]) {
      for (const z of VERBOTENE_ZEICHEN) {
        if (item.text.includes(z)) fehler.push(`"${item.text}" enthält "${z}"`);
      }
    }
    for (const serie of SERIEN_FR_WEG_FRUEH_KIDS) {
      for (const etappe of serie.etappen) {
        for (const line of etappe.lines) {
          for (const z of VERBOTENE_ZEICHEN) {
            if (line.includes(z)) fehler.push(`"${line}" (${serie.slug}) enthält "${z}"`);
          }
        }
      }
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it('keine Zeile kommt doppelt vor - auch nicht gegen Weg „de" oder „en"', () => {
    const eigene = CORPUS_FR_WEG_FRUEH_KIDS.map((i) => i.text.toLowerCase());
    const gesehen = new Map<string, number>();
    const fehler: string[] = [];
    for (const t of eigene) gesehen.set(t, (gesehen.get(t) ?? 0) + 1);
    for (const [t, n] of gesehen) if (n > 1) fehler.push(`Duplikat innerhalb fr: "${t}" (${n}x)`);

    const andereWege = new Set([
      ...CORPUS.map((i) => i.text.toLowerCase()),
      ...CORPUS_EN.map((i) => i.text.toLowerCase()),
    ]);
    for (const t of eigene) {
      if (andereWege.has(t)) fehler.push(`Überschneidung mit Weg „de"/„en": "${t}"`);
    }
    expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
  });

  /**
   * ★★★ NACHBESSERUNG 26.09.2026 (Lese-Abnahme des Chats): die feste Grenze
   * "25 überall" ist AUFGEGEBEN. Zwei Regeln aus derselben Abnahme ziehen in
   * entgegengesetzte Richtungen und lassen sich nicht beide bei 25 erfüllen:
   * (a) "kein Inhaltswort in mehr als 8 Zeilen" UND (b) "eine Zeile ist
   * ENTWEDER eine saubere Wortreihe ODER ein grammatisch richtiger Satz,
   * kein Buchstabensalat". An Sprosse 9-13 gibt der Wortschatz (9-16
   * Buchstaben, davon nur `e i u a o` als Vokale) schlicht nicht genug
   * verschiedene, wiederholungsarme Wörter für 25 SAUBERE Zeilen her; an
   * Sprosse 14-24 hätte das Auffüllen auf 25 Zeilen erzwungen, entweder
   * Inhaltswörter über die 8er-Grenze zu wiederholen oder künstliche
   * Füll-Sätze zu schreiben. Die Grenzen unten sind der GEMESSENE Stand nach
   * der Nachbesserung (nicht geraten) - jede Grenze darf künftig nur
   * STEIGEN, nie sinken. Siehe BEFUND-2026-09-26-E8A-TEXTE-KINDER.md §1/§3.
   */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    9: 6, 10: 9, 11: 12, 12: 7, 13: 17, 14: 20, 15: 16, 16: 16,
    17: 14, 18: 9, 19: 21, 20: 11, 21: 15, 22: 22, 23: 20, 24: 16,
  };

  it("je Sprosse 9-24 mindestens so viele Korpuszeilen wie zuletzt gemessen (berechnete Sprosse, kein Kommentar)", () => {
    const anzahlJeSprosse = new Map<number, number>();
    for (const item of CORPUS_FR_WEG_FRUEH_KIDS) {
      const sprosse = berechneteSprosse(item.text);
      if (sprosse === null || sprosse > LETZTE_SPROSSE) continue;
      anzahlJeSprosse.set(sprosse, (anzahlJeSprosse.get(sprosse) ?? 0) + 1);
    }
    const zuWenig: string[] = [];
    for (let n = ERSTE_SPROSSE; n <= LETZTE_SPROSSE; n++) {
      const anzahl = anzahlJeSprosse.get(n) ?? 0;
      const mindestens = MINDESTENS_JE_SPROSSE[n] ?? 25;
      if (anzahl < mindestens) zuWenig.push(`Sprosse ${n}: nur ${anzahl} (mindestens ${mindestens})`);
    }
    expect(zuWenig, zuWenig.join("\n")).toEqual([]);
  });

  it("kein Inhaltswort (Nomen/Verb/Adjektiv) kommt in mehr als 8 Zeilen vor", () => {
    // Funktionswörter (Artikel, Pronomen, Präpositionen, Konjunktionen,
    // Kern-Hilfsverben) sind bewusst ausgenommen - sie tragen in JEDER
    // Sprache die meiste Last und ihre Häufigkeit ist kein Zeichen von
    // Monotonie. Alles andere (auch Bestimmungswörter wie „chaque") zählt.
    const FUNKTIONSWOERTER = new Set([
      "je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles", "me", "te", "se", "s'",
      "lui", "leur", "y", "en", "moi", "toi",
      "le", "la", "les", "l'", "un", "une", "des", "du", "de", "d'", "ce", "c'", "cette", "ces", "qu'",
      "mon", "ma", "mes", "ton", "ta", "tes", "son", "sa", "ses", "notre", "nos", "votre", "vos", "leurs",
      "et", "ou", "mais", "que", "qui", "si", "comme", "quand",
      "ne", "pas", "non", "oui",
      "à", "dans", "pour", "avec", "sur", "sous", "par", "vers", "chez", "sans", "avant",
      "est", "es", "sont", "était", "avait", "ai", "a", "as", "ont", "va", "vais", "au",
      "tout", "toute", "tous", "toutes", "plus", "très", "ici", "là", "aussi", "encore", "bien", "trop", "peu",
    ]);

    function woerterOhneFunktionswoerter(text: string): string[] {
      return [
        ...new Set(
          text
            .toLowerCase()
            .replace(/'/g, "' ")
            .split(/\s+/)
            .map((w) => w.replace(/[^a-zà-öø-ÿ']/g, ""))
            .filter(Boolean)
            .filter((w) => !FUNKTIONSWOERTER.has(w)),
        ),
      ];
    }

    const alleZeilen = [
      ...CORPUS_FR_WEG_FRUEH_KIDS.map((i) => i.text),
      ...SERIEN_FR_WEG_FRUEH_KIDS.flatMap((s) => s.etappen.flatMap((e) => e.lines)),
    ];
    const haeufigkeit = new Map<string, number>();
    for (const zeile of alleZeilen) {
      for (const wort of woerterOhneFunktionswoerter(zeile)) {
        haeufigkeit.set(wort, (haeufigkeit.get(wort) ?? 0) + 1);
      }
    }
    const zuHaeufig: string[] = [];
    for (const [wort, n] of haeufigkeit) {
      if (n > 8) zuHaeufig.push(`"${wort}": ${n} Zeilen`);
    }
    expect(zuHaeufig, zuHaeufig.join("\n")).toEqual([]);
  });
});

describe("E8a: Serien fr-Weg, Sprosse 17-24 (Kids)", () => {
  it("12 Serien mit je ETAPPE_MIN_LINES-ETAPPE_MAX_LINES Zeilen, nurWeg fr, lang fr, Stufe kids", () => {
    // ★ E8a-2 (26.09.2026): die volle Suite (tests/typing-textwelt-serien.test.ts,
    // `validateSerie`) verlangt 12-16 Zeilen je Etappe (ETAPPE_MIN_LINES/MAX,
    // serie.ts) - NICHT die 4-8 aus dem ursprünglichen E8a-Auftragstext (der
    // bezog sich auf die Kurzfassung vor dem Zusammenführen). Heute liegen
    // alle 12 Serien bei genau 12 Zeilen (das Minimum, bewusst - siehe
    // Befund: „lieber zwei Serien zusammenlegen als Füllsätze").
    expect(SERIEN_FR_WEG_FRUEH_KIDS.length).toBe(12);
    for (const serie of SERIEN_FR_WEG_FRUEH_KIDS) {
      expect(serie.lang, serie.slug).toBe("fr");
      expect(serie.nurWeg, serie.slug).toBe("fr");
      expect(serie.stufen, serie.slug).toEqual(["kids"]);
      const n = serie.etappen.reduce((sum, e) => sum + e.lines.length, 0);
      expect(n, `${serie.slug}: ${n} Zeilen`).toBeGreaterThanOrEqual(ETAPPE_MIN_LINES);
      expect(n, `${serie.slug}: ${n} Zeilen`).toBeLessThanOrEqual(ETAPPE_MAX_LINES);
    }
  });

  it("jede fr-Serie besteht validateSerie(s, \"fr\") - dieselbe Prüfung wie die volle Suite", () => {
    // ★ E8a-2: fängt genau das ab, was in der vollen Suite erst nach dem
    // Zusammenführen auffiel (12-16-Grenze) - hier VOR dem Zusammenführen.
    for (const serie of SERIEN_FR_WEG_FRUEH_KIDS) {
      const v = validateSerie(serie, "fr");
      expect(v.problems, `${serie.slug}: ${v.problems.join("; ")}`).toEqual([]);
      expect(v.ok, serie.slug).toBe(true);
    }
  });

  it("jede Serien-Zeile ist an ihrer erklärten Stufe schon tippbar, und minTier ist das echte Maximum", () => {
    // `Serie.minTier` gilt laut serie.ts als "typischerweise das Maximum über
    // alle Zeilen" - NICHT jede einzelne Zeile muss selbst so hoch liegen
    // (eine Serie darf leichtere Zeilen neben der schwersten haben). Zwei
    // Prüfungen darum: (a) keine Zeile verlangt MEHR als deklariert, (b)
    // mindestens eine Zeile erreicht die deklarierte Stufe wirklich - sonst
    // wäre `minTier` zu hoch gegriffen und die Serie schlösse zu spät auf.
    const fehler: string[] = [];
    for (const serie of SERIEN_FR_WEG_FRUEH_KIDS) {
      let maxTier = 0;
      for (const etappe of serie.etappen) {
        for (const line of etappe.lines) {
          const sprosse = berechneteSprosse(line);
          if (sprosse === null) {
            fehler.push(`"${line}" (${serie.slug}): passt zu keiner Sprosse`);
            continue;
          }
          const tier = minTierFor(line, "fr") ?? -1;
          if (tier > serie.minTier) {
            fehler.push(`"${line}" (${serie.slug}): braucht Tier ${tier}, Serie deklariert nur ${serie.minTier}`);
          }
          maxTier = Math.max(maxTier, tier);
        }
      }
      if (maxTier !== serie.minTier) {
        fehler.push(`${serie.slug}: minTier=${serie.minTier}, tatsächliches Maximum ${maxTier}`);
      }
    }
    expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
  });

  it("keine Serien-Zeile kommt doppelt vor (auch nicht gegen den Korpus)", () => {
    const alle: string[] = [];
    for (const serie of SERIEN_FR_WEG_FRUEH_KIDS) {
      for (const etappe of serie.etappen) alle.push(...etappe.lines);
    }
    const klein = alle.map((t) => t.toLowerCase());
    const gesehen = new Map<string, number>();
    const fehler: string[] = [];
    for (const t of klein) gesehen.set(t, (gesehen.get(t) ?? 0) + 1);
    for (const [t, n] of gesehen) if (n > 1) fehler.push(`Duplikat innerhalb der Serien: "${t}" (${n}x)`);

    const korpus = new Set(CORPUS_FR_WEG_FRUEH_KIDS.map((i) => i.text.toLowerCase()));
    for (const t of klein) if (korpus.has(t)) fehler.push(`Überschneidung mit dem Korpus: "${t}"`);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("mindestens ein Drittel der Serien spielt ausserhalb Frankreichs (Bauplan §6.5 Regel 8)", () => {
    // Nur eine grobe, dokumentierte Zuordnung über den Slug - siehe Kopf von
    // serienFrWegFruehKids.ts für die Begründung je Serie.
    const ausserhalbFrankreich = [
      "fr-weg-kids-fatou-et-sa-tortue", // Senegal/Westafrika
      "fr-weg-kids-karima-et-son-oiseau", // Maghreb
      "fr-weg-kids-un-jour-de-fete", // Côte d'Ivoire/Westafrika
      "fr-weg-kids-chloe-a-la-montagne", // Schweiz
    ];
    for (const slug of ausserhalbFrankreich) {
      expect(SERIEN_FR_WEG_FRUEH_KIDS.some((s) => s.slug === slug), slug).toBe(true);
    }
    expect(ausserhalbFrankreich.length / SERIEN_FR_WEG_FRUEH_KIDS.length).toBeGreaterThanOrEqual(1 / 3);
  });
});

describe("E8a: Manulex-Wächter (Bauplan §6.7)", () => {
  /**
   * Die 150 häufigsten CP-Wortformen aus Manulex (Quelle siehe Kopf dieser
   * Datei), gemessen am 25./26.09.2026 mit dem Paket `xlsx` gegen
   * `Sensorik/sprachdaten/fr/Manulex.xls`, Blatt „FORMES ORTHO": Spalte A
   * (Wortform) nach Spalte F ("CP U", Häufigkeit je Million) absteigend
   * sortiert, mehrfache Zeilen derselben Form (verschiedene Wortarten)
   * zusammengefasst (höchster Wert), Mehrwort-Einträge und blosse
   * Elisions-Fragmente (`l'`, `c'`, `qu'` …) weggelassen. Nur zum MESSEN -
   * die Lizenz (CC BY-NC-SA 3.0) ist darum ohne Wirkung auf das Programm.
   */
  const TOP_150_CP = [
    "le", "la", "un", "de", "il", "une", "est", "et", "les", "des", "dans",
    "elle", "je", "qui", "du", "en", "se", "pour", "tu", "avec", "sur", "son",
    "pas", "dit", "au", "ne", "sa", "petit", "mais", "lui", "on", "que",
    "plus", "bien", "ils", "fait", "maman", "ses", "sont", "va", "très",
    "faire", "mon", "ce", "ai", "chat", "moi", "tout", "vous", "maison",
    "nous", "vite", "aussi", "était", "papa", "deux", "par", "regarde",
    "comme", "où", "eau", "ou", "petite", "aux", "quand", "si", "jardin",
    "école", "alors", "joue", "ma", "chez", "cette", "enfants", "là", "tous",
    "tête", "bonne", "ont", "toi", "as", "non", "te", "suis", "jour", "lit",
    "histoire", "arrive", "puis", "peu", "ça", "me", "oui", "mots", "faut",
    "encore", "chien", "avait", "nuit", "voiture", "trois", "poisson",
    "trop", "rue", "temps", "gros", "maintenant", "met", "petits", "matin",
    "sans", "bon", "chaque", "fois", "beaucoup", "beau", "rien", "ours",
    "grand", "lire", "sous", "ces", "vu", "peur", "voilà", "livre", "rouge",
    "soleil", "toute", "trouve", "vélo", "voir", "terre", "monde", "amis",
    "nez", "sais", "prend", "oh", "aime", "neige", "peux", "porte", "ami",
    "quel", "leur", "garçon", "peut", "manger", "vais",
  ] as const;

  const T2_ALPHABET = new Set(FR_LETTER_ORDER.slice(0, LETZTE_SPROSSE).map((c) => c.toLowerCase()));
  T2_ALPHABET.add("'");

  function schreibbarAnSprosse24(wort: string): boolean {
    return [...wort.toLowerCase()].every((ch) => T2_ALPHABET.has(ch));
  }

  it("von den an Sprosse 24 schreibbaren Top-150-CP-Formen kommt jede in mindestens einer Zeile vor", () => {
    const schreibbar = TOP_150_CP.filter(schreibbarAnSprosse24);
    // Gegenprobe gegen einen leeren/kaputten Wächter: die Liste muss selbst
    // eine ordentliche Menge schreibbarer Formen enthalten.
    expect(schreibbar.length).toBeGreaterThan(100);

    const alleZeilen = [
      ...CORPUS_FR_WEG_FRUEH_KIDS.map((i) => i.text),
      ...SERIEN_FR_WEG_FRUEH_KIDS.flatMap((s) => s.etappen.flatMap((e) => e.lines)),
    ];
    const text = alleZeilen.join(" \u0000 ").toLowerCase();

    // "\b" behandelt "é" nicht als Wortzeichen (JS-\w ist ASCII-only) -
    // eigene Grenzprüfung; der Apostroph zählt als Grenze (Elision: "j'ai"
    // ist sprachlich "je" + "ai", die Wortgrenze liegt genau dort).
    const NICHT_BUCHSTABE = "(?:^|[^a-zà-öø-ÿ])";
    const fehlend: string[] = [];
    for (const wort of schreibbar) {
      const re = new RegExp(`${NICHT_BUCHSTABE}${wort}${NICHT_BUCHSTABE}`, "u");
      if (!re.test(text)) fehlend.push(wort);
    }
    expect(fehlend, `${fehlend.length} fehlende Form(en): ${fehlend.join(", ")}`).toEqual([]);
  });
});
