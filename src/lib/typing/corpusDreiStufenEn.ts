/**
 * ERSATZ-ZEILEN der Charge S3 (15.08.2026) — englisch, nur für `teens`.
 *
 * Das englische Gegenstück zu `corpusDreiStufen.ts`. Beim Retag auf die drei
 * Stufen sind zwölf englische Zeilen an `kids` zurückgegangen: die zehn
 * Kinderreime („Twinkle, twinkle, little star", „Humpty Dumpty sat on a wall")
 * und zwei Zubettgeh-Szenen. Kinderreime sind gemeinfreies Kulturgut und
 * bleiben deshalb im Bestand — aber ihre Tonlage ist unmissverständlich die des
 * Vorschulalters; ein Fünfzehnjähriger soll sie nicht als Übungszeile bekommen.
 *
 * Damit dabei niemand ärmer wird, stehen hier 16 selbst verfasste Zeilen, alle
 * **Tier 2** (`scripts/_s3encheck.mts` gegen `minTierFor` und CORPUS_EN:
 * 0 Probleme, MAX-TIER=2). Der englische T2-Satz ist eng — kein p, q, v, x, y,
 * z, also weder „you" noch „have" noch „help"; die Zeilen sind daran entlang
 * geschrieben, nicht dagegen.
 *
 * Ton: derselbe wie im deutschen Gegenstück — Arbeit, Messen, Nachfragen,
 * Quellen prüfen; britische Schreibung (der BrE-Lint läuft mit).
 * Append-only ans Ende von CORPUS_EN (Regel 1 der Übergabe 27.07.).
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

/** Nur die mittlere Stufe (11-15). */
const NUR_TEENS: Stufe[] = ["teens"];

/**
 * Alle drei Stufen — für die vier Tier-1-Zeilen unten. Sie ersetzen den
 * Lyrik-Wortschatz, den `corpusEnErstleser.ts` bei den Jüngsten abgegeben hat
 * („Nettles are near.", „Neil finds a flint.", „Salt is fine and dear." —
 * TN-E8-Befund: für EFL-Lernende im ersten Jahr kein Anfängertext). Bis S1 lag
 * dieser Schutz an der Stufe `a`; die gibt es nicht mehr, also trägt ihn jetzt
 * das Etikett selbst.
 */
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];

export const DREI_STUFEN_EN_CORPUS: CorpusItem[] = [
  { text: "The first note is the hardest one to write.", kind: "satz", stufen: NUR_TEENS },
  { text: "We learn more from one honest mistake than from ten wins.", kind: "satz", stufen: NUR_TEENS },
  { text: "A method is a road that others can walk on too.", kind: "satz", stufen: NUR_TEENS },
  { text: "She takes the tool she can hold, and then she starts.", kind: "satz", stufen: NUR_TEENS },
  { text: "A short answer can still be an honest one.", kind: "satz", stufen: NUR_TEENS },
  { text: "He counts the class twice at the school door.", kind: "satz", stufen: NUR_TEENS },
  { text: "The best notes are the ones written at once.", kind: "satz", stufen: NUR_TEENS },
  { text: "A clean measure comes before a clean cut.", kind: "satz", stufen: NUR_TEENS },
  { text: "One more hour of work is not one more idea.", kind: "satz", stufen: NUR_TEENS },
  { text: "Ask what the machine cannot do, and then do that.", kind: "satz", stufen: NUR_TEENS },
  { text: "The hardest thing in the room is the first line.", kind: "satz", stufen: NUR_TEENS },
  { text: "We check the source, and then we tell the tale.", kind: "satz", stufen: NUR_TEENS },
  { text: "The last minute holds more than the first hour.", kind: "satz", stufen: NUR_TEENS },
  { text: "It matters who wrote it, not how loud it sounds.", kind: "satz", stufen: NUR_TEENS },
  { text: "He reads the note twice and then he understands it.", kind: "satz", stufen: NUR_TEENS },
  { text: "A tool that is not clean makes the work harder.", kind: "satz", stufen: NUR_TEENS },

  // Tier 1 (nur f j d k s l a ö e n i r t): Ersatz auf EFL-Grundwortschatz für
  // die drei abgegebenen Lyrik-Zeilen. Geprüft mit `scripts/_s3encheck.mts`
  // gegen minTierFor und CORPUS_EN: 0 Probleme, MAX-TIER=1.
  { text: "Nina reads a list.", kind: "satz", stufen: ALLE_DREI },
  { text: "Ida sits at a desk.", kind: "satz", stufen: ALLE_DREI },
  { text: "Alan finds a red kite.", kind: "satz", stufen: ALLE_DREI },
  { text: "It is late and Nina is tired.", kind: "satz", stufen: ALLE_DREI },
];
