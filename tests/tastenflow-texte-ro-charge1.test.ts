/**
 * ★★★ K-RO (29.10.2026): Wächter des Korpus Charge 1 des Weges „ro" (Rumänisch).
 * Regeln einmal für alle neun Wege: `tests/helfer/korpusNeueWege.ts`. Hier stehen nur die gemessenen Zahlen und die Zeichen,
 * die auf einer Tastatur keine Taste haben (wie `FAELLT_WEG` in `tastenflow-lernweg-ro-reihenfolge.test.ts`).
 * Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`.
 */
import { CORPUS_RO } from "../src/lib/typing/corpusRo";
import { CORPUS_RO_WEG_CHARGE1_KIDS } from "../src/lib/typing/corpusRoWegCharge1Kids";
import { CORPUS_RO_WEG_CHARGE1_TEENS } from "../src/lib/typing/corpusRoWegCharge1Teens";
import { CORPUS_RO_WEG_CHARGE1_ERWACHSENE } from "../src/lib/typing/corpusRoWegCharge1Erwachsene";
import { pruefeKorpusCharge1 } from "./helfer/korpusNeueWege";

pruefeKorpusCharge1({
  weg: "ro",
  name: "Rumänisch",
  dateien: { kids: CORPUS_RO_WEG_CHARGE1_KIDS, teens: CORPUS_RO_WEG_CHARGE1_TEENS, erwachsen: CORPUS_RO_WEG_CHARGE1_ERWACHSENE },
  roh: CORPUS_RO,
  bezug: "ro",
  anzahl: { kids: 70, teens: 68, erwachsen: 70 },
  ohneTaste: {},
  nichtGanzTippbar: {},
});
