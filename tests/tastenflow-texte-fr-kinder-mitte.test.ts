/**
 * ★★★ Wächter E9-kids (26.09.2026): die fr-Texte für Kinder an den Sprossen
 * 25-34 - dort kommen die restlichen Buchstaben `à ^ è x z y ç ù w ¨` dazu
 * (`corpusFrMitteKids.ts` + `serienFrMitteKids.ts`).
 *
 * Nach dem Muster von `tastenflow-texte-fr-teens.test.ts`:
 *  - die Sprosse einer Zeile wird AUSGERECHNET (kleinstes n, ab dem `fitText`
 *    mit Weg „fr" und Windows-AZERTY sie durchlässt), nicht aus Kommentaren
 *    geglaubt - eine Zeile an Sprosse 25 trägt also wirklich ein kleines „à"
 *    (ein „À" am Satzanfang wird auf Windows-AZERTY zu „A"),
 *  - keine Zeile aus einer anderen fr-Datei, auch nicht fast gleich,
 *  - kein il/elle- oder Namens-Paar (auch nicht gegen die anderen Dateien),
 *  - kein Inhaltswort in mehr als 8 Zeilen (Korpus + Serien zusammen),
 *  - noch keine Satzzeichen, kein Bindestrich, kein „œ", nur neue Schreibung.
 * Jede Regel hat eine Gegenprobe (ein Wächter, der nie anschlägt, beweist
 * nichts).
 */
import { describe, it, expect } from "vitest";
import { setLayout } from "../src/lib/typing/layouts";
import { lernwegDef } from "../src/lib/typing/lernweg";
import { fitText, CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { minTierFor } from "../src/lib/typing/tiers";
import { CORPUS_FR_WEG_FRUEH } from "../src/lib/typing/corpusFrWegFrueh";
import { SERIEN_FR_WEG_FRUEH } from "../src/lib/typing/serienFrWegFrueh";
import { CORPUS_FR_MITTE_KIDS } from "../src/lib/typing/corpusFrMitteKids";
import { SERIEN_FR_MITTE_KIDS } from "../src/lib/typing/serienFrMitteKids";
import { CORPUS_FR_MITTE } from "../src/lib/typing/corpusFrMitte";
import { SERIEN_FR_MITTE } from "../src/lib/typing/serienFrMitte";
import { SERIEN } from "../src/lib/typing/serien";
import { ETAPPE_MIN_LINES, validateSerie } from "../src/lib/typing/serie";
import { validateHerkunft } from "../src/lib/typing/serien";
import { w1GrossArt, w1SerieBetroffen } from "./helfer/w1-grossbuchstaben";

setLayout("fr");
const FR_LETTER_ORDER = lernwegDef("fr").letterOrder;
const ERSTE_SPROSSE = 25;
const LETZTE_SPROSSE = FR_LETTER_ORDER.length; // 34 - „¨" ist der letzte Buchstabe

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

const KORPUS = CORPUS_FR_MITTE_KIDS.map((i) => i.text);
const SERIEN_ZEILEN = zeilenVon(SERIEN_FR_MITTE_KIDS);
const ALLE = [...KORPUS, ...SERIEN_ZEILEN];
/** Alle ANDEREN französischen Zeilen (frühe Sprossen, alle drei Stufen). */
const ANDERE = [...CORPUS_FR_WEG_FRUEH.map((i) => i.text), ...zeilenVon(SERIEN_FR_WEG_FRUEH)];

// ── Prüf-Funktionen (einzeln, damit die Gegenproben sie mit Fremdstücken füttern) ──

/** Satzzeichen und verbotene Zeichen: bis Sprosse 34 trägt keine Zeile eines. */
const VERBOTEN = /[.,;:!?"«»()\-—–’‘`…·  ]/;
function hatVerbotenesZeichen(zeile: string): boolean {
  return VERBOTEN.test(zeile);
}

/** Ab Sprosse 25 ist jede Zeile ein Satz: Grossbuchstabe vorn. */
function beginntGross(zeile: string): boolean {
  return zeile[0] !== zeile[0].toLowerCase();
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

/** il/elle- und Namens-Paar: Subjekt und Pronomen gleichgesetzt (wie Teens/Erwachsene). */
function paarSchluessel(zeile: string): string {
  return zeile
    .replace(/^(il|elle|ils|elles|je|tu|on|nous|[A-ZÀ-Þ][a-zà-ÿ]+)\s/, "X ")
    .toLowerCase()
    .replace(/\b(il|elle|ils|elles|son|sa|ses|lui|leur|mon|ma|mes|ton|ta|tes)\b/g, "P");
}
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

/**
 * Funktionswörter wie in den Teens-/Erwachsenen-Wächtern, dazu die Wörter,
 * die erst an diesen Sprossen schreibbar werden und selbst Funktionswörter
 * sind (où, ça, là, voilà, aux, après, déjà, car) - „où" steht an Sprosse 32
 * zwangsläufig in JEDER Zeile, es ist das einzige Wort mit ù.
 */
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
  "où", "ça", "voilà", "voici", "aux", "après", "déjà", "car",
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

/** Alte Schreibung, wo es eine neue gibt (F4) - die Wörter, die Kinder am ehesten schreiben. */
const ALTE_SCHREIBUNG =
  /(?:^|\s)(île|îles|boîte|boîtes|goût|goûter|août|dîner|flûte|croûte|maître|maîtresse|chaîne|connaître|connaît|paraît|plaît|entraîne|traîne|traîneau|huître|bûche|brûle|brûler|coûte|gîte|voûte|aîné|aînée|abîme|événement|oignon|nénuphar|aiguë|fraîche|naître|naît|piqûre|dîne)(?=\s|$)/i;

/** Zusammengesetztes Zahlwort ohne Bindestrich = alte Schreibung (F4). */
const ZAHLWORT =
  "deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingt|vingts|trente|quarante|cinquante|soixante|cent|cents|mille|septante|nonante";
const ZUSAMMENGESETZT = new RegExp(`\\b(${ZAHLWORT})\\s+(et\\s+)?(un|une|${ZAHLWORT})\\b`, "i");

// ── Korpus ─────────────────────────────────────────────────────────────────

describe("E9-kids: Korpus fr-Weg, Sprossen 25-34 (Kinder)", () => {
  it("jede Zeile ist tippbar, liegt an Sprosse 25-34 und minTier stimmt", () => {
    const fehler: string[] = [];
    for (const item of CORPUS_FR_MITTE_KIDS) {
      // ★ W1 (27.09.2026): Zeilen mit Grossbuchstaben über eine Totaste (späte Lektion) bzw. mit É/Ç (auf Windows-AZERTY nie) - zentral geprüft in tests/tastenflow-w1-modelle-gegen-windows.test.ts (Helfer tests/helfer/w1-grossbuchstaben.ts).
      if (w1GrossArt(item.text)) continue;
      const s = berechneteSprosse(item.text);
      if (s === null || s < ERSTE_SPROSSE || s > LETZTE_SPROSSE) {
        fehler.push(`"${item.text}": Sprosse ${s}`);
        continue;
      }
      const tier = minTierFor(item.text, "fr");
      if (tier !== item.minTier) fehler.push(`"${item.text}": minTier=${item.minTier}, tatsächlich ${tier}`);
      if (item.nurWeg !== "fr") fehler.push(`"${item.text}": nurWeg fehlt`);
      if (item.stufen.join() !== "kids") fehler.push(`"${item.text}": stufen ${item.stufen.join()}`);
      if (item.kind !== "satz") fehler.push(`"${item.text}": kind ${item.kind}`);
    }
    expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
  });

  it("keine Satzzeichen, kein Bindestrich, kein „œ“ - Korpus und Serien", () => {
    const fehler = ALLE.filter((z) => hatVerbotenesZeichen(z) || /œ/i.test(z));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("jede Zeile ist ein Satz (Grossbuchstabe am Anfang)", () => {
    const fehler = ALLE.filter((z) => !beginntGross(z));
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

  it("keine Zeile aus einer anderen fr-Datei (Kinder, Jugendliche, Erwachsene), auch nicht fast gleich", () => {
    const fehler: string[] = [];
    for (const z of ALLE) for (const a of ANDERE) if (fastGleich(z, a)) fehler.push(`"${z}" ~ "${a}"`);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("auch in sich keine zwei fast gleichen Zeilen", () => {
    const fehler: string[] = [];
    for (let i = 0; i < ALLE.length; i++) {
      for (let j = i + 1; j < ALLE.length; j++) if (fastGleich(ALLE[i], ALLE[j])) fehler.push(`"${ALLE[i]}" ~ "${ALLE[j]}"`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("kein il/elle- oder Namens-Paar - in sich und gegen die anderen fr-Dateien", () => {
    const paare = findePaare(ALLE, ANDERE);
    expect(paare, paare.join("\n")).toEqual([]);
  });

  it("kein Inhaltswort in mehr als 8 Zeilen (Korpus + Serien zusammen)", () => {
    const zuViel = zuHaeufigeWoerter(ALLE, 8);
    expect(zuViel, zuViel.join("\n")).toEqual([]);
  });

  it("nur neue Rechtschreibung (F4) und kein zusammengesetztes Zahlwort", () => {
    const fehler = ALLE.filter((z) => ALTE_SCHREIBUNG.test(z) || ZUSAMMENGESETZT.test(z));
    expect(fehler, fehler.join("\n")).toEqual([]);
    expect(ALLE.filter((z) => /\b(septante|nonante|huitante|octante)\b/i.test(z))).toEqual([]);
  });

  /**
   * Gemessener Stand 26.09.2026 (E9-kids) - darf nur STEIGEN. Sprosse 32
   * (ù) hat nur ein einziges Wort: jede ihrer Zeilen trägt „où".
   */
  // ★ W1 (27.09.2026, BEFUND-2026-09-27-W1-WINDOWS-BLOCKER.md §3): an einzelnen Sprossen
  // GESENKT - Zeilen mit Grossbuchstaben über eine Totaste (À Ê …) kommen seither erst mit
  // der letzten Einheit (späte Lektion), Zeilen mit É/Ç auf Windows-AZERTY nie (Johannes §3.8).
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    25: 30, 26: 27, 27: 27, 28: 27, 29: 25, 30: 26, 31: 25, 32: 25, 33: 23, 34: 25,
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

  it("die Totasten-Sprossen tragen wirklich Totasten-Buchstaben (26: ê â ô, 34: ë ï ü)", () => {
    const an = (n: number) => KORPUS.filter((z) => berechneteSprosse(z) === n);
    for (const z of an(26)) expect(/[êâôîû]/i.test(z), z).toBe(true);
    for (const z of an(34)) expect(/[ëïüÿ]/i.test(z), z).toBe(true);
  });

  /**
   * Bauplan §6.7: die häufigsten Manulex-CP-Formen, die erst an diesen
   * Sprossen schreibbar werden (Liste: `tastenflow-texte-fr-kinder.test.ts`,
   * Top 150), kommen je in mindestens drei Zeilen vor.
   */
  it("die ab Sprosse 25 neu schreibbaren Manulex-Formen stehen je in mindestens 3 Zeilen", () => {
    const NEU_SCHREIBBAR = ["là", "voilà", "tête", "très", "deux", "aux", "peux", "chez", "nez", "ça", "garçon", "où"];
    const fehlend: string[] = [];
    for (const wort of NEU_SCHREIBBAR) {
      const re = new RegExp(`(?:^|[^a-zà-öø-ÿ])${wort}(?:$|[^a-zà-öø-ÿ])`, "u");
      const n = ALLE.filter((z) => re.test(z.toLowerCase())).length;
      if (n < 3) fehlend.push(`${wort}: ${n}`);
    }
    expect(fehlend, fehlend.join(", ")).toEqual([]);
  });

  it("Tatoeba höchstens ein Viertel, jede Übernahme mit Satznummer, Benutzer und Lizenz", () => {
    const uebernommen = CORPUS_FR_MITTE_KIDS.filter((i) => i.herkunft);
    expect(uebernommen.length).toBeGreaterThan(0);
    expect(uebernommen.length / CORPUS_FR_MITTE_KIDS.length).toBeLessThanOrEqual(0.25);
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

  it("die Kinder-Zeilen hängen in der Sammelstelle und HINTER den frühen Sprossen in CORPUS_FR", () => {
    expect(CORPUS_FR_MITTE.slice(0, CORPUS_FR_MITTE_KIDS.length)).toEqual(CORPUS_FR_MITTE_KIDS);
    const texte = CORPUS_FR.map((i) => i.text);
    const letzteFrueh = Math.max(...CORPUS_FR_WEG_FRUEH.map((i) => texte.indexOf(i.text)));
    for (const i of CORPUS_FR_MITTE_KIDS) expect(texte.indexOf(i.text), i.text).toBeGreaterThan(letzteFrueh);
    for (const s of SERIEN_FR_MITTE_KIDS) {
      expect(SERIEN_FR_MITTE).toContain(s);
      expect(SERIEN).toContain(s);
    }
  });
});

// ── Serien ─────────────────────────────────────────────────────────────────

describe("E9-kids: Serien fr-Weg, Sprossen 25-34 (Kinder)", () => {
  it("8 Serien, je EINE Etappe mit 12-14 Zeilen, lang fr, nurWeg fr, Stufe kids", () => {
    expect(SERIEN_FR_MITTE_KIDS.length).toBe(8);
    for (const s of SERIEN_FR_MITTE_KIDS) {
      expect(s.lang, s.slug).toBe("fr");
      expect(s.nurWeg, s.slug).toBe("fr");
      expect(s.stufen, s.slug).toEqual(["kids"]);
      expect(s.etappen.length, s.slug).toBe(1);
      const n = s.etappen[0].lines.length;
      expect(n, `${s.slug}: ${n}`).toBeGreaterThanOrEqual(ETAPPE_MIN_LINES);
      expect(n, `${s.slug}: ${n}`).toBeLessThanOrEqual(14);
    }
  });

  it("jede Serie besteht validateSerie(s, \"fr\")", () => {
    for (const s of SERIEN_FR_MITTE_KIDS) {
      const v = validateSerie(s, "fr");
      expect(
        // ★ W1: bei betroffenen Serien ist der Tier die gewollte Folge (siehe tests/helfer/w1-grossbuchstaben.ts).
        v.problems.filter((p) => !(w1SerieBetroffen(s) && /minTier|nie freischaltbar/.test(p))),
        s.slug,
      ).toEqual([]);
    }
  });

  it("jede Serie öffnet an Sprosse 25-34 (alle Zeilen tippbar)", () => {
    const fehler: string[] = [];
    for (const s of SERIEN_FR_MITTE_KIDS) {
      // ★ W1 (27.09.2026): Zeilen mit Grossbuchstaben über eine Totaste (späte Lektion) bzw. mit É/Ç (auf Windows-AZERTY nie) - zentral geprüft in tests/tastenflow-w1-modelle-gegen-windows.test.ts (Helfer tests/helfer/w1-grossbuchstaben.ts).
      if (w1SerieBetroffen(s)) continue;
      const sprossen = s.etappen[0].lines.map((l) => berechneteSprosse(l));
      if (sprossen.some((x) => x === null)) fehler.push(`${s.slug}: Zeile passt nie`);
      const max = Math.max(...sprossen.map((x) => x ?? 99));
      if (max < ERSTE_SPROSSE || max > LETZTE_SPROSSE) fehler.push(`${s.slug}: öffnet an Sprosse ${max}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die Slugs sind neu (keine andere Serie trägt denselben)", () => {
    for (const s of SERIEN_FR_MITTE_KIDS) expect(SERIEN.filter((x) => x.slug === s.slug).length, s.slug).toBe(1);
  });

  it("mindestens ein Drittel spielt ausserhalb Frankreichs (Bauplan §6.5 Regel 8)", () => {
    const ausserhalb = [
      "fr-weg-kids-la-cabane-a-sucre", // Québec
      "fr-weg-kids-la-marmite-de-lescalade", // Schweiz (Genf)
      "fr-weg-kids-les-gilles-de-binche", // Belgien
      "fr-weg-kids-le-lievre-et-la-hyene", // Senegal
      "fr-weg-kids-les-mangues-de-loic", // Haïti
    ];
    for (const slug of ausserhalb) {
      expect(SERIEN_FR_MITTE_KIDS.some((s) => s.slug === slug), slug).toBe(true);
    }
    expect(ausserhalb.length / SERIEN_FR_MITTE_KIDS.length).toBeGreaterThanOrEqual(1 / 3);
  });
});

// ── Gegenproben: jede Regel schlägt an, wenn man ihr einen Fehler vorlegt ──

describe("E9-kids: Gegenproben der Wächter", () => {
  it("★ W1: ein „À“ am Satzanfang wird nicht mehr zu „A“ - die Zeile ist die späte Lektion (Windows-AZERTY: Gravis, dann Maj + A)", () => {
    // ★ W1 (27.09.2026, Johannes §3.8): bis W1 wurde „À" zu „A" ersetzt und
    // die Zeile lag vor Sprosse 25. Jetzt kommt sie mit der letzten Einheit.
    expect(berechneteSprosse("À Dakar il fait chaud")).toBeNull();
    expect(w1GrossArt("À Dakar il fait chaud")).toBe("spaet");
    expect(berechneteSprosse("Il va à Dakar")).toBe(ERSTE_SPROSSE);
  });
  it("eine Zeile mit „fête“ liegt an der ^-Sprosse, eine mit „maïs“ an der ¨-Sprosse", () => {
    expect(berechneteSprosse("La fête")).toBe(FR_LETTER_ORDER.indexOf("^") + 1);
    expect(berechneteSprosse("Le maïs")).toBe(FR_LETTER_ORDER.indexOf("¨") + 1);
  });
  it("ein Bindestrich sperrt die Zeile im Weg „fr“ bis zum Bindestrich", () => {
    const s = berechneteSprosse("Il est peut-être là");
    expect(s === null || s > LETZTE_SPROSSE).toBe(true);
    expect(hatVerbotenesZeichen("Il est peut-être là")).toBe(true);
  });
  it("ein Satzzeichen wird gefunden, ein klein geschriebener Satz auch", () => {
    expect(hatVerbotenesZeichen("On joue, puis on rentre")).toBe(true);
    expect(beginntGross("il va à la plage")).toBe(false);
  });
  it("eine Zeile aus einer anderen Datei und eine fast gleiche werden gefunden", () => {
    expect(ANDERE.some((k) => fastGleich("Il rit", k))).toBe(true);
    expect(ANDERE.some((k) => fastGleich("Le chat dort déjà sur mon clavier", k))).toBe(true);
  });
  it("il/elle- und Namens-Paare werden gefunden", () => {
    expect(findePaare(["Il va à la plage", "Elle va à la plage"]).length).toBe(1);
    expect(findePaare(["Awa mange un kiwi", "Walid mange un kiwi"]).length).toBe(1);
    expect(findePaare(["Il va à la plage", "Elle mange une pomme"]).length).toBe(0);
  });
  it("ein Wort in neun Zeilen wird gefunden, ein Funktionswort (auch „où“) nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `Le zèbre numero ${i} sait où dormir`);
    expect(zuHaeufigeWoerter(neun, 8).some((w) => w.startsWith('"zèbre"'))).toBe(true);
    expect(zuHaeufigeWoerter(neun, 8).some((w) => w.startsWith('"où"'))).toBe(false);
  });
  it("alte Schreibung und zusammengesetzte Zahlwörter werden gefunden, neue Schreibung nicht", () => {
    expect(ALTE_SCHREIBUNG.test("Le goûter est prêt")).toBe(true);
    expect(ALTE_SCHREIBUNG.test("Il vit sur une île")).toBe(true);
    expect(ALTE_SCHREIBUNG.test("Le gouter est prêt")).toBe(false);
    expect(ZUSAMMENGESETZT.test("Il a vingt deux billes")).toBe(true);
    expect(ZUSAMMENGESETZT.test("Il a deux billes")).toBe(false);
  });
});
