/**
 * WÄCHTER-TEST „Korpus-Anker" (L1, 21.08.2026).
 *
 * ── Worum es geht (ohne Vorwissen lesbar) ───────────────────────────────────
 * Der Trainer serviert Korpus-Zeilen ADAPTIERT (ungelernte Satzzeichen fallen
 * weg), die gespeicherte Zeichenfolge taugt also nicht als Wiedererkennung.
 * Darum merkt sich das No-Repeat-Ledger je Kind nur ein Bitset von ZAHLEN
 * (`TypingProgress.seenBausteine`): die POSITION jeder schon getippten Zeile im
 * Content-Manifest. Bit 1234 gesetzt heißt „Baustein Nr. 1234 hatte ich schon".
 *
 * Diese Buchhaltung hält genau so lange, wie Nr. 1234 dieselbe Zeile bleibt.
 * Verschiebt sich auch nur ein Platz, zeigt jedes Bit auf die falsche Zeile —
 * und `seenLedgerValid` (corpusManifest.ts) verwirft dann, völlig zu Recht, das
 * ganze Bitset. Für das Kind heißt das: Es bekommt seinen halben, mühsam
 * durchgetippten Vorrat noch einmal serviert. Genau das soll nie wieder
 * passieren.
 *
 * ── Der Fehler, den dieser Test einsperrt ───────────────────────────────────
 * Bis L1 kam die Reihenfolge allein aus dem Quelltext: `[...CORPUS, ...CORPUS_EN]`,
 * Deutsch zuerst, Englisch angehängt. Das trug nur den halben Weg. Gemessen am
 * Stand 5dec7b0 (2331 DE + 1637 EN = 3968 Bausteine):
 *
 *   • nur ENGLISCH angehängt  → Präfix gültig   → Ledger bleibt   ✔
 *   • nur DEUTSCH angehängt   → Präfix UNGÜLTIG → Ledger verworfen ✘
 *   • in beiden Sprachen      → Präfix UNGÜLTIG → Ledger verworfen ✘
 *
 * Grund: Deutsche Neuzugänge stehen im Quelltext VOR dem englischen Block und
 * schoben deshalb jedes Mal sämtliche 1637 englischen Indizes nach hinten. Die
 * Präfix-Validierung (Prüfbericht 27.07.) konnte da nichts mehr retten — sie
 * schützt nur reines Anhängen am ENDE.
 *
 * Die Reparatur ist der ANKER (`KORPUS_ANKER` in corpusAnker.ts): eine erzeugte
 * Liste der Baustein-IDs in kanonischer Reihenfolge. `manifestFor` baut das
 * Manifest strikt nach ihr und hängt nur an, was dort fehlt. Wo im Quelltext
 * eine neue Zeile landet, ist damit gleichgültig — sie kommt immer hinten.
 *
 * ── Wie dieser Test rot wird ────────────────────────────────────────────────
 * Nimmt jemand `manifestFor` den Anker weg (zurück zu reinem
 * `buildManifest([...CORPUS, ...CORPUS_EN])`), fallen sofort §2 (deutscher und
 * gemischter Zuwachs) und §3 (Einpflegen mitten im Quelltext) um. Sortiert oder
 * löscht jemand im Anker, fällt §1 (die eingefrorene Ratsche). Pflegt eine
 * Charge Inhalt ein, ohne den Anker neu zu erzeugen, fällt §4 — mit dem Befehl
 * in der Fehlermeldung.
 */
import { describe, it, expect } from "vitest";
import { CORPUS, CORPUS_EN, CORPUS_FR } from "../src/lib/typing/corpus";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker";
import {
  corpusManifest,
  corpusManifestCount,
  corpusManifestVersion,
  manifestFor,
  seenLedgerValid,
} from "../src/lib/typing/corpusManifest";
import {
  bausteinId,
  manifestPrefixVersion,
  type Manifest,
  type ManifestEntry,
} from "../src/lib/typing/ledger";

/** Der Befehl, der den Anker fortschreibt — gehört in jede Fehlermeldung. */
const ERZEUGEN = "npx tsx scripts/erzeuge-korpus-anker.mts";

/**
 * Eingefrorene Ratsche, Stand L1 (Commit 5dec7b0, 21.08.2026): So viele
 * Bausteine gab es, und das ist ihr Reihenfolge-Hash. Beide Zahlen dürfen sich
 * NIE ändern — sie sind der Beweis, dass die 3968 Plätze, an denen echte
 * Kinder-Konten hängen, unangetastet geblieben sind. Der Anker darf wachsen,
 * dieser Kopf nicht.
 */
const ANKER_STAND = { count: 3968, version: 3177528600 };

/** Frei erfundene Zeilen, die im echten Korpus garantiert nicht vorkommen. */
const NEU_DE: ManifestEntry[] = [
  { kind: "satz", text: "Der Wächtertest pflanzt einen Wolkenbaum aus Zinnober." },
  { kind: "satz", text: "Zwei Zinnoberfalter zählen die Wolkenbäume rückwärts." },
];
const NEU_EN: ManifestEntry[] = [
  { kind: "satz", text: "The guardian test plants a cinnabar cloud tree." },
  { kind: "satz", text: "Two cinnabar moths count the cloud trees backwards." },
];

/**
 * Das Manifest von heute, aber ohne die Memoisierung von `corpusManifest`.
 * ★ E8a (25./26.09.2026): CORPUS_FR dazugenommen, seit der französische Weg
 * einen eigenen Korpus hat (`corpus.ts`) - sonst würde §4 den ganzen
 * französischen Bestand als "fehlend" melden.
 */
const heute = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR]);

/**
 * Die Rechnung aus `seenLedgerValid`, angewandt auf ein SIMULIERTES Manifest von
 * morgen. (`seenLedgerValid` selbst prüft immer gegen den echten, memoisierten
 * Korpus — dem lässt sich kein Zuwachs unterschieben, darum hier von Hand.)
 * `true` heißt: Das Bitset eines Kindes, das mit `altCount`/`altVersion`
 * gespeichert wurde, bleibt gültig und wird BEHALTEN.
 */
function ledgerUeberlebt(morgen: Manifest, alt: Manifest): boolean {
  return manifestPrefixVersion(morgen, alt.ids.length) === alt.version;
}

describe("§1 — die eingefrorene Ratsche (bestehende Plätze unverrückbar)", () => {
  it("die ersten 3968 Anker-Plätze hashen auf den Stand von L1", () => {
    expect(KORPUS_ANKER.length).toBeGreaterThanOrEqual(ANKER_STAND.count);
    // Präfix-Hash über die ersten 3968 IDs des heutigen Manifests: unverändert.
    expect(manifestPrefixVersion(heute, ANKER_STAND.count)).toBe(ANKER_STAND.version);
  });

  it("der Anker enthält keine ID doppelt (jeder Platz gehört genau einem Baustein)", () => {
    expect(new Set(KORPUS_ANKER).size).toBe(KORPUS_ANKER.length);
  });

  it("der Anker ist Platz für Platz das Präfix des Manifests", () => {
    // Anders gesagt: Das Manifest hängt nur an, es sortiert nie um.
    expect(heute.ids.slice(0, KORPUS_ANKER.length)).toEqual([...KORPUS_ANKER]);
  });

  it("das laufende Manifest hält seinen eigenen Ledger-Vertrag", () => {
    expect(corpusManifest().ids.length).toBe(corpusManifestCount());
    expect(seenLedgerValid(corpusManifestVersion(), corpusManifestCount())).toBe(true);
  });
});

describe("§2 — Zuwachs ist in BEIDEN Sprachen unschädlich (P2)", () => {
  it("nur englischer Zuwachs: das Ledger überlebt", () => {
    const morgen = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...NEU_EN]);
    expect(morgen.ids.length).toBe(heute.ids.length + NEU_EN.length);
    expect(ledgerUeberlebt(morgen, heute)).toBe(true);
  });

  it("nur deutscher Zuwachs: das Ledger überlebt (vor L1 war GENAU DAS kaputt)", () => {
    // Die neuen deutschen Zeilen stehen im Quelltext VOR dem englischen Block —
    // vor L1 verschob das alle 1637 englischen Indizes und verwarf das Bitset.
    const morgen = manifestFor([...CORPUS, ...NEU_DE, ...CORPUS_EN, ...CORPUS_FR]);
    expect(morgen.ids.length).toBe(heute.ids.length + NEU_DE.length);
    expect(ledgerUeberlebt(morgen, heute)).toBe(true);
  });

  it("Zuwachs in beiden Sprachen: das Ledger überlebt", () => {
    const morgen = manifestFor([...CORPUS, ...NEU_DE, ...CORPUS_EN, ...CORPUS_FR, ...NEU_EN]);
    expect(morgen.ids.length).toBe(heute.ids.length + NEU_DE.length + NEU_EN.length);
    expect(ledgerUeberlebt(morgen, heute)).toBe(true);
  });

  it("jeder bestehende Baustein behält bei Zuwachs seinen Index", () => {
    const morgen = manifestFor([...CORPUS, ...NEU_DE, ...CORPUS_EN, ...CORPUS_FR, ...NEU_EN]);
    for (let i = 0; i < heute.ids.length; i++) {
      expect(morgen.ids[i]).toBe(heute.ids[i]);
    }
  });
});

describe("§3 — die Stelle im Quelltext ist egal (das ist das Strukturelle)", () => {
  it("eine mitten in den deutschen Korpus gepflegte Zeile landet trotzdem hinten", () => {
    // Der schlimmste denkbare Fall: Jemand pflegt neue Zeilen NICHT am Ende ein,
    // sondern mitten hinein — genau die Disziplin, auf die man sich nicht
    // verlassen kann. Der Anker fängt das ab.
    const mitte = Math.floor(CORPUS.length / 2);
    const morgen = manifestFor([
      ...CORPUS.slice(0, mitte),
      ...NEU_DE,
      ...CORPUS.slice(mitte),
      ...CORPUS_EN,
      ...CORPUS_FR,
    ]);
    expect(ledgerUeberlebt(morgen, heute)).toBe(true);
    expect(morgen.ids.slice(0, heute.ids.length)).toEqual(heute.ids);
    for (const n of NEU_DE) {
      expect(morgen.indexOf.get(bausteinId(n.kind, n.text))).toBeGreaterThanOrEqual(
        heute.ids.length,
      );
    }
  });

  it("eine ENTFERNTE Zeile hinterlässt nur eine Lücke, verschiebt aber nichts", () => {
    // Gelöschte Bausteine sollen (wie deaktivierte) ihren Platz behalten, damit
    // die Bits dahinter weiter stimmen. Der Anker leistet das von allein.
    const ohneErste = manifestFor([...CORPUS.slice(1), ...CORPUS_EN, ...CORPUS_FR]);
    expect(ohneErste.ids).toEqual(heute.ids);
    expect(ledgerUeberlebt(ohneErste, heute)).toBe(true);
  });
});

describe("§4 — der Anker muss den ganzen lebenden Korpus abdecken", () => {
  it("jeder servierbare Baustein hat einen Anker-Platz", () => {
    const fehlend: string[] = [];
    const imAnker = new Set(KORPUS_ANKER);
    for (const it of [...CORPUS, ...CORPUS_EN, ...CORPUS_FR]) {
      const id = bausteinId(it.kind, it.text);
      if (!imAnker.has(id)) fehlend.push(`${id} (${it.kind}: ${it.text.slice(0, 40)})`);
    }
    expect(
      fehlend.length,
      `Der Korpus-Anker ist veraltet: ${fehlend.length} Baustein(e) fehlen.\n` +
        `Bitte '${ERZEUGEN}' laufen lassen (hängt sie hinten an, rührt nichts an).\n` +
        `Erste Fehlende: ${fehlend.slice(0, 5).join(" | ")}`,
    ).toBe(0);
  });

  it("der Anker enthält nichts über den Korpus hinaus, außer bewussten Lücken", () => {
    // Reine Buchführung: Anker == Manifest, solange nichts eingepflegt wurde.
    expect(KORPUS_ANKER.length).toBe(heute.ids.length);
  });
});
