/**
 * ★★★ WÄCHTER E4 (18.09.2026): DIE AUFGEKLAPPTE ZEILE DER LEHRKRAFT.
 *
 * `BAUPLAN-2026-09-18-MEINE-KLASSEN-UMBAU.md` E4, Johannes:
 *
 *   „Bei der Ausklappübersicht der einzelnen Schüler kommt viel zu viel.
 *    Alles, was oben in der Tabelle steht, gehört unten weg. … vielleicht
 *    einfach ausklappbare Zeilen mit 1. Übungszeiten … 2. wacklige Tasten
 *    3. Abzeichen."*
 *
 * ★ Nachtrag (Bauplan §„W · Wochenziel neu"): dieselbe Nacht hat die
 * Unterrichtsperiode der Klasse abgeschafft - „Übungszeiten" zählt seither je
 * WOCHE (Montag 08:00, `WOCHENZIEL_GRENZE`), für jede Klasse gleich, ohne
 * Spalte „im Unterricht" (`uebungsperioden.ts`, eigener Wächter
 * `tastenflow-uebungsperioden.test.ts`).
 *
 * Geprüft wird hier GENAU das, was `AufgeklappteZeile` in `TastenflowReiter.tsx`
 * baut:
 *  1. Es sind genau fünf `<details>`-Zeilen, in der festen Reihenfolge
 *     Übungszeiten → Wacklige Tasten → Abzeichen → Tippchallenges →
 *     Einstellungen - jede mit ihrer Kennzahl schon in der `<summary>`.
 *  2. „Tippchallenges" fehlt ganz, solange niemand eine geschrieben hat.
 *  3. Eine sechste Zeile „Eigenständigkeit" kommt NUR dazu, wenn der Check
 *     wirklich etwas meldet (`stats.suspicion.score > 1`).
 *  4. „Wacklige Tasten" zeigt DIESELBEN Tasten, die `weakestKeys` liefert -
 *     keine zweite Auswahl daneben.
 *  5. „Meine Statistik" des Kindes (dieselbe Komponente, `PupilStatsPanel`)
 *     bleibt VOLLSTÄNDIG - nichts wurde ihr weggenommen
 *     ([[feedback_data_transparency]]).
 *
 * ⚠️ Der `<summary>` bekommt in jsdom keine eigene ARIA-Rolle („button" fehlt -
 * gemessen beim Bau dieser Datei) - Zeilen werden darum über `<details>` selbst
 * bzw. den sichtbaren Text geöffnet, nicht über `getByRole("button")`.
 *
 * ★ M3 (19.09.2026): „Übungszeiten" trägt jetzt je Woche eine eigene
 * `<details>` (die einzelnen Übungszeiten) und oben den Zähler „Hat N
 * Klassenmatches bis zum Ende gespielt" - geprüft im letzten Block. Die Zeilen der
 * ERSTEN Ebene (`oeffneUndLiesZeilen`) und die Wochen-Einträge (`wochen`)
 * lassen die neue Ebene darum ausdrücklich aus.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";

import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { PupilStatsPanel, type PupilData } from "@/components/typing/PupilStatsPanel";
import type { Match } from "@/lib/typing/klassenmatch";
import {
  computePupilStats,
  emptyProgress,
  ensureIntroduced,
  letterMs,
  recordEvent,
  saveAccountProgress,
  typingBackend,
  unitLabel,
  stufeFuer,
  weakestKeys,
  werteAus,
  type LetterStat,
  type Probenergebnis,
  type TaskEvent,
  type TypingAccount,
  type TypingProgress,
} from "@/lib/typing";
import {
  addPupil,
  createClass,
  getClass,
  getEvents,
  listPupils,
  registerTeacher,
} from "@/lib/typing/account";
import { uebungsperioden } from "@/lib/typing/uebungsperioden";

const GRUNDREIHE = ["f", "j", "d", "k", "s", "l", "a", "ö"];

/** Buchstaben, die eindeutig „sitzen" (hohe Treffsicherheit, viele Proben). */
function sitzt(): Record<string, LetterStat> {
  const gut: Record<string, LetterStat> = {};
  for (const c of ["f", "j", "d", "k", "s", "l"]) {
    gut[c] = { hits: 20, misses: 0, sumMs: 20 * 450, timed: 20 };
  }
  return gut;
}

/** Ein Zeitpunkt in Ortszeit - Monat 1-basiert, damit man das Datum liest. */
function zeit(j: number, mon: number, tag: number, std = 10): number {
  return new Date(j, mon - 1, tag, std, 0, 0, 0).getTime();
}

function uebung(ts: number, minuten: number, extra: Partial<TaskEvent> = {}): TaskEvent {
  const ms = minuten * 60_000;
  return { ts, lesson: "l1", chars: 400, errors: 10, ms, activeMs: ms, ...extra };
}

/** Ein echtes Tippchallenge-Ergebnis - durch dasselbe Rechenwerk wie beim Abgeben. */
function probe(tag: number): Probenergebnis {
  const beginn = zeit(2026, 9, tag);
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

function baueKlasse(): TypingAccount[] {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  for (const name of ["Lena", "Noah", "Timo"]) {
    const p = addPupil(c.value.code, name, "pw1234");
    if (!p.ok) throw new Error(p.error);
  }
  return listPupils(c.value.code);
}

let kinder: TypingAccount[] = [];
const kind = (name: string) => kinder.find((k) => k.name === name)!;

beforeEach(async () => {
  localStorage.clear();
  kinder = baueKlasse();

  // Lena: unauffällig, drei kurze Übungen (unter fünf ⇒ der Check bleibt bei
  // „Noch zu wenige Daten", Wert 1 - keine sechste Zeile), zwei wacklige
  // Tasten, ein Abzeichen, eine Tippchallenge.
  const lenaProgress: TypingProgress = {
    ...emptyProgress(),
    introduced: GRUNDREIHE,
    letters: {
      ...sitzt(),
      // ★ Deutlich unter 95 % Treffsicherheit UND mindestens 20 Proben (★ D-4,
      // 28.09.2026; vorher drei) - genau die Bedingung von `weakestKeys`.
      ö: { hits: 8, misses: 12, sumMs: 12 * 600, timed: 12 },
      a: { hits: 12, misses: 8, sumMs: 8 * 500, timed: 8 },
    },
    badges: { "tasten-kueken": zeit(2026, 9, 1) },
  };
  saveAccountProgress(kind("Lena").id, lenaProgress);
  recordEvent(kind("Lena").id, uebung(zeit(2026, 9, 7), 10));
  recordEvent(kind("Lena").id, uebung(zeit(2026, 9, 9), 5));
  recordEvent(kind("Lena").id, uebung(zeit(2026, 9, 14), 15));
  await typingBackend().speichereProbenergebnis(kind("Lena"), probe(8));

  // Noah: auffällig (zweimal eingefügt, ab fünf Ereignissen zählt der Check
  // wirklich), keine wacklige Taste bekannt (zu wenig geübt), kein Abzeichen,
  // aber eine Tippchallenge ⇒ alle SECHS Zeilen stehen da.
  saveAccountProgress(kind("Noah").id, { ...emptyProgress(), introduced: GRUNDREIHE });
  for (let i = 0; i < 5; i++)
    recordEvent(
      kind("Noah").id,
      uebung(zeit(2026, 9, 7) + i * 60_000, 5, { pasted: i < 2 }),
    );
  await typingBackend().speichereProbenergebnis(kind("Noah"), probe(9));

  // Timo: unauffällig, keine Tippchallenge ⇒ genau VIER Zeilen (die
  // Tippchallenge-Zeile fehlt ganz).
  saveAccountProgress(kind("Timo").id, { ...emptyProgress(), introduced: GRUNDREIHE });
  recordEvent(kind("Timo").id, uebung(zeit(2026, 9, 7), 5));
});
afterEach(() => cleanup());

async function zeige() {
  render(<TastenflowReiter pupils={kinder} onChanged={() => {}} />);
  await screen.findByRole("table", { name: /Lernende der Klasse/ });
}

/** Die `<details>`-Zeilen INNERHALB der aufgeklappten Zeile einer Person. */
function oeffneUndLiesZeilen(name: string): HTMLDetailsElement[] {
  fireEvent.click(
    screen.getByRole("button", { name: `Einstellungen und Auswertung von ${name} ausklappen` }),
  );
  // Der Name-Zelle (`th`, klebende Namensspalte) - eindeutig, ohne die
  // Mehrdeutigkeit einer aggregierten Zeilen-Beschriftung.
  const namenzelle = screen.getByText(name, { selector: "th span > span" });
  const zeile = namenzelle.closest("tr")!;
  const spalte = zeile.nextElementSibling as HTMLElement; // die aufgeklappte <tr>
  // ★ M3: nur die Zeilen der ERSTEN Ebene - seit M3 klappt in „Übungszeiten"
  // jede Woche ihre Übungszeiten selbst auf (eigene `<details>` darin).
  return Array.from(spalte.querySelectorAll("details")).filter(
    (d) => !d.parentElement?.closest("details"),
  );
}

/**
 * ★ M3: die Wochen-Einträge von „Übungszeiten" - GENAU die Liste direkt unter
 * der Zeile, ohne die einzelnen Übungszeiten, die seit M3 in jeder Woche
 * stecken (die wären für `getAllByRole("listitem")` weitere Einträge).
 */
function wochen(uebungszeiten: HTMLDetailsElement): HTMLLIElement[] {
  const liste = uebungszeiten.querySelector(":scope > div > ul");
  return liste ? (Array.from(liste.children) as HTMLLIElement[]) : [];
}

/** Der Text einer Wochenzeile selbst - ohne die Übungszeiten darunter. */
function wochenText(li: HTMLLIElement): string {
  const quelle = li.querySelector("summary") ?? li;
  return (quelle.textContent ?? "").replace(/^▸/, "").replace(/\s+/g, " ").trim();
}

/** Die Zeile, deren Titel so beginnt - unabhängig von ihrer Stelle. */
function zeileMit(zeilen: HTMLDetailsElement[], anfang: string): HTMLDetailsElement {
  const treffer = zeilen.find((d) => summary(d).startsWith(anfang));
  if (!treffer) throw new Error(`keine Zeile „${anfang}"`);
  return treffer;
}

function summary(d: HTMLDetailsElement): string {
  // Das Pfeilchen (▸, `aria-hidden`) zählt zu `textContent`, auch wenn es aus
  // der Sprachausgabe genommen ist - hier weg, es ist nicht Teil der Kennzahl.
  return (d.querySelector("summary")?.textContent ?? "")
    .replace(/^▸/, "")
    .replace(/\s+/g, " ")
    .trim();
}

describe("★★★ Genau die fünf (bzw. sechs) Zeilen, in fester Reihenfolge", () => {
  // ★ Reihenfolge seit 19.09.2026 (Johannes): „Ausklappliste von oben nach
  // unten: Einstellungen …; Tippchall…; Übungszeiten; wacklige Tasten; Abzeichen".
  it("Lena: fünf Zeilen - Einstellungen, Tippchallenges, Übungszeiten, Wacklige Tasten, Abzeichen", async () => {
    await zeige();
    const zeilen = oeffneUndLiesZeilen("Lena");
    expect(zeilen).toHaveLength(5);
    const titel = zeilen.map(summary);
    expect(titel[0]).toMatch(/^Einstellungen für Lena -/);
    expect(titel[1]).toBe("Tippchallenges - 1");
    expect(titel[2]).toMatch(/^Übungszeiten -/);
    expect(titel[3]).toMatch(/^Wacklige Tasten -/);
    expect(titel[4]).toBe("Abzeichen - 1");
    // Keine Eigenständigkeits-Zeile - Lena ist unauffällig.
    expect(titel.some((t) => t.startsWith("Eigenständigkeit"))).toBe(false);
  });

  it("die Summe der Übungszeiten UND die Zahl der Wochen stehen schon in der Zusammenfassung", async () => {
    await zeige();
    const uebungszeiten = zeileMit(oeffneUndLiesZeilen("Lena"), "Übungszeiten");
    // Zwei Wochen (07./09.09. in der einen, 14.09. in der nächsten) - dieselbe
    // Montag-08:00-Grenze wie beim Wochenziel, für jede Klasse gleich.
    expect(summary(uebungszeiten)).toBe("Übungszeiten - 30 Min. · 2 Wochen");
    fireEvent.click(uebungszeiten.querySelector("summary")!);
    // Zwei Zeilen (eine je Woche), nicht eine je Kalendertag.
    expect(wochen(uebungszeiten)).toHaveLength(2);
  });

  it("war eine Woche eine Ziel-Woche, steht ihr Wochenziel-Stand direkt daneben", async () => {
    // ★ Direkt am Konto gesetzt (nicht über `setWochenziel`/den GoalEditor):
    // Eine Zieländerung gilt immer erst ab der NÄCHSTEN Woche (Bauplan §„W"),
    // ein über die App gesetztes Ziel könnte die September-Wochen dieses
    // Wächters also nie treffen. Ein Verlauf ab „2026-W37" deckt BEIDE
    // Wochen ab, in denen Lena laut `beforeEach` geübt hat (07./14.09.).
    kind("Lena").wochenzielVerlauf = [{ ab: "2026-W37", minuten: 20 }];
    await zeige();
    const uebungszeiten = zeileMit(oeffneUndLiesZeilen("Lena"), "Übungszeiten");
    fireEvent.click(uebungszeiten.querySelector("summary")!);
    const zeilen = wochen(uebungszeiten).map(wochenText);
    // Woche 07.-14.09.: 15 Min. geübt (10+5), Woche 14.-21.09.: 15 Min. (15) -
    // beide unter dem 20-Minuten-Ziel, ohne Nachholen bleibt jede für sich.
    expect(zeilen[0]).toContain("15 von 20 Min.");
    expect(zeilen[1]).toContain("15 von 20 Min.");
  });

  it("Timo: genau vier Zeilen - keine Tippchallenge, also fehlt die Zeile ganz", async () => {
    await zeige();
    const zeilen = oeffneUndLiesZeilen("Timo");
    expect(zeilen).toHaveLength(4);
    expect(zeilen.map(summary).some((t) => t.startsWith("Tippchallenges"))).toBe(false);
  });

  it("Noah: alle sechs Zeilen - die Eigenständigkeit meldet sich mit ihrem Grund", async () => {
    await zeige();
    const zeilen = oeffneUndLiesZeilen("Noah");
    expect(zeilen).toHaveLength(6);
    const titel = zeilen.map(summary);
    expect(titel[5]).toBe("Eigenständigkeit - 1 Hinweis");
    fireEvent.click(zeilen[5].querySelector("summary")!);
    // Zweimal in der Zeile (Chip-Hinweis UND Liste, absichtlich - siehe
    // `PupilStatsPanel`s Vorbild) - hier genügt die sichtbare Liste.
    expect(within(zeilen[5]).getByText(/Einfügen \(Paste\) erkannt/, { selector: "li" })).toBeTruthy();
    // Noch nicht genug geübt ⇒ „Wacklige Tasten" nennt das ehrlich, statt
    // gegen Noah zu werten.
    expect(titel[3]).toBe("Wacklige Tasten - noch zu wenig geübt");
  });

  it("»Wacklige Tasten« zeigt DIESELBEN Tasten wie `weakestKeys` - keine zweite Auswahl", async () => {
    await zeige();
    const zeilen = oeffneUndLiesZeilen("Lena");
    const wackligeTasten = zeileMit(zeilen, "Wacklige Tasten");
    fireEvent.click(wackligeTasten.querySelector("summary")!);

    const introduced = ensureIntroduced(GRUNDREIHE, "de");
    const erwartet = weakestKeys(
      {
        ...sitzt(),
        ö: { hits: 8, misses: 12, sumMs: 12 * 600, timed: 12 },
        a: { hits: 12, misses: 8, sumMs: 8 * 500, timed: 8 },
      },
      introduced,
      { lernweg: "de", stufe: stufeFuer(kind("Lena")) }, // ★ D-5
      8,
    );
    expect(erwartet.map((w) => w.unit)).toEqual(["ö", "a"]);

    const zeilenDerTabelle = within(wackligeTasten)
      .getAllByRole("row")
      .slice(1); // ohne Kopfzeile
    expect(zeilenDerTabelle).toHaveLength(erwartet.length);
    zeilenDerTabelle.forEach((zeile, i) => {
      const w = erwartet[i];
      expect(within(zeile).getByText(unitLabel(w.unit))).toBeTruthy();
      const ms = letterMs({
        ö: { hits: 4, misses: 6, sumMs: 6 * 600, timed: 6 },
        a: { hits: 6, misses: 4, sumMs: 4 * 500, timed: 4 },
      }[w.unit]);
      if (ms) expect(zeile.textContent).toContain(`${Math.round(60_000 / ms)}/min`);
    });
    // Die Kennzahl der Summary nennt dieselben drei (hier: beide) Tasten.
    expect(summary(wackligeTasten)).toBe(
      `Wacklige Tasten - ${erwartet.map((w) => unitLabel(w.unit)).join(", ")}`,
    );
  });
});

/**
 * ★★★ E9 (19.09.2026): Johannes, 18.09.2026 - „Klassenmatch-Anzahl ja": die
 * Zahl der Klassenmatches je Woche steht jetzt AN GENAU DER STELLE, an der
 * das §„Nachtrag E9" in `TastenflowReiter.tsx` sie ankündigt - hinter dem
 * Wochenziel-Stand, in derselben Zeile von „Übungszeiten". Kein Ranking,
 * keine Platzierung, keine Zeit - nur die Anzahl.
 *
 * Der Mock hat kein Gegenstück zu `tt_match_verlauf` (reine Server-Tabelle) -
 * die Matches liegen darum direkt im Mock-Speicher, geschrieben wie
 * `tests/typing-klassenmatch-gleichzeitig.test.tsx` es vormacht
 * (`localStorage.setItem(MATCHES_SCHLUESSEL, …)`), nicht über den echten
 * Countdown-Ablauf - der ist hier nicht die Frage.
 */
describe("★★★ E9: die Klassenmatch-Anzahl steht in „Übungszeiten“", () => {
  const MATCHES_SCHLUESSEL = "tastenflow:klassenmatch:matches";

  function fertigesMatch(hostUid: string, createdMs: number, id: string): Match {
    return {
      id,
      classCode: "3B",
      hostUid,
      hostName: "wird nicht gelesen",
      status: "fertig",
      startMs: createdMs - 5 * 60_000,
      endeMs: createdMs,
      dauerMin: 5,
      createdMs,
    };
  }

  it('„· 2 Klassenmatches" in der älteren Woche, „· 1 Klassenmatch" (Einzahl) in der jüngeren', async () => {
    // Lenas zwei Übungswochen (siehe `beforeEach`): 07./09.09. und 14.09. -
    // zwei Matches in der ersten, eines in der zweiten.
    localStorage.setItem(
      MATCHES_SCHLUESSEL,
      JSON.stringify([
        fertigesMatch(kind("Lena").id, zeit(2026, 9, 8, 11), "m1"),
        fertigesMatch(kind("Lena").id, zeit(2026, 9, 9, 12), "m2"),
        fertigesMatch(kind("Lena").id, zeit(2026, 9, 15, 9), "m3"),
      ]),
    );
    await zeige();
    const uebungszeiten = zeileMit(oeffneUndLiesZeilen("Lena"), "Übungszeiten");
    fireEvent.click(uebungszeiten.querySelector("summary")!);
    const zeilen = wochen(uebungszeiten).map(wochenText);
    expect(zeilen).toHaveLength(2);
    // `uebungsperioden` sortiert absteigend - die jüngere Woche (14.09.) zuerst.
    expect(zeilen[0]).toContain("1 Klassenmatch");
    expect(zeilen[0]).not.toContain("Klassenmatches");
    expect(zeilen[1]).toContain("2 Klassenmatches");
  });

  it("nichts in der Zeile, solange kein Match gespielt wurde", async () => {
    await zeige();
    const uebungszeiten = zeileMit(oeffneUndLiesZeilen("Lena"), "Übungszeiten");
    fireEvent.click(uebungszeiten.querySelector("summary")!);
    for (const z of wochen(uebungszeiten)) expect(z.textContent).not.toMatch(/Klassenmatch/);
  });

  it("zählt nur die EIGENEN Matches des Kindes - Timos Match zählt nicht bei Lena", async () => {
    localStorage.setItem(
      MATCHES_SCHLUESSEL,
      JSON.stringify([fertigesMatch(kind("Timo").id, zeit(2026, 9, 8, 11), "m1")]),
    );
    await zeige();
    const uebungszeiten = zeileMit(oeffneUndLiesZeilen("Lena"), "Übungszeiten");
    fireEvent.click(uebungszeiten.querySelector("summary")!);
    for (const z of wochen(uebungszeiten)) expect(z.textContent).not.toMatch(/Klassenmatch/);
  });

  it('eine LAUFENDE Einladung (nicht „fertig") zählt nicht mit', async () => {
    localStorage.setItem(
      MATCHES_SCHLUESSEL,
      JSON.stringify([
        { ...fertigesMatch(kind("Lena").id, zeit(2026, 9, 8, 11), "m1"), status: "laeuft" },
      ]),
    );
    await zeige();
    const uebungszeiten = zeileMit(oeffneUndLiesZeilen("Lena"), "Übungszeiten");
    fireEvent.click(uebungszeiten.querySelector("summary")!);
    for (const z of wochen(uebungszeiten)) expect(z.textContent).not.toMatch(/Klassenmatch/);
  });
});

/**
 * ★★★ M3 (19.09.2026), Johannes: *„Bei der Ausklappliste der Übezeiten fehlen
 * noch eine Unterliste mit allen Übungszeiten genau erfasst, und es fehlt noch
 * ein Zähler mit: hat an 15 Klassenmatch teilgenommen"*.
 *
 * Timo übt in der Woche ab Mo 14.09. zweimal - Montag drei Zeilen hintereinander
 * (Mein Training, ein Wortspiel, wieder Mein Training), Mittwoch ein
 * Klassenmatch - und hat aus `beforeEach` eine Zeile am 07.09. (Kennung „l1",
 * die keiner Übungsart gleicht ⇒ ohne Art, nichts geraten).
 */
describe("★★★ M3: die einzelnen Übungszeiten je Woche und der Klassenmatch-Zähler", () => {
  // Auch nach einem roten Test: kein Ersatz-Backend in den nächsten tragen.
  afterEach(() => vi.restoreAllMocks());
  const MATCHES_SCHLUESSEL = "tastenflow:klassenmatch:matches";
  const um = (tag: number, std: number, min: number) => new Date(2026, 8, tag, std, min).getTime();
  function zeile(ts: number, minuten: number, lesson: string, aktivMin = minuten): TaskEvent {
    return { ts, lesson, chars: 300, errors: 3, ms: minuten * 60_000, activeMs: aktivMin * 60_000 };
  }
  function timoUebt() {
    const id = kind("Timo").id;
    recordEvent(id, zeile(um(14, 10, 10), 8, "adaptiv")); // Zeile 10:02-10:10
    recordEvent(id, zeile(um(14, 10, 20), 10, "form:lueckentext", 9)); // 10:10-10:20, 9 Min. getippt
    recordEvent(id, zeile(um(14, 10, 31), 11, "adaptiv", 10)); // 10:20-10:31, 10 Min. getippt
    recordEvent(id, zeile(um(16, 14, 12), 12, "klassenmatch")); // Mi 14:00-14:12
  }
  function fertigesMatch(hostUid: string, createdMs: number, id: string): Match {
    return {
      id,
      classCode: "3B",
      hostUid,
      hostName: "wird nicht gelesen",
      status: "fertig",
      startMs: createdMs - 5 * 60_000,
      endeMs: createdMs,
      dauerMin: 5,
      createdMs,
    };
  }
  /** Die Übungszeiten EINER Woche, als Text. */
  function sitzungen(woche: HTMLLIElement): string[] {
    return Array.from(woche.querySelectorAll("details > ul > li")).map((li) =>
      (li.textContent ?? "").replace(/\s+/g, " ").trim(),
    );
  }
  /** Der Zähler oben in „Übungszeiten" - der Satz, und der Hinweis dazu. */
  function zaehler(uebungszeiten: HTMLDetailsElement): { satz: string; hinweis: string } | null {
    const p = uebungszeiten.querySelector(":scope > div > p");
    if (!p) return null;
    const erklaert = p.querySelector("[aria-describedby]");
    const id = erklaert?.getAttribute("aria-describedby") ?? "";
    // Der Hinweis hängt per Portal unter <body> (K1) - über seine Kennung.
    const hinweis = document.getElementById(id)?.textContent ?? "";
    // Der Satz allein - ohne den Hinweis, falls der doch am Ort stünde.
    const satz = (erklaert?.firstElementChild?.textContent ?? p.textContent ?? "").trim();
    return { satz, hinweis };
  }

  it("jede Woche listet JEDE Übungszeit genau: Tag, von-bis, geübte Zeit, Übungsart - jüngste zuerst", async () => {
    timoUebt();
    await zeige();
    const uebungszeiten = zeileMit(oeffneUndLiesZeilen("Timo"), "Übungszeiten");
    const [dieseWoche, vorwoche] = wochen(uebungszeiten);
    expect(wochenText(dieseWoche)).toBe("Mo 14.09. - So 20.09. · 39 Min. · an 2 Tagen");
    expect(sitzungen(dieseWoche)).toEqual([
      "Mi 16.09., 14:00-14:12 · 12 Min. · Klassenmatch",
      // Beginn = Anfang der ERSTEN Zeile (10:10 minus 8 Min.), Ende = Abgabe
      // der letzten; geübt = reine Tippzeit 8 + 9 + 10, nicht die 29 Minuten
      // der Uhr. Zwei Übungsarten in der Reihenfolge ihres ersten Vorkommens.
      "Mo 14.09., 10:02-10:31 · 27 Min. · Mein Training, Wortspiele",
    ]);
    // „l1" gleicht keiner Übungsart - dann steht keine da, statt einer geratenen.
    expect(sitzungen(vorwoche)).toEqual(["Mo 07.09., 09:55-10:00 · 5 Min."]);
  });

  it("★★★ die Übungszeiten einer Woche ergeben zusammen GENAU die Zeit der Woche", async () => {
    timoUebt();
    // An den Daten: jede Woche, auf die Millisekunde.
    const perioden = uebungsperioden(getEvents(kind("Timo").id));
    expect(perioden).toHaveLength(2);
    for (const p of perioden)
      expect(p.sitzungen.reduce((summe, sz) => summe + sz.ms, 0)).toBe(p.ms);
    // Und so, wie die Lehrkraft es liest: 12 + 27 = 39 Min.
    await zeige();
    const [dieseWoche] = wochen(zeileMit(oeffneUndLiesZeilen("Timo"), "Übungszeiten"));
    const minuten = sitzungen(dieseWoche).map((z) => Number(z.match(/· (\d+) Min\./)![1]));
    expect(minuten.reduce((a, b) => a + b, 0)).toBe(39);
    expect(wochenText(dieseWoche)).toContain("· 39 Min. ·");
  });

  it("zu, bis man sie öffnet - ein echtes <summary> als Schalter, per Tab erreichbar", async () => {
    timoUebt();
    await zeige();
    const uebungszeiten = zeileMit(oeffneUndLiesZeilen("Timo"), "Übungszeiten");
    fireEvent.click(uebungszeiten.querySelector("summary")!);
    expect(uebungszeiten.open).toBe(true);
    for (const woche of wochen(uebungszeiten)) {
      const details = woche.querySelector("details")!;
      // Zu - auch wenn „Übungszeiten" selbst schon offen ist.
      expect(details.open).toBe(false);
      // ★ Der Schalter ist das EINGEBAUTE <summary>, als erstes Kind seines
      //   <details>: Eingabe und Leertaste öffnen es im Browser von selbst,
      //   und die Sprachausgabe sagt „reduziert"/„erweitert". jsdom kennt
      //   diesen Tastenweg nicht (Enter löst dort keinen Klick aus - geprüft
      //   beim Bau) - im echten Browser ist er nachgemessen (Bericht M3).
      const summary = details.firstElementChild as HTMLElement;
      expect(summary.tagName).toBe("SUMMARY");
      expect(summary.tabIndex).toBe(0);
      expect(summary.hasAttribute("disabled")).toBe(false);
      // Der Pfeil gehört der WOCHE: ein blosses `group-open:` träfe das offene
      // „Übungszeiten" darüber, und er stünde gedreht, obwohl die Woche zu ist.
      const pfeil = summary.querySelector('[aria-hidden="true"]')!;
      expect(pfeil.className).toContain("group-open/woche:rotate-90");
      expect(pfeil.className).not.toMatch(/(^|\s)group-open:rotate-90/);
      summary.focus();
      expect(document.activeElement).toBe(summary);
      fireEvent.click(summary); // das, was Eingabe/Leertaste im Browser auslösen
      expect(details.open).toBe(true);
    }
  });

  it("der Hinweis an der Woche erklärt von-bis, geübte Zeit und die 30-Minuten-Grenze", async () => {
    timoUebt();
    await zeige();
    const [dieseWoche] = wochen(zeileMit(oeffneUndLiesZeilen("Timo"), "Übungszeiten"));
    const flaeche = dieseWoche.querySelector("summary > span:not([aria-hidden])")!;
    fireEvent.mouseEnter(flaeche);
    const hinweis = [...document.querySelectorAll('[role="tooltip"]')].find((k) =>
      /jede einzelne Übungszeit dieser Woche/.test(k.textContent ?? ""),
    );
    expect(hinweis?.textContent).toMatch(/reine Tippzeit/);
    expect(hinweis?.textContent).toMatch(/Nach mehr als 30 Minuten ohne Tippen/);
  });

  it("Zähler: „Hat noch kein Klassenmatch bis zum Ende gespielt\" - und die Zeile selbst nennt keine Zahl", async () => {
    await zeige();
    const uebungszeiten = zeileMit(oeffneUndLiesZeilen("Lena"), "Übungszeiten");
    await waitForZaehler(uebungszeiten, "Hat noch kein Klassenmatch bis zum Ende gespielt");
    expect(summary(uebungszeiten)).toBe("Übungszeiten - 30 Min. · 2 Wochen");
  });

  it("Zähler in der Einzahl: „Hat 1 Klassenmatch bis zum Ende gespielt\" - auch in der Zusammenfassung", async () => {
    localStorage.setItem(
      MATCHES_SCHLUESSEL,
      JSON.stringify([fertigesMatch(kind("Lena").id, zeit(2026, 9, 15, 9), "m1")]),
    );
    await zeige();
    const uebungszeiten = zeileMit(oeffneUndLiesZeilen("Lena"), "Übungszeiten");
    await waitForZaehler(uebungszeiten, "Hat 1 Klassenmatch bis zum Ende gespielt");
    expect(summary(uebungszeiten)).toBe("Übungszeiten - 30 Min. · 2 Wochen · 1 Klassenmatch");
  });

  it("★★★ Zähler in der Mehrzahl - die Summe über ALLE Wochen, auch die ohne Übung", async () => {
    localStorage.setItem(
      MATCHES_SCHLUESSEL,
      JSON.stringify([
        fertigesMatch(kind("Lena").id, zeit(2026, 9, 8, 11), "m1"), // Woche ab 07.09.
        fertigesMatch(kind("Lena").id, zeit(2026, 9, 15, 9), "m2"), // Woche ab 14.09.
        // Woche ab 31.08. - da hat Lena NICHT geübt, es gibt keine Wochenzeile
        // dafür. Der Zähler nimmt das Match trotzdem mit.
        fertigesMatch(kind("Lena").id, zeit(2026, 9, 2, 11), "m3"),
      ]),
    );
    await zeige();
    const uebungszeiten = zeileMit(oeffneUndLiesZeilen("Lena"), "Übungszeiten");
    await waitForZaehler(uebungszeiten, "Hat 3 Klassenmatches bis zum Ende gespielt");
    expect(summary(uebungszeiten)).toBe("Übungszeiten - 30 Min. · 2 Wochen · 3 Klassenmatches");
    // Die Wochenzeilen nennen zusammen nur zwei - der Zähler zählt alle.
    const jeWoche = wochen(uebungszeiten).map(wochenText);
    expect(jeWoche[0]).toContain("· 1 Klassenmatch");
    expect(jeWoche[1]).toContain("· 1 Klassenmatch");
    // ★ Der Hinweis sagt, was die Zahl umfasst - ehrlich, ohne Platzierung.
    const { hinweis } = zaehler(uebungszeiten)!;
    expect(hinweis).toContain("in dieser Klasse");
    expect(hinweis).toContain("seit dem 14.09.2026");
    expect(hinweis).toContain("bis zum Ende");
    expect(hinweis).toContain("Abgebrochene Matches und vorzeitig verlassene zählen nicht");
    expect(hinweis).toContain("kein Ranking, und wer gewonnen hat, wird nicht gezählt");
  });

  it("★ unbekannt (Abfrage gescheitert) ⇒ KEIN Zähler statt einer falschen Null", async () => {
    vi.spyOn(typingBackend(), "klassenmatchAnzahl").mockResolvedValue(null);
    await zeige();
    const uebungszeiten = zeileMit(oeffneUndLiesZeilen("Lena"), "Übungszeiten");
    expect(zaehler(uebungszeiten)).toBeNull();
    expect(uebungszeiten.textContent).not.toMatch(/Klassenmatch/);
  });

  /** Die Klasse mit abgeschaltetem Klassenmatch (Kasten „Einstellungen der Klasse"). */
  async function zeigeOhneKlassenmatch() {
    const cls = { ...getClass("3B")!, klassenmatchAus: true };
    render(<TastenflowReiter pupils={kinder} cls={cls} onChanged={() => {}} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
  }

  it("in einer Klasse ohne Klassenmatch steht keine Null", async () => {
    await zeigeOhneKlassenmatch();
    const uebungszeiten = zeileMit(oeffneUndLiesZeilen("Lena"), "Übungszeiten");
    // Geladen ist die Anzahl (Timo ist unberührt) - trotzdem kein Satz.
    await vi.waitFor(() => expect(summary(uebungszeiten)).toBe("Übungszeiten - 30 Min. · 2 Wochen"));
    expect(zaehler(uebungszeiten)).toBeNull();
  });

  it("… aber eine ECHTE Zahl bleibt stehen, auch wenn das Klassenmatch inzwischen abgeschaltet ist", async () => {
    localStorage.setItem(
      MATCHES_SCHLUESSEL,
      JSON.stringify([fertigesMatch(kind("Lena").id, zeit(2026, 9, 15, 9), "m1")]),
    );
    await zeigeOhneKlassenmatch();
    const uebungszeiten = zeileMit(oeffneUndLiesZeilen("Lena"), "Übungszeiten");
    await waitForZaehler(uebungszeiten, "Hat 1 Klassenmatch bis zum Ende gespielt");
  });

  /** Der Zähler erscheint erst, wenn die Anzahl geladen ist (vorher: unbekannt). */
  async function waitForZaehler(uebungszeiten: HTMLDetailsElement, satz: string) {
    await vi.waitFor(() => expect(zaehler(uebungszeiten)?.satz).toBe(satz));
  }
});

describe('★★★ „Meine Statistik" des Kindes bleibt vollständig ([[feedback_data_transparency]])', () => {
  it("alle historischen Abschnitte stehen weiter da - E4 hat nichts aus PupilStatsPanel genommen", () => {
    const events = [uebung(zeit(2026, 9, 7), 10)];
    const data: PupilData = {
      pupil: kind("Lena"),
      progress: {
        ...emptyProgress(),
        introduced: GRUNDREIHE,
        letters: sitzt(),
      },
      events,
      stats: computePupilStats(events),
    };
    render(<PupilStatsPanel data={data} selfView />);
    for (const ueberschrift of [
      "Wochenziele",
      "Deine Werte im Überblick",
      "Steigerung im Verlauf",
      "Meine Abzeichen",
    ])
      expect(screen.getByText(new RegExp(ueberschrift))).toBeTruthy();
    expect(screen.getByText(/Tasten-Stand/)).toBeTruthy();
    // ★ 19.09.2026: Der Block „Lektionen" ist WEG - nicht durch E4, sondern
    // auf Johannes' eigene Anweisung („den versteht jetzt niemand mehr"). Die
    // neue Ordnung von „Meine Statistik" bewacht
    // `tastenflow-meine-statistik-ordnung.test.tsx`.
    expect(screen.queryByText(/^Lektionen \(/)).toBeNull();
  });
});

describe("★ 19.09.2026: der Hinweis öffnet sich auch am TEXT von „Einhand schreiben“ und „Tempo zählt nicht“", () => {
  // Johannes: „es fehlt die Mouse-over-Erklärung bei ‚Tempo zählt nicht';
  // ‚Einhand schreiben'" - der Hinweis hing nur am 16-px-Kästchen.
  it.each([
    ["Einhand schreiben", "Umschalt-Gegenhand-Regel ist für dieses Kind aus"],
    ["Tempo zählt nicht", "zählt die Geschwindigkeit nirgends"],
    // Dieselbe Falle, beim Durchsehen gefunden: Kästchen und Beschriftung
    // standen als Geschwister NEBEN dem Tipp.
    ["Verpasste Minuten der vergangenen Wochen nachholen", ""],
  ])("Zeigen auf „%s“ zeigt den Hinweis", async (beschriftung, teilDesHinweises) => {
    await zeige();
    const einstellungen = zeileMit(oeffneUndLiesZeilen("Lena"), "Einstellungen für Lena");
    fireEvent.click(einstellungen.querySelector("summary")!);
    const text = within(einstellungen).getAllByText(beschriftung, { selector: "label" })[0] as HTMLLabelElement;
    // Der Hinweis steht immer im Baum (für `aria-describedby`) und ist nur
    // unsichtbar geschaltet - gemessen wird, ob er beim Zeigen auf den TEXT
    // sichtbar wird.
    const kaestchen = (text.htmlFor
      ? document.getElementById(text.htmlFor)
      : within(text).getByRole("checkbox")) as HTMLInputElement;
    const hinweis = document.getElementById(kaestchen.getAttribute("aria-describedby")!)!;
    expect(hinweis.textContent).toContain(teilDesHinweises);
    expect(hinweis.className).toContain("invisible");
    // Wie ein echter Zeiger: `mouseover` auf dem TEXT (React leitet daraus
    // das Betreten aller Vorfahren ab).
    fireEvent.mouseOver(text);
    expect(hinweis.className).not.toContain("invisible");
  });
});
