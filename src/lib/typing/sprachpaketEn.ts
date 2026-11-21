/**
 * ★★★ DAS SPRACHPAKET „en" (Englisch) - alle Tastenflow-Texte dieser Sprache,
 * die erst geladen werden, wenn ein Kind sie braucht (28.09.2026).
 *
 * Geladen wird es ausschliesslich über `sprachpakete.ts` (per `import()`); es
 * ist ein DATENBLATT: Es importiert nur Datendateien und Typen - sonst bekäme
 * es bei jeder Code-Änderung einen neuen Namen (`scripts/buendel-aufteilung.ts`).
 * Welche Pakete ein Weg braucht: `sprachPaketeFuer` in `sprachpaketBedarf.ts`.
 *
 * ⚠️ Die Reihenfolge von `korpus` ist die Reihenfolge des Zusammenführens in
 *    `corpus.ts` (`mergeCorpus`, der erste Eintrag gewinnt) - Neues HINTEN
 *    anhängen und den Korpus-Anker neu erzeugen
 *    (`npx tsx scripts/erzeuge-korpus-anker.mts`).
 * ⚠️ Eine neue Serien-Liste gehört ZUSÄTZLICH in `SERIEN_FOLGE` (serien.ts) -
 *    der Wächter `tests/sprachpakete-inhalt.test.ts` meldet, wenn sie fehlt.
 */
import type { SprachDaten } from "./sprachpakete";
import { HAND_CORPUS_EN } from "./corpusEn";
import { GENERATED_CORPUS_EN_2 } from "./corpusData2En";
import { EN_ERSTLESER_CORPUS } from "./corpusEnErstleser";
import { EN_T2_CORPUS } from "./corpusEnT2";
import { EN_T2B_CORPUS } from "./corpusEnT2b";
import { EN_T2C_CORPUS } from "./corpusEnT2c";
import { EN_T2D_CORPUS } from "./corpusEnT2d";
import { EN_T2E_CORPUS } from "./corpusEnT2e";
import { EN_T3_CORPUS } from "./corpusEnT3";
import { EN_T3B_CORPUS } from "./corpusEnT3b";
import { EN_KULTUR_CORPUS } from "./corpusEnKultur";
import { EN_WITZ_CORPUS } from "./corpusEnWitz";
import { EN_WIEDERKEHR_CORPUS } from "./corpusEnWiederkehr";
import { EN_ERSTLESER2_CORPUS } from "./corpusEnErstleser2";
import { EN_HUMOR_CORPUS } from "./corpusEnHumor";
import { EN_KORREKTUR_CORPUS } from "./corpusEnKorrekturen";
import { EN_KORREKTUR2_CORPUS } from "./corpusEnKorrekturen2";
import { EN_KORREKTUR3_CORPUS } from "./corpusEnKorrekturen3";
import { DREI_STUFEN_EN_CORPUS } from "./corpusDreiStufenEn";
import { ZIFFERN_EN_CORPUS } from "./corpusZiffernEn";
import { EN_I4_WELT_CORPUS } from "./corpusEnI4Welt";
import { EN_I4_NATUR_CORPUS } from "./corpusEnI4Natur";
import { CORPUS_EN_WEG_FRUEH } from "./corpusEnWegFrueh";
import { SERIEN_EN } from "./serienEn";
import { SERIEN_EN2 } from "./serienEn2";
import { SERIEN_EN_FRUEH } from "./serienEnFrueh";
import { SERIEN_EN_KIDS_ERSATZ } from "./serienEnKidsErsatz";
import { SERIEN_O_FOLGE_EN } from "./serienOFolgeEn";
import { SERIEN_EN_SPROSSE16 } from "./serienEnSprosse16";
import { SERIEN_EN_I4_SPROSSE17_ERWACHSEN } from "./serienEnI4Sprosse17Erwachsen";
import { SERIEN_EN_I4_SPROSSE17_KINDER } from "./serienEnI4Sprosse17Kinder";
import { SERIEN_EN_I4_SPROSSE20 } from "./serienEnI4Sprosse20";
import { SERIEN_EN_I4_SPROSSE22 } from "./serienEnI4Sprosse22";
import { SERIEN_EN_I4_SPROSSE26 } from "./serienEnI4Sprosse26";
import { SERIEN_EN_I4_VOLL } from "./serienEnI4Voll";
import { SERIEN_EN_BALDWIN } from "./serienEnBaldwin";
import { SERIEN_EN_WISSEN_KIDS } from "./serienEnWissenKids";
import { SERIEN_EN_WISSEN_TEENS } from "./serienEnWissenTeens";
import { SERIEN_EN_WISSEN_ERWACHSEN } from "./serienEnWissenErwachsen";
import { SERIEN_EN_KIDS_ASB } from "./serienEnKidsAsb";
import { SERIEN_EN_ERWACHSEN_E1 } from "./serienEnErwachsenE1";
import { SERIEN_EN_WEG_FRUEH } from "./serienEnWegFrueh";
import { NACHTRAG_EN } from "./lexikonNachtragEn";

export const SPRACHPAKET_EN: SprachDaten = {
  korpus: [
  ...HAND_CORPUS_EN,
  ...GENERATED_CORPUS_EN_2,
  // Englische Textwelt-Nachlagen (§9) — append-only HINTEN anhaengen, damit die
  // bestehenden Baustein-Indizes (No-Repeat-Ledger) stabil bleiben.
  // Tier-1-Erstleser: schliesst die haerteste fruehe Luecke (servierbar <=T1 war 2).
  ...EN_ERSTLESER_CORPUS,
  // T2-Masse I: Kueche, Familie, Schule, Markt, Tiere, Gefuehle.
  ...EN_T2_CORPUS,
  // T2-Masse II: Wetter, Wald, Kueste + eigener Block fuer erwachsene Lernende.
  ...EN_T2B_CORPUS,
  // T2-Masse III: Garten, Sport, Musik, Hafen, Abend (Kinderstufen).
  ...EN_T2C_CORPUS,
  // T2-Masse IV: Stadt, Jahreslauf, Ausflug, Wetter, Kochen.
  ...EN_T2D_CORPUS,
  // T2-Masse V: Maerchen, Weltall, Mithelfen, Missgeschicke, Mut, Geduld.
  ...EN_T2E_CORPUS,
  // T3: volles Alphabet (laedt p q v x y z) + geprueft Fakten/Wissen.
  ...EN_T3_CORPUS,
  // T3 II: Schule, Sport, Tiere, Technik, Reisen (Kinder-/Jugendstufen).
  ...EN_T3B_CORPUS,
  // Gemeinfreies englisches Kulturgut (Sprichwoerter, Aesop, Reime, Zitate).
  ...EN_KULTUR_CORPUS,
  // Witz-Vielfalt gegen die "What do you call"-Monokultur.
  ...EN_WITZ_CORPUS,
  // TN-E7 (append-only): englische Wiederkehr-Bausteine der Themenstränge —
  // Fragen in anderen Worten, Vertiefungen, Belohnungs-Witze.
  ...EN_WIEDERKEHR_CORPUS,
  // TN-E8 (append-only): englische Erstleser-Zeilen auf EFL-Grundwortschatz —
  // Ersatz für das seltene Lyrik-Vokabular der frühen Ebene.
  ...EN_ERSTLESER2_CORPUS,
  // TN-E9 (append-only): englischer Humor jenseits der Schablone.
  ...EN_HUMOR_CORPUS,
  // TN-E12 (append-only): korrigierte englische Fassungen.
  ...EN_KORREKTUR_CORPUS,
  // TN-E13 (append-only): ohne Apostroph + britische Schreibungen.
  ...EN_KORREKTUR2_CORPUS,
  // R1 14.08. (append-only): englische WORTLAUT-Korrekturen der Rechtschreib-
  // Charge (Prüfbericht 14.08. §2, Funde E1-E9 und E16) — Genitiv apostrophfrei
  // umgestellt, britische Schreibungen, zwei gebrochene Wortspiele repariert.
  ...EN_KORREKTUR3_CORPUS,
  // S3 15.08. (append-only): Ersatz fuer die zwoelf Zeilen, die beim Retag auf
  // die drei Stufen an `kids` zurueckgegangen sind (Kinderreime +
  // Zubettgeh-Szenen). 16 selbst verfasste T2-Zeilen fuer `teens`.
  ...DREI_STUFEN_EN_CORPUS,
  // I3 21.08. (append-only): das englische Ziffern- und Sonderzeichen-Portfolio.
  // Ohne € § ° (auf US-/UK-Tastaturen nicht vorhanden) und ohne Apostroph.
  // Siehe corpusZiffernEn.ts.
  ...ZIFFERN_EN_CORPUS,
  // I4 28.08. (append-only): englische Fakten- und Wissens-Zeilen aus Technik,
  // Verkehr, Handwerk, Musik, Sprache, Sport und Geschichte. Jede Zeile an ZWEI
  // unabhängigen Quellen geprüft, beide mit Abrufdatum in `herkunft.fundstelle`.
  // Anlass: der englische Korpus hatte 125 `fakt`-Zeilen gegen 344 deutsche.
  ...EN_I4_WELT_CORPUS,
  // I4 28.08. (append-only), zweite Korpus-Hälfte: Natur, Tiere, Pflanzen,
  // Wetter und Klima, Erde und Meer, Weltraum, menschlicher Körper. Ebenfalls
  // an zwei unabhängigen Quellen je Zeile geprüft. 71 der 75 Zeilen liegen auf
  // Tier 2 - genau dort, wo das englische Regal am dünnsten war.
  ...EN_I4_NATUR_CORPUS,
  // E4 (Bauplan §6.2 Punkt 2, §10 Zeile E4, noch LEER): der frühe Vorrat NUR
  // für Lernweg „en" (Sprossen 3-16) - jede Zeile trägt `nurWeg: "en"`, siehe
  // corpusEnWegFrueh.ts.
  ...CORPUS_EN_WEG_FRUEH,
  ],
  serien: {
    SERIEN_EN,
    SERIEN_EN2,
    SERIEN_EN_FRUEH,
    SERIEN_EN_KIDS_ERSATZ,
    SERIEN_O_FOLGE_EN,
    SERIEN_EN_SPROSSE16,
    SERIEN_EN_I4_SPROSSE17_ERWACHSEN,
    SERIEN_EN_I4_SPROSSE17_KINDER,
    SERIEN_EN_I4_SPROSSE20,
    SERIEN_EN_I4_SPROSSE22,
    SERIEN_EN_I4_SPROSSE26,
    SERIEN_EN_I4_VOLL,
    SERIEN_EN_BALDWIN,
    SERIEN_EN_WISSEN_KIDS,
    SERIEN_EN_WISSEN_TEENS,
    SERIEN_EN_WISSEN_ERWACHSEN,
    SERIEN_EN_KIDS_ASB,
    SERIEN_EN_ERWACHSEN_E1,
    SERIEN_EN_WEG_FRUEH,
  },
  lexikon: [NACHTRAG_EN],
};
