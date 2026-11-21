/**
 * ★★★★★ WÄCHTER „ZEICHENABSTAND GROSS (CVI)" (E11, 18./19.09.2026).
 *
 * Johannes, wörtlich: *„neben dem Schalter 'Zeit lassen' und 'Einhand'
 * brauchen wir noch 'Zeichenabstand groß (CVI)', und alle Abstände werden
 * dreimal so groß"* - dann: *„ja, der Abstand soll dann überall gelten, machen
 * wir vielleicht 3 Stufen: doppelt, dreifach, vierfache Laufweite"* - und:
 * *„die Laufweite muss zwischen jedem Zeichen größer werden, nicht nur bei
 * Leerzeichen"*.
 *
 * Vier Teile:
 *  1. Der FAKTOR selbst (`zeichenabstandFaktor`) - die Normalisierung.
 *  2. Die RENDERUNG in `TypingSession`/`PromptText`: die Klasse `tt-laufweite`
 *     und die Variable `--tt-laufweite` stehen NUR bei 2/3/4, nie bei „aus" -
 *     und das unsichtbare Eingabefeld bekommt dieselbe Zusatzstrecke, sonst
 *     liegt der Cursor neben dem sichtbaren Zeichen (Falle vom 09.09.2026).
 *  3. Der SERVER-WÄCHTER: das Feld ist additiv (`setup.mjs`). Seit 19.09.2026
 *     setzt JEDES Kind es selbst, auch eines einer Klasse - der Wächter
 *     (`tt_pupils_field_guard.pb.js`) prüft nur den Wert. Johannes, wörtlich:
 *     *„die CVI-Einstellungen kann sich jedes Kind immer auch selbst in den
 *     Einstellungen einstellen, aber auch die Lehrkraft, Kinder dürfen es
 *     ändern wie sie möchten, natürlich auch Selbstlernende und welche ohne
 *     Account"*. Den Wächter AUSGEFÜHRT prüft
 *     `tests/tastenflow-selbst-alles-einstellen.test.tsx`.
 *  4. Die BEDIENUNG im Zahnrad (`TypingSettings`) - für jede Person ein
 *     Auswahlfeld; den Satz „deine Lehrkraft hat das eingestellt" gibt es
 *     nicht mehr.
 *
 * Die Teacher-Bedienung (Auswahlfeld in `PupilEinstellungen`) hat ihren
 * eigenen Wächter in `tests/tastenflow-einstellungen-speichern.test.tsx` -
 * dort steht schon der ganze Aufbau (Klasse, Kind, aufklappen).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("@/lib/typing/sound", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing/sound")>();
  return {
    ...echt,
    playBadgeSound: vi.fn(),
    playUnlockFanfare: vi.fn(),
    playKeySound: vi.fn(),
    playKeyTick: vi.fn(),
    playErrorSound: vi.fn(),
    playLineSound: vi.fn(),
    playSuccessSound: vi.fn(),
    playStarReward: vi.fn(),
    playStoryBadgeSound: vi.fn(),
  };
});

import { TypingSession } from "@/components/typing/TypingSession";
import { TypingSettings } from "@/components/typing/TypingSettings";
import {
  LAUFWEITE_CH_JE_STUFE,
  LAUFWEITE_ZEILENHOEHE_NORMAL,
  LAUFWEITE_ZEILENHOEHE_ZUSCHLAG_JE_STUFE,
  laufweiteFeld,
  laufweiteText,
  laufweiteZeilenhoehe,
  zeichenabstandFaktor,
} from "@/lib/typing/zeichenabstand";

afterEach(cleanup);

const lies = (pfad: string) => readFileSync(resolve(__dirname, "..", pfad), "utf-8");

describe("1 · Der Faktor - Normalisierung", () => {
  it("2, 3, 4, 5 bleiben, wie sie sind", () => {
    expect(zeichenabstandFaktor(2)).toBe(2);
    expect(zeichenabstandFaktor(3)).toBe(3);
    expect(zeichenabstandFaktor(4)).toBe(4);
    // ★ 22.09.2026: Stufe 5 „einfach" - siehe Abschnitt 5 unten.
    expect(zeichenabstandFaktor(5)).toBe(5);
  });

  it("alles andere ist „aus“ (1) - auch Alt-Konten ohne das Feld", () => {
    expect(zeichenabstandFaktor(undefined)).toBe(1);
    expect(zeichenabstandFaktor(null)).toBe(1);
    expect(zeichenabstandFaktor(0)).toBe(1);
    expect(zeichenabstandFaktor(1)).toBe(1);
    expect(zeichenabstandFaktor(6)).toBe(1);
    expect(zeichenabstandFaktor(-2)).toBe(1);
  });
});

describe("2 · Die Renderung: EIN Mechanismus in TypingSession/PromptText", () => {
  /** Minimaler Aufbau, wie `tests/tastenflow-anschlaege-zeilenwechsel.test.tsx` ihn benutzt. */
  function bau(zeichenabstand?: 1 | 2 | 3 | 4 | 5) {
    return render(
      <TypingSession
        items={["ab"]}
        contextId="test"
        unlocked={new Set(["a", "b"])}
        shiftLearned={false}
        stufe="kids"
        voiceEnabled={false}
        onRetry={vi.fn()}
        zeichenabstand={zeichenabstand}
      />,
    );
  }

  it("„aus“ (kein Wert, Standard): weder Klasse noch Variable", () => {
    const { container } = bau();
    const spur = container.querySelector('[data-angabe]');
    expect(spur, "die Übungszeile muss stehen").toBeTruthy();
    expect(spur!.querySelector(".tt-laufweite")).toBeNull();
  });

  it("„aus“ (ausdrücklich 1): dieselbe Gegenprobe", () => {
    const { container } = bau(1);
    expect(container.querySelector('[data-angabe] .tt-laufweite')).toBeNull();
  });

  it.each([2, 3, 4] as const)(
    "Faktor %i: die Zeichen-Zeile trägt die Klasse und die Variable",
    (faktor) => {
      const { container } = bau(faktor);
      const zeile = container.querySelector('[data-angabe] .tt-laufweite') as HTMLElement | null;
      expect(zeile, `bei Faktor ${faktor} muss die Klasse stehen`).toBeTruthy();
      expect(zeile!.style.getPropertyValue("--tt-laufweite")).toBe(String(faktor));
    },
  );

  it("das unsichtbare Eingabefeld bekommt dieselbe Zusatzstrecke wie die Zeile - sonst liegt der Cursor daneben", () => {
    // ★★★★★ Genau die Falle vom 09.09.2026 (Balken/Kontrastmodus): zwei
    // Darstellungen derselben Zeile, die auseinanderlaufen können. Hier
    // müssen die Übungszeile (`gap`) und das unsichtbare Feld
    // (`letterSpacing`) densel­ben Zusatzbetrag tragen.
    bau(3);
    const feld = screen.getByRole("textbox") as HTMLTextAreaElement;
    // (Faktor - 1) * 0.75ch für Faktor 3 (seit 19.09.2026 um 25 % kleiner).
    expect(feld.style.letterSpacing).toContain("(3 - 1) * 0.75ch");
  });

  it("bei „aus“ bleibt das Eingabefeld bei der ursprünglichen Laufweite (0,145em)", () => {
    bau(1);
    const feld = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(feld.style.letterSpacing).toContain("0.145em");
    expect(feld.style.letterSpacing).toContain("(1 - 1) * 0.75ch");
  });

  it("★ 19.09.2026: Zeile (CSS) und Eingabefeld (Konstante) tragen DENSELBEN Schritt - 0,75 Zeichenbreiten", () => {
    // Johannes: „mach die Abstände alle um 25 % kleiner". CSS kann die
    // Konstante nicht lesen - darum vergleicht dieser Wächter die Zahl im
    // Stylesheet mit `LAUFWEITE_CH_JE_STUFE`, die das Eingabefeld benutzt.
    expect(LAUFWEITE_CH_JE_STUFE).toBe(0.75);
    const css = readFileSync(resolve(__dirname, "../src/index.css"), "utf8");
    const regel = /\.tt-laufweite\s*\{\s*gap:\s*calc\(\(var\(--tt-laufweite, 1\) - 1\) \* ([0-9.]+)ch\);/.exec(css);
    expect(regel, "die Regel .tt-laufweite im Stylesheet").toBeTruthy();
    expect(Number(regel![1])).toBe(LAUFWEITE_CH_JE_STUFE);
  });

  it("★★★★★ Stufe 5 „einfach“ (22.09.2026): die Zeichen-Zeile bleibt wie „aus“", () => {
    // Johannes, wörtlich: „mach noch eine einstellung bei der die Laufweite
    // gar nicht vergrößert wird aber alles andere: verdunkelung und
    // zeilenschaltung trotzdem bleibt“. Die Zeichen-Zusatzstrecke (Klasse +
    // Variable) darf bei Stufe 5 nicht entstehen - genau wie bei „aus“.
    const { container } = bau(5);
    expect(container.querySelector('[data-angabe] .tt-laufweite')).toBeNull();
    const feld = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(feld.style.letterSpacing).toContain("0.145em");
    expect(feld.style.letterSpacing).toContain("(1 - 1) * 0.75ch");
  });
});

describe("3 · Der Server-Wächter: additiv, und jedes Kind setzt es selbst", () => {
  it("das Feld steht in setup.mjs, additiv (Zahl)", () => {
    expect(lies("pocketbase/setup.mjs")).toContain('N("zeichenabstand")');
  });

  it("★ 19.09.2026: „zeichenabstand“ steht NICHT mehr in der LOCKED-Liste", () => {
    // Bis 19.09.2026 stand hier das Gegenteil („die LOCKED-Liste kennt
    // zeichenabstand"). Johannes: „die CVI-Einstellungen kann sich jedes Kind
    // immer auch selbst in den Einstellungen einstellen". Stünde das Feld in
    // der Liste, setzte der Wächter es bei JEDEM Selbst-Update zurück - so
    // lief bis dahin sogar die Ausnahme für Selbstlernende ins Leere.
    const waechter = lies("pocketbase/pb_hooks/tt_pupils_field_guard.pb.js");
    const locked = waechter.slice(
      waechter.indexOf("const LOCKED = ["),
      waechter.indexOf("];"),
    );
    expect(locked.length, "Gegenprobe: die LOCKED-Liste wurde gefunden").toBeGreaterThan(100);
    expect(locked).not.toMatch(/^\s*"zeichenabstand",/m);
  });

  it("★ keine Sperre mehr für Kinder einer Klasse - nur der Wert wird geprüft (1-5)", () => {
    const waechter = lies("pocketbase/pb_hooks/tt_pupils_field_guard.pb.js");
    expect(waechter).not.toMatch(
      /if \(!stored\.get\("selfManaged"\)\) \{\s*\n\s*e\.record\.set\("zeichenabstand"/,
    );
    expect(waechter).toMatch(/za !== 1 && za !== 2 && za !== 3 && za !== 4 && za !== 5/);
  });
});

describe("4 · Jede Person stellt es im Zahnrad selbst ein", () => {
  it("steht als Auswahlfeld da, sobald die Seite den Rückruf reicht (seit 19.09.2026 für jede Person)", () => {
    render(
      <TypingSettings lernweg="de"
        stufe={"kids" as never}
        lang="de"
        onLangChange={() => {}}
        zeichenabstand={2}
        onZeichenabstandChange={() => {}}
      />,
    );
    const feld = screen.getByRole("combobox", {
      name: "Zeichenabstand groß (CVI)",
    }) as HTMLSelectElement;
    expect(feld.value).toBe("2");
  });

  it("wählt „vierfach“ und meldet den Faktor 4 (als Zahl, nicht als Text)", () => {
    const onChange = vi.fn();
    render(
      <TypingSettings lernweg="de"
        stufe={"kids" as never}
        lang="de"
        onLangChange={() => {}}
        zeichenabstand={1}
        onZeichenabstandChange={onChange}
      />,
    );
    const feld = screen.getByRole("combobox", { name: "Zeichenabstand groß (CVI)" });
    fireEvent.change(feld, { target: { value: "4" } });
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("★★★ fehlt der Rückruf (Tests, andere Einbettungen), fehlt die Gruppe - und der alte Satz kommt nirgends mehr", () => {
    // Bis 19.09.2026 stand hier: „fehlt der Rückruf (Kind einer Klasse),
    // steht ein SATZ statt eines Feldes". Seit Johannes' Satz „Kinder dürfen
    // es ändern wie sie möchten" bekommt auch das Kind einer Klasse den
    // Rückruf (Beleg auf der ganzen Seite:
    // `tests/tastenflow-selbst-alles-einstellen.test.tsx`), und der Satz
    // „deine Lehrkraft hat das eingestellt" ist ersatzlos weg - keine
    // Programmleiche.
    render(
      <TypingSettings lernweg="de"
        stufe={"kids" as never}
        lang="de"
        onLangChange={() => {}}
        zeichenabstand={3}
      />,
    );
    expect(
      screen.queryByRole("combobox", { name: "Zeichenabstand groß (CVI)" }),
    ).toBeNull();
    expect(document.body.textContent).not.toMatch(/deine Lehrkraft hat das eingestellt/);
    expect(lies("src/components/typing/TypingSettings.tsx")).not.toMatch(/abstandKlasse(Kopf|Rest)/);
  });
});

/*
 * ════════════════════════════════════════════════════════════════════════════
 * ★ DER ZEILENABSTAND WÄCHST MIT DER LAUFWEITE (20.09.2026)
 * ════════════════════════════════════════════════════════════════════════════
 * Testerin Schüler (CVI) sah die Zeichen weit auseinander, die Zeilen klebten.
 * Johannes: „Je weiter Einzelzeichen auseinander sind, umso größer werden die
 * Zeilenabstände." Der Wächter hält beides fest: dass er mitwächst - und dass
 * bei „aus" nichts angefasst wird.
 */
describe("Zeilenabstand zur Laufweite", () => {
  it("bei „aus“ bleibt alles, wie es war - kein lineHeight", () => {
    expect(laufweiteText(1)).toBeUndefined();
    expect(laufweiteFeld(1)).toBeUndefined();
  });

  it("wächst Stufe für Stufe: doppelt 1,75 · dreifach 2,0 · vierfach 2,25", () => {
    expect(laufweiteZeilenhoehe(2)).toBeCloseTo(1.75, 5);
    expect(laufweiteZeilenhoehe(3)).toBeCloseTo(2.0, 5);
    expect(laufweiteZeilenhoehe(4)).toBeCloseTo(2.25, 5);
  });

  it("ist dieselbe Rechnung wie die Konstanten - keine zweite Zahlenreihe", () => {
    for (const faktor of [2, 3, 4] as const) {
      expect(laufweiteZeilenhoehe(faktor)).toBeCloseTo(
        LAUFWEITE_ZEILENHOEHE_NORMAL +
          (faktor - 1) * LAUFWEITE_ZEILENHOEHE_ZUSCHLAG_JE_STUFE,
        5,
      );
    }
  });

  it("Fliesstext trägt ihn, ein einzeiliges Feld NICHT (es würde nur höher)", () => {
    const text = laufweiteText(3)!;
    const feld = laufweiteFeld(3)!;
    expect(text.lineHeight).toBeCloseTo(2.0, 5);
    expect(feld.lineHeight).toBeUndefined();
    // Die Laufweite selbst ist in beiden dieselbe - sonst sässe der
    // Schreibzeiger neben dem sichtbaren Zeichen.
    expect(feld.letterSpacing).toBe(text.letterSpacing);
  });

  it("★★★★★ Stufe 5 „einfach“ (22.09.2026): kein lineHeight, wie bei „aus“", () => {
    expect(laufweiteText(5)).toBeUndefined();
    expect(laufweiteFeld(5)).toBeUndefined();
    expect(laufweiteZeilenhoehe(5)).toBeCloseTo(LAUFWEITE_ZEILENHOEHE_NORMAL, 5);
  });
});
