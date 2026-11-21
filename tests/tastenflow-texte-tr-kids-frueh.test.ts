/**
 * ★★★ Wächter TR-T1 (03.10.2026): die frühen tr-Texte für Kinder (`corpusTrWegFruehKids.ts`, Sprossen 7-19 auf
 * `tr-q` - bis zur Sprosse vor ⇧). Vorbild: `tastenflow-texte-it-kids-frueh.test.ts`; Befund
 * `BEFUND-2026-10-02-TR-T1-KIDS-FRUEH.md`, Leitfaden Fallen 26/31/37/45/48/58/76/87-91.
 *
 * Die Sprosse einer Zeile wird hier AUSGERECHNET (kleinstes n, ab dem `fitText` sie mit
 * `introOrder("tr").slice(0, n)` durchlässt), nie aus einem Kommentar geglaubt. Türkisch hat EINE Pflicht-Tastatur
 * (`tr-q`; `tr-f` bekommt einen eigenen Weg). Jede Regel hat eine Gegenprobe: der Prüfer muss einen gebauten
 * Fehler finden.
 *
 * Was Türkisch dazubringt (gegenüber dem italienischen Vorbild):
 *  · `ı` und `i` sind zwei Einheiten (Sprosse 15 und 10) - eine Zeile mit `ı` gibt es erst an 15.
 *  · Die Sperrliste gilt auch GEFALTET (`ı→i ş→s …`: `şık` gefaltet ist ein Kern-Wort) und mit den unerwünschten
 *    Themenwörtern (`TR_WORTLISTE_UNERWUENSCHT`) - frühe Kinderzeilen tragen keinen Zusammenhang.
 *  · Jedes Wort, das NICHT schon im Wortschatz stand, ist im Wächter belegt: entweder als Stamm + Endung (der Stamm
 *    ist bekannt, die Endung folgt der Vokalharmonie und der d/t-Angleichung - hier nachgerechnet) oder als Grundform
 *    mit Begründung. Das macOS-Wörterbuch kann für Türkisch nur ABLEHNEN (Falle 87), es bestätigt nichts.
 *  · Nach einem Zahlwort steht die Einzahl (`iki kedi`, nie `iki kediler`).
 *  · Ledger-Schlüssel (`bausteinKey`) kennt `ç ğ ı ş` nicht (sie werden Trenner): Zeilen, die sich nur darin
 *    unterscheiden, hätten dieselbe ID - geprüft in der Charge und gegen alle anderen Korpora.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout } from "../src/lib/typing/layouts";
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
  CORPUS_CS,
} from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_TR } from "../src/lib/typing/corpusTr";
import { CORPUS_TR_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusTrWegFruehKids";
import { allowedFromIntroduced, SERIEN } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { bausteinId, bausteinKey } from "../src/lib/typing/ledger";
import { adaptiveRound } from "../src/lib/typing/generator";
import { corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";
import { gesperrtGefaltetTr, fuerWortlisteUngeeignetTr, istKernGesperrtTr } from "../src/lib/typing/sperrlisteTr";
import { WORDS_TR, STUFE_VOCAB_TR } from "../src/lib/typing/wordsTr";
import { NACHTRAG_TR, NACHTRAG_TR_ERGAENZT } from "../src/lib/typing/lexikonNachtragTr";
import { isRealWord, normalizeWord } from "../src/lib/typing/lexicon";
import { kleinFuer } from "../src/lib/typing/sprachRegister";
import { zeilenFehler } from "./helfer/trTextRegeln";

afterEach(() => setLayout("de"));

const ZEILEN = CORPUS_TR_WEG_FRUEH_KIDS.map((i) => i.text);
/** Die erste Sprosse mit echten Wörtern: an 7 ist „a" der erste Vokal (al, kal, ada) - davor nur Konsonanten. */
const ERSTE_SPROSSE = 7;
/** Die Charge reicht bis zur Sprosse vor ⇧ (Wächter unten: = `letzteSprosse()`). */
const GEBAUT_BIS = 19;

/** Die Sprosse direkt vor ⇧ - aus der Reihenfolge gerechnet, nicht gezählt. */
function letzteSprosse(): number {
  setLayout("tr-q");
  return introOrder("tr").indexOf(SHIFT_UNIT);
}

/** Kleinste Sprosse, an der `fitText` den Text durchlässt (null: nie bis vor ⇧). */
function sprosseAuf(text: string, bisEnde = false): number | null {
  setLayout("tr-q");
  const o = introOrder("tr");
  const bis = bisEnde ? o.length : o.indexOf(SHIFT_UNIT);
  for (let n = 1; n <= bis; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "tr"), "tr") !== null) return n;
  }
  return null;
}

describe("TR-T1: jede Zeile an ihrer Sprosse (tr-q)", () => {
  it("die Folge vor ⇧: 19 Einheiten, f j d k s l a ş · e i n m b r ı t y o u", () => {
    setLayout("tr-q");
    expect(introOrder("tr").slice(0, 19).join(" ")).toBe("f j d k s l a ş e i n m b r ı t y o u");
    expect(letzteSprosse()).toBe(GEBAUT_BIS);
  });

  it(`jede Zeile passt an einer Sprosse ${ERSTE_SPROSSE}-${GEBAUT_BIS}, nicht früher, und minTier stimmt`, () => {
    const fehler: string[] = [];
    for (const item of CORPUS_TR_WEG_FRUEH_KIDS) {
      const s = sprosseAuf(item.text);
      if (s === null || s < ERSTE_SPROSSE || s > GEBAUT_BIS) fehler.push(`"${item.text}": Sprosse ${s}`);
      const tier = minTierFor(item.text, "tr");
      if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die Einträge stehen nach Sprosse sortiert (wer eine Zeile ergänzt, findet ihren Platz)", () => {
    const s = ZEILEN.map((t) => sprosseAuf(t) as number);
    expect(s).toEqual([...s].sort((a, b) => a - b));
  });

  it("Gegenprobe: ç/g/z (nach ⇧) passen nie, ı erst an 15, i an 10, ş an 8, u an 19, Apostroph nie", () => {
    expect(sprosseAuf("çok iyi")).toBeNull();
    expect(sprosseAuf("güzel")).toBeNull();
    expect(sprosseAuf("deniz")).toBeNull();
    expect(sprosseAuf("kır")).toBe(15);
    expect(sprosseAuf("kir")).toBe(14);
    expect(sprosseAuf("iki")).toBe(10);
    expect(sprosseAuf("şal")).toBe(8);
    expect(sprosseAuf("al")).toBe(7);
    expect(sprosseAuf("okul")).toBe(19);
    expect(sprosseAuf("Ankara'da kal")).toBeNull();
    // Nach ⇧ kommen die Zeilen mit ç: dort gibt es sie, sie sind nicht verloren.
    expect(sprosseAuf("çok iyi", true)).not.toBeNull();
  });

  it("vor Sprosse 7 gibt es keinen Vokal (keine echten Wörter)", () => {
    setLayout("tr-q");
    const vorher = introOrder("tr").slice(0, ERSTE_SPROSSE - 1);
    expect(vorher.filter((u) => "aeıioöuü".includes(u))).toEqual([]);
    expect(introOrder("tr")[ERSTE_SPROSSE - 1]).toBe("a");
  });

  /**
   * GEMESSEN am Ende von TR-T1 (vom Code gezählt, nicht geschätzt) - jede Grenze darf künftig nur STEIGEN. Wo sie
   * unter 6 liegt, geben die Buchstaben nicht mehr her (Befund §2): an 7 nur der Vokal „a", an 8 dazu nur `ş`.
   */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    7: 5, 8: 4, 9: 6, 10: 7, 11: 10, 12: 13, 13: 11, 14: 13, 15: 16, 16: 19, 17: 18, 18: 16, 19: 28,
  };

  it("je Sprosse mindestens so viele Zeilen wie gemessen (gerechnete Sprosse)", () => {
    const anzahl = new Map<number, number>();
    for (const t of ZEILEN) {
      const s = sprosseAuf(t);
      if (s !== null) anzahl.set(s, (anzahl.get(s) ?? 0) + 1);
    }
    const zuWenig: string[] = [];
    for (let n = ERSTE_SPROSSE; n <= GEBAUT_BIS; n++) {
      const soll = MINDESTENS_JE_SPROSSE[n] ?? 6;
      if ((anzahl.get(n) ?? 0) < soll) zuWenig.push(`Sprosse ${n}: ${anzahl.get(n) ?? 0} < ${soll}`);
    }
    expect(zuWenig, zuWenig.join("\n")).toEqual([]);
  });
});

describe("TR-T1: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
  /** Zeilen, deren Text die an ihrer Sprosse neue Einheit NICHT enthält. */
  function ohneNeueEinheit(zeilen: { text: string; sprosse: number }[]): string[] {
    setLayout("tr-q");
    const o = introOrder("tr");
    return zeilen
      .filter((z) => !z.text.includes(o[z.sprosse - 1]))
      .map((z) => `"${z.text}" (Sprosse ${z.sprosse}, ${o[z.sprosse - 1]})`);
  }

  it("jede Zeile enthält die Einheit ihrer (gerechneten) Sprosse", () => {
    const zeilen = ZEILEN.map((text) => ({ text, sprosse: sprosseAuf(text) as number }));
    const fehler = ohneNeueEinheit(zeilen);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede Einheit von a bis zur letzten vor ⇧ hat an ihrer Sprosse mindestens eine Zeile (W6)", () => {
    setLayout("tr-q");
    const o = introOrder("tr");
    const fehlt: string[] = [];
    for (let n = ERSTE_SPROSSE; n <= GEBAUT_BIS; n++) {
      const erlaubt = allowedFromIntroduced(o.slice(0, n), "tr");
      const treffer = ZEILEN.filter((t) => fitText(t, erlaubt, "tr") !== null && t.includes(o[n - 1]));
      if (treffer.length === 0) fehlt.push(`${n}:${o[n - 1]}`);
    }
    expect(fehlt, "Einheiten ohne Zeile").toEqual([]);
  });

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet", () => {
    expect(ohneNeueEinheit([{ text: "dede kalede", sprosse: 10 }])).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "dede kalede", sprosse: 9 }])).toEqual([]);
  });

  it("die echte Runde (adaptiveRound, Kinder, Fokus ı) bringt Zeilen dieser Charge MIT ı - nicht nur Wort-Drill", () => {
    setLayout("tr-q");
    const o = introOrder("tr");
    const intro = o.slice(0, o.indexOf("ı") + 1);
    const echt = Math.random;
    let s = 1903;
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
        for (const z of adaptiveRound({ introduced: intro, focus: ["ı"], stufe: "kids", lang: "tr", lernweg: "tr", count: 12 })) {
          texte.push(z.text);
        }
      }
    } finally {
      Math.random = echt;
    }
    // Vor ⇧ setzt die Auto-Grossschreibung den Anfang gross (türkisch gerechnet: „Işıl ışıl liman") - verglichen wird klein.
    const eigene = new Set(ZEILEN);
    const treffer = texte.filter((t) => eigene.has(kleinFuer(t, "tr")) && t.includes("ı"));
    expect(treffer.length, texte.slice(0, 12).join(" / ")).toBeGreaterThan(0);
  });
});

// ── Form: klein, nur gelernte Zeichen, keine Satzzeichen, Hausregeln ─────────

/** Vor ⇧: nur die 19 Buchstaben der Folge und einfache Leerzeichen. */
const ERLAUBTE_ZEICHEN = /^[fjdkslaşeinmbrıtyou ]+$/u;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) || t !== kleinFuer(t, "tr") || t !== t.trim() || t.includes("  ");

describe("TR-T1: vor ⇧ nur Kleinbuchstaben, keine Satzzeichen, Regeln des Weges", () => {
  it("jede Zeile ist klein geschrieben und besteht nur aus Buchstaben der Folge und einfachen Leerzeichen", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Grossbuchstabe (İ, I), Punkt, ç, ü, Apostroph und doppeltes Leerzeichen werden gefunden", () => {
    for (const t of ["İki kedi", "Işık", "iki kedi.", "çok iyi", "süt", "ali'nin", "iki  kedi"]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("ışıl ışıl liman")).toBe(false);
  });

  it("jede Zeile besteht die Regeln aller türkischen Zeilen (`helfer/trTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [kids], nurWeg tr, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_TR_WEG_FRUEH_KIDS) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["kids"]);
      expect(item.nurWeg, item.text).toBe("tr");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Wortschatz: Wortgrenze 8, Sperrliste, Wortbasis, Endungen, Zahlwörter ────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht (Nachwörter, Pronomen, Partikeln). */
const FUNKTIONSWOERTER = new Set(
  (
    "bir bu şu o ben sen biz siz onlar bana sana beni seni benim senin " +
    "ile da de ki mi mı mu mü ne en ama ya kadar gibi için daha çok her hiç tam yine"
  ).split(" "),
);

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    for (const w of new Set(z.split(" "))) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

const VORHER_BEKANNT: ReadonlySet<string> = new Set(
  [...WORDS_TR, ...Object.values(STUFE_VOCAB_TR).flat(), ...NACHTRAG_TR, ...NACHTRAG_TR_ERGAENZT].map((w) =>
    normalizeWord(w, "tr"),
  ),
);

/**
 * Neue GRUNDFORMEN dieser Charge - Wörter, die weder in `WORDS_TR`/`STUFE_VOCAB_TR` noch im Lexikon-Nachtrag standen
 * (der Nachtrag nimmt nur Formen mit mindestens zwei Tatoeba-Belegen, Kinder- und Küchenwörter fehlen dort oft).
 * Jedes ist ein gewöhnliches Wort der Standardsprache [G - eigenes Sprachwissen, NICHT an einer Quelle belegt; vom
 * macOS-Wörterbuch `tr:` am 03.10.2026 NICHT abgelehnt - das ist bei Türkisch kein Beweis, Falle 87]. Über den Korpus
 * kommen sie ins Vorlese-Lexikon (die Stimme spricht sie ganz).
 */
const NEUE_GRUNDFORMEN: Readonly<Record<string, string>> = {
  akide: "„akide şekeri“: traditionelles Zuckerwerk (İstanbul)",
  erişte: "hausgemachte Nudeln, im Herbst für den Winter gemacht (İç Anadolu)",
  ışıl: "nur doppelt: „ışıl ışıl“ = funkelnd (feste Verdopplung)",
  kaban: "dicke Winterjacke",
  katmer: "Blätterteig-Frühstück mit Pistazien (Gaziantep)",
  kay: "Befehlsform von „kaymak“ (rutschen): „kaydıraktan kay“",
  kaymak: "Rahm; „bal kaymak“ = Frühstück mit Honig und Rahm (Afyon)",
  kilim: "gewebter Teppich (in allen Regionen)",
  kir: "Schmutz - Gegenstück zu „kır“ (ı/i, Texte-Recherche §3.3)",
  konak: "altes Herrenhaus (Safranbolu, Mardin)",
  kuymak: "Maisgericht mit Käse (Karadeniz)",
  kır: "Feld, offenes Land - Gegenstück zu „kir“",
  liman: "Hafen",
  menekşe: "Veilchen",
  menemen: "Eier mit Tomate und Paprika; auch eine Stadt bei İzmir (Ege)",
  ninni: "Wiegenlied",
  oya: "Spitzenrand an Tüchern („oyalı mendil“) - nur als Stamm benutzt",
  sakla: "Befehlsform von „saklamak“ (aufbewahren, verstecken)",
  sini: "grosses Metalltablett (Gaziantep, Mardin: Kupfer)",
  tantuni: "Fleisch im Fladen (Mersin, Akdeniz)",
  tulum: "Dudelsack der Schwarzmeerküste (Karadeniz)",
  yayla: "Sommerweide in den Bergen (Karadeniz, Toros)",
  yemyeşil: "verstärkte Form von „yeşil“ (ganz grün; feste Bildung mit „yem-“)",
};

/**
 * Neue Formen = bekannter Stamm + Endung. Der Stamm stand im Wortschatz (oder ist eine Grundform oben); die Endung
 * ist hier ausgeschrieben, damit der Wächter Vokalharmonie und d/t-Angleichung NACHRECHNEN kann (Puffer `n y s` gehören
 * zur Endung: „dede|ne“, „olta|yla“, „ekşi|si“).
 */
const NEUE_FORMEN: Readonly<Record<string, readonly [string, string]>> = {
  adada: ["ada", "da"], dalda: ["dal", "da"], şafakla: ["şafak", "la"], şafakta: ["şafak", "ta"],
  dedene: ["dede", "ne"], seslen: ["ses", "len"], kilimde: ["kilim", "de"], ebesin: ["ebe", "sin"],
  babaannem: ["babaanne", "m"], kalemim: ["kalem", "im"], bademli: ["badem", "li"], kardan: ["kar", "dan"],
  ekşisi: ["ekşi", "si"], dereler: ["dere", "ler"], taşta: ["taş", "ta"], tandırda: ["tandır", "da"],
  tarlada: ["tarla", "da"], makasla: ["makas", "la"], kışlık: ["kış", "lık"], tatlısı: ["tatlı", "sı"],
  etli: ["et", "li"], yaylada: ["yayla", "da"], kaydıraktan: ["kaydırak", "tan"], yaşındayım: ["yaş", "ındayım"],
  yediye: ["yedi", "ye"], kayıkta: ["kayık", "ta"], balonlar: ["balon", "lar"], kolonyası: ["kolonya", "sı"],
  oyalı: ["oya", "lı"], ayranla: ["ayran", "la"], oltayla: ["olta", "yla"], bostanda: ["bostan", "da"],
  limonlu: ["limon", "lu"], teknenin: ["tekne", "nin"], susamlı: ["susam", "lı"], fidanı: ["fidan", "ı"],
  kayıyor: ["kay", "ıyor"], dedemle: ["dede", "mle"], kurduk: ["kur", "duk"], sabunu: ["sabun", "u"],
  fıstıklı: ["fıstık", "lı"], sulu: ["su", "lu"], sula: ["su", "la"],
};

const HINTEN = new Set(["a", "ı", "o", "u"]);
const VOKALE = new Set(["a", "e", "ı", "i", "o", "ö", "u", "ü"]);
const STIMMLOS = new Set(["ç", "f", "h", "k", "p", "s", "ş", "t"]);

/**
 * Fehler einer Endung gegen die Vokalharmonie (zweifach a/e, vierfach ı/i/u/ü; das `o` von „-yor“ ist fest) und gegen
 * die Angleichung des Anlauts (-da/-ta, -dan/-tan, -dı/-tı: `t` nach stimmlosem Laut ç f h k p s ş t).
 */
function endungFehler(stamm: string, endung: string): string[] {
  const fehler: string[] = [];
  let vorher = [...stamm].reverse().find((z) => VOKALE.has(z));
  for (const v of endung) {
    if (!VOKALE.has(v) || vorher === undefined) continue;
    if (v === "o") {
      vorher = v;
      continue;
    }
    const hinten = HINTEN.has(vorher);
    const soll =
      v === "a" || v === "e"
        ? hinten ? "a" : "e"
        : vorher === "a" || vorher === "ı" ? "ı" : vorher === "e" || vorher === "i" ? "i" : vorher === "o" || vorher === "u" ? "u" : "ü";
    if (v !== soll) fehler.push(`„${v}“ nach „${vorher}“ (soll „${soll}“)`);
    vorher = v;
  }
  const anlaut = endung[0];
  if (anlaut === "d" || anlaut === "t") {
    const soll = STIMMLOS.has(stamm[stamm.length - 1]) ? "t" : "d";
    if (anlaut !== soll) fehler.push(`Anlaut „${anlaut}“ nach „${stamm[stamm.length - 1]}“ (soll „${soll}“)`);
  }
  return fehler;
}

/** Wörter (ab zwei Buchstaben), die weder vorher im Wortschatz standen noch hier als Grundform oder Form belegt sind. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of z.split(" ")) {
      if (w.length >= 2 && !VORHER_BEKANNT.has(w) && !(w in NEUE_GRUNDFORMEN) && !(w in NEUE_FORMEN)) out.add(w);
    }
  }
  return [...out];
}

const ZAHLWOERTER = new Set("bir iki üç dört beş altı yedi sekiz dokuz on yirmi otuz kırk elli yüz bin".split(" "));
/** Nach einem Zahlwort steht die Einzahl (Glossar Regel 5): „iki kedi“, nie „iki kediler“. */
function mehrzahlNachZahl(zeile: string): string[] {
  const w = zeile.split(" ");
  return w.filter((x, i) => i > 0 && ZAHLWOERTER.has(w[i - 1]) && /l[ae]r(?:ı|i|a|e|da|de|dan|den|ın|in)?$/u.test(x));
}

describe("TR-T1: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet, ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `ile kedi ${"abcdefghi"[i]}`);
    expect(zuHaeufig(neun)).toEqual(['"kedi": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - Kern, Wortbasis, gefaltet (ı→i ş→s …) und kein unerwünschtes Themenwort", () => {
    const fehler = ZEILEN.flatMap((t) =>
      t.split(" ").filter((w) => gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w)).map((w) => `"${t}": ${w}`),
    );
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: sik (Kern), şık (gefaltet „sik“), salak und kör (Wortbasis), ata (unerwünscht) - ada, kale, kır nicht", () => {
    expect(istKernGesperrtTr("sik")).toBe(true);
    expect(istKernGesperrtTr("şık")).toBe(false);
    expect(gesperrtGefaltetTr("şık")).toBe(true);
    expect(gesperrtGefaltetTr("salak")).toBe(true);
    expect(gesperrtGefaltetTr("kör")).toBe(true);
    expect(fuerWortlisteUngeeignetTr("ata")).toBe(true);
    for (const w of ["ada", "kale", "kır", "kir", "şal"]) expect(fuerWortlisteUngeeignetTr(w), w).toBe(false);
  });

  it("jedes Wort stand schon im Wortschatz (WORDS_TR, STUFE_VOCAB_TR, Nachtrag) oder ist als Grundform/Form belegt", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Listen tragen nur, was wirklich gebraucht wird und nicht schon bekannt war (sonst wachsen sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => z.split(" ")));
    const staemme = new Set(Object.values(NEUE_FORMEN).map(([s]) => s));
    expect(Object.keys(NEUE_FORMEN).filter((w) => !benutzt.has(w) || VORHER_BEKANNT.has(w))).toEqual([]);
    expect(
      Object.keys(NEUE_GRUNDFORMEN).filter((w) => (!benutzt.has(w) && !staemme.has(w)) || VORHER_BEKANNT.has(w)),
    ).toEqual([]);
  });

  it("jede neue Form = Stamm + Endung; der Stamm ist bekannt; Vokalharmonie und d/t-Angleichung stimmen", () => {
    const fehler: string[] = [];
    for (const [wort, [stamm, endung]] of Object.entries(NEUE_FORMEN)) {
      if (stamm + endung !== wort) fehler.push(`${wort}: ${stamm} + ${endung} ergibt ${stamm + endung}`);
      if (!VORHER_BEKANNT.has(stamm) && !(stamm in NEUE_GRUNDFORMEN)) fehler.push(`${wort}: Stamm „${stamm}“ unbekannt`);
      for (const f of endungFehler(stamm, endung)) fehler.push(`${wort}: ${f}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: falsche Harmonie (dalde, kalemım, limonlı) und falsche Angleichung (taşda, kardan ✓/kartan ✗) werden gemeldet", () => {
    expect(endungFehler("dal", "de")).toHaveLength(1);
    expect(endungFehler("kalem", "ım")).toHaveLength(1);
    expect(endungFehler("limon", "lı")).toHaveLength(1);
    expect(endungFehler("taş", "da")).toHaveLength(1);
    expect(endungFehler("kar", "tan")).toHaveLength(1);
    expect(endungFehler("kar", "dan")).toEqual([]);
    expect(endungFehler("kay", "ıyor")).toEqual([]);
    expect(endungFehler("yaş", "ındayım")).toEqual([]);
    expect(ungeprueft(["kedi dalde", "salsx kal"])).toEqual(["dalde", "salsx"]);
  });

  it("nach einem Zahlwort steht die Einzahl", () => {
    const fehler = ZEILEN.flatMap((z) => mehrzahlNachZahl(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „iki kediler“, „beş kelebekler“ werden gemeldet, „iki kedi“, „bulutlar kayıyor“ nicht", () => {
    expect(mehrzahlNachZahl("iki kediler")).toEqual(["kediler"]);
    expect(mehrzahlNachZahl("beş kelebekler")).toEqual(["kelebekler"]);
    expect(mehrzahlNachZahl("iki kedi")).toEqual([]);
    expect(mehrzahlNachZahl("bulutlar kayıyor")).toEqual([]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58: Anteil buchstabierter Zeilen = 0)", () => {
    const buchstabiert = ZEILEN.filter((z) => z.split(" ").some((w) => w.length >= 2 && !isRealWord(w, "tr")));
    expect(buchstabiert).toEqual([]);
  });
});

// ── Keine Kopien, keine Paare, Ledger-Schlüssel, Anker ──────────────────────

/** Person und Zahl gleichgesetzt: „ben de kal“/„sen de kal“ und „kedi dalda“/„kediler dalda“ sind ein Paar. */
function paarForm(zeile: string): string {
  const pron: Record<string, string> = { ben: "PRO", sen: "PRO", o: "PRO", biz: "PRO", siz: "PRO", onlar: "PRO" };
  return zeile
    .split(" ")
    .map((w) => pron[w] ?? w.replace(/l[ae]r$/u, ""))
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

const ANDERE_KORPORA = () => [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_CS];

describe("TR-T1: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der ç ğ ı ş nicht kennt)", () => {
    expect(new Set(ZEILEN).size).toBe(ZEILEN.length);
    const schluessel = ZEILEN.map((t) => bausteinKey("satz", t));
    expect(new Set(schluessel).size).toBe(ZEILEN.length);
  });

  it("Gegenprobe: „kaş“/„kaç“ und „kır kal“/„kar kal“ - nur ç/ş bzw. ı verschieden - teilen den Schlüssel bzw. nicht", () => {
    expect(bausteinKey("satz", "kaş al")).toBe(bausteinKey("satz", "kaç al"));
    expect(bausteinKey("satz", "kır kal")).not.toBe(bausteinKey("satz", "kar kal"));
  });

  it("keine Zeile gleicht einer Zeile der Wege de/en/fr/es/it/pl/cs (Text oder Ledger-Schlüssel)", () => {
    const fremd = ANDERE_KORPORA();
    expect(fremd.length).toBeGreaterThan(1000);
    const texte = new Set(fremd.map((i) => kleinFuer(i.text, "tr").replace(/[.,!?;:"]/gu, "")));
    const schluessel = new Set(fremd.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CORPUS_TR_WEG_FRUEH_KIDS.filter(
      (i) => texte.has(i.text) || schluessel.has(bausteinKey(i.kind, i.text)),
    ).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: eine Zeile, die es auf Weg „it“ schon gibt („la sala“), wäre eine Kopie", () => {
    const fremd = new Set(ANDERE_KORPORA().map((i) => bausteinKey(i.kind, i.text)));
    expect(fremd.has(bausteinKey("satz", "la sala"))).toBe(true);
  });

  it("keine Paare (nur Person oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ben/sen und Einzahl/Mehrzahl werden als Paar erkannt, kır/kir nicht", () => {
    expect(paare(["ben de kal", "sen de kal"])).toHaveLength(1);
    expect(paare(["kedi dalda", "kediler dalda"])).toHaveLength(1);
    expect(paare(["kır kal", "kir kal"])).toEqual([]);
  });
});

/**
 * ★ Merge mit PL-T1 und Italienisch komplett (03.10.2026): Kopien und „fast gleich" auch gegen ALLES, was sonst Text
 * trägt - alle Korpora (auch `CORPUS_PL`), alle Serien aller Sprachen und alle Prüfungstext-Banken (`schreibproben/texte*.ts`,
 * auch die italienischen Sfida-Banken), Zeile für Zeile und Satz für Satz.
 */
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
/** Jede fremde Zeile, dazu jeder ihrer Sätze einzeln. */
function alleFremdenZeilen(): string[] {
  const roh = [
    ...ANDERE_KORPORA().map((i) => i.text),
    ...SERIEN.flatMap((s) => s.etappen.flatMap((e) => e.lines)),
    ...bankZeilen(),
  ];
  return [...new Set(roh.flatMap((z) => [z, ...z.split(/(?<=[.!?])\s+/u)]))];
}
const ohneZeichen = (t: string) => kleinFuer(t, "tr").replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
const wortMenge = (t: string) => new Set(ohneZeichen(t).split(" ").filter(Boolean));
/** „fast gleich" ab Jaccard 0,6 (wie IT-T8/die it-Serien, Falle 51). */
function fastGleich(a: Set<string>, b: Set<string>): boolean {
  let s = 0;
  for (const x of a) if (b.has(x)) s++;
  return s / (a.size + b.size - s) >= 0.6;
}

describe("TR-T1: keine Kopie und nichts fast gleich - gegen Korpora, Serien und Prüfungstext-Banken aller Sprachen", () => {
  it("die Vergleichsmenge ist voll (Serien und Banken geladen, auch pl und die it-Sfida)", () => {
    expect(Object.keys(BANKEN).some((p) => /It[AB]?\.ts$/.test(p))).toBe(true);
    expect(bankZeilen().length).toBeGreaterThan(1000);
    expect(SERIEN.length).toBeGreaterThan(100);
    expect(CORPUS_PL.length).toBeGreaterThan(0);
  });

  it("keine Zeile gleicht einer fremden Zeile oder einem fremden Satz (ohne Satzzeichen, klein) oder ihrem Ledger-Schlüssel", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneZeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    const fehler = ZEILEN.filter((t) => texte.has(ohneZeichen(t)) || schluessel.has(bausteinKey("satz", t)));
    expect(fehler).toEqual([]);
  });

  it("nichts fast gleich - weder in der Charge noch gegen fremde Zeilen (Wortmenge, Jaccard ≥ 0,6)", () => {
    const fremd = alleFremdenZeilen().map((t) => [t, wortMenge(t)] as const);
    const eigen = ZEILEN.map((t) => [t, wortMenge(t)] as const);
    const fehler: string[] = [];
    for (let i = 0; i < eigen.length; i++) {
      for (const [t, m] of fremd) if (fastGleich(eigen[i][1], m)) fehler.push(`"${eigen[i][0]}" ~ "${t}"`);
      for (let j = i + 1; j < eigen.length; j++) {
        if (fastGleich(eigen[i][1], eigen[j][1])) fehler.push(`"${eigen[i][0]}" ~ "${eigen[j][0]}"`);
      }
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: eine Serienzeile und ein Banken-Satz werden als Kopie, eine Umstellung als fast gleich erkannt", () => {
    const serienZeile = SERIEN[0].etappen[0].lines[0];
    const fremd = new Set(alleFremdenZeilen().map(ohneZeichen));
    expect(fremd.has(ohneZeichen(serienZeile))).toBe(true);
    expect(fremd.has(ohneZeichen(bankZeilen()[0].split(/(?<=[.!?])\s+/u)[0]))).toBe(true);
    expect(fastGleich(wortMenge("dede ile kedi"), wortMenge("kedi ile dede"))).toBe(true);
    expect(fastGleich(wortMenge("iki kedi"), wortMenge("iki arkadaş"))).toBe(false);
  });
});

describe("TR-T1: Korpus-Anker und Auslieferung", () => {
  it("CORPUS_TR und korpusFuer(\"tr\") tragen jede Zeile dieser Charge (nichts still verschmolzen)", () => {
    const roh = new Set(CORPUS_TR.map((i) => i.text));
    const geladen = new Set(korpusFuer("tr").map((i) => i.text));
    expect(ZEILEN.filter((t) => !roh.has(t))).toEqual([]);
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_TR_WEG_FRUEH_KIDS.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "zzz probe tr t1", kind: "satz" as const, stufen: ["kids" as const] };
    const ids = manifestFor([...ANDERE_KORPORA(), ...CORPUS_TR, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("Weg „tr“ bekommt vor ⇧ alle Zeilen dieser Charge - und nur eigene tr-Kinderzeilen", () => {
    setLayout("tr-q");
    const o = introOrder("tr");
    const allowed = allowedFromIntroduced(o.slice(0, GEBAUT_BIS), "tr");
    const geliefert = corpusItemsFor({ stufe: "kids", allowed, lang: "tr", lernweg: "tr" });
    expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
    // Spätere Chargen (⇧-Zeilen) kommen über die Auto-Grossschreibung schon vor ⇧ an, ohne ihre noch nicht gelernten
    // Satzzeichen (`fitText`, wie IT-T4): eigen ist darum der Rohtext ODER seine servierte Fassung bei diesem Stand.
    const eigeneKinder = new Set(
      CORPUS_TR.filter((i) => i.nurWeg === "tr" && i.stufen.includes("kids")).flatMap((i) => [
        i.text,
        fitText(i.text, allowed, "tr") ?? i.text,
      ]),
    );
    expect(geliefert.filter((t) => !eigeneKinder.has(t))).toEqual([]);
  });

  it("Weg „de“ und Weg „it“ bekommen keine dieser Zeilen", () => {
    setLayout("de");
    const deO = introOrder("de");
    const de = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(deO, "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const itO = introOrder("it");
    const it_ = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(itO, "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
