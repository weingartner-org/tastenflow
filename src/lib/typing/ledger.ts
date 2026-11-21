/**
 * No-Repeat-Ledger des Textwelt-Umbaus („die eiserne Regel technisch", §3.3 in
 * `Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md`,
 * [[project_tastenflow_textwelt_neuaufbau]]).
 *
 * Kernidee: Ein append-only *Content-Manifest* vergibt jedem Baustein einen
 * stabilen Index. Pro Kind wird ein kompaktes *Bitset* der schon getippten
 * Indizes gehalten (in `TypingProgress.seenBausteine`, base64-kodiert, additiv/
 * server-synchron). Die Auswahl serviert nur Ungesehenes; ist ein (Tier×Sorte)-
 * Eimer erschöpft, wird dieser Eimer zurückgesetzt (bei genug Masse extrem
 * selten). 10.000 Bausteine ⇒ ~1,25 KB pro Kind.
 *
 * Geschichten laufen NICHT über das Bitset, sondern strikt linear über
 * `storyProgress[slug] = { etappe, done }` — jede Etappe genau einmal.
 *
 * TW-E1: reine, getestete Primitive. Die Verdrahtung in Generator/Session
 * (Verbuchen beim Tippen, Auswahl aus dem Pool) ist TW-E2/TW-E3. Keine sichtbare
 * Änderung.
 */
import type { Lang } from "./account";
import { kleinFuer, sprachBeschreibung } from "./sprachRegister";

// ── Bitset (die „gesehen"-Menge) ─────────────────────────────────────────────
// Repräsentation im Speicher: Uint8Array, ein Bit je Baustein-Index (LSB zuerst).
// Persistiert als base64-String (kompakt, JSON-tauglich, deterministisch).

/** Leeres „gesehen"-Bitset. */
export function emptySeen(): Uint8Array {
  return new Uint8Array(0);
}

/** Ist der Baustein mit diesem Index als „gesehen" markiert? */
export function seenHas(bytes: Uint8Array, index: number): boolean {
  if (index < 0) return false;
  const byte = index >> 3;
  if (byte >= bytes.length) return false;
  return (bytes[byte] & (1 << (index & 7))) !== 0;
}

/**
 * Markiert einen Index als „gesehen". Gibt das (ggf. vergrößerte) Bitset zurück —
 * wächst nur so weit wie nötig. Reines Ergebnis: das Eingabe-Array wird nur
 * mutiert, wenn es schon groß genug ist; sonst wird eine Kopie angelegt.
 */
export function seenAdd(bytes: Uint8Array, index: number): Uint8Array {
  if (index < 0) return bytes;
  const byte = index >> 3;
  let out = bytes;
  if (byte >= bytes.length) {
    out = new Uint8Array(byte + 1);
    out.set(bytes);
  }
  out[byte] |= 1 << (index & 7);
  return out;
}

/** Anzahl gesetzter Bits (wie viele Bausteine schon getippt wurden). */
export function seenCount(bytes: Uint8Array): number {
  let n = 0;
  for (let i = 0; i < bytes.length; i++) {
    let b = bytes[i];
    while (b) {
      b &= b - 1;
      n++;
    }
  }
  return n;
}

// base64 — dependency- und umgebungsfrei (kein btoa/Buffer nötig), damit die
// Kodierung im Browser wie im Test identisch und deterministisch ist.
const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const B64_INV: Record<string, number> = {};
for (let i = 0; i < B64.length; i++) B64_INV[B64[i]] = i;

/** Bitset → kompakter base64-String (für `seenBausteine`). Leer ⇒ "". */
export function encodeSeen(bytes: Uint8Array): string {
  // Führende Null-Bytes am Ende weglassen (kompakter, kanonisch).
  let len = bytes.length;
  while (len > 0 && bytes[len - 1] === 0) len--;
  let out = "";
  for (let i = 0; i < len; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < len ? bytes[i + 1] : 0;
    const b2 = i + 2 < len ? bytes[i + 2] : 0;
    out += B64[b0 >> 2];
    out += B64[((b0 & 3) << 4) | (b1 >> 4)];
    out += i + 1 < len ? B64[((b1 & 15) << 2) | (b2 >> 6)] : "=";
    out += i + 2 < len ? B64[b2 & 63] : "=";
  }
  return out;
}

/** base64-String → Bitset. Leer/undefiniert ⇒ leeres Bitset. */
export function decodeSeen(str: string | undefined | null): Uint8Array {
  if (!str) return emptySeen();
  const clean = str.replace(/=+$/, "");
  const outLen = Math.floor((clean.length * 6) / 8);
  const out = new Uint8Array(outLen);
  let acc = 0;
  let bits = 0;
  let o = 0;
  for (const ch of clean) {
    const v = B64_INV[ch];
    if (v === undefined) continue; // Fremdzeichen robust überspringen
    acc = (acc << 6) | v;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out[o++] = (acc >> bits) & 0xff;
    }
  }
  return out;
}

// ── Content-Manifest (stabile Baustein-Indizes) ──────────────────────────────

/** Ein Baustein-Steckbrief, so weit das Manifest ihn braucht. */
export interface ManifestEntry {
  kind: string;
  text: string;
  /**
   * ★ G3a-SCHRIFT (25.10.2026): der Weg der Zeile (`CorpusItem.nurWeg`) - er bestimmt die SPRACHE des Schlüssels
   * ({@link bausteinKey}). Jede Zeile einer neuen Sprache trägt ihn (Kopf von `corpus.ts`); fehlt er, gilt die alte
   * Klasse (alle Zeilen vor dem 25.10.2026, ihre IDs bleiben).
   */
  nurWeg?: Lang;
}

export interface Manifest {
  /** Deterministische Version — ändert sich, sobald sich Inhalt/Reihenfolge ändert. */
  version: number;
  /** Stabile IDs in append-only Reihenfolge; Position = Baustein-Index. */
  ids: string[];
  /** Schneller Rückweg ID → Index. */
  indexOf: Map<string, number>;
}

/**
 * Stabile Identität eines Bausteins: Sorte + auf Buchstaben/Ziffern reduzierter
 * Text (dieselbe Normalisierung wie `dedupKey` in corpus.ts). Unabhängig von
 * Groß-/Kleinschreibung und Satzzeichen — so ist die ID robust gegen kosmetische
 * Änderungen und deckt sich mit der Entdopplung.
 */
export function bausteinKey(kind: string, text: string, sprache?: Lang): string {
  // ★ G3a-SCHRIFT (25.10.2026): eine Sprache mit `schluesselAlleBuchstaben` (die neun des Gerüsts) behält jeden
  // Buchstaben - sonst würde ein kyrillischer oder griechischer Satz LEER, und alle Zeilen hätten dieselbe ID
  // (`schluesselAlleBuchstaben` im Sprachregister). Ohne Sprache, und für die acht Sprachen vor dem 25.10.2026,
  // Zeichen für Zeichen die alte Rechnung (Anker, Ledger jedes Kindes, Golden-Tests).
  if (sprache !== undefined && sprachBeschreibung(sprache).schluesselAlleBuchstaben) {
    return kind + "|" + schluesselText(text, sprache);
  }
  return (
    kind +
    "|" +
    text
      .toLowerCase()
      .replace(/[^a-zäöüß0-9]+/g, " ")
      .trim()
  );
}

/**
 * ★ G3a-SCHRIFT (25.10.2026): der Text als Schlüssel für eine Sprache mit `schluesselAlleBuchstaben`. Wie die alte
 * Klasse unabhängig von Gross-/Kleinschreibung und Satzzeichen (eine kosmetische Korrektur behält die ID), aber mit
 * JEDEM Buchstaben:
 *  · NFC zuerst - „й" als ein Zeichen und als и + U+0306 ist derselbe Text;
 *  · klein in der Sprache des Textes (`kleinFuer`);
 *  · die Apostrophe ' ’ ʼ fallen ganz weg (ukrainisch „сімʼя" = „сім'я", niederländisch „auto's" = „auto’s") -
 *    eine Korrektur des Apostrophs ist kosmetisch und darf die ID nicht ändern;
 *  · das griechische Schluss-Sigma `ς` zählt wie `σ` (die Korrektur „οδοσ" ⇒ „οδος" behält die ID);
 *  · alles andere ausser Buchstaben (`\p{L}`), Zeichen daran (`\p{M}`) und Ziffern (`\p{N}`) wird zum Trenner.
 */
function schluesselText(text: string, sprache: Lang): string {
  return kleinFuer(text.normalize("NFC"), sprache)
    .replace(/['’ʼ]/gu, "")
    .replace(/ς/gu, "σ")
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, " ")
    .trim();
}

/** Kurzer, stabiler Hash-String (FNV-1a, 32-bit) über einen beliebigen String. */
export function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    // 32-bit FNV-Prime-Multiplikation ohne Überlauf-Verlust
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Kompakte, stabile Baustein-ID (base36 des Schlüssel-Hashes). */
export function bausteinId(kind: string, text: string, sprache?: Lang): string {
  // ★ G3a-SCHRIFT: `sprache` = der Weg der Zeile (`nurWeg`), siehe {@link bausteinKey}.
  return fnv1a(bausteinKey(kind, text, sprache)).toString(36);
}

/**
 * Baut das append-only Manifest aus den (bereits in stabiler Reihenfolge
 * vorliegenden) Bausteinen. Doppelte (gleicher `bausteinKey`) werden übersprungen
 * — der erste gewinnt und behält seinen Index. „Append-only" heißt: Wer die
 * Eingabe nur HINTEN erweitert, lässt alle bestehenden Indizes unangetastet.
 *
 * Die `version` ist ein deterministischer Hash über alle IDs — sie ändert sich,
 * sobald ein Baustein dazukommt/wegfällt/umsortiert wird, und erlaubt so ein
 * sauberes Ledger-Handling (`manifestVersion` in TypingProgress).
 *
 * ANKER (L1, 21.08.2026 — siehe corpusAnker.ts): Ist `anchor` gesetzt, gibt
 * NICHT mehr die Reihenfolge der `items` die Indizes vor, sondern diese
 * eingefrorene ID-Liste. Sie bildet den Kopf des Manifests (Position = Index,
 * eins zu eins), und nur was dort NICHT vorkommt, wird — in `items`-Reihenfolge —
 * hinten angehängt. Damit ist es gleichgültig, an welcher Stelle des Quelltexts
 * eine neue Zeile eingepflegt wird: bestehende Indizes können sich nicht mehr
 * verschieben, und selbst eine entfernte Zeile hinterlässt nur eine (nie
 * servierte) Lücke, statt alles Nachfolgende zu verschieben.
 *
 * Ohne `anchor` bleibt das alte Verhalten unverändert — die Primitive selbst ist
 * weiter für sich testbar.
 */
export function buildManifest(
  items: readonly ManifestEntry[],
  anchor?: readonly string[],
): Manifest {
  const ids: string[] = [];
  const indexOf = new Map<string, number>();
  const seenKey = new Set<string>();
  if (anchor) {
    for (const id of anchor) {
      if (indexOf.has(id)) continue; // Doppel im Anker: der erste Platz gilt
      indexOf.set(id, ids.length);
      ids.push(id);
    }
  }
  for (const it of items) {
    const key = bausteinKey(it.kind, it.text, it.nurWeg);
    if (seenKey.has(key)) continue;
    seenKey.add(key);
    const id = fnv1a(key).toString(36);
    // Steht die ID schon im Anker, behält sie ihren dort eingefrorenen Platz.
    if (indexOf.has(id)) continue;
    indexOf.set(id, ids.length);
    ids.push(id);
  }
  const m: Manifest = { version: 0, ids, indexOf };
  // Version = Präfix-Hash über ALLE IDs — dieselbe Rechnung wie
  // `manifestPrefixVersion`, damit die Präfix-Validierung des Ledgers exakt
  // gegen gespeicherte Versionen älterer (kürzerer) Manifeste prüfen kann.
  m.version = manifestPrefixVersion(m, ids.length)!;
  return m;
}

/**
 * Version, die das Manifest hätte, wenn es nur aus seinen ersten `count` IDs
 * bestünde (fortlaufender, Reihenfolge-sensitiver Hash; Länge eingemischt,
 * damit reine Rotation nicht kollidiert). `manifestPrefixVersion(m, m.ids.length)`
 * ist immer gleich `m.version`.
 *
 * Grundlage der PRÄFIX-VALIDIERUNG des Ledgers (Prüfbericht 27.07., Teil 0
 * Punkt 2): Wurde der Inhalt seit dem Speichern nur HINTEN erweitert
 * (append-only), stimmt die damals gespeicherte `manifestVersion` mit dem
 * Präfix-Hash über die damaligen `seenManifestCount` IDs überein — alle alten
 * Indizes sind dann weiter gültig und das `seenBausteine`-Bitset bleibt
 * erhalten, statt bei jedem Inhalts-Deploy komplett zurückgesetzt zu werden.
 *
 * `undefined` bei unbrauchbarem `count` (negativ, nicht ganzzahlig oder größer
 * als das Manifest) — dann ist keine Aussage möglich.
 */
export function manifestPrefixVersion(
  m: Manifest,
  count: number,
): number | undefined {
  if (!Number.isInteger(count) || count < 0 || count > m.ids.length)
    return undefined;
  let acc = 0x811c9dc5;
  for (let i = 0; i < count; i++) {
    acc ^= fnv1a(m.ids[i]);
    acc = Math.imul(acc, 0x01000193);
  }
  acc ^= count;
  return acc >>> 0;
}

/**
 * Wählt aus den Kandidaten-Indizes (z. B. einem Tier×Sorte-Eimer) bis zu `n`
 * NOCH NICHT gesehene aus. Ist alles gesehen (Eimer erschöpft), meldet
 * `exhausted: true` — der Aufrufer setzt dann diesen Eimer zurück (bei genug
 * Masse extrem selten). Deterministisch, wenn `rng` deterministisch ist.
 *
 * @param rng Zufallsquelle in [0,1) — Default `Math.random` (Auswahl-Reihenfolge).
 */
export function pickUnseen(
  candidates: readonly number[],
  seen: Uint8Array,
  n: number,
  rng: () => number = Math.random,
): { picked: number[]; exhausted: boolean } {
  const unseen: number[] = [];
  for (const idx of candidates) if (!seenHas(seen, idx)) unseen.push(idx);
  const exhausted = unseen.length === 0 && candidates.length > 0;
  // Fisher–Yates auf einer Kopie, dann die ersten n.
  const pool = unseen.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  return { picked: pool.slice(0, Math.max(0, n)), exhausted };
}

// ── Geschichten-Fortschritt (strikt linear, jede Etappe genau einmal) ────────

export interface StoryState {
  /** Index der als NÄCHSTES fälligen Etappe (0-basiert). */
  etappe: number;
  /** Serie komplett durchgetippt? */
  done?: boolean;
  /**
   * NEU (21.07.): zuletzt erreichte ZEILE innerhalb der fälligen Etappe
   * (0-basiert). Wer bei Zeile 5 von 12 aufhört, macht dort weiter statt wieder
   * bei Zeile 1 ({@link noteStoryLine}). Gilt immer für die in `etappe`
   * genannte Etappe; beim Etappenwechsel fällt der Wert weg. Additiv/optional —
   * Altstände ohne dieses Feld starten die Etappe wie bisher bei 0.
   */
  line?: number;
  /**
   * NEU (28.07.): der TAG (YYYY-MM-DD), an dem diese Geschichte begonnen wurde —
   * Grundlage für das Abzeichen „In einem Rutsch" (an einem einzigen Tag zu Ende
   * gelesen). Additiv/optional; Altstände ohne das Feld verdienen es einfach nicht.
   */
  startDay?: string;
}

export type StoryProgress = Record<string, StoryState>;

/** Aktueller Stand einer Serie (Default: bei Etappe 0, nicht fertig). */
export function storyStateFor(
  progress: StoryProgress | undefined,
  slug: string,
): StoryState {
  const s = progress?.[slug];
  if (!s) return { etappe: 0, done: false, line: 0 };
  return {
    etappe: Math.max(0, s.etappe | 0),
    done: !!s.done,
    line: Math.max(0, s.line ?? 0),
    startDay: s.startDay,
  };
}

/**
 * Merkt sich die zuletzt erreichte ZEILE innerhalb der laufenden Etappe (rein).
 * Bricht ein Kind mitten in einer Geschichte ab, geht es beim nächsten Mal genau
 * hier weiter (Wunsch Johannes 21.07.).
 *
 * Der Stand wird NUR übernommen, wenn `etappe` die aktuell fällige Etappe ist —
 * sonst zeigte eine alte Zeilen-Nummer in eine ganz andere Etappe (etwa nach
 * „nochmal lesen"). Eine fertige Serie merkt sich keine Zeile mehr.
 */
export function noteStoryLine(
  progress: StoryProgress | undefined,
  slug: string,
  etappe: number,
  line: number,
  day?: string,
): StoryProgress {
  const cur = storyStateFor(progress, slug);
  if (cur.done || etappe !== cur.etappe) return progress ?? {};
  const next = Math.max(0, line | 0);
  // Beim ALLERERSTEN Schreiben den Tag merken (siehe StoryState.startDay).
  const startDay = cur.startDay ?? day;
  if (next === (cur.line ?? 0) && startDay === cur.startDay) return progress ?? {};
  return {
    ...(progress ?? {}),
    [slug]: { ...cur, line: next, ...(startDay ? { startDay } : {}) },
  };
}

/**
 * Rückt eine Serie um eine Etappe vor (rein, gibt neue Map zurück). Ist die eben
 * getippte Etappe die letzte (`total`), wird die Serie als `done` markiert und der
 * Zähler auf `total` festgehalten.
 */
export function advanceStory(
  progress: StoryProgress | undefined,
  slug: string,
  total: number,
): StoryProgress {
  const cur = storyStateFor(progress, slug);
  const nextEtappe = Math.min(total, cur.etappe + 1);
  const done = nextEtappe >= total;
  // Ohne `line`: die neue Etappe beginnt bei Zeile 0 (der Zeilen-Stand galt nur
  // für die eben abgeschlossene Etappe).
  return { ...(progress ?? {}), [slug]: { etappe: nextEtappe, done } };
}

/** Ist eine Serie komplett durch? */
export function isStoryDone(
  progress: StoryProgress | undefined,
  slug: string,
): boolean {
  return !!progress?.[slug]?.done;
}

/**
 * Setzt eine Serie auf Anfang zurück (für „nochmal lesen" auf ausdrücklichen
 * Wunsch, §3.3). Rein.
 */
export function resetStory(
  progress: StoryProgress | undefined,
  slug: string,
): StoryProgress {
  return { ...(progress ?? {}), [slug]: { etappe: 0, done: false } };
}
