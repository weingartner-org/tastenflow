/**
 * WÄCHTER über das ANKÜNDIGUNGSFENSTER „EIGENE ÜBUNG" (E6, 19.09.2026).
 *
 * Johannes wörtlich (18.09.2026 abends, Entwurf §7b): „bei der eigenen Übung
 * soll unten stehen 'Eigene Übung starten', dann bekommen alle ein Popup mit
 * 'Weiter geht es mit einer Übung von deiner Lehrkraft', Kinder können nur
 * auf 'Weiter' klicken, nicht ablehnen."
 *
 * Vier Teile, vier verschiedene Ebenen (die schnellste, die die jeweilige
 * Frage beantwortet - ein Test gegen die ganze `TippenTrainerPage` wäre für
 * jede dieser Fragen viel zu schwer):
 *  (a) `EigeneUebungAnkuendigung.tsx` - das Fenster selbst: nur „Weiter",
 *      Fokus, Ansage, Anrede.
 *  (b) `useEigeneUebungAnkuendigung.ts` - WANN es steht: wartet auf eine
 *      laufende Tippchallenge/ein laufendes Klassenmatch, kommt beim
 *      nächsten Öffnen von selbst, kündigt dieselbe Übung nicht zweimal an,
 *      die nächste der Reihe aber wieder (Z1).
 *  (c) `useEigeneUebung.ts` - dass die Zuweisung wirklich per REALTIME
 *      ankommt (kein Vorspulen einer Uhr nötig - würde nur der 45-s-Takt
 *      liefern, wäre dieser Test nie fertig).
 *  (d) Das Zusammenspiel: Nach „Weiter" landet der Fokus im Übungsfeld -
 *      demselben Weg, den auch `TypingSession` beim Aufbau nimmt
 *      (`focusField.ts`).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { useEffect, useRef, useState } from "react";

vi.mock("@/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing/voice")>();
  return { ...echt, speakUiAlways: vi.fn() };
});

import { EigeneUebungAnkuendigung } from "@/components/typing/EigeneUebungAnkuendigung";
import { speakUiAlways } from "@/lib/typing/voice";
import {
  useEigeneUebungAnkuendigung,
  type EigeneUebungAnkuendigungAuftrag,
} from "@/lib/typing/useEigeneUebungAnkuendigung";
import { setzeMerkfensterZurueck } from "@/lib/typing/merkfenster";
import { FOCUS_FIELD_EVENT, takePracticeFocusRequest } from "@/lib/typing/focusField";
import type { EigenerTextZeiger } from "@/lib/typing/eigenerText";
import type { TypingAccount, TypingClass } from "@/lib/typing/account";

beforeEach(() => {
  setzeMerkfensterZurueck();
  vi.mocked(speakUiAlways).mockClear();
});
afterEach(() => setzeMerkfensterZurueck());

const ZEIGER: EigenerTextZeiger = { textId: "text-1", angelegtMs: 1, dateiname: "gedicht.txt" };

describe("(a) Das Fenster selbst", () => {
  it("★★★ genau EIN Satz, genau EIN Schalter - 'Weiter'", () => {
    render(<EigeneUebungAnkuendigung skin="kind" onWeiter={vi.fn()} />);
    expect(
      screen.getByText("Weiter geht es mit einer Übung von deiner Lehrkraft."),
    ).toBeInTheDocument();
    // Der Dialog trägt genau EINEN Schalter, der etwas TUT - dazu kommt nur
    // das ✕ von `Modal.tsx`, das (siehe Kopfkommentar) dasselbe bedeutet:
    // weiter. Es gibt keinen zweiten, ablehnenden Weg.
    expect(screen.getByRole("button", { name: "Weiter" })).toBeInTheDocument();
  });

  it("★★★ Fokus steht beim Öffnen auf 'Weiter'", async () => {
    render(<EigeneUebungAnkuendigung skin="kind" onWeiter={vi.fn()} />);
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByRole("button", { name: "Weiter" })),
    );
  });

  it("Klick auf 'Weiter' ruft onWeiter", () => {
    const onWeiter = vi.fn();
    render(<EigeneUebungAnkuendigung skin="kind" onWeiter={onWeiter} />);
    fireEvent.click(screen.getByRole("button", { name: "Weiter" }));
    expect(onWeiter).toHaveBeenCalledTimes(1);
  });

  it("★★★ Escape ruft ebenfalls onWeiter - es gibt nichts abzulehnen", () => {
    const onWeiter = vi.fn();
    render(<EigeneUebungAnkuendigung skin="kind" onWeiter={onWeiter} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onWeiter).toHaveBeenCalledTimes(1);
  });

  it("wird EINMAL angesagt (calm, kein wiederholtes Blitzen)", () => {
    const { rerender } = render(<EigeneUebungAnkuendigung skin="kind" onWeiter={vi.fn()} />);
    expect(vi.mocked(speakUiAlways)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(speakUiAlways)).toHaveBeenCalledWith(
      "Weiter geht es mit einer Übung von deiner Lehrkraft.",
    );
    // Ein erneutes Rendern (z. B. weil die Elternkomponente aus anderem
    // Grund neu rendert) darf die Ansage NICHT wiederholen.
    rerender(<EigeneUebungAnkuendigung skin="kind" onWeiter={vi.fn()} />);
    expect(vi.mocked(speakUiAlways)).toHaveBeenCalledTimes(1);
  });

  it("★ Erwachsenen-Profil: seit 19.09.2026 per Du - 'deiner Lehrkraft'", () => {
    // Johannes 19.09.2026: „Schüler und Selbstlernende mit du" - auch ab 16.
    // „Sie" liest nur die Lehrkraft, und die bekommt dieses Fenster nie.
    render(<EigeneUebungAnkuendigung skin="erwachsen" onWeiter={vi.fn()} />);
    expect(
      screen.getByText("Weiter geht es mit einer Übung von deiner Lehrkraft."),
    ).toBeInTheDocument();
  });
});

describe("(b) Wann das Fenster steht (useEigeneUebungAnkuendigung)", () => {
  /**
   * Seit Z1 (19.09.2026) merkt sich nicht mehr dieser Haken (am Gerät), ob
   * bestätigt ist, sondern `useEigeneUebung` am KONTO - hereingereicht als
   * `angekuendigt`, gemerkt über `merkeBestaetigt`. Der ganze Weg samt
   * Klassen-Rechner mit zwei Kindern: `tastenflow-eigene-uebung-reihe.test.tsx`.
   */
  type Stand = Omit<EigeneUebungAnkuendigungAuftrag, "merkeBestaetigt">;
  function baue(auftrag: Stand) {
    const merkeBestaetigt = vi.fn();
    const r = renderHook(
      (a: Stand) => useEigeneUebungAnkuendigung({ ...a, merkeBestaetigt }),
      { initialProps: auftrag },
    );
    return { ...r, merkeBestaetigt };
  }

  it("Fenster beim nächsten Öffnen: dran und noch nicht bestätigt -> zeigt sofort", () => {
    const { result } = baue({ dran: true, zeiger: ZEIGER, gesperrt: false, angekuendigt: false });
    expect(result.current.zeigen).toBe(true);
  });

  it("ohne Übung: kein Fenster", () => {
    const { result } = baue({ dran: false, zeiger: null, gesperrt: false, angekuendigt: false });
    expect(result.current.zeigen).toBe(false);
  });

  it("★★★ wartet, solange eine Tippchallenge oder ein Klassenmatch läuft", () => {
    const { result, rerender } = baue({ dran: true, zeiger: ZEIGER, gesperrt: true, angekuendigt: false });
    expect(result.current.zeigen).toBe(false);
    // Die Prüfung/das Match ist vorbei - jetzt darf das Fenster kommen.
    rerender({ dran: true, zeiger: ZEIGER, gesperrt: false, angekuendigt: false });
    expect(result.current.zeigen).toBe(true);
  });

  it("★★★ 'Weiter' schliesst sofort UND merkt es am Konto", () => {
    const { result, merkeBestaetigt } = baue({
      dran: true,
      zeiger: ZEIGER,
      gesperrt: false,
      angekuendigt: false,
    });
    act(() => result.current.bestaetigen());
    expect(result.current.zeigen).toBe(false);
    expect(merkeBestaetigt).toHaveBeenCalledTimes(1);
  });

  it("★★★ schon bestätigt (am Konto - gestern, anderes Gerät) -> kein Fenster, die Übung läuft einfach weiter", () => {
    const { result } = baue({ dran: true, zeiger: ZEIGER, gesperrt: false, angekuendigt: true });
    expect(result.current.zeigen).toBe(false);
  });

  it("★★★ die NÄCHSTE Übung der Reihe (andere textId) kündigt wieder an", () => {
    const { result, rerender } = baue({ dran: true, zeiger: ZEIGER, gesperrt: false, angekuendigt: false });
    act(() => result.current.bestaetigen());
    expect(result.current.zeigen).toBe(false);
    const neu: EigenerTextZeiger = { textId: "text-2", angelegtMs: 2, dateiname: "neu.txt" };
    rerender({ dran: true, zeiger: neu, gesperrt: false, angekuendigt: false });
    expect(result.current.zeigen).toBe(true);
  });
});

describe("(c) Realtime - nicht der 45-Sekunden-Takt", () => {
  /**
   * ⚠️ Das LOKALE Backend (`_resetTypingBackend`, wie in
   * `typing-eigene-uebung-hook.test.tsx`) hat gar kein Realtime -
   * `beobachteKlasse` ist dort mit Absicht ein No-op („Lokal gibt es keinen
   * Server, der etwas melden könnte"). Ob die Zuweisung über Realtime UND
   * NICHT nur über den 45-s-Takt ankommt, lässt sich darum nur prüfen, indem
   * `beobachteKlasse` selbst nachgebaut wird - genau das tut dieser Mock.
   */
  it("★★★★★ eine Zuweisung kommt SOFORT per Realtime an, ohne einen Timer vorzuspulen", async () => {
    // ★ `EigeneUebungAnkuendigung` (oben statisch importiert) zieht über die
    // Sammel-Datei „@/lib/typing" das ECHTE `backend.ts` schon beim Laden
    // dieser Testdatei mit ein - `vi.doMock` allein käme dafür zu spät
    // (es wirkt nur auf einen Import, der DANACH zum ersten Mal aufgelöst
    // wird). `resetModules` leert den Zwischenspeicher, damit der folgende
    // dynamische Import von `useEigeneUebung` sein `./backend` wirklich neu
    // auflöst - gegen den Mock, nicht gegen den längst geladenen Erstlauf.
    vi.resetModules();
    let klasseHoerer: ((cls: TypingClass) => void) | null = null;
    let klasse: TypingClass = {
      code: "K1",
      name: "K1",
      teacherId: "t1",
      createdAt: 0,
      settings: {},
    };

    vi.doMock("@/lib/typing/backend", () => ({
      typingBackend: () => ({
        getClass: async (code: string) => (code === klasse.code ? klasse : null),
        beobachteKlasse: (code: string, cb: (cls: TypingClass) => void) => {
          if (code === klasse.code) klasseHoerer = cb;
          return () => {
            klasseHoerer = null;
          };
        },
        getProgress: async () => ({ xp: 0, lessons: {} }),
        leseEigenenText: async () => ({ dateiname: "gedicht.txt", zeilen: ["Erste Zeile"] }),
      }),
    }));

    const { useEigeneUebung } = await import("@/lib/typing/useEigeneUebung");
    const konto: TypingAccount = {
      id: "mia",
      role: "schueler",
      name: "Mia",
      classCode: "K1",
      createdAt: 1,
    };

    const { result } = renderHook(() => useEigeneUebung(konto));
    await waitFor(() => expect(result.current.geladen).toBe(true));
    expect(result.current.dran).toBe(false);

    // Die Lehrkraft weist jetzt zu - der Server meldet das dem Kind über
    // Realtime (`beobachteKlasse`), NICHT über den 45-s-Takt
    // (`EIGENE_UEBUNG_NACHFRAGE_MS`). Kein Timer wird hier je vorgespult;
    // würde nur der Takt liefern, bliebe `dran` bis zum Standard-Zeitlimit
    // von `waitFor` (1 s) falsch - genau das hat diesen Test beim ersten
    // Anlauf (gegen das lokale Backend) auch gezeigt.
    klasse = {
      ...klasse,
      settings: {
        eigeneUebung: { textId: "t-1", dateiname: "gedicht.txt", angelegtMs: Date.now() },
      },
    };
    act(() => {
      klasseHoerer?.(klasse);
    });

    await waitFor(() => expect(result.current.dran).toBe(true));
    // ★ Z1: Die Klasse trägt hier noch den ALTEN Zeiger (`settings.eigeneUebung`)
    // - er gilt als Reihe mit einem Eintrag (faules Umziehen).
    expect(result.current.zeiger?.textId).toBe("t-1");
  });
});

describe("(d) Nach 'Weiter': der Fokus landet im Übungsfeld", () => {
  /**
   * Steht für `EigeneUebungLauf`/`TypingSession`, die den Fokus über
   * `focusField.ts` genau so abholen (siehe dort) - ein volles Aufbauen
   * dieser schweren Bauteile ist für diese Frage nicht nötig.
   */
  function UebungsfeldAttrappe() {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
      const holen = () => ref.current?.focus();
      window.addEventListener(FOCUS_FIELD_EVENT, holen);
      if (takePracticeFocusRequest()) holen();
      return () => window.removeEventListener(FOCUS_FIELD_EVENT, holen);
    }, []);
    return <input ref={ref} aria-label="Übungsfeld" />;
  }

  function Seite() {
    const [zeigtFenster, setZeigtFenster] = useState(true);
    return zeigtFenster ? (
      <EigeneUebungAnkuendigung skin="kind" onWeiter={() => setZeigtFenster(false)} />
    ) : (
      <UebungsfeldAttrappe />
    );
  }

  it("★★★ 'Weiter' schliesst das Fenster, danach steht der Fokus im Übungsfeld", async () => {
    render(<Seite />);
    fireEvent.click(screen.getByRole("button", { name: "Weiter" }));
    await waitFor(() => expect(screen.getByLabelText("Übungsfeld")).toBe(document.activeElement));
  });
});
