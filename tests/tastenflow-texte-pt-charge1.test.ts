/**
 * ★★★ K-PT (29.10.2026): Wächter des Korpus Charge 1 des Weges „pt" (Portugiesisch (Portugal)).
 * Regeln einmal für alle neun Wege: `tests/helfer/korpusNeueWege.ts`. Hier stehen nur die gemessenen Zahlen und die Zeichen,
 * die auf einer Tastatur keine Taste haben (wie `FAELLT_WEG` in `tastenflow-lernweg-pt-reihenfolge.test.ts`).
 * Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`.
 */
import { CORPUS_PT } from "../src/lib/typing/corpusPt";
import { CORPUS_PT_WEG_CHARGE1_KIDS } from "../src/lib/typing/corpusPtWegCharge1Kids";
import { CORPUS_PT_WEG_CHARGE1_TEENS } from "../src/lib/typing/corpusPtWegCharge1Teens";
import { CORPUS_PT_WEG_CHARGE1_ERWACHSENE } from "../src/lib/typing/corpusPtWegCharge1Erwachsene";
import { pruefeKorpusCharge1 } from "./helfer/korpusNeueWege";

pruefeKorpusCharge1({
  weg: "pt",
  name: "Portugiesisch (Portugal)",
  dateien: { kids: CORPUS_PT_WEG_CHARGE1_KIDS, teens: CORPUS_PT_WEG_CHARGE1_TEENS, erwachsen: CORPUS_PT_WEG_CHARGE1_ERWACHSENE },
  roh: CORPUS_PT,
  bezug: "pt",
  anzahl: { kids: 68, teens: 70, erwachsen: 68 },
  ohneTaste: {},
  nichtGanzTippbar: {},
});
