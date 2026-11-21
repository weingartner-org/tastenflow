/**
 * ★★★ Wächter CS-S Kinder (8-11) (09.10.2026): die ersten TSCHECHISCHEN Serien dieser Stufe (`serienCsKids1.ts`), eingehängt über
 * `serienCs.ts` → `SERIEN_CS` → `SERIEN` (nur Weg „cs", Tastaturen `cs` und `cs-qwerty`).
 *
 * Alle Prüfungen samt Gegenproben stehen EINMAL in `helfer/csSerienWaechter.ts` (Regeln: `helfer/csSerienRegeln.ts`);
 * hier steht nur, was je Stufe anders ist (die begründete Wortliste ist gemeinsam: `helfer/csSerienBelege.ts`). Vorbild: `tastenflow-serien-it-*-1.test.ts` (IT-S), Korpus-Regeln CS-T8/CS-T9.
 * Befund: `BEFUND-2026-10-09-CS-SERIEN-1.md`.
 */
import { SERIEN_CS_KIDS_1 } from "../src/lib/typing/serienCsKids1";
import { csSerienWaechter } from "./helfer/csSerienWaechter";

/** Öffnungs-Einheit je Serie auf `cs` (= `cs-qwerty`), GEMESSEN - ändert sich eine Zeile, neu lesen und eintragen. */
const OEFFNET: Readonly<Record<string, string>> = {
  "cs-kids-1-klicek-od-olse": "´",
  "cs-kids-1-zrcadla-na-petrine": "g",
  "cs-kids-1-kuna-pod-poklickami": "ú",
  "cs-kids-1-stika-z-rozmberka": "ú",
  "cs-kids-1-rys-u-pramene": "ˇ",
  "cs-kids-1-brok-a-dudy": "´",
  "cs-kids-1-poharek-u-vridla": "ú",
  "cs-kids-1-vodopad-v-soutesce": "ˇ",
  "cs-kids-1-micka-a-modra-koralka": "´",
  "cs-kids-1-krakonosova-hul": "ú",
  "cs-kids-1-cerne-hribe": "ú",
  "cs-kids-1-had-z-ponozek": "ˇ",
  "cs-kids-1-svitici-chodba": "ú",
  "cs-kids-1-kapka-v-jeskyni": "ˇ",
  "cs-kids-1-klobouk-a-labut": "ˇ",
  "cs-kids-1-vonava-svacina": "ˇ",
  "cs-kids-1-kdo-kvili-na-pradedu": "ˇ",
  "cs-kids-1-frgal-a-koza": "g",
  "cs-kids-1-zelvi-hadanka": "ˇ",
  "cs-kids-1-usi-ze-stramberka": "ú",
};

/** Diakritik-Verdachtsfälle, gelesen und richtig (Wort ⇒ warum). */
const DIAKRITIK_GELESEN: Readonly<Record<string, string>> = {
  teto: "Vok. von teta (Tante) - nicht této",
};

csSerienWaechter({
  stufe: "kids",
  serien: SERIEN_CS_KIDS_1,
  form: { erlaubt: /^[A-Za-záčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚÝŽ .,;:?!"]+$/u, minWoerter: 4, maxWoerter: 16 },
  minZeilen: 12,
  maxZeilen: 16,
  ziffern: "keine",
  oeffnetGemessen: OEFFNET,
  diakritikGelesen: DIAKRITIK_GELESEN,
  guteZeile: '"Pojď se podívat!" volá Ema na Ondru.',
});
