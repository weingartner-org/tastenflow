/**
 * ★★★ WÄCHTER: Kinder aus Excel - die Oberfläche in „Meine Klassen verwalten"
 * (12.09.2026, Auftrag Johannes).
 *
 * Eine ECHTE kleine xlsx (SheetJS) wird als Datei gewählt; geprüft werden
 * Vorschau, Fokus, das Anlegen über den Backend-Weg des Formulars, der eine
 * Ergebnissatz und „Zugangsdaten drucken".
 *
 * WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD:
 *  · Es wird schon beim Wählen der Datei geschrieben (vor „anlegen") - rot.
 *  · Ein Kind unter der Vorgabe der Klasse bekommt seinen Beschluss nicht
 *    (`setStartUnits`) - rot: Formular und Import gehen nicht mehr denselben Weg.
 *  · Ein Fehlschlag verschwindet still, oder der Fokus fällt ins Leere - rot.
 *  · Die Vorschau überlebt einen Klassenwechsel - rot.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

import { KlasseUndKinder } from "@/components/lernwerkstatt/klasse/KlasseUndKinder";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import { startPoints, type TypingAccount, type TypingClass } from "@/lib/typing";
import { addPupil, createClass, getClass, listPupils, registerTeacher } from "@/lib/typing/account";
import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import {
  VORLAGE_KOPF,
  dateiBytes,
  fremdeKlasseHinweis,
  leseKinderXlsx,
  vorlageAlsBytes,
  vorlageDateiname,
} from "@/lib/lernwerkstatt/kinderImport";

const V = startPoints("de", "de");
const LANG = { timeout: 5000 };

async function xlsxDatei(zeilen: unknown[][], name = "kinder.xlsx"): Promise<File> {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(zeilen), "Teilnehmer");
  const bytes = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  return new File([bytes], name, {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

/** Frau Berger, Klasse 3b mit Startniveau V[2] und dem Kind Anna; dazu 4a. */
function baue(): { lehrkraft: TypingAccount; klasse: TypingClass; andere: TypingClass } {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B", { startUnits: V[2].units });
  const d = createClass(t.value.id, "4a", "4A");
  if (!c.ok || !d.ok) throw new Error("Klasse");
  const a = addPupil("3B", "Anna", "pw1234");
  if (!a.ok) throw new Error(a.error);
  return { lehrkraft: t.value, klasse: getClass("3B")!, andere: getClass("4A")! };
}

function zeige(lehrkraft: TypingAccount, klasse: TypingClass, classes: TypingClass[]) {
  const onChanged = vi.fn();
  const ansicht = render(
    <KlasseUndKinder
      teacher={lehrkraft}
      classes={classes}
      cls={klasse}
      pupils={listPupils(klasse.code)}
      offeneProgramme={[]}
      einstiegsProgramm="tippen"
      onSelectClass={() => {}}
      onChanged={onChanged}
    />,
  );
  return { onChanged, ansicht };
}

const dateifeld = () => document.querySelector<HTMLInputElement>('input[type="file"]')!;
// ★ 14.09.2026: Beschriftung "Teilnehmer" statt "Kinder" (Wunsch Johannes).
const importKnopf = () => screen.getByRole("button", { name: "Teilnehmer aus Excel importieren" });

async function waehleDatei(datei: File) {
  await act(async () => {
    fireEvent.change(dateifeld(), { target: { files: [datei] } });
  });
}

/** Der Satz steht SICHTBAR da - nicht nur in der (unsichtbaren) Statuszeile. */
const sichtbar = (satz: string) =>
  screen.queryAllByText(satz).filter((el) => el.getAttribute("role") !== "status").length === 1;

const angesagt = () =>
  screen
    .getAllByRole("status")
    .map((p) => p.textContent ?? "")
    .join(" ");

beforeEach(() => {
  localStorage.clear();
  _resetTypingBackend();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  useTypingAuth.setState({ account: null });
});

describe("★★★ Kinder aus Excel importieren", () => {
  it("Schalter öffnet das versteckte Dateifeld (.xlsx, kein Tabstopp) - nichts ist `disabled`", () => {
    const { lehrkraft, klasse, andere } = baue();
    zeige(lehrkraft, klasse, [klasse, andere]);
    const feld = dateifeld();
    expect(feld.getAttribute("accept")).toBe(".xlsx");
    expect(feld.tabIndex).toBe(-1);
    const klick = vi.spyOn(feld, "click").mockImplementation(() => {});
    fireEvent.click(importKnopf());
    expect(klick).toHaveBeenCalledTimes(1);
    expect(importKnopf()).not.toBeDisabled();
    expect(screen.getByRole("button", { name: "Vorlage herunterladen (Excel)" })).not.toBeDisabled();
  });

  it("★★ Vorschau zuerst (Fokus auf ihre Überschrift), erst „anlegen\" schreibt - über denselben Weg wie das Formular", async () => {
    const { lehrkraft, klasse, andere } = baue();
    const be = typingBackend();
    const add = vi.spyOn(be, "addPupil");
    const start = vi.spyOn(be, "setStartUnits");
    const { onChanged } = zeige(lehrkraft, klasse, [klasse, andere]);

    await waehleDatei(
      await xlsxDatei([
        [...VORLAGE_KOPF],
        ["Mia", "", ""],
        ["Noah", 1234, "1"],
        ["anna", "abcd", ""],
        ["Ben", "ab", ""],
      ]),
    );
    const kopf = await screen.findByRole("heading", { name: /^Vorschau: „kinder\.xlsx“/ }, LANG);
    await waitFor(() => expect(document.activeElement).toBe(kopf));

    // Die Vorschau nennt, was angelegt wird - und was nicht, mit Zeile und Grund.
    const vorschau = kopf.closest("section")!;
    const text = vorschau.textContent ?? "";
    expect(text).toContain("2 Teilnehmer werden in der Klasse 3b angelegt.");
    expect(text).toMatch(/Mia · Passwort [a-km-x2-9]{5} \(Passwort erzeugt\) · Tastenflow: /);
    expect(text).toContain(`${V[2].label} (Startniveau der Klasse)`);
    expect(text).toContain(`Noah · Passwort 1234 · Tastenflow: ${V[0].label}`);
    expect(text).toContain("2 Zeilen werden nicht übernommen");
    expect(text).toContain("Zeile 4 - anna: Diesen Namen gibt es in der Klasse schon.");
    expect(text).toContain("Zeile 5 - Ben: Das Passwort hat weniger als 4 Zeichen.");
    expect(angesagt()).toContain("Vorschau: 2 Teilnehmer zum Anlegen, 2 Zeilen nicht übernommen.");
    // Noch NICHTS geschrieben.
    expect(add).not.toHaveBeenCalled();
    expect(listPupils("3B")).toHaveLength(1);

    const anlegen = screen.getByRole("button", { name: "2 Teilnehmer anlegen" });
    expect(anlegen.getAttribute("aria-disabled")).toBe("false");
    await act(async () => {
      fireEvent.click(anlegen);
    });

    const lernende = screen.getByRole("heading", { name: /^Lernende/ });
    await waitFor(() => expect(document.activeElement).toBe(lernende), LANG);
    expect(add).toHaveBeenCalledTimes(2);
    expect(add.mock.calls.map((c) => [c[0], c[1], c[5]])).toEqual([
      ["3B", "Mia", V[2].units],
      ["3B", "Noah", V[0].units],
    ]);
    // ★ Noah liegt UNTER der Vorgabe der Klasse ⇒ eigener Beschluss, wie im Formular.
    expect(start).toHaveBeenCalledTimes(1);
    const noah = listPupils("3B").find((p) => p.name === "Noah")!;
    expect(start).toHaveBeenCalledWith(noah.id, V[0].units);
    expect(listPupils("3B").map((p) => p.name).sort()).toEqual(["Anna", "Mia", "Noah"]);

    // EIN Ergebnissatz, sichtbar und angesagt; alle in „Zugangsdaten drucken".
    const satz = "2 Teilnehmer angelegt. Namen und Passwörter stehen unter „Zugangsdaten drucken“.";
    expect(sichtbar(satz)).toBe(true);
    expect(angesagt()).toContain(satz);
    expect(screen.getByRole("button", { name: /Zugangsdaten drucken \(\s*2\)/ })).toBeTruthy();
    expect(onChanged).toHaveBeenCalled();
    expect(screen.queryByRole("heading", { name: /^Vorschau/ })).toBeNull();
  });

  it("★ ein Fehlschlag beim Anlegen wird gesammelt und im Ergebnissatz genannt", async () => {
    const { lehrkraft, klasse, andere } = baue();
    const be = typingBackend();
    const echt = be.addPupil.bind(be);
    vi.spyOn(be, "addPupil").mockImplementation(async (...args: Parameters<typeof be.addPupil>) =>
      args[1] === "Noah" ? { ok: false, error: "Das Konto konnte nicht angelegt werden." } : echt(...args),
    );
    zeige(lehrkraft, klasse, [klasse, andere]);
    await waehleDatei(await xlsxDatei([[...VORLAGE_KOPF], ["Mia", "", ""], ["Noah", "abcd", ""]]));
    await screen.findByRole("heading", { name: /^Vorschau/ }, LANG);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "2 Teilnehmer anlegen" }));
    });
    const satz =
      "1 Teilnehmer angelegt. 1 nicht: Noah (Das Konto konnte nicht angelegt werden). Namen und Passwörter stehen unter „Zugangsdaten drucken“.";
    await waitFor(() => expect(sichtbar(satz)).toBe(true), LANG);
    expect(screen.getByRole("button", { name: /Zugangsdaten drucken \(\s*1\)/ })).toBeTruthy();
  });

  it("eine Datei, die sich nicht lesen lässt: ein Satz, keine Vorschau, Fokus zurück auf den Import-Schalter", async () => {
    const { lehrkraft, klasse, andere } = baue();
    zeige(lehrkraft, klasse, [klasse, andere]);
    const kaputt = new File([new Uint8Array([0x50, 0x4b, 0x03, 0x04, 1, 2, 3, 4])], "kaputt.xlsx");
    await waehleDatei(kaputt);
    await waitFor(() => expect(document.activeElement).toBe(importKnopf()), LANG);
    expect(screen.queryByRole("heading", { name: /^Vorschau/ })).toBeNull();
    expect(angesagt()).toMatch(/Excel/);
  });

  it("„Abbrechen\" legt nichts an und führt auf den Import-Schalter; ein Klassenwechsel verwirft die Vorschau", async () => {
    const { lehrkraft, klasse, andere } = baue();
    const add = vi.spyOn(typingBackend(), "addPupil");
    const { ansicht } = zeige(lehrkraft, klasse, [klasse, andere]);
    const datei = await xlsxDatei([[...VORLAGE_KOPF], ["Mia", "", ""]]);

    await waehleDatei(datei);
    await screen.findByRole("heading", { name: /^Vorschau/ }, LANG);
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    await waitFor(() => expect(document.activeElement).toBe(importKnopf()));
    expect(screen.queryByRole("heading", { name: /^Vorschau/ })).toBeNull();
    expect(angesagt()).toContain("Import abgebrochen - es wurde kein Teilnehmer angelegt.");

    // Escape in der Vorschau bricht genauso ab.
    await waehleDatei(datei);
    const kopf = await screen.findByRole("heading", { name: /^Vorschau/ }, LANG);
    fireEvent.keyDown(kopf, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("heading", { name: /^Vorschau/ })).toBeNull());

    // Klassenwechsel.
    await waehleDatei(datei);
    await screen.findByRole("heading", { name: /^Vorschau/ }, LANG);
    ansicht.rerender(
      <KlasseUndKinder
        teacher={lehrkraft}
        classes={[klasse, andere]}
        cls={andere}
        pupils={[]}
        offeneProgramme={[]}
        einstiegsProgramm="tippen"
        onSelectClass={() => {}}
        onChanged={() => {}}
      />,
    );
    expect(screen.queryByRole("heading", { name: /^Vorschau/ })).toBeNull();
    expect(add).not.toHaveBeenCalled();
  });

  it("★ „Vorlage herunterladen (Excel)\" lädt „Teilnehmer-Vorlage_3b_<Datum>.xlsx\" - mit Klasse, Datum und Startniveau der Klasse", async () => {
    const { lehrkraft, klasse, andere } = baue();
    let datei: Blob | null = null;
    const erzeugt = vi.fn((b: Blob) => {
      datei = b;
      return "blob:vorlage";
    });
    Object.assign(URL, { createObjectURL: erzeugt, revokeObjectURL: vi.fn() });
    const namen: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      namen.push(this.download);
    });
    zeige(lehrkraft, klasse, [klasse, andere]);
    const knopf = screen.getByRole("button", { name: "Vorlage herunterladen (Excel)" });
    const dateiname = vorlageDateiname("3b", Date.now());
    expect(dateiname).toMatch(/^Teilnehmer-Vorlage_3b_\d{4}-\d{2}-\d{2}\.xlsx$/);
    // Der Hinweis nennt den Dateinamen - über `Tipp`, nie `title`.
    expect(knopf.hasAttribute("title")).toBe(false);
    expect(document.getElementById(knopf.getAttribute("aria-describedby") ?? "")?.textContent).toContain(
      dateiname,
    );
    fireEvent.click(knopf);
    await waitFor(() => expect(namen).toEqual([dateiname]), { timeout: 15000 });
    expect(erzeugt).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(angesagt()).toContain(`Die Vorlage „${dateiname}“ wird heruntergeladen.`));

    // ★ Die Datei selbst: Überschrift mit der Klasse, „für alle" = Startniveau der Klasse.
    const r = await leseKinderXlsx(await dateiBytes(datei!));
    expect(r).toEqual({ ok: true, zeilen: [], fuerAlle: V[2].label, titel: "Klasse 3b - Teilnehmer anlegen" });
  }, 20000);

  it("★ eine Vorlage einer ANDEREN Klasse: die Vorschau sagt es sichtbar - und sperrt nichts", async () => {
    const { lehrkraft, klasse, andere } = baue();
    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load((await vorlageAlsBytes({ name: "4a" })) as unknown as ArrayBuffer);
    wb.getWorksheet("Teilnehmer")!.getCell("A9").value = "Mia";
    const bytes = (await wb.xlsx.writeBuffer()) as ArrayBuffer;
    const datei = new File([bytes], "vorlage-4a.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    zeige(lehrkraft, klasse, [klasse, andere]);
    await waehleDatei(datei);
    const kopf = await screen.findByRole("heading", { name: /^Vorschau/ }, LANG);
    const satz = fremdeKlasseHinweis("Klasse 4a - Teilnehmer anlegen", "3b")!;
    expect(satz).toContain("„Klasse 4a - Teilnehmer anlegen“");
    expect(kopf.closest("section")!.textContent).toContain(satz);
    expect(sichtbar(satz)).toBe(true);
    expect(angesagt()).toContain(satz);
    // Nicht gesperrt: Mia wird angelegt, sobald man bestätigt.
    expect(screen.getByRole("button", { name: "1 Teilnehmer anlegen" }).getAttribute("aria-disabled")).toBe("false");
  }, 20000);
});
