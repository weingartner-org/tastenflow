/**
 * ★★★ WÄCHTER: Kinder einer Klasse aus Excel - die Logik (12.09.2026, Vorlage
 * neu gestaltet 13.09.2026).
 *
 * Johannes' Entscheidungen (verbindlich):
 *  1. Die Vorlage legt NUR KINDER an, in der gerade gewählten Klasse.
 *  2. Spalten: Name · Passwort · Tastenflow: womit anfangen? · E-Mail (optional, 14.09.2026).
 *  3. Leeres Passwort ⇒ die App erzeugt ein leicht tippbares Passwort.
 * Johannes, 13.09.2026: *„Bitte oben immer den Klassennamen und das Datum als
 * Überschrift einfügen. … Wir brauchen eine Auswahlliste in den Zellen in der
 * Spalte C, und wir brauchen oben in der Tabelle eine Funktion ‚Womit anfangen
 * (Auswahl) für alle übernehmen'."*
 *
 * Die Vorlage wird mit exceljs geschrieben und hier mit exceljs UND SheetJS
 * WIEDER GELESEN - gezählt werden keine Funktionsaufrufe, gemessen wird die
 * Datei.
 *
 * WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD
 * ([[feedback_gruener_waechter_beweist_was]]):
 *  · Eine vorbereitete Zeile (nur Spalte C gefüllt) wird als „Name fehlt"
 *    abgelehnt - rot.
 *  · Eine C-Zelle ohne Auswahlliste, eine Liste als Inline-Text statt Bezug auf
 *    „Listen", eine Formel ohne gespeichertes Ergebnis - rot.
 *  · Die Vorlage von gestern (Kopfzeile in Zeile 1) lässt sich nicht mehr lesen - rot.
 *  · Ein Passwort `1234` kommt als Zahl zurück, eine Zeilennummer verrutscht,
 *    ein erzeugtes Passwort enthält y, z, l, 0, 1 - rot.
 *  · Die Namensprüfung weicht von der des Servers ab - rot.
 */
import { describe, expect, it } from "vitest";
import ExcelJS from "exceljs";
import * as XLSX from "xlsx";

import { startPoints } from "@/lib/typing/letters";
import { synthEmail } from "@/lib/typing/pbBackend";
import {
  AUSWAHL_FEHLER,
  BLATT_HINWEISE,
  BLATT_KINDER,
  BLATT_LISTEN,
  FUER_ALLE_FORMEL,
  FUER_ALLE_SATZ,
  FUER_ALLE_TEXT,
  FUER_ALLE_ZELLE,
  MIN_PASSWORT_KIND,
  PASSWORT_BUCHSTABEN,
  PASSWORT_ZIFFERN,
  VORLAGE,
  VORLAGE_KOPF,
  abgelehntSatz,
  dateiBytes,
  erzeugePasswort,
  fremdeKlasseHinweis,
  leseKinderXlsx,
  listenBezug,
  pruefeKinderZeilen,
  startniveauAusZelle,
  vorbelegtesStartniveau,
  vorlageAlsBytes,
  vorlageDateiname,
  vorlageHinweise,
  vorlageTitel,
  type KinderZeile,
} from "@/lib/lernwerkstatt/kinderImport";

const V = startPoints("de", "de");
const KOPF = [...VORLAGE_KOPF];
/** Samstag, 12.09.2026, Mittag. */
const JETZT = new Date(2026, 8, 12, 12, 0).getTime();

/** Eine echte kleine xlsx aus Blättern (Name → Array-of-Arrays) - wie eine eigene Tabelle. */
async function xlsx(blaetter: Record<string, unknown[][]>): Promise<ArrayBuffer> {
  const wb = XLSX.utils.book_new();
  for (const [name, zeilen] of Object.entries(blaetter))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(zeilen), name);
  return XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
}

async function lies(blaetter: Record<string, unknown[][]>): Promise<KinderZeile[]> {
  const r = await leseKinderXlsx(await xlsx(blaetter));
  if (!r.ok) throw new Error(r.fehler);
  return r.zeilen;
}

/** Die Vorlage der Klasse 3b (Startniveau V[2]) - mit exceljs wieder eingelesen. */
async function vorlage(klasse: { name?: string; startUnits?: number } = { name: "3b", startUnits: V[2].units }) {
  const bytes = await vorlageAlsBytes(klasse, { jetztMs: JETZT });
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(bytes as unknown as ArrayBuffer);
  return { bytes, wb, kinder: wb.getWorksheet(BLATT_KINDER)! };
}

/** Eine in exceljs ausgefüllte Vorlage lesen - so, wie die Lehrkraft sie speichert. */
async function liesAusgefuellt(wb: ExcelJS.Workbook) {
  const r = await leseKinderXlsx((await wb.xlsx.writeBuffer()) as ArrayBuffer);
  if (!r.ok) throw new Error(r.fehler);
  return r;
}

const zeile = (z: number, name: string, passwort = "", start = "", email = ""): KinderZeile => ({
  zeile: z,
  name,
  passwort,
  start,
  email,
});

/* ════════════════════════════════════════════════════════════════════════ */
describe("★★★ Die Vorlage", () => {
  it("Klassenname und Datum als Überschrift, Zeichen und „Tastenflow“ in Zeile 1 - „Listen“ ausgeblendet", async () => {
    const { wb, kinder } = await vorlage();
    expect(wb.worksheets.map((w) => w.name)).toEqual([BLATT_KINDER, BLATT_HINWEISE, BLATT_LISTEN]);
    expect(wb.getWorksheet(BLATT_LISTEN)!.state).toBe("hidden");
    for (const name of [BLATT_KINDER, BLATT_HINWEISE]) {
      const ws = wb.getWorksheet(name)!;
      expect(ws.getCell("A1").value, name).toBe("Tastenflow");
      expect(ws.getImages(), name).toHaveLength(1);
      expect(ws.getImages()[0].range.tl.nativeRow, name).toBe(0);
      expect(ws.getCell("A2").value, name).toBe("Klasse 3b - Teilnehmer anlegen");
    }
    expect(kinder.getCell("A3").value).toBe("Stand: 12.09.2026");
    expect(vorlageTitel("Klasse 4a")).toBe("Klasse 4a - Teilnehmer anlegen");
  });

  it("★★★ „für alle übernehmen“: EINE Auswahlzelle, Liste aus „Listen“, vorbelegt mit dem Startniveau der Klasse", async () => {
    const { wb, kinder } = await vorlage();
    expect(kinder.getCell(`A${VORLAGE.fuerAlleZeile}`).value).toBe(FUER_ALLE_TEXT);
    expect(kinder.getCell(`A${VORLAGE.hinweisZeile}`).value).toBe(FUER_ALLE_SATZ);
    const wahl = kinder.getCell(FUER_ALLE_ZELLE);
    expect(wahl.value).toBe(V[2].label);
    expect(wahl.dataValidation).toMatchObject({
      type: "list",
      allowBlank: true,
      formulae: [listenBezug(V.length)],
      showErrorMessage: true,
      error: AUSWAHL_FEHLER,
    });
    expect(listenBezug(7)).toBe("Listen!$A$1:$A$7");
    // Die Liste steht im ausgeblendeten Blatt - in der Reihenfolge des Formulars.
    const listen = wb.getWorksheet(BLATT_LISTEN)!;
    expect(V.map((_, i) => listen.getCell(i + 1, 1).value)).toEqual(V.map((p) => p.label));
    expect(listen.getCell(V.length + 1, 1).value).toBeNull();

    // Ohne Startniveau der Klasse (oder mit einem unbekannten): das erste.
    const ohne = await vorlage({ name: "4a" });
    expect(ohne.kinder.getCell(FUER_ALLE_ZELLE).value).toBe(V[0].label);
    expect(vorbelegtesStartniveau(9999, V)).toEqual(V[0]);
    expect(vorbelegtesStartniveau(V[4].units, V)).toEqual(V[4]);
  });

  it("★★★ Spalte C: in JEDER der 40 Zeilen Auswahlliste UND Formel mit gespeichertem Ergebnis - Spalte B als Text", async () => {
    const { bytes, kinder } = await vorlage();
    expect(VORLAGE.kinderZeilen).toBe(40);
    expect(KOPF.map((_, i) => kinder.getCell(VORLAGE.kopfZeile, i + 1).value)).toEqual(KOPF);
    const letzte = VORLAGE.ersteKindZeile + VORLAGE.kinderZeilen - 1;
    for (let z = VORLAGE.ersteKindZeile; z <= letzte; z++) {
      const c = kinder.getCell(z, 3);
      expect(c.value, `C${z}`).toEqual({ formula: FUER_ALLE_FORMEL, result: V[2].label });
      expect(c.dataValidation?.type, `C${z}`).toBe("list");
      expect(c.dataValidation?.formulae, `C${z}`).toEqual([listenBezug(V.length)]);
      expect(kinder.getCell(z, 2).numFmt, `B${z}`).toBe("@");
      expect(kinder.getCell(z, 1).value, `A${z}`).toBeNull();
    }
    expect(kinder.getCell(letzte + 1, 3).value).toBeNull();
    expect(FUER_ALLE_FORMEL).toBe('IF($C$5="","",$C$5)');
    // Fixiert bis zur Kopfzeile.
    expect(kinder.views[0]).toMatchObject({ state: "frozen", ySplit: VORLAGE.kopfZeile });
    // Gegenprobe mit SheetJS: Formel UND Wert stehen in der Datei.
    const c9 = XLSX.read(bytes, { type: "array" }).Sheets[BLATT_KINDER].C9;
    expect(c9.f).toBe(FUER_ALLE_FORMEL);
    expect(c9.v).toBe(V[2].label);
  });

  it("die leere Vorlage ergibt KEIN Kind - aber den „für alle“-Wert und die Überschrift", async () => {
    const { bytes } = await vorlage();
    expect(await leseKinderXlsx(bytes)).toEqual({
      ok: true,
      zeilen: [],
      fuerAlle: V[2].label,
      titel: "Klasse 3b - Teilnehmer anlegen",
    });
  });

  it("Dateiname: Teilnehmer-Vorlage_Klasse_JJJJ-MM-TT.xlsx, dateisystemtauglich, Ortszeit", () => {
    expect(vorlageDateiname("3b", JETZT)).toBe("Teilnehmer-Vorlage_3b_2026-09-12.xlsx");
    expect(vorlageDateiname("3a/b", JETZT)).toBe("Teilnehmer-Vorlage_3a-b_2026-09-12.xlsx");
    expect(vorlageDateiname(undefined, JETZT)).toBe("Teilnehmer-Vorlage_Klasse_2026-09-12.xlsx");
    expect(vorlageDateiname("3a", new Date(2026, 8, 13, 0, 30).getTime())).toBe(
      "Teilnehmer-Vorlage_3a_2026-09-13.xlsx",
    );
  });

  it("„Hinweise“ nennt jedes Startniveau mit Nummer, Namen und Kurzwort - in einfacher Sprache, nach den Hausregeln", async () => {
    const h = vorlageHinweise(V);
    V.forEach((p, i) => expect(h.liste).toContainEqual([String(i + 1), p.label, p.key]));
    expect(h.spalten.map(([s]) => s)).toEqual(KOPF);
    expect(h.spalten[1][1]).toContain(`Mindestens ${MIN_PASSWORT_KIND} Zeichen`);
    expect(h.schritte.join(" ")).toContain("Alt + Pfeil nach unten (am Mac: Wahltaste + Pfeil nach unten)");

    const { wb } = await vorlage();
    const texte: string[] = [];
    wb.eachSheet((ws) =>
      ws.eachRow((row) =>
        row.eachCell((c) => {
          if (typeof c.value === "string") texte.push(c.value);
        }),
      ),
    );
    for (const p of V) expect(texte).toContain(p.label);
    for (const s of h.schritte) expect(texte).toContain(s);
    for (const t of texte) {
      // Nur Bindestrich, nie Gedankenstrich; keine Maus-Wörter.
      expect(t, t).not.toMatch(/[–—]/);
      expect(t, t).not.toMatch(/klick|Maus/i);
    }
  });
});

/* ════════════════════════════════════════════════════════════════════════ */
describe("★★★ Die Datei lesen", () => {
  it("★★★ die ausgefüllte neue Vorlage: Formelwert, eigene Wahl, geleerte Zelle, Passwort mit Null", async () => {
    const { wb, kinder } = await vorlage();
    kinder.getCell("A9").value = "Mia";
    kinder.getCell("A10").value = "Noah";
    kinder.getCell("B10").value = "0815";
    kinder.getCell("A11").value = "Lea";
    kinder.getCell("C11").value = V[4].label; // eine eigene Wahl überschreibt die Formel
    kinder.getCell("A12").value = "Ben";
    kinder.getCell("C12").value = null; // geleert ⇒ „für alle"
    const r = await liesAusgefuellt(wb);
    expect(r.zeilen).toEqual([
      zeile(9, "Mia", "", V[2].label),
      zeile(10, "Noah", "0815", V[2].label),
      zeile(11, "Lea", "", V[4].label),
      zeile(12, "Ben", "", V[2].label),
    ]);
    expect(r.fuerAlle).toBe(V[2].label);
    expect(r.titel).toBe("Klasse 3b - Teilnehmer anlegen");
    // Die 36 übrigen Zeilen (nur Spalte C) sind KEINE Kinder.
    const plan = pruefeKinderZeilen(r.zeilen, { lernweg: "de", vorhandeneNamen: [], startVorgabe: V[0].units });
    expect(plan.abgelehnt).toEqual([]);
    expect(plan.anlegen.map((k) => [k.zeile, k.name, k.startUnits, k.startVorgabe])).toEqual([
      [9, "Mia", V[2].units, false],
      [10, "Noah", V[2].units, false],
      [11, "Lea", V[4].units, false],
      [12, "Ben", V[2].units, false],
    ]);
  });

  it("leere C-Zelle UND leerer „für alle“-Wert ⇒ die Vorgabe der Klasse", async () => {
    const { wb, kinder } = await vorlage();
    kinder.getCell(FUER_ALLE_ZELLE).value = null;
    kinder.getCell("A9").value = "Mia";
    kinder.getCell("C9").value = null;
    const r = await liesAusgefuellt(wb);
    expect(r.fuerAlle).toBe("");
    expect(r.zeilen).toEqual([zeile(9, "Mia", "", "")]);
    const plan = pruefeKinderZeilen(r.zeilen, { lernweg: "de", vorhandeneNamen: [], startVorgabe: V[3].units });
    expect(plan.anlegen[0]).toMatchObject({ startUnits: V[3].units, startVorgabe: true });
  });

  it("★ Formel OHNE gespeicherten Wert ⇒ der „für alle“-Wert (das, was die Formel ergäbe)", async () => {
    const { wb, kinder } = await vorlage();
    kinder.getCell(FUER_ALLE_ZELLE).value = V[5].label;
    kinder.getCell("A9").value = "Mia";
    kinder.getCell("C9").value = { formula: FUER_ALLE_FORMEL } as ExcelJS.CellFormulaValue;
    const bytes = (await wb.xlsx.writeBuffer()) as ArrayBuffer;
    // Gegenprobe: In der Datei steht für C9 wirklich kein Wert.
    const c9 = XLSX.read(bytes, { type: "array" }).Sheets[BLATT_KINDER].C9;
    expect(c9?.v ?? "").toBe("");
    const r = await leseKinderXlsx(bytes);
    expect(r.ok && r.zeilen).toEqual([zeile(9, "Mia", "", V[5].label)]);
  });

  it("★ fremde Klasse in der Überschrift ⇒ ein Hinweissatz; eigene Klasse oder keine Überschrift ⇒ keiner", async () => {
    const { bytes } = await vorlage({ name: "4a", startUnits: V[1].units });
    const r = await leseKinderXlsx(bytes);
    expect(r.ok && r.titel).toBe("Klasse 4a - Teilnehmer anlegen");
    const satz = fremdeKlasseHinweis(r.ok ? r.titel : null, "3b");
    expect(satz).toBe(
      "Die Datei trägt die Überschrift „Klasse 4a - Teilnehmer anlegen“, gewählt ist aber „Klasse 3b“. Angelegt wird in der gewählten Klasse - bitte prüfen Sie, ob das so gewollt ist.",
    );
    expect(fremdeKlasseHinweis("Klasse 3b - Teilnehmer anlegen", "3b")).toBeNull();
    expect(fremdeKlasseHinweis("Klasse 3B  -  Teilnehmer anlegen", "3b")).toBeNull();
    expect(fremdeKlasseHinweis("Klasse 3a - Teilnehmer anlegen", "Klasse 3a")).toBeNull();
    expect(fremdeKlasseHinweis(null, "3b")).toBeNull();
  });

  it("★★ die Vorlage von gestern (nur Kopfzeile in Zeile 1) bleibt lesbar", async () => {
    const r = await leseKinderXlsx(
      await xlsx({ Teilnehmer: [KOPF, ["Mia", "", ""], ["Noah", "abcd", "2"]], Hinweise: [["So füllen Sie die Vorlage aus"]] }),
    );
    expect(r).toEqual({
      ok: true,
      zeilen: [zeile(2, "Mia"), zeile(3, "Noah", "abcd", "2")],
      fuerAlle: "",
      titel: null,
    });
  });

  it("erkennt die Kopfzeile an den Namen - auch ohne „Tastenflow\", vertauscht und weiter unten", async () => {
    const zeilen = await lies({
      Tabelle1: [
        ["Klasse 3b - Liste"],
        [],
        ["Passwort", "Womit anfangen?", "Name"],
        ["abcd", "2", "Mia"],
      ],
    });
    expect(zeilen).toEqual([{ zeile: 4, name: "Mia", passwort: "abcd", start: "2", email: "" }]);
  });

  it("★ ein Passwort 1234 bleibt Text - und 0815 behält seine Null, wenn die Zelle Text ist", async () => {
    const zeilen = await lies({ Teilnehmer: [KOPF, ["Noah", 1234, 3], ["Lea", "0815", ""]] });
    expect(zeilen[0].passwort).toBe("1234");
    expect(typeof zeilen[0].passwort).toBe("string");
    expect(zeilen[0].start).toBe("3");
    expect(zeilen[1].passwort).toBe("0815");
  });

  it("★ E-Mail-Spalte (14.09.2026): wird gelesen, optional - leer bleibt leer", async () => {
    const zeilen = await lies({
      Teilnehmer: [KOPF, ["Mia", "abcd", "", "eltern@example.com"], ["Noah", "abcd", ""]],
    });
    expect(zeilen[0].email).toBe("eltern@example.com");
    expect(zeilen[1].email).toBe("");
  });

  it("★ überspringt leere Zeilen und Zeilen mit NUR Spalte C oder einer Notiz - die Zeilennummer bleibt die aus Excel; trimmt", async () => {
    const zeilen = await lies({
      Teilnehmer: [
        KOPF,
        ["  Mia ", " abcd ", " 2 "],
        [],
        ["", "", ""],
        // Die Notiz steht bewusst NACH der E-Mail-Spalte (Index 4) - eine
        // fünfte, nicht definierte Spalte bleibt weiter harmlos ignoriert.
        ["Noah", "", "", "", "Notiz"],
        ["", "", "", "", "nur Notiz"],
        ["", "", "3"],
        ["", "abcd", ""],
      ],
    });
    expect(zeilen).toEqual([
      { zeile: 2, name: "Mia", passwort: "abcd", start: "2", email: "" },
      { zeile: 5, name: "Noah", passwort: "", start: "", email: "" },
      // Ein Passwort ohne Namen IST eine Zeile - sie wird als „Name fehlt" gemeldet.
      { zeile: 8, name: "", passwort: "abcd", start: "", email: "" },
    ]);
    expect(pruefeKinderZeilen(zeilen, { lernweg: "de", vorhandeneNamen: [] }).abgelehnt.map(abgelehntSatz)).toEqual([
      "Zeile 8: Der Name fehlt.",
    ]);
  });

  it("nimmt das Blatt „Kinder\", auch wenn es nicht vorn steht - sonst das erste", async () => {
    const zeilen = await lies({
      Deckblatt: [["Name", "Passwort"], ["Falsch", "abcd"]],
      Teilnehmer: [KOPF, ["Richtig", "abcd", ""]],
    });
    expect(zeilen.map((z) => z.name)).toEqual(["Richtig"]);
    const ohne = await lies({ Liste: [["Name", "Passwort"], ["Ben", ""]] });
    expect(ohne.map((z) => z.name)).toEqual(["Ben"]);
  });

  it("ohne Kopfzeile oder als kaputte Datei: ein verständlicher Satz, keine Zeilen", async () => {
    const ohneKopf = await leseKinderXlsx(await xlsx({ Teilnehmer: [["Mia", "abcd"]] }));
    expect(ohneKopf.ok).toBe(false);
    if (!ohneKopf.ok) expect(ohneKopf.fehler).toMatch(/Kopfzeile mit „Name“ und „Passwort“/);

    const kaputt = await leseKinderXlsx(new Uint8Array([0x50, 0x4b, 0x03, 0x04, 1, 2, 3, 4]).buffer);
    expect(kaputt.ok).toBe(false);
    if (!kaputt.ok) expect(kaputt.fehler.length).toBeGreaterThan(20);
  });

  it("`dateiBytes` liest eine Datei auch dort, wo `Blob.arrayBuffer` fehlt (jsdom)", async () => {
    const bytes = await xlsx({ Teilnehmer: [KOPF, ["Mia", "abcd", ""]] });
    const datei = new File([bytes], "kinder.xlsx");
    const r = await leseKinderXlsx(await dateiBytes(datei));
    expect(r.ok && r.zeilen.map((z) => z.name)).toEqual(["Mia"]);
  });
});

/* ════════════════════════════════════════════════════════════════════════ */
describe("★★★ Das Startniveau aus der Zelle: Name, Kurzwort oder Nummer", () => {
  it("jede der sieben Stufen per Name (Gross/klein und Leerzeichen egal), Kurzwort und Nummer", () => {
    expect(V.length).toBe(7);
    V.forEach((p, i) => {
      expect(startniveauAusZelle(p.label, V)).toEqual(p);
      expect(startniveauAusZelle(`  ${p.label.toUpperCase().replace(/ /g, "  ")} `, V)).toEqual(p);
      expect(startniveauAusZelle(p.label.replace(/\s+/g, ""), V)).toEqual(p);
      expect(startniveauAusZelle(p.key, V)).toEqual(p);
      expect(startniveauAusZelle(p.key.toUpperCase(), V)).toEqual(p);
      expect(startniveauAusZelle(String(i + 1), V)).toEqual(p);
    });
  });

  it("der Name ohne den Klammerteil genügt („Grundstellung\") - der hängt an der Tastatur", () => {
    expect(startniveauAusZelle("Grundstellung", V)).toEqual(V[1]);
  });

  it("ß oder ss ist egal („Grossschreibung\")", () => {
    expect(startniveauAusZelle("Erste Buchstaben + Grossschreibung", V)).toEqual(V[2]);
  });

  it("leer ⇒ Vorgabe (undefined), unbekannt ⇒ null", () => {
    expect(startniveauAusZelle("", V)).toBeUndefined();
    expect(startniveauAusZelle("   ", V)).toBeUndefined();
    for (const falsch of ["0", "8", "12", "Profi", "#NAME?", "2,5"])
      expect(startniveauAusZelle(falsch, V), falsch).toBeNull();
  });
});

/* ════════════════════════════════════════════════════════════════════════ */
describe("★★★ Passwort erzeugen (Entscheidung 3, 5 Zeichen seit 14.09.2026)", () => {
  it("fünf Zeichen aus Buchstaben+Ziffern gemischt, Zufall injizierbar", () => {
    const alphabet = PASSWORT_BUCHSTABEN + PASSWORT_ZIFFERN;
    expect(erzeugePasswort(() => 0)).toBe(alphabet[0].repeat(5));
    expect(erzeugePasswort(() => 0.999999)).toBe(
      alphabet[alphabet.length - 1].repeat(5),
    );
  });

  it("★ leicht tippbar: nur Kleinbuchstaben ohne y, z, l und Umlaute, Ziffern ohne 0 und 1, mindestens 4 Zeichen", () => {
    expect(PASSWORT_BUCHSTABEN).toMatch(/^[a-km-x]+$/);
    expect(PASSWORT_ZIFFERN).toBe("23456789");
    for (let i = 0; i < 300; i++) {
      const pw = erzeugePasswort();
      expect(pw).toMatch(/^[a-km-x2-9]{5}$/);
      expect(pw.length).toBeGreaterThanOrEqual(MIN_PASSWORT_KIND);
    }
  });
});

/* ════════════════════════════════════════════════════════════════════════ */
describe("★★★ Zeilen prüfen - jeder Fehlerfall mit seiner Zeilennummer", () => {
  it("plant die gültigen Kinder: erzeugtes Passwort vermerkt, Startniveau aus Zelle oder Vorgabe der Klasse", () => {
    const plan = pruefeKinderZeilen(
      [zeile(2, "Mia"), zeile(3, "Noah", "1234", "1"), zeile(4, "Lea", "", "zahlen")],
      { lernweg: "de", vorhandeneNamen: ["Anna"], startVorgabe: V[3].units, zufall: () => 0 },
    );
    expect(plan.abgelehnt).toEqual([]);
    expect(plan.anlegen).toEqual([
      {
        zeile: 2,
        name: "Mia",
        passwort: (PASSWORT_BUCHSTABEN + PASSWORT_ZIFFERN)[0].repeat(5),
        passwortErzeugt: true,
        startUnits: V[3].units,
        startLabel: V[3].label,
        startVorgabe: true,
        email: "",
      },
      {
        zeile: 3,
        name: "Noah",
        passwort: "1234",
        passwortErzeugt: false,
        startUnits: V[0].units,
        startLabel: V[0].label,
        startVorgabe: false,
        email: "",
      },
      expect.objectContaining({ zeile: 4, startUnits: V[5].units, startVorgabe: false }),
    ]);
  });

  it("ohne Vorgabe der Klasse gilt der erste Startpunkt - wie im Formular", () => {
    const plan = pruefeKinderZeilen([zeile(2, "Mia")], { lernweg: "de", vorhandeneNamen: [] });
    expect(plan.anlegen[0].startUnits).toBe(V[0].units);
    expect(plan.anlegen[0].startLabel).toBe(V[0].label);
  });

  it("Name fehlt · Passwort zu kurz · Startniveau unbekannt · schon in der Klasse · doppelt in der Datei", () => {
    const plan = pruefeKinderZeilen(
      [
        zeile(2, "", "abcd", "2"),
        zeile(3, "Ben", "abc"),
        zeile(4, "Eva", "", "9"),
        zeile(5, "anna"),
        zeile(6, "Mia"),
        zeile(8, "MIA", "abcd"),
        zeile(9, "Anna-Lena"),
        zeile(10, "anna lena"),
      ],
      { lernweg: "de", vorhandeneNamen: ["Anna"] },
    );
    expect(plan.anlegen.map((k) => k.name)).toEqual(["Mia", "Anna-Lena"]);
    expect(plan.abgelehnt).toEqual([
      { zeile: 2, name: "", grund: "Der Name fehlt." },
      { zeile: 3, name: "Ben", grund: "Das Passwort hat weniger als 4 Zeichen." },
      {
        zeile: 4,
        name: "Eva",
        grund: expect.stringContaining("„9“ ist kein Startniveau. Möglich sind die Nummern 1 bis 7"),
      },
      { zeile: 5, name: "anna", grund: "Diesen Namen gibt es in der Klasse schon." },
      { zeile: 8, name: "MIA", grund: "Der Name steht in der Datei schon in Zeile 6." },
      { zeile: 10, name: "anna lena", grund: "Der Name steht in der Datei schon in Zeile 9." },
    ]);
    expect(abgelehntSatz(plan.abgelehnt[1])).toBe(
      "Zeile 3 - Ben: Das Passwort hat weniger als 4 Zeichen.",
    );
    expect(abgelehntSatz(plan.abgelehnt[0])).toBe("Zeile 2: Der Name fehlt.");
  });

  it("★ Kontakt-E-Mail (14.09.2026): gültige Adresse landet im Plan, eine ohne „@“ wird abgelehnt", () => {
    const gueltig = pruefeKinderZeilen([zeile(2, "Mia", "", "", "eltern@example.com")], { lernweg: "de",
      vorhandeneNamen: [],
    });
    expect(gueltig.abgelehnt).toEqual([]);
    expect(gueltig.anlegen[0].email).toBe("eltern@example.com");

    const leer = pruefeKinderZeilen([zeile(2, "Mia")], { lernweg: "de", vorhandeneNamen: [] });
    expect(leer.anlegen[0].email).toBe("");

    const ungueltig = pruefeKinderZeilen([zeile(2, "Mia", "", "", "keine-adresse")], { lernweg: "de",
      vorhandeneNamen: [],
    });
    expect(ungueltig.anlegen).toEqual([]);
    expect(ungueltig.abgelehnt).toEqual([
      { zeile: 2, name: "Mia", grund: "„keine-adresse“ sieht nicht wie eine E-Mail-Adresse aus - oder die Zelle leer lassen." },
    ]);
  });

  it("★ „derselbe Name\" heisst dasselbe wie am Server (`synthEmail`) - sonst lehnte er erst beim Anlegen ab", () => {
    for (const [a, b] of [
      ["Anna", "anna"],
      ["Anna-Lena", "Anna Lena"],
      ["Jürgen", "Juergen"],
    ]) {
      expect(synthEmail("3B", a)).toBe(synthEmail("3B", b));
      const plan = pruefeKinderZeilen([zeile(2, b)], { lernweg: "de", vorhandeneNamen: [a] });
      expect(plan.abgelehnt[0]?.grund, `${a} / ${b}`).toBe("Diesen Namen gibt es in der Klasse schon.");
    }
    // Gegenprobe: verschiedene Namen bleiben verschieden.
    expect(pruefeKinderZeilen([zeile(2, "Mia")], { lernweg: "de", vorhandeneNamen: ["Mira"] }).anlegen).toHaveLength(1);
  });

  it("von der Datei bis zum Plan: die Zeilennummern kommen aus Excel", async () => {
    const zeilen = await lies({
      Teilnehmer: [KOPF, ["Mia", "", ""], [], ["Ben", "ab", ""], ["Mia", "abcd", ""]],
    });
    const plan = pruefeKinderZeilen(zeilen, { lernweg: "de", vorhandeneNamen: [] });
    expect(plan.anlegen.map((k) => [k.zeile, k.name])).toEqual([[2, "Mia"]]);
    expect(plan.abgelehnt.map(abgelehntSatz)).toEqual([
      "Zeile 4 - Ben: Das Passwort hat weniger als 4 Zeichen.",
      "Zeile 5 - Mia: Der Name steht in der Datei schon in Zeile 2.",
    ]);
  });
});
