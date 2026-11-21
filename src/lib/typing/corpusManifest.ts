/**
 * Content-Manifest über den echten Text-Korpus + ledger-fähige Auswahl
 * (Textwelt-Umbau TW-E2; Bauplan Sensorik/BAUPLAN-2026-07-20-TASTENFLOW-TEXTWELT.md,
 * [[project_tastenflow_textwelt_neuaufbau]]).
 *
 * Der Generator serviert Korpus-Zeilen ADAPTIERT (fitText lässt ungelernte
 * Satzzeichen weg) — die adaptierte Zeichenfolge verliert also die Identität des
 * Bausteins. Damit das No-Repeat-Ledger trotzdem „genau diese Zeile schon
 * getippt" verbuchen kann, vergibt dieses Modul jedem Baustein über
 * `buildManifest` einen STABILEN Index und liefert bei der Auswahl
 * (`corpusEntriesFor`) neben der fertigen Zeile auch diesen Index mit.
 *
 * Ein GEMEINSAMES Manifest über alle Sprachen → ein einziges
 * `seenBausteine`-Bitset deckt alle (fr seit 26.09.2026, es seit 27.09.).
 * Seit 28.09.2026 kommt es allein aus dem Anker (siehe `corpusManifest`).
 *
 * ── L1 (21.08.2026): die Reihenfolge kommt aus dem ANKER ────────────────────
 * Bis dahin ergaben sich die Indizes allein aus der Quelltext-Reihenfolge
 * `[...CORPUS, ...CORPUS_EN]`. Das hielt nur, solange ausschließlich ENGLISCH
 * dazukam: Deutsche Neuzugänge stehen im Quelltext VOR dem englischen Block und
 * schoben jedes Mal sämtliche englischen Indizes nach hinten — `seenLedgerValid`
 * fand dann kein gültiges Präfix mehr und verwarf das Bitset des Kindes. Gemessen
 * am Stand 5dec7b0 (2331 DE + 1637 EN = 3968 Bausteine): nur-EN gültig, nur-DE
 * ungültig, DE+EN ungültig.
 *
 * Seit L1 baut `manifestFor` das Manifest strikt nach `KORPUS_ANKER`
 * (corpusAnker.ts) und hängt nur an, was dort fehlt. Wo im Quelltext eine Zeile
 * eingepflegt wird, spielt damit keine Rolle mehr — jeder Zuwachs landet hinten,
 * in BEIDEN Sprachen. Der Wächter dazu: `tests/typing-ledger-anker.test.ts`.
 *
 * ⚠️ Nach jeder Inhalts-Charge den Anker neu erzeugen:
 *    npx tsx scripts/erzeuge-korpus-anker.mts
 */
import {
  fitText,
  korpusFuer,
  hatGrossbuchstaben,
  nurKleinschrift,
  passtLernweg,
  wandleVariante,
  type CorpusKind,
  type CorpusQuery,
} from "./corpus";
import { contentStufenFor, type Lang } from "./account";
import { isDeactivated } from "./corpusDeactivated";
import { KORPUS_ANKER } from "./corpusAnker";
import {
  bausteinId,
  buildManifest,
  type ManifestEntry,
  manifestPrefixVersion,
  type Manifest,
} from "./ledger";

/**
 * Die EINE Stelle, an der die Ledger-Reihenfolge festgelegt wird: Anker zuerst,
 * Unbekanntes hinten dran. Alles, was Manifest-Indizes vergibt, geht hier durch —
 * `corpusManifest()` im Betrieb, der Anker-Generator und der Wächter-Test mit
 * simuliertem Zuwachs. Wer den Anker hier entfernt, macht den Wächter rot.
 */
export function manifestFor(items: readonly ManifestEntry[]): Manifest {
  return buildManifest(items, KORPUS_ANKER);
}

let _manifest: Manifest | null = null;

/**
 * Das (memoisierte) Korpus-Manifest. Einmalig gebaut, danach stabil.
 *
 * ★★★ 28.09.2026: ALLEIN AUS DEM ANKER. Bis dahin wurde es über
 * `[...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES]` gebaut. Seit die
 * Texte je Sprache nachgeladen werden (`sprachpakete.ts`), fehlen einem Kind
 * auf Weg „es" die deutschen und französischen Zeilen - ein Manifest über den
 * geladenen Bestand hätte eine ANDERE Version, und `seenLedgerValid` verwürfe
 * das Ledger JEDES Kindes (es bekäme schon getippte Zeilen noch einmal).
 *
 * Der Anker enthält jede ID des lebenden Korpus aller Sprachen - das prüft der
 * Build (`npm run anker:check`, `scripts/erzeuge-korpus-anker.mts --check`)
 * und `tests/typing-ledger-anker.test.ts` §4. Damit ist das Manifest über den
 * Anker allein dasselbe wie vorher über alle Sprachen: gemessen am 28.09.
 * Version 3305236381, 11.893 IDs, vorher wie nachher
 * (`tests/sprachpakete-golden.test.ts`).
 *
 * ⚠️ Eine Zeile, deren ID im Anker FEHLT, hat damit keinen Ledger-Index und
 *    wird nicht serviert (`corpusEntriesFor` überspringt sie) - vorher bekam
 *    sie einen Platz hinten. Der Build lässt einen solchen Stand nicht durch.
 */
export function corpusManifest(): Manifest {
  if (!_manifest) _manifest = manifestFor([]);
  return _manifest;
}

/** Deterministische Manifest-Version (für `TypingProgress.manifestVersion`). */
export function corpusManifestVersion(): number {
  return corpusManifest().version;
}

/** Anzahl IDs im aktuellen Manifest (für `TypingProgress.seenManifestCount`). */
export function corpusManifestCount(): number {
  return corpusManifest().ids.length;
}

/**
 * Gilt ein gespeichertes `seenBausteine`-Bitset noch fürs AKTUELLE Manifest?
 *
 *  • Gleiche Version ⇒ ja (Inhalt unverändert).
 *  • Sonst PRÄFIX-VALIDIERUNG (Prüfbericht 27.07., Teil 0 Punkt 2): Stimmt die
 *    gespeicherte Version mit dem Präfix-Hash über die ersten `savedCount` IDs
 *    des heutigen Manifests überein, wurde seither nur HINTEN angehängt — alle
 *    alten Indizes bleiben gültig, das Bitset wird BEHALTEN statt verworfen.
 *  • Altstände ohne `savedCount` verhalten sich wie bisher (nur exakte Version).
 *
 * Liefert `false` ⇒ der Aufrufer startet mit leerem Bitset (echter Bruch:
 * Inhalt wurde mittendrin geändert/entfernt/umsortiert).
 */
export function seenLedgerValid(
  savedVersion: number | undefined,
  savedCount: number | undefined,
): boolean {
  if (savedVersion === undefined) return false;
  const m = corpusManifest();
  if (savedVersion === m.version) return true;
  if (savedCount === undefined) return false;
  return manifestPrefixVersion(m, savedCount) === savedVersion;
}

/** Stabiler Manifest-Index eines Bausteins (oder `undefined`, wenn unbekannt). */
export function corpusIndexOf(kind: string, text: string, sprache?: Lang): number | undefined {
  // ★ G3a-SCHRIFT (25.10.2026): `sprache` = die Sprache des Textes (der Weg seiner Zeile) - für die neun Sprachen
  // des Gerüsts rechnet der Schlüssel mit jedem Buchstaben (`bausteinKey`). Ohne Sprache wie bisher.
  return corpusManifest().indexOf.get(bausteinId(kind, text, sprache));
}

/** Eine auswählbare Korpus-Zeile: fertig adaptiert + stabiler Ledger-Index. */
export interface CorpusEntry {
  /** Fertig an den Tastenstand angepasste Zeile (wie `corpusItemsFor`). */
  text: string;
  /** Stabiler Baustein-Index fürs Ledger (`seenBausteine`). */
  index: number;
  kind: CorpusKind;
}

/**
 * Wie `corpusItemsFor`, aber gibt EINTRÄGE MIT INDEX zurück (statt reiner
 * Strings), damit der Generator getippte Bausteine im Ledger verbuchen kann.
 * Gleiche Filter/Dedup-Logik: Altersstufe, Sorten, Tastenstand (`fitText`),
 * fertig-adaptierte Doppel werden einmalig zurückgegeben.
 */
export function corpusEntriesFor(q: CorpusQuery): CorpusEntry[] {
  // ★ E8a-Nachtrag (26.09.2026, Bauplan §15 Falle 1): Tabelle statt der
  // binären Weiche - die lieferte für „fr" still den DEUTSCHEN Korpus (jede
  // Zeile ohne `nurWeg` passt auf jeden Weg), und das ist der Weg, über den
  // der Generator wirklich serviert. `corpusItemsFor` (corpus.ts) hat dieselbe
  // Tabelle seit E8a.
  // ★ ES-F5 (27.09.2026, Falle 32: DIES ist der Weg, über den der Generator
  // wirklich serviert): CORPUS_ES vorbereitet (leer, ES-T bringt Text) -
  // dieselbe Tabelle wie in corpus.ts:corpusItemsFor.
  // ★ 28.09.2026: die Tabelle steht nur noch einmal, in `korpusFuer` (corpus.ts).
  const source = korpusFuer(q.lang ?? "de", "corpusEntriesFor");
  const kinds = q.kinds ? new Set(q.kinds) : null;
  const m = corpusManifest();
  // S1: Konto-Stufe → Inhalts-Etiketten (siehe corpusItemsFor).
  const etiketten = contentStufenFor(q.stufe);
  const klein = nurKleinschrift(q.stufe, q.umschalt ?? true); // ★ D-2 (corpus.ts)
  const seenFitted = new Set<string>();
  const out: CorpusEntry[] = [];
  for (const it of source) {
    if (kinds && !kinds.has(it.kind)) continue;
    if (!etiketten.some((s) => it.stufen.includes(s))) continue;
    if (!passtLernweg(it.nurWeg, q.lernweg)) continue; // E4a: nur der eigene Weg
    // TW-E4: aussortierte Bausteine nicht servieren — aber im MANIFEST bleiben sie
    // (buildManifest oben unverändert), damit die Ledger-Indizes stabil bleiben.
    if (isDeactivated(it.kind, it.text)) continue;
    const fitted = fitText(it.text, q.allowed, q.lernweg, q.lang);
    if (fitted === null || seenFitted.has(fitted)) continue;
    if (klein && hatGrossbuchstaben(fitted)) continue; // ★ D-2
    seenFitted.add(fitted);
    // ★ G3a-SCHRIFT: der Schlüssel in der Sprache der Zeile (ihr `nurWeg`), wie beim Bau des Ankers.
    const index = m.indexOf.get(bausteinId(it.kind, it.text, it.nurWeg));
    if (index === undefined) continue; // Manifest deckt den Korpus → praktisch nie
    // ★ E9/E9a: die Schreibweise/Typografie erst NACH der Ledger-Kennung
    // (siehe schreibweise.ts/franzVariante.ts).
    const text = wandleVariante(fitted, q);
    out.push({ text, index, kind: it.kind });
  }
  return out;
}
