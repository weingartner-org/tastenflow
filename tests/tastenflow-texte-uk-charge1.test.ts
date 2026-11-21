/**
 * ★★★ K-UK (29.10.2026): Wächter des Korpus Charge 1 des Weges „uk" (Ukrainisch).
 * Regeln einmal für alle neun Wege: `tests/helfer/korpusNeueWege.ts`. Hier stehen nur die gemessenen Zahlen und die Zeichen,
 * die auf einer Tastatur keine Taste haben (wie `FAELLT_WEG` in `tastenflow-lernweg-uk-reihenfolge.test.ts`).
 * Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`.
 */
import { CORPUS_UK } from "../src/lib/typing/corpusUk";
import { CORPUS_UK_WEG_CHARGE1_KIDS } from "../src/lib/typing/corpusUkWegCharge1Kids";
import { CORPUS_UK_WEG_CHARGE1_TEENS } from "../src/lib/typing/corpusUkWegCharge1Teens";
import { CORPUS_UK_WEG_CHARGE1_ERWACHSENE } from "../src/lib/typing/corpusUkWegCharge1Erwachsene";
import { pruefeKorpusCharge1 } from "./helfer/korpusNeueWege";

pruefeKorpusCharge1({
  weg: "uk",
  name: "Ukrainisch",
  dateien: { kids: CORPUS_UK_WEG_CHARGE1_KIDS, teens: CORPUS_UK_WEG_CHARGE1_TEENS, erwachsen: CORPUS_UK_WEG_CHARGE1_ERWACHSENE },
  roh: CORPUS_UK,
  bezug: "ua",
  anzahl: { kids: 73, teens: 70, erwachsen: 70 },
  // Der Apostroph ' hat auf ua-std keine Taste (FAELLT_WEG der Reihenfolge).
  ohneTaste: { "ua-std": ["'"] },
  nichtGanzTippbar: { "ua-std": 16 },
});
