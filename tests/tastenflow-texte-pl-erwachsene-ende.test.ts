/**
 * ★★★ Wächter PL-T9 (09.10.2026): die polnischen Erwachsenentexte am Ende des Lernwegs
 * (`corpusPlWegEndeErwachsene.ts`, Sprossen 40-77 auf der Tastatur `pl` = `?` bis `€`).
 * Vorbilder: `tastenflow-texte-pl-kids-ende.test.ts` (PL-T7, Form und Mechanik) und
 * `tastenflow-texte-pl-erwachsene-mitte.test.ts` (PL-T6, Erwachsene: Anrede, Geschlecht, Wortbudget T3 + T6);
 * Befund `BEFUND-2026-10-09-PL-T9-ERWACHSENE-ENDE.md`, Leitfaden Fallen 31/37/45/51/58/61/67/76.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, an dem `fitText` sie UNGEKÜRZT liefert
 * (`introOrder("pl").slice(0, n)`). `? ! - " : ( )` sind auf Weg „pl" weglassbar - vor ihrer Sprosse
 * kommt die Zeile gekürzt an; darum trägt jede Zeile einen Buchstaben ab `ł`, und keine gekürzte
 * Fassung hat ein grosses Wort mitten im Satz (Weg „pl" hat keine Frühfassungen, die gemeinsame Datei
 * `scripts/_fruehfassung.mts` bleibt unberührt). Ziffern, `'` und die Zeichen ab `%` sind hart.
 * Jede Regel hat eine Gegenprobe: der Prüfer muss einen gebauten Fehler finden.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, korpusFuer, CORPUS, CORPUS_EN, CORPUS_FR, CORPUS_IT, CORPUS_PL, CORPUS_TR, CORPUS_CS } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_PL_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusPlWegFruehErwachsene";
import { CORPUS_PL_WEG_MITTE_ERWACHSENE } from "../src/lib/typing/corpusPlWegMitteErwachsene";
import { CORPUS_PL_WEG_ENDE_KIDS } from "../src/lib/typing/corpusPlWegEndeKids";
import { CORPUS_PL_WEG_ENDE_ERWACHSENE } from "../src/lib/typing/corpusPlWegEndeErwachsene";
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

const CHARGE = CORPUS_PL_WEG_ENDE_ERWACHSENE;
const ZEILEN = CHARGE.map((i) => i.text);
const EIGENE = new Set(ZEILEN);
/** Die früheren Erwachsenen-Chargen (Wortbudget gilt über alle drei - Falle 45). */
const T3 = CORPUS_PL_WEG_FRUEH_ERWACHSENE.map((i) => i.text);
const T6 = CORPUS_PL_WEG_MITTE_ERWACHSENE.map((i) => i.text);
/** Die Kinder-Charge am selben Ende des Lernwegs (Falle 51: dieselben Zeichen-Sprossen verleiten zu denselben Tatsachen). */
const T7 = CORPUS_PL_WEG_ENDE_KIDS.map((i) => i.text);
/**
 * Alle anderen pl-Chargen aus der ROHEN Sammelliste `corpusPl.ts` (nach Objekt, Lehre PL-T3): T1-T7 und jede spätere
 * (PL-T8 kommt beim Merge dazu). Die geladene `CORPUS_PL` hätte Kopien schon still verschmolzen.
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

describe("PL-T9: jede Zeile an ihrer Sprosse (Tastatur pl)", () => {
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
    // Beim Schreiben gefunden: „Lekarz wystawia e-skierowanie, więc nic nie drukujemy." kam gekürzt schon an 22.
    expect(ersteSprosse("Lekarz wystawia e-skierowanie, więc nic nie drukujemy.")!).toBeLessThan(sprosseVon("ł"));
    expect(volleEinheit("Umowa-zlecenie.")).toBe("-");
    expect(volleEinheit("ZUS (zakład) płaci.")).toBe(")");
    expect(volleEinheit("Pismo Braille'a.")).toBe("'");
    expect(ersteSprosse("Pismo Braille'a.")).toBe(sprosseVon("'")); // der Apostroph ist hart
    expect(volleEinheit("Wychodzimy o 6:45.")).toBe("6");
    expect(volleEinheit("Biuro jest czynne od 8:00.")).toBe("0");
    expect(volleEinheit("Folder D:\\Faktury.")).toBe("\\");
    expect(volleEinheit("Pole {imię}.")).toBe("}");
    expect(volleEinheit("Kawa kosztuje 4 €.")).toBe("€");
  });

  /**
   * GEMESSEN am Ende von PL-T9 (vom Code gezählt, Einheit der vollen Sprosse) - darf künftig nur STEIGEN, nie unter 6.
   * `(`, `[` und `{` haben keine eigenen Zeilen.
   */
  const MINDESTENS_JE_EINHEIT: Record<string, number> = {
    "?": 32, "!": 22, "-": 21, '"': 16, ":": 18, ")": 13, "'": 7,
    "1": 10, "2": 13, "3": 10, "4": 10, "5": 10, "6": 10, "7": 11, "8": 11, "9": 12, "0": 14,
    "%": 8, "&": 7, "/": 7, "+": 7, "*": 6, "=": 7, "_": 7, "<": 7, ">": 7, "$": 7, "|": 7, "\\": 7, "@": 7, "#": 7,
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

describe("PL-T9: jede Zeile übt die Einheit ihrer Sprosse (W6, Falle 37)", () => {
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
    expect(volleEinheit("Kto odbiera dzieci z przedszkola.")).not.toBe("?");
  });

  it("in echten Runden (Mein Training, Erwachsene) kommen an der Sprosse von ? Fragen dieser Charge an (Fokus ?)", () => {
    const intro = ordnung().slice(0, sprosseVon("?"));
    const echt = Math.random;
    let s = 9009;
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
        for (const z of adaptiveRound({ introduced: intro, focus: ["?"], stufe: "erwachsen", lang: "pl", lernweg: "pl", count: 12 })) {
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

describe("PL-T9: Klammern und Anführungszeichen nie halb", () => {
  it("jede Zeile schliesst, was sie öffnet", () => {
    const fehler = ZEILEN.flatMap((t) => paarFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: halbe Paare werden gefunden; fitText serviert eine Klammer nie halb", () => {
    expect(paarFehler("ZUS (zakład płaci.")).toHaveLength(1);
    expect(paarFehler('Mówi "pilne.')).toHaveLength(1);
    expect(paarFehler("Pole {imię.")).toHaveLength(1);
    expect(paarFehler('"Pilne!" pisze szef (znowu).')).toEqual([]);
    const nurAuf = new Set([...allowedAt(sprosseVon("(") - 1), "("]);
    expect(fitText("ZUS (zakład) płaci.", nurAuf, "pl")).toBeNull();
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
  // Zwei allein stehende Klammern um ein Zeichen oder leer sind eine Erwähnung der Tasten bzw. ein leeres Kästchen
  // im Formular („Klamry { }", „[ ] nie"), kein Satzzeichen.
  const u = t.replace(/ [[({] (?:\S+ )?[\])}](?=[\s.,!?]|$)/g, " X");
  if (/ [.,:?!](?=\s|$)/.test(u) || /(?<![[{|]) [)\]}](?!\s)/.test(u)) f.push("Leerzeichen vor Satzzeichen");
  if (/[([{] (?![\]}])/.test(u)) f.push("Leerzeichen nach öffnender Klammer");
  if (/,[^ ]/.test(t.replace(/\d,\d/g, "0"))) f.push("kein Leerzeichen nach Komma (Dezimalkomma 1,5 ausgenommen)");
  if (/\bto:/u.test(t)) f.push("Doppelpunkt nach „to“ (im Polnischen ein Fehler)");
  return f;
}

/**
 * Zahlformat (Glossar §1 Nr. 5, §2.10): Dezimalkomma (1,5), kein Tausenderpunkt, vierstellig ohne Trenner, ab fünf
 * Stellen ein Leerzeichen (120 000), Prozent ohne Leerzeichen (23%), Uhrzeit 7:15 (Minuten zweistellig), Währung NACH
 * der Zahl mit Leerzeichen („22 złote", „245 PLN", „5 €", „28 $"), keine Ordnungszahl mit Punkt („3. piętro").
 * Ausnahmen, die keine Beträge sind: die feste Excel-Adresse `$B$2` und der Stern als Fussnote an einem Preis.
 */
function zahlFehler(t: string): string[] {
  const f: string[] = [];
  if (/\d %/.test(t)) f.push("Leerzeichen vor %");
  if (/\d[€$]|[€$] ?\d/.test(t.replace(/\$[A-Z]\$\d+/g, ""))) f.push("Währung nicht als „5 €“");
  if (/\d\.\d/.test(t)) f.push("Dezimal- oder Tausenderpunkt");
  if (/\d\. \p{Ll}/u.test(t)) f.push("Ordnungszahl mit Punkt");
  for (const m of t.matchAll(/\d{5,}/g)) f.push(`Zahl ${m[0]} ohne Leerzeichen-Trenner`);
  if (/\b\d{1,3} \d{3}\b/.test(t) && !/\b\d{2,3} 000\b/.test(t)) f.push("Leerzeichen-Trenner unter fünf Stellen");
  for (const m of t.matchAll(/\b(\d{1,2}):(\d+)\b/g)) {
    if (/\b(z|o|do|od)$/.test(t.slice(0, m.index).trim()) || /godzina $/.test(t.slice(0, m.index))) {
      if (m[2].length !== 2 || Number(m[1]) > 23 || Number(m[2]) > 59) f.push(`Uhrzeit ${m[0]}`);
    }
  }
  return f;
}

describe("PL-T9: Form und Zahlen", () => {
  it("Satzanfang gross, Satzschluss am Ende, Leerzeichen richtig, nur erlaubte Zeichen", () => {
    const fehler = ZEILEN.flatMap((t) => formFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Zahlen im Landesbrauch: 1,5 · 6:45 · 23% · 120 000 · 22 złote · 30 € · keine Ordnungszahl mit Punkt", () => {
    const fehler = ZEILEN.flatMap((t) => zahlFehler(t).map((f) => `${f}: ${t}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(ZEILEN.some((t) => /\d,5\b/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\bo \d{1,2}:\d\d\b/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\d{3} 000 zł/.test(t))).toBe(true);
    expect(ZEILEN.some((t) => /\d zł(?!\p{L})/u.test(t))).toBe(true);
  });

  it("jede Zeile besteht die Regeln aller polnischen Zeilen (`helfer/plTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [erwachsen], nurWeg pl, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["erwachsen"]);
      expect(item.nurWeg, item.text).toBe("pl");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });

  it("Gegenprobe: jede Form- und Zahlregel schlägt an", () => {
    for (const t of ["ewa płaci.", "Ewa płaci", "Ewa płaci .", "Ewa \u2013 płaci.", "Raz,dwa.", "ZUS ( zakład) płaci.", "Tak; nie.", "Stawki VAT to: 23% i 8%."]) {
      expect(formFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(formFehler('"Pilne!" pisze szef.')).toEqual([]);
    expect(formFehler("Klamry { } w szablonie.")).toEqual([]);
    expect(formFehler("Zgoda: [x] tak, [ ] nie.")).toEqual([]);
    for (const t of ["Rabat 20 % na buty.", "Bilet kosztuje 30€.", "Bilet kosztuje € 30.", "Kurs 4.25 zł.", "Próg to 120000 zł.", "Próg to 1 200 zł.", "Wizyta o 7:5.", "Biuro na 3. piętrze."]) {
      expect(zahlFehler(t).length, t).toBeGreaterThan(0);
    }
    expect(zahlFehler("O 6:45, za 22 złote, 23% i 1,5 godziny, < 120 000 zł, 30 €, $B$2.")).toEqual([]);
  });
});

// ── Keine Anrede, kein Geschlecht der tippenden Person, keine Feiertage ──────

const ANREDE = /(?<!\p{L})(pan|pani|panie|państwo|pana|panu|panią|państwa|państwu)(?!\p{L})/iu;

/**
 * Die Vergangenheit und der Konditional der ersten und zweiten Person verraten das Geschlecht der Person, die tippt
 * (byłem/byłam, zrobiłeś/zrobiłaś, chciałbym/chciałabym), in der Mehrzahl das der Gruppe (kupiliśmy/kupiłyśmy).
 * Dazu „jestem/jesteś" + Adjektiv und Wörter mit festem Geschlecht über die eigene Person (Muster PL-T6).
 */
const ICH_DU_VERGANGENHEIT = /\p{L}+(łem|łam|łeś|łaś|łbym|łabym|łbyś|łabyś|liśmy|łyśmy|liście|łyście)(?!\p{L})/u;
/** Wörter mit derselben Endung, die kein Verb sind (hasłem = Instr. von hasło). Wächst nur mit gelesenen Formen. */
const KEIN_VERB: ReadonlySet<string> = new Set(["hasłem"]);
const SELBST_MIT_GESCHLECHT = /^(powinienem|powinnam|powinieneś|powinnaś|sam|sama|gotowy|gotowa|zadowolony|zadowolona)$/;
const PRAEPOSITION_NACH_JESTEM = new Set(["na", "w", "we", "z", "ze", "do", "po", "u", "od", "przy", "nad", "pod", "za", "już", "tu", "teraz"]);
function geschlechtFehler(zeile: string): boolean {
  const w = zeile.toLowerCase().match(/\p{L}+/gu) ?? [];
  if (w.some((x) => !KEIN_VERB.has(x) && ICH_DU_VERGANGENHEIT.test(x))) return true;
  if (w.some((x) => SELBST_MIT_GESCHLECHT.test(x))) return true;
  const i = w.findIndex((x) => x === "jestem" || x === "jesteś");
  return i >= 0 && i + 1 < w.length && !PRAEPOSITION_NACH_JESTEM.has(w[i + 1]);
}

/**
 * Feiertage, ihre Bräuche und Speisen gehören EINER Charge, die Johannes erst freigeben muss (Auftrag PL-T9).
 * `świętokrzysk-` (die Woiwodschaft) ist kein Feiertag und wird vorher entfernt.
 */
const FEIERTAG =
  /(wigili|boże narodzeni|bożego narodzeni|wielkanoc|święt|sylwest|nowy rok|andrzejk|zaduszk|tłusty czwartek|śmigus|majówk|11 listopada|3 maja|1 maja|boże ciało|bożego ciała|walentynk|dzień matki|dzień ojca|dzień kobiet|dzień dziecka|imienin|mikołaj|opłat(?!a|ę|y|ą)|pisank|kolęd|choink|pączk|zmartwychwst|wniebowst|trzech króli|popielec|wielki piątek|niepodległoś)/iu;
const feiertagIn = (z: string): boolean => FEIERTAG.test(z.replace(/świętokrzysk/giu, ""));

describe("PL-T9: keine Anrede, kein Geschlecht der tippenden Person, keine Feiertage", () => {
  it("keine Anrede mit Pan/Pani/Państwo (unpersönlich oder „my“)", () => {
    expect(ZEILEN.filter((z) => ANREDE.test(z))).toEqual([]);
  });

  it("keine l-Form der 1./2. Person (auch nicht Mehrzahl), kein „jestem“ + Adjektiv, kein powinienem/sama", () => {
    const fehler = ZEILEN.filter(geschlechtFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("kein Feiertag, kein Feiertagsbrauch (Wigilia, Wielkanoc, Andrzejki, 11 listopada …)", () => {
    expect(ZEILEN.filter(feiertagIn)).toEqual([]);
  });

  it("Gegenprobe: Anrede, Geschlecht und Feiertage werden gefunden - die Gegenbeispiele nicht", () => {
    expect(ANREDE.test("Proszę pani, gdzie jest okienko?")).toBe(true);
    expect(ANREDE.test("Pod Grójcem sadownicy zbierają jabłka.")).toBe(false);
    for (const t of ["Wczoraj byłam w urzędzie.", "Kupiliśmy dom pod Lesznem.", "Chciałbym zmienić pracę.", "Jestem zmęczony.", "Powinnam zadzwonić.", "Mieszkam sama."]) {
      expect(geschlechtFehler(t), t).toBe(true);
    }
    for (const t of ["Paweł po 47 jazdach zdaje egzamin.", "Pod hasłem #Kaszuby.", "Jestem w pracy.", "Teściowa zapisała się na tańce."]) {
      expect(geschlechtFehler(t), t).toBe(false);
    }
    for (const t of ["Na Wigilię jedziemy do Łodzi.", "Urząd jest zamknięty 11 listopada.", "Andrzejki w biurze!", "W tłusty czwartek kupujemy pączki."]) {
      expect(feiertagIn(t), t).toBe(true);
    }
    expect(feiertagIn("Na nową kładkę w Ostrowcu Świętokrzyskim czekano 3 lata.")).toBe(false);
    expect(feiertagIn("Termin płatności faktury za gaz mija 11 lipca.")).toBe(false);
  });
});

// ── Orte, Namen und Grosswörter ─────────────────────────────────────────────

type Raum =
  | "MAL" | "PODH" | "MAZ" | "WM" | "POM" | "KASZ" | "ZPOM" | "PDL" | "KUJ" | "WLK" | "LUB" | "PKR" | "SLA" | "DSL" | "OPO"
  | "SWI" | "LOD" | "LUBU" | "REGION" | "AUSLAND";

/**
 * Orte, Stadtteile, Landschaften, Gewässer (die Wortform, klein) mit ihrem Raum. MAL Małopolska ohne Podhale · PODH
 * Podhale · KASZ Kaszuby · ZPOM Zachodniopomorskie · REGION über mehrere Räume (Odra, Bałtyk, Polska) · AUSLAND.
 * Kleine Adjektive zählen (`toruńska`, `poznańskiej`, `wrocławskie`, `kaszubski`).
 */
const ORTE: Readonly<Record<string, Raum>> = {
  krakowie: "MAL", krakowa: "MAL", kraków: "MAL", tarnowie: "MAL", tarnów: "MAL", gorlicach: "MAL", huty: "MAL",
  zakopanego: "PODH",
  warszawy: "MAZ", warszawie: "MAZ", płocku: "MAZ", mokotowie: "MAZ", radomiu: "MAZ", ostrołęce: "MAZ", siedlcach: "MAZ",
  iławie: "WM", olsztynie: "WM", olsztyna: "WM", olsztyn: "WM", ełku: "WM", mrągowie: "WM", ostródzie: "WM", elblągowi: "WM",
  mierzei: "WM",
  sopocie: "POM", operze: "POM", gdańsku: "POM", gdańska: "POM", gdyni: "POM", słupska: "POM", tczewa: "POM",
  kościerzynie: "KASZ", kartuzami: "KASZ", kaszubach: "KASZ", kaszubski: "KASZ",
  szczecinie: "ZPOM", szczecina: "ZPOM", koszalinie: "ZPOM", stargardu: "ZPOM", kołobrzegu: "ZPOM", policach: "ZPOM",
  białegostoku: "PDL", hajnówką: "PDL", hajnówce: "PDL", łomżą: "PDL", łomży: "PDL", suwałk: "PDL", suwałkach: "PDL",
  augustowa: "PDL", augustowie: "PDL",
  bydgoszczy: "KUJ", borach: "KUJ", toruńska: "KUJ", toruniu: "KUJ", torunia: "KUJ", inowrocławiu: "KUJ", włocławka: "KUJ",
  grudziądzu: "KUJ",
  lesznie: "WLK", lesznem: "WLK", leszna: "WLK", kaliszu: "WLK", pile: "WLK", poznańskiej: "WLK", gnieźnie: "WLK",
  gniezna: "WLK", poznaniu: "WLK", koninie: "WLK",
  zamościu: "LUB", puławach: "LUB", lublinie: "LUB", lublina: "LUB", czechowie: "LUB", kazimierzu: "LUB",
  rzeszowie: "PKR", rzeszowa: "PKR", rzeszów: "PKR", sanoka: "PKR", sanoku: "PKR", soliną: "PKR", przemyśla: "PKR",
  przemyśl: "PKR", bieszczady: "PKR", ustrzyki: "PKR", wetlina: "PKR", mielcu: "PKR", stalowej: "PKR", stalową: "PKR",
  niskiem: "PKR", krośnie: "PKR",
  gliwicach: "SLA", tychach: "SLA", bielsku: "SLA", białej: "SLA", śląsku: "SLA", katowicach: "SLA", bytomiu: "SLA",
  pyrzowicach: "SLA", sosnowcu: "SLA", częstochowie: "SLA", zabrzu: "SLA", rybniku: "SLA",
  wałbrzycha: "DSL", wałbrzychem: "DSL", wałbrzychu: "DSL", legnicy: "DSL", świdnicy: "DSL", jeleniej: "DSL",
  bolesławca: "DSL", kłodzku: "DSL", wrocławia: "DSL", oleśnicy: "DSL", wrocławskie: "DSL",
  opolu: "OPO", nysie: "OPO", kędzierzyn: "OPO", koźle: "OPO", kluczborku: "OPO",
  kielcach: "SWI", kielc: "SWI", busku: "SWI", ostrowcu: "SWI", starachowic: "SWI", sandomierzem: "SWI",
  bałutach: "LOD", łowiczu: "LOD", retkini: "LOD", sieradzu: "LOD", łodzi: "LOD", piotrkowa: "LOD", skierniewic: "LOD",
  słubicami: "LUBU", gorzowa: "LUBU", gorzowie: "LUBU", zielonej: "LUBU",
  odrą: "REGION", bałtyk: "REGION", polski: "REGION", polska: "REGION",
  frankfurtem: "AUSLAND", norwegii: "AUSLAND", londynie: "AUSLAND", londynu: "AUSLAND", wilnie: "AUSLAND", chicago: "AUSLAND",
  jorku: "AUSLAND", toronto: "AUSLAND", teksasie: "AUSLAND", berlina: "AUSLAND", hamburga: "AUSLAND", wiedniu: "AUSLAND",
  holandii: "AUSLAND", dublinie: "AUSLAND", chorwacji: "AUSLAND", irlandii: "AUSLAND", rzymu: "AUSLAND", rusi: "AUSLAND",
  rosji: "AUSLAND",
};

/** Grossgeschriebene Teile von Orts-, Strassen- und Amtsnamen, die selbst kein Ort sind (Nowa Huta, Opera Leśna, ZUS …). */
const NAMENSTEILE = new Set([
  "nowej", "leśnej", "tucholskich", "wiślanej", "góry", "górze", "dolnym", "zdroju", "świętokrzyskim",
  "woli", "wolę", "nowego", "lipowej", "słonecznej", "wiejska", "ubezpieczeń", "społecznych", "fundusz",
  "zdrowia", "wybrzeże",
]);

/**
 * Menschen, Firmen, Titel, Ämter und Abkürzungen (klein): Frauen und Männer gleichwertig, Namen aus Polen und der
 * Ukraine (Ołena, Mykoła - sachlich); Titel (Chłopi - Reymont, Miś - Bareja, Próby - Montaigne/Boy-Żeleński, Ulisses -
 * Joyce); fiktive Firmen mit & (Nowak & Syn …); Ämter und Programme (ZUS, NFZ, PPK, BHP, PIT, Twój e-PIT, BLIK, SOR,
 * CRP, OC, VAT, CV, SMS, FV, PLN); Tasten (Enter); die Führerscheinklasse B.
 */
const NAMEN = new Set(
  (
    "agnieszki marek marka jadwidze ewa ewy ołeny doroty joanny kuba mykoła agata zenon oliwer kasia henrykowi józef " +
    "paweł jacek maja ania kamil basia nowak syn kowalczyk wspólnicy las woda mazur lis dom ogród stal drewno róża wino " +
    "chłopów reymonta miś barei kopernik montaigne'a boy żeleński oscara wilde'a mcdonald'sie ulissesa joyce'a hume'a " +
    "braille'a gaulle'a twój pit blik zus nfz ppk vat bhp oc crp sor sms pln enter b"
  ).split(" "),
);

/** Technische Wörter (Adressen, Pfade, Rechnungen, Formeln) - sie werden nicht als Wörter geprüft, die Stimme liest Zeichen. */
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
/**
 * GEMESSEN am Ende von PL-T9: 151 Zeilen verortet (ohne Zeilen nur mit Odra/Bałtyk/Polska oder Ausland); je Woiwodschaft
 * 6 (Lubuskie) bis 14 (Podkarpackie, Śląskie) - Wielkopolska stand im Entwurf bei 18 und wurde auf 13 verteilt.
 */
const MINDESTENS_VERORTET = 151;
const HOECHSTENS_JE_RAUM = 14;
const MINDESTENS_JE_WOIWODSCHAFT = 6;

describe("PL-T9: Orte aus ganz Polen, keine Region gehäuft", () => {
  it("jedes grossgeschriebene Wort mitten im Satz ist ein bekannter Ort, Name oder Namensteil", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it(`alle 16 Woiwodschaften je mindestens ${MINDESTENS_JE_WOIWODSCHAFT} Zeilen; kein Raum über ${HOECHSTENS_JE_RAUM}; mindestens ${MINDESTENS_VERORTET} Zeilen verortet`, () => {
    const v = verteilung(ZEILEN);
    const proWoi = WOIWODSCHAFTEN.map((rs) => [rs.join("+"), ZEILEN.filter((z) => [...raeumeIn(z)].some((r) => rs.includes(r))).length] as const);
    expect(proWoi.filter(([, n]) => n < MINDESTENS_JE_WOIWODSCHAFT).map(([r, n]) => `${r}: ${n}`)).toEqual([]);
    expect([...v].filter(([r, n]) => r !== "verortet" && n > HOECHSTENS_JE_RAUM).map(([r, n]) => `${r}: ${n}`)).toEqual([]);
    expect(v.get("verortet") ?? 0, proWoi.map(([r, n]) => `${r}:${n}`).join(" ")).toBeGreaterThanOrEqual(MINDESTENS_VERORTET);
  });

  it("€ steht nur in Zeilen über das Ausland oder ohne Ort - nie mit einem Ort in Polen", () => {
    const euro = ZEILEN.filter((z) => z.includes("€"));
    expect(euro.length).toBeGreaterThanOrEqual(8);
    const polnischerOrt = (z: string) => [...raeumeIn(z)].some((r) => r !== "AUSLAND" && r !== "REGION");
    expect(euro.filter(polnischerOrt)).toEqual([]);
  });

  it("Gegenprobe: unbekannte Grosswörter, Bindestrich-Orte, Anführung und Satzanfänge werden richtig gelesen", () => {
    expect(unbekannteGrosswoerter("Ewa jedzie do Atlantydy.")).toEqual(["Atlantydy"]);
    expect(unbekannteGrosswoerter("W Bielsku-Białej pada.")).toEqual([]);
    expect(unbekannteGrosswoerter("W Bielsku-Atlantydzie pada.")).toEqual(["Atlantydzie"]);
    expect(unbekannteGrosswoerter('"Pilne!" pisze Marek.')).toEqual([]);
    expect(unbekannteGrosswoerter("Pada? Jutro nie.")).toEqual([]);
    expect(unbekannteGrosswoerter("Pada i Jutro nie.")).toEqual(["Jutro"]);
    expect(raeumeIn("Teściowie z Jeleniej Góry.")).toEqual(new Set(["DSL"]));
    expect(verteilung(Array.from({ length: 15 }, (_, i) => `W Opolu ${"abcdefghijklmno"[i]}.`)).get("OPO")).toBe(15);
    expect(["W Gdańsku kawa kosztuje 4 €."].filter((z) => [...raeumeIn(z)].some((r) => r !== "AUSLAND" && r !== "REGION"))).toHaveLength(1);
  });
});

// ── Gekürzt serviert: kein grosses Wort mitten im Satz ─────────────────────

/**
 * Für Weg „pl" gibt es keine Frühfassungen (`scripts/_fruehfassung.mts` liest nur de/en/fr/es). Wird eine Zeile vor
 * ihrer vollen Sprosse gekürzt serviert, fällt mit `? ! " :` auch die Satzgrenze weg - ein Wort, das danach gross
 * steht, stünde mitten im Satz. Darum steht dort nur ein Name, Ort oder Titel (Naht-Regel aus PL-T7).
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

describe("PL-T9: gekürzt serviert - kein Grossbuchstabe mitten im Satz", () => {
  it("jede Zeile, die vor ihrer Sprosse gekürzt kommt, liest sich ohne Grosswort mitten im Satz", () => {
    const fehler = ZEILEN.flatMap((z) => fruehNahtFehler(z).map((f) => `"${z}" @ ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: „Kasjerka pyta: \"Płaci kartą?\"“ würde vor „:“ zu „Kasjerka pyta Płaci kartą“", () => {
    expect(fruehNahtFehler('Kasjerka pyta: "Płaci kartą?"').length).toBeGreaterThan(0);
    expect(fruehNahtFehler('"Płatność kartą czy gotówką?" pyta kasjerka w sklepie w Łowiczu.')).toEqual([]);
    expect(fitText("Czy ten pociąg zatrzymuje się w Iławie?", allowedAt(sprosseVon("q")), "pl")).toBe("Czy ten pociąg zatrzymuje się w Iławie");
  });
});

// ── Wortschatz: Wortgrenze 8 über T3 + T6 + T9, Sperrliste, Wortbasis, Ogonek-Zwillinge ──

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht (Liste aus PL-T4/T7). */
const FUNKTIONSWOERTER = new Set(
  (
    "a i w we z ze na do od o po za nad pod przed dla jak to ten ta te tak nie się mi mnie ja ty on ona ono my wy " +
    "oni one jest są ma mam masz mamy czy co oraz lub ale no był była było byli były że już też go jej jego ich mu ją " +
    "bo u przy przez bez nam nas mu"
  ).split(" "),
);
/** Inhaltswörter einer Zeile, klein, nur Buchstabenfolgen (Ziffern und Zeichen fallen weg; „zł" und „PLN" zählen mit). */
const inhaltswoerter = (z: string): Set<string> =>
  new Set((z.toLowerCase().match(/\p{L}+/gu) ?? []).filter((w) => !FUNKTIONSWOERTER.has(w)));

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) for (const w of inhaltswoerter(z)) n.set(w, (n.get(w) ?? 0) + 1);
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}
const zeilenMit = (zeilen: string[], wort: string): number => zeilen.filter((z) => inhaltswoerter(z).has(wort)).length;

/** Der Wortschatz VOR dieser Charge (Übungswörter, Stufen-Wortschatz, Lexikon-Nachtrag aus Tatoeba ≥ 2 Belegen). */
const BASIS: ReadonlySet<string> = new Set([
  ...WORDS_PL,
  ...Object.values(STUFE_VOCAB_PL).flat(),
  ...NACHTRAG_PL,
  ...NACHTRAG_PL_ERGAENZT,
]);
/**
 * Dazu die Wörter der früheren pl-Chargen (T1-T7): jedes steht dort schon in einer gelesenen Zeile, und ihr Wächter
 * führt es in seiner Liste `VON_HAND_BELEGT` mit Begründung (oder es stand in der Wortbasis).
 */
const FRUEHERE_PL_WOERTER: ReadonlySet<string> = new Set(ANDERE_PL_ZEILEN.flatMap((z) => z.toLowerCase().match(/[\p{L}']+/gu) ?? []));

/**
 * Wörter dieser Charge, die weder im Wortschatz noch in einer früheren pl-Charge standen und weder Ort noch Name sind
 * (ein Wörterbuch-Beleg fehlt für Polnisch, Falle 61). Jede ist eine gewöhnliche Form eines Standardworts; die
 * Begründung steht daneben. Über den Korpus kommen sie ins Vorlese-Lexikon.
 * ⚠️ Von keiner Person mit Polnisch als Erstsprache gelesen (Befund §4).
 */
const VON_HAND_BELEGT: Readonly<Record<string, string>> = {
  abonament: "Nom. Sg. (Handyvertrag)",
  adresami: "Instr. Pl. von adres",
  arów: "Gen. Pl. von ar (Flächenmass, 100 m2)",
  autobusowa: "Adjektiv f. (linia autobusowa)",
  bilans: "Nom. Sg. (Bilanz)",
  biurach: "Lok. Pl. von biuro",
  biurowca: "Gen. Sg. von biurowiec (Bürogebäude)",
  biurowcu: "Lok. Sg. von biurowiec",
  blokach: "Lok. Pl. von blok (Wohnblock)",
  blokiem: "Instr. Sg. von blok",
  bramą: "Instr. Sg. von brama",
  brutto: "indeklinabel (Bruttobetrag)",
  budowlana: "Adjektiv f. (działka budowlana, Bauland)",
  butami: "Instr. Pl. von but",
  cebulą: "Instr. Sg. von cebula",
  ceramikę: "Akk. Sg. von ceramika",
  certyfikatem: "Instr. Sg. von certyfikat",
  ciśnienia: "Gen. Sg. von ciśnienie (Blutdruck)",
  cywilnego: "Adjektiv Gen. Sg. (urząd stanu cywilnego, Standesamt)",
  czekano: "unpersönliche Vergangenheit von czekać",
  czytnikiem: "Instr. Sg. von czytnik (czytnik ekranu, Bildschirmleser)",
  deklaracje: "Akk. Pl. von deklaracja (Steuererklärungen)",
  delegacja: "Nom. Sg. (Dienstreise)",
  dochodzie: "Lok. Sg. von dochód (Einkommen)",
  dojazdem: "Instr. Sg. von dojazd",
  dojazdy: "Akk. Pl. von dojazd (Pendeln)",
  dojeżdżamy: "1. Pl. von dojeżdżać",
  domofon: "Nom. Sg. (Gegensprechanlage)",
  domofony: "Akk. Pl. von domofon",
  dopisek: "Nom. Sg. (Vermerk)",
  dopłatę: "Akk. Sg. von dopłata (Zuschuss)",
  dorabiać: "Infinitiv (dazuverdienen)",
  doradcą: "Instr. Sg. von doradca",
  dorosłej: "Adjektiv Gen. Sg. f. (osoba dorosła)",
  dozorcę: "Akk. Sg. von dozorca (Hausmeister)",
  dyktowaniu: "Lok. Sg. von dyktowanie",
  dyskusyjnym: "Adjektiv Lok. Sg. m. (klub dyskusyjny)",
  dyżurów: "Gen. Pl. von dyżur",
  działkowy: "Adjektiv m. (ogródek działkowy, Schrebergarten)",
  dzielimy: "1. Pl. von dzielić",
  emerytowana: "Partizip f. (im Ruhestand)",
  endokrynologa: "Gen. Sg. von endokrynolog",
  esemesa: "Gen. Sg. von esemes (SMS, PWN-Schreibung)",
  faktur: "Gen. Pl. von faktura",
  fakturą: "Instr. Sg. von faktura",
  filtrujemy: "1. Pl. von filtrować",
  funt: "Nom. Sg. (Pfund Sterling)",
  gabarytowa: "Adjektiv f. (przesyłka gabarytowa, sperriges Paket)",
  galerią: "Instr. Sg. von galeria (galeria handlowa, Einkaufszentrum)",
  gazetce: "Lok. Sg. von gazetka (Werbeprospekt)",
  gazowej: "Adjektiv Gen. Sg. f. (instalacja gazowa)",
  gołoledź: "Nom. Sg. (Glatteis)",
  gratulujemy: "1. Pl. von gratulować",
  grzybobranie: "Akk. Sg. (Pilzesammeln)",
  gwara: "Nom. Sg. (Mundart)",
  gwarze: "Lok. Sg. von gwara",
  handlową: "Adjektiv Instr. Sg. f. (galeria handlowa)",
  hasłem: "Instr. Sg. von hasło (Losung)",
  hektarów: "Gen. Pl. von hektar",
  hospicjum: "Akk. Sg. (im Singular indeklinabel)",
  hucie: "Lok. Sg. von huta (Hütte, Stahlwerk)",
  hurtownia: "Nom. Sg. (Grosshandel)",
  hutę: "Akk. Sg. von huta",
  identyfikator: "Akk. Sg. (Kennung)",
  iem: "Endung nach Bindestrich bei einer Abkürzung (BLIK-iem, Instr. Sg.; PWN-Regel)",
  infolinii: "Lok. Sg. von infolinia (Hotline)",
  instalacji: "Gen. Sg. von instalacja",
  izba: "Nom. Sg. (Kammer des Parlaments)",
  jajkach: "Lok. Pl. von jajko",
  jazdach: "Lok. Pl. von jazda (Fahrstunde)",
  kadrowy: "Adjektiv m. (system kadrowy, Personalsystem)",
  kadrowym: "Adjektiv Lok. Sg. m.",
  kancelaria: "Nom. Sg. (Kanzlei)",
  kantor: "Nom. Sg. (Wechselstube)",
  karcie: "Lok. Sg. von karta (SIM-Karte)",
  kardiolog: "Nom. Sg.",
  kasjerka: "Nom. Sg. (Kassiererin)",
  kasowe: "Adjektiv n. (okienko kasowe)",
  kefir: "Nom. Sg.",
  kierowców: "Gen. Pl. von kierowca",
  kierunkowy: "Adjektiv m. (numer kierunkowy, Vorwahl)",
  kiszonych: "Adjektiv Gen. Pl. (kiszone ogórki, Salzgurken)",
  klatek: "Gen. Pl. von klatka (klatka schodowa, Treppenhaus)",
  klawiszem: "Instr. Sg. von klawisz",
  kleszcze: "Akk. Pl. von kleszcz (Zecke)",
  kodem: "Instr. Sg. von kod",
  kolumna: "Nom. Sg. (Tabellenspalte)",
  konsultacje: "Nom. Pl. von konsultacja (Bürgeranhörung)",
  konsultanta: "Gen. Sg. von konsultant",
  krzyżykiem: "Instr. Sg. von krzyżyk (Rautetaste #)",
  księgowej: "Gen. Sg. von księgowa (Buchhalterin)",
  kwadratowego: "Adjektiv Gen. Sg. m.",
  kwalifikacyjnej: "Adjektiv Lok. Sg. f. (rozmowa kwalifikacyjna, Vorstellungsgespräch)",
  kwartalna: "Adjektiv f. (premia kwartalna)",
  kwh: "Einheitenzeichen kWh (Kilowattstunde)",
  kąpiele: "Akk. Pl. von kąpiel (Kurbäder)",
  kładkę: "Akk. Sg. von kładka (Fussgängerbrücke)",
  lekarka: "Nom. Sg. (Ärztin)",
  liczniku: "Lok. Sg. von licznik (Kilometerzähler)",
  limit: "Nom. Sg.",
  lokale: "Akk. Pl. von lokal (Wohneinheit, Sprache der Verwaltung)",
  lokali: "Gen. Pl. von lokal",
  lokaty: "Gen. Sg. von lokata (Festgeld)",
  magazyniera: "Gen./Akk. Sg. von magazynier (Lagerist)",
  mailu: "Lok. Sg. von mail",
  makiem: "Instr. Sg. von mak (Mohn)",
  małpą: "Instr. Sg. von małpa (Name des Zeichens @)",
  mediami: "Instr. Pl. von media (Nebenkosten: Strom, Wasser, Gas)",
  mierzy: "3. Sg. von mierzyć",
  mlecznego: "Adjektiv Gen. Sg. m. (bar mleczny)",
  mobywatelu: "Lok. Sg. von mObywatel (staatliche App)",
  modra: "Adjektiv f. (modra kapusta, schlesisch für Rotkohl)",
  mrówkowiec: "Nom. Sg. (grosser Plattenbau, umgangssprachlich)",
  nagłówku: "Lok. Sg. von nagłówek (Briefkopf)",
  najemcy: "Gen. Sg. von najemca (Mieter)",
  neurologa: "Gen. Sg. von neurolog",
  niecałe: "Adjektiv Pl. (knapp)",
  nieokreślony: "Adjektiv m. (umowa na czas nieokreślony, unbefristet)",
  norma: "Nom. Sg.",
  numerek: "Akk. Sg. (Wartenummer, Verkleinerung von numer)",
  numerkiem: "Instr. Sg. von numerek",
  obuwniczym: "Adjektiv Lok. Sg. m. (sklep obuwniczy, Schuhgeschäft)",
  obwodnicę: "Akk. Sg. von obwodnica (Umgehungsstrasse)",
  odhaczamy: "1. Pl. von odhaczać (abhaken)",
  odjazdów: "Gen. Pl. von odjazd",
  odnawia: "3. Sg. von odnawiać (odnawia się, wird erneuert)",
  odprawa: "Nom. Sg. (Check-in am Flughafen)",
  odprawę: "Akk. Sg. von odprawa (Dienstbesprechung)",
  odwołania: "Gen. Sg. von odwołanie (do odwołania, bis auf Weiteres)",
  ofercie: "Lok. Sg. von oferta",
  ogłoszeniu: "Lok. Sg. von ogłoszenie",
  okienka: "Gen. Sg. von okienko (Schalter)",
  opakowaniach: "Lok. Pl. von opakowanie",
  opodatkowuje: "3. Sg. von opodatkowywać (opodatkowuje się, wird besteuert)",
  oprocentowanie: "Nom. Sg. (Verzinsung)",
  ortopeda: "Nom. Sg.",
  paczce: "Lok. Sg. von paczka (hier: Dateipaket)",
  paczkomat: "Nom. Sg. (Paketautomat)",
  pakujemy: "1. Pl. von pakować",
  paneli: "Gen. Pl. von panel (Solarmodule)",
  paragonie: "Lok. Sg. von paragon (Kassenbon)",
  parter: "Nom. Sg. (Erdgeschoss)",
  pensjonat: "Nom. Sg. (Pension)",
  pieca: "Gen. Sg. von piec (Heizkessel)",
  piekarnię: "Akk. Sg. von piekarnia",
  pielęgnacyjny: "Adjektiv m. (dodatek pielęgnacyjny, Pflegezuschlag)",
  pielęgniarek: "Gen. Pl. von pielęgniarka",
  pisownię: "Akk. Sg. von pisownia (Rechtschreibung)",
  plecaki: "Nom. Pl. von plecak",
  plyndze: "Posener Mundartwort für placki ziemniaczane (Pl.)",
  pobrań: "Gen. Pl. von pobranie (punkt pobrań, Blutabnahmestelle)",
  podatkowy: "Adjektiv m. (próg podatkowy)",
  podawaj: "Imperativ 2. Sg. von podawać",
  podchodzimy: "1. Pl. von podchodzić",
  podpisana: "Partizip f. von podpisać",
  podpisów: "Gen. Pl. von podpis",
  podstawowy: "Adjektiv m.",
  podziemny: "Adjektiv m.",
  polonia: "Nom. Sg. (Polonia, die Polen im Ausland)",
  pomiar: "Nom. Sg. (Messung)",
  poradni: "Lok. Sg. von poradnia (Fachambulanz)",
  poradnie: "Nom. Pl. von poradnia",
  połoniny: "Nom. Pl. von połonina (Bergwiesen der Bieszczady)",
  prawnuczkę: "Akk. Sg. von prawnuczka (Urenkelin)",
  premia: "Nom. Sg. (Prämie)",
  promocję: "Akk. Sg. von promocja",
  przedłużona: "Partizip f. von przedłużyć",
  przekop: "Nom. Sg. (Durchstich)",
  przekwalifikował: "3. Sg. m. Präteritum von przekwalifikować się (Józef)",
  przepracował: "3. Sg. m. Präteritum von przepracować (ojciec)",
  przetwarzanie: "Akk. Sg. (przetwarzanie danych, Datenverarbeitung)",
  przychodnia: "Nom. Sg. (Ambulanz)",
  przypomnienia: "Akk. Pl. von przypomnienie",
  przyznaniu: "Lok. Sg. von przyznanie",
  próg: "Nom. Sg. (Steuerstufe)",
  rachunkowe: "Adjektiv n. (biuro rachunkowe, Buchhaltungsbüro)",
  raty: "Akk. Pl. von rata",
  ratę: "Akk. Sg. von rata",
  refunduje: "3. Sg. von refundować (erstattet)",
  rehabilitację: "Akk. Sg. von rehabilitacja",
  remontowa: "Adjektiv f. (ekipa remontowa)",
  renty: "Akk. Pl. von renta",
  rondzie: "Lok. Sg. von rondo",
  rozlicza: "3. Sg. von rozliczać",
  rozliczenie: "Nom. Sg. (Abrechnung)",
  rozprawę: "Akk. Sg. von rozprawa (Gerichtsverhandlung)",
  rozłożyć: "Infinitiv (na raty rozłożyć)",
  sadem: "Instr. Sg. von sad (Obstgarten)",
  sadu: "Gen. Sg. von sad",
  saunę: "Akk. Sg. von sauna",
  schodowych: "Adjektiv Gen. Pl. (klatka schodowa)",
  sejm: "Nom. Sg. (Sejm, das Parlament)",
  siarczkowe: "Adjektiv Pl. (kąpiele siarczkowe, Schwefelbäder)",
  skan: "Akk. Sg. (Scan)",
  skany: "Nom. Pl. von skan",
  skierowania: "Akk. Pl. von skierowanie (Überweisung)",
  składkę: "Akk. Sg. von składka (Beitrag)",
  smartfona: "Gen. Sg. von smartfon (PWN-Schreibung)",
  spadkowych: "Adjektiv Lok. Pl. (sprawy spadkowe, Erbsachen)",
  sportowa: "Adjektiv f. (karta sportowa, Sportkarte vom Arbeitgeber)",
  sprzątania: "Gen. Sg. von sprzątanie",
  spłacimy: "1. Pl. Futur von spłacić",
  stawką: "Instr. Sg. von stawka (Steuersatz)",
  stażu: "Gen. Sg. von staż (staż małżeński, Ehejahre)",
  stomatologiczny: "Adjektiv m. (gabinet stomatologiczny)",
  strzałki: "Nom. Pl. von strzałka (Wegweiserpfeile)",
  studnią: "Instr. Sg. von studnia",
  stówy: "Akk. Pl. von stówa (umgangssprachlich: 100 zł)",
  sześćdziesiątce: "Lok. Sg. von sześćdziesiątka (po sześćdziesiątce, über 60)",
  słoików: "Gen. Pl. von słoik (Einmachglas)",
  tagiem: "Instr. Sg. von tag (Schlagwort)",
  teściowie: "Nom. Pl. von teść (Schwiegereltern)",
  teść: "Nom. Sg. (Schwiegervater)",
  tomata: "schlesisches Mundartwort für pomidor",
  trafiają: "3. Pl. von trafiać",
  tramwaju: "Lok. Sg. von tramwaj",
  turystykę: "Akk. Sg. von turystyka",
  uchwala: "3. Sg. von uchwalać (beschliesst)",
  ukraińska: "Adjektiv f. (polsko-ukraińska rodzina)",
  urzędniczka: "Nom. Sg. (Beamtin)",
  ustalono: "unpersönliche Vergangenheit von ustalić",
  uzupełnia: "3. Sg. von uzupełniać (uzupełnia się, füllt sich aus)",
  wakacyjnego: "Adjektiv Gen. Sg. m. (rozkład wakacyjny)",
  wcześniejszym: "Adjektiv Lok. Sg. m. (po wcześniejszym zapisie)",
  widłowy: "Adjektiv m. (wózek widłowy, Gabelstapler)",
  wielkogabarytowych: "Adjektiv Gen. Pl. (śmieci wielkogabarytowe, Sperrmüll)",
  wieżowca: "Gen. Sg. von wieżowiec (Hochhaus)",
  wnuczki: "Gen. Sg. von wnuczka",
  województw: "Gen. Pl. von województwo",
  wpłaca: "3. Sg. von wpłacać",
  wspólnoty: "Gen. Sg. von wspólnota (Eigentümergemeinschaft)",
  wtorkowe: "Adjektiv n. (wtorkowe zebranie)",
  wyczerpania: "Gen. Sg. von wyczerpanie (do wyczerpania zapasów, solange der Vorrat reicht)",
  wymianą: "Instr. Sg. von wymiana",
  wynagrodzenie: "Nom. Sg. (Lohn)",
  wynajmuje: "3. Sg. von wynajmować",
  wypowiedzenia: "Gen. Sg. von wypowiedzenie (Kündigung)",
  wyprowadzce: "Lok. Sg. von wyprowadzka (Auszug)",
  wypłaca: "3. Sg. von wypłacać",
  wytłoczona: "Partizip f. von wytłoczyć (geprägt)",
  wyłączy: "3. Sg. Futur von wyłączyć",
  wózek: "Nom. Sg. (wózek widłowy)",
  zaczęto: "unpersönliche Vergangenheit von zacząć",
  zakładach: "Lok. Pl. von zakład (Werk; Zakłady Chemiczne Police)",
  zakładową: "Adjektiv Akk. Sg. f. (wycieczka zakładowa, Betriebsausflug)",
  zalaniu: "Lok. Sg. von zalanie (Wasserschaden)",
  zapasowa: "Adjektiv f. (kopia zapasowa, Sicherungskopie)",
  zapasów: "Gen. Pl. von zapas",
  zapisie: "Lok. Sg. von zapis (Anmeldung)",
  zapłacono: "unpersönliche Vergangenheit von zapłacić",
  zarobkach: "Lok. Pl. von zarobki (Verdienst)",
  zasiłku: "Gen. Sg. von zasiłek",
  zatwierdź: "Imperativ 2. Sg. von zatwierdzić",
  zaznaczamy: "1. Pl. von zaznaczać (ankreuzen)",
  zbiórka: "Nom. Sg. (Treffpunkt)",
  zdalna: "Adjektiv f. (praca zdalna, Homeoffice)",
  zgłaszamy: "1. Pl. von zgłaszać (zgłaszamy się, wir melden uns)",
  zleceniu: "Lok. Sg. von zlecenie (przy umowie-zleceniu)",
  zostawiajcie: "Imperativ 2. Pl. von zostawiać",
  zwołuje: "3. Sg. von zwoływać",
  złotówki: "Gen. Sg. von złotówka (umgangssprachlich: Złoty)",
  świadczenie: "Nom. Sg. (Sozialleistung)",
  świetlica: "Nom. Sg. (Hort in der Schule)",
  żłobek: "Nom. Sg. (Kinderkrippe)",
  żłobka: "Gen. Sg. von żłobek",
};

/** Die Wörter einer Zeile für Sperrliste, Wortbasis und Stimme (ohne technische Wörter, Bindestrich-Teile einzeln). */
const pruefWoerter = (zeile: string): string[] => woerterMitAnfang(zeile).map((x) => x.w);

const bekannt = (w: string): boolean =>
  BASIS.has(w) || FRUEHERE_PL_WOERTER.has(w) || w in VON_HAND_BELEGT || w in ORTE || NAMEN.has(w) || NAMENSTEILE.has(w);

function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) for (const w of pruefWoerter(z)) if (w.length >= 2 && !bekannt(w.toLowerCase())) out.add(w.toLowerCase());
  return [...out];
}

/** „Ogonek-Zwillinge" (PL-T1 §4): Formen ohne Ogonek, deren Form MIT Ogonek ebenfalls ein Wort ist (paczka/pączka, ze/że). */
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
  "Czy przychodnia na Bałutach przyjmuje bez rejestracji?",
  "Kto zaopiekuje się psem, gdy pojedziemy na wesele do Sanoka?",
  "Czy ten pociąg zatrzymuje się w Iławie?",
  "Czy babcia dostanie dodatek pielęgnacyjny?",
  "Czy świetlica w szkole w Kaliszu ma jeszcze wolne miejsca?",
  "Czy w Opolu działa nocna pomoc lekarska?",
  "Uwaga, jutro rano nie będzie ciepłej wody!",
  "Nareszcie przyszła decyzja o przyznaniu zasiłku!",
  "Uwaga, ślisko przy wejściu do biurowca!",
  "Dzięki sąsiadowi pralka już stoi na czwartym piętrze!",
  "Uwaga na kleszcze w lasach pod Hajnówką!",
  "Jaka piękna pogoda na grzybobranie w Borach Tucholskich!",
  "Ewa pracuje na umowę-zlecenie w sklepie z butami w Nysie.",
  "Praca zdalna - dwa razy w tygodniu - to dziś w biurach norma.",
  "Konsultacje w sprawie nowego parkingu - w środę w ratuszu w Pile.",
  "Ośrodek zdrowia w gminie - mały, ale dobry - przyjmuje także w soboty.",
  "Polsko-ukraińska rodzina z Przemyśla prowadzi tam piekarnię.",
  "Wrocławskie tramwaje - jak zawsze latem - jeżdżą według wakacyjnego rozkładu.",
  "\"Proszę wziąć głęboki oddech\" - mówi lekarka w przychodni w Ostrołęce.",
  "\"Zakaz parkowania\" - taka tabliczka stoi przed naszą bramą.",
  "Kierownik pisze w mailu \"pilne\", a potem nie odpisuje przez tydzień.",
  "\"Najpierw kawa, potem maile\" - to zasada Doroty z działu kadr.",
  "Uwaga: od poniedziałku przychodnia przyjmuje tylko po wcześniejszym zapisie.",
  "Ogłoszenie: sprzedam rower miejski, stan dobry, odbiór w Gnieźnie.",
  "Menu baru mlecznego w Krakowie: pierogi, naleśniki i zupa pomidorowa.",
  "Wymagania: prawo jazdy kategorii B i dobra znajomość angielskiego.",
  "Teściowa (ranny ptaszek) dzwoni zawsze przed siódmą.",
  "Nasza wspólnota (czterdzieści lokali) zatrudnia jednego dozorcę.",
  "Przekop Mierzei Wiślanej (otwarty niedawno) daje Elblągowi drogę na Bałtyk.",
  "Teatr Wybrzeże w Gdańsku gra sztukę Oscara Wilde'a.",
  "Wizyta u kardiologa w Sieradzu jest 11 stycznia.",
  "Zebranie wspólnoty trwało 2 godziny i nic nie ustalono.",
  "Teść spod Gorzowa ma 12 uli i sprzedaje miód.",
  "Babcia bierze 3 tabletki dziennie: rano, w południe i wieczorem.",
  "Paczka z Gdańska do Słupska idzie zwykle 1 albo 2 dni, nie 3.",
  "Firma w Mielcu szuka 4 spawaczy na nocną zmianę.",
  "W przychodni w Hajnówce lekarz rodzinny przyjmuje 4 razy w tygodniu.",
  "Zmiana trwa 12 godzin, potem są 24 godziny wolnego.",
  "Ciocia z Augustowa wynajmuje latem 4 pokoje turystom.",
  "Nowa linia autobusowa 36 łączy Stalową Wolę z Niskiem.",
  "Maja kończy 16 lat i chce dorabiać w wakacje.",
  "W Gorlicach na pierwszej zmianie pracuje się od 7 do 15.",
  "Paweł po 47 jazdach zdaje egzamin na motocykl.",
  "Codziennie dojeżdżamy ze Starachowic do Kielc, 47 kilometrów w jedną stronę.",
  "Wizyta w poradni w Kaliszu: 17 maja, godzina 7:45.",
  "Ciocia z Łomży piecze sękacz na 27 jajkach.",
  "Zebranie rodziców w szkole w Ełku jest o 17:15.",
  "Ortopeda przyjmuje we wtorki od 8 do 14.",
  "Na rehabilitację kolana w Wałbrzychu czekamy do 28 maja.",
  "Do żłobka dzwonimy przed 8, bo potem linia jest zajęta.",
  "Kurier dostarcza paczki między 9 a 19.",
  "Basen w Gorzowie jest w niedziele czynny do 19.",
  "Pierwsza rata nowego kredytu: 1949 PLN.",
  "Mama chodzi na zajęcia z obsługi smartfona, 9 spotkań w bibliotece.",
  "Pociąg ze Skierniewic do Warszawy odjeżdża o 6:39.",
  "Lekarz rodzinny przyjmuje od 7:30 do 15:00.",
  "Rodzice pod Sandomierzem mają 40 arów sadu.",
  "Stołówka w zakładach w Policach wydaje obiady od 11:30.",
  "Ślub w urzędzie stanu cywilnego w Sieradzu: 20 czerwca, godzina 10:00.",
  "Frekwencja w wyborach do rady gminy wyniosła 47%.",
  "Na PPK pracownik wpłaca 2%, a firma 1,5%.",
  "Firma Nowak & Syn z Leszna robi okna na zamówienie.",
  "Pensjonat Las & Woda w Augustowie ma jeszcze wolne pokoje.",
  "Hurtownia Stal & Drewno ze Stalowej Woli szuka magazyniera.",
  "Ewa pracuje na 1/2 etatu w bibliotece w Kluczborku.",
  "W ofercie: pensja + premia kwartalna + karta sportowa.",
  "Ulga na dziecko dotyczy dzieci w wieku < 18.",
  "Paczka > 30 kg idzie jako przesyłka gabarytowa.",
  "Siostra w Teksasie płaci za wynajem 1400 $ miesięcznie.",
  "Menu dnia w barze w Rybniku: żurek | kluski | modra kapusta.",
  "Plan dnia: biuro | żłobek | zakupy | kolacja.",
  "Kopia zapasowa trafia co piątek na dysk E:\\Kopie.",
  "Pytania w sprawie czynszu prosimy kierować na biuro@wspolnota.example.",
  "Stan konta na karcie sprawdzimy kodem *100#.",
  "Wzór SMS z przychodni: wizyta {data} o {godzina}, gabinet {pokój}.",
  "W pliku z adresami kolumna {ulica} jest pusta.",
  "Kawa w Wiedniu kosztuje 4,50 €.",
]);

describe("PL-T9: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("auch über alle drei Erwachsenen-Chargen (PL-T3 + PL-T6 + PL-T9) zusammen nicht (Falle 45)", () => {
    const fehler = zuHaeufig([...T3, ...T6, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die Wörter, die T3 + T6 schon ausgeschöpft haben, stehen hier in höchstens einer Zeile (PL-T6 §2)", () => {
    for (const w of ["mieszkanie", "pracy", "pracę", "dni", "rok"]) expect(zeilenMit(ZEILEN, w), w).toBeLessThanOrEqual(1);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (gross, mit Satzzeichen, nach Ziffer), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Rata" : "Ta 9 rata"} ${"abcdefghi"[i]}? Już.`);
    expect(zuHaeufig(neun)).toEqual(['"rata": 9 Zeilen']);
    expect(zeilenMit(["Szukamy pracy.", "Bez pracy."], "pracy")).toBe(2);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis", () => {
    const fehler = ZEILEN.flatMap((t) => pruefWoerter(t).filter((w) => gesperrtPl(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurwa (Kern), pijany und kartacze (Wortbasis) werden gefunden, rata und urząd nicht", () => {
    expect(istKernGesperrtPl("kurwa")).toBe(true);
    expect(gesperrtPl("pijany")).toBe(true);
    expect(gesperrtPl("Kartacze")).toBe(true);
    expect(gesperrtPl("rata")).toBe(false);
    expect(gesperrtPl("urząd")).toBe(false);
  });

  it("jedes Wort stand im Wortschatz oder in einer früheren pl-Charge oder ist Ort, Name oder von Hand belegt - und die Listen tragen nur Benutztes", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    const benutzt = new Set(ZEILEN.flatMap(woerterKlein));
    expect(Object.keys(VON_HAND_BELEGT).filter((w) => !benutzt.has(w) || BASIS.has(w) || FRUEHERE_PL_WOERTER.has(w))).toEqual([]);
    expect(Object.keys(ORTE).filter((w) => !benutzt.has(w))).toEqual([]);
    expect([...NAMEN, ...NAMENSTEILE].filter((w) => !benutzt.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und eine Form ohne Ogonek, die es so nicht gibt, werden gemeldet - eine Adresse nicht", () => {
    expect(ungeprueft(["Ewa ma ratax?", "Urzad wysyla pismo!", "Pisz na biuro@firma.example."])).toEqual(["ratax", "urzad", "wysyla"]);
  });

  /**
   * Die Stimme liest Leerzeichen-Wörter: „Bielsku-Białej" ist EIN Wort (das Fach `pl` streicht den Bindestrich,
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
    expect(stimmWoerter('Umowa-zlecenie, "Chłopi" i 2:1.')).toEqual(["Umowa-zlecenie", "Chłopi"]);
  });

  it("jede Zeile mit einem Ogonek-Zwilling ist gelesen - und nur diese", () => {
    const mit = ZEILEN.filter(mitZwilling);
    expect(mit.filter((z) => !ZEILEN_MIT_ZWILLING_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_ZWILLING_GELESEN].filter((z) => !mit.includes(z))).toEqual([]);
  });

  it("Gegenprobe: „Ide do urzedu?“ (statt Idę do urzędu) hat Zwillinge, „Ewa ma kota!“ nicht", () => {
    expect(mitZwilling("Ide do urzedu?")).toBe(true);
    expect(mitZwilling("Ewa ma kota!")).toBe(false);
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
/** „Fast gleich" (Falle 31/51): gegen die eigene Charge und jede pl-Zeile ab 0,5, gegen PL-T7 (dieselben Sprossen) ab 0,4, gegen alles andere ab 0,6. */
function fastGleich(zeilen: string[], gegen: string[], grenze: number): string[] {
  const out: string[] = [];
  const mengen = gegen.map((g) => [g, wortMenge(g)] as const);
  for (const z of zeilen) {
    const a = wortMenge(z);
    for (const [g, b] of mengen) if (g !== z && jaccard(a, b) >= grenze) out.push(`"${z}" ~ "${g}"`);
  }
  return out;
}

describe("PL-T9: keine Kopien, keine Paare, nichts fast gleich", () => {
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

  it("nichts fast gleich: eigene Charge und jede pl-Zeile (≥ 0,5), PL-T7 (≥ 0,4), alles andere (≥ 0,6)", () => {
    const fehler = [
      ...fastGleich(ZEILEN, [...ZEILEN, ...ANDERE_PL_ZEILEN], 0.5),
      ...fastGleich(ZEILEN, T7, 0.4),
      ...fastGleich(ZEILEN, alleFremdenZeilen(), 0.6),
    ];
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: beim Schreiben verworfene Zeilen wären Kopie oder fast gleich", () => {
    // Verworfen (Befund §4): „Bilet z Suwałk do Białegostoku …" (fast gleich mit der eigenen Frage nach dem Bilet nach
    // Warszawa) und „Na drzwiach przychodni wisi kartka …" (fast gleich mit PL-T7, ≥ 0,4).
    expect(fastGleich(['Na drzwiach przychodni wisi kartka "nieczynne do odwołania".'], T7, 0.4)).not.toEqual([]);
    expect(fastGleich(["Bilet z Suwałk do Białegostoku kosztuje 26 zł."], ZEILEN, 0.5)).not.toEqual([]);
    expect(fastGleich(["Kuba robi zdjęcia."], ["Ewa pisze list."], 0.5)).toEqual([]);
    const t = ANDERE_PL_ZEILEN[20];
    expect(kopienGegen([`${t.replace(/[.!?]$/, "")}?`], ANDERE_PL_ZEILEN)).toHaveLength(1);
    expect(paare(["Szef był w biurze.", "Szef była w biurze."])).toHaveLength(1);
    expect(bausteinKey("satz", "100 zł + 23 zł = 123 zł.")).toBe(bausteinKey("satz", "100 zł * 23 zł = 123 zł.")); // Zeichen sind Trenner
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker (keine stille Verschmelzung), und der Zuwachs ist die Zeilenzahl", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_PL()].map((i) => bausteinId(i.kind, i.text)));
    expect(CHARGE.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    const eigeneIds = CHARGE.map((i) => bausteinId(i.kind, i.text));
    expect(new Set(eigeneIds).size).toBe(ZEILEN.length);
    // Anker nur anhängend: die IDs dieser Charge stehen als geschlossener Block im Anker, keine davor
    // (gemessen 09.10.2026 auf 4ed2d3eb: 17.969 ⇒ 18.335, „366 neu").
    const start = KORPUS_ANKER.indexOf(eigeneIds[0]);
    expect(start).toBeGreaterThanOrEqual(17969);
    expect(KORPUS_ANKER.slice(start, start + ZEILEN.length)).toEqual(eigeneIds);
    const eigen = new Set(eigeneIds);
    expect(KORPUS_ANKER.slice(0, start).filter((id) => eigen.has(id))).toEqual([]);
  });
});

// ── Korpus-Anker und Auslieferung ──────────────────────────────────────────

describe("PL-T9: Korpus-Anker und Auslieferung", () => {
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
    const probe = { text: "Zzz probe pl t9?", kind: "satz" as const, stufen: ["erwachsen" as const] };
    const ids = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CORPUS_CS, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("am Ende des Lernwegs bekommen Erwachsene jede Zeile vollständig - Kinder und Jugend keine", () => {
    const alles = allowedAt(ordnung().length);
    const geliefert = new Set(corpusItemsFor({ stufe: "erwachsen", allowed: alles, lang: "pl", lernweg: "pl", umschalt: true }));
    expect(ZEILEN.filter((t) => !geliefert.has(t))).toEqual([]);
    for (const stufe of ["kids", "teens"] as const) {
      const andere = new Set(corpusItemsFor({ stufe, allowed: alles, lang: "pl", lernweg: "pl" }));
      expect(ZEILEN.filter((t) => andere.has(t)), stufe).toEqual([]);
    }
  });

  it("vor ł kommt keine dieser Zeilen; an q kommen sie nur gekürzt (ohne ? ! - \" : ( ), ohne Ziffern und Zeichen)", () => {
    const vorL = allowedAt(sprosseVon("ł") - 1);
    expect(ZEILEN.filter((t) => fitText(t, vorL, "pl") !== null)).toEqual([]);
    const anQ = allowedAt(sprosseVon("q"));
    const geliefert = corpusItemsFor({ stufe: "erwachsen", allowed: anQ, lang: "pl", lernweg: "pl", umschalt: true });
    expect(geliefert.filter((t) => /[^\p{L} .,]/u.test(t))).toEqual([]);
    const gekuerzt = ZEILEN.map((z) => fitText(z, anQ, "pl")).filter((s): s is string => s !== null);
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
