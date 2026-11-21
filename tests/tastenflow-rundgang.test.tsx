/**
 * WÄCHTER: der Rundgang beim ALLERERSTEN Betreten (Z4, 19.09.2026).
 * ===========================================================================
 * Johannes, 19.09.2026, wörtlich: *„für Schüler und Lehrer und alle
 * Selbstlernenden, die das allererste Mal Tastenflow betreten, nicht nach dem
 * Neuladen! Wenn jemand zuerst ohne Anmeldung übt und sich dann irgendwann
 * anmeldet, bekommt er keine Einführung mehr. Sie brauchen eine Einführung mit
 * Bereichserklärungen genau wie bei ‚Mit anderen Augen sehen'. Bei Lehrkräften
 * ist die Erklärung der ganzen neuen Oberfläche wichtig!"*
 *
 * Die Regel: `src/lib/typing/rundgang.ts`. Die Oberfläche:
 * `src/components/typing/Rundgang.tsx` (benutzt `SimEinfuehrung.tsx`, den
 * Baustein der Simulationen). Die Texte: `src/lib/typing/rundgangTexte.ts`.
 *
 * ⚠️ „Server" heisst hier das lokale Mock-Backend: Es trägt dasselbe Feld
 * `rundgaengeGesehen` am Konto wie `tt_pupils`/`tt_teachers` am echten
 * PocketBase. Ein NEUES GERÄT ist darum: das Konto trägt den Schlüssel, der
 * Merker im `localStorage` fehlt.
 *
 * ⚠️ jsdom rechnet kein Layout - der Leuchtrahmen entsteht hier nie (siehe
 * `tests/sim-einfuehrung.test.tsx`). Geprüft werden Text, Tasten, Merker und
 * Fokus; die Hervorhebung prüft der Browser-Probelauf.
 *
 * ★★★ WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD
 * ([[feedback_gruener_waechter_beweist_was]]):
 *  · Der Rundgang kommt nach dem Neuladen wieder - rot.
 *  · Wer als Gast geübt hat und sich anmeldet, bekommt ihn - rot.
 *  · Eine bestehende Lehrkraft bekommt ihn von selbst - rot.
 *  · Ein Anschlag im Rundgang erreicht das Übungsfeld - rot.
 *  · Ein Schritt nennt seinen Bereich nicht - rot.
 *  · Ein deutsches Wort in der englischen Fassung - rot (mit Gegenprobe).
 *  · Die Simulationen bekommen ungefragt Escape oder englische Wörter - rot.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { TippenTrainerPage } from "@/features/public/TippenTrainerPage";
import { MeineKlassePage } from "@/features/public/MeineKlassePage";
import { TippenHilfe } from "@/components/typing/TippenHilfe";
import { MeineKlasseHilfe } from "@/components/lernwerkstatt/klasse/MeineKlasseHilfe";
import { SimEinfuehrung, einfuehrungGesehen } from "@/components/SimEinfuehrung";
import {
  kinderUndZugaengeSchritte,
  meineKlassenSchritte,
  rundgangSatz,
  uebenSchritte,
  type RundgangSchritt,
} from "@/components/typing/Rundgang";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import type { TypingAccount } from "@/lib/typing";
import { loadProgress, saveProgress } from "@/lib/typing/progress";
import {
  addPupil,
  createClass,
  getNeuigkeitenStand,
  getRundgaengeGesehen,
  registerTeacher,
  setRundgaengeGesehen,
} from "@/lib/typing/account";
import { NEUIGKEITEN_FASSUNG, NEUIGKEITEN_STICHTAG_MS } from "@/lib/typing/neuigkeiten";
import {
  RUNDGANG_KINDER_UND_ZUGAENGE,
  RUNDGANG_MEINE_KLASSEN,
  RUNDGANG_UEBEN,
  fuerKontoNachzutragen,
  rundgangLehrkraftEntscheiden,
  rundgangUebenEntscheiden,
  useRundgangWunsch,
} from "@/lib/typing/rundgang";
import type { RundgangTon, RundgangWer } from "@/lib/typing/rundgangTexte";
import { einrichtungFertigMerken } from "@/lib/typing/einrichtung";
import { BedienSpracheProvider, type AktiveBedienSprache } from "@/lib/bedienSprache";
import { findeDeutsch, pruefeText } from "./helfer/deutschFaenger";

// ---------------------------------------------------------------------------
// Helfer
// ---------------------------------------------------------------------------

const RUNDGANG_DE = "Rundgang";
const RUNDGANG_EN = "Tour";

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

/** Eine Lehrkraft, die sich nach dem Stichtag angemeldet hat. */
function neueLehrkraft(): TypingAccount {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-20T10:00:00+02:00"));
  const t = registerTeacher("Herr Adam", `adam-${Math.random()}@example.org`, "geheim123");
  vi.useRealTimers();
  if (!t.ok) throw new Error(t.error);
  return t.value;
}

/** Ein Kind einer (neuen) Klasse - noch nie geübt. */
function neuesKind(): TypingAccount {
  const l = neueLehrkraft();
  const c = createClass(l.id, `3b-${Math.random().toString(36).slice(2, 6)}`, `K${Math.floor(Math.random() * 9000 + 1000)}`);
  if (!c.ok) throw new Error(c.error);
  const p = addPupil(c.value.code, "Mia", "pw1234");
  if (!p.ok) throw new Error(p.error);
  return p.value;
}

/**
 * Ein NEUES GERÄT für dasselbe Konto: Der Browser vergisst alles - ausser dem
 * Speicher des Mock-Backends, der hier „der Server" ist.
 */
function neuesGeraet() {
  const behalten = ["tippen-trainer:store:v1", "tippen-trainer:current"].map(
    (k) => [k, localStorage.getItem(k)] as const,
  );
  localStorage.clear();
  for (const [k, v] of behalten) if (v !== null) localStorage.setItem(k, v);
}

function stelleBedienung(sprache: AktiveBedienSprache | null) {
  if (sprache) {
    localStorage.setItem("tastenflow-bedienung", sprache);
  } else {
    localStorage.removeItem("tastenflow-bedienung");
  }
}

function zeigeUeben(state?: unknown) {
  return render(
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

function zeigeMeineKlassen(pfad = "/lernwerkstatt/tippen/klasse") {
  return render(
    <BedienSpracheProvider>
      <MemoryRouter initialEntries={[pfad]}>
        <Routes>
          <Route path="/lernwerkstatt/:programm/klasse" element={<MeineKlassePage />} />
        </Routes>
      </MemoryRouter>
    </BedienSpracheProvider>,
  );
}

/** Wartet, bis die (asynchronen) Fragen an Konto und Spielstand beantwortet sind. */
async function ruhe(ms = 60) {
  await act(async () => {
    await new Promise((r) => setTimeout(r, ms));
  });
}

/** Die Einrichtung ist da - und wird mit Escape übersprungen (ihr eigener Ausweg). */
async function einrichtungUeberspringen() {
  await waitFor(() => expect(document.getElementById("tippen-einrichtung-titel")).toBeTruthy(), {
    timeout: 5000,
  });
  fireEvent.keyDown(document, { key: "Escape" });
  await waitFor(() => expect(document.getElementById("tippen-einrichtung-titel")).toBeNull());
}

const rundgang = (name = RUNDGANG_DE, timeout = 5000) =>
  screen.findByRole("region", { name }, { timeout });
const keinRundgang = () => expect(screen.queryByRole("region", { name: RUNDGANG_DE })).toBeNull();
const uebungsfeld = () =>
  document.querySelector<HTMLTextAreaElement>('[data-typing-field="practice"]')!;
const zaehler = (region: HTMLElement) => region.querySelector("span")?.textContent ?? "";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  useTypingAuth.setState({ account: null });
  useRundgangWunsch.setState({ wunsch: null });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  useTypingAuth.setState({ account: null });
  useRundgangWunsch.setState({ wunsch: null });
  document.body.style.overflow = "";
});

// ---------------------------------------------------------------------------
// Die Regel
// ---------------------------------------------------------------------------

describe("Die Regel", () => {
  const ALT = NEUIGKEITEN_STICHTAG_MS - 86_400_000;
  const NEU = NEUIGKEITEN_STICHTAG_MS + 3_600_000;

  it.each([
    ["Gast, frisches Gerät", true, false, false, null, true],
    ["Gast, Einrichtung lief schon (Gerät kennt Tastenflow)", false, false, false, null, false],
    ["Gast, Gerät hat den Rundgang gesehen", true, true, false, null, false],
    ["Gast, auf dem Gerät wurde schon geübt", true, false, true, null, false],
    ["Kind, nie geübt", true, false, false, { rolle: "schueler", erstelltMs: NEU, gesehen: [], geuebt: false }, true],
    ["Kind, Konto kennt ihn (neues Gerät)", true, false, false, { rolle: "schueler", erstelltMs: NEU, gesehen: [RUNDGANG_UEBEN], geuebt: false }, false],
    ["Kind, hat schon geübt", true, false, false, { rolle: "schueler", erstelltMs: ALT, gesehen: [], geuebt: true }, false],
    ["Konto nicht lesbar ⇒ lieber nichts", true, false, false, { rolle: "schueler", erstelltMs: NEU, gesehen: null, geuebt: false }, false],
    ["bestehende Lehrkraft ⇒ „Was gibt's Neues“", true, false, false, { rolle: "lehrkraft", erstelltMs: ALT, gesehen: [], geuebt: false }, false],
    ["neue Lehrkraft übt zum ersten Mal", true, false, false, { rolle: "lehrkraft", erstelltMs: NEU, gesehen: [], geuebt: false }, true],
  ] as const)("Übungsseite: %s", (_n, einrichtungWarFaellig, geraetGesehen, geraetGeuebt, konto, erwartet) => {
    expect(
      rundgangUebenEntscheiden({
        einrichtungWarFaellig,
        geraetGesehen,
        geraetGeuebt,
        konto: konto ? { ...konto, gesehen: konto.gesehen ? [...konto.gesehen] : null } : null,
      }),
    ).toBe(erwartet);
  });

  it("„Meine Klassen“: nur neue Lehrkräfte - zuerst „Kinder und Zugänge“, dann der Lernstand", () => {
    const nichts = () => false;
    const kuz = (k: string) => k === RUNDGANG_KINDER_UND_ZUGAENGE;
    const fall = (
      schluessel: typeof RUNDGANG_MEINE_KLASSEN | typeof RUNDGANG_KINDER_UND_ZUGAENGE,
      erstelltMs: number,
      gesehen: (k: string) => boolean,
      ohneKlasseBeimLaden: boolean,
      kontoLesbar = true,
    ) => rundgangLehrkraftEntscheiden({ schluessel, erstelltMs, gesehen, kontoLesbar, ohneKlasseBeimLaden });

    expect(fall(RUNDGANG_KINDER_UND_ZUGAENGE, NEU, nichts, true)).toBe(true);
    expect(fall(RUNDGANG_KINDER_UND_ZUGAENGE, ALT, nichts, true)).toBe(false); // bestehend
    expect(fall(RUNDGANG_KINDER_UND_ZUGAENGE, 0, nichts, true)).toBe(false); // unbekannt = bestehend
    expect(fall(RUNDGANG_KINDER_UND_ZUGAENGE, NEU, kuz, true)).toBe(false); // schon gesehen
    expect(fall(RUNDGANG_KINDER_UND_ZUGAENGE, NEU, nichts, true, false)).toBe(false); // nicht lesbar
    expect(fall(RUNDGANG_MEINE_KLASSEN, NEU, kuz, false)).toBe(true);
    expect(fall(RUNDGANG_MEINE_KLASSEN, NEU, nichts, false)).toBe(false);
    expect(fall(RUNDGANG_MEINE_KLASSEN, ALT, kuz, false)).toBe(false);
    expect(fall(RUNDGANG_MEINE_KLASSEN, NEU, () => true, false)).toBe(false);
  });

  it("nachtragen: nur, was dem Konto fehlt - sonst kein Schreiben", () => {
    expect(fuerKontoNachzutragen([RUNDGANG_UEBEN], [])).toEqual([RUNDGANG_UEBEN]);
    expect(fuerKontoNachzutragen([RUNDGANG_UEBEN], [RUNDGANG_UEBEN])).toBeNull();
    expect(fuerKontoNachzutragen([], ["x"])).toBeNull();
    expect(fuerKontoNachzutragen([RUNDGANG_UEBEN, RUNDGANG_MEINE_KLASSEN], [RUNDGANG_MEINE_KLASSEN])).toEqual([
      RUNDGANG_MEINE_KLASSEN,
      RUNDGANG_UEBEN,
    ]);
  });
});

// ---------------------------------------------------------------------------
// Die Übungsseite
// ---------------------------------------------------------------------------

describe("Die Übungsseite - zum allerersten Mal", () => {
  it("★★★★★ erst die Einrichtung, dann der Rundgang - er nennt den Bereich und ist sofort gemerkt", async () => {
    zeigeUeben();
    // Solange die Einrichtung steht, gibt es keinen Rundgang.
    await waitFor(() => expect(document.getElementById("tippen-einrichtung-titel")).toBeTruthy(), {
      timeout: 5000,
    });
    keinRundgang();
    await einrichtungUeberspringen();

    const region = await rundgang();
    expect(zaehler(region)).toMatch(/^Rundgang 1 von \d$/);
    expect(region.textContent).toContain("Die Übungszeile:");
    // Der eigene Live-Bereich trägt den Schritt - und NUR ihn.
    await waitFor(() =>
      expect(document.querySelector("[data-rundgang-ansage]")?.textContent).toMatch(/^Die Übungszeile: /),
    );
    // Der Satz im Kasten ist KEIN zweiter Live-Bereich (sonst käme er doppelt).
    expect(region.querySelector("[aria-live]")).toBeNull();
    // Gemerkt, sobald er zu sehen ist - nicht erst bei „Fertig".
    expect(einfuehrungGesehen(RUNDGANG_UEBEN)).toBe(true);
    // Kein Fokus-Diebstahl.
    expect(region.contains(document.activeElement)).toBe(false);
    // Hausregeln im Kasten.
    expect(region.querySelectorAll("[title]")).toHaveLength(0);
    expect(region.textContent).not.toMatch(/[–—]/);
  });

  it("★★★★★ nach dem Neuladen nicht wieder - auch nicht mitten im Rundgang abgebrochen", async () => {
    zeigeUeben();
    await einrichtungUeberspringen();
    await rundgang();
    cleanup(); // „Neuladen" mitten im Rundgang

    zeigeUeben();
    await waitFor(() => expect(uebungsfeld()).toBeTruthy(), { timeout: 5000 });
    await ruhe();
    keinRundgang();
  });

  it("★★★★★ Tasten: kein Anschlag erreicht das Übungsfeld; Eingabe/Leer = Weiter; Escape beendet und holt den Fokus in die Zeile", async () => {
    zeigeUeben();
    await einrichtungUeberspringen();
    const region = await rundgang();
    const feld = uebungsfeld();
    act(() => feld.focus());

    // Ein Buchstabe im Übungsfeld: abgefangen, bevor irgendein Horcher der
    // Seite (oder React am Feld) ihn sieht.
    const seite = vi.fn();
    document.addEventListener("keydown", seite);
    const durch = fireEvent.keyDown(feld, { key: "f", code: "KeyF" });
    document.removeEventListener("keydown", seite);
    expect(durch).toBe(false); // preventDefault
    expect(seite).not.toHaveBeenCalled();
    expect(zaehler(region)).toMatch(/^Rundgang 1 /);
    // Auch ein Kürzel (Alt + H) öffnet nichts, solange der Rundgang steht.
    fireEvent.keyDown(feld, { key: "h", code: "KeyH", altKey: true });
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.keyDown(feld, { key: "Enter", code: "Enter" });
    await waitFor(() => expect(zaehler(region)).toMatch(/^Rundgang 2 /));
    fireEvent.keyDown(feld, { key: " ", code: "Space" });
    await waitFor(() => expect(zaehler(region)).toMatch(/^Rundgang 3 /));

    fireEvent.keyDown(feld, { key: "Escape", code: "Escape" });
    await waitFor(() => keinRundgang());
    await waitFor(() => expect(document.activeElement).toBe(uebungsfeld()));
    // Nichts davon zählte als Üben.
    expect((loadProgress().rounds ?? []).length).toBe(0);

    // Danach gehen die Tasten wieder ans Feld.
    const nachher = vi.fn();
    document.addEventListener("keydown", nachher);
    fireEvent.keyDown(uebungsfeld(), { key: "f", code: "KeyF" });
    document.removeEventListener("keydown", nachher);
    expect(nachher).toHaveBeenCalled();
  });

  it("ein Fenster hat Vorrang: der Rundgang tritt zurück und steht danach beim selben Schritt", async () => {
    zeigeUeben();
    await einrichtungUeberspringen();
    const region = await rundgang();
    fireEvent.click(within(region).getByRole("button", { name: /Weiter/ }));
    await waitFor(() => expect(zaehler(region)).toMatch(/^Rundgang 2 /));

    // Die Hilfe (ein Fenster) über den Knopf der Kopfzeile.
    fireEvent.click(screen.getByRole("button", { name: /^Hilfe/ }));
    await screen.findByRole("dialog");
    await waitFor(() => keinRundgang());
    // Escape gehört jetzt dem Fenster, nicht dem Rundgang.
    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Hilfe schließen" }));
    const wieder = await rundgang();
    expect(zaehler(wieder)).toMatch(/^Rundgang 2 /);
  });

  it("„Rundgang noch einmal“ in der Hilfe (Alt + H) holt ihn zurück", async () => {
    einrichtungFertigMerken();
    zeigeUeben();
    await waitFor(() => expect(uebungsfeld()).toBeTruthy(), { timeout: 5000 });
    await ruhe();
    keinRundgang();
    fireEvent.click(screen.getByRole("button", { name: /^Hilfe/ }));
    const hilfe = await screen.findByRole("dialog");
    fireEvent.click(within(hilfe).getByRole("button", { name: /Rundgang noch einmal/ }));
    const region = await rundgang();
    expect(zaehler(region)).toMatch(/^Rundgang 1 /);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("Anmelden - Gerät und Konto", () => {
  it("★★★★★ Gast sah den Rundgang und meldet sich an: kein zweiter, und das Konto merkt ihn", async () => {
    zeigeUeben();
    await einrichtungUeberspringen();
    const region = await rundgang();
    fireEvent.click(within(region).getByRole("button", { name: "Überspringen" }));
    await waitFor(() => keinRundgang());

    const kind = neuesKind();
    expect(getRundgaengeGesehen(kind.id)).toEqual([]);
    act(() => useTypingAuth.setState({ account: kind }));
    await waitFor(() => expect(getRundgaengeGesehen(kind.id)).toContain(RUNDGANG_UEBEN));
    await ruhe(200);
    keinRundgang();
  });

  it("★★★★★ Johannes' Satz wörtlich: wer zuerst OHNE Anmeldung geübt hat, bekommt nach dem Anmelden keine Einführung", async () => {
    // Das Gerät hat als Gast geübt - den Rundgang hat es nie gesehen (älter als Z4).
    einrichtungFertigMerken();
    saveProgress({ ...loadProgress(), xp: 40 });
    zeigeUeben();
    await waitFor(() => expect(uebungsfeld()).toBeTruthy(), { timeout: 5000 });
    await ruhe();
    keinRundgang();

    const kind = neuesKind();
    act(() => useTypingAuth.setState({ account: kind }));
    await waitFor(() => expect(getRundgaengeGesehen(kind.id)).toContain(RUNDGANG_UEBEN));
    cleanup();

    // Dasselbe Konto auf einem NEUEN Gerät: nichts im Browser, alles frisch.
    neuesGeraet();
    expect(einfuehrungGesehen(RUNDGANG_UEBEN)).toBe(false);
    useTypingAuth.setState({ account: kind });
    zeigeUeben();
    await einrichtungUeberspringen();
    await waitFor(() => expect(uebungsfeld()).toBeTruthy(), { timeout: 5000 });
    await ruhe(200);
    keinRundgang();
  });

  it("Konto kennt den Rundgang, neues Gerät: keiner - Gegenprobe ohne Konto-Eintrag: er kommt", async () => {
    const mit = neuesKind();
    setRundgaengeGesehen(mit.id, [RUNDGANG_UEBEN]);
    useTypingAuth.setState({ account: mit });
    zeigeUeben();
    await einrichtungUeberspringen();
    await waitFor(() => expect(uebungsfeld()).toBeTruthy(), { timeout: 5000 });
    await ruhe(200);
    keinRundgang();
    cleanup();

    neuesGeraet();
    const ohne = neuesKind();
    useTypingAuth.setState({ account: ohne });
    zeigeUeben();
    await einrichtungUeberspringen();
    const region = await rundgang();
    // Ein Kind einer Klasse: Stand-Zeile mit Wochenziel und Klassenmatch, Konto mit „Meine Statistik".
    expect(region.textContent).toContain("Die Übungszeile:");
    await waitFor(() => expect(getRundgaengeGesehen(ohne.id)).toContain(RUNDGANG_UEBEN));
  });
});

// ---------------------------------------------------------------------------
// „Meine Klassen"
// ---------------------------------------------------------------------------

describe("„Meine Klassen“ - Lehrkräfte", () => {
  it("★★★★★ bestehende Lehrkraft: „Was gibt's Neues“ mit „Rundgang durch die Seite“ - kein Rundgang von selbst", async () => {
    const lehrkraft = bestehendeLehrkraft();
    const c = createClass(lehrkraft.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    const p = addPupil(c.value.code, "Mia", "pw1234");
    if (!p.ok) throw new Error(p.error);
    useTypingAuth.setState({ account: lehrkraft });
    zeigeMeineKlassen();

    const fenster = await screen.findByRole("dialog", { name: "Was gibt's Neues" }, { timeout: 5000 });
    await ruhe(200);
    keinRundgang();

    fireEvent.click(within(fenster).getByRole("button", { name: /Rundgang durch die Seite/ }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    // Das Fenster gilt als gesehen …
    expect(getNeuigkeitenStand(lehrkraft.id)?.gesehen).toBe(NEUIGKEITEN_FASSUNG);
    // … und der Rundgang durch den Lernstand steht da, beim Klassenkopf.
    const region = await rundgang();
    expect(zaehler(region)).toMatch(/^Rundgang 1 von \d+$/);
    expect(region.textContent).toContain("Der Klassenkopf:");
    await waitFor(() => expect(getRundgaengeGesehen(lehrkraft.id)).toContain(RUNDGANG_MEINE_KLASSEN));

    // Die Schritte der Aufgaben-Reihe zeigen auf ihre Knöpfe.
    const namen: string[] = [];
    for (let i = 0; i < 12; i++) {
      const text = region.querySelector("strong")?.textContent ?? "";
      namen.push(text);
      const weiter = within(region).queryByRole("button", { name: /Weiter/ });
      if (!weiter) break;
      fireEvent.click(weiter);
      await waitFor(() => expect(region.querySelector("strong")?.textContent).not.toBe(text));
    }
    for (const n of ["Tippchallenge:", "Eigene Übung:", "Wochenziel:", "Einstellungen der Klasse:", "Stunde sperren:", "Die Tabelle:", "Die Zeile eines Kindes:"])
      expect(namen).toContain(n);
    // ★ 19.09.2026 (Johannes: „tausche die Schalter"): Der Rundgang geht die
    // Reihe in IHRER Reihenfolge ab - „Stunde sperren" vor „Einstellungen".
    expect(namen.indexOf("Stunde sperren:")).toBeGreaterThan(namen.indexOf("Wochenziel:"));
    expect(namen.indexOf("Einstellungen der Klasse:")).toBeGreaterThan(namen.indexOf("Stunde sperren:"));
    fireEvent.click(within(region).getByRole("button", { name: /Fertig/ }));
    await waitFor(() => keinRundgang());
  });

  it("★★★★★ neue Lehrkraft: erster Besuch (noch keine Klasse) ⇒ „Kinder und Zugänge“, danach der Lernstand", async () => {
    const lehrkraft = neueLehrkraft();
    useTypingAuth.setState({ account: lehrkraft });
    zeigeMeineKlassen();

    const region = await rundgang();
    expect(region.textContent).toContain("Klassen:");
    expect(region.textContent).toContain("erste Klasse");
    // Kein „Was gibt's Neues" für eine neue Lehrkraft.
    expect(screen.queryByRole("dialog", { name: "Was gibt's Neues" })).toBeNull();
    // Escape beendet ihn (auf dieser Seite gilt „seite": Escape = beenden).
    fireEvent.keyDown(document.body, { key: "Escape" });
    await waitFor(() => keinRundgang());
    await waitFor(() => expect(getRundgaengeGesehen(lehrkraft.id)).toContain(RUNDGANG_KINDER_UND_ZUGAENGE));
    cleanup();

    // Die erste Klasse ist angelegt, aber noch ohne Kinder: Der Lernstand ist
    // dann nur ein Satz - von selbst kein Rundgang, und er ist nicht verbraucht.
    const c = createClass(lehrkraft.id, "4a", "4A");
    if (!c.ok) throw new Error(c.error);
    zeigeMeineKlassen();
    await screen.findByRole("heading", { name: "4a" }, { timeout: 5000 });
    await ruhe(200);
    keinRundgang();
    expect(getRundgaengeGesehen(lehrkraft.id)).not.toContain(RUNDGANG_MEINE_KLASSEN);
    cleanup();

    // Mit dem ersten Kind zeigt der nächste Besuch den Lernstand - und den Rundgang.
    const p = addPupil(c.value.code, "Jano", "pw1234");
    if (!p.ok) throw new Error(p.error);
    zeigeMeineKlassen();
    const lernstand = await rundgang();
    expect(lernstand.textContent).toContain("Der Klassenkopf:");
    cleanup();

    // Neu geladen: nicht noch einmal.
    zeigeMeineKlassen();
    await screen.findByRole("heading", { name: "4a" }, { timeout: 5000 });
    await ruhe(200);
    keinRundgang();
  });

  it("die Hilfe zu „Meine Klassen“ hat „Rundgang durch Meine Klassen“ - nur bei Tastenflow", async () => {
    const lehrkraft = bestehendeLehrkraft();
    const c = createClass(lehrkraft.id, "3c", "3C");
    if (!c.ok) throw new Error(c.error);
    useTypingAuth.setState({ account: lehrkraft });
    localStorage.setItem(`tastenflow-neuigkeiten-gesehen:${lehrkraft.id}`, NEUIGKEITEN_FASSUNG);
    zeigeMeineKlassen();
    await screen.findByRole("heading", { name: "3c" }, { timeout: 5000 });
    await ruhe(200);
    keinRundgang();

    fireEvent.keyDown(window, { key: "h", code: "KeyH", altKey: true });
    const hilfe = await screen.findByRole("dialog");
    fireEvent.click(within(hilfe).getByRole("button", { name: /Rundgang durch Meine Klassen/ }));
    // Die Klasse hat noch keine Kinder - auf Wunsch kommt der Rundgang trotzdem,
    // mit den Bereichen, die dastehen.
    const region = await rundgang();
    expect(region.textContent).toContain("Der Klassenkopf:");
    expect(zaehler(region)).toMatch(/^Rundgang 1 von [23]$/);
    // Der Fokus steht auf der Überschrift, nicht auf dem Hilfe-Knopf - dort
    // öffnete die Eingabetaste die Hilfe wieder, statt weiterzugehen.
    await waitFor(() => expect(document.activeElement?.id).toBe("seitentitel"));
    fireEvent.keyDown(document.activeElement!, { key: "Enter" });
    await waitFor(() => expect(zaehler(region)).toMatch(/^Rundgang 2 /));
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.click(within(region).getByRole("button", { name: "Überspringen" }));
    await waitFor(() => keinRundgang());
    cleanup();

    // Andere Programme: kein Knopf in der Hilfe (dort gäbe es nichts zu zeigen).
    render(
      <BedienSpracheProvider>
        <MeineKlasseHilfe onClose={() => {}} programmName="Punktgenau" />
      </BedienSpracheProvider>,
    );
    expect(screen.queryByRole("button", { name: /Rundgang/ })).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Die Texte
// ---------------------------------------------------------------------------

const TOENE: RundgangTon[] = ["kind", "jugend", "erwachsen"];
const WER: RundgangWer[] = ["gast", "klassenkind", "selbstlernend", "lehrkraft"];

function alleTouren(sprache: AktiveBedienSprache): { tour: string; schritte: RundgangSchritt[] }[] {
  const touren: { tour: string; schritte: RundgangSchritt[] }[] = [];
  for (const ton of TOENE)
    for (const wer of WER)
      for (const anrede of ["du", "Sie"] as const)
        touren.push({
          tour: `üben/${ton}/${wer}/${anrede}`,
          schritte: uebenSchritte(sprache, ton, wer, anrede),
        });
  touren.push({ tour: "meine-klassen", schritte: meineKlassenSchritte(sprache) });
  touren.push({ tour: "kinder-und-zugänge (Klasse)", schritte: kinderUndZugaengeSchritte(sprache, true) });
  touren.push({ tour: "kinder-und-zugänge (ohne)", schritte: kinderUndZugaengeSchritte(sprache, false) });
  return touren;
}

describe("Die Texte", () => {
  it("★★★★ jeder Schritt NENNT seinen Bereich - ein Leuchtrahmen sagt einem Screenreader nichts", () => {
    for (const sprache of ["de", "en"] as const)
      for (const { tour, schritte } of alleTouren(sprache)) {
        expect(schritte.length, tour).toBeGreaterThanOrEqual(5);
        for (const s of schritte) {
          expect(s.name.trim().length, `${tour}: ${s.text}`).toBeGreaterThan(2);
          expect(rundgangSatz(s).startsWith(s.name), tour).toBe(true);
          expect(s.text.length, tour).toBeGreaterThan(20);
        }
        // Namen innerhalb eines Rundgangs sind verschieden - sonst hiesse zweimal
        // derselbe Bereich anders gemeint.
        const namen = schritte.map((s) => s.name);
        expect(new Set(namen).size, tour).toBe(namen.length);
      }
    // Die Bereiche aus dem Auftrag stehen da.
    const ueben = uebenSchritte("de", "kind", "klassenkind", "du").map(rundgangSatz).join(" ");
    for (const w of ["Übungszeile", "Stand", "Wochenziel", "Klassenmatch", "Bildschirm-Tastatur", "Alt + B", "Mein Training", "Geschichten", "Wortspiele", "Alt + O", "Alt + H", "Alt + V", "Alt + T", "Alt + J", "Meine Statistik"])
      expect(ueben).toContain(w);
    const mk = meineKlassenSchritte("de").map(rundgangSatz).join(" ");
    for (const w of ["Lernstand", "Kinder und Zugänge", "Downloads", "Tippchallenge", "Eigene Übung", "Wochenziel", "Einstellungen der Klasse", "Stunde sperren", "Klassenüberblick", "Monat", "Schuljahr", "Gesamt", "Excel", "Spaltenkopf", "wacklige Tasten", "Abzeichen"])
      expect(mk).toContain(w);
    const kuz = kinderUndZugaengeSchritte("de", true).map(rundgangSatz).join(" ");
    for (const w of ["Klasse an", "Passwort", "Excel", "Zugangsdaten drucken"]) expect(kuz).toContain(w);
  });

  it("Hausregeln: Du für alle Lernenden (auch ab 16), Sie nur für Lehrkräfte; keine Maus-Wörter, nur Bindestrich", () => {
    for (const sprache of ["de", "en"] as const)
      for (const { tour, schritte } of alleTouren(sprache))
        for (const s of schritte) {
          const satz = rundgangSatz(s);
          expect(satz, tour).not.toMatch(/[–—]/);
          expect(satz, tour).not.toMatch(/klick|Maus|scroll|hover|click|mouse|\btap\b/i);
        }
    for (const ton of ["kind", "jugend"] as const)
      for (const wer of ["gast", "klassenkind"] as const) {
        const text = uebenSchritte("de", ton, wer, "du").map(rundgangSatz).join(" ");
        expect(text).toMatch(/\b(du|dein|deine|dir)\b/);
        expect(text).not.toMatch(/\bSie (tippen|finden|sehen|melden)\b/);
      }
    // ★ 19.09.2026 (Johannes: „Schüler und Selbstlernende mit du", auch ab
    // 16): Erwachsene, die lernen, lesen den Rundgang per Du - ohne Sie.
    for (const wer of ["gast", "selbstlernend", "klassenkind"] as const) {
      const erw = uebenSchritte("de", "erwachsen", wer, "du").map(rundgangSatz).join(" ");
      expect(erw, wer).toMatch(/\b(du|dein|deine)\b/);
      expect(erw, wer).not.toMatch(/\b(Sie (tippen|finden|sehen|melden|sind)|Ihr|Ihre)\b/);
    }
    // Die Lehrkraft wird gesiezt - sie bekommt immer den Erwachsenen-Ton.
    const lk = uebenSchritte("de", "erwachsen", "lehrkraft", "Sie").map(rundgangSatz).join(" ");
    expect(lk).toMatch(/\bSie\b/);
    expect(lk).not.toMatch(/\b(du|dein|deine)\b/);
    const mk = [...meineKlassenSchritte("de"), ...kinderUndZugaengeSchritte("de", true)].map(rundgangSatz).join(" ");
    expect(mk).not.toMatch(/\b(du|dein|deine)\b/);
  });

  it("★★★ englisch: kein deutsches Wort in keinem Schritt - und die Gegenprobe findet im Deutschen viele", () => {
    const funde = (sprache: AktiveBedienSprache) =>
      alleTouren(sprache).flatMap(({ tour, schritte }) =>
        schritte.map((s) => pruefeText(tour, rundgangSatz(s))).filter((f): f is string => !!f),
      );
    expect(funde("en")).toEqual([]);
    expect(funde("de").length).toBeGreaterThan(50);
  });

  it("★★★ englisch auf der echten Seite: der Kasten spricht Englisch (Gegenprobe deutsch)", async () => {
    stelleBedienung("en");
    zeigeUeben();
    await einrichtungUeberspringen();
    const region = await rundgang(RUNDGANG_EN);
    expect(zaehler(region)).toMatch(/^Tour 1 of \d$/);
    expect(within(region).getByRole("button", { name: "Skip" })).toBeTruthy();
    expect(region.textContent).toContain("The typing field:");
    expect(findeDeutsch(region)).toEqual([]);
    await waitFor(() =>
      expect(pruefeText("ansage", document.querySelector("[data-rundgang-ansage]")?.textContent)).toBeNull(),
    );
    expect(region.textContent).not.toMatch(/\b(click|hover|mouse|scroll)/i);
    cleanup();

    localStorage.clear();
    stelleBedienung(null);
    zeigeUeben();
    await einrichtungUeberspringen();
    const de = await rundgang(RUNDGANG_DE);
    // Zähler, Name, Satz und beide Knöpfe - jeder Textknoten ein Fund.
    expect(findeDeutsch(de).length).toBeGreaterThanOrEqual(4);
  });

  it("die Hilfe der Kinder trägt den Knopf in beiden Sprachen", () => {
    const zu = vi.fn();
    render(
      <BedienSpracheProvider>
        <TippenHilfe open onClose={zu} stufe="kids" />
      </BedienSpracheProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Rundgang noch einmal/ }));
    expect(zu).toHaveBeenCalledTimes(1);
    expect(useRundgangWunsch.getState().wunsch).toBe("ueben");
    cleanup();
    stelleBedienung("en");
    render(
      <BedienSpracheProvider>
        <TippenHilfe open onClose={() => {}} stufe="kids" />
      </BedienSpracheProvider>,
    );
    expect(screen.getByRole("button", { name: /Take the tour again/ })).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Die Simulationen bleiben, wie sie waren
// ---------------------------------------------------------------------------

describe("Die Simulationen (SimEinfuehrung ohne die neuen Eigenschaften)", () => {
  it("★★★ unverändert: „Einführung 1/2“, deutsche Knöpfe, aria-live am Satz, Escape und Buchstaben gehen durch", () => {
    const onEnde = vi.fn();
    render(
      <>
        <input aria-label="Probe" />
        <SimEinfuehrung
          schluessel="probe-sim"
          schritte={[
            { ziel: () => null, text: "Erster Schritt." },
            { ziel: () => null, text: "Zweiter Schritt." },
          ]}
          onEnde={onEnde}
        />
      </>,
    );
    const region = screen.getByRole("region", { name: "Einführung" });
    expect(screen.getByText("Einführung 1/2")).toBeTruthy();
    expect(within(region).getByRole("button", { name: "Überspringen" })).toBeTruthy();
    expect(within(region).getByRole("button", { name: /Weiter/ })).toBeTruthy();
    expect(region.querySelector("p")?.getAttribute("aria-live")).toBe("polite");

    // Escape gehört in den Simulationen weiter der Seite.
    expect(fireEvent.keyDown(document, { key: "Escape" })).toBe(true);
    expect(onEnde).not.toHaveBeenCalled();
    // Ein Buchstabe wird nicht geschluckt.
    expect(fireEvent.keyDown(screen.getByLabelText("Probe"), { key: "f" })).toBe(true);
    // Die Eingabetaste schaltet weiter - wie bisher.
    fireEvent.keyDown(document, { key: "Enter" });
    expect(screen.getByText("Einführung 2/2")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /Fertig/ }));
    expect(onEnde).toHaveBeenCalledTimes(1);
    expect(einfuehrungGesehen("probe-sim")).toBe(true);
  });

  it("Kontrastmodus: der Leuchtrahmen steht in der forced-colors-Regel (dick, Highlight)", () => {
    const css = readFileSync(resolve(__dirname, "../src/index.css"), "utf8");
    const block = css.slice(css.indexOf("@media (forced-colors: active)"));
    expect(block).toMatch(/\[data-einfuehrung-rahmen\]\s*\{\s*outline:\s*var\(--hcm-dick\)\s+solid\s+Highlight/);
    const quelle = readFileSync(resolve(__dirname, "../src/components/SimEinfuehrung.tsx"), "utf8");
    expect(quelle).toContain("data-einfuehrung-rahmen");
  });
});
