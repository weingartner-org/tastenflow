/**
 * ENGLISCHE Erstleser-Bausteine (Textwelt-Nachlage §9, englische Seite) — SELBST
 * VERFASSTE, bewusst wortschatz-begrenzte kurze Sätze, die schon mit den ganz
 * frühen Tasten (Tier 1) auskommen. Sie schließen die auf der englischen Seite
 * offene Lücke: servierbar ≤T1 war 2 (Stufe a: 0!), ≤T2 nur 158 — früh also fast
 * leer, deshalb Wortsalat und Wiederholungen.
 *
 * Rechte (§10): eigenes Werk (selbst verfasst). Echte englische Quellentexte
 * respektieren die Buchstaben-Freischaltung nicht — auf T1 sind sie schlicht
 * unmöglich (siehe unten), die frühe Ebene wird darum getextet. KEINE Übersetzung
 * der deutschen Bausteine: eigene englische Szenen, englische Namen, englischer
 * Satzrhythmus.
 *
 * Tier-1-Zeichensatz (aus tiers.ts, kumulativ): erlaubte Buchstaben nur
 *   a d e f i j k l n r s t (+ ö, im Englischen ungenutzt)
 * KEIN h o u c g m b w · KEIN p q v x y z. Für das Englische heißt das: es gibt
 * KEIN „the", „he", „she", „we", „you", „to", „of", „on", „is not". Möglich sind
 * nur „a"/„an" als Artikel — daher der knappe, fast lyrische Ton dieser Charge.
 * Satzzeichen sind weglassbar und heben den Tier NICHT.
 *
 * Apostrophe werden bewusst vermieden: `fitText` streicht sie unterhalb von T5
 * ersatzlos („do not" bleibt korrekt, „don't" würde zu „dont" verstümmelt).
 *
 * Append-only: wird in corpus.ts HINTEN an CORPUS_EN gehängt → bestehende
 * Baustein-Indizes (No-Repeat-Ledger) bleiben stabil. Test
 * `typing-english-erstleser` erzwingt die T1-Grenze und die Manifest-Präsenz.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

/** Kinder-/Jugendstufen (Szenen mit Namen). */
const KIDS_TEENS: Stufe[] = ["kids", "teens"];
// TN-E8: Zeilen mit seltenem Vokabular („nettles", „flint", „dear"=teuer)
// verlassen die Anfänger-Stufe a — für Fremdsprachen-Lernende im ersten Jahr
// sind sie kein Anfängertext (Prüfbericht 27.07.). Für b/c bleiben sie: dort
// sind sie hübsch. Kein Eintrag wird gelöscht ⇒ Ledger-Indizes stabil.
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
/**
 * S3: Zeilen mit seltenem Lyrik-Wortschatz (nettles, flint, dear im alten Sinn)
 * - fuer die juengste Stufe genau der falsche EFL-Grundwortschatz (TN-E8-Befund).
 */
const TEENS_ERW_SELTEN: Stufe[] = ["teens", "erwachsen"];
/** Altersneutrale Natur-/Alltagsbilder — für JEDE Stufe passend. */
/** Altersneutrale Tier-1-Zeilen (Natur, Wetter, Dinge) — auch für Erwachsene. */
const EN_T1_NEUTRAL: CorpusItem[] = [
  { text: "A leaf falls.", kind: "satz", stufen: ALLE_DREI },
  { text: "Stars are distant.", kind: "satz", stufen: ALLE_DREI },
  { text: "Trees stand tall and dark.", kind: "satz", stufen: ALLE_DREI },
  { text: "A snail is silent.", kind: "satz", stufen: ALLE_DREI },
  { text: "A field is flat and still.", kind: "satz", stufen: ALLE_DREI },
  { text: "A train is late.", kind: "satz", stufen: ALLE_DREI },
  { text: "Seeds land in fine sand.", kind: "satz", stufen: ALLE_DREI },
  { text: "A deer stands still.", kind: "satz", stufen: ALLE_DREI },
  { text: "Nettles are near.", kind: "satz", stufen: TEENS_ERW_SELTEN },
  { text: "A raft drifts.", kind: "satz", stufen: ALLE_DREI },
  { text: "A fire is red.", kind: "satz", stufen: ALLE_DREI },
  { text: "Salt is fine and dear.", kind: "satz", stufen: TEENS_ERW_SELTEN },
  { text: "A trail ends at a lake.", kind: "satz", stufen: ALLE_DREI },
  { text: "Snails trail in fine sand.", kind: "satz", stufen: ALLE_DREI },
  { text: "A star falls at last.", kind: "satz", stufen: ALLE_DREI },
  { text: "A kettle rattles.", kind: "satz", stufen: ALLE_DREI },
  { text: "A ladder leans at a tree.", kind: "satz", stufen: ALLE_DREI },
  { text: "A tide slides in.", kind: "satz", stufen: ALLE_DREI },
  { text: "Ferns are silent and still.", kind: "satz", stufen: ALLE_DREI },
  { text: "A tent stands in sand.", kind: "satz", stufen: ALLE_DREI },
  { text: "Kites drift.", kind: "satz", stufen: ALLE_DREI },
  { text: "Rain falls and falls.", kind: "satz", stufen: ALLE_DREI },
  { text: "A nest is at a tall tree.", kind: "satz", stufen: ALLE_DREI },
  { text: "A silent field, a still lake.", kind: "satz", stufen: ALLE_DREI },
  { text: "Seeds set in dark, fine land.", kind: "satz", stufen: ALLE_DREI },
  { text: "Rain rattles at a tin lantern.", kind: "satz", stufen: ALLE_DREI },
  { text: "A little snail slides.", kind: "satz", stufen: ALLE_DREI },
  { text: "A red kite darts.", kind: "satz", stufen: ALLE_DREI },
  { text: "A snail eats a red leaf.", kind: "satz", stufen: ALLE_DREI },
  { text: "Ants lift a leaf.", kind: "satz", stufen: ALLE_DREI },
  { text: "Ants trail in a line.", kind: "satz", stufen: ALLE_DREI },
  { text: "A deer eats a leaf.", kind: "satz", stufen: ALLE_DREI },
];

/** Tier-1-Szenen mit englischen Namen (Kinder-/Jugendstufen). */
const EN_T1_SZENEN: CorpusItem[] = [
  { text: "Anna sits still and listens.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ida feeds a deer.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Finn finds a nest.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Elsa reads a letter.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Sara sails a raft.", kind: "satz", stufen: ALLE_DREI },
  { text: "Lena skates fast.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Karl lifts a jar.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nina rests near a fire.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Daniel is tired.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Tina likes ferns.", kind: "satz", stufen: ALLE_DREI },
  { text: "Alfred fills a jar.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Stella listens at a red tent.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Kate ties silk.", kind: "satz", stufen: ALLE_DREI },
  { text: "Neil finds a flint.", kind: "satz", stufen: TEENS_ERW_SELTEN },
  { text: "Ida rides a sled.", kind: "satz", stufen: ALLE_DREI },
  { text: "Ellie sits near a still lake.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Delia knits and knits.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nils reads a list.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Silas is late.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Rain is late, said Tina.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Is Anna tired?", kind: "satz", stufen: KIDS_TEENS },
  { text: "Karl and Lena rest.", kind: "satz", stufen: KIDS_TEENS },
  { text: "A raft trails a red sail.", kind: "satz", stufen: ALLE_DREI },
  { text: "Anna feels safe.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ida sails and Finn skates.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Stars fade, Elsa said.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Tina finds a tired deer.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Alfred tilts a lantern.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Kate is alert and fast.", kind: "satz", stufen: KIDS_TEENS },
];

export const EN_ERSTLESER_CORPUS: CorpusItem[] = [
  ...EN_T1_NEUTRAL,
  ...EN_T1_SZENEN,
];
