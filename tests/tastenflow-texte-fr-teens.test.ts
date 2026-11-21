/**
 * ★★★ Wächter E8b-2 (26.09.2026): die frühen fr-Texte für Jugendliche
 * (Sprosse 9-24, `corpusFrWegFruehTeens.ts` + `serienFrWegFruehTeens.ts`).
 *
 * Nach dem Muster von `tastenflow-texte-fr-kinder.test.ts`, dazu die Regeln,
 * an denen der erste (abgelehnte) Versuch gescheitert war:
 *  - keine Zeile aus der Kinder-Datei, auch nicht fast gleich,
 *  - kein il/elle-Paar desselben Satzes (Auffüllen durch Pronomen- oder
 *    Namenstausch),
 *  - ein Satz beginnt gross; eine klein geschriebene Zeile ist eine
 *    Wortreihe ohne Namen und steht nur an Sprosse 9-13,
 *  - kein Inhaltswort in mehr als 8 Zeilen (Korpus + Serien zusammen).
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

const KORPUS = CORPUS_FR_WEG_FRUEH_TEENS.map((i) => i.text);
const SERIEN_ZEILEN = SERIEN_FR_WEG_FRUEH_TEENS.flatMap((s) => s.etappen.flatMap((e) => e.lines));
const ALLE = [...KORPUS, ...SERIEN_ZEILEN];
const KIDS = [
  ...CORPUS_FR_WEG_FRUEH_KIDS.map((i) => i.text),
  ...SERIEN_FR_WEG_FRUEH_KIDS.flatMap((s) => s.etappen.flatMap((e) => e.lines)),
];

// ── Prüf-Funktionen (einzeln, damit die Gegenproben sie mit Fremdstücken füttern) ──

/** Satzzeichen und verbotene Zeichen: vor Sprosse 34 trägt keine Zeile eines. */
const VERBOTEN = /[.,;:!?"«»()\-—–’‘`…·  ]/;
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
function findePaare(zeilen: string[]): string[] {
  const gesehen = new Map<string, string>();
  const paare: string[] = [];
  for (const z of zeilen) {
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

// ── Korpus ─────────────────────────────────────────────────────────────────

describe("E8b-2: Korpus fr-Weg, frühe Sprossen 9-24 (Jugendliche)", () => {
  it("jede Zeile ist tippbar, liegt an Sprosse 9-24 und minTier stimmt", () => {
    const fehler: string[] = [];
    for (const item of CORPUS_FR_WEG_FRUEH_TEENS) {
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
      if (item.stufen.join() !== "teens") fehler.push(`"${item.text}": stufen ${item.stufen.join()}`);
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

  it("keine Zeile aus der Kinder-Datei, auch nicht fast gleich (Wortmengen-Ähnlichkeit < 0,6)", () => {
    const fehler: string[] = [];
    for (const z of ALLE) {
      for (const k of KIDS) if (fastGleich(z, k)) fehler.push(`"${z}" ~ Kinder: "${k}"`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("kein il/elle-Paar desselben Satzes (Person oder Name getauscht)", () => {
    const paare = findePaare(ALLE);
    expect(paare, paare.join("\n")).toEqual([]);
  });

  it("kein Inhaltswort in mehr als 8 Zeilen (Korpus + Serien zusammen)", () => {
    const zuViel = zuHaeufigeWoerter(ALLE, 8);
    expect(zuViel, zuViel.join("\n")).toEqual([]);
  });

  /**
   * Gemessener Stand 26.09.2026 (E8b-2) - darf nur STEIGEN. Sprosse 9-13 sind
   * bewusst schmal: der Zeichensatz (bis 13 Buchstaben, als Vokale nur
   * e u i) gibt für Jugendliche kaum saubere Sätze her; lieber wenige
   * saubere Zeilen als Füllsätze (Auftrag E8b-2 Regel 1). Sprosse 9 hat
   * darum keine Zeile (die einzige Wortreihe „mes semelles" war Auffüllen).
   */
  // ★ W1 (27.09.2026, BEFUND-2026-09-27-W1-WINDOWS-BLOCKER.md §3): an einzelnen Sprossen
  // GESENKT - Zeilen mit Grossbuchstaben über eine Totaste (À Ê …) kommen seither erst mit
  // der letzten Einheit (späte Lektion), Zeilen mit É/Ç auf Windows-AZERTY nie (Johannes §3.8).
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    10: 2, 11: 2, 12: 1, 13: 9, 14: 24, 15: 24, 16: 26,
    17: 26, 18: 24, 19: 24, 20: 25, 21: 23, 22: 25, 23: 25, 24: 25,
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
    const uebernommen = CORPUS_FR_WEG_FRUEH_TEENS.filter((i) => i.herkunft);
    expect(uebernommen.length).toBeGreaterThan(0);
    expect(uebernommen.length / CORPUS_FR_WEG_FRUEH_TEENS.length).toBeLessThanOrEqual(0.25);
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

  it("die Teens-Zeilen sind in der Sammelstelle angehängt (nach den Kinder-Zeilen)", () => {
    const n = CORPUS_FR_WEG_FRUEH_KIDS.length;
    expect(CORPUS_FR_WEG_FRUEH.slice(0, n)).toEqual(CORPUS_FR_WEG_FRUEH_KIDS);
    expect(CORPUS_FR_WEG_FRUEH.slice(n, n + CORPUS_FR_WEG_FRUEH_TEENS.length)).toEqual(CORPUS_FR_WEG_FRUEH_TEENS);
    for (const s of SERIEN_FR_WEG_FRUEH_TEENS) expect(SERIEN_FR_WEG_FRUEH).toContain(s);
  });
});

// ── Serien ─────────────────────────────────────────────────────────────────

describe("E8b-2: Serien fr-Weg, Sprosse 17-24 (Jugendliche)", () => {
  it("8 Serien, je EINE Etappe mit 12-14 Zeilen, lang fr, nurWeg fr, Stufe teens", () => {
    expect(SERIEN_FR_WEG_FRUEH_TEENS.length).toBe(8);
    for (const s of SERIEN_FR_WEG_FRUEH_TEENS) {
      expect(s.lang, s.slug).toBe("fr");
      expect(s.nurWeg, s.slug).toBe("fr");
      expect(s.stufen, s.slug).toEqual(["teens"]);
      expect(s.etappen.length, s.slug).toBe(1);
      const n = s.etappen[0].lines.length;
      expect(n, `${s.slug}: ${n}`).toBeGreaterThanOrEqual(ETAPPE_MIN_LINES);
      expect(n, `${s.slug}: ${n}`).toBeLessThanOrEqual(14);
    }
  });

  it("jede Serie besteht validateSerie(s, \"fr\")", () => {
    for (const s of SERIEN_FR_WEG_FRUEH_TEENS) {
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
    for (const s of SERIEN_FR_WEG_FRUEH_TEENS) {
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
    const ausserhalb = [
      "fr-weg-teens-le-camp-de-ski", // Schweiz
      "fr-weg-teens-le-jus-de-tamarin", // Senegal
      "fr-weg-teens-le-slam-de-salma", // Tunesien
      "fr-weg-teens-bintou-et-le-basket", // Mali
      "fr-weg-teens-la-vente-de-gaufres", // Belgien
      "fr-weg-teens-une-journee-de-tempete", // Québec
    ];
    for (const slug of ausserhalb) {
      expect(SERIEN_FR_WEG_FRUEH_TEENS.some((s) => s.slug === slug), slug).toBe(true);
    }
    expect(ausserhalb.length / SERIEN_FR_WEG_FRUEH_TEENS.length).toBeGreaterThanOrEqual(1 / 3);
  });
});

// ── Gegenproben: jede Regel schlägt an, wenn man ihr einen Fehler vorlegt ──

describe("E8b-2: Gegenproben der Wächter", () => {
  it("eine Zeile mit „à“ (Sprosse 25) liegt ausserhalb 9-24", () => {
    expect(berechneteSprosse("Il va à Dakar")).toBeGreaterThan(LETZTE_SPROSSE);
  });
  it("ein Bindestrich sperrt die Zeile im Weg „fr“ bis zum Bindestrich", () => {
    // An Sprosse 24 passt dieselbe Zeile ohne Bindestrich, mit ihm nicht.
    expect(fitText("Qu'est ce que tu fais", allowedAtSprosse(LETZTE_SPROSSE), "fr")).not.toBeNull();
    expect(fitText("Qu'est-ce que tu fais", allowedAtSprosse(LETZTE_SPROSSE), "fr")).toBeNull();
    const s = berechneteSprosse("Qu'est-ce que tu fais");
    expect(s === null || s > LETZTE_SPROSSE).toBe(true);
    expect(hatVerbotenesZeichen("Qu'est-ce que tu fais")).toBe(true);
  });
  it("ein Satzzeichen wird gefunden", () => {
    expect(hatVerbotenesZeichen("On joue, puis on rentre")).toBe(true);
  });
  it("klein geschriebener Satz und Name in einer Wortreihe werden gefunden", () => {
    expect(verletztSatzRegel("moussa a un animal")).not.toBeNull();
    expect(verletztSatzRegel("karim a un domino")).not.toBeNull();
    expect(verletztSatzRegel("mes tests et Karim")).not.toBeNull();
    expect(verletztSatzRegel("mes tests")).toBeNull();
  });
  it("eine Kinder-Zeile und eine fast gleiche werden gefunden", () => {
    expect(KIDS.some((k) => fastGleich("les sels", k))).toBe(true);
    expect(KIDS.some((k) => fastGleich("Une ile et un nid", k))).toBe(true);
  });
  it("il/elle- und Namens-Paare werden gefunden", () => {
    expect(findePaare(["Il porte un panier", "Elle porte un panier"]).length).toBe(1);
    expect(findePaare(["Moussa a un animal", "Karim a un animal"]).length).toBe(1);
    expect(findePaare(["Il porte un panier", "Elle mange une pomme"]).length).toBe(0);
  });
  it("ein Wort in neun Zeilen wird gefunden, ein Funktionswort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `Le chat numero ${i} dort`);
    expect(zuHaeufigeWoerter(neun, 8).some((w) => w.startsWith('"chat"'))).toBe(true);
    expect(zuHaeufigeWoerter(neun, 8).some((w) => w.startsWith('"le"'))).toBe(false);
  });
});
