/**
 * ★★★ WÄCHTER O-NL (29.10.2026): DER ABZEICHEN-KATALOG NIEDERLÄNDISCH (`src/lib/typing/badgesNl.ts`).
 *
 *  · jede ID aus `ABZEICHEN_EN` hat einen niederländischen Eintrag (und keiner steht da, den es nicht gibt);
 *  · `nameNeutral` genau dort, wo das Englische einen hat; eine Beschreibung als Funktion, wo das Englische eine hat;
 *  · alle Familien (Überschriften im Regal), keine gleich der englischen;
 *  · über `badgeName`/`badgeBeschreibung`/`badgeBild`/`badgeGruppe` (badges.ts) kommt mit Sprache „nl" der
 *    niederländische Text, nicht der englische (Rückfall `eintraegeOderEn` greift nicht mehr);
 *  · Hausregeln: nur `-`, höchstens ein „!", keine Zahl mit Punkt am Satzende, kein deutsches oder englisches Restwort,
 *    nie „blind", nie „op rij" (rij = Tastenreihe, Glossar §2.2), nie „badge"/„examen"/„toets" als Prüfung;
 *  · Mehrzahl über `Intl.PluralRules("nl-NL")`: die Beschreibungs-Funktionen mit Beispielzahlen 1, 2, 14.
 */
import { describe, expect, it } from "vitest";
import { BADGES, badgeBeschreibung, badgeBild, badgeGruppe, badgeName } from "@/lib/typing/badges";
import { ABZEICHEN_EN, ABZEICHEN_GRUPPEN_EN, type AbzeichenZahlen } from "@/lib/typing/badgesEn";
import { ABZEICHEN_GRUPPEN_NL, ABZEICHEN_NL } from "@/lib/typing/badgesNl";
import { ABZEICHEN_NUR_FR_TEXTE } from "@/lib/typing/badgesNurFr";
import type { Lernweg } from "@/lib/typing/lernweg";

const EN_IDS = Object.keys(ABZEICHEN_EN);
const NUR_FR_IDS = Object.keys(ABZEICHEN_NUR_FR_TEXTE.en);

/** Die Beispielzahlen, mit denen jede Beschreibungs-Funktion aufgerufen wird. */
function zahlen(n: number, lernweg: Lernweg): AbzeichenZahlen {
  return { lektionen: n, trockeneAbenteuer: n, fische: n, pauseTage: n, lernweg };
}
const BEISPIELE: AbzeichenZahlen[] = [1, 2, 14].flatMap((n) => (["nl", "de", "en", "fr"] as const).map((w) => zahlen(n, w)));

/** Alle Texte eines Eintrags - Beschreibungs-Funktionen mit allen Beispielzahlen ausgewertet. */
function texteVon(id: string): string[] {
  const e = ABZEICHEN_NL[id]!;
  const besch = typeof e.description === "function" ? BEISPIELE.map((z) => (e.description as (z: AbzeichenZahlen) => string)(z)) : [e.description];
  return [e.name, ...(e.nameNeutral ? [e.nameNeutral] : []), ...besch, e.bildbeschreibung];
}

/** Englische Restwörter (Wörter, die es im Niederländischen so nicht gibt). */
const ENGLISCH = /\b(the|and|with|keys?|keystrokes?|rounds?|mistakes?|unlocked|practised|lessons|stars|stories|badges?|press|finger|row|space bar|capital|digit|accuracy|reached|without|in a row)\b/i;
/** Deutsche Restwörter („die" und „das" sind auch niederländisch - nicht in der Liste). */
const DEUTSCH = /\b(und|mit|der|Taste|Tasten|Runde|Runden|Fehler|Buchstaben?|Reihe|Ziffern?|Zeichen|Umschalt|geübt|Abzeichen|freigeschaltet|Leertaste|nicht|ohne)\b/;
/** Hausregeln und Glossar-Fallen. */
function regelBrueche(s: string): string[] {
  const out: string[] = [];
  if (/[\u2013\u2014]/.test(s)) out.push("Halbgeviert- oder Geviertstrich");
  if ((s.match(/!/g) ?? []).length > 1) out.push("mehr als ein „!\"");
  if (/\d\.(\s|$)/.test(s)) out.push("Zahl mit Punkt am Satzende");
  if (ENGLISCH.test(s)) out.push(`englisches Wort „${s.match(ENGLISCH)![0]}"`);
  if (DEUTSCH.test(s)) out.push(`deutsches Wort „${s.match(DEUTSCH)![0]}"`);
  if (/\bblind/i.test(s)) out.push("„blind\" (Glossar Regel 4)");
  if (/\bop rij\b/i.test(s)) out.push("„op rij\" (rij = Tastenreihe)");
  if (/\b(examen|proefwerk|badge)\b/i.test(s)) out.push("Prüfungs- oder Fremdwort statt Glossar");
  if (/[’‘]/.test(s)) out.push("typografischer Apostroph statt '");
  if (/\d %/.test(s)) out.push("Prozent mit Leerzeichen (Glossar Regel 5: 95%)");
  return out;
}

describe("★★★ O-NL: der niederländische Abzeichen-Katalog ist vollständig", () => {
  it("jede ID aus ABZEICHEN_EN hat einen niederländischen Eintrag, und nichts Fremdes steht da", () => {
    const fehlt = EN_IDS.filter((id) => !ABZEICHEN_NL[id]);
    expect(fehlt).toEqual([]);
    const fremd = Object.keys(ABZEICHEN_NL).filter((id) => !EN_IDS.includes(id) && !NUR_FR_IDS.includes(id));
    expect(fremd).toEqual([]);
    expect(EN_IDS.length).toBeGreaterThanOrEqual(BADGES.length);
  });

  it("nameNeutral genau dort, wo das Englische einen hat (auch die drei Abzeichen nur auf Weg „fr\")", () => {
    const falsch = EN_IDS.filter((id) => Boolean(ABZEICHEN_EN[id]!.nameNeutral) !== Boolean(ABZEICHEN_NL[id]!.nameNeutral));
    expect(falsch).toEqual([]);
    for (const id of NUR_FR_IDS)
      if (ABZEICHEN_NL[id]) expect(Boolean(ABZEICHEN_NL[id]!.nameNeutral), id).toBe(Boolean(ABZEICHEN_NUR_FR_TEXTE.en[id]!.nameNeutral));
  });

  it("eine Beschreibung ist eine Funktion, wo die englische eine ist (die Zahl kommt von aussen)", () => {
    const falsch = EN_IDS.filter((id) => typeof ABZEICHEN_EN[id]!.description === "function" && typeof ABZEICHEN_NL[id]!.description !== "function");
    expect(falsch).toEqual([]);
  });

  it("alle Familien - dieselben Schlüssel wie Englisch, jede in jeder BADGES-Gruppe, keine gleich der englischen", () => {
    expect(Object.keys(ABZEICHEN_GRUPPEN_NL).sort()).toEqual(Object.keys(ABZEICHEN_GRUPPEN_EN).sort());
    for (const b of BADGES) expect(ABZEICHEN_GRUPPEN_NL[b.group], b.group).toBeTruthy();
    for (const [k, v] of Object.entries(ABZEICHEN_GRUPPEN_NL)) {
      expect(v, k).not.toBe(ABZEICHEN_GRUPPEN_EN[k]);
      expect(badgeGruppe(k, "nl"), k).toBe(v);
      expect(regelBrueche(v), `${k}: ${v}`).toEqual([]);
    }
  });
});

describe("★★★ O-NL: über badges.ts kommt mit Sprache „nl\" der niederländische Text", () => {
  it("Name (Kind und ab 11), Beschreibung, Bild - je Abzeichen niederländisch, nie der englische Rückfall", () => {
    const englisch: string[] = [];
    for (const def of BADGES) {
      const nl = ABZEICHEN_NL[def.id]!;
      const en = ABZEICHEN_EN[def.id]!;
      expect(badgeName(def, "kind", "nl"), def.id).toBe(nl.name);
      expect(badgeName(def, "jugend", "nl"), def.id).toBe(nl.nameNeutral ?? nl.name);
      expect(badgeName(def, "erwachsen", "nl"), def.id).toBe(nl.nameNeutral ?? nl.name);
      expect(badgeBild(def, "nl"), def.id).toBe(nl.bildbeschreibung);
      for (const weg of ["nl", "de", "en"] as const) {
        const besch = badgeBeschreibung(def, "nl", weg);
        if (besch === badgeBeschreibung(def, "en", weg)) englisch.push(`${def.id}/${weg} Beschreibung`);
        if (besch === def.description) englisch.push(`${def.id}/${weg} Beschreibung deutsch`);
      }
      if (nl.name === en.name) englisch.push(`${def.id} Name`);
      if (nl.bildbeschreibung === en.bildbeschreibung) englisch.push(`${def.id} Bild`);
    }
    expect(englisch).toEqual([]);
  });

  it("die Grundreihe in „grundstellungs-gorilla\" ist die des Weges „nl\"", () => {
    const def = BADGES.find((b) => b.id === "grundstellungs-gorilla")!;
    expect(badgeBeschreibung(def, "nl", "nl")).toBe("Alle acht toetsen van de basishouding vrijgespeeld: f j d k s l a ;.");
  });
});

describe("★★★ O-NL: Hausregeln in jedem niederländischen Abzeichen-Text", () => {
  it("nur -, höchstens ein !, keine Zahl mit Punkt am Satzende, kein deutsches oder englisches Restwort", () => {
    const brueche: string[] = [];
    for (const id of Object.keys(ABZEICHEN_NL))
      for (const s of texteVon(id)) for (const b of regelBrueche(s)) brueche.push(`${id}: ${b} - ${s}`);
    expect(brueche).toEqual([]);
  });

  it("das Motiv bleibt kurz (unter 60 Zeichen) und kein Text ist leer", () => {
    for (const id of Object.keys(ABZEICHEN_NL)) {
      const e = ABZEICHEN_NL[id]!;
      expect(e.bildbeschreibung.length, id).toBeLessThan(60);
      for (const s of texteVon(id)) expect(s.trim().length, id).toBeGreaterThan(0);
    }
  });

  it("Mehrzahl nach der Zahl (Intl.PluralRules nl-NL): 1 avontuur, 2 avonturen, 1 bonusvis, 14 bonusvissen, 1 dag, 14 dagen", () => {
    const f = (id: string, n: number) => (ABZEICHEN_NL[id]!.description as (z: AbzeichenZahlen) => string)(zahlen(n, "nl"));
    expect(f("immer-trocken", 1)).toMatch(/^1 avontuur /);
    expect(f("immer-trocken", 2)).toMatch(/^2 avonturen /);
    expect(f("fischfaenger", 1)).toMatch(/^1 bonusvis /);
    expect(f("fischfaenger", 14)).toMatch(/^14 bonusvissen /);
    expect(f("zurueck-im-sattel", 1)).toContain("meer dan 1 dag -");
    expect(f("zurueck-im-sattel", 14)).toContain("meer dan 14 dagen -");
    expect(f("immer-trocken", 1000)).toMatch(/^1\.000 avonturen /);
  });

  it("GEGENPROBE: jede Regel findet ihren Gegenfall", () => {
    expect(regelBrueche("Een ronde \u2013 klaar.")).not.toEqual([]);
    expect(regelBrueche("Goed! Super!")).not.toEqual([]);
    expect(regelBrueche("Level 5.")).not.toEqual([]);
    expect(regelBrueche("10 rounds geoefend.")).not.toEqual([]);
    expect(regelBrueche("10 Runden geoefend.")).not.toEqual([]);
    expect(regelBrueche("3 nette rondes op rij.")).not.toEqual([]);
    expect(regelBrueche("Blind typen.")).not.toEqual([]);
    expect(regelBrueche("95 % nauwkeurigheid.")).not.toEqual([]);
    expect(regelBrueche("Een toets die lang lastig was, is nu zeker.")).toEqual([]);
  });
});
