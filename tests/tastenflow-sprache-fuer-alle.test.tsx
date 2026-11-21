/**
 * ★★★ DER SPRACHSCHALTER FÜR ALLE (19.09.2026).
 *
 * Johannes 19.09.2026: *„und wo kann ein Schüler auf Englisch umstellen, der
 * Sprache-umstellen-Schalter muss auch jedem zur Verfügung stehen (die
 * Eingabesprache wird automatisch an die Oberflächensprache angepasst, kann
 * aber nachträglich wieder geändert werden …)"* und *„schau nach, welche
 * Systemsprache ein User verwendet, und stelle beim ersten Mal dann die
 * Sprache dementsprechend ein, alles andere wie Deutsch wird automatisch
 * Englisch, auch die Einführung natürlich"*.
 *
 * Geprüft wird:
 *  (a) ein NEUES Gerät mit englischer Sprachliste startet englisch - samt
 *      Einrichtung, deren Übungssprache als Vorgabe auf Englisch steht; mit
 *      `["tr", "de"]` deutsch,
 *  (b) ★★★ ein BEKANNTES Gerät (ein Merker von Tastenflow im Speicher) bleibt
 *      trotz englischer Sprachliste deutsch - und merkt sich das,
 *  (c) der Schalter steht für Gast, Kind und Lehrkraft da - ohne jeden
 *      Zusatz in der Adresse,
 *  (d) der Druck auf den Schalter zieht die Übungssprache mit (beim Kind über
 *      `setLang`); bei gesperrter Sprache (`langLocked`) nicht; danach lässt
 *      sie sich im Zahnrad wieder unabhängig umstellen; die Erkennung beim
 *      ersten Besuch überschreibt nie die Übungssprache eines Kontos,
 *  (e) im Quelltext steht kein `englisch-probe` mehr.
 *
 * ★ 28.09.2026 (Freigabe fr/es): Seit vier Sprachen angeboten werden, steht
 * statt des Zweier-Knopfs („EN - English"/„DE - Deutsch") der SPRACHWÄHLER in
 * der Kopfzeile (`tests/helfer/sprachwahl.ts`). Die Absicht jedes Tests bleibt;
 * „welche Sprache ist aktiv" liest er jetzt am Kürzel des Wählers ab. Der
 * Zweier-Fall (fr/es im Not-Aus) steht in (d) weiter als eigener Test.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { TippenTrainerPage } from "../src/features/public/TippenTrainerPage";
import { MeineKlassePage } from "../src/features/public/MeineKlassePage";
import { TastenflowSprachBereich } from "../src/features/public/TastenflowSprachBereich";
import { AnnounceProvider } from "../src/lib/a11y";
import { einrichtungFertigMerken } from "../src/lib/typing/einrichtung";
import { useTypingAuth } from "../src/components/typing/useTypingAuth";
import { typingBackend, useVoice, type TypingAccount } from "../src/lib/typing";
import {
  addPupil,
  createClass,
  registerTeacher,
  setClassPrograms,
} from "../src/lib/typing/account";
import { ohneBildschirmTastatur, tippfeldPflicht } from "./_typing-probelauf";
import {
  findeSprachwahlKnopf,
  fokusZurueckAufDemKnopf,
  nurDeutschUndEnglisch,
  sprachwahlKnopf,
  sprachwahlKuerzel,
  waehleSprache,
  zweierKnopf,
} from "./helfer/sprachwahl";

/** Ein Kind einer Klasse - Übungssprache Deutsch (kein `lang` am Konto). */
const MIA: TypingAccount = {
  id: "p-mia",
  role: "schueler",
  name: "Mia",
  classCode: "5A3",
  stufe: "b",
  createdAt: 1,
};

/** Ein Browser mit dieser Sprachliste (`tests/setup.ts` setzt sonst ["de-AT", "de"]). */
function browserMit(sprachen: string[]) {
  vi.spyOn(navigator, "languages", "get").mockReturnValue(sprachen);
}

function zeigeTrainer(account: TypingAccount | null = null) {
  useTypingAuth.setState({ account });
  window.history.replaceState(null, "", "/programme/tastenflow");
  return render(
    <AnnounceProvider>
      <MemoryRouter initialEntries={["/programme/tastenflow"]}>
        <TastenflowSprachBereich>
          <TippenTrainerPage />
        </TastenflowSprachBereich>
      </MemoryRouter>
    </AnnounceProvider>,
  );
}

const htmlLang = () => document.documentElement.getAttribute("lang");
/** ★ 28.09.2026: die aktive Bedienungssprache am Kürzel des Sprachwählers. */
const aktivAmWaehler = () => sprachwahlKuerzel(sprachwahlKnopf());

beforeEach(() => {
  document.documentElement.setAttribute("lang", "de");
  ohneBildschirmTastatur();
  useVoice.getState().setEnabled(false);
  useTypingAuth.setState({ account: null });
  Element.prototype.scrollIntoView = () => {};
  // ⚠️ ERST danach leeren: Tastatur und Stimme merken sich ihre Einstellung
  // unter `tippen-…` - und das zählt als „Gerät kennt Tastenflow". Die Tests
  // für ein NEUES Gerät brauchen einen leeren Speicher; die Einstellungen
  // bleiben im Arbeitsspeicher der Stores trotzdem stehen.
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  useTypingAuth.setState({ account: null });
  window.history.replaceState(null, "", "/");
});

// ---------------------------------------------------------------------------
// (a) Ein neues Gerät - die Erkennung
// ---------------------------------------------------------------------------

describe("(a) ein neues Gerät startet in der Sprache des Browsers", () => {
  it("★★★ englische Sprachliste: englische Einrichtung, Übungssprache Englisch als Vorgabe", async () => {
    browserMit(["en-GB", "en"]);
    zeigeTrainer(null);
    // Nichts gemerkt, kein Merker ⇒ die Einrichtung kommt - englisch.
    expect(await screen.findByRole("heading", { name: "Welcome to Tastenflow" })).toBeTruthy();
    expect(htmlLang()).toBe("en");
    expect(sprachwahlKnopf()).not.toBeNull();
    expect(aktivAmWaehler()).toBe("EN");
    // Die Erkennung ist gemerkt - sie bleibt stabil.
    expect(localStorage.getItem("tastenflow-bedienung")).toBe("en");

    fireEvent.click(screen.getByRole("button", { name: "Let's go" }));
    expect(await screen.findByRole("heading", { name: "Who are the texts for?" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(
      await screen.findByRole("heading", { name: "Which language do you want to practise in?" }),
    ).toBeTruthy();
    // Die Vorgabe der Übungssprache: Englisch - änderbar.
    expect(screen.getByRole("button", { name: "English" })).toHaveAttribute("aria-pressed", "true");
    const deutsch = screen.getByRole("button", { name: "German" });
    expect(deutsch).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(deutsch);
    expect(deutsch).toHaveAttribute("aria-pressed", "true");
    // Die Bedienung bleibt dabei englisch.
    expect(htmlLang()).toBe("en");
  }, 30000);

  it("[\"tr\", \"de\"]: Deutsch kommt vor Englisch ⇒ deutsche Einrichtung", async () => {
    browserMit(["tr", "de"]);
    zeigeTrainer(null);
    expect(await screen.findByRole("heading", { name: "Willkommen bei Tastenflow" })).toBeTruthy();
    expect(htmlLang()).toBe("de");
    expect(sprachwahlKnopf()).not.toBeNull();
    expect(aktivAmWaehler()).toBe("DE");
    expect(localStorage.getItem("tastenflow-bedienung")).toBe("de");
  }, 30000);

  it("[\"tr\", \"en\", \"de\"]: Englisch kommt vor Deutsch ⇒ englisch", async () => {
    browserMit(["tr", "en", "de"]);
    zeigeTrainer(null);
    expect(await screen.findByRole("heading", { name: "Welcome to Tastenflow" })).toBeTruthy();
    expect(localStorage.getItem("tastenflow-bedienung")).toBe("en");
  }, 30000);
});

// ---------------------------------------------------------------------------
// (b) Ein bekanntes Gerät kippt nicht um
// ---------------------------------------------------------------------------

describe("(b) ★★★ ein Gerät, das Tastenflow kennt, bleibt deutsch - trotz englischem Browser", () => {
  it.each([
    ["eine fertige Übungszeile (anonymer Topf)", "tastenflow:topf:bilanz", "k7,1,120"],
    ["die erledigte Einrichtung", "tippen-einrichtung", "v1"],
    ["eine Anmeldung in der Lernwerkstatt", "tt_pb_auth", '{"token":"x"}'],
    ["der Übungsstand eines Gastes", "tippen-trainer:v1", '{"xp":12}'],
    ["eine Einstellung (Stimme)", "tippen-voice", "{}"],
  ])("%s (%s)", async (_wer, schluessel, wert) => {
    localStorage.setItem(schluessel, wert);
    browserMit(["en-US"]);
    zeigeTrainer(null);
    await findeSprachwahlKnopf();
    expect(htmlLang()).toBe("de");
    expect(aktivAmWaehler()).toBe("DE");
    // … und genau so gemerkt: Fehlt der Merker morgen, bleibt es trotzdem Deutsch.
    expect(localStorage.getItem("tastenflow-bedienung")).toBe("de");
  }, 30000);

  it("eine einmal erkannte Sprache bleibt, auch wenn später Merker dazukommen", async () => {
    browserMit(["en-US"]);
    zeigeTrainer(null);
    await screen.findByRole("heading", { name: "Welcome to Tastenflow" });
    cleanup();
    // Inzwischen hat das Gerät geübt - der Merker ist da. Die Wahl steht.
    einrichtungFertigMerken();
    zeigeTrainer(null);
    await waitFor(() => tippfeldPflicht());
    expect(htmlLang()).toBe("en");
    expect(aktivAmWaehler()).toBe("EN");
  }, 30000);
});

// ---------------------------------------------------------------------------
// (c) Der Schalter für jeden
// ---------------------------------------------------------------------------

function baueKlasse(): TypingAccount {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  setClassPrograms(c.value.code, t.value.id, ["tippen"]);
  const p = addPupil(c.value.code, "Mia", "pw1234");
  if (!p.ok) throw new Error(p.error);
  return t.value;
}

describe("(c) der Sprachschalter steht für jeden da - ohne Zusatz in der Adresse", () => {
  beforeEach(() => einrichtungFertigMerken());

  it("Gast (ohne Konto)", async () => {
    zeigeTrainer(null);
    await waitFor(() => tippfeldPflicht());
    expect(sprachwahlKnopf()).not.toBeNull();
    expect(aktivAmWaehler()).toBe("DE");
  }, 30000);

  it("Kind einer Klasse", async () => {
    zeigeTrainer(MIA);
    await waitFor(() => tippfeldPflicht());
    expect(sprachwahlKnopf()).not.toBeNull();
    expect(aktivAmWaehler()).toBe("DE");
  }, 30000);

  it("selbstlernendes Konto", async () => {
    zeigeTrainer({ ...MIA, id: "p-selbst", classCode: "", selfManaged: true });
    await waitFor(() => tippfeldPflicht());
    expect(sprachwahlKnopf()).not.toBeNull();
    expect(aktivAmWaehler()).toBe("DE");
  }, 30000);

  it("Lehrkraft - auf der Übungsseite UND in „Meine Klassen\"", async () => {
    const lehrkraft = baueKlasse();
    zeigeTrainer(lehrkraft);
    expect(sprachwahlKuerzel(await findeSprachwahlKnopf())).toBe("DE");
    cleanup();

    useTypingAuth.setState({ account: lehrkraft });
    const adresse = "/meine-klasse?app=tippen";
    window.history.replaceState(null, "", adresse);
    render(
      <AnnounceProvider>
        <MemoryRouter initialEntries={[adresse]}>
          <TastenflowSprachBereich>
            <MeineKlassePage />
          </TastenflowSprachBereich>
        </MemoryRouter>
      </AnnounceProvider>,
    );
    const knopf = await findeSprachwahlKnopf();
    await waehleSprache("English", knopf);
    await waitFor(() => expect(htmlLang()).toBe("en"));
    // Derselbe Knopf, jetzt mit „EN" - und der Fokus ist wieder auf ihm.
    expect(sprachwahlKnopf()).toBe(knopf);
    expect(sprachwahlKuerzel(knopf)).toBe("EN");
    await fokusZurueckAufDemKnopf(knopf);
  }, 30000);
});

// ---------------------------------------------------------------------------
// (d) Der Schalter zieht die Übungssprache mit
// ---------------------------------------------------------------------------

describe("(d) ★★★ der Schalter zieht die Übungssprache mit - ausser sie ist gesperrt", () => {
  beforeEach(() => einrichtungFertigMerken());

  it("Gast: EN ⇒ englische Zeilen sofort; danach im Zahnrad wieder Deutsch - die Bedienung bleibt englisch", async () => {
    zeigeTrainer(null);
    const vorher = await waitFor(() => tippfeldPflicht());
    expect(vorher).toHaveAttribute("lang", "de");

    const knopf = await findeSprachwahlKnopf();
    knopf.focus();
    await waehleSprache("English", knopf);
    await waitFor(() => expect(tippfeldPflicht()).toHaveAttribute("lang", "en"));
    expect(htmlLang()).toBe("en");
    // Der Fokus geht nach der Wahl auf den Knopf zurück und BLEIBT dort -
    // auch wenn neue Zeilen kommen (`fokusStehtAufDemSprachschalter`).
    await fokusZurueckAufDemKnopf(knopf);
    await new Promise((r) => setTimeout(r, 50));
    expect(document.activeElement).toBe(knopf);

    // Im Zahnrad unabhängig zurück auf deutsche Texte.
    fireEvent.keyDown(document, { code: "KeyO", altKey: true });
    const liste = await screen.findByRole("combobox", { name: "Language of the texts" });
    expect((liste as HTMLSelectElement).value).toBe("en");
    fireEvent.change(liste, { target: { value: "de" } });
    await waitFor(() => expect(tippfeldPflicht()).toHaveAttribute("lang", "de"));
    expect(htmlLang()).toBe("en");
    expect(aktivAmWaehler()).toBe("EN");

    // Und zurück auf Deutsch mit dem Wähler: Bedienung UND Übung deutsch.
    await waehleSprache("Deutsch");
    await waitFor(() => expect(htmlLang()).toBe("de"));
    expect(tippfeldPflicht()).toHaveAttribute("lang", "de");
  }, 30000);

  // ★ 28.09.2026 (Freigabe fr/es): der ZWEIER-Fall - fr/es im Not-Aus, die
  // Kopfzeile zeigt wieder den Knopf mit der ANDEREN Sprache. Derselbe Kern
  // wie oben: die Übungssprache zieht mit, der Fokus bleibt auf dem Knopf.
  it("★ Zweier-Knopf (fr/es im Not-Aus): EN ⇒ englische Zeilen, der Fokus bleibt auf dem Knopf", async () => {
    nurDeutschUndEnglisch();
    zeigeTrainer(null);
    await waitFor(() => expect(tippfeldPflicht()).toHaveAttribute("lang", "de"));
    expect(sprachwahlKnopf()).toBeNull();
    const knopf = zweierKnopf("EN - English")!;
    knopf.focus();
    fireEvent.click(knopf);
    await waitFor(() => expect(tippfeldPflicht()).toHaveAttribute("lang", "en"));
    expect(htmlLang()).toBe("en");
    expect(document.activeElement).toBe(knopf);
    expect(zweierKnopf("DE - Deutsch")).toBe(knopf);
  }, 30000);

  it("★★ Kind: derselbe Schreibweg wie im Zahnrad (`setLang`) - die Übungssprache wird Englisch", async () => {
    const setLang = vi
      .spyOn(typingBackend(), "setLang")
      .mockImplementation(async (_id, lang) => ({ ...MIA, lang }));
    zeigeTrainer(MIA);
    await waitFor(() => expect(tippfeldPflicht()).toHaveAttribute("lang", "de"));
    await waehleSprache("English", await findeSprachwahlKnopf());
    await waitFor(() => expect(setLang).toHaveBeenCalledWith("p-mia", "en"));
    await waitFor(() => expect(tippfeldPflicht()).toHaveAttribute("lang", "en"));
    expect(useTypingAuth.getState().account?.lang).toBe("en");
  }, 30000);

  it("★★★ Kind mit GESPERRTER Sprache (langLocked): nur die Bedienung wechselt", async () => {
    const setLang = vi.spyOn(typingBackend(), "setLang");
    zeigeTrainer({ ...MIA, langLocked: true });
    await waitFor(() => expect(tippfeldPflicht()).toHaveAttribute("lang", "de"));
    await waehleSprache("English", await findeSprachwahlKnopf());
    await waitFor(() => expect(htmlLang()).toBe("en"));
    // Warten, ob doch noch etwas geschrieben wird.
    await new Promise((r) => setTimeout(r, 50));
    expect(setLang).not.toHaveBeenCalled();
    expect(tippfeldPflicht()).toHaveAttribute("lang", "de");
  }, 30000);

  it("★★ die ERKENNUNG beim ersten Besuch überschreibt nie die Übungssprache eines Kontos", async () => {
    localStorage.clear(); // neues Gerät
    browserMit(["en-US"]);
    const setLang = vi.spyOn(typingBackend(), "setLang");
    zeigeTrainer(MIA);
    await waitFor(() => expect(htmlLang()).toBe("en"));
    await new Promise((r) => setTimeout(r, 50));
    expect(setLang).not.toHaveBeenCalled();
    expect(useTypingAuth.getState().account?.lang).toBeUndefined();
  }, 30000);
});

// ---------------------------------------------------------------------------
// (e) Keine Programmleiche
// ---------------------------------------------------------------------------

function alleDateien(ordner: string): string[] {
  const raus: string[] = [];
  for (const name of readdirSync(ordner)) {
    const pfad = join(ordner, name);
    if (statSync(pfad).isDirectory()) raus.push(...alleDateien(pfad));
    else if (/\.(ts|tsx|js|mjs)$/.test(name)) raus.push(pfad);
  }
  return raus;
}

describe("(e) der Probe-Schalter ist weg", () => {
  it("★ kein `englisch-probe` und kein `probeAn` mehr in src/", () => {
    const funde = alleDateien(join(__dirname, "..", "src")).filter((p) => {
      const text = readFileSync(p, "utf8");
      return /englisch-probe|\bprobeAn\b|probeSchalterLesen|PROBE_SCHLUESSEL|probeGemerkt/.test(text);
    });
    expect(funde).toEqual([]);
  });
});
