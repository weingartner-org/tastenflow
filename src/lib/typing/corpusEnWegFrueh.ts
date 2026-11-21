/**
 * ★★★★★ KORPUS NUR FÜR LERNWEG „EN" - FRÜHE SPROSSEN (E4, noch LEER).
 *
 * Bauplan: `BAUPLAN-2026-09-24-ENGLISCHER-LEHRGANG.md` §6.2 Punkt 2, §10
 * Zeile E4. Grundlage: `BEFUND-2026-09-24-ENGLISCHE-INHALTE-JE-SPROSSE.md`
 * §6 - die Sprossen 3 bis 16 des Weges „en" haben HEUTE keine einzige
 * eigene Korpuszeile (Korpus 0 bis Sprosse 13, danach nur, weil dieselben
 * Buchstaben zufällig auch auf Weg „de" freigeschaltet sind).
 *
 * Diese Datei ist die ABLAGE für genau diesen frühen Vorrat - angelegt LEER
 * (E4a, reine Verdrahtung), damit Sonnet-Agenten (Bauplan §6.2 Punkt 6:
 * „Sonnet schreibt, Opus nimmt ab") sie in Chargen füllen können, ohne zuerst
 * das Gerüst bauen zu müssen.
 *
 * ═══ WIE MAN EINE ZEILE HIER PRÜFT, BEVOR SIE COMMITTET WIRD ═══════════════
 *
 *  1. **Passt sie zur Sprosse?** `fitsKeys(text, allowedForTier(tier, "en"))`
 *     aus `tiers.ts`, oder bequemer über das Messwerkzeug:
 *     `npx tsx scripts/messe-englische-inhalte.mts` (schreibt den Befund neu -
 *     die "en"-Spalte muss NACH dem Einfügen wachsen, nie schrumpfen).
 *  2. **Keine Zeile doppelt** - weder im Korpus noch in einer Serie noch in
 *     einer Tippchallenge-Probe: `npx tsx scripts/pruefe-schreibproben.mts`
 *     (der Wächter liest JEDE Datei `corpus*.ts`/`serien*.ts` im Ordner über
 *     den Dateinamen - diese Datei ist darüber automatisch erfasst, siehe
 *     Bauplan §5.2 Punkt 1/§11 Falle 7).
 *  3. **Nach jeder Charge den Ledger-Anker nachziehen:**
 *     `npx tsx scripts/erzeuge-korpus-anker.mts` - IM SELBEN COMMIT wie die
 *     neuen Zeilen (CLAUDE.md, Bauplan §2.5). Neue Zeilen NUR ANHÄNGEN, nie
 *     mittendrin einfügen - sonst verlieren Kinder ihr Ledger.
 *  4. `npx vitest run tests/tastenflow-lernweg-inhalt-de-unveraendert.test.ts`
 *     muss GRÜN bleiben - er beweist, dass Weg „de" von dieser Datei nichts
 *     merkt (jede Zeile hier trägt `nurWeg: "en"`, siehe unten).
 *
 * ═══ REGELN FÜR DEN INHALT ══════════════════════════════════════════════════
 *
 *  · **JEDE Zeile trägt `nurWeg: "en"`** (Pflicht, nicht optional wie sonst) -
 *    das ist der ganze Zweck dieser Datei: Inhalt, der NUR auf Weg „en" Sinn
 *    ergibt (eigene Reihenfolge, eigene Sprossen) und auf Weg „de" falsch
 *    oder irreführend wäre. Ein Eintrag OHNE `nurWeg` gehört stattdessen in
 *    eine gewöhnliche `corpusEn*.ts`-Datei (dort gilt er auf BEIDEN Wegen).
 *  · **Kein `lang`-Feld** - anders als bei Serien gibt es das bei `CorpusItem`
 *    nicht; die Sprache folgt daraus, dass diese Zeilen in `CORPUS_EN` landen
 *    (siehe Verdrahtung in `corpus.ts`, Abschnitt `CORPUS_EN`).
 *  · **Nur Buchstaben, die an der gemeinten Sprosse des Weges „en" schon frei
 *    sind** (`LERNWEGE.en` aus `lernweg.ts`, Bauplan §3.3a):
 *      `f j d k s l a ;` (Grundreihe, 8) · `e i n r t h o` (+7, bei 15) ·
 *      `⇧` (16) · `u y w m` (+4, bei 20) · `c g p b` (+4, bei 23) ·
 *      `v x q z` (+4, bei 26) · Satzzeichen `. , ' ? ! - : "` · Ziffern ·
 *      Sonderzeichen. Das `;` ist ein Fingeranker OHNE Buchstabenwert - es
 *      taucht in echten Wörtern nicht auf.
 *  · **Britisches Englisch, aber wo möglich ein Wort, das auf Britisch UND
 *    Amerikanisch gleich geschrieben wird** (Bauplan §1.1 D4/§8.2) - vermeide
 *    also unnötig `colour/color`, `centre/center`, `-ise/-ize`,
 *    `travelled/traveled`, `grey/gray`, `mum/mom`, `maths/math`; wo ein Wort
 *    zwingend eine Fassung braucht, schreibe die BRITISCHE (die amerikanische
 *    Überlagerung in E9 übernimmt die Umschrift automatisch).
 *  · **Nichts Negatives über ein Kind** (`feedback_nie_gegen_das_kind`) - auch
 *    nicht beruhigend gemeint.
 *  · **Person zuerst**, wo eine Behinderung oder Eigenschaft vorkommt („a
 *    child with blindness", nie „a blind child").
 *  · **Nur der einfache Bindestrich `-`**, nie – oder — (Braillezeile).
 *  · **Keine Zeile darf eine bestehende Korpus-/Serien-/Tippchallenge-Zeile
 *    wiederholen** (Prüfung siehe oben, Punkt 2).
 *  · **`minTier`**: gegen die ENGLISCHEN Stufen setzen, nicht die deutschen -
 *    `minTierFor(text, "en")` aus `tiers.ts` (T0 Grundreihe·8, T1 +eintho·15,
 *    T2 +uywm cgpb·23, T3 alle 26, T4 Satzzeichen, T5 Ziffern/Sonderzeichen).
 *    Weggelassen ⇒ wird aus dem Text abgeleitet, wo das vorkommt (siehe
 *    `CorpusItem.minTier`-Kommentar in `corpus.ts`) - für Sprossen 3-16 lieber
 *    ausdrücklich setzen, damit ein Tippfehler im Text nicht still die
 *    Einstufung verschiebt.
 *  · **Altersstufe** über `stufen: Stufe[]` (`"kids" | "teens" | "erwachsen"`,
 *    aus `account.ts`) - wie bei jedem anderen Korpus-Eintrag, mehrere Stufen
 *    sind erlaubt.
 *  · **`herkunft`** nur bei ÜBERNOMMENEM Material (CC/gemeinfrei) - für die
 *    frühen Sprossen ist das nicht zu erwarten (§6.2 Punkt 2: „hier wird
 *    ersetzt"), selbst verfasste Zeilen brauchen kein `herkunft`-Feld.
 *
 * ═══ BEISPIEL (auskommentiert, nichts davon ist ein echter Eintrag) ════════
 *
 *   const EN_WEG_FRUEH_BEISPIEL: CorpusItem[] = [
 *     {
 *       text: "Sal has a flask.",       // nur a d f h k l s (+ Grossschreibung)
 *       kind: "satz",                   // CorpusKind: witz/zungenbrecher/
 *                                        // wortspiel/spruch/sprichwort/fakt/
 *                                        // satz/wissen/rechnung
 *       stufen: ["kids", "teens"],      // Stufe[] aus account.ts
 *       minTier: 0,                     // ausdrücklich gegen LERNWEGE.en (T0)
 *       nurWeg: "en",                   // ★ PFLICHT in dieser Datei
 *     },
 *   ];
 *
 * Append-only: wird in `corpus.ts` HINTEN an `CORPUS_EN` gehängt, damit
 * bestehende Ledger-Indizes stabil bleiben (siehe `corpusManifest.ts`).
 */
import type { CorpusItem } from "./corpus";

import { CORPUS_EN_WEG_FRUEH_KIDS } from "./corpusEnWegFruehKids";
import { CORPUS_EN_WEG_FRUEH_TEENS } from "./corpusEnWegFruehTeens";
import { CORPUS_EN_WEG_FRUEH_ERWACHSEN } from "./corpusEnWegFruehErwachsen";

// E4b: je Altersstufe eine eigene Datei (drei Schreibende gleichzeitig, keine Konflikte).
export const CORPUS_EN_WEG_FRUEH: CorpusItem[] = [
  ...CORPUS_EN_WEG_FRUEH_KIDS,
  ...CORPUS_EN_WEG_FRUEH_TEENS,
  ...CORPUS_EN_WEG_FRUEH_ERWACHSEN,
];
