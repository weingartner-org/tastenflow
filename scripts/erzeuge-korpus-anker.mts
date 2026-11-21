/**
 * Erzeugt `src/lib/typing/corpusAnker.ts` — die kanonische Reihenfolge der
 * Baustein-IDs, an der die Indizes des No-Repeat-Ledgers hängen (L1, 21.08.2026).
 *
 * NACH JEDER INHALTS-CHARGE laufen lassen:
 *     npx tsx scripts/erzeuge-korpus-anker.mts
 *
 * Das Skript ist STRENG ANHÄNGEND: Es baut das Manifest mit dem BESTEHENDEN
 * Anker (`manifestFor`) und schreibt dessen `ids` zurück. Der Bestand behält
 * also Platz für Platz seine Reihenfolge; nur neue IDs kommen hinten dazu. Es
 * kann per Konstruktion nichts umsortieren und nichts löschen — IDs von
 * entfernten Zeilen bleiben als Lücke stehen und halten den Platz frei.
 *
 * `--check` schreibt nicht, sondern meldet nur, ob der Anker aktuell ist
 * (Rückgabewert 1, wenn nicht) — für Gates/CI.
 */
import "./sprachpakete-laden.mts"; // ★ 28.09.2026: alle Sprachpakete vorab (Tastenflow lädt Texte sonst erst im Browser nach)
import { readFileSync, writeFileSync } from "node:fs";
import { CORPUS, CORPUS_EN, CORPUS_FR, CORPUS_IT, CORPUS_PL, CORPUS_TR, CORPUS_CS } from "../src/lib/typing/corpus.ts";
// ★ G3c-VERTEILER (25.10.2026): die Korpora der neun Gerüst-Wege - im Manifest (hinten), aber NICHT in der Leer-Prüfung, bis ihre erste Charge
// gemergt ist (Auftrag der Etappe T der Sprache, wie F5-cs). Leer tragen sie keine ID bei; der Anker bleibt unverändert.
import { CORPUS_BG, CORPUS_EL, CORPUS_HU, CORPUS_NL, CORPUS_PT, CORPUS_BR, CORPUS_RO, CORPUS_SV, CORPUS_UK } from "../src/lib/typing/corpus.ts";
import { CORPUS_ES } from "../src/lib/typing/corpusEs.ts";
import { manifestFor } from "../src/lib/typing/corpusManifest.ts";
import { KORPUS_ANKER } from "../src/lib/typing/corpusAnker.ts";

const DATEI = new URL("../src/lib/typing/corpusAnker.ts", import.meta.url);
const nurPruefen = process.argv.includes("--check");

// ★ E8a (25./26.09.2026): CORPUS_FR dazugenommen - ohne das haette der
// franzoesische Weg nie ein No-Repeat-Ledger bekommen (Bauplan-Auftrag
// "Korpus-Anker im selben Commit").
// ★ ES-F5 (27.09.2026): CORPUS_ES ebenso vorbereitet - solange leer (ES-T
// bringt Text), traegt es keine ID bei und der Anker bleibt unveraendert.
// ★★ 28.09.2026: Die Korpora kommen aus den Sprachpaketen (`sprachpakete-laden.mts`
// oben). Wäre eines leer, sähe dieser Lauf dessen neue Zeilen nicht - und
// „--check" meldete „aktuell", obwohl sie im Anker fehlen. Darum hart prüfen.
// ★ F5-it (02.10.2026): CORPUS_IT ist in den Anker aufgenommen (`manifestFor` unten), aber NICHT in dieser Prüfung - er ist bis
// zu den Text-Chargen T1-T9 absichtlich LEER und trägt dann keine ID bei (der Anker bleibt unverändert). Sobald die erste
// italienische Charge gemergt ist, gehört `CORPUS_IT` hier hinein (Auftrag der Etappe T).
// ★ F5-cs (03.10.2026): dasselbe für `CORPUS_CS` - im Anker (`manifestFor` unten), aber nicht in dieser Prüfung, bis die erste
// tschechische Charge gemergt ist.
// ★ IT-T1 (03.10.2026): erledigt - `CORPUS_IT` trägt Text und wird jetzt mitgeprüft.
// ★ PL-T1 (03.10.2026): ebenso `CORPUS_PL` (erste polnische Charge, siehe unten).
// ★ TR-T1 (03.10.2026): `CORPUS_TR` trägt Text (Kinder, frühe Sprossen) und wird jetzt mitgeprüft.
// ★ CS-T1 (03.10.2026): ebenso `CORPUS_CS` (erste tschechische Charge).
// ★ K-BG (29.10.2026): ebenso `CORPUS_BG` (Charge 1 aus `texte-charge-1`).
// ★ K-EL (29.10.2026): ebenso `CORPUS_EL` (Charge 1 aus `texte-charge-1`).
// ★ K-HU (29.10.2026): ebenso `CORPUS_HU` (Charge 1 aus `texte-charge-1`).
// ★ K-NL (29.10.2026): ebenso `CORPUS_NL` (Charge 1 aus `texte-charge-1`).
// ★ K-PT (29.10.2026): ebenso `CORPUS_PT` (Charge 1 aus `texte-charge-1`).
// ★ K-BR (29.10.2026): ebenso `CORPUS_BR` (Charge 1 aus `texte-charge-1`).
// ★ K-RO (29.10.2026): ebenso `CORPUS_RO` (Charge 1 aus `texte-charge-1`).
// ★ K-SV (29.10.2026): ebenso `CORPUS_SV` (Charge 1 aus `texte-charge-1`).
// ★ K-UK (29.10.2026): ebenso `CORPUS_UK` (Charge 1 aus `texte-charge-1`).
for (const [name, liste] of Object.entries({ CORPUS, CORPUS_EN, CORPUS_FR, CORPUS_ES, CORPUS_IT, CORPUS_PL, CORPUS_TR, CORPUS_CS, CORPUS_BG, CORPUS_EL, CORPUS_HU, CORPUS_NL, CORPUS_PT, CORPUS_BR, CORPUS_RO, CORPUS_SV, CORPUS_UK })) {
  if (liste.length === 0) {
    console.error(`ABBRUCH: ${name} ist leer - das Sprachpaket wurde nicht geladen (scripts/sprachpakete-laden.mts).`);
    process.exit(3);
  }
}
// ★ F5-pl (03.10.2026): CORPUS_PL ist in den Anker aufgenommen, aber NICHT in der Prüfung oben - er ist bis zur ersten polnischen
// Text-Charge (T1) absichtlich LEER und trägt dann keine ID bei (der Anker bleibt unverändert). Sobald die erste Charge gemergt ist,
// gehört `CORPUS_PL` in diese Prüfung hinein (Auftrag der Etappe T, wie bei Italien in IT-T1).
// ★ PL-T1 (03.10.2026): erledigt - `CORPUS_PL` trägt Text und steht jetzt in der Prüfung oben.
// ★ F5-tr (03.10.2026): dasselbe für `CORPUS_TR` (leer bis zur Etappe T, trägt keine ID bei, Anker unverändert).
//   Erledigt mit TR-T1 (03.10.2026): `CORPUS_TR` steht in der Prüfung oben.
// ★ F5-cs (03.10.2026): dasselbe für `CORPUS_CS` (leer bis zur Etappe T). ★ CS-T1: erledigt, steht jetzt in der Prüfung oben.
const ids = manifestFor([...CORPUS, ...CORPUS_EN, ...CORPUS_FR, ...CORPUS_ES, ...CORPUS_IT, ...CORPUS_PL, ...CORPUS_TR, ...CORPUS_CS, ...CORPUS_BG, ...CORPUS_EL, ...CORPUS_HU, ...CORPUS_NL, ...CORPUS_PT, ...CORPUS_BR, ...CORPUS_RO, ...CORPUS_SV, ...CORPUS_UK]).ids;
const neu = ids.length - KORPUS_ANKER.length;

// Sicherheitsnetz: der bestehende Anker MUSS unverändertes Präfix sein.
for (let i = 0; i < KORPUS_ANKER.length; i++) {
  if (KORPUS_ANKER[i] !== ids[i]) {
    console.error(
      `ABBRUCH: Anker-Platz ${i} würde sich ändern (${KORPUS_ANKER[i]} -> ${ids[i]}).\n` +
        `Das darf nie passieren — es würde den Lernfortschritt aller Kinder verschieben.`,
    );
    process.exit(2);
  }
}

if (nurPruefen) {
  if (neu === 0) {
    console.log(`Anker aktuell: ${ids.length} Bausteine.`);
    process.exit(0);
  }
  console.error(
    `Anker VERALTET: ${neu} Baustein(e) fehlen. Bitte 'npx tsx scripts/erzeuge-korpus-anker.mts' laufen lassen.`,
  );
  process.exit(1);
}

// Zeilenweise (12 IDs je Zeile) — ein Zuwachs erzeugt so nur neue Zeilen am Ende.
const zeilen: string[] = [];
for (let i = 0; i < ids.length; i += 12) zeilen.push(ids.slice(i, i + 12).join(" "));

const alt = readFileSync(DATEI, "utf8");
const marke = "export const KORPUS_ANKER: readonly string[] = `";
const kopf = alt.slice(0, alt.indexOf(marke) + marke.length);
if (!alt.includes(marke)) {
  console.error("ABBRUCH: Marke in corpusAnker.ts nicht gefunden.");
  process.exit(2);
}
writeFileSync(DATEI, `${kopf}\n${zeilen.join("\n")}\n\`\n  .split(/\\s+/)\n  .filter(Boolean);\n`);
console.log(`Anker geschrieben: ${ids.length} Bausteine (${neu} neu).`);
