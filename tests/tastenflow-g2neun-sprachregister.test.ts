/**
 * ★★ G2-NEUN (25.10.2026): das Sprachregister für die neun Lernwege des Gerüsts
 * (bg, el, hu, nl, pt, br, ro, sv, uk) - Gebiet, Mehrzahl-Formen (gemessen mit
 * `Intl.PluralRules`), Schuljahr, Gross-/Kleinschreibung (Griechisch!) und die
 * Umschrift für Klassencode, Login-Adresse und Dateiname.
 */
import { describe, expect, it } from "vitest";
import {
  FREMDSCHRIFT_UMSCHRIFT,
  GERUEST_SPRACHEN,
  SPRACHREGISTER,
  altSpracheItPlTrOderEn,
  altSpracheOderEn,
  fremdschriftUmschreiben,
  grossFuer,
  istGeruestSprache,
  kleinFuer,
  klassencodeUmschreiben,
  mitRueckfallEn,
  sprachBeschreibung,
} from "../src/lib/typing/sprachRegister";
import { klassencodeVorschlag } from "../src/lib/lernwerkstatt/klassencode";
import { listenDateiname } from "../src/lib/lernwerkstatt/teilnehmerlisteDocx";
import { SYNTH_UMSCHRIFT, synthEmail, synthEmailVorG2Neun } from "../src/lib/typing/pbBackend";
import type { Lang } from "../src/lib/typing/account";

const NEUN: readonly Lang[] = ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"];

describe("G2-NEUN: Register-Einträge", () => {
  it("die Liste der neun Sprachen", () => {
    expect([...GERUEST_SPRACHEN]).toEqual([...NEUN]);
    for (const s of NEUN) expect(istGeruestSprache(s)).toBe(true);
    expect(istGeruestSprache("cs")).toBe(false);
    expect(istGeruestSprache("xx")).toBe(false);
  });

  it("Gebiet je Sprache (pt = Portugal, br = Brasilien)", () => {
    const erwartet: Record<string, string> = {
      bg: "bg-BG", el: "el-GR", hu: "hu-HU", nl: "nl-NL", pt: "pt-PT", br: "pt-BR", ro: "ro-RO", sv: "sv-SE", uk: "uk-UA",
    };
    for (const s of NEUN) expect(SPRACHREGISTER[s].locale).toBe(erwartet[s]);
  });

  it("Mehrzahl-Formen wie gemessen (Node 24, 25.10.2026)", () => {
    const formen = (s: Lang) => [...sprachBeschreibung(s).pluralKategorien].sort();
    for (const s of ["bg", "el", "hu", "nl", "sv"] as const) expect(formen(s)).toEqual(["one", "other"]);
    expect(formen("pt")).toEqual(["many", "one", "other"]);
    expect(formen("br")).toEqual(["many", "one", "other"]);
    expect(formen("ro")).toEqual(["few", "one", "other"]);
    expect(formen("uk")).toEqual(["few", "many", "one", "other"]);
    // Brasilien zählt 0 wie 1 (one), Portugal nicht
    expect(new Intl.PluralRules("pt-BR").select(0)).toBe("one");
    expect(new Intl.PluralRules("pt-PT").select(0)).toBe("other");
  });

  it("Schuljahr: br Februar, nl und sv August, alle anderen September (belegt in recherche-xx)", () => {
    const monat = Object.fromEntries(NEUN.map((s) => [s, SPRACHREGISTER[s].schuljahrMonat]));
    expect(monat).toEqual({ bg: 9, el: 9, hu: 9, nl: 8, pt: 9, br: 2, ro: 9, sv: 8, uk: 9 });
  });

  it("alle neun: alleBuchstaben, keine eigene Gross-/Kleinschreibung", () => {
    for (const s of NEUN) {
      expect(SPRACHREGISTER[s].alleBuchstaben).toBe(true);
      expect(SPRACHREGISTER[s].grossKleinLocale).toBeNull();
    }
  });
});

describe("G2-NEUN: Griechisch gross/klein (Entscheidung: gewöhnliche Regeln)", () => {
  it("der Wortanfang behält den Tonos (Άλογο), toLocaleUpperCase('el') täte das nicht", () => {
    expect(grossFuer("ά", "el") + "λογο").toBe("Άλογο");
    expect("ά".toLocaleUpperCase("el")).toBe("Α");
  });
  it("Schluss-Sigma: toLowerCase setzt ς am Wortende selbst", () => {
    expect(kleinFuer("ΟΔΟΣ", "el")).toBe("οδος".slice(0, 3) + "ς");
    expect(kleinFuer("Σ", "el")).toBe("σ");
  });
});

describe("G2-NEUN: Klassencode-Umschrift", () => {
  const u = klassencodeUmschreiben;
  it("Bulgarisch (Streamlined System)", () => {
    expect(u("щъркел", "bg")).toBe("SHTARKEL");
    expect(u("България", "bg")).toBe("BALGARIA"); // ★ G3a-SCHRIFT: „-ия" am Wortende ⇒ IA (Streamlined System)
  });
  it("Ukrainisch (KMU 2010), mit Zeichenpaar зг", () => {
    expect(u("Київ", "uk")).toBe("KYIV");
    expect(u("Згорани", "uk")).toBe("ZGHORANY");
    expect(u("Харків", "uk")).toBe("KHARKIV");
  });
  it("Griechisch (ELOT 743), mit Zeichenpaaren ου und γγ", () => {
    expect(u("Αθήνα", "el")).toBe("ATHINA");
    expect(u("Μουσική", "el")).toBe("MOUSIKI");
    expect(u("ΟΥΡΑΝΟΣ", "el")).toBe("OURANOS");
    expect(u("άγγελος", "el")).toBe("ANGELOS");
  });
  it("lateinisch schreibende Sprachen: Grundbuchstabe", () => {
    expect(u("Győr", "hu")).toBe("GyOr");
    expect(u("Ștefan Țară", "ro")).toBe("Stefan TarA");
    expect(u("Şcoala", "ro")).toBe("Scoala");
    expect(u("Åsa Öberg", "sv")).toBe("Asa Oberg");
    expect(u("São João", "pt")).toBe("SAo JoAo");
    expect(u("São João", "br")).toBe("SAo JoAo");
  });
  it("klassencodeVorschlag: kyrillisch und griechisch werden nicht mehr leer - auch ohne passende Sprache", () => {
    expect(klassencodeVorschlag("5б клас", "uk")).toBe("5BKLAS");
    expect(klassencodeVorschlag("Клас 3", "bg")).toBe("KLAS3");
    expect(klassencodeVorschlag("Τάξη 4", "el")).toBe("TAXI4");
    expect(klassencodeVorschlag("Клас 3")).toBe("KLAS3");
    expect(klassencodeVorschlag("Клас 3", "de")).toBe("KLAS3");
    expect(klassencodeVorschlag("Τάξη 4")).toBe("TAXI4");
    // Lateinische Namen wie vorher
    expect(klassencodeVorschlag("MS-Wein")).toBe("MSWEIN");
    expect(klassencodeVorschlag("Ärger 5", "de")).toBe("AERGER5");
    expect(klassencodeVorschlag("Ärger 5")).toBe("AERGER5");
    expect(klassencodeVorschlag("Győr 2", "hu")).toBe("GYOR2");
    expect(klassencodeVorschlag("Öberg", "sv")).toBe("OBERG");
  });
  it("die gemeinsame Fremdschrift-Tabelle hat keine lateinischen Buchstaben", () => {
    for (const z of Object.keys(FREMDSCHRIFT_UMSCHRIFT)) expect(/[\p{Script=Cyrillic}\p{Script=Greek}]/u.test(z)).toBe(true);
    expect(fremdschriftUmschreiben("Ärger École")).toBe("Ärger École");
    // и: Ukrainisch (die spätere Sprache) geht vor
    expect(FREMDSCHRIFT_UMSCHRIFT["и"]).toBe("Y");
  });
  it("Dateiname der Teilnehmerliste: kyrillischer Klassenname bleibt lesbar", () => {
    const ms = new Date(2026, 9, 25).getTime();
    expect(listenDateiname("5б", ms)).toBe("teilnehmerliste-5b-25-10-2026.docx");
    expect(listenDateiname("3b", ms)).toBe("teilnehmerliste-3b-25-10-2026.docx");
  });
});

describe("G2-NEUN: Login-Adresse (synthEmail) und Server-Spiegel", () => {
  it('kyrillische und griechische Namen werden nicht mehr zu „x"', () => {
    expect(synthEmail("5A", "Іван")).toBe("5a__ivan@tt.local");
    expect(synthEmail("5A", "Олена Коваль")).toBe("5a__olena-koval@tt.local");
    expect(synthEmail("5A", "Γιώργος")).toBe("5a__giorgos@tt.local");
    // ő ű neu; ó gehörte schon vorher zu de/en/fr/es-Namen und bleibt, wie es war („-")
    expect(synthEmail("5A", "Fűzi Ildikó")).toBe("5a__fuzi-ildik@tt.local");
  });
  it("die Adresse von VOR G2-NEUN: so, wie sie vorher war", () => {
    expect(synthEmailVorG2Neun("5A", "Іван")).toBe("5a__x@tt.local");
    expect(synthEmailVorG2Neun("5A", "Łukasz")).toBe("5a__lukasz@tt.local");
    // Namen ohne neue Buchstaben: beide gleich (die Anmeldung versucht dann nur einmal)
    for (const n of ["José", "Müller", "Łukasz", "Şule", "Tomáš", "Anna-Lena"]) {
      expect(synthEmailVorG2Neun("5A", n)).toBe(synthEmail("5A", n));
    }
  });
  it('die neue Umschrift fasst nur Buchstaben an, die vorher als „-" herausfielen', () => {
    for (const z of Object.keys(SYNTH_UMSCHRIFT)) {
      expect(/^[a-z0-9]$/i.test(z)).toBe(false);
    }
  });
  it("Server (tt_klasse_lib.pb.js) = Programm, Zeichen für Zeichen", async () => {
    const { readFileSync } = await import("node:fs");
    const quelle = readFileSync("pocketbase/pb_hooks/tt_klasse_lib.pb.js", "utf8");
    const a = quelle.indexOf("var SYNTH_UMSCHRIFT = {");
    const b = quelle.indexOf("};", a) + 1;
    const server = new Function(`return ${quelle.slice(a + "var SYNTH_UMSCHRIFT = ".length, b)};`)() as Record<string, string>;
    expect(server).toEqual({ ...SYNTH_UMSCHRIFT });
  });
});

describe("G2-NEUN: Rückfall Englisch", () => {
  it("altSpracheOderEn und die Ketten: die neun werden Englisch, die fertigen bleiben", () => {
    for (const s of NEUN) {
      expect(altSpracheOderEn(s)).toBe("en");
      expect(altSpracheItPlTrOderEn(s)).toBe("en");
    }
    for (const s of ["de", "en", "fr", "es"] as const) expect(altSpracheOderEn(s)).toBe(s);
    expect(altSpracheItPlTrOderEn("tr")).toBe("tr");
    expect(altSpracheItPlTrOderEn("pl")).toBe("pl");
    expect(altSpracheItPlTrOderEn("it")).toBe("it");
    expect(altSpracheItPlTrOderEn("cs")).toBe("en");
  });
  it("mitRueckfallEn füllt die neun mit dem englischen Wert", () => {
    const t = mitRueckfallEn({ de: "D", en: "E", fr: "F", es: "S", cs: "C" });
    for (const s of NEUN) expect(t[s]).toBe("E");
    expect(t.cs).toBe("C");
    expect(t.it).toBe("E");
  });
});
