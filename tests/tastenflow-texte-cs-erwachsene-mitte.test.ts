/**
 * ★★★ Wächter CS-T6 (09.10.2026): die mittleren cs-Texte für ERWACHSENE
 * (`corpusCsWegMitteErwachsene.ts`, Sprossen 18-44 = ⇧ bis ¨, auf `cs` UND `cs-qwerty`).
 * Vorbilder: `tastenflow-texte-cs-kids-mitte.test.ts` (CS-T4, gleiche Sprossen), `tastenflow-texte-cs-erwachsene-frueh.test.ts`
 * (CS-T3: D-2, echte Runde, Ehe-Rolle, Wortbudget Erwachsene) und `tastenflow-texte-pl-erwachsene-mitte.test.ts` (PL-T6);
 * Befund `BEFUND-2026-10-09-CS-T6-ERWACHSENE-MITTE.md`, Leitfaden Fallen 26/37/45/51/58/61/76/92-100.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, ab dem `fitText` sie mit `introOrder("cs").slice(0, n)`
 * durchlässt, mindestens aber ⇧ (18) - auf BEIDEN Pflicht-Tastaturen, nie aus einem Kommentar geglaubt.
 *
 * Besonderheiten dieser Charge (gemessen, jede mit Gegenprobe):
 *  · ★ D-2 (`nurKleinschrift`): Erwachsene bekommen vor ⇧ keine Zeile mit Grossbuchstaben. Jede Zeile beginnt gross ⇒
 *    keine kommt vor ⇧ an. Anders als bei Kindern (CS-T4) darf eine Zeile darum nur aus den Buchstaben bis `u` bestehen:
 *    sie ist eine echte ⇧-Zeile (Sprosse 18) und übt ⇧ . , ? mit bekannten Wörtern. Genau diese Zeilen sind gezählt.
 *  · Grosse Akzentbuchstaben: Č Š Ř Ž … erst ab `ˇ` (37), Á É Í Ú … erst ab `´` (41) - auch mitten im Satz.
 *  · Die Totasten `ˇ` und `´` kommen in keinem Wort selbst vor (Falle 95): sie zeigen sich an ď ť ň bzw. ó oder an
 *    einem grossen Akzentbuchstaben. `¨` (44) erzeugt ä ë ö ü - kein tschechisches Wort: ausgenommen.
 *  · Tschechisch hat KEIN Wörterbuch (Falle 61): jedes Wort steht im Wortschatz, in den Tatoeba-Formen, in
 *    `OHNE_TATOEBA_BELEG` (mit Begründung) oder in `EIGENNAMEN`.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
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
  CORPUS_TR,
  CORPUS_CS as CS_GELADEN,
} from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_CS as CS_ROH } from "../src/lib/typing/corpusCs";
import { CORPUS_CS_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusCsWegFruehKids";
import { CORPUS_CS_WEG_FRUEH_ERWACHSENE } from "../src/lib/typing/corpusCsWegFruehErwachsene";
import { CORPUS_CS_WEG_MITTE_ERWACHSENE } from "../src/lib/typing/corpusCsWegMitteErwachsene";
import { allowedFromIntroduced, SERIEN } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { adaptiveRound } from "../src/lib/typing/generator";
import { bausteinId, bausteinKey } from "../src/lib/typing/ledger";
import { corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";
import { gesperrtCs, istKernGesperrtCs } from "../src/lib/typing/sperrlisteCs";
import { WORDS_CS, STUFE_VOCAB_CS } from "../src/lib/typing/wordsCs";
import { NACHTRAG_CS } from "../src/lib/typing/lexikonNachtragCs";
import { isRealWord } from "../src/lib/typing/lexicon";
import { zeilenFehler } from "./helfer/csTextRegeln";

afterEach(() => setLayout("de"));

const TASTATUREN: LayoutId[] = ["cs", "cs-qwerty"];
const CHARGE = CORPUS_CS_WEG_MITTE_ERWACHSENE;
const ZEILEN = CHARGE.map((i) => i.text);
/** Alle ANDEREN cs-Zeilen (T1-T5 und jede spätere Charge), aus der ROHEN Sammelliste - nicht aus der geladenen. */
const ANDERE_CS = () => CS_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_CS_ZEILEN = (): string[] => ANDERE_CS().map((i) => i.text);
/** Die anderen Erwachsenen-Chargen (Wortbudget Erwachsene über T3 + T6 + T9). */
const ERWACHSENE_ANDERE = (): string[] => ANDERE_CS().filter((i) => i.stufen.includes("erwachsen")).map((i) => i.text);
const T1 = CORPUS_CS_WEG_FRUEH_KIDS.map((i) => i.text);
const T3 = CORPUS_CS_WEG_FRUEH_ERWACHSENE.map((i) => i.text);
/** Die letzte Einheit des Bereichs (danach kommen `! " : ; ' - ( )` und die Ziffern). */
const LETZTE_EINHEIT = "¨";

function grenzen(layout: LayoutId): { shift: number; letzte: number; o: string[] } {
  setLayout(layout);
  const o = introOrder("cs");
  return { shift: o.indexOf(SHIFT_UNIT) + 1, letzte: o.indexOf(LETZTE_EINHEIT) + 1, o };
}

/** Kleinste Sprosse, an der `fitText` den Text durchlässt (null: nie bis ¨) - mit Auto-Grossschreibung, wie bei Kindern. */
function buchstabenSprosse(text: string, layout: LayoutId = "cs"): number | null {
  const { letzte, o } = grenzen(layout);
  for (let n = 1; n <= letzte; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "cs"), "cs") !== null) return n;
  }
  return null;
}

/** Die Sprosse der Zeile für Erwachsene: nie vor ⇧ (D-2, jede Zeile beginnt gross). */
function sprosseAuf(text: string, layout: LayoutId = "cs"): number | null {
  const s = buchstabenSprosse(text, layout);
  return s === null ? null : Math.max(s, grenzen(layout).shift);
}

/**
 * Enthält der Text die Einheit? ⇧ zeigt sich an einem Grossbuchstaben; die Totasten an dem, was sie lehren
 * (`totastenZiele`: ˇ ⇒ ď ť ň, ´ ⇒ ó) oder an einem grossen Akzentbuchstaben, den es nur über sie gibt.
 */
function enthaeltEinheit(text: string, einheit: string): boolean {
  if (einheit === SHIFT_UNIT) return text !== text.toLowerCase();
  if (einheit === "ˇ") return /[ďťňČŠŘŽĚĎŤŇ]/u.test(text);
  if (einheit === "´") return /[óÁÉÍÚÝÓ]/u.test(text);
  return text.toLowerCase().includes(einheit);
}

/** `. , ?` (19-21) sind weglassbar und haben keine eigene Sprosse - sie stecken in den Zeilen. `¨`: kein Wort. */
const OHNE_EIGENE_ZEILE = new Set([".", ",", "?", "¨"]);

describe("CS-T6: jede Zeile an ihrer Sprosse (cs und cs-qwerty)", () => {
  it("die Folge 18-44 auf beiden Tastaturen: ⇧ . , ? í p c h á r z b y ž š ř č é ý ˇ g ú x ´ w q ¨", () => {
    for (const l of TASTATUREN) {
      const { shift, letzte, o } = grenzen(l);
      expect(shift, l).toBe(18);
      expect(letzte, l).toBe(44);
      expect(o.slice(17, 44).join(" "), l).toBe(`${SHIFT_UNIT} . , ? í p c h á r z b y ž š ř č é ý ˇ g ú x ´ w q ¨`);
    }
  });

  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile hat eine Sprosse von ⇧ bis ¨, und minTier stimmt`, () => {
      const { shift, letzte } = grenzen(l);
      const fehler: string[] = [];
      for (const item of CHARGE) {
        const s = sprosseAuf(item.text, l);
        if (s === null || s < shift || s > letzte) fehler.push(`"${item.text}": Sprosse ${s}`);
        const tier = minTierFor(item.text, "cs");
        if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
      }
      expect(fehler, fehler.join("\n")).toEqual([]);
    });
  }

  it("jede Zeile hat auf cs und cs-qwerty DIESELBE Sprosse (introOrder zählt Tastenwerte, y/z tauschen nur den Platz)", () => {
    expect(ZEILEN.filter((t) => buchstabenSprosse(t, "cs") !== buchstabenSprosse(t, "cs-qwerty"))).toEqual([]);
  });

  it("die Datei ist nach der gerechneten Sprosse sortiert", () => {
    const s = ZEILEN.map((t) => sprosseAuf(t) ?? 0);
    expect(s.filter((n, i) => i > 0 && n < s[i - 1])).toEqual([]);
  });

  it("die ⇧-Zeilen (nur Buchstaben bis `u`): genau sieben, jede gross am Anfang - für Kinder kämen sie schon vor ⇧, für Erwachsene nie", () => {
    const fruehe = ZEILEN.filter((t) => (buchstabenSprosse(t) ?? 99) < 18);
    expect(fruehe).toHaveLength(7);
    expect(fruehe.filter((t) => !enthaeltEinheit(t[0], SHIFT_UNIT))).toEqual([]);
    expect(fruehe.filter((t) => sprosseAuf(t) !== 18)).toEqual([]);
  });

  it("Gegenprobe: Sprossen werden richtig gerechnet (⇧-Zeile, grosse Akzentbuchstaben, Totasten)", () => {
    for (const l of TASTATUREN) {
      expect(buchstabenSprosse("Matěj, kde je sklad?", l), l).toBe(16); // ě an 16; gross und Satzzeichen fallen vor ⇧ weg
      expect(sprosseAuf("Matěj, kde je sklad?", l), l).toBe(18);
      expect(sprosseAuf("Kominík je tu od devíti.", l), l).toBe(22);
      expect(sprosseAuf("Šéfová je dnes na služební cestě.", l), l).toBe(37); // grosses Š: erst mit ˇ
      expect(sprosseAuf("Sousedi staví zeď.", l), l).toBe(37); // ď nur über die Totaste
      expect(sprosseAuf("V Žatci se pěstuje chmel.", l), l).toBe(37); // auch mitten im Satz
      expect(sprosseAuf("Úterní porada odpadá.", l), l).toBe(41); // grosses Ú: erst mit ´
      expect(sprosseAuf("Hotel má wellness.", l), l).toBe(42);
    }
  });

  /** GEMESSEN am Ende von CS-T6 (vom Code gezählt, nicht geschätzt) - jede Grenze darf künftig nur STEIGEN. */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    18: 7, 22: 10, 23: 10, 24: 8, 25: 9, 26: 10, 27: 11, 28: 17, 29: 9, 30: 11, 31: 12, 32: 12, 33: 19, 34: 16, 35: 14,
    36: 14, 37: 22, 38: 11, 39: 10, 40: 7, 41: 9, 42: 3, 43: 1,
  };

  for (const l of TASTATUREN) {
    it(`${l}: je Sprosse mindestens so viele Zeilen wie gemessen, an 22-36 mindestens 8`, () => {
      const { shift, letzte, o } = grenzen(l);
      const anzahl = new Map<number, number>();
      for (const t of ZEILEN) {
        const s = sprosseAuf(t, l);
        if (s !== null) anzahl.set(s, (anzahl.get(s) ?? 0) + 1);
      }
      const zuWenig: string[] = [];
      for (let n = shift; n <= letzte; n++) {
        if (OHNE_EIGENE_ZEILE.has(o[n - 1])) continue;
        const soll = MINDESTENS_JE_SPROSSE[n] ?? 0;
        if ((anzahl.get(n) ?? 0) < soll) zuWenig.push(`Sprosse ${n} (${o[n - 1]}): ${anzahl.get(n) ?? 0} < ${soll}`);
        if (n >= 22 && n <= 36 && (anzahl.get(n) ?? 0) < 8) zuWenig.push(`Sprosse ${n} (${o[n - 1]}) unter 8`);
      }
      expect(zuWenig, zuWenig.join("\n")).toEqual([]);
    });
  }
});

describe("CS-T6: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37/95)", () => {
  function ohneNeueEinheit(zeilen: { text: string; sprosse: number }[]): string[] {
    const { o } = grenzen("cs");
    return zeilen
      .filter((z) => !enthaeltEinheit(z.text, o[z.sprosse - 1]))
      .map((z) => `"${z.text}" (Sprosse ${z.sprosse}, ${o[z.sprosse - 1]})`);
  }

  it("jede Zeile enthält die Einheit ihrer (gerechneten) Sprosse", () => {
    const fehler = ohneNeueEinheit(ZEILEN.map((text) => ({ text, sprosse: sprosseAuf(text) ?? 0 })));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  for (const l of TASTATUREN) {
    it(`${l}: jede Einheit von ⇧ bis q hat an ihrer Sprosse Zeilen (W6); . , ? und ¨ ausgenommen`, () => {
      const { shift, letzte, o } = grenzen(l);
      const fehlt: string[] = [];
      for (let n = shift; n <= letzte; n++) {
        if (OHNE_EIGENE_ZEILE.has(o[n - 1])) continue;
        if (!ZEILEN.some((t) => sprosseAuf(t, l) === n && enthaeltEinheit(t, o[n - 1]))) fehlt.push(`${n}:${o[n - 1]}`);
      }
      expect(fehlt, "Einheiten ohne Zeile").toEqual([]);
    });
  }

  it("⇧ . , ? stecken in den Zeilen: jede beginnt gross, endet mit . oder ?, mindestens 10 mit Komma, 5 Fragen", () => {
    expect(ZEILEN.filter((t) => !enthaeltEinheit(t[0], SHIFT_UNIT))).toEqual([]);
    expect(ZEILEN.filter((t) => !/[.?]$/u.test(t))).toEqual([]);
    expect(ZEILEN.filter((t) => t.includes(",")).length).toBeGreaterThanOrEqual(10);
    expect(ZEILEN.filter((t) => t.endsWith("?")).length).toBeGreaterThanOrEqual(5);
  });

  it("an ˇ (37) mindestens 10 Zeilen MIT ď ť ň, an ´ (41) mindestens 3 MIT ó - nicht nur grosse Buchstaben", () => {
    const an = (n: number) => ZEILEN.filter((t) => sprosseAuf(t) === n);
    expect(an(37).filter((t) => /[ďťň]/u.test(t)).length).toBeGreaterThanOrEqual(10);
    expect(an(41).filter((t) => /ó/u.test(t)).length).toBeGreaterThanOrEqual(3);
  });

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet; Grossbuchstabe gilt als ⇧, Č als ˇ, Ú als ´", () => {
    expect(enthaeltEinheit("Matěj, kde je sklad?", SHIFT_UNIT)).toBe(true);
    expect(enthaeltEinheit("matěj, kde je sklad?", SHIFT_UNIT)).toBe(false);
    expect(enthaeltEinheit("Čekáme na schválení.", "ˇ")).toBe(true);
    expect(enthaeltEinheit("Občanka mi končí.", "ˇ")).toBe(false); // č ist direkt, keine Totaste
    expect(enthaeltEinheit("Účtenku si schovejte.", "´")).toBe(true);
    expect(enthaeltEinheit("Výplata přijde na účet.", "´")).toBe(false); // ú ist direkt
    expect(ohneNeueEinheit([{ text: "Kominík je tu od devíti.", sprosse: 23 }])).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "Kominík je tu od devíti.", sprosse: 22 }])).toEqual([]);
  });

  it("die echte Runde (adaptiveRound, Erwachsene, ⇧ bis h, Fokus h) bringt Zeilen dieser Charge mit h", () => {
    setLayout("cs");
    const o = introOrder("cs");
    const intro = o.slice(0, o.indexOf("h") + 1);
    const echt = Math.random;
    let s = 2027;
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
        for (const z of adaptiveRound({ introduced: intro, focus: ["h"], stufe: "erwachsen", lang: "cs", lernweg: "cs", count: 12 })) {
          texte.push(z.text);
        }
      }
    } finally {
      Math.random = echt;
    }
    const allowed = allowedFromIntroduced(intro, "cs");
    const eigene = new Set(ZEILEN.flatMap((t) => [t, fitText(t, allowed, "cs") ?? t]));
    const treffer = texte.filter((t) => eigene.has(t) && t.includes("h"));
    expect(treffer.length, texte.slice(0, 12).join(" / ")).toBeGreaterThan(0);
  });
});

// ── Form und Hausregeln ─────────────────────────────────────────────────────

/** Nur Buchstaben, Leerzeichen und die Satzzeichen des Bereichs (`. , ?`); gross am Anfang, `.`/`?` am Ende. */
const FORM = /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚÝŽ][a-záčďéěíňóřšťúůýžA-ZÁČĎÉĚÍŇÓŘŠŤÚÝŽ ,]*[a-záčďéěíňóřšťúůýž][.?]$/u;

describe("CS-T6: Form, Regeln des Weges, Einträge", () => {
  it("jede Zeile: gross am Anfang, nur Buchstaben und , . ?, Punkt oder Fragezeichen am Ende, ein Satzende", () => {
    const fehler = ZEILEN.filter((t) => !FORM.test(t) || /[.?]./u.test(t) || /,\S/u.test(t) || t.includes("  "));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Ausrufezeichen, Ziffer, Doppelpunkt, Bindestrich, kleiner Anfang und fehlender Punkt werden gefunden", () => {
    for (const t of ["Hurá!", "Nájem je 9 000.", "Pozor: led.", "E-mail přišel.", "výplata přišla.", "Výplata přišla", "Ano. Ne."]) {
      expect(!FORM.test(t) || /[.?]./u.test(t), t).toBe(true);
    }
    expect(FORM.test("Matěj, kde je sklad?")).toBe(true);
  });

  it("jede Zeile besteht die Regeln aller tschechischen Zeilen (`helfer/csTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [erwachsen], nurWeg cs, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["erwachsen"]);
      expect(item.nurWeg, item.text).toBe("cs");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Geschlecht der tippenden Person (Glossar §1 Regel 2) ─────────────────────

const W_ENDE = "(?=[\\s,.?]|$)";
const GEGENDERTES_DU = new RegExp(
  `(^|\\s)\\p{L}+(l|la|li|ly) jsi${W_ENDE}|(^|\\s)jsi (\\p{L}+(l|la|li|ly|ý|á)|sám|sama|rád|ráda)${W_ENDE}`,
  "iu",
);
/** „ich bin" mit hartem Adjektiv, l-Partizip oder rád/ráda legt das Geschlecht der tippenden Person fest; ebenso „bych" + l-Form. */
const GEGENDERTES_ICH = new RegExp(
  `(^|\\s)\\p{L}+(l|la) (jsem|bych)${W_ENDE}|(^|\\s)(jsem|bych) (\\p{L}+(l|la|ý|á)|sám|sama|rád|ráda)${W_ENDE}`,
  "iu",
);
/** Die Rolle „Ehemann/Ehefrau" legt es über das Gegenüber fest. */
const ROLLE = /(^|\s)(manžel\p{L}*|žena|ženou|muž|mužem)(?=[\s,.?]|$)/iu;

describe("CS-T6: keine Zeile legt das Geschlecht der tippenden Person fest", () => {
  it("kein gegendertes „du“, kein gegendertes „ich“, keine Ehe-Rolle (auch nicht vor Komma oder Punkt)", () => {
    expect(ZEILEN.filter((z) => GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z) || ROLLE.test(z))).toEqual([]);
  });

  it("Gegenprobe: „Podepsal jsem smlouvu.“, „Jsem rád.“, „Chtěla bych volno.“, „Dostal jsi výplatu?“, „Manžel je doma.“ gefunden; „Hypotéku splácíme.“ nicht", () => {
    for (const z of ["Podepsal jsem smlouvu.", "Jsem rád.", "Chtěla bych volno.", "Jsem unavená."]) expect(GEGENDERTES_ICH.test(z), z).toBe(true);
    for (const z of ["Dostal jsi výplatu?", "Jsi sama?"]) expect(GEGENDERTES_DU.test(z), z).toBe(true);
    expect(ROLLE.test("Manžel je doma.")).toBe(true);
    for (const z of ["Hypotéku splácíme ještě dvacet let.", "Družstevní byt jsme převedli do osobního vlastnictví.", "Pokutu dostal Milan."]) {
      expect(GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z) || ROLLE.test(z), z).toBe(false);
    }
  });
});

// ── Orte und Namen: alle vierzehn Kraje, Böhmen UND Mähren/Schlesien ─────────

/**
 * Eigennamen der Charge (klein, so wie der Wortschatz-Wächter sie sieht) - Personen, Orte, Landschaften, Ämter, Marken.
 * Nur Benutztes, nur noch nicht Bekanntes. Sie sind belegt, weil sie Namen sind (ein Wörterbuch gibt es nicht).
 */
const EIGENNAMEN: Readonly<Record<string, string>> = {
  // Vornamen, beide Geschlechter; Olena und Taras (Ukraine), Thanh (Vietnam): sachlich, ohne Herkunftsetikett
  ivana: "Vorname", ivano: "Vok. von Ivana", ivanu: "Akk. von Ivana", matěj: "Vorname", moniko: "Vok. von Monika",
  milan: "Vorname", kamil: "Vorname", jirka: "Vorname (Jiří)", pavla: "Vorname", hana: "Vorname",
  olena: "Vorname (ukrainisch)", taras: "Vorname (ukrainisch)", thanh: "Vorname (vietnamesisch)",
  // Länder, Landesteile, Landschaften
  polsku: "Lok. von Polsko (Polen)", polskem: "Instr. von Polsko", čechách: "Lok. Pl. von Čechy (Böhmen)",
  moravě: "Lok. von Morava (Mähren)", moravy: "Gen. von Morava (der Fluss)", vídně: "Gen. von Vídeň (Wien)",
  vysočině: "Lok. von Vysočina", šumavě: "Lok. von Šumava (Böhmerwald)", krkonoších: "Lok. von Krkonoše (Riesengebirge)",
  beskydech: "Lok. von Beskydy", hané: "Lok. von Haná (Landschaft um Olomouc)", těšínsku: "Lok. von Těšínsko (Teschener Land)",
  ostravsku: "Lok. von Ostravsko", sokolovsku: "Lok. von Sokolovsko", chebsku: "Lok. von Chebsko", třeboňsku: "Lok. von Třeboňsko",
  // Städte
  mikulova: "Gen. von Mikulov", kolína: "Gen. von Kolín", kolíně: "Lok. von Kolín", kladna: "Gen. von Kladno",
  poděbradech: "Lok. von Poděbrady (Lázně)", budějovicích: "Lok. von České Budějovice", plzni: "Lok. von Plzeň",
  klatov: "Gen. von Klatovy", žatci: "Lok. von Žatec", ústí: "Ústí nad Labem", turnově: "Lok. von Turnov",
  pardubicích: "Lok. von Pardubice", humpolce: "Gen. von Humpolec (an der D1)", brně: "Lok. von Brno", brna: "Gen. von Brno",
  pasohlávkách: "Lok. von Pasohlávky (bei Mikulov)", prostějově: "Lok. von Prostějov", luhačovicích: "Lok. von Luhačovice (Lázně)",
  otrokovicích: "Lok. von Otrokovice", ostravy: "Gen. von Ostrava", kopřivnici: "Lok. von Kopřivnice (Tatra)", třinci: "Lok. von Třinec",
  // Ämter, Einrichtungen, Marken, Programme
  čssz: "Česká správa sociálního zabezpečení (Sozialversicherung)", tyfloservis: "Tyfloservis, o.p.s. (Beratung bei Sehbehinderung)",
  lítačka: "Lítačka (Fahrkarte des Prager Nahverkehrs)", budvar: "Budějovický Budvar (Brauerei)",
  aqualand: "Aqualand Moravia (Wasserpark)", moravia: "Aqualand Moravia", excelu: "Lok. von Excel (Programm)",
  wordu: "Lok. von Word (Programm)",
};

/** Die vierzehn Kraje - erkannt an Wortformen der Zeilen (klein). Jeder Kraj mindestens eine, keiner mehr als 8 Zeilen. */
const KRAJE: Readonly<Record<string, readonly string[]>> = {
  "Praha": ["praha", "prahy", "praze", "lítačka"],
  "Středočeský": ["kladna", "kolína", "kolíně", "poděbradech"],
  "Jihočeský": ["budějovicích", "budvar", "šumavě", "třeboňsku"],
  "Plzeňský": ["plzni", "klatov"],
  "Karlovarský": ["sokolovsku", "chebsku"],
  "Ústecký": ["žatci", "ústí"],
  "Liberecký": ["turnově"],
  "Královéhradecký": ["krkonoších"],
  "Pardubický": ["pardubicích"],
  "Vysočina": ["humpolce", "vysočině"],
  "Jihomoravský": ["brně", "brna", "brněnském", "mikulova", "pasohlávkách"],
  "Olomoucký": ["hané", "prostějově"],
  "Zlínský": ["luhačovicích", "otrokovicích"],
  "Moravskoslezský": ["ostravsku", "ostravy", "kopřivnici", "třinci", "těšínsku", "beskydech"],
};
const MAEHREN_SCHLESIEN = ["Jihomoravský", "Olomoucký", "Zlínský", "Moravskoslezský"];

const woerter = (z: string): string[] => z.split(/[\s,.?]+/u).filter(Boolean);
const kleinWoerter = (z: string): string[] => woerter(z).map((w) => w.toLowerCase());

function zeilenJeKraj(zeilen: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [kraj, formen] of Object.entries(KRAJE)) {
    out[kraj] = zeilen.filter((z) => kleinWoerter(z).some((w) => formen.includes(w))).length;
  }
  return out;
}

describe("CS-T6: Orte und Namen", () => {
  it("jedes grosse Wort mitten im Satz ist ein Eigenname der Liste (oder ein bekannter Name wie Praha, Německo, Ukrajina)", () => {
    const BEKANNTE_NAMEN = new Set(["praze", "prahy", "německa", "ukrajiny", "chorvatska"]);
    const fehler: string[] = [];
    for (const z of ZEILEN) {
      woerter(z).slice(1).forEach((w) => {
        const k = w.toLowerCase();
        if (w !== k && !(k in EIGENNAMEN) && !BEKANNTE_NAMEN.has(k)) fehler.push(`"${z}": ${w}`);
      });
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("alle vierzehn Kraje haben eine Zeile, keiner mehr als 8; Mähren und Schlesien mindestens 12 Zeilen", () => {
    const je = zeilenJeKraj(ZEILEN);
    expect(Object.entries(je).filter(([, n]) => n === 0)).toEqual([]);
    expect(Object.entries(je).filter(([, n]) => n > 8)).toEqual([]);
    expect(MAEHREN_SCHLESIEN.reduce((s, k) => s + je[k], 0)).toBeGreaterThanOrEqual(12);
  });

  it("Gegenprobe: eine Zeile ohne Ort zählt nirgends, „V Třinci“ zählt für Moravskoslezský", () => {
    const je = zeilenJeKraj(["Termín se posouvá.", "V Třinci se vaří ocel."]);
    expect(je["Moravskoslezský"]).toBe(1);
    expect(Object.values(je).reduce((a, b) => a + b, 0)).toBe(1);
  });
});

// ── Wortschatz: Wortgrenze, Bewegungsverben, Sperrliste, Belege, Diakritik ──────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht (Liste wie CS-T1 bis CS-T4). */
const FUNKTIONSWOERTER = new Set(
  (
    "a i ani ale nebo s se si k ke v ve na do od o u z ze po pro za nad pod " +
    "je jsou jsem jsme jsi jste to ten ta ty tu tam sem tak jak kde kam jen ne ano jo " +
    "mi mě mně tě ho mu můj moje moji tvůj tvoje náš naše dnes"
  ).split(" "),
);

/**
 * ★ CS-T9 (09.10.2026): gezählt werden nur Buchstabenfolgen - die Ende-Charge hat allein stehende `-`, `=`, `|`, die
 * `kleinWoerter` als „Wort in 10 Zeilen“ las (Muster CS-T7 am T4-Wächter). Für T6 selbst ändert sich nichts.
 */
function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    for (const w of new Set(z.toLowerCase().match(/\p{L}+/gu) ?? [])) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** CS-T1 §2/§4: Bewegungsverben (jet, jít) und les sparsam. Hier gemessen 1 - Grenze 3. */
const BEWEGUNG =
  /(^|\s)(ne)?(u|od|do|při|pře|vy|za|s|po)?(jet|jedu|jedeš|jede|jedeme|jedete|jedou|jel|jela|jeli|jely|jít|jdu|jdeš|jde|jdeme|jdete|jdou|jdi|jděte|šel|šla|šli|půjdeme|les|lesa|lese|lesem|lesy|lesů)(?=[\s,.?]|$)/iu;
const BEWEGUNG_GRENZE = 3;

describe("CS-T6: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("★ Wortbudget über ALLE Erwachsenen-Chargen von „cs“ zusammen (T3 + T6 + T9): kein Inhaltswort in mehr als 8 Zeilen", () => {
    expect(ERWACHSENE_ANDERE()).toEqual(expect.arrayContaining(T3));
    const fehler = zuHaeufig([...ZEILEN, ...ERWACHSENE_ANDERE()]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross am Satzanfang), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => (i === 0 ? `Nájem je ${"abcdefghi"[i]}.` : `Je to nájem ${"abcdefghi"[i]}.`));
    expect(zuHaeufig(neun)).toEqual(['"nájem": 9 Zeilen']);
  });

  it(`Bewegungsverben und „les“ sparsam: höchstens ${BEWEGUNG_GRENZE} Zeilen (CS-T1 §4)`, () => {
    const treffer = ZEILEN.filter((z) => BEWEGUNG.test(z));
    expect(treffer.length, treffer.join("\n")).toBeLessThanOrEqual(BEWEGUNG_GRENZE);
  });

  it("Gegenprobe: nejede, Jedeme, Půjdeme werden erkannt; jezdíme, dojíždí, Jednou nicht", () => {
    for (const z of ["Do Mikulova nejede ani linka.", "Jedeme vlakem.", "Půjdeme spolu."]) expect(BEWEGUNG.test(z), z).toBe(true);
    for (const z of ["Na chalupu jezdíme každý víkend.", "Do Ústí dojíždí Pavla vlakem.", "Jednou týdně."]) {
      expect(BEWEGUNG.test(z), z).toBe(false);
    }
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis", () => {
    const fehler = ZEILEN.flatMap((t) => kleinWoerter(t).filter((w) => gesperrtCs(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurva (Kern), vole (Wortbasis) gefunden; exekucí, smogová, hygiena, schůzku nicht", () => {
    expect(istKernGesperrtCs("kurva")).toBe(true);
    expect(gesperrtCs("vole")).toBe(true);
    for (const w of ["exekucí", "smogová", "hygiena", "schůzku", "sekáme"]) expect(gesperrtCs(w), w).toBe(false);
  });
});

/**
 * Wörter dieser Charge, die NICHT in `WORDS_CS`, `STUFE_VOCAB_CS` oder `NACHTRAG_CS` (Tatoeba-Formen mit mindestens zwei
 * Belegen) stehen und keine Eigennamen sind - mit Begründung, weil es für Tschechisch kein Wörterbuch gibt (Falle 61).
 * Alle sind gewöhnliche Wörter des Erwachsenenalltags bzw. regelmässige Formen [G: eigenes Sprachwissen]; sie gehören in
 * die Lese-Abnahme durch eine Person mit Tschechisch als Erstsprache (P7). Über den Korpus kommen sie ins Vorlese-Lexikon.
 */
const OHNE_TATOEBA_BELEG: Readonly<Record<string, string>> = {
  // Arbeit
  směna: "Schicht (f.)", směně: "Lok. Sg. von směna", dílně: "Lok. Sg. von dílna (Werkstatt)", porada: "Besprechung (f.)",
  pondělní: "Adj. Montags-", nedělní: "Adj. Sonntags-", úterní: "Adj. Dienstags-", ospalí: "Nom. Pl. m. von ospalý (schläfrig) - Mehrzahl",
  strojírně: "Lok. Sg. von strojírna (Maschinenbaubetrieb)", zastupuje: "3. Sg. von zastupovat (vertreten)",
  traktoristu: "Akk. Sg. von traktorista (Traktorfahrer)", dojíždíme: "1. Pl. von dojíždět (pendeln)",
  dojíždí: "3. Sg. von dojíždět; se dojíždí unpersönlich", zkušební: "Adj. Probe- (zkušební doba: Probezeit)",
  přesčasy: "Nom. Pl. von přesčas (Überstunde)", proplácejí: "3. Pl. von proplácet (vergüten)", výplata: "Lohnauszahlung (f.)", výplatu: "Akk. Sg. von výplata",
  šéfová: "Chefin (f.)", kamionů: "Gen. Pl. von kamion (Lkw)", povinnou: "Akk. Sg. f. von povinný (Pflicht-)",
  schválení: "Genehmigung (n.)", písemně: "schriftlich (Adverb)", kolegyně: "Kollegin (f.)", agenturu: "Akk. Sg. von agentura (Personalagentur)",
  expedici: "Lok. Sg. von expedice (Versandabteilung)", rekvalifikaci: "Akk. Sg. von rekvalifikace (Umschulung)",
  tlumočnice: "Dolmetscherin (f.)", úraz: "Unfall (m.; pracovní úraz)", odpadá: "3. Sg. von odpadat (fällt aus)",
  sídlo: "Sitz (n.; Firmensitz)", dobrovolní: "Nom. Pl. m. von dobrovolný (dobrovolní hasiči: freiwillige Feuerwehr)", ocel: "Stahl (f.)", chemička: "Chemiewerk (f., hovorové)", obleky: "Nom. Pl. von oblek (Anzug)",
  šijí: "3. Pl. von šít (nähen); se šijí", trolejbusy: "Akk. Pl. von trolejbus", granáty: "Nom. Pl. von granát (böhmischer Granat)",
  chmel: "Hopfen (m.)", veletrh: "Messe (m.)", výstavišti: "Lok. Sg. von výstaviště (Messegelände)", brněnském: "Lok. Sg. n. von brněnský",
  splatnosti: "Gen. Sg. von splatnost (po splatnosti: überfällig)", faktury: "Akk. Pl. von faktura (Rechnung)",
  // Ämter, Geld, Post
  datové: "Gen. Sg. f. von datový (datová schránka: amtliche Datenbox)", schránky: "Gen. Sg. von schránka",
  datovkou: "Instr. Sg. von datovka (hovorové für datová schránka)", daňové: "Adj. n. Steuer- (daňové přiznání: Steuererklärung)",
  přiznání: "Erklärung (n.)", nemovitostí: "Gen. Pl. von nemovitost (daň z nemovitostí: Grundsteuer)",
  finančním: "Lok. Sg. m. von finanční (finanční úřad: Finanzamt)", úřadě: "Lok. Sg. von úřad", úřední: "Adj. amtlich",
  fronta: "Warteschlange (f.)", občanka: "Personalausweis (f., hovorové für občanský průkaz)", březnu: "Lok. Sg. von březen (März)",
  vyřizuje: "3. Sg. von vyřizovat; se vyřizuje (wird bearbeitet)", podáme: "1. Pl. Futur von podat (einreichen)",
  identitou: "Instr. Sg. von identita (bankovní identita)", přihlásíme: "1. Pl. Futur von přihlásit se (sich anmelden)",
  portálu: "Gen. Sg. von portál", občana: "Gen. Sg. von občan (Portál občana: Behördenportal)", poplatek: "Gebühr (m.)",
  převodem: "Instr. Sg. von převod (Überweisung)", přeplatek: "Guthaben aus der Abrechnung (m.)", úvěr: "Kredit (m.)",
  spořicí: "Adj. Spar- (spořicí účet)", úrok: "Zins (m.)", splátkami: "Instr. Pl. von splátka (Rate)",
  exekuce: "Pfändung (f.)", exekucí: "Instr. Sg. von exekuce", dluhová: "Adj. f. Schulden- (dluhová poradna: Schuldnerberatung)",
  poradna: "Beratungsstelle (f.)", pošťák: "Briefträger (m.)", receptu: "Gen. Sg. von recept (Rezept)",
  nedostanete: "2. Pl. Futur verneint von dostat", ceník: "Preisliste (m.)", rozhlas: "Lautsprecheranlage (m.; obecní rozhlas)",
  odstávku: "Akk. Sg. von odstávka (Abschaltung; odstávka vody)", vyhlašuje: "3. Sg. von vyhlašovat; se vyhlašuje (wird ausgerufen)",
  smogová: "Adj. f. Smog- (smogová situace)", hygiena: "Hygieneamt (f., hovorové für krajská hygienická stanice)",
  dotace: "Fördergeld (Pl.)", kotlíkové: "Nom. Pl. f. von kotlíkový (kotlíkové dotace: Förderung für den Heizkesseltausch)",
  // Gesundheit
  neschopenku: "Akk. Sg. von neschopenka (Krankschreibung, hovorové)", elektronicky: "elektronisch (Adverb)",
  nemocenská: "Krankengeld (f.)", pojišťovna: "Versicherung (f.; zdravotní pojišťovna)", pojišťovny: "Gen. Sg. von pojišťovna",
  proplatí: "3. Sg. Futur von proplatit (erstatten)", kartičku: "Akk. Sg. von kartička (Versichertenkarte)",
  praktický: "praktický lékař (Hausarzt)", ordinuje: "3. Sg. von ordinovat (Sprechstunde haben)",
  pohotovosti: "Lok. Sg. von pohotovost (Notdienst)", objednáváme: "1. Pl. von objednávat se (einen Termin machen)",
  klíšťatům: "Dat. Pl. von klíště (Zecke)", očkujeme: "1. Pl. von očkovat (impfen)", odběr: "Entnahme (m.; odběr krve)",
  nalačno: "nüchtern (Adverb)", měříme: "1. Pl. von měřit (messen)", rentgen: "Röntgen (m.)", dýchací: "Adj. Atem- (dýchací cesty)",
  // Wohnen
  pronájem: "Miete, Mietverhältnis (m.)", prodloužili: "l-Partizip Pl. von prodloužit (verlängern) - „man, sie“",
  nájmy: "Nom. Pl. von nájem (Mieten)", nájmů: "Gen. Pl. von nájem", kauce: "Kaution (f.)", výši: "Lok. Sg. von výše (ve výši: in Höhe von)",
  záloha: "Anzahlung (f.)", zálohu: "Akk. Sg. von záloha", zálohy: "Nom. Pl. von záloha (Abschläge für Energie)",
  zvedly: "l-Partizip f. Pl. von zvednout se (zálohy)", společenství: "společenství vlastníků (Eigentümergemeinschaft)",
  vlastníků: "Gen. Pl. von vlastník (Eigentümer)", družstevní: "Adj. Genossenschafts-", převedli: "l-Partizip Pl. von převést (überführen)",
  osobního: "Gen. Sg. n. von osobní (osobní vlastnictví: Eigentum)", hypotéku: "Akk. Sg. von hypotéka", splácíme: "1. Pl. von splácet (abzahlen)",
  kominík: "Schornsteinfeger (m.)", vyváží: "3. Sg. von vyvážet (leeren); se vyváží unpersönlich", tříděný: "Adj. getrennt (tříděný odpad)",
  kontejnerů: "Gen. Pl. von kontejner", vrátnici: "Lok. Sg. von vrátnice (Pförtnerloge)", kotle: "Gen. Sg. von kotel (Heizkessel)",
  výměnu: "Akk. Sg. von výměna (Austausch)", netopí: "3. Sg. verneint von topit (heizen); se netopí", dřevem: "Instr. Sg. von dřevo (Holz)",
  stoupl: "l-Partizip m. von stoupnout (steigen) - Subjekt nájem", stěhujeme: "1. Pl. von stěhovat se (umziehen)",
  střídáme: "1. Pl. von střídat se (sich abwechseln)", sušíme: "1. Pl. von sušit (trocknen)", parkujeme: "1. Pl. von parkovat",
  sekáme: "1. Pl. von sekat (mähen)", schovejte: "Imperativ 2. Pl. von schovat (aufheben)", chalupu: "Akk. Sg. von chalupa (Wochenendhaus)",
  // Familie, Essen, Alltag
  mamce: "Dat. Sg. von mamka (Mama, hovorové)", voláme: "1. Pl. von volat", chystáme: "1. Pl. von chystat (vorbereiten)",
  zápis: "Einschreibung (m.; zápis do první třídy)", zapisuje: "3. Sg. von zapisovat; se zapisuje (Anmeldung)", školka: "Kindergarten (f.)",
  rodičovské: "Lok. Sg. f. von rodičovská (Elternzeit, hovorové)", hospoda: "Wirtshaus (f.)", návsi: "Lok. Sg. von náves (Dorfplatz)",
  lípa: "Linde (f.)", nakoupíme: "1. Pl. Futur von nakoupit (einkaufen)", nakládáme: "1. Pl. von nakládat (einlegen; zelí)",
  bramboráky: "Nom. Pl. von bramborák (Kartoffelpuffer)", smaží: "3. Sg. von smažit (braten); se smaží", sádle: "Lok. Sg. von sádlo (Schmalz)",
  vepřo: "vepřo knedlo zelo (Schweinebraten, Knödel, Kraut) - feste Wendung", knedlo: "dieselbe Wendung", zelo: "dieselbe Wendung",
  klasika: "Klassiker (f.)", kulajda: "südböhmische Pilzsuppe (f.)", houbami: "Instr. Pl. von houba (Pilz)", vejcem: "Instr. Sg. von vejce (Ei)",
  chlebíčky: "Akk. Pl. von chlebíček (belegtes Brot)", lahůdkách: "Lok. Pl. von lahůdky (Feinkostgeschäft)",
  gratulujeme: "1. Pl. von gratulovat", šetříme: "1. Pl. von šetřit (sparen)", klientce: "Dat. Sg. von klientka (Kundin)",
  omluvíme: "1. Pl. Futur von omluvit se", domluvíme: "1. Pl. Futur von domluvit se (sich absprechen)", neříkáme: "1. Pl. verneint von říkat",
  ověřte: "Imperativ 2. Pl. von ověřit (überprüfen)", přečtěte: "Imperativ 2. Pl. von přečíst", telefonem: "Instr. Sg. von telefon",
  posíláme: "1. Pl. von posílat", posílají: "3. Pl. von posílat", pošlou: "3. Pl. Futur von poslat",
  ozvete: "2. Pl. Futur von ozvat se (sich melden)", podepíšeme: "1. Pl. Futur von podepsat", maily: "Akk. Pl. von mail (hovorové)",
  předčítat: "vorlesen (Inf.)", mobilu: "Lok. Sg. von mobil (Handy)", smlouvy: "Gen. Sg. von smlouva (Vertrag)",
  maximálně: "höchstens (Adverb)", wellness: "Wellness (n., unveränderlich)",
  // Verkehr, Reisen, Land
  koloně: "Lok. Sg. von kolona (Stau)", tankuje: "3. Sg. von tankovat; se tankuje unpersönlich", hranicích: "Lok. Pl. von hranice (Grenze)",
  nekontroluje: "3. Sg. verneint von kontrolovat; se nekontroluje", dálniční: "Adj. Autobahn- (dálniční známka: Vignette)",
  cyklostezka: "Radweg (f.)", hřebenech: "Lok. Pl. von hřeben (Bergkamm)", turistických: "Gen. Pl. von turistický (turistické značky)",
  značek: "Gen. Pl. von značka (Wanderzeichen)", zabloudit: "sich verirren (Inf.)", opravně: "Lok. Sg. von opravna (Werkstatt)",
  posouvá: "3. Sg. von posouvat se (sich verschieben)", hlásí: "3. Sg. von hlásit (melden); hlásit se: sich bewerben",
  vylovují: "3. Pl. von vylovovat (Teich abfischen); se vylovují", rybníky: "Nom. Pl. von rybník (Teich)", těžilo: "l-Partizip n. von těžit (fördern); se těžilo",
  hanácky: "auf Hanakisch (Adverb)", našimu: "Dialekt des Teschener Landes: po našimu (auf unsere Art)", pěstují: "3. Pl. von pěstovat; se pěstují",
  // Erblindung ohne Etikett
  vodicím: "Instr. Sg. m. von vodicí (vodicí pes: Blindenführhund)", výcvik: "Training (m.; výcvik s bílou holí)",
  zvukový: "Adj. Ton- (zvukový signál an der Ampel)",
};

const VORHER_BEKANNT: ReadonlySet<string> = new Set(
  [...WORDS_CS, ...Object.values(STUFE_VOCAB_CS).flat(), ...NACHTRAG_CS].map((w) => w.toLowerCase()),
);

/** Wörter (ab zwei Buchstaben), die weder vorher bekannt waren noch begründet in einer der zwei Listen stehen. */
function ungeprueft(zeilen: string[]): string[] {
  const out = new Set<string>();
  for (const z of zeilen) {
    for (const w of kleinWoerter(z)) {
      if (w.length >= 2 && !VORHER_BEKANNT.has(w) && !(w in OHNE_TATOEBA_BELEG) && !(w in EIGENNAMEN)) out.add(w);
    }
  }
  return [...out];
}

/** Der kuratierte Wortschatz (von Hand gelesen) - gegen ihn prüft die Diakritik-Falle. */
const KURATIERT: ReadonlySet<string> = new Set([...WORDS_CS, ...Object.values(STUFE_VOCAB_CS).flat()].map((w) => w.toLowerCase()));
const AKZENT_VARIANTEN: Readonly<Record<string, readonly string[]>> = {
  a: ["á"], e: ["é", "ě"], i: ["í"], o: ["ó"], u: ["ú", "ů"], y: ["ý"], c: ["č"], s: ["š"], r: ["ř"], z: ["ž"],
  d: ["ď"], t: ["ť"], n: ["ň"],
};

/** Die Diakritik-Falle (CS-T1): ein Wort ausserhalb des kuratierten Wortschatzes, dessen Form MIT Haken/Strich dort steht. */
function diakritikVerdacht(zeilen: string[]): string[] {
  const out: string[] = [];
  for (const w of new Set(zeilen.flatMap(kleinWoerter))) {
    if (KURATIERT.has(w)) continue;
    let formen = [""];
    for (const ch of w) formen = formen.flatMap((f) => [ch, ...(AKZENT_VARIANTEN[ch] ?? [])].map((x) => f + x));
    const treffer = formen.filter((v) => v !== w && KURATIERT.has(v));
    if (treffer.length > 0) out.push(`${w} (gemeint ${treffer.join("/")}?)`);
  }
  return out;
}

describe("CS-T6: Belege, Stimme, Diakritik", () => {
  it("jedes Wort stand schon im Wortschatz oder in den Tatoeba-Formen - oder steht begründet in einer der zwei Listen", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Listen tragen nur, was wirklich gebraucht wird und nicht schon bekannt ist (sonst wachsen sie still).
    const benutzt = new Set(ZEILEN.flatMap(kleinWoerter));
    const ueberfluessig = [...Object.keys(OHNE_TATOEBA_BELEG), ...Object.keys(EIGENNAMEN)].filter(
      (w) => !benutzt.has(w) || VORHER_BEKANNT.has(w),
    );
    expect(ueberfluessig).toEqual([]);
    expect(Object.keys(OHNE_TATOEBA_BELEG).filter((w) => w in EIGENNAMEN)).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und eine falsche Endung werden gemeldet, ein Name der Liste nicht", () => {
    expect(ungeprueft(["Nájem je kaucex.", "Dva přesčasové."])).toEqual(["kaucex", "přesčasové"]);
    expect(ungeprueft(["Olena je v Brně."])).toEqual([]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58)", () => {
    const buchstabiert = ZEILEN.filter((z) => kleinWoerter(z).some((w) => w.length >= 2 && !isRealWord(w, "cs")));
    expect(buchstabiert).toEqual([]);
  });

  it("kein Wort ohne den Haken oder Strich, den es braucht (Diakritik-Falle)", () => {
    expect(diakritikVerdacht(ZEILEN)).toEqual([]);
  });

  it("Gegenprobe: „Mam volno.“ und „Muze to byt.“ werden gemeldet, „Mám volno.“ nicht", () => {
    expect(diakritikVerdacht(["Mam volno."]).length).toBeGreaterThan(0);
    expect(diakritikVerdacht(["Muze to byt."]).length).toBeGreaterThan(0);
    expect(diakritikVerdacht(["Mám volno."])).toEqual([]);
  });
});

// ── Keine Kopien, keine Paare, nichts fast gleich ─────────────────────────────

const ohneZeichen = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim();
const wortMenge = (t: string) => new Set(ohneZeichen(t).split(" ").filter(Boolean));
function jaccard(a: Set<string>, b: Set<string>): number {
  let s = 0;
  for (const x of a) if (b.has(x)) s++;
  return s / (a.size + b.size - s);
}

/** Geschlecht und Zahl gleichgesetzt (wie CS-T1 bis CS-T4), auf der Fassung ohne Satzzeichen und klein. */
function paarForm(zeile: string): string {
  const pron: Record<string, string> = { on: "PRO", ona: "PRO", ono: "PRO", oni: "PRO", ony: "PRO" };
  return ohneZeichen(zeile)
    .split(" ")
    .map((w) => pron[w] ?? w.replace(/(ou|em|ům|ech|[aeiouyáéíýěů])$/u, ""))
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

function fastGleichEigen(zeilen: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i < zeilen.length; i++) {
    for (let j = i + 1; j < zeilen.length; j++) {
      if (jaccard(wortMenge(zeilen[i]), wortMenge(zeilen[j])) >= 0.5) out.push(`"${zeilen[i]}" ~ "${zeilen[j]}"`);
    }
  }
  return out;
}

/** Nähe 0,5 bis unter 0,6 zu anderen cs-Zeilen: gelesen (Befund §4). Eine NEUE Nähe muss hier eingetragen werden. */
const NAH_AN_ANDEREN_CS: Readonly<Record<string, string>> = {};

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
const FREMDE_KORPORA = () => [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR];
/** Alles, was sonst Text trägt: alle Korpora (cs ROH), alle Serien aller Sprachen, alle Prüfungstext-Banken - Zeile UND Satz. */
function alleFremdenZeilen(): string[] {
  const roh = [
    ...FREMDE_KORPORA().map((i) => i.text),
    ...ANDERE_CS_ZEILEN(),
    ...SERIEN.flatMap((s) => s.etappen.flatMap((e) => e.lines)),
    ...bankZeilen(),
  ];
  return [...new Set(roh.flatMap((z) => [z, ...z.split(/(?<=[.!?])\s+/u)]))];
}

describe("CS-T6: keine Kopien, keine Paare, nichts fast gleich", () => {
  it("die Vergleichsmenge ist voll (rohe cs-Liste mit T1 bis T4, Serien und Banken geladen)", () => {
    expect(ANDERE_CS_ZEILEN()).toEqual(expect.arrayContaining([...T1, ...T3]));
    expect(ANDERE_CS().some((i) => i.stufen.includes("teens"))).toBe(true);
    expect(ANDERE_CS().filter((i) => i.stufen.includes("kids")).length).toBeGreaterThan(T1.length);
    expect(bankZeilen().length).toBeGreaterThan(1000);
    expect(SERIEN.length).toBeGreaterThan(100);
    for (const k of [CORPUS_IT, CORPUS_PL, CORPUS_TR]) expect(k.length).toBeGreaterThan(0);
  });

  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der Háček und Čárka nicht kennt)", () => {
    expect(new Set(ZEILEN).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer fremden Zeile, einer anderen cs-Zeile oder einem Satz (ohne Satzzeichen, klein) - auch nicht im Ledger-Schlüssel", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneZeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    expect(ZEILEN.filter((t) => texte.has(ohneZeichen(t)) || schluessel.has(bausteinKey("satz", t)))).toEqual([]);
  });

  it("Gegenprobe: eine T3-Zeile gross mit Punkt, eine Fassung mit Akzentfehler, eine Serienzeile und ein Banken-Satz werden erkannt", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneZeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    // „Kotel nejede." hätte denselben Schlüssel wie die T3-Zeile „kotel nejede" - mergeCorpus verschmölze sie still.
    expect(texte.has(ohneZeichen("Kotel nejede."))).toBe(true);
    expect(schluessel.has(bausteinKey("satz", "Dal sál."))).toBe(true); // T1 „dal sůl": ů und á werden Trenner
    expect(texte.has(ohneZeichen(SERIEN[0].etappen[0].lines[0]))).toBe(true);
    expect(texte.has(ohneZeichen(bankZeilen()[0].split(/(?<=[.!?])\s+/u)[0]))).toBe(true);
  });

  it("keine Paare in der Charge und keines mit einer anderen cs-Zeile (nur Geschlecht oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN, ANDERE_CS_ZEILEN());
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Pokutu dostal/dostala, on/ona und eine T3-Zeile mit getauschtem Geschlecht werden als Paar erkannt", () => {
    expect(paare(["Pokutu dostal Milan.", "Pokutu dostala Milan."])).toHaveLength(1);
    expect(paare(["On je v práci.", "Ona je v práci."])).toHaveLength(1);
    expect(paare(["Nafta klesl."], T3)).toHaveLength(1);
    expect(paare(["Termín se posouvá."], T3)).toEqual([]);
  });

  it("innerhalb der Charge nichts fast gleich (die Hälfte der Wörter geteilt)", () => {
    const fehler = fastGleichEigen(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("nichts fast gleich gegen fremde Zeilen und andere cs-Zeilen (Wortmenge, Jaccard ≥ 0,6)", () => {
    const fremd = alleFremdenZeilen().map((t) => [t, wortMenge(t)] as const);
    const fehler: string[] = [];
    for (const z of ZEILEN) {
      const m = wortMenge(z);
      for (const [t, f] of fremd) if (jaccard(m, f) >= 0.6) fehler.push(`"${z}" ~ "${t}"`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die Nähe zu anderen cs-Zeilen (Jaccard 0,5 bis unter 0,6) ist genau die gelesene Liste", () => {
    const nah: Record<string, string> = {};
    for (const z of ZEILEN) {
      for (const t of ANDERE_CS_ZEILEN()) {
        const j = jaccard(wortMenge(z), wortMenge(t));
        if (j >= 0.5 && j < 0.6) nah[z] = t;
      }
    }
    expect(nah).toEqual(NAH_AN_ANDEREN_CS);
  });

  it("Gegenprobe: „V dílně je dnes klid.“ neben „v lese je klid“ (T1) ist nah, „Kotel nejede, volejte.“ neben „kotel nejede“ (T3) fast gleich", () => {
    expect(jaccard(wortMenge("V dílně je dnes klid."), wortMenge("v lese je klid"))).toBe(0.5);
    expect(jaccard(wortMenge("Kotel nejede, volejte."), wortMenge("kotel nejede"))).toBeGreaterThanOrEqual(0.6);
    expect(fastGleichEigen(["Výplata chodí patnáctého.", "Výplata chodí desátého."])).toHaveLength(1);
  });
});

// ── Anker und Auslieferung ────────────────────────────────────────────────

describe("CS-T6: Korpus-Anker und Auslieferung", () => {
  it("die rohe Sammelliste trägt die Charge als Block HINTER CS-T3, die geladene und korpusFuer(\"cs\") jede Zeile", () => {
    const ab = CS_ROH.indexOf(CHARGE[0]);
    expect(ab).toBeGreaterThan(CS_ROH.indexOf(CORPUS_CS_WEG_FRUEH_ERWACHSENE[CORPUS_CS_WEG_FRUEH_ERWACHSENE.length - 1]));
    expect(CS_ROH.slice(ab, ab + CHARGE.length)).toEqual(CHARGE);
    const geladen = new Set(CS_GELADEN.map((i) => i.text));
    const fuer = new Set(korpusFuer("cs").map((i) => i.text));
    expect(ZEILEN.filter((t) => !geladen.has(t) || !fuer.has(t))).toEqual([]);
  });

  it("jede Zeile bringt eine EIGENE ID in den Anker (keine stille Verschmelzung mit einer Zeile irgendeines Korpus)", () => {
    const fremdeIds = new Set([...FREMDE_KORPORA(), ...ANDERE_CS()].map((i) => bausteinId(i.kind, i.text)));
    expect(CHARGE.filter((i) => fremdeIds.has(bausteinId(i.kind, i.text))).map((i) => i.text)).toEqual([]);
    expect(new Set(CHARGE.map((i) => bausteinId(i.kind, i.text))).size).toBe(CHARGE.length);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CHARGE.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr), eine gross geschriebene T3-Zeile nicht", () => {
    const alle = [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CS_GELADEN];
    const probe = { text: "Zzz probe cs t6.", kind: "satz" as const, stufen: ["erwachsen" as const] };
    expect(manifestFor([...alle, probe]).ids.length).toBe(KORPUS_ANKER.length + 1);
    const kopie = { text: "Kotel nejede.", kind: "satz" as const, stufen: ["erwachsen" as const], nurWeg: "cs" as const };
    expect(manifestFor([...alle, kopie]).ids.length).toBe(KORPUS_ANKER.length);
  });

  for (const l of TASTATUREN) {
    it(`${l}: Erwachsene bekommen an ¨ alle Zeilen, an h (25) genau die bis h, vor ⇧ (D-2, umschalt: false) keine`, () => {
      const { letzte, o } = grenzen(l);
      const alles = corpusItemsFor({ stufe: "erwachsen", allowed: allowedFromIntroduced(o.slice(0, letzte), "cs"), lang: "cs", lernweg: "cs" });
      expect(ZEILEN.filter((t) => !alles.includes(t))).toEqual([]);
      const anH = allowedFromIntroduced(o.slice(0, o.indexOf("h") + 1), "cs");
      const bisH = corpusItemsFor({ stufe: "erwachsen", allowed: anH, lang: "cs", lernweg: "cs" });
      const serviert = (t: string) => fitText(t, anH, "cs");
      const erwartet = ZEILEN.filter((t) => (sprosseAuf(t, l) ?? 99) <= 25);
      expect(erwartet.length).toBeGreaterThanOrEqual(40);
      expect(erwartet.filter((t) => !bisH.includes(serviert(t) ?? t))).toEqual([]);
      expect(ZEILEN.filter((t) => (sprosseAuf(t, l) ?? 0) > 25 && serviert(t) !== null)).toEqual([]);
      // vor ⇧: mit der Auto-Grossschreibung passten die sieben ⇧-Zeilen schon - D-2 hält sie zurück.
      const vorShift = allowedFromIntroduced(o.slice(0, o.indexOf(SHIFT_UNIT)), "cs");
      const frueh = corpusItemsFor({ stufe: "erwachsen", allowed: vorShift, lang: "cs", lernweg: "cs", umschalt: false });
      const servierte = new Set(ZEILEN.flatMap((t) => [t, fitText(t, vorShift, "cs") ?? t]));
      expect(frueh.filter((t) => servierte.has(t))).toEqual([]);
      expect(frueh.filter(hatGrossbuchstaben)).toEqual([]);
      expect(ZEILEN.filter((t) => fitText(t, vorShift, "cs") !== null).length).toBe(7); // Gegenprobe: ohne D-2 kämen sie
    });
  }

  it("Kinder und Jugendliche bekommen keine dieser Zeilen; Weg „de“ und Weg „it“ auch nicht", () => {
    setLayout("cs");
    const o = introOrder("cs");
    const alles = allowedFromIntroduced(o.slice(0, o.indexOf(LETZTE_EINHEIT) + 1), "cs");
    for (const stufe of ["kids", "teens"] as const) {
      const g = corpusItemsFor({ stufe, allowed: alles, lang: "cs", lernweg: "cs" });
      expect(g.length, stufe).toBeGreaterThan(0);
      expect(ZEILEN.filter((t) => g.includes(t)), stufe).toEqual([]);
    }
    setLayout("de");
    const de = corpusItemsFor({ stufe: "erwachsen", allowed: allowedFromIntroduced(introOrder("de"), "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const it_ = corpusItemsFor({ stufe: "erwachsen", allowed: allowedFromIntroduced(introOrder("it"), "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
