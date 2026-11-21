/**
 * ★★★ WÄCHTER O-INHALT-EL (29.10.2026): DIE FREISCHALT-FEIER IN DER GRIECHISCHEN BEDIENUNG (`freischaltungEl.ts`).
 *
 * Vorbild: `tastenflow-tschechisch-alles.test.tsx` (b) „oslava nové klávesy" und `tastenflow-k3-feier-jede-bedienung-jeder-weg`.
 * Geprüft über die FEHLERKLASSE: jede Einheit des Weges „el" auf allen drei griechischen Tastaturen, dazu die Wege „de" und „en" mit
 * griechischer Bedienung (deutsche und amerikanische Tastatur) - Karte, Braillezeile und Ansage:
 *  · ganz griechisch bis auf die Tastennamen wie auf der Kappe (Shift, AltGr …) und einzelne lateinische Kappen (F, Q),
 *  · kein Englisch, kein Deutsch, kein Gedankenstrich,
 *  · kein Geschlecht am Kind (Glossar Regel 2: „Είσαι έτοιμος", „σίγουρος", „φοβερός"),
 *  · ein Zeichen ohne Gross-/Kleinform heisst nie „γράμμα" (K3), eine Ziffer wird in der Ansage als Wort gesagt,
 *  · höchstens ein Ausrufezeichen je Ansage (Regel 1).
 * Dazu die gerenderte Feier: die Bedienung „el" spricht genau `unlockSpeechAlleEl`. GEGENPROBE: der englische Rückfall fällt durch.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";

const bedien = vi.hoisted(() => ({ sprache: "el" as string }));

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
import { unlockBrailleLabelEl, unlockInfoEl, unlockSpeechAlleEl } from "@/lib/typing/freischaltungEl";
import { satzFehler } from "./helfer/oInhaltNeueWege";

/** Lateinische Wörter, die in griechischen Sätzen stehen dürfen: Tastennamen wie auf der Kappe (Glossar Regel 11, §3). */
const LATEIN = new Set(["Shift", "Alt", "Gr", "AltGr", "Option", "Caps", "Lock", "Enter"]);
/** Geschlecht am Kind (Glossar §4 Falle 6). */
const GESCHLECHT = /(?<!\p{L})(έτοιμος|έτοιμη|σίγουρος|σίγουρη|φοβερός|φοβερή|νικητής|αρχάριος)(?!\p{L})/u;

const FAELLE: readonly { weg: Lernweg; layouts: readonly LayoutId[] }[] = [
  { weg: "el", layouts: ["el", "el-220", "el-319"] },
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
  const info = unlockInfoEl(u, weg);
  const braille = unlockBrailleLabelEl(u, weg);
  const karte = `${info.noun} ${info.name}. ${info.howTo}`;
  for (const sober of [false, true]) {
    const satz = unlockSpeechAlleEl([u], sober, weg);
    out.push(...satzFehler(`Ansage ${u}`, satz, "Greek", LATEIN));
    if (GESCHLECHT.test(satz)) out.push(`Geschlecht „${satz}"`);
    if ((satz.match(/!/g) ?? []).length > 1) out.push(`zwei Ausrufezeichen „${satz}"`);
    if (unitKindImWeg(u, weg) === "ziffer" && new RegExp(`: ${u}\\.`).test(satz)) out.push(`Ziffer als Zahl am Satzende „${satz}"`);
  }
  out.push(...satzFehler(`Karte ${u}`, karte, "Greek", LATEIN));
  out.push(...satzFehler(`Braille ${u}`, braille.replace(u, ""), "Greek", LATEIN));
  const keinBuchstabe = u !== SHIFT_UNIT && u.toUpperCase() === u.toLowerCase() && !/^\d$/.test(u);
  if (keinBuchstabe && /γράμμα/.test(`${info.noun} ${braille}`)) out.push(`„${u}" heisst Buchstabe`);
  if (keinBuchstabe && info.name === u) out.push(`Name ist nur das Zeichen „${u}"`);
  return out;
}

describe("Freischalt-Feier griechisch: jede Einheit, jede Tastatur", () => {
  for (const { weg, layouts } of FAELLE)
    for (const lay of layouts)
      it(`Weg ${weg}, Tastatur ${lay}`, () => {
        setLayout(lay);
        const fehler = introOrder(weg).flatMap((u) => fehlerDerFeier(u, weg));
        expect(introOrder(weg).length).toBeGreaterThan(50);
        expect(fehler.slice(0, 10), `${fehler.length} Funde`).toEqual([]);
      });

  it("die Sätze, wie ein Kind sie hört (griechische Tastatur)", () => {
    setLayout("el");
    expect(unlockSpeechAlleEl(["φ"], false, "el")).toBe("Μπράβο! Νέο γράμμα: Φ. Γράφεται με το πλήκτρο Φ: αριστερός δείκτης, βασική σειρά.");
    expect(unlockSpeechAlleEl(["ς"], true, "el")).toBe("Κάτι νέο για σένα: γράμμα τελικό σίγμα. Γράφεται με το πλήκτρο ς: αριστερός παράμεσος, πάνω σειρά.");
    expect(unlockSpeechAlleEl(["5"], false, "el")).toMatch(/^Μπράβο! Νέο ψηφίο: πέντε\. /);
    expect(unlockSpeechAlleEl(["΄"], false, "el")).toBe("Μπράβο! Νέο νεκρό πλήκτρο: τόνος. Πάτησε πρώτα το νεκρό πλήκτρο τόνος, μετά το φωνήεν: ά, έ, ή, ί, ό, ύ, ώ.");
    expect(unlockBrailleLabelEl(";", "el")).toBe("Νέο σημείο στίξης: ερωτηματικό ;");
    expect(unlockBrailleLabelEl("φ", "el")).toBe("Νέο γράμμα: Φ");
    expect(unlockSpeechAlleEl(["(", ")"], false, "el")).toMatch(/^Μπράβο! Ξεκλειδώθηκαν: σύμβολο άνοιγμα παρένθεσης και σύμβολο κλείσιμο παρένθεσης\. /);
    // Kein „?" in einem griechischen Satz (Glossar Regel 7).
    for (const u of introOrder("el")) expect(unlockSpeechAlleEl([u], false, "el").replace(/αγγλικό ερωτηματικό/, ""), u).not.toMatch(/\?/);
  });

  it("deutsche Tastatur: Alt Gr und Totaste werden griechisch erklärt", () => {
    setLayout("de");
    expect(unlockSpeechAlleEl(["@"], false, "de")).toBe("Μπράβο! Νέο σύμβολο: παπάκι. Κράτα πατημένο το Alt Gr και πάτησε το πλήκτρο Q.");
    expect(unlockSpeechAlleEl(["^"], false, "de")).toMatch(/Πάτησε το πλήκτρο δύναμη και μετά το πλήκτρο διαστήματος\.$/);
  });

  it("GEGENPROBE: der englische Rückfall (vorher für „el\") fällt durch", () => {
    setLayout("el");
    const alt = introOrder("el").flatMap((u) => satzFehler(u, unlockSpeechAlle([u], false, "el", "el"), "Greek", LATEIN));
    expect(alt.length).toBeGreaterThan(30);
  });
});

describe("die gerenderte Feier in der Bedienung „el\" spricht die griechische Ansage", () => {
  it("eine Einheit und ein Paar", () => {
    setLayout("el");
    bedien.sprache = "el";
    for (const [unit, mit] of [["φ", []], ["(", [")"]]] as const) {
      vi.useFakeTimers();
      vi.mocked(speakUi).mockClear();
      const { container } = render(<UnlockCelebration unit={unit} mit={[...mit]} lernweg="el" skin="kind" onClose={() => {}} />);
      vi.advanceTimersByTime(1000);
      const gesprochen = vi.mocked(speakUi).mock.calls.map((c) => String(c[0])).join(" ");
      expect(gesprochen).toContain(unlockSpeechAlleEl([unit, ...mit], false, "el").split(". ")[0]);
      const alarm = container.querySelector("[role=alert]")?.textContent ?? "";
      expect(alarm).toContain(unlockBrailleLabelEl(unit, "el"));
      cleanup();
      vi.useRealTimers();
    }
  });
});
