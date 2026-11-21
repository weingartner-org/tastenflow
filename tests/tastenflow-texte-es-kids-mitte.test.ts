/**
 * ★★★ Wächter ES-T4 (27.09.2026): die mittleren es-Texte für Kinder
 * (`corpusEsMitteKids.ts`, Sprossen 19-30 - Mayús bis w; ★ seit D-1 am 28.09.2026: 19-32, mit „." „," an 20/21).
 * Bauplan `BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md` §4/§5, Wächter W6/W8
 * aus `BAUPLAN-2026-09-26-NEUE-SPRACHE-EFFIZIENT.md` §4, Leitfaden Fallen
 * 26/31/37/45/48; Aufbau wie `tastenflow-texte-es-kids-frueh.test.ts`.
 *
 * Die Sprosse einer Zeile wird AUSGERECHNET: kleinstes n, ab dem `fitText` sie
 * mit `introOrder("es").slice(0, n)` durchlässt - auf BEIDEN Pflicht-Tastaturen
 * (ES und LatAm) -, mindestens aber die Mayús-Sprosse: Grossbuchstaben sind vor
 * Mayús nur über die Auto-Grossschreibung tippbar (corpus.ts, KERNREGEL), die
 * Zeilen dieser Charge gehören zur Mayús-Stufe. Jede Regel hat eine Gegenprobe.
 */
import { afterEach, describe, expect, it } from "vitest";
import { setLayout, type LayoutId } from "../src/lib/typing/layouts";
import { introOrder, SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitText, corpusItemsFor, CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { CORPUS_ES } from "../src/lib/typing/corpusEs";
import { CORPUS_ES_MITTE_KIDS } from "../src/lib/typing/corpusEsMitteKids";
import { CORPUS_ES_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusEsWegFruehKids";
import { allowedFromIntroduced } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { bausteinId, bausteinKey } from "../src/lib/typing/ledger";
import { adaptiveRound } from "../src/lib/typing/generator";
import { corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";

afterEach(() => setLayout("de"));

const TASTATUREN: LayoutId[] = ["es", "latam"];
const ZEILEN = CORPUS_ES_MITTE_KIDS.map((i) => i.text);
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

describe("ES-T4: jede Zeile an ihrer Sprosse (ES und LatAm)", () => {
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
      for (const item of CORPUS_ES_MITTE_KIDS) {
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
   * frühestens an Sprosse 17, nie in die ganz frühen Runden (ES-T1).
   */
  it("keine Zeile rutscht über die Auto-Grossschreibung vor Sprosse 17", () => {
    const fehler = ZEILEN.filter((t) => (buchstabenSprosse(t, "es") ?? 0) < 17);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Sprossen werden richtig gerechnet", () => {
    expect(sprosseAuf("Ana corre", "es")).toBe(19);
    expect(buchstabenSprosse("Ana corre", "es")).toBe(15);
    expect(sprosseAuf("Pedro corre", "latam")).toBe(22);
    expect(sprosseAuf("El pingüino", "es")).toBe(31);
    expect(sprosseAuf("Un kiwi", "latam")).toBe(32);
    expect(sprosseAuf("Hola Ana", "es")).toBe(26);
    expect(sprosseAuf("¿Hola Ana?", "es")).toBeNull(); // ¿? gibt es erst nach dem Alphabet
  });

  /** GEMESSEN am Ende von ES-T4 (vom Code gezählt) - darf künftig nur STEIGEN. */
  // ★ D-1 (28.09.2026): Buchstaben-Sprossen nach Mayús zwei später (20/21 =
  // Punkt und Komma, dort beginnt keine Zeile - sie sind weglassbar).
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    19: 25, 22: 23, 23: 22, 24: 27, 25: 24, 26: 23, 27: 25, 28: 25, 29: 25, 30: 17, 31: 16, 32: 13,
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

describe("ES-T4: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
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
    // Und ü steht NUR dort: vor ¨ ist es nicht tippbar.
    expect(ZEILEN.filter((t) => t.includes("ü") && (sprosseAuf(t, "latam") ?? 0) < 31)).toEqual([]);
  });

  for (const l of TASTATUREN) {
    it(`${l}: mit echtem Korpus steht ü an der ¨-Sprosse in echten Runden (Mein Training)`, () => {
      const { o } = grenzen(l);
      const intro = o.slice(0, o.indexOf("¨") + 1);
      const echt = Math.random;
      let s = 7001;
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
          for (const z of adaptiveRound({ introduced: intro, focus: ["¨"], stufe: "kids", lang: "es", lernweg: "es", count: 12 })) {
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
    expect(enthaeltEinheit("Lucía estudia", SHIFT_UNIT)).toBe(true);
    expect(enthaeltEinheit("lucía estudia", SHIFT_UNIT)).toBe(false);
    expect(enthaeltEinheit("La cigüeña", "¨")).toBe(true);
    expect(ohneNeueEinheit([{ text: "El sol sale", sprosse: 22 }], "es")).toHaveLength(1);
    expect(ohneNeueEinheit([{ text: "Pedro corre", sprosse: 22 }], "latam")).toEqual([]);
  });
});

// ── Form: Satzanfang gross, keine Satzzeichen ───────────────────────────────

const ERLAUBTE_ZEICHEN = /^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ ]+$/;
const formFehler = (t: string): boolean =>
  !ERLAUBTE_ZEICHEN.test(t) || t[0] === t[0].toLowerCase() || t !== t.trim() || t.includes("  ");

describe("ES-T4: Satzanfang gross, noch keine Satzzeichen", () => {
  it("jede Zeile beginnt gross und besteht nur aus Buchstaben und einfachen Leerzeichen", () => {
    const fehler = ZEILEN.filter(formFehler);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kleinschreibung am Anfang, Punkt, Komma, ¿?, ¡! und doppeltes Leerzeichen werden gefunden", () => {
    for (const t of ["el sol sale", "El sol sale.", "Hola, Ana", "¿Vienes?", "¡Vamos!", "El  sol", "Ana-María"]) {
      expect(formFehler(t), t).toBe(true);
    }
    expect(formFehler("Úrsula canta")).toBe(false);
  });

  it("jeder Eintrag: kind satz, stufen [kids], nurWeg es, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_ES_MITTE_KIDS) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["kids"]);
      expect(item.nurWeg, item.text).toBe("es");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Orte: jedes grossgeschriebene Wort ist bekannt, Spanien/Mexiko je ≤ ⅓ ───

/** Orte, Landschaften und Feste mit ihrem Land (Region = kein einzelnes Land). */
const ORTE: Record<string, string> = {
  // Spanien
  Alicante: "ES", Barcelona: "ES", Bilbao: "ES", Canarias: "ES", Castilla: "ES", Cádiz: "ES",
  Galicia: "ES", Lanzarote: "ES", Madrid: "ES", Málaga: "ES", Salamanca: "ES", Sevilla: "ES",
  Tenerife: "ES", Toledo: "ES", Valencia: "ES", Vigo: "ES", Zaragoza: "ES", Ebro: "ES", Fallas: "ES",
  // Mexiko
  Cancún: "MX", Chiapas: "MX", Guadalajara: "MX", Guanajuato: "MX", México: "MX", Monterrey: "MX",
  Oaxaca: "MX", Popocatépetl: "MX", Puebla: "MX", Querétaro: "MX", Quintana: "MX", Roo: "MX",
  Tenochtitlan: "MX", Uxmal: "MX", Xochimilco: "MX", Yucatán: "MX", Zacatecas: "MX",
  California: "MX", Cuernavaca: "MX", Silla: "MX", Día: "MX", Muertos: "MX",
  // Perú, Bolivia
  Lima: "PE", Cusco: "PE", Arequipa: "PE", Iquitos: "PE", Paracas: "PE", Puno: "PE", Perú: "PE",
  Machu: "PE", Picchu: "PE", Ayacucho: "PE", Titicaca: "PE", Inti: "PE", Raymi: "PE",
  Oruro: "BO", Potosí: "BO", Cochabamba: "BO", Bolivia: "BO", Paz: "BO",
  // Argentina, Chile, Uruguay, Paraguay
  Tucumán: "AR", Rosario: "AR", Salta: "AR", Buenos: "AR", Aires: "AR", Córdoba: "AR", Bariloche: "AR",
  Humahuaca: "AR", Iguazú: "AR", Mendoza: "AR", Aconcagua: "AR", Península: "AR", Valdés: "AR",
  Tombo: "AR", Patagonia: "AR", Argentina: "AR",
  Temuco: "CL", Iquique: "CL", Chiloé: "CL", Chile: "CL", Santiago: "CL", Valparaíso: "CL", Arenas: "CL",
  We: "CL", Tripantu: "CL",
  Montevideo: "UY", Uruguay: "UY", Encarnación: "PY", Paraguay: "PY",
  // Kolumbien, Venezuela, Ecuador
  Medellín: "CO", Barranquilla: "CO", Bogotá: "CO", Cartagena: "CO", Colombia: "CO",
  Caracas: "VE", Maracaibo: "VE", Mérida: "VE", Venezuela: "VE",
  Ecuador: "EC", Quito: "EC", Guayaquil: "EC", Galápagos: "EC",
  // Karibik, Mittelamerika, Afrika
  Baracoa: "CU", Habana: "CU", Holguín: "CU", Camagüey: "CU",
  Puerto: "PR", Rico: "PR", San: "PR", Juan: "PR", Mayagüez: "PR", Santo: "DO", Domingo: "DO",
  Panamá: "PA", Costa: "CR", Rica: "CR", Nicaragua: "NI", Cocibolca: "NI",
  Honduras: "HN", Tegucigalpa: "HN", Copán: "HN", Salvador: "SV", Guatemala: "GT", Atitlán: "GT",
  Guinea: "GQ", Ecuatorial: "GQ",
  // Regionen über mehrere Länder
  Andes: "REGION", Caribe: "REGION", América: "REGION",
};

/** Menschen (und ein Hund) - aus allen Regionen. */
const NAMEN = new Set(
  (
    "Abril Adrián Agustina Ailén Alexis Amparo Anahí Andrés Arami Beatriz Belén Benjamín Bruno Bárbara " +
    "Camila Charles Citlali Daniela Darwin Darío Diego Emilio Enrique Esteban Eva Félix Gabriela Gael " +
    "Gloria Gonzalo Guadalupe Guillermo Güemes Hernán Hugo Humboldt Héctor Iker Inés Irene Iris Irma Isa " +
    "Isabel Itzel Iván Joaquín Joel Julián Killa Leo Lorena Lorenzo Lucía Marcos Marisol Maritza Mateo " +
    "Maya Micaela Máximo Nahuel Nerea Nicolás Octavio Pablo Paloma Parra Patricia Pedro Pepa Pilar " +
    "Pirata Quique Ramón Raquel Rubén Sebastián Silvia Simón Tamara Valentina Vicente Victoria Violeta " +
    "Walter Wendy Wilson Ximena Xiomara Yamila Yolanda Zoe Álvaro Óscar Úrsula"
  ).split(" "),
);

/** Teile von Ortsnamen (La Habana, El Salvador, Ciudad de México, Cerro de la Silla, Punta Tombo). */
const PARTIKEL = new Set(["La", "El", "Ciudad", "Cerro", "Punta"]);

/** Grossgeschriebene Wörter innerhalb der Zeile, die weder Ort, Name noch Partikel sind. */
function unbekannteGrosswoerter(zeile: string): string[] {
  return zeile
    .split(" ")
    .slice(1)
    .filter((w) => w[0] !== w[0].toLowerCase())
    .filter((w) => !(w in ORTE) && !NAMEN.has(w) && !PARTIKEL.has(w));
}

/** Die Länder einer Zeile (auch das erste Wort kann ein Ort sein: „Quito está …"). */
function laenderIn(zeile: string): Set<string> {
  return new Set(zeile.split(" ").filter((w) => w in ORTE).map((w) => ORTE[w]));
}

function verteilung(zeilen: string[]): { verortet: number; es: number; mx: number } {
  const verortet = zeilen.filter((z) => laenderIn(z).size > 0);
  return {
    verortet: verortet.length,
    es: verortet.filter((z) => laenderIn(z).has("ES")).length,
    mx: verortet.filter((z) => laenderIn(z).has("MX")).length,
  };
}

describe("ES-T4: Orte aus der ganzen spanischsprachigen Welt", () => {
  it("jedes grossgeschriebene Wort in der Zeile ist ein bekannter Ort, Name oder Teil eines Ortsnamens", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("höchstens ein Drittel der verorteten Zeilen in Spanien, höchstens ein Drittel in Mexiko", () => {
    const v = verteilung(ZEILEN);
    expect(v.verortet).toBeGreaterThanOrEqual(90);
    expect(v.es * 3, `Spanien ${v.es} von ${v.verortet}`).toBeLessThanOrEqual(v.verortet);
    expect(v.mx * 3, `Mexiko ${v.mx} von ${v.verortet}`).toBeLessThanOrEqual(v.verortet);
  });

  it("mindestens 15 Länder kommen vor", () => {
    const laender = new Set(ZEILEN.flatMap((z) => [...laenderIn(z)]).filter((l) => l !== "REGION"));
    expect(laender.size).toBeGreaterThanOrEqual(15);
  });

  it("Gegenprobe: ein unbekannter Ort wird gemeldet, eine Charge nur aus Spanien fällt durch", () => {
    expect(unbekannteGrosswoerter("Ana vive en Atlantis")).toEqual(["Atlantis"]);
    expect(unbekannteGrosswoerter("Quito está en La Paz")).toEqual([]);
    const nurSpanien = ["En Madrid", "En Sevilla", "En Lima"];
    const v = verteilung(nurSpanien);
    expect(v.es * 3 > v.verortet).toBe(true);
    expect(laenderIn("La Ciudad de México")).toEqual(new Set(["MX"]));
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

describe("ES-T4: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("auch über beide Kinder-Chargen (früh + Mitte) zusammen steht kein Inhaltswort in mehr als 8 Zeilen", () => {
    const fehler = zuHaeufig([...CORPUS_ES_WEG_FRUEH_KIDS.map((i) => i.text), ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die abgenutzten Wörter der frühen Charge bleiben draussen (salsa, sala, nada, lee, sal)", () => {
    const fehler = ZEILEN.filter((z) => z.toLowerCase().split(" ").some((w) => ["salsa", "sala", "nada", "lee", "sal"].includes(w)));
    expect(fehler).toEqual([]);
  });

  it("Gegenprobe: ein Inhaltswort in 9 Zeilen wird gemeldet (auch gross am Satzanfang), ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `${i % 2 ? "Luna" : "la luna"} ${"abcdefghi"[i]}`);
    expect(zuHaeufig(neun)).toEqual(['"luna": 9 Zeilen']);
  });

  it("kein Wort aus der Sperrliste, keine vosotros-Form", () => {
    const fehler = ZEILEN.flatMap((t) => gesperrt(t).map((w) => `"${t}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Pollo (gross), recoger, os, coméis und círculo werden gefunden", () => {
    expect(gesperrt("Pollo asado")).toEqual(["pollo"]);
    expect(gesperrt("A recoger")).toEqual(["recoger"]);
    expect(gesperrt("Os lo dan")).toEqual(["os"]);
    expect(gesperrt("Coméis tarde")).toEqual(["coméis"]);
    expect(gesperrt("Un círculo")).toEqual(["círculo"]);
  });
});

// ── Keine Kopien, keine Paare, Anker ────────────────────────────────────────

/** Geschlecht und Zahl gleichgesetzt: „El nene nada" und „La nena nada" sind ein Paar. */
function paarForm(zeile: string): string {
  const art: Record<string, string> = { el: "ART", la: "ART", los: "ART", las: "ART", un: "EIN", una: "EIN" };
  const pron: Record<string, string> = { él: "PRO", ella: "PRO", ellos: "PRO", ellas: "PRO" };
  return zeile
    .toLowerCase()
    .split(" ")
    .map((w) => art[w] ?? pron[w] ?? w.replace(/(es|s)$/, "").replace(/[oae]$/, "_"))
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

describe("ES-T4: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der ñ/á nicht kennt)", () => {
    expect(new Set(ZEILEN.map((t) => t.toLowerCase())).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer früheren Zeile - weder es (T1-T3) noch de/en/fr (Text oder Ledger-Schlüssel)", () => {
    const eigene = new Set(ZEILEN);
    const frueher = [...CORPUS_ES.filter((i) => !eigene.has(i.text)), ...CORPUS, ...CORPUS_EN, ...CORPUS_FR];
    const texte = new Set(frueher.map((i) => i.text.toLowerCase()));
    const schluessel = new Set(frueher.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CORPUS_ES_MITTE_KIDS.filter(
      (i) => texte.has(i.text.toLowerCase()) || schluessel.has(bausteinKey(i.kind, i.text)),
    ).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("keine Paare (nur Geschlecht oder Zahl getauscht) - auch nicht mit der frühen Kinder-Charge", () => {
    const fehler = paare([...CORPUS_ES_WEG_FRUEH_KIDS.map((i) => i.text), ...ZEILEN]);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kopie mit anderer Grossschreibung, Paar und Ledger-Schlüssel werden erkannt", () => {
    expect(paare(["El nene canta", "La nena canta"])).toHaveLength(1);
    expect(paare(["El mono salta", "el mono salta"])).toHaveLength(1);
    expect(bausteinKey("satz", "La sal")).toBe(bausteinKey("satz", "la sal"));
    expect(paare(["La sal", "La sala"])).toEqual([]);
  });
});

describe("ES-T4: Korpus-Anker und Auslieferung", () => {
  /**
   * ★ ES-T5 (27.09.2026): Seit der Jugend-Mitte-Charge steht diese Charge
   * nicht mehr ganz hinten, sondern als geschlossener Block HINTER den drei
   * frühen Chargen - dahinter kommen nur spätere Chargen (Anker nur anhängend).
   */
  it("CORPUS_ES trägt jede Zeile dieser Charge als geschlossenen Block hinter den frühen Chargen", () => {
    const es = CORPUS_ES.map((i) => i.text);
    expect(ZEILEN.filter((t) => !es.includes(t))).toEqual([]);
    const start = es.indexOf(ZEILEN[0]);
    expect(es.slice(start, start + ZEILEN.length)).toEqual(ZEILEN);
    const frueh = CORPUS_ES.slice(0, start);
    expect(frueh.every((i) => i.text === i.text.toLowerCase())).toBe(true); // vor Mayús: alles klein
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_ES_MITTE_KIDS.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "Zzz probe es t4", kind: "satz" as const, stufen: ["kids" as const] };
    const ids = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  for (const l of TASTATUREN) {
    it(`${l}: Weg „es" bekommt an Sprosse 30 jede Zeile dieser Charge - und nur eigene es-Kinderzeilen`, () => {
      const { letzte, o } = grenzen(l);
      const allowed = allowedFromIntroduced(o.slice(0, letzte), "es");
      const geliefert = corpusItemsFor({ stufe: "kids", allowed, lang: "es", lernweg: "es" });
      expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
      // ★ ES-T7-KIDS-ENDE (27.09.2026): die Ende-Zeilen der Kinder kommen an
      // Sprosse 30 schon an - ohne ihre Satzzeichen (`fitText`). Eigen ist
      // darum der Rohtext ODER seine servierte Fassung bei diesem Stand.
      const eigeneKinder = new Set(
        CORPUS_ES.filter((i) => i.nurWeg === "es" && i.stufen.includes("kids")).flatMap((i) => [
          i.text,
          fitText(i.text, allowed, "es") ?? i.text,
        ]),
      );
      expect(geliefert.filter((t) => !eigeneKinder.has(t))).toEqual([]);
    });
  }

  it("eine Sprosse vor p kommt keine Zeile mit p an (fitText rechnet mit, nicht der Kommentar)", () => {
    const { mayus, o } = grenzen("es");
    const allowed = allowedFromIntroduced(o.slice(0, mayus), "es");
    const geliefert = corpusItemsFor({ stufe: "kids", allowed, lang: "es", lernweg: "es" });
    expect(geliefert.filter((t) => /[pqbghvyzxüw]/i.test(t))).toEqual([]);
    expect(geliefert.some((t) => ZEILEN.includes(t))).toBe(true);
  });
});
