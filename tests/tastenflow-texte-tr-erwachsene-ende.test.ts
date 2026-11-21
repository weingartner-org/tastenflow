/**
 * ★★★ Wächter TR-T9 (09.10.2026): die türkischen Erwachsenentexte am Ende des Lernwegs (`corpusTrWegEndeErwachsene.ts`,
 * Sprossen 38-76 auf `tr-q` = `?` bis `½`). Aufbau aus TR-T7 (`tastenflow-texte-tr-kids-ende`: dieselben Sprossen, Naht-Regel,
 * Zahlen, Paare, Auslieferung am Ende) und TR-T6 (`tastenflow-texte-tr-erwachsene-mitte`: Geschlecht, Wortbudget Erwachsene,
 * helle Endungen, Einzahl nach Zahlwort); Datenschutz und Feiertage aus PL-T9. Befund `BEFUND-2026-10-09-TR-T9-ERWACHSENE-ENDE.md`,
 * Leitfaden Fallen 26/31/37/45/48/51/58/76/87-91.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, an dem `fitText` sie UNGEKÜRZT liefert
 * (`introOrder("tr").slice(0, n)`). `? ! : " ; -` sind weglassbar - vor ihrer Sprosse kommt die Zeile gekürzt; darum trägt
 * jede Zeile einen Buchstaben ab `z` (keine kommt vor Sprosse 23 an), und keine gekürzte Fassung hat ein grosses Wort mitten
 * im Satz, das kein Name ist (Weg „tr" hat keine Frühfassungen, `scripts/_fruehfassung.mts` liest nur de/en/fr/es - nicht
 * angefasst). Ziffern, Zeichen ab `%`, `€ ₺ ½` sind hart. Jede Regel hat eine Gegenprobe: der Prüfer muss einen gebauten
 * Fehler finden.
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
import { CORPUS_TR_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusTrWegFruehErwachsene";
import { CORPUS_TR_WEG_MITTE_ERWACHSENE } from "../src/lib/typing/corpusTrWegMitteErwachsene";
import { CORPUS_TR_WEG_MITTE_TEENS } from "../src/lib/typing/corpusTrWegMitteTeens";
import { CORPUS_TR_WEG_ENDE_KIDS } from "../src/lib/typing/corpusTrWegEndeKids";
import { CORPUS_TR_WEG_ENDE_TEENS } from "../src/lib/typing/corpusTrWegEndeTeens";
import { CORPUS_TR_WEG_ENDE_ERWACHSENE } from "../src/lib/typing/corpusTrWegEndeErwachsene";
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

const CHARGE = CORPUS_TR_WEG_ENDE_ERWACHSENE;
const ZEILEN = CHARGE.map((i) => i.text);
const EIGENE = new Set(ZEILEN);
/** Alle ANDEREN tr-Zeilen aus der ROHEN Sammelliste (TR-T1 bis TR-T7 und jede spätere Charge), nach Objekt - nie nach Text. */
const ANDERE_TR = () => TR_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_TR_ZEILEN = (): string[] => ANDERE_TR().map((i) => i.text);
/** Die Chargen, die in der rohen Liste VOR dieser stehen (für „trägt die Beleg-Liste nur Nötiges?", TR-T3 §3c). */
const FRUEHERE_TR = () => TR_ROH.slice(0, TR_ROH.indexOf(CHARGE[0]));
/** Die früheren Erwachsenen-Chargen: das Wortbudget gilt über alle drei (Falle 45). */
const ERWACHSENE_T3 = CORPUS_TR_WEG_FRUEH_ERWACHSENE.map((i) => i.text);
const ERWACHSENE_T6 = CORPUS_TR_WEG_MITTE_ERWACHSENE.map((i) => i.text);

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

describe("TR-T9: jede Zeile an ihrer Sprosse (tr-q)", () => {
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
    expect(volleEinheit("Dişçiden randevunuz var mı?")).toBe("?");
    expect(ersteSprosse("Dişçiden randevunuz var mı?")).toBe(sprosseVon("v")); // gekürzt schon an v
    expect(ersteSprosse("Afiyet olsun, sofraya buyurun!")!).toBeLessThan(sprosseVon("z")); // beim Schreiben verworfen: viel zu früh
    expect(volleEinheit("Duyuru: perşembe öğlene kadar apartmanda su kesintisi var.")).toBe(":");
    expect(volleEinheit("Adres değişikliğini e-Devlet üzerinden yaptım.")).toBe("-");
    expect(volleEinheit("Sigorta giriş belgesi (SGK onaylı) muhasebeye verildi.")).toBe(")");
    expect(volleEinheit("Bankada sıramız gelmeden 1 saat geçti.")).toBe("1");
    expect(ersteSprosse("Bankada sıramız gelmeden 1 saat geçti.")).toBe(sprosseVon("1")); // Ziffern sind hart
    expect(volleEinheit("Vapur Kabataş'tan 16.45 gibi kalkıyor.")).toBe("6");
    expect(volleEinheit("Mesai 09.00 gibi başlıyor.")).toBe("0");
    expect(volleEinheit("Satılık daire 3+1, doğalgazlı ve asansörlü.")).toBe("+");
    expect(volleEinheit("Toplu e-postada {ad} alanı her alıcı için ayrı dolduruldu.")).toBe("}");
    expect(volleEinheit("Diyarbakır'da ciğer kebabının porsiyonu ₺200.")).toBe("₺");
    expect(volleEinheit("Bugün ½ gün izin aldım.")).toBe("½");
    // Vor 43 wird der Bindestrich zur Lücke: „e Devlet" (Devlet als Namensteil erlaubt).
    expect(fitText("Adres değişikliğini e-Devlet üzerinden yaptım.", allowedAt(sprosseVon("q")), "tr")).toBe("Adres değişikliğini e Devlet üzerinden yaptım.");
  });

  /**
   * GEMESSEN am Ende von TR-T9 (vom Code gezählt, Einheit der vollen Sprosse) - darf künftig nur STEIGEN, nie unter 7.
   * `(`, `[` und `{` haben keine eigenen Zeilen.
   */
  const MINDESTENS_JE_EINHEIT: Record<string, number> = {
    "?": 36, "!": 22, ":": 17, '"': 15, ";": 9, "-": 16, ")": 11,
    "1": 11, "2": 11, "3": 11, "4": 11, "5": 11, "6": 11, "7": 10, "8": 10, "9": 10, "0": 15,
    "%": 9, "&": 7, "/": 8, "+": 7, "*": 7, "=": 7, "_": 7, ">": 7, "<": 7, "$": 7, "@": 8, "#": 7,
    "]": 7, "}": 7, "\\": 7, "|": 7, "€": 8, "₺": 11, "½": 7,
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

describe("TR-T9: jede Zeile übt die Einheit ihrer Sprosse (W6, Falle 37)", () => {
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
    expect(volleEinheit("Dişçiden randevunuz var mı.")).not.toBe("?");
  });

  it("in echten Runden (Mein Training, Erwachsene) kommen an der Sprosse von ? Fragen dieser Charge an (Fokus ?)", () => {
    const intro = ordnung().slice(0, sprosseVon("?"));
    const echt = Math.random;
    let s = 3809;
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
        for (const z of adaptiveRound({ introduced: intro, focus: ["?"], stufe: "erwachsen", lang: "tr", lernweg: "tr", count: 12 })) {
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

describe("TR-T9: Klammern und Anführungszeichen nie halb", () => {
  it("jede Zeile schliesst, was sie öffnet", () => {
    const fehler = ZEILEN.flatMap((t) => paarFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: halbe Paare werden gefunden; fitText serviert eine Klammer nie halb", () => {
    expect(paarFehler("Sigorta giriş belgesi (SGK onaylı muhasebeye verildi.")).toHaveLength(1);
    expect(paarFehler('Ustaya "kolay gelsin deyip geçtim.')).toHaveLength(1);
    expect(paarFehler("Formda [x] evli, [ bekâr yazıyor.")).toHaveLength(1);
    expect(paarFehler('Bankada "sıra" bekledik (yarım saat).')).toEqual([]);
    const nurAuf = new Set([...allowedAt(sprosseVon("(") - 1), "("]);
    expect(fitText("Sigorta giriş belgesi (SGK onaylı) muhasebeye verildi.", nurAuf, "tr")).toBeNull();
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
  if (/,[^ ]/.test(t.replace(/\d,\d/g, "0"))) f.push("kein Leerzeichen nach Komma (Dezimalkomma 1,80 ausgenommen)");
  return f;
}

/**
 * Zahlformat (Glossar §1 Regel 5/6, TDK; wie TR-T7): Uhrzeit mit PUNKT (09.00 - Stunde ≤ 23, Minuten zweistellig ≤ 59), nie
 * mit Doppelpunkt zwischen Ziffern; Dezimalkomma (€1,80); ein Punkt zwischen Ziffern ist sonst nur Tausenderpunkt (₺18.000);
 * eine vierstellige Zahl ohne Punkt nur als Jahreszahl vor „yıl…" (TDK trennt Jahreszahlen nicht: 1990 yılında); Prozent
 * und Währung VOR der Zahl (zeilenFehler); Ordnungszahl mit Punkt (4. katında) ist erlaubt; keine Endung an einer Zahl.
 */
function zahlFehler(t: string): string[] {
  const f: string[] = [];
  if (/\d:\d/.test(t)) f.push("Doppelpunkt zwischen Ziffern (Uhrzeit TDK mit Punkt: 09.00)");
  for (const m of t.matchAll(/\d+(?:\.\d+)+/g)) {
    const z = m[0];
    const uhr = /^(\d{1,2})\.(\d{2})$/.exec(z);
    const tausend = /^\d{1,3}(?:\.\d{3})+$/.test(z);
    if (uhr && Number(uhr[1]) <= 23 && Number(uhr[2]) <= 59 && !tausend) continue;
    if (tausend && !uhr) continue;
    f.push(`Zahl ${z}: weder Uhrzeit noch Tausenderpunkt`);
  }
  if (/\d\.\d{3}(?!\d)/.test(t) && /\b\d{1,2}\.\d{2}\b/.test(t.replace(/\d{1,3}(?:\.\d{3})+/g, ""))) f.push("Uhrzeit und Tausenderpunkt in einer Zeile");
  for (const m of t.matchAll(/(?<![\d.,])\d{4}(?![\d.,])/g)) {
    const jahr = /^(?:19|20)\d\d$/.test(m[0]) && t.slice(m.index! + 4).startsWith(" yıl");
    if (!jahr) f.push(`vierstellige Zahl ${m[0]} ohne Tausenderpunkt`);
  }
  if (/\d'/.test(t)) f.push("Endung an einer Zahl");
  return f;
}

/**
 * Feste, Feiertage, Staat, Religion, Militär, Wahl (Auftrag: nichts davon ohne Johannes' Ja) - Wortanfänge, `İ`-sicher
 * (Falle 89). Aus TR-T6 (`seçim, milletvekil, bakanı`) und TR-T7 (`cami, bayrak, asker`), erweitert um die Wörter einer
 * Erwachsenen-Charge am Ende (Behörden, Kalender): Meclis, Cumhurbaşkan…, Gebetszeiten, Fastenmonat, „resmî tatil". ⚠️ Wörter mit
 * `i` am Anfang als `[iİ]` - die erste Fassung fand „İftar" nicht (Falle 89, von der Gegenprobe gefunden).
 */
const FEST =
  /(?<![\p{L}])(?:bayram|ramazan|kurban|kandil|nevruz|hıdrellez|cumhuriyet|yılbaşı|anıtkabir|atatürk|sevgililer|anneler günü|babalar günü|öğretmenler günü|seçim|milletvekil|bakanı|meclis|cumhurbaşkan|başbakan|cami|bayrak|asker|şehit|namaz|oruç|[iİ]ftar|sahur|arife|kilise|cemevi|resmî tatil|resmi tatil)/iu;
/** Die Daten der gesetzlichen Feiertage (klein gelesen, `kleinFuer`): auch ohne das Wort darf keines in einer Zeile stehen. */
const FEIERTAG_DATUM = /(?<![\d])(?:1 ocak|23 nisan|1 mayıs|19 mayıs|15 temmuz|30 ağustos|29 ekim)(?![\p{L}])/u;
const festFehler = (t: string): boolean => FEST.test(t) || FEIERTAG_DATUM.test(kleinFuer(t, "tr"));

describe("TR-T9: Form, Zahlen, Regeln aller tr-Zeilen", () => {
  it("Satzanfang gross, Satzschluss am Ende, Leerzeichen richtig, nur erlaubte Zeichen", () => {
    const fehler = ZEILEN.flatMap((t) => formFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Zahlen türkisch: 09.00 · 16.45 · €1,80 · ₺18.000 · 1990 yılında · %20 · ₺350 · keine Endung an einer Zahl", () => {
    const fehler = ZEILEN.flatMap((t) => zahlFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(ZEILEN.some((t) => /\d,\d\d\b/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\b\d{2}\.\d\d gibi/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\d\.\d{3}/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /(?:19|20)\d\d yıl/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /%\d/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /₺\d/.test(t))).toBe(true);
  });

  it("jede Zeile besteht die Regeln aller türkischen Zeilen (`helfer/trTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("kein Fest, kein Feiertag (auch kein Datum), kein Staatssymbol, nichts Religiöses, Militärisches oder Politisches", () => {
    expect(ZEILEN.filter(festFehler)).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [erwachsen], nurWeg tr, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["erwachsen"]);
      expect(item.nurWeg, item.text).toBe("tr");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });

  it("Gegenprobe: jede Form-, Zahl- und Fest-Regel schlägt an", () => {
    for (const t of ["dişçiden randevunuz var mı?", "Dişçiden randevunuz var mı", "Dişçiden randevunuz var mı ?", "Kira \u2013 aidat.", "Bir,iki.", "Belge ( SGK) geldi."]) {
      expect(formFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(formFehler('"Kolay gelsin" dedim.')).toEqual([]);
    expect(formFehler("Formda [ ] bekâr kutusu var.")).toEqual([]);
    expect(formFehler("Benzin €1,80 civarında.")).toEqual([]);
    for (const t of ["Mesai 09:00 gibi başlıyor.", "Mesai 9.5 gibi başlıyor.", "Kira 1800 lira.", "Apartman 1990 bitti.", "Saat 25.10 oldu."]) {
      expect(zahlFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(zahlFehler("Mesai 09.00 gibi başlıyor, kira ₺18.000.")).toHaveLength(1); // beides in einer Zeile
    expect(zahlFehler("Apartmanımız 1990 yılında yapılmış.")).toEqual([]);
    expect(zeilenFehler("Toplantı saat 09.00'da başlıyor.").length).toBeGreaterThan(0); // Endung an der Zahl
    expect(zeilenFehler("Kira 18.000 TL.").length).toBeGreaterThan(0); // Währung hinter der Zahl
    expect(zeilenFehler("Faiz 4% civarında.").length).toBeGreaterThan(0);
    for (const t of ["Bayramda köye gidiyoruz!", "Ramazan geldi mi?", "Seçim sandığı okulda.", "Meclis yarın toplanıyor.", "İftar saatinde trafik durdu.", "Cumhurbaşkanlığı duyurdu."]) {
      expect(festFehler(t), t).toBe(true);
    }
    for (const t of ["Okullar 23 Nisan günü kapalı.", "Fabrika 1 Mayıs günü tatil.", "29 Ekim günü yollar kapalı."]) {
      expect(festFehler(t), t).toBe(true);
    }
    expect(festFehler("Göl kıyısında kurbağalar ötüyor.")).toBe(false);
    expect(festFehler("Toplantı 23 nisan değil, 24 nisan.")).toBe(true); // 23 nisan bleibt verboten - auch beiläufig
    expect(festFehler("Kira 13 nisanda yatıyor.")).toBe(false);
  });
});

// ── Datenschutz: keine Kontonummer, keine Kennnummer, Adressen nur auf .example ──

/**
 * Wie PL-T9: Geld steht nur als BETRAG. Keine IBAN (`TR` + zwei Ziffern), keine TC-Kimlik- oder Telefonnummer (lange
 * Ziffernfolgen, auch mit Leerzeichen), jede E-Mail-Adresse endet auf `.example` (RFC 2606) - es gibt keine echte.
 */
function datenschutzFehler(t: string): string[] {
  const f: string[] = [];
  if (/\bTR\s?\d{2}/u.test(t)) f.push("IBAN");
  if (/\d(?:[ ]?\d){9,}/.test(t)) f.push("lange Ziffernfolge (Kennnummer, Telefon, Konto)");
  if (/\b0?5\d\d[ ]\d{3}[ ]\d\d[ ]\d\d\b/.test(t)) f.push("Handynummer");
  for (const m of t.matchAll(/[\p{L}\d._-]+@[\p{L}\d.-]+/gu)) {
    if (!/\.example\.?$/u.test(m[0])) f.push(`Adresse ${m[0]} nicht auf .example`);
  }
  return f;
}

describe("TR-T9: Datenschutz - Beträge ja, Nummern und echte Adressen nie", () => {
  it("keine IBAN, keine Kenn- oder Telefonnummer, jede E-Mail-Adresse auf .example", () => {
    const fehler = ZEILEN.flatMap((t) => datenschutzFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(ZEILEN.filter((t) => /@[\p{L}]/u.test(t) && /\.example/.test(t)).length).toBeGreaterThanOrEqual(6);
  });

  it("Gegenprobe: IBAN, TC-Kimlik, Handynummer und eine echte Adresse werden gemeldet; @herkes und ₺18.000 nicht", () => {
    expect(datenschutzFehler("Kira TR12 0001 0000 hesabına yatıyor.").length).toBeGreaterThan(0);
    expect(datenschutzFehler("Kimlik numaram 12345678901.").length).toBeGreaterThan(0);
    expect(datenschutzFehler("Beni 0532 123 45 67 numarasından ara.").length).toBeGreaterThan(0);
    expect(datenschutzFehler("Adresim ik@firma.com.tr.").length).toBeGreaterThan(0);
    expect(datenschutzFehler("Ekip sohbetinde @herkes etiketiyle duyuru yaptım.")).toEqual([]);
    expect(datenschutzFehler("Ev sahibi kirayı ₺18.000 yaptı.")).toEqual([]);
    expect(datenschutzFehler("Başvurular için adres: ik@firma.example.")).toEqual([]);
  });
});

// ── Geschlecht ───────────────────────────────────────────────────────────────

/**
 * Wie TR-T3/TR-T6: Türkisch hat kein grammatisches Geschlecht (Glossar §1 Regel 2), aber Wörter tragen es - „kocam", „karım",
 * „hamileyim", „gelin", „damat", Bey/Hanım/abla. Keine Zeile legt so fest, wer tippt (`koca(?!eli)` aus TR-T6). Beim Schreiben
 * getroffen: „geline €100 taktı" (Hochzeit) - ersetzt durch „çifte".
 */
const GESCHLECHT =
  /(?<![\p{L}])(?:koca(?!eli)\p{L}*|karım|karımla|karıma|karımı|hamile\p{L}*|gelin\p{L}*|damat\p{L}*|bey|beyefendi|hanım\p{L}*|abla|abi|eltim|bacanağ\p{L}*|bacanak|erkeğim|kadınım|anneyim|babayım)(?![\p{L}])/iu;

describe("TR-T9: keine Zeile legt das Geschlecht der tippenden Person fest", () => {
  it("kein Wort, das das Geschlecht der Person verrät, die tippt", () => {
    expect(ZEILEN.filter((t) => GESCHLECHT.test(t))).toEqual([]);
  });

  it("Gegenprobe: „Kocamın maaşı …“, „Düğünde dayım geline €100 taktı.“ werden gefunden, „Eşim 25 yıldır …“ nicht", () => {
    expect(GESCHLECHT.test("Kocamın maaşı %25 arttı.")).toBe(true);
    expect(GESCHLECHT.test("Düğünde gurbetçi dayım geline €100 taktı.")).toBe(true);
    expect(GESCHLECHT.test("Eşim 25 yıldır aynı bankada çalışıyor.")).toBe(false);
  });
});

// ── Orte, Namen, Apostroph ──────────────────────────────────────────────────

type Region = "MAR" | "EGE" | "AKD" | "IC" | "KAR" | "DOG" | "GDO" | "AUS";
/**
 * Jeder Ort der Charge mit seiner Region (amtliche sieben Regionen der Türkei; AUS = Ausland, nur für `€ $` und Gurbet).
 * [G] - Sachangaben aus eigenem Wissen (Schlüssel klein nach `kleinFuer`): Kadıköy, Kabataş, Taksim, Beşiktaş, Kapalıçarşı
 * liegen in İstanbul, Gebze in Kocaeli, Bozcaada bei Çanakkale - Marmara. Ayvalık (wie in TR-T6 der Ägäis-Küste
 * zugerechnet), Kuşadası (Aydın), Uşak, Manisa - Ege. Antakya (Hatay), Burdur, Kahramanmaraş - Akdeniz. Nevşehir, Kırşehir -
 * İç Anadolu. Artvin, Bolu (Bolu Dağı), Tokat, Amasya, Yeşilırmak, Kastamonu - Karadeniz. Ağrı, Iğdır, Hakkâri, Tunceli
 * (Munzur), Elazığ, Malatya - Doğu Anadolu. Iğdır steht klein als `ığdır` (`kleinFuer`, Falle 89).
 */
const ORTE: Readonly<Record<string, Region>> = {
  istanbul: "MAR", kadıköy: "MAR", kabataş: "MAR", taksim: "MAR", beşiktaş: "MAR", kapalıçarşı: "MAR", gebze: "MAR",
  bursa: "MAR", edirne: "MAR", çanakkale: "MAR", bozcaada: "MAR",
  izmir: "EGE", ayvalık: "EGE", manisa: "EGE", kuşadası: "EGE", uşak: "EGE", muğla: "EGE", bodrum: "EGE",
  antalya: "AKD", adana: "AKD", mersin: "AKD", hatay: "AKD", antakya: "AKD", burdur: "AKD", kahramanmaraş: "AKD",
  ankara: "IC", eskişehir: "IC", konya: "IC", sivas: "IC", kırşehir: "IC", nevşehir: "IC",
  trabzon: "KAR", samsun: "KAR", sinop: "KAR", artvin: "KAR", bolu: "KAR", giresun: "KAR", rize: "KAR", tokat: "KAR",
  amasya: "KAR", yeşilırmak: "KAR", karadeniz: "KAR", kastamonu: "KAR",
  van: "DOG", kars: "DOG", erzurum: "DOG", erzincan: "DOG", malatya: "DOG", elazığ: "DOG", ağrı: "DOG", hakkâri: "DOG",
  tunceli: "DOG", munzur: "DOG", ığdır: "DOG",
  gaziantep: "GDO", şanlıurfa: "GDO", mardin: "GDO", diyarbakır: "GDO",
  almanya: "AUS", hollanda: "AUS", avrupa: "AUS", viyana: "AUS", brüksel: "AUS", fransa: "AUS", berlin: "AUS", amerika: "AUS",
};
/** Vornamen und Familiennamen (Firmenschilder) - heutige Namen aus der ganzen Türkei, kein Tatoeba-Platzhalter (kein Ali). */
const NAMEN: ReadonlySet<string> = new Set("pınar gökhan serkan nail gülsüm ayhan yıldız kaya demir aksoy".split(" "));
/** Teile von Eigennamen, die mitten im Satz gross stehen: Bolu Dağı, Konya Ovası, Ayhan & Oğulları Nakliyat, Yıldız & Kaya Danışmanlık, e-Devlet, e-Nabız (vor 43 als „e Devlet", „e Nabız" serviert). */
const NAMENSTEILE: ReadonlySet<string> = new Set("dağı ovası oğulları nakliyat danışmanlık devlet nabız".split(" "));
/**
 * Andere Eigennamen, Abkürzungen und Zeichen, die gross stehen: das Land (Türkiye), Excel, Windows, WhatsApp, die
 * Brailleschrift, das Gericht İskender, die Abkürzungen KDV (Mehrwertsteuer), SGK (Sozialversicherung), DASK (Pflicht-
 * Erdbebenversicherung), ASKİ (Wasserwerke Ankara) und einzelne Buchstaben als Zeichen (Blutgruppe A, Kürzel G und S).
 */
const SONSTIGE_NAMEN: ReadonlySet<string> = new Set("türkiye excel kdv sgk aski windows whatsapp braille iskender dask a g s".split(" "));
const istEigenname = (w: string) => w in ORTE || NAMEN.has(w) || NAMENSTEILE.has(w) || SONSTIGE_NAMEN.has(w);

/** Technische Wörter (Adressen, Pfade, Rechnungen, Formeln, Zeichen) - sie werden nicht als Wörter geprüft. */
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

/** GEMESSEN am Ende von TR-T9. */
const MINDESTENS_JE_REGION = 9;
const HOECHSTENS_JE_REGION = 20;
const MINDESTENS_VERORTET = 85; // gemessen 85: MAR 13, EGE 14, AKD 10, IC 13, KAR 14, DOG 17, GDO 9 (AUS 10 zählt nicht)

describe("TR-T9: Orte aus der ganzen Türkei, Eigennamen, Apostroph nur am Namen", () => {
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

  it("€ steht nur in Zeilen über das Ausland oder ohne Ort - nie mit einem Ort in der Türkei", () => {
    const euro = ZEILEN.filter((z) => z.includes("€"));
    expect(euro.length).toBeGreaterThanOrEqual(7);
    expect(euro.filter((z) => [...regionenDerZeile(z)].some((r) => r !== "AUS"))).toEqual([]);
  });

  it("Gegenprobe: unbekannte Grosswörter, Bindestrich-Teile, Anführung, Doppelpunkt und Satzanfänge werden richtig gelesen", () => {
    expect(unbekannteGrosse("Kuzenim Atlantis'te çalışıyor.")).toEqual(["Atlantis'te"]);
    expect(unbekannteGrosse("Ankara-Sivas hızlı treni yolu kısalttı.")).toEqual([]);
    expect(unbekannteGrosse("Ankara-Atlantis treni hızlı.")).toEqual(["Atlantis"]);
    expect(unbekannteGrosse('"Kolay gelsin" dedi Pınar.')).toEqual([]);
    expect(unbekannteGrosse("Geldin mi? Yarın gel.")).toEqual([]);
    expect(unbekannteGrosse("Geldin ve Yarın gel.")).toEqual(["Yarın"]);
    expect([...regionenDerZeile("Iğdır'ın kayısısını Ankara'ya yolladık.")].sort()).toEqual(["DOG", "IC"]);
    expect([...regionenDerZeile("Brüksel'de bir fincan kahve €4 imiş.")]).toEqual(["AUS"]);
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
    expect(ZEILEN.filter((t) => t.includes("'")).length).toBeGreaterThanOrEqual(90);
  });

  it("Gegenprobe: Gebze'teki (Angleichung), Kars'te (Harmonie), Kabataş'dan und ein Gattungswort mit Apostroph werden gemeldet", () => {
    expect(endungFehler("gebze", "teki")).toHaveLength(1);
    expect(endungFehler("kars", "te")).toHaveLength(1);
    expect(endungFehler("kabataş", "dan")).toHaveLength(1);
    expect(endungFehler("kabataş", "tan")).toEqual([]);
    expect(endungFehler("kuşadası", "ndaki")).toEqual([]);
    expect(istEigenname("fatura")).toBe(false);
  });
});

// ── Gekürzt serviert: kein grosses Wort mitten im Satz ─────────────────────

/**
 * Wird eine Zeile vor ihrer vollen Sprosse gekürzt serviert, fällt mit `? ! : " ;` auch die Satzgrenze weg - ein Wort, das
 * danach gross steht, stünde mitten im Satz. Darum steht dort nur ein Name oder Ort (Naht-Regel aus PL-T7/TR-T7).
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

describe("TR-T9: gekürzt serviert - kein Grossbuchstabe mitten im Satz", () => {
  it("jede Zeile, die vor ihrer Sprosse gekürzt kommt, liest sich ohne Grosswort mitten im Satz", () => {
    const fehler = ZEILEN.flatMap((z) => fruehNahtFehler(z).map((f) => `"${z}" @ ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „Doktor dedi: \"Bol su için.\"“ würde vor „:“ zu „Doktor dedi Bol su için“; ein Name nach : ist erlaubt", () => {
    expect(fruehNahtFehler('Doktor dedi: "Bol su için."').length).toBeGreaterThan(0);
    expect(fruehNahtFehler("Bu haftaki nöbet listesi: Pınar, Gökhan ve Serkan.")).toEqual([]);
    expect(fitText("Dişçiden randevunuz var mı?", allowedAt(sprosseVon("q")), "tr")).toBe("Dişçiden randevunuz var mı");
  });
});

// ── Wortschatz: Wortgrenze 8 über T3 + T6 + T9, Sperrliste, Belege, Endungen ──

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht (Liste aus TR-T4/TR-T6). */
const FUNKTIONSWOERTER = new Set(
  (
    "bir bu şu o ben sen biz siz onlar bana sana beni seni benim senin bize ile da de ki mi mı mu mü ne en ama ya " +
    "kadar gibi için daha çok her hiç tam yine ve var yok değil"
  ).split(" "),
);

/**
 * Inhaltswörter je Zeile zählen. Ein einzelner Buchstabe ist kein Wort: das „e" von e-Devlet/e-posta/e-imza und die
 * Zeichen „A", „G", „S" zählen nicht (sonst stünde „e" in 12 Zeilen, ohne dass ein Wort sich wiederholt).
 */
function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    for (const w of new Set(woerterKlein(z))) if (w.length >= 2 && !FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/**
 * Der Zähler des TR-T6-Wächters (`tastenflow-texte-tr-erwachsene-mitte`) liest Wörter nur an Leerzeichen, Komma und Punkt
 * getrennt - auch Ziffern („1" aus „1 saat", „1.000") zählen dort. Er zählt diese Charge mit (alle Erwachsenenzeilen):
 * dieselbe Grenze hier, damit der Merge ihn nicht rot macht.
 */
function zuHaeufigT6Zaehler(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    for (const w of new Set(kleinFuer(z, "tr").split(/[\s,.]+/u).filter(Boolean))) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
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
 * Lexikon-Nachtrag nimmt nur Formen mit mindestens zwei Tatoeba-Belegen; Amts-, Büro-, Küchen- und Mundartwörter fehlen
 * dort oft). [G] - eigenes Sprachwissen, NICHT an einer Quelle belegt; das macOS-Wörterbuch prüft Türkisch nur halb (Falle 87)
 * und ist hier kein Beweis. Viele stehen nur als Stamm einer Form unten. ⚠️ Von keiner Person mit Türkisch als Erstsprache gelesen.
 */
const NEUE_GRUNDFORMEN: Readonly<Record<string, string>> = {
  açıköğretimde: "im Fernstudium (Açıköğretim, zusammengeschrieben) - als Ganzes belegt",
  aidat: "Hausgeld, Umlage im Wohnblock",
  başvur: "Stamm von başvurmak (sich bewerben, beantragen) - nur als Stamm",
  bekâr: "ledig (TDK mit â)",
  beyanname: "Steuererklärung (vergi beyannamesi)",
  beyran: "Suppe aus Lamm und Reis, in Gaziantep zum Frühstück - nur als Stamm",
  bildir: "Stamm von bildirmek (melden) - nur als Stamm",
  birik: "Stamm von birikmek (sich ansammeln) - nur als Stamm",
  birikim: "Ersparnis (eigenes Wort, nicht „mein Angesammeltes\")",
  birim: "Abteilung, Stelle (im Amt) - nur als Stamm",
  birleştir: "Stamm von birleştirmek (zusammenfügen) - nur als Stamm",
  buda: "Stamm von budamak (Reben, Bäume schneiden) - nur als Stamm",
  büro: "Büro, Kanzlei - nur als Stamm",
  civar: "Umgebung; „X civarında\" = ungefähr X - nur als Stamm",
  civil: "„civil peyniri\" = Fadenkäse aus Erzurum",
  çıkabiliyor: "„kann hinauffahren\": çık + -abil- + -iyor - als Ganzes belegt",
  çibörek: "Teigtasche der Krimtataren, Eskişehir",
  çipura: "Goldbrasse - nur als Stamm",
  çizelge: "Plan, Tabelle - nur als Stamm",
  çökelek: "Quarkkäse",
  dâhilî: "intern; „dâhilî numara\" = Durchwahl (TDK mit â und î)",
  dekont: "Überweisungs- oder Zahlungsbeleg - nur als Stamm",
  demlen: "Stamm von demlenmek (Tee zieht) - nur als Stamm",
  deterjan: "Spülmittel, Waschmittel - nur als Stamm",
  dipnot: "Fussnote",
  doldur: "Stamm von doldurmak (ausfüllen) - nur als Stamm",
  doz: "Dosis - nur als Stamm",
  duyur: "Stamm von duyurmak (bekanntgeben) - nur als Stamm",
  eczacı: "wer in der Apotheke arbeitet (ecza + -cı)",
  emekle: "Stamm von emeklemek (krabbeln) - nur als Stamm",
  formül: "Formel - auch allein in der Zeile",
  gecik: "Stamm von gecikmek (sich verspäten) - nur als Stamm",
  gıcır: "„gıcır gıcır\" = nagelneu, blitzblank",
  gidiliyor: "„man fährt hin\": gid (Stamm von gitmek, t ⇒ d) + -il- + -iyor - als Ganzes belegt",
  hane: "Stelle (einer Zahl), Haushalt - nur als Stamm",
  harç: "Gebühr; „harç makbuzu\" = Gebührenquittung",
  hazırla: "Stamm von hazırlamak (vorbereiten) - nur als Stamm",
  horon: "Kreistanz der Schwarzmeerküste",
  hücre: "Zelle; „40 hücreli Braille ekranı\" = Braillezeile mit 40 Zellen - nur als Stamm",
  ikametgâh: "Wohnsitz; „ikametgâh belgesi\" = Meldebescheinigung (TDK mit â)",
  ilerle: "Stamm von ilerlemek (vorankommen) - nur als Stamm",
  ileti: "Nachricht (E-Mail)",
  isot: "getrocknete Paprika aus Şanlıurfa",
  istirahat: "Ruhe; „istirahat raporu\" = Krankschreibung",
  izle: "Stamm von izlemek (verfolgen, ansehen) - nur als Stamm",
  karayolu: "Fernstrasse (zusammengeschrieben)",
  karnına: "„aç karnına\" = nüchtern: karın mit Vokalausfall (karn-) + -ına - als Ganzes belegt",
  kıvam: "richtige Konsistenz - nur als Stamm",
  kıyma: "Hackfleisch („kıymalı pide\") - nur als Stamm",
  klinik: "Klinik, Praxis - nur als Stamm (erweicht: kliniği)",
  komut: "Befehl - nur als Stamm",
  konteyner: "Container",
  kooperatif: "Genossenschaft - nur als Stamm",
  közleyeceğiz: "„wir werden sie über der Glut rösten\" (közlemek) - als Ganzes belegt",
  marangoz: "Tischler",
  masraf: "Kosten, Ausgabe - nur als Stamm",
  mililitre: "Milliliter",
  modem: "Modem - nur als Stamm",
  muhasebe: "Buchhaltung",
  müjde: "frohe Botschaft (Ausruf)",
  numaratör: "Nummernautomat am Schalter - nur als Stamm",
  otopark: "Parkplatz, Parkhaus - nur als Stamm",
  öde: "„zahle\" (ödemek), im Werbespruch „üç al, iki öde\"",
  ölç: "Stamm von ölçmek (messen) - nur als Stamm",
  pano: "Tafel, Aushang - nur als Stamm",
  paylaş: "Stamm von paylaşmak (teilen) - nur als Stamm",
  perhiz: "Diät (vom Arzt)",
  poliçe: "Versicherungspolice - nur als Stamm",
  poliklinik: "Ambulanz im Krankenhaus - nur als Stamm (erweicht: polikliniği)",
  priz: "Steckdose - nur als Stamm",
  saklıyor: "„bewahrt auf\": sakla + -iyor, das a fällt vor -yor - als Ganzes belegt",
  seslendir: "Stamm von seslendirmek (vorlesen, vertonen) - nur als Stamm",
  siyez: "Einkorn (Urweizen aus Kastamonu)",
  soğumasın: "„soll nicht kalt werden\" (soğumak) - als Ganzes belegt",
  sunucu: "Server - nur als Stamm",
  sur: "Stadtmauer - nur als Stamm",
  sütun: "Spalte - nur als Stamm",
  şablon: "Vorlage - nur als Stamm",
  şarküteri: "Feinkostladen",
  şaşır: "Stamm von şaşırmak (staunen) - nur als Stamm",
  tanıt: "Stamm von tanıtmak (vorstellen, bewerben) - nur als Stamm",
  tapu: "Grundbuch, Grundbuchamt",
  tara: "Stamm von taramak (scannen) - nur als Stamm",
  tarayıcı: "Scanner - nur als Stamm",
  tarife: "Tarif - nur als Stamm",
  taşınırken: "„beim Umziehen\": taşın + Aorist -ır + -ken; -ken ist unveränderlich - als Ganzes belegt",
  taşıt: "Fahrzeug",
  tepmek: "„horon tepmek\" = Horon tanzen",
  tereyağlı: "mit Butter (tereyağı + -lı, das ı fällt) - als Ganzes belegt",
  tıkan: "Stamm von tıkanmak (verstopfen, stocken) - nur als Stamm",
  uğruyor: "„kommt vorbei\": uğra + -iyor, das a fällt vor -yor - als Ganzes belegt",
  ulaş: "Stamm von ulaşmak (erreichen) - nur als Stamm",
  vantilatör: "Ventilator - nur als Stamm",
  yağhane: "Ölmühle - nur als Stamm",
  yapabiliyor: "„kann machen\": yap + -abil- + -iyor; das i von -bil- ist fest - als Ganzes belegt",
  yay: "Stamm von yaymak (verteilen, strecken) - nur als Stamm",
  yayımla: "Stamm von yayımlamak (veröffentlichen) - nur als Stamm",
  yenile: "Stamm von yenilemek (erneuern) - nur als Stamm",
  yetişebiliyorum: "„ich schaffe es rechtzeitig\": yetiş + -ebil- + -iyorum - als Ganzes belegt",
  yuvalama: "Suppe mit kleinen Fleischbällchen aus Gaziantep",
  zebeş: "Wassermelone in Diyarbakır und Şanlıurfa (Mundart) - Inhalt der Zeile ist genau dieses Wort",
};

/**
 * Neue Formen = bekannter Stamm + Endung. Der Stamm stand im Wortschatz, in einer anderen tr-Charge, ist eine Grundform
 * oben oder ein Ort. Mit drittem Eintrag: der Stamm ist die ERWEICHTE Form dieses Wortes (hesap ⇒ hesab-, kebap ⇒ kebab-,
 * durak ⇒ durağ-). Die Endung ist ausgeschrieben, damit Vokalharmonie und d/t-Angleichung NACHGERECHNET werden (Puffer
 * `n y s` gehören zur Endung). Ein angehängtes „-ki“ (formdaki, gurbetteki) ist unveränderlich.
 */
const NEUE_FORMEN: Readonly<Record<string, readonly [string, string] | readonly [string, string, string]>> = {
  acilde: ["acil", "de"], adresinden: ["adres", "inden"], ağaçlarımız: ["ağaç", "larımız"], aidatını: ["aidat", "ını"],
  aidatları: ["aidat", "ları"], alanıyla: ["alan", "ıyla"], alanlarını: ["alan", "larını"], alıcı: ["al", "ıcı"],
  alınmıyor: ["al", "ınmıyor"], almışsınız: ["al", "mışsınız"], apartmanımız: ["apartman", "ımız"], arayınca: ["ara", "yınca"],
  arızasını: ["arıza", "sını"], asansörlü: ["asansör", "lü"], asansörü: ["asansör", "ü"], aya: ["ay", "a"],
  ayarlı: ["ayar", "lı"], aylıktan: ["aylık", "tan"], bakımda: ["bakım", "da"], bakkalın: ["bakkal", "ın"],
  balıkçıda: ["balıkçı", "da"], bankada: ["banka", "da"], barajların: ["baraj", "ların"], basılıyor: ["bas", "ılıyor"],
  basılmış: ["bas", "ılmış"], basmayın: ["bas", "mayın"], başarılıydı: ["başarılı", "ydı"], başlamamı: ["başla", "mamı"],
  başlanmaz: ["başla", "nmaz"], başvurduk: ["başvur", "duk"], başvurular: ["başvuru", "lar"],
  battaniyeleri: ["battaniye", "leri"], beğendik: ["beğen", "dik"], belgeler: ["belge", "ler"], belgesini: ["belge", "sini"],
  benzinin: ["benzin", "in"], beyranı: ["beyran", "ı"], bırakılmış: ["bırak", "ılmış"], bildirdim: ["bildir", "dim"],
  bildirelim: ["bildir", "elim"], birikmişti: ["birik", "mişti"], birime: ["birim", "e"], birleştirdim: ["birleştir", "dim"],
  bloklar: ["blok", "lar"], boyadım: ["boya", "dım"], bozdurduk: ["boz", "durduk"], bozuluyor: ["boz", "uluyor"],
  budadık: ["buda", "dık"], bulguru: ["bulgur", "u"], buzdolabına: ["buzdolabı", "na"], bürosu: ["büro", "su"],
  bürosunda: ["büro", "sunda"], bürosunun: ["büro", "sunun"], civarına: ["civar", "ına"], cüzdanı: ["cüzdan", "ı"],
  çatısı: ["çatı", "sı"], çayını: ["çay", "ını"], çekilmiyor: ["çekil", "miyor"], çeşidini: ["çeşid", "ini", "çeşit"],
  çıktıktan: ["çık", "tıktan"], çipuranın: ["çipura", "nın"], çizelgesi: ["çizelge", "si"], çizelgesinde: ["çizelge", "sinde"],
  çorbanız: ["çorba", "nız"], daireler: ["daire", "ler"], dairesi: ["daire", "si"],
  değişikliğini: ["değişikliğ", "ini", "değişiklik"], dekontları: ["dekont", "ları"], demleniyor: ["demlen", "iyor"],
  depozitosunu: ["depozito", "sunu"], deterjanı: ["deterjan", "ı"], dikiyor: ["dik", "iyor"], dilekçede: ["dilekçe", "de"],
  dinlenin: ["dinlen", "in"], dinleniyorum: ["dinlen", "iyorum"], dişçiden: ["diş", "çiden"], dizili: ["dizi", "li"],
  doğalgazlı: ["doğalgaz", "lı"], dolapları: ["dolap", "ları"], doldurmak: ["doldur", "mak"], dolduruldu: ["doldur", "uldu"],
  doluluğu: ["doluluğ", "u", "doluluk"], dondurmanın: ["dondurma", "nın"], donma: ["don", "ma"], dosyada: ["dosya", "da"],
  dosyasının: ["dosya", "sının"], dozuyla: ["doz", "uyla"], durağa: ["durağ", "a", "durak"], duvarının: ["duvar", "ının"],
  duyurduk: ["duyur", "duk"], düğünlerde: ["düğün", "lerde"], dükkânınız: ["dükkân", "ınız"], düzenimiz: ["düzen", "imiz"],
  düzenine: ["düzen", "ine"], ehliyetin: ["ehliyet", "in"], ekiyor: ["ek", "iyor"], ekleniyor: ["ekle", "niyor"],
  ekranım: ["ekran", "ım"], emeklemeye: ["emekle", "meye"], emekliliğime: ["emekliliğ", "ime", "emeklilik"],
  eşyalı: ["eşya", "lı"], etiketli: ["etiket", "li"], evinizi: ["ev", "inizi"], evrakın: ["evrak", "ın"],
  fabrikamızda: ["fabrika", "mızda"], fabrikasına: ["fabrika", "sına"], faizi: ["faiz", "i"], faturada: ["fatura", "da"],
  faturaları: ["fatura", "ları"], faturam: ["fatura", "m"], faturanın: ["fatura", "nın"], firmasının: ["firma", "sının"],
  fiyatlara: ["fiyat", "lara"], formdaki: ["form", "daki"], fotoğrafları: ["fotoğraf", "ları"], gazetesini: ["gazete", "sini"],
  gececi: ["gece", "ci"], gecikme: ["gecik", "me"], gerekenler: ["gereken", "ler"], göndereyim: ["gönder", "eyim"],
  görüntülü: ["görüntü", "lü"], götürdüklerimiz: ["götür", "düklerimiz"], grubum: ["grub", "um", "grup"],
  gurbetteki: ["gurbet", "teki"], gündüzcüyüm: ["gündüz", "cüyüm"], halılar: ["halı", "lar"], halıyı: ["halı", "yı"],
  hamsiyi: ["hamsi", "yi"], hanesi: ["hane", "si"], hastanenin: ["hastane", "nin"], hazırladık: ["hazırla", "dık"],
  hazırlığı: ["hazırlığ", "ı", "hazırlık"], hesabında: ["hesab", "ında", "hesap"], hesaplanır: ["hesap", "lanır"],
  hücreleri: ["hücre", "leri"], hücreli: ["hücre", "li"], ışıklarıyla: ["ışık", "larıyla"], içimiz: ["iç", "imiz"],
  içmemi: ["iç", "memi"], ihracatı: ["ihracat", "ı"], ilanda: ["ilan", "da"], ilanında: ["ilan", "ında"],
  ilerlemiyor: ["ilerle", "miyor"], imzası: ["imza", "sı"], indirdiğim: ["indir", "diğim"], indirdim: ["indir", "dim"],
  indirimi: ["indirim", "i"], inşaatta: ["inşaat", "ta"], istenenler: ["istenen", "ler"], işlemleri: ["işlem", "leri"],
  itirazını: ["itiraz", "ını"], iyileşin: ["iyileş", "in"], izinden: ["izin", "den"], izleniyor: ["izle", "niyor"],
  kahvaltının: ["kahvaltı", "nın"], kalınlığı: ["kalın", "lığı"], kampanyada: ["kampanya", "da"],
  kampanyayı: ["kampanya", "yı"], kargomuz: ["kargo", "muz"], karpuza: ["karpuz", "a"], kartımda: ["kart", "ımda"],
  kartına: ["kart", "ına"], katına: ["kat", "ına"], kattaki: ["kat", "taki"], kazasından: ["kaza", "sından"],
  kebabının: ["kebab", "ının", "kebap"], kıvamında: ["kıvam", "ında"], kıymalı: ["kıyma", "lı"], kiracıyız: ["kiracı", "yız"],
  kiraları: ["kira", "ları"], kiramız: ["kira", "mız"], kirasına: ["kira", "sına"], klasörde: ["klasör", "de"],
  kliniği: ["kliniğ", "i", "klinik"], kolesterolü: ["kolesterol", "ü"], komşumuzla: ["komşu", "muzla"],
  konakları: ["konak", "ları"], kontratı: ["kontrat", "ı"], kontratta: ["kontrat", "ta"], konuşuldu: ["konuş", "uldu"],
  kooperatifimiz: ["kooperatif", "imiz"], korumasına: ["koruma", "sına"], kredisini: ["kredi", "sini"],
  kredisinin: ["kredi", "sinin"], kuruluyor: ["kur", "uluyor"], kurumsal: ["kurum", "sal"], kuruşu: ["kuruş", "u"],
  kuruşuna: ["kuruş", "una"], kuşaktır: ["kuşak", "tır"], kutularından: ["kutu", "larından"], kutusunu: ["kutu", "sunu"],
  künefeci: ["künefe", "ci"], limanında: ["liman", "ında"], lisansı: ["lisans", "ı"], lokantasının: ["lokanta", "sının"],
  maaşlara: ["maaş", "lara"], mahallemiz: ["mahalle", "miz"], makbuzu: ["makbuz", "u"], masadan: ["masa", "dan"],
  masrafını: ["masraf", "ını"], menüler: ["menü", "ler"], menüsünde: ["menü", "sünde"], merdivenler: ["merdiven", "ler"],
  merkeze: ["merkez", "e"], mesaiyle: ["mesai", "yle"], mesajında: ["mesaj", "ında"], metreye: ["metre", "ye"],
  milyonu: ["milyon", "u"], modemin: ["modem", "in"], montlarda: ["mont", "larda"], muayenesinde: ["muayene", "sinde"],
  muhasebeci: ["muhasebe", "ci"], muhasebeye: ["muhasebe", "ye"], muhtarlık: ["muhtar", "lık"], mülakatta: ["mülakat", "ta"],
  notlarında: ["not", "larında"], numaramın: ["numara", "mın"], numaratörden: ["numaratör", "den"], ofisin: ["ofis", "in"],
  okunmamış: ["oku", "nmamış"], okuyucum: ["okuyucu", "m"], onaylıyor: ["onay", "lıyor"], otlu: ["ot", "lu"],
  otobüsünü: ["otobüs", "ünü"], otoparkı: ["otopark", "ı"], otoparkın: ["otopark", "ın"], otoyolu: ["otoyol", "u"],
  ödenir: ["öde", "nir"], ödeyince: ["öde", "yince"], öğlene: ["öğlen", "e"], ölçüldü: ["ölç", "üldü"],
  özetinde: ["özet", "inde"], panosunda: ["pano", "sunda"], paylaşıldı: ["paylaş", "ıldı"], pişiriyor: ["pişir", "iyor"],
  poliçesi: ["poliçe", "si"], poliçesini: ["poliçe", "sini"], polikliniği: ["polikliniğ", "i", "poliklinik"],
  porsiyonu: ["porsiyon", "u"], postada: ["posta", "da"], postayı: ["posta", "yı"], primim: ["prim", "im"],
  prize: ["priz", "e"], programındaki: ["program", "ındaki"], rahatladı: ["rahat", "ladı"], randevusunu: ["randevu", "sunu"],
  rehberini: ["rehber", "ini"], sabahçı: ["sabah", "çı"], saçınız: ["saç", "ınız"], salonları: ["salon", "ları"],
  santimetreyi: ["santimetre", "yi"], santralini: ["santral", "ini"], satırında: ["satır", "ında"],
  satırları: ["satır", "ları"], satışına: ["satış", "ına"], sayfanın: ["sayfa", "nın"], servisim: ["servis", "im"],
  seslendiriyor: ["seslendir", "iyor"], sıcağı: ["sıcağ", "ı", "sıcak"], sıhhatler: ["sıhhat", "ler"],
  sıramız: ["sıra", "mız"], sigortalı: ["sigorta", "lı"], sitemizin: ["site", "mizin"], sonuçlarıma: ["sonuç", "larıma"],
  sordukları: ["sor", "dukları"], sözleşmede: ["sözleşme", "de"], sözleşmeleri: ["sözleşme", "leri"],
  sunucusunda: ["sunucu", "sunda"], surları: ["sur", "ları"], süresiyle: ["süre", "siyle"], sütlaca: ["sütlac", "a", "sütlaç"],
  sütunları: ["sütun", "ları"], şablonu: ["şablon", "u"], şablonunda: ["şablon", "unda"], şaşırdık: ["şaşır", "dık"],
  şifremle: ["şifre", "mle"], şikâyetimi: ["şikâyet", "imi"], şubesi: ["şube", "si"], tahlilleri: ["tahlil", "leri"],
  takayım: ["tak", "ayım"], takibinde: ["takib", "inde", "takip"], taksitte: ["taksit", "te"], tamirini: ["tamir", "ini"],
  tanıtıyor: ["tanıt", "ıyor"], tansiyonum: ["tansiyon", "um"], taranan: ["tara", "nan"], tarayıcıdan: ["tarayıcı", "dan"],
  tarifeler: ["tarife", "ler"], taslağında: ["taslağ", "ında", "taslak"], taşımada: ["taşıma", "da"],
  tazminatı: ["tazminat", "ı"], temizleyecek: ["temiz", "leyecek"], terfiniz: ["terfi", "niz"], tezgâhları: ["tezgâh", "ları"],
  tıkandı: ["tıkan", "dı"], topladım: ["topla", "dım"], torununa: ["torun", "una"], traktörle: ["traktör", "le"],
  trenleri: ["tren", "leri"], tulumu: ["tulum", "u"], tuşladım: ["tuş", "ladım"], tutanağında: ["tutanağ", "ında", "tutanak"],
  tuttunuz: ["tut", "tunuz"], ulaşılıyor: ["ulaş", "ılıyor"], ustaya: ["usta", "ya"], uygulamasında: ["uygulama", "sında"],
  vantilatörle: ["vantilatör", "le"], vardiyalar: ["vardiya", "lar"], yağhanede: ["yağhane", "de"], yaydık: ["yay", "dık"],
  yayımladı: ["yayımla", "dı"], yazlığa: ["yazlığ", "a", "yazlık"], yazlığı: ["yazlığ", "ı", "yazlık"],
  yazmaları: ["yazma", "ları"], yedekleri: ["yedek", "leri"], yenilediniz: ["yenile", "diniz"], yenilemek: ["yenile", "mek"],
  yolladıkları: ["yolla", "dıkları"], yolundan: ["yol", "undan"], yolunuz: ["yol", "unuz"], yöneticiyle: ["yönetici", "yle"],
  yönetimine: ["yönetim", "ine"], yönetmeliğine: ["yönetmeliğ", "ine", "yönetmelik"], yüzyıllardır: ["yüzyıl", "lardır"],
  zammı: ["zam", "mı"],
};

const HINTEN = new Set(["a", "ı", "o", "u", "â", "û"]);
const VOKALE = new Set(["a", "e", "ı", "i", "o", "ö", "u", "ü", "â", "î", "û"]);
const STIMMLOS = new Set(["ç", "f", "h", "k", "p", "s", "ş", "t"]);
/**
 * Lehnwörter mit hinterem Vokal, die HELLE Endungen nehmen (TDK, Ausnahmen der großen Vokalharmonie): aus TR-T6 saat,
 * kontrol, ampul, hâl, santral; neu kolesterol (TDK „kolesterol, -lü“ ⇒ kolesterolü) und sıhhat („-ti“ ⇒ sıhhatler).
 * Ein gerundeter letzter Vokal (o, u) wird zu ö, sonst zu e - darum kolesterolü, nicht kolesteroli.
 */
const HELLE_ENDUNG: ReadonlySet<string> = new Set(["saat", "kontrol", "ampul", "hâl", "santral", "harf", "kolesterol", "sıhhat"]);
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
 * (formdaki, Kuşadası'ndaki) ist unveränderlich und wird nicht geprüft. `â î û` gelten als a i u.
 */
function endungFehler(stamm: string, endungRoh: string): string[] {
  const fehler: string[] = [];
  const endung = endungRoh.endsWith("ki") && endungRoh.length > 2 ? endungRoh.slice(0, -2) : endungRoh;
  const letzter = [...stamm].reverse().find((z) => VOKALE.has(z));
  let vorher = HELLE_ENDUNG.has(stamm) ? (letzter === "o" || letzter === "u" || letzter === "û" ? "ö" : "e") : letzter;
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
/** Nach einem Zahlwort steht die Einzahl (Glossar Regel 5): „dört hane“, nie „dört haneler“. */
function mehrzahlNachZahl(zeile: string): string[] {
  const w = woerterKlein(zeile);
  return w.filter((x, i) => i > 0 && ZAHLWOERTER.has(w[i - 1]) && /l[ae]r(?:ı|i|a|e|da|de|dan|den|ın|in)?$/u.test(x));
}

describe("TR-T9: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("★ Wortbudget Erwachsene: auch über TR-T3 + TR-T6 + TR-T9 zusammen steht kein Inhaltswort in mehr als 8 Zeilen (Falle 45)", () => {
    expect(ERWACHSENE_T3.length).toBeGreaterThan(100);
    expect(ERWACHSENE_T6.length).toBeGreaterThan(200);
    const fehler = zuHaeufig([...ERWACHSENE_T3, ...ERWACHSENE_T6, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("★ dasselbe mit dem Zähler des TR-T6-Wächters (Ziffern zählen dort mit) - der Merge macht ihn nicht rot", () => {
    const fehler = zuHaeufigT6Zaehler([...ERWACHSENE_T3, ...ERWACHSENE_T6, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (gross, mit Satzzeichen, nach Ziffer), ein Funktionswort und ein Buchstabe nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Kira" : "Bu 9 kira"} ${"abcdefghi"[i]}? Ve e-posta.`);
    expect(zuHaeufig(neun)).toEqual(['"kira": 9 Zeilen', '"posta": 9 Zeilen']);
    expect(zuHaeufigT6Zaehler(Array.from({ length: 9 }, (_, i) => `Kira ${"abcdefghi"[i]} 1 saat.`))).toEqual(['"kira": 9 Zeilen', '"1": 9 Zeilen', '"saat": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - Kern, Wortbasis, gefaltet (ı→i ş→s …) und kein unerwünschtes Themenwort", () => {
    const fehler = ZEILEN.flatMap((t) =>
      [...woerterOhneZeichen(t), ...woerterKlein(t)].filter((w) => gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w)).map((w) => `"${t}": ${w}`),
    );
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: was beim Schreiben anschlug (şık, sık, ördü - gefaltet sik und ordu) - aidat, kombi, tapu nicht", () => {
    expect(istKernGesperrtTr("sik")).toBe(true);
    for (const w of ["şık", "sık", "ördü"]) expect(gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w), w).toBe(true);
    for (const w of ["aidat", "kombi", "tapu"]) expect(gesperrtGefaltetTr(w) || fuerWortlisteUngeeignetTr(w), w).toBe(false);
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
    expect(endungFehler("bakkal", "in")).toHaveLength(1);
    expect(endungFehler("kolesterol", "u")).toHaveLength(1); // TDK: kolesterol, -lü
    expect(endungFehler("kolesterol", "i")).toHaveLength(1); // gerundet: ü, nicht i
    expect(endungFehler("kolesterol", "ü")).toEqual([]);
    expect(endungFehler("sıhhat", "lar")).toHaveLength(1);
    expect(endungFehler("sıhhat", "ler")).toEqual([]);
    expect(endungFehler("inşaat", "da")).toHaveLength(1);
    expect(endungFehler("banka", "ta")).toHaveLength(1);
    expect(endungFehler("gurbet", "teki")).toEqual([]);
    expect(endungFehler("gurbet", "taki")).toHaveLength(1);
    expect(erweicht("hesap")).toBe("hesab");
    expect(erweicht("kebap")).toBe("kebab");
    expect(erweicht("yönetmelik")).toBe("yönetmeliğ");
    expect(ungeprueft(["Aidat yine geldi.", "Aidatt yine geldi."])).toEqual(["aidatt"]);
  });

  it("nach einem Zahlwort steht die Einzahl", () => {
    const fehler = ZEILEN.flatMap((z) => mehrzahlNachZahl(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „dört haneler“ wird gemeldet, „dört hanesi“ nicht", () => {
    expect(mehrzahlNachZahl("Kartın dört haneler görünüyor.")).toEqual(["haneler"]);
    expect(mehrzahlNachZahl("Kartın yalnızca dört hanesi görünüyor.")).toEqual([]);
  });

  /** Die Stimme liest Leerzeichen-Wörter; technische Wörter (Adressen, Pfade, Formeln) liest sie als Zeichen. */
  const stimmWoerter = (zeile: string): string[] =>
    zeile
      .split(/\s+/)
      .map((roh) => roh.replace(/^["(]+|[.,!?:;")]+$/gu, ""))
      .filter((w) => w.length >= 2 && !TECHNISCH.test(w));

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58: Anteil buchstabierter Zeilen = 0)", () => {
    const buchstabiert = ZEILEN.filter((z) => stimmWoerter(z).some((w) => !isRealWord(w, "tr")));
    expect(buchstabiert).toEqual([]);
    expect(stimmWoerter('e-Devlet, "kolay gelsin" ve 3+1.')).toEqual(["e-Devlet", "kolay", "gelsin", "ve"]);
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

describe("TR-T9: keine Kopien, keine Paare, nichts fast gleich - gegen Korpora, Serien und Banken aller Sprachen", () => {
  it("keine Zeile doppelt - auch nicht ohne Zeichen oder nach dem Ledger-Schlüssel (Zeichen und ç ğ ı ş sind dort Trenner)", () => {
    expect(new Set(ZEILEN.map(ohneZeichen)).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("die Vergleichsmenge ist voll (Serien und Banken geladen, pl/cs, TR-T1 bis TR-T7)", () => {
    expect(bankZeilen().length).toBeGreaterThan(1000);
    expect(SERIEN.length).toBeGreaterThan(100);
    expect(CORPUS_PL.length).toBeGreaterThan(0);
    expect(CORPUS_CS.length).toBeGreaterThan(0);
    expect(ANDERE_TR().filter((i) => CORPUS_TR_WEG_ENDE_KIDS.includes(i)).length).toBe(CORPUS_TR_WEG_ENDE_KIDS.length);
    expect(ANDERE_TR().filter((i) => CORPUS_TR_WEG_ENDE_TEENS.includes(i)).length).toBe(CORPUS_TR_WEG_ENDE_TEENS.length);
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

  it("Gegenprobe: Serienzeile, Banken-Satz, TR-T6- und TR-T7-Zeile als Kopie; beim Schreiben verworfene Zeilen wären fast gleich", () => {
    const fremd = new Set(alleFremdenZeilen().map(ohneZeichen));
    expect(fremd.has(ohneZeichen(SERIEN[0].etappen[0].lines[0]))).toBe(true);
    expect(fremd.has(ohneZeichen(bankZeilen()[0].split(/(?<=[.!?])\s+/u)[0]))).toBe(true);
    expect(fremd.has(ohneZeichen(ERWACHSENE_T6[0]))).toBe(true);
    expect(fremd.has(ohneZeichen(CORPUS_TR_WEG_ENDE_KIDS[0].text))).toBe(true);
    expect(fremd.has(ohneZeichen(ZEILEN[0]))).toBe(false);
    // Verworfen (Befund §2): „kira yine arttı" stand als Wendung schon in TR-T3.
    expect(fastGleich(wortMenge("Kira yine arttı; taşınmayı düşünüyoruz."), wortMenge("kira yine arttı"))).toBe(true);
    expect(paare(["Faturalar geldi.", "Fatura geldi."])).toHaveLength(1);
  });
});

// ── Korpus-Anker und Auslieferung ──────────────────────────────────────────

describe("TR-T9: Korpus-Anker und Auslieferung", () => {
  it("die rohe Sammelliste trägt die Charge als geschlossenen Block HINTER TR-T7 und TR-T8, und korpusFuer(\"tr\") jede Zeile", () => {
    const start = TR_ROH.indexOf(CHARGE[0]);
    expect(TR_ROH.slice(start, start + CHARGE.length)).toEqual(CHARGE);
    expect(start).toBeGreaterThan(Math.max(...CORPUS_TR_WEG_ENDE_KIDS.map((i) => TR_ROH.indexOf(i))));
    // ★ Merge 09.10.2026: TR-T8 (Jugend Ende) kam parallel und steht davor.
    expect(start).toBeGreaterThan(Math.max(...CORPUS_TR_WEG_ENDE_TEENS.map((i) => TR_ROH.indexOf(i))));
    expect(start).toBeGreaterThan(Math.max(...CORPUS_TR_WEG_MITTE_ERWACHSENE.map((i) => TR_ROH.indexOf(i))));
    const geladen = new Set(korpusFuer("tr").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker (keine stille Verschmelzung), als geschlossener Block", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_TR()].map((i) => bausteinId(i.kind, i.text)));
    expect(CHARGE.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    const eigeneIds = CHARGE.map((i) => bausteinId(i.kind, i.text));
    expect(new Set(eigeneIds).size).toBe(ZEILEN.length);
    // Anker nur anhängend (Merge 09.10.2026 mit feat/tastenflow 28924ab3: 20.894 ⇒ 20.894 + Zeilenzahl).
    const start = KORPUS_ANKER.indexOf(eigeneIds[0]);
    expect(start).toBeGreaterThanOrEqual(20894);
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
    const probe = { text: "Zzz probe tr t9?", kind: "satz" as const, stufen: ["erwachsen" as const] };
    const ids = manifestFor([...FREMDE_KORPORA(), ...CORPUS_TR, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("am Ende des Lernwegs bekommen Erwachsene jede Zeile vollständig - Kinder und Jugend keine", () => {
    const alles = allowedAt(ordnung().length);
    const geliefert = new Set(corpusItemsFor({ stufe: "erwachsen", allowed: alles, lang: "tr", lernweg: "tr" }));
    expect(ZEILEN.filter((t) => !geliefert.has(t))).toEqual([]);
    for (const stufe of ["kids", "teens"] as const) {
      const andere = new Set(corpusItemsFor({ stufe, allowed: alles, lang: "tr", lernweg: "tr" }));
      expect(ZEILEN.filter((t) => andere.has(t)), stufe).toEqual([]);
    }
  });

  it("vor z kommt keine dieser Zeilen; an q kommen sie nur gekürzt (ohne ? ! : \" ; -, ohne Ziffern und Zeichen)", () => {
    const vorZ = allowedAt(sprosseVon("z") - 1);
    expect(ZEILEN.filter((t) => fitText(t, vorZ, "tr") !== null)).toEqual([]);
    const anQ = allowedAt(sprosseVon("q"));
    const geliefert = corpusItemsFor({ stufe: "erwachsen", allowed: anQ, lang: "tr", lernweg: "tr" });
    expect(geliefert.filter((t) => /[^\p{L} .,']/u.test(t))).toEqual([]);
    const gekuerzt = ZEILEN.map((z) => fitText(z, anQ, "tr")).filter((s): s is string => s !== null);
    expect(gekuerzt.length).toBeGreaterThan(100);
    expect(geliefert.some((t) => gekuerzt.includes(t))).toBe(true);
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
