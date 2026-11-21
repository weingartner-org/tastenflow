/**
 * ★★★ Wächter TR-T3 (03.10.2026): die frühen tr-Texte für ERWACHSENE (`corpusTrWegFruehErwachsene.ts`, Sprossen 7-19 auf
 * `tr-q` - bis zur Sprosse vor ⇧). Kopiert und angepasst aus dem Wächter des Piloten TR-T1
 * (`tastenflow-texte-tr-kids-frueh.test.ts`); für Erwachsene nach `tastenflow-texte-pl-erwachsene-frueh.test.ts`. Befund
 * `BEFUND-2026-10-02-TR-T3-ERWACHSENE-FRUEH.md`, Leitfaden Fallen 26/31/37/45/48/51/58/76/87-91.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET (kleinstes n, ab dem `fitText` sie mit `introOrder("tr").slice(0, n)`
 * durchlässt), nie aus einem Kommentar geglaubt. Jede Regel hat eine Gegenprobe: der Prüfer muss einen gebauten Fehler finden.
 *
 * Neu gegenüber TR-T1:
 *  · Erwachsene bekommen vor ⇧ NUR Kleinschrift (D-2, `umschalt: false`) - geprüft an der Auslieferung; Kinder bekommen keine
 *    Erwachsenenzeile.
 *  · Keine Zeile verrät das Geschlecht der Person, die tippt (kocam/karım, hamile, gelin/damat, eltim/bacanak, Bey/Hanım).
 *  · ★ Lehre aus PL-T3 §3c: Kopien, Paare und „fast gleich" werden gegen die ROHE Sammelliste `corpusTr.ts` (die
 *    Datenblätter, nach Objekt) geprüft - NICHT gegen das geladene `CORPUS_TR` aus corpus.ts, wo `mergeCorpus` eine wortgleiche
 *    Kopie schon still mit dem Original verschmolzen hat. Und jede Zeile muss eine EIGENE ID in den Anker bringen.
 *  · Ledger-Schlüssel (`bausteinKey`) kennt `ç ğ ı ş` nicht: geprüft in der Charge, gegen TR-T1 und gegen alle Korpora.
 *  · Das macOS-Wörterbuch kann für Türkisch nur ABLEHNEN (Falle 87; am 03.10.2026 lehnte es kein Wort dieser Charge ab, aber
 *    auch die Probe `kesemen` nicht) - jedes Wort, das nicht schon im Wortschatz stand, ist hier belegt: Grundform mit
 *    Begründung oder Stamm + Endung (Vokalharmonie und d/t-Angleichung nachgerechnet).
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout } from "../src/lib/typing/layouts";
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
  CORPUS_CS,
  CORPUS_TR,
} from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_TR as TR_ROH } from "../src/lib/typing/corpusTr";
import { CORPUS_TR_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusTrWegFruehKids";
import { CORPUS_TR_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusTrWegFruehTeens";
import { CORPUS_TR_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusTrWegFruehErwachsene";
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

const CHARGE = CORPUS_TR_WEG_FRUEH_ERWACHSENE;
const ZEILEN = CHARGE.map((i) => i.text);
/** Alle ANDEREN tr-Zeilen aus der ROHEN Sammelliste (TR-T1 und jede spätere Charge), nach Objekt - nie nach Text. */
const ANDERE_TR = () => TR_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_TR_ZEILEN = (): string[] => ANDERE_TR().map((i) => i.text);
const KINDER = CORPUS_TR_WEG_FRUEH_KIDS.map((i) => i.text);
/** Die erste Sprosse mit echten Wörtern: an 7 ist „a" der erste Vokal - davor nur Konsonanten. */
const ERSTE_SPROSSE = 7;
/** Die Charge reicht bis zur Sprosse vor ⇧ (Wächter unten: = `letzteSprosse()`). */
const GEBAUT_BIS = 19;
/**
 * Einheiten ohne Erwachsenenzeile an ihrer Sprosse (W6), mit Grund: an Sprosse 8 (`ş`) gibt es zu `f j d k s l a` nur
 * şal, şaka, şafak, kaş, aş, aşk, flaş - TR-T1 hat dort *ak şal, şal da al, şaka, şafakla kalk*; für Erwachsene entstand
 * nur Wortsalat oder eine Kinderzeile mit anderem Wort (Befund §2).
 */
const OHNE_ZEILE: ReadonlySet<string> = new Set(["ş"]);

/** Die Sprosse direkt vor ⇧ - aus der Reihenfolge gerechnet, nicht gezählt. */
function letzteSprosse(): number {
  setLayout("tr-q");
  return introOrder("tr").indexOf(SHIFT_UNIT);
}

/** Kleinste Sprosse, an der `fitText` den Text durchlässt (null: nie bis vor ⇧). */
function sprosseAuf(text: string): number | null {
  setLayout("tr-q");
  const o = introOrder("tr");
  const bis = o.indexOf(SHIFT_UNIT);
  for (let n = 1; n <= bis; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "tr"), "tr") !== null) return n;
  }
  return null;
}

describe("TR-T3: jede Zeile an ihrer Sprosse (tr-q)", () => {
  it("die Folge vor ⇧: 19 Einheiten, f j d k s l a ş · e i n m b r ı t y o u", () => {
    setLayout("tr-q");
    expect(introOrder("tr").slice(0, 19).join(" ")).toBe("f j d k s l a ş e i n m b r ı t y o u");
    expect(letzteSprosse()).toBe(GEBAUT_BIS);
  });

  it(`jede Zeile passt an einer Sprosse ${ERSTE_SPROSSE}-${GEBAUT_BIS}, nicht früher, und minTier stimmt`, () => {
    const fehler: string[] = [];
    for (const item of CHARGE) {
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

  it("Gegenprobe: Amtswörter mit Buchstaben nach ⇧ (ev, vergi, hastane, imza, ilaç, nüfus, randevu) passen nie; Sprossen stimmen", () => {
    for (const t of ["ev", "vergi dairesi", "hastane", "imza", "ilaç", "nüfus", "randevu", "kolay gelsin", "Ankara'da kal"]) {
      expect(sprosseAuf(t), t).toBeNull();
    }
    expect(sprosseAuf("kask al")).toBe(7);
    expect(sprosseAuf("kira bedeli")).toBe(14);
    expect(sprosseAuf("kiralık daire")).toBe(15);
    expect(sprosseAuf("kira yine arttı")).toBe(17);
    expect(sprosseAuf("medeni durum")).toBe(19);
  });

  it("vor Sprosse 7 gibt es keinen Vokal (keine echten Wörter)", () => {
    setLayout("tr-q");
    const vorher = introOrder("tr").slice(0, ERSTE_SPROSSE - 1);
    expect(vorher.filter((u) => "aeıioöuü".includes(u))).toEqual([]);
    expect(introOrder("tr")[ERSTE_SPROSSE - 1]).toBe("a");
  });

  /**
   * GEMESSEN nach dem Merge mit TR-T2 (vom Code gezählt, nicht geschätzt) - jede Grenze darf künftig nur STEIGEN. Wo sie
   * unter 6 liegt, geben die Buchstaben für Erwachsene nicht mehr her, ohne eine Zeile der Kinder oder Jugendlichen zu
   * wiederholen (Befund §2, §3c: 7 und 9 und 11 verloren je eine bzw. zwei Zeilen an TR-T2).
   */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    7: 2, 8: 0, 9: 1, 10: 6, 11: 4, 12: 7, 13: 6, 14: 12, 15: 16, 16: 26, 17: 21, 18: 29, 19: 34,
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

describe("TR-T3: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
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

  it("jede Einheit von a bis u (ausser ş, Befund §2) hat an ihrer Sprosse mindestens eine Erwachsenenzeile (W6)", () => {
    setLayout("tr-q");
    const o = introOrder("tr");
    const fehlt: string[] = [];
    for (let n = ERSTE_SPROSSE; n <= GEBAUT_BIS; n++) {
      if (OHNE_ZEILE.has(o[n - 1])) continue;
      const erlaubt = allowedFromIntroduced(o.slice(0, n), "tr");
      const treffer = ZEILEN.filter((t) => fitText(t, erlaubt, "tr") !== null && t.includes(o[n - 1]));
      if (treffer.length === 0) fehlt.push(`${n}:${o[n - 1]}`);
    }
    expect(fehlt, "Einheiten ohne Zeile").toEqual([]);
    // Die Ausnahme ist genau eine Einheit, und sie ist wirklich ohne Zeile (sonst gehört sie aus der Liste).
    expect([...OHNE_ZEILE]).toEqual(["ş"]);
    expect(ZEILEN.filter((t) => sprosseAuf(t) === 8)).toEqual([]);
  });

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet", () => {
    expect(ohneNeueEinheit([{ text: "kira bedeli", sprosse: 15 }])).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "kira bedeli", sprosse: 14 }])).toEqual([]);
  });

  it("die echte Runde (adaptiveRound, Erwachsene, Fokus t) bringt Zeilen dieser Charge - klein, nicht nur Wort-Drill", () => {
    setLayout("tr-q");
    const o = introOrder("tr");
    const intro = o.slice(0, o.indexOf("t") + 1);
    const echt = Math.random;
    let s = 1907;
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
        for (const z of adaptiveRound({ introduced: intro, focus: ["t"], stufe: "erwachsen", lang: "tr", lernweg: "tr", count: 12 })) {
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
    expect(texte.filter((t) => eigene.has(kleinFuer(t, "tr")) && t !== kleinFuer(t, "tr"))).toEqual([]);
  });
});

// ── Form: klein, nur gelernte Zeichen, keine Satzzeichen, Hausregeln ─────────

/** Vor ⇧: nur die 19 Buchstaben der Folge und einfache Leerzeichen. */
const ERLAUBTE_ZEICHEN = /^[fjdkslaşeinmbrıtyou ]+$/u;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) || t !== kleinFuer(t, "tr") || t !== t.trim() || t.includes("  ");

describe("TR-T3: vor ⇧ nur Kleinbuchstaben, keine Satzzeichen, Regeln des Weges", () => {
  it("jede Zeile ist klein geschrieben und besteht nur aus Buchstaben der Folge und einfachen Leerzeichen", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Grossbuchstabe (İ, I), Punkt, ç, ü, Apostroph, Bindestrich und doppeltes Leerzeichen werden gefunden", () => {
    for (const t of ["İkamet adresi", "Işık", "kira bedeli.", "ilaç", "nüfus", "ali'nin", "e-imza", "kira  bedeli"]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("kiralık daire")).toBe(false);
  });

  it("jede Zeile besteht die Regeln aller türkischen Zeilen (`helfer/trTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [erwachsen], nurWeg tr, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["erwachsen"]);
      expect(item.nurWeg, item.text).toBe("tr");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Geschlecht ───────────────────────────────────────────────────────────────

/**
 * Türkisch hat kein grammatisches Geschlecht (Glossar §1 Regel 2), aber Wörter tragen es: wer „kocam" (mein Mann) oder
 * „karım" (meine Frau) tippt, „hamileyim", „gelin", „damat", „eltim", „bacanak" - oder Bey/Hanım/abla als Anrede. Keine
 * Zeile legt so fest, wer tippt. Erlaubt sind die geschlechtslosen Wörter (eşim, kardeşim, torunum, annem, babam).
 */
const GESCHLECHT =
  /(?<![\p{L}])(?:koca\p{L}*|karım|karımla|karıma|karımı|hamile\p{L}*|gelin\p{L}*|damat\p{L}*|bey|beyefendi|hanım\p{L}*|abla|abi|eltim|bacanağ\p{L}*|bacanak|erkeğim|kadınım|anneyim|babayım)(?![\p{L}])/u;
const geschlechtFehler = (zeile: string): boolean => GESCHLECHT.test(zeile);

describe("TR-T3: keine Zeile legt das Geschlecht der tippenden Person fest", () => {
  it("kein Wort, das das Geschlecht der Person verrät, die tippt", () => {
    expect(ZEILEN.filter(geschlechtFehler)).toEqual([]);
  });

  it("Gegenprobe: „kocam işte“, „karım emekli“, „hamileyim“, „eltim aradı“ werden gefunden, „eşim emekli“, „kardeşim nişanlandı“ nicht", () => {
    for (const t of ["kocam işte", "karım emekli", "hamileyim", "eltim aradı", "ali bey"]) expect(geschlechtFehler(t), t).toBe(true);
    for (const t of ["eşim emekli", "kardeşim nişanlandı", "kira bedeli", "abide"]) expect(geschlechtFehler(t), t).toBe(false);
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
 * Neue GRUNDFORMEN dieser Charge - Wörter, die weder in `WORDS_TR`/`STUFE_VOCAB_TR` noch im Lexikon-Nachtrag standen (der
 * Nachtrag nimmt nur Formen mit mindestens zwei Tatoeba-Belegen; Wörter aus Amt, Arbeit und Wohnen fehlen dort oft). Jedes
 * ist ein gewöhnliches Wort der Standardsprache [G - eigenes Sprachwissen, NICHT an einer Quelle belegt; vom
 * macOS-Wörterbuch `tr:` am 03.10.2026 zweimal NICHT abgelehnt - das ist bei Türkisch kein Beweis, Falle 87]. Über den
 * Korpus kommen sie ins Vorlese-Lexikon (die Stimme spricht sie ganz). Einige stehen nur als Stamm einer Form unten.
 * ⚠️ Von keiner Person mit Türkisch als Erstsprache gelesen (Befund §4a).
 */
const NEUE_GRUNDFORMEN: Readonly<Record<string, string>> = {
  aidat: "Hausgeld einer Wohnanlage („site aidatı“) - nur als Stamm benutzt",
  akraba: "Verwandte(r) („yakın akraba“: Feld auf Formularen)",
  alerji: "Allergie („alerji testi“)",
  bordro: "Lohnabrechnung („maaş bordrosu“) - nur als Stamm benutzt",
  bulantı: "Übelkeit („mide bulantısı“) - nur als Stamm benutzt",
  dolma: "gefülltes Gemüse; „kuru dolma“ = mit getrockneten Auberginen/Paprika (Gaziantep)",
  duyuru: "Bekanntmachung, Aushang („resmi duyuru“)",
  ekle: "Befehlsform von „eklemek“ (hinzufügen; „dosya ekle“ = Datei anhängen) - „eklemek“ ist bekannt",
  ekşime: "Sauerwerden; „mide ekşimesi“ = Sodbrennen - nur als Stamm benutzt",
  esnek: "flexibel („esnek mesai“ = Gleitzeit)",
  kolesterol: "Cholesterin („kolesterol testi“)",
  kombi: "Kombi-Gastherme der Wohnung („kombi bakımı“ = jährliche Wartung)",
  kreş: "Kinderkrippe („belediye kreşi“) - nur als Stamm benutzt",
  kurulum: "Installation, Einrichtung („kolay kurulum“)",
  kırsal: "ländlich („kırsal kesim“ = Landbevölkerung)",
  makale: "Fachartikel („bilimsel makale“)",
  malik: "Eigentümer; „kat malikleri“ = die Wohnungseigentümer eines Hauses (Eigentümerversammlung) - nur als Stamm benutzt",
  sakla: "Befehlsform von „saklamak“ (aufbewahren: „fişi sakla“)",
  sera: "Gewächshaus („serada domates“, Antalya) - nur als Stamm benutzt",
  soyadı: "Familienname, TDK zusammengeschrieben („adı soyadı“: Kopf jedes Formulars)",
  stajyer: "Praktikant/in (ohne Geschlecht)",
  taksit: "Rate („altı taksit“: Ratenkauf mit Karte, in der Türkei alltäglich)",
  takibi: "Akkusativ/Besitz von „takip“ (bekannt) mit Erweichung p ⇒ b vor Vokal („tansiyon takibi“) - als Ganzes belegt, weil Stamm + Endung hier nicht aufgeht",
  teslimat: "Lieferung („teslimat saati“)",
  tutanak: "Protokoll einer Behörde, Unfallbericht („tutanak tutuldu“)",
  yarıyıl: "Halbjahr; „yarıyıl tatili“ = Semesterferien im Februar (Schulkalender MEB), TDK zusammengeschrieben",
};

/**
 * Neue Formen = bekannter Stamm + Endung. Der Stamm stand im Wortschatz (oder ist eine Grundform oben); die Endung ist
 * ausgeschrieben, damit der Wächter Vokalharmonie und d/t-Angleichung NACHRECHNEN kann (Puffer `n y s` gehören zur
 * Endung: „masa|sı“, „daire|ye“).
 */
const NEUE_FORMEN: Readonly<Record<string, readonly [string, string]>> = {
  lafa: ["laf", "a"], fişi: ["fiş", "i"], nefese: ["nefes", "e"],
  mesaisi: ["mesai", "si"], sıfırlama: ["sıfır", "lama"], malikleri: ["malik", "leri"], kaynakları: ["kaynak", "ları"],
  yedekleme: ["yedek", "leme"],
  ekşimesi: ["ekşime", "si"], bilmesin: ["bil", "mesin"], misafire: ["misafir", "e"], dairede: ["daire", "de"],
  nemli: ["nem", "li"], aidatı: ["aidat", "ı"], testi: ["test", "i"], kreşi: ["kreş", "i"], yatırımı: ["yatırım", "ı"],
  masası: ["masa", "sı"], onaylı: ["onay", "lı"], seferi: ["sefer", "i"],
  serada: ["sera", "da"], lambası: ["lamba", "sı"], dayanışması: ["dayanışma", "sı"],
  kuyrukta: ["kuyruk", "ta"], bordrosu: ["bordro", "su"], kesintisi: ["kesinti", "si"], dolmuşla: ["dolmuş", "la"],
  torunum: ["torun", "um"], tarlada: ["tarla", "da"], kışlık: ["kış", "lık"], tutarı: ["tutar", "ı"],
  dosyası: ["dosya", "sı"], bulantısı: ["bulantı", "sı"], yatırıldı: ["yatır", "ıldı"], ilanlarına: ["ilan", "larına"],
  taşındık: ["taşın", "dık"], nişanlandı: ["nişan", "landı"],
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
/** Nach einem Zahlwort steht die Einzahl (Glossar Regel 5): „altı taksit“, nie „altı taksitler“. */
function mehrzahlNachZahl(zeile: string): string[] {
  const w = zeile.split(" ");
  return w.filter((x, i) => i > 0 && ZAHLWOERTER.has(w[i - 1]) && /l[ae]r(?:ı|i|a|e|da|de|dan|den|ın|in)?$/u.test(x));
}

describe("TR-T3: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge (Wortbudget Erwachsene, F45)", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("★ Merge mit TR-T2: auch über Jugend (TR-T2) und Erwachsene (TR-T3) zusammen steht kein Inhaltswort in mehr als 8 Zeilen", () => {
    expect(CORPUS_TR_WEG_FRUEH_TEENS.length).toBeGreaterThan(0);
    const fehler = zuHaeufig([...ZEILEN, ...CORPUS_TR_WEG_FRUEH_TEENS.map((i) => i.text)]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet, ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `ile kira ${"abcdefghi"[i]}`);
    expect(zuHaeufig(neun)).toEqual(['"kira": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - Kern, Wortbasis, gefaltet (ı→i ş→s …) und kein unerwünschtes Themenwort", () => {
    const fehler = ZEILEN.flatMap((t) =>
      t.split(" ").filter((w) => gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w)).map((w) => `"${t}": ${w}`),
    );
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: sik (Kern), şık (gefaltet), mal (Wortbasis: Ware UND Schimpfwort), dava und sigara (unerwünscht) - kira, kask nicht", () => {
    expect(istKernGesperrtTr("sik")).toBe(true);
    expect(gesperrtGefaltetTr("şık")).toBe(true);
    expect(gesperrtGefaltetTr("mal")).toBe(true);
    expect(fuerWortlisteUngeeignetTr("dava")).toBe(true);
    expect(fuerWortlisteUngeeignetTr("sigara")).toBe(true);
    for (const w of ["kira", "kask", "maaş", "sıkıntı", "kesin"]) expect(fuerWortlisteUngeeignetTr(w), w).toBe(false);
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

  it("Gegenprobe: falsche Harmonie (kursı, dairede ✓/dairada ✗) und falsche Angleichung (kuyrukda, tarlata) werden gemeldet", () => {
    expect(endungFehler("kurs", "ı")).toHaveLength(1);
    expect(endungFehler("daire", "da")).toHaveLength(1);
    expect(endungFehler("daire", "de")).toEqual([]);
    expect(endungFehler("kuyruk", "da")).toHaveLength(1);
    expect(endungFehler("tarla", "ta")).toHaveLength(1);
    expect(endungFehler("nişan", "landı")).toEqual([]);
    expect(ungeprueft(["kira bedelı", "kirax bedeli"])).toEqual(["bedelı", "kirax"]);
  });

  it("nach einem Zahlwort steht die Einzahl", () => {
    const fehler = ZEILEN.flatMap((z) => mehrzahlNachZahl(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „altı taksitler“, „iki aileler“ werden gemeldet, „altı taksit“, „maaşlar yatırıldı“ nicht", () => {
    expect(mehrzahlNachZahl("altı taksitler")).toEqual(["taksitler"]);
    expect(mehrzahlNachZahl("iki aileler")).toEqual(["aileler"]);
    expect(mehrzahlNachZahl("altı taksit")).toEqual([]);
    expect(mehrzahlNachZahl("maaşlar yatırıldı")).toEqual([]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58: Anteil buchstabierter Zeilen = 0)", () => {
    const buchstabiert = ZEILEN.filter((z) => z.split(" ").some((w) => w.length >= 2 && !isRealWord(w, "tr")));
    expect(buchstabiert).toEqual([]);
  });
});

// ── Keine Kopien, keine Paare, nichts fast gleich, Ledger-Schlüssel, Anker ──

/** Person und Zahl gleichgesetzt: „ben de kal“/„sen de kal“ und „kira artışı“/„kiralar artışı“ sind ein Paar. */
function paarForm(zeile: string): string {
  const pron: Record<string, string> = { ben: "PRO", sen: "PRO", o: "PRO", biz: "PRO", siz: "PRO", onlar: "PRO" };
  return zeile
    .split(" ")
    .map((w) => pron[w] ?? w.replace(/l[ae]r$/u, ""))
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

const FREMDE_KORPORA = () => [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_CS];

describe("TR-T3: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der ç ğ ı ş nicht kennt)", () => {
    expect(new Set(ZEILEN).size).toBe(ZEILEN.length);
    const schluessel = ZEILEN.map((t) => bausteinKey("satz", t));
    expect(new Set(schluessel).size).toBe(ZEILEN.length);
  });

  it("Gegenprobe: „kaş al“/„kaç al“ teilen den Schlüssel, „kır kal“/„kar kal“ nicht", () => {
    expect(bausteinKey("satz", "kaş al")).toBe(bausteinKey("satz", "kaç al"));
    expect(bausteinKey("satz", "kır kal")).not.toBe(bausteinKey("satz", "kar kal"));
  });

  it("keine Zeile gleicht einer Zeile der Wege de/en/fr/es/it/pl/cs oder einer anderen tr-Charge (Text oder Ledger-Schlüssel)", () => {
    const fremd = [...FREMDE_KORPORA(), ...ANDERE_TR()];
    expect(fremd.length).toBeGreaterThan(1000);
    const texte = new Set(fremd.map((i) => kleinFuer(i.text, "tr").replace(/[.,!?;:"]/gu, "")));
    const schluessel = new Set(fremd.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CHARGE.filter((i) => texte.has(i.text) || schluessel.has(bausteinKey(i.kind, i.text))).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: eine TR-T1-Zeile wäre über die ROHE Liste erkannt, und „la sala“ (Weg it) ebenso", () => {
    const andere = new Set(ANDERE_TR().map((i) => bausteinKey(i.kind, i.text)));
    expect(andere.has(bausteinKey("satz", KINDER[0]))).toBe(true);
    const fremd = new Set(FREMDE_KORPORA().map((i) => bausteinKey(i.kind, i.text)));
    expect(fremd.has(bausteinKey("satz", "la sala"))).toBe(true);
  });

  it("keine Paare in der Charge und keines mit einer anderen tr-Zeile (nur Person oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN, ANDERE_TR_ZEILEN());
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ben/sen, Einzahl/Mehrzahl und eine Kinderzeile mit getauschter Zahl werden als Paar erkannt", () => {
    expect(paare(["ben de kal", "sen de kal"])).toHaveLength(1);
    expect(paare(["kira artışı", "kiralar artışı"])).toHaveLength(1);
    expect(paare(["iki kediler"], KINDER)).toHaveLength(1);
    expect(paare(["kira bedeli"], ["kayıt bedeli"])).toEqual([]);
  });
});

/**
 * Kopien und „fast gleich" auch gegen ALLES, was sonst Text trägt - alle Korpora, die rohe tr-Sammelliste, alle Serien
 * aller Sprachen und alle Prüfungstext-Banken (`schreibproben/texte*.ts`, auch die italienischen Sfida-Banken), Zeile für
 * Zeile und Satz für Satz (Muster TR-T1, Jaccard ≥ 0,6 wie Falle 51).
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
    ...FREMDE_KORPORA().map((i) => i.text),
    ...ANDERE_TR_ZEILEN(),
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

describe("TR-T3: keine Kopie und nichts fast gleich - gegen Korpora, Serien und Prüfungstext-Banken aller Sprachen", () => {
  it("die Vergleichsmenge ist voll (Serien und Banken geladen, auch pl/cs, TR-T1 und die it-Sfida)", () => {
    expect(Object.keys(BANKEN).some((p) => /It[AB]?\.ts$/.test(p))).toBe(true);
    expect(bankZeilen().length).toBeGreaterThan(1000);
    expect(SERIEN.length).toBeGreaterThan(100);
    expect(CORPUS_PL.length).toBeGreaterThan(0);
    expect(CORPUS_CS.length).toBeGreaterThan(0);
    expect(ANDERE_TR().length).toBeGreaterThanOrEqual(CORPUS_TR_WEG_FRUEH_KIDS.length);
  });

  it("keine Zeile gleicht einer fremden Zeile oder einem fremden Satz (ohne Satzzeichen, klein) oder ihrem Ledger-Schlüssel", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneZeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    const fehler = ZEILEN.filter((t) => texte.has(ohneZeichen(t)) || schluessel.has(bausteinKey("satz", t)));
    expect(fehler).toEqual([]);
  });

  it("nichts fast gleich - weder in der Charge noch gegen fremde oder andere tr-Zeilen (Wortmenge, Jaccard ≥ 0,6)", () => {
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

  it("Gegenprobe: eine Serienzeile, ein Banken-Satz und eine TR-T1-Zeile werden als Kopie, eine Umstellung als fast gleich erkannt", () => {
    const fremd = new Set(alleFremdenZeilen().map(ohneZeichen));
    expect(fremd.has(ohneZeichen(SERIEN[0].etappen[0].lines[0]))).toBe(true);
    expect(fremd.has(ohneZeichen(bankZeilen()[0].split(/(?<=[.!?])\s+/u)[0]))).toBe(true);
    expect(fremd.has("sinemada film")).toBe(true);
    // ★ Merge mit TR-T2: „kask al" stand in TR-T3 UND in TR-T2 - die rohe Liste trägt die Jugend-Charge mit (Befund §3c).
    expect(ANDERE_TR_ZEILEN()).toContain("kask al");
    expect(ZEILEN).not.toContain("kask al");
    expect(fastGleich(wortMenge("kira bedeli"), wortMenge("bedeli kira"))).toBe(true);
    // Beim Schreiben gemieden (Befund §4a): „dakika bekle“ neben TR-T1 „beş dakika bekle“.
    expect(fastGleich(wortMenge("dakika bekle"), wortMenge("beş dakika bekle"))).toBe(true);
    expect(fastGleich(wortMenge("kira bedeli"), wortMenge("kayıt bedeli"))).toBe(false);
  });
});

describe("TR-T3: Korpus-Anker und Auslieferung", () => {
  it("die rohe Sammelliste trägt die Charge HINTER TR-T1, und korpusFuer(\"tr\") jede Zeile (nichts still verschmolzen)", () => {
    const geladen = new Set(korpusFuer("tr").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
    expect(new Set(CORPUS_TR.map((i) => i.text)).size).toBeGreaterThanOrEqual(KINDER.length + ZEILEN.length);
    const start = TR_ROH.indexOf(CHARGE[0]);
    expect(start).toBeGreaterThan(TR_ROH.indexOf(CORPUS_TR_WEG_FRUEH_KIDS[CORPUS_TR_WEG_FRUEH_KIDS.length - 1]));
    expect(TR_ROH.slice(start, start + CHARGE.length)).toEqual(CHARGE);
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker (keine stille Verschmelzung mit einer anderen Zeile irgendeines Korpus)", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_TR()].map((i) => bausteinId(i.kind, i.text)));
    expect(CHARGE.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    expect(new Set(CHARGE.map((i) => bausteinId(i.kind, i.text))).size).toBe(CHARGE.length);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CHARGE.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "zzz probe tr t3", kind: "satz" as const, stufen: ["erwachsen" as const] };
    const ids = manifestFor([...FREMDE_KORPORA(), ...CORPUS_TR, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("Weg „tr“ bekommt vor ⇧ für Erwachsene (D-2, umschalt: false) alle Zeilen dieser Charge - nur eigene, nur Kleinschrift", () => {
    setLayout("tr-q");
    const o = introOrder("tr");
    const allowed = allowedFromIntroduced(o.slice(0, GEBAUT_BIS), "tr");
    const geliefert = corpusItemsFor({ stufe: "erwachsen", allowed, lang: "tr", lernweg: "tr", umschalt: false });
    expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
    const eigeneErwachsene = new Set(
      CORPUS_TR.filter((i) => i.nurWeg === "tr" && i.stufen.includes("erwachsen")).map((i) => i.text),
    );
    expect(geliefert.filter((t) => !eigeneErwachsene.has(t))).toEqual([]);
    expect(geliefert.filter(hatGrossbuchstaben)).toEqual([]);
  });

  it("Kinder auf Weg „tr“ bekommen keine Erwachsenenzeile", () => {
    setLayout("tr-q");
    const o = introOrder("tr");
    const kids = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(o.slice(0, GEBAUT_BIS), "tr"), lang: "tr", lernweg: "tr" });
    expect(ZEILEN.filter((t) => kids.includes(t) || kids.includes(kleinFuer(t, "tr")))).toEqual([]);
    const kidsKlein = new Set(kids.map((t) => kleinFuer(t, "tr")));
    expect(ZEILEN.filter((t) => kidsKlein.has(t))).toEqual([]);
  });

  it("Weg „de“ und Weg „it“ bekommen keine dieser Zeilen", () => {
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
