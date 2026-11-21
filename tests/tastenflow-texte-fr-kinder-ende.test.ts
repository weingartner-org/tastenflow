/**
 * ★★★ Wächter E9-ende-kids (26.09.2026): die fr-Texte für Kinder ab der
 * Punkt-Sprosse bis zum Ende des Lernwegs - Satzzeichen `. , ; : ! ? " - ( )`,
 * Ziffern, Sonderzeichen (`corpusFrEndeKids.ts` + `serienFrEndeKids.ts`).
 *
 * SPROSSE = Stelle in `LERNWEGE.fr.introOrder` (Maj mitgezählt, wie im Befund
 * E9a: 36 = „.", 45 = „)", 46-55 = Ziffern, 56-72 = Sonderzeichen). Zwei
 * Sprossen je Zeile werden AUSGERECHNET (Weg „fr", Windows-AZERTY):
 *  - die VOLLE Sprosse: ab ihr erscheint die Zeile mit jedem ihrer Zeichen
 *    (kein Satzzeichen mehr weggelassen) - sie trägt also das Neue dieser
 *    Sprosse, sonst läge sie früher;
 *  - die BUCHSTABEN-Sprosse: ab ihr wird sie überhaupt serviert (noch nicht
 *    gelernte Satzzeichen lässt `fitText` weg). Sie liegt bei jeder Zeile
 *    bei „à" (26) oder später - die frühen Sprossen behalten ihre eigenen,
 *    für sie geschriebenen Zeilen.
 * Dazu: Typografie F8 (Leerzeichen vor `: ; ! ?`, gerades `"`), französische
 * Zahlen, neue Schreibung, keine Zahlwörter 70-99, keine Zeile aus einer
 * anderen fr-Datei (auch nicht fast gleich), kein il/elle- oder Namens-Paar,
 * kein Inhaltswort in mehr als 8 Zeilen, Tatoeba ≤ ¼ mit Herkunft.
 * Jede Regel hat eine Gegenprobe (ein Wächter, der nie anschlägt, beweist
 * nichts).
 */
import { describe, it, expect } from "vitest";
import { setLayout, toLayoutText } from "../src/lib/typing/layouts";
import { lernwegDef } from "../src/lib/typing/lernweg";
import { SHIFT_UNIT } from "../src/lib/typing/letters";
import { fitText, CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { minTierFor } from "../src/lib/typing/tiers";
import { CORPUS_FR_ENDE_KIDS } from "../src/lib/typing/corpusFrEndeKids";
import { SERIEN_FR_ENDE_KIDS } from "../src/lib/typing/serienFrEndeKids";
import { CORPUS_FR_ENDE } from "../src/lib/typing/corpusFrEnde";
import { SERIEN_FR_ENDE } from "../src/lib/typing/serienFrEnde";
import { CORPUS_FR_MITTE } from "../src/lib/typing/corpusFrMitte";
import { SERIEN } from "../src/lib/typing/serien";
import { ETAPPE_MIN_LINES, validateSerie } from "../src/lib/typing/serie";
import { validateHerkunft } from "../src/lib/typing/serien";
import { w1GrossArt, w1SerieNie } from "./helfer/w1-grossbuchstaben";

setLayout("fr");
const INTRO = lernwegDef("fr").introOrder;
const PUNKT = INTRO.indexOf(".") + 1; // 23 (vor D-1: 36)
/**
 * ★ D-1 (28.09.2026): „." und „," stehen jetzt direkt nach Maj (Sprossen
 * 23/24), vor b g h à … ¨. Eine Zeile, die ausser Buchstaben nur Punkt und
 * Komma trägt, erscheint darum an ihrer LETZTEN BUCHSTABEN-Sprosse
 * vollständig (bis 37), nicht mehr an „."/„,". Der Satzzeichen-Block nach den
 * Buchstaben beginnt seither mit „;" (38, unverändert).
 */
const SATZZEICHEN_BLOCK = INTRO.indexOf(";") + 1; // 38
const A_GRAVE = INTRO.indexOf("à") + 1; // 26
const LETZTE = INTRO.length; // 72

const allowedCache = new Map<number, Set<string>>();
function allowedAt(n: number): Set<string> {
  let s = allowedCache.get(n);
  if (!s) {
    s = new Set(INTRO.slice(0, n).filter((u) => u !== SHIFT_UNIT).map((u) => u.toLowerCase()));
    allowedCache.set(n, s);
  }
  return s;
}
const norm = (t: string) => t.replace(/\s+/g, " ").trim();
/** Kleinste Sprosse, ab der die Zeile VOLLSTÄNDIG erscheint (null = nie). */
function volleSprosse(text: string): number | null {
  const ziel = norm(toLayoutText(text));
  for (let n = 1; n <= LETZTE; n++) if (fitText(text, allowedAt(n), "fr") === ziel) return n;
  return null;
}
/** Kleinste Sprosse, ab der die Zeile überhaupt serviert wird. */
function buchstabenSprosse(text: string): number | null {
  for (let n = 1; n <= LETZTE; n++) if (fitText(text, allowedAt(n), "fr") !== null) return n;
  return null;
}

const zeilenVon = (serien: { etappen: { lines: string[] }[] }[]) =>
  serien.flatMap((s) => s.etappen.flatMap((e) => e.lines));

const KORPUS = CORPUS_FR_ENDE_KIDS.map((i) => i.text);
const SERIEN_ZEILEN = zeilenVon(SERIEN_FR_ENDE_KIDS);
const ALLE = [...KORPUS, ...SERIEN_ZEILEN];
const EIGENE = new Set(ALLE);
/** Alle ANDEREN französischen Zeilen (Korpus und Serien des Weges „fr"). */
const ANDERE = [
  ...CORPUS_FR.map((i) => i.text),
  ...zeilenVon(SERIEN.filter((s) => s.nurWeg === "fr")),
].filter((t) => !EIGENE.has(t));

// ── Prüf-Funktionen (einzeln, damit die Gegenproben sie mit Fremdstücken füttern) ──

/** Verbotene Zeichen: Gedankenstriche, typografische Apostrophe, Guillemets, geschützte Leerzeichen. */
const VERBOTEN = /[—–’‘`…·«»  \t]/;

/** Typografie nach französischer Norm in der Form FR/BE/CH (F8) - Liste der Verstösse. */
function typografieFehler(t: string): string[] {
  const f: string[] = [];
  if (VERBOTEN.test(t)) f.push("verbotenes Zeichen");
  if (/  /.test(t)) f.push("doppeltes Leerzeichen");
  if (/ [.,)]/.test(t)) f.push("Leerzeichen vor . , )");
  for (const m of t.matchAll(/[;:!?]/g)) {
    const i = m.index!;
    if (t[i - 1] !== " " && !"!?".includes(t[i - 1])) f.push(`kein Leerzeichen vor „${m[0]}"`);
    const nach = t[i + 1];
    if (nach !== undefined && !` "!?)`.includes(nach)) f.push(`kein Leerzeichen nach „${m[0]}"`);
  }
  if (/,[^ ]/.test(t.replace(/\d,\d/g, ""))) f.push("kein Leerzeichen nach Komma");
  if ((t.match(/"/g) ?? []).length % 2) f.push("Anführungszeichen ungerade");
  let offen = true;
  for (let i = 0; i < t.length; i++) {
    if (t[i] !== '"') continue;
    if (offen && ((i > 0 && !" (".includes(t[i - 1])) || t[i + 1] === " ")) f.push("öffnendes \" falsch gesetzt");
    if (!offen && (t[i - 1] === " " || (t[i + 1] !== undefined && !" .,)".includes(t[i + 1])))) f.push("schliessendes \" falsch gesetzt");
    offen = !offen;
  }
  if ((t.match(/\(/g) ?? []).length !== (t.match(/\)/g) ?? []).length) f.push("Klammern ungleich");
  if (!/^("|\()?[A-ZÀ-ÖØ-Þ]/.test(t)) f.push("beginnt nicht gross");
  if (!/[.!?]["')]?$/.test(t)) f.push("kein Satzschluss am Ende");
  if (/\d{5,}/.test(t)) f.push("Zahl ab 10 000 ohne Leerzeichen-Gruppen");
  if (/\b\d\d?h\d/.test(t) || /\d h\d/.test(t)) f.push("Uhrzeit nicht als 8 h 30");
  if (/\d%/.test(t) || /\d€/.test(t)) f.push("vor % oder € fehlt das Leerzeichen");
  if (/\d\.\d/.test(t)) f.push("Dezimalpunkt statt Komma");
  if (/[.!?]" "?[A-ZÀ-Þ]/.test(t)) f.push("neuer Satz direkt nach schliessendem \" (keine frühe Fassung möglich)");
  return f;
}

/** Alte Schreibung, wo es eine neue gibt (F4), und Wörter mit strittiger Neuschreibung. */
const ALTE_SCHREIBUNG =
  /(?:^|[\s"'(-])(île|îles|boîte|boîtes|goût|goûter|goûte|août|dîner|dîne|flûte|croûte|maître|maîtresse|chaîne|connaître|connaît|paraît|apparaît|plaît|entraîne|traîne|traîneau|huître|bûche|brûle|brûler|coûte|coûter|gîte|voûte|aîné|aînée|abîme|événement|événements|oignon|nénuphar|aiguë|fraîche|naître|naît|piqûre|week-end|pique-nique|porte-monnaie|mille-pattes|croque-monsieur|tire-bouchon|chauve-souris|chauves-souris)(?=[\s.,;:!?")-]|$)/i;
/** Zusammengesetztes Zahlwort ohne Bindestrich = alte Schreibung (F4: vingt-et-un, deux-cents). */
const ZAHLWORT =
  "deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze|treize|quatorze|quinze|seize|vingt|vingts|trente|quarante|cinquante|soixante|cent|cents|mille";
const ZUSAMMENGESETZT = new RegExp(`\\b(${ZAHLWORT})\\s+(et\\s+)?(un|une|${ZAHLWORT})\\b`, "i");
/** Zahlwörter 70-99 hängen an der Landesvariante (Bauplan §6.5 Punkt 4) - hier gar nicht. */
const VARIANTE_70_99 =
  /\b(septante|huitante|octante|nonante|soixante-dix|soixante-et-onze|soixante-douze|soixante-treize|soixante-quatorze|soixante-quinze|soixante-seize|soixante-dix-\w+|quatre-vingt\w*)\b/i;
/** Kein Schweinefleisch, keine Religion als Einzelthema, kein Alkohol, nichts gegen ein Kind. */
const TABU =
  /\b(porc|cochon|jambon|saucisson|lard|bacon|dieu|église|mosquée|prière|prier|bible|coran|noël|pâques|ramadan|aïd|hanoukka|bière|vin|alcool|bête|idiot|stupide|nul|nulle|gros|grosse|moche|faute|fautes)\b/i;

const ohneZeichen = (t: string) => t.toLowerCase().replace(/[.,;:!?"()]/g, " ").replace(/\s+/g, " ").trim();
function woerter(text: string): Set<string> {
  return new Set(ohneZeichen(text).replace(/'/g, "' ").split(/\s+/).filter(Boolean));
}
/** Fast gleich (Muster Teens/Kinder 25-34): Wortmengen-Jaccard ab 0,6 - Satzzeichen zählen nicht. */
function fastGleich(a: string, b: string): boolean {
  if (ohneZeichen(a) === ohneZeichen(b)) return true;
  const wa = woerter(a);
  const wb = woerter(b);
  const schnitt = [...wa].filter((w) => wb.has(w)).length;
  return schnitt / new Set([...wa, ...wb]).size >= 0.6;
}
/** il/elle- und Namens-Paar: erstes Wort und Pronomen gleichgesetzt. */
function paarSchluessel(zeile: string): string {
  return ohneZeichen(zeile)
    .replace(/^(il|elle|ils|elles|je|tu|on|nous|[a-zà-ÿ]+)\s/, "X ")
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
 * Funktionswörter wie in den Wächtern 25-34, dazu die Fragewörter (an der
 * Fragezeichen-Sprosse steht in fast jeder Zeile eines) und die Satzverbinder,
 * die ab der Punkt-Sprosse zwei Sätze einer Zeile verbinden.
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
  "quoi", "comment", "pourquoi", "combien", "quel", "quelle", "quels", "quelles", "est-ce",
  "puis", "alors", "ensuite", "donc", "eux",
  // Zeichen von Masseinheiten und Ordnungszahlen (1er, 2e, 6H, 8 h 30, 5 km) - keine Inhaltswörter
  "h", "min", "m", "cm", "km", "kg", "g", "l", "er", "re", "e",
]);
function zuHaeufigeWoerter(zeilen: string[], grenze: number): string[] {
  const h = new Map<string, number>();
  for (const z of zeilen) {
    const ws = new Set(
      ohneZeichen(z)
        .replace(/'/g, "' ")
        .split(/\s+/)
        .map((w) => w.replace(/[^a-zà-öø-ÿœ'-]/g, "").replace(/^-+|-+$/g, ""))
        .filter((w) => w && !FUNKTIONSWOERTER.has(w)),
    );
    for (const w of ws) h.set(w, (h.get(w) ?? 0) + 1);
  }
  return [...h].filter(([, n]) => n > grenze).map(([w, n]) => `"${w}": ${n} Zeilen`);
}

// ── Korpus ─────────────────────────────────────────────────────────────────

describe("E9-ende-kids: Korpus fr-Weg ab der Punkt-Sprosse (Kinder)", () => {
  it("jede Zeile erscheint vollständig an Sprosse 36-72, wird nicht vor „à“ serviert, minTier stimmt", () => {
    const fehler: string[] = [];
    for (const item of CORPUS_FR_ENDE_KIDS) {
      // ★ W1 (27.09.2026): É/Ç kommen auf Windows-AZERTY nie vor (Johannes §3.8) - Zeilen mit ihnen erscheinen dort nie, auf Belgien, der Schweiz und in Kanada schon. Zentral geprüft in tests/tastenflow-w1-modelle-gegen-windows.test.ts.
      if (w1GrossArt(item.text) === "nie") continue;
      const v = volleSprosse(item.text);
      const b = buchstabenSprosse(item.text);
      if (v === null || v < PUNKT || v > LETZTE) fehler.push(`"${item.text}": volle Sprosse ${v}`);
      if (b === null || b < A_GRAVE) fehler.push(`"${item.text}": schon an Sprosse ${b} serviert`);
      const tier = minTierFor(item.text, "fr");
      if (tier !== item.minTier) fehler.push(`"${item.text}": minTier=${item.minTier}, tatsächlich ${tier}`);
      if (item.nurWeg !== "fr") fehler.push(`"${item.text}": nurWeg fehlt`);
      if (item.stufen.join() !== "kids") fehler.push(`"${item.text}": stufen ${item.stufen.join()}`);
    }
    expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
  });

  it("Typografie F8, französische Zahlen, gerades Anführungszeichen - Korpus und Serien", () => {
    const fehler = ALLE.flatMap((z) => typografieFehler(z).map((f) => `${f}: ${z}`));
    expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
  });

  it("nur neue Rechtschreibung (F4), Zahlwörter mit Bindestrich, keine Zahlwörter 70-99, nichts Tabu", () => {
    const fehler = ALLE.filter(
      (z) => ALTE_SCHREIBUNG.test(z) || ZUSAMMENGESETZT.test(z) || VARIANTE_70_99.test(z) || TABU.test(z),
    );
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("keine Zeile doppelt - weder in sich noch gegen Weg „de“/„en“", () => {
    const fehler: string[] = [];
    const gesehen = new Set<string>();
    for (const z of ALLE) {
      const k = ohneZeichen(z);
      if (gesehen.has(k)) fehler.push(`doppelt: "${z}"`);
      gesehen.add(k);
    }
    const andere = new Set([...CORPUS, ...CORPUS_EN].map((i) => ohneZeichen(i.text)));
    for (const z of ALLE) if (andere.has(ohneZeichen(z))) fehler.push(`auch in de/en: "${z}"`);
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("keine Zeile aus einer anderen fr-Datei (alle Stufen, alle Sprossen), auch nicht fast gleich", () => {
    const fehler: string[] = [];
    for (const z of ALLE) for (const a of ANDERE) if (fastGleich(z, a)) fehler.push(`"${z}" ~ "${a}"`);
    expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
  });

  it("auch in sich keine zwei fast gleichen Zeilen", () => {
    const fehler: string[] = [];
    for (let i = 0; i < ALLE.length; i++) {
      for (let j = i + 1; j < ALLE.length; j++) if (fastGleich(ALLE[i], ALLE[j])) fehler.push(`"${ALLE[i]}" ~ "${ALLE[j]}"`);
    }
    expect(fehler, fehler.slice(0, 10).join("\n")).toEqual([]);
  });

  it("kein il/elle- oder Namens-Paar - in sich und gegen die anderen fr-Dateien", () => {
    const paare = findePaare(ALLE, ANDERE);
    expect(paare, paare.slice(0, 10).join("\n")).toEqual([]);
  });

  it("kein Inhaltswort in mehr als 8 Zeilen (Korpus + Serien zusammen)", () => {
    const zuViel = zuHaeufigeWoerter(ALLE, 8);
    expect(zuViel, zuViel.join("\n")).toEqual([]);
  });

  /**
   * Gemessener Stand (E9-ende-kids) - darf nur STEIGEN. „(" hat keine
   * eigene Zeile: eine Zeile mit Klammer trägt immer auch „)", und die kommt
   * eine Sprosse später. Die Sonderzeichen tragen weniger Zeilen - lieber
   * wenige natürliche als viele erzwungene.
   */
  // ★ W1 (27.09.2026, BEFUND-2026-09-27-W1-WINDOWS-BLOCKER.md §3): an einzelnen Sprossen
  // GESENKT - Zeilen mit Grossbuchstaben über eine Totaste (À Ê …) kommen seither erst mit
  // der letzten Einheit (späte Lektion), Zeilen mit É/Ç auf Windows-AZERTY nie (Johannes §3.8).
  const MINDESTENS_JE_SPROSSE: Record<string, number> = {
    ".": 29, ",": 28, ";": 16, ":": 28, "!": 28, "?": 30, "\"": 23, "-": 35, ")": 18,
    "1": 21, "2": 24, "3": 20, "4": 18, "5": 18, "6": 18, "7": 14, "8": 16, "9": 14, "0": 20,
    "&": 8, "_": 5, "/": 9, "%": 9, "+": 7, "=": 8, "*": 5, "<": 5, ">": 5, "@": 3, "€": 7,
    "]": 3, "}": 3, "#": 4, "|": 3,
  };
  it("je Sprosse mindestens so viele Zeilen wie gemessen (volle Sprosse)", () => {
    const anzahl = new Map<string, number>();
    for (const z of KORPUS) {
      const v = volleSprosse(z);
      // ★ D-1: alles vor dem Satzzeichen-Block zählt in den Topf „. ,".
      if (v !== null) {
        const topf = v < SATZZEICHEN_BLOCK ? ".," : INTRO[v - 1];
        anzahl.set(topf, (anzahl.get(topf) ?? 0) + 1);
      }
    }
    const zuWenig: string[] = [];
    {
      const min = (MINDESTENS_JE_SPROSSE["."] ?? 0) + (MINDESTENS_JE_SPROSSE[","] ?? 0);
      const n = anzahl.get(".,") ?? 0;
      if (n < min) zuWenig.push(`Punkt und Komma (Sprossen ${PUNKT}-${SATZZEICHEN_BLOCK - 1}): ${n} (mindestens ${min})`);
    }
    for (const [einheit, min] of Object.entries(MINDESTENS_JE_SPROSSE)) {
      if (einheit === "." || einheit === ",") continue; // ★ D-1: oben, ein Topf
      const n = anzahl.get(einheit) ?? 0;
      if (n < min) zuWenig.push(`Sprosse ${INTRO.indexOf(einheit) + 1} („${einheit}“): ${n} (mindestens ${min})`);
    }
    expect(zuWenig, zuWenig.join("\n")).toEqual([]);
  });

  it("Tatoeba höchstens ein Viertel, jede Übernahme mit Satznummer, Benutzer und Lizenz", () => {
    const uebernommen = CORPUS_FR_ENDE_KIDS.filter((i) => i.herkunft);
    expect(uebernommen.length).toBeGreaterThan(0);
    expect(uebernommen.length / CORPUS_FR_ENDE_KIDS.length).toBeLessThanOrEqual(0.25);
    for (const i of uebernommen) {
      const h = i.herkunft!;
      expect(h.quelle, i.text).toBe("Tatoeba");
      expect(h.lizenz, i.text).toBe("CC BY 2.0 FR");
      expect(h.autor, i.text).toBeTruthy();
      expect(h.fundstelle, i.text).toMatch(/^https:\/\/tatoeba\.org\/fr\/sentences\/show\/\d+ \(Original: /);
      expect(validateHerkunft(h), i.text).toEqual([]);
      // Einzige Änderung am Original: geschützte Leerzeichen und typografischer Apostroph.
      const original = h.fundstelle!.replace(/^.*?\(Original: /, "").replace(/\)$/, "");
      expect(original.replace(/[  ]/g, " ").replace(/’/g, "'"), i.text).toBe(i.text);
    }
  });

  it("die Kinder-Zeilen hängen in der Sammelstelle und HINTER den Sprossen 9-34 in CORPUS_FR", () => {
    expect(CORPUS_FR_ENDE.slice(0, CORPUS_FR_ENDE_KIDS.length)).toEqual(CORPUS_FR_ENDE_KIDS);
    const texte = CORPUS_FR.map((i) => i.text);
    const letzteMitte = Math.max(...CORPUS_FR_MITTE.map((i) => texte.indexOf(i.text)));
    for (const i of CORPUS_FR_ENDE_KIDS) expect(texte.indexOf(i.text), i.text).toBeGreaterThan(letzteMitte);
    for (const s of SERIEN_FR_ENDE_KIDS) {
      expect(SERIEN_FR_ENDE).toContain(s);
      expect(SERIEN).toContain(s);
    }
  });
});

// ── Serien ─────────────────────────────────────────────────────────────────

describe("E9-ende-kids: Serien fr-Weg ab der Punkt-Sprosse (Kinder)", () => {
  it("8 Serien, je EINE Etappe mit 12-14 Zeilen, lang fr, nurWeg fr, Stufe kids, kein „œ“", () => {
    expect(SERIEN_FR_ENDE_KIDS.length).toBe(8);
    for (const s of SERIEN_FR_ENDE_KIDS) {
      expect(s.lang, s.slug).toBe("fr");
      expect(s.nurWeg, s.slug).toBe("fr");
      expect(s.stufen, s.slug).toEqual(["kids"]);
      expect(s.etappen.length, s.slug).toBe(1);
      const n = s.etappen[0].lines.length;
      expect(n, `${s.slug}: ${n}`).toBeGreaterThanOrEqual(ETAPPE_MIN_LINES);
      expect(n, `${s.slug}: ${n}`).toBeLessThanOrEqual(14);
      // Die allgemeinen Serien-Wächter rechnen mit der Tastatur „de" - dort gibt es keinen Ersatz für œ.
      for (const l of s.etappen[0].lines) expect(/œ/i.test(l), l).toBe(false);
    }
  });

  it("jede Serie besteht validateSerie(s, \"fr\")", () => {
    for (const s of SERIEN_FR_ENDE_KIDS)
      expect(
        // ★ W1: eine Serie mit É/Ç ist auf Windows-AZERTY „nie freischaltbar" - gewollt (siehe tests/helfer/w1-grossbuchstaben.ts).
        validateSerie(s, "fr").problems.filter((p) => !(w1SerieNie(s) && /nie freischaltbar/.test(p))),
        s.slug,
      ).toEqual([]);
  });

  /**
   * Eine Serie öffnet, sobald JEDE ihrer Zeilen tippbar ist - noch nicht
   * gelernte Satzzeichen lässt `fitText` dabei weg (Buchstaben-Sprosse). Jede
   * dieser Serien trägt darum ein „hartes" Zeichen (Bindestrich oder Ziffer),
   * das sie erst an der Sprosse öffnet, an der auch jede Zeile VOLLSTÄNDIG
   * erscheint: kein Kind bekommt diese Geschichten ohne ihre Satzzeichen.
   */
  it("jede Serie öffnet an Sprosse 36-72, und beim Öffnen erscheint jede Zeile vollständig", () => {
    const fehler: string[] = [];
    for (const s of SERIEN_FR_ENDE_KIDS) {
      // ★ W1 (27.09.2026): É/Ç kommen auf Windows-AZERTY nie vor (Johannes §3.8) - Zeilen mit ihnen erscheinen dort nie, auf Belgien, der Schweiz und in Kanada schon. Zentral geprüft in tests/tastenflow-w1-modelle-gegen-windows.test.ts.
      if (w1SerieNie(s)) continue;
      const volle = s.etappen[0].lines.map((l) => volleSprosse(l));
      if (volle.some((x) => x === null)) fehler.push(`${s.slug}: Zeile erscheint nie vollständig`);
      const voll = Math.max(...volle.map((x) => x ?? 99));
      const offen = Math.max(...s.etappen[0].lines.map((l) => buchstabenSprosse(l) ?? 99));
      if (voll < PUNKT || voll > LETZTE) fehler.push(`${s.slug}: vollständig an Sprosse ${voll}`);
      if (offen < voll) fehler.push(`${s.slug}: öffnet an ${offen}, vollständig erst an ${voll}`);
    }
    expect(fehler, fehler.join("\n")).toEqual([]);
  });

  it("mindestens ein Drittel spielt ausserhalb Frankreichs (Bauplan §6.5 Regel 8)", () => {
    const ausserhalb = [
      "fr-weg-kids-les-murs-de-bruxelles", // Belgien
      "fr-weg-kids-la-desalpe", // Schweiz (Charmey)
      "fr-weg-kids-le-lemurien-gourmand", // Madagaskar
      "fr-weg-kids-tempete-de-neige-a-sherbrooke", // Québec
      "fr-weg-kids-au-souk-de-marrakech", // Marokko
      "fr-weg-kids-le-tintamarre", // Acadie
    ];
    for (const slug of ausserhalb) expect(SERIEN_FR_ENDE_KIDS.some((s) => s.slug === slug), slug).toBe(true);
    expect(ausserhalb.length / SERIEN_FR_ENDE_KIDS.length).toBeGreaterThanOrEqual(1 / 3);
  });

  it("die Slugs sind neu (keine andere Serie trägt denselben)", () => {
    for (const s of SERIEN_FR_ENDE_KIDS) expect(SERIEN.filter((x) => x.slug === s.slug).length, s.slug).toBe(1);
  });
});

// ── Gegenproben: jede Regel schlägt an, wenn man ihr einen Fehler vorlegt ──

describe("E9-ende-kids: Gegenproben der Wächter", () => {
  it("volle Sprosse: eine Frage liegt an „?“, eine Zeile mit Komma an „,“, mit Ziffer 7 an „7“", () => {
    expect(INTRO[volleSprosse("Tu viens à la plage ?")! - 1]).toBe("?");
    // ★ D-1: nur Buchstaben vor Maj + „," - vollständig genau an „,".
    expect(INTRO[volleSprosse("Le matin, il pleut.")! - 1]).toBe(",");
    // … mit einem späteren Buchstaben erst an diesem (hier „à").
    expect(INTRO[volleSprosse("Le matin, il pleut à Dakar.")! - 1]).toBe("à");
    expect(INTRO[volleSprosse("Il a 7 ans et il vit à Genève.")! - 1]).toBe("7");
  });
  it("Buchstaben-Sprosse: eine Zeile ohne späten Buchstaben würde schon früh serviert", () => {
    expect(buchstabenSprosse("Le chat dort. Il ronfle.")!).toBeLessThan(A_GRAVE);
    expect(buchstabenSprosse("Le chat dort à côté.")!).toBeGreaterThanOrEqual(A_GRAVE);
  });
  it("Typografie: fehlendes Leerzeichen vor „?“, Guillemets, 12500 und 8h30 werden gefunden", () => {
    expect(typografieFehler("Tu viens?").length).toBeGreaterThan(0);
    expect(typografieFehler("Il dit « oui ».").length).toBeGreaterThan(0);
    expect(typografieFehler("Il y a 12500 étoiles.").length).toBeGreaterThan(0);
    expect(typografieFehler("Rendez-vous à 8h30.").length).toBeGreaterThan(0);
    expect(typografieFehler("\"On y va !\" crie Awa.")).toEqual([]);
    expect(typografieFehler("Il est 8 h 30 et il fait 12 500 pas.")).toEqual([]);
  });
  it("alte Schreibung, Zahlwort ohne Bindestrich, 70-99 und Tabu werden gefunden", () => {
    expect(ALTE_SCHREIBUNG.test("Le goûter est prêt.")).toBe(true);
    expect(ALTE_SCHREIBUNG.test("Le gouter est prêt.")).toBe(false);
    expect(ZUSAMMENGESETZT.test("Il a vingt deux billes.")).toBe(true);
    expect(ZUSAMMENGESETZT.test("Il a vingt-deux billes.")).toBe(false);
    expect(VARIANTE_70_99.test("Il a soixante-dix ans.")).toBe(true);
    expect(VARIANTE_70_99.test("Il a soixante-cinq ans.")).toBe(false);
    expect(TABU.test("Un sandwich au jambon.")).toBe(true);
  });
  it("eine Zeile aus einer anderen Datei und eine fast gleiche werden gefunden, Satzzeichen zählen nicht", () => {
    expect(ANDERE.some((k) => fastGleich(k + " !", k))).toBe(true);
    expect(fastGleich("Il pleut. On reste là.", "Il pleut, on reste là !")).toBe(true);
  });
  it("eine Serie ohne hartes Zeichen würde schon vor ihren Satzzeichen öffnen", () => {
    const ohne = ["Il pleut à verse !", "\"Viens vite !\" crie Zoé."];
    const offen = Math.max(...ohne.map((l) => buchstabenSprosse(l)!));
    const voll = Math.max(...ohne.map((l) => volleSprosse(l)!));
    expect(offen).toBeLessThan(voll);
    const mit = [...ohne, "Peut-être qu'il neige demain."];
    expect(Math.max(...mit.map((l) => buchstabenSprosse(l)!))).toBe(Math.max(...mit.map((l) => volleSprosse(l)!)));
  });
  it("il/elle- und Namens-Paare werden gefunden", () => {
    expect(findePaare(["Il va à la plage.", "Elle va à la plage !"]).length).toBe(1);
    expect(findePaare(["Awa mange un kiwi.", "Walid mange un kiwi."]).length).toBe(1);
    expect(findePaare(["Il va à la plage.", "Elle mange une pomme."]).length).toBe(0);
  });
  it("ein Wort in neun Zeilen wird gefunden, ein Fragewort nicht", () => {
    const neun = Array.from({ length: 9 }, (_, i) => `Pourquoi le zèbre numero ${i} dort-il ?`);
    expect(zuHaeufigeWoerter(neun, 8).some((w) => w.startsWith('"zèbre"'))).toBe(true);
    expect(zuHaeufigeWoerter(neun, 8).some((w) => w.startsWith('"pourquoi"'))).toBe(false);
  });
});
