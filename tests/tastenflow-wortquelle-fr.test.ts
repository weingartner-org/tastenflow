/**
 * ★★★ WÄCHTER: KEINE ÜBUNGSFORM FÄLLT AUF WEG „fr" STILL AUF DEUTSCH (E10b,
 * 25.09.2026, Bauplan `BAUPLAN-2026-09-25-FRANZÖSISCHER-LEHRGANG.md` §2.3
 * Punkt 4: „für jede Funktion mit Weg-Parameter ein Aufruf mit „fr", der ein
 * anderes Ergebnis als „de" liefern muss, wo der Weg etwas bedeutet").
 *
 * Gefunden in E10a: `wortquelle(lang)` (`uebungsformen/hilfen.ts`) war
 * `lang === "en" ? WORDS_EN : WORDS` - für „fr" die deutsche Liste. Der
 * Probelauf über ALLE Formen fand dieselbe Ternäre danach in neun weiteren
 * Stellen (zwei eigene Kopien von `wortquelle`, sechs Inhalts-Vorräte, der
 * Korpus zweier Formen). Darum prüft dieser Wächter die FEHLERKLASSE, nicht
 * die reparierte Stelle: Jede Form in `UEBUNGSFORMEN` läuft einmal mit „de"
 * und einmal mit „fr" - derselbe Tastenstand, derselbe Zufall. Liefert „fr"
 * denselben INHALT wie „de", ist das ein stiller Rückfall.
 *
 * Teil 1: die Wortliste `WORDS_FR` und ihre Regeln (neue Rechtschreibung,
 * keine Landeswörter, kulturell ruhig) - mit Gegenproben, dass die Prüfungen
 * etwas finden.
 */
import { setLayout } from "../src/lib/typing/layouts";
import { describe, expect, it } from "vitest";
import { WORDS } from "@/lib/typing/words";
import { WORDS_EN } from "@/lib/typing/corpusEn";
import { WORDS_FR } from "@/lib/typing/wordsFr";
import { SHIFT_UNIT } from "@/lib/typing/letters";
import { UEBUNGSFORMEN } from "@/lib/typing/uebungsformen";
import { korpusQuelle, wortpool, wortquelle } from "@/lib/typing/uebungsformen/hilfen";
import { spiegelwoerter, UMKEHR_PAARE_FR } from "@/lib/typing/uebungsformen/spiegelwoerter";
import {
  gelaeufigkeitMoeglich,
  gelaeufigkeitsZeile,
} from "@/lib/typing/uebungsformen/gelaeufigkeit";
import type { FormKontext, Uebungsform } from "@/lib/typing/uebungsformen/typen";
import { CORPUS_FR } from "@/lib/typing/corpus";
import { VERBINDUNGEN_FR } from "@/lib/typing/uebungsformen/gelaeufigkeitFr";

/** Deterministischer Zufall - derselbe Samen für „de" und „fr". */
function zufall(samen: number): () => number {
  let s = samen;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

/** Alle Buchstaben, die AZERTY ohne Totaste hat, Ziffern, Satzzeichen, Umschalt. */
const ALLE_TASTEN = [
  ..."abcdefghijklmnopqrstuvwxyzéèàçù",
  ..."0123456789",
  ".", ",", "'", "-", "?", "!", ":",
  SHIFT_UNIT,
];

function ctx(lang: "de" | "fr", ueber: Partial<FormKontext> = {}): FormKontext {
  return {
    lernweg: lang,
    introduced: ALLE_TASTEN,
    shift: true,
    oneHand: false,
    stufe: "teens",
    lang,
    count: 8,
    zufall: zufall(7),
    ...ueber,
  };
}

/* ── Teil 1: die Liste ──────────────────────────────────────────────────── */

/**
 * Alte Rechtschreibung (Bauplan F4, §6.8): Zirkumflex auf `i`/`u` nur dort,
 * wo er Wörter unterscheidet - und die bekannten Einzelfälle der Reform.
 */
const ZIRKUMFLEX_ERLAUBT = new Set(["sûr", "sûre", "dû", "mûr", "mûre", "jeûne"]);
const ALTE_FORMEN = new Set(["oignon", "nénuphar", "événement", "porte-monnaie", "week-end"]);

function alteSchreibung(wort: string): boolean {
  if (ALTE_FORMEN.has(wort)) return true;
  return /[îû]/.test(wort) && !ZIRKUMFLEX_ERLAUBT.has(wort);
}

/** Wörter, die je Land anders heissen oder anders gemeint sind (§10.1). */
const LANDESWOERTER = [
  "déjeuner", "dejeuner", "diner", "dîner", "souper",
  "septante", "huitante", "octante", "nonante",
  "courriel", "weekend", "chocolatine", "cellulaire", "gomme",
];

/** Kulturell ruhig (§6.5 Punkt 6): kein Schweinefleisch, keine Religion, kein Alkohol. */
const NICHT_IN_DER_LISTE = [
  "porc", "cochon", "jambon", "saucisson", "lard", "lardon",
  "église", "mosquée", "noël", "ramadan", "dieu", "ange",
  "vin", "bière",
];

describe("★ WORDS_FR: eine eigene französische Liste nach den Hausregeln", () => {
  it("wortquelle: jede Sprache ihre eigene Liste - „fr“ ist NICHT die deutsche", () => {
    expect(wortquelle("fr")).toBe(WORDS_FR);
    expect(wortquelle("fr")).not.toBe(wortquelle("de"));
    expect(wortquelle("fr")).not.toBe(wortquelle("en"));
    // Deutsch und Englisch unverändert dieselben Listen wie vor E10b.
    expect(wortquelle("de")).toBe(WORDS);
    expect(wortquelle("en")).toBe(WORDS_EN);
  });

  it("ungefähr so gross wie die deutsche und die englische Liste", () => {
    expect(WORDS_FR.length).toBeGreaterThanOrEqual(Math.max(WORDS.length, WORDS_EN.length));
  });

  it("jedes Wort nur einmal", () => {
    const doppelt = WORDS_FR.filter((w, i) => WORDS_FR.indexOf(w) !== i);
    expect(doppelt).toEqual([]);
  });

  it("nur Kleinbuchstaben mit französischen Akzenten - kein œ, kein ' oder -, kein ä ö ü ß", () => {
    const falsch = WORDS_FR.filter((w) => !/^[a-zàâçéèêëïîôùû]+$/.test(w));
    expect(falsch).toEqual([]);
  });

  it("die Akzente sind wirklich da - sonst wäre es eine Liste ohne Französisch", () => {
    for (const zeichen of ["é", "è", "à", "ç", "ù"]) {
      expect(WORDS_FR.some((w) => w.includes(zeichen)), zeichen).toBe(true);
    }
  });

  it("nur neue Rechtschreibung (F4): kein îu/û ausser sûr, dû, mûr, jeûne; kein oignon, événement …", () => {
    expect(WORDS_FR.filter(alteSchreibung)).toEqual([]);
  });

  it("Gegenprobe: die Rechtschreib-Prüfung findet eingeschmuggelte alte Formen", () => {
    for (const alt of ["île", "boîte", "goût", "connaître", "oignon", "événement"]) {
      expect(alteSchreibung(alt), alt).toBe(true);
    }
    for (const neu of ["ile", "boite", "gout", "connaitre", "ognon", "sûr", "été"]) {
      expect(alteSchreibung(neu), neu).toBe(false);
    }
  });

  it("kein Wort, das je Land anders heisst (§10.1) - die Liste gilt für alle vier Varianten", () => {
    expect(WORDS_FR.filter((w) => LANDESWOERTER.includes(w))).toEqual([]);
  });

  it("kulturell ruhig (§6.5 Punkt 6)", () => {
    expect(WORDS_FR.filter((w) => NICHT_IN_DER_LISTE.includes(w))).toEqual([]);
  });
});

/* ── Teil 2: eine ganze Runde ───────────────────────────────────────────── */

describe("★ Spiegelwörter auf Weg „fr“ ziehen französische Wörter", () => {
  const FRANZOESISCH = new Set([...WORDS_FR, ...UMKEHR_PAARE_FR.flat()]);
  const NUR_DEUTSCH = new Set(WORDS.map((w) => w.toLowerCase()).filter((w) => !FRANZOESISCH.has(w)));

  it("jedes vorwärts getippte Wort einer Runde steht in WORDS_FR (oder ist eines der Paare)", () => {
    for (const samen of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const runde = spiegelwoerter.baue!(ctx("fr", { zufall: zufall(samen), count: 16 }));
      expect(runde, `Samen ${samen}`).not.toBeNull();
      const vorwaerts = runde!.zeilen.filter((_, i) => i % 2 === 0).map((z) => z.text);
      for (const wort of vorwaerts) {
        expect(FRANZOESISCH.has(wort), `${wort} (Samen ${samen})`).toBe(true);
        expect(NUR_DEUTSCH.has(wort), `${wort} ist Deutsch (Samen ${samen})`).toBe(false);
      }
    }
  });

  it("der Vorrat enthält Wörter mit Akzent, sobald die Akzent-Tasten frei sind", () => {
    const vorrat = wortpool(ctx("fr"), 4, 8);
    expect(vorrat.some((w) => /[éèàçù]/.test(w))).toBe(true);
  });

  it("ohne é-Taste kommt kein Wort mit é - es wird nie ohne Akzent gezeigt", () => {
    const ohneE = ALLE_TASTEN.filter((t) => t !== "é");
    const vorrat = wortpool(ctx("fr", { introduced: ohneE }), 1, 20);
    expect(vorrat.length).toBeGreaterThan(0);
    expect(vorrat.filter((w) => w.includes("é"))).toEqual([]);
  });
});

/* ── Teil 3: die Fehlerklasse über ALLE Formen ──────────────────────────── */

/** Der INHALT einer Runde als Wortmenge - ohne Rahmen („Schreib die Zahl: …"). */
function inhaltsWoerter(form: Uebungsform, c: FormKontext): Set<string> {
  const texte: string[] = [];
  if (form.fragen) {
    for (const aufgabe of form.fragen(c)) {
      const teile = aufgabe.frageTeile?.filter((t) => t.inhalt).map((t) => t.text);
      texte.push(...(teile ?? [aufgabe.frage]), ...aufgabe.antworten);
    }
  } else if (form.baue) {
    for (const zeile of form.baue(c)?.zeilen ?? []) texte.push(zeile.text);
  }
  return new Set(
    texte
      .join(" ")
      .toLowerCase()
      .split(/[\s.,;:!?"'()…-]+/)
      .filter(Boolean),
  );
}

/** Der stille Rückfall: „fr" liefert Inhalt, und zwar genau den von „de". */
function faelltAufDeutsch(form: Uebungsform, samen: number): boolean {
  const fr = inhaltsWoerter(form, ctx("fr", { zufall: zufall(samen) }));
  const de = inhaltsWoerter(form, ctx("de", { zufall: zufall(samen) }));
  if (fr.size === 0) return false;
  return fr.size === de.size && [...fr].every((w) => de.has(w));
}

/**
 * Formen, die mit Recht in beiden Sprachen dasselbe liefern - mit Grund. Wird
 * eine Form hier eingetragen, muss der Grund stimmen, nicht der Test grün werden.
 */
const SPRACHNEUTRAL: Record<string, string> = {
  alphabetreihen: "dasselbe Alphabet a-z in derselben Reihenfolge (Bauplan §8.1: Akzente gehören nicht dazu)",
};

describe("★★★ Keine Übungsform liefert auf Weg „fr“ still den deutschen Inhalt", () => {
  for (const form of UEBUNGSFORMEN) {
    if (SPRACHNEUTRAL[form.id]) continue;
    it(`${form.id}`, () => {
      for (const samen of [1, 7, 42]) {
        expect(faelltAufDeutsch(form, samen), `Samen ${samen}`).toBe(false);
      }
    });
  }

  it("Gegenprobe: eine Form, die die Sprache überhört, wird gefunden", () => {
    const taub: Uebungsform = {
      ...spiegelwoerter,
      id: "spiegelwoerter",
      baue: (c) => spiegelwoerter.baue!({ ...c, lang: "de", lernweg: "de" }),
    };
    expect(faelltAufDeutsch(taub, 7)).toBe(true);
  });

  it("der Wächter ist nicht leer: diese Formen liefern auf „fr“ wirklich Inhalt", () => {
    const mitInhalt = UEBUNGSFORMEN.filter(
      (f) => f.taugt(ctx("fr")) && inhaltsWoerter(f, ctx("fr")).size > 0,
    ).map((f) => f.id);
    for (const id of ["spiegelwoerter", "zwillingsgriffe", "wandernder-gross", "pyramide", "zahlendiktat", "fingerdiktat"]) {
      expect(mitInhalt, id).toContain(id);
    }
  });

  // ★ E10b-2 (26.09.2026): Die sechs Formen, die bis hierher auf „fr“ leer
  // waren (und darum nicht angeboten wurden), haben jetzt französischen
  // Inhalt - sie bieten sich an, und der Wächter oben prüft, dass es nicht der
  // deutsche ist. Die Inhalte selbst prüft `tastenflow-wortspiele-fr.test.ts`.
  it("die sechs Formen mit eigenem französischem Vorrat bieten sich auf „fr“ an", () => {
    const mitVorrat = ["buchstabensalat", "lueckentext", "korrekturlesen", "handschwerpunkte", "langersatz", "wasfehlt"];
    for (const id of mitVorrat) {
      const form = UEBUNGSFORMEN.find((f) => f.id === id)!;
      expect(form.taugt(ctx("fr")), id).toBe(true);
      expect(form.taugt(ctx("de")), `${id} auf „de“ unverändert`).toBe(true);
    }
    expect(korpusQuelle("fr")).toBe(CORPUS_FR);
  });

  it("Geläufigkeits-Zeilen: auf „fr“ französische, auf „de“ wie bisher", () => {
    const allowed = new Set(ALLE_TASTEN.filter((t) => t !== SHIFT_UNIT));
    expect(gelaeufigkeitMoeglich(allowed, "fr")).toBe(true);
    const fr = gelaeufigkeitsZeile(allowed, { stufe: "teens", lang: "fr", zufall: zufall(1) });
    expect(fr).not.toBeNull();
    expect(VERBINDUNGEN_FR.map((v) => v.folge)).toContain(fr!.folge);
    expect(gelaeufigkeitsZeile(allowed, { stufe: "teens", lang: "de", zufall: zufall(1) })).not.toBeNull();
  });
});

describe("★ Wandernder Großbuchstabe: kein Wort, dessen Grossbuchstabe fehlt", () => {
  it("ohne É-Taste wandert der Grossbuchstabe nie über ein é (Windows-AZERTY, Bauplan F5)", () => {
    // ★ 26.09.2026: die Tastatur ausdrücklich auf Windows-AZERTY stellen, wie
    // der Titel sagt. Bis E8b Block 1a lief der Test auf der Vorgabe „de" und
    // war nur grün, weil `fitText` ein grosses É überhaupt nie durchliess.
    setLayout("fr");
    const form = UEBUNGSFORMEN.find((f) => f.id === "wandernder-gross")!;
    for (const samen of [1, 2, 3, 4, 5]) {
      const runde = form.baue!(ctx("fr", { zufall: zufall(samen), count: 30 }));
      expect(runde).not.toBeNull();
      for (const z of runde!.zeilen) expect(z.text, `Samen ${samen}`).not.toMatch(/[éèàçù]/i);
    }
    setLayout("de");
  });
});
