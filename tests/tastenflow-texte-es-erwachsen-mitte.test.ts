/**
 * ★★★ Wächter ES-T6 (27.09.2026): die mittleren es-Texte für Erwachsene
 * (`corpusEsMitteErwachsen.ts`, Sprossen 19-30 - Mayús bis w; ★ seit D-1 am 28.09.2026: 19-32, mit „." „," an 20/21).
 * Bauplan `BAUPLAN-2026-09-27-SPANISCHER-LEHRGANG.md` §4/§5, Wächter W6/W8
 * aus `BAUPLAN-2026-09-26-NEUE-SPRACHE-EFFIZIENT.md` §4, Leitfaden Fallen
 * 26/31/37/45/48. Dieselben Regeln wie der Kinder- und der Jugend-Wächter
 * derselben Sprossen (`tastenflow-texte-es-kids-mitte.test.ts`,
 * `tastenflow-texte-es-teens-mitte.test.ts`), dazu: keine Zeile gleich einer
 * früheren (alle es-Chargen und de/en/fr), kein Paar mit irgendeiner früheren
 * es-Zeile (Falle 31), Wortgrenze über beide Erwachsenen-Chargen (Falle 45).
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
import { CORPUS_ES_MITTE_ERWACHSEN } from "../src/lib/typing/corpusEsMitteErwachsen";
import { CORPUS_ES_MITTE_TEENS } from "../src/lib/typing/corpusEsMitteTeens";
import { CORPUS_ES_WEG_FRUEH_ERWACHSEN } from "../src/lib/typing/corpusEsWegFruehErwachsen";
import { allowedFromIntroduced } from "../src/lib/typing/serien";
import { minTierFor } from "../src/lib/typing/tiers";
import { bausteinId, bausteinKey } from "../src/lib/typing/ledger";
import { adaptiveRound } from "../src/lib/typing/generator";
import { corpusManifest, manifestFor } from "../src/lib/typing/corpusManifest";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";

afterEach(() => setLayout("de"));

const TASTATUREN: LayoutId[] = ["es", "latam"];
const ZEILEN = CORPUS_ES_MITTE_ERWACHSEN.map((i) => i.text);
const FRUEHE_ERWACHSENE = CORPUS_ES_WEG_FRUEH_ERWACHSEN.map((i) => i.text);
/**
 * Alle es-Zeilen VOR dieser Charge (T1-T5) - Paare und Kopien werden gegen sie geprüft.
 * ★ ES-T9 (27.09.2026): bis zum ANFANG dieser Charge gerechnet, nicht mehr vom Ende her -
 * dahinter hängen jetzt spätere Chargen (Ende-Charge der Erwachsenen).
 */
const FRUEHERE_ES = CORPUS_ES.slice(
  0,
  CORPUS_ES.findIndex((i) => i.text === CORPUS_ES_MITTE_ERWACHSEN[0].text),
).map((i) => i.text);
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

describe("ES-T6: jede Zeile an ihrer Sprosse (ES und LatAm)", () => {
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
      for (const item of CORPUS_ES_MITTE_ERWACHSEN) {
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
    expect(sprosseAuf("Vivo en México", "es")).toBe(30); // „México" trägt ein x - nie vor Sprosse 28
  });

  /** GEMESSEN am Ende von ES-T6 (vom Code gezählt) - darf künftig nur STEIGEN. */
  // ★ D-1 (28.09.2026): Buchstaben-Sprossen nach Mayús zwei später (20/21 =
  // Punkt und Komma, dort beginnt keine Zeile - sie sind weglassbar).
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    19: 27, 22: 20, 23: 20, 24: 21, 25: 21, 26: 18, 27: 27, 28: 23, 29: 19, 30: 19, 31: 18, 32: 19,
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

describe("ES-T6: jede Zeile übt die neue Einheit ihrer Sprosse (W6, Falle 37)", () => {
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
    it(`${l}: mit echtem Korpus steht ü an der ¨-Sprosse in echten Runden für Erwachsene`, () => {
      const { o } = grenzen(l);
      const intro = o.slice(0, o.indexOf("¨") + 1);
      const echt = Math.random;
      let s = 7201;
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
          for (const z of adaptiveRound({ introduced: intro, focus: ["¨"], stufe: "erwachsen", lang: "es", lernweg: "es", count: 12 })) {
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

describe("ES-T6: Satzanfang gross, noch keine Satzzeichen", () => {
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

  it("jeder Eintrag: kind satz, stufen [erwachsen], nurWeg es, keine herkunft (eigenes Werk)", () => {
    for (const item of CORPUS_ES_MITTE_ERWACHSEN) {
      expect(item.kind, item.text).toBe("satz");
      expect(item.stufen, item.text).toEqual(["erwachsen"]);
      expect(item.nurWeg, item.text).toBe("es");
      expect(item.herkunft, item.text).toBeUndefined();
    }
  });
});

// ── Orte: jedes grossgeschriebene Wort ist bekannt, Spanien/Mexiko je ≤ ⅓ ───

/**
 * Orte, Landschaften und Länder mit ihrem Land - als WORTGRUPPE, damit „Puerto
 * Montt" nicht als Puerto Rico und „San Salvador" nicht als San Juan zählt
 * (längste Gruppe gewinnt). REGION = kein einzelnes Land. Mehrdeutige Namen
 * stehen nur in der eindeutigen Form: „Cartagena de Indias" (nicht Cartagena
 * in Murcia), „Colonia del Sacramento", „San Pedro Sula"; „Santa Fe" fehlt
 * bewusst (in Bogotá heisst so ein Stadtteil - Lese-Abnahme).
 */
const ORTE: Record<string, string> = {
  // Spanien
  Madrid: "ES", Murcia: "ES", Cáceres: "ES", Almería: "ES", Donostia: "ES", Irún: "ES", Menorca: "ES", Barcelona: "ES",
  Zaragoza: "ES", Lanzarote: "ES", Extremadura: "ES", Sigüenza: "ES", Tarifa: "ES",
  // Mexiko
  Jalisco: "MX", Tijuana: "MX", Querétaro: "MX", Tequila: "MX", Chihuahua: "MX", Monterrey: "MX",
  "Nuevo León": "MX", Oaxaca: "MX", Tlaxcala: "MX", México: "MX", Tlatelolco: "MX",
  // Perú, Bolivia
  Lima: "PE", Cusco: "PE", Piura: "PE", Puno: "PE", Iquitos: "PE", Trujillo: "PE", Arequipa: "PE",
  Ayacucho: "PE", "Machu Picchu": "PE", Perú: "PE",
  Oruro: "BO", Tarija: "BO", Sucre: "BO", "El Alto": "BO", "La Paz": "BO", Cochabamba: "BO", Uyuni: "BO",
  Tiwanaku: "BO",
  // Argentina, Chile, Uruguay, Paraguay
  Rosario: "AR", Salta: "AR", Corrientes: "AR", "San Telmo": "AR", Posadas: "AR", Obelisco: "AR",
  "Buenos Aires": "AR", Argentina: "AR", Misiones: "AR", Mendoza: "AR", "Punta Tombo": "AR", Trelew: "AR",
  Calama: "CL", "La Serena": "CL", Arica: "CL", "Punta Arenas": "CL", Farellones: "CL", Iquique: "CL",
  Parral: "CL", Chiloé: "CL", Chile: "CL", Atacama: "CL", Magallanes: "CL", "Puerto Montt": "CL",
  "Colonia del Sacramento": "UY", Montevideo: "UY", Uruguay: "UY",
  Asunción: "PY", Encarnación: "PY", Paraguay: "PY",
  // Kolumbien, Venezuela, Ecuador
  Tunja: "CO", Montería: "CO", Cúcuta: "CO", Leticia: "CO", Medellín: "CO", Bogotá: "CO", Barranquilla: "CO",
  "Santa Marta": "CO", "Cartagena de Indias": "CO", Manizales: "CO", Mompox: "CO", Colombia: "CO",
  "La Guajira": "CO",
  Caracas: "VE", Ávila: "VE", Venezuela: "VE",
  Quito: "EC", Cuenca: "EC", Otavalo: "EC", Guayaquil: "EC", Guayas: "EC", Galápagos: "EC",
  // Karibik, Mittelamerika, Afrika
  "La Habana": "CU", Camagüey: "CU",
  "Puerto Rico": "PR", Mayagüez: "PR", "Santo Domingo": "DO", "La Romana": "DO", Samaná: "DO",
  "Costa Rica": "CR", Panamá: "PA", Colón: "PA",
  Atitlán: "GT", Xela: "GT",
  Estelí: "NI", Metapa: "NI", Nicaragua: "NI", Masaya: "NI",
  "San Pedro Sula": "HN", Honduras: "HN", Tegucigalpa: "HN", "San Salvador": "SV",
  "Guinea Ecuatorial": "GQ", Malabo: "GQ", Bata: "GQ",
  // Regionen über mehrere Länder
  América: "REGION", Chaco: "REGION", Titicaca: "REGION", Amazonía: "REGION",
};

/** Menschen, Einrichtungen, Feste und ein Werk (Rayuela) - aus allen Regionen. */
const NAMEN = new Set(
  (
    "Consuelo Alfonsina Storni Carmen Mercedes Sosa José Martí Juan Rulfo Inés Ramón Nuria Teresa Carreño " +
    "Ernesto Martín Andrés Mónica Rocío Lucía Marisol Morales Iñaki Raúl Clara Campoamor Pedro Paula Pilar " +
    "Sebastián Rubén Darío Blades Pablo Neruda Mario Benedetti Rebeca Botero Adriana Gabriela Mistral Jorge " +
    "Luis Borges Carlos Gardel Guerra Gloria Fuertes Frida Kahlo Chabuca Granda Horacio Quiroga Paco Violeta " +
    "Parra Simón Bolívar Vargas Llosa Salvador Allende Atahualpa Yupanqui Rigoberta Menchú Julio Cortázar " +
    "Sor Juana Celia Cruz Esperanza Benito Juárez Drexler Miguel Güemes Oswaldo Guayasamín Elena " +
    "Poniatowska Charles Darwin Walter " +
    "Biblioteca Nacional Congreso Senado Candelaria Carnaval Semana Santa Roja Nobel Paz Óscar Rayuela Armas Zona Libre"
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

describe("ES-T6: Orte aus der ganzen spanischsprachigen Welt", () => {
  it("jedes grossgeschriebene Wort in der Zeile ist Teil eines bekannten Ortes oder ein Name", () => {
    const fehler = ZEILEN.flatMap((z) => unbekannteGrosswoerter(z).map((w) => `"${z}": ${w}`));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("höchstens ein Drittel der verorteten Zeilen in Spanien, höchstens ein Drittel in Mexiko", () => {
    const v = verteilung(ZEILEN);
    expect(v.verortet).toBeGreaterThanOrEqual(130); // gemessen 137 von 252
    expect(v.es * 3, `Spanien ${v.es} von ${v.verortet}`).toBeLessThanOrEqual(v.verortet);
    expect(v.mx * 3, `Mexiko ${v.mx} von ${v.verortet}`).toBeLessThanOrEqual(v.verortet);
  });

  /** Auftrag ES-T6: kein Land über ein Drittel, Spanien und Mexiko je DEUTLICH darunter (höchstens ein Fünftel). */
  it("kein Land trägt mehr als ein Drittel der verorteten Zeilen, Spanien und Mexiko je höchstens ein Fünftel", () => {
    const v = verteilung(ZEILEN);
    const je = new Map<string, number>();
    for (const z of ZEILEN) for (const l of orteIn(z).laender) je.set(l, (je.get(l) ?? 0) + 1);
    const zuViel = [...je].filter(([l, k]) => l !== "REGION" && k * 3 > v.verortet).map(([l, k]) => `${l}: ${k}`);
    expect(zuViel, `von ${v.verortet}`).toEqual([]);
    expect(v.es * 5, `Spanien ${v.es} von ${v.verortet}`).toBeLessThanOrEqual(v.verortet);
    expect(v.mx * 5, `Mexiko ${v.mx} von ${v.verortet}`).toBeLessThanOrEqual(v.verortet);
  });

  it("mindestens 20 Länder kommen vor (gemessen 21)", () => {
    const laender = new Set(ZEILEN.flatMap((z) => [...orteIn(z).laender]).filter((l) => l !== "REGION"));
    expect(laender.size).toBeGreaterThanOrEqual(20);
  });

  it("Gegenprobe: ein unbekannter Ort wird gemeldet, Wortgruppen zählen richtig, nur Spanien fällt durch", () => {
    expect(unbekannteGrosswoerter("Ana vive en Atlantis")).toEqual(["Atlantis"]);
    expect(unbekannteGrosswoerter("Desde El Alto se ve La Paz")).toEqual([]);
    expect(unbekannteGrosswoerter("Vamos a Puerto Natales")).toEqual(["Puerto", "Natales"]);
    expect(orteIn("En Puerto Montt comemos curanto").laender).toEqual(new Set(["CL"]));
    expect(orteIn("Mi prima de San Salvador").laender).toEqual(new Set(["SV"]));
    // Mehrdeutiges nur in eindeutiger Form: Cartagena allein ist unbekannt, Cartagena de Indias ist Kolumbien.
    expect(unbekannteGrosswoerter("Vamos a Cartagena")).toEqual(["Cartagena"]);
    expect(orteIn("Las playas de Cartagena de Indias").laender).toEqual(new Set(["CO"]));
    expect(orteIn("Guinea Ecuatorial tiene tres lenguas oficiales").laender).toEqual(new Set(["GQ"]));
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

describe("ES-T6: Wortschatz", () => {
  it("kein Inhaltswort steht in mehr als 8 Zeilen der Charge", () => {
    const fehler = zuHaeufig(ZEILEN);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("auch über beide Erwachsenen-Chargen (früh + Mitte) zusammen steht kein Inhaltswort in mehr als 8 Zeilen", () => {
    const fehler = zuHaeufig([...FRUEHE_ERWACHSENE, ...ZEILEN]);
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

describe("ES-T6: keine Kopien, keine Paare", () => {
  it("keine Zeile doppelt - auch nicht nach dem Ledger-Schlüssel (der ñ/á nicht kennt)", () => {
    expect(new Set(ZEILEN.map((t) => t.toLowerCase())).size).toBe(ZEILEN.length);
    expect(new Set(ZEILEN.map((t) => bausteinKey("satz", t))).size).toBe(ZEILEN.length);
  });

  it("keine Zeile gleicht einer früheren Zeile - weder es (T1-T5) noch de/en/fr (Text oder Ledger-Schlüssel)", () => {
    const eigene = new Set(ZEILEN);
    const frueher = [...CORPUS_ES.filter((i) => !eigene.has(i.text)), ...CORPUS, ...CORPUS_EN, ...CORPUS_FR];
    const texte = new Set(frueher.map((i) => i.text.toLowerCase()));
    const schluessel = new Set(frueher.map((i) => bausteinKey(i.kind, i.text)));
    const fehler = CORPUS_ES_MITTE_ERWACHSEN.filter(
      (i) => texte.has(i.text.toLowerCase()) || schluessel.has(bausteinKey(i.kind, i.text)),
    ).map((i) => i.text);
    expect(fehler).toEqual([]);
  });

  it("keine Paare - weder untereinander noch mit irgendeiner früheren es-Zeile (T1-T5, Falle 31)", () => {
    const fehler = paare(ZEILEN, FRUEHERE_ES);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Gegenprobe: Kopie einer Kinderzeile mit anderer Grossschreibung, Paar mit einer frühen Erwachsenenzeile und Ledger-Schlüssel werden erkannt", () => {
    // „Mi lápiz es azul" steht in der Kinder-Mitte-Charge - „mi lápiz es azul" wäre eine Kopie.
    expect(FRUEHERE_ES).toContain("Mi lápiz es azul");
    expect(paare(["mi lápiz es azul"], FRUEHERE_ES)).toHaveLength(1);
    // „la cita médica" steht in der frühen Erwachsenen-Charge - „Las citas médicas" wäre ein Paar.
    expect(FRUEHE_ERWACHSENE).toContain("la cita médica");
    expect(paare(["Las citas médicas"], FRUEHERE_ES)).toHaveLength(1);
    // Die Vergleichsmenge endet genau vor dieser Charge.
    expect(CORPUS_ES.slice(FRUEHERE_ES.length, FRUEHERE_ES.length + ZEILEN.length).map((i) => i.text)).toEqual(ZEILEN);
    expect(paare(["El bombero sale", "La bombera sale"])).toHaveLength(1);
    expect(bausteinKey("satz", "Ser bombera")).toBe(bausteinKey("satz", "ser bombera"));
    expect(paare(["La sal", "La sala"])).toEqual([]);
  });
});

describe("ES-T6: Korpus-Anker und Auslieferung", () => {
  /**
   * ★ ES-T9 (27.09.2026): Seit der Erwachsenen-Ende-Charge steht diese Charge
   * nicht mehr ganz hinten, sondern als geschlossener Block DIREKT HINTER der
   * Jugend-Mitte-Charge - dahinter kommen nur spätere Chargen (Anker nur anhängend).
   */
  it("CORPUS_ES trägt jede Zeile dieser Charge als geschlossenen Block direkt hinter der Jugend-Mitte-Charge", () => {
    const es = CORPUS_ES.map((i) => i.text);
    expect(ZEILEN.filter((t) => !es.includes(t))).toEqual([]);
    const start = es.indexOf(ZEILEN[0]);
    expect(es.slice(start, start + ZEILEN.length)).toEqual(ZEILEN);
    const jugendMitte = CORPUS_ES_MITTE_TEENS.map((i) => i.text);
    expect(es.slice(start - jugendMitte.length, start)).toEqual(jugendMitte);
    // Dahinter steht keine Zeile ohne Satzzeichen/Ziffer mehr - nur spätere Chargen.
    expect(es.slice(start + ZEILEN.length).every((t) => /[^\p{L} ]/u.test(t))).toBe(true);
  });

  it("der Anker ist aktuell (wie `erzeuge-korpus-anker.mts --check`) und kennt jede Zeile", () => {
    expect(corpusManifest().ids).toEqual(KORPUS_ANKER);
    const m = corpusManifest();
    const fehlt = CORPUS_ES_MITTE_ERWACHSEN.filter((i) => !m.indexOf.has(bausteinId(i.kind, i.text)));
    expect(fehlt.map((i) => i.text)).toEqual([]);
  });

  it("Gegenprobe: eine neue Zeile macht den Anker veraltet (eine ID mehr)", () => {
    const probe = { text: "Zzz probe es t6", kind: "satz" as const, stufen: ["erwachsen" as const] };
    const ids = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, probe]).ids;
    expect(ids.length).toBe(KORPUS_ANKER.length + 1);
  });

  for (const l of TASTATUREN) {
    it(`${l}: Weg „es" bekommt für Erwachsene an Sprosse 30 jede Zeile dieser Charge - und nur eigene es-Erwachsenenzeilen`, () => {
      const { letzte, o } = grenzen(l);
      const allowed = allowedFromIntroduced(o.slice(0, letzte), "es");
      const geliefert = corpusItemsFor({ stufe: "erwachsen", allowed, lang: "es", lernweg: "es" });
      expect(ZEILEN.filter((t) => !geliefert.includes(t))).toEqual([]);
      // ★ ES-T9 (27.09.2026): Zeilen späterer Chargen kommen hier schon an - ohne ihre noch
      // nicht gelernten Satzzeichen (fitText lässt sie weg). Verglichen wird darum mit der
      // SERVIERTEN Fassung jeder eigenen es-Erwachsenenzeile, nicht mit ihrem Rohtext.
      const eigeneErwachsene = new Set(
        CORPUS_ES.filter((i) => i.nurWeg === "es" && i.stufen.includes("erwachsen")).map(
          (i) => fitText(i.text, allowed, "es") ?? i.text,
        ),
      );
      expect(geliefert.filter((t) => !eigeneErwachsene.has(t))).toEqual([]);
    });
  }

  it("eine Sprosse vor p kommt keine Zeile mit p … w an (fitText rechnet mit, nicht der Kommentar)", () => {
    const { mayus, o } = grenzen("es");
    const allowed = allowedFromIntroduced(o.slice(0, mayus), "es");
    const geliefert = corpusItemsFor({ stufe: "erwachsen", allowed, lang: "es", lernweg: "es" });
    expect(geliefert.filter((t) => /[pqbghvyzxüw]/i.test(t))).toEqual([]);
    expect(geliefert.some((t) => ZEILEN.includes(t))).toBe(true);
  });
});
