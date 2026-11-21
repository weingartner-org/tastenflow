/**
 * ★★★ WÄCHTER O-INHALT-BG (29.10.2026): DIE FREISCHALT-FEIER IN DER BULGARISCHEN BEDIENUNG (`freischaltungBg.ts`).
 *
 * Vorbild: `tastenflow-tschechisch-alles.test.tsx` (b) „oslava nové klávesy" und `tastenflow-k3-feier-jede-bedienung-jeder-weg`.
 * Geprüft über die FEHLERKLASSE: jede Einheit des Weges „bg" auf BDS und Schreibmaschine, dazu die Wege „de" und „en" mit
 * bulgarischer Bedienung (deutsche und amerikanische Tastatur) - Karte, Braillezeile und Ansage:
 *  · ganz kyrillisch bis auf die Tastennamen wie auf der Kappe (Shift, AltGr …) und einzelne lateinische Kappen (F, Q),
 *  · kein Englisch, kein Deutsch, kein Gedankenstrich,
 *  · kein Geschlecht am Kind (Glossar §4 Falle 6: „си написал", „успял", „готов"),
 *  · ein Zeichen ohne Gross-/Kleinform heisst nie „буква" (K3), eine Ziffer wird in der Ansage als Wort gesagt,
 *  · höchstens ein Ausrufezeichen je Ansage (Regel 1).
 * Dazu die gerenderte Feier: die Bedienung „bg" spricht genau `unlockSpeechAlleBg`. GEGENPROBE: der englische Rückfall fällt durch.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";

const bedien = vi.hoisted(() => ({ sprache: "bg" as string }));

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
import { unlockBrailleLabelBg, unlockInfoBg, unlockSpeechAlleBg } from "@/lib/typing/freischaltungBg";
import { satzFehler } from "./helfer/oInhaltNeueWege";

/** Lateinische Wörter, die in bulgarischen Sätzen stehen dürfen: Tastennamen wie auf der Kappe (Glossar Regel 11, §3). */
const LATEIN = new Set(["Shift", "Alt", "AltGr", "Option", "Caps", "Lock", "Enter"]);
/** Geschlecht am Kind (Glossar §4 Falle 6). */
const GESCHLECHT = /(?<!\p{L})си \p{L}+(л|ла|ли)(?!\p{L})|(?<!\p{L})(успял|готов|сигурен|доволен)/u;

const FAELLE: readonly { weg: Lernweg; layouts: readonly LayoutId[] }[] = [
  { weg: "bg", layouts: ["bg", "bg-schreibm"] },
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
  const info = unlockInfoBg(u, weg);
  const braille = unlockBrailleLabelBg(u, weg);
  const karte = `${info.noun} ${info.name}. ${info.howTo}`;
  for (const sober of [false, true]) {
    const satz = unlockSpeechAlleBg([u], sober, weg);
    out.push(...satzFehler(`Ansage ${u}`, satz, "Cyrillic", LATEIN));
    if (GESCHLECHT.test(satz)) out.push(`Geschlecht „${satz}"`);
    if ((satz.match(/!/g) ?? []).length > 1) out.push(`zwei Ausrufezeichen „${satz}"`);
    if (unitKindImWeg(u, weg) === "ziffer" && new RegExp(`: ${u}\\.`).test(satz)) out.push(`Ziffer als Zahl am Satzende „${satz}"`);
  }
  out.push(...satzFehler(`Karte ${u}`, karte, "Cyrillic", LATEIN));
  out.push(...satzFehler(`Braille ${u}`, braille.replace(u, ""), "Cyrillic", LATEIN));
  const keinBuchstabe = u !== SHIFT_UNIT && u.toUpperCase() === u.toLowerCase() && !/^\d$/.test(u);
  if (keinBuchstabe && /буква/.test(`${info.noun} ${braille}`)) out.push(`„${u}" heisst Buchstabe`);
  if (keinBuchstabe && info.name === u) out.push(`Name ist nur das Zeichen „${u}"`);
  return out;
}

describe("Freischalt-Feier bulgarisch: jede Einheit, jede Tastatur", () => {
  for (const { weg, layouts } of FAELLE)
    for (const lay of layouts)
      it(`Weg ${weg}, Tastatur ${lay}`, () => {
        setLayout(lay);
        const fehler = introOrder(weg).flatMap((u) => fehlerDerFeier(u, weg));
        expect(introOrder(weg).length).toBeGreaterThan(50);
        expect(fehler.slice(0, 10), `${fehler.length} Funde`).toEqual([]);
      });

  it("die Sätze, wie ein Kind sie hört (BDS)", () => {
    setLayout("bg");
    expect(unlockSpeechAlleBg(["ж"], false, "bg")).toBe("Браво! Нова буква: Ж. Пише се с клавиша Ж: ляв показалец, основен ред.");
    expect(unlockSpeechAlleBg(["ъ"], true, "bg")).toBe("Ново за теб: буква ер голям. Пише се с клавиша Ъ: ляв среден пръст, долен ред.");
    expect(unlockSpeechAlleBg(["5"], false, "bg")).toMatch(/^Браво! Нова цифра: пет\. /);
    expect(unlockSpeechAlleBg([SHIFT_UNIT], false, "bg")).toBe(
      "Браво! Нов клавиш: Shift. Главна буква пишеш, като с другата ръка държиш клавиша Shift.",
    );
    expect(unlockBrailleLabelBg(",", "bg")).toBe("Нов препинателен знак: запетая ,");
    expect(unlockBrailleLabelBg("ж", "bg")).toBe("Нова буква: Ж");
    expect(unlockSpeechAlleBg(["(", ")"], false, "bg")).toMatch(/^Браво! Отключено: символ лява скоба и символ дясна скоба\. /);
  });

  it("deutsche Tastatur: AltGr und Totaste werden bulgarisch erklärt", () => {
    setLayout("de");
    expect(unlockSpeechAlleBg(["@"], false, "de")).toBe("Браво! Нов символ: кльомба. Задръж AltGr и натисни клавиша Q.");
    expect(unlockSpeechAlleBg(["^"], false, "de")).toMatch(/Първо натисни клавиша колибка, после интервала\.$/);
  });

  it("GEGENPROBE: der englische Rückfall (vorher für „bg\") fällt durch", () => {
    setLayout("bg");
    const alt = introOrder("bg").flatMap((u) => satzFehler(u, unlockSpeechAlle([u], false, "bg", "bg"), "Cyrillic", LATEIN));
    expect(alt.length).toBeGreaterThan(30);
  });
});

describe("die gerenderte Feier in der Bedienung „bg\" spricht die bulgarische Ansage", () => {
  it("eine Einheit und ein Paar", () => {
    setLayout("bg");
    bedien.sprache = "bg";
    for (const [unit, mit] of [["ж", []], ["(", [")"]]] as const) {
      vi.useFakeTimers();
      vi.mocked(speakUi).mockClear();
      const { container } = render(<UnlockCelebration unit={unit} mit={[...mit]} lernweg="bg" skin="kind" onClose={() => {}} />);
      vi.advanceTimersByTime(1000);
      const gesprochen = vi.mocked(speakUi).mock.calls.map((c) => String(c[0])).join(" ");
      expect(gesprochen).toContain(unlockSpeechAlleBg([unit, ...mit], false, "bg").split(". ")[0]);
      const alarm = container.querySelector("[role=alert]")?.textContent ?? "";
      expect(alarm).toContain(unlockBrailleLabelBg(unit, "bg"));
      cleanup();
      vi.useRealTimers();
    }
  });
});
