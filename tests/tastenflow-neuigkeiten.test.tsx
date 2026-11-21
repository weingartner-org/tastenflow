/**
 * WÄCHTER: „Was gibt's Neues" - einmal je BESTEHENDER Lehrkraft (Z3, 19.09.2026).
 * ===========================================================================
 * Johannes, 19.09.2026, wörtlich: *„bestehende Lehrer bekommen beim nächsten
 * Mal Anmelden ein Popup mit ‚Was gibt's Neues:', in dem du die neue
 * Benutzeroberfläche erklärst, die neuen Wochenaufgaben, die eigene Übungen
 * (auch in der Tippchallenge), der Übungspool"*.
 *
 * Die Regel: `src/lib/typing/neuigkeiten.ts`. Das Fenster:
 * `src/components/typing/NeuigkeitenFenster.tsx`, eingehängt in
 * `MeineKlassePage` und `TippenTrainerPage`.
 *
 * ⚠️ „Server" heisst hier das lokale Mock-Backend (`typingBackend()` ohne
 * `VITE_BACKEND=pocketbase`) - es trägt dasselbe Feld `neuigkeitenGesehen`
 * am Konto wie `tt_teachers` am echten PocketBase. Ein ZWEITES GERÄT ist
 * darum: das Konto trägt die Fassung, der Merker im `localStorage` fehlt.
 *
 * ★★★ WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD
 * ([[feedback_gruener_waechter_beweist_was]]):
 *  · Eine neue Lehrkraft, ein Kind, ein selbstlernendes Konto sieht es - rot.
 *  · Es kommt nach „Verstanden" wieder, am selben oder am zweiten Gerät - rot.
 *  · Es erscheint in der Klassenseite von Punktgenau - rot.
 *  · Es liegt unter einem anderen Fenster und Escape schliesst beide - rot.
 *  · Ein deutsches Wort in der englischen Fassung - rot (mit Gegenprobe).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useState, type ReactNode } from "react";

import { NeuigkeitenFenster, NEUIGKEITEN_TEXTE } from "@/components/typing/NeuigkeitenFenster";
import { MeineKlassePage } from "@/features/public/MeineKlassePage";
import { TippenTrainerPage } from "@/features/public/TippenTrainerPage";
import { Modal } from "@/components/Modal";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import { typingBackend } from "@/lib/typing/backend";
import type { TypingAccount } from "@/lib/typing";
import {
  addPupil,
  createClass,
  getNeuigkeitenStand,
  registerTeacher,
  setNeuigkeitenGesehen,
} from "@/lib/typing/account";
import {
  NEUIGKEITEN_FASSUNG,
  NEUIGKEITEN_STICHTAG_MS,
  neuigkeitenEntscheiden,
  neuigkeitenLokalLesen,
  neuigkeitenLokalSchluessel,
} from "@/lib/typing/neuigkeiten";
import { einrichtungFertigMerken } from "@/lib/typing/einrichtung";
import { BedienSpracheProvider, type BedienSprache } from "@/lib/bedienSprache";
import { findeDeutsch } from "./helfer/deutschFaenger";

const TITEL_DE = "Was gibt's Neues";
const TITEL_EN = "What's new";

/** Eine Lehrkraft, deren Konto es VOR dem Stichtag schon gab. */
function bestehendeLehrkraft(): TypingAccount {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-01T10:00:00+02:00"));
  const t = registerTeacher("Frau Berger", `berger-${Math.random()}@example.org`, "geheim123");
  vi.useRealTimers();
  if (!t.ok) throw new Error(t.error);
  expect(t.value.createdAt).toBeLessThan(NEUIGKEITEN_STICHTAG_MS);
  return t.value;
}

/** Eine Lehrkraft, die sich nach dem Stichtag angemeldet hat (heute). */
function neueLehrkraft(): TypingAccount {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-20T10:00:00+02:00"));
  const t = registerTeacher("Herr Adam", `adam-${Math.random()}@example.org`, "geheim123");
  vi.useRealTimers();
  if (!t.ok) throw new Error(t.error);
  return t.value;
}

/** Bedienung gewählt - so, wie der Sprachschalter oder `?bedienung=…` es tut. */
function stelleBedienung(sprache: BedienSprache | null) {
  if (sprache) {
    localStorage.setItem("tastenflow-bedienung", sprache);
  } else {
    localStorage.removeItem("tastenflow-bedienung");
  }
}

/** Nur das Fenster, wie in „Meine Klassen" für Tastenflow. */
function zeigeFenster(programm: string | null = "tippen", extra?: ReactNode) {
  return render(
    <BedienSpracheProvider>
      <MemoryRouter initialEntries={["/meine-klasse?app=tippen"]}>
        <h1 id="seitentitel" tabIndex={-1}>
          Meine Klassen
        </h1>
        <NeuigkeitenFenster ort="meine-klassen" programm={programm} />
        {extra}
      </MemoryRouter>
    </BedienSpracheProvider>,
  );
}

/** Wartet, bis die (asynchrone) Server-Frage beantwortet ist. */
async function ruhe() {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 20));
  });
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  einrichtungFertigMerken();
  useTypingAuth.setState({ account: null });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  useTypingAuth.setState({ account: null });
  document.body.style.overflow = "";
});

// ---------------------------------------------------------------------------
// Die Regel
// ---------------------------------------------------------------------------

describe("Die Regel (neuigkeitenEntscheiden)", () => {
  const ALT = NEUIGKEITEN_STICHTAG_MS - 86_400_000;
  const NEU = NEUIGKEITEN_STICHTAG_MS + 3_600_000;
  const F = NEUIGKEITEN_FASSUNG;

  it.each([
    ["Kind", "schueler", ALT, "", null, "nichts"],
    ["neue Lehrkraft", "lehrkraft", NEU, "", null, "nichts"],
    ["bestehende Lehrkraft, noch nicht gesehen", "lehrkraft", ALT, "", null, "zeigen"],
    ["Anlegedatum unbekannt (0) gilt als bestehend", "lehrkraft", 0, "", null, "zeigen"],
    ["am Server quittiert (zweites Gerät)", "lehrkraft", ALT, F, null, "nichts"],
    ["nur das Gerät hat quittiert ⇒ nachschreiben", "lehrkraft", ALT, "", F, "nachtragen"],
    ["Server nicht lesbar ⇒ lieber nichts", "lehrkraft", ALT, null, null, "nichts"],
    ["eine ALTE Fassung am Server ⇒ die neue zeigen", "lehrkraft", ALT, "2020-01-01", null, "zeigen"],
  ] as const)("%s", (_name, rolle, erstelltMs, serverGesehen, lokalGesehen, erwartet) => {
    expect(neuigkeitenEntscheiden({ rolle, erstelltMs, serverGesehen, lokalGesehen })).toBe(erwartet);
  });
});

// ---------------------------------------------------------------------------
// Das Fenster
// ---------------------------------------------------------------------------

describe("Eine BESTEHENDE Lehrkraft sieht das Fenster genau einmal", () => {
  it("★★★★★ erscheint, Fokus auf dem ersten Satz, „Verstanden\" merkt es am Konto UND am Gerät", async () => {
    const lehrkraft = bestehendeLehrkraft();
    useTypingAuth.setState({ account: lehrkraft });
    zeigeFenster();

    const dialog = await screen.findByRole("dialog", { name: TITEL_DE });
    const t = NEUIGKEITEN_TEXTE.de;
    // Der Fokus steht auf dem ersten Satz - nicht irgendwo auf der Seite.
    await waitFor(() => expect(document.activeElement?.textContent).toBe(t.einleitung));
    // Die fünf Abschnitte stehen als Überschriften da.
    const ueberschriften = within(dialog)
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(ueberschriften).toEqual(t.abschnitte.map((a) => a[0]));
    // Was Johannes aufgezählt hat: Oberfläche, Wochenaufgaben, Eigene Übung
    // (auch in der Tippchallenge), der Übungspool.
    const text = dialog.textContent ?? "";
    for (const stichwort of [
      "Lernstand",
      "Kinder und Zugänge",
      "Stunde sperren",
      "Klassenüberblick",
      "Minuten pro Woche",
      "Montag 8:00",
      "Eigene Übung starten",
      "Tippchallenge mit eigenem Text",
      "Meine Texte",
      "Zeichenabstand groß (CVI)",
      "Handbuch",
    ])
      expect(text).toContain(stichwort);
    // Hausregeln: kein `title`, nur Bindestrich, keine Maus-Wörter.
    expect(dialog.querySelectorAll("[title]")).toHaveLength(0);
    expect(text).not.toMatch(/[–—]/);
    expect(text).not.toMatch(/klick|Maus|scroll/i);
    // Der Knopf zum Handbuch ist da (ein echter Knopf, kein toter Text).
    expect(within(dialog).getByRole("button", { name: /Tastenflow-Handbuch herunterladen/ })).toBeTruthy();

    fireEvent.click(within(dialog).getByRole("button", { name: "Verstanden" }));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: TITEL_DE })).toBeNull());
    expect(getNeuigkeitenStand(lehrkraft.id)?.gesehen).toBe(NEUIGKEITEN_FASSUNG);
    expect(neuigkeitenLokalLesen(lehrkraft.id)).toBe(NEUIGKEITEN_FASSUNG);
    // Der Fokus geht zurück auf die Hauptüberschrift, wo er vorher war.
    await waitFor(() => expect(document.activeElement?.id).toBe("seitentitel"));
  });

  it("★★★★★ kommt nach „Verstanden\" nicht wieder - auch nicht auf einem ZWEITEN Gerät", async () => {
    const lehrkraft = bestehendeLehrkraft();
    useTypingAuth.setState({ account: lehrkraft });
    zeigeFenster();
    fireEvent.click(await screen.findByRole("button", { name: "Verstanden" }));
    cleanup();

    // Dasselbe Gerät, neu geöffnet.
    zeigeFenster();
    await ruhe();
    expect(screen.queryByRole("dialog")).toBeNull();
    cleanup();

    // Zweites Gerät: Der Merker im Browser fehlt, das Konto trägt die Fassung.
    localStorage.removeItem(neuigkeitenLokalSchluessel(lehrkraft.id));
    zeigeFenster();
    await ruhe();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("zweites Gerät, auf dem ANDEREN Gerät quittiert (nur Server-Feld gesetzt) - nichts", async () => {
    const lehrkraft = bestehendeLehrkraft();
    setNeuigkeitenGesehen(lehrkraft.id, NEUIGKEITEN_FASSUNG);
    useTypingAuth.setState({ account: lehrkraft });
    zeigeFenster();
    await ruhe();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("Escape schliesst - und gilt ebenso als gesehen", async () => {
    const lehrkraft = bestehendeLehrkraft();
    useTypingAuth.setState({ account: lehrkraft });
    zeigeFenster();
    await screen.findByRole("dialog", { name: TITEL_DE });
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(getNeuigkeitenStand(lehrkraft.id)?.gesehen).toBe(NEUIGKEITEN_FASSUNG);
  });

  it("scheitert das Schreiben: auf dem Gerät bleibt es zu, beim nächsten Öffnen wird nachgeschrieben", async () => {
    const lehrkraft = bestehendeLehrkraft();
    useTypingAuth.setState({ account: lehrkraft });
    const schreiben = vi.spyOn(typingBackend(), "setNeuigkeitenGesehen").mockResolvedValue(false);
    zeigeFenster();
    fireEvent.click(await screen.findByRole("button", { name: "Verstanden" }));
    await waitFor(() => expect(schreiben).toHaveBeenCalledTimes(1));
    expect(getNeuigkeitenStand(lehrkraft.id)?.gesehen).toBe(""); // Server hat nichts
    expect(neuigkeitenLokalLesen(lehrkraft.id)).toBe(NEUIGKEITEN_FASSUNG);
    cleanup();

    // Nächstes Öffnen: kein Fenster, aber ein zweiter Schreibversuch.
    schreiben.mockRestore();
    const nochmal = vi.spyOn(typingBackend(), "setNeuigkeitenGesehen");
    zeigeFenster();
    await ruhe();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(nochmal).toHaveBeenCalledWith(lehrkraft.id, NEUIGKEITEN_FASSUNG);
    expect(getNeuigkeitenStand(lehrkraft.id)?.gesehen).toBe(NEUIGKEITEN_FASSUNG);
  });
});

describe("Wer es NICHT sieht", () => {
  it("eine NEUE Lehrkraft (Konto nach dem Stichtag)", async () => {
    useTypingAuth.setState({ account: neueLehrkraft() });
    zeigeFenster();
    await ruhe();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("ein Kind einer Klasse und ein selbstlernendes Konto (auch mit altem Konto)", async () => {
    const lehrkraft = bestehendeLehrkraft();
    const c = createClass(lehrkraft.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    const p = addPupil(c.value.code, "Mia", "pw1234");
    if (!p.ok) throw new Error(p.error);
    const kind = { ...p.value, createdAt: 1 };
    const selbstlernend: TypingAccount = { ...kind, classCode: undefined, selfManaged: true };
    for (const konto of [kind, selbstlernend]) {
      useTypingAuth.setState({ account: konto });
      zeigeFenster();
      await ruhe();
      expect(screen.queryByRole("dialog")).toBeNull();
      cleanup();
    }
  });

  it("die Klassenseite eines ANDEREN Programms (Punktgenau, »Im Griff«)", async () => {
    useTypingAuth.setState({ account: bestehendeLehrkraft() });
    for (const programm of ["braille", "klangpunkte", "computer"]) {
      zeigeFenster(programm);
      await ruhe();
      expect(screen.queryByRole("dialog")).toBeNull();
      cleanup();
    }
    // Gegenprobe: dieselbe Lehrkraft in Tastenflow sieht es.
    zeigeFenster("tippen");
    expect(await screen.findByRole("dialog", { name: TITEL_DE })).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Eingehängt in den echten Seiten
// ---------------------------------------------------------------------------

describe("In den echten Seiten", () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = () => {};
  });

  function zeigeMeineKlassen(pfad: string) {
    render(
      <BedienSpracheProvider>
        <MemoryRouter initialEntries={[pfad]}>
          <Routes>
            <Route path="/lernwerkstatt/:programm/klasse" element={<MeineKlassePage />} />
          </Routes>
        </MemoryRouter>
      </BedienSpracheProvider>,
    );
  }

  it("„Meine Klassen\" für Tastenflow: ja - für Punktgenau: nein", async () => {
    // Punktgenau ist Code-seitig `draft` - hier freigegeben wie in
    // `tests/meine-klasse-programme-je-einstieg.test.tsx`, damit die Seite es zeigt.
    localStorage.setItem(
      "sensorik:v1:appSettings:programme-overrides",
      JSON.stringify({ braille: { released: true } }),
    );
    const lehrkraft = bestehendeLehrkraft();
    const c = createClass(lehrkraft.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    useTypingAuth.setState({ account: lehrkraft });

    zeigeMeineKlassen("/lernwerkstatt/braille/klasse");
    await screen.findByRole("heading", { name: "3b" }, { timeout: 5000 });
    await ruhe();
    expect(screen.queryByRole("dialog", { name: TITEL_DE })).toBeNull();
    cleanup();

    zeigeMeineKlassen("/lernwerkstatt/tippen/klasse");
    const dialog = await screen.findByRole("dialog", { name: TITEL_DE }, { timeout: 5000 });
    fireEvent.click(within(dialog).getByRole("button", { name: "Verstanden" }));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: TITEL_DE })).toBeNull());
    // Die Seite lässt sich danach wieder rollen.
    await waitFor(() => expect(document.body.style.overflow).toBe(""));
  });

  function zeigeUeben(state?: unknown) {
    render(
      <BedienSpracheProvider>
        <MemoryRouter initialEntries={[{ pathname: "/", state }]}>
          <Routes>
            <Route path="/" element={<TippenTrainerPage />} />
            <Route path="*" element={<div>ANDERSWO</div>} />
          </Routes>
        </MemoryRouter>
      </BedienSpracheProvider>,
    );
  }

  it("Übungsseite: nur für die Lehrkraft, die über „Selbst üben\" kam", async () => {
    const lehrkraft = bestehendeLehrkraft();
    useTypingAuth.setState({ account: lehrkraft });
    zeigeUeben({ selbstUeben: true });
    const dialog = await screen.findByRole("dialog", { name: TITEL_DE }, { timeout: 5000 });
    fireEvent.click(within(dialog).getByRole("button", { name: "Verstanden" }));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: TITEL_DE })).toBeNull());
    cleanup();

    // Quittiert in der Übungsseite ⇒ in „Meine Klassen" nicht noch einmal.
    zeigeFenster();
    await ruhe();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("Übungsseite ohne „Selbst üben\" (wird weitergeleitet) und für ein Kind: nichts", async () => {
    const lehrkraft = bestehendeLehrkraft();
    useTypingAuth.setState({ account: lehrkraft });
    zeigeUeben();
    await screen.findByText("ANDERSWO", undefined, { timeout: 5000 });
    await ruhe();
    expect(screen.queryByRole("dialog", { name: TITEL_DE })).toBeNull();
    cleanup();

    const c = createClass(lehrkraft.id, "3c", "3C");
    if (!c.ok) throw new Error(c.error);
    const p = addPupil(c.value.code, "Jano", "pw1234");
    if (!p.ok) throw new Error(p.error);
    useTypingAuth.setState({ account: { ...p.value, createdAt: 1 } });
    zeigeUeben({ selbstUeben: true });
    await ruhe();
    expect(screen.queryByRole("dialog", { name: TITEL_DE })).toBeNull();
    // Nichts ist am Konto der Lehrkraft verbucht - sie sieht es später noch.
    expect(getNeuigkeitenStand(lehrkraft.id)?.gesehen).toBe("");
  });
});

// ---------------------------------------------------------------------------
// Ein Fenster zur Zeit
// ---------------------------------------------------------------------------

describe("Ein anderes Fenster hat Vorrang", () => {
  /** Ein fremdes Fenster (steht für den Spendenbanner), von aussen zu öffnen. */
  let oeffneFremdes: (auf: boolean) => void = () => {};
  function Fremdes() {
    const [auf, setAuf] = useState(false);
    oeffneFremdes = setAuf;
    return auf ? (
      <Modal title="Ein Meilenstein" onClose={() => setAuf(false)}>
        <button type="button">Später</button>
      </Modal>
    ) : null;
  }

  it("★★★★ öffnet sich ein anderes Fenster, tritt dieses zurück - Escape schliesst nur das andere", async () => {
    const lehrkraft = bestehendeLehrkraft();
    useTypingAuth.setState({ account: lehrkraft });
    zeigeFenster("tippen", <Fremdes />);
    await screen.findByRole("dialog", { name: TITEL_DE });

    act(() => oeffneFremdes(true));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: TITEL_DE })).toBeNull());
    const fremd = screen.getByRole("dialog", { name: "Ein Meilenstein" });
    // Der Fokus gehört dem Fenster, das vorn steht.
    await waitFor(() => expect(fremd.contains(document.activeElement)).toBe(true));
    // Zurücktreten ist KEIN Quittieren.
    expect(getNeuigkeitenStand(lehrkraft.id)?.gesehen).toBe("");

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Ein Meilenstein" })).toBeNull());
    // Danach ist es wieder da - und noch immer nicht verbucht.
    expect(await screen.findByRole("dialog", { name: TITEL_DE })).toBeTruthy();
    expect(getNeuigkeitenStand(lehrkraft.id)?.gesehen).toBe("");

    fireEvent.click(screen.getByRole("button", { name: "Verstanden" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(getNeuigkeitenStand(lehrkraft.id)?.gesehen).toBe(NEUIGKEITEN_FASSUNG);
    // Die Seite lässt sich wieder rollen (zwei Fenster, nicht in umgekehrter Reihenfolge zu).
    await waitFor(() => expect(document.body.style.overflow).toBe(""));
  });

  it("steht beim Laden schon ein anderes Fenster offen, wartet dieses, bis es zu ist", async () => {
    useTypingAuth.setState({ account: bestehendeLehrkraft() });
    zeigeFenster("tippen", <Fremdes />);
    act(() => oeffneFremdes(true));
    await ruhe();
    expect(screen.queryByRole("dialog", { name: TITEL_DE })).toBeNull();
    act(() => oeffneFremdes(false));
    expect(await screen.findByRole("dialog", { name: TITEL_DE })).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Englisch (in der englischen Bedienung)
// ---------------------------------------------------------------------------

describe("Die englische Fassung", () => {
  it("★★★ kein deutsches Wort - und die Gegenprobe findet in der deutschen Fassung viele", async () => {
    const lehrkraft = bestehendeLehrkraft();
    useTypingAuth.setState({ account: lehrkraft });

    stelleBedienung("en");
    zeigeFenster();
    const en = await screen.findByRole("dialog", { name: TITEL_EN });
    // Gegen ein leeres Fenster: die Abschnitte stehen da.
    expect(en.textContent).toContain("Custom exercise");
    expect(en.textContent).toContain("My texts");
    expect(en.textContent).toContain("Pause goal for 1 hour");
    expect(within(en).getByRole("button", { name: "Got it" })).toBeTruthy();
    expect(findeDeutsch(en)).toEqual([]);
    const enText = en.textContent ?? "";
    expect(enText).not.toMatch(/\b(click|hover|mouse|scroll)/i);
    expect(enText).not.toMatch(/[–—!]/);
    cleanup();

    // Gegenprobe: dieselbe Lehrkraft, deutsche Bedienung.
    stelleBedienung(null);
    zeigeFenster();
    const de = await screen.findByRole("dialog", { name: TITEL_DE });
    expect(findeDeutsch(de).length).toBeGreaterThan(15);
  });

  it("beide Fassungen haben gleich viele Abschnitte und Punkte", () => {
    const de = NEUIGKEITEN_TEXTE.de.abschnitte;
    const en = NEUIGKEITEN_TEXTE.en.abschnitte;
    expect(en.map((a) => a.length)).toEqual(de.map((a) => a.length));
  });
});
