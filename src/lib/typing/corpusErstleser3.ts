/**
 * Erstleser-Nachlage 3 (Textwelt, wiederholbare Charge §9) — reine TIER-1-Sätze.
 * Ziel: die im Bestands-Audit (TW-E4) belegte härteste Lücke schließen — servierbar
 * ≤T1 war nur 1 (!). Diese Charge bringt 42 sinnvolle Sätze GENAU auf Tier 1, damit
 * schon nach der oberen Reihe (`e n i r t`) echte Sätze statt Wortsalat kommen.
 *
 * Rechte (§10): eigenes Werk (selbst verfasst) — reale Texte respektieren die
 * Buchstaben-Freischaltung nicht, die frühe Ebene wird darum getextet.
 *
 * Tier-1-Zeichensatz (aus tiers.ts, kumulativ): erlaubte Buchstaben nur
 *   a d e f i j k l n r s t ö
 * (KEIN o u h m b c g w · KEIN p q v x y z ä ü ß). Satzzeichen sind weglassbar und
 * heben den Tier NICHT. Alle Zeilen wurden mit `scripts/_twcheck` gegen minTierFor
 * (Tier ≤1) und den GESAMTEN Bestand (Dedup) geprüft.
 *
 * Append-only: wird in corpus.ts HINTEN an CORPUS gehängt → bestehende Baustein-
 * Indizes (No-Repeat-Ledger) bleiben stabil. Test `typing-textwelt-erstleser3`
 * erzwingt die T1-Grenze und die Manifest-Präsenz.
 */
import type { CorpusItem } from "./corpus";
import type { Stufe } from "./account";

const KIDS_TEENS: Stufe[] = ["kids", "teens"];
/**
 * NUR 7-9 (30.07.2026): Zeilen, die ein Kind mit 11 als zu jung liest
 * (»Das Kind isst.«, »Guck mal, wie hoch ich schon bin!«). In-place
 * abgesenkt - ein angehaengter Zwilling koennte Stufen nur HINZUFUEGEN.
 * Der Wortlaut ist unveraendert, 7-9 verliert nichts.
 */
const NUR_KIDS: Stufe[] = ["kids"];
export const ERSTLESER3_CORPUS: CorpusItem[] = [
  { text: "Der Falter ist fein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Falke ist frei.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Tanne ist alt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Ast ist fest.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ida rastet, Lars rennt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Ritter reitet.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Distel ist klein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Lied ist leise.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Stern ist fern.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Fee ist nett.", kind: "satz", stufen: NUR_KIDS },
  { text: "Der Tee ist da.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Renate liest, Ida reitet.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Kette ist fein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Latte ist fest.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Reis ist da.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Anna rastet leise.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Riese ist alt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Falle ist leer.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nina eilt, Tina reitet.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Adler landet leise.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Astrid liest, Finn redet.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Stein ist kalt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Insel ist fern.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der See ist kalt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Ente ist satt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ida ist elf.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Rand ist fest.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Land ist frei.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Til rastet, Ella liest.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Faden ist steif.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Tante reist.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Stall ist leer.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Idee ist fein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ist der See tief?", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ist das Nest leer?", kind: "satz", stufen: KIDS_TEENS },
  { text: "Reitet Rita?", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ist Finn da?", kind: "satz", stufen: KIDS_TEENS },
  { text: "Anna reitet, Ida rennt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Lars liest, Til redet.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Kind ist nett.", kind: "satz", stufen: NUR_KIDS },
  { text: "Nils ist flink.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Elsa reitet, Finn eilt.", kind: "satz", stufen: KIDS_TEENS },
];
