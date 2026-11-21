/**
 * ★★★★★ WÄCHTER (ES-M2, 27.09.2026, Prüfbericht ES-P2 M1 und S5):
 * DIE FREISCHALT-FEIER STELLT JEDE NEUE EINHEIT VOR.
 *
 * Befund M1: Seit ¿/? und ¡/! gemeinsam kommen (`paareGemeinsam`), nahmen
 * `AdaptiveTrainer` und `SerienTrainer` für die Feier nur
 * `grown[grown.length - 1]` - „?" wurde gefeiert, „¿" nie vorgestellt (auf
 * es und latam liegen die beiden VERTAUSCHT). Befund S5: Die Totasten-Einheit
 * „´" hiess „la letra tilde" und lehrte „luego la barra espaciadora".
 *
 * Geprüft über die FEHLERKLASSE, nicht über die zwei Paare:
 *  1. Jede Sprosse JEDES Weges auf JEDER seiner Tastaturen, an der mehr als
 *     eine Einheit zugleich wächst: Karte, Braillezeile und Ansage nennen
 *     jede davon (samt Gegenprobe mit der alten Übergabe „nur die letzte").
 *  2. Jede Totasten-Einheit jedes Weges (`istTotastenEinheit`): die Ansage
 *     nennt Vokale, keine Leertaste, und heisst nicht „Buchstabe" (samt
 *     Gegenprobe ohne Weg - die alte Ansage).
 *  3. Eine Einheit allein: `unlockSpeechAlle` ist Zeichen für Zeichen
 *     `unlockSpeech` - an einer gewöhnlichen Sprosse ändert sich nichts.
 *  4. Beide Trainer übergeben alle neuen Einheiten (Quelltext-Wächter: kein
 *     `grown[grown.length - 1]` als Feier mehr).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const bedien = vi.hoisted(() => ({ sprache: "es" as "de" | "en" | "fr" | "es" }));

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
  advanceIntroduced,
  charAccess,
  introOrder,
  istTotastenEinheit,
  neuFreigeschaltet,
  totastenVokale,
  unitLabel,
  unitLabelEn,
  unitLabelEs,
  unitLabelFr,
  unlockSpeech,
  unlockSpeechAlle,
} from "@/lib/typing";
import {
  FRANZOESISCHE_LAYOUT_IDS,
  SPANISCHE_LAYOUT_IDS,
  setLayout,
  type LayoutId,
} from "@/lib/typing/layouts";
import { LERNWEGE_LISTE, type Lernweg } from "@/lib/typing/lernweg";
import { mitRueckfallEn } from "../src/lib/typing/sprachRegister";
import { spokenLabel } from "@/lib/typing/fingers";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.mocked(speakUi).mockClear();
  setLayout("de");
});

/** Die Tastaturen, auf denen ein Weg geübt wird. */
const TASTATUREN: Record<Lernweg, readonly LayoutId[]> = {
  de: ["de", "ch"],
  en: ["us", "uk"],
  fr: [...FRANZOESISCHE_LAYOUT_IDS],
  es: [...SPANISCHE_LAYOUT_IDS],
  // RÜCKFALL-EN (G2a): it, pl, tr, cs zeigen vorerst Englisch.
  it: ["us", "uk"],
  pl: ["us", "uk"],
  tr: ["us", "uk"],
  cs: ["us", "uk"],
  // RÜCKFALL-EN (G2-NEUN): bg, el, hu, nl, pt, br, ro, sv, uk zeigen vorerst Englisch.
  bg: ["us", "uk"],
  el: ["us", "uk"],
  hu: ["us", "uk"],
  nl: ["us", "uk"],
  pt: ["us", "uk"],
  br: ["us", "uk"],
  ro: ["us", "uk"],
  sv: ["us", "uk"],
  uk: ["us", "uk"],
};
/** Die Sprache der Bedienung, die zu einem Weg gehört. */
const SPRACHE: Record<Lernweg, "de" | "en" | "fr" | "es"> = /* RÜCKFALL-EN (G2-NEUN) */ mitRueckfallEn({ de: "de", en: "en", fr: "fr", es: "es", it: "en", pl: "en", tr: "en", cs: "en" /* RÜCKFALL-EN (G2a) */ });
const NAME = { de: unitLabel, en: unitLabelEn, fr: unitLabelFr, es: unitLabelEs } as const;
/**
 * ★ F4-PT-BR-SV (25.10.2026): der Name einer Einheit, wie die Feier ihn sagt. Kennt die Namenstabelle das Zeichen nicht (sie gibt das
 * nackte Zeichen zurück - `«` `»` des Weges „pt" in der englischen Rückfall-Bedienung), nennt die Feier den Zeichennamen.
 */
const nameIn = (weg: Lernweg, u: string): string => {
  const roh = NAME[SPRACHE[weg]](u);
  return roh === u ? spokenLabel(u, SPRACHE[weg]) : roh;
};

/** Alle Sprossen, an denen mehr als eine Einheit zugleich wächst. */
function mehrfachSprossen(weg: Lernweg): { vorher: string[]; neu: string[] }[] {
  const o = introOrder(weg);
  const out: { vorher: string[]; neu: string[] }[] = [];
  for (let i = 1; i < o.length; i++) {
    const vorher = o.slice(0, i);
    const neu = neuFreigeschaltet(vorher, advanceIntroduced(vorher, {}, weg, undefined, 99));
    if (neu.length > 1) out.push({ vorher, neu });
  }
  return out;
}

/** Was die Karte zeigt, auf die Braillezeile schiebt und spricht. */
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
  const dialog = container.querySelector("[role=dialog]")?.getAttribute("aria-label") ?? "";
  cleanup();
  vi.useRealTimers();
  return { gesprochen, alarm, karte, dialog };
}

describe("M1: jede Sprosse mit mehreren neuen Einheiten wird ganz gefeiert", () => {
  it("es gibt solche Sprossen (sonst misst der Wächter nichts)", () => {
    // ★ D1 Nr. 19 (28.09.2026): dazu auf JEDEM Weg die Klammern als Paar.
    expect(mehrfachSprossen("es").map((s) => s.neu)).toEqual([
      ["¿", "?"],
      ["¡", "!"],
      ["(", ")"],
      ["[", "]"],
      ["{", "}"],
    ]);
    for (const weg of ["de", "en", "fr"] as const) {
      expect(mehrfachSprossen(weg).map((s) => s.neu), weg).toEqual([
        ["(", ")"],
        ["[", "]"],
        ["{", "}"],
      ]);
    }
  });

  for (const weg of LERNWEGE_LISTE) {
    for (const layout of TASTATUREN[weg]) {
      it(`Weg ${weg}, Tastatur ${layout}: Karte, Braillezeile und Ansage nennen jede neue Einheit`, () => {
        setLayout(layout);
        bedien.sprache = SPRACHE[weg];
        for (const { neu } of mehrfachSprossen(weg)) {
          const f = feiere(neu[0], neu.slice(1), weg);
          for (const u of neu) {
            const name = nameIn(weg, u);
            expect(f.gesprochen, `${weg}/${layout} ${u}`).toContain(name);
            expect(f.alarm, `${weg}/${layout} ${u}`).toContain(u);
            expect(f.karte, `${weg}/${layout} ${u}`).toContain(name);
            expect(f.dialog, `${weg}/${layout} ${u}`).toContain(name);
          }
          // Das öffnende Zeichen zuerst.
          const namen = neu.map((u) => nameIn(weg, u));
          expect(f.gesprochen.indexOf(namen[0])).toBeLessThan(f.gesprochen.indexOf(namen[1]));
        }
      });
    }
  }

  it("GEGENPROBE: die alte Übergabe (nur die letzte Einheit) fällt durch", () => {
    setLayout("es");
    bedien.sprache = "es";
    const [{ neu }] = mehrfachSprossen("es");
    const f = feiere(neu[neu.length - 1], [], "es");
    expect(f.gesprochen).not.toContain(unitLabelEs(neu[0]));
    expect(f.alarm).not.toContain(neu[0]);
  });

  it("eine Einheit allein: unlockSpeechAlle ist unlockSpeech, Zeichen für Zeichen (alle Wege, alle Sprachen)", () => {
    for (const weg of LERNWEGE_LISTE) {
      setLayout(TASTATUREN[weg][0]);
      for (const u of introOrder(weg))
        for (const lang of ["de", "en", "fr", "es"] as const)
          for (const sober of [false, true])
            expect(unlockSpeechAlle([u], sober, lang, weg)).toBe(unlockSpeech(u, sober, lang, weg));
    }
  });

  it("Quelltext: beide Trainer feiern alle neuen Einheiten, nicht nur die letzte", () => {
    for (const datei of ["AdaptiveTrainer.tsx", "SerienTrainer.tsx"]) {
      const q = readFileSync(resolve(__dirname, "../src/components/typing", datei), "utf-8");
      // ★ 02.10.2026: Im AdaptiveTrainer steht die Feier in EINER Funktion
      // (`feiereNeueTaste`), die Runde UND der Einstieg nach einem Match
      // gemeinsam benutzen - dort heissen die Argumente vorher/nachher.
      expect(q, datei).toMatch(/neuFreigeschaltet\((introCur, grown|vorher, nachher)\)/);
      expect(q, datei).toMatch(/mit=\{justUnlocked\?\.slice\(1\)\}/);
      expect(q, datei).toMatch(/lernweg=\{/);
      expect(q, datei).not.toMatch(/setJustUnlocked\(grown\[grown\.length - 1\]\)/);
    }
  });
});

describe("S5: Totasten-Einheiten lehren Totaste + Vokal", () => {
  const LEER = /barra espaciadora|touche espace|Leertaste|space bar/;
  const BUCHSTABE = /\b(letra|lettre)\b/;

  it("es gibt Totasten-Einheiten auf den Wegen fr und es, keine auf de und en", () => {
    const je = Object.fromEntries(
      LERNWEGE_LISTE.map((w) => [w, introOrder(w).filter((u) => istTotastenEinheit(u, w))]),
    );
    // ★ F4 (02.10.2026): it und pl lehren keine Totaste; Türkisch `^` (â î û), Tschechisch Háček, Čárka und Trema (`ˇ ´ ¨`).
    // ★ G2-NEUN (25.10.2026): die neun Wege des Gerüsts sind ein Alias von „en" - keine Totaste.
    // ★ F4-PT-BR-SV (25.10.2026): pt und br lehren Tilde, Akut, Zirkumflex, Gravis (br den Zirkumflex früher), sv den Akut (é).
    // ★ SPRACHEN-9 (29.10.2026): el (Tonos, Dialytika, beide zusammen) und nl (Apostroph = Akut auf nl-intl) seit F4.
    expect(je).toEqual({ de: [], en: [], fr: ["^", "¨"], es: ["´", "¨"], it: [], pl: [], tr: ["^"], cs: ["ˇ", "´", "¨"], bg: [], el: ["΄", "¨", "΅"], hu: [], nl: ["'"], pt: ["~", "´", "^", "`"], br: ["~", "´", "^", "`"], ro: [], sv: ["´"], uk: [] });
  });

  for (const weg of LERNWEGE_LISTE) {
    for (const layout of TASTATUREN[weg]) {
      it(`Weg ${weg}, Tastatur ${layout}`, () => {
        setLayout(layout);
        const lang = SPRACHE[weg];
        for (const u of introOrder(weg).filter((x) => istTotastenEinheit(x, weg))) {
          const vokale = totastenVokale(u, weg);
          const satz = unlockSpeech(u, false, lang, weg);
          expect(satz, `${weg}/${layout} ${u}`).not.toMatch(BUCHSTABE);
          if (!charAccess(u)?.dead || vokale.length === 0) continue; // ca-fr „¨": keine Totaste dort
          expect(satz, `${weg}/${layout} ${u}`).not.toMatch(LEER);
          for (const v of vokale) expect(satz, `${weg}/${layout} ${u}`).toContain(v);
        }
      });
    }
  }

  it("Spanisch „¨“: nur ü, nicht ë ï ÿ", () => {
    for (const l of SPANISCHE_LAYOUT_IDS) {
      setLayout(l);
      expect(totastenVokale("¨", "es")).toEqual(["ü"]);
    }
  });

  it("GEGENPROBE: ohne Weg ist es die alte Ansage mit Leertaste und „letra“", () => {
    setLayout("es");
    const alt = unlockSpeech("´", false, "es");
    expect(alt).toMatch(LEER);
    expect(alt).toMatch(BUCHSTABE);
  });

  it("Weg „de“: „^“ bleibt ein Sonderzeichen mit Leertaste (unverändert)", () => {
    setLayout("de");
    expect(istTotastenEinheit("^", "de")).toBe(false);
    expect(unlockSpeech("^", false, "de", "de")).toBe(unlockSpeech("^", false, "de"));
    expect(unlockSpeech("^", false, "de", "de")).toMatch(/Leertaste/);
  });

  it("„¿“ und „¡“ heissen auf Weg „es“ Satzzeichen, nicht „letra“", () => {
    for (const l of SPANISCHE_LAYOUT_IDS) {
      setLayout(l);
      for (const u of ["¿", "¡", "_"]) expect(unlockSpeech(u, false, "es", "es")).not.toMatch(BUCHSTABE);
      expect(unlockSpeech("¿", false, "es", "es")).toContain("el signo de apertura de interrogación");
      expect(unlockSpeech("¿", false, "es", "es")).not.toMatch(/signo de puntuación signo/);
    }
  });
});
