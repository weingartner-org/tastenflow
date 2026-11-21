/**
 * ★★★ DIE TASTENFLOW-MARKE IN EXCEL - EIN Baustein für beide Dateien
 * (13.09.2026).
 *
 * Johannes, 13.09.2026, zur Leistungstabelle: *„Mach die Tabellen schön! Man
 * soll sofort erkennen, dass sie zu Tastenflow gehören. Tastenflow und das Logo
 * gehören auch in die erste Zeile."* - und zur Import-Vorlage: *„Gestalte die
 * Tabelle ansprechend zur App passend."*
 *
 * Beide Dateien - die Import-Vorlage (`kinderImport.ts`) und die
 * Leistungstabelle (`leistungExport.ts`) - holen Farben, Schrift, den Kopf mit
 * Zeichen und das Herunterladen von hier. Zwei Fassungen des Kopfes sähen nach
 * dem ersten Nachbessern verschieden aus
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ── Warum exceljs und nicht SheetJS ──────────────────────────────────────────
 * Die freie Fassung von SheetJS (`xlsx` 0.18.5) schreibt KEINE Formatierung,
 * KEINE Auswahllisten (Datenüberprüfung) und KEINE Bilder - also nichts von
 * dem, was Johannes verlangt. exceljs (4.4.0, MIT) kann alle drei. GELESEN
 * wird die Import-Datei weiter mit SheetJS (`leseKinderXlsx`).
 *
 * ★ exceljs kommt immer per `await import("exceljs")` (`ladeExcelJS`) - es ist
 *   rund ein Megabyte gross und bleibt so aus dem Hauptbündel. Vite nimmt dafür
 *   von selbst die Browser-Fassung (`browser`-Feld im Paket), Node die
 *   Node-Fassung (Tests, Muster-Skript).
 *
 * ── Die Farben ───────────────────────────────────────────────────────────────
 * Aus `src/index.css`, helles Schema: Akzent, Logo-Blau (die Taste im Zeichen),
 * Akzent hell (die Gruppe „Üben" in der App), Schrift, gedämpfte Schrift,
 * grauer Grund, Linien, Erfolg. Excel kennt kein dunkles Schema - eine Datei
 * wird gedruckt und weitergegeben, darum das helle.
 *
 * ── Die Schrift ──────────────────────────────────────────────────────────────
 * Arial: auf Windows UND Mac vorhanden, in Excel wie in LibreOffice gleich
 * breit. Die App-Schrift (Atkinson Hyperlegible) ist auf Schulrechnern meist
 * nicht installiert - Excel setzte dann still eine andere ein.
 */
import type * as ExcelJS from "exceljs";
import type { BedienSprache } from "@/lib/bedienSprache";
import { kleinFuer } from "./sprachRegister";
import { istGeruestSprache } from "./sprachRegister";
import { KETTEN_NEUN } from "./kettenNeun";

export type ExcelModul = typeof ExcelJS;
export type Mappe = ExcelJS.Workbook;
export type Blatt = ExcelJS.Worksheet;

/** Die Farben als Hex ohne `#` (exceljs will `FF` davor - siehe {@link argb}). */
export const FARBE = {
  akzent: "0066CC",
  logoBlau: "0072B2",
  akzentHell: "E8F1FC",
  /** Zwischen Weiss und Akzent hell - die „Üben"-Spalten in hellen Zeilen. */
  akzentHauch: "F4F8FD",
  schrift: "1D1D1F",
  gedaempft: "6E6E73",
  grund: "F2F2F7",
  /** Die hellen Zebra-Zeilen: heller als der Grund, sonst wird es fleckig. */
  grundHell: "F8F8FB",
  linie: "D2D2D7",
  erfolg: "1E7E34",
  erfolgHell: "E6F4EA",
  weiss: "FFFFFF",
} as const;

export const SCHRIFT = "Arial";
export const XLSX_TYP = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/** `0066CC` ⇒ `FF0066CC` (deckend). */
export const argb = (hex: string) => `FF${hex}`;

/** Schrift in Arial, 10 Punkt, Schriftfarbe - `o` überschreibt. */
export function schrift(o: Partial<ExcelJS.Font> = {}): Partial<ExcelJS.Font> {
  return { name: SCHRIFT, size: 10, color: { argb: argb(FARBE.schrift) }, ...o };
}

/** Eine volle Füllung. */
export function flaeche(hex: string): ExcelJS.Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb: argb(hex) } };
}

/** Feine Linien rundum. */
export function linienRundum(hex: string = FARBE.linie): Partial<ExcelJS.Borders> {
  const s: Partial<ExcelJS.Border> = { style: "thin", color: { argb: argb(hex) } };
  return { top: s, left: s, bottom: s, right: s };
}

/** exceljs laden - Browser: eigener Chunk, Node: die Node-Fassung. */
export async function ladeExcelJS(): Promise<ExcelModul> {
  const m = (await import("exceljs")) as ExcelModul & { default?: ExcelModul };
  return m.default ?? m;
}

// ── Datum und Dateiname ─────────────────────────────────────────────────────

const zwei = (n: number) => String(n).padStart(2, "0");

/**
 * `2026-09-13` - ISO-geschrieben, damit Dateien im Ordner nach Datum sortieren.
 * ⚠️ In ORTSZEIT, nicht mit `toISOString()`: Das ist UTC, und wer kurz nach
 * Mitternacht speichert, bekäme in Österreich das Datum von gestern.
 */
export function datumIso(jetztMs: number): string {
  const d = new Date(jetztMs);
  return `${d.getFullYear()}-${zwei(d.getMonth() + 1)}-${zwei(d.getDate())}`;
}

/** `13.09.2026` - so, wie es in der Datei steht. */
export function datumDeutsch(jetztMs: number): string {
  return new Date(jetztMs).toLocaleDateString("de-AT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Ein Klassenname, der als Teil eines Dateinamens taugt.
 * ⚠️ Zeichen, die Dateisysteme ablehnen (`/ \ : * ? " < > |`), werden zu `-` -
 * „3a/b" würde sonst als Ordner gelesen. Ohne Namen: „Klasse".
 */
export function dateisystemName(klassenname: string | null | undefined): string {
  return (klassenname ?? "").replace(/[/\\:*?"<>|]/g, "-").trim() || "Klasse";
}

// ── Die Mappe ───────────────────────────────────────────────────────────────

/**
 * Eine neue Mappe, schon mit der Link-Reparatur (siehe
 * {@link interneLinksOhneBeziehung}).
 */
export async function neueMappe(): Promise<Mappe> {
  const ExcelJSModul = await ladeExcelJS();
  const wb = new ExcelJSModul.Workbook();
  wb.creator = "Tastenflow";
  interneLinksOhneBeziehung(wb);
  return wb;
}

/** Die Mappe als Bytes einer .xlsx-Datei. */
export async function mappeAlsBytes(wb: Mappe): Promise<Uint8Array> {
  const puffer = await wb.xlsx.writeBuffer();
  return new Uint8Array(puffer as ArrayBuffer);
}

/**
 * Lädt Bytes als Datei herunter - ein unsichtbarer Link, danach weg.
 * ⚠️ Steht hier und NICHT über `src/lib/exporters.ts`: Das ist ein Modul der
 * Uni-Welt, und die Kinder-Apps importieren null Uni-Module
 * (`apps/GEMEINSAM.md` §2).
 */
export function dateiHerunterladen(bytes: Uint8Array | ArrayBuffer, dateiname: string): void {
  const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: XLSX_TYP }));
  const a = document.createElement("a");
  a.href = url;
  a.download = dateiname;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Der Linkbezug auf eine Zelle eines anderen Blattes: `'Schuljahr'!A1`.
 * Ein `'` im Blattnamen wird verdoppelt, wie Excel es verlangt.
 */
export function internerLink(blattName: string, zelle = "A1"): string {
  return `'${blattName.replace(/'/g, "''")}'!${zelle}`;
}

/**
 * ⚠️⚠️ REPARATUR: exceljs 4.4.0 schreibt Links INNERHALB der Mappe falsch
 * (13.09.2026, gemessen).
 *
 * Ein Link wie `'Schuljahr'!A1` bekommt von exceljs ZWEI Ziele: das richtige
 * (`location`) und zusätzlich eine Beziehung „nach aussen" mit demselben Text.
 * LibreOffice setzt beide zusammen und springt ins Leere - im Test gemessen:
 * aus der Datei wurde ein Link auf `../'Schuljahr'!A1#'Schuljahr'!A1`. Wie es
 * in jeder Excel-Fassung ausgeht, lässt sich hier nicht messen; eine Datei, die
 * nur in einem Programm stimmt, ist keine richtige Datei.
 *
 * Die Reparatur greift, BEVOR exceljs die Blätter schreibt: Bei Links, die
 * exceljs selbst als intern erkennt (`Blatt!A1`), fallen Beziehungs-Nummer und
 * Beziehung weg - es bleibt allein `location`, so wie Excel selbst solche Links
 * speichert. LibreOffice liest danach `#'Schuljahr'.A1` (gemessen), SheetJS
 * `#'Schuljahr'!A1` (Wächter `tastenflow-leistung-export.test.ts`).
 *
 * ⚠️ `addWorksheets` ist eine Methode der exceljs-Klasse `XLSX`, kein
 * dokumentierter Weg. Sie heisst in der Node-Fassung und in der
 * Browser-Fassung (`dist/exceljs.min.js`) gleich und wird dort als
 * `this.addWorksheets(...)` aufgerufen (nachgesehen). Fehlt sie in einer
 * späteren Fassung, bleibt die Datei trotzdem lesbar - nur die Links wären
 * wieder doppelt. Der Wächter misst genau das.
 */
export function interneLinksOhneBeziehung(wb: Mappe): void {
  interface Link {
    target?: string;
    rId?: string;
  }
  interface BlattModell {
    hyperlinks?: Link[];
    rels?: { Id: string }[];
  }
  type Schreiber = (zip: unknown, model: { worksheets: BlattModell[] }) => Promise<void>;
  const xlsx = wb.xlsx as unknown as { addWorksheets?: Schreiber };
  const original = xlsx.addWorksheets;
  if (typeof original !== "function") return;
  // Dieselbe Erkennung wie in exceljs (`HyperlinkXform.isInternalLink`).
  const intern = /^[^!#]+![a-zA-Z]+\d+$/;
  xlsx.addWorksheets = function (this: unknown, zip, model) {
    for (const blatt of model.worksheets) {
      const weg = new Set<string>();
      for (const link of blatt.hyperlinks ?? []) {
        if (link.rId && intern.test(link.target ?? "")) {
          weg.add(link.rId);
          delete link.rId;
        }
      }
      if (weg.size > 0) blatt.rels = (blatt.rels ?? []).filter((r) => !weg.has(r.Id));
    }
    return original.call(this, zip, model);
  };
}

// ── Der Kopf mit dem Zeichen ────────────────────────────────────────────────

/** Höhe der ersten Zeile in Punkt - Platz für das Zeichen. */
export const KOPF_HOEHE_PT = 34;
/** Kantenlänge des Zeichens in Pixeln. */
export const LOGO_PX = 36;
/**
 * Einzug von „Tastenflow" rechts neben dem Zeichen. Eine Stufe sind laut
 * Dateiformat drei Leerzeichen der Standardschrift (etwa 10 Pixel) - Excel und
 * LibreOffice rechnen gleich.
 */
export const LOGO_EINZUG = 5;

const PX_IN_EMU = 9525;
const logoIds = new WeakMap<Mappe, number>();

/** Das Zeichen einmal je Mappe anmelden - jedes Blatt benutzt dasselbe Bild. */
async function logoId(wb: Mappe): Promise<number> {
  const bekannt = logoIds.get(wb);
  if (bekannt !== undefined) return bekannt;
  const { TASTENFLOW_LOGO_PNG_BASE64 } = await import("./tastenflowLogoPng");
  const id = wb.addImage({ base64: TASTENFLOW_LOGO_PNG_BASE64, extension: "png" });
  logoIds.set(wb, id);
  return id;
}

/**
 * ★★★ DER KOPF JEDES BLATTES - drei Zeilen:
 *   1. das Zeichen und daneben „Tastenflow" (gross, fett, Akzentfarbe),
 *   2. der Titel (fett),
 *   3. die Unterzeile (gedämpft) - Datum, „Stand", „Erstellt am".
 *
 * Das Zeichen liegt ÜBER der Zelle A1, der Text darin ist eingerückt. So
 * bleibt Spalte A die erste Spalte der Tabelle - in der Import-Vorlage muss
 * die Auswahlliste in Spalte C stehen (Johannes' Wortlaut).
 *
 * @returns die nächste freie Zeile (4).
 */
export async function setzeMarkenKopf(
  wb: Mappe,
  ws: Blatt,
  kopf: {
    titel: string;
    unterzeile: string;
    /** ★ EN6a (19.09.2026): Sprache der Fusszeile beim Drucken - ohne Angabe Deutsch. */
    sprache?: BedienSprache;
    /**
     * ★ 18.10.2026 (programmneutrale Anmeldung): der Name in der ersten Zeile.
     * Ohne Angabe „Tastenflow" mit dem Zeichen - wie bisher, Byte für Byte.
     * Mit einem anderen Namen (die Import-Vorlage einer Klasse OHNE Tastenflow
     * sagt „Lernwerkstatt") steht der Name allein, ohne Tastenflow-Zeichen.
     */
    marke?: string;
  },
): Promise<number> {
  const markenName = kopf.marke ?? "Tastenflow";
  const mitZeichen = markenName === "Tastenflow";
  const zeile1 = ws.getRow(1);
  zeile1.height = KOPF_HOEHE_PT;
  const marke = ws.getCell("A1");
  marke.value = markenName;
  marke.font = schrift({ size: 20, bold: true, color: { argb: argb(FARBE.akzent) } });
  marke.alignment = {
    vertical: "middle",
    horizontal: "left",
    indent: mitZeichen ? LOGO_EINZUG : 0,
  };

  // Senkrecht mittig: Zeilenhöhe in Pixeln (96 dpi) minus Bild, halbiert.
  const obenPx = Math.max(0, Math.round((KOPF_HOEHE_PT * 96) / 72 - LOGO_PX) / 2);
  if (mitZeichen)
  ws.addImage(await logoId(wb), {
    // ⚠️ `native…`-Angaben statt Bruchteilen einer Spalte: exceljs rechnet
    // Bruchteile über eine geschätzte Spaltenbreite um, und das Zeichen stünde
    // je nach Breite von Spalte A anders. Pixel sind Pixel.
    tl: {
      nativeCol: 0,
      nativeColOff: 5 * PX_IN_EMU,
      nativeRow: 0,
      nativeRowOff: Math.round(obenPx * PX_IN_EMU),
    } as unknown as { col: number; row: number },
    ext: { width: LOGO_PX, height: LOGO_PX },
    editAs: "oneCell",
  });

  const titel = ws.getCell("A2");
  titel.value = kopf.titel;
  titel.font = schrift({ size: 14, bold: true });
  titel.alignment = { vertical: "middle" };
  ws.getRow(2).height = 22;

  const unter = ws.getCell("A3");
  unter.value = kopf.unterzeile;
  unter.font = schrift({ size: 10, color: { argb: argb(FARBE.gedaempft) } });
  unter.alignment = { vertical: "middle" };
  ws.getRow(3).height = 17;

  // Beim Drucken unten klein: woher das Blatt kommt, und die Seitenzahl.
  const marken = kopf.titel.replace(/&/g, "&&");
  const fuss =
    kopf.sprache === "fr"
      ? `&L&8Tastenflow - ${marken}&R&8Page &P sur &N`
      : kopf.sprache === "es"
        ? `&L&8Tastenflow - ${marken}&R&8Página &P de &N`
        : kopf.sprache === "it"
        ? `&L&8Tastenflow - ${marken}&R&8Pagina &P di &N`
        : kopf.sprache === "pl"
        ? `&L&8Tastenflow - ${marken}&R&8Strona &P z &N`
        : // ★ O-TR (02.10.2026): "Sayfa 2, toplam 5" (Glossar Regel 6, nie "2 / 5").
          kopf.sprache === "tr"
        ? `&L&8Tastenflow - ${marken}&R&8Sayfa &P, toplam &N`
        : // ★ O-CS (03.10.2026): „Strana 2/5" - Schrägstrich statt „z/ze" (Glossar Regel 13).
          kopf.sprache === "cs"
        ? `&L&8Tastenflow - ${marken}&R&8Strana &P/&N`
        : kopf.sprache === "en"
        ? `&L&8Tastenflow - ${marken}&R&8Page &P of &N`
        : `&L&8Tastenflow - ${marken}&R&8Seite &P von &N`;
  ws.headerFooter.oddFooter = mitZeichen ? fuss : fuss.replace("Tastenflow - ", `${markenName} - `);
  return 4;
}

/**
 * „Klasse 3b" - und heisst die Klasse schon „Klasse 3a", steht das Wort nicht
 * zweimal da. Ohne Namen: „Klasse".
 */
export function klassenBezeichnung(
  klassenname: string | null | undefined,
  /**
   * ★ EN6a (19.09.2026): *Class 3b* in der englischen Bedienung (Glossar
   * §3.11: der Name der Klasse). Ohne Angabe Deutsch, genau wie vorher. Heisst
   * die Klasse schon „Class 3b" (oder „Klasse 3b"), bleibt der Name, wie er ist.
   * ★ E11a-3 (26.09.2026): „Classe 3b" französisch (Glossar §9.2 „Mes classes").
   */
  sprache: BedienSprache = "de",
): string {
  const name = (klassenname ?? "").trim();
  // ★ O-CS (03.10.2026): „Třída 3b" (Glossar §2.5) - der Name steht im
  // Nominativ hinter dem Kopfwort und wird nie gebeugt (Regel 12). Vergleich
  // über toLowerCase und Leerzeichen/Ende statt `\b` (das kennt „í" nicht).
  // ★ O4 (30.10.2026): die neun eigen. Vergleich über \p{L} statt `\b` (das kennt nur ASCII).
  if (istGeruestSprache(sprache)) {
    const k = KETTEN_NEUN[sprache];
    if (!name) return k.klasseBezeichnung("");
    const klein = name.toLowerCase();
    const traegtEs = new RegExp(`^(${k.klasseWort}|class|klasse)(?!\\p{L})`, "u").test(klein) || klein.endsWith(` ${k.klasseWort}`);
    return traegtEs ? name : k.klasseBezeichnung(name);
  }
  if (sprache === "cs") {
    if (!name) return "Třída";
    return /^(třída|class|klasse)(\s|$)/.test(name.toLowerCase()) ? name : `Třída ${name}`;
  }
  // ★ O-TR (02.10.2026): "3b sınıfı" - die Endung steht an "sınıf", nie am Namen
  // (Glossar Regel 6). Vergleich über kleinFuer(..., "tr") statt Regex mit /i
  // (Glossar §4 Nr. 1: i/İ, ı/I).
  if (sprache === "tr") {
    if (!name) return "Sınıf";
    const klein = kleinFuer(name, "tr");
    return /^(sınıf|class|klasse)(\s|$)/.test(klein) || /\ssınıfı$/.test(klein)
      ? name
      : `${name} sınıfı`;
  }
  // ★ O-PL (02.10.2026): „Klasa 3b" (Glossar §2.5).
  if (sprache === "pl")
    return !name ? "Klasa" : /^(klasa|class|klasse)\b/i.test(name) ? name : `Klasa ${name}`;
  // ★ O-IT (02.10.2026): „Classe 3b".
  if (sprache === "it")
    return !name ? "Classe" : /^(classe|class|klasse)\b/i.test(name) ? name : `Classe ${name}`;
  if (sprache === "fr")
    return !name ? "Classe" : /^(classe|class|klasse)\b/i.test(name) ? name : `Classe ${name}`;
  // ★ ES-O (27.09.2026): „Clase 3b" (bis dahin fiel „es" still auf „Klasse").
  if (sprache === "es")
    return !name ? "Clase" : /^(clase|class|klasse)\b/i.test(name) ? name : `Clase ${name}`;
  if (sprache === "en")
    return !name ? "Class" : /^(class|klasse)\b/i.test(name) ? name : `Class ${name}`;
  return !name ? "Klasse" : /^klasse\b/i.test(name) ? name : `Klasse ${name}`;
}

/**
 * In wie viele Zeilen ein Text in einer Spalte umbricht - Wort für Wort, wie
 * Excel es tut (ein zu langes Wort bricht mitten durch).
 *
 * Arial 10 braucht je Zeichen weniger als eine Einheit der Spaltenbreite (die
 * Einheit ist die Ziffernbreite der Standardschrift). Gemessen am Muster in
 * LibreOffice (13.09.2026): rund 1,3 Zeichen je Einheit - gerechnet wird mit
 * 1,2, damit in Excel mit etwas anderer Laufweite nichts abgeschnitten wird.
 * Fette Schrift ist breiter - dafür die Spalte beim Aufruf schmaler angeben.
 */
export function umbruchZeilen(text: string, spaltenBreite: number, schriftPt = 10): number {
  const jeZeile = Math.max(6, Math.floor((spaltenBreite * 1.2 * 10) / schriftPt));
  let zeilen = 0;
  for (const absatz of text.split("\n")) {
    let laenge = 0;
    let n = 1;
    for (const wort of absatz.split(/\s+/).filter(Boolean)) {
      if (laenge === 0) laenge = wort.length;
      else if (laenge + 1 + wort.length <= jeZeile) laenge += 1 + wort.length;
      else {
        n++;
        laenge = wort.length;
      }
      while (laenge > jeZeile) {
        n++;
        laenge -= jeZeile;
      }
    }
    zeilen += n;
  }
  return zeilen;
}

/**
 * Wie hoch eine Zeile sein muss, damit ein umbrochener Text ganz zu sehen ist
 * (in Punkt).
 *
 * ⚠️ Excel passt die Höhe beim Öffnen NICHT zuverlässig selbst an (bei
 * verbundenen Zellen nie). Darum wird sie hier geschätzt - lieber etwas Luft
 * als ein abgeschnittener Satz.
 */
export function zeilenHoehe(text: string, spaltenBreite: number, schriftPt = 10): number {
  return Math.ceil(umbruchZeilen(text, spaltenBreite, schriftPt) * schriftPt * 1.3 + 7);
}
