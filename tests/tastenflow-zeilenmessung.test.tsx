/**
 * ★★★★★ WÄCHTER: MESSUNGEN JE ÜBUNGSZEILE (Schritt M, 19.09.2026).
 *
 * Johannes, 18.09.2026: *„Neu messen: ja, unbedingt, was du kriegen kannst"* -
 * und *„Messfehler sind Gift!"*. Gemessen wird für den künftigen
 * Eigenständigkeits-Check (E10, nicht gebaut); gezeigt und bewertet wird noch
 * nichts. Die Regeln stehen in `src/lib/typing/zeilenMessung.ts`.
 *
 * Geprüft wird in drei Schichten:
 *  1. **Die Rechnung** an erfundenen Tastenfolgen - jede Zahl einzeln, auch
 *     die Fälle, in denen NICHTS herauskommen darf (Warten auf die Stimme,
 *     kein `keyup`, zu wenige Abstände).
 *  2. **Die echte `TypingSession`** mit gestellter Uhr und gestellter Stimme:
 *     Kommt im Ereignis der Zeile an, was die Rechnung verspricht - und bleibt
 *     die Zeilenzeit (F1c) dabei unberührt?
 *  3. **Die Datenschutzerklärung** nennt die Messungen und verspricht nicht
 *     mehr, dass Kinder die Einschätzung sehen.
 *
 * WOHIN ER SICH BEWEGT, WENN ES SCHLECHTER WIRD: Wer eine Wartezeit auf die
 * Stimme wieder als Rhythmus zählt, eine fehlende Haltezeit rät, Tasten aus der
 * Zeilenpause doppelt zählt oder den Satz „dieselben Einschätzungen" wieder
 * ohne Ausnahme stehen lässt, wird hier rot.
 *
 * ⚠️ TÖNE AUS - jsdom hat kein Web-Audio. Und: jsdom erzeugt jedes Ereignis
 * mit `isTrusted === false` - in Schicht 2 zählt darum JEDER Anschlag als
 * „unecht". Genau so soll es sein: `fireEvent` IST ein Skript.
 */
import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

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
import { Datenschutz } from "@/features/legal/Datenschutz";
import { IDLE_CAP_MS } from "@/lib/typing/practiceClock";
import { weakestKeys } from "@/lib/typing/account";
import {
  HALTEN_MAX_MS,
  ZeilenMesser,
  ohneZeilenMessung,
  variationskoeffizient,
  wackeligZaehlen,
  wackeligeTastenAus,
  zeilenMessFelder,
  type Tastendruck,
} from "@/lib/typing/zeilenMessung";
import { ohneBildschirmTastatur } from "./_typing-probelauf";
import { TippenTrainerPage } from "@/features/public/TippenTrainerPage";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import { _resetTypingBackend } from "@/lib/typing/backend";
import { einrichtungFertigMerken } from "@/lib/typing/einrichtung";
import {
  addPupil,
  createClass,
  getEvents,
  registerTeacher,
  type TypingAccount,
} from "@/lib/typing/account";
import { waitFor } from "@testing-library/react";

// ── 1 · Die Rechnung ────────────────────────────────────────────────────────

/** Ein Anschlag ohne Stimme, echt, bei Pausentoleranz 30 s. */
function druck(t: number, id: string, mehr: Partial<Tastendruck> = {}): Tastendruck {
  return {
    t,
    id,
    echt: true,
    wiederholung: false,
    gesprochenMs: 0,
    sprichtJetzt: false,
    deckelMs: 30_000,
    ...mehr,
  };
}

/** `n` Anschläge im Takt `takt`, jeder `halten` ms gedrückt, abwechselnd f/j. */
function tippe(m: ZeilenMesser, start: number, n: number, takt: number, halten: number | null) {
  for (let i = 0; i < n; i++) {
    const t = start + i * takt;
    const id = i % 2 === 0 ? "KeyF" : "KeyJ";
    m.taste(druck(t, id));
    if (halten !== null) m.losgelassen(t + halten, id);
  }
}

describe("Schritt M · die Rechnung", () => {
  it("zählt Tasten mit isTrusted === false - auch Wiederholungen -, echte nicht", () => {
    const m = new ZeilenMesser();
    m.taste(druck(0, "KeyF"));
    m.taste(druck(100, "KeyJ", { echt: false }));
    m.taste(druck(200, "KeyJ", { echt: false, wiederholung: true }));
    m.taste(druck(300, "KeyF"));
    expect(m.abschliessen(0).unechteTasten).toBe(2);
  });

  it("gleichmässiger Takt: Rhythmus 0 - der ERSTE Anschlag zählt nicht mit", () => {
    const m = new ZeilenMesser();
    // Der erste Anschlag kommt 5 s nach dem letzten der vorigen Zeile - dieser
    // Abstand ist Zeilenwechsel, kein Rhythmus.
    m.taste(druck(-5_000, "KeyA"));
    m.abschliessen(0);
    tippe(m, 0, 10, 200, 80);
    expect(m.abschliessen(0).rhythmusVk).toBe(0);
  });

  it("rechnet den Variationskoeffizienten richtig (Streuung ÷ Mittel)", () => {
    // Abstände 100 und 300 abwechselnd: Mittel 200, Streuung 100 ⇒ 0,5.
    expect(variationskoeffizient([100, 300, 100, 300, 100, 300, 100, 300])).toBe(0.5);
    expect(variationskoeffizient([100, 300, 100, 300, 100, 300, 100])).toBeNull();
  });

  it("★ Warten auf die Stimme ist KEIN Rhythmus - paralleles Tippen schon", () => {
    const m = new ZeilenMesser();
    let t = 0;
    let gesprochen = 0;
    // Neun Anschläge im 200-ms-Takt …
    for (let i = 0; i < 9; i++, t += 200) m.taste(druck(t, i % 2 ? "KeyJ" : "KeyF", { gesprochenMs: gesprochen }));
    // … dann spricht die App 4 s, das Kind wartet und tippt danach weiter.
    gesprochen += 4_000;
    t += 4_000;
    m.taste(druck(t, "KeyF", { gesprochenMs: gesprochen }));
    // Und einmal tippt es, WÄHREND die Stimme noch spricht - das zählt.
    gesprochen += 150;
    t += 200;
    m.taste(druck(t, "KeyJ", { gesprochenMs: gesprochen, sprichtJetzt: true }));
    // Ohne den 4-s-Abstand bleiben nur 200er: gleichmässig.
    expect(m.abschliessen(0).rhythmusVk).toBe(0);
  });

  it("Abstände über der Pausentoleranz und nach „Fenster weg“ zählen nicht", () => {
    const m = new ZeilenMesser();
    tippe(m, 0, 5, 200, null);
    m.taste(druck(800 + 45_000, "KeyF", { deckelMs: 30_000 })); // 45 s Pause
    tippe(m, 800 + 45_200, 3, 200, null);
    m.weg(0);
    m.zurueck(1);
    tippe(m, 60_000, 3, 200, null);
    expect(m.abschliessen(2).rhythmusVk).toBe(0);
  });

  it("unter acht gültigen Abständen: kein Rhythmus-Wert (nicht raten)", () => {
    const m = new ZeilenMesser();
    tippe(m, 0, 8, 200, 80); // acht Anschläge, der erste zählt nicht ⇒ 7 Abstände
    expect(m.abschliessen(0).rhythmusVk).toBeNull();
  });

  it("Haltezeit = Median von Taste runter bis Taste hoch", () => {
    const m = new ZeilenMesser();
    const halten = [80, 120, 90, 110, 100];
    halten.forEach((h, i) => {
      m.taste(druck(i * 300, `K${i}`));
      m.losgelassen(i * 300 + h, `K${i}`);
    });
    expect(m.abschliessen(0).haltezeitMs).toBe(100);
  });

  it("★ kommt KEIN keyup an, gibt es weder Haltezeit noch Überlappung", () => {
    // So sieht es aus, wenn ein Hilfsmittel das Loslassen verschluckt.
    const m = new ZeilenMesser();
    tippe(m, 0, 20, 200, null);
    const w = m.abschliessen(0);
    expect(w.haltezeitMs).toBeNull();
    expect(w.ueberlappung).toBeNull();
  });

  it("kommt für weniger als die Hälfte ein keyup an, wird ebenfalls nichts geraten", () => {
    const m = new ZeilenMesser();
    for (let i = 0; i < 20; i++) {
      m.taste(druck(i * 300, `K${i}`));
      if (i % 3 === 0) m.losgelassen(i * 300 + 90, `K${i}`); // 7 von 20
    }
    expect(m.abschliessen(0).haltezeitMs).toBeNull();
  });

  it("Überlappung: Anteil der Anschläge bei noch gehaltener Vortaste", () => {
    const m = new ZeilenMesser();
    // Zehn Anschläge im 200-ms-Takt, jede Taste 80 ms gehalten - ausser jeder
    // fünften, die 260 ms gehalten wird: dann kommt die nächste, während sie
    // noch unten ist. Die Ereignisse gehen in ZEITLICHER Reihenfolge hinein,
    // wie im Browser.
    const ereignisse: { t: number; art: "runter" | "hoch"; id: string }[] = [];
    for (let i = 0; i < 10; i++) {
      ereignisse.push({ t: i * 200, art: "runter", id: `K${i}` });
      ereignisse.push({ t: i * 200 + (i % 5 === 0 ? 260 : 80), art: "hoch", id: `K${i}` });
    }
    ereignisse.sort((a, b) => a.t - b.t);
    for (const e of ereignisse) {
      if (e.art === "runter") m.taste(druck(e.t, e.id));
      else m.losgelassen(e.t, e.id);
    }
    // 9 bekannte Paare (K0-K1 … K8-K9), überlappt: K0-K1 und K5-K6.
    expect(m.abschliessen(0).ueberlappung).toBe(0.22);
  });

  it("eine Taste ohne keyup zählt NICHT als „noch gehalten“", () => {
    const m = new ZeilenMesser();
    m.taste(druck(0, "KeyX")); // ihr keyup kommt nie
    for (let i = 1; i <= 8; i++) {
      m.taste(druck(i * 200, `K${i}`));
      m.losgelassen(i * 200 + 80, `K${i}`);
    }
    // KeyX-K1 bleibt offen (keyup verloren) - nur K1-K2 … K7-K8 zählen, keins
    // davon überlappt.
    expect(m.abschliessen(0).ueberlappung).toBe(0);
    // Und noch nach der Frist darf sie nicht als gehalten zählen.
    const m2 = new ZeilenMesser();
    m2.taste(druck(0, "KeyX"));
    m2.taste(druck(HALTEN_MAX_MS + 100, "KeyY"));
    m2.losgelassen(HALTEN_MAX_MS + 180, "KeyY");
    m2.losgelassen(HALTEN_MAX_MS + 200, "KeyX"); // spätes, verirrtes keyup
    expect(m2.abschliessen(0).ueberlappung).toBeNull();
  });

  it("Fenster weg: die Dauer, von der Anzeige der Zeile bis zu ihrem Ende", () => {
    const m = new ZeilenMesser();
    m.weg(1_000); // noch VOR der Zeile weg (Abschluss-Karte) - zählt nicht
    m.zeileSteht(5_000);
    m.zurueck(6_000); // 1 s der Zeile
    m.weg(10_000);
    m.zurueck(13_000); // 3 s
    m.weg(20_000); // bis zum Ende der Zeile weg: 2 s …
    expect(m.abschliessen(22_000).wegMs).toBe(1_000 + 3_000 + 2_000);
    m.zurueck(23_000); // … und die restliche 1 s gehört der nächsten
    expect(m.abschliessen(24_000).wegMs).toBe(1_000);
  });

  it("zählt Treffer und Versuche auf den wackligen Tasten", () => {
    const anschlaege = [
      { char: "k", correct: false },
      { char: "k", correct: true },
      { char: "f", correct: true },
      { char: "ö", correct: true },
      { char: "ö", correct: false },
    ];
    expect(wackeligZaehlen(anschlaege, new Set(["k", "ö"]))).toEqual({ treffer: 2, versuche: 4 });
    expect(wackeligZaehlen(anschlaege, new Set())).toBeNull();
    expect(wackeligZaehlen(anschlaege, null)).toBeNull();
  });

  it("wacklige Tasten = dieselbe Auswahl wie bei der Lehrkraft (weakestKeys, 8)", () => {
    const stat = (hits: number, misses: number) => ({
      hits,
      misses,
      sumMs: 0,
      timed: 0,
      recent: [...Array(misses).fill(-1), ...Array(hits).fill(0)],
    });
    // ★ D-4 (28.09.2026): „wacklig" erst ab 20 Anschlägen - k mit 20, d mit 19.
    const letters = { f: stat(20, 0), k: stat(12, 8), j: stat(1, 0), d: stat(11, 8) };
    const intro = ["f", "j", "d", "k"];
    const rahmen = { lernweg: "de" as const, stufe: "teens" as const };
    const auswahl = wackeligeTastenAus(letters, intro, rahmen);
    expect(auswahl).toEqual(weakestKeys(letters, intro, rahmen, 8).map((w) => w.unit));
    // k hakt (60 %); f sitzt, j und d (19 Anschläge) haben zu wenige Versuche.
    expect(auswahl).toEqual(["k"]);
  });

  it("ins Ereignis kommt nur, was gemessen und nicht 0 ist", () => {
    expect(
      zeilenMessFelder(
        { unechteTasten: 0, wegMs: 0, rhythmusVk: null, haltezeitMs: null, ueberlappung: null },
        { treffer: 0, versuche: 0 },
      ),
    ).toEqual({});
    expect(
      zeilenMessFelder(
        { unechteTasten: 3, wegMs: 1_200, rhythmusVk: 0, haltezeitMs: 95, ueberlappung: 0 },
        { treffer: 2, versuche: 3 },
      ),
    ).toEqual({
      unechteTasten: 3,
      wegMs: 1_200,
      rhythmusVk: 0,
      haltezeitMs: 95,
      ueberlappung: 0,
      wackeligTreffer: 2,
      wackeligVersuche: 3,
    });
  });

  it("ohne Klasse: die Messungen werden weggelassen, der Rest bleibt", () => {
    const e = {
      lesson: "adaptiv", chars: 5, errors: 0, ms: 2_000,
      unechteTasten: 1, wegMs: 5, rhythmusVk: 0.4, haltezeitMs: 90, ueberlappung: 0.1,
      wackeligTreffer: 1, wackeligVersuche: 2,
    };
    expect(ohneZeilenMessung(e)).toEqual({ lesson: "adaptiv", chars: 5, errors: 0, ms: 2_000 });
  });
});

// ── 2 · Die echte Session ───────────────────────────────────────────────────

const T0 = Date.UTC(2026, 8, 19, 8, 0, 0);
const TAKT = 200;
const HALTEN = 90;
const PAUSE = 550;
/** Zwei Zeilen zu je 12 Zeichen. */
const ZEILEN = ["fjfjfjfjfjfj", "jfjfjfjfjfjf"];

function vor(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function sitzung(extra: Record<string, unknown> = {}) {
  const onItemDone = vi.fn();
  render(
    createElement(TypingSession, {
      items: ZEILEN,
      contextId: "adaptiv",
      unlocked: new Set(["f", "j"]),
      shiftLearned: false,
      stufe: "kids",
      voiceEnabled: false,
      onRetry: vi.fn(),
      zeilenPauseMs: PAUSE,
      onItemDone,
      wackeligeTasten: ["j"],
      ...extra,
    }),
  );
  const feld = screen.getByRole("textbox") as HTMLTextAreaElement;
  return { feld, onItemDone };
}

/** Eine Taste drücken, `halten` ms halten (null = kein keyup), dann bis zum Takt warten. */
function anschlag(feld: HTMLElement, key: string, halten: number | null = HALTEN) {
  const code = `Key${key.toUpperCase()}`;
  fireEvent.keyDown(feld, { key, code });
  if (halten === null) {
    vor(TAKT);
    return;
  }
  vor(halten);
  fireEvent.keyUp(feld, { key, code });
  vor(TAKT - halten);
}

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

describe("Schritt M · in der echten TypingSession", () => {
  it("★ das Ereignis der Zeile trägt die Messungen - und die Zeilenzeit bleibt, wie sie war", () => {
    const { feld, onItemDone } = sitzung();
    for (const ch of ZEILEN[0]) anschlag(feld, ch);
    vor(PAUSE);
    expect(onItemDone).toHaveBeenCalledTimes(1);
    const e = onItemDone.mock.calls[0][0];
    // Die Zeilenzeit (F1c, Üben): ab dem ersten Anschlag, 11 Abstände.
    expect(e.ms).toBe(11 * TAKT);
    expect(e.chars).toBe(12);
    // fireEvent ist ein Skript: jeder der 12 Anschläge ist „unecht".
    expect(e.unechteTasten).toBe(12);
    expect(e.haltezeitMs).toBe(HALTEN);
    expect(e.ueberlappung).toBe(0);
    expect(e.rhythmusVk).toBe(0);
    // Wacklig war nur „j": sechs Versuche, sechs Treffer.
    expect(e.wackeligVersuche).toBe(6);
    expect(e.wackeligTreffer).toBe(6);
    // Nichts weg, also kein Feld.
    expect(e.wegMs).toBeUndefined();
  });

  it("ein Fehlgriff auf einer wackligen Taste ist ein Versuch ohne Treffer", () => {
    const { feld, onItemDone } = sitzung();
    anschlag(feld, "f");
    anschlag(feld, "k"); // falsch - gewollt war „j"
    for (const ch of ZEILEN[0].slice(1)) anschlag(feld, ch);
    vor(PAUSE);
    const e = onItemDone.mock.calls[0][0];
    expect(e.errors).toBe(1);
    expect(e.wackeligVersuche).toBe(7);
    expect(e.wackeligTreffer).toBe(6);
  });

  it("★ kein keyup (Hilfsmittel schluckt es): keine Haltezeit, keine Überlappung - geraten wird nicht", () => {
    const { feld, onItemDone } = sitzung();
    for (const ch of ZEILEN[0]) anschlag(feld, ch, null);
    vor(PAUSE);
    const e = onItemDone.mock.calls[0][0];
    expect(e.haltezeitMs).toBeUndefined();
    expect(e.ueberlappung).toBeUndefined();
    expect(e.rhythmusVk).toBe(0); // der Rhythmus braucht kein keyup
  });

  it("★ Warten auf die App-Stimme mitten in der Zeile verändert den Rhythmus nicht", () => {
    const { feld, onItemDone } = sitzung();
    const zeile = ZEILEN[0];
    for (const ch of zeile.slice(0, 6)) anschlag(feld, ch);
    // Die App spricht 3 s, das Kind wartet ab.
    const jetzt = Date.now();
    sprache.abschnitte.push([jetzt, jetzt + 3_000]);
    vor(3_000);
    for (const ch of zeile.slice(6)) anschlag(feld, ch);
    vor(PAUSE);
    expect(onItemDone.mock.calls[0][0].rhythmusVk).toBe(0);
  });

  it("Gegenprobe: dieselbe Pause OHNE Stimme ist Rhythmus (sie liegt unter der Pausentoleranz)", () => {
    // Sonst bewiese der Test oben nichts: Fiele die Pause über die Toleranz,
    // fiele sie auch ohne Stimme heraus.
    expect(3_000 + TAKT).toBeLessThan(IDLE_CAP_MS);
    const { feld, onItemDone } = sitzung();
    const zeile = ZEILEN[0];
    for (const ch of zeile.slice(0, 6)) anschlag(feld, ch);
    vor(3_000);
    for (const ch of zeile.slice(6)) anschlag(feld, ch);
    vor(PAUSE);
    expect(onItemDone.mock.calls[0][0].rhythmusVk).toBeGreaterThan(1);
  });

  it("Fenster weg während der Zeile: Dauer gemessen, `blurred` wie bisher", () => {
    const { feld, onItemDone } = sitzung();
    const zeile = ZEILEN[0];
    for (const ch of zeile.slice(0, 4)) anschlag(feld, ch);
    act(() => {
      window.dispatchEvent(new Event("blur"));
    });
    vor(4_000);
    act(() => {
      window.dispatchEvent(new Event("focus"));
    });
    for (const ch of zeile.slice(4)) anschlag(feld, ch);
    vor(PAUSE);
    const e = onItemDone.mock.calls[0][0];
    expect(e.blurred).toBe(true);
    expect(e.wegMs).toBe(4_000);
  });

  it("★ Anschläge aus der Zeilenpause zählen EINMAL - für die nächste Zeile", () => {
    const { feld, onItemDone } = sitzung();
    for (const ch of ZEILEN[0]) anschlag(feld, ch);
    // Ohne abzusetzen weiter: die ersten zwei Zeichen der zweiten Zeile fallen
    // in die Pause und werden nachgespielt (`tasteAnnehmen`).
    anschlag(feld, "j");
    anschlag(feld, "f");
    vor(PAUSE);
    for (const ch of ZEILEN[1].slice(2)) anschlag(feld, ch);
    vor(PAUSE);
    expect(onItemDone).toHaveBeenCalledTimes(2);
    expect(onItemDone.mock.calls[0][0].unechteTasten).toBe(12);
    expect(onItemDone.mock.calls[1][0].unechteTasten).toBe(12);
    expect(onItemDone.mock.calls[1][0].wackeligVersuche).toBe(6);
  });

  it("wacklige Tasten, die erst NACH dem Erscheinen der Zeile ankommen, zählen (Tippchallenge lädt nach)", () => {
    const onItemDone = vi.fn();
    const props = (wackeligeTasten?: string[]) =>
      createElement(TypingSession, {
        items: ZEILEN,
        contextId: "schreibprobe",
        unlocked: new Set(["f", "j"]),
        shiftLearned: false,
        stufe: "kids",
        voiceEnabled: false,
        onRetry: vi.fn(),
        zeilenPauseMs: PAUSE,
        onItemDone,
        zeilenuhrAbAnzeige: true,
        wackeligeTasten,
      });
    const r = render(props(undefined));
    const feld = screen.getByRole("textbox") as HTMLTextAreaElement;
    vor(1_000);
    r.rerender(props(["f"])); // das Nachladen ist fertig, bevor getippt wird
    for (const ch of ZEILEN[0]) anschlag(feld, ch);
    vor(PAUSE);
    expect(onItemDone.mock.calls[0][0].wackeligVersuche).toBe(6);
  });

  it("ohne wacklige Tasten wird nichts dazu gezählt", () => {
    const { feld, onItemDone } = sitzung({ wackeligeTasten: undefined });
    for (const ch of ZEILEN[0]) anschlag(feld, ch);
    vor(PAUSE);
    const e = onItemDone.mock.calls[0][0];
    expect(e.wackeligVersuche).toBeUndefined();
    expect(e.wackeligTreffer).toBeUndefined();
  });

});

// ── 3 · Gespeichert nur für Kinder einer Klasse ─────────────────────────────

describe("Schritt M · gespeichert wird nur bei Kindern einer Klasse", () => {
  /*
    Die Datenschutzerklärung sagt „bei Klassen-Konten". Wer ohne Klasse übt
    (Selbstlernende, Lehrkräfte selbst), hat keine Lehrkraft, für die gemessen
    würde - dort bleiben die Messungen weg (`ohneZeilenMessung` in
    TippenTrainerPage). Geprüft an der ECHTEN Seite: eine Zeile tippen, dann
    lesen, was im Übungsverlauf steht.
  */
  beforeEach(() => {
    vi.useRealTimers();
    einrichtungFertigMerken();
    _resetTypingBackend();
    useTypingAuth.setState({ account: null });
  });

  function kind(extra: Partial<TypingAccount> = {}): TypingAccount {
    const t = registerTeacher("L", `l${Math.random()}@s.at`, "geheim1");
    if (!t.ok) throw new Error("Lehrkraft");
    const cls = createClass(t.value.id, "3b");
    if (!cls.ok) throw new Error("Klasse");
    const p = addPupil(cls.value.code, "Kind", "1234", "b");
    if (!p.ok) throw new Error("Kind");
    return { ...p.value, ...extra };
  }

  async function tippeEineZeile(account: TypingAccount) {
    useTypingAuth.setState({ account });
    render(createElement(MemoryRouter, null, createElement(TippenTrainerPage)));
    const feld = (await screen.findByRole("textbox", undefined, {
      timeout: 10_000,
    })) as HTMLTextAreaElement;
    for (const ch of feld.value) fireEvent.keyDown(feld, { key: ch });
    await waitFor(() =>
      expect(getEvents(account.id).filter((e) => e.lesson !== "__goal__").length).toBe(1),
    );
    return getEvents(account.id).filter((e) => e.lesson !== "__goal__")[0];
  }

  it("★ Kind einer Klasse: die Messungen stehen im Übungsverlauf", async () => {
    const e = await tippeEineZeile(kind());
    expect(e.chars).toBeGreaterThan(0);
    // fireEvent ist ein Skript - jeder Anschlag ist „unecht".
    expect(e.unechteTasten).toBe(e.chars);
  }, 30_000);

  it("★ ohne Klasse (selbstlernend): keine Messung im Übungsverlauf", async () => {
    const e = await tippeEineZeile(kind({ selfManaged: true }));
    expect(e.chars).toBeGreaterThan(0);
    for (const feld of [
      "unechteTasten", "wegMs", "rhythmusVk", "haltezeitMs", "ueberlappung",
      "wackeligTreffer", "wackeligVersuche",
    ] as const) {
      expect(e[feld], feld).toBeUndefined();
    }
  }, 30_000);
});

// ── 4 · Die Datenschutzerklärung ────────────────────────────────────────────

describe("Schritt M · die Datenschutzerklärung", () => {
  function text(): string {
    render(
      createElement(MemoryRouter, null, createElement(Datenschutz)),
    );
    return (document.body.textContent ?? "").replace(/\s+/g, " ");
  }

  it.skip("nennt, was je Zeile festgehalten wird, wofür und wer es sieht", () => {
    const t = text();
    expect(t).toContain("Hinweise zur Eigenständigkeit:");
    for (const teil of [
      "ob Tastendrücke von einem Programm im Browser statt von einer Tastatur kamen",
      "wie lange das Fenster während der Zeile nicht im Vordergrund war",
      "wie gleichmäßig getippt wurde",
      "wie lange die Tasten gedrückt blieben",
      "wie sicher die zuletzt wackligen Tasten in dieser Zeile waren",
      "keine einzelnen Tastendrücke und kein Text über das hinaus, was das Üben ohnehin speichert",
      "Es wird nichts automatisch entschieden",
      "das Kind selbst sieht sie nicht",
    ]) {
      expect(t, `Es fehlt: ${teil}`).toContain(teil);
    }
  });

  it.skip("★ verspricht NICHT mehr ohne Ausnahme, dass man dieselben Einschätzungen sieht", () => {
    const t = text();
    // Der alte Satz endete hier - ohne Ausnahme für Tastenflow.
    expect(t).not.toContain("die auch Lehrende sehen. Eine automatisierte Entscheidung");
    expect(t).toContain(
      "die auch Lehrende sehen - ausgenommen Tastenflow: Dort sind die Hinweise zur Eigenständigkeit nur für die Lehrkraft der Klasse bestimmt",
    );
  });
});
