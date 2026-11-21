/**
 * ★★★★★ EIN MATCH SCHALTET KEINE TASTE FREI - ES MERKT SIE NUR VOR
 * (02.10.2026, Johannes).
 *
 * Befund (am Live-Server gemessen, Klasse CSS6): Arda kannte f j d k s l a ö e
 * n i. Am Ende eines Klassenmatchs wurde ihr das R freigeschaltet - ohne
 * Vorstellung. Danach ging sie in die Spiele (Pinguinspiel, Polarstation,
 * Höhle), die nehmen `introduced`, und bekam ein R abgefragt, das sie nie
 * kennengelernt hatte.
 *
 * Johannes: *„ein match darf eine neue taste für nach dem match freischalten
 * aber nie während dem match! nach dem abschluss, wenn es wieder in mein
 * training geht kommt die meldung der neuen taste!"*
 *
 * Geprüft wird die Fehlerklasse an jedem Glied der Kette:
 *  (A) die Regel: Match merkt vor, schreibt `introduced` NIE;
 *  (B) das Match selbst (Bauteil): speichert die Vormerkung, nicht die Taste -
 *      DAS ist der nachgestellte Fehler (vor der Änderung rot);
 *  (C) niemand ausser den zwei Einlöse-Stellen liest das Merkfeld - ein Spiel
 *      kann die Taste also gar nicht sehen;
 *  (D) „Mein Training": Einstieg stellt die Taste vor, genau einmal, mit
 *      `introducedAt`, danach ist das Merkfeld weg; nicht im Regal Wortspiele.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn(), speak: vi.fn() };
});
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
import { KlassenmatchLauf } from "@/components/typing/KlassenmatchLauf";
import type { Match, MatchStand } from "@/lib/typing/klassenmatch";
import { emptyProgress, loadProgress, type LetterStat, type TypingProgress } from "@/lib/typing/progress";
import {
  ensureIntroduced,
  introOrder,
  nextLetter,
} from "@/lib/typing/letters";
import { loeseVormerkungEin, merkeMatchRundenende } from "@/lib/typing/tastenfreischaltung";
import { allowedFromIntroduced } from "@/lib/typing";
import { useTypingA11y } from "@/lib/typing/a11y";
import { useVoice } from "@/lib/typing/voice";
import type { TypingAccount } from "@/lib/typing/account";
import { ohneBildschirmTastatur } from "./_typing-probelauf";

// ── Werkzeug ─────────────────────────────────────────────────────────────────

function sitzt(): LetterStat {
  return { hits: 40, misses: 0, sumMs: 40 * 300, timed: 40, recent: Array(20).fill(300) };
}

/** Ein Stand mit den ersten `n` Einheiten, alle sitzend - die nächste Taste ist fällig. */
function standMit(n: number, extra: Partial<TypingProgress> = {}): TypingProgress {
  const introduced = introOrder("de").slice(0, n);
  const letters: Record<string, LetterStat> = {};
  for (const u of introduced) letters[u] = sitzt();
  return { ...emptyProgress(), introduced, letters, ...extra };
}

/** Ein Stand, bei dem die Taste noch NICHT fällig ist (keine Anschläge gemessen). */
function standOhneKoennen(n: number): TypingProgress {
  return { ...emptyProgress(), introduced: introOrder("de").slice(0, n) };
}

const KIND: TypingAccount = {
  id: "arda",
  role: "schueler",
  name: "Arda",
  classCode: "CSS6",
  createdAt: 1,
};

function match(over: Partial<Match> = {}): Match {
  const start = Date.now();
  return {
    id: "m1",
    classCode: "CSS6",
    hostUid: "sarah",
    hostName: "Sarah",
    status: "laeuft",
    startMs: start,
    endeMs: start + 3500, // Luft für eine belastete Maschine: die zwei Anschläge müssen VOR dem Ende fallen
    dauerMin: 5,
    createdMs: start - 20_000,
    ...over,
  };
}

function stand(over: Partial<MatchStand> = {}): MatchStand {
  return {
    id: "s",
    matchId: "m1",
    classCode: "CSS6",
    pupilUid: "mia",
    name: "Mia",
    status: "schreibt",
    zeichen: 1,
    fehler: 0,
    apm: 1,
    wert: 0,
    updatedMs: Date.now(),
    ...over,
  };
}

beforeEach(() => {
  localStorage.clear();
  Element.prototype.scrollIntoView = () => {};
  ohneBildschirmTastatur();
  useTypingA11y.getState().setTastenAnsage("aus");
  useVoice.getState().setEnabled(false);
});
afterEach(cleanup);

// ── (A) Die Regel ────────────────────────────────────────────────────────────

describe("(A) merkeMatchRundenende - entscheidet, schreibt aber nie `introduced`", () => {
  it("★★★★★ merkt die fällige Taste vor und liefert KEIN introduced/introducedAt", () => {
    const p = standMit(8);
    const erg = merkeMatchRundenende(p, undefined as never, 1, 1_000, "de");
    // Die Rückgabe KANN `introduced` gar nicht enthalten.
    expect(Object.keys(erg).sort()).toEqual(["freischaltungAusMatch", "rundenOhneTaste"]);
    expect(erg.freischaltungAusMatch).toEqual({ einheiten: [nextLetter(p.introduced!, "de")], ts: 1_000 });
  });

  it("zählt die Runde wie bisher, wenn nichts fällig ist", () => {
    const p = { ...standOhneKoennen(8), rundenOhneTaste: 2 };
    const erg = merkeMatchRundenende(p, undefined as never, 0.5, 1_000, "de");
    expect(erg.freischaltungAusMatch).toBeUndefined();
    expect(erg.rundenOhneTaste).toBe(2.5);
  });

  it("lässt den Geduld-Zähler bei einer Vormerkung unverändert", () => {
    const erg = merkeMatchRundenende(standMit(8, { rundenOhneTaste: 20 }), undefined as never, 1, 1_000, "de");
    expect(erg.freischaltungAusMatch).toBeDefined();
    expect(erg.rundenOhneTaste).toBe(20);
  });

  it("merkt KEINE zweite Taste vor, solange die erste wartet (zweites Match vor dem Training)", () => {
    const schon = { einheiten: ["d"], ts: 5 };
    const erg = merkeMatchRundenende(
      standMit(8, { freischaltungAusMatch: schon }),
      undefined as never,
      1,
      9_000,
      "de",
    );
    expect(erg.freischaltungAusMatch).toBe(schon);
  });
});

describe("(A2) loeseVormerkungEin - der gewöhnliche Freischalt-Weg, einmalig", () => {
  it("★★★ schaltet frei, stempelt `introducedAt`, setzt den Zähler 0 und löscht das Merkfeld", () => {
    const naechste = introOrder("de")[8];
    const p = standMit(8, { rundenOhneTaste: 7, freischaltungAusMatch: { einheiten: [naechste], ts: 5 } });
    const erg = loeseVormerkungEin(p, 77_000, "de");
    expect(erg.neu).toEqual([naechste]);
    expect(erg.progress.introduced).toEqual(introOrder("de").slice(0, 9));
    expect(erg.progress.introducedAt?.[naechste]).toBe(77_000);
    expect(erg.progress.rundenOhneTaste).toBe(0);
    expect(erg.progress.freischaltungAusMatch).toBeUndefined();
    expect("freischaltungAusMatch" in erg.progress).toBe(false);
    // Einmalig: ein zweiter Einstieg mit dem Ergebnis tut nichts mehr.
    const nochmal = loeseVormerkungEin(erg.progress, 99_000, "de");
    expect(nochmal.neu).toEqual([]);
    expect(nochmal.geaendert).toBe(false);
    expect(nochmal.progress).toBe(erg.progress);
  });

  it("verwirft still, wenn das Kind inzwischen auf anderem Weg weiter ist", () => {
    const naechste = introOrder("de")[8];
    // Startpunkt der Lehrkraft hat die Taste schon gebracht.
    const p = standMit(9, { freischaltungAusMatch: { einheiten: [naechste], ts: 5 } });
    const erg = loeseVormerkungEin(p, 77_000, "de");
    expect(erg.neu).toEqual([]);
    expect(erg.geaendert).toBe(true);
    expect(erg.progress.introduced).toEqual(p.introduced);
    expect(erg.progress.introducedAt).toBeUndefined();
    expect(erg.progress.freischaltungAusMatch).toBeUndefined();
  });

  it("verwirft still, wenn die Taste nicht mehr die nächste des Weges ist", () => {
    const p = standMit(6, { freischaltungAusMatch: { einheiten: [introOrder("de")[8]], ts: 5 } });
    const erg = loeseVormerkungEin(p, 77_000, "de");
    expect(erg.neu).toEqual([]);
    expect(erg.progress.introduced).toEqual(p.introduced);
    expect(erg.progress.freischaltungAusMatch).toBeUndefined();
  });

  it("ohne Vormerkung bleibt alles, wie es ist (dieselbe Referenz)", () => {
    const p = standMit(8);
    const erg = loeseVormerkungEin(p, 1, "de");
    expect(erg.geaendert).toBe(false);
    expect(erg.progress).toBe(p);
  });
});

// ── (B) Das Match selbst - der nachgestellte Fehler ──────────────────────────

describe("(B) Das Klassenmatch (Bauteil)", { timeout: 20_000 }, () => {
  async function spieleMatch(geladen: TypingProgress) {
    const saveFn = vi.fn();
    const onFertig = vi.fn();
    const { container } = render(
      <KlassenmatchLauf
        match={match()}
        staende={[stand()]}
        account={KIND}
        stufe="kids"
        lang="de"
        loadFn={async () => geladen}
        saveFn={saveFn}
        onTask={vi.fn()}
        onStand={vi.fn()}
        onFertig={onFertig}
        onWeiter={vi.fn()}
        onVerlassen={vi.fn()}
      />,
    );
    const feld = await screen.findByRole("textbox");
    const praxis = (feld as HTMLTextAreaElement).value.slice(8);
    const zeichen = Array.from(praxis)
      .filter((z) => z !== " ")
      .slice(0, 2);
    for (const taste of zeichen) fireEvent.keyDown(feld, { key: taste });
    await screen.findByRole("heading", { name: /Klassenmatch ist vorbei/i }, { timeout: 10_000 });
    await waitFor(() => expect(saveFn).toHaveBeenCalled());
    return { saveFn, container, onFertig };
  }

  it("★★★★★ NACHGESTELLT (Arda, CSS6): das Match-Ende setzt `introduced` NICHT, es merkt die Taste vor", async () => {
    const geladen = standMit(2);
    const naechste = nextLetter(geladen.introduced!, "de")!;
    const { saveFn } = await spieleMatch(geladen);
    const gespeichert = saveFn.mock.calls.at(-1)![0] as TypingProgress;
    // Der Fehler: hier stand die Taste sofort in `introduced` (und `introducedAt`).
    expect(gespeichert.introduced).toEqual(geladen.introduced);
    expect(gespeichert.introducedAt).toBeUndefined();
    // Stattdessen: die Vormerkung - und die Anschläge sind im Lernstand.
    expect(gespeichert.freischaltungAusMatch?.einheiten).toEqual([naechste]);
    expect(Object.keys(gespeichert.letters ?? {}).length).toBeGreaterThanOrEqual(2);
  });

  it("★★ sagt am Ende, dass eine Taste im Training wartet - als gewöhnlicher Absatz, nicht als Live-Meldung", async () => {
    const { container } = await spieleMatch(standMit(2));
    const satz = await screen.findByText("Eine neue Taste wartet in deinem Training.");
    expect(satz.closest("[aria-live], [role=status], [role=alert]")).toBeNull();
    // Nicht im Live-Bereich des Matchs.
    expect(container.querySelector("[data-match-live]")?.textContent ?? "").toBe("");
  });

  it("sagt nichts von einer Taste, wenn keine fällig war", async () => {
    // Bei zwei Tasten ohne jede Messung ist keine fällig (die zuletzt
    // dazugekommene Taste muss erst sitzen).
    const geladen = { ...standOhneKoennen(2), rundenOhneTaste: 0 };
    const { saveFn } = await spieleMatch(geladen);
    const gespeichert = saveFn.mock.calls.at(-1)![0] as TypingProgress;
    expect(gespeichert.freischaltungAusMatch).toBeUndefined();
    expect(gespeichert.introduced).toEqual(geladen.introduced);
    expect(screen.queryByText("Eine neue Taste wartet in deinem Training.")).toBeNull();
  });
});

// ── (C) Wer das Merkfeld liest ───────────────────────────────────────────────

describe("(C) Kein Spiel, kein Wortspiel, kein Match-Text kann die vorgemerkte Taste sehen", () => {
  it("★★★ solange sie wartet, steht sie in keiner Liste, aus der Spiele ziehen", () => {
    const naechste = introOrder("de")[8];
    const p = standMit(8, { freischaltungAusMatch: { einheiten: [naechste], ts: 5 } });
    expect(ensureIntroduced(p.introduced, "de")).not.toContain(naechste);
    expect(allowedFromIntroduced(p.introduced, "de").has(naechste)).toBe(false);
  });

  it("★★★ im ganzen Quelltext lesen nur das Match (schreibt), die Einlöse-Regel, der Trainer und die Serie das Feld", () => {
    const wurzel = resolve(__dirname, "..", "src");
    const treffer: string[] = [];
    const gehe = (ordner: string) => {
      for (const name of readdirSync(ordner)) {
        const pfad = join(ordner, name);
        if (statSync(pfad).isDirectory()) gehe(pfad);
        else if (/\.(ts|tsx)$/.test(name) && readFileSync(pfad, "utf8").includes("freischaltungAusMatch"))
          treffer.push(pfad.slice(wurzel.length + 1));
      }
    };
    gehe(wurzel);
    expect(treffer.sort()).toEqual([
      "components/typing/AdaptiveTrainer.tsx",
      "components/typing/KlassenmatchErgebnis.tsx", // nur ein Kommentar - das Bauteil bekommt `neueTasteWartet`
      "components/typing/KlassenmatchLauf.tsx",
      "components/typing/SerienTrainer.tsx",
      "lib/typing/progress.ts",
      "lib/typing/tastenfreischaltung.ts",
    ]);
  });

  it("das Merkfeld übersteht das Neuladen eines anonymen Standes (Whitelist-Falle)", () => {
    const vm = { einheiten: ["d"], ts: 5 };
    localStorage.setItem("typing-progress-v1", JSON.stringify({ ...emptyProgress(), freischaltungAusMatch: vm }));
    // Der Schlüssel steht in progress.ts; stimmt er nicht, bleibt der Test ehrlich rot.
    const roh = readFileSync(resolve(__dirname, "../src/lib/typing/progress.ts"), "utf8");
    const schluessel = /STORAGE_KEY\s*=\s*"([^"]+)"/.exec(roh)?.[1];
    expect(schluessel).toBeTruthy();
    localStorage.clear();
    localStorage.setItem(schluessel!, JSON.stringify({ ...emptyProgress(), freischaltungAusMatch: vm }));
    expect(loadProgress().freischaltungAusMatch).toEqual(vm);
  });
});

// ── (D) „Mein Training": die Vorstellung ─────────────────────────────────────

describe("(D) Einstieg in „Mein Training“", () => {
  function bau(geladen: TypingProgress, saveFn: (p: TypingProgress) => void, extra = {}) {
    return render(
      <AdaptiveTrainer
        loadFn={() => Promise.resolve(geladen)}
        saveFn={saveFn}
        onTask={() => undefined}
        stufe="kids"
        lang="de"
        {...extra}
      />,
    );
  }

  it("★★★★★ stellt die vorgemerkte Taste vor - Feier, introduced, introducedAt, Merkfeld weg - genau einmal", async () => {
    const naechste = introOrder("de")[8];
    const geladen = standMit(8, { freischaltungAusMatch: { einheiten: [naechste], ts: 5 } });
    const gespeichert: TypingProgress[] = [];
    const saveFn = (p: TypingProgress) => void gespeichert.push(p);
    bau(geladen, saveFn);

    // Die gewöhnliche Feier-Karte der neuen Taste.
    const feier = await screen.findByRole("dialog");
    expect(feier.getAttribute("aria-label") ?? "").toMatch(new RegExp(naechste, "i"));

    expect(gespeichert.length).toBeGreaterThanOrEqual(1);
    const p = gespeichert[0];
    expect(p.introduced).toEqual(introOrder("de").slice(0, 9));
    expect(typeof p.introducedAt?.[naechste]).toBe("number");
    expect("freischaltungAusMatch" in p).toBe(false);
    expect(p.rundenOhneTaste).toBe(0);

    // Zweiter Einstieg mit dem gespeicherten Stand: keine zweite Feier.
    cleanup();
    const zweite: TypingProgress[] = [];
    bau(p, (q) => void zweite.push(q));
    await screen.findByRole("textbox");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(zweite.filter((q) => q.introduced!.length !== p.introduced!.length)).toEqual([]);
  });

  it("verwirft eine nicht mehr passende Vormerkung still - keine Feier, kein Sprung", async () => {
    const geladen = standMit(9, { freischaltungAusMatch: { einheiten: [introOrder("de")[8]], ts: 5 } });
    const gespeichert: TypingProgress[] = [];
    bau(geladen, (p) => void gespeichert.push(p));
    await screen.findByRole("textbox");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(gespeichert[0].introduced).toEqual(geladen.introduced);
    expect("freischaltungAusMatch" in gespeichert[0]).toBe(false);
  });

  it("★★★ im Regal „Wortspiele“ (startForm) bleibt die Taste vorgemerkt - dort wird nichts vorgestellt", async () => {
    const geladen = standMit(8, { freischaltungAusMatch: { einheiten: [introOrder("de")[8]], ts: 5 } });
    const saveFn = vi.fn();
    bau(geladen, saveFn, { startForm: "buchstabensalat", onFormEnde: () => undefined });
    await waitFor(() => expect(document.querySelector("textarea, input, [role=textbox]")).toBeTruthy());
    expect(screen.queryByRole("dialog")).toBeNull();
    for (const [p] of saveFn.mock.calls as [TypingProgress][]) {
      expect(p.introduced).toEqual(geladen.introduced);
    }
  });
});
