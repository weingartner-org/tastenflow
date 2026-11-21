/**
 * WÄCHTER: beim Schreiben nur die Übungszeile hell - ein Teil von
 * „Zeichenabstand groß (CVI)" (L7, 19.09.2026).
 * ===========================================================================
 * Johannes, 19.09.2026, wörtlich: *„wir brauchen für die CVI-Einstellung noch
 * ein weiteres Feature: beim Schreiben soll nur das Eingabefeld hell erleuchtet
 * sein, alles andere soll verdunkeln (so wie beim Einführungsbildschirm bei
 * ‚Mit anderen Augen sehen'), nach 5 Sek. nicht tippen wird wieder alles
 * hell"*.
 *
 * Das Bauteil: `src/components/typing/CviAbdunkeln.tsx`, eingehängt in
 * `TypingSession` (damit in JEDER Übungsart). Die Erklärung steht in den
 * Hinweisen der CVI-Einstellung (Zahnrad, Lehrkraft-Zeile) und in der Hilfe.
 *
 * ⚠️ jsdom rechnet kein Layout: Ohne Fläche gäbe es nichts abzudunkeln (das
 * Bauteil zeichnet dann nichts - richtig so). Die Übungskarte bekommt darum
 * hier eine gemessene Fläche vorgetäuscht; alles andere bleibt bei Null.
 *
 * ★★★ WOHIN SICH DIESER WÄCHTER BEWEGT, WENN ES SCHLECHTER WIRD:
 *  · Es dunkelt ohne CVI ab (Faktor 1) - rot.
 *  · Es bleibt dunkel, obwohl 5 Sekunden nicht getippt wurde - rot.
 *  · Es wird hell, obwohl weitergetippt wird - rot.
 *  · Es dunkelt unter einem Fenster oder im Rundgang ab - rot.
 *  · Es nimmt den Fokus, fängt eine Taste ab oder spricht - rot.
 *  · Ein deutsches Wort in der englischen Erklärung - rot (mit Gegenprobe).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useState, type ReactNode } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";

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
import { TippenHilfe } from "@/components/typing/TippenHilfe";
import { TastenflowReiter } from "@/components/lernwerkstatt/klasse/TastenflowReiter";
import { Modal } from "@/components/Modal";
import { CVI_HELL_NACH_MS } from "@/components/typing/CviAbdunkeln";
import { addPupil, createClass, listPupils, registerTeacher } from "@/lib/typing/account";
import { BedienSpracheProvider, type BedienSprache } from "@/lib/bedienSprache";
import { findeDeutsch, pruefeText } from "./helfer/deutschFaenger";

const SATZ_DE =
  "Beim Schreiben wird alles außer dem Feld abgedunkelt, in dem gerade geschrieben wird (Übungszeile oder Spielfeld); nach 5 Sekunden ohne Tippen wird es wieder hell.";

/** Die Übungskarte bekommt eine Fläche - jsdom misst sonst überall Null. */
function karteHatFlaeche() {
  const echt = HTMLElement.prototype.getBoundingClientRect;
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.getAttribute("data-rundgang") === "uebungszeile")
      return { x: 40, y: 120, width: 700, height: 130, top: 120, left: 40, right: 740, bottom: 250, toJSON() {} } as DOMRect;
    return echt.call(this);
  });
}

function bau(zeichenabstand?: 1 | 2 | 3 | 4, extra?: ReactNode) {
  return render(
    <>
      <TypingSession
        items={["abab abab"]}
        contextId="cvi-test"
        unlocked={new Set(["a", "b", " "])}
        shiftLearned={false}
        stufe="kids"
        voiceEnabled={false}
        onRetry={vi.fn()}
        zeichenabstand={zeichenabstand}
      />
      {extra}
    </>,
  );
}

const feld = () => screen.getByRole("textbox") as HTMLTextAreaElement;
const schicht = () => document.querySelector<HTMLElement>("[data-cvi-abdunkeln]");
const istDunkel = () => schicht()?.getAttribute("data-cvi-abdunkeln") === "an";

function tippe(taste: string, ziel: Element = feld()) {
  act(() => {
    fireEvent.keyDown(ziel, { key: taste });
  });
}

function stelleBedienung(sprache: BedienSprache | null) {
  if (sprache) {
    localStorage.setItem("tastenflow-bedienung", sprache);
  } else {
    localStorage.removeItem("tastenflow-bedienung");
  }
}

beforeEach(() => {
  localStorage.clear();
  karteHatFlaeche();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Wann es dunkel wird
// ---------------------------------------------------------------------------

describe("Abdunkeln beim Schreiben", () => {
  it("★★★★★ nur mit CVI (Faktor über 1) - ohne CVI geschieht beim Tippen gar nichts", () => {
    bau(1);
    act(() => feld().focus());
    tippe("a");
    tippe("b");
    expect(schicht()).toBeNull();
    cleanup();

    bau(); // kein Wert = aus
    tippe("a");
    expect(schicht()).toBeNull();
  });

  it.each([2, 3, 4] as const)("Faktor %i: der erste Anschlag in der Zeile dunkelt ab", (faktor) => {
    bau(faktor);
    expect(schicht()).toBeNull(); // vor dem ersten Anschlag: nichts
    tippe("a");
    expect(istDunkel()).toBe(true);
    // Die helle Fläche ist die Übungskarte - mit 6 px Luft für ihren Fokusring.
    const s = schicht()!;
    expect(s.style.left).toBe("34px");
    expect(s.style.top).toBe("114px");
    expect(s.style.width).toBe("712px");
    expect(s.style.opacity).toBe("1");
  });

  it("★★★★★ rein sichtbar: aria-hidden, keine Zeigereingaben, kein title, kein Live-Bereich - und der Fokus bleibt im Feld", () => {
    bau(3);
    act(() => feld().focus());
    tippe("a");
    const s = schicht()!;
    expect(s.getAttribute("aria-hidden")).toBe("true");
    expect(s.className).toContain("pointer-events-none");
    expect(s.hasAttribute("title")).toBe(false);
    expect(s.querySelector("[title], [aria-live], [role]")).toBeNull();
    expect(s.hasAttribute("aria-live")).toBe(false);
    expect(s.hasAttribute("tabindex")).toBe(false);
    expect(document.activeElement).toBe(feld());
  });

  it("★★★★★ fängt nichts ab: der Anschlag kommt bei der Seite an, als gäbe es das Abdunkeln nicht", () => {
    bau(3);
    const seite = vi.fn();
    document.addEventListener("keydown", seite);
    act(() => feld().focus());
    const vorher = feld().selectionStart ?? 0;
    tippe("a");
    document.removeEventListener("keydown", seite);
    expect(seite).toHaveBeenCalledTimes(1);
    expect(istDunkel()).toBe(true);
    // Der Anschlag wurde als Üben angenommen: Der Schreibzeiger steht ein
    // Zeichen weiter (das Übungsfeld hat ihn bekommen, nicht verloren).
    expect(feld().selectionStart ?? 0).toBe(vorher + 1);
  });

  it("Kürzel (Alt, Strg), Tab und Escape zählen nicht als Schreiben; Tasten ausserhalb der Karte auch nicht", () => {
    render(<button type="button">Anderswo</button>);
    bau(3);
    act(() => {
      fireEvent.keyDown(feld(), { key: "h", altKey: true });
      fireEvent.keyDown(feld(), { key: "c", ctrlKey: true });
      fireEvent.keyDown(feld(), { key: "Tab" });
      fireEvent.keyDown(feld(), { key: "Escape" });
      fireEvent.keyDown(screen.getByRole("button", { name: "Anderswo" }), { key: "a" });
    });
    expect(istDunkel()).toBe(false);
    tippe("Backspace");
    expect(istDunkel()).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Wann es wieder hell wird
// ---------------------------------------------------------------------------

describe("Wieder hell", () => {
  it("★★★★★ nach 5 Sekunden ohne Anschlag - und solange getippt wird, bleibt es dunkel", () => {
    vi.useFakeTimers();
    bau(2);
    tippe("a");
    expect(istDunkel()).toBe(true);
    act(() => void vi.advanceTimersByTime(4000));
    expect(istDunkel()).toBe(true);
    tippe("b"); // die Uhr beginnt neu
    act(() => void vi.advanceTimersByTime(4000));
    expect(istDunkel()).toBe(true); // 8 s nach dem ersten, 4 s nach dem letzten Anschlag
    act(() => void vi.advanceTimersByTime(CVI_HELL_NACH_MS - 4000 + 1));
    expect(istDunkel()).toBe(false);
    expect(schicht()?.style.opacity).toBe("0");
    // Wieder tippen - wieder dunkel.
    tippe("a");
    expect(istDunkel()).toBe(true);
  });

  it("die Frist ist genau 5 Sekunden", () => {
    expect(CVI_HELL_NACH_MS).toBe(5000);
  });
});

// ---------------------------------------------------------------------------
// Vorrang: Fenster und Rundgang
// ---------------------------------------------------------------------------

describe("Ein Fenster oder der Rundgang hat Vorrang", () => {
  let oeffne: (auf: boolean) => void = () => {};
  function Fenster() {
    const [auf, setAuf] = useState(false);
    oeffne = setAuf;
    return auf ? (
      <Modal title="Hilfe" onClose={() => setAuf(false)}>
        <p>Text</p>
      </Modal>
    ) : null;
  }

  it("★★★★ geht ein Fenster auf, wird es SOFORT hell - und unter einem Fenster dunkelt kein Anschlag ab", async () => {
    bau(3, <Fenster />);
    tippe("a");
    expect(istDunkel()).toBe(true);
    await act(async () => {
      oeffne(true);
      await Promise.resolve();
    });
    expect(istDunkel()).toBe(false);
    // Ohne Übergang (sofort, nicht sanft).
    expect(schicht()!.className).not.toContain("transition-opacity");

    // Solange das Fenster offen ist: kein Abdunkeln.
    tippe("a");
    expect(istDunkel()).toBe(false);

    await act(async () => {
      oeffne(false);
      await Promise.resolve();
    });
    tippe("b");
    expect(istDunkel()).toBe(true);
  });

  it("während des Rundgangs (Z4) nicht", () => {
    const rundgang = document.createElement("div");
    rundgang.setAttribute("data-einfuehrung", "");
    document.body.appendChild(rundgang);
    try {
      bau(3);
      tippe("a");
      expect(istDunkel()).toBe(false);
    } finally {
      rundgang.remove();
    }
  });
});

// ---------------------------------------------------------------------------
// Die Erklärung - dort, wo die CVI-Einstellung erklärt wird
// ---------------------------------------------------------------------------

describe("Die Erklärung", () => {
  function zahnrad() {
    return render(
      <BedienSpracheProvider>
        <TypingSettings lernweg="de"
          stufe={"kids" as never}
          lang="de"
          onLangChange={() => {}}
          zeichenabstand={2}
          onZeichenabstandChange={() => {}}
        />
      </BedienSpracheProvider>,
    );
  }

  it("★★★ Zahnrad: der Hinweis der CVI-Auswahl nennt das Abdunkeln - englisch ohne deutsches Wort, Gegenprobe deutsch", () => {
    zahnrad();
    const de = screen.getByRole("combobox", { name: "Zeichenabstand groß (CVI)" });
    const hinweisDe = document.getElementById(de.getAttribute("aria-describedby")!)!;
    expect(hinweisDe.textContent).toContain(SATZ_DE);
    expect(findeDeutsch(hinweisDe).length).toBeGreaterThan(0);
    cleanup();

    stelleBedienung("en");
    zahnrad();
    const en = screen.getByRole("combobox", { name: "Wide letter spacing (CVI)" });
    const hinweisEn = document.getElementById(en.getAttribute("aria-describedby")!)!;
    expect(hinweisEn.textContent).toContain(
      "While you type, everything except the field you are typing in (the practice line or the game area) is dimmed; after 5 seconds without typing it turns bright again.",
    );
    expect(findeDeutsch(hinweisEn)).toEqual([]);
  });

  it("★★★ Hilfe (Alt + H): ein Satz, deutsch und englisch", () => {
    render(
      <BedienSpracheProvider>
        <TippenHilfe open onClose={() => {}} stufe="kids" />
      </BedienSpracheProvider>,
    );
    const dlg = screen.getByRole("dialog");
    expect(dlg.textContent).toContain("wird beim Schreiben alles außer dem Feld abgedunkelt, in dem gerade geschrieben wird");
    cleanup();

    stelleBedienung("en");
    render(
      <BedienSpracheProvider>
        <TippenHilfe open onClose={() => {}} stufe="kids" />
      </BedienSpracheProvider>,
    );
    const absatz = Array.from(screen.getByRole("dialog").querySelectorAll("p")).find((p) =>
      p.textContent?.includes("is dimmed while you type"),
    );
    expect(absatz, "der englische Satz steht in der Hilfe").toBeTruthy();
    expect(findeDeutsch(absatz!)).toEqual([]);
    expect(absatz!.textContent).not.toMatch(/\b(click|hover|mouse|scroll)/i);
  });

  it("★★★ Lehrkraft: der Hinweis an der CVI-Auswahl des Kindes (deutsch gerendert, englisch aus der Tabelle)", async () => {
    const t = registerTeacher("Frau Berger", "berger-cvi@example.org", "geheim123");
    if (!t.ok) throw new Error(t.error);
    const c = createClass(t.value.id, "3b", "3B");
    if (!c.ok) throw new Error(c.error);
    const p = addPupil(c.value.code, "Mia", "pw1234");
    if (!p.ok) throw new Error(p.error);
    render(<TastenflowReiter pupils={listPupils(c.value.code)} onChanged={() => {}} />);
    await screen.findByRole("table", { name: /Lernende der Klasse/ });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Einstellungen und Auswertung von Mia/i }));
    });
    fireEvent.click(screen.getByText(/^Einstellungen für Mia\b/));
    const auswahl = screen.getByRole("combobox", { name: "Zeichenabstand groß (CVI) für Mia" });
    const beschreibung = (auswahl.getAttribute("aria-describedby") ?? "")
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.textContent ?? "")
      .join(" ");
    expect(beschreibung).toContain(SATZ_DE);

    // Die englische Zeile derselben Tabelle (REITER_TEXTE, `en`).
    const quelle = readFileSync(
      resolve(__dirname, "../src/components/lernwerkstatt/klasse/TastenflowReiter.tsx"),
      "utf8",
    );
    const en = quelle.match(/"More space between EVERY character[^"]*"/)?.[0] ?? "";
    expect(en).toContain(
      "While the pupil types, everything except the field they are typing in (the practice line or the game area) is dimmed; after 5 seconds without typing it turns bright again.",
    );
    expect(pruefeText("REITER_TEXTE.en.abstandTipp", en)).toBeNull();
    // Gegenprobe: die deutsche Zeile findet der Fänger.
    expect(pruefeText("REITER_TEXTE.de.abstandTipp", SATZ_DE)).not.toBeNull();
  });

  it("Hausregeln in allen vier Sätzen: nur Bindestrich, keine Maus-Wörter", () => {
    const saetze = [
      SATZ_DE,
      "While you type, everything except the field you are typing in (the practice line or the game area) is dimmed; after 5 seconds without typing it turns bright again.",
      "While the pupil types, everything except the field they are typing in (the practice line or the game area) is dimmed; after 5 seconds without typing it turns bright again.",
    ];
    for (const s of saetze) {
      expect(s).not.toMatch(/[–—]/);
      expect(s).not.toMatch(/klick|Maus|click|mouse|hover/i);
    }
  });
});

// ---------------------------------------------------------------------------
// Der Aufbau im Quelltext: in TypingSession, für jede Übungsart
// ---------------------------------------------------------------------------

describe("Wo es hängt", () => {
  it("in TypingSession - damit gilt es in Mein Training, Geschichten, Tippchallenge, Klassenmatch und Eigener Übung", () => {
    const quelle = readFileSync(resolve(__dirname, "../src/components/typing/TypingSession.tsx"), "utf8");
    expect(quelle).toMatch(/<CviAbdunkeln aktiv=\{zeichenabstand > 1\} zielRef=\{karteRef\} \/>/);
    // Und diese Läufe reichen den Zeichenabstand an TypingSession weiter.
    for (const datei of ["SchreibprobeLauf", "KlassenmatchLauf", "EigeneUebungLauf", "AdaptiveTrainer", "SerienTrainer"]) {
      const lauf = readFileSync(resolve(__dirname, `../src/components/typing/${datei}.tsx`), "utf8");
      expect(lauf, datei).toMatch(/zeichenabstand=\{/);
    }
  });

  it("das Bauteil fängt nichts ab und spricht nicht", () => {
    const quelle = readFileSync(resolve(__dirname, "../src/components/typing/CviAbdunkeln.tsx"), "utf8");
    const code = quelle.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    expect(code).not.toMatch(/preventDefault|stopPropagation|stopImmediatePropagation/);
    expect(code).not.toMatch(/speakUi|sprich|aria-live|\.focus\(/);
  });
});
