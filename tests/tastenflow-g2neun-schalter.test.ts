/**
 * ★★ G2-NEUN (25.10.2026): die Schalter der neun Lernwege des Gerüsts (bg, el, hu, nl, pt, br, ro, sv, uk).
 *
 * ★ Seit der Freigabe 06.11.2026 VORGABE AN (Not-Aus-Polung wie it/pl/tr/cs): `?<sprache>-lehrgang=0` schaltet auf dem
 * Gerät aus, `=1` wieder an, die Einstiegsadresse (`/bg` … `/pt-br`) wirkt wie `=1`. Die Tests unten, die den Schalter als
 * Parameter übergeben (`geruestLehrgangAn: {…}`), prüfen weiter: ohne den Schalter der Sprache erreicht nichts diese Sprache.
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  GERUEST_EINSTIEGSADRESSEN,
  GERUEST_EINSTIEGSPFADE,
  GERUEST_LEHRGAENGE,
  GERUEST_LEHRGANG_SCHALTER,
  geruestLehrgangProbeAn,
  geruestLehrgangProben,
  neueLehrgangProben,
  type GeruestLehrgang,
} from "../src/lib/typing/lehrgangSchalter";
import { bestimmeLernweg } from "../src/lib/typing/lernweg";
import {
  adressWahlLesen,
  erkenneBedienSprache,
  gespeicherteWahlRoh,
  istTastenflowMerker,
  wahlMerken,
} from "../src/lib/bedienSprache/sprache";
import { GERUEST_SPRACHEN } from "../src/lib/typing/sprachRegister";
import { angeboteneWege } from "../src/components/typing/WegJeKind";
import { bereichsart } from "../src/features/public/TastenflowSprachBereich";

const NAMEN: Record<GeruestLehrgang, string> = {
  bg: "bulgarisch", el: "griechisch", hu: "ungarisch", nl: "niederlaendisch", pt: "portugiesisch",
  br: "brasilianisch", ro: "rumaenisch", sv: "schwedisch", uk: "ukrainisch",
};

beforeEach(() => {
  window.localStorage.clear();
});

describe("G2-NEUN: die neun Schalter", () => {
  it("dieselben neun wie im Sprachregister, mit deutschem Namen wie die bestehenden Schalter", () => {
    expect([...GERUEST_LEHRGAENGE]).toEqual([...GERUEST_SPRACHEN]);
    for (const l of GERUEST_LEHRGAENGE) {
      expect(GERUEST_LEHRGANG_SCHALTER[l].adresse).toBe(`${NAMEN[l]}-lehrgang`);
      expect(GERUEST_LEHRGANG_SCHALTER[l].merker).toBe(`tastenflow-${NAMEN[l]}-lehrgang`);
    }
  });

  for (const l of ["bg", "el", "hu", "nl", "pt", "br", "ro", "sv", "uk"] as const) {
    const { adresse, merker } = GERUEST_LEHRGANG_SCHALTER[l];
    it(`${l}: Vorgabe AN; ?${adresse}=0 aus (gemerkt, Not-Aus), =1 wieder an`, () => {
      expect(geruestLehrgangProbeAn(l, "", "/")).toBe(true);
      expect(geruestLehrgangProbeAn(l, `?${adresse}=0`, "/")).toBe(false);
      expect(window.localStorage.getItem(merker)).toBe("0");
      expect(geruestLehrgangProbeAn(l, "", "/")).toBe(false);
      expect(geruestLehrgangProbeAn(l, `?${adresse}=1`, "/")).toBe(true);
      expect(geruestLehrgangProbeAn(l, "", "/")).toBe(true);
    });
    it(`${l}: der Merker zählt NICHT als „Gerät kennt Tastenflow"; ein anderer Schalter schaltet ihn nie mit`, () => {
      expect(istTastenflowMerker(merker)).toBe(false);
      for (const andere of GERUEST_LEHRGAENGE) {
        if (andere === l) continue;
        geruestLehrgangProbeAn(andere, `?${GERUEST_LEHRGANG_SCHALTER[andere].adresse}=0`, "/");
      }
      expect(geruestLehrgangProbeAn(l, "", "/")).toBe(true);
    });
  }

  it("die Einstiegsadresse schaltet den Lehrgang an (wie /cs); ein ausdrückliches =0 geht vor", () => {
    expect(GERUEST_EINSTIEGSADRESSEN.br.test("/pt-br")).toBe(true);
    expect(GERUEST_EINSTIEGSADRESSEN.br.test("/br")).toBe(false);
    expect(GERUEST_EINSTIEGSADRESSEN.bg.test("/BG/")).toBe(true);
    for (const l of GERUEST_LEHRGAENGE) {
      const { adresse, merker } = GERUEST_LEHRGANG_SCHALTER[l];
      window.localStorage.setItem(merker, "0");
      expect(geruestLehrgangProbeAn(l, "", GERUEST_EINSTIEGSPFADE[l])).toBe(true);
      expect(window.localStorage.getItem(merker)).toBe("1");
      expect(geruestLehrgangProbeAn(l, `?${adresse}=0`, GERUEST_EINSTIEGSPFADE[l])).toBe(false);
    }
    // die Adresse einer Sprache schaltet nie eine andere ein
    window.localStorage.setItem(GERUEST_LEHRGANG_SCHALTER.sv.merker, "0");
    expect(geruestLehrgangProbeAn("sv", "", "/bg")).toBe(false);
  });

  it("gesperrter Speicher: kein Absturz, Vorgabe an; =0 in der Adresse wirkt trotzdem", () => {
    const echt = Object.getOwnPropertyDescriptor(window, "localStorage")!;
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      get() {
        throw new Error("gesperrt");
      },
    });
    try {
      expect(geruestLehrgangProbeAn("uk", "", "/")).toBe(true);
      expect(geruestLehrgangProbeAn("uk", "?ukrainisch-lehrgang=0", "/")).toBe(false);
    } finally {
      Object.defineProperty(window, "localStorage", echt);
    }
  });

  it("neueLehrgangProben trägt die neun Schalter mit (alle an)", () => {
    const p = neueLehrgangProben("", "/");
    expect(p.geruestLehrgangAn).toEqual(Object.fromEntries(GERUEST_LEHRGAENGE.map((l) => [l, true])));
    expect(geruestLehrgangProben("?schwedisch-lehrgang=0", "/").sv).toBe(false);
  });
});

describe("G2-NEUN: ohne Schalter erreicht nichts die neun Sprachen", () => {
  it('bestimmeLernweg: Bedienung bg ohne Schalter ⇒ „de"; mit ⇒ „bg"; br ⇒ „br"', () => {
    const basis = { gespeichert: null, lehrgangProbeAn: true } as const;
    for (const l of GERUEST_LEHRGAENGE) {
      expect(bestimmeLernweg({ ...basis, bedienSprache: l })).toBe("de");
      expect(bestimmeLernweg({ ...basis, bedienSprache: l, geruestLehrgangAn: { [l]: true } })).toBe(l);
      // ein anderer Schalter hilft nicht
      const anderer = GERUEST_LEHRGAENGE.find((x) => x !== l)!;
      expect(bestimmeLernweg({ ...basis, bedienSprache: l, geruestLehrgangAn: { [anderer]: true } })).toBe("de");
    }
    // ein gespeicherter Weg gewinnt
    expect(bestimmeLernweg({ ...basis, gespeichert: "uk", bedienSprache: "de" })).toBe("uk");
  });

  it("keine Browsersprache wählt eine der neun", () => {
    for (const code of ["bg", "el-GR", "hu", "nl-BE", "pt-PT", "pt-BR", "ro", "sv-FI", "uk-UA"]) {
      expect(erkenneBedienSprache([code], true, true)).toBe("en");
    }
  });

  it("?bedienung=bg und /bg … /pt-br wirken NUR mit dem Schalter der Sprache", () => {
    for (const l of GERUEST_LEHRGAENGE) {
      window.localStorage.clear();
      expect(adressWahlLesen(`?bedienung=${l}`, "/", false, false, {})).toBeNull();
      expect(adressWahlLesen("", GERUEST_EINSTIEGSPFADE[l], false, false, {})).toBeNull();
      expect(adressWahlLesen(`?bedienung=${l}`, "/", false, false, { [l]: true })).toBe(l);
      window.localStorage.clear();
      expect(adressWahlLesen("", GERUEST_EINSTIEGSPFADE[l], false, false, { [l]: true })).toBe(l);
    }
    expect(adressWahlLesen("", "/pt-br", false, false, { pt: true })).toBeNull();
  });

  it("eine gemerkte Wahl „bg\" wird gelesen (ob sie gilt, entscheidet der Provider mit dem Schalter)", () => {
    wahlMerken("bg");
    expect(gespeicherteWahlRoh()).toBe("bg");
  });

  it("Weg je Kind: die neun stehen nur mit ihrem Schalter (oder wenn das Kind schon dort steht) im Feld", () => {
    expect(angeboteneWege(null, true, {})).toEqual(["de", "en", "fr", "es"]);
    expect(angeboteneWege(null, true, { nl: true })).toContain("nl");
    expect(angeboteneWege("ro", true, {})).toContain("ro");
    expect(angeboteneWege(null, true, { nl: true })).not.toContain("ro");
  });

  it("die neun Adressen gehören zu Tastenflow (unter tastenflow.org), sonst sind sie fremd", () => {
    for (const p of Object.values(GERUEST_EINSTIEGSPFADE)) {
      expect(bereichsart(p, "", true)).toBe("tastenflow");
      expect(bereichsart(p, "", false)).toBe("fremd");
    }
  });
});
