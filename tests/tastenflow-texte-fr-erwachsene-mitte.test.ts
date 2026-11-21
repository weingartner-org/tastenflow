/**
 * ★★★ Wächter E9-erwachsen (26.09.2026): die fr-Texte für Erwachsene an den
 * Sprossen 25-34 - dort kommen die restlichen Buchstaben `à ^ è x z y ç ù w ¨`
 * dazu (`corpusFrMitteErwachsen.ts` + `serienFrMitteErwachsen.ts`).
 *
 * Nach dem Muster von `tastenflow-texte-fr-teens-mitte.test.ts`:
 *  - die Sprosse einer Zeile wird AUSGERECHNET (kleinstes n, ab dem `fitText`
 *    mit Weg „fr" und Windows-AZERTY sie durchlässt), nicht aus Kommentaren
 *    geglaubt - ein „À"/„Ç" am Satzanfang zählt darum nicht als das Neue,
 *  - keine Zeile aus einer anderen fr-Datei (Kinder, Jugendliche, Erwachsene
 *    9-24 UND Kinder und Jugendliche 25-34), auch nicht fast gleich,
 *  - kein il/elle- oder Namens-Paar (auch nicht gegen die anderen Dateien),
 *  - kein Inhaltswort in mehr als 8 Zeilen (Korpus + Serien zusammen),
 *  - noch keine Satzzeichen, kein Bindestrich, nur neue Schreibung - hier
 *    über die FEHLERKLASSE: jedes Wort mit „î" oder „û" ist alte Schreibung,
 *    ausser den Wörtern, die die Reform 1990 ausdrücklich behält (sûr, dû,
 *    mûr, jeûne, Verbformen wie fût) - eine Liste einzelner Wörter fände ein
 *    „coûteux" oder „paraîtra" nie,
 *  - kein Variantenwort (§10.1) und kein belgisch-schweizerisches Zahlwort,
 *  - `œ` (F19) im Korpus erlaubt - über den Ersatz `oe` -, in den Serien
 *    nicht (die allgemeinen Serien-Wächter rechnen mit der Tastatur „de").
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
import { CORPUS_FR_MITTE_TEENS } from "../src/lib/typing/corpusFrMitteTeens";
import { SERIEN_FR_MITTE_TEENS } from "../src/lib/typing/serienFrMitteTeens";
import { CORPUS_FR_MITTE_ERWACHSEN } from "../src/lib/typing/corpusFrMitteErwachsen";
import { SERIEN_FR_MITTE_ERWACHSEN } from "../src/lib/typing/serienFrMitteErwachsen";
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

const KORPUS = CORPUS_FR_MITTE_ERWACHSEN.map((i) => i.text);
const SERIEN_ZEILEN = zeilenVon(SERIEN_FR_MITTE_ERWACHSEN);
const ALLE = [...KORPUS, ...SERIEN_ZEILEN];
/** Alle ANDEREN französischen Zeilen (frühe Sprossen aller Stufen, Kinder und Jugendliche 25-34). */
const ANDERE = [
  ...CORPUS_FR_WEG_FRUEH.map((i) => i.text),
  ...zeilenVon(SERIEN_FR_WEG_FRUEH),
  ...CORPUS_FR_MITTE_KIDS.map((i) => i.text),
  ...zeilenVon(SERIEN_FR_MITTE_KIDS),
  ...CORPUS_FR_MITTE_TEENS.map((i) => i.text),
  ...zeilenVon(SERIEN_FR_MITTE_TEENS),
];

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

/** Dieselbe Funktionswort-Liste wie im Kinder- und Jugend-Wächter 25-34. */
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
        .map((w) => w.replace(/[^a-zà-öø-ÿœ']/g, ""))
        .filter((w) => w && !FUNKTIONSWOERTER.has(w)),
    );
    for (const w of ws) h.set(w, (h.get(w) ?? 0) + 1);
  }
  return [...h].filter(([, n]) => n > grenze).map(([w, n]) => `"${w}": ${n} Zeilen`);
}

/**
 * Alte Schreibung (F4) als FEHLERKLASSE: Die Reform 1990 streicht den
 * Zirkumflex auf i und u - ausser in den Wörtern, die sonst mit einem anderen
 * zusammenfielen (sûr/sur, dû/du, mûr/mur, jeûne/jeune) und in Verbformen des
 * Passé simple und des Subjonctif imparfait. Jedes andere Wort mit „î" oder
 * „û" ist alte Schreibung (coût, île, paraît, goûter, entraîne, brûlé …).
 */
const ZIRKUMFLEX_BLEIBT = new Set([
  "sûr", "sûre", "sûrs", "sûres", "sûrement", "sûreté",
  "dû", "mûr", "mûre", "mûrs", "mûres", "mûrement", "jeûne", "jeûnes", "jeûner",
  "fûmes", "fûtes", "fût", "eûmes", "eûtes", "eût", "fîmes", "fîtes", "fît",
  "vînmes", "vîntes", "vînt", "tînmes", "tîntes", "tînt", "croît", "croîs",
]);
/** Dazu die Reform-Wörter ohne Zirkumflex (Akzent, Trema, Zusammenschreibung). */
const ALTE_SCHREIBUNG_LISTE =
  /(?:^|[\s'])(événement|événements|oignon|oignons|nénuphar|nénuphars|aiguë|aiguës|ambiguë|ambiguës|exiguë|exiguës|contiguë|contiguës|ambiguïté|week-end|réglementaire|réglementation|sécheresse|crémerie)(?=\s|$)/i;
function alteSchreibung(zeile: string): string[] {
  const funde = zeile
    .toLowerCase()
    .split(/[\s']+/)
    .filter((w) => /[îû]/.test(w) && !ZIRKUMFLEX_BLEIBT.has(w));
  const m = zeile.match(ALTE_SCHREIBUNG_LISTE);
  if (m) funde.push(m[1]);
  return funde;
}

/** Zusammengesetztes Zahlwort ohne Bindestrich = alte Schreibung (F4). */
const ZAHLWORT =
  "deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingt|vingts|trente|quarante|cinquante|soixante|cent|cents|mille|septante|nonante";
const ZUSAMMENGESETZT = new RegExp(`\\b(${ZAHLWORT})\\s+(et\\s+)?(un|une|${ZAHLWORT})\\b`, "i");

/** Wörter mit Landesunterschied (Bauplan §10.1) - nur als `{…|…}` oder gar nicht. */
const VARIANTENWORT =
  /(?:^|\s)(septante|nonante|huitante|octante|déjeuner|déjeune|souper|soupe|diner|dîner|courriel|courriels|weekend)(?=\s|$)/i;

/**
 * Merkmale „ausserhalb Frankreichs" (Bauplan §6.5 Regel 8): Orte, Sachen und
 * Regionalwörter der Frankophonie ausserhalb des europäischen Frankreichs und
 * Namen aus West- und Zentralafrika und dem Maghreb. Benannt, nicht geraten -
 * „Francophonie" allein oder ein Name wie „Nadia" zählt nicht.
 */
const AUSSERHALB = `Abidjan gbaka Québec Belgique belges dringuelle Montréal Lausanne Mali Bamako Douala Kribi
Tunis libanais Kinshasa Sion panosse sacoche Liège Ouagadougou FESPACO kot Namur magasine Congo
Bruxelles pistolet chicon Cotonou zémidjan Acadiens mezzés Suisse romande poutzer cheni clenche
thiéboudiène Luxembourg Liban Byblos Yaoundé bambara Rabat Madagascar malgache natel maquis attiéké
Outaouais Ottawa Gatineau Wallonie Sénégal wolof Thiès Lomé Rwanda Dakar infolettre Haïti haïtien
zellige Tripoli Marrakech souk couscous égoportrait Sherbrooke Moncton Mons Casablanca Charleroi
Laurentides Libreville Genève Nouakchott Niamey Valais Fribourg Jacmel Sousse Lévis
Fatou Adjoa Karim Samia Mamadou Oumou Karima Samir Adama Moussa Youssef Faridath Zoubida Zakaria
Rania Oumar Kofi Awa Kwassi Rawane Wassila Aïda Aïcha Laïla Kaïs Ismaïl`.split(/\s+/);
function spieltAusserhalb(zeile: string): boolean {
  return AUSSERHALB.some((w) => new RegExp(`(?<![\\p{L}])${w}(?![\\p{L}])`, "u").test(zeile));
}

// ── Korpus ─────────────────────────────────────────────────────────────────

describe("E9-erwachsen: Korpus fr-Weg, Sprossen 25-34 (Erwachsene)", () => {
  it("jede Zeile ist tippbar, liegt an Sprosse 25-34 und minTier stimmt", () => {
    const fehler: string[] = [];
    for (const item of CORPUS_FR_MITTE_ERWACHSEN) {
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
      if (item.stufen.join() !== "erwachsen") fehler.push(`"${item.text}": stufen ${item.stufen.join()}`);
      if (item.kind !== "satz") fehler.push(`"${item.text}": kind ${item.kind}`);
    }
    expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
  });

  it("keine Satzzeichen, kein Bindestrich - Korpus und Serien; „œ“ nur im Korpus", () => {
    const fehler = [...ALLE.filter((z) => hatVerbotenesZeichen(z)), ...SERIEN_ZEILEN.filter((z) => /œ/i.test(z))];
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

  it("keine Zeile aus einer anderen fr-Datei (alle Stufen 9-24, Kinder und Jugendliche 25-34), auch nicht fast gleich", () => {
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

  it("nur neue Rechtschreibung (F4), kein zusammengesetztes Zahlwort, kein Variantenwort", () => {
    const fehler = ALLE.filter((z) => alteSchreibung(z).length > 0 || ZUSAMMENGESETZT.test(z) || VARIANTENWORT.test(z));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /** Gemessener Stand 26.09.2026 (E9-erwachsen) - darf nur STEIGEN. */
  // ★ W1 (27.09.2026, BEFUND-2026-09-27-W1-WINDOWS-BLOCKER.md §3): an einzelnen Sprossen
  // GESENKT - Zeilen mit Grossbuchstaben über eine Totaste (À Ê …) kommen seither erst mit
  // der letzten Einheit (späte Lektion), Zeilen mit É/Ç auf Windows-AZERTY nie (Johannes §3.8).
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    25: 26, 26: 26, 27: 24, 28: 26, 29: 28, 30: 22, 31: 22, 32: 23, 33: 23, 34: 24,
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

  it("jede Zeile trägt das Neue ihrer Sprosse klein geschrieben (25 à, 26 ê â ô û, 31 ç, 32 où, 34 ë ï ü)", () => {
    const an = (n: number) => KORPUS.filter((z) => berechneteSprosse(z) === n);
    for (const z of an(25)) expect(/à/.test(z), z).toBe(true);
    for (const z of an(26)) expect(/[êâôîû]/.test(z), z).toBe(true);
    for (const z of an(31)) expect(/ç/.test(z), z).toBe(true);
    for (const z of an(32)) expect(/où/i.test(z), z).toBe(true);
    for (const z of an(34)) expect(/[ëïüÿ]/.test(z), z).toBe(true);
  });

  it("„œ“ bestimmt nie die Sprosse: eine œ-Zeile liegt dort, wo sie mit „oe“ läge", () => {
    const mitOe = KORPUS.filter((z) => /œ/.test(z));
    expect(mitOe.length).toBeGreaterThan(0);
    for (const z of mitOe) expect(berechneteSprosse(z), z).toBe(berechneteSprosse(z.replace(/œ/g, "oe")));
  });

  it("Tatoeba höchstens ein Viertel, jede Übernahme mit Satznummer, Benutzer und Lizenz", () => {
    const uebernommen = CORPUS_FR_MITTE_ERWACHSEN.filter((i) => i.herkunft);
    expect(uebernommen.length).toBeGreaterThan(0);
    expect(uebernommen.length / CORPUS_FR_MITTE_ERWACHSEN.length).toBeLessThanOrEqual(0.25);
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

  it("mindestens ein Drittel der Korpuszeilen spielt ausserhalb Frankreichs (Ort, Sache, Wort oder Name, Bauplan §6.5 Regel 8)", () => {
    const n = KORPUS.filter((z) => spieltAusserhalb(z)).length;
    expect(n / KORPUS.length, `${n} von ${KORPUS.length}`).toBeGreaterThanOrEqual(1 / 3);
  });

  it("die Erwachsenen-Zeilen hängen in der Sammelstelle HINTER Kindern und Jugendlichen und in CORPUS_FR", () => {
    const vorne = CORPUS_FR_MITTE_KIDS.length + CORPUS_FR_MITTE_TEENS.length;
    expect(CORPUS_FR_MITTE.slice(vorne)).toEqual(CORPUS_FR_MITTE_ERWACHSEN);
    const texte = new Set(CORPUS_FR.map((i) => i.text));
    for (const i of CORPUS_FR_MITTE_ERWACHSEN) expect(texte.has(i.text), i.text).toBe(true);
    expect(SERIEN_FR_MITTE.slice(SERIEN_FR_MITTE_KIDS.length + SERIEN_FR_MITTE_TEENS.length)).toEqual(SERIEN_FR_MITTE_ERWACHSEN);
    for (const s of SERIEN_FR_MITTE_ERWACHSEN) expect(SERIEN).toContain(s);
  });
});

// ── Serien ─────────────────────────────────────────────────────────────────

describe("E9-erwachsen: Serien fr-Weg, Sprossen 25-34 (Erwachsene)", () => {
  it("8 Serien, je EINE Etappe mit 12-14 Zeilen, lang fr, nurWeg fr, Stufe erwachsen", () => {
    expect(SERIEN_FR_MITTE_ERWACHSEN.length).toBe(8);
    for (const s of SERIEN_FR_MITTE_ERWACHSEN) {
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
    for (const s of SERIEN_FR_MITTE_ERWACHSEN) {
      const v = validateSerie(s, "fr");
      expect(
        // ★ W1: bei betroffenen Serien ist der Tier die gewollte Folge (siehe tests/helfer/w1-grossbuchstaben.ts).
        v.problems.filter((p) => !(w1SerieBetroffen(s) && /minTier|nie freischaltbar/.test(p))),
        s.slug,
      ).toEqual([]);
    }
  });

  it("jede Serie öffnet an Sprosse 25-34 (alle Zeilen tippbar), minTier stimmt", () => {
    const fehler: string[] = [];
    for (const s of SERIEN_FR_MITTE_ERWACHSEN) {
      // ★ W1 (27.09.2026): Zeilen mit Grossbuchstaben über eine Totaste (späte Lektion) bzw. mit É/Ç (auf Windows-AZERTY nie) - zentral geprüft in tests/tastenflow-w1-modelle-gegen-windows.test.ts (Helfer tests/helfer/w1-grossbuchstaben.ts).
      if (w1SerieBetroffen(s)) continue;
      const sprossen = s.etappen[0].lines.map((l) => berechneteSprosse(l));
      if (sprossen.some((x) => x === null)) fehler.push(`${s.slug}: Zeile passt nie`);
      const max = Math.max(...sprossen.map((x) => x ?? 99));
      if (max < ERSTE_SPROSSE || max > LETZTE_SPROSSE) fehler.push(`${s.slug}: öffnet an Sprosse ${max}`);
      const tier = Math.max(...s.etappen[0].lines.map((l) => minTierFor(l, "fr") ?? 99));
      if (tier !== s.minTier) fehler.push(`${s.slug}: minTier=${s.minTier}, tatsächlich ${tier}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("die Slugs sind neu (keine andere Serie trägt denselben)", () => {
    for (const s of SERIEN_FR_MITTE_ERWACHSEN) expect(SERIEN.filter((x) => x.slug === s.slug).length, s.slug).toBe(1);
  });

  it("mindestens ein Drittel spielt ausserhalb Frankreichs (Bauplan §6.5 Regel 8)", () => {
    const ausserhalb = [
      "fr-weg-erwachsen-le-zemidjan-de-rodrigue", // Benin (Cotonou)
      "fr-weg-erwachsen-un-samedi-d-umuganda", // Rwanda
      "fr-weg-erwachsen-la-frontaliere", // Schweiz (Genève)
      "fr-weg-erwachsen-le-kot-de-maxime", // Belgien (Liège)
      "fr-weg-erwachsen-le-premier-hiver-de-mamadou", // Québec (Montréal)
      "fr-weg-erwachsen-le-four-de-wael", // Libanon (Beyrouth)
    ];
    for (const slug of ausserhalb) {
      expect(SERIEN_FR_MITTE_ERWACHSEN.some((s) => s.slug === slug), slug).toBe(true);
    }
    expect(ausserhalb.length / SERIEN_FR_MITTE_ERWACHSEN.length).toBeGreaterThanOrEqual(1 / 3);
  });
});

// ── Gegenproben: jede Regel schlägt an, wenn man ihr einen Fehler vorlegt ──

describe("E9-erwachsen: Gegenproben der Wächter", () => {
  it("★ W1: „À“ wird die späte Lektion, „Ç“ kommt auf Windows-AZERTY nie - kein Ersatz mehr", () => {
    // ★ W1 (27.09.2026, Johannes §3.8): bis W1 „À" → „A", „Ç" → „C".
    expect(berechneteSprosse("À Dakar il fait chaud")).toBeNull();
    expect(w1GrossArt("À Dakar il fait chaud")).toBe("spaet");
    expect(berechneteSprosse("Ça commence")).toBeNull();
    expect(w1GrossArt("Ça commence")).toBe("nie");
    expect(berechneteSprosse("On commence ça")).toBe(FR_LETTER_ORDER.indexOf("ç") + 1);
  });
  it("„œ“ allein hebt keine Zeile an - der Ersatz „oe“ greift", () => {
    expect(berechneteSprosse("Ma sœur est à la maison")).toBe(ERSTE_SPROSSE);
  });
  it("ein Bindestrich sperrt die Zeile im Weg „fr“ bis zum Bindestrich", () => {
    const s = berechneteSprosse("Il travaille à mi-temps");
    expect(s === null || s > LETZTE_SPROSSE).toBe(true);
    expect(hatVerbotenesZeichen("Il travaille à mi-temps")).toBe(true);
  });
  it("ein Satzzeichen wird gefunden, ein klein geschriebener Satz auch, ein geschütztes Leerzeichen auch", () => {
    expect(hatVerbotenesZeichen("Le loyer augmente, le salaire non")).toBe(true);
    expect(hatVerbotenesZeichen("Tu viens ")).toBe(true);
    expect(hatVerbotenesZeichen("Tu viens ")).toBe(true);
    expect(hatVerbotenesZeichen("Tu viens demain")).toBe(false);
    expect(beginntGross("le loyer augmente")).toBe(false);
  });
  it("eine Zeile aus einer anderen Datei (auch Jugendliche 25-34) und eine fast gleiche werden gefunden", () => {
    expect(ANDERE.some((k) => fastGleich("Le bail se termine en juin", k))).toBe(true);
    expect(ANDERE.some((k) => fastGleich("Tu sais où se trouve la salle de sport", k))).toBe(true);
  });
  it("il/elle- und Namens-Paare werden gefunden, auch gegen eine Jugend-Zeile", () => {
    expect(findePaare(["Il loue un kot à Namur", "Elle loue un kot à Namur"]).length).toBe(1);
    expect(findePaare(["Karima paye son loyer", "Nadia paye son loyer"]).length).toBe(1);
    expect(findePaare(["Il loue un kot", "Elle paye son loyer"]).length).toBe(0);
    // „Walid est le meilleur gardien du tournoi" steht in der Jugend-Datei 25-34.
    expect(findePaare(["Karim est le meilleur gardien du tournoi"], ANDERE).length).toBe(1);
    expect(findePaare(["Karim garde les buts de son club"], ANDERE).length).toBe(0);
  });
  it("ein Wort in neun Zeilen wird gefunden, ein Funktionswort (auch „où“) nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `Le bureau numero ${i} sait où aller`);
    expect(zuHaeufigeWoerter(neun, 8).some((w) => w.startsWith('"bureau"'))).toBe(true);
    expect(zuHaeufigeWoerter(neun, 8).some((w) => w.startsWith('"où"'))).toBe(false);
  });
  it("alte Schreibung wird als Klasse gefunden (jedes î/û ausser sûr, dû …), neue Schreibung nicht", () => {
    expect(alteSchreibung("Le coût de la vie augmente")).toEqual(["coût"]);
    expect(alteSchreibung("Ce voyage est coûteux")).toEqual(["coûteux"]);
    expect(alteSchreibung("Il s'entraîne le soir")).toEqual(["entraîne"]);
    expect(alteSchreibung("Le livre paraîtra en juin")).toEqual(["paraîtra"]);
    expect(alteSchreibung("Nous passons l'été sur l'île")).toEqual(["île"]);
    expect(alteSchreibung("Sa réponse reste ambiguë")).toEqual(["ambiguë"]);
    expect(alteSchreibung("Un événement rare")).toEqual(["événement"]);
    expect(alteSchreibung("Le cout de la vie augmente")).toEqual([]);
    expect(alteSchreibung("Il est sûr de lui et il a dû partir")).toEqual([]);
    expect(alteSchreibung("Sa réponse reste ambigüe")).toEqual([]);
  });
  it("„ausserhalb Frankreichs“ erkennt Orte und Namen, aber keine Wortteile und keine französischen Zeilen", () => {
    expect(spieltAusserhalb("À Namur Lucas achète son pain")).toBe(true);
    expect(spieltAusserhalb("Karim est sûr de décrocher le poste")).toBe(true);
    expect(spieltAusserhalb("Le propriétaire tarde à réparer le chauffage")).toBe(false);
    expect(spieltAusserhalb("Le vingt mars on fête la Francophonie")).toBe(false);
    expect(spieltAusserhalb("Les Malinois sont des chiens")).toBe(false); // „Mali" nur als ganzes Wort
  });
  it("zusammengesetzte Zahlwörter und Variantenwörter werden gefunden, einfache nicht", () => {
    expect(ZUSAMMENGESETZT.test("Il a vingt deux ans")).toBe(true);
    expect(ZUSAMMENGESETZT.test("Il a deux ans")).toBe(false);
    expect(VARIANTENWORT.test("On se voit ce weekend")).toBe(true);
    expect(VARIANTENWORT.test("Je t'envoie un courriel")).toBe(true);
    expect(VARIANTENWORT.test("Lucien a septante ans")).toBe(true);
    expect(VARIANTENWORT.test("On se voit samedi")).toBe(false);
  });
});
