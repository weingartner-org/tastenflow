/**
 * ★★★ Wächter PL-S Kinder (09.10.2026): die ersten POLNISCHEN Serien für Kinder 8-11 (`serienPlKids1.ts`), eingehängt über
 * `serienPl.ts` → `SERIEN_PL` → `SERIEN`. Befund: `BEFUND-2026-10-09-PL-SERIEN-1.md`.
 *
 * Vorbild: `tastenflow-serien-it-kids-1.test.ts` (Form, Eingehängt, Öffnung, Grosswörter gekürzt, Wortgrenze, Kopien, Regionen).
 * Die polnischen Regeln stehen EINMAL in `helfer/plSerienRegeln.ts` (gemeinsam mit Jugend und Erwachsenen):
 *
 *  1. Form: ein Satz je Zeile, 4-16 Wörter, Grossbuchstabe am Anfang (auch nach `"`), Satzschluss, keine Ziffern, kein
 *     Bindestrich, keine Klammer, Apostroph nur im Wort, alle Regeln jeder pl-Zeile (`zeilenFehler`); 20 Serien, 19 mit
 *     zwei Etappen und eine mit drei, 12-16 Zeilen je Etappe, jede Etappe endet auf ? oder !, Titel höchstens 6 Wörter.
 *  2. Eingehängt: `validateSerie(s, "pl")`, `minTier` gerechnet == eingetragen, genau einmal in `SERIEN_PL` und `SERIEN`.
 *  3. Sprossen: Öffnungs-Einheit je Serie gemessen (Tabelle), jede Zeile kommt irgendwann vollständig; freigeschaltet nur
 *     für Kinder auf Weg „pl", mit allen Einheiten alle 20, mit der Grundreihe keine.
 *  4. Grosswörter mitten im Satz sind Eigennamen der Serie - vollständig und in JEDER gekürzten Fassung.
 *  5. Inhalt: kein Geschlecht der tippenden Person, keine Anrede Pan/Pani, keine Feiertage/Religion, keine Politik, kein
 *     Etikett für Behinderung.
 *  6. Wortschatz: kein Inhaltswort in mehr als 8 Zeilen, Sperrliste (Kern + Wortbasis), jedes Wort in der Wortbasis, ein
 *     Eigenname oder von Hand belegt; die Ogonek-Zwillinge gelesen.
 *  7. Keine Kopien, keine Paare, nichts fast gleich - untereinander (0,5), gegen jede pl-Zeile (0,5), gegen alles andere (0,6).
 *  8. Polen in seiner Breite: alle 16 Woiwodschaften, keine mehr als zweimal; Sprache als Faden in mindestens 12 Serien;
 *     zwei Kinder mit Behinderung, die etwas TUN.
 *
 * Jede Regel hat eine Gegenprobe - ein Wächter, der nie anschlägt, beweist nichts.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout } from "../src/lib/typing/layouts";
import { introOrder } from "../src/lib/typing/letters";
import { SERIEN_PL_KIDS_1 } from "../src/lib/typing/serienPlKids1";
import { SERIEN_PL } from "../src/lib/typing/serienPl";
import { SERIEN, allowedFromIntroduced, unlockedSerien } from "../src/lib/typing/serien";
import { computeSerieMinTier, validateSerie, type Serie } from "../src/lib/typing/serie";
import { istKernGesperrtPl } from "../src/lib/typing/sperrlistePl";
import {
  ANREDE,
  BASIS,
  alleFremdenZeilen,
  anderePlZeilen,
  etikettIn,
  fastGleich,
  fastGleichUntereinander,
  fastGleichVoll,
  feiertagIn,
  formFehler,
  fremdeGrosswoerter,
  geschlechtFehler,
  gekuerztFehler,
  gesperrtPl,
  kopienGegen,
  namenVon,
  oeffnet,
  oeffnetEinheit,
  ordnung,
  paare,
  politikIn,
  proWoiwodschaft,
  pruefWoerter,
  serienFormFehler,
  ungeprueft,
  volleSprosse,
  woerter,
  zeilenVon,
  zuHaeufig,
  zwillingWoerter,
  type FormRegel,
} from "./helfer/plSerienRegeln";

afterEach(() => setLayout("de"));

const SERIEN_K = SERIEN_PL_KIDS_1;
const ZEILEN = SERIEN_K.flatMap(zeilenVon);
const SLUGS = new Set(SERIEN_K.map((s) => s.slug));
const NAMEN_ALLE = new Set(SERIEN_K.flatMap((s) => [...namenVon(s)]));

// ── 1 · Form ────────────────────────────────────────────────────────────────

const FORM: FormRegel = {
  erlaubt: /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż .,;:?!"']+$/u,
  minWoerter: 4,
  maxWoerter: 16,
};

describe("1 · Form jeder Zeile, jeder Etappe, jeder Serie", () => {
  it("jede Zeile besteht die Form-Regeln (formFehler + zeilenFehler)", () => {
    const fehler = ZEILEN.flatMap((z) => formFehler(z, FORM).map((f) => `${f}: ${z}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("20 Serien für Kinder, 19 mit zwei Etappen und genau eine mit drei, 12-16 Zeilen je Etappe, Spannung am Etappenende", () => {
    expect(SERIEN_K.length).toBe(20);
    const fehler = SERIEN_K.flatMap((s) => serienFormFehler(s, "kids", 12, 16));
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(SERIEN_K.filter((s) => s.etappen.length === 3).length).toBe(1);
  });

  it("Slugs eindeutig mit Vorsilbe pl-kids-1-, Titel höchstens 6 Wörter", () => {
    const fehler: string[] = [];
    const gesehen = new Set<string>();
    for (const s of SERIEN_K) {
      if (!s.slug.startsWith("pl-kids-1-")) fehler.push(`${s.slug}: Vorsilbe`);
      if (gesehen.has(s.slug)) fehler.push(`${s.slug}: doppelt`);
      gesehen.add(s.slug);
      if (woerter(s.titel).length > 6) fehler.push(`${s.slug}: Titel zu lang`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it.each([
    ["Ola ma kota.", "3 Wörter"],
    ["ola ma małego kota w domu.", "kein Grossbuchstabe am Anfang"],
    ["Ola ma małego kota w domu", "kein Satzschluss am Ende"],
    ["Ola ma małego kota. Kot śpi na kanapie.", "mehr als ein Satz"],
    ["Ola ma kota! Kot śpi na kanapie.", "mehr als ein Satz"],
    ["Ola ma kota,a kot śpi na kanapie.", "kein Leerzeichen nach , ; :"],
    ["Ola ma 7 lat i kota.", "Zeichen ausserhalb der erlaubten"],
    ["Ola jedzie do Bielska-Białej z mamą.", "Bindestrich (vor seiner Sprosse fiele er weg und zerrisse das Wort oder den Einschub)"],
    ["Ola ma kota (rudego) w domu.", "Zeichen ausserhalb der erlaubten"],
    ['Ola woła "Chodź do domu.', "Anführungszeichen ungerade"],
    ["Najważniejsze to: nie spieszyć się przy pisaniu.", "Doppelpunkt nach „to“ (im Polnischen ein Fehler)"],
    ["Ola ma małego rudego kota, który śpi codziennie na starej kanapie babci Zosi w dużym jasnym pokoju.", "17 Wörter"],
  ])("Gegenprobe Zeile rot: %s", (zeile, erwartet) => {
    expect(formFehler(zeile, FORM)).toContain(erwartet);
  });

  it("Gegenprobe: Leerzeichen vor ? und typografische Anführung sind rot (zeilenFehler)", () => {
    expect(formFehler("Gdzie jest mój kot ?", FORM).length).toBeGreaterThan(0);
    expect(formFehler("„Chodź tutaj!” woła babcia.", FORM).length).toBeGreaterThan(0);
  });

  it("Gegenprobe: gute Zeilen mit Rede vorn, Braille'a und Doppelpunkt sind grün", () => {
    for (const z of ['"Chodź tutaj!" woła babcia Zosia.', "Ola czyta książki pismem Braille'a.", "Na kartce jest zagadka: ile rzep leży przy szlaku?"]) {
      expect(formFehler(z, FORM), z).toEqual([]);
    }
  });

  it("Gegenprobe: eine Etappe auf Punkt, ein fremdes Land und ein ungenutzter Eigenname werden gemeldet", () => {
    const s = SERIEN_K[0];
    const falsch = {
      ...s,
      land: "bawarskie" as unknown as typeof s.land,
      eigennamen: [...s.eigennamen, "Atlantyda"],
      etappen: [{ lines: [...s.etappen[0].lines.slice(0, -1), "Dom stoi na dachu."] }, s.etappen[1]],
    };
    const f = serienFormFehler(falsch, "kids", 12, 16).join("\n");
    expect(f).toContain("land bawarskie");
    expect(f).toContain("Eigenname Atlantyda kommt nicht vor");
    expect(f).toContain("E1: endet ohne ? oder !");
  });
});

// ── 2 · Eingehängt ──────────────────────────────────────────────────────────

describe("2 · eingehängt: validateSerie, minTier gerechnet, genau einmal", () => {
  it('jede Serie besteht validateSerie(s, "pl") und trägt ihr gerechnetes minTier', () => {
    const fehler: string[] = [];
    for (const s of SERIEN_K) {
      const serie = s as unknown as Serie;
      const { ok, problems } = validateSerie(serie, "pl");
      if (!ok) fehler.push(`${s.slug}: ${problems.join("; ")}`);
      if (s.minTier === undefined || computeSerieMinTier(serie, "pl") !== s.minTier) fehler.push(`${s.slug}: minTier`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede Serie steht genau einmal in SERIEN_PL und in SERIEN, keine unter einer anderen Sprache", () => {
    for (const s of SERIEN_K) {
      expect(SERIEN_PL.filter((t) => t.slug === s.slug).length, s.slug).toBe(1);
      expect(SERIEN.filter((t) => t.slug === s.slug).length, s.slug).toBe(1);
    }
    expect(SERIEN.filter((s) => SLUGS.has(s.slug) && (s.lang !== "pl" || s.nurWeg !== "pl"))).toEqual([]);
  });

  it("Gegenprobe: ein falsch eingetragenes minTier wird abgelehnt", () => {
    const s = SERIEN_K[0] as unknown as Serie;
    const falsch = { ...s, minTier: (((s.minTier as number) + 1) % 6) as Serie["minTier"] };
    expect(validateSerie(falsch, "pl").problems.some((p) => p.includes("minTier"))).toBe(true);
  });
});

// ── 3 · Sprossen und Freischaltung ──────────────────────────────────────────

/**
 * Öffnungs-Einheit je Serie, GEMESSEN am 09.10.2026 auf Tastatur `pl` (Befund §3): die Einheit, ab der jede Zeile der Serie
 * (gekürzt) serviert wird. Ändert sich eine Zeile, muss die Öffnung neu gelesen und hier eingetragen werden.
 */
const OEFFNET: Record<string, string> = {
  "pl-kids-1-jo-znaczy-tak": "ó",
  "pl-kids-1-imie-dla-foki": "ń",
  "pl-kids-1-dzwonek-we-mgle": "ź",
  "pl-kids-1-idziemy-na-pole": "ź",
  "pl-kids-1-gryfny-kolocz": "ź",
  "pl-kids-1-gdzie-zaczyna-sie-wisla": "ź",
  "pl-kids-1-poranek-z-puszczy": "ź",
  "pl-kids-1-saluton-z-bialegostoku": "ź",
  "pl-kids-1-lusterko-na-bazyliszka": "ź",
  "pl-kids-1-bimba-do-koziolkow": "ź",
  "pl-kids-1-lodka-z-plasteliny": "q", // „w Łodzi": das grosse Ł kommt auf Weg „pl" erst an q (39) - der Name gehört zur Serie
  "pl-kids-1-cebularze-babci-oleny": "ń",
  "pl-kids-1-ciuchcia-w-bieszczadach": "ź",
  "pl-kids-1-stuk-w-baltowie": "ź",
  "pl-kids-1-rzepy-na-szlaku": "ń",
  "pl-kids-1-ile-wiez-ma-zamek": "ń",
  "pl-kids-1-slowa-na-moscie": "ź",
  "pl-kids-1-bialy-ogon-bielika": "ź",
  "pl-kids-1-rufa-dziob-i-keja": "ń",
  "pl-kids-1-skad-sie-wzial-piernik": "ź",
};

describe("3 · Sprossen: jede Zeile kommt, jede Serie öffnet an der gemessenen Einheit", () => {
  it("jede Zeile wird irgendwann vollständig serviert", () => {
    const fehler = ZEILEN.filter((z) => volleSprosse(z) === null);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede Serie öffnet an der gemessenen Einheit", () => {
    const ist = Object.fromEntries(SERIEN_K.map((s) => [s.slug, oeffnetEinheit(s)]));
    expect(ist).toEqual(OEFFNET);
  });

  it("Gegenprobe: eine Zeile mit Ziffer kommt erst mit der Ziffer vollständig, mit ñ nie; x verschiebt die Öffnung", () => {
    expect(volleSprosse("Ola ma siedem lat i 7 kotów.")).toBe(ordnung().indexOf("7") + 1);
    expect(volleSprosse("Mañana pada deszcz w Łodzi.")).toBeNull();
    expect(oeffnet({ etappen: [{ lines: ["Ola jedzie taksówką do domu."] }] })).toBeLessThan(
      oeffnet({ etappen: [{ lines: ["Ola jedzie taxi do domu."] }] })!,
    );
  });

  it("freigeschaltet: mit allen Einheiten alle 20 für Kinder auf Weg pl; Jugend, Erwachsene, Weg it und die Grundreihe nichts", () => {
    setLayout("pl");
    const o = introOrder("pl");
    const alle = allowedFromIntroduced(o, "pl");
    const eigene = (l: Serie[]) => l.filter((s) => SLUGS.has(s.slug)).map((s) => s.slug).sort();
    expect(eigene(unlockedSerien(alle, "kids", "pl", "pl"))).toEqual([...SLUGS].sort());
    expect(eigene(unlockedSerien(alle, "teens", "pl", "pl"))).toEqual([]);
    expect(eigene(unlockedSerien(alle, "erwachsen", "pl", "pl"))).toEqual([]);
    expect(eigene(unlockedSerien(alle, "kids", "it", "it"))).toEqual([]);
    expect(eigene(unlockedSerien(allowedFromIntroduced(o.slice(0, 8), "pl"), "kids", "pl", "pl"))).toEqual([]);
  });
});

// ── 4 · Grosswörter, auch nach dem Kürzen ───────────────────────────────────

describe("4 · Grosswörter mitten im Satz sind Eigennamen der Serie - auch gekürzt", () => {
  it("vollständig", () => {
    const fehler = SERIEN_K.flatMap((s) => zeilenVon(s).flatMap((z) => fremdeGrosswoerter(z, namenVon(s)).map((w) => `${s.slug}: ${w} in ${z}`)));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("gekürzt serviert (jede Sprosse zwischen erster und voller Fassung)", () => {
    const fehler = SERIEN_K.flatMap((s) => zeilenVon(s).flatMap((z) => gekuerztFehler(z, namenVon(s)).map((f) => `${s.slug}: ${z} @ ${f}`)));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it('Gegenprobe: „Mama woła: \\"Kolacja!\\"" wird gekürzt zu einem Grosswort mitten im Satz, Rede vorn nicht', () => {
    const namen = new Set(["zosia"]);
    expect(fremdeGrosswoerter("Babcia Zosia woła Chodź do domu.", namen)).toEqual(["Chodź"]);
    expect(fremdeGrosswoerter("Babcia Zosia woła do domu.", namen)).toEqual([]);
    expect(gekuerztFehler('Mama woła: "Kolacja na stole!"', namen).length).toBeGreaterThan(0);
    expect(gekuerztFehler('"Kolacja na stole!" woła babcia Zosia.', namen)).toEqual([]);
  });
});

// ── 5 · Inhalt ──────────────────────────────────────────────────────────────

describe("5 · kein Geschlecht der tippenden Person, keine Anrede, keine Feiertage, keine Politik, kein Etikett", () => {
  it("keine Zeile", () => {
    expect(ZEILEN.filter(geschlechtFehler)).toEqual([]);
    expect(ZEILEN.filter((z) => ANREDE.test(z))).toEqual([]);
    expect(ZEILEN.filter(feiertagIn)).toEqual([]);
    expect(ZEILEN.filter(politikIn)).toEqual([]);
    expect(ZEILEN.filter(etikettIn)).toEqual([]);
  });

  it("Gegenprobe: rote Zeilen werden erkannt", () => {
    expect(geschlechtFehler("Byłam w Łodzi!")).toBe(true);
    expect(geschlechtFehler('"Zrobiłeś to sam?" pyta Ola.')).toBe(true);
    expect(geschlechtFehler("Jestem gotowa do drogi.")).toBe(true);
    expect(ANREDE.test('"Proszę pani, Antek ma katar!" woła Ola.')).toBe(true);
    expect(feiertagIn("Na Wigilię babcia piecze makowiec.")).toBe(true);
    expect(feiertagIn("Ksiądz idzie do kościoła.")).toBe(true);
    expect(politikIn("Prezydent odwiedza naszą szkołę.")).toBe(true);
    expect(etikettIn("Maja jest niewidoma i czyta brajlem.")).toBe(true);
  });

  it("Gegenprobe: grüne Zeilen bleiben grün", () => {
    expect(geschlechtFehler("Ola była wczoraj w Łodzi.")).toBe(false);
    expect(geschlechtFehler("Damian pochyla głowę pod bomem.")).toBe(false);
    expect(geschlechtFehler("Kuba myśli, że jest już tutaj.")).toBe(false);
    expect(ANREDE.test("Klasa jedzie z panoramą w tle.")).toBe(false);
    expect(feiertagIn("Kielce leżą w województwie świętokrzyskim.")).toBe(false);
    expect(politikIn("Zapisują liczby kreskami, po pięć w każdym rzędzie.")).toBe(false);
    expect(etikettIn("Maja chodzi z białą laską i czyta brajlem.")).toBe(false);
  });
});

// ── 6 · Wortschatz ──────────────────────────────────────────────────────────

/**
 * Wörter dieser Charge, die weder in der Wortbasis (`BASIS`: Wortschatz, Lexikon-Nachtrag, jede pl-Korpuszeile T1-T9) noch
 * unter den Eigennamen ihrer Serie stehen - je mit Grundform und Form. Für Polnisch gibt es auf diesem Rechner kein
 * Wörterbuch (Falle 61); jede Zeile ist eine gelesene Begründung, keine Messung. Die Liste trägt nur Gebrauchtes.
 */
const VON_HAND_BELEGT: Record<string, string> = {
  "animacji": "animacja, Gen. Sg.",
  "animację": "animacja, Akk. Sg.",
  "aparatami": "aparat, Instr. Pl.",
  "autokar": "autokar (Reisebus), Nom. Sg.",
  "autokarem": "autokar, Instr. Sg.",
  "autokarze": "autokar, Lok. Sg.",
  "bacówce": "bacówka (Hirtenhütte), Lok. Sg.",
  "bacówki": "bacówka, Gen. Sg.",
  "bacą": "baca, Instr. Sg.",
  "bajgiel": "bajgiel (Bagel), Nom. Sg.",
  "bajglem": "bajgiel, Instr. Sg.",
  "bajtel": "bajtel (schlesisch: Kind), im Text erklärt",
  "bajtle": "bajtel, Vok. Pl. (schlesisch)",
  "barierką": "barierka (Geländer), Instr. Sg.",
  "bazyliszek": "bazyliszek (Basilisk), Nom. Sg.",
  "bazyliszka": "bazyliszek, Gen./Akk. Sg.",
  "bazyliszku": "bazyliszek, Lok. Sg.",
  "beczy": "beczeć (blöken), 3. Sg. Präs.",
  "bielik": "bielik (Seeadler), Nom. Sg.",
  "bielika": "bielik, Akk. Sg.",
  "bielikach": "bielik, Lok. Pl.",
  "bimby": "bimba (Posener Mundart: Strassenbahn), Gen. Sg.",
  "blachę": "blacha (Backblech), Akk. Sg.",
  "blaszane": "blaszany (aus Blech), Adj. Akk. Sg. n.",
  "bomem": "bom (Baum am Segel), Instr. Sg. - Substantiv, keine l-Form",
  "brajlem": "brajl (Brailleschrift), Instr. Sg. (pisać brajlem)",
  "brodatego": "brodaty (bärtig), Adj. Gen. Sg. m.",
  "brodaty": "brodaty, Adj. Nom. Sg. m.",
  "bruk": "bruk (Kopfsteinpflaster), Akk. Sg.",
  "brzegowi": "brzeg, Dat. Sg. (ku brzegowi)",
  "brzozami": "brzoza (Birke), Instr. Pl.",
  "bucha": "buchać (lodern), 3. Sg. Präs.",
  "buka": "buk (Buche), Gen. Sg.",
  "burcie": "burta (Bordwand), Lok. Sg.",
  "burta": "burta, Nom. Sg.",
  "burty": "burta, Akk. Pl.",
  "buziami": "buzia (Mündchen), Instr. Pl.",
  "cegłę": "cegła (Ziegel), Akk. Sg.",
  "chichocze": "chichotać (kichern), 3. Sg. Präs.",
  "chorymi": "chory (krank), Adj. Instr. Pl.",
  "ciast": "ciasto, Gen. Pl. (kiermasz ciast)",
  "cichnie": "cichnąć (abflauen), 3. Sg. Präs.",
  "cichutki": "cichutki (ganz leise), Adj. Akk. Sg. m.",
  "ciepłym": "ciepły, Adj. Lok. Sg. n.",
  "ciuchcia": "ciuchcia (Kinderwort: Dampflok), Nom. Sg.",
  "ciuchcio": "ciuchcia, Vok. Sg.",
  "cofają": "cofać się, 3. Pl. Präs.",
  "cucha": "cucha (Podhale: Wollmantel), im Text erklärt",
  "cukierni": "cukiernia (Konditorei), Lok. Sg.",
  "czapce": "czapka, Lok. Sg.",
  "dachach": "dach, Lok. Pl.",
  "dankon": "Esperanto für „danke\", im Text erklärt",
  "daszki": "daszek (Dächlein, hier Zirkumflex), Akk. Pl.",
  "demonstruje": "demonstrować, 3. Sg. Präs.",
  "deskach": "deska (Brett), Lok. Pl.",
  "dinozaurach": "dinozaur, Lok. Pl.",
  "diplodok": "diplodok (Diplodocus), Nom. Sg.",
  "diplodoka": "diplodok, Akk. Sg.",
  "diplodokiem": "diplodok, Instr. Sg.",
  "dnem": "dno (Boden), Instr. Sg. (do góry dnem)",
  "dodają": "dodawać, 3. Pl. Präs.",
  "dodawano": "dodawać, unpersönliche Form auf -no",
  "doliną": "dolina (Tal), Instr. Sg.",
  "domkach": "domek, Lok. Pl.",
  "dopisuje": "dopisywać, 3. Sg. Präs.",
  "dopytuje": "dopytywać, 3. Sg. Präs.",
  "dopłynie": "dopłynąć, 3. Sg. Fut.",
  "dorzucają": "dorzucać, 3. Pl. Präs.",
  "dotykania": "dotykanie (das Berühren), Verbalsubstantiv Gen. Sg.",
  "drapieżnika": "drapieżnik (Raubtier), Gen. Sg.",
  "drapią": "drapać, 3. Pl. Präs.",
  "drożdżami": "drożdże (Hefe), Instr. Pl.",
  "drożdżówka": "drożdżówka (Hefeteilchen), Nom. Sg.",
  "drukowane": "drukowany (Druck-), Adj. Akk. Pl.",
  "dryfuje": "dryfować (treiben), 3. Sg. Präs.",
  "drzwiczki": "drzwiczki (Türchen), Nom. Pl.",
  "dymem": "dym (Rauch), Instr. Sg.",
  "dymku": "dymek (Räuchlein), Gen. Sg.",
  "dyplomy": "dyplom, Akk. Pl.",
  "dziobu": "dziób (Bug), Gen. Sg.",
  "dziwnymi": "dziwny, Adj. Instr. Pl.",
  "dzwoneczka": "dzwoneczek (Glöckchen), Gen. Sg.",
  "dzwonki": "dzwonek, Akk. Pl.",
  "elementarz": "elementarz (Fibel), Akk. Sg.",
  "faluje": "falować (wogen), 3. Sg. Präs.",
  "fałszywych": "fałszywy, Adj. Gen. Pl.",
  "fałszywymi": "fałszywy, Adj. Instr. Pl. (fałszywi przyjaciele)",
  "figle": "figiel (Streich), Akk. Pl. (płatać figle)",
  "filmowego": "filmowy, Adj. Gen. Sg. n.",
  "filmowi": "film, Dat. Sg.",
  "fioletowa": "fioletowy, Adj. Nom. Sg. f.",
  "flamastrem": "flamaster (Filzstift), Instr. Sg.",
  "fokami": "foka, Instr. Pl.",
  "gipsowe": "gipsowy, Adj. Akk. Pl.",
  "gipsu": "gips, Gen. Sg.",
  "glanc": "glanc (Posener Mundart: Zuckerguss), im Text erklärt",
  "goździkami": "goździk (Gewürznelke), Instr. Pl.",
  "groźny": "groźny (gefährlich), Adj. Nom. Sg. m.",
  "gryfny": "gryfny (schlesisch: hübsch), im Text erklärt",
  "grzywą": "grzywa (Mähne), Instr. Sg.",
  "gwary": "gwara (Mundart), Gen. Sg.",
  "górską": "górski, Adj. Akk. Sg. f.",
  "głąb": "głąb (Tiefe), Akk. Sg. (w głąb lasu)",
  "halę": "hala (Hochalm), Akk. Sg.",
  "hamuje": "hamować (bremsen), 3. Sg. Präs.",
  "herb": "herb (Wappen), Akk. Sg.",
  "hodowli": "hodowla (Zucht), Lok. Sg.",
  "holenderskich": "holenderski, Adj. Gen. Pl.",
  "imionami": "imię, Instr. Pl.",
  "instruktorami": "instruktor, Instr. Pl.",
  "instruktorka": "instruktorka, Nom. Sg.",
  "instruktorzy": "instruktor, Nom. Pl.",
  "jachcie": "jacht, Lok. Sg.",
  "jagnię": "jagnię (Lamm), Nom. Sg.",
  "jagnięcia": "jagnię, Gen. Sg.",
  "jałowca": "jałowiec (Wacholder), Gen. Sg.",
  "jednymi": "jedne (zu drzwi, Pluraletantum), Instr. Pl.",
  "jeleni": "jeleń (Hirsch), Gen. Pl.",
  "juhas": "juhas (Podhale: Hirtengehilfe), Nom. Sg.",
  "jury": "jury, indeklinabel",
  "kambuz": "kambuz (Kombüse), Nom. Sg.",
  "kamienica": "kamienica (Bürgerhaus), Nom. Sg.",
  "kamienice": "kamienica, Akk. Pl.",
  "kamienicą": "kamienica, Instr. Sg.",
  "kamienicę": "kamienica, Akk. Sg.",
  "karkonoskich": "karkonoski (Riesengebirgs-), Adj. Gen. Pl.",
  "kartką": "kartka, Instr. Sg.",
  "kaszubskiego": "kaszubski, Adj. Gen. Sg. m.",
  "kawałkami": "kawałek, Instr. Pl.",
  "kawałku": "kawałek, Lok. Sg. (kawałek po kawałku)",
  "kei": "keja (Steg, Seglersprache), Gen. Sg.",
  "keja": "keja, Nom. Sg.",
  "kiermaszu": "kiermasz (Basar), Gen. Sg.",
  "kierpce": "kierpce (Podhale: Lederschuhe), Nom. Pl.",
  "kilkanaście": "kilkanaście (zwölf bis neunzehn), Zahlwort",
  "kiwa": "kiwać (nicken), 3. Sg. Präs.",
  "klapniętym": "klapnięty (herabhängend), Part. Instr. Sg. n.",
  "klaszcze": "klaskać, 3. Sg. Präs.",
  "klif": "klif (Kliff), Akk. Sg.",
  "klęka": "klękać (knien), 3. Sg. Präs.",
  "koguci": "koguci (Hahnen-), Adj. Akk. Sg. m.",
  "koja": "koja (Koje), Nom. Sg.",
  "kolegom": "kolega, Dat. Pl.",
  "kolejką": "kolejka (Bähnchen), Instr. Sg.",
  "kolorowym": "kolorowy, Adj. Instr. Sg. m.",
  "komenderuje": "komenderować (kommandieren), 3. Sg. Präs.",
  "koperta": "koperta (Briefumschlag), Nom. Sg.",
  "kosodrzewiną": "kosodrzewina (Latschenkiefer), Instr. Sg.",
  "kosze": "kosz, Akk. Pl.",
  "kołocz": "kołocz (schlesischer Blechkuchen), Nom./Akk. Sg.",
  "kołocza": "kołocz, Gen. Sg.",
  "kołysze": "kołysać się, 3. Sg. Präs.",
  "kresek": "kreska, Gen. Pl.",
  "kroją": "kroić, 3. Pl. Präs.",
  "kruszonką": "kruszonka (Streusel), Instr. Sg.",
  "kruszonkę": "kruszonka, Akk. Sg.",
  "krzaka": "krzak, Gen. Sg.",
  "krzaki": "krzak, Akk. Pl.",
  "krzywym": "krzywy (schief), Adj. Instr. Sg. m.",
  "kształtach": "kształt, Lok. Pl.",
  "kucharzu": "kucharz (Koch), Lok. Sg.",
  "kudłatą": "kudłaty (zottig), Adj. Instr. Sg. f.",
  "kuzynowi": "kuzyn, Dat. Sg.",
  "kłęby": "kłąb (Schwade), Akk. Pl.",
  "ladą": "lada (Theke), Instr. Sg.",
  "latarką": "latarka, Instr. Sg.",
  "legendach": "legenda, Lok. Pl.",
  "legendarnym": "legendarny, Adj. Instr. Sg. m.",
  "legendę": "legenda, Akk. Sg.",
  "leśnikiem": "leśnik (Förster), Instr. Sg.",
  "leśną": "leśny, Adj. Instr. Sg. f.",
  "linach": "lina (Seil), Lok. Pl.",
  "locie": "lot, Lok. Sg. (w locie)",
  "lornetkami": "lornetka (Fernglas), Instr. Pl.",
  "lubelski": "lubelski, Adj. Nom. Sg. m.",
  "lubelskiej": "lubelski, Adj. Lok. Sg. f.",
  "lukier": "lukier (Zuckerguss), Nom. Sg.",
  "lukrowa": "lukrowy, Adj. Nom. Sg. f.",
  "lusterkami": "lusterko, Instr. Pl.",
  "lądowe": "lądowy (Land-), Adj. Nom. Sg. n.",
  "makieta": "makieta (Modell), Nom. Sg.",
  "manewr": "manewr, Nom. Sg.",
  "maszynista": "maszynista (Lokführer), Nom. Sg.",
  "mchem": "mech (Moos), Instr. Sg.",
  "mchu": "mech, Gen. Sg.",
  "medalu": "medal, Lok. Sg.",
  "metalowa": "metalowy, Adj. Nom. Sg. f.",
  "metalowy": "metalowy, Adj. Nom. Sg. m.",
  "mocnym": "mocny, Adj. Instr. Sg. m.",
  "moczyć": "moczyć (einweichen), Inf.",
  "modraszka": "modraszka (Blaumeise), Nom. Sg.",
  "modraszki": "modraszka, Gen. Sg.",
  "modry": "modry (altpolnisch: blau), im Text erklärt",
  "mokrego": "mokry, Adj. Gen. Sg. m.",
  "motorówce": "motorówka, Lok. Sg.",
  "motorówka": "motorówka (Motorboot), Nom. Sg.",
  "mroźny": "mroźny (frostig), Adj. Akk. Sg. m.",
  "muralem": "mural (Wandbild), Instr. Sg.",
  "muralu": "mural, Lok. Sg.",
  "muszelkami": "muszelka (Muschel), Instr. Pl.",
  "młodymi": "młody, Adj. Instr. Pl. (auch substantiviert: z młodymi)",
  "nadawca": "nadawca (Absender), Nom. Sg.",
  "nagraniem": "nagranie, Instr. Sg.",
  "nagrywano": "nagrywać, unpersönliche Form auf -no",
  "nakleja": "naklejać, 3. Sg. Präs.",
  "nakręcić": "nakręcić (einen Film drehen), Inf.",
  "nalepce": "nalepka (Aufkleber), Lok. Sg.",
  "namawia": "namawiać (überreden), 3. Sg. Präs.",
  "napełnia": "napełniać, 3. Sg. Präs.",
  "napisem": "napis, Instr. Sg.",
  "naradzają": "naradzać się, 3. Pl. Präs.",
  "nasłuchują": "nasłuchiwać, 3. Pl. Präs.",
  "nazwami": "nazwa, Instr. Pl.",
  "nazwałby": "nazwać, 3. Sg. m. Konditional (über Bartek, nicht über die tippende Person)",
  "niemieckich": "niemiecki, Adj. Gen. Pl.",
  "notes": "notes (Notizbuch), Akk. Sg.",
  "notuje": "notować, 3. Sg. Präs.",
  "nozdrzy": "nozdrza (Nüstern), Gen. Pl.",
  "obiecuje": "obiecywać, 3. Sg. Präs.",
  "objaśnia": "objaśniać, 3. Sg. Präs.",
  "objeżdża": "objeżdżać (umfahren), 3. Sg. Präs.",
  "objąć": "objąć (umfassen), Inf.",
  "obwarzankach": "obwarzanek, Lok. Pl.",
  "obwieszony": "obwieszony (behängt), Part. Nom. Sg. m.",
  "ocalał": "ocaleć, 3. Sg. m. Prät. (über żagiel)",
  "ocierają": "ocierać, 3. Pl. Präs.",
  "odcisnęły": "odcisnąć się, 3. Pl. Prät. (über ślady)",
  "odgryza": "odgryzać, 3. Sg. Präs.",
  "odkopuje": "odkopywać, 3. Sg. Präs.",
  "odleci": "odlecieć, 3. Sg. Fut.",
  "odlew": "odlew (Abguss), Akk. Sg.",
  "odlewy": "odlew, Akk. Pl.",
  "odpychają": "odpychać się, 3. Pl. Präs.",
  "odpływają": "odpływać, 3. Pl. Präs.",
  "odwraca": "odwracać, 3. Sg. Präs.",
  "ogrodom": "ogród, Dat. Pl. (dzięki ogrodom zoologicznym)",
  "okrycie": "okrycie (Überwurf), Nom. Sg.",
  "okrągłych": "okrągły, Adj. Lok. Pl.",
  "okładce": "okładka (Umschlag), Lok. Sg.",
  "olbrzym": "olbrzym (Riese), Nom. Sg.",
  "oma": "oma (schlesisch: Grossmutter), Nom. Sg.",
  "omy": "oma, Gen. Sg.",
  "omę": "oma, Akk. Sg.",
  "opada": "opadać, 3. Sg. Präs.",
  "opiekują": "opiekować się, 3. Pl. Präs.",
  "opiekun": "opiekun (Pfleger), Nom. Sg.",
  "osobny": "osobny (eigenständig), Adj. Nom. Sg. m.",
  "ostrzega": "ostrzegać, 3. Sg. Präs.",
  "owcami": "owca, Instr. Pl.",
  "owieczką": "owieczka (Schäfchen), Instr. Sg.",
  "ozdobionym": "ozdobiony (verziert), Part. Lok. Sg. m.",
  "oznajmia": "oznajmiać (verkünden), 3. Sg. Präs.",
  "oświetla": "oświetlać, 3. Sg. Präs.",
  "ożył": "ożyć (lebendig werden), 3. Sg. m. Konditional (gdyby ożył, über den Basilisken)",
  "palmy": "palma, Nom. Pl.",
  "parach": "para (Paar), Lok. Pl.",
  "parapet": "parapet (Fensterbrett), Akk. Sg.",
  "parapety": "parapet, Akk. Pl.",
  "parska": "parskać (prusten), 3. Sg. Präs.",
  "parteru": "parter (Erdgeschoss), Gen. Sg.",
  "paskiem": "pasek (Streifen), Instr. Sg.",
  "paszczy": "paszcza (Rachen), Gen. Sg.",
  "pchał": "pchać, 3. Sg. m. Prät. (żeby wiatr nie pchał)",
  "pensjonacie": "pensjonat, Lok. Sg.",
  "pieczeń": "pieczeń (Braten), Nom. Sg.",
  "pieprznego": "pieprzny (pfeffrig), Adj. Gen. Sg. n.",
  "piernika": "piernik, Gen. Sg.",
  "piernikarski": "piernikarski (Lebkuchen-), Adj. Nom. Sg. m.",
  "piernikowe": "piernikowy, Adj. Akk. Pl.",
  "piernikowy": "piernikowy, Adj. Nom. Sg. m.",
  "pierny": "pierny (altpolnisch: scharf, pfeffrig), im Text erklärt",
  "pierza": "pierze (Federn), Gen. Sg.",
  "pierś": "pierś (Brust eines Vogels), Akk. Sg.",
  "pilnują": "pilnować, 3. Pl. Präs.",
  "pisanymi": "pisany, Part. Instr. Pl.",
  "piszczy": "piszczeć (quietschen), 3. Sg. Präs.",
  "piórka": "piórko, Akk. Pl.",
  "plącze": "plątać się (sich verhaspeln), 3. Sg. Präs.",
  "pnia": "pień (Stamm), Gen. Sg.",
  "pniu": "pień, Lok. Sg.",
  "pochyła": "pochyły (schräg), Adj. Nom. Sg. f.",
  "poda": "podać, 3. Sg. Fut.",
  "podbiegają": "podbiegać, 3. Pl. Präs.",
  "podkreśla": "podkreślać, 3. Sg. Präs.",
  "podpływa": "podpływać, 3. Sg. Präs.",
  "podrywa": "podrywać się (auffliegen), 3. Sg. Präs.",
  "podskakuje": "podskakiwać, 3. Sg. Präs.",
  "podtrzymuje": "podtrzymywać, 3. Sg. Präs.",
  "pokazie": "pokaz (Vorführung), Lok. Sg.",
  "polany": "polana (Lichtung), Gen. Sg.",
  "pomagały": "pomagać, 3. Pl. Prät. nichtpersonal (über szanty)",
  "pomniku": "pomnik (Denkmal), Lok. Sg.",
  "pomocnika": "pomocnik, Gen. Sg.",
  "pomost": "pomost (Steg), Nom. Sg.",
  "pomoście": "pomost, Lok. Sg.",
  "popłynie": "popłynąć, 3. Sg. Fut.",
  "popłyną": "popłynąć, 3. Pl. Fut.",
  "poradzą": "poradzić sobie, 3. Pl. Fut.",
  "porośniętych": "porośnięty (bewachsen), Part. Gen. Pl.",
  "porożem": "poroże (Geweih), Instr. Sg.",
  "postanawia": "postanawiać, 3. Sg. Präs.",
  "postanawiają": "postanawiać, 3. Pl. Präs.",
  "posypuje": "posypywać (bestreuen), 3. Sg. Präs.",
  "posługują": "posługiwać się, 3. Pl. Präs.",
  "potokiem": "potok, Instr. Sg.",
  "powtarzają": "powtarzać, 3. Pl. Präs.",
  "poznańskich": "poznański, Adj. Lok. Pl.",
  "połonina": "połonina (Bergwiese der Ostkarpaten), Nom. Sg.",
  "połoninę": "połonina, Akk. Sg.",
  "pożyczone": "pożyczony (geliehen), Part. Akk. Sg. n.",
  "prezentacji": "prezentacja, Gen. Sg.",
  "przechytrzył": "przechytrzyć (überlisten), 3. Sg. m. Prät. (über Dratewka)",
  "przecina": "przecinać (durchqueren), 3. Sg. Präs.",
  "przeciągle": "przeciągle (gedehnt), Adv.",
  "przedszkolaków": "przedszkolak (Kindergartenkind), Gen. Pl.",
  "przekłada": "przekładać (übersetzen), 3. Sg. Präs.",
  "przelatuje": "przelatywać, 3. Sg. Präs.",
  "przestępuje": "przestępować (z nogi na nogę), 3. Sg. Präs.",
  "przesuwa": "przesuwać, 3. Sg. Präs.",
  "przesuwają": "przesuwać się, 3. Pl. Präs.",
  "przesuwającym": "przesuwający się, Part. Akt. Instr. Sg. m.",
  "przeszukuje": "przeszukiwać, 3. Sg. Präs.",
  "przewodniczka": "przewodniczka (Führerin; Leitschaf), Nom. Sg.",
  "przewodniczką": "przewodniczka, Instr. Sg.",
  "przezwiska": "przezwisko (Spitzname), Gen. Sg.",
  "przyjeżdżamy": "przyjeżdżać, 1. Pl. Präs. (Präsens, ohne Geschlecht)",
  "przykleiło": "przykleić się, 3. Sg. n. Prät. (über ciasto)",
  "przyklejony": "przyklejony (aufgeklebt), Part. Akk. Sg. m.",
  "przypaliła": "przypalić się, 3. Sg. f. Prät. (über pieczeń)",
  "przyprawy": "przyprawa (Gewürz), Akk. Pl.",
  "przystani": "przystań (Hafen), Gen. Sg.",
  "przytakuje": "przytakiwać (zustimmen), 3. Sg. Präs.",
  "psotnikom": "psotnik (Schelm), Dat. Pl.",
  "pułapek": "pułapka, Gen. Pl.",
  "półwyspu": "półwysep (Halbinsel), Gen. Sg.",
  "pędzelek": "pędzelek (Pinselchen), Akk. Sg.",
  "pękają": "pękać (ze śmiechu), 3. Pl. Präs.",
  "płaskim": "płaski, Adj. Lok. Sg. m.",
  "płata": "płatać (figle, Streiche spielen), 3. Sg. Präs.",
  "ratowniczy": "ratowniczy (węzeł ratowniczy, Palstek), Adj. Akk. Sg. m.",
  "ratusz": "ratusz (Rathaus), Akk. Sg.",
  "ratuszem": "ratusz, Instr. Sg.",
  "recytuje": "recytować, 3. Sg. Präs.",
  "rejsu": "rejs (Fahrt zu Wasser), Gen. Sg.",
  "rodzinną": "rodzinny, Adj. Akk. Sg. f.",
  "rogami": "róg, Instr. Pl.",
  "rozciera": "rozcierać (verreiben), 3. Sg. Präs.",
  "rozciągają": "rozciągać się, 3. Pl. Präs.",
  "rozkłada": "rozkładać, 3. Sg. Präs.",
  "rozmyła": "rozmyć się, 3. Sg. f. Prät. (über plastelina)",
  "rozpromieniony": "rozpromieniony (strahlend), Part. Nom. Sg. m. (über Tadek)",
  "rozprostowuje": "rozprostowywać, 3. Sg. Präs.",
  "rozpłaszcza": "rozpłaszczać (flachdrücken), 3. Sg. Präs.",
  "rozwiewa": "rozwiewać się, 3. Sg. Präs.",
  "rozśmieszyły": "rozśmieszyć, 3. Pl. Prät. nichtpersonal (über koziołki)",
  "roślinożercy": "roślinożerca (Pflanzenfresser), Lok. Sg.",
  "rudzik": "rudzik (Rotkehlchen), Nom. Sg.",
  "rudą": "rudy (rötlich), Adj. Akk. Sg. f.",
  "rufa": "rufa (Heck), Nom. Sg.",
  "rufą": "rufa, Instr. Sg.",
  "rufę": "rufa, Akk. Sg.",
  "rurę": "rura (Rohr), Akk. Sg.",
  "rysunkiem": "rysunek, Instr. Sg.",
  "rzep": "rzepa, Gen. Pl.",
  "rzepy": "rzepa, Gen. Sg.",
  "równy": "równy (gleichmässig), Adj. Nom. Sg. m.",
  "rękawami": "rękaw, Instr. Pl.",
  "saluton": "Esperanto für „hallo\", im Text erklärt",
  "samiec": "samiec (Männchen), Nom. Sg.",
  "samogłoskami": "samogłoska (Vokal), Instr. Pl.",
  "sapie": "sapać (schnaufen), 3. Sg. Präs.",
  "schowają": "schować się, 3. Pl. Fut.",
  "serduszka": "serduszko, Gen. Sg.",
  "serwetce": "serwetka, Lok. Sg.",
  "sitko": "sitko (Sieb), Akk. Sg.",
  "skamieniał": "skamienieć, 3. Sg. m. Prät. (über den Basilisken)",
  "skałą": "skała (Fels), Instr. Sg.",
  "skałę": "skała, Akk. Sg.",
  "skubie": "skubać (zupfen, grasen), 3. Sg. Präs.",
  "skórzane": "skórzany (Leder-), Adj. Nom. Pl.",
  "smocze": "smoczy (Drachen-), Adj. Akk. Pl.",
  "spierają": "spierać się (streiten), 3. Pl. Präs.",
  "spomiędzy": "spomiędzy (zwischen hervor), Präposition",
  "sprytem": "spryt (Schläue), Instr. Sg.",
  "spłoszony": "spłoszony (aufgescheucht), Part. Nom. Sg. m.",
  "stadami": "stado, Instr. Pl.",
  "starannym": "staranny, Adj. Instr. Sg. n.",
  "starówce": "starówka (Altstadt), Lok. Sg.",
  "stempel": "stempel (Poststempel), Nom. Sg.",
  "ster": "ster (Ruder), Akk. Sg.",
  "sterczy": "sterczeć (emporragen), 3. Sg. Präs.",
  "sterować": "sterować, Inf.",
  "sterze": "ster, Lok. Sg.",
  "stromo": "stromo (steil), Adv.",
  "strumyka": "strumyk, Gen. Sg.",
  "stuk": "stuk (Klopflaut, Lautmalerei), Interjektion",
  "stwierdza": "stwierdzać, 3. Sg. Präs.",
  "stwora": "stwór (Geschöpf), Akk. Sg.",
  "stworem": "stwór, Instr. Sg.",
  "sukna": "sukno (Loden), Gen. Sg.",
  "susem": "sus (Satz, Sprung), Instr. Sg. (jednym susem)",
  "szafki": "szafka, Akk. Pl.",
  "szarych": "szary, Adj. Gen. Pl.",
  "szczytów": "szczyt, Gen. Pl.",
  "szelestem": "szelest (Rascheln), Instr. Sg.",
  "szepcze": "szeptać, 3. Sg. Präs.",
  "szewczyk": "szewczyk (Schusterlein), Nom. Sg.",
  "szklanego": "szklany, Adj. Gen. Sg. m.",
  "szneka": "szneka (Posener Mundart: Hefeschnecke), im Text erklärt",
  "szolka": "szolka (schlesisch: Tasse), im Text erklärt",
  "szolki": "szolka, Nom. Pl.",
  "szpaków": "szpak (Star), Gen. Pl.",
  "szpiczaste": "szpiczasty (spitz), Adj. Nom. Pl.",
  "szponach": "szpon (Kralle), Lok. Pl.",
  "szukanie": "szukanie, Verbalsubstantiv Akk. Sg.",
  "szumiącym": "szumiący, Part. Akt. Instr. Sg. m.",
  "szuwarach": "szuwary (Röhricht), Lok. Pl.",
  "szybą": "szyba, Instr. Sg.",
  "szyld": "szyld (Aushängeschild), Nom. Sg.",
  "szyldu": "szyld, Gen. Sg.",
  "szyszek": "szyszka (Zapfen), Gen. Pl.",
  "szyszkowych": "szyszkowy (Zapfen-), Adj. Gen. Pl. (Versprecher im Zungenbrecher)",
  "sąsiadce": "sąsiadka, Dat. Sg.",
  "słabiej": "słabo, Komparativ",
  "słoiczki": "słoiczek (Gläschen), Akk. Pl.",
  "słoja": "słój (Glas), Gen. Sg.",
  "tajemniczo": "tajemniczo (geheimnisvoll), Adv.",
  "tonem": "ton, Instr. Sg.",
  "toruński": "toruński, Adj. Nom. Sg. m.",
  "trawiasta": "trawiasty (grasbewachsen), Adj. Nom. Sg. f.",
  "trzaskiem": "trzask (Knacken), Instr. Sg.",
  "trzcin": "trzcina (Schilf), Gen. Pl.",
  "trzcinami": "trzcina, Instr. Pl.",
  "trzciny": "trzcina, Akk./Nom. Pl.",
  "trzeszczą": "trzeszczeć (knistern), 3. Pl. Präs.",
  "tyranozaur": "tyranozaur, Nom. Sg.",
  "tyranozaura": "tyranozaur, Akk. Sg.",
  "tłoczą": "tłoczyć się (sich drängen), 3. Pl. Präs.",
  "uciekły": "uciec, 3. Pl. Prät. nichtpersonal (über koziołki)",
  "udanym": "udany, Adj. Lok. Sg. n.",
  "uderza": "uderzać, 3. Sg. Präs.",
  "ugniata": "ugniatać (kneten), 3. Sg. Präs.",
  "ugniatać": "ugniatać, Inf.",
  "ukraińskiego": "ukraiński, Adj. Gen. Sg. m. (język)",
  "uliczkach": "uliczka (Gasse), Lok. Pl.",
  "uliczkę": "uliczka, Akk. Sg.",
  "umywalce": "umywalka (Waschbecken), Lok. Sg.",
  "uratowali": "uratować, 3. Pl. Prät. personal (über ludzie)",
  "uszkiem": "uszko (Öhrchen), Instr. Sg.",
  "uznaniem": "uznanie (Anerkennung), Instr. Sg.",
  "wagoniki": "wagonik, Nom. Pl.",
  "wagoników": "wagonik, Gen. Pl.",
  "wanilią": "wanilia, Instr. Sg.",
  "warszawskich": "warszawski, Adj. Lok. Pl.",
  "wałkiem": "wałek (Nudelholz), Instr. Sg.",
  "wciska": "wciskać, 3. Sg. Präs.",
  "wiejący": "wiejący (wehend), Part. Akt. Nom. Sg. m.",
  "wierzch": "wierzch (Oberseite), Akk. Sg.",
  "wietnamsku": "po wietnamsku, Adv.",
  "wież": "wieża, Gen. Pl.",
  "wieżach": "wieża, Lok. Pl.",
  "wieże": "wieża, Akk. Pl.",
  "wieżyczek": "wieżyczka, Gen. Pl.",
  "wieżyczkach": "wieżyczka, Lok. Pl.",
  "wiosła": "wiosło (Ruder), Nom. Pl.",
  "wiosłami": "wiosło, Instr. Pl.",
  "wiosło": "wiosło, Nom. Sg.",
  "wiruje": "wirować (wirbeln), 3. Sg. Präs.",
  "wnuku": "wnuk, Vok. Sg.",
  "wodzi": "wodzić (palcem, dłońmi), 3. Sg. Präs.",
  "woziła": "wozić, 3. Sg. f. Prät. (über kolejka)",
  "wołają": "wołać, 3. Pl. Präs.",
  "wrzucają": "wrzucać, 3. Pl. Präs.",
  "wręcza": "wręczać (überreichen), 3. Sg. Präs.",
  "wsiadamy": "wsiadać, 1. Pl. Präs. (Präsens, ohne Geschlecht)",
  "wspólnych": "wspólny, Adj. Gen. Pl.",
  "wstrzymuje": "wstrzymywać, 3. Sg. Präs.",
  "wstrzymywać": "wstrzymywać, Inf.",
  "wsuwa": "wsuwać się, 3. Sg. Präs.",
  "wunderbar": "deutsch „wunderbar\", im Text erklärt",
  "wybucha": "wybuchać (śmiechem), 3. Sg. Präs.",
  "wychyla": "wychylać się, 3. Sg. Präs.",
  "wychylają": "wychylać się, 3. Pl. Präs.",
  "wyciąga": "wyciągać, 3. Sg. Präs.",
  "wyciągnięty": "wyciągnięty (ausgestreckt), Part. Nom. Sg. m.",
  "wycięta": "wycięty (ausgeschnitten), Part. Nom. Sg. f.",
  "wyjmuje": "wyjmować, 3. Sg. Präs.",
  "wykopaliska": "wykopaliska (Ausgrabung), Akk. Pl.",
  "wylicza": "wyliczać (aufzählen), 3. Sg. Präs.",
  "wymieszaną": "wymieszany, Part. Akk. Sg. f.",
  "wymyśla": "wymyślać, 3. Sg. Präs.",
  "wymówione": "wymówiony (ausgesprochen), Part. Nom. Sg. n.",
  "wynurzają": "wynurzać się, 3. Pl. Präs.",
  "wypatruje": "wypatrywać, 3. Sg. Präs.",
  "wypełnia": "wypełniać, 3. Sg. Präs.",
  "wypiekała": "wypiekać, 3. Sg. f. Prät. (über moja mama, die Mutter der Oma)",
  "wypowie": "wypowiedzieć, 3. Sg. Fut. (się je wypowie, unpersönlich)",
  "wypuszcza": "wypuszczać, 3. Sg. Präs.",
  "wyrzeźbionymi": "wyrzeźbiony (geschnitzt), Part. Instr. Pl.",
  "wyrzucania": "wyrzucanie, Verbalsubstantiv Gen. Sg.",
  "wyrównuje": "wyrównywać, 3. Sg. Präs.",
  "wysiadał": "wysiadać, 3. Sg. m. Prät. (żeby nikt nie wysiadał)",
  "wyskakują": "wyskakiwać, 3. Pl. Präs.",
  "wyszczerbienie": "wyszczerbienie (Kerbe), Nom. Sg.",
  "wyłaniają": "wyłaniać się, 3. Pl. Präs.",
  "wzorami": "wzór (Muster), Instr. Pl.",
  "wózków": "wózek, Gen. Pl.",
  "wąsami": "wąs (Schnurrhaar), Instr. Pl.",
  "wąskich": "wąski, Adj. Lok. Pl.",
  "wąską": "wąski, Adj. Instr. Sg. f.",
  "wędrowcom": "wędrowiec, Dat. Pl.",
  "wędrowiec": "wędrowiec (Wanderer), Nom. Sg.",
  "zachwala": "zachwalać (anpreisen), 3. Sg. Präs.",
  "zadartymi": "zadarty (hochgereckt), Part. Instr. Pl.",
  "zadowoleniem": "zadowolenie, Instr. Sg.",
  "zagaduje": "zagadywać (ansprechen), 3. Sg. Präs.",
  "zagrody": "zagroda (Gehege), Gen. Sg.",
  "zakręca": "zakręcać (zuschrauben), 3. Sg. Präs.",
  "zakłada": "zakładać, 3. Sg. Präs.",
  "zamieniał": "zamieniać się, 3. Sg. m. Prät. (kto … zamieniał się)",
  "zamieniło": "zamienić się, 3. Sg. n. Prät. (über błoto)",
  "zamiera": "zamierać (erstarren), 3. Sg. Präs.",
  "zamierają": "zamierać, 3. Pl. Präs.",
  "zamkiem": "zamek, Instr. Sg.",
  "zanurza": "zanurzać, 3. Sg. Präs.",
  "zapisują": "zapisywać, 3. Pl. Präs.",
  "zatoka": "zatoka (Bucht), Nom. Sg.",
  "zauważa": "zauważać, 3. Sg. Präs.",
  "zawiniętą": "zawinięty (eingewickelt), Part. Akk. Sg. f.",
  "zbyrcok": "zbyrcok (Podhale: grosse Schafglocke), im Text erklärt",
  "zegarem": "zegar, Instr. Sg.",
  "zerówki": "zerówka (Vorschulklasse), Gen. Sg.",
  "zgaduje": "zgadywać, 3. Sg. Präs.",
  "zgadują": "zgadywać, 3. Pl. Präs.",
  "zgrzyta": "zgrzytać (knirschen), 3. Sg. Präs.",
  "zieje": "ziać (ogniem, Feuer speien), 3. Sg. Präs.",
  "ziewają": "ziewać, 3. Pl. Präs.",
  "ziewając": "ziewać, Adverbialpartizip",
  "znaczkiem": "znaczek (Briefmarke), Instr. Sg.",
  "znaczku": "znaczek, Lok. Sg.",
  "zoologicznym": "zoologiczny, Adj. Dat. Pl.",
  "zrywa": "zrywać, 3. Sg. Präs.",
  "zwalnia": "zwalniać (langsamer werden), 3. Sg. Präs.",
  "zwiedzających": "zwiedzający (Besucher), Part. substantiviert Gen. Pl.",
  "ósemkę": "ósemka (Achterknoten), Akk. Sg.",
  "łamaniec": "łamaniec językowy (Zungenbrecher), Akk. Sg.",
  "łopatkę": "łopatka (Schäufelchen), Akk. Sg.",
  "łódce": "łódka, Lok. Sg.",
  "śledzie": "śledź (Hering), Akk. Pl.",
  "śpiewnie": "śpiewnie (singend), Adv.",
  "świerkowy": "świerkowy (Fichten-), Adj. Akk. Sg. m.",
  "źródle": "źródło (Quelle), Lok. Sg.",
  "żagla": "żagiel, Gen. Sg.",
  "żaglem": "żagiel, Instr. Sg.",
  "żartują": "żartować, 3. Pl. Präs.",
  "żałośnie": "żałośnie (kläglich), Adv.",
  "żeglarza": "żeglarz, Gen. Sg.",
  "żeglarzy": "żeglarz, Gen. Pl.",
  "żubrów": "żubr (Wisent), Gen. Pl.",
  "żywicy": "żywica (Harz), Gen. Sg.",
};

/**
 * Ogonek-Zwillinge (PL-T1 §4): Wörter OHNE Ogonek/Kreska, deren Form MIT ebenfalls ein Wort ist. Jede betroffene Zeile ist
 * gelesen: gemeint ist die geschriebene Form.
 */
const ZWILLING_GELESEN: Record<string, string> = {
  "babcia": "Nom. Sg. als Subjekt (Babcia Halinka próbuje), nicht Instr. babcią",
  "cebula": "Nom. Sg. als Subjekt (cebula mniej szczypie), nicht Instr. cebulą",
  "cebule": "Nom. Pl. (okrągłe jak cebule), nicht Akk. Sg. cebulę",
  "chce": "3. Sg. Präs. (Szymon chce), nicht 1. Sg. chcę",
  "ciocia": "Nom. Sg. als Subjekt (ciocia kupuje), nicht Instr. ciocią",
  "czarna": "Nom. Sg. im Namen Czarna Wisełka, nicht Instr. czarną",
  "czwarta": "Nom. Sg. (klasa czwarta), nicht Instr. czwartą",
  "daje": "3. Sg. Präs. (baca daje), nicht 1. Sg. daję",
  "dodaje": "3. Sg. Präs. (tata dodaje), nicht 1. Sg. dodaję",
  "dostaje": "3. Sg. Präs. (Kuba dostaje), nicht 1. Sg. dostaję",
  "druga": "Nom. Sg. (druga nazwa, druga rzepa), nicht Instr. drugą",
  "dwunasta": "Nom. Sg. der Uhrzeit (za pięć dwunasta), nicht Instr. dwunastą",
  "dziewczyna": "Nom. Sg. als Subjekt (ta dziewczyna ma słuch), nicht Instr. dziewczyną",
  "grupa": "Nom. Sg. als Subjekt (grupa idzie), nicht Instr. grupą",
  "hamuje": "3. Sg. Präs. (Ksenia hamuje), nicht 1. Sg. hamuję",
  "istnieje": "3. Sg. Präs. (czy Duch Gór istnieje), nicht 1. Sg. istnieję",
  "ja": "Pronomen ja als Wort, mit dem jo verwechselt wird, nicht ją",
  "klasa": "Nom. Sg. als Subjekt (klasa czwarta jedzie), nicht Instr. klasą",
  "kopia": "Nom. Sg. (to kopia zęba), nicht Instr. kopią",
  "kupuje": "3. Sg. Präs. (ciocia kupuje), nicht 1. Sg. kupuję",
  "lewa": "Nom. Sg. (lewa burta), nicht Instr. lewą",
  "linia": "Nom. Sg. als Subjekt (linia robi się cienka), nicht Instr. linią",
  "maja": "Vorname Maja (Eigenname der Serie), nicht mają",
  "mama": "Nom. Sg. als Subjekt (mama się zgadza), nicht Instr. mamą",
  "mgle": "Lok. Sg. (we mgle), nicht Akk. mgłę",
  "moja": "Nom. Sg. (moja mama), nicht Instr. moją",
  "nagle": "Adverb nagle (plötzlich), nicht Adj. nagłe",
  "najlepsza": "Nom. Sg. (najlepsza bułka), nicht Instr. najlepszą",
  "nauczycielka": "Nom. Sg. als Subjekt, nicht Instr. nauczycielką",
  "nic": "Pronomen nic (nichts), nicht nić (Faden)",
  "niebieska": "Nom. Sg. (niebieska linia), nicht Instr. niebieską",
  "obiecuje": "3. Sg. Präs. (Marta obiecuje), nicht 1. Sg. obiecuję",
  "on": "Pronomen on (er), nicht ón",
  "owca": "Nom. Sg. als Subjekt (żadna owca), nicht Instr. owcą",
  "owce": "Akk. Pl. (pasie owce, liczy owce), nicht Akk. Sg. owcę",
  "pakuje": "3. Sg. Präs. (Natalia pakuje), nicht 1. Sg. pakuję",
  "para": "Nom. Sg. (unosi się para; każda para uczniów), nicht Instr. parą",
  "pilnuje": "3. Sg. Präs. (olbrzym pilnuje), nicht 1. Sg. pilnuję",
  "pisze": "3. Sg. Präs. (Bartek pisze, pisze się), nicht 1. Sg. piszę",
  "plac": "plac (Platz), nicht płac (Gen. Pl. von płaca)",
  "podtrzymuje": "3. Sg. Präs. (Marta podtrzymuje), nicht 1. Sg. podtrzymuję",
  "pojawia": "3. Sg. Präs. (pojawia się bielik), nicht 3. Pl. Fut. pojawią",
  "pomoc": "Substantiv pomoc (prosi o pomoc), nicht Inf. pomóc",
  "potrzebuje": "3. Sg. Präs. (Kuba nie potrzebuje), nicht 1. Sg. potrzebuję",
  "prawa": "Nom. Sg. (prawa burta), nicht Instr. prawą",
  "prawdziwa": "Nom. Sg. (prawdziwa Wisła), nicht Instr. prawdziwą",
  "proponuje": "3. Sg. Präs. (dziadek proponuje), nicht 1. Sg. proponuję",
  "przygotowana": "Part. Nom. Sg. f. (zabawa przygotowana), nicht Instr. przygotowaną",
  "przygotowuje": "3. Sg. Präs. (Maja przygotowuje), nicht 1. Sg. przygotowuję",
  "przyznaje": "3. Sg. Präs. (Minh przyznaje, jury przyznaje), nicht 1. Sg. przyznaję",
  "pusta": "Nom. Sg. (półka jest pusta), nicht Instr. pustą",
  "rodzina": "Nom. Sg. als Subjekt (rodzina rusza), nicht Instr. rodziną",
  "rozpoznaje": "3. Sg. Präs. (mama rozpoznaje), nicht 1. Sg. rozpoznaję",
  "rysuje": "3. Sg. Präs. (Oliwia rysuje), nicht 1. Sg. rysuję",
  "rzeka": "Nom. Sg. als Subjekt (rzeka zaczyna się), nicht Instr. rzeką",
  "spokojna": "Nom. Sg. (leży spokojna zatoka), nicht Instr. spokojną",
  "sprzedaje": "3. Sg. in sprzedaje się (unpersönlich), nicht 1. Sg. sprzedaję",
  "staje": "3. Sg. Präs. (pociąg staje), nicht 1. Sg. staję",
  "straszna": "Nom. Sg. (straszna jaszczurka), nicht Instr. straszną",
  "szkole": "Lok. Sg. (w szkole), nicht Akk. szkołę",
  "ta": "Nom. Sg. (ta dziewczyna, ta woda, ta kropla), nicht Instr. tą",
  "tablice": "Akk. Pl. (pokazuje tablice), nicht Akk. Sg. tablicę",
  "taka": "Nom. Sg. (taka podróż, taka koperta), nicht Instr. taką",
  "tata": "Nom. Sg. als Subjekt (tata obiecuje), nicht Instr. tatą",
  "te": "Pl. (te wyrazy, te uciekły, te dwa słowa), nicht Akk. Sg. tę",
  "trzecia": "Nom. Sg. (klasa trzecia, trzecia rzepa), nicht Instr. trzecią",
  "tylu": "Gen. von tyle (od tylu lat), nicht tyłu",
  "wielka": "Nom. Sg. (wielka rzeka, wielka łąka), nicht Instr. wielką",
  "woda": "Nom. Sg. als Subjekt (woda faluje), nicht Instr. wodą",
  "wysoka": "Nom. Sg. (wysoka łąka, wysoka trzcina), nicht Instr. wysoką",
  "zabawa": "Nom. Sg. (to zabawa), nicht Instr. zabawą",
  "zadaje": "3. Sg. Präs. (wychowawczyni zadaje), nicht 1. Sg. zadaję",
  "zadania": "Akk. Pl. von zadanie (trudne zadania), nicht żądania",
  "zagadka": "Nom. Sg. (jest zagadka), nicht Instr. zagadką",
  "ze": "Präposition ze (ze śmiechu, ze strachu), nicht że",
  "zgaduje": "3. Sg. Präs. (Igor zgaduje), nicht 1. Sg. zgaduję",
  "ziemia": "Ziemia als Name des Planeten (Eigenname der Serie), nicht Instr. ziemią",
  "zimna": "Nom. Sg. (woda jest zimna), nicht Instr. zimną",
};

describe("6 · Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge (Eigennamen ausgenommen)", () => {
    const fehler = zuHaeufig(ZEILEN, NAMEN_ALLE);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet, ein Funktionswort und ein Name nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `Księżyc świeci nad nami ${"abcdefghi"[i]}, Ola?`);
    expect(zuHaeufig(neun, new Set(["ola"]))).toContain('"księżyc": 9 Zeilen');
    expect(zuHaeufig(neun.slice(0, 8), new Set(["ola"]))).toEqual([]);
    expect(zuHaeufig(neun, new Set())).toContain('"ola": 9 Zeilen');
    expect(zuHaeufig(neun, new Set()).some((f) => f.startsWith('"nad"'))).toBe(false);
  });

  it("kein Wort aus der Sperrliste - Kern und Wortbasis", () => {
    const fehler = ZEILEN.flatMap((z) => pruefWoerter(z).filter((w) => gesperrtPl(w)).map((w) => `${w}: ${z}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: kurwa (Kern), gruby, leniwy, kaleka, cholera, kupa (Wortbasis) werden gefunden, kot und kubek nicht", () => {
    expect(istKernGesperrtPl("kurwa")).toBe(true);
    for (const w of ["gruby", "leniwy", "kaleka", "cholera", "kupa", "głupi"]) expect(gesperrtPl(w), w).toBe(true);
    expect(pruefWoerter("Ta gruba książka leży na stole.").some((w) => gesperrtPl(w))).toBe(true);
    expect(gesperrtPl("kot")).toBe(false);
    expect(gesperrtPl("kubek")).toBe(false);
  });

  it("jedes Wort steht in der Wortbasis, ist ein Eigenname seiner Serie oder von Hand belegt - und die Liste trägt nur Gebrauchtes", () => {
    const fehler = SERIEN_K.flatMap((s) => ungeprueft(zeilenVon(s), VON_HAND_BELEGT, namenVon(s)).map((w) => `${s.slug}: ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
    const benutzt = new Set(ZEILEN.flatMap(pruefWoerter));
    expect(Object.keys(VON_HAND_BELEGT).filter((w) => !benutzt.has(w) || BASIS.has(w))).toEqual([]);
    expect(Object.entries(VON_HAND_BELEGT).filter(([, g]) => g.trim().length < 5)).toEqual([]);
  });

  it("Gegenprobe: ein Tippfehler und ein erfundener Ort werden gemeldet, ein Eigenname der Serie nicht", () => {
    expect(ungeprueft(["Kott śpi w Atlantydzie u Kuby."], {}, new Set(["kuby"]))).toEqual(["kott", "atlantydzie"]);
    expect(ungeprueft(["Kott śpi w domu."], { kott: "Tippfehler, nur Gegenprobe" }, new Set())).toEqual([]);
  });

  it("jeder Ogonek-Zwilling ist gelesen - die Liste gleich der gefundenen Menge", () => {
    expect(Object.keys(ZWILLING_GELESEN).sort()).toEqual([...zwillingWoerter(ZEILEN)].sort());
  });

  it("Gegenprobe: „ze\" (że) und „nic\" (nić) sind Zwillinge, „kot\" nicht; ein ungelesener Zwilling fiele auf", () => {
    expect([...zwillingWoerter(["Ola wraca ze szkoły.", "Kot śpi."])]).toContain("ze");
    expect([...zwillingWoerter(["Kot nic nie je."])]).toContain("nic");
    expect([...zwillingWoerter(["Kot śpi na dworze."])]).not.toContain("kot");
    const mehr = [...zwillingWoerter([...ZEILEN, "Ola jedzie w gory."])].sort();
    expect(mehr).toContain("gory");
    expect(mehr).not.toEqual(Object.keys(ZWILLING_GELESEN).sort());
  });
});

// ── 7 · Keine Kopien, keine Paare, nichts fast gleich ───────────────────────

const ANDERE_PL = anderePlZeilen(SLUGS);
const FREMD = alleFremdenZeilen(SLUGS);

describe("7 · keine Kopien, keine Paare, nichts fast gleich", () => {
  it("keine Zeile doppelt - auch nicht ohne Satzzeichen oder nach dem Ledger-Schlüssel", () => {
    const fehler = ZEILEN.filter((z, i) => kopienGegen([z], ZEILEN.filter((_, j) => j !== i)).length > 0);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("keine Zeile gleicht einer pl-Korpuszeile, einer anderen Serie, einem anderen Korpus oder einer Bank", () => {
    expect(ANDERE_PL.length).toBeGreaterThan(1000);
    expect(FREMD.length).toBeGreaterThan(10000);
    expect(kopienGegen(ZEILEN, ANDERE_PL)).toEqual([]);
    expect(kopienGegen(ZEILEN, FREMD)).toEqual([]);
  });

  it("keine Paare (nur Geschlecht oder Endung getauscht) - untereinander und gegen jede andere pl-Zeile", () => {
    const fehler = paare(ZEILEN, ANDERE_PL);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("nichts fast gleich - untereinander (0,5), gegen jede pl-Zeile (0,5), gegen alles andere (0,6)", () => {
    const fehler = [...fastGleichUntereinander(ZEILEN, 0.5), ...fastGleich(ZEILEN, ANDERE_PL, 0.5), ...fastGleich(ZEILEN, FREMD, 0.6)];
    expect(fehler, fehler.slice(0, 20).join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kopie mit anderen Satzzeichen, Paar und fast gleich werden erkannt", () => {
    const z = ZEILEN[0];
    expect(kopienGegen([`${z.replace(/[.!?]$/, "")}?`], ZEILEN)).toHaveLength(1);
    expect(paare(["On idzie do szkoły z bratem.", "Ona idzie do szkoły z bratem!"])).toHaveLength(1);
    expect(fastGleichUntereinander(["Kuba czyta słówka na głos w autobusie.", "Kuba czyta słówka na głos w pociągu."], 0.5)).toHaveLength(1);
    expect(fastGleichUntereinander(["Kuba czyta słówka na głos.", "Ola piecze kołocz z kruszonką."], 0.5)).toEqual([]);
  });

  it("Gegenprobe: der Präfix-Filter findet dasselbe wie der volle Vergleich (Stichprobe mit eingeschleusten Nachbarn)", () => {
    const probe = ZEILEN.filter((_, i) => i % 15 === 0);
    const nachbarn = probe.map((z) => z.replace(/\s\S+([.!?]"?)$/, " zaraz$1"));
    const gegen = [...ANDERE_PL.slice(0, 2000), ...nachbarn];
    const filter = fastGleich(probe, gegen, 0.5).sort();
    const voll = fastGleichVoll(probe, gegen, 0.5).sort();
    expect(filter.length).toBeGreaterThan(0);
    expect(filter).toEqual(voll);
  });
});

// ── 8 · Polen in seiner Breite ──────────────────────────────────────────────

/**
 * Sprache als Faden (Johannes: „die texte sollen einen bezug zum land und sprache haben"): je Serie ein Stichwort, das in
 * ihr steht - Dialekt, Regionalsprache, Herkunft eines Wortes, Fachwörter, Zungenbrecher.
 */
const SPRACHFADEN: Record<string, string> = {
  "pl-kids-1-jo-znaczy-tak": "po kaszubsku",
  "pl-kids-1-imie-dla-foki": "jak wiatr wiejący od morza",
  "pl-kids-1-dzwonek-we-mgle": "gwary",
  "pl-kids-1-idziemy-na-pole": "na pole znaczy po prostu na dwór",
  "pl-kids-1-gryfny-kolocz": "po śląsku",
  "pl-kids-1-gdzie-zaczyna-sie-wisla": "Wisełka to mała Wisła",
  "pl-kids-1-poranek-z-puszczy": "zaczynają się na po",
  "pl-kids-1-saluton-z-bialegostoku": "esperanto",
  "pl-kids-1-lusterko-na-bazyliszka": "z greckiego",
  "pl-kids-1-bimba-do-koziolkow": "tramwaj to bimba",
  "pl-kids-1-lodka-z-plasteliny": "polskie litery w nazwie miasta",
  "pl-kids-1-cebularze-babci-oleny": "fałszywymi przyjaciółmi",
  "pl-kids-1-ciuchcia-w-bieszczadach": "naśladuje odgłos",
  "pl-kids-1-stuk-w-baltowie": "straszna jaszczurka",
  "pl-kids-1-rzepy-na-szlaku": "na dwa słowa",
  "pl-kids-1-ile-wiez-ma-zamek": "po niemiecku",
  "pl-kids-1-slowa-na-moscie": "z niemieckiego",
  "pl-kids-1-bialy-ogon-bielika": "nazwę właśnie od białego ogona",
  "pl-kids-1-rufa-dziob-i-keja": "holenderskich",
  "pl-kids-1-skad-sie-wzial-piernik": "pierny",
};

describe("8 · Polen in seiner Breite", () => {
  it("alle 16 Woiwodschaften mindestens einmal, keine mehr als zweimal", () => {
    const m = proWoiwodschaft(SERIEN_K);
    expect([...m].filter(([, n]) => n < 1 || n > 2)).toEqual([]);
    expect(m.size).toBe(16);
  });

  it("Gegenprobe: dreimal pomorskie und ein fehlendes Land werden gemeldet", () => {
    const m = proWoiwodschaft([{ land: "pomorskie" }, { land: "pomorskie" }, { land: "pomorskie" }]);
    expect(m.get("pomorskie")).toBe(3);
    expect(m.get("lubuskie")).toBe(0);
  });

  it("Sprache als Faden in mindestens 12 Serien - jedes Stichwort steht in seiner Serie", () => {
    const fehlt = Object.entries(SPRACHFADEN).filter(([slug, w]) => !zeilenVon(SERIEN_K.find((s) => s.slug === slug) ?? { etappen: [] }).some((z) => z.includes(w)));
    expect(fehlt).toEqual([]);
    expect(Object.keys(SPRACHFADEN).length).toBeGreaterThanOrEqual(12);
  });

  it("zwei Kinder mit Behinderung, die etwas TUN (brajlem, białą laską, na wózku) - ohne Etikett", () => {
    const zeilen = (slug: string) => zeilenVon(SERIEN_K.find((s) => s.slug === slug)!);
    expect(zeilen("pl-kids-1-lusterko-na-bazyliszka").some((z) => z.includes("brajlem"))).toBe(true);
    expect(zeilen("pl-kids-1-lusterko-na-bazyliszka").some((z) => z.includes("białą laską"))).toBe(true);
    expect(zeilen("pl-kids-1-lodka-z-plasteliny").some((z) => z.includes("jeździ na wózku"))).toBe(true);
  });
});
