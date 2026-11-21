/**
 * ★★★★ WÄCHTER K3 (28.09.2026, Auftrag „vier Reste", Befund ES-M2 §4):
 * DIE FREISCHALT-FEIER KENNT DEN WEG - IN JEDER BEDIENUNGSSPRACHE.
 *
 * Befund: `unitKindImWeg` war nur in der französischen und spanischen Feier
 * verdrahtet. Weg „es" mit deutscher Bedienung: „Freigeschaltet: der Buchstabe
 * umgekehrtes Fragezeichen" (Karte „der Buchstabe ¿"), die Totaste „´" „der
 * Buchstabe Akzent. Erst die Akzent, dann die Leertaste."; Weg „fr" mit
 * englischer Bedienung: „the special character caret. First the caret key,
 * then the space bar."; Weg „en" mit deutscher Bedienung: „der Buchstabe Pfund".
 *
 * Geprüft über die FEHLERKLASSE: jede Bedienungssprache × jeder Weg × jede
 * Tastatur des Weges × jede Einheit des Weges - Karte, Braillezeile und
 * Ansage. Ein Zeichen ohne Gross-/Kleinform heisst nie „Buchstabe/letter/
 * lettre/letra" und nie nur sich selbst; eine Totasten-Einheit lehrt die
 * Vokale, nicht die Leertaste. Dazu die gerenderte Karte für zwei Fälle des
 * Befunds. Gegenprobe: ohne Weg (die alte Verdrahtung) findet der Wächter
 * genau die gemeldeten Fehler.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";

const bedien = vi.hoisted(() => ({ sprache: "de" as "de" | "en" | "fr" | "es" }));

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
import {
  charAccess,
  introOrder,
  istTotastenEinheit,
  totastenVokale,
  unlockBrailleLabel,
  unlockBrailleLabelEn,
  unlockBrailleLabelEs,
  unlockBrailleLabelFr,
  unlockInfo,
  unlockInfoEn,
  unlockInfoEs,
  unlockInfoFr,
  unlockSpeech,
  type UnlockInfo,
} from "@/lib/typing";
import { SHIFT_UNIT, unitKind, unitKindImWeg } from "@/lib/typing/letters";
import { FRANZOESISCHE_LAYOUT_IDS, SPANISCHE_LAYOUT_IDS, setLayout, type LayoutId } from "@/lib/typing/layouts";
import { LERNWEGE_LISTE, type Lernweg } from "@/lib/typing/lernweg";
import { istBuchstabe, sprachBeschreibung } from "@/lib/typing/sprachRegister";

type Sprache = "de" | "en" | "fr" | "es";
const BEDIENUNG: Sprache[] = ["de", "en", "fr", "es"];
const TASTATUREN: Record<Lernweg, readonly LayoutId[]> = {
  de: ["de", "ch", "us", "uk"],
  en: ["us", "uk", "de", "ch"],
  fr: [...FRANZOESISCHE_LAYOUT_IDS],
  es: [...SPANISCHE_LAYOUT_IDS],
  // RÜCKFALL-EN (G2a): it, pl, tr, cs zeigen vorerst Englisch.
  it: ["us", "uk", "de", "ch"],
  pl: ["us", "uk", "de", "ch"],
  tr: ["us", "uk", "de", "ch"],
  cs: ["us", "uk", "de", "ch"],
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  bg: ["us", "uk", "de", "ch"],
  el: ["us", "uk", "de", "ch"],
  hu: ["us", "uk", "de", "ch"],
  nl: ["us", "uk", "de", "ch"],
  pt: ["us", "uk", "de", "ch"],
  br: ["us", "uk", "de", "ch"],
  ro: ["us", "uk", "de", "ch"],
  sv: ["us", "uk", "de", "ch"],
  uk: ["us", "uk", "de", "ch"],
};
const INFO: Record<Sprache, (u: string, w?: Lernweg) => UnlockInfo> = {
  de: unlockInfo,
  en: unlockInfoEn,
  fr: unlockInfoFr,
  es: unlockInfoEs,
};
const BRAILLE: Record<Sprache, (u: string, w?: Lernweg) => string> = {
  de: unlockBrailleLabel,
  en: unlockBrailleLabelEn,
  fr: unlockBrailleLabelFr,
  es: unlockBrailleLabelEs,
};
const BUCHSTABE: Record<Sprache, RegExp> = {
  de: /\bBuchstaben?\b/,
  en: /\bletter\b/i,
  fr: /\blettre\b/i,
  es: /\bletra\b/i,
};
const LEER = /barra espaciadora|touche espace|Leertaste|space bar/;

/** Zeichen ohne Gross-/Kleinform, das keine Ziffer ist - nie ein „Buchstabe". */
const keinBuchstabe = (u: string) => u !== SHIFT_UNIT && u.toUpperCase() === u.toLowerCase() && !/^\d$/.test(u);

/** Fehler der Feier einer Einheit (leer = in Ordnung). `w` undefined = alte Verdrahtung. */
function fehler(u: string, b: Sprache, weg: Lernweg, w: Lernweg | undefined): string[] {
  const out: string[] = [];
  const info = INFO[b](u, w);
  const braille = BRAILLE[b](u, w);
  const satz = unlockSpeech(u, false, b, w);
  const kopf = satz.split(/[.!] /)[1] ?? satz; // „¡Muy bien! Has desbloqueado …" / „Gratulation! Das …"
  if (keinBuchstabe(u)) {
    if (BUCHSTABE[b].test(info.noun)) out.push(`Karte „${info.noun} ${info.name}"`);
    if (BUCHSTABE[b].test(braille)) out.push(`Braille „${braille}"`);
    if (BUCHSTABE[b].test(kopf) && !istTotastenEinheit(u, weg)) out.push(`Ansage „${satz}"`);
    if (info.name === u) out.push(`Name ist nur das Zeichen „${u}"`);
  }
  if (istTotastenEinheit(u, weg)) {
    if (BUCHSTABE[b].test(`${info.noun} ${satz.split(".")[0]}`)) out.push(`Totaste als Buchstabe „${satz}"`);
    const vokale = totastenVokale(u, weg);
    if (charAccess(u)?.dead && vokale.length > 0) {
      if (LEER.test(satz)) out.push(`Totaste mit Leertaste „${satz}"`);
      for (const v of vokale) if (!satz.includes(v)) out.push(`Vokal ${v} fehlt „${satz}"`);
    }
  }
  return out.map((f) => `${b}/${weg} ${u}: ${f}`);
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.mocked(speakUi).mockClear();
  setLayout("de");
});

describe("K3: jede Bedienung × jeder Weg × jede Tastatur × jede Einheit", () => {
  for (const b of BEDIENUNG)
    for (const weg of LERNWEGE_LISTE)
      it(`Bedienung ${b}, Weg ${weg}`, () => {
        const alle: string[] = [];
        let geprueft = 0;
        for (const lay of TASTATUREN[weg]) {
          setLayout(lay);
          for (const u of introOrder(weg)) {
            geprueft++;
            alle.push(...fehler(u, b, weg, weg).map((f) => `${lay} ${f}`));
          }
        }
        expect(geprueft).toBeGreaterThan(100);
        expect(alle.slice(0, 10), `${alle.length} Funde`).toEqual([]);
      });

  it("GEGENPROBE: ohne Weg (die alte Verdrahtung in de/en) findet der Wächter die gemeldeten Fehler", () => {
    setLayout("es");
    expect(fehler("¿", "de", "es", undefined).join(" ")).toMatch(/Buchstabe/);
    expect(fehler("´", "de", "es", undefined).join(" ")).toMatch(/Leertaste/);
    expect(fehler("¿", "en", "es", undefined).join(" ")).toMatch(/letter/);
    setLayout("fr");
    expect(fehler("^", "en", "fr", undefined).join(" ")).toMatch(/space bar/);
    setLayout("uk");
    expect(fehler("£", "de", "en", undefined).join(" ")).toMatch(/Buchstabe/);
  });

  it("die gemeldeten Sätze, jetzt", () => {
    setLayout("es");
    expect(unlockSpeech("¿", true, "de", "es")).toMatch(/^Freigeschaltet: das Satzzeichen umgekehrtes Fragezeichen\./);
    expect(unlockSpeech("´", true, "de", "es")).toBe(
      "Freigeschaltet: die Taste Akzent. Erst die Taste Akzent, dann der Vokal: á, é, í, ó, ú.",
    );
    expect(unlockSpeech("¡", true, "en", "es")).toMatch(/^Unlocked: the inverted exclamation mark\./);
    setLayout("fr");
    expect(unlockSpeech("^", true, "en", "fr")).toBe(
      "Unlocked: the dead key caret. First the caret key, then the vowel: ê, â, î, ô, û.",
    );
    expect(unlockBrailleLabel("^", "fr")).toBe("Neue Taste Dach ^");
    setLayout("uk");
    expect(unlockSpeech("£", true, "de", "en")).toMatch(/^Freigeschaltet: das Sonderzeichen Pfund\./);
  });

  it("jede Einheit, die die deutschen Listen schon richtig einordnen: mit und ohne Weg dieselbe Feier", () => {
    let gleich = 0;
    for (const weg of LERNWEGE_LISTE) {
      setLayout(TASTATUREN[weg][0]);
      for (const u of introOrder(weg)) {
        if (unitKindImWeg(u, weg) !== unitKind(u) || istTotastenEinheit(u, weg)) continue;
        // ★ G2b-1 (02.10.2026): auf Weg „tr“ heissen „i“ und „ı“ in der Feier „İ“ und „I“ (Gross in der
        // Sprache des Weges) - ohne Weg gilt die Tastatur, und eine türkische Tastatur gibt es erst mit
        // der Tastatur-Etappe. Mit ihr (`sprache: "tr"` im Layout) ist die Feier auch ohne Weg gleich.
        if (weg === "tr" && (u === "i" || u === "ı")) continue;
        // ★ F4-it (02.10.2026): seit „it“ eigene Buchstaben hat (à è é ì ò ù), heisst die Taste auf dem Weg „Ò“
        // (Gross in der Sprache des Weges, G2b-1: `alleBuchstaben`), ohne Weg gilt die enge alte Klasse und die
        // Taste bleibt „ò“. Gewollt - dieselbe Ausnahme wie für türkisch „i“/„ı“.
        if (sprachBeschreibung(weg).alleBuchstaben && istBuchstabe(u) && !/^[a-zäöüß]$/.test(u)) continue;
        gleich++;
        for (const b of BEDIENUNG) {
          expect(unlockSpeech(u, false, b, weg), `${b}/${weg} ${u}`).toBe(unlockSpeech(u, false, b));
          expect(INFO[b](u, weg), `${b}/${weg} ${u}`).toEqual(INFO[b](u));
        }
      }
    }
    expect(gleich).toBeGreaterThan(200);
  });
});

describe("K3: die gerenderte Karte", () => {
  function feiere(unit: string, mit: readonly string[], weg: Lernweg) {
    vi.useFakeTimers();
    vi.mocked(speakUi).mockClear();
    const { container } = render(
      <UnlockCelebration unit={unit} mit={mit} lernweg={weg} skin="kind" onClose={() => {}} />,
    );
    vi.advanceTimersByTime(1000);
    const gesprochen = vi.mocked(speakUi).mock.calls.map((c) => String(c[0])).join(" ");
    const alarm = container.querySelector("[role=alert]")?.textContent ?? "";
    const karte = container.querySelector(".tt-celebrate-card")?.textContent ?? "";
    cleanup();
    vi.useRealTimers();
    return { gesprochen, alarm, karte };
  }

  it("Weg es, deutsche Bedienung: ¿ und ? sind Satzzeichen", () => {
    setLayout("es");
    bedien.sprache = "de";
    const f = feiere("¿", ["?"], "es");
    for (const t of [f.gesprochen, f.alarm, f.karte]) expect(t).not.toMatch(/Buchstabe/);
    expect(f.karte).toContain("das Satzzeichen umgekehrtes Fragezeichen");
    expect(f.alarm).toContain("Neues Satzzeichen umgekehrtes Fragezeichen ¿");
  });

  it("Weg fr, englische Bedienung: ^ ist eine Totaste mit Vokalen", () => {
    setLayout("fr");
    bedien.sprache = "en";
    const f = feiere("^", [], "fr");
    expect(f.karte).toContain("the dead key caret");
    expect(f.gesprochen).toContain("then the vowel: ê, â, î, ô, û");
    expect(f.gesprochen).not.toMatch(/space bar/);
  });
});
