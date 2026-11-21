/**
 * ★★★ WÄCHTER: Der gemeinsame Excel-Baustein beider Dateien (13.09.2026).
 *
 * Johannes, 13.09.2026: *„Man soll sofort erkennen, dass sie zu Tastenflow
 * gehören. Tastenflow und das Logo gehören auch in die erste Zeile."*
 *
 * WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD
 * ([[feedback_gruener_waechter_beweist_was]]):
 *  · Jemand ändert `public/tastenflow-logo.svg` und vergisst das PNG - rot,
 *    mit dem Befehl, der es behebt.
 *  · Das eingebettete PNG ist kaputt oder nicht mehr 256 x 256 - rot.
 *  · exceljs schreibt einen Link innerhalb der Mappe wieder mit einer
 *    Beziehung „nach aussen" (LibreOffice springt dann ins Leere) - rot.
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as XLSX from "xlsx";

import {
  dateisystemName,
  datumDeutsch,
  datumIso,
  internerLink,
  klassenBezeichnung,
  mappeAlsBytes,
  neueMappe,
  setzeMarkenKopf,
  umbruchZeilen,
} from "@/lib/typing/excelMarke";
import {
  TASTENFLOW_LOGO_PNG_BASE64,
  TASTENFLOW_LOGO_PNG_PX,
  TASTENFLOW_LOGO_SVG_SHA256,
} from "@/lib/typing/tastenflowLogoPng";

const WURZEL = join(__dirname, "..");

/** Eine Datei aus der xlsx (einem ZIP) als Text - mit SheetJS' eigenem Leser. */
function dateiAusZip(bytes: Uint8Array, pfad: string): string {
  const zip = XLSX.CFB.read(bytes, { type: "buffer" });
  // ⚠️ Mit führendem `/`: Ohne ihn findet `CFB.find` den Eintrag nicht
  // (die vollen Pfade beginnen mit „Root Entry/").
  const eintrag = XLSX.CFB.find(zip, `/${pfad}`);
  expect(eintrag, `${pfad} fehlt in der Datei`).toBeTruthy();
  return new TextDecoder().decode(eintrag!.content as Uint8Array);
}

describe("★★★ Das Zeichen als PNG", () => {
  it("passt zur SVG von heute - sonst das Skript neu laufen lassen", () => {
    const sha = createHash("sha256")
      .update(readFileSync(join(WURZEL, "public", "tastenflow-logo.svg")))
      .digest("hex");
    expect(
      sha,
      "public/tastenflow-logo.svg hat sich geändert - bitte `npx tsx scripts/erzeuge-logo-png.mts` laufen lassen, damit die Excel-Dateien das neue Zeichen tragen.",
    ).toBe(TASTENFLOW_LOGO_SVG_SHA256);
  });

  it("ist ein echtes PNG mit 256 x 256 Pixeln", () => {
    const png = Buffer.from(TASTENFLOW_LOGO_PNG_BASE64, "base64");
    expect([...png.subarray(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    // IHDR: Breite und Höhe ab Byte 16.
    expect(png.readUInt32BE(16)).toBe(TASTENFLOW_LOGO_PNG_PX);
    expect(png.readUInt32BE(20)).toBe(TASTENFLOW_LOGO_PNG_PX);
    expect(TASTENFLOW_LOGO_PNG_PX).toBe(256);
  });
});

describe("★★★ Der Kopf: Zeichen und „Tastenflow“ in Zeile 1", () => {
  it("setzt Bild, Wort, Titel und Unterzeile", async () => {
    const ExcelJS = (await import("exceljs")).default;
    const wb = await neueMappe();
    const ws = wb.addWorksheet("Probe");
    const naechste = await setzeMarkenKopf(wb, ws, { titel: "Klasse 3b - Probe", unterzeile: "Stand: 13.09.2026" });
    expect(naechste).toBe(4);

    const zurueck = new ExcelJS.Workbook();
    await zurueck.xlsx.load((await mappeAlsBytes(wb)) as unknown as ArrayBuffer);
    const probe = zurueck.getWorksheet("Probe")!;
    expect(probe.getCell("A1").value).toBe("Tastenflow");
    expect(probe.getCell("A1").font?.bold).toBe(true);
    expect(probe.getCell("A1").font?.color?.argb).toBe("FF0066CC");
    expect(probe.getCell("A2").value).toBe("Klasse 3b - Probe");
    expect(probe.getCell("A3").value).toBe("Stand: 13.09.2026");
    const bilder = probe.getImages();
    expect(bilder).toHaveLength(1);
    expect(bilder[0].range.tl.nativeRow).toBe(0);
    expect(bilder[0].range.tl.nativeCol).toBe(0);
    expect(zurueck.getImage(Number(bilder[0].imageId)).extension).toBe("png");
  });
});

describe("★★★ Links innerhalb der Mappe - ohne Beziehung nach aussen", () => {
  it("interner Link: nur `location`; ein Link ins Netz behält seine Beziehung", async () => {
    const wb = await neueMappe();
    const a = wb.addWorksheet("Übersicht");
    wb.addWorksheet("Schuljahr");
    a.getCell("A1").value = { text: "zum Schuljahr", hyperlink: internerLink("Schuljahr") };
    a.getCell("A2").value = { text: "Netz", hyperlink: "https://weingartner.org/" };
    const bytes = await mappeAlsBytes(wb);

    const blatt = dateiAusZip(bytes, "xl/worksheets/sheet1.xml");
    const links = blatt.match(/<hyperlink [^>]*\/>/g) ?? [];
    expect(links).toHaveLength(2);
    const intern = links.find((l) => l.includes('ref="A1"'))!;
    expect(intern).toContain("location=\"&apos;Schuljahr&apos;!A1\"");
    expect(intern).not.toContain("r:id");
    const beziehungen = dateiAusZip(bytes, "xl/worksheets/_rels/sheet1.xml.rels");
    expect(beziehungen).not.toContain("Schuljahr");
    expect(beziehungen).toContain("https://weingartner.org/");

    // So liest es SheetJS (und so springt ein Tabellenprogramm).
    const gelesen = XLSX.read(bytes, { type: "array" });
    expect(gelesen.Sheets["Übersicht"].A1.l?.Target).toBe("#'Schuljahr'!A1");
  });

  it("ein Apostroph im Blattnamen wird verdoppelt", () => {
    expect(internerLink("Mias Blatt")).toBe("'Mias Blatt'!A1");
    expect(internerLink("Zoe's", "B2")).toBe("'Zoe''s'!B2");
  });
});

describe("★ Datum, Dateiname, Klasse, Umbruch", () => {
  const JETZT = new Date(2026, 8, 13, 0, 30).getTime();
  it("Datum in Ortszeit, ISO und deutsch", () => {
    expect(datumIso(JETZT)).toBe("2026-09-13");
    expect(datumDeutsch(JETZT)).toBe("13.09.2026");
  });
  it("Klassenname dateisystemtauglich, ohne Namen „Klasse“", () => {
    expect(dateisystemName('3a/b: "Neu"?')).toBe("3a-b- -Neu--");
    expect(dateisystemName("  ")).toBe("Klasse");
  });
  it("„Klasse“ steht nie doppelt", () => {
    expect(klassenBezeichnung("3b")).toBe("Klasse 3b");
    expect(klassenBezeichnung("Klasse 3a")).toBe("Klasse 3a");
    expect(klassenBezeichnung(null)).toBe("Klasse");
  });
  it("Umbruch Wort für Wort", () => {
    expect(umbruchZeilen("kurz", 20)).toBe(1);
    expect(umbruchZeilen("eins zwei drei vier fünf sechs sieben acht", 10)).toBeGreaterThan(2);
    expect(umbruchZeilen("a\nb", 20)).toBe(2);
  });
});
