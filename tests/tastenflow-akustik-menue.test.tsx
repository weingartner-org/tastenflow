/**
 * Wächter für das Akustik-Menü unter dem runden Lautsprecher-Schalter
 * (17.10.2026, Johannes: „ein Menü mit allen Akustik-Einstellungen, mit
 * Schiebereglern und Mouseover-Erklärung").
 *
 * Vier Dinge halten dieser Datei zusammen:
 *   1. Der Lautstärke-Speicher: Vorgabe 100 %, begrenzt, gemerkt.
 *   2. Die Regler wirken wirklich auf den Klang (Töne, Klick, Sprechstimme).
 *   3. Das Menü: Regler mit Prozentwert, jedes Element mit Mouseover-Hinweis.
 *   4. Die Kopfzeile: Mit Menü öffnet der Lautsprecher es; ohne Menü bleibt
 *      der Schalter, wie er war (die anderen Apps).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppKopfzeile } from "../src/components/AppKopfzeile";
import { AkustikMenue, AKUSTIK_TEXTE, alsProzent } from "../src/components/typing/AkustikMenue";
import {
  lautstaerkeBegrenzen,
  lautstaerkeLesen,
  useLautstaerke,
} from "../src/lib/typing/lautstaerke";
import { sprechLautstaerkeBegrenzen, useVoice } from "../src/lib/typing/voice";
import { playErrorSound, playKeyTick, setKeyTickOn, setSoundMuted } from "../src/lib/typing/sound";

beforeEach(() => {
  localStorage.clear();
  useLautstaerke.setState({ toene: 1, klick: 1, melodie: 1 });
  useVoice.setState({ enabled: false, volume: 1, rate: 1 });
  setSoundMuted(false);
  setKeyTickOn(false);
});
afterEach(cleanup);

describe("Lautstärke-Speicher", () => {
  it("★ ohne gespeicherten Stand: überall 100 % - wer nichts verstellt, hört wie bisher", () => {
    expect(lautstaerkeLesen(null)).toEqual({ toene: 1, klick: 1, melodie: 1 });
    expect(lautstaerkeLesen("kaputt{")).toEqual({ toene: 1, klick: 1, melodie: 1 });
  });

  it("Werte werden auf 0 bis 1 begrenzt; Müll wird zur Vorgabe", () => {
    expect(lautstaerkeBegrenzen(2)).toBe(1);
    expect(lautstaerkeBegrenzen(-1)).toBe(0);
    expect(lautstaerkeBegrenzen(Number.NaN)).toBe(1);
    expect(lautstaerkeBegrenzen("laut")).toBe(1);
    expect(lautstaerkeLesen('{"toene":0.4,"klick":"x"}')).toEqual({ toene: 0.4, klick: 1, melodie: 1 });
  });

  it("setze() merkt den Wert für den nächsten Start", () => {
    useLautstaerke.getState().setze("melodie", 0.3);
    expect(lautstaerkeLesen(localStorage.getItem("tippen-lautstaerke")).melodie).toBe(0.3);
  });

  it("Sprechlautstärke: nie ganz stumm (min. 10 %), Müll ⇒ voll", () => {
    expect(sprechLautstaerkeBegrenzen(0)).toBe(0.1);
    expect(sprechLautstaerkeBegrenzen(5)).toBe(1);
    expect(sprechLautstaerkeBegrenzen(undefined)).toBe(1);
  });
});

describe("Die Regler wirken auf den Klang", () => {
  /** Ein Web-Audio-Attrappe: zählt Oszillatoren und merkt sich die Spitze der Hüllkurve. */
  function audioAttrappe() {
    const spitzen: number[] = [];
    let oszillatoren = 0;
    class AC {
      state = "running";
      currentTime = 0;
      destination = {};
      resume() {}
      createOscillator() {
        oszillatoren++;
        return {
          type: "sine",
          frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
          connect: (x: unknown) => x,
          start() {},
          stop() {},
        };
      }
      createGain() {
        return {
          gain: {
            setValueAtTime() {},
            exponentialRampToValueAtTime: (w: number) => spitzen.push(w),
          },
          connect: (x: unknown) => x,
        };
      }
    }
    vi.stubGlobal("AudioContext", AC);
    Object.defineProperty(window, "AudioContext", { value: AC, configurable: true });
    return { spitzen, anzahl: () => oszillatoren };
  }

  afterEach(() => vi.unstubAllGlobals());

  it("★ Töne: halbe Lautstärke ⇒ halbe Spitze; null ⇒ gar kein Ton", async () => {
    // Das Modul hält EINEN AudioContext - darum frisch laden, nach der Attrappe.
    vi.resetModules();
    const a = audioAttrappe();
    const sound = await import("../src/lib/typing/sound");
    const laut = await import("../src/lib/typing/lautstaerke");
    sound.playErrorSound();
    const voll = Math.max(...a.spitzen);
    a.spitzen.length = 0;
    laut.useLautstaerke.getState().setze("toene", 0.5);
    sound.playErrorSound();
    expect(Math.max(...a.spitzen)).toBeCloseTo(voll * 0.5, 5);
    const vorher = a.anzahl();
    laut.useLautstaerke.getState().setze("toene", 0);
    sound.playErrorSound();
    expect(a.anzahl()).toBe(vorher);
  });

  it("★ Klick und Töne sind getrennte Regler", async () => {
    vi.resetModules();
    const a = audioAttrappe();
    const sound = await import("../src/lib/typing/sound");
    const laut = await import("../src/lib/typing/lautstaerke");
    sound.setKeyTickOn(true);
    laut.useLautstaerke.getState().setze("toene", 0);
    sound.playKeyTick();
    expect(a.anzahl()).toBe(1); // der Klick klingt, obwohl die Töne auf 0 stehen
    laut.useLautstaerke.getState().setze("klick", 0);
    sound.playKeyTick();
    expect(a.anzahl()).toBe(1); // jetzt nicht mehr
  });

  it("die importierten Funktionen existieren (Schutz vor stillem Umbenennen)", () => {
    expect(typeof playErrorSound).toBe("function");
    expect(typeof playKeyTick).toBe("function");
  });

  it("★ Sprechlautstärke landet an der Utterance", async () => {
    const gesprochen: SpeechSynthesisUtterance[] = [];
    class Utterance {
      text: string;
      rate = 1;
      pitch = 1;
      volume = 1;
      voice: unknown = null;
      lang = "";
      constructor(text: string) {
        this.text = text;
      }
    }
    vi.stubGlobal("SpeechSynthesisUtterance", Utterance);
    const synth = {
      speaking: false,
      pending: false,
      paused: false,
      getVoices: () => [],
      cancel() {},
      resume() {},
      pause() {},
      speak: (u: SpeechSynthesisUtterance) => gesprochen.push(u),
      addEventListener() {},
      removeEventListener() {},
    };
    Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
    vi.useFakeTimers();
    try {
      const voice = await import("../src/lib/typing/voice");
      voice.useVoice.setState({ enabled: true, volume: 0.4 });
      voice.speak("Hallo");
      await vi.advanceTimersByTimeAsync(600);
      expect(gesprochen.length).toBeGreaterThan(0);
      expect(gesprochen[gesprochen.length - 1].volume).toBeCloseTo(0.4, 5);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("Das Akustik-Menü", () => {
  const zeige = (onVorlesen = vi.fn()) =>
    render(
      <MemoryRouter>
        <AkustikMenue onVorlesen={onVorlesen} lang="de" lernweg="de" />
      </MemoryRouter>,
    );

  it("★ drei Lautstärke-Regler, jeder mit Prozentwert für den Screenreader", () => {
    zeige();
    for (const name of [
      AKUSTIK_TEXTE.de.toeneLaut,
      AKUSTIK_TEXTE.de.klickLaut,
      AKUSTIK_TEXTE.de.melodieLaut,
    ]) {
      const regler = screen.getByRole("slider", { name: new RegExp(name) });
      expect(regler).toHaveAttribute("aria-valuetext", "100 %");
      expect(regler).toHaveAttribute("aria-describedby");
    }
  });

  it("★ der Töne-Regler schreibt in den Speicher und zeigt den neuen Wert", () => {
    zeige();
    const regler = screen.getByRole("slider", { name: new RegExp(AKUSTIK_TEXTE.de.toeneLaut) });
    fireEvent.change(regler, { target: { value: "0.6" } });
    expect(useLautstaerke.getState().toene).toBeCloseTo(0.6, 5);
    expect(regler).toHaveAttribute("aria-valuetext", "60 %");
  });

  it("★ Tempo, Stimmlautstärke und Stimme erscheinen erst, wenn Vorlesen an ist", () => {
    zeige();
    expect(screen.queryByRole("slider", { name: new RegExp(AKUSTIK_TEXTE.de.sprechLaut) })).toBeNull();
    cleanup();
    useVoice.setState({ enabled: true });
    zeige();
    const laut = screen.getByRole("slider", { name: new RegExp(AKUSTIK_TEXTE.de.sprechLaut) });
    fireEvent.change(laut, { target: { value: "0.5" } });
    expect(useVoice.getState().volume).toBeCloseTo(0.5, 5);
    expect(screen.getByRole("slider", { name: /Sprechtempo/ })).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("★ der Vorlesen-Schalter geht den Weg von Alt + V (derselbe Rückruf)", () => {
    const onVorlesen = vi.fn();
    zeige(onVorlesen);
    fireEvent.click(screen.getByRole("switch", { name: /^Vorlesen/ }));
    expect(onVorlesen).toHaveBeenCalledTimes(1);
  });

  it("★ Ton aus und Tipp-Klick schalten den Speicher des Zahnrads", () => {
    zeige();
    fireEvent.click(screen.getByRole("switch", { name: /^Ton$/ }));
    expect(localStorage.getItem("tippen-sound-muted")).toBe("1");
    fireEvent.click(screen.getByRole("switch", { name: /^Tipp-Klick$/ }));
    expect(localStorage.getItem("tippen-keytick")).toBe("1");
  });

  it("★ Mouseover-Erklärung: jeder Regler hat seinen Hinweis im Baum (auch für den Fokus)", () => {
    zeige();
    const regler = screen.getByRole("slider", { name: new RegExp(AKUSTIK_TEXTE.de.melodieLaut) });
    const id = regler.getAttribute("aria-describedby")!;
    const hinweis = document.getElementById(id);
    expect(hinweis).not.toBeNull();
    expect(hinweis!.textContent).toContain(AKUSTIK_TEXTE.de.melodieLautHinweis);
  });

  it("★ schlank (18.10.2026): vier Karten, Regler ohne sichtbaren Langtext, nur Symbol + Prozent", () => {
    const { container } = zeige();
    // Vier Bereiche als Karten: Vorlesen, Ton, Tipp-Klick, Melodie.
    expect(container.querySelectorAll("section")).toHaveLength(4);
    for (const titel of ["Vorlesen", "Ton", "Tipp-Klick"]) {
      expect(screen.getByRole("heading", { level: 3, name: titel })).toBeInTheDocument();
    }
    // Der Regler trägt seinen Namen als aria-label; sichtbar steht er NICHT (kein <label>-Text).
    const regler = screen.getByRole("slider", { name: new RegExp(AKUSTIK_TEXTE.de.toeneLaut) });
    expect(regler).toHaveAttribute("aria-label", AKUSTIK_TEXTE.de.toeneLaut);
    const sichtbar = [...container.querySelectorAll("*")]
      .filter((el) => el.children.length === 0 && !el.closest("[aria-hidden='true']"))
      .map((el) => el.textContent ?? "");
    expect(sichtbar).not.toContain(AKUSTIK_TEXTE.de.toeneLaut);
    // Jede Karte hat ihr Symbol (SVG, aria-hidden).
    expect(container.querySelectorAll("svg[aria-hidden='true']").length).toBeGreaterThanOrEqual(7);
  });

  it("★ nicht breiter als sein Rahmen: der Inhalt trägt kein eigenes festes w-80 (rechts abgeschnitten, 18.10.2026)", () => {
    const { container } = zeige();
    expect((container.firstElementChild as HTMLElement).className).not.toMatch(/\bw-80\b|sm:w-80/);
  });

  it("alsProzent rundet", () => {
    expect(alsProzent(0.349)).toBe("35 %");
    expect(alsProzent(1)).toBe("100 %");
  });
});

describe("Kopfzeile: der Lautsprecher-Schalter", () => {
  const zeige = (over: Partial<React.ComponentProps<typeof AppKopfzeile>> = {}) =>
    render(
      <MemoryRouter>
        <AppKopfzeile
          titel="Tastenflow"
          onHilfe={() => {}}
          onKurztasten={() => {}}
          account={{ id: "u1", name: "Jano", classCode: "5A3" }}
          onAbmelden={() => {}}
          onVorlesen={() => {}}
          vorlesenAn={false}
          {...over}
        />
      </MemoryRouter>,
    );

  it("★ ohne Menü: der Schalter bleibt, was er war (aria-pressed, kein Aufklappen)", () => {
    zeige();
    const knopf = screen.getByRole("button", { name: /^Vorlesen/ });
    expect(knopf).toHaveAttribute("aria-pressed", "false");
    expect(knopf).not.toHaveAttribute("aria-expanded");
  });

  it("★ mit Menü: Klick öffnet es unter dem Knopf, Escape schliesst und gibt den Fokus zurück", () => {
    const onVorlesen = vi.fn();
    zeige({
      onVorlesen,
      akustikMenue: {
        inhalt: <p>Inhalt des Menüs</p>,
        tipp: "Klang und Vorlesen einstellen",
        name: "Klang und Vorlesen",
      },
    });
    const knopf = screen.getByRole("button", { name: "Klang und Vorlesen" });
    expect(knopf).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Inhalt des Menüs")).toBeNull();

    fireEvent.click(knopf);
    expect(knopf).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Inhalt des Menüs")).toBeInTheDocument();
    // Der Druck selbst schaltet das Vorlesen NICHT mehr um.
    expect(onVorlesen).not.toHaveBeenCalled();

    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(screen.queryByText("Inhalt des Menüs")).toBeNull();
  });

  it("★ der Knopf verspricht kein Kürzel, das ihn nicht öffnet", () => {
    zeige({ akustikMenue: { inhalt: <p>x</p>, tipp: "t", name: "Klang und Vorlesen" } });
    expect(screen.getByRole("button", { name: "Klang und Vorlesen" })).not.toHaveAttribute(
      "aria-keyshortcuts",
    );
  });

  it("das Menü steht in der Werkzeug-Reihe an der Stelle des alten Schalters", () => {
    zeige({ akustikMenue: { inhalt: <p>x</p>, tipp: "t", name: "Klang und Vorlesen" } });
    const nav = screen.getByRole("navigation", { name: "Werkzeuge" });
    expect(within(nav).getByRole("button", { name: "Klang und Vorlesen" })).toBeInTheDocument();
  });
});
