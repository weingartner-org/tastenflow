/**
 * ★★★ WÄCHTER: Klassencode ist Pflicht - und ein Kind lässt sich in eine
 * andere Klasse verschieben (10.09.2026, zwei Wünsche von Johannes).
 *
 * C · Beim Anlegen einer Klasse hiess das Feld „Beitritts-Code (optional)",
 *     und wer es leer liess, bekam sechs Zufallszeichen. Jetzt heisst es wie
 *     beim Anmelden der Kinder „Klassencode", ist Pflicht und wird passend zum
 *     Namen vorgeschlagen („MS-Wein" → „MSWEIN").
 * B · „In andere Klasse verschieben" in der Zeile jedes Kindes, mit einer
 *     Rückfrage, die die Folgen nennt. Die Server-Seite prüft
 *     `tests/tastenflow-kind-verschieben.test.ts`; hier geht es um die
 *     Oberfläche, den Fokus und die lokale Fassung.
 *
 * WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD
 * ([[feedback_gruener_waechter_beweist_was]]):
 *  • Die Pflicht wird am FOKUS gemessen, nicht nur an einer Meldung: Wer
 *    anlegen will und keinen Code hat, steht danach im Codefeld.
 *  • Die Rückfrage wird an ihren drei Folgen gemessen - fällt eine weg, wird
 *    er rot.
 *  • Das alte Wort wird im GERENDERTEN Text gesucht, nicht nur im Quelltext.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { MeineKlassePage } from "@/features/public/MeineKlassePage";
import { MeineKlasseHilfe } from "@/components/lernwerkstatt/klasse/MeineKlasseHilfe";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import type { TypingAccount } from "@/lib/typing";
import { startPoints } from "@/lib/typing";
import {
  addPupil,
  createClass,
  getAccount,
  listPupils,
  movePupil,
  registerTeacher,
} from "@/lib/typing/account";
import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import { klassencodeFehler, klassencodeVorschlag } from "@/lib/lernwerkstatt/klassencode";
import { PRUEFUNG_WORT } from "@/lib/typing/schreibprobe";

const WURZEL = resolve(__dirname, "..");
const lies = (p: string) => readFileSync(resolve(WURZEL, p), "utf8");

interface Aufbau {
  berger: TypingAccount;
  adam: TypingAccount;
  miaId: string;
}

/** Frau Berger: 3B mit Mia und Noah. Herr Adam: 4A mit Lena. */
function baue(): Aufbau {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  const u = registerTeacher("Herr Adam", "adam@example.org", "geheim123");
  if (!t.ok || !u.ok) throw new Error("Lehrkraft");
  const c = createClass(t.value.id, "3b", "3B");
  const d = createClass(u.value.id, "4a", "4A");
  if (!c.ok || !d.ok) throw new Error("Klasse");
  const mia = addPupil("3B", "Mia", "pw1234");
  addPupil("3B", "Noah", "pw1234");
  addPupil("4A", "Lena", "pw1234");
  if (!mia.ok) throw new Error(mia.error);
  return { berger: t.value, adam: u.value, miaId: mia.value.id };
}

/** Anmelden - im Store UND im lokalen Backend (das fragt `currentAccount`). */
function anmelden(a: TypingAccount) {
  localStorage.setItem("tippen-trainer:current", a.id);
  useTypingAuth.setState({ account: a });
}

function zeigeVerwaltung() {
  render(
    <MemoryRouter>
      <MeineKlassePage verwalten />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  _resetTypingBackend();
  useTypingAuth.setState({ account: null });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  useTypingAuth.setState({ account: null });
});

// ── C · Der Klassencode ────────────────────────────────────────────────────

describe("C · Der Vorschlag passt zum Namen", () => {
  it("Johannes' Beispiel und die Randfälle", () => {
    expect(klassencodeVorschlag("MS-Wein")).toBe("MSWEIN");
    expect(klassencodeVorschlag("3b")).toBe("3B");
    expect(klassencodeVorschlag("Größte Klasse 2026/27")).toBe("GROESSTEKLAS");
    expect(klassencodeVorschlag("ä")).toBe("AE");
    // Ein Zeichen wäre kein gültiger Code - dann gibt es keinen Vorschlag.
    expect(klassencodeVorschlag("a")).toBe("");
    // Jeder Vorschlag besteht die Prüfung, die beim Anlegen gilt.
    for (const n of ["MS-Wein", "3b", "Vorbereitungskurs Herbst", "Ü1"])
      expect(klassencodeFehler(klassencodeVorschlag(n)), n).toBeNull();
  });
});

describe("C · Das Formular: Klassencode ist Pflicht", () => {
  it("★ das Feld heisst „Klassencode“, ohne „optional“ - und folgt dem Namen, bis man selbst schreibt", async () => {
    const { berger } = baue();
    anmelden(berger);
    zeigeVerwaltung();
    const name = await screen.findByLabelText("Klassenname");
    const code = screen.getByLabelText("Klassencode") as HTMLInputElement;
    expect(code.getAttribute("aria-required")).toBe("true");
    // ★ Auf das Feld selbst beschränkt (14.09.2026), nicht mehr die ganze
    // Seite: Seit der Kontakt-E-Mail beim Kind ("optional", ein ANDERES
    // Feld weiter unten) trägt die Seite das Wort zu Recht - nur eben nicht
    // an DIESEM Feld.
    expect(code.labels?.[0]?.textContent ?? "").not.toMatch(/optional/i);

    fireEvent.change(name, { target: { value: "MS-Wein" } });
    expect(code.value).toBe("MSWEIN");
    // Selbst geschrieben: bleibt stehen, auch wenn der Name weiter wächst.
    fireEvent.change(code, { target: { value: "3.ms" } });
    expect(code.value).toBe("3.MS");
    fireEvent.change(name, { target: { value: "MS-Weingartner" } });
    expect(code.value).toBe("3.MS");
    // Geleert: folgt wieder dem Namen.
    fireEvent.change(code, { target: { value: "" } });
    fireEvent.change(name, { target: { value: "5a" } });
    expect(code.value).toBe("5A");
  });

  it("★★ ohne Code wird nichts angelegt - die Statuszeile sagt warum, der Fokus steht im Codefeld", async () => {
    const { berger } = baue();
    anmelden(berger);
    zeigeVerwaltung();
    const name = await screen.findByLabelText("Klassenname");
    const code = screen.getByLabelText("Klassencode");
    fireEvent.change(name, { target: { value: "x" } }); // ein Zeichen: kein Vorschlag
    expect((code as HTMLInputElement).value).toBe("");
    const knopf = screen.getByRole("button", { name: "Klasse anlegen" });
    expect(knopf.hasAttribute("disabled")).toBe(false);
    fireEvent.click(knopf);
    await waitFor(() => expect(document.activeElement).toBe(code));
    // Die Seite hat mehrere Statuszeilen - eine davon nennt den Grund.
    expect(
      screen.getAllByRole("status").some((s) => /Klassencode/.test(s.textContent ?? "")),
    ).toBe(true);
    await expect(typingBackend().listClasses(berger.id)).resolves.toHaveLength(1);
  });

  it("mit Vorschlag angelegt: die Klasse trägt den vorgeschlagenen Code", async () => {
    const { berger } = baue();
    anmelden(berger);
    zeigeVerwaltung();
    fireEvent.change(await screen.findByLabelText("Klassenname"), {
      target: { value: "MS-Wein" },
    });
    // ★ Seit 11.09.2026 (Nacht) Pflicht beim Anlegen: Schulstufe und Startniveau.
    fireEvent.change(screen.getByLabelText("Schulstufe der neuen Klasse"), {
      target: { value: "7" },
    });
    fireEvent.change(screen.getByLabelText("Startniveau für alle Kinder der neuen Klasse"), {
      target: { value: String(startPoints("de", "de")[1].units) },
    });
    fireEvent.click(screen.getByRole("button", { name: "Klasse anlegen" }));
    await waitFor(async () =>
      expect((await typingBackend().listClasses(berger.id)).map((c) => c.code)).toContain("MSWEIN"),
    );
  });

  it("beim Bearbeiten lässt sich der Code nicht leeren", async () => {
    const { berger } = baue();
    anmelden(berger);
    zeigeVerwaltung();
    fireEvent.click(await screen.findByRole("button", { name: "Klasse bearbeiten" }));
    const code = screen.getByLabelText("Klassencode", { selector: "#mk-edit-class-code" });
    fireEvent.change(code, { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Speichern" }));
    await waitFor(() => expect(document.activeElement).toBe(code));
    expect((await typingBackend().listClasses(berger.id)).map((c) => c.code)).toEqual(["3B"]);
  });

  it("die Schnittstelle nimmt keinen leeren Code an; im Server-Client gibt es keinen Zufallscode mehr", async () => {
    const { berger } = baue();
    const r = await typingBackend().createClass(berger.id, "ohne", "  ");
    expect(r.ok).toBe(false);
    const pb = lies("src/lib/typing/pbBackend.ts");
    expect(pb).not.toMatch(/genCode|CODE_ALPHABET/);
  });

  it("★ Lehrkraft-Oberfläche, Hilfe und Druckliste sagen „Klassencode“ - nirgends „Beitritts-Code“", async () => {
    const { berger } = baue();
    anmelden(berger);
    zeigeVerwaltung();
    await screen.findByLabelText("Klassencode");
    expect(document.body.textContent).not.toMatch(/Beitritts-?[Cc]ode/);
    cleanup();
    render(<MeineKlasseHilfe onClose={() => {}} programmName="Tastenflow" />);
    expect(document.body.textContent).toContain("Klassencode");
    expect(document.body.textContent).not.toMatch(/Beitritts-?[Cc]ode/);
    // Quelltext der übrigen Stellen (die Druckliste steht in KlasseUndKinder).
    for (const datei of [
      "src/components/lernwerkstatt/klasse/KlasseUndKinder.tsx",
      "src/components/lernwerkstatt/klasse/MeineKlasseHilfe.tsx",
      "src/components/typing/LehrerHilfe.tsx",
      "src/features/public/MeineKlassePage.tsx",
    ])
      expect(lies(datei), datei).not.toMatch(/Beitritts-?[Cc]ode/);
    expect(lies("src/components/lernwerkstatt/klasse/KlasseUndKinder.tsx")).toContain(
      "<th>Klassencode</th>",
    );
  });
});

// ── B · Ein Kind verschieben ────────────────────────────────────────────────

describe("B · Die lokale Fassung prüft dasselbe wie der Server", () => {
  it("in eine FREMDE Klasse, deren Code man kennt - ja; als fremde Lehrkraft - nein", () => {
    const { berger, adam, miaId } = baue();
    expect(movePupil(miaId, "4A", adam.id).ok).toBe(false);
    const r = movePupil(miaId, " 4a ", berger.id);
    expect(r.ok && r.value.zielCode).toBe("4A");
    expect(getAccount(miaId)?.classCode).toBe("4A");
    expect(listPupils("3B").map((p) => p.name)).toEqual(["Noah"]);
  });

  it("unbekannter Code, dieselbe Klasse, gleicher Name: abgewiesen, nichts geändert", () => {
    const { berger, miaId } = baue();
    addPupil("4A", "mia", "pw1234");
    for (const code of ["XYZ", "3b", "", "4A"]) {
      expect(movePupil(miaId, code, berger.id).ok, code).toBe(false);
      expect(getAccount(miaId)?.classCode).toBe("3B");
    }
  });
});

describe("B · „In andere Klasse verschieben“ im Verwalten-Bildschirm", () => {
  async function oeffne() {
    const a = baue();
    anmelden(a.berger);
    zeigeVerwaltung();
    const zeile = (await screen.findByText("Mia")).closest("li")!;
    const knopf = within(zeile).getByRole("button", { name: /In andere Klasse verschieben/ });
    return { ...a, zeile, knopf };
  }

  it("★ aufklappbar wie „Passwort ändern“ - Fokus ins Feld, Escape zurück auf den Schalter", async () => {
    const { zeile, knopf } = await oeffne();
    expect(knopf.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(knopf);
    expect(knopf.getAttribute("aria-expanded")).toBe("true");
    const feld = within(zeile).getByLabelText("Klassencode der neuen Klasse");
    await waitFor(() => expect(document.activeElement).toBe(feld));
    fireEvent.keyDown(feld, { key: "Escape" });
    await waitFor(() => expect(document.activeElement).toBe(knopf));
    expect(within(zeile).queryByLabelText("Klassencode der neuen Klasse")).toBeNull();
  });

  it("★★ die Rückfrage nennt die drei Folgen; „Abbrechen“ in der Rückfrage verschiebt nichts", async () => {
    const { zeile, knopf, miaId } = await oeffne();
    const frage = vi.spyOn(window, "confirm").mockReturnValue(false);
    fireEvent.click(knopf);
    const feld = within(zeile).getByLabelText("Klassencode der neuen Klasse");
    fireEvent.change(feld, { target: { value: "4a" } });
    fireEvent.click(within(zeile).getByRole("button", { name: "Verschieben" }));
    expect(frage).toHaveBeenCalledTimes(1);
    const text = String(frage.mock.calls[0][0]);
    expect(text).toContain("meldet sich danach mit dem neuen Klassencode 4A an");
    expect(text).toContain("Die Lehrkräfte der neuen Klasse sehen Mia und den Lernstand");
    expect(text).toContain(`${PRUEFUNG_WORT}-Ergebnisse und Nachrichten bleiben bei der bisherigen Klasse`);
    await waitFor(() => expect(document.activeElement).toBe(feld));
    expect(getAccount(miaId)?.classCode).toBe("3B");
    expect(within(zeile).getByRole("status").textContent).toContain("nichts verschoben");
  });

  it("ein unbekannter Code: der Grund steht in der Zeile, der Fokus bleibt im Feld", async () => {
    const { zeile, knopf } = await oeffne();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    fireEvent.click(knopf);
    const feld = within(zeile).getByLabelText("Klassencode der neuen Klasse");
    fireEvent.change(feld, { target: { value: "XYZ" } });
    fireEvent.click(within(zeile).getByRole("button", { name: "Verschieben" }));
    await waitFor(() =>
      expect(within(zeile).getByRole("status").textContent).toContain("gibt es nicht"),
    );
    await waitFor(() => expect(document.activeElement).toBe(feld));
  });

  it("★★★ verschoben: Mia verlässt die Liste, die Bestätigung steht da, der Fokus auf „Lernende“", async () => {
    const { knopf, zeile, miaId } = await oeffne();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    fireEvent.click(knopf);
    const feld = within(zeile).getByLabelText("Klassencode der neuen Klasse");
    fireEvent.change(feld, { target: { value: "4A" } });
    const los = within(zeile).getByRole("button", { name: "Verschieben" });
    expect(los.hasAttribute("disabled")).toBe(false);
    await act(async () => {
      fireEvent.click(los);
    });
    await waitFor(() => expect(screen.queryByText("Mia")).toBeNull());
    expect(getAccount(miaId)?.classCode).toBe("4A");
    // Die Bestätigung steht SICHTBAR da - nicht nur in der Statuszeile für
    // Sprachausgaben.
    expect(
      screen
        .getAllByText(/Mia ist jetzt in der Klasse „4a“/)
        .some((el) => !el.closest('[role="status"]')),
    ).toBe(true);
    const kopf = screen.getByRole("heading", { name: /Lernende/ });
    await waitFor(() => expect(document.activeElement).toBe(kopf));
  });
});
