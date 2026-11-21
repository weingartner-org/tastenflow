/**
 * ★★★ WÄCHTER O2-TASTATUR (30.10.2026): Finger, Reihen und Finger-Ansage der neun Sprachen (`fingerNamenNeun.ts`, `fingers.ts`).
 * Bis hierher lieferten `fingerName`, `rowName` und `FINGER_ANSAGE_JE_SPRACHE` auf diesen Wegen Englisch.
 */
import { afterEach, describe, expect, it } from "vitest";
import { FINGERS, FINGER_ANSAGE_JE_SPRACHE, fingerName, rowName, spokenLabel, type FingerId } from "@/lib/typing/fingers";
import { FINGER_ANSAGE_TEILE, FINGER_NEUN, REIHEN_NEUN } from "@/lib/typing/fingerNamenNeun";
import { layoutById, setLayout, type LayoutId } from "@/lib/typing/layouts";
import { GERUEST_SPRACHEN, type GeruestSprache } from "@/lib/typing/sprachRegister";
import { lernwegDef } from "@/lib/typing/lernweg";

afterEach(() => setLayout("de"));

const TASTATUR: Readonly<Record<GeruestSprache, LayoutId>> = {
  bg: "bg", el: "el", hu: "hu", nl: "nl-intl", pt: "pt", br: "br-abnt2", ro: "ro", sv: "sv", uk: "ua",
};
const EIGENE_SCHRIFT: Partial<Record<GeruestSprache, RegExp>> = {
  bg: /\p{Script=Cyrillic}/u, uk: /\p{Script=Cyrillic}/u, el: /\p{Script=Greek}/u,
};
const ENGLISCH = /\b(left|right|index finger|middle finger|ring finger|little finger|pinky|thumb|home position|hold|press|then|first)\b/i;
const IDS = Object.keys(FINGERS) as FingerId[];

describe("★ fingerName und rowName sprechen die Sprache des Weges", () => {
  it.each(GERUEST_SPRACHEN)("%s: alle neun Finger eigen, verschieden, nie der englische oder deutsche Name", (l) => {
    const namen = IDS.map((id) => fingerName(FINGERS[id], l));
    expect(namen).toEqual(IDS.map((id) => FINGER_NEUN[l][id]));
    expect(new Set(namen).size).toBe(IDS.length);
    for (const id of IDS) {
      expect(fingerName(FINGERS[id], l)).not.toBe(fingerName(FINGERS[id], "en"));
      expect(fingerName(FINGERS[id], l)).not.toBe(FINGERS[id].name);
    }
  });

  it.each(GERUEST_SPRACHEN)("%s: die vier Reihen eigen; die Grundreihe trifft eine Taste der Grundreihe", (l) => {
    setLayout(TASTATUR[l]);
    const reihen = layoutById(TASTATUR[l]).rows;
    expect(rowName(reihen[2].keys[3], l)).toBe(REIHEN_NEUN[l][2]);
    expect(rowName(reihen[1].keys[3], l)).toBe(REIHEN_NEUN[l][1]);
    expect(new Set(REIHEN_NEUN[l]).size).toBe(4);
    for (const r of REIHEN_NEUN[l]) expect(r).not.toMatch(/row/i);
  });

});

describe("★★★ die Finger-Ansage der neun: kein englischer Satz, jede Taste der Tastatur", () => {
  it.each(GERUEST_SPRACHEN)("%s: Leertaste, Enter, Buchstaben, Umschalt - in der Sprache", (l) => {
    setLayout(TASTATUR[l]);
    const ansage = FINGER_ANSAGE_JE_SPRACHE[l];
    expect(ansage(" ", false, l)).toBe(`${FINGER_ANSAGE_TEILE[l].leer}: ${FINGER_NEUN[l].daumen}.`);
    expect(ansage("\n", false, l)).toBe(`Enter: ${FINGER_NEUN[l]["kleiner-rechts"]}.`);
    const fehler: string[] = [];
    for (const u of lernwegDef(l).letterOrder) {
      for (const einhand of [false, true]) {
        const satz = ansage(u, einhand, l);
        if (!satz.trim()) fehler.push(`${u}: leer`);
        if (ENGLISCH.test(satz)) fehler.push(`${u}: ${satz}`);
        if (/undefined|null/.test(satz)) fehler.push(`${u}: ${satz}`);
        if (/[–—]/.test(satz)) fehler.push(`${u}: Gedankenstrich`);
        const schrift = EIGENE_SCHRIFT[l];
        if (schrift && !schrift.test(satz)) fehler.push(`${u}: keine eigene Schrift: ${satz}`);
      }
    }
    expect(fehler).toEqual([]);
  });

  it("Griechisch: ά kommt als zwei Schritte, erst die Totaste, dann der Vokal", () => {
    setLayout("el");
    const satz = FINGER_ANSAGE_JE_SPRACHE.el("ά", false, "el");
    expect(satz).toContain("νεκρό πλήκτρο");
    expect(satz).toContain("πλήκτρο Α");
  });

  it("Schwedisch sagt Skift, nie Shift", () => {
    setLayout("sv");
    const satz = FINGER_ANSAGE_JE_SPRACHE.sv("F", false, "sv");
    expect(satz).toContain("Skift");
    expect(satz).not.toContain("Shift");
  });

  it("die acht alten Sprachen bleiben, wie sie waren (Stichprobe)", () => {
    setLayout("de");
    expect(FINGER_ANSAGE_JE_SPRACHE.de(" ", false, "de")).not.toContain("Интервал");
    expect(spokenLabel(" ", "de")).toBe("Leertaste");
  });
});
