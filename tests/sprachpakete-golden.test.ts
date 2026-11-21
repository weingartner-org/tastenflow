/**
 * ★★★★★ GOLDEN-WÄCHTER: DIE SPRACHPAKETE ÄNDERN FÜR KEIN KIND ETWAS (28.09.2026).
 *
 * Johannes: *„nur die sprache vom kind laden! und englische texte kommen
 * immer mit"*. Seit diesem Umbau kommen Korpus, Serien und Lexikon-Nachträge
 * aus nachgeladenen Sprachpaketen (`src/lib/typing/sprachpakete.ts`).
 *
 * Die Werte unten sind am 28.09.2026 gemessen, BEVOR irgendetwas umgebaut war
 * (Stand `6d0efc7a`, alle Texte statisch importiert). Sind alle Pakete
 * geladen, muss derselbe Inhalt in derselben Reihenfolge herauskommen - Zeichen
 * für Zeichen (Hash über das JSON). Die Reihenfolge ist keine Äusserlichkeit:
 * Sie entscheidet, welche Zeile ein Kind bekommt.
 *
 * ★★★★★ Und das LEDGER: Die Manifest-Version darf NIE davon abhängen, welche
 * Pakete geladen sind - sonst verwürfe `seenLedgerValid` das Ledger jedes
 * Kindes (es bekäme schon getippte Zeilen noch einmal). Gemessen vorher:
 * 3305236381 über 11.893 IDs.
 */
import { afterEach, describe, expect, it, vi } from "vitest";

import { CORPUS, CORPUS_EN, CORPUS_ES, CORPUS_FR, corpusItemsFor } from "@/lib/typing/corpus";
import {
  corpusEntriesFor,
  corpusManifestCount,
  corpusManifestVersion,
  seenLedgerValid,
} from "@/lib/typing/corpusManifest";
import { SERIEN, collectHerkunft } from "@/lib/typing/serien";
import { korpusFuer } from "@/lib/typing/corpus";
import { lexikonGroesse, lexikonWoerter } from "@/lib/typing/lexicon";
import { fnv1a } from "@/lib/typing/ledger";
import { korpusQuelle } from "@/lib/typing/uebungsformen/hilfen";
import {
  _sprachpaketeVergessen,
  _sprachpaketeWiederEinsetzen,
  fehlZugriffeLeeren,
  type SprachDaten,
} from "@/lib/typing/sprachpakete";
import type { Lang } from "@/lib/typing/account";

const h = (x: unknown) => fnv1a(JSON.stringify(x)).toString(36);
const SPRACHEN = ["de", "en", "fr", "es"] as const;

/** Gemessen am 28.09.2026 VOR dem Umbau (siehe Kopf). */
const VORHER = {
  // ★ IT-T1 (03.10.2026): die erste italienische Charge hängt 156 Bausteine an den Anker (11.893 ⇒ 12.049) - Version
  // und Zahl sind darum neu; der alte Stand bleibt als PRÄFIX gültig (Test „… vor IT-T1 gespeichert" unten).
  // ★ IT-T3 (03.10.2026): die Erwachsenen-Charge hängt 171 Bausteine an (12.049 ⇒ 12.220); der Stand nach IT-T1
  // (490993357, 12.049) bleibt ebenso als Präfix gültig (Test unten).
  // ★ IT-T2 (03.10.2026, nach T3 gemergt): die Jugend-Charge hängt 145 Bausteine an (12.220 ⇒ 12.365), am gemergten
  // Stand gemessen; der Stand nach IT-T3 (429351553, 12.220) bleibt als Präfix gültig (Test unten).
  // ★ IT-T5 (03.10.2026, nach T2 gemergt): die Jugend-Mitte-Charge hängt 290 Bausteine an (12.365 ⇒ 12.655), am
  // gemergten Stand gemessen; der Stand nach IT-T2 (2446273395, 12.365) bleibt als Präfix gültig (Test unten).
  // ★ IT-T4 (03.10.2026, nach T5 gemergt): Kinder-Mitte hängt 334 Bausteine an (12.655 ⇒ 12.989), am gemergten
  // Stand gemessen; der Stand nach IT-T5 (3174500558, 12.655) bleibt als Präfix gültig (Test unten).
  // ★ IT-T6 (03.10.2026): Erwachsene-Mitte hängt 343 Bausteine an (12.989 ⇒ 13.332); der Stand nach IT-T4
  // (2799814693, 12.989) bleibt als Präfix gültig (Test unten).
  // ★ IT-T9 (03.10.2026, nach T6 gemergt): Erwachsene-Ende hängt 408 Bausteine an (13.332 ⇒ 13.740), am gemergten
  // Stand gemessen; der Stand nach IT-T6 (882667999, 13.332) bleibt als Präfix gültig (Test unten).
  // ★ IT-T8 (03.10.2026, nach T9 gemergt): Jugend-Ende hängt 357 Bausteine an (13.740 ⇒ 14.097), am gemergten Stand
  // gemessen; der Stand nach IT-T9 (3700612393, 13.740) bleibt als Präfix gültig (Test unten).
  // ★ IT-T7 (03.10.2026, nach T8 gemergt): Kinder-Ende hängt 407 Bausteine an (14.097 ⇒ 14.504), am gemergten Stand
  // gemessen; der Stand nach IT-T8 (3974775406, 14.097) bleibt als Präfix gültig (Test unten).
  // ★ PL-T1 (03.10.2026): die erste polnische Charge (Kinder, frühe Sprossen) hängt 164 Bausteine an (14.504 ⇒ 14.668);
  // der Stand nach IT-T7 (2300770861, 14.504) bleibt als Präfix gültig (Test unten).
  // ★ TR-T1 (03.10.2026, nach PL-T1 gemergt): die erste türkische Charge hängt 166 Bausteine an (14.668 ⇒ 14.834), am
  // gemergten Stand gemessen; der Stand nach PL-T1 (3913235790, 14.668) bleibt als Präfix gültig (Test unten).
  // ★ CS-T1 (03.10.2026, nach TR-T1 gemergt): die erste tschechische Charge hängt 128 Bausteine an (14.834 ⇒ 14.962),
  // am gemergten Stand gemessen; der Stand nach TR-T1 (3388808358, 14.834) bleibt als Präfix gültig (Test unten).
  // ★ PL-T2 (03.10.2026, nach CS-T1 gemergt): Polnisch Jugend früh hängt 151 Bausteine an (14.962 ⇒ 15.113), am
  // gemergten Stand gemessen; der Stand nach CS-T1 (4242405402, 14.962) bleibt als Präfix gültig (Test unten).
  // ★ PL-T3 (03.10.2026, nach PL-T2 gemergt): Polnisch Erwachsene früh hängt 167 Bausteine an (15.113 ⇒ 15.280), am
  // gemergten Stand gemessen; der Stand nach PL-T2 (1015649984, 15.113) bleibt als Präfix gültig (Test unten).
  // ★ PL-T4 (03.10.2026, nach PL-T3 gemergt): Polnisch Kinder Mitte hängt 326 Bausteine an (15.280 ⇒ 15.606), am
  // gemergten Stand gemessen; der Stand nach PL-T3 (1115356890, 15.280) bleibt als Präfix gültig (Test unten).
  // ★ PL-T5 (03.10.2026, nach PL-T4 gemergt): Polnisch Jugend Mitte hängt 326 Bausteine an (15.606 ⇒ 15.932), am
  // gemergten Stand gemessen; der Stand nach PL-T4 (2867500111, 15.606) bleibt als Präfix gültig (Test unten).
  // ★ TR-T2 (03.10.2026, nach PL-T5 gemergt): Türkisch Jugend früh hängt 140 Bausteine an (15.932 ⇒ 16.072), am
  // gemergten Stand gemessen; der Stand nach PL-T5 (1513647633, 15.932) bleibt als Präfix gültig (Test unten).
  // ★ CS-T2 (03.10.2026, nach TR-T2 gemergt): Tschechisch Jugend früh hängt 75 Bausteine an (16.072 ⇒ 16.147), am
  // gemergten Stand gemessen; der Stand nach TR-T2 (1119121654, 16.072) bleibt als Präfix gültig (Test unten).
  // ★ TR-T3 (03.10.2026, nach CS-T2 gemergt): Türkisch Erwachsene früh hängt 164 Bausteine an (16.147 ⇒ 16.311), am
  // gemergten Stand gemessen; der Stand nach CS-T2 (4207183703, 16.147) bleibt als Präfix gültig (Test unten).
  // ★ PL-T6 (03.10.2026, nach TR-T3 gemergt): Polnisch Erwachsene Mitte hängt 330 Bausteine an (16.311 ⇒ 16.641), am
  // gemergten Stand gemessen; der Stand nach TR-T3 (423619073, 16.311) bleibt als Präfix gültig (Test unten).
  // ★ PL-T7 (09.10.2026, auf 89b17a5f): Polnisch Kinder Ende hängt 383 Bausteine an (16.641 ⇒ 17.024), am Stand gemessen
  // (nicht addiert); der Stand nach PL-T6 (2940994965, 16.641) bleibt als Präfix gültig (Test unten).
  // ★ TR-T4 (09.10.2026, nach PL-T7 gemergt): Türkisch Kinder Mitte hängt 291 Bausteine an (17.024 ⇒ 17.315), am
  // gemergten Stand gemessen; der Stand nach PL-T7 (589641179, 17.024) bleibt als Präfix gültig (Test unten). Der
  // TR-T4-Eintrag vor dem Merge (1248710551, 16.932) ist verworfen - diesen Stand hat nie ein Kind gesehen.
  // ★ CS-T4 (09.10.2026, nach TR-T4 gemergt): Tschechisch Kinder Mitte hängt 255 Bausteine an (17.315 ⇒ 17.570), am
  // gemergten Stand gemessen; der Stand nach TR-T4 (2896656137, 17.315) bleibt als Präfix gültig (Test unten). Der
  // CS-T4-Eintrag vor dem Merge (3215959908, 16.896) ist verworfen - diesen Stand hat nie ein Kind gesehen.
  // ★ CS-T3 (09.10.2026, nach CS-T4 gemergt): Tschechisch Erwachsene früh hängt 85 Bausteine an (17.570 ⇒ 17.655), am
  // gemergten Stand gemessen; der Stand nach CS-T4 (3896360000, 17.570) bleibt als Präfix gültig (Test unten). Der
  // CS-T3-Eintrag vor dem Merge (4257337738, 16.726) ist verworfen - diesen Stand hat nie ein Kind gesehen.
  // ★ TR-T5 (09.10.2026, nach CS-T3 gemergt): Türkisch Jugend Mitte hängt 314 Bausteine an (17.655 ⇒ 17.969), am
  // gemergten Stand gemessen; der Stand nach CS-T3 (65329905, 17.655) bleibt als Präfix gültig (Test unten). Der
  // TR-T5-Eintrag vor dem Merge (84213229, 17.338) ist verworfen - diesen Stand hat nie ein Kind gesehen.
  // ★ PL-T8 (09.10.2026, nach TR-T5 gemergt): Polnisch Jugend Ende hängt 378 Bausteine an (17.969 ⇒ 18.347), am
  // gemergten Stand gemessen; der Stand nach TR-T5 (797961439, 17.969) bleibt als Präfix gültig (Test unten). Der
  // PL-T8-Eintrag vor dem Merge (3516259162, 17.402) ist verworfen - diesen Stand hat nie ein Kind gesehen.
  // ★ CS-T5 (09.10.2026, nach PL-T8 gemergt): Tschechisch Jugend Mitte hängt 254 Bausteine an (18.347 ⇒ 18.601), am
  // gemergten Stand gemessen; der Stand nach PL-T8 (2246894526, 18.347) bleibt als Präfix gültig (Test unten). Der
  // CS-T5-Eintrag vor dem Merge (2443853396, 17.909) ist verworfen - diesen Stand hat nie ein Kind gesehen.
  // ★ CS-T6 (09.10.2026, nach CS-T5 gemergt): Tschechisch Erwachsene Mitte hängt 252 Bausteine an (18.601 ⇒ 18.853), am
  // gemergten Stand gemessen; der Stand nach CS-T5 (2615690415, 18.601) bleibt als Präfix gültig (Test unten). Der
  // CS-T6-Eintrag vor dem Merge (804868684, 18.221) ist verworfen - diesen Stand hat nie ein Kind gesehen.
  // ★ TR-T6 (09.10.2026, nach CS-T6 gemergt): Türkisch Erwachsene Mitte hängt 331 Bausteine an (18.853 ⇒ 19.184), am
  // gemergten Stand gemessen; der Stand nach CS-T6 (475408812, 18.853) bleibt als Präfix gültig (Test unten). Der
  // TR-T6-Eintrag vor dem Merge (425781251, 18.300) ist verworfen - diesen Stand hat nie ein Kind gesehen.
  // ★ PL-T9 (09.10.2026, nach TR-T6 gemergt): Polnisch Erwachsene Ende hängt 366 Bausteine an (19.184 ⇒ 19.550), am
  // gemergten Stand gemessen; der Stand nach TR-T6 (2904599418, 19.184) bleibt als Präfix gültig (Test unten). Der
  // PL-T9-Eintrag vor dem Merge (1238769046, 18.335) ist verworfen - diesen Stand hat nie ein Kind gesehen.
  // ★ TR-T7 (09.10.2026, nach PL-T9 gemergt): Türkisch Kinder Ende hängt 355 Bausteine an (19.550 ⇒ 19.905), am
  // gemergten Stand gemessen; der Stand nach PL-T9 (520115715, 19.550) bleibt als Präfix gültig (Test unten). Der
  // TR-T7-Eintrag vor dem Merge (285053112, 18.956) ist verworfen - diesen Stand hat nie ein Kind gesehen.
  // ★ CS-T7 (09.10.2026, nach TR-T7 gemergt): Tschechisch Kinder Ende hängt 307 Bausteine an (19.905 ⇒ 20.212), am
  // gemergten Stand gemessen; der Stand nach TR-T7 (601135720, 19.905) bleibt als Präfix gültig (Test unten). Der
  // CS-T7-Eintrag vor dem Merge (788303323, 19.160) ist verworfen - diesen Stand hat nie ein Kind gesehen.
  // ★ TR-T8 (09.10.2026, nach CS-T7 gemergt): Türkisch Jugend Ende hängt 365 Bausteine an (20.212 ⇒ 20.577), am
  // gemergten Stand gemessen; der Stand nach CS-T7 (3887686039, 20.212) bleibt als Präfix gültig (Test unten). Der
  // TR-T8-Eintrag vor dem Merge (2972283997, 19.549) ist verworfen - diesen Stand hat nie ein Kind gesehen.
  // ★ CS-T8 (09.10.2026, nach TR-T8 gemergt): Tschechisch Jugend Ende hängt 317 Bausteine an (20.577 ⇒ 20.894), am
  // gemergten Stand gemessen; der Stand nach TR-T8 (1075329807, 20.577) bleibt als Präfix gültig (Test unten). Der
  // CS-T8-Eintrag vor dem Merge (3739524259, 19.501) ist verworfen - diesen Stand hat nie ein Kind gesehen.
  // ★ TR-T9 (09.10.2026, nach CS-T8 gemergt): Türkisch Erwachsene Ende hängt 379 Bausteine an (20.894 ⇒ 21.273), am
  // gemergten Stand gemessen; der Stand nach CS-T8 (710268540, 20.894) bleibt als Präfix gültig (Test unten). Der
  // TR-T9-Eintrag vor dem Merge (2281323442, 20.284) ist verworfen - diesen Stand hat nie ein Kind gesehen.
  // ★ CS-T9 (09.10.2026, nach TR-T9 gemergt): Tschechisch Erwachsene Ende hängt 314 Bausteine an (21.273 ⇒ 21.587), am
  // gemergten Stand gemessen; der Stand nach TR-T9 (57181038, 21.273) bleibt als Präfix gültig (Test unten). Der
  // CS-T9-Eintrag vor dem Merge (2901769079, 20.526) ist verworfen - diesen Stand hat nie ein Kind gesehen.
  // ★ K-BG (29.10.2026): Bulgarisch Charge 1 hängt 206 Bausteine an (21587 ⇒ 21793); der Stand davor bleibt als Präfix gültig.
  // ★ K-EL (29.10.2026): Griechisch Charge 1 hängt 211 Bausteine an (21793 ⇒ 22004); der Stand davor bleibt als Präfix gültig.
  // ★ K-HU (29.10.2026): Ungarisch Charge 1 hängt 210 Bausteine an (22004 ⇒ 22214); der Stand davor bleibt als Präfix gültig.
  // ★ K-NL (29.10.2026): Niederländisch Charge 1 hängt 207 Bausteine an (22214 ⇒ 22421); der Stand davor bleibt als Präfix gültig.
  // ★ K-PT (29.10.2026): Portugiesisch (Portugal) Charge 1 hängt 206 Bausteine an (22421 ⇒ 22627); der Stand davor bleibt als Präfix gültig.
  // ★ K-BR (29.10.2026): Portugiesisch (Brasilien) Charge 1 hängt 185 Bausteine an (22627 ⇒ 22812); der Stand davor bleibt als Präfix gültig.
  // ★ K-RO (29.10.2026): Rumänisch Charge 1 hängt 208 Bausteine an (22812 ⇒ 23020); der Stand davor bleibt als Präfix gültig.
  // ★ K-SV (29.10.2026): Schwedisch Charge 1 hängt 210 Bausteine an (23020 ⇒ 23230); der Stand davor bleibt als Präfix gültig.
  // ★ K-UK (29.10.2026): Ukrainisch Charge 1 hängt 213 Bausteine an (23230 ⇒ 23443); der Stand davor bleibt als Präfix gültig.
  version: 1860093771,
  count: 23443,
  korpus: { de: [2482, "1ek7wdv"], en: [3280, "wbs3xd"], fr: [3078, "4vzfmb"], es: [2583, "1c9enff"] },
  serien: [573, "705k3c", "17jgesy"],
  lexikon: { de: "u0wq3q", en: "1n6xcli", fr: "ofbfa5", es: "16ygx99" },
  lexikonGroesse: { de: 8180, en: 6678, fr: 9058, es: 9163, beide: 14446 },
  herkunft: "1k7ljdn",
  items: ["1qk002e", "qqwftv", "jf2qel", "15rwet4"],
  // ★ Punkt 1 „vier Reste" (28.09.2026): fr und es neu - nur der servierte
  // Text von 4 (fr) bzw. 3 (es) Zeilen, deren gestrichenes " ein Leerzeichen
  // vor Komma/Punkt liess („… malade , écrit" ⇒ „… malade, écrit"); Ledger-
  // Index und Reihenfolge gleich (vorher „13kbqa7", „1l2n3fu").
  entries: ["deka1", "8ij0re", "1w7fc6t", "qwgari"],
} as const;

let vorher: Map<Lang, SprachDaten> | null = null;
afterEach(() => {
  if (vorher) _sprachpaketeWiederEinsetzen(vorher);
  vorher = null;
  fehlZugriffeLeeren();
});

describe("alle Pakete geladen: derselbe Inhalt wie vor dem Umbau", () => {
  it("Korpus je Sprache - Länge und Inhalt (samt Reihenfolge)", () => {
    const jetzt = { de: CORPUS, en: CORPUS_EN, fr: CORPUS_FR, es: CORPUS_ES };
    for (const l of SPRACHEN) expect([jetzt[l].length, h(jetzt[l])], l).toEqual(VORHER.korpus[l]);
    // Dieselbe Weiche für die Übungsformen (vorher eine eigene Tabelle).
    expect(SPRACHEN.map((l) => h(korpusQuelle(l)))).toEqual(SPRACHEN.map((l) => VORHER.korpus[l][1]));
  });

  it("Serien - Anzahl, Inhalt und Reihenfolge der Slugs", () => {
    // ★ IT-S Kinder (03.10.2026): die ersten italienischen Serien (`SERIEN_IT`, in `SERIEN_FOLGE` nach „es") - der
    // Golden-Wert von VOR dem Umbau gilt, wie beim Lexikon, für die vier Sprachen von damals (de, en, fr, es); die
    // italienischen prüft `tastenflow-serien-it-kids-1.test.ts`.
    const vierSprachen = SERIEN.filter((s) => (SPRACHEN as readonly string[]).includes(s.lang ?? "de"));
    expect([vierSprachen.length, h(vierSprachen), h(vierSprachen.map((s) => s.slug))]).toEqual(VORHER.serien);
  });

  it("Lexikon - jedes Fach in derselben Reihenfolge (Buchstabensalat zieht daraus)", () => {
    expect(Object.fromEntries(SPRACHEN.map((l) => [l, h(lexikonWoerter(l))]))).toEqual(VORHER.lexikon);
    // ★ F8-it (02.10.2026): das Lexikon hat ein fünftes Fach (`it`) - der Golden-Wert von VOR dem Umbau (28.09.) gilt für
    // die vier Sprachen, die es damals gab: de, en, fr, es und den gemeinsamen Topf. Das italienische Fach prüft
    // `tastenflow-it-lexikon.test.ts`.
    // ★ F8-pl (03.10.2026): dasselbe für das polnische Fach (`tastenflow-pl-lexikon.test.ts`).
    // ★ F8-tr (03.10.2026): dasselbe für das sechste Fach (`tr`) - `tastenflow-tr-lexikon.test.ts`.
    // ★ F8-cs (03.10.2026): dasselbe für das tschechische Fach (`tastenflow-cs-lexikon.test.ts`).
    const { it: _italienisch, pl: _polnisch, tr: _tuerkisch, cs: _tschechisch, ...vierSprachen } = lexikonGroesse();
    expect(vierSprachen).toEqual(VORHER.lexikonGroesse);
  });

  it("Quellen & Dank - die Liste von vorher (Serien + Korpus de/en) bleibt dieselbe", () => {
    // ★ 28.09.2026 (Johannes): „Quellen & Dank" nennt jetzt auch die Herkunft
    // der Korpus-Zeilen fr und es (fehlte bis dahin ganz). Der Golden-Wert von
    // vorher gilt darum für genau die alte Auswahl: alle Serien + Korpus de/en.
    const schluessel = (x: { quelle: string; lizenz: string; autor?: string }) => `${x.quelle}|${x.lizenz}|${x.autor ?? ""}`;
    const alt = new Map<string, unknown>();
    for (const s of SERIEN) if (s.herkunft) { const k = schluessel(s.herkunft); if (!alt.has(k)) alt.set(k, s.herkunft); }
    for (const it of [...korpusFuer("de"), ...korpusFuer("en")]) if (it.herkunft) { const k = schluessel(it.herkunft); if (!alt.has(k)) alt.set(k, it.herkunft); }
    const eigen = (x: { lizenz: string }) => /eigenes werk|selbst/i.test(x.lizenz);
    const altListe = [...alt.values()].sort((a: any, b: any) => (eigen(a) !== eigen(b) ? (eigen(a) ? 1 : -1) : a.quelle.localeCompare(b.quelle, "de")));
    expect(h(altListe)).toBe(VORHER.herkunft);
    // Und die neue Liste enthält jeden alten Eintrag.
    const neu = new Set(collectHerkunft().map(schluessel));
    for (const k of alt.keys()) expect(neu.has(k), k).toBe(true);
  });

  it("was der Generator bekommt (corpusItemsFor / corpusEntriesFor samt Ledger-Index)", () => {
    expect(
      SPRACHEN.map((l) =>
        h(
          corpusItemsFor({
            lang: l,
            stufe: "kids",
            allowed: new Set("fjdkslaöeirtnhouc".split("")),
            lernweg: l,
          } as never),
        ),
      ),
    ).toEqual(VORHER.items);
    expect(
      SPRACHEN.map((l) =>
        h(
          corpusEntriesFor({
            lang: l,
            stufe: "erwachsen",
            allowed: new Set("abcdefghijklmnopqrstuvwxyzäöüßéèàçñ.,".split("")),
            lernweg: l,
          } as never),
        ),
      ),
    ).toEqual(VORHER.entries);
  });
});

describe("★★★★★ das Ledger hängt an keinem Paket", () => {
  it("Manifest-Version und -Grösse wie vorher", () => {
    expect(corpusManifestVersion()).toBe(VORHER.version);
    expect(corpusManifestCount()).toBe(VORHER.count);
  });

  it.each([
    ["kein Paket", [] as Lang[]],
    ["Weg es (es + en)", ["es", "en"] as Lang[]],
    ["Weg fr (fr + en)", ["fr", "en"] as Lang[]],
    ["Weg en (nur en)", ["en"] as Lang[]],
  ])("%s geladen: das Ledger eines Kindes bleibt gültig", (_name, geladen) => {
    vorher = _sprachpaketeVergessen(SPRACHEN.filter((l) => !geladen.includes(l)));
    expect(corpusManifestVersion()).toBe(VORHER.version);
    // Ein Kind, das mit dem vollen Bestand gespeichert hat …
    expect(seenLedgerValid(VORHER.version, VORHER.count)).toBe(true);
    // … und eines, das vor der letzten Charge gespeichert hat (Präfix).
    expect(seenLedgerValid(undefined, undefined)).toBe(false);
    // ★ IT-T1 (03.10.2026): ein Ledger mit dem Stand VOR der italienischen Charge (gemessen am 28.09.) bleibt gültig.
    expect(seenLedgerValid(3305236381, 11893)).toBe(true);
    expect(seenLedgerValid(3305236381, 11892)).toBe(false);
    // ★ IT-T3 (03.10.2026): ein Ledger mit dem Stand nach IT-T1 (vor der Erwachsenen-Charge) bleibt gültig.
    expect(seenLedgerValid(490993357, 12049)).toBe(true);
    expect(seenLedgerValid(490993357, 12048)).toBe(false);
    // ★ IT-T2 (03.10.2026): ein Ledger mit dem Stand nach IT-T3 (vor der Jugend-Charge) bleibt gültig.
    expect(seenLedgerValid(429351553, 12220)).toBe(true);
    expect(seenLedgerValid(429351553, 12219)).toBe(false);
    // ★ IT-T5 (03.10.2026): ein Ledger mit dem Stand nach IT-T2 (vor der Jugend-Mitte-Charge) bleibt gültig.
    expect(seenLedgerValid(2446273395, 12365)).toBe(true);
    expect(seenLedgerValid(2446273395, 12364)).toBe(false);
    // ★ IT-T4 (03.10.2026): ein Ledger mit dem Stand nach IT-T5 (vor der Kinder-Mitte-Charge) bleibt gültig.
    expect(seenLedgerValid(3174500558, 12655)).toBe(true);
    expect(seenLedgerValid(3174500558, 12654)).toBe(false);
    // ★ IT-T6 (03.10.2026): ein Ledger mit dem Stand nach IT-T4 (vor der Erwachsenen-Mitte-Charge) bleibt gültig.
    expect(seenLedgerValid(2799814693, 12989)).toBe(true);
    expect(seenLedgerValid(2799814693, 12988)).toBe(false);
    // ★ IT-T9 (03.10.2026): ein Ledger mit dem Stand nach IT-T6 (vor der Erwachsenen-Ende-Charge) bleibt gültig.
    expect(seenLedgerValid(882667999, 13332)).toBe(true);
    expect(seenLedgerValid(882667999, 13331)).toBe(false);
    // ★ IT-T8 (03.10.2026): ein Ledger mit dem Stand nach IT-T9 (vor der Jugend-Ende-Charge) bleibt gültig.
    expect(seenLedgerValid(3700612393, 13740)).toBe(true);
    expect(seenLedgerValid(3700612393, 13739)).toBe(false);
    // ★ IT-T7 (03.10.2026): ein Ledger mit dem Stand nach IT-T8 (vor der Kinder-Ende-Charge) bleibt gültig.
    expect(seenLedgerValid(3974775406, 14097)).toBe(true);
    expect(seenLedgerValid(3974775406, 14096)).toBe(false);
    // ★ PL-T1 (03.10.2026): ein Ledger mit dem Stand nach IT-T7 (vor der ersten polnischen Charge) bleibt gültig.
    expect(seenLedgerValid(2300770861, 14504)).toBe(true);
    expect(seenLedgerValid(2300770861, 14503)).toBe(false);
    // ★ TR-T1 (03.10.2026): ein Ledger mit dem Stand nach PL-T1 (vor der ersten türkischen Charge) bleibt gültig.
    expect(seenLedgerValid(3913235790, 14668)).toBe(true);
    expect(seenLedgerValid(3913235790, 14667)).toBe(false);
    // ★ CS-T1 (03.10.2026): ein Ledger mit dem Stand nach TR-T1 (vor der ersten tschechischen Charge) bleibt gültig.
    expect(seenLedgerValid(3388808358, 14834)).toBe(true);
    expect(seenLedgerValid(3388808358, 14833)).toBe(false);
    // ★ PL-T2 (03.10.2026): ein Ledger mit dem Stand nach CS-T1 (vor der polnischen Jugend-Charge) bleibt gültig.
    expect(seenLedgerValid(4242405402, 14962)).toBe(true);
    expect(seenLedgerValid(4242405402, 14961)).toBe(false);
    // ★ PL-T3 (03.10.2026): ein Ledger mit dem Stand nach PL-T2 (vor der polnischen Erwachsenen-Charge) bleibt gültig.
    expect(seenLedgerValid(1015649984, 15113)).toBe(true);
    expect(seenLedgerValid(1015649984, 15112)).toBe(false);
    // ★ PL-T4 (03.10.2026): ein Ledger mit dem Stand nach PL-T3 (vor der polnischen Kinder-Mitte-Charge) bleibt gültig.
    expect(seenLedgerValid(1115356890, 15280)).toBe(true);
    expect(seenLedgerValid(1115356890, 15279)).toBe(false);
    // ★ PL-T5 (03.10.2026): ein Ledger mit dem Stand nach PL-T4 (vor der polnischen Jugend-Mitte-Charge) bleibt gültig.
    expect(seenLedgerValid(2867500111, 15606)).toBe(true);
    expect(seenLedgerValid(2867500111, 15605)).toBe(false);
    // ★ TR-T2 (03.10.2026): ein Ledger mit dem Stand nach PL-T5 (vor der türkischen Jugend-Charge) bleibt gültig.
    expect(seenLedgerValid(1513647633, 15932)).toBe(true);
    expect(seenLedgerValid(1513647633, 15931)).toBe(false);
    // ★ CS-T2 (03.10.2026): ein Ledger mit dem Stand nach TR-T2 (vor der tschechischen Jugend-Charge) bleibt gültig.
    expect(seenLedgerValid(1119121654, 16072)).toBe(true);
    expect(seenLedgerValid(1119121654, 16071)).toBe(false);
    // ★ TR-T3 (03.10.2026): ein Ledger mit dem Stand nach CS-T2 (vor der türkischen Erwachsenen-Charge) bleibt gültig.
    expect(seenLedgerValid(4207183703, 16147)).toBe(true);
    expect(seenLedgerValid(4207183703, 16146)).toBe(false);
    // ★ PL-T6 (03.10.2026): ein Ledger mit dem Stand nach TR-T3 (vor der polnischen Erwachsenen-Mitte-Charge) bleibt gültig.
    expect(seenLedgerValid(423619073, 16311)).toBe(true);
    expect(seenLedgerValid(423619073, 16310)).toBe(false);
    // ★ PL-T7 (09.10.2026): ein Ledger mit dem Stand nach PL-T6 (vor der polnischen Kinder-Ende-Charge) bleibt gültig.
    expect(seenLedgerValid(2940994965, 16641)).toBe(true);
    expect(seenLedgerValid(2940994965, 16640)).toBe(false);
    // ★ TR-T4 (09.10.2026): ein Ledger mit dem Stand nach PL-T7 (vor der türkischen Kinder-Mitte-Charge) bleibt gültig.
    expect(seenLedgerValid(589641179, 17024)).toBe(true);
    expect(seenLedgerValid(589641179, 17023)).toBe(false);
    // ★ CS-T4 (09.10.2026): ein Ledger mit dem Stand nach TR-T4 (vor der tschechischen Kinder-Mitte-Charge) bleibt gültig.
    expect(seenLedgerValid(2896656137, 17315)).toBe(true);
    expect(seenLedgerValid(2896656137, 17314)).toBe(false);
    // ★ CS-T3 (09.10.2026): ein Ledger mit dem Stand nach CS-T4 (vor der tschechischen Erwachsenen-Charge) bleibt gültig.
    expect(seenLedgerValid(3896360000, 17570)).toBe(true);
    expect(seenLedgerValid(3896360000, 17569)).toBe(false);
    // ★ TR-T5 (09.10.2026): ein Ledger mit dem Stand nach CS-T3 (vor der türkischen Jugend-Mitte-Charge) bleibt gültig.
    expect(seenLedgerValid(65329905, 17655)).toBe(true);
    expect(seenLedgerValid(65329905, 17654)).toBe(false);
    // ★ PL-T8 (09.10.2026): ein Ledger mit dem Stand nach TR-T5 (vor der polnischen Jugend-Ende-Charge) bleibt gültig.
    expect(seenLedgerValid(797961439, 17969)).toBe(true);
    expect(seenLedgerValid(797961439, 17968)).toBe(false);
    // ★ CS-T5 (09.10.2026): ein Ledger mit dem Stand nach PL-T8 (vor der tschechischen Jugend-Mitte-Charge) bleibt gültig.
    expect(seenLedgerValid(2246894526, 18347)).toBe(true);
    expect(seenLedgerValid(2246894526, 18346)).toBe(false);
    // ★ CS-T6 (09.10.2026): ein Ledger mit dem Stand nach CS-T5 (vor der tschechischen Erwachsenen-Mitte-Charge) bleibt gültig.
    expect(seenLedgerValid(2615690415, 18601)).toBe(true);
    expect(seenLedgerValid(2615690415, 18600)).toBe(false);
    // ★ TR-T6 (09.10.2026): ein Ledger mit dem Stand nach CS-T6 (vor der türkischen Erwachsenen-Mitte-Charge) bleibt gültig.
    expect(seenLedgerValid(475408812, 18853)).toBe(true);
    expect(seenLedgerValid(475408812, 18852)).toBe(false);
    // ★ PL-T9 (09.10.2026): ein Ledger mit dem Stand nach TR-T6 (vor der polnischen Erwachsenen-Ende-Charge) bleibt gültig.
    expect(seenLedgerValid(2904599418, 19184)).toBe(true);
    expect(seenLedgerValid(2904599418, 19183)).toBe(false);
    // ★ TR-T7 (09.10.2026): ein Ledger mit dem Stand nach PL-T9 (vor der türkischen Kinder-Ende-Charge) bleibt gültig.
    expect(seenLedgerValid(520115715, 19550)).toBe(true);
    expect(seenLedgerValid(520115715, 19549)).toBe(false);
    // ★ CS-T7 (09.10.2026): ein Ledger mit dem Stand nach TR-T7 (vor der tschechischen Kinder-Ende-Charge) bleibt gültig.
    expect(seenLedgerValid(601135720, 19905)).toBe(true);
    expect(seenLedgerValid(601135720, 19904)).toBe(false);
    // ★ TR-T8 (09.10.2026): ein Ledger mit dem Stand nach CS-T7 (vor der türkischen Jugend-Ende-Charge) bleibt gültig.
    expect(seenLedgerValid(3887686039, 20212)).toBe(true);
    expect(seenLedgerValid(3887686039, 20211)).toBe(false);
    // ★ CS-T8 (09.10.2026): ein Ledger mit dem Stand nach TR-T8 (vor der tschechischen Jugend-Ende-Charge) bleibt gültig.
    expect(seenLedgerValid(1075329807, 20577)).toBe(true);
    expect(seenLedgerValid(1075329807, 20576)).toBe(false);
    // ★ TR-T9 (09.10.2026): ein Ledger mit dem Stand nach CS-T8 (vor der türkischen Erwachsenen-Ende-Charge) bleibt gültig.
    expect(seenLedgerValid(710268540, 20894)).toBe(true);
    expect(seenLedgerValid(710268540, 20893)).toBe(false);
    // ★ CS-T9 (09.10.2026): ein Ledger mit dem Stand nach TR-T9 (vor der tschechischen Erwachsenen-Ende-Charge) bleibt gültig.
    expect(seenLedgerValid(57181038, 21273)).toBe(true);
    expect(seenLedgerValid(57181038, 21272)).toBe(false);
    // ★ K-BG (29.10.2026): ein Ledger mit dem Stand nach CS-T9 (vor der bulgarischen Charge 1) bleibt gültig.
    expect(seenLedgerValid(2850823654, 21587)).toBe(true);
    expect(seenLedgerValid(2850823654, 21586)).toBe(false);
    // ★ K-EL (29.10.2026): ein Ledger mit dem Stand nach K-BG (vor der griechischen Charge 1) bleibt gültig.
    expect(seenLedgerValid(993985668, 21793)).toBe(true);
    expect(seenLedgerValid(993985668, 21792)).toBe(false);
    // ★ K-HU (29.10.2026): ein Ledger mit dem Stand nach K-EL (vor der ungarischen Charge 1) bleibt gültig.
    expect(seenLedgerValid(2466893209, 22004)).toBe(true);
    expect(seenLedgerValid(2466893209, 22003)).toBe(false);
    // ★ K-NL (29.10.2026): ein Ledger mit dem Stand nach K-HU (vor der niederländischen Charge 1) bleibt gültig.
    expect(seenLedgerValid(119604226, 22214)).toBe(true);
    expect(seenLedgerValid(119604226, 22213)).toBe(false);
    // ★ K-PT (29.10.2026): ein Ledger mit dem Stand nach K-NL (vor der portugiesischen Charge 1 (Portugal)) bleibt gültig.
    expect(seenLedgerValid(1882414474, 22421)).toBe(true);
    expect(seenLedgerValid(1882414474, 22420)).toBe(false);
    // ★ K-BR (29.10.2026): ein Ledger mit dem Stand nach K-PT (vor der brasilianischen Charge 1) bleibt gültig.
    expect(seenLedgerValid(507342096, 22627)).toBe(true);
    expect(seenLedgerValid(507342096, 22626)).toBe(false);
    // ★ K-RO (29.10.2026): ein Ledger mit dem Stand nach K-BR (vor der rumänischen Charge 1) bleibt gültig.
    expect(seenLedgerValid(4245385550, 22812)).toBe(true);
    expect(seenLedgerValid(4245385550, 22811)).toBe(false);
    // ★ K-SV (29.10.2026): ein Ledger mit dem Stand nach K-RO (vor der schwedischen Charge 1) bleibt gültig.
    expect(seenLedgerValid(1647809373, 23020)).toBe(true);
    expect(seenLedgerValid(1647809373, 23019)).toBe(false);
    // ★ K-UK (29.10.2026): ein Ledger mit dem Stand nach K-SV (vor der ukrainischen Charge 1) bleibt gültig.
    expect(seenLedgerValid(407111953, 23230)).toBe(true);
    expect(seenLedgerValid(407111953, 23229)).toBe(false);
  });
});

/*
 * ★★★ GEGENPROBE zum Ledger: Warum die Version aus dem ANKER kommen muss.
 * Solange der Anker vollständig ist, ergäbe auch ein Manifest über die
 * geladenen Korpora dieselbe Version (der Anker legt alle Plätze fest, die
 * Korpora hängen nur Unbekanntes an). Fehlt dem Anker aber eine Zeile - genau
 * der Zustand zwischen einer Text-Charge und ihrem Anker-Lauf -, hinge die
 * Version davon ab, welche Pakete ein Kind gerade hat. Nachgestellt: dieselbe
 * Rechnung wie vor dem Umbau, einmal mit allen, einmal mit zwei Paketen.
 */
describe("★★★ Gegenprobe: ein Manifest über die GELADENEN Korpora wäre abhängig vom Weg", async () => {
  const { buildManifest, bausteinId } = await import("@/lib/typing/ledger");
  const { KORPUS_ANKER } = await import("@/lib/typing/corpusAnker");

  it("Anker ohne die letzte spanische Zeile: alt je Weg verschieden, neu gleich", () => {
    const esIds = new Set(CORPUS_ES.map((it) => bausteinId(it.kind, it.text)));
    const letzteEs = [...KORPUS_ANKER].reverse().find((id) => esIds.has(id));
    expect(letzteEs, "der Anker kennt spanische Zeilen").toBeTruthy();
    const unvollstaendig = KORPUS_ANKER.filter((id) => id !== letzteEs);
    // Die Rechnung VOR dem Umbau: Anker + alle geladenen Korpora.
    const alt = (korpora: readonly (readonly { kind: string; text: string }[])[]) =>
      buildManifest(korpora.flat() as never, unvollstaendig).version;
    const alleWege = alt([CORPUS, CORPUS_EN, CORPUS_FR, CORPUS_ES]);
    const wegDe = alt([CORPUS, CORPUS_EN]);
    expect(wegDe).not.toBe(alleWege); // ⇒ ein Kind auf Weg de verlöre sein Ledger
    // Seit dem Umbau rechnet `corpusManifest` gar nicht mehr über Korpora
    // (`manifestFor([])`) - was geladen ist, kann die Version nicht berühren;
    // das zeigt der Block darüber an vier Wegen.
  });
});

describe("Wächter misst etwas", () => {
  it("vergessene Pakete sind wirklich leer (sonst bewiese der Ledger-Test nichts)", () => {
    vorher = _sprachpaketeVergessen(["de", "fr"]);
    expect(CORPUS.length).toBe(0);
    expect(CORPUS_FR.length).toBe(0);
    expect(CORPUS_EN.length).toBe(VORHER.korpus.en[0]);
    expect(SERIEN.some((s) => s.lang === "fr")).toBe(false);
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });
});
