/**
 * ★★★ Wächter TR-T5 (09.10.2026): die mittleren tr-Texte für JUGENDLICHE (`corpusTrWegMitteTeens.ts`, Sprossen 20-37 auf
 * `tr-q` = ⇧ bis q). Aufbau aus den Wächtern TR-T2 (`tastenflow-texte-tr-teens-frueh`) und TR-T4 (Kinder Mitte, Zweig
 * `tr-t4-kids-mitte` - parallel entstanden, nur die Form übernommen). Befund `BEFUND-2026-10-09-TR-T5-TEENS-MITTE.md`,
 * Leitfaden Fallen 26/31/37/45/48/51/58/76/87-91.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET (kleinstes n, ab dem `fitText` sie mit `introOrder("tr").slice(0, n)`
 * durchlässt, mindestens ⇧), nie aus einem Kommentar geglaubt. Jede Regel hat eine Gegenprobe.
 *
 * Besonderheiten des Weges „tr" in der Mitte:
 *  · ⇧ gatet NICHTS: Grossbuchstaben sind immer tippbar (KERNREGEL corpus.ts), und vor ⇧ endet die Folge mit `u`. Eine
 *    Zeile aus Buchstaben bis `u` kommt also schon vor ⇧ an. Die ⇧-Zeilen tragen darum ein `u` (frühestens Sprosse 19, die
 *    letzte Runde vor ⇧) und einen Namen MITTEN im Satz; jede andere Zeile trägt einen Buchstaben ab `z`.
 *  · Der Apostroph (33) ist „hart" und steht nur zwischen Eigenname und Endung - die Endung wird hier nachgerechnet
 *    (Vokalharmonie, d/t-Angleichung: `Kars'ta`, `Gaziantep'te`, `Umut'un`).
 *  · `^` (34) ist eine Totaste - eine Zeile „enthält" sie, wenn sie â î û trägt (`totastenZiele`).
 *  · Das macOS-Wörterbuch kann für Türkisch nur ABLEHNEN (Falle 87): jedes Wort, das nicht im Wortschatz oder in einer
 *    anderen tr-Charge stand, ist hier belegt (Grundform mit Begründung, Stamm + Endung, Ort, Name).
 *  · Lehre aus PL-T3 §3c: Kopien, Paare und „fast gleich" gegen die ROHE Sammelliste `corpusTr.ts` (nach Objekt).
 *  · Wortbudget der Jugend über ALLE tr-Jugendzeilen (TR-T2 + TR-T5, später TR-T8), höchstens 8 je Inhaltswort.
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
import { CORPUS_TR_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusTrWegFruehTeens";
import { CORPUS_TR_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusTrWegFruehErwachsene";
import { CORPUS_TR_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusTrWegFruehKids";
import { CORPUS_TR_WEG_MITTE_TEENS } from "../src/lib/typing/corpusTrWegMitteTeens";
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

const CHARGE = CORPUS_TR_WEG_MITTE_TEENS;
const ZEILEN = CHARGE.map((i) => i.text);
/** Alle ANDEREN tr-Zeilen aus der ROHEN Sammelliste (TR-T1 bis T4 und jede spätere Charge), nach Objekt - nie nach Text. */
const ANDERE_TR = () => TR_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_TR_ZEILEN = (): string[] => ANDERE_TR().map((i) => i.text);
/** Die Chargen, die in der rohen Liste VOR dieser stehen (für „trägt die Beleg-Liste nur Nötiges?", TR-T3 §3c). */
const FRUEHERE_TR = () => TR_ROH.slice(0, TR_ROH.indexOf(CHARGE[0]));
/** Alle ANDEREN tr-Jugendzeilen (TR-T2, später TR-T8) - für das Wortbudget der Stufe. */
const JUGEND_ANDERE = () => ANDERE_TR().filter((i) => i.stufen.includes("teens")).map((i) => i.text);
const JUGEND_T2 = CORPUS_TR_WEG_FRUEH_TEENS.map((i) => i.text);
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

describe("TR-T5: jede Zeile an ihrer Sprosse (tr-q)", () => {
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
   * Keine Zeile rutscht in die frühen Runden von TR-T2: eine Zeile aus Buchstaben bis `u` käme über die
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
    expect(buchstabenSprosse("Arda ile Buse robot takımında.")).toBe(19);
    expect(sprosseAuf("Arda ile Buse robot takımında.")).toBe(20);
    // Beim Schreiben verworfen: ohne `u` käme die Zeile schon an Sprosse 16 in die frühen Runden.
    expect(buchstabenSprosse("Sena ile Alara artık dans takımında.")).toBe(16);
    expect(sprosseAuf("Bizi kimse anlamıyor diye şarkı yazdık.")).toBe(23);
    expect(sprosseAuf("Kars kalesinden şehre baktık.")).toBe(25);
    expect(sprosseAuf("Bodrum'da yaz boyunca garsonluk yaptım.")).toBe(33);
    expect(sprosseAuf("Bodrum da garsonluk yaptım.")).toBe(30); // ohne Apostroph schon an p - darum hart
    expect(sprosseAuf("Hâlâ ödevimi bitiremedim.")).toBe(34);
    expect(sprosseAuf("Hala ödevimi bitiremedim.")).toBe(32);
    expect(sprosseAuf("Grafikte x eksenini çizmeyi unuttum.")).toBe(36);
    expect(sprosseAuf("Fizik dersinde sürpriz quiz oldu.")).toBe(37);
    // ? und ! kommen erst nach q - vorher lässt `fitText` sie weg; die Form-Regel unten hält sie aus dieser Charge.
    expect(sprosseAuf("Arda ile Buse robot takımında mı?")).toBe(20);
  });

  /** GEMESSEN am Ende von TR-T5 (vom Code gezählt) - jede Grenze darf künftig nur STEIGEN. */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    20: 14, 23: 16, 24: 11, 25: 15, 26: 13, 27: 12, 28: 18, 29: 20, 30: 35, 31: 28, 32: 46, 33: 54, 34: 15, 35: 6, 36: 6, 37: 5,
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

describe("TR-T5: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
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
    expect(enthaeltEinheit("Arda ile Buse robot takımında.", SHIFT_UNIT)).toBe(true);
    expect(enthaeltEinheit("Arda robot takımında.", SHIFT_UNIT)).toBe(false); // nur die Auto-Grossschreibung am Anfang
    expect(enthaeltEinheit("Yapay zekâ ödevi benim yerime yapmaz.", "^")).toBe(true);
    expect(enthaeltEinheit("Yapay zeka ödevi benim yerime yapmaz.", "^")).toBe(false);
    expect(ohneNeueEinheit([{ text: "Yağmur yağdı, maç ertelendi.", sprosse: 28 }])).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "Yağmur yağdı, maç ertelendi.", sprosse: 27 }])).toEqual([]);
  });

  it("die echte Runde (adaptiveRound, Jugendliche, Fokus ç) bringt Zeilen dieser Charge mit ç - und keine Kinderzeile", () => {
    const { o } = grenzen();
    const intro = o.slice(0, o.indexOf("ç") + 1);
    const echt = Math.random;
    let s = 2510;
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
        for (const z of adaptiveRound({ introduced: intro, focus: ["ç"], stufe: "teens", lang: "tr", lernweg: "tr", count: 12 })) {
          texte.push(z.text);
        }
      }
    } finally {
      Math.random = echt;
    }
    const erlaubt = allowedFromIntroduced(intro, "tr");
    const eigene = new Set(ZEILEN.flatMap((t) => [t, fitText(t, erlaubt, "tr") ?? t]));
    expect(texte.some((t) => eigene.has(t) && t.includes("ç")), texte.slice(0, 12).join(" / ")).toBe(true);
    const kinder = new Set(CORPUS_TR_WEG_FRUEH_KIDS.flatMap((i) => [i.text, fitText(i.text, erlaubt, "tr") ?? i.text]));
    expect(texte.filter((t) => kinder.has(t))).toEqual([]);
  });
});

// ── Form: Satzanfang gross, nur Punkt und Komma, Apostroph nur am Namen, Regeln des Weges ──

const ERLAUBTE_ZEICHEN = /^[A-Za-zÇĞİÖŞÜçğıöşüâîû' ,.]+$/u;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) || !/^\p{Lu}/u.test(t) || t !== t.trim() || t.includes("  ") || /[,.]\S/u.test(t) || /\s[,.]/u.test(t) || !t.endsWith(".");

/** Feste und Feiertage (Auftrag: keine Feiertage, kein Bayram) - Wortanfänge, `İ`-sicher (Falle 89). */
const FEST = /(?<![\p{L}])(?:bayram|ramazan|kurban|kandil|nevruz|hıdrellez|cumhuriyet|yılbaşı|anıtkabir|atatürk|sevgililer)/iu;

describe("TR-T5: Form und Regeln aller tr-Zeilen", () => {
  it("jede Zeile beginnt gross, endet mit Punkt und besteht nur aus Buchstaben, Apostroph, Punkt, Komma, einfachen Leerzeichen", () => {
    expect(ZEILEN.filter(formFehler)).toEqual([]);
  });

  it("Gegenprobe: klein am Anfang, ? ! : ; \" -, Komma ohne Leerzeichen, Leerzeichen vor Komma, ohne Punkt", () => {
    for (const t of ["arda okula geldi.", "Geldin mi?", "Yaşasın!", "Not: yarın.", "Evet; hayır.", 'Dedi ki "gel".', "Ak-şam.", "Arda,Buse.", "Arda , Buse.", "Arda okula geldi"]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("İzmir'de boyoz ile kahvaltı ederiz.")).toBe(false);
  });

  it("mindestens 30 Zeilen tragen ein Komma (gemessen 30)", () => {
    expect(ZEILEN.filter((t) => t.includes(",")).length).toBeGreaterThanOrEqual(30);
  });

  it("jede Zeile besteht die Regeln aller türkischen Zeilen (`helfer/trTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Maus-Wort (beim Schreiben gefunden: „dokunmayacağım“) und eine Rollen-Anrede werden gemeldet", () => {
    expect(zeilenFehler("Söz verdim, ödevimi bitirmeden telefona dokunmayacağım.").length).toBeGreaterThan(0);
    expect(zeilenFehler("Abi bu akşam maça gidiyor.").length).toBeGreaterThan(0);
  });

  it("kein Fest, kein Feiertag, kein Staatssymbol", () => {
    expect(ZEILEN.filter((t) => FEST.test(t))).toEqual([]);
  });

  it("Gegenprobe: Bayram, Ramazan, Sevgililer Günü, Anıtkabir werden gefunden - auch gross am Anfang -, „Resmî tatil“ nicht", () => {
    for (const t of ["Bayramda dedeme gittik.", "Ramazan geldi.", "Sevgililer Günü yarın.", "Ankara'da Anıtkabir'i gezdik."]) {
      expect(FEST.test(t), t).toBe(true);
    }
    expect(FEST.test("Resmî tatil bitti, yine ders başı.")).toBe(false);
    expect(FEST.test("Göl kıyısında kurbağalar ötüyor.")).toBe(false);
  });

  it("jeder Eintrag: kind satz, stufen [teens], nurWeg tr, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["teens"]);
      expect(item.nurWeg, item.text).toBe("tr");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Orte, Namen, Apostroph ──────────────────────────────────────────────────

type Region = "MAR" | "EGE" | "AKD" | "IC" | "KAR" | "DOG" | "GDO";
/**
 * Jeder Ort der Charge mit seiner Region (amtliche sieben Regionen der Türkei). [G] - Sachangaben aus eigenem Wissen.
 * Bozcaada (Çanakkale) und Kırkpınar (Edirne) liegen in Marmara; Afyon (Afyonkarahisar) und Cunda (Ayvalık) in der Ägäis;
 * Patara und Köprülü Kanyon in Antalya; Bafra, Kızılırmak-Delta und Yeşilırmak (Amasya) am Schwarzen Meer; Harput in Elazığ;
 * Halfeti in Şanlıurfa; Porsuk fliesst durch Eskişehir; Erciyes steht bei Kayseri.
 */
const ORTE: Readonly<Record<string, Region>> = {
  istanbul: "MAR", kadıköy: "MAR", büyükada: "MAR", kâğıthane: "MAR", bursa: "MAR", cumalıkızık: "MAR", edirne: "MAR",
  kırkpınar: "MAR", kocaeli: "MAR", bozcaada: "MAR",
  izmir: "EGE", çeşme: "EGE", bergama: "EGE", gümüşlük: "EGE", ayvalık: "EGE", bodrum: "EGE", muğla: "EGE", afyon: "EGE",
  alaçatı: "EGE", cunda: "EGE",
  mersin: "AKD", antalya: "AKD", kaş: "AKD", hatay: "AKD", adana: "AKD", ısparta: "AKD", patara: "AKD", köprülü: "AKD",
  ankara: "IC", kapadokya: "IC", kayseri: "IC", erciyes: "IC", eskişehir: "IC", porsuk: "IC", konya: "IC",
  rize: "KAR", trabzon: "KAR", giresun: "KAR", kaçkar: "KAR", karadeniz: "KAR", sinop: "KAR", bafra: "KAR", gümüşhane: "KAR",
  zonguldak: "KAR", kızılırmak: "KAR", samsun: "KAR", amasya: "KAR", yeşilırmak: "KAR", artvin: "KAR", karagöl: "KAR",
  safranbolu: "KAR", amasra: "KAR",
  erzurum: "DOG", kars: "DOG", van: "DOG", malatya: "DOG", erzincan: "DOG", elazığ: "DOG", harput: "DOG", bingöl: "DOG",
  hakkâri: "DOG",
  şanlıurfa: "GDO", gaziantep: "GDO", antep: "GDO", göbeklitepe: "GDO", diyarbakır: "GDO", mardin: "GDO",
  halfeti: "GDO",
};
/** Vornamen Jugendlicher - heutige Namen aus der ganzen Türkei, auch kurdische (Dilan) und neue (Tuana, Simay, Alara). */
const NAMEN: ReadonlySet<string> = new Set(
  "arda buse umut taylan yusuf sude furkan yunus simay tuana beren eren sena alara melike dilan aras yaren oya doruk batu".split(" "),
);
/** Teile von Eigennamen, die mitten im Satz gross stehen (Kaçkar Dağları, Cunda Adası, Köprülü Kanyon). */
const NAMENSTEILE: ReadonlySet<string> = new Set(["dağları", "adası", "kanyon"]);
/**
 * Andere Eigennamen und Zeichen, die gross stehen: das Land, das Ausland (İspanya, Austausch), die Schulform „Anadolu
 * lisesi“, die Prüfungen (LGS, YKS),
 * „Filenin Sultanları" (Beiname der Volleyball-Nationalmannschaft der Frauen), die Brailleschrift, IQ, Marken aus dem Alltag
 * (Netflix, Wattpad, Windows, Xbox), Musik (Sezen Aksu, Max Richter) und İskender (Gericht aus Bursa).
 */
const SONSTIGE_NAMEN: ReadonlySet<string> = new Set(
  "türkiye ispanya anadolu lgs yks sultanları braille ıq netflix wattpad windows xbox sezen aksu max richter iskender".split(" "),
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

/** Ein Eigenname oder seine Ableitung (`Erzurumlu` = Ort + Endung, in {@link NEUE_FORMEN}). */
function istEigennameOderAbleitung(w: string): boolean {
  if (istEigenname(w)) return true;
  const form = NEUE_FORMEN[w];
  return form !== undefined && istEigenname(form[0]);
}

/** Regionen einer Zeile: Orte direkt, mit Endung (`İzmir'de`) oder als Ableitung (`Erzurumlu`). */
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

describe("TR-T5: Orte aus der ganzen Türkei, Eigennamen, Apostroph nur am Namen", () => {
  it("jedes grossgeschriebene Wort mitten im Satz ist ein bekannter Ort, Name, Namensteil oder Zeichen", () => {
    const fehler = ZEILEN.flatMap((t) => unbekannteGrosse(t).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /** GEMESSEN: Zeilen je Region (eine Zeile kann zwei Regionen tragen). */
  it("alle sieben Regionen kommen vor (je mindestens 10 Zeilen), keine steht in mehr als 22 Zeilen, mindestens 95 Zeilen verortet (gemessen 98: MAR 11, EGE 15, AKD 11, IC 12, KAR 21, DOG 16, GDO 12)", () => {
    const zahl = new Map<Region, number>();
    let verortet = 0;
    for (const t of ZEILEN) {
      const r = regionenDerZeile(t);
      if (r.size > 0) verortet++;
      for (const x of r) zahl.set(x, (zahl.get(x) ?? 0) + 1);
    }
    const bericht = [...zahl].map(([r, n]) => `${r} ${n}`).join(", ") + ` - verortet ${verortet}`;
    for (const r of ["MAR", "EGE", "AKD", "IC", "KAR", "DOG", "GDO"] as const) expect(zahl.get(r) ?? 0, `${r} - ${bericht}`).toBeGreaterThanOrEqual(10);
    expect([...zahl.values()].every((n) => n <= 22), bericht).toBe(true);
    expect(verortet, bericht).toBeGreaterThanOrEqual(95);
  });

  it("Gegenprobe: ein unbekannter Ort wird gemeldet, ein Satzanfang nicht; Ableitungen und Endungen zählen zur Region", () => {
    expect(unbekannteGrosse("Kuzenim Atlantis'te okuyor.")).toEqual(["Atlantis'te"]);
    expect(unbekannteGrosse("Kızlar parkta.")).toEqual([]);
    expect([...regionenDerZeile("Doruk'un dedesi Erzurumlu.")]).toEqual(["DOG"]);
    expect([...regionenDerZeile("Kaş'ta deniz çok berrak.")]).toEqual(["AKD"]);
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
    expect(ZEILEN.filter((t) => t.includes("'")).length).toBeGreaterThanOrEqual(57);
  });

  it("Gegenprobe: İzmir'da (Harmonie), Gaziantep'de (Angleichung), Umut'ün und ein Gattungswort mit Apostroph werden gemeldet", () => {
    expect(endungFehler("izmir", "da")).toHaveLength(1);
    expect(endungFehler("gaziantep", "de")).toHaveLength(1);
    expect(endungFehler("umut", "ün")).toHaveLength(1);
    expect(endungFehler("kaş", "ta")).toEqual([]);
    expect(endungFehler("kâğıthane", "de")).toEqual([]);
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
 * Lexikon-Nachtrag nimmt nur Formen mit mindestens zwei Tatoeba-Belegen; Schul-, Sport-, Küchen- und Netzwörter fehlen dort
 * oft). [G] - eigenes Sprachwissen, NICHT an einer Quelle belegt; das macOS-Wörterbuch prüft Türkisch nur halb (Falle 87) -
 * kein Beweis. Einige stehen nur als Stamm einer Form unten. ⚠️ Von keiner Person mit Türkisch als Erstsprache gelesen.
 */
const NEUE_GRUNDFORMEN: Readonly<Record<string, string>> = {
  abone: "Abonnent (eines Kanals) - nur als Stamm („aboneyi“)",
  atölye: "Werkstatt, Workshop („gölge oyunu atölyesi“) - nur als Stamm",
  barınak: "Unterkunft; „hayvan barınağı“ = Tierheim - nur als Stamm (erweicht „barınağ-“)",
  batık: "versunken („batık köy“ in Halfeti, beim Stausee überflutet)",
  batım: "Untergang; „gün batımı“ = Sonnenuntergang - nur als Stamm",
  berrak: "klar (Wasser)",
  betimleme: "Beschreibung; „sesli betimleme“ = Audiodeskription im Film - nur als Stamm („betimlemeli“)",
  biriktir: "Stamm von biriktirmek (sparen, sammeln) - nur als Stamm",
  boyoz: "Blätterteiggebäck aus İzmir (zum Frühstück mit Ei)",
  burkul: "Stamm von burkulmak (sich verstauchen: „dizim burkuldu“) - nur als Stamm",
  cağ: "„cağ kebabı“: waagrechter Spiess aus Erzurum",
  dağınık: "unordentlich („odam dağınık“)",
  danışman: "Berater; „psikolojik danışman“ = Schulberatung (Rehberlik) - nur als Stamm",
  delta: "Flussdelta („Kızılırmak deltası“, Vogelschutzgebiet bei Bafra) - nur als Stamm",
  demle: "Stamm von demlemek (Tee ziehen lassen) - nur als Stamm",
  doy: "Stamm von doymak (satt werden; „tadına doyulmaz“ = man bekommt nicht genug davon) - nur als Stamm",
  eksen: "Achse („x ekseni“) - nur als Stamm",
  file: "Netz im Volleyball; „Filenin Sultanları“ = Beiname der Frauen-Nationalmannschaft - nur als Stamm",
  fonksiyon: "Funktion (Mathematik, Lise) - nur als Stamm",
  formül: "Formel - nur als Stamm",
  grafik: "Graph, Diagramm - nur als Stamm („grafikte“)",
  gravyer: "Hartkäse; „Kars gravyeri“ ist eine geschützte Herkunftsangabe - nur als Stamm",
  güreş: "Ringen; „yağlı güreş“ in Kırkpınar - nur als Stamm",
  harçlık: "Taschengeld",
  hasat: "Ernte („kayısı hasadı“ in Malatya) - nur als Stamm (erweicht „hasad-“)",
  horon: "Kettentanz der Schwarzmeerküste - nur als Stamm („Trabzon horonu“)",
  isot: "in der Sonne gedunkelter Pfeffer aus Şanlıurfa - nur als Stamm („isotu“)",
  kano: "Kanu",
  konsey: "Rat; „öğrenci konseyi“ = Schülerrat - nur als Stamm",
  kordon: "die Uferpromenade in İzmir („Kordon“, im Satz klein als Gattungswort) - nur als Stamm",
  kort: "Platz für Tennis und Squash - nur als Stamm",
  kros: "Crosslauf (Schulsport)",
  montaj: "Filmschnitt („montaja geçtik“) - nur als Stamm",
  mühendis: "Ingenieurin, Ingenieur - nur als Stamm",
  paralimpik: "paralympisch („Paralimpik yüzücüler“)",
  paten: "Rollschuh, Inliner",
  pestil: "getrocknetes Fruchtmus aus Gümüşhane - nur als Stamm",
  podcast: "Podcast, so geschrieben",
  quiz: "Kurztest im Unterricht, so gesprochen und geschrieben",
  rafting: "Rafting (Köprülü Kanyon)",
  rap: "Rap",
  rıhtım: "Kai, Ufermauer („Kadıköy rıhtımı“) - nur als Stamm",
  squash: "Squash, so übernommen",
  sur: "Stadtmauer („Diyarbakır surları“) - nur als Stamm",
  sörf: "Surfen, TDK-Schreibung",
  tasarla: "Stamm von tasarlamak (entwerfen) - nur als Stamm",
  tırman: "Stamm von tırmanmak (klettern) - nur als Stamm",
  tüp: "Flasche; „tüple dalış“ = Gerätetauchen - nur als Stamm",
  yapboz: "Puzzle",
  ısmarla: "Stamm von ısmarlamak (bestellen, spendieren) - nur als Stamm",
  çiz: "Stamm von çizmek (zeichnen) - nur als Stamm",
};

/**
 * Neue Formen = bekannter Stamm + Endung. Der Stamm stand im Wortschatz, in einer anderen tr-Charge, ist eine Grundform
 * oben oder ein Ort. Mit drittem Eintrag: der Stamm ist die ERWEICHTE Form dieses Wortes (p ⇒ b, ç ⇒ c, t ⇒ d, k ⇒ ğ vor
 * einem Vokal: kulüp ⇒ kulübü, rakip ⇒ rakibi). Die Endung ist ausgeschrieben, damit Vokalharmonie und d/t-Angleichung
 * NACHGERECHNET werden (Puffer `n y s` gehören zur Endung). Ein angehängtes „-ki“ (köydeki) ist unveränderlich.
 * Wo ein Verbstamm nicht im Wortschatz steht, ist die bekannte Vergangenheitsform der Stamm (`katıldı` + `k`).
 */
const NEUE_FORMEN: Readonly<Record<string, readonly [string, string] | readonly [string, string, string]>> = {
  aboneyi: ["abone", "yi"], anlamıyor: ["anla", "mıyor"], antrenmandan: ["antrenman", "dan"], antrenmanlar: ["antrenman", "lar"],
  arıcılık: ["arı", "cılık"], ateşinin: ["ateş", "inin"], atölyesinde: ["atölye", "sinde"], ayakkabılarım: ["ayakkabı", "larım"],
  açmayacağım: ["aç", "mayacağım"], açıklanıyor: ["açık", "lanıyor"], ağladım: ["ağladı", "m"], ağustosta: ["ağustos", "ta"],
  bacalarının: ["baca", "larının"], bahçeden: ["bahçe", "den"], bahçelerini: ["bahçe", "lerini"], baklavasının: ["baklava", "sının"],
  balonlarını: ["balon", "larını"], balıkçılarla: ["balıkçılar", "la"], barınağında: ["barınağ", "ında", "barınak"],
  batımını: ["batım", "ını"], başlattık: ["başlattı", "k"], beklemediğim: ["bekle", "mediğim"],
  belgeselin: ["belgesel", "in"], berbattı: ["berbat", "tı"], betimlemeli: ["betimleme", "li"], bilmedi: ["bil", "medi"],
  biriktiriyorum: ["biriktir", "iyorum"], bisikletle: ["bisiklet", "le"], bitiremedim: ["bitir", "emedim"], bizimdi: ["bizim", "di"],
  buluşalım: ["buluş", "alım"], buluştuk: ["buluş", "tuk"], buluşuyor: ["buluş", "uyor"], burkuldu: ["burkul", "du"],
  cesaretimi: ["cesaret", "imi"], danışmanla: ["danışman", "la"], dağlarında: ["dağ", "larında"], dedemlerle: ["dedem", "lerle"],
  deltasında: ["delta", "sında"], demledi: ["demle", "di"], dergisine: ["dergi", "sine"], deriden: ["deri", "den"],
  dikme: ["dik", "me"], dizim: ["diz", "im"], dizisi: ["dizi", "si"], dolmuşta: ["dolmuş", "ta"],
  donuyor: ["don", "uyor"], doyulmaz: ["doy", "ulmaz"], döneri: ["döner", "i"], dönmedik: ["dön", "medik"], dönmeyin: ["dön", "meyin"],
  düzenledik: ["düzenledi", "k"], düğününde: ["düğün", "ünde"], düşürdüm: ["düşürdü", "m"], eksenini: ["eksen", "ini"],
  erzurumlu: ["erzurum", "lu"], etkilendim: ["etkilendi", "m"], etkinliğine: ["etkinliğ", "ine", "etkinlik"], evlerin: ["ev", "lerin"],
  ezberim: ["ezber", "im"], filenin: ["file", "nin"], filmleri: ["film", "leri"], finalinde: ["final", "inde"], fizikten: ["fizik", "ten"],
  fonksiyonun: ["fonksiyon", "un"], formülünde: ["formül", "ünde"], garsonluk: ["garson", "luk"], gazetemizin: ["gazete", "mizin"], gecesine: ["gece", "sine"],
  getirdiğim: ["getir", "diğim"], grafikte: ["grafik", "te"], gravyeri: ["gravyer", "i"], görüşmediğimiz: ["görüş", "mediğimiz"],
  gösterisine: ["gösteri", "sine"], güncelliyorum: ["güncel", "liyorum"], güreşlerini: ["güreş", "lerini"], güçlüydü: ["güçlü", "ydü"],
  haftası: ["hafta", "sı"], harçlığımla: ["harçlığ", "ımla", "harçlık"], hasadına: ["hasad", "ına", "hasat"],
  hayvanlarına: ["hayvan", "larına"], haziranda: ["haziran", "da"], hazırlanıyoruz: ["hazırlanıyor", "uz"], hazırlattı: ["hazır", "lattı"],
  hazırlıyoruz: ["hazır", "lıyoruz"], hedefim: ["hedef", "im"], heyecandan: ["heyecan", "dan"], heyecanlıydı: ["heyecanlı", "ydı"],
  heyecanlıyım: ["heyecanlı", "yım"], hobim: ["hobi", "m"], horonu: ["horon", "u"], internete: ["internet", "e"], isotu: ["isot", "u"],
  israfına: ["israf", "ına"], izci: ["iz", "ci"], kahvaltısı: ["kahvaltı", "sı"], kalabalıktı: ["kalabalık", "tı"], kalkmam: ["kalk", "mam"],
  kampta: ["kamp", "ta"], kampında: ["kamp", "ında"], kankamla: ["kankam", "la"], kanoda: ["kano", "da"], kantinde: ["kantin", "de"],
  kantinin: ["kantin", "in"], kapanış: ["kapan", "ış"], kardeşime: ["kardeşim", "e"], kardeşimin: ["kardeşim", "in"],
  kartımla: ["kart", "ımla"], katmerci: ["katmer", "ci"], katıldık: ["katıldı", "k"], kaybolduk: ["kayboldu", "k"], kaydık: ["kaydı", "k"],
  kayısısı: ["kayısı", "sı"], kebabıyla: ["kebab", "ıyla", "kebap"], kemençesiz: ["kemençe", "siz"], kentini: ["kent", "ini"],
  kestik: ["kes", "tik"], konakta: ["konak", "ta"], konserinde: ["konser", "inde"], konseyine: ["konsey", "ine"],
  kordonunda: ["kordon", "unda"], kortunda: ["kort", "unda"], koylarında: ["koy", "larında"], koyunda: ["koy", "unda"],
  koçumuz: ["koç", "umuz"], koşusunu: ["koşu", "sunu"], kulaklığı: ["kulaklığ", "ı", "kulaklık"], kulaklığımı: ["kulaklığ", "ımı", "kulaklık"],
  kulübümüzün: ["kulüb", "ümüzün", "kulüp"], kulübünde: ["kulüb", "ünde", "kulüp"], kulübüyle: ["kulüb", "üyle", "kulüp"],
  kumsalında: ["kumsal", "ında"], kursundayım: ["kursunda", "yım"], kuzenimi: ["kuzen", "imi"],
  kuzenlerle: ["kuzen", "lerle"], köydeki: ["köy", "deki"], köyü: ["köy", "ü"], köyünü: ["köy", "ünü"],
  lisesine: ["lise", "sine"], lisesini: ["lise", "sini"], listelerde: ["liste", "lerde"], listemi: ["liste", "mi"],
  maçımız: ["maç", "ımız"], metrosunda: ["metro", "sunda"], montaja: ["montaj", "a"], mühendisi: ["mühendis", "i"],
  müzeler: ["müze", "ler"], müzeleri: ["müze", "leri"], netlerim: ["net", "lerim"], notlarımı: ["not", "larımı"],
  notlarını: ["not", "larını"], ocakları: ["ocak", "ları"], odaklanamadı: ["odaklan", "amadı"], ovası: ["ova", "sı"], okulum: ["okul", "um"],
  okulumuza: ["okul", "umuza"], okuluna: ["okul", "una"], okulunda: ["okul", "unda"], okuyucuyla: ["okuyucu", "yla"],
  otobüsüyle: ["otobüs", "üyle"], oynuyorum: ["oynuyor", "um"], oynuyoruz: ["oynuyor", "uz"],
  oyununda: ["oyun", "unda"], paylaştım: ["paylaştı", "m"], pestili: ["pestil", "i"], pidesi: ["pide", "si"], 
  plaklar: ["plak", "lar"], plaklarını: ["plak", "larını"], projemiz: ["proje", "miz"], radyoları: ["radyo", "ları"],
  rahatladım: ["rahat", "ladım"], rakibimiz: ["rakib", "imiz", "rakip"], rıhtımında: ["rıhtım", "ında"], sabunun: ["sabun", "un"],
  sahadayız: ["saha", "dayız"], salataya: ["salata", "ya"], salonda: ["salon", "da"],
  sayfasını: ["sayfa", "sını"], sergisi: ["sergi", "si"], serindi: ["serin", "di"], sitemizi: ["site", "mizi"],
  sohbetinde: ["sohbet", "inde"], sokaklarında: ["sokak", "larında"], sucuğu: ["sucuğ", "u", "sucuk"], surlarında: ["sur", "larında"],
  söyleyemedim: ["söyle", "yemedim"], sözlüde: ["sözlü", "de"], sürdük: ["sür", "dük"], sınavında: ["sınav", "ında"],
  sınıfımızda: ["sınıf", "ımızda"], sınıfımızın: ["sınıf", "ımızın"], takımında: ["takım", "ında"],
  tantunisi: ["tantuni", "si"], tasarladık: ["tasarla", "dık"], tatildeyiz: ["tatil", "deyiz"],
  tekneyle: ["tekne", "yle"], telefondan: ["telefon", "dan"], temizledik: ["temizledi", "k"], tercihini: ["tercih", "ini"],
  testlerine: ["test", "lerine"], tiyatrosunda: ["tiyatro", "sunda"], tostu: ["tost", "u"],
  turnuvası: ["turnuva", "sı"], tüple: ["tüp", "le"], türküleri: ["türkü", "leri"], tırmandık: ["tırman", "dık"],
  ucuzladı: ["ucuz", "ladı"], uyuyacağım: ["uyuyacağ", "ım", "uyuyacak"], voleybolu: ["voleybol", "u"],
  yaktık: ["yak", "tık"], yaptırdım: ["yap", "tırdım"], yarışmacı: ["yarışma", "cı"], 
  yattım: ["yat", "tım"], yaylalarında: ["yayla", "larında"], yaylası: ["yayla", "sı"], yaylasında: ["yayla", "sında"],
  yazdık: ["yaz", "dık"], yazıldık: ["yazıldı", "k"], yazıldım: ["yazıldı", "m"], yazılılar: ["yazılı", "lar"],
  yazılımcı: ["yazılım", "cı"], yazılısı: ["yazılı", "sı"], yuvalarını: ["yuva", "larını"], 
  yüzücüler: ["yüzücü", "ler"], yılım: ["yıl", "ım"], çalanlar: ["çalan", "lar"], çaldık: ["çal", "dık"], çalma: ["çal", "ma"],
  çantayla: ["çanta", "yla"], çekimi: ["çekim", "i"], çizim: ["çiz", "im"], çizmeyi: ["çiz", "meyi"], ödevim: ["ödev", "im"],
  ödevinde: ["ödev", "inde"], ödevler: ["ödev", "ler"], öğretiyorum: ["öğret", "iyorum"], üniversiteli: ["üniversite", "li"],
  ısmarladık: ["ısmarla", "dık"], şampiyonu: ["şampiyon", "u"], şarjda: ["şarj", "da"], şarkımızın: ["şarkı", "mızın"],
  şenliğinde: ["şenliğ", "inde", "şenlik"], şiirimizi: ["şiir", "imizi"], şoförü: ["şoför", "ü"],
};

const HINTEN = new Set(["a", "ı", "o", "u", "â", "û"]);
const VOKALE = new Set(["a", "e", "ı", "i", "o", "ö", "u", "ü", "â", "î", "û"]);
const STIMMLOS = new Set(["ç", "f", "h", "k", "p", "s", "ş", "t"]);
/**
 * Lehnwörter mit hinterem Vokal, die HELLE Endungen nehmen (TDK, Ausnahmen der großen Vokalharmonie: saat ⇒ saati, hal ⇒
 * hali, final ⇒ finali - TR-T2 schreibt schon „finalde“, „finale“). Nur, was die Charge braucht, und `saat` für die Gegenprobe.
 */
const HELLE_ENDUNG: ReadonlySet<string> = new Set(["final", "saat"]);
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
 * (köydeki) ist unveränderlich und wird nicht geprüft. `â î û` gelten als a i u (Kâğıthane ⇒ -de).
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
/** Nach einem Zahlwort steht die Einzahl (Glossar Regel 5): „iki hafta“, nie „iki haftalar“. */
function mehrzahlNachZahl(zeile: string): string[] {
  const w = woerterKlein(zeile);
  return w.filter((x, i) => i > 0 && ZAHLWOERTER.has(w[i - 1]) && /l[ae]r(?:ı|i|a|e|da|de|dan|den|ın|in)?$/u.test(x));
}

describe("TR-T5: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("★ Wortbudget Jugend: über ALLE tr-Jugendzeilen (TR-T2 + TR-T5, später TR-T8) steht kein Inhaltswort in mehr als 8 Zeilen", () => {
    expect(JUGEND_ANDERE().length).toBeGreaterThanOrEqual(JUGEND_T2.length);
    const fehler = zuHaeufig([...ZEILEN, ...JUGEND_ANDERE()]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross und mit Punkt), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Okul" : "okul"} ve ${"abcdefghi"[i]}.`);
    expect(zuHaeufig(neun)).toEqual(['"okul": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - Kern, Wortbasis, gefaltet (ı→i ş→s …) und kein unerwünschtes Themenwort", () => {
    const fehler = ZEILEN.flatMap((t) =>
      woerterOhneZeichen(t).filter((w) => gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w)).map((w) => `"${t}": ${w}`),
    );
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: sik (Kern), ordu, und was beim Schreiben anschlug (rezil, ceza, sapık) - kanka, sörf, kemençe nicht", () => {
    expect(istKernGesperrtTr("sik")).toBe(true);
    for (const w of ["ordu", "rezil", "ceza", "sapık"]) expect(gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w), w).toBe(true);
    for (const w of ["kanka", "sörf", "kemençe", "harçlık"]) expect(gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w), w).toBe(false);
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
    expect(endungFehler("kulüb", "ında")).toHaveLength(1);
    expect(endungFehler("saat", "ı")).toHaveLength(1); // Ausnahme mit hellen Endungen: saati, nie saatı
    expect(endungFehler("saat", "i")).toEqual([]);
    expect(endungFehler("kamp", "da")).toHaveLength(1);
    expect(endungFehler("saha", "ta")).toHaveLength(1);
    expect(endungFehler("köy", "deki")).toEqual([]);
    expect(endungFehler("köy", "daki")).toHaveLength(1);
    expect(erweicht("kulüp")).toBe("kulüb");
    expect(erweicht("barınak")).toBe("barınağ");
    expect(erweicht("hasat")).toBe("hasad");
    expect(ungeprueft(["Gitar dersine başladım.", "Gitarr dersine başladım."])).toEqual(["gitarr"]);
  });

  it("nach einem Zahlwort steht die Einzahl", () => {
    const fehler = ZEILEN.flatMap((z) => mehrzahlNachZahl(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „iki haftalar“, „Dört yıllar.“ werden gemeldet, „iki hafta“ und „yıllar dört“ nicht", () => {
    expect(mehrzahlNachZahl("Antrenmanda dizim burkuldu, iki haftalar yokum.")).toEqual(["haftalar"]);
    expect(mehrzahlNachZahl("Dört yıllar.")).toEqual(["yıllar"]);
    expect(mehrzahlNachZahl("Antrenmanda dizim burkuldu, iki hafta yokum.")).toEqual([]);
    expect(mehrzahlNachZahl("Yıllar dört.")).toEqual([]);
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

describe("TR-T5: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der ç ğ ı ş nicht kennt)", () => {
    expect(new Set(ZEILEN).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("Gegenprobe: „Maç bitti.“/„Maş bitti.“ teilen den Schlüssel", () => {
    expect(bausteinKey("satz", "Maç bitti.")).toBe(bausteinKey("satz", "Maş bitti."));
  });

  it("keine Zeile gleicht einer Zeile der Wege de/en/fr/es/it/pl/cs oder einer anderen tr-Charge (Text oder Schlüssel)", () => {
    const fremd = [...FREMDE_KORPORA(), ...ANDERE_TR()];
    expect(fremd.length).toBeGreaterThan(1000);
    const ohne = (t: string) => kleinFuer(t, "tr").replace(/[.,!?;:"]/gu, "");
    const texte = new Set(fremd.map((i) => ohne(i.text)));
    const schluessel = new Set(fremd.map((i) => bausteinKey(i.kind, i.text)));
    expect(CHARGE.filter((i) => texte.has(ohne(i.text)) || schluessel.has(bausteinKey(i.kind, i.text))).map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine TR-T2-Zeile ist über die ROHE Liste erkannt, die Charge selbst nicht", () => {
    const andere = new Set(ANDERE_TR().map((i) => bausteinKey(i.kind, i.text)));
    expect(andere.has(bausteinKey("satz", JUGEND_T2[0]))).toBe(true);
    expect(andere.has(bausteinKey("satz", ZEILEN[0]))).toBe(false);
    expect(ANDERE_TR().length).toBe(TR_ROH.length - CHARGE.length);
  });

  it("keine Paare in der Charge und keines mit einer anderen tr-Zeile (nur Person oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN, ANDERE_TR_ZEILEN());
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ben/sen und Einzahl/Mehrzahl werden als Paar erkannt", () => {
    expect(paare(["Ben de geldim.", "Sen de geldim."])).toHaveLength(1);
    expect(paare(["Müzeleri geziyorum."], ["Müzeler geziyorum."])).toEqual([]);
    expect(paare(["Plaklar buldum."], ["Plak buldum."])).toHaveLength(1);
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

describe("TR-T5: keine Kopie und nichts fast gleich - gegen Korpora, Serien und Prüfungstext-Banken aller Sprachen", () => {
  it("die Vergleichsmenge ist voll (Serien und Banken geladen, pl/cs, TR-T1 bis TR-T3)", () => {
    expect(bankZeilen().length).toBeGreaterThan(1000);
    expect(SERIEN.length).toBeGreaterThan(100);
    expect(CORPUS_PL.length).toBeGreaterThan(0);
    expect(CORPUS_CS.length).toBeGreaterThan(0);
    expect(ANDERE_TR().length).toBeGreaterThanOrEqual(JUGEND_T2.length + CORPUS_TR_WEG_FRUEH_ERWACHSENE.length + CORPUS_TR_WEG_FRUEH_KIDS.length);
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

  it("Gegenprobe: Serienzeile, Banken-Satz, TR-T2-Zeile als Kopie; beim Schreiben gemieden (Gümüşlük/Sinop, Cunda/Bozcaada) als fast gleich", () => {
    const fremd = new Set(alleFremdenZeilen().map(ohneZeichen));
    expect(fremd.has(ohneZeichen(SERIEN[0].etappen[0].lines[0]))).toBe(true);
    expect(fremd.has(ohneZeichen(bankZeilen()[0].split(/(?<=[.!?])\s+/u)[0]))).toBe(true);
    expect(fremd.has("kafa salla")).toBe(true);
    expect(fastGleich(wortMenge("Gümüşlük sahilinde gün batımı izledik."), wortMenge("Sinop sahilinde gün batımı izledik."))).toBe(true);
    expect(fastGleich(wortMenge("Cunda sokaklarında bisiklet sürdük."), wortMenge("Bozcaada sokaklarında bisiklet sürdük."))).toBe(true);
    expect(fastGleich(wortMenge("Gümüşlük koyunda kano kiraladık."), wortMenge("Sinop sahilinde gün batımı izledik."))).toBe(false);
  });
});

describe("TR-T5: Korpus-Anker und Auslieferung", () => {
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
    const probe = { text: "Zzz probe tr t5.", kind: "satz" as const, stufen: ["teens" as const] };
    const ids = manifestFor([...FREMDE_KORPORA(), ...CORPUS_TR, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("Weg „tr“ bekommt Jugendlichen an Sprosse q jede Zeile dieser Charge - und nur eigene tr-Jugendzeilen", () => {
    const { letzte, o } = grenzen();
    const allowed = allowedFromIntroduced(o.slice(0, letzte), "tr");
    const geliefert = corpusItemsFor({ stufe: "teens", allowed, lang: "tr", lernweg: "tr" });
    expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
    const eigeneJugend = new Set(
      CORPUS_TR.filter((i) => i.nurWeg === "tr" && i.stufen.includes("teens")).flatMap((i) => [i.text, fitText(i.text, allowed, "tr") ?? i.text]),
    );
    expect(geliefert.filter((t) => !eigeneJugend.has(t) && !eigeneJugend.has(kleinFuer(t, "tr")))).toEqual([]);
  });

  it("vor ⇧ (Sprosse 19) kommen aus dieser Charge NUR die ⇧-Zeilen an (ohne Punkt und Komma) - keine mit z bis q", () => {
    const { o } = grenzen();
    const allowed = allowedFromIntroduced(o.slice(0, 19), "tr");
    const geliefert = new Set(corpusItemsFor({ stufe: "teens", allowed, lang: "tr", lernweg: "tr" }));
    const hier = ZEILEN.filter((t) => geliefert.has(fitText(t, allowed, "tr") ?? ""));
    expect(hier.length).toBeGreaterThanOrEqual(14);
    expect(hier.filter((t) => sprosseAuf(t) !== 20)).toEqual([]);
    expect([...geliefert].filter((t) => /[zçhgğüvpcöwxq'âîû]/iu.test(t))).toEqual([]);
  });

  it("Kinder und Erwachsene auf Weg „tr“ bekommen keine Zeile dieser Charge", () => {
    const { letzte, o } = grenzen();
    const allowed = allowedFromIntroduced(o.slice(0, letzte), "tr");
    for (const stufe of ["kids", "erwachsen"] as const) {
      const geliefert = corpusItemsFor({ stufe, allowed, lang: "tr", lernweg: "tr" });
      expect(ZEILEN.filter((t) => geliefert.includes(t)), stufe).toEqual([]);
    }
  });

  it("Weg „de“ und Weg „it“ bekommen keine dieser Zeilen", () => {
    setLayout("de");
    const de = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(introOrder("de"), "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const it_ = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(introOrder("it"), "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
