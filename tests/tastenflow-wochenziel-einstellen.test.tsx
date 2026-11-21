/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★★ WÄCHTER: W3b - WOCHENZIEL EINSTELLEN (MINUTEN-MODELL)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * `BAUPLAN-2026-09-18-MEINE-KLASSEN-UMBAU.md` §„W · Wochenziel neu", Schritt
 * W3. Prüft die BEDIENUNG der Lehrkraft, die W3b gebaut hat - nicht mehr die
 * reine Rechnung (`wochenziel.ts`, W1: `tests/typing-wochenziel-neu.test.ts`)
 * und nicht die Anzeige in Tabelle/Statistik (W3a:
 * `tests/tastenflow-wochenziel-anzeige.test.tsx`):
 *
 *  1. „Für die Klasse übernehmen" - der genaue Popup-Text, und dass „Übernehmen"
 *     wirklich JEDES Kind schreibt (`setKlassenWochenziel`).
 *  2. Der Speichern-Knopf JE KIND - derselbe Popup-Aufbau, `setWochenziel`.
 *  3. Die anstehende Änderung wird angezeigt („ab Mo …: … Min."), solange die
 *     laufende Woche ihr altes Ziel behält.
 *  4. „Eine Stunde sperren" / „aufheben" - Beschriftung, Status, Fokus bleibt
 *     am Knopf.
 *  5. Der alte Unterrichtszeit-Kasten ist weg, und es steht keine stehende
 *     Erklärung mehr unter den Feldern (nur noch `Tipp`, kein `title`).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";

import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import type { TypingAccount, TypingClass } from "@/lib/typing";
import {
  addPupil,
  createClass,
  getAccount,
  getClass,
  listPupils,
  registerTeacher,
} from "@/lib/typing/account";
import { naechsteWocheKey, wochenStartFuerSchluessel } from "@/lib/typing/wochenziel";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** „21.09." - dasselbe Format wie das Popup selbst. */
function datumKurz(ms: number): string {
  const d = new Date(ms);
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.`;
}

/** Klasse „3b" mit den gegebenen Kindern anlegen. */
function baueKlasse(namen: string[]) {
  const t = registerTeacher("Frau Berger", "berger@example.org", "geheim123");
  if (!t.ok) throw new Error(t.error);
  const c = createClass(t.value.id, "3b", "3B");
  if (!c.ok) throw new Error(c.error);
  for (const name of namen) {
    const p = addPupil(c.value.code, name, "pw1234");
    if (!p.ok) throw new Error(p.error);
  }
  return {
    lehrkraftId: t.value.id,
    code: c.value.code,
    kinder: listPupils(c.value.code),
  };
}

async function zeigeReiter(kinder: TypingAccount[], cls: TypingClass, teacherId: string) {
  render(<TastenflowReiter pupils={kinder} onChanged={() => {}} cls={cls} teacherId={teacherId} />);
  await screen.findByRole("table", { name: /Lernende der Klasse/ });
}

/**
 * Die Statuszeile der SEITE - eindeutig, auch wenn „Nachricht an die Klasse"
 * (mit `cls`/`teacherId` immer im Baum) ihre eigene, hier stets LEERE
 * Status-Zeile mitbringt und `getByRole("status")` sonst zwei Treffer fände.
 */
function seitenStatus(): HTMLElement {
  const kandidaten = screen.getAllByRole("status");
  return kandidaten.find((el) => (el.textContent ?? "").trim() !== "") ?? kandidaten[0];
}

/** Die Zeile EINES Kindes aufklappen, bis „Einstellungen für {Name}" offen ist. */
async function oeffneEinstellungen(name: string) {
  const knopf = screen.getByRole("button", {
    name: `Einstellungen und Auswertung von ${name} ausklappen`,
  });
  await act(async () => {
    fireEvent.click(knopf);
  });
  fireEvent.click(screen.getByText(new RegExp(`^Einstellungen für ${name}\\b`)));
}

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("★★★★★ Für die Klasse übernehmen - Popup-Text und Schreiben", () => {
  const JETZT = new Date(2026, 8, 14, 9, 0, 0).getTime(); // Montag, 14.09.2026, 09:00

  it(`zeigt den genauen Popup-Text und schreibt bei „Übernehmen" jedem Kind das Ziel`, async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(JETZT);
    const { kinder, code, lehrkraftId } = baueKlasse(["Mia", "Noah"]);
    const cls = getClass(code)!;
    await zeigeReiter(kinder, cls, lehrkraftId);

    fireEvent.click(screen.getByRole("button", { name: /^Wochenziel/ }));
    const region = screen.getByRole("region", { name: "Wochenziel" });
    fireEvent.change(within(region).getByLabelText("Minuten pro Woche"), {
      target: { value: "60" },
    });

    fireEvent.click(within(region).getByRole("button", { name: "Für die Klasse übernehmen" }));

    const montag = datumKurz(wochenStartFuerSchluessel(naechsteWocheKey(JETZT))!);
    const dialog = screen.getByRole("dialog", { name: "Wochenziel für die Klasse 3b" });
    expect(
      within(dialog).getByText(
        `Alle 2 Kinder bekommen 60 Minuten pro Woche. Das gilt ab Montag, ${montag}, 8:00 Uhr - ` +
          `bis dahin bleibt das bisherige Ziel. Einzeln eingestellte Ziele werden dabei überschrieben. ` +
          `Kinder, die später dazukommen, bekommen dieses Ziel auch.`,
      ),
    ).toBeTruthy();

    await act(async () => {
      fireEvent.click(within(dialog).getByRole("button", { name: "Übernehmen" }));
    });

    const naechste = naechsteWocheKey(JETZT);
    for (const k of kinder) {
      const acc = getAccount(k.id)!;
      expect(acc.wochenzielVerlauf).toEqual([{ ab: naechste, minuten: 60 }]);
    }
    const klasseNachher = getClass(code)!;
    expect(klasseNachher.wochenzielVorgabe?.minuten).toBe(60);
    expect(seitenStatus()).toHaveTextContent(
      /Wochenziel \(60 Minuten\) für 2 von 2 Lernenden gespeichert/,
    );
  });

  it(`sagt „kein Wochenziel mehr", wenn 0 Minuten übernommen werden`, async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(JETZT);
    const { kinder, code, lehrkraftId } = baueKlasse(["Mia"]);
    const cls = getClass(code)!;
    await zeigeReiter(kinder, cls, lehrkraftId);

    fireEvent.click(screen.getByRole("button", { name: /^Wochenziel/ }));
    const region = screen.getByRole("region", { name: "Wochenziel" });
    // Feld beginnt leer (keine Vorgabe) - erst 60 eintragen und speichern,
    // damit „0" hinterher WIRKLICH eine Änderung ist, kein blosses Nichtstun.
    fireEvent.change(within(region).getByLabelText("Minuten pro Woche"), {
      target: { value: "0" },
    });
    fireEvent.click(within(region).getByRole("button", { name: "Für die Klasse übernehmen" }));

    const montag = datumKurz(wochenStartFuerSchluessel(naechsteWocheKey(JETZT))!);
    const dialog = screen.getByRole("dialog", { name: "Wochenziel für die Klasse 3b" });
    expect(
      within(dialog).getByText(
        `Das eine Kind bekommt kein Wochenziel mehr. Das gilt ab Montag, ${montag}, 8:00 Uhr - ` +
          `bis dahin bleibt das bisherige Ziel. Einzeln eingestellte Ziele werden dabei überschrieben. ` +
          `Kinder, die später dazukommen, bekommen dieses Ziel auch.`,
      ),
    ).toBeTruthy();
  });

  it("ist gesperrt, solange kein gültiger Minutenwert eingetragen ist", async () => {
    const { kinder, code, lehrkraftId } = baueKlasse(["Mia"]);
    const cls = getClass(code)!;
    await zeigeReiter(kinder, cls, lehrkraftId);
    fireEvent.click(screen.getByRole("button", { name: /^Wochenziel/ }));
    const region = screen.getByRole("region", { name: "Wochenziel" });
    const knopf = within(region).getByRole("button", { name: "Für die Klasse übernehmen" });
    // Leeres Feld (Vorgabe) - der Knopf bleibt gesperrt, ein Klick schreibt nichts.
    expect(knopf.getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(knopf);
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.change(within(region).getByLabelText("Minuten pro Woche"), {
      target: { value: "45" },
    });
    expect(knopf.getAttribute("aria-disabled")).toBe("false");
  });
});

describe("★★★★★ Speichern je Kind - Popup-Text, Schreiben, anstehende Änderung", () => {
  const JETZT = new Date(2026, 8, 14, 9, 0, 0).getTime(); // Montag, 14.09.2026, 09:00

  it(`zeigt den Popup-Text mit dem Namen des Kindes und schreibt bei „Übernehmen"`, async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(JETZT);
    const { kinder, code, lehrkraftId } = baueKlasse(["Mia"]);
    const cls = getClass(code)!;
    await zeigeReiter(kinder, cls, lehrkraftId);
    await oeffneEinstellungen("Mia");

    const minutenFeld = document.getElementById(`gm-${kinder[0].id}`) as HTMLInputElement;
    fireEvent.change(minutenFeld, { target: { value: "45" } });
    fireEvent.click(screen.getByRole("button", { name: "Speichern" }));

    const montag = datumKurz(wochenStartFuerSchluessel(naechsteWocheKey(JETZT))!);
    const dialog = screen.getByRole("dialog", { name: "Wochenziel für Mia" });
    expect(
      within(dialog).getByText(
        `Das neue Ziel von 45 Minuten pro Woche gilt ab Montag, ${montag}, 8:00 Uhr. ` +
          `Bis dahin gilt das bisherige Ziel.`,
      ),
    ).toBeTruthy();

    await act(async () => {
      fireEvent.click(within(dialog).getByRole("button", { name: "Übernehmen" }));
    });

    const acc = getAccount(kinder[0].id)!;
    expect(acc.wochenzielVerlauf).toEqual([{ ab: naechsteWocheKey(JETZT), minuten: 45 }]);
    expect(seitenStatus()).toHaveTextContent("Wochenziel von Mia gespeichert.");
  });

  it("zeigt die anstehende Änderung, solange die laufende Woche ihr altes Ziel behält", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(JETZT);
    const { kinder, code, lehrkraftId } = baueKlasse(["Mia"]);
    const cls = getClass(code)!;
    await zeigeReiter(kinder, cls, lehrkraftId);
    await oeffneEinstellungen("Mia");

    expect(screen.getByText("kein Wochenziel")).toBeTruthy();

    const minutenFeld = document.getElementById(`gm-${kinder[0].id}`) as HTMLInputElement;
    fireEvent.change(minutenFeld, { target: { value: "60" } });
    fireEvent.click(screen.getByRole("button", { name: "Speichern" }));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
    });

    const montag = datumKurz(wochenStartFuerSchluessel(naechsteWocheKey(JETZT))!);
    // Die laufende Woche zeigt weiterhin „kein Wochenziel" - die Änderung
    // gilt erst ab der nächsten Woche (Johannes: „nicht ab dieser Woche!").
    expect(screen.getByText("kein Wochenziel")).toBeTruthy();
    expect(screen.getByText(`ab Mo ${montag}: 60 Min.`, { exact: false })).toBeTruthy();
  });

  it("meldet, wenn nichts geändert ist - ohne Popup", async () => {
    const { kinder, code, lehrkraftId } = baueKlasse(["Mia"]);
    const cls = getClass(code)!;
    await zeigeReiter(kinder, cls, lehrkraftId);
    await oeffneEinstellungen("Mia");
    fireEvent.click(screen.getByRole("button", { name: "Speichern" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(seitenStatus()).toHaveTextContent(
      "Am Wochenziel ist nichts geändert - es ist schon gespeichert.",
    );
  });
});

describe("★★★★★ Eine Stunde sperren / aufheben", () => {
  it("sperrt, meldet den Status, hält den Fokus - und hebt mit demselben Knopf wieder auf", async () => {
    const JETZT = new Date(2026, 8, 14, 10, 0, 0).getTime(); // 10:00
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(JETZT);
    const { kinder, code, lehrkraftId } = baueKlasse(["Mia"]);
    const cls = getClass(code)!;
    await zeigeReiter(kinder, cls, lehrkraftId);

    const knopf = screen.getByRole("button", { name: "Stunde sperren" });
    // ★ jsdom fokussiert einen Knopf bei `fireEvent.click` NICHT von selbst
    // (anders als ein echter Browser) - `focus()` stellt den Ausgangszustand
    // eines wirklich mit der Tastatur bedienten Knopfes her, siehe
    // `tastenflow-reiter-fokus.test.tsx`. Der `Tipp` daneben reagiert selbst
    // auf den Fokus (`onFocus`) - darum in `act`, sonst warnt React.
    await act(async () => {
      knopf.focus();
    });
    await act(async () => {
      fireEvent.click(knopf);
    });

    // ★ derselbe Knopf, nur die Beschriftung wechselt - Fokus bleibt stehen.
    const gesperrtKnopf = screen.getByRole("button", { name: /^Gesperrt bis \d{2}:\d{2} - aufheben$/ });
    expect(gesperrtKnopf).toBe(knopf);
    expect(document.activeElement).toBe(knopf);
    expect(seitenStatus()).toHaveTextContent(
      /Wochenziel für die Klasse gesperrt bis \d{2}:\d{2} - Übezeit und Statistik zählen weiter/,
    );
    // ★ [[feedback_messtoleranz_bei_gemessenem]]: `shouldAdvanceTime` lässt
    // ein paar echte Millisekunden verstreichen, während `act` auf die
    // Backend-Antwort wartet - nachsichtig geprüft, es geht um 60 Minuten,
    // nicht um Millisekunden.
    const klasseGesperrt = getClass(code)!;
    expect(klasseGesperrt.gesperrteZeiten).toHaveLength(1);
    const { abMs, bisMs } = klasseGesperrt.gesperrteZeiten![0];
    expect(Math.abs(abMs - JETZT)).toBeLessThan(1000);
    expect(bisMs - abMs).toBe(60 * 60_000);

    await act(async () => {
      fireEvent.click(knopf);
    });
    expect(screen.getByRole("button", { name: "Stunde sperren" })).toBe(knopf);
    expect(document.activeElement).toBe(knopf);
    expect(seitenStatus()).toHaveTextContent(
      "Die Sperre ist aufgehoben - geübte Zeit zählt ab sofort wieder fürs Wochenziel.",
    );
    const klasseAuf = getClass(code)!;
    expect(Math.abs(klasseAuf.gesperrteZeiten![0].bisMs - JETZT)).toBeLessThan(1000);
  });

  it(`kehrt von selbst zu „Stunde sperren" zurück, sobald die Stunde abgelaufen ist`, async () => {
    const JETZT = new Date(2026, 8, 14, 10, 0, 0).getTime();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(JETZT);
    const { kinder, code, lehrkraftId } = baueKlasse(["Mia"]);
    const cls = getClass(code)!;
    await zeigeReiter(kinder, cls, lehrkraftId);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Stunde sperren" }));
    });
    screen.getByRole("button", { name: /^Gesperrt bis/ });

    await act(async () => {
      vi.advanceTimersByTime(60 * 60_000 + 500);
    });

    expect(screen.getByRole("button", { name: "Stunde sperren" })).toBeTruthy();
  });
});

describe("★★★★★ Schlank: keine Unterrichtszeit mehr, keine stehende Erklärung, kein title", () => {
  it("zeigt keinen Unterrichtszeit-Kasten mehr im Wochenziel-Panel", async () => {
    const { kinder, code, lehrkraftId } = baueKlasse(["Mia"]);
    const cls = getClass(code)!;
    await zeigeReiter(kinder, cls, lehrkraftId);
    fireEvent.click(screen.getByRole("button", { name: /^Wochenziel/ }));

    expect(screen.queryByText(/Unterrichtszeit der Klasse/)).toBeNull();
    expect(screen.queryByLabelText("Unterricht am")).toBeNull();
    expect(screen.queryByLabelText("Stunde ist aus um")).toBeNull();
    expect(screen.queryByText(/Minuten\/Einheit/)).toBeNull();
    expect(screen.queryByText(/Einheiten\/Woche/)).toBeNull();
    expect(screen.queryByRole("button", { name: "Für alle übernehmen" })).toBeNull();
  });

  it("hat im Wochenziel-Panel keine stehende Erklärung und kein `title` mehr", async () => {
    const { kinder, code, lehrkraftId } = baueKlasse(["Mia"]);
    const cls = getClass(code)!;
    await zeigeReiter(kinder, cls, lehrkraftId);
    fireEvent.click(screen.getByRole("button", { name: /^Wochenziel/ }));
    const region = screen.getByRole("region", { name: "Wochenziel" });

    // Die alten Absätze („0 = kein Ziel. Leere Wochen-Auswahl …", „Gilt für
    // alle Lernenden …") sind weg - was zu sagen ist, steht im `Tipp`.
    expect(within(region).queryAllByText(/Leere Wochen-Auswahl/i)).toHaveLength(0);
    expect(within(region).queryAllByText(/Gilt für alle Lernenden/i)).toHaveLength(0);
    expect(region.querySelectorAll("p")).toHaveLength(0);
    expect(region.querySelectorAll("[title]")).toHaveLength(0);
  });

  it("hat auch in der Einstellungen-Zeile eines Kindes kein `title` mehr", async () => {
    const { kinder, code, lehrkraftId } = baueKlasse(["Mia"]);
    const cls = getClass(code)!;
    await zeigeReiter(kinder, cls, lehrkraftId);
    await oeffneEinstellungen("Mia");

    const zeile = screen.getByText(/^Einstellungen für Mia\b/).closest("details");
    expect(zeile).toBeTruthy();
    expect((zeile as HTMLElement).querySelectorAll("[title]")).toHaveLength(0);
  });
});
