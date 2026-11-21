/**
 * ★★★ WÄCHTER O-INHALT-PT/BR/SV (29.10.2026): die Freischalt-Feier in den Bedienungen „pt", „br", „sv" ist EIGEN - Karte,
 * Braillezeilen-Meldung und Ansage (Vorbild K3 `tastenflow-k3-feier-jede-bedienung-jeder-weg`, dort nur de/en/fr/es).
 *
 * Für jede der drei Bedienungen × den eigenen Weg und die Wege de/en × die Tastatur des Weges und `us` × JEDE Einheit der Reihenfolge:
 * kein englischer Satz, kein Satzzeichen/Sonderzeichen als „Buchstabe", jede Totaste nennt alle ihre Vokale und nie die Leertaste,
 * Ziffern in der Ansage als Wort, nur Bindestrich, höchstens ein „!" je Satz. Dazu die gerenderte Karte (Verdrahtung im Verteiler).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";

const bedien = vi.hoisted(() => ({ sprache: "pt" as "pt" | "br" | "sv" }));

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
import { charAccess } from "@/lib/typing/fingers";
import { SHIFT_UNIT, introOrder, istTotastenEinheit, totastenVokale, unitKindImWeg, unlockSpeechAlle, type UnlockInfo } from "@/lib/typing/letters";
import { setLayout, type LayoutId } from "@/lib/typing/layouts";
import type { Lernweg } from "@/lib/typing/lernweg";
import { unlockBrailleLabelPt, unlockInfoPt, unlockSpeechAllePt } from "@/lib/typing/freischaltungPt";
import { unlockBrailleLabelBr, unlockInfoBr, unlockSpeechAlleBr } from "@/lib/typing/freischaltungBr";
import { unlockBrailleLabelSv, unlockInfoSv, unlockSpeechAlleSv } from "@/lib/typing/freischaltungSv";

interface Satz {
  sprache: "pt" | "br" | "sv";
  info: (u: string, w?: Lernweg) => UnlockInfo;
  braille: (u: string, w?: Lernweg) => string;
  ansage: (u: readonly string[], sober: boolean, w?: Lernweg) => string;
  buchstabe: RegExp;
  leertaste: RegExp;
  tastatur: LayoutId;
  /** Wörter, die in der Sprache nichts verloren haben (englischer oder fremder Rest). */
  fremd: RegExp;
}

const SAETZE: readonly Satz[] = [
  { sprache: "pt", info: unlockInfoPt, braille: unlockBrailleLabelPt, ansage: unlockSpeechAllePt, buchstabe: /\bletra\b/, leertaste: /barra de espaço/,
    tastatur: "pt", fremd: /\b(letter|key|Unlocked|Well done|the|você|aperte|segure|fileira|tela)\b/ },
  { sprache: "br", info: unlockInfoBr, braille: unlockBrailleLabelBr, ansage: unlockSpeechAlleBr, buchstabe: /\bletra\b/, leertaste: /barra de espaço/,
    tastatur: "br-abnt2", fremd: /\b(letter|key|Unlocked|Well done|the|ti|prime|premida|fila|ecrã)\b/ },
  { sprache: "sv", info: unlockInfoSv, braille: unlockBrailleLabelSv, ansage: unlockSpeechAlleSv, buchstabe: /\bbokstav(en)?\b/, leertaste: /mellanslag/,
    tastatur: "sv", fremd: /\b(letter|key|Unlocked|Well done|the|Shift)\b/ },
];

const STRICH = new RegExp(`[${String.fromCharCode(0x2013)}${String.fromCharCode(0x2014)}]`);
const keinBuchstabe = (u: string) => u !== SHIFT_UNIT && u.toUpperCase() === u.toLowerCase() && !/^\d$/.test(u);

function fehler(s: Satz, u: string, weg: Lernweg): string[] {
  const out: string[] = [];
  const info = s.info(u, weg);
  const braille = s.braille(u, weg);
  const satz = s.ansage([u], false, weg);
  const ruhig = s.ansage([u], true, weg);
  const alle = [info.noun, info.name, info.howTo, braille, satz, ruhig];
  for (const t of alle) {
    if (STRICH.test(t)) out.push(`Strich „${t}"`);
    if ((t.match(/!/g) ?? []).length > 1) out.push(`!! „${t}"`);
    if (s.fremd.test(t)) out.push(`fremd „${t}"`);
    if (/\d\.$/.test(t.trim()) || /\d\. /.test(t)) out.push(`Ziffer mit Punkt „${t}"`);
  }
  if (satz === unlockSpeechAlle([u], false, "en", weg)) out.push(`englisch „${satz}"`);
  const kopf = satz.split(/[.!] /)[1] ?? satz;
  if (keinBuchstabe(u) && !istTotastenEinheit(u, weg)) {
    if (s.buchstabe.test(info.noun)) out.push(`Karte „${info.noun} ${info.name}"`);
    if (s.buchstabe.test(braille)) out.push(`Braille „${braille}"`);
    if (s.buchstabe.test(kopf)) out.push(`Ansage „${satz}"`);
    if (info.name === u) out.push(`Name ist nur das Zeichen „${u}"`);
  }
  if (istTotastenEinheit(u, weg)) {
    const vokale = totastenVokale(u, weg);
    if (charAccess(u)?.dead && vokale.length > 0) {
      if (s.leertaste.test(satz)) out.push(`Totaste mit Leertaste „${satz}"`);
      for (const v of vokale) if (!satz.includes(v)) out.push(`Vokal ${v} fehlt „${satz}"`);
    }
  }
  if (unitKindImWeg(u, weg) === "ziffer" && new RegExp(`: ${u}\\.`).test(satz)) out.push(`Ziffer nicht als Wort „${satz}"`);
  return out.map((f) => `${s.sprache}/${weg} ${u}: ${f}`);
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.mocked(speakUi).mockClear();
  setLayout("de");
});

describe.each(SAETZE)("Freischalt-Feier in der Bedienung $sprache", (s) => {
  for (const weg of [s.sprache, "de", "en"] as Lernweg[]) {
    it(`Weg ${weg}: jede Einheit, auf der Tastatur des Weges und auf us`, () => {
      const alle: string[] = [];
      let geprueft = 0;
      for (const lay of [weg === s.sprache ? s.tastatur : weg === "de" ? "de" : "us", "us"] as LayoutId[]) {
        setLayout(lay);
        for (const u of introOrder(weg)) {
          geprueft++;
          alle.push(...fehler(s, u, weg).map((f) => `${lay} ${f}`));
        }
      }
      expect(geprueft).toBeGreaterThan(80);
      expect(alle.slice(0, 10), `${alle.length} Funde`).toEqual([]);
    });
  }

  it("mehrere Einheiten auf einmal: alle genannt, mit „e\"/„och\" verbunden", () => {
    setLayout(s.tastatur);
    const satz = s.ansage(["c", "p"], false, s.sprache);
    const und = s.sprache === "sv" ? " och " : " e ";
    expect(satz).toContain(und);
    expect((satz.match(/\bC\b/g) ?? []).length).toBeGreaterThanOrEqual(1);
    expect((satz.match(/\bP\b/g) ?? []).length).toBeGreaterThanOrEqual(1);
  });

  it("die gerenderte Karte und die Ansage kommen aus der eigenen Fassung (Verteiler UnlockCelebration)", () => {
    setLayout(s.tastatur);
    bedien.sprache = s.sprache;
    vi.useFakeTimers();
    const { container } = render(<UnlockCelebration unit="." mit={[]} lernweg={s.sprache} skin="kind" onClose={() => {}} />);
    vi.advanceTimersByTime(1000);
    const gesprochen = vi.mocked(speakUi).mock.calls.map((c) => String(c[0])).join(" ");
    const karte = container.querySelector(".tt-celebrate-card")?.textContent ?? "";
    const alarm = container.querySelector("[role=alert]")?.textContent ?? "";
    const info = s.info(".", s.sprache);
    expect(karte).toContain(`${info.noun} ${info.name}`);
    expect(alarm).toContain(s.braille(".", s.sprache));
    expect(gesprochen).toContain(s.ansage(["."], false, s.sprache).split(". ")[0]);
  });
});

describe("Gegenprobe: der Wächter fände die englische Feier", () => {
  it("englische Sätze fallen auf", () => {
    setLayout("us");
    const en = unlockSpeechAlle(["."], false, "en", "en");
    expect(SAETZE[0].fremd.test(en) || SAETZE[2].fremd.test(en)).toBe(true);
  });
});
