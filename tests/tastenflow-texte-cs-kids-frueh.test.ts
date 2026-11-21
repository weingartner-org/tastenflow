/**
 * ★★★ Wächter CS-T1 (03.10.2026): die frühen cs-Texte für Kinder
 * (`corpusCsWegFruehKids.ts`, Sprossen 7-17 - bis zur Sprosse vor ⇧ - auf `cs`
 * UND `cs-qwerty`). Vorbild: `tastenflow-texte-it-kids-frueh.test.ts`; Befund
 * `BEFUND-2026-10-02-CS-T1-KIDS-FRUEH.md`, Leitfaden Fallen 26/31/37/45/48/58/61.
 *
 * Die Sprosse einer Zeile wird hier AUSGERECHNET (kleinstes n, ab dem `fitText`
 * sie mit `introOrder("cs").slice(0, n)` durchlässt) - auf BEIDEN Pflicht-
 * Tastaturen, nie aus einem Kommentar geglaubt. Die zwei Tastaturen tauschen nur
 * `y` und `z` (beide nach ⇧): vor ⇧ ist die Folge gleich, jede Zeile hat auf
 * beiden dieselbe Sprosse - das prüft der Wächter, statt es anzunehmen.
 *
 * ⚠️ Tschechisch hat KEIN Wörterbuch (das macOS-Wörterbuch nimmt jedes Wort an,
 * Falle 61): ein Wort, das weder im Wortschatz (`WORDS_CS`, `STUFE_VOCAB_CS`) noch
 * in den Tatoeba-Formen (`NACHTRAG_CS`) steht, braucht hier eine Begründung
 * (`OHNE_TATOEBA_BELEG`). Jede Regel hat eine Gegenprobe: der Prüfer muss einen
 * gebauten Fehler finden.
 */
import { afterEach, describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { SERIEN } from "../src/lib/typing/serien";
import { serieLines } from "../src/lib/typing/serie";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import {
  fitText,
  corpusItemsFor,
  korpusFuer,
  CORPUS,
  CORPUS_EN,
  CORPUS_FR,
  CORPUS_IT,
  CORPUS_PL,
  CORPUS_TR,
} from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_CS } from "../src/lib/typing/corpusCs";
import { CORPUS_CS_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusCsWegFruehKids";
import { allowedFromIntroduced } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { bausteinId, bausteinKey } from "../src/lib/typing/ledger";
import { corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";
import { gesperrtCs, istKernGesperrtCs } from "../src/lib/typing/sperrlisteCs";
import { WORDS_CS, STUFE_VOCAB_CS } from "../src/lib/typing/wordsCs";
import { NACHTRAG_CS } from "../src/lib/typing/lexikonNachtragCs";
import { isRealWord } from "../src/lib/typing/lexicon";
import { zeilenFehler } from "./helfer/csTextRegeln";

afterEach(() => setLayout("de"));

const TASTATUREN: LayoutId[] = ["cs", "cs-qwerty"];
const ZEILEN = CORPUS_CS_WEG_FRUEH_KIDS.map((i) => i.text);
/** Die erste Sprosse mit echten Wörtern: an 7 ist „a" der erste Vokal - davor nur Konsonanten der Grundreihe. */
const ERSTE_SPROSSE = 7;
/** Die Charge reicht bis zur Sprosse vor ⇧ (Wächter unten: = `letzteSprosse(l)` auf beiden Tastaturen). */
const GEBAUT_BIS = 17;

/** Die Sprosse direkt vor ⇧ - aus der Reihenfolge der Tastatur gerechnet, nicht gezählt. */
function letzteSprosse(layout: LayoutId): number {
  setLayout(layout);
  return introOrder("cs").indexOf(SHIFT_UNIT);
}

/** Kleinste Sprosse vor ⇧, an der `fitText` den Text durchlässt (null: nie vor ⇧). */
function sprosseAuf(text: string, layout: LayoutId): number | null {
  setLayout(layout);
  const o = introOrder("cs");
  const bis = o.indexOf(SHIFT_UNIT);
  for (let n = 1; n <= bis; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "cs"), "cs") !== null) return n;
  }
  return null;
}

describe("CS-T1: jede Zeile an ihrer Sprosse (cs und cs-qwerty)", () => {
  it("die Folge vor ⇧ ist auf beiden Tastaturen f j d k s l a ů e m i n o t v ě u (17 Einheiten)", () => {
    for (const l of TASTATUREN) {
      setLayout(l);
      expect(introOrder("cs").slice(0, 17).join(" "), l).toBe("f j d k s l a ů e m i n o t v ě u");
      expect(letzteSprosse(l), l).toBe(GEBAUT_BIS);
    }
  });

  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile passt an einer Sprosse ${ERSTE_SPROSSE}-${GEBAUT_BIS}, nicht früher, und minTier stimmt`, () => {
      const fehler: string[] = [];
      for (const item of CORPUS_CS_WEG_FRUEH_KIDS) {
        const s = sprosseAuf(item.text, l);
        if (s === null || s < ERSTE_SPROSSE || s > GEBAUT_BIS) fehler.push(`"${item.text}": Sprosse ${s}`);
        const tier = minTierFor(item.text, "cs");
        if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
      }
      expect(fehler, fehler.join("\n")).toEqual([]);
    });
  }

  it("jede Zeile hat auf cs und cs-qwerty DIESELBE Sprosse (y/z kommen erst nach ⇧)", () => {
    const fehler = ZEILEN.filter((t) => sprosseAuf(t, "cs") !== sprosseAuf(t, "cs-qwerty"));
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: ů an 8, ě an 16, u an 17; p, á, y, z, ž, teď (nach ⇧) passen vor ⇧ nie", () => {
    for (const l of TASTATUREN) {
      expect(sprosseAuf("sůl", l), l).toBe(8);
      expect(sprosseAuf("můj dům", l), l).toBe(10);
      expect(sprosseAuf("dvě slova", l), l).toBe(16);
      expect(sprosseAuf("děti jdou ven", l), l).toBe(17);
      for (const t of ["pes", "máma", "my", "zima", "že", "teď", "je to tady"]) expect(sprosseAuf(t, l), `${l}: ${t}`).toBeNull();
    }
  });

  it("vor Sprosse 7 gibt es keinen Vokal (keine echten Wörter) - auf beiden Tastaturen", () => {
    for (const l of TASTATUREN) {
      setLayout(l);
      const vorher = introOrder("cs").slice(0, ERSTE_SPROSSE - 1);
      expect(vorher.filter((u) => "aeiouyáéíóúůýě".includes(u)), l).toEqual([]);
      expect(introOrder("cs")[ERSTE_SPROSSE - 1], l).toBe("a");
    }
  });

  /**
   * GEMESSEN am Ende von CS-T1 (vom Code gezählt, nicht geschätzt) - jede Grenze darf künftig nur STEIGEN. Unter 6
   * liegt sie, wo die Buchstaben nicht mehr hergeben (Befund §2): an 7 nur der Vokal „a" (einzelne Wörter), an 8 die
   * `ů` nur in sůl, důl, kůl.
   */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    7: 4, 8: 4, 9: 7, 10: 8, 11: 7, 12: 9, 13: 16, 14: 18, 15: 13, 16: 19, 17: 23,
  };

  for (const l of TASTATUREN) {
    it(`${l}: je Sprosse mindestens so viele Zeilen wie gemessen (gerechnete Sprosse)`, () => {
      const anzahl = new Map<number, number>();
      for (const t of ZEILEN) {
        const s = sprosseAuf(t, l);
        if (s !== null) anzahl.set(s, (anzahl.get(s) ?? 0) + 1);
      }
      const zuWenig: string[] = [];
      for (let n = ERSTE_SPROSSE; n <= GEBAUT_BIS; n++) {
        const soll = MINDESTENS_JE_SPROSSE[n] ?? 6;
        if ((anzahl.get(n) ?? 0) < soll) zuWenig.push(`Sprosse ${n}: ${anzahl.get(n) ?? 0} < ${soll}`);
      }
      expect(zuWenig, zuWenig.join("\n")).toEqual([]);
    });
  }
});

describe("CS-T1: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
  /** Zeilen, deren Text die an ihrer Sprosse neue Einheit NICHT enthält. */
  function ohneNeueEinheit(zeilen: { text: string; sprosse: number }[], layout: LayoutId): string[] {
    setLayout(layout);
    const o = introOrder("cs");
    return zeilen
      .filter((z) => !z.text.includes(o[z.sprosse - 1]))
      .map((z) => `"${z.text}" (Sprosse ${z.sprosse}, ${o[z.sprosse - 1]})`);
  }

  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile enthält die Einheit ihrer (gerechneten) Sprosse`, () => {
      const zeilen = ZEILEN.map((text) => ({ text, sprosse: sprosseAuf(text, l) })).filter(
        (z): z is { text: string; sprosse: number } => z.sprosse !== null,
      );
      const fehler = ohneNeueEinheit(zeilen, l);
      expect(fehler, fehler.join("\n")).toEqual([]);
    });

    it(`${l}: jede Einheit von a bis zur letzten vor ⇧ hat an ihrer Sprosse mindestens eine Zeile (W6)`, () => {
      setLayout(l);
      const o = introOrder("cs");
      const fehlt: string[] = [];
      for (let n = ERSTE_SPROSSE; n <= GEBAUT_BIS; n++) {
        const erlaubt = allowedFromIntroduced(o.slice(0, n), "cs");
        const treffer = ZEILEN.filter((t) => fitText(t, erlaubt, "cs") !== null && t.includes(o[n - 1]));
        if (treffer.length === 0) fehlt.push(`${n}:${o[n - 1]}`);
      }
      expect(fehlt, `${l}: Einheiten ohne Zeile`).toEqual([]);
    });
  }

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet", () => {
    expect(ohneNeueEinheit([{ text: "je led", sprosse: 10 }], "cs")).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "je led", sprosse: 9 }], "cs")).toEqual([]);
    expect(ohneNeueEinheit([{ text: "dvě slova", sprosse: 16 }], "cs-qwerty")).toEqual([]);
  });
});

// ── Form: klein, nur gelernte Zeichen, keine Satzzeichen, Hausregeln ─────────

/** Vor ⇧: nur die 17 Buchstaben der Folge (aus dem Code, nicht abgeschrieben) und einfache Leerzeichen. */
function formFehler(t: string): boolean {
  setLayout("cs");
  const erlaubt = new Set(introOrder("cs").slice(0, GEBAUT_BIS));
  return [...t].some((c) => c !== " " && !erlaubt.has(c)) || t !== t.trim() || t.includes("  ") || t.length === 0;
}

describe("CS-T1: vor ⇧ nur Kleinbuchstaben, keine Satzzeichen, Regeln des Weges", () => {
  it("jede Zeile besteht nur aus Buchstaben der Folge bis u und einfachen Leerzeichen (klein, ohne Satzzeichen)", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Grossbuchstabe, Punkt, á, y, Apostroph und doppeltes Leerzeichen werden gefunden", () => {
    for (const t of ["Je led", "je led.", "máma", "my", "je to tady", "l'a", "je  led", "Ůl"]) expect(formFehler(t), t).toBe(true);
    expect(formFehler("děti jdou ven")).toBe(false);
  });

  it("jede Zeile besteht die Regeln aller tschechischen Zeilen (`helfer/csTextRegeln.ts`, mit fruehSprossen)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z, { fruehSprossen: true }).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [kids], nurWeg cs, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_CS_WEG_FRUEH_KIDS) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["kids"]);
      expect(item.nurWeg, item.text).toBe("cs");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Geschlecht (Glossar §1 Regel 2, §4 Falle 8): nie eine Vergangenheit oder ein hartes Adjektiv für „du" ──

const GEGENDERTES_DU = /(^|\s)\p{L}+(l|la|li|ly) jsi(\s|$)|(^|\s)jsi (\p{L}+(l|la|li|ly|ý|á)|sám|sama)(\s|$)/u;

describe("CS-T1: kein gegendertes „du“", () => {
  it("keine Zeile spricht das Kind in der Vergangenheit oder mit hartem Adjektiv an", () => {
    expect(ZEILEN.filter((z) => GEGENDERTES_DU.test(z))).toEqual([]);
  });

  it("Gegenprobe: „udělal jsi to“, „jsi připravený“, „jsi připravená“, „jsi sama“ werden gefunden, „jdi sem“ nicht", () => {
    for (const z of ["udělal jsi to", "jsi připravený", "jsi připravená", "jsi sama"]) expect(GEGENDERTES_DU.test(z), z).toBe(true);
    expect(GEGENDERTES_DU.test("jdi sem")).toBe(false);
    expect(GEGENDERTES_DU.test("jedli jsme med")).toBe(false);
  });
});

// ── Wortschatz: Wortgrenze 8, Sperrliste, Belegliste, Diakritik ─────────────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht. */
const FUNKTIONSWOERTER = new Set(
  (
    "a i ani ale nebo s se si k ke v ve na do od o u z ze po pro za nad pod " +
    "je jsou jsem jsme jsi jste to ten ta ty tu tam sem tak jak kde kam jen ne ano jo " +
    "mi mě mně tě ho mu můj moje moji tvůj tvoje náš naše dnes"
  ).split(" "),
);

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    for (const w of new Set(z.split(" "))) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/**
 * Wörter dieser Charge, die NICHT in `WORDS_CS`, `STUFE_VOCAB_CS` oder `NACHTRAG_CS` (Tatoeba-Formen mit mindestens zwei
 * Belegen) stehen - mit Begründung, weil es für Tschechisch kein Wörterbuch gibt, das sie bestätigen könnte (Falle 61).
 * Alle sind gewöhnliche, spisovné Wörter bzw. regelmässige Formen [G: eigenes Sprachwissen]; sie gehören in die Lese-Abnahme
 * durch eine Person mit Tschechisch als Erstsprache (Prüfbericht P7). Über den Korpus kommen sie ins Vorlese-Lexikon
 * (`lexicon.ts`: Korpus-Wörter), die Stimme spricht sie ganz.
 */
const OHNE_TATOEBA_BELEG: Readonly<Record<string, string>> = {
  kajak: "Kajak (m.), Nom. - Sprosse 7 hat sonst kaum Wörter; Paddeln ist Breitensport (jet na vodu)",
  kajaků: "Gen. Pl. von kajak (nach sedm)",
  kajakem: "Instr. Sg. von kajak (jet kajakem)",
  skalka: "Felsgarten, kleiner Fels (f.) - Grundreihen-Wort",
  důl: "Bergwerk (m.) - Ostrava, Kladno; Grundreihen-Wort mit ů",
  jedle: "Tanne (f.) - Wald in Šumava und Beskydy",
  lekla: "l-Partizip f. von leknout se (erschrecken)",
  fialka: "Veilchen (f.)",
  lilie: "Lilie (f.)",
  jelen: "Hirsch (m.), Nom.",
  jeleni: "Nom. Pl. belebt von jelen (dva jeleni)",
  nejedeme: "verneinte 1. Pl. von jet (nikam nejedeme)",
  sokol: "Falke (m.)",
  mlok: "Feuersalamander (m.)",
  skokan: "Frosch der Gattung Rana (m.), Kinderbuch-Wort",
  kakao: "Kakao (n.)",
  domek: "Häuschen (m.) - Verkleinerung von dům, Thema Wechsel o/ů",
  los: "Elch (m.) - Šumava",
  seno: "Heu (n.)",
  atlas: "Atlas (m.) - Schulbuch",
  datel: "Specht (m.)",
  můstek: "kleine Brücke (m.) - Verkleinerung von most, Thema Wechsel o/ů",
  vdolek: "runder Hefekuchen (m.), böhmisches Gebäck",
  vdolku: "Gen. Sg. von vdolek (kousek vdolku)",
  konvalinka: "Maiglöckchen (f.)",
  kavka: "Dohle (f.)",
  stodole: "Lok. Sg. von stodola (na stodole)",
  tůni: "Lok. Sg. von tůň (v tůni) - Altwasser, Polabí",
  aktovka: "Schulranzen (f.)",
  volavka: "Reiher (f.) - Teiche",
  kos: "Amsel (m.)",
  větvi: "Lok. Sg. von větev (na větvi)",
  studeno: "Adverb (je studeno)",
  koledu: "Akk. von koleda (jít na koledu: Ostern, Weihnachten)",
  loutka: "Marionette (f.) - Puppenspiel (UNESCO 2016)",
  kulajdu: "Akk. von kulajda, südböhmische Suppe",
  louku: "Akk. von louka (jít na louku)",
  koukej: "Imperativ von koukat (hovorové, in Kindersprache üblich) - Zweifelsfall im Befund",
  sovu: "Akk. von sova",
  malujeme: "1. Pl. von malovat",
  tunelem: "Instr. Sg. von tunel (jet tunelem)",
  lanovkou: "Instr. Sg. von lanovka (Seilbahn: Krkonoše, Jeseníky)",
  dědina: "mährisch für vesnice (Dorf) - ÚJČ-Beleg in texte-quellen.md §3.1",
};

const VORHER_BEKANNT: ReadonlySet<string> = new Set(
  [...WORDS_CS, ...Object.values(STUFE_VOCAB_CS).flat(), ...NACHTRAG_CS].map((w) => w.toLowerCase()),
);

/** Wörter (ab zwei Buchstaben), die weder vorher bekannt waren noch begründet in der Belegliste stehen. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of z.split(" ")) if (w.length >= 2 && !VORHER_BEKANNT.has(w) && !(w in OHNE_TATOEBA_BELEG)) out.add(w);
  }
  return [...out];
}

/** Der kuratierte Wortschatz (von Hand gelesen) - gegen ihn prüft die Diakritik-Falle. */
const KURATIERT: ReadonlySet<string> = new Set([...WORDS_CS, ...Object.values(STUFE_VOCAB_CS).flat()].map((w) => w.toLowerCase()));
const AKZENT_VARIANTEN: Readonly<Record<string, readonly string[]>> = {
  a: ["á"], e: ["é", "ě"], i: ["í"], o: ["ó"], u: ["ú", "ů"], y: ["ý"], c: ["č"], s: ["š"], r: ["ř"], z: ["ž"],
  d: ["ď"], t: ["ť"], n: ["ň"],
};

/**
 * Die Diakritik-Falle (texte-quellen.md §3.4, Falle 36): vor ⇧ fehlen `á í é ý š č ř ž`. Ein Wort, das nicht im kuratierten
 * Wortschatz steht, dessen Form MIT einem Haken oder Strich aber dort steht (`mam` ⇒ `mám`, `muze` ⇒ `může`), ist fast
 * sicher die verstümmelte Form - Tatoeba enthält solche Tippfehler, darum genügt `NACHTRAG_CS` hier nicht.
 */
function diakritikVerdacht(zeilen: string[]): string[] {
  const out: string[] = [];
  for (const w of new Set(zeilen.flatMap((z) => z.split(" ")))) {
    if (KURATIERT.has(w)) continue;
    // alle Formen mit beliebig vielen hinzugefügten Haken/Strichen (`dite` ⇒ `dítě`), ohne die Form selbst
    let formen = [""];
    for (const ch of w) formen = formen.flatMap((f) => [ch, ...(AKZENT_VARIANTEN[ch] ?? [])].map((x) => f + x));
    const treffer = formen.filter((v) => v !== w && KURATIERT.has(v));
    if (treffer.length > 0) out.push(`${w} (gemeint ${treffer.join("/")}?)`);
  }
  return out;
}

describe("CS-T1: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet, ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `je les ${"abcdefghi"[i]}`);
    expect(zuHaeufig(neun)).toEqual(['"les": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis (frühe Kinderzeilen: auch kein Doppelsinn)", () => {
    const fehler = ZEILEN.flatMap((t) => t.split(" ").filter((w) => gesperrtCs(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurva (Kern), slepý und vole (Wortbasis) werden gefunden, knihovna, pero und volno nicht", () => {
    expect(istKernGesperrtCs("kurva")).toBe(true);
    expect(istKernGesperrtCs("slepý")).toBe(false);
    expect(gesperrtCs("slepý")).toBe(true);
    expect(gesperrtCs("vole")).toBe(true);
    expect(gesperrtCs("knihovna")).toBe(false);
    expect(gesperrtCs("pero")).toBe(false);
    expect(gesperrtCs("volno")).toBe(false);
  });

  it("jedes Wort stand schon im Wortschatz oder in den Tatoeba-Formen - oder steht begründet in OHNE_TATOEBA_BELEG", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Liste trägt nur, was wirklich gebraucht wird und nicht schon bekannt ist (sonst wächst sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => z.split(" ")));
    expect(Object.keys(OHNE_TATOEBA_BELEG).filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und eine falsche Endung werden gemeldet", () => {
    expect(ungeprueft(["je lesx", "dva jelenové"])).toEqual(["lesx", "jelenové"]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58)", () => {
    const buchstabiert = ZEILEN.filter((z) => z.split(" ").some((w) => w.length >= 2 && !isRealWord(w, "cs")));
    expect(buchstabiert).toEqual([]);
  });

  it("kein Wort ohne den Haken oder Strich, den es braucht (Diakritik-Falle)", () => {
    expect(diakritikVerdacht(ZEILEN)).toEqual([]);
  });

  it("Gegenprobe: „mam“, „muze“ und „dite“ werden gemeldet, „dal“ und „ze“ (eigene Wörter) nicht", () => {
    expect(diakritikVerdacht(["mam muze"]).map((f) => f.split(" ")[0])).toEqual(["mam", "muze"]);
    expect(diakritikVerdacht(["dite"]).length).toBeGreaterThan(0);
    expect(diakritikVerdacht(["dal ze"])).toEqual([]);
  });
});

// ── Keine Kopien, keine Paare, Anker ────────────────────────────────────────

/** Geschlecht und Zahl gleichgesetzt: „dal sůl" und „dala sůl", „on jde" und „ona jde" sind ein Paar. */
function paarForm(zeile: string): string {
  const pron: Record<string, string> = { on: "PRO", ona: "PRO", ono: "PRO", oni: "PRO", ony: "PRO" };
  return zeile
    .split(" ")
    .map((w) => pron[w] ?? w.replace(/(ou|em|ům|ech|[aeiouyáéíýěů])$/u, ""))
    .join(" ");
}

function paare(zeilen: string[]): string[] {
  const gesehen = new Map<string, string>();
  const out: string[] = [];
  for (const z of zeilen) {
    const f = paarForm(z);
    const frueher = gesehen.get(f);
    if (frueher !== undefined) out.push(`"${frueher}" / "${z}"`);
    else gesehen.set(f, z);
  }
  return out;
}

describe("CS-T1: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der Háček und Čárka nicht kennt)", () => {
    expect(new Set(ZEILEN).size).toBe(ZEILEN.length);
    const schluessel = ZEILEN.map((t) => bausteinKey("satz", t));
    expect(new Set(schluessel).size).toBe(ZEILEN.length);
  });

  it("Gegenprobe: der Ledger-Schlüssel macht aus ů und á denselben Trenner („dům“ = „dám“)", () => {
    expect(bausteinKey("satz", "dům")).toBe(bausteinKey("satz", "dám"));
  });

  it("keine Zeile gleicht einer Zeile der Wege de/en/fr/es/it/pl/tr (Text oder Ledger-Schlüssel)", () => {
    const fremd = [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR];
    const texte = new Set(fremd.map((i) => i.text.toLowerCase()));
    const schluessel = new Set(fremd.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CORPUS_CS_WEG_FRUEH_KIDS.filter(
      (i) => texte.has(i.text) || schluessel.has(bausteinKey(i.kind, i.text)),
    ).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("keine Zeile gleicht einer Serien-Zeile (alle Sprachen) oder einem Satz der Výzva-/Sfida-Banken (`schreibproben/`)", () => {
    const norm = (s: string) => s.toLowerCase().replace(/[.,?!:;"()]/g, "").replace(/\s+/g, " ").trim();
    const serien = new Set(SERIEN.flatMap((s) => serieLines(s)).map(norm));
    const ordner = resolve(process.cwd(), "src/lib/typing/schreibproben");
    const banken = new Set<string>();
    for (const datei of readdirSync(ordner).filter((d) => d.endsWith(".ts"))) {
      for (const m of readFileSync(join(ordner, datei), "utf8").matchAll(/"((?:[^"\\]|\\.)*)"|`([^`]*)`/g)) {
        for (const satz of (m[1] ?? m[2] ?? "").split(/[.?!\n]+/)) if (satz.trim()) banken.add(norm(satz));
      }
    }
    expect(serien.size).toBeGreaterThan(1000);
    expect(banken.size).toBeGreaterThan(1000);
    expect(ZEILEN.filter((z) => serien.has(norm(z)) || banken.has(norm(z)))).toEqual([]);
  });

  it("Gegenprobe: eine Zeile aus dem italienischen Korpus würde als Kopie erkannt", () => {
    const probe = CORPUS_IT[0];
    const schluessel = new Set(CORPUS_IT.map((i) => bausteinKey(i.kind, i.text)));
    expect(schluessel.has(bausteinKey("satz", probe.text))).toBe(true);
  });

  it("keine Paare (nur Geschlecht oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: dal/dala, on/ona und Einzahl/Mehrzahl werden als Paar erkannt", () => {
    expect(paare(["dal sůl", "dala sůl"])).toHaveLength(1);
    expect(paare(["on jde domů", "ona jde domů"])).toHaveLength(1);
    expect(paare(["jelen jde lesem", "jeleni jde lesem"])).toHaveLength(1);
    expect(paare(["les a sad", "sad a klas"])).toEqual([]);
  });
});

describe("CS-T1: Korpus-Anker und Auslieferung", () => {
  it("CORPUS_CS trägt die Charge als ersten Block, korpusFuer(\"cs\") jede Zeile (nichts still verschmolzen)", () => {
    expect(CORPUS_CS.slice(0, ZEILEN.length).map((i) => i.text)).toEqual(ZEILEN);
    const geladen = new Set(korpusFuer("cs").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_CS_WEG_FRUEH_KIDS.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "zzz probe cs t1", kind: "satz" as const, stufen: ["kids" as const] };
    const ids = manifestFor([
      ...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CORPUS_CS, probe,
    ]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  for (const l of TASTATUREN) {
    it(`${l}: Weg „cs“ bekommt vor ⇧ alle Zeilen dieser Charge - und nur eigene cs-Kinderzeilen`, () => {
      setLayout(l);
      const o = introOrder("cs");
      const allowed = allowedFromIntroduced(o.slice(0, GEBAUT_BIS), "cs");
      const geliefert = corpusItemsFor({ stufe: "kids", allowed, lang: "cs", lernweg: "cs" });
      expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
      // Spätere ⇧-Chargen (Kinder-Mitte) kommen über die Auto-Grossschreibung schon vor ⇧ an - ohne ihre noch nicht
      // gelernten Satzzeichen (`fitText`, wie IT-T4/ES-T4). Eigen ist darum der Rohtext ODER seine servierte Fassung.
      const eigeneKinder = new Set(
        CORPUS_CS.filter((i) => i.nurWeg === "cs" && i.stufen.includes("kids")).flatMap((i) => [
          i.text,
          fitText(i.text, allowed, "cs") ?? i.text,
        ]),
      );
      expect(geliefert.filter((t) => !eigeneKinder.has(t))).toEqual([]);
    });
  }

  it("Weg „de“ und Weg „it“ bekommen keine dieser Zeilen", () => {
    setLayout("de");
    const deO = introOrder("de");
    const de = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(deO, "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const itO = introOrder("it");
    const itZ = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(itO, "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => itZ.includes(t))).toEqual([]);
  });
});
