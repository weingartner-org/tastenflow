/**
 * ★★★ WÄCHTER O-INHALT-EL (29.10.2026): DIE ABZEICHEN IN DER GRIECHISCHEN BEDIENUNG (`badgesEl.ts`).
 *
 * Vorbild: die Vollständigkeits-Abschnitte der cs/it-Abzeichen (`badgesCs.ts`, `tastenflow-abzeichen-fr.test.ts`). Geprüft:
 *  · Vollständigkeit: jede ID des englischen Katalogs hat einen griechischen Eintrag, ein Zweitname genau dort, wo Englisch einen
 *    hat; jede Familie hat einen griechischen Namen - der Verteiler liefert für „el" nirgends mehr Englisch;
 *  · jeder Text ganz griechisch (bis auf Zeichen wie ä ö ü ß é und „S"), kein Englisch, kein Deutsch, kein Gedankenstrich;
 *  · kein Personenwort für das Kind (Regel 2), kein Adjektiv am Kind („Είσαι …"), nie „τυφλό";
 *  · Zahlen nach `Intl` „el": Tausenderpunkt auch vierstellig („1.000"), „95%" ohne Leerzeichen, nach 1 die Einzahl; kein „?"
 *    (Regel 7), Monate gross (Regel 9).
 * GEGENPROBE: der englische Katalog (der alte Rückfall) fällt durch, und jede Regel findet ihr Gegenbeispiel.
 */
import { describe, expect, it } from "vitest";
import { ABZEICHEN_EN, ABZEICHEN_GRUPPEN_EN, type AbzeichenZahlen } from "../src/lib/typing/badgesEn";
import { ABZEICHEN_EL, ABZEICHEN_GRUPPEN_EL } from "../src/lib/typing/badgesEl";
import { ABZEICHEN_CS } from "../src/lib/typing/badgesCs";
import { BADGES, badgeBeschreibung, badgeBild, badgeGruppe, badgeName } from "../src/lib/typing/badges";
import { LERNWEGE_LISTE } from "../src/lib/typing/lernweg";
import { satzFehler } from "./helfer/oInhaltNeueWege";

const LATEIN = new Set(["S", "s", "Shift", "email"]);
/** Wege, deren Grundreihe griechisch oder lateinisch ist - die kyrillische Reihe gehört nicht in eine griechische Probe. */
const WEGE_LATEIN_KYRILLISCH = LERNWEGE_LISTE.filter((w) => w !== "bg" && w !== "uk");
const PERSON = /(?<!\p{L})(νικητ|πρωταθλητ|μάστορ|εξερευνητ|ήρωα|ηρωίδα|αρχάρι|βιβλιοφάγ)\p{L}*/iu;
const GESCHLECHT = /(?<!\p{L})(Είσαι|είσαι) \p{L}+/u;
/** Männliche Sachwörter nach einer Zahl brauchen die Zählform (Glossar §2.11) - hier die falsche allgemeine Mehrzahl. */
const ZAEHLFORM_FALSCH = /(?<![\d.,])1 (γύροι|πατήματα|ημέρες|εβδομάδες|μαθήματα|αστέρια|μέρη|περιπέτειες|ιστορίες)(?!\p{L})/u;

const zahlen = (lernweg: AbzeichenZahlen["lernweg"]): AbzeichenZahlen => ({ lektionen: 30, trockeneAbenteuer: 5, fische: 12, pauseTage: 14, lernweg });

function texteVon(id: string): string[] {
  const e = ABZEICHEN_EL[id];
  const beschreibungen = typeof e.description === "function" ? WEGE_LATEIN_KYRILLISCH.map((w) => (e.description as (z: AbzeichenZahlen) => string)(zahlen(w))) : [e.description];
  return [e.name, ...(e.nameNeutral ? [e.nameNeutral] : []), ...beschreibungen, e.bildbeschreibung];
}

function fehler(id: string, text: string): string[] {
  // Fremde Buchstaben, um die es im Abzeichen geht (ä ö ü ß é è ç à ê â î ô û ë ï), und die Zeichen des Weges sind die Sache selbst.
  const ohneZeichen = text.replace(/[äöüßéèçàêâîôûëï]/g, "").replace(/(?<![A-Za-z])[A-Za-z](?![A-Za-z])/g, "");
  const out = satzFehler(id, ohneZeichen, "Greek", LATEIN);
  if (PERSON.test(text)) out.push(`${id}: Personenwort - „${text}"`);
  if (GESCHLECHT.test(text)) out.push(`${id}: Geschlecht - „${text}"`);
  if (/τυφλ/i.test(text)) out.push(`${id}: „τυφλό" - „${text}"`);
  if (text.includes("?")) out.push(`${id}: Fragezeichen ? statt ; - „${text}"`);
  if (ZAEHLFORM_FALSCH.test(text)) out.push(`${id}: Zählform - „${text}"`);
  if (/\d{4,}/.test(text)) out.push(`${id}: Tausender ohne Punkt - „${text}"`);
  if (/\d[  ]\d{3}/.test(text)) out.push(`${id}: Tausender mit Leerzeichen - „${text}"`);
  if (/\d %/.test(text)) out.push(`${id}: Prozent mit Leerzeichen - „${text}"`);
  if (/\d\.$/.test(text)) out.push(`${id}: Zahl mit Punkt am Satzende - „${text}"`);
  return out;
}

describe("Abzeichen griechisch: vollständig", () => {
  it("jede ID des englischen Katalogs hat einen griechischen Eintrag - dazu genau die drei Abzeichen nur für Weg „fr\" (wie cs)", () => {
    expect(Object.keys(ABZEICHEN_EN).filter((id) => !ABZEICHEN_EL[id])).toEqual([]);
    expect(Object.keys(ABZEICHEN_EL).filter((id) => !ABZEICHEN_EN[id]).sort()).toEqual(["accent-circonflexe", "akzente-ziffernreihe", "trema"]);
    expect(Object.keys(ABZEICHEN_EL).sort()).toEqual(Object.keys(ABZEICHEN_CS).sort());
  });

  it("ein Zweitname genau dort, wo Englisch einen hat", () => {
    const anders = Object.keys(ABZEICHEN_EN).filter((id) => Boolean(ABZEICHEN_EN[id].nameNeutral) !== Boolean(ABZEICHEN_EL[id].nameNeutral));
    expect(anders).toEqual([]);
  });

  it("jede Familie hat einen griechischen Namen", () => {
    expect(Object.keys(ABZEICHEN_GRUPPEN_EL).sort()).toEqual(Object.keys(ABZEICHEN_GRUPPEN_EN).sort());
  });

  it("der Verteiler liefert für „bg\" jedes Abzeichen bulgarisch (Name, Zweitname, Beschreibung, Bild, Familie)", () => {
    const englisch: string[] = [];
    for (const def of BADGES) {
      for (const skin of ["kind", "jugend"] as const) if (badgeName(def, skin, "el") === badgeName(def, skin, "en")) englisch.push(`${def.id} Name`);
      if (badgeBeschreibung(def, "el", "el") === badgeBeschreibung(def, "en", "el")) englisch.push(`${def.id} Beschreibung`);
      if (badgeBild(def, "el") === badgeBild(def, "en")) englisch.push(`${def.id} Bild`);
      if (badgeGruppe(def.group, "el") === badgeGruppe(def.group, "en")) englisch.push(`${def.group} Familie`);
    }
    expect(englisch).toEqual([]);
  });
});

describe("Abzeichen griechisch: Hausregeln", () => {
  it("jeder Text: griechisch, kein Englisch, kein Deutsch, kein Personenwort, Zahlen und Prozent nach griechischer Regel", () => {
    const alle: string[] = [];
    for (const id of Object.keys(ABZEICHEN_EL)) for (const t of texteVon(id)) alle.push(...fehler(id, t));
    for (const [g, n] of Object.entries(ABZEICHEN_GRUPPEN_EL)) alle.push(...fehler(`Familie ${g}`, n));
    expect(alle).toEqual([]);
  });

  it("die Grundreihe in „grundstellungs-gorilla\" ist die des Weges (φ ξ δ κ σ λ α)", () => {
    const d = ABZEICHEN_EL["grundstellungs-gorilla"].description as (z: AbzeichenZahlen) => string;
    expect(d(zahlen("el"))).toBe("Ξεκλειδώθηκαν όλα τα πλήκτρα της βασικής θέσης: φ ξ δ κ σ λ α.");
  });

  it("GEGENPROBE: jede Regel findet ihr Gegenbeispiel", () => {
    expect(fehler("x", "Είσαι νικητής.").join(" ")).toMatch(/Personenwort/);
    expect(fehler("x", "Είσαι έτοιμος.").join(" ")).toMatch(/Geschlecht/);
    expect(fehler("x", "1 γύροι χωρίς λάθος").join(" ")).toMatch(/Zählform/);
    expect(fehler("x", "10000 σωστά πατήματα").join(" ")).toMatch(/ohne Punkt/);
    expect(fehler("x", "10 000 σωστά πατήματα").join(" ")).toMatch(/mit Leerzeichen/);
    expect(fehler("x", "ακρίβεια 95 %").join(" ")).toMatch(/Prozent/);
    expect(fehler("x", "Έτοιμο?").join(" ")).toMatch(/Fragezeichen/);
    expect(fehler("x", "Χωρίς λάθη - three rounds").join(" ")).toMatch(/fremde Schrift|Englisch/);
  });

  it("GEGENPROBE: der englische Katalog (der alte Rückfall) fällt durch", () => {
    const alt = Object.values(ABZEICHEN_EN).flatMap((e) => (typeof e.description === "string" ? fehler(e.name, e.description) : []));
    expect(alt.length).toBeGreaterThan(50);
  });
});
