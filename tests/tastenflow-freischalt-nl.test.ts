/**
 * ★★★ WÄCHTER O-NL (29.10.2026): DIE FREISCHALT-FEIER NIEDERLÄNDISCH (`src/lib/typing/freischaltungNl.ts`).
 *
 * Vorbild `tastenflow-k3-feier-jede-bedienung-jeder-weg.test.tsx` und `tastenflow-es-m2-freischalt-feier-alle.test.tsx`,
 * geprüft über die FEHLERKLASSE: JEDE Einheit der Reihenfolge des Weges „nl" auf BEIDEN Tastaturen (US-International NL
 * `nl-intl`, Belgisch AZERTY `be`) - Karte, Braillezeile und Ansage (Kind und sachlich):
 *  · niederländisch: kein englisches oder deutsches Wort (finger, row, key, press, Taste, Finger …) - `fingers.ts`
 *    antwortet für „nl" noch englisch, die Datei darf davon nichts durchreichen;
 *  · Hausregeln: nur `-`, höchstens ein „!", keine Zahl mit Punkt am Satzende (Ziffern als Wort);
 *  · ein Zeichen ohne Gross-/Kleinform heisst nie „letter" und nie nur sich selbst; das Adjektiv folgt dem
 *    Gattungswort („Nieuwe letter", „Nieuw cijfer");
 *  · eine Totasten-Einheit mit Vokalen nennt die Vokale, nicht die Leertaste;
 *  · mehrere Einheiten in einer Ansage: alle genannt, in ihrer Reihenfolge (jede Sprosse des Weges mit mehr als einer);
 *  · die Feier selbst (`UnlockCelebration`, Bedienung „nl") spricht genau diese Ansage.
 */
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";

const bedien = vi.hoisted(() => ({ sprache: "nl" as const }));

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
import { advanceIntroduced, charAccess, introOrder, istTotastenEinheit, neuFreigeschaltet, totastenVokale } from "@/lib/typing";
import { SHIFT_UNIT, unitKindImWeg } from "@/lib/typing/letters";
import { fingerForChar } from "@/lib/typing/fingers";
import { setLayout, type LayoutId } from "@/lib/typing/layouts";
import { unlockBrailleLabelNl, unlockInfoNl, unlockSpeechAlleNl } from "@/lib/typing/freischaltungNl";

const TASTATUREN: readonly LayoutId[] = ["nl-intl", "be"];
const VINGERS = /\b(linker|rechter)(pink|ringvinger|middelvinger|wijsvinger)\b|\bduim\b/;

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.mocked(speakUi).mockClear();
  setLayout("de");
});

/** Englische Wörter, die im Niederländischen nicht vorkommen. */
const ENGLISCH = /\b(the|and|keys?|press|finger|row|unlocked|hold|then|first|digit|special|character|space bar|congratulations|written|capital|quotation|apostrophe|semicolon|comma|letter is|left|right|number)\b/i;
/** Deutsche Wörter („die", „das" sind auch niederländisch). */
const DEUTSCH = /\b(Taste|Tasten|drücke|Buchstaben?|Finger|Reihe|Grundreihe|Zahlenreihe|Ziffer|Zeichen|Umschalt|halte|dann|zuerst|Leertaste|und|mit|Sonderzeichen|Satzzeichen)\b/;

function regelBrueche(s: string): string[] {
  const out: string[] = [];
  if (/[\u2013\u2014]/.test(s)) out.push("Halbgeviert- oder Geviertstrich");
  if ((s.match(/!/g) ?? []).length > 1) out.push("mehr als ein „!\"");
  if (/\d\.(\s|$)/.test(s)) out.push("Zahl mit Punkt am Satzende");
  if (ENGLISCH.test(s)) out.push(`englisches Wort „${s.match(ENGLISCH)![0]}"`);
  if (DEUTSCH.test(s)) out.push(`deutsches Wort „${s.match(DEUTSCH)![0]}"`);
  if (/\b(klik|tik|muis)\b/i.test(s)) out.push("Maus-Wort");
  if (/\bblind/i.test(s)) out.push("„blind\"");
  return out;
}

/** Zeichen ohne Gross-/Kleinform, das keine Ziffer ist - nie eine „letter". */
const keinBuchstabe = (u: string) => u !== SHIFT_UNIT && u.toUpperCase() === u.toLowerCase() && !/^\d$/.test(u);

/** Alle Fehler der Feier einer Einheit (leer = in Ordnung). */
function fehler(u: string, layout: LayoutId): string[] {
  const out: string[] = [];
  const info = unlockInfoNl(u, "nl");
  const braille = unlockBrailleLabelNl(u, "nl");
  const satz = unlockSpeechAlleNl([u], false, "nl");
  const sachlich = unlockSpeechAlleNl([u], true, "nl");
  for (const [wo, s] of [["Karte", `${info.noun} ${info.name} | ${info.howTo}`], ["Braille", braille], ["Ansage", satz], ["Ansage sachlich", sachlich]] as const)
    for (const b of regelBrueche(s)) out.push(`${wo}: ${b} - ${s}`);
  if (!info.noun || !info.howTo) out.push("Karte leer");
  if (!/^Nieuwe? /.test(braille)) out.push(`Braille ohne „Nieuw(e)" - ${braille}`);
  if (!satz.startsWith("Goed gedaan! ")) out.push(`Ansage ohne Lob - ${satz}`);
  if (!sachlich.startsWith("Nieuw voor jou: ")) out.push(`sachliche Ansage - ${sachlich}`);
  if (sachlich.includes("!")) out.push(`sachliche Ansage mit „!" - ${sachlich}`);
  // Das Adjektiv folgt dem Gattungswort: het cijfer/leesteken/teken ⇒ „Nieuw", de letter/toets ⇒ „Nieuwe".
  const het = ["cijfer", "leesteken", "teken"].includes(info.noun);
  if (!braille.startsWith(het ? `Nieuw ${info.noun}:` : `Nieuwe ${info.noun}:`)) out.push(`Adjektiv - ${braille}`);
  if (keinBuchstabe(u)) {
    if (info.noun === "letter") out.push(`Karte „letter ${info.name}"`);
    if (/\bletter\b/.test(braille)) out.push(`Braille „${braille}"`);
    if (info.name === u) out.push(`Name ist nur das Zeichen „${u}"`);
  }
  if (/^\d$/.test(u)) {
    if (info.noun !== "cijfer") out.push(`Ziffer ohne „cijfer" - ${info.noun}`);
    if (/\d/.test(satz)) out.push(`Ziffer in der Ansage nicht als Wort - ${satz}`);
  }
  if (u === SHIFT_UNIT && !/Shift/.test(braille)) out.push(`Shift - ${braille}`);
  // Ein Zeichen auf eigener Taste mit Finger: die Ansage nennt den Finger niederländisch.
  if (!charAccess(u) && fingerForChar(u, "nl") && unitKindImWeg(u, "nl") !== "shift" && !VINGERS.test(info.howTo)) out.push(`kein Finger - ${info.howTo}`);
  if (istTotastenEinheit(u, "nl") && charAccess(u)?.dead) {
    if (info.noun !== "dode toets") out.push(`Totaste nicht „dode toets" - ${info.noun}`);
    const vokale = totastenVokale(u, "nl");
    if (vokale.length > 0) {
      if (/spatiebalk/.test(satz)) out.push(`Totaste mit Leertaste - ${satz}`);
      for (const v of vokale) if (!satz.includes(v)) out.push(`Vokal ${v} fehlt - ${satz}`);
    }
  }
  return out.map((f) => `${layout} ${JSON.stringify(u)}: ${f}`);
}

/** Alle Sprossen des Weges „nl", an denen mehr als eine Einheit zugleich wächst. */
function mehrfachSprossen(): string[][] {
  const o = introOrder("nl");
  const out: string[][] = [];
  for (let i = 1; i < o.length; i++) {
    const vorher = o.slice(0, i);
    const neu = neuFreigeschaltet(vorher, advanceIntroduced(vorher, {}, "nl", undefined, 99));
    if (neu.length > 1) out.push(neu);
  }
  return out;
}

/** Der gesprochene Name einer Einheit, wie ihn die Ansage nach dem Gattungswort nennt. */
function gesprochenerKopf(u: string): string {
  return unlockSpeechAlleNl([u], true, "nl").replace(/^Nieuw voor jou: /, "").split(". ")[0]!;
}

describe("★★★ O-NL: jede Einheit des Weges „nl\" auf beiden Tastaturen - Karte, Braillezeile, Ansage niederländisch", () => {
  for (const layout of TASTATUREN)
    it(`Tastatur ${layout}`, () => {
      setLayout(layout);
      const einheiten = introOrder("nl");
      expect(einheiten.length).toBeGreaterThan(60);
      const alle = einheiten.flatMap((u) => fehler(u, layout));
      expect(alle).toEqual([]);
    });

  it("Stichproben: die Sätze, wie sie das Kind hört", () => {
    setLayout("nl-intl");
    expect(unlockSpeechAlleNl(["r"], false, "nl")).toBe("Goed gedaan! Nieuwe letter: r. Op de toets R: linkerwijsvinger, bovenste rij.");
    expect(unlockSpeechAlleNl(["5"], false, "nl")).toBe("Goed gedaan! Nieuw cijfer: vijf. Op de toets vijf: linkerwijsvinger, cijferrij.");
    expect(unlockBrailleLabelNl("'", "nl")).toBe("Nieuwe dode toets: apostrof '");
    expect(unlockSpeechAlleNl(["ë"], false, "nl")).toContain("e met trema");
    setLayout("be");
    expect(unlockSpeechAlleNl(["2"], false, "nl")).toBe("Goed gedaan! Nieuw cijfer: twee. Houd Shift ingedrukt en druk op de toets e met accent aigu.");
    expect(unlockSpeechAlleNl([SHIFT_UNIT], false, "nl")).toContain("cijfers met Shift");
    expect(unlockBrailleLabelNl("'", "nl")).toBe("Nieuw teken: apostrof '");
  });
});

describe("★★★ O-NL: mehrere Einheiten in einer Ansage - alle genannt", () => {
  it("es gibt solche Sprossen (sonst misst der Wächter nichts)", () => {
    expect(mehrfachSprossen().length).toBeGreaterThan(0);
  });

  for (const layout of TASTATUREN)
    it(`Tastatur ${layout}: jede Sprosse mit mehreren neuen Einheiten, Kind und sachlich`, () => {
      setLayout(layout);
      const sprossen = [...mehrfachSprossen(), ["f", "j", "d"], ["1", "2", "3"]];
      for (const neu of sprossen)
        for (const sober of [false, true]) {
          const satz = unlockSpeechAlleNl(neu, sober, "nl");
          expect(regelBrueche(satz), satz).toEqual([]);
          let ab = -1;
          for (const u of neu) {
            const kopf = gesprochenerKopf(u);
            const i = satz.indexOf(kopf);
            expect(i, `${layout} ${u} fehlt: ${satz}`).toBeGreaterThan(ab);
            ab = i;
          }
          // Der Vorspann zählt alle auf („… en …"), danach je Einheit ihr Griff.
          expect(satz.split(". ")[0], satz).toContain(" en ");
          expect(satz.match(/Op de toets|druk op|Druk/g)?.length ?? 0, satz).toBeGreaterThanOrEqual(neu.length);
        }
    });
});

describe("★★★ O-NL: die Feier (UnlockCelebration, Bedienung „nl\") spricht genau diese Ansage", () => {
  it("eine Einheit und ein Paar", () => {
    setLayout("nl-intl");
    for (const [unit, mit] of [["r", []], ["(", [")"]]] as const) {
      vi.useFakeTimers();
      vi.mocked(speakUi).mockClear();
      render(createElement(UnlockCelebration, { unit, mit: [...mit], lernweg: "nl", skin: "kind", onClose: () => {} }));
      vi.advanceTimersByTime(1000);
      const gesprochen = vi.mocked(speakUi).mock.calls.map((c) => String(c[0])).join(" ");
      expect(gesprochen).toContain(unlockSpeechAlleNl([unit, ...mit], false, "nl"));
      cleanup();
      vi.useRealTimers();
    }
  });
});

describe("GEGENPROBE: die Regeln finden ihren Gegenfall", () => {
  it("englischer Rest, deutscher Rest, Zahl mit Punkt, zwei „!\"", () => {
    expect(regelBrueche("Op de toets R: left index finger, top row.")).not.toEqual([]);
    expect(regelBrueche("Druk op de Taste R.")).not.toEqual([]);
    expect(regelBrueche("Op de toets 5.")).not.toEqual([]);
    expect(regelBrueche("Goed! Super!")).not.toEqual([]);
    expect(regelBrueche("Op de toets vijf: linkerwijsvinger, cijferrij.")).toEqual([]);
  });
});
