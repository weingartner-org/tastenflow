/**
 * Erstleser-Bausteine (Textwelt TW-E6) — SELBST VERFASSTE, bewusst wortschatz-
 * begrenzte kurze Sätze und kinderleichte Fakten, die schon mit den ganz frühen
 * Tasten (Tier 1 / Tier 2) auskommen. Sie füllen die im Bestands-Audit (TW-E4)
 * belegte Lücke: servierbar ≤Tier war T1 = 1, T2 = 263 → früh fast leer, deshalb
 * der Wortsalat. Diese Charge bringt viele sinnvolle Zeilen genau dorthin.
 *
 * Rechte (§10): eigenes Werk (selbst verfasst) — reale Texte respektieren die
 * Buchstaben-Freischaltung nicht, die frühe Erstleser-Ebene wird darum getextet.
 *
 * Tier-Zeichensätze (aus tiers.ts, kumulativ; Satzzeichen sind weglassbar und
 * heben den Tier NICHT):
 *  • T1 = Grundreihe + `e n i r t`  → erlaubte Buchstaben: a d e f i j k l n r s t ö
 *    (KEIN o u h m b c g w p q v x y z ä ü ß) — sehr eng, darum kurze Sätze.
 *  • T2 = T1 + `h o u c g m b w`     → erlaubte Buchstaben: a b c d e f g h i j k l
 *    m n o r s t u w ö (KEIN p q v x y z ä ü ß).
 *
 * Append-only: Diese Datei wird in corpus.ts HINTEN an CORPUS gehängt — bestehende
 * Baustein-Indizes (No-Repeat-Ledger) bleiben stabil. Der Test
 * `typing-textwelt-erstleser` erzwingt die Tier-Grenzen (jeder verbotene Buchstabe
 * fliegt auf) und dass die frühe Lücke wirklich gefüllt wird.
 *
 * Fakten (`fakt`) sind bewusst kinderleicht und unstrittig wahr (Faktencheck-Gate,
 * [[feedback_aussagen_dreifach_pruefen]]) — keine Zahlen/Daten (die bräuchten T5).
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
/** Tier-1-Sätze (nur a d e f i j k l n r s t ö). Beschreibend, keine Wahrheits-
 *  behauptung — reine Übungssätze, die früh Sinn zeigen. */
const ERSTLESER_T1: CorpusItem[] = [
  { text: "Der Adler ist frei.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Feder ist fein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Esel frisst Salat.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Kind reitet.", kind: "satz", stufen: NUR_KIDS },
  { text: "Die Ente ist leise.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Stein ist fest.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Insel ist still.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Anna reitet, Lena liest.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Tina ist nett.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der See ist tief.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Nadel ist fein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Nest ist leer.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Esel ist alt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Finn ist flink.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Ratte ist klein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Kind isst.", kind: "satz", stufen: NUR_KIDS },
  { text: "Der Adler landet.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nina teilt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Salat ist fein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Lars reist.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Ferkel ist klein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Esel frisst, die Ente isst.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Nils rennt, Finn reitet.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ist das Kind da?", kind: "satz", stufen: NUR_KIDS },
  { text: "Die Erde ist alt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Elsa liest leise.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Faden ist fein.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Land ist still.", kind: "satz", stufen: KIDS_TEENS },
];

/** Tier-2-Sätze und kinderleichte, unstrittig wahre Fakten (T2-Zeichensatz). */
const ERSTLESER_T2: CorpusItem[] = [
  // Beschreibende Sätze
  { text: "Der Hund rennt durch den Garten.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Kuh steht auf der Wiese.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Baum ist hoch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Boot ist auf dem See.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Sonne scheint warm.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Maus sucht Brot.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Oma backt Kuchen.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Hase hockt im Gras.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Amsel singt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Wind weht kalt.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Blume ist rot.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Ball rollt ins Tor.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Huhn hockt im Stroh.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Igel schlummert im Laub.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Schaf frisst Gras.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Mond ist heute rund.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Kater schnurrt leise.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Auto steht im Hof.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Bauer harkt das Heu.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Im Wald ruft ein Uhu.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Nacht ist dunkel und still.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Bach rauscht durch das Tal.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Tom trinkt kalte Milch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Mia malt einen bunten Fisch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Kran hebt einen Balken.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Feuer knistert leise.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Turm ist alt und hoch.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Boot schaukelt auf dem Meer.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Regen macht die Wiese nass.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Anton sucht seine Tasche.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Der Hund holt den Ast.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Die Ente watschelt ins Wasser.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Das Kind baut einen Turm aus Sand.", kind: "satz", stufen: NUR_KIDS },
  { text: "Wo ist der rote Wagen?", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Storch steht im flachen Wasser.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Dachs sucht Futter.", kind: "satz", stufen: KIDS_TEENS },
  { text: "Ein Frosch hockt und schnellt hoch.", kind: "satz", stufen: KIDS_TEENS },
  // Kinderleichte, unstrittig wahre Fakten (keine Zahlen)
  { text: "Eine Kuh gibt Milch.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Bienen machen Honig.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Fisch lebt im Wasser.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Igel hat Stacheln.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Eine Kuh frisst Gras.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Huhn legt Eier.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Die Sonne macht warm.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Baum hat Rinde.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Hund kann bellen.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Eine Amsel kann fliegen.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Bienen sammeln Nektar.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Der Mond leuchtet in der Nacht.", kind: "fakt", stufen: KIDS_TEENS },
  { text: "Ein Baum wird langsam hoch.", kind: "fakt", stufen: KIDS_TEENS },
];

/** Gesamte Erstleser-Charge (TW-E6), additiv an CORPUS gehängt. */
export const ERSTLESER_CORPUS: CorpusItem[] = [...ERSTLESER_T1, ...ERSTLESER_T2];

/** Getrennt exportiert für die Tier-Erzwingung im Test. */
export const ERSTLESER_T1_ONLY = ERSTLESER_T1;
export const ERSTLESER_T2_ONLY = ERSTLESER_T2;
