/**
 * WÄCHTER: KEIN ANSCHLAG GEHT AM ZEILENWECHSEL VERLOREN (11.09.2026).
 *
 * ── Der Befund ──────────────────────────────────────────────────────────────
 * Johannes hat das Klassenmatch mit einer echten Klasse getestet: *„Zwei
 * schüler hatten das gefühl dass nicht alle Tasten erkannt wurden und sie
 * öfter gedrückt werden müssen."* Die Hausregel dazu: **Ein Tastendruck ohne
 * Antwort ist eine kaputte Tastatur.**
 *
 * Nachgestellt, jede Prüfung hier war am alten Stand (HEAD b656ade7) ROT:
 *
 *  1. **Die Pause nach einer Zeile.** Nach dem letzten Zeichen wartet die
 *     Session `zeilenPauseMs` (Lehrgang 550 ms, Match und Challenge 220 ms),
 *     bis die nächste Zeile steht. Ein Anschlag in dieser Zeit verschwand
 *     still - kein Ton, kein Zählen. Wer ohne abzusetzen weiterschreibt, drückt
 *     die erste Taste der nächsten Zeile ein zweites Mal.
 *  2. **Die Chargen-Grenze im Klassenmatch.** Am Ende der vorgelegten Zeilen
 *     wechselte die Session in die Abschluss-Karte, das Tippfeld fiel aus dem
 *     Baum, der Belohnungsklang spielte.
 *  3. **Zwei gleiche Zeilen hintereinander** froren die Session ein.
 *  4. **Ein Stopp in der Pause** zählte die fertige Zeile ein zweites Mal.
 *
 * ★ Johannes am 11.09.2026: *„die behebung des gap beim zeilenwechsel soll
 *   überall erfolgen bei der tippchallenge, beim match und auch beim normal
 *   üben"*. Darum je eine Prüfung an „Mein Training", an der Tippchallenge und
 *   am Klassenmatch - nicht nur an der Session selbst.
 *
 * WOHIN ER SICH BEWEGT, WENN ES SCHLECHTER WIRD: Wer den Puffer entfernt, das
 * Rücksetzen wieder nur an den Text hängt oder die Chargen wieder über die
 * Abschluss-Karte wechselt, wird hier rot.
 *
 * ⚠️ TÖNE AUS - jsdom hat kein Web-Audio.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

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
 * `adaptiveRound` rechnet in jsdom spürbar und liefert zufälligen Text. Für
 * den Zeilenwechsel zählt nur, WANN die Zeilen wechseln: Jeder Aufruf liefert
 * hier dieselben zwei Zeilen „ab", „cd".
 *
 * ⚠️ Bewusst OHNE Aufrufzähler: Eine erste Fassung zählte die Chargen reihum
 * durchs Alphabet und sagte daraus die nächsten Zeilen voraus. Ein Nachschub-
 * Takt des VORIGEN Tests verbrauchte nach dessen Aushängen einen Aufruf - die
 * Vorhersage lag daneben, und der Test wurde rot, ohne dass ein Anschlag
 * fehlte. Ob die Session zurückspringt, zeigt jetzt „Zeile x von y".
 */
vi.mock("@/lib/typing/generator", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing/generator")>();
  return {
    ...echt,
    adaptiveRound: vi.fn(() =>
      ["ab", "cd"].map((text) => ({ text, source: null, art: "woerter" })),
    ),
  };
});

import { TypingSession } from "@/components/typing/TypingSession";
import { KlassenmatchLauf } from "@/components/typing/KlassenmatchLauf";
import { SchreibprobeLauf } from "@/components/typing/SchreibprobeLauf";
import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { MATCH_DAUER_MS, type Match } from "@/lib/typing/klassenmatch";
import { emptyProgress } from "@/lib/typing/progress";
import type { TypingAccount } from "@/lib/typing/account";
import { shiftHandFor } from "@/lib/typing";
import { playErrorSound, playKeyTick, playStarReward } from "@/lib/typing/sound";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { naechsteZeile, ohneBildschirmTastatur, zeilenMarke } from "./_typing-probelauf";
import { LEERER_STAND, type SchreibprobePlan } from "@/lib/typing/schreibprobe";
import {
  LEERER_FORTSCHRITT,
  type SchreibprobeStand,
} from "@/lib/typing/useSchreibprobe";
import type { Probenergebnis } from "@/lib/typing/schreibprobeAuswertung";
import { ladeTexte } from "@/lib/typing/schreibproben";

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.mocked(playStarReward).mockClear();
  vi.mocked(playKeyTick).mockClear();
  vi.mocked(playErrorSound).mockClear();
});

const warte = (ms: number) => act(() => new Promise<void>((r) => setTimeout(r, ms)));

function tippe(feld: HTMLElement, tasten: string) {
  for (const key of tasten) fireEvent.keyDown(feld, { key });
}

const KIND: TypingAccount = {
  id: "franz",
  role: "schueler",
  name: "Franz",
  classCode: "K1",
  createdAt: 1,
};

function session(over: Partial<React.ComponentProps<typeof TypingSession>> = {}) {
  const onItemDone = vi.fn();
  const onLetters = vi.fn();
  const utils = render(
    <TypingSession
      items={["ab", "cd"]}
      contextId="test"
      unlocked={new Set(["a", "b", "c", "d"])}
      shiftLearned={false}
      stufe="kids"
      voiceEnabled={false}
      onRetry={vi.fn()}
      zeilenPauseMs={220}
      onItemDone={onItemDone}
      onLetters={onLetters}
      {...over}
    />,
  );
  const feld = screen.getByRole("textbox") as HTMLTextAreaElement;
  return { ...utils, feld, onItemDone, onLetters };
}

function match(): Match {
  const start = Date.now() - 75_000;
  return {
    id: "m1",
    classCode: "K1",
    hostUid: "sarah",
    hostName: "Sarah",
    status: "laeuft",
    startMs: start,
    endeMs: start + MATCH_DAUER_MS,
    dauerMin: 5,
    createdMs: start - 20_000,
  };
}

function lauf(onTask: ReturnType<typeof vi.fn>) {
  return render(
    <KlassenmatchLauf
      match={match()}
      staende={[]}
      account={KIND}
      stufe="kids"
      lang="de"
      loadFn={async () => emptyProgress()}
      saveFn={vi.fn()}
      onTask={onTask}
      onStand={vi.fn()}
      onFertig={vi.fn()}
      onWeiter={vi.fn()}
      onVerlassen={vi.fn()}
    />,
  );
}

describe("(1) Die Pause nach einer Zeile verschluckt nichts", () => {
  it("★★★ zählt den Anschlag, der SOFORT nach dem Zeilenende kommt", async () => {
    const { feld, onItemDone, onLetters } = session();
    // Erste Zeile fertig - und ohne abzusetzen gleich das „c" der zweiten.
    tippe(feld, "abc");
    await warte(400);
    tippe(feld, "d");
    await warte(400);

    expect(onItemDone, "die zweite Zeile wurde nie fertig").toHaveBeenCalledTimes(2);
    expect(onItemDone.mock.calls[1][0].errors).toBe(0);
    // Das „c" steht als richtiger Anschlag in den Buchstaben der zweiten Zeile.
    expect(onLetters.mock.calls[1][0].map((e: { char: string }) => e.char)).toEqual(["c", "d"]);
    expect(onLetters.mock.calls[1][0].every((e: { correct: boolean }) => e.correct)).toBe(true);
  });

  it("★ zählt auch Anschläge MITTEN in der Pause, in der richtigen Reihenfolge", async () => {
    const { feld, onItemDone } = session({ items: ["ab", "cde", "fg"] });
    tippe(feld, "ab");
    await warte(80);
    tippe(feld, "cd");
    await warte(400);
    tippe(feld, "e");
    await warte(400);
    tippe(feld, "fg");
    await warte(400);
    expect(onItemDone).toHaveBeenCalledTimes(3);
    expect(onItemDone.mock.calls.map((c) => c[0].errors)).toEqual([0, 0, 0]);
  });

  it("★ ein Fehlanschlag in der Pause bleibt ein Fehler - mit Zählung", async () => {
    const { feld, onItemDone } = session();
    tippe(feld, "abx");
    await warte(400);
    tippe(feld, "cd");
    await warte(400);
    expect(onItemDone).toHaveBeenCalledTimes(2);
    expect(onItemDone.mock.calls[1][0].errors).toBe(1);
  });

  it("★★ nimmt die gehaltene Umschalttaste als MOMENTAUFNAHME mit (Gegenhand-Regel)", async () => {
    const seite = shiftHandFor("J");
    const code = seite === "links" ? "ShiftLeft" : "ShiftRight";
    const { feld, onItemDone } = session({
      items: ["ab", "Jc"],
      shiftLearned: true,
      enforceShiftHand: true,
    });
    tippe(feld, "ab");
    // Umschalt halten, „J", loslassen - alles noch in der Pause.
    fireEvent.keyDown(feld, { key: "Shift", code });
    fireEvent.keyDown(feld, { key: "J", code: "KeyJ", shiftKey: true });
    fireEvent.keyUp(feld, { key: "Shift", code });
    await warte(400);
    tippe(feld, "c");
    await warte(400);
    expect(onItemDone).toHaveBeenCalledTimes(2);
    expect(onItemDone.mock.calls[1][0].errors, "das „J“ galt als falscher Griff").toBe(0);
  });

  it("★ der Schreibzeiger steht nach dem Nachspielen am richtigen Zeichen", async () => {
    const { feld } = session({ items: ["ab", "cde"], zeilenPraefix: "P1 4:00 " });
    tippe(feld, "abcd");
    await warte(400);
    // Feldwert bleibt Vorspann + Zeile; der Zeiger hinter „cd".
    expect(feld.value).toBe("P1 4:00 cde");
    expect(feld.selectionStart).toBe(8 + 2);
  });

  it("nimmt höchstens 20 Anschläge mit", async () => {
    const { feld, onItemDone, onLetters } = session();
    tippe(feld, "ab" + "x".repeat(25));
    await warte(400);
    tippe(feld, "cd");
    await warte(400);
    expect(onItemDone).toHaveBeenCalledTimes(2);
    const falsch = onLetters.mock.calls[1][0].filter((e: { correct: boolean }) => !e.correct);
    expect(falsch).toHaveLength(20);
  });

  it("★★ ein Stopp in der Pause zählt die fertige Zeile nicht doppelt und spielt nichts nach", async () => {
    const onStopp = vi.fn();
    const onLetters = vi.fn();
    const grund = {
      items: ["ab", "cd"],
      contextId: "test",
      unlocked: new Set(["a", "b", "c", "d"]),
      shiftLearned: false,
      stufe: "kids" as const,
      voiceEnabled: false,
      onRetry: vi.fn(),
      zeilenPauseMs: 220,
      onStopp,
      onLetters,
    };
    const { rerender } = render(<TypingSession {...grund} stoppSignal={0} />);
    tippe(screen.getByRole("textbox"), "abc");
    rerender(<TypingSession {...grund} stoppSignal={1} />);
    await warte(400);
    expect(onStopp).toHaveBeenCalledTimes(1);
    // Die fertige Zeile ist über `onItemDone`/`onLetters` schon gemeldet - der
    // Rest, der beim Stopp noch dazukommt, ist leer.
    expect(onStopp.mock.calls[0][0].chars, "die fertige Zeile wurde beim Stopp ein zweites Mal gezählt").toBe(0);
    // Das „c" wurde nach dem Stopp nicht mehr auf eine Zeile gespielt.
    expect(onLetters).toHaveBeenCalledTimes(1);
  });

  it("★★ am RUNDENENDE wird nichts in die nächste Runde getragen", async () => {
    const onItemDone = vi.fn();
    const onLetters = vi.fn();
    const grund = {
      contextId: "test",
      unlocked: new Set(["a", "b", "c", "d", "x"]),
      shiftLearned: false,
      stufe: "kids" as const,
      voiceEnabled: false,
      onRetry: vi.fn(),
      zeilenPauseMs: 220,
      onItemDone,
      onLetters,
    };
    const { rerender } = render(<TypingSession {...grund} items={["ab"]} />);
    // Runde fertig - und noch zwei Tasten hinterher, während die Pause läuft.
    tippe(screen.getByRole("textbox"), "abxx");
    await warte(400);
    // Die Abschluss-Karte steht, das Tippfeld ist weg: Die Taste gehört der Karte.
    expect(screen.queryByRole("textbox")).toBeNull();
    rerender(<TypingSession {...grund} items={["cd"]} />);
    const feld = await screen.findByRole("textbox");
    await warte(100);
    tippe(feld, "cd");
    await warte(400);
    expect(onItemDone).toHaveBeenCalledTimes(2);
    expect(onItemDone.mock.calls[1][0].errors).toBe(0);
    expect(onLetters.mock.calls[1][0].map((e: { char: string }) => e.char)).toEqual(["c", "d"]);
  });
});

describe("(2) Die Chargen-Grenze im Klassenmatch", () => {
  /** Jede Charge ist „ab", „cd" (siehe den Mock oben) - reihum, über jede Grenze. */
  const [z1, z2, z3, z4, z5] = ["ab", "cd", "ab", "cd", "ab"];

  function beobachteFeld(container: HTMLElement, feld: HTMLElement) {
    const stand = { weg: false };
    const beobachter = new MutationObserver((liste) => {
      for (const m of liste)
        for (const n of Array.from(m.removedNodes))
          if (n === feld || (n as Element).contains?.(feld)) stand.weg = true;
    });
    beobachter.observe(container, { childList: true, subtree: true });
    return { stand, stopp: () => beobachter.disconnect() };
  }

  it("★★★ wechselt die Charge ohne Abschluss-Karte und ohne Belohnungsklang (mit Absetzen)", async () => {
    const onTask = vi.fn();
    const { container } = lauf(onTask);
    const feld = (await screen.findByRole("textbox")) as HTMLTextAreaElement;
    // ⚠️ Erst die Effekte des Einhängens abwarten: `findByRole` meldet das Feld,
    // sobald es im Baum steht - sein Rücksetzen auf die erste Zeile läuft danach
    // und verwarf sonst die ersten Test-Anschläge (gemessen, 11.09.2026).
    await warte(50);
    // Verschwindet das Tippfeld auch nur einen Takt lang, geht der Fokus mit -
    // und jeder Anschlag in dieser Zeit ins Leere.
    const b = beobachteFeld(container, feld);

    // Zwischen den Zeilen wird hier abgewartet - die Pause allein kann also
    // nichts verschlucken. Was rot wird, liegt an der Grenze selbst.
    for (const z of [z1, z2, z3, z4]) {
      tippe(feld, z);
      await warte(600);
    }
    b.stopp();

    expect(b.stand.weg, "das Tippfeld fiel an der Chargen-Grenze aus dem Baum").toBe(false);
    expect(playStarReward, "an der Chargen-Grenze spielte der Belohnungsklang").not.toHaveBeenCalled();
    expect(onTask).toHaveBeenCalledTimes(4);
    expect(document.body.contains(feld)).toBe(true);
    // ★ Und die Session springt nicht auf die erste Zeile zurück: Es geht mit
    // der fünften weiter, und der Vorrat ist gewachsen.
    expect(feld.value.slice(8)).toBe(z5);
    expect(screen.getByText(/Zeile 5 von \d+/)).toBeTruthy();
  });

  it("★★★ schreibt über die Grenze weiter - ohne abzusetzen, ohne Verlust", async () => {
    const onTask = vi.fn();
    const { container } = lauf(onTask);
    const feld = (await screen.findByRole("textbox")) as HTMLTextAreaElement;
    // ⚠️ Erst die Effekte des Einhängens abwarten: `findByRole` meldet das Feld,
    // sobald es im Baum steht - sein Rücksetzen auf die erste Zeile läuft danach
    // und verwarf sonst die ersten Test-Anschläge (gemessen, 11.09.2026).
    await warte(50);
    const b = beobachteFeld(container, feld);

    tippe(feld, z1 + z2 + z3[0]);
    /*
      ⚠️ `waitFor` statt fester Wartezeit: Unter `act` rendert React erst am
      ENDE einer Wartezeit - in einer festen Pause schafft die Session also nur
      EINEN Zeilenwechsel, hier folgen aber zwei aufeinander (z2 wird
      nachgespielt, beendet seine Zeile, und das erste Zeichen von z3 wandert
      eine Zeile weiter). Gemessen am 11.09.2026 in Schritten zu 100 ms: nichts
      geht verloren, es dauert im Test nur länger als 600 ms.
    */
    await waitFor(() => expect(onTask).toHaveBeenCalledTimes(2), { timeout: 3000 });
    await waitFor(() => expect(feld.value.slice(8)).toBe(z3), { timeout: 3000 });
    await waitFor(() => expect(screen.getByText(/Zeile 3 von \d+/)).toBeTruthy(), { timeout: 3000 });
    // Das erste Zeichen von z3 kam über ZWEI Zeilengrenzen mit.
    await waitFor(() => expect(feld.selectionStart).toBe(8 + 1), { timeout: 3000 });
    tippe(feld, z3[1] + z4);
    await waitFor(() => expect(onTask).toHaveBeenCalledTimes(4), { timeout: 3000 });
    await waitFor(() => expect(feld.value.slice(8)).toBe(z5), { timeout: 3000 });
    b.stopp();

    expect(b.stand.weg, "das Tippfeld fiel an der Chargen-Grenze aus dem Baum").toBe(false);
    expect(playStarReward).not.toHaveBeenCalled();
    expect(onTask, "nicht alle vier Zeilen wurden fertig").toHaveBeenCalledTimes(4);
    expect(onTask.mock.calls.map((c) => c[0].errors)).toEqual([0, 0, 0, 0]);
    expect(feld.value.slice(8)).toBe(z5);
    expect(screen.getByText(/Zeile 5 von \d+/)).toBeTruthy();
  });
});

/**
 * ★★★ ZWEI GLEICHE ZEILEN HINTEREINANDER (gefunden beim Nachstellen, 11.09.2026).
 *
 * `useTypingItem` setzte sich nur zurück, wenn sich der TEXT der Zeile
 * änderte. Folgt auf „ab" noch einmal „ab", blieb die Zeile als „fertig"
 * stehen - und jede weitere Taste verschwand ohne Ton, für den Rest der Runde.
 * `adaptiveRound` erzeugt das selten, aber es erzeugt es (gemessen: eine
 * Doppelzeile in 2520 Zeilen).
 */
describe("(3) Zwei gleiche Zeilen hintereinander", () => {
  it("★★★ frieren die Session nicht ein", async () => {
    const { feld, onItemDone } = session({ items: ["ab", "ab", "cd"] });
    tippe(feld, "ab");
    await warte(400);
    tippe(feld, "ab");
    await warte(400);
    expect(onItemDone, "die zweite, gleiche Zeile nahm keine Taste mehr an").toHaveBeenCalledTimes(2);
    expect(feld.value).toBe("cd");
  });
});

describe("(4) Mein Training", () => {
  /*
   * Gewartet wird mit `naechsteZeile` aus `_typing-probelauf`. Bis zum
   * 11.09.2026 stand hier eine eigene Kopie: Die Hilfe suchte das Tippfeld
   * als `<input>`, seit dem 10.09.2026 ist es ein `<textarea>`, und sie
   * meldete darum sofort „Runde vorbei". Gefunden, weil dieser Test am alten
   * Stand aus DIESEM Grund rot war statt aus dem richtigen. Die Hilfe ist
   * repariert und scheitert jetzt laut, statt „vorbei" zu melden - zwei
   * Fassungen derselben Warteschleife sollen nicht nebeneinander stehen.
   */
  it("★★★ jeder Anschlag am Zeilenende bekommt eine Antwort - Klick oder Fehlerton", async () => {
    einrichtungFertigMerken();
    ohneBildschirmTastatur();
    render(
      <MemoryRouter>
        <TippenTrainerPage />
      </MemoryRouter>,
    );
    const feld = (await screen.findByRole("textbox", undefined, { timeout: 10_000 })) as HTMLTextAreaElement;
    const marke = zeilenMarke();
    const zeile = feld.value;
    expect(zeile.length).toBeGreaterThan(0);
    vi.mocked(playKeyTick).mockClear();
    vi.mocked(playErrorSound).mockClear();

    for (const ch of zeile) fireEvent.keyDown(feld, { key: ch });
    // Ohne abzusetzen weiter - die nächste Zeile steht noch gar nicht da.
    fireEvent.keyDown(feld, { key: "f" });
    expect(await naechsteZeile(marke), "die Runde ging nicht weiter").toBe(true);
    await warte(100);

    // Ein richtiger Anschlag klickt, ein falscher gibt den Fehlerton - und
    // einer, der keins von beiden bekommt, ist verloren.
    const klicks = vi.mocked(playKeyTick).mock.calls.length;
    const fehler = vi.mocked(playErrorSound).mock.calls.length;
    expect(
      klicks + fehler,
      `ein Anschlag am Zeilenende blieb ohne Antwort (Zeile ${zeile.length} Zeichen, ${klicks} Klicks, ${fehler} Fehlertöne)`,
    ).toBe(zeile.length + 1);
  }, 30_000);
});

describe("(5) Tippchallenge - eine Wertung", () => {
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
  function probeStand(gibAb: SchreibprobeStand["gibAb"]): SchreibprobeStand {
    return {
      plan: plan(),
      phase: "laeuft",
      stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
      geladen: true,
      einstiegBis: Date.now() + 9 * 60_000,
      beginne: vi.fn(),
      melde: vi.fn(),
      schliesseErgebnis: vi.fn(),
      gibAb,
      fortschritt: LEERER_FORTSCHRITT,
      merkeFortschritt: vi.fn(),
    };
  }
  async function challenge() {
    const texte = await ladeTexte("start");
    const [z0, z1] = texte[0].zeilen;
    const gibAb = vi.fn(async (_e: Probenergebnis) => {});
    const { container } = render(
      <SchreibprobeLauf probe={probeStand(gibAb)} account={KIND} stufe="kids" onTask={vi.fn()} />,
    );
    await waitFor(() => expect(screen.getByText(/Zeile 1 von \d+/)).toBeTruthy(), {
      timeout: 4000,
    });
    const feld = () => container.querySelector<HTMLTextAreaElement>('[data-feld="tippen"]')!;
    expect(feld().value.endsWith(z0)).toBe(true);
    return { z0, z1, gibAb, feld };
  }

  it("★★★ der Anschlag aus der Zeilenpause zählt - in Zeichen, Fehlern, Zeilen und ohne Wartezeit", async () => {
    const { z0, z1, gibAb, feld } = await challenge();
    tippe(feld(), z0 + z1[0]);
    await waitFor(() => expect(screen.getByText(/Zeile 2 von \d+/)).toBeTruthy(), { timeout: 3000 });
    await warte(50);
    tippe(feld(), z1.slice(1));
    await waitFor(() => expect(screen.getByText(/Zeile 3 von \d+/)).toBeTruthy(), { timeout: 3000 });

    fireEvent.click(screen.getByRole("button", { name: /Fertig - abgeben/ }));
    await waitFor(() => expect(gibAb).toHaveBeenCalledTimes(1), { timeout: 3000 });
    const e = gibAb.mock.calls[0][0];
    expect(e).toMatchObject({ zeichen: z0.length + z1.length, fehler: 0, zeilen: 2 });
    // Vorlesen ist aus: Es gibt nichts, worauf gewartet wurde - auch das
    // Nachspielen darf keine Wartezeit erfinden, sonst liefe die Prüfungsuhr falsch.
    expect(e.wartezeitMs).toBe(0);
    expect(e.schreibMs).toBeGreaterThanOrEqual(0);
  });

  it("★★ wer in der Zeilenpause abgibt, bekommt die fertige Zeile nicht doppelt gezählt", async () => {
    const { z0, gibAb, feld } = await challenge();
    tippe(feld(), z0);
    // Sofort abgeben - die Pause läuft noch.
    fireEvent.click(screen.getByRole("button", { name: /Fertig - abgeben/ }));
    await waitFor(() => expect(gibAb).toHaveBeenCalledTimes(1), { timeout: 3000 });
    const e = gibAb.mock.calls[0][0];
    expect(e.zeichen, `die fertige Zeile (${z0.length} Zeichen) zählte doppelt`).toBe(z0.length);
    expect(e.fehler).toBe(0);
    expect(e.zeilen).toBe(1);
  });
});

/**
 * ★★★ DIE UHR IM VORSPANN HOLT KEINEN FOKUS (Befund der Klassenmatch-Agentin,
 * 11.09.2026). Der Vorspann ändert sich im Match und in der Challenge jede
 * Sekunde; bis dahin zog jede Änderung den Fokus zurück ins Tippfeld. Wer mit
 * Tab „Verlassen" erreichte, stand nach etwa einer Sekunde wieder im Feld.
 */
describe("(6) Die Uhr im Vorspann holt keinen Fokus", () => {
  const grund = {
    items: ["ab", "cd"],
    contextId: "test",
    unlocked: new Set(["a", "b", "c", "d"]),
    shiftLearned: false,
    stufe: "kids" as const,
    voiceEnabled: false,
    onRetry: vi.fn(),
    zeilenPauseMs: 220,
    topSlot: <button type="button">Verlassen</button>,
  };

  it("★★★ ein Knopf ausserhalb des Feldes behält den Fokus, während die Uhr läuft", () => {
    const { rerender } = render(<TypingSession {...grund} zeilenPraefix="P1 4:00 " />);
    const feld = screen.getByRole("textbox") as HTMLTextAreaElement;
    tippe(feld, "a");
    const knopf = screen.getByRole("button", { name: "Verlassen" });
    knopf.focus();
    expect(document.activeElement).toBe(knopf);

    rerender(<TypingSession {...grund} zeilenPraefix="P1 3:59 " />);
    rerender(<TypingSession {...grund} zeilenPraefix="P1 3:58 " />);

    expect(document.activeElement, "die Uhr zog den Fokus zurück in die Eingabezeile").toBe(knopf);
    // Der Schreibzeiger steht trotzdem richtig: hinter dem Vorspann, am „b".
    expect(feld.value).toBe("P1 3:58 ab");
    expect(feld.selectionStart).toBe(8 + 1);
  });

  it("★ bei einer NEUEN ZEILE holt die Session den Fokus wie bisher", async () => {
    render(<TypingSession {...grund} zeilenPraefix="P1 4:00 " />);
    const feld = screen.getByRole("textbox") as HTMLTextAreaElement;
    const knopf = screen.getByRole("button", { name: "Verlassen" });
    knopf.focus();
    tippe(feld, "ab");
    await warte(400);
    expect(feld.value).toBe("P1 4:00 cd");
    expect(document.activeElement).toBe(feld);
  });

  it("★★ im Klassenmatch: „Verlassen“ behält den Fokus über mehrere Uhrtakte", async () => {
    lauf(vi.fn());
    const feld = (await screen.findByRole("textbox")) as HTMLTextAreaElement;
    await warte(50);
    const knopf = screen.getAllByRole("button", { name: /Verlassen/i })[0];
    knopf.focus();
    const uhrVorher = feld.value.slice(0, 8);
    await warte(1600);
    expect(feld.value.slice(0, 8), "die Uhr lief gar nicht - der Test beweist so nichts").not.toBe(uhrVorher);
    expect(document.activeElement, "die Uhr zog den Fokus zurück in die Eingabezeile").toBe(knopf);
  });
});
