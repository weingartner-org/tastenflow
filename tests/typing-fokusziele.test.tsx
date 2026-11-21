/**
 * ★★★ FOKUSZIELE — jeder Schalter in „Tastenflow" weiß, wo es weitergeht.
 *
 * Grundregel (Johannes, 22.08.2026):
 *
 *   „Egal welchen Schalter ich betätige, das Programm soll wissen, wo es
 *   weitergeht - wo der Cursor stehen soll. Für Braillearbeiter extrem
 *   wichtig."
 *
 * Die Bestandsaufnahme dazu steht in `Sensorik/FOKUSZIELE-TASTENFLOW.md`; ihre
 * Tabelle 0.2 nummeriert 32 Stellen, an denen der Fokus bisher UNDEFINIERT war
 * oder von der Regel abwich. Diese Datei ist der Gegenpart: **eine Gruppe je
 * Nummer**, und in jeder Gruppe wird geprüft, wo `document.activeElement`
 * nach der Betätigung wirklich steht - nicht, ob irgendein Fokus-Aufruf im
 * Quelltext vorkommt.
 *
 * ── Wie hier gemessen wird ─────────────────────────────────────────────────
 * Fokus wird in diesem Haus grundsätzlich im NÄCHSTEN TAKT gesetzt
 * (`setTimeout(0)`, nie `requestAnimationFrame` -
 * [[feedback_fokus_pflicht_alle_apps]]), und der Weg in die Eingabezeile läuft
 * zusätzlich über ein Ereignis (`focusPracticeField` in
 * `src/lib/typing/focusField.ts`). Darum wartet jeder Test mit `waitFor` statt
 * sofort zu prüfen.
 *
 * Ansagen laufen über `speakUi`; die Funktion wird ersetzt, weil eine Ansage
 * sonst unbeobachtbar wäre. Sie geht im Betrieb über eine Live-Region auch auf
 * die Braillezeile - für die Zielgruppe ist sie der eigentliche Inhalt.
 *
 * ── Die Nummern in dieser Datei ────────────────────────────────────────────
 * Welle 1 (Regel R5, kein `disabled` unter dem Fokus): 5, 6, 7, 8.
 * Welle 2 (Öffnen/Schließen/Ansichtswechsel): 1, 2, 3, 4, 9, 10, 11, 14, 15,
 *   16, 20, 21, 22, 23, 27, 28.
 * Welle 3 (Dialoge, Feier, Bühne, Escape überall): 12, 13, 17, 18, 19, 31.
 * Welle 4 (Passwort, Nachrichten): 6 (Auto-Schließen), 24, 25.
 * Nicht umgesetzt und warum: 26, 29, 30, 32 stehen in der Tabelle
 *   ausdrücklich als „bleibt so" - sie werden hier festgehalten, damit
 *   niemand sie versehentlich „repariert".
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useEffect, useState } from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("../src/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("../src/lib/typing/voice")>();
  return { ...echt, speakUi: vi.fn(), speakUiAlways: vi.fn() };
});

import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { ohneBildschirmTastatur } from "./_typing-probelauf";
import { FARBEN_GESPERRT } from "../src/components/typing/KeyboardPanel";
import { UnlockCelebration } from "../src/components/typing/UnlockCelebration";
import { AutoCapHint } from "../src/components/typing/TypingSession";
import { LetterMap } from "../src/components/typing/LetterMap";
import { VoiceInstallHelp } from "../src/components/typing/VoiceInstallHelp";
import { LwMessageBell } from "../src/components/lernwerkstatt/LwMessageBell";
import { lwMessages } from "../src/lib/lernwerkstatt/messages";
import { ExpeditionStage } from "../src/components/typing/expedition/ExpeditionStage";
import { ChangeOwnPasswordCard } from "../src/components/typing/PasswordControls";
import { TypingAuth } from "../src/components/typing/TypingAuth";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { introGesehenMerken } from "../src/components/typing/IntroPodcast";
import { Modal } from "../src/components/Modal";
import { takePracticeFocusRequest } from "../src/lib/typing/focusField";
import {
  BADGES,
  clearFirstBadgeFocusRequest,
  computePupilStats,
  emptyProgress,
  recordEvent,
  saveAccountProgress,
  speakUi,
  typingBackend,
  useTypingA11y,
} from "../src/lib/typing";
import { PupilStatsPanel } from "../src/components/typing/PupilStatsPanel";
import { BadgeShelf } from "../src/components/typing/BadgeShelf";
import { useContrast } from "../src/lib/contrast";

const JANO = {
  id: "p-jano",
  role: "schueler" as const,
  name: "Jano",
  classCode: "5A3",
  stufe: "b" as const,
  createdAt: 1,
};

beforeEach(() => {
  // jsdom kennt scrollIntoView nicht - die Lektionsliste scrollt die aktive
  // Lektion beim Aufklappen mittig in den Blick.
  Element.prototype.scrollIntoView = () => {};
  localStorage.clear();
  // ⚠️ REIHENFOLGE-KOPPLUNG GEHEILT 24.08.2026 - bitte stehen lassen:
  // Die Vergrößerung des Tippfeldes lebt in einem zustand-Speicher, der EINMAL
  // beim Laden des Moduls aus dem localStorage gelesen wird. `localStorage.clear()`
  // leert also den Datenträger, aber NICHT den schon gebauten Speicher. Ein Test,
  // der bis zur größten Stufe klickt, vererbte diese Stufe damit an jeden
  // folgenden Test - und der Wächter „an der KLEINSTEN Stufe" fiel um, sobald
  // vitest die Tests in anderer Reihenfolge laufen ließ (`--sequence.shuffle`).
  useTypingA11y.getState().resetZoom();
  einrichtungFertigMerken();
  // ★★★ 08.09.2026 - die Bildschirm-Tastatur bleibt in dieser Datei AUS.
  //
  // Sie ist `aria-hidden`, also eine rein optische Hilfe, kostete in jsdom aber
  // den Löwenanteil der Laufzeit: Bei JEDEM Anschlag zeichnet sie rund fünfzig
  // eingefärbte Tasten neu (die nächste Taste wechselt ja), und zwar DOPPELT -
  // unsichtbare Messvorlage plus sichtbare Tastatur -, jede Taste mit einem
  // `style={{ borderColor, background }}`. jsdom schickt jede dieser Farben
  // durch seinen CSS-Parser. Im Browser ist das billig, in jsdom teuer.
  //
  // IN DIESEM ORDNER GEMESSEN (A/B im selben Prozess, Last 175):
  //     Tastatur AN : 148,5 / 56,3 ms je Anschlag
  //     Tastatur AUS: 5,3 ms je Anschlag        → 19-fach
  // CPU-Profil der reinen Tipp-Schleife mit Tastatur: 27,7 % für das Parsen von
  // CSS-Farben (`cssstyle` + `@asamuzakjp/css-color`), aber nur 2,9 % für den
  // Code, den dieser Test prüft. Ohne Tastatur fällt `cssstyle` auf 0,9 %.
  //
  // Abgeschaltet wird über denselben Schalter, den ein Kind in den
  // Einstellungen hat. Kein Test in dieser Datei fasst die Tastatur an.
  //
  // ⚠️ Nebenwirkung mit Ansage: Eine fehlerfreie Runde OHNE Tastatur verdient
  // das Abzeichen „Blindflug" (`badges.ts`). Keine Zusicherung hier baut auf
  // der Liste der verdienten Abzeichen auf.
  //
  // Volle Begründung samt Messwerten - auch, warum gefälschte Zeitgeber KEIN
  // Ausweg sind: `tests/_typing-probelauf.ts`.
  ohneBildschirmTastatur();
  // Die Willkommens-Karte oeffnet sich beim ALLERERSTEN Start von selbst. Fuer
  // diese Tests gilt der Normalfall: Sie ist gesehen, die Karte ist zu, und der
  // Schalter „Einfuehrung" im Zahnrad OEFFNET sie (Nr 1).
  introGesehenMerken();
  useTypingAuth.setState({ account: null });
  // Eine Fokus-Anforderung, die ein früherer Test offen gelassen hat, würde
  // hier still eingelöst - sie gilt 5 Sekunden (focusField.ts).
  takePracticeFocusRequest();
  // Dasselbe für die Abzeichen-Anforderung (§0.5, focusStats.ts): Sie gilt
  // ebenfalls 5 Sekunden und risse sonst im nächsten Test den Fokus an sich.
  clearFirstBadgeFocusRequest();
  vi.mocked(speakUi).mockClear();
});
afterEach(cleanup);

/** Die Seite mit angemeldetem Kind. */
function zeigeSeite(account: typeof JANO | null = JANO) {
  useTypingAuth.setState({ account });
  render(
    <MemoryRouter>
      <TippenTrainerPage />
    </MemoryRouter>,
  );
}

/** Das Übungsfeld der Tipp-Sitzung. */
function feld(): HTMLElement | null {
  return document.querySelector('[data-typing-field="practice"]');
}

async function warteAufFeldFokus() {
  await waitFor(() => expect(document.activeElement).toBe(feld()));
}

/** Alle Ansagen dieses Tests als eine Zeichenkette (für `toContain`). */
function ansagen(): string {
  return vi
    .mocked(speakUi)
    .mock.calls.map((c) => String(c[0]))
    .join(" | ");
}

/* ═════════════════════════════════════════════════════════════════════════
   WELLE 1 — Regel R5: kein Schalter sperrt sich unter dem Fokus
   ═════════════════════════════════════════════════════════════════════════ */

/**
 * Die Zoom-Knöpfe stehen seit 25.08.2026 in den EINSTELLUNGEN (Gruppe
 * „Anzeige") statt in einer Leiste über dem Übungsfeld — dort war eine
 * Einmal-Einstellung auf dem besten Platz der Seite. Die Regel R5 gilt
 * unverändert, nur der Weg dorthin ist ein anderer.
 */
async function oeffneEinstellungen() {
  const zahnrad = await screen.findByRole("button", { name: /^Einstellungen/ });
  fireEvent.click(zahnrad);
}

describe("Nr 7 — Zoom an der Grenze sperrt sich nicht, sondern sagt es", () => {
  it("★★ »Übungsfeld kleiner« bleibt an der kleinsten Stufe fokussierbar", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    await oeffneEinstellungen();
    const kleiner = await screen.findByRole("button", { name: "Übungsfeld kleiner" });
    // Seit 13.11.2026 liegen vier Stufen unter der Grundgrösse - bis an den
    // Anschlag verkleinern (frischer Browser startet bei 100 %).
    for (let i = 0; i < 10; i++) fireEvent.click(kleiner);
    await waitFor(() => expect(kleiner).toHaveAttribute("aria-disabled", "true"));
    vi.mocked(speakUi).mockClear();
    // ★ Der Kern der Regel: Der Knopf ist NICHT `disabled` und damit Tabstopp.
    expect(kleiner).not.toHaveAttribute("disabled");
    kleiner.focus();
    expect(document.activeElement).toBe(kleiner);
    fireEvent.click(kleiner);
    // Der Fokus bleibt, wo er war - vorher fiel er auf `body`.
    expect(document.activeElement).toBe(kleiner);
    expect(ansagen()).toContain("Kleinste Größe erreicht.");
  });

  it("★ »Übungsfeld größer« sagt an der größten Stufe, warum nichts geschieht", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    await oeffneEinstellungen();
    const groesser = await screen.findByRole("button", { name: "Übungsfeld größer" });
    // Bis an den Anschlag vergrößern (zehn Stufen, ein Klick je Stufe).
    for (let i = 0; i < 20; i++) fireEvent.click(groesser);
    await waitFor(() => expect(groesser).toHaveAttribute("aria-disabled", "true"));
    groesser.focus();
    vi.mocked(speakUi).mockClear();
    fireEvent.click(groesser);
    expect(document.activeElement).toBe(groesser);
    expect(ansagen()).toContain("Größte Größe erreicht.");
  });
});

describe("Nr 8 — »Finger-Farben« im Kontrast-Modus", () => {
  /**
   * ★ 25.08.2026: Der Schalter steht nicht mehr unter der Tastatur, sondern in
   * den Einstellungen (Gruppe „Anzeige") - eine Einmal-Entscheidung gehört
   * nicht unter das Übungsfeld. Die Regel R5 gilt unverändert: In den
   * Kontrast-Modi sperrt er sich NICHT, er sagt, warum nichts geschieht.
   */
  async function zeigeSchalter(kontrastModus: "hell" | "sw") {
    useContrast.setState({ mode: kontrastModus });
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    await oeffneEinstellungen();
    return await screen.findByRole("button", { name: /^Finger-Farben/ });
  }

  it("★★ der Schalter bleibt Tabstopp und trägt die Begründung", async () => {
    const schalter = await zeigeSchalter("sw");
    expect(schalter).toHaveAttribute("aria-disabled", "true");
    expect(schalter).not.toHaveAttribute("disabled");
    // Die Begründung hängt fest daran - nicht bloß im `title`, den keine
    // Sprachausgabe verlässlich liest.
    // ★ K2 (19.09.2026): der Schalter trägt seither ZWEI Ids - den `Tipp`-Kasten
    // (fehlte hier bisher, siehe Test weiter unten) UND den Sperrgrund; die
    // Begründung steckt in einer der beiden.
    const roh = schalter.getAttribute("aria-describedby");
    expect(roh).toBeTruthy();
    const texte = roh!.split(/\s+/).map((id) => document.getElementById(id)?.textContent);
    expect(texte).toContain(FARBEN_GESPERRT);
  });

  it("★ ein Versuch ändert nichts und wird angesagt", async () => {
    const schalter = await zeigeSchalter("sw");
    const vorher = useTypingA11y.getState().fingerFarben;
    schalter.focus();
    fireEvent.click(schalter);
    expect(useTypingA11y.getState().fingerFarben).toBe(vorher);
    expect(document.activeElement).toBe(schalter);
    expect(ansagen()).toContain(FARBEN_GESPERRT);
  });

  it("erlaubt der Kontrast-Modus Farben, wirkt der Schalter ganz normal", async () => {
    const schalter = await zeigeSchalter("hell");
    expect(schalter).not.toHaveAttribute("aria-disabled", "true");
    // ★ K2 (19.09.2026): Der Schalter war hier bisher OHNE `aria-describedby`
    // - der `Tipp`-Kasten stand nur mausseitig da (Befund beim
    // Mouseover-Vollaudit, `Tipp.tsx` verlangt die Verdrahtung überall sonst
    // auch). Jetzt zeigt sie auf den normalen Erklärsatz, nicht mehr auf gar
    // nichts.
    const id = schalter.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    const kasten = document.getElementById(id!);
    expect(kasten?.getAttribute("role")).toBe("tooltip");
    expect(kasten?.textContent).toBe("Tasten in der Farbe des Fingers, der sie drückt.");
    const vorher = useTypingA11y.getState().fingerFarben;
    fireEvent.click(schalter);
    expect(useTypingA11y.getState().fingerFarben).toBe(!vorher);
  });
});

describe("Nr 6 — »Passwort ändern« sperrt seinen eigenen Knopf nicht mehr", () => {
  it("★★ leere Felder: der Knopf bleibt Tabstopp und sagt, was fehlt", async () => {
    render(<ChangeOwnPasswordCard minLen={4} tone="du" immerOffen />);
    const knopf = screen.getByRole("button", { name: "Passwort ändern" });
    expect(knopf).toHaveAttribute("aria-disabled", "true");
    expect(knopf).not.toHaveAttribute("disabled");
    knopf.focus();
    fireEvent.click(knopf);
    expect(document.activeElement).toBe(knopf);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      /Bitte alle drei Felder ausfüllen/,
    );
  });

  it("★★ nach dem Ändern bleibt der Fokus auf dem Knopf (er verschwindet nicht)", async () => {
    const change = vi.fn().mockResolvedValue({ ok: true, value: true });
    render(<ChangeOwnPasswordCard minLen={4} tone="du" change={change} immerOffen />);
    fireEvent.change(screen.getByLabelText("Aktuelles Passwort"), {
      target: { value: "alt1" },
    });
    fireEvent.change(screen.getByLabelText("Neues Passwort"), {
      target: { value: "neu12345" },
    });
    fireEvent.change(screen.getByLabelText("Neues Passwort wiederholen"), {
      target: { value: "neu12345" },
    });
    const knopf = screen.getByRole("button", { name: "Passwort ändern" });
    knopf.focus();
    fireEvent.click(knopf);
    await screen.findByRole("status");
    expect(change).toHaveBeenCalledWith("alt1", "neu12345");
    // Vorher war der Knopf hier DOPPELT gesperrt: erst durch `busy`, danach
    // durch die geleerten Felder - der Fokus hatte kein Ziel mehr.
    expect(knopf).not.toHaveAttribute("disabled");
    expect(document.activeElement).toBe(knopf);
  });
});

describe("Nr 5 — die Anmeldung endet in der Eingabezeile", () => {
  it("★★ der Abschick-Knopf sperrt sich nicht und sagt »Wird gesendet«", async () => {
    let loesen: ((a: { ok: false; error: string }) => void) | undefined;
    const spion = vi
      .spyOn(typingBackend(), "loginTeacher")
      .mockImplementation(
        () => new Promise((res) => { loesen = res as typeof loesen; }) as never,
      );
    try {
      render(
        <MemoryRouter>
          <TypingAuth onCancel={() => {}} />
        </MemoryRouter>,
      );
      // Erst den Anfangsfokus des Formulars abwarten (Nr 4) - er kommt einen
      // Takt später und würde sonst mitten im Test dazwischenfunken.
      await waitFor(() =>
        expect(document.activeElement).toBe(
          screen.getByRole("button", { name: "Lernende" }),
        ),
      );
      fireEvent.click(screen.getByRole("button", { name: "Lehrkraft" }));
      fireEvent.change(screen.getByLabelText("E-Mail"), {
        target: { value: "a@b.c" },
      });
      fireEvent.change(screen.getByLabelText("Passwort"), {
        target: { value: "geheim" },
      });
      const knopf = screen.getByRole("button", { name: "Anmelden" });
      knopf.focus();
      fireEvent.click(knopf);
      const wartend = await screen.findByRole("button", { name: /Bitte warten/ });
      expect(wartend).toHaveAttribute("aria-disabled", "true");
      expect(wartend).not.toHaveAttribute("disabled");
      // ★ Der Fokus bleibt auf dem Knopf - bisher fiel er auf `body`.
      expect(document.activeElement).toBe(wartend);
      expect(ansagen()).toContain("Wird gesendet");
      loesen?.({ ok: false, error: "Das stimmt so nicht." });
      // Fehler: der Fokus bleibt auf dem Knopf, die Meldung liest `role=alert`.
      await screen.findByRole("alert");
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Anmelden" }),
      );
    } finally {
      spion.mockRestore();
    }
  });

  it("★★★ Erfolg: Ansage mit Namen und Fokus in die Eingabezeile", async () => {
    zeigeSeite(null);
    await screen.findByRole("heading", { name: /Mein Training/i });
    // Die Anmeldung erscheint an der Stelle der Übungskarte.
    fireEvent.click(screen.getByRole("button", { name: /^Konto/ }));
    await screen.findByRole("button", { name: "Lehrkraft" });
    vi.mocked(speakUi).mockClear();
    // Was der Server tut, ist hier gleich: geprüft wird, was die Seite tut,
    // wenn ein Konto ankommt.
    act(() => useTypingAuth.setState({ account: JANO }));
    await waitFor(() => expect(ansagen()).toContain("Angemeldet als Jano."));
    await warteAufFeldFokus();
  });
});

/* ═════════════════════════════════════════════════════════════════════════
   WELLE 2 — Öffnen, Schließen, Ansichtswechsel
   ═════════════════════════════════════════════════════════════════════════ */

describe("Nr 1 — »Einführung« im Zahnrad (Johannes' eigenes Beispiel)", () => {
  it("★★★ AN: der Fokus steht auf dem Start-Knopf der Podcast-Karte", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    // Das Zahnrad aufklappen, dort steht der Schalter „Einführung".
    fireEvent.click(screen.getByRole("button", { name: /^Einstellungen/i }));
    const schalter = await screen.findByRole("button", { name: /Einführung/ });
    fireEvent.click(schalter);
    // Der Start-Knopf der Karte („▶ …"), nicht der Schalter im Zahnrad.
    await waitFor(() => {
      const start = document.activeElement as HTMLElement | null;
      expect(start?.tagName).toBe("BUTTON");
      expect(start?.textContent ?? "").toContain("▶");
    });
    expect(ansagen()).toContain("Einführungs-Podcast geöffnet.");
  });

  it("★ AUS: der Fokus bleibt auf dem Schalter (R3)", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /^Einstellungen/i }));
    const schalter = await screen.findByRole("button", { name: /Einführung/ });
    fireEvent.click(schalter);
    await waitFor(() => expect(document.activeElement).not.toBe(schalter));
    schalter.focus();
    fireEvent.click(schalter);
    // Nichts zieht den Fokus weg - der Schalter steht ja weiterhin da.
    await waitFor(() => expect(schalter).toHaveAttribute("aria-pressed", "false"));
    expect(document.activeElement).toBe(schalter);
  });
});

/* ═════════════════════════════════════════════════════════════════════════
   NACHTRAG §0.5 (Johannes, 22.08.2026, 20:30) — die Statistik gehört den
   Abzeichen

   ⚠️ HIER STAND EINMAL ETWAS ANDERES. Die Gruppe hieß bis zum 28.08.2026
   „Nr 2 - »Meine Statistik« landet auf ihrer Überschrift" und prüfte genau
   das. Diese Erwartung ist nicht falsch geprüft worden, sie ist ÜBERHOLT:
   Johannes hat seine eigene Entscheidung vom Nachmittag am selben Abend
   geändert (`Sensorik/FOKUSZIELE-TASTENFLOW.md` §0.5):

     „Beim Öffnen von ‚Meine Statistik' steht der Fokus auf dem ERSTEN
     Abzeichen (oben links), nicht auf der Überschrift - die Abzeichen sind
     extrem wichtig für die Kinder."

   Die Überschrift bleibt als Anker bestehen und ist der LETZTE HALT der
   Rangfolge (`src/lib/typing/focusStats.ts`); der Rückweg ist unverändert
   die Eingabezeile.
   ═════════════════════════════════════════════════════════════════════════ */

/** Ein Kind mit Übungen und (wahlweise) verdienten Abzeichen ausstatten. */
function jano(opts: { abzeichen?: string[]; uebungen?: number } = {}) {
  const { abzeichen = [], uebungen = 3 } = opts;
  saveAccountProgress(JANO.id, {
    ...emptyProgress(),
    badges: Object.fromEntries(abzeichen.map((id) => [id, 1751900000000])),
  });
  for (let i = 0; i < uebungen; i++)
    recordEvent(JANO.id, {
      ts: 1751900000000 + i * 60_000,
      lesson: "adaptiv",
      chars: 40,
      errors: 1,
      ms: 60_000,
      activeMs: 60_000,
    });
}

/** Das Element, auf dem der Fokus steht, mit seinem Rang im Abzeichen-Regal. */
function fokusRang(): string | undefined {
  return (document.activeElement as HTMLElement | null)?.dataset.abzeichenFokus;
}

describe("Nr 2 (§0.5) — »Meine Statistik« landet auf dem ersten Abzeichen", () => {
  it("★★★ über das Konto-Menü: Fokus auf dem ersten verdienten Abzeichen", async () => {
    jano({ abzeichen: ["tasten-kueken", "volltreffer"] });
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /Mein Konto: Jano/ }));
    fireEvent.click(await screen.findByRole("button", { name: "Meine Statistik" }));
    await waitFor(() => expect(fokusRang()).toBe("verdient"));
    // Es ist das ERSTE der Vitrine, nicht irgendeines.
    const alle = document.querySelectorAll('[data-abzeichen-fokus="verdient"]');
    expect(alle.length).toBe(2);
    expect(document.activeElement).toBe(alle[0]);
  });

  it("★★★ die Ansage nennt beides: »Meine Statistik. Deine Abzeichen.«", async () => {
    jano({ abzeichen: ["tasten-kueken"] });
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyS", altKey: true });
    await waitFor(() => expect(fokusRang()).toBe("verdient"));
    // Den Namen des Abzeichens sagt der Knopf selbst an - er steht im Fokus.
    // (In Janos Tonlage heißt „tasten-kueken" nicht „Tasten-Küken", sondern
    // „Erste Runde" - der Name hängt an der Textstufe, badgeName/Skin.)
    expect(ansagen()).toContain("Meine Statistik. Deine Abzeichen.");
    expect(document.activeElement?.textContent).toContain("Erste Runde");
  });

  it("★★★ DER EIGENTLICHE BEWEIS: die Daten treffen erst verzögert ein", async () => {
    // Das ist der Fall, an dem ein naives `setTimeout(0)` scheitert: Die
    // Statistik zeigt zuerst „Lädt …", im nächsten Takt gibt es noch gar kein
    // Abzeichen. Die Anforderung aus `focusStats.ts` bleibt offen, bis das
    // Regal sie beim Erscheinen selbst einlöst.
    jano({ abzeichen: ["tasten-kueken"] });
    const be = typingBackend();
    const echt = be.getProgress.bind(be);
    const langsam = vi
      .spyOn(be, "getProgress")
      .mockImplementation(async (id: string) => {
        await new Promise((r) => setTimeout(r, 80));
        return echt(id);
      });
    try {
      zeigeSeite();
      await screen.findByRole("heading", { name: /Mein Training/i });
      fireEvent.keyDown(document, { code: "KeyS", altKey: true });
      // Solange geladen wird, steht die Vitrine noch nicht.
      expect(document.querySelector('[data-abzeichen-fokus="verdient"]')).toBeNull();
      await waitFor(() => expect(fokusRang()).toBe("verdient"));
    } finally {
      langsam.mockRestore();
    }
  });

  it("★★ noch kein Abzeichen verdient: der Fokus geht auf das erste »nächste Ziel«", async () => {
    // Rang 2 der Rangfolge - wer noch keines hat, steht genau dort, wo das
    // nächste zu holen ist.
    jano({ abzeichen: [] });
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyS", altKey: true });
    await waitFor(() => expect(fokusRang()).toBe("ziel"));
  });

  it("★★ ohne jede Übung bleibt die Überschrift der letzte Halt - nie »body«", async () => {
    // Rang 4: Ohne Übungen zeigt die Statistik gar kein Abzeichen-Regal,
    // sondern nur „Sobald du ein bisschen geübt hast …".
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyS", altKey: true });
    await waitFor(() =>
      expect(document.activeElement).toBe(
        document.getElementById("tippen-statistik-titel"),
      ),
    );
  });

  it("★★ Alt + S: hin zum Abzeichen, zurück ins Tippfeld", async () => {
    jano({ abzeichen: ["tasten-kueken"] });
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyS", altKey: true });
    await waitFor(() => expect(fokusRang()).toBe("verdient"));
    fireEvent.keyDown(document, { code: "KeyS", altKey: true });
    await warteAufFeldFokus();
  });
});

/**
 * Die zweite Hälfte von §0.5: Der Fokus steht auf dem ersten Abzeichen - von
 * dort aus springt das Kind mit der Screenreader-Taste „h" weiter. Das setzt
 * eine lückenlose Gliederung voraus: h2 → h3 (→ h4), keine Ebene übersprungen,
 * und in Johannes' Reihenfolge „Abzeichen → Wochenziel → Übezeiten → …".
 */
describe("§0.5 — die Statistik ist für die Screenreader-Taste »h« gegliedert", () => {
  /** Alle Überschriften der Statistik-Karte, in der Reihenfolge der Seite. */
  function ueberschriften(): Array<{ ebene: number; text: string }> {
    const karte = document
      .getElementById("tippen-statistik-titel")
      ?.closest("div.card");
    if (!karte) throw new Error("Die Statistik-Karte steht nicht auf der Seite.");
    return [...karte.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
      ebene: Number(h.tagName[1]),
      text: (h.textContent ?? "").replace(/\s+/g, " ").trim(),
    }));
  }

  it("★★★ Wochenziele, Werte, Abzeichen, Steigerung, Tasten-Stand - ohne Lektionen", async () => {
    /*
      ⚠️ NEU GEORDNET am 11.09.2026 (Umbauplan §2.4) und wieder am 19.09.2026.
      Bis zum 11.09. stand hier „Wochenziel, geübte Zeit … und die Abzeichen
      ganz zum Schluss" (Entscheidung vom 01.09.2026, Johannes: *„gib in der
      Schülerübersicht den Bereich der Abzeichen ganz nach unten"*). Der Umbau
      vom 11.09. ordnete neu: die geübte Zeit ist kein eigener Block mehr
      (ihre zwei Zahlen stehen in „Werte im Überblick"), und die Abzeichen
      stehen wieder vor den Tippchallenges.

      ★★★ 19.09.2026, Johannes: *„gib die Steigerung im Verlauf unter die
      Tippchallenges; entferne den Bereich Lektionen, den versteht jetzt
      niemand mehr"* - die Abzeichen rücken damit VOR die Steigerung, und
      „Lektionen" gibt es nicht mehr. (Eine Tippchallenge hat Jano hier
      nicht; die Ordnung MIT ihr prüft
      `tastenflow-meine-statistik-ordnung.test.tsx`.)

      ★★★ Wochenziele, Steigerung im Verlauf und Tasten-Stand sind
      `<details>` - ihre Überschrift steht IN der `<summary>` und bleibt damit
      eine Sprungmarke für die Taste „h" (Prüfung E4: der Bauer hatte zwei
      h3 entfernt, damit wäre der Weg mit „h" an zwei Blöcken vorbeigelaufen).

      Der Wächter bleibt - er misst weiter, dass die Gliederung eine feste,
      mit der Screenreader-Taste »h« begehbare Reihenfolge hat. Ohne ihn käme
      ein alter Aufbau beim nächsten Umbau unbemerkt zurück.
    */
    jano({ abzeichen: ["tasten-kueken"] });
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyS", altKey: true });
    await waitFor(() => expect(fokusRang()).toBe("verdient"));
    const h = ueberschriften();
    expect(h[0]).toEqual({ ebene: 2, text: "Meine Statistik" });
    expect(h[1].ebene).toBe(3);
    expect(h[1].text).toContain("Wochenziele");
    expect(h[2].ebene).toBe(3);
    expect(h[2].text).toContain("Werte im Überblick");
    // Die Abzeichen stehen VOR der Steigerung (19.09.2026).
    expect(h[3].ebene).toBe(3);
    expect(h[3].text).toContain("Meine Abzeichen");
    expect(h[4].ebene).toBe(3);
    expect(h[4].text).toContain("Steigerung im Verlauf");
    expect(h[5]).toEqual({ ebene: 3, text: "Tasten-Stand" });
    // Tasten-Stand steht genau EINMAL da - die Tastenkarte bringt in der
    // Klappe keine zweite Überschrift mit.
    expect(h.filter((x) => x.text === "Tasten-Stand")).toHaveLength(1);
    // Kein Lektionen-Block mehr (Johannes 19.09.2026).
    expect(h.some((x) => x.text.includes("Lektionen"))).toBe(false);
  });

  it("★★★ keine Ebene wird übersprungen - auch nicht mit aufgeklappten Familien", async () => {
    jano({ abzeichen: ["tasten-kueken"] });
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyS", altKey: true });
    await waitFor(() => expect(fokusRang()).toBe("verdient"));
    // Erst zugeklappt, dann mit allen Abzeichen-Familien (h4).
    for (const durchgang of ["zu", "auf"]) {
      if (durchgang === "auf")
        fireEvent.click(
          screen.getByRole("button", { name: /Alle Abzeichen anzeigen/ }),
        );
      const h = ueberschriften();
      expect(h.length, durchgang).toBeGreaterThan(3);
      expect(h[0].ebene, durchgang).toBe(2);
      for (let i = 1; i < h.length; i++)
        expect(
          h[i].ebene,
          `${durchgang}: „${h[i].text}" (h${h[i].ebene}) folgt auf „${h[i - 1].text}" (h${h[i - 1].ebene})`,
        ).toBeLessThanOrEqual(h[i - 1].ebene + 1);
    }
    // Die Familien liegen wirklich eine Ebene tiefer, nicht daneben.
    expect(ueberschriften().some((x) => x.ebene === 4)).toBe(true);
  });

  it("★★ die Blöcke sagen ihre Auskunft EINMAL, nicht zweimal", async () => {
    // Bis 28.08.2026 trugen die geübte Zeit und die Werte-Kacheln nur ein
    // `aria-label` und gar keine Überschrift. Jetzt hängen Gruppe und Liste per
    // `aria-labelledby` an der Überschrift - ein Name, nicht zwei.
    // ⚠️ Der eigene Block „Geübte Zeit" ist seit dem Umbau vom 11.09.2026 weg
    // (C2) - seine zwei Zahlen (Deutsch/Englisch) stehen jetzt als Zeilen in
    // „Werte im Überblick". Der Wächter prüft darum nur noch die Liste.
    jano({ abzeichen: ["tasten-kueken"] });
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyS", altKey: true });
    await waitFor(() => expect(fokusRang()).toBe("verdient"));
    const werte = screen.getByRole("list", { name: "Deine Werte im Überblick" });
    expect(werte.getAttribute("aria-label")).toBeNull();
  });

  it("★★ die Lehrkraft-Sicht bleibt auf derselben Ebene (h3 unter ihrem h2)", () => {
    // Dieselbe Komponente zeigt der Lehrkraft die Statistik eines Kindes
    // (`TastenflowReiter`), und darüber steht dort `h2 „Stand in Tastenflow"`.
    // Solange dieser Baustein NUR h3/h4 mitbringt, geht die Gliederung in
    // beiden Sichten auf - eine steuerbare Ebene braucht es nicht.
    render(
      <PupilStatsPanel
        data={{
          pupil: JANO,
          progress: emptyProgress(),
          events: [],
          stats: computePupilStats([]),
        }}
      />,
    );
    const ebenen = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) =>
      Number(h.tagName[1]),
    );
    expect(ebenen.length).toBeGreaterThan(3);
    expect(Math.min(...ebenen)).toBe(3);
    expect(Math.max(...ebenen)).toBeLessThanOrEqual(4);
    // Und die Ich-Tonlage bleibt der Schüler-Sicht vorbehalten (Sie/Du-Regel).
    // ⚠️ „Geübte Zeit" ist seit dem 11.09.2026 kein eigener Block mehr (C2).
    expect(screen.getByRole("heading", { name: "Werte im Überblick" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /^Meine Abzeichen|^Abzeichen/ })).toBeTruthy();
  });
});

describe("Nr 3 — »Abmelden« gibt den Fokus an »Konto«", () => {
  it("★★ der Knopf an derselben Stelle bekommt ihn, mit Ansage", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /Mein Konto: Jano/ }));
    fireEvent.click(await screen.findByRole("button", { name: "Abmelden" }));
    const anmelden = await screen.findByRole("button", {
      name: /^Konto/,
    });
    await waitFor(() => expect(document.activeElement).toBe(anmelden));
    expect(ansagen()).toContain("Abgemeldet.");
  });
});

describe("Nr 4 — »Konto« gibt den Fokus in das Formular", () => {
  it("★★ der aktive Rollen-Knopf bekommt ihn, obwohl der Auslöser stehen bleibt", async () => {
    zeigeSeite(null);
    await screen.findByRole("heading", { name: /Mein Training/i });
    const ausloeser = screen.getByRole("button", { name: /^Konto/ });
    ausloeser.focus();
    fireEvent.click(ausloeser);
    const rolle = await screen.findByRole("button", { name: "Lernende" });
    await waitFor(() => expect(document.activeElement).toBe(rolle));
  });
});

describe("Nr 23 — der Wechsel Anmelden ⇄ Konto erstellen sagt die neue Maske an", () => {
  it("★ der Fokus bleibt auf dem Knopf (R3), die Felder werden genannt", async () => {
    render(
      <MemoryRouter>
        <TypingAuth onCancel={() => {}} />
      </MemoryRouter>,
    );
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Lernende" }),
      ),
    );
    fireEvent.click(screen.getByRole("button", { name: "Lehrkraft" }));
    const wechsel = screen.getByRole("button", { name: "Zur Konto-Erstellung wechseln" });
    wechsel.focus();
    fireEvent.click(wechsel);
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Zur Anmeldung wechseln" }),
    );
    expect(ansagen()).toContain(
      "Konto erstellen: Name, E-Mail, Passwort, Wiederholung.",
    );
    fireEvent.click(screen.getByRole("button", { name: "Zur Anmeldung wechseln" }));
    expect(ansagen()).toContain("Anmelden: E-Mail, Passwort.");
  });
});

describe("Nr 15 — Alt + H und Alt + T schließen wie Escape", () => {
  it("★★ Alt + H: auf in die Hilfe, zu ins Tippfeld", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyH", altKey: true });
    const zu = await screen.findByRole("button", { name: /Hilfe schließen/ });
    await waitFor(() => expect(document.activeElement).toBe(zu));
    fireEvent.keyDown(document, { code: "KeyH", altKey: true });
    await warteAufFeldFokus();
  });

  it("★★ Alt + T: auf in die Kürzel-Liste, zu ins Tippfeld", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyT", altKey: true });
    await screen.findByRole("dialog", { name: /Tastenkürzel in Tastenflow/ });
    fireEvent.keyDown(document, { code: "KeyT", altKey: true });
    await warteAufFeldFokus();
  });
});

describe("Nr 14 — die Hilfe gibt den Fokus nur EINMAL zurück", () => {
  it("★★★ Lehrer-Hilfe: kein Zwischenhalt auf dem ❓-Knopf, nur das Tippfeld", async () => {
    zeigeSeite({ ...JANO, role: "lehrkraft" as const, name: "Frau Berger" } as never);
    // Bei einer Lehrkraft steht die Lehrer-Hilfe hinter demselben Knopf.
    const hilfe = await screen.findByRole("button", { name: /Hilfe/ });
    hilfe.focus();
    fireEvent.click(hilfe);
    const zu = await screen.findByRole("button", { name: /Hilfe schließen/ });
    await waitFor(() => expect(document.activeElement).toBe(zu));
    // ★ Die WEGSTRECKE mitschreiben, nicht nur das Ende: Bis zum 22.08.2026
    // lief der Fokus erst zurück auf den ❓-Knopf (`restoreFocus`) und erst
    // danach ins Tippfeld. Das Ende stimmte, der Weg nicht - auf der
    // Braillezeile sind das zwei Sprünge, und der zweite löscht den ersten,
    // bevor jemand ihn gelesen hat.
    const weg: EventTarget[] = [];
    const horcher = (e: Event) => weg.push(e.target as EventTarget);
    document.addEventListener("focusin", horcher);
    try {
      fireEvent.click(zu);
      await warteAufFeldFokus();
      expect(weg).not.toContain(hilfe);
    } finally {
      document.removeEventListener("focusin", horcher);
    }
  });
});

describe("Nr 20 — »Tasten erkunden« bringt den Fokus selbst zurück", () => {
  // ★ 30.08.2026: Der Modus hört auf Alt + 3 statt auf Alt + K. Alt + 3 war
  //   seit dem 07.08. schon der AUSGANG; jetzt ist es auch der Eingang. Alt + K
  //   gehört seither dem Farbschalter der Kopfzeile
  //   (`src/lib/shortcuts.ts`). Der Wächter prüft unverändert dasselbe: dass
  //   der Fokus bei JEDEM Ausweg in der Eingabezeile landet.
  //   ⚠️ Das Öffnen läuft über die Seite (`document`), das Schließen fängt der
  //   Baustein selbst im Capture ab - beide Male dieselbe Taste.
  it("★★ auch über Alt + 3, das die Seite öffnet (das Schließen tut der Baustein)", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "Digit3", altKey: true });
    await screen.findByRole("button", { name: "Beenden" });
    fireEvent.keyDown(document, { code: "Digit3", altKey: true });
    await warteAufFeldFokus();
  });

  // ★ 13.09.2026: Alt + 4 öffnet dasselbe Fenster direkt in „Tasten finden".
  //   Geschlossen wird es wie immer im Baustein - der Rückweg bleibt derselbe.
  it("★★ auch über Alt + 4, das die Seite direkt in „Tasten finden“ öffnet", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "Digit4", altKey: true });
    const finden = await screen.findByRole("button", { name: "Tasten finden" });
    expect(finden.getAttribute("aria-pressed")).toBe("true");
    fireEvent.keyDown(document, { code: "Digit3", altKey: true });
    await warteAufFeldFokus();
  });

  it("★ und über den Knopf »Beenden«", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "Digit3", altKey: true });
    fireEvent.click(await screen.findByRole("button", { name: "Beenden" }));
    await warteAufFeldFokus();
  });
});

describe("Nr 27 / Nr 28 — Übungsart und Vorlesen im Zahnrad", () => {
  it("★★ Alt + B holt den Fokus ausdrücklich ins Tippfeld", async () => {
    // ★ E7 (19.09.2026): „Lektionen" ist weg - reihum geht es jetzt Mein
    // Training → Geschichten → Wortspiele → Mein Training. Die Bücherei setzt
    // ihr eigenes Ziel (Nr 9); ins Tippfeld führt der Weg zurück zu „Mein
    // Training", darum einmal ganz herum.
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.keyDown(document, { code: "KeyB", altKey: true });
    fireEvent.keyDown(document, { code: "KeyB", altKey: true });
    await screen.findByRole("heading", { name: /Wortspiele/i });
    // Fokus bewusst weg vom Feld.
    screen.getByRole("button", { name: /Kurztasten/ }).focus();
    fireEvent.keyDown(document, { code: "KeyB", altKey: true });
    await warteAufFeldFokus();
  });

  it("★ die Übungsart schließt das Fenster und führt ins Übungsfeld (R3)", async () => {
    /*
      ⚠️ 07.09.2026 GEÄNDERT. Vorher hieß dieser Test „die Übungsart-Knöpfe im
      Zahnrad behalten den Fokus" - richtig, solange die Einstellungen ein
      Streifen unter der Kopfzeile waren: Der Knopf blieb stehen, und das
      Ergebnis stand darunter.

      Seit sie ein FENSTER sind (Johannes 07.09.), geht das nicht mehr auf.
      Die Übungsart ist die einzige Einstellung, die sofort etwas anderes auf
      den Bildschirm bringt - und dieses Andere stünde hinter dem Dialog. Der
      Knopf kann seinen Fokus also gar nicht behalten; er verschwindet.

      R3 ist damit nicht verletzt, sondern erfüllt: Was verschwindet, braucht
      ein Ziel - und das Ziel ist das Übungsfeld, wie bei jedem anderen Weg
      aus diesem Fenster heraus.
      ★ Die Bücherei ist die Ausnahme: Sie setzt ihr eigenes Ziel (Nr 9).
    */
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /^Einstellungen/i }));
    // ★ E7 (19.09.2026): statt „Lektionen" (entfallen) der Knopf „Mein
    // Training" - auch er schliesst das Fenster und führt ins Übungsfeld.
    const training = await screen.findByRole("button", { name: "Mein Training" });
    training.focus();
    fireEvent.click(training);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await warteAufFeldFokus();
  });

  it("★ »Vorlesen an« nennt die fünf Bedienelemente, die darunter erscheinen", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /^Einstellungen/i }));
    const knopf = await screen.findByRole("button", { name: /Vorlesen a[nu]s?/ });
    knopf.focus();
    fireEvent.click(knopf);
    expect(document.activeElement).toBe(knopf);
    expect(ansagen()).toContain(
      "Vorlesen an: Buchstaben, Wörter, Sätze, Tempo und Stimme darunter.",
    );
  });
});

describe("Nr 21 / Nr 22 — die Schüler-Anmeldung führt in beide Richtungen", () => {
  function zeigeAnmeldung(klassenCode = "") {
    if (klassenCode) localStorage.setItem("tippen-trainer:lastClassCode", klassenCode);
    render(
      <MemoryRouter>
        <TypingAuth onCancel={() => {}} />
      </MemoryRouter>,
    );
  }

  it("★★ Nr 22: das Häkchen AUS führt zurück ins erste Feld des Klassen-Wegs", async () => {
    zeigeAnmeldung();
    const haken = await screen.findByRole("checkbox", {
      name: /Ich übe allein, ohne Klasse und ohne Lehrkraft/,
    });
    fireEvent.click(haken);
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByLabelText("E-Mail-Adresse")),
    );
    fireEvent.click(haken);
    // Symmetrisch zurück - bisher blieb der Fokus auf dem Häkchen, während
    // darüber die halbe Maske wechselte.
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByLabelText("Klassencode")),
    );
  });

  it("★★ Nr 21: »andere Klasse« gibt den Fokus in das neue Klassencode-Feld", async () => {
    zeigeAnmeldung("ABC234");
    const andere = await screen.findByRole("button", { name: "andere Klasse" });
    andere.focus();
    fireEvent.click(andere);
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByLabelText("Klassencode")),
    );
  });
});

describe("Nr 9 / Nr 10 / Nr 11 — Bücherei und Leser", () => {
  /** Ein Lernstand mit allen Buchstaben - sonst ist die Bücherei leer. */
  const ALLE_BUCHSTABEN = [
    "f", "j", "d", "k", "s", "l", "a", "ö", "e", "n", "i", "r", "t",
    "h", "u", "c", "g", "m", "o", "b", "w", "z", "v", "p", "ä", "ü",
    "x", "y", "q", "ß",
  ];

  /** Ohne Konto: der Spielstand liegt im Browser. */
  function zeigeMitBuechern() {
    localStorage.setItem(
      "tippen-trainer:v1",
      JSON.stringify({ xp: 0, lessons: {}, introduced: ALLE_BUCHSTABEN }),
    );
    render(
      <MemoryRouter>
        <TippenTrainerPage />
      </MemoryRouter>,
    );
  }

  it("★★★ Nr 9: der Wechsel in die Bücherei landet auf ihrer Überschrift", async () => {
    zeigeMitBuechern();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /^Einstellungen/i }));
    fireEvent.click(await screen.findByRole("button", { name: /Geschichten/ }));
    const titel = await screen.findByRole("heading", { name: /Geschichten & Wissen/ });
    await waitFor(() => expect(document.activeElement).toBe(titel));
    expect(titel).toHaveAttribute("tabindex", "-1");
    expect(ansagen()).toContain("Geschichten und Wissen.");
  });

  it("★★★ Nr 10: eine Serie öffnen führt in das Tippfeld des Lesers", async () => {
    zeigeMitBuechern();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /^Einstellungen/i }));
    fireEvent.click(await screen.findByRole("button", { name: /Geschichten/ }));
    await screen.findByRole("heading", { name: /Geschichten & Wissen/ });
    // Die erste Serien-Kachel: „Los geht's" / „Loslegen" / „Beginnen".
    const start = await screen.findAllByRole("button", {
      name: /Los geht|Loslegen|Beginnen|Weiter \(Etappe|Nochmal lesen|Weiterlesen/,
    });
    fireEvent.click(start[0]);
    await warteAufFeldFokus();
  });

  it("★★ Nr 11: »Zurück zur Bücherei« im Leser landet wieder auf der Überschrift", async () => {
    zeigeMitBuechern();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /^Einstellungen/i }));
    fireEvent.click(await screen.findByRole("button", { name: /Geschichten/ }));
    const start = await screen.findAllByRole("button", {
      name: /Los geht|Loslegen|Beginnen|Weiter \(Etappe|Nochmal lesen|Weiterlesen/,
    });
    fireEvent.click(start[0]);
    await warteAufFeldFokus();
    fireEvent.click(await screen.findByRole("button", { name: /Zurück zur Bücherei/ }));
    const titel = await screen.findByRole("heading", { name: /Geschichten & Wissen/ });
    await waitFor(() => expect(document.activeElement).toBe(titel));
  });
});

describe("Nr 16 — der Dialog gibt den Fokus nur an einen Öffner zurück, den es noch gibt", () => {
  it("★★★ ist der Öffner weg, geht die Anforderung in die Eingabezeile", () => {
    // Der Fall isoliert, ohne die Seite darum herum: Der Öffner verschwindet
    // im SELBEN Rendern, in dem der Dialog aufgeht (React fasst beide
    // Zustandswechsel zusammen) - beim Merken steht darum schon `body` da.
    // Bis zum 22.08.2026 rief `Modal` beim Schließen blind `focus()` darauf
    // auf: ein Ziel, das keines ist. Jetzt geht die Anforderung ins Tippfeld.
    function Probe({ offen }: { offen: boolean }) {
      return offen ? (
        <Modal title="Probe" onClose={() => {}}>
          <p>Inhalt</p>
        </Modal>
      ) : null;
    }
    takePracticeFocusRequest(); // offene Anforderungen aus früheren Tests weg
    const { rerender } = render(<Probe offen />);
    expect(document.body.contains(screen.getByRole("dialog"))).toBe(true);
    rerender(<Probe offen={false} />);
    expect(takePracticeFocusRequest()).toBe(true);
  });

  it("★★★ »Passwort ändern«: der Öffner verschwindet mit dem Konto-Menü ⇒ Tippfeld", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /Mein Konto: Jano/ }));
    const oeffner = await screen.findByRole("button", { name: "Passwort ändern" });
    oeffner.focus();
    fireEvent.click(oeffner);
    // Der Dialog steht, der Öffner ist mit der Liste verschwunden.
    await screen.findByRole("dialog");
    expect(document.body.contains(oeffner)).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "Dialog schließen" }));
    // Vorher rief `Modal` blind `focus()` auf dem entfernten Knopf auf - das
    // tut nichts, und der Fokus blieb auf `body`.
    await warteAufFeldFokus();
  });
});

/* ═════════════════════════════════════════════════════════════════════════
   WELLE 3 — Dialoge, Feier, Bühne, und Escape überall (R6)
   ═════════════════════════════════════════════════════════════════════════ */

describe("Nr 12 — die Freischalt-Feier", () => {
  const FEIER = { unit: "d", skin: "kind" as const };

  it("★★★ sie schließt sich NICHT mehr von selbst - nichts verschwindet unter dem Fokus", () => {
    vi.useFakeTimers();
    try {
      const zu = vi.fn();
      render(<UnlockCelebration {...FEIER} onClose={zu} />);
      const weiter = screen.getByRole("button", { name: /weiter/i });
      // Anfangsfokus auf „Weiter" - die Eingabetaste genügt.
      expect(document.activeElement).toBe(weiter);
      act(() => {
        vi.advanceTimersByTime(60_000);
      });
      // Bis zum 22.08.2026 nahm ein Zeitgeber nach 7 Sekunden den Knopf mit,
      // auf dem der Fokus stand.
      expect(zu).not.toHaveBeenCalled();
      expect(document.activeElement).toBe(weiter);
    } finally {
      vi.useRealTimers();
    }
  });

  it("★★ FOKUS-FALLE: Tab kommt nicht in die verdeckte Seite dahinter", () => {
    render(
      <>
        <button data-testid="dahinter">Dahinter</button>
        <UnlockCelebration {...FEIER} onClose={() => {}} />
      </>,
    );
    const weiter = screen.getByRole("button", { name: /weiter/i });
    expect(document.activeElement).toBe(weiter);
    // „Weiter" ist der einzige Halt in der Karte - Tab reiht sich wieder ein.
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(weiter);
    expect(document.activeElement).not.toBe(screen.getByTestId("dahinter"));
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(weiter);
  });
});

/**
 * Nr 13, zweiter Teil - der Abzeichen-Dialog. Die Bestandsaufnahme verlangte
 * hier nur „Fokus-Falle ergänzen"; §0.5 kam am Abend dazu:
 *
 *   „Abzeichen-Dialog: Fokus-Falle Pflicht. Öffnen ⇒ ‚Schließen' (bleibt).
 *   Schließen-Knopf und ESC ⇒ zurück auf das betätigte Abzeichen (das Kind
 *   bleibt im Regal)."
 *
 * Das ist die eine Stelle, an der Escape NICHT in die Eingabezeile führt -
 * die Statistik hat gar keine. Escape in der Statistik selbst bleibt R6.
 */
describe("Nr 13 (§0.5) — der Abzeichen-Dialog hält den Fokus und gibt ihn zurück", () => {
  /** Das Regal mit einem verdienten Abzeichen, daneben ein Halt „dahinter". */
  function regalMitMedaille() {
    render(
      <>
        <button data-testid="dahinter">Dahinter</button>
        <BadgeShelf
          progress={{
            ...emptyProgress(),
            badges: { "tasten-kueken": 1751900000000 },
          }}
          selfView
        />
      </>,
    );
    const medaille = screen.getByRole("button", { name: /Groß anzeigen/ });
    medaille.focus();
    fireEvent.click(medaille);
    return medaille;
  }

  it("★★★ FOKUS-FALLE: Tab kommt nicht in die verdeckte Seite dahinter", () => {
    regalMitMedaille();
    const dialog = screen.getByRole("dialog");
    const schliessen = screen.getByRole("button", { name: "Schließen" });
    expect(document.activeElement).toBe(schliessen);
    // ⚠️ Wie man das in jsdom überhaupt MESSEN kann: jsdom bewegt bei Tab von
    // sich aus gar keinen Fokus - „der Fokus ist noch im Dialog" wäre also auch
    // ganz ohne Falle wahr. Gemessen wird darum, dass die Falle den Tastendruck
    // wirklich ABFÄNGT: `fireEvent` liefert `false`, wenn jemand
    // `preventDefault()` gerufen hat.
    expect(fireEvent.keyDown(schliessen, { key: "Tab" })).toBe(false);
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).not.toBe(screen.getByTestId("dahinter"));
    expect(fireEvent.keyDown(schliessen, { key: "Tab", shiftKey: true })).toBe(
      false,
    );
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("★★★ »Schließen« gibt den Fokus auf genau das betätigte Abzeichen zurück", () => {
    const medaille = regalMitMedaille();
    fireEvent.click(screen.getByRole("button", { name: "Schließen" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(medaille);
  });

  it("★★★ Escape ebenso - und schließt NICHT zugleich die Statistik dahinter", () => {
    const medaille = regalMitMedaille();
    // Ein Mithörer wie der Escape-Zweig der Seite: Er hört auf `document`
    // (Bubble) und darf diesen Tastendruck nicht mehr sehen.
    const seite = vi.fn();
    document.addEventListener("keydown", seite);
    try {
      fireEvent.keyDown(document.activeElement ?? document, { key: "Escape" });
    } finally {
      document.removeEventListener("keydown", seite);
    }
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(medaille);
    expect(seite).not.toHaveBeenCalled();
  });

  it("★★ ist das Abzeichen weg, fängt die Überschrift der Statistik den Fokus", () => {
    // R2: Rückgabe nur an einen Öffner, den es noch gibt - nie auf `body`.
    const titel = document.createElement("h2");
    titel.id = "tippen-statistik-titel";
    titel.tabIndex = -1;
    document.body.appendChild(titel);
    try {
      const medaille = regalMitMedaille();
      medaille.remove(); // die Vitrine hat sich unter dem Dialog neu aufgebaut
      fireEvent.click(screen.getByRole("button", { name: "Schließen" }));
      expect(document.activeElement).toBe(titel);
    } finally {
      titel.remove();
    }
  });

  it("★★★ GENAU EINMAL: ein Neu-Aufbau des Regals wirft den Fokus nicht hin und her", () => {
    // Der frühere Effekt hing an `[zoom, onClose]`, und `onClose` ist bei jedem
    // Rendern des Regals eine neue Funktion. Bei jedem Rendern lief also erst
    // die Rückgabe auf die Medaille und dann wieder der Sprung auf „Schließen".
    function RegalMitNeuAufbau() {
      const [n, setN] = useState(0);
      useEffect(() => {
        const f = () => setN((x) => x + 1);
        window.addEventListener("test-neu-rendern", f);
        return () => window.removeEventListener("test-neu-rendern", f);
      }, []);
      return (
        <>
          <span data-testid="zaehler">{n}</span>
          <BadgeShelf
            progress={{
              ...emptyProgress(),
              badges: { "tasten-kueken": 1751900000000 },
            }}
            selfView
          />
        </>
      );
    }
    render(<RegalMitNeuAufbau />);
    const medaille = screen.getByRole("button", { name: /Groß anzeigen/ });
    medaille.focus();
    fireEvent.click(medaille);
    const schliessen = screen.getByRole("button", { name: "Schließen" });
    expect(document.activeElement).toBe(schliessen);
    // ⚠️ Am Ende steht der Fokus in beiden Fassungen auf „Schließen" - die alte
    // sprang nur eben ZWISCHENDURCH auf die Medaille und wieder zurück. Auf
    // einer Braillezeile ist genau dieser Zwischenhalt der Schaden. Gezählt
    // wird darum, wie oft die Medaille den Fokus bekommt.
    let zurueck = 0;
    medaille.addEventListener("focus", () => (zurueck += 1));
    act(() => {
      window.dispatchEvent(new Event("test-neu-rendern"));
    });
    expect(screen.getByTestId("zaehler").textContent).toBe("1");
    expect(zurueck).toBe(0);
    // Der Dialog steht noch, und der Fokus ist nicht spazieren gegangen.
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(document.activeElement).toBe(schliessen);
  });

  it("★★ der Name steht ohne Text-Emoji da (die Medaille IST das Motiv)", () => {
    regalMitMedaille();
    const dialog = screen.getByRole("dialog");
    const def = BADGES.find((b) => b.id === "tasten-kueken");
    expect(def?.emoji).toBeTruthy();
    expect(dialog.textContent).not.toContain(def!.emoji);
    // Wie die Medaille aussieht, sagt weiterhin die Beschreibung.
    expect(dialog.textContent).toContain("Medaille");
  });
});

describe("Nr 13 / Nr 31 — die beiden Erklärkästen sind keine Dialoge mehr", () => {
  it("★★ AutoCapHint: Aufklapper mit aria-describedby, Escape holt die Eingabezeile", async () => {
    render(<AutoCapHint />);
    const knopf = screen.getByRole("button", {
      name: "Große Buchstaben ohne Umschalttaste: Erklärung anzeigen",
    });
    knopf.focus();
    fireEvent.click(knopf);
    // Bisher meldete die Sprachausgabe hier einen modalen Dialog, in den man
    // nie hineinkam - jetzt ist es ein Aufklapp-Text am Knopf.
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(knopf).toHaveAttribute("aria-expanded", "true");
    const id = knopf.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)?.textContent ?? "").toContain(
      "große Buchstaben von selbst",
    );
    takePracticeFocusRequest();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(knopf).toHaveAttribute("aria-expanded", "false");
    // R6: Escape geht in die Eingabezeile - bisher blieb der Fokus stehen.
    expect(takePracticeFocusRequest()).toBe(true);
  });

  it("★★ LetterMap: derselbe Umbau am Kasten »nächste Taste«", () => {
    render(
      <LetterMap lernweg="de" letters={{}} introduced={["f", "j"]} showNext title="Deine Tasten" />,
    );
    const knopf = screen.getByRole("button", { name: /Nächste Taste .*Erklärung anzeigen/ });
    fireEvent.click(knopf);
    expect(screen.queryByRole("dialog")).toBeNull();
    const id = knopf.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id!)?.textContent ?? "").toContain(
      "automatisch dazu",
    );
    takePracticeFocusRequest();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(knopf).toHaveAttribute("aria-expanded", "false");
    expect(takePracticeFocusRequest()).toBe(true);
  });
});

describe("Nr 17 / Nr 18 — die Steuerleiste der Bühne", () => {
  /**
   * Die Polarstation als Prüfstand: Sie ist die einzige Zone, die sich ohne
   * Zeitdruck und ohne Zufall zu Ende spielen lässt - ein Wort in richtiger
   * Reihenfolge tippen, fertig (siehe `tests/expedition-e6.test.tsx`).
   */
  const STATION = { stages: [{ kind: "station" as const, units: ["nase"] }] };

  function zeigeBuehne() {
    render(
      <ExpeditionStage
        open
        onClose={() => {}}
        course={STATION}
        free
        isAdult={false}
        uppercase={false}
        noTimePressure
        voiceEnabled={false}
        letters={{}}
        onWin={() => {}}
        onFinished={() => {}}
      />,
    );
    return screen.getByRole("application");
  }

  /** Das Wort lösen und in kleinen Schritten bis zum Sieg vorspulen. */
  function spieleBisZumSieg(feldEl: Element, ziel: RegExp | string) {
    for (const ch of "nase") act(() => void fireEvent.keyDown(feldEl, { key: ch }));
    for (let ms = 0; ms < 6000; ms += 100) {
      if (screen.queryByRole("button", { name: ziel })) return;
      act(() => {
        vi.advanceTimersByTime(100);
      });
    }
  }

  it("★★ Nr 17: »Nochmal spielen« gibt den Fokus auf das Spielfeld", () => {
    vi.useFakeTimers();
    try {
      const feldEl = zeigeBuehne();
      spieleBisZumSieg(feldEl, /Nochmal spielen|Noch eine Runde/);
      const nochmal = screen.getByRole("button", {
        name: /Nochmal spielen|Noch eine Runde/,
      });
      nochmal.focus();
      fireEvent.click(nochmal);
      // Der Knopf verschwindet mit der ganzen Reihe (`view.won` ist danach
      // falsch) - bisher fiel der Fokus dabei auf `body`.
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(document.activeElement).toBe(screen.getByRole("application"));
    } finally {
      vi.useRealTimers();
    }
  });

  it("★★★ Nr 18: verschwindet der Knopf unter dem Fokus, kommt »Fertig« SOFORT", () => {
    vi.useFakeTimers();
    try {
      const feldEl = zeigeBuehne();
      // Fokus auf den Knopf, den der Sieg gleich entfernt.
      const beenden = screen.getByRole("button", {
        name: /Spiel beenden|Vielleicht später|Später wiederholen/,
      });
      beenden.focus();
      expect(document.activeElement).toBe(beenden);
      spieleBisZumSieg(feldEl, "Fertig");
      // Ohne die 400 ms abzuwarten: „Fertig" hat den Fokus schon. Vorher hing
      // er so lange auf `body`, weil der Knopf darunter entfernt worden war.
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Fertig" }),
      );
    } finally {
      vi.useRealTimers();
    }
  });

  it("★ steht der Fokus im Spielfeld, bleibt der ruhige 400-ms-Zug", () => {
    vi.useFakeTimers();
    try {
      const feldEl = zeigeBuehne();
      (feldEl as HTMLElement).focus();
      spieleBisZumSieg(feldEl, "Fertig");
      // Hier verschwindet nichts unter dem Fokus - also keine Eile.
      expect(document.activeElement).toBe(feldEl);
      act(() => {
        vi.advanceTimersByTime(450);
      });
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Fertig" }),
      );
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("R6 — Escape schließt und springt in die Eingabezeile, überall", () => {
  /**
   * Johannes, 22.08.2026 (★★★ Grundregel für immer): „ESC schließt Dialoge und
   * springt in die Eingabezeile - immer und überall, in jeder App. Kein Dialog,
   * kein Aufklapper, kein Overlay darf Escape schlucken oder den Fokus woanders
   * hinlegen."
   *
   * Statistik, Kürzel-Liste, Hilfe, Zahnrad, Konto-Menü und Lektionsliste
   * stehen schon seit dem 14.08.2026 in `tests/typing-esc-eingabezeile.test.ts`.
   * Hier kommen die Fenster dazu, die diese Charge angefasst hat.
   */

  it("★★ der Passwort-Dialog", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    fireEvent.click(screen.getByRole("button", { name: /Mein Konto: Jano/ }));
    fireEvent.click(await screen.findByRole("button", { name: "Passwort ändern" }));
    await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await warteAufFeldFokus();
  });

  it("★★ die Freischalt-Feier", () => {
    const zu = vi.fn();
    render(<UnlockCelebration unit="d" skin="kind" onClose={zu} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(zu).toHaveBeenCalledTimes(1);
  });

  it("★★ der Stimmen-Hinweis (Nr 14: EIN Ziel, nicht zwei)", async () => {
    // Der Hinweis erscheint in der App nur, wenn Stimmen installiert sind, aber
    // keine englische - in jsdom gibt es gar keine. Darum hier der Baustein
    // selbst: Escape schließt, und die Fokus-Falle gibt NICHT zusätzlich an den
    // Öffner zurück (bis zum 22.08.2026 tat sie das, und die Seite schickte den
    // Fokus unmittelbar danach ins Feld - zwei Sprünge für einen Tastendruck).
    const ausloeser = document.createElement("button");
    ausloeser.textContent = "Sprache";
    document.body.appendChild(ausloeser);
    ausloeser.focus();
    const zu = vi.fn();
    const { rerender } = render(<VoiceInstallHelp open onClose={zu} />);
    const schliessen = await screen.findByRole("button", { name: "Schließen" });
    expect(document.activeElement).toBe(schliessen);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(zu).toHaveBeenCalledTimes(1);
    rerender(<VoiceInstallHelp open={false} onClose={zu} />);
    expect(document.activeElement).not.toBe(ausloeser);
    ausloeser.remove();
  });

  it("★★★ AUSNAHME »Tasten erkunden«: Escape ist dort der Lehrstoff", async () => {
    zeigeSeite();
    await screen.findByRole("heading", { name: /Mein Training/i });
    // ★ 30.08.2026: Alt + 3 statt Alt + K (siehe Nr 20 weiter oben).
    fireEvent.keyDown(document, { code: "Digit3", altKey: true });
    await screen.findByRole("button", { name: "Beenden" });
    // Ein Escape sagt die Taste an und beendet NICHT.
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("button", { name: "Beenden" })).toBeInTheDocument();
    // Erst der zweite Druck steigt aus - und dann gilt R6.
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "Beenden" })).toBeNull(),
    );
    await warteAufFeldFokus();
  });
});

/* ═════════════════════════════════════════════════════════════════════════
   WELLE 4 — Passwort und Nachrichten
   ═════════════════════════════════════════════════════════════════════════ */

describe("Nr 6 (zweiter Teil) — »Passwort ändern« schließt sich nach Erfolg", () => {
  it("★★★ Dialog zu, Ansage »Passwort geändert.«, Fokus in der Eingabezeile", async () => {
    const spion = vi
      .spyOn(typingBackend(), "changeOwnPassword")
      .mockResolvedValue({ ok: true, value: true } as never);
    try {
      zeigeSeite();
      await screen.findByRole("heading", { name: /Mein Training/i });
      fireEvent.click(screen.getByRole("button", { name: /Mein Konto: Jano/ }));
      fireEvent.click(await screen.findByRole("button", { name: "Passwort ändern" }));
      await screen.findByRole("dialog");
      fireEvent.change(screen.getByLabelText("Aktuelles Passwort"), {
        target: { value: "alt1" },
      });
      fireEvent.change(screen.getByLabelText("Neues Passwort"), {
        target: { value: "neu12345" },
      });
      fireEvent.change(screen.getByLabelText("Neues Passwort wiederholen"), {
        target: { value: "neu12345" },
      });
      vi.mocked(speakUi).mockClear();
      fireEvent.click(
        screen.getAllByRole("button", { name: "Passwort ändern" }).at(-1)!,
      );
      // Johannes' Entscheidung F2: Der Dialog bleibt nicht mit drei geleerten
      // Feldern und einem toten Knopf stehen.
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
      expect(ansagen()).toContain("Passwort geändert.");
      await warteAufFeldFokus();
      expect(spion).toHaveBeenCalledWith("alt1", "neu12345");
    } finally {
      spion.mockRestore();
    }
  });
});

describe("Nr 24 / Nr 25 — im Nachrichten-Fenster (gemeinsamer Baustein)", () => {
  const NACHRICHT = (pupilUid: string, id: string) => ({
    id,
    pupilUid,
    teacherUid: "t1",
    classCode: "5A3",
    senderRole: "pupil" as const,
    body: "Hallo",
    fromName: "Kind",
    pupilName: pupilUid === "p1" ? "Anna" : "Ben",
    subject: "",
    createdAt: 1,
    readPupilAt: 1,
    readTeacherAt: 0,
  });
  const GESPRAECHE = [
    {
      pupilUid: "p1",
      pupilName: "Anna",
      classCode: "5A3",
      messages: [NACHRICHT("p1", "m1")],
      lastAt: 1,
      unread: 1,
    },
    {
      pupilUid: "p2",
      pupilName: "Ben",
      classCode: "5A3",
      messages: [NACHRICHT("p2", "m2")],
      lastAt: 1,
      unread: 0,
    },
  ];

  /** Die Spione dieses Blocks - einzeln zurückgenommen, nicht per
   *  `restoreAllMocks`: Das setzte sonst auch die `speakUi`-Attrappe des
   *  Datei-Kopfes zurück, an der jede andere Gruppe hängt. */
  const spione: { mockRestore: () => void }[] = [];
  function alsLehrkraft() {
    const api = lwMessages();
    spione.push(
      vi.spyOn(api, "identity").mockReturnValue({
        id: "t1",
        role: "teacher",
        name: "Frau Berger",
        classCode: "",
        teacherUid: "t1",
      } as never),
      vi.spyOn(api, "loadInbox").mockResolvedValue(GESPRAECHE as never),
      vi.spyOn(api, "listForPupil").mockImplementation(
        async (uid: string) =>
          GESPRAECHE.find((c) => c.pupilUid === uid)!.messages as never,
      ),
      vi.spyOn(api, "markRead").mockResolvedValue(undefined),
    );
    return api;
  }

  afterEach(() => {
    while (spione.length) spione.pop()!.mockRestore();
  });

  it("★ Nr 25: ein Gespräch öffnen führt in das Antwortfeld (der Faden holt es selbst)", async () => {
    alsLehrkraft();
    render(<LwMessageBell accountId="t1" />);
    fireEvent.click(await screen.findByRole("button", { name: /Nachrichten/ }));
    const anna = await screen.findByRole("button", { name: /Anna/ });
    fireEvent.click(anna);
    // ★ Befund 22.08.2026: Diese Zeile der Bestandsaufnahme war FALSCH als
    // UNDEFINIERT geführt - sie hatte nur `LwMessageBell` angeschaut.
    // `LwMessageThread` holt den Fokus beim Aufbauen selbst ins Antwortfeld
    // (dort seit 02.07.2026). Der Test hält das Verhalten fest, damit es nicht
    // verloren geht; in der Glocke steht dafür bewusst KEIN zweiter Aufruf
    // (das wäre die von R2 verbotene Doppel-Rückgabe).
    await waitFor(() =>
      expect(document.activeElement).toBe(document.getElementById("lw-msg-p1")),
    );
  });

  it("★★ Nr 24: »Zur Übersicht« führt auf das erste Gespräch der Liste", async () => {
    alsLehrkraft();
    render(<LwMessageBell accountId="t1" />);
    fireEvent.click(await screen.findByRole("button", { name: /Nachrichten/ }));
    fireEvent.click(await screen.findByRole("button", { name: /Anna/ }));
    await waitFor(() =>
      expect(document.activeElement).toBe(document.getElementById("lw-msg-p1")),
    );
    fireEvent.click(screen.getByRole("button", { name: /Zur Übersicht/ }));
    const wieder = await screen.findByRole("button", { name: /Anna/ });
    await waitFor(() => expect(document.activeElement).toBe(wieder));
  });
});
