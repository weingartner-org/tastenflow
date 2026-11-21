/**
 * ★★★ DAS SPRACHPAKET „de" (Deutsch) - alle Tastenflow-Texte dieser Sprache,
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
import { GENERATED_CORPUS } from "./corpusData";
import { HAND_CORPUS } from "./corpusExtras";
import { GENERATED_CORPUS_2 } from "./corpusData2";
import { ERSTLESER_CORPUS } from "./corpusErstleser";
import { VIELFALT_CORPUS } from "./corpusVielfalt";
import { FAKTEN_CORPUS } from "./corpusFakten";
import { ZAHLEN_CORPUS } from "./corpusZahlen";
import { ERWACHSEN_CORPUS } from "./corpusErwachsen";
import { ERSTLESER2_CORPUS } from "./corpusErstleser2";
import { ERSTLESER3_CORPUS } from "./corpusErstleser3";
import { VIELFALT2_CORPUS } from "./corpusVielfalt2";
import { T2MASSE_CORPUS } from "./corpusT2Masse";
import { T2MASSE2_CORPUS } from "./corpusT2Masse2";
import { T3MASSE_CORPUS } from "./corpusT3Masse";
import { T3MASSE2_CORPUS } from "./corpusT3Masse2";
import { T2MASSE3_CORPUS } from "./corpusT2Masse3";
import { WIEDERKEHR_CORPUS } from "./corpusWiederkehr";
import { JUGEND_CORPUS } from "./corpusJugend";
import { ERWACHSEN2_CORPUS } from "./corpusErwachsen2";
import { HUMOR_CORPUS } from "./corpusHumor";
import { AUFGERAEUMT_CORPUS } from "./corpusAufgeraeumt";
import { KORREKTUR_CORPUS } from "./corpusKorrekturen";
import { VIELFALT_KULTUREN_CORPUS } from "./corpusVielfaltKulturen";
import { LEHRGANG_FRUEH_CORPUS } from "./corpusLehrgangFrueh";
import { NACHPRUEFUNG_CORPUS } from "./corpusNachpruefung";
import { JUGEND2_CORPUS } from "./corpusJugend2";
import { MITTEL_CORPUS } from "./corpusMittel";
import { KORREKTUR2_CORPUS } from "./corpusKorrekturen2";
import { DREI_STUFEN_CORPUS } from "./corpusDreiStufen";
import { ZIFFERN_CORPUS } from "./corpusZiffern";
import { SERIEN_JUGEND_ERWACHSEN } from "./serienJugendErwachsen";
import { SERIEN_FRUEH } from "./serienFrueh";
import { SERIEN_ERWACHSEN } from "./serienErwachsen";
import { SERIEN_JUGEND2 } from "./serienJugend2";
import { SERIEN_MITTEL } from "./serienMittel";
import { SERIEN_LEHRGANG_FRUEH } from "./serienLehrgangFrueh";
import { SERIEN_TEENS_FRUEH } from "./serienTeensFrueh";
import { SERIEN_ERWACHSEN_FRUEH } from "./serienErwachsenFrueh";
import { SERIEN_O_FOLGE } from "./serienOFolge";
import { SERIEN_KIDS_ZWEITE_RUNDE } from "./serienKidsZweiteRunde";
import { SERIEN_ERWACHSEN_RUNDE2 } from "./serienErwachsenRunde2";
import { SERIEN_DE_WISSEN_KIDS } from "./serienDeWissenKids";
import { SERIEN_DE_WISSEN_TEENS } from "./serienDeWissenTeens";
import { SERIEN_DE_WISSEN_ERWACHSEN } from "./serienDeWissenErwachsen";
import { SERIEN_DE_GESCHICHTEN } from "./serienDeGeschichten";
import { SERIEN_DE_ERWACHSEN_G3 } from "./serienDeErwachsenG3";
import { NACHTRAG_DE } from "./lexikonNachtragDe";

export const SPRACHPAKET_DE: SprachDaten = {
  korpus: [
  ...GENERATED_CORPUS,
  ...HAND_CORPUS,
  ...GENERATED_CORPUS_2,
  // TW-E6 (append-only, HINTEN anhängen → bestehende Ledger-Indizes bleiben stabil):
  // selbst verfasste Erstleser-Bausteine T1/T2, die die frühe Lücke füllen.
  ...ERSTLESER_CORPUS,
  // TW-E7 (append-only): mehr T2-Vielfalt (Alltags-Sätze + gemeinfreie Sprichwörter).
  ...VIELFALT_CORPUS,
  // TW-E8 (append-only): kinderleichte, unstrittig wahre Elementar-Fakten.
  ...FAKTEN_CORPUS,
  // TW-E9 (append-only): lebensnahe Zahlen-/Sonderzeichen-Kontexte (T5).
  ...ZAHLEN_CORPUS,
  // TW-E13 (append-only): sachlich-humorvolle Texte für erwachsene Lernende.
  ...ERWACHSEN_CORPUS,
  // Nachlage (§9, wiederholbar): weitere frische T2-Erstleser-Szenen.
  ...ERSTLESER2_CORPUS,
  // Nachlage 3 (§9): reine Tier-1-Sätze — schließt die härteste frühe Lücke (≤T1).
  ...ERSTLESER3_CORPUS,
  // Vielfalt-Nachlage 2 (§9): 48 T2/T3-Alltags-/Natur-/Tier-Szenen.
  ...VIELFALT2_CORPUS,
  // T2-Masse-Nachlage (§9): 46 reine T2-Alltags-Sätze für den mittleren Lernstand.
  ...T2MASSE_CORPUS,
  // T2-Masse-Nachlage 2 (§9): 46 weitere reine T2-Sätze (Schule/Stadt/Abend).
  ...T2MASSE2_CORPUS,
  // T3-Masse-Nachlage (§9): 46 T3-Sätze mit vollem Wortschatz (Berufe/Natur/Wetter).
  ...T3MASSE_CORPUS,
  // T3-Masse-Nachlage 2 (§9): 46 weitere T3-Sätze (Reisen/Musik/Sport/Fantasie).
  ...T3MASSE2_CORPUS,
  // T2-Masse-Nachlage 3 (§9): 46 weitere reine T2-Sätze (Geburtstag/Haustiere/Herbst).
  ...T2MASSE3_CORPUS,
  // TN-E3 (append-only): Wiederkehr-Bausteine der Themenstränge —
  // Erinnerungs-Fragen in anderen Worten, Vertiefungen, Belohnungs-Witze.
  ...WIEDERKEHR_CORPUS,
  // TN-E4 (append-only): Groß-Charge für Stufe c (13–15) — Weltraum, Technik,
  // Körper/Sport, Musik, Erfindungen; die bis dahin dünnste Zelle des Korpus.
  ...JUGEND_CORPUS,
  // TN-E6 (append-only): Einzelzeilen für erwachsene Lernende — Ersatz für
  // die zurückgestuften Kinderrätsel (Prüfbericht 27.07.).
  ...ERWACHSEN2_CORPUS,
  // TN-E9 (append-only): Humor jenseits der Frage-Antwort-Schablone —
  // Dialoge, Einzeiler, absurde Miniaturen, Sprachspiele in Aussageform.
  ...HUMOR_CORPUS,
  // TN-E10 (append-only): Ersatz für die aufgeräumten Zeilen — dieselben Fakten
  // mit variiertem Einstieg statt dreizehnmal „Schon gewusst?".
  ...AUFGERAEUMT_CORPUS,
  // TN-E12 (append-only): korrigierte Fassungen der restlichen Prüfbericht-Funde.
  ...KORREKTUR_CORPUS,
  // TN-E13 (append-only): Namens- und Rollen-Vielfalt (Wunsch Johannes 27.07.).
  ...VIELFALT_KULTUREN_CORPUS,
  // 27.07. (append-only): frühe Sätze für den LEHRGANG — dessen Tastenreihenfolge
  // (n erst in Lektion 16) ließ die ersten acht Lektionen ganz ohne echten Text;
  // enthält zugleich den Alters-Retag der neutralen Frühsätze auf c/erwachsen.
  ...LEHRGANG_FRUEH_CORPUS,
  // Nachprüfung 28.07. (append-only): korrigierte Sorten + die letzten offenen
  // Einzelbefunde des Prüfberichts vom 27.07.
  ...NACHPRUEFUNG_CORPUS,
  // AG-E5 29.07. (append-only): eigener Stoff für 13–15 mit Schwerpunkt auf den
  // FRÜHEN Tiers — dort hatte die Stufe bis dahin ausschließlich Zeilen, die
  // auch für 7–9 freigegeben sind. Weiche 4: erst schreiben, dann aussortieren.
  ...JUGEND2_CORPUS,
  // 30.07.: eigener Stoff fuer 10-12 (append-only). Deckt den gemessenen
  // Fehlbetrag, BEVOR die 70 jung gerahmten Doppel-Freigaben abgesenkt werden
  // (Weiche 4: erst schreiben, dann aussortieren).
  ...MITTEL_CORPUS,
  // R1 14.08. (append-only): die beiden deutschen WORTLAUT-Korrekturen der
  // Rechtschreib-Charge (Prüfbericht 14.08. §2, Funde D5 und D14). Alles andere
  // dieser Charge war eine reine Groß-/Klein- oder Satzzeichen-Korrektur und
  // steht darum in-place an alter Stelle.
  ...KORREKTUR2_CORPUS,
  // S3 15.08. (append-only): Ersatz für die 27 Zeilen, die beim Retag auf die
  // drei Stufen an `kids` zurückgegangen sind (Kinderbett- und Sandkasten-
  // Szenen). 32 selbst verfasste T2-Zeilen für `teens` — geschrieben BEVOR
  // aussortiert wurde (Weiche 4). Siehe corpusDreiStufen.ts.
  ...DREI_STUFEN_CORPUS,
  // I3 21.08. (append-only): das Ziffern- und Sonderzeichen-Portfolio — T5-Zeilen
  // mit 20-35 % Ziffern-Anteil (Oversampling), kaufmännisch, mathematisch,
  // Geografie/Natur und Alltag digital. Siehe corpusZiffern.ts.
  ...ZIFFERN_CORPUS,
  ],
  serien: {
    SERIEN_JUGEND_ERWACHSEN,
    SERIEN_FRUEH,
    SERIEN_ERWACHSEN,
    SERIEN_JUGEND2,
    SERIEN_MITTEL,
    SERIEN_LEHRGANG_FRUEH,
    SERIEN_TEENS_FRUEH,
    SERIEN_ERWACHSEN_FRUEH,
    SERIEN_O_FOLGE,
    SERIEN_KIDS_ZWEITE_RUNDE,
    SERIEN_ERWACHSEN_RUNDE2,
    SERIEN_DE_WISSEN_KIDS,
    SERIEN_DE_WISSEN_TEENS,
    SERIEN_DE_WISSEN_ERWACHSEN,
    SERIEN_DE_GESCHICHTEN,
    SERIEN_DE_ERWACHSEN_G3,
  },
  lexikon: [NACHTRAG_DE],
};
