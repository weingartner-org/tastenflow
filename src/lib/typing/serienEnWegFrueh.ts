/**
 * ★★★★★ SERIEN NUR FÜR LERNWEG „EN" - FRÜHE SPROSSEN (E4, noch LEER).
 *
 * Bauplan: `BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md` §6.2 Punkt 2, §10
 * Zeile E4. Grundlage: `BEFUND-2026-09-24-ENGLISCHE-INHALTE-JE-SPROSSE.md`
 * §6 - bis Sprosse 13 hat Weg „en" NULL offene Serien, bei 14 genau eine.
 *
 * Diese Datei ist die ABLAGE für die ersten Serien-Anfänge des Weges „en" -
 * angelegt LEER (E4a, reine Verdrahtung), damit Sonnet-Agenten (Bauplan §6.2
 * Punkt 6: „Sonnet schreibt, Opus nimmt ab") sie in Chargen füllen können.
 *
 * ═══ WIE MAN EINE SERIE HIER PRÜFT, BEVOR SIE COMMITTET WIRD ═══════════════
 *
 *  1. **Form + Tier stimmen:**
 *       import { validateSerie } from "./serie";
 *       const { ok, problems } = validateSerie(MEINE_SERIE, "en");
 *     `ok` muss `true` sein - `problems` nennt sonst genau, was fehlt (Etappen-
 *     länge 12-16 Zeilen, keine leere Zeile, `minTier` deklariert = berechnet).
 *     Weil die Serie `nurWeg: "en"` trägt, rechnet `validateSerie` das Tier
 *     automatisch gegen `LERNWEGE.en` - der zweite Parameter "en" ist trotzdem
 *     Pflicht (kein stiller Rückfall, Bauplan §2.3).
 *  2. **Öffnet sie an der gemeinten Sprosse?**
 *     `npx tsx scripts/messe-englische-inhalte.mts` (schreibt den Befund neu -
 *     die "en"-Serienzahl muss NACH dem Einfügen wachsen, nie schrumpfen).
 *  3. **Keine Zeile doppelt** - weder im Korpus noch in einer anderen Serie
 *     noch in einer Tippchallenge-Probe: `npx tsx scripts/pruefe-schreibproben.mts`
 *     (der Wächter liest JEDE Datei `corpus*.ts`/`serien*.ts` über den
 *     Dateinamen - diese Datei ist darüber automatisch erfasst, Bauplan §5.2
 *     Punkt 1/§11 Falle 7).
 *  4. **Nach jeder Charge den Ledger-Anker nachziehen:**
 *     `npx tsx scripts/erzeuge-korpus-anker.mts` - IM SELBEN COMMIT (CLAUDE.md,
 *     Bauplan §2.5). Neue Serien NUR ANHÄNGEN, nie mittendrin einfügen.
 *  5. `npx vitest run tests/tastenflow-lernweg-inhalt-de-unveraendert.test.ts`
 *     muss GRÜN bleiben - er beweist, dass Weg „de" von dieser Datei nichts
 *     merkt (jede Serie hier trägt `nurWeg: "en"`, siehe unten).
 *
 * ═══ REGELN FÜR DEN INHALT ══════════════════════════════════════════════════
 *
 *  · **JEDE Serie trägt `lang: "en"` UND `nurWeg: "en"`** - `lang` ist Pflicht,
 *    weil `SERIEN` (serien.ts) beide Sprachen in EINEM Array führt (fehlt es,
 *    gilt „de"); `nurWeg` ist der ganze Zweck dieser Datei: eine Geschichte,
 *    die nur auf den frühen Sprossen des Weges „en" Sinn ergibt. Eine Serie
 *    OHNE `nurWeg` gehört stattdessen in eine gewöhnliche `serienEn*.ts`-Datei.
 *  · **Nur Buchstaben, die an der gemeinten Sprosse des Weges „en" schon frei
 *    sind** (`LERNWEGE.en`, Bauplan §3.3a): Grundreihe `f j d k s l a ;` (8) ·
 *    `e i n r t h o` (+7, bei 15) · `⇧` (16) · `u y w m` (+4, bei 20) ·
 *    `c g p b` (+4, bei 23) · `v x q z` (+4, bei 26) · dann Satzzeichen/
 *    Ziffern/Sonderzeichen. Für eine Serie MUSS jede Zeile jeder Etappe passen
 *    - eine einzige zu frühe Taste sperrt die ganze Geschichte
 *    (`serieTypeable`, serien.ts).
 *  · **Britisches Englisch, wo möglich varianten-neutral** (Bauplan §1.1 D4/
 *    §8.2) - siehe `corpusEnWegFrueh.ts` für die Liste der Doppelformen.
 *  · **Nichts Negatives über ein Kind**, **Person zuerst**, **nur der
 *    einfache Bindestrich `-`** - wie überall (CLAUDE.md „Immer").
 *  · **Keine Zeile darf eine bestehende Korpus-/Serien-/Tippchallenge-Zeile
 *    wiederholen** (Prüfung siehe oben, Punkt 3).
 *  · **Etappen:** 12 bis 16 Zeilen (`ETAPPE_MIN_LINES`/`ETAPPE_MAX_LINES` aus
 *    `serie.ts`), jede mit einem Zug zum Weiterlesen (Cliffhanger) - wie jede
 *    andere Serie der Bücherei.
 *  · **`minTier`**: die höchste Stufe, die irgendeine Zeile braucht, GEGEN DIE
 *    ENGLISCHEN Stufen (`computeSerieMinTier(serie, "en")` - wirkt automatisch,
 *    siehe Punkt 1 oben).
 *  · **Altersstufe** über `stufen: Stufe[]` wie gewohnt; **`topic`** ein Tag
 *    für die Bücherei-Anzeige; **`herkunft`** nur bei ÜBERNOMMENEM Material -
 *    für die frühen Sprossen ist eigenes Werk der Normalfall (Bauplan §6.2.2).
 *
 * ═══ BEISPIEL (auskommentiert, nichts davon ist eine echte Serie) ══════════
 *
 *   const EN_WEG_FRUEH_BEISPIEL: Serie = {
 *     slug: "en-weg-frueh-beispiel",     // stabiler Kurzname, nie ändern
 *     titel: "A Flask for Sal",
 *     kind: "geschichte",                // oder "wissen-serie"
 *     lang: "en",                        // ★ PFLICHT in dieser Datei
 *     stufen: ["kids"],                  // Stufe[] aus account.ts
 *     minTier: 0,                        // = computeSerieMinTier(..., "en")
 *     topic: "alltag",
 *     nurWeg: "en",                      // ★ PFLICHT in dieser Datei
 *     herkunft: {
 *       quelle: "Sensorik",
 *       lizenz: "Eigenes Werk (selbst verfasst, englisches Original)",
 *       autor: "Sensorik-Lernplattform",
 *     },
 *     etappen: [
 *       {
 *         lines: [
 *           "Sal has a flask.",          // nur a d f h k l s + Grossschreibung
 *           // … 11 bis 15 weitere Zeilen …
 *         ],
 *       },
 *     ],
 *   };
 *
 * Append-only: wird in `serien.ts` HINTEN an `SERIEN` gehängt, damit
 * bestehende Ledger-Indizes stabil bleiben (siehe `corpusManifest.ts`).
 */
import type { Serie } from "./serie";

import { SERIEN_EN_WEG_FRUEH_KIDS } from "./serienEnWegFruehKids";
import { SERIEN_EN_WEG_FRUEH_TEENS } from "./serienEnWegFruehTeens";
import { SERIEN_EN_WEG_FRUEH_ERWACHSEN } from "./serienEnWegFruehErwachsen";

// E4b: je Altersstufe eine eigene Datei (drei Schreibende gleichzeitig, keine Konflikte).
export const SERIEN_EN_WEG_FRUEH: Serie[] = [
  ...SERIEN_EN_WEG_FRUEH_KIDS,
  ...SERIEN_EN_WEG_FRUEH_TEENS,
  ...SERIEN_EN_WEG_FRUEH_ERWACHSEN,
];
