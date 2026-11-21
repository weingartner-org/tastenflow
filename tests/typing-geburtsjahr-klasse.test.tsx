/**
 * ════════════════════════════════════════════════════════════════════════════
 * ★★★★ WÄCHTER: In „Meine Klasse" gibt es KEIN Geburtsjahr und KEINE Textstufe
 * je Kind mehr (B10/B11, Umbau 11.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * ── Was hier bis zum 11.09.2026 stand ──────────────────────────────────────
 * Dieselbe Datei war der Wächter über das Gegenteil: Seit dem Tiefentest S6
 * (22.08.2026) war das Geburtsjahr in „Meine Klasse" NACHTRÄGLICH änderbar -
 * ein Zahlendreher („2061" statt „2016") hatte ein Kind bis dahin dauerhaft in
 * die falsche Textstufe gesperrt, und eine einmal fest gewählte Stufe liess
 * sich nicht wieder auf „wächst mit" zurückstellen.
 *
 * ── Warum er jetzt das Gegenteil prüft ─────────────────────────────────────
 * Johannes am 11.09.2026: *„Jede Klasse hat also nur eine Textstufe."* Die
 * Textstufe kommt seither aus der SCHULSTUFE der Klasse
 * (`klassenEinstellungen.ts`), eingetragen im Kasten „Einstellungen der
 * Klasse". Damit ist das Problem von S6 nicht etwa zurück - es ist an der
 * WURZEL weg:
 *
 *   · Es gibt keinen Zahlendreher mehr, weil kein Jahr mehr erhoben wird.
 *   · Es gibt kein „fest gewählt gegen wächst mit" mehr, weil es nur noch
 *     EINEN Weg gibt, und der wächst von selbst mit jedem Schuljahr.
 *   · Korrigiert wird einmal je Klasse statt 24-mal je Kind.
 *
 * Der Wächter hält deshalb fest, dass die beiden Felder WIRKLICH weg sind -
 * ein halber Rückbau, bei dem dieselbe Einstellung an zwei Stellen steht,
 * wäre genau die Doppelung, die sich am zweiten Tag auseinanderlebt
 * ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * ⚠️ Die Backend-Wege `setGeburtsjahr` und `setStufe` BLEIBEN und werden hier
 * mitgeprüft: Selbstlernende Konten ohne Klasse stellen beides weiterhin selbst
 * im Zahnrad ein. Weggefallen ist nur die Bedienung durch die Lehrkraft je Kind.
 *
 * Die neue Regel selbst prüfen:
 *   · `tests/typing-klassen-einstellungen.test.ts` (Schulstufe ⇒ Textstufe)
 *   · `tests/tastenflow-klassen-vorrang.test.tsx` (sie gilt beim Kind)
 *   · `tests/tastenflow-startniveau-klasse.test.tsx` (der Kasten der Klasse)
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { typingBackend } from "@/lib/typing";
import type { TypingAccount } from "@/lib/typing";

const JAHR = 2016;

function kind(extra: Partial<TypingAccount> = {}): TypingAccount {
  return {
    id: "k1",
    role: "schueler",
    name: "Mia",
    classCode: "3B",
    ...extra,
  } as TypingAccount;
}

const speichern = vi.spyOn(typingBackend(), "setGeburtsjahr");

beforeEach(() => {
  localStorage.clear();
  speichern.mockReset();
  speichern.mockResolvedValue(null);
});
afterEach(() => cleanup());

/** Reiter rendern und die Zeile von Mia aufklappen. */
async function zeigeReiter(pupil: TypingAccount) {
  render(<TastenflowReiter pupils={[pupil]} onChanged={() => {}} />);
  await screen.findByRole("table", { name: /Lernende der Klasse/ });
  await act(async () => {
    fireEvent.click(
      screen.getByRole("button", {
        name: "Einstellungen und Auswertung von Mia ausklappen",
      }),
    );
  });
}

describe("★★★ B10/B11 · Geburtsjahr und Textstufe stehen nicht mehr je Kind", () => {
  it("das Geburtsjahr-Feld gibt es nicht mehr - auch nicht mit hinterlegtem Jahr", async () => {
    await zeigeReiter(kind({ geburtsjahr: JAHR }));
    expect(screen.queryByRole("textbox", { name: "Geburtsjahr von Mia" })).toBeNull();
    expect(screen.queryByLabelText(/Geburtsjahr/i)).toBeNull();
  });

  it("das Textstufen-Feld gibt es nicht mehr - auch nicht mit fest gewählter Stufe", async () => {
    await zeigeReiter(kind({ stufe: "erwachsen" }));
    expect(screen.queryByRole("combobox", { name: "Textstufe von Mia" })).toBeNull();
    expect(screen.queryByLabelText(/Textstufe/i)).toBeNull();
  });

  it("und auch die Sprache samt Sperre steht nicht mehr je Kind", async () => {
    await zeigeReiter(kind({ lang: "en", langLocked: true }));
    expect(screen.queryByRole("combobox", { name: "Sprache von Mia" })).toBeNull();
    expect(screen.queryByRole("button", { name: /Sprach-Sperre .* Mia/ })).toBeNull();
  });

  it("beim blossen Aufklappen wird NICHTS geschrieben", async () => {
    /*
      ⚠️ Der wichtigste Fall des Rückbaus: Ein Rest des alten Feldes, der beim
      Aufbauen ein leeres Jahr wegschriebe, löschte das Geburtsjahr JEDES
      Kindes, dessen Zeile jemand aufklappt - und niemand sähe es.
    */
    await zeigeReiter(kind({ geburtsjahr: JAHR }));
    expect(speichern).not.toHaveBeenCalled();
  });

  it("geblieben ist, was wirklich je Kind gilt", async () => {
    await zeigeReiter(kind());
    expect(screen.getByLabelText(/^Womit Mia anfängt$/)).toBeTruthy();
    expect(
      screen.getByRole("checkbox", {
        name: "Einhand schreiben für Mia: Umschalt-Gegenhand-Regel aus",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("checkbox", {
        name: "Tempo zählt nicht für Mia: Geschwindigkeit wird nirgends bewertet",
      }),
    ).toBeTruthy();
  });
});

describe("★★ Der Backend-Weg bleibt - für selbstlernende Konten", () => {
  it("`setGeburtsjahr` gibt es weiterhin am Backend", () => {
    // ⚠️ Nicht bloss Kosmetik: Ein selbstlernendes Konto ohne Klasse setzt sein
    // Geburtsjahr weiter selbst im Zahnrad (`TypingSettings`). Wer diesen Weg
    // mit entfernt, nimmt ihnen die mitwachsende Textstufe.
    expect(typeof typingBackend().setGeburtsjahr).toBe("function");
    expect(typeof typingBackend().setStufe).toBe("function");
    expect(typeof typingBackend().setLang).toBe("function");
    // `setLangLocked` je Kind gibt es seit dem 11.09.2026 nicht mehr - die
    // Sperre setzt nur noch die Klasse (`setClassEinstellungen`).
    expect("setLangLocked" in typingBackend()).toBe(false);
  });
});
