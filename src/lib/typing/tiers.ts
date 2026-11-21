/**
 * Buchstaben-STUFEN (Tiers) des Tipptrainers „Tastenflow" — das Herzstück des
 * Textwelt-Umbaus („früh sinnvoll", siehe
 * `Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md`, §3.1 und
 * [[project_tastenflow_textwelt_neuaufbau]]).
 *
 * Ein Tier sagt: „ab welchem Lernstand ist dieser Text tippbar". Jeder Inhalt
 * (Baustein oder Serien-Etappe) bekommt einen `minTier`; die App serviert ihn,
 * sobald das Tier freigeschaltet ist. Für NEUE Inhalte (Erstleser-Sätze,
 * Geschichten) wird gezielt auf niedrigen Tiers getextet.
 *
 * WICHTIG (Konsistenz): Die Zeichensätze der Tiers sind AUS der bestehenden
 * Einführungsreihenfolge abgeleitet (`LETTER_ORDER`/`PUNCT_ORDER`/`DIGIT_ORDER`/
 * `SYMBOL_ORDER` aus letters.ts) — es gibt keine zweite, konkurrierende Liste.
 * `minTierFor` ist zudem OPERATIONAL über `fitsKeys` (corpus.ts) definiert, also
 * genau die Funktion, mit der die App Texte an den Tastenstand anpasst. So kann
 * die Tier-Einstufung nie von der tatsächlichen Servierbarkeit abweichen.
 *
 * TW-E1: reines Fundament (Typen + Berechnung + Tests), keine Verdrahtung in den
 * Generator — das ist TW-E2. Keine sichtbare Änderung.
 */
import { fitsKeys } from "./corpus";
import { lernwegDef, type Lernweg } from "./lernweg";
import { kleinFuer } from "./sprachRegister";

/** Lernstand-Stufe: T0 (nur Grundreihe) … T5 (alle Zeichen). */
export type Tier = 0 | 1 | 2 | 3 | 4 | 5;

/** Höchste Stufe. */
export const MAX_TIER: Tier = 5;

/** Alle Stufen als Liste (für Iteration/Tests). */
export const TIERS: readonly Tier[] = [0, 1, 2, 3, 4, 5];

/**
 * Grenzen der Buchstaben-Tiers innerhalb von `LETTER_ORDER` (kumulative Endindizes):
 *  T0 = [0, 8)  Grundreihe (f j d k s l a ö)
 *  T1 = [8, 13) + e n i r t   (= vor der Umschalttaste)
 *  T2 = [13, 21) + h o u c g m b w
 *  T3 = [21, 30) + z v p ä ü x y q ß  (= ganzes Alphabet)
 * 8 und 13 sind die vorhandenen Konstanten (HOME_ROW_LETTERS, LETTERS_BEFORE_SHIFT);
 * 21 ist die zusätzliche Erstleser-Grenze, 30 = LETTER_ORDER.length.
 *
 * ★ E1 (24.09.2026): Die Schnitte stehen seither je Lernweg in der Tabelle
 * (`LernwegDef.tierCuts`, lernweg.ts) - die obige Aufstellung ist die des
 * Weges „de". Weg „en" bekommt in E2 eigene Schnitte (Bauplan §3.5).
 *
 * Die Zeichen, die JEDES Tier NEU dazubringt (kumulativ ergibt sich der erlaubte
 * Satz). Kleinbuchstaben; Großschreibung gilt dank Auto-Großschreibung stets als
 * tippbar und taucht daher NICHT als eigenes Tier auf (die Umschalt-Einheit `⇧`
 * aus INTRO_ORDER ist bewusst kein Tier-Zeichen).
 *
 *  T0 f j d k s l a ö          — nur Fingertraining (kaum echte Wörter)
 *  T1 + e n i r t              — erste echte Sätze (begrenzter Wortschatz)
 *  T2 + h o u c g m b w        — reicher Erstleser-Wortschatz → erste Geschichten
 *  T3 + z v p ä ü x y q ß      — voller Wortschatz
 *  T4 + . , - ? ! : ;          — Satzzeichen, Dialoge
 *  T5 + Ziffern + Sonderzeichen — Zahlen/Alltagskontexte
 */
export function tierChars(lernweg: Lernweg): readonly (readonly string[])[] {
  return tabelleFuer(lernweg).chars;
}

// (Bis 11.09.2026 stand hier `TIER_LABELS`, entfernt weil ungenutzt.)

/** Alles, was je Weg einmal ausgerechnet wird. */
interface TierTabelle {
  chars: readonly (readonly string[])[];
  /** Zeichen → sein Tier (kleingeschrieben nachgeschlagen). */
  charTier: Map<string, Tier>;
  /** Vorberechnete erlaubte Sätze je Tier (spart Wiederaufbau in `minTierFor`). */
  allowedByTier: readonly Set<string>[];
}

const TABELLEN = new Map<Lernweg, TierTabelle>();

function tabelleFuer(lernweg: Lernweg): TierTabelle {
  const fertig = TABELLEN.get(lernweg);
  if (fertig) return fertig;
  const weg = lernwegDef(lernweg);
  const cuts = weg.tierCuts;
  const letters = weg.letterOrder;
  const chars: readonly (readonly string[])[] = [
    letters.slice(0, cuts[0]),
    letters.slice(cuts[0], cuts[1]),
    letters.slice(cuts[1], cuts[2]),
    letters.slice(cuts[2], cuts[3]),
    [...weg.punctOrder],
    [...weg.digitOrder, ...weg.symbolOrder],
  ];
  const charTier = new Map<string, Tier>();
  for (let t = 0 as Tier; t <= MAX_TIER; t = (t + 1) as Tier) {
    for (const ch of chars[t]) {
      const key = kleinFuer(ch, lernweg); // G2b-1: türkisch i/ı/İ/I
      if (!charTier.has(key)) charTier.set(key, t);
    }
  }
  const allowedByTier = TIERS.map((t) => {
    const out = new Set<string>();
    for (let k = 0 as Tier; k <= t; k = (k + 1) as Tier) {
      for (const ch of chars[k]) out.add(ch);
    }
    return out;
  });
  const tab: TierTabelle = { chars, charTier, allowedByTier };
  TABELLEN.set(lernweg, tab);
  return tab;
}

/**
 * Die Stufen-Zeichen des Weges „de" - als Konstante erhalten, weil Wächter und
 * Messskripte sie so lesen. Wer einen Weg meint, nimmt {@link tierChars}.
 */
// ⚠️ Erst HIER, nach `TABELLEN` - sonst liefe die Berechnung in dessen
// zeitliche Sperre (TDZ) beim Laden des Moduls.
export const TIER_CHARS: readonly (readonly string[])[] = tierChars("de");

/**
 * Der erlaubte Zeichensatz bis einschließlich Tier `t` — genau in dem Format,
 * das `fitText`/`fitsKeys` (corpus.ts) erwarten (Kleinbuchstaben, Ziffern,
 * gelernte Satz-/Sonderzeichen; Großschreibung ist dort ohnehin immer erlaubt).
 * Eine frische Menge - der Aufrufer darf sie verändern.
 */
export function allowedForTier(t: Tier, lernweg: Lernweg): Set<string> {
  return new Set(tabelleFuer(lernweg).allowedByTier[t]);
}

/**
 * Das Tier eines EINZELNEN (verpflichtenden) Zeichens: Buchstabe/Ziffer/Zeichen
 * → seine Stufe; `null` für Leerzeichen oder Zeichen, die `fitText` bei Bedarf
 * einfach weglässt (Satzzeichen zählen über T4, wenn sie stehen bleiben; für die
 * Tier-Einstufung eines ganzen Textes ist `minTierFor` maßgeblich).
 */
export function tierOfChar(ch: string, lernweg: Lernweg): Tier | null {
  if (ch === " ") return null;
  return tabelleFuer(lernweg).charTier.get(kleinFuer(ch, lernweg)) ?? null;
}

/**
 * Der `minTier` eines Textes: die NIEDRIGSTE Stufe, auf der er tippbar ist —
 * operational über `fitsKeys`, also inklusive „ohne Punkt und Beistrich"
 * (noch nicht gelernte Satzzeichen werden weggelassen). So ist die Einstufung
 * deckungsgleich mit dem, was die App tatsächlich serviert.
 *
 * `null` = enthält ein nie freischaltbares Zeichen (sollte bei geprüftem Inhalt
 * nicht vorkommen; die Pipeline verwirft solche Zeilen — §4-Gate „Zeichensatz").
 *
 * ★ E1 (24.09.2026): die Stufen des angegebenen Weges. Alle heutigen Inhalte
 * sind gegen die Stufen des Weges „de" eingestuft.
 */
export function minTierFor(text: string, lernweg: Lernweg): Tier | null {
  const erlaubt = tabelleFuer(lernweg).allowedByTier;
  for (const t of TIERS) {
    // ★ E8b Block 1b: `lernweg` mitgeben, sonst würde ein Bindestrich in einem
    // Text des Weges „fr" hier weich (Leerzeichen) statt hart geprüft - die
    // Einstufung wäre dann NIEDRIGER, als `fitText` beim Servieren wirklich
    // verlangt (siehe corpus.ts Kopf-Doku von `fitText`).
    if (fitsKeys(text, erlaubt[t], lernweg)) return t;
  }
  return null;
}

/**
 * Ist ein Inhalt mit `minTier` beim gegebenen freigeschalteten Tier tippbar?
 * (Kleine Bequemlichkeit für Generator/Bücherei in TW-E2/TW-E3.)
 */
export function tierUnlocked(minTier: Tier, unlockedTier: Tier): boolean {
  return minTier <= unlockedTier;
}

// (Bis 11.09.2026 stand hier `unlockedTierFor`, entfernt weil ungenutzt.)
