/**
 * ★ G3c-VERTEILER (25.10.2026): DIE NAMEN DER STARTPUNKTE IN UNGARISCH (Einhängepunkt, seit F4 gefüllt).
 *
 * Vorbild `startpunkteCs.ts`: dieselben sieben Landmarken (`units`, `key`) wie `startPoints` (`letters.ts`), nur die Beschriftung in der
 * Sprache. Namen nach dem Glossar (iCloud `sprachen-2026-10-25/glossar/`): Grundstellung, Grundreihe, Grossbuchstaben, Satzzeichen, Ziffern,
 * Sonderzeichen; kein Personenwort für „Anfänger" (Hausregel). Verteiler: `startpunkteIt.ts#startPunkte` (`STARTPUNKTE_GERUEST`).
 * Wächter: `tests/tastenflow-lernweg-hu-reihenfolge.test.ts` §6 (Zählung je Landmarke und die Namen).
 *
 * ★★★ F4-HU (25.10.2026): die sieben Namen stehen. Namen nach dem Glossar (`glossar/GLOSSAR-hu.md` Zeile „Startpunkte", §2.1: *alapállás*, *alapsor*, *nagybetű*, *írásjel*, *szám*, *szimbólum*); „Kezdő" ist dort so festgelegt.
 */
import type { Lernweg } from "./lernweg";
import { startPoints, type StartPoint } from "./letters";

/** Die Grundreihe aus dem englischen Namen („Home position (whole home row f j d k ...)"). */
function reiheAus(label: string): string {
  return /\(whole home row (.*)\)$/.exec(label)?.[1] ?? "";
}

/** Die sieben Namen je Landmarke (`key` aus `startPoints`: anfaenger, start, gross, buchstaben, satz, zahlen, alles). */
function nameHu(key: string, reihe: string): string | null {
  switch (key) {
    case "anfaenger":
      return "Kezdő: csak F és J";
    case "start":
      return `Alapállás (a teljes alapsor: ${reihe})`;
    case "gross":
      return "Első betűk + nagybetűk";
    case "buchstaben":
      return "Minden betű (nagybetűkkel)";
    case "satz":
      return "+ írásjelek";
    case "zahlen":
      return "+ számok";
    case "alles":
      return "Minden (szimbólumokkal is)";
    default:
      return null;
  }
}

/** Die Startpunkte mit Namen in Ungarisch - dieselben Einheiten wie {@link startPoints}. */
export function startPointsHu(lernweg: Lernweg): StartPoint[] {
  const en = startPoints("en", lernweg);
  const reihe = reiheAus(en.find((p) => p.key === "start")?.label ?? "");
  return en.map((p) => ({ ...p, label: nameHu(p.key, reihe) ?? p.label }));
}
