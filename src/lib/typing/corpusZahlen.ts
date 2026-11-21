/**
 * Zahlen-Charge (Textwelt TW-E9) — lebensnahe Kontexte mit ZIFFERN (Preise,
 * Uhrzeit, Datum, Mengen). Das sind T5-Bausteine (Ziffern = letzte Tastenstufe).
 *
 * WICHTIG (Korpus-Vertrag): Korpus-Daten nutzen NUR den Basis-Zeichensatz
 * (Buchstaben, Ziffern, `,.-?!:;`). Die Rechenzeichen `+ = * / @ % €` liefert der
 * GENERATOR (`charDrillLine`) dynamisch in realistischen Kontexten — sie stehen
 * NICHT in den Daten (Test `typing-corpus`). Diese Charge steuert daher die
 * kuratierten Ziffern-Sätze bei; die Rechen-/Sonderzeichen-Drills bleiben generiert.
 *
 * Selbst formuliert (§10). Zahlen-Fakten (Kalender) sind unstrittig wahr.
 * Append-only an CORPUS (Indizes stabil). `typing-textwelt-zahlen` erzwingt die
 * Ziffern (T5) und den Basis-Zeichensatz.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
/** Lebensnahe Ziffern-Kontexte (T5, Basis-Zeichensatz). */
export const ZAHLEN_CORPUS: CorpusItem[] = [
  // Kalender-/Zeit-Fakten (unstrittig wahr)
  { text: "Eine Woche hat 7 Tage.", kind: "rechnung", stufen: ALLE_DREI },
  { text: "Ein Jahr hat 12 Monate.", kind: "rechnung", stufen: ALLE_DREI },
  { text: "Ein Tag hat 24 Stunden.", kind: "rechnung", stufen: ALLE_DREI },
  { text: "Eine Stunde hat 60 Minuten.", kind: "rechnung", stufen: ALLE_DREI },
  { text: "Eine Minute hat 60 Sekunden.", kind: "rechnung", stufen: ALLE_DREI },
  { text: "Ein Schaltjahr hat 366 Tage.", kind: "rechnung", stufen: ALLE_DREI },
  { text: "Ein Jahr hat 52 Wochen.", kind: "rechnung", stufen: ALLE_DREI },
  // Preise, Uhrzeit, Mengen im Alltag
  { text: "Das Buch kostet 12,50 Euro.", kind: "satz", stufen: ALLE_DREI },
  { text: "Der Bus fährt um 8 Uhr ab.", kind: "satz", stufen: ALLE_DREI },
  { text: "Wir treffen uns um 15:30 Uhr.", kind: "satz", stufen: ALLE_DREI },
  { text: "Die Klasse hat 24 Kinder.", kind: "satz", stufen: ALLE_DREI },
  { text: "Das Paket wiegt 3 Kilo.", kind: "satz", stufen: ALLE_DREI },
  { text: "Draußen sind es heute 18 Grad.", kind: "satz", stufen: ALLE_DREI },
  { text: "Das Rezept braucht 250 Gramm Mehl.", kind: "satz", stufen: ALLE_DREI },
  { text: "Im Angebot gibt es 20 Prozent Rabatt.", kind: "satz", stufen: ALLE_DREI },
  { text: "Zähle laut von 1 bis 10.", kind: "satz", stufen: ALLE_DREI },
  { text: "Der Zug hat 12 Minuten Verspätung.", kind: "satz", stufen: ALLE_DREI },
  { text: "Die Sporthalle ist 20 Meter lang.", kind: "satz", stufen: ALLE_DREI },
];
