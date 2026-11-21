/**
 * WÄCHTER über „EIGENE ÜBUNG" aus der Sicht des Kindes (17.09.2026).
 *
 * Geprüft wird der ganze Weg über das LOKALE Backend: Lehrkraft lädt einen
 * Text hoch und weist ihn der Klasse zu → EIN Kind ist dran, ein anderes Kind
 * (das seinen Durchlauf schon beendet hat) ist es NICHT mehr → Fortschritt
 * (Zeile, Tastenstatistik) übersteht ein "Neuladen" des Hakens → nach „fertig"
 * schaltet die Übung für GENAU dieses Kind ab, unabhängig vom Klassenzustand.
 *
 * ⚠️ Das ist die Stelle, an der die eigentliche Zusage des Auftrags hängt
 * ("jedes Kind übt im eigenen Tempo") - ein Modell-Test der reinen Funktionen
 * in `eigenerText.ts` würde das nicht zeigen, weil dort keine Zeit und kein
 * Konto vorkommt.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { addPupil, createClass, registerTeacher } from "@/lib/typing/account";
import { _resetTypingBackend, typingBackend } from "@/lib/typing/backend";
import { useEigeneUebung } from "@/lib/typing/useEigeneUebung";

beforeEach(() => {
  localStorage.clear();
  _resetTypingBackend();
});

afterEach(() => {
  localStorage.clear();
});

function neueKlasseMitZweiKindern() {
  const t = registerTeacher("Frau Test", `eu-${Math.random()}@example.org`, "geheim1");
  if (!t.ok) throw new Error("Lehrkraft nicht angelegt");
  const c = createClass(t.value.id, "EU-Klasse");
  if (!c.ok) throw new Error("Klasse nicht angelegt");
  const p1 = addPupil(c.value.code, "Mia", "pw12");
  const p2 = addPupil(c.value.code, "Ben", "pw12");
  if (!p1.ok || !p2.ok) throw new Error("Kinder nicht angelegt");
  return { teacher: t.value, cls: c.value, mia: p1.value, ben: p2.value };
}

describe("Eigene Übung: der ganze Weg über das lokale Backend", () => {
  it("ohne Zuweisung ist niemand dran", async () => {
    const { mia } = neueKlasseMitZweiKindern();
    const { result } = renderHook(() => useEigeneUebung(mia));
    await waitFor(() => expect(result.current.geladen).toBe(true));
    expect(result.current.dran).toBe(false);
    expect(result.current.zeiger).toBeNull();
  });

  it("nach der Zuweisung ist die Klasse dran, mit dem richtigen Text", async () => {
    const { teacher, cls, mia } = neueKlasseMitZweiKindern();
    const textId = await typingBackend().speichereEigenenText(cls.code, teacher.id, "gedicht.txt", [
      "Erste Zeile",
      "Zweite Zeile",
      "Dritte Zeile",
    ]);
    expect(textId).not.toBeNull();
    const neu = await typingBackend().starteEigeneUebung(cls.code, teacher.id, {
      textId: textId!,
      dateiname: "gedicht.txt",
    });
    expect(neu).not.toBeNull();

    const { result } = renderHook(() => useEigeneUebung(mia));
    await waitFor(() => expect(result.current.geladen).toBe(true));
    expect(result.current.dran).toBe(true);
    await waitFor(() => expect(result.current.text?.zeilen).toEqual([
      "Erste Zeile",
      "Zweite Zeile",
      "Dritte Zeile",
    ]));
    expect(result.current.startZeile).toBe(0);
  });

  it("★★★ jedes Kind übt im eigenen Tempo - fertig heisst NICHT fertig für die Klasse", async () => {
    const { teacher, cls, mia, ben } = neueKlasseMitZweiKindern();
    const textId = await typingBackend().speichereEigenenText(cls.code, teacher.id, "text.txt", [
      "Zeile A",
      "Zeile B",
    ]);
    await typingBackend().starteEigeneUebung(cls.code, teacher.id, {
      textId: textId!,
      dateiname: "text.txt",
    });

    const miaHook = renderHook(() => useEigeneUebung(mia));
    await waitFor(() => expect(miaHook.result.current.geladen).toBe(true));
    expect(miaHook.result.current.dran).toBe(true);

    // Mia schreibt die erste Zeile fertig - Fortschritt UND Tastenstatistik
    // wandern in EINEM Aufruf weg.
    act(() => {
      miaHook.result.current.meldeFortschritt({
        zeile: 1,
        anschlaege: [{ char: "a", correct: true, ms: 120 }],
      });
    });
    await waitFor(() => expect(miaHook.result.current.startZeile).toBe(1));
    // Z1: gespeichert wird „frisch lesen, dann schreiben" - einen Schritt später.
    await waitFor(async () =>
      expect((await typingBackend().getProgress(mia.id)).letters?.a?.hits).toBe(1),
    );
    // Noch nicht fertig - die Klasse bleibt dran.
    expect(miaHook.result.current.dran).toBe(true);

    // Mia schreibt die letzte Zeile fertig UND meldet "fertig" (wie
    // EigeneUebungLauf es beim Dismiss der Abschluss-Karte tut).
    act(() => {
      miaHook.result.current.meldeFortschritt({ zeile: 2, anschlaege: [], fertig: true });
    });
    await waitFor(() => expect(miaHook.result.current.dran).toBe(false));

    // Ben hat nichts davon mitbekommen - er ist FRISCH dran.
    const benHook = renderHook(() => useEigeneUebung(ben));
    await waitFor(() => expect(benHook.result.current.geladen).toBe(true));
    expect(benHook.result.current.dran).toBe(true);
    expect(benHook.result.current.startZeile).toBe(0);
  });

  it("★ keine neue Taste wird freigeschaltet - introduced bleibt unverändert", async () => {
    const { teacher, cls, mia } = neueKlasseMitZweiKindern();
    const vorher = (await typingBackend().getProgress(mia.id)).introduced;
    const textId = await typingBackend().speichereEigenenText(cls.code, teacher.id, "text.txt", [
      "Zeile mit vielen Ω Zeichen",
    ]);
    await typingBackend().starteEigeneUebung(cls.code, teacher.id, {
      textId: textId!,
      dateiname: "text.txt",
    });
    const { result } = renderHook(() => useEigeneUebung(mia));
    await waitFor(() => expect(result.current.geladen).toBe(true));
    act(() => {
      result.current.meldeFortschritt({
        zeile: 1,
        anschlaege: [{ char: "z", correct: true, ms: 100 }],
        fertig: true,
      });
    });
    await waitFor(() => expect(result.current.dran).toBe(false));
    // Die Tastenstatistik hat sich geändert (siehe Test oben) - die
    // Freischaltung ausdrücklich NICHT: `useEigeneUebung` importiert
    // `wendeRundenendeAn` nirgends (siehe Kopfkommentar der Datei).
    expect((await typingBackend().getProgress(mia.id)).introduced).toEqual(vorher);
  });
});
