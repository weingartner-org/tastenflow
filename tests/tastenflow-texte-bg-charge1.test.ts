/**
 * ★★★ K-BG (29.10.2026): Wächter des Korpus Charge 1 des Weges „bg" (Bulgarisch).
 * Regeln einmal für alle neun Wege: `tests/helfer/korpusNeueWege.ts`. Hier stehen nur die gemessenen Zahlen und die Zeichen,
 * die auf einer Tastatur keine Taste haben (wie `FAELLT_WEG` in `tastenflow-lernweg-bg-reihenfolge.test.ts`).
 * Befund `BEFUND-2026-10-29-K-KORPUS-NEUN.md`.
 */
import { CORPUS_BG } from "../src/lib/typing/corpusBg";
import { CORPUS_BG_WEG_CHARGE1_KIDS } from "../src/lib/typing/corpusBgWegCharge1Kids";
import { CORPUS_BG_WEG_CHARGE1_TEENS } from "../src/lib/typing/corpusBgWegCharge1Teens";
import { CORPUS_BG_WEG_CHARGE1_ERWACHSENE } from "../src/lib/typing/corpusBgWegCharge1Erwachsene";
import { pruefeKorpusCharge1 } from "./helfer/korpusNeueWege";

pruefeKorpusCharge1({
  weg: "bg",
  name: "Bulgarisch",
  dateien: { kids: CORPUS_BG_WEG_CHARGE1_KIDS, teens: CORPUS_BG_WEG_CHARGE1_TEENS, erwachsen: CORPUS_BG_WEG_CHARGE1_ERWACHSENE },
  roh: CORPUS_BG,
  bezug: "bg",
  anzahl: { kids: 70, teens: 69, erwachsen: 67 },
  // „ “ und € fehlen auf der Schreibmaschinen-Tastatur, „ “ auf der traditionellen phonetischen (Bauplan B4/B6/B7).
  ohneTaste: { "bg-schreibm": ["„", "“", "€"], "bg-phon-trad": ["„", "“"] },
  nichtGanzTippbar: { "bg-schreibm": 6, "bg-phon-trad": 2 },
});
