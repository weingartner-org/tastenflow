/**
 * ★★★ Wächter IT-T2 (03.10.2026): die frühen it-Texte für Jugendliche
 * (`corpusItWegFruehTeens.ts`, Sprossen 7-19 auf `it`, 7-18 auf `it-qzerty` -
 * bis zur Sprosse vor Maiusc). Aus dem Kinder-Wächter
 * `tastenflow-texte-it-kids-frueh.test.ts` kopiert und angepasst; Vorbild für
 * „Jugend früh": `tastenflow-texte-es-teens-frueh.test.ts`. Bauplan
 * `BAUPLAN-2026-10-02-ITALIENISCHER-LEHRGANG.md` §3, Leitfaden Fallen
 * 26/31/37/45/48/51/58/76.
 *
 * Die Sprosse einer Zeile wird hier AUSGERECHNET (kleinstes n, ab dem
 * `fitText` sie mit `introOrder("it").slice(0, n)` durchlässt) - auf BEIDEN
 * Pflicht-Tastaturen, nie aus einem Kommentar geglaubt (auf `it-qzerty` ist
 * `m` die achte Grundtaste, `ò` kommt erst nach `ì`). Dazu, anders als beim
 * Kinder-Wächter: keine Zeile gleich einer Zeile von IT-T1 (Kinder) oder -
 * seit dem Merge 03.10. - IT-T3 (Erwachsene), weder im Text noch im
 * Ledger-Schlüssel, und kein Paar mit ihnen (Falle 31, 51). Jede Regel
 * hat eine Gegenprobe: der Prüfer muss einen gebauten Fehler finden.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, korpusFuer, CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_IT } from "../src/lib/typing/corpusIt";
import { CORPUS_IT_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusItWegFruehKids";
import { CORPUS_IT_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusItWegFruehTeens";
import { CORPUS_IT_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusItWegFruehErwachsene";
import { allowedFromIntroduced } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { bausteinId, bausteinKey } from "../src/lib/typing/ledger";
import { corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";
import { gesperrtIt, istKernGesperrtIt } from "../src/lib/typing/sperrlisteIt";
import { WORDS_IT, STUFE_VOCAB_IT } from "../src/lib/typing/wordsIt";
import { NACHTRAG_IT } from "../src/lib/typing/lexikonNachtragIt";
import { isRealWord, normalizeWord } from "../src/lib/typing/lexicon";
import { zeilenFehler } from "./helfer/itTextRegeln";

afterEach(() => setLayout("de"));

const TASTATUREN: LayoutId[] = ["it", "it-qzerty"];
const ZEILEN = CORPUS_IT_WEG_FRUEH_TEENS.map((i) => i.text);
const KINDERZEILEN = CORPUS_IT_WEG_FRUEH_KIDS.map((i) => i.text);
/** IT-T3 (Erwachsene früh) - seit dem Merge 03.10. derselbe Vergleich wie mit den Kinderzeilen. */
const ERWACHSENENZEILEN = CORPUS_IT_WEG_FRUEH_ERWACHSENE.map((i) => i.text);
/** Die anderen frühen it-Chargen, gegen die Kopien, Schlüssel und Paare geprüft werden. */
const ANDERE_IT_ZEILEN = [...KINDERZEILEN, ...ERWACHSENENZEILEN];
/** Die erste Sprosse mit echten Wörtern: an 7 ist „a" der erste Vokal - davor nur Konsonanten der Grundreihe. */
const ERSTE_SPROSSE = 7;
/** Die Charge reicht je Tastatur bis zur Sprosse vor Maiusc (Wächter unten: = `letzteSprosse(l)`). */
const GEBAUT_BIS: Record<string, number> = { it: 19, "it-qzerty": 18 };

/** Die Sprosse direkt vor Maiusc - aus der Reihenfolge der Tastatur gerechnet, nicht gezählt. */
function letzteSprosse(layout: LayoutId): number {
  setLayout(layout);
  return introOrder("it").indexOf(SHIFT_UNIT);
}

/** Kleinste Sprosse, an der `fitText` den Text durchlässt (null: nie bis vor Maiusc). */
function sprosseAuf(text: string, layout: LayoutId, bisEnde = false): number | null {
  setLayout(layout);
  const o = introOrder("it");
  const bis = bisEnde ? o.length : o.indexOf(SHIFT_UNIT);
  for (let n = 1; n <= bis; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "it"), "it") !== null) return n;
  }
  return null;
}

describe("IT-T2: jede Zeile an ihrer Sprosse (it und it-qzerty)", () => {
  it("die Folge vor Maiusc: it 19 Einheiten (… a ò …), it-qzerty 18 (… a m …, ò erst nach ì)", () => {
    setLayout("it");
    expect(introOrder("it").slice(0, 19).join(" ")).toBe("f j d k s l a ò i e o n r t c u m v p");
    setLayout("it-qzerty");
    expect(introOrder("it").slice(0, 18).join(" ")).toBe("f j d k s l a m i e o n r t c u v p");
    for (const l of TASTATUREN) expect(letzteSprosse(l), l).toBe(GEBAUT_BIS[l]);
  });

  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile passt an einer Sprosse ${ERSTE_SPROSSE}-${GEBAUT_BIS[l]}, nicht früher, und minTier stimmt`, () => {
      const fehler: string[] = [];
      for (const item of CORPUS_IT_WEG_FRUEH_TEENS) {
        const s = sprosseAuf(item.text, l);
        // QZERTY: eine Zeile mit `ò` hat vor Maiusc keine Sprosse - das ist richtig (eigener Test unten).
        const qzertyOhneO = l === "it-qzerty" && item.text.includes("ò") && s === null;
        if (!qzertyOhneO && (s === null || s < ERSTE_SPROSSE || s > GEBAUT_BIS[l])) {
          fehler.push(`"${item.text}": Sprosse ${s}`);
        }
        const tier = minTierFor(item.text, "it");
        if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
      }
      expect(fehler, fehler.join("\n")).toEqual([]);
    });
  }

  it("it-qzerty: eine Zeile mit ò kommt erst nach Maiusc (nach ì) - aber sie kommt, sie ist dort nicht verloren", () => {
    setLayout("it-qzerty");
    const o = introOrder("it");
    const mitO = ZEILEN.filter((t) => t.includes("ò"));
    expect(mitO).toEqual(["dal falò alla sala", "lo farò io"]);
    for (const t of mitO) {
      expect(sprosseAuf(t, "it-qzerty"), t).toBeNull();
      const spaet = sprosseAuf(t, "it-qzerty", true);
      expect(spaet, t).not.toBeNull();
      expect(o[(spaet as number) - 1], t).toBe("ò");
      expect(o.indexOf("ò"), t).toBeGreaterThan(o.indexOf("ì"));
    }
  });

  it("die Sprossen der zwei Tastaturen hängen nur an m und ò (sonst gleich, ab v eine weniger)", () => {
    const fehler: string[] = [];
    for (const t of ZEILEN) {
      if (t.includes("ò") || t.includes("m")) continue;
      const si = sprosseAuf(t, "it") as number;
      const sq = sprosseAuf(t, "it-qzerty") as number;
      const soll = si >= 18 ? si - 1 : si; // auf it-qzerty fällt `m` vor `v` und `p` weg
      if (sq !== soll) fehler.push(`"${t}": it ${si}, it-qzerty ${sq}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: g/q/z (nach Maiusc) passen nie, m an 17 bzw. 8, ò an 8 bzw. nie, p an 19 bzw. 18", () => {
    // Beim Schreiben gefunden (Befund §2): „calcio a cinque" (q), „terza media" (z), „programmare" (g).
    expect(sprosseAuf("il calcio a cinque", "it")).toBeNull();
    expect(sprosseAuf("esame di terza media", "it")).toBeNull();
    expect(sprosseAuf("programmare un sito", "it-qzerty")).toBeNull();
    expect(sprosseAuf("ama la fama", "it")).toBe(17);
    expect(sprosseAuf("ama la fama", "it-qzerty")).toBe(8);
    expect(sprosseAuf("dal falò", "it")).toBe(8);
    expect(sprosseAuf("dal falò", "it-qzerty")).toBeNull();
    expect(sprosseAuf("a presto", "it")).toBe(19);
    expect(sprosseAuf("a presto", "it-qzerty")).toBe(18);
    // Ein Akzent, der noch nicht gelernt ist, und der Apostroph machen eine Zeile vor Maiusc unschreibbar.
    expect(sprosseAuf("la verifica è domani", "it")).toBeNull();
    expect(sprosseAuf("l'esame orale", "it")).toBeNull();
  });

  /**
   * GEMESSEN am Ende von IT-T2 (vom Code gezählt, nicht geschätzt) - jede
   * Grenze darf künftig nur STEIGEN. Wo sie unter 6 liegt, geben die
   * Buchstaben für Jugendliche nicht mehr her (Befund §2): an 7 nur der Vokal
   * „a", an 8 auf `it` die `ò` nur in „falò", an 9-10 nur a i e.
   */
  const MINDESTENS_JE_SPROSSE: Record<string, Record<number, number>> = {
    it: { 7: 2, 8: 1, 9: 4, 10: 3, 11: 6, 12: 8, 13: 10, 14: 12, 15: 12, 16: 15, 17: 23, 18: 17, 19: 32 },
    // Merge 03.10.: 15 von 17 auf 16, 16 von 26 auf 27 - „mi manca il mare" (T3) ⇒ „manca un minuto" (`u`).
    "it-qzerty": { 7: 2, 8: 2, 9: 5, 10: 3, 11: 7, 12: 8, 13: 10, 14: 14, 15: 16, 16: 27, 17: 17, 18: 32 },
  };

  for (const l of TASTATUREN) {
    it(`${l}: je Sprosse mindestens so viele Zeilen wie gemessen (gerechnete Sprosse)`, () => {
      const anzahl = new Map<number, number>();
      for (const t of ZEILEN) {
        const s = sprosseAuf(t, l);
        if (s !== null) anzahl.set(s, (anzahl.get(s) ?? 0) + 1);
      }
      const zuWenig: string[] = [];
      for (let n = ERSTE_SPROSSE; n <= GEBAUT_BIS[l]; n++) {
        const soll = MINDESTENS_JE_SPROSSE[l][n] ?? 6;
        if ((anzahl.get(n) ?? 0) < soll) zuWenig.push(`Sprosse ${n}: ${anzahl.get(n) ?? 0} < ${soll}`);
      }
      expect(zuWenig, zuWenig.join("\n")).toEqual([]);
    });
  }
});

describe("IT-T2: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
  /** Zeilen, deren Text die an ihrer Sprosse neue Einheit NICHT enthält. */
  function ohneNeueEinheit(zeilen: { text: string; sprosse: number }[], layout: LayoutId): string[] {
    setLayout(layout);
    const o = introOrder("it");
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

    it(`${l}: jede Einheit von a bis zur letzten vor Maiusc hat an ihrer Sprosse mindestens eine Zeile (W6)`, () => {
      setLayout(l);
      const o = introOrder("it");
      const fehlt: string[] = [];
      for (let n = ERSTE_SPROSSE; n <= GEBAUT_BIS[l]; n++) {
        const erlaubt = allowedFromIntroduced(o.slice(0, n), "it");
        const treffer = ZEILEN.filter((t) => fitText(t, erlaubt, "it") !== null && t.includes(o[n - 1]));
        if (treffer.length === 0) fehlt.push(`${n}:${o[n - 1]}`);
      }
      expect(fehlt, `${l}: Einheiten ohne Zeile`).toEqual([]);
    });
  }

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet", () => {
    expect(ohneNeueEinheit([{ text: "adesso lo so", sprosse: 12 }], "it")).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "adesso lo so", sprosse: 11 }], "it")).toEqual([]);
    expect(ohneNeueEinheit([{ text: "ama la fama", sprosse: 8 }], "it")).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "ama la fama", sprosse: 8 }], "it-qzerty")).toEqual([]);
  });
});

// ── Form: klein, nur gelernte Zeichen, keine Satzzeichen, Hausregeln ─────────

/** Vor Maiusc: Kleinbuchstaben der Folge (ò ist die einzige Akzenteinheit davor) und einfache Leerzeichen. */
const ERLAUBTE_ZEICHEN = /^[a-zò ]+$/;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) || t !== t.toLowerCase() || t !== t.trim() || t.includes("  ");

describe("IT-T2: vor Maiusc nur Kleinbuchstaben, keine Satzzeichen, Regeln des Weges", () => {
  it("jede Zeile ist klein geschrieben und besteht nur aus Buchstaben und einfachen Leerzeichen", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Grossbuchstabe, Punkt, è, Apostroph und doppeltes Leerzeichen werden gefunden", () => {
    for (const t of ["Sono online", "sono online.", "la verifica è domani", "l'esame", "sono  online"]) {
      expect(formFehler(t), t).toBe(true);
    }
  });

  it("jede Zeile besteht die Regeln aller italienischen Zeilen (`helfer/itTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [teens], nurWeg it, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_IT_WEG_FRUEH_TEENS) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["teens"]);
      expect(item.nurWeg, item.text).toBe("it");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Wortschatz: Wortgrenze 8, Sperrliste, Lexikon, Akzent ───────────────────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht. */
const FUNKTIONSWOERTER = new Set(
  (
    "il lo la i le un uno una di a da in con su per tra fra " +
    "del dello della dei delle al allo alla ai alle dal dallo dalla dai dalle " +
    "nel nello nella nei nelle sul sullo sulla sui sulle " +
    "e ed o ma se non si mi ti ci vi ne io tu lui lei noi voi loro " +
    "mio mia miei mie tuo tua suo sua sono sei siamo siete era erano " +
    "fa fai sta sto stai tutto tutta tutti tutte"
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
 * Wörter dieser Charge, die NICHT in `WORDS_IT`, `STUFE_VOCAB_IT` oder `NACHTRAG_IT` standen und die das
 * macOS-Wörterbuch für Italienisch bestätigt hat (`osascript -l JavaScript scripts/woerterbuch-macos.js`,
 * Vorsilbe `it:`, gemessen 03.10.2026; abgelehnt wurden `taranta`, `natel`, `interrail` - sie stehen in keiner
 * Zeile). Über den Korpus kommen sie ins Vorlese-Lexikon (lexicon.ts: Korpus-Wörter), die Stimme spricht sie ganz.
 */
const VOM_WOERTERBUCH_BESTAETIGT: ReadonlySet<string> = new Set([
  "arrendersi", "campestre", "cantautrice", "cartellino", "cassata", "climatica", "elettricista", "falò",
  "lavoretto", "pannelli", "portici", "riavvia", "romancio", "sarde", "sfidali", "sfila", "speck", "trullo",
  "vaporetto",
]);

/**
 * Wörter, die das macOS-Wörterbuch ABLEHNT (es kennt keine Form von „paralimpico", auch nicht „paraolimpico"),
 * die aber richtig sind - mit Beleg aus der Recherche (`recherche-italienisch-2026-10-02/texte-quellen.md` §4:
 * „Comitato Italiano Paralimpico", comitatoparalimpico.it; Avvenire „record per l'Italia paralimpica"). Bauplan §3
 * verlangt „Sport - auch Paralympics -". Befund §4a führt das als Zweifelsfall.
 */
const VON_HAND_BELEGT: ReadonlySet<string> = new Set(["paralimpico", "paralimpici"]);

const VORHER_BEKANNT: ReadonlySet<string> = new Set(
  [...WORDS_IT, ...Object.values(STUFE_VOCAB_IT).flat(), ...NACHTRAG_IT].map((w) => normalizeWord(w, "it")),
);

/** Wörter (ab zwei Buchstaben), die weder vorher im Wortschatz standen noch bestätigt oder belegt sind. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of z.split(" ")) {
      if (w.length >= 2 && !VORHER_BEKANNT.has(w) && !VOM_WOERTERBUCH_BESTAETIGT.has(w) && !VON_HAND_BELEGT.has(w)) {
        out.add(w);
      }
    }
  }
  return [...out];
}

/**
 * Wörter, die es NUR mit Akzent gibt (Bauplan I6, §5 Nr. 4): ihre Form ohne Akzent ist kein Wort und darf nie
 * in einer Zeile stehen (`ando` statt `andò`). Gebaut aus dem Wortschatz wie im Kinder-Wächter.
 */
const NUR_MIT_AKZENT: ReadonlySet<string> = new Set(
  [...VORHER_BEKANNT, ...VOM_WOERTERBUCH_BESTAETIGT]
    .filter((w) => /[àèéìòù]$/.test(w))
    .map((w) => w.normalize("NFD").replace(/[̀-ͯ]/g, ""))
    .filter((ohne) => !VORHER_BEKANNT.has(ohne)),
);
const ohneAkzentFehler = (zeile: string): string[] => zeile.split(" ").filter((w) => NUR_MIT_AKZENT.has(w));

/**
 * „e" ist hier immer die Konjunktion (und) - „è" (ist) kommt erst nach Maiusc. Jede Zeile mit „e" ist gelesen
 * (Befund §4a); eine neue Zeile mit „e" muss hier eingetragen werden, damit jemand prüft, dass nicht „è" gemeint ist
 * (`la verifica e domani` wäre falsch, `dieci e lode` ist richtig).
 */
const ZEILEN_MIT_E_GELESEN: ReadonlySet<string> = new Set([
  "andata e ritorno", "dieci e lode", "accenti del nord e del sud", "tedesco francese italiano e romancio",
]);

describe("IT-T2: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet, ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `il treno ${"abcdefghi"[i]}`);
    expect(zuHaeufig(neun)).toEqual(['"treno": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis (auch kein Blasphemie-Bestandteil)", () => {
    const fehler = ZEILEN.flatMap((t) => t.split(" ").filter((w) => gesperrtIt(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: mona und passera (Kern), pisello und dio (Wortbasis) werden gefunden, monaco und palla nicht", () => {
    expect(istKernGesperrtIt("mona")).toBe(true);
    expect(istKernGesperrtIt("passera")).toBe(true);
    expect(gesperrtIt("pisello")).toBe(true);
    expect(gesperrtIt("dio")).toBe(true);
    expect(gesperrtIt("monaco")).toBe(false);
    expect(gesperrtIt("palla")).toBe(false);
  });

  it("jedes Wort stand schon im Wortschatz oder ist vom Wörterbuch bestätigt oder von Hand belegt", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Listen tragen nur, was wirklich gebraucht wird (sonst wachsen sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => z.split(" ")));
    const listen = [...VOM_WOERTERBUCH_BESTAETIGT, ...VON_HAND_BELEGT];
    expect(listen.filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und ein vom Wörterbuch abgelehntes (taranta) werden gemeldet", () => {
    expect(ungeprueft(["il treno lentx", "concerto di taranta"])).toEqual(["lentx", "taranta"]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58: Anteil buchstabierter Zeilen = 0)", () => {
    const buchstabiert = ZEILEN.filter((z) => z.split(" ").some((w) => w.length >= 2 && !isRealWord(w, "it")));
    expect(buchstabiert).toEqual([]);
  });

  it("kein Wort, das es nur mit Akzent gibt, steht ohne Akzent da (falo, perche …)", () => {
    const fehler = ZEILEN.flatMap((z) => ohneAkzentFehler(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „dal falo“ wird gemeldet, „dal falò“ nicht", () => {
    expect(ohneAkzentFehler("dal falo")).toEqual(["falo"]);
    expect(ohneAkzentFehler("dal falò")).toEqual([]);
  });

  it("jede Zeile mit „e“ ist gelesen (e = und, nie das fehlende è)", () => {
    const mitE = ZEILEN.filter((z) => z.split(" ").includes("e"));
    expect(mitE.filter((z) => !ZEILEN_MIT_E_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_E_GELESEN].filter((z) => !mitE.includes(z))).toEqual([]);
  });
});

// ── Keine Kopien, keine Paare (auch nicht mit der Kinder-Charge), Anker ─────

/** Geschlecht und Zahl gleichgesetzt: „sono fiera di lei" und „sono fiero di lei" sind ein Paar. */
function paarForm(zeile: string): string {
  const art: Record<string, string> = { il: "ART", lo: "ART", la: "ART", i: "ART", le: "ART", un: "EIN", uno: "EIN", una: "EIN" };
  const pron: Record<string, string> = { lui: "PRO", lei: "PRO", loro: "PRO" };
  return zeile
    .split(" ")
    .map((w) => art[w] ?? pron[w] ?? w.replace(/[oaei]$/, "_"))
    .join(" ");
}

/** Paare unter `zeilen` und zwischen `zeilen` und den Vergleichszeilen `gegen`. */
function paare(zeilen: string[], gegen: string[] = []): string[] {
  const gesehen = new Map<string, string>();
  for (const z of gegen) gesehen.set(paarForm(z), `andere it-Charge: ${z}`);
  const out: string[] = [];
  for (const z of zeilen) {
    const f = paarForm(z);
    const frueher = gesehen.get(f);
    if (frueher !== undefined) out.push(`"${frueher}" / "${z}"`);
    else gesehen.set(f, z);
  }
  return out;
}

describe("IT-T2: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der ò nicht kennt)", () => {
    expect(new Set(ZEILEN).size).toBe(ZEILEN.length);
    const schluessel = ZEILEN.map((t) => bausteinKey("satz", t));
    expect(new Set(schluessel).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer Zeile von IT-T1 (Kinder) oder IT-T3 (Erwachsene) - Text oder Ledger-Schlüssel", () => {
    const texte = new Set(ANDERE_IT_ZEILEN);
    const schluessel = new Set(ANDERE_IT_ZEILEN.map((t) => bausteinKey("satz", t)));
    const fehler = ZEILEN.filter((t) => texte.has(t) || schluessel.has(bausteinKey("satz", t)));
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: die sechs beim Merge ersetzten Zeilen stehen in IT-T3 und würden gemeldet", () => {
    // Merge 03.10.2026: sechs Zeilen dieser Charge waren wortgleich mit IT-T3 - T3 behält sie, hier sind sie ersetzt.
    const ersetzt = ["dal falò", "internet lento", "il canto a tenore", "arancine o arancini", "mi manca il mare", "le contrade del palio"];
    for (const t of ersetzt) expect(ERWACHSENENZEILEN, t).toContain(t);
    const schluessel = new Set(ANDERE_IT_ZEILEN.map((t) => bausteinKey("satz", t)));
    expect(ersetzt.filter((t) => !schluessel.has(bausteinKey("satz", t)))).toEqual([]);
    expect(ersetzt.filter((t) => ZEILEN.includes(t))).toEqual([]);
  });

  it("keine Zeile gleicht einer Zeile der Wege de/en/fr/es (Text oder Ledger-Schlüssel)", () => {
    const fremd = [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES];
    const texte = new Set(fremd.map((i) => i.text.toLowerCase()));
    const schluessel = new Set(fremd.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CORPUS_IT_WEG_FRUEH_TEENS.filter(
      (i) => texte.has(i.text) || schluessel.has(bausteinKey(i.kind, i.text)),
    ).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: „la salsa“ (spanischer Korpus) und „il falò“ (Kinder-Charge) wären Kopien - der Schlüssel kennt ò nicht", () => {
    expect(CORPUS_ES.some((i) => i.text === "la salsa")).toBe(true);
    expect(KINDERZEILEN).toContain("il falò");
    // GEMESSEN (03.10.): `bausteinKey` macht aus jedem Akzentbuchstaben ein Leerzeichen und kürzt - „il falò" hat den
    // Schlüssel „il fal" (nicht „il falo", wie Befund IT-T1 §4 vermutete). Zwei Zeilen, die sich nur im Akzent-
    // buchstaben unterscheiden (oder in einem fehlenden Akzentbuchstaben am Ende), fallen zusammen.
    expect(bausteinKey("satz", "il falò")).toBe("satz|il fal");
    expect(bausteinKey("satz", "il falà")).toBe(bausteinKey("satz", "il falò"));
    expect(bausteinKey("satz", "il falo")).not.toBe(bausteinKey("satz", "il falò"));
  });

  it("keine Paare - weder untereinander noch mit einer Zeile von IT-T1 oder IT-T3 (Falle 31)", () => {
    const fehler = paare(ZEILEN, ANDERE_IT_ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Paar mit einer Kinder- und einer Erwachsenenzeile, fiera/fiero und lui/lei werden gefunden", () => {
    // „il nonno ride" steht in der Kinder-Charge - „la nonna ride" wäre ein Paar.
    expect(KINDERZEILEN).toContain("il nonno ride");
    expect(paare(["la nonna ride"], ANDERE_IT_ZEILEN)).toHaveLength(1);
    // Beim Merge gefunden: „salva i file" (hier) und „salva il file" (IT-T3) - Zahl getauscht, darum ersetzt.
    expect(ERWACHSENENZEILEN).toContain("salva il file");
    expect(paare(["salva i file"], ANDERE_IT_ZEILEN)).toHaveLength(1);
    // ebenso „dialetto o italiano" gegen „dialetto e italiano" (IT-T3) - beim Suchen nach Ersatz verworfen.
    expect(paare(["dialetto o italiano"], ANDERE_IT_ZEILEN)).toHaveLength(1);
    expect(paare(["sono fiera di lei", "sono fiero di lei"])).toHaveLength(1);
    expect(paare(["lui lo sa", "lei lo sa"])).toHaveLength(1);
    expect(paare(["la sala", "la salsa"])).toEqual([]);
  });
});

describe("IT-T2: Korpus-Anker und Auslieferung", () => {
  it("CORPUS_IT trägt jede Zeile dieser Charge, HINTER Kinder- und Erwachsenen-Charge (nur angehängt, Merge 03.10.)", () => {
    const it_ = CORPUS_IT.map((i) => i.text);
    expect(it_.slice(0, KINDERZEILEN.length)).toEqual(KINDERZEILEN);
    expect(it_.slice(KINDERZEILEN.length, ANDERE_IT_ZEILEN.length)).toEqual(ERWACHSENENZEILEN);
    expect(it_.slice(ANDERE_IT_ZEILEN.length, ANDERE_IT_ZEILEN.length + ZEILEN.length)).toEqual(ZEILEN);
    const geladen = new Set(korpusFuer("it").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_IT_WEG_FRUEH_TEENS.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "zzz probe it t2", kind: "satz" as const, stufen: ["teens" as const] };
    const ids = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  for (const l of TASTATUREN) {
    it(`${l}: Weg „it“ bekommt Jugendlichen vor Maiusc alle hier schreibbaren Zeilen - nur eigene it-Jugendzeilen, keine Kinder- oder Erwachsenenzeile`, () => {
      setLayout(l);
      const o = introOrder("it");
      const allowed = allowedFromIntroduced(o.slice(0, GEBAUT_BIS[l]), "it");
      const geliefert = corpusItemsFor({ stufe: "teens", allowed, lang: "it", lernweg: "it" });
      const erwartet = ZEILEN.filter((t) => sprosseAuf(t, l) !== null);
      expect(erwartet.filter((t) => !geliefert.includes(t))).toEqual([]);
      // ★ IT-T5 (03.10.2026, Merge): verglichen wird mit der SERVIERTEN Fassung - die ⇧-Zeilen der Jugend-Mitte-Charge
      // (corpusItWegMitteTeens.ts, alle mit `p`) kommen über die Auto-Grossschreibung schon eine Sprosse vor Maiusc an,
      // ohne ihren noch nicht gelernten Punkt (wie es-T5 am es-T2-Wächter). Von dort kommt nichts anderes.
      const eigeneJugend = new Set(
        CORPUS_IT.filter((i) => i.nurWeg === "it" && i.stufen.includes("teens")).map((i) => fitText(i.text, allowed, "it")),
      );
      expect(geliefert.filter((t) => !eigeneJugend.has(t))).toEqual([]);
      expect(geliefert.filter((t) => ANDERE_IT_ZEILEN.includes(t))).toEqual([]);
      const ausT2 = new Set(ZEILEN);
      const vonAnderswo = geliefert.filter((t) => !ausT2.has(t));
      expect(vonAnderswo.filter((t) => t === t.toLowerCase() || !t.toLowerCase().includes("p"))).toEqual([]);
    });
  }

  it("Weg „de“ und Weg „es“ bekommen keine dieser Zeilen", () => {
    setLayout("de");
    const deO = introOrder("de");
    const de = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(deO, "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("es");
    const esO = introOrder("es");
    const es = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(esO, "es"), lang: "es", lernweg: "es" });
    expect(ZEILEN.filter((t) => es.includes(t))).toEqual([]);
  });
});
