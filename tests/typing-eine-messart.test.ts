/**
 * ★★★★★ WÄCHTER: EINE MESSART ÜBERALL (Bauplan F1c, 18.09.2026).
 *
 * Johannes: *„ich glaube nicht, dass Kinder bei Tippchallenges langsamer sind
 * als beim Üben ... ich denke, es ist ein Messfehler der Plattform"* - und:
 * *„ja, zähle nur richtige Zeichen, und ‚Überlegen' wird bestraft, Zuhören
 * natürlich nicht, mach es überall gleich"*. Die Regel steht in
 * `src/lib/typing/eineMessart.ts`:
 *
 *     Tempo = richtige Zeichen ÷ (Uhr − Zuhören − Zeilenwechsel)
 *
 * ── Wie geprüft wird ────────────────────────────────────────────────────────
 * EINE erfundene Leistung (200 richtige Zeichen, 4 Fehlgriffe, rund 60 s Uhr,
 * 10 s Zuhören - alles VOR dem ersten Anschlag einer Zeile, also die
 * Zeilenansagen -, 8 s Überlegen) läuft durch die ECHTE `TypingSession`, mit
 * gestellter Uhr und gestellter Stimme, einmal so eingehängt wie im Üben, wie
 * im Klassenmatch und wie in der Tippchallenge. Was die Session meldet, geht
 * durch dieselben Rechnungen wie in der App (`computePupilStats`, `matchApm`,
 * `pruefungsUhrMs` + `schreibzeitNachUhr` + `werteAus`). Klassenmatch und
 * Tippchallenge müssen dasselbe Tempo und denselben Leistungswert ergeben.
 *
 * ⚠️⚠️ ÜBEN BLEIBT (NOCH) BEI DER ALTEN REGEL - Entscheidung Johannes offen
 * (NACHTLAUF-2026-09-19 §3): Die Zeile beginnt beim Üben mit ihrem ERSTEN
 * Anschlag. Wer die neue Zeile auf der Braillezeile oder mit dem eigenen
 * Screenreader liest, erzeugt keine messbare Wartezeit; diese Zeit als
 * Überlegen zu zählen, senkte über Nacht genau diesen Kindern Sterne,
 * Kalibrierung, Rundenlänge und Stufe. Der Unterschied ist hier benannt und
 * beziffert (Üben 262, Klassenmatch und Tippchallenge 247), damit die
 * Entscheidung mit Zahlen fällt - und ein Wächter hält die alte Übungs-`ms`
 * fest, damit sie nicht aus Versehen wandert.
 *
 * WOHIN ER SICH BEWEGT, WENN ES SCHLECHTER WIRD
 * ([[feedback_gruener_waechter_beweist_was]]): Vor F1c ergab dieselbe
 * Leistung hier 206 (Klassenmatch) und 262 (Tippchallenge) Anschläge je
 * Minute - nachgerechnet am alten Stand. Wer in diesen beiden Modi die
 * Zeilen-Uhr wieder am ersten Anschlag beginnen lässt, die Fehlgriffe wieder
 * in den Zähler nimmt oder das Zuhören vor dem ersten Anschlag wieder fallen
 * lässt, wird hier rot.
 *
 * ⚠️ TÖNE AUS - jsdom hat kein Web-Audio. Die Stimme ist gestellt: `spokenMs`
 * und `isSpeaking` lesen eine Liste von Sprech-Abschnitten auf der
 * gestellten Uhr.
 */
import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

const sprache = vi.hoisted(() => ({ abschnitte: [] as [number, number][] }));

vi.mock("@/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing/voice")>();
  return {
    ...echt,
    spokenMs: () => {
      const jetzt = Date.now();
      return sprache.abschnitte.reduce(
        (s, [von, bis]) => s + Math.max(0, Math.min(bis, jetzt) - von),
        0,
      );
    },
    isSpeaking: () => {
      const jetzt = Date.now();
      return sprache.abschnitte.some(([von, bis]) => jetzt >= von && jetzt < bis);
    },
  };
});

vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(),
  playUnlockFanfare: vi.fn(),
  playKeySound: vi.fn(),
  playKeyTick: vi.fn(),
  playErrorSound: vi.fn(),
  playLineSound: vi.fn(),
  playSuccessSound: vi.fn(),
  playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

import { TypingSession } from "@/components/typing/TypingSession";
import { computePupilStats } from "@/lib/typing/account";
import { matchApm } from "@/lib/typing/klassenmatch";
import {
  pruefungsUhrMs,
  schreibzeitNachUhr,
  tempoJeMinute,
} from "@/lib/typing/eineMessart";
import { werteAus } from "@/lib/typing/schreibprobeAuswertung";
import { werte } from "@/lib/typing/schreibprobeWertung";
import { MIN_KEYSTROKE_MS, zeilenLuecke } from "@/lib/typing/zeilenzeit";
import { IDLE_CAP_MS } from "@/lib/typing/practiceClock";
import { ohneBildschirmTastatur } from "./_typing-probelauf";

const T0 = Date.UTC(2026, 8, 18, 8, 0, 0);
/** Ein Anschlag alle 200 ms. */
const TAKT = 200;
/** `zeilenPauseMs` in Match und Challenge. */
const PAUSE = 220;
/** Eine Zeilenansage. */
const ANSAGE = 2500;
/** Eine Denkpause. */
const DENKEN = 2000;

/** Fünf verschiedene Zeilen zu je 40 Zeichen - 200 richtige Zeichen. */
const ZEILEN = ["fj", "dk", "sl", "gh", "ru"].map(
  ([a, b]) => `${a}${b}${a}${b} `.repeat(8).slice(0, 39) + a,
);

beforeEach(() => {
  vi.useFakeTimers({ now: T0 });
  sprache.abschnitte = [];
  localStorage.clear();
  ohneBildschirmTastatur();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function vor(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function taste(feld: HTMLElement, key: string) {
  fireEvent.keyDown(feld, { key });
}

/** Eine Zeilenansage, die JETZT beginnt und `ms` dauert - das Kind wartet sie ab. */
function ansageAbwarten(ms: number) {
  const jetzt = Date.now();
  sprache.abschnitte.push([jetzt, jetzt + ms]);
  vor(ms);
}

type Einhaengung = "ueben" | "klassenmatch" | "tippchallenge";

function sitzung(art: Einhaengung) {
  const onItemDone = vi.fn();
  const onZeilenWartezeit = vi.fn();
  const onStopp = vi.fn();
  const props = (stoppSignal: number) =>
    createElement(TypingSession, {
      items: ZEILEN,
      contextId:
        art === "klassenmatch" ? "klassenmatch" : art === "tippchallenge" ? "schreibprobe" : "test",
      unlocked: new Set("fjdkslghru ".split("")),
      shiftLearned: false,
      stufe: "kids",
      voiceEnabled: false,
      onRetry: vi.fn(),
      zeilenPauseMs: PAUSE,
      onItemDone,
      onZeilenWartezeit,
      onStopp,
      stoppSignal,
      // Wie in der App: Das Match hat eine feste Uhr ab dem Start und hängt
      // Zeilen an; die Challenge startet ihre Uhr mit dem ersten Anschlag.
      // Üben lässt den Schalter weg - wie jede Übungsseite der App. So hält
      // dieser Wächter auch die VORGABE (`false`) fest.
      ...(art === "ueben" ? {} : { zeilenuhrAbAnzeige: true }),
      uhrLaeuftSchon: art === "klassenmatch",
      zeilenAnhaengen: art === "klassenmatch",
    });
  const r = render(props(0));
  const feld = screen.getByRole("textbox") as HTMLTextAreaElement;
  /** Abpfiff von aussen - so, wie Match und Challenge ihn schicken. */
  const abpfiff = () =>
    act(() => {
      r.rerender(props(1));
    });
  return { feld, onItemDone, onZeilenWartezeit, onStopp, abpfiff };
}

/** Die Leistung in einem Modus, gerechnet wie in der App: Tempo und Leistungswert. */
function miss(art: Einhaengung): { tempo: number; wert: number } {
  const { feld, onItemDone, onZeilenWartezeit } = sitzung(art);
  const { beginnMs, endeMs } = spieleLeistung(feld);
  vor(PAUSE);
  const zeilen = onItemDone.mock.calls.map((c) => c[0]);
  const zeichen = zeilen.reduce((s, z) => s + z.chars, 0);
  const fehler = zeilen.reduce((s, z) => s + z.errors, 0);
  const wartezeitMs = summe(onZeilenWartezeit, 0);
  const zeilenwechselMs = summe(onZeilenWartezeit, 1);
  cleanup();
  let tempo: number;
  if (art === "ueben") {
    tempo = computePupilStats(zeilen.map((z, i) => ({ ...z, ts: T0 + i }))).avgCpm;
  } else if (art === "klassenmatch") {
    tempo = matchApm({ zeichen, verstrichenMs: endeMs - beginnMs, wartezeitMs, zeilenwechselMs });
  } else {
    const zeitMs = 10 * 60_000;
    const schreibMs = schreibzeitNachUhr({
      uhrMs: pruefungsUhrMs(beginnMs, endeMs, zeitMs),
      zuhoerMs: wartezeitMs,
      zeilenwechselMs,
    });
    tempo = werteAus({
      probeId: "sp-1",
      niveau: "start",
      textNr: 0,
      textTitel: "",
      beginnMs,
      endeMs,
      zeitMs,
      zuschlagProzent: 0,
      wartezeitMs,
      zeilenwechselMs,
      zeichen,
      fehler,
      zeilen: zeilen.length,
      schreibMs,
      anschlaege: [],
      layout: "de",
      textZuEnde: false,
      frueherAbgegeben: false,
    }).anschlaege;
  }
  return { tempo, wert: werte({ zeichen, fehler, anschlaege: Math.round(tempo) }).wert };
}

/**
 * DIE Leistung. Erster Anschlag sofort (t = 0, bei allen drei Uhren derselbe
 * Anfang). Zeilen 2-5: nach der Zeilenwechsel-Pause eine Ansage von 2,5 s,
 * die das Kind abwartet (VOR dem ersten Anschlag). Vier Denkpausen zu 2 s -
 * eine davon VOR dem ersten Anschlag von Zeile 3. Vier Fehlgriffe („x").
 */
function spieleLeistung(feld: HTMLElement): { beginnMs: number; endeMs: number } {
  const beginnMs = Date.now();
  ZEILEN.forEach((zeile, i) => {
    for (let j = 0; j < zeile.length; j++) {
      if (j === 0 && i > 0) {
        vor(PAUSE); // die App stellt die nächste Zeile hin
        ansageAbwarten(ANSAGE); // Zuhören vor dem ersten Anschlag
        if (i === 2) vor(DENKEN); // Überlegen vor dem ersten Anschlag
      }
      if ((i === 0 && j === 20) || (i === 3 && j === 10) || (i === 4 && j === 30)) vor(DENKEN);
      if (j === 5 && i < 4) {
        vor(TAKT);
        taste(feld, "x"); // Fehlgriff - kostet Zeit, ist aber kein Anschlag fürs Tempo
      }
      if (!(i === 0 && j === 0)) vor(TAKT);
      taste(feld, zeile[j]);
    }
  });
  return { beginnMs, endeMs: Date.now() };
}

// Die Leistung in Zahlen - von Hand, damit der Wächter nicht nur sich selbst glaubt.
const ANSCHLAEGE = 200 + 4;
const UHR = (ANSCHLAEGE - 1) * TAKT + 4 * ANSAGE + 4 * DENKEN + 4 * PAUSE; // 59 480 ms
const ZUHOEREN = 4 * ANSAGE; // 10 000 ms
const ZEILENWECHSEL = 4 * PAUSE; // 880 ms
const SCHREIBZEIT = UHR - ZUHOEREN - ZEILENWECHSEL; // 48 600 ms: Tippen + Überlegen
const TEMPO = (200 / SCHREIBZEIT) * 60_000; // 246,9 Anschläge/Min
/**
 * Was beim ÜBEN (alte Regel) nicht zählt: die Zeit vor dem ersten Anschlag
 * der Zeilen 2-5 ohne das Zuhören - 4 × 200 ms bis zum Anschlag und die 2 s
 * Überlegen vor Zeile 3. (Das Zuhören fällt dort ebenfalls weg - wie in Match
 * und Challenge, nur ungemessen.)
 */
const UEBEN_NICHT_GEZAEHLT = 4 * TAKT + DENKEN; // 2 800 ms
const UEBEN_SCHREIBZEIT = SCHREIBZEIT - UEBEN_NICHT_GEZAEHLT; // 45 800 ms
const UEBEN_TEMPO = (200 / UEBEN_SCHREIBZEIT) * 60_000; // 262,0 Anschläge/Min

function summe(fn: ReturnType<typeof vi.fn>, arg: number): number {
  return fn.mock.calls.reduce((s, c) => s + (c[arg] as number), 0);
}

describe("★★★★★ Dieselbe Leistung - dasselbe Tempo in Klassenmatch und Tippchallenge", () => {
  it("die erfundene Leistung ist die aus dem Auftrag (rund 60 s Uhr, 10 s Zuhören, 8 s Überlegen)", () => {
    expect(UHR).toBe(59_480);
    expect(SCHREIBZEIT).toBe(48_600);
    expect(Math.round(TEMPO)).toBe(247);
  });

  it("★ Üben (alte Regel): die Zeile beginnt mit ihrem ersten Anschlag", () => {
    const { feld, onItemDone, onZeilenWartezeit } = sitzung("ueben");
    spieleLeistung(feld);
    vor(PAUSE);
    expect(onItemDone).toHaveBeenCalledTimes(5);
    const zeilen = onItemDone.mock.calls.map((c) => c[0]);
    // Richtige Zeichen im Zähler - `chars` ist die Zeilenlänge, Fehlgriffe
    // stehen getrennt in `errors`. Das war beim Üben schon immer so.
    expect(zeilen.map((z) => z.chars)).toEqual([40, 40, 40, 40, 40]);
    expect(zeilen.map((z) => z.errors)).toEqual([1, 1, 1, 1, 0]);
    // Je Zeile: 39 Lücken zu den richtigen Zeichen + 1 zum Fehlgriff, dazu
    // die Denkpausen MITTEN in der Zeile. Alles vor dem ersten Anschlag -
    // Ansage, 200 ms, die 2 s Überlegen vor Zeile 3 - zählt nicht.
    expect(zeilen.map((z) => z.ms)).toEqual([
      40 * TAKT + DENKEN,
      40 * TAKT,
      40 * TAKT,
      40 * TAKT + DENKEN,
      39 * TAKT + DENKEN,
    ]);
    expect(zeilen.reduce((s, z) => s + z.ms, 0)).toBe(UEBEN_SCHREIBZEIT);
    // Die Ansagen lagen alle VOR einem ersten Anschlag - beim Üben ungemessen.
    expect(summe(onZeilenWartezeit, 0)).toBe(0);
    expect(summe(onZeilenWartezeit, 1)).toBe(0);
    const tempo = computePupilStats(zeilen.map((z, i) => ({ ...z, ts: T0 + i }))).avgCpm;
    expect(tempo).toBeCloseTo(UEBEN_TEMPO, 6);
  });

  it("★ Klassenmatch: feste Uhr ab dem Start, minus Zuhören und Zeilenwechsel, nur richtige Zeichen", () => {
    const { feld, onItemDone, onZeilenWartezeit } = sitzung("klassenmatch");
    const { beginnMs, endeMs } = spieleLeistung(feld);
    const wartezeitMs = summe(onZeilenWartezeit, 0);
    const zeilenwechselMs = summe(onZeilenWartezeit, 1);
    expect(wartezeitMs, "das Zuhören VOR dem ersten Anschlag fehlt").toBe(ZUHOEREN);
    expect(zeilenwechselMs).toBe(ZEILENWECHSEL);
    const zeichen = onItemDone.mock.calls.reduce((s, c) => s + c[0].chars, 0);
    const fehler = onItemDone.mock.calls.reduce((s, c) => s + c[0].errors, 0);
    expect(zeichen).toBe(200);
    expect(fehler).toBe(4);
    const apm = matchApm({ zeichen, verstrichenMs: endeMs - beginnMs, wartezeitMs, zeilenwechselMs });
    expect(endeMs - beginnMs).toBe(UHR);
    expect(apm).toBe(Math.round(TEMPO));
    // ⚠️ Fehlgriffe sind keine Anschläge: mit ihnen im Zähler wäre es 252.
    expect(apm).not.toBe(Math.round((ANSCHLAEGE / SCHREIBZEIT) * 60_000));
  });

  it("★ Tippchallenge: Prüfungsuhr (erster Anschlag bis Abgabe) minus Zuhören und Zeilenwechsel", () => {
    const { feld, onItemDone, onZeilenWartezeit } = sitzung("tippchallenge");
    const { beginnMs, endeMs } = spieleLeistung(feld);
    const wartezeitMs = summe(onZeilenWartezeit, 0);
    const zeilenwechselMs = summe(onZeilenWartezeit, 1);
    const zeitMs = 10 * 60_000;
    // Dieselbe Rechnung wie `SchreibprobeLauf.beenden`.
    const schreibMs = schreibzeitNachUhr({
      uhrMs: pruefungsUhrMs(beginnMs, endeMs, zeitMs),
      zuhoerMs: wartezeitMs,
      zeilenwechselMs,
    });
    expect(schreibMs).toBe(SCHREIBZEIT);
    const e = werteAus({
      probeId: "sp-1",
      niveau: "start",
      textNr: 0,
      textTitel: "",
      beginnMs,
      endeMs,
      zeitMs,
      zuschlagProzent: 0,
      wartezeitMs,
      zeilenwechselMs,
      zeichen: onItemDone.mock.calls.reduce((s, c) => s + c[0].chars, 0),
      fehler: onItemDone.mock.calls.reduce((s, c) => s + c[0].errors, 0),
      zeilen: 5,
      schreibMs,
      anschlaege: [],
      layout: "de",
      textZuEnde: false,
      frueherAbgegeben: false,
    });
    expect(e.anschlaege).toBe(Math.round(TEMPO));
    expect(e.zeilenwechselMs).toBe(ZEILENWECHSEL);
  });

  it("★★★★★ Klassenmatch und Tippchallenge nebeneinander: dasselbe Tempo, derselbe Leistungswert", () => {
    const match = miss("klassenmatch");
    const challenge = miss("tippchallenge");
    expect(match.tempo).toBe(Math.round(TEMPO));
    expect(challenge.tempo).toBe(Math.round(TEMPO));
    expect(challenge.wert).toBe(match.wert);
  });

  it("⚠️ zeitMs vor dem ersten Anschlag zählt beim Üben nicht - Entscheidung Johannes offen, NACHTLAUF §3", () => {
    // Derselbe Lauf beim Üben: 262 statt 247 Anschläge je Minute. Der ganze
    // Unterschied ist die Zeit vor dem ersten Anschlag jeder Zeile (ohne das
    // Zuhören) - 2,8 s von 48,6 s. Stellt Johannes das Üben um, wird dieser
    // Test umgeschrieben, nicht still grün.
    const ueben = miss("ueben");
    const match = miss("klassenmatch");
    expect(Math.round(ueben.tempo)).toBe(262);
    expect(match.tempo).toBe(247);
    expect(ueben.tempo).toBeCloseTo((200 / (SCHREIBZEIT - UEBEN_NICHT_GEZAEHLT)) * 60_000, 6);
    // Der Leistungswert ist hier gleich - nur weil beide über dem Bezugstempo
    // (240) liegen, an dem `werte()` deckelt. Darunter ginge der Unterschied
    // voll in den Wert.
    expect(ueben.wert).toBe(match.wert);
  });
});

describe("★★★★★ Zuhören VOR dem ersten Anschlag - in Match und Challenge abgezogen, nie doppelt; Üben unverändert", () => {
  it("Klassenmatch: schon die ERSTE Zeile misst ab dem Start - ihre Ansage wird abgezogen", () => {
    const { feld, onZeilenWartezeit } = sitzung("klassenmatch");
    ansageAbwarten(3000); // Ansage der ersten Zeile, die Uhr des Matches läuft schon
    vor(DENKEN); // und überlegen - das zählt
    for (const z of ZEILEN[0]) {
      vor(TAKT);
      taste(feld, z);
    }
    expect(onZeilenWartezeit).toHaveBeenCalledTimes(1);
    expect(onZeilenWartezeit.mock.calls[0][0]).toBe(3000);
    expect(onZeilenWartezeit.mock.calls[0][1]).toBe(0); // vor der ersten Zeile kein Wechsel
  });

  it("Tippchallenge VOR dem Beginn: die Ansage der ersten Zeile liegt vor der Prüfungsuhr - kein Abzug", () => {
    // Die Uhr startet mit dem ersten Anschlag. Was davor gesprochen wurde,
    // lief nie auf ihr - es abzuziehen hiesse, Zeit zu schenken.
    const { feld, onZeilenWartezeit, onItemDone } = sitzung("tippchallenge");
    ansageAbwarten(3000);
    vor(DENKEN);
    taste(feld, ZEILEN[0][0]);
    for (const z of ZEILEN[0].slice(1)) {
      vor(TAKT);
      taste(feld, z);
    }
    expect(onZeilenWartezeit.mock.calls[0][0]).toBe(0);
    expect(onItemDone.mock.calls[0][0].ms).toBe(39 * TAKT);
  });

  it("★ Üben: die Zeilenzeit ist die alte - für eine erfundene Zeile Zahl für Zahl nachgerechnet", () => {
    // Die alte Regel (vor F1c), von Hand: Die Zeile beginnt mit dem ersten
    // Anschlag; jede Lücke danach zählt, das Zuhören MITTEN in der Zeile geht
    // ab, Überlegen zählt bis zur Pausentoleranz.
    const { feld, onItemDone, onZeilenWartezeit, onStopp } = sitzung("ueben");
    ansageAbwarten(3000); // Ansage vor dem ersten Anschlag: zählt beim Üben nicht
    vor(DENKEN); // Überlegen vor dem ersten Anschlag: zählt beim Üben auch nicht
    taste(feld, ZEILEN[0][0]);
    for (let j = 1; j < ZEILEN[0].length; j++) {
      if (j === 10) ansageAbwarten(1500); // Zuhören mitten in der Zeile: geht ab
      if (j === 20) vor(DENKEN); // Überlegen mitten in der Zeile: zählt
      vor(TAKT);
      taste(feld, ZEILEN[0][j]);
    }
    expect(onItemDone.mock.calls[0][0].ms).toBe(39 * TAKT + DENKEN);
    expect(onZeilenWartezeit.mock.calls[0]).toEqual([1500, 0]);
    // Zeile 2 ebenso ab ihrem ersten Anschlag, auch nach Pause, Ansage und Überlegen.
    vor(PAUSE);
    ansageAbwarten(3000);
    vor(DENKEN);
    for (const z of ZEILEN[1]) {
      vor(TAKT);
      taste(feld, z);
    }
    expect(onItemDone.mock.calls[1][0].ms).toBe(39 * TAKT);
    expect(onZeilenWartezeit.mock.calls[1]).toEqual([0, 0]);
    expect(onStopp).not.toHaveBeenCalled();
  });

  it("★ Abpfiff mitten im Zuhören: die angefangene Zeile meldet ihr Zuhören mit", () => {
    const { feld, onStopp, abpfiff } = sitzung("klassenmatch");
    for (const z of ZEILEN[0]) {
      vor(TAKT);
      taste(feld, z);
    }
    vor(PAUSE); // die zweite Zeile steht da
    ansageAbwarten(ANSAGE); // und die Zeit ist um, während das Kind zuhört
    abpfiff();
    expect(onStopp).toHaveBeenCalledTimes(1);
    expect(onStopp.mock.calls[0][0]).toMatchObject({
      chars: 0,
      wartezeitMs: ANSAGE,
      zeilenwechselMs: PAUSE,
    });
  });

  it("★ Abpfiff in der Zeilenwechsel-Pause: die Pause bis dahin ist Zeit der App", () => {
    const { feld, onStopp, abpfiff } = sitzung("klassenmatch");
    for (const z of ZEILEN[0]) {
      vor(TAKT);
      taste(feld, z);
    }
    vor(100); // mitten in der Pause
    abpfiff();
    expect(onStopp.mock.calls[0][0]).toMatchObject({
      chars: 0,
      wartezeitMs: 0,
      zeilenwechselMs: 100,
    });
  });
});

describe("Die Regel als Rechnung", () => {
  it("zeilenLuecke: ERST Zuhören abziehen, DANN Überlegen kappen", () => {
    // 12 s Lücke: 10 s Zeilenansage, 2 s überlegt. Toleranz 8 s.
    // F1 kappte zuerst die Lücke (8 s) und zog dann 10 s ab ⇒ 40 ms Überlegen.
    const l = zeilenLuecke(12_000, 10_000, false, 8_000);
    expect(l).toEqual({ zeileMs: 2_000, zuhoerMs: 10_000 });
  });

  it("zeilenLuecke: Zuhören ist ungekappt, Überlegen über der Toleranz zählt nicht als Zeilenzeit", () => {
    const l = zeilenLuecke(60_000, 5_000, false, IDLE_CAP_MS);
    expect(l.zuhoerMs).toBe(5_000);
    expect(l.zeileMs).toBe(IDLE_CAP_MS);
    expect(l.zeileMs + l.zuhoerMs).toBeLessThanOrEqual(60_000);
  });

  it("zeilenLuecke: parallel getippt ⇒ kein Zuhören; der Boden nimmt nie mehr als die Lücke", () => {
    expect(zeilenLuecke(1_000, 900, true, IDLE_CAP_MS)).toEqual({ zeileMs: 1_000, zuhoerMs: 0 });
    const b = zeilenLuecke(1_000, 1_000, false, IDLE_CAP_MS);
    expect(b.zeileMs).toBe(MIN_KEYSTROKE_MS);
    expect(b.zeileMs + b.zuhoerMs).toBe(1_000);
  });

  it("die Prüfungsuhr ist nie länger als die gewährte Zeit - und ohne Beginn null", () => {
    expect(pruefungsUhrMs(T0, T0 + 3 * 60 * 60_000, 10 * 60_000)).toBe(10 * 60_000);
    expect(pruefungsUhrMs(T0, T0 + 90_000, 10 * 60_000)).toBe(90_000);
    expect(pruefungsUhrMs(0, T0, 10 * 60_000)).toBe(0);
  });

  it("Schreibzeit und Tempo werden nie negativ", () => {
    expect(schreibzeitNachUhr({ uhrMs: 1_000, zuhoerMs: 5_000, zeilenwechselMs: 500 })).toBe(0);
    expect(tempoJeMinute(100, 0)).toBe(0);
    expect(tempoJeMinute(0, 60_000)).toBe(0);
  });
});
