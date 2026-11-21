/**
 * ★★★ Wächter CS-T4 (09.10.2026): die mittleren cs-Texte für Kinder
 * (`corpusCsWegMitteKids.ts`, Sprossen 18-44 = ⇧ bis ¨, auf `cs` UND `cs-qwerty`).
 * Vorbilder: `tastenflow-texte-cs-kids-frueh.test.ts` (CS-T1), `tastenflow-texte-cs-teens-frueh.test.ts`
 * (CS-T2: rohe Sammelliste, „fast gleich", Prüfungsbanken, eigene ID) und `tastenflow-texte-pl-kids-mitte.test.ts`
 * (PL-T4: ⇧, Satzzeichen, Auto-Grossschreibung, Orte); Befund `BEFUND-2026-10-09-CS-T4-KIDS-MITTE.md`,
 * Leitfaden Fallen 26/31/37/45/48/51/58/61/76/92-100.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, ab dem `fitText` sie mit `introOrder("cs").slice(0, n)`
 * durchlässt, mindestens aber ⇧ (18) - auf BEIDEN Pflicht-Tastaturen, nie aus einem Kommentar geglaubt.
 *
 * Tschechische Besonderheiten dieser Charge (alle gemessen, jede mit Gegenprobe):
 *  · `. , ?` kommen direkt nach ⇧ (`punktNachShift`, 19-21) und sind weglassbar - zusammen mit der
 *    Auto-Grossschreibung käme eine Zeile nur aus Buchstaben bis `u` schon an Sprosse 17 in die Runden von CS-T1.
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
import { CORPUS_CS_WEG_MITTE_KIDS } from "../src/lib/typing/corpusCsWegMitteKids";
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
const CHARGE = CORPUS_CS_WEG_MITTE_KIDS;
const ZEILEN = CHARGE.map((i) => i.text);
/** Alle ANDEREN cs-Zeilen (T1, T2 und jede spätere Charge), aus der ROHEN Sammelliste - nicht aus der geladenen. */
const ANDERE_CS = () => CS_ROH.filter((i) => !CHARGE.includes(i));
const ANDERE_CS_ZEILEN = (): string[] => ANDERE_CS().map((i) => i.text);
/** Die Kinder-Chargen derselben Stufe (Wortbudget Kinder über T1 + T4 + T7). */
const KINDER_ANDERE = (): string[] => ANDERE_CS().filter((i) => i.stufen.includes("kids")).map((i) => i.text);
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

describe("CS-T4: jede Zeile an ihrer Sprosse (cs und cs-qwerty)", () => {
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

  it("keine Zeile rutscht über die Auto-Grossschreibung vor `í` (22) - nie in die Runden von CS-T1", () => {
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
    }
  });

  /** GEMESSEN am Ende von CS-T4 (vom Code gezählt, nicht geschätzt) - jede Grenze darf künftig nur STEIGEN. */
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    22: 12, 23: 10, 24: 11, 25: 10, 26: 10, 27: 15, 28: 16, 29: 14, 30: 14, 31: 9, 32: 15, 33: 17, 34: 18, 35: 15,
    36: 10, 37: 24, 38: 10, 39: 8, 40: 5, 41: 8, 42: 3, 43: 1,
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

describe("CS-T4: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37/95)", () => {
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

  it("an ˇ (37) mindestens 12 Zeilen MIT ď ť ň, an ´ (41) mindestens 3 MIT ó - nicht nur grosse Buchstaben", () => {
    const an = (n: number) => ZEILEN.filter((t) => sprosseAuf(t) === n);
    expect(an(37).filter((t) => /[ďťň]/u.test(t)).length).toBeGreaterThanOrEqual(12);
    expect(an(41).filter((t) => /ó/u.test(t)).length).toBeGreaterThanOrEqual(3);
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

describe("CS-T4: Form, Regeln des Weges, Einträge", () => {
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

  it("jeder Eintrag: kind satz, stufen [kids], nurWeg cs, keine herkunft (eigenes Werk)", () => {
    for (const item of CHARGE) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["kids"]);
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

describe("CS-T4: keine Zeile legt das Geschlecht des Kindes oder der tippenden Person fest", () => {
  it("kein gegendertes „du“ und kein gegendertes „ich“ (auch nicht vor Komma oder Punkt)", () => {
    expect(ZEILEN.filter((z) => GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z))).toEqual([]);
  });

  it("Gegenprobe: „Byl jsi tam?“, „Jsi unavená.“, „Usnul jsem.“, „Jsem hotový, mami.“ werden gefunden; „Teď jsi na řadě.“ nicht", () => {
    for (const z of ["Byl jsi tam?", "Kde jsi byla?", "Jsi unavená."]) expect(GEGENDERTES_DU.test(z), z).toBe(true);
    for (const z of ["Usnul jsem.", "Jsem hotový, mami.", "Jsem sama."]) expect(GEGENDERTES_ICH.test(z), z).toBe(true);
    for (const z of ["Teď jsi na řadě.", "Byli jsme v Plzni.", "Mám hlad jako vlk.", "Ahoj, kde jsi?"]) {
      expect(GEGENDERTES_DU.test(z) || GEGENDERTES_ICH.test(z), z).toBe(false);
    }
  });
});

// ── Orte und Namen: alle vierzehn Kraje, Böhmen UND Mähren/Schlesien ─────────

/**
 * Eigennamen der Charge (klein, so wie der Wortschatz-Wächter sie sieht) - Personen, Figuren, Orte, Landschaften.
 * Jedes grosse Wort mitten im Satz steht hier; sie sind belegt, weil sie Namen sind (Tatoeba streicht Namen nicht
 * vollständig, ein Wörterbuch gibt es nicht). Nur Benutztes, nur noch nicht Bekanntes.
 */
const EIGENNAMEN: Readonly<Record<string, string>> = {
  // Vornamen (Kinder und Erwachsene, beide Geschlechter; Taras und Minh: Familien aus der Ukraine und aus Vietnam)
  ema: "Vorname", lída: "Vorname (Ludmila)", vítek: "Vorname (Vít)", vítku: "Vokativ von Vítek", monika: "Vorname",
  pavel: "Vorname", pavlem: "Instr. von Pavel", pavla: "Vorname", pepa: "Vorname (Josef)", lucie: "Vorname",
  iva: "Vorname", ivu: "Akk. von Iva", tonda: "Vorname (Antonín)", matěj: "Vorname", hana: "Vorname",
  milan: "Vorname", magda: "Vorname", ája: "Vorname (Alena)", taras: "Vorname (ukrainisch)", minh: "Vorname (vietnamesisch)",
  bedřich: "Vorname (Bedřich Smetana)", smetana: "Familienname (Bedřich Smetana, Komponist)",
  // Tiernamen und Figuren der tschechischen Kinderkultur
  alík: "Hundename", micka: "Katzenname", pat: "Pat a Mat (Trickfilm)", mat: "Pat a Mat (Trickfilm)",
  bobek: "Bob a Bobek (Večerníček)", mikeš: "Kocour Mikeš (Josef Lada)", ferda: "Ferda Mravenec (Ondřej Sekora)",
  krakonoš: "Berggeist der Krkonoše", otesánek: "Otesánek (K. J. Erben)", křemílek: "Křemílek a Vochomůrka (Večerníček)",
  vochomůrka: "Křemílek a Vochomůrka (Večerníček)", rumcajs: "Rumcajs (Václav Čtvrtek)", emanuel: "Motýl Emanuel (Maková panenka)",
  káťa: "Káťa a Škubánek (Večerníček)", škubánek: "Káťa a Škubánek (Večerníček)", mach: "Mach a Šebestová (Večerníček)",
  šebestová: "Mach a Šebestová (Večerníček)", maxipes: "Maxipes Fík (Trickfilm)", fík: "Maxipes Fík (Trickfilm)",
  bystrozraký: "Dlouhý, Široký a Bystrozraký (K. J. Erben)", praotec: "praotec Čech (Sage)",
  večerníček: "Gute-Nacht-Sendung des Tschechischen Fernsehens", večerníčku: "Gen. von Večerníček",
  braillově: "Lok. von Braillovo písmo (nach Louis Braille)",
  // Land, Landschaften, Flüsse, Berge
  česko: "Tschechien (Kurzform)", čechách: "Lok. Pl. von Čechy (Böhmen)", morava: "Mähren und der Fluss",
  moravském: "Lok. von Moravský kras", slezsku: "Lok. von Slezsko (Schlesien)", valašsku: "Lok. von Valašsko (Walachei, Mähren)",
  šumavě: "Lok. von Šumava (Böhmerwald)", krkonoších: "Lok. von Krkonoše (Riesengebirge)", jeseníkách: "Lok. von Jeseníky (Altvatergebirge)",
  vysočině: "Lok. von Vysočina", českém: "Lok. von České Švýcarsko", vltava: "Moldau", vltavě: "Lok. von Vltava",
  labe: "Elbe (Gen.)", labem: "Instr. von Labe (Ústí nad Labem)", sázavě: "Lok. von Sázava (Fluss)", sázavou: "Instr. von Sázava",
  sněžka: "Schneekoppe", praděd: "Altvater (Berg)", ještědu: "Lok. von Ještěd (Berg bei Liberec)", radhošť: "Radhošť (Berg)",
  říp: "Říp (Berg der Sage)", macocha: "propast Macocha (Moravský kras)", pravčická: "Pravčická brána (Felsentor)",
  // Städte, Burgen, Schlösser, Teiche
  jeseníku: "Lok. von Jeseník (Stadt)", zlíně: "Lok. von Zlín", brně: "Lok. von Brno", plzni: "Lok. von Plzeň", plzeň: "Plzeň (Pilsen)",
  ostravě: "Lok. von Ostrava", opava: "Opava (Troppau)", litomyšli: "Lok. von Litomyšl", kroměříži: "Lok. von Kroměříž",
  květná: "Květná zahrada (Kroměříž, UNESCO)", jičína: "Gen. von Jičín", pardubicích: "Lok. von Pardubice", jihlava: "Jihlava (Iglau)",
  mělníka: "Gen. von Mělník", lipně: "Lok. von Lipno (Stausee)", vary: "Karlovy Vary (Karlsbad)", karlovy: "Karlovy Vary (Karlsbad)",
  telči: "Lok. von Telč", třeboně: "Gen. von Třeboň", štramberku: "Lok. von Štramberk", žďár: "Žďár nad Sázavou",
  ústí: "Ústí nad Labem", zvíkov: "hrad Zvíkov", bouzov: "hrad Bouzov", rožmberk: "rybník Rožmberk",
};

/** Die vierzehn Kraje - erkannt an Wortformen der Zeilen (klein). Jeder Kraj mindestens eine, keiner mehr als 6 Zeilen. */
const KRAJE: Readonly<Record<string, readonly string[]>> = {
  "Praha": ["praha", "prahy", "praze"],
  "Středočeský": ["mělníka", "říp", "sázavě"],
  "Jihočeský": ["lipně", "zvíkov", "rožmberk", "třeboně", "šumavě"],
  "Plzeňský": ["plzni", "plzeň"],
  "Karlovarský": ["vary"],
  "Ústecký": ["ústí", "švýcarsku"],
  "Liberecký": ["ještědu", "liberecké"],
  "Královéhradecký": ["krkonoších", "krakonoš", "dvoře", "jičína"],
  "Pardubický": ["pardubicích", "litomyšli"],
  "Vysočina": ["jihlava", "telči", "žďár"],
  "Jihomoravský": ["brně", "lednice", "moravském"],
  "Olomoucký": ["jeseníku", "jeseníkách", "bouzov", "olomoucké"],
  "Zlínský": ["zlíně", "kroměříži", "valašsku"],
  "Moravskoslezský": ["ostravě", "opava", "štramberku"],
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

describe("CS-T4: Orte und Namen", () => {
  it("jedes grosse Wort mitten im Satz ist ein Eigenname der Liste (oder ein bekannter Name wie Praha, Labe, Lednice)", () => {
    const BEKANNTE_NAMEN = new Set(["praze", "prahy", "lednice", "mravenec", "čech", "dvoře", "králové", "švýcarsku", "široký"]);
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
    // ★ CS-T7 (09.10.2026): spätere Chargen tragen `! " : ;` und Ziffern - gezählt werden nur Buchstabenfolgen (ein
    // allein stehendes `"` war sonst ein „Wort in 9 Zeilen"). Für T4 selbst (nur Buchstaben und , . ?) ändert sich nichts.
    const ws = kleinWoerter(z).flatMap((w) => w.match(/\p{L}+/gu) ?? []);
    for (const w of new Set(ws)) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** CS-T1 §2/§4: Bewegungsverben (jet, jít) und les trugen dort 23 von 128 Zeilen. Hier gemessen 1 - Grenze 3. */
const BEWEGUNG =
  /(^|\s)(ne)?(u|od|do|při|pře|vy|za|s|po)?(jet|jedu|jedeš|jede|jedeme|jedete|jedou|jel|jela|jeli|jely|jít|jdu|jdeš|jde|jdeme|jdete|jdou|jdi|jděte|šel|šla|šli|půjdeme|les|lesa|lese|lesem|lesy|lesů)(?=[\s,.?]|$)/iu;
const BEWEGUNG_GRENZE = 3;

describe("CS-T4: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Wortbudget Kinder: kein Inhaltswort in mehr als 8 Zeilen über alle Kinder-Chargen (T1 + T4 + spätere)", () => {
    const fehler = zuHaeufig([...ZEILEN, ...KINDER_ANDERE()]);
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

  it("Gegenprobe: kurva (Kern), vole und ďábel (Wortbasis) gefunden; knihovně, ďábelské, přestávce nicht", () => {
    expect(istKernGesperrtCs("kurva")).toBe(true);
    expect(gesperrtCs("vole")).toBe(true);
    expect(gesperrtCs("ďábel")).toBe(true);
    for (const w of ["knihovně", "ďábelské", "přestávce", "sluchátko"]) expect(gesperrtCs(w), w).toBe(false);
  });
});

/**
 * Wörter dieser Charge, die NICHT in `WORDS_CS`, `STUFE_VOCAB_CS` oder `NACHTRAG_CS` (Tatoeba-Formen mit mindestens zwei
 * Belegen) stehen und keine Eigennamen sind - mit Begründung, weil es für Tschechisch kein Wörterbuch gibt (Falle 61).
 * Alle sind gewöhnliche Wörter bzw. regelmässige Formen [G: eigenes Sprachwissen]; sie gehören in die Lese-Abnahme durch
 * eine Person mit Tschechisch als Erstsprache (P7). Über den Korpus kommen sie ins Vorlese-Lexikon.
 */
const OHNE_TATOEBA_BELEG: Readonly<Record<string, string>> = {
  sovu: "Akk. Sg. von sova (Eule)",
  dědo: "Vok. von děda (Anrede)",
  kotoul: "Purzelbaum (m.), Akk.",
  kosi: "Nom. Pl. von kos (Amsel)",
  komíně: "Lok. Sg. von komín (Schornstein)",
  kamen: "Gen. Pl. von kamna (Ofen; u kamen)",
  plaveme: "1. Pl. Präsens von plavat",
  pískat: "pfeifen (Inf.)",
  pasou: "3. Pl. Präsens von pást se (weiden)",
  potoka: "Gen. Sg. von potok (Bach)",
  pecen: "Laib (m.), pecen chleba",
  uklidíme: "1. Pl. Futur von uklidit (aufräumen)",
  cinkají: "3. Pl. Präsens von cinkat (klimpern)",
  policistka: "Polizistin (f.)",
  chalupě: "Lok. Sg. von chalupa (Wochenendhaus auf dem Land)",
  loukou: "Instr. Sg. von louka (nad loukou)",
  polem: "Instr. Sg. von pole (nad polem)",
  hejno: "Schwarm (n.)",
  hladí: "3. Sg. Präsens von hladit (streicheln)",
  uhádne: "3. Sg. Futur von uhádnout (erraten)",
  sáně: "Schlitten (Pl. tantum), Akk.",
  odletí: "3. Pl. Futur von odletět (wegfliegen)",
  tatínkovi: "Dat. Sg. von tatínek",
  postavíme: "1. Pl. Futur von postavit (aufbauen)",
  mák: "Mohn (m.)",
  houká: "3. Sg. Präsens von houkat (rufen der Eule)",
  vstáváme: "1. Pl. Präsens von vstávat (aufstehen)",
  smrkem: "Instr. Sg. von smrk (Fichte; pod smrkem)",
  muchomůrka: "Fliegenpilz (f.)",
  schovávanou: "hrát na schovávanou (Versteckspiel), Akk.",
  minaret: "Minarett (m.) - im Schlosspark Lednice",
  písemku: "Akk. Sg. von písemka (Klassenarbeit)",
  zajíc: "Hase (m.)",
  kluzko: "glatt (Adverb: je tu kluzko)",
  vodáci: "Nom. Pl. von vodák (Flusswanderer im Kanu)",
  zdravotník: "Sanitäter, Pfleger (m.)",
  radnici: "Lok. Sg. von radnice (Rathaus)",
  bota: "Schuh (f.)",
  bobr: "Biber (m.)",
  kalhotky: "Höschen (Pl.) - Jak krtek ke kalhotkám přišel",
  natrhali: "l-Partizip Pl. von natrhat (pflücken)",
  kytku: "Akk. Sg. von kytka (Blume, Strauss)",
  paneláku: "Lok. Sg. von panelák (Plattenbau)",
  myjeme: "1. Pl. Präsens von mýt (waschen)",
  bruslíme: "1. Pl. Präsens von bruslit (Schlittschuh laufen)",
  bábovka: "Gugelhupf (f.)",
  listím: "Instr. Sg. von listí (Laub; pod listím)",
  kvákají: "3. Pl. Präsens von kvákat (quaken)",
  těžilo: "l-Partizip n. von těžit (fördern, Bergbau)",
  ležíme: "1. Pl. Präsens von ležet",
  koukáme: "1. Pl. Präsens von koukat (schauen, hovorové)",
  salátem: "Instr. Sg. von salát",
  kroužek: "Arbeitsgemeinschaft am Nachmittag (m.)",
  kroužku: "Lok. Sg. von kroužek",
  košíku: "Gen. Sg. von košík (Korb; do košíku)",
  diktát: "Diktat (m.)",
  vrátily: "l-Partizip f. Pl. von vrátit se (vlaštovky)",
  lyžujeme: "1. Pl. Präsens von lyžovat (Ski fahren)",
  přestávce: "Lok. Sg. von přestávka (Pause; o přestávce)",
  pouštíme: "1. Pl. Präsens von pouštět (pouštět draky: Drachen steigen lassen)",
  pařezu: "Lok. Sg. von pařez (Baumstumpf)",
  rybníků: "Gen. Pl. von rybník (Teich)",
  loupežník: "Räuber (m.) - Rumcajs",
  násobilku: "Akk. Sg. von násobilka (Einmaleins)",
  půjčujeme: "1. Pl. Präsens von půjčovat si (ausleihen)",
  svíčková: "Lendenbraten mit Rahmsosse (f., Sonntagsessen)",
  písmu: "Lok. Sg. von písmo (Schrift)",
  vlévá: "3. Sg. Präsens von vlévat se (münden)",
  koupeme: "1. Pl. Präsens von koupat se (baden)",
  olomoucké: "Adj. n./Pl. zu Olomouc (olomoucké tvarůžky)",
  tvarůžky: "Quargel (Pl.), Käse aus der Gegend um Olomouc",
  krasu: "Lok. Sg. von kras (Karst; v Moravském krasu)",
  propast: "Abgrund, Schlucht (f.) - propast Macocha",
  prameny: "Nom./Akk. Pl. von pramen (Quelle)",
  brusle: "Schlittschuhe (Pl.)",
  moravské: "Adj. Pl. zu Morava (moravské koláče)",
  spíme: "1. Pl. Präsens von spát",
  učitelko: "Vok. von učitelka (paní učitelko)",
  kytce: "Lok. Sg. von kytka",
  vyřezáváme: "1. Pl. Präsens von vyřezávat (schnitzen)",
  maková: "Adj. f. zu mák (Maková panenka)",
  pastelkou: "Instr. Sg. von pastelka (Buntstift)",
  malujeme: "1. Pl. Präsens von malovat",
  překážku: "Akk. Sg. von překážka (Hindernis)",
  ťuk: "Lautwort (Klopfen)",
  lidovou: "Akk. f. von lidový (lidová píseň: Volkslied)",
  tuleň: "Seehund (m.)",
  háčky: "Nom. Pl. von háček (der Haken über č š ř …)",
  rysi: "Nom. Pl. von rys (Luchs)",
  sluchátko: "Telefonhörer (n.) - das kouzelné sluchátko",
  guláš: "Gulasch (m.)",
  gymnastiku: "Akk. Sg. von gymnastika",
  liberecké: "Lok. f. von liberecký (v liberecké zoo)",
  skáčeme: "1. Pl. Präsens von skákat (skákat gumu: Gummitwist)",
  gumu: "Akk. Sg. von guma (Gummitwist)",
  jahodami: "Instr. Pl. von jahoda (Erdbeere)",
  lokomotiva: "Lokomotive (f.)",
  vagonů: "Gen. Pl. von vagon",
  tělocvik: "Turnen (m., Schulfach)",
  úlu: "Lok. Sg. von úl (Bienenstock)",
  úplněk: "Vollmond (m.)",
  pexeso: "Memory-Spiel (n.)",
  školce: "Lok. Sg. von školka (Kindergarten)",
  xylofon: "Xylofon (m.)",
  severních: "Lok. Pl. von severní (v severních Čechách)",
  žluťoučký: "Diminutiv von žlutý - aus dem Satz mit allen Haken und Strichen",
  úpěl: "l-Partizip m. von úpět (jammern) - derselbe Satz",
  ďábelské: "Adj. Akk. Pl. von ďábelský - derselbe Satz",
  ódy: "Akk. Pl. von óda - derselbe Satz",
  sólo: "Solo (n.)",
  kiwi: "Kiwi (n., unveränderlich)",
  aquaparku: "Lok. Sg. von aquapark (Spassbad)",
  tobogán: "Wasserrutsche (m.)",
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
 * Strich aber dort steht (`mam` ⇒ `mám`), ist fast sicher verstümmelt. (Beim Schreiben von CS-T4 einmal getroffen:
 * „hezky" neben „hezký" - richtig, aber umformuliert, Befund §4.)
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

describe("CS-T4: Belege, Stimme, Diakritik", () => {
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
    expect(ungeprueft(["Ema má kotoulx.", "Dva bobrové."])).toEqual(["kotoulx", "bobrové"]);
    expect(ungeprueft(["Ema je v Brně."])).toEqual([]);
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

describe("CS-T4: keine Kopien, keine Paare, nichts fast gleich", () => {
  it("die Vergleichsmenge ist voll (rohe cs-Liste mit T1 und T2, Serien und Banken geladen)", () => {
    expect(ANDERE_CS_ZEILEN()).toEqual(expect.arrayContaining(T1));
    expect(ANDERE_CS().some((i) => i.stufen.includes("teens"))).toBe(true);
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

describe("CS-T4: Korpus-Anker und Auslieferung", () => {
  it("die rohe Sammelliste trägt die Charge als Block HINTER CS-T1 und CS-T2, die geladene und korpusFuer(\"cs\") jede Zeile", () => {
    const ab = CS_ROH.indexOf(CHARGE[0]);
    expect(ab).toBeGreaterThan(CS_ROH.indexOf(CORPUS_CS_WEG_FRUEH_KIDS[CORPUS_CS_WEG_FRUEH_KIDS.length - 1]));
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
    const probe = { text: "Zzz probe cs t4.", kind: "satz" as const, stufen: ["kids" as const] };
    expect(manifestFor([...alle, probe]).ids.length).toBe(KORPUS_ANKER.length + 1);
    const kopie = { text: "Jedeme lesem.", kind: "satz" as const, stufen: ["kids" as const], nurWeg: "cs" as const };
    expect(manifestFor([...alle, kopie]).ids.length).toBe(KORPUS_ANKER.length);
  });

  for (const l of TASTATUREN) {
    it(`${l}: Kinder bekommen am Ende des Bereichs alle Zeilen, an h (25) die Zeilen bis h, vor ⇧ keine`, () => {
      const { letzte, o } = grenzen(l);
      const alles = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(o.slice(0, letzte), "cs"), lang: "cs", lernweg: "cs" });
      expect(ZEILEN.filter((t) => !alles.includes(t))).toEqual([]);
      const anH = allowedFromIntroduced(o.slice(0, o.indexOf("h") + 1), "cs");
      const bisH = corpusItemsFor({ stufe: "kids", allowed: anH, lang: "cs", lernweg: "cs" });
      const erwartet = ZEILEN.filter((t) => (sprosseAuf(t, l) ?? 99) <= 25);
      expect(erwartet.length).toBeGreaterThanOrEqual(40);
      expect(erwartet.filter((t) => !bisH.includes(t))).toEqual([]);
      expect(ZEILEN.filter((t) => (sprosseAuf(t, l) ?? 0) > 25 && bisH.includes(t))).toEqual([]);
      const vorShift = allowedFromIntroduced(o.slice(0, o.indexOf(SHIFT_UNIT)), "cs");
      const frueh = corpusItemsFor({ stufe: "kids", allowed: vorShift, lang: "cs", lernweg: "cs" });
      const servierte = new Set(ZEILEN.flatMap((t) => [t, fitText(t, vorShift, "cs") ?? t]));
      expect(frueh.filter((t) => servierte.has(t))).toEqual([]);
    });
  }

  it("Jugendliche und Erwachsene bekommen keine dieser Zeilen; Weg „de“ und Weg „it“ auch nicht", () => {
    setLayout("cs");
    const o = introOrder("cs");
    const alles = allowedFromIntroduced(o.slice(0, o.indexOf(LETZTE_EINHEIT) + 1), "cs");
    for (const stufe of ["teens", "erwachsen"] as const) {
      const g = corpusItemsFor({ stufe, allowed: alles, lang: "cs", lernweg: "cs" });
      expect(ZEILEN.filter((t) => g.includes(t)), stufe).toEqual([]);
    }
    setLayout("de");
    const de = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(introOrder("de"), "de"), lang: "de", lernweg: "de" });
    expect(ZEILEN.filter((t) => de.includes(t))).toEqual([]);
    setLayout("it");
    const it_ = corpusItemsFor({ stufe: "kids", allowed: allowedFromIntroduced(introOrder("it"), "it"), lang: "it", lernweg: "it" });
    expect(ZEILEN.filter((t) => it_.includes(t))).toEqual([]);
  });
});
