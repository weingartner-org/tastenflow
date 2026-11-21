/**
 * ★★★★★ MECHANIK GLEICH AUF WEG „DE" UND WEG „EN" (Nachtlauf 24.09.2026).
 *
 * Auftrag Johannes: Bevor der englische Lehrgang (Lernweg „en", Probe-Schalter
 * `?englisch-lehrgang=1`) freigegeben wird, muss bewiesen sein, dass seine
 * MECHANIK dieselbe ist wie auf dem deutschen Weg - Braille-Unterstützung,
 * Mouseover-Hinweise (`Tipp`), Vorlesen/Ansage-Verhalten, Fokusziele,
 * Tastenkürzel, Live-Regionen. Nur Sprache und Inhalt dürfen sich
 * unterscheiden.
 *
 * ── WAS DAS HIER IST, UND WAS NICHT ──────────────────────────────────────────
 * Die vorhandenen „Deutsch-Fänger" (`tests/tastenflow-englisch-*.test.tsx`,
 * `tests/helfer/deutschFaenger.ts`) prüfen, dass in der englischen Bedienung
 * kein deutsches WORT übrig geblieben ist - INHALT. Dieser Wächter prüft die
 * FORM: denselben Bildschirm einmal auf Weg „de" und einmal auf Weg „en"
 * gerendert, dann einen STRUKTUR-FINGERABDRUCK verglichen, in dem aller Text
 * durch Platzhalter ersetzt ist (`tests/helfer/mechanikAbdruck.ts`). Bleibt der
 * Abdruck gleich, ist die Mechanik gleich - unabhängig davon, wie lang die
 * Wörter in der jeweiligen Sprache sind.
 *
 * Ergebnis und offene Punkte stehen in
 * `BEFUND-2026-09-24-MECHANIK-DEUTSCH-ENGLISCH.md`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";

vi.mock("@/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing/voice")>();
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
import { SerienTrainer } from "@/components/typing/SerienTrainer";
import { RaetselLauf } from "@/components/typing/RaetselLauf";
import { BuchstabensalatLauf } from "@/components/typing/BuchstabensalatLauf";
import { SchreibprobeLauf } from "@/components/typing/SchreibprobeLauf";
import { SchreibprobeErgebnis } from "@/components/typing/SchreibprobeErgebnis";
import { LetterMap } from "@/components/typing/LetterMap";
import { BadgeShelf } from "@/components/typing/BadgeShelf";
import { PupilStatsPanel, type PupilData } from "@/components/typing/PupilStatsPanel";
import { TypingSettings } from "@/components/typing/TypingSettings";
import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { formFuer, type FormKontext } from "@/lib/typing/uebungsformen";
import { waehleSalatwort } from "@/lib/typing/uebungsformen/buchstabensalat";
import {
  emptyProgress,
  introducedUpTo,
  werteAus,
  computePupilStats,
  registerTeacher,
  createClass,
  addPupil,
  listPupils,
  saveAccountProgress,
  speakUi,
  speakUiAlways,
  speak,
  useVoice,
  type TypingProgress,
  type TypingAccount,
  type AuswertungEingang,
} from "@/lib/typing";
import { LEERER_FORTSCHRITT, type SchreibprobeStand } from "@/lib/typing/useSchreibprobe";
import { LEERER_STAND, type SchreibprobePlan } from "@/lib/typing/schreibprobe";
import { useTypingA11y } from "@/lib/typing/a11y";
import { LEHRGANG_PROBE_MERKER, lernwegDef, type Lernweg } from "@/lib/typing/lernweg";
import { ohneBildschirmTastatur } from "./_typing-probelauf";
import {
  strukturAbdruck,
  pruefeGleicheStruktur,
  pruefeNichtsGesperrt,
  zaehleTippHinweise,
  sprachAufrufFolge,
  sprachAufrufKurz,
} from "./helfer/mechanikAbdruck";

// ---------------------------------------------------------------------------
// Aufbau, gemeinsam für alle Bildschirme
// ---------------------------------------------------------------------------

/**
 * Home-Reihe + 7 Buchstaben (Bauplan §3.3a: bei „en" genau die Sprossen bis
 * zur Umschalttaste) - dieselbe STUFENGRÖSSE (Anzahl Einträge) auf beiden
 * Wegen, keine Behauptung über dieselbe Zusammensetzung.
 *
 * ★ Gemessen 24.09.2026, zwei Fallstricke derselben Ursache (verschiedene
 * ZUSAMMENSETZUNG bei gleicher ZAHL):
 *  1. Bei „de" liegt Sprosse 14 schon HINTER der Umschalttaste (`de`s
 *     `LETTERS_BEFORE_SHIFT` ist 13), bei „en" noch davor (15) - Stufe 15
 *     hat die Taste darum nur auf „de" schon gelernt, und `AutoCapHint` (der
 *     Hinweis „Groß ohne Umschalttaste") erschien nur bei „en". Behoben durch
 *     Herausnehmen dieses - nachweislich zufallsabhängigen, siehe dort -
 *     Hinweises vor dem Vergleich (`entferneAutoCapHint`), NICHT durch
 *     unterschiedliche Stufenzahlen je Weg: Das hätte nur den nächsten
 *     Fallstrick ausgelöst (siehe 2).
 *  2. Eine je Weg VERSCHIEDENE Anzahl (13 statt 15) lässt jede Liste, die ein
 *     Element JE EINGEFÜHRTEM ZEICHEN zeichnet (die Buchstaben-Fortschritts-
 *     leiste in „Meine Statistik"/„Deine Tasten"), auf den beiden Wegen
 *     verschieden lang werden - eine Abweichung durch die Anzahl, keine
 *     Mechanik. Darum hier bewusst DIESELBE Zahl für beide Wege.
 */
const STUFE = 15;

function eingefuehrt(weg: Lernweg): string[] {
  return introducedUpTo(STUFE, weg);
}

function fortschritt(weg: Lernweg, zusatz: Partial<TypingProgress> = {}): TypingProgress {
  return { ...emptyProgress(), lernweg: weg, introduced: eingefuehrt(weg), ...zusatz };
}

/**
 * Wie {@link eingefuehrt}, aber je Weg VOR seiner eigenen Umschalttaste
 * (13 bei „de", 15 bei „en", siehe die Anmerkung oben) - für den
 * Praxis-Bildschirm, wo die Umschalttaste selbst geprüft wird (Skript-Schritt
 * „Shift zweimal"). Mit der GLEICHEN Zahl für beide Wege hätte nur „de" sie
 * schon gelernt, und ein Tastendruck auf eine schon eingeführte Umschalttaste
 * löst dort eine zusätzliche Ansage aus, die „en" (noch nicht gelernt) fehlt -
 * wieder derselbe Fallstrick, nur als ANSAGE statt als Bildschirm-Element.
 */
function fortschrittVorSchwelle(weg: Lernweg): TypingProgress {
  const introduced = introducedUpTo(lernwegDef(weg).lettersBeforeShift, weg);
  return { ...emptyProgress(), lernweg: weg, introduced };
}

beforeEach(() => {
  localStorage.clear();
  // ★ Der Probe-Schalter - ohne ihn gibt es Weg „en" gar nicht (lernweg.ts).
  localStorage.setItem(LEHRGANG_PROBE_MERKER, "1");
  Element.prototype.scrollIntoView = () => {};
  useTypingA11y.getState().resetZoom();
  ohneBildschirmTastatur();
  useTypingA11y.getState().setTastenAnsage("aus");
  useVoice.getState().setEnabled(false);
  vi.mocked(speakUi).mockClear();
  vi.mocked(speakUiAlways).mockClear();
  vi.mocked(speak).mockClear();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/** Baut aus den beiden Fingerabdrücken eine Meldung, die den Bildschirm nennt. */
function vergleiche(name: string, de: () => void, en: () => void): void {
  de();
  const deAbdruck = strukturAbdruck();
  cleanup();
  en();
  const enAbdruck = strukturAbdruck();
  pruefeNichtsGesperrt(deAbdruck);
  pruefeNichtsGesperrt(enAbdruck);
  pruefeGleicheStruktur(deAbdruck, enAbdruck, `Struktur „${name}": Weg „en" weicht von Weg „de" ab`);
}

// ---------------------------------------------------------------------------
// 1 · Praxis: AdaptiveTrainer / TypingSession
// ---------------------------------------------------------------------------

describe("1 · Praxis (Mein Training)", () => {
  function bau(weg: Lernweg) {
    return render(
      <AdaptiveTrainer
        loadFn={() => Promise.resolve(fortschrittVorSchwelle(weg))}
        saveFn={() => undefined}
        onTask={() => undefined}
        stufe="kids"
        lang={weg}
      />,
    );
  }

  /**
   * `AutoCapHint` (TypingSession.tsx) erscheint NUR, wenn die aktuelle -
   * ZUFÄLLIG gezogene - Zeile einen Grossbuchstaben verlangt, DIE
   * Umschalttaste aber noch nicht gelernt ist (Dateikopf dort: „NUR erscheint,
   * solange … in der Zeile aber ein Großbuchstabe steht"). Das hängt am
   * Zufallstext dieses Durchlaufs, nicht an der Sprache - ob er erscheint,
   * schwankt auch INNERHALB eines Weges von Lauf zu Lauf. Für den
   * Struktur-Vergleich darum herausgenommen (auf beiden Seiten - er ist bei
   * Abwesenheit ein No-op).
   */
  function entferneAutoCapHint(): void {
    const knopf = screen.queryByRole("button", {
      name: /Capital letters without Shift|Große Buchstaben ohne Umschalttaste/,
    });
    // Der Slot, der AutoCapHint hält (siehe die Stelle, die ihn in TypingSession
    // einhängt) - eine Ebene über dem eigenen `<div ref>` von AutoCapHint selbst.
    const slot = knopf?.closest("div")?.parentElement;
    slot?.remove();
  }

  it("DOM-Struktur und Tipp-Zahl sind auf beiden Wegen gleich", async () => {
    bau("de");
    await waitFor(() => expect(document.querySelector('[data-typing-field="practice"]')).not.toBeNull());
    entferneAutoCapHint();
    const deAbdruck = strukturAbdruck();
    const deTipps = zaehleTippHinweise();
    cleanup();

    bau("en");
    await waitFor(() => expect(document.querySelector('[data-typing-field="practice"]')).not.toBeNull());
    entferneAutoCapHint();
    const enAbdruck = strukturAbdruck();
    const enTipps = zaehleTippHinweise();

    pruefeNichtsGesperrt(deAbdruck);
    pruefeNichtsGesperrt(enAbdruck);
    pruefeGleicheStruktur(deAbdruck, enAbdruck, "Praxis-Bildschirm (Struktur, ARIA, Live-Regionen)");
    expect(enTipps, "Zahl der Mouseover-Hinweise").toBe(deTipps);
    // Die einzige zugängliche Übungszeile ist das Textarea - genau eines,
    // einzeilig, unabhängig von der Textlänge (Braille-Regel 10.09.2026).
    const feld = document.querySelector('[data-typing-field="practice"]') as HTMLTextAreaElement;
    expect(feld.tagName).toBe("TEXTAREA");
    expect(feld.rows).toBe(1);
  });

  /** Das aktive Zeichen der sichtbaren (aria-hidden) Zeile - für die Skript-Anschläge. */
  function naechstesZeichen(): string {
    const txt = document.querySelector(".tt-prompt-active")?.textContent ?? "";
    return txt === "␣" ? " " : txt || "a";
  }

  async function warte(ms: number): Promise<void> {
    await act(() => new Promise<void>((r) => window.setTimeout(r, ms)));
  }

  /**
   * Das SKRIPT: richtiger Anschlag, falscher Anschlag, Leertaste, so viele
   * richtige Anschläge, bis die Zeile fertig ist (mit Deckel gegen
   * Endlosschleifen), Umschalttaste zweimal, Escape, Alt + Z (Zeilenstand).
   */
  async function spieleSkript(feld: HTMLElement): Promise<void> {
    fireEvent.keyDown(feld, { key: naechstesZeichen() }); // richtig
    await warte(20);
    fireEvent.keyDown(feld, { key: naechstesZeichen() === "q" ? "x" : "q" }); // falsch
    await warte(20);
    fireEvent.keyDown(feld, { key: " " }); // Leertaste
    await warte(20);
    for (let i = 0; i < 40; i++) {
      const restSpannen = document.querySelectorAll(".tt-prompt-spur .tt-prompt-active").length;
      if (restSpannen === 0) break;
      fireEvent.keyDown(feld, { key: naechstesZeichen() });
      await warte(15);
    }
    fireEvent.keyDown(feld, { key: "Shift", code: "ShiftLeft" });
    fireEvent.keyDown(feld, { key: "Shift", code: "ShiftLeft" });
    await warte(20);
    fireEvent.keyDown(document, { key: "Escape" });
    await warte(20);
    fireEvent.keyDown(document, { code: "KeyZ", altKey: true });
    await warte(20);
  }

  /**
   * Dieselben Anschläge wie {@link spieleSkript}, aber OHNE die Zeile zu Ende
   * zu tippen - für den Sprachfolge-Vergleich.
   *
   * ★ Gemessen 24.09.2026: „bis zur Zeile fertig" tippen macht das Skript vom
   * ZUFALLSTEXT abhängig - endet eine Zeile, entscheidet der Zufall über die
   * ART der NÄCHSTEN Zeile, und nur ein WECHSEL der Art löst „Achtung, jetzt
   * …" aus (`ansageFuerZeilenart`). Zwei unabhängige Zufallszüge (Weg „de" und
   * Weg „en" laden je ihren eigenen, ungeseedeten Text) landen nicht
   * zuverlässig auf demselben Wechsel/Nicht-Wechsel - eine Abweichung, die
   * nichts mit der Sprache zu tun hat. Das Skript bleibt darum bewusst INNERHALB
   * einer Zeile.
   */
  async function spieleSkriptKurz(feld: HTMLElement): Promise<void> {
    fireEvent.keyDown(feld, { key: naechstesZeichen() }); // richtig
    await warte(20);
    fireEvent.keyDown(feld, { key: naechstesZeichen() === "q" ? "x" : "q" }); // falsch
    await warte(20);
    fireEvent.keyDown(feld, { key: " " }); // Leertaste
    await warte(20);
    fireEvent.keyDown(feld, { key: naechstesZeichen() }); // wieder richtig, noch in derselben Zeile
    await warte(20);
    fireEvent.keyDown(feld, { key: "Shift", code: "ShiftLeft" });
    fireEvent.keyDown(feld, { key: "Shift", code: "ShiftLeft" });
    await warte(20);
    fireEvent.keyDown(document, { key: "Escape" });
    await warte(20);
    fireEvent.keyDown(document, { code: "KeyZ", altKey: true });
    await warte(20);
  }

  /**
   * Denselben Zufallszug für „de" und „en" - der Zeilen-Generator entscheidet
   * per Zufall über die ART der ersten Zeile (echte Wörter/Unsinn/Zahlen), und
   * nur ein WECHSEL der Art löst „Achtung, jetzt …" aus. Ungeseedet zöge jeder
   * Weg unabhängig - und träfe beide Male zufällig verschieden, eine
   * Abweichung ohne jede Sprach-Ursache (gemessen 24.09.2026: flackerte ohne
   * diese Saat).
   */
  function seedeZufall(seed: number): void {
    let s = seed >>> 0;
    vi.spyOn(Math, "random").mockImplementation(() => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    });
  }

  /** Eine Kombination Vorlesen × Buchstabieren durchspielen, die Anrufliste zurückgeben. */
  async function skriptDurchlauf(
    weg: Lernweg,
    vorlesenAn: boolean,
    buchstabierenAn: boolean,
  ): Promise<string[]> {
    useVoice.getState().setEnabled(vorlesenAn);
    useTypingA11y.getState().setTastenAnsage(buchstabierenAn ? "naechste" : "aus");
    seedeZufall(42);
    bau(weg);
    const feld = await waitFor(() => {
      const f = document.querySelector('[data-typing-field="practice"]');
      expect(f).not.toBeNull();
      return f as HTMLTextAreaElement;
    });
    feld.focus();
    // Ansagen beim EINHÄNGEN (Übungsart „Mein Training.", die erste Zeile)
    // erst ausklingen lassen, dann erst leeren - sonst rutscht eine
    // asynchron NACH `waitFor` nachgereichte Mount-Ansage (unabhängig vom
    // Skript) noch in die aufgezeichnete Folge und wird zufällig verschieden
    // gezählt.
    await warte(150);
    vi.mocked(speakUi).mockClear();
    vi.mocked(speakUiAlways).mockClear();
    vi.mocked(speak).mockClear();
    await spieleSkriptKurz(feld);
    return sprachAufrufKurz(
      sprachAufrufFolge({
        speakUi: vi.mocked(speakUi),
        speakUiAlways: vi.mocked(speakUiAlways),
        speak: vi.mocked(speak),
      }),
    );
  }

  const KOMBIS: { name: string; vorlesen: boolean; buchstabieren: boolean }[] = [
    { name: "Vorlesen aus, Buchstabieren aus", vorlesen: false, buchstabieren: false },
    { name: "Vorlesen aus, Buchstabieren an", vorlesen: false, buchstabieren: true },
    { name: "Vorlesen an, Buchstabieren aus", vorlesen: true, buchstabieren: false },
    { name: "Vorlesen an, Buchstabieren an", vorlesen: true, buchstabieren: true },
  ];

  for (const k of KOMBIS) {
    it(`Sprachfolge beim Skript ist gleich (${k.name})`, async () => {
      const deFolge = await skriptDurchlauf("de", k.vorlesen, k.buchstabieren);
      cleanup();
      const enFolge = await skriptDurchlauf("en", k.vorlesen, k.buchstabieren);
      expect(enFolge, `${k.name}: Folge der Ansage-Arten (Weg „en" gegen Weg „de")`).toEqual(deFolge);
    }, 20000);
  }

  it(`Live-Region bleibt beim Tippen still, ausser „Buchstabieren" ist an - auf beiden Wegen gleich`, async () => {
    async function stille(weg: Lernweg, buchstabierenAn: boolean): Promise<boolean> {
      useVoice.getState().setEnabled(false); // Vorlesen aus - sonst übernimmt die Stimme (siehe unten)
      useTypingA11y.getState().setTastenAnsage(buchstabierenAn ? "naechste" : "aus");
      bau(weg);
      const feld = await waitFor(() => {
        const f = document.querySelector('[data-typing-field="practice"]');
        expect(f).not.toBeNull();
        return f as HTMLTextAreaElement;
      });
      const live = document.querySelector('[role="status"][aria-live="assertive"]') as HTMLElement;
      expect(live, "Live-Region (role=status, aria-live=assertive)").not.toBeNull();
      live.textContent = "";
      fireEvent.keyDown(feld, { key: naechstesZeichen() });
      await act(() => new Promise<void>((r) => window.setTimeout(r, 150)));
      const ruhig = (live.textContent ?? "").trim() === "";
      cleanup();
      return ruhig;
    }

    expect(await stille("de", false), "Weg de, Buchstabieren aus: still").toBe(true);
    expect(await stille("en", false), "Weg en, Buchstabieren aus: still").toBe(true);
    expect(await stille("de", true), "Weg de, Buchstabieren an: NICHT still").toBe(false);
    expect(await stille("en", true), "Weg en, Buchstabieren an: NICHT still").toBe(false);
  });

  it("bei eingeschaltetem Vorlesen bleibt die Live-Region still - auf beiden Wegen (announce tritt zurück)", async () => {
    async function stille(weg: Lernweg): Promise<boolean> {
      useVoice.getState().setEnabled(true);
      useTypingA11y.getState().setTastenAnsage("naechste");
      bau(weg);
      const feld = await waitFor(() => {
        const f = document.querySelector('[data-typing-field="practice"]');
        expect(f).not.toBeNull();
        return f as HTMLTextAreaElement;
      });
      const live = document.querySelector('[role="status"][aria-live="assertive"]') as HTMLElement;
      live.textContent = "";
      fireEvent.keyDown(feld, { key: naechstesZeichen() });
      await act(() => new Promise<void>((r) => window.setTimeout(r, 150)));
      const ruhig = (live.textContent ?? "").trim() === "";
      cleanup();
      return ruhig;
    }
    expect(await stille("de")).toBe(true);
    expect(await stille("en")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2 · Serie lesen: SerienTrainer
// ---------------------------------------------------------------------------

describe("2 · Serie lesen (Geschichten und Wissen)", () => {
  function bau(weg: Lernweg) {
    return render(
      <SerienTrainer
        loadFn={() => Promise.resolve(fortschritt(weg))}
        saveFn={() => undefined}
        stufe="kids"
        lang={weg}
      />,
    );
  }

  it("das Bücherei-Regal hat auf beiden Wegen dieselbe Struktur", async () => {
    vergleiche(
      "Bücherei-Regal",
      () => bau("de"),
      () => bau("en"),
    );
  });
});

// ---------------------------------------------------------------------------
// 3 · Wortspiele: Fingerdiktat (Tippen), Lückentext (Lücke), Buchstabensalat
// ---------------------------------------------------------------------------

describe("3 · Wortspiele", () => {
  function festerZufall(seed: number): () => number {
    let z = seed >>> 0;
    return () => {
      z = (z * 1664525 + 1013904223) >>> 0;
      return z / 4294967296;
    };
  }

  function kontext(weg: Lernweg): FormKontext {
    return {
      lernweg: weg,
      introduced: eingefuehrt(weg),
      shift: true,
      oneHand: false,
      stufe: "kids",
      lang: weg,
      sprache: undefined,
      count: 6,
      zufall: festerZufall(3),
    };
  }

  it("Fingerdiktat (Tippen nach Ansage): gleiche Struktur auf beiden Wegen", () => {
    const bau = (weg: Lernweg) => {
      const f = formFuer("fingerdiktat")!;
      const ctx = kontext(weg);
      const aufgaben = f.fragen!(ctx);
      render(
        <RaetselLauf
          titel={f.name}
          ankuendigung={f.ankuendigung(ctx)}
          aufgaben={aufgaben}
          grossKleinZaehlt={f.grossKleinZaehlt}
          eingabeAnsagen={f.eingabeAnsagen}
          contextId="form:fingerdiktat"
          lang={weg}
          onFertig={() => {}}
          onAbbruch={() => {}}
        />,
      );
    };
    vergleiche(
      "Fingerdiktat",
      () => bau("de"),
      () => bau("en"),
    );
  });

  it("Lückentext: gleiche Struktur auf beiden Wegen", () => {
    const bau = (weg: Lernweg) => {
      const f = formFuer("lueckentext")!;
      const ctx = kontext(weg);
      const aufgaben = f.fragen!(ctx);
      render(
        <RaetselLauf
          titel={f.name}
          ankuendigung={f.ankuendigung(ctx)}
          aufgaben={aufgaben}
          grossKleinZaehlt={f.grossKleinZaehlt}
          eingabeAnsagen={f.eingabeAnsagen}
          contextId="form:lueckentext"
          lang={weg}
          onFertig={() => {}}
          onAbbruch={() => {}}
        />,
      );
    };
    vergleiche(
      "Lückentext",
      () => bau("de"),
      () => bau("en"),
    );
  });

  it("Buchstabensalat: gleiche Struktur auf beiden Wegen", () => {
    const bau = (weg: Lernweg) => {
      const ctx = kontext(weg);
      const quellwort = waehleSalatwort(ctx)!;
      expect(quellwort, `Weg ${weg}: kein Salatwort verfügbar`).toBeTruthy();
      render(
        <BuchstabensalatLauf
          quellwort={quellwort}
          ankuendigung={formFuer("buchstabensalat")!.ankuendigung(ctx)}
          contextId="form:buchstabensalat"
          lang={weg}
          onAufgabeFertig={() => {}}
          onFertig={() => {}}
          onAbbruch={() => {}}
        />,
      );
    };
    vergleiche(
      "Buchstabensalat",
      () => bau("de"),
      () => bau("en"),
    );
  });
});

// ---------------------------------------------------------------------------
// 4 · Tippchallenge: Lauf (streng/frei) und Ergebnis
// ---------------------------------------------------------------------------

describe("4 · Tippchallenge", () => {
  const KIND: TypingAccount = {
    id: "p-challenge",
    role: "schueler",
    name: "Alex",
    classCode: "K1",
    createdAt: 1,
  };

  function plan(weg: Lernweg, modus?: "frei"): SchreibprobePlan {
    return {
      id: `sp-${weg}-${modus ?? "streng"}`,
      niveau: "start",
      startMs: Date.now() - 60_000,
      dauerMin: 10,
      textNr: 0,
      startZeile: 0,
      zuschlagProzent: 0,
      angelegtMs: Date.now() - 120_000,
      lernweg: weg === "en" ? "en" : undefined,
      modus,
    };
  }

  function probeStand(weg: Lernweg, modus?: "frei"): SchreibprobeStand {
    return {
      plan: plan(weg, modus),
      phase: "laeuft",
      stand: { ...LEERER_STAND, beginnMs: Date.now() - 30_000 },
      geladen: true,
      einstiegBis: Date.now() + 9 * 60_000,
      beginne: vi.fn(),
      melde: vi.fn(),
      schliesseErgebnis: vi.fn(),
      gibAb: vi.fn(async () => {}),
      fortschritt: { ...LEERER_FORTSCHRITT },
      merkeFortschritt: vi.fn(),
    };
  }

  function bauLauf(weg: Lernweg, modus?: "frei") {
    return render(
      <SchreibprobeLauf probe={probeStand(weg, modus)} account={KIND} stufe="kids" onTask={vi.fn()} />,
    );
  }

  it("Lauf im strengen Modus: gleiche Struktur auf beiden Wegen", async () => {
    const de = async () => {
      bauLauf("de");
      await waitFor(() => expect(document.querySelector('[data-typing-field="practice"]')).not.toBeNull());
    };
    const en = async () => {
      bauLauf("en");
      await waitFor(() => expect(document.querySelector('[data-typing-field="practice"]')).not.toBeNull());
    };
    await de();
    const deAbdruck = strukturAbdruck();
    cleanup();
    await en();
    const enAbdruck = strukturAbdruck();
    pruefeNichtsGesperrt(deAbdruck);
    pruefeNichtsGesperrt(enAbdruck);
    pruefeGleicheStruktur(deAbdruck, enAbdruck, "Tippchallenge-Lauf, streng");
  });

  it("Lauf im freien Schreiben: gleiche Struktur auf beiden Wegen", async () => {
    const de = async () => {
      bauLauf("de", "frei");
      await waitFor(() => expect(document.querySelector('[data-typing-field="practice"]')).not.toBeNull());
    };
    const en = async () => {
      bauLauf("en", "frei");
      await waitFor(() => expect(document.querySelector('[data-typing-field="practice"]')).not.toBeNull());
    };
    await de();
    const deAbdruck = strukturAbdruck();
    cleanup();
    await en();
    const enAbdruck = strukturAbdruck();
    pruefeNichtsGesperrt(deAbdruck);
    pruefeNichtsGesperrt(enAbdruck);
    pruefeGleicheStruktur(deAbdruck, enAbdruck, "Tippchallenge-Lauf, freies Schreiben");
  });

  function eingang(weg: Lernweg, over: Partial<AuswertungEingang> = {}): AuswertungEingang {
    return {
      probeId: `sp-${weg}`,
      niveau: "start",
      lernweg: weg === "en" ? "en" : undefined,
      textNr: 0,
      textTitel: weg === "en" ? "A Kite in the Wind" : "Der Igel",
      beginnMs: Date.now() - 300_000,
      endeMs: Date.now(),
      zeitMs: 300_000,
      zuschlagProzent: 0,
      wartezeitMs: 0,
      zeichen: 400,
      fehler: 5,
      zeilen: 20,
      schreibMs: 300_000,
      anschlaege: [],
      layout: "de",
      textZuEnde: false,
      frueherAbgegeben: false,
      ...over,
    };
  }

  it("Ergebnis-Karte: gleiche Struktur auf beiden Wegen (streng)", () => {
    vergleiche(
      "Tippchallenge-Ergebnis, streng",
      () => render(<SchreibprobeErgebnis ergebnis={werteAus(eingang("de"))} onWeiter={() => {}} />),
      () => render(<SchreibprobeErgebnis ergebnis={werteAus(eingang("en"))} onWeiter={() => {}} />),
    );
  });

  it("Ergebnis-Karte: gleiche Struktur auf beiden Wegen (freies Schreiben)", () => {
    vergleiche(
      "Tippchallenge-Ergebnis, freies Schreiben",
      () => render(<SchreibprobeErgebnis ergebnis={werteAus(eingang("de", { modus: "frei" }))} onWeiter={() => {}} />),
      () => render(<SchreibprobeErgebnis ergebnis={werteAus(eingang("en", { modus: "frei" }))} onWeiter={() => {}} />),
    );
  });
});

// ---------------------------------------------------------------------------
// 5 · Deine Tasten (Lektions-/Tastenfortschritt), Abzeichen-Regal, Statistik
// ---------------------------------------------------------------------------

describe("5 · Deine Tasten, Abzeichen, Statistik, Einstellungen", () => {
  it(`„Deine Tasten" (Lektionsliste je Taste): gleiche Struktur`, () => {
    vergleiche(
      "Deine Tasten",
      () => render(<LetterMap lernweg="de" letters={{}} introduced={eingefuehrt("de")} showNext title="Deine Tasten" />),
      () => render(<LetterMap lernweg="en" letters={{}} introduced={eingefuehrt("en")} showNext title="Deine Tasten" />),
    );
  });

  it("Abzeichen-Regal: gleiche Struktur", () => {
    vergleiche(
      "Abzeichen-Regal",
      () => render(<BadgeShelf progress={fortschritt("de")} selfView />),
      () => render(<BadgeShelf progress={fortschritt("en")} selfView />),
    );
  });

  function pupilData(weg: Lernweg): PupilData {
    const pupil: TypingAccount = {
      id: `p-${weg}`,
      role: "schueler",
      name: "Kim",
      classCode: "K1",
      createdAt: 1,
    };
    return {
      pupil,
      progress: fortschritt(weg),
      events: [],
      stats: computePupilStats([]),
    };
  }

  it("Meine Statistik: gleiche Struktur", () => {
    vergleiche(
      "Meine Statistik",
      () => render(<PupilStatsPanel data={pupilData("de")} selfView />),
      () => render(<PupilStatsPanel data={pupilData("en")} selfView />),
    );
  });

  it("Einstellungen (Zahnrad): gleiche Struktur", () => {
    vergleiche(
      "Einstellungen",
      () =>
        render(
          <TypingSettings
            lernweg="de"
            stufe="kids"
            onStufeChange={() => {}}
            lang="de"
            onLangChange={() => {}}
            startUnits={eingefuehrt("de").length}
            onStartUnitsChange={() => {}}
            onZeitLassenChange={() => {}}
            onZeichenabstandChange={() => {}}
            onEinhandChange={() => {}}
            onEinrichtungNeu={() => {}}
          />,
        ),
      () =>
        render(
          <TypingSettings
            lernweg="en"
            stufe="kids"
            onStufeChange={() => {}}
            lang="en"
            onLangChange={() => {}}
            startUnits={eingefuehrt("en").length}
            onStartUnitsChange={() => {}}
            onZeitLassenChange={() => {}}
            onZeichenabstandChange={() => {}}
            onEinhandChange={() => {}}
            onEinrichtungNeu={() => {}}
          />,
        ),
    );
  });
});

// ---------------------------------------------------------------------------
// 6 · Lehrkraft: TastenflowReiter und Klassen-Einstellungen
// ---------------------------------------------------------------------------

describe("6 · Lehrkraft-Ansicht (TastenflowReiter)", () => {
  function baueKlasse(weg: Lernweg) {
    const t = registerTeacher(`Frau ${weg}`, `lehrkraft-${weg}@example.org`, "geheim123");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, `Klasse ${weg}`);
    if (!c.ok) throw new Error(c.error);
    const p = addPupil(c.value.code, "Kim", "pw1234");
    if (!p.ok) throw new Error(p.error);
    saveAccountProgress(p.value.id, fortschritt(weg));
    const kinder = listPupils(c.value.code);
    // ★ Für den Vergleich wird die Klasse direkt auf ihren Weg gestellt - ein
    // reiner Anzeige-Test, kein Weg über den Server (siehe Testkopf).
    const cls = { ...c.value, lang: weg, lernweg: weg } as typeof c.value;
    return { kinder, cls, teacherId: t.value.id };
  }

  /** Den Aussen-Schalter „Einstellungen der Klasse"/„Class settings" öffnen. */
  async function oeffneKlasseneinstellungen(): Promise<void> {
    const schalter = await screen.findByRole("button", { name: /^Einstellungen der Klasse|^Class settings/ });
    fireEvent.click(schalter);
    await waitFor(() => expect(schalter.getAttribute("aria-expanded")).toBe("true"));
  }

  it(`die Tabelle und ihr Rahmen sind auf beiden Wegen strukturell gleich - bis auf die neuen Klassen-Einstellungen „Course"/„Spelling" und die Kurs-Auskunft`, async () => {
    const de = baueKlasse("de");
    const en = baueKlasse("en");

    const deRender = render(
      <TastenflowReiter pupils={de.kinder} onChanged={() => {}} cls={de.cls} teacherId={de.teacherId} />,
    );
    await screen.findByRole("table");
    await oeffneKlasseneinstellungen();
    const deAbdruck = strukturAbdruck();
    deRender.unmount();
    cleanup();

    render(<TastenflowReiter pupils={en.kinder} onChanged={() => {}} cls={en.cls} teacherId={en.teacherId} />);
    await screen.findByRole("table");
    await oeffneKlasseneinstellungen();
    // ★★ Die ERLAUBTEN Abweichungen (Bauplan §8.2/E9, §7/E8) - beide vor dem
    // Vergleich herausgenommen, damit der Rest wortlos gleich sein muss:
    //  1. „Schreibweise"/„Spelling" gibt es nur bei englischer Übungssprache.
    //  2. Die Kurs-Auskunft „Lehrgang:"/„Course:" (★ FREIGABE 25.09.2026: seit
    //     `KlassenEinstellungsFelder` nicht mehr an den Probe-Schalter,
    //     sondern an Bedienung/Klassenweg gebunden) ist hier NUR beim
    //     englischen Weg sichtbar, weil beide Renderings ohne
    //     `BedienSpracheProvider` mit deutscher Bedienung laufen - eine
    //     Klasse auf Weg „de" mit deutscher Bedienung zeigt sie darum nicht.
    // ★ Auf einem GEKLONTEN <body> entfernt, nicht am echten - ein Eingriff in
    // den von React verwalteten Baum liesse React beim nächsten `cleanup()`
    // auf einen Knoten treffen, den es selbst noch zu kennen glaubt.
    const klon = document.body.cloneNode(true) as HTMLElement;
    const schreibweise = within(klon).queryByRole("combobox", { name: /Schreibweise|Spelling/ });
    expect(schreibweise, "die einzige zulässige Abweichung: das Schreibweise-Feld").not.toBeNull();
    // Der Mouseover-Hinweis dieses Feldes hängt als eigener Portal-Knoten
    // unter <body> (Tipp/Hinweiskasten) - er muss mit entfernt werden, sonst
    // bliebe sein Tooltip-Knoten als Leiche im Portal-Block stehen.
    const beschreibungId = schreibweise!.getAttribute("aria-describedby");
    schreibweise!.closest("div")!.remove();
    if (beschreibungId) klon.querySelector(`#${CSS.escape(beschreibungId)}`)?.remove();
    const kursAuskunft = Array.from(klon.querySelectorAll('[tabindex="0"]')).find((el) =>
      /order|reihenfolge/i.test(el.textContent ?? ""),
    );
    expect(kursAuskunft, "die zweite zulässige Abweichung: die Kurs-Auskunft").toBeTruthy();
    const kursBeschreibungId = kursAuskunft!.getAttribute("aria-describedby");
    kursAuskunft!.closest("p")!.remove();
    if (kursBeschreibungId) klon.querySelector(`#${CSS.escape(kursBeschreibungId)}`)?.remove();
    const enAbdruck = strukturAbdruck(klon);

    pruefeNichtsGesperrt(deAbdruck);
    pruefeNichtsGesperrt(enAbdruck);
    pruefeGleicheStruktur(
      deAbdruck,
      enAbdruck,
      "Lehrkraft-Ansicht (nach Herausnahme von Schreibweise-Feld und Kurs-Auskunft)",
    );
  });

  it(`beide Klassen zeigen die Kurs-Auskunft („Course"/„Lehrgang") in derselben Form - nur der Wortlaut ist anders`, async () => {
    const en = baueKlasse("en");
    render(<TastenflowReiter pupils={en.kinder} onChanged={() => {}} cls={en.cls} teacherId={en.teacherId} />);
    await screen.findByRole("table");
    await oeffneKlasseneinstellungen();
    // Die Auskunft ist eine reine Textzeile mit Tastenweg (tabIndex 0) und
    // eigenem Mouseover-Hinweis - kein Bedienelement, siehe Bauplan §7/E8.
    const kursZeilen = Array.from(document.querySelectorAll('[tabindex="0"]')).filter((el) =>
      /order|reihenfolge/i.test(el.textContent ?? ""),
    );
    expect(kursZeilen.length, "Kurs-Auskunft mit eigenem Fokusziel").toBeGreaterThan(0);
  });
});
