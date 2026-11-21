/**
 * ★★★ WÄCHTER O-INHALT-UK (29.10.2026): DIE ABZEICHEN IN DER UKRAINISCHEN BEDIENUNG (`badgesUk.ts`).
 *
 * Vorbild: die Vollständigkeits-Abschnitte der cs/it-Abzeichen (`badgesCs.ts`, `tastenflow-abzeichen-fr.test.ts`). Geprüft:
 *  · Vollständigkeit: jede ID des englischen Katalogs hat einen ukrainischen Eintrag, ein Zweitname genau dort, wo Englisch einen
 *    hat; jede Familie hat einen ukrainischen Namen - der Verteiler liefert für „uk" nirgends mehr Englisch;
 *  · jeder Text ganz kyrillisch (bis auf Zeichen wie ä ö ü ß é und „S"), kein Englisch, kein Deutsch, kein Gedankenstrich;
 *  · kein Personenwort für das Kind (Regel 2), keine Vergangenheit am Kind („ти відкрив"), nie „сліпий";
 *  · Mehrzahl nach `Intl.PluralRules("uk")` (one · few · many: „3 чисті раунди", „7 чистих раундів"), Zahlen ab vier Stellen mit
 *    geschütztem Leerzeichen („1 000"), „95%" ohne Leerzeichen, keine Kriegs- und Waffenwörter (Glossar §2.4), kein Russismus.
 * GEGENPROBE: der englische Katalog (der alte Rückfall) fällt durch, und jede Regel findet ihr Gegenbeispiel.
 */
import { describe, expect, it } from "vitest";
import { ABZEICHEN_EN, ABZEICHEN_GRUPPEN_EN, type AbzeichenZahlen } from "../src/lib/typing/badgesEn";
import { ABZEICHEN_UK, ABZEICHEN_GRUPPEN_UK } from "../src/lib/typing/badgesUk";
import { ABZEICHEN_CS } from "../src/lib/typing/badgesCs";
import { BADGES, badgeBeschreibung, badgeBild, badgeGruppe, badgeName } from "../src/lib/typing/badges";
import { LERNWEGE_LISTE } from "../src/lib/typing/lernweg";
import { satzFehler } from "./helfer/oInhaltNeueWege";

const LATEIN = new Set(["S", "s", "Shift"]);
/** Wege, deren Grundreihe kyrillisch oder lateinisch ist - die griechische Reihe gehört nicht in eine ukrainische Probe. */
const WEGE_LATEIN_KYRILLISCH = LERNWEGE_LISTE.filter((w) => w !== "el");
const PERSON = /(?<!\p{L})(майстер(?!н)|чемпіон|переможець|переможниця|дослідник|полярник|початківець|герой)\p{L}*/iu;
const GESCHLECHT = /(?<!\p{L})(ти|Ти) \p{L}+(в|ла)(?!\p{L})|(?<!\p{L})(готовий|готова|радий|рада)(?!\p{L})/u;
/** Kriegs- und Waffenwörter (Glossar §2.4, Bauplan §3) - auch nicht als Bild. */
const KRIEG = /(?<!\p{L})(ракет|снайпер|штурм|бій|бої|танк|зброя|постріл|вибух|солдат)\p{L}*/iu;
/** Russische Buchstaben in einem ukrainischen Satz. */
const RUSSISCH = /[ыэёъ]/;
/** Männliche Sachwörter nach einer Zahl brauchen die Zählform (Glossar §2.11) - hier die falsche allgemeine Mehrzahl. */
/** Wörter mit ihrer Mehrzahl-Kategorie (Glossar §2.11) - nach einer Zahl muss sie die der Zahl sein. */
const FORM: Readonly<Record<string, "one" | "few" | "many">> = {
  раунд: "one", раунди: "few", раундів: "many", день: "one", дні: "few", днів: "many", тиждень: "one", тижні: "few", тижнів: "many",
  урок: "one", уроки: "few", уроків: "many", історія: "one", історії: "few", історій: "many", частина: "one", частини: "few",
  частин: "many", пригода: "one", пригоди: "few", пригод: "many", чисті: "few", чистих: "many", різні: "few", різних: "many",
  завершені: "few", завершених: "many", правильні: "few", правильних: "many", зірка: "one", зірки: "few", зірок: "many",
};
function zaehlformFehler(text: string): boolean {
  for (const m of text.matchAll(/(\d[\d\u00a0]*) (\p{L}+)/gu)) {
    const erwartet = FORM[m[2]];
    if (!erwartet) continue;
    const n = Number(m[1].replace(/\u00a0/g, ""));
    // „на 3 зірки" ist der Akkusativ nach „на", kein Zählausdruck.
    if (text.slice(0, m.index).endsWith("на ")) continue;
    if (new Intl.PluralRules("uk-UA").select(n) !== erwartet) return true;
  }
  return false;
}

const zahlen = (lernweg: AbzeichenZahlen["lernweg"]): AbzeichenZahlen => ({ lektionen: 30, trockeneAbenteuer: 5, fische: 12, pauseTage: 14, lernweg });

function texteVon(id: string): string[] {
  const e = ABZEICHEN_UK[id];
  const beschreibungen = typeof e.description === "function" ? WEGE_LATEIN_KYRILLISCH.map((w) => (e.description as (z: AbzeichenZahlen) => string)(zahlen(w))) : [e.description];
  return [e.name, ...(e.nameNeutral ? [e.nameNeutral] : []), ...beschreibungen, e.bildbeschreibung];
}

function fehler(id: string, text: string): string[] {
  // Fremde Buchstaben, um die es im Abzeichen geht (ä ö ü ß é è ç à ê â î ô û ë ï), und die Zeichen des Weges sind die Sache selbst.
  const ohneZeichen = text.replace(/[äöüßéèçàêâîôûëï]/g, "").replace(/(?<![A-Za-z])[A-Za-z](?![A-Za-z])/g, "");
  const out = satzFehler(id, ohneZeichen, "Cyrillic", LATEIN);
  if (PERSON.test(text)) out.push(`${id}: Personenwort - „${text}"`);
  if (GESCHLECHT.test(text)) out.push(`${id}: Geschlecht - „${text}"`);
  if (/сліп/i.test(text)) out.push(`${id}: „сліпий" - „${text}"`);
  if (KRIEG.test(text)) out.push(`${id}: Kriegswort - „${text}"`);
  if (RUSSISCH.test(text)) out.push(`${id}: russischer Buchstabe - „${text}"`);
  if (zaehlformFehler(text)) out.push(`${id}: Zählform - „${text}"`);
  if (/\d{4,}/.test(text)) out.push(`${id}: Tausender ohne geschütztes Leerzeichen - „${text}"`);
  if (/\d \d{3}/.test(text)) out.push(`${id}: Tausender mit gewöhnlichem Leerzeichen - „${text}"`);
  if (/\d %/.test(text)) out.push(`${id}: Prozent mit Leerzeichen - „${text}"`);
  if (/\d\.$/.test(text)) out.push(`${id}: Zahl mit Punkt am Satzende - „${text}"`);
  return out;
}

describe("Abzeichen ukrainisch: vollständig", () => {
  it("jede ID des englischen Katalogs hat einen ukrainischen Eintrag - dazu genau die drei Abzeichen nur für Weg „fr\" (wie cs)", () => {
    expect(Object.keys(ABZEICHEN_EN).filter((id) => !ABZEICHEN_UK[id])).toEqual([]);
    expect(Object.keys(ABZEICHEN_UK).filter((id) => !ABZEICHEN_EN[id]).sort()).toEqual(["accent-circonflexe", "akzente-ziffernreihe", "trema"]);
    expect(Object.keys(ABZEICHEN_UK).sort()).toEqual(Object.keys(ABZEICHEN_CS).sort());
  });

  it("ein Zweitname genau dort, wo Englisch einen hat", () => {
    const anders = Object.keys(ABZEICHEN_EN).filter((id) => Boolean(ABZEICHEN_EN[id].nameNeutral) !== Boolean(ABZEICHEN_UK[id].nameNeutral));
    expect(anders).toEqual([]);
  });

  it("jede Familie hat einen ukrainischen Namen", () => {
    expect(Object.keys(ABZEICHEN_GRUPPEN_UK).sort()).toEqual(Object.keys(ABZEICHEN_GRUPPEN_EN).sort());
  });

  it("der Verteiler liefert für „bg\" jedes Abzeichen bulgarisch (Name, Zweitname, Beschreibung, Bild, Familie)", () => {
    const englisch: string[] = [];
    for (const def of BADGES) {
      for (const skin of ["kind", "jugend"] as const) if (badgeName(def, skin, "uk") === badgeName(def, skin, "en")) englisch.push(`${def.id} Name`);
      if (badgeBeschreibung(def, "uk", "uk") === badgeBeschreibung(def, "en", "uk")) englisch.push(`${def.id} Beschreibung`);
      if (badgeBild(def, "uk") === badgeBild(def, "en")) englisch.push(`${def.id} Bild`);
      if (badgeGruppe(def.group, "uk") === badgeGruppe(def.group, "en")) englisch.push(`${def.group} Familie`);
    }
    expect(englisch).toEqual([]);
  });
});

describe("Abzeichen ukrainisch: Hausregeln", () => {
  it("jeder Text: kyrillisch, kein Englisch, kein Deutsch, kein Personenwort, Mehrzahl, Zahlen und Prozent nach ukrainischer Regel", () => {
    const alle: string[] = [];
    for (const id of Object.keys(ABZEICHEN_UK)) for (const t of texteVon(id)) alle.push(...fehler(id, t));
    for (const [g, n] of Object.entries(ABZEICHEN_GRUPPEN_UK)) alle.push(...fehler(`Familie ${g}`, n));
    expect(alle).toEqual([]);
  });

  it("die Grundreihe in „grundstellungs-gorilla\" ist die des Weges (а о в л і д п р)", () => {
    const d = ABZEICHEN_UK["grundstellungs-gorilla"].description as (z: AbzeichenZahlen) => string;
    expect(d(zahlen("uk"))).toBe("Відкрито всі клавіші основного положення: а о в л і д п р.");
  });

  it("GEGENPROBE: jede Regel findet ihr Gegenbeispiel", () => {
    expect(fehler("x", "Ти чемпіон.").join(" ")).toMatch(/Personenwort/);
    expect(fehler("x", "Ти відкрив літеру.").join(" ")).toMatch(/Geschlecht/);
    expect(fehler("x", "5 раунди без помилки.").join(" ")).toMatch(/Zählform/);
    expect(fehler("x", "3 чистих раундів.").join(" ")).toMatch(/Zählform/);
    expect(fehler("x", "1000 правильних натискань").join(" ")).toMatch(/ohne geschütztes/);
    expect(fehler("x", "10 000 правильних натискань").join(" ")).toMatch(/gewöhnlichem/);
    expect(fehler("x", "точність 95 %").join(" ")).toMatch(/Prozent/);
    expect(fehler("x", "ракета, що злітає").join(" ")).toMatch(/Kriegswort/);
    expect(fehler("x", "мыло").join(" ")).toMatch(/russischer/);
    expect(fehler("x", "Без помилок - three rounds").join(" ")).toMatch(/fremde Schrift|Englisch/);
  });

  it("GEGENPROBE: der englische Katalog (der alte Rückfall) fällt durch", () => {
    const alt = Object.values(ABZEICHEN_EN).flatMap((e) => (typeof e.description === "string" ? fehler(e.name, e.description) : []));
    expect(alt.length).toBeGreaterThan(50);
  });
});
