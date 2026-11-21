/**
 * ★★★ Wächter IT-T1 (03.10.2026): die frühen it-Texte für Kinder
 * (`corpusItWegFruehKids.ts`, Sprossen 7-19 auf `it`, 7-18 auf `it-qzerty` -
 * bis zur Sprosse vor Maiusc). Vorbild: `tastenflow-texte-es-kids-frueh.test.ts`;
 * Bauplan `BAUPLAN-2026-10-02-ITALIENISCHER-LEHRGANG.md` §3/§5, Leitfaden
 * Fallen 26/31/37/45/48/58.
 *
 * Die Sprosse einer Zeile wird hier AUSGERECHNET (kleinstes n, ab dem
 * `fitText` sie mit `introOrder("it").slice(0, n)` durchlässt) - auf BEIDEN
 * Pflicht-Tastaturen, nie aus einem Kommentar geglaubt. Anders als bei
 * Spanisch rechnen die zwei Tastaturen VERSCHIEDEN: auf der Mac-QZERTY
 * (`it-qzerty`) ist `m` die achte Grundtaste und `ò` kommt erst nach `ì`
 * (F4-it, `achteGrundtasten`). Jede Regel hat eine Gegenprobe: der Prüfer
 * muss einen gebauten Fehler finden.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, korpusFuer, CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_IT } from "../src/lib/typing/corpusIt";
import { CORPUS_IT_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusItWegFruehKids";
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
const ZEILEN = CORPUS_IT_WEG_FRUEH_KIDS.map((i) => i.text);
/**
 * Die erste Sprosse mit echten Wörtern: an 7 ist „a" der erste Vokal (la, sala)
 * - davor gibt es nur Konsonanten der Grundreihe (Gegenprobe unten).
 */
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

describe("IT-T1: jede Zeile an ihrer Sprosse (it und it-qzerty)", () => {
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
      for (const item of CORPUS_IT_WEG_FRUEH_KIDS) {
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
    expect(mitO.length).toBeGreaterThan(0);
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

  it("Gegenprobe: g (nach Maiusc) passt nie, m an 17 bzw. 8, ò an 8 bzw. nie, p an 19 bzw. 18", () => {
    expect(sprosseAuf("la gatta", "it")).toBeNull();
    expect(sprosseAuf("la gatta", "it-qzerty")).toBeNull();
    expect(sprosseAuf("la mamma", "it")).toBe(17);
    expect(sprosseAuf("la mamma", "it-qzerty")).toBe(8);
    expect(sprosseAuf("al falò", "it")).toBe(8);
    expect(sprosseAuf("al falò", "it-qzerty")).toBeNull();
    expect(sprosseAuf("la pasta", "it")).toBe(19);
    expect(sprosseAuf("la pasta", "it-qzerty")).toBe(18);
    expect(sprosseAuf("la sala", "it-qzerty")).toBe(7);
    // Ein Akzent, der noch nicht gelernt ist, und der Apostroph (Nr. 26) machen eine Zeile vor Maiusc unschreibbar.
    expect(sprosseAuf("il sole è caldo", "it")).toBeNull();
    expect(sprosseAuf("l'uva", "it")).toBeNull();
  });

  it("vor Sprosse 7 gibt es keinen Vokal (keine echten Wörter) - auf beiden Tastaturen", () => {
    for (const l of TASTATUREN) {
      setLayout(l);
      const vorher = introOrder("it").slice(0, ERSTE_SPROSSE - 1);
      expect(vorher.filter((u) => "aeiouàèéìòù".includes(u)), l).toEqual([]);
      expect(introOrder("it")[ERSTE_SPROSSE - 1], l).toBe("a");
    }
  });

  /**
   * GEMESSEN am Ende von IT-T1 (vom Code gezählt, nicht geschätzt) - jede
   * Grenze darf künftig nur STEIGEN. Wo sie unter 6 liegt, geben die
   * Buchstaben nicht mehr her (Befund §2): an 7 nur der Vokal „a", an 8 auf
   * `it` die `ò` nur in „falò", auf `it-qzerty` die `m` nur in „mamma"/„dama".
   */
  const MINDESTENS_JE_SPROSSE: Record<string, Record<number, number>> = {
    it: { 7: 5, 8: 3, 9: 6, 10: 7, 11: 8, 12: 11, 13: 11, 14: 11, 15: 16, 16: 14, 17: 23, 18: 16, 19: 25 },
    "it-qzerty": { 7: 5, 8: 3, 9: 6, 10: 7, 11: 8, 12: 13, 13: 11, 14: 13, 15: 25, 16: 19, 17: 16, 18: 25 },
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

describe("IT-T1: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
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
    expect(ohneNeueEinheit([{ text: "il sole sale", sprosse: 12 }], "it")).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "il sole sale", sprosse: 11 }], "it")).toEqual([]);
    expect(ohneNeueEinheit([{ text: "la mamma sa", sprosse: 8 }], "it")).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "la mamma sa", sprosse: 8 }], "it-qzerty")).toEqual([]);
  });
});

// ── Form: klein, nur gelernte Zeichen, keine Satzzeichen, Hausregeln ─────────

/** Vor Maiusc: Kleinbuchstaben der Folge (ò ist die einzige Akzenteinheit davor) und einfache Leerzeichen. */
const ERLAUBTE_ZEICHEN = /^[a-zò ]+$/;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) || t !== t.toLowerCase() || t !== t.trim() || t.includes("  ");

describe("IT-T1: vor Maiusc nur Kleinbuchstaben, keine Satzzeichen, Regeln des Weges", () => {
  it("jede Zeile ist klein geschrieben und besteht nur aus Buchstaben und einfachen Leerzeichen", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Grossbuchstabe, Punkt, è, Apostroph und doppeltes Leerzeichen werden gefunden", () => {
    for (const t of ["Il sole sale", "il sole sale.", "il sole è caldo", "l'uva", "il  sole"]) {
      expect(formFehler(t), t).toBe(true);
    }
  });

  it("jede Zeile besteht die Regeln aller italienischen Zeilen (`helfer/itTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [kids], nurWeg it, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_IT_WEG_FRUEH_KIDS) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["kids"]);
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
 * Vorsilbe `it:`, gemessen 03.10.2026; abgelehnt wurden `canederli`, `carasau`, `friselle` - sie stehen in keiner
 * Zeile). Über den Korpus kommen sie ins Vorlese-Lexikon (lexicon.ts: Korpus-Wörter), die Stimme spricht sie ganz.
 */
const VOM_WOERTERBUCH_BESTAETIGT: ReadonlySet<string> = new Set([
  "caldarroste", "cicale", "effe", "erutta", "falò", "ladino", "mandolino", "nascondino", "nono", "nuota",
  "paiolo", "pandoro", "pastori", "pupi", "riordina", "sardo", "taralli", "trotta",
]);

const VORHER_BEKANNT: ReadonlySet<string> = new Set(
  [...WORDS_IT, ...Object.values(STUFE_VOCAB_IT).flat(), ...NACHTRAG_IT].map((w) => normalizeWord(w, "it")),
);

/** Wörter (ab zwei Buchstaben), die weder vorher im Wortschatz standen noch vom Wörterbuch bestätigt sind. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of z.split(" ")) {
      if (w.length >= 2 && !VORHER_BEKANNT.has(w) && !VOM_WOERTERBUCH_BESTAETIGT.has(w)) out.add(w);
    }
  }
  return [...out];
}

/**
 * Wörter, die es NUR mit Akzent gibt (Bauplan I6, §5 Nr. 4): ihre Form ohne Akzent ist kein Wort und darf nie
 * in einer Zeile stehen (`ando` statt `andò`). Gebaut aus dem Wortschatz: jedes Wort mit Akzent am Ende, dessen
 * Form ohne Akzent selbst kein bekanntes Wort ist.
 */
const NUR_MIT_AKZENT: ReadonlySet<string> = new Set(
  [...VORHER_BEKANNT, ...VOM_WOERTERBUCH_BESTAETIGT]
    .filter((w) => /[àèéìòù]$/.test(w))
    .map((w) => w.normalize("NFD").replace(/[̀-ͯ]/g, ""))
    .filter((ohne) => !VORHER_BEKANNT.has(ohne)),
);
const ohneAkzentFehler = (zeile: string): string[] => zeile.split(" ").filter((w) => NUR_MIT_AKZENT.has(w));

/**
 * „e" ist hier immer die Konjunktion (und) - „è" (ist) kommt erst an Nr. 24. Jede Zeile mit „e" ist gelesen
 * (Befund §4a); eine neue Zeile mit „e" muss hier eingetragen werden, damit jemand prüft, dass nicht „è" gemeint ist
 * (`il sole e caldo` wäre falsch, `il sole e le onde` ist richtig).
 */
const ZEILEN_MIT_E_GELESEN: ReadonlySet<string> = new Set([
  "olio e sale", "io e lei", "il sole e le onde", "il leone e la iena", "nonno e nono", "fratelli e sorelle",
  "e ora a letto", "la luna e le stelle", "mele e mirtilli", "la cicala e la formica", "vocali e consonanti",
  "piove e fa freddo", "parlo italiano e tedesco", "le api e i fiori", "prima i compiti e poi il parco",
  "il pastore e le pecore",
]);

describe("IT-T1: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet, ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `la luna ${"abcdefghi"[i]}`);
    expect(zuHaeufig(neun)).toEqual(['"luna": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis (frühe Kinderzeilen: auch kein Doppelsinn)", () => {
    const fehler = ZEILEN.flatMap((t) => t.split(" ").filter((w) => gesperrtIt(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: mona und passera (Kern), pisello (Wortbasis) werden gefunden, monaco und palla nicht", () => {
    expect(istKernGesperrtIt("mona")).toBe(true);
    expect(istKernGesperrtIt("passera")).toBe(true);
    expect(istKernGesperrtIt("pisello")).toBe(false);
    expect(gesperrtIt("pisello")).toBe(true);
    expect(gesperrtIt("monaco")).toBe(false);
    expect(gesperrtIt("palla")).toBe(false);
  });

  it("jedes Wort stand schon im Wortschatz (WORDS_IT, STUFE_VOCAB_IT, NACHTRAG_IT) oder ist vom Wörterbuch bestätigt", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Liste trägt nur, was wirklich gebraucht wird (sonst wächst sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => z.split(" ")));
    expect([...VOM_WOERTERBUCH_BESTAETIGT].filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und ein vom Wörterbuch abgelehntes (canederli) werden gemeldet", () => {
    expect(ungeprueft(["la salsx", "i canederli"])).toEqual(["salsx", "canederli"]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58: Anteil buchstabierter Zeilen = 0)", () => {
    const buchstabiert = ZEILEN.filter((z) => z.split(" ").some((w) => w.length >= 2 && !isRealWord(w, "it")));
    expect(buchstabiert).toEqual([]);
  });

  it("kein Wort, das es nur mit Akzent gibt, steht ohne Akzent da (ando, falo, perche …)", () => {
    const fehler = ZEILEN.flatMap((z) => ohneAkzentFehler(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „lei ando al falo“ wird zweimal gemeldet, „la sala“ nicht", () => {
    expect(ohneAkzentFehler("lei ando al falo")).toEqual(["ando", "falo"]);
    expect(ohneAkzentFehler("la sala")).toEqual([]);
  });

  it("jede Zeile mit „e“ ist gelesen (e = und, nie das fehlende è)", () => {
    const mitE = ZEILEN.filter((z) => z.split(" ").includes("e"));
    expect(mitE.filter((z) => !ZEILEN_MIT_E_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_E_GELESEN].filter((z) => !mitE.includes(z))).toEqual([]);
  });
});

// ── Keine Kopien, keine Paare, Anker ────────────────────────────────────────

/** Geschlecht und Zahl gleichgesetzt: „il nonno ride" und „la nonna ride" sind ein Paar. */
function paarForm(zeile: string): string {
  const art: Record<string, string> = { il: "ART", lo: "ART", la: "ART", i: "ART", le: "ART", un: "EIN", uno: "EIN", una: "EIN" };
  const pron: Record<string, string> = { lui: "PRO", lei: "PRO", loro: "PRO" };
  return zeile
    .split(" ")
    .map((w) => art[w] ?? pron[w] ?? w.replace(/[oaei]$/, "_"))
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

describe("IT-T1: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der ò nicht kennt)", () => {
    expect(new Set(ZEILEN).size).toBe(ZEILEN.length);
    const schluessel = ZEILEN.map((t) => bausteinKey("satz", t));
    expect(new Set(schluessel).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer Zeile der Wege de/en/fr/es (Text oder Ledger-Schlüssel)", () => {
    const fremd = [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES];
    const texte = new Set(fremd.map((i) => i.text.toLowerCase()));
    const schluessel = new Set(fremd.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CORPUS_IT_WEG_FRUEH_KIDS.filter(
      (i) => texte.has(i.text) || schluessel.has(bausteinKey(i.kind, i.text)),
    ).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: „la salsa“ (steht im spanischen Korpus) wäre eine Kopie", () => {
    expect(CORPUS_ES.some((i) => i.text === "la salsa")).toBe(true);
  });

  it("keine Paare (nur Geschlecht oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: nonno/nonna, lui/lei und Einzahl/Mehrzahl werden als Paar erkannt", () => {
    expect(paare(["il nonno ride", "la nonna ride"])).toHaveLength(1);
    expect(paare(["lui sale", "lei sale"])).toHaveLength(1);
    expect(paare(["la rosa rossa", "le rose rosse"])).toHaveLength(1);
    expect(paare(["la sala", "la salsa"])).toEqual([]);
  });
});

describe("IT-T1: Korpus-Anker und Auslieferung", () => {
  it("CORPUS_IT und korpusFuer(\"it\") tragen jede Zeile dieser Charge (nichts still verschmolzen)", () => {
    const roh = new Set(CORPUS_IT.map((i) => i.text));
    const geladen = new Set(korpusFuer("it").map((i) => i.text));
    expect(ZEILEN.filter((t) => !roh.has(t))).toEqual([]);
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_IT_WEG_FRUEH_KIDS.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "zzz probe it t1", kind: "satz" as const, stufen: ["kids" as const] };
    const ids = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  for (const l of TASTATUREN) {
    it(`${l}: Weg „it“ bekommt vor Maiusc alle Zeilen, die die Tastatur dort schreibt - und nur eigene it-Kinderzeilen`, () => {
      setLayout(l);
      const o = introOrder("it");
      const allowed = allowedFromIntroduced(o.slice(0, GEBAUT_BIS[l]), "it");
      const geliefert = corpusItemsFor({ stufe: "kids", allowed, lang: "it", lernweg: "it" });
      const erwartet = ZEILEN.filter((t) => sprosseAuf(t, l) !== null);
      expect(erwartet.filter((t) => !geliefert.includes(t))).toEqual([]);
      // ★ IT-T4 (03.10.2026): die Maiusc-Zeilen der Kinder-Mitte kommen über die Auto-Grossschreibung schon vor
      // Maiusc an - ohne ihre noch nicht gelernten Satzzeichen (`fitText`). Eigen ist darum der Rohtext ODER seine
      // servierte Fassung bei diesem Stand (wie ES-T4/ES-T7).
      const eigeneKinder = new Set(
        CORPUS_IT.filter((i) => i.nurWeg === "it" && i.stufen.includes("kids")).flatMap((i) => [
          i.text,
          fitText(i.text, allowed, "it") ?? i.text,
        ]),
      );
      expect(geliefert.filter((t) => !eigeneKinder.has(t))).toEqual([]);
    });
  }

  it("Weg „de“ und Weg „es“ bekommen keine dieser Zeilen", () => {
    setLayout("de");
    const deO = introOrder("de");
    const de = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(deO, "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("es");
    const esO = introOrder("es");
    const es = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(esO, "es"), lang: "es", lernweg: "es" });
    expect(ZEILEN.filter((t) => es.includes(t))).toEqual([]);
  });
});
