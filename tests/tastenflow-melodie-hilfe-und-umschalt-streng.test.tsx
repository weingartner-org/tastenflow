/**
 * Zwei Wünsche von Johannes vom 17.10.2026.
 *
 * (1) „erkläre bei der Hilfe in allen Sprachen, dass die Melodie beim Tippen
 *     dafür da ist, einen gleichmäßigen Tipprhythmus zu üben, und Spaß machen
 *     soll; wer gleichmäßig wird, wird auch bei den schlechteren Tasten
 *     flüssiger - und beim Mouseover in Kurzform dazu."
 *     ⇒ Jede der acht Hilfen hat den Abschnitt, und der Mouseover-Text der
 *     Melodie (Zahnrad UND Menü unter dem Lautsprecher) beginnt mit der
 *     Kurzform, in jeder Sprache.
 *
 * (2) „bei Tastenflow musste man die Großschreibung immer mit der Shift-Taste
 *     der Gegenhand drücken. Jetzt nimmt Tastenflow auch die falsche
 *     Shift-Taste, obwohl Einhandschreiben aus ist. Warum? Stelle das wieder ab."
 *     ⇒ Ursache war W2a (27.09.2026, `20b9c606a`): „Falsche Umschalt-Seite nur
 *     als Hinweis". Zurückgenommen; die Gegenprobe steht in
 *     `typing-shift-hand.test.tsx` (Session) - hier die Kante darunter: der
 *     Hook zählt die falsche Umschalttaste nicht als Treffer.
 */
import { describe, it, expect, afterEach } from "vitest";
import { act, cleanup, render, renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AnnounceProvider } from "../src/lib/a11y";
import { TippenHilfe } from "../src/components/typing/TippenHilfe";
import { TippenHilfeEnglisch } from "../src/components/typing/TippenHilfe.en";
import { TippenHilfeFranzoesisch } from "../src/components/typing/TippenHilfe.fr";
import { TippenHilfeSpanisch } from "../src/components/typing/TippenHilfe.es";
import { TippenHilfeItalienisch } from "../src/components/typing/TippenHilfe.it";
import { TippenHilfePolnisch } from "../src/components/typing/TippenHilfe.pl";
import { TippenHilfeTuerkisch } from "../src/components/typing/TippenHilfe.tr";
import { TippenHilfeTschechisch } from "../src/components/typing/TippenHilfe.cs";
import { T } from "../src/components/typing/TypingSettings";
import { useTypingItem } from "../src/components/typing/useTypingItem";
import { SITZUNG_TEXTE } from "../src/components/typing/TypingSession";
import type { BedienSprache } from "../src/lib/bedienSprache";

afterEach(cleanup);

const HILFEN: Array<[BedienSprache, React.ComponentType<React.ComponentProps<typeof TippenHilfe>>, RegExp]> = [
  ["de", TippenHilfe, /gleichmäßigen Tipprhythmus/],
  ["en", TippenHilfeEnglisch, /steady typing rhythm/],
  ["fr", TippenHilfeFranzoesisch, /rythme de frappe régulier/],
  ["es", TippenHilfeSpanisch, /ritmo de escritura regular/],
  ["it", TippenHilfeItalienisch, /ritmo di scrittura regolare/],
  ["pl", TippenHilfePolnisch, /równego rytmu pisania/],
  ["tr", TippenHilfeTuerkisch, /düzenli bir yazma ritmi/],
  ["cs", TippenHilfeTschechisch, /rovnoměrného rytmu psaní/],
];

describe("Hilfe: wozu die Melodie beim Tippen da ist", () => {
  for (const [sprache, Hilfe, muster] of HILFEN) {
    it(`★ ${sprache}: Rhythmus üben, Spaß, flüssiger bei schwächeren Tasten`, () => {
      const { baseElement } = render(
        <AnnounceProvider>
          <MemoryRouter>
            <Hilfe open onClose={() => {}} stufe="kids" />
          </MemoryRouter>
        </AnnounceProvider>,
      );
      const text = baseElement.textContent ?? "";
      expect(text).toMatch(muster);
      // Der Weg dorthin steht dabei: Alt + 6 schaltet die Melodie.
      const abschnitt = [...baseElement.querySelectorAll("section, details, div")].find((el) =>
        muster.test(el.textContent ?? "") && /Alt\s*\+?\s*6/.test(el.textContent ?? ""),
      );
      expect(abschnitt).toBeTruthy();
    });
  }
});

describe("Mouseover der Melodie: die Kurzform steht vorn", () => {
  // ★ SPRACHEN-9 (29.10.2026, O2-LIB): die neun haben eine eigene Kurzform - kein englischer Rückfall mehr.
  const KURZ: Record<BedienSprache, RegExp> = {
    de: /^Übt einen gleichmäßigen Tipprhythmus und macht Spaß/,
    en: /^Practises a steady typing rhythm and is meant to be fun/,
    fr: /^Pour t'entrainer à un rythme de frappe régulier/,
    es: /^Para practicar un ritmo de escritura regular/,
    it: /^Per esercitare un ritmo di scrittura regolare/,
    pl: /^Ćwiczy równy rytm pisania/,
    tr: /^Düzenli yazma ritmini çalıştırır/,
    cs: /^Cvičí rovnoměrný rytmus psaní/,
    bg: /^Упражнява равномерен ритъм на/,
    el: /^Εξασκεί έναν σταθερό ρυθμό/,
    hu: /^Egyenletes gépelési ritmust gyakoroltat/,
    nl: /^Oefent een gelijkmatig typritme/,
    pt: /^Treina um ritmo de escrita/,
    br: /^Treina um ritmo de digitação/,
    ro: /^Te ajută să exersezi/,
    sv: /^Övar en jämn skrivrytm/,
    uk: /^Тренує рівномірний ритм друку/,
  };
  for (const sprache of Object.keys(KURZ) as BedienSprache[]) {
    it(`${sprache}: melodieHinweis beginnt mit der Kurzform und behält die Kürzel`, () => {
      const t = T[sprache].melodieHinweis;
      expect(t).toMatch(KURZ[sprache]);
      expect(t).toContain("Alt + 6");
    });
  }
});

describe("Umschalt-Gegenhand: die falsche Umschalttaste ist wieder ein Fehlgriff", () => {
  it("★ Hook: correctShiftHeld ⇒ false zählt NICHT als Treffer", () => {
    let fertig = 0;
    const falsch: string[] = [];
    const { result } = renderHook(() =>
      useTypingItem({
        expected: "A",
        active: true,
        onComplete: () => {
          fertig += 1;
        },
        onWrong: (soll) => {
          falsch.push(soll);
        },
        correctShiftHeld: () => false,
        zeile: 0,
      }),
    );
    act(() => {
      result.current.handleKey({
        key: "A",
        code: "KeyA",
        shiftKey: true,
        ctrlKey: false,
        altKey: false,
        metaKey: false,
        location: 0,
        preventDefault() {},
        getModifierState: () => false,
      } as unknown as React.KeyboardEvent);
    });
    expect(fertig).toBe(0);
    expect(result.current.index).toBe(0);
    expect(falsch).toEqual(["A"]);
  });

  it("★ Hook: mit der richtigen Hand (oder Einhand ⇒ keine Prüfung) zählt der Anschlag", () => {
    let fertig = 0;
    const { result } = renderHook(() =>
      useTypingItem({
        expected: "A",
        active: true,
        onComplete: () => {
          fertig += 1;
        },
        correctShiftHeld: () => true,
        zeile: 0,
      }),
    );
    act(() => {
      result.current.handleKey({
        key: "A",
        code: "KeyA",
        shiftKey: true,
        ctrlKey: false,
        altKey: false,
        metaKey: false,
        location: 0,
        preventDefault() {},
        getModifierState: () => false,
      } as unknown as React.KeyboardEvent);
    });
    expect(fertig).toBe(1);
  });

  it("der Fehlerhinweis „braucht die … Umschalttaste“ ist in allen acht Sprachen da", () => {
    for (const s of Object.keys(SITZUNG_TEXTE) as BedienSprache[]) {
      const t = SITZUNG_TEXTE[s].umschaltFalsch("A", true);
      expect(typeof t).toBe("string");
      expect(t.length).toBeGreaterThan(10);
    }
  });
});
