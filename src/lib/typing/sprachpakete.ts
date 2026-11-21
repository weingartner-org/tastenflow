/**
 * ★★★ DAS REGISTER DER SPRACHPAKETE - Tastenflow lädt nur die Texte, die ein
 * Kind braucht (28.09.2026).
 * ============================================================================
 * Auftrag Johannes (28.09.2026): *„nur die sprache vom kind laden! und
 * englische texte kommen immer mit. in jeder sprache"*.
 *
 * Bis dahin standen die Tastenflow-Texte (Korpus, Serien, Lexikon-Nachträge)
 * aller vier Sprachen als STATISCHE Importe im Code - jeder Besucher lud alle
 * vier (gemessen 28.09.: tastenflow.org/es 2.147 KB gzip, davon rund 900 KB
 * die vier Datenpakete). Jetzt liegt jede Sprache in EINEM Paket
 * (`sprachpaketDe|En|Fr|Es.ts`), das erst per `import()` geholt wird.
 *
 * ── WER WAS TUT ─────────────────────────────────────────────────────────────
 *  · Dieses Modul hält, was geladen ist, und lädt nach. Es importiert keinen
 *    Code (nur Typen) - so kann jeder Verbraucher es ohne Zirkel-Falle
 *    einbinden (siehe `beiSprachpaket`).
 *  · Welche Pakete ein Weg braucht, steht an EINER Stelle:
 *    `sprachPaketeFuer` in `sprachpaketBedarf.ts`.
 *  · Die Verbraucher (`corpus.ts`, `serien.ts`, `lexicon.ts`) melden sich mit
 *    `beiSprachpaket` an und bauen ihre Listen neu, sobald ein Paket kommt.
 *    Nach aussen bleibt alles, wie es war: `CORPUS`, `SERIEN`, `isRealWord` …
 *  · Vor dem Üben wartet `SprachpaketTor` (components/typing), bis die Pakete
 *    da sind - eine Übung startet nie mit fehlenden Daten.
 *
 * ── WAS BEI EINEM FEHLENDEN PAKET GESCHIEHT ─────────────────────────────────
 * Greift trotzdem jemand auf eine Sprache zu, die nicht geladen ist (ein
 * Durchgang, den kein Tor abdeckt), ist das ein FEHLZUGRIFF: Er wird notiert
 * (`fehlZugriffe()` - die Wächter-Tests verlangen die Liste leer), das Paket
 * wird sofort nachgeladen, und wer `useSprachpaketStand` benutzt, zeichnet
 * sich danach neu. Die Antwort in diesem Augenblick enthält die Sprache noch
 * nicht - darum sind die Tore die eigentliche Sicherung, das hier nur das Netz.
 *
 * ⚠️ Der Ledger hängt NICHT an den Paketen: Die Manifest-Version kommt allein
 *    aus dem Korpus-Anker (`corpusManifest.ts`), sonst verlöre jedes Kind sein
 *    Ledger, sobald eine Sprache fehlt.
 */
import type { Lang } from "./account";
import type { CorpusItem } from "./corpus";
import type { Serie } from "./serie";

/** Was ein Sprachpaket mitbringt. Jede Sprache liefert dieselbe Form. */
export interface SprachDaten {
  /**
   * Die Korpus-Bausteine, GENAU in der Reihenfolge, in der `corpus.ts` sie
   * zusammenführt (`mergeCorpus`: der erste Eintrag gewinnt) - die Reihenfolge
   * bestimmt, welche Zeile ein Kind bekommt.
   */
  korpus: readonly CorpusItem[];
  /**
   * Die Serien-Listen dieser Sprache nach ihrem Namen. Die Reihenfolge in
   * `SERIEN` legt `serien.ts` fest (`SERIEN_FOLGE`), nicht das Paket.
   */
  serien: Readonly<Record<string, readonly Serie[]>>;
  /** Die Lexikon-Nachträge, in der Reihenfolge, in der `lexicon.ts` sie einfügt. */
  lexikon: readonly (readonly string[])[];
}

type Lader = () => Promise<SprachDaten | undefined>;

/**
 * Wie jede Sprache geladen wird. `Record<Lang, …>`: Eine neue Sprache in `Lang`
 * lässt den Typprüfer hier anhalten, bis ihr Paket eingetragen ist.
 * ⚠️ Die Pfade müssen wörtlich dastehen - nur so legt Vite ein eigenes Paket an.
 * ⚠️ `?.`: Scheitert das Laden und fängt `nachladeFehlerAbfangen`
 *    (seiteNachladen.tsx) den Fehler ab, liefert Vites Hilfe `undefined`.
 */
const LADER_VORGABE: Record<Lang, Lader> = {
  de: () => import("./sprachpaketDe").then((m) => m?.SPRACHPAKET_DE),
  en: () => import("./sprachpaketEn").then((m) => m?.SPRACHPAKET_EN),
  fr: () => import("./sprachpaketFr").then((m) => m?.SPRACHPAKET_FR),
  es: () => import("./sprachpaketEs").then((m) => m?.SPRACHPAKET_ES),
  // ★ G2a (02.10.2026): vier LEERE Pakete (Gerüst, noch kein Text) - eigene
  // Dateien, damit die Sprache später nur ihre Listen einlegt.
  it: () => import("./sprachpaketIt").then((m) => m?.SPRACHPAKET_IT),
  pl: () => import("./sprachpaketPl").then((m) => m?.SPRACHPAKET_PL),
  tr: () => import("./sprachpaketTr").then((m) => m?.SPRACHPAKET_TR),
  cs: () => import("./sprachpaketCs").then((m) => m?.SPRACHPAKET_CS),
  // ★ G2-NEUN (25.10.2026): neun LEERE Pakete (Gerüst, noch kein Text), wie it/pl/tr/cs in G2a.
  bg: () => import("./sprachpaketBg").then((m) => m?.SPRACHPAKET_BG),
  el: () => import("./sprachpaketEl").then((m) => m?.SPRACHPAKET_EL),
  hu: () => import("./sprachpaketHu").then((m) => m?.SPRACHPAKET_HU),
  nl: () => import("./sprachpaketNl").then((m) => m?.SPRACHPAKET_NL),
  pt: () => import("./sprachpaketPt").then((m) => m?.SPRACHPAKET_PT),
  br: () => import("./sprachpaketBr").then((m) => m?.SPRACHPAKET_BR),
  ro: () => import("./sprachpaketRo").then((m) => m?.SPRACHPAKET_RO),
  sv: () => import("./sprachpaketSv").then((m) => m?.SPRACHPAKET_SV),
  uk: () => import("./sprachpaketUk").then((m) => m?.SPRACHPAKET_UK),
};
let lader: Record<Lang, Lader> = { ...LADER_VORGABE };

/** Alle Sprachen, für die es ein Paket gibt - abgeleitet aus der Lader-Tabelle. */
export const ALLE_SPRACHPAKETE: readonly Lang[] = Object.freeze(Object.keys(LADER_VORGABE) as Lang[]);

const geladen = new Map<Lang, SprachDaten>();
const laufend = new Map<Lang, Promise<void>>();
const verbraucher: ((lang: Lang, daten: SprachDaten | undefined) => void)[] = [];
const hoerer = new Set<() => void>();
let stand = 0;

export interface FehlZugriff {
  /** Die fehlende Sprache - `"alle"`, wenn nur der ganze Bestand die Antwort kennt. */
  sprache: Lang | "alle";
  wo: string;
}
const fehlZugriffListe: FehlZugriff[] = [];

function melden(): void {
  stand++;
  for (const h of [...hoerer]) h();
}

/**
 * Ein Verbraucher meldet sich an: `fn` wird für jedes schon geladene Paket
 * sofort gerufen und danach für jedes weitere (`daten === undefined` nur beim
 * Zurücksetzen in Tests).
 */
export function beiSprachpaket(fn: (lang: Lang, daten: SprachDaten | undefined) => void): void {
  verbraucher.push(fn);
  for (const [lang, daten] of geladen) fn(lang, daten);
}

export function sprachpaketGeladen(lang: Lang): boolean {
  return geladen.has(lang);
}

export function sprachpaketeGeladen(sprachen: readonly Lang[]): boolean {
  return sprachen.every((l) => geladen.has(l));
}

/** Die Daten einer geladenen Sprache - `undefined`, solange sie fehlt. */
export function sprachDaten(lang: Lang): SprachDaten | undefined {
  return geladen.get(lang);
}

function einsetzen(lang: Lang, daten: SprachDaten): void {
  if (geladen.has(lang)) return;
  geladen.set(lang, daten);
  for (const fn of verbraucher) fn(lang, daten);
  melden();
}

function ladeEines(lang: Lang): Promise<void> {
  if (geladen.has(lang)) return Promise.resolve();
  const schon = laufend.get(lang);
  if (schon) return schon;
  const p = lader[lang]()
    .then((daten) => {
      if (!daten) throw new Error(`Sprachpaket „${lang}" kam leer an`);
      einsetzen(lang, daten);
    })
    .finally(() => {
      // Auch nach einem Fehler: der nächste Versuch lädt neu.
      laufend.delete(lang);
    });
  laufend.set(lang, p);
  return p;
}

/**
 * Lädt, was von `sprachen` noch fehlt (gleichzeitig). Scheitert eines, wird
 * das Versprechen abgelehnt - die schon geladenen bleiben geladen.
 */
export function ladeSprachpakete(sprachen: readonly Lang[]): Promise<void> {
  const fehlend = [...new Set(sprachen)].filter((l) => !geladen.has(l));
  if (fehlend.length === 0) return Promise.resolve();
  return Promise.all(fehlend.map(ladeEines)).then(() => undefined);
}

/**
 * ★ Das Netz unter den Toren: Jemand fragt nach einer Sprache, die nicht da
 * ist. Notieren, nachladen, neu zeichnen lassen (siehe Kopf).
 */
export function fehlZugriff(sprache: Lang | "alle", wo: string): void {
  fehlZugriffListe.push({ sprache, wo });
  const sprachen = sprache === "alle" ? ALLE_SPRACHPAKETE : [sprache];
  if (typeof console !== "undefined" && !istTestlauf()) {
    console.warn(`[Sprachpaket] ${wo}: „${sprache}" war nicht geladen - wird nachgeladen.`);
  }
  void ladeSprachpakete(sprachen).catch(() => {
    /* Das Tor zeigt den Fehler; hier nur das Netz. */
  });
}

function istTestlauf(): boolean {
  return typeof process !== "undefined" && !!process.env?.VITEST;
}

/** Die notierten Fehlzugriffe (für die Wächter-Tests). */
export function fehlZugriffe(): readonly FehlZugriff[] {
  return fehlZugriffListe;
}

export function fehlZugriffeLeeren(): void {
  fehlZugriffListe.length = 0;
}

/** Zählt bei jedem geladenen Paket hoch - für `useSyncExternalStore`. */
export function sprachpaketStand(): number {
  return stand;
}

export function abonniereSprachpakete(fn: () => void): () => void {
  hoerer.add(fn);
  return () => {
    hoerer.delete(fn);
  };
}

// ── NUR FÜR TESTS ───────────────────────────────────────────────────────────

/**
 * Ersetzt Lader (Zählen, Fehler vortäuschen). Gibt eine Funktion zurück, die
 * die echten wieder einsetzt.
 */
export function _sprachpaketLaderErsetzen(ersatz: Partial<Record<Lang, Lader>>): () => void {
  lader = { ...lader, ...ersatz };
  return () => {
    lader = { ...LADER_VORGABE };
  };
}

/** Der echte Lader einer Sprache (für Tests, die zählen und trotzdem laden). */
export function _echterSprachpaketLader(lang: Lang): Lader {
  return LADER_VORGABE[lang];
}

/**
 * Vergisst geladene Pakete - wie ein frischer Besuch. Die Verbraucher bauen
 * ihre Listen dabei leer. Gibt zurück, was vorher geladen war, damit der Test
 * es wieder einsetzen kann (`_sprachpaketeWiederEinsetzen`).
 */
export function _sprachpaketeVergessen(sprachen: readonly Lang[] = ALLE_SPRACHPAKETE): Map<Lang, SprachDaten> {
  const vorher = new Map(geladen);
  for (const lang of sprachen) {
    if (!geladen.has(lang)) continue;
    geladen.delete(lang);
    for (const fn of verbraucher) fn(lang, undefined);
  }
  melden();
  return vorher;
}

export function _sprachpaketeWiederEinsetzen(vorher: Map<Lang, SprachDaten>): void {
  for (const [lang, daten] of vorher) einsetzen(lang, daten);
}
