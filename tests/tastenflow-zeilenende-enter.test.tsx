/**
 * ★★★★★ WÄCHTER: „ZEILENENDE MIT ENTER" (E4/E5, 23.09.2026).
 *
 * Neue Klassen-Einstellung `TypingClass.zeilenEndeEnter` (siehe `account.ts`):
 * angehakt schliesst jedes Kind der Klasse jede Übungszeile mit der
 * Eingabetaste ab - wie beim Schreiben im Büro (Anlass: eine 3. Klasse HAS).
 *
 * Geprüft wird hier die GLASUR über dem Hook (`useTypingItem`, eigener
 * Wächter `typing-item-zeilenende-enter.test.tsx`):
 *
 *   1. `TypingSession` (Bauteil-Test, `zeilenEnde` direkt als Prop): kein
 *      Zeilenwechsel ohne Enter, Zeilenwechsel MIT Enter; `onItemDone` meldet
 *      `chars = Zeilenlänge + 1`; das „\n" geht NICHT in `onLetters`; der
 *      Feldwert trägt nie ein `\n"; das „↵" steht sichtbar in der Zeile; die
 *      Bildschirm-Tastatur markiert die Eingabetaste als nächste Taste.
 *   2. Gegenprobe: Schalter AUS (wie heute) - Enter bleibt wirkungslos, die
 *      Zeile schliesst nach dem letzten Zeichen.
 *   3. EIN Wächter über die GANZE SEITE (`TippenTrainerPage`) mit einem
 *      Konto, dessen KLASSE `zeilenEndeEnter: true` hat - über den echten
 *      lokalen Weg (`createClass` → `addPupil` → `login`, derselbe, den
 *      `mitKlassenVorrang` in der Praxis nachzieht, siehe
 *      `tastenflow-klassen-vorrang.test.tsx`). Ein Bauteil-Test allein
 *      bewiese nur, dass die PROP funktioniert - nicht, dass sie von der
 *      Klasse bis zur Sitzung auch wirklich ankommt.
 *
 * ⚠️ TÖNE AUS - jsdom hat kein Web-Audio.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/lib/typing/sound", () => ({
  playBadgeSound: vi.fn(),
  playUnlockFanfare: vi.fn(),
  playKeySound: vi.fn(),
  playKeyTick: vi.fn(),
  playErrorSound: vi.fn(),
  playLineSound: vi.fn(),
  playSuccessSound: vi.fn(),
  playStarReward: vi.fn(),
  playStoryBadgeSound: vi.fn(),
}));

// Feste Zeilen für den Seiten-Wächter (3) - derselbe Griff wie in
// `tastenflow-anschlaege-zeilenwechsel.test.tsx`.
vi.mock("@/lib/typing/generator", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing/generator")>();
  return {
    ...echt,
    adaptiveRound: vi.fn(() =>
      ["ab", "cd"].map((text) => ({ text, source: null, art: "woerter" })),
    ),
  };
});

import { TypingSession } from "@/components/typing/TypingSession";
import { TippenTrainerPage } from "@/features/public/TippenTrainerPage";
import { useTypingAuth } from "@/components/typing/useTypingAuth";
import { useTypingA11y } from "@/lib/typing/a11y";
import { addPupil, createClass, registerTeacher } from "@/lib/typing";
import { einrichtungFertigMerken } from "@/lib/typing/einrichtung";
import { tippfeldPflicht, naechsteZeile, zeilenMarke } from "./_typing-probelauf";

afterEach(cleanup);

const warte = (ms: number) => act(() => new Promise<void>((r) => setTimeout(r, ms)));

function tippe(feld: HTMLElement, tasten: string) {
  for (const key of tasten) fireEvent.keyDown(feld, { key });
}

function enter(feld: HTMLElement) {
  fireEvent.keyDown(feld, { key: "Enter" });
}

function session(over: Partial<React.ComponentProps<typeof TypingSession>> = {}) {
  const onItemDone = vi.fn();
  const onLetters = vi.fn();
  const utils = render(
    <TypingSession
      items={["ab", "cd"]}
      contextId="test"
      unlocked={new Set(["a", "b", "c", "d"])}
      shiftLearned={false}
      stufe="kids"
      voiceEnabled={false}
      onRetry={vi.fn()}
      zeilenPauseMs={220}
      onItemDone={onItemDone}
      onLetters={onLetters}
      {...over}
    />,
  );
  const feld = screen.getByRole("textbox") as HTMLTextAreaElement;
  return { ...utils, feld, onItemDone, onLetters };
}

describe("1 · TypingSession mit zeilenEnde=true", () => {
  beforeEach(() => {
    useTypingA11y.getState().setTastaturOffen(true);
  });

  it("kein Zeilenwechsel ohne Enter - der Cursor bleibt am Zeilenende stehen", async () => {
    const { feld, onItemDone } = session({ zeilenEnde: true });
    tippe(feld, "ab");
    await warte(300);
    expect(onItemDone, "die Zeile wurde ohne Enter schon als fertig gemeldet").not.toHaveBeenCalled();
    expect(zeilenMarke()).toBe("zeile-1");
  });

  it("Enter schliesst die Zeile ab und schaltet weiter", async () => {
    const { feld, onItemDone } = session({ zeilenEnde: true });
    tippe(feld, "ab");
    enter(feld);
    await warte(300);
    expect(onItemDone).toHaveBeenCalledTimes(1);
    expect(onItemDone.mock.calls[0][0].errors).toBe(0);
  });

  it("onItemDone meldet chars = Zeilenlänge + 1 (Enter zählt als Anschlag)", async () => {
    const { feld, onItemDone } = session({ zeilenEnde: true, items: ["abc", "de"] });
    tippe(feld, "abc");
    enter(feld);
    await warte(300);
    expect(onItemDone.mock.calls[0][0].chars).toBe(4); // "abc" (3) + Enter (1)
  });

  it(`„\\n" geht NICHT in die Tasten-Statistik (onLetters)`, async () => {
    const { feld, onLetters } = session({ zeilenEnde: true });
    tippe(feld, "ab");
    enter(feld);
    await warte(300);
    const zeichen = onLetters.mock.calls[0][0].map((e: { char: string }) => e.char);
    expect(zeichen).toEqual(["a", "b"]);
    expect(zeichen).not.toContain("\n");
  });

  it(`der Feldwert trägt nie ein "\\n" - auch nicht nach Enter`, async () => {
    const { feld } = session({ zeilenEnde: true, zeilenPraefix: "P1 " });
    tippe(feld, "ab");
    expect(feld.value).not.toContain("\n");
    enter(feld);
    expect(feld.value).not.toContain("\n");
    await warte(300);
    expect(feld.value).not.toContain("\n");
  });

  it(`eine falsche Taste statt Enter ist EIN Fehler an dieser Position - "erst richtig, dann weiter"`, async () => {
    const { feld, onItemDone } = session({ zeilenEnde: true });
    tippe(feld, "ab");
    tippe(feld, "x"); // falsch statt Enter
    expect(zeilenMarke(), "die Zeile darf trotz falscher Taste nicht weiterschalten").toBe("zeile-1");
    enter(feld);
    await warte(300);
    expect(onItemDone).toHaveBeenCalledTimes(1);
    expect(onItemDone.mock.calls[0][0].errors).toBe(1);
  });

  it(`das „↵" steht sichtbar am Zeilenende der Übungszeile`, () => {
    const { container } = session({ zeilenEnde: true });
    const zeile = container.querySelector("[data-angabe]");
    expect(zeile, "die Übungszeile muss stehen").toBeTruthy();
    expect(zeile!.textContent).toContain("↵");
  });

  it(`ohne zeilenEnde (Vorgabe) steht KEIN „↵" in der Zeile`, () => {
    const { container } = session();
    const zeile = container.querySelector("[data-angabe]");
    expect(zeile!.textContent).not.toContain("↵");
  });

  it("die Bildschirm-Tastatur markiert die Eingabetaste als nächste Taste, sobald die Zeile fertig ist", () => {
    const { feld, container } = session({ zeilenEnde: true });
    tippe(feld, "ab");
    // Die Tastatur ist aria-hidden; gesucht wird über den Text „↵" - EINER
    // davon gehört der Übungszeile, der andere der Tastatur (Edge-Taste).
    const alleEnter = [...container.querySelectorAll("*")].filter(
      (el) => el.textContent === "↵" && el.children.length === 0,
    );
    // Übungszeile (span) + Tastatur (ModKey-Innenschrift) - mindestens zwei
    // Fundstellen, eine davon in der Tastatur mit der Hervor-Klasse.
    const tastaturEnter = alleEnter
      .map((el) => el.closest(".tt-taste-ziel"))
      .filter((el): el is Element => !!el);
    expect(tastaturEnter.length, "keine hervorgehobene Enter-Taste gefunden").toBeGreaterThan(0);
  });
});

describe("2 · Gegenprobe: Schalter AUS (Vorgabe) - wie heute", () => {
  it("die Zeile schliesst nach dem letzten Zeichen, Enter bleibt wirkungslos", async () => {
    const { feld, onItemDone } = session();
    tippe(feld, "ab");
    await warte(300);
    expect(onItemDone).toHaveBeenCalledTimes(1);
    expect(onItemDone.mock.calls[0][0].chars).toBe(2);
    enter(feld); // wirkt nicht mehr auf die (schon fertige) erste Zeile
    await warte(50);
    expect(onItemDone).toHaveBeenCalledTimes(1);
  });

  it(`kein „↵" in der Zeile, wenn zeilenEnde explizit false ist`, () => {
    const { container } = session({ zeilenEnde: false });
    expect(container.querySelector("[data-angabe]")!.textContent).not.toContain("↵");
  });
});

describe("3 · Der Seiten-Wächter: eine echte Klasse mit zeilenEndeEnter: true", () => {
  beforeEach(() => {
    localStorage.clear();
    einrichtungFertigMerken();
    useTypingA11y.getState().setTastaturOffen(false); // Tempo (siehe _typing-probelauf.ts)
    useTypingAuth.setState({ account: null });
  });

  /** Ein Kind einer ECHTEN (lokalen) Klasse mit `zeilenEndeEnter: true`. */
  function kindMitZeilenEndeEnter() {
    const t = registerTeacher("L", `l${Math.random()}@s.at`, "geheim1");
    if (!t.ok) throw new Error("Lehrkraft");
    const cls = createClass(t.value.id, "HAS-3", "HAS3", { zeilenEndeEnter: true });
    if (!cls.ok) throw new Error("Klasse");
    expect(cls.value.zeilenEndeEnter, "die Klasse muss die Einstellung tragen").toBe(true);
    const p = addPupil(cls.value.code, "Nina", "1234", "b");
    if (!p.ok) throw new Error("Kind");
    return p.value;
  }

  it("Enter fehlt ⇒ die Zeile schaltet nicht weiter; Enter kommt ⇒ sie schaltet weiter", async () => {
    const kind = kindMitZeilenEndeEnter();
    // ★ `login` (nicht `setState`) - nur so holt `useTypingAuth` die Klasse
    // wirklich vom (lokalen) Backend und wendet `zeilenEndeEnter` über
    // `mitKlassenVorrang` aufs Konto an (siehe `tastenflow-klassen-vorrang.test.tsx`).
    useTypingAuth.getState().login(kind);
    await vi.waitFor(() => {
      expect(useTypingAuth.getState().account?.zeilenEndeEnter).toBe(true);
    });

    render(
      <MemoryRouter>
        <TippenTrainerPage />
      </MemoryRouter>,
    );
    const feld = await screen.findByRole("textbox", undefined, { timeout: 10_000 });
    const marke = zeilenMarke();
    const zeile = (feld as HTMLTextAreaElement).value;
    expect(zeile.length).toBeGreaterThan(0);
    expect(zeile).not.toContain("\n");

    for (const ch of zeile) fireEvent.keyDown(feld, { key: ch });
    await warte(300);
    // Ohne Enter bleibt die Zeile stehen - kein `naechsteZeile` in dieser Zeit.
    expect(zeilenMarke(), "die Zeile schaltete OHNE Enter weiter").toBe(marke);
    expect((tippfeldPflicht().value)).not.toContain("\n");

    fireEvent.keyDown(feld, { key: "Enter" });
    expect(await naechsteZeile(marke), "die Runde ging nach Enter nicht weiter").toBe(true);
  }, 20_000);
});
