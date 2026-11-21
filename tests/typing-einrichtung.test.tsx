/**
 * Tastenflow — die Einrichtung beim ersten Start (08.08.2026).
 *
 * Wunsch Johannes: „eine Einführung wie bei »im Griff«, in der wir Alter,
 * Sprache, … die ganzen Einstellungen gemeinsam einrichten. Hier passt der
 * Podcast gut dazu."
 *
 * Fünf Zusicherungen:
 *
 *  A) **Die Schrittfolge stimmt** — und kennt keine Sackgassen: gesperrte
 *     Sprache und der Startpunkt mit Konto fallen ganz weg, statt als
 *     Schritt zu erscheinen, der nichts ändern kann.
 *  B) **Jede Wahl wirkt sofort** — die Knöpfe rufen dieselben Funktionen wie
 *     das Zahnrad.
 *  C) **Immer ein Ausweg** — „überspringen" und Esc beenden aus jedem Schritt,
 *     und beide merken sich das.
 *  D) **Der Podcast steht NACH dem Alter** und zeigt die Folge zur Stufe.
 *  E) **Beim zweiten Start ist sie weg** — und Alt + R holt sie zurück.
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  EINRICHTUNG_STEP_ORDER,
  einrichtungFertig,
  einrichtungSchritte,
  einrichtungZuruecksetzen,
  naechsterSchritt,
  schrittNummer,
  vorigerSchritt,
  zusammenfassung,
} from "../src/lib/typing/einrichtung";
import { Einrichtung } from "../src/components/typing/Einrichtung";
import { activeLayout, isSoundMuted, setLayout, setSoundMuted } from "../src/lib/typing";

afterEach(cleanup);

/* ────────────────────────────────────────────────────────────────────────────
 * A · Schrittfolge
 * ──────────────────────────────────────────────────────────────────────────*/

describe("Einrichtung · A — die Schritte", () => {
  it("ohne Anmeldung: acht Schritte in fester Reihenfolge", () => {
    const alle = einrichtungSchritte({ mitStartpunkt: true });
    expect(alle).toEqual([...EINRICHTUNG_STEP_ORDER]);
    expect(schrittNummer("willkommen", { mitStartpunkt: true })).toBe(1);
    expect(schrittNummer("fertig", { mitStartpunkt: true })).toBe(8);
  });

  it("mit Konto fällt der Startpunkt weg (den setzt die Lehrkraft)", () => {
    const alle = einrichtungSchritte({ mitStartpunkt: false });
    expect(alle).not.toContain("start");
    expect(alle).toHaveLength(7);
  });

  it("gesperrte Sprache: der Sprach-Schritt entfällt ganz", () => {
    const alle = einrichtungSchritte({ langLocked: true, mitStartpunkt: true });
    expect(alle).not.toContain("sprache");
    // …und die Zählung stimmt weiter: „Schritt 2 von 7" ist das Alter.
    expect(schrittNummer("alter", { langLocked: true, mitStartpunkt: true })).toBe(2);
  });

  it("weiter und zurück hängen zusammen", () => {
    const lage = { mitStartpunkt: true };
    expect(naechsterSchritt("alter", lage)).toBe("sprache");
    expect(vorigerSchritt("sprache", lage)).toBe("alter");
    expect(vorigerSchritt("willkommen", lage)).toBeNull();
    expect(naechsterSchritt("fertig", lage)).toBeNull();
    // Ohne Sprach-Schritt rückt der nächste nach.
    expect(naechsterSchritt("alter", { langLocked: true })).toBe("tastatur");
  });

  it("die Zusammenfassung nennt den Startpunkt nur, wenn es ihn gab", () => {
    const ohne = zusammenfassung({
      stufeLabel: "10-12 Jahre",
      sprachLabel: "Deutsch",
      tastaturLabel: "Deutsch",
      ton: true,
      vorlesen: false,
    });
    expect(ohne.map((z) => z.was)).toEqual(["Texte für", "Sprache", "Tastatur", "Ton", "Vorlesen"]);
    const mit = zusammenfassung({
      stufeLabel: "10-12 Jahre",
      sprachLabel: "Deutsch",
      tastaturLabel: "Deutsch",
      startLabel: "Anfänger: nur F und J",
      ton: false,
      vorlesen: true,
    });
    expect(mit.find((z) => z.was === "Start")?.gewaehlt).toBe("Anfänger: nur F und J");
    expect(mit.find((z) => z.was === "Ton")?.gewaehlt).toBe("aus");
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * B–E · Die Ansicht
 * ──────────────────────────────────────────────────────────────────────────*/

function renderEinrichtung(over: Partial<Parameters<typeof Einrichtung>[0]> = {}) {
  const props = {
    stufe: "teens" as const,
    lang: "de" as const,
    onLangChange: vi.fn(),
    startUnits: 2,
    onStartUnitsChange: vi.fn(),
    lernweg: "de" as const,
    onExit: vi.fn(),
    ...over,
  };
  render(<Einrichtung {...props} />);
  return props;
}

/** Den Weiter-Knopf des aktuellen Schritts drücken. */
function weiter(label: string) {
  fireEvent.click(screen.getByRole("button", { name: label }));
}

describe("Einrichtung · B–E — die Ansicht", () => {
  beforeEach(() => {
    einrichtungZuruecksetzen();
    setSoundMuted(false);
    setLayout("de");
  });

  it("startet bei Schritt 1 und zählt mit", () => {
    renderEinrichtung();
    expect(screen.getByText(/Schritt 1 von 8/)).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: "Willkommen bei Tastenflow" }),
    ).toBeTruthy();
  });

  /* ★★★ 30.08.2026: Hier stand „B — die Alters-Wahl ruft dieselbe Funktion wie
     das Zahnrad" und drückte den Schalter „7-10 Jahre". Die vier Stufen-
     Schalter gibt es in der Einrichtung nicht mehr (Johannes: „es ist wichtig
     dass die app mitwächst … und es ist bedingung für eine anmeldung").
     Sie waren nicht bloß überflüssig: Eine von Hand gewählte Stufe schlägt im
     Vorrangmodell das Geburtsjahr und WÄCHST NICHT MIT - wer mit neun „7-10"
     anklickte, bekam mit zwölf noch Texte für Siebenjährige. Umgestellt wird
     seither im Zahnrad, wo eine Ausnahme hingehört.
     Der Wächter prüft darum jetzt das Gegenteil: dass die Schalter WEG sind. */
  it("B — die Stufen-Schalter sind weg; gefragt wird nur noch das Jahr", () => {
    renderEinrichtung({ onGeburtsjahrChange: vi.fn() });
    weiter("Los geht's");
    expect(
      screen.getByRole("heading", { name: "Für wen sind die Texte?" }),
    ).toBeTruthy();
    for (const s of ["7-10 Jahre", "11-15 Jahre", "Ab 16 Jahren"]) {
      expect(
        screen.queryByRole("button", { name: new RegExp(s.replace(/[-]/g, "\\-")) }),
        `Stufen-Schalter „${s}" steht noch da`,
      ).toBeNull();
    }
    expect(screen.getByLabelText(/Geburtsjahr/)).toBeTruthy();
  });

  /* ★★★ DER FALL, DER SONST EINE SACKGASSE WÄRE (30.08.2026).
     Kinder MIT Lehrkraft bekommen das Geburtsjahr-Feld nicht (der Server-
     Wächter `tt_pupils_field_guard` drehte eine eigene Eingabe zurück). Nimmt
     man ihnen zusätzlich die Stufen-Schalter weg, bliebe der Schritt LEER: Die
     Überschrift wird vorgelesen, danach kommt nichts, und ein Kind mit
     Screenreader weiß nicht, ob die Seite noch lädt. */
  it("B — ohne Geburtsjahr-Feld steht der Schritt NICHT leer", () => {
    renderEinrichtung(); // kein onGeburtsjahrChange = Kind einer Klasse
    weiter("Los geht's");
    expect(screen.queryByLabelText(/Geburtsjahr/)).toBeNull();
    // Es steht da, WER es eingestellt hat und WAS gerade gilt.
    expect(screen.getByText(/Lehrkraft/)).toBeTruthy();
    expect(screen.getByText(/11-15 Jahre/)).toBeTruthy();
    // Und weiter geht es trotzdem.
    expect(screen.getByRole("button", { name: "Weiter" })).toBeTruthy();
  });

  it("B — das Geburtsjahr gibt es nur, wo es auch wirken darf", () => {
    // Ohne Rückruf (Kind einer Klasse: die Lehrkraft setzt es) kein Feld …
    renderEinrichtung();
    weiter("Los geht's");
    expect(screen.queryByLabelText(/Geburtsjahr/)).toBeNull();
    cleanup();
    // … mit Rückruf schon, und eine gültige Jahreszahl kommt als ZAHL an.
    const props = renderEinrichtung({ onGeburtsjahrChange: vi.fn() });
    weiter("Los geht's");
    fireEvent.change(screen.getByLabelText(/Geburtsjahr/), {
      target: { value: "2016" },
    });
    expect(props.onGeburtsjahrChange).toHaveBeenCalledWith(2016);
    // Halb getippt = »nichts angegeben«, nie eine Fehlermeldung.
    fireEvent.change(screen.getByLabelText(/Geburtsjahr/), { target: { value: "20" } });
    expect(props.onGeburtsjahrChange).toHaveBeenLastCalledWith(undefined);
  });

  it("B — die Tastatur-Wahl stellt das Layout wirklich um", () => {
    renderEinrichtung({ langLocked: true }); // Sprach-Schritt weg → kürzerer Weg
    weiter("Los geht's");
    weiter("Weiter"); // Alter → Tastatur
    // ★ 28.09.2026 (Freigabe fr/es): Seit die französischen Tastaturen default
    // sichtbar sind, trifft /Schweiz/ auch „Französisch (Schweiz/Luxemburg)" -
    // gesucht wird darum die deutschsprachige Schweizer Tastatur beim Namen.
    fireEvent.click(screen.getByRole("button", { name: /^Schweiz \(Schweizer Tastatur\)/ }));
    expect(activeLayout().id).toBe("ch");
    setLayout("de");
  });

  it("B — der Ton-Schritt schaltet den Ton wirklich stumm", () => {
    renderEinrichtung({ langLocked: true, startUnits: undefined, onStartUnitsChange: undefined });
    weiter("Los geht's"); // → alter
    weiter("Weiter"); // → tastatur
    weiter("Weiter"); // → ton
    expect(screen.getByRole("heading", { name: "Ton und Vorlesen" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Ton an/ }));
    expect(isSoundMuted()).toBe(true);
    setSoundMuted(false);
  });

  it("D — der Podcast-Schritt kommt nach dem Alter und zeigt die Folge zur Stufe", () => {
    renderEinrichtung({
      stufe: "erwachsen",
      langLocked: true,
      startUnits: undefined,
      onStartUnitsChange: undefined,
    });
    weiter("Los geht's"); // alter
    weiter("Weiter"); // tastatur
    weiter("Weiter"); // ton
    weiter("Weiter"); // podcast
    expect(
      screen.getByRole("heading", { name: /Einführungs-Podcast/ }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /Willkommen: der Einstieg/ }),
    ).toBeTruthy();
    // Im Rundgang hat die Karte KEINEN eigenen Schließen-Knopf (sonst zwei
    // Weiter-Wege nebeneinander).
    expect(screen.queryByRole("button", { name: "Schließen" })).toBeNull();
  });

  it("C — »überspringen« beendet und merkt sich das", () => {
    const props = renderEinrichtung();
    fireEvent.click(screen.getByRole("button", { name: "Einrichtung überspringen" }));
    expect(props.onExit).toHaveBeenCalledWith(false);
    expect(einrichtungFertig()).toBe(true);
  });

  it("C — Esc tut dasselbe, aus jedem Schritt", () => {
    const props = renderEinrichtung();
    weiter("Los geht's");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(props.onExit).toHaveBeenCalledWith(false);
    expect(einrichtungFertig()).toBe(true);
  });

  it("E — der letzte Schritt beendet mit `true` und merkt sich das", () => {
    const props = renderEinrichtung({
      langLocked: true,
      startUnits: undefined,
      onStartUnitsChange: undefined,
    });
    weiter("Los geht's"); // alter
    weiter("Weiter"); // tastatur
    weiter("Weiter"); // ton
    weiter("Weiter"); // podcast
    weiter("Weiter"); // fertig
    expect(screen.getByRole("heading", { name: /Fertig/ })).toBeTruthy();
    weiter("Zur ersten Runde");
    expect(props.onExit).toHaveBeenCalledWith(true);
    expect(einrichtungFertig()).toBe(true);
  });

  it("»Zurück« gibt es überall außer im ersten Schritt", () => {
    renderEinrichtung();
    expect(screen.queryByRole("button", { name: "Zurück" })).toBeNull();
    weiter("Los geht's");
    fireEvent.click(screen.getByRole("button", { name: "Zurück" }));
    expect(
      screen.getByRole("heading", { name: "Willkommen bei Tastenflow" }),
    ).toBeTruthy();
  });
});
