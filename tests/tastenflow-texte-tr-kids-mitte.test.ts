/**
 * ★★★ Wächter TR-T4 (09.10.2026): die mittleren tr-Texte für KINDER (`corpusTrWegMitteKids.ts`, Sprossen 20-37 auf `tr-q`
 * = ⇧ bis q). Aufbau aus den Wächtern TR-T1/TR-T3 (`tastenflow-texte-tr-kids-frueh`, `-erwachsene-frueh`), die Mitte-Teile
 * (⇧, Satzzeichen, Orte, Auslieferung an q) nach PL-T4 (`tastenflow-texte-pl-kids-mitte`). Befund
 * `BEFUND-2026-10-09-TR-T4-KIDS-MITTE.md`, Leitfaden Fallen 26/31/37/45/48/51/58/76/87-91.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET (kleinstes n, ab dem `fitText` sie mit `introOrder("tr").slice(0, n)`
 * durchlässt, mindestens ⇧), nie aus einem Kommentar geglaubt. Jede Regel hat eine Gegenprobe.
 *
 * Besonderheiten des Weges „tr" in der Mitte:
 *  · ⇧ gatet NICHTS: Grossbuchstaben sind immer tippbar (KERNREGEL corpus.ts), und vor ⇧ endet die Folge mit `u`. Eine
 *    Zeile aus Buchstaben bis `u` kommt also schon vor ⇧ an. Die ⇧-Zeilen tragen darum ein `u` (frühestens Sprosse 19, die
 *    letzte Runde vor ⇧) und einen Namen MITTEN im Satz; jede andere Zeile trägt einen Buchstaben ab `z`.
 *  · Der Apostroph (33) ist „hart" und steht nur zwischen Eigenname und Endung - die Endung wird hier nachgerechnet
 *    (Vokalharmonie, d/t-Angleichung: `Kars'ta`, `Hatay'da`, `Türkiye'nin`).
 *  · `^` (34) ist eine Totaste - eine Zeile „enthält" sie, wenn sie â î û trägt (`totastenZiele`).
 *  · Das macOS-Wörterbuch kann für Türkisch nur ABLEHNEN (Falle 87): jedes Wort, das nicht im Wortschatz oder in einer
 *    anderen tr-Charge stand, ist hier belegt (Grundform mit Begründung, Stamm + Endung, Ort, Name).
 *  · Lehre aus PL-T3 §3c: Kopien, Paare und „fast gleich" gegen die ROHE Sammelliste `corpusTr.ts` (nach Objekt).
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
  CORPUS_TR,
} from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_TR as TR_ROH } from "../src/lib/typing/corpusTr";
import { CORPUS_TR_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusTrWegFruehKids";
import { CORPUS_TR_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusTrWegFruehErwachsene";
import { CORPUS_TR_WEG_MITTE_KIDS } from "../src/lib/typing/corpusTrWegMitteKids";
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

const CHARGE = CORPUS_TR_WEG_MITTE_KIDS;
const ZEILEN = CHARGE.map((i) => i.text);
/** Alle ANDEREN tr-Zeilen aus der ROHEN Sammelliste (TR-T1, T2, T3 und jede spätere Charge), nach Objekt - nie nach Text. */
const ANDERE_TR = () => TR_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_TR_ZEILEN = (): string[] => ANDERE_TR().map((i) => i.text);
/** Die Chargen, die in der rohen Liste VOR dieser stehen (für „trägt die Beleg-Liste nur Nötiges?", TR-T3 §3c). */
const FRUEHERE_TR = () => TR_ROH.slice(0, TR_ROH.indexOf(CHARGE[0]));
const KINDER_T1 = CORPUS_TR_WEG_FRUEH_KIDS.map((i) => i.text);
/** Die letzte Buchstaben-Einheit der Charge (danach `? ! : " ; - ( )`, Ziffern …). */
const LETZTE = "q";
/** Satzzeichen nach ⇧ (D-1): weglassbar, darum ohne eigene Zeile. */
const WEGLASSBAR: ReadonlySet<string> = new Set([".", ","]);

function grenzen(): { shift: number; letzte: number; o: string[] } {
  setLayout("tr-q");
  const o = introOrder("tr");
  return { shift: o.indexOf(SHIFT_UNIT) + 1, letzte: o.indexOf(LETZTE) + 1, o };
}

/** Kleinste Sprosse, an der `fitText` den Text durchlässt (null: nie bis q). */
function buchstabenSprosse(text: string): number | null {
  const { letzte, o } = grenzen();
  for (let n = 1; n <= letzte; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "tr"), "tr") !== null) return n;
  }
  return null;
}

/** Die Sprosse der Zeile in dieser Charge: nie vor ⇧. */
function sprosseAuf(text: string): number | null {
  const s = buchstabenSprosse(text);
  return s === null ? null : Math.max(s, grenzen().shift);
}

/** Enthält der Text die Einheit? ⇧ = ein Grossbuchstabe NACH dem ersten Zeichen (Name mitten im Satz); `^` = â î û. */
function enthaeltEinheit(text: string, einheit: string): boolean {
  if (einheit === SHIFT_UNIT) return /\p{Lu}/u.test(text.slice(1));
  if (einheit === "^") return /[âîûÂÎÛ]/u.test(text);
  return kleinFuer(text, "tr").includes(einheit);
}

describe("TR-T4: jede Zeile an ihrer Sprosse (tr-q)", () => {
  it("die Folge 20-37: ⇧ . , z ç h g ğ ü v p c ö ' ^ w x q", () => {
    const { shift, letzte, o } = grenzen();
    expect(shift).toBe(20);
    expect(letzte).toBe(37);
    expect(o.slice(19, 37).join(" ")).toBe(`${SHIFT_UNIT} . , z ç h g ğ ü v p c ö ' ^ w x q`);
    expect(o[18]).toBe("u"); // vor ⇧ endet die Buchstabenfolge mit u
  });

  it("jede Zeile hat eine Sprosse von ⇧ bis q, und minTier stimmt", () => {
    const { shift, letzte } = grenzen();
    const fehler: string[] = [];
    for (const item of CHARGE) {
      const s = sprosseAuf(item.text);
      if (s === null || s < shift || s > letzte) fehler.push(`"${item.text}": Sprosse ${s}`);
      const tier = minTierFor(item.text, "tr");
      if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die Einträge stehen nach Sprosse sortiert", () => {
    const s = ZEILEN.map((t) => sprosseAuf(t) as number);
    expect(s).toEqual([...s].sort((a, b) => a - b));
  });

  /**
   * Keine Zeile rutscht in die frühen Runden von TR-T1: eine Zeile aus Buchstaben bis `u` käme über die
   * Auto-Grossschreibung schon VOR ⇧ an. Erlaubt ist das nur für die ⇧-Zeilen - frühestens an 19 (sie tragen ein `u`) und
   * nur mit einem Namen mitten im Satz.
   */
  it("keine Zeile kommt vor Sprosse 19 an; wer an 19 ankommt, ist eine ⇧-Zeile mit Namen mitten im Satz", () => {
    const fehler = ZEILEN.filter((t) => {
      const b = buchstabenSprosse(t) ?? 0;
      return b < 19 || (b === 19 && !enthaeltEinheit(t, SHIFT_UNIT));
    });
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Sprossen werden richtig gerechnet (⇧ gatet nichts, Apostroph hart, ^ als Totaste)", () => {
    expect(buchstabenSprosse("Elif ile Mert okula koştu.")).toBe(19);
    expect(sprosseAuf("Elif ile Mert okula koştu.")).toBe(20);
    expect(buchstabenSprosse("Annem Bitlisli, babam Aydınlı.")).toBe(17); // ohne u: käme in die frühen Runden
    expect(sprosseAuf("Bizim sınıfta otuz kişiyiz.")).toBe(23);
    expect(sprosseAuf("Hiçbir kelime ğ ile başlamaz.")).toBe(27);
    expect(sprosseAuf("İzmir'de simide gevrek denir.")).toBe(33);
    expect(sprosseAuf("İzmir de simide gevrek denir.")).toBe(29); // ohne Apostroph schon an v (gevrek) - darum hart
    expect(sprosseAuf("Kardeşim hâlâ uyuyor.")).toBe(34);
    expect(sprosseAuf("Komşunun köpeğinin adı Max.")).toBe(36);
    expect(sprosseAuf("Q klavyenin ilk harfi q.")).toBe(37);
    // ? und ! kommen erst nach q - vorher lässt `fitText` sie weg; die Form-Regel unten hält sie aus dieser Charge.
    expect(sprosseAuf("Elif okula koştu mu?")).toBe(20);
  });

  /** GEMESSEN am Ende von TR-T4 (vom Code gezählt) - jede Grenze darf künftig nur STEIGEN. */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    20: 12, 23: 14, 24: 14, 25: 13, 26: 14, 27: 16, 28: 17, 29: 23, 30: 33, 31: 24, 32: 41, 33: 44, 34: 11, 35: 5, 36: 5, 37: 5,
  };

  it("je Sprosse mindestens so viele Zeilen wie gemessen (. und , ohne eigene Zeile)", () => {
    const { shift, letzte, o } = grenzen();
    const anzahl = new Map<number, number>();
    for (const t of ZEILEN) {
      const s = sprosseAuf(t);
      if (s !== null) anzahl.set(s, (anzahl.get(s) ?? 0) + 1);
    }
    const zuWenig: string[] = [];
    for (let n = shift; n <= letzte; n++) {
      if (WEGLASSBAR.has(o[n - 1])) {
        if (anzahl.has(n)) zuWenig.push(`Sprosse ${n} (${o[n - 1]}) ist weglassbar und trägt doch Zeilen`);
        continue;
      }
      const soll = MINDESTENS_JE_SPROSSE[n] ?? 5;
      if ((anzahl.get(n) ?? 0) < soll) zuWenig.push(`Sprosse ${n} (${o[n - 1]}): ${anzahl.get(n) ?? 0} < ${soll}`);
    }
    expect(zuWenig, zuWenig.join("\n")).toEqual([]);
  });
});

describe("TR-T4: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
  function ohneNeueEinheit(zeilen: { text: string; sprosse: number }[]): string[] {
    const { o } = grenzen();
    return zeilen
      .filter((z) => !enthaeltEinheit(z.text, o[z.sprosse - 1]))
      .map((z) => `"${z.text}" (Sprosse ${z.sprosse}, ${o[z.sprosse - 1]})`);
  }

  it("jede Zeile enthält die Einheit ihrer (gerechneten) Sprosse", () => {
    const fehler = ohneNeueEinheit(ZEILEN.map((text) => ({ text, sprosse: sprosseAuf(text) ?? 0 })));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede Einheit von ⇧ bis q (ausser . und ,) hat an ihrer Sprosse Zeilen (W6)", () => {
    const { shift, letzte, o } = grenzen();
    const fehlt: string[] = [];
    for (let n = shift; n <= letzte; n++) {
      if (WEGLASSBAR.has(o[n - 1])) continue;
      if (!ZEILEN.some((t) => sprosseAuf(t) === n && enthaeltEinheit(t, o[n - 1]))) fehlt.push(`${n}:${o[n - 1]}`);
    }
    expect(fehlt, "Einheiten ohne Zeile").toEqual([]);
  });

  it("Gegenprobe: falsch eingeordnet wird gemeldet; ⇧ heisst Name mitten im Satz, ^ heisst â î û", () => {
    expect(enthaeltEinheit("Elif ile Mert okula koştu.", SHIFT_UNIT)).toBe(true);
    expect(enthaeltEinheit("Elif okula koştu.", SHIFT_UNIT)).toBe(false); // nur die Auto-Grossschreibung am Anfang
    expect(enthaeltEinheit("Kâğıttan gemi yaptık.", "^")).toBe(true);
    expect(enthaeltEinheit("Kağıttan gemi yaptık.", "^")).toBe(false);
    expect(ohneNeueEinheit([{ text: "Gemi limandan ayrıldı.", sprosse: 27 }])).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "Gemi limandan ayrıldı.", sprosse: 26 }])).toEqual([]);
  });

  it("die echte Runde (adaptiveRound, Kinder, Fokus ç) bringt Zeilen dieser Charge mit ç", () => {
    const { o } = grenzen();
    const intro = o.slice(0, o.indexOf("ç") + 1);
    const echt = Math.random;
    let s = 2410;
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
        for (const z of adaptiveRound({ introduced: intro, focus: ["ç"], stufe: "kids", lang: "tr", lernweg: "tr", count: 12 })) {
          texte.push(z.text);
        }
      }
    } finally {
      Math.random = echt;
    }
    const erlaubt = allowedFromIntroduced(intro, "tr");
    const eigene = new Set(ZEILEN.flatMap((t) => [t, fitText(t, erlaubt, "tr") ?? t]));
    expect(texte.some((t) => eigene.has(t) && t.includes("ç")), texte.slice(0, 12).join(" / ")).toBe(true);
  });
});

// ── Form: Satzanfang gross, nur Punkt und Komma, Apostroph nur am Namen, Regeln des Weges ──

const ERLAUBTE_ZEICHEN = /^[A-Za-zÇĞİÖŞÜçğıöşüâîû' ,.]+$/u;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) || !/^\p{Lu}/u.test(t) || t !== t.trim() || t.includes("  ") || /[,.]\S/u.test(t) || /\s[,.]/u.test(t) || !t.endsWith(".");

/** Feste und Feiertage (Auftrag: keine Feiertage, kein Bayram) - Wortanfänge, `İ`-sicher (Falle 89). */
const FEST = /(?<![\p{L}])(?:bayram|ramazan|kurban|kandil|nevruz|hıdrellez|cumhuriyet|yılbaşı|anıtkabir|atatürk)/iu;

describe("TR-T4: Form und Regeln aller tr-Zeilen", () => {
  it("jede Zeile beginnt gross, endet mit Punkt und besteht nur aus Buchstaben, Apostroph, Punkt, Komma, einfachen Leerzeichen", () => {
    expect(ZEILEN.filter(formFehler)).toEqual([]);
  });

  it("Gegenprobe: klein am Anfang, ? ! : ; \" -, Komma ohne Leerzeichen, Leerzeichen vor Komma, ohne Punkt", () => {
    for (const t of ["elif okula koştu.", "Geldin mi?", "Yaşasın!", "Not: yarın.", "Evet; hayır.", 'Dedi ki "gel".', "Ak-şam.", "Elif,Mert.", "Elif , Mert.", "Elif okula koştu"]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("İzmir'de simide gevrek denir.")).toBe(false);
  });

  it("mindestens 30 Zeilen tragen ein Komma (gemessen 36)", () => {
    expect(ZEILEN.filter((t) => t.includes(",")).length).toBeGreaterThanOrEqual(30);
  });

  it("jede Zeile besteht die Regeln aller türkischen Zeilen (`helfer/trTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("kein Fest, kein Feiertag, kein Staatssymbol", () => {
    expect(ZEILEN.filter((t) => FEST.test(t))).toEqual([]);
  });

  it("Gegenprobe: Bayram, Ramazan, Nevruz, Anıtkabir werden gefunden - auch gross am Anfang -, „Kurbağalar“ ist ein Fest-Treffer und darum in keiner Zeile", () => {
    for (const t of ["Bayramda dedeme gittik.", "Ramazan geldi.", "Nevruzda ateş yaktık.", "Ankara'da Anıtkabir'i gezdik."]) {
      expect(FEST.test(t), t).toBe(true);
    }
    expect(FEST.test("Bahçede kayısı topladık.")).toBe(false);
    // `kurban` ist ein Wortanfang - „kurbağa“ trifft nicht (kurb-a ≠ kurb-an).
    expect(FEST.test("Göl kıyısında kurbağalar ötüyor.")).toBe(false);
  });

  it("jeder Eintrag: kind satz, stufen [kids], nurWeg tr, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["kids"]);
      expect(item.nurWeg, item.text).toBe("tr");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Orte, Namen, Apostroph ──────────────────────────────────────────────────

type Region = "MAR" | "EGE" | "AKD" | "IC" | "KAR" | "DOG" | "GDO" | "AUS";
/**
 * Jeder Ort der Charge mit seiner Region (amtliche sieben Regionen der Türkei; AUS = Kıbrıs und die Verwandtschaft in
 * Berlin). [G] - Sachangaben aus eigenem Wissen. Edremit liegt in der Provinz Balıkesir (amtlich Marmara), an der
 * Ägäisküste, und steht wegen der Olive als EGE; Dilek Yarımadası liegt in Aydın (EGE).
 */
const ORTE: Readonly<Record<string, Region>> = {
  istanbul: "MAR", galata: "MAR", bursa: "MAR", edirne: "MAR", çanakkale: "MAR", uludağ: "MAR",
  izmir: "EGE", bodrum: "EGE", edremit: "EGE", datça: "EGE", muğla: "EGE", fethiye: "EGE", dalyan: "EGE",
  pamukkale: "EGE", denizli: "EGE", çeşme: "EGE", aydın: "EGE", ege: "EGE", dilek: "EGE",
  antalya: "AKD", hatay: "AKD", maraş: "AKD", mersin: "AKD", adana: "AKD",
  ankara: "IC", konya: "IC", kayseri: "IC", erciyes: "IC", kapadokya: "IC", eskişehir: "IC", sivas: "IC", kızılırmak: "IC",
  rize: "KAR", artvin: "KAR", trabzon: "KAR", uzungöl: "KAR", giresun: "KAR", samsun: "KAR", sinop: "KAR",
  karadeniz: "KAR", amasya: "KAR", safranbolu: "KAR", çorum: "KAR",
  erzurum: "DOG", kars: "DOG", van: "DOG", ağrı: "DOG", malatya: "DOG", hakkâri: "DOG", bitlis: "DOG",
  gaziantep: "GDO", kilis: "GDO", mardin: "GDO", diyarbakır: "GDO", birecik: "GDO", nemrut: "GDO",
  berlin: "AUS", kıbrıs: "AUS",
};
/** Vornamen der Kinder und Familien - heutige Namen aus der ganzen Türkei, auch kurdische (Rojda) und neue (Ecrin, Asel). */
const NAMEN: ReadonlySet<string> = new Set(
  (
    "elif mert duru asel kerem selim yasin esra nur rojda melis irem kaan tuna defne ada emir ela asya rana berk nil " +
    "nazlı deniz nehir zeynep ayşe ecrin sevgi ozan nisa"
  ).split(" "),
);
/** Teile von Eigennamen, die mitten im Satz gross stehen (Galata Kulesi, Ağrı Dağı, Van Gölü, Doğu Ekspresi, Millî Parkı). */
const NAMENSTEILE: ReadonlySet<string> = new Set(["kulesi", "dağı", "gölü", "doğu", "ekspresi", "yarımadası", "millî", "parkı", "kız"]);
/**
 * Andere Eigennamen und Zeichen, die gross stehen: das Land, die Sprachen, Figuren (Karagöz und Hacivat - Schattenspiel aus
 * Bursa; Pepee - Zeichentrickserie für Kleinkinder), Haustiernamen, die Brailleschrift, die Buchstaben selbst (`I`, `İ`, `Q`, `F`).
 */
const SONSTIGE_NAMEN: ReadonlySet<string> = new Set(
  "türkiye türk türkçe almanca ingilizce kürtçe karagöz hacivat pepee max felix braille ı i q f".split(" "),
);
const istEigenname = (w: string) => w in ORTE || NAMEN.has(w) || NAMENSTEILE.has(w) || SONSTIGE_NAMEN.has(w);

/** Die Wörter einer Zeile (klein, `İ`-sicher), Apostroph-Formen als Ganzes. */
const woerterKlein = (zeile: string): string[] => kleinFuer(zeile, "tr").split(/[\s,.]+/u).filter(Boolean);

/** Grossgeschriebene Wörter, die weder am Satzanfang stehen noch ein bekannter Eigenname (+ Endung) sind. */
function unbekannteGrosse(zeile: string): string[] {
  const w = zeile.split(/[\s,.]+/u).filter(Boolean);
  return w
    .filter((x, i) => i > 0 && /^\p{Lu}/u.test(x))
    .filter((x) => !istEigennameOderAbleitung(kleinFuer(x.split("'")[0], "tr")));
}

/** Ein Eigenname oder seine Ableitung (`Mardinli`, `Bursalıyım` = Ort + Endung, in {@link NEUE_FORMEN}). */
function istEigennameOderAbleitung(w: string): boolean {
  if (istEigenname(w)) return true;
  const form = NEUE_FORMEN[w];
  return form !== undefined && istEigenname(form[0]);
}

/** Regionen einer Zeile: Orte direkt, mit Endung (`İzmir'de`) oder als Ableitung (`Mardinli`, `Bursalıyım`). */
function regionenDerZeile(zeile: string): Set<Region> {
  const out = new Set<Region>();
  for (const w of woerterKlein(zeile)) {
    const basis = w.split("'")[0];
    if (basis in ORTE) out.add(ORTE[basis]);
    const form = NEUE_FORMEN[basis];
    if (form && form[0] in ORTE) out.add(ORTE[form[0]]);
  }
  return out;
}

describe("TR-T4: Orte aus der ganzen Türkei, Eigennamen, Apostroph nur am Namen", () => {
  it("jedes grossgeschriebene Wort mitten im Satz ist ein bekannter Ort, Name, Namensteil oder Zeichen", () => {
    const fehler = ZEILEN.flatMap((t) => unbekannteGrosse(t).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /** GEMESSEN: Zeilen je Region (eine Zeile kann zwei Regionen tragen). */
  it("alle sieben Regionen kommen vor (je mindestens 7 Zeilen), keine steht in mehr als 15 Zeilen, mindestens 70 Zeilen verortet (gemessen 71: MAR 9, EGE 14, AKD 8, IC 10, KAR 14, DOG 11, GDO 7, AUS 2)", () => {
    const zahl = new Map<Region, number>();
    let verortet = 0;
    for (const t of ZEILEN) {
      const r = regionenDerZeile(t);
      if (r.size > 0) verortet++;
      for (const x of r) zahl.set(x, (zahl.get(x) ?? 0) + 1);
    }
    const bericht = [...zahl].map(([r, n]) => `${r} ${n}`).join(", ");
    for (const r of ["MAR", "EGE", "AKD", "IC", "KAR", "DOG", "GDO"] as const) expect(zahl.get(r) ?? 0, `${r} - ${bericht}`).toBeGreaterThanOrEqual(7);
    expect([...zahl.values()].every((n) => n <= 15), bericht).toBe(true);
    expect(verortet, bericht).toBeGreaterThanOrEqual(70);
  });

  it("Gegenprobe: ein unbekannter Ort wird gemeldet, ein Satzanfang nicht; Ableitungen und Endungen zählen zur Region", () => {
    expect(unbekannteGrosse("Annem Atlantis'te doğdu.")).toEqual(["Atlantis'te"]);
    expect(unbekannteGrosse("Kızlar parkta.")).toEqual([]);
    expect([...regionenDerZeile("Babam Mardinli, annem Rizeli.")].sort()).toEqual(["GDO", "KAR"]);
    expect([...regionenDerZeile("Kars'ta kazlar karda yürür.")]).toEqual(["DOG"]);
  });

  it("jeder Apostroph steht zwischen einem Eigennamen und seiner Endung - Vokalharmonie und d/t-Angleichung stimmen", () => {
    const fehler: string[] = [];
    for (const t of ZEILEN) {
      for (const w of woerterKlein(t).filter((x) => x.includes("'"))) {
        const [name, endung] = w.split("'");
        if (!istEigenname(name)) fehler.push(`"${t}": ${w} - kein Eigenname`);
        for (const f of endungFehler(name, endung)) fehler.push(`"${t}": ${w} - ${f}`);
      }
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(ZEILEN.filter((t) => t.includes("'")).length).toBeGreaterThanOrEqual(44);
  });

  it("Gegenprobe: İzmir'da (Harmonie), Kars'da (Angleichung), Türkiye'nın und ein Gattungswort mit Apostroph werden gemeldet", () => {
    expect(endungFehler("izmir", "da")).toHaveLength(1);
    expect(endungFehler("kars", "da")).toHaveLength(1);
    expect(endungFehler("türkiye", "nın")).toHaveLength(1);
    expect(endungFehler("kars", "ta")).toEqual([]);
    expect(endungFehler("hakkâri", "nin")).toEqual([]);
    expect(istEigenname("okul")).toBe(false);
  });
});

// ── Wortschatz: Wortgrenze 8, Sperrliste, Belege, Endungen, Zahlwörter ──────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht (Nachwörter, Pronomen, Partikeln, var/yok). */
const FUNKTIONSWOERTER = new Set(
  (
    "bir bu şu o ben sen biz siz onlar bana sana beni seni benim senin bize ile da de ki mi mı mu mü ne en ama ya " +
    "kadar gibi için daha çok her hiç tam yine ve var yok değil"
  ).split(" "),
);

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    for (const w of new Set(woerterKlein(z))) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

const BASIS: ReadonlySet<string> = new Set(
  [...WORDS_TR, ...Object.values(STUFE_VOCAB_TR).flat(), ...NACHTRAG_TR, ...NACHTRAG_TR_ERGAENZT].map((w) => normalizeWord(w, "tr")),
);
const woerterOhneZeichen = (z: string) => kleinFuer(z, "tr").split(/[^\p{L}]+/u).filter(Boolean);
/** Bekannt = Wortschatz oder ein Wort einer ANDEREN tr-Charge (dort belegt). */
const BEKANNT: ReadonlySet<string> = new Set([...BASIS, ...ANDERE_TR_ZEILEN().flatMap(woerterOhneZeichen)]);
/** Früher bekannt = Wortschatz oder ein Wort einer Charge VOR dieser - eine spätere Charge macht keinen Beleg überflüssig. */
const FRUEHER_BEKANNT: ReadonlySet<string> = new Set([...BASIS, ...FRUEHERE_TR().map((i) => i.text).flatMap(woerterOhneZeichen)]);

/**
 * Neue GRUNDFORMEN dieser Charge - Wörter, die weder im Wortschatz noch in einer früheren tr-Charge standen (der
 * Lexikon-Nachtrag nimmt nur Formen mit mindestens zwei Tatoeba-Belegen; Küchen-, Spiel- und Ortswörter fehlen dort oft).
 * [G] - eigenes Sprachwissen, NICHT an einer Quelle belegt; vom macOS-Wörterbuch `tr:` am 09.10.2026 zweimal NICHT
 * abgelehnt (abgelehnt wurden nur klein geschriebene Namen, Orte und englische Wörter) - bei Türkisch kein Beweis
 * (Falle 87). Einige stehen nur als Stamm einer Form unten. ⚠️ Von keiner Person mit Türkisch als Erstsprache gelesen.
 */
const NEUE_GRUNDFORMEN: Readonly<Record<string, string>> = {
  aquapark: "Wasserpark, im Türkischen so geschrieben (Antalya) - nur als Stamm („aquaparka“)",
  avlu: "Innenhof („avluda tavuklar“) - nur als Stamm",
  ayva: "Quitte („ayva tatlısı“, Dessert mit Kaymak)",
  bembeyaz: "schneeweiss (Verstärkung bem- von beyaz)",
  bowling: "Bowling, so übernommen („bowling salonu“)",
  caretta: "Meeresschildkröte Caretta caretta (Dalyan, İztuzu) - im Türkischen der übliche Name",
  ceylan: "Gazelle („ceylan gibi koşmak“ = flink rennen)",
  cezerye: "Möhren-Konfekt aus Mersin",
  çarpma: "Multiplikation („çarpma işareti“)",
  çırp: "Stamm von çırpmak (klatschen: „el çırparak“) - nur als Stamm",
  dolunay: "Vollmond",
  doğrarken: "„beim Schneiden“: doğra (Stamm von doğramak) + Aorist -r + -ken; -ken ist unveränderlich und folgt keiner Harmonie - darum als Ganzes belegt",
  ekspres: "Expresszug („Doğu Ekspresi“ Ankara - Kars) - nur als Stamm",
  es: "Stamm von esmek (wehen: „rüzgâr esince“) - nur als Stamm",
  ezme: "Paste; „badem ezmesi“ = Mandelpaste aus Edirne - nur als Stamm",
  gevrek: "in İzmir das Wort für Simit",
  göm: "Stamm von gömmek (vergraben) - nur als Stamm",
  hamsi: "Sardelle des Schwarzen Meeres",
  havla: "Stamm von havlamak (bellen) - nur als Stamm",
  hellim: "Halloumi-Käse aus Zypern",
  imbat: "der Seewind am Nachmittag an der Ägäis (İzmir)",
  kâse: "Schale, TDK mit â",
  kefal: "Meeräsche; „inci kefali“ = die Fischart des Van-Sees - nur als Stamm",
  kelaynak: "Waldrapp, lebt in Birecik",
  kemençe: "Kniegeige des Schwarzmeergebiets",
  kumbara: "Spardose - nur als Stamm",
  kumpir: "gefüllte Ofenkartoffel (İstanbul, Ortaköy) - nur als Stamm",
  künefe: "Käse-Dessert aus Hatay",
  kızar: "Stamm von kızarmak (rot werden, reifen) - nur als Stamm",
  kıpkırmızı: "knallrot (Verstärkung kıp- von kırmızı) - nur als Stamm",
  mandalina: "Mandarine",
  mangala: "Brettspiel mit Steinen und Mulden, in türkischen Schulen gespielt (nicht „mangal“ = Grill)",
  otlat: "Stamm von otlatmak (weiden lassen) - nur als Stamm",
  paraşüt: "Fallschirm; „yamaç paraşütü“ = Gleitschirm (Fethiye) - nur als Stamm",
  peri: "Fee; „peri bacaları“ = Feenkamine in Kappadokien",
  pişi: "in Fett ausgebackener Hefeteig zum Frühstück",
  queen: "englisches Wort aus dem Englischunterricht (Inhalt der Zeile: „queen kelimesini öğrendik“)",
  sac: "gewölbtes Backblech über dem Feuer für Gözleme (nicht „saç“ = Haar) - nur als Stamm",
  sahan: "kleine Pfanne; „sahanda yumurta“ = Spiegelei - nur als Stamm",
  saklambaç: "Versteckspiel",
  sofra: "gedeckter Tisch - nur als Stamm",
  şalgam: "Rübensaft aus Adana und Mersin (ohne Alkohol)",
  tanış: "Stamm von tanışmak (sich kennenlernen) - nur als Stamm",
  tepsi: "Blech, Tablett („börek tepsisi“) - nur als Stamm",
  tiftik: "Mohair, die Wolle der Ankaraziege - nur als Stamm („tiftiği“)",
  traktör: "Traktor",
  traverten: "Kalksinterterrasse (Pamukkale) - nur als Stamm",
  uyut: "Stamm von uyutmak (in den Schlaf wiegen) - nur als Stamm",
  waffle: "Waffel, im Türkischen so geschrieben (beliebt als „waffle“ mit Obst)",
  yenge: "Tante (Frau des Onkels) - nur als Stamm",
  yetiş: "Stamm von yetişmek (wachsen, gedeihen) - nur als Stamm",
  öt: "Stamm von ötmek (singen, quaken, krähen) - nur als Stamm",
  ör: "Stamm von örmek (stricken: „ördüğü kazak“) - nur als Stamm",
  şive: "Mundart, Tonfall einer Gegend („Karadeniz şivesi“) - nur als Stamm",
};

/**
 * Neue Formen = bekannter Stamm + Endung. Der Stamm stand im Wortschatz, in einer anderen tr-Charge, ist eine Grundform
 * oben oder ein Ort. Mit drittem Eintrag: der Stamm ist die ERWEICHTE Form dieses Wortes (p ⇒ b, ç ⇒ c, t ⇒ d, k ⇒ ğ vor
 * einem Vokal: ağaç ⇒ ağacı, kebap ⇒ kebabı). Die Endung ist ausgeschrieben, damit Vokalharmonie und d/t-Angleichung
 * NACHGERECHNET werden (Puffer `n y s` gehören zur Endung). Ein angehängtes „-ki“ (bahçedeki) ist unveränderlich.
 */
const NEUE_FORMEN: Readonly<Record<string, readonly [string, string] | readonly [string, string, string]>> = {
  acıktım: ["acıktı", "m"], ahşaptır: ["ahşap", "tır"], ailece: ["aile", "ce"], anneannemin: ["anneannem", "in"],
  aquaparka: ["aquapark", "a"], arkadaşımıza: ["arkadaş", "ımıza"], atkını: ["atkı", "nı"], avluda: ["avlu", "da"],
  aydınlı: ["aydın", "lı"], ağabeyim: ["ağabey", "im"], ağabeyimden: ["ağabey", "imden"], ağacının: ["ağac", "ının", "ağaç"],
  ağaçta: ["ağaç", "ta"], ağaçtaki: ["ağaç", "taki"], babaannemle: ["babaannem", "le"], bacaları: ["baca", "ları"],
  bahçedeki: ["bahçe", "deki"], balkondaki: ["balkon", "daki"], balkonu: ["balkon", "u"], balonları: ["balon", "ları"],
  balıkçı: ["balık", "çı"], bağında: ["bağ", "ında"], başlamaz: ["başla", "maz"], bilgisayarda: ["bilgisayar", "da"],
  bilinmeyen: ["bilin", "meyen"], biriktirdim: ["biriktirdi", "m"], bitirip: ["bitir", "ip"], bitlisli: ["bitlis", "li"],
  boyadı: ["boya", "dı"], boyalarımı: ["boya", "larımı"], bulutlara: ["bulutlar", "a"], buluşur: ["buluş", "ur"],
  bursalıyım: ["bursa", "lıyım"], buzdolabında: ["buzdolabı", "nda"], böreği: ["böreğ", "i", "börek"], bıraktık: ["bıraktı", "k"],
  camlarını: ["cam", "larını"], cetvelimi: ["cetvel", "imi"], dağları: ["dağlar", "ı"], dağıdır: ["dağı", "dır"],
  dedeme: ["dedem", "e"], dedemlerin: ["dedem", "lerin"], defterlerimi: ["defter", "lerimi"], dereye: ["dere", "ye"],
  dersinde: ["ders", "inde"], dinledik: ["dinledi", "k"], dizimi: ["diz", "imi"], dolmasını: ["dolma", "sını"],
  dondu: ["don", "du"], dondurması: ["dondurma", "sı"], ekspresi: ["ekspres", "i"], esince: ["es", "ince"],
  evimizin: ["ev", "imizin"], ezmesi: ["ezme", "si"], fotoğraflarımız: ["fotoğraf", "larımız"], gagasıyla: ["gaga", "sıyla"],
  gemide: ["gemi", "de"], gezegenleri: ["gezegen", "leri"], geziye: ["gezi", "ye"], giriyoruz: ["giriyor", "uz"],
  gitarımın: ["gitar", "ımın"], gökkuşağının: ["gökkuşağı", "nın"], gölü: ["göl", "ü"], gömüyor: ["göm", "üyor"],
  harfi: ["harf", "i"], harfinin: ["harf", "inin"], haritada: ["harita", "da"], havladı: ["havla", "dı"],
  heceleri: ["hece", "leri"], heykeller: ["heykel", "ler"], hırkamı: ["hırka", "mı"], indim: ["indi", "m"],
  ineklerini: ["inek", "lerini"], içeriz: ["iç", "eriz"], kahvaltısını: ["kahvaltı", "sını"], kaleler: ["kale", "ler"],
  kamerasıyla: ["kamera", "sıyla"], kangalı: ["kangal", "ı"], kantinden: ["kantin", "den"], kaplumbağalarını: ["kaplumbağa", "larını"],
  kapısında: ["kapı", "sında"], kardeşimiz: ["kardeş", "imiz"], kardeşimle: ["kardeşim", "le"], karpuzları: ["karpuz", "ları"],
  kazlar: ["kaz", "lar"], kebabın: ["kebab", "ın", "kebap"], kedileri: ["kedi", "leri"], kedilerinin: ["kedi", "lerinin"],
  kedisinin: ["kedi", "sinin"], kefali: ["kefal", "i"], kesilir: ["kes", "ilir"], kesiyor: ["kes", "iyor"],
  kestirdim: ["kes", "tirdim"], keçisinin: ["keçi", "sinin"], kirazlar: ["kiraz", "lar"], klavyede: ["klavye", "de"],
  komşumuz: ["komşu", "muz"], komşumuza: ["komşu", "muza"], koyduk: ["koydu", "k"], koyunlarını: ["koyun", "larını"],
  koştuk: ["koştu", "k"], kumbaramda: ["kumbara", "mda"], kumpirin: ["kumpir", "in"], kurallarını: ["kural", "larını"],
  kurbağalar: ["kurbağa", "lar"], kutladık: ["kutladı", "k"], kuzenim: ["kuzen", "im"], kuzenimin: ["kuzen", "imin"],
  kuzenlerim: ["kuzen", "lerim"], kâğıttan: ["kâğıt", "tan"], köpeğimiz: ["köpeğ", "imiz", "köpek"],
  köpeğinin: ["köpeğ", "inin", "köpek"], küçücüktür: ["küçücük", "tür"], küçüğüm: ["küçüğ", "üm", "küçük"],
  kıpkırmızıdır: ["kıpkırmızı", "dır"], kızardı: ["kızar", "dı"], lahmacunun: ["lahmacun", "un"], leblebisi: ["leblebi", "si"],
  leylekler: ["leylek", "ler"], limandan: ["liman", "dan"], liseye: ["lise", "ye"], mantısı: ["mantı", "sı"],
  mardinli: ["mardin", "li"], martılar: ["martı", "lar"], martılara: ["martı", "lara"], mevsiminde: ["mevsim", "inde"],
  nehridir: ["nehri", "dir"], ninem: ["nine", "m"], noktalı: ["nokta", "lı"], noktasız: ["nokta", "sız"],
  nöbetçi: ["nöbet", "çi"], okulumuzun: ["okul", "umuzun"], ormanında: ["orman", "ında"], otlatıyor: ["otlat", "ıyor"],
  oturduk: ["oturdu", "k"], ovada: ["ova", "da"], ovasında: ["ova", "sında"], oynarız: ["oynar", "ız"],
  paraşütleri: ["paraşüt", "leri"], parka: ["park", "a"], parmaklarımla: ["parmak", "larımla"], pastası: ["pasta", "sı"],
  piknikte: ["piknik", "te"], renktedir: ["renk", "tedir"], reçeli: ["reçel", "i"], rizeli: ["rize", "li"],
  sacda: ["sac", "da"], sahanda: ["sahan", "da"], sahilinde: ["sahil", "inde"], salladık: ["salladı", "k"],
  salıncağa: ["salıncağ", "a", "salıncak"], sarıdır: ["sarı", "dır"], saydık: ["saydı", "k"], sayıyoruz: ["sayıyor", "uz"],
  sağdık: ["sağ", "dık"], sergimiz: ["sergi", "miz"], sevilir: ["sev", "ilir"], silgisini: ["silgi", "sini"],
  simide: ["simid", "e", "simit"], simidi: ["simid", "i", "simit"], simitçi: ["simit", "çi"], sitesinde: ["site", "sinde"],
  sofraya: ["sofra", "ya"], sulamayı: ["sulama", "yı"], sürüyü: ["sürü", "yü"], sınıfça: ["sınıf", "ça"],
  tahtayı: ["tahta", "yı"], tanıştı: ["tanış", "tı"], tarlaları: ["tarla", "ları"], tasarımı: ["tasarım", "ı"],
  tatlısıdır: ["tatlı", "sıdır"], tatlısının: ["tatlı", "sının"], tavuklar: ["tavuk", "lar"], teli: ["tel", "i"],
  tepesine: ["tepe", "sine"], tepsisi: ["tepsi", "si"], teyzem: ["teyze", "m"], teyzemle: ["teyze", "mle"],
  tiftiği: ["tiftiğ", "i", "tiftik"], topladık: ["topladı", "k"], travertenleri: ["traverten", "leri"], tuttuk: ["tuttu", "k"],
  tuttum: ["tuttu", "m"], tırtıldan: ["tırtıl", "dan"], uyumunu: ["uyum", "unu"], uyuttu: ["uyut", "tu"],
  uçurduk: ["uç", "urduk"], uçurtmamın: ["uçurtma", "mın"], uçurtmamız: ["uçurtma", "mız"], vapurda: ["vapur", "da"],
  vapurla: ["vapur", "la"], vapurlara: ["vapur", "lara"], yakalayamadım: ["yakalayamadı", "m"], yamaçlardadır: ["yamaç", "lardadır"],
  yaprağın: ["yaprağ", "ın", "yaprak"], yarımadası: ["yarımada", "sı"], yarışmasına: ["yarışma", "sına"],
  yarışmasını: ["yarışma", "sını"], yastıklardan: ["yastık", "lardan"], yatacağım: ["yatacağ", "ım", "yatacak"],
  yengem: ["yenge", "m"], yetişiyor: ["yetiş", "iyor"], yorulduk: ["yoruldu", "k"], yoğurmak: ["yoğur", "mak"],
  yürüdük: ["yürüdü", "k"], yürürüz: ["yürür", "üz"], yürüyüşünde: ["yürüyüş", "ünde"], yüzdük: ["yüzdü", "k"],
  zeytini: ["zeytin", "i"], zeytinli: ["zeytin", "li"], çarşıdan: ["çarşı", "dan"], çatıda: ["çatı", "da"],
  çekirdeğe: ["çekirdeğ", "e", "çekirdek"], çikolatalıydı: ["çikolata", "lıydı"], çizmelerimi: ["çizme", "lerimi"],
  çırparak: ["çırp", "arak"], ördüğü: ["ör", "düğü"], ötüyor: ["öt", "üyor"], öğretecek: ["öğret", "ecek"],
  ünsüz: ["ün", "süz"], üstündedir: ["üstünde", "dir"], şemsiyeni: ["şemsiye", "ni"], şivesiyle: ["şive", "siyle"],
};

const HINTEN = new Set(["a", "ı", "o", "u", "â", "û"]);
const VOKALE = new Set(["a", "e", "ı", "i", "o", "ö", "u", "ü", "â", "î", "û"]);
const STIMMLOS = new Set(["ç", "f", "h", "k", "p", "s", "ş", "t"]);
/**
 * Lehnwörter mit hinterem Vokal, die HELLE Endungen nehmen (TDK, Ausnahmen der großen Vokalharmonie: harf ⇒ harfi, kefal ⇒
 * kefali - wie saat ⇒ saati, hal ⇒ hali). Nur, was die Charge braucht.
 */
const HELLE_ENDUNG: ReadonlySet<string> = new Set(["harf", "kefal"]);
/** Erweichung vor einem Vokal: p ⇒ b, ç ⇒ c, t ⇒ d, k ⇒ ğ (nach n: g). */
function erweicht(wort: string): string {
  const z = wort[wort.length - 1];
  const vor = wort[wort.length - 2];
  const neu = z === "p" ? "b" : z === "ç" ? "c" : z === "t" ? "d" : z === "k" ? (vor === "n" ? "g" : "ğ") : z;
  return wort.slice(0, -1) + neu;
}

/**
 * Fehler einer Endung gegen die Vokalharmonie (zweifach a/e, vierfach ı/i/u/ü; das `o` von „-yor“ ist fest) und gegen die
 * Angleichung des Anlauts (-da/-ta, -dan/-tan, -dı/-tı: `t` nach stimmlosem Laut ç f h k p s ş t). Ein angehängtes „-ki“
 * (bahçedeki, ağaçtaki) ist unveränderlich und wird nicht geprüft. `â î û` gelten als a i u (Hakkâri ⇒ -nin).
 */
function endungFehler(stamm: string, endungRoh: string): string[] {
  const fehler: string[] = [];
  const endung = endungRoh.endsWith("ki") && endungRoh.length > 2 ? endungRoh.slice(0, -2) : endungRoh;
  let vorher = HELLE_ENDUNG.has(stamm) ? "e" : [...stamm].reverse().find((z) => VOKALE.has(z));
  if (vorher === "î") vorher = "i";
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
        : vorher === "a" || vorher === "ı" || vorher === "â" ? "ı" : vorher === "e" || vorher === "i" ? "i" : vorher === "o" || vorher === "u" || vorher === "û" ? "u" : "ü";
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

/** Ist ein Wort (klein, ohne Apostroph) belegt? */
const belegt = (w: string): boolean =>
  w.length < 2 || BEKANNT.has(w) || w in NEUE_GRUNDFORMEN || w in NEUE_FORMEN || istEigenname(w);

/** Wörter (ohne Apostroph-Formen, die prüft der Namen-Test), die weder bekannt noch belegt sind. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) for (const w of woerterKlein(z)) if (!w.includes("'") && !belegt(w)) out.add(w);
  return [...out];
}

const ZAHLWOERTER = new Set("bir iki üç dört beş altı yedi sekiz dokuz on yirmi otuz kırk elli yüz bin".split(" "));
/** Nach einem Zahlwort steht die Einzahl (Glossar Regel 5): „iki serçe“, nie „iki serçeler“. */
function mehrzahlNachZahl(zeile: string): string[] {
  const w = woerterKlein(zeile);
  return w.filter((x, i) => i > 0 && ZAHLWOERTER.has(w[i - 1]) && /l[ae]r(?:ı|i|a|e|da|de|dan|den|ın|in)?$/u.test(x));
}

describe("TR-T4: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("★ Wortbudget Kinder: auch über TR-T1 + TR-T4 zusammen steht kein Inhaltswort in mehr als 8 Zeilen", () => {
    expect(KINDER_T1.length).toBeGreaterThan(100);
    const fehler = zuHaeufig([...ZEILEN, ...KINDER_T1]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross und mit Punkt), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Kedi" : "kedi"} ve ${"abcdefghi"[i]}.`);
    expect(zuHaeufig(neun)).toEqual(['"kedi": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - Kern, Wortbasis, gefaltet (ı→i ş→s …) und kein unerwünschtes Themenwort", () => {
    const fehler = ZEILEN.flatMap((t) =>
      woerterOhneZeichen(t).filter((w) => gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w)).map((w) => `"${t}": ${w}`),
    );
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: sik (Kern), ordu (Militär - darum fehlt die Stadt Ordu), sigara und savaş - fındık, kangal, sıcak nicht", () => {
    expect(istKernGesperrtTr("sik")).toBe(true);
    expect(gesperrtGefaltetTr("ordu") || fuerWortlisteUngeeignetTr("ordu")).toBe(true);
    expect(fuerWortlisteUngeeignetTr("sigara") || gesperrtGefaltetTr("sigara")).toBe(true);
    expect(fuerWortlisteUngeeignetTr("savaşı") || gesperrtGefaltetTr("savaşı")).toBe(true);
    for (const w of ["fındık", "kangal", "sıcak"]) expect(gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w), w).toBe(false);
  });

  it("jedes Wort ist bekannt (Wortschatz, andere tr-Charge) oder belegt (Grundform, Form, Ort, Name)", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
  });

  it("die Beleg-Listen tragen nur, was gebraucht wird und nicht schon VORHER bekannt war (sonst wachsen sie still)", () => {
    const benutzt = new Set(ZEILEN.flatMap((z) => woerterKlein(z).flatMap((w) => w.split("'"))));
    const staemme = new Set(Object.values(NEUE_FORMEN).flatMap((f) => [f[0], f[2] ?? f[0]]));
    expect(Object.keys(NEUE_FORMEN).filter((w) => !benutzt.has(w) || FRUEHER_BEKANNT.has(w))).toEqual([]);
    expect(Object.keys(NEUE_GRUNDFORMEN).filter((w) => (!benutzt.has(w) && !staemme.has(w)) || FRUEHER_BEKANNT.has(w))).toEqual([]);
    expect(Object.keys(ORTE).filter((w) => !benutzt.has(w) && !staemme.has(w))).toEqual([]);
    expect([...NAMEN, ...NAMENSTEILE, ...SONSTIGE_NAMEN].filter((w) => !benutzt.has(w))).toEqual([]);
  });

  it("jede neue Form = Stamm + Endung; der Stamm ist bekannt (oder erweicht aus einem bekannten Wort); Harmonie und Angleichung stimmen", () => {
    const fehler: string[] = [];
    for (const [wort, [stamm, endung, grund]] of Object.entries(NEUE_FORMEN) as [string, readonly string[]][]) {
      if (stamm + endung !== wort) fehler.push(`${wort}: ${stamm} + ${endung} ergibt ${stamm + endung}`);
      const basis = grund ?? stamm;
      if (grund !== undefined && erweicht(grund) !== stamm) fehler.push(`${wort}: ${grund} erweicht nicht zu ${stamm}`);
      if (!BEKANNT.has(basis) && !(basis in NEUE_GRUNDFORMEN) && !istEigenname(basis)) fehler.push(`${wort}: Stamm „${basis}“ unbekannt`);
      for (const f of endungFehler(stamm, endung)) fehler.push(`${wort}: ${f}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: falsche Harmonie, falsche Angleichung, falsche Erweichung; -ki unveränderlich; ein erfundenes Wort", () => {
    expect(endungFehler("ders", "ında")).toHaveLength(1);
    expect(endungFehler("harf", "ı")).toHaveLength(1); // Ausnahme mit hellen Endungen: harfi, nie harfı
    expect(endungFehler("harf", "i")).toEqual([]);
    expect(endungFehler("ağaç", "da")).toHaveLength(1);
    expect(endungFehler("tarla", "ta")).toHaveLength(1);
    expect(endungFehler("balkon", "daki")).toEqual([]);
    expect(endungFehler("balkon", "deki")).toHaveLength(1);
    expect(erweicht("ağaç")).toBe("ağac");
    expect(erweicht("köpek")).toBe("köpeğ");
    expect(erweicht("renk")).toBe("reng");
    expect(erweicht("kebap")).toBe("kebab");
    expect(ungeprueft(["Kumsalda küçük bir yengeç bulduk.", "Kumsalda küçük bir yengeçç bulduk."])).toEqual(["yengeçç"]);
  });

  it("nach einem Zahlwort steht die Einzahl", () => {
    const fehler = ZEILEN.flatMap((z) => mehrzahlNachZahl(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „iki serçeler“, „Dört kediler.“ werden gemeldet, „iki serçe“ und „kediler dört“ nicht", () => {
    expect(mehrzahlNachZahl("Çatıda iki serçeler oturuyor.")).toEqual(["serçeler"]);
    expect(mehrzahlNachZahl("Dört kediler.")).toEqual(["kediler"]);
    expect(mehrzahlNachZahl("Çatıda iki serçe oturuyor.")).toEqual([]);
    expect(mehrzahlNachZahl("Kediler dört.")).toEqual([]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58)", () => {
    const buchstabiert = ZEILEN.filter((z) =>
      z.split(/[\s,.]+/u).some((w) => w.length >= 2 && !isRealWord(w, "tr")),
    );
    expect(buchstabiert).toEqual([]);
  });
});

// ── Keine Kopien, keine Paare, nichts fast gleich, Ledger-Schlüssel ─────────

/** Person und Zahl gleichgesetzt: „Ben de geldim“/„Sen de geldin“-Paare und Einzahl/Mehrzahl. */
function paarForm(zeile: string): string {
  const pron: Record<string, string> = { ben: "PRO", sen: "PRO", o: "PRO", biz: "PRO", siz: "PRO", onlar: "PRO" };
  return woerterKlein(zeile)
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

describe("TR-T4: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der ç ğ ı ş nicht kennt)", () => {
    expect(new Set(ZEILEN).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("Gegenprobe: „Kaş al.“/„Kaç al.“ teilen den Schlüssel", () => {
    expect(bausteinKey("satz", "Kaş al.")).toBe(bausteinKey("satz", "Kaç al."));
  });

  it("keine Zeile gleicht einer Zeile der Wege de/en/fr/es/it/pl/cs oder einer anderen tr-Charge (Text oder Schlüssel)", () => {
    const fremd = [...FREMDE_KORPORA(), ...ANDERE_TR()];
    expect(fremd.length).toBeGreaterThan(1000);
    const ohne = (t: string) => kleinFuer(t, "tr").replace(/[.,!?;:"]/gu, "");
    const texte = new Set(fremd.map((i) => ohne(i.text)));
    const schluessel = new Set(fremd.map((i) => bausteinKey(i.kind, i.text)));
    expect(CHARGE.filter((i) => texte.has(ohne(i.text)) || schluessel.has(bausteinKey(i.kind, i.text))).map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine TR-T1-Zeile ist über die ROHE Liste erkannt, die Charge selbst nicht", () => {
    const andere = new Set(ANDERE_TR().map((i) => bausteinKey(i.kind, i.text)));
    expect(andere.has(bausteinKey("satz", KINDER_T1[0]))).toBe(true);
    expect(andere.has(bausteinKey("satz", ZEILEN[0]))).toBe(false);
    expect(ANDERE_TR().length).toBe(TR_ROH.length - CHARGE.length);
  });

  it("keine Paare in der Charge und keines mit einer anderen tr-Zeile (nur Person oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN, ANDERE_TR_ZEILEN());
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ben/sen und Einzahl/Mehrzahl werden als Paar erkannt", () => {
    expect(paare(["Ben de geldim.", "Sen de geldim."])).toHaveLength(1);
    expect(paare(["Kazlar karda yürür."], ["Kaz karda yürür."])).toHaveLength(1);
    expect(paare(["Kars'ta kazlar karda yürür."], ["Kazlar karda yürür."])).toEqual([]);
  });
});

/**
 * Kopien und „fast gleich" gegen ALLES, was sonst Text trägt - alle Korpora, die rohe tr-Sammelliste, alle Serien aller
 * Sprachen und alle Prüfungstext-Banken (`schreibproben/texte*.ts`), Zeile für Zeile und Satz für Satz (Jaccard ≥ 0,6).
 */
const BANKEN = import.meta.glob("../src/lib/typing/schreibproben/texte*.ts", { eager: true }) as Record<string, Record<string, unknown>>;
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
function fastGleich(a: Set<string>, b: Set<string>): boolean {
  let s = 0;
  for (const x of a) if (b.has(x)) s++;
  return s / (a.size + b.size - s) >= 0.6;
}

describe("TR-T4: keine Kopie und nichts fast gleich - gegen Korpora, Serien und Prüfungstext-Banken aller Sprachen", () => {
  it("die Vergleichsmenge ist voll (Serien und Banken geladen, pl/cs, TR-T1 bis TR-T3)", () => {
    expect(bankZeilen().length).toBeGreaterThan(1000);
    expect(SERIEN.length).toBeGreaterThan(100);
    expect(CORPUS_PL.length).toBeGreaterThan(0);
    expect(CORPUS_CS.length).toBeGreaterThan(0);
    expect(ANDERE_TR().length).toBeGreaterThanOrEqual(KINDER_T1.length + CORPUS_TR_WEG_FRUEH_ERWACHSENE.length);
  });

  it("keine Zeile gleicht einer fremden Zeile oder einem fremden Satz (ohne Satzzeichen, klein) oder ihrem Ledger-Schlüssel", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneZeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    expect(ZEILEN.filter((t) => texte.has(ohneZeichen(t)) || schluessel.has(bausteinKey("satz", t)))).toEqual([]);
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

  it("Gegenprobe: Serienzeile, Banken-Satz, TR-T1-Zeile als Kopie, eine Umstellung als fast gleich; beim Schreiben gemieden", () => {
    const fremd = new Set(alleFremdenZeilen().map(ohneZeichen));
    expect(fremd.has(ohneZeichen(SERIEN[0].etappen[0].lines[0]))).toBe(true);
    expect(fremd.has(ohneZeichen(bankZeilen()[0].split(/(?<=[.!?])\s+/u)[0]))).toBe(true);
    expect(fremd.has("sinemada film")).toBe(true);
    expect(fastGleich(wortMenge("Çınar ağacının altında oturduk."), wortMenge("Ceviz ağacının altında oturduk."))).toBe(true);
    expect(fastGleich(wortMenge("Kars'ta kazlar karda yürür."), wortMenge("Kazlar karda yürür."))).toBe(true);
    expect(fastGleich(wortMenge("Gemi limandan ayrıldı."), wortMenge("tekne limanda"))).toBe(false);
  });
});

describe("TR-T4: Korpus-Anker und Auslieferung", () => {
  it("die rohe Sammelliste trägt die Charge als geschlossenen Block HINTER TR-T3, und korpusFuer(\"tr\") jede Zeile", () => {
    const start = TR_ROH.indexOf(CHARGE[0]);
    expect(start).toBeGreaterThan(TR_ROH.indexOf(CORPUS_TR_WEG_FRUEH_ERWACHSENE[CORPUS_TR_WEG_FRUEH_ERWACHSENE.length - 1]));
    expect(TR_ROH.slice(start, start + CHARGE.length)).toEqual(CHARGE);
    const geladen = new Set(korpusFuer("tr").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker (keine stille Verschmelzung mit einer Zeile irgendeines Korpus)", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_TR()].map((i) => bausteinId(i.kind, i.text)));
    expect(CHARGE.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    expect(new Set(CHARGE.map((i) => bausteinId(i.kind, i.text))).size).toBe(CHARGE.length);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    expect(CHARGE.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "Zzz probe tr t4.", kind: "satz" as const, stufen: ["kids" as const] };
    const ids = manifestFor([...FREMDE_KORPORA(), ...CORPUS_TR, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("Weg „tr“ bekommt an Sprosse q jede Zeile dieser Charge - und nur eigene tr-Kinderzeilen", () => {
    const { letzte, o } = grenzen();
    const allowed = allowedFromIntroduced(o.slice(0, letzte), "tr");
    const geliefert = corpusItemsFor({ stufe: "kids", allowed, lang: "tr", lernweg: "tr" });
    expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
    const eigeneKinder = new Set(
      CORPUS_TR.filter((i) => i.nurWeg === "tr" && i.stufen.includes("kids")).flatMap((i) => [i.text, fitText(i.text, allowed, "tr") ?? i.text]),
    );
    expect(geliefert.filter((t) => !eigeneKinder.has(t) && !eigeneKinder.has(kleinFuer(t, "tr")))).toEqual([]);
  });

  it("vor ⇧ (Sprosse 19) kommen aus dieser Charge NUR die ⇧-Zeilen an (ohne Punkt und Komma) - keine mit z bis q", () => {
    const { o } = grenzen();
    const allowed = allowedFromIntroduced(o.slice(0, 19), "tr");
    const geliefert = new Set(corpusItemsFor({ stufe: "kids", allowed, lang: "tr", lernweg: "tr" }));
    const hier = ZEILEN.filter((t) => geliefert.has(fitText(t, allowed, "tr") ?? ""));
    expect(hier.length).toBeGreaterThanOrEqual(12);
    expect(hier.filter((t) => sprosseAuf(t) !== 20)).toEqual([]);
    expect([...geliefert].filter((t) => /[zçhgğüvpcöwxq'âîû]/iu.test(t))).toEqual([]);
  });

  it("Jugendliche und Erwachsene auf Weg „tr“ bekommen keine Zeile dieser Charge", () => {
    const { letzte, o } = grenzen();
    const allowed = allowedFromIntroduced(o.slice(0, letzte), "tr");
    for (const stufe of ["teens", "erwachsen"] as const) {
      const geliefert = corpusItemsFor({ stufe, allowed, lang: "tr", lernweg: "tr" });
      expect(ZEILEN.filter((t) => geliefert.includes(t)), stufe).toEqual([]);
    }
  });

  it("Weg „de“ und Weg „it“ bekommen keine dieser Zeilen", () => {
    setLayout("de");
    const de = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(introOrder("de"), "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const it_ = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(introOrder("it"), "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
