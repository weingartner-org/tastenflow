/**
 * ★★★ WÄCHTER O-INHALT-UK (29.10.2026): DIE FREISCHALT-FEIER IN DER UKRAINISCHEN BEDIENUNG (`freischaltungUk.ts`).
 *
 * Vorbild: `tastenflow-tschechisch-alles.test.tsx` (b) „oslava nové klávesy" und `tastenflow-k3-feier-jede-bedienung-jeder-weg`.
 * Geprüft über die FEHLERKLASSE: jede Einheit des Weges „uk" auf beiden ukrainischen Tastaturen, dazu die Wege „de" und „en" mit
 * ukrainischer Bedienung (deutsche und amerikanische Tastatur) - Karte, Braillezeile und Ansage:
 *  · ganz kyrillisch bis auf die Tastennamen wie auf der Kappe (Shift, AltGr …) und einzelne lateinische Kappen (F, Q),
 *  · kein Englisch, kein Deutsch, kein Gedankenstrich,
 *  · kein Geschlecht am Kind (Glossar Regel 2: „ти відкрив/відкрила", „готовий/готова"),
 *  · ein Zeichen ohne Gross-/Kleinform heisst nie „літера" (K3), eine Ziffer wird in der Ansage als Wort gesagt,
 *  · höchstens ein Ausrufezeichen je Ansage (Regel 1).
 * Dazu die gerenderte Feier: die Bedienung „uk" spricht genau `unlockSpeechAlleUk`. GEGENPROBE: der englische Rückfall fällt durch.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";

const bedien = vi.hoisted(() => ({ sprache: "uk" as string }));

vi.mock("@/lib/bedienSprache", async () => {
  const actual = await vi.importActual<typeof import("@/lib/bedienSprache")>("@/lib/bedienSprache");
  return {
    ...actual,
    useBedienSprache: () => ({
      sprache: bedien.sprache,
      spracheGewaehlt: bedien.sprache,
      setzeSprache: () => {},
      bereichAktiv: true,
      wechsle: () => {},
      beimSchalter: () => () => {},
    }),
  };
});

vi.mock("@/lib/typing/voice", async (importOriginal) => {
  const echt = await importOriginal<typeof import("@/lib/typing/voice")>();
  return { ...echt, speak: vi.fn(), speakUi: vi.fn(), playUnlockFanfare: vi.fn() };
});

import { UnlockCelebration } from "@/components/typing/UnlockCelebration";
import { speakUi } from "@/lib/typing/voice";
import { introOrder, unlockSpeechAlle } from "@/lib/typing";
import { SHIFT_UNIT, unitKindImWeg } from "@/lib/typing/letters";
import { setLayout, type LayoutId } from "@/lib/typing/layouts";
import type { Lernweg } from "@/lib/typing/lernweg";
import { unlockBrailleLabelUk, unlockInfoUk, unlockSpeechAlleUk } from "@/lib/typing/freischaltungUk";
import { satzFehler } from "./helfer/oInhaltNeueWege";

/** Lateinische Wörter, die in ukrainischen Sätzen stehen dürfen: Tastennamen wie auf der Kappe (Glossar Regel 11, §3). */
const LATEIN = new Set(["Shift", "Alt", "AltGr", "Option", "Caps", "Lock", "Enter"]);
/** Geschlecht am Kind (Glossar §4 Falle 6). */
const GESCHLECHT = /(?<!\p{L})(відкрив|відкрила|зробив|зробила|готовий|готова|радий|рада|переможець|початківець)(?!\p{L})/u;

const FAELLE: readonly { weg: Lernweg; layouts: readonly LayoutId[] }[] = [
  { weg: "uk", layouts: ["ua", "ua-std"] },
  { weg: "de", layouts: ["de"] },
  { weg: "en", layouts: ["us"] },
];

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.mocked(speakUi).mockClear();
  setLayout("de");
});

function fehlerDerFeier(u: string, weg: Lernweg): string[] {
  const out: string[] = [];
  const info = unlockInfoUk(u, weg);
  const braille = unlockBrailleLabelUk(u, weg);
  const karte = `${info.noun} ${info.name}. ${info.howTo}`;
  for (const sober of [false, true]) {
    const satz = unlockSpeechAlleUk([u], sober, weg);
    out.push(...satzFehler(`Ansage ${u}`, satz, "Cyrillic", LATEIN));
    if (GESCHLECHT.test(satz)) out.push(`Geschlecht „${satz}"`);
    if ((satz.match(/!/g) ?? []).length > 1) out.push(`zwei Ausrufezeichen „${satz}"`);
    if (unitKindImWeg(u, weg) === "ziffer" && new RegExp(`: ${u}\\.`).test(satz)) out.push(`Ziffer als Zahl am Satzende „${satz}"`);
  }
  out.push(...satzFehler(`Karte ${u}`, karte, "Cyrillic", LATEIN));
  out.push(...satzFehler(`Braille ${u}`, braille.replace(u, ""), "Cyrillic", LATEIN));
  const keinBuchstabe = u !== SHIFT_UNIT && u.toUpperCase() === u.toLowerCase() && !/^\d$/.test(u);
  if (keinBuchstabe && /літера/.test(`${info.noun} ${braille}`)) out.push(`„${u}" heisst Buchstabe`);
  if (keinBuchstabe && info.name === u) out.push(`Name ist nur das Zeichen „${u}"`);
  return out;
}

describe("Freischalt-Feier ukrainisch: jede Einheit, jede Tastatur", () => {
  for (const { weg, layouts } of FAELLE)
    for (const lay of layouts)
      it(`Weg ${weg}, Tastatur ${lay}`, () => {
        setLayout(lay);
        const fehler = introOrder(weg).flatMap((u) => fehlerDerFeier(u, weg));
        expect(introOrder(weg).length).toBeGreaterThan(50);
        expect(fehler.slice(0, 10), `${fehler.length} Funde`).toEqual([]);
      });

  it("die Sätze, wie ein Kind sie hört (ukrainische Tastatur)", () => {
    setLayout("ua");
    expect(unlockSpeechAlleUk(["ї"], false, "uk")).toBe("Чудово! Нова літера: Ї. Друкується клавішею Ї: правий мізинець, верхній ряд.");
    expect(unlockSpeechAlleUk(["ґ"], true, "uk")).toBe("Нове для тебе: літера ґе. Друкується клавішею Ґ: лівий мізинець, нижній ряд.");
    expect(unlockSpeechAlleUk(["5"], false, "uk")).toMatch(/^Чудово! Нова цифра: п'ять\. /);
    expect(unlockSpeechAlleUk(["⇧"], false, "uk")).toBe("Чудово! Нова клавіша: Shift. Велику літеру друкуєш, коли другою рукою тримаєш клавішу Shift.");
    expect(unlockBrailleLabelUk(",", "uk")).toBe("Новий розділовий знак: кома ,");
    expect(unlockBrailleLabelUk("ї", "uk")).toBe("Нова літера: Ї");
    expect(unlockSpeechAlleUk(["(", ")"], false, "uk")).toMatch(/^Чудово! Відкрито: символ ліва дужка і символ права дужка\. /);
    // Kein russischer Buchstabe in einem ukrainischen Satz (Regel 14).
    for (const u of introOrder("uk")) expect(unlockSpeechAlleUk([u], false, "uk"), u).not.toMatch(/[ыэёъ]/);
  });

  it("deutsche Tastatur: AltGr und Totaste werden ukrainisch erklärt", () => {
    setLayout("de");
    expect(unlockSpeechAlleUk(["@"], false, "de")).toBe("Чудово! Новий символ: равлик. Затисни клавішу AltGr і натисни клавішу Q.");
    expect(unlockSpeechAlleUk(["^"], false, "de")).toMatch(/Спершу натисни клавішу циркумфлекс, потім пробіл\.$/);
  });

  it("GEGENPROBE: der englische Rückfall (vorher für „uk\") fällt durch", () => {
    setLayout("ua");
    const alt = introOrder("uk").flatMap((u) => satzFehler(u, unlockSpeechAlle([u], false, "uk", "uk"), "Cyrillic", LATEIN));
    expect(alt.length).toBeGreaterThan(30);
  });
});

describe("die gerenderte Feier in der Bedienung „uk\" spricht die ukrainische Ansage", () => {
  it("eine Einheit und ein Paar", () => {
    setLayout("ua");
    bedien.sprache = "uk";
    for (const [unit, mit] of [["ї", []], ["(", [")"]]] as const) {
      vi.useFakeTimers();
      vi.mocked(speakUi).mockClear();
      const { container } = render(<UnlockCelebration unit={unit} mit={[...mit]} lernweg="uk" skin="kind" onClose={() => {}} />);
      vi.advanceTimersByTime(1000);
      const gesprochen = vi.mocked(speakUi).mock.calls.map((c) => String(c[0])).join(" ");
      expect(gesprochen).toContain(unlockSpeechAlleUk([unit, ...mit], false, "uk").split(". ")[0]);
      const alarm = container.querySelector("[role=alert]")?.textContent ?? "";
      expect(alarm).toContain(unlockBrailleLabelUk(unit, "uk"));
      cleanup();
      vi.useRealTimers();
    }
  });
});
