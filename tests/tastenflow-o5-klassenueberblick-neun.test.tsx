/**
 * ★★★ O5 (30.10.2026): der Klassenüberblick in den neun Sprachen - gerendert, in beiden Ansichten (Monat, Schuljahr).
 * Bis dahin fielen dort die Sätze im Hinweis (Tempo, Treffsicherheit, Wochenziele, Score-Leiste, Lernende) für die neun
 * auf Deutsch: die Ternär-Ketten kannten nur cs/pl/tr/it/fr/es/en. Dazu die kleinen Reste aus der Durchsicht aller
 * `=== "cs"`-Stellen (Pseudowort-Erklärung, Reiter-Hinweis, Listendatum, eigene Vorlage, Spenden-Merker).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

const bedien = vi.hoisted(() => ({ sprache: "bg" as string }));

vi.mock("@/lib/bedienSprache", async () => {
  const actual = await vi.importActual<typeof import("@/lib/bedienSprache")>("@/lib/bedienSprache");
  return {
    ...actual,
    useBedienSprache: () => ({
      sprache: bedien.sprache,
      spracheGewaehlt: bedien.sprache,
      setzeSprache: () => {},
      bereichAktiv: true,
      wechsle: () => {},
      beimSchalter: () => () => {},
      spracheOptionen: ["de", "en", bedien.sprache],
    }),
  };
});

import { Klassenueberblick } from "../src/components/lernwerkstatt/klasse/Klassenueberblick";
import {
  UEBERBLICK_SAETZE_NEUN,
  aufgabenSatzNeun,
  kennSatzNeun,
  leisteHilfeNeun,
  lernendeTextNeun,
  topfTextNeun,
} from "../src/components/lernwerkstatt/klasse/klassenueberblickNeun";
import { programmReiterHinweis } from "../src/components/lernwerkstatt/klasse/programmTexte";
import type { PupilData } from "../src/components/typing/PupilStatsPanel";
import { fremdeKlasseHinweis, vorlageTitel } from "../src/lib/lernwerkstatt/kinderImport";
import { listenDatum } from "../src/lib/lernwerkstatt/teilnehmerlisteDocx";
import { spendeUnterwegsLesen, spendeUnterwegsMerken, spendeUnterwegsLoeschen } from "../src/lib/spendeBestaetigt";
import { computePupilStats } from "../src/lib/typing";
import type { TaskEvent } from "../src/lib/typing/account";
import { pseudoErklaerung } from "../src/lib/typing/rueckmeldung";
import { GERUEST_SPRACHEN, type GeruestSprache } from "../src/lib/typing/sprachRegister";

/** Samstag 19.09.2026, 12:00 Ortszeit - wie `tastenflow-klassenueberblick`. */
const JETZT = new Date(2026, 8, 19, 12, 0, 0).getTime();

/** Ganze Wörter der deutschen und englischen Sätze; `\b` kennt nur ASCII, darum die Umschau mit `\p{L}`. */
const FREMD =
  /(?<!\p{L})(Im Schnitt|gemittelt|Kind|Kinder|Kindern|Übung|Noch keine|geübt|nicht geübt|Verglichen|Schuljahres?|Wochenziele?|Ziel-Wochen?|Anschläge|Treffsicherheit|Lernende|Verteilung|Ein Punkt|Zeilen|vergleichen|on average|across|pupils?|practi[sc]ed?|practice|school year|Spread|weekly goal|keystrokes)(?!\p{L})/u;

function zeilen(tag: [number, number], n: number, z: { ms: number; errors?: number }): TaskEvent[] {
  const start = new Date(2026, tag[0] - 1, tag[1], 10, 0, 0).getTime();
  return Array.from({ length: n }, (_, i) => ({
    ts: start + i * 60_000,
    lesson: "l1",
    chars: 100,
    errors: z.errors ?? 0,
    ms: z.ms,
  }));
}

function daten(name: string, events: TaskEvent[], wochenziel = false): PupilData {
  return {
    pupil: {
      id: name,
      name,
      ...(wochenziel ? { weeklyMinutes: 30 } : {}),
    },
    events,
    stats: computePupilStats(events),
  } as unknown as PupilData;
}

const KINDER: PupilData[] = [
  daten("Ana", [
    ...zeilen([8, 12], 6, { ms: 40_000, errors: 3 }),
    ...zeilen([8, 19], 6, { ms: 40_000, errors: 3 }),
    ...zeilen([9, 2], 6, { ms: 30_000, errors: 1 }),
    ...zeilen([9, 9], 6, { ms: 30_000, errors: 1 }),
  ]),
  daten("Ben", [...zeilen([8, 19], 6, { ms: 50_000, errors: 2 }), ...zeilen([9, 9], 6, { ms: 45_000, errors: 2 })]),
  // Unter der Mindestmenge: kein Score, kein Punkt.
  daten("Cem", zeilen([9, 9], 1, { ms: 45_000 })),
  // Gar nicht geübt.
  daten("Dia", []),
];

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe.each(GERUEST_SPRACHEN.map((s) => [s] as const))("★★★ Klassenüberblick gerendert: %s", (s: GeruestSprache) => {
  beforeEach(() => {
    bedien.sprache = s;
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(JETZT);
  });

  /** `textContent` schliesst die unsichtbaren Sätze für die Sprachausgabe (`sr-only`) ein - genau die fielen auf Deutsch. */
  function pruefe(text: string, namen: boolean) {
    expect(text.match(FREMD)?.[0] ?? null).toBeNull();
    expect(text).not.toMatch(/[–—]/);
    if (namen) expect(text).toContain("Dia");
    expect(text).toContain(UEBERBLICK_SAETZE_NEUN[s].ohneUebungListe("Dia").slice(2, 6));
  }

  it("Monat: keine deutschen oder englischen Sätze, ihr eigener Satz steht da", () => {
    const { container } = render(<Klassenueberblick datas={KINDER} gesperrt={[]} />);
    const text = container.textContent ?? "";
    pruefe(text, true);
    expect(text).toContain(UEBERBLICK_SAETZE_NEUN[s].phraseMonat("").split(" (")[0]);
  });

  it("Schuljahr: ebenso", () => {
    const { container } = render(<Klassenueberblick datas={KINDER} gesperrt={[]} />);
    const knoepfe = screen.getAllByRole("button").filter((b) => b.getAttribute("aria-pressed") === "false");
    expect(knoepfe.length).toBeGreaterThan(0);
    act(() => {
      fireEvent.click(knoepfe[0]!);
    });
    const text = container.textContent ?? "";
    pruefe(text, true);
    expect(text).toContain(UEBERBLICK_SAETZE_NEUN[s].phraseSchuljahr("").split(" (")[0]!.trim());
  });
});

describe.each(GERUEST_SPRACHEN.map((s) => [s] as const))("★★ Alle Satz-Zweige: %s", (s: GeruestSprache) => {
  const t = UEBERBLICK_SAETZE_NEUN[s];
  const v = { richtung: "hoch", differenz: 3 } as never;
  const vRunter = { richtung: "runter", differenz: -2 } as never;
  const vGleich = { richtung: "gleich", differenz: 0 } as never;
  const k = (o: object) => ({ wert: 90, gezaehlt: 3, veraenderung: null, verglichen: 2, ...o }) as never;
  const satzBasis = {
    groesse: "treffer" as const,
    wertText: t.treffer("90%"),
    phrase: t.phraseMonat("1-2"),
    vergleich: t.vergleichSchuljahr,
    alle: 4,
    nichtGeuebt: t.ohneUebung("Dia"),
  };

  it("Kennzahl: ohne Übung, mit und ohne Vergleich, Monat und Schuljahr", () => {
    const saetze = [
      kennSatzNeun(s, { ...satzBasis, k: k({ wert: null }), art: "monat" }),
      kennSatzNeun(s, { ...satzBasis, k: k({ veraenderung: v }), art: "monat" }),
      kennSatzNeun(s, { ...satzBasis, k: k({ veraenderung: vRunter }), art: "schuljahr" }),
      kennSatzNeun(s, { ...satzBasis, k: k({}), art: "monat" }),
      kennSatzNeun(s, { ...satzBasis, k: k({}), art: "schuljahr" }),
    ];
    for (const satz of saetze) {
      expect(satz.match(FREMD)?.[0] ?? null).toBeNull();
      expect(satz).not.toMatch(/undefined|NaN|[–—]/);
    }
    expect(new Set(saetze).size).toBe(saetze.length);
    expect(saetze[3]).toContain(t.monatOhne);
    expect(saetze[4]).toContain(t.jahrOhne(5));
  });

  it("Wochenziele: alle Zweige", () => {
    const o = { art: "monat" as const, phrase: t.phraseMonat("1-2"), vergleich: t.vergleichSchuljahr, prozent: "80%" };
    const a = (x: object) => ({ aktiv: true, anteil: 0.8, veraenderung: null, ...x }) as never;
    const saetze = [
      aufgabenSatzNeun(s, { ...o, a: a({ aktiv: false }) }),
      aufgabenSatzNeun(s, { ...o, a: a({ anteil: null }) }),
      aufgabenSatzNeun(s, { ...o, a: a({ veraenderung: v }) }),
      aufgabenSatzNeun(s, { ...o, a: a({ veraenderung: vGleich }) }),
      aufgabenSatzNeun(s, { ...o, a: a({ veraenderung: vRunter }), art: "schuljahr" }),
      aufgabenSatzNeun(s, { ...o, a: a({}) }),
      aufgabenSatzNeun(s, { ...o, a: a({}), art: "schuljahr" }),
    ];
    for (const satz of saetze) {
      expect(satz.match(FREMD)?.[0] ?? null).toBeNull();
      expect(satz).not.toMatch(/undefined|NaN|[–—]/);
    }
    expect(new Set(saetze).size).toBe(saetze.length);
    expect(saetze[4]).toContain(t.zielJahrRegel);
    expect(saetze[4]).toContain(t.zielVergleichJahr);
  });

  it("Score-Leiste und Lernende", () => {
    const topf = topfTextNeun(s, [1, 2, 0, 5]);
    const lernende = lernendeTextNeun(s, { alle: 4, mindZeichen: 200, ohneScore: ["Cem"], ohneUebung: ["Dia"] });
    const hilfe = leisteHilfeNeun(s, t.phraseMonat("1-2"), topf, lernende);
    expect(hilfe.match(FREMD)?.[0] ?? null).toBeNull();
    expect(hilfe).toContain("Cem");
    expect(hilfe).toContain("Dia");
    expect(hilfe).toContain(t.verteilung);
    expect(hilfe).not.toMatch(/undefined|[–—]/);
  });

  it("Reste: Pseudowort-Satz, Reiter-Hinweis, Listendatum, eigene Vorlage", () => {
    const pseudo = [pseudoErklaerung(1, s), pseudoErklaerung(3, s), pseudoErklaerung(21, s)];
    for (const satz of pseudo) expect(satz).not.toMatch(/Gleich kommen|Tasten|Wörtern|lines|undefined|[–—]/);
    expect(new Set(pseudo).size).toBe(3);
    expect(programmReiterHinweis({ key: "tippen" } as never, s)).not.toMatch(/This tab|Dieser Reiter/);
    expect(listenDatum(JETZT, s)).not.toMatch(/^19\.09\.2026$/);
    expect(fremdeKlasseHinweis(vorlageTitel("3b", s), "3b", s)).toBeNull();
    expect(fremdeKlasseHinweis("Klasse 4a", "3b", s)).not.toBeNull();
  });
});

describe("★★ Spenden-Merker, Datum und Uhrzeit", () => {
  afterEach(() => spendeUnterwegsLoeschen());

  it.each(GERUEST_SPRACHEN.map((s) => [s] as const))("%s: die Sprache überlebt den Merker", (s) => {
    spendeUnterwegsMerken({ sprache: s });
    expect(spendeUnterwegsLesen()?.sprache).toBe(s);
  });

  it("Stellen ohne Rückgabewert: Datum und Uhrzeit im Reiter und im Nachrichtenverlauf kennen die neun", () => {
    const quelle = (p: string) => readFileSync(resolve(__dirname, "..", p), "utf8");
    // uhrzeitAusMs, Bezugswoche, Wochentag, Uhrzeit der Übungszeit.
    expect(quelle("src/components/lernwerkstatt/klasse/TastenflowReiter.tsx").match(/istGeruestSprache\(/g)?.length).toBe(4);
    expect(quelle("src/components/lernwerkstatt/LwMessageThread.tsx")).toMatch(/istGeruestSprache\(sp\)/);
  });
});
