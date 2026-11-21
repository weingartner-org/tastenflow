/**
 * ★ 10.10.2026 (Freigabe Italienisch, Polnisch, Türkisch, Tschechisch - Johannes:
 * „wir deployen und hoffen auf rückmeldungen"): die vier Schalter stehen in
 * Not-Aus-Polung wie Englisch, Französisch und Spanisch seit dem 28.09.2026:
 *
 *  · ohne jede Einstellung: AN (Standard);
 *  · `?<sprache>-lehrgang=0` oder Merker "0": AUS (Not-Aus), auf dem Gerät gemerkt;
 *  · `?<sprache>-lehrgang=1` schaltet ein gemerktes Aus wieder an;
 *  · gesperrter Speicher: AN;
 *  · `/it`, `/pl`, `/tr`, `/cs` wirken wie `=1` (und merken es), ein `=0` in derselben
 *    Adresse geht vor; andere Adressen setzen keinen Merker.
 * Jeder Fall für JEDE der vier Sprachen. Muster:
 * `tests/tastenflow-es-adresse-schaltet-lehrgang.test.ts`.
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  NEUE_LEHRGANG_SCHALTER,
  italienischLehrgangProbeAn,
  neueLehrgangProben,
  polnischLehrgangProbeAn,
  tschechischLehrgangProbeAn,
  tuerkischLehrgangProbeAn,
  type NeuerLehrgang,
} from "../src/lib/typing/lehrgangSchalter";
import { adressWahlLesen, istTastenflowMerker } from "../src/lib/bedienSprache/sprache";

const FUNKTION: Record<NeuerLehrgang, (suche?: string, pfad?: string) => boolean> = {
  it: italienischLehrgangProbeAn,
  pl: polnischLehrgangProbeAn,
  tr: tuerkischLehrgangProbeAn,
  cs: tschechischLehrgangProbeAn,
};
const SPRACHEN: NeuerLehrgang[] = ["it", "pl", "tr", "cs"];

beforeEach(() => localStorage.clear());

describe.each(SPRACHEN)("%s - Schalter in Not-Aus-Polung", (k) => {
  const { adresse, merker } = NEUE_LEHRGANG_SCHALTER[k];
  const an = FUNKTION[k];

  it("★ Standard ist AN: ohne Adresse und ohne Merker", () => {
    expect(an("", "/")).toBe(true);
    expect(localStorage.getItem(merker)).toBeNull();
  });

  it("★ Not-Aus: ?<sprache>-lehrgang=0 ist aus und wird gemerkt", () => {
    expect(an(`?${adresse}=0`, "/")).toBe(false);
    expect(localStorage.getItem(merker)).toBe("0");
    // gilt danach auch ohne Adresse
    expect(an("", "/")).toBe(false);
  });

  it("★ Not-Aus: ein gemerkter Merker \"0\" ist aus, jeder andere Wert an", () => {
    localStorage.setItem(merker, "0");
    expect(an("", "/")).toBe(false);
    localStorage.setItem(merker, "1");
    expect(an("", "/")).toBe(true);
    localStorage.setItem(merker, "");
    expect(an("", "/")).toBe(true);
  });

  it("=1 schaltet ein gemerktes Aus wieder an", () => {
    localStorage.setItem(merker, "0");
    expect(an(`?${adresse}=1`, "/")).toBe(true);
    expect(localStorage.getItem(merker)).toBe("1");
  });

  it("gesperrter Speicher: kein Absturz, der Lehrgang ist an", () => {
    const echt = window.localStorage;
    const gesperrt = () => {
      throw new Error("gesperrt");
    };
    Object.defineProperty(window, "localStorage", {
      value: { getItem: gesperrt, setItem: gesperrt, removeItem: gesperrt },
      configurable: true,
    });
    try {
      expect(an("", "/")).toBe(true);
      expect(an(`?${adresse}=0`, "/")).toBe(false);
    } finally {
      Object.defineProperty(window, "localStorage", { value: echt, configurable: true });
    }
  });

  it("die Einstiegsadresse /<sprache> (mit und ohne Schrägstrich) schaltet an und merkt es", () => {
    expect(an("", `/${k}`)).toBe(true);
    expect(localStorage.getItem(merker)).toBe("1");
    localStorage.clear();
    expect(an("", `/${k}/`)).toBe(true);
    expect(localStorage.getItem(merker)).toBe("1");
    localStorage.clear();
    expect(an("", `/${k.toUpperCase()}`)).toBe(true);
  });

  it("Not-Aus in derselben Adresse geht vor", () => {
    expect(an(`?${adresse}=0`, `/${k}`)).toBe(false);
    expect(localStorage.getItem(merker)).toBe("0");
  });

  it("★ Gegenprobe: andere Adressen setzen keinen Merker und heben einen Not-Aus nicht auf", () => {
    const fremd = ["/", "/en", "/fr", "/es", "/programme/tastenflow", "/freunde", `/${k}x`, `/x${k}`, `/${k}/abc`];
    for (const pfad of fremd) {
      localStorage.clear();
      an("", pfad);
      expect(localStorage.getItem(merker), pfad).toBeNull();
      localStorage.setItem(merker, "0");
      expect(an("", pfad), pfad).toBe(false);
      expect(localStorage.getItem(merker), pfad).toBe("0");
    }
    // Gegenprobe zur Gegenprobe: DIESE Adresse hebt den Not-Aus auf.
    localStorage.setItem(merker, "0");
    expect(an("", `/${k}`)).toBe(true);
    expect(localStorage.getItem(merker)).toBe("1");
  });

  it("der Merker zählt nicht als „Gerät kennt Tastenflow\"", () => {
    expect(istTastenflowMerker(merker)).toBe(false);
  });

  it("die Bedienung wird über die Adresse bzw. ?bedienung= nur MIT dem Schalter gewählt", () => {
    const neueAn = { [k]: true };
    expect(adressWahlLesen("", `/${k}`, false, false, neueAn)).toBe(k);
    expect(localStorage.getItem("tastenflow-bedienung")).toBe(k);
    localStorage.clear();
    expect(adressWahlLesen(`?bedienung=${k}`, "/", false, false, neueAn)).toBe(k);
    localStorage.clear();
    // Not-Aus: ohne Schalter bleibt die Adresse wirkungslos
    expect(adressWahlLesen("", `/${k}`, false, false, { [k]: false })).toBeNull();
    expect(adressWahlLesen(`?bedienung=${k}`, "/", false, false)).toBeNull();
    expect(localStorage.getItem("tastenflow-bedienung")).toBeNull();
    // die anderen drei bleiben von dieser Sprache unberührt
    const andere = SPRACHEN.filter((x) => x !== k);
    for (const a of andere) expect(adressWahlLesen("", `/${a}`, false, false, neueAn)).toBeNull();
  });
});

describe("neueLehrgangProben", () => {
  it("Standard: alle vier an", () => {
    expect(neueLehrgangProben("", "/")).toEqual({
      italienischLehrgangProbeAn: true,
      polnischLehrgangProbeAn: true,
      tuerkischLehrgangProbeAn: true,
      tschechischLehrgangProbeAn: true,
      // ★ G2-NEUN (25.10.2026): die neun Schalter des Gerüsts - Vorgabe aus.
      geruestLehrgangAn: { bg: true, el: true, hu: true, nl: true, pt: true, br: true, ro: true, sv: true, uk: true },
    });
  });

  it("Not-Aus wirkt nur auf die eigene Sprache", () => {
    localStorage.setItem(NEUE_LEHRGANG_SCHALTER.pl.merker, "0");
    expect(neueLehrgangProben("", "/")).toEqual({
      italienischLehrgangProbeAn: true,
      polnischLehrgangProbeAn: false,
      tuerkischLehrgangProbeAn: true,
      tschechischLehrgangProbeAn: true,
      // ★ G2-NEUN (25.10.2026): die neun Schalter des Gerüsts - Vorgabe aus.
      geruestLehrgangAn: { bg: true, el: true, hu: true, nl: true, pt: true, br: true, ro: true, sv: true, uk: true },
    });
  });
});
