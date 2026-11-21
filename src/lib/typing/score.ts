/**
 * ★★★ DER SCORE - EINE RECHNUNG FÜR ALLES (§2.1, Umbau 11.09.2026).
 *
 * Der Leistungswert der Tippchallenge (`schreibprobeWertung.ts`, `werte()`)
 * ist schon die gewünschte Wertung: Güte `Z/(Z+5F)` mal Wurzel des Tempos,
 * 0 bis 100. Dieselbe Rechnung wird hier auf die ÜBUNGSDATEN eines Zeitraums
 * angewandt - auf das, was `computePupilStats` aus den Übungs-Ereignissen
 * rechnet (Zeichen, Fehler, ⌀ Tempo).
 *
 * ⚠️ Die Formel wird NICHT kopiert - sie steht ein einziges Mal in
 * `schreibprobeWertung.ts`. Wer sie ändert, ändert den Score der Challenge UND
 * den Score der Übungsdaten zugleich; zwei Fassungen liefen sonst irgendwann
 * auseinander ([[feedback_zwei_stellen_die_voneinander_nichts_wissen]]).
 *
 * Mindestmenge wie bei der Challenge: unter `MIND_ZEICHEN_WERTUNG` (200)
 * Zeichen im Zeitraum gibt es keinen Score - „-", keine Zahl mit
 * Rechenrauschen.
 */
import type { PupilStats } from "./account";
import { werte } from "./schreibprobeWertung";
import type { BedienSprache } from "@/lib/bedienSprache";
import { istGeruestSprache } from "./sprachRegister";
import { KETTEN_NEUN } from "./kettenNeun";

export interface ScoreEingang {
  /** Geschriebene (Soll-)Zeichen im Zeitraum. */
  zeichen: number;
  /** Fehlanschläge im Zeitraum. */
  fehler: number;
  /** ⌀ Anschläge je Minute im Zeitraum. */
  anschlaegeProMin: number;
}

export interface Score {
  /** Der Leistungswert 0..100 - oder `null`, wenn nicht gewertet. */
  wert: number | null;
  /** false = unter `MIND_ZEICHEN_WERTUNG` Zeichen, keine Wertung. */
  gewertet: boolean;
}

/** Score aus Zeichen, Fehlern und Tempo - dieselbe Rechnung wie die Tippchallenge. */
export function scoreAusWerten(e: ScoreEingang): Score {
  const w = werte({
    zeichen: e.zeichen,
    fehler: e.fehler,
    anschlaege: e.anschlaegeProMin,
  });
  return { wert: w.gewertet ? w.wert : null, gewertet: w.gewertet };
}

/**
 * Score aus den Übungsdaten eines Kindes (`computePupilStats`). `chars` und
 * `errors` sind die Soll-Zeichen und Fehlanschläge des ganzen Zeitraums,
 * `avgCpm` das ⌀ Tempo - genau die Grössen, die `werte()` braucht.
 */
export function scoreAusStats(stats: PupilStats): Score {
  return scoreAusWerten({
    zeichen: stats.chars,
    fehler: stats.errors,
    anschlaegeProMin: stats.avgCpm,
  });
}

/**
 * ★★★ Der Score für Kinder erklärt - EIN Satz, der überall gleich lautet
 * (Mouseover „Werte im Überblick", TippenHilfe).
 */
export const SCORE_ERKLAERUNG =
  "Der Score fasst Treffsicherheit und Tempo in einer Zahl von 0 bis 100 " +
  "zusammen; ein Fehlgriff zählt wie 5 Zeichen, doppeltes Tempo zählt nur " +
  "1,4-fach - Genauigkeit schlägt Tempo.";

/**
 * Dieselbe Erklärung, an die Lehrkraft gerichtet (LehrerHilfe, Mouseover) -
 * inhaltlich gleich, ohne Anrede, weil der Satz an keiner Stelle „du" sagt.
 */
export const SCORE_ERKLAERUNG_SIE =
  "Der Score fasst Treffsicherheit und Tempo des Kindes in einer Zahl von " +
  "0 bis 100 zusammen; ein Fehlgriff zählt wie 5 Zeichen, doppeltes Tempo " +
  "zählt nur 1,4-fach - Genauigkeit schlägt Tempo.";

/**
 * ★ Dieselben zwei Erklärungen englisch (EN3, 19.09.2026). Glossar §3.2:
 * Treffsicherheit ⇒ *accuracy*, Tempo ⇒ *speed*, Fehlgriff ⇒ *wrong key*,
 * Score ⇒ *score*. Die Kind-Fassung sagt, was die Zahl über das eigene Tippen
 * aussagt; die Lehrkraft-Fassung spricht über *the pupil* (§3.8). „1,4-fach"
 * ⇒ *1.4 times* (Dezimalpunkt, §1.2).
 */
export const SCORE_ERKLAERUNG_EN =
  "The score puts accuracy and speed together in one number from 0 to 100; " +
  "a wrong key counts as much as 5 characters, and double the speed only " +
  "counts 1.4 times - accuracy beats speed.";

/** Die englische Erklärung für die Lehrkraft. */
export const SCORE_ERKLAERUNG_SIE_EN =
  "The score puts the pupil's accuracy and speed together in one number from " +
  "0 to 100; a wrong key counts as much as 5 characters, and double the speed " +
  "only counts 1.4 times - accuracy beats speed.";

/**
 * ★ E11a-3 (26.09.2026): dieselbe Erklärung französisch, „tu" (Kind).
 * Glossar §9.2: Treffsicherheit ⇒ précision, Fehlgriff ⇒ erreur de frappe
 * (nie *faute*, [[feedback_nie_gegen_das_kind]]), Dezimalkomma wie im
 * Deutschen.
 */
export const SCORE_ERKLAERUNG_FR =
  "Le score réunit ta précision et ta vitesse en un seul nombre de 0 à 100 ; " +
  "une erreur de frappe compte comme 5 caractères, et le double de la " +
  "vitesse ne compte que 1,4 fois plus - la précision l'emporte sur la vitesse.";

/** Die französische Erklärung für die Lehrkraft (Bezug „l'élève", „vous"-Ebene). */
export const SCORE_ERKLAERUNG_VOUS_FR =
  "Le score réunit la précision et la vitesse de l'élève en un seul nombre " +
  "de 0 à 100 ; une erreur de frappe compte comme 5 caractères, et le " +
  "double de la vitesse ne compte que 1,4 fois plus - la précision " +
  "l'emporte sur la vitesse.";

/**
 * ★ ES-O (27.09.2026): dieselbe Erklärung spanisch, tú (Kind). Fehlgriff ⇒
 * error (nie „falta"), Dezimalpunkt (RAE 2010, in Spanien und Amerika gleich).
 */
export const SCORE_ERKLAERUNG_ES =
  "La puntuación combina tu precisión y tu velocidad en un solo número de 0 a 100; " +
  "un error cuenta como 5 caracteres, y el doble de velocidad solo cuenta " +
  "unas 1.4 veces - la precisión gana a la velocidad.";

/** Die spanische Erklärung für die Lehrkraft (Bezug „cada estudiante"). */
export const SCORE_ERKLAERUNG_USTED_ES =
  "La puntuación combina la precisión y la velocidad de cada estudiante en un solo " +
  "número de 0 a 100; un error cuenta como 5 caracteres, y el doble de " +
  "velocidad solo cuenta unas 1.4 veces - la precisión gana a la velocidad.";

/**
 * ★ O-IT (02.10.2026): dieselbe Erklärung italienisch, „tu" (Kind). Score ⇒
 * punteggio, Fehlgriff ⇒ tasto sbagliato, Dezimalkomma (Glossar §2.2, Regel 5).
 */
export const SCORE_ERKLAERUNG_IT =
  "Il punteggio riunisce la tua precisione e la tua velocità in un solo numero da 0 a 100; " +
  "un tasto sbagliato conta come 5 caratteri, e una velocità doppia conta solo " +
  "1,4 volte - la precisione batte la velocità.";

/** Die italienische Erklärung für die Lehrkraft (neutral: „chi scrive", Glossar Regel 2). */
export const SCORE_ERKLAERUNG_IT_INSEGNANTE =
  "Il punteggio riunisce la precisione e la velocità di chi scrive in un solo numero " +
  "da 0 a 100; un tasto sbagliato conta come 5 caratteri, e una velocità doppia " +
  "conta solo 1,4 volte - la precisione batte la velocità.";

/**
 * ★ O-PL (02.10.2026): dieselbe Erklärung polnisch, „ty" (Kind). Score ⇒
 * wynik, Fehlgriff ⇒ pomyłka, Dezimalkomma, „1,4 raza" (Bruchzahl ⇒ Genitiv
 * Einzahl, Glossar §2.10a).
 */
export const SCORE_ERKLAERUNG_PL =
  "Wynik łączy twoją dokładność i tempo w jedną liczbę od 0 do 100; " +
  "jedna pomyłka liczy się jak 5 znaków, a dwa razy szybsze tempo liczy się " +
  "tylko 1,4 raza - dokładność wygrywa z tempem.";

/** Die polnische Erklärung für die Lehrkraft - über das Schreiben, nicht über eine Person (Glossar Regel 2). */
export const SCORE_ERKLAERUNG_PL_NAUCZYCIELE =
  "Wynik łączy dokładność i tempo pisania w jedną liczbę od 0 do 100; " +
  "jedna pomyłka liczy się jak 5 znaków, a dwa razy szybsze tempo liczy się " +
  "tylko 1,4 raza - dokładność wygrywa z tempem.";

/**
 * ★ O-TR (02.10.2026): dieselbe Erklärung türkisch, sen (Kind). Score ⇒ puan,
 * Fehlgriff ⇒ yanlış tuş, Treffsicherheit ⇒ doğruluk, Dezimalkomma (Glossar §2.2, Regel 5).
 */
export const SCORE_ERKLAERUNG_TR =
  "Puan, doğruluğunu ve hızını 0 ile 100 arasında tek bir sayıda birleştirir; " +
  "bir yanlış tuş 5 karakter kadar sayılır, iki kat hız ise yalnızca " +
  "1,4 kat sayılır - doğruluk hızdan daha önemlidir.";

/** Die türkische Erklärung für die Lehrkraft - über "öğrenci", ohne Anrede (Glossar Regel 2). */
export const SCORE_ERKLAERUNG_TR_OGRETMEN =
  "Puan, öğrencinin doğruluğunu ve hızını 0 ile 100 arasında tek bir sayıda " +
  "birleştirir; bir yanlış tuş 5 karakter kadar sayılır, iki kat hız ise " +
  "yalnızca 1,4 kat sayılır - doğruluk hızdan daha önemlidir.";

/**
 * ★ O-CS (03.10.2026): dieselbe Erklärung tschechisch, ty (Kind). Score ⇒
 * skóre, Fehlgriff ⇒ překlep, Treffsicherheit ⇒ přesnost, Tempo ⇒ rychlost,
 * Dezimalkomma, „1,4krát" (Glossar §2.2, Regel 5).
 */
export const SCORE_ERKLAERUNG_CS =
  "Skóre spojuje tvou přesnost a rychlost do jednoho čísla od 0 do 100; " +
  "jeden překlep se počítá jako 5 znaků a dvakrát vyšší rychlost se počítá " +
  "jen 1,4krát - přesnost má přednost před rychlostí.";

/** Die tschechische Erklärung für die Lehrkraft - über das Schreiben, nicht über eine Person (Glossar Regel 2). */
export const SCORE_ERKLAERUNG_CS_VYUCUJICI =
  "Skóre spojuje přesnost a rychlost psaní do jednoho čísla od 0 do 100; " +
  "jeden překlep se počítá jako 5 znaků a dvakrát vyšší rychlost se počítá " +
  "jen 1,4krát - přesnost má přednost před rychlostí.";

/**
 * Die Score-Erklärung je Zielgruppe und Bedienungssprache - ohne Sprache
 * Deutsch, also genau {@link SCORE_ERKLAERUNG} bzw. {@link SCORE_ERKLAERUNG_SIE}.
 */
export function scoreErklaerung(
  anrede: "du" | "Sie",
  sprache: BedienSprache = "de",
): string {
  // ★ O-CS (03.10.2026)
  // ★ O4 (30.10.2026): die neun eigen.
  if (istGeruestSprache(sprache)) return anrede === "Sie" ? KETTEN_NEUN[sprache].scoreLehrkraft : KETTEN_NEUN[sprache].scoreKind;
  if (sprache === "cs") return anrede === "Sie" ? SCORE_ERKLAERUNG_CS_VYUCUJICI : SCORE_ERKLAERUNG_CS;
  // ★ O-TR (02.10.2026)
  if (sprache === "tr") return anrede === "Sie" ? SCORE_ERKLAERUNG_TR_OGRETMEN : SCORE_ERKLAERUNG_TR;
  if (sprache === "pl") return anrede === "Sie" ? SCORE_ERKLAERUNG_PL_NAUCZYCIELE : SCORE_ERKLAERUNG_PL;
  if (sprache === "it") return anrede === "Sie" ? SCORE_ERKLAERUNG_IT_INSEGNANTE : SCORE_ERKLAERUNG_IT;
  if (sprache === "fr") return anrede === "Sie" ? SCORE_ERKLAERUNG_VOUS_FR : SCORE_ERKLAERUNG_FR;
  // ★ ES-O: vorher still Deutsch (Falle 30).
  if (sprache === "es") return anrede === "Sie" ? SCORE_ERKLAERUNG_USTED_ES : SCORE_ERKLAERUNG_ES;
  if (sprache === "en") return anrede === "Sie" ? SCORE_ERKLAERUNG_SIE_EN : SCORE_ERKLAERUNG_EN;
  return anrede === "Sie" ? SCORE_ERKLAERUNG_SIE : SCORE_ERKLAERUNG;
}
