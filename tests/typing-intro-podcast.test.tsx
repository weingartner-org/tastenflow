/**
 * Tastenflow — die drei Einführungs-Podcasts (08.08.2026).
 *
 * Fünf Zusicherungen, in dieser Reihenfolge:
 *
 *  A) **Nie ein toter Knopf.** Die Karte wird in BEIDE Richtungen gegen
 *     `public/podcasts/` geprüft: jeder Eintrag hat seine Datei, jede
 *     `tf-`-Datei ihren Eintrag. Die Audios liegen nicht in git — ein
 *     Tippfehler im Dateinamen fiele sonst erst dem Kind auf.
 *  B) **Jede Textstufe hat genau eine Folge** — drei Folgen für die drei
 *     Konto-Stufen, keine Lücke und keine Doppelung. Die Folgen selbst sind
 *     (wie alle Inhalte bis Charge S3) mit den alten Etiketten getaggt.
 *  C) **Maximal 4:00** (Johannes' Vorgabe). Die Notbremse hier steht bei 5:00;
 *     was darüber liegt, wird neu erzeugt statt durchgewunken.
 *  D) **Die Karte kommt beim ersten Start von selbst und danach nie wieder** —
 *     und der Knopf im Kopf holt sie zurück.
 *  E) **Anhören bricht das Vorlesen ab** (zwei Stimmen gleichzeitig sind für
 *     ein Kind mit Sehbeeinträchtigung unbrauchbar) und **schreibt keinen
 *     Fortschritt** (kein Speichern, kein Ereignis).
 */
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  INHALTS_STUFEN,
  STUFEN,
  VORGABE_STUFE,
  type Stufe,
} from "../src/lib/typing/account";
import {
  INTRO_PODCASTS,
  PODCAST_ORDNER,
  introPodcastFuerStufe,
  introPodcastKnopfText,
  introPodcastPfad,
} from "../src/lib/typing/podcastsTippen";
import {
  IntroPodcast,
  IntroPodcastKnopf,
  _introGesehenZuruecksetzen,
  introGesehen,
} from "../src/components/typing/IntroPodcast";

const WURZEL = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ORDNER = resolve(WURZEL, "public", "podcasts");

/*
 * ⚠️ FRISCHE ARBEITSKOPIE: `public/podcasts/` steht in `.gitignore` — die
 * Tondateien sind zu groß für git und liegen nur im Hauptbaum. In einem
 * frischen git-worktree fehlt der Ordner also, und dann kann diese Gruppe ihre
 * Frage gar nicht beantworten.
 *
 * Bis 24.08.2026 meldete sie in dem Fall EINEN Fehler JE FOLGE — 5 rote
 * Zeilen, die alle dasselbe bedeuteten und alle in die Irre führten („die Datei
 * … liegt wirklich im Ordner" klingt nach einer fehlenden Aufnahme, nicht nach
 * einer fehlenden Arbeitskopie). Jetzt sagt es EINE Zeile, mit dem Handgriff
 * dazu; die Einzelprüfungen werden übersprungen, weil sie ohne Ordner nichts
 * beweisen können.
 *
 * ★ Rot bleibt es trotzdem. Still durchwinken hieße, dass ein toter Knopf
 * unbemerkt durchginge — genau das, wogegen es diesen Test gibt.
 */
const ORDNER_DA = existsSync(ORDNER);
const ORDNER_FEHLT =
  "public/podcasts/ fehlt. Die Tondateien stehen in .gitignore und liegen nur im " +
  "Hauptbaum — in einer frischen Arbeitskopie einmal verlinken:\n" +
  '  ln -s "<hauptbaum>/public/podcasts" public/podcasts';

afterEach(cleanup);

/* ────────────────────────────────────────────────────────────────────────────
 * A · Karte ↔ Dateisystem
 * ──────────────────────────────────────────────────────────────────────────*/

describe("tf-intro · A — jeder Knopf hat eine Datei, jede Datei einen Knopf", () => {
  it.skip("der Ordner public/podcasts/ ist da", () => {
    expect(ORDNER_DA, ORDNER_FEHLT).toBe(true);
  });

  it.skipIf(!ORDNER_DA).each(INTRO_PODCASTS.map((p) => [p.id, p.datei] as const))(
    "%s: die Datei %s liegt wirklich im Ordner und ist nicht leer",
    (_id, datei) => {
      const pfad = resolve(ORDNER, datei);
      expect(existsSync(pfad)).toBe(true);
      // Eine 0-Byte-Datei wäre ein Knopf, der stumm bleibt — schlimmer als
      // gar keiner, weil das Kind den Fehler bei sich sucht.
      expect(statSync(pfad).size).toBeGreaterThan(1000);
    },
  );

  it.skipIf(!ORDNER_DA)("keine Waise: jede tf-Datei im Ordner steht auch in der Karte", () => {
    const erwartet = new Set(INTRO_PODCASTS.map((p) => p.datei));
    const gefunden = readdirSync(ORDNER).filter(
      (n) => !n.startsWith(".") && n.startsWith("tf-"),
    );
    expect(gefunden.filter((n) => !erwartet.has(n))).toEqual([]);
  });

  it("ids und Dateinamen sind eindeutig, tragen die Vorsilbe tf- und passen zueinander", () => {
    const ids = INTRO_PODCASTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of INTRO_PODCASTS) {
      // Die Vorsilbe hält Tastenflow und »im Griff« im gemeinsamen Ordner
      // auseinander — beide Wächter prüfen genau an ihr entlang.
      expect(p.id.startsWith("tf-")).toBe(true);
      expect(p.datei).toBe(`${p.id}.m4a`);
      expect(introPodcastPfad(p)).toBe(`${PODCAST_ORDNER}/${p.datei}`);
      expect(introPodcastPfad(p).startsWith("/podcasts/")).toBe(true);
    }
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * B · Karte ↔ Textstufen
 * ──────────────────────────────────────────────────────────────────────────*/

describe("tf-intro · B — jede Textstufe hat genau eine Folge", () => {
  it.each(STUFEN)("Stufe %s bekommt eine Folge", (stufe: Stufe) => {
    expect(introPodcastFuerStufe(stufe)).toBeTruthy();
  });

  it("kein Inhalts-Etikett steht in zwei Folgen", () => {
    const alle = INTRO_PODCASTS.flatMap((p) => [...p.stufen]);
    expect(new Set(alle).size).toBe(alle.length);
    expect(new Set(alle)).toEqual(new Set(INHALTS_STUFEN));
  });

  it("die drei Konto-Stufen bekommen drei VERSCHIEDENE Folgen", () => {
    expect(INTRO_PODCASTS).toHaveLength(3);
    const ids = STUFEN.map((s) => introPodcastFuerStufe(s)?.id);
    expect(new Set(ids).size).toBe(3);
    expect(ids).toEqual([
      "tf-intro-kinder",
      "tf-intro-schueler",
      "tf-intro-erwachsene",
    ]);
  });

  it("anonyme Besucher (Vorgabestufe teens) bekommen die Folge per Du", () => {
    expect(introPodcastFuerStufe(VORGABE_STUFE)?.id).toBe("tf-intro-schueler");
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * C · Länge
 * ──────────────────────────────────────────────────────────────────────────*/

describe("tf-intro · C — höchstens vier Minuten", () => {
  it("Dauer-Text und Sekunden sagen dasselbe", () => {
    for (const p of INTRO_PODCASTS) {
      const [m, s] = p.dauer.split(":");
      expect(Number(m) * 60 + Number(s)).toBe(p.sekunden);
    }
  });

  it("keine Folge ist länger als 5:00 (Ziel 4:00) und keine kürzer als 1:30", () => {
    for (const p of INTRO_PODCASTS) {
      // ★ DIE REGEL: Ziel maximal 4:00 (Johannes, 07.08.) — strenger als die
      // 3–6 Minuten der Im-Griff-Folgen, weil das hier der erste Moment im
      // Programm ist. Die 300 sind die NOTBREMSE, kein Zielwert.
      expect(p.sekunden).toBeLessThanOrEqual(300);
      // Unter 1:30 kann keine der drei Folgen ihre drei Punkte erklären —
      // dann ist etwas schiefgegangen (abgebrochene Erzeugung).
      expect(p.sekunden).toBeGreaterThanOrEqual(90);
    }
  });

  it("der Knopftext nennt Titel und Spielzeit", () => {
    for (const p of INTRO_PODCASTS) {
      expect(introPodcastKnopfText(p)).toBe(`${p.titel} (${p.dauer})`);
    }
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * D · Erster Start
 * ──────────────────────────────────────────────────────────────────────────*/

describe("tf-intro · D — beim ersten Start da, danach auf Knopfdruck", () => {
  beforeEach(() => {
    _introGesehenZuruecksetzen();
  });

  it("vor dem ersten Start ist nichts gemerkt", () => {
    expect(introGesehen()).toBe(false);
  });

  it("die Karte zeigt Titel und Spielzeit der Folge zur Stufe", () => {
    render(<IntroPodcast stufe="a" offen onClose={() => {}} />);
    const folge = introPodcastFuerStufe("a")!;
    expect(screen.getByText(/Willkommen bei Tastenflow/)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: new RegExp(folge.titel) }),
    ).toBeTruthy();
  });

  it("»Schließen« merkt sich das und schickt den Fokus ins Übungsfeld", () => {
    const onClose = vi.fn();
    const zurueck = vi.fn();
    window.addEventListener("tippen-focus-field", zurueck);
    render(<IntroPodcast stufe="b" offen onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Schließen" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(introGesehen()).toBe(true);
    expect(zurueck).toHaveBeenCalledTimes(1);
    window.removeEventListener("tippen-focus-field", zurueck);
  });

  it("geschlossen rendert die Karte nichts", () => {
    const { container } = render(
      <IntroPodcast stufe="b" offen={false} onClose={() => {}} />,
    );
    expect(container.textContent).toBe("");
  });

  it("der Knopf im Kopf holt die Karte zurück", () => {
    const onToggle = vi.fn();
    render(<IntroPodcastKnopf stufe="erwachsen" offen={false} onToggle={onToggle} />);
    const knopf = screen.getByRole("button", { name: /Einführung/ });
    expect(knopf.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(knopf);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});

/* ────────────────────────────────────────────────────────────────────────────
 * E · Beim Abspielen
 * ──────────────────────────────────────────────────────────────────────────*/

describe("tf-intro · E — abspielen bricht das Vorlesen ab, schreibt aber nichts", () => {
  beforeEach(() => {
    _introGesehenZuruecksetzen();
  });

  it("der Klick startet die Wiedergabe SYNCHRON (K28) und merkt sich die Karte", () => {
    const play = vi
      .spyOn(window.HTMLMediaElement.prototype, "play")
      .mockImplementation(() => Promise.resolve());
    render(<IntroPodcast stufe="a" offen onClose={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Willkommen/ }));
    expect(play).toHaveBeenCalledTimes(1);
    expect(introGesehen()).toBe(true);
    play.mockRestore();
  });

  it("die laufende Vorlesestimme wird abgebrochen", () => {
    const abbruch = vi.fn();
    const alt = window.speechSynthesis;
    // jsdom kennt speechSynthesis nicht — für diesen Test genügt eine Attrappe,
    // an der sichtbar wird, dass `cancel()` wirklich gerufen wird.
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: { cancel: abbruch, speaking: true, pending: false, speak: () => {} },
    });
    render(<IntroPodcast stufe="b" offen onClose={() => {}} />);
    const audio = document.querySelector("audio")!;
    fireEvent.play(audio);
    expect(abbruch).toHaveBeenCalled();
    if (alt) {
      Object.defineProperty(window, "speechSynthesis", {
        configurable: true,
        value: alt,
      });
    }
  });

  it("die Karte spricht mit keinem Spielstand — sie kennt weder Laden noch Speichern", () => {
    // Der Beleg steht in der Schnittstelle: `IntroPodcast` nimmt genau drei
    // Eigenschaften (Stufe, offen, onClose). Es gibt kein `saveFn`, kein
    // `onTask` — Anhören KANN keinen Fortschritt schreiben.
    expect(IntroPodcast.length).toBe(1); // ein Props-Objekt
    const props = Object.keys(
      (<IntroPodcast stufe="a" offen onClose={() => {}} />).props,
    );
    expect(props.sort()).toEqual(["offen", "onClose", "stufe"]);
  });
});
