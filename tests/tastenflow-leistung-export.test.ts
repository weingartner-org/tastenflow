/**
 * ★★★ WÄCHTER: Der Excel-Export der Leistungstabelle (12.09.2026, neu
 * gestaltet 13.09.2026).
 *
 * Johannes, 12.09.2026: *„Ich brauche eine Exportmöglichkeit für die
 * Leistungstabelle, in Klassenname_datum.xlsx."* Johannes, 13.09.2026: *„Mit
 * einem Startblatt, mit Links zu den drei Zeiträumen und unterhalb einer
 * Legende, in der die Spaltenüberschriften genau beschrieben sind … Das nächste
 * Blatt ist dann Schuljahr, dann Gesamt und dann erst Woche … Tastenflow und das
 * Logo gehören auch in die erste Zeile."*
 *
 * Gemessen wird ZWEIERLEI:
 *  1. die REINE Funktion `leistungsBlaetter` - was in die Blätter geht:
 *     vier Zeiträume (und die Zahlen unterscheiden sich wirklich - sonst sähe
 *     der Test eine Verwechslung nicht), Zahlen als Zahlen, ein Strich ohne
 *     Wert, Wochenziel-Spalten nur mit Ziel, alphabetisch nach `de-AT`;
 *  2. die DATEI selbst - mit exceljs geschrieben und mit exceljs und SheetJS
 *     WIEDER GELESEN: Blattreihenfolge, Links der Übersicht, Legende aus den
 *     App-Sätzen, Zeichen und „Tastenflow" in Zeile 1, Formate, Fixierung.
 *
 * WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD
 * ([[feedback_gruener_waechter_beweist_was]]):
 *  · Die Legende formuliert eine Spalte anders als der Hinweis in der App - rot
 *    (Gleichheit gegen DIESELBEN Konstanten, nicht gegen abgeschriebenen Text).
 *  · Eine Spalte kommt in ein Datenblatt, ohne in der Legende zu stehen - rot.
 *  · „Woche" rutscht wieder nach vorn, ein Link zeigt auf das falsche Blatt - rot.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ExcelJS from "exceljs";
import * as XLSX from "xlsx";

import { leistungsBlaetter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import type { PupilData } from "@/components/typing/PupilStatsPanel";
import {
  PRUEFUNG_WORT,
  PRUEFUNG_WORT_MEHRZAHL,
  computePupilStats,
  emptyProgress,
  probenUebersicht,
  werteAus,
  type Probenergebnis,
  type TypingAccount,
} from "@/lib/typing";
import {
  addPupil,
  createClass,
  listPupils,
  registerTeacher,
  type TaskEvent,
} from "@/lib/typing/account";
import {
  KOPF_CHALLENGE_SCHNITT,
  LEGENDE_ZUSATZ,
  OHNE_WERT,
  STRICH_SATZ,
  UEBERSICHT_BLATT,
  WOCHENAUFGABEN_KOPF_PROZENT,
  WOCHENZIEL_KOPF_ERLEDIGT,
  WOCHENZIEL_KOPF_MINUTEN,
  ZEITRAUM_SATZ,
  leistungDateiBytes,
  leistungDateiname,
  leistungLegende,
  type LeistungsBlatt,
} from "@/lib/typing/leistungExport";
import {
  LEISTUNGSSTUFE_HILFE,
  PRUEFUNG_GRUPPE_HILFE,
  TASTEN_HILFE,
  UEBEN_GRUPPE_HILFE,
  UEBEZEIT_HILFE,
} from "@/lib/typing/leistungSpaltenTexte";
import { HINWEIS_CHALLENGE } from "@/lib/typing/schreibprobeHinweise";
import { werte } from "@/lib/typing/schreibprobeWertung";
import { scoreAusStats, scoreAusWerten } from "@/lib/typing/score";
import { spaltenGrund } from "@/lib/typing/veraenderung";
import { wochenzielHilfe, wochenzielImZeitraum } from "@/lib/typing/wochenzielZeitraum";
import { WOCHENZIEL_GRENZE, kindWochenzielAusFeldern } from "@/lib/typing/wochenziel";
import {
  ZEITRAUM_START,
  ereignisseIm,
  zeitraumTitel,
  type Zeitraum,
} from "@/lib/typing/zeitraum";

/** Samstag, 12.09.2026, Mittag - die Woche läuft von 07.09. bis 13.09. */
const JETZT = new Date(2026, 8, 12, 12, 0).getTime();

const DIESE_WOCHE: TaskEvent = {
  ts: JETZT - 3_600_000,
  lesson: "l1",
  chars: 1200,
  errors: 12,
  ms: 360_000,
};
/**
 * Im laufenden Schuljahr (ab 01.08.2026) und im „Monat" (ab Montag 17.08.,
 * 8:00), aber nicht in dieser Woche.
 */
const IM_SCHULJAHR: TaskEvent = {
  ts: new Date(2026, 7, 20, 10, 0).getTime(),
  lesson: "l1",
  chars: 1000,
  errors: 100,
  ms: 600_000,
};
/**
 * ★ K4: Im laufenden Schuljahr, aber VOR dem „Monat" (der beginnt Montag
 * 17.08., 8:00). Ohne dieses Ereignis zählen „Monat" und „Schuljahr" dieselben
 * Ereignisse - eine Verwechslung der beiden Blätter fiele nicht auf.
 */
const IM_SCHULJAHR_VOR_DEM_MONAT: TaskEvent = {
  ts: new Date(2026, 7, 10, 10, 0).getTime(),
  lesson: "l1",
  chars: 1000,
  errors: 200,
  ms: 300_000,
};
/** Vor dem Schuljahr - zählt nur bei „Gesamt". */
const VOR_DEM_SCHULJAHR: TaskEvent = {
  ts: new Date(2025, 5, 2, 10, 0).getTime(),
  lesson: "l1",
  chars: 1000,
  errors: 300,
  ms: 600_000,
};

const ZEITRAEUME: [string, Zeitraum][] = [
  ["Schuljahr", { ...ZEITRAUM_START, art: "schuljahr" }],
  ["Gesamt", { ...ZEITRAUM_START, art: "gesamt" }],
  ["Monat", { ...ZEITRAUM_START, art: "monat", monatVersatz: 0 }],
  ["Woche", ZEITRAUM_START],
];

const TREFFER = "Treffsicherheit (%)";
const TEMPO = "Anschläge pro Minute";
const UEBEZEIT = "Übezeit (Minuten)";
const STUFE = "Leistungsstufe (1-50)";
const SCHNITT = `${PRUEFUNG_WORT} Leistungswert (Schnitt)`;

function baueKinder(namen: string[]): TypingAccount[] {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  for (const name of namen) {
    const p = addPupil(c.value.code, name, "pw1234");
    if (!p.ok) throw new Error(p.error);
  }
  return listPupils(c.value.code);
}

/** So lädt der Reiter ein Kind: `stats` über ALLE Ereignisse. */
function kind(pupil: TypingAccount, events: TaskEvent[]): PupilData {
  return { pupil, progress: emptyProgress(), events, stats: computePupilStats(events) };
}

/**
 * ★ W3a: ein Zielverlauf, aktiv seit „2026-W01" - lange vor JETZT (2026-W37),
 * damit die laufende Testwoche eine ECHTE Ziel-Woche ist. Die alten Felder
 * (`goalMinutes`/`goalUnits`) würden über {@link kindWochenzielAusFeldern} erst
 * ab `UMSTELLUNG_WOCHE` („2026-W38") gelten - EINE Woche NACH JETZT, siehe
 * `wochenziel.ts` - und die ganze Rechnung liefe für diesen Test leer.
 */
const ZIEL_10_MIN_PRO_WOCHE = [{ ab: "2026-W01", minuten: 10 }];

function klasse(o: { mitZiel?: string[] } = {}): PupilData[] {
  const kinder = baueKinder(["Zoe", "Ben", "Ärzu"]);
  const von = (name: string) => {
    const p = kinder.find((k) => k.name === name)!;
    return o.mitZiel?.includes(name) ? { ...p, wochenzielVerlauf: ZIEL_10_MIN_PRO_WOCHE } : p;
  };
  return [
    kind(von("Zoe"), [DIESE_WOCHE, IM_SCHULJAHR, IM_SCHULJAHR_VOR_DEM_MONAT, VOR_DEM_SCHULJAHR]),
    kind(von("Ben"), []),
    kind(von("Ärzu"), [VOR_DEM_SCHULJAHR]),
  ];
}

const blatt = (blaetter: LeistungsBlatt[], name: string) =>
  blaetter.find((b) => b.name === name)!;
const koepfe = (b: LeistungsBlatt) => b.spalten.map((s) => s.kopf);
function zelle(b: LeistungsBlatt, name: string, kopf: string) {
  const i = koepfe(b).indexOf(kopf);
  expect(i, `Spalte „${kopf}" fehlt in „${b.name}"`).toBeGreaterThanOrEqual(0);
  const zeile = b.daten.find((z) => z[0] === name);
  expect(zeile, `Zeile „${name}" fehlt in „${b.name}"`).toBeTruthy();
  return zeile![i];
}

/** Ein echtes Ergebnis - durch dasselbe Rechenwerk wie beim Abgeben. */
function ergebnis(zeichen: number, fehler: number, tag: number): Probenergebnis {
  const beginn = new Date(2026, 8, tag, 10, 4).getTime();
  return werteAus({
    probeId: `sp-${tag}`,
    niveau: "buchstaben",
    textNr: 0,
    textTitel: "Der Igel",
    beginnMs: beginn,
    endeMs: beginn + 5 * 60_000,
    zeitMs: 5 * 60_000,
    zuschlagProzent: 0,
    wartezeitMs: 0,
    zeichen,
    fehler,
    zeilen: 20,
    schreibMs: 5 * 60_000,
    anschlaege: [],
    layout: "de",
    textZuEnde: false,
    frueherAbgegeben: false,
  });
}

/** Die Datei schreiben und mit exceljs wieder einlesen. */
async function datei(blaetter: LeistungsBlatt[]) {
  const bytes = await leistungDateiBytes(blaetter, { klassenname: "3b", jetztMs: JETZT });
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(bytes as unknown as ArrayBuffer);
  return { bytes, wb };
}

/** Alle Zellen mit Text - für die Sprach-Wächter. */
function alleTexte(wb: ExcelJS.Workbook): string[] {
  const texte: string[] = [];
  wb.eachSheet((ws) =>
    ws.eachRow((row) =>
      row.eachCell((c) => {
        if (typeof c.value === "string") texte.push(c.value);
        else if (c.value && typeof c.value === "object" && "text" in c.value)
          texte.push(String((c.value as { text: string }).text));
      }),
    ),
  );
  return texte;
}

/** Die Legende der Übersicht: Name → Erklärung, in der Reihenfolge der Datei. */
function legendeAusDatei(ws: ExcelJS.Worksheet): [string, string][] {
  let start = 0;
  ws.eachRow((row, nr) => {
    if (!start && row.getCell(1).value === "Spalte" && row.getCell(2).value === "Bedeutung")
      start = nr + 1;
  });
  expect(start, "Kopf „Spalte · Bedeutung“ fehlt").toBeGreaterThan(0);
  const paare: [string, string][] = [];
  for (let nr = start; ws.getCell(nr, 1).value; nr++)
    paare.push([String(ws.getCell(nr, 1).value), String(ws.getCell(nr, 2).value)]);
  return paare;
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(JETZT);
});
afterEach(() => vi.useRealTimers());

describe("★★★ Vier Zeiträume - Schuljahr, Gesamt, Monat, Woche - unabhängig vom Zeitraum-Kopf", () => {
  it("in dieser Reihenfolge, mit Titel, Zeitraum und Datum", () => {
    const b = leistungsBlaetter(klasse(), {}, [], JETZT, "3b");
    expect(b.map((x) => x.name)).toEqual(["Schuljahr", "Gesamt", "Monat", "Woche"]);
    expect(b[3].titel).toBe(`Klasse 3b - ${zeitraumTitel(ZEITRAUM_START, JETZT, WOCHENZIEL_GRENZE)}`);
    expect(b[0].titel).toBe("Klasse 3b - Schuljahr 2026/27");
    expect(b[1].titel).toBe("Klasse 3b - Gesamt");
    // ★ K4 (19.09.2026): „Monat" - die letzten 4 Wochen, endend mit der
    // laufenden (07.-13.09.), also ab 17.08.
    expect(b[2].titel).toBe("Klasse 3b - Dieser Monat, 17.08. bis 13.09.");
    expect(b[3].titel).toBe("Klasse 3b - Diese Woche, 07.09. bis 13.09.");
    expect(b.map((x) => x.zeitraumTitel)).toEqual([
      "Schuljahr 2026/27",
      "Gesamt",
      "Dieser Monat, 17.08. bis 13.09.",
      "Diese Woche, 07.09. bis 13.09.",
    ]);
    for (const x of b) {
      expect(x.erstellt).toBe("Erstellt am 12.09.2026");
      expect(koepfe(x)[0]).toBe("Name");
    }
  });

  it("jedes Blatt rechnet SEINEN Zeitraum - mit derselben Rechnung wie die Tabelle", () => {
    const datas = klasse();
    const b = leistungsBlaetter(datas, {}, [], JETZT, "3b");
    const zoe = datas[0].events;
    for (const [name, zeitraum] of ZEITRAEUME) {
      const s = computePupilStats(ereignisseIm(zoe, zeitraum, JETZT, WOCHENZIEL_GRENZE));
      const x = blatt(b, name);
      expect(zelle(x, "Zoe", TREFFER)).toBe(Math.round(s.accuracy * 100));
      expect(zelle(x, "Zoe", TEMPO)).toBe(Math.round(s.avgCpm));
      expect(zelle(x, "Zoe", UEBEZEIT)).toBe(Math.round(s.totalMs / 6_000) / 10);
      expect(zelle(x, "Zoe", "Score")).toBe(Math.round(scoreAusStats(s).wert!));
    }
    // Gegenprobe: Die vier Zeiträume ergeben wirklich vier verschiedene Werte -
    // sonst fiele eine Verwechslung der Blätter hier nicht auf. Dafür sorgt
    // `IM_SCHULJAHR_VOR_DEM_MONAT`: ohne es sind „Monat" und „Schuljahr" gleich.
    expect(new Set(b.map((x) => zelle(x, "Zoe", TREFFER))).size).toBe(4);
    expect(new Set(b.map((x) => zelle(x, "Zoe", UEBEZEIT))).size).toBe(4);
  });

  it("wer nur VOR dem Schuljahr geübt hat, hat in Woche und Schuljahr einen Strich", () => {
    const b = leistungsBlaetter(klasse(), {}, [], JETZT, "3b");
    for (const name of ["Woche", "Schuljahr"]) {
      expect(zelle(blatt(b, name), "Ärzu", TREFFER)).toBe(OHNE_WERT);
      expect(zelle(blatt(b, name), "Ärzu", UEBEZEIT)).toBe(OHNE_WERT);
    }
    expect(typeof zelle(blatt(b, "Gesamt"), "Ärzu", TREFFER)).toBe("number");
    expect(typeof zelle(blatt(b, "Gesamt"), "Ärzu", UEBEZEIT)).toBe("number");
  });
});

describe("★★★ Zahlen als Zahlen - ohne Wert ein Strich, nie eine 0", () => {
  it("die Zahlen-Spalten tragen Zahlen, keine Texte wie „12/31“ oder „95 %“", () => {
    const b = leistungsBlaetter(klasse(), {}, [], JETZT, "3b");
    const woche = blatt(b, "Woche");
    for (const kopf of [
      STUFE,
      "Tasten sitzen",
      "Tasten freigeschaltet",
      UEBEZEIT,
      TREFFER,
      TEMPO,
      "Score",
    ])
      expect(typeof zelle(woche, "Zoe", kopf), kopf).toBe("number");
    const stufe = zelle(woche, "Zoe", STUFE) as number;
    expect(stufe).toBeGreaterThanOrEqual(1);
    expect(stufe).toBeLessThanOrEqual(50);
  });

  it("wer nichts geübt hat, bekommt Striche - keine erfundene 0", () => {
    const b = leistungsBlaetter(klasse(), {}, [], JETZT, "3b");
    for (const [name] of ZEITRAEUME) {
      const x = blatt(b, name);
      for (const kopf of [UEBEZEIT, TREFFER, TEMPO, "Score", PRUEFUNG_WORT_MEHRZAHL, SCHNITT])
        expect(zelle(x, "Ben", kopf), `${name} / ${kopf}`).toBe(OHNE_WERT);
      // Stufe und Tasten gibt es auch ohne Übung - wie auf dem Schirm („1/50").
      expect(typeof zelle(x, "Ben", STUFE)).toBe("number");
      expect(typeof zelle(x, "Ben", "Tasten freigeschaltet")).toBe("number");
    }
  });
});

describe("★★ Spalten und Reihenfolge wie auf dem Schirm", () => {
  it("ohne gesetztes Wochenziel: keine Wochenziel-Spalte, in keinem Blatt", () => {
    const b = leistungsBlaetter(klasse(), {}, [], JETZT, "3b");
    for (const x of b)
      expect(koepfe(x)).toEqual([
        "Name",
        STUFE,
        "Tasten sitzen",
        "Tasten freigeschaltet",
        UEBEZEIT,
        TREFFER,
        TEMPO,
        "Score",
        PRUEFUNG_WORT_MEHRZAHL,
        SCHNITT,
      ]);
  });

  it("★ W3a: mit gesetztem Wochenziel - Minuten im Blatt „Woche“, Prozent in „Schuljahr“/„Gesamt“", () => {
    const datas = klasse({ mitZiel: ["Zoe"] });
    const zoe = datas.find((d) => d.pupil.name === "Zoe")!;
    const ziel = kindWochenzielAusFeldern(zoe.pupil);
    const b = leistungsBlaetter(datas, {}, [], JETZT, "3b");
    const woche = blatt(b, "Woche");
    expect(koepfe(woche).slice(4, 8)).toEqual([
      UEBEZEIT,
      WOCHENZIEL_KOPF_MINUTEN,
      WOCHENZIEL_KOPF_ERLEDIGT,
      TREFFER,
    ]);
    // Dieselbe Rechnung wie die Spalte auf dem Schirm - keine zweite Wahrheit.
    const wocheStand = wochenzielImZeitraum(zoe.events, ziel, [], ZEITRAUM_START, JETZT);
    expect(wocheStand.art).toBe("woche");
    if (wocheStand.art !== "woche") throw new Error("unreachable");
    expect(zelle(woche, "Zoe", WOCHENZIEL_KOPF_MINUTEN)).toBe(Math.round(wocheStand.zielMin));
    expect(zelle(woche, "Zoe", WOCHENZIEL_KOPF_ERLEDIGT)).toBe(Math.round(wocheStand.geuebtMin));
    // ★ Vorbedingung: die Woche zählt wirklich, und es wurde wirklich geübt -
    // sonst prüfte der Vergleich oben nur zwei Nullen gegeneinander.
    expect(wocheStand.zielwoche).toBe(true);
    expect(wocheStand.geuebtMin).toBeGreaterThan(0);
    expect(zelle(woche, "Ben", WOCHENZIEL_KOPF_MINUTEN)).toBe(OHNE_WERT);
    expect(zelle(woche, "Ben", WOCHENZIEL_KOPF_ERLEDIGT)).toBe(OHNE_WERT);

    for (const art of ["schuljahr", "gesamt"] as const) {
      const name = art === "schuljahr" ? "Schuljahr" : "Gesamt";
      const x = blatt(b, name);
      expect(koepfe(x).slice(4, 6)).toEqual([UEBEZEIT, WOCHENAUFGABEN_KOPF_PROZENT]);
      const stand = wochenzielImZeitraum(zoe.events, ziel, [], { ...ZEITRAUM_START, art }, JETZT);
      expect(stand.art).toBe("prozent");
      if (stand.art !== "prozent") throw new Error("unreachable");
      expect(stand.anteil).not.toBeNull();
      expect(zelle(x, "Zoe", WOCHENAUFGABEN_KOPF_PROZENT)).toBe(Math.round(stand.anteil! * 100));
      expect(zelle(x, "Ben", WOCHENAUFGABEN_KOPF_PROZENT)).toBe(OHNE_WERT);
    }
  });

  it("alphabetisch nach de-AT - „Ärzu“ steht bei A, nicht hinter Z", () => {
    const b = leistungsBlaetter(klasse(), {}, [], JETZT, "3b");
    for (const x of b) expect(x.daten.map((z) => z[0])).toEqual(["Ärzu", "Ben", "Zoe"]);
    // Gegenprobe: Eine blosse Zeichen-Sortierung hätte eine andere Reihenfolge.
    expect(["Zoe", "Ben", "Ärzu"].sort()).not.toEqual(["Ärzu", "Ben", "Zoe"]);
  });

  it("jede Spalte hat eine Breite, in die das längste Wort ihres Kopfes passt (der Kopf bricht um)", () => {
    const b = leistungsBlaetter(klasse({ mitZiel: ["Zoe"] }), {}, [], JETZT, "3b");
    for (const x of b) {
      expect(x.spaltenbreiten).toHaveLength(koepfe(x).length);
      koepfe(x).forEach((kopf, i) => {
        const laengstesWort = Math.max(...kopf.split(/\s+/).map((w) => w.length));
        expect(x.spaltenbreiten[i], kopf).toBeGreaterThanOrEqual(laengstesWort + 2);
      });
    }
  });
});

describe(`★★ ${PRUEFUNG_WORT_MEHRZAHL}: Anzahl und Leistungswert im Schnitt`, () => {
  it("dieselben Werte wie die Spalte „3 / 82“ - in allen vier Blättern", () => {
    const datas = klasse();
    const liste = [ergebnis(1072, 26, 8), ergebnis(818, 27, 9)];
    const u = probenUebersicht(liste);
    expect(u.schnitt, "Vorbedingung: die Challenges sind gewertet").not.toBeNull();
    const b = leistungsBlaetter(datas, { [datas[0].pupil.id]: liste }, [], JETZT, "3b");
    for (const x of b) {
      expect(zelle(x, "Zoe", PRUEFUNG_WORT_MEHRZAHL)).toBe(2);
      expect(zelle(x, "Zoe", SCHNITT)).toBe(u.schnitt);
      expect(zelle(x, "Ben", PRUEFUNG_WORT_MEHRZAHL)).toBe(OHNE_WERT);
    }
  });
});

describe("★★★ Die Datei: Übersicht, Schuljahr, Gesamt, Monat, Woche", () => {
  it("fünf Blätter in dieser Reihenfolge - die Übersicht verlinkt Schuljahr, Gesamt, Monat, Woche", async () => {
    const b = leistungsBlaetter(klasse(), {}, [], JETZT, "3b");
    const { bytes, wb } = await datei(b);
    expect(wb.worksheets.map((w) => w.name)).toEqual([
      UEBERSICHT_BLATT,
      "Schuljahr",
      "Gesamt",
      "Monat",
      "Woche",
    ]);

    // ★ Links mit SheetJS gelesen - so, wie ein Tabellenprogramm springt.
    const gelesen = XLSX.read(bytes, { type: "array" });
    const uebersicht = gelesen.Sheets[UEBERSICHT_BLATT];
    const links = Object.keys(uebersicht)
      .filter((k) => !k.startsWith("!") && uebersicht[k].l)
      .sort((a, c) => XLSX.utils.decode_cell(a).r - XLSX.utils.decode_cell(c).r)
      .map((k) => ({ ziel: uebersicht[k].l!.Target, text: String(uebersicht[k].v) }));
    expect(links.map((l) => l.ziel)).toEqual([
      "#'Schuljahr'!A1",
      "#'Gesamt'!A1",
      "#'Monat'!A1",
      "#'Woche'!A1",
    ]);
    expect(links.map((l) => l.text)).toEqual(b.map((x) => `→ ${x.zeitraumTitel}`));
    // Daneben der Satz, was der Zeitraum umfasst.
    const ws = wb.getWorksheet(UEBERSICHT_BLATT)!;
    for (const x of b) {
      let gefunden = false;
      ws.eachRow((row) => {
        if (row.getCell(2).value === `Blatt „${x.name}“: ${ZEITRAUM_SATZ[x.art]}`) gefunden = true;
      });
      expect(gefunden, x.name).toBe(true);
    }
    // Und jedes Datenblatt führt zurück.
    for (const name of ["Schuljahr", "Gesamt", "Monat", "Woche"]) {
      const s = gelesen.Sheets[name];
      const zurueck = Object.keys(s).filter((k) => !k.startsWith("!") && s[k].l);
      expect(zurueck, name).toHaveLength(1);
      expect(s[zurueck[0]].l!.Target).toBe(`#'${UEBERSICHT_BLATT}'!A1`);
      expect(s[zurueck[0]].v).toBe("← zur Übersicht");
    }
  });

  it("★★★ die Legende nennt JEDE Spaltenüberschrift der Datenblätter - in ihrer Reihenfolge", async () => {
    const b = leistungsBlaetter(klasse({ mitZiel: ["Zoe"] }), {}, [], JETZT, "3b");
    const { wb } = await datei(b);
    const legende = legendeAusDatei(wb.getWorksheet(UEBERSICHT_BLATT)!);
    const namen = legende.map(([n]) => n);
    for (const x of b) {
      // Jede Spalte steht da ...
      for (const kopf of koepfe(x)) expect(namen, `${x.name}: ${kopf}`).toContain(kopf);
      // ... und die Spalten eines Blattes stehen in seiner Reihenfolge.
      const stellen = koepfe(x).map((k) => namen.indexOf(k));
      expect([...stellen].sort((p, q) => p - q), x.name).toEqual(stellen);
    }
    expect(namen).toContain(WOCHENZIEL_KOPF_MINUTEN);
    expect(namen).toContain(WOCHENZIEL_KOPF_ERLEDIGT);
    expect(namen).toContain(WOCHENAUFGABEN_KOPF_PROZENT);
    // Die Gruppen stehen VOR ihren Spalten.
    expect(namen.indexOf("Gruppe „Üben“")).toBe(namen.indexOf(TREFFER) - 1);
    expect(namen.indexOf("Gruppe „Prüfung“")).toBe(namen.indexOf(PRUEFUNG_WORT_MEHRZAHL) - 1);
    // Am Ende: der Strich.
    expect(legende[legende.length - 1]).toEqual([OHNE_WERT, STRICH_SATZ]);
    // Gegenprobe gegen die reine Funktion.
    expect(legende.slice(0, -1)).toEqual(leistungLegende(b).map((e) => [e.name, e.text]));
  });

  it("★★★ die Legende benutzt die Sätze der App - und höchstens EINEN Zusatzsatz", async () => {
    const b = leistungsBlaetter(klasse({ mitZiel: ["Zoe"] }), {}, [], JETZT, "3b");
    const { wb } = await datei(b);
    const text = new Map(legendeAusDatei(wb.getWorksheet(UEBERSICHT_BLATT)!));
    const schuljahr: Zeitraum = { ...ZEITRAUM_START, art: "schuljahr" };
    expect(text.get(STUFE)).toBe(LEISTUNGSSTUFE_HILFE);
    expect(text.get("Tasten sitzen")).toBe(`${TASTEN_HILFE} ${LEGENDE_ZUSATZ.tasten}`);
    expect(text.get(UEBEZEIT)).toBe(`${UEBEZEIT_HILFE} ${LEGENDE_ZUSATZ.uebezeit}`);
    expect(text.get(WOCHENAUFGABEN_KOPF_PROZENT)).toBe(
      `${wochenzielHilfe(schuljahr)} ${LEGENDE_ZUSATZ.wochenaufgaben}`,
    );
    expect(text.get(WOCHENZIEL_KOPF_MINUTEN)).toBe(
      `${wochenzielHilfe(ZEITRAUM_START)} ${LEGENDE_ZUSATZ.wochenzielWoche}`,
    );
    expect(text.get(WOCHENZIEL_KOPF_ERLEDIGT)).toBe(
      `Die zweite Zahl zu „${WOCHENZIEL_KOPF_MINUTEN}“ - siehe dort.`,
    );
    expect(text.get(TREFFER)).toBe(`${spaltenGrund("treffer")} ${LEGENDE_ZUSATZ.ohneVeraenderung}`);
    expect(text.get(TEMPO)).toBe(`${spaltenGrund("tempo")} ${LEGENDE_ZUSATZ.ohneVeraenderung}`);
    expect(text.get("Score")).toBe(`${spaltenGrund("score")} ${LEGENDE_ZUSATZ.ohneVeraenderung}`);
    expect(text.get(PRUEFUNG_WORT_MEHRZAHL)).toBe(
      `${HINWEIS_CHALLENGE.spalte} ${LEGENDE_ZUSATZ.challenges}`,
    );
    expect(text.get("Gruppe „Üben“")).toBe(UEBEN_GRUPPE_HILFE);
    expect(text.get("Gruppe „Prüfung“")).toBe(PRUEFUNG_GRUPPE_HILFE);
    // „EIN kurzer Zusatzsatz": je Zusatz genau ein Satz.
    for (const [name, zusatz] of Object.entries(LEGENDE_ZUSATZ)) {
      expect(zusatz.split(/(?<=[.!?])\s+/), name).toHaveLength(1);
      expect(zusatz.length, name).toBeLessThan(160);
    }
    expect(KOPF_CHALLENGE_SCHNITT).toBe(SCHNITT);
  });

  it("★★ „So wird der Score berechnet“ - das Beispiel stimmt mit der Rechnung überein", async () => {
    const { wb } = await datei(leistungsBlaetter(klasse(), {}, [], JETZT, "3b"));
    const ws = wb.getWorksheet(UEBERSICHT_BLATT)!;
    const zeilen = new Map<string, string>();
    ws.eachRow((row) => zeilen.set(String(row.getCell(1).value), String(row.getCell(2).value ?? "")));
    expect([...zeilen.keys()]).toContain("So wird der Score berechnet");
    const beispiel = zeilen.get("Beispiel")!;
    const bsp = { zeichen: 1000, fehler: 10, anschlaegeProMin: 135 };
    const score = scoreAusWerten(bsp).wert!;
    expect(beispiel).toContain(`Score = 100 × 0,95 × 0,75 = ${Math.round(score)}.`);
    expect(Math.round(score)).toBe(Math.round(werte({ zeichen: 1000, fehler: 10, anschlaege: 135 }).wert));
    expect(zeilen.get("1. Güte")).toContain("Zeichen + 5 × Fehlgriffe");
    expect(zeilen.get("2. Tempo-Anteil")).toContain("geteilt durch 240");
    expect(zeilen.get("Zu wenig Text")).toContain("Unter 200 geschriebenen Zeichen");
  });

  it("★★★ jedes Blatt trägt in Zeile 1 das Zeichen und „Tastenflow“ - dann Titel und Datum", async () => {
    const b = leistungsBlaetter(klasse(), {}, [], JETZT, "3b");
    const { wb } = await datei(b);
    for (const ws of wb.worksheets) {
      expect(ws.getCell("A1").value, ws.name).toBe("Tastenflow");
      const bilder = ws.getImages();
      expect(bilder, ws.name).toHaveLength(1);
      expect(bilder[0].range.tl.nativeRow, ws.name).toBe(0);
      expect(bilder[0].range.tl.nativeCol, ws.name).toBe(0);
    }
    expect(wb.getWorksheet(UEBERSICHT_BLATT)!.getCell("A2").value).toBe("Leistungstabelle - Klasse 3b");
    expect(wb.getWorksheet(UEBERSICHT_BLATT)!.getCell("A3").value).toBe("Erstellt am 12.09.2026");
    for (const x of b) {
      const ws = wb.getWorksheet(x.name)!;
      expect(ws.getCell("A2").value).toBe(x.titel);
      expect(ws.getCell("A3").value).toBe("Erstellt am 12.09.2026");
    }
  });

  it("★★ Datenblatt: Gruppen, Köpfe, Formate, Striche, Fixierung, Filter, Druck", async () => {
    const b = leistungsBlaetter(klasse(), {}, [], JETZT, "3b");
    const { wb } = await datei(b);
    const x = blatt(b, "Woche");
    const ws = wb.getWorksheet("Woche")!;
    const spalteVon = (kopf: string) => koepfe(x).indexOf(kopf) + 1;

    // Zeile 5: die Gruppen - „Üben" über Treffsicherheit bis Score.
    expect(ws.getCell(5, 1).value).toBe("Person");
    expect(ws.getCell(5, spalteVon(STUFE)).value).toBe("Stand und Übezeit");
    expect(ws.getCell(5, spalteVon(TREFFER)).value).toBe("Üben");
    expect(ws.getCell(5, spalteVon("Score")).isMerged).toBe(true);
    expect(ws.getCell(5, spalteVon(PRUEFUNG_WORT_MEHRZAHL)).value).toBe("Prüfung");
    // Zeile 6: die Spaltenköpfe - Akzentgrund, weiss, fett.
    koepfe(x).forEach((kopf, i) => expect(ws.getCell(6, i + 1).value).toBe(kopf));
    const kopf = ws.getCell(6, 2);
    expect((kopf.fill as ExcelJS.FillPattern).fgColor?.argb).toBe("FF0066CC");
    expect(kopf.font?.color?.argb).toBe("FFFFFFFF");
    expect(kopf.font?.bold).toBe(true);
    expect(kopf.alignment?.wrapText).toBe(true);
    // Ab Zeile 7 die Kinder.
    expect([7, 8, 9].map((z) => ws.getCell(z, 1).value)).toEqual(["Ärzu", "Ben", "Zoe"]);
    const zoeTreffer = ws.getCell(9, spalteVon(TREFFER));
    expect(zoeTreffer.value).toBe(zelle(x, "Zoe", TREFFER));
    expect(typeof zoeTreffer.value).toBe("number");
    expect(zoeTreffer.numFmt).toBe('0" %"');
    expect(ws.getCell(9, spalteVon(UEBEZEIT)).numFmt).toBe("0.0");
    expect(ws.getCell(9, spalteVon("Score")).numFmt).toBe("0");
    // „Üben" auch in den Datenzeilen getönt.
    expect((ws.getCell(9, spalteVon("Score")).fill as ExcelJS.FillPattern).fgColor?.argb).toMatch(
      /^FF(E8F1FC|F4F8FD)$/,
    );
    // Ben: Striche, zentriert, gedämpft.
    const strich = ws.getCell(8, spalteVon(TREFFER));
    expect(strich.value).toBe(OHNE_WERT);
    expect(strich.alignment?.horizontal).toBe("center");
    expect(strich.font?.color?.argb).toBe("FF6E6E73");

    expect(ws.views[0]).toMatchObject({ state: "frozen", xSplit: 1, ySplit: 6 });
    expect(String(ws.autoFilter ?? "")).toMatch(/^A6:/);
    expect(ws.pageSetup.orientation).toBe("landscape");
    expect(ws.pageSetup.fitToWidth).toBe(1);
  });

  it("★ Hausregeln in jeder Zelle: nur Bindestrich, keine Maus-Wörter", async () => {
    const { wb } = await datei(leistungsBlaetter(klasse({ mitZiel: ["Zoe"] }), {}, [], JETZT, "3b"));
    const texte = alleTexte(wb);
    expect(texte.length).toBeGreaterThan(40);
    for (const t of texte) {
      expect(t, t).not.toMatch(/[–—]/);
      expect(t, t).not.toMatch(/klick|Maus/i);
    }
  });
});

describe("★★ Dateiname und Titel", () => {
  it("Klassenname_JJJJ-MM-TT.xlsx", () => {
    expect(leistungDateiname("3a", JETZT)).toBe("3a_2026-09-12.xlsx");
  });

  it("Zeichen, die Dateisysteme ablehnen, werden zu „-“", () => {
    expect(leistungDateiname('3a/b: "Neu"?', JETZT)).toBe("3a-b- -Neu--_2026-09-12.xlsx");
    expect(leistungDateiname("a<b>c|d*e\\f", JETZT)).toBe("a-b-c-d-e-f_2026-09-12.xlsx");
  });

  it("ohne Klassennamen heisst die Datei „Klasse“", () => {
    expect(leistungDateiname(undefined, JETZT)).toBe("Klasse_2026-09-12.xlsx");
    expect(leistungDateiname("   ", JETZT)).toBe("Klasse_2026-09-12.xlsx");
  });

  it("kurz nach Mitternacht gilt das Datum der Ortszeit, nicht UTC", () => {
    expect(leistungDateiname("3a", new Date(2026, 8, 13, 0, 30).getTime())).toBe(
      "3a_2026-09-13.xlsx",
    );
  });

  it("„Klasse“ steht im Titel nicht doppelt, und ohne Namen steht es allein", () => {
    const datas = klasse();
    expect(leistungsBlaetter(datas, {}, [], JETZT, "Klasse 3a")[1].titel).toBe(
      "Klasse 3a - Gesamt",
    );
    expect(leistungsBlaetter(datas, {}, [], JETZT, undefined)[1].titel).toBe("Klasse - Gesamt");
  });
});
