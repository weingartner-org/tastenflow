/**
 * ★★★ Wächter CS-T3 (09.10.2026): die frühen cs-Texte für Erwachsene
 * (`corpusCsWegFruehErwachsene.ts`, Sprossen 7-17 - bis zur Sprosse vor ⇧ - auf `cs`
 * UND `cs-qwerty`). Vorbild: `tastenflow-texte-cs-teens-frueh.test.ts` (CS-T2) und
 * `tastenflow-texte-tr-erwachsene-frueh.test.ts` (TR-T3: Auslieferung mit `umschalt: false`,
 * echte Runde, Wortbudget über die Chargen derselben Stufe); Befund
 * `BEFUND-2026-10-09-CS-T3-ERWACHSENE-FRUEH.md`, Leitfaden Fallen 26/31/37/45/48/58/61/92-100.
 *
 * Die Sprosse einer Zeile wird hier AUSGERECHNET (kleinstes n, ab dem `fitText`
 * sie mit `introOrder("cs").slice(0, n)` durchlässt) - auf BEIDEN Pflicht-
 * Tastaturen, nie aus einem Kommentar geglaubt.
 *
 * ★ Erwachsene bekommen vor ⇧ NUR Kleinschrift (D-2, `nurKleinschrift`): geprüft an der
 * Auslieferung (`corpusItemsFor` mit `umschalt: false`) und an der echten Runde
 * (`adaptiveRound`). Kinder und Jugendliche bekommen keine Erwachsenenzeile.
 *
 * ★ Kopien, Paare und „fast gleich" gegen die ROHE Sammelliste aus `corpusCs.ts` (Objekte,
 * ohne diese Charge), NICHT gegen die geladene Liste aus `corpus.ts` - dort wäre eine
 * wortgleiche Kopie (auch eine, die sich nur in Háček/Čárka unterscheidet, `bausteinKey`)
 * schon still verschmolzen. Und: jede Zeile bringt eine EIGENE ID in den Anker.
 *
 * ⚠️ Tschechisch hat KEIN Wörterbuch (das macOS-Wörterbuch nimmt jedes Wort an,
 * Falle 61): ein Wort, das weder im Wortschatz (`WORDS_CS`, `STUFE_VOCAB_CS`) noch
 * in den Tatoeba-Formen (`NACHTRAG_CS`) steht, braucht hier eine Begründung
 * (`OHNE_TATOEBA_BELEG`). Jede Regel hat eine Gegenprobe.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import {
  fitText,
  corpusItemsFor,
  korpusFuer,
  hatGrossbuchstaben,
  CORPUS,
  CORPUS_EN,
  CORPUS_FR,
  CORPUS_IT,
  CORPUS_PL,
  CORPUS_TR,
  CORPUS_CS as CS_GELADEN,
} from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_CS as CS_ROH } from "../src/lib/typing/corpusCs";
import { CORPUS_CS_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusCsWegFruehKids";
import { CORPUS_CS_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusCsWegFruehTeens";
import { CORPUS_CS_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusCsWegFruehErwachsene";
import { allowedFromIntroduced, SERIEN } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { adaptiveRound } from "../src/lib/typing/generator";
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
const CHARGE = CORPUS_CS_WEG_FRUEH_ERWACHSENE;
const ZEILEN = CHARGE.map((i) => i.text);
/** Alle ANDEREN cs-Zeilen (T1, T2 und jede spätere Charge), aus der ROHEN Sammelliste - nicht aus der geladenen. */
const ANDERE_CS = () => CS_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_CS_ZEILEN = (): string[] => ANDERE_CS().map((i) => i.text);
const KINDERZEILEN = CORPUS_CS_WEG_FRUEH_KIDS.map((i) => i.text);
const JUGENDZEILEN = CORPUS_CS_WEG_FRUEH_TEENS.map((i) => i.text);
/** Die erste Sprosse mit echten Wörtern: an 7 ist „a" der erste Vokal. */
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

describe("CS-T3: jede Zeile an ihrer Sprosse (cs und cs-qwerty)", () => {
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
      for (const item of CHARGE) {
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

  it("die Datei ist nach der gerechneten Sprosse sortiert", () => {
    const s = ZEILEN.map((t) => sprosseAuf(t, "cs") ?? 0);
    expect(s).toEqual([...s].sort((a, b) => a - b));
  });

  it("Gegenprobe: a an 7, ů an 8, ě an 16, u an 17; práce, úřad, doktor, byt, nájem, dobrý den, peníze (nach ⇧) passen vor ⇧ nie", () => {
    for (const l of TASTATUREN) {
      expect(sprosseAuf("sada skla", l), l).toBe(7);
      expect(sprosseAuf("důl a sklad", l), l).toBe(8);
      expect(sprosseAuf("tak se mějte", l), l).toBe(16);
      expect(sprosseAuf("jednou denně", l), l).toBe(17);
      for (const t of ["práce", "úřad", "doktor", "byt", "nájem", "dobrý den", "peníze", "dovolenou u vody"]) {
        expect(sprosseAuf(t, l), `${l}: ${t}`).toBeNull();
      }
    }
  });

  /**
   * GEMESSEN am Ende von CS-T3 (vom Code gezählt, nicht geschätzt) - jede Grenze darf künftig nur STEIGEN. Unter 6
   * liegt sie, wo die Buchstaben nicht mehr hergeben (Befund §2): an 7-11 fehlen den Erwachsenen die Wörter.
   */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    7: 1, 8: 1, 9: 2, 10: 1, 11: 1, 12: 5, 13: 9, 14: 12, 15: 14, 16: 12, 17: 27,
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

describe("CS-T3: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
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

    it(`${l}: jede Einheit von a bis zur letzten vor ⇧ hat an ihrer Sprosse mindestens eine Erwachsenenzeile (W6)`, () => {
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
    expect(ohneNeueEinheit([{ text: "tlak klesl", sprosse: 15 }], "cs")).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "tlak klesl", sprosse: 14 }], "cs")).toEqual([]);
    expect(ohneNeueEinheit([{ text: "tak se mějte", sprosse: 16 }], "cs-qwerty")).toEqual([]);
  });

  it("die echte Runde (adaptiveRound, Erwachsene, Fokus t) bringt Zeilen dieser Charge - klein, nicht nur Wort-Drill", () => {
    setLayout("cs");
    const o = introOrder("cs");
    const intro = o.slice(0, o.indexOf("t") + 1);
    const echt = Math.random;
    let s = 1009;
    const texte: string[] = [];
    try {
      for (let r = 0; r < 10; r++) {
        let a = s++ >>> 0;
        Math.random = () => {
          a = (a + 0x6d2b79f5) | 0;
          let t = Math.imul(a ^ (a >>> 15), 1 | a);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
        for (const z of adaptiveRound({ introduced: intro, focus: ["t"], stufe: "erwachsen", lang: "cs", lernweg: "cs", count: 12 })) {
          texte.push(z.text);
        }
      }
    } finally {
      Math.random = echt;
    }
    const eigene = new Set(ZEILEN);
    const treffer = texte.filter((t) => eigene.has(t) && t.includes("t"));
    expect(treffer.length, texte.slice(0, 12).join(" / ")).toBeGreaterThan(0);
    // D-2: vor ⇧ kommt bei Erwachsenen nichts mit Grossbuchstaben an, auch keine eigene Zeile.
    expect(texte.filter(hatGrossbuchstaben)).toEqual([]);
  });
});

// ── Form: klein, nur gelernte Zeichen, keine Satzzeichen, Hausregeln ─────────

/** Vor ⇧: nur die 17 Buchstaben der Folge (aus dem Code, nicht abgeschrieben) und einfache Leerzeichen. */
function formFehler(t: string): boolean {
  setLayout("cs");
  const erlaubt = new Set(introOrder("cs").slice(0, GEBAUT_BIS));
  return [...t].some((c) => c !== " " && !erlaubt.has(c)) || t !== t.trim() || t.includes("  ") || t.length === 0;
}

describe("CS-T3: vor ⇧ nur Kleinbuchstaben, keine Satzzeichen, Regeln des Weges", () => {
  it("jede Zeile besteht nur aus Buchstaben der Folge bis u und einfachen Leerzeichen (klein, ohne Satzzeichen)", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Grossbuchstabe, Punkt, á, y, Fragezeichen und doppeltes Leerzeichen werden gefunden", () => {
    for (const t of ["Tlak klesl", "tlak klesl.", "nájem", "u vody", "kotel nejede?", "jen  klid", "Ůl"]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("tlak klesl")).toBe(false);
  });

  it("jede Zeile besteht die Regeln aller tschechischen Zeilen (`helfer/csTextRegeln.ts`, mit fruehSprossen)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z, { fruehSprossen: true }).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [erwachsen], nurWeg cs, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["erwachsen"]);
      expect(item.nurWeg, item.text).toBe("cs");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Geschlecht (Glossar §1 Regel 2, §4 Falle 8): nie eine Vergangenheit oder ein hartes Adjektiv für „du" oder „ich" ──

const GEGENDERTES_DU = /(^|\s)\p{L}+(l|la|li|ly) jsi(\s|$)|(^|\s)jsi (\p{L}+(l|la|li|ly|ý|á)|sám|sama)(\s|$)/u;
/** „ich bin" mit hartem Adjektiv oder l-Partizip legt das Geschlecht der tippenden Person fest. */
const GEGENDERTES_ICH = /(^|\s)\p{L}+(l|la) jsem(\s|$)|(^|\s)jsem (\p{L}+(l|la|ý|á)|sám|sama)(\s|$)/u;
/** Die Rolle „Ehemann/Ehefrau" legt sie über das Gegenüber fest (`manžel`, `manželka`; vor ⇧ ohnehin ohne `ž`). */
const ROLLE = /(^|\s)(manžel\p{L}*|žena|muž)(\s|$)/u;

describe("CS-T3: keine Zeile legt das Geschlecht der tippenden Person fest", () => {
  it("kein gegendertes „du“, kein gegendertes „ich“, keine Ehe-Rolle", () => {
    expect(ZEILEN.filter((z) => GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z) || ROLLE.test(z))).toEqual([]);
  });

  it("Gegenprobe: „odeslal jsem“, „jsem unavená“, „dostal jsi“, „manžel“ werden gefunden; „mail jsme odeslali“, „loket otekl“, „omluvte mě“ nicht", () => {
    for (const z of ["odeslal jsem mail", "jsem unavená", "jsem sám"]) expect(GEGENDERTES_ICH.test(z), z).toBe(true);
    for (const z of ["dostal jsi slevu", "jsi sama"]) expect(GEGENDERTES_DU.test(z), z).toBe(true);
    expect(ROLLE.test("manžel je doma")).toBe(true);
    for (const z of ["mail jsme odeslali", "loket otekl", "omluvte mě", "malovali jsme sami"]) {
      expect(GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z) || ROLLE.test(z), z).toBe(false);
    }
  });
});

// ── Wortschatz: Wortgrenze 8 (über alle Erwachsenen-Chargen), Bewegungsverben, Sperrliste, Belegliste, Diakritik ──

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht (Liste wie CS-T1/T2). */
const FUNKTIONSWOERTER = new Set(
  (
    "a i ani ale nebo s se si k ke v ve na do od o u z ze po pro za nad pod " +
    "je jsou jsem jsme jsi jste to ten ta ty tu tam sem tak jak kde kam jen ne ano jo " +
    "mi mě mně tě ho mu můj moje moji tvůj tvoje náš naše dnes"
  ).split(" "),
);

/**
 * ★ CS-T6 (09.10.2026): klein geschrieben und ohne Satzzeichen gezählt - spätere Erwachsenen-Chargen (ab ⇧) haben
 * „V Praze …", „deset." und „Matěj,"; mit `split(" ")` zählte „V" als Inhaltswort (21 Zeilen) und „deset." neben „deset"
 * als eigenes Wort. Für die klein geschriebenen T3-Zeilen ohne Satzzeichen ändert sich nichts.
 * ★ CS-T9 (09.10.2026): nur noch Buchstabenfolgen - ab `-` und den Zeichen stand ein allein stehendes „-“ (oder „=“, „|“)
 * als „Wort in 10 Zeilen“ da (Muster CS-T7 am T4-Wächter). Für T3 ändert sich wieder nichts.
 */
function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    const woerter = z.toLowerCase().match(/\p{L}+/gu) ?? [];
    for (const w of new Set(woerter)) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** Alle Erwachsenenzeilen des Weges „cs" in der rohen Liste (T3 und später T6, T9) - das Wortbudget gilt über sie zusammen. */
const ALLE_ERWACHSENEN_CS = (): string[] => CS_ROH.filter((i) => i.stufen.includes("erwachsen")).map((i) => i.text);

/** Wie CS-T2: Formen von *jet, jít* und *les* sparsam (CS-T1 §4: dort 23 von 128 Zeilen). */
const BEWEGUNG =
  /(^|\s)(ne)?(u|od|do|při|pře|vy|za|s)?(jet|jedu|jedeš|jede|jedeme|jedete|jedou|jel|jela|jeli|jely|jít|jdu|jdeš|jde|jdeme|jdete|jdou|jdi|jděte|šel|šla|šli|les|lesa|lese|lesem|lesy|lesů)(\s|$)/u;
const BEWEGUNG_GRENZE = 4;

describe("CS-T3: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge (Wortbudget Erwachsene, F45)", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("★ Wortbudget über ALLE Erwachsenen-Chargen von „cs“ zusammen (T3 + T6 + T9): kein Inhaltswort in mehr als 8 Zeilen", () => {
    const alle = ALLE_ERWACHSENEN_CS();
    expect(alle).toEqual(expect.arrayContaining(ZEILEN));
    const fehler = zuHaeufig(alle);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet, ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `je to sklad ${"abcdefghi"[i]}`);
    expect(zuHaeufig(neun)).toEqual(['"sklad": 9 Zeilen']);
  });

  it(`Bewegungsverben und „les“ sparsam: höchstens ${BEWEGUNG_GRENZE} Zeilen (CS-T1 §4)`, () => {
    const treffer = ZEILEN.filter((z) => BEWEGUNG.test(z));
    expect(treffer.length, treffer.join("\n")).toBeLessThanOrEqual(BEWEGUNG_GRENZE);
  });

  it("Gegenprobe: nejede, nedojel, lese werden erkannt; jednou, jelita, jesle, leskl nicht", () => {
    for (const z of ["linka nejede", "kamion nedojel", "kalamita v lese"]) expect(BEWEGUNG.test(z), z).toBe(true);
    for (const z of ["jednou denně", "jelita od souseda", "jesle jsou daleko", "lak se leskl"]) expect(BEWEGUNG.test(z), z).toBe(false);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis", () => {
    const fehler = ZEILEN.flatMap((t) => t.split(" ").filter((w) => gesperrtCs(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurva (Kern), slepý und vole (Wortbasis) werden gefunden, sekanou, kolonii und sklenku nicht", () => {
    expect(istKernGesperrtCs("kurva")).toBe(true);
    expect(gesperrtCs("slepý")).toBe(true);
    expect(gesperrtCs("vole")).toBe(true);
    for (const w of ["sekanou", "kolonii", "sklenku", "datovkou"]) expect(gesperrtCs(w), w).toBe(false);
  });
});

/**
 * Wörter dieser Charge, die NICHT in `WORDS_CS`, `STUFE_VOCAB_CS` oder `NACHTRAG_CS` (Tatoeba-Formen mit mindestens zwei
 * Belegen) stehen - mit Begründung, weil es für Tschechisch kein Wörterbuch gibt, das sie bestätigen könnte (Falle 61).
 * Alle sind gewöhnliche Wörter bzw. regelmässige Formen [G: eigenes Sprachwissen]; sie gehören in die Lese-Abnahme durch
 * eine Person mit Tschechisch als Erstsprache (Prüfbericht P7). Über den Korpus kommen sie ins Vorlese-Lexikon.
 */
const OHNE_TATOEBA_BELEG: Readonly<Record<string, string>> = {
  důl: "Bergwerk (m.), Nom. Sg. - wie CS-T1 (důl a sklad: zwei Arbeitsorte, Ostrava)",
  leskl: "l-Partizip m. Sg. von lesknout se (lak se leskl: der Lack glänzte) - 3. Person, ein Ding",
  sedadel: "Gen. Pl. von sedadlo (sedm sedadel: Siebensitzer, Familienauto)",
  odeslali: "l-Partizip Pl. von odeslat (mail jsme odeslali)",
  nedojel: "l-Partizip m. Sg., verneint, von dojet (kamion nedojel: der Lastwagen kam nicht an)",
  kil: "Gen. Pl. von kilo (sedm kil dolů: sieben Kilo abgenommen)",
  klesl: "l-Partizip m. Sg. von klesnout (tlak klesl: der Blutdruck sank)",
  otekl: "l-Partizip m. Sg. von otéct (loket otekl: der Ellbogen schwoll an)",
  nafta: "Diesel (f.), Nom. Sg.",
  nesolit: "Infinitiv, verneint, von solit (nesolit a nesladit: Anweisung der Ärztin/des Arztes)",
  nesladit: "Infinitiv, verneint, von sladit (süssen)",
  mast: "Salbe (f.), Nom. Sg.",
  doklad: "Beleg, Ausweis (m.), Nom./Akk. Sg.",
  kotel: "Heizkessel (m.), Nom. Sg.",
  dodejte: "Imperativ Pl./Höflichkeitsform von dodat (einreichen, nachreichen)",
  kolektiv: "Team, Belegschaft (m.), Nom. Sg.",
  malovali: "l-Partizip Pl. von malovat (Wände streichen)",
  domek: "Häuschen (m.), Nom. Sg. - wie CS-T1",
  kolonii: "Lok. Sg. von kolonie (domek v kolonii: Arbeiterkolonie)",
  kalamita: "Kalamität (f.), Nom. Sg. - hier der Borkenkäfer im Wald",
  sleva: "Rabatt (f.), Nom. Sg.",
  nastavit: "Infinitiv von nastavit (einrichten)",
  inkaso: "Lastschrift (n.), Nom./Akk. Sg.",
  konta: "Gen. Sg. von konto (stav konta: Kontostand)",
  koloně: "Lok. Sg. von kolona (v koloně: im Stau)",
  směna: "Schicht (f.), Nom. Sg.",
  dolovalo: "l-Partizip n. Sg. von dolovat (kolem města se dolovalo: man baute Kohle ab), unpersönlich",
  esemesku: "Akk. Sg. von esemeska (SMS, gebräuchliches Wort)",
  datovkou: "Instr. Sg. von datovka (hovorové für datová schránka, die staatliche Datenbox)",
  jesle: "Kinderkrippe (f. Pl. tantum), Nom.",
  jelita: "Nom. Pl. von jelito (Blutwurst, Schlachtfest)",
  mandloně: "Nom. Pl. von mandloň (Mandelbaum, Hustopeče)",
  smetana: "Sahne (f.), Nom. Sg.",
  sekanou: "Akk. Sg. von sekaná (Hackbraten, Kantinenessen)",
  fitko: "Fitnessstudio (n., hovorové), Nom. Sg.",
  domluvili: "l-Partizip Pl. von domluvit se (sich einigen)",
  odstavili: "l-Partizip Pl. von odstavit (odstavili vodu: das Wasser wurde abgestellt, „odstávka vody“), unbestimmtes „sie“",
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
 * Die Diakritik-Falle (CS-T1, texte-quellen.md §3.4): vor ⇧ fehlen `á í é ý š č ř ž`. Ein Wort, das nicht im kuratierten
 * Wortschatz steht, dessen Form MIT einem Haken oder Strich aber dort steht (`mam` ⇒ `mám`), ist fast sicher die
 * verstümmelte Form.
 */
function diakritikVerdacht(zeilen: string[]): string[] {
  const out: string[] = [];
  for (const w of new Set(zeilen.flatMap((z) => z.split(" ")))) {
    if (KURATIERT.has(w)) continue;
    let formen = [""];
    for (const ch of w) formen = formen.flatMap((f) => [ch, ...(AKZENT_VARIANTEN[ch] ?? [])].map((x) => f + x));
    const treffer = formen.filter((v) => v !== w && KURATIERT.has(v));
    if (treffer.length > 0) out.push(`${w} (gemeint ${treffer.join("/")}?)`);
  }
  return out;
}

describe("CS-T3: Belege, Stimme, Diakritik", () => {
  it("jedes Wort stand schon im Wortschatz oder in den Tatoeba-Formen - oder steht begründet in OHNE_TATOEBA_BELEG", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Liste trägt nur, was wirklich gebraucht wird und nicht schon bekannt ist (sonst wächst sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => z.split(" ")));
    expect(Object.keys(OHNE_TATOEBA_BELEG).filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und eine falsche Endung werden gemeldet", () => {
    expect(ungeprueft(["kotel nejedex", "dva kotelové"])).toEqual(["nejedex", "kotelové"]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58)", () => {
    const buchstabiert = ZEILEN.filter((z) => z.split(" ").some((w) => w.length >= 2 && !isRealWord(w, "cs")));
    expect(buchstabiert).toEqual([]);
  });

  it("kein Wort ohne den Haken oder Strich, den es braucht (Diakritik-Falle)", () => {
    expect(diakritikVerdacht(ZEILEN)).toEqual([]);
  });

  it("Gegenprobe: „mam“, „muze“, „stene“ und „dolu“ werden gemeldet, „dal“ und „klid“ nicht", () => {
    expect(diakritikVerdacht(["mam muze"]).map((f) => f.split(" ")[0])).toEqual(["mam", "muze"]);
    expect(diakritikVerdacht(["na stěně"]).length).toBeGreaterThan(0);
    expect(diakritikVerdacht(["u dolu"]).length).toBeGreaterThan(0);
    expect(diakritikVerdacht(["dal klid"])).toEqual([]);
  });
});

// ── Keine Kopien, keine Paare, nichts fast gleich ─────────────────────────────

/** Geschlecht und Zahl gleichgesetzt (wie CS-T1/T2): „dal sůl"/„dala sůl", „on jde"/„ona jde" sind ein Paar. */
function paarForm(zeile: string): string {
  const pron: Record<string, string> = { on: "PRO", ona: "PRO", ono: "PRO", oni: "PRO", ony: "PRO" };
  return zeile
    .split(" ")
    .map((w) => pron[w] ?? w.replace(/(ou|em|ům|ech|[aeiouyáéíýěů])$/u, ""))
    .join(" ");
}

function paare(zeilen: string[], fremde: string[] = []): string[] {
  const gesehen = new Map<string, string>(fremde.map((z) => [paarForm(z), z]));
  const out: string[] = [];
  for (const z of zeilen) {
    const f = paarForm(z);
    const frueher = gesehen.get(f);
    if (frueher !== undefined) out.push(`"${frueher}" / "${z}"`);
    else gesehen.set(f, z);
  }
  return out;
}

const ohneZeichen = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
const wortMenge = (t: string) => new Set(ohneZeichen(t).split(" ").filter(Boolean));
function jaccard(a: Set<string>, b: Set<string>): number {
  let s = 0;
  for (const x of a) if (b.has(x)) s++;
  return s / (a.size + b.size - s);
}

/** Innerhalb der Charge: „fast gleich" schon ab der Hälfte der Wörter (wie PL-T3, CS-T2). */
function fastGleichEigen(zeilen: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < zeilen.length; i++) {
    for (let j = i + 1; j < zeilen.length; j++) {
      if (jaccard(wortMenge(zeilen[i]), wortMenge(zeilen[j])) >= 0.5) out.push(`"${zeilen[i]}" ~ "${zeilen[j]}"`);
    }
  }
  return out;
}

/**
 * Gegen CS-T1 und CS-T2 gelesen: KEINE Zeile teilt mit einer anderen cs-Zeile die Hälfte der Wörter (Jaccard 0,5 bis unter
 * 0,6). Beim Schreiben ersetzt: „na mostě je led" (0,5 zu T1 „je led") ⇒ „led na mostě". Eine NEUE solche Nähe muss hier
 * eingetragen werden - dann ist sie gelesen. (Der CS-T2-Wächter prüft dieselbe Nähe für SEINE Zeilen gegen diese Charge.)
 */
const NAH_AN_ANDEREN_CS: Readonly<Record<string, string>> = {};

const BANKEN = import.meta.glob("../src/lib/typing/schreibproben/texte*.ts", { eager: true }) as Record<
  string,
  Record<string, unknown>
>;
function bankZeilen(): string[] {
  const out: string[] = [];
  for (const modul of Object.values(BANKEN)) {
    for (const wert of Object.values(modul)) {
      if (!Array.isArray(wert)) continue;
      for (const t of wert) {
        const zeilen = (t as { zeilen?: unknown }).zeilen;
        if (Array.isArray(zeilen)) for (const z of zeilen) if (typeof z === "string") out.push(z);
      }
    }
  }
  return out;
}
const FREMDE_KORPORA = () => [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR];
/** Alles, was sonst Text trägt: alle Korpora (cs ROH), alle Serien aller Sprachen, alle Prüfungstext-Banken - Zeile UND Satz. */
function alleFremdenZeilen(): string[] {
  const roh = [
    ...FREMDE_KORPORA().map((i) => i.text),
    ...ANDERE_CS_ZEILEN(),
    ...SERIEN.flatMap((s) => s.etappen.flatMap((e) => e.lines)),
    ...bankZeilen(),
  ];
  return [...new Set(roh.flatMap((z) => [z, ...z.split(/(?<=[.!?])\s+/u)]))];
}

describe("CS-T3: keine Kopien, keine Paare, nichts fast gleich", () => {
  it("die Vergleichsmenge ist voll (rohe cs-Liste mit T1 und T2, Serien und Banken geladen)", () => {
    expect(ANDERE_CS().length).toBeGreaterThanOrEqual(CORPUS_CS_WEG_FRUEH_KIDS.length + CORPUS_CS_WEG_FRUEH_TEENS.length);
    expect(ANDERE_CS_ZEILEN()).toEqual(expect.arrayContaining([...KINDERZEILEN, ...JUGENDZEILEN]));
    expect(bankZeilen().length).toBeGreaterThan(1000);
    expect(SERIEN.length).toBeGreaterThan(100);
    for (const k of [CORPUS_IT, CORPUS_PL, CORPUS_TR]) expect(k.length).toBeGreaterThan(0);
  });

  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der Háček und Čárka nicht kennt)", () => {
    expect(new Set(ZEILEN).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer fremden Zeile, einer anderen cs-Zeile oder einem Satz (ohne Satzzeichen, klein) - auch nicht im Ledger-Schlüssel", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneZeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    expect(ZEILEN.filter((t) => texte.has(ohneZeichen(t)) || schluessel.has(bausteinKey("satz", t)))).toEqual([]);
  });

  it("Gegenprobe: eine T1- und eine T2-Zeile, eine Fassung mit Akzentfehler (gleicher Schlüssel), eine Serienzeile und ein Banken-Satz werden erkannt", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneZeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    expect(texte.has(ohneZeichen(KINDERZEILEN[0]))).toBe(true);
    expect(texte.has(ohneZeichen(JUGENDZEILEN[0]))).toBe(true);
    // „dal sůl" (T1) und „dal sál" haben denselben Schlüssel (ů und á werden Trenner) - mergeCorpus verschmölze sie still.
    expect(texte.has(ohneZeichen("dal sál"))).toBe(false);
    expect(schluessel.has(bausteinKey("satz", "dal sál"))).toBe(true);
    expect(texte.has(ohneZeichen(SERIEN[0].etappen[0].lines[0]))).toBe(true);
    expect(texte.has(ohneZeichen(bankZeilen()[0].split(/(?<=[.!?])\s+/u)[0]))).toBe(true);
  });

  it("keine Paare in der Charge und keines mit einer anderen cs-Zeile (nur Geschlecht oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN, ANDERE_CS_ZEILEN());
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: nafta klesla/klesl, on/ona und eine T2-Zeile mit getauschtem Geschlecht werden als Paar erkannt", () => {
    expect(paare(["nafta klesla", "nafta klesl"])).toHaveLength(1);
    expect(paare(["on jde domů", "ona jde domů"])).toHaveLength(1);
    expect(paare(["volal mamka"], JUGENDZEILEN)).toHaveLength(1);
    expect(paare(["tlak klesl"], [...KINDERZEILEN, ...JUGENDZEILEN])).toEqual([]);
  });

  it("innerhalb der Charge nichts fast gleich (die Hälfte der Wörter geteilt)", () => {
    const fehler = fastGleichEigen(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("nichts fast gleich gegen fremde Zeilen und andere cs-Zeilen (Wortmenge, Jaccard ≥ 0,6)", () => {
    const fremd = alleFremdenZeilen().map((t) => [t, wortMenge(t)] as const);
    const fehler: string[] = [];
    for (const z of ZEILEN) {
      const m = wortMenge(z);
      for (const [t, f] of fremd) if (jaccard(m, f) >= 0.6) fehler.push(`"${z}" ~ "${t}"`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die Nähe zu anderen cs-Zeilen (Jaccard 0,5 bis unter 0,6) ist genau die gelesene Liste", () => {
    const nah: Record<string, string> = {};
    for (const z of ZEILEN) {
      for (const t of ANDERE_CS_ZEILEN()) {
        const j = jaccard(wortMenge(z), wortMenge(t));
        if (j >= 0.5 && j < 0.6) nah[z] = t;
      }
    }
    expect(nah).toEqual(NAH_AN_ANDEREN_CS);
  });

  it("Gegenprobe: „na mostě je led“ neben „je led“ (T1) ist nah, „sejdeme se v osm“ neben „sejdeme se“ (T1) fast gleich", () => {
    expect(jaccard(wortMenge("na mostě je led"), wortMenge("je led"))).toBe(0.5);
    expect(jaccard(wortMenge("led na mostě"), wortMenge("je led"))).toBeLessThan(0.5);
    expect(jaccard(wortMenge("sejdeme se v osm"), wortMenge("sejdeme se"))).toBe(0.5);
    expect(jaccard(wortMenge("jen jeden den"), wortMenge("jeden den"))).toBeGreaterThanOrEqual(0.6);
    expect(fastGleichEigen(["tlak klesl", "tlak klesl dnes"])).toHaveLength(1);
  });
});

// ── Anker und Auslieferung ────────────────────────────────────────────────

describe("CS-T3: Korpus-Anker und Auslieferung", () => {
  it("die rohe Sammelliste trägt die Charge als Block HINTER CS-T2, die geladene und korpusFuer(\"cs\") jede Zeile", () => {
    const ab = CS_ROH.indexOf(CHARGE[0]);
    expect(ab).toBeGreaterThan(CS_ROH.indexOf(CORPUS_CS_WEG_FRUEH_TEENS[CORPUS_CS_WEG_FRUEH_TEENS.length - 1]));
    expect(CS_ROH.slice(ab, ab + CHARGE.length)).toEqual(CHARGE);
    const geladen = new Set(CS_GELADEN.map((i) => i.text));
    const fuer = new Set(korpusFuer("cs").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t) || !fuer.has(t))).toEqual([]);
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker (keine stille Verschmelzung mit einer Zeile irgendeines Korpus)", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_CS()].map((i) => bausteinId(i.kind, i.text)));
    expect(CHARGE.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    expect(new Set(CHARGE.map((i) => bausteinId(i.kind, i.text))).size).toBe(CHARGE.length);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CHARGE.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr), eine Kopie einer T2-Zeile nicht", () => {
    const alle = [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CS_GELADEN];
    const probe = { text: "zzz probe cs t3", kind: "satz" as const, stufen: ["erwachsen" as const] };
    expect(manifestFor([...alle, probe]).ids.length).toBe(KORPUS_ANKER.length + 1);
    const kopie = { text: JUGENDZEILEN[0], kind: "satz" as const, stufen: ["erwachsen" as const], nurWeg: "cs" as const };
    expect(manifestFor([...alle, kopie]).ids.length).toBe(KORPUS_ANKER.length);
  });

  for (const l of TASTATUREN) {
    it(`${l}: Weg „cs“ bekommt Erwachsenen vor ⇧ (D-2, umschalt: false) alle Zeilen dieser Charge - nur eigene, nur Kleinschrift`, () => {
      setLayout(l);
      const o = introOrder("cs");
      const allowed = allowedFromIntroduced(o.slice(0, GEBAUT_BIS), "cs");
      const geliefert = corpusItemsFor({ stufe: "erwachsen", allowed, lang: "cs", lernweg: "cs", umschalt: false });
      expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
      // Spätere ⇧-Chargen (T6) dürfen über die Kleinschrift schon vor ⇧ ankommen - aber nur Erwachsenenzeilen des Weges.
      const eigeneErwachsene = new Set(
        CS_ROH.filter((i) => i.nurWeg === "cs" && i.stufen.includes("erwachsen")).flatMap((i) => [
          i.text,
          fitText(i.text, allowed, "cs") ?? i.text,
        ]),
      );
      expect(geliefert.filter((t) => !eigeneErwachsene.has(t))).toEqual([]);
      expect(geliefert.filter(hatGrossbuchstaben)).toEqual([]);
      expect(geliefert.filter((t) => KINDERZEILEN.includes(t) || JUGENDZEILEN.includes(t))).toEqual([]);
    });
  }

  it("Kinder und Jugendliche bekommen keine Erwachsenenzeile; Weg „de“ und Weg „it“ bekommen keine dieser Zeilen", () => {
    setLayout("cs");
    const o = introOrder("cs");
    const allowed = allowedFromIntroduced(o.slice(0, GEBAUT_BIS), "cs");
    for (const stufe of ["kids", "teens"] as const) {
      const geliefert = corpusItemsFor({ stufe, allowed, lang: "cs", lernweg: "cs" });
      expect(geliefert.length, stufe).toBeGreaterThan(0);
      expect(ZEILEN.filter((t) => geliefert.includes(t)), stufe).toEqual([]);
    }
    setLayout("de");
    const deO = introOrder("de");
    const de = corpusItemsFor({ stufe: "erwachsen", allowed: allowedFromIntroduced(deO, "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const itO = introOrder("it");
    const it_ = corpusItemsFor({ stufe: "erwachsen", allowed: allowedFromIntroduced(itO, "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
