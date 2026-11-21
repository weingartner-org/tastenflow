/**
 * ★★★ DEUTSCH-FÄNGER FÜR DIE ÜBUNGSSEITE (EN1, 19.09.2026).
 *
 * Bereich: alles, was beim normalen Üben auf der Seite erscheint und nach dem
 * Probestück (`tastenflow-englische-bedienung.test.tsx`) noch deutsch war -
 * der Wochenziel-Ring samt Nachholen, Alt + D / Alt + L / Alt + Z, das
 * Wochenziel-Fenster, Alt + B in die Bücherei, die Bücherei selbst und ihr
 * Leser, das Geschichten-Angebot, die Bildschirm-Tastatur mit Legende, „Tasten
 * erkunden" und „Tasten finden", der Hinweis „Groß ohne Umschalt" und die zwei
 * Erklär-Fenster, die eigene Übung (Ankündigung und Lauf), die Freischalt-Feier
 * mit Spiel-Angebot und die Anleitung für die englische Stimme.
 *
 * Gemessen wird am gerenderten DOM (`tests/helfer/deutschFaenger.ts`, der
 * ganze `<body>` - Fenster hängen als Portal dort) und an allem, was die
 * ersetzte Stimme sagen sollte. INHALT (Übungszeilen, Titel von Geschichten,
 * Quellenangaben) steht in `lang="de"` und ist damit ausgenommen - genau das
 * prüft der Fänger mit: Fehlt das Attribut, schlägt er an.
 *
 * ★★ Die STIMME: In der englischen Bedienung muss jede Ansage der Bedienung
 * mit der englischen Stimme hinausgehen (`speakUi(…, "en")`). Gezählt wird
 * alles ausser Aufrufen mit deutscher Stimme (die liest deutschen Inhalt).
 *
 * ★★★ DIE GEGENPROBE: dieselben Zustände in der DEUTSCHEN Bedienung müssen
 * Funde liefern - ein Fänger, der nichts liest, wäre sonst genauso grün.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn(), speak: vi.fn() };
});

import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { TastenflowSprachBereich } from "../src/features/public/TastenflowSprachBereich";
import { BedienSpracheProvider, type AktiveBedienSprache } from "../src/lib/bedienSprache";
import { AnnounceProvider } from "../src/lib/a11y";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { SerienTrainer } from "../src/components/typing/SerienTrainer";
import { StoryOffer } from "../src/components/typing/StoryOffer";
import { KeyboardPanel } from "../src/components/typing/KeyboardPanel";
import { TastenErkunden } from "../src/components/typing/TastenErkunden";
import { AutoCapHint } from "../src/components/typing/TypingSession";
import { Merkfenster } from "../src/components/typing/Merkfenster";
import { EigeneUebungAnkuendigung } from "../src/components/typing/EigeneUebungAnkuendigung";
import { EigeneUebungLauf } from "../src/components/typing/EigeneUebungLauf";
import { UnlockCelebration } from "../src/components/typing/UnlockCelebration";
import { VoiceInstallHelp } from "../src/components/typing/VoiceInstallHelp";
import { belohnungsAngebot } from "../src/components/typing/AdaptiveTrainer";
import { grossschreibungFenster, umschaltFenster } from "../src/lib/typing/merkfensterTexte";
import {
  SHIFT_UNIT,
  addPupil,
  createClass,
  emptyProgress,
  recordEvent,
  registerTeacher,
  serieBySlug,
  speak,
  speakUi,
  speakUiAlways,
  useVoice,
  type TaskEvent,
  type TypingAccount,
  type TypingProgress,
} from "../src/lib/typing";
import type { EigeneUebungStand } from "../src/lib/typing/useEigeneUebung";
import { isoWeekKey } from "../src/lib/typing/goals";
import { WOCHENZIEL_GRENZE } from "../src/lib/typing/wochenziel";
import { wochenStart } from "../src/lib/typing/wochenrhythmus";
import { useContrast } from "../src/lib/contrast";
import { useTypingA11y } from "../src/lib/typing/a11y";
import { activeLayout } from "../src/lib/typing/layouts";
import { tasteFuerCode } from "../src/lib/typing/anschlagDeuten";
import { ohneBildschirmTastatur, tippfeldPflicht } from "./_typing-probelauf";
import { findeDeutsch, pruefeText } from "./helfer/deutschFaenger";

// ---------------------------------------------------------------------------
// Aufbau
// ---------------------------------------------------------------------------

/** Bedienung gewählt - so, wie der Sprachschalter oder `?bedienung=…` es tut. */
function stelleBedienung(sprache: AktiveBedienSprache) {
  localStorage.setItem("tastenflow-bedienung", sprache);
}

/** Die ganze Seite unter ihrer echten Adresse, mit dem Sprach-Anbieter aus `Root`. */
function zeigeSeite(account: TypingAccount | null) {
  useTypingAuth.setState({ account });
  render(
    <AnnounceProvider>
      <MemoryRouter initialEntries={["/programme/tastenflow"]}>
        <TastenflowSprachBereich>
          <TippenTrainerPage />
        </TastenflowSprachBereich>
      </MemoryRouter>
    </AnnounceProvider>,
  );
}

/** Ein Bauteil allein, mit dem Sprach-Anbieter (liest die Probe beim Einhängen). */
function zeige(knoten: ReactNode) {
  return render(
    <AnnounceProvider>
      <BedienSpracheProvider>{knoten}</BedienSpracheProvider>
    </AnnounceProvider>,
  );
}

/** Alles Gesprochene: `[text, sprache der Stimme]`. */
function gesprochen(): [string, string | undefined][] {
  return [
    ...vi.mocked(speakUi).mock.calls.map((c) => [String(c[0]), c[3] as string | undefined]),
    ...vi.mocked(speakUiAlways).mock.calls.map((c) => [String(c[0]), c[2] as string | undefined]),
    ...vi.mocked(speak).mock.calls.map((c) => [String(c[0]), "vorlese"]),
  ] as [string, string | undefined][];
}

/**
 * ★ Einzelne Tastenzeichen der DEUTSCHEN Tastatur (ä, ö, ü, ß) sind kein
 * deutsches Wort (wie in EN3/EN5).
 */
function nurTastenzeichen(fund: string): boolean {
  const woerter = fund.match(/\[([^\]]*)\]$/)?.[1]?.split(", ") ?? [];
  return woerter.length > 0 && woerter.every((w) => [...w].length === 1);
}

/** Inhalte, die gesprochen werden dürfen, wie sie sind (Titel von Geschichten). */
let inhalte: string[] = [];

/** Was der Fänger jetzt findet - DOM und Stimme (ausser der deutschen Stimme). */
function fange(): string[] {
  const funde = new Set(findeDeutsch(document.body));
  for (const [text, stimme] of gesprochen()) {
    if (stimme === "de") continue;
    if (inhalte.some((i) => text.startsWith(i))) continue;
    const f = pruefeText(`gesprochen (${stimme ?? "ohne Sprache"})`, text);
    if (f) funde.add(f);
  }
  return [...funde].filter((f) => !nurTastenzeichen(f));
}

/** Ansagen, die in der ENGLISCHEN Bedienung NICHT mit der englischen Stimme gingen. */
function ohneEnglischeStimme(): string[] {
  return gesprochen()
    .filter(([text, stimme]) => stimme !== "en" && !inhalte.some((i) => text.startsWith(i)))
    .map(([text, stimme]) => `${stimme ?? "ohne"}: ${text}`);
}

const warte = (ms: number) => act(() => new Promise<void>((r) => window.setTimeout(r, ms)));

beforeEach(() => {
  localStorage.clear();
  document.documentElement.setAttribute("lang", "de");
  einrichtungFertigMerken();
  ohneBildschirmTastatur();
  useTypingAuth.setState({ account: null });
  useContrast.getState().setMode("hell");
  useVoice.getState().setEnabled(true);
  vi.mocked(speakUi).mockClear();
  vi.mocked(speakUiAlways).mockClear();
  vi.mocked(speak).mockClear();
  inhalte = [];
  Element.prototype.scrollIntoView = () => {};
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// ── Daten ───────────────────────────────────────────────────────────────────

const MIN = 60_000;
const TAG = 86_400_000;

/** Ein Kind einer echten (lokalen) Klasse mit einem Wochenziel ab der VORWOCHE. */
function kindMitWochenziel(minuten: number, nachholen: boolean): TypingAccount {
  const t = registerTeacher("L", `l${Math.random()}@s.at`, "geheim1");
  if (!t.ok) throw new Error("Lehrkraft");
  const cls = createClass(t.value.id, "3b");
  if (!cls.ok) throw new Error("Klasse");
  const p = addPupil(cls.value.code, "Mia", "1234", "b");
  if (!p.ok) throw new Error("Kind");
  const vorwoche = wochenStart(Date.now(), WOCHENZIEL_GRENZE) - 7 * TAG + TAG;
  return {
    ...p.value,
    wochenzielVerlauf: [{ ab: isoWeekKey(vorwoche), minuten }],
    goalCatchUp: nachholen,
  };
}

/** `minuten` Minuten reine Tippzeit in dieser Woche, in Ein-Minuten-Zeilen. */
function geuebt(id: string, minuten: number): void {
  const jetzt = Date.now();
  for (let i = 1; i <= minuten; i++) {
    const e: TaskEvent = { ts: jetzt - i * MIN, lesson: "adaptiv", chars: 40, errors: 0, ms: MIN, activeMs: MIN };
    recordEvent(id, e);
  }
}

const EINGEFUEHRT = [
  "f", "j", "d", "k", "s", "l", "a", "ö", "e", "n", "i", "r", "t", "h", "u", "g",
  SHIFT_UNIT, "ä", "ü", "ß", "o", "c", ",", "m", "w", "b", "p", "z", ".",
];

/** Ein Spielstand, mit dem die Bücherei Geschichten zeigt - eine davon angefangen. */
function leseFortschritt(): TypingProgress {
  return {
    ...emptyProgress(),
    xp: 400,
    introduced: EINGEFUEHRT,
    storyProgress: { "de-g2-khalai-spricht-mit-pflanzen": { etappe: 1, line: 3 } },
  };
}

// ---------------------------------------------------------------------------
// Die Zustände
// ---------------------------------------------------------------------------

type Zustand = {
  name: string;
  lauf: (sprache: AktiveBedienSprache) => Promise<string[]>;
  /** Wie viele Funde die deutsche Gegenprobe mindestens liefern muss. */
  mindestensDe: number;
  frist?: number;
};

const ZUSTAENDE: Zustand[] = [
  {
    name: "Kind · Wochenziel-Ring mit Nachholen, dann Alt + D, Alt + L, Alt + Z",
    mindestensDe: 5,
    frist: 60000,
    lauf: async (sprache) => {
      const kind = kindMitWochenziel(60, true);
      geuebt(kind.id, 20);
      zeigeSeite(kind);
      await waitFor(() => tippfeldPflicht());
      const ring = await waitFor(() => {
        const r = document.querySelector<HTMLElement>('[role="img"][aria-label*="60"]');
        expect(r).not.toBeNull();
        return r!;
      });
      expect(ring.getAttribute("aria-label")).toMatch(sprache === "en" ? /Your weekly goal/ : /Dein Wochenziel/);
      // Die Ansagen der Bedienung - und was davon auf die Braillezeile geht.
      fireEvent.keyDown(document, { code: "KeyD", altKey: true });
      fireEvent.keyDown(document, { code: "KeyL", altKey: true });
      // ★ 18.10.2026 (Kürzel einheitlich): Alt + Z gilt nach dem AUFDRUCK der
      // eingestellten Tastatur - bis dahin wirkte `KeyZ` immer (auch als Y der
      // QWERTZ-Tastatur). Gedrückt wird darum die Taste, auf der das Z steht.
      const zTaste = ["KeyZ", "KeyY", "KeyW"].find((c) => tasteFuerCode(activeLayout(), c)?.toLowerCase() === "z");
      fireEvent.keyDown(document, { code: zTaste, altKey: true });
      await warte(120);
      if (sprache === "en") {
        const saetze = gesprochen().filter(([, s]) => s === "en").map(([t]) => t);
        expect(saetze.some((t) => /^Practice time: .*Weekly goal: \d+ of 60 minutes/.test(t)), saetze.join("\n")).toBe(true);
        expect(saetze.some((t) => /to catch up/.test(t)), saetze.join("\n")).toBe(true);
        expect(saetze.some((t) => /^Level \d+$/.test(t)), saetze.join("\n")).toBe(true);
        // ★ 20.09.2026: Komma statt Punkt hinter der Zahl - ein Punkt macht sie
        // zur Ordnungszahl („2 von 12-te", Johannes nach Testerin Durchgang).
        expect(saetze.some((t) => /^Line \d+ of \d+,/.test(t)), saetze.join("\n")).toBe(true);
      }
      return fange();
    },
  },
  {
    name: "Kind · Wochenziel erreicht: das Fenster",
    mindestensDe: 4,
    frist: 60000,
    lauf: async (sprache) => {
      const kind = kindMitWochenziel(10, false);
      geuebt(kind.id, 12);
      zeigeSeite(kind);
      const fenster = await screen.findByRole("dialog", {}, { timeout: 8000 });
      expect(fenster.textContent).toMatch(sprache === "en" ? /Weekly goal reached/ : /Wochenziel geschafft/);
      return fange();
    },
  },
  {
    name: "Gast · Alt + B in die Bücherei (noch keine Geschichte)",
    mindestensDe: 4,
    frist: 30000,
    lauf: async (sprache) => {
      zeigeSeite(null);
      await waitFor(() => tippfeldPflicht());
      fireEvent.keyDown(document, { code: "KeyB", altKey: true });
      await waitFor(() => expect(document.getElementById("buecherei-titel")).not.toBeNull());
      if (sprache === "en")
        expect(gesprochen()).toContainEqual(["Stories and non-fiction.", "en"]);
      return fange();
    },
  },
  {
    name: "Bücherei mit Geschichten: Fortsetzen, Liste, Bald, Quellen, Alt + L",
    mindestensDe: 8,
    lauf: async (sprache) => {
      zeige(
        <SerienTrainer
          loadFn={() => Promise.resolve(leseFortschritt())}
          saveFn={() => undefined}
          stufe="kids"
          lang="de"
        />,
      );
      await waitFor(() => expect(document.getElementById("buecherei-titel")).not.toBeNull());
      expect(document.getElementById("buecherei-titel")!.textContent).toBe(
        sprache === "en" ? "Stories & non-fiction" : "Geschichten & Wissen",
      );
      // Die Titel sind Inhalt - in `lang="de"`, darum vom Fänger ausgenommen.
      expect(document.querySelectorAll('h3[lang="de"]').length).toBeGreaterThan(1);
      fireEvent.keyDown(document, { code: "KeyL", altKey: true });
      window.dispatchEvent(new Event("tippen-request-level"));
      await warte(100);
      return fange();
    },
  },
  {
    name: "Leser einer Geschichte: Kopf mit Etappe, Stand-Zeile",
    mindestensDe: 4,
    frist: 30000,
    lauf: async () => {
      const serie = serieBySlug("de-g2-khalai-spricht-mit-pflanzen")!;
      inhalte = [serie.titel];
      zeige(
        <SerienTrainer
          loadFn={() => Promise.resolve(leseFortschritt())}
          saveFn={() => undefined}
          stufe="kids"
          lang="de"
          initialSlug={serie.slug}
        />,
      );
      await waitFor(() => tippfeldPflicht());
      return fange();
    },
  },
  {
    name: "Geschichten-Angebot der Abschluss-Karte: vier Fassungen",
    // Vier Knöpfe, drei verschiedene Sätze (Kind und Erwachsen teilen „Jetzt
    // kommt eine Geschichte:") - der Fänger zählt jede Fundstelle einmal.
    mindestensDe: 3,
    lauf: async () => {
      const serie = serieBySlug("de-g2-khalai-spricht-mit-pflanzen")!;
      zeige(
        <div>
          <StoryOffer serie={serie} weiter skin="kind" onOpen={() => {}} />
          <StoryOffer serie={serie} weiter={false} skin="kind" onOpen={() => {}} />
          <StoryOffer serie={serie} weiter skin="jugend" onOpen={() => {}} />
          <StoryOffer serie={serie} weiter={false} skin="erwachsen" onOpen={() => {}} />
        </div>,
      );
      // Der Titel steht als Inhalt in seiner Sprache daneben.
      expect(document.querySelectorAll('button span[lang="de"]').length).toBe(4);
      return fange();
    },
  },
  {
    name: "Bildschirm-Tastatur mit Fingerfarben-Legende",
    mindestensDe: 6,
    lauf: async (sprache) => {
      zeige(<KeyboardPanel immerOffen nextChar="f" unlocked={new Set(EINGEFUEHRT)} showFingerColors />);
      await waitFor(() => expect(document.querySelector("[data-tastatur]")).not.toBeNull());
      // Die Kappe „Strg" ist die Aufschrift einer deutschen Tastatur - in
      // englischer Bedienung als Deutsch ausgezeichnet, nicht übersetzt.
      if (sprache === "en") expect(document.querySelectorAll('span[lang="de"]').length).toBeGreaterThan(0);
      return fange();
    },
  },
  {
    name: "Tasten erkunden: Tab, a, Strg + C, dann Tasten finden (daneben, gefunden, weiter)",
    mindestensDe: 8,
    lauf: async (sprache) => {
      zeige(<TastenErkunden open onClose={() => {}} startModus="erkunden" kopfKompakt />);
      await waitFor(() => expect(screen.getByRole("application")).toBeTruthy());
      const funde = new Set<string>();
      const druecke = async (init: KeyboardEventInit) => {
        fireEvent.keyDown(document, init);
        await warte(40);
        for (const f of fange()) funde.add(f);
      };
      for (const f of fange()) funde.add(f);
      await druecke({ key: "Tab", code: "Tab" });
      await druecke({ key: "a", code: "KeyA" });
      await druecke({ key: "c", code: "KeyC", ctrlKey: true });
      await druecke({ key: ".", code: "Period" });
      // Alt + 4: Tasten finden - die erste gesuchte Taste ist Tab.
      await druecke({ key: "4", code: "Digit4", altKey: true });
      await druecke({ key: "a", code: "KeyA" }); // daneben
      await druecke({ key: "Tab", code: "Tab" }); // gefunden
      await druecke({ key: "a", code: "KeyA" }); // D1: eine andere Taste dazwischen
      await druecke({ key: "Tab", code: "Tab" }); // bestätigt, nächste Taste
      if (sprache === "en") {
        const zeile = document.querySelector<HTMLTextAreaElement>("[data-erkunden-zeile]")!.value;
        expect(zeile).toMatch(/^Got it! Find the left arrow\./);
        expect(ohneEnglischeStimme()).toEqual([]);
      }
      return [...funde];
    },
  },
  {
    name: "Groß ohne Umschalt: Hinweis aufgeklappt, dazu die zwei Erklär-Fenster",
    mindestensDe: 6,
    lauf: async (sprache) => {
      zeige(
        <div>
          <AutoCapHint />
          <Merkfenster {...grossschreibungFenster("kind", sprache)} onSchliessen={() => {}} />
          <Merkfenster
            {...umschaltFenster(sprache === "en" ? "capital A" : "großes A", "rechts", "erwachsen", sprache)}
            mitHaken
            onSchliessen={() => {}}
          />
        </div>,
      );
      fireEvent.click(screen.getByRole("button", { expanded: false, name: /Umschalttaste|Shift/ }));
      await warte(20);
      if (sprache === "en") expect(ohneEnglischeStimme()).toEqual([]);
      return fange();
    },
  },
  {
    name: "Eigene Übung: Ankündigung und Lauf (deutscher Text als Inhalt)",
    mindestensDe: 4,
    frist: 30000,
    lauf: async (sprache) => {
      const stand: EigeneUebungStand = {
        zeiger: { textId: "t1" } as EigeneUebungStand["zeiger"],
        dran: true,
        geladen: true,
        text: { dateiname: "tiere.txt", zeilen: ["Der Hund läuft über die Wiese."] } as EigeneUebungStand["text"],
        startZeile: 0,
        unlocked: new Set(EINGEFUEHRT),
        shiftLearned: true,
        angekuendigt: true,
        bestaetigeAnkuendigung: () => {},
        meldeFortschritt: () => {},
      };
      zeige(
        <div>
          <EigeneUebungAnkuendigung skin="kind" onWeiter={() => {}} />
          <EigeneUebungLauf
            stand={stand}
            account={{ id: "p-mia", role: "schueler", name: "Mia", classCode: "5A3", stufe: "b", createdAt: 1 }}
            stufe="b"
            lang="de"
            onTask={() => {}}
          />
        </div>,
      );
      await waitFor(() => tippfeldPflicht());
      if (sprache === "en") {
        expect(screen.getByRole("heading", { level: 2, name: /tiere\.txt/ }).textContent).toBe(
          "Exercise from your teacher · tiere.txt",
        );
        expect(ohneEnglischeStimme()).toEqual([]);
      }
      return fange();
    },
  },
  {
    name: "Freischalt-Feier mit dem Angebot des Belohnungs-Spiels",
    mindestensDe: 3,
    lauf: async (sprache) => {
      zeige(
        <UnlockCelebration
          unit="r"
          skin="kind"
          belohnung={{ ...belohnungsAngebot(sprache, true), onStart: () => {} }}
          onClose={() => {}}
        />,
      );
      await warte(700);
      if (sprache === "en") expect(ohneEnglischeStimme()).toEqual([]);
      return fange();
    },
  },
  {
    name: "Keine englische Stimme installiert (Anleitung)",
    mindestensDe: 8,
    lauf: async () => {
      zeige(<VoiceInstallHelp open onClose={() => {}} />);
      await screen.findByRole("dialog");
      return fange();
    },
  },
];

/** Alle Textknoten des Dokuments, durch Leerzeichen getrennt. */
function alleTexte(): string {
  const gang = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const teile: string[] = [];
  for (let n = gang.nextNode(); n; n = gang.nextNode()) teile.push(n.textContent ?? "");
  return teile.join(" ");
}

function melde(sprache: string, zustand: string, funde: string[]) {
  console.info(`[Deutsch-Fänger EN1] ${sprache} · ${zustand}: ${funde.length} Funde`);
}

describe("★★★ Deutsch-Fänger: Übungsseite in englischer Bedienung (EN1)", () => {
  for (const z of ZUSTAENDE) {
    it(`EN · ${z.name}: kein deutsches Wort`, async () => {
      stelleBedienung("en");
      const funde = await z.lauf("en");
      melde("EN", z.name, funde);
      // Gegenprobe im selben Lauf: Es stand wirklich eine englische Seite da.
      // (Textknoten einzeln, mit Leerzeichen dazwischen - die Bildschirm-
      // Tastatur schreibt ihre Kappen sonst lückenlos aneinander.)
      const englisch = alleTexte().match(
        /\b(the|and|you|your|with|for|key|keys|finger|thumb|space|story|Weekly|Stories|Continue|Carry|Close|Find|Explore|Shift|Settings|Help|Level|Capital|Exercise|teacher)\b/g,
      );
      expect(englisch?.length ?? 0, "keine englische Bedienung im Dokument").toBeGreaterThanOrEqual(3);
      expect(funde, `Deutsch in der englischen Bedienung:\n${funde.join("\n")}`).toEqual([]);
    }, z.frist ?? 20000);
  }
});

describe("★★★ GEGENPROBE: dieselben Zustände in der deutschen Bedienung", () => {
  for (const z of ZUSTAENDE) {
    it(`DE · ${z.name}: der Fänger findet Deutsch`, async () => {
      stelleBedienung("de");
      const funde = await z.lauf("de");
      melde("DE", z.name, funde);
      expect(funde.length, "Der Fänger liest nichts - dann misst er auch nichts").toBeGreaterThanOrEqual(
        z.mindestensDe,
      );
    }, z.frist ?? 20000);
  }
});

// ---------------------------------------------------------------------------
// Einzelne Sätze, die der DOM-Fänger nicht sieht
// ---------------------------------------------------------------------------

describe("Ohne Sprachangabe und ohne Anbieter bleibt alles, wie es war", () => {
  it("die Erklär-Fenster ohne Sprache sind wortgleich die deutschen", () => {
    expect(grossschreibungFenster("kind")).toEqual(grossschreibungFenster("kind", "de"));
    expect(umschaltFenster("großes A", "links", "kind").titel).toBe("Fast!");
    expect(umschaltFenster("capital A", "links", "kind", "en").absaetze[0]).toBe(
      "You type capital A with the LEFT Shift key - using the little finger of your left hand.",
    );
  });

  it("Tasten erkunden ohne Anbieter (»Im Griff«) bleibt deutsch", async () => {
    localStorage.setItem("tastenflow-bedienung", "en"); // ohne Anbieter zählt das nicht
    render(<TastenErkunden open onClose={() => {}} />);
    await waitFor(() => expect(screen.getByRole("application", { name: "Tasten erkunden" })).toBeTruthy());
    fireEvent.keyDown(document, { key: "Tab", code: "Tab" });
    await warte(40);
    expect(document.querySelector<HTMLTextAreaElement>("[data-erkunden-zeile]")!.value).toMatch(
      /^Tab - Tabulatortaste - /,
    );
    expect(within(document.body).getByRole("button", { name: "Beenden" })).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// ★ EN10 (19.09.2026, im Browser gefunden): der Live-Bereich und seine Sprache
// ---------------------------------------------------------------------------

/**
 * Der Live-Bereich der Übungskarte trägt Sätze der Bedienung UND die nächste
 * Taste der Übung (folgt der Übungssprache, EN1). Im Browser stand in der
 * englischen Bedienung „großes W" ohne `lang` im englischen Umfeld - der
 * DOM-Fänger sah es in jsdom nie, weil die Ansage nur bei „Buchstabieren" und
 * ohne eigenes Vorlesen kommt. Hier genau dieser Weg: erst die Taste (mit
 * `lang="de"`), dann ein Fehlgriff (Bedienung, ohne `lang`). Die deutsche
 * Bedienung ist die Gegenprobe: dort nie ein Attribut.
 */
describe("★ EN10: der Live-Bereich trägt die Sprache seines Inhalts", () => {
  const liveBereich = () =>
    [...document.querySelectorAll<HTMLElement>('div.sr-only[role="status"][aria-live="assertive"]')].find(
      (e) => (e.textContent ?? "").trim() !== "",
    );
  for (const sprache of ["en", "de"] as const) {
    it(`${sprache.toUpperCase()} · nächste Taste der deutschen Übung, dann ein Fehlgriff`, async () => {
      stelleBedienung(sprache);
      useVoice.getState().setEnabled(false);
      useTypingA11y.getState().setTastenAnsage("naechste");
      try {
        // Ein Kind einer Klasse: seine Übungssprache ist Deutsch (`account.lang`
        // fehlt ⇒ „de"). Ein Gast übte in der englischen Bedienung Englisch.
        const t = registerTeacher("L", `l${Math.random()}@s.at`, "geheim1");
        if (!t.ok) throw new Error("Lehrkraft");
        const cls = createClass(t.value.id, "3b");
        if (!cls.ok) throw new Error("Klasse");
        const kind = addPupil(cls.value.code, "Mia", "1234", "b");
        if (!kind.ok) throw new Error("Kind");
        zeigeSeite(kind.value);
        const feld = await waitFor(() => tippfeldPflicht());
        // Die erste Taste einer Zeile kommt nach 700 ms (TypingSession).
        const ansage = await waitFor(
          () => {
            const el = liveBereich();
            expect(el).toBeTruthy();
            return el!;
          },
          { timeout: 4000 },
        );
        expect(ansage.getAttribute("lang"), `„${ansage.textContent}" ${ansage.outerHTML}`).toBe(
          sprache === "en" ? "de" : null,
        );
        fireEvent.keyDown(feld, { key: "x", code: "KeyX" });
        await waitFor(() =>
          expect(liveBereich()?.textContent ?? "").toMatch(sprache === "en" ? /^Not quite\./ : /^Falsch\./),
        );
        expect(liveBereich()!.getAttribute("lang")).toBeNull();
      } finally {
        useTypingA11y.getState().setTastenAnsage("aus");
      }
    }, 20000);
  }
});
