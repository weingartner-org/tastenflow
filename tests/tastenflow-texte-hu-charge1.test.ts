/**
 * ★★★ K-HU (29.10.2026): Wächter des Korpus Charge 1 des Weges „hu" (Ungarisch).
 * Regeln einmal für alle neun Wege: `tests/helfer/korpusNeueWege.ts`. Hier stehen nur die gemessenen Zahlen und die Zeichen,
 * die auf einer Tastatur keine Taste haben (wie `FAELLT_WEG` in `tastenflow-lernweg-hu-reihenfolge.test.ts`).
 * Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`.
 */
import { CORPUS_HU } from "../src/lib/typing/corpusHu";
import { CORPUS_HU_WEG_CHARGE1_KIDS } from "../src/lib/typing/corpusHuWegCharge1Kids";
import { CORPUS_HU_WEG_CHARGE1_TEENS } from "../src/lib/typing/corpusHuWegCharge1Teens";
import { CORPUS_HU_WEG_CHARGE1_ERWACHSENE } from "../src/lib/typing/corpusHuWegCharge1Erwachsene";
import { pruefeKorpusCharge1 } from "./helfer/korpusNeueWege";

pruefeKorpusCharge1({
  weg: "hu",
  name: "Ungarisch",
  dateien: { kids: CORPUS_HU_WEG_CHARGE1_KIDS, teens: CORPUS_HU_WEG_CHARGE1_TEENS, erwachsen: CORPUS_HU_WEG_CHARGE1_ERWACHSENE },
  roh: CORPUS_HU,
  bezug: "hu",
  anzahl: { kids: 70, teens: 70, erwachsen: 70 },
  ohneTaste: {},
  nichtGanzTippbar: {},
});
