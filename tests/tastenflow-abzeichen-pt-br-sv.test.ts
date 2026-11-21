/**
 * ★ WÄCHTER O-INHALT-PT/BR/SV (29.10.2026): die Abzeichen in Portugiesisch (Portugal), Portugiesisch (Brasilien) und Schwedisch
 * sind VOLLSTÄNDIG - jede Abzeichen-ID des englischen und des tschechischen Katalogs hat einen eigenen Eintrag, alle 21 Familien
 * haben einen Namen, und der trockene Zweitname (`nameNeutral`) steht genau dort, wo ihn das Tschechische hat (Vorbild
 * `badgesCs.ts`). Dazu die Hausregeln: kein Gedankenstrich, höchstens ein „!", kein englischer Rest (nicht der englische Text).
 */
import { describe, expect, it } from "vitest";
import { ABZEICHEN_CS, ABZEICHEN_GRUPPEN_CS } from "../src/lib/typing/badgesCs";
import { ABZEICHEN_EN, ABZEICHEN_GRUPPEN_EN, type AbzeichenZahlen } from "../src/lib/typing/badgesEn";
import { ABZEICHEN_PT, ABZEICHEN_GRUPPEN_PT } from "../src/lib/typing/badgesPt";
import { ABZEICHEN_BR, ABZEICHEN_GRUPPEN_BR } from "../src/lib/typing/badgesBr";
import { ABZEICHEN_SV, ABZEICHEN_GRUPPEN_SV } from "../src/lib/typing/badgesSv";
import { BADGES, badgeName, badgeBeschreibung, badgeBild, badgeGruppe } from "../src/lib/typing/badges";

const SPRACHEN = [
  ["pt", ABZEICHEN_PT, ABZEICHEN_GRUPPEN_PT],
  ["br", ABZEICHEN_BR, ABZEICHEN_GRUPPEN_BR],
  ["sv", ABZEICHEN_SV, ABZEICHEN_GRUPPEN_SV],
] as const;

const STRICH = new RegExp(`[${String.fromCharCode(0x2013)}${String.fromCharCode(0x2014)}]`);

function zahlen(lernweg: string): AbzeichenZahlen {
  return { lektionen: 30, trockeneAbenteuer: 5, fische: 5, pauseTage: 14, lernweg } as AbzeichenZahlen;
}

function text(d: string | ((z: AbzeichenZahlen) => string), lernweg: string): string {
  return typeof d === "function" ? d(zahlen(lernweg)) : d;
}

describe.each(SPRACHEN)("Abzeichen %s", (sprache, katalog, gruppen) => {
  it("jede ID aus dem tschechischen und dem englischen Katalog hat einen eigenen Eintrag, und keine fremde ID", () => {
    const soll = new Set([...Object.keys(ABZEICHEN_CS), ...Object.keys(ABZEICHEN_EN)]);
    const fehlt = [...soll].filter((id) => !(id in katalog));
    expect(fehlt, `fehlt: ${fehlt.join(", ")}`).toEqual([]);
    const fremd = Object.keys(katalog).filter((id) => !soll.has(id));
    expect(fremd).toEqual([]);
  });

  it("jedes Abzeichen im Programm (BADGES) hat einen Eintrag", () => {
    const fehlt = BADGES.map((b) => b.id).filter((id) => !(id in katalog));
    expect(fehlt).toEqual([]);
  });

  it("alle Familien haben einen Namen, nie den englischen", () => {
    expect(Object.keys(gruppen).sort()).toEqual(Object.keys(ABZEICHEN_GRUPPEN_CS).sort());
    for (const [k, v] of Object.entries(gruppen)) {
      expect(v.length, k).toBeGreaterThan(0);
      expect(v === ABZEICHEN_GRUPPEN_EN[k] && k !== "Expedition", `${k}: ${v}`).toBe(false);
    }
  });

  it("nameNeutral genau dort, wo das Tschechische ihn hat", () => {
    for (const [id, e] of Object.entries(ABZEICHEN_CS)) {
      expect(Boolean(katalog[id]?.nameNeutral), id).toBe(Boolean(e.nameNeutral));
    }
  });

  it("Hausregeln: kein Gedankenstrich, höchstens ein Ausrufezeichen, nichts leer, nicht der englische Text", () => {
    for (const [id, e] of Object.entries(katalog)) {
      const teile = [e.name, e.nameNeutral ?? "", text(e.description, sprache), e.bildbeschreibung];
      for (const t of teile) {
        expect(STRICH.test(t), `${id}: ${t}`).toBe(false);
        expect((t.match(/!/g) ?? []).length, `${id}: ${t}`).toBeLessThanOrEqual(1);
      }
      expect(e.name.trim().length, id).toBeGreaterThan(0);
      expect(text(e.description, sprache).trim().length, id).toBeGreaterThan(0);
      const en = ABZEICHEN_EN[id];
      if (en) expect(text(e.description, sprache) === text(en.description, sprache), `${id} englisch`).toBe(false);
    }
  });

  it("der Verteiler liefert die eigenen Texte (Bedienung " + sprache + ")", () => {
    for (const b of BADGES) {
      expect(badgeName(b, "kind", sprache), b.id).toBe(katalog[b.id].name);
      expect(badgeBeschreibung(b, sprache, sprache), b.id).not.toBe(b.description);
      expect(badgeBild(b, sprache), b.id).toBe(katalog[b.id].bildbeschreibung);
      expect(badgeGruppe(b.group, sprache), b.group).toBe(gruppen[b.group]);
    }
  });
});
