/**
 * WÄCHTER über den ABLAUF der Schreibprobe (10.09.2026).
 *
 * ★★★ Warum es diesen Wächter gibt - und was er von den anderen unterscheidet.
 * `tastenflow-schreibprobe-logik.test.ts` prüft das RECHENWERK: Phasen, Uhr,
 * Rotation, Auswertung. Das hier prüft den ABLAUF, also die drei Stellen, an
 * denen ein Kind seine Prüfung verlieren kann, ohne dass eine einzige Zahl
 * falsch wäre:
 *
 *  1. **Der Startbildschirm hängt nicht am Text.** Gefunden von der Rauchprobe
 *     des Baus: Solange die 6000 Zeichen unterwegs waren, sah ein Kind weder
 *     „Beginnen" noch „Ich schreibe nicht mit" - bei einer Verbindung, die
 *     hakt, also einen leeren Bildschirm im Einstiegsfenster.
 *
 *  2. ★★★★★ **Eine Probe, deren Zeit schon abgelaufen ist, muss trotzdem
 *     abgeben.** Ebenfalls von der Rauchprobe gefunden, und der teuerste der
 *     drei: Wer die Seite erst nach Ablauf öffnet, hängte das Ergebnis nie ein
 *     - der Abbruch geht über `TypingSession`, und die merkt sich beim
 *     Einhängen den Zählerstand, den sie VORFINDET. Das Ergebnis kam nie bei
 *     der Lehrkraft an, und niemand hätte es gemerkt: Das Kind steht in der
 *     Klasse als „nicht angetreten", was ja auch stimmen könnte.
 *     **Kein Bauteil-Test sieht diesen Fall** - er entsteht nur aus dem
 *     Zusammenspiel zweier Bauteile.
 *
 *  3. **Ein Neuladen darf nichts verdoppeln.** Der Gerätespeicher merkt die
 *     fertigen Zeilen; begänne die Session danach wieder bei Zeile 1, käme
 *     alles Geschriebene ein zweites Mal dazu.
 *
 * ⚠️ TÖNE UND STIMME AUS - jsdom hat weder Web-Audio noch Sprachausgabe.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen, cleanup, waitFor } from "@testing-library/react";

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

/*
 * ★ D4 (Nachbesserung E5b, 11.09.2026): Nur `speakSequence` wird ersetzt - der
 * Rest von `voice.ts` (Einstellungen, `useVoice`) bleibt echt. Gemessen wird
 * damit die WIRKUNG von `voiceEnabled`, nicht bloss sein Name im Quelltext:
 * jsdom hat ohnehin keine Sprachausgabe, `speakSequence` liefe ins Leere -
 * der Spion macht den Aufruf selbst sichtbar.
 */
vi.mock("@/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing/voice")>();
  return { ...echt, speakSequence: vi.fn() };
});

import { SchreibprobeLauf } from "@/components/typing/SchreibprobeLauf";
import {
  LEERER_STAND,
  PRUEFUNG_WORT,
  type SchreibprobePlan,
} from "@/lib/typing/schreibprobe";
import {
  LEERER_FORTSCHRITT,
  type Fortschritt,
  type SchreibprobeStand,
} from "@/lib/typing/useSchreibprobe";
import type { Probenergebnis } from "@/lib/typing/schreibprobeAuswertung";
import type { TypingAccount } from "@/lib/typing/account";
import { ladeTexte } from "@/lib/typing/schreibproben";
import { speakSequence, useVoice } from "@/lib/typing/voice";
import { createClass, registerTeacher } from "@/lib/typing/account";
import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";

const KIND: TypingAccount = {
  id: "p1",
  role: "schueler",
  name: "Ferdi",
  classCode: "K1",
  createdAt: 1,
};

function plan(over: Partial<SchreibprobePlan> = {}): SchreibprobePlan {
  return {
    id: "sp-1",
    niveau: "start",
    startMs: Date.now() - 60_000,
    dauerMin: 10,
    textNr: 0,
    startZeile: 0,
    zuschlagProzent: 0,
    angelegtMs: Date.now() - 120_000,
    ...over,
  };
}

/** Ein Prüfungs-Stand, wie ihn `useSchreibprobe` liefert - hier von Hand. */
function probeStand(over: Partial<SchreibprobeStand> = {}): SchreibprobeStand {
  return {
    plan: plan(),
    phase: "offen",
    stand: { ...LEERER_STAND },
    geladen: true,
    einstiegBis: Date.now() + 9 * 60_000,
    beginne: vi.fn(),
    melde: vi.fn(),
    schliesseErgebnis: vi.fn(),
    gibAb: vi.fn(async (_e: Probenergebnis) => {}),
    fortschritt: LEERER_FORTSCHRITT,
    merkeFortschritt: vi.fn(),
    ...over,
  };
}

beforeEach(() => {
  localStorage.clear();
});
afterEach(cleanup);

describe("Der Startbildschirm hängt nicht am Text", () => {
  it("zeigt „Beginnen“ und den Ausweg, BEVOR der Text da ist", async () => {
    // Der Text wird nachgeladen (dynamisches `import`). In diesem Takt ist er
    // garantiert noch nicht da - genau der Zustand, in dem ein Kind mit
    // hakender Verbindung minutenlang steht.
    render(
      <SchreibprobeLauf
        probe={probeStand()}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /Beginnen/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /nicht mit/i })).toBeTruthy();
    // Und die Markierung steht da, nicht erst mit dem Text.
    expect(screen.getAllByText(new RegExp(PRUEFUNG_WORT)).length).toBeGreaterThan(0);
  });
});

describe("★ Eine abgelaufene Probe gibt trotzdem ab", () => {
  it("wertet aus, obwohl nie eine Session im Baum stand", async () => {
    const gibAb = vi.fn(async (_e: Probenergebnis) => {});
    // Ein Kind, dessen Zeit abgelaufen ist, während die Seite zu war:
    // begonnen vor 20 Minuten, Prüfungszeit 10 Minuten.
    render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 20 * 60_000 },
          gibAb,
          fortschritt: {
            ...LEERER_FORTSCHRITT,
            zeichen: 240,
            fehler: 12,
            zeilen: 8,
            schreibMs: 120_000,
          },
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );

    await waitFor(() => expect(gibAb).toHaveBeenCalledTimes(1), { timeout: 4000 });
    const ergebnis = gibAb.mock.calls[0][0];
    // ★ Und zwar mit dem, was WIRKLICH geschrieben wurde - nicht mit Nullen.
    expect(ergebnis.zeichen).toBe(240);
    expect(ergebnis.fehler).toBe(12);
    expect(ergebnis.zeilen).toBe(8);
    expect(ergebnis.probeId).toBe("sp-1");
  });

  it("gibt GENAU EINMAL ab, auch wenn die Uhr weiterläuft", async () => {
    const gibAb = vi.fn(async (_e: Probenergebnis) => {});
    render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 20 * 60_000 },
          gibAb,
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    await waitFor(() => expect(gibAb).toHaveBeenCalledTimes(1), { timeout: 4000 });
    await new Promise((r) => setTimeout(r, 1400));
    // Ein zweiter Aufruf wäre am Server eine abgewiesene Zeile - und in der
    // Kind-Ansicht ein zweites Ergebnis zur selben Probe.
    expect(gibAb).toHaveBeenCalledTimes(1);
  });
});

describe("★ Ein Neuladen verdoppelt nichts", () => {
  it("übernimmt den gemerkten Fortschritt in das Ergebnis", async () => {
    const gibAb = vi.fn(async (_e: Probenergebnis) => {});
    const schonGeschrieben: Fortschritt = {
      zeichen: 900,
      fehler: 30,
      zeilen: 31,
      schreibMs: 400_000,
      wartezeitMs: 5_000,
      anschlaege: [
        { char: "f", correct: true, ms: 200 },
        { char: "f", correct: false },
        { char: "f", correct: false },
        { char: "f", correct: false },
      ],
    };
    render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 20 * 60_000 },
          gibAb,
          fortschritt: schonGeschrieben,
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    await waitFor(() => expect(gibAb).toHaveBeenCalledTimes(1), { timeout: 4000 });
    const e = gibAb.mock.calls[0][0];
    // Genau die gemerkten Werte - nicht das Doppelte, nicht null.
    expect(e.zeichen).toBe(900);
    expect(e.fehler).toBe(30);
    expect(e.zeilen).toBe(31);
    expect(e.wartezeitMs).toBe(5_000);
    // Und die Anschläge sind mitgekommen: „f" war viermal dran, dreimal daneben.
    expect(e.wacklig.map((t) => t.zeichen)).toEqual(["f"]);
    expect(e.tasten[0].dran).toBe(4);
  });

  it("★ setzt den Text bei der NÄCHSTEN Zeile fort, nicht wieder bei der ersten", async () => {
    // Der eigentliche Riegel gegen das Verdoppeln: Die schon fertigen Zeilen
    // sind gezählt. Begänne die Session wieder bei Zeile 1, schriebe das Kind
    // denselben Text noch einmal - und alles käme ein zweites Mal dazu.
    render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
          fortschritt: { ...LEERER_FORTSCHRITT, zeichen: 900, fehler: 30, zeilen: 31 },
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    // Der Text wird nachgeladen - warten, bis die Session steht.
    await waitFor(
      () => expect(screen.getByText(/Zeile \d+ von \d+/)).toBeTruthy(),
      { timeout: 4000 },
    );
    const zeile = screen.getByText(/Zeile \d+ von \d+/).textContent ?? "";
    // 31 fertige Zeilen ⇒ die 32. ist dran (die Anzeige zählt ab 1).
    expect(zeile).toMatch(/Zeile 32 von /);
  });
});

describe("★★★ Texte sparen: der nächste Text schliesst im Lauf nahtlos an (Johannes 10.09.2026)", () => {
  it("nach der letzten Zeile von Text 15 kommt ohne Pause Zeile 1 von Text 1 - und das Ergebnis weiss, wo das Kind war", async () => {
    const texte = await ladeTexte("start");
    const letzte = texte[14].zeilen.length - 1;
    const zeile15 = texte[14].zeilen[letzte];
    const gibAb = vi.fn(async (_e: Probenergebnis) => {});
    const { container } = render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          // Die Challenge beginnt in der LETZTEN Zeile des letzten Textes.
          plan: plan({ textNr: 14, startZeile: letzte }),
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
          gibAb,
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    await waitFor(() => expect(screen.getByText(/Zeile 1 von \d+/)).toBeTruthy(), {
      timeout: 4000,
    });
    const feld = () => container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]')!;
    expect(feld().value.endsWith(zeile15)).toBe(true);
    // Gegenprobe: Die Session hat mehr als diese eine Zeile - sonst wäre der
    // Text nach ihr zu Ende und die Probe vorbei.
    const gesamt = Number((screen.getByText(/Zeile \d+ von \d+/).textContent ?? "").match(/von (\d+)/)?.[1]);
    expect(gesamt).toBeGreaterThan(100);

    for (const taste of zeile15) {
      await act(async () => {
        fireEvent.keyDown(feld(), { key: taste });
      });
    }
    // Nach der kurzen Zeilenpause steht die erste Zeile von Text 1 da.
    await waitFor(() => expect(screen.getByText(/Zeile 2 von \d+/)).toBeTruthy(), {
      timeout: 3000,
    });
    expect(feld().value.endsWith(texte[0].zeilen[0])).toBe(true);
    // Kein Ende, keine Abschluss-Karte: Abgegeben wurde nichts.
    expect(gibAb).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: /Nochmal/i })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /Fertig - abgeben/ }));
    await waitFor(() => expect(gibAb).toHaveBeenCalledTimes(1), { timeout: 3000 });
    // ★★ Das Ende steht schon im NÄCHSTEN Text - daraus rechnet die Lehrkraft-Seite weiter.
    expect(gibAb.mock.calls[0][0]).toMatchObject({
      textNr: 14,
      startZeile: letzte,
      endeTextNr: 0,
      endeZeile: 0,
      zeilen: 1,
      textZuEnde: false,
    });
  });
});

describe("★ Ein Strich je MINUTE, die Uhr daneben (Johannes 10.09.2026)", () => {
  it("zeichnet so viele Striche wie Minuten - nicht wie Zeilen", async () => {
    const { container } = render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          plan: plan({ dauerMin: 8 }),
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    await waitFor(() => expect(screen.getByText(/Zeile \d+ von \d+/)).toBeTruthy(), {
      timeout: 4000,
    });
    // Gegenprobe: Der Text hat VIEL mehr Zeilen als Minuten - sonst bewiese
    // die Zahl der Striche nichts. Genau das war der Fehler: ein Strich je Zeile.
    const zeilen = Number((screen.getByText(/Zeile \d+ von \d+/).textContent ?? "").match(/von (\d+)/)?.[1]);
    expect(zeilen).toBeGreaterThan(8);
    expect(container.querySelectorAll(".tt-tick").length).toBe(8);
  });

  it("die Uhr steht in DERSELBEN Reihe wie die Striche", async () => {
    const { container } = render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    await waitFor(() => expect(container.querySelector(".tt-ticks")).toBeTruthy(), {
      timeout: 4000,
    });
    const leiste = container.querySelector(".tt-ticks")?.parentElement;
    expect(leiste?.textContent ?? "").toMatch(/^\d+:\d\d$/);
    // Und nur dort - im Kopf der Karte steht keine zweite Uhr mehr.
    // Gezählt wird der EIGENE Text eines Elements (sonst zählte die Hülle der
    // Leiste mit), und ausgenommen ist der Zeitstand vor der Zeile: Der steht
    // gewollt für die Braillezeile im Tippfeld (`[data-angabe]`).
    const uhren = [...container.querySelectorAll("p, span")].filter(
      (el) =>
        !el.closest("[data-angabe]") &&
        [...el.childNodes].some(
          (k) => k.nodeType === Node.TEXT_NODE && /^\d+:\d\d$/.test((k.textContent ?? "").trim()),
        ),
    );
    expect(uhren.length).toBe(1);
  });

  it("die laufende Minute füllt sich, die vergangenen sind voll", async () => {
    const { container } = render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 90_000 },
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    await waitFor(() => expect(container.querySelector(".tt-ticks")).toBeTruthy(), {
      timeout: 4000,
    });
    // 90 Sekunden von 10 Minuten: eine volle, eine halbe.
    expect(container.querySelectorAll(".tt-tick--on").length).toBe(1);
    expect(container.querySelectorAll(".tt-tick--laeuft").length).toBe(1);
    const fuellung = container.querySelector<HTMLElement>(".tt-tick-fuellung");
    expect(fuellung?.style.height).toBe("50%");
  });
});

describe("★ Nach dem Abgeben: Weiter üben oder Escape (Johannes 10.09.2026)", () => {
  it("„Weiter üben“ schliesst die Auswertung", () => {
    const schliesseErgebnis = vi.fn();
    render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "abgegeben",
          stand: { ...LEERER_STAND, abgegeben: true },
          schliesseErgebnis,
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    screen.getByRole("button", { name: /Weiter üben/i }).click();
    expect(schliesseErgebnis).toHaveBeenCalledTimes(1);
  });

  it("Escape schliesst sie ebenso", () => {
    const schliesseErgebnis = vi.fn();
    render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "abgegeben",
          stand: { ...LEERER_STAND, abgegeben: true },
          schliesseErgebnis,
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(schliesseErgebnis).toHaveBeenCalledTimes(1);
  });

  it("Gegenprobe: WÄHREND der Challenge schliesst Escape nichts", async () => {
    const schliesseErgebnis = vi.fn();
    render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
          schliesseErgebnis,
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(schliesseErgebnis).not.toHaveBeenCalled();
  });
});

describe("★★★★★ Escape MITTEN im Schreiben: Rückfrage (3. Klasse HAS, 23.09.2026)", () => {
  /*
   * Die Lehrkraft: „Haben auch probiert die Tippchallenge bei einer Schülerin
   * mit ESC abzubrechen, hat aber nicht funktioniert." Johannes: Rückfrage
   * öffnen - wie im Klassenmatch. „Weiterschreiben" hat den Fokus, damit ein
   * gewohnheitsmässiges Escape + Enter nichts abgibt.
   */
  async function laufendeChallenge() {
    const gibAb = vi.fn(async (_e: Probenergebnis) => {});
    render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
          gibAb,
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    await waitFor(() => expect(screen.getByText(/Zeile 1 von \d+/)).toBeTruthy(), { timeout: 4000 });
    return { gibAb };
  }

  it("Escape öffnet die Rückfrage, der Fokus steht auf „Weiterschreiben“", async () => {
    await laufendeChallenge();
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    const fenster = await screen.findByRole("dialog", { name: `${PRUEFUNG_WORT} abgeben?` });
    expect(fenster).toBeTruthy();
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole("button", { name: "Weiterschreiben" })),
    );
  });

  it("„Weiterschreiben“ schliesst das Fenster - nichts wird abgegeben", async () => {
    const { gibAb } = await laufendeChallenge();
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    fireEvent.click(await screen.findByRole("button", { name: "Weiterschreiben" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(gibAb).not.toHaveBeenCalled();
    expect(screen.getByText(/Zeile 1 von \d+/)).toBeTruthy();
  });

  it("„Abgeben“ gibt GENAU EINMAL ab - als früher abgegeben", async () => {
    const { gibAb } = await laufendeChallenge();
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    fireEvent.click(await screen.findByRole("button", { name: "Abgeben" }));
    await waitFor(() => expect(gibAb).toHaveBeenCalledTimes(1), { timeout: 3000 });
    expect(gibAb.mock.calls[0][0]).toMatchObject({ frueherAbgegeben: true });
  });

  it("★ englische Bedienung: dieselbe Rückfrage, englisch", async () => {
    localStorage.setItem("tastenflow-bedienung", "en");
    const { BedienSpracheProvider } = await import("@/lib/bedienSprache");
    render(
      <BedienSpracheProvider>
        <SchreibprobeLauf
          probe={probeStand({ phase: "laeuft", stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 } })}
          account={KIND}
          stufe="kids"
          onTask={vi.fn()}
        />
      </BedienSpracheProvider>,
    );
    await waitFor(() => expect(screen.getByText(/Escape: hand in\./)).toBeTruthy(), { timeout: 4000 });
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(await screen.findByRole("dialog", { name: /^Hand in your / })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Keep typing" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Hand in" })).toBeTruthy();
  });

  it("Gegenprobe: VOR dem ersten Anschlag (Uhr läuft nicht) öffnet Escape nichts", async () => {
    render(
      <SchreibprobeLauf probe={probeStand({ phase: "offen" })} account={KIND} stufe="kids" onTask={vi.fn()} />,
    );
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("Die Braillezeile bleibt ruhig", () => {
  it("der Zeitstand steht in KEINER Live-Region", async () => {
    const { container } = render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    // Gegenprobe: Es MUSS einen Zeitstand geben - sonst prüft der Test nichts.
    await waitFor(() =>
      expect(container.textContent).toMatch(/\d+:\d\d/),
    );
    for (const bereich of container.querySelectorAll("[aria-live]")) {
      expect(bereich.textContent ?? "").not.toMatch(/\d+:\d\d/);
    }
  });

  it("nichts ist `disabled` - Regel R5", () => {
    const { container } = render(
      <SchreibprobeLauf
        probe={probeStand()}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    expect(container.querySelectorAll("[disabled]").length).toBe(0);
  });
});

/**
 * ★★★ D4 (Nachbesserung E5b, 11.09.2026): Vorlesen in der Challenge folgt dem
 * EIGENEN Schalter des Kindes - kein zweites Häkchen mehr.
 *
 * Bis zum Umbau schaltete `pruefungStumm` (`lib/typing/voice.ts`) die Stimme
 * in der Schreibprobe stumm, solange die Lehrkraft das Häkchen „Vorlesen bei
 * Prüfungen erlaubt" nicht gesetzt hatte - unabhängig vom eigenen
 * Vorlesen-Schalter des Kindes. Johannes, 11.09.2026 nachmittags: „schaff
 * das Häkchen ab, es verwirrt nur." Seither gibt `SchreibprobeLauf` an
 * `TypingSession` denselben Schalter weiter wie beim Üben
 * (`voiceEnabled={useVoice((s) => s.enabled)}`, `SchreibprobeLauf.tsx:171/808`).
 *
 * Gemessen wird die WIRKUNG, nicht nur der Name: Nur wenn das eigene Vorlesen
 * an ist, liest `TypingSession` den Zeilenanfang vor (`speakSequence` im
 * ZEILENANFANG-Effekt, `TypingSession.tsx` - `if (phase !== "run" ||
 * !voiceEnabled) return;`). Dazu die Gegenprobe im Quelltext: Die zwei Namen
 * der abgeschafften Regel dürfen nirgends mehr auftauchen - sonst gäbe es
 * einen Weg, der das in der Challenge wieder umbiegt.
 */
describe("★★★ D4: Vorlesen in der Challenge folgt dem eigenen Schalter (11.09.2026)", () => {
  beforeEach(() => {
    vi.mocked(speakSequence).mockClear();
  });
  afterEach(() => {
    useVoice.setState({ enabled: false });
  });

  it("Vorlesen AN ⇒ TypingSession liest den Zeilenanfang vor (voiceEnabled=true)", async () => {
    useVoice.setState({ enabled: true });
    render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    await waitFor(() => expect(screen.getByText(/Zeile \d+ von \d+/)).toBeTruthy(), {
      timeout: 4000,
    });
    expect(speakSequence).toHaveBeenCalled();
  });

  it("Vorlesen AUS ⇒ TypingSession bleibt beim Zeilenanfang still (voiceEnabled=false)", async () => {
    useVoice.setState({ enabled: false });
    render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    await waitFor(() => expect(screen.getByText(/Zeile \d+ von \d+/)).toBeTruthy(), {
      timeout: 4000,
    });
    expect(speakSequence).not.toHaveBeenCalled();
  });

  /**
   * ⚠️ Ausgenommen sind reine Kommentarzeilen (führendes `*` oder `//`):
   * `voice.ts:124` erklärt in einem Kommentar bewusst, dass es
   * `pruefungStumm` früher GAB und WARUM es weg ist - genau die
   * Erklär-Zeile, die der Prüfbefund E5 §4 selbst als einzigen (zulässigen)
   * Treffer nennt. Gemessen wird darum CODE, nicht Geschichte.
   */
  function ohneKommentare(text: string): string {
    return text
      .split("\n")
      .filter((zeile) => {
        const z = zeile.trim();
        return !(z.startsWith("*") || z.startsWith("//") || z.startsWith("/*"));
      })
      .join("\n");
  }

  it("kein Weg biegt das in der Challenge um - die abgeschaffte Regel steht in keinem CODE mehr", () => {
    const wurzel = resolve(__dirname, "..");
    const dateien = [
      "src/components/typing/SchreibprobeLauf.tsx",
      "src/lib/typing/voice.ts",
    ];
    for (const pfad of dateien) {
      const code = ohneKommentare(readFileSync(resolve(wurzel, pfad), "utf8"));
      expect(code, `${pfad} enthält "pruefungStumm" ausserhalb eines Kommentars`).not.toMatch(
        /pruefungStumm/,
      );
      expect(code, `${pfad} enthält "vorlesenPruefung" ausserhalb eines Kommentars`).not.toMatch(
        /vorlesenPruefung/,
      );
    }
  });
});

describe("★★★ Niveau 'eigen' - Tippchallenge mit eigener Datei (17.09.2026)", () => {
  it("lädt den hochgeladenen Text UND wiederholt ihn, statt nach einem Durchlauf abzubrechen", async () => {
    _resetTypingBackend();
    const t = registerTeacher("Frau Eigen", `eigen-${Math.random()}@example.org`, "geheim1");
    if (!t.ok) throw new Error("Lehrkraft nicht angelegt");
    const c = createClass(t.value.id, "Eigen-Klasse");
    if (!c.ok) throw new Error("Klasse nicht angelegt");
    // Ein sehr kurzer Text - bei 10 Minuten Prüfungszeit (800 Anschläge/Min
    // = 8000 Zeichen nötig) MUSS er sich viele Male wiederholen.
    const textId = await typingBackend().speichereEigenenText(c.value.code, t.value.id, "kurz.txt", [
      "eins",
      "zwei",
    ]);
    expect(textId).not.toBeNull();

    const gibAb = vi.fn(async (_e: Probenergebnis) => {});
    const { container } = render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          plan: plan({ niveau: "eigen", eigeneDateiId: textId!, dauerMin: 10 }),
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
          gibAb,
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );

    // Der Text der Datei erscheint - nicht einer der Bank-Texte.
    await waitFor(() => expect(screen.getByText(/Zeile 1 von \d+/)).toBeTruthy(), {
      timeout: 4000,
    });
    const feld = () => container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]')!;
    expect(feld().value.endsWith("eins")).toBe(true);

    // Weit mehr als 2 Zeilen bereit - der eine Text wurde vielfach wiederholt.
    const gesamt = Number(
      (screen.getByText(/Zeile \d+ von \d+/).textContent ?? "").match(/von (\d+)/)?.[1],
    );
    expect(gesamt).toBeGreaterThan(100);

    // "eins" fertig schreiben - weiter geht es mit "zwei" (Zeile 2 dieses
    // einen Textes), NICHT mit einem Bank-Text.
    for (const taste of "eins") {
      await act(async () => {
        fireEvent.keyDown(feld(), { key: taste });
      });
    }
    await waitFor(() => expect(screen.getByText(/Zeile 2 von \d+/)).toBeTruthy(), {
      timeout: 3000,
    });
    expect(feld().value.endsWith("zwei")).toBe(true);

    // "zwei" fertig schreiben - der Text ist zu Ende, es geht NAHTLOS wieder
    // bei "eins" weiter (die Wiederholung, die `maxLaeufe` ermöglicht).
    for (const taste of "zwei") {
      await act(async () => {
        fireEvent.keyDown(feld(), { key: taste });
      });
    }
    await waitFor(() => expect(screen.getByText(/Zeile 3 von \d+/)).toBeTruthy(), {
      timeout: 3000,
    });
    expect(feld().value.endsWith("eins")).toBe(true);
    expect(gibAb).not.toHaveBeenCalled();
  });

  it("ohne eigeneDateiId (kaputter Plan) zeigt den Ausweich-Bildschirm statt abzustürzen", async () => {
    render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          plan: plan({ niveau: "eigen", eigeneDateiId: undefined }),
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    await waitFor(() =>
      expect(screen.getByText(/Der Text steht gerade nicht bereit/)).toBeTruthy(),
    );
  });
});

/**
 * ★★★★★ „FREIES SCHREIBEN" IN DER TIPPCHALLENGE (23.09.2026, Bauplan §7).
 *
 * Diese Fälle prüfen den EINBAU in `SchreibprobeLauf` - `FreieSchreibzeile`
 * selbst (Rücktaste, Zeilenende, Schreibmarke, …) hat einen eigenen Wächter
 * (`tests/tastenflow-freie-schreibzeile.test.tsx`). Eine eigene, kurze Datei
 * macht die Soll-Zeilen deterministisch (wie beim Niveau „eigen" oben).
 */
describe("★★★★★ „Freies Schreiben“ - Einbau in SchreibprobeLauf (23.09.2026)", () => {
  async function freiPlan(
    zeilen: string[],
    over: Partial<SchreibprobePlan> = {},
  ): Promise<SchreibprobePlan> {
    _resetTypingBackend();
    const t = registerTeacher("Frau Frei", `frei-${Math.random()}@example.org`, "geheim1");
    if (!t.ok) throw new Error("Lehrkraft nicht angelegt");
    const c = createClass(t.value.id, "Frei-Klasse");
    if (!c.ok) throw new Error("Klasse nicht angelegt");
    const textId = await typingBackend().speichereEigenenText(
      c.value.code,
      t.value.id,
      "frei.txt",
      zeilen,
    );
    if (!textId) throw new Error("Text nicht gespeichert");
    return plan({ niveau: "eigen", eigeneDateiId: textId, modus: "frei", dauerMin: 10, ...over });
  }

  const feldVon = (container: HTMLElement) =>
    container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]')!;

  async function tippe(container: HTMLElement, text: string) {
    for (const taste of text) {
      await act(async () => {
        fireEvent.keyDown(feldVon(container), { key: taste });
      });
    }
  }

  it("zwei Zeilen mit einem Tippfehler und einer Korrektur - „Fertig - abgeben“ gibt GENAU EINMAL ab", async () => {
    const gibAb = vi.fn(async (_e: Probenergebnis) => {});
    const meinPlan = await freiPlan(["hallo welt", "gute nacht"]);
    const { container } = render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          plan: meinPlan,
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
          gibAb,
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    await waitFor(() => expect(screen.getByText(/Zeile 1 von \d+/)).toBeTruthy(), {
      timeout: 4000,
    });

    // Zeile 1: „hallo welt" mit einem stehenden Tippfehler ("xelt" statt "welt").
    // Zwei Wörter erreicht ⇒ die zweite Leertaste beendet die Zeile von selbst.
    await tippe(container, "hallo xelt ");
    await waitFor(() => expect(screen.getByText(/Zeile 2 von \d+/)).toBeTruthy());

    // Zeile 2: „gute nacht", davor eine ausgebesserte Fehleingabe ("g" + Rücktaste).
    await tippe(container, "g");
    await act(async () => {
      fireEvent.keyDown(feldVon(container), { key: "Backspace" });
    });
    await tippe(container, "gute nacht ");
    await waitFor(() => expect(gibAb).not.toHaveBeenCalled()); // noch nicht abgegeben

    fireEvent.click(screen.getByRole("button", { name: /Fertig - abgeben/ }));
    await waitFor(() => expect(gibAb).toHaveBeenCalledTimes(1), { timeout: 3000 });
    const ergebnis = gibAb.mock.calls[0][0];
    expect(ergebnis.modus).toBe("frei");
    expect(ergebnis.fehler).toBe(1); // "xelt" gegen "welt"
    expect(ergebnis.korrekturen).toBe(1); // die eine Rücktaste
    expect(ergebnis.getippt).toEqual(["hallo xelt", "gute nacht"]);
    expect(ergebnis.zeilen).toBe(2);
    // Keine Tasten-Statistik im freien Modus - keine Zuordnung Taste↔Soll möglich.
    expect(ergebnis.tasten).toEqual([]);
    expect(ergebnis.wacklig).toEqual([]);

    // Ein zweiter Klick darf nicht zweimal abgeben.
    fireEvent.click(screen.getByRole("button", { name: /Fertig - abgeben/ }));
    await new Promise((r) => setTimeout(r, 50));
    expect(gibAb).toHaveBeenCalledTimes(1);
  });

  it("Stopp mitten in einer Zeile nimmt die angefangene Zeile mit", async () => {
    const gibAb = vi.fn(async (_e: Probenergebnis) => {});
    const meinPlan = await freiPlan(["hallo welt", "gute nacht"]);
    const { container } = render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          plan: meinPlan,
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
          gibAb,
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    await waitFor(() => expect(screen.getByText(/Zeile 1 von \d+/)).toBeTruthy(), {
      timeout: 4000,
    });
    // Nur "hallo" - die Zeile ist NICHT fertig (erst ein Wort von zweien).
    await tippe(container, "hallo");
    fireEvent.click(screen.getByRole("button", { name: /Fertig - abgeben/ }));
    await waitFor(() => expect(gibAb).toHaveBeenCalledTimes(1), { timeout: 3000 });
    const ergebnis = gibAb.mock.calls[0][0];
    expect(ergebnis.getippt).toEqual(["hallo"]);
    expect(ergebnis.zeilen).toBe(0); // keine FERTIGE Zeile
    expect(ergebnis.frueherAbgegeben).toBe(true);
  });

  it("Neuladen: fortschritt.getippt setzt an der richtigen Zeile fort", async () => {
    const gibAb = vi.fn(async (_e: Probenergebnis) => {});
    const meinPlan = await freiPlan(["hallo welt", "gute nacht"]);
    const { container } = render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          plan: meinPlan,
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
          gibAb,
          fortschritt: {
            ...LEERER_FORTSCHRITT,
            zeilen: 1,
            getippt: ["hallo xelt"],
            korrekturen: 0,
          },
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    // Die erste Zeile ist schon gemerkt - es geht mit Zeile 2 weiter.
    await waitFor(() => expect(screen.getByText(/Zeile 2 von \d+/)).toBeTruthy(), {
      timeout: 4000,
    });
    await tippe(container, "gute nacht ");
    fireEvent.click(screen.getByRole("button", { name: /Fertig - abgeben/ }));
    await waitFor(() => expect(gibAb).toHaveBeenCalledTimes(1), { timeout: 3000 });
    const ergebnis = gibAb.mock.calls[0][0];
    // Die VOR dem Neuladen geschriebene Zeile ist mitgekommen - nicht verloren,
    // nicht verdoppelt.
    expect(ergebnis.getippt).toEqual(["hallo xelt", "gute nacht"]);
    expect(ergebnis.zeilen).toBe(2);
  });

  it("Escape öffnet die Rückfrage auch im freien Modus", async () => {
    const meinPlan = await freiPlan(["hallo welt", "gute nacht"]);
    render(
      <SchreibprobeLauf
        probe={probeStand({
          phase: "laeuft",
          plan: meinPlan,
          stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
        })}
        account={KIND}
        stufe="kids"
        onTask={vi.fn()}
      />,
    );
    await waitFor(() => expect(screen.getByText(/Zeile 1 von \d+/)).toBeTruthy(), {
      timeout: 4000,
    });
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    expect(await screen.findByRole("dialog", { name: `${PRUEFUNG_WORT} abgeben?` })).toBeTruthy();
  });
});
