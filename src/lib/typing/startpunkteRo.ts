/**
 * ★ G3c-VERTEILER (25.10.2026): DIE NAMEN DER STARTPUNKTE IN RUMÄNISCH (Einhängepunkt, seit F4 gefüllt).
 *
 * Vorbild `startpunkteCs.ts`: dieselben sieben Landmarken (`units`, `key`) wie `startPoints` (`letters.ts`), nur die Beschriftung in der
 * Sprache. Namen nach dem Glossar (iCloud `sprachen-2026-10-25/glossar/`): Grundstellung, Grundreihe, Grossbuchstaben, Satzzeichen, Ziffern,
 * Sonderzeichen; kein Personenwort für „Anfänger" (Hausregel). Verteiler: `startpunkteIt.ts#startPunkte` (`STARTPUNKTE_GERUEST`).
 * Wächter: `tests/tastenflow-lernweg-ro-reihenfolge.test.ts` §6 (Zählung je Landmarke und die Namen).
 *
 * ★★★ F4-RO (25.10.2026): die sieben Namen stehen. Namen nach dem Glossar (`glossar/GLOSSAR-ro.md` Zeile „Startpunkte - Werte", §2.1: *șirul de bază*, *majuscule*, *punctuație*, *cifre*, *simboluri*); kein Personenwort („De la zero" statt „Începător").
 */
import type { Lernweg } from "./lernweg";
import { startPoints, type StartPoint } from "./letters";

/** Die Grundreihe aus dem englischen Namen („Home position (whole home row f j d k ...)"). */
function reiheAus(label: string): string {
  return /\(whole home row (.*)\)$/.exec(label)?.[1] ?? "";
}

/** Die sieben Namen je Landmarke (`key` aus `startPoints`: anfaenger, start, gross, buchstaben, satz, zahlen, alles). */
function nameRo(key: string, reihe: string): string | null {
  switch (key) {
    case "anfaenger":
      return "De la zero: doar F și J";
    case "start":
      return `Șirul de bază (${reihe})`;
    case "gross":
      return "Primele litere și majusculele";
    case "buchstaben":
      return "Toate literele (cu majuscule)";
    case "satz":
      return "+ punctuație";
    case "zahlen":
      return "+ cifre";
    case "alles":
      return "Tot (și simbolurile)";
    default:
      return null;
  }
}

/** Die Startpunkte mit Namen in Rumänisch - dieselben Einheiten wie {@link startPoints}. */
export function startPointsRo(lernweg: Lernweg): StartPoint[] {
  const en = startPoints("en", lernweg);
  const reihe = reiheAus(en.find((p) => p.key === "start")?.label ?? "");
  return en.map((p) => ({ ...p, label: nameRo(p.key, reihe) ?? p.label }));
}
