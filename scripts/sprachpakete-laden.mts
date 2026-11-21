/**
 * ★★★ FÜR SKRIPTE: ALLE SPRACHPAKETE VORAB LADEN (28.09.2026).
 *
 * Seit Tastenflow die Texte je Sprache nachlädt (`src/lib/typing/sprachpakete.ts`),
 * sind `CORPUS`, `SERIEN`, das Lexikon … leer, bis ein Paket geladen ist. Im
 * Browser wartet `SprachpaketTor`; ein Skript (Handbuch, Korpus-Anker,
 * Frühfassungen, Messungen) braucht ALLES und bindet darum diese Datei ein:
 *
 *     import "./sprachpakete-laden.mts";
 *
 * ⚠️ In JEDER Skript-Datei, die auf oberster Ebene Tastenflow-Texte liest -
 *    nicht nur im Hauptskript. Ein `await` auf oberster Ebene hält nur die
 *    Module an, die diese Datei SELBST importieren; ihre Geschwister laufen
 *    daneben weiter (gemessen mit tsx am 28.09.2026: „a start · b eval ·
 *    a end"). Wer die Zeile vergisst, liest leere Listen.
 */
import { ALLE_SPRACHPAKETE, ladeSprachpakete } from "../src/lib/typing/sprachpakete";

await ladeSprachpakete(ALLE_SPRACHPAKETE);
