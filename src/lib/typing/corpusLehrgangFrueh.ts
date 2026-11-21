/**
 * Frühe Lehrgangs-Sätze — „so früh wie möglich sinnvolle Sätze" für den KLASSISCHEN
 * Lehrgang (Reiter „Lektionen"), Charge vom 27.07.2026.
 *
 * ANLASS (gemessen mit einem Lektions-Sweep über `corpusEntriesFor`): Der Lehrgang
 * führt die Buchstaben in EINER anderen Reihenfolge ein als „Mein Training"
 * (`INTRO_ORDER`) — nämlich f j · d k · s l · a ö · g h · ⇧ · e i · r u · t z ·
 * w o · q p · m v · c , · x . · y - · n b. Weil fast jeder deutsche Satz ein **n**
 * braucht, das aber erst in der 16. Lektion (`unter-nb`) kommt, gab es vorher:
 *   • Lektion 1–8 (bis `ober-ru`): **null** servierbare Bausteine — reiner
 *     Buchstabensalat für ALLE Altersstufen,
 *   • `ober-tz` … `unter-y-minus`: 23–41 Sätze für 7–12 Jahre, aber **0–7** für
 *     13–15 Jahre und Erwachsene (alle frühen Sätze waren nur `a`/`b` getaggt —
 *     im Englischen tragen dieselben Sätze längst alle vier Stufen).
 *
 * DIESE DATEI schließt beides:
 *   1. **Alters-Retag** (Block A): altersneutrale Bestands-Sätze bekommen zusätzlich
 *      `c`/`erwachsen`. Technik wie bei TN-E4: Der Eintrag wird mit IDENTISCHEM
 *      `kind` und Wortlaut noch einmal angehängt, `mergeCorpus` vereinigt die
 *      `stufen` und `buildManifest` verwirft die Dublette — die Baustein-Indizes
 *      und damit das No-Repeat-Gedächtnis aller Kinder bleiben unangetastet.
 *   2. **Neue Sätze** (Blöcke B–F) für genau die Tastensätze der frühen Lektionen.
 *
 * HANDWERKS-REGELN dieser Charge (teuer erarbeitet, beim Nachlegen beachten):
 *   • Kein **n** vor `unter-nb` ⇒ keine Artikel „ein/eine", kein „und", kein
 *     „nicht", KEINE Verben im Plural (-en) — nur 3. Person Singular.
 *   • Kein **t** vor `ober-tz` ⇒ kein „ist", kein „hat", kein Partizip auf -t.
 *   • Kein **r** vor `ober-ru` ⇒ weder „der" noch „er"/„ihr" — bis dahin tragen
 *     nur „die/das/sie/es".
 *   • Kein **c** vor `unter-c-komma` ⇒ kein „ch"/„sch": also weder „auch" noch
 *     „Schule", „nicht", „reicht".
 *   • Kein **b** vor `unter-nb`, kein **m** vor `unter-mv` ⇒ kein „aber", kein
 *     „dem"/„im"/„am".
 *   • ä ü ß kommen erst NACH `unter-nb` ⇒ „fährt", „Straße", „Hügel" fallen weg.
 *   • Satzzeichen dürfen stehen: `fitText` lässt Punkt/Komma/Fragezeichen weg,
 *     solange sie nicht gelernt sind (Kernregel corpus.ts) — Buchstaben nie.
 *
 * Alle Sätze sind SELBST VERFASST (keine Fremdquelle, keine Lizenzfrage) und
 * bewusst so gewählt, dass sie in jedem Alter tragen: Natur, Alltag, Arbeit —
 * keine Märchenfiguren, keine Kindersprache. Append-only ans Ende von `CORPUS`.
 * Siehe [[project_tastenflow_text_nachschub]], [[project_zehnfinger_trainer]].
 */
import type { CorpusItem, Herkunft } from "./corpus";
import type { Stufe } from "./account";

/** Für alle vier Altersstufen — schlichte, altersneutrale Aussagesätze. */
const ALLE_DREI: Stufe[] = ["kids", "teens", "erwachsen"];
/** Nur die beiden älteren Stufen (Nachtrag zu bestehenden a/b-Einträgen). */
const TEENS_ERW: Stufe[] = ["teens", "erwachsen"];
const SELBST: Herkunft = {
  quelle: "Sensorik",
  lizenz: "Eigenes Werk (selbst verfasst)",
  autor: "Sensorik-Lernplattform",
  fundstelle: "Selbst verfasst am 2026-07-27, keine Fremdquelle",
};

/**
 * Block A — ALTERS-RETAG (kein neuer Text!). Wortlaut identisch zum Bestand;
 * `mergeCorpus` hängt nur `c`/`erwachsen` an die vorhandenen `stufen` an.
 * Ausgewählt wurde, was in jedem Alter trägt — Märchenfiguren („Die Fee ist
 * nett.", „Der Ritter reitet.") und Kinder-Aussagen („Ida ist elf.") bleiben
 * bewusst bei a/b.
 */
const RETAG: CorpusItem[] = [
  { text: "Der Adler ist frei.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der Adler landet.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der Adler landet leise.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der Falke ist frei.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der See ist tief.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der See ist kalt.", kind: "satz", stufen: TEENS_ERW },
  { text: "Ist der See tief?", kind: "satz", stufen: TEENS_ERW },
  { text: "Die Erde ist alt.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der Stein ist fest.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der Stein ist kalt.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der Ast ist fest.", kind: "satz", stufen: TEENS_ERW },
  { text: "Die Tanne ist alt.", kind: "satz", stufen: TEENS_ERW },
  { text: "Die Insel ist still.", kind: "satz", stufen: TEENS_ERW },
  { text: "Die Insel ist fern.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der Stern ist fern.", kind: "satz", stufen: TEENS_ERW },
  { text: "Das Land ist still.", kind: "satz", stufen: TEENS_ERW },
  { text: "Das Land ist frei.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der Rand ist fest.", kind: "satz", stufen: TEENS_ERW },
  { text: "Die Nadel ist fein.", kind: "satz", stufen: TEENS_ERW },
  { text: "Die Feder ist fein.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der Faden ist fein.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der Faden ist steif.", kind: "satz", stufen: TEENS_ERW },
  { text: "Die Kette ist fein.", kind: "satz", stufen: TEENS_ERW },
  { text: "Die Latte ist fest.", kind: "satz", stufen: TEENS_ERW },
  { text: "Das Nest ist leer.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der Stall ist leer.", kind: "satz", stufen: TEENS_ERW },
  { text: "Das Lied ist leise.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der Tee ist da.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der Reis ist da.", kind: "satz", stufen: TEENS_ERW },
  { text: "Der Salat ist fein.", kind: "satz", stufen: TEENS_ERW },
  { text: "Die Distel ist klein.", kind: "satz", stufen: TEENS_ERW },
  { text: "Die Idee ist fein.", kind: "satz", stufen: TEENS_ERW },
  { text: "Elsa liest leise.", kind: "satz", stufen: TEENS_ERW },
  { text: "Lars reist.", kind: "satz", stufen: TEENS_ERW },
  { text: "Die Tante reist.", kind: "satz", stufen: TEENS_ERW },
  { text: "Lars liest, Til redet.", kind: "satz", stufen: TEENS_ERW },
  { text: "Astrid liest, Finn redet.", kind: "satz", stufen: TEENS_ERW },
  { text: "Die Kuh steht auf der Wiese.", kind: "satz", stufen: TEENS_ERW },
  { text: "Die Kuh steht ruhig auf der Weide.", kind: "satz", stufen: TEENS_ERW },
  { text: "Das Auto steht im Hof.", kind: "satz", stufen: TEENS_ERW },
];

/**
 * Block B — Tastensatz `f j d k s l a ö g h` (Lektion „home-gh"/„shift-gross").
 * Nur a und ö als Vokale: Die deutsche Sprache gibt hier wirklich fast nichts her
 * — diese wenigen Sätze sind trotzdem echte Sätze statt Silbensalat.
 */
const K_GH: CorpusItem[] = [
  { text: "Ada sah das Glas.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Das Glas lag da.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Kajal sah Ada.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Ada half.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
];

/**
 * Block C — Tastensatz `+ e i` (Lektion „ober-ei"). Jetzt tragen „die/das/sie/es"
 * und „sah/las/half/fiel/lag/gefiel" — die ersten richtigen Aussagesätze des
 * Lehrgangs. (Noch ohne r: „der" und „er" gibt es hier nicht.)
 */
const K_EI: CorpusItem[] = [
  { text: "Elias sah das Feld.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Heidi las das Lied.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Aisha half Elias.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Elias half Gisela.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Das Glas fiel.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Das Segel fiel.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Es lag Kies da.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Idee gefiel Aisha.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Das Lied gefiel Heidi.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Halle gefiel Elias.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Skala gefiel Gisela.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Sie sah die Halle.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Sie las die Skala.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Gisela sah die Segel.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Aisha sah das Feld.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Heidi half Gisela.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
];

/**
 * Block D — Tastensatz `+ r u` (Lektion „ober-ru"). Mit „der/Uhr/Feuer/Erde" und
 * „fuhr/rief/lief/griff/riss" wird die Sprache spürbar normal; Themen bewusst
 * erwachsenentauglich (Fluss, Ufer, Werkzeug, unterwegs sein).
 */
const K_RU: CorpusItem[] = [
  { text: "Der Adler sah die Erde.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Es lag Gras auf der Erde.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Der Fluss lief ruhig.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Kreide fiel auf die Fliese.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Der Fahrer griff das Ruder.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Der Segler fuhr aufs Ufer.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Sie fuhr aufs Feld.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Er las die Adresse.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Er griff die Kugel.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Feder fiel auf die Erde.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Reise gefiel Heidi.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Sarah half ihr.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Ihr Fahrrad fiel.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Das Ufer lag frei.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Der Kies lag auf der Diele.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Uhr lief.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
];

/**
 * Block E — Tastensatz `+ t z` (Lektion „ober-tz"). Endlich „ist/steht/liegt/zeigt".
 * Genau hier standen Stufe c und erwachsen bisher bei null — die Sätze sind darum
 * bewusst sachlich: Werkzeug, Unterlagen, Termine, Küche.
 */
const K_TZ: CorpusItem[] = [
  { text: "Die Liste ist fertig.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Der Auftrag ist erledigt.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Datei ist da.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Der Zettel liegt auf der Kiste.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Kiste steht auf der Diele.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Sie liest die Liste.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Er trug die Kiste.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Uhr zeigt die Zeit.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Katze sitzt auf der Fliese.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Grafik ist fertig.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Sie hielt die Frist.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Er zeigt die Karte.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Kartei ist sortiert.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Zutat fehlt.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Der Herd ist kalt.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Der Titel gefiel ihr.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Der Zug fuhr zeitig.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Der Zettel ist alt.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
];

/**
 * Block F — Tastensatz `+ w o` (Lektion „ober-wo"). Mit „wo/so/dort/Wort/Ort" und
 * dem o werden vollständige Aussagen über Arbeit und Alltag möglich.
 */
const K_WO: CorpusItem[] = [
  { text: "Das Wort ist kurz.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Das Stroh lag auf der Wiese.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Der Ort liegt weit weg.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Kiste war leer.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Wo steht die Kiste?", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Das Foto zeigt die Wiese.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Sie sortiert die Fotos.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Der Sessel steht dort.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Er wartet dort auf sie.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Der Weg ist weit.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Das Werk ist alt.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
  { text: "Die Tour war kurz.", kind: "satz", stufen: ALLE_DREI, herkunft: SELBST },
];

export const LEHRGANG_FRUEH_CORPUS: CorpusItem[] = [
  ...RETAG,
  ...K_GH,
  ...K_EI,
  ...K_RU,
  ...K_TZ,
  ...K_WO,
];
