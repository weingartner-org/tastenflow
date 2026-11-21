/**
 * ★ G3c-VERTEILER (25.10.2026): DIE NAMEN DER STARTPUNKTE IN SCHWEDISCH (Einhängepunkt; Namen seit F4-PT-BR-SV, 25.10.2026).
 *
 * Vorbild `startpunkteCs.ts`: dieselben sieben Landmarken (`units`, `key`) wie `startPoints` (`letters.ts`), nur die Beschriftung in der
 * Sprache. Namen nach dem Glossar (iCloud `sprachen-2026-10-25/glossar/`): Grundstellung, Grundreihe, Grossbuchstaben, Satzzeichen, Ziffern,
 * Sonderzeichen; kein Personenwort für „Anfänger" (Hausregel). Verteiler: `startpunkteIt.ts#startPunkte` (`STARTPUNKTE_GERUEST`).
 * Wächter: `tests/tastenflow-lernweg-sv-reihenfolge.test.ts` §8 (Vorbild cs: Zählung je Landmarke).
 *
 * ★ F4-PT-BR-SV (25.10.2026): die Namen nach `GLOSSAR-sv.md` (Zeile „Startpunkte"; Grundstellung *grundställning*, Grundreihe
 * *grundraden*) - statt „Nybörjare" (ein Personenwort, Hausregel) „Från början". Die Einheiten kommen aus der eigenen Reihenfolge.
 */
import type { Lernweg } from "./lernweg";
import { startPoints, type StartPoint } from "./letters";

/** Die Grundreihe aus dem englischen Namen („Home position (whole home row f j d k ...)"). */
function reiheAus(label: string): string {
  return /\(whole home row (.*)\)$/.exec(label)?.[1] ?? "";
}

/** Die sieben Namen je Landmarke (`key` aus `startPoints`: anfaenger, start, gross, buchstaben, satz, zahlen, alles). */
function nameSv(key: string, reihe: string): string | null {
  switch (key) {
    case "anfaenger":
      return "Från början: bara F och J";
    case "start":
      return `Grundställning (hela grundraden: ${reihe})`;
    case "gross":
      return "Första bokstäverna och stora bokstäver";
    case "buchstaben":
      return "Alla bokstäver (även stora)";
    case "satz":
      return "Med skiljetecken";
    case "zahlen":
      return "Med siffror";
    case "alles":
      return "Allt (även specialtecken)";
    default:
      return null;
  }
}

/** Die Startpunkte mit Namen in Schwedisch - dieselben Einheiten wie {@link startPoints}. */
export function startPointsSv(lernweg: Lernweg): StartPoint[] {
  const en = startPoints("en", lernweg);
  const reihe = reiheAus(en.find((p) => p.key === "start")?.label ?? "");
  return en.map((p) => ({ ...p, label: nameSv(p.key, reihe) ?? p.label }));
}
