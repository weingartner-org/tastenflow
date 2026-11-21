/**
 * ★★★ Wächter TR-T7 (09.10.2026): die türkischen Kindertexte am Ende des Lernwegs (`corpusTrWegEndeKids.ts`, Sprossen 38-76
 * auf `tr-q` = `?` bis `½`). Aufbau aus TR-T4 (`tastenflow-texte-tr-kids-mitte`: Orte, Apostroph-Endungen, Belege, Wortbudget
 * Kinder) und PL-T7 (`tastenflow-texte-pl-kids-ende`: volle Sprosse, gekürzt serviert, Paare, Zahlen, Auslieferung am Ende);
 * Befund `BEFUND-2026-10-09-TR-T7-KIDS-ENDE.md`, Leitfaden Fallen 26/31/37/45/48/51/58/76/87-91.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, an dem `fitText` sie UNGEKÜRZT liefert
 * (`introOrder("tr").slice(0, n)`). `? ! : " ; -` sind weglassbar - vor ihrer Sprosse kommt die Zeile gekürzt; darum trägt
 * jede Zeile einen Buchstaben ab `z` (keine kommt vor Sprosse 23 an), und keine gekürzte Fassung hat ein grosses Wort mitten
 * im Satz, das kein Name ist (Weg „tr" hat keine Frühfassungen, `scripts/_fruehfassung.mts` liest nur de/en/fr/es).
 * Ziffern, Zeichen ab `%`, `€ ₺ ½` sind hart. Jede Regel hat eine Gegenprobe: der Prüfer muss einen gebauten Fehler finden.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
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
import { CORPUS_TR_WEG_MITTE_KIDS } from "../src/lib/typing/corpusTrWegMitteKids";
import { CORPUS_TR_WEG_MITTE_TEENS } from "../src/lib/typing/corpusTrWegMitteTeens";
import { CORPUS_TR_WEG_MITTE_ERWACHSENE } from "../src/lib/typing/corpusTrWegMitteErwachsene";
import { CORPUS_TR_WEG_ENDE_KIDS } from "../src/lib/typing/corpusTrWegEndeKids";
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

const CHARGE = CORPUS_TR_WEG_ENDE_KIDS;
const ZEILEN = CHARGE.map((i) => i.text);
const EIGENE = new Set(ZEILEN);
/** Alle ANDEREN tr-Zeilen aus der ROHEN Sammelliste (TR-T1 bis TR-T5 und jede spätere Charge), nach Objekt - nie nach Text. */
const ANDERE_TR = () => TR_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_TR_ZEILEN = (): string[] => ANDERE_TR().map((i) => i.text);
/** Die Chargen, die in der rohen Liste VOR dieser stehen (für „trägt die Beleg-Liste nur Nötiges?", TR-T3 §3c). */
const FRUEHERE_TR = () => TR_ROH.slice(0, TR_ROH.indexOf(CHARGE[0]));
/** Die früheren Kinder-Chargen: das Wortbudget gilt über alle drei (Falle 45). */
const KINDER_T1 = CORPUS_TR_WEG_FRUEH_KIDS.map((i) => i.text);
const KINDER_T4 = CORPUS_TR_WEG_MITTE_KIDS.map((i) => i.text);

// ── Sprossen ────────────────────────────────────────────────────────────────

const ordnung = (): string[] => {
  setLayout("tr-q");
  return introOrder("tr");
};
const allowedCache = new Map<number, Set<string>>();
function allowedAt(n: number): Set<string> {
  const o = ordnung();
  let s = allowedCache.get(n);
  if (!s) {
    s = allowedFromIntroduced(o.slice(0, n), "tr");
    allowedCache.set(n, s);
  }
  return s;
}
const sprosseVon = (einheit: string): number => ordnung().indexOf(einheit) + 1;

/** Kleinste Sprosse, ab der die Zeile VOLLSTÄNDIG erscheint (null = nie). */
const volleCache = new Map<string, number | null>();
function volleSprosse(text: string): number | null {
  if (volleCache.has(text)) return volleCache.get(text)!;
  const n0 = ordnung().length;
  let erg: number | null = null;
  for (let n = 1; n <= n0; n++) {
    if (fitText(text, allowedAt(n), "tr") === text) {
      erg = n;
      break;
    }
  }
  volleCache.set(text, erg);
  return erg;
}
/** Die Einheit dieser Sprosse („?" für eine Frage, „7" für eine Zeile mit 7 …). */
function volleEinheit(text: string): string | null {
  const n = volleSprosse(text);
  return n === null ? null : ordnung()[n - 1];
}
/** Kleinste Sprosse, ab der die Zeile überhaupt (gekürzt) serviert wird. */
function ersteSprosse(text: string): number | null {
  const n0 = ordnung().length;
  for (let n = 1; n <= n0; n++) if (fitText(text, allowedAt(n), "tr") !== null) return n;
  return null;
}

/** Feste Paare: die öffnende Hälfte hat keine eigenen Zeilen, die Zeile zählt beim Gegenstück. */
const OHNE_EIGENE_ZEILEN = new Set(["(", "[", "{"]);

describe("TR-T7: jede Zeile an ihrer Sprosse (tr-q)", () => {
  it("die Folge nach q: ? ! : \" ; - ( ) 1-9 0 % & / + * = _ > < $ @ # [ ] { } \\ | € ₺ ½ (38-76)", () => {
    const o = ordnung();
    expect(sprosseVon("q")).toBe(37);
    expect(sprosseVon("z")).toBe(23);
    expect(o.length).toBe(76);
    expect(o.slice(37).join(" ")).toBe("? ! : \" ; - ( ) 1 2 3 4 5 6 7 8 9 0 % & / + * = _ > < $ @ # [ ] { } \\ | € ₺ ½");
  });

  it("jede Zeile erscheint vollständig NACH q, kommt nie vor z (23) überhaupt an, und minTier stimmt", () => {
    const fehler: string[] = [];
    for (const item of CHARGE) {
      const v = volleSprosse(item.text);
      const e = ersteSprosse(item.text);
      if (v === null || v <= sprosseVon("q")) fehler.push(`"${item.text}": volle Sprosse ${v}`);
      if (e === null || e < sprosseVon("z")) fehler.push(`"${item.text}": schon an Sprosse ${e} serviert (vor z)`);
      const tier = minTierFor(item.text, "tr");
      if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
    }
    expect(fehler, fehler.slice(0, 12).join("\n")).toEqual([]);
  });

  it("die Einträge stehen nach voller Sprosse sortiert", () => {
    const s = ZEILEN.map((t) => volleSprosse(t) as number);
    expect(s).toEqual([...s].sort((a, b) => a - b));
  });

  it("Gegenprobe: Sprossen und Einheiten werden richtig gerechnet", () => {
    expect(volleEinheit("Çorbaya biraz nane ekleyelim mi?")).toBe("?");
    expect(ersteSprosse("Çorbaya biraz nane ekleyelim mi?")).toBe(sprosseVon("ç")); // gekürzt schon an ç
    expect(ersteSprosse("Sus, bebek uyuyor!")!).toBeLessThan(sprosseVon("z")); // ohne späten Buchstaben: viel zu früh
    expect(volleEinheit("Not: yarın beslenmeye meyve getirilecek.")).toBe(":");
    expect(volleEinheit("Kuzenim Mert (benden büyük) yüzme takımında.")).toBe(")");
    expect(volleEinheit("Elif 11 yaşına bastı.")).toBe("1");
    expect(ersteSprosse("Elif 11 yaşına bastı.")).toBe(sprosseVon("1")); // Ziffern sind hart
    expect(volleEinheit("Servis her gün 7.15 gibi kapımızda.")).toBe("7");
    expect(volleEinheit("Okul saat 08.30 gibi başlıyor.")).toBe("0");
    expect(volleEinheit("Pazardan 2,5 kilo kiraz aldık.")).toBe("5");
    expect(volleEinheit("Mahalle maçında 3-2 yenildik.")).toBe("3");
    expect(volleEinheit("Kümeler {a, b, c} gibi yazılır.")).toBe("}");
    expect(volleEinheit("Simitçi simidi ₺15 yaptı.")).toBe("₺");
    expect(volleEinheit("Keke ½ su bardağı süt ekledik.")).toBe("½");
    // Vor 43 wird der Bindestrich zur Lücke: „Ankara İstanbul treni" (zwei Orte gross - erlaubt).
    expect(fitText("Ankara-İstanbul treni çok hızlı gidiyor.", allowedAt(sprosseVon("q")), "tr")).toBe("Ankara İstanbul treni çok hızlı gidiyor.");
  });

  /**
   * GEMESSEN am Ende von TR-T7 (vom Code gezählt, Einheit der vollen Sprosse) - darf künftig nur STEIGEN, nie unter 7.
   * `(`, `[` und `{` haben keine eigenen Zeilen.
   */
  const MINDESTENS_JE_EINHEIT: Record<string, number> = {
    "?": 34, "!": 26, ":": 15, '"': 13, ";": 7, "-": 14, ")": 9,
    "1": 10, "2": 10, "3": 10, "4": 10, "5": 10, "6": 10, "7": 10, "8": 10, "9": 10, "0": 12,
    "%": 8, "&": 7, "/": 7, "+": 7, "*": 7, "=": 7, "_": 7, ">": 7, "<": 7, "$": 7, "@": 7, "#": 7,
    "]": 7, "}": 7, "\\": 7, "|": 7, "€": 7, "₺": 8, "½": 7,
  };

  it("je Einheit mindestens so viele Zeilen wie gemessen, jede Einheit mindestens 7, ( [ { ohne eigene Zeilen", () => {
    const anzahl = new Map<string, number>();
    for (const t of ZEILEN) {
      const e = volleEinheit(t);
      if (e !== null) anzahl.set(e, (anzahl.get(e) ?? 0) + 1);
    }
    const zuWenig: string[] = [];
    for (const [e, min] of Object.entries(MINDESTENS_JE_EINHEIT)) {
      if ((anzahl.get(e) ?? 0) < Math.max(7, min)) zuWenig.push(`„${e}": ${anzahl.get(e) ?? 0} < ${Math.max(7, min)}`);
    }
    for (const [e, n] of anzahl) if (n < 7) zuWenig.push(`„${e}": nur ${n}`);
    for (const e of OHNE_EIGENE_ZEILEN) expect(anzahl.has(e), e).toBe(false);
    expect(zuWenig, zuWenig.join("\n")).toEqual([]);
    expect([...anzahl.values()].reduce((a, b) => a + b, 0)).toBe(ZEILEN.length);
  });
});

describe("TR-T7: jede Zeile übt die Einheit ihrer Sprosse (W6, Falle 37)", () => {
  it("jede Zeile enthält die Einheit ihrer vollen Sprosse, jede Einheit ab ? hat Zeilen", () => {
    const ohne = ZEILEN.filter((t) => {
      const e = volleEinheit(t);
      return e === null || !t.includes(e);
    });
    expect(ohne, ohne.join("\n")).toEqual([]);
    const o = ordnung();
    const fehlt: string[] = [];
    for (let n = sprosseVon("?"); n <= o.length; n++) {
      if (OHNE_EIGENE_ZEILEN.has(o[n - 1])) continue;
      if (!ZEILEN.some((t) => volleSprosse(t) === n && t.includes(o[n - 1]))) fehlt.push(`${n}:${o[n - 1]}`);
    }
    expect(fehlt, "Einheiten ohne Zeile").toEqual([]);
  });

  it("Gegenprobe: eine Frage ohne ? gehört nicht zu ?", () => {
    expect(volleEinheit("Çorbaya biraz nane ekleyelim mi.")).not.toBe("?");
  });

  it("in echten Runden (Mein Training, Kinder) kommen an der Sprosse von ? Fragen dieser Charge an (Fokus ?)", () => {
    const intro = ordnung().slice(0, sprosseVon("?"));
    const echt = Math.random;
    let s = 3807;
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
        for (const z of adaptiveRound({ introduced: intro, focus: ["?"], stufe: "kids", lang: "tr", lernweg: "tr", count: 12 })) {
          texte.push(z.text);
        }
      }
    } finally {
      Math.random = echt;
    }
    expect(texte.some((t) => EIGENE.has(t) && t.endsWith("?")), texte.slice(0, 12).join(" / ")).toBe(true);
  });
});

// ── Paare: ( ) [ ] { } und "" nie halb ───────────────────────────────────────

function paarFehler(t: string): string[] {
  const f: string[] = [];
  for (const [auf, zu] of [["(", ")"], ["[", "]"], ["{", "}"]] as const) {
    let offen = 0;
    for (const ch of t) {
      if (ch === auf) offen++;
      if (ch === zu) {
        if (offen === 0) f.push(`„${zu}" ohne „${auf}"`);
        else offen--;
      }
    }
    if (offen > 0) f.push(`„${auf}" ohne „${zu}"`);
  }
  if ((t.match(/"/g) ?? []).length % 2) f.push('„"" ungerade');
  return f;
}

describe("TR-T7: Klammern und Anführungszeichen nie halb", () => {
  it("jede Zeile schliesst, was sie öffnet", () => {
    const fehler = ZEILEN.flatMap((t) => paarFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: halbe Paare werden gefunden; fitText serviert eine Klammer nie halb", () => {
    expect(paarFehler("Köpeğimiz Pamuk (beyaz bahçede uyuyor.")).toHaveLength(1);
    expect(paarFehler('Ninem bana "kuzum der.')).toHaveLength(1);
    expect(paarFehler("Liste [1, 2 yazılır.")).toHaveLength(1);
    expect(paarFehler('Ninem bana hep "kuzum" der (her gün).')).toEqual([]);
    const nurAuf = new Set([...allowedAt(sprosseVon("(") - 1), "("]);
    expect(fitText("Köpeğimiz Pamuk (beyaz) uyuyor.", nurAuf, "tr")).toBeNull();
  });
});

// ── Form und Zahlen ─────────────────────────────────────────────────────────

const ERLAUBT = /^[A-Za-zÇĞİÖŞÜçğıöşüâîû0-9 .,:;?!"'()\-[\]{}%&/+*=_<>$@#\\|€₺½]+$/u;

/** Form-Verstösse einer Zeile (Zeichen, Satzanfang, Satzschluss, Leerzeichen). */
function formFehler(t: string): string[] {
  const f: string[] = [];
  if (!ERLAUBT.test(t)) f.push("Zeichen ausserhalb des Satzes");
  if (/ {2}/.test(t) || t !== t.trim()) f.push("Leerzeichen");
  if (!/^"?\p{Lu}/u.test(t)) f.push("beginnt nicht mit einem Grossbuchstaben");
  if (!/[.!?]"?$/.test(t)) f.push("kein Satzschluss am Ende");
  if (/ [.,:;?!](?=\s|$)/.test(t)) f.push("Leerzeichen vor Satzzeichen");
  if (/[([{] (?![\]}])/.test(t)) f.push("Leerzeichen nach öffnender Klammer");
  if (/,[^ ]/.test(t.replace(/\d,\d/g, "0"))) f.push("kein Leerzeichen nach Komma (Dezimalkomma 2,5 ausgenommen)");
  return f;
}

/**
 * Zahlformat (Glossar §1 Regel 5/6, TDK): Uhrzeit mit PUNKT (08.30 - Stunde ≤ 23, Minuten zweistellig ≤ 59), nie mit
 * Doppelpunkt zwischen Ziffern; Dezimalkomma (2,5); ein Punkt zwischen Ziffern ist sonst nur Tausenderpunkt (1.600);
 * Prozent und Währung VOR der Zahl (zeilenFehler); Ordnungszahl mit Punkt (3. sınıf) ist erlaubt; keine Endung an einer Zahl.
 */
function zahlFehler(t: string): string[] {
  const f: string[] = [];
  if (/\d:\d/.test(t)) f.push("Doppelpunkt zwischen Ziffern (Uhrzeit TDK mit Punkt: 08.30)");
  for (const m of t.matchAll(/\d+(?:\.\d+)+/g)) {
    const z = m[0];
    const uhr = /^(\d{1,2})\.(\d{2})$/.exec(z);
    const tausend = /^\d{1,3}(?:\.\d{3})+$/.test(z);
    if (uhr && Number(uhr[1]) <= 23 && Number(uhr[2]) <= 59 && !tausend) continue;
    if (tausend && !uhr) continue;
    f.push(`Zahl ${z}: weder Uhrzeit noch Tausenderpunkt`);
  }
  if (/\d\.\d{3}(?!\d)/.test(t) && /\b\d{1,2}\.\d{2}\b/.test(t.replace(/\d{1,3}(?:\.\d{3})+/g, ""))) f.push("Uhrzeit und Tausenderpunkt in einer Zeile");
  for (const m of t.matchAll(/(?<![\d.,])\d{4}(?![\d.,])/g)) f.push(`vierstellige Zahl ${m[0]} ohne Tausenderpunkt`);
  if (/\d'/.test(t)) f.push("Endung an einer Zahl");
  return f;
}

/** Feste und Feiertage (Auftrag: keine Feiertage, kein Bayram) - Wortanfänge, `İ`-sicher (Falle 89). */
const FEST = /(?<![\p{L}])(?:bayram|ramazan|kurban|kandil|nevruz|hıdrellez|cumhuriyet|yılbaşı|anıtkabir|atatürk|cami|bayrak|asker)/iu;

describe("TR-T7: Form, Zahlen, Regeln aller tr-Zeilen", () => {
  it("Satzanfang gross, Satzschluss am Ende, Leerzeichen richtig, nur erlaubte Zeichen", () => {
    const fehler = ZEILEN.flatMap((t) => formFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Zahlen türkisch: 08.30 · 7.15 · 2,5 · 1.600 · %60 · ₺15 · 3-2 · keine Endung an einer Zahl", () => {
    const fehler = ZEILEN.flatMap((t) => zahlFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(ZEILEN.some((t) => /\d,5\b/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /saat \d{1,2}\.\d\d/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\d\.\d{3}/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /%\d/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /₺\d/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\d-\d/.test(t))).toBe(true);
  });

  it("jede Zeile besteht die Regeln aller türkischen Zeilen (`helfer/trTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("kein Fest, kein Feiertag, kein Staatssymbol, nichts Religiöses oder Militärisches", () => {
    expect(ZEILEN.filter((t) => FEST.test(t))).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [kids], nurWeg tr, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["kids"]);
      expect(item.nurWeg, item.text).toBe("tr");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });

  it("Gegenprobe: jede Form-, Zahl- und Fest-Regel schlägt an", () => {
    for (const t of ["elif okula gitti.", "Elif okula gitti", "Elif okula gitti .", "Elif \u2013 Can.", "Bir,iki.", "Pamuk ( beyaz) uyuyor."]) {
      expect(formFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(formFehler('"Aferin" dedi Zeynep.')).toEqual([]);
    expect(formFehler("Testte boş kutular [ ] şeklinde.")).toEqual([]);
    expect(formFehler("Pazardan 2,5 kilo kiraz aldık.")).toEqual([]);
    for (const t of ["Okul saat 08:30 gibi başlıyor.", "Okul 8.5 gibi başlıyor.", "Dağ 4058 metre.", "Dağ 40.58 metre yüksek.", "Saat 25.10 oldu."]) {
      expect(zahlFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(zahlFehler("Okul saat 08.30 gibi başlıyor, yol 1.600 kilometre.")).toHaveLength(1); // beides in einer Zeile
    expect(zahlFehler("Dağ 4.058 metre, saatte 60 dakika.")).toEqual([]);
    expect(zeilenFehler("Okul saat 08.30'da başlıyor.").length).toBeGreaterThan(0); // Endung an der Zahl
    expect(zeilenFehler("Simit 15 TL.").length).toBeGreaterThan(0); // Währung hinter der Zahl
    expect(zeilenFehler("Şarj 10% kaldı.").length).toBeGreaterThan(0);
    for (const t of ["Bayramda dedeme gittik!", "Ramazan geldi mi?", "Okulda bayrak töreni var.", "Cami avlusunda oynadık."]) {
      expect(FEST.test(t), t).toBe(true);
    }
    expect(FEST.test("Göl kıyısında kurbağalar ötüyor.")).toBe(false);
  });
});

// ── Orte, Namen, Apostroph ──────────────────────────────────────────────────

type Region = "MAR" | "EGE" | "AKD" | "IC" | "KAR" | "DOG" | "GDO" | "AUS";
/**
 * Jeder Ort der Charge mit seiner Region (amtliche sieben Regionen der Türkei; AUS = Ausland, nur für `€ $` und Verwandte).
 * [G] - Sachangaben aus eigenem Wissen (Schlüssel klein nach `kleinFuer`: Isparta ⇒ ısparta): Isparta, Burdur und Osmaniye gehören amtlich zum Akdeniz, Afyon, Kütahya und Uşak zur
 * Ege, Balıkesir zur Marmara, Bolu (Abant, Yedigöller), Tokat und Bartın (Amasra) zum Karadeniz, Malatya, Muş, Bitlis
 * (Süphan), Tunceli (Munzur), Erzincan und Ardahan (Çıldır) zum Doğu, Siirt, Batman und Kilis zum Güneydoğu.
 */
const ORTE: Readonly<Record<string, Region>> = {
  istanbul: "MAR", belgrad: "MAR", kocaeli: "MAR", sakarya: "MAR", tekirdağ: "MAR", edirne: "MAR", kırklareli: "MAR", bursa: "MAR", balıkesir: "MAR",
  izmir: "EGE", bodrum: "EGE", ege: "EGE", kütahya: "EGE", uşak: "EGE", denizli: "EGE", aydın: "EGE", muğla: "EGE", fethiye: "EGE", afyon: "EGE",
  ısparta: "AKD", burdur: "AKD", düden: "AKD", hatay: "AKD", osmaniye: "AKD", adana: "AKD", seyhan: "AKD", mersin: "AKD", antalya: "AKD",
  eskişehir: "IC", porsuk: "IC", niğde: "IC", ankara: "IC", eymir: "IC", gençlik: "IC", kuğulu: "IC", kayseri: "IC", yozgat: "IC",
  konya: "IC", sivas: "IC", kırşehir: "IC", çankırı: "IC", aksaray: "IC",
  abant: "KAR", amasya: "KAR", karadeniz: "KAR", sinop: "KAR", trabzon: "KAR", rize: "KAR", tokat: "KAR", bartın: "KAR",
  amasra: "KAR", giresun: "KAR", bolu: "KAR", yedigöller: "KAR",
  malatya: "DOG", van: "DOG", muş: "DOG", erzincan: "DOG", erzurum: "DOG", palandöken: "DOG", munzur: "DOG", kars: "DOG",
  çıldır: "DOG", ardahan: "DOG", bitlis: "DOG", süphan: "DOG",
  gaziantep: "GDO", antep: "GDO", diyarbakır: "GDO", siirt: "GDO", batman: "GDO", kilis: "GDO", şanlıurfa: "GDO",
  amerika: "AUS", kanada: "AUS", almanya: "AUS", berlin: "AUS", avrupa: "AUS", hollanda: "AUS", viyana: "AUS", fransa: "AUS",
};
/** Vornamen der Kinder und Familien (heutige Namen aus der ganzen Türkei), der Hund Pamuk, der Erzähler Ömer Seyfettin. */
const NAMEN: ReadonlySet<string> = new Set(
  "zeynep doruk selin can elif melis arda mert pamuk ece yeşim ayşe efe defne fatma hasan ömer seyfettin".split(" "),
);
/** Teile von Eigennamen, die mitten im Satz gross stehen (Porsuk Çayı, Abant Gölü, Düden Şelalesi, Süphan Dağı, Belgrad Ormanı, Gençlik Parkı, Kuğulu Park). */
const NAMENSTEILE: ReadonlySet<string> = new Set(["çayı", "gölü", "şelalesi", "dağı", "ormanı", "parkı", "park"]);
/**
 * Andere Eigennamen und Zeichen, die gross stehen: das Land, die Sprache, die Brailleschrift, der Titel „Kaşağı" (Erzählung
 * von Ömer Seyfettin, Lesebuch der Grundschule), die Tasten Shift und AltGr, der Buchstabe Q (Q klavye).
 */
const SONSTIGE_NAMEN: ReadonlySet<string> = new Set("türkiye türk türkçe türkçede braille kaşağı shift altgr q".split(" "));
const istEigenname = (w: string) => w in ORTE || NAMEN.has(w) || NAMENSTEILE.has(w) || SONSTIGE_NAMEN.has(w);

/** Technische Wörter (Adressen, Pfade, Rechnungen, Spielstände, Zeichen) - sie werden nicht als Wörter geprüft. */
const TECHNISCH = /[@_/#=<>|*+&$%€₺½\\\d[\]{}]/u;

/**
 * Die Wörter einer Zeile (klein, `İ`-sicher, Apostroph-Formen als Ganzes, Bindestrich-Teile einzeln) mit Merker
 * „Satzanfang" (Zeilenanfang, nach . ? ! :, Anfang einer Anführung); technische Wörter fallen weg.
 */
function woerterMitAnfang(zeile: string): { w: string; roh: string; anfang: boolean }[] {
  const out: { w: string; roh: string; anfang: boolean }[] = [];
  let naechsterAnfang = true;
  for (const roh of zeile.split(/\s+/)) {
    const kern = roh.replace(/^["(]+|[.,!?:;")]+$/gu, "");
    if (kern && !TECHNISCH.test(kern)) {
      for (const [i, teil] of kern.split("-").entries()) {
        const w = teil.replace(/^[^\p{L}]+|[^\p{L}']+$/gu, "");
        if (w) out.push({ w: kleinFuer(w, "tr"), roh: w, anfang: i === 0 && (naechsterAnfang || roh.startsWith('"')) });
      }
    }
    naechsterAnfang = /[.!?:]"?\)?$/.test(roh);
  }
  return out;
}
const woerterKlein = (zeile: string): string[] => woerterMitAnfang(zeile).map((x) => x.w);

/** Grossgeschriebene Wörter, die weder Satzanfang noch Ort, Name, Namensteil (+ Endung) sind. */
function unbekannteGrosse(zeile: string): string[] {
  return woerterMitAnfang(zeile)
    .filter((x) => !x.anfang && /^\p{Lu}/u.test(x.roh) && !istEigenname(x.w.split("'")[0]))
    .map((x) => x.roh);
}

/** Regionen einer Zeile: Orte direkt oder mit Endung (`İzmir'de`). */
function regionenDerZeile(zeile: string): Set<Region> {
  const out = new Set<Region>();
  for (const w of woerterKlein(zeile)) {
    const basis = w.split("'")[0];
    if (basis in ORTE) out.add(ORTE[basis]);
  }
  return out;
}

/** GEMESSEN am Ende von TR-T7. */
const MINDESTENS_JE_REGION = 7;
const HOECHSTENS_JE_REGION = 20;
const MINDESTENS_VERORTET = 78; // gemessen 78: MAR 8, EGE 11, AKD 10, IC 15, KAR 12, DOG 15, GDO 10 (AUS 8 zählt nicht)

describe("TR-T7: Orte aus der ganzen Türkei, Eigennamen, Apostroph nur am Namen", () => {
  it("jedes grossgeschriebene Wort mitten im Satz ist ein bekannter Ort, Name, Namensteil oder Zeichen", () => {
    const fehler = ZEILEN.flatMap((t) => unbekannteGrosse(t).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it(`alle sieben Regionen je mindestens ${MINDESTENS_JE_REGION} Zeilen, keine über ${HOECHSTENS_JE_REGION}, mindestens ${MINDESTENS_VERORTET} Zeilen verortet (Türkei)`, () => {
    const zahl = new Map<Region, number>();
    let verortet = 0;
    for (const t of ZEILEN) {
      const r = regionenDerZeile(t);
      if ([...r].some((x) => x !== "AUS")) verortet++;
      for (const x of r) zahl.set(x, (zahl.get(x) ?? 0) + 1);
    }
    const bericht = [...zahl].map(([r, n]) => `${r} ${n}`).join(", ") + ` · verortet ${verortet}`;
    for (const r of ["MAR", "EGE", "AKD", "IC", "KAR", "DOG", "GDO"] as const) {
      expect(zahl.get(r) ?? 0, `${r} - ${bericht}`).toBeGreaterThanOrEqual(MINDESTENS_JE_REGION);
    }
    expect([...zahl].every(([r, n]) => r === "AUS" || n <= HOECHSTENS_JE_REGION), bericht).toBe(true);
    expect(verortet, bericht).toBeGreaterThanOrEqual(MINDESTENS_VERORTET);
  });

  it("€ steht nur in Zeilen über das Ausland oder über das Zeichen selbst - nie mit einem Ort in der Türkei", () => {
    const euro = ZEILEN.filter((z) => z.includes("€"));
    expect(euro.length).toBeGreaterThanOrEqual(7);
    expect(euro.filter((z) => [...regionenDerZeile(z)].some((r) => r !== "AUS"))).toEqual([]);
  });

  it("Gegenprobe: unbekannte Grosswörter, Bindestrich-Orte, Anführung, Doppelpunkt und Satzanfänge werden richtig gelesen", () => {
    expect(unbekannteGrosse("Annem Atlantis'te doğdu!")).toEqual(["Atlantis'te"]);
    expect(unbekannteGrosse("Ankara-İstanbul treni hızlı.")).toEqual([]);
    expect(unbekannteGrosse("Ankara-Atlantis treni hızlı.")).toEqual(["Atlantis"]);
    expect(unbekannteGrosse('"Aferin!" dedi Zeynep.')).toEqual([]);
    expect(unbekannteGrosse("Geldin mi? Yarın gel.")).toEqual([]);
    expect(unbekannteGrosse("Geldin ve Yarın gel.")).toEqual(["Yarın"]);
    expect([...regionenDerZeile("Siirt'teki bahçemizde 5 fıstık ağacı var.")]).toEqual(["GDO"]);
    expect([...regionenDerZeile("Berlin'de bir top dondurma €2 imiş.")]).toEqual(["AUS"]);
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
    expect(ZEILEN.filter((t) => t.includes("'")).length).toBeGreaterThanOrEqual(60);
  });

  it("Gegenprobe: Uşak'da (Angleichung), Siirt'ın (Harmonie), Kilis'deki und ein Gattungswort mit Apostroph werden gemeldet", () => {
    expect(endungFehler("uşak", "da")).toHaveLength(1);
    expect(endungFehler("siirt", "ın")).toHaveLength(1);
    expect(endungFehler("kilis", "deki")).toHaveLength(1);
    expect(endungFehler("kilis", "teki")).toEqual([]);
    expect(endungFehler("yedigöller", "de")).toEqual([]);
    expect(istEigenname("okul")).toBe(false);
  });
});

// ── Gekürzt serviert: kein grosses Wort mitten im Satz ─────────────────────

/**
 * Wird eine Zeile vor ihrer vollen Sprosse gekürzt serviert, fällt mit `? ! : " ;` auch die Satzgrenze weg - ein Wort, das
 * danach gross steht, stünde mitten im Satz. Darum steht dort nur ein Name oder Ort (Naht-Regel aus PL-T7).
 */
function fruehNahtFehler(zeile: string): string[] {
  const b = ersteSprosse(zeile);
  const v = volleSprosse(zeile);
  if (b === null || v === null) return [];
  const out = new Set<string>();
  for (let n = b; n < v; n++) {
    const s = fitText(zeile, allowedAt(n), "tr");
    if (s !== null) for (const w of unbekannteGrosse(s)) out.add(`${n}:${w}`);
  }
  return [...out];
}

describe("TR-T7: gekürzt serviert - kein Grossbuchstabe mitten im Satz", () => {
  it("jede Zeile, die vor ihrer Sprosse gekürzt kommt, liest sich ohne Grosswort mitten im Satz", () => {
    const fehler = ZEILEN.flatMap((z) => fruehNahtFehler(z).map((f) => `"${z}" @ ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „Ninem seslendi: \"Gel çabuk!\"“ würde vor „:“ zu „Ninem seslendi Gel çabuk“; ein Name nach ? ist erlaubt", () => {
    expect(fruehNahtFehler('Ninem seslendi: "Gel çabuk!"').length).toBeGreaterThan(0);
    expect(fruehNahtFehler("Kim geliyor? Zeynep ve Can.")).toEqual([]);
    expect(fitText("Çorbaya biraz nane ekleyelim mi?", allowedAt(sprosseVon("q")), "tr")).toBe("Çorbaya biraz nane ekleyelim mi");
  });
});

// ── Wortschatz: Wortgrenze 8 über T1 + T4 + T7, Sperrliste, Belege, Endungen ──

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht (Liste aus TR-T4). */
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
 * Lexikon-Nachtrag nimmt nur Formen mit mindestens zwei Tatoeba-Belegen; Küchen-, Spiel-, Schul- und Zeichenwörter fehlen
 * dort oft). [G] - eigenes Sprachwissen, NICHT an einer Quelle belegt; das macOS-Wörterbuch prüft Türkisch nur halb (Falle 87)
 * und ist hier kein Beweis. Einige stehen nur als Stamm einer Form unten. ⚠️ Von keiner Person mit Türkisch als Erstsprache gelesen.
 */
const NEUE_GRUNDFORMEN: Readonly<Record<string, string>> = {
  afiş: "Plakat - nur als Stamm („afişinde“)",
  ayır: "Stamm von ayırmak (trennen, beiseitelegen) - nur als Stamm",
  biriktir: "Stamm von biriktirmek (sparen, sammeln) - nur als Stamm",
  hücre: "Zelle; „Braille hücresi“ = Braillezelle mit 6 Punkten - nur als Stamm",
  tart: "Stamm von tartmak (wiegen) - nur als Stamm",
  yüklen: "Stamm von yüklenmek (geladen werden) - nur als Stamm",
  yükseklik: "Höhe - nur als Stamm (erweicht: yüksekliğinde)",
  yüzey: "Oberfläche - nur als Stamm",
  özle: "Stamm von özlemek (vermissen) - nur als Stamm",
  üçgen: "Dreieck - nur als Stamm",
  bağlaç: "Bindewort („ve bağlacı“) - nur als Stamm („bağlacı“)",
  bas: "Stamm von basmak (drücken: „tuşuna basmak“) - nur als Stamm",
  birik: "Stamm von birikmek (sich ansammeln) - nur als Stamm",
  bitter: "„bitter çikolata“ = Zartbitterschokolade, im Türkischen so geschrieben",
  çarpım: "Produkt; „çarpım tablosu“ = Einmaleins",
  çetele: "Strichliste zum Zählen (|||| - die Striche im Spiel)",
  çiz: "Stamm von çizmek (zeichnen) - nur als Stamm",
  çörek: "rundes Gebäck - nur als Stamm („çöreğe“)",
  daktilo: "Schreibmaschine; „Braille daktilosu“ = Punktschriftmaschine - nur als Stamm",
  demet: "Bund („bir demet maydanoz“)",
  demlen: "Stamm von demlenmek (Tee zieht) - nur als Stamm",
  diyez: "Kreuz vor der Note (Musik, #)",
  doku: "Stamm von dokumak (weben: „halı dokuyan“) - nur als Stamm",
  düzine: "Dutzend",
  eğik: "schräg; „eğik çizgi“ = Schrägstrich /",
  gondol: "Gondel (Eskişehir, Porsuk Çayı) - nur als Stamm",
  ilkbahar: "Frühling",
  kabuk: "Schale - nur als Stamm („kabuklu“)",
  kadayıf: "Teigfäden-Dessert; „kadayıf dolması“ = gefüllter Kadayıf aus Erzurum",
  kakao: "Kakao",
  kamaştır: "Stamm von kamaştırmak („göz kamaştırmak“ = blenden) - nur als Stamm",
  kapmaca: "„mendil kapmaca“ = Taschentuch-Schnappen, Pausenspiel",
  kare: "Quadrat; am Telefon der Name der Taste #",
  kartpostal: "Postkarte - nur als Stamm (hintere Endung: kartpostalın)",
  kavanoz: "Einmachglas",
  kaydet: "Stamm von kaydetmek (speichern) - nur als Stamm",
  kaygan: "rutschig",
  kefe: "Waagschale - nur als Stamm",
  kenar: "Kante, Seite (Dreieck, Bienenwabe) - nur als Stamm",
  kesir: "Bruch (Mathematik) - nur als Stamm",
  kete: "rundes Gebäck in Erzurum, Kars, Ardahan (Inhalt der Zeile: der Name dort)",
  klasör: "Ordner (am Computer) - nur als Stamm",
  koli: "Paket, Karton - nur als Stamm",
  kumbara: "Spardose - nur als Stamm („kumbarada“)",
  kırtasiye: "Schreibwarenladen - nur als Stamm",
  lavanta: "Lavendel (Isparta)",
  madenî: "metallisch; „madenî para“ = Münze (TDK mit î)",
  maskot: "Maskottchen - nur als Stamm",
  ötüş: "Krähen, Gesang eines Vogels - nur als Stamm („ötüşüyle“)",
  pano: "Pinnwand - nur als Stamm",
  parantez: "Klammer („köşeli parantez“, „süslü parantez“)",
  pelüş: "Plüsch („pelüş bir kaplumbağa“)",
  piş: "Stamm von pişmek (garen) - nur als Stamm",
  santimetre: "Zentimeter",
  sayabilir: "„kann zählen“: say (Stamm von saymak) + -abil- + -ir; das i von -bil- ist fest und folgt keiner Harmonie - darum als Ganzes belegt",
  sent: "Cent (Dollar)",
  tabela: "Schild - nur als Stamm",
  tepsi: "Tablett - nur als Stamm („tepsiye“)",
  terazi: "Waage - nur als Stamm",
  termometre: "Thermometer",
  tire: "Bindestrich - im Satz „tire tuşu“ = Taste mit -",
  tutarken: "„beim Führen“: tut (Stamm von tutmak) + Aorist -ar + -ken; -ken ist unveränderlich - darum als Ganzes belegt",
  uşağum: "Mundart von Trabzon für „uşağım“ (mein Kind) - Inhalt der Zeile ist genau dieses Wort",
  yabani: "wild („yabani lale“, Muş)",
  yazılabilir: "„kann geschrieben werden“: yaz + -ıl- + -abil- + -ir; das i von -bil- ist fest - darum als Ganzes belegt",
  yüzyıl: "Jahrhundert (yüz + yıl, zusammengeschrieben)",
  zahter: "wilder Thymian, Gewürzmischung aus Hatay",
  zarif: "anmutig",
  ıslama: "„ıslama köfte“ = Fleischbällchen auf in Brühe getränktem Brot, Sakarya (Akyazı)",
};

/**
 * Neue Formen = bekannter Stamm + Endung. Der Stamm stand im Wortschatz, in einer anderen tr-Charge, ist eine Grundform
 * oben oder ein Ort. Mit drittem Eintrag: der Stamm ist die ERWEICHTE Form dieses Wortes (fıstık ⇒ fıstığ-, sincap ⇒
 * sincab-, vücut ⇒ vücud-). Die Endung ist ausgeschrieben, damit Vokalharmonie und d/t-Angleichung NACHGERECHNET werden
 * (Puffer `n y s` gehören zur Endung). Ein angehängtes „-ki“ (bahçemizdeki) ist unveränderlich.
 */
const NEUE_FORMEN: Readonly<Record<string, readonly [string, string] | readonly [string, string, string]>> = {
  adresinde: ["adres", "inde"], afişinde: ["afiş", "inde"], ahtapotun: ["ahtapot", "un"], anneanneciğim: ["anneanne", "ciğim"],
  arabayla: ["araba", "yla"], aranır: ["ara", "nır"], ateşim: ["ateş", "im"], atlama: ["atla", "ma"], atınca: ["at", "ınca"],
  ayrılmış: ["ayrıl", "mış"], ayırdık: ["ayırdı", "k"], ayırdım: ["ayırdı", "m"], ayırır: ["ayır", "ır"],
  bahçemizde: ["bahçe", "mizde"], bahçemizdeki: ["bahçe", "mizdeki"], bahçemizden: ["bahçe", "mizden"], bahçesini: ["bahçe", "sini"],
  baklavanın: ["baklava", "nın"], baklavasını: ["baklava", "sını"], balla: ["bal", "la"], bardakları: ["bardak", "ları"],
  bağlacı: ["bağlac", "ı", "bağlaç"], basmamızı: ["bas", "mamızı"], basılı: ["bas", "ılı"], basılır: ["bas", "ılır"],
  basıyoruz: ["bas", "ıyoruz"], beslenmeye: ["beslenme", "ye"], bilmecenin: ["bilmece", "nin"], binince: ["bin", "ince"],
  birikti: ["birik", "ti"], biriktirip: ["biriktir", "ip"], bisikletimde: ["bisiklet", "imde"], bisikletimin: ["bisiklet", "imin"],
  bitenleri: ["biten", "leri"], bitirince: ["bitir", "ince"], biçiminde: ["biçim", "inde"], boyamayı: ["boya", "mayı"],
  boşluğa: ["boşluğ", "a", "boşluk"], bulmacada: ["bulmaca", "da"], cetvelin: ["cetvel", "in"], daktilosuyla: ["daktilo", "suyla"],
  davetiyesinde: ["davetiye", "sinde"], dedemler: ["dedem", "ler"], defterime: ["defter", "ime"], defterlerde: ["defter", "lerde"],
  demlendi: ["demlen", "di"], deneyinde: ["deney", "inde"], derslik: ["ders", "lik"],
  değişkenlerin: ["değişken", "lerin"], diktik: ["dikti", "k"], dinlendir: ["dinlen", "dir"], dizelim: ["diz", "elim"],
  doksandan: ["doksan", "dan"], dokuyan: ["doku", "yan"], dolması: ["dolma", "sı"], dolmuşa: ["dolmuş", "a"],
  dosyalarını: ["dosya", "larını"], dosyamın: ["dosya", "mın"], dörtte: ["dört", "te"], ekledi: ["ekle", "di"],
  ekledik: ["ekle", "dik"], ekleyelim: ["ekle", "yelim"], elmasını: ["elma", "sını"], etiketlerinde: ["etiket", "lerinde"],
  ezberledi: ["ezberle", "di"], eşittir: ["eşit", "tir"], flamingolar: ["flamingo", "lar"], fuarında: ["fuar", "ında"],
  fıstığa: ["fıstığ", "a", "fıstık"], fıstığı: ["fıstığ", "ı", "fıstık"], getirilecek: ["getir", "ilecek"], gezilir: ["gez", "ilir"],
  gondola: ["gondol", "a"], gökkuşağında: ["gökkuşağı", "nda"], gökyüzündeki: ["gökyüzü", "ndeki"], görevim: ["görev", "im"],
  gösterilir: ["göster", "ilir"], gösterilmiş: ["göster", "ilmiş"], götüreceklerimiz: ["götürecek", "lerimiz"],
  güneşte: ["güneş", "te"], günüme: ["gün", "üme"], halam: ["hala", "m"], harfine: ["harf", "ine"], harfler: ["harf", "ler"],
  harçlıklarımı: ["harçlık", "larımı"], harçlıklarını: ["harçlık", "larını"], harçlığını: ["harçlığ", "ını", "harçlık"],
  havalanmıyor: ["hava", "lanmıyor"], hazırladın: ["hazırladı", "n"], hikâyesini: ["hikâye", "sini"],
  hücresinde: ["hücre", "sinde"], inciri: ["incir", "i"], iyileş: ["iyi", "leş"],
  işaretine: ["işaret", "ine"], işaretinin: ["işaret", "inin"], işaretledim: ["işaret", "ledim"], işaretli: ["işaret", "li"],
  işlemini: ["işlem", "ini"], kabuklu: ["kabuk", "lu"], kafenin: ["kafe", "nin"], kalemtıraşını: ["kalemtıraş", "ını"],
  kamaştırıyor: ["kamaştır", "ıyor"], kapımızda: ["kapı", "mızda"], kartpostalın: ["kartpostal", "ın"], kasabası: ["kasaba", "sı"],
  kaydetmemizi: ["kaydet", "memizi"], kaydettim: ["kaydetti", "m"], kaymağı: ["kaymağ", "ı", "kaymak"], kayısıları: ["kayısı", "ları"],
  kayısısını: ["kayısı", "sını"], kazandık: ["kazandı", "k"], kazıyor: ["kaz", "ıyor"], kedilerin: ["kedi", "lerin"],
  kedimiz: ["kedi", "miz"], kefeleri: ["kefe", "leri"], keke: ["kek", "e"], kenarı: ["kenar", "ı"], kesesi: ["kese", "si"],
  kesirde: ["kesir", "de"], kesirlerde: ["kesir", "lerde"], klasörleri: ["klasör", "leri"], klasöründe: ["klasör", "ünde"],
  klasörüne: ["klasör", "üne"], klavyedeki: ["klavye", "deki"], kodlamada: ["kodlama", "da"], kolide: ["koli", "de"],
  koşuyor: ["koş", "uyor"], kullandık: ["kullandı", "k"], kullanırız: ["kullan", "ırız"],
  kumbarada: ["kumbara", "da"], kutular: ["kutu", "lar"], kutuları: ["kutu", "ları"], kutumda: ["kutu", "mda"],
  kuzenime: ["kuzen", "ime"], kuzenimiz: ["kuzen", "imiz"], kuzum: ["kuzu", "m"], köftesi: ["köfte", "si"],
  köftesini: ["köfte", "sini"], köşedeki: ["köşe", "deki"], köşeli: ["köşe", "li"],
  kümeler: ["küme", "ler"], küpün: ["küp", "ün"], küçüktür: ["küçük", "tür"],
  kırtasiyede: ["kırtasiye", "de"], kırtasiyeden: ["kırtasiye", "den"], kısaydı: ["kısa", "ydı"], kızaklarla: ["kızak", "larla"],
  laleleri: ["lale", "leri"], lirasının: ["lira", "sının"], maceraları: ["macera", "ları"], mahalledeki: ["mahalle", "deki"],
  makinesinde: ["makine", "sinde"], masalı: ["masal", "ı"], masamda: ["masa", "mda"], maskotu: ["maskot", "u"],
  mayalamak: ["maya", "lamak"], memleketimiz: ["memleket", "imiz"], mevsimler: ["mevsim", "ler"], meyveler: ["meyve", "ler"],
  misafirlere: ["misafir", "lere"], ninemin: ["ninem", "in"], notadaki: ["nota", "daki"], odamın: ["oda", "mın"],
  okulumuzda: ["okul", "umuzda"], olgunlaşır: ["olgun", "laşır"], onayladık: ["onayladı", "k"], ormanlarının: ["orman", "larının"],
  oynanır: ["oyna", "nır"], oyundaki: ["oyun", "daki"], panosuna: ["pano", "suna"], pastanenin: ["pastane", "nin"],
  pastanın: ["pasta", "nın"], pazarından: ["pazar", "ından"], peteklerinin: ["petek", "lerinin"], pilin: ["pil", "in"], piyonla: ["piyon", "la"],
  piyonu: ["piyon", "u"], pizzanın: ["pizza", "nın"], pişer: ["piş", "er"], pişmaniyesi: ["pişmaniye", "si"],
  programımda: ["program", "ımda"], programımız: ["program", "ımız"], puanlarını: ["puan", "larını"], pulu: ["pul", "u"],
  renklerini: ["renk", "lerini"], robotun: ["robot", "un"], sandviçini: ["sandviç", "ini"], satrançta: ["satranç", "ta"],
  sayfalık: ["sayfa", "lık"], sayılar: ["sayı", "lar"], sayıya: ["sayı", "ya"], sayıyı: ["sayı", "yı"], sepetteki: ["sepet", "teki"],
  servisimiz: ["servis", "imiz"], servisle: ["servis", "le"], seslenir: ["seslen", "ir"], setini: ["set", "ini"],
  simidini: ["simid", "ini", "simit"], simitçiden: ["simitçi", "den"], sincabı: ["sincab", "ı", "sincap"], sodalı: ["soda", "lı"],
  sorudan: ["soru", "dan"], sudur: ["su", "dur"], sulamak: ["sula", "mak"], sularla: ["su", "larla"], sütünden: ["süt", "ünden"],
  sınavım: ["sınav", "ım"], sınıfındayım: ["sınıf", "ındayım"], tabelada: ["tabela", "da"], tabelasında: ["tabela", "sında"],
  tabletin: ["tablet", "in"], tabloda: ["tablo", "da"], tablosu: ["tablo", "su"], tablosunu: ["tablo", "sunu"],
  tahtada: ["tahta", "da"], tamamla: ["tamam", "la"], tanedir: ["tane", "dir"], tanesini: ["tane", "sini"], tarifte: ["tarif", "te"],
  tarttılar: ["tart", "tılar"], tattın: ["tat", "tın"], tavlada: ["tavla", "da"], tekeri: ["teker", "i"], temmuzda: ["temmuz", "da"],
  teneffüse: ["teneffüs", "e"], tepeler: ["tepe", "ler"], tepsiye: ["tepsi", "ye"], terazinin: ["terazi", "nin"],
  testinde: ["test", "inde"], teyzeme: ["teyze", "me"], timsahın: ["timsah", "ın"], tişörtünde: ["tişört", "ünde"],
  torununu: ["torun", "unu"], tuşlar: ["tuş", "lar"], tuşuna: ["tuş", "una"], tuşunda: ["tuş", "unda"],
  tuşundadır: ["tuş", "undadır"], tuşunu: ["tuş", "unu"], tuşunun: ["tuş", "unun"], tuşuyla: ["tuş", "uyla"],
  ustalar: ["usta", "lar"], uzanır: ["uzan", "ır"], uzatacak: ["uzat", "acak"], uzattık: ["uzattı", "k"], uçurtman: ["uçurtma", "n"],
  vardık: ["vardı", "k"], vücudumuzun: ["vücud", "umuzun", "vücut"], yapacaklarımız: ["yapacak", "larımız"],
  yavruları: ["yavru", "ları"], yazarlar: ["yazar", "lar"], yazarız: ["yazar", "ız"], yazıyordu: ["yazıyor", "du"],
  yediden: ["yedi", "den"], yüklendi: ["yüklen", "di"], yüksekliğinde: ["yüksekliğ", "inde", "yükseklik"], yüzeyinin: ["yüzey", "inin"],
  çalınız: ["çal", "ınız"], çantamda: ["çanta", "mda"], çantamız: ["çanta", "mız"], çantanı: ["çanta", "nı"], çatıya: ["çatı", "ya"],
  çeteleyle: ["çetele", "yle"], çikolatanın: ["çikolata", "nın"], çizdik: ["çizdi", "k"], çizdim: ["çizdi", "m"],
  çizeriz: ["çiz", "eriz"], çizgiden: ["çizgi", "den"], çizgileri: ["çizgi", "leri"], çizgisi: ["çizgi", "si"], çizince: ["çiz", "ince"],
  çorban: ["çorba", "n"], çöreğe: ["çöreğ", "e", "çörek"], ödevdeki: ["ödev", "deki"], örümceğin: ["örümceğ", "in", "örümcek"],
  ötüşüyle: ["ötüş", "üyle"], özledik: ["özle", "dik"], öğretmenimizin: ["öğretmen", "imizin"], öğrettim: ["öğretti", "m"],
  ünlüler: ["ünlü", "ler"], üçgenin: ["üçgen", "in"], ışığını: ["ışığ", "ını", "ışık"], şarjı: ["şarj", "ı"], şelalesi: ["şelale", "si"],
  şemsiyemiz: ["şemsiye", "miz"], şenliğimizin: ["şenliğ", "imizin", "şenlik"], şiirin: ["şiir", "in"], şoföre: ["şoför", "e"],
  şoförüne: ["şoför", "üne"],
};

const HINTEN = new Set(["a", "ı", "o", "u", "â", "û"]);
const VOKALE = new Set(["a", "e", "ı", "i", "o", "ö", "u", "ü", "â", "î", "û"]);
const STIMMLOS = new Set(["ç", "f", "h", "k", "p", "s", "ş", "t"]);
/**
 * Lehnwörter mit hinterem Vokal, die HELLE Endungen nehmen (TDK, Ausnahmen der großen Vokalharmonie: harf ⇒ harfi). Nur,
 * was die Charge braucht.
 */
const HELLE_ENDUNG: ReadonlySet<string> = new Set(["harf"]);
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
 * (bahçemizdeki, Bartın'daki) ist unveränderlich und wird nicht geprüft. `â î û` gelten als a i u.
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

describe("TR-T7: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("★ Wortbudget Kinder: auch über TR-T1 + TR-T4 + TR-T7 zusammen steht kein Inhaltswort in mehr als 8 Zeilen (Falle 45)", () => {
    expect(KINDER_T1.length).toBeGreaterThan(100);
    expect(KINDER_T4.length).toBeGreaterThan(200);
    const fehler = zuHaeufig([...KINDER_T1, ...KINDER_T4, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (gross, mit Satzzeichen, nach Ziffer), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Kedi" : "Bu 9 kedi"} ${"abcdefghi"[i]}? Ve.`);
    expect(zuHaeufig(neun)).toEqual(['"kedi": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - Kern, Wortbasis, gefaltet (ı→i ş→s …) und kein unerwünschtes Themenwort", () => {
    const fehler = ZEILEN.flatMap((t) =>
      [...woerterOhneZeichen(t), ...woerterKlein(t)].filter((w) => gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w)).map((w) => `"${t}": ${w}`),
    );
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: sik (Kern), kaşar und sıktı (beim Schreiben getroffen, darum ersetzt), ordu - fındık, kayısı, köfte nicht", () => {
    expect(istKernGesperrtTr("sik")).toBe(true);
    expect(gesperrtGefaltetTr("kaşar") || fuerWortlisteUngeeignetTr("kaşar")).toBe(true);
    expect(gesperrtGefaltetTr("sıktı") || fuerWortlisteUngeeignetTr("sıktı")).toBe(true);
    expect(gesperrtGefaltetTr("ordu") || fuerWortlisteUngeeignetTr("ordu")).toBe(true);
    for (const w of ["fındık", "kayısı", "köfte"]) expect(gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w), w).toBe(false);
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
    expect(endungFehler("tuş", "ında")).toHaveLength(1);
    expect(endungFehler("harf", "ı")).toHaveLength(1); // Ausnahme mit hellen Endungen: harfi, nie harfı
    expect(endungFehler("harf", "ine")).toEqual([]);
    expect(endungFehler("satranç", "da")).toHaveLength(1);
    expect(endungFehler("tavla", "ta")).toHaveLength(1);
    expect(endungFehler("sepet", "teki")).toEqual([]);
    expect(erweicht("fıstık")).toBe("fıstığ");
    expect(erweicht("sincap")).toBe("sincab");
    expect(erweicht("vücut")).toBe("vücud");
    expect(ungeprueft(["Pazarda bir kilo mandalina aldık.", "Pazarda bir kilo mandalinaa aldık."])).toEqual(["mandalinaa"]);
  });

  /** Die Stimme liest Leerzeichen-Wörter; technische Wörter (Adressen, Pfade, Rechnungen) liest sie als Zeichen. */
  const stimmWoerter = (zeile: string): string[] =>
    zeile
      .split(/\s+/)
      .map((roh) => roh.replace(/^["(]+|[.,!?:;")]+$/gu, ""))
      .filter((w) => w.length >= 2 && !TECHNISCH.test(w));

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58: Anteil buchstabierter Zeilen = 0)", () => {
    const buchstabiert = ZEILEN.filter((z) => stimmWoerter(z).some((w) => !isRealWord(w, "tr")));
    expect(buchstabiert).toEqual([]);
    expect(stimmWoerter('Ankara-İstanbul, "kuzum" ve 3-2.')).toEqual(["Ankara-İstanbul", "kuzum", "ve"]);
  });
});

// ── Keine Kopien, keine Paare, nichts fast gleich ───────────────────────────

/** Person und Zahl gleichgesetzt: „Ben de geldim“/„Sen de geldin“-Paare und Einzahl/Mehrzahl (Muster TR-T4). */
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

/** Die Texte der Tippchallenge-Banken aller Wege: jede Datei `schreibproben/texte*.ts`. */
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
/** Alles, was sonst Text trägt: alle Korpora, die rohe tr-Liste, alle Serien, alle Banken - Zeile für Zeile und Satz für Satz. */
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

describe("TR-T7: keine Kopien, keine Paare, nichts fast gleich - gegen Korpora, Serien und Banken aller Sprachen", () => {
  it("keine Zeile doppelt - auch nicht ohne Zeichen oder nach dem Ledger-Schlüssel (Zeichen und ç ğ ı ş sind dort Trenner)", () => {
    expect(new Set(ZEILEN.map(ohneZeichen)).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("die Vergleichsmenge ist voll (Serien und Banken geladen, pl/cs, TR-T1 bis TR-T5)", () => {
    expect(bankZeilen().length).toBeGreaterThan(1000);
    expect(SERIEN.length).toBeGreaterThan(100);
    expect(CORPUS_PL.length).toBeGreaterThan(0);
    expect(CORPUS_CS.length).toBeGreaterThan(0);
    expect(ANDERE_TR().filter((i) => CORPUS_TR_WEG_MITTE_TEENS.includes(i)).length).toBe(CORPUS_TR_WEG_MITTE_TEENS.length);
    expect(ANDERE_TR().length).toBe(TR_ROH.length - CHARGE.length);
  });

  it("keine Zeile gleicht einer fremden Zeile oder einem fremden Satz (ohne Zeichen, klein) oder ihrem Ledger-Schlüssel", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneZeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    expect(ZEILEN.filter((t) => texte.has(ohneZeichen(t)) || schluessel.has(bausteinKey("satz", t)))).toEqual([]);
  });

  it("keine Paare in der Charge und keines mit einer anderen tr-Zeile (nur Person oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN, ANDERE_TR_ZEILEN());
    expect(fehler, fehler.join("\n")).toEqual([]);
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

  it("Gegenprobe: Serienzeile, Banken-Satz, TR-T4-Zeile als Kopie; beim Schreiben verworfene Zeilen wären fast gleich", () => {
    const fremd = new Set(alleFremdenZeilen().map(ohneZeichen));
    expect(fremd.has(ohneZeichen(SERIEN[0].etappen[0].lines[0]))).toBe(true);
    expect(fremd.has(ohneZeichen(bankZeilen()[0].split(/(?<=[.!?])\s+/u)[0]))).toBe(true);
    expect(fremd.has(ohneZeichen(KINDER_T4[0]))).toBe(true);
    expect(fremd.has(ohneZeichen(ZEILEN[0]))).toBe(false);
    // Verworfen (Befund §4): die Tastenlage-Zeilen standen erst alle im selben Muster.
    expect(fastGleich(wortMenge("Klavyede $ işaretini AltGr ile 4 tuşu yazar."), wortMenge("Klavyede # işaretini AltGr ile 3 tuşu yazar."))).toBe(true);
    expect(fastGleich(wortMenge("Dolar işareti $ ile gösterilir."), wortMenge("Avro işareti € ile gösterilir."))).toBe(true);
    expect(paare(["Kuşlar ağaçta.", "Kuş ağaçta."])).toHaveLength(1);
  });
});

// ── Korpus-Anker und Auslieferung ──────────────────────────────────────────

describe("TR-T7: Korpus-Anker und Auslieferung", () => {
  it("die rohe Sammelliste trägt die Charge als geschlossenen Block HINTER TR-T5 und TR-T6, und korpusFuer(\"tr\") jede Zeile", () => {
    const start = TR_ROH.indexOf(CHARGE[0]);
    expect(TR_ROH.slice(start, start + CHARGE.length)).toEqual(CHARGE);
    const letzteT5 = Math.max(...CORPUS_TR_WEG_MITTE_TEENS.map((i) => TR_ROH.indexOf(i)));
    expect(start).toBeGreaterThan(letzteT5);
    // ★ Merge 09.10.2026: TR-T6 (Erwachsene Mitte) kam parallel und steht davor.
    expect(start).toBeGreaterThan(Math.max(...CORPUS_TR_WEG_MITTE_ERWACHSENE.map((i) => TR_ROH.indexOf(i))));
    const geladen = new Set(korpusFuer("tr").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker (keine stille Verschmelzung), als geschlossener Block", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_TR()].map((i) => bausteinId(i.kind, i.text)));
    expect(CHARGE.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    const eigeneIds = CHARGE.map((i) => bausteinId(i.kind, i.text));
    expect(new Set(eigeneIds).size).toBe(ZEILEN.length);
    // Anker nur anhängend (gemessen 09.10.2026 auf 5b5b45b6: 18.601 ⇒ 18.601 + Zeilenzahl).
    const start = KORPUS_ANKER.indexOf(eigeneIds[0]);
    expect(start).toBeGreaterThanOrEqual(18601);
    expect(KORPUS_ANKER.slice(start, start + ZEILEN.length)).toEqual(eigeneIds);
    const eigen = new Set(eigeneIds);
    expect(KORPUS_ANKER.slice(0, start).filter((id) => eigen.has(id))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    expect(CHARGE.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "Zzz probe tr t7?", kind: "satz" as const, stufen: ["kids" as const] };
    const ids = manifestFor([...FREMDE_KORPORA(), ...CORPUS_TR, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("am Ende des Lernwegs bekommen Kinder jede Zeile vollständig - Jugend und Erwachsene keine", () => {
    const alles = allowedAt(ordnung().length);
    const geliefert = new Set(corpusItemsFor({ stufe: "kids", allowed: alles, lang: "tr", lernweg: "tr" }));
    expect(ZEILEN.filter((t) => !geliefert.has(t))).toEqual([]);
    for (const stufe of ["teens", "erwachsen"] as const) {
      const andere = new Set(corpusItemsFor({ stufe, allowed: alles, lang: "tr", lernweg: "tr" }));
      expect(ZEILEN.filter((t) => andere.has(t)), stufe).toEqual([]);
    }
  });

  it("vor z kommt keine dieser Zeilen; an q kommen sie nur gekürzt (ohne ? ! : \" ; -, ohne Ziffern und Zeichen)", () => {
    const vorZ = allowedAt(sprosseVon("z") - 1);
    expect(ZEILEN.filter((t) => fitText(t, vorZ, "tr") !== null)).toEqual([]);
    const anQ = allowedAt(sprosseVon("q"));
    const geliefert = corpusItemsFor({ stufe: "kids", allowed: anQ, lang: "tr", lernweg: "tr" });
    expect(geliefert.filter((t) => /[^\p{L} .,']/u.test(t))).toEqual([]);
    const gekuerzt = ZEILEN.map((z) => fitText(z, anQ, "tr")).filter((s): s is string => s !== null);
    expect(gekuerzt.length).toBeGreaterThan(100);
    expect(geliefert.some((t) => gekuerzt.includes(t))).toBe(true);
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
