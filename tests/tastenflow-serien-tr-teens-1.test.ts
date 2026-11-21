/**
 * ★★★ Wächter TR-S Jugendliche 12-16 (09.10.2026): die ersten TÜRKISCHEN Serien für Jugendliche 12-16 (`serienTrTeens1.ts`), eingehängt über
 * `serienTr.ts` → `SERIEN_TR` → `SERIEN`. Aufbau und Regeln: `helfer/trSerienWaechter.ts` (Form · eingehängt · Tastaturen
 * und Öffnung · Grosswörter auch gekürzt · Feste, Politik, Geschlecht, Etikett · Wortschatz mit Belegen · Kopien, Paare,
 * fast gleich · sieben Regionen), Regeln `helfer/trSerienRegeln.ts`, Belege `helfer/trSerienBelege.ts`.
 * Befund: `BEFUND-2026-10-09-TR-SERIEN-1.md`. Vorbild: `tastenflow-serien-it-teens-1.test.ts`.
 *
 * Die Öffnungs-Einheit unten ist GEMESSEN (09.10.2026, `tr-q`): ab ihr wird jede Zeile der Serie (gekürzt) serviert.
 * „'" (33) = die Serie trägt einen Namen mit Endung, „^" (34) = â î û (rüzgâr, kâğıt, hâlâ), „w" (35) = ein Fremdwort.
 * Ändert sich eine Zeile, muss die Öffnung neu gelesen und hier eingetragen werden.
 */
import { describe } from "vitest";
import { SERIEN_TR_TEENS_1 } from "../src/lib/typing/serienTrTeens1";
import { trSerienWaechter } from "./helfer/trSerienWaechter";

describe("TR-S Jugendliche 12-16", () => {
  trSerienWaechter({
    name: "TR-S Jugendliche",
    charge: SERIEN_TR_TEENS_1,
    stufe: "teens",
    vorsilbe: "tr-teens-1-",
    zeilen: 613,
    minZeilenJeEtappe: 14,
    maxZeilenJeEtappe: 15,
    oeffnet: {
      "tr-teens-1-robot-takimi": "'",
      "tr-teens-1-iki-kita-arasinda": "^",
      "tr-teens-1-uludagda-ilk-kar": "w",
      "tr-teens-1-korfezin-sesi": "'",
      "tr-teens-1-alacatida-ruzgar": "^",
      "tr-teens-1-mavi-cini": "^",
      "tr-teens-1-kasta-dalis": "^",
      "tr-teens-1-tantuni-kanali": "^",
      "tr-teens-1-salda-golu": "'",
      "tr-teens-1-satranc-turnuvasi": "'",
      "tr-teens-1-pedal-atolyesi": "'",
      "tr-teens-1-baglamanin-teli": "^",
      "tr-teens-1-kemence-ve-rap": "^",
      "tr-teens-1-sahadaki-kizlar": "'",
      "tr-teens-1-yedigollerde-sonbahar": "'",
      "tr-teens-1-kayisi-sepeti": "'",
      "tr-teens-1-inci-kefalinin-yolu": "^",
      "tr-teens-1-bakirin-ritmi": "^",
      "tr-teens-1-dikili-taslar": "^",
      "tr-teens-1-iki-dilde-siir": "^",
    },
  });
});
