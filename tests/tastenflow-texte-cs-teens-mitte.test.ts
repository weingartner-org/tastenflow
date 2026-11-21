/**
 * ★★★ Wächter CS-T5 (09.10.2026): die mittleren cs-Texte für Jugendliche
 * (`corpusCsWegMitteTeens.ts`, Sprossen 18-44 = ⇧ bis ¨, auf `cs` UND `cs-qwerty`).
 * Vorbild: `tastenflow-texte-cs-kids-mitte.test.ts` (CS-T4, dieselben Sprossen) und
 * `tastenflow-texte-cs-teens-frueh.test.ts` (CS-T2: Wortbudget Jugend); Befund `BEFUND-2026-10-09-CS-T5-TEENS-MITTE.md`,
 * Leitfaden Fallen 26/31/37/45/48/51/58/61/76/92-100.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, ab dem `fitText` sie mit `introOrder("cs").slice(0, n)`
 * durchlässt, mindestens aber ⇧ (18) - auf BEIDEN Pflicht-Tastaturen, nie aus einem Kommentar geglaubt.
 *
 * Tschechische Besonderheiten dieser Charge (alle gemessen, jede mit Gegenprobe):
 *  · `. , ?` kommen direkt nach ⇧ (`punktNachShift`, 19-21) und sind weglassbar - zusammen mit der
 *    Auto-Grossschreibung käme eine Zeile nur aus Buchstaben bis `u` schon an Sprosse 17 in die Runden von CS-T2.
 *    Jede Zeile trägt darum einen Buchstaben ab `í` (22); 18-21 haben keine eigene Zeile, geübt werden sie in jeder.
 *  · Grosse Akzentbuchstaben: Č Š Ř Ž … erst ab `ˇ` (37), Á É Í Ú … erst ab `´` (41) - auch mitten im Satz.
 *  · Die Totasten `ˇ` und `´` kommen in keinem Wort selbst vor (Falle 95): sie zeigen sich an ď ť ň bzw. ó oder an
 *    einem grossen Akzentbuchstaben.
 *  · `¨` (44) erzeugt ä ë ö ü - kein tschechisches Wort: keine Zeile, ausdrücklich ausgenommen.
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
import { CORPUS_CS_WEG_MITTE_TEENS } from "../src/lib/typing/corpusCsWegMitteTeens";
import { allowedFromIntroduced, SERIEN } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
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
const CHARGE = CORPUS_CS_WEG_MITTE_TEENS;
const ZEILEN = CHARGE.map((i) => i.text);
/** Alle ANDEREN cs-Zeilen (T1 bis T4 und jede spätere Charge), aus der ROHEN Sammelliste - nicht aus der geladenen. */
const ANDERE_CS = () => CS_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_CS_ZEILEN = (): string[] => ANDERE_CS().map((i) => i.text);
/** Die Jugend-Chargen derselben Stufe (Wortbudget Jugend über T2 + T5 + T8). */
const JUGEND_ANDERE = (): string[] => ANDERE_CS().filter((i) => i.stufen.includes("teens")).map((i) => i.text);
const T1 = CORPUS_CS_WEG_FRUEH_KIDS.map((i) => i.text);
/** Die letzte Einheit des Bereichs (danach kommen `! " : ; ' - ( )` und die Ziffern). */
const LETZTE_EINHEIT = "¨";

function grenzen(layout: LayoutId): { shift: number; letzte: number; o: string[] } {
  setLayout(layout);
  const o = introOrder("cs");
  return { shift: o.indexOf(SHIFT_UNIT) + 1, letzte: o.indexOf(LETZTE_EINHEIT) + 1, o };
}

/** Kleinste Sprosse, an der `fitText` den Text durchlässt (null: nie bis ¨). */
function buchstabenSprosse(text: string, layout: LayoutId = "cs"): number | null {
  const { letzte, o } = grenzen(layout);
  for (let n = 1; n <= letzte; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "cs"), "cs") !== null) return n;
  }
  return null;
}

/** Die Sprosse der Zeile in dieser Charge: nie vor ⇧. */
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

/** ⇧ . , ? (18-21) haben keine eigene Zeile (Auto-Grossschreibung, weglassbar) - sie stecken in jeder. `¨`: kein Wort. */
const OHNE_EIGENE_ZEILE = new Set([SHIFT_UNIT, ".", ",", "?", "¨"]);

describe("CS-T5: jede Zeile an ihrer Sprosse (cs und cs-qwerty)", () => {
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

  it("keine Zeile rutscht über die Auto-Grossschreibung vor `í` (22) - nie in die Runden von CS-T2", () => {
    for (const l of TASTATUREN) {
      const ab = grenzen(l).o.indexOf("í") + 1;
      expect(ab, l).toBe(22);
      const fehler = ZEILEN.filter((t) => (buchstabenSprosse(t, l) ?? 0) < ab);
      expect(fehler, `${l}:\n${fehler.join("\n")}`).toEqual([]);
    }
  });

  it("Gegenprobe: Sprossen werden richtig gerechnet (Auto-Grossschreibung, grosse Akzentbuchstaben, Totasten)", () => {
    for (const l of TASTATUREN) {
      expect(buchstabenSprosse("Jsme doma.", l), l).toBe(13); // gross und Punkt fallen vor ⇧ weg
      expect(sprosseAuf("Jsme doma.", l), l).toBe(18);
      expect(sprosseAuf("Kdo to ví?", l), l).toBe(22);
      expect(sprosseAuf("Ema vidí sovu.", l), l).toBe(22);
      expect(sprosseAuf("šnek leze pomalu.", l), l).toBe(32);
      expect(sprosseAuf("Šnek leze pomalu.", l), l).toBe(37); // grosses Š am Satzanfang: erst mit ˇ
      expect(sprosseAuf("Plzeň je město.", l), l).toBe(37); // ň nur über die Totaste
      expect(sprosseAuf("Byli jsme v Čechách.", l), l).toBe(37); // auch mitten im Satz
      expect(sprosseAuf("Matěj dal gól.", l), l).toBe(41);
      expect(sprosseAuf("Únor je krátký měsíc.", l), l).toBe(41); // grosses Ú: erst mit ´
      expect(sprosseAuf("Kiwi je zelené.", l), l).toBe(42);
      // Jugend: „gymnázium", „brigáda" und „angličtina" brauchen das g (38), „Áčko" das grosse Á (41)
      expect(sprosseAuf("Na gymnáziu máme latinu.", l), l).toBe(38);
      expect(sprosseAuf("Áčko vyhrálo turnaj.", l), l).toBe(41);
      expect(sprosseAuf("áčko vyhrálo turnaj.", l), l).toBe(34); // klein: č (34) ist der späteste Buchstabe
    }
  });

  /** GEMESSEN am Ende von CS-T5 (vom Code gezählt, nicht geschätzt) - jede Grenze darf künftig nur STEIGEN. */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    22: 10, 23: 12, 24: 11, 25: 13, 26: 11, 27: 13, 28: 18, 29: 13, 30: 14, 31: 14, 32: 8, 33: 16, 34: 15, 35: 13,
    36: 11, 37: 22, 38: 14, 39: 8, 40: 6, 41: 7, 42: 4, 43: 1,
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

describe("CS-T5: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37/95)", () => {
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
    it(`${l}: jede Einheit von í bis q hat an ihrer Sprosse Zeilen (W6); ⇧ . , ? und ¨ ausgenommen`, () => {
      const { shift, letzte, o } = grenzen(l);
      const fehlt: string[] = [];
      for (let n = shift; n <= letzte; n++) {
        if (OHNE_EIGENE_ZEILE.has(o[n - 1])) continue;
        if (!ZEILEN.some((t) => sprosseAuf(t, l) === n && enthaeltEinheit(t, o[n - 1]))) fehlt.push(`${n}:${o[n - 1]}`);
      }
      expect(fehlt, "Einheiten ohne Zeile").toEqual([]);
    });
  }

  it("⇧ . , ? stecken in den Zeilen: jede beginnt gross, endet mit . oder ?, mindestens 20 mit Komma, 10 Fragen", () => {
    expect(ZEILEN.filter((t) => !enthaeltEinheit(t[0], SHIFT_UNIT))).toEqual([]);
    expect(ZEILEN.filter((t) => !/[.?]$/u.test(t))).toEqual([]);
    expect(ZEILEN.filter((t) => t.includes(",")).length).toBeGreaterThanOrEqual(20);
    expect(ZEILEN.filter((t) => t.endsWith("?")).length).toBeGreaterThanOrEqual(10);
  });

  it("an ˇ (37) mindestens 12 Zeilen MIT ď ť ň, an ´ (41) mindestens 4 MIT ó - nicht nur grosse Buchstaben", () => {
    const an = (n: number) => ZEILEN.filter((t) => sprosseAuf(t) === n);
    expect(an(37).filter((t) => /[ďťň]/u.test(t)).length).toBeGreaterThanOrEqual(12);
    expect(an(41).filter((t) => /ó/u.test(t)).length).toBeGreaterThanOrEqual(4);
  });

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet; Grossbuchstabe gilt als ⇧, Č als ˇ, Ú als ´", () => {
    expect(enthaeltEinheit("Ema vidí sovu.", SHIFT_UNIT)).toBe(true);
    expect(enthaeltEinheit("ema vidí sovu.", SHIFT_UNIT)).toBe(false);
    expect(enthaeltEinheit("Česko nemá moře.", "ˇ")).toBe(true);
    expect(enthaeltEinheit("V Telči je náměstí.", "ˇ")).toBe(false); // č ist direkt, keine Totaste
    expect(enthaeltEinheit("Úterý.", "´")).toBe(true);
    expect(enthaeltEinheit("V úterý.", "´")).toBe(false); // ú ist direkt
    expect(ohneNeueEinheit([{ text: "Ema vidí sovu.", sprosse: 23 }])).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "Ema vidí sovu.", sprosse: 22 }])).toEqual([]);
  });
});

// ── Form und Hausregeln ─────────────────────────────────────────────────────

/** Nur Buchstaben, Leerzeichen und die Satzzeichen des Bereichs (`. , ?`); gross am Anfang, `.`/`?` am Ende. */
const FORM = /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚÝŽ][a-záčďéěíňóřšťúůýžA-ZÁČĎÉĚÍŇÓŘŠŤÚÝŽ ,]*[a-záčďéěíňóřšťúůýž][.?]$/u;

describe("CS-T5: Form, Regeln des Weges, Einträge", () => {
  it("jede Zeile: gross am Anfang, nur Buchstaben und , . ?, Punkt oder Fragezeichen am Ende, ein Satzende", () => {
    const fehler = ZEILEN.filter((t) => !FORM.test(t) || /[.?]./u.test(t) || /,\S/u.test(t) || t.includes("  "));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Ausrufezeichen, Ziffer, Doppelpunkt, Bindestrich, kleiner Anfang und fehlender Punkt werden gefunden", () => {
    for (const t of ["Hurá!", "Je mi 9 let.", "Pozor: led.", "Wi-fi je tu.", "ema vidí sovu.", "Ema vidí sovu", "Ano. Ne."]) {
      expect(!FORM.test(t) || /[.?]./u.test(t), t).toBe(true);
    }
    expect(FORM.test("Dědo, smím ven?")).toBe(true);
  });

  it("jede Zeile besteht die Regeln aller tschechischen Zeilen (`helfer/csTextRegeln.ts`)", () => {
    const fehler = ZEILEN.flatMap((z) => zeilenFehler(z).map((f) => `"${z}": ${f}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jeder Eintrag: kind satz, stufen [teens], nurWeg cs, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["teens"]);
      expect(item.nurWeg, item.text).toBe("cs");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Geschlecht (Glossar §1 Regel 2) ─────────────────────────────────────────

const W_ENDE = "(?=[\\s,.?]|$)";
const GEGENDERTES_DU = new RegExp(
  `(^|\\s)\\p{L}+(l|la|li|ly) jsi${W_ENDE}|(^|\\s)jsi (\\p{L}+(l|la|li|ly|ý|á)|sám|sama)${W_ENDE}`,
  "iu",
);
/** „ich bin" mit hartem Adjektiv oder l-Partizip legt das Geschlecht der tippenden Person fest. */
const GEGENDERTES_ICH = new RegExp(
  `(^|\\s)\\p{L}+(l|la) jsem${W_ENDE}|(^|\\s)jsem (\\p{L}+(l|la|ý|á)|sám|sama)${W_ENDE}`,
  "iu",
);

describe("CS-T5: keine Zeile legt das Geschlecht der Jugendlichen oder der tippenden Person fest", () => {
  it("kein gegendertes „du“ und kein gegendertes „ich“ (auch nicht vor Komma oder Punkt)", () => {
    expect(ZEILEN.filter((z) => GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z))).toEqual([]);
  });

  it("Gegenprobe: „Byl jsi tam?“, „Jsi unavená.“, „Usnul jsem.“, „Jsem hotový, mami.“ werden gefunden; „Teď jsi na řadě.“ nicht", () => {
    for (const z of ["Byl jsi tam?", "Kde jsi byla?", "Jsi unavená."]) expect(GEGENDERTES_DU.test(z), z).toBe(true);
    for (const z of ["Usnul jsem.", "Jsem hotový, mami.", "Jsem sama."]) expect(GEGENDERTES_ICH.test(z), z).toBe(true);
    for (const z of ["Už jsi doma?", "Vyhráli jsme turnaj.", "Teď nemůžu, jsem na tréninku.", "Psala mi Lenka."]) {
      expect(GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z), z).toBe(false);
    }
  });
});

// ── Orte und Namen: alle vierzehn Kraje, Böhmen UND Mähren/Schlesien ─────────

/**
 * Eigennamen der Charge (klein, so wie der Wortschatz-Wächter sie sieht) - Personen, Orte, Landschaften, Vereine,
 * Festivals, Werke. Jedes grosse Wort mitten im Satz steht hier (oder in `BEKANNTE_NAMEN`); sie sind belegt, weil sie
 * Namen sind. Nur Benutztes, nur noch nicht Bekanntes.
 */
const EIGENNAMEN: Readonly<Record<string, string>> = {
  // Vornamen (beide Geschlechter; Oksana und Linh: Familien aus der Ukraine und aus Vietnam)
  dominik: "Vorname", nikola: "Vorname (in Tschechien meist weiblich)", kamila: "Gen. von Kamil (Vorname)",
  lenka: "Vorname", lucie: "Vorname", lucií: "Instr. von Lucie", bára: "Vorname (Barbora)", báry: "Gen. von Bára",
  bárou: "Instr. von Bára", lukáš: "Vorname", oksana: "Vorname (ukrainisch)", eliška: "Vorname", linh: "Vorname (vietnamesisch)",
  // Personen der Kultur und Geschichte
  erbena: "Gen. von Erben (Karel Jaromír Erben, Kytice)", karla: "Gen. von Karel (Karel Čapek)", čapka: "Gen. von Čapek",
  baťovi: "Dat. von Baťa (Tomáš Baťa, Zlín)", baťův: "Possessiv zu Baťa (Baťův mrakodrap)", dvořák: "Antonín Dvořák (Komponist)",
  leoš: "Vorname (Leoš Janáček)", janáček: "Leoš Janáček (Komponist)", bohuslav: "Vorname (Bohuslav Martinů)",
  martinů: "Bohuslav Martinů (Komponist)",
  // Werke, Vereine, Festivals, Rennen, Museen
  kytice: "Kytice (Gedichtband von K. J. Erben)", novosvětskou: "Akk. von Novosvětská (Dvořáks Symfonie Z Nového světa)",
  kometa: "HC Kometa Brno (Eishockey)", colours: "Colours of Ostrava (Festival)", of: "Colours of Ostrava (Festival)",
  for: "Rock for People (Festival)", people: "Rock for People (Festival)", mighty: "Mighty Sounds (Festival in Tábor)",
  sounds: "Mighty Sounds (Festival in Tábor)", pardubická: "Velká pardubická (Hindernisrennen)",
  jizerská: "Jizerská padesátka (Skilanglauf)", padesátka: "Jizerská padesátka (Skilanglauf)",
  techmania: "Techmania Science Center (Plzeň)", ostravané: "Einwohner von Ostrava",
  // Orte, Landschaften, Flüsse, Berge
  kolíně: "Lok. von Kolín", kladně: "Lok. von Kladno", kutná: "Kutná Hora", boleslavi: "Lok. von Mladá Boleslav",
  slapech: "Lok. von Slapy (Stausee an der Vltava)", petřína: "Gen. von Petřín (Hügel in Praha)",
  náplavce: "Lok. von Náplavka (Moldauufer in Praha)", žižkově: "Lok. von Žižkov (Prager Stadtteil)",
  temelína: "Gen. von Temelín (Kernkraftwerk)", krumlov: "Český Krumlov", vltavu: "Akk. von Vltava (Moldau)",
  plzni: "Lok. von Plzeň", plzně: "Gen. von Plzeň", chodsko: "Chodsko (Gegend um Domažlice)",
  varech: "Lok. von Vary (Karlovy Vary)", karlových: "Gen. von Karlovy Vary", varů: "Gen. von Vary",
  mariánských: "Lok. von Mariánské Lázně", lázních: "Lok. von Lázně (Mariánské Lázně)",
  hřenska: "Gen. von Hřensko", krkonoších: "Lok. von Krkonoše (Riesengebirge)", adršpašské: "Adj. zu Adršpach (Adršpašské skály)",
  hradci: "Lok. von Hradec Králové", hradec: "Hradec Králové", hořicích: "Lok. von Hořice", jablonec: "Jablonec nad Nisou",
  liberci: "Lok. von Liberec", třebová: "Česká Třebová", poličce: "Lok. von Polička", moravě: "Lok. von Morava (Nové Město na Moravě)",
  pelhřimově: "Lok. von Pelhřimov", třebíči: "Lok. von Třebíč", brně: "Lok. von Brno", brno: "Brno", pálavu: "Akk. von Pálava",
  znojmě: "Lok. von Znojmo", slavkova: "Gen. von Slavkov u Brna", olomouc: "Olomouc", olomouci: "Lok. von Olomouc",
  zlíně: "Lok. von Zlín", uherském: "Lok. von Uherské Hradiště", hradišti: "Lok. von Uherské Hradiště",
  valašsku: "Lok. von Valašsko (Walachei, Mähren)", ostrava: "Ostrava", dolních: "Lok. von Dolní Vítkovice",
  vítkovicích: "Lok. von Vítkovice (Ostrava)", opavě: "Lok. von Opava", třinci: "Lok. von Třinec",
  hukvaldech: "Lok. von Hukvaldy", lysou: "Akk. von Lysá hora (Beskydy)",
};

/** Die vierzehn Kraje - erkannt an Wortformen der Zeilen (klein). Jeder Kraj mindestens eine, keiner mehr als 6 Zeilen. */
const KRAJE: Readonly<Record<string, readonly string[]>> = {
  "Praha": ["praha", "petřína", "náplavce", "pražské", "žižkově"],
  "Středočeský": ["kolíně", "kladně", "kutná", "boleslavi", "slapech"],
  "Jihočeský": ["temelína", "krumlov", "tábora", "táboře", "vltavu"],
  "Plzeňský": ["plzni", "plzně", "chodsko"],
  "Karlovarský": ["varech", "varů", "mariánských"],
  "Ústecký": ["mostě", "hřenska"],
  "Liberecký": ["jizerská", "jablonec", "liberci"],
  "Královéhradecký": ["krkonoších", "adršpašské", "hradci", "hradec", "hořicích"],
  "Pardubický": ["pardubická", "třebová", "poličce"],
  "Vysočina": ["novém", "pelhřimově", "třebíči"],
  "Jihomoravský": ["brně", "brno", "brněnský", "pálavu", "znojmě", "slavkova"],
  "Olomoucký": ["olomouc", "olomouci"],
  "Zlínský": ["zlíně", "uherském", "valašsku"],
  "Moravskoslezský": ["ostrava", "ostravané", "opavě", "třinci", "hukvaldech", "lysou"],
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

describe("CS-T5: Orte und Namen", () => {
  it("jedes grosse Wort mitten im Satz ist ein Eigenname der Liste (oder ein bekannter Name wie Praha, Labe, Lednice)", () => {
    const BEKANNTE_NAMEN = new Set(["vídni", "králové", "novém", "městě", "hora", "mladé", "česka", "praha", "tábora", "táboře", "mostě"]);
    const fehler: string[] = [];
    for (const z of ZEILEN) {
      woerter(z).slice(1).forEach((w) => {
        const k = w.toLowerCase();
        if (w !== k && !(k in EIGENNAMEN) && !BEKANNTE_NAMEN.has(k)) fehler.push(`"${z}": ${w}`);
      });
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("alle vierzehn Kraje haben eine Zeile, keiner mehr als 6; Mähren und Schlesien mindestens 12 Zeilen", () => {
    const je = zeilenJeKraj(ZEILEN);
    expect(Object.entries(je).filter(([, n]) => n === 0)).toEqual([]);
    expect(Object.entries(je).filter(([, n]) => n > 6)).toEqual([]);
    expect(MAEHREN_SCHLESIEN.reduce((s, k) => s + je[k], 0)).toBeGreaterThanOrEqual(12);
  });

  it("Gegenprobe: eine Zeile ohne Ort zählt nirgends, „V Brně“ zählt für Jihomoravský", () => {
    const je = zeilenJeKraj(["Ema vidí sovu.", "V Brně je hrad."]);
    expect(je["Jihomoravský"]).toBe(1);
    expect(Object.values(je).reduce((a, b) => a + b, 0)).toBe(1);
  });
});

// ── Wortschatz: Wortgrenze, Bewegungsverben, Sperrliste, Belege, Diakritik ──────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht (Liste wie CS-T1/T2). */
const FUNKTIONSWOERTER = new Set(
  (
    "a i ani ale nebo s se si k ke v ve na do od o u z ze po pro za nad pod " +
    "je jsou jsem jsme jsi jste to ten ta ty tu tam sem tak jak kde kam jen ne ano jo " +
    "mi mě mně tě ho mu můj moje moji tvůj tvoje náš naše dnes"
  ).split(" "),
);

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    // ★ CS-T8 (09.10.2026): die Ende-Charge der Jugend trägt `! " : ;` und Ziffern - gezählt werden nur Buchstabenfolgen (ein
    // allein stehendes `"` und „2" waren sonst „Wörter in 10 Zeilen"; Muster CS-T7 an CS-T4). Für T5 selbst (nur Buchstaben und
    // , . ?) ändert sich nichts; die Grenze 8 bleibt.
    const ws = kleinWoerter(z).flatMap((w) => w.match(/\p{L}+/gu) ?? []);
    for (const w of new Set(ws)) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** CS-T1 §2/§4: Bewegungsverben (jet, jít) und les trugen dort 23 von 128 Zeilen. Hier gemessen 0 - Grenze 3. */
const BEWEGUNG =
  /(^|\s)(ne)?(u|od|do|při|pře|vy|za|s|po)?(jet|jedu|jedeš|jede|jedeme|jedete|jedou|jel|jela|jeli|jely|jít|jdu|jdeš|jde|jdeme|jdete|jdou|jdi|jděte|šel|šla|šli|půjdeme|les|lesa|lese|lesem|lesy|lesů)(?=[\s,.?]|$)/iu;
const BEWEGUNG_GRENZE = 3;

describe("CS-T5: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Wortbudget Jugend: kein Inhaltswort in mehr als 8 Zeilen über alle Jugend-Chargen (T2 + T5 + spätere)", () => {
    expect(JUGEND_ANDERE().length).toBeGreaterThanOrEqual(75); // T2 ist dabei
    const fehler = zuHaeufig([...ZEILEN, ...JUGEND_ANDERE()]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross am Satzanfang), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => (i === 0 ? `Pes je ${"abcdefghi"[i]}.` : `Je to pes ${"abcdefghi"[i]}.`));
    expect(zuHaeufig(neun)).toEqual(['"pes": 9 Zeilen']);
  });

  it(`Bewegungsverben und „les“ sparsam: höchstens ${BEWEGUNG_GRENZE} Zeilen (CS-T1 §4)`, () => {
    const treffer = ZEILEN.filter((z) => BEWEGUNG.test(z));
    expect(treffer.length, treffer.join("\n")).toBeLessThanOrEqual(BEWEGUNG_GRENZE);
  });

  it("Gegenprobe: Jedeme vlakem., Jdu ven., Půjdeme spolu. und V lese. werden erkannt; Jedna, Jelen, Jezdí nicht", () => {
    for (const z of ["Jedeme vlakem.", "Jdu ven.", "Půjdeme spolu.", "V lese."]) expect(BEWEGUNG.test(z), z).toBe(true);
    for (const z of ["Jedna a jedna.", "Jelen.", "Jezdí na kole."]) expect(BEWEGUNG.test(z), z).toBe(false);
  });

  it("kein Wort aus der Sperrliste - weder Kern noch Wortbasis", () => {
    const fehler = ZEILEN.flatMap((t) => kleinWoerter(t).filter((w) => gesperrtCs(w)).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurva (Kern), vole und ďábel (Wortbasis) gefunden; přestávce, nekecám, pecka, zhlédnutí nicht", () => {
    expect(istKernGesperrtCs("kurva")).toBe(true);
    expect(gesperrtCs("vole")).toBe(true);
    expect(gesperrtCs("ďábel")).toBe(true);
    for (const w of ["přestávce", "nekecám", "pecka", "zhlédnutí", "kostnicí"]) expect(gesperrtCs(w), w).toBe(false);
  });
});

/**
 * Wörter dieser Charge, die NICHT in `WORDS_CS`, `STUFE_VOCAB_CS` oder `NACHTRAG_CS` (Tatoeba-Formen mit mindestens zwei
 * Belegen) stehen und keine Eigennamen sind - mit Begründung, weil es für Tschechisch kein Wörterbuch gibt (Falle 61).
 * Alle sind gewöhnliche Wörter bzw. regelmässige Formen [G: eigenes Sprachwissen]; sie gehören in die Lese-Abnahme durch
 * eine Person mit Tschechisch als Erstsprache (P7). Über den Korpus kommen sie ins Vorlese-Lexikon.
 */
const OHNE_TATOEBA_BELEG: Readonly<Record<string, string>> = {
  // Schule: Aufnahmeprüfung, Matura, Unterricht
  přijímačky: "Aufnahmeprüfung an die Mittelschule (Pl., hovorové für přijímací zkoušky)",
  přihlášku: "Akk. Sg. von přihláška (Anmeldung an die Mittelschule)",
  maturita: "Matura, Reifeprüfung (f.)",
  didaktický: "Adj. m. (didaktický test: schriftlicher Teil der Matura)",
  opravné: "Adj. f. Pl. (opravné zkoušky: Nachprüfungen Ende August)",
  srpna: "Gen. Sg. von srpen (August)",
  pololetí: "Halbjahr (n.; za pololetí: im Halbjahreszeugnis)",
  trojku: "Akk. Sg. von trojka (Note 3)",
  spraví: "3. Sg. Futur von spravit se (sich bessern)",
  fyzice: "Lok. Sg. von fyzika",
  probíráme: "1. Pl. Präsens von probírat (Stoff durchnehmen)",
  tělocvičně: "Lok. Sg. von tělocvična (Turnhalle)",
  přestávce: "Lok. Sg. von přestávka (Pause; o přestávce)",
  mobily: "Akk. Pl. von mobil (Handy)",
  mobilu: "Gen. Sg. von mobil (bez mobilu)",
  odpadla: "l-Partizip f. von odpadnout (Stunde fällt aus)",
  pustila: "l-Partizip f. von pustit (gehen lassen) - učitelka",
  dopsat: "fertig schreiben (Inf.)",
  četby: "Gen. Sg. von četba (povinná četba: Pflichtlektüre)",
  slohovky: "Gen. Sg. von slohovka (Aufsatz, hovorové)",
  hovorově: "Adverb: umgangssprachlich",
  spisovně: "Adverb: schriftsprachlich",
  hlásku: "Akk. Sg. von hláska (Laut)",
  prváku: "Lok. Sg. von prvák (erste Klasse der Mittelschule, hovorové)",
  gymnáziu: "Lok. Sg. von gymnázium",
  lyžák: "Skikurs der Schule (m., hovorové für lyžařský výcvik)",
  adapťáku: "Lok. Sg. von adapťák (Kennenlernkurs zu Beginn der Mittelschule, hovorové)",
  poznáme: "1. Pl. Futur von poznat se (sich kennenlernen)",
  odevzdáváme: "1. Pl. Präsens von odevzdávat (abgeben)",
  exkurze: "Exkursion (f.)",
  robotice: "Lok. Sg. von robotika",
  workshop: "Workshop (m., Lehnwort)",
  // Tanzkurs, Ball, Abschluss
  tance: "Gen. Sg. von tanec (lekce tance)",
  tanečních: "Lok. Pl. von taneční (Tanzkurs der Jugend, Pl. tantum)",
  valčík: "Walzer (m.)",
  polku: "Akk. Sg. von polka",
  prodloužené: "Lok. Sg. von prodloužená (Zwischenball des Tanzkurses)",
  stužkovák: "Bandverleihung der Maturaklasse (m., hovorové für stužkovací večírek)",
  // Sport
  penaltu: "Akk. Sg. von penalta (Elfmeter, hovorové)",
  florbal: "Floorball (m.)",
  turnaj: "Turnier (m.)",
  hokeji: "Dat. Sg. von hokej (fandit hokeji)",
  fandí: "3. Sg. Präsens von fandit (anfeuern; se fandí: man feuert an)",
  extraligu: "Akk. Sg. von extraliga (höchste Liga)",
  dostih: "Pferderennen (m.)",
  biatlon: "Biathlon (m.)",
  běžkách: "Lok. Pl. von běžky (Langlaufski)",
  lezeckou: "Akk. f. von lezecký (lezecká stěna: Kletterwand)",
  skály: "Nom. Pl. von skála (Fels)",
  lezců: "Gen. Pl. von lezec (Kletterer)",
  skatepark: "Skatepark (m., Lehnwort)",
  běháme: "1. Pl. Präsens von běhat (laufen, joggen)",
  přehrady: "Gen. Sg. von přehrada (Stausee; kolem přehrady)",
  objíždíme: "1. Pl. Präsens von objíždět (umfahren, rund um)",
  sjíždíme: "1. Pl. Präsens von sjíždět (einen Fluss hinunterfahren)",
  kánoích: "Lok. Pl. von kánoe (Kanu)",
  trénujeme: "1. Pl. Präsens von trénovat",
  tréninku: "Lok./Gen. Sg. von trénink",
  box: "Boxen (m.)",
  wakeboardu: "Lok. Sg. von wakeboard",
  bodů: "Gen. Pl. von bod (Punkt)",
  // Musik, Kultur, Netz
  rap: "Rap (m.)",
  hip: "hip hop (Tanz und Musik)",
  hit: "Hit (m.)",
  symfonii: "Akk. Sg. von symfonie",
  dudáků: "Gen. Pl. von dudák (Dudelsackspieler, Chodsko)",
  reproduktor: "Lautsprecher (m.)",
  mixujeme: "1. Pl. Präsens von mixovat",
  komiks: "Comic (m.)",
  kreslíme: "1. Pl. Präsens von kreslit (zeichnen)",
  graffiti: "Graffiti (n., unveränderlich)",
  točily: "l-Partizip f. Pl. von točit (Filme drehen)",
  animované: "Adj. Pl. (animované filmy: Trickfilme)",
  filmový: "Adj. m. zu film",
  zhlédnutí: "Gen. Pl. von zhlédnutí (Aufruf eines Videos)",
  chat: "Chat (m., Lehnwort)",
  skupinový: "Adj. m. (skupinový chat: Gruppenchat)",
  pípá: "3. Sg. Präsens von pípat (piepen)",
  pípnu: "1. Sg. Futur von pípnout (sich kurz melden, hovorové)",
  síti: "Lok. Sg. von síť (po síti: über das Netz)",
  notebooku: "Lok. Sg. von notebook",
  odečítač: "Screenreader (m., odečítač obrazovky)",
  obrazovky: "Gen. Sg. von obrazovka (Bildschirm)",
  nabíječku: "Akk. Sg. von nabíječka (Ladegerät)",
  vybitá: "Adj. f. (Akku leer)",
  ověřujeme: "1. Pl. Präsens von ověřovat (überprüfen)",
  vyfotíme: "1. Pl. Futur von vyfotit se (ein Foto machen)",
  cvak: "Lautwort (Klicken der Kamera)",
  // Freundschaft und Alltag
  pustíme: "1. Pl. Futur von pustit si (abspielen)",
  půjčíme: "1. Pl. Futur von půjčit si (ausleihen)",
  spíme: "1. Pl. Präsens von spát",
  podnikneme: "1. Pl. Futur von podniknout (unternehmen)",
  dodělali: "l-Partizip Pl. von dodělat (fertig machen)",
  nestíhám: "1. Sg. Präsens von nestíhat (nicht schaffen, zu spät sein)",
  nestihli: "l-Partizip Pl. von nestihnout",
  zahrajeme: "1. Pl. Futur von zahrát si",
  užijte: "Imperativ Pl. von užít si (geniessen)",
  ozvi: "Imperativ Sg. von ozvat se (sich melden)",
  nekecám: "1. Sg. Präsens von nekecat (keinen Unsinn reden, hovorové)",
  pecka: "Knaller (f., hovorové: byla to pecka)",
  panika: "Panik (f.)",
  ségra: "Schwester (f., hovorové)",
  brácha: "Bruder (m., hovorové)",
  mamku: "Akk. Sg. von mamka (Mama, hovorové)",
  schováme: "1. Pl. Futur von schovat (verstecken)",
  festivalu: "Lok. Sg. von festival",
  oddílem: "Instr. Sg. von oddíl (Pfadfinder- oder Sportgruppe)",
  sázíme: "1. Pl. Präsens von sázet (pflanzen)",
  venčíme: "1. Pl. Präsens von venčit (Hund ausführen)",
  instruktoři: "Nom. Pl. von instruktor (Betreuer im Lager)",
  povodni: "Lok. Sg. von povodeň (Hochwasser)",
  brigádu: "Akk. Sg. von brigáda (Ferienjob)",
  brigádě: "Lok. Sg. von brigáda",
  šetříme: "1. Pl. Präsens von šetřit (sparen)",
  autoškolu: "Akk. Sg. von autoškola (Fahrschule)",
  grilujeme: "1. Pl. Präsens von grilovat",
  tramvaji: "Dat. Sg. von tramvaj (Strassenbahn)",
  šalina: "Strassenbahn in Brno (f., Hantec)",
  hantec: "Brünner Stadtmundart (m.)",
  brněnský: "Adj. m. zu Brno",
  slang: "Slang (m.)",
  fajny: "Ostrauer Mundart für pěkný (schön)",
  // Essen
  smažák: "frittierter Käse (m., hovorové für smažený sýr)",
  klasika: "Klassiker (f.)",
  buchtičky: "Nom. Pl. von buchtička (buchtičky se šodó: Dampfnudeln mit Vanillesauce, Schulkantine)",
  šodó: "Vanillecremesauce (n., unveränderlich)",
  trubičky: "Nom. Pl. von trubička (Hořické trubičky: Waffelröllchen)",
  oplatky: "Nom. Pl. von oplatka (Waffel; lázeňské oplatky)",
  frgály: "Nom. Pl. von frgál (walachischer Hefekuchen)",
  nakládají: "3. Pl. Präsens von nakládat (einlegen; okurky)",
  // Land und Geschichte
  pražské: "Adj. n. zu Praha (pražské metro)",
  lázeňské: "Adj. Pl. zu lázně (Kurort)",
  linky: "Akk. Pl. von linka (U-Bahn-Linie)",
  studentské: "Adj. n. (studentské město: Studentenstadt)",
  kostnicí: "Instr. Sg. von kostnice (Beinhaus in Sedlec)",
  mrakodrap: "Wolkenkratzer (m.)",
  škodovky: "Nom. Pl. von škodovka (Auto der Marke Škoda, hovorové)",
  přesunuli: "l-Partizip Pl. von přesunout (verschieben; den Kirchenbau in Most 1975)",
  nejnižší: "Superlativ von nízký (das tiefste)",
  židovská: "Adj. f. (židovská čtvrť: jüdisches Viertel, Třebíč)",
  rekordů: "Gen. Pl. von rekord",
  podzemní: "Adj. (podzemní chodby: unterirdische Gänge)",
  bojovalo: "l-Partizip n. von bojovat (se bojovalo: es wurde gekämpft)",
  císařů: "Gen. Pl. von císař (bitva tří císařů)",
  bižuterie: "Modeschmuck (f.)",
  áčko: "Klasse A (n., hovorové: áčko, béčko)",
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

/**
 * Die Diakritik-Falle (CS-T1): ein Wort, das nicht im kuratierten Wortschatz steht, dessen Form MIT einem Haken oder
 * Strich aber dort steht (`mam` ⇒ `mám`), ist fast sicher verstümmelt. (Beim Schreiben von CS-T5 zweimal getroffen:
 * „stěně" neben „štěně" und „salon" neben „salón" - beide richtig, aber umformuliert, Befund §4.)
 */
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

describe("CS-T5: Belege, Stimme, Diakritik", () => {
  it("jedes Wort stand schon im Wortschatz oder in den Tatoeba-Formen - oder steht begründet in einer der zwei Listen", () => {
    expect(ungeprueft(ZEILEN)).toEqual([]);
    // Die Listen tragen nur, was wirklich gebraucht wird und nicht schon bekannt ist (sonst wachsen sie still).
    const benutzt = new Set(ZEILEN.flatMap(kleinWoerter));
    const ueberfluessig = [...Object.keys(OHNE_TATOEBA_BELEG), ...Object.keys(EIGENNAMEN)].filter(
      (w) => !benutzt.has(w) || VORHER_BEKANNT.has(w),
    );
    expect(ueberfluessig).toEqual([]);
    // Ein Wort steht nur in EINER der zwei Listen.
    expect(Object.keys(OHNE_TATOEBA_BELEG).filter((w) => w in EIGENNAMEN)).toEqual([]);
  });

  it("Gegenprobe: ein erfundenes Wort und eine falsche Endung werden gemeldet, ein Name der Liste nicht", () => {
    expect(ungeprueft(["Lenka má florbalx.", "Dva brigádové."])).toEqual(["florbalx", "brigádové"]);
    expect(ungeprueft(["Lenka je v Brně."])).toEqual([]);
  });

  it("die Stimme buchstabiert kein Wort dieser Charge (Falle 58)", () => {
    const buchstabiert = ZEILEN.filter((z) => kleinWoerter(z).some((w) => w.length >= 2 && !isRealWord(w, "cs")));
    expect(buchstabiert).toEqual([]);
  });

  it("kein Wort ohne den Haken oder Strich, den es braucht (Diakritik-Falle)", () => {
    expect(diakritikVerdacht(ZEILEN)).toEqual([]);
  });

  it("Gegenprobe: „Mam hlad.“, „Kdy je hezky?“ und „Muze to byt.“ werden gemeldet, „Mám hlad.“ nicht", () => {
    expect(diakritikVerdacht(["Mam hlad."]).length).toBeGreaterThan(0);
    expect(diakritikVerdacht(["Kdy je hezky?"]).length).toBeGreaterThan(0);
    expect(diakritikVerdacht(["Muze to byt."]).length).toBeGreaterThan(0);
    expect(diakritikVerdacht(["Mám hlad."])).toEqual([]);
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

/** Geschlecht und Zahl gleichgesetzt (wie CS-T1/T2), auf der Fassung ohne Satzzeichen und klein. */
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

describe("CS-T5: keine Kopien, keine Paare, nichts fast gleich", () => {
  it("die Vergleichsmenge ist voll (rohe cs-Liste mit T1 bis T4, Serien und Banken geladen)", () => {
    expect(ANDERE_CS_ZEILEN()).toEqual(expect.arrayContaining(T1));
    for (const stufe of ["kids", "teens", "erwachsen"] as const) expect(ANDERE_CS().some((i) => i.stufen.includes(stufe)), stufe).toBe(true);
    expect(ANDERE_CS_ZEILEN()).toEqual(expect.arrayContaining(["Ema vidí sovu."])); // CS-T4
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

  it("Gegenprobe: eine T1-Zeile gross mit Punkt, ihre Fassung mit Akzentfehler, eine Serienzeile und ein Banken-Satz werden erkannt", () => {
    const fremd = alleFremdenZeilen();
    const texte = new Set(fremd.map(ohneZeichen));
    const schluessel = new Set(fremd.map((t) => bausteinKey("satz", t)));
    // „Jedeme lesem." hätte denselben Schlüssel wie die T1-Zeile „jedeme lesem" - mergeCorpus verschmölze sie still.
    expect(texte.has(ohneZeichen("Jedeme lesem."))).toBe(true);
    expect(schluessel.has(bausteinKey("satz", "Dal sál."))).toBe(true); // T1 „dal sůl": ů und á werden Trenner
    expect(texte.has(ohneZeichen(SERIEN[0].etappen[0].lines[0]))).toBe(true);
    expect(texte.has(ohneZeichen(bankZeilen()[0].split(/(?<=[.!?])\s+/u)[0]))).toBe(true);
  });

  it("keine Paare in der Charge und keines mit einer anderen cs-Zeile (nur Geschlecht oder Zahl getauscht)", () => {
    const fehler = paare(ZEILEN, ANDERE_CS_ZEILEN());
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Teta upekla/Teta upekl, on/ona und eine T1-Zeile mit getauschtem Geschlecht werden als Paar erkannt", () => {
    expect(paare(["Teta Lída upekla pecen.", "Teta Lída upekl pecen."])).toHaveLength(1);
    expect(paare(["On jde domů.", "Ona jde domů."])).toHaveLength(1);
    expect(paare(["Jedla med."], T1)).toHaveLength(1);
    expect(paare(["Ema vidí sovu."], T1)).toEqual([]);
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

  it("Gegenprobe: „Dnes je pondělí.“ neben „dnes je neděle“ (T1) ist nah, „Na stole je bábovka.“ neben „na stole je atlas“ fast gleich", () => {
    expect(jaccard(wortMenge("Dnes je pondělí."), wortMenge("dnes je neděle"))).toBe(0.5);
    expect(jaccard(wortMenge("Na stole je bábovka."), wortMenge("na stole je atlas"))).toBeGreaterThanOrEqual(0.6);
    expect(fastGleichEigen(["Kdo chce zmrzlinu?", "Kdo chce čokoládu?"])).toHaveLength(1);
  });
});

// ── Anker und Auslieferung ────────────────────────────────────────────────

describe("CS-T5: Korpus-Anker und Auslieferung", () => {
  it("die rohe Sammelliste trägt die Charge als Block HINTER CS-T3 (der letzten Charge davor), die geladene und korpusFuer(\"cs\") jede Zeile", () => {
    const ab = CS_ROH.indexOf(CHARGE[0]);
    expect(ab).toBeGreaterThan(CS_ROH.indexOf(CORPUS_CS_WEG_FRUEH_ERWACHSENE[CORPUS_CS_WEG_FRUEH_ERWACHSENE.length - 1]));
    expect(CS_ROH.slice(0, ab).some((i) => i.stufen.includes("teens"))).toBe(true);
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

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr), eine gross geschriebene T1-Zeile nicht", () => {
    const alle = [...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CS_GELADEN];
    const probe = { text: "Zzz probe cs t5.", kind: "satz" as const, stufen: ["teens" as const] };
    expect(manifestFor([...alle, probe]).ids.length).toBe(KORPUS_ANKER.length + 1);
    const kopie = { text: "Jedeme lesem.", kind: "satz" as const, stufen: ["teens" as const], nurWeg: "cs" as const };
    expect(manifestFor([...alle, kopie]).ids.length).toBe(KORPUS_ANKER.length);
  });

  for (const l of TASTATUREN) {
    it(`${l}: Jugendliche bekommen am Ende des Bereichs alle Zeilen, an h (25) die Zeilen bis h, vor ⇧ keine`, () => {
      const { letzte, o } = grenzen(l);
      const alles = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(o.slice(0, letzte), "cs"), lang: "cs", lernweg: "cs" });
      expect(ZEILEN.filter((t) => !alles.includes(t))).toEqual([]);
      const anH = allowedFromIntroduced(o.slice(0, o.indexOf("h") + 1), "cs");
      const bisH = corpusItemsFor({ stufe: "teens", allowed: anH, lang: "cs", lernweg: "cs" });
      const erwartet = ZEILEN.filter((t) => (sprosseAuf(t, l) ?? 99) <= 25);
      expect(erwartet.length).toBeGreaterThanOrEqual(40);
      expect(erwartet.filter((t) => !bisH.includes(t))).toEqual([]);
      expect(ZEILEN.filter((t) => (sprosseAuf(t, l) ?? 0) > 25 && bisH.includes(t))).toEqual([]);
      const vorShift = allowedFromIntroduced(o.slice(0, o.indexOf(SHIFT_UNIT)), "cs");
      const frueh = corpusItemsFor({ stufe: "teens", allowed: vorShift, lang: "cs", lernweg: "cs" });
      const servierte = new Set(ZEILEN.flatMap((t) => [t, fitText(t, vorShift, "cs") ?? t]));
      expect(frueh.filter((t) => servierte.has(t))).toEqual([]);
    });
  }

  it("Kinder und Erwachsene bekommen keine dieser Zeilen; Weg „de“ und Weg „it“ auch nicht", () => {
    setLayout("cs");
    const o = introOrder("cs");
    const alles = allowedFromIntroduced(o.slice(0, o.indexOf(LETZTE_EINHEIT) + 1), "cs");
    for (const stufe of ["kids", "erwachsen"] as const) {
      const g = corpusItemsFor({ stufe, allowed: alles, lang: "cs", lernweg: "cs" });
      expect(ZEILEN.filter((t) => g.includes(t)), stufe).toEqual([]);
    }
    setLayout("de");
    const de = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(introOrder("de"), "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const it_ = corpusItemsFor({ stufe: "teens", allowed: allowedFromIntroduced(introOrder("it"), "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
