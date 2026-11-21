/**
 * ★★★ Wächter E8c (26.09.2026): die frühen fr-Texte für Erwachsene
 * (Sprosse 9-24, `corpusFrWegFruehErwachsen.ts` + `serienFrWegFruehErwachsen.ts`).
 *
 * Nach dem Muster von `tastenflow-texte-fr-teens.test.ts` (E8b-2), dazu:
 *  - keine Zeile aus der Kinder- ODER der Jugend-Datei, auch nicht fast gleich,
 *  - kein il/elle- oder Namens-Paar - auch nicht mit einer Zeile der Kinder-
 *    oder Jugend-Stufe (eine Zeile, die dort schon als Satzmuster steht, ist
 *    hier Auffüllen),
 *  - „septante", „nonante", „huitante" nie - weder im Korpus noch in einer
 *    Serie (Bauplan §6.5 Regel 4: nur als `{…|…}` oder gar nicht; bis
 *    26.09.2026 durfte eine belgische oder schweizerische Serie es tragen,
 *    der Prüfbericht M3 hat das als Regelbruch gemeldet),
 *  - kein zusammengesetztes Zahlwort („trente mille", „vingt et un"): die neue
 *    Rechtschreibung (F4) schreibt es mit Bindestrich, und der ist im Weg „fr"
 *    vor seiner Sprosse hart - ohne Bindestrich wäre es alte Schreibung.
 * Die Sprosse einer Zeile wird AUSGERECHNET (kleinstes n, ab dem `fitText`
 * mit Weg „fr" sie durchlässt - Bindestrich hart), nicht aus Kommentaren
 * geglaubt. Jede Regel hat eine Gegenprobe (ein Wächter, der nie anschlägt,
 * beweist nichts).
 */
import { describe, it, expect } from "vitest";
import { setLayout } from "../src/lib/typing/layouts";
import { lernwegDef } from "../src/lib/typing/lernweg";
import { fitText, CORPUS, CORPUS_EN } from "../src/lib/typing/corpus";
import { minTierFor } from "../src/lib/typing/tiers";
import { CORPUS_FR_WEG_FRUEH_KIDS } from "../src/lib/typing/corpusFrWegFruehKids";
import { SERIEN_FR_WEG_FRUEH_KIDS } from "../src/lib/typing/serienFrWegFruehKids";
import { CORPUS_FR_WEG_FRUEH_TEENS } from "../src/lib/typing/corpusFrWegFruehTeens";
import { SERIEN_FR_WEG_FRUEH_TEENS } from "../src/lib/typing/serienFrWegFruehTeens";
import { CORPUS_FR_WEG_FRUEH_ERWACHSEN } from "../src/lib/typing/corpusFrWegFruehErwachsen";
import { SERIEN_FR_WEG_FRUEH_ERWACHSEN } from "../src/lib/typing/serienFrWegFruehErwachsen";
import { CORPUS_FR_WEG_FRUEH } from "../src/lib/typing/corpusFrWegFrueh";
import { SERIEN_FR_WEG_FRUEH } from "../src/lib/typing/serienFrWegFrueh";
import { ETAPPE_MIN_LINES, validateSerie } from "../src/lib/typing/serie";
import { validateHerkunft } from "../src/lib/typing/serien";
import { w1GrossArt, w1SerieBetroffen } from "./helfer/w1-grossbuchstaben";

setLayout("fr");
const FR_LETTER_ORDER = lernwegDef("fr").letterOrder;
const LETZTE_SPROSSE = 24;

function allowedAtSprosse(n: number): Set<string> {
  return new Set(FR_LETTER_ORDER.slice(0, n).map((c) => c.toLowerCase()));
}

/** Kleinste Sprosse, ab der die Zeile auf Weg „fr" tippbar ist (null = nie). */
function berechneteSprosse(text: string): number | null {
  for (let n = 1; n <= FR_LETTER_ORDER.length; n++) {
    if (fitText(text, allowedAtSprosse(n), "fr") !== null) return n;
  }
  return null;
}

const zeilenVon = (serien: { etappen: { lines: string[] }[] }[]) =>
  serien.flatMap((s) => s.etappen.flatMap((e) => e.lines));

const KORPUS = CORPUS_FR_WEG_FRUEH_ERWACHSEN.map((i) => i.text);
const SERIEN_ZEILEN = zeilenVon(SERIEN_FR_WEG_FRUEH_ERWACHSEN);
const ALLE = [...KORPUS, ...SERIEN_ZEILEN];
/** Die beiden anderen Altersstufen, Korpus und Serien. */
const ANDERE_STUFEN = [
  ...CORPUS_FR_WEG_FRUEH_KIDS.map((i) => i.text),
  ...zeilenVon(SERIEN_FR_WEG_FRUEH_KIDS),
  ...CORPUS_FR_WEG_FRUEH_TEENS.map((i) => i.text),
  ...zeilenVon(SERIEN_FR_WEG_FRUEH_TEENS),
];

// ── Prüf-Funktionen (einzeln, damit die Gegenproben sie mit Fremdstücken füttern) ──

/** Satzzeichen und verbotene Zeichen: vor Sprosse 34 trägt keine Zeile eines. */
const VERBOTEN = /[.,;:!?"«»()\-—–’‘`…·\u00A0\u202F]/;
function hatVerbotenesZeichen(zeile: string): boolean {
  return VERBOTEN.test(zeile);
}

/**
 * Satz-Regel: Ab Sprosse 14 ist jede Zeile ein Satz (Grossbuchstabe vorn).
 * Eine klein geschriebene Zeile ist eine Wortreihe - dann ohne Namen (kein
 * Grossbuchstabe irgendwo) und nur an Sprosse 9-13.
 */
function verletztSatzRegel(zeile: string): string | null {
  const s = berechneteSprosse(zeile);
  const erstes = zeile[0];
  const gross = erstes !== erstes.toLowerCase();
  if (gross) return null;
  if (/[A-ZÀ-Þ]/.test(zeile)) return "Wortreihe mit Grossbuchstabe (Name?)";
  if (s !== null && s >= 14) return `klein geschrieben an Sprosse ${s} (Satz muss gross beginnen)`;
  return null;
}

function woerter(text: string): Set<string> {
  return new Set(text.toLowerCase().replace(/'/g, "' ").split(/\s+/).filter(Boolean));
}

/** Fast gleich: Wortmengen-Ähnlichkeit (Jaccard) ab 0,6 - oder wortgleich. */
function fastGleich(a: string, b: string): boolean {
  if (a.toLowerCase() === b.toLowerCase()) return true;
  const wa = woerter(a);
  const wb = woerter(b);
  const schnitt = [...wa].filter((w) => wb.has(w)).length;
  return schnitt / new Set([...wa, ...wb]).size >= 0.6;
}

/**
 * il/elle-Paar: Subjekt (Pronomen oder Name am Anfang) und Pronomen/
 * Possessiva werden gleichgesetzt - bleiben zwei Zeilen dann gleich, sind sie
 * dasselbe Satzmuster mit getauschter Person („Il porte un panier / Elle
 * porte un panier", „Karim a un chat / Moussa a un chat").
 */
function paarSchluessel(zeile: string): string {
  return zeile
    .replace(/^(il|elle|ils|elles|je|tu|on|nous|[A-ZÀ-Þ][a-zà-ÿ]+)\s/, "X ")
    .toLowerCase()
    .replace(/\b(il|elle|ils|elles|son|sa|ses|lui|leur|mon|ma|mes|ton|ta|tes)\b/g, "P");
}
/**
 * Paare unter `eigene` - und zwischen `eigene` und `fremde` (dort zählt nur,
 * wenn eine EIGENE Zeile das Muster einer fremden wiederholt).
 */
function findePaare(eigene: string[], fremde: string[] = []): string[] {
  const gesehen = new Map<string, string>();
  for (const z of fremde) if (!gesehen.has(paarSchluessel(z))) gesehen.set(paarSchluessel(z), z);
  const paare: string[] = [];
  for (const z of eigene) {
    const k = paarSchluessel(z);
    const vorher = gesehen.get(k);
    if (vorher !== undefined) paare.push(`"${vorher}" / "${z}"`);
    else gesehen.set(k, z);
  }
  return paare;
}

const FUNKTIONSWOERTER = new Set([
  "je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles", "me", "te", "se", "s'",
  "lui", "leur", "y", "en", "moi", "toi",
  "le", "la", "les", "l'", "un", "une", "des", "du", "de", "d'", "ce", "c'", "cette", "ces", "qu'",
  "mon", "ma", "mes", "ton", "ta", "tes", "son", "sa", "ses", "notre", "nos", "votre", "vos", "leurs",
  "et", "ou", "mais", "que", "qui", "si", "comme", "quand",
  "ne", "pas", "non", "oui",
  "à", "dans", "pour", "avec", "sur", "sous", "par", "vers", "chez", "sans", "avant",
  "est", "es", "sont", "était", "avait", "ai", "a", "as", "ont", "va", "vais", "au",
  "tout", "toute", "tous", "toutes", "plus", "très", "ici", "là", "aussi", "encore", "bien", "trop", "peu",
  "j'", "m'", "t'", "n'",
]);
function zuHaeufigeWoerter(zeilen: string[], grenze: number): string[] {
  const h = new Map<string, number>();
  for (const z of zeilen) {
    const ws = new Set(
      z
        .toLowerCase()
        .replace(/'/g, "' ")
        .split(/\s+/)
        .map((w) => w.replace(/[^a-zà-öø-ÿ']/g, ""))
        .filter((w) => w && !FUNKTIONSWOERTER.has(w)),
    );
    for (const w of ws) h.set(w, (h.get(w) ?? 0) + 1);
  }
  return [...h].filter(([, n]) => n > grenze).map(([w, n]) => `"${w}": ${n} Zeilen`);
}

/** Landesvarianten der Zehner (Bauplan §6.5 Regel 4, §10.1). */
const VARIANTEN_ZAHL = /\b(septante|octante|huitante|nonante)\b/i;

/** Zusammengesetztes Zahlwort ohne Bindestrich = alte Schreibung (F4). */
const ZAHLWORT = "deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingt|vingts|trente|quarante|cinquante|soixante|cent|cents|mille|septante|nonante";
const ZUSAMMENGESETZT = new RegExp(`\\b(${ZAHLWORT})\\s+(et\\s+)?(un|une|${ZAHLWORT})\\b`, "i");
function hatZusammengesetztesZahlwort(zeile: string): boolean {
  return ZUSAMMENGESETZT.test(zeile);
}

// ── Korpus ─────────────────────────────────────────────────────────────────

describe("E8c: Korpus fr-Weg, frühe Sprossen 9-24 (Erwachsene)", () => {
  it("jede Zeile ist tippbar, liegt an Sprosse 9-24 und minTier stimmt", () => {
    const fehler: string[] = [];
    for (const item of CORPUS_FR_WEG_FRUEH_ERWACHSEN) {
      // ★ W1 (27.09.2026): Zeilen mit Grossbuchstaben über eine Totaste (späte Lektion) bzw. mit É/Ç (auf Windows-AZERTY nie) - zentral geprüft in tests/tastenflow-w1-modelle-gegen-windows.test.ts (Helfer tests/helfer/w1-grossbuchstaben.ts).
      if (w1GrossArt(item.text)) continue;
      const s = berechneteSprosse(item.text);
      if (s === null || s < 9 || s > LETZTE_SPROSSE) {
        fehler.push(`"${item.text}": Sprosse ${s}`);
        continue;
      }
      const tier = minTierFor(item.text, "fr");
      if (tier !== item.minTier) fehler.push(`"${item.text}": minTier=${item.minTier}, tatsächlich ${tier}`);
      if (item.nurWeg !== "fr") fehler.push(`"${item.text}": nurWeg fehlt`);
      if (item.stufen.join() !== "erwachsen") fehler.push(`"${item.text}": stufen ${item.stufen.join()}`);
    }
    expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
  });

  it("keine Satzzeichen und keine verbotenen Zeichen (auch kein Bindestrich) - Korpus und Serien", () => {
    const fehler = ALLE.filter(hatVerbotenesZeichen);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("Satz = Grossbuchstabe am Anfang; klein nur als Wortreihe ohne Namen an Sprosse 9-13", () => {
    const fehler: string[] = [];
    for (const z of ALLE) {
      const p = verletztSatzRegel(z);
      if (p) fehler.push(`"${z}": ${p}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("keine Zeile doppelt - weder in sich noch gegen Weg „de“/„en“", () => {
    const fehler: string[] = [];
    const gesehen = new Set<string>();
    for (const z of ALLE) {
      const k = z.toLowerCase();
      if (gesehen.has(k)) fehler.push(`doppelt: "${z}"`);
      gesehen.add(k);
    }
    const andere = new Set([...CORPUS, ...CORPUS_EN].map((i) => i.text.toLowerCase()));
    for (const z of ALLE) if (andere.has(z.toLowerCase())) fehler.push(`auch in de/en: "${z}"`);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("keine Zeile aus der Kinder- oder Jugend-Datei, auch nicht fast gleich (Wortmengen-Ähnlichkeit < 0,6)", () => {
    const fehler: string[] = [];
    for (const z of ALLE) {
      for (const k of ANDERE_STUFEN) if (fastGleich(z, k)) fehler.push(`"${z}" ~ "${k}"`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("kein il/elle- oder Namens-Paar - in sich und gegen Kinder und Jugendliche", () => {
    const paare = findePaare(ALLE, ANDERE_STUFEN);
    expect(paare, paare.join("\n")).toEqual([]);
  });

  it("kein Inhaltswort in mehr als 8 Zeilen (Korpus + Serien zusammen)", () => {
    const zuViel = zuHaeufigeWoerter(ALLE, 8);
    expect(zuViel, zuViel.join("\n")).toEqual([]);
  });

  it("„septante“/„nonante“/„huitante“ nie im Korpus", () => {
    const fehler = KORPUS.filter((z) => VARIANTEN_ZAHL.test(z));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("kein zusammengesetztes Zahlwort ohne Bindestrich (alte Schreibung, F4)", () => {
    const fehler = ALLE.filter(hatZusammengesetztesZahlwort);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /**
   * Gemessener Stand 26.09.2026 (E8c) - darf nur STEIGEN. Sprosse 9-13 sind
   * bewusst schmal: bis Sprosse 13 gibt es als Vokale nur e u i, weder „a"
   * noch „o" - für Erwachsene entstehen daraus kaum Sätze, die jemand sagen
   * würde. Sprosse 9 hat keine Zeile.
   */
  // ★ W1 (27.09.2026, BEFUND-2026-09-27-W1-WINDOWS-BLOCKER.md §3): an einzelnen Sprossen
  // GESENKT - Zeilen mit Grossbuchstaben über eine Totaste (À Ê …) kommen seither erst mit
  // der letzten Einheit (späte Lektion), Zeilen mit É/Ç auf Windows-AZERTY nie (Johannes §3.8).
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    10: 1, 11: 1, 12: 1, 13: 5, 14: 20, 15: 24, 16: 24,
    17: 24, 18: 26, 19: 25, 20: 25, 21: 29, 22: 27, 23: 31, 24: 34,
  };
  it("je Sprosse mindestens so viele Zeilen wie gemessen (berechnete Sprosse)", () => {
    const anzahl = new Map<number, number>();
    for (const z of KORPUS) {
      const s = berechneteSprosse(z);
      if (s !== null) anzahl.set(s, (anzahl.get(s) ?? 0) + 1);
    }
    const zuWenig: string[] = [];
    for (const [s, min] of Object.entries(MINDESTENS_JE_SPROSSE)) {
      const n = anzahl.get(Number(s)) ?? 0;
      if (n < min) zuWenig.push(`Sprosse ${s}: ${n} (mindestens ${min})`);
    }
    expect(zuWenig, zuWenig.join("\n")).toEqual([]);
  });

  it("Tatoeba höchstens ein Viertel, jede Übernahme mit Satznummer, Benutzer und Lizenz", () => {
    const uebernommen = CORPUS_FR_WEG_FRUEH_ERWACHSEN.filter((i) => i.herkunft);
    expect(uebernommen.length).toBeGreaterThan(0);
    expect(uebernommen.length / CORPUS_FR_WEG_FRUEH_ERWACHSEN.length).toBeLessThanOrEqual(0.25);
    for (const i of uebernommen) {
      const h = i.herkunft!;
      expect(h.quelle, i.text).toBe("Tatoeba");
      expect(h.lizenz, i.text).toBe("CC BY 2.0 FR");
      expect(h.autor, i.text).toBeTruthy();
      expect(h.fundstelle, i.text).toMatch(/^https:\/\/tatoeba\.org\/fr\/sentences\/show\/\d+ \(Original: /);
      expect(validateHerkunft(h), i.text).toEqual([]);
      // Einzige Änderung am Original: das Schlusszeichen fehlt.
      const original = h.fundstelle!.replace(/^.*\(Original: /, "").replace(/\)$/, "");
      expect(original.replace(/\s*[.?!]+$/, ""), i.text).toBe(i.text);
    }
  });

  it("die Erwachsenen-Zeilen sind in der Sammelstelle angehängt (nach Kindern und Jugendlichen)", () => {
    const n = CORPUS_FR_WEG_FRUEH_KIDS.length + CORPUS_FR_WEG_FRUEH_TEENS.length;
    expect(CORPUS_FR_WEG_FRUEH.slice(0, CORPUS_FR_WEG_FRUEH_KIDS.length)).toEqual(CORPUS_FR_WEG_FRUEH_KIDS);
    expect(CORPUS_FR_WEG_FRUEH.slice(n, n + CORPUS_FR_WEG_FRUEH_ERWACHSEN.length)).toEqual(
      CORPUS_FR_WEG_FRUEH_ERWACHSEN,
    );
    for (const s of SERIEN_FR_WEG_FRUEH_ERWACHSEN) expect(SERIEN_FR_WEG_FRUEH).toContain(s);
  });
});

// ── Serien ─────────────────────────────────────────────────────────────────

/** Serien, die ausserhalb Frankreichs spielen - mit Land. */
const AUSSERHALB: Record<string, string> = {
  "fr-weg-erwachsen-l-apprenti-de-tetouan": "Marokko",
  "fr-weg-erwachsen-la-tontine": "Senegal",
  "fr-weg-erwachsen-le-premier-juillet": "Québec",
  "fr-weg-erwachsen-la-soupe-joumou": "Haïti",
  "fr-weg-erwachsen-quatre-langues": "Schweiz",
  "fr-weg-erwachsen-le-carnaval-de-binche": "Belgien",
};

describe("E8c: Serien fr-Weg, Sprosse 17-24 (Erwachsene)", () => {
  it("8 Serien, je EINE Etappe mit 12-14 Zeilen, lang fr, nurWeg fr, Stufe erwachsen", () => {
    expect(SERIEN_FR_WEG_FRUEH_ERWACHSEN.length).toBe(8);
    for (const s of SERIEN_FR_WEG_FRUEH_ERWACHSEN) {
      expect(s.lang, s.slug).toBe("fr");
      expect(s.nurWeg, s.slug).toBe("fr");
      expect(s.stufen, s.slug).toEqual(["erwachsen"]);
      expect(s.etappen.length, s.slug).toBe(1);
      const n = s.etappen[0].lines.length;
      expect(n, `${s.slug}: ${n}`).toBeGreaterThanOrEqual(ETAPPE_MIN_LINES);
      expect(n, `${s.slug}: ${n}`).toBeLessThanOrEqual(14);
    }
  });

  it("jede Serie besteht validateSerie(s, \"fr\")", () => {
    for (const s of SERIEN_FR_WEG_FRUEH_ERWACHSEN) {
      const v = validateSerie(s, "fr");
      expect(
        // ★ W1: bei betroffenen Serien ist der Tier die gewollte Folge (siehe tests/helfer/w1-grossbuchstaben.ts).
        v.problems.filter((p) => !(w1SerieBetroffen(s) && /minTier|nie freischaltbar/.test(p))),
        s.slug,
      ).toEqual([]);
    }
  });

  it("jede Serie öffnet an Sprosse 17-24 (alle Zeilen tippbar, keine spätere Taste)", () => {
    const fehler: string[] = [];
    for (const s of SERIEN_FR_WEG_FRUEH_ERWACHSEN) {
      // ★ W1 (27.09.2026): Zeilen mit Grossbuchstaben über eine Totaste (späte Lektion) bzw. mit É/Ç (auf Windows-AZERTY nie) - zentral geprüft in tests/tastenflow-w1-modelle-gegen-windows.test.ts (Helfer tests/helfer/w1-grossbuchstaben.ts).
      if (w1SerieBetroffen(s)) continue;
      const sprossen = s.etappen[0].lines.map((l) => berechneteSprosse(l));
      if (sprossen.some((x) => x === null)) fehler.push(`${s.slug}: Zeile passt nie`);
      const max = Math.max(...sprossen.map((x) => x ?? 99));
      if (max < 17 || max > LETZTE_SPROSSE) fehler.push(`${s.slug}: öffnet an Sprosse ${max}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("mindestens ein Drittel spielt ausserhalb Frankreichs (Bauplan §6.5 Regel 8)", () => {
    for (const slug of Object.keys(AUSSERHALB)) {
      expect(SERIEN_FR_WEG_FRUEH_ERWACHSEN.some((s) => s.slug === slug), slug).toBe(true);
    }
    expect(Object.keys(AUSSERHALB).length / SERIEN_FR_WEG_FRUEH_ERWACHSEN.length).toBeGreaterThanOrEqual(1 / 3);
  });

  it("„septante“ und Verwandte in keiner Serie - auch nicht in Belgien oder der Schweiz (Regel 4, Prüfbericht M3)", () => {
    const fehler: string[] = [];
    for (const s of SERIEN_FR_WEG_FRUEH_ERWACHSEN) {
      for (const z of s.etappen[0].lines) {
        if (VARIANTEN_ZAHL.test(z)) fehler.push(`${s.slug}: "${z}"`);
      }
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });
});

// ── Gegenproben: jede Regel schlägt an, wenn man ihr einen Fehler vorlegt ──

describe("E8c: Gegenproben der Wächter", () => {
  it("eine Zeile mit „à“ (Sprosse 25) liegt ausserhalb 9-24", () => {
    expect(berechneteSprosse("Il va à Dakar")).toBeGreaterThan(LETZTE_SPROSSE);
  });
  it("ein Bindestrich sperrt die Zeile im Weg „fr“ bis zum Bindestrich", () => {
    expect(fitText("Le sous sol est humide", allowedAtSprosse(LETZTE_SPROSSE), "fr")).not.toBeNull();
    expect(fitText("Le sous-sol est humide", allowedAtSprosse(LETZTE_SPROSSE), "fr")).toBeNull();
    expect(hatVerbotenesZeichen("Le sous-sol est humide")).toBe(true);
  });
  it("ein Satzzeichen wird gefunden", () => {
    expect(hatVerbotenesZeichen("Il paie le loyer, puis il part")).toBe(true);
  });
  it("klein geschriebener Satz und Name in einer Wortreihe werden gefunden", () => {
    expect(verletztSatzRegel("salif a eu une amende")).not.toBeNull();
    expect(verletztSatzRegel("mes dettes et Salif")).not.toBeNull();
    expect(verletztSatzRegel("mes dettes")).toBeNull();
  });
  it("eine Kinder- und eine Jugend-Zeile (auch fast gleich) werden gefunden", () => {
    expect(ANDERE_STUFEN.some((k) => fastGleich("La salade est fade", k))).toBe(true); // Kinder: „La salade est fine"
    expect(ANDERE_STUFEN.some((k) => fastGleich("Je suis de nuit", k))).toBe(true); // Jugend: „Je suis de Suisse"
  });
  it("il/elle- und Namens-Paare werden gefunden, auch gegen eine andere Stufe", () => {
    expect(findePaare(["Il vit en colocation", "Elle vit en colocation"]).length).toBe(1);
    expect(findePaare(["Salif a eu une amende", "Lamine a eu une amende"]).length).toBe(1);
    expect(findePaare(["Il se sent seul"], ["Elle se sent seule"]).length).toBe(0); // anderes Wort
    expect(findePaare(["Il a un animal malade"], ["Il a un animal malade"]).length).toBe(1);
    expect(findePaare(["Moussa a un domino"], ["Karim a un domino"]).length).toBe(1);
    expect(findePaare(["Il vit en colocation", "Elle paie le loyer"]).length).toBe(0);
  });
  it("ein Wort in neun Zeilen wird gefunden, ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `Le loyer numero ${i} monte`);
    expect(zuHaeufigeWoerter(neun, 8).some((w) => w.startsWith('"loyer"'))).toBe(true);
    expect(zuHaeufigeWoerter(neun, 8).some((w) => w.startsWith('"le"'))).toBe(false);
  });
  it("„septante“ wird gefunden, „sept“ nicht", () => {
    expect(VARIANTEN_ZAHL.test("Lucien a septante ans")).toBe(true);
    expect(VARIANTEN_ZAHL.test("Le bus de sept heures")).toBe(false);
  });
  it("ein zusammengesetztes Zahlwort ohne Bindestrich wird gefunden, ein einfaches nicht", () => {
    expect(hatZusammengesetztesZahlwort("Il gagne trente mille euros")).toBe(true);
    expect(hatZusammengesetztesZahlwort("Il a vingt et un ans")).toBe(true);
    expect(hatZusammengesetztesZahlwort("Nous avons déménagé trois fois")).toBe(false);
    expect(hatZusammengesetztesZahlwort("Le bus de sept heures")).toBe(false);
  });
});
