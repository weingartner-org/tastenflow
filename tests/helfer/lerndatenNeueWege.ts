/**
 * ★★★ D-LERNDATEN (25.10.2026): DIE WÄCHTER DER LERNDATEN DER NEUN GERÜST-WEGE (bg, el, hu, nl, pt, br, ro, sv, uk).
 *
 * Die neun Wege bekommen in D-LERNDATEN ihre Lerndaten aus `tf-fest-xx.json` (Rezept Teil D): Übungswörter, Themenwortschatz,
 * Lückentext, Korrekturlesen, Buchstabensalat, Geläufigkeit, Wortketten, Wurzel-Vorlage und eine erste Sperrliste. Die Regeln
 * sind die der cs-Wächter (`tastenflow-cs-woerter`, `tastenflow-wortspiele-cs`, `tastenflow-vorlage-koreny-cs`), soweit sie OHNE
 * eigene Reihenfolge (F4), Tastaturen (G3b) und Lexikon (F8) messbar sind; was davon abhängt, steht als `it.skip` mit Grund da
 * oder wird übersprungen, bis es da ist (nie grün geschummelt).
 *
 * Eine Abweichung, die die gelieferten Daten heute haben, ist KEINE gesenkte Grenze, sondern eine BENANNTE Liste in der
 * Testdatei des Weges (`bekannt`): genau diese Fälle, nicht einer mehr. Jede Liste steht im Befund
 * `BEFUND-2026-10-25-D-LERNDATEN.md` als offene Menge.
 *
 * Abschnitte je Weg:
 *  1 · Sperrliste (Gegenproben, Form der Listen)
 *  2 · Zeichen: nur das Alphabet der Sprache, NFC, keine fremde Schrift (bg/el/uk: kein lateinischer Buchstabe; uk: kein ы э ъ ё;
 *      ro: Komma-ș ț, nie Cedille), gerade Typografie, nur Bindestrich
 *  3 · Übungswörter und Themenwortschatz: Menge, Doppelte, klein, Sperrliste - und (nach F4) die Lern-Folge
 *  4 · Lückentext · 5 · Korrekturlesen · 6 · Buchstabensalat · 7 · Geläufigkeit · 8 · Wortketten · 9 · Wurzel-Vorlage
 * 10 · ★ Auf dem Weg des Kindes (Falle 43): mit Schalter AN kommen die Daten in jeder Form an, mit Schalter AUS nirgends.
 */
import { describe, expect, it } from "vitest";
import type { InhaltsStufe, Lang } from "../../src/lib/typing/account";
import { uebungsSpracheImWeg } from "../../src/lib/typing/account";
import { allowedFromIntroduced } from "../../src/lib/typing/serien";
import { fitText, korpusFuer } from "../../src/lib/typing/corpus";
import { WORDS_EN } from "../../src/lib/typing/corpusEn";
import { WORDS } from "../../src/lib/typing/words";
import type { Uebungsform } from "../../src/lib/typing/uebungsformen/typen";
import { bestimmeLernweg, lernwegDef, type Lernweg } from "../../src/lib/typing/lernweg";
import { introOrder, SHIFT_UNIT } from "../../src/lib/typing/letters";
import type { GeruestSprache } from "../../src/lib/typing/sprachRegister";
import { UEBUNGSFORMEN } from "../../src/lib/typing/uebungsformen";
import { wortquelle } from "../../src/lib/typing/uebungsformen/hilfen";
import { lueckentextKandidaten, type Raetsel } from "../../src/lib/typing/uebungsformen/lueckentext";
import { faelleFuer, type Korrekturfall } from "../../src/lib/typing/uebungsformen/korrekturlesen";
import { waehleSalatwort, type Salatwort } from "../../src/lib/typing/uebungsformen/buchstabensalat";
import { gelaeufigkeitsZeile, type Verbindung } from "../../src/lib/typing/uebungsformen/gelaeufigkeit";
import type { Wortkette } from "../../src/lib/typing/uebungsformen/wortkettenThemen";
import type { FormKontext } from "../../src/lib/typing/uebungsformen/typen";
import { vorlagenFuer, vorlageVorschau } from "../../src/lib/typing/vorlagen";

export type Stufe3 = "kids" | "teens" | "erwachsen";
const STUFEN: readonly Stufe3[] = ["kids", "teens", "erwachsen"];

/** Ein Wurzel-Paar, wie `vorlagenDaten/wurzeln<Xx>.ts` es führt (Feldnamen wie `radiciIt.ts`). */
export interface WurzelPaar {
  indizio: string;
  parola: string;
  origine: string;
  beleg: string;
}

/** Was ein Weg seinem Wächter übergibt - Daten, Regeln der Sprache, und die benannten Abweichungen der gelieferten Daten. */
export interface LerndatenWeg {
  weg: GeruestSprache;
  /** Deutscher Name, für die Meldungen. */
  name: string;
  /** Die Buchstaben des Alphabets, KLEIN (mit Diakritika); ihre Grossformen sind im Satz erlaubt. */
  buchstaben: string;
  /** Zeichen, die in KEINEM Text des Weges stehen dürfen (fremde Schrift, verwechselte Buchstaben). */
  fremd: RegExp;
  /** Ein Beispiel, das `fremd` treffen MUSS (Gegenprobe: der Wächter ist nicht taub). */
  fremdProbe: string;
  /** Für den Ortsvergleich der Geläufigkeit (el: ohne Tonos - `αι` steht in `αίθουσα`). Vorgabe: unverändert. */
  ortsForm?: (s: string) => string;

  woerter: readonly string[];
  vocab: Readonly<Record<InhaltsStufe, readonly string[]>>;
  raetsel: readonly Raetsel[];
  korrektur: readonly Korrekturfall[];
  salat: readonly Salatwort[];
  verbindungen: readonly Verbindung[];
  ketten: readonly Wortkette[];
  wurzelThemen: readonly { id: string; titel: string; titelJe?: Partial<Record<string, string>> }[];
  wurzeln: Readonly<Record<Stufe3, readonly { id: string; titel: string; paare: readonly WurzelPaar[] }[]>>;
  wurzelnAlphabetisch: Readonly<Record<Stufe3, readonly string[]>>;
  wurzelZeile: (p: { indizio: string; parola: string }) => string;
  challengeTitel: Partial<Record<string, string>>;

  gesperrt: (w: string) => boolean;
  istKernGesperrt: (w: string) => boolean;
  sperrListen: readonly (readonly string[])[];
  /** Gegenproben der Sperrliste: `kern` überall gesperrt, `basis` nur Wortbasis, `frei` harmlose Verwandte. */
  sperrProben: { kern: readonly string[]; basis: readonly string[]; frei: readonly string[] };

  /** Was geliefert wurde (gemessen 25.10.2026) - die Menge darf nicht still schrumpfen. */
  geliefert: {
    woerter: number;
    vocab: Readonly<Record<Stufe3, number>>;
    raetsel: number;
    korrektur: number;
    salat: number;
    verbindungen: number;
    ketten: number;
    /**
     * ★ Die Mindestzahl der Wurzel-Paare je Stufe: GELIEFERT, nicht das Ziel. cs/it verlangen 80 je Stufe (20+15+15+15+15);
     * wo weniger geliefert ist, steht hier die gelieferte Zahl (Kommentar in der Testdatei: „geliefert N, Ziel 80").
     */
    wurzelnMindestens: Readonly<Record<Stufe3, number>>;
  };

  /** Die benannten Abweichungen der gelieferten Daten - genau diese, nicht eine mehr (alle im Befund als offen). */
  bekannt: {
    /** Einbuchstaben-Wörter in `WORDS_<XX>` (cs verlangt mindestens zwei Zeichen; es sind echte Wörter der Sprache). */
    einBuchstabe: readonly string[];
    /** Wörter des Themenwortschatzes, die in zwei Stufen stehen (cs: keines doppelt). */
    vocabInZweiStufen: readonly string[];
    /** Lückentext-Lösungen aus mehreren Wörtern (cs: genau ein Wort; tippbar sind sie - die Lösung wird als Ganzes geprüft). */
    loesungMehrwortig: readonly string[];
    /** Salat-Quellwörter ab 8 Buchstaben, die auch Kinder bekommen (cs/de/pl/it: lange erst ab den Jugendlichen). */
    salatLangFuerKinder: readonly string[];
    /** Wurzel-Zeilen über 40 Zeichen (die Vorlage bricht bei 40 um - das Paar stünde auf zwei Zeilen). */
    wurzelZeileUeber40: readonly string[];
    /** Wurzel-Wörter mit Grossbuchstaben (Monatsnamen, Eigennamen). */
    wurzelWortGross: readonly string[];
    /** Wurzel-Wörter, die im eigenen Hinweis stehen (der Hinweis verrät das Wort). */
    wurzelWortImHinweis: readonly string[];
    /** Lückensätze, in denen eine Lösung schon im Satz steht (Muster „ein Kind, zwei ...", feste Wendungen). */
    loesungImSatz: readonly string[];
    /** Korrekturfälle, in denen das richtige Wort schon im Satz steht. */
    korrekturRichtigImSatz: readonly string[];
    /** Wörter mit Grossbuchstaben in den Wortlisten (Übungswörter, Wortschatz, Salat, Geläufigkeit, Wortketten): Eigennamen, Wochentage. */
    wortGross: readonly string[];
    /** Buchstaben ausserhalb des Alphabets, die in Sätzen/Lösungen vorkommen dürfen (Grund in der Testdatei), z. B. in einem Namen. */
    zusatzBuchstaben: string;
  };
}

// ── Helfer ─────────────────────────────────────────────────────────────────

function doppelte(liste: readonly string[]): string[] {
  const gesehen = new Set<string>();
  const doppelt = new Set<string>();
  for (const x of liste) (gesehen.has(x) ? doppelt : gesehen).add(x);
  return [...doppelt];
}

/** Wörter eines Satzes (Buchstaben, Apostroph und Bindestrich im Wort; beides trennt für die Sperrprüfung zusätzlich). */
function woerterIm(text: string): string[] {
  return text
    .split(/[^\p{L}\p{M}'-]+/u)
    .flatMap((w) => [w, ...w.split(/['-]/)])
    .filter((w) => /\p{L}/u.test(w));
}

/** Gedankenstriche und geschützte Leerzeichen aus Codes gebaut, damit im Quelltext keiner steht (Hausregel: nur Bindestrich). */
const STRICHE_UND_NBSP = String.fromCharCode(0x2013, 0x2014, 0x00a0, 0x202f);
const TYPOGRAFIE = new RegExp(`[„“”«»‚‘’…${STRICHE_UND_NBSP}]`);
const SATZ_ZEICHEN = " .,;:!?\"'()-@%/0123456789";

/** Der VOLLE Tastenstand für einen Gerüst-Weg: alle Zeichen, die die Daten tragen, dazu Ziffern, Satzzeichen, Umschalt. */
function vollerStand(cfg: LerndatenWeg): string[] {
  const zeichen = new Set<string>();
  const texte = [
    ...cfg.woerter,
    ...Object.values(cfg.vocab).flat(),
    ...cfg.raetsel.flatMap((r) => [r.satz, ...r.loesungen]),
    ...cfg.korrektur.flatMap((f) => [f.satz, f.falsch, f.richtig]),
    ...cfg.salat.map((s) => s.wort),
    ...cfg.verbindungen.flatMap((v) => v.woerter),
    ...cfg.ketten.flatMap((k) => k.woerter),
  ];
  for (const t of texte) for (const c of t.toLocaleLowerCase()) if (c !== " ") zeichen.add(c);
  return [...new Set([...introOrder(cfg.weg), ...zeichen, ...SATZ_ZEICHEN.trim(), SHIFT_UNIT])];
}

/** Der INHALT einer Runde als Wortmenge, ohne Rahmen - wie in `tastenflow-g2b2-neue-sprache-nie-deutsch`. */
function inhaltVon(form: Uebungsform, c: FormKontext): Set<string> {
  const texte: string[] = [];
  if (!form.taugt(c)) return new Set();
  if (form.fragen) {
    for (const a of form.fragen(c)) texte.push(...(a.frageTeile?.filter((t) => t.inhalt).map((t) => t.text) ?? [a.frage]), ...a.antworten);
  } else if (form.baue) {
    for (const z of form.baue(c)?.zeilen ?? []) texte.push(z.text);
  }
  return new Set(texte.join(" ").toLocaleLowerCase().split(/[\s.,;:!?"'()…-]+/).filter(Boolean));
}

/** Wörter, die deutsch sind und nicht auch englisch (Wortliste und Korpus beider Sprachen) - einmal gerechnet. */
let nurDeutsch: Set<string> | null = null;
function NUR_DEUTSCH(): Set<string> {
  if (nurDeutsch) return nurDeutsch;
  const von = (texte: readonly string[]) => {
    const aus = new Set<string>();
    for (const t of texte) for (const w of t.toLowerCase().split(/[^a-zäöüß]+/)) if (w.length > 1) aus.add(w);
    return aus;
  };
  const de = von([...WORDS, ...korpusFuer("de").map((z) => z.text)]);
  const en = von([...WORDS_EN, ...korpusFuer("en").map((z) => z.text)]);
  nurDeutsch = new Set([...de].filter((w) => !en.has(w)));
  return nurDeutsch;
}

function ctx(cfg: LerndatenWeg, lernweg: Lernweg, lang: Lang, stufe: Stufe3, samen: number): FormKontext {
  let s = samen;
  return {
    lernweg,
    introduced: vollerStand(cfg),
    shift: true,
    oneHand: false,
    stufe,
    lang,
    count: 8,
    zufall: () => {
      s = (s * 1103515245 + 12345) % 2147483648;
      return s / 2147483648;
    },
  };
}

// ── der Wächter ───────────────────────────────────────────────────────────

export function pruefeLerndaten(cfg: LerndatenWeg): void {
  const kleinBuchstabe = new RegExp(`^[${cfg.buchstaben}${cfg.bekannt.zusatzBuchstaben}]$`, "u");
  const buchstabeBeide = (c: string) => kleinBuchstabe.test(c.toLocaleLowerCase());
  /** Ein Wort: nur Buchstaben des Alphabets, klein; Bindestrich und Apostroph nur IM Wort. */
  const wortRegel = new RegExp(`^[${cfg.buchstaben}]+(['-][${cfg.buchstaben}]+)*$`, "u");
  const istWort = (w: string) => wortRegel.test(w);
  /** Ein Satz: Buchstaben (beide Fälle) und die tippbaren Satzzeichen - sonst nichts. */
  const satzFehler = (t: string): string[] => [...t].filter((c) => !buchstabeBeide(c) && !SATZ_ZEICHEN.includes(c));

  const alleWortListen: Record<string, readonly string[]> = {
    woerter: cfg.woerter,
    wortschatz: Object.values(cfg.vocab).flat(),
    salat: cfg.salat.map((s) => s.wort),
    verbindungen: cfg.verbindungen.flatMap((v) => v.woerter),
    ketten: cfg.ketten.flatMap((k) => k.woerter),
    wurzeln: STUFEN.flatMap((s) => cfg.wurzeln[s].flatMap((t) => t.paare.map((p) => p.parola))),
  };
  const alleSaetze: string[] = [
    ...cfg.raetsel.map((r) => r.satz),
    ...cfg.korrektur.map((f) => f.satz),
    ...STUFEN.flatMap((s) => cfg.wurzeln[s].flatMap((t) => t.paare.map((p) => p.indizio))),
    ...cfg.ketten.map((k) => k.thema),
    ...cfg.wurzelThemen.map((t) => t.titel),
  ];
  const alleTexte = [
    ...Object.values(alleWortListen).flat(),
    ...alleSaetze,
    ...cfg.raetsel.flatMap((r) => r.loesungen),
    ...cfg.korrektur.flatMap((f) => [f.falsch, f.richtig]),
  ];

  describe(`D-LERNDATEN „${cfg.weg}“ (${cfg.name})`, () => {
    // ── 1 · Sperrliste ──
    describe("1 · Sperrliste", () => {
      it("Gegenproben: Kern ist überall gesperrt, Wortbasis nur für Wortlisten, harmlose Verwandte bleiben frei", () => {
        for (const w of cfg.sperrProben.kern) {
          expect(cfg.istKernGesperrt(w), `${w} (Kern)`).toBe(true);
          expect(cfg.gesperrt(w), w).toBe(true);
        }
        for (const w of cfg.sperrProben.basis) {
          expect(cfg.gesperrt(w), `${w} (Wortbasis)`).toBe(true);
          expect(cfg.istKernGesperrt(w), `${w} ist Wortbasis, nicht Kern`).toBe(false);
        }
        for (const w of cfg.sperrProben.frei) expect(cfg.gesperrt(w), `${w} ist harmlos`).toBe(false);
        // gross und klein: dasselbe Wort
        const probe = cfg.sperrProben.kern[0];
        expect(cfg.gesperrt(probe.toLocaleUpperCase()), probe.toLocaleUpperCase()).toBe(true);
      });

      it("die Listen: klein, NFC, ohne Duplikate, ohne Leerzeichen", () => {
        for (const liste of cfg.sperrListen) {
          expect(doppelte(liste), "Duplikat").toEqual([]);
          for (const w of liste) {
            expect(w, w).toBe(w.toLocaleLowerCase());
            expect(w, w).toBe(w.normalize("NFC"));
            expect(/\s/.test(w), w).toBe(false);
          }
        }
      });

      it("★ kein Wort einer Wortliste ist gesperrt (Kern UND Wortbasis), kein Wort eines Satzes ist Kern-gesperrt", () => {
        const fehler: string[] = [];
        for (const [name, liste] of Object.entries(alleWortListen)) for (const w of liste) if (cfg.gesperrt(w)) fehler.push(`${name}: ${w}`);
        for (const r of cfg.raetsel) for (const l of r.loesungen) for (const w of woerterIm(l)) if (cfg.gesperrt(w)) fehler.push(`Lösung: ${w}`);
        for (const f of cfg.korrektur) for (const w of [f.falsch, f.richtig]) if (cfg.gesperrt(w)) fehler.push(`Korrektur: ${w}`);
        for (const t of alleSaetze) for (const w of woerterIm(t)) if (cfg.istKernGesperrt(w)) fehler.push(`Satz „${t}“: ${w}`);
        expect(fehler).toEqual([]);
        // die Prüfung ist nicht taub: ein Sperrwort mitten in einer Liste fiele auf
        expect([...cfg.woerter.slice(0, 3), cfg.sperrProben.kern[0]].filter((w) => cfg.gesperrt(w))).toEqual([cfg.sperrProben.kern[0]]);
      });
    });

    // ── 2 · Zeichen ──
    describe("2 · Zeichen: nur das Alphabet der Sprache, gerade Typografie", () => {
      it("jeder Text ist NFC und trägt kein fremdes Zeichen (fremde Schrift, verwechselte Buchstaben, Cedille)", () => {
        expect(alleTexte.filter((t) => t !== t.normalize("NFC"))).toEqual([]);
        expect(alleTexte.filter((t) => cfg.fremd.test(t))).toEqual([]);
        // Gegenprobe: das fremde Zeichen fiele auf
        expect(cfg.fremd.test(cfg.fremdProbe), cfg.fremdProbe).toBe(true);
      });

      it("gerade Typografie: keine „ “ ” « » ‚ ‘ ’, kein Gedankenstrich, kein …, kein geschütztes Leerzeichen (die Tastatur hat sie nicht)", () => {
        expect(alleTexte.filter((t) => TYPOGRAFIE.test(t))).toEqual([]);
        expect(TYPOGRAFIE.test("„ahoj“")).toBe(true);
        expect(TYPOGRAFIE.test(`a ${String.fromCharCode(0x2013)} b`)).toBe(true);
        expect(TYPOGRAFIE.test("a - b ...")).toBe(false);
      });

      it("jeder Satz besteht nur aus Buchstaben des Alphabets (beide Fälle), Ziffern und tippbaren Satzzeichen", () => {
        const fehler = alleSaetze.flatMap((t) => satzFehler(t).map((c) => `„${t}“: ${c} (U+${c.codePointAt(0)!.toString(16).toUpperCase()})`));
        expect(fehler).toEqual([]);
        const probe = cfg.woerter.find((w) => [...w].length >= 2)!;
        expect(satzFehler(probe + "§")).toEqual(["§"]);
      });
    });

    // ── 3 · Übungswörter und Themenwortschatz ──
    describe("3 · Übungswörter (WORDS) und Themenwortschatz (STUFE_VOCAB)", () => {
      it(`die gelieferte Menge: ${cfg.geliefert.woerter} Übungswörter, ohne Doppelte; Wortschatz ${cfg.geliefert.vocab.kids}/${cfg.geliefert.vocab.teens}/${cfg.geliefert.vocab.erwachsen}`, () => {
        expect(cfg.woerter.length).toBe(cfg.geliefert.woerter);
        expect(cfg.woerter.length).toBeGreaterThan(1000);
        expect(doppelte(cfg.woerter)).toEqual([]);
        for (const s of STUFEN) {
          expect(cfg.vocab[s].length, s).toBe(cfg.geliefert.vocab[s]);
          expect(cfg.vocab[s].length, s).toBeGreaterThan(40);
          expect(doppelte(cfg.vocab[s]), `${s}: doppelt`).toEqual([]);
        }
      });

      it("jedes Wort: klein, nur Buchstaben des Alphabets (Bindestrich/Apostroph nur im Wort); einbuchstabig nur die benannten", () => {
        const alle = [...cfg.woerter, ...Object.values(cfg.vocab).flat()];
        expect(alle.filter((w) => !istWort(w))).toEqual([]);
        // ★ SPRACHEN-9 (29.10.2026): als Menge verglichen - nach F4 steht die Liste nach Sprosse, nicht mehr in der Reihenfolge der Quelle.
        expect(alle.filter((w) => [...w].length < 2).sort()).toEqual([...cfg.bekannt.einBuchstabe].sort());
        expect(istWort("Gross")).toBe(false);
      });

      it("Wörter mit Grossbuchstaben in den Wortlisten (Übungswörter, Wortschatz, Salat, Geläufigkeit, Wortketten): genau die benannten", () => {
        const listen = [...cfg.woerter, ...Object.values(cfg.vocab).flat(), ...cfg.salat.map((s) => s.wort), ...cfg.verbindungen.flatMap((v) => v.woerter), ...cfg.ketten.flatMap((k) => k.woerter)];
        expect([...new Set(listen.filter((w) => w !== w.toLocaleLowerCase()))].sort()).toEqual([...cfg.bekannt.wortGross].sort());
      });

      it("Wörter in zwei Stufen des Wortschatzes: genau die benannten", () => {
        expect(doppelte(STUFEN.flatMap((s) => [...new Set(cfg.vocab[s])])).sort()).toEqual([...cfg.bekannt.vocabInZweiStufen].sort());
      });

      // ★ Die Lern-Folge: erst mit der eigenen Reihenfolge (F4, `lernweg.ts`) messbar. Bis dahin ist der Weg ein Alias von „en"
      // (`letterOrder` ist DASSELBE Feld wie bei „en") - eine Prüfung gegen die englische Folge bewiese nichts.
      const alias = lernwegDef(cfg.weg).letterOrder === lernwegDef("en").letterOrder;
      it.skipIf(alias)(
        "★ (nach F4) jedes Wort ist mit den bis zu seiner Stelle gelernten Einheiten tippbar - die Liste steht nach Sprosse sortiert" +
          (alias ? " - ÜBERSPRUNGEN: der Weg hat noch keine eigene Reihenfolge (F4), lernweg.ts führt ihn als Alias von „en“" : ""),
        () => {
          const o = introOrder(cfg.weg);
          const stufeVon = (w: string): number | null => {
            for (let n = 1; n <= o.length; n++) if (fitText(w, allowedFromIntroduced(o.slice(0, n), cfg.weg), cfg.weg, cfg.weg) === w) return n;
            return null;
          };
          const sprossen = cfg.woerter.map(stufeVon);
          expect(cfg.woerter.filter((_, i) => sprossen[i] === null), "nie tippbar").toEqual([]);
          const rueckschritte = cfg.woerter.filter((_, i) => i > 0 && (sprossen[i] ?? 0) < (sprossen[i - 1] ?? 0));
          expect(rueckschritte, "nicht nach Sprosse sortiert").toEqual([]);
        },
      );
    });

    // ── 4 · Lückentext ──
    describe("4 · Lückentext", () => {
      it(`${cfg.geliefert.raetsel} Rätsel, jedes mit genau einer Lücke „...“ und mindestens einer Lösung; kein Satz doppelt`, () => {
        expect(cfg.raetsel.length).toBe(cfg.geliefert.raetsel);
        for (const r of cfg.raetsel) {
          expect(r.satz.split("...").length - 1, r.satz).toBe(1);
          expect(r.loesungen.length, r.satz).toBeGreaterThan(0);
          expect(doppelte(r.loesungen), r.satz).toEqual([]);
          expect(r.stufen.length, r.satz).toBeGreaterThan(0);
        }
        expect(doppelte(cfg.raetsel.map((r) => r.satz))).toEqual([]);
      });

      it("jede Lösung: nur Buchstaben des Alphabets (beide Fälle), Ziffern, Bindestrich, Apostroph; mehrwortig nur die benannten", () => {
        const fehler: string[] = [];
        // Abkürzungen (MÁV, NIF, DigiD) und Formeln (H2O) sind Lösungen wie andere - geprüft wird, dass jedes Zeichen tippbar ist.
        for (const l of cfg.raetsel.flatMap((r) => r.loesungen))
          for (const w of l.split(" ")) if (!w || ![...w].every((c) => buchstabeBeide(c) || /[0-9'-]/.test(c))) fehler.push(l);
        expect(fehler).toEqual([]);
        expect([...new Set(cfg.raetsel.flatMap((r) => r.loesungen).filter((l) => l.includes(" ")))].sort()).toEqual([...cfg.bekannt.loesungMehrwortig].sort());
      });

      it("die Lösung steht nicht schon im Satz (sonst wäre es Abschreiben)", () => {
        const fehler = cfg.raetsel.filter((r) => r.loesungen.some((l) => woerterIm(r.satz).includes(l))).map((r) => r.satz);
        expect(fehler.sort(), "die Lösung steht schon im Satz").toEqual([...cfg.bekannt.loesungImSatz].sort());
      });
    });

    // ── 5 · Korrekturlesen ──
    describe("5 · Korrekturlesen", () => {
      it(`${cfg.geliefert.korrektur} Fälle; das falsche Wort steht im Satz, das richtige ist ein anderes Wort`, () => {
        expect(cfg.korrektur.length).toBe(cfg.geliefert.korrektur);
        expect(cfg.korrektur.length).toBeGreaterThanOrEqual(30);
        for (const f of cfg.korrektur) {
          expect(woerterIm(f.satz), f.satz).toContain(f.falsch);
          expect(f.richtig, f.satz).not.toBe(f.falsch);
          expect(istWort(f.falsch.toLocaleLowerCase()) && istWort(f.richtig.toLocaleLowerCase()), `${f.falsch}/${f.richtig}`).toBe(true);
        }
        expect(doppelte(cfg.korrektur.map((f) => f.satz))).toEqual([]);
      });

      it("das richtige Wort steht nicht schon im Satz - ausser in den benannten Fällen", () => {
        const fehler = cfg.korrektur.filter((f) => woerterIm(f.satz).includes(f.richtig)).map((f) => f.satz);
        expect(fehler.sort()).toEqual([...cfg.bekannt.korrekturRichtigImSatz].sort());
      });
    });

    // ── 6 · Buchstabensalat ──
    describe("6 · Buchstabensalat", () => {
      it(`${cfg.geliefert.salat} Quellwörter: ein Wort (Apostroph im Wort erlaubt, z. B. uk м'ясо), nicht doppelt`, () => {
        expect(cfg.salat.length).toBe(cfg.geliefert.salat);
        expect(cfg.salat.filter((s) => !istWort(s.wort.toLocaleLowerCase()) || /[-\s]/.test(s.wort)).map((s) => s.wort)).toEqual([]);
        expect(doppelte(cfg.salat.map((s) => s.wort))).toEqual([]);
      });

      it("lange Wörter (ab 8 Buchstaben) für Kinder: genau die benannten (cs/de/pl/it: erst ab den Jugendlichen)", () => {
        const lang = cfg.salat.filter((s) => [...s.wort].length >= 8 && s.stufen.includes("kids")).map((s) => s.wort);
        expect(lang.sort()).toEqual([...cfg.bekannt.salatLangFuerKinder].sort());
      });
    });

    // ── 7 · Geläufigkeit ──
    describe("7 · Geläufigkeit (Buchstabenverbindungen)", () => {
      it(`${cfg.geliefert.verbindungen} Verbindungen, je mindestens sechs Wörter; jedes Wort enthält seine Verbindung am richtigen Ort, ist klein, nicht doppelt`, () => {
        expect(cfg.verbindungen.length).toBe(cfg.geliefert.verbindungen);
        const form = cfg.ortsForm ?? ((s: string) => s);
        const fehler: string[] = [];
        for (const v of cfg.verbindungen) {
          expect(v.woerter.length, v.folge).toBeGreaterThanOrEqual(6);
          expect(doppelte(v.woerter), v.folge).toEqual([]);
          const f = form(v.folge);
          for (const w of v.woerter) {
            if (!istWort(w.toLocaleLowerCase())) fehler.push(`${v.folge}: ${w} (Zeichen)`);
            const x = form(w);
            const ort = v.stelle === "anfang" ? x.startsWith(f) : v.stelle === "ende" ? x.endsWith(f) : x.includes(f);
            if (!ort) fehler.push(`${v.folge}/${v.stelle}: ${w}`);
          }
        }
        expect(fehler).toEqual([]);
      });
    });

    // ── 8 · Wortketten ──
    describe("8 · Wortketten (Hand-Schwerpunkte)", () => {
      it(`${cfg.geliefert.ketten} Themen, jedes mit mindestens zwölf Wörtern, klein, ohne Doppelte; kein Thema doppelt`, () => {
        expect(cfg.ketten.length).toBe(cfg.geliefert.ketten);
        for (const k of cfg.ketten) {
          expect(k.woerter.length, k.thema).toBeGreaterThanOrEqual(12);
          expect(doppelte(k.woerter), k.thema).toEqual([]);
          expect(k.woerter.filter((w) => !istWort(w.toLocaleLowerCase())), k.thema).toEqual([]);
        }
        expect(doppelte(cfg.ketten.map((k) => k.thema))).toEqual([]);
      });
    });

    // ── 9 · Wurzel-Vorlage ──
    describe("9 · Wurzel-Vorlage (Wortherkunft)", () => {
      it("fünf Themen mit deutschem und englischem Namen; jede Stufe trägt genau diese Themen in dieser Reihenfolge", () => {
        expect(cfg.wurzelThemen.length).toBe(5);
        for (const t of cfg.wurzelThemen) {
          expect(t.titelJe?.de, t.id).toBeTruthy();
          expect(t.titelJe?.en, t.id).toBeTruthy();
        }
        for (const s of STUFEN) expect(cfg.wurzeln[s].map((t) => t.id), s).toEqual(cfg.wurzelThemen.map((t) => t.id));
        expect(cfg.challengeTitel.de).toMatch(/\{i\}.*\{n\}/);
        expect(cfg.challengeTitel.en).toMatch(/\{i\}.*\{n\}/);
      });

      for (const s of STUFEN) {
        it(`${s}: mindestens ${cfg.geliefert.wurzelnMindestens[s]} Paare (Ziel 80), jedes mit Herkunft und Beleg`, () => {
          const paare = cfg.wurzeln[s].flatMap((t) => t.paare);
          expect(paare.length).toBeGreaterThanOrEqual(cfg.geliefert.wurzelnMindestens[s]);
          for (const p of paare) {
            expect(p.origine, p.parola).toBeTruthy();
            expect(p.beleg, p.parola).toMatch(/^https?:\/\//);
          }
          // die Tippchallenge-Fassung ist dieselbe Menge, alphabetisch
          expect(cfg.wurzelnAlphabetisch[s].length).toBe(paare.length);
          expect([...cfg.wurzelnAlphabetisch[s]].sort()).toEqual(paare.map(cfg.wurzelZeile).sort());
        });
      }

      it("jede Zeile: genau ein ` - `, das Wort ein Einzelwort des Alphabets; kein Wort doppelt (über alle Stufen)", () => {
        const paare = STUFEN.flatMap((s) => cfg.wurzeln[s].flatMap((t) => t.paare));
        for (const p of paare) {
          expect(cfg.wurzelZeile(p).split(" - ").length - 1, cfg.wurzelZeile(p)).toBe(1);
          expect(istWort(p.parola.toLocaleLowerCase()), p.parola).toBe(true);
        }
        expect(doppelte(paare.map((p) => p.parola))).toEqual([]);
      });

      it("die benannten Abweichungen: Zeilen über 40 Zeichen, Wörter mit Grossbuchstaben, Wörter im eigenen Hinweis - genau diese", () => {
        const paare = STUFEN.flatMap((s) => cfg.wurzeln[s].flatMap((t) => t.paare));
        expect(paare.map(cfg.wurzelZeile).filter((z) => [...z].length > 40).sort()).toEqual([...cfg.bekannt.wurzelZeileUeber40].sort());
        expect(paare.filter((p) => p.parola !== p.parola.toLocaleLowerCase()).map((p) => p.parola).sort()).toEqual([...cfg.bekannt.wurzelWortGross].sort());
        expect(paare.filter((p) => p.indizio.toLocaleLowerCase().includes(p.parola.toLocaleLowerCase())).map((p) => p.parola).sort()).toEqual([...cfg.bekannt.wurzelWortImHinweis].sort());
      });
    });

    // ── 10 · Auf dem Weg des Kindes ──
    describe("10 · ★ Auf dem Weg des Kindes (Falle 43): Schalter AN ⇒ die eigenen Daten in jeder Form, Schalter AUS ⇒ nirgends", () => {
      const basis = { gespeichert: null, bedienSprache: cfg.weg, lehrgangProbeAn: false } as const;
      const wegAn = bestimmeLernweg({ ...basis, geruestLehrgangAn: { [cfg.weg]: true } });
      const wegAus = bestimmeLernweg({ ...basis });
      const eigeneSaetze = new Set(cfg.raetsel.map((r) => r.satz));
      const eigeneFaelle = new Set(cfg.korrektur.map((f) => f.satz));
      const eigeneSalat = new Set(cfg.salat.map((s) => s.wort));
      const eigeneVerbindung = new Set(cfg.verbindungen.flatMap((v) => v.woerter));

      it(`Schalter AN ⇒ Weg „${cfg.weg}“; AUS ⇒ Weg „de“ (die Bedienung ohne Lehrgang)`, () => {
        expect(wegAn).toBe(cfg.weg);
        expect(wegAus).toBe("de");
      });

      it("heute (noch ohne Hauptsprache, F4) übt ein Kind auf dem Weg Englisch - nie Deutsch; sobald die Hauptsprache gesetzt ist, die eigene", () => {
        const lang = uebungsSpracheImWeg(undefined, wegAn);
        expect([cfg.weg, "en"]).toContain(lang);
      });

      /** Die Formen mit dem Weg „AN" und der Übungssprache der Sprache (so, wie die Hauptsprache sie setzen wird). */
      it("mit Übungssprache der Sprache: wortquelle, Lückentext, Korrekturlesen, Buchstabensalat-Auswahl und Geläufigkeit liefern NUR eigene Daten", () => {
        expect(wortquelle(cfg.weg)).toBe(cfg.woerter);
        for (const stufe of STUFEN) {
          const c = ctx(cfg, wegAn, cfg.weg, stufe, 7);
          const kand = lueckentextKandidaten(c);
          expect(kand.length, `${stufe}: Lückentext`).toBeGreaterThan(0);
          expect(kand.filter((k) => !eigeneSaetze.has(k.raetsel.satz)), stufe).toEqual([]);
          const faelle = faelleFuer(c);
          expect(faelle.length, `${stufe}: Korrekturlesen`).toBeGreaterThan(0);
          expect(faelle.filter((f) => !eigeneFaelle.has(f.satz)), stufe).toEqual([]);
          const salat = waehleSalatwort(c);
          expect(salat, `${stufe}: Buchstabensalat-Quellwort`).not.toBeNull();
          expect(eigeneSalat.has(salat!), `${stufe}: ${salat}`).toBe(true);
        }
        const allowed = new Set(vollerStand(cfg));
        let gesehen = 0;
        for (let samen = 1; samen <= 20; samen++) {
          let s = samen;
          const z = gelaeufigkeitsZeile(allowed, {
            stufe: "teens",
            lang: cfg.weg,
            lernweg: wegAn,
            zufall: () => {
              s = (s * 1103515245 + 12345) % 2147483648;
              return s / 2147483648;
            },
          });
          if (!z) continue;
          gesehen++;
          for (const w of z.text.toLocaleLowerCase().split(" ")) expect(eigeneVerbindung.has(w), `${z.text}: ${w}`).toBe(true);
        }
        expect(gesehen, "Geläufigkeit").toBeGreaterThan(10);
      });

      it("Pyramide und Wortketten (Hand-Schwerpunkte): was sie zeigen, stammt aus dem eigenen Wortschatz", () => {
        const eigen = new Set([...Object.values(cfg.vocab).flat(), ...cfg.ketten.flatMap((k) => k.woerter), ...cfg.woerter]);
        for (const id of ["pyramide", "handschwerpunkte"]) {
          const form = UEBUNGSFORMEN.find((f) => f.id === id)!;
          let mitInhalt = 0;
          for (const samen of [1, 7, 42]) {
            const c = ctx(cfg, wegAn, cfg.weg, "teens", samen);
            if (!form.taugt(c)) continue;
            const zeilen = form.baue?.(c)?.zeilen ?? [];
            if (zeilen.length) mitInhalt++;
            for (const z of zeilen) {
              for (const w of z.text.toLocaleLowerCase().split(/[\s.,;:!?"]+/).filter(Boolean)) {
                // die Pyramide zeigt die ANFÄNGE eines Wortes: jedes Stück ist Anfang eines eigenen Wortes
                const ok = id === "pyramide" ? [...eigen].some((e) => e.startsWith(w)) : eigen.has(w);
                expect(ok, `${id}: „${z.text}“ - ${w}`).toBe(true);
              }
            }
          }
          if (id === "pyramide") expect(mitInhalt, "die Pyramide liefert Inhalt").toBeGreaterThan(0);
        }
      });

      it("Wurzel-Vorlage: fünf Übungs-Dateien und drei Tippchallenge-Dateien für die Sprache; Vorschau nur auf Weg UND Übungssprache der Sprache", () => {
        const uebung = vorlagenFuer({ fuer: "uebung", lang: cfg.weg }).filter((v) => v.art === "wortherkunft");
        expect(uebung.map((v) => v.id)).toEqual(cfg.wurzelThemen.map((t) => `herkunft-${cfg.weg}-${t.id}`));
        const challenge = vorlagenFuer({ fuer: "challenge", lang: cfg.weg }).filter((v) => v.art === "wortherkunft");
        expect(challenge.length).toBe(3);
        for (const stufe of STUFEN) {
          const id = uebung[0].id;
          const v = vorlageVorschau(id, { stufe, lang: cfg.weg, lernweg: wegAn, verbietenSs: false });
          expect(v, `${stufe}: Vorschau`).not.toBeNull();
          const erstes = cfg.wurzeln[stufe][0].paare[0];
          expect(v!.zeilen.join("\n"), stufe).toContain(erstes.parola);
          // Schalter AUS (Weg „de") oder eine andere Übungssprache: keine Vorlage
          expect(vorlageVorschau(id, { stufe, lang: cfg.weg, lernweg: wegAus, verbietenSs: false }), `${stufe}: Weg de`).toBeNull();
          expect(vorlageVorschau(id, { stufe, lang: "en", lernweg: wegAn, verbietenSs: false }), `${stufe}: Übungssprache en`).toBeNull();
        }
        // eine andere Sprache sieht die Vorlage nicht
        expect(vorlagenFuer({ fuer: "uebung", lang: "de" }).some((v) => v.id.startsWith(`herkunft-${cfg.weg}-`))).toBe(false);
      });

      // ★ Das Gegenstück zu `tastenflow-g2b2-neue-sprache-nie-deutsch` (dort fällt der Weg mit eigenem Wortschatz aus der zweiten
      // Schleife, wie it/pl/tr/cs): JEDE Form auf dem Weg zeigt kein Wort, das nur Deutsch ist - ausser es ist ein eigenes Wort der
      // Sprache (nl `ei`, `haar`; sv `innen`) oder der englische Rückfall derselben Form.
      it("jede Übungsform auf dem Weg: kein nur-deutsches Wort, das nicht auch eigenes Wort der Sprache oder englischer Rückfall ist", () => {
        // ★ K-KORPUS-NEUN (29.10.2026): auch die Sätze des EIGENEN Korpus (nur Zeilen mit `nurWeg` = Weg) sind eigene Wörter - seit
        // der Korpus gefüllt ist, ziehen „Was fehlt?" und „Langer Ersatz" Namen daraus (nl: Yusuf, Ella, Milan), die zufällig auch
        // in der deutschen Liste stehen. Der englische Rückfall-Korpus zählt hier NICHT (`nurWeg` fehlt dort).
        const eigenerKorpus = korpusFuer(cfg.weg).filter((z) => z.nurWeg === cfg.weg).map((z) => z.text);
        const eigen = new Set([...alleTexte, ...eigenerKorpus].flatMap((t) => woerterIm(t.toLocaleLowerCase())));
        const eigenListe = [...eigen];
        const fehler: string[] = [];
        for (const form of UEBUNGSFORMEN) {
          if (form.id === "alphabetreihen") continue;
          for (const samen of [1, 7, 42]) {
            const neu = inhaltVon(form, ctx(cfg, wegAn, cfg.weg, "teens", samen));
            const en = inhaltVon(form, ctx(cfg, "en", "en", "teens", samen));
            // Pyramide (Anfänge) und Zwillingsgriffe (Stücke) zeigen TEILE eigener Wörter: `mo`, `ton`, `tat` sind dann kein deutscher Inhalt.
            const teilEigen = (w: string) => eigenListe.some((e) => e.includes(w));
            for (const w of neu) if (NUR_DEUTSCH().has(w) && !eigen.has(w) && !en.has(w) && !teilEigen(w)) fehler.push(`${form.id} (Samen ${samen}): ${w}`);
          }
        }
        expect(fehler).toEqual([]);
        // Gegenprobe: eine Form, die die Sprache überhört und Deutsch liefert, fiele auf
        const sp = UEBUNGSFORMEN.find((f) => f.id === "spiegelwoerter")!;
        const taub = inhaltVon(sp, { ...ctx(cfg, "de", "de", "teens", 7), introduced: [...introOrder("de")] });
        expect([...taub].filter((w) => NUR_DEUTSCH().has(w) && !eigen.has(w) && !eigenListe.some((e) => e.includes(w))).length).toBeGreaterThan(0);
      });

      it("Schalter AUS: auf dem Weg, den das Kind dann hat („de“, Übungssprache Deutsch), kommt kein einziger eigener Satz, Fall oder Quellwort an", () => {
        const lang = uebungsSpracheImWeg(undefined, wegAus);
        expect(lang).toBe("de");
        for (const stufe of STUFEN) {
          const c = { ...ctx(cfg, wegAus, lang, stufe, 7), introduced: [...introOrder("de"), ...vollerStand(cfg)] };
          expect(lueckentextKandidaten(c).filter((k) => eigeneSaetze.has(k.raetsel.satz))).toEqual([]);
          expect(faelleFuer(c).filter((f) => eigeneFaelle.has(f.satz))).toEqual([]);
          const salat = waehleSalatwort(c);
          expect(salat === null || !eigeneSalat.has(salat), `${stufe}: ${salat}`).toBe(true);
        }
        expect(wortquelle("de")).not.toBe(cfg.woerter);
        expect(wortquelle("en")).not.toBe(cfg.woerter);
      });
    });
  });
}
