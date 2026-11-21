/**
 * ★★★ WÄCHTER O-RO (29.10.2026): DIE ABZEICHEN IN DER RUMÄNISCHEN BEDIENUNG.
 *
 * `badgesRo.ts` trägt den ganzen Katalog rumänisch. Geprüft:
 *  1. Jede ID aus `ABZEICHEN_EN` hat einen rumänischen Eintrag (sonst fiele sie still auf Englisch, `eintraegeOderEn`).
 *  2. Zweitname (`nameNeutral`) genau dort, wo das Englische einen hat; Beschreibung als Funktion genau dort, wo das
 *     Englische eine hat (die Zahl kommt von aussen).
 *  3. Alle Familien.
 *  4. Über `badgeName`/`badgeBeschreibung`/`badgeBild`/`badgeGruppe` (badges.ts) mit Sprache „ro" kommt der rumänische
 *     Text - nicht der englische, nicht der deutsche.
 *  5. Hausregeln (Glossar ro §1, §4): kein – —, kein ş ţ (Cedille), kein deutsches oder englisches Restwort, keine Zahl
 *     mit Punkt am Satzende, „de" nach Zahlen ab 20, höchstens ein „!", kein Personenwort für das Kind.
 *  6. Die Beschreibungsfunktionen mit Beispielzahlen (1, 2, 19, 20, 101): die Mehrzahl stimmt.
 * Gegenprobe: eine Mutation (fehlender Eintrag, Cedille, „20 zile") macht den Wächter rot.
 */
import { describe, expect, it } from "vitest";
import { ABZEICHEN_EN, ABZEICHEN_GRUPPEN_EN, type AbzeichenTextEn, type AbzeichenZahlen } from "@/lib/typing/badgesEn";
import { ABZEICHEN_GRUPPEN_RO, ABZEICHEN_RO } from "@/lib/typing/badgesRo";
import { BADGES, badgeBeschreibung, badgeBild, badgeById, badgeGruppe, badgeName } from "@/lib/typing/badges";
import { LERNWEGE_LISTE } from "@/lib/typing/lernweg";

const IDS = Object.keys(ABZEICHEN_EN);
const BEISPIELE = [1, 2, 19, 20, 101];
/** Alle Wege ausser „tr“: dort ist ş (mit Cedille) ein echter türkischer Buchstabe der Grundreihe, kein Fehler. */
const WEGE = LERNWEGE_LISTE.filter((w) => w !== "tr");

/** Alle Texte eines Eintrags - Funktionen mit jeder Beispielzahl und jedem Weg. */
function texteVon(e: AbzeichenTextEn): string[] {
  const out = [e.name, e.bildbeschreibung];
  if (e.nameNeutral) out.push(e.nameNeutral);
  if (typeof e.description === "string") out.push(e.description);
  else
    for (const n of BEISPIELE)
      for (const lernweg of WEGE) {
        const z: AbzeichenZahlen = { lektionen: n, trockeneAbenteuer: n, fische: n, pauseTage: n, lernweg };
        out.push(e.description(z));
      }
  return out;
}

const ALLE_TEXTE = [...Object.values(ABZEICHEN_RO).flatMap(texteVon), ...Object.values(ABZEICHEN_GRUPPEN_RO)];

/** Fehler eines Textes nach den Hausregeln (leer = in Ordnung). */
function regelFehler(t: string): string[] {
  const f: string[] = [];
  if (/[–—]/.test(t)) f.push("Halbgeviert- oder Geviertstrich");
  if (/[ŞşŢţ]/.test(t)) f.push("Cedille statt Komma");
  // Deutsche Restwörter (nur solche, die es im Rumänischen nicht gibt - „runde"/„taste" sind rumänisch).
  if (/\b(und|oder|mit|ohne|Fehler|Buchstaben?|Lektion(en)?|freigeschaltet|geschafft|Abenteuer|Sterne|Tasten)\b/.test(t))
    f.push("deutsches Wort");
  // Englische Restwörter.
  if (
    /\b(the|and|with|without|rounds?|mistakes?|keys?|keystrokes?|letters?|lessons?|unlocked|practised|stars?|stories|stage|level)\b/i.test(t)
  )
    f.push("englisches Wort");
  if (/\d\.$/.test(t.trim()) && !/^\d/.test(t)) f.push("Zahl mit Punkt am Satzende");
  if ((t.match(/!/g) ?? []).length > 1 && !t.includes(". , - ? ! : ;")) f.push("mehr als ein Ausrufezeichen");
  if (/\b(campion\w*|câștigător\w*|începător\w*|maestru\w*|constructor\w*|explorator\w*|cititorule|elevul|eleva)\b/i.test(t))
    f.push("Personenwort");
  // „de" ab 20 (Glossar Regel 13): 20-99, 100, 120 … - nicht 101-119 und nicht 2-19.
  for (const m of t.matchAll(/(?<![\d.,])(\d{1,3}(?:\.\d{3})*)\s+(?!de\b|%|pe\b|una\b|la\b|atins\b)([a-zăâîșț]+)/g)) {
    const n = Number(m[1].replace(/\./g, ""));
    const r100 = n % 100;
    const other = n >= 20 && !(r100 >= 1 && r100 <= 19);
    if (other) f.push(`„de" fehlt nach ${m[1]} („${m[0]}")`);
  }
  return f.map((x) => `${x}: „${t}"`);
}

describe("O-RO Abzeichen: der Katalog ist vollständig", () => {
  it("jede ID aus ABZEICHEN_EN hat einen rumänischen Eintrag - und keine erfundene ID", () => {
    expect(IDS.length).toBeGreaterThan(100);
    expect(IDS.filter((id) => !ABZEICHEN_RO[id])).toEqual([]);
    const extra = Object.keys(ABZEICHEN_RO).filter((id) => !ABZEICHEN_EN[id] && !badgeById(id));
    expect(extra).toEqual([]);
  });

  it("Zweitname genau dort, wo das Englische einen hat", () => {
    const falsch = Object.keys(ABZEICHEN_RO).filter(
      (id) => Boolean(ABZEICHEN_RO[id].nameNeutral) !== Boolean((ABZEICHEN_EN[id] ?? badgeById(id))?.nameNeutral),
    );
    expect(falsch).toEqual([]);
  });

  it("Beschreibung als Funktion überall dort, wo das Englische eine hat", () => {
    const fehlt = IDS.filter(
      (id) => typeof ABZEICHEN_EN[id].description === "function" && typeof ABZEICHEN_RO[id].description !== "function",
    );
    expect(fehlt).toEqual([]);
  });

  it("alle Familien haben einen rumänischen Namen", () => {
    expect(Object.keys(ABZEICHEN_GRUPPEN_EN).filter((g) => !ABZEICHEN_GRUPPEN_RO[g])).toEqual([]);
    // Jede Familie, die im Katalog vorkommt, ist dabei.
    const gruppen = new Set(BADGES.map((b) => b.group));
    expect([...gruppen].filter((g) => !ABZEICHEN_GRUPPEN_RO[g])).toEqual([]);
  });

  it("kein Name kommt doppelt vor (das Regal liest sie nebeneinander vor)", () => {
    const namen = Object.values(ABZEICHEN_RO).map((e) => e.name);
    expect(namen.filter((n, i) => namen.indexOf(n) !== i)).toEqual([]);
  });
});

describe("O-RO Abzeichen: der Verteiler liefert Rumänisch", () => {
  it("badgeName, badgeBeschreibung, badgeBild, badgeGruppe mit Sprache ro - der rumänische Text, nicht der englische", () => {
    const fehler: string[] = [];
    for (const id of IDS) {
      const def = badgeById(id);
      if (!def) continue;
      const r = ABZEICHEN_RO[id];
      const e = ABZEICHEN_EN[id];
      if (badgeName(def, "kind", "ro") !== r.name) fehler.push(`${id} Name`);
      if (badgeName(def, "erwachsen", "ro") !== (r.nameNeutral ?? r.name)) fehler.push(`${id} Zweitname`);
      if (badgeBild(def, "ro") !== r.bildbeschreibung) fehler.push(`${id} Bild`);
      const beschr = badgeBeschreibung(def, "ro", "ro");
      const enBeschr = badgeBeschreibung(def, "en", "ro");
      if (beschr === enBeschr) fehler.push(`${id} Beschreibung englisch: ${beschr}`);
      if (beschr === def.description) fehler.push(`${id} Beschreibung deutsch: ${beschr}`);
      if (r.name === e.name && r.name !== def.name) fehler.push(`${id} Name wie Englisch: ${r.name}`);
      if (badgeGruppe(def.group, "ro") !== ABZEICHEN_GRUPPEN_RO[def.group]) fehler.push(`${id} Familie`);
    }
    expect(fehler).toEqual([]);
  });

  it("Weg ro: die Grundreihe in der Beschreibung ist die rumänische", () => {
    const def = badgeById("grundstellungs-gorilla")!;
    expect(badgeBeschreibung(def, "ro", "ro")).toBe(
      "Toate cele opt taste ale poziției de bază deblocate: f j d k s l a ș.",
    );
  });
});

describe("O-RO Abzeichen: die Hausregeln", () => {
  it("es gibt Texte (sonst misst der Wächter nichts)", () => {
    expect(ALLE_TEXTE.length).toBeGreaterThan(300);
  });

  it("keine langen Striche, keine Cedille, kein deutsches/englisches Restwort, keine Zahl mit Punkt am Ende, de ab 20, kein Personenwort", () => {
    expect(ALLE_TEXTE.flatMap(regelFehler)).toEqual([]);
  });

  it("Prozent mit geschütztem Leerzeichen (Glossar Regel 5)", () => {
    const ohne = ALLE_TEXTE.filter((t) => /\d %/.test(t));
    expect(ohne).toEqual([]);
    expect(ALLE_TEXTE.some((t) => t.includes("95 %"))).toBe(true);
  });

  it("die Beschreibungsfunktionen mit Beispielzahlen: one / few / other mit de", () => {
    const z = (n: number): AbzeichenZahlen => ({ lektionen: n, trockeneAbenteuer: n, fische: n, pauseTage: n, lernweg: "ro" });
    const tag = ABZEICHEN_RO["zurueck-im-sattel"].description as (z: AbzeichenZahlen) => string;
    expect(tag(z(1))).toContain("peste 1 zi -");
    expect(tag(z(2))).toContain("peste 2 zile -");
    expect(tag(z(19))).toContain("peste 19 zile -");
    expect(tag(z(20))).toContain("peste 20 de zile -");
    expect(tag(z(101))).toContain("peste 101 zile -");
    const fisch = ABZEICHEN_RO.fischfaenger.description as (z: AbzeichenZahlen) => string;
    expect(fisch(z(1))).toMatch(/^1 pește bonus prins /);
    expect(fisch(z(2))).toMatch(/^2 pești bonus prinși /);
    expect(fisch(z(20))).toMatch(/^20 de pești bonus prinși /);
    expect(fisch(z(101))).toMatch(/^101 pești bonus prinși /);
    const trocken = ABZEICHEN_RO["immer-trocken"].description as (z: AbzeichenZahlen) => string;
    expect(trocken(z(1))).toMatch(/^1 aventură /);
    expect(trocken(z(19))).toMatch(/^19 aventuri /);
    expect(trocken(z(20))).toMatch(/^20 de aventuri /);
    // Die Lektionszahl des Weges steht in Klammern, ohne Hauptwort und nicht am Satzende vor dem Punkt.
    const legende = badgeBeschreibung(badgeById("lehrgangs-legende")!, "ro", "ro");
    expect(legende).toMatch(/^Toate lecțiile cursului terminate \(în total \d+\)\.$/);
  });
});
