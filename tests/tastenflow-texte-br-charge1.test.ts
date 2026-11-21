/**
 * ★★★ K-BR (29.10.2026): Wächter des Korpus Charge 1 des Weges „br" (Portugiesisch (Brasilien)).
 * Regeln einmal für alle neun Wege: `tests/helfer/korpusNeueWege.ts`. Hier stehen nur die gemessenen Zahlen und die Zeichen,
 * die auf einer Tastatur keine Taste haben (wie `FAELLT_WEG` in `tastenflow-lernweg-br-reihenfolge.test.ts`).
 * Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`.
 */
import { CORPUS_BR } from "../src/lib/typing/corpusBr";
import { CORPUS_BR_WEG_CHARGE1_KIDS } from "../src/lib/typing/corpusBrWegCharge1Kids";
import { CORPUS_BR_WEG_CHARGE1_TEENS } from "../src/lib/typing/corpusBrWegCharge1Teens";
import { CORPUS_BR_WEG_CHARGE1_ERWACHSENE } from "../src/lib/typing/corpusBrWegCharge1Erwachsene";
import { pruefeKorpusCharge1 } from "./helfer/korpusNeueWege";

pruefeKorpusCharge1({
  weg: "br",
  name: "Portugiesisch (Brasilien)",
  dateien: { kids: CORPUS_BR_WEG_CHARGE1_KIDS, teens: CORPUS_BR_WEG_CHARGE1_TEENS, erwachsen: CORPUS_BR_WEG_CHARGE1_ERWACHSENE },
  roh: CORPUS_BR,
  bezug: "br-abnt2",
  anzahl: { kids: 62, teens: 62, erwachsen: 61 },
  ohneTaste: {},
  nichtGanzTippbar: {},
});
