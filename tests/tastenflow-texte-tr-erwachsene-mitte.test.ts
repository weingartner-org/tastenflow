/**
 * ★★★ Wächter TR-T6 (09.10.2026): die mittleren tr-Texte für ERWACHSENE (`corpusTrWegMitteErwachsene.ts`, Sprossen 20-37
 * auf `tr-q` = ⇧ bis q). Aufbau aus den Wächtern TR-T5 (Jugend Mitte, gleiche Sprossen) und TR-T3 (Erwachsene früh:
 * Geschlecht, D-2). Befund `BEFUND-2026-10-09-TR-T6-ERWACHSENE-MITTE.md`, Leitfaden Fallen 26/31/37/45/48/51/58/76/87-91.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET (kleinstes n, ab dem `fitText` sie mit `introOrder("tr").slice(0, n)`
 * durchlässt, mindestens ⇧), nie aus einem Kommentar geglaubt. Jede Regel hat eine Gegenprobe.
 *
 * Besonderheiten des Weges „tr" in der Mitte, für Erwachsene:
 *  · ⇧ gatet NICHTS: Grossbuchstaben sind immer tippbar (KERNREGEL corpus.ts), und vor ⇧ endet die Folge mit `u`. Für
 *    Erwachsene hält D-2 (`nurKleinschrift`, `umschalt: false`) jede Zeile mit Grossbuchstaben vor ⇧ zurück - GEMESSEN
 *    unten (TR-T3 §4 hatte es offen gelassen). Als zweite Sicherung tragen die ⇧-Zeilen trotzdem ein `u` und einen Namen
 *    MITTEN im Satz (wie TR-T4/TR-T5), jede andere Zeile einen Buchstaben ab `z`.
 *  · Der Apostroph (33) ist „hart" und steht nur zwischen Eigenname und Endung - die Endung wird hier nachgerechnet
 *    (Vokalharmonie, d/t-Angleichung: `Kars'ta`, `Siirt'te`, `Murat'ın`, `SGK'ya`).
 *  · `^` (34) ist eine Totaste - eine Zeile „enthält" sie, wenn sie â î û trägt (`totastenZiele`).
 *  · Keine Zeile verrät das Geschlecht der Person, die tippt (TR-T3).
 *  · Das macOS-Wörterbuch kann für Türkisch nur ABLEHNEN (Falle 87): jedes Wort, das nicht im Wortschatz oder in einer
 *    anderen tr-Charge stand, ist hier belegt (Grundform mit Begründung, Stamm + Endung, Ort, Name).
 *  · Lehre aus PL-T3 §3c: Kopien, Paare und „fast gleich" gegen die ROHE Sammelliste `corpusTr.ts` (nach Objekt).
 *  · Wortbudget der Erwachsenen über ALLE tr-Erwachsenenzeilen (TR-T3 + TR-T6, später TR-T9), höchstens 8 je Inhaltswort.
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
import { CORPUS_TR_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusTrWegFruehErwachsene";
import { CORPUS_TR_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusTrWegFruehKids";
import { CORPUS_TR_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusTrWegFruehTeens";
import { CORPUS_TR_WEG_MITTE_TEENS } from "../src/lib/typing/corpusTrWegMitteTeens";
import { CORPUS_TR_WEG_MITTE_ERWACHSENE } from "../src/lib/typing/corpusTrWegMitteErwachsene";
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

const CHARGE = CORPUS_TR_WEG_MITTE_ERWACHSENE;
const ZEILEN = CHARGE.map((i) => i.text);
/** Alle ANDEREN tr-Zeilen aus der ROHEN Sammelliste (TR-T1 bis T5 und jede spätere Charge), nach Objekt - nie nach Text. */
const ANDERE_TR = () => TR_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_TR_ZEILEN = (): string[] => ANDERE_TR().map((i) => i.text);
/** Die Chargen, die in der rohen Liste VOR dieser stehen (für „trägt die Beleg-Liste nur Nötiges?", TR-T3 §3c). */
const FRUEHERE_TR = () => TR_ROH.slice(0, TR_ROH.indexOf(CHARGE[0]));
/** Alle ANDEREN tr-Erwachsenenzeilen (TR-T3, später TR-T9) - für das Wortbudget der Stufe. */
const ERWACHSENE_ANDERE = () => ANDERE_TR().filter((i) => i.stufen.includes("erwachsen")).map((i) => i.text);
const ERWACHSENE_T3 = CORPUS_TR_WEG_FRUEH_ERWACHSENE.map((i) => i.text);
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

describe("TR-T6: jede Zeile an ihrer Sprosse (tr-q)", () => {
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
   * Zweite Sicherung neben D-2: eine Zeile aus Buchstaben bis `u` käme bei einem Aufrufer ohne `umschalt` schon VOR ⇧ an.
   * Erlaubt ist das nur für die ⇧-Zeilen - frühestens an 19 (sie tragen ein `u`) und nur mit einem Namen mitten im Satz.
   */
  it("keine Zeile passt vor Sprosse 19; wer an 19 passt, ist eine ⇧-Zeile mit Namen mitten im Satz", () => {
    const fehler = ZEILEN.filter((t) => {
      const b = buchstabenSprosse(t) ?? 0;
      return b < 19 || (b === 19 && !enthaeltEinheit(t, SHIFT_UNIT));
    });
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Sprossen werden richtig gerechnet (⇧ gatet nichts, Apostroph hart, ^ als Totaste)", () => {
    expect(buchstabenSprosse("Sinan ile Nur kira artışını konuştu.")).toBe(19);
    expect(sprosseAuf("Sinan ile Nur kira artışını konuştu.")).toBe(20);
    // Beim Schreiben verworfen: „Annem ile Tuba“ statt „Tuba ile annem“ - am Satzanfang ist der Name kein ⇧.
    expect(enthaeltEinheit("Tuba ile annem doktorda sıra bekliyor.", SHIFT_UNIT)).toBe(false);
    // Ohne `u` und ohne Namen käme eine Erwachsenenzeile schon weit vor ⇧ in Frage.
    expect(buchstabenSprosse("Emekli ikramiyesi yattı.")).toBeLessThan(19);
    expect(sprosseAuf("Kimlik kartınızı unutmayın.")).toBe(23);
    expect(sprosseAuf("Tahlil sonuçlarım hazır.")).toBe(25);
    expect(sprosseAuf("Kars'ta kuzenimin küçük bir mandırası var.")).toBe(33);
    expect(sprosseAuf("Kars da kuzenimin küçük bir mandırası var.")).toBe(29); // ohne Apostroph schon an v - darum hart
    expect(sprosseAuf("Maaşım hâlâ yatmadı.")).toBe(34);
    expect(sprosseAuf("Maaşım hala yatmadı.")).toBe(25);
    expect(sprosseAuf("Netflix aboneliğimi iptal ettim.")).toBe(36);
    expect(sprosseAuf("Ödemeyi QR kod ile yaptım.")).toBe(37);
    // ? und ! kommen erst nach q - vorher lässt `fitText` sie weg; die Form-Regel unten hält sie aus dieser Charge.
    expect(sprosseAuf("Sinan ile Nur kira artışını konuştu mu?")).toBe(20);
  });

  /** GEMESSEN am Ende von TR-T6 (vom Code gezählt) - jede Grenze darf künftig nur STEIGEN. */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    20: 16, 23: 28, 24: 14, 25: 20, 26: 15, 27: 15, 28: 20, 29: 22, 30: 34, 31: 22, 32: 37, 33: 52, 34: 19, 35: 6, 36: 5, 37: 6,
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

describe("TR-T6: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
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
    expect(enthaeltEinheit("Sinan ile Nur kira artışını konuştu.", SHIFT_UNIT)).toBe(true);
    expect(enthaeltEinheit("Sinan kira artışını konuştu.", SHIFT_UNIT)).toBe(false); // nur die Grossschreibung am Anfang
    expect(enthaeltEinheit("Maaşım hâlâ yatmadı.", "^")).toBe(true);
    expect(enthaeltEinheit("Maaşım hala yatmadı.", "^")).toBe(false);
    expect(ohneNeueEinheit([{ text: "Bu kış soğuklar erken bastırdı.", sprosse: 28 }])).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "Bu kış soğuklar erken bastırdı.", sprosse: 27 }])).toEqual([]);
  });

  it("die echte Runde (adaptiveRound, Erwachsene, Fokus ç) bringt Zeilen dieser Charge mit ç - und keine Kinder- oder Jugendzeile", () => {
    const { o } = grenzen();
    const intro = o.slice(0, o.indexOf("ç") + 1);
    const echt = Math.random;
    let s = 2610;
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
        for (const z of adaptiveRound({ introduced: intro, focus: ["ç"], stufe: "erwachsen", lang: "tr", lernweg: "tr", count: 12 })) {
          texte.push(z.text);
        }
      }
    } finally {
      Math.random = echt;
    }
    const erlaubt = allowedFromIntroduced(intro, "tr");
    const eigene = new Set(ZEILEN.flatMap((t) => [t, fitText(t, erlaubt, "tr") ?? t]));
    expect(texte.some((t) => eigene.has(t) && t.includes("ç")), texte.slice(0, 12).join(" / ")).toBe(true);
    const fremdeStufen = new Set(
      [...CORPUS_TR_WEG_FRUEH_KIDS, ...CORPUS_TR_WEG_FRUEH_TEENS, ...CORPUS_TR_WEG_MITTE_TEENS].flatMap((i) => [i.text, fitText(i.text, erlaubt, "tr") ?? i.text]),
    );
    expect(texte.filter((t) => fremdeStufen.has(t))).toEqual([]);
  });

  /**
   * ★ TR-T3 §4 hatte offen gelassen, ob eine Erwachsenenzeile ab ⇧ schon VOR ⇧ ankommt. Gemessen: nein - die echte Runde
   * (sie rechnet `umschalt` aus dem Lernstand) bringt bis `u` keine Zeile dieser Charge und keinen Grossbuchstaben.
   */
  it("vor ⇧ (Buchstaben bis u) bringt die echte Runde für Erwachsene keine Zeile dieser Charge und keinen Grossbuchstaben", () => {
    const { o } = grenzen();
    const intro = o.slice(0, 19);
    const echt = Math.random;
    let s = 2620;
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
        for (const z of adaptiveRound({ introduced: intro, focus: ["u"], stufe: "erwachsen", lang: "tr", lernweg: "tr", count: 12 })) {
          texte.push(z.text);
        }
      }
    } finally {
      Math.random = echt;
    }
    expect(texte.length).toBeGreaterThan(50);
    const erlaubt = allowedFromIntroduced(intro, "tr");
    const eigene = new Set(ZEILEN.flatMap((t) => [t, fitText(t, erlaubt, "tr") ?? t, kleinFuer(fitText(t, erlaubt, "tr") ?? t, "tr")]));
    expect(texte.filter((t) => eigene.has(t))).toEqual([]);
    expect(texte.filter(hatGrossbuchstaben)).toEqual([]);
  });
});

// ── Form: Satzanfang gross, nur Punkt und Komma, Apostroph nur am Namen, Regeln des Weges ──

const ERLAUBTE_ZEICHEN = /^[A-Za-zÇĞİÖŞÜçğıöşüâîû' ,.]+$/u;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) || !/^\p{Lu}/u.test(t) || t !== t.trim() || t.includes("  ") || /[,.]\S/u.test(t) || /\s[,.]/u.test(t) || !t.endsWith(".");

/** Feste und Feiertage (Auftrag: keine Feiertage, kein Bayram) - Wortanfänge, `İ`-sicher (Falle 89). */
const FEST = /(?<![\p{L}])(?:bayram|ramazan|kurban|kandil|nevruz|hıdrellez|cumhuriyet|yılbaşı|anıtkabir|atatürk|sevgililer|seçim|milletvekil|bakanı)/iu;

describe("TR-T6: Form und Regeln aller tr-Zeilen", () => {
  it("jede Zeile beginnt gross, endet mit Punkt und besteht nur aus Buchstaben, Apostroph, Punkt, Komma, einfachen Leerzeichen", () => {
    expect(ZEILEN.filter(formFehler)).toEqual([]);
  });

  it("Gegenprobe: klein am Anfang, ? ! : ; \" -, Komma ohne Leerzeichen, Leerzeichen vor Komma, ohne Punkt, e-Devlet", () => {
    for (const t of ["maaşım yattı.", "Geldin mi?", "Yaşasın!", "Not: yarın.", "Evet; hayır.", 'Dedi ki "gel".', "Başvuruyu e-Devlet üzerinden yaptım.", "Sinan,Nur.", "Sinan , Nur.", "Maaşım yattı"]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("İzmir'de kiralar çok yükseldi.")).toBe(false);
  });

  it("mindestens 18 Zeilen tragen ein Komma (gemessen 18)", () => {
    expect(ZEILEN.filter((t) => t.includes(",")).length).toBeGreaterThanOrEqual(18);
  });

  it("jede Zeile besteht die Regeln aller türkischen Zeilen (`helfer/trTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Etikett statt Person zuerst, ein Maus-Wort und eine Rollen-Anrede werden gemeldet", () => {
    expect(zeilenFehler("Kör adam için sesli kütüphane açıldı.").length).toBeGreaterThan(0);
    expect(zeilenFehler("Formu doldurmak için buraya tıklayın.").length).toBeGreaterThan(0);
    expect(zeilenFehler("Müdür Bey yarın izinde.").length).toBeGreaterThan(0);
  });

  it("kein Fest, kein Feiertag, kein Staatssymbol, keine Wahl", () => {
    expect(ZEILEN.filter((t) => FEST.test(t))).toEqual([]);
  });

  it("Gegenprobe: Bayram, Kurban, Cumhuriyet, Seçim werden gefunden - auch gross am Anfang -, „Bakanlıkta“ und „Kurumumuzda“ nicht", () => {
    for (const t of ["Bayramda köye gittik.", "Kurban bayramı izni.", "Cumhuriyet meydanında buluştuk.", "Seçim sandığına gittik."]) {
      expect(FEST.test(t), t).toBe(true);
    }
    expect(FEST.test("Ankara'da bakanlıkta memurum.")).toBe(false);
    expect(FEST.test("Kurumumuzda Linux tabanlı Pardus kullanılıyor.")).toBe(false);
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
 * Wie TR-T3: Türkisch hat kein grammatisches Geschlecht (Glossar §1 Regel 2), aber Wörter tragen es - „kocam", „karım",
 * „hamileyim", „gelin", „damat", Bey/Hanım/abla. Keine Zeile legt so fest, wer tippt. Neu gegenüber TR-T3: die Stadt
 * Kocaeli beginnt mit „koca" und ist KEIN Fund (beim Schreiben getroffen, `koca(?!eli)`).
 */
const GESCHLECHT =
  /(?<![\p{L}])(?:koca(?!eli)\p{L}*|karım|karımla|karıma|karımı|hamile\p{L}*|gelin\p{L}*|damat\p{L}*|bey|beyefendi|hanım\p{L}*|abla|abi|eltim|bacanağ\p{L}*|bacanak|erkeğim|kadınım|anneyim|babayım)(?![\p{L}])/iu;
const geschlechtFehler = (zeile: string): boolean => GESCHLECHT.test(zeile);

describe("TR-T6: keine Zeile legt das Geschlecht der tippenden Person fest", () => {
  it("kein Wort, das das Geschlecht der Person verrät, die tippt", () => {
    expect(ZEILEN.filter(geschlechtFehler)).toEqual([]);
  });

  it("Gegenprobe: „Kocam vardiyalı çalışıyor“, „Karım emekli“, „Hamileyim“, „Ali Bey“ werden gefunden, „Eşim Kocaeli'de …“, „Kayınvalidem …“ nicht", () => {
    for (const t of ["Kocam vardiyalı çalışıyor.", "Karım emekli oldu.", "Hamileyim, izin aldım.", "Ali Bey yarın gelir."]) {
      expect(geschlechtFehler(t), t).toBe(true);
    }
    for (const t of ["Eşim Kocaeli'de vardiyalı çalışıyor.", "Kayınvalidem bu hafta bizde kalıyor.", "Kocaeli sanayisinde gece vardiyası zor."]) {
      expect(geschlechtFehler(t), t).toBe(false);
    }
  });
});

// ── Orte, Namen, Apostroph ──────────────────────────────────────────────────

type Region = "MAR" | "EGE" | "AKD" | "IC" | "KAR" | "DOG" | "GDO";
/**
 * Jeder Ort der Charge mit seiner Region (amtliche sieben Regionen der Türkei). [G] - Sachangaben aus eigenem Wissen.
 * Tuzla, Üsküdar, Kadıköy, Ataşehir, Pendik sind İstanbuler Bezirke; Gemlik und Uludağ liegen bei Bursa, Ezine bei
 * Çanakkale, Gebze in Kocaeli, Kapıkule (Grenzübergang) in Edirne - alles Marmara. Kırkağaç gehört zu Manisa, Ayvalık zu
 * Balıkesir (Ege-Küste), Kütahya zur Ägäis-Region. Anamur und Mersin, Ceyhan (Adana), Isparta, Alanya (Antalya) und
 * Kahramanmaraş zählen zum Mittelmeer. Göreme liegt in Nevşehir, Gölbaşı bei Ankara. Siirt, Batman, Kilis und Adıyaman
 * gehören zu Südostanatolien.
 */
const ORTE: Readonly<Record<string, Region>> = {
  istanbul: "MAR", tuzla: "MAR", üsküdar: "MAR", kadıköy: "MAR", ataşehir: "MAR", pendik: "MAR", çanakkale: "MAR",
  gemlik: "MAR", uludağ: "MAR", bursa: "MAR", ezine: "MAR", gebze: "MAR", kocaeli: "MAR", kapıkule: "MAR", tekirdağ: "MAR",
  sakarya: "MAR",
  izmir: "EGE", çeşme: "EGE", denizli: "EGE", ege: "EGE", kütahya: "EGE", kırkağaç: "EGE", ayvalık: "EGE", muğla: "EGE",
  aydın: "EGE", manisa: "EGE", bodrum: "EGE",
  antalya: "AKD", anamur: "AKD", adana: "AKD", ceyhan: "AKD", ısparta: "AKD", mersin: "AKD", alanya: "AKD", hatay: "AKD",
  kahramanmaraş: "AKD",
  ankara: "IC", konya: "IC", eskişehir: "IC", sivas: "IC", kayseri: "IC", göreme: "IC", gölbaşı: "IC", nevşehir: "IC",
  rize: "KAR", karadeniz: "KAR", giresun: "KAR", zonguldak: "KAR", trabzon: "KAR", samsun: "KAR", sinop: "KAR", bolu: "KAR",
  erzurum: "DOG", erzincan: "DOG", van: "DOG", kars: "DOG", malatya: "DOG", elazığ: "DOG", hakkâri: "DOG",
  şanlıurfa: "GDO", siirt: "GDO", gaziantep: "GDO", diyarbakır: "GDO", mardin: "GDO", batman: "GDO", kilis: "GDO",
  adıyaman: "GDO",
};
/** Vornamen Erwachsener - heutige Namen aus der ganzen Türkei, auch kurdische (Rojda, Baran, Berfin). */
const NAMEN: ReadonlySet<string> = new Set(
  (
    "murat leyla nurten kemal sinan nur nurşen tarık umut defne ayşe onur utku rojda baran esin taner tuba yusuf damla " +
    "selin okan mesut nermin burak esra berfin kadir rukiye ferit elif"
  ).split(" "),
);
/** Teile von Eigennamen, die mitten im Satz gross stehen - in dieser Charge keine. */
const NAMENSTEILE: ReadonlySet<string> = new Set<string>();
/**
 * Andere Eigennamen und Zeichen, die gross stehen: das Ausland (Almanya, Hollanda), die Sprache (Türkçe), die
 * Brailleschrift, Ämter (SGK = Sozialversicherung, MHRS = zentrale Arzttermin-Vergabe), QR, die Tastaturen Q und F, Marken
 * aus dem Büroalltag (Excel, Linux, Pardus - das türkische Linux der Behörden -, Netflix, WhatsApp, Windows) und Expo
 * (Gelände der Expo 2016 in Antalya).
 */
const SONSTIGE_NAMEN: ReadonlySet<string> = new Set(
  "almanya hollanda türkçe braille sgk mhrs qr q f excel linux pardus netflix whatsapp windows expo".split(" "),
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

/** Ein Eigenname oder seine Ableitung (`Konyalı` = Ort + Endung, in {@link NEUE_FORMEN}). */
function istEigennameOderAbleitung(w: string): boolean {
  if (istEigenname(w)) return true;
  const form = NEUE_FORMEN[w];
  return form !== undefined && istEigenname(form[0]);
}

/** Regionen einer Zeile: Orte direkt, mit Endung (`İzmir'de`) oder als Ableitung (`Konyalı`). */
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

describe("TR-T6: Orte aus der ganzen Türkei, Eigennamen, Apostroph nur am Namen", () => {
  it("jedes grossgeschriebene Wort mitten im Satz ist ein bekannter Ort, Name, Namensteil oder Zeichen", () => {
    const fehler = ZEILEN.flatMap((t) => unbekannteGrosse(t).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /** GEMESSEN: Zeilen je Region (eine Zeile kann zwei Regionen tragen). */
  it("alle sieben Regionen kommen vor (je mindestens 11 Zeilen), keine steht in mehr als 22 Zeilen, mindestens 96 Zeilen verortet (gemessen 96: MAR 21, EGE 15, AKD 12, IC 14, KAR 13, DOG 11, GDO 12)", () => {
    const zahl = new Map<Region, number>();
    let verortet = 0;
    for (const t of ZEILEN) {
      const r = regionenDerZeile(t);
      if (r.size > 0) verortet++;
      for (const x of r) zahl.set(x, (zahl.get(x) ?? 0) + 1);
    }
    const bericht = [...zahl].map(([r, n]) => `${r} ${n}`).join(", ") + ` - verortet ${verortet}`;
    for (const r of ["MAR", "EGE", "AKD", "IC", "KAR", "DOG", "GDO"] as const) expect(zahl.get(r) ?? 0, `${r} - ${bericht}`).toBeGreaterThanOrEqual(11);
    expect([...zahl.values()].every((n) => n <= 22), bericht).toBe(true);
    expect(verortet, bericht).toBeGreaterThanOrEqual(96);
  });

  it("Gegenprobe: ein unbekannter Ort wird gemeldet, ein Satzanfang nicht; Ableitungen und Endungen zählen zur Region", () => {
    expect(unbekannteGrosse("Kuzenim Atlantis'te çalışıyor.")).toEqual(["Atlantis'te"]);
    expect(unbekannteGrosse("Maaşlar yattı.")).toEqual([]);
    expect([...regionenDerZeile("Konyalı çiftçiler kuraklıkla uğraşıyor.")]).toEqual(["IC"]);
    expect([...regionenDerZeile("Siirt'te büryan kebabı meşhurdur.")]).toEqual(["GDO"]);
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

  it("Gegenprobe: İzmir'da (Harmonie), Siirt'de (Angleichung), Murat'in und ein Gattungswort mit Apostroph werden gemeldet", () => {
    expect(endungFehler("izmir", "da")).toHaveLength(1);
    expect(endungFehler("siirt", "de")).toHaveLength(1);
    expect(endungFehler("murat", "in")).toHaveLength(1);
    expect(endungFehler("kars", "ta")).toEqual([]);
    expect(endungFehler("hakkâri", "ye")).toEqual([]);
    expect(endungFehler("sgk", "ya")).toEqual([]); // Abkürzung: gesprochen „se-ge-ka“, ohne Vokal im Wort nicht gerechnet
    expect(istEigenname("vergi")).toBe(false);
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
 * Lexikon-Nachtrag nimmt nur Formen mit mindestens zwei Tatoeba-Belegen; Wörter aus Amt, Arbeit und Gesundheit fehlen dort
 * oft). [G] - eigenes Sprachwissen, NICHT an einer Quelle belegt; das macOS-Wörterbuch prüft Türkisch nur halb (Falle 87) -
 * kein Beweis. Einige stehen nur als Stamm einer Form unten. ⚠️ Von keiner Person mit Türkisch als Erstsprache gelesen.
 */
const NEUE_GRUNDFORMEN: Readonly<Record<string, string>> = {
  abonelik: "Abonnement - nur als Stamm (erweicht „aboneliğ-“)",
  akşamüstü: "später Nachmittag, zusammengeschrieben (TDK)",
  anket: "Umfrage - nur als Stamm („anketine“)",
  atama: "Ernennung, Zuweisung („öğretmen atamaları“) - nur als Stamm",
  atölye: "Werkstatt - nur als Stamm („atölyemiz“)",
  avans: "Lohnvorschuss",
  ayçiçeği: "Sonnenblume, zusammengeschrieben (TDK) - Thrakien",
  beyanname: "Erklärung; „vergi beyannamesi“ = Steuererklärung - nur als Stamm",
  birim: "Abteilung, Dienststelle - nur als Stamm („aynı birimde“)",
  bornoz: "Bademantel (Denizli: Frottee und Bademäntel für die Ausfuhr)",
  bürokrasi: "Bürokratie",
  büryan: "„büryan kebabı“: Lamm aus der Grube, Spezialität aus Siirt",
  dağıt: "Stamm von dağıtmak (verteilen) - nur als Stamm",
  dernek: "Verein („emekli derneği“) - nur als Stamm (erweicht „derneğ-“)",
  dünür: "Mitschwiegereltern (Eltern des Ehepartners des eigenen Kindes) - nur als Stamm",
  düzenliyor: "Präsens von düzenlemek (veranstalten; e ⇒ i vor -yor)",
  eksi: "minus (Temperatur: „eksi yirmi derece“)",
  eşarp: "Seidentuch (Bursa ipeği)",
  forklift: "Gabelstapler, so übernommen",
  hasat: "Ernte - nur als Stamm (erweicht „hasad-“: hasadı, hasadında)",
  huzurevi: "Altenheim, zusammengeschrieben (TDK) - nur als Stamm („huzurevinde“)",
  iletildi: "Passiv-Vergangenheit von iletmek (übermitteln, weiterleiten)",
  imkân: "Möglichkeit (TDK mit â) - nur als Stamm („imkânı“)",
  izn: "Stamm von „izin“ mit Vokalausfall vor Vokal (izni, iznim, izne - TDK) - nur als Stamm",
  kardiyoloji: "Kardiologie (Fachgebiet im MHRS-Termin)",
  kargo: "Paketdienst",
  kayınvalide: "Schwiegermutter - Mutter des Ehepartners, sagt nichts über das Geschlecht der tippenden Person - nur als Stamm",
  komut: "Befehl; „sesli komut“ = Sprachbefehl - nur als Stamm",
  kreş: "Kinderkrippe, Kita (TR-T3 hatte nur „kreşi“)",
  kıdem: "Dienstalter; „kıdem tazminatı“ = Abfindung nach dem Arbeitsgesetz",
  lojistik: "Logistik",
  mandıra: "kleine Käserei, Molkerei - nur als Stamm",
  mühendis: "Ingenieurin, Ingenieur - nur als Stamm",
  mülakat: "Vorstellungsgespräch, mündliche Prüfung",
  narenciye: "Zitrusfrüchte (Mersin, Adana)",
  nikâh: "standesamtliche Trauung (TDK mit â)",
  okut: "Stamm von okutmak (scannen lassen: „QR kodu okutmak“) - nur als Stamm",
  otomotiv: "Fahrzeugindustrie (Bursa)",
  pilates: "Pilates - nur als Stamm („pilatese“)",
  psikoloğa: "zur Psychologin, zum Psychologen (psikolog, g ⇒ ğ vor Vokal, TDK)",
  rafineri: "Raffinerie (Batman) - nur als Stamm",
  refakatçi: "Begleitperson im Krankenhaus",
  sapsarı: "knallgelb (Verstärkung sap- vor sarı)",
  sera: "Gewächshaus (Antalya) - nur als Stamm",
  tahlil: "Laboruntersuchung („tahlil sonuçları“)",
  tayin: "Versetzung im öffentlichen Dienst - nur als Stamm",
  teknisyen: "Technikerin, Techniker - nur als Stamm",
  tekstil: "Textil (Denizli, Bursa)",
  tersane: "Werft (Tuzla) - nur als Stamm",
  tüp: "Flasche; „tüp gaz“ = Gasflasche zum Kochen",
  tıkanıyor: "Präsens von tıkanmak (verstopfen, sich stauen: „Çeşme yolu tıkanıyor“)",
  vardiya: "Schicht (Arbeit)",
  watt: "Watt (Leistung einer Glühbirne)",
  webinar: "Web-Seminar - nur als Stamm („webinara“)",
  yeniletmem: "Verbalnomen von yeniletmek (erneuern lassen) + 1. Person: „yeniletmem lazım“",
  yerleş: "Stamm von yerleşmek (sich niederlassen) - nur als Stamm",
  yetiştir: "Stamm von yetiştirmek (züchten, aufziehen) - nur als Stamm",
};

/**
 * Neue Formen = bekannter Stamm + Endung. Der Stamm stand im Wortschatz, in einer anderen tr-Charge, ist eine Grundform
 * oben oder ein Ort. Mit drittem Eintrag: der Stamm ist die ERWEICHTE Form dieses Wortes (p ⇒ b, ç ⇒ c, t ⇒ d, k ⇒ ğ vor
 * einem Vokal: talep ⇒ talebi, ilaç ⇒ ilacı, taksit ⇒ taksidi, bebek ⇒ bebeği). Die Endung ist ausgeschrieben, damit
 * Vokalharmonie und d/t-Angleichung NACHGERECHNET werden (Puffer `n y s` gehören zur Endung). Ein angehängtes „-ki“
 * (ofisteki) ist unveränderlich. Wo ein Verbstamm nicht im Wortschatz steht, ist eine bekannte Form der Stamm
 * (`bekledi` + `k`).
 */
const NEUE_FORMEN: Readonly<Record<string, readonly [string, string] | readonly [string, string, string]>> = {
  aboneliğimi: ["aboneliğ", "imi", "abonelik"], depozitoyu: ["depozito", "yu"], adresiniz: ["adres", "iniz"], alınmıştır: ["alınmıştı", "r"],
  ampullere: ["ampul", "lere"], anketine: ["anket", "ine"], artışını: ["artışı", "nı"], arızalı: ["arıza", "lı"],
  atamaları: ["atama", "ları"], atölyemiz: ["atölye", "miz"], bahçemiz: ["bahçe", "miz"], bahçemizi: ["bahçe", "mizi"],
  bakanlıkta: ["bakanlık", "ta"], bastonla: ["baston", "la"], bağladım: ["bağladı", "m"], başvurdum: ["başvurdu", "m"],
  başvurum: ["başvuru", "m"], başvurumu: ["başvuru", "mu"], başvuruyu: ["başvuru", "yu"], başındaydım: ["başında", "ydım"],
  bebeğin: ["bebeğ", "in", "bebek"], bekledik: ["bekledi", "k"], belgesi: ["belge", "si"], beyannamemi: ["beyanname", "mi"],
  beşinde: ["beş", "inde"], biletimizi: ["bilet", "imizi"], biletlerini: ["bilet", "lerini"], bilgisayarlara: ["bilgisayar", "lara"],
  birimde: ["birim", "de"], blokta: ["blok", "ta"], borcumuz: ["borc", "umuz", "borç"], bulunduk: ["bulundu", "k"],
  buzdolabını: ["buzdolabı", "nı"], bütçemiz: ["bütçe", "miz"], bütçemizi: ["bütçe", "mizi"], cihazımın: ["cihaz", "ımın"],
  dairesinde: ["daire", "sinde"], davetiyeleri: ["davetiye", "leri"], dağıtıldı: ["dağıt", "ıldı"], dereceydi: ["derece", "ydi"],
  dereceyi: ["derece", "yi"], derneği: ["derneğ", "i", "dernek"], değiştirdik: ["değiştirdi", "k"], dilekçeme: ["dilekçe", "me"],
  doktorda: ["doktor", "da"], doktoruna: ["doktor", "una"], dolmuşu: ["dolmuş", "u"], dosyanız: ["dosya", "nız"],
  dosyasında: ["dosya", "sında"], durulmaz: ["dur", "ulmaz"], duyuruları: ["duyuru", "ları"], döndük: ["döndü", "k"],
  dükkânımızı: ["dükkân", "ımızı"], dünürlerimiz: ["dünür", "lerimiz"], düğünü: ["düğün", "ü"], eczanede: ["eczane", "de"],
  ehliyetimi: ["ehliyet", "imi"], ekime: ["ekim", "e"], ekranımı: ["ekran", "ımı"], emekliler: ["emekli", "ler"],
  emeklilere: ["emekli", "lere"], emeklilikte: ["emeklilik", "te"], emekliliği: ["emekliliğ", "i", "emeklilik"],
  erteledim: ["erteledi", "m"], fabrikaları: ["fabrika", "ları"], fabrikasında: ["fabrika", "sında"], feribotu: ["feribot", "u"],
  firmasında: ["firma", "sında"], formda: ["form", "da"], fıstığının: ["fıstığ", "ının", "fıstık"],
  geliştiriyorum: ["geliştiriyor", "um"], gişesinde: ["gişe", "sinde"], grubundan: ["grub", "undan", "grup"],
  gurbette: ["gurbet", "te"], gurbetçi: ["gurbet", "çi"], gönüllüyüm: ["gönüllü", "yüm"], görüşmeye: ["görüşme", "ye"],
  gözlüğüm: ["gözlüğ", "üm", "gözlük"], hamsisi: ["hamsi", "si"], hasadı: ["hasad", "ı", "hasat"],
  hasadında: ["hasad", "ında", "hasat"], hastanesi: ["hastane", "si"], hastanesinde: ["hastane", "sinde"],
  hatırımızı: ["hatırı", "mızı"], hekimi: ["hekim", "i"], hekimimiz: ["hekim", "imiz"], hesapladım: ["hesap", "ladım"],
  hizmetleri: ["hizmet", "leri"], huzurevinde: ["huzurevi", "nde"], hâlimizi: ["hâl", "imizi"], ilacımı: ["ilac", "ımı", "ilaç"],
  imkânı: ["imkân", "ı"], imzaladık: ["imzaladı", "k"], imzanız: ["imza", "nız"], ipeğinden: ["ipeğ", "inden", "ipek"],
  izinde: ["izin", "de"], izinli: ["izin", "li"], izinliyim: ["izin", "liyim"], izne: ["izn", "e"], iznim: ["izn", "im"],
  iznimi: ["izn", "imi"], işçisiyim: ["işçi", "siyim"], işçiyim: ["işçi", "yim"], kalkmadı: ["kalk", "madı"],
  kalıyoruz: ["kalıyor", "uz"], kartıma: ["kart", "ıma"], kartımı: ["kart", "ımı"], kartınızı: ["kart", "ınızı"],
  katlandı: ["kat", "landı"], kavunu: ["kavun", "u"], kaydım: ["kaydı", "m"], kayınvalidem: ["kayınvalide", "m"],
  kimliğinizi: ["kimliğ", "inizi", "kimlik"], kiracı: ["kira", "cı"], kiralar: ["kira", "lar"], kiramızı: ["kira", "mızı"],
  kirası: ["kira", "sı"], kiraya: ["kira", "ya"], klimasız: ["klima", "sız"], kodla: ["kod", "la"], komutla: ["komut", "la"],
  komşumuzun: ["komşu", "muzun"], kontrole: ["kontrol", "e"], konutlar: ["konut", "lar"], konyalı: ["konya", "lı"],
  koşuyorum: ["koş", "uyorum"], kreşte: ["kreş", "te"], kullanıyoruz: ["kullanıyor", "uz"], kuraklıkla: ["kuraklık", "la"],
  kurumumuzda: ["kurum", "umuzda"], kömürü: ["kömür", "ü"], köpeğimle: ["köpeğim", "le"], köprüsünden: ["köprü", "sünden"],
  köyümüze: ["köy", "ümüze"], kütüphaneden: ["kütüphane", "den"], kıdemli: ["kıdem", "li"], kıyısına: ["kıyı", "sına"],
  kışlar: ["kış", "lar"], lisansa: ["lisans", "a"], maaştan: ["maaş", "tan"], maaşım: ["maaş", "ım"], maaşımın: ["maaş", "ımın"],
  maaşın: ["maaş", "ın"], mahallemize: ["mahalle", "mize"], mandırası: ["mandıra", "sı"], masam: ["masa", "m"],
  mayısta: ["mayıs", "ta"], memurlara: ["memur", "lara"], memurum: ["memur", "um"], menüyü: ["menü", "yü"],
  mesaideyim: ["mesai", "deyim"], mesaiye: ["mesai", "ye"], metrosu: ["metro", "su"], metroya: ["metro", "ya"],
  metroyla: ["metro", "yla"], mevsimlik: ["mevsim", "lik"], molada: ["mola", "da"], muhtarlıktan: ["muhtar", "lıktan"],
  muzunu: ["muz", "unu"], müdürlüğünde: ["müdür", "lüğünde"], müdürümüz: ["müdür", "ümüz"], mühendisim: ["mühendis", "im"],
  noterde: ["noter", "de"], noterden: ["noter", "den"], numaranız: ["numara", "nız"], ocaklarında: ["ocak", "larında"],
  ofisimiz: ["ofis", "imiz"], ofiste: ["ofis", "te"], ofisteki: ["ofis", "teki"], ofisçe: ["ofis", "çe"], okutup: ["okut", "up"],
  okuyucuya: ["okuyucu", "ya"], onaylattık: ["onay", "lattık"], otobüsleri: ["otobüs", "leri"], pahalandı: ["paha", "landı"],
  paketim: ["paket", "im"], pasaportumu: ["pasaport", "umu"], pastırması: ["pastırma", "sı"], pilatese: ["pilates", "e"],
  postacılık: ["postacı", "lık"], primlerim: ["prim", "lerim"], rafinerisinde: ["rafineri", "sinde"], randevusu: ["randevu", "su"],
  raporları: ["rapor", "ları"], rehberlik: ["rehber", "lik"], reçetemi: ["reçete", "mi"], saatlerimi: ["saat", "lerimi"],
  sanayisinde: ["sanayi", "sinde"], santralinde: ["santral", "inde"], satıyoruz: ["satıyor", "uz"], seralarında: ["sera", "larında"],
  servisi: ["servis", "i"], serviste: ["servis", "te"], sezonluk: ["sezon", "luk"], seçiyorum: ["seç", "iyorum"],
  sigortam: ["sigorta", "m"], sisten: ["sis", "ten"], sitesi: ["site", "si"], sonuçlarım: ["sonuç", "larım"],
  sorumlusuyum: ["sorumlu", "suyum"], soğuklar: ["soğuk", "lar"], soğuğu: ["soğuğ", "u", "soğuk"], sıranıza: ["sıra", "nıza"],
  tabanlı: ["taban", "lı"], tablosunda: ["tablo", "sunda"], taksidi: ["taksid", "i", "taksit"], taksitle: ["taksit", "le"],
  takvimini: ["takvim", "ini"], talebim: ["taleb", "im", "talep"], talebiniz: ["taleb", "iniz", "talep"], tanıdı: ["tanı", "dı"],
  tarihimiz: ["tarih", "imiz"], tarlasında: ["tarla", "sında"], tayini: ["tayin", "i"], tayinim: ["tayin", "im"],
  tazminatımı: ["tazminat", "ımı"], taşınıyoruz: ["taşınıyor", "uz"], teknisyenim: ["teknisyen", "im"],
  telefonuma: ["telefon", "uma"], telefonunuza: ["telefon", "unuza"], tersanelerinde: ["tersane", "lerinde"],
  torunlarla: ["torun", "larla"], torunlarıma: ["torun", "larıma"], torunlarını: ["torun", "larını"], treninde: ["tren", "inde"],
  tutanlar: ["tutan", "lar"], tutarınız: ["tutarı", "nız"], tutuyoruz: ["tutuyor", "uz"], tuşlayın: ["tuş", "layın"],
  uçuşum: ["uçuş", "um"], vadisinde: ["vadi", "sinde"], valizimi: ["valiz", "imi"], vapuruna: ["vapur", "una"],
  vardiyadayız: ["vardiya", "dayız"], vardiyalı: ["vardiya", "lı"], vardiyalıyım: ["vardiya", "lıyım"], vardiyam: ["vardiya", "m"],
  vardiyası: ["vardiya", "sı"], vergimi: ["vergi", "mi"], webinara: ["webinar", "a"], yakınları: ["yakın", "ları"],
  yanınızda: ["yan", "ınızda"], yapmamı: ["yapma", "mı"], yarımadasında: ["yarımada", "sında"], yatmamış: ["yat", "mamış"],
  yatırıyoruz: ["yatır", "ıyoruz"], yazları: ["yaz", "ları"], yenilendi: ["yenilen", "di"], yerleşmek: ["yerleş", "mek"],
  yerleştik: ["yerleş", "tik"], yetiştim: ["yetişti", "m"], yetiştiren: ["yetiştir", "en"], yolculuğu: ["yolculuğ", "u", "yolculuk"],
  yumurtası: ["yumurta", "sı"], yöneticim: ["yönetici", "m"], yükledim: ["yük", "ledim"], zamlandı: ["zam", "landı"],
  zamlardan: ["zam", "lardan"], çarşısında: ["çarşı", "sında"], çiftçiyi: ["çiftçi", "yi"], çinisinden: ["çini", "sinden"],
  çoğaldı: ["çoğ", "aldı", "çok"], ölçüm: ["ölçü", "m"], özgeçmişimi: ["özgeçmiş", "imi"], ücretim: ["ücret", "im"],
  ücretli: ["ücret", "li"], üretiyoruz: ["üretiyor", "uz"], şartlarda: ["şart", "larda"], şifremi: ["şifre", "mi"],
  şifreniz: ["şifre", "niz"], şirketteyim: ["şirket", "teyim"], şoförlük: ["şoför", "lük"],
};

const HINTEN = new Set(["a", "ı", "o", "u", "â", "û"]);
const VOKALE = new Set(["a", "e", "ı", "i", "o", "ö", "u", "ü", "â", "î", "û"]);
const STIMMLOS = new Set(["ç", "f", "h", "k", "p", "s", "ş", "t"]);
/**
 * Lehnwörter mit hinterem Vokal, die HELLE Endungen nehmen (TDK, Ausnahmen der großen Vokalharmonie: saat ⇒ saatleri,
 * kontrol ⇒ kontrole, ampul ⇒ ampuller, hâl ⇒ hâli, santral ⇒ santrali). Nur, was die Charge braucht.
 */
const HELLE_ENDUNG: ReadonlySet<string> = new Set(["saat", "kontrol", "ampul", "hâl", "santral"]);
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
 * (ofisteki) ist unveränderlich und wird nicht geprüft. `â î û` gelten als a i u (Hakkâri ⇒ -ye).
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
/** Nach einem Zahlwort steht die Einzahl (Glossar Regel 5): „kırk yıl“, nie „kırk yıllar“. */
function mehrzahlNachZahl(zeile: string): string[] {
  const w = woerterKlein(zeile);
  return w.filter((x, i) => i > 0 && ZAHLWOERTER.has(w[i - 1]) && /l[ae]r(?:ı|i|a|e|da|de|dan|den|ın|in)?$/u.test(x));
}

describe("TR-T6: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("★ Wortbudget Erwachsene: über ALLE tr-Erwachsenenzeilen (TR-T3 + TR-T6, später TR-T9) steht kein Inhaltswort in mehr als 8 Zeilen", () => {
    expect(ERWACHSENE_ANDERE().length).toBeGreaterThanOrEqual(ERWACHSENE_T3.length);
    const fehler = zuHaeufig([...ZEILEN, ...ERWACHSENE_ANDERE()]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross und mit Punkt), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Kira" : "kira"} ve ${"abcdefghi"[i]}.`);
    expect(zuHaeufig(neun)).toEqual(['"kira": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - Kern, Wortbasis, gefaltet (ı→i ş→s …) und kein unerwünschtes Themenwort", () => {
    const fehler = ZEILEN.flatMap((t) =>
      woerterOhneZeichen(t).filter((w) => gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w)).map((w) => `"${t}": ${w}`),
    );
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: sik (Kern), und was beim Schreiben anschlug (sıkışık, kaşar) - vardiya, mandıra, tazminat nicht", () => {
    expect(istKernGesperrtTr("sik")).toBe(true);
    for (const w of ["sıkışık", "kaşar"]) expect(gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w), w).toBe(true);
    for (const w of ["vardiya", "mandıra", "tazminat", "kocaeli"]) expect(gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w), w).toBe(false);
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

  it("Gegenprobe: falsche Harmonie, falsche Angleichung, falsche Erweichung; helle Endungen; -ki unveränderlich; ein erfundenes Wort", () => {
    expect(endungFehler("ofis", "de")).toHaveLength(1);
    expect(endungFehler("kontrol", "a")).toHaveLength(1); // TDK: kontrol, -lü - also „kontrole“
    expect(endungFehler("kontrol", "e")).toEqual([]);
    expect(endungFehler("santral", "inde")).toEqual([]);
    expect(endungFehler("maaş", "dan")).toHaveLength(1);
    expect(endungFehler("vardiya", "ta")).toHaveLength(1);
    expect(endungFehler("ofis", "teki")).toEqual([]);
    expect(endungFehler("ofis", "taki")).toHaveLength(1);
    expect(erweicht("talep")).toBe("taleb");
    expect(erweicht("taksit")).toBe("taksid");
    expect(erweicht("ilaç")).toBe("ilac");
    expect(ungeprueft(["Vardiya bitti.", "Vardiyya bitti."])).toEqual(["vardiyya"]);
  });

  it("nach einem Zahlwort steht die Einzahl", () => {
    const fehler = ZEILEN.flatMap((z) => mehrzahlNachZahl(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „kırk yıllar“, „Dört yıllar.“ werden gemeldet, „kırk yıl“ und „yıllar dört“ nicht", () => {
    expect(mehrzahlNachZahl("Babam kırk yıllar gurbette kaldı.")).toEqual(["yıllar"]);
    expect(mehrzahlNachZahl("Dört yıllar.")).toEqual(["yıllar"]);
    expect(mehrzahlNachZahl("Babam kırk yıl gurbette kaldı.")).toEqual([]);
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

describe("TR-T6: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der ç ğ ı ş nicht kennt)", () => {
    expect(new Set(ZEILEN).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("Gegenprobe: „Çarşı kalabalık.“/„Şarşı kalabalık.“ teilen den Schlüssel", () => {
    expect(bausteinKey("satz", "Çarşı kalabalık.")).toBe(bausteinKey("satz", "Şarşı kalabalık."));
  });

  it("keine Zeile gleicht einer Zeile der Wege de/en/fr/es/it/pl/cs oder einer anderen tr-Charge (Text oder Schlüssel)", () => {
    const fremd = [...FREMDE_KORPORA(), ...ANDERE_TR()];
    expect(fremd.length).toBeGreaterThan(1000);
    const ohne = (t: string) => kleinFuer(t, "tr").replace(/[.,!?;:"]/gu, "");
    const texte = new Set(fremd.map((i) => ohne(i.text)));
    const schluessel = new Set(fremd.map((i) => bausteinKey(i.kind, i.text)));
    expect(CHARGE.filter((i) => texte.has(ohne(i.text)) || schluessel.has(bausteinKey(i.kind, i.text))).map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine TR-T3-Zeile ist über die ROHE Liste erkannt, die Charge selbst nicht", () => {
    const andere = new Set(ANDERE_TR().map((i) => bausteinKey(i.kind, i.text)));
    expect(andere.has(bausteinKey("satz", ERWACHSENE_T3[0]))).toBe(true);
    expect(andere.has(bausteinKey("satz", ZEILEN[0]))).toBe(false);
    expect(ANDERE_TR().length).toBe(TR_ROH.length - CHARGE.length);
  });

  it("keine Paare in der Charge und keines mit einer anderen tr-Zeile (nur Person oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN, ANDERE_TR_ZEILEN());
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ben/sen und Einzahl/Mehrzahl werden als Paar erkannt", () => {
    expect(paare(["Ben de geldim.", "Sen de geldim."])).toHaveLength(1);
    expect(paare(["Konutlar teslim edildi."], ["Konut teslim edildi."])).toHaveLength(1);
    expect(paare(["Maaşlar yattı."], ["Maaş yatmadı."])).toEqual([]);
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

describe("TR-T6: keine Kopie und nichts fast gleich - gegen Korpora, Serien und Prüfungstext-Banken aller Sprachen", () => {
  it("die Vergleichsmenge ist voll (Serien und Banken geladen, pl/cs, TR-T1 bis TR-T5)", () => {
    expect(bankZeilen().length).toBeGreaterThan(1000);
    expect(SERIEN.length).toBeGreaterThan(100);
    expect(CORPUS_PL.length).toBeGreaterThan(0);
    expect(CORPUS_CS.length).toBeGreaterThan(0);
    expect(ANDERE_TR().length).toBeGreaterThanOrEqual(
      ERWACHSENE_T3.length + CORPUS_TR_WEG_FRUEH_KIDS.length + CORPUS_TR_WEG_FRUEH_TEENS.length + CORPUS_TR_WEG_MITTE_TEENS.length,
    );
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

  it("Gegenprobe: Serienzeile, Banken-Satz, TR-T3-Zeile als Kopie; beim Schreiben gemieden (Kolay gelsin, iyi akşamlar) als fast gleich", () => {
    const fremd = new Set(alleFremdenZeilen().map(ohneZeichen));
    expect(fremd.has(ohneZeichen(SERIEN[0].etappen[0].lines[0]))).toBe(true);
    expect(fremd.has(ohneZeichen(bankZeilen()[0].split(/(?<=[.!?])\s+/u)[0]))).toBe(true);
    expect(fremd.has(ohneZeichen(ERWACHSENE_T3[0]))).toBe(true);
    expect(fastGleich(wortMenge("Kolay gelsin, iyi akşamlar."), wortMenge("İyi çalışmalar, kolay gelsin."))).toBe(true);
    expect(fastGleich(wortMenge("Pazar kahvaltısını hep birlikte yapıyoruz."), wortMenge("Pazar kahvaltısını hep birlikte yaparız."))).toBe(true);
    expect(fastGleich(wortMenge("Torunum yürümeye başladı."), wortMenge("Torunum okula başladı."))).toBe(false);
  });
});

describe("TR-T6: Korpus-Anker und Auslieferung", () => {
  it("die rohe Sammelliste trägt die Charge als geschlossenen Block HINTER TR-T5, und korpusFuer(\"tr\") jede Zeile", () => {
    const start = TR_ROH.indexOf(CHARGE[0]);
    expect(start).toBeGreaterThan(TR_ROH.indexOf(CORPUS_TR_WEG_MITTE_TEENS[CORPUS_TR_WEG_MITTE_TEENS.length - 1]));
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
    const probe = { text: "Zzz probe tr t6.", kind: "satz" as const, stufen: ["erwachsen" as const] };
    const ids = manifestFor([...FREMDE_KORPORA(), ...CORPUS_TR, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("Weg „tr“ bekommt Erwachsenen an Sprosse q jede Zeile dieser Charge - und nur eigene tr-Erwachsenenzeilen", () => {
    const { letzte, o } = grenzen();
    const allowed = allowedFromIntroduced(o.slice(0, letzte), "tr");
    const geliefert = corpusItemsFor({ stufe: "erwachsen", allowed, lang: "tr", lernweg: "tr", umschalt: true });
    expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
    const eigeneErwachsene = new Set(
      CORPUS_TR.filter((i) => i.nurWeg === "tr" && i.stufen.includes("erwachsen")).flatMap((i) => [i.text, fitText(i.text, allowed, "tr") ?? i.text]),
    );
    expect(geliefert.filter((t) => !eigeneErwachsene.has(t))).toEqual([]);
  });

  /** D-2 gemessen: vor ⇧ (`umschalt: false`, wie der Generator fragt) kommt von dieser Charge NICHTS an. */
  it("vor ⇧ (Sprosse 19, umschalt: false) kommt keine Zeile dieser Charge an - an 20 (umschalt: true) nur die ⇧-Zeilen", () => {
    const { o, shift } = grenzen();
    const vorher = allowedFromIntroduced(o.slice(0, shift - 1), "tr");
    const vor = new Set(corpusItemsFor({ stufe: "erwachsen", allowed: vorher, lang: "tr", lernweg: "tr", umschalt: false }));
    expect(ZEILEN.filter((t) => vor.has(fitText(t, vorher, "tr") ?? "") || vor.has(kleinFuer(t, "tr")))).toEqual([]);
    expect([...vor].filter(hatGrossbuchstaben)).toEqual([]);
    const an = allowedFromIntroduced(o.slice(0, shift), "tr");
    const geliefert = new Set(corpusItemsFor({ stufe: "erwachsen", allowed: an, lang: "tr", lernweg: "tr", umschalt: true }));
    const hier = ZEILEN.filter((t) => geliefert.has(fitText(t, an, "tr") ?? ""));
    expect(hier.length).toBeGreaterThanOrEqual(16);
    expect(hier.filter((t) => sprosseAuf(t) !== 20)).toEqual([]);
  });

  it("Gegenprobe (zweite Sicherung): fragt ein Aufrufer an Sprosse 19 OHNE umschalt, kommen nur die ⇧-Zeilen an - keine mit z bis q", () => {
    const { o } = grenzen();
    const allowed = allowedFromIntroduced(o.slice(0, 19), "tr");
    const geliefert = new Set(corpusItemsFor({ stufe: "erwachsen", allowed, lang: "tr", lernweg: "tr" }));
    const hier = ZEILEN.filter((t) => geliefert.has(fitText(t, allowed, "tr") ?? ""));
    expect(hier.length).toBeGreaterThanOrEqual(16);
    expect(hier.filter((t) => sprosseAuf(t) !== 20)).toEqual([]);
  });

  it("Kinder und Jugendliche auf Weg „tr“ bekommen keine Zeile dieser Charge", () => {
    const { letzte, o } = grenzen();
    const allowed = allowedFromIntroduced(o.slice(0, letzte), "tr");
    for (const stufe of ["kids", "teens"] as const) {
      const geliefert = corpusItemsFor({ stufe, allowed, lang: "tr", lernweg: "tr" });
      expect(ZEILEN.filter((t) => geliefert.includes(t)), stufe).toEqual([]);
    }
  });

  it("Weg „de“ und Weg „it“ bekommen keine dieser Zeilen", () => {
    setLayout("de");
    const de = corpusItemsFor({ stufe: "erwachsen", allowed: allowedFromIntroduced(introOrder("de"), "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const it_ = corpusItemsFor({ stufe: "erwachsen", allowed: allowedFromIntroduced(introOrder("it"), "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
