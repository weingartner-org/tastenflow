/**
 * ★★★ WÄCHTER O-INHALT-BG (29.10.2026): DIE ABZEICHEN IN DER BULGARISCHEN BEDIENUNG (`badgesBg.ts`).
 *
 * Vorbild: die Vollständigkeits-Abschnitte der cs/it-Abzeichen (`badgesCs.ts`, `tastenflow-abzeichen-fr.test.ts`). Geprüft:
 *  · Vollständigkeit: jede ID des englischen Katalogs hat einen bulgarischen Eintrag, ein Zweitname genau dort, wo Englisch einen
 *    hat; jede Familie hat einen bulgarischen Namen - der Verteiler liefert für „bg" nirgends mehr Englisch;
 *  · jeder Text ganz kyrillisch (bis auf Zeichen wie ä ö ü ß é und „S"), kein Englisch, kein Deutsch, kein Gedankenstrich;
 *  · kein Personenwort für das Kind (Regel 2), kein l-Partizip der 2. Person (Falle 6), nie „сляпо";
 *  · Zählform nach Zahlen (Falle 7: „5 кръга", nie „5 кръгове"), fünfstellige Zahlen mit geschütztem Leerzeichen, „95%" ohne
 *    Leerzeichen, keine Zahl mit Punkt am Satzende.
 * GEGENPROBE: der englische Katalog (der alte Rückfall) fällt durch, und jede Regel findet ihr Gegenbeispiel.
 */
import { describe, expect, it } from "vitest";
import { ABZEICHEN_EN, ABZEICHEN_GRUPPEN_EN, type AbzeichenZahlen } from "../src/lib/typing/badgesEn";
import { ABZEICHEN_BG, ABZEICHEN_GRUPPEN_BG } from "../src/lib/typing/badgesBg";
import { ABZEICHEN_CS } from "../src/lib/typing/badgesCs";
import { BADGES, badgeBeschreibung, badgeBild, badgeGruppe, badgeName } from "../src/lib/typing/badges";
import { LERNWEGE_LISTE } from "../src/lib/typing/lernweg";
import { satzFehler } from "./helfer/oInhaltNeueWege";

const LATEIN = new Set(["S", "s", "Shift"]);
/** Wege, deren Grundreihe kyrillisch oder lateinisch ist - die griechische Reihe gehört nicht in eine bulgarische Probe. */
const WEGE_LATEIN_KYRILLISCH = LERNWEGE_LISTE.filter((w) => w !== "el");
const PERSON = /(?<!\p{L})(шампион|победител|майстор(?!ств)|покорител|изследовател|герой|начинаещ|отличник)\p{L}*/iu;
const GESCHLECHT = /(?<!\p{L})си \p{L}+(л|ла|ли)(?!\p{L})|(?<!\p{L})(успял|готов|сигурен си)/u;
/** Männliche Sachwörter nach einer Zahl brauchen die Zählform (Glossar §2.11) - hier die falsche allgemeine Mehrzahl. */
const ZAEHLFORM_FALSCH = /\d[\d ]* (кръгове|уроци|знаци|клавиши|ден)(?!\p{L})/u;

const zahlen = (lernweg: AbzeichenZahlen["lernweg"]): AbzeichenZahlen => ({ lektionen: 30, trockeneAbenteuer: 5, fische: 12, pauseTage: 14, lernweg });

function texteVon(id: string): string[] {
  const e = ABZEICHEN_BG[id];
  const beschreibungen = typeof e.description === "function" ? WEGE_LATEIN_KYRILLISCH.map((w) => (e.description as (z: AbzeichenZahlen) => string)(zahlen(w))) : [e.description];
  return [e.name, ...(e.nameNeutral ? [e.nameNeutral] : []), ...beschreibungen, e.bildbeschreibung];
}

function fehler(id: string, text: string): string[] {
  // Fremde Buchstaben, um die es im Abzeichen geht (ä ö ü ß é è ç à ê â î ô û ë ï), und die Zeichen des Weges sind die Sache selbst.
  const ohneZeichen = text.replace(/[äöüßéèçàêâîôûëï]/g, "").replace(/(?<![A-Za-z])[A-Za-z](?![A-Za-z])/g, "");
  const out = satzFehler(id, ohneZeichen, "Cyrillic", LATEIN);
  if (PERSON.test(text)) out.push(`${id}: Personenwort - „${text}"`);
  if (GESCHLECHT.test(text)) out.push(`${id}: Geschlecht - „${text}"`);
  if (/сляп/i.test(text)) out.push(`${id}: „сляпо" - „${text}"`);
  if (ZAEHLFORM_FALSCH.test(text)) out.push(`${id}: Zählform - „${text}"`);
  if (/\d \d{3}\b/.test(text)) out.push(`${id}: Tausender ohne geschütztes Leerzeichen - „${text}"`);
  if (/\b\d{1,3} \d{3}\b/.test(text.replace(/ /g, " ")) && /\b\d{4}\b/.test(text) === false && /\b1 000\b|\b2 000\b/.test(text))
    out.push(`${id}: vierstellig mit Leerzeichen - „${text}"`);
  if (/\d %/.test(text)) out.push(`${id}: Prozent mit Leerzeichen - „${text}"`);
  if (/\d\.$/.test(text)) out.push(`${id}: Zahl mit Punkt am Satzende - „${text}"`);
  return out;
}

describe("Abzeichen bulgarisch: vollständig", () => {
  it("jede ID des englischen Katalogs hat einen bulgarischen Eintrag - dazu genau die drei Abzeichen nur für Weg „fr\" (wie cs)", () => {
    expect(Object.keys(ABZEICHEN_EN).filter((id) => !ABZEICHEN_BG[id])).toEqual([]);
    expect(Object.keys(ABZEICHEN_BG).filter((id) => !ABZEICHEN_EN[id]).sort()).toEqual(["accent-circonflexe", "akzente-ziffernreihe", "trema"]);
    expect(Object.keys(ABZEICHEN_BG).sort()).toEqual(Object.keys(ABZEICHEN_CS).sort());
  });

  it("ein Zweitname genau dort, wo Englisch einen hat", () => {
    const anders = Object.keys(ABZEICHEN_EN).filter((id) => Boolean(ABZEICHEN_EN[id].nameNeutral) !== Boolean(ABZEICHEN_BG[id].nameNeutral));
    expect(anders).toEqual([]);
  });

  it("jede Familie hat einen bulgarischen Namen", () => {
    expect(Object.keys(ABZEICHEN_GRUPPEN_BG).sort()).toEqual(Object.keys(ABZEICHEN_GRUPPEN_EN).sort());
  });

  it("der Verteiler liefert für „bg\" jedes Abzeichen bulgarisch (Name, Zweitname, Beschreibung, Bild, Familie)", () => {
    const englisch: string[] = [];
    for (const def of BADGES) {
      for (const skin of ["kind", "jugend"] as const) if (badgeName(def, skin, "bg") === badgeName(def, skin, "en")) englisch.push(`${def.id} Name`);
      if (badgeBeschreibung(def, "bg", "bg") === badgeBeschreibung(def, "en", "bg")) englisch.push(`${def.id} Beschreibung`);
      if (badgeBild(def, "bg") === badgeBild(def, "en")) englisch.push(`${def.id} Bild`);
      if (badgeGruppe(def.group, "bg") === badgeGruppe(def.group, "en")) englisch.push(`${def.group} Familie`);
    }
    expect(englisch).toEqual([]);
  });
});

describe("Abzeichen bulgarisch: Hausregeln", () => {
  it("jeder Text: kyrillisch, kein Englisch, kein Deutsch, kein Personenwort, Zählform, Zahlen und Prozent nach bulgarischer Regel", () => {
    const alle: string[] = [];
    for (const id of Object.keys(ABZEICHEN_BG)) for (const t of texteVon(id)) alle.push(...fehler(id, t));
    for (const [g, n] of Object.entries(ABZEICHEN_GRUPPEN_BG)) alle.push(...fehler(`Familie ${g}`, n));
    expect(alle).toEqual([]);
  });

  it("die Grundreihe in „grundstellungs-gorilla\" ist die des Weges (BDS: о т а н в м я)", () => {
    const d = ABZEICHEN_BG["grundstellungs-gorilla"].description as (z: AbzeichenZahlen) => string;
    expect(d(zahlen("bg"))).toBe("Отключени са всички клавиши от изходната позиция: о т а н в м я.");
  });

  it("GEGENPROBE: jede Regel findet ihr Gegenbeispiel", () => {
    expect(fehler("x", "Ти си шампион.").join(" ")).toMatch(/Personenwort/);
    expect(fehler("x", "Ти си написал ред.").join(" ")).toMatch(/Geschlecht/);
    expect(fehler("x", "5 кръгове без грешка").join(" ")).toMatch(/Zählform/);
    expect(fehler("x", "10 000 верни знака").join(" ")).toMatch(/Tausender/);
    expect(fehler("x", "1 000 кръга").join(" ")).toMatch(/vierstellig/);
    expect(fehler("x", "точност 95 %").join(" ")).toMatch(/Prozent/);
    expect(fehler("x", "Ниво 5.").join(" ")).toMatch(/Punkt am Satzende/);
    expect(fehler("x", "Без грешки - three rounds").join(" ")).toMatch(/fremde Schrift|Englisch/);
  });

  it("GEGENPROBE: der englische Katalog (der alte Rückfall) fällt durch", () => {
    const alt = Object.values(ABZEICHEN_EN).flatMap((e) => (typeof e.description === "string" ? fehler(e.name, e.description) : []));
    expect(alt.length).toBeGreaterThan(50);
  });
});
