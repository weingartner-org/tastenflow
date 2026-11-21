/**
 * ★★★ Wächter CS-T2 (03.10.2026): die frühen cs-Texte für Jugendliche
 * (`corpusCsWegFruehTeens.ts`, Sprossen 7-17 - bis zur Sprosse vor ⇧ - auf `cs`
 * UND `cs-qwerty`). Vorbild: `tastenflow-texte-cs-kids-frueh.test.ts` (CS-T1) und
 * `tastenflow-texte-pl-erwachsene-frueh.test.ts` (PL-T3: rohe Sammelliste, „fast gleich",
 * Prüfungsbanken); Befund `BEFUND-2026-10-02-CS-T2-TEENS-FRUEH.md`, Leitfaden Fallen
 * 26/31/37/45/48/58/61/92-100.
 *
 * Die Sprosse einer Zeile wird hier AUSGERECHNET (kleinstes n, ab dem `fitText`
 * sie mit `introOrder("cs").slice(0, n)` durchlässt) - auf BEIDEN Pflicht-
 * Tastaturen, nie aus einem Kommentar geglaubt.
 *
 * ★ Lehre aus PL-T2/PL-T3: Kopien, Paare und „fast gleich" werden gegen die ROHE
 * Sammelliste aus `corpusCs.ts` geprüft (Objekte, ohne diese Charge), NICHT gegen die
 * geladene Liste aus `corpus.ts` - dort ist eine wortgleiche Kopie (auch eine, die sich
 * nur in Háček/Čárka unterscheidet, `bausteinKey`) schon still mit dem Original
 * verschmolzen. Und: jede Zeile bringt eine EIGENE ID in den Anker.
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
import { allowedFromIntroduced, SERIEN } from "../src/lib/typing/serien";
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
const CHARGE = CORPUS_CS_WEG_FRUEH_TEENS;
const ZEILEN = CHARGE.map((i) => i.text);
/** Alle ANDEREN cs-Zeilen (T1 und jede spätere Charge), aus der ROHEN Sammelliste - nicht aus der geladenen. */
const ANDERE_CS = () => CS_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_CS_ZEILEN = (): string[] => ANDERE_CS().map((i) => i.text);
const KINDERZEILEN = CORPUS_CS_WEG_FRUEH_KIDS.map((i) => i.text);
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

describe("CS-T2: jede Zeile an ihrer Sprosse (cs und cs-qwerty)", () => {
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

  it("Gegenprobe: ů an 8, ě an 16, u an 17; hra, kapela, škola, sport, hokej, mám (nach ⇧) passen vor ⇧ nie", () => {
    for (const l of TASTATUREN) {
      expect(sprosseAuf("sklad kajaků", l), l).toBe(8);
      expect(sprosseAuf("dej vědět", l), l).toBe(16);
      expect(sprosseAuf("miluju metal", l), l).toBe(17);
      for (const t of ["hra", "kapela", "škola", "sport", "hokej", "mám", "jsi skvělý"]) {
        expect(sprosseAuf(t, l), `${l}: ${t}`).toBeNull();
      }
    }
  });

  /**
   * GEMESSEN am Ende von CS-T2 (vom Code gezählt, nicht geschätzt) - jede Grenze darf künftig nur STEIGEN. Unter 6
   * liegt sie, wo die Buchstaben nicht mehr hergeben (Befund §2): an 7-11 fehlen den Jugendlichen die Wörter.
   */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    7: 1, 8: 1, 9: 2, 10: 2, 11: 3, 12: 6, 13: 8, 14: 8, 15: 8, 16: 10, 17: 26,
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

describe("CS-T2: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
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

    it(`${l}: jede Einheit von a bis zur letzten vor ⇧ hat an ihrer Sprosse mindestens eine Jugendzeile (W6)`, () => {
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
    expect(ohneNeueEinheit([{ text: "ale jak", sprosse: 10 }], "cs")).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "ale jak", sprosse: 9 }], "cs")).toEqual([]);
    expect(ohneNeueEinheit([{ text: "dej vědět", sprosse: 16 }], "cs-qwerty")).toEqual([]);
  });
});

// ── Form: klein, nur gelernte Zeichen, keine Satzzeichen, Hausregeln ─────────

/** Vor ⇧: nur die 17 Buchstaben der Folge (aus dem Code, nicht abgeschrieben) und einfache Leerzeichen. */
function formFehler(t: string): boolean {
  setLayout("cs");
  const erlaubt = new Set(introOrder("cs").slice(0, GEBAUT_BIS));
  return [...t].some((c) => c !== " " && !erlaubt.has(c)) || t !== t.trim() || t.includes("  ") || t.length === 0;
}

describe("CS-T2: vor ⇧ nur Kleinbuchstaben, keine Satzzeichen, Regeln des Weges", () => {
  it("jede Zeile besteht nur aus Buchstaben der Folge bis u und einfachen Leerzeichen (klein, ohne Satzzeichen)", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Grossbuchstabe, Punkt, á, y, Fragezeichen und doppeltes Leerzeichen werden gefunden", () => {
    for (const t of ["Jsi fajn", "jsi fajn.", "máme volno", "vlaky", "jsi online?", "jsi  fajn", "Ůl"]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("miluju metal")).toBe(false);
  });

  it("jede Zeile besteht die Regeln aller tschechischen Zeilen (`helfer/csTextRegeln.ts`, mit fruehSprossen)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z, { fruehSprossen: true }).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [teens], nurWeg cs, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["teens"]);
      expect(item.nurWeg, item.text).toBe("cs");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Geschlecht (Glossar §1 Regel 2, §4 Falle 8): nie eine Vergangenheit oder ein hartes Adjektiv für „du" ──

const GEGENDERTES_DU = /(^|\s)\p{L}+(l|la|li|ly) jsi(\s|$)|(^|\s)jsi (\p{L}+(l|la|li|ly|ý|á)|sám|sama)(\s|$)/u;
/** „ich bin" mit hartem Adjektiv oder l-Partizip legt das Geschlecht der tippenden Person fest. */
const GEGENDERTES_ICH = /(^|\s)\p{L}+(l|la) jsem(\s|$)|(^|\s)jsem (\p{L}+(l|la|ý|á)|sám|sama)(\s|$)/u;

describe("CS-T2: keine Zeile legt das Geschlecht des Kindes oder der tippenden Person fest", () => {
  it("kein gegendertes „du“ und kein gegendertes „ich“", () => {
    expect(ZEILEN.filter((z) => GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z))).toEqual([]);
  });

  it("Gegenprobe: „udělal jsi to“, „jsi sama“, „usnul jsem“, „jsem unavená“ werden gefunden; „jsi fajn“, „jsem mimo“, „jsem online“ nicht", () => {
    for (const z of ["udělal jsi to", "jsi sama", "jsi připravený"]) expect(GEGENDERTES_DU.test(z), z).toBe(true);
    for (const z of ["usnul jsem", "jsem unavená", "jsem sám"]) expect(GEGENDERTES_ICH.test(z), z).toBe(true);
    for (const z of ["jsi fajn", "jsem mimo", "jsem online", "usnuli jsme u filmu"]) {
      expect(GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z), z).toBe(false);
    }
  });
});

// ── Wortschatz: Wortgrenze 8, Bewegungsverben, Sperrliste, Belegliste, Diakritik ─────────────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht (Liste wie CS-T1). */
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
 * CS-T1 §2/§4: die Bewegungsverben (*jet, jít*) und *les* trugen dort 23 von 128 Zeilen - vor ⇧ die bequemsten
 * Verben. Für die Jugend-Charge sparsam: Formen der drei Lemmata in höchstens {@link BEWEGUNG_GRENZE} Zeilen.
 */
const BEWEGUNG =
  /(^|\s)(ne)?(u|od|do|při|pře|vy|za|s)?(jet|jedu|jedeš|jede|jedeme|jedete|jedou|jel|jela|jeli|jely|jít|jdu|jdeš|jde|jdeme|jdete|jdou|jdi|jděte|šel|šla|šli|les|lesa|lese|lesem|lesy|lesů)(\s|$)/u;
const BEWEGUNG_GRENZE = 4;

describe("CS-T2: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge (Wortbudget Jugend, F45)", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet, ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `je fajn ${"abcdefghi"[i]}`);
    expect(zuHaeufig(neun)).toEqual(['"fajn": 9 Zeilen']);
  });

  it(`Bewegungsverben und „les“ sparsam: höchstens ${BEWEGUNG_GRENZE} Zeilen (CS-T1 §4)`, () => {
    const treffer = ZEILEN.filter((z) => BEWEGUNG.test(z));
    expect(treffer.length, treffer.join("\n")).toBeLessThanOrEqual(BEWEGUNG_GRENZE);
  });

  it("Gegenprobe: jedeme, jdeme, nejede, ujel, lesem werden erkannt; jedna, jednou, jelen, lesk nicht", () => {
    for (const z of ["jedeme vlakem", "jdeme ven", "vlak nejede", "vlak ujel", "jelen jde lesem"]) expect(BEWEGUNG.test(z), z).toBe(true);
    for (const z of ["jedna a jedna", "jednou letět", "jelen", "lesk"]) expect(BEWEGUNG.test(z), z).toBe(false);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis", () => {
    const fehler = ZEILEN.flatMap((t) => t.split(" ").filter((w) => gesperrtCs(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurva (Kern), slepý und vole (Wortbasis) werden gefunden, sekundu, sokolovně und kanoistka nicht", () => {
    expect(istKernGesperrtCs("kurva")).toBe(true);
    expect(gesperrtCs("slepý")).toBe(true);
    expect(gesperrtCs("vole")).toBe(true);
    // „sekunda" traf früher der Stamm `kund` (Falle 93) - hier steht „o sekundu".
    for (const w of ["sekundu", "sokolovně", "kanoistka"]) expect(gesperrtCs(w), w).toBe(false);
  });
});

/**
 * Wörter dieser Charge, die NICHT in `WORDS_CS`, `STUFE_VOCAB_CS` oder `NACHTRAG_CS` (Tatoeba-Formen mit mindestens zwei
 * Belegen) stehen - mit Begründung, weil es für Tschechisch kein Wörterbuch gibt, das sie bestätigen könnte (Falle 61).
 * Alle sind gewöhnliche Wörter bzw. regelmässige Formen [G: eigenes Sprachwissen]; sie gehören in die Lese-Abnahme durch
 * eine Person mit Tschechisch als Erstsprache (Prüfbericht P7). Über den Korpus kommen sie ins Vorlese-Lexikon.
 */
const OHNE_TATOEBA_BELEG: Readonly<Record<string, string>> = {
  salsa: "Salsa (f.), der Tanz (Tanzkurs) - an Sprosse 7 das einzige Jugendwort aus f j d k s l a",
  kajaků: "Gen. Pl. von kajak (sklad kajaků: das Bootslager eines Verleihs am Fluss) - wie CS-T1",
  kajak: "Kajak (m.), Nom. - wie CS-T1",
  kafem: "Instr. Sg. von kafe (sem s kafem, nach der Redewendung „sem s tím“)",
  kanoe: "Kanadier (f., unveränderlich) - Kanu-Slalom",
  slalom: "Slalom (m.), Nom. - Kanu-Slalom",
  melodie: "Melodie (f.), Nom. Sg.",
  malinovka: "Himbeerlimonade (f.)",
  ledem: "Instr. Sg. von led (s ledem)",
  kometa: "Komet (f.), Nom.",
  sokolovně: "Lok. Sg. von sokolovna (Turnhalle des Sokol)",
  disko: "Disco (n., unveränderlich; hovorové für diskotéka) - Zweifelsfall im Befund",
  kanoistka: "Kanutin (f.), Nom.",
  sekundu: "Akk. Sg. von sekunda (o sekundu)",
  vedeme: "1. Pl. Präsens von vést (vedeme dva nula: Spielstand)",
  metal: "Metal (m.), die Musikrichtung",
  detektivka: "Krimi (f.), das Buch",
  festivalu: "Lok. Sg. von festival (na festivalu)",
  stanujeme: "1. Pl. Präsens von stanovat (zelten)",
  foukali: "l-Partizip Pl. von foukat (foukat sklo: Glas blasen)",
  skauti: "Nom. Pl. von skaut (Pfadfinder, Junák) - Gruppe, kein Personenwort für das Kind",
  kosmu: "Gen. Sg. von kosmos (do kosmu)",
  nanuk: "Eis am Stiel (m.), Nom.",
  stadionu: "Lok. Sg. von stadion (na stadionu)",
  sledujeme: "1. Pl. Präsens von sledovat (anschauen, verfolgen)",
  kliku: "Akk. Sg. von klika (mít kliku: Glück haben)",
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
 * verstümmelte Form. (Beim Schreiben von CS-T2 gefunden und umformuliert: `stěně` neben `štěně`, `u dolu` neben `dolů` -
 * beide richtig, aber für die Lesenden zweideutig; die Zeilen stehen nicht mehr da.)
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

describe("CS-T2: Belege, Stimme, Diakritik", () => {
  it("jedes Wort stand schon im Wortschatz oder in den Tatoeba-Formen - oder steht begründet in OHNE_TATOEBA_BELEG", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Liste trägt nur, was wirklich gebraucht wird und nicht schon bekannt ist (sonst wächst sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => z.split(" ")));
    expect(Object.keys(OHNE_TATOEBA_BELEG).filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und eine falsche Endung werden gemeldet", () => {
    expect(ungeprueft(["jsi fajnx", "dva skautové"])).toEqual(["fajnx", "skautové"]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58)", () => {
    const buchstabiert = ZEILEN.filter((z) => z.split(" ").some((w) => w.length >= 2 && !isRealWord(w, "cs")));
    expect(buchstabiert).toEqual([]);
  });

  it("kein Wort ohne den Haken oder Strich, den es braucht (Diakritik-Falle)", () => {
    expect(diakritikVerdacht(ZEILEN)).toEqual([]);
  });

  it("Gegenprobe: „mam“, „muze“, „stene“ und „dolu“ werden gemeldet, „dal“ und „fajn“ nicht", () => {
    expect(diakritikVerdacht(["mam muze"]).map((f) => f.split(" ")[0])).toEqual(["mam", "muze"]);
    expect(diakritikVerdacht(["na stěně"]).length).toBeGreaterThan(0);
    expect(diakritikVerdacht(["u dolu"]).length).toBeGreaterThan(0);
    expect(diakritikVerdacht(["dal fajn"])).toEqual([]);
  });
});

// ── Keine Kopien, keine Paare, nichts fast gleich ─────────────────────────────

/** Geschlecht und Zahl gleichgesetzt (wie CS-T1): „dal sůl"/„dala sůl", „on jde"/„ona jde" sind ein Paar. */
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

/** Innerhalb der Charge: „fast gleich" schon ab der Hälfte der Wörter (wie PL-T3). */
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
 * Gegen CS-T1 gelesen: drei Zeilen teilen mit einer T1-Zeile genau die Hälfte der Wörter (Jaccard 0,5, unter der Grenze
 * 0,6) - alle drei, weil die T1-Zeile ein EINZELWORT ist bzw. dieselbe Hülle „je" trägt. Gelesen, verschiedener Sinn,
 * stehen gelassen (Befund §4a). Eine NEUE solche Nähe muss hier eingetragen werden - dann ist sie gelesen.
 */
const NAH_AN_ANDEREN_CS: Readonly<Record<string, string>> = {
  "sklad kajaků": "sklad",
  "můj kajak": "kajak",
  "test je online": "dnes je test",
};

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

describe("CS-T2: keine Kopien, keine Paare, nichts fast gleich", () => {
  it("die Vergleichsmenge ist voll (rohe cs-Liste mit T1, Serien und Banken geladen)", () => {
    expect(ANDERE_CS().length).toBeGreaterThanOrEqual(CORPUS_CS_WEG_FRUEH_KIDS.length);
    expect(ANDERE_CS_ZEILEN()).toEqual(expect.arrayContaining(KINDERZEILEN));
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

  it("Gegenprobe: eine T1-Zeile, ihre Fassung mit Akzentfehler (gleicher Schlüssel), eine Serienzeile und ein Banken-Satz werden erkannt", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneZeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    expect(texte.has(ohneZeichen(KINDERZEILEN[0]))).toBe(true);
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

  it("Gegenprobe: dal/dala, on/ona und eine T1-Zeile mit getauschtem Geschlecht werden als Paar erkannt", () => {
    expect(paare(["dal sůl", "dala sůl"])).toHaveLength(1);
    expect(paare(["on jde domů", "ona jde domů"])).toHaveLength(1);
    expect(paare(["jedla med"], KINDERZEILEN)).toHaveLength(1);
    expect(paare(["vlak ujel"], KINDERZEILEN)).toEqual([]);
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

  it("Gegenprobe: „dnes je volno“ neben „dnes je test“ (T1) ist nah, „sejdeme se venku“ neben „sejdeme se“ (T1) fast gleich", () => {
    expect(jaccard(wortMenge("dnes je volno"), wortMenge("dnes je test"))).toBe(0.5);
    expect(jaccard(wortMenge("jsme doma"), wortMenge("jsem doma"))).toBeLessThan(0.5);
    expect(jaccard(wortMenge("sejdeme se venku"), wortMenge("sejdeme se"))).toBeGreaterThanOrEqual(0.6);
    expect(fastGleichEigen(["esej a kafe", "klid a kafe"])).toHaveLength(1);
  });
});

// ── Anker und Auslieferung ────────────────────────────────────────────────

describe("CS-T2: Korpus-Anker und Auslieferung", () => {
  it("die rohe Sammelliste trägt die Charge als Block HINTER CS-T1, die geladene und korpusFuer(\"cs\") jede Zeile", () => {
    const ab = CS_ROH.indexOf(CHARGE[0]);
    expect(ab).toBeGreaterThan(CS_ROH.indexOf(CORPUS_CS_WEG_FRUEH_KIDS[CORPUS_CS_WEG_FRUEH_KIDS.length - 1]));
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

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr), eine Kopie einer T1-Zeile nicht", () => {
    const alle = [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CS_GELADEN];
    const probe = { text: "zzz probe cs t2", kind: "satz" as const, stufen: ["teens" as const] };
    expect(manifestFor([...alle, probe]).ids.length).toBe(KORPUS_ANKER.length + 1);
    const kopie = { text: KINDERZEILEN[0], kind: "satz" as const, stufen: ["teens" as const], nurWeg: "cs" as const };
    expect(manifestFor([...alle, kopie]).ids.length).toBe(KORPUS_ANKER.length);
  });

  for (const l of TASTATUREN) {
    it(`${l}: Weg „cs“ bekommt Jugendlichen vor ⇧ alle Zeilen dieser Charge - nur eigene cs-Jugendzeilen, keine Kinderzeile`, () => {
      setLayout(l);
      const o = introOrder("cs");
      const allowed = allowedFromIntroduced(o.slice(0, GEBAUT_BIS), "cs");
      const geliefert = corpusItemsFor({ stufe: "teens", allowed, lang: "cs", lernweg: "cs" });
      expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
      // Spätere ⇧-Chargen (T5) kommen über die Auto-Grossschreibung schon vor ⇧ an - ohne ihre noch nicht gelernten
      // Satzzeichen (`fitText`). Eigen ist darum der Rohtext ODER seine servierte Fassung.
      const eigeneJugend = new Set(
        CS_ROH.filter((i) => i.nurWeg === "cs" && i.stufen.includes("teens")).flatMap((i) => [
          i.text,
          fitText(i.text, allowed, "cs") ?? i.text,
        ]),
      );
      expect(geliefert.filter((t) => !eigeneJugend.has(t))).toEqual([]);
      expect(geliefert.filter((t) => KINDERZEILEN.includes(t))).toEqual([]);
    });
  }

  it("Kinder bekommen keine Jugendzeile; Weg „de“ und Weg „it“ bekommen keine dieser Zeilen", () => {
    setLayout("cs");
    const o = introOrder("cs");
    const kinder = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(o.slice(0, GEBAUT_BIS), "cs"), lang: "cs", lernweg: "cs" });
    expect(ZEILEN.filter((t) => kinder.includes(t))).toEqual([]);
    setLayout("de");
    const deO = introOrder("de");
    const de = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(deO, "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const itO = introOrder("it");
    const it_ = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(itO, "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
