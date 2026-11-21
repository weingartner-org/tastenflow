/**
 * ★★★★ WÄCHTER: Zwei Nacharbeiten zum Startniveau der Klasse (11.09.2026, Nacht).
 *
 * 1 · ZEITGRENZE. Die Übungsseite eines Klassenkindes wartet beim Laden des
 *     Fortschritts auf die Klasse (`klasseFuer`), damit die Vorgabe der Klasse
 *     ankommt. Hängt `getClass` im Schul-WLAN, OHNE zu scheitern, darf die
 *     Seite deshalb nicht stehen bleiben - vorher hing sie nur am Lernstand.
 *     Nachgestellt: `getClass` antwortet nie, `getProgress` sofort.
 *
 * 2 · „WOMIT ANFANGEN?" JE KIND zeigt, was das Kind WIRKLICH bekommt - dieselbe
 *     Regel (`startpunktMitKlasse`) wie beim Kind. Zwei Stellen, die dieselbe
 *     Frage verschieden beantworten, waren der Befund.
 *
 * ★ Wohin sich der Wächter bewegt, wenn es schlechter wird: Fällt die Frist
 *   weg, erscheint das Übungsfeld nie - rot. Liest die Lehrkraft-Ansicht wieder
 *   nur den Wert am Konto, steht dort „Anfänger", obwohl das Kind die Vorgabe
 *   bekommt - rot. Wird eine Bestätigung des angezeigten Werts nicht mehr als
 *   eigener Beschluss geschrieben, fehlt der Zeitstempel - rot.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { TippenTrainerPage } from "@/features/public/TippenTrainerPage";
import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { KlasseUndKinder } from "@/components/lernwerkstatt/klasse/KlasseUndKinder";
import { startpunktMitKlasse } from "@/lib/typing/klassenEinstellungen";
import {
  KLASSE_FRIST_MS,
  klasseFuer,
  useTypingAuth,
  vergissGeladeneKlasse,
} from "@/components/typing/useTypingAuth";
import { einrichtungFertigMerken } from "@/lib/typing/einrichtung";
import { startPoints, startpunktEinheiten } from "@/lib/typing";
import { emptyProgress } from "@/lib/typing/progress";
import {
  addPupil,
  createClass,
  getAccount,
  getClass,
  listPupils,
  registerTeacher,
  saveAccountProgress,
  setClassEinstellungen,
  setStartUnits,
} from "@/lib/typing/account";
import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";

const V = startPoints("de", "de");

beforeEach(() => {
  Element.prototype.scrollIntoView = () => {};
  localStorage.clear();
  _resetTypingBackend();
  vergissGeladeneKlasse();
  einrichtungFertigMerken();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  useTypingAuth.setState({ account: null });
});

describe("★★★★ 1 · Eine hängende Klasse hält die Übungsseite nicht auf", () => {
  it("`getClass` antwortet nie - das Übungsfeld erscheint trotzdem", async () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    createClass(t.value.id, "5a", "5A3", { startUnits: V[2].units });
    const kind = addPupil("5A3", "Jano", "pw1234");
    if (!kind.ok) throw new Error(kind.error);

    // Nachgestellt: Schul-WLAN, die Anfrage nach der Klasse bleibt hängen.
    const haengt = vi
      .spyOn(typingBackend(), "getClass")
      .mockImplementation(() => new Promise(() => {}));
    useTypingAuth.setState({ account: kind.value });
    render(
      <MemoryRouter>
        <TippenTrainerPage />
      </MemoryRouter>,
    );
    await waitFor(
      () => expect(document.querySelector('[data-typing-field="practice"]')).toBeTruthy(),
      { timeout: 8000 },
    );
    expect(haengt).toHaveBeenCalled();
  }, 15000);

  it("`klasseFuer` gibt nach der Frist `null` - und merkt sich den späten Wert NICHT", async () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    createClass(t.value.id, "5a", "5A3", { startUnits: V[2].units });
    const kind = addPupil("5A3", "Jano", "pw1234");
    if (!kind.ok) throw new Error(kind.error);
    const echt = getClass("5A3");

    let antworte: (c: typeof echt) => void = () => {};
    const spaet = vi
      .spyOn(typingBackend(), "getClass")
      .mockImplementation(() => new Promise((r) => (antworte = r)));
    expect(KLASSE_FRIST_MS).toBeGreaterThan(0);
    expect(await klasseFuer(kind.value, 20)).toBeNull();

    // Die Klasse kommt NACH der Frist doch noch …
    antworte(echt);
    await new Promise((r) => setTimeout(r, 0));
    // … und wird nicht gemerkt: Die nächste Frage geht wieder zum Server.
    spaet.mockResolvedValue(echt);
    expect((await klasseFuer(kind.value, 20))?.startUnits).toBe(V[2].units);
    expect(spaet).toHaveBeenCalledTimes(2);
  });
});

describe("★★★★ 2 · „Womit anfangen?\" zeigt, was das Kind wirklich bekommt", () => {
  async function oeffneKind() {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    createClass(t.value.id, "3b", "3B", { startUnits: V[3].units });
    const anna = addPupil("3B", "Anna", "pw1234");
    const ben = addPupil("3B", "Ben", "pw1234");
    if (!anna.ok || !ben.ok) throw new Error("Kind");
    // Gegenprobe: Ben hat einen EIGENEN, neueren Beschluss unter der Vorgabe.
    await new Promise((r) => setTimeout(r, 2));
    setStartUnits(ben.value.id, V[1].units);
    render(
      <TastenflowReiter pupils={listPupils("3B")} onChanged={() => {}} cls={getClass("3B")} teacherId={t.value.id} />,
    );
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    return { anna: anna.value, ben: ben.value };
  }

  // ★ E4 (18.09.2026): „Womit anfangen?" liegt seither ZUSÄTZLICH hinter der
  // eigenen Zeile „Einstellungen für {Name}" - erst öffnen (der `<summary>`
  // hat in jsdom keine eigene Rolle, darum über den sichtbaren Text).
  async function oeffneEinstellungenFuer(name: string) {
    await userEvent.click(
      screen.getByRole("button", { name: new RegExp(`Einstellungen und Auswertung von ${name} ausklappen`) }),
    );
    await userEvent.click(screen.getByText(new RegExp(`^Einstellungen für ${name}\\b`)));
  }

  it("ohne eigenen Beschluss steht die Vorgabe der Klasse da - mit eigenem, neuerem der eigene", async () => {
    await oeffneKind();
    await oeffneEinstellungenFuer("Anna");
    await oeffneEinstellungenFuer("Ben");
    expect((screen.getByLabelText("Womit Anna anfängt") as HTMLSelectElement).value).toBe(String(V[3].units));
    expect((screen.getByLabelText("Womit Ben anfängt") as HTMLSelectElement).value).toBe(String(V[1].units));
  });

  it("wer den angezeigten Wert bestätigt, schreibt einen EIGENEN Beschluss - ohne Rückfrage „zurückstufen\"", async () => {
    const { anna } = await oeffneKind();
    const rueckfrage = vi.spyOn(window, "confirm").mockReturnValue(true);
    expect(getAccount(anna.id)?.startUnitsAt).toBeUndefined();
    await oeffneEinstellungenFuer("Anna");
    const feld = screen.getByLabelText("Womit Anna anfängt") as HTMLSelectElement;
    fireEvent.change(feld, { target: { value: String(V[3].units) } });
    await waitFor(() => expect(getAccount(anna.id)?.startUnitsAt ?? 0).toBeGreaterThan(0));
    expect(getAccount(anna.id)?.startUnits).toBe(V[3].units);
    // Die Vorgabe ist der wirksame Stand - dieselbe Stufe ist kein Zurückstufen.
    expect(rueckfrage).not.toHaveBeenCalled();
  });
});

describe("★★★★★ 2c · Ein Zurückstufen VOR dem nächsten Öffnen zeigt schon den neuen Wert (18.09.2026)", () => {
  /*
   * Befund: Ein Zurückstufen WIRKT sofort - das Kind bekommt die niedrigere
   * Stufe beim nächsten Öffnen. Nur die ANZEIGE hinkte hinterher, weil sie
   * `progress.introduced` liest, und das schrumpft erst, wenn das Kind selbst
   * lädt (`startpunktAnwenden`). Geprüft wird `startAnzeige`
   * (`klassenEinstellungen.ts`) im echten Einbau (`PupilEinstellungen`).
   *
   * ⚠️ Das Konto UND sein Fortschritt müssen VOR dem Rendern feststehen: Die
   * Tabelle lädt `getProgress` einmal beim Einbau, nicht laufend neu - eine
   * Änderung danach käme in der offenen Ansicht nie an.
   */
  const HINWEIS = "Wird wirksam, sobald Nora Tastenflow das nächste Mal öffnet.";

  /*
    ★ E12 (19.09.2026): Das Feld trägt seither IMMER einen Hinweis (`Tipp`,
    „was das Kind schon kann …") - `aria-describedby` ist darum nie mehr leer,
    steht der Beschluss aber noch aus, verweist es auf ZWEI Ids
    (Leerzeichen-getrennt, WAI-ARIA erlaubt das). `document.getElementById`
    versteht nur eine - dieser Helfer liest alle referenzierten Texte.
  */
  function beschreibungsTexte(feld: HTMLElement): string[] {
    const ids = feld.getAttribute("aria-describedby")?.split(/\s+/) ?? [];
    return ids.map((id) => document.getElementById(id)?.textContent ?? "");
  }

  async function oeffneNora(teacherId: string) {
    render(
      <TastenflowReiter
        pupils={listPupils("3B")}
        onChanged={() => {}}
        cls={getClass("3B")}
        teacherId={teacherId}
      />,
    );
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    await userEvent.click(
      screen.getByRole("button", { name: /Einstellungen und Auswertung von Nora ausklappen/ }),
    );
    // ★ E4 (18.09.2026): „Womit anfangen?" liegt seither zusätzlich hinter der
    // eigenen Zeile „Einstellungen für Nora" - erst öffnen.
    await userEvent.click(screen.getByText(/^Einstellungen für Nora\b/));
    return screen.getByLabelText("Womit Nora anfängt") as HTMLSelectElement;
  }

  it("(a) ausstehender Beschluss: das Feld zeigt schon die niedrigere Stufe - mit Hinweis", async () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    createClass(t.value.id, "3b", "3B", { startUnits: V[1].units });
    const nora = addPupil("3B", "Nora", "pw1234");
    if (!nora.ok) throw new Error(nora.error);
    // Nora übt längst bis Stufe V[4] - und hat diesen Stand schon übernommen.
    saveAccountProgress(nora.value.id, {
      ...emptyProgress(),
      introduced: startpunktEinheiten(V[4].units, "de"),
      startAngewandt: V[4].units,
      startAngewandtAm: 1000,
    });
    await new Promise((r) => setTimeout(r, 2));
    // Die Lehrkraft stuft zurück - Nora hat Tastenflow seither NICHT geöffnet.
    setStartUnits(nora.value.id, V[1].units);

    const feld = await oeffneNora(t.value.id);
    expect(feld.value).toBe(String(V[1].units));
    expect(screen.getByText(HINWEIS)).toBeTruthy();
    expect(beschreibungsTexte(feld)).toContain(HINWEIS);
  });

  it("(b) übernommener Beschluss (Kind hat schon geöffnet): normaler Wert, kein Hinweis", async () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    createClass(t.value.id, "3b", "3B", { startUnits: V[1].units });
    const nora = addPupil("3B", "Nora", "pw1234");
    if (!nora.ok) throw new Error(nora.error);
    saveAccountProgress(nora.value.id, {
      ...emptyProgress(),
      introduced: startpunktEinheiten(V[4].units, "de"),
      startAngewandt: V[4].units,
      startAngewandtAm: 1000,
    });
    await new Promise((r) => setTimeout(r, 2));
    const neu = setStartUnits(nora.value.id, V[1].units);
    // Nora hat Tastenflow seither geöffnet: `introduced` ist geschrumpft, der
    // Vermerk zieht mit demselben Zeitstempel gleich (`startAngewandtAm ===
    // startUnitsAt`).
    saveAccountProgress(nora.value.id, {
      ...emptyProgress(),
      introduced: startpunktEinheiten(V[1].units, "de"),
      startAngewandt: V[1].units,
      startAngewandtAm: neu?.startUnitsAt,
    });

    const feld = await oeffneNora(t.value.id);
    expect(feld.value).toBe(String(V[1].units));
    expect(screen.queryByText(HINWEIS)).toBeNull();
    // ★ E12: kein AUSSTEHENDER Beschluss mehr - aber das Feld trägt weiterhin
    // seinen allgemeinen Hinweis (Mouseover, immer da).
    expect(beschreibungsTexte(feld)).not.toContain(HINWEIS);
  });

  it("(c) die Klasse beschliesst NEUER als das Kind: unverändert der hohe Stand, kein Hinweis", async () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    createClass(t.value.id, "3b", "3B", { startUnits: V[1].units });
    const nora = addPupil("3B", "Nora", "pw1234");
    if (!nora.ok) throw new Error(nora.error);
    saveAccountProgress(nora.value.id, {
      ...emptyProgress(),
      introduced: startpunktEinheiten(V[1].units, "de"),
    });
    await new Promise((r) => setTimeout(r, 2));
    // Noras EIGENER Beschluss - alt.
    setStartUnits(nora.value.id, V[1].units);
    await new Promise((r) => setTimeout(r, 2));
    // Die Klasse beschliesst NACH Nora eine höhere Vorgabe.
    setClassEinstellungen("3B", t.value.id, { startUnits: V[3].units });

    const feld = await oeffneNora(t.value.id);
    expect(feld.value).toBe(String(V[3].units));
    expect(screen.queryByText(HINWEIS)).toBeNull();
    expect(beschreibungsTexte(feld)).not.toContain(HINWEIS);
  });
});

describe("★★★ 2b · „Einstellungen der Klasse\": dieselbe Frage, dieselbe Antwort", () => {
  /*
   * Die dritte Stelle, die fragt, wie weit ein Kind WIRKLICH ist: `standVon`
   * im Kasten „Einstellungen der Klasse" (Rückfrage „schon weiter" und
   * „Nur die, die noch nicht so weit sind"). Las sie nur den Wert am Konto,
   * zählte ein Kind, das die höhere Vorgabe der Klasse erbt, als „noch nicht
   * so weit" - und bekam still die niedrigere Stufe.
   */
  it("wer die höhere Vorgabe erbt, gilt als „schon weiter\" - und „Nur die, die noch nicht so weit sind\" lässt ihm seinen Stand", async () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    createClass(t.value.id, "3b", "3B", { startUnits: V[3].units });
    const anna = addPupil("3B", "Anna", "pw1234");
    if (!anna.ok) throw new Error(anna.error);
    render(
      <TastenflowReiter pupils={listPupils("3B")} onChanged={() => {}} cls={getClass("3B")} teacherId={t.value.id} />,
    );
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    await userEvent.selectOptions(
      screen.getByLabelText(/Startniveau für alle Kinder der Klasse/),
      String(V[1].units),
    );
    const dialog = await screen.findByRole("dialog");
    expect((dialog.textContent || "").replace(/\s+/g, " ")).toMatch(/1 Kind/);
    await userEvent.click(screen.getByRole("button", { name: "Nur die, die noch nicht so weit sind" }));
    await waitFor(() => expect(getClass("3B")?.startUnits).toBe(V[1].units));
    // Anna bekommt weiter, was sie vorher bekam.
    expect(startpunktMitKlasse(getAccount(anna.value.id)!, getClass("3B")).startUnits).toBe(V[3].units);
  });

  it("Gegenprobe: „Alle einstufen\" setzt auch das erbende Kind auf die neue Stufe", async () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    createClass(t.value.id, "3b", "3B", { startUnits: V[3].units });
    const anna = addPupil("3B", "Anna", "pw1234");
    if (!anna.ok) throw new Error(anna.error);
    render(
      <TastenflowReiter pupils={listPupils("3B")} onChanged={() => {}} cls={getClass("3B")} teacherId={t.value.id} />,
    );
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    await userEvent.selectOptions(
      screen.getByLabelText(/Startniveau für alle Kinder der Klasse/),
      String(V[1].units),
    );
    await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("button", { name: "Alle einstufen" }));
    await waitFor(() => expect(getAccount(anna.value.id)?.startUnits).toBe(V[1].units));
    expect(startpunktMitKlasse(getAccount(anna.value.id)!, getClass("3B")).startUnits).toBe(V[1].units);
  });
});

describe("★ 3 · „Neue Klasse anlegen\": schmal nur der Titel, der Name bleibt vollständig", () => {
  it("die Aufzählung ist sichtbar erst ab `md` und steht für Sprachausgaben immer da", () => {
    const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    render(
      <KlasseUndKinder
        teacher={t.value}
        classes={[]}
        cls={null}
        pupils={[]}
        offeneProgramme={[]}
        einstiegsProgramm="tippen"
        onSelectClass={() => {}}
        onChanged={() => {}}
      />,
    );
    const zeile = screen.getByRole("heading", { name: "Neue Klasse anlegen" }).closest("summary")!;
    const sichtbar = [...zeile.querySelectorAll("span")].find((s) => s.getAttribute("aria-hidden") === "true" && /Klassencode/.test(s.textContent ?? ""));
    const vorgelesen = [...zeile.querySelectorAll("span.sr-only")].find((s) => /Klassencode/.test(s.textContent ?? ""));
    expect(sichtbar?.className).toMatch(/\bhidden\b/);
    expect(sichtbar?.className).toMatch(/\bmd:inline\b/);
    expect(vorgelesen?.textContent).toMatch(/Name, Klassencode, Programme/);
  });
});
