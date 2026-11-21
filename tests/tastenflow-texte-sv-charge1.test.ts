/**
 * ★★★ K-SV (29.10.2026): Wächter des Korpus Charge 1 des Weges „sv" (Schwedisch).
 * Regeln einmal für alle neun Wege: `tests/helfer/korpusNeueWege.ts`. Hier stehen nur die gemessenen Zahlen und die Zeichen,
 * die auf einer Tastatur keine Taste haben (wie `FAELLT_WEG` in `tastenflow-lernweg-sv-reihenfolge.test.ts`).
 * Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`.
 */
import { CORPUS_SV } from "../src/lib/typing/corpusSv";
import { CORPUS_SV_WEG_CHARGE1_KIDS } from "../src/lib/typing/corpusSvWegCharge1Kids";
import { CORPUS_SV_WEG_CHARGE1_TEENS } from "../src/lib/typing/corpusSvWegCharge1Teens";
import { CORPUS_SV_WEG_CHARGE1_ERWACHSENE } from "../src/lib/typing/corpusSvWegCharge1Erwachsene";
import { pruefeKorpusCharge1 } from "./helfer/korpusNeueWege";

pruefeKorpusCharge1({
  weg: "sv",
  name: "Schwedisch",
  dateien: { kids: CORPUS_SV_WEG_CHARGE1_KIDS, teens: CORPUS_SV_WEG_CHARGE1_TEENS, erwachsen: CORPUS_SV_WEG_CHARGE1_ERWACHSENE },
  roh: CORPUS_SV,
  bezug: "sv",
  anzahl: { kids: 72, teens: 69, erwachsen: 69 },
  ohneTaste: {},
  nichtGanzTippbar: {},
});
