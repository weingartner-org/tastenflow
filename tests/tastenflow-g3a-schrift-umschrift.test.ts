/**
 * ★★★ G3a-SCHRIFT (25.10.2026): amtliche Umschrift mit Regeln am Wortanfang/-ende und für Zeichenfolgen -
 * Ukrainisch (KMU-Beschluss Nr. 55/2010), Bulgarisch (Streamlined System 2009), Griechisch (ELOT 743) - und der
 * Server-Spiegel (`tt_klasse_lib.pb.js`), der die Login-Adresse Zeichen für Zeichen gleich rechnen muss.
 */
import { describe, expect, it } from "vitest";
import {
  ALLE_SPRACHEN,
  FREMDSCHRIFT_REGELN,
  WORTGRENZE,
  fremdschriftUmschreiben,
  klassencodeUmschreiben as u,
  sprachBeschreibung,
} from "../src/lib/typing/sprachRegister";
import { SYNTH_REGELN, SYNTH_UMSCHRIFT, synthEmail } from "../src/lib/typing/pbBackend";
import { neueLaufzeit } from "./helfer/pbHookLaufzeit";
import { readFileSync } from "node:fs";

interface KlasseLib {
  synthEmail: (c: string, n: string) => string;
  SYNTH_UMSCHRIFT: Record<string, string>;
  SYNTH_REGELN: unknown[];
}
const server = neueLaufzeit({ jetzt: 0 }).lib<KlasseLib>("tt_klasse_lib.pb.js");

describe("Ukrainisch (KMU 2010)", () => {
  it.each([
    ["Юлія", "YULIIA"], ["Їжак", "YIZHAK"], ["Йосип", "YOSYP"], ["Євген", "YEVHEN"], ["Яна", "YANA"],
    ["Ольга-Юлія", "OLHA-YULIIA"], ["Згорани", "ZGHORANY"], ["Київ", "KYIV"], ["Марʼяна", "MARIANA"],
    ["Мар'яна", "MAR'IANA"], ["Знам'янка", "ZNAM'IANKA"], ["Гайова", "HAIOVA"], ["Стрий", "STRYI"],
  ])("%s ⇒ %s", (t, e) => expect(u(t, "uk")).toBe(e));
});

describe("Bulgarisch (Streamlined System 2009)", () => {
  it.each([
    ["България", "BALGARIA"], ["София", "SOFIA"], ["Мария", "MARIA"], ["ия", "IA"], ["щъркел", "SHTARKEL"],
    ["Ѝ", "I"], ["Йордан", "YORDAN"], ["Любов", "LYUBOV"], ["Ями", "YAMI"], ["Илия Иванов", "ILIA IVANOV"],
  ])("%s ⇒ %s", (t, e) => expect(u(t, "bg")).toBe(e));
  it("„ия“ nur am Wortende", () => expect(u("Ияна", "bg")).toBe("IYANA"));
});

describe("Griechisch (ELOT 743)", () => {
  it.each([
    ["αυτός", "AFTOS"], ["Ευαγγελία", "EVANGELIA"], ["Παύλος", "PAVLOS"], ["ευχή", "EFCHI"], ["ΕΥΡΩΠΗ", "EVROPI"],
    ["ηύρα", "IVRA"], ["Μπάμπης", "BAMBIS"], ["μπαμπάς", "BAMBAS"], ["λάμπ", "LAB"], ["Αθήνα", "ATHINA"],
    ["Μουσική", "MOUSIKI"], ["ΟΥΡΑΝΟΣ", "OURANOS"], ["άγγελος", "ANGELOS"], ["αϋπνία", "AYPNIA"], ["Ψυχή", "PSYCHI"],
    ["ναυ", "NAF"],
  ])("%s ⇒ %s", (t, e) => expect(u(t, "el")).toBe(e));
});

describe("die lateinisch schreibenden Sprachen: keine Regeln, nichts ändert sich", () => {
  it("nur bg, uk, el tragen Regeln", () => {
    for (const s of ALLE_SPRACHEN) {
      expect(sprachBeschreibung(s).klassencodeRegeln.length > 0, s).toBe(s === "bg" || s === "uk" || s === "el");
    }
  });
  it("Beispiele wie vorher", () => {
    expect(u("Ärger", "de")).toBe("AErger");
    expect(u("Łukasz", "pl")).toBe("Lukasz");
    expect(u("İlker Şen", "tr")).toBe("Ilker Sen");
    expect(u("Győr", "hu")).toBe("GyOr");
  });
  it("Wortgrenze: kein Buchstabe und kein Apostroph", () => {
    for (const z of [" ", "-", "1", ".", "(", "–"]) expect(WORTGRENZE.test(z), z).toBe(true);
    for (const z of ["'", "’", "ʼ", "a", "я", "ά"]) expect(WORTGRENZE.test(z), z).toBe(false);
  });
});

describe("ohne Sprache (Klassencode, Dateiname): kyrillisch nach uk, griechisch nach el", () => {
  it("die Regeln je Schrift sind die der späteren Sprache", () => {
    expect(FREMDSCHRIFT_REGELN).toEqual([...sprachBeschreibung("uk").klassencodeRegeln, ...sprachBeschreibung("el").klassencodeRegeln]);
    expect(fremdschriftUmschreiben("Юлія Αυγή")).toBe("YULIIA AVGI");
    expect(fremdschriftUmschreiben("Ärger École")).toBe("Ärger École");
  });
});

describe("★ Login-Adresse: Programm und Server rechnen gleich", () => {
  it("die Regeln sind gleich (Server-Spiegel `SYNTH_REGELN`)", () => {
    expect(JSON.parse(JSON.stringify(server.SYNTH_REGELN))).toEqual(JSON.parse(JSON.stringify(SYNTH_REGELN)));
    expect(server.SYNTH_UMSCHRIFT).toEqual({ ...SYNTH_UMSCHRIFT });
  });
  it("die Wortgrenze steht im Server Zeichen für Zeichen wie im Programm", () => {
    const quelle = readFileSync("pocketbase/pb_hooks/tt_klasse_lib.pb.js", "utf8");
    const m = /var WORTGRENZE = (\/.*\/);/.exec(quelle);
    expect(m).not.toBeNull();
    expect(new Function(`return ${m![1]};`)().source).toBe(WORTGRENZE.source);
  });
  const NAMEN = [
    "Юлія Коваль", "Їжак", "Ольга-Юлія", "Мар'яна", "Марʼяна", "Мар’яна", "Згорани", "Євген Ярош", "Йосип",
    "Георги Илия", "България", "Ѝ", "Αυγή Παπαδοπούλου", "Μπάμπης", "Ευαγγελία", "Ναυσικά", "αϋπνία", "ΕΥΡΩΠΗ",
    "Łukasz", "O'Brien", "Jürgen Groß", "José", "Fűzi Ildikó", "Ștefan", "", "  ", "Ana 2b", "😀 Юля",
  ];
  it.each(NAMEN)("„%s“", (name) => {
    expect(server.synthEmail("5A", name)).toBe(synthEmail("5A", name));
  });
  it("Beispiele", () => {
    expect(synthEmail("5A", "Юлія")).toBe("5a__yuliia@tt.local");
    expect(synthEmail("5A", "Марʼяна")).toBe("5a__mariana@tt.local");
    expect(synthEmail("5A", "O'Brien")).toBe("5a__o-brien@tt.local");
    expect(synthEmail("5A", "Ευαγγελία")).toBe("5a__evangelia@tt.local");
    expect(synthEmail("5A", "Μουσική")).toBe("5a__mousiki@tt.local");
  });
});
