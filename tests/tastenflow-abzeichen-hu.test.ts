/**
 * ★★★ WÄCHTER O-HU (29.10.2026): DER UNGARISCHE ABZEICHEN-KATALOG (`badgesHu.ts`).
 *
 *  · Vollständig: jede ID aus `ABZEICHEN_EN` (und die drei Abzeichen nur des Weges „fr") hat einen ungarischen Eintrag, jede
 *    Familie einen ungarischen Namen; einen Zweitnamen (`nameNeutral`) genau dort, wo das Englische einen hat; eine
 *    Beschreibungs-FUNKTION genau dort, wo das Englische eine hat.
 *  · Verdrahtet: über `badgeName`/`badgeBeschreibung`/`badgeBild`/`badgeGruppe` (badges.ts) mit Sprache „hu" kommt der
 *    ungarische Text, nie der englische und nie der deutsche.
 *  · Hausregeln (Glossar `recherche-ungarisch-2026-10-25/GLOSSAR-hu.md`): kein – oder —, kein deutsches oder englisches Restwort,
 *    keine Zahl mit Punkt am Satzende (Falle 4), Prozent ohne Leerzeichen, Zahlen ab fünf Stellen mit U+00A0, höchstens ein
 *    „!" je Text, kein „vakon"/„vak" (Regel 3/4).
 *  · Die Beschreibungs-Funktionen werden mit Beispielzahlen (1, 2, 5, 12 345) und jedem Weg aufgerufen.
 *  · GEGENPROBE: jede Regel findet ihr Gegenbeispiel.
 *
 * ⚠️ `\b` kennt keine Buchstaben mit Akzent - darum `(?<!\p{L})…(?!\p{L})`.
 */
import { describe, expect, it } from "vitest";
import { BADGES, badgeBeschreibung, badgeBild, badgeGruppe, badgeName } from "@/lib/typing/badges";
import { ABZEICHEN_EN, ABZEICHEN_GRUPPEN_EN, type AbzeichenZahlen } from "@/lib/typing/badgesEn";
import { ABZEICHEN_GRUPPEN_HU, ABZEICHEN_HU } from "@/lib/typing/badgesHu";
import { ABZEICHEN_NUR_FR, ABZEICHEN_NUR_FR_TEXTE } from "@/lib/typing/badgesNurFr";
import { LERNWEGE_LISTE } from "@/lib/typing/lernweg";

const EN_IDS = Object.keys(ABZEICHEN_EN);
const NUR_FR_IDS = Object.keys(ABZEICHEN_NUR_FR_TEXTE.en);

/** Ganzes Wort, auch bei Buchstaben mit Akzent. */
const wort = (w: string) => new RegExp(`(?<!\\p{L})${w}(?!\\p{L})`, "iu");

/** Englische und deutsche Wörter, die in einem ungarischen Abzeichen nichts verloren haben. */
const FREMDWOERTER = [
  // englisch
  "the", "and", "with", "round", "rounds", "key", "keys", "letter", "letters", "mistake", "mistakes", "practised", "unlocked",
  "badge", "lesson", "lessons", "level", "stars", "story", "stories", "stage", "stages", "keystrokes", "accuracy", "minute",
  "without", "days", "weeks", "row", "learnt", "mastered",
  // deutsch
  "und", "der", "die", "das", "ohne", "Runde", "Runden", "Taste", "Tasten", "Fehler", "freigeschaltet", "geübt",
  "Lektion", "Lektionen", "Stufe", "Geschichte", "Tage", "Wochen", "Anschläge",
];

/** Personen- und Ausgrenzungswörter (Glossar Regel 3/4) - auch ohne Akzent. */
const SPERRE = ["vakon", "vak", "vakírás", "fogyatékos", "normális", "rokkant"];

/** Beispielzahlen von aussen - eins (one), zwei, fünf, fünfstellig. */
const ZAHLEN_BEISPIELE = [1, 2, 5, 12345];

function alleBeschreibungen(id: string): string[] {
  const d = ABZEICHEN_HU[id]?.description;
  if (typeof d !== "function") return d === undefined ? [] : [d];
  const out: string[] = [];
  for (const lernweg of LERNWEGE_LISTE)
    for (const n of ZAHLEN_BEISPIELE) {
      const z: AbzeichenZahlen = { lektionen: n, trockeneAbenteuer: n, fische: n, pauseTage: n, lernweg };
      out.push(d(z));
    }
  return out;
}

/** Alle Texte eines Eintrags (Name, Zweitname, Beschreibungen, Bild). */
function alleTexte(id: string): string[] {
  const e = ABZEICHEN_HU[id];
  if (!e) return [];
  return [e.name, ...(e.nameNeutral ? [e.nameNeutral] : []), ...alleBeschreibungen(id), e.bildbeschreibung];
}

/** Die Fehler eines Textes nach den Hausregeln (leer = in Ordnung). */
function regelFehler(t: string): string[] {
  const f: string[] = [];
  if (/[–—]/.test(t)) f.push("Gedankenstrich");
  for (const w of FREMDWOERTER) if (wort(w).test(t)) f.push(`Fremdwort „${w}“`);
  for (const w of SPERRE) if (wort(w).test(t)) f.push(`Sperrwort „${w}“`);
  if (/\d\.$/.test(t.trim())) f.push("Zahl mit Punkt am Satzende");
  if (/\d\.\s+\p{Lu}/u.test(t)) f.push("Zahl mit Punkt am Satzende (mitten im Text)");
  if (/\d %/.test(t)) f.push("Prozent mit Leerzeichen");
  if (/\d{5,}/.test(t)) f.push("fünfstellige Zahl ohne Trenner");
  if (/\d \d{3}(?!\d)/.test(t)) f.push("Tausender mit gewöhnlichem Leerzeichen");
  if ((t.match(/!/g) ?? []).length > 1) f.push("mehr als ein „!“");
  return f;
}

describe("★★★ O-HU: der ungarische Abzeichen-Katalog ist vollständig", () => {
  it("jede ID aus ABZEICHEN_EN und die drei des Weges „fr“ haben einen ungarischen Eintrag - und keiner ist zu viel", () => {
    const soll = [...EN_IDS, ...NUR_FR_IDS];
    const fehlt = soll.filter((id) => !ABZEICHEN_HU[id]);
    expect(fehlt).toEqual([]);
    const zuviel = Object.keys(ABZEICHEN_HU).filter((id) => !soll.includes(id));
    expect(zuviel).toEqual([]);
  });

  it("jedes Abzeichen des Katalogs (BADGES + nur fr) ist damit abgedeckt", () => {
    const ids = [...BADGES, ...ABZEICHEN_NUR_FR].map((b) => b.id);
    expect(ids.filter((id) => !ABZEICHEN_HU[id])).toEqual([]);
  });

  it("Zweitname genau dort, wo das Englische einen hat", () => {
    const falsch: string[] = [];
    const en = { ...ABZEICHEN_EN, ...ABZEICHEN_NUR_FR_TEXTE.en };
    for (const id of Object.keys(en)) {
      const hatEn = en[id].nameNeutral !== undefined;
      const hatHu = ABZEICHEN_HU[id]?.nameNeutral !== undefined;
      if (hatEn !== hatHu) falsch.push(`${id}: en ${hatEn}, hu ${hatHu}`);
    }
    expect(falsch).toEqual([]);
  });

  // Eine Funktion, wo das Englische eine hat. Zusätzlich NUR „alltags-ass" (wie `badgesCs.ts`): § fehlt auf `hu-101` und in
  // der Reihenfolge des Weges „hu" - die Beschreibung nennt nur die Zeichen, die es auf dem Weg des Kindes gibt.
  const EXTRA_FUNKTION = new Set(["alltags-ass"]);

  it("Beschreibung als Funktion dort, wo das Englische eine hat (und sonst nur bei alltags-ass)", () => {
    const falsch = EN_IDS.filter((id) => {
      const en = typeof ABZEICHEN_EN[id].description === "function";
      const hu = typeof ABZEICHEN_HU[id]?.description === "function";
      return en ? !hu : hu && !EXTRA_FUNKTION.has(id);
    });
    expect(falsch).toEqual([]);
  });

  it("alltags-ass nennt auf Weg „hu“ nur die Zeichen des Weges (kein §)", () => {
    const alltag = BADGES.find((b) => b.id === "alltags-ass")!;
    expect(badgeBeschreibung(alltag, "hu", "hu")).toBe("Feloldva: @, € és $ - jelek az e-mailekhez és a pénzhez.");
  });

  it("alle 21 Familien haben einen ungarischen Namen, der vom englischen abweicht", () => {
    const familien = Object.keys(ABZEICHEN_GRUPPEN_EN);
    expect(familien.length).toBe(21);
    for (const g of familien) {
      expect(ABZEICHEN_GRUPPEN_HU[g], g).toBeTruthy();
      expect(ABZEICHEN_GRUPPEN_HU[g], g).not.toBe(ABZEICHEN_GRUPPEN_EN[g]);
    }
    // Jede Familie, die im Katalog wirklich vorkommt, ist dabei.
    for (const b of BADGES) expect(ABZEICHEN_GRUPPEN_HU[b.group], b.group).toBeTruthy();
  });
});

describe("★★★ O-HU: über badges.ts kommt mit „hu“ der ungarische Text", () => {
  it("Name (Kind und ab 11), Beschreibung, Bild und Familie - je Abzeichen", () => {
    for (const def of [...BADGES, ...ABZEICHEN_NUR_FR]) {
      const e = ABZEICHEN_HU[def.id];
      expect(badgeName(def, "kind", "hu"), def.id).toBe(e.name);
      expect(badgeName(def, "erwachsen", "hu"), def.id).toBe(e.nameNeutral ?? e.name);
      expect(badgeBild(def, "hu"), def.id).toBe(e.bildbeschreibung);
      const beschreibung = badgeBeschreibung(def, "hu", "hu");
      if (typeof e.description === "string") expect(beschreibung, def.id).toBe(e.description);
      // Nie der englische, nie der deutsche Text.
      expect(beschreibung, def.id).not.toBe(badgeBeschreibung(def, "en", "hu"));
      expect(beschreibung, def.id).not.toBe(def.description);
      expect(badgeName(def, "kind", "hu"), def.id).not.toBe(def.name);
    }
    for (const b of BADGES) expect(badgeGruppe(b.group, "hu")).toBe(ABZEICHEN_GRUPPEN_HU[b.group]);
  });

  it("Grundreihe des Weges „hu“: f j d k s l a é", () => {
    const gorilla = BADGES.find((b) => b.id === "grundstellungs-gorilla")!;
    expect(badgeBeschreibung(gorilla, "hu", "hu")).toBe("Feloldva mind a nyolc alapbillentyű: f j d k s l a é.");
  });

  it("die Lektionszahl ist die des Weges, in Klammern (keine Zahl am Satzende)", () => {
    const legende = BADGES.find((b) => b.id === "lehrgangs-legende")!;
    expect(badgeBeschreibung(legende, "hu", "hu")).toMatch(/^A tanfolyam minden leckéje befejezve \(összesen \d+ lecke\)\.$/);
  });
});

describe("★★★ O-HU: Hausregeln in jedem Text", () => {
  it("kein Gedankenstrich, kein Fremdwort, keine Zahl mit Punkt am Satzende, Prozent und Tausender richtig, höchstens ein „!“", () => {
    const fehler: string[] = [];
    for (const id of Object.keys(ABZEICHEN_HU)) for (const t of alleTexte(id)) for (const f of regelFehler(t)) fehler.push(`${id}: ${f} - ${t}`);
    for (const [g, t] of Object.entries(ABZEICHEN_GRUPPEN_HU)) for (const f of regelFehler(t)) fehler.push(`Familie ${g}: ${f}`);
    expect(fehler).toEqual([]);
  });

  it("jede Beschreibung endet mit einem Satzzeichen, jeder Text ist kurz genug", () => {
    for (const id of Object.keys(ABZEICHEN_HU)) {
      for (const d of alleBeschreibungen(id)) expect(d, id).toMatch(/[.!;)]$/);
      expect(ABZEICHEN_HU[id].bildbeschreibung.length, id).toBeLessThanOrEqual(60);
      expect(ABZEICHEN_HU[id].name.length, id).toBeLessThanOrEqual(40);
    }
  });

  it("Beschreibungs-Funktionen mit Beispielzahlen: die Zahl steht drin, fünfstellig mit U+00A0", () => {
    const zahlen: Array<[string, keyof AbzeichenZahlen]> = [
      ["immer-trocken", "trockeneAbenteuer"],
      ["fischfaenger", "fische"],
      ["zurueck-im-sattel", "pauseTage"],
    ];
    for (const [id, feld] of zahlen) {
      const d = ABZEICHEN_HU[id].description as (z: AbzeichenZahlen) => string;
      for (const n of ZAHLEN_BEISPIELE) {
        const z: AbzeichenZahlen = { lektionen: 27, trockeneAbenteuer: 3, fische: 3, pauseTage: 3, lernweg: "hu", [feld]: n };
        const t = d(z);
        expect(t, `${id} ${n}`).toContain(n.toLocaleString("hu-HU"));
        // Nach der Zahl Einzahl (Regel 13): kein „-k" am Hauptwort direkt nach der Zahl.
        expect(t, `${id} ${n}`).not.toMatch(/\d (kalandok|bónuszhalak|napok)/);
      }
    }
    expect((ABZEICHEN_HU.fischfaenger.description as (z: AbzeichenZahlen) => string)({ lektionen: 1, trockeneAbenteuer: 1, fische: 12345, pauseTage: 1, lernweg: "hu" })).toContain("12 345");
  });

  it("fester Text: Tausender wie in Ungarn - „1000“ ohne, „10 000“ mit geschütztem Leerzeichen", () => {
    expect(ABZEICHEN_HU["tasten-t-rex"].description).toBe("10 000 helyes leütés.");
    expect(ABZEICHEN_HU["tausend-tasten-tiger"].description).toBe("1000 helyes leütés.");
  });

  it("GEGENPROBE: jede Regel findet ihr Gegenbeispiel", () => {
    expect(regelFehler("Egy kör – hiba nélkül.")).toContain("Gedankenstrich");
    expect(regelFehler("5 rounds hiba nélkül.")).toContain("Fremdwort „rounds“");
    expect(regelFehler("5 Runden hiba nélkül.")).toContain("Fremdwort „Runden“");
    expect(regelFehler("Elérve: 5.")).toContain("Zahl mit Punkt am Satzende");
    expect(regelFehler("legalább 95 % pontosság")).toContain("Prozent mit Leerzeichen");
    expect(regelFehler("10000 helyes leütés")).toContain("fünfstellige Zahl ohne Trenner");
    expect(regelFehler("10 000 helyes leütés")).toContain("Tausender mit gewöhnlichem Leerzeichen");
    expect(regelFehler("Szuper! Nagyon jó!")).toContain("mehr als ein „!“");
    expect(regelFehler("Gépelés vakon.")).toContain("Sperrwort „vakon“");
    // Und das echte Ungarisch geht durch (Akzent am Wortrand stört die Wortgrenze nicht).
    expect(regelFehler("5 kör egyetlen hiba nélkül.")).toEqual([]);
    expect(regelFehler("Három kör a végéig.")).toEqual([]);
  });
});
