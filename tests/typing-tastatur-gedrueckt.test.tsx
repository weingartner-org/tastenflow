/**
 * Die Bildschirm-Tastatur markiert die Taste, die GERADE GEDRÜCKT wurde
 * (Wunsch Johannes 12.09.2026, für „Tasten erkunden").
 *
 * ★★★ Markiert wird die PHYSISCHE Taste über `KeyboardEvent.code`, nie über
 * `key`: Auf QWERTZ heißt die Taste mit dem Aufdruck „Z" `KeyY`, und am Mac
 * ergibt Option + L ein „@", obwohl L gedrückt ist.
 *
 * Die ERWARTUNGEN hier sind bewusst NICHT aus `layouts.ts` oder aus der
 * Tabelle in `Keyboard.tsx` abgeleitet, sondern stehen als Aufdruck da, so wie
 * er auf der echten Tastatur steht. Ein Wächter, der seine Erwartung aus dem
 * Prüfstück rechnet, bestätigt nur sich selbst.
 *
 * Geprüft wird:
 *  A) jede Zeichentaste aller vier Layouts trifft den richtigen Aufdruck, und
 *     wo ANSI (USA) eine Taste nicht hat, wird NICHTS markiert;
 *  B) Randtasten (Umschalt links/rechts getrennt, zweiteiliger ISO-Enter) und
 *     die Leertastenreihe;
 *  C) Gegenprobe: jede Taste wird von GENAU EINEM Code erreicht, und jeder Code
 *     markiert höchstens EINE Taste;
 *  D) ohne `gedrueckt` (oder mit einer Taste, die die Zeichnung nicht hat)
 *     ändert sich an der Tastatur kein Zeichen;
 *  E) `KeyboardPanel` reicht `gedrueckt` durch, und `immerOffen` zeigt die
 *     Tastatur, ohne den gemerkten Zustand anzufassen.
 */
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";

import { Keyboard, type GedrueckteTaste } from "../src/components/typing/Keyboard";
import { KeyboardPanel } from "../src/components/typing/KeyboardPanel";
import { useTypingA11y } from "../src/lib/typing";
import { layoutById, setLayout, type LayoutId } from "../src/lib/typing/layouts";

afterEach(() => {
  cleanup();
  setLayout("de");
});

const druck = (code: string, key = ""): GedrueckteTaste => ({ code, key });

function zeichne(
  id: LayoutId,
  gedrueckt?: GedrueckteTaste,
  { farben = false, nextChar }: { farben?: boolean; nextChar?: string } = {},
) {
  // Die Fingerfarben fragen das AKTIVE Layout - darum auch hier umstellen.
  setLayout(id);
  const { container } = render(
    <Keyboard
      layout={layoutById(id)}
      nextChar={nextChar}
      unlocked={new Set()}
      showFingerColors={farben}
      gedrueckt={gedrueckt}
    />,
  );
  // Aufbau: äußerer Kasten > Spalte > 4 Tastenreihen + Leertastenreihe.
  const reihen = [...container.firstElementChild!.firstElementChild!.children] as HTMLElement[];
  const an = [...container.querySelectorAll<HTMLElement>('[data-gedrueckt="an"]')];
  const alle = [...container.querySelectorAll<HTMLElement>("[data-gedrueckt]")];
  return { container, reihen, an, alle };
}

// --- A) Die Zeichentasten ----------------------------------------------------
// Reihenfolge der Codes: Zahlenreihe, obere Reihe, dann `Backslash` (ANSI über
// dem Enter, ISO links neben dem Enter), Grundreihe, untere Reihe.
const ZEICHEN_CODES = [
  "Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7",
  "Digit8", "Digit9", "Digit0", "Minus", "Equal",
  "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP",
  "BracketLeft", "BracketRight",
  "Backslash",
  "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote",
  "IntlBackslash", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash",
] as const;

// ★ E3 (25.09.2026): dieser Prüfstück-Wächter bleibt bei den VIER Tastaturen,
// die es vor dem französischen Lehrgang schon gab (die Aufdrucke sind
// handgeschrieben, siehe Dateikopf) - darum ein eigener, ENGERER Typ statt
// `Record<LayoutId, …>`, sonst verlangte TypeScript hier Aufdrucke für die
// fünf neuen (unsichtbaren) Tastaturen, die dieser Test nicht prüft.
type BisherigesLayout = "de" | "ch" | "us" | "uk";

/** Der Aufdruck je Code, wie er auf der echten Tastatur steht. `KEINE` = Taste fehlt. */
const AUFDRUCK: Record<BisherigesLayout, string> = {
  de: "^ 1 2 3 4 5 6 7 8 9 0 ß ´ Q W E R T Z U I O P Ü + # A S D F G H J K L Ö Ä < Y X C V B N M , . -",
  ch: "§ 1 2 3 4 5 6 7 8 9 0 ' ^ Q W E R T Z U I O P Ü ¨ $ A S D F G H J K L Ö Ä < Y X C V B N M , . -",
  us: "` 1 2 3 4 5 6 7 8 9 0 - = Q W E R T Y U I O P [ ] \\ A S D F G H J K L ; ' KEINE Z X C V B N M , . /",
  uk: "` 1 2 3 4 5 6 7 8 9 0 - = Q W E R T Y U I O P [ ] # A S D F G H J K L ; ' \\ Z X C V B N M , . /",
};

const ISO: Record<BisherigesLayout, boolean> = { de: true, ch: true, us: false, uk: true };
const LAYOUTS: BisherigesLayout[] = ["de", "ch", "us", "uk"];

describe("A · Zeichentasten - markiert wird die physische Taste", () => {
  for (const id of LAYOUTS) {
    it(`${id}: jeder Code trifft den Aufdruck der echten Tastatur`, () => {
      const aufdruck = AUFDRUCK[id].split(" ");
      expect(aufdruck).toHaveLength(ZEICHEN_CODES.length);
      ZEICHEN_CODES.forEach((code, i) => {
        const { an } = zeichne(id, druck(code));
        if (aufdruck[i] === "KEINE") {
          expect(an, `${id} ${code} darf nichts markieren`).toHaveLength(0);
        } else {
          expect(an, `${id} ${code}`).toHaveLength(1);
          expect(an[0].textContent, `${id} ${code}`).toBe(aufdruck[i]);
        }
        cleanup();
      });
    });
  }

  for (const id of ["de", "us"] as const) {
    for (const farben of [false, true]) {
      const wie = farben ? "mit Fingerfarben" : "ohne Fingerfarben";
      it(`${id} ${wie}: KeyA → A, Digit8 → 8`, () => {
        expect(zeichne(id, druck("KeyA", "a"), { farben }).an.map((e) => e.textContent)).toEqual(["A"]);
        cleanup();
        expect(zeichne(id, druck("Digit8", "8"), { farben }).an.map((e) => e.textContent)).toEqual(["8"]);
      });
    }
  }

  it("de: KeyY markiert die Taste mit dem Aufdruck „Z\" (QWERTZ), KeyZ das „Y\"", () => {
    expect(zeichne("de", druck("KeyY", "z")).an.map((e) => e.textContent)).toEqual(["Z"]);
    cleanup();
    expect(zeichne("de", druck("KeyZ", "y")).an.map((e) => e.textContent)).toEqual(["Y"]);
  });

  it("us: KeyY markiert „Y\", KeyZ „Z\"", () => {
    expect(zeichne("us", druck("KeyY", "y")).an.map((e) => e.textContent)).toEqual(["Y"]);
    cleanup();
    expect(zeichne("us", druck("KeyZ", "z")).an.map((e) => e.textContent)).toEqual(["Z"]);
  });

  it("markiert über code, nicht über key: Option + L am Mac („@\") markiert L", () => {
    expect(zeichne("de", druck("KeyL", "@")).an.map((e) => e.textContent)).toEqual(["L"]);
  });

  it("Backslash liegt bei ANSI in der oberen Reihe, bei ISO in der Grundreihe", () => {
    const us = zeichne("us", druck("Backslash", "\\"));
    expect(us.an[0].parentElement).toBe(us.reihen[1]);
    cleanup();
    const de = zeichne("de", druck("Backslash", "#"));
    expect(de.an[0].parentElement).toBe(de.reihen[2]);
  });

  it("ohne code (manche Hilfstastaturen) hilft das Zeichen - aber nie bei einer Seite", () => {
    expect(zeichne("de", druck("", "ö")).an.map((e) => e.textContent)).toEqual(["Ö"]);
    cleanup();
    expect(zeichne("de", druck("Unidentified", "?")).an.map((e) => e.textContent)).toEqual(["ß"]);
    cleanup();
    expect(zeichne("de", druck("", " ")).an.map((e) => e.textContent)).toEqual(["Leertaste"]);
    cleanup();
    // „Shift" ohne code: links oder rechts? Nicht zu wissen - also nichts.
    expect(zeichne("de", druck("", "Shift")).alle).toHaveLength(0);
  });
});

// --- B) Randtasten und Leertastenreihe ---------------------------------------
describe("B · Randtasten und Leertastenreihe", () => {
  for (const id of ["de", "us"] as const) {
    for (const farben of [false, true]) {
      const wie = farben ? "mit Fingerfarben" : "ohne Fingerfarben";

      it(`${id} ${wie}: ShiftRight markiert die RECHTE Umschalttaste, nicht die linke`, () => {
        const { an, reihen } = zeichne(id, druck("ShiftRight", "Shift"), { farben });
        expect(an).toHaveLength(1);
        expect(an[0]).toBe(reihen[3].lastElementChild);
        expect(an[0].textContent).toBe("⇧");
        expect(reihen[3].firstElementChild!.hasAttribute("data-gedrueckt")).toBe(false);
        cleanup();
        const links = zeichne(id, druck("ShiftLeft", "Shift"), { farben });
        expect(links.an).toEqual([links.reihen[3].firstElementChild]);
      });

      it(`${id} ${wie}: AltRight markiert die dritte Taste der Leertastenreihe`, () => {
        const { an, reihen } = zeichne(id, druck("AltRight", "AltGraph"), { farben });
        expect(an).toHaveLength(1);
        // Kinder der Leertastenreihe: Strg · Alt · Leertaste · AltGr · Strg
        expect(an[0]).toBe(reihen[4].children[3]);
        expect(an[0].textContent).toBe(id === "de" ? "AltGr" : "Alt");
      });

      it(`${id} ${wie}: Space markiert die Leertaste`, () => {
        const { an, reihen } = zeichne(id, druck("Space", " "), { farben });
        expect(an).toEqual([reihen[4].children[2]]);
        expect(an[0].textContent).toBe("Leertaste");
      });

      it(`${id} ${wie}: ArrowLeft, F5, Delete, Home, NumLock markieren nichts`, () => {
        for (const code of ["ArrowLeft", "F5", "Delete", "Home", "NumLock"]) {
          expect(zeichne(id, druck(code, code), { farben }).alle, code).toHaveLength(0);
          cleanup();
        }
      });
    }
  }

  it("Leertastenreihe: Strg links · Alt/Befehl · AltGr/Befehl rechts · Strg rechts", () => {
    const erwartet: [string, number][] = [
      ["ControlLeft", 0], ["AltLeft", 1], ["MetaLeft", 1],
      ["AltRight", 3], ["MetaRight", 3], ["ControlRight", 4],
    ];
    for (const [code, kind] of erwartet) {
      const { an, reihen } = zeichne("de", druck(code));
      expect(an, code).toEqual([reihen[4].children[kind]]);
      cleanup();
    }
  });

  it("Rücktaste, Tab, Feststelltaste sitzen am richtigen Rand", () => {
    for (const id of LAYOUTS) {
      const ruck = zeichne(id, druck("Backspace"));
      expect(ruck.an, id).toEqual([ruck.reihen[0].lastElementChild]);
      cleanup();
      const tab = zeichne(id, druck("Tab"));
      expect(tab.an, id).toEqual([tab.reihen[1].firstElementChild]);
      cleanup();
      const caps = zeichne(id, druck("CapsLock"));
      expect(caps.an, id).toEqual([caps.reihen[2].firstElementChild]);
      cleanup();
    }
  });

  it("ISO-Enter: BEIDE Teile markiert, oben „an\", unten „unterteil\"; ANSI: ein Teil", () => {
    for (const code of ["Enter", "NumpadEnter"]) {
      const de = zeichne("de", druck(code, "Enter"));
      expect(de.an, code).toEqual([de.reihen[1].lastElementChild]);
      expect(de.an[0].textContent).toBe("↵");
      expect(de.alle, code).toEqual([de.reihen[1].lastElementChild, de.reihen[2].lastElementChild]);
      expect(de.reihen[2].lastElementChild!.getAttribute("data-gedrueckt")).toBe("unterteil");
      cleanup();
      const us = zeichne("us", druck(code, "Enter"));
      expect(us.alle, code).toEqual([us.reihen[2].lastElementChild]);
      expect(us.an[0].textContent).toBe("↵");
      cleanup();
    }
  });
});

// --- C) Gegenprobe: eine Taste, ein Code -------------------------------------
describe("C · Gegenprobe - jede Taste genau einmal erreichbar, nie zwei markiert", () => {
  // Ohne die Doppelgänger MetaLeft/MetaRight/NumpadEnter - die treffen
  // absichtlich dieselbe Taste wie AltLeft/AltRight/Enter (oben geprüft).
  const ALLE_CODES = [
    ...ZEICHEN_CODES,
    "Backspace", "Tab", "CapsLock", "Enter", "ShiftLeft", "ShiftRight",
    "ControlLeft", "AltLeft", "Space", "AltRight", "ControlRight",
  ];

  for (const id of LAYOUTS) {
    it(`${id}: jeder Code markiert höchstens eine Taste, und jede Taste hat genau einen Code`, () => {
      const getroffen = new Map<string, string>();
      let tastenGezeichnet = 0;
      for (const code of ALLE_CODES) {
        const { an, reihen } = zeichne(id, druck(code));
        tastenGezeichnet = reihen.reduce((n, r) => n + r.children.length, 0);
        expect(an.length, `${id} ${code}`).toBeLessThanOrEqual(1);
        if (an.length === 1) {
          const r = reihen.findIndex((reihe) => reihe === an[0].parentElement);
          const stelle = `${r}:${[...reihen[r].children].indexOf(an[0])}`;
          expect(getroffen.get(stelle), `${id}: ${code} trifft dieselbe Taste wie`).toBeUndefined();
          getroffen.set(stelle, code);
        }
        cleanup();
      }
      // Der untere Teil des ISO-Enters ist keine eigene Taste.
      expect(getroffen.size).toBe(tastenGezeichnet - (ISO[id] ? 1 : 0));
    });
  }
});

// --- D) Ohne gedrueckt bleibt alles, wie es war ------------------------------
describe("D · ohne gedrueckt - kein Zeichen anders", () => {
  it("ohne gedrueckt gibt es kein data-gedrueckt", () => {
    for (const id of LAYOUTS) {
      for (const farben of [false, true]) {
        expect(zeichne(id, undefined, { farben, nextChar: "f" }).alle).toHaveLength(0);
        cleanup();
      }
    }
  });

  it("eine Taste, die die Zeichnung nicht hat, ändert am Markup nichts", () => {
    for (const id of LAYOUTS) {
      for (const farben of [false, true]) {
        for (const nextChar of [undefined, "f", "{", " ", "A"]) {
          const ohne = zeichne(id, undefined, { farben, nextChar }).container.innerHTML;
          cleanup();
          const f5 = zeichne(id, druck("F5", "F5"), { farben, nextChar }).container.innerHTML;
          cleanup();
          expect(f5, `${id} ${farben} ${nextChar}`).toBe(ohne);
        }
      }
    }
  });

  it("gedrückt und nächste Taste lassen sich unterscheiden", () => {
    const { container, an } = zeichne("de", druck("KeyJ", "j"), { nextChar: "f" });
    expect(an.map((e) => e.textContent)).toEqual(["J"]);
    const ziele = [...container.querySelectorAll<HTMLElement>(".tt-taste-ziel")];
    expect(ziele.map((e) => e.textContent)).toEqual(["F", "J"]);
    expect(ziele[0].className).toContain("border-accent");
    expect(ziele[0].hasAttribute("data-gedrueckt")).toBe(false);
    expect(ziele[1].className).toContain("border-ink");
  });

  it("fällt beides auf dieselbe Taste, gewinnt „gedrückt\"", () => {
    const { container, an } = zeichne("de", druck("KeyJ", "j"), { nextChar: "j" });
    expect(an.map((e) => e.textContent)).toEqual(["J"]);
    expect(container.querySelectorAll(".tt-taste-ziel")).toHaveLength(1);
    expect(an[0].className).toContain("border-ink");
  });
});

// --- E) KeyboardPanel --------------------------------------------------------
describe("E · KeyboardPanel - gedrueckt und immerOffen", () => {
  it("immerOffen zeigt die Tastatur, obwohl tastaturOffen false ist - und lässt den Zustand in Ruhe", () => {
    localStorage.clear();
    useTypingA11y.getState().setTastaturOffen(false);
    expect(localStorage.getItem("tippen-keyboard-open")).toBe("0");
    render(<KeyboardPanel unlocked={new Set()} showFingerColors={false} immerOffen />);
    expect(document.querySelector("[data-tastatur]")).toBeTruthy();
    expect(useTypingA11y.getState().tastaturOffen).toBe(false);
    expect(localStorage.getItem("tippen-keyboard-open")).toBe("0");
  });

  it("Gegenprobe: ohne immerOffen bleibt sie bei tastaturOffen false weg", () => {
    useTypingA11y.setState({ tastaturOffen: false });
    render(<KeyboardPanel unlocked={new Set()} showFingerColors={false} />);
    expect(document.querySelector("[data-tastatur]")).toBeNull();
  });

  it("reicht gedrueckt an die sichtbare Tastatur UND an die Messvorlage", () => {
    useTypingA11y.setState({ tastaturOffen: true });
    render(<KeyboardPanel unlocked={new Set()} showFingerColors gedrueckt={druck("KeyA", "a")} />);
    const sichtbar = document.querySelector("[data-tastatur]")!;
    const imSichtbaren = [...sichtbar.querySelectorAll('[data-gedrueckt="an"]')];
    expect(imSichtbaren.map((e) => e.textContent)).toEqual(["A"]);
    // Die Messvorlage muss dasselbe zeichnen, sonst misst sie eine andere Tastatur.
    expect(document.querySelectorAll('[data-gedrueckt="an"]')).toHaveLength(2);
  });
});
