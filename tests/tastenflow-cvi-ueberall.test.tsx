/**
 * ★★★★★ WÄCHTER „ZEICHENABSTAND GROSS (CVI)" - ÜBERALL (19.09.2026).
 * ===========================================================================
 * Johannes, wörtlich: *„wer CVI eingestellt hat, sieht es überall so, bei
 * Tippchallenges, Klassenmatch, Übungen und Spielen, überall"*.
 *
 * Bis dahin trugen nur die Bildschirme mit `TypingSession` die Laufweite und
 * das Abdunkeln (Mein Training, Geschichten, Tippchallenge, Klassenmatch,
 * Eigene Übung - Wächter: `tastenflow-zeichenabstand`,
 * `tastenflow-cvi-abdunkeln`). Dieser Wächter hält den Rest fest:
 *
 *  1. Die WORTSPIELE MIT EIGENEM BILDSCHIRM (Lückentext, Fingerdiktat,
 *     Korrekturlesen, Was fehlt, Zahlendiktat - der Rätsel-Bildschirm - und
 *     der Buchstabensalat): Frage bzw. Quellwort, Vorrat, Eingabefeld tragen
 *     die Laufweite. Geprüft über den ECHTEN Weg (`AdaptiveTrainer` mit
 *     `startForm`, wie aus dem Regal), damit ein fehlender Durchreich-Prop rot
 *     wird und nicht nur das Bauteil grün.
 *  2. Die ZEILENFORMEN (Alphabetreihen, Pyramide, …) laufen in `TypingSession`
 *     - je Form einmal gebaut und gegengeprüft, dazu die Steine der Pyramide.
 *  3. Die SPIELE (Polar-Expedition: freie Reise, Belohnungs-Lauf): die
 *     Zeichen-Reihen der Szenen (Steilwand-Tafel, Sturm-Tafel und -Kästen,
 *     Funk-Kärtchen und -Anzeige) rücken auseinander - bei „aus" stehen sie
 *     Einheit für Einheit wie vorher.
 *  4. Das ABDUNKELN in drei verschiedenen Bildschirmen (Rätsel,
 *     Buchstabensalat, Expeditions-Bühne): dunkel nach einem Anschlag, hell
 *     nach 5 s, nie ohne CVI, nie unter einem fremden Fenster.
 *  5. ★★★★★ NICHTS SPRINGT AUF DER BRAILLEZEILE: Textinhalt, Wert und
 *     zugänglicher Name sind mit und ohne CVI Zeichen für Zeichen gleich - die
 *     Laufweite ist nur CSS, nie ein eingefügtes Leerzeichen.
 *
 * ⚠️ jsdom rechnet kein Layout: Für das Abdunkeln bekommen die Karte bzw. das
 * Spielfeld eine vorgetäuschte Fläche (dieselbe Bauart wie im Wächter
 * `tastenflow-cvi-abdunkeln`).
 *
 * ★★★ WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD:
 *  · Ein Wortspiel oder ein Spiel verliert den Durchreich-Prop - rot.
 *  · Bei „aus" ändert sich an einem Bildschirm etwas - rot.
 *  · Jemand setzt Leerzeichen in den Text statt CSS-Abstand - rot.
 *  · Das Abdunkeln fehlt in einem Spiel, bleibt stehen oder dunkelt unter
 *    einem fremden Fenster ab - rot.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("@/lib/typing/sound", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing/sound")>();
  return {
    ...echt,
    playBadgeSound: vi.fn(),
    playUnlockFanfare: vi.fn(),
    playKeySound: vi.fn(),
    playKeyTick: vi.fn(),
    playErrorSound: vi.fn(),
    playLineSound: vi.fn(),
    playSuccessSound: vi.fn(),
    playStarReward: vi.fn(),
    playStoryBadgeSound: vi.fn(),
  };
});

import { AdaptiveTrainer } from "@/components/typing/AdaptiveTrainer";
import { RaetselLauf } from "@/components/typing/RaetselLauf";
import { BuchstabensalatLauf } from "@/components/typing/BuchstabensalatLauf";
import { PyramidenSchmuck } from "@/components/typing/PyramidenSchmuck";
import { TypingSession } from "@/components/typing/TypingSession";
import { ExpeditionStage } from "@/components/typing/expedition/ExpeditionStage";
import { CVI_HELL_NACH_MS } from "@/components/typing/CviAbdunkeln";
import { emptyProgress, type FloeCourse, type LetterStat, type TypingProgress } from "@/lib/typing";
import { INTRO_ORDER, SHIFT_UNIT } from "@/lib/typing/letters";
import { UEBUNGSFORMEN, type FormKontext } from "@/lib/typing/uebungsformen";
import { formName } from "@/lib/typing/uebungsformen/namen";
import { salatFeldbeschriftung } from "@/lib/typing/uebungsformen/buchstabensalat";
import {
  LAUFWEITE_CH_JE_STUFE,
  laufweiteAttrs,
  laufweiteText,
  laufweiteZusatz,
  laufweiteZusatzIn,
  type ZeichenabstandFaktor,
} from "@/lib/typing/zeichenabstand";

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Woran die Laufweite im `style` erkannt wird - dieselbe Rechnung wie das Übungsfeld. */
const ZUSATZ_3 = `(3 - 1) * ${LAUFWEITE_CH_JE_STUFE}ch`;

/** Ein fester Zufall - sonst prüft der Wächter jedes Mal etwas anderes. */
function festerZufall(saat: number): () => number {
  let z = saat >>> 0;
  return () => {
    z = (z * 1664525 + 1013904223) >>> 0;
    return z / 4294967296;
  };
}

/** Alles freigeschaltet (Buchstaben, Umschalttaste, Satzzeichen, Ziffern). */
function vollerKontext(): FormKontext {
  const introduced = [...INTRO_ORDER];
  return {
    lernweg: "de",
    introduced,
    shift: introduced.includes(SHIFT_UNIT),
    oneHand: false,
    stufe: "kids",
    lang: "de",
    count: 12,
    zufall: festerZufall(7),
  };
}

function vollerStand(): TypingProgress {
  return { ...emptyProgress(), introduced: [...INTRO_ORDER] };
}

/** Karte (Wortspiele) und Spielfeld (Expedition) bekommen eine Fläche - jsdom misst sonst Null. */
function flaecheVortaeuschen() {
  const echt = HTMLElement.prototype.getBoundingClientRect;
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.classList.contains("card") || this.classList.contains("px-viewport"))
      return { x: 40, y: 120, width: 700, height: 300, top: 120, left: 40, right: 740, bottom: 420, toJSON() {} } as DOMRect;
    return echt.call(this);
  });
}

const schicht = () => document.querySelector<HTMLElement>("[data-cvi-abdunkeln]");
const istDunkel = () => schicht()?.getAttribute("data-cvi-abdunkeln") === "an";

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// 0 · Die eine Rechnung
// ---------------------------------------------------------------------------

describe("0 · Eine Rechnung in drei Formen", () => {
  it("letter-spacing: dieselbe Zusatzstrecke wie das Übungsfeld - bei „aus“ nichts", () => {
    expect(laufweiteZusatz(3)).toBe(`calc(${ZUSATZ_3})`);
    // Mit Umbruch-Erlaubnis für ein Wort, das sonst überliefe (375 px, gemessen)
    // und - seit 20.09.2026 - dem mitgewachsenen Zeilenabstand (Testerin Schüler).
    expect(laufweiteText(3)).toEqual({
      letterSpacing: `calc(${ZUSATZ_3})`,
      overflowWrap: "break-word",
      lineHeight: 2,
    });
    expect(laufweiteText(1)).toBeUndefined();
  });

  it("Flex-Zeile: Klasse + Variable - bei „aus“ weder noch", () => {
    expect(laufweiteAttrs(4)).toEqual({ className: "tt-laufweite", style: { "--tt-laufweite": 4 } });
    expect(laufweiteAttrs(1)).toEqual({ className: "", style: undefined });
  });

  it("SVG-Szenen: dieselbe Rechnung in Szenen-Einheiten, 0 bei „aus“, wächst je Stufe gleich", () => {
    expect(laufweiteZusatzIn(1, 56)).toBe(0);
    const stufe = laufweiteZusatzIn(2, 56);
    expect(stufe).toBeGreaterThan(0);
    expect(laufweiteZusatzIn(3, 56)).toBeCloseTo(2 * stufe);
    expect(laufweiteZusatzIn(4, 56)).toBeCloseTo(3 * stufe);
  });
});

// ---------------------------------------------------------------------------
// 1 · Wortspiele mit eigenem Bildschirm - über den echten Weg
// ---------------------------------------------------------------------------

const EIGENE_BILDSCHIRME = UEBUNGSFORMEN.filter((f) => f.eigenerBildschirm);

function bauTrainer(startForm: string, zeichenabstand: ZeichenabstandFaktor) {
  return render(
    <AdaptiveTrainer
      loadFn={async () => vollerStand()}
      saveFn={() => {}}
      stufe="kids"
      lang="de"
      zeichenabstand={zeichenabstand}
      startForm={startForm as never}
      onFormEnde={() => {}}
    />,
  );
}

/** Die Karte des Wortspiels, sobald die Form gestartet ist - an ihrer Überschrift erkannt. */
async function karteVon(id: string): Promise<HTMLElement> {
  const titel = await screen.findByRole("heading", { level: 2, name: formName(id as never, "de") });
  return titel.closest(".card") as HTMLElement;
}

describe("1 · Wortspiele mit eigenem Bildschirm (aus dem Regal gestartet)", () => {
  it("Grundmenge: fünf Rätsel-Formen, der Buchstabensalat und das Iglu-Raten", () => {
    expect(EIGENE_BILDSCHIRME.map((f) => f.id).sort()).toEqual(
      ["buchstabensalat", "fingerdiktat", "iglu", "korrekturlesen", "lueckentext", "wasfehlt", "zahlendiktat"],
    );
  });

  it.each(EIGENE_BILDSCHIRME.map((f) => f.id))(
    "%s: Faktor 3 - Aufgabe und Eingabefeld tragen die Laufweite, die Überschrift nicht",
    async (id) => {
      bauTrainer(id, 3);
      const karte = await karteVon(id);
      const inhalt = karte.querySelector<HTMLElement>("p.text-2xl");
      expect(inhalt, "die Aufgabe (Frage bzw. Quellwort)").toBeTruthy();
      expect(inhalt!.style.letterSpacing).toContain(ZUSATZ_3);
      const feld = karte.querySelector<HTMLInputElement>("input")!;
      expect(feld.style.letterSpacing).toContain(ZUSATZ_3);
      // Überschrift und Knöpfe: keine Änderung.
      expect(karte.querySelector<HTMLElement>("h2")!.style.letterSpacing).toBe("");
      for (const k of karte.querySelectorAll<HTMLElement>("button"))
        expect(k.style.letterSpacing).toBe("");
    },
  );

  it.each(EIGENE_BILDSCHIRME.map((f) => f.id))(
    "%s: „aus“ (1) - weder Aufgabe noch Feld tragen eine Laufweite",
    async (id) => {
      bauTrainer(id, 1);
      const karte = await karteVon(id);
      expect(karte.querySelector<HTMLElement>("p.text-2xl")!.style.letterSpacing).toBe("");
      expect(karte.querySelector<HTMLInputElement>("input")!.style.letterSpacing).toBe("");
      expect(karte.querySelector("[style*='letter-spacing']")).toBeNull();
    },
  );

  it("Buchstabensalat: auch der Vorrat (Beschriftung) und die gefundenen Wörter", async () => {
    bauTrainer("buchstabensalat", 3);
    const karte = await karteVon("buchstabensalat");
    expect(karte.querySelector<HTMLElement>("label")!.style.letterSpacing).toContain(ZUSATZ_3);
    expect(karte.querySelector<HTMLElement>("ul")!.style.letterSpacing).toContain(ZUSATZ_3);
  });
});

// ---------------------------------------------------------------------------
// 2 · Zeilenformen - sie laufen in TypingSession
// ---------------------------------------------------------------------------

describe("2 · Zeilenformen und Pyramide", () => {
  const ZEILENFORMEN = UEBUNGSFORMEN.filter((f) => !f.eigenerBildschirm && f.baue);

  it("Grundmenge: sieben Zeilenformen, und jede baut mit vollem Tastenstand eine Runde", () => {
    expect(ZEILENFORMEN).toHaveLength(7);
    for (const f of ZEILENFORMEN) {
      const runde = f.baue!(vollerKontext());
      expect(runde?.zeilen.length ?? 0, f.id).toBeGreaterThan(0);
    }
  });

  it.each(ZEILENFORMEN.map((f) => f.id))(
    "%s: Faktor 3 - die Zeile trägt die Laufweite, das Feld dieselbe Strecke; „aus“ nicht",
    (id) => {
      const form = ZEILENFORMEN.find((f) => f.id === id)!;
      const zeilen = form.baue!(vollerKontext())!.zeilen.map((z) => z.text);
      for (const faktor of [3, 1] as const) {
        const { container } = render(
          <TypingSession
            items={zeilen}
            contextId={`form:${id}`}
            unlocked={new Set(INTRO_ORDER)}
            shiftLearned
            stufe="kids"
            voiceEnabled={false}
            onRetry={vi.fn()}
            zeichenabstand={faktor}
          />,
        );
        const zeile = container.querySelector<HTMLElement>("[data-angabe] .tt-laufweite");
        const feld = container.querySelector<HTMLTextAreaElement>("textarea")!;
        if (faktor === 3) {
          expect(zeile, `${id}: Laufweite der Zeile`).toBeTruthy();
          expect(zeile!.style.getPropertyValue("--tt-laufweite")).toBe("3");
          expect(feld.style.letterSpacing).toContain(ZUSATZ_3);
        } else {
          expect(zeile).toBeNull();
        }
        cleanup();
      }
    },
  );

  it("Pyramide aus dem Regal: auch die Steine über der Zeile rücken auseinander", async () => {
    const { container } = bauTrainer("pyramide", 3);
    await waitFor(() => expect(container.querySelector("[data-angabe]")).toBeTruthy());
    // Die kommende Stufe (leerer Umriss) steht schon bei Zeile 1 da.
    const steine = await waitFor(() => {
      const s = container.querySelector<HTMLElement>(".mt-1.space-y-0\\.5 > div");
      expect(s).toBeTruthy();
      return s!;
    });
    expect(steine.classList.contains("tt-laufweite")).toBe(true);
    expect(steine.style.getPropertyValue("--tt-laufweite")).toBe("3");
  });

  it("Pyramide: „aus“ - die Steine stehen wie vorher (2 px Fuge, keine Klasse)", () => {
    const { container } = render(
      <PyramidenSchmuck pyramiden={[["H", "Ha", "Haa", "Haar"]]} zeile={2} lang="de" />,
    );
    const reihen = container.querySelectorAll<HTMLElement>(".mt-1.space-y-0\\.5 > div");
    expect(reihen.length).toBe(3); // zwei fertige Stufen + die kommende
    for (const r of reihen) {
      expect(r.classList.contains("tt-laufweite")).toBe(false);
      expect(r.classList.contains("gap-0.5")).toBe(true);
    }
  });

  it("Pyramide: Faktor 3 - fertige UND kommende Stufe tragen dieselbe Laufweite", () => {
    const { container } = render(
      <PyramidenSchmuck pyramiden={[["H", "Ha", "Haa", "Haar"]]} zeile={2} lang="de" zeichenabstand={3} />,
    );
    const reihen = container.querySelectorAll<HTMLElement>(".mt-1.space-y-0\\.5 > div");
    expect(reihen.length).toBe(3);
    for (const r of reihen) {
      expect(r.classList.contains("tt-laufweite")).toBe(true);
      expect(r.style.getPropertyValue("--tt-laufweite")).toBe("3");
    }
  });
});

// ---------------------------------------------------------------------------
// 3 · Die Spiele - Zeichen-Reihen der Polar-Expedition
// ---------------------------------------------------------------------------

const noStats: Record<string, LetterStat> = {};
const kurs = (kind: FloeCourse["stages"][number]["kind"], units: string[]): FloeCourse => ({
  stages: [{ kind, units }],
});

function bauBuehne(course: FloeCourse, zeichenabstand?: ZeichenabstandFaktor) {
  return render(
    <ExpeditionStage
      open
      onClose={vi.fn()}
      course={course}
      free
      isAdult={false}
      noTimePressure
      letters={noStats}
      onWin={vi.fn()}
      zeichenabstand={zeichenabstand}
    />,
  );
}

/** Die x-Verschiebung aus `translate(x y)`. */
const tx = (el: Element | null) => Number(/translate\(([-\d.]+)/.exec(el?.getAttribute("transform") ?? "")?.[1]);

describe("3 · Spiele: die Zeichen-Reihen der Szenen", () => {
  it("Steilwand-Tafel: „aus“ 46 Einheiten je Zeichen wie immer, dreifach um die Zusatzstrecke weiter", () => {
    for (const faktor of [1, 3] as const) {
      bauBuehne(kurs("climb", ["fjdk"]), faktor);
      const zeichen = [...document.body.querySelectorAll(".px-climb-sign--active > g > g[transform]")];
      expect(zeichen.length, "vier Zeichen auf der Tafel").toBe(4);
      const schritt = 46 + laufweiteZusatzIn(faktor, 46);
      zeichen.forEach((g, i) => expect(tx(g)).toBeCloseTo(30 + i * schritt));
      // Die Zeichen selbst bleiben dieselben, in derselben Reihenfolge.
      expect(zeichen.map((g) => g.textContent).join("")).toBe("fjdk");
      cleanup();
    }
  });

  it("Schneesturm: Merk-Tafel und Eingabekästen rücken auseinander, „aus“ unverändert", () => {
    vi.useFakeTimers();
    for (const faktor of [1, 3] as const) {
      bauBuehne(kurs("storm", ["fjdk", "slae", "ncri"]), faktor);
      act(() => vi.advanceTimersByTime(1700)); // Station 1 erscheint mit ihrer Tafel
      const tafel = [...document.body.querySelectorAll<SVGTextElement>(".px-storm-board text")];
      expect(tafel.length).toBeGreaterThan(1);
      const schritt = 66 + laufweiteZusatzIn(faktor, 56);
      tafel.forEach((t, i) => expect(Number(t.getAttribute("x"))).toBeCloseTo(53 + i * schritt));
      cleanup();
    }
  });

  it("Polarstation: Kärtchen stehen um die Zusatzstrecke weiter auseinander, „aus“ unverändert", () => {
    const abstaende: number[] = [];
    for (const faktor of [1, 3] as const) {
      bauBuehne(kurs("station", ["baum"]), faktor);
      const kaertchen = [...document.body.querySelectorAll(".px-station-tiles > g[transform]")];
      expect(kaertchen.length).toBe(4);
      abstaende.push(tx(kaertchen[1]) - tx(kaertchen[0]));
      cleanup();
    }
    // „aus“: Kärtchen 52 + Fuge 14 wie vorher; dreifach: dieselbe Kärtchenbreite,
    // die Fuge um die Zusatzstrecke der 34er-Schrift weiter.
    expect(abstaende[0]).toBe(66);
    expect(abstaende[1]).toBeCloseTo(66 + laufweiteZusatzIn(3, 34));
  });
});

// ---------------------------------------------------------------------------
// 4 · Das Abdunkeln - in drei verschiedenen Bildschirmen
// ---------------------------------------------------------------------------

const RAETSEL = [{ frage: "Giraffen haben einen langen ...", antworten: ["Hals"] }];

function bauRaetsel(zeichenabstand?: ZeichenabstandFaktor) {
  return render(
    <RaetselLauf
      titel="Lückentext"
      ankuendigung="Jetzt kommt ein Lückentext."
      aufgaben={RAETSEL}
      contextId="form:lueckentext"
      onFertig={() => {}}
      onAbbruch={() => {}}
      zeichenabstand={zeichenabstand}
    />,
  );
}

function bauSalat(zeichenabstand?: ZeichenabstandFaktor) {
  return render(
    <BuchstabensalatLauf
      quellwort="Weihnachtsbaum"
      ankuendigung="Jetzt kommt ein Buchstabensalat."
      contextId="form:buchstabensalat"
      onFertig={() => {}}
      onAbbruch={() => {}}
      zeichenabstand={zeichenabstand}
    />,
  );
}

describe("4 · Abdunkeln beim Schreiben - auch in Wortspielen und Spielen", () => {
  beforeEach(() => flaecheVortaeuschen());

  it.each([
    ["Rätsel", bauRaetsel],
    ["Buchstabensalat", bauSalat],
  ] as const)("%s: dunkel nach dem ersten Buchstaben, hell nach 5 s ohne Anschlag", (_n, bau) => {
    vi.useFakeTimers();
    bau(3);
    const feld = screen.getByRole("textbox");
    expect(schicht()).toBeNull(); // vor dem ersten Anschlag: nichts
    act(() => void fireEvent.keyDown(feld, { key: "H" }));
    expect(istDunkel()).toBe(true);
    // Die helle Fläche ist die Karte (mit 6 px Luft für den Fokusring).
    expect(schicht()!.style.left).toBe("34px");
    expect(schicht()!.style.width).toBe("712px");
    act(() => vi.advanceTimersByTime(CVI_HELL_NACH_MS - 100));
    act(() => void fireEvent.keyDown(feld, { key: "a" })); // weitergetippt: die Uhr beginnt neu
    act(() => vi.advanceTimersByTime(CVI_HELL_NACH_MS - 100));
    expect(istDunkel()).toBe(true);
    act(() => vi.advanceTimersByTime(200));
    expect(istDunkel()).toBe(false);
  });

  it.each([
    ["Rätsel", bauRaetsel],
    ["Buchstabensalat", bauSalat],
  ] as const)("%s: ohne CVI geschieht beim Tippen gar nichts", (_n, bau) => {
    bau(1);
    act(() => void fireEvent.keyDown(screen.getByRole("textbox"), { key: "H" }));
    expect(schicht()).toBeNull();
  });

  it("Expedition: die Bühne ist selbst ein Fenster - ihr Spielfeld dunkelt trotzdem ab, über der Bühne", () => {
    vi.useFakeTimers();
    bauBuehne(kurs("water", ["f", "j", "d"]), 3);
    const spielfeld = screen.getByRole("application");
    act(() => void fireEvent.keyDown(spielfeld, { key: "f" }));
    expect(istDunkel()).toBe(true);
    // Die Bühne liegt auf 80 - die Schicht muss darüber liegen, sonst dunkelt sie nichts ab.
    expect(Number(schicht()!.style.zIndex)).toBeGreaterThan(80);
    act(() => vi.advanceTimersByTime(CVI_HELL_NACH_MS + 100));
    expect(istDunkel()).toBe(false);
  });

  it("Expedition: ohne CVI keine Schicht", () => {
    bauBuehne(kurs("water", ["f", "j", "d"]), 1);
    act(() => void fireEvent.keyDown(screen.getByRole("application"), { key: "f" }));
    expect(schicht()).toBeNull();
  });

  it("★ ein FREMDES Fenster hat weiter Vorrang - auch neben der Bühne bleibt es hell", () => {
    bauBuehne(kurs("water", ["f", "j", "d"]), 3);
    const fremd = document.createElement("div");
    fremd.setAttribute("role", "dialog");
    fremd.setAttribute("aria-modal", "true");
    document.body.appendChild(fremd);
    try {
      act(() => void fireEvent.keyDown(screen.getByRole("application"), { key: "f" }));
      expect(istDunkel()).toBe(false);
    } finally {
      fremd.remove();
    }
  });

  it("es fängt nichts ab: der Anschlag kommt beim Antwortfeld an wie ohne CVI", () => {
    bauRaetsel(3);
    const feld = screen.getByRole("textbox") as HTMLInputElement;
    const ev = new KeyboardEvent("keydown", { key: "H", bubbles: true, cancelable: true });
    act(() => void feld.dispatchEvent(ev));
    expect(ev.defaultPrevented).toBe(false);
    expect(schicht()!.getAttribute("aria-hidden")).toBe("true");
  });
});

// ---------------------------------------------------------------------------
// 5 · Nichts springt auf der Braillezeile
// ---------------------------------------------------------------------------

describe("5 · ★★★★★ Nur sichtbar: Text, Wert und Name bleiben Zeichen für Zeichen gleich", () => {
  function raetselStand(faktor: ZeichenabstandFaktor) {
    const { container } = bauRaetsel(faktor);
    const feld = screen.getByRole("textbox", { name: "Deine Antwort" }) as HTMLInputElement;
    fireEvent.change(feld, { target: { value: "Hals" } });
    const stand = {
      frage: container.querySelector("p.text-2xl")!.textContent,
      wert: feld.value,
      name: feld.labels?.[0]?.textContent,
      text: container.textContent,
    };
    cleanup();
    return stand;
  }

  it("Rätsel: Frage, Feldinhalt und Feldname sind mit und ohne CVI dieselben", () => {
    const aus = raetselStand(1);
    const an = raetselStand(3);
    expect(an).toEqual(aus);
    expect(an.frage).toBe(RAETSEL[0].frage);
    expect(an.wert).toBe("Hals");
  });

  it("Buchstabensalat: Quellwort und der Vorrat als Feldname bleiben dieselben", () => {
    const stand = (faktor: ZeichenabstandFaktor) => {
      const { container } = bauSalat(faktor);
      const feld = screen.getByRole("textbox") as HTMLInputElement;
      // Die Beschriftung IST der Vorrat plus vier geschützte Leerzellen
      // (Braillezeile) - Zeichen für Zeichen, ohne einen Abstand dazwischen.
      expect(feld.labels?.[0]?.textContent).toBe(salatFeldbeschriftung("Weihnachtsbaum", "de"));
      fireEvent.change(feld, { target: { value: "Baum" } });
      const s = { text: container.textContent, wert: feld.value };
      cleanup();
      return s;
    };
    expect(stand(3)).toEqual(stand(1));
  });

  it("Spiele: die Zeichen der Szenen sind dieselben (keine eingefügten Leerzeichen)", () => {
    const zeichen = (faktor: ZeichenabstandFaktor) => {
      bauBuehne(kurs("climb", ["fjdk"]), faktor);
      const t = [...document.body.querySelectorAll(".px-climb-sign--active text")].map((e) => e.textContent);
      cleanup();
      return t;
    };
    expect(zeichen(3)).toEqual(zeichen(1));
    expect(zeichen(3)).toEqual(["f", "j", "d", "k"]);
  });
});

// ---------------------------------------------------------------------------
// 6 · Durchreichen: JEDER Einbau bekommt den Wert
// ---------------------------------------------------------------------------

/**
 * Der Faktor kommt aus EINER Quelle (`TippenTrainerPage`: Konto bei Kindern,
 * Gerät bei Gästen und Lehrkräften) und wird als Prop durchgereicht. Ein
 * vergessener Prop fällt keinem Typprüfer auf (er ist wahlweise, Vorgabe 1) -
 * darum hier: Jeder Einbau dieser Bauteile im Quelltext trägt ihn. Das gilt
 * auch für einen Einbau, den es heute noch nicht gibt.
 */
describe("6 · Durchreichen: jeder Einbau trägt `zeichenabstand`", () => {
  const BAUTEILE = [
    "ExpeditionStage",
    "ExpeditionJourney",
    "FloeFreePlay",
    "RaetselLauf",
    "BuchstabensalatLauf",
    "IgluLauf",
    "PyramidenSchmuck",
    "SteilwandScene",
    "StormScene",
    "StationScene",
    "ClimbSign",
    "TilePool",
    "SlotRow",
  ];

  function quellDateien(pfad: string): string[] {
    const voll = join(WURZEL, pfad);
    if (statSync(voll).isFile()) return [voll];
    return readdirSync(voll).flatMap((n) => {
      const kind = join(voll, n);
      if (statSync(kind).isDirectory()) return quellDateien(relative(WURZEL, kind));
      return /\.tsx$/.test(n) ? [kind] : [];
    });
  }

  const EINBAUTEN = ["src/components/typing", "src/features/public/TippenTrainerPage.tsx"]
    .flatMap(quellDateien)
    .flatMap((datei) => {
      const text = readFileSync(datei, "utf8");
      const funde: { wo: string; bauteil: string; tag: string }[] = [];
      for (const bauteil of BAUTEILE) {
        const re = new RegExp(`<${bauteil}\\b`, "g");
        for (let m = re.exec(text); m; m = re.exec(text)) {
          const ende = text.indexOf("/>", m.index);
          funde.push({
            wo: `${relative(WURZEL, datei)}:${text.slice(0, m.index).split("\n").length}`,
            bauteil,
            tag: text.slice(m.index, ende),
          });
        }
      }
      return funde;
    });

  it("Grundmenge: die Einbauten werden gefunden (Gegenprobe gegen einen leeren Lauf)", () => {
    const namen = new Set(EINBAUTEN.map((e) => e.bauteil));
    for (const b of BAUTEILE) expect(namen.has(b), `${b} kommt vor`).toBe(true);
    // AdaptiveTrainer (Rätsel, Salat, Spiel, Belohnung, Pyramide), SerienTrainer,
    // FloeFreePlay, ExpeditionJourney, ExpeditionStage (3 Szenen), 3 Szenen-Teile.
    expect(EINBAUTEN.length).toBeGreaterThanOrEqual(14);
  });

  it("jeder Einbau reicht den Faktor weiter", () => {
    const ohne = EINBAUTEN.filter((e) => !/\bzeichenabstand=\{/.test(e.tag)).map((e) => `${e.wo} <${e.bauteil}>`);
    expect(ohne).toEqual([]);
  });
});
