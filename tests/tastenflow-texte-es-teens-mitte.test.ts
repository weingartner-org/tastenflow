/**
 * ★★★ Wächter ES-T5 (27.09.2026): die mittleren es-Texte für Jugendliche
 * (`corpusEsMitteTeens.ts`, Sprossen 19-30 - Mayús bis w; ★ seit D-1 am 28.09.2026: 19-32, mit „." „," an 20/21).
 * Bauplan `BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md` §4/§5, Wächter W6/W8
 * aus `BAUPLAN-2026-09-26-NEUE-SPRACHE-EFFIZIENT.md` §4, Leitfaden Fallen
 * 26/31/37/45/48. Dieselben Regeln wie der Kinder-Wächter derselben Sprossen
 * (`tastenflow-texte-es-kids-mitte.test.ts`), dazu: keine Zeile gleich einer
 * früheren (alle es-Chargen und de/en/fr), kein Paar mit einer Kinderzeile oder
 * einer frühen Jugendzeile (Falle 31), Wortgrenze über beide Jugend-Chargen.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, ab dem `fitText` sie
 * mit `introOrder("es").slice(0, n)` durchlässt - auf BEIDEN Pflicht-Tastaturen
 * (ES und LatAm) -, mindestens aber die Mayús-Sprosse (Grossbuchstaben sind vor
 * Mayús nur über die Auto-Grossschreibung tippbar, corpus.ts KERNREGEL; die
 * Zeilen gehören zur Mayús-Stufe). Jede Regel hat eine Gegenprobe.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_ES_MITTE_TEENS } from "../src/lib/typing/corpusEsMitteTeens";
import { CORPUS_ES_MITTE_KIDS } from "../src/lib/typing/corpusEsMitteKids";
import { CORPUS_ES_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusEsWegFruehKids";
import { CORPUS_ES_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusEsWegFruehTeens";
import { allowedFromIntroduced } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { bausteinId, bausteinKey } from "../src/lib/typing/ledger";
import { adaptiveRound } from "../src/lib/typing/generator";
import { corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";

afterEach(() => setLayout("de"));

const TASTATUREN: LayoutId[] = ["es", "latam"];
const ZEILEN = CORPUS_ES_MITTE_TEENS.map((i) => i.text);
const FRUEHE_TEENS = CORPUS_ES_WEG_FRUEH_TEENS.map((i) => i.text);
const KINDERZEILEN = [...CORPUS_ES_WEG_FRUEH_KIDS, ...CORPUS_ES_MITTE_KIDS].map((i) => i.text);
const AKZENTE = ["á", "é", "í", "ó", "ú"];

/** Mayús-Sprosse und letzte Buchstaben-Sprosse - aus der Reihenfolge gerechnet. */
function grenzen(layout: LayoutId = "es"): { mayus: number; letzte: number; o: string[] } {
  setLayout(layout);
  const o = introOrder("es");
  return { mayus: o.indexOf(SHIFT_UNIT) + 1, letzte: o.indexOf("w") + 1, o };
}

/** Kleinste Sprosse, an der `fitText` den Text durchlässt (null: nie bis w). */
function buchstabenSprosse(text: string, layout: LayoutId): number | null {
  const { letzte, o } = grenzen(layout);
  for (let n = 1; n <= letzte; n++) {
    if (fitText(text, allowedFromIntroduced(o.slice(0, n), "es"), "es") !== null) return n;
  }
  return null;
}

/** Die Sprosse der Zeile in dieser Charge: nie vor Mayús. */
function sprosseAuf(text: string, layout: LayoutId): number | null {
  const s = buchstabenSprosse(text, layout);
  return s === null ? null : Math.max(s, grenzen(layout).mayus);
}

/** Enthält der Text die Einheit? ⇧ zeigt sich an einem Grossbuchstaben, ´ an á…ú, ¨ an ü. */
function enthaeltEinheit(text: string, einheit: string): boolean {
  if (einheit === SHIFT_UNIT) return text !== text.toLowerCase();
  if (einheit === "´") return AKZENTE.some((a) => text.toLowerCase().includes(a));
  if (einheit === "¨") return text.toLowerCase().includes("ü");
  return text.toLowerCase().includes(einheit);
}

describe("ES-T5: jede Zeile an ihrer Sprosse (ES und LatAm)", () => {
  it("Mayús ist Sprosse 19, danach . , (D-1) und p q b g h v y z x ¨ w bis Sprosse 32 - auf beiden Tastaturen", () => {
    for (const l of TASTATUREN) {
      const { mayus, letzte, o } = grenzen(l);
      expect(mayus, l).toBe(19);
      // ★ D-1 (28.09.2026): Punkt und Komma direkt nach Mayús (Sprossen 20/21).
      expect(letzte, l).toBe(32);
      expect(o.slice(18, 32).join(" "), l).toBe(`${SHIFT_UNIT} . , p q b g h v y z x ¨ w`);
    }
  });

  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile hat eine Sprosse 19-32, und minTier stimmt`, () => {
      const fehler: string[] = [];
      for (const item of CORPUS_ES_MITTE_TEENS) {
        const s = sprosseAuf(item.text, l);
        if (s === null || s < 19 || s > 32) fehler.push(`"${item.text}": Sprosse ${s}`);
        const tier = minTierFor(item.text, "es");
        if (tier !== item.minTier) fehler.push(`"${item.text}": minTier ${item.minTier}, gerechnet ${tier}`);
      }
      expect(fehler, fehler.join("\n")).toEqual([]);
    });
  }

  it("ES und LatAm ergeben für jede Zeile dieselbe Buchstaben-Sprosse", () => {
    const fehler = ZEILEN.filter((t) => buchstabenSprosse(t, "es") !== buchstabenSprosse(t, "latam"));
    expect(fehler).toEqual([]);
  });

  /**
   * Eine Mayús-Zeile (nur Buchstaben bis ´) passt über die Auto-Grossschreibung
   * schon vor Mayús. Sie braucht darum ein „m" oder einen Akzent - so kommt sie
   * frühestens an Sprosse 17, nie in die ganz frühen Runden (ES-T2).
   */
  it("keine Zeile rutscht über die Auto-Grossschreibung vor Sprosse 17", () => {
    const fehler = ZEILEN.filter((t) => (buchstabenSprosse(t, "es") ?? 0) < 17);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Sprossen werden richtig gerechnet, eine Mayús-Zeile ohne m und Akzent fällt auf", () => {
    expect(sprosseAuf("Ana corre", "es")).toBe(19);
    expect(buchstabenSprosse("Ana corre", "es")).toBe(15);
    expect(buchstabenSprosse("Leire cursa en Lekeitio", "es")).toBeLessThan(17);
    expect(sprosseAuf("Pedro corre", "latam")).toBe(22);
    expect(sprosseAuf("Es bilingüe", "es")).toBe(31);
    expect(sprosseAuf("Un wasap", "latam")).toBe(32);
    expect(sprosseAuf("¿Hola Ana?", "es")).toBeNull(); // ¿? gibt es erst nach dem Alphabet
  });

  /** GEMESSEN am Ende von ES-T5 (vom Code gezählt) - darf künftig nur STEIGEN. */
  // ★ D-1 (28.09.2026): Buchstaben-Sprossen nach Mayús zwei später (20/21 =
  // Punkt und Komma, dort beginnt keine Zeile - sie sind weglassbar).
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    19: 25, 22: 21, 23: 20, 24: 20, 25: 22, 26: 20, 27: 25, 28: 23, 29: 21, 30: 21, 31: 18, 32: 15,
  };

  for (const l of TASTATUREN) {
    it(`${l}: je Sprosse mindestens so viele Zeilen wie gemessen, nie unter 12`, () => {
      const anzahl = new Map<number, number>();
      for (const t of ZEILEN) {
        const s = sprosseAuf(t, l);
        if (s !== null) anzahl.set(s, (anzahl.get(s) ?? 0) + 1);
      }
      const zuWenig: string[] = [];
      for (let n = 19; n <= 32; n++) {
        if (n === 20 || n === 21) continue; // ★ D-1: „." „," - weglassbar, keine eigene Zeile
        const soll = Math.max(12, MINDESTENS_JE_SPROSSE[n] ?? 12);
        if ((anzahl.get(n) ?? 0) < soll) zuWenig.push(`Sprosse ${n}: ${anzahl.get(n) ?? 0} < ${soll}`);
      }
      expect(zuWenig, zuWenig.join("\n")).toEqual([]);
    });
  }
});

describe("ES-T5: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
  function ohneNeueEinheit(zeilen: { text: string; sprosse: number }[], layout: LayoutId): string[] {
    const { o } = grenzen(layout);
    return zeilen
      .filter((z) => !enthaeltEinheit(z.text, o[z.sprosse - 1]))
      .map((z) => `"${z.text}" (Sprosse ${z.sprosse}, ${o[z.sprosse - 1]})`);
  }

  for (const l of TASTATUREN) {
    it(`${l}: jede Zeile enthält die Einheit ihrer (gerechneten) Sprosse`, () => {
      const zeilen = ZEILEN.map((text) => ({ text, sprosse: sprosseAuf(text, l) ?? 0 }));
      const fehler = ohneNeueEinheit(zeilen, l);
      expect(fehler, fehler.join("\n")).toEqual([]);
    });

    it(`${l}: jede Einheit von ⇧ bis w hat an ihrer Sprosse Zeilen (W6)`, () => {
      const fehlt: string[] = [];
      const { o } = grenzen(l);
      for (let n = 19; n <= 32; n++) {
        if (o[n - 1] === "." || o[n - 1] === ",") continue; // ★ D-1: weglassbar, keine eigene Zeile
        const treffer = ZEILEN.filter((t) => sprosseAuf(t, l) === n && enthaeltEinheit(t, o[n - 1]));
        if (treffer.length === 0) fehlt.push(`${n}:${o[n - 1]}`);
      }
      expect(fehlt, `${l}: Einheiten ohne Zeile`).toEqual([]);
    });
  }

  it("★ an der ¨-Sprosse tragen mindestens 12 Zeilen ein ü (Befund ES-T1 §3: sonst nie geübt)", () => {
    const mitUe = ZEILEN.filter((t) => sprosseAuf(t, "es") === 31 && t.toLowerCase().includes("ü"));
    expect(mitUe.length).toBeGreaterThanOrEqual(12);
    // Und ü steht NUR dort oder später: vor ¨ ist es nicht tippbar.
    expect(ZEILEN.filter((t) => t.includes("ü") && (sprosseAuf(t, "latam") ?? 0) < 31)).toEqual([]);
  });

  for (const l of TASTATUREN) {
    it(`${l}: mit echtem Korpus steht ü an der ¨-Sprosse in echten Runden für Jugendliche`, () => {
      const { o } = grenzen(l);
      const intro = o.slice(0, o.indexOf("¨") + 1);
      const echt = Math.random;
      let s = 7101;
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
          for (const z of adaptiveRound({ introduced: intro, focus: ["¨"], stufe: "teens", lang: "es", lernweg: "es", count: 12 })) {
            texte.push(z.text);
          }
        }
      } finally {
        Math.random = echt;
      }
      expect(texte.some((t) => t.toLowerCase().includes("ü")), texte.slice(0, 12).join(" / ")).toBe(true);
    });
  }

  it("Gegenprobe: eine falsch eingeordnete Zeile wird gemeldet, Grossbuchstabe gilt als ⇧", () => {
    expect(enthaeltEinheit("Tomás entrena", SHIFT_UNIT)).toBe(true);
    expect(enthaeltEinheit("tomás entrena", SHIFT_UNIT)).toBe(false);
    expect(enthaeltEinheit("Soy bilingüe", "¨")).toBe(true);
    expect(ohneNeueEinheit([{ text: "El bus sale", sprosse: 22 }], "es")).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "Paula repasa", sprosse: 22 }], "latam")).toEqual([]);
  });
});

// ── Form: Satzanfang gross, keine Satzzeichen ───────────────────────────────

const ERLAUBTE_ZEICHEN = /^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ ]+$/;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) || t[0] === t[0].toLowerCase() || t !== t.trim() || t.includes("  ");

describe("ES-T5: Satzanfang gross, noch keine Satzzeichen", () => {
  it("jede Zeile beginnt gross und besteht nur aus Buchstaben und einfachen Leerzeichen", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kleinschreibung am Anfang, Punkt, Komma, ¿?, ¡! und doppeltes Leerzeichen werden gefunden", () => {
    for (const t of ["el bus sale", "El bus sale.", "Che, vení", "¿Vamos?", "¡Gol!", "El  bus", "Hip-hop"]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("Núria escala")).toBe(false);
  });

  it("jeder Eintrag: kind satz, stufen [teens], nurWeg es, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_ES_MITTE_TEENS) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["teens"]);
      expect(item.nurWeg, item.text).toBe("es");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Orte: jedes grossgeschriebene Wort ist bekannt, Spanien/Mexiko je ≤ ⅓ ───

/**
 * Orte, Landschaften und Feste mit ihrem Land - als WORTGRUPPE, damit „Puerto
 * Montt" nicht als Puerto Rico und „San Salvador" nicht als San Juan zählt
 * (längste Gruppe gewinnt). REGION = kein einzelnes Land.
 */
const ORTE: Record<string, string> = {
  // Spanien
  Madrid: "ES", Lekeitio: "ES", Montserrat: "ES", Mundaka: "ES", Barcelona: "ES", "Cabo de Palos": "ES",
  "Puerta del Sol": "ES", Galicia: "ES", Valencia: "ES", Turia: "ES", Mallorca: "ES", Cádiz: "ES",
  Extremadura: "ES", Navarra: "ES", Tarifa: "ES",
  // Mexiko
  Cancún: "MX", Tulum: "MX", Toluca: "MX", Acapulco: "MX", Yucatán: "MX", Cozumel: "MX", México: "MX",
  Puebla: "MX", Oaxaca: "MX", Tijuana: "MX",
  // Perú, Bolivia
  Cusco: "PE", Tacna: "PE", Lima: "PE", Miraflores: "PE", Arequipa: "PE", Iquitos: "PE", Ayacucho: "PE",
  Nazca: "PE", Perú: "PE",
  "La Paz": "BO", "El Alto": "BO", Cochabamba: "BO", Oruro: "BO",
  // Argentina, Chile, Uruguay, Paraguay
  Rosario: "AR", Salta: "AR", Tigre: "AR", "Buenos Aires": "AR", Tucumán: "AR", Ushuaia: "AR",
  Neuquén: "AR", Mendoza: "AR", Aconcagua: "AR", "Puerto Madryn": "AR",
  Arica: "CL", Concepción: "CL", "Puerto Montt": "CL", Farellones: "CL", Iquique: "CL", "San Cristóbal": "CL",
  Santiago: "CL", Chile: "CL", Valparaíso: "CL", Villarrica: "CL", Temuco: "CL", Atacama: "CL",
  "Tierra del Fuego": "CL",
  Salto: "UY", Montevideo: "UY", Uruguay: "UY", "Punta del Este": "UY",
  Asunción: "PY", Paraguay: "PY", Encarnación: "PY",
  // Kolumbien, Venezuela, Ecuador
  Cali: "CO", Medellín: "CO", Montería: "CO", Bogotá: "CO", Barranquilla: "CO", "Parque Tayrona": "CO",
  Cartagena: "CO", Riohacha: "CO",
  Caracas: "VE", Maracaibo: "VE", Ávila: "VE",
  Quito: "EC", Otavalo: "EC", Montañita: "EC",
  // Karibik, Mittelamerika, Afrika
  Cuba: "CU", "La Habana": "CU", Matanzas: "CU",
  "Puerto Rico": "PR", "San Juan": "PR", "El Yunque": "PR", "Santo Domingo": "DO",
  "Costa Rica": "CR", "San José": "CR", Panamá: "PA", "Bocas del Toro": "PA",
  Petén: "GT", Tikal: "GT", Guatemala: "GT", Xela: "GT",
  Managua: "NI", Nicaragua: "NI", Tegucigalpa: "HN", Honduras: "HN", Roatán: "HN", "San Salvador": "SV",
  Malabo: "GQ",
  // Regionen über mehrere Länder
  Antártida: "REGION",
};

/** Menschen (und ein Werk: el Quijote, el Güegüense) - aus allen Regionen. */
const NAMEN = new Set(
  (
    "Aitana Ana Antonella Ayelén Caicedo Carmen Carolina Celia Cruz Emilia Emiliano Fernanda Florencia " +
    "Güegüense Illari Iratxe Ixchel Julieta Lautaro Leire Leonor Linda Martina Martín Matías Newton " +
    "Núria Paola Paula Pilar Quijote Ramiro Raquel Rayén Regina Renata Salomé Selena Sofía Tomás " +
    "Valeria Wara Washington Wayra Xóchitl"
  ).split(" "),
);

/** Orte einer Zeile (längste Wortgruppe zuerst) und die Wortstellen, die sie bedecken. */
function orteIn(zeile: string): { laender: Set<string>; bedeckt: Set<number> } {
  const w = zeile.split(" ");
  const laender = new Set<string>();
  const bedeckt = new Set<number>();
  for (let i = 0; i < w.length; i++) {
    for (const len of [3, 2, 1]) {
      const gruppe = w.slice(i, i + len).join(" ");
      if (i + len <= w.length && gruppe in ORTE) {
        laender.add(ORTE[gruppe]);
        for (let k = i; k < i + len; k++) bedeckt.add(k);
        i += len - 1;
        break;
      }
    }
  }
  return { laender, bedeckt };
}

/** Grossgeschriebene Wörter innerhalb der Zeile, die weder Teil eines Ortes noch ein Name sind. */
function unbekannteGrosswoerter(zeile: string): string[] {
  const { bedeckt } = orteIn(zeile);
  return zeile
    .split(" ")
    .filter((w, i) => i > 0 && w[0] !== w[0].toLowerCase() && !bedeckt.has(i) && !NAMEN.has(w));
}

function verteilung(zeilen: string[]): { verortet: number; es: number; mx: number } {
  const verortet = zeilen.filter((z) => orteIn(z).laender.size > 0);
  return {
    verortet: verortet.length,
    es: verortet.filter((z) => orteIn(z).laender.has("ES")).length,
    mx: verortet.filter((z) => orteIn(z).laender.has("MX")).length,
  };
}

describe("ES-T5: Orte aus der ganzen spanischsprachigen Welt", () => {
  it("jedes grossgeschriebene Wort in der Zeile ist Teil eines bekannten Ortes oder ein Name", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("höchstens ein Drittel der verorteten Zeilen in Spanien, höchstens ein Drittel in Mexiko", () => {
    const v = verteilung(ZEILEN);
    expect(v.verortet).toBeGreaterThanOrEqual(110);
    expect(v.es * 3, `Spanien ${v.es} von ${v.verortet}`).toBeLessThanOrEqual(v.verortet);
    expect(v.mx * 3, `Mexiko ${v.mx} von ${v.verortet}`).toBeLessThanOrEqual(v.verortet);
  });

  it("mindestens 18 Länder kommen vor", () => {
    const laender = new Set(ZEILEN.flatMap((z) => [...orteIn(z).laender]).filter((l) => l !== "REGION"));
    expect(laender.size).toBeGreaterThanOrEqual(18);
  });

  it("Gegenprobe: ein unbekannter Ort wird gemeldet, Wortgruppen zählen richtig, nur Spanien fällt durch", () => {
    expect(unbekannteGrosswoerter("Ana vive en Atlantis")).toEqual(["Atlantis"]);
    expect(unbekannteGrosswoerter("Desde El Alto se ve La Paz")).toEqual([]);
    expect(unbekannteGrosswoerter("Vamos a Puerto Natales")).toEqual(["Puerto", "Natales"]);
    expect(orteIn("En Puerto Montt comemos curanto").laender).toEqual(new Set(["CL"]));
    expect(orteIn("Mi prima de San Salvador").laender).toEqual(new Set(["SV"]));
    const v = verteilung(["En Madrid", "En Tarifa", "En Lima"]);
    expect(v.es * 3 > v.verortet).toBe(true);
  });
});

// ── Wortschatz: Wortgrenze 8, Sperrliste ────────────────────────────────────

/** Funktionswörter tragen in jeder Sprache die meiste Last - sie zählen nicht. */
const FUNKTIONSWOERTER = new Set(
  (
    "el la los las lo un una unos unas le les se me te nos mi mis tu tus su sus " +
    "de del a al en con sin por para y e o ni que no sí si muy más " +
    "es son era está están ser estar ella ellas él ellos yo tú " +
    "esa ese esas esos esta este estas estos esto eso todo toda todos todas"
  ).split(" "),
);

function zuHaeufig(zeilen: string[], grenze = 8): string[] {
  const n = new Map<string, number>();
  for (const z of zeilen) {
    for (const w of new Set(z.toLowerCase().split(" "))) if (!FUNKTIONSWOERTER.has(w)) n.set(w, (n.get(w) ?? 0) + 1);
  }
  return [...n].filter(([, k]) => k > grenze).map(([w, k]) => `"${w}": ${k} Zeilen`);
}

/** Sperrliste wie `scripts/messe-worthaeufigkeit-es.py` (Stämme + genaue Wörter). */
const SPERR_STAEMME = [
  "coj", "cog", "concha", "poll", "papay", "pico", "paja", "chaquet", "bich", "cach", "pendej", "culo",
  "verga", "jod", "coñ", "cabron", "cabrón", "pinche", "ching", "huevon", "huevón", "bolud", "mamad", "cipote",
];
const SPERR_WOERTER = new Set([
  "sólo", "éste", "ésta", "éstos", "éstas", "ése", "ésa", "aquél", "guión", "os", "vosotros", "vosotras",
  "vuestro", "vuestra", "sois", "coche", "coches", "patinete", "ordenador", "móvil", "zumo", "gafas", "vale",
  "tío", "tía", "tíos", "guay", "chulo", "mola", "currar", "tonto", "tonta", "tontos", "feo", "fea", "gordo",
  "gorda", "idiota", "estúpido",
]);
function gesperrt(zeile: string): string[] {
  return zeile
    .toLowerCase()
    .split(" ")
    .filter((w) => SPERR_WOERTER.has(w) || SPERR_STAEMME.some((s) => w.includes(s)) || /(áis|éis)$/.test(w));
}

describe("ES-T5: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("auch über beide Jugend-Chargen (früh + Mitte) zusammen steht kein Inhaltswort in mehr als 8 Zeilen", () => {
    const fehler = zuHaeufig([...FRUEHE_TEENS, ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die abgenutzten Wörter der frühen Chargen bleiben draussen (salsa, sala, nada, lee, sal)", () => {
    const fehler = ZEILEN.filter((z) => z.toLowerCase().split(" ").some((w) => ["salsa", "sala", "nada", "lee", "sal"].includes(w)));
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross am Satzanfang), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Liceo" : "el liceo"} ${"abcdefghi"[i]}`);
    expect(zuHaeufig(neun)).toEqual(['"liceo": 9 Zeilen']);
    expect(["Nada de nada", "Sala de estar"].filter((z) => z.toLowerCase().split(" ").some((w) => ["nada", "sala"].includes(w)))).toHaveLength(2);
  });

  it("kein Wort aus der Sperrliste, keine vosotros-Form", () => {
    const fehler = ZEILEN.flatMap((t) => gesperrt(t).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Móvil (gross), recoger, vehículo, típico und entrenáis werden gefunden", () => {
    expect(gesperrt("Móvil nuevo")).toEqual(["móvil"]);
    expect(gesperrt("Hay que recoger")).toEqual(["recoger"]);
    expect(gesperrt("Un vehículo")).toEqual(["vehículo"]);
    expect(gesperrt("Un plato típico")).toEqual(["típico"]);
    expect(gesperrt("Entrenáis tarde")).toEqual(["entrenáis"]);
  });
});

// ── Keine Kopien, keine Paare, Anker ────────────────────────────────────────

/** Geschlecht und Zahl gleichgesetzt: „El bombero sale" und „La bombera sale" sind ein Paar. */
function paarForm(zeile: string): string {
  const art: Record<string, string> = { el: "ART", la: "ART", los: "ART", las: "ART", un: "EIN", una: "EIN" };
  const pron: Record<string, string> = { él: "PRO", ella: "PRO", ellos: "PRO", ellas: "PRO" };
  return zeile
    .toLowerCase()
    .split(" ")
    .map((w) => art[w] ?? pron[w] ?? w.replace(/(es|s)$/, "").replace(/[oae]$/, "_"))
    .join(" ");
}

/** Paare unter `zeilen` und zwischen `zeilen` und den Vergleichszeilen `gegen`. */
function paare(zeilen: string[], gegen: string[] = []): string[] {
  const gesehen = new Map<string, string>();
  for (const z of gegen) gesehen.set(paarForm(z), `früher: ${z}`);
  const out: string[] = [];
  for (const z of zeilen) {
    const f = paarForm(z);
    const frueher = gesehen.get(f);
    if (frueher !== undefined) out.push(`"${frueher}" / "${z}"`);
    else gesehen.set(f, z);
  }
  return out;
}

describe("ES-T5: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der ñ/á nicht kennt)", () => {
    expect(new Set(ZEILEN.map((t) => t.toLowerCase())).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer früheren Zeile - weder es (T1-T4) noch de/en/fr (Text oder Ledger-Schlüssel)", () => {
    const eigene = new Set(ZEILEN);
    const frueher = [...CORPUS_ES.filter((i) => !eigene.has(i.text)), ...CORPUS, ...CORPUS_EN, ...CORPUS_FR];
    const texte = new Set(frueher.map((i) => i.text.toLowerCase()));
    const schluessel = new Set(frueher.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CORPUS_ES_MITTE_TEENS.filter(
      (i) => texte.has(i.text.toLowerCase()) || schluessel.has(bausteinKey(i.kind, i.text)),
    ).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("keine Paare - weder untereinander noch mit einer Kinderzeile oder einer frühen Jugendzeile (Falle 31)", () => {
    const fehler = paare(ZEILEN, [...KINDERZEILEN, ...FRUEHE_TEENS]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kopie einer Kinderzeile mit anderer Grossschreibung, Paar und Ledger-Schlüssel werden erkannt", () => {
    // „Mi lápiz es azul" steht in der Kinder-Mitte-Charge - „Mis lápices son azules" wäre fast ein Paar,
    // „mi lápiz es azul" eine Kopie.
    expect(KINDERZEILEN).toContain("Mi lápiz es azul");
    expect(paare(["mi lápiz es azul"], KINDERZEILEN)).toHaveLength(1);
    expect(paare(["El bombero sale", "La bombera sale"])).toHaveLength(1);
    expect(bausteinKey("satz", "Ser bombera")).toBe(bausteinKey("satz", "ser bombera"));
    expect(paare(["La sal", "La sala"])).toEqual([]);
  });
});

describe("ES-T5: Korpus-Anker und Auslieferung", () => {
  /**
   * ★ ES-T6 (27.09.2026): Seit der Erwachsenen-Mitte-Charge steht diese Charge
   * nicht mehr ganz hinten, sondern als geschlossener Block DIREKT HINTER der
   * Kinder-Mitte-Charge - dahinter kommen nur spätere Chargen (Anker nur anhängend).
   */
  it("CORPUS_ES trägt jede Zeile dieser Charge als geschlossenen Block direkt hinter der Kinder-Mitte-Charge", () => {
    const es = CORPUS_ES.map((i) => i.text);
    expect(ZEILEN.filter((t) => !es.includes(t))).toEqual([]);
    const start = es.indexOf(ZEILEN[0]);
    expect(es.slice(start, start + ZEILEN.length)).toEqual(ZEILEN);
    const kinderMitte = CORPUS_ES_MITTE_KIDS.map((i) => i.text);
    expect(es.slice(start - kinderMitte.length, start)).toEqual(kinderMitte);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_ES_MITTE_TEENS.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "Zzz probe es t5", kind: "satz" as const, stufen: ["teens" as const] };
    const ids = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  for (const l of TASTATUREN) {
    it(`${l}: Weg „es" bekommt für Jugendliche an Sprosse 30 jede Zeile dieser Charge - und nur eigene es-Jugendzeilen`, () => {
      const { letzte, o } = grenzen(l);
      const allowed = allowedFromIntroduced(o.slice(0, letzte), "es");
      const geliefert = corpusItemsFor({ stufe: "teens", allowed, lang: "es", lernweg: "es" });
      expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
      // ★ ES-T8 (27.09.2026): verglichen wird mit der SERVIERTEN Fassung - die
      // Jugend-Ende-Charge kommt ab „y" ohne ihre noch nicht gelernten
      // Satzzeichen an (`fitText`), also nicht wortgleich mit ihrem Rohtext.
      const eigeneJugend = new Set(
        CORPUS_ES.filter((i) => i.nurWeg === "es" && i.stufen.includes("teens")).map((i) => fitText(i.text, allowed, "es")),
      );
      expect(geliefert.filter((t) => !eigeneJugend.has(t))).toEqual([]);
    });
  }

  it("eine Sprosse vor p kommt keine Zeile mit p … w an (fitText rechnet mit, nicht der Kommentar)", () => {
    const { mayus, o } = grenzen("es");
    const allowed = allowedFromIntroduced(o.slice(0, mayus), "es");
    const geliefert = corpusItemsFor({ stufe: "teens", allowed, lang: "es", lernweg: "es" });
    expect(geliefert.filter((t) => /[pqbghvyzxüw]/i.test(t))).toEqual([]);
    expect(geliefert.some((t) => ZEILEN.includes(t))).toBe(true);
  });
});
