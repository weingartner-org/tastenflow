/**
 * ★★★ Wächter PL-T8 (09.10.2026): die polnischen Jugendtexte am Ende des Lernwegs
 * (`corpusPlWegEndeTeens.ts`, Sprossen 40-77 auf der Tastatur `pl` = `?` bis `€`).
 * Vorbilder: `tastenflow-texte-pl-kids-ende.test.ts` (PL-T7), `tastenflow-texte-pl-teens-mitte.test.ts` (PL-T5)
 * und - nur als Form - `tastenflow-texte-it-teens-ende.test.ts` (IT-T8); Befund `BEFUND-2026-10-09-PL-T8-TEENS-ENDE.md`,
 * Leitfaden Fallen 26/31/37/45/48/51/58/61/67/76.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, an dem `fitText` sie UNGEKÜRZT liefert
 * (`introOrder("pl").slice(0, n)`). `? ! - " : ( )` sind auf Weg „pl" weglassbar - vor ihrer Sprosse
 * kommt die Zeile gekürzt an; darum trägt jede Zeile einen Buchstaben ab `ł`, und keine gekürzte
 * Fassung hat ein grosses Wort mitten im Satz (Weg „pl" hat keine Frühfassungen, `scripts/_fruehfassung.mts`
 * kennt ihn nicht - die gemeinsame Datei bleibt unberührt). Ziffern, `'` und die Zeichen ab `%` sind hart.
 * Jede Regel hat eine Gegenprobe: der Prüfer muss einen gebauten Fehler finden.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, korpusFuer, CORPUS, CORPUS_EN, CORPUS_FR, CORPUS_IT, CORPUS_PL, CORPUS_TR, CORPUS_CS } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_PL_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusPlWegFruehTeens";
import { CORPUS_PL_WEG_MITTE_TEENS } from "../src/lib/typing/corpusPlWegMitteTeens";
import { CORPUS_PL_WEG_ENDE_KIDS } from "../src/lib/typing/corpusPlWegEndeKids";
import { CORPUS_PL_WEG_ENDE_TEENS } from "../src/lib/typing/corpusPlWegEndeTeens";
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

const CHARGE = CORPUS_PL_WEG_ENDE_TEENS;
const ZEILEN = CHARGE.map((i) => i.text);
const EIGENE = new Set(ZEILEN);
/** Die früheren Jugend-Chargen (Wortbudget gilt über alle drei - Falle 45). */
const T2 = CORPUS_PL_WEG_FRUEH_TEENS.map((i) => i.text);
const T5 = CORPUS_PL_WEG_MITTE_TEENS.map((i) => i.text);
/** Die Kinder-Charge derselben Sprossen (PL-T7): keine Kopie, kein Fast-Duplikat (eigene Prüfung unten). */
const T7 = CORPUS_PL_WEG_ENDE_KIDS.map((i) => i.text);
/**
 * Alle anderen pl-Chargen aus der ROHEN Sammelliste `corpusPl.ts` (nach Objekt, Lehre PL-T3): T1-T7 und jede spätere.
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

describe("PL-T8: jede Zeile an ihrer Sprosse (Tastatur pl)", () => {
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
    expect(ersteSprosse("Kiedy w tym roku zaczyna się matura?")!).toBeLessThan(sprosseVon("ł")); // beim Schreiben verworfen
    expect(ersteSprosse("W którym tygodniu zaczyna się matura?")).toBe(sprosseVon("ó"));
    expect(volleEinheit("Kamil (basista) ćwiczy.")).toBe(")");
    expect(volleEinheit("Biografia Steve'a Jobsa.")).toBe("'");
    expect(ersteSprosse("Biografia Steve'a Jobsa.")).toBe(sprosseVon("'")); // der Apostroph ist hart
    expect(volleEinheit("Mam 12 lat.")).toBe("2");
    expect(volleEinheit("Wstaję o 6:47.")).toBe("7");
    expect(volleEinheit("Matura jest o 9:00.")).toBe("0");
    expect(volleEinheit("Średnia 5,25.")).toBe("5");
    expect(volleEinheit("Adres $A$1 w Excelu.")).toBe("$");
    expect(volleEinheit("Plik w C:\\Gry.")).toBe("\\");
    expect(volleEinheit("Zbiór {1, 2}.")).toBe("}");
    expect(volleEinheit("Kosztuje 2 €.")).toBe("€");
    // Vor 42 wird der Bindestrich zur Lücke: „Busko Zdrój" (ein Ort, zwei grosse Wörter - erlaubt).
    expect(fitText("Busko-Zdrój słynie z wód.", allowedAt(sprosseVon("q")), "pl")).toBe("Busko Zdrój słynie z wód.");
  });

  /**
   * GEMESSEN am Ende von PL-T8 (vom Code gezählt, Einheit der vollen Sprosse) - darf künftig nur STEIGEN, nie unter 6.
   * `(`, `[` und `{` haben keine eigenen Zeilen.
   */
  const MINDESTENS_JE_EINHEIT: Record<string, number> = {
    "?": 34, "!": 29, "-": 18, '"': 17, ":": 17, ")": 12, "'": 8,
    "1": 10, "2": 11, "3": 11, "4": 11, "5": 11, "6": 10, "7": 11, "8": 11, "9": 11, "0": 15,
    "%": 8, "&": 7, "/": 8, "+": 7, "*": 7, "=": 7, "_": 7, "<": 7, ">": 7, "$": 7, "|": 7, "\\": 7, "@": 8, "#": 8,
    "^": 7, "]": 7, "}": 7, "€": 8,
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

describe("PL-T8: jede Zeile übt die Einheit ihrer Sprosse (W6, Falle 37)", () => {
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

  it("in echten Runden (Mein Training, Jugend) kommen an der Sprosse von ? Fragen dieser Charge an (Fokus ?)", () => {
    const intro = ordnung().slice(0, sprosseVon("?"));
    const echt = Math.random;
    let s = 4008;
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
        for (const z of adaptiveRound({ introduced: intro, focus: ["?"], stufe: "teens", lang: "pl", lernweg: "pl", count: 12 })) {
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

describe("PL-T8: Klammern und Anführungszeichen nie halb", () => {
  it("jede Zeile schliesst, was sie öffnet", () => {
    const fehler = ZEILEN.flatMap((t) => paarFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: halbe Paare werden gefunden; fitText serviert eine Klammer nie halb", () => {
    expect(paarFehler("Kamil (basista ćwiczy.")).toHaveLength(1);
    expect(paarFehler('Mówi "essa.')).toHaveLength(1);
    expect(paarFehler("Lista [1, 2.")).toHaveLength(1);
    expect(paarFehler('"Dasz radę!" pisze Maja (cicho).')).toEqual([]);
    const nurAuf = new Set([...allowedAt(sprosseVon("(") - 1), "("]);
    expect(fitText("Kamil (basista) ćwiczy.", nurAuf, "pl")).toBeNull();
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
  // Zwei allein stehende Klammern um ein Zeichen sind eine Erwähnung der Tasten („między { a }"), kein Satzzeichen.
  const u = t.replace(/ [[({] \S+ [\])}](?=[\s.,!?]|$)/g, " X");
  if (/ [.,:?!](?=\s|$)/.test(u) || /(?<![[{|]) [)\]}](?!\s)/.test(u)) f.push("Leerzeichen vor Satzzeichen");
  if (/[([{] (?![\]}])/.test(u)) f.push("Leerzeichen nach öffnender Klammer");
  if (/,[^ ]/.test(t.replace(/\d,\d/g, "0"))) f.push("kein Leerzeichen nach Komma (Dezimalkomma 5,25 ausgenommen)");
  if (/\bto:/u.test(t)) f.push("Doppelpunkt nach „to“ (im Polnischen ein Fehler)");
  return f;
}

/** Eine feste Excel-Adresse ($A$1) ist keine Währung - sie fällt vor der Zahlprüfung weg. */
const ohneExcelAdresse = (t: string): string => t.replace(/\$[A-Z]+\$\d+/g, "ADR");

/**
 * Zahlformat (Glossar §1 Nr. 5, §2.10): Dezimalkomma (5,25), kein Tausenderpunkt, vierstellig ohne Trenner (1024),
 * Prozent ohne Leerzeichen (30%), Uhrzeit 19:45 (Minuten zweistellig), Währung NACH der Zahl mit Leerzeichen
 * („24 zł", „6 €", „30 $"), keine Ordnungszahl mit Punkt („3. klasa").
 */
function zahlFehler(roh: string): string[] {
  const t = ohneExcelAdresse(roh);
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

describe("PL-T8: Form und Zahlen", () => {
  it("Satzanfang gross, Satzschluss am Ende, Leerzeichen richtig, nur erlaubte Zeichen", () => {
    const fehler = ZEILEN.flatMap((t) => formFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Zahlen im Landesbrauch: 5,25 · 19:45 · 30% · 24 zł · 6 € · keine Ordnungszahl mit Punkt", () => {
    const fehler = ZEILEN.flatMap((t) => zahlFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(ZEILEN.some((t) => /\d,\d\d?\b/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\bo \d{1,2}:\d\d\b/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\d zł(?!\p{L})/u.test(t))).toBe(true);
  });

  it("jede Zeile besteht die Regeln aller polnischen Zeilen (`helfer/plTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [teens], nurWeg pl, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["teens"]);
      expect(item.nurWeg, item.text).toBe("pl");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });

  it("Gegenprobe: jede Form- und Zahlregel schlägt an - die Excel-Adresse $A$1 nicht", () => {
    for (const t of ["ola idzie.", "Ola idzie", "Ola idzie .", "Ola \u2013 idzie.", "Raz,dwa.", "Kamil ( basista) ćwiczy.", "Tak; nie.", "Polskie góry to: Tatry."]) {
      expect(formFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(formFehler('"Dasz radę!" pisze Maja.')).toEqual([]);
    expect(formFehler("W pliku CSS reguły stylu stoją między { a }.")).toEqual([]);
    for (const t of ["Mam 50 % baterii.", "Kosztuje 2€.", "Kosztuje € 2.", "Kosztuje $5.", "Waży 1.5 kilo.", "Jest 12345 osób.", "Wstaję o 7:5.", "Chodzę do 3. klasy."]) {
      expect(zahlFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(zahlFehler("O 19:45, za 24 zł, 30% i średnia 5,25, wynik 2:1, 6 €, 30 $.")).toEqual([]);
    expect(zahlFehler("W Excelu adres $A$1 nie zmienia się.")).toEqual([]);
  });
});

// ── Geschlecht: Vergangenheit nur über benannte Personen ─────────────────────

const ENDUNG_ICH_DU = /(łem|łam|łeś|łaś|liśmy|łyśmy|liście|łyście)$/u;
/** Nomen mit derselben Endung (kein Verb): zespołem (Instr. von zespół), liście (Lok. von lista). Wächst nur mit gelesenen Formen. */
const NOMEN_AUF_LEM = new Set<string>(["zespołem", "liście"]);
const JESTEM = new Set(["jestem", "jesteś", "jesteśmy", "jesteście"]);
function legtLesendeFest(zeile: string): boolean {
  const w = zeile.toLowerCase().match(/\p{L}+/gu) ?? [];
  if (w.some((x) => ENDUNG_ICH_DU.test(x) && !NOMEN_AUF_LEM.has(x))) return true;
  return w.some((x, i) => JESTEM.has(x) && /(y|a|i|e)$/u.test(w[i + 1] ?? "") && w[i + 1] !== "w" && w[i + 1] !== "na");
}

describe("PL-T8: keine Zeile legt das Geschlecht der lesenden Person fest", () => {
  it("keine 1./2. Person der Vergangenheit, kein „jestem/jesteś“ + Adjektiv", () => {
    expect(ZEILEN.filter(legtLesendeFest)).toEqual([]);
  });

  it("Gegenprobe: „Zdałam maturę!“, „Wygraliśmy 3:2!“, „Jestem gotowy?“ werden gefunden, „Borys zdał …“ nicht", () => {
    for (const t of ["Zdałam maturę!", "Wygraliśmy 3:2!", "Jestem gotowy?", "Dostałeś 5+?", "Byłem w Gdyni."]) expect(legtLesendeFest(t), t).toBe(true);
    expect(legtLesendeFest("Borys zdał prawo jazdy na skuter za pierwszym razem!")).toBe(false);
    expect(legtLesendeFest("Kamil (basista) ćwiczy z zespołem w garażu wujka.")).toBe(false);
    expect(legtLesendeFest("Na liście zadań Amelia zaznacza zrobione jako [x].")).toBe(false);
  });
});

// ── Orte, Namen und Grosswörter ─────────────────────────────────────────────

type Raum =
  | "MAL" | "PODH" | "MAZ" | "WM" | "POM" | "KASZ" | "ZPOM" | "PDL" | "KUJ" | "WLK" | "LUB" | "PKR" | "SLA" | "DSL" | "OPO"
  | "SWI" | "LOD" | "LUBU" | "REGION" | "AUSLAND";

/**
 * Orte, Landschaften, Berge, Gewässer, Hallen (die Wortform, klein) mit ihrem Raum. MAL Małopolska ohne Podhale · PODH
 * Podhale, Tatry und Pieniny · KASZ Kaszuby · ZPOM Zachodniopomorskie · REGION über mehrere Räume (Wisła) · AUSLAND.
 * Kleine Adjektive zählen (`poznańskiej`, `śląskim`). „Świętokrzyskiej" ist hier die Metrostation in Warschau und steht
 * darum bei den Namensteilen, nicht bei SWI.
 */
const ORTE: Readonly<Record<string, Raum>> = {
  krakowie: "MAL", krakowa: "MAL", bochni: "MAL", tarnowa: "MAL", krynicy: "MAL",
  pieninach: "PODH", tatry: "PODH", zakopanego: "PODH", białki: "PODH", szczawnicy: "PODH", palenicy: "PODH", morskiego: "PODH",
  warszawie: "MAZ", warszawy: "MAZ", konstancina: "MAZ", siedlcach: "MAZ", płocka: "MAZ", płocku: "MAZ", radomia: "MAZ",
  zegrzyńskiego: "MAZ",
  olsztynie: "WM", elbląga: "WM", ełku: "WM", giżycku: "WM", mazurach: "WM", warmii: "WM", krutyni: "WM", mrągowa: "WM",
  iławie: "WM",
  gdańsku: "POM", gdyni: "POM", gdynia: "POM", sopocie: "POM", sopotu: "POM", jastarnia: "POM", helskim: "POM",
  władysławowie: "POM", pucku: "POM", malborka: "POM", słupsku: "POM", trójmiasta: "POM",
  kaszubach: "KASZ", wdzydze: "KASZ",
  szczecin: "ZPOM", szczecinie: "ZPOM", świnoujścia: "ZPOM", wałczu: "ZPOM", mielnie: "ZPOM", kołobrzeg: "ZPOM",
  międzyzdrojach: "ZPOM",
  białymstoku: "PDL", sejn: "PDL", wigierskiego: "PDL",
  torunia: "KUJ", toruniu: "KUJ", toruń: "KUJ", bydgoszczy: "KUJ", włocławku: "KUJ",
  poznaniu: "WLK", poznańskiej: "WLK", koninie: "WLK", gnieźnie: "WLK", lesznie: "WLK", leszna: "WLK", pile: "WLK",
  jarocinie: "WLK", grodziska: "WLK", kalisza: "WLK", poznania: "WLK",
  lublinie: "LUB", chełmie: "LUB", kazimierza: "LUB", zamościu: "LUB", puław: "LUB",
  rzeszowie: "PKR", krosna: "PKR", sanoku: "PKR", soliną: "PKR",
  katowic: "SLA", katowicach: "SLA", gliwic: "SLA", chorzowie: "SLA", bytomiu: "SLA", tychów: "SLA",
  zabrza: "SLA", rybniku: "SLA", szczyrku: "SLA", wiśle: "SLA", śląskim: "SLA", śląska: "SLA", śląsku: "SLA", spodku: "SLA",
  wrocławia: "DSL", kudowa: "DSL", śnieżniku: "DSL", kłodzku: "DSL",
  opola: "OPO", nysy: "OPO", brzegu: "OPO", kluczborka: "OPO", prudniku: "OPO",
  kielc: "SWI", kielcach: "SWI", kielcami: "SWI", busko: "SWI", ostrowcu: "SWI", skarżyska: "SWI",
  łodzi: "LOD", łowiczu: "LOD", zgierzu: "LOD", bełchatów: "LOD", piotrkowie: "LOD",
  zielonej: "LUBU", gorzowa: "LUBU", gorzowie: "LUBU",
  wisły: "REGION", wisła: "REGION",
  dublinie: "AUSLAND", wilna: "AUSLAND", wilnie: "AUSLAND", berlinie: "AUSLAND", wiedniu: "AUSLAND", bratysławie: "AUSLAND",
  paryżu: "AUSLAND", lizbonie: "AUSLAND", litwie: "AUSLAND", irlandii: "AUSLAND", toronto: "AUSLAND", kalifornii: "AUSLAND",
  jorku: "AUSLAND", czechami: "AUSLAND", brazylią: "AUSLAND",
};

/** Grossgeschriebene Teile von Orts-, Werk- und Eigennamen, die selbst kein Ort sind (Kazimierz Dolny, Wały Chrobrego …). */
const NAMENSTEILE = new Set([
  "górze", "dolnego", "wały", "chrobrego", "jasne", "błonia", "półwyspie", "parku", "narodowego", "stadionie", "zalewu",
  "oka", "białczańskiej", "trybunalskim", "atlas", "jeziorny", "kamiennej", "zdrój", "wielkopolskiego", "świętokrzyskiej", "nowym", "ergo", "arenie",
  "pana",
]);

/**
 * Menschen, Werke, Vereine, Programme und Marken (klein): Mädchen und Jungen gleichwertig, Namen aus vielen Familien;
 * polnische Musik (Dawid Podsiadło, sanah, Mata - „Małomiasteczkowy"), Lektüren (Pan Tadeusz - Adam Mickiewicz,
 * Lalka - Bolesław Prus, Folwark zwierzęcy - George Orwell), Louis Braille, Harry Kane, Steve Jobs, Bruce Springsteen,
 * Simon & Garfunkel; Vereine (Lech, Legia, Wisła, Cracovia, Pogoń, Jagiellonia, Skra), Festival Open'er,
 * das Liceum „Kopernik", Programme und Dienste (Excel, Python, JavaScript, Markdown, LaTeX, Linux, Windows, Discord,
 * Instagram, Messenger, Spotify, Minecraft) und Abkürzungen (PKP, WOPR, CV, CSS, HTML, JSON, PHP, XOR).
 */
const NAMEN = new Set(
  (
    "zosiu kamilu antku haniu bartku oliwii mata sanah wiktor borys dominik szymon ula igor lena maja natalia kacper ida antka " +
    "róża bruno iga igi marysi emilia kuby zuza kacpra wiktoria kopernika nikodem daria darii cracovia kamil kaliny braille'a " +
    "antek harry'ego kane'a ksawery folwark george'a orwella tymoteusz steve'a jobsa open'er igora bruce'a springsteena julek " +
    "minecrafcie minecraft olek hania hubert huberta pogoń bartek kinga sara dawid witek lech legią tymon helena " +
    "spotify ewa sebastian jagiellonii oliwia ignacy ania grzegorz natana klaudia hanka ola skry poli wiktora weronika wopr " +
    "kalina patryk julia kasia agatę michał alicji pkp marta daniela simon garfunkel kuba leon pola javascripcie excelu " +
    "markdownie franek pythonie discordzie paulina hani instagramie messengerze html natan nadia gabrysi marceliny linuxa php " +
    "matyldy iza wojtek cv fabian css jagoda matylda xor amelia joanna json latex tadek kornelia mikołaj igę tadeusza adama " +
    "mickiewicza lalka bolesława prusa małomiasteczkowy dawida podsiadły lecha windowsie oskar tymek leny gabriel"
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
/** GEMESSEN am Ende von PL-T8: verortet, und die Obergrenze je Raum (Śląsk und Pomorze sind mit 14 die grössten). */
const MINDESTENS_VERORTET = 129; // gemessen 129 (ohne Zeilen nur mit Wisła oder Ausland)
const HOECHSTENS_JE_RAUM = 14;
const MINDESTENS_JE_WOIWODSCHAFT = 4;

describe("PL-T8: Orte aus ganz Polen, keine Region gehäuft", () => {
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

  it("die Orte, die PL-T5 §4 für die Jugend-Ende-Charge empfahl, kommen vor (Katowice, Olsztyn, Białystok, Elbląg, Konin, Zielona Góra, Dublin, Wilno)", () => {
    for (const ort of ["katowic", "olsztynie", "białymstoku", "elbląga", "koninie", "zielonej", "dublinie", "wilnie"]) {
      expect(ZEILEN.some((z) => woerterKlein(z).includes(ort)), ort).toBe(true);
    }
  });

  it("€ steht nur in Zeilen über das Ausland oder über das Zeichen selbst - nie mit einem Ort in Polen", () => {
    const euro = ZEILEN.filter((z) => z.includes("€"));
    expect(euro.length).toBeGreaterThanOrEqual(8);
    const polnischerOrt = (z: string) => [...raeumeIn(z)].some((r) => r !== "AUSLAND" && r !== "REGION");
    expect(euro.filter(polnischerOrt)).toEqual([]);
  });

  it("Gegenprobe: unbekannte Grosswörter, Bindestrich-Orte, Anführung und Satzanfänge werden richtig gelesen", () => {
    expect(unbekannteGrosswoerter("Ola jedzie do Atlantydy.")).toEqual(["Atlantydy"]);
    expect(unbekannteGrosswoerter("Busko-Zdrój słynie z wód.")).toEqual([]);
    expect(unbekannteGrosswoerter("Busko-Atlantyda to miasto.")).toEqual(["Atlantyda"]);
    expect(unbekannteGrosswoerter('"Dasz radę!" pisze Maja.')).toEqual([]);
    expect(unbekannteGrosswoerter("Pada? Jutro nie.")).toEqual([]);
    expect(unbekannteGrosswoerter("Pada i Jutro nie.")).toEqual(["Jutro"]);
    expect(raeumeIn("Na Stadionie Śląskim rozgrzewka rusza o 18:00.")).toEqual(new Set(["SLA"]));
    expect(raeumeIn("Przesiadka jest na Świętokrzyskiej.")).toEqual(new Set()); // Metrostation, nicht die Woiwodschaft
    expect(verteilung(Array.from({ length: 15 }, (_, i) => `W Gdyni ${"abcdefghijklmno"[i]}.`)).get("POM")).toBe(15);
    expect(["Na wymianie w Dublinie kanapka kosztuje 6 €."].filter((z) => [...raeumeIn(z)].some((r) => r !== "AUSLAND"))).toEqual([]);
    expect(["W Sopocie gofry kosztują 6 €."].filter((z) => [...raeumeIn(z)].some((r) => r !== "AUSLAND"))).toHaveLength(1);
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

describe("PL-T8: gekürzt serviert - kein Grossbuchstabe mitten im Satz", () => {
  it("jede Zeile, die vor ihrer Sprosse gekürzt kommt, liest sich ohne Grosswort mitten im Satz", () => {
    const fehler = ZEILEN.flatMap((z) => fruehNahtFehler(z).map((f) => `"${z}" @ ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „Trener woła: \"Szybciej!\"“ würde vor „:“ zu „Trener woła Szybciej“", () => {
    expect(fruehNahtFehler('Trener woła: "Szybciej!"').length).toBeGreaterThan(0);
    expect(fruehNahtFehler("Kto gra? Borys i Hania.")).toEqual([]);
    expect(fitText("Czy w Olsztynie jest dobra ścianka wspinaczkowa?", allowedAt(sprosseVon("q")), "pl")).toBe(
      "Czy w Olsztynie jest dobra ścianka wspinaczkowa",
    );
  });
});

// ── Wortschatz: Wortgrenze 8 über T2 + T5 + T8, Sperrliste, Wortbasis, Ogonek-Zwillinge ──

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht (Liste aus PL-T4/T7). */
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
 * zweimal; ein Wörterbuch-Beleg fehlt für Polnisch, Falle 61). Jede ist eine gewöhnliche Form eines Standardworts
 * oder ein belegtes Wort der Jugend- oder Regionalsprache; die Begründung steht daneben. Über den Korpus kommen sie
 * ins Vorlese-Lexikon. ⚠️ Von keiner Person mit Polnisch als Erstsprache gelesen (Befund §4).
 */
const VON_HAND_BELEGT: Readonly<Record<string, string>> = {
  adoptuj: "Imperativ 2. Sg. von adoptować (Tierheim-Losung „adoptuj, nie kupuj“)",
  akcję: "Akk. Sg. von akcja (Aktion der Freiwilligen)",
  aktualizacja: "Nom. Sg. (Update eines Spiels)",
  aktualności: "Nom. Pl. von aktualność (Menüpunkt „Neuigkeiten“ einer Schulseite)",
  ankiecie: "Lok. Sg. von ankieta (Umfrage)",
  asfaltem: "Instr. Sg. von asfalt (idzie się asfaltem)",
  bagietkę: "Akk. Sg. von bagietka",
  bas: "Akk. Sg. (Bassgitarre im Bandjargon: Bruno ma bas)",
  basista: "Nom. Sg. (Bassist)",
  beatbox: "Akk. Sg. (Lehnwort, unverändert)",
  bezwzględną: "Akk. Sg. f. von bezwzględny (wartość bezwzględna, Betrag)",
  biegaczy: "Gen. Pl. von biegacz",
  biegowe: "Adjektiv Pl. (buty biegowe)",
  bidon: "Nom. Sg. (Trinkflasche)",
  bio: "Nom. Sg., unveränderlich (Profiltext in sozialen Netzen)",
  biografię: "Akk. Sg. von biografia",
  biologia: "Nom. Sg. (Schulfach)",
  biologiczno: "Vorderglied in Zusammensetzungen (profil biologiczno-chemiczny)",
  brąz: "Akk. Sg. (Bronzemedaille)",
  charytatywny: "Adjektiv m. (bieg charytatywny, Benefizlauf)",
  chór: "Nom. Sg.",
  chóru: "Gen. Sg. von chór",
  cytacie: "Lok. Sg. von cytat",
  czacie: "Lok. Sg. von czat",
  czerwoni: "Nom. Pl. m.-pers. (biało-czerwoni = die Nationalmannschaft)",
  czynna: "Adjektiv f. (siłownia czynna 24/7, geöffnet)",
  derbach: "Lok. von derby (na derbach Krakowa)",
  derby: "Nom. Pl. tantum (Stadtderby)",
  dobiec: "Infinitiv perf. (dobiec na pociąg)",
  dogrywce: "Lok. Sg. von dogrywka (Verlängerung)",
  dojazd: "Akk. Sg. (Anfahrt, Weg zur Schule)",
  doping: "Nom. Sg. (Anfeuern der Fans)",
  dzienniku: "Lok. Sg. von dziennik (e-dziennik, das elektronische Klassenbuch)",
  dętej: "Adjektiv Lok. Sg. f. (orkiestra dęta, Blasorchester)",
  edytorze: "Lok. Sg. von edytor (Code-Editor)",
  ekipa: "Nom. Sg. (Truppe, Jugendsprache)",
  emotkę: "Akk. Sg. von emotka (Emoticon)",
  essa: "Ausruf der Jugendsprache („geschafft, super“)",
  fan: "Nom. Sg.",
  fantasy: "unveränderlich (Genre)",
  filmik: "Nom. Sg. (kurzes Video)",
  filmiku: "Gen. Sg. von filmik",
  finału: "Gen. Sg. von finał",
  fizyce: "Lok. Sg. von fizyka (Schulfach)",
  formularzu: "Lok. Sg. von formularz",
  frekwencja: "Nom. Sg. (Anwesenheitsquote im e-dziennik)",
  futsalu: "Gen. Sg. von futsal",
  glancem: "Instr. Sg. von glanc (Zuckerglasur; Posener szneki z glancem)",
  grach: "Lok. Pl. von gra",
  gryfnie: "Adverb, schlesisch „schön, fein“",
  gwiazdką: "Instr. Sg. von gwiazdka (Sternchen)",
  głosowych: "Adjektiv Gen. Pl. (wiadomości głosowe, Sprachnachrichten)",
  hali: "Lok./Gen. Sg. von hala (Sporthalle)",
  harcerskim: "Adjektiv Lok. Sg. (obóz harcerski, Pfadfinderlager)",
  harcerską: "Adjektiv Akk. Sg. f. (zbiórka harcerska)",
  harcerzy: "Gen. Pl. von harcerz (Pfadfinder)",
  hasiok: "Nom. Sg., schlesisch „Mülleimer“",
  hokeiści: "Nom. Pl. von hokeista",
  hopu: "Gen. Sg. von hip-hop (zweites Glied; die Stimme liest hip-hopu als ein Wort)",
  informatyce: "Lok. Sg. von informatyka (Schulfach)",
  informatyczna: "Adjektiv f. (pracownia informatyczna)",
  informatyka: "Nom. Sg.",
  integrację: "Akk. Sg. von integracja (Kennenlernfahrt der ersten Klasse)",
  językowy: "Adjektiv m. (obóz językowy)",
  językowym: "Adjektiv Lok. Sg. m.",
  kajakach: "Lok. Pl. von kajak",
  kajakarstwo: "Akk. Sg. (Kanusport)",
  kajakiem: "Instr. Sg. von kajak",
  kalkulatorze: "Lok. Sg. von kalkulator",
  kapitanka: "Nom. Sg. f. (Mannschaftskapitänin)",
  kartkówce: "Lok. Sg. von kartkówka (kurzer Test)",
  kartkówki: "Gen. Sg. von kartkówka",
  kaskiem: "Instr. Sg. von kask",
  kebab: "Akk. Sg.",
  kieszonkowe: "Akk. Sg. n. (Taschengeld, substantiviertes Adjektiv)",
  kitesurferów: "Gen. Pl. von kitesurfer",
  klasach: "Lok. Pl. von klasa",
  klasowej: "Adjektiv Lok. Sg. f. (grupa klasowa, Klassenchat)",
  klasową: "Adjektiv Akk. Sg. f. (wycieczka klasowa)",
  klawisze: "Akk. Pl. von klawisz (Keyboard in der Band: Iga klawisze)",
  klubowe: "Adjektiv Pl. (szaliki klubowe)",
  koców: "Gen. Pl. von koc",
  kodzie: "Lok. Sg. von kod",
  komunikatorze: "Lok. Sg. von komunikator (Messenger-Programm)",
  konfiguracyjnym: "Adjektiv Lok. Sg. m. (plik konfiguracyjny)",
  kontra: "Präposition „gegen“ (Wisła kontra Cracovia)",
  kopiowaniu: "Lok. Sg. von kopiowanie",
  korepetycjach: "Lok. Pl. von korepetycje (Nachhilfe)",
  koszenie: "Akk. Sg. (das Mähen)",
  koszulek: "Gen. Pl. von koszulka",
  koszykarzy: "Gen. Pl. von koszykarz",
  koszykówce: "Lok. Sg. von koszykówka (na koszykówce = beim Basketballspiel)",
  krainie: "Lok. Sg. von kraina (kraina tysiąca jezior)",
  krem: "Akk. Sg. (krem z filtrem, Sonnencreme)",
  kujawsko: "Vorderglied (województwo kujawsko-pomorskie)",
  leczniczych: "Adjektiv Gen. Pl. (wody lecznicze)",
  legitymacją: "Instr. Sg. von legitymacja (Schülerausweis)",
  ligi: "Gen. Sg. von liga",
  ligę: "Akk. Sg. von liga",
  litewska: "Adjektiv f. (granica polsko-litewska)",
  lodowisko: "Akk. Sg. (Eisbahn)",
  login: "Nom. Sg.",
  ludowym: "Adjektiv Lok. Sg. m. (zespół ludowy)",
  matmie: "Lok. Sg. von matma (Schülersprache für Mathematik)",
  matmę: "Akk. Sg. von matma",
  matura: "Nom. Sg. (Abitur)",
  maturalny: "Adjektiv m. (arkusz maturalny)",
  matury: "Gen. Sg. von matura",
  maturze: "Lok. Sg. von matura",
  maturę: "Akk. Sg. von matura",
  mecie: "Lok. Sg. von meta (Ziel)",
  miesięczny: "Adjektiv m. (bilet miesięczny)",
  mistrzostwach: "Lok. Pl. von mistrzostwa",
  mnożymy: "1. Pl. von mnożyć",
  mural: "Akk. Sg.",
  muzycznej: "Adjektiv Lok. Sg. f. (szkoła muzyczna)",
  namiotach: "Lok. Pl. von namiot",
  nierówność: "Akk. Sg. (Ungleichung)",
  niezdana: "Partizip f. (matura niezdana, nicht bestanden)",
  nocowanie: "Nom. Sg. (Übernachten bei Freunden)",
  notatkach: "Lok. Pl. von notatka",
  obowiązkowe: "Adjektiv Pl. (pola obowiązkowe)",
  obowiązkowego: "Adjektiv Gen. Sg. m. (przedmiot obowiązkowy)",
  obserwujących: "Gen. Pl. von obserwujący (Follower)",
  obserwującymi: "Instr. Pl. von obserwujący",
  obuwiu: "Lok. Sg. von obuwie",
  obwodnicy: "Lok. Sg. von obwodnica (Umgehungsstrasse)",
  oddajemy: "1. Pl. von oddawać (abgeben)",
  odpisuje: "3. Sg. von odpisywać (antwortet)",
  odtworzeń: "Gen. Pl. von odtworzenie (Wiedergaben eines Lieds)",
  odznak: "Gen. Pl. von odznaka (Abzeichen)",
  ogarnie: "3. Sg. Futur von ogarnąć (Jugendsprache: besorgt, kümmert sich)",
  ogólniaku: "Lok. Sg. von ogólniak (umgangssprachlich für liceum ogólnokształcące)",
  ogłasza: "3. Sg. von ogłaszać",
  okrążenie: "Akk. Sg. (Runde)",
  omawiamy: "1. Pl. von omawiać (im Unterricht besprechen)",
  orliku: "Lok. Sg. von orlik (öffentlicher Sportplatz aus dem Programm Orlik)",
  osiedlu: "Lok. Sg. von osiedle (Wohnsiedlung)",
  oszczepem: "Instr. Sg. von oszczep (Speer)",
  oznaczamy: "1. Pl. von oznaczać",
  oznaczenie: "Akk. Sg. (Kennzeichnung, Altersfreigabe)",
  paczek: "Gen. Pl. von paczka",
  paska: "Gen. Sg. von pasek (pasek na świadectwie, Auszeichnungsstreifen im Zeugnis)",
  parkour: "Akk. Sg. (Lehnwort)",
  parkrunie: "Lok. Sg. von parkrun (freier 5-km-Lauf am Samstag)",
  perkusji: "Lok. Sg. von perkusja (Schlagzeug)",
  pisemna: "Adjektiv f. (część pisemna)",
  pismem: "Instr. Sg. von pismo (pismem Braille'a)",
  piosenkami: "Instr. Pl. von piosenka",
  piłkarzami: "Instr. Pl. von piłkarz",
  piłkarzyki: "Akk. Pl. (Tischkicker)",
  plakacie: "Lok. Sg. von plakat",
  planszowych: "Adjektiv Gen. Pl. (gry planszowe)",
  planszy: "Lok. Sg. von plansza (Spielbrett)",
  platformie: "Lok. Sg. von platforma (Streamingdienst)",
  platformy: "Gen. Sg. von platforma (Lernplattform)",
  playlista: "Nom. Sg.",
  playlisty: "Gen. Sg. von playlista",
  playlistę: "Akk. Sg. von playlista",
  plebiscytu: "Gen. Sg. von plebiscyt (Abstimmung)",
  początkowy: "Adjektiv m.",
  podajemy: "1. Pl. von podawać (angeben)",
  podeślesz: "2. Sg. Futur von podesłać (schickst du mir)",
  pogrubiony: "Partizip m. von pogrubić (fett gedruckt)",
  polsko: "Vorderglied in Zusammensetzungen (polsko-litewska)",
  polubień: "Gen. Pl. von polubienie (Likes)",
  pominięty: "Partizip m. von pominąć",
  pomorskim: "Adjektiv Lok. Sg. n. (województwo kujawsko-pomorskie)",
  potrenować: "Infinitiv perf. von trenować",
  poście: "Lok. Sg. von post (Beitrag)",
  pracownia: "Nom. Sg. (Fachraum)",
  pulpitu: "Gen. Sg. von pulpit (Desktop)",
  prezentacja: "Nom. Sg.",
  promują: "3. Pl. von promować",
  programuje: "3. Sg. von programować",
  przejeżdża: "3. Sg. von przejeżdżać",
  przekazuje: "3. Sg. von przekazywać",
  przepłynęła: "3. Sg. f. Präteritum von przepłynąć (Natalia)",
  przesiadka: "Nom. Sg. (Umstieg)",
  przypisuje: "3. Sg. von przypisywać (weist zu)",
  przypisy: "Akk. Pl. von przypis (Fussnote)",
  przywożą: "3. Pl. von przywozić",
  próbnej: "Adjektiv Gen. Sg. f. (próbna matura)",
  rajd: "Akk. Sg. (rajd rowerowy, Radtour)",
  referacie: "Lok. Sg. von referat",
  regulaminie: "Lok. Sg. von regulamin",
  rekrutacja: "Nom. Sg. (Aufnahmeverfahren)",
  rekrutację: "Akk. Sg. von rekrutacja",
  remis: "Nom. Sg. (Unentschieden)",
  robotyków: "Gen. Pl. von robotyk",
  "rock'n'rolla": "Gen. Sg. von rock'n'roll (übliche polnische Schreibung mit Apostroph)",
  rowerowy: "Adjektiv m.",
  rozdziały: "Akk. Pl. von rozdział",
  rozgrzewka: "Nom. Sg. (Aufwärmen)",
  rozprawce: "Lok. Sg. von rozprawka (Erörterung, Prüfungsaufsatz)",
  rozprawki: "Gen. Sg. von rozprawka",
  rozszerzone: "Adjektiv Pl. (przedmioty rozszerzone, Leistungsfächer)",
  rozszerzonych: "Adjektiv Gen. Pl.",
  rozwiązujemy: "1. Pl. von rozwiązywać",
  ryczce: "Lok. Sg. von ryczka (Posener Regionalwort für den kleinen Hocker)",
  rund: "Gen. Pl. von runda",
  rzucie: "Lok. Sg. von rzut (rzut oszczepem)",
  równania: "Gen. Sg. von równanie",
  równanie: "Akk. Sg. (Gleichung)",
  samorządu: "Gen. Sg. von samorząd (Schülervertretung)",
  schronisku: "Lok. Sg. von schronisko (Tierheim)",
  seniorów: "Gen. Pl. von senior",
  serduszkiem: "Instr. Sg. von serduszko",
  seta: "Akk. Sg. von set (Satz im Volleyball, belebte Form)",
  siatkarze: "Nom. Pl. von siatkarz",
  sieciowy: "Adjektiv m. (dysk sieciowy)",
  sklepik: "Nom. Sg. (Schulkiosk)",
  sklepiku: "Gen. Sg. von sklepik",
  skuter: "Akk. Sg. (Motorroller)",
  skuterem: "Instr. Sg. von skuter",
  slalom: "Nom. Sg.",
  smażalni: "Lok. Sg. von smażalnia (Fischbraterei)",
  solówkę: "Akk. Sg. von solówka (Solo)",
  spoiler: "Akk. Sg.",
  stołku: "Lok. Sg. von stołek (Hocker)",
  sportowej: "Adjektiv Gen. Sg. f.",
  spotkań: "Gen. Pl. von spotkanie",
  subskrybentów: "Gen. Pl. von subskrybent",
  subskrypcji: "Gen. Pl. von subskrypcja",
  szablonie: "Lok. Sg. von szablon (Vorlage)",
  szachistka: "Nom. Sg. (Schachspielerin)",
  szachowy: "Adjektiv m.",
  szachowym: "Adjektiv Lok. Sg. m.",
  szacun: "Nom. Sg., Jugendsprache für szacunek (Respekt)",
  szaliki: "Akk. Pl. von szalik",
  szczypiornistów: "Gen. Pl. von szczypiornista (Handballer)",
  szczypiorniści: "Nom. Pl. von szczypiornista",
  szkolna: "Adjektiv f.",
  szneki: "Akk. Pl. von szneka (Posener Hefeschnecke)",
  sztos: "Nom. Sg., Jugendsprache („der Hammer“)",
  szybsza: "Komparativ f. von szybki",
  tabeli: "Lok. Sg. von tabela",
  tabulator: "Akk. Sg.",
  taneczny: "Adjektiv m. (układ taneczny)",
  technikum: "Nom./Gen. Sg. (berufsbildende Oberschule)",
  terminalu: "Lok. Sg. von terminal",
  trafione: "Partizip n. von trafić",
  trybunach: "Lok. Pl. von trybuna",
  uczniowskiego: "Adjektiv Gen. Sg. m. (samorząd uczniowski)",
  ukrywamy: "1. Pl. von ukrywać",
  ulgowa: "Adjektiv f. (wejściówka ulgowa, ermässigt)",
  ulgowy: "Adjektiv m. (bilet ulgowy)",
  ułamek: "Akk. Sg. (Bruch)",
  wakacyjnej: "Adjektiv Gen. Sg. f. (praca wakacyjna)",
  warsztat: "Akk. Sg. (Werkstatt)",
  warunek: "Akk. Sg. (Bedingung)",
  wejściówka: "Nom. Sg. (Eintrittskarte)",
  widokowej: "Adjektiv Gen. Sg. f. (wieża widokowa)",
  wlecze: "3. Sg. von wlec się (zieht sich hin)",
  województwie: "Lok. Sg. von województwo",
  wolontariusze: "Nom. Pl. von wolontariusz",
  wpisaniu: "Lok. Sg. von wpisanie",
  wpisuje: "3. Sg. von wpisywać",
  wpisujemy: "1. Pl. von wpisywać",
  wrzuca: "3. Sg. von wrzucać (postet)",
  wrzucamy: "1. Pl. von wrzucać",
  wspinaczkowa: "Adjektiv f. (ścianka wspinaczkowa)",
  wstawia: "3. Sg. von wstawiać",
  wychowawczyni: "Nom. Sg. (Klassenlehrerin)",
  wydrukowany: "Partizip m. von wydrukować",
  wymarzone: "Adjektiv Pl. (wymarzone kierunki studiów)",
  wymianie: "Lok. Sg. von wymiana (Schüleraustausch)",
  wysyłamy: "1. Pl. von wysyłać",
  wyszukiwarka: "Nom. Sg. (Suchfunktion)",
  wyświetleń: "Gen. Pl. von wyświetlenie (Aufrufe)",
  wzoru: "Gen. Sg. von wzór (Formel)",
  wód: "Gen. Pl. von woda (wody lecznicze)",
  zagra: "3. Sg. Futur von zagrać",
  zagrywka: "Nom. Sg. (Aufschlag, Spielzug)",
  zapisało: "3. Sg. n. Präteritum von zapisać się (13 osób zapisało się)",
  zapisuje: "3. Sg. von zapisywać",
  zapisujemy: "1. Pl. von zapisywać",
  zapisujesz: "2. Sg. von zapisywać się",
  zaznacza: "3. Sg. von zaznaczać",
  zbiorze: "Lok. Sg. von zbiór (Ernte)",
  zbiórce: "Lok. Sg. von zbiórka (Sammlung)",
  zbiórkę: "Akk. Sg. von zbiórka (Pfadfindertreffen)",
  zdanym: "Partizip Lok. Sg. von zdać (po zdanym egzaminie)",
  zdjęciem: "Instr. Sg. von zdjęcie",
  zmywaku: "Lok. Sg. von zmywak (umgangssprachlich: Spülküchen-Job)",
  znacznik: "Nom. Sg. (Tag in HTML)",
  zwierzęcy: "Adjektiv m. (Folwark zwierzęcy, Buchtitel)",
  zł: "Abkürzung für złoty (nach der Zahl)",
  ósmoklasisty: "Gen. Sg. von ósmoklasista (egzamin ósmoklasisty)",
  ładowarka: "Nom. Sg. (Ladegerät)",
  ścianka: "Nom. Sg. (Kletterwand)",
  śpiwór: "Akk. Sg. (Schlafsack)",
  świadectwie: "Lok. Sg. von świadectwo (Zeugnis)",
  świetlicy: "Lok. Sg. von świetlica (Hort)",
  żeglarski: "Adjektiv m. (obóz żeglarski)",
  żeglarskim: "Adjektiv Lok. Sg. m.",
  żużel: "Akk. Sg. (Speedway)",
  żużlową: "Adjektiv Akk. Sg. f. (liga żużlowa)",
};

/** Die Wörter einer Zeile für Sperrliste, Wortbasis und Stimme (ohne technische Wörter, Bindestrich-Teile einzeln). */
const pruefWoerter = (zeile: string): string[] => woerterMitAnfang(zeile).map((x) => x.w);

const bekannt = (w: string): boolean => BASIS.has(w) || w in VON_HAND_BELEGT || w in ORTE || NAMEN.has(w) || NAMENSTEILE.has(w);

function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) for (const w of pruefWoerter(z)) if (w.length >= 2 && !bekannt(w.toLowerCase())) out.add(w.toLowerCase());
  return [...out];
}

/** „Ogonek-Zwillinge" (PL-T1 §4): Formen ohne Ogonek, deren Form MIT Ogonek ebenfalls ein Wort ist (ze/że, pisze/piszę). */
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
  "Dlaczego w Gdyni zawsze tak wieje?",
  "Wolontariusze z Kalisza zebrali 199 paczek dla seniorów.", // paczek = Gen. Pl. von paczka (Pakete); seit dem Lexikon-Nachtrag 10.10.2026 ist pączek ein Wort, paczek sein Ogonek-Zwilling
  "Czy w Olsztynie jest dobra ścianka wspinaczkowa?",
  "Super, nasza drużyna weszła do finału konkursu!",
  "Wielkie dzięki, Antku, za pomoc z przeprowadzką!",
  "Uwaga, ostatni autobus z Krynicy odjeżdża za chwilę!",
  "Cisza, Wiktor gra solówkę na gitarze!",
  "Szybko, Mata zaraz wchodzi na scenę!",
  "Brawo, cała grupa z Mrągowa zdała kurs pierwszej pomocy!",
  "Dominik trenuje e-sport w klubie z Puław.",
  "Szymon - kapitan naszej drużyny - zawsze gra do końca.",
  "Granica polsko-litewska przebiega niedaleko Sejn.",
  "Brat Darii dojeżdża do technikum ze Skarżyska-Kamiennej.",
  "\"Dasz radę!\" pisze Maja do brata przed egzaminem.",
  "W poznańskiej piekarni Ida kupuje \"szneki z glancem\".",
  "\"Wyłącz już ten telefon!\" prosi mama Antka o północy.",
  "Babcia Leny z Poznania siada na \"ryczce\", czyli na małym stołku.",
  "\"Kto ma wolne miejsce w aucie do Sopotu?\" pisze Natalia na grupie.",
  "Przedmioty rozszerzone Igi: biologia, chemia i angielski.",
  "Uwaga: zmiana sali na lekcji chemii.",
  "Hasło wolontariuszy ze schroniska w Chorzowie: adoptuj, nie kupuj.",
  "Zestaw na wycieczkę w Tatry: buty, kurtka, mapa i woda.",
  "Lektura na ferie: \"Lalka\" Bolesława Prusa.",
  "Wyniki szkolnego plebiscytu: najlepszy nauczyciel to pan od fizyki.",
  "Egzamin ósmoklasisty (polski, matematyka i angielski) piszemy w maju.",
  "Nikodem trenuje kajakarstwo górskie (slalom) na torze w Krakowie.",
  "Nasza wychowawczyni (pani od biologii) zabiera klasę do Wigierskiego Parku Narodowego.",
  "Latem Daria (od czerwca do sierpnia) pracuje w smażalni ryb we Władysławowie.",
  "Tata Igora jeździ na koncerty Bruce'a Springsteena.",
  "Klasa 1a z Gorzowa wyrusza na integrację nad jezioro.",
  "Siostra Huberta chodzi do klasy 1b w Siedlcach.",
  "Ida wygrywa w szkolnym turnieju szachowym 11 partii z rzędu.",
  "Kinga od 2 lat gra w orkiestrze dętej w Łowiczu.",
  "Na występ w Ergo Arenie Sara kupuje 2 bilety.",
  "W piątek ostatnia lekcja kończy się o 12.",
  "Witek zdaje maturę z 2 przedmiotów rozszerzonych.",
  "Klasa 3c z Tarnowa wyjeżdża na wymianę do Wilna.",
  "Za koszenie trawy u sąsiada Tymon dostaje 32 zł.",
  "Ignacy ma 14 lat i trenuje judo w Koninie.",
  "Na maturze Klaudia zdaje aż 5 egzaminów.",
  "Ola ma 16 lat i od lipca pracuje przy zbiorze truskawek.",
  "Za 6 dni Weronika zdaje egzamin z gitary w szkole muzycznej.",
  "Szymon wstaje o 6:47, żeby zdążyć na autobus.",
  "Szkolna drużyna futsalu z Radomia wygrywa 7:2.",
  "Grupa harcerzy wyrusza na szlak ze Szczawnicy o 7:45.",
  "Paczka z nowym kaskiem przychodzi po 8 dniach.",
  "Ta piosenka ma 19 milionów odtworzeń.",
  "Za opiekę nad psem sąsiadów Michał dostaje 50 zł.",
  "Na kino z popcornem Olek wydaje 40 zł.",
  "Frekwencja Huberta w tym semestrze to 98%.",
  "W ankiecie samorządu 64% uczniów chce dłuższej przerwy.",
  "Zadania z matmy są na stronie zadania.example/matma.",
  "Zestaw na wycieczkę: kanapka + woda + jabłko.",
  "W Pythonie Franek liczy 2 ** 10 i dostaje 1024.",
  "Wyszukiwarka plików znajduje wszystkie zdjęcia po wpisaniu *.jpg.",
  "Na fizyce prędkość liczymy ze wzoru v = s / t.",
  "Na chemii zapisujemy: H2O = woda, CO2 = dwutlenek węgla.",
  "W regulaminie turnieju stoi: liczba graczy w drużynie < 6.",
  "Nasza ocena filmów: książka > film, jak zawsze.",
  "Cena gry w amerykańskim sklepie to 60 $.",
  "Prezentacja z historii jest zapisana w C:\\Projekty\\Historia.",
  "Pod zdjęciem z ostatniego dzwonka Iga dodaje #matura2026.",
  "Na kalkulatorze Jagoda wpisuje 2^10 i dostaje 1024.",
]);

describe("PL-T8: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("auch über alle drei Jugend-Chargen (PL-T2 + PL-T5 + PL-T8) zusammen nicht (Falle 45)", () => {
    const fehler = zuHaeufig([...T2, ...T5, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (gross, mit Satzzeichen, nach Ziffer), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Kuba" : "Ten 9 kuba"} ${"abcdefghi"[i]}? Już.`);
    expect(zuHaeufig(neun)).toEqual(['"kuba": 9 Zeilen']);
    // Beim Schreiben gemessen: im ersten Entwurf standen „Kuba" und „Ola" in je 18 Zeilen (mit T2 + T5: 23).
    expect(zuHaeufig([...T2, ...T5, ...Array.from({ length: 4 }, (_, i) => `Kuba ${"abcd"[i]}.`)])).toEqual(['"kuba": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis", () => {
    const fehler = ZEILEN.flatMap((t) => pruefWoerter(t).filter((w) => gesperrtPl(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurwa (Kern), gruba und leniwy (Wortbasis) werden gefunden, sztos und szacun nicht", () => {
    expect(istKernGesperrtPl("kurwa")).toBe(true);
    expect(gesperrtPl("gruba")).toBe(true);
    expect(gesperrtPl("leniwy")).toBe(true);
    expect(gesperrtPl("sztos")).toBe(false);
    expect(gesperrtPl("szacun")).toBe(false);
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
   * Die Stimme liest Leerzeichen-Wörter: „Busko-Zdrój" ist EIN Wort (das Fach `pl` streicht den Bindestrich,
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
    expect(stimmWoerter('Busko-Zdrój, "essa" i 2:1.')).toEqual(["Busko-Zdrój", "essa"]);
  });

  it("jede Zeile mit einem Ogonek-Zwilling ist gelesen - und nur diese", () => {
    const mit = ZEILEN.filter(mitZwilling);
    expect(mit.filter((z) => !ZEILEN_MIT_ZWILLING_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_ZWILLING_GELESEN].filter((z) => !mit.includes(z))).toEqual([]);
  });

  it("Gegenprobe: „Ide z mama?“ (statt Idę z mamą) hat Zwillinge, „Borys ma skuter!“ nicht", () => {
    expect(mitZwilling("Ide z mama?")).toBe(true);
    expect(mitZwilling("Borys ma skuter!")).toBe(false);
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

describe("PL-T8: keine Kopien, keine Paare, nichts fast gleich", () => {
  it("keine Zeile doppelt - auch nicht ohne Satzzeichen oder nach dem Ledger-Schlüssel (Zeichen und ą ę … sind dort Trenner)", () => {
    expect(new Set(ZEILEN.map(ohneSatzzeichen)).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("die Vergleichsmengen sind voll: T1-T7 in der rohen Sammelliste, tr/cs-Korpus, Serien und Banken", () => {
    expect(ANDERE_PL_ZEILEN.length).toBeGreaterThanOrEqual(164 + 151 + 167 + 326 + 326 + 330 + 383);
    expect(ANDERE_PL().filter((i) => CORPUS_PL_WEG_ENDE_KIDS.includes(i)).length).toBe(CORPUS_PL_WEG_ENDE_KIDS.length);
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

  it("gegen PL-T7 (dieselben Sprossen, Kinder) auch nicht ab 0,4 - die Ende-Chargen teilen keine Tatsachen (Falle 51)", () => {
    const fehler = fastGleich(ZEILEN, T7, 0.4);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: beim Schreiben verworfene Zeilen wären Kopie, Paar oder fast gleich", () => {
    // Verworfen (Befund §4): „Brawo dla naszych koszykarzy z Włocławka!" neben PL-T7 „Brawo dla naszych siatkarek z Chełmna!"
    // und „Ale widok ze Śnieżnika!" neben PL-T2 „ale widok".
    expect(fastGleich(["Brawo dla naszych koszykarzy z Włocławka!"], T7, 0.5)).not.toEqual([]);
    expect(fastGleich(["Ale widok ze Śnieżnika!"], ANDERE_PL_ZEILEN, 0.5)).not.toEqual([]);
    expect(fastGleich(["Kuba robi zdjęcia."], ["Ola pisze list."], 0.5)).toEqual([]);
    const t = ANDERE_PL_ZEILEN[20];
    expect(kopienGegen([`${t.replace(/[.!?]$/, "")}?`], ANDERE_PL_ZEILEN)).toHaveLength(1);
    expect(paare(["Kamil był w Gdyni.", "Kamil była w Gdyni."])).toHaveLength(1);
    expect(bausteinKey("satz", "3 + 4 = 7.")).toBe(bausteinKey("satz", "3 * 4 = 7.")); // Zeichen sind Trenner
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker (keine stille Verschmelzung), und der Zuwachs ist die Zeilenzahl", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_PL()].map((i) => bausteinId(i.kind, i.text)));
    expect(CHARGE.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    const eigeneIds = CHARGE.map((i) => bausteinId(i.kind, i.text));
    expect(new Set(eigeneIds).size).toBe(ZEILEN.length);
    // Anker nur anhängend: die IDs dieser Charge stehen als geschlossener Block im Anker, keine davor
    // (gemessen 09.10.2026 auf dd8b39e2: 17.024 ⇒ 17.402; nach Merge feat/tastenflow 4ed2d3eb: 17.969 ⇒ 18.347, je „378 neu").
    const start = KORPUS_ANKER.indexOf(eigeneIds[0]);
    expect(start).toBeGreaterThanOrEqual(17024);
    expect(KORPUS_ANKER.slice(start, start + ZEILEN.length)).toEqual(eigeneIds);
    const eigen = new Set(eigeneIds);
    expect(KORPUS_ANKER.slice(0, start).filter((id) => eigen.has(id))).toEqual([]);
  });
});

// ── Korpus-Anker und Auslieferung ──────────────────────────────────────────

describe("PL-T8: Korpus-Anker und Auslieferung", () => {
  it("die Sammelliste trägt diese Charge als geschlossenen Block hinter PL-T7 (Anker nur anhängend)", () => {
    const start = PL_ROH.indexOf(CHARGE[0]);
    expect(PL_ROH.slice(start, start + ZEILEN.length)).toEqual(CHARGE);
    const letzteT7 = Math.max(...CORPUS_PL_WEG_ENDE_KIDS.map((i) => PL_ROH.indexOf(i)));
    expect(start).toBeGreaterThan(letzteT7);
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
    const probe = { text: "Zzz probe pl t8?", kind: "satz" as const, stufen: ["teens" as const] };
    const ids = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CORPUS_CS, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("am Ende des Lernwegs bekommen Jugendliche jede Zeile vollständig - Kinder und Erwachsene keine", () => {
    const alles = allowedAt(ordnung().length);
    const geliefert = new Set(corpusItemsFor({ stufe: "teens", allowed: alles, lang: "pl", lernweg: "pl" }));
    expect(ZEILEN.filter((t) => !geliefert.has(t))).toEqual([]);
    for (const stufe of ["kids", "erwachsen"] as const) {
      const andere = new Set(corpusItemsFor({ stufe, allowed: alles, lang: "pl", lernweg: "pl" }));
      expect(ZEILEN.filter((t) => andere.has(t)), stufe).toEqual([]);
    }
  });

  it("vor ł kommt keine dieser Zeilen; an q kommen sie nur gekürzt (ohne ? ! - \" : ( ), ohne Ziffern und Zeichen)", () => {
    const vorL = allowedAt(sprosseVon("ł") - 1);
    expect(ZEILEN.filter((t) => fitText(t, vorL, "pl") !== null)).toEqual([]);
    const anQ = allowedAt(sprosseVon("q"));
    const geliefert = corpusItemsFor({ stufe: "teens", allowed: anQ, lang: "pl", lernweg: "pl" });
    expect(geliefert.filter((t) => /[^\p{L} .,]/u.test(t))).toEqual([]);
    const gekuerzt = ZEILEN.map((z) => fitText(z, anQ, "pl")).filter((s): s is string => s !== null);
    expect(gekuerzt.length).toBeGreaterThan(100);
    expect(geliefert.some((t) => gekuerzt.includes(t))).toBe(true);
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
