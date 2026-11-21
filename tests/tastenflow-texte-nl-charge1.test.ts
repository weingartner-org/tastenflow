/**
 * ★★★ K-NL (29.10.2026): Wächter des Korpus Charge 1 des Weges „nl" (Niederländisch).
 * Regeln einmal für alle neun Wege: `tests/helfer/korpusNeueWege.ts`. Hier stehen nur die gemessenen Zahlen und die Zeichen,
 * die auf einer Tastatur keine Taste haben (wie `FAELLT_WEG` in `tastenflow-lernweg-nl-reihenfolge.test.ts`).
 * Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`.
 */
import { CORPUS_NL } from "../src/lib/typing/corpusNl";
import { CORPUS_NL_WEG_CHARGE1_KIDS } from "../src/lib/typing/corpusNlWegCharge1Kids";
import { CORPUS_NL_WEG_CHARGE1_TEENS } from "../src/lib/typing/corpusNlWegCharge1Teens";
import { CORPUS_NL_WEG_CHARGE1_ERWACHSENE } from "../src/lib/typing/corpusNlWegCharge1Erwachsene";
import { pruefeKorpusCharge1 } from "./helfer/korpusNeueWege";

pruefeKorpusCharge1({
  weg: "nl",
  name: "Niederländisch",
  dateien: { kids: CORPUS_NL_WEG_CHARGE1_KIDS, teens: CORPUS_NL_WEG_CHARGE1_TEENS, erwachsen: CORPUS_NL_WEG_CHARGE1_ERWACHSENE },
  roh: CORPUS_NL,
  bezug: "nl-intl",
  anzahl: { kids: 71, teens: 68, erwachsen: 68 },
  // Verworfen beim Einhängen (Buchstabe ohne Taste auf allen drei Tastaturen): nl-c1-077.1 (û), nl-c1-116.4 (è).
  ohneTaste: {},
  nichtGanzTippbar: {},
});
