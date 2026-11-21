/**
 * ★★★★★ MEINE TEXTE - die Textablage EINER Lehrkraft, für Klassenübungen
 * (E8, 19.09.2026, „Meine Klassen"-Umbau).
 *
 * Johannes' Auftrag wörtlich (Entwurf-Dokument §7a): *„ich würde gerne den
 * Lehrkräften die Möglichkeit geben, Dateien zu speichern und aus diesen dann
 * auszuwählen, die Dateien gehören aber zu den Konten und nicht zur Klasse.
 * Für die Klassenübungen."* Und in der Nacht: *„vergiss ... den Pool an
 * Dateien je Lehrer nicht"*. Dazu (§7b, Frage 7): *„‚Meine Texte' nur im
 * eigenen Konto, kein Teilen."*
 *
 * ── Was hier steht und was NICHT ────────────────────────────────────────────
 * Diese Datei kennt nur die REINE FORM eines Ablage-Eintrags und die
 * Kurzfassung für die Liste (Titel, Datum, erste Worte) - genau wie
 * `eigenerText.ts` bei den Klassen-Zeilen. Speichern/Lesen/Löschen laufen
 * über `typingBackend()` (`tt_meine_texte`, `pocketbase/setup.mjs`); das
 * eigentliche STARTEN aus der Ablage (die Klassen-Kopie anlegen) bleibt beim
 * jeweiligen Kasten - genau wie ein frischer Upload, nur ohne Datei-Lesen.
 *
 * ── Warum eine EIGENE Sammlung und nicht `tt_eigene_texte` mit leerem
 *    `classCode` ────────────────────────────────────────────────────────────
 * `tt_eigene_texte` ist FÜR DIE KLASSE lesbar (jedes Kind der Klasse über
 * `classCode`, siehe `setup.mjs`). Ein Pool-Eintrag darf dagegen NIE ein Kind
 * erreichen - nicht einmal versehentlich über eine vergessene Regel. Zwei
 * Sammlungen mit zwei eigenen, engeren Regeln sind hier die einfachere und
 * sicherere Lösung als eine Sammlung mit einer Regel, die zwei sehr
 * verschiedene Sichtbarkeiten unterscheiden müsste.
 */

/** Ein Eintrag der Ablage, wie ihn die Lehrkraft in der Liste sieht. */
export interface MeinTextEintrag {
  id: string;
  dateiname: string;
  erstelltMs: number;
  /** Die ersten Worte des Textes - reicht, um ihn wiederzuerkennen. */
  ersteWorte: string;
}

/** Nach so vielen Zeichen wird die Vorschau abgeschnitten (mit „…“). */
export const MEINE_TEXTE_VORSCHAU_LAENGE = 60;

/** Die ersten Worte eines Textes, für die Liste „Meine Texte". */
export function ersteWorte(
  zeilen: readonly string[],
  laenge: number = MEINE_TEXTE_VORSCHAU_LAENGE,
): string {
  const text = zeilen.join(" ").replace(/\s+/g, " ").trim();
  if (text.length <= laenge) return text;
  return text.slice(0, laenge).trimEnd() + "…";
}
