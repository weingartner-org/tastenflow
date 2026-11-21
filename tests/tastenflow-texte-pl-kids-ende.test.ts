/**
 * ★★★ Wächter PL-T7 (09.10.2026): die polnischen Kindertexte am Ende des Lernwegs
 * (`corpusPlWegEndeKids.ts`, Sprossen 40-77 auf der Tastatur `pl` = `?` bis `€`).
 * Vorbilder: `tastenflow-texte-pl-kids-mitte.test.ts` (PL-T4), `tastenflow-texte-pl-erwachsene-mitte.test.ts`
 * (PL-T6) und - nur als Form - `tastenflow-texte-it-kids-ende.test.ts` (IT-T7); Befund
 * `BEFUND-2026-10-09-PL-T7-KIDS-ENDE.md`, Leitfaden Fallen 26/31/37/45/48/51/58/61/67/76.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, an dem `fitText` sie UNGEKÜRZT liefert
 * (`introOrder("pl").slice(0, n)`). `? ! - " : ( )` sind auf Weg „pl" weglassbar - vor ihrer Sprosse
 * kommt die Zeile gekürzt an; darum trägt jede Zeile einen Buchstaben ab `ł`, und keine gekürzte
 * Fassung hat ein grosses Wort mitten im Satz (Weg „pl" hat keine Frühfassungen). Ziffern, `'` und die
 * Zeichen ab `%` sind hart. Jede Regel hat eine Gegenprobe: der Prüfer muss einen gebauten Fehler finden.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, korpusFuer, CORPUS, CORPUS_EN, CORPUS_FR, CORPUS_IT, CORPUS_PL, CORPUS_TR, CORPUS_CS } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_PL_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusPlWegFruehKids";
import { CORPUS_PL_WEG_MITTE_KIDS } from "../src/lib/typing/corpusPlWegMitteKids";
import { CORPUS_PL_WEG_MITTE_ERWACHSENE } from "../src/lib/typing/corpusPlWegMitteErwachsene";
import { CORPUS_PL_WEG_ENDE_KIDS } from "../src/lib/typing/corpusPlWegEndeKids";
import { CORPUS_PL as PL_ROH } from "../src/lib/typing/corpusPl";
import { allowedFromIntroduced, SERIEN } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { bausteinId, bausteinKey } from "../src/lib/typing/ledger";
import { adaptiveRound } from "../src/lib/typing/generator";
import { corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";
import { gesperrtPl, istKernGesperrtPl, ohneOgonki } from "../src/lib/typing/sperrlistePl";
import { WORDS_PL, STUFE_VOCAB_PL } from "../src/lib/typing/wordsPl";
import { NACHTRAG_PL, NACHTRAG_PL_ERGAENZT } from "../src/lib/typing/lexikonNachtragPl";
import { isRealWord } from "../src/lib/typing/lexicon";
import { zeilenFehler } from "./helfer/plTextRegeln";

afterEach(() => setLayout("de"));

const CHARGE = CORPUS_PL_WEG_ENDE_KIDS;
const ZEILEN = CHARGE.map((i) => i.text);
const EIGENE = new Set(ZEILEN);
/** Die früheren Kinder-Chargen (Wortbudget gilt über alle drei - Falle 45). */
const T1 = CORPUS_PL_WEG_FRUEH_KIDS.map((i) => i.text);
const T4 = CORPUS_PL_WEG_MITTE_KIDS.map((i) => i.text);
/**
 * Alle anderen pl-Chargen aus der ROHEN Sammelliste `corpusPl.ts` (nach Objekt, Lehre PL-T3): T1-T6 und jede spätere.
 * Die geladene `CORPUS_PL` hätte Kopien schon still verschmolzen.
 */
const ANDERE_PL = () => PL_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_PL_ZEILEN = ANDERE_PL().map((i) => i.text);

// ── Sprossen ────────────────────────────────────────────────────────────────

const ordnung = (): string[] => {
  setLayout("pl");
  return introOrder("pl");
};
const allowedCache = new Map<number, Set<string>>();
function allowedAt(n: number): Set<string> {
  const o = ordnung();
  let s = allowedCache.get(n);
  if (!s) {
    s = allowedFromIntroduced(o.slice(0, n), "pl");
    allowedCache.set(n, s);
  }
  return s;
}
const sprosseVon = (einheit: string): number => ordnung().indexOf(einheit) + 1;
const norm = (t: string) => t.replace(/\s+/g, " ").trim();

/** Kleinste Sprosse, ab der die Zeile VOLLSTÄNDIG erscheint (null = nie). */
const volleCache = new Map<string, number | null>();
function volleSprosse(text: string): number | null {
  if (volleCache.has(text)) return volleCache.get(text)!;
  const n0 = ordnung().length;
  let erg: number | null = null;
  for (let n = 1; n <= n0; n++) if (fitText(text, allowedAt(n), "pl") === norm(text)) { erg = n; break; }
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
  for (let n = 1; n <= n0; n++) if (fitText(text, allowedAt(n), "pl") !== null) return n;
  return null;
}

/** Feste Paare: die öffnende Hälfte hat keine eigenen Zeilen, die Zeile zählt beim Gegenstück. */
const OHNE_EIGENE_ZEILEN = new Set(["(", "[", "{"]);

describe("PL-T7: jede Zeile an ihrer Sprosse (Tastatur pl)", () => {
  it("die Folge nach q: ? ! - \" : ( ) ' 1-9 0 % & / + * = _ < > $ | \\ @ # ^ [ ] { } € (40-77)", () => {
    const o = ordnung();
    expect(sprosseVon("q")).toBe(39);
    expect(o.length).toBe(77);
    expect(o.slice(39).join(" ")).toBe("? ! - \" : ( ) ' 1 2 3 4 5 6 7 8 9 0 % & / + * = _ < > $ | \\ @ # ^ [ ] { } €");
  });

  it("jede Zeile erscheint vollständig NACH q, kommt nie vor ł (26) überhaupt an, und minTier stimmt", () => {
    const fehler: string[] = [];
    for (const item of CHARGE) {
      const v = volleSprosse(item.text);
      const e = ersteSprosse(item.text);
      if (v === null || v <= sprosseVon("q")) fehler.push(`"${item.text}": volle Sprosse ${v}`);
      if (e === null || e < sprosseVon("ł")) fehler.push(`"${item.text}": schon an Sprosse ${e} serviert (vor ł)`);
      const tier = minTierFor(item.text, "pl");
      if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
    }
    expect(fehler, fehler.slice(0, 12).join("\n")).toEqual([]);
  });

  it("Gegenprobe: Sprossen und Einheiten werden richtig gerechnet", () => {
    expect(volleEinheit("Kto idzie?")).toBe("?");
    expect(ersteSprosse("Kto idzie?")!).toBeLessThan(sprosseVon("ł")); // ohne späten Buchstaben: viel zu früh
    expect(ersteSprosse("Kto idzie z babcią?")).toBe(sprosseVon("ą"));
    expect(volleEinheit("Kot (mały) śpi.")).toBe(")");
    expect(volleEinheit("Pismo Braille'a.")).toBe("'");
    expect(ersteSprosse("Pismo Braille'a.")).toBe(sprosseVon("'")); // der Apostroph ist hart
    expect(volleEinheit("Mam 12 lat.")).toBe("2");
    expect(volleEinheit("Wychodzimy o 7:15.")).toBe("7");
    expect(volleEinheit("Lekcje są o 8:00.")).toBe("0");
    expect(volleEinheit("To 1,5 litra.")).toBe("5");
    expect(volleEinheit("Plik w C:\\Gry.")).toBe("\\");
    expect(volleEinheit("Zbiór {1, 2}.")).toBe("}");
    expect(volleEinheit("Kosztuje 2 €.")).toBe("€");
    // Vor 42 wird der Bindestrich zur Lücke: „Bielsko Biała" (ein Ort, zwei grosse Wörter - erlaubt).
    expect(fitText("Bielsko-Biała to miasto.", allowedAt(sprosseVon("q")), "pl")).toBe("Bielsko Biała to miasto.");
  });

  /**
   * GEMESSEN am Ende von PL-T7 (vom Code gezählt, Einheit der vollen Sprosse) - darf künftig nur STEIGEN, nie unter 6.
   * `(`, `[` und `{` haben keine eigenen Zeilen.
   */
  const MINDESTENS_JE_EINHEIT: Record<string, number> = {
    "?": 37, "!": 32, "-": 18, '"': 17, ":": 18, ")": 11, "'": 7,
    "1": 10, "2": 12, "3": 11, "4": 11, "5": 12, "6": 12, "7": 11, "8": 11, "9": 12, "0": 15,
    "%": 7, "&": 7, "/": 7, "+": 7, "*": 7, "=": 7, "_": 7, "<": 7, ">": 7, "$": 7, "|": 7, "\\": 7, "@": 7, "#": 7,
    "^": 6, "]": 7, "}": 7, "€": 8,
  };

  it("je Einheit mindestens so viele Zeilen wie gemessen, jede Einheit mindestens 6, ( [ { ohne eigene Zeilen", () => {
    const anzahl = new Map<string, number>();
    for (const t of ZEILEN) {
      const e = volleEinheit(t);
      if (e !== null) anzahl.set(e, (anzahl.get(e) ?? 0) + 1);
    }
    const zuWenig: string[] = [];
    for (const [e, min] of Object.entries(MINDESTENS_JE_EINHEIT)) {
      if ((anzahl.get(e) ?? 0) < Math.max(6, min)) zuWenig.push(`„${e}": ${anzahl.get(e) ?? 0} < ${Math.max(6, min)}`);
    }
    for (const [e, n] of anzahl) if (n < 6) zuWenig.push(`„${e}": nur ${n}`);
    for (const e of OHNE_EIGENE_ZEILEN) expect(anzahl.has(e), e).toBe(false);
    expect(zuWenig, zuWenig.join("\n")).toEqual([]);
    expect([...anzahl.values()].reduce((a, b) => a + b, 0)).toBe(ZEILEN.length);
  });
});

describe("PL-T7: jede Zeile übt die Einheit ihrer Sprosse (W6, Falle 37)", () => {
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

  it("Gegenprobe: eine Zeile ohne ihre Einheit (Frage ohne ?) wird gemeldet", () => {
    expect(volleEinheit("Kto idzie z babcią.")).not.toBe("?");
  });

  it("in echten Runden (Mein Training, Kinder) kommen an der Sprosse von ? Fragen dieser Charge an (Fokus ?)", () => {
    const intro = ordnung().slice(0, sprosseVon("?"));
    const echt = Math.random;
    let s = 4007;
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
        for (const z of adaptiveRound({ introduced: intro, focus: ["?"], stufe: "kids", lang: "pl", lernweg: "pl", count: 12 })) {
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

describe("PL-T7: Klammern und Anführungszeichen nie halb", () => {
  it("jede Zeile schliesst, was sie öffnet", () => {
    const fehler = ZEILEN.flatMap((t) => paarFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: halbe Paare werden gefunden; fitText serviert eine Klammer nie halb", () => {
    expect(paarFehler("Kot (mały śpi.")).toHaveLength(1);
    expect(paarFehler('Mówi "cześć.')).toHaveLength(1);
    expect(paarFehler("Lista [1, 2.")).toHaveLength(1);
    expect(paarFehler('"Hej!" woła Ola (cicho).')).toEqual([]);
    const nurAuf = new Set([...allowedAt(sprosseVon("(") - 1), "("]);
    expect(fitText("Kot (mały) śpi.", nurAuf, "pl")).toBeNull();
  });
});

// ── Form und Zahlen ─────────────────────────────────────────────────────────

const ERLAUBT = /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9 .,:?!"'()\-[\]{}%&/+*=_<>$|\\@#^€]+$/;

/** Form-Verstösse einer Zeile (Zeichen, Satzanfang, Satzschluss, Leerzeichen). */
function formFehler(t: string): string[] {
  const f: string[] = [];
  if (!ERLAUBT.test(t)) f.push("Zeichen ausserhalb des Satzes (auch ; - der kommt in dieser Charge nicht vor)");
  if (/ {2}/.test(t) || t !== t.trim()) f.push("Leerzeichen");
  if (!/^"?\p{Lu}/u.test(t)) f.push("beginnt nicht mit einem Grossbuchstaben");
  if (!/[.!?]"?$/.test(t)) f.push("kein Satzschluss am Ende");
  // Zwei allein stehende Klammern um ein Zeichen sind eine Erwähnung der Tasten („[ i ] są obok litery p"), kein Satzzeichen.
  const u = t.replace(/ [[({] \S+ [\])}](?=[\s.,!?]|$)/g, " X");
  if (/ [.,:?!](?=\s|$)/.test(u) || /(?<![[{|]) [)\]}](?!\s)/.test(u)) f.push("Leerzeichen vor Satzzeichen");
  if (/[([{] (?![\]}])/.test(u)) f.push("Leerzeichen nach öffnender Klammer");
  if (/,[^ ]/.test(t.replace(/\d,\d/g, "0"))) f.push("kein Leerzeichen nach Komma (Dezimalkomma 1,5 ausgenommen)");
  if (/\bto:/u.test(t)) f.push("Doppelpunkt nach „to“ (im Polnischen ein Fehler)");
  return f;
}

/**
 * Zahlformat (Glossar §1 Nr. 5, §2.10): Dezimalkomma (1,5), kein Tausenderpunkt, vierstellig ohne Trenner,
 * Prozent ohne Leerzeichen (95%), Uhrzeit 7:15 (Minuten zweistellig), Währung NACH der Zahl mit Leerzeichen
 * („20 zł", „5 €", „5 $"), keine Ordnungszahl mit Punkt („3. klasa").
 */
function zahlFehler(t: string): string[] {
  const f: string[] = [];
  if (/\d %/.test(t)) f.push("Leerzeichen vor %");
  if (/\d[€$]|[€$] ?\d/.test(t)) f.push("Währung nicht als „5 €“");
  if (/\d\.\d/.test(t)) f.push("Dezimal- oder Tausenderpunkt");
  if (/\d\. \p{Ll}/u.test(t)) f.push("Ordnungszahl mit Punkt");
  for (const m of t.matchAll(/\d{5,}/g)) f.push(`Zahl ${m[0]} ohne Leerzeichen-Trenner`);
  for (const m of t.matchAll(/\b(\d{1,2}):(\d+)\b/g)) {
    if (/\b(z|o|do)$/.test(t.slice(0, m.index).trim()) || /godzin|o $/.test(t.slice(Math.max(0, (m.index ?? 0) - 2), m.index))) {
      if (m[2].length !== 2 || Number(m[1]) > 23 || Number(m[2]) > 59) f.push(`Uhrzeit ${m[0]}`);
    }
  }
  return f;
}

describe("PL-T7: Form und Zahlen", () => {
  it("Satzanfang gross, Satzschluss am Ende, Leerzeichen richtig, nur erlaubte Zeichen", () => {
    const fehler = ZEILEN.flatMap((t) => formFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Zahlen im Landesbrauch: 1,5 · 7:15 · 95% · 20 zł · 5 € · keine Ordnungszahl mit Punkt", () => {
    const fehler = ZEILEN.flatMap((t) => zahlFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(ZEILEN.some((t) => /\d,5\b/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\bo \d{1,2}:\d\d\b/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\d zł(?!\p{L})/u.test(t))).toBe(true);
  });

  it("jede Zeile besteht die Regeln aller polnischen Zeilen (`helfer/plTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [kids], nurWeg pl, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["kids"]);
      expect(item.nurWeg, item.text).toBe("pl");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });

  it("Gegenprobe: jede Form- und Zahlregel schlägt an", () => {
    for (const t of ["ola idzie.", "Ola idzie", "Ola idzie .", "Ola \u2013 idzie.", "Raz,dwa.", "Kot ( mały) śpi.", "Tak; nie.", "Polskie góry to: Tatry."]) {
      expect(formFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(formFehler('"Hej!" woła Ola.')).toEqual([]);
    expect(formFehler("Klamry { } wyglądają jak wąsy.")).toEqual([]);
    expect(formFehler("Na klawiaturze [ i ] są obok litery p.")).toEqual([]);
    for (const t of ["Mam 50 % baterii.", "Kosztuje 2€.", "Kosztuje € 2.", "Waży 1.5 kilo.", "Jest 12345 osób.", "Wstaję o 7:5.", "Chodzę do 3. klasy."]) {
      expect(zahlFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(zahlFehler("O 7:15, za 20 zł, 95% i 1,5 szklanki, wynik 2:1, 5 €.")).toEqual([]);
  });
});

// ── Geschlecht: Vergangenheit nur über benannte Personen ─────────────────────

const ENDUNG_ICH_DU = /(łem|łam|łeś|łaś|liśmy|łyśmy|liście|łyście)$/u;
/** Nomen mit derselben Endung (kein Verb): masłem (Instr. von masło). Wächst nur mit gelesenen Formen. */
const NOMEN_AUF_LEM = new Set<string>(["masłem"]);
const JESTEM = new Set(["jestem", "jesteś", "jesteśmy", "jesteście"]);
function legtLesendeFest(zeile: string): boolean {
  const w = zeile.toLowerCase().match(/\p{L}+/gu) ?? [];
  if (w.some((x) => ENDUNG_ICH_DU.test(x) && !NOMEN_AUF_LEM.has(x))) return true;
  return w.some((x, i) => JESTEM.has(x) && /(y|a|i|e)$/u.test(w[i + 1] ?? "") && w[i + 1] !== "w" && w[i + 1] !== "na");
}

describe("PL-T7: keine Zeile legt das Geschlecht der lesenden Person fest", () => {
  it("keine 1./2. Person der Vergangenheit, kein „jestem/jesteś“ + Adjektiv", () => {
    expect(ZEILEN.filter(legtLesendeFest)).toEqual([]);
  });

  it("Gegenprobe: „Byłam w Łodzi!“, „Wygraliśmy 3:2!“, „Jestem gotowa?“ werden gefunden, „Lech strzela gola.“ nicht", () => {
    for (const t of ["Byłam w Łodzi!", "Wygraliśmy 3:2!", "Jestem gotowa?", "Zjadłeś 3/4 pizzy?"]) expect(legtLesendeFest(t), t).toBe(true);
    expect(legtLesendeFest("Lech strzela gola po 19 minutach gry.")).toBe(false);
    expect(legtLesendeFest("Hura, jesteśmy na szczycie Śnieżki!")).toBe(false);
  });
});

// ── Orte, Namen und Grosswörter ─────────────────────────────────────────────

type Raum =
  | "MAL" | "PODH" | "MAZ" | "WM" | "POM" | "KASZ" | "ZPOM" | "PDL" | "KUJ" | "WLK" | "LUB" | "PKR" | "SLA" | "DSL" | "OPO"
  | "SWI" | "LOD" | "LUBU" | "REGION" | "AUSLAND";

/**
 * Orte, Landschaften, Berge, Gewässer (die Wortform, klein) mit ihrem Raum. MAL Małopolska ohne Podhale · PODH Podhale
 * und Tatry · KASZ Kaszuby · ZPOM Zachodniopomorskie · REGION über mehrere Räume (Wisła, Odra, Warta, Bug, Polska) ·
 * AUSLAND. Kleine Adjektive zählen (`toruńskie`, `śląskie`).
 */
const ORTE: Readonly<Record<string, Raum>> = {
  krakowie: "MAL", kraków: "MAL", kościuszki: "MAL", wieliczka: "MAL", zalipie: "MAL", ojcowa: "MAL", sącza: "MAL", babia: "MAL",
  tatrach: "PODH", zakopanem: "PODH", zakopane: "PODH", zakopanego: "PODH", gubałówkę: "PODH", tatry: "PODH", tatrami: "PODH",
  pieniny: "PODH", rysy: "PODH",
  warszawy: "MAZ", szczęśliwicką: "MAZ", płocka: "MAZ", płocku: "MAZ", łazienkach: "MAZ", siedlcach: "MAZ", radomia: "MAZ",
  olsztyna: "WM", olsztynem: "WM", śniardwy: "WM", ełku: "WM", elblągu: "WM",
  gdańsku: "POM", gdańska: "POM", łebie: "POM", łeby: "POM", hel: "POM", helu: "POM", ustce: "POM", sopocie: "POM", dębkach: "POM",
  kaszubach: "KASZ",
  szczecina: "ZPOM", kołobrzegu: "ZPOM", koszalinie: "ZPOM", darłowie: "ZPOM",
  białymstoku: "PDL", suwałki: "PDL", suwałkach: "PDL", wigry: "PDL", białowieskiej: "PDL", podlasia: "PDL",
  toruniu: "KUJ", toruńskie: "KUJ", bydgoszczy: "KUJ", brdą: "KUJ", inowrocławia: "KUJ", chełmna: "KUJ",
  poznaniu: "WLK", kórnika: "WLK", lesznie: "WLK", gnieźnie: "WLK", gniezna: "WLK", kaliszu: "WLK",
  zamościu: "LUB", kazimierz: "LUB", lubelszczyzny: "LUB", lublinie: "LUB", lublina: "LUB", chełma: "LUB",
  bieszczadach: "PKR", bieszczady: "PKR", przemyśla: "PKR", rzeszowie: "PKR", łańcuta: "PKR", mielca: "PKR",
  bielsko: "SLA", biała: "SLA", beskidów: "SLA", chorzowie: "SLA", wiśle: "SLA", gliwic: "SLA", śląskie: "SLA",
  wrocławiu: "DSL", śnieżkę: "DSL", śnieżki: "DSL", śnieżka: "DSL", karpacza: "DSL", porębie: "DSL", jeleniej: "DSL",
  karkonosze: "DSL", karkonoszy: "DSL", ślęża: "DSL",
  krasiejowie: "OPO", kędzierzyn: "OPO", koźle: "OPO", opolszczyźnie: "OPO", opolu: "OPO", opola: "OPO",
  sandomierza: "SWI", kielcach: "SWI", kielcami: "SWI", pacanowa: "SWI", łysica: "SWI",
  łódź: "LOD", łodzi: "LOD", kutnie: "LOD", łowicza: "LOD", łowiczem: "LOD", sieradza: "LOD",
  międzyrzeczu: "LUBU", słubice: "LUBU", zielonej: "LUBU", zielona: "LUBU", gorzów: "LUBU", lubuskiej: "LUBU",
  wisła: "REGION", wisłę: "REGION", odra: "REGION", odrą: "REGION", warta: "REGION", wartę: "REGION", polski: "REGION",
  polsce: "REGION", polska: "REGION", bug: "REGION", narwi: "REGION",
  afryki: "AUSLAND", ameryce: "AUSLAND", berlina: "AUSLAND", chicago: "AUSLAND", czechach: "AUSLAND", czechy: "AUSLAND",
  słowacji: "AUSLAND", wilnie: "AUSLAND", ukrainą: "AUSLAND", białorusią: "AUSLAND", frankfurtem: "AUSLAND", europy: "AUSLAND",
  stanów: "AUSLAND",
};

/** Grossgeschriebene Teile von Orts- und Eigennamen, die selbst kein Ort sind (Kazimierz Dolny, Długi Targ, Zielona Góra …). */
const NAMENSTEILE = new Set([
  "dolny", "góra", "góry", "górze", "górkę", "długi", "targ", "neptuna", "królewskich", "puszczy", "szklarskiej", "nowego",
  "kopca", "wielkopolski", "ziemi", "zjednoczonych", "leśnej", "długiej",
]);

/**
 * Menschen, Tiere, Figuren und benannte Dinge (klein): Mädchen und Jungen gleichwertig; Figuren aus polnischen
 * Kinderbüchern und Comics (Tytus, Romek i A'Tomek - Papcio Chmiel; Lokomotywa - Julian Tuwim); Louis Braille; Harry
 * Potter und Hermiona; Vereine (Lech, Legia), der Wettbewerb Kangur, Programme und Tasten (Scratch, Python, Windows,
 * Shift, Enter), Ladennamen in Anführung („Lody & Gofry", „Śrubki & Kółka").
 */
const NAMEN = new Set(
  (
    "hania szymku tosia tosi bartku bartek igo kasiu bruna bruno halina józef staś julka wiktorii leon leona ola maks lena " +
    "filip antosi ala filemon tytus romek a'tomek a'tomku tytusie antek harry'ego pottera marek hermiona leny ewelina staszek " +
    "hubert huberta gabrysia natalia zosia ula oskara igor igora mai izy wiktoria maja zuzia burek kasia oliwia tymka kacper " +
    "szymon weronika juliana tuwima braille'a lokomotywa lech legia kangur kangura scratchu pythonie windowsie shift shiftem " +
    "enterem gofry kółka"
  ).split(" "),
);

/** Technische Wörter (Adressen, Pfade, Rechnungen, Spielstände) - sie werden nicht als Wörter geprüft, die Stimme liest Zeichen. */
const TECHNISCH = /[@_/#=<>|*+&$%€\\^\d[\]{}]/;

/** Wörter einer Zeile mit Merker „Satzanfang" (Zeilenanfang, nach . ? !, Anfang einer Anführung); technische Wörter fallen weg. */
function woerterMitAnfang(zeile: string): { w: string; anfang: boolean }[] {
  const out: { w: string; anfang: boolean }[] = [];
  let naechsterAnfang = true;
  for (const roh of zeile.split(/\s+/)) {
    const kern = roh.replace(/^["(]+|[.,!?:")]+$/g, "");
    if (!TECHNISCH.test(kern)) {
      for (const [i, teil] of kern.split("-").entries()) {
        const w = teil.replace(/^[^\p{L}]+|[^\p{L}']+$/gu, "");
        if (w) out.push({ w, anfang: i === 0 && (naechsterAnfang || roh.startsWith('"')) });
      }
    }
    naechsterAnfang = /[.!?]"?\)?$/.test(roh);
  }
  return out;
}

const istBekanntesGrosswort = (w: string): boolean => {
  const k = w.toLowerCase();
  return k in ORTE || NAMEN.has(k) || NAMENSTEILE.has(k);
};

/** Grossgeschriebene Wörter, die weder Satzanfang noch Ort, Name oder Namensteil sind. */
function unbekannteGrosswoerter(zeile: string): string[] {
  return woerterMitAnfang(zeile)
    .filter((x) => !x.anfang && /^\p{Lu}/u.test(x.w) && !istBekanntesGrosswort(x.w))
    .map((x) => x.w);
}

const woerterKlein = (zeile: string): string[] => woerterMitAnfang(zeile).map((x) => x.w.toLowerCase());

function raeumeIn(zeile: string): Set<Raum> {
  return new Set(woerterKlein(zeile).filter((w) => w in ORTE).map((w) => ORTE[w]));
}

function verteilung(zeilen: string[]): Map<Raum | "verortet", number> {
  const v = new Map<Raum | "verortet", number>();
  for (const z of zeilen) {
    const r = [...raeumeIn(z)].filter((x) => x !== "REGION" && x !== "AUSLAND");
    if (r.length === 0) continue;
    v.set("verortet", (v.get("verortet") ?? 0) + 1);
    for (const x of r) v.set(x, (v.get(x) ?? 0) + 1);
  }
  return v;
}

/** Die 16 Woiwodschaften, über die Räume: Małopolska = MAL + PODH, Pomorskie = POM + KASZ. */
const WOIWODSCHAFTEN: Raum[][] = [
  ["MAL", "PODH"], ["MAZ"], ["WM"], ["POM", "KASZ"], ["ZPOM"], ["PDL"], ["KUJ"], ["WLK"], ["LUB"], ["PKR"], ["SLA"], ["DSL"],
  ["OPO"], ["SWI"], ["LOD"], ["LUBU"],
];
/** GEMESSEN am Ende von PL-T7: verortet, und die Obergrenze je Raum (Podhale und Dolny Śląsk sind die grössten). */
const MINDESTENS_VERORTET = 115; // gemessen 115 (ohne Zeilen nur mit Wisła/Polska oder Ausland)
const HOECHSTENS_JE_RAUM = 14;
const MINDESTENS_JE_WOIWODSCHAFT = 4;

describe("PL-T7: Orte aus ganz Polen, keine Region gehäuft", () => {
  it("jedes grossgeschriebene Wort mitten im Satz ist ein bekannter Ort, Name oder Namensteil", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it(`alle 16 Woiwodschaften je mindestens ${MINDESTENS_JE_WOIWODSCHAFT} Zeilen; kein Raum über ${HOECHSTENS_JE_RAUM}; mindestens ${MINDESTENS_VERORTET} Zeilen verortet`, () => {
    const v = verteilung(ZEILEN);
    const proWoi = WOIWODSCHAFTEN.map((rs) => [rs.join("+"), ZEILEN.filter((z) => [...raeumeIn(z)].some((r) => rs.includes(r))).length] as const);
    expect(proWoi.filter(([, n]) => n < MINDESTENS_JE_WOIWODSCHAFT).map(([r, n]) => `${r}: ${n}`)).toEqual([]);
    expect([...v].filter(([r, n]) => r !== "verortet" && n > HOECHSTENS_JE_RAUM).map(([r, n]) => `${r}: ${n}`)).toEqual([]);
    expect(v.get("verortet") ?? 0).toBeGreaterThanOrEqual(MINDESTENS_VERORTET);
  });

  it("die in PL-T4 dünnen Räume tragen hier mehr: Lubuskie, Śląsk, Łódzkie je ≥ 4, Kaszuby kommt vor", () => {
    const v = verteilung(ZEILEN);
    for (const r of ["LUBU", "SLA", "LOD"] as Raum[]) expect(v.get(r) ?? 0, r).toBeGreaterThanOrEqual(4);
    expect(v.get("KASZ") ?? 0).toBeGreaterThanOrEqual(1);
  });

  it("€ steht nur in Zeilen über das Ausland oder über das Zeichen selbst - nie mit einem Ort in Polen", () => {
    const euro = ZEILEN.filter((z) => z.includes("€"));
    expect(euro.length).toBeGreaterThanOrEqual(8);
    const polnischerOrt = (z: string) => [...raeumeIn(z)].some((r) => r !== "AUSLAND" && r !== "REGION");
    expect(euro.filter(polnischerOrt)).toEqual([]);
  });

  it("Gegenprobe: unbekannte Grosswörter, Bindestrich-Orte, Anführung und Satzanfänge werden richtig gelesen", () => {
    expect(unbekannteGrosswoerter("Ola jedzie do Atlantydy.")).toEqual(["Atlantydy"]);
    expect(unbekannteGrosswoerter("Bielsko-Biała to miasto.")).toEqual([]);
    expect(unbekannteGrosswoerter("Bielsko-Atlantyda to miasto.")).toEqual(["Atlantyda"]);
    expect(unbekannteGrosswoerter('"Hej!" woła Ola.')).toEqual([]);
    expect(unbekannteGrosswoerter("Pada? Jutro nie.")).toEqual([]);
    expect(unbekannteGrosswoerter("Pada i Jutro nie.")).toEqual(["Jutro"]);
    expect(raeumeIn("Do Jeleniej Góry jedziemy 4 godziny.")).toEqual(new Set(["DSL"]));
    expect(verteilung(Array.from({ length: 15 }, (_, i) => `W Zakopanem ${"abcdefghijklmno"[i]}.`)).get("PODH")).toBe(15);
    expect(["Na Słowacji płacimy w €."].filter((z) => [...raeumeIn(z)].some((r) => r !== "AUSLAND"))).toEqual([]);
    expect(["W Gdańsku lody kosztują 2 €."].filter((z) => [...raeumeIn(z)].some((r) => r !== "AUSLAND"))).toHaveLength(1);
  });
});

// ── Gekürzt serviert: kein grosses Wort mitten im Satz ─────────────────────

/**
 * Für Weg „pl" gibt es keine Frühfassungen (`scripts/_fruehfassung.mts` liest nur de/en/fr/es). Wird eine Zeile vor
 * ihrer vollen Sprosse gekürzt serviert, fällt mit `? ! " :` auch die Satzgrenze weg - ein Wort, das danach gross
 * steht, stünde mitten im Satz. Darum steht dort nur ein Name oder Ort.
 */
function fruehNahtFehler(zeile: string): string[] {
  const b = ersteSprosse(zeile);
  const v = volleSprosse(zeile);
  if (b === null || v === null) return [];
  const out = new Set<string>();
  for (let n = b; n < v; n++) {
    const s = fitText(zeile, allowedAt(n), "pl");
    if (s !== null) for (const w of unbekannteGrosswoerter(s)) out.add(`${n}:${w}`);
  }
  return [...out];
}

describe("PL-T7: gekürzt serviert - kein Grossbuchstabe mitten im Satz", () => {
  it("jede Zeile, die vor ihrer Sprosse gekürzt kommt, liest sich ohne Grosswort mitten im Satz", () => {
    const fehler = ZEILEN.flatMap((z) => fruehNahtFehler(z).map((f) => `"${z}" @ ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „Mama woła: \"Kolacja!\"“ würde vor „:“ zu „Mama woła Kolacja“", () => {
    expect(fruehNahtFehler('Mama woła: "Kolacja!"').length).toBeGreaterThan(0);
    expect(fruehNahtFehler("Kto idzie? Bartek i Hania.")).toEqual([]);
    expect(fitText("Czy w Łebie są prawdziwe wydmy?", allowedAt(sprosseVon("q")), "pl")).toBe("Czy w Łebie są prawdziwe wydmy");
  });
});

// ── Wortschatz: Wortgrenze 8 über T1 + T4 + T7, Sperrliste, Wortbasis, Ogonek-Zwillinge ──

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht (Liste aus PL-T4). */
const FUNKTIONSWOERTER = new Set(
  (
    "a i w we z ze na do od o po za nad pod przed dla jak to ten ta te tak nie się mi mnie ja ty on ona ono my wy " +
    "oni one jest są ma mam masz mamy czy co oraz lub ale no był była było byli były że już też go jej jego ich mu ją " +
    "bo u przy przez bez nam nas mu"
  ).split(" "),
);
/** Inhaltswörter einer Zeile, klein, nur Buchstabenfolgen (Ziffern und Zeichen fallen weg). */
const inhaltswoerter = (z: string): Set<string> =>
  new Set((z.toLowerCase().match(/\p{L}+/gu) ?? []).filter((w) => !FUNKTIONSWOERTER.has(w)));

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) for (const w of inhaltswoerter(z)) n.set(w, (n.get(w) ?? 0) + 1);
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** Der Wortschatz VOR dieser Charge (Übungswörter, Stufen-Wortschatz, Lexikon-Nachtrag aus Tatoeba ≥ 2 Belegen). */
const BASIS: ReadonlySet<string> = new Set([
  ...WORDS_PL,
  ...Object.values(STUFE_VOCAB_PL).flat(),
  ...NACHTRAG_PL,
  ...NACHTRAG_PL_ERGAENZT,
]);

/**
 * Wörter dieser Charge, die NICHT im Wortschatz standen und weder Ort noch Name sind (Tatoeba hat sie seltener als
 * zweimal; ein Wörterbuch-Beleg fehlt für Polnisch, Falle 61). Jede ist eine gewöhnliche Form eines Standardworts;
 * die Begründung steht daneben. Über den Korpus kommen sie ins Vorlese-Lexikon.
 * ⚠️ Von keiner Person mit Polnisch als Erstsprache gelesen (Befund §4).
 */
const VON_HAND_BELEGT: Readonly<Record<string, string>> = {
  akcję: "Akk. Sg. von akcja (Aktion der Bibliothek)",
  aktywność: "Akk. Sg. von aktywność (za aktywność - Plus im Unterricht)",
  albumie: "Lok. Sg. von album (Sammelalbum)",
  ampersand: "Name des Zeichens &, Nom. Sg. (Lehnwort, in pl. Lehrbüchern der Informatik)",
  babeczek: "Gen. Pl. von babeczka (Muffin; 15 babeczek)",
  babka: "Nom. Sg. (babka ziemniaczana, Kartoffelauflauf aus Podlasie)",
  bachusiki: "Nom. Pl. von bachusik (Bronzefiguren in Zielona Góra)",
  backslash: "englischer Name des Zeichens \\, als Wort über die Sprache",
  biedronek: "Gen. Pl. von biedronka",
  bohaterowie: "Nom. Pl. von bohater",
  boków: "Gen. Pl. von bok (6 boków)",
  borowiki: "Akk. Pl. von borowik (Steinpilz)",
  brakującą: "Akk. Sg. f. Part. von brakować (brakującą literę)",
  bułek: "Gen. Pl. von bułka",
  buźka: "Nom. Sg. (Smiley)",
  chat: "Gen. Pl. von chata (malowane chaty in Zalipie)",
  chomiki: "Nom. Pl. von chomik",
  chór: "Nom. Sg.",
  ciociu: "Vokativ von ciocia",
  czeska: "Adjektiv f. (granica polsko-czeska)",
  daszek: "Nom. Sg. (Name des Zeichens ^)",
  doba: "Nom. Sg. (24 Stunden)",
  doniczek: "Gen. Pl. von doniczka",
  doniczkowych: "Adjektiv Gen. Pl. (rośliny doniczkowe)",
  dopiski: "Nom. Pl. von dopisek",
  duet: "Nom. Sg.",
  dyktandzie: "Lok. Sg. von dyktando (Rechtschreibdiktat)",
  dynie: "Nom. Pl. von dynia",
  dziurką: "Instr. Sg. von dziurka (kluski z dziurką)",
  dzióbek: "Nom. Sg. (Schnäbelchen, Merkhilfe für < >)",
  dzięcioł: "Nom. Sg. (Specht)",
  dzwonimy: "1. Pl. von dzwonić",
  elementy: "Akk. Pl. von element",
  fan: "Nom. Sg.",
  figurki: "Nom. Pl. von figurka",
  foldery: "Akk. Pl. von folder",
  fontannę: "Akk. Sg. von fontanna (fontanna Neptuna)",
  gospodyni: "Gen. Sg. von gospodyni (Bäuerin auf dem Markt)",
  grzbietem: "Instr. Sg. von grzbiet (Bergkamm)",
  gwiazdka: "Nom. Sg. (Name des Zeichens *)",
  gwiazdki: "Nom. Pl. von gwiazdka",
  gwiazdką: "Instr. Sg. von gwiazdka",
  gżegżółka: "Nom. Sg. (altes Wort für kukułka)",
  hali: "Lok. Sg. von hala (Sporthalle; Zwilling hala = Alm nicht betroffen)",
  hasztag: "Nom. Sg. (polnische Schreibung von hashtag, RJP)",
  informatyce: "Lok. Sg. von informatyka (Schulfach)",
  jagodami: "Instr. Pl. von jagoda",
  kalkulatorze: "Lok. Sg. von kalkulator",
  kapciami: "Instr. Pl. von kapeć (worek z kapciami)",
  katarzynki: "Nom. Pl. von katarzynka (Toruner Pfefferkuchen)",
  kieszonkowe: "Akk. Sg. n. (Taschengeld, substantiviertes Adjektiv)",
  kiszona: "Adjektiv f. (kiszona kapusta)",
  klamrach: "Lok. Pl. von klamra (geschweifte Klammer)",
  klamrowe: "Adjektiv Pl. (nawiasy klamrowe)",
  klamry: "Nom. Pl. von klamra",
  klasowej: "Adjektiv Gen. Sg. f. (wycieczka klasowa)",
  klawiszu: "Lok. Sg. von klawisz",
  kocięta: "Nom./Akk. Pl. von kocię",
  kodzie: "Lok. Sg. von kod",
  koleżanek: "Gen. Pl. von koleżanka",
  koloniach: "Lok. Pl. von kolonie (Ferienlager)",
  kolonie: "Akk. Pl. (Ferienlager, pluralia tantum)",
  konduktorka: "Nom. Sg. (Zugbegleiterin)",
  koronach: "Lok. Pl. von korona (Währung Tschechiens)",
  koszulce: "Lok. Sg. von koszulka",
  krasnale: "Nom. Pl. von krasnal (Wrocławer Zwerge)",
  krasnali: "Gen. Pl. von krasnal",
  kratce: "Lok. Sg. von kratka (Braillezelle; Kästchen)",
  kreska: "Nom. Sg.",
  kreski: "Nom. Pl. von kreska",
  kreskę: "Akk. Sg. von kreska (der Akut auf ć ń ó ś ź)",
  krzyczą: "3. Pl. von krzyczeć",
  krzyżak: "Nom. Sg. (Kreuzspinne)",
  krzyżyk: "Nom. Sg. (Name des Zeichens #; Kreuz in kółko i krzyżyk; Kreuz in Noten)",
  kukułka: "Nom. Sg.",
  kuligu: "Lok. Sg. von kulig (Schlittenfahrt)",
  kundelek: "Nom. Sg. (Mischlingshund)",
  kurtek: "Gen. Pl. von kurtka",
  kwadratowe: "Adjektiv Pl. (nawiasy kwadratowe)",
  liczbowej: "Adjektiv Lok. Sg. f. (oś liczbowa)",
  malowanych: "Part. Gen. Pl. von malować",
  maluchów: "Gen. Pl. von maluch",
  mazania: "Gen. Sg. von mazanie (gumka do mazania)",
  małpie: "Lok. Sg. von małpa (Name des Zeichens @)",
  minucie: "Lok. Sg. von minuta",
  mniejszą: "Akk. Sg. f. von mniejszy",
  mroźno: "Adverb (bywa mroźno)",
  muszelek: "Gen. Pl. von muszelka",
  najzimniejsze: "Superlativ n. von zimny",
  naklejek: "Gen. Pl. von naklejka",
  naliczyła: "3. Sg. f. Präteritum von naliczyć (Wiktoria)",
  nawiasie: "Lok. Sg. von nawias",
  nutach: "Lok. Pl. von nuta",
  odlatują: "3. Pl. von odlatywać",
  ogonek: "Nom. Sg.",
  ogonkami: "Instr. Pl. von ogonek (die Häkchen an ą ę)",
  ogłasza: "3. Sg. von ogłaszać",
  okrążenia: "Nom. Pl. von okrążenie (Runde)",
  oscypki: "Akk. Pl. von oscypek",
  owczarek: "Nom. Sg. (Schäferhund)",
  oznaczamy: "1. Pl. von oznaczać",
  papierowa: "Adjektiv f. (papierowa torebka)",
  pasma: "Akk. Pl. von pasmo (pasma gór)",
  peronie: "Lok. Sg. von peron",
  perła: "Nom. Sg.",
  pierników: "Gen. Pl. von piernik",
  pionowa: "Adjektiv f. (kreska pionowa)",
  pismem: "Instr. Sg. von pismo (pismem Braille'a)",
  piłkarzami: "Instr. Pl. von piłkarz",
  plansza: "Nom. Sg. (Spielbrett)",
  planszowej: "Adjektiv Lok. Sg. f. (gra planszowa)",
  plastra: "Gen. Sg. von plaster (plaster miodu)",
  plusem: "Instr. Sg. von plus",
  pobawimy: "1. Pl. Futur von pobawić się",
  pobudka: "Nom. Sg. (Wecken im Ferienlager)",
  pochyla: "3. Sg. von pochylać się",
  podkreślnik: "Nom. Sg. (Name des Zeichens _)",
  podpisują: "3. Pl. von podpisywać",
  podwyższa: "3. Sg. von podwyższać",
  polsko: "Vorderglied in Zusammensetzungen (polsko-niemiecki, polsko-czeska)",
  porównujemy: "1. Pl. von porównywać",
  potocznie: "Adverb (umgangssprachlich; Wörterbuchkürzel pot.)",
  poziome: "Adjektiv Pl. (poziome kreski)",
  prababcia: "Nom. Sg. (Urgrossmutter)",
  programowaniu: "Lok. Sg. von programowanie",
  przejeżdża: "3. Sg. von przejeżdżać",
  przepływamy: "1. Pl. von przepływać",
  przesypia: "3. Sg. von przesypiać",
  przypis: "Nom. Sg. (Fussnote)",
  przysyła: "3. Sg. von przysyłać",
  puszysty: "Adjektiv m.",
  pyry: "Akk. Pl. von pyra (Posener Wort für Kartoffel)",
  pędzi: "3. Sg. von pędzić",
  quizie: "Lok. Sg. von quiz",
  quizu: "Gen. Sg. von quiz",
  ratusza: "Gen. Sg. von ratusz",
  remisują: "3. Pl. von remisować (unentschieden spielen)",
  robotyki: "Gen. Sg. von robotyka",
  roladą: "Instr. Sg. von rolada (śląska rolada)",
  rozbijają: "3. Pl. von rozbijać (namioty)",
  ruchome: "Adjektiv Pl. (ruchome wydmy)",
  rudy: "Adjektiv m. (rotes Fell)",
  ruskie: "Adjektiv Pl. (pierogi ruskie, Name des Gerichts)",
  ręcznej: "Adjektiv Gen. Sg. f. (piłka ręczna)",
  samogłosek: "Gen. Pl. von samogłoska",
  schowana: "Part. f. von schować",
  seans: "Nom. Sg. (Kinovorstellung)",
  sery: "Akk. Pl. von ser",
  siatkarek: "Gen. Pl. von siatkarka",
  siatkarki: "Nom. Pl. von siatkarka",
  sklepiku: "Lok. Sg. von sklepik",
  smokach: "Lok. Pl. von smok",
  spacji: "Gen. Sg. von spacja (Leertaste, Leerzeichen)",
  stawiamy: "1. Pl. von stawiać",
  studniach: "Lok. Pl. von studnia",
  stuka: "3. Sg. von stukać",
  szatni: "Lok. Sg. von szatnia",
  szałas: "Akk. Sg. (Hütte aus Ästen)",
  szyldzie: "Lok. Sg. von szyld (Ladenschild)",
  tablecie: "Lok. Sg. von tablet",
  tabliczka: "Nom. Sg. (tabliczka mnożenia, Einmaleins)",
  taneczny: "Adjektiv m. (duet taneczny)",
  tartych: "Part. Gen. Pl. von trzeć (tarte ziemniaki)",
  trójkąt: "Nom. Sg.",
  tytka: "Nom. Sg. (Posener und schlesisches Wort für Papiertüte)",
  ukośnik: "Nom. Sg. (Schrägstrich)",
  ukośnikiem: "Instr. Sg. von ukośnik",
  uli: "Gen. Pl. von ul (Bienenstock)",
  ułamek: "Nom. Sg. (Bruch)",
  wagonów: "Gen. Pl. von wagon",
  wcina: "3. Sg. von wcinać się (ins Meer hineinragen)",
  wciskamy: "1. Pl. von wciskać",
  wpisuje: "3. Sg. von wpisywać",
  wpisujemy: "1. Pl. von wpisywać",
  wsteczny: "Adjektiv m. (ukośnik wsteczny)",
  wstecznym: "Adjektiv Instr. Sg. m.",
  wwozi: "3. Sg. von wwozić (Bergbahn)",
  wychowawczyni: "Nom. Sg. (Klassenlehrerin)",
  wydmy: "Nom. Pl. von wydma",
  wysyłamy: "1. Pl. von wysyłać",
  wędrują: "3. Pl. von wędrować",
  wędzone: "Adjektiv Pl. (wędzone sery)",
  zakrywają: "3. Pl. von zakrywać",
  zapisuje: "3. Sg. von zapisywać",
  zapisujemy: "1. Pl. von zapisywać",
  zawijas: "Nom. Sg. (Schnörkel)",
  zbijaka: "Akk. Sg. von zbijak (Völkerball; belebt: grać w zbijaka)",
  zbudujemy: "1. Pl. Futur von zbudować",
  zerówce: "Lok. Sg. von zerówka (Vorschuljahr)",
  ziemniaczana: "Adjektiv f. (babka ziemniaczana)",
  ziołami: "Instr. Pl. von zioło",
  zwiedzamy: "1. Pl. von zwiedzać",
  zł: "Abkürzung von złoty/złotych (Währung)",
  ćwierć: "Nom. Sg. (Viertel)",
  ładuje: "3. Sg. von ładować się",
  łatką: "Instr. Sg. von łatka (Fleck im Fell)",
  ławek: "Gen. Pl. von ławka",
  łąką: "Instr. Sg. von łąka",
  ściankę: "Akk. Sg. von ścianka (Kletterwand)",
  ścieżce: "Lok. Sg. von ścieżka",
  żurawie: "Nom. Pl. von żuraw (Kranich)",
  żurawiną: "Instr. Sg. von żurawina (Preiselbeere)",
};

/** Die Wörter einer Zeile für Sperrliste, Wortbasis und Stimme (ohne technische Wörter, Bindestrich-Teile einzeln). */
const pruefWoerter = (zeile: string): string[] => woerterMitAnfang(zeile).map((x) => x.w);

const bekannt = (w: string): boolean => BASIS.has(w) || w in VON_HAND_BELEGT || w in ORTE || NAMEN.has(w) || NAMENSTEILE.has(w);

function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) for (const w of pruefWoerter(z)) if (w.length >= 2 && !bekannt(w.toLowerCase())) out.add(w.toLowerCase());
  return [...out];
}

/** „Ogonek-Zwillinge" (PL-T1 §4): Formen ohne Ogonek, deren Form MIT Ogonek ebenfalls ein Wort ist (ze/że, sadzi/sądzi). */
const ZWILLINGE: ReadonlyMap<string, string[]> = (() => {
  const m = new Map<string, string[]>();
  for (const v of BASIS) {
    if (!/[ąćęłńóśźż]/.test(v)) continue;
    const k = ohneOgonki(v);
    if (k !== v) m.set(k, [...(m.get(k) ?? []), v]);
  }
  return m;
})();
const mitZwilling = (zeile: string): boolean => woerterKlein(zeile).some((w) => ZWILLINGE.has(w));

/** Jede Zeile mit einem Ogonek-Zwilling ist GELESEN (Befund §4): in allen ist die geschriebene Form gemeint. */
const ZEILEN_MIT_ZWILLING_GELESEN: ReadonlySet<string> = new Set([
  "Dokąd w tym roku pojedzie nasza klasa na zieloną szkołę?",
  "Pójdziesz ze mną do biblioteki?",
  "Zagrasz ze mną w chińczyka?",
  "Kto chce zagrać w zbijaka na przerwie?",
  "Kto pójdzie ze mną popatrzeć na kaczki nad Brdą?",
  "Uwaga, schody są śliskie!",
  "Uwaga, na ścieżce siedzi żaba!",
  "Ale zabawa na kuligu w Szklarskiej Porębie!",
  "Brawo, cała klasa zdobyła kartę rowerową!",
  "Flaga Polski jest biało-czerwona.",
  "Kot Bruno - czarny i puszysty - drzemie na parapecie.",
  "Bug - rzeka na granicy z Ukrainą i Białorusią - wpada do Narwi.",
  "Babcia Halina robi pierogi ruskie - najlepsze na świecie!",
  "Pies sąsiadów - wesoły kundelek - zawsze macha ogonem.",
  "Kraków, Wieliczka, Zakopane - to trasa naszej wycieczki klasowej.",
  "Kiszona kapusta i barszcz czerwony - tak smakuje jesień u dziadków.",
  "Gorzów Wielkopolski i Zielona Góra - to dwa największe miasta Ziemi Lubuskiej.",
  "Granica polsko-czeska biegnie grzbietem Karkonoszy.",
  "W Poznaniu papierowa torebka to \"tytka\".",
  "\"Sto lat!\" śpiewa cała klasa dla Wiktorii.",
  "\"Uwaga, pociąg odjeżdża!\" słychać na peronie w Kutnie.",
  "Uwaga: w czwartek wycieczka do Sandomierza.",
  "Mieszkańcy naszej klasy: dwa chomiki i jedna rybka.",
  "Trzy wielkie rzeki Polski: Wisła, Odra i Warta.",
  "Śniadanie Antosi: bułka z masłem, jajko i herbata z cytryną.",
  "Pora na zagadkę: co ma zęby, a nie gryzie?",
  "Moja siostra Ala (najmłodsza w rodzinie) uczy się czytać.",
  "Klasa 1c ma dziś wycieczkę do zoo w Płocku.",
  "Na Długiej 1 w Gdańsku mieszka nasza ciocia.",
  "Babcia spod Łowicza ma 2 kozy i 12 kur.",
  "W piątek wracamy ze szkoły o 13.",
  "Ciocia z Płocka przysyła nam 3 kartki w roku.",
  "Wujek z Przemyśla ma w sadzie 23 jabłonie.",
  "Rodzina Oskara ma 4 rowery i hulajnogę.",
  "Lekcja w szkole trwa 45 minut.",
  "Ciocia z Łańcuta przejeżdża na rolkach 15 kilometrów.",
  "Maja ma w klasie 26 kolegów i koleżanek.",
  "Kasia ma urodziny 9 maja.",
  "Lekcje zaczynają się o 8:00.",
  "Godzina ma 60 minut.",
  "Ta gorzka czekolada ma 70% kakao.",
  "Aż 80% naszej klasy chce jechać nad morze.",
  "Gra ładuje się: 99%.",
  "Na koszulce Tymka jest napis \"ja & mój pies\".",
  "Babcia i dziadek podpisują kartkę: Halina & Józef.",
  "Za aktywność na lekcji Leon dostaje +.",
  "Na tablicy nauczycielka pisze 5 + 3 = 8.",
  "Waga stoi równo, gdy lewa strona = prawa strona.",
  "W grze planszowej każdy dostaje na start 500 $.",
  "W Ameryce cena 2 $ to dwa dolary.",
  "Dolar ($) to waluta Stanów Zjednoczonych.",
  "Plan na środę: szkoła | basen | zadanie domowe.",
  "Kreskę | daje Shift razem z ukośnikiem wstecznym.",
  "W małpie @ jest schowana mała litera a.",
  "Zadanie wysyłamy na adres polski@szkola.example.",
  "Ciocia zapisuje adres Tosi: tosia@poczta.example.",
  "Wujek z Chicago pisze do nas na adres rodzina@poczta.example.",
  "Biblioteka w Kaliszu ogłasza akcję #czytamyrazem.",
  "W programowaniu 3^2 daje 9.",
  "Wynik zadania z Kangura wpisujemy w kratkę [ ].",
  "Euro (€) to waluta wielu krajów Europy.",
]);

describe("PL-T7: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("auch über alle drei Kinder-Chargen (PL-T1 + PL-T4 + PL-T7) zusammen nicht (Falle 45)", () => {
    const fehler = zuHaeufig([...T1, ...T4, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (gross, mit Satzzeichen, nach Ziffer), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Kot" : "Ten 9 kot"} ${"abcdefghi"[i]}? Już.`);
    expect(zuHaeufig(neun)).toEqual(['"kot": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis", () => {
    const fehler = ZEILEN.flatMap((t) => pruefWoerter(t).filter((w) => gesperrtPl(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurwa (Kern), gruba, leniwy und kartacze (Wortbasis) werden gefunden, babka und kluski nicht", () => {
    expect(istKernGesperrtPl("kurwa")).toBe(true);
    expect(gesperrtPl("gruba")).toBe(true); // darum „Książka o smokach ma 237 stron.", nicht „Ta gruba książka …"
    expect(gesperrtPl("leniwy")).toBe(true); // darum „Kot Filemon (rudy, z białą łatką)"
    expect(gesperrtPl("Kartacze")).toBe(true); // darum die babka ziemniaczana als Podlasie-Gericht
    expect(gesperrtPl("babka")).toBe(false);
    expect(gesperrtPl("kluski")).toBe(false);
  });

  it("jedes Wort stand im Wortschatz oder ist Ort, Name oder von Hand belegt - und die Listen tragen nur Benutztes", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    const benutzt = new Set(ZEILEN.flatMap(woerterKlein));
    expect(Object.keys(VON_HAND_BELEGT).filter((w) => !benutzt.has(w) || BASIS.has(w))).toEqual([]);
    expect(Object.keys(ORTE).filter((w) => !benutzt.has(w))).toEqual([]);
    expect([...NAMEN, ...NAMENSTEILE].filter((w) => !benutzt.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und eine Form ohne Ogonek, die es so nicht gibt, werden gemeldet - eine Adresse nicht", () => {
    expect(ungeprueft(["Ola ma psax?", "Bartek dziekuje mamie!", "Pisz na ola@szkola.example."])).toEqual(["psax", "dziekuje"]);
  });

  /**
   * Die Stimme liest Leerzeichen-Wörter: „Bielsko-Biała" ist EIN Wort (das Fach `pl` streicht den Bindestrich,
   * `normalizeWord`), seine Teile einzeln sind es nicht. Technische Wörter (Adressen, Pfade, Rechnungen) liest sie als Zeichen.
   */
  const stimmWoerter = (zeile: string): string[] =>
    zeile
      .split(/\s+/)
      .map((roh) => roh.replace(/^["(]+|[.,!?:")]+$/g, ""))
      .filter((w) => w.length >= 2 && !TECHNISCH.test(w));

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58: Anteil buchstabierter Zeilen = 0)", () => {
    const buchstabiert = ZEILEN.filter((z) => stimmWoerter(z).some((w) => !isRealWord(w, "pl")));
    expect(buchstabiert).toEqual([]);
    expect(stimmWoerter('Granica polsko-czeska, "Lokomotywa" i 2:1.')).toEqual(["Granica", "polsko-czeska", "Lokomotywa"]);
  });

  it("jede Zeile mit einem Ogonek-Zwilling ist gelesen - und nur diese", () => {
    const mit = ZEILEN.filter(mitZwilling);
    expect(mit.filter((z) => !ZEILEN_MIT_ZWILLING_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_ZWILLING_GELESEN].filter((z) => !mit.includes(z))).toEqual([]);
  });

  it("Gegenprobe: „Ide z mama?“ (statt Idę z mamą) hat Zwillinge, „Ola ma psa!“ nicht", () => {
    expect(mitZwilling("Ide z mama?")).toBe(true);
    expect(mitZwilling("Ola ma psa!")).toBe(false);
  });
});

// ── Keine Kopien, keine Paare, nichts fast gleich ───────────────────────────

/** Geschlecht und Zahl grob gleichgesetzt: „on/ona", Endvokal weg (Muster PL-T6). */
function paarForm(zeile: string): string {
  const pron: Record<string, string> = { on: "PRO", ona: "PRO", ono: "PRO", oni: "PRO", one: "PRO" };
  return (zeile.toLowerCase().match(/[\p{L}\d]+/gu) ?? []).map((w) => pron[w] ?? w.replace(/[aeiouyąę]?$/, "_")).join(" ");
}

function paare(zeilen: string[], gegen: string[] = []): string[] {
  const fremd = new Map<string, string>();
  for (const z of gegen) if (!fremd.has(paarForm(z))) fremd.set(paarForm(z), z);
  const gesehen = new Map<string, string>();
  const out: string[] = [];
  for (const z of zeilen) {
    const f = paarForm(z);
    const frueher = gesehen.get(f) ?? fremd.get(f);
    if (frueher !== undefined) out.push(`"${frueher}" / "${z}"`);
    else gesehen.set(f, z);
  }
  return out;
}

const ohneSatzzeichen = (t: string): string => t.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();

/** Zeilen, die einer Vergleichszeile gleichen - als Text (ohne Satzzeichen, klein) oder als Ledger-Schlüssel. */
function kopienGegen(zeilen: string[], gegen: string[]): string[] {
  const texte = new Set(gegen.map(ohneSatzzeichen));
  const schluessel = new Set(gegen.map((t) => bausteinKey("satz", t)));
  return zeilen.filter((t) => texte.has(ohneSatzzeichen(t)) || schluessel.has(bausteinKey("satz", t)));
}

const FREMDE_KORPORA = () => [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_TR, ...CORPUS_CS];

/** Die Texte der Tippchallenge-Banken aller Wege (Sfida, Reto, Défi …): jede Datei `schreibproben/texte*.ts`. */
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
/** Alles, was sonst Text trägt: alle Korpora, alle Serien, alle Prüfungstext-Banken - Zeile für Zeile und Satz für Satz. */
function alleFremdenZeilen(): string[] {
  const roh = [...FREMDE_KORPORA().map((i) => i.text), ...SERIEN.flatMap((s) => s.etappen.flatMap((e) => e.lines)), ...bankZeilen()];
  return [...new Set(roh.flatMap((z) => [z, ...z.split(/(?<=[.!?])\s+/u)]))];
}

const wortMenge = (t: string): Set<string> => new Set(ohneSatzzeichen(t).split(" ").filter(Boolean));
function jaccard(a: Set<string>, b: Set<string>): number {
  let s = 0;
  for (const x of a) if (b.has(x)) s++;
  return s / (a.size + b.size - s);
}
/** „Fast gleich" (Falle 31/51, Muster PL-T6): gegen die eigene Charge und jede pl-Zeile ab 0,5, gegen alles andere ab 0,6. */
function fastGleich(zeilen: string[], gegen: string[], grenze: number): string[] {
  const out: string[] = [];
  const mengen = gegen.map((g) => [g, wortMenge(g)] as const);
  for (const z of zeilen) {
    const a = wortMenge(z);
    for (const [g, b] of mengen) if (g !== z && jaccard(a, b) >= grenze) out.push(`"${z}" ~ "${g}"`);
  }
  return out;
}

describe("PL-T7: keine Kopien, keine Paare, nichts fast gleich", () => {
  it("keine Zeile doppelt - auch nicht ohne Satzzeichen oder nach dem Ledger-Schlüssel (Zeichen und ą ę … sind dort Trenner)", () => {
    expect(new Set(ZEILEN.map(ohneSatzzeichen)).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("die Vergleichsmengen sind voll: T1-T6 in der rohen Sammelliste, tr/cs-Korpus, Serien und Banken", () => {
    expect(ANDERE_PL_ZEILEN.length).toBeGreaterThanOrEqual(164 + 151 + 167 + 326 + 326 + 330);
    expect(ANDERE_PL().filter((i) => CORPUS_PL_WEG_MITTE_ERWACHSENE.includes(i)).length).toBe(CORPUS_PL_WEG_MITTE_ERWACHSENE.length);
    expect(CORPUS_TR.length).toBeGreaterThan(0);
    expect(CORPUS_CS.length).toBeGreaterThan(0);
    expect(SERIEN.length).toBeGreaterThan(100);
    expect(bankZeilen().length).toBeGreaterThan(1000);
  });

  it("keine Zeile gleicht einer pl-Zeile, einer Zeile der Wege de/en/fr/es/it/tr/cs, einer Serie oder einer Bank", () => {
    expect(kopienGegen(ZEILEN, ANDERE_PL_ZEILEN)).toEqual([]);
    expect(kopienGegen(ZEILEN, alleFremdenZeilen())).toEqual([]);
  });

  it("keine Paare (nur Geschlecht oder Zahl getauscht) - weder untereinander noch mit einer anderen pl-Charge (Falle 31)", () => {
    const fehler = paare(ZEILEN, ANDERE_PL_ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("nichts fast gleich: gegen die eigene Charge und jede pl-Zeile (Jaccard ≥ 0,5), gegen alles andere (≥ 0,6)", () => {
    const fehler = [...fastGleich(ZEILEN, [...ZEILEN, ...ANDERE_PL_ZEILEN], 0.5), ...fastGleich(ZEILEN, alleFremdenZeilen(), 0.6)];
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: beim Schreiben verworfene Zeilen wären Kopie, Paar oder fast gleich", () => {
    // Verworfen (Befund §4): „Ile nóg ma pająk?" neben „Pająk ma 8 nóg." · „Na Podhalu ziemniaki to "grule"." (PL-T4/5 hat es)
    expect(fastGleich(["Pająk ma 8 nóg."], ["Ile nóg ma pająk?"], 0.5)).not.toEqual([]);
    expect(fastGleich(['Na Podhalu ziemniaki to "grule".'], ANDERE_PL_ZEILEN, 0.5)).not.toEqual([]);
    expect(fastGleich(["Kuba robi zdjęcia."], ["Ola pisze list."], 0.5)).toEqual([]);
    const t = ANDERE_PL_ZEILEN[20];
    expect(kopienGegen([`${t.replace(/[.!?]$/, "")}?`], ANDERE_PL_ZEILEN)).toHaveLength(1);
    expect(paare(["Kot był w domu.", "Kot była w domu."])).toHaveLength(1);
    expect(bausteinKey("satz", "3 + 4 = 7.")).toBe(bausteinKey("satz", "3 * 4 = 7.")); // Zeichen sind Trenner
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker (keine stille Verschmelzung), und der Zuwachs ist die Zeilenzahl", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_PL()].map((i) => bausteinId(i.kind, i.text)));
    expect(CHARGE.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    const eigeneIds = CHARGE.map((i) => bausteinId(i.kind, i.text));
    expect(new Set(eigeneIds).size).toBe(ZEILEN.length);
    // Anker nur anhängend: die IDs dieser Charge stehen als geschlossener Block im Anker, keine davor
    // (gemessen 09.10.2026 auf 89b17a5f: 16.641 ⇒ 17.024, „383 neu").
    const start = KORPUS_ANKER.indexOf(eigeneIds[0]);
    expect(start).toBeGreaterThanOrEqual(16641);
    expect(KORPUS_ANKER.slice(start, start + ZEILEN.length)).toEqual(eigeneIds);
    const eigen = new Set(eigeneIds);
    expect(KORPUS_ANKER.slice(0, start).filter((id) => eigen.has(id))).toEqual([]);
  });
});

// ── Korpus-Anker und Auslieferung ──────────────────────────────────────────

describe("PL-T7: Korpus-Anker und Auslieferung", () => {
  it("die Sammelliste trägt diese Charge als geschlossenen Block hinter PL-T6 (Anker nur anhängend)", () => {
    const start = PL_ROH.indexOf(CHARGE[0]);
    expect(PL_ROH.slice(start, start + ZEILEN.length)).toEqual(CHARGE);
    const letzteT6 = Math.max(...CORPUS_PL_WEG_MITTE_ERWACHSENE.map((i) => PL_ROH.indexOf(i)));
    expect(start).toBeGreaterThan(letzteT6);
    expect(PL_ROH.slice(0, start).every((i) => !CHARGE.includes(i))).toBe(true);
  });

  it("korpusFuer(\"pl\") trägt jede Zeile dieser Charge (nichts still verschmolzen)", () => {
    const geladen = new Set(korpusFuer("pl").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    expect(CHARGE.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "Zzz probe pl t7?", kind: "satz" as const, stufen: ["kids" as const] };
    const ids = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CORPUS_CS, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("am Ende des Lernwegs bekommen Kinder jede Zeile vollständig - Jugend und Erwachsene keine", () => {
    const alles = allowedAt(ordnung().length);
    const geliefert = new Set(corpusItemsFor({ stufe: "kids", allowed: alles, lang: "pl", lernweg: "pl" }));
    expect(ZEILEN.filter((t) => !geliefert.has(t))).toEqual([]);
    for (const stufe of ["teens", "erwachsen"] as const) {
      const andere = new Set(corpusItemsFor({ stufe, allowed: alles, lang: "pl", lernweg: "pl" }));
      expect(ZEILEN.filter((t) => andere.has(t)), stufe).toEqual([]);
    }
  });

  it("vor ł kommt keine dieser Zeilen; an q kommen sie nur gekürzt (ohne ? ! - \" : ( ), ohne Ziffern und Zeichen)", () => {
    const vorL = allowedAt(sprosseVon("ł") - 1);
    expect(ZEILEN.filter((t) => fitText(t, vorL, "pl") !== null)).toEqual([]);
    const anQ = allowedAt(sprosseVon("q"));
    const geliefert = corpusItemsFor({ stufe: "kids", allowed: anQ, lang: "pl", lernweg: "pl" });
    expect(geliefert.filter((t) => /[^\p{L} .,]/u.test(t))).toEqual([]);
    const gekuerzt = ZEILEN.map((z) => fitText(z, anQ, "pl")).filter((s): s is string => s !== null);
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
