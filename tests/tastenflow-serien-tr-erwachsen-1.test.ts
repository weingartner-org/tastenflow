/**
 * ★★★ Wächter TR-S Erwachsene (09.10.2026): die ersten TÜRKISCHEN Serien für Erwachsene (`serienTrErwachsen1.ts`), eingehängt über
 * `serienTr.ts` → `SERIEN_TR` → `SERIEN`. Aufbau und Regeln: `helfer/trSerienWaechter.ts` (Form · eingehängt · Tastaturen
 * und Öffnung · Grosswörter auch gekürzt · Feste, Politik, Geschlecht, Etikett · Wortschatz mit Belegen · Kopien, Paare,
 * fast gleich · sieben Regionen), Regeln `helfer/trSerienRegeln.ts`, Belege `helfer/trSerienBelege.ts`.
 * Befund: `BEFUND-2026-10-09-TR-SERIEN-1.md`. Vorbild: `tastenflow-serien-it-erwachsen-1.test.ts`.
 *
 * Die Öffnungs-Einheit unten ist GEMESSEN (09.10.2026, `tr-q`): ab ihr wird jede Zeile der Serie (gekürzt) serviert.
 * „'" (33) = die Serie trägt einen Namen mit Endung, „^" (34) = â î û (rüzgâr, kâğıt, hâlâ), „w" (35) = ein Fremdwort.
 * Ändert sich eine Zeile, muss die Öffnung neu gelesen und hier eingetragen werden.
 */
import { describe } from "vitest";
import { SERIEN_TR_ERWACHSEN_1 } from "../src/lib/typing/serienTrErwachsen1";
import { trSerienWaechter } from "./helfer/trSerienWaechter";

describe("TR-S Erwachsene", () => {
  trSerienWaechter({
    name: "TR-S Erwachsene",
    charge: SERIEN_TR_ERWACHSEN_1,
    stufe: "erwachsen",
    vorsilbe: "tr-erwachsen-1-",
    zeilen: 615,
    minZeilenJeEtappe: 15,
    maxZeilenJeEtappe: 15,
    oeffnet: {
      "tr-erwachsen-1-hattin-ucundaki-ses": "'",
      "tr-erwachsen-1-altmis-ucunde-on-parmak": "'",
      "tr-erwachsen-1-aycicegi-tarlasi": "'",
      "tr-erwachsen-1-kavrulmus-cekirdek": "^",
      "tr-erwachsen-1-zeytin-hasadi": "^",
      "tr-erwachsen-1-buldan-tezgahi": "^",
      "tr-erwachsen-1-sezon-bitince": "^",
      "tr-erwachsen-1-don-gecesi": "^",
      "tr-erwachsen-1-firin-yeniden": "^",
      "tr-erwachsen-1-bir-randevu": "^",
      "tr-erwachsen-1-ovadaki-cukur": "'",
      "tr-erwachsen-1-pastirma-dukkani": "^",
      "tr-erwachsen-1-cay-kooperatifi": "^",
      "tr-erwachsen-1-amasra-limani": "^",
      "tr-erwachsen-1-kafkas-arilari": "'",
      "tr-erwachsen-1-koy-okulunda-kis": "'",
      "tr-erwachsen-1-dag-rehberi": "^",
      "tr-erwachsen-1-antep-mutfagi": "^",
      "tr-erwachsen-1-tas-evde-ofis": "'",
      "tr-erwachsen-1-donmek-mi-kalmak-mi": "'",
    },
  });
});
