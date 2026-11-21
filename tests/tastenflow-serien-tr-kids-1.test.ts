/**
 * ★★★ Wächter TR-S Kinder 8-11 (09.10.2026): die ersten TÜRKISCHEN Serien für Kinder 8-11 (`serienTrKids1.ts`), eingehängt über
 * `serienTr.ts` → `SERIEN_TR` → `SERIEN`. Aufbau und Regeln: `helfer/trSerienWaechter.ts` (Form · eingehängt · Tastaturen
 * und Öffnung · Grosswörter auch gekürzt · Feste, Politik, Geschlecht, Etikett · Wortschatz mit Belegen · Kopien, Paare,
 * fast gleich · sieben Regionen), Regeln `helfer/trSerienRegeln.ts`, Belege `helfer/trSerienBelege.ts`.
 * Befund: `BEFUND-2026-10-09-TR-SERIEN-1.md`. Vorbild: `tastenflow-serien-it-kids-1.test.ts`.
 *
 * Die Öffnungs-Einheit unten ist GEMESSEN (09.10.2026, `tr-q`): ab ihr wird jede Zeile der Serie (gekürzt) serviert.
 * „'" (33) = die Serie trägt einen Namen mit Endung, „^" (34) = â î û (rüzgâr, kâğıt, hâlâ), „w" (35) = ein Fremdwort.
 * Ändert sich eine Zeile, muss die Öffnung neu gelesen und hier eingetragen werden.
 */
import { describe } from "vitest";
import { SERIEN_TR_KIDS_1 } from "../src/lib/typing/serienTrKids1";
import { trSerienWaechter } from "./helfer/trSerienWaechter";

describe("TR-S Kinder 8-11", () => {
  trSerienWaechter({
    name: "TR-S Kinder",
    charge: SERIEN_TR_KIDS_1,
    stufe: "kids",
    vorsilbe: "tr-kids-1-",
    zeilen: 616,
    minZeilenJeEtappe: 15,
    maxZeilenJeEtappe: 16,
    oeffnet: {
      "tr-kids-1-sapkadaki-kagit": "^",
      "tr-kids-1-karagozun-golgesi": "^",
      "tr-kids-1-ruzgarin-adlari": "^",
      "tr-kids-1-asansorun-merdivenleri": "'",
      "tr-kids-1-kumdaki-yuva": "^",
      "tr-kids-1-beyaz-basamaklar": "'",
      "tr-kids-1-gul-sabahi": "'",
      "tr-kids-1-uzayan-dondurma": "^",
      "tr-kids-1-kunefe-yarismasi": "'",
      "tr-kids-1-balonlar-uyaninca": "^",
      "tr-kids-1-beyaz-tasin-sirri": "'",
      "tr-kids-1-kasiga-kirk-manti": "^",
      "tr-kids-1-yaylaya-goc": "'",
      "tr-kids-1-sisin-icinde": "^",
      "tr-kids-1-en-kuzeydeki-fener": "'",
      "tr-kids-1-bir-mavi-bir-sari": "^",
      "tr-kids-1-buzun-ustunde-kizak": "^",
      "tr-kids-1-gumus-teller": "^",
      "tr-kids-1-on-gozlu-kopru": "'",
      "tr-kids-1-nineme-mektup": "'",
    },
  });
});
