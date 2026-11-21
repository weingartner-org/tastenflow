/**
 * ★★★ WÄCHTER (Falle 19): KEINE ÜBUNGSFORM LIEFERT FÜR it, pl, tr, cs STILL DEUTSCHEN INHALT
 * (G2b-2, 02.10.2026). Nach dem Vorbild `tastenflow-wortquelle-fr.test.ts`: jede Form in
 * `UEBUNGSFORMEN` läuft einmal mit „de" und einmal mit der neuen Sprache - derselbe Tastenstand,
 * derselbe Zufall. Liefert die neue Sprache denselben INHALT wie „de", ist das ein stiller
 * Rückfall. Der RAHMEN („Schreib die Zahl: …") ist egal: verglichen werden nur die Inhaltsteile.
 *
 * Bis die Etappe einer Sprache ihren eigenen Inhalt schreibt, gilt AUSDRÜCKLICH der englische
 * (Bauplan §2.1, Marke `RÜCKFALL-EN`) - oder die Form ist leer / wird nicht angeboten. Beides
 * erlaubt; Deutsch nie. Darum prüft der zweite Wächter nicht nur „nicht GENAU der deutsche
 * Inhalt", sondern: kein einziges Wort, das Deutsch ist und nicht auch Englisch (ein Gemisch
 * fiele beim ersten Test nicht auf).
 *
 * Dazu die Gegenprobe (eine taube Form wird gefunden) und: der Wächter ist nicht leer.
 */
import { describe, expect, it } from "vitest";
import type { Lang } from "@/lib/typing/account";
import { korpusFuer } from "@/lib/typing/corpus";
import { WORDS_EN } from "@/lib/typing/corpusEn";
import { SHIFT_UNIT } from "@/lib/typing/letters";
import { LERNWEGE, type Lernweg } from "@/lib/typing/lernweg";
import { WORDS } from "@/lib/typing/words";
import { UEBUNGSFORMEN } from "@/lib/typing/uebungsformen";
import { spiegelwoerter } from "@/lib/typing/uebungsformen/spiegelwoerter";
import type { FormKontext, Uebungsform } from "@/lib/typing/uebungsformen/typen";
import { GERUEST_SPRACHEN } from "@/lib/typing/sprachRegister";
import { wortquelle } from "@/lib/typing/uebungsformen/hilfen";

// ★ G2-NEUN (25.10.2026): dazu die neun Sprachen des Gerüsts (bg … uk) - sie haben noch keinen eigenen Inhalt und
// liefern Englisch oder nichts; beide Prüfungen (unten auch „kein nur-deutsches Wort") laufen für sie.
const NEUE: readonly Lang[] = ["it", "pl", "tr", "cs", ...GERUEST_SPRACHEN];

/** Deterministischer Zufall - derselbe Samen für „de" und die neue Sprache. */
function zufall(samen: number): () => number {
  let s = samen;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

/** Der VOLLE Tastenstand: alle Buchstaben (auch ä ö ü ß), Ziffern, Satzzeichen, Umschalt. */
const ALLE_TASTEN = [
  ..."abcdefghijklmnopqrstuvwxyzäöüß",
  ..."0123456789",
  ".", ",", "'", "-", "?", "!", ":", ";", '"', "(", ")",
  SHIFT_UNIT,
];

function ctx(lang: Lang, ueber: Partial<FormKontext> = {}): FormKontext {
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

/** Der INHALT einer Runde als Wortmenge - ohne Rahmen. */
function inhaltsWoerter(form: Uebungsform, c: FormKontext): Set<string> {
  const texte: string[] = [];
  if (!form.taugt(c)) return new Set();
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

const gleich = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every((w) => b.has(w));

/** Der stille Rückfall: die neue Sprache liefert Inhalt, und zwar genau den von „de". */
function faelltAufDeutsch(form: Uebungsform, sprache: Lang, samen: number): boolean {
  const neu = inhaltsWoerter(form, ctx(sprache, { zufall: zufall(samen) }));
  const de = inhaltsWoerter(form, ctx("de", { zufall: zufall(samen) }));
  if (neu.size === 0) return false;
  return gleich(neu, de);
}

/**
 * Formen, die mit Recht in beiden Sprachen dasselbe liefern - mit Grund. Wird eine Form hier
 * eingetragen, muss der Grund stimmen, nicht der Test grün werden.
 */
const SPRACHNEUTRAL: Record<string, string> = {
  alphabetreihen: "dasselbe Alphabet a-z in derselben Reihenfolge",
};

describe("★★★ Keine Übungsform liefert für eine neue Sprache still den deutschen Inhalt", () => {
  for (const sprache of NEUE) {
    for (const form of UEBUNGSFORMEN) {
      if (SPRACHNEUTRAL[form.id]) continue;
      it(`${sprache} · ${form.id}`, () => {
        for (const samen of [1, 7, 42]) {
          expect(faelltAufDeutsch(form, sprache, samen), `Samen ${samen}`).toBe(false);
        }
      });
    }
  }

  it("Gegenprobe: eine Form, die die Sprache überhört, wird gefunden", () => {
    // ★ D-LERNDATEN (25.10.2026): die taube Form überhört die Sprache auch in `taugt` - sonst fragte `taugt` die EIGENEN
    // Wörter (bg/el/uk kyrillisch bzw. griechisch, mit a-z nicht tippbar) und die Probe fände nichts, obwohl `baue` taub ist.
    const taub: Uebungsform = {
      ...spiegelwoerter,
      id: "spiegelwoerter",
      taugt: (c) => spiegelwoerter.taugt({ ...c, lang: "de", lernweg: "de" }),
      baue: (c) => spiegelwoerter.baue!({ ...c, lang: "de", lernweg: "de" }),
    };
    for (const s of NEUE) expect(faelltAufDeutsch(taub, s, 7), s).toBe(true);
  });

  it("der Wächter ist nicht leer: diese Formen liefern auf einer neuen Sprache wirklich Inhalt (den englischen Rückfall)", () => {
    for (const s of NEUE) {
      // ★ K-KORPUS-NEUN (29.10.2026): seit bg/el/uk einen EIGENEN (kyrillischen bzw. griechischen) Korpus haben, liefern die
      // Korpus-Formen mit dem lateinischen Tastenstand `ALLE_TASTEN` nichts mehr (vorher: den englischen Rückfall). Gemessen
      // wird darum mit dem vollen Stand UND der ganzen Folge des eigenen Weges - die Frage ist „liefert die Form Inhalt?".
      const introduced = [...new Set([...ALLE_TASTEN, ...LERNWEGE[s as Lernweg].introOrder])];
      const mitInhalt = UEBUNGSFORMEN.filter((f) => inhaltsWoerter(f, ctx(s, { introduced })).size > 0).map((f) => f.id);
      expect(mitInhalt.length, s).toBeGreaterThan(3);
    }
  });
});

/** Alle Wörter eines Textbestands - klein, nur Buchstaben (mit ä ö ü ß). */
function woerterVon(texte: readonly string[]): Set<string> {
  const aus = new Set<string>();
  for (const t of texte) for (const w of t.toLowerCase().split(/[^a-zäöüß]+/)) if (w.length > 1) aus.add(w);
  return aus;
}

/**
 * Wörter, die DEUTSCH sind und nicht auch englisch („die", „und", „Haus" - aber nicht „in", „man",
 * „Hand"): Wortliste und Korpus beider Sprachen, deutsche Menge minus englische.
 */
/**
 * ★ O-TR (03.10.2026): Wörter der neuen Sprache, die zufällig auch deutsche Wörter sind
 * und in ihrem EIGENEN Rahmen stehen (keine deutschen Inhalte). Nur mit Beleg:
 * „alt" = türkisch „unten" - die untere Tastenreihe heisst nach dem verbindlichen
 * Glossar „alt sıra" (`recherche-tuerkisch-2026-10-02/GLOSSAR-tr.md` §2.1); das
 * Fingerdiktat nennt sie als Aufgabe („sol serçe parmak, alt sıra").
 */
const HOMOGRAF_DER_SPRACHE: Partial<Record<Lang, ReadonlySet<string>>> = { tr: new Set(["alt"]) };

const NUR_DEUTSCH = (() => {
  const de = woerterVon([...WORDS, ...korpusFuer("de").map((z) => z.text)]);
  const en = woerterVon([...WORDS_EN, ...korpusFuer("en").map((z) => z.text)]);
  return new Set([...de].filter((w) => !en.has(w)));
})();

describe("★ der Inhalt einer neuen Sprache enthält kein Wort, das nur Deutsch ist (leer oder englisch - beides erlaubt)", () => {
  it("der Wächter ist nicht leer: es gibt viele nur-deutsche Wörter, und eine deutsche Runde enthält welche", () => {
    expect(NUR_DEUTSCH.size).toBeGreaterThan(500);
    const treffer = UEBUNGSFORMEN.filter((f) => [...inhaltsWoerter(f, ctx("de"))].some((w) => NUR_DEUTSCH.has(w)));
    expect(treffer.length).toBeGreaterThan(3);
  });

  it("Gegenprobe: eine Form, die für „it“ deutsche Wörter liefert, wird von DIESER Prüfung gefunden", () => {
    const taub: Uebungsform = {
      ...spiegelwoerter,
      baue: (c) => spiegelwoerter.baue!({ ...c, lang: "de", lernweg: "de" }),
    };
    const neu = inhaltsWoerter(taub, ctx("it", { zufall: zufall(7) }));
    // der ENGLISCHE Vergleich kommt von der ECHTEN Form (die taube würde auch für „en“ deutsch liefern)
    const en = inhaltsWoerter(spiegelwoerter, ctx("en", { zufall: zufall(7) }));
    expect([...neu].filter((w) => NUR_DEUTSCH.has(w) && !en.has(w)).length).toBeGreaterThan(0);
  });

  // ★ F5-F8-it (02.10.2026): Italienisch hat seit F6 einen EIGENEN Wortschatz (`wordsIt.ts`). Diese Prüfung kennt nur „deutsch gegen
  // englisch" und wäre für ihn zufällig und falsch: ein italienisches Wort, das auch deutsch ist und nicht englisch (`mai`, `sei`, `rosa`, `bar`,
  // `rad` als Anfang von `radio` in der Pyramide), wäre ein „deutsches Wort". Für `it` prüft stattdessen
  // `tastenflow-it-woerter.test.ts` jeden Inhalt gegen die italienische Wortquelle - die richtigere Frage.
  // ★ F5-F8-pl (03.10.2026): Polnisch ebenso - sein Wortschatz (`wordsPl.ts`) ist ein eigener, und polnische Wörter, die auch deutsch sind
  // und nicht englisch (`jeden`, `konto`, `video`, `mo` als Anfang eines Pyramiden-Worts), wären hier „deutsche Wörter“. Für `pl` prüft
  // `tastenflow-pl-woerter.test.ts` jeden Inhalt gegen die polnische Wortquelle - die richtigere Frage.
  // ★ F5-F8-tr (03.10.2026): dasselbe für Türkisch (`wordsTr.ts`): ein türkisches Wort, das auch deutsch ist und nicht englisch (`da`, `an`,
  // `bin`, `ses`, `sen`), wäre ein „deutsches Wort"; für `tr` prüft `tastenflow-tr-woerter.test.ts` jeden Inhalt gegen die türkische Wortquelle.
  // ★ F5-F8-cs (03.10.2026): Tschechisch ebenso (`wordsCs.ts`): `lese` (Lokativ von `les`, Wald) und `tu` (hier) sind auch deutsche Wörter
  // und nicht englisch, `tut` ist eine Stufe der Pyramide von `tuto`. Für `cs` prüft `tastenflow-cs-woerter.test.ts` jeden Inhalt gegen die
  // tschechische Wortquelle. (Damit läuft diese Schleife für keine der vier neuen Sprachen mehr.)
  // (Die Schleife läuft für Sprachen ohne eigenen Wortschatz; heute sind es keine mehr - sie bleibt für die nächste neue Sprache.
  // Die Annahme `as Lang[]` verhindert, dass TypeScript den Filter auf `never` verengt.)
  // ★ D-LERNDATEN (25.10.2026): ebenso jede Gerüst-Sprache, sobald sie einen EIGENEN Wortschatz hat (Eigenschaft, nicht Kennung -
  // Falle 50: `wortquelle` liefert nicht mehr den englischen Rückfall). Niederländische, schwedische, portugiesische Wörter wie
  // `legt`, `ei`, `haar`, `tulpen`, `innen` sind auch deutsch und nicht englisch; für sie prüft `tests/tastenflow-lerndaten-<xx>.test.ts`
  // (§10, `tests/helfer/lerndatenNeueWege.ts`) dieselbe Frage mit dem eigenen Bestand als erlaubten Wörtern.
  const eigenerWortschatz = (s: Lang) => wortquelle(s) !== wortquelle("en");
  for (const sprache of NEUE.filter((s) => s !== "it" && s !== "pl" && s !== "tr" && s !== "cs" && !eigenerWortschatz(s)) as Lang[]) {
    for (const form of UEBUNGSFORMEN) {
      if (SPRACHNEUTRAL[form.id]) continue;
      it(`${sprache} · ${form.id}`, () => {
        for (const samen of [1, 7, 42, 99, 123]) {
          const neu = inhaltsWoerter(form, ctx(sprache, { zufall: zufall(samen) }));
          // Was der ENGLISCHE Weg mit demselben Zufall zeigt, ist erlaubt (der Rückfall ist ausdrücklich
          // Englisch). Nur-deutsche Wörter, die der englische Weg NICHT auch zeigt, sind der Fund.
          const en = inhaltsWoerter(form, ctx("en", { zufall: zufall(samen) }));
          const deutsch = [...neu].filter((w) => NUR_DEUTSCH.has(w) && !en.has(w) && !HOMOGRAF_DER_SPRACHE[sprache]?.has(w));
          expect(deutsch, `${form.id} (Samen ${samen}) zeigt deutsche Wörter`).toEqual([]);
        }
      });
    }
  }
});
