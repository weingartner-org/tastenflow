/**
 * ★★★ DEUTSCH-FÄNGER FÜR DIE KLASSEN-ANSICHT DER LEHRKRAFT (EN6a, 19.09.2026).
 *
 * Bereich: „Meine Klassen" → Tastenflow, die ANSICHT (`TastenflowReiter.tsx`)
 * samt allem, was sie selbst beschriftet: die Aufgaben-Zeile mit ihren
 * Ständen, „Wochenziel - Aufgabe" mit BEIDEN Rückfragen (je Kind und für die
 * Klasse), „Einstellungen der Klasse" samt der Rückfrage zum Startniveau,
 * „Stunde sperren" während die Pause läuft, die Tabelle in Woche, Monat,
 * Schuljahr und Gesamt (jeder Spaltenkopf mit Hinweis, die unsichtbaren Sätze
 * der Zellen, die Pfeile), die aufgeklappte Zeile mit ALLEN Zeilen offen, der
 * Klassenüberblick in „Monat" und „Schuljahr" samt Liniendiagramm, die
 * Rückmeldungen in der Statuszeile, die Rückfragen über `window.confirm`,
 * der Warnkasten beim Lesefehler, die Zahlen-Hilfe - und die englische
 * Excel-Mappe.
 *
 * Gemessen wird am gerenderten DOM (`tests/helfer/deutschFaenger.ts`): an
 * einem Abzug der Ansicht (dazu die Hinweise, die per Portal unter `<body>`
 * hängen) und an jedem offenen Fenster.
 *
 * ★★ WAS AUSGENOMMEN IST, UND WARUM: der INHALT der beiden Panels
 * „Tippchallenge" und „Eigene Übung" (`SchreibprobeKasten`,
 * `EigeneUebungKasten`). Sie gehören Etappe EN6b und stehen in deren Fänger
 * (`tests/tastenflow-englisch-lehrkraft.test.tsx`); ihre Überschrift und der
 * Schalter, der sie öffnet, gehören dieser Ansicht und werden gelesen.
 *
 * ★★★ DIE GEGENPROBE: derselbe Durchgang in der deutschen Bedienung muss
 * VIELE Funde liefern - ein Fänger, der nichts findet, weil er nichts liest,
 * sähe sonst genauso grün aus.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import type { ReactNode } from "react";
import ExcelJS from "exceljs";

import { BedienSpracheProvider } from "../src/lib/bedienSprache";

/** ★ E11a-5: dieser Test prüft nur Deutsch und Englisch - „fr" hat seinen eigenen (`tastenflow-franzoesisch-meine-klassen`). */
type AktiveBedienSprache = "de" | "en";
import {
  TastenflowReiter,
  eigenstaendigkeitsGrundEn,
  leistungsBlaetter,
} from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import {
  DreiWerteHilfe,
  LeistungsstufeHilfe,
  SpaltenHilfe,
} from "@/components/typing/TastenflowZahlenHilfe";
import type { PupilData } from "@/components/typing/PupilStatsPanel";
import {
  computePupilStats,
  emptyProgress,
  saveAccountProgress,
  recordEvent,
  suspicionScore,
  typingBackend,
  werteAus,
  type LetterStat,
  type Probenergebnis,
  type TaskEvent,
  type TypingAccount,
  type TypingClass,
} from "@/lib/typing";
import { addPupil, createClass, getClass, listPupils, registerTeacher } from "@/lib/typing/account";
import { isoWeekKey } from "@/lib/typing/goals";
import { leistungDateiBytes } from "@/lib/typing/leistungExport";
import { deutscheWoerter, findeDeutsch } from "./helfer/deutschFaenger";

// ── Die Zeit steht: Mittwoch, 16.09.2026, 10:00 - die laufende Woche ist die
//    vom Montag 14.09., 8:00 (W38); das Schuljahr begann am 01.08. ────────────
const JETZT = new Date(2026, 8, 16, 10, 0, 0).getTime();
const tag = (mon: number, t: number, std = 10) => new Date(2026, mon - 1, t, std, 0, 0).getTime();

const GRUNDREIHE = ["f", "j", "d", "k", "s", "l", "a", "ö", "e", "n"];

/** Bedienung gewählt - so, wie der Sprachschalter oder `?bedienung=…` es tut. */
function stelleBedienung(sprache: AktiveBedienSprache) {
  localStorage.setItem("tastenflow-bedienung", sprache);
}

function zeige(knoten: ReactNode) {
  return render(<BedienSpracheProvider>{knoten}</BedienSpracheProvider>);
}

/** Einzelne Tastenzeichen der deutschen Tastatur (ö) sind kein deutsches Wort. */
function nurTastenzeichen(fund: string): boolean {
  const woerter = fund.match(/\[([^\]]*)\]$/)?.[1]?.split(", ") ?? [];
  return woerter.length > 0 && woerter.every((w) => [...w].length === 1);
}

/** Die Panels, deren INHALT Etappe EN6b gehört (siehe Kopf). */
const FREMDE_PANELS = ["mk-tf-panel-tippchallenge", "mk-tf-panel-eigene-uebung"];

/**
 * Was der Fänger in diesem Augenblick findet: ein Abzug der Ansicht ohne den
 * Inhalt der fremden Panels (ihre Überschrift bleibt), dazu jedes offene
 * Fenster. Die Hinweise per Portal holt `findeDeutsch` über ihre Marke.
 */
function fange(ansicht: HTMLElement): string[] {
  const abzug = ansicht.cloneNode(true) as HTMLElement;
  for (const id of FREMDE_PANELS) {
    const panel = abzug.querySelector(`#${id}`);
    if (panel) for (const kind of [...panel.children]) if (kind.tagName !== "H3") kind.remove();
  }
  const funde = new Set(findeDeutsch(abzug));
  for (const fenster of document.querySelectorAll('[role="dialog"]'))
    for (const f of findeDeutsch(fenster)) funde.add(f);
  return [...funde].filter((f) => !nurTastenzeichen(f));
}

// ── Die Klasse: vier Kinder, die zusammen jede Form der Zellen zeigen ─────────

function uebung(ts: number, extra: Partial<TaskEvent> = {}): TaskEvent {
  const ms = 4 * 60_000;
  return { ts, lesson: "adaptiv", chars: 300, errors: 6, ms, activeMs: ms, ...extra };
}

function wackligeTasten(): Record<string, LetterStat> {
  const gut: Record<string, LetterStat> = {};
  for (const c of ["f", "j", "d", "k", "s", "l"]) gut[c] = { hits: 20, misses: 0, sumMs: 20 * 450, timed: 20 };
  return {
    ...gut,
    ö: { hits: 4, misses: 6, sumMs: 6 * 600, timed: 6 },
    a: { hits: 6, misses: 4, sumMs: 4 * 500, timed: 4 },
  };
}

function probe(t: number): Probenergebnis {
  const beginn = tag(9, t);
  return werteAus({
    probeId: `sp-${t}`,
    niveau: "buchstaben",
    textNr: 0,
    textTitel: "Der Igel",
    beginnMs: beginn,
    endeMs: beginn + 5 * 60_000,
    zeitMs: 5 * 60_000,
    zuschlagProzent: 0,
    wartezeitMs: 0,
    zeichen: 400,
    fehler: 10,
    zeilen: 20,
    schreibMs: 5 * 60_000,
    anschlaege: [],
    layout: "de",
    textZuEnde: false,
    frueherAbgegeben: false,
  });
}

interface Klasse {
  kinder: TypingAccount[];
  cls: TypingClass;
  lehrkraftId: string;
}

/** Mias Kennung - für die Klassenmatch-Anzahl, die der Server liefern würde. */
let miaId = "";

async function baueKlasse(): Promise<Klasse> {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  for (const name of ["Mia", "Ben", "Cem", "Dana"]) {
    const p = addPupil(c.value.code, name, "pw1234");
    if (!p.ok) throw new Error(p.error);
  }
  const kinder = listPupils(c.value.code);
  const kind = (name: string) => kinder.find((k) => k.name === name)!;

  // Mia: vor dem Schuljahr, in fünf Wochen des Schuljahres (eine davon
  // erlassen), zweimal eingefügt und einmal mit Programm-Tasten; Wochenziel
  // mit Nachholen, zurückgesetzt, eine anstehende Änderung; wacklige Tasten,
  // ein Abzeichen, eine Tippchallenge.
  const mia = kind("Mia");
  miaId = mia.id;
  for (let i = 0; i < 3; i++) recordEvent(mia.id, uebung(tag(6, 10) + i * 60_000));
  for (const [m, t, n] of [
    [8, 11, 5],
    [8, 18, 5],
    [9, 1, 6],
    [9, 8, 6],
  ] as const)
    for (let i = 0; i < n; i++) recordEvent(mia.id, uebung(tag(m, t) + i * 60_000, { errors: 4 + i }));
  for (let i = 0; i < 6; i++)
    recordEvent(
      mia.id,
      uebung(tag(9, 15) + i * 60_000, {
        errors: 2,
        pasted: i < 2,
        unechteTasten: i === 5 ? 3 : undefined,
      }),
    );
  mia.wochenzielVerlauf = [
    { ab: "2026-W33", minuten: 30 },
    { ab: "2026-W39", minuten: 45 },
  ];
  mia.goalCatchUp = true;
  mia.goalExcusedWeeks = ["2026-W36"];
  mia.goalResetWeek = "2026-W34";
  saveAccountProgress(mia.id, {
    ...emptyProgress(),
    introduced: GRUNDREIHE,
    letters: wackligeTasten(),
    badges: { "tasten-kueken": tag(9, 1) },
  });
  await typingBackend().speichereProbenergebnis(mia, probe(8));

  // Ben: zu wenig für den Check, kein Ziel.
  const ben = kind("Ben");
  for (let i = 0; i < 3; i++) recordEvent(ben.id, uebung(tag(9, 15, 11) + i * 60_000));
  saveAccountProgress(ben.id, { ...emptyProgress(), introduced: GRUNDREIHE });

  // Cem: oft das Fenster gewechselt; Ziel erst ab W37.
  const cem = kind("Cem");
  for (let i = 0; i < 2; i++) recordEvent(cem.id, uebung(tag(9, 1, 12) + i * 60_000));
  for (let i = 0; i < 4; i++)
    recordEvent(cem.id, uebung(tag(9, 15, 12) + i * 60_000, { blurred: i < 3 }));
  cem.wochenzielVerlauf = [{ ab: "2026-W37", minuten: 20 }];
  saveAccountProgress(cem.id, { ...emptyProgress(), introduced: GRUNDREIHE });

  // Dana: noch nie geübt.
  return { kinder, cls: getClass(c.value.code)!, lehrkraftId: t.value.id };
}

// ── Die Wörter der Knöpfe, auf die der Durchgang drückt ─────────────────────

const K = {
  de: {
    tabelle: /Lernende der Klasse/,
    woche: /^Woche( |$)/,
    monat: (n: string) => n === "Monat" || /^Monat \d/.test(n),
    schuljahr: /^Schuljahr \d/,
    gesamt: "Gesamt",
    vorige: /^(vorige Woche|voriger Monat|voriges Schuljahr) in der Tabelle$/,
    ueberblickSchuljahr: "Schuljahr im Klassenüberblick",
    ueberblickMonat: "Monat im Klassenüberblick",
    wochenziel: /^Wochenziel/,
    wochenzielRegion: "Wochenziel",
    minuten: "Minuten pro Woche",
    fuerKlasse: "Für die Klasse übernehmen",
    abbrechen: "Abbrechen",
    uebernehmen: "Übernehmen",
    einstellungenKlasse: /^Einstellungen der Klasse/,
    einstellungenRegion: "Einstellungen der Klasse",
    schulstufe: "Schulstufe der Klasse 3b",
    startniveau: "Startniveau für alle Kinder der Klasse 3b",
    sperren: "Sprache der Klasse 3b sperren",
    stundeSperren: "Stunde sperren",
    ausklappen: (n: string) => `Einstellungen und Auswertung von ${n} ausklappen`,
    speichern: "Speichern",
    ueberfaellig: "Überfällige zurücksetzen",
    womit: (n: string) => `Womit ${n} anfängt`,
    erlassen: /^Erlassene Wochen:/,
    zielwochen: /^Ziel-Kalenderwochen:/,
    excel: "Als Excel herunterladen",
  },
  en: {
    tabelle: /Pupils in the class/,
    woche: /^Week( |$)/,
    monat: (n: string) => n === "Month" || /^Month \d/.test(n),
    schuljahr: /^School year \d/,
    gesamt: "All time",
    vorige: /^previous (week|month|school year) in the table$/,
    ueberblickSchuljahr: "School year in the class overview",
    ueberblickMonat: "Month in the class overview",
    wochenziel: /^Weekly goal/,
    wochenzielRegion: "Weekly goal",
    minuten: "Minutes per week",
    fuerKlasse: "Apply to the class",
    abbrechen: "Cancel",
    uebernehmen: "Apply",
    einstellungenKlasse: /^Class settings/,
    einstellungenRegion: "Class settings",
    schulstufe: "Year group for class 3b",
    startniveau: "Starting point for all pupils in class 3b",
    sperren: "Lock the language for class 3b",
    stundeSperren: "Pause goal for 1 hour",
    ausklappen: (n: string) => `Expand settings and results for ${n}`,
    speichern: "Save",
    ueberfaellig: "Clear overdue minutes",
    womit: (n: string) => `Where ${n} starts`,
    erlassen: /^Excused weeks:/,
    zielwochen: /^Goal weeks:/,
    excel: "Download as Excel",
  },
} as const;

/** Der Knopf mit genau diesem Namen (Text, RegExp oder Prüfung). */
function knopf(name: string | RegExp | ((n: string) => boolean), wo: HTMLElement = document.body) {
  const alle = within(wo).getAllByRole("button");
  const passt = (n: string) =>
    typeof name === "string" ? n === name : name instanceof RegExp ? name.test(n) : name(n);
  const treffer = alle.filter((b) => passt((b.getAttribute("aria-label") ?? b.textContent ?? "").trim()));
  if (treffer.length === 0) throw new Error(`Kein Knopf „${String(name)}"`);
  return treffer[0];
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(JETZT);
  // Die Klassenmatch-Anzahl kommt am Server aus `tt_match_verlauf` - hier
  // zwei Matches für Mia in der laufenden Woche.
  vi.spyOn(typingBackend(), "klassenmatchAnzahl").mockImplementation(async () =>
    miaId ? { [miaId]: { [isoWeekKey(new Date(2026, 8, 14, 8, 0).getTime())]: 2 } } : {},
  );
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/**
 * ★★★ DER DURCHGANG - einmal durch jeden Zustand der Ansicht, in der
 * gewählten Sprache. Liefert alle Funde (vereinigt über alle Zustände) und
 * die Texte, die über `window.confirm` gefragt wurden.
 */
async function durchgang(sprache: AktiveBedienSprache): Promise<{ funde: string[]; gefragt: string[] }> {
  stelleBedienung(sprache);
  const k = K[sprache];
  const { kinder, cls, lehrkraftId } = await baueKlasse();
  const gefragt: string[] = [];
  vi.spyOn(window, "confirm").mockImplementation((satz?: string) => {
    gefragt.push(String(satz));
    return false;
  });

  const { container } = zeige(
    <TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={lehrkraftId} />,
  );
  await screen.findByRole("table", { name: k.tabelle });
  const alle = new Set<string>();
  const merke = () => {
    for (const f of fange(container)) alle.add(f);
  };

  // ── 1 · Die Tabelle in allen vier Zeiträumen (Schuljahr ist vorgewählt) ──
  merke();
  fireEvent.click(knopf(k.woche));
  merke();
  fireEvent.click(knopf(k.vorige)); // Woche 07.09.
  fireEvent.click(knopf(k.vorige)); // Woche 31.08. - bei Mia erlassen, bei Cem keine Ziel-Woche
  merke();
  fireEvent.click(knopf(k.monat));
  merke();
  fireEvent.click(knopf(k.gesamt));
  merke();
  fireEvent.click(knopf(k.schuljahr));

  // ── 2 · Der Klassenüberblick in „Schuljahr" (Monat ist vorgewählt) ──
  fireEvent.click(knopf(k.ueberblickSchuljahr));
  merke();
  fireEvent.click(knopf(k.ueberblickMonat));

  // ── 3 · „Wochenziel - Aufgabe" mit der Rückfrage für die Klasse ──
  fireEvent.click(knopf(k.wochenziel));
  const wochenziel = screen.getByRole("region", { name: k.wochenzielRegion });
  merke(); // leer: „Minuten pro Woche zuerst eintragen"
  fireEvent.change(within(wochenziel).getByLabelText(k.minuten), { target: { value: "60" } });
  fireEvent.click(knopf(k.zielwochen, wochenziel));
  merke(); // Hinweis mit Minuten, Wochenauswahl offen
  fireEvent.click(knopf(k.zielwochen, wochenziel));
  fireEvent.click(knopf(k.fuerKlasse, wochenziel));
  expect(screen.getByRole("dialog")).toBeTruthy();
  merke();
  // Erst abbrechen: Die Ziele dieses Aufbaus stehen nur an den Konto-Objekten
  // im Speicher (nicht im Mock-Speicher) - „Übernehmen" lädt die Konten neu,
  // und die Rückfragen je Kind (Schritt 6) brauchen Mias Ziel. Übernommen
  // wird in Schritt 7.
  fireEvent.click(knopf(k.abbrechen, screen.getByRole("dialog")));

  // ── 4 · „Einstellungen der Klasse" samt Rückfrage zum Startniveau ──
  fireEvent.click(knopf(k.einstellungenKlasse));
  const einstellungen = screen.getByRole("region", { name: k.einstellungenRegion });
  merke();
  await act(async () => {
    fireEvent.change(within(einstellungen).getByLabelText(k.schulstufe), { target: { value: "7" } });
  });
  merke();
  await act(async () => {
    fireEvent.click(knopf(k.sperren, einstellungen));
  });
  merke();
  const start = within(einstellungen).getByLabelText(k.startniveau) as HTMLSelectElement;
  await act(async () => {
    fireEvent.change(start, { target: { value: start.options[1].value } });
  });
  expect(screen.getByRole("dialog")).toBeTruthy();
  merke();
  fireEvent.click(knopf(k.abbrechen, screen.getByRole("dialog")));

  // ── 5 · „Stunde sperren" - die Pause läuft ──
  await act(async () => {
    fireEvent.click(knopf(k.stundeSperren));
  });
  await waitFor(() => expect(() => knopf(k.stundeSperren)).toThrow());
  merke();

  // ── 6 · Die aufgeklappte Zeile von Mia und Cem, jede Zeile offen ──
  for (const name of ["Mia", "Cem"]) {
    await act(async () => {
      fireEvent.click(knopf(k.ausklappen(name)));
    });
  }
  for (const d of container.querySelectorAll("details")) (d as HTMLDetailsElement).open = true;
  merke();
  const zeileMia = screen.getByLabelText(k.womit("Mia")).closest("td") as HTMLElement;
  // Die Wochenauswahlen offen.
  fireEvent.click(knopf(k.erlassen, zeileMia));
  fireEvent.click(knopf(k.zielwochen, zeileMia));
  merke();
  fireEvent.click(knopf(k.zielwochen, zeileMia));
  fireEvent.click(knopf(k.erlassen, zeileMia));
  // „Speichern" ohne Änderung ⇒ die Rückmeldung, mit Änderung ⇒ die Rückfrage.
  fireEvent.click(knopf(k.speichern, zeileMia));
  merke();
  fireEvent.change(within(zeileMia).getByLabelText(k.minuten), { target: { value: "0" } });
  fireEvent.click(knopf(k.speichern, zeileMia));
  merke();
  fireEvent.click(knopf(k.abbrechen, screen.getByRole("dialog")));
  fireEvent.change(within(zeileMia).getByLabelText(k.minuten), { target: { value: "40" } });
  fireEvent.click(knopf(k.speichern, zeileMia));
  merke();
  await act(async () => {
    fireEvent.click(knopf(k.uebernehmen, screen.getByRole("dialog")));
  });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  merke();
  // Zurückstufen und Überfälliges - Rückfragen über `window.confirm`.
  fireEvent.change(screen.getByLabelText(k.womit("Mia")), { target: { value: "2" } });
  fireEvent.click(knopf(k.ueberfaellig, zeileMia));
  merke();

  // ── 7 · Jetzt „Für die Klasse übernehmen" wirklich - die Rückmeldung ──
  fireEvent.click(knopf(k.wochenziel));
  const wochenzielWieder = screen.getByRole("region", { name: k.wochenzielRegion });
  fireEvent.click(knopf(k.fuerKlasse, wochenzielWieder));
  await act(async () => {
    fireEvent.click(knopf(k.uebernehmen, screen.getByRole("dialog")));
  });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  merke(); // „Weekly goal of 60 minutes saved for 4 of 4 pupils …"

  // ── 8 · Excel ──
  URL.createObjectURL = vi.fn(() => "blob:leistung");
  URL.revokeObjectURL = vi.fn();
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  await act(async () => {
    fireEvent.click(knopf(k.excel));
  });
  await waitFor(
    () =>
      expect(
        [...container.querySelectorAll('[role="status"]')].some((s) => /\.xlsx/.test(s.textContent ?? "")),
      ).toBe(true),
    { timeout: 15000 },
  );
  merke();

  return { funde: [...alle], gefragt };
}

describe("★★★ EN6a · Die Klassen-Ansicht der Lehrkraft englisch", () => {
  it(
    "jeder Zustand der Ansicht: kein deutsches Wort (Tabelle, Aufgaben-Zeile, Fenster, Rückfragen, Excel-Meldung)",
    async () => {
      const { funde, gefragt } = await durchgang("en");
      expect(funde).toEqual([]);
      // Die Rückfragen über `window.confirm`: Zurückstufen und Überfälliges.
      expect(gefragt).toHaveLength(2);
      // Ein einzelnes „ö" ist eine Taste der deutschen Tastatur, kein Wort
      // (Glossar §7) - es steht im Namen des Startpunkts „Home position (… ö)".
      for (const satz of gefragt)
        expect(deutscheWoerter(satz).filter((w) => [...w].length > 1), satz).toEqual([]);
      expect(gefragt[0]).toMatch(/^Mia is at “.+”\.\n\nReally move Mia back to “.+”\?/);
      expect(gefragt[1]).toMatch(/^Clear Mia's overdue minutes\?/);
    },
    40000,
  );

  it(
    "★★★ GEGENPROBE: derselbe Durchgang deutsch liefert viele Funde",
    async () => {
      const { funde, gefragt } = await durchgang("de");
      expect(funde.length).toBeGreaterThan(80);
      expect(gefragt.every((s) => deutscheWoerter(s).length > 3)).toBe(true);
    },
    40000,
  );

  it("die Wörter stimmen mit dem Glossar und dem Handbuch überein", async () => {
    stelleBedienung("en");
    const { kinder, cls, lehrkraftId } = await baueKlasse();
    zeige(<TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={lehrkraftId} />);
    await screen.findByRole("table", { name: /Pupils in the class/ });
    // Glossar §3.15 / Handbuch `L`: die Knöpfe heissen, wie das Handbuch sie nennt.
    for (const name of [
      "Pause goal for 1 hour",
      "Download as Excel",
      "Month in the class overview",
      "Expand settings and results for Mia",
    ])
      expect(() => knopf(name), name).not.toThrow();
    expect(knopf(/^Class settings/)).toBeTruthy();
    expect(knopf(/^Custom exercise · not assigned$/)).toBeTruthy();
    expect(knopf(/^Weekly goal · set$/)).toBeTruthy();
    // Die Spaltenköpfe (Glossar §3.2, §3.8).
    const koepfe = screen.getAllByRole("columnheader").map((th) => th.textContent?.trim());
    for (const kopf of [
      "Name",
      "Difficulty level",
      "Keys",
      "Practice time",
      "Weekly goals",
      "Accuracy",
      "Keystrokes/min",
      "Score",
      "Typing Challenge",
      "Class Match",
      "Practice",
      "Challenge",
    ])
      expect(koepfe.some((k) => k?.startsWith(kopf)), kopf).toBe(true);
    // Der Klassenüberblick: „avg" statt „⌀" (⌀ ist im Englischen kein Wort).
    const ueberblick = screen.getByRole("region", { name: "Class overview" });
    expect(ueberblick.textContent).not.toMatch(/⌀/);
  });

  it("der Warnkasten beim Lesefehler", async () => {
    stelleBedienung("en");
    const { kinder, cls, lehrkraftId } = await baueKlasse();
    const ben = kinder.find((k) => k.name === "Ben")!;
    const echt = typingBackend().getEvents.bind(typingBackend());
    vi.spyOn(typingBackend(), "getEvents").mockImplementation(async (id: string) => {
      if (id === ben.id) throw new Error("abgewiesen");
      return echt(id);
    });
    const { container } = zeige(
      <TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={lehrkraftId} />,
    );
    const warnung = await screen.findByRole("alert");
    expect(warnung.textContent).toMatch(/^The progress could not be read for Ben\. .* do not mean that no practice took place\./);
    expect(fange(container)).toEqual([]);
  });

  it("„Lädt …\" englisch, solange der Stand noch unterwegs ist", async () => {
    stelleBedienung("en");
    const { kinder } = await baueKlasse();
    vi.spyOn(typingBackend(), "getProgress").mockImplementation(() => new Promise(() => {}));
    const { container } = zeige(<TastenflowReiter pupils={kinder} onChanged={() => {}} />);
    expect(screen.getByRole("status").textContent).toBe("Loading …");
    expect(fange(container)).toEqual([]);
  });
});

/**
 * ★★★ M3 (19.09.2026): der Klassenmatch-Zähler und die einzelnen Übungszeiten
 * je Woche in „Übungszeiten" - beide Sprachen, mit den Hinweisen. Der
 * Durchgang oben liest sie schon mit (alle `<details>` offen); hier steht
 * AUSDRÜCKLICH, dass die neuen Sätze dabei waren - und die Gegenprobe, dass
 * dieselben Stellen deutsch wirklich deutsch sind.
 */
describe("★★★ M3 · Zähler und einzelne Übungszeiten englisch", () => {
  async function uebungszeitenVonMia(sprache: AktiveBedienSprache) {
    stelleBedienung(sprache);
    const k = K[sprache];
    const { kinder, cls, lehrkraftId } = await baueKlasse();
    const { container } = zeige(
      <TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={lehrkraftId} />,
    );
    await screen.findByRole("table", { name: k.tabelle });
    await act(async () => {
      fireEvent.click(knopf(k.ausklappen("Mia")));
    });
    const zelle = screen.getByLabelText(k.womit("Mia")).closest("td") as HTMLElement;
    for (const d of zelle.querySelectorAll("details")) (d as HTMLDetailsElement).open = true;
    const titel = sprache === "en" ? "Practice times" : "Übungszeiten";
    const zeile = [...zelle.querySelectorAll("details")].find((d) =>
      (d.querySelector("summary")?.textContent ?? "").replace(/^▸/, "").trim().startsWith(titel),
    ) as HTMLDetailsElement;
    // Der Zähler erscheint, sobald die Anzahl geladen ist.
    await waitFor(() => expect(zeile.querySelector(":scope > div > p")).not.toBeNull());
    const zaehler = zeile.querySelector(":scope > div > p [aria-describedby]") as HTMLElement;
    const hinweis = (el: Element | null) =>
      document.getElementById(el?.getAttribute("aria-describedby") ?? "")?.textContent ?? "";
    // Die Woche ab 14.09. (die jüngste) und ihr Hinweis (per Portal unter <body>).
    const woche = zeile.querySelector(":scope > div > ul > li") as HTMLElement;
    const wochenFlaeche = woche.querySelector("summary > span:not([aria-hidden])") as HTMLElement;
    fireEvent.mouseEnter(wochenFlaeche);
    const wochenHinweis = [...document.querySelectorAll('[role="tooltip"]')]
      .map((t) => t.textContent ?? "")
      .find((t) => /Übungszeit dieser Woche|practice time in this week/.test(t)) ?? "";
    return {
      container,
      summary: (zeile.querySelector("summary")?.textContent ?? "").replace(/^▸/, "").replace(/\s+/g, " ").trim(),
      zaehler: zaehler.firstElementChild?.textContent?.trim() ?? "",
      zaehlerHinweis: hinweis(zaehler),
      sitzungen: [...woche.querySelectorAll("details > ul > li")].map((li) =>
        (li.textContent ?? "").replace(/\s+/g, " ").trim(),
      ),
      wochenHinweis,
    };
  }

  it("englisch: der Zähler, die Übungszeit der Woche und beide Hinweise - kein deutsches Wort", async () => {
    const m = await uebungszeitenVonMia("en");
    expect(m.zaehler).toBe("Has played 2 Class Matches to the end");
    expect(m.summary).toMatch(/^Practice times - .* · 2 Class Matches$/);
    // Di 15.09.: sechs Zeilen 10:00-10:05, jede 4 Min. - Beginn = Anfang der ersten.
    expect(m.sitzungen).toEqual(["Tue 15 Sept, 09:56-10:05 · 24 min · My training"]);
    expect(m.zaehlerHinweis).toMatch(/^Counts every Class Match in this class that Mia played to the end - since 14 Sept 2026;/);
    expect(m.zaehlerHinweis).toMatch(/cancelled/);
    expect(m.zaehlerHinweis).toMatch(/no ranking, and who won is not counted\.$/);
    expect(m.wochenHinweis).toMatch(/After more than 30 minutes without typing, a new practice time begins\.$/);
    for (const satz of [m.zaehler, m.summary, ...m.sitzungen, m.zaehlerHinweis, m.wochenHinweis])
      expect(deutscheWoerter(satz), satz).toEqual([]);
    expect(fange(m.container)).toEqual([]);
  });

  it("★★★ GEGENPROBE deutsch: dieselben Stellen sind wirklich deutsch", async () => {
    const m = await uebungszeitenVonMia("de");
    expect(m.zaehler).toBe("Hat 2 Klassenmatches bis zum Ende gespielt");
    expect(m.summary).toMatch(/^Übungszeiten - .* · 2 Klassenmatches$/);
    expect(m.sitzungen).toEqual(["Di 15.09., 09:56-10:05 · 24 Min. · Mein Training"]);
    expect(m.zaehlerHinweis).toContain("seit dem 14.09.2026");
    // ⚠️ Der Zählersatz selbst trägt kein Wort aus der Fänger-Liste („hat" und
    // „an" sind auch englisch) - darum oben WÖRTLICH geprüft, in beiden
    // Sprachen. Die Hinweise erkennt der Fänger.
    for (const satz of [m.zaehlerHinweis, m.wochenHinweis])
      expect(deutscheWoerter(satz).length, satz).toBeGreaterThan(1);
  });
});

describe("★★ Die Zahlen-Hilfe englisch", () => {
  it("alle drei Teile: kein deutsches Wort - und die Gegenprobe", () => {
    for (const sprache of ["en", "de"] as const) {
      stelleBedienung(sprache);
      const { container, unmount } = zeige(
        <>
          <LeistungsstufeHilfe />
          <DreiWerteHilfe />
          <SpaltenHilfe />
        </>,
      );
      const funde = findeDeutsch(container);
      if (sprache === "en") {
        expect(funde).toEqual([]);
        expect(container.textContent).toMatch(/difficulty level/);
        expect(container.textContent).toMatch(/Catch up on missed minutes from previous weeks/);
        expect(container.textContent).toMatch(/Precision = characters ÷ \(characters \+ 5 × wrong keys\)/);
      } else {
        expect(funde.length).toBeGreaterThan(20);
        expect(container.textContent).toMatch(/Verpasste Minuten der vergangenen Wochen nachholen/);
      }
      unmount();
    }
  });
});

describe("★★ Die Gründe des Eigenständigkeits-Checks", () => {
  it("jeder Satz, den `suspicionScore` schreiben kann, hat eine englische Fassung", () => {
    const zeilen = (n: number, extra: Partial<TaskEvent> = {}) =>
      Array.from({ length: n }, (_, i) => uebung(JETZT - i * 60_000, extra));
    const faelle: TaskEvent[][] = [
      zeilen(3), // Noch zu wenige Daten.
      zeilen(6), // Unauffällig.
      [...zeilen(4), ...zeilen(2, { pasted: true })], // 2× Einfügen
      [...zeilen(5), ...zeilen(1, { pasted: true })], // 1× Einfügen
      [...zeilen(5), ...zeilen(1, { unechteTasten: 2 })], // Programm-Tasten, 1 Zeile
      [...zeilen(3), ...zeilen(3, { unechteTasten: 1 })], // Programm-Tasten, 3 Zeilen
      [...zeilen(3), ...zeilen(3, { blurred: true })], // Fenster
      // Unplausibel schnell UND makellos: 300 Zeichen in 15 Sekunden (1200/min).
      Array.from({ length: 6 }, (_, i) => ({ ...uebung(JETZT - i * 60_000), ms: 15_000, activeMs: 15_000, errors: 0 })),
    ];
    const gesehen = new Set<string>();
    for (const ev of faelle)
      for (const grund of suspicionScore(ev).reasons) {
        const en = eigenstaendigkeitsGrundEn(grund);
        expect(en, `ohne englische Fassung: ${grund}`).not.toBeNull();
        expect(deutscheWoerter(en!), en!).toEqual([]);
        gesehen.add(grund.replace(/\d+/g, "#"));
      }
    // Jede Satzform kam mindestens einmal vor - sonst prüfte der Test nichts.
    expect(gesehen.size).toBeGreaterThanOrEqual(7);
    expect(eigenstaendigkeitsGrundEn("Ein ganz neuer Grund.")).toBeNull();
  });
});

describe("★★★ Die englische Excel-Mappe", () => {
  async function mappe(sprache: AktiveBedienSprache) {
    const { kinder } = await baueKlasse();
    const datas: PupilData[] = [];
    for (const pupil of kinder) {
      const events = await typingBackend().getEvents(pupil.id);
      const progress = (await typingBackend().getProgress(pupil.id)) ?? emptyProgress();
      datas.push({ pupil, progress, events, stats: computePupilStats(events) });
    }
    const blaetter = leistungsBlaetter(datas, {}, [], JETZT, "3b", sprache);
    const bytes = await leistungDateiBytes(blaetter, { klassenname: "3b", jetztMs: JETZT });
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(bytes as unknown as ArrayBuffer);
    const texte: string[] = [];
    wb.eachSheet((ws) =>
      ws.eachRow((row) =>
        row.eachCell((c) => {
          const v = c.value as unknown;
          if (typeof v === "string") texte.push(v);
          else if (v && typeof v === "object" && "text" in (v as object)) texte.push(String((v as { text: unknown }).text));
        }),
      ),
    );
    return { wb, blaetter, texte };
  }

  it(
    "Blattnamen, Köpfe, Legende und Score-Erklärung englisch - kein deutsches Wort",
    async () => {
      const { wb, blaetter, texte } = await mappe("en");
      expect(wb.worksheets.map((w) => w.name)).toEqual(["Overview", "School year", "All time", "Month", "Week"]);
      expect(blaetter[0].titel).toBe("Class 3b - School year 2026/27");
      expect(blaetter[3].titel).toBe("Class 3b - This week, 14 Sept to 20 Sept");
      const woche = wb.getWorksheet("Week")!;
      expect(woche.getCell("A3").value).toBe("Created on 16 September 2026");
      expect(woche.getRow(5).values).toEqual(
        expect.arrayContaining(["Pupil", "Progress and practice time", "Practice", "Challenge"]),
      );
      expect(woche.getRow(6).values).toEqual(
        expect.arrayContaining([
          "Name",
          "Difficulty level (1-50)",
          "Keys mastered",
          "Keys unlocked",
          "Practice time (minutes)",
          "Weekly goal (min)",
          "Done (min)",
          "Accuracy (%)",
          "Keystrokes per minute",
          "Score",
          "Typing Challenges",
          "Average challenge score",
        ]),
      );
      expect(woche.headerFooter.oddFooter).toMatch(/Page &P of &N$/);
      // Prozent britisch ohne Leerzeichen.
      const treffer = (woche.getRow(6).values as unknown[]).indexOf("Accuracy (%)");
      const mia = [7, 8, 9, 10].find((z) => woche.getCell(z, 1).value === "Mia")!;
      expect(woche.getCell(mia, treffer).numFmt).toBe('0"%"');
      // Kein deutsches Wort in der ganzen Mappe (Namen sind keine Wörter der Liste).
      const funde = texte.filter((t) => deutscheWoerter(t).length > 0 && !nurTastenzeichen(`[${deutscheWoerter(t).join(", ")}]`));
      expect(funde).toEqual([]);
      const uebersicht = wb.getWorksheet("Overview")!;
      expect(uebersicht.getCell("A2").value).toBe("Progress table - Class 3b");
      expect(texte).toContain("Legend - what the columns mean");
      expect(texte).toContain("How the score is worked out");
      expect(texte.some((t) => /^Score = 100 × 0\.95 × 0\.75 = \d+\.$/.test(t.split(". ").pop() ?? ""))).toBe(true);
    },
    30000,
  );

  it(
    "Gegenprobe: dieselbe Mappe deutsch - deutsche Blätter und viele deutsche Wörter",
    async () => {
      const { wb, texte } = await mappe("de");
      expect(wb.worksheets.map((w) => w.name)).toEqual(["Übersicht", "Schuljahr", "Gesamt", "Monat", "Woche"]);
      expect(wb.getWorksheet("Woche")!.headerFooter.oddFooter).toMatch(/Seite &P von &N$/);
      expect(texte.filter((t) => deutscheWoerter(t).length > 0).length).toBeGreaterThan(30);
    },
    30000,
  );
});
