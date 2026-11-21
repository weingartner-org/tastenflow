/**
 * ★★★ Wächter PL-T1 (03.10.2026): die frühen pl-Texte für Kinder
 * (`corpusPlWegFruehKids.ts`, Sprossen 7-22 auf der Tastatur `pl` - bis zur
 * Sprosse vor ⇧). Vorbild: `tastenflow-texte-it-kids-frueh.test.ts`; Befund
 * `BEFUND-2026-10-02-PL-T1-KIDS-FRUEH.md`, Leitfaden Fallen 26/31/37/45/48/58/82.
 *
 * Die Sprosse einer Zeile wird hier AUSGERECHNET (kleinstes n, ab dem
 * `fitText` sie mit `introOrder("pl").slice(0, n)` durchlässt), nie aus einem
 * Kommentar geglaubt. Weg „pl" hat EINE Tastatur (`pl`, Windows „Polski
 * (programisty)", Mac „Polish - Pro"). Besonderheiten gegenüber Italienisch:
 * die Grundreihe hat nur EINEN Vokal (`a`), die achte Einheit `;` ist kein
 * Buchstabe (Sprosse 8 trägt keine Zeile), `ę` (Sprosse 17) ist ein AltGr-Griff,
 * und es gibt KEINEN Wörterbuch-Beleg (Falle 61) - darum prüft dieser Wächter
 * jedes Wort gegen den Wortschatz und eine Liste von Hand mit Begründung, und
 * jede Zeile mit einem „Ogonek-Zwilling" (sad/sąd, mama/mamą) ist gelesen.
 * Jede Regel hat eine Gegenprobe: der Prüfer muss einen gebauten Fehler finden.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, korpusFuer, CORPUS, CORPUS_EN, CORPUS_FR, CORPUS_IT, CORPUS_PL, CORPUS_TR, CORPUS_CS } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_PL_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusPlWegFruehKids";
import { allowedFromIntroduced } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { bausteinId, bausteinKey } from "../src/lib/typing/ledger";
import { corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";
import { gesperrtPl, istKernGesperrtPl, ohneOgonki } from "../src/lib/typing/sperrlistePl";
import { WORDS_PL, STUFE_VOCAB_PL } from "../src/lib/typing/wordsPl";
import { NACHTRAG_PL, NACHTRAG_PL_ERGAENZT } from "../src/lib/typing/lexikonNachtragPl";
import { isRealWord } from "../src/lib/typing/lexicon";
import { zeilenFehler } from "./helfer/plTextRegeln";

afterEach(() => setLayout("de"));

const ZEILEN = CORPUS_PL_WEG_FRUEH_KIDS.map((i) => i.text);
/** Die erste Sprosse mit echten Wörtern: an 7 ist „a" der erste (und vor `o` einzige) Vokal. */
const ERSTE_SPROSSE = 7;
/** Die Charge reicht bis zur Sprosse vor ⇧ (Wächter unten: = `letzteSprosse()`). */
const GEBAUT_BIS = 22;
/** Einheiten der Folge, die kein Buchstabe sind und darum keine eigene Zeile brauchen (W6): `;` ist der Fingeranker. */
const OHNE_ZEILE: ReadonlySet<string> = new Set([";"]);

/** Die Sprosse direkt vor ⇧ - aus der Reihenfolge gerechnet, nicht gezählt. */
function letzteSprosse(): number {
  setLayout("pl");
  return introOrder("pl").indexOf(SHIFT_UNIT);
}

/** Kleinste Sprosse, an der `fitText` den Text durchlässt (null: nie bis vor ⇧). */
function sprosseAuf(text: string): number | null {
  setLayout("pl");
  const o = introOrder("pl");
  const bis = o.indexOf(SHIFT_UNIT);
  for (let n = 1; n <= bis; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "pl"), "pl") !== null) return n;
  }
  return null;
}

describe("PL-T1: jede Zeile an ihrer Sprosse (Tastatur pl)", () => {
  it("die Folge vor ⇧: 22 Einheiten (Grundreihe mit ;, w o n t e i m z, ę, c y r p u)", () => {
    setLayout("pl");
    expect(introOrder("pl").slice(0, 22).join(" ")).toBe("f j d k s l a ; w o n t e i m z ę c y r p u");
    expect(letzteSprosse()).toBe(GEBAUT_BIS);
  });

  it(`jede Zeile passt an einer Sprosse ${ERSTE_SPROSSE}-${GEBAUT_BIS}, nicht früher, und minTier stimmt`, () => {
    const fehler: string[] = [];
    for (const item of CORPUS_PL_WEG_FRUEH_KIDS) {
      const s = sprosseAuf(item.text);
      if (s === null || s < ERSTE_SPROSSE || s > GEBAUT_BIS) fehler.push(`"${item.text}": Sprosse ${s}`);
      const tier = minTierFor(item.text, "pl");
      if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ł, ż, ą, b, g (nach ⇧) passen nie; ę an 17, u an 22, das erste Wort an 7", () => {
    for (const t of ["mały kot", "że to", "są tu", "dobry", "gra"]) expect(sprosseAuf(t), t).toBeNull();
    expect(sprosseAuf("las")).toBe(7);
    expect(sprosseAuf("dwa")).toBe(9);
    expect(sprosseAuf("idę")).toBe(17);
    expect(sprosseAuf("tu")).toBe(22);
    // Ohne Ersatz: „ide" ist eine ANDERE (falsche) Form, sie passt schon an 14 - der Zwillings-Wächter unten fängt sie.
    expect(sprosseAuf("ide")).toBe(14);
  });

  it("vor Sprosse 7 gibt es keinen Vokal (keine echten Wörter), und Sprosse 8 (;) ist kein Buchstabe", () => {
    setLayout("pl");
    const o = introOrder("pl");
    expect(o.slice(0, ERSTE_SPROSSE - 1).filter((u) => "aąeęioóuy".includes(u))).toEqual([]);
    expect(o[ERSTE_SPROSSE - 1]).toBe("a");
    expect(o[7]).toBe(";");
    expect(ZEILEN.filter((t) => sprosseAuf(t) === 8)).toEqual([]);
    expect(ZEILEN.filter((t) => t.includes(";"))).toEqual([]);
  });

  /**
   * GEMESSEN am Ende von PL-T1 (vom Code gezählt, nicht geschätzt) - jede Grenze darf künftig nur STEIGEN. Wo sie unter
   * 6 liegt, geben die Buchstaben nicht mehr her (Befund §2): an 9 mit `w` und dem einzigen Vokal „a" nur dwa, was,
   * kawa, kawka. Sprosse 8 (`;`) trägt bauartbedingt keine Zeile.
   */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    7: 6, 8: 0, 9: 4, 10: 7, 11: 6, 12: 6, 13: 10, 14: 10, 15: 13, 16: 13, 17: 10, 18: 14, 19: 11, 20: 18, 21: 15, 22: 21,
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

describe("PL-T1: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
  /** Zeilen, deren Text die an ihrer Sprosse neue Einheit NICHT enthält. */
  function ohneNeueEinheit(zeilen: { text: string; sprosse: number }[]): string[] {
    setLayout("pl");
    const o = introOrder("pl");
    return zeilen
      .filter((z) => !z.text.includes(o[z.sprosse - 1]))
      .map((z) => `"${z.text}" (Sprosse ${z.sprosse}, ${o[z.sprosse - 1]})`);
  }

  it("jede Zeile enthält die Einheit ihrer (gerechneten) Sprosse", () => {
    const zeilen = ZEILEN.map((text) => ({ text, sprosse: sprosseAuf(text) })).filter(
      (z): z is { text: string; sprosse: number } => z.sprosse !== null,
    );
    const fehler = ohneNeueEinheit(zeilen);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede Einheit von a bis u (ausser dem Fingeranker ;) hat an ihrer Sprosse mindestens eine Zeile (W6)", () => {
    setLayout("pl");
    const o = introOrder("pl");
    const fehlt: string[] = [];
    for (let n = ERSTE_SPROSSE; n <= GEBAUT_BIS; n++) {
      if (OHNE_ZEILE.has(o[n - 1])) continue;
      const erlaubt = allowedFromIntroduced(o.slice(0, n), "pl");
      const treffer = ZEILEN.filter((t) => fitText(t, erlaubt, "pl") !== null && t.includes(o[n - 1]));
      if (treffer.length === 0) fehlt.push(`${n}:${o[n - 1]}`);
    }
    expect(fehlt, "Einheiten ohne Zeile").toEqual([]);
  });

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet", () => {
    expect(ohneNeueEinheit([{ text: "jak sowa", sprosse: 11 }])).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "jak sowa", sprosse: 10 }])).toEqual([]);
    expect(ohneNeueEinheit([{ text: "idę do kina", sprosse: 17 }])).toEqual([]);
  });
});

// ── Form: klein, nur gelernte Zeichen, keine Satzzeichen, Hausregeln ─────────

/** Vor ⇧: genau die Buchstaben der Folge bis `u` (ę ist der einzige polnische) und einfache Leerzeichen. */
const ERLAUBTE_ZEICHEN = /^[acdefijklmnoprstuwyzę ]+$/;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) || t !== t.toLowerCase() || t !== t.trim() || t.includes("  ");

describe("PL-T1: vor ⇧ nur Kleinbuchstaben, keine Satzzeichen, Regeln des Weges", () => {
  it("jede Zeile ist klein geschrieben und besteht nur aus gelernten Buchstaben und einfachen Leerzeichen", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Grossbuchstabe, Punkt, ł, ą, b und doppeltes Leerzeichen werden gefunden", () => {
    for (const t of ["Kot jest na stole", "kot jest na stole.", "mały kot", "mamą", "dobry", "kot  jest"]) {
      expect(formFehler(t), t).toBe(true);
    }
  });

  it("jede Zeile besteht die Regeln aller polnischen Zeilen (`helfer/plTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [kids], nurWeg pl, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_PL_WEG_FRUEH_KIDS) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["kids"]);
      expect(item.nurWeg, item.text).toBe("pl");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Wortschatz: Wortgrenze 8, Sperrliste, Wortbasis, Ogonek-Zwillinge ────────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht. */
const FUNKTIONSWOERTER = new Set(
  (
    "a i w we z ze na do od o po za nad pod przed dla jak to ten ta te tak nie się mi mnie ja ty on ona ono my wy " +
    "oni one jest są ma mam masz mamy czy co oraz lub ale no"
  ).split(" "),
);

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    for (const w of new Set(z.split(" "))) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
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
 * Wörter dieser Charge, die NICHT im Wortschatz standen (Tatoeba hat sie seltener als zweimal, ein Wörterbuch-Beleg fehlt
 * für Polnisch: das macOS-Wörterbuch nimmt jedes Wort an, Falle 61). Jedes ist eine gewöhnliche Form eines Standardworts;
 * die Begründung steht daneben. Über den Korpus kommen sie ins Vorlese-Lexikon (lexicon.ts: Korpus-Wörter), die Stimme
 * spricht sie ganz. ⚠️ Von keiner Person mit Polnisch als Erstsprache gelesen (Befund §4).
 */
const VON_HAND_BELEGT: Readonly<Record<string, string>> = {
  fok: "Gen. Pl. von foka (stado fok)",
  jamie: "Lok. Sg. von jama (smok w jamie)",
  stawem: "Instr. Sg. von staw (nad stawem)",
  wianki: "Nom. Pl. von wianek (Brauch der Johannisnacht)",
  listki: "Nom. Pl. von listek (Verkleinerung von liść)",
  zimo: "Vokativ von zima (witaj zimo)",
  sowę: "Akk. Sg. von sowa",
  zieleni: "3. Sg. von zielenić się (las się zieleni)",
  kaszę: "Akk. Sg. von kasza",
  sękacz: "Baumkuchen aus Podlasie (Nom. Sg.)",
  wydmy: "Nom. Pl. von wydma (Düne)",
  komina: "Gen. Sg. von komin",
  szyszki: "Nom. Pl. von szyszka (Zapfen)",
  kiermasz: "Nom. Sg. (Schulbasar)",
  skoki: "Nom. Pl. von skok (skoki narciarskie)",
  wędzony: "Partizip/Adjektiv von wędzić (geräuchert)",
  pieczemy: "1. Pl. von piec (backen)",
  stawiamy: "1. Pl. von stawiać",
  placki: "Nom. Pl. von placek",
  ziemniaczane: "Adjektiv zu ziemniak (placki ziemniaczane)",
  czasownikami: "Instr. Pl. von czasownik (Verb)",
  oddzielnie: "Adverb (getrennt)",
  dwuznaki: "Nom. Pl. von dwuznak (Schulbegriff: sz, cz, rz, ch, dz)",
  malujemy: "1. Pl. von malować",
  pisanki: "Nom. Pl. von pisanka (STUFE_VOCAB_PL: nur Sg.)",
  pakuję: "1. Sg. von pakować",
  krasnali: "Gen. Pl. von krasnal (Wrocławer Zwerge)",
  mazurskie: "Adjektiv zu Mazury, Nom. Pl. (jeziora mazurskie)",
  wycinanki: "Nom. Pl. von wycinanka (Scherenschnitt)",
  kurpiowskie: "Adjektiv zu Kurpie, Nom. Pl.",
  polonez: "Tanz, Nom. Sg.",
  krakowiak: "Tanz, Nom. Sg. (klein: der Tanz, nicht der Einwohner)",
  mazur: "Tanz, Nom. Sg. (klein: der Tanz)",
  kujawiak: "Tanz, Nom. Sg. (klein: der Tanz)",
  pomidorowa: "Adjektiv zu pomidor, Nom. Sg. f. (zupa pomidorowa)",
  rolada: "Nom. Sg. (schlesisches Sonntagsessen)",
  kutry: "Nom. Pl. von kuter (Fischkutter)",
  porcie: "Lok. Sg. von port",
};

/**
 * Buchstabenfolgen, die als NAMEN der Zeichen dastehen (sz, cz, rz in „sz cz i rz to dwuznaki") - kein Wort, kein
 * Fehler; die Stimme spricht sie als Buchstaben (Zweifelsfall im Befund §4a: am Gerät nicht gehört).
 */
const ZEICHENNAMEN: ReadonlySet<string> = new Set(["sz", "cz", "rz"]);

/** Wörter (ab zwei Buchstaben), die weder im Wortschatz standen noch von Hand belegt sind. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of z.split(" ")) {
      if (w.length >= 2 && !BASIS.has(w) && !(w in VON_HAND_BELEGT) && !ZEICHENNAMEN.has(w)) out.add(w);
    }
  }
  return [...out];
}

/**
 * „Ogonek-Zwillinge": Formen ohne Ogonek, deren Form MIT Ogonek ebenfalls ein Wort ist (sad/sąd, mama/mamą, daje/daję,
 * ide/idę). Hier kann ein fehlender Ogonek ein ANDERES Wort ergeben - ein Ersatz gibt es nicht (Falle 36), und das
 * Lexikon enthält auch Tippfehler-Formen wie „sie" (Tatoeba). Jede Zeile mit so einem Wort ist GELESEN (Befund §4a): die
 * geschriebene Form ist gemeint. Eine neue Zeile mit einem Zwilling muss hier eingetragen werden.
 */
const ZWILLINGE: ReadonlyMap<string, string[]> = (() => {
  const m = new Map<string, string[]>();
  for (const v of BASIS) {
    if (!/[ąćęłńóśźż]/.test(v)) continue;
    const k = ohneOgonki(v);
    if (k !== v) m.set(k, [...(m.get(k) ?? []), v]);
  }
  return m;
})();
const mitZwilling = (zeile: string): boolean => zeile.split(" ").some((w) => ZWILLINGE.has(w));

const ZEILEN_MIT_ZWILLING_GELESEN: ReadonlySet<string> = new Set([
  "las sad fala", "klasa lalka kajak", "sad jak las", "kawa dla was", "sok kakao woda", "nowa klasa", "jasna sala",
  "oko nos kolano", "fajna lalka", "woda do kolan", "oto tata", "twoja kolej", "jest wiosna", "wiosna i lato",
  "mama i tata", "zadanie domowe", "nasza klasa", "tata jedzie do miasta", "nic nie szkodzi", "ciemna noc", "kozy i owce",
  "ty i ja", "latarnia morska", "krowa daje mleko", "teraz ja", "kiermasz w szkole", "pies szczeka", "kopalnia soli",
  "to prawda", "pani nauczycielka czyta wiersz", "nasz pan od muzyki", "zupa pomidorowa", "ciocia i wujek",
]);

describe("PL-T1: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet, ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `jest las ${"abcdefghi"[i]}`);
    expect(zuHaeufig(neun)).toEqual(['"las": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis (auch kein Doppelsinn: jajka ja, jaja nein)", () => {
    const fehler = ZEILEN.flatMap((t) => t.split(" ").filter((w) => gesperrtPl(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurwa (Kern), jaja und kupa (Wortbasis) werden gefunden, jajka und kasza nicht", () => {
    expect(istKernGesperrtPl("kurwa")).toBe(true);
    expect(istKernGesperrtPl("jaja")).toBe(false);
    expect(gesperrtPl("jaja")).toBe(true);
    expect(gesperrtPl("kupa")).toBe(true);
    expect(gesperrtPl("jajka")).toBe(false);
    expect(gesperrtPl("kasza")).toBe(false);
  });

  it("jedes Wort stand schon im Wortschatz (WORDS_PL, STUFE_VOCAB_PL, NACHTRAG_PL) oder ist von Hand belegt", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Liste trägt nur, was wirklich gebraucht wird und nicht ohnehin bekannt ist (sonst wächst sie still).
    const benutzt = new Set(ZEILEN.flatMap((z) => z.split(" ")));
    expect(Object.keys(VON_HAND_BELEGT).filter((w) => !benutzt.has(w) || BASIS.has(w))).toEqual([]);
    expect([...ZEICHENNAMEN].filter((w) => !benutzt.has(w))).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und eine Form ohne Ogonek, die es so nicht gibt, werden gemeldet", () => {
    expect(ungeprueft(["jak lasx", "dziekuje mamo"])).toEqual(["lasx", "dziekuje"]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge ausser den Zeichennamen (Falle 58)", () => {
    const buchstabiert = ZEILEN.filter((z) =>
      z.split(" ").some((w) => w.length >= 2 && !ZEICHENNAMEN.has(w) && !isRealWord(w, "pl")),
    );
    expect(buchstabiert).toEqual([]);
  });

  it("jede Zeile mit einem Ogonek-Zwilling ist gelesen (sad/sąd, mama/mamą, daje/daję) - und nur diese", () => {
    const mit = ZEILEN.filter(mitZwilling);
    expect(mit.filter((z) => !ZEILEN_MIT_ZWILLING_GELESEN.has(z))).toEqual([]);
    expect([...ZEILEN_MIT_ZWILLING_GELESEN].filter((z) => !mit.includes(z))).toEqual([]);
  });

  it("Gegenprobe: „ide do kina“ (statt idę) und „jest sie“ (statt się) haben einen Zwilling, „jak las“ nicht", () => {
    expect(mitZwilling("ide do kina")).toBe(true);
    expect(mitZwilling("jest sie")).toBe(true);
    expect(ZWILLINGE.get("ide")).toContain("idę");
    expect(mitZwilling("jak las")).toBe(false);
  });
});

// ── Keine Kopien, keine Paare, Anker ────────────────────────────────────────

/** Geschlecht und Zahl grob gleichgesetzt: „on idzie" / „ona idzie", „kot jest" / „koty są" (Endvokal weg). */
function paarForm(zeile: string): string {
  const pron: Record<string, string> = { on: "PRO", ona: "PRO", ono: "PRO", oni: "PRO", one: "PRO" };
  return zeile
    .split(" ")
    .map((w) => pron[w] ?? w.replace(/[aeiouyąę]$/, "_"))
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

const FREMDE_KORPORA = () => [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_TR, ...CORPUS_CS];

describe("PL-T1: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der die neun polnischen Buchstaben NICHT kennt)", () => {
    expect(new Set(ZEILEN).size).toBe(ZEILEN.length);
    const schluessel = ZEILEN.map((t) => bausteinKey("satz", t));
    expect(new Set(schluessel).size).toBe(ZEILEN.length);
  });

  it("Gegenprobe: der Ledger-Schlüssel macht aus ę einen Trenner („widzę sowę“ = „widz sow“)", () => {
    expect(bausteinKey("satz", "widzę sowę")).toBe(bausteinKey("satz", "widz sow"));
  });

  it("keine Zeile gleicht einer Zeile der Wege de/en/fr/es/it/tr/cs (Text oder Ledger-Schlüssel)", () => {
    const fremd = FREMDE_KORPORA();
    const texte = new Set(fremd.map((i) => i.text.toLowerCase()));
    const schluessel = new Set(fremd.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CORPUS_PL_WEG_FRUEH_KIDS.filter(
      (i) => texte.has(i.text) || schluessel.has(bausteinKey(i.kind, i.text)),
    ).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: eine italienische Kinderzeile wäre als Kopie erkannt", () => {
    const it0 = CORPUS_IT.find((i) => i.stufen.includes("kids"));
    expect(it0).toBeDefined();
    const schluessel = new Set(FREMDE_KORPORA().map((i) => bausteinKey(i.kind, i.text)));
    expect(schluessel.has(bausteinKey("satz", (it0 as { text: string }).text))).toBe(true);
  });

  it("keine Paare (nur Geschlecht oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: on/ona, kot/koty und lalka/lalki werden als Paar erkannt, las/lis nicht", () => {
    expect(paare(["on idzie do kina", "ona idzie do kina"])).toHaveLength(1);
    expect(paare(["fajna lalka", "fajne lalki"])).toHaveLength(1);
    expect(paare(["jak las", "jak lis"])).toEqual([]);
  });
});

describe("PL-T1: Korpus-Anker und Auslieferung", () => {
  it("CORPUS_PL und korpusFuer(\"pl\") tragen jede Zeile dieser Charge (nichts still verschmolzen)", () => {
    const roh = new Set(CORPUS_PL.map((i) => i.text));
    const geladen = new Set(korpusFuer("pl").map((i) => i.text));
    expect(ZEILEN.filter((t) => !roh.has(t))).toEqual([]);
    expect(ZEILEN.filter((t) => !geladen.has(t))).toEqual([]);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_PL_WEG_FRUEH_KIDS.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "zzz probe pl t1", kind: "satz" as const, stufen: ["kids" as const] };
    const ids = manifestFor([
      ...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CORPUS_CS, probe,
    ]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  it("Weg „pl“ bekommt vor ⇧ alle Zeilen dieser Charge - und nur eigene pl-Kinderzeilen", () => {
    setLayout("pl");
    const o = introOrder("pl");
    const allowed = allowedFromIntroduced(o.slice(0, GEBAUT_BIS), "pl");
    const geliefert = corpusItemsFor({ stufe: "kids", allowed, lang: "pl", lernweg: "pl" });
    expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
    // Eigen ist der Rohtext ODER seine servierte Fassung bei diesem Stand: spätere ⇧-Chargen (T4) kommen über die
    // Auto-Grossschreibung schon vor ⇧ an, ohne ihre noch nicht gelernten Satzzeichen (wie IT-T4/ES-T4).
    const eigeneKinder = new Set(
      CORPUS_PL.filter((i) => i.nurWeg === "pl" && i.stufen.includes("kids")).flatMap((i) => [
        i.text,
        fitText(i.text, allowed, "pl") ?? i.text,
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
