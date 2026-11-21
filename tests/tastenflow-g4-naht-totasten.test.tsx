/**
 * ★★★ G4-NAHT (25.10.2026, Falle 55): die Totasten der neun Gerüst-Wege, nachdem G3a (Kombizeichen je Sprache,
 * `totasten.ts`, `anschlagDeuten.ts`) und G3b (Tastaturen mit `sprache` und `dead: true`, `layouts.ts`) zusammengeführt
 * sind. Je Tastatur:
 *  · die erreichbaren Kombizeichen sind GENAU die, die der Weg lehrt (Bauplan XX §1/§2) - aus der Tabelle der Sprache;
 *  · Totaste (am echten `code` der Taste, mit Umschalt/AltGr wie im Modell) + Grundbuchstabe ⇒ das richtige Zeichen,
 *    und die Totaste ist NIE ein Fehlgriff - klein und gross;
 *  · in der Übungszeile (`useTypingItem`): kein Fehler, die Stelle rückt vor.
 * Dazu US-International: `'` + s schreibt „'s" - in „auto's" richtig (beide Zeichen), sonst EIN Fehlgriff.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTypingItem } from "@/components/typing/useTypingItem";
import { LAYOUTS, activeLayout, layoutById, layoutSprache, setLayout, type KeyboardLayout, type LayoutId } from "@/lib/typing/layouts";
import { REIHEN_CODES, deuteAnschlag, tasteFuerCode } from "@/lib/typing/anschlagDeuten";
import { kombizeichenFuerLayout, kombizeichenZu, grossbuchstabeWeg } from "@/lib/typing/totasten";
import { GERUEST_SPRACHEN, grossFuer, kleinFuer } from "@/lib/typing/sprachRegister";
import type { Lang } from "@/lib/typing/account";

afterEach(() => setLayout("de"));

const NEUE = LAYOUTS.filter((l) => (GERUEST_SPRACHEN as readonly Lang[]).includes(layoutSprache(l)));

/** Der `code` der Taste, die `base` auf ihrer Grundebene trägt. */
function codeFuer(layout: KeyboardLayout, base: string): string {
  for (const r of REIHEN_CODES) for (const c of r.codes) if (tasteFuerCode(layout, c) === base) return c;
  throw new Error(`${layout.id}: keine Taste ${base}`);
}

/** Der Dead-Anschlag der Totaste `tot` auf dieser Tastatur - so, wie der Browser ihn meldet. */
function deadAnschlag(layout: KeyboardLayout, tot: string) {
  const z = layout.access[tot];
  if (!z?.dead) throw new Error(`${layout.id}: ${tot} ist keine Totaste`);
  return { key: "Dead", code: codeFuer(layout, z.base), shiftKey: z.mod === "shift", altGr: z.mod === "altgr" };
}

/** Was je Tastatur über eine Totaste gelehrt wird (Baupläne §1/§2 der Wege; ohne Zeichen mit eigener Taste). */
const ERWARTET: Partial<Record<LayoutId, string>> = {
  el: "άέήίόύώϊϋΐΰ",
  "el-220": "άέήίόύώϊϋΐΰ",
  "el-319": "άέήίόύώϊϋΐΰ",
  // US-International: é = AltGr + E (eigener Griff), darum nicht in der Liste - `'` + e gilt trotzdem (unten).
  "nl-intl": "êâîôûùàèìòáíóúäëïöü",
  "nl-dutch": "êâîôûëïüÿäöùàèáéíóúìò",
  pt: "êâîôûëïüÿäöùàèáéíóúìòãõ",
  "br-abnt2": "êâîôûëïüÿäöùàèáéíóúìòãõ",
  sv: "êâîôûëïüÿùàèáéíóúìò",
};
/** Die Zeichen, die der Weg wirklich lehrt - sie MÜSSEN dabei sein (Baupläne). */
const PFLICHT: Partial<Record<LayoutId, string>> = {
  el: "άέήίόύώϊϋΐΰ", "el-220": "άέήίόύώϊϋΐΰ", "el-319": "άέήίόύώϊϋΐΰ",
  "nl-intl": "ëï", "nl-dutch": "éëï",
  pt: "ãáéêóíúàõâô", "br-abnt2": "ãéáêóíúàõôâ",
  sv: "é",
};

describe("G4-NAHT: Kombizeichen je Tastatur der neun Wege", () => {
  it("die Liste je Tastatur (aus der Tabelle der Sprache, an der Eigenschaft `sprache` der Tastatur)", () => {
    expect(NEUE.length).toBe(18);
    for (const l of NEUE) {
      const ist = kombizeichenFuerLayout(l).map((k) => k.zeichen).join("");
      expect(ist, l.id).toBe(ERWARTET[l.id] ?? "");
      for (const p of PFLICHT[l.id] ?? "") expect(ist.includes(p), `${l.id} lehrt ${p}`).toBe(true);
    }
  });

  for (const l of NEUE.filter((x) => kombizeichenFuerLayout(x).length > 0)) {
    it(`${l.id}: Totaste + Grundbuchstabe ⇒ das Zeichen, die Totaste nie ein Fehlgriff (klein und gross)`, () => {
      setLayout(l.id);
      const sp = layoutSprache(l);
      for (const k of kombizeichenFuerLayout(l)) {
        const d1 = deuteAnschlag(deadAnschlag(l, k.tot), null, l);
        expect(d1.deutung, `${l.id} ${k.tot}`).toEqual({ art: "totaste", tot: k.tot });
        const d2 = deuteAnschlag({ key: k.zeichen, code: codeFuer(l, k.dann) }, d1.offen, l);
        expect(d2.deutung, `${l.id} ${k.tot}+${k.dann}`).toEqual({ art: "zeichen", zeichen: k.zeichen });

        const gross = grossFuer(k.zeichen, sp);
        // ΐ ΰ werden gross zu Ϊ Ϋ (ohne Tonos, `grossSonderformen`) - die kommen über ¨ und stehen dort.
        if ([...gross].length !== 1 || gross === k.zeichen || kleinFuer(gross, sp) !== k.zeichen) continue;
        expect(grossbuchstabeWeg(gross, l), `${l.id} ${gross}`).toBe("totaste");
        expect(kombizeichenZu(gross, l)?.tot, `${l.id} ${gross}`).toBe(k.tot);
        const g2 = deuteAnschlag({ key: gross, code: codeFuer(l, k.dann), shiftKey: true }, d1.offen, l);
        expect(g2.deutung, `${l.id} ${gross}`).toEqual({ art: "zeichen", zeichen: gross });
      }
    });
  }

  it("Gegenprobe (Bauplan EL E2): Tonos, dann ein Mitlaut ⇒ EIN Fehlgriff", () => {
    const l = layoutById("el");
    const d1 = deuteAnschlag(deadAnschlag(l, "΄"), null, l);
    const d2 = deuteAnschlag({ key: "π", code: "KeyP" }, d1.offen, l);
    expect(d2.deutung.art).toBe("fehlgriff");
  });

  it("nl-intl: é kommt über AltGr + E UND über `'` + e - beides richtig (Bauplan NL N5)", () => {
    const l = layoutById("nl-intl");
    const d1 = deuteAnschlag(deadAnschlag(l, "'"), null, l);
    expect(d1.deutung.art).toBe("totaste");
    expect(deuteAnschlag({ key: "é", code: "KeyE" }, d1.offen, l).deutung).toEqual({ art: "zeichen", zeichen: "é" });
    expect(deuteAnschlag({ key: "é", code: "KeyE", altGr: true }, null, l).deutung).toEqual({ art: "zeichen", zeichen: "é" });
  });
});

function taste(key: string, code?: string, shiftKey = false): KeyboardEvent {
  return { key, code, shiftKey, preventDefault: () => {} } as unknown as KeyboardEvent;
}

describe("G4-NAHT: in der Übungszeile (useTypingItem)", () => {
  it.each([
    ["el", "άλογο", [["Dead", "Semicolon"], ["ά", "KeyA"], ["λ", "KeyL"], ["ο", "KeyO"], ["γ", "KeyG"], ["ο", "KeyO"]]],
    ["el", "προϊόν", [["π", "KeyP"], ["ρ", "KeyR"], ["ο", "KeyO"], ["Dead", "Semicolon", true], ["ϊ", "KeyI"], ["Dead", "Semicolon"], ["ό", "KeyO"], ["ν", "KeyN"]]],
    ["pt", "mãe", [["m", "KeyM"], ["Dead", "Backslash"], ["ã", "KeyA"], ["e", "KeyE"]]],
    ["br-abnt2", "você", [["v", "KeyV"], ["o", "KeyO"], ["c", "KeyC"], ["Dead", "Quote", true], ["ê", "KeyE"]]],
    ["sv", "idé", [["i", "KeyI"], ["d", "KeyD"], ["Dead", "Equal"], ["é", "KeyE"]]],
    ["nl-intl", "ideeën", [["i", "KeyI"], ["d", "KeyD"], ["e", "KeyE"], ["e", "KeyE"], ["Dead", "Quote", true], ["ë", "KeyE"], ["n", "KeyN"]]],
  ] as const)("%s: „%s\" ohne Fehler", (id, zeile, anschlaege) => {
    setLayout(id as LayoutId);
    const onComplete = vi.fn();
    const { result } = renderHook(() => useTypingItem({ expected: zeile, active: true, onComplete }));
    for (const [key, code, umschalt] of anschlaege as readonly (readonly [string, string, boolean?])[]) {
      act(() => result.current.handleKey(taste(key, code, !!umschalt)));
    }
    expect(result.current.errors, `${id} ${zeile}`).toBe(0);
    expect(onComplete).toHaveBeenCalledWith(0);
  });

  it("★ nl-intl: „auto's\" - `'` + s schreibt beide Zeichen, beide gelten (Falle 55, Bauplan NL N4)", () => {
    setLayout("nl-intl");
    const onComplete = vi.fn();
    const onCorrect = vi.fn();
    const { result } = renderHook(() => useTypingItem({ expected: "auto's", active: true, onComplete, onCorrect }));
    for (const [k, c] of [["a", "KeyA"], ["u", "KeyU"], ["t", "KeyT"], ["o", "KeyO"], ["Dead", "Quote"], ["s", "KeyS"]]) {
      act(() => result.current.handleKey(taste(k, c)));
    }
    expect(result.current.errors).toBe(0);
    expect(onComplete).toHaveBeenCalledWith(0);
    expect(onCorrect.mock.calls.map((c) => c[0]).join("")).toBe("auto's");
  });

  it("nl-intl: `'` + s, wo die Zeile kein „'s\" hat ⇒ EIN Fehlgriff (wie bisher)", () => {
    setLayout("nl-intl");
    const { result } = renderHook(() => useTypingItem({ expected: "'t", active: true, onComplete: vi.fn() }));
    act(() => result.current.handleKey(taste("Dead", "Quote")));
    act(() => result.current.handleKey(taste("s", "KeyS")));
    expect(result.current.errors).toBe(1);
    expect(result.current.index).toBe(0);
  });

  it("Gegenprobe alte Wege: Deutsch `^` + p bleibt EIN Fehlgriff, auch wenn „^p\" in der Zeile steht", () => {
    setLayout("de");
    expect(activeLayout().id).toBe("de");
    const { result } = renderHook(() => useTypingItem({ expected: "^p", active: true, onComplete: vi.fn() }));
    act(() => result.current.handleKey(taste("Dead", "Backquote")));
    act(() => result.current.handleKey(taste("p", "KeyP")));
    expect(result.current.errors).toBe(1);
    expect(result.current.index).toBe(0);
  });
});
