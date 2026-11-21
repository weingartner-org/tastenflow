/**
 * ★★★ K-EL (29.10.2026): Wächter des Korpus Charge 1 des Weges „el" (Griechisch).
 * Regeln einmal für alle neun Wege: `tests/helfer/korpusNeueWege.ts`. Hier stehen nur die gemessenen Zahlen und die Zeichen,
 * die auf einer Tastatur keine Taste haben (wie `FAELLT_WEG` in `tastenflow-lernweg-el-reihenfolge.test.ts`).
 * Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`.
 */
import { CORPUS_EL } from "../src/lib/typing/corpusEl";
import { CORPUS_EL_WEG_CHARGE1_KIDS } from "../src/lib/typing/corpusElWegCharge1Kids";
import { CORPUS_EL_WEG_CHARGE1_TEENS } from "../src/lib/typing/corpusElWegCharge1Teens";
import { CORPUS_EL_WEG_CHARGE1_ERWACHSENE } from "../src/lib/typing/corpusElWegCharge1Erwachsene";
import { pruefeKorpusCharge1 } from "./helfer/korpusNeueWege";

pruefeKorpusCharge1({
  weg: "el",
  name: "Griechisch",
  dateien: { kids: CORPUS_EL_WEG_CHARGE1_KIDS, teens: CORPUS_EL_WEG_CHARGE1_TEENS, erwachsen: CORPUS_EL_WEG_CHARGE1_ERWACHSENE },
  roh: CORPUS_EL,
  bezug: "el",
  anzahl: { kids: 69, teens: 72, erwachsen: 70 },
  ohneTaste: {},
  nichtGanzTippbar: {},
});
