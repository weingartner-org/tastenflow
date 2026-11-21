/**
 * Polar-Expedition — LEBEN, ECHTE FEHLER und die BAUCHRUTSCHE als Rhythmus-Spiel
 * (Umbau 14.07. nach Johannes' Testlauf).
 *
 * Die drei Befunde, die dieser Test absichert:
 *
 *  1. „Man kann generell immer Tasten spammen und hat irgendwann das gesuchte Wort" — ein
 *     Fehlgriff war folgenlos. Jetzt kostet JEDER Fehlgriff ein Herz (in jeder Zone), und bei
 *     null Herzen beginnt die Zone von vorn.
 *  2. „Er sagt immer, ich hätte keinen Fehler gemacht, aber man kann gar keinen Fehler machen"
 *     — „fehlerfrei" zählte nur abgelaufene Zeitfenster. Jetzt zählt jeder Fehlgriff mit
 *     (`flawless`), und das Polarlicht (`clean`) fällt aus, sobald eine Zone neu beginnen musste.
 *  3. „Die Bauchrutsche wäre eher eine Bauchrutsche, wenn man Buchstaben auf sich zukommen
 *     sieht und sie im richtigen Moment drücken muss" — sie ist jetzt ein Timing-Spiel:
 *     zu früh gedrückt zählt nicht, sondern kostet ein Herz.
 */
import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { masteryFor, type FloeCourse, type LetterStat } from "../src/lib/typing";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const mastery = masteryFor("normal");
/** Gemessene Anschlagszeit: gibt Zeitfenster (Packeis) und Anflugdauer (Rutsche) ihre Länge. */
const LETTERS: Record<string, LetterStat> = {
  f: { hits: 20, misses: 0, sumMs: 0, timed: 0, recent: [600, 600, 600] },
  j: { hits: 20, misses: 0, sumMs: 0, timed: 0, recent: [600, 600, 600] },
  d: { hits: 20, misses: 0, sumMs: 0, timed: 0, recent: [600, 600, 600] },
  k: { hits: 20, misses: 0, sumMs: 0, timed: 0, recent: [600, 600, 600] },
};

const WATER = (units: string[]): FloeCourse => ({ stages: [{ kind: "water", units }] });
const SLIDE = (units: string[]): FloeCourse => ({ stages: [{ kind: "slide", units }] });

function renderZone(course: FloeCourse, onFinished?: (r: { clean: boolean; flawless: boolean; fish: number }) => void) {
  render(
    <ExpeditionStage
      open
      onClose={vi.fn()}
      course={course}
      free
      isAdult={false}
      noTimePressure={false}
      letters={LETTERS}
      mastery={mastery}
      onWin={vi.fn()}
      onFinished={onFinished}
    />,
  );
  return screen.getByRole("application");
}

/** Volle Herzen ❤️ im HUD (leere sind 🤍). */
const hearts = () => [...document.body.querySelectorAll(".px-hud__heart")].filter((h) => h.textContent === "❤️").length;
const statusText = () => document.body.querySelector(".px-status")?.textContent ?? "";
/**
 * Was die SPRACHAUSGABE bekommt: `role="status"` (sr-only). Bei abgeschaltetem Vorlesen -
 * so läuft dieser Test - schreibt `say()` seinen Text hierher; die sichtbare `.px-status`
 * ist `aria-hidden` und wird nie gesprochen.
 * ★ Seit 31.08. sagt der Zonen-Neustart („beide Herzen weg") die fällige Taste wieder an
 * (useExpedition.ts `restartAt`, Befund SP-3) - derselbe Satz steht dadurch an ZWEI Stellen
 * im Baum: sichtbar und für die Sprachausgabe. `getByText` scheitert an dieser Doppelung,
 * obwohl beide Stellen richtig sind - deshalb prüfen die Tests unten gezielt die eine oder
 * die andere, nie „irgendwo im Dokument".
 */
const ansageText = () => document.body.querySelector('[role="status"]')?.textContent ?? "";

describe("Leben: jeder Fehlgriff kostet ein Herz (14.07.)", () => {
  it("startet mit zwei Herzen und verliert eines je Fehlgriff", () => {
    const field = renderZone(WATER(["f", "j"]));
    expect(hearts()).toBe(2);
    act(() => void fireEvent.keyDown(field, { key: "x" })); // falsch
    expect(hearts()).toBe(1);
  });

  it("beide Herzen weg → die Zone beginnt von vorn (Herzen wieder voll)", () => {
    vi.useFakeTimers();
    const field = renderZone(WATER(["f", "j", "d"]));
    act(() => void fireEvent.keyDown(field, { key: "f" })); // Scholle 1 geschafft
    expect(statusText()).toMatch(/Scholle 1 von 3/);
    act(() => void fireEvent.keyDown(field, { key: "x" }));
    act(() => void fireEvent.keyDown(field, { key: "x" })); // zweiter Fehlgriff → zurück zum Ufer
    act(() => vi.advanceTimersByTime(2000)); // Rücksprung-Pause
    expect(statusText()).toMatch(/Am Ufer/); // wieder am Anfang der Zone
    // ★ Befund SP-3 (30.08., pruefstand/kind/befunde/buecherei-und-spiel.md): Hier war es
    // still. Wer nichts sieht, wusste nach „beide Herzen weg", DASS es von vorn losgeht,
    // aber nicht, welche Taste dran ist. Jetzt nennt die Ansage die erste Scholle wieder.
    expect(ansageText()).toMatch(/Am Ufer.*f/);
    expect(hearts()).toBe(2); // frische Herzen für den neuen Anlauf
  });

  it("Spammen führt nicht mehr zum Ziel: falsche Tasten bringen keinen Fortschritt", () => {
    vi.useFakeTimers();
    const field = renderZone(WATER(["f", "j"]));
    for (const key of ["a", "b", "c", "e"]) act(() => void fireEvent.keyDown(field, { key }));
    act(() => vi.advanceTimersByTime(2000)); // Rücksprung nach dem Herz-Verlust abwarten
    expect(statusText()).toMatch(/Am Ufer/); // keine einzige Scholle geschafft
  });
});

describe("Fehlerfrei-Meldung und Polarlicht (14.07.)", () => {
  it("meldet die Zone nur ohne JEDEN Fehler als fehlerfrei", () => {
    vi.useFakeTimers();
    const done = vi.fn();
    const field = renderZone(WATER(["f", "j"]), done);
    act(() => void fireEvent.keyDown(field, { key: "x" })); // ein Fehlgriff …
    act(() => void fireEvent.keyDown(field, { key: "f" }));
    act(() => void fireEvent.keyDown(field, { key: "j" }));
    act(() => vi.advanceTimersByTime(3000)); // ans Ziel gleiten
    expect(done).toHaveBeenCalled();
    const result = done.mock.calls[0][0];
    expect(result.flawless).toBe(false); // … also NICHT fehlerfrei (vorher: true)
    expect(result.clean).toBe(true); // aber die Zone musste nicht neu beginnen → Polarlicht bleibt
  });

  it("Zonen-Neustart nimmt das Polarlicht (clean = false)", () => {
    vi.useFakeTimers();
    const done = vi.fn();
    const field = renderZone(WATER(["f", "j"]), done);
    act(() => void fireEvent.keyDown(field, { key: "x" }));
    act(() => void fireEvent.keyDown(field, { key: "x" })); // beide Herzen weg → Neustart
    act(() => vi.advanceTimersByTime(2000));
    act(() => void fireEvent.keyDown(field, { key: "f" }));
    act(() => void fireEvent.keyDown(field, { key: "j" }));
    act(() => vi.advanceTimersByTime(3000));
    expect(done).toHaveBeenCalled();
    expect(done.mock.calls[0][0].clean).toBe(false);
  });
});

describe("Bauchrutsche: Treffen im richtigen Moment (14.07.)", () => {
  // Anflugdauer = Median (600 ms) × 2.4 = 1440 ms → auf das Minimum 1500 ms angehoben.
  // Das Trefferfenster geht 380 ms vor der Ziellinie auf, also ab ~1120 ms.
  it("zu früh gedrückt zählt nicht, sondern kostet ein Herz", () => {
    vi.useFakeTimers();
    const field = renderZone(SLIDE(["f", "j"]));
    expect(hearts()).toBe(2);
    act(() => vi.advanceTimersByTime(300)); // der Buchstabe ist noch weit weg
    act(() => void fireEvent.keyDown(field, { key: "f" })); // richtige Taste, falscher Moment
    expect(hearts()).toBe(1);
    // ★ 04.09.2026: Die sichtbare Zeile trug bis heute weiter „Oben am Hang".
    // Jetzt steht dort kurz der Hinweis „Zu früh" - damit ein sehendes Kind mit
    // „Ton aus" ihn überhaupt bekommt. „Kein Fortschritt" wird deshalb daran
    // geprüft, dass keine Station gezählt wurde; das ist dieselbe Aussage.
    expect(statusText()).toMatch(/Zu früh/);
    expect(statusText()).not.toMatch(/Schwung 1 von/);
  });

  /*
   * ★★★★★ JOHANNES, 20.09.2026 (nach Testerin Durchgang), wörtlich: *„Die
   * Schneerutsche habe ich wieder nicht geschafft … Er wollte das °-Zeichen.
   * Vielleicht war das allein das Problem, weil ich dafür ja zwei Tasten
   * drücken muss und ich Umschalt immer etwas früher drücke?!"*
   *
   * Genau das war es. Für ein Zeichen wie „°" kommt zuerst ein eigenes
   * Tasten-Ereignis mit `key: "Shift"` - und die Rutsche wertete es als
   * Fehlgriff: Herz weg, Anflug zurück. Jedes Zeichen mit Umschalt war hier
   * unschaffbar. Der Zonen-Handler und die Polarstation kannten die Ausnahme
   * längst; der Rutsche fehlte sie.
   */
  it("die Umschalttaste kostet kein Herz - sonst ist „°“ unschaffbar (20.09.)", () => {
    vi.useFakeTimers();
    const field = renderZone(SLIDE(["f", "j"]));
    expect(hearts()).toBe(2);
    // Umschalt VOR dem Zeichen gedrückt, mitten im Anflug: weder Treffer noch Fehler.
    act(() => vi.advanceTimersByTime(1300));
    act(() => void fireEvent.keyDown(field, { key: "Shift", shiftKey: true }));
    expect(hearts()).toBe(2);
    // …und das Zeichen danach zählt ganz normal.
    act(() => void fireEvent.keyDown(field, { key: "f", shiftKey: true }));
    expect(hearts()).toBe(2);
    expect(screen.getByText(/Schwung 1 von 2/)).toBeTruthy();
  });

  it("im Trefferfenster gedrückt zählt", () => {
    vi.useFakeTimers();
    const field = renderZone(SLIDE(["f", "j"]));
    act(() => vi.advanceTimersByTime(1300)); // im Fenster (Zielton erklingt hier)
    act(() => void fireEvent.keyDown(field, { key: "f" }));
    expect(hearts()).toBe(2); // kein Herz verloren
    expect(screen.getByText(/Schwung 1 von 2/)).toBeTruthy(); // weiter zum nächsten Buchstaben
  });

  /**
   * ★★★★★ HEIKE, 04.09.2026: *„Es ist irgendwie nicht klar gewesen, wann man den
   * Buchstaben drückt. Da kam keine Rückmeldung, wenn man gedrückt hat."* - ein
   * Schüler und sie selbst kamen an dieser Zone nicht weiter.
   *
   * Die Ursache war kein Timing, sondern ein blankes `return`: Solange die Ansage
   * sprach oder die Anflug-Uhr noch auf 0 stand, verwarf `handleSlideKey` jede
   * Taste - kein Ton, keine Meldung, kein Herz. Dass sie KEIN Herz kostet, ist
   * richtig (Johannes 15.07.: „ich habe Leben verloren, ohne dass es losging").
   * Dass sie gar nichts auslöste, war der Fehler: Ein folgenloser Tastendruck ist
   * für ein Kind mit Blindheit nicht von einer kaputten Tastatur zu unterscheiden.
   */
  it("ein Druck, BEVOR der Buchstabe losfliegt, bleibt nicht unbeantwortet (Testerin 04.09.)", () => {
    vi.useFakeTimers();
    const field = renderZone(SLIDE(["f", "j"]));
    // Kein `advanceTimersByTime`: Die Anflug-Uhr steht noch auf 0.
    act(() => void fireEvent.keyDown(field, { key: "f" }));
    expect(hearts()).toBe(2); // kein Herz - das war schon vorher richtig
    expect(ansageText()).toMatch(/Noch nicht/); // ... aber jetzt kommt eine Antwort
  });

  /**
   * ★★★★★ „TON AUS" IST DER NORMALFALL (Johannes, 04.09.2026): *„sehende kinder
   * benutzen ton aus und wenn der einzige Kanal dann die braillezeile ist dann
   * haben sie keine chance."*
   *
   * Genau das war der Fall: Der Hinweis oben ging über einen TON (fällt bei
   * „Ton aus" weg) und über `say()` - das schreibt ohne Vorlesen in die
   * `sr-only`-Region, die nur eine Sprachausgabe oder eine Braillezeile
   * erreicht. Für ein sehendes Kind mit abgeschaltetem Ton blieb es beim
   * Schweigen. Deshalb prüft dieser Fall die SICHTBARE Statuszeile
   * (`.px-status`, `aria-hidden`) - den einzigen Kanal, der ohne Ton und ohne
   * Vorlesen trägt.
   */
  it("der Hinweis steht auch SICHTBAR da - für Kinder mit „Ton aus“ (Johannes 04.09.)", () => {
    vi.useFakeTimers();
    const field = renderZone(SLIDE(["f", "j"]));
    act(() => void fireEvent.keyDown(field, { key: "f" }));
    expect(statusText()).toMatch(/Noch nicht/);
    // ... und er räumt sich wieder ab, statt stehenzubleiben.
    act(() => vi.advanceTimersByTime(1700));
    expect(statusText()).not.toMatch(/Noch nicht/);
  });

  it("auch „zu früh“ steht sichtbar da, nicht nur für die Sprachausgabe", () => {
    vi.useFakeTimers();
    const field = renderZone(SLIDE(["f", "j"]));
    act(() => vi.advanceTimersByTime(300)); // Uhr läuft, Buchstabe noch weit weg
    act(() => void fireEvent.keyDown(field, { key: "f" }));
    expect(hearts()).toBe(1); // ein Herz - unverändert
    expect(statusText()).toMatch(/Zu früh/);
  });

  it("verpasst (Buchstabe fliegt vorbei) kostet ebenfalls ein Herz", () => {
    vi.useFakeTimers();
    const field = renderZone(SLIDE(["f", "j"]));
    act(() => vi.advanceTimersByTime(2200)); // Anflug + Nachlauf vorbei
    expect(hearts()).toBe(1);
    expect(field).toBeTruthy();
  });
});

/**
 * PUNKT 7 (Testerin Durchgang 20.09.2026, Johannes wörtlich): „Es beginnt dann gnadenlos
 * immer wieder von vorne. Es wäre gut, wenn ich eine Station nicht verstehe, dass ich die
 * überspringen kann. Ansonsten muss ich komplett beenden." Die Eingabetaste ist in JEDER
 * Zone wirkungslos (kein Kurs-Zeichen ist je „Enter") — genau darum die Wahl.
 */
describe("PUNKT 7 (20.09.2026): die Eingabetaste überspringt die aktuelle Station", () => {
  // ★ 02.10.2026 angepasst (Lehrkraft: ein Kind kam nur mit der Leertaste durchs Spiel):
  // Die Eingabetaste überspringt erst, wenn an der Station wirklich etwas versucht wurde.
  // Vorher stand hier „überspringt sofort, ohne dass je eine Taste gedrückt wurde" - genau das
  // ist der behobene Fehler (neues Verhalten: tests/expedition-wirklich-versucht.test.tsx).
  it("überspringt die Station, sobald das Kind an ihr etwas versucht hat (hier: erste Taste der Folge richtig)", () => {
    const field = renderZone(WATER(["fj", "d", "k"]));
    expect(statusText()).toMatch(/Am Ufer/); // noch nichts geschafft
    act(() => void fireEvent.keyDown(field, { key: "f" })); // richtig - „j“ wurde nie getippt
    act(() => void fireEvent.keyDown(field, { key: "Enter" }));
    expect(statusText()).toMatch(/Scholle 1 von 3/); // übersprungen
    expect(hearts()).toBe(2); // kein Fehler, keine Strafe
  });

  it("kostet kein Herz und wirft nicht in die Zeit-Zone zurück", () => {
    vi.useFakeTimers();
    const field = renderZone(WATER(["fj", "d"]));
    act(() => void fireEvent.keyDown(field, { key: "f" })); // ein Treffer = echter Versuch (02.10.2026)
    act(() => void fireEvent.keyDown(field, { key: "x" })); // ein Fehlgriff — ein Herz weg
    expect(hearts()).toBe(1);
    act(() => void fireEvent.keyDown(field, { key: "Enter" })); // überspringen
    expect(hearts()).toBe(2); // frische Herzen für die nächste Scholle
    expect(statusText()).toMatch(/Scholle 1 von 2/);
  });
});

/**
 * PUNKT 8 (Testerin Durchgang 20.09.2026, Johannes wörtlich): „Wenn man es nach zwei
 * Wiederholungen nicht geschafft hat, sollte es auch einfach weitergehen. Endlosschleifen
 * nerven. ;-)" Die ersten zwei Neustarts laufen wie gehabt (Zone von vorn); der DRITTE
 * (`restartsRef` steht schon auf 2) wird durch einen Sprung zur nächsten Station ersetzt.
 */
describe("PUNKT 8 (20.09.2026): nach zwei Neustarts geht es beim dritten Mal einfach weiter", () => {
  it("dritte Pleite (restartsRef=2) überspringt statt zum dritten Mal von vorn zu beginnen", () => {
    vi.useFakeTimers();
    const field = renderZone(WATER(["f", "j"]));
    // ★ 02.10.2026 angepasst: statt immer „x“ jetzt „x“ und „y“ - die Gnadenregel greift nur
    // noch bei echtem Versuch (mind. 3 Fehlgriffe mit 2 verschiedenen Tasten an der Station);
    // dieselbe eine Taste wieder und wieder wäre Spammen (s. expedition-wirklich-versucht).
    // 1. Neustart (beide Herzen weg → Zone von vorn).
    act(() => void fireEvent.keyDown(field, { key: "x" }));
    act(() => void fireEvent.keyDown(field, { key: "y" }));
    act(() => vi.advanceTimersByTime(2000));
    expect(statusText()).toMatch(/Am Ufer/);
    // 2. Neustart (wie gehabt).
    act(() => void fireEvent.keyDown(field, { key: "x" }));
    act(() => void fireEvent.keyDown(field, { key: "y" }));
    act(() => vi.advanceTimersByTime(2000));
    expect(statusText()).toMatch(/Am Ufer/);
    // 3. Pleite: JETZT nicht noch einmal von vorn, sondern weiter zur nächsten Scholle —
    // sofort, ohne die sonst übliche Rücksprung-Pause abzuwarten.
    act(() => void fireEvent.keyDown(field, { key: "x" }));
    act(() => void fireEvent.keyDown(field, { key: "y" }));
    expect(hearts()).toBe(2); // frische Herzen für den Weitersprung
    // Übersprungen auf Scholle 1 (von 2) — mit „j“ als nächstem Ziel, ohne je „f“ gebraucht
    // zu haben; NICHT zum dritten Mal zurück ans Ufer.
    expect(statusText()).toMatch(/Scholle 1 von 2/);
    expect(statusText()).toMatch(/j/);
    expect(statusText()).not.toMatch(/Am Ufer/);
  });

  it("die Ansage klingt nie wie ein Vorwurf ans Kind (Hausregel)", () => {
    vi.useFakeTimers();
    const field = renderZone(WATER(["f", "j"]));
    for (let i = 0; i < 2; i++) {
      act(() => void fireEvent.keyDown(field, { key: "x" }));
      act(() => void fireEvent.keyDown(field, { key: "y" }));
      act(() => vi.advanceTimersByTime(2000));
    }
    act(() => void fireEvent.keyDown(field, { key: "x" }));
    act(() => void fireEvent.keyDown(field, { key: "y" }));
    expect(ansageText().toLowerCase()).not.toMatch(/nicht geschafft|falsch|versagt/);
  });
});
