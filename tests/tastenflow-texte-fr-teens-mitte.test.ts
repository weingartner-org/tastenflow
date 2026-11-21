/**
 * ★★★ Wächter E9-teens (26.09.2026): die fr-Texte für Jugendliche an den
 * Sprossen 25-34 - dort kommen die restlichen Buchstaben `à ^ è x z y ç ù w ¨`
 * dazu (`corpusFrMitteTeens.ts` + `serienFrMitteTeens.ts`).
 *
 * Nach dem Muster von `tastenflow-texte-fr-kinder-mitte.test.ts`:
 *  - die Sprosse einer Zeile wird AUSGERECHNET (kleinstes n, ab dem `fitText`
 *    mit Weg „fr" und Windows-AZERTY sie durchlässt), nicht aus Kommentaren
 *    geglaubt - ein „À"/„Ç" am Satzanfang zählt darum nicht als das Neue,
 *  - keine Zeile aus einer anderen fr-Datei (Kinder, Jugendliche, Erwachsene
 *    9-24 UND Kinder 25-34), auch nicht fast gleich,
 *  - kein il/elle- oder Namens-Paar (auch nicht gegen die anderen Dateien),
 *  - kein Inhaltswort in mehr als 8 Zeilen (Korpus + Serien zusammen),
 *  - noch keine Satzzeichen, kein Bindestrich, nur neue Schreibung,
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

const KORPUS = CORPUS_FR_MITTE_TEENS.map((i) => i.text);
const SERIEN_ZEILEN = zeilenVon(SERIEN_FR_MITTE_TEENS);
const ALLE = [...KORPUS, ...SERIEN_ZEILEN];
/** Alle ANDEREN französischen Zeilen (frühe Sprossen aller Stufen, Kinder 25-34). */
const ANDERE = [
  ...CORPUS_FR_WEG_FRUEH.map((i) => i.text),
  ...zeilenVon(SERIEN_FR_WEG_FRUEH),
  ...CORPUS_FR_MITTE_KIDS.map((i) => i.text),
  ...zeilenVon(SERIEN_FR_MITTE_KIDS),
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

/** Dieselbe Funktionswort-Liste wie im Kinder-Wächter 25-34 (dort begründet: „où" steht an Sprosse 32 in jeder Zeile). */
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
 * Alte Schreibung, wo es eine neue gibt (F4) - die Liste des Kinder-Wächters,
 * dazu die Wörter, die Jugendliche am ehesten schreiben (entraîne, traîne,
 * chaîne, disparaît …). Auch nach einem Apostroph (s'entraîne, l'île) -
 * der Kinder-Wächter prüft nur nach Leerzeichen, die Gegenprobe hier fand es.
 */
const ALTE_SCHREIBUNG =
  /(?:^|[\s'])(île|îles|boîte|boîtes|goût|goûter|août|dîner|flûte|croûte|maître|maîtresse|chaîne|chaînes|connaître|connaît|paraît|paraître|plaît|entraîne|entraîner|entraînement|entraîneur|entraîneuse|entraînant|entraînante|enchaîne|traîne|traîner|traîneau|huître|bûche|brûle|brûler|coûte|coûtent|gîte|voûte|aîné|aînée|abîme|abîmé|événement|oignon|nénuphar|aiguë|fraîche|naître|naît|piqûre|dîne|disparaît|apparaît|reconnaît)(?=\s|$)/i;

/** Zusammengesetztes Zahlwort ohne Bindestrich = alte Schreibung (F4). */
const ZAHLWORT =
  "deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingt|vingts|trente|quarante|cinquante|soixante|cent|cents|mille|septante|nonante";
const ZUSAMMENGESETZT = new RegExp(`\\b(${ZAHLWORT})\\s+(et\\s+)?(un|une|${ZAHLWORT})\\b`, "i");

/** Wörter mit Landesunterschied (Bauplan §10.1) - nur als `{…|…}` oder gar nicht. */
const VARIANTENWORT = /(?:^|\s)(septante|nonante|huitante|octante|déjeuner|souper|diner|courriel|weekend)(?=\s|$)/i;

// ── Korpus ─────────────────────────────────────────────────────────────────

describe("E9-teens: Korpus fr-Weg, Sprossen 25-34 (Jugendliche)", () => {
  it("jede Zeile ist tippbar, liegt an Sprosse 25-34 und minTier stimmt", () => {
    const fehler: string[] = [];
    for (const item of CORPUS_FR_MITTE_TEENS) {
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
      if (item.stufen.join() !== "teens") fehler.push(`"${item.text}": stufen ${item.stufen.join()}`);
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

  it("keine Zeile aus einer anderen fr-Datei (alle Stufen 9-24, Kinder 25-34), auch nicht fast gleich", () => {
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
    const fehler = ALLE.filter((z) => ALTE_SCHREIBUNG.test(z) || ZUSAMMENGESETZT.test(z) || VARIANTENWORT.test(z));
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  /** Gemessener Stand 26.09.2026 (E9-teens) - darf nur STEIGEN. */
  // ★ W1 (27.09.2026, BEFUND-2026-09-27-W1-WINDOWS-BLOCKER.md §3): an einzelnen Sprossen
  // GESENKT - Zeilen mit Grossbuchstaben über eine Totaste (À Ê …) kommen seither erst mit
  // der letzten Einheit (späte Lektion), Zeilen mit É/Ç auf Windows-AZERTY nie (Johannes §3.8).
  const MINDESTENS_JE_SPROSSE: Record<number, number> = {
    25: 28, 26: 30, 27: 28, 28: 28, 29: 28, 30: 27, 31: 25, 32: 27, 33: 25, 34: 26,
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

  it("die Totasten-Sprossen tragen wirklich Totasten-Buchstaben (26: ê â ô û, 34: ë ï ü), 31 ein kleines ç, 32 ein „où“", () => {
    const an = (n: number) => KORPUS.filter((z) => berechneteSprosse(z) === n);
    for (const z of an(26)) expect(/[êâôîû]/i.test(z), z).toBe(true);
    for (const z of an(34)) expect(/[ëïüÿ]/i.test(z), z).toBe(true);
    for (const z of an(31)) expect(/ç/.test(z), z).toBe(true);
    for (const z of an(32)) expect(/où/i.test(z), z).toBe(true);
  });

  it("„œ“ bestimmt nie die Sprosse: eine œ-Zeile liegt dort, wo sie mit „oe“ läge", () => {
    const mitOe = KORPUS.filter((z) => /œ/.test(z));
    expect(mitOe.length).toBeGreaterThan(0);
    for (const z of mitOe) expect(berechneteSprosse(z), z).toBe(berechneteSprosse(z.replace(/œ/g, "oe")));
  });

  it("Tatoeba höchstens ein Viertel, jede Übernahme mit Satznummer, Benutzer und Lizenz", () => {
    const uebernommen = CORPUS_FR_MITTE_TEENS.filter((i) => i.herkunft);
    expect(uebernommen.length).toBeGreaterThan(0);
    expect(uebernommen.length / CORPUS_FR_MITTE_TEENS.length).toBeLessThanOrEqual(0.25);
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

  it("die Jugend-Zeilen hängen in der Sammelstelle HINTER den Kinder-Zeilen und in CORPUS_FR", () => {
    expect(CORPUS_FR_MITTE.slice(CORPUS_FR_MITTE_KIDS.length, CORPUS_FR_MITTE_KIDS.length + CORPUS_FR_MITTE_TEENS.length)).toEqual(
      CORPUS_FR_MITTE_TEENS,
    );
    const texte = new Set(CORPUS_FR.map((i) => i.text));
    for (const i of CORPUS_FR_MITTE_TEENS) expect(texte.has(i.text), i.text).toBe(true);
    // Begrenzt statt „bis zum Ende": seit E9-erwachsen hängen die Erwachsenen-Serien dahinter.
    expect(
      SERIEN_FR_MITTE.slice(SERIEN_FR_MITTE_KIDS.length, SERIEN_FR_MITTE_KIDS.length + SERIEN_FR_MITTE_TEENS.length),
    ).toEqual(SERIEN_FR_MITTE_TEENS);
    for (const s of SERIEN_FR_MITTE_TEENS) expect(SERIEN).toContain(s);
  });
});

// ── Serien ─────────────────────────────────────────────────────────────────

describe("E9-teens: Serien fr-Weg, Sprossen 25-34 (Jugendliche)", () => {
  it("8 Serien, je EINE Etappe mit 12-14 Zeilen, lang fr, nurWeg fr, Stufe teens", () => {
    expect(SERIEN_FR_MITTE_TEENS.length).toBe(8);
    for (const s of SERIEN_FR_MITTE_TEENS) {
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
    for (const s of SERIEN_FR_MITTE_TEENS) {
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
    for (const s of SERIEN_FR_MITTE_TEENS) {
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
    for (const s of SERIEN_FR_MITTE_TEENS) expect(SERIEN.filter((x) => x.slug === s.slug).length, s.slug).toBe(1);
  });

  it("mindestens ein Drittel spielt ausserhalb Frankreichs (Bauplan §6.5 Regel 8)", () => {
    const ausserhalb = [
      "fr-weg-teens-le-correspondant-de-lausanne", // Schweiz
      "fr-weg-teens-zero-dechet-a-la-cantine", // Belgien (Bruxelles)
      "fr-weg-teens-le-tournoi-de-hockey-cosom", // Québec (Sherbrooke)
      "fr-weg-teens-la-radio-du-college", // Senegal (Dakar)
      "fr-weg-teens-la-sonnerie-mystere", // Marokko (Casablanca)
      "fr-weg-teens-le-stand-de-tante-afi", // Benin (Cotonou)
    ];
    for (const slug of ausserhalb) {
      expect(SERIEN_FR_MITTE_TEENS.some((s) => s.slug === slug), slug).toBe(true);
    }
    expect(ausserhalb.length / SERIEN_FR_MITTE_TEENS.length).toBeGreaterThanOrEqual(1 / 3);
  });
});

// ── Gegenproben: jede Regel schlägt an, wenn man ihr einen Fehler vorlegt ──

describe("E9-teens: Gegenproben der Wächter", () => {
  it("★ W1: „À“ wird die späte Lektion, „Ç“ kommt auf Windows-AZERTY nie - kein Ersatz mehr", () => {
    // ★ W1 (27.09.2026, Johannes §3.8): bis W1 „À" → „A", „Ç" → „C".
    expect(berechneteSprosse("À Dakar il fait chaud")).toBeNull();
    expect(w1GrossArt("À Dakar il fait chaud")).toBe("spaet");
    expect(berechneteSprosse("Ça commence")).toBeNull();
    expect(w1GrossArt("Ça commence")).toBe("nie");
    expect(berechneteSprosse("On commence ça")).toBe(FR_LETTER_ORDER.indexOf("ç") + 1);
  });
  it("„œ“ allein hebt keine Zeile an - der Ersatz „oe“ greift", () => {
    expect(berechneteSprosse("Ma sœur est là")).toBe(ERSTE_SPROSSE);
    expect(/œ/i.test("Ma sœur est là")).toBe(true);
  });
  it("ein Bindestrich sperrt die Zeile im Weg „fr“ bis zum Bindestrich", () => {
    const s = berechneteSprosse("On se voit au rendez-vous");
    expect(s === null || s > LETZTE_SPROSSE).toBe(true);
    expect(hatVerbotenesZeichen("On se voit au rendez-vous")).toBe(true);
  });
  it("ein Satzzeichen wird gefunden, ein klein geschriebener Satz auch, ein geschütztes Leerzeichen auch", () => {
    expect(hatVerbotenesZeichen("On joue, puis on rentre")).toBe(true);
    expect(hatVerbotenesZeichen("Tu viens ")).toBe(true);
    expect(beginntGross("il va à la plage")).toBe(false);
  });
  it("eine Zeile aus einer anderen Datei (auch Kinder 25-34) und eine fast gleiche werden gefunden", () => {
    expect(ANDERE.some((k) => fastGleich("Toute la classe éclate de rire", k))).toBe(true);
    expect(ANDERE.some((k) => fastGleich("Namur est une ville de la Wallonie", k))).toBe(true);
  });
  it("il/elle- und Namens-Paare werden gefunden", () => {
    expect(findePaare(["Il joue au hockey à Montréal", "Elle joue au hockey à Montréal"]).length).toBe(1);
    expect(findePaare(["Yasmine joue au volley", "Warda joue au volley"]).length).toBe(1);
    expect(findePaare(["Il joue au hockey", "Elle mange une pizza"]).length).toBe(0);
  });
  it("ein Wort in neun Zeilen wird gefunden, ein Funktionswort (auch „où“) nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `Le collège numero ${i} sait où aller`);
    expect(zuHaeufigeWoerter(neun, 8).some((w) => w.startsWith('"collège"'))).toBe(true);
    expect(zuHaeufigeWoerter(neun, 8).some((w) => w.startsWith('"où"'))).toBe(false);
  });
  it("alte Schreibung, zusammengesetzte Zahlwörter und Variantenwörter werden gefunden, neue Schreibung nicht", () => {
    expect(ALTE_SCHREIBUNG.test("Il s'entraîne le soir")).toBe(true);
    expect(ALTE_SCHREIBUNG.test("Ma chaîne a mille abonnés")).toBe(true);
    expect(ALTE_SCHREIBUNG.test("Il s'entraine le soir")).toBe(false);
    expect(ZUSAMMENGESETZT.test("Il a vingt deux ans")).toBe(true);
    expect(ZUSAMMENGESETZT.test("Il a deux ans")).toBe(false);
    expect(VARIANTENWORT.test("On se voit ce weekend")).toBe(true);
    expect(VARIANTENWORT.test("On se voit samedi")).toBe(false);
  });
});
